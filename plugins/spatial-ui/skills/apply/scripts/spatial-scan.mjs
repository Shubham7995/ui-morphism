#!/usr/bin/env node
/**
 * spatial-scan.mjs — spatial-UI-specific static invariants.
 *
 * Source of truth: docs/10-spatial-ui.md §13 (the validation checklist the skill
 * self-runs, and the anti-pattern list it refuses to generate), §6 (what may and
 * may not animate, and the reduced-motion detach), §7 (SC 2.5.7, forced-colors
 * flattening, target sizing from tokens) and §8 (the layer, backdrop-filter and
 * GPU-memory budgets).
 *
 * SCOPE. This script checks only what is specific to this style and mechanical
 * enough to be got wrong by accident:
 *
 *   - the SC 2.5.7 dragging alternative — the criterion this style breaks most
 *     reliably, and the one nobody discusses
 *   - `perspective` on html / body / :root, and `position: fixed` written as a
 *     textual descendant of an element that establishes a containing block
 *   - the depth ladder: quantisation, and the counter-scale that must accompany
 *     every rung
 *   - `transform-style: preserve-3d` nesting and preserve-3d on a scroller
 *   - the backdrop-filter census, and backdrop-filter on animated or repeated
 *     elements
 *   - transitions and keyframes that interpolate backdrop-filter, perspective,
 *     width or height
 *   - permanent `will-change`
 *   - the reduced-motion listener detach
 *   - forced-colors flattening — `perspective: none` and `transform: none`
 *   - text planes rotated past 12 degrees
 *   - interactive sizes written as literals instead of from the target tokens
 *   - the GPU layer-memory estimate
 *
 * It computes NO contrast, NO luminance, NO alpha composite, NO focus-visible
 * check, NO target-size verdict and NO forced-colors keyword audit. Those are
 * the nine universal checks and they belong to ui-morphism-core:a11y-validate,
 * which is the single implementation in this marketplace. Do not add them here.
 *
 * WHAT IT CANNOT SEE, stated so a green run is not read as more than it is.
 * Every check below is textual. Three of the doc's constraints are DOM
 * questions and are reported as census plus a manual procedure rather than as a
 * pass: whether a `position: fixed` element is actually rendered inside a
 * perspective subtree, how deep `preserve-3d` contexts actually nest at runtime,
 * and how many blurred surfaces are actually on screen at once. The audit skill
 * carries all three as Manual TODOs.
 *
 * The CSS-shaped parser is a copy of the one in glassmorphism-ui's glass-scan,
 * not an import: a plugin may not reference a file in another plugin, and a
 * substitution variable does not cross a plugin boundary. Copied deliberately,
 * with the divergence limited to the checks below.
 *
 * Usage:
 *   node spatial-scan.mjs [path ...] [--json] [--quiet] [--no-fail]
 *
 * Exit code 1 when any error-severity finding is present, 0 otherwise
 * (suppressed by --no-fail).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, resolve } from "node:path";

const SCANNABLE = new Set([
  ".css", ".scss", ".sass", ".less", ".pcss", ".postcss",
  ".html", ".htm", ".vue", ".svelte", ".astro",
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".swift", ".kt", ".kts",
]);

const SKIP_DIRS = new Set([
  "node_modules", ".git", ".next", ".nuxt", ".svelte-kit",
  "dist", "build", "out", "coverage", "vendor", "target", ".turbo", ".cache",
]);

/* The six-step ladder, doc §3 and §4: Android XR SpatialElevationLevel in dp,
   mapped 1:1 to px. --sp-z-0 is a 0.1px sentinel that forces a stacking context
   rather than expressing a distance. `depthScale` multiplies steps 1-5 before
   the CSS is written, so a LITERAL cannot be checked against the resolved rungs
   at all — which is why a literal on the base ladder is still a warning. */
const BASE_LADDER = [0.1, 16, 24, 32, 40, 56];
const FIRST_RUNG = 16;

/* Doc §8: layer memory is width x height x 4 bytes; one full-viewport 1440x900
   layer costs 4.94 MiB, the budget is 96 MiB, and the layer cap is 25. */
const MIB_PER_LAYER = 4.94;
const MIB_BUDGET = 96;
const LAYER_BUDGET = 25;
const BACKDROP_BUDGET = 6;      /* §8: concurrent backdrop-filter surfaces */
const PRESERVE_3D_BUDGET = 3;   /* §8: nested preserve-3d contexts */
const MAX_TEXT_PLANE_DEG = 12;  /* §13: text planes past this lose legibility */

/* Properties whose non-`none` value makes an element a containing block for
   `position: fixed` descendants. Doc §8 names perspective; recipes.md §8 notes
   the rule is not specific to it. */
const CONTAINING_BLOCK_PROPS = new Set([
  "perspective", "transform", "filter", "backdrop-filter", "-webkit-backdrop-filter",
]);

/* Properties that must never be interpolated. Doc §6. The regex reads a
   `transition` / `animation` value; the set reads a declaration inside
   `@keyframes`. */
const UNANIMATABLE = /(^|[\s,(])(backdrop-filter|-webkit-backdrop-filter|perspective|width|height)([\s,)]|$)/i;
const NEVER_INTERPOLATE = new Set([
  "backdrop-filter", "-webkit-backdrop-filter", "perspective", "width", "height",
]);

/* Selector shapes that mean "this rule matches many elements at once", where a
   backdrop-filter is doc §13's refusal rather than a budget line. */
