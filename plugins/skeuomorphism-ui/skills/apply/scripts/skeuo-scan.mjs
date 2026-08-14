#!/usr/bin/env node
/**
 * skeuo-scan.mjs — skeuomorphism-specific static invariants.
 *
 * Source of truth: docs/01-skeuomorphism.md §13 (the validation checklist the
 * skill must self-run, the intensity knobs and the anti-pattern list it must
 * refuse), §3 (the light model, the grain band and the specular rule), §4 (the
 * token block and the grain data URI), §6 (what may and may not animate), §7
 * (the forced-colors asymmetry) and §8 (the budgets).
 *
 * SCOPE. This script checks only what is specific to this style and mechanical
 * enough to be got wrong by accident:
 *
 *   - one light direction: every outer shadow falls downward, the light inset
 *     sits at the top of a raised surface and the dark inset at the bottom, and
 *     a recessed container is the only permitted inversion
 *   - the four-layer stack, and the single blurred shadow presented as this style
 *   - a shadow- or bevel-bounded element with no real border
 *   - the face gradient's direction, stop count and 45% midpoint
 *   - a :focus-visible rule that replaces the stack instead of adding to it, and
 *     one with no transparent outline for forced-colors to colour
 *   - the grain layer: its data URI parameters, its opacity band, its count, and
 *     the explicit `display: none` it needs inside forced-colors, which
 *     `background-image: none` does not give it
 *   - box-shadow, background-image and gradient stops inside transitions and
 *     keyframes; will-change: box-shadow
 *   - the pressed appearance surviving prefers-reduced-motion
 *   - raster textures, the hybrid backdrop-blur cap and the press-travel ceiling
 *
 * It computes NO contrast ratio, NO relative luminance and NO alpha
 * compositing. Those are the nine universal checks and they belong to
 * ui-morphism-core:a11y-validate, which is the single implementation in this
 * marketplace. Do not add them here. Colour is only ever compared for LITERAL
 * EQUALITY — "is this layer written as white", "is this fill written as #fff" —
 * which is a string test and decides nothing about a WCAG threshold.
 *
 * Usage:
 *   node skeuo-scan.mjs [path ...] [--json] [--quiet] [--no-fail]
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
]);

const SKIP_DIRS = new Set([
  "node_modules", ".git", ".next", ".nuxt", ".svelte-kit",
  "dist", "build", "out", "coverage", "vendor", "target", ".turbo", ".cache",
]);

/** Doc §13 grainOpacity knob: hard-capped, the skill will not emit higher. */
const GRAIN_OPACITY_MAX = 0.08;

/** Doc §13 / §3: the light band. Dark surfaces are allowed the full ceiling. */
const GRAIN_OPACITY_LIGHT_MAX = 0.06;

/** Doc §4: the grain baked into --sk-noise. Frequency is not a token. */
const NOISE_BASE_FREQUENCY = "0.9";
const NOISE_OCTAVES = "2";
const NOISE_TILE = 160;

/** Doc §13 travel knob: 0-2px, and 2px only for metaphors >= 64px tall. */
const TRAVEL_MAX_PX = 2;

/** Doc §8 and §12: the hybrid's blur ceiling, and how many may exist. */
const HYBRID_BLUR_MAX = 12;
const HYBRID_BACKDROP_MAX = 2;

/** Doc §3: the face gradient's midpoint. Not 50%. */
const FACE_MIDPOINT = 45;

/** Doc §3 and §5: the specular hotspot's band, measured from the top. */
const SPECULAR_MIN = 25;
const SPECULAR_MAX = 35;

