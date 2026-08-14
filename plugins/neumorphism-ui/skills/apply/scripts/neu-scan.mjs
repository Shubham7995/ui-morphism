#!/usr/bin/env node
/**
 * neu-scan.mjs — neumorphism-specific static invariants.
 *
 * Source of truth: docs/02-neumorphism.md §13 (the validation checklist the
 * skill must self-run, and the anti-pattern list it must refuse), §7 (the
 * forced-colors deletion and the focus rule), §8 (the blur ceilings, the layer
 * budget and the element census), §6 (what may and may not animate, and what
 * reduced motion may remove), §4 (the geometry relations: blur = 2 x distance,
 * spread 0, the 0.6x pressed ratio).
 *
 * SCOPE. This script checks only what is specific to this style and mechanical
 * enough to be got wrong by accident:
 *
 *   - a control whose only boundary is the same-hue shadow pair, which is the
 *     refusal this whole plugin exists for
 *   - blur / distance outside [1.5, 3.0], and spread above 0
 *   - the two-layer ceiling and the 40 / 24 / 16px blur ceilings
 *   - mixed light sources across the document
 *   - box-shadow used as a focus ring, and outlines under the 3px / 3px floor
 *   - a forced-colors block that nulls the shadow without restoring a border,
 *     and a missing forced-colors block altogether
 *   - a reduced-motion block that removes a state carrier instead of a duration
 *   - a neumorphic element whose fill is not the page ground
 *   - the pressed rung against 0.6x its raised counterpart
 *   - fixed heights, sub-44px targets, sunken controls, will-change misuse,
 *     the sibling gap, the dark-mode pair, and the surface census
 *
 * It computes NO contrast ratio, NO relative luminance and NO alpha
 * compositing. Those are the nine universal checks and they belong to
 * ui-morphism-core:a11y-validate, which is the single implementation in this
 * marketplace. Do not add them here. Every ratio this file prints in a message
 * is quoted from docs/02-neumorphism.md; none is calculated.
 *
 * Usage:
 *   node neu-scan.mjs [path ...] [--json] [--quiet] [--no-fail]
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

/** Doc §3 and §4: blur is 2 x distance at every rung. */
const BLUR_RATIO = 2;

/** Doc §13 anti-pattern 9: refuse and clamp outside this band. */
const RATIO_MIN = 1.5;
const RATIO_MAX = 3.0;

/** Doc §8 budgets. */
const BLUR_MAX = 40;
const BLUR_SCROLLER_MAX = 24;
const BLUR_REPEAT_MAX = 16;

/** Doc §8: two layers per element; four only on the §6 cross-fade, which puts
 *  two on ::before and two on ::after rather than four in one declaration. */
const LAYER_MAX = 2;

/** Doc §4: the pressed rungs are 0.6x their raised counterparts. */
const PRESSED_RATIO = 0.6;

/** Doc §8 and §13 validation item 9: warn above 12, fail above 24. */
const ELEMENTS_WARN = 12;
const ELEMENTS_FAIL = 24;

/** Doc §4 --nm-target-min, and SC 2.5.8's own floor underneath it. */
const TARGET_MIN = 44;
const TARGET_FLOOR = 24;

/** Doc §7: outline 3px at 3px offset, above SC 2.4.13's minimum, because the
 *  ring has to clear the blurred halo rather than sit inside it. */
const OUTLINE_MIN = 3;
const OUTLINE_OFFSET_MIN = 3;

/** Doc §3 and §10: 2 x distance + blur / 2, which is 16px at the sm rung. */
const GAP_MIN_SM = 16;

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
 *  itself, so an ancestors-only test would miss it. */
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
 * `rgb(184 185 190 / .5)` or `var(--x, 1px)` does not split a shadow layer in
 * half. Quoted strings are respected for the same reason.
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

/** `!important` is stripped first: a `box-shadow: none !important` inside a
 *  forced-colors block is the doc's own guard utility, and reading it as a live
 *  shadow would report the fix as the defect. */