const REPEATED_SELECTOR = /(^|[\s>+~,])(li|tr|td|th|option)\b|:nth-|\[role=["']?(listitem|row|gridcell|option)["']?\]|>\s*\*/i;

/* Interaction states and explicit animation hooks. A `will-change` inside one of
   these is scoped; outside them it is permanent. Doc §8: add the class on
   pointerenter, remove it on transitionend. */
const SCOPED_HOOK = /:(hover|focus|focus-visible|focus-within|active|target)\b|\[data-[a-z-]*(anim|drag|lift|move|transition|tilt)/i;

/* Selectors that carry an interactive control, for the token-discipline check. */
const INTERACTIVE_SELECTOR = /(^|[\s>+~,.#\[])(button|a|input|select|textarea|summary)([\s.:#\[,>+~]|$)|btn|chip|pill|toggle|switch|tab\b|control|\[role=["']?(button|tab|link|menuitem|switch|checkbox|radio)["']?\]/i;

const SIZE_PROPS = new Set(["min-height", "min-width", "height", "width", "block-size", "inline-size"]);

/* ------------------------------------------------------------------ parser */

/**
 * A deliberately small CSS-shaped parser. It runs over stylesheets and over
 * JS/TS files alike: backticks are NOT treated as string delimiters, so CSS
 * held in a template literal is parsed like any other sheet. Quoted strings and
 * comments are skipped, so a url("x{y.png") cannot desynchronise the brace
 * stack.
 */
export function parse(text) {
  const root = { type: "root", prelude: "", line: 1, decls: [], children: [], parent: null };
  const stack = [root];
  let buf = "";
  let bufLine = 1;
  let line = 1;

  const top = () => stack[stack.length - 1];

  const pushChar = (ch) => {
    if (buf.trim() === "" && !/\s/.test(ch)) bufLine = line;
    buf += ch;
  };

  const flushDecl = () => {
    const raw = buf.trim();
    buf = "";
    if (!raw) return;
    const ci = raw.indexOf(":");
    if (ci <= 0) return;
    const prop = raw.slice(0, ci).trim().toLowerCase();
    if (!/^-{0,2}[a-z][a-z0-9-]*$/.test(prop)) return;
    top().decls.push({ prop, value: raw.slice(ci + 1).trim(), line: bufLine });
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === "\n") { line++; pushChar(" "); continue; }

    if (ch === "/" && text[i + 1] === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) {
        if (text[i] === "\n") line++;
        i++;
      }
      i++;
      continue;
    }

    /* Line comment, but never inside a URL scheme ("https://"). */
    if (ch === "/" && text[i + 1] === "/" && text[i - 1] !== ":") {
      while (i + 1 < text.length && text[i + 1] !== "\n") i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      pushChar(ch);
      i++;
      while (i < text.length && text[i] !== quote) {
        if (text[i] === "\\") { pushChar(text[i]); i++; }
        if (i >= text.length) break;
        if (text[i] === "\n") line++;
        pushChar(text[i]);
        i++;
      }
      pushChar(quote);
      continue;
    }

    if (ch === "{") {
      const prelude = buf.trim().replace(/\s+/g, " ");
      buf = "";
      const node = {
        type: prelude.startsWith("@") ? "atrule" : "rule",
        prelude,
        line: bufLine,
        decls: [],
        children: [],
        parent: top(),
      };
      top().children.push(node);
      stack.push(node);
      continue;
    }

    if (ch === "}") {
      flushDecl();
      if (stack.length > 1) stack.pop();
      continue;
    }

    if (ch === ";") { flushDecl(); continue; }

    pushChar(ch);
  }

  flushDecl();
  return root;
}

/**
 * The source with comments removed, for the file-level regex checks. Quoted
 * strings survive. A check a comment can satisfy is not a check: a file that
 * *mentions* removeEventListener in prose has not detached anything.
 */
function stripComments(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === "/" && text[i + 1] === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) {
        if (text[i] === "\n") out += "\n";
        i++;
      }
      i++;
      continue;
    }

    if (ch === "/" && text[i + 1] === "/" && text[i - 1] !== ":") {
      while (i + 1 < text.length && text[i + 1] !== "\n") i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      out += ch;
      i++;
      while (i < text.length && text[i] !== quote) {
        if (text[i] === "\\" && i + 1 < text.length) { out += text[i]; i++; }
        out += text[i];
        i++;
      }
      out += quote;
      continue;
    }

    out += ch;
  }
  return out;
}

function walk(node, fn) {
  for (const child of node.children) {
    fn(child);
    walk(child, fn);
  }
}

function ancestors(node) {
  const out = [];
  let p = node.parent;
  while (p) { out.push(p); p = p.parent; }
  return out;
}

/* ------------------------------------------------------------- rule helpers */

const isNone = (v) => /^none$/i.test(v.trim());

/**
 * One simple selector reduced to the element it names: pseudo-classes,
 * pseudo-elements, attribute filters and BEM modifiers removed, so
 * `.sp-stage[data-tilt="on"]:hover` and `.sp-stage--wide` both normalise to
 * `.sp-stage`. It is the same element; a declaration on one of them lands on
 * the same box as a declaration on another.
 */
function normalise(part) {
  return part
    .replace(/\[[^\]]*\]/g, "")
    .replace(/::?[a-z-]+(\([^)]*\))?/gi, "")
    .split("--")[0];
}

/**
 * The SUBJECT of each compound — the last simple selector, which is the element
 * the declarations actually land on. `.a .b { transform-style: preserve-3d }`
 * gives `.b` a 3D context, not `.a`, and reading the first selector instead is
 * how a nesting count comes out one when it is four.
 */
function subjectSelectors(prelude) {
  return prelude
    .split(",")
    .map((s) => {
      const parts = s.trim().split(/[\s>+~]+/).filter(Boolean);
      return normalise(parts[parts.length - 1] || "");
    })
    .filter(Boolean);
}

/** Every simple selector that appears in an ANCESTOR position in this prelude. */
function ancestorSelectors(prelude) {
  const out = [];
  for (const compound of prelude.split(",")) {
    const parts = compound.trim().split(/[\s>+~]+/).filter(Boolean);
    for (const part of parts.slice(0, -1)) {
      const bare = normalise(part);
      if (bare) out.push(bare);
    }
  }
  return out;
}