const RASTER = /\.(png|jpe?g|webp|avif|gif|bmp|tiff?)(["')?#]|$)/i;

/* ------------------------------------------------------------------ parser */

/**
 * A deliberately small CSS-shaped parser. It runs over stylesheets and over
 * JS/TS files alike: backticks are NOT treated as string delimiters, so CSS
 * held in a template literal (doc §5's React component holds its whole sheet
 * that way) is parsed like any other sheet. Quoted strings and comments are
 * skipped, so the grain's `url("data:image/svg+xml,…{…}")` cannot desynchronise
 * the brace stack — which for this style is not a hypothetical, since the one
 * asset every emitted sheet carries is a data URI full of braces.
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

    /* Line comment, but never inside a URL scheme ("https://", "data://"). */
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

/** Self first, then ancestors. A nested at-rule can carry the declarations
 *  itself — Tailwind's `@utility sk-grain` does exactly that — so an
 *  ancestors-only test would miss it. */
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

/* -------------------------------------------------------------- value tools */

/**
 * Split a comma-separated CSS value at top level, so a comma inside
 * `rgba(0,0,0,.25)` or `var(--x, 1px)` does not split a shadow layer in half.
 * Quoted strings are respected for the same reason: the grain data URI is one
 * quoted string containing dozens of commas.
 *
 * @param {string} value
 * @returns {string[]} trimmed parts; an empty or whitespace-only value yields []
 */
export function splitTop(value) {
  const out = [];
  let depth = 0;
  let buf = "";
  let quote = null;

  for (let i = 0; i < value.length; i++) {
    const ch = value[i];

    if (quote) {
      buf += ch;
      if (ch === "\\") { if (i + 1 < value.length) { buf += value[i + 1]; i++; } continue; }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === "(") { depth++; buf += ch; continue; }
    if (ch === ")") { depth = Math.max(0, depth - 1); buf += ch; continue; }

    if (ch === "," && depth === 0) {
      if (buf.trim()) out.push(buf.trim());
      buf = "";
      continue;
    }

    buf += ch;
  }

  if (buf.trim()) out.push(buf.trim());
  return out;
}

const isNone = (v) => /^none$/i.test(v.trim());
const hasVar = (v) => /var\(/i.test(v);

/** Remove every balanced function call, so `rgba(0,0,0,.25)` cannot contribute
 *  its numbers to a length scan. Runs to a fixed point for nesting. */
function stripFunctions(value) {
  let out = value;
  for (let i = 0; i < 8; i++) {
    const next = out.replace(/[a-z-]+\([^()]*\)/gi, " ");
    if (next === out) break;
    out = next;
  }
  return out;
}

/**
 * The lengths of one box-shadow layer, in declaration order: x, y, blur,
 * spread. Only `px` and a bare `0` are resolved — `rem`, `em` and `var()` are
 * reported as unresolved rather than guessed at, because a wrong number here
 * would be a finding against code that is correct.
 */
function layerLengths(layer) {
  const bare = stripFunctions(layer.replace(/(^|\s)inset(\s|$)/i, " "));
  const out = [];
  const re = /(-?\d*\.?\d+)(px|rem|em|%)?/g;
  let m;
  while ((m = re.exec(bare)) !== null) out.push({ n: parseFloat(m[1]), unit: m[2] || "" });
  return out;
}

/** A length in px, or null when it is not statically readable. A bare `0` is
 *  0px in every engine, so it resolves; every other unit does not. */
function px(len) {
  if (!len) return null;
  if (len.unit === "px") return len.n;
  if (len.unit === "" && len.n === 0) return 0;
  return null;
}

/* Colour LITERALS, matched for equality only. Nothing here is converted,
   composited or measured — see the scope note at the top of the file. */
const LIT_WHITE = /rgba?\(\s*255\s*[,\s]\s*255\s*[,\s]\s*255\s*[,/)]|#fff(?![0-9a-f])|#ffffff(?![0-9a-f])|\bwhite\b|hsla?\(\s*0\s+0%\s+100%/i;
const LIT_BLACK = /rgba?\(\s*0\s*[,\s]\s*0\s*[,\s]\s*0\s*[,/)]|#000(?![0-9a-f])|#000000(?![0-9a-f])|\bblack\b|hsla?\(\s*0\s+0%\s+0%/i;

/**
 * One parsed box-shadow layer.
 *
 * @param {string} layer
 * @returns {{inset: boolean, x: number|null, y: number|null, blur: number|null,
 *            spread: number|null, tone: "light"|"dark"|"unknown", raw: string}}
 */
export function shadowLayer(layer) {
  const inset = /(^|\s)inset(\s|$)/i.test(layer);
  const lens = layerLengths(layer);
  const tone = LIT_WHITE.test(layer) ? "light" : LIT_BLACK.test(layer) ? "dark" : "unknown";
  return {
    inset,
    x: px(lens[0]),
    y: px(lens[1]),
    blur: px(lens[2]),
    spread: px(lens[3]),
    tone,
    raw: layer,
  };
}

/** A shadow value this style owns: a named elevation compound, a shadow atom,
 *  or a hand-written stack of two or more layers. */
function isSkeuoStack(value, layers) {
  if (/var\(\s*--(sk-(elev|press-inner|shadow-|bevel-|focus-ring)|um-skeuomorphism-(elev|shadow|focus))/i.test(value)) return true;
  return layers.length >= 2;
}

/** Selectors that legitimately carry an inverted (all-inset) stack: doc §3's
 *  recessed containers, plus the pressed and latched states, which are the same
 *  inversion applied to a moment rather than to a shape. */
const RECESSED =
  /(^|[\s>+~,])(input|textarea|select|fieldset|progress|meter)\b|\[type=|[-_a-z]*(well|trough|track|slot|groove|recess|inset|field|gauge|screen|display|readout|inlay)s?(\b|[-_])|:active|:focus-within|\[aria-pressed|\[aria-checked|\[data-pressed|(^|[\s>+~.,])(pressed|latched|checked|depressed)(\b|[-_])/i;

/** A selector that names a curved part — doc §3 puts the specular hotspot only
 *  on these, and doc §5 puts it on the toggle knob specifically. */
const CURVED = /[-_a-z]*(knob|toggle|switch|dial|thumb|ball|pill|roller|wheel|cap|dome|lens)s?(\b|[-_])/i;

/** A grain layer: the token, the data URI, or a Tailwind utility naming it. */
const GRAIN_VALUE = /var\(\s*--(sk|um-skeuomorphism)-noise\b|feTurbulence/i;
const GRAIN_SELECTOR = /[-_a-z]*(grain|noise|texture|speckle)s?(\b|[-_])/i;

/** A selector or at-rule prelude that establishes the dark theme. */
function isDarkContext(node) {
  return chain(node).some((n) =>
    (n.type === "atrule" && /prefers-color-scheme\s*:\s*dark/i.test(n.prelude)) ||
    (n.type === "rule" && /\[data-theme=["']?dark|(^|[\s>+~,.])dark(\b|[-_])/i.test(n.prelude)));
}

/** The comma-separated compounds of a selector, normalised for comparison. */
function compounds(prelude) {
  return prelude.split(",").map((s) => s.trim().replace(/\s+/g, " ").toLowerCase()).filter(Boolean);
}

/** First simple selector of each compound, minus pseudos and BEM modifiers.
 *  Used to decide whether a base rule elsewhere in the file already declared
 *  the border a shadowed rule relies on. */
function rootClasses(prelude) {
  return prelude
    .split(",")
    .map((s) => s.trim().split(/[\s>+~]+/)[0] || "")
    .map((s) => s.replace(/::?[a-z-]+(\([^)]*\))?/gi, ""))
    .map((s) => s.split("--")[0])
    .filter(Boolean);
}

/** The gradient functions in a background value, with their argument text. */
function gradients(value) {
  const out = [];
  const re = /(repeating-)?(linear|radial|conic)-gradient\s*\(/gi;
  let m;
  while ((m = re.exec(value)) !== null) {
    let depth = 1;
    let i = re.lastIndex;
    for (; i < value.length && depth > 0; i++) {
      if (value[i] === "(") depth++;
      else if (value[i] === ")") depth--;
    }
    out.push({ kind: m[2].toLowerCase(), args: value.slice(re.lastIndex, i - 1) });
    re.lastIndex = i;
  }
  return out;
}

/* ------------------------------------------------------------------- checks */

function scanFile(file, text, add, state) {
  const root = parse(text);
  const nodes = [];
  walk(root, (n) => nodes.push(n));

  /* Which root classes declare a border anywhere in this file. Doc §5 puts the
     border on `.sk-button` and the pressed stack on `.sk-button:active`, so a
     per-rule border test alone would fire on the doc's own recipe. */
  const borderRoots = new Set();
  for (const n of nodes) {
    if (n.type !== "rule") continue;
    const hasBorder = n.decls.some((d) =>
      /^(border|border-width|border-color|border-style|border-inline|border-block)$/.test(d.prop) &&
      !isNone(d.value) && !/^0(px)?(\s|$)/.test(d.value.trim()));
    if (hasBorder) for (const rc of rootClasses(n.prelude)) borderRoots.add(rc);
  }

  for (const node of nodes) {
    const decls = node.decls;
    const label = contextLabel(node);
    const dark = isDarkContext(node);
    const recessedSelector = node.type === "rule" && RECESSED.test(node.prelude);

    /* --- the light model ------------------------------------------------- */

    const shadows = decls.filter((d) => d.prop === "box-shadow" && !isNone(d.value));

    for (const d of shadows) {
      const layers = splitTop(d.value).map(shadowLayer);
      const literal = layers.filter((l) => !hasVar(l.raw));
      const stack = isSkeuoStack(d.value, layers);
      const outer = literal.filter((l) => !l.inset);
      const insets = literal.filter((l) => l.inset);

      /* A ring — `0 0 0 2px` — is a focus indicator or a hairline, not a lit
         surface. It carries no light direction and is excluded from the polarity
         checks rather than being reported as a flat shadow. */
      const isRing = (l) => l.x === 0 && l.y === 0 && (l.blur === 0 || l.blur === null);
      const lit = outer.filter((l) => !isRing(l));

      if (stack) state.surfaces.push({ file, line: d.line, selector: node.prelude });

      /* 1 — every outer shadow falls downward. Doc §3: one overhead source, and
         mixed light directions are the number-one tell of a fake. */
      for (const l of lit) {
        if (l.y !== null && l.y < 0) {
          add("error", "light-direction", file, d.line,
            "`" + label + "` casts an outer shadow upward (`" + l.raw + "`). Doc §3 fixes one light source at the top of the viewport, so every outer shadow is offset downward on every element without exception. A single upward shadow beside a downward one is what makes a set read as fake.");
        }
      }

      /* 2 — bevel polarity. Doc §3: on a raised surface the highlight is the top
         inset and the shade the bottom inset; a recessed container inverts BOTH
         and is the only permitted exception. */
      const raised = lit.length > 0;
      const inverted = literal.length > 0 && lit.length === 0 && insets.length > 0;

      if (raised) {
        for (const l of insets) {
          if (l.y === null || l.y === 0) continue;
          if (l.tone === "light" && l.y < 0) {
            add("error", "light-direction", file, d.line,
              "`" + label + "` is a raised surface whose light inset sits at the BOTTOM (`" + l.raw + "`). Doc §3: the bevel highlight belongs at the top edge and the shade at the bottom. Inverting them on a raised surface is what makes a bump read as a hole.");
          }
          if (l.tone === "dark" && l.y > 0) {
            add("error", "light-direction", file, d.line,
              "`" + label + "` is a raised surface whose dark inset sits at the TOP (`" + l.raw + "`). Doc §3: the under-lip shade belongs at the bottom edge. Only a recessed container inverts the stack.");
          }
        }
      }

      if (inverted) {
        state.inversions.push({ file, line: d.line, selector: node.prelude });
        if (node.type === "rule" && !recessedSelector) {
          add("warn", "inversion-scope", file, d.line,
            "`" + label + "` carries an all-inset stack but its selector names no recessed container and no pressed state. Doc §3 makes the recessed inversion the ONLY exception to the top-light rule — wells, inputs, selects, textareas, slider tracks and slots. Confirm this element is a hole rather than a bump, or move it to the raised stack.");
        }
      }

      /* 3 — the four-layer stack. Doc §3 and §10: one shadow reads flat. */
      if (!hasVar(d.value) && layers.length === 1 && lit.length === 1) {
        const l = lit[0];
        if ((l.blur === null || l.blur > 0) && (l.y === null || l.y !== 0)) {
          add("error", "flat-shadow", file, d.line,
            "`" + label + "` carries a single blurred shadow (`" + d.value + "`). Doc §3 and §10: the style IS the four-layer stack — contact, ambient, inset top bevel, inset bottom lip — and one shadow reads flat no matter how good the colour is. Use `var(--sk-elev-2)`, or `--sk-elev-1` if this is a chip, tag or key.");
        }
      } else if (!hasVar(d.value) && stack && raised && insets.length === 0) {
        add("warn", "flat-shadow", file, d.line,
          "`" + label + "` stacks " + layers.length + " outer shadows with no inset layer. Doc §3: two of the four layers are insets — the top bevel highlight and the bottom under-lip — and without them the surface has depth but no machined edge.");
      }

      /* 4 — a shadow-bounded control with no border. Doc §7 and §10: forced
         colors nulls box-shadow, and a bevel is not a boundary under 1.4.11. */
      if (stack && node.type === "rule" && !inAtRule(node, /forced-colors/i)) {
        const hasBorderHere = chain(node).some((n) => n.decls.some((x) =>
          /^(border|border-width|border-color|border-style|border-inline|border-block)$/.test(x.prop) &&
          !isNone(x.value) && !/^0(px)?(\s|$)/.test(x.value.trim())));
        const inherits = rootClasses(node.prelude).some((rc) => borderRoots.has(rc));
        if (!hasBorderHere && !inherits) {
          add("error", "border-missing", file, d.line,
            "`" + label + "` carries the shadow stack but declares no border, and no base rule sharing its root class declares one. Doc §7: `forced-colors: active` forces `box-shadow: none`, so a bevel-bounded control becomes an invisible rectangle — and a bevel highlight is not a boundary under SC 1.4.11 in any mode. Add `border: var(--sk-hairline) solid var(--sk-border-strong)`.");
        }
      }
    }

    /* --- the face gradient ------------------------------------------------ */

    for (const d of decls) {
      if (!/^(background|background-image)$/.test(d.prop)) continue;
      for (const g of gradients(d.value)) {
        if (g.kind !== "linear") continue;
        const parts = splitTop(g.args);
        const first = (parts[0] || "").trim();
        const directional = /^(to\s|[-\d.]+deg|[-\d.]+turn|[-\d.]+rad)/i.test(first);
        const stops = directional ? parts.slice(1) : parts;

        /* 5 — direction. `to bottom` is the light model; `to top` inverts it. */
        if (/^to\s+top\s*$/i.test(first) || /^0deg$/i.test(first) || /^360deg$/i.test(first)) {
          add("error", "gradient-direction", file, d.line,
            "`" + label + "` fills with a gradient running `" + first + "`. Doc §3: the face gradient is lightest at the top and darkest at the bottom, because the light source is overhead. A bottom-lit fill under a top-lit shadow stack is the mixed-light-direction failure with extra steps.");
        }

        /* 6 — the 45% midpoint. Doc §3 and §4: the mid stop is at 45%, not 50%. */
        if (stops.length === 3) {
          state.faceGradients++;
          const mid = /(-?\d*\.?\d+)%\s*$/.exec(stops[1].trim());
          if (mid && parseFloat(mid[1]) !== FACE_MIDPOINT) {
            add("warn", "gradient-midpoint", file, d.line,
              "`" + label + "`'s 3-stop face puts its mid stop at " + mid[1] + "%. Doc §3 and §4 put it at " + FACE_MIDPOINT + "% — the asymmetry is what makes the surface read as curved rather than as a linear ramp.");
          }
        }

        /* 7 — pure white and pure black as material. Doc §3 and §10: no
           physical material is either. A literal string comparison. */
        for (const s of stops) {
          if (LIT_WHITE.test(s) || LIT_BLACK.test(s)) {
            add("warn", "pure-material", file, d.line,
              "`" + label + "` uses a pure white or pure black gradient stop (`" + s.trim() + "`). Doc §3 and §10: real materials have a hue — faces sit at 8-25% saturation and 82-95% lightness, and the ground is never `#fff` or `#000`.");
            break;
          }
        }
      }

      /* 8 — the specular hotspot. Doc §3: curved parts only, 25-35% from the
         top; flat rectangles do not get one. */
      for (const g of gradients(d.value)) {
        if (g.kind !== "radial") continue;
        if (!/var\(\s*--(sk|um-skeuomorphism)-specular|rgba?\(\s*255\s*[,\s]\s*255\s*[,\s]\s*255/i.test(g.args)) continue;
        state.speculars++;
        const at = /\bat\s+[\d.]+%\s+([\d.]+)%/i.exec(g.args);
        if (at) {
          const y = parseFloat(at[1]);
          if (y < SPECULAR_MIN || y > SPECULAR_MAX) {
            add("warn", "specular-band", file, d.line,
              "`" + label + "` places a specular hotspot at " + y + "% from the top. Doc §3 puts it between " + SPECULAR_MIN + "% and " + SPECULAR_MAX + "%, which is where a curved surface catches an overhead light; doc §5's toggle knob uses 28%.");
          }
        }
        if (node.type === "rule" && !CURVED.test(node.prelude)) {
          add("info", "specular-scope", file, d.line,
            "`" + label + "` carries a specular hotspot but its selector does not name a curved part. Doc §3: knobs, toggles and pill switches get one; flat rectangles do not, because a flat surface has no point where the highlight concentrates.");
        }
      }
    }

    /* --- focus ------------------------------------------------------------ */

    if (node.type === "rule" && /:focus-visible|:focus-within/i.test(node.prelude)) {
      const fs = decls.find((d) => d.prop === "box-shadow" && !isNone(d.value));
      const outline = decls.find((d) => d.prop === "outline");
      /* `:focus-within` styles an ANCESTOR of the focused element, and the UA
         colours the focused element's own outline rather than the container's,
         so only `:focus-visible` is held to the transparent-outline rule. Doc
         §5's `.sk-well:focus-within` is correct as written for that reason. */
      const isSelfFocus = /:focus-visible/i.test(node.prelude);
      if (fs) {
        const restates = /var\(\s*--(sk-elev|um-skeuomorphism-elev)/i.test(fs.value) ||
          splitTop(fs.value).length >= 3;
        if (!restates) {
          add("error", "focus-additive", file, fs.line,
            "`" + label + "` sets `box-shadow: " + fs.value + "`. A `box-shadow` declaration replaces the WHOLE stack, so a ring on its own deletes the object's depth the moment it receives focus. Doc §6: the ring is additive — re-state `var(--sk-elev-2)`, or `var(--sk-elev-current)` where the stack was resolved at runtime, before the ring.");
        }
        if (isSelfFocus && !outline) {
          add("error", "focus-outline", file, node.line,
            "`" + label + "` builds its focus indicator from `box-shadow` with no `outline` declaration. Doc §5 and §7: forced-colors nulls every shadow in the file, and a transparent outline is what the UA then colours — `outline: var(--sk-focus-width) solid transparent` is not decoration, it is the indicator that survives.");
        } else if (isSelfFocus && outline && isNone(outline.value)) {
          add("error", "focus-outline", file, outline.line,
            "`" + label + "` sets `outline: none` while carrying a shadow-based focus ring. In forced-colors mode the shadow is deleted and the outline is already gone, which leaves a keyboard user with no indicator at all. Use `outline: var(--sk-focus-width) solid transparent`.");
        }
      }
      state.focusRules++;
    }

    /* --- the grain -------------------------------------------------------- */

    let grainHere = false;
    for (const d of decls) {
      if (!/^(background|background-image|--sk-noise|--um-skeuomorphism-noise)$/.test(d.prop)) continue;
      if (!GRAIN_VALUE.test(d.value)) continue;

      if (/^(background|background-image)$/.test(d.prop)) {
        grainHere = true;
        state.grainLayers.push({ file, line: d.line, selector: node.prelude });
        /* The selector the grain actually lives on, so the forced-colors check
           can be a match rather than a guess. Doc §5 puts it on `.sk-panel
           ::before`, whose name contains none of the words a heuristic would
           look for — which is exactly why the heuristic is not the check. */
        if (node.type === "rule") for (const c of compounds(node.prelude)) state.grainCompounds.add(c);
      }

      /* 9 — the baked parameters. Doc §4: frequency, octaves and tile size are
         NOT tokens, they are edited in the URI, in all three copies of it. */
      const freq = /baseFrequency=['"]?([\d.\s]+)['"]?/i.exec(d.value);
      if (freq) {
        const f = freq[1].trim();
        if (f !== NOISE_BASE_FREQUENCY) {
          add("warn", "grain-frequency", file, d.line,
            "`" + label + "` bakes `baseFrequency='" + f + "'` into the grain. Doc §3 and §4: this style's grain is the tight machining grain at " + NOISE_BASE_FREQUENCY + " / " + NOISE_OCTAVES + " octaves, deliberately different from glassmorphism's softer 0.8 / 4 and maximalism's 0.8 / 3. Changing the frequency changes the MATERIAL; only `--sk-noise-opacity` changes the intensity.");
        }
      }
      const oct = /numOctaves=['"]?(\d+)['"]?/i.exec(d.value);
      if (oct && oct[1] !== NOISE_OCTAVES) {
        add("warn", "grain-frequency", file, d.line,
          "`" + label + "` bakes `numOctaves='" + oct[1] + "'` into the grain. Doc §4 states " + NOISE_OCTAVES + ". More octaves is a softer, cloudier field, which is a different material rather than a different intensity.");
      }
      if (/feTurbulence/i.test(d.value) && !/type=['"]?fractalNoise/i.test(d.value)) {
        add("warn", "grain-frequency", file, d.line,
          "`" + label + "`'s `feTurbulence` does not declare `type='fractalNoise'`. The default is `turbulence`, which produces visible veining rather than an even machining grain (doc §3, §4).");
      }
      if (/feTurbulence/i.test(d.value) && !/stitchTiles=['"]?stitch/i.test(d.value)) {
        add("warn", "grain-frequency", file, d.line,
          "`" + label + "`'s `feTurbulence` does not declare `stitchTiles='stitch'`, so the " + NOISE_TILE + "px tile will seam visibly where it repeats (doc §4).");
      }
    }

    if (grainHere) {
      const size = decls.find((d) => d.prop === "background-size");
      if (size && !hasVar(size.value)) {
        const m = /(-?\d*\.?\d+)px/.exec(size.value);
        if (m && parseFloat(m[1]) !== NOISE_TILE) {
          add("warn", "grain-frequency", file, size.line,
            "`" + label + "` paints the grain at `background-size: " + size.value + "`. Doc §4 bakes a " + NOISE_TILE + "px tile into the data URI and paints it at " + NOISE_TILE + "px; scaling it rescales the grain, which is the same as changing the frequency.");
        }
      }
      if (!decls.some((d) => d.prop === "pointer-events")) {
        add("info", "grain-layer", file, node.line,
          "`" + label + "` is a grain layer with no `pointer-events: none`. Doc §5's recipe declares it: the layer is decoration and must never intercept a click meant for the control under it.");
      }
    }

    /* 10 — the grain opacity band. Doc §13 hard-caps the knob at 0.08; the
       checklist's budget is 0.06 light and 0.08 dark. */
    for (const d of decls) {
      const isNoiseToken = /^--(sk|um-skeuomorphism)-noise-opacity$/.test(d.prop);
      const isGrainOpacity = d.prop === "opacity" &&
        (grainHere || (node.type === "rule" && GRAIN_SELECTOR.test(node.prelude)));
      if (!isNoiseToken && !isGrainOpacity) continue;
      if (hasVar(d.value)) continue;
      const n = parseFloat(d.value);
      if (Number.isNaN(n)) continue;
      state.grainOpacities.push({ file, line: d.line, value: n, dark });
      if (n > GRAIN_OPACITY_MAX) {
        add("error", "grain-opacity", file, d.line,
          "`" + d.prop + ": " + d.value + "` on `" + label + "` exceeds the " + GRAIN_OPACITY_MAX + " ceiling. Doc §13 hard-caps the `grainOpacity` knob there and says the skill will not emit higher; doc §3: above 0.10 it stops reading as grain and starts reading as dirt.");
      } else if (!dark && n > GRAIN_OPACITY_LIGHT_MAX) {
        add("warn", "grain-opacity", file, d.line,
          "`" + d.prop + ": " + d.value + "` on `" + label + "` is above the " + GRAIN_OPACITY_LIGHT_MAX + " light-surface budget. Doc §4 ships 0.05 light and 0.07 dark, and the full " + GRAIN_OPACITY_MAX + " ceiling is a dark-surface allowance — dark surfaces need slightly more grain to read at all.");
      }
    }

    /* 11 — forced colors. Doc §7: the mode forces `background-image: none` but
       that does NOT apply to `url()` backgrounds, so the data-URI grain survives
       and can wreck legibility. It has to be `display: none`d by hand. */
    if (inAtRule(node, /forced-colors\s*:\s*active/i)) {
      state.forcedColorsRules++;
      if (node.type === "rule") {
        if (decls.some((d) => d.prop === "display" && isNone(d.value))) {
          state.forcedColorsHidden.push(node.prelude);
        }
        if (decls.some((d) => /^(background|background-image)$/.test(d.prop) && isNone(d.value))) {
          state.forcedColorsBgNone.push(node.prelude);
        }
      }
      for (const d of decls) {
        if (d.prop === "box-shadow" && !isNone(d.value)) {
          add("warn", "forced-colors-shadow", file, d.line,
            "`" + label + "` declares a live `box-shadow` inside `forced-colors: active`. The UA forces it to `none` regardless, so this is a rule that reads as coverage and provides none. The mitigation doc §7 asks for is a real border in system colours.");
        }
      }
    }

    /* --- motion ----------------------------------------------------------- */

    for (const d of decls) {
      /* 12 — what may not animate. Doc §6, §8 and §13's checklist: zero
         transition or animation declarations targeting box-shadow,
         background-image or gradient stops. */
      if (/^(transition|transition-property|animation|animation-name)$/.test(d.prop)) {
        if (/box-shadow/i.test(d.value)) {
          add("error", "animated-shadow", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + label + "` interpolates `box-shadow`. Doc §6 and §13: every frame repaints the element's bounds and a four-layer stack makes that repaint expensive. Transition `transform` and `filter`, let the stack swap in one frame, or cross-fade two absolutely positioned pseudo-elements each carrying a static shadow.");
        }
        if (/background-image|background-position|background-size/i.test(d.value) ||
            /(^|[\s,])background([\s,]|$)/i.test(d.value)) {
          add("error", "animated-background", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + label + "` interpolates a background. Doc §6: never animate `background-image`, the gradient stops or the grain layer — an animated gradient is worse than an animated shadow, and the grain must never move at all.");
        } else if (/(^|[\s,])all([\s,]|$)/i.test(d.value)) {
          add("warn", "animated-shadow", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + label + "` transitions `all`, which silently includes `box-shadow` and `background-image`. Name the properties.");
        }
      }
      if (d.prop === "will-change" && /box-shadow|background/i.test(d.value)) {
        add("error", "will-change-shadow", file, d.line,
          "`will-change: " + d.value + "` on `" + label + "`. Doc §8: promote only what is about to animate and release the hint afterwards — a page full of `will-change: box-shadow` exhausts GPU memory on a 4GB Android device, and it makes the repaint no cheaper.");
      }
      /* 13 — the press travel ceiling. Doc §13's travel knob. */
      if (/^--(sk|um-skeuomorphism)-press-travel$/.test(d.prop) && !hasVar(d.value)) {
        const m = /(-?\d*\.?\d+)px/.exec(d.value);
        if (m && Math.abs(parseFloat(m[1])) > TRAVEL_MAX_PX) {
          add("error", "travel-ceiling", file, d.line,
            "`" + d.prop + ": " + d.value + "` exceeds the " + TRAVEL_MAX_PX + "px ceiling on doc §13's `travel` knob, and " + TRAVEL_MAX_PX + "px itself is reserved for hardware metaphors 64px tall or more. On an ordinary 44px control anything beyond 1px reads as a glitch rather than as a press.");
        }
      }
    }

    /* 14 — keyframes that mutate the stack, the fill or the grain. */
    if (inAtRule(node, /@keyframes/i)) {
      for (const d of decls) {
        if (d.prop === "box-shadow" && !isNone(d.value)) {
          add("error", "animated-shadow", file, d.line,
            "`@keyframes` step sets `box-shadow`, interpolating the stack across every frame (doc §6, §8, §13).");
        }
        if (/^(background|background-image)$/.test(d.prop) && gradients(d.value).length > 0) {
          add("error", "animated-background", file, d.line,
            "`@keyframes` step sets `" + d.prop + "` to a gradient, interpolating the face's stops across every frame (doc §6).");
        }
        if (/^(background|background-image)$/.test(d.prop) && GRAIN_VALUE.test(d.value)) {
          add("error", "animated-background", file, d.line,
            "`@keyframes` step animates the grain layer. Doc §6: never animate the grain — it is a surface finish, and a moving one reads as television static.");
        }
      }
    }

    /* 15 — reduced motion must remove the travel, not the state. Doc §6 and
       §13: the inset swap is an SC 1.4.11 state indicator, so it stays and
       simply arrives instantly. */
    if (inAtRule(node, /prefers-reduced-motion\s*:\s*reduce/i) && node.type === "rule") {
      state.reducedMotionRules++;
      const pressed = /:active|\[aria-pressed|\[aria-checked|(^|[\s>+~.,])(pressed|checked|latched)(\b|[-_])/i.test(node.prelude);
      if (pressed) {
        for (const d of decls) {
          if (d.prop === "box-shadow" && isNone(d.value)) {
            add("error", "reduced-motion-state", file, d.line,
              "`" + node.prelude + "` sets `box-shadow: none` inside `prefers-reduced-motion: reduce`. Doc §6: reduced motion removes the MOVEMENT, never the pressed appearance — the inset swap is a state indicator required by SC 1.4.11, so it stays and simply arrives instantly. Remove the travel with `transform: none` and leave the shadows alone.");
          }
          if (d.prop === "box-shadow" && /var\(\s*--(sk|um-skeuomorphism)-elev-[123]/i.test(d.value)) {
            add("error", "reduced-motion-state", file, d.line,
              "`" + node.prelude + "` restores a RAISED stack (`" + d.value + "`) inside `prefers-reduced-motion: reduce`. That deletes the pressed state rather than the motion; doc §6 keeps the pressed appearance and drops only the travel.");
          }
        }
      }
    }

    /* --- textures, hybrids, and the rest ---------------------------------- */

    for (const d of decls) {
      /* 16 — raster textures. Doc §8 and §13: a 512x512 noise PNG is 40-90KB
         and buys nothing visible at 5% opacity against a ~330-byte data URI. */
      if (/^(background|background-image|content|mask|mask-image|-webkit-mask|-webkit-mask-image)$/.test(d.prop) &&
          RASTER.test(d.value)) {
        const decorative = node.type === "rule" &&
          (GRAIN_SELECTOR.test(node.prelude) ||
           /[-_a-z]*(leather|wood|metal|brushed|felt|denim|linen|carbon|marble|paper|stitch)s?(\b|[-_])/i.test(node.prelude));
        if (decorative) {
          add("error", "raster-texture", file, d.line,
            "`" + label + "` loads a raster texture (`" + d.value + "`). Doc §8 and §13: no raster texture over 40KB and no more than 60KB of decorative image bytes per route, and the inline `feTurbulence` data URI is roughly 330 bytes. Use it, or one of doc §8's tiling 2-colour SVG patterns — stitch, mesh, brushed lines — at 2KB or under.");
        } else {
          add("info", "raster-texture", file, d.line,
            "`" + label + "` loads a raster image. If it is decorative material — leather, brushed metal, wood, felt — it counts against doc §8's 60KB-per-route budget and the 40KB per-asset cap, and no texture may carry baked-in text, which has no accessible name at all.");
        }
      }

      /* 17 — the hybrid's blur cap. Doc §8 and §12: glass above, material
         below, radius <= 12px and at most two backdrop-filtered elements. */
      if (/^(backdrop-filter|-webkit-backdrop-filter)$/.test(d.prop) && !isNone(d.value)) {
        state.backdropFiltered.push({ file, line: d.line, selector: node.prelude });
        const m = /blur\(\s*([\d.]+)px\s*\)/i.exec(d.value);
        if (m && parseFloat(m[1]) > HYBRID_BLUR_MAX) {
          add("error", "hybrid-blur", file, d.line,
            "`" + label + "` blurs a backdrop at " + m[1] + "px. Doc §8 and §12 cap the sanctioned glass-above-material hybrid at " + HYBRID_BLUR_MAX + "px: a large blurred surface can drive GPU utilisation to 100%, and this style's own budget assumes the blur is the exception rather than the surface.");
        }
      }
    }

    /* 18 — file-level signals the project checks aggregate. */
    if (node.type === "atrule") {
      if (/forced-colors/i.test(node.prelude)) state.queries.add("forced-colors");
      if (/prefers-reduced-motion/i.test(node.prelude)) state.queries.add("prefers-reduced-motion");
      if (/prefers-contrast/i.test(node.prelude)) state.queries.add("prefers-contrast");
      if (/prefers-reduced-transparency/i.test(node.prelude)) state.queries.add("prefers-reduced-transparency");
    }

    /* 19 — prefers-contrast must take the grain to zero. Doc §7 and §13. */
    if (inAtRule(node, /prefers-contrast\s*:\s*(more|high)/i)) {
      for (const d of decls) {
        if (/^--(sk|um-skeuomorphism)-noise-opacity$/.test(d.prop) || d.prop === "opacity") {
          if (parseFloat(d.value) === 0) state.contrastGrainZeroed = true;
        }
        if (d.prop === "display" && isNone(d.value)) state.contrastGrainZeroed = true;
      }
    }
  }
}

/* ------------------------------------------------------------------- driver */

/**
 * Scan a set of already-read files.
 *
 * @param {{file: string, text: string}[]} inputs
 * @returns {{summary: object, surfaces: object[], findings: object[]}}
 */
export function scan(inputs) {
  const findings = [];
  const add = (severity, rule, file, line, message) =>
    findings.push({ file, line, severity, rule, message });

  const state = {
    surfaces: [],
    inversions: [],
    grainLayers: [],
    grainOpacities: [],
    grainCompounds: new Set(),
    backdropFiltered: [],
    forcedColorsHidden: [],
    forcedColorsBgNone: [],
    queries: new Set(),
    faceGradients: 0,
    speculars: 0,
    focusRules: 0,
    forcedColorsRules: 0,
    reducedMotionRules: 0,
    contrastGrainZeroed: false,
  };

  for (const { file, text } of inputs) scanFile(file, text, add, state);

  /* Project-level checks. Deliberately not per-file: doc §13's output list puts
     the four escape hatches in their own `styles/skeuo-a11y.css` cascade layer,
     so a per-file assertion would fire on a correctly split codebase. */
  if (state.surfaces.length > 0) {
    const required = [
      ["forced-colors", "Doc §7: the mode forces `box-shadow: none`, `text-shadow: none` and `background-image: none`, so the ENTIRE style disappears and every control needs a real border in system colours."],
      ["prefers-reduced-motion", "Doc §6: the travel comes off and the pressed appearance stays — the inset swap is an SC 1.4.11 state indicator, not decoration."],
      ["prefers-contrast", "Doc §7: `prefers-contrast: more` drops the grain to 0, darkens ink and borders, and flattens the gradient spread to about 6%."],
    ];
    for (const [q, why] of required) {
      if (!state.queries.has(q)) {
        add("error", "a11y-blocks", "(project)", 0,
          "No `@media (" + q + ")` block found in the scanned files, but " + state.surfaces.length + " skeuomorphic surface(s) were. " + why);
      }
    }
  }

  if (state.grainLayers.length > 0) {
    /* Doc §8: one grain layer per scroll container, on the chassis. A file is a
       proxy for a scroll container, not a measurement of one — the message says
       so rather than reporting a count as a fact. */
    const perFile = new Map();
    for (const g of state.grainLayers) perFile.set(g.file, (perFile.get(g.file) || 0) + 1);
    for (const [file, n] of perFile) {
      if (n > 1) {
        add("warn", "grain-count", file, 0,
          n + " grain layers declared in this file. Doc §8 and §13: one grain layer per scroll container, on the outermost chassis, with children inheriting the visual field — twenty components each carrying their own `::before` is twenty extra paint rectangles. A file is a proxy for a scroll container; confirm how many of these render inside the same one.");
      }
    }

    /* Does anything inside forced-colors actually hide the grain? Matched
       against the selectors the grain was declared on, and against the naming
       heuristic as a fallback for a sheet this scan never saw the grain rule in. */
    const isGrainSelector = (sel) =>
      compounds(sel).some((c) => state.grainCompounds.has(c)) || GRAIN_SELECTOR.test(sel);

    if (state.queries.has("forced-colors") && !state.forcedColorsHidden.some(isGrainSelector)) {
      const nulled = state.forcedColorsBgNone.filter(isGrainSelector);
      if (nulled.length > 0) {
        add("error", "forced-colors-grain", "(project)", 0,
          "`" + nulled[0] + "` sets `background-image: none` inside `forced-colors: active` to hide the grain. Doc §7: the UA's own `background-image: none` does not apply to `url()` backgrounds, and neither does yours — the SVG data URI survives the mode and sits over a forced-colour surface. Use `display: none`.");
      } else {
        add("error", "forced-colors-grain", "(project)", 0,
          "A grain layer exists and a `forced-colors: active` block exists, but no rule inside it sets `display: none` on the grain. Doc §7: the UA's `background-image: none` does not apply to `url()` backgrounds, so an SVG data-URI grain SURVIVES forced-colors mode and sits over the user's forced palette. This is the single most-missed line in this style.");
      }
    }

    if (state.queries.has("prefers-contrast") && !state.contrastGrainZeroed) {
      add("error", "contrast-grain", "(project)", 0,
        "A grain layer exists and a `prefers-contrast` block exists, but nothing inside it takes the grain to zero. Doc §7 and §13: under `prefers-contrast: more` the grain opacity is 0, ink and borders darken, and the gradient spread flattens to about 6%.");
    }

    if (state.grainOpacities.length === 0) {
      add("info", "grain-opacity", "(project)", 0,
        "A grain layer was found but no literal opacity was readable — every value goes through `var()`. Doc §4 ships `--sk-noise-opacity` at .05 light and .07 dark, and doc §13 hard-caps the knob at " + GRAIN_OPACITY_MAX + "; confirm the token resolves inside that band in both themes.");
    }
  }

  if (state.backdropFiltered.length > HYBRID_BACKDROP_MAX) {
    add("warn", "hybrid-blur", "(project)", 0,
      state.backdropFiltered.length + " backdrop-filtered element(s) declared, against doc §8's ceiling of " + HYBRID_BACKDROP_MAX + " per viewport. Doc §12 sanctions exactly one hybrid — glass above, material below — and reversing it, or multiplying it, breaks the depth model as well as the budget.");
  }

  if (state.surfaces.length > 0 && state.focusRules === 0) {
    add("warn", "focus-additive", "(project)", 0,
      "No `:focus-visible` or `:focus-within` rule was found alongside " + state.surfaces.length + " skeuomorphic surface(s). Doc §6 and §7 require an additive ring on every focusable element. `ui-morphism-core:a11y-validate` owns the per-element focus check; this is only a note that none exists in the scanned files at all.");
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
      skeuoSurfaces: state.surfaces.length,
      inversions: state.inversions.length,
      grainLayers: state.grainLayers.length,
      faceGradients: state.faceGradients,
      speculars: state.speculars,
      backdropFiltered: state.backdropFiltered.length,
      a11yQueriesFound: [...state.queries].sort(),
      errors: counts.error,
      warnings: counts.warn,
      infos: counts.info,
    },
    surfaces: state.surfaces,
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
      "skeuo-scan.mjs — skeuomorphism-specific static invariants\n\n" +
      "  node skeuo-scan.mjs [path ...] [--json] [--quiet] [--no-fail]\n\n" +
      "  --json     machine-readable output\n" +
      "  --quiet    suppress info-severity findings\n" +
      "  --no-fail  always exit 0\n\n" +
      "Contrast, focus, target size and forced-colors keyword checks are not run\n" +
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
      summary.skeuoSurfaces + " skeuomorphic surface(s), " +
      summary.inversions + " recessed inversion(s), " +
      summary.grainLayers + " grain layer(s).\n" +
      "Accessibility queries present: " + (summary.a11yQueriesFound.join(", ") || "none") + ".\n" +
      summary.errors + " error(s), " + summary.warnings + " warning(s), " + summary.infos + " info.\n" +
      "Contrast, focus, target size and forced-colors keyword checks are not run here — call ui-morphism-core:a11y-validate.\n");
  }

  return !noFail && summary.errors > 0 ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