const isNone = (v) => /^none$/i.test(v.replace(/!\s*important/i, "").trim());
const hasVar = (v) => /var\(/i.test(v);

/** Remove every balanced function call, so `rgb(184 185 190 / .5)` cannot
 *  contribute its numbers to a length scan. Runs to a fixed point for nesting. */
function stripFunctions(value) {
  let out = value;
  for (let i = 0; i < 8; i++) {
    const next = out.replace(/[a-z-]+\([^()]*\)/gi, " ");
    if (next === out) break;
    out = next;
  }
  return out;
}

/** Every bare length in one shadow layer, in declaration order: x, y, blur,
 *  spread. Only `px` and unitless zero are resolved; `rem`, `em` and `var()`
 *  are reported as unresolved rather than guessed at, because a wrong number
 *  here would be a finding against code that is correct. */
function layerLengths(layer) {
  /* Hex colours carry digits — `#b8b9be` would otherwise contribute an 8 and a
     9 to the length list and desynchronise every offset in the layer. Strip
     them before scanning, as stripFunctions() already strips `rgb()`. */
  const bare = stripFunctions(layer).replace(/#[0-9a-f]{3,8}\b/gi, " ");
  const out = [];
  const re = /(-?\d*\.?\d+)(px|rem|em|%)?/g;
  let m;
  while ((m = re.exec(bare)) !== null) {
    out.push({ n: parseFloat(m[1]), unit: m[2] || "" });
  }
  return out;
}

const isInset = (layer) => /(^|\s)inset(\s|$)/i.test(layer);

/**
 * One shadow layer resolved to numbers, or null when it is not statically
 * readable. `{ x, y, blur, spread, inset }`, all px.
 */
export function layerGeometry(layer) {
  if (hasVar(layer)) return null;
  const lens = layerLengths(layer);
  if (lens.length < 2) return null;
  for (const l of lens) {
    if (l.unit !== "px" && !(l.unit === "" && l.n === 0)) return null;
  }
  return {
    x: lens[0].n,
    y: lens[1].n,
    blur: lens.length > 2 ? lens[2].n : 0,
    spread: lens.length > 3 ? lens[3].n : 0,
    inset: isInset(layer),
  };
}

/** The composed shadow tokens this style ships, in both name spaces. */
const NM_SHADOW_TOKEN =
  /var\(\s*--(nm-(raised|pressed)-(sm|md|lg)|um-neumorphism-shadow-\d)/i;

/**
 * The defining move, detected. Doc §1 and §3: exactly two layers, equal blur,
 * mirrored offsets — `+D +D` in the dark colour and `-D -D` in the light one.
 * A reference to a composed `--nm-raised-*` / `--nm-pressed-*` token counts,
 * because that token is the pair.
 */
export function isNeumorphicPair(value, layers) {
  if (NM_SHADOW_TOKEN.test(value)) return true;
  const geo = layers.map(layerGeometry);
  for (let i = 0; i < geo.length; i++) {
    for (let j = i + 1; j < geo.length; j++) {
      const a = geo[i];
      const b = geo[j];
      if (!a || !b) continue;
      if (a.inset !== b.inset) continue;
      if (a.x === 0 && a.y === 0) continue;
      if (a.x === -b.x && a.y === -b.y) return true;
    }
  }
  return false;
}

/** Something in the selector that says "a user can operate this". */
const INTERACTIVE =
  /(^|[\s>+~,])(button|a|input|select|textarea|summary|label)\b|\[role=["']?(button|link|tab|menuitem|switch|checkbox|radio|option|slider)|:(hover|active|focus|focus-visible|checked|disabled)|\[(disabled|aria-pressed|aria-checked|aria-selected|aria-current|data-loading)|[-_a-z]*(btn|button|toggle|switch|tab|link|input|control|chip|slider|keypad|dial)s?(\b|[-_])/i;

/** Selectors that stand a real chance of repeating down a list or grid. */
const REPEATING =
  /(^|[\s>+~,])(li|tr|td|th|option)\b|:nth-(child|of-type)|\[role=["']?(listitem|row|option|gridcell|treeitem)|[-_a-z]*(item|row|cell|entry|result|slide|tile)s?(\b|[-_])/i;

/** A `<div>` or `<span>` dressed as a control. Doc §7: neumorphism adds no
 *  semantics, and forced-colors picks system colours from native elements. */
const FAKE_CONTROL =
  /(^|[\s>+~,])(div|span)(\.[-_a-z0-9]+)*\[role=["']?(button|link|switch|checkbox|radio|tab|slider|menuitem)/i;

/** First simple selector of each compound, minus pseudos and BEM modifiers.
 *  The doc's own recipe puts the border on `.nm-btn` and the pressed shadow on
 *  `.nm-btn:active`, so a per-rule border test alone would fire on correct
 *  code. */
function rootClasses(prelude) {
  return prelude
    .split(",")
    .map((s) => s.trim().split(/[\s>+~]+/)[0] || "")
    .map((s) => s.replace(/::?[a-z-]+(\([^)]*\))?/gi, ""))
    .map((s) => s.split("--")[0])
    .filter(Boolean);
}

/** Two deliberate absences. `border-color` on its own draws nothing, because the
 *  initial `border-style` is `none` — doc §6 uses it as the *state* carrier on an
 *  element that already has a border. And `outline` is this style's focus
 *  indicator (doc §7), which exists only while the control is focused, so it is
 *  not the resting boundary SC 1.4.11 asks about. Counting either would certify
 *  a control whose only real edge is still the shadow. */
const BORDER_PROP = /^(border|border-width|border-style|border-inline|border-block|border-top|border-right|border-bottom|border-left)$/;

/** A border declaration that actually draws something. */
function drawsBorder(d) {
  if (!BORDER_PROP.test(d.prop)) return false;
  const v = d.value.trim();
  if (isNone(v) || /^0(px)?(\s|$)/.test(v)) return false;
  return true;
}

/** The state carriers doc §6 and §13 anti-pattern 10 forbid a reduced-motion
 *  block from removing. Durations, transforms and the sheen may go. */
const STATE_CARRIER = /^(box-shadow|border|border-color|border-width|border-style|background|background-color|background-image|color|outline|outline-color|outline-width)$/;

/** A selector or at-rule prelude that establishes the dark theme. */
function isDarkContext(node) {
  return chain(node).some((n) =>
    (n.type === "atrule" && /prefers-color-scheme\s*:\s*dark/i.test(n.prelude)) ||
    (n.type === "rule" && /\[data-theme=["']?dark|(^|[\s>+~,.])dark(\b|[-_])/i.test(n.prelude)));
}

/* ------------------------------------------------------------------- checks */

function scanFile(file, text, add, state) {
  const root = parse(text);
  const nodes = [];
  walk(root, (n) => nodes.push(n));

  /* The page ground, so "this element's fill is its parent's fill" can be
     decided. Doc §3 item 1 is the non-negotiable rule and doc §13 anti-pattern
     4 refuses the violation, so the grounds are collected across the whole file
     first: the surface token is normally declared above the components. */
  for (const node of nodes) {
    for (const d of node.decls) {
      if (/^--(nm-surface|um-neumorphism-bg|um-neumorphism-surface-1)$/.test(d.prop)) {
        state.grounds.add(d.value.trim().toLowerCase());
      }
      if (/^(background|background-color)$/.test(d.prop) &&
          node.type === "rule" &&
          /(^|[\s>+~,])(html|body|:root)\b|[-_a-z]*(page|app|shell|canvas)s?(\b|[-_])/i.test(node.prelude)) {
        state.grounds.add(d.value.trim().toLowerCase());
      }
      if (/^--(nm-surface|um-neumorphism-bg)$/.test(d.prop)) {
        state.tokenRoot = true;
        if (isDarkContext(node)) {
          if (chain(node).some((n) => n.type === "atrule" && /prefers-color-scheme\s*:\s*dark/i.test(n.prelude))) {
            state.darkMedia = true;
          }
          if (chain(node).some((n) => n.type === "rule" && /\[data-theme=["']?dark/i.test(n.prelude))) {
            state.darkAttr = true;
          }
        }
      }
    }
  }

  /* Which root classes declare a real border anywhere in this file, in the
     mode the user actually browses in. A border declared only inside
     `forced-colors: active` or `@media print` does not answer the boundary
     question: it is the restoration block, and treating it as the boundary
     would certify precisely the interface doc §7 says vanishes. */
  const borderRoots = new Set();
  for (const node of nodes) {
    if (node.type !== "rule") continue;
    if (inAtRule(node, /forced-colors\s*:\s*active|(^|[\s,])print(\s|$|,)/i)) continue;
    if (!node.decls.some(drawsBorder)) continue;
    for (const rc of rootClasses(node.prelude)) borderRoots.add(rc);
  }

  /* The raised and inset distances seen per root class, for the 0.6x test. */
  const rungs = new Map();

  for (const node of nodes) {
    const decls = node.decls;
    const label = contextLabel(node);

    const shadows = decls.filter((d) => d.prop === "box-shadow" && !isNone(d.value));

    for (const d of shadows) {
      const layers = splitTop(d.value);
      const pair = isNeumorphicPair(d.value, layers);
      const geo = layers.map(layerGeometry);
      const readable = geo.filter(Boolean);
      const axes = new Set();

      if (pair) {
        state.surfaces.push({ file, line: d.line, selector: node.prelude });
        if (!hasVar(d.value)) {
          for (const g of readable) {
            const key = rootClasses(node.prelude).join("|");
            if (!rungs.has(key)) rungs.set(key, { raised: new Set(), pressed: new Set(), line: d.line });
            const bucket = g.inset ? "pressed" : "raised";
            rungs.get(key)[bucket].add(Math.abs(g.x));
          }
        }
      }

      /* Everything below judges the neumorphic pair specifically. A single
         soft shadow is not this style — doc §8's own cheap fallbacks are
         `0 2px 6px` and an asymmetric `6px 6px 12px, -2px -2px 6px`, both of
         which are deliberately off the ramp — so holding an arbitrary shadow
         to the ramp would fail correct code. */
      if (!pair) continue;

      /* 1 — the two-layer ceiling. Doc §8, §13 validation item 8. */
      if (layers.length > LAYER_MAX && !hasVar(d.value)) {
        add("error", "layer-budget", file, d.line,
          "`" + label + "` declares " + layers.length + " shadow layers. Doc §8 budgets " + LAYER_MAX + " per element — the cast shadow and the rim highlight — and allows four only on the §6 pseudo-element cross-fade, which puts two on `::before` and two on `::after` rather than four in one declaration.");
      }

      /* 2 — geometry. Doc §3 item 3, §4, §13 anti-pattern 9. */
      for (let i = 0; i < layers.length; i++) {
        const g = geo[i];
        if (!g) { if (hasVar(layers[i])) state.unresolvedLayers++; continue; }

        if (g.spread !== 0) {
          add("error", "shadow-spread", file, d.line,
            "`" + label + "` sets a shadow spread of " + g.spread + "px. Doc §4: spread grows the shadow's own silhouette away from the element, which breaks the same-hue illusion at any non-zero value, so every composed shadow in this style omits the component rather than routing a zero through a property someone could override. Doc §13 anti-pattern 9 refuses it and clamps to 0.");
        }

        const dist = Math.max(Math.abs(g.x), Math.abs(g.y));
        if (dist === 0) continue;
        const ratio = g.blur / dist;
        if (ratio < RATIO_MIN || ratio > RATIO_MAX) {
          add("error", "blur-ratio", file, d.line,
            "`" + label + "` has blur " + g.blur + "px against distance " + dist + "px, a ratio of " + ratio.toFixed(2) + ". Doc §13 anti-pattern 9 refuses and clamps anything outside [" + RATIO_MIN + ", " + RATIO_MAX + "]: below 1.5x the pair reads as a hard drop shadow, above 3x it is fog. The rule is blur = " + BLUR_RATIO + " x distance, which the generator's own slider handler enforces.");
        } else if (ratio !== BLUR_RATIO) {
          add("warn", "blur-ratio", file, d.line,
            "`" + label + "` has blur " + g.blur + "px against distance " + dist + "px, a ratio of " + ratio.toFixed(2) + ". Doc §3 item 3 sets blur = " + BLUR_RATIO + " x distance at every rung; the value is inside the refusal band but off the ramp.");
        }

        if (g.blur > BLUR_MAX) {
          add("error", "blur-ceiling", file, d.line,
            "blur " + g.blur + "px on `" + label + "` exceeds doc §8's absolute ceiling of " + BLUR_MAX + "px. Blur drives paint cost superlinearly in the blurred region's area: a 40px blur on a 300x80 button dirties roughly 2.8x the area of an 8px one, for a shadow most users cannot tell from the smaller one.");
        } else if (g.blur > BLUR_SCROLLER_MAX && inScroller(node)) {
          add("error", "blur-scroller", file, d.line,
            "blur " + g.blur + "px inside a scrolling container exceeds doc §8's " + BLUR_SCROLLER_MAX + "px cap. Inset shadows on scrollers are re-rasterised on every scroll offset change when the element is not on its own layer.");
        } else if (g.blur > BLUR_REPEAT_MAX && REPEATING.test(node.prelude)) {
          add("warn", "blur-repeat", file, d.line,
            "blur " + g.blur + "px on `" + label + "`, which matches a repeating list or grid item. Doc §8 caps those at " + BLUR_REPEAT_MAX + "px; on a 2019-class Android a 30-card grid at the ceiling drops frames during flings.");
        }

        /* 3 — one light source for the whole document. Doc §3 item 9,
           §13 anti-pattern 8. Recorded here, judged at project level.
           What is readable from geometry alone is the AXIS: a pair offset on
           the main diagonal is lit from the top-left or the bottom-right, and
           the two ends of that axis are told apart only by which of the two
           colours is the darker one — a colour comparison this script does not
           make, by design. Mixing top-left with top-right is caught here;
           mixing top-left with bottom-right is a review item, and the message
           says so. */
        if (!g.inset && g.x !== 0 && g.y !== 0) {
          axes.add(Math.sign(g.x) * Math.sign(g.y) > 0 ? "main-diagonal" : "anti-diagonal");
        }
      }

      for (const axis of axes) {
        state.lightSources.push({ key: axis, file, line: d.line, selector: node.prelude });
      }

      /* 4 — the refusal that defines this style. Doc §7 and §13 anti-pattern 1:
         the pair measures 1.23:1 and 1.59:1 against the light surface and
         1.37:1 and 1.30:1 against the dark one, so it cannot be a boundary. */
      if (pair && INTERACTIVE.test(node.prelude)) {
        const borderHere = chain(node).some((n) => n.decls.some(drawsBorder));
        const inherits = rootClasses(node.prelude).some((rc) => borderRoots.has(rc));
        if (!borderHere && !inherits) {
          add("error", "shadow-only-affordance", file, d.line,
            "`" + label + "` is interactive and its only boundary is the neumorphic pair. Doc §7: every same-hue pair in normal use lands between 1.2:1 and 1.7:1 against its own surface, against the 3:1 SC 1.4.11 requires, and no value of blur, distance or luminance delta closes that gap while the result still looks neumorphic. Forced-colors then deletes `box-shadow` outright, which removes 100% of the structure. Add `border: 1px solid var(--nm-hairline)` — 3.20:1 light, 3.31:1 dark — and carry state on `--nm-accent`.");
        }
      }

      /* 5 — the same-hue invariant. Doc §3 item 1, §13 anti-pattern 4. */
      if (pair) {
        const bg = decls.find((x) => /^(background|background-color)$/.test(x.prop));
        if (bg) {
          const v = bg.value.trim().toLowerCase();
          const isSurface =
            /var\(\s*--(nm-surface|nm-convex|nm-concave|um-neumorphism-(bg|surface-1))\s*[,)]/i.test(v) ||
            /^(inherit|transparent|currentcolor|initial|unset|revert)$/i.test(v) ||
            state.grounds.has(v);
          if (!isSurface) {
            add("warn", "same-hue", file, bg.line,
              "`" + label + "` carries the neumorphic pair over `" + bg.value + "`, which is not a known surface token or page ground. Doc §3 item 1: the element's fill must equal its parent's to within dL 0.02 OKLCH, and doc §10 is blunt about the alternative — a neumorphic shadow on a card whose fill differs from the page is a soft drop shadow wearing a costume. Static analysis cannot resolve the computed parent, so confirm this one by hand or fix the parent.");
          }
        }
      }

      /* 6 — a sunken control. Doc §4 and checklist B8: a sunken control loses
         the same-hue illusion, because the well is a different colour. */
      if (/var\(\s*--nm-surface-sunken/i.test(decls.map((x) => x.value).join(" ")) &&
          INTERACTIVE.test(node.prelude)) {
        add("warn", "sunken-control", file, d.line,
          "`" + label + "` is interactive and reads `--nm-surface-sunken`. Doc §4 reserves that token for large wells and never for controls: a control whose fill differs from its parent is not extruded from it.");
      }
    }

    /* 7 — the focus indicator. Doc §7 and §13 anti-pattern 2. The 3px / 3px
       floor is measured outside forced-colors only: the offset exists to clear
       the blurred halo, the user agent has already deleted that halo, and doc
       §5's own forced-colors block ships `outline: 3px solid Highlight` at 2px
       offset. Holding the restoration block to the halo-clearing floor would
       report the doc's own fix as a defect. */
    const forcedColorsFocus = inAtRule(node, /forced-colors\s*:\s*active/i);
    if (node.type === "rule" && /:focus(-visible)?\b/i.test(node.prelude)) {
      const outline = decls.filter((x) => /^outline(-width|-style|-color)?$/.test(x.prop) && !isNone(x.value));
      const focusShadow = decls.filter((x) => x.prop === "box-shadow" && !isNone(x.value));
      const drawsOutline = outline.some((x) => !/^0(px)?(\s|$)/.test(x.value.trim()));

      if (focusShadow.length > 0 && !drawsOutline) {
        add("error", "focus-shadow", file, focusShadow[0].line,
          "`" + node.prelude + "` builds its focus indicator from `box-shadow`. The element already carries a shadow at rest, so a shadow-shaped ring adds no state delta — and forced-colors deletes `box-shadow` entirely, leaving the control with no visible focus at all. Doc §7: `outline: " + OUTLINE_MIN + "px solid var(--nm-accent); outline-offset: " + OUTLINE_OFFSET_MIN + "px`, plus an `outline-color: Highlight` override inside `@media (forced-colors: active)`.");
      }

      for (const x of forcedColorsFocus ? [] : outline) {
        const m = /(-?\d*\.?\d+)px/.exec(stripFunctions(x.value));
        if (!m) continue;
        if (/^outline(-width)?$/.test(x.prop) && parseFloat(m[1]) < OUTLINE_MIN) {
          add("error", "focus-width", file, x.line,
            "`" + node.prelude + "` draws a " + m[1] + "px focus outline. This style's floor is " + OUTLINE_MIN + "px, above SC 2.4.13's minimum, because the ring has to clear the blurred halo rather than sit inside it (doc §7).");
        }
      }
      const offset = forcedColorsFocus ? undefined : decls.find((x) => x.prop === "outline-offset");
      if (offset && !hasVar(offset.value)) {
        const m = /(-?\d*\.?\d+)px/.exec(offset.value);
        if (m && parseFloat(m[1]) < OUTLINE_OFFSET_MIN) {
          add("error", "focus-offset", file, offset.line,
            "`" + node.prelude + "` sets `outline-offset: " + offset.value + "`. Doc §7 requires at least " + OUTLINE_OFFSET_MIN + "px so the ring clears the blurred shadow halo, and SC 2.4.11 fails when a sticky header's 40px blur swallows the focused control below it.");
        }
      }
      if (!/:focus-visible/i.test(node.prelude) && !/:focus-within/i.test(node.prelude)) {
        state.bareFocusRules.push({ file, line: node.line, selector: node.prelude });
      }
    }

    /* 8 — forced colors. Doc §7 is the hard stop: the user agent forces
       `box-shadow: none`, and 100% of this style's structure is box-shadow. */
    if (inAtRule(node, /forced-colors\s*:\s*active/i) && node.type === "rule") {
      state.forcedColorsRules++;
      const nullsShadow = decls.some((x) => x.prop === "box-shadow" && isNone(x.value));
      const border = decls.some(drawsBorder);
      if (border) state.forcedColorsBorders++;
      if (nullsShadow && !border) {
        add("error", "forced-colors-border", file, node.line,
          "`" + node.prelude + "` sets `box-shadow: none` inside `forced-colors: active` and declares no border. That is the state the user agent produces on its own; the block exists to put the structure back. Doc §5 and §7: `border: 2px solid ButtonText`, `background: Canvas`, `Highlight` / `HighlightText` for selected and `GrayText` for disabled.");
      }
      for (const x of decls) {
        if (x.prop === "box-shadow" && !isNone(x.value)) {
          add("warn", "forced-colors-shadow", file, x.line,
            "`" + node.prelude + "` declares a live `box-shadow` inside `forced-colors: active`. The user agent forces it to `none` regardless, so this reads as structure that is not there. Draw the boundary with a border instead.");
        }
        if (x.prop === "transform" && !isNone(x.value)) {
          add("warn", "forced-colors-transform", file, x.line,
            "`" + node.prelude + "` keeps a transform inside `forced-colors: active`. With the shadow deleted the translate is motion with nothing attached to it; zero it in the same block (checklist E2).");
        }
      }
    }

    /* 9 — reduced motion may zero a duration and nothing else. Doc §6 and
       §13 anti-pattern 10: a reduced-motion user who loses press feedback has
       lost information, not decoration. */
    if (inAtRule(node, /prefers-reduced-motion\s*:\s*reduce/i) && node.type === "rule") {
      state.reducedMotionRules++;
      for (const x of decls) {
        if (!STATE_CARRIER.test(x.prop)) continue;
        const strippingShadow = x.prop === "box-shadow" && isNone(x.value);
        if (strippingShadow || /^(none|initial|unset|revert|transparent)$/i.test(x.value.trim())) {
          add("error", "reduced-motion-state", file, x.line,
            "`" + node.prelude + "` sets `" + x.prop + ": " + x.value + "` inside `prefers-reduced-motion: reduce`. Only durations may be zeroed: doc §6 requires the pressed shadow and the accent border to still apply, instantly. Removing a state carrier here removes information, not decoration.");
        }
      }
    }

    /* 10 — what may not animate. Doc §6 and checklist E6. */
    for (const x of decls) {
      if (/^(transition|transition-property|animation|animation-name)$/.test(x.prop)) {
        if (/border-radius|(^|[\s,(])filter([\s,)]|$)/i.test(x.value)) {
          add("error", "animated-forbidden", file, x.line,
            "`" + x.prop + ": " + x.value + "` on `" + label + "` animates `border-radius` or `filter`. Doc §6 forbids both: the radius is the silhouette the whole extrusion is read from, and blurring the surface itself is not a state change in this style.");
        } else if (/(^|[\s,])all([\s,]|$)/i.test(x.value)) {
          add("warn", "animated-forbidden", file, x.line,
            "`" + x.prop + ": " + x.value + "` on `" + label + "` transitions `all`, which silently includes `border-radius`, `filter` and the surface colour — the three things doc §6 says must never animate. Name the properties.");
        }
      }
      if (x.prop === "will-change") {
        if (/box-shadow|filter/i.test(x.value)) {
          add("error", "will-change-paint", file, x.line,
            "`will-change: " + x.value + "` on `" + label + "` promises a layer for a paint-stage property, which does not make the blur cheaper. Doc §8: cross-fade two pseudo-elements' opacity instead, and put `will-change: opacity` only on the element currently being interacted with.");
        } else if (!INTERACTIVE.test(node.prelude)) {
          add("warn", "will-change-blanket", file, x.line,
            "`will-change: " + x.value + "` on `" + label + "`, which carries no interaction signal. Doc §8: never blanket-apply it — dozens of promoted layers blow GPU memory on exactly the mid-range devices this style already strains.");
        }
      }
    }

    /* 11 — keyframes that interpolate a forbidden property. */
    if (inAtRule(node, /@keyframes/i)) {
      for (const x of decls) {
        if (x.prop === "border-radius" || (x.prop === "filter" && !isNone(x.value))) {
          add("error", "animated-forbidden", file, x.line,
            "`@keyframes` step sets `" + x.prop + "`, interpolating it across every frame. Doc §6 forbids animating the radius and the surface blur.");
        }
      }
    }

    /* 12 — targets and fixed heights. Doc §4 --nm-target-min, checklist D2 and
       D5. Core owns the 24x24 measurement itself; what is style-specific is
       that this token sits at 44px on purpose and nothing may override it
       downward. */
    if (node.type === "rule" && INTERACTIVE.test(node.prelude)) {
      for (const x of decls) {
        if (hasVar(x.value)) continue;
        const m = /^(-?\d*\.?\d+)px$/.exec(x.value.trim());
        if (!m) continue;
        const n = parseFloat(m[1]);
        if (/^(min-height|min-width)$/.test(x.prop) && n < TARGET_MIN) {
          add(n < TARGET_FLOOR ? "error" : "warn", "target-min", file, x.line,
            "`" + label + "` sets `" + x.prop + ": " + x.value + "`, below `--nm-target-min` (" + TARGET_MIN + "px)" + (n < TARGET_FLOOR ? " and below SC 2.5.8's " + TARGET_FLOOR + "px floor" : "") + ". Doc §4 sets the token above the floor deliberately: the boundary measures 1.2:1 to 1.7:1 and cannot be aimed at precisely, and the blurred halo reads as part of the control but is not clickable, which biases pointing outward. When targets collide, widen the sibling gap — never shrink the target.");
        }
        if (/^(height|width)$/.test(x.prop)) {
          add("warn", "fixed-height", file, x.line,
            "`" + label + "` fixes `" + x.prop + ": " + x.value + "`. Doc §7 (SC 1.4.12): use `min-height` so a text-spacing override cannot clip the control. Hard-coding heights to keep the shadow geometry tidy is the documented way this style fails 1.4.12.");
        }
      }
    }

    /* 13 — a div dressed as a control. Doc §7 and the anti-patterns file. */
    if (node.type === "rule" && FAKE_CONTROL.test(node.prelude)) {
      add("warn", "fake-control", file, node.line,
        "`" + node.prelude + "` styles a `div` or `span` as a control. Neumorphism adds no semantics, which is exactly the risk: it makes a `div` look as clickable as a `button`, and forced-colors picks its system colours from native element semantics rather than ARIA roles. Use a real `<button>`, `<input>` or `<a>`; if a `div` is unavoidable it needs `role`, `tabindex=\"0\"` and key handlers for both Enter and Space.");
    }

    /* 14 — the sibling gap. Doc §3 item 12 and §10: 2 x distance + blur / 2. */
    for (const x of decls) {
      if (!/^(gap|row-gap|column-gap|grid-gap)$/.test(x.prop)) continue;
      if (hasVar(x.value)) continue;
      for (const part of x.value.trim().split(/\s+/)) {
        const m = /^(-?\d*\.?\d+)px$/.exec(part);
        if (m && parseFloat(m[1]) < GAP_MIN_SM) {
          add("warn", "sibling-gap", file, x.line,
            "`" + label + "` sets `" + x.prop + ": " + x.value + "`. Doc §3 item 12 and §10 want at least `2 x distance + blur / 2` between extruded siblings — " + GAP_MIN_SM + "px at the sm rung and 24px at md. Below that the shadow halos overlap and read as grey mud.");
          break;
        }
      }
    }

    /* 15 — file-level signals the project checks aggregate. */
    if (node.type === "atrule") {
      if (/forced-colors/i.test(node.prelude)) state.queries.add("forced-colors");
      if (/prefers-reduced-motion/i.test(node.prelude)) state.queries.add("prefers-reduced-motion");
      if (/prefers-reduced-transparency/i.test(node.prelude)) state.queries.add("prefers-reduced-transparency");
      if (/update\s*:\s*slow/i.test(node.prelude)) state.queries.add("update-slow");
    }
  }

  /* 16 — the pressed rung against 0.6x its raised counterpart. Doc §4: pressed
     depth reads deeper than it measures, so --nm-pressed-sm is 3px against
     --nm-d-sm's 5px and --nm-pressed-md is 5px against --nm-d-md's 8px. */
  for (const [key, rung] of rungs) {
    if (rung.raised.size === 0 || rung.pressed.size === 0) continue;
    const raisedMax = Math.max(...rung.raised);
    const expected = Math.round(raisedMax * PRESSED_RATIO);
    for (const p of rung.pressed) {
      if (Math.abs(p - expected) <= 1) continue;
      add("warn", "pressed-ratio", file, rung.line,
        "`" + key + "` pairs a raised distance of " + raisedMax + "px with a pressed distance of " + p + "px. Doc §4 scales the pressed rung to " + PRESSED_RATIO + "x its raised counterpart — " + expected + "px here — because pressed depth reads deeper than it measures. The ratio is applied by hand when the value is authored; CSS cannot round a calc() to the whole pixels this effect needs.");
    }
  }
}

/** True when this rule, or one of its ancestors, is a scrolling container. */
function inScroller(node) {
  return chain(node).some((n) =>
    n.decls.some((d) => /^overflow(-x|-y)?$/.test(d.prop) && /\b(auto|scroll)\b/i.test(d.value)));
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
    lightSources: [],
    bareFocusRules: [],
    grounds: new Set(),
    queries: new Set(),
    forcedColorsRules: 0,
    forcedColorsBorders: 0,
    reducedMotionRules: 0,
    unresolvedLayers: 0,
    tokenRoot: false,
    darkMedia: false,
    darkAttr: false,
  };

  for (const { file, text } of inputs) scanFile(file, text, add, state);

  /* Project-level checks. Deliberately not per-file: doc §13's output list puts
     the guard blocks in their own `styles/neumorphism.layer.css`, so a per-file
     assertion would fire on a correctly split codebase. */
  if (state.surfaces.length > 0) {
    if (!state.queries.has("forced-colors")) {
      add("error", "forced-colors-missing", "(project)", 0,
        "No `@media (forced-colors: active)` block found in the scanned files, but " + state.surfaces.length + " neumorphic surface(s) were. Doc §7 is the hard stop: the user agent forces `box-shadow: none`, and 100% of this style's structure is box-shadow, so every control becomes an unbordered rectangle of Canvas on Canvas. Doc §13 anti-pattern 3 refuses to write files without this block.");
    }
    if (!state.queries.has("prefers-reduced-motion")) {
      add("error", "reduced-motion-missing", "(project)", 0,
        "No `@media (prefers-reduced-motion: reduce)` block found alongside " + state.surfaces.length + " neumorphic surface(s). Doc §6: durations collapse to 1ms and the translate and the loading sheen come off, while the pressed shadow and the accent border still apply.");
    }
    if (!state.queries.has("prefers-reduced-transparency")) {
      add("warn", "reduced-transparency-missing", "(project)", 0,
        "No `@media (prefers-reduced-transparency: reduce)` block found. The style has no translucency, so the query does not strictly apply — doc §6 honours it anyway as a proxy for \"this user wants plainer surfaces\": drop to a single 2px/6px shadow and raise the hairline.");
    }
    if (!state.queries.has("update-slow")) {
      add("warn", "low-end-fallback-missing", "(project)", 0,
        "No `@media (update: slow)` block found. Doc §5's low-end fallback pairs it with the narrow-viewport reduced-transparency branch and drops the pair to a single `0 2px 6px` shadow, which is what keeps fling scrolling smooth on a 2019-class Android.");
    }

    if (state.forcedColorsRules > 0 && state.forcedColorsBorders === 0) {
      add("error", "forced-colors-border", "(project)", 0,
        "A `forced-colors: active` block exists but no rule inside it declares a border. Doc §5's block puts `border: 2px solid ButtonText` on every surface that was defined by shadow alone; without it the block changes nothing the user agent had not already done.");
    }

    const keys = new Set(state.lightSources.map((s) => s.key));
    if (keys.size > 1) {
      const byKey = new Map();
      for (const s of state.lightSources) {
        if (!byKey.has(s.key)) byKey.set(s.key, s);
      }
      const sample = [...byKey.entries()]
        .map(([axis, s]) => axis + " on `" + s.selector + "` (" + s.file + ":" + s.line + ")")
        .join("; ");
      add("error", "mixed-light-source", "(project)", 0,
        "Both shadow axes are in use across the scanned files: " + sample + ". Doc §3 item 9: one of the four diagonals, top-left by default at gradient angle 145deg, and every extruded element on the page must agree — mixed diagonals are the most common amateur tell. Doc §13 anti-pattern 8 refuses them and normalises to the single `lightSource` input. Note the limit of a static read: the two ends of one axis — top-left against bottom-right — are told apart only by which of the two shadow colours is darker, which this script does not compare, so agreeing axes still need one visual pass.");
    }

    if (state.surfaces.length > ELEMENTS_FAIL) {
      add("error", "element-census", "(project)", 0,
        state.surfaces.length + " neumorphic surfaces declared across the scanned files, against doc §13 validation item 9, which fails above " + ELEMENTS_FAIL + " per route and warns above " + ELEMENTS_WARN + ". A declaration count is a proxy for a viewport count, not a measurement of one — confirm how many render together, then narrow the scope with the coverage knob.");
    } else if (state.surfaces.length > ELEMENTS_WARN) {
      add("warn", "element-census", "(project)", 0,
        state.surfaces.length + " neumorphic surfaces declared across the scanned files, above doc §8's budget of " + ELEMENTS_WARN + " in the initial viewport. Doc §10: restrict the treatment to controls and one hero surface and keep lists, tables and text blocks flat, because a fully neumorphic screen has no hierarchy — everything sits at the same depth.");
    }

    if (state.bareFocusRules.length > 0) {
      const sample = state.bareFocusRules.slice(0, 5).map((r) => r.selector).join(", ");
      add("warn", "focus-visible", "(project)", 0,
        state.bareFocusRules.length + " rule(s) style `:focus` rather than `:focus-visible`: " + sample + (state.bareFocusRules.length > 5 ? ", …" : "") + ". Doc §7: a pressed neumorphic button that keeps a ring after a mouse click looks broken and trains people to ignore rings.");
    }

    if (state.unresolvedLayers > 0) {
      add("info", "blur-ratio", "(project)", 0,
        state.unresolvedLayers + " shadow layer(s) express a length through `var()`, so the blur-to-distance ratio, the spread and the light source were not statically readable and were not checked. The composed `--nm-raised-*` and `--nm-pressed-*` tokens are written this way on purpose — the ramp is the point — so this is expected for the token layer and worth a look anywhere else.");
    }
  }

  if (state.tokenRoot && !(state.darkMedia && state.darkAttr)) {
    add("error", "dark-pair", "(project)", 0,
      "The surface token is declared, but the dark values are not in both required places" +
      (state.darkMedia ? "" : " — no `@media (prefers-color-scheme: dark) { :root:not([data-theme=\"light\"]) }` block") +
      (state.darkAttr ? "" : " — no `:root[data-theme=\"dark\"]` block") +
      ". Doc §4 declares them twice so a system preference and an explicit toggle both win; a partial override is what leaves half the palette on the light theme's values.");
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
      neumorphicSurfaces: state.surfaces.length,
      lightSources: [...new Set(state.lightSources.map((s) => s.key))].sort(),
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
      "neu-scan.mjs — neumorphism-specific static invariants\n\n" +
      "  node neu-scan.mjs [path ...] [--json] [--quiet] [--no-fail]\n\n" +
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
      summary.neumorphicSurfaces + " neumorphic surface(s), light source(s) " +
      (summary.lightSources.join(" / ") || "n/a") + ".\n" +
      "Accessibility queries present: " + (summary.a11yQueriesFound.join(", ") || "none") + ".\n" +
      summary.errors + " error(s), " + summary.warnings + " warning(s), " + summary.infos + " info.\n" +
      "Contrast, focus, target size and forced-colors keyword checks are not run here — call ui-morphism-core:a11y-validate.\n");
  }

  return !noFail && summary.errors > 0 ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