function endsInPseudoElement(prelude) {
  return prelude
    .split(",")
    .every((s) => /(::(before|after|backdrop|marker|placeholder|selection|first-line|first-letter)|:(before|after))\s*$/i.test(s.trim()));
}

function chain(node) {
  return [node, ...ancestors(node)];
}

function inAtRule(node, re) {
  return chain(node).some((a) => a.type === "atrule" && re.test(a.prelude));
}

/** The most useful human label for a declaration's owning block. */
function contextLabel(node) {
  const c = chain(node);
  const rule = c.find((n) => n.type === "rule");
  if (rule) return rule.prelude;
  const named = c.find((n) => n.type === "atrule" && !/^@(supports|media|keyframes|layer|container)\b/i.test(n.prelude));
  return (named || node).prelude;
}

/* ------------------------------------------------------- transform grammar */

/** Split a function argument list on top-level commas. */
function splitArgs(inner) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of inner) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Every `name(...)` call in a value, with balanced-paren argument capture. */
export function functionCalls(value) {
  const out = [];
  for (let i = 0; i < value.length; i++) {
    const m = /^([a-zA-Z][a-zA-Z0-9]*)\(/.exec(value.slice(i));
    if (!m) continue;
    let depth = 0;
    let j = i + m[1].length;
    const start = j + 1;
    for (; j < value.length; j++) {
      if (value[j] === "(") depth++;
      else if (value[j] === ")") { depth--; if (depth === 0) break; }
    }
    out.push({ name: m[1], args: splitArgs(value.slice(start, j)) });
    i = j;
  }
  return out;
}

const LENGTH = /^(-?\d*\.?\d+)px$/i;
const ANGLE = /^(-?\d*\.?\d+)(deg|rad|grad|turn)$/i;

function lengthPx(arg) {
  const m = LENGTH.exec(arg.trim());
  return m ? parseFloat(m[1]) : null;
}

function angleDeg(arg) {
  const m = ANGLE.exec(arg.trim());
  if (!m) return null;
  const v = parseFloat(m[1]);
  switch (m[2].toLowerCase()) {
    case "rad": return (v * 180) / Math.PI;
    case "grad": return v * 0.9;
    case "turn": return v * 360;
    default: return v;
  }
}

const LADDER_TOKEN = /var\(\s*--(sp-z-[1-5]|um-spatial-elev-[1-5])\b/i;

/**
 * The z components of a transform value, each classified as a ladder token, a
 * literal length, or something a static reader cannot resolve.
 */
export function zComponents(value) {
  const out = [];
  for (const call of functionCalls(value)) {
    const n = call.name.toLowerCase();
    let arg = null;
    if (n === "translatez") arg = call.args[0];
    else if (n === "translate3d") arg = call.args[2];
    else continue;
    if (arg === undefined || arg === null) continue;
    if (LADDER_TOKEN.test(arg)) { out.push({ kind: "token", raw: arg, px: null }); continue; }
    const px = lengthPx(arg);
    if (px !== null) { out.push({ kind: "literal", raw: arg, px }); continue; }
    if (/^0$/.test(arg.trim())) { out.push({ kind: "literal", raw: arg, px: 0 }); continue; }
    out.push({ kind: "opaque", raw: arg, px: null });
  }
  return out;
}

/** Literal out-of-plane rotations, in degrees. In-plane `rotate()` is excluded:
 *  it turns the glyphs, it does not tilt the plane they sit on. */
export function planeRotations(value) {
  const out = [];
  for (const call of functionCalls(value)) {
    const n = call.name.toLowerCase();
    if (n === "rotatex" || n === "rotatey") {
      const d = angleDeg(call.args[0] || "");
      if (d !== null) out.push({ fn: call.name, deg: d });
    } else if (n === "rotate3d") {
      const [x, y, , a] = call.args;
      const d = angleDeg(a || "");
      if (d === null) continue;
      const ax = parseFloat(x), ay = parseFloat(y);
      if ((Number.isFinite(ax) && ax !== 0) || (Number.isFinite(ay) && ay !== 0)) {
        out.push({ fn: call.name, deg: d });
      }
    }
  }
  return out;
}

const hasScale = (value) => functionCalls(value).some((c) => /^scale(3d|x|y)?$/i.test(c.name));

const has3dTransform = (value) =>
  functionCalls(value).some((c) => /^(translatez|translate3d|rotatex|rotatey|rotate3d|perspective|matrix3d|scale3d)$/i.test(c.name));

/* ------------------------------------------------------------------- checks */

function scanFile(file, text, add, state) {
  const root = parse(text);
  const nodes = [];
  walk(root, (n) => nodes.push(n));

  for (const node of nodes) {
    if (node.type === "root") continue;
    const decls = node.decls;
    const label = contextLabel(node);
    const roots = subjectSelectors(node.prelude);
    const inKeyframes = inAtRule(node, /@keyframes/i);
    const inForcedColors = inAtRule(node, /forced-colors\s*:\s*active/i);

    for (const d of decls) {
      /* ---- 1. the camera, and where it may not go (§8, §13 step 9) ---- */
      if (d.prop === "perspective" && !isNone(d.value)) {
        if (/(^|[\s,>+~])(html|body|:root|\*)([\s,>+~]|$)/i.test(node.prelude)) {
          add("error", "camera-on-root", file, d.line,
            "`perspective` on `" + node.prelude + "`. A camera on html, body or :root makes every `position: fixed` element in the document a child of a containing block that is no longer the viewport, and the fixed chrome silently stops being fixed (doc §8, §10). Put the camera on one stage element that is a SIBLING of the fixed chrome.");
        } else {
          for (const r of roots) state.cameraSelectors.add(r);
        }
      }

      if (CONTAINING_BLOCK_PROPS.has(d.prop) && !isNone(d.value)) {
        for (const r of roots) state.containingBlockSelectors.add(r);
      }
      if (d.prop === "will-change" && /transform|filter|perspective/i.test(d.value)) {
        for (const r of roots) state.containingBlockSelectors.add(r);
      }

      /* ---- 2. the depth ladder and its counter-scale (§3, §5, §13) ---- */
      if (d.prop === "transform" && !isNone(d.value)) {
        const zs = zComponents(d.value);
        const scaled = hasScale(d.value);
        for (const z of zs) {
          const rung = z.kind === "token" || (z.kind === "literal" && z.px >= FIRST_RUNG);
          if (rung && !scaled) {
            add("error", "counter-scale", file, d.line,
              "`" + label + "` pushes to `" + z.raw + "` with no `scale()` in the same transform. Under a camera an element at z grows by `perspective / (perspective - z)`; the counter-scale `1 - z / perspective` is what cancels it. A translateZ without its counter-scale is a zoom, not a depth (doc §3, §5).");
          }
          if (z.kind !== "literal" || z.px === null) continue;
          if (z.px <= 0) continue;
          if (z.px < FIRST_RUNG) {
            add("info", "ladder-quantisation", file, d.line,
              "`" + label + "` uses a literal `" + z.raw + "`, below the first rung (16px). Read as a hover or press state delta — doc §6 puts those at plus or minus 8px of z — and exempt from the rung and counter-scale rules. If it was meant as a depth level, it is off the ladder.");
          } else if (BASE_LADDER.includes(z.px)) {
            add("warn", "ladder-quantisation", file, d.line,
              "`" + label + "` hard-codes `" + z.raw + "`. It is on the base ladder, but `depthScale` multiplies rungs 1-5 before the CSS is written, so a literal does not move with the ladder and its counter-scale and shadow pair go out of step. Use `var(--sp-z-N)`.");
          } else {
            add("error", "ladder-quantisation", file, d.line,
              "`" + label + "` uses `" + z.raw + "`, which is not a rung of the six-step ladder (0.1 / 16 / 24 / 32 / 40 / 56, the Android XR SpatialElevation dp values). Nothing lands between rungs (doc §3, §13 step 2).");
          }
        }

        /* ---- 3. text planes past 12 degrees (§13) ---- */
        for (const rot of planeRotations(d.value)) {
          const mag = Math.abs(rot.deg);
          if (mag <= MAX_TEXT_PLANE_DEG) continue;
          const decorative = node.type === "rule" && endsInPseudoElement(node.prelude);
          add(decorative ? "warn" : "error", "text-plane-rotation", file, d.line,
            "`" + label + "` rotates the plane by " + rot.deg + " degrees via `" + rot.fn + "()`, past the 12 degree ceiling. Subpixel antialiasing and legibility collapse beyond it (doc §13)." +
            (decorative ? " This selector is a pseudo-element, so it is decorative unless it carries text." : ""));
        }

        if (has3dTransform(d.value)) for (const r of roots) state.promoted.add(r);
      }

      /* ---- 4. preserve-3d (§8, §13) ---- */
      if (d.prop === "transform-style" && /preserve-3d/i.test(d.value)) {
        for (const r of roots) { state.preserve3d.add(r); state.promoted.add(r); }
        state.preserve3dRules.push({ file, line: d.line, prelude: node.prelude });
        const scroller = decls.find((x) =>
          /^overflow(-x|-y|-block|-inline)?$/.test(x.prop) && /\b(auto|scroll)\b/i.test(x.value));
        if (scroller) {
          add("error", "preserve-3d-scroller", file, d.line,
            "`" + label + "` sets `transform-style: preserve-3d` on a scrolling container (`" + scroller.prop + ": " + scroller.value + "`). Every transformed row becomes its own composited layer. Doc §8 and §13 make this a refusal, not a budget line.");
        }
      }

      /* ---- 5. backdrop-filter: census, repetition, animation (§8, §13) ---- */
      if ((d.prop === "backdrop-filter" || d.prop === "-webkit-backdrop-filter") && !isNone(d.value)) {
        if (d.prop === "backdrop-filter") {
          state.glassSurfaces.push({ file, line: d.line, selector: node.prelude });
          for (const r of roots) { state.glassRoots.add(r); state.promoted.add(r); }
        }
        if (REPEATED_SELECTOR.test(node.prelude)) {
          add("error", "backdrop-on-repeated", file, d.line,
            "`" + node.prelude + "` puts `backdrop-filter` on a repeated list or grid item. Each instance is a separate full backdrop read-back, and the count is whatever the data returns rather than whatever the design drew (doc §8, §13).");
        }
        if (inForcedColors) {
          add("error", "forced-colors-flatten", file, d.line,
            "`" + label + "` keeps a live `backdrop-filter` inside a `forced-colors: active` block. Doc §7 flattens the style completely there: no camera, no glass, real borders.");
        }
      }

      /* ---- 6. properties that must not be interpolated (§6) ---- */
      if (/^(transition|transition-property|animation|animation-name)$/.test(d.prop)) {
        if (UNANIMATABLE.test(d.value)) {
          add("error", "animated-property", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + label + "` interpolates a property doc §6 forbids. `backdrop-filter` re-rasterises its backdrop snapshot every frame, `perspective` recomputes the whole 3D containing block, and `width` / `height` are layout. Animate `transform` and `opacity`, and swap shadows at the endpoints.");
        } else if (/(^|[\s,])all([\s,]|$)/i.test(d.value)) {
          add("warn", "animated-property", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + label + "` transitions `all`, which silently includes `backdrop-filter` and `perspective`. Name the properties.");
        }
        const namesTransform = /transform/i.test(d.value) || /(^|[\s,])all([\s,]|$)/i.test(d.value);
        if (d.prop === "animation" || d.prop === "animation-name") {
          /* An `animation` shorthand names a keyframe set, not a property, so
             whether it moves the transform is only knowable once every
             @keyframes block has been read. Recorded now, resolved at the end. */
          state.animationDecls.push({ subjects: roots, value: d.value });
          if (namesTransform) for (const r of roots) state.continuousTransformRoots.add(r);
        } else if (namesTransform) {
          for (const r of roots) state.transitionTransformRoots.add(r);
        }
      }

      if (inKeyframes && d.prop === "transform" && !isNone(d.value)) {
        const owner = chain(node).find((n) => n.type === "atrule" && /@keyframes/i.test(n.prelude));
        const m = owner && /@keyframes\s+([\w-]+)/i.exec(owner.prelude);
        if (m) state.keyframeTransformNames.add(m[1]);
      }

      if (inKeyframes && NEVER_INTERPOLATE.has(d.prop) && !isNone(d.value)) {
        add("error", "animated-property", file, d.line,
          "`@keyframes` step sets `" + d.prop + "`, interpolating it across frames. Doc §6 puts `backdrop-filter` and `perspective` on the never-animate list, and `width` / `height` are layout.");
      }

      /* ---- 7. permanent will-change (§8, §13) ---- */
      if (d.prop === "will-change" && !isNone(d.value)) {
        for (const r of roots) state.promoted.add(r);
        if (!SCOPED_HOOK.test(node.prelude)) {
          add("error", "permanent-will-change", file, d.line,
            "`" + node.prelude + "` declares `will-change: " + d.value + "` with no interaction state or animation hook in the selector, so the promotion is permanent. Doc §8: pre-promoting every panel exhausts GPU memory on mid-range Android. Add the class on `pointerenter` and remove it on `transitionend`, or scope the rule to `:hover` / `:focus-within` / a `data-` state.");
        }
      }

      /* ---- 8. containing block: fixed written under a camera (§8) ---- */
      if (d.prop === "position" && /^(fixed|sticky)$/i.test(d.value.trim())) {
        const anc = ancestorSelectors(node.prelude);
        const hit = anc.find((a) => state.containingBlockSelectors.has(a) || state.cameraSelectors.has(a));
        if (hit) {
          add("error", "fixed-in-camera", file, d.line,
            "`" + node.prelude + "` sets `position: " + d.value + "` inside `" + hit + "`, which establishes a containing block — it declares a non-`none` `perspective`, `transform`, `filter` or `will-change` elsewhere in the scanned source. The element stops being fixed to the viewport. Doc §8 calls this the most common bug in spatial layouts: keep the stage a SIBLING of fixed chrome, never an ancestor.");
        }
        state.fixedRules.push({ file, line: d.line, prelude: node.prelude, value: d.value.trim() });
      }

      /* ---- 9. interactive size written as a literal (§7) ---- */
      if (SIZE_PROPS.has(d.prop) && INTERACTIVE_SELECTOR.test(node.prelude)) {
        const v = d.value.trim();
        if (/var\(|max\(|min\(|clamp\(|calc\(/i.test(v)) continue;
        if (lengthPx(v) === null) continue;
        add("error", "target-literal", file, d.line,
          "`" + node.prelude + "` sizes an interactive control with the literal `" + d.prop + ": " + v + "`. Doc §7: the failure mode in this style is the opposite of the usual one — nobody sets the token too low, somebody hard-codes a value on an orbiter button to keep the capsule slim and the literal beats the token. Size from `max(var(--sp-target-floor), var(--sp-target-pointer))`, and from `--sp-target-gaze` under `(pointer: coarse)`. Whether this particular value clears SC 2.5.8 is ui-morphism-core:a11y-validate's verdict, not this scanner's.");
      }
    }

    /* ---- 10. the forced-colors flattening block itself (§7) ---- */
    if (inForcedColors) {
      for (const d of decls) {
        if (d.prop === "perspective" && isNone(d.value)) state.forcedColors.perspectiveNone = true;
        if (d.prop === "transform" && isNone(d.value)) state.forcedColors.transformNone = true;
      }
    }
    if (node.type === "atrule" && /forced-colors\s*:\s*active/i.test(node.prelude)) {
      state.forcedColors.present = true;
    }
    if (node.type === "atrule" && /prefers-reduced-motion\s*:\s*reduce/i.test(node.prelude)) {
      state.reducedMotionQuery = true;
    }
  }

  /* ---- 11. CSS `resize`, the drag affordance nobody reads as one ---- */
  for (const node of nodes) {
    for (const d of node.decls) {
      if (d.prop === "resize" && !isNone(d.value)) {
        state.dragAffordances.push({ file, line: d.line, what: "resize: " + d.value, selector: node.prelude });
      }
    }
  }

  /* ---- 12. source-level signals: drag, parallax, keyboard, reset ---- */
  const code = stripComments(text);

  const DRAG_SIGNALS = [
    [/\buseDraggable\b|\breact-draggable\b|<Draggable\b|\bdnd-kit\b|\breact-rnd\b|<Rnd\b|\bMoveable\b|\binteract\s*\(/, "a drag library"],
    [/\bdraggable\s*[=:]\s*(["']?true["']?|\{true\})/, "draggable=true"],
    [/addEventListener\(\s*["']pointerdown["']|addEventListener\(\s*["']mousedown["']|onPointerDown\s*=|onMouseDown\s*=/, "a pointerdown/mousedown handler"],
    [/\.movable\s*\(|\.resizable\s*\(/, "a Compose XR movable()/resizable() modifier"],
    [/DragGesture\s*\(/, "a SwiftUI DragGesture"],
  ];
  for (const [re, what] of DRAG_SIGNALS) {
    const m = re.exec(code);
    if (!m) continue;
    /* A pointerdown handler is only a drag affordance when the surrounding
       source also talks about moving or resizing something. Every button in the
       world has a pointerdown. */
    if (what.includes("pointerdown") && !/\b(drag|resize|reposition|move[A-Z_]|onMove|panel(Move|Drag)|setPosition)/i.test(code)) continue;
    state.dragAffordances.push({
      file,
      line: code.slice(0, m.index).split("\n").length,
      what,
      selector: null,
    });
  }

  if (/\b(onKeyDown|onKeyUp|keydown|keyup|onKeyEvent|KeyEvent|ArrowUp|ArrowDown|ArrowLeft|ArrowRight)\b/.test(code)) {
    state.keyboardFiles.add(file);
  }
  /* A deliberately loose signal. `reset` anywhere in the source — `resetLayout`,
     `Reset layout`, `data-reset`, `onReset` — is taken as a candidate, because
     the finding fires only when there is NOTHING. Whether the control is
     reachable, labelled and actually restores the layout is a reading job, and
     the audit skill carries it as one. */
  if (/reset/i.test(code)) state.resetFiles.add(file);

  if (/addEventListener\(\s*["'](pointermove|mousemove)["']/.test(code)) state.parallaxListener.add(file);
  if (/removeEventListener\(\s*["'](pointermove|mousemove)["']/.test(code)) state.parallaxDetach.add(file);
  if (/onPointerMove\s*=|onMouseMove\s*=/.test(code)) state.parallaxJsx.add(file);
  if (/prefers-reduced-motion/.test(code) || /useReducedMotion|isReduceMotionEnabled|accessibilityReduceMotion/.test(code)) {
    state.reducedMotionSignal.add(file);
  }
  /* A `change` listener anywhere in a file that also calls `matchMedia`. The
     two are usually forty lines apart — the query is created at the top of the
     module and re-watched at the bottom — so proximity is not the test. */
  if (/matchMedia\s*\(/.test(code) &&
      (/addEventListener\(\s*["']change["']/.test(code) || /\.addListener\s*\(/.test(code))) {
    state.mediaQueryRewatch.add(file);
  }
  if (/animation-timeline\s*:\s*scroll\(/.test(code)) state.scrollTimeline.add(file);
}

/* ------------------------------------------------------------------- driver */

/**
 * Scan a set of already-read files.
 *
 * @param {{file: string, text: string}[]} inputs
 * @returns {{summary: object, glassSurfaces: object[], findings: object[]}}
 */
function freshState() {
  return {
    cameraSelectors: new Set(),
    containingBlockSelectors: new Set(),
    promoted: new Set(),
    preserve3d: new Set(),
    preserve3dRules: [],
    glassSurfaces: [],
    glassRoots: new Set(),
    continuousTransformRoots: new Set(),
    transitionTransformRoots: new Set(),
    animationDecls: [],
    keyframeTransformNames: new Set(),
    fixedRules: [],
    dragAffordances: [],
    keyboardFiles: new Set(),
    resetFiles: new Set(),
    parallaxListener: new Set(),
    parallaxDetach: new Set(),
    parallaxJsx: new Set(),
    reducedMotionSignal: new Set(),
    mediaQueryRewatch: new Set(),
    scrollTimeline: new Set(),
    reducedMotionQuery: false,
    forcedColors: { present: false, perspectiveNone: false, transformNone: false },
  };
}

export function scan(inputs) {
  const findings = [];
  const add = (severity, rule, file, line, message) =>
    findings.push({ file, line, severity, rule, message });

  /* Two passes over the same inputs, and the first one reports nothing. The
     containing-block set has to be complete before any `position: fixed` rule
     is adjudicated, because a stylesheet is free to declare the camera below
     the chrome that sits under it, and a one-pass reader would call that clean.
     Pass one collects; pass two, seeded with what pass one found, reports. */
  const discovery = freshState();
  for (const { file, text } of inputs) scanFile(file, text, () => {}, discovery);

  const state = freshState();
  state.cameraSelectors = discovery.cameraSelectors;
  state.containingBlockSelectors = discovery.containingBlockSelectors;
  for (const { file, text } of inputs) scanFile(file, text, add, state);

  /* -------------------------------------------------- project-level checks */

  /* Resolve `animation: <name> …` against the keyframe sets that actually move
     a transform. A shorthand carries a name, not a property, so this link is
     the difference between catching a continuous drift and missing it. */
  for (const decl of state.animationDecls) {
    for (const name of state.keyframeTransformNames) {
      if (!new RegExp("(^|[\\s,])" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([\\s,]|$)").test(decl.value)) continue;
      for (const s of decl.subjects) state.continuousTransformRoots.add(s);
    }
  }

  /* SC 2.5.7 Dragging Movements. Doc §7 and §13: the criterion this style
     breaks most reliably and the one nobody discusses. Two halves, reported
     separately so the fix is unambiguous — arrow-key nudging, and a visible
     reset control. */
  for (const drag of state.dragAffordances) {
    const where = drag.selector ? "`" + drag.selector + "` (" + drag.what + ")" : drag.what;
    if (!state.keyboardFiles.has(drag.file)) {
      add("error", "drag-alternative", drag.file, drag.line,
        "Drag affordance — " + where + " — with no keyboard handler anywhere in this file. SC 2.5.7 Dragging Movements (AA) requires a single-pointer, non-dragging alternative for every movable or resizable panel. Ship arrow-key nudging on a focusable handle (doc §7, §13).");
    }
    if (!state.resetFiles.has(drag.file)) {
      add("error", "drag-alternative", drag.file, drag.line,
        "Drag affordance — " + where + " — with no reset control found in this file. Doc §7 asks for arrow-key nudging AND a visible \"reset layout\" button; a keyboard path that can strand a panel off-screen is not an alternative.");
    }
  }

  /* Reduced motion: the listener must be DETACHED, not zeroed. Doc §6. */
  for (const file of state.parallaxListener) {
    if (!state.parallaxDetach.has(file)) {
      add("error", "reduced-motion-detach", file, 0,
        "A `pointermove` / `mousemove` listener is added in this file and never removed. Doc §6 requires the listener to be DETACHED under `prefers-reduced-motion: reduce`, not merely zeroed: a listener that still fires and writes zeros runs `getBoundingClientRect` on every pointer move for no visual result. Doc §13 lists parallax without a detaching guard as a refusal.");
    }
    if (!state.reducedMotionSignal.has(file)) {
      add("error", "reduced-motion-detach", file, 0,
        "A pointer-move listener is added in this file with no `prefers-reduced-motion` signal in the same file. The guard is not optional and it cannot live only in CSS — zeroing `--sp-parallax-translate` leaves the listener running.");
    }
    if (!state.mediaQueryRewatch.has(file)) {
      add("warn", "reduced-motion-detach", file, 0,
        "No `change` listener on a `matchMedia` result in this file. A user can turn Reduce Motion on while the page is open, so both media queries are re-read on `change` (doc §6, recipes §5).");
    }
  }
  for (const file of state.parallaxJsx) {
    if (state.parallaxListener.has(file)) continue;
    if (!state.reducedMotionSignal.has(file)) {
      add("error", "reduced-motion-detach", file, 0,
        "An `onPointerMove` / `onMouseMove` prop is bound in this file with no reduced-motion signal. In JSX the detach is the conditional binding — pass `undefined` rather than a handler that returns early — and it still needs the media query to decide (doc §6).");
    } else {
      add("info", "reduced-motion-detach", file, 0,
        "An `onPointerMove` prop is bound and a reduced-motion signal is present in the same file. Static analysis cannot tell whether the handler is UNBOUND under reduce or merely returns early. Read it: doc §6 requires the binding to go away.");
    }
  }

  /* The style is present, so the escape hatches must be too. */
  const stylePresent = state.cameraSelectors.size > 0 || state.glassSurfaces.length > 0 || state.preserve3d.size > 0;
  if (stylePresent) {
    if (!state.forcedColors.present) {
      add("error", "forced-colors-flatten", "(project)", 0,
        "No `@media (forced-colors: active)` block in the scanned files, but the camera or the glass is. Forced colors discards `backdrop-filter` and `box-shadow` and KEEPS `transform`, so doing nothing leaves unstyled panels floating at arbitrary angles with no visible edges — the depth language gone and the geometry that expressed it still there (doc §7).");
    } else {
      if (!state.forcedColors.perspectiveNone) {
        add("error", "forced-colors-flatten", "(project)", 0,
          "The `forced-colors: active` block never sets `perspective: none`. Doc §7 flattens the camera there; the colour keywords themselves are ui-morphism-core:a11y-validate's audit, not this scanner's.");
      }
      if (!state.forcedColors.transformNone) {
        add("error", "forced-colors-flatten", "(project)", 0,
          "The `forced-colors: active` block never sets `transform: none`. `transform` is the one property forced colors does not discard, which is exactly why it has to be nulled by hand (doc §7).");
      }
    }
    if (!state.reducedMotionQuery && (state.parallaxListener.size > 0 || state.parallaxJsx.size > 0 || state.scrollTimeline.size > 0)) {
      add("error", "reduced-motion-detach", "(project)", 0,
        "Motion is emitted but no `@media (prefers-reduced-motion: reduce)` block was found. The correct reduction keeps the depth and drops the movement: zero both parallax tokens, collapse the depth durations to 1ms, and detach the listener (doc §6).");
    }
  }

  /* Budgets, doc §8. */
  if (state.glassSurfaces.length > BACKDROP_BUDGET) {
    add("error", "backdrop-census", "(project)", 0,
      state.glassSurfaces.length + " distinct `backdrop-filter` surfaces declared, above the budget of " + BACKDROP_BUDGET + " concurrent surfaces on screen (doc §8). Each is a full backdrop read-back; twelve or more visibly drops frames on an M1 Air at 1440p. This counts SELECTORS, so it is a floor — confirm how many are on screen at once.");
  }

  for (const root of state.glassRoots) {
    if (state.continuousTransformRoots.has(root)) {
      add("error", "backdrop-on-animated", "(project)", 0,
        "`" + root + "` carries both `backdrop-filter` and a keyframe `animation` touching `transform`. The backdrop snapshot re-rasterises on every frame of a continuous animation, which doc §6 names the single biggest cost in this style and doc §13 lists as a refusal.");
    } else if (state.transitionTransformRoots.has(root)) {
      add("warn", "backdrop-on-animated", "(project)", 0,
        "`" + root + "` carries `backdrop-filter` and transitions `transform`. Doc §6's state table puts a hover lift at one rung, which is a bounded discrete change rather than continuous motion, so this is the style's own recipe rather than a defect — but it re-rasters the backdrop for the duration of the transition. Keep concurrent depth changes at or below 3 panels (doc §8), and drop the glass first if the frame budget is missed.");
    }
  }

  /* preserve-3d nesting. Textual nesting only: a selector written as a
     descendant of another preserve-3d selector. Runtime nesting is a DOM
     question and is reported as a census plus a manual procedure. */
  const preserveDepth = (() => {
    let deepest = state.preserve3d.size > 0 ? 1 : 0;
    for (const rule of state.preserve3dRules) {
      const anc = ancestorSelectors(rule.prelude).filter((a) => state.preserve3d.has(a));
      if (anc.length + 1 > deepest) deepest = anc.length + 1;
    }
    return deepest;
  })();
  if (preserveDepth > PRESERVE_3D_BUDGET) {
    add("error", "preserve-3d-nesting", "(project)", 0,
      "`transform-style: preserve-3d` nests " + preserveDepth + " deep in the selectors as written, above the budget of " + PRESERVE_3D_BUDGET + " (doc §8). Each level multiplies matrix work and defeats layer squashing.");
  } else if (state.preserve3d.size > 0) {
    add("info", "preserve-3d-nesting", "(project)", 0,
      state.preserve3d.size + " selector(s) declare `transform-style: preserve-3d`, nesting " + preserveDepth + " deep as written. Textual nesting is a floor: the runtime depth is a DOM question. Confirm it in the browser's layer panel against the budget of " + PRESERVE_3D_BUDGET + " (doc §8).");
  }

  /* GPU layer memory. Doc §8: layer memory is width x height x 4 bytes, one
     full-viewport 1440x900 layer costs 4.94 MiB, the budget is 96 MiB and the
     layer cap is 25. Counting selectors, not elements: one `.sp-depth-2` used
     on twelve panels is twelve layers, so this is a FLOOR. */
  const layers = state.promoted.size;
  const mib = Math.round(layers * MIB_PER_LAYER * 10) / 10;
  if (layers > 0) {
    const over = mib > MIB_BUDGET || layers > LAYER_BUDGET;
    add(over ? "error" : "info", "gpu-layer-memory", "(project)", 0,
      layers + " selector(s) promote a composited layer (live `backdrop-filter`, `transform-style: preserve-3d`, a 3D transform, or `will-change`), an estimated " + mib + " MiB at 4.94 MiB per full-viewport 1440x900 layer. Budgets: " + LAYER_BUDGET + " layers, " + MIB_BUDGET + " MiB (doc §8). This is an ESTIMATE and a FLOOR — it counts selectors, not elements — and it must be reported as one; measure the real number in the browser's layer panel." +
      (over ? " As written it is already over budget." : ""));
  }

  /* The containing-block question that no static reader can close. */
  if (state.cameraSelectors.size > 0 && state.fixedRules.length > 0) {
    add("info", "fixed-in-camera", "(project)", 0,
      "Camera selector(s): " + [...state.cameraSelectors].sort().join(", ") + ". " + state.fixedRules.length + " rule(s) declare `position: fixed` or `sticky`. Only textual descendants were adjudicated; whether a fixed element is RENDERED inside the stage is a DOM question. Confirm each one against the markup (doc §8).");
  }

  const SEV_ORDER = { error: 0, warn: 1, info: 2 };
  findings.sort((a, b) =>
    SEV_ORDER[a.severity] - SEV_ORDER[b.severity] ||
    a.file.localeCompare(b.file) || a.line - b.line);

  const counts = { error: 0, warn: 0, info: 0 };
  for (const f of findings) counts[f.severity]++;

  return {
    summary: {
      filesScanned: inputs.length,
      cameraSelectors: [...state.cameraSelectors].sort(),
      glassSurfaces: state.glassSurfaces.length,
      preserve3dSelectors: state.preserve3d.size,
      preserve3dDepth: preserveDepth,
      promotedLayerSelectors: layers,
      estimatedLayerMiB: mib,
      dragAffordances: state.dragAffordances.length,
      errors: counts.error,
      warnings: counts.warn,
      infos: counts.info,
    },
    glassSurfaces: state.glassSurfaces,
    findings,
  };
}

/* ---------------------------------------------------------------------- CLI */

function collect(target, out) {
  let st;
  try { st = statSync(target); } catch { return; }
  if (st.isDirectory()) {
    for (const entry of readdirSync(target)) {
      if (SKIP_DIRS.has(entry)) continue;
      collect(join(target, entry), out);
    }
    return;
  }
  if (SCANNABLE.has(extname(target).toLowerCase())) out.push(target);
}

const SEV_LABEL = { error: "ERROR", warn: "WARN ", info: "INFO " };

export function main(argv) {
  const args = argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(
      "spatial-scan.mjs — spatial-UI-specific static invariants\n\n" +
      "  node spatial-scan.mjs [path ...] [--json] [--quiet] [--no-fail]\n\n" +
      "  --json     machine-readable output\n" +
      "  --quiet    suppress info-severity findings\n" +
      "  --no-fail  always exit 0\n\n" +
      "Contrast, focus, target-size and forced-colors keyword checks are not run\n" +
      "here. They belong to ui-morphism-core:a11y-validate.\n");
    return 0;
  }

  const json = args.includes("--json");
  const quiet = args.includes("--quiet");
  const noFail = args.includes("--no-fail");
  const targets = args.filter((a) => !a.startsWith("--"));
  if (targets.length === 0) targets.push(".");

  const paths = [];
  for (const t of targets) collect(resolve(t), paths);

  const inputs = [];
  for (const p of paths) {
    try {
      inputs.push({ file: relative(process.cwd(), p) || p, text: readFileSync(p, "utf8") });
    } catch { /* unreadable file: skip, and say so in the count */ }
  }

  const { summary, findings } = scan(inputs);
  const shown = quiet ? findings.filter((f) => f.severity !== "info") : findings;

  if (json) {
    process.stdout.write(JSON.stringify({ summary, findings }, null, 2) + "\n");
  } else {
    let currentFile = null;
    for (const f of shown) {
      if (f.file !== currentFile) {
        currentFile = f.file;
        process.stdout.write("\n" + currentFile + "\n");
      }
      process.stdout.write(
        "  " + SEV_LABEL[f.severity] + " " + f.rule + (f.line ? ":" + f.line : "") + " — " + f.message + "\n");
    }
    process.stdout.write(
      "\nScanned " + summary.filesScanned + " file(s). " +
      "Camera: " + (summary.cameraSelectors.join(", ") || "none") + ". " +
      summary.glassSurfaces + " glass surface(s), " +
      summary.preserve3dSelectors + " preserve-3d selector(s), " +
      summary.dragAffordances + " drag affordance(s).\n" +
      "Estimated layer memory: " + summary.estimatedLayerMiB + " MiB across " +
      summary.promotedLayerSelectors + " promoted selector(s) — a floor, not a measurement.\n" +
      summary.errors + " error(s), " + summary.warnings + " warning(s), " + summary.infos + " info.\n" +
      "Contrast, focus, target-size and forced-colors keyword checks are not run here — call ui-morphism-core:a11y-validate.\n");
  }

  return !noFail && summary.errors > 0 ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
