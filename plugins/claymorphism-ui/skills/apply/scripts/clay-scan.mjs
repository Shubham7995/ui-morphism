#!/usr/bin/env node
/**
 * clay-scan.mjs — claymorphism-specific static invariants.
 *
 * Source of truth: docs/04-claymorphism.md §13 (the validation checklist the
 * skill must self-run, and the anti-pattern list it must refuse), §8 (the blur
 * ceiling, the layer budget and the paint-stage argument), §6 (what may and may
 * not animate), §5 (the forced-colors block and the per-surface hue map), §4
 * (the token block, --clay-blur-max, --clay-gap).
 *
 * SCOPE. This script checks only what is specific to this style and mechanical
 * enough to be got wrong by accident:
 *
 *   - the four-layer ceiling and the 68px / 48px blur ceilings
 *   - neutral rgba(0,0,0,a) drop shadows where a hue-matched one belongs
 *   - a clay surface whose background equals the page ground, which is
 *     neumorphism rather than claymorphism
 *   - a forced-colors block that nulls box-shadow without restoring a border,
 *     which is how a clay component loses its only boundary
 *   - forced-color-adjust: none
 *   - box-shadow and border-radius inside transitions and keyframes
 *   - will-change: box-shadow
 *   - inset inside text-shadow, which no engine supports
 *   - the dark-mode sheen/shade alpha band — doc §13 item 8's chalky-grey guard
 *   - the four required media blocks, the grid-gap floor and the surface census
 *
 * It computes NO contrast ratio, NO relative luminance and NO alpha
 * compositing. Those are the nine universal checks and they belong to
 * ui-morphism-core:a11y-validate, which is the single implementation in this
 * marketplace. Do not add them here. The one place this file reads an alpha at
 * all is the dark sheen/shade band, which is a threshold comparison against two
 * numbers doc §13 states outright; nothing is composited and nothing is
 * measured against a WCAG figure.
 *
 * Usage:
 *   node clay-scan.mjs [path ...] [--json] [--quiet] [--no-fail]
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

/** Doc §4: --clay-blur-max, the per-layer perf budget argued in §8. */
const BLUR_MAX = 68;

/** Doc §8 budget, doc §13 validation item 3: anything that repeats. */
const BLUR_REPEAT_MAX = 48;

/** Doc §8: four layers per element — rim, sheen, shade, drop. */
const LAYER_MAX = 4;

/** Doc §8: clay elements per viewport. A per-file count is a proxy for it. */
const SURFACE_BUDGET = 40;

/** Doc §3 and §4 --clay-gap: below this, drop shadows overlap and read as mud. */
const GAP_MIN = 24;

/** Doc §13 validation item 8, the chalky-grey guard. */
const DARK_SHEEN_MAX = 0.2;
const DARK_SHADE_MIN = 0.45;

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
 * `hsl(258 60% 45% / .28)` or `var(--x, 1px)` does not split a shadow layer in
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

const isNone = (v) => /^none$/i.test(v.trim());
const hasVar = (v) => /var\(/i.test(v);

/** Remove every balanced function call, so `hsl(258 60% 45% / .28)` cannot
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

/**
 * The lengths of one box-shadow layer, in declaration order: x, y, blur,
 * spread. Only `px` is resolved — `rem`, `em` and `var()` are reported as
 * unresolved rather than guessed at, because a wrong number here would be a
 * finding against code that is correct.
 */
function layerLengths(layer) {
  const bare = stripFunctions(layer);
  const out = [];
  const re = /(-?\d*\.?\d+)(px|rem|em|%)?/g;
  let m;
  while ((m = re.exec(bare)) !== null) {
    out.push({ n: parseFloat(m[1]), unit: m[2] || "" });
  }
  return out;
}

/** The blur radius of one shadow layer in px, or null when it is not statically
 *  readable (a `var()`, or a unit this script refuses to convert). */
function layerBlurPx(layer) {
  if (hasVar(layer)) return null;
  const lens = layerLengths(layer);
  if (lens.length < 3) return null;
  const blur = lens[2];
  return blur.unit === "px" ? blur.n : null;
}

/** Neutral-black shadow colour: the 2022 default doc §3 and §10 rule out. */
const NEUTRAL_BLACK =
  /rgba?\(\s*0\s*[,\s]\s*0\s*[,\s]\s*0\s*[,/)]|#000(?![0-9a-f])|#000000(?![0-9a-f])|\bblack\b|hsla?\(\s*0\s+0%\s+0%/i;

/** A clay stack is the composite doc §3 describes: at least one inset layer and
 *  at least one outer layer, or a reference to a composed clay token. */
function isClayStack(value, layers) {
  if (/var\(\s*--(clay-[1-4]|clay-pressed|um-claymorphism-shadow-)/i.test(value)) return true;
  const hasInset = layers.some((l) => /(^|\s)inset(\s|$)/i.test(l));
  const hasOuter = layers.some((l) => !/(^|\s)inset(\s|$)/i.test(l));
  return hasInset && hasOuter;
}

/**
 * Selectors that stand a real chance of repeating down a list or grid. Split in
 * two because the cost of a false positive differs: the strong list is
 * structural and gets an error, the weak list is a naming convention and gets a
 * warning, so a `.clay-card` used once for a hero does not fail a run.
 */
const REPEATING_STRONG =
  /(^|[\s>+~,])(li|tr|td|th|option)\b|:nth-(child|of-type)|\[role=["']?(listitem|row|option|gridcell|treeitem)|[-_a-z]*(item|row|cell|entry|result|slide|option)s?(\b|[-_])/i;
const REPEATING_WEAK = /[-_a-z]*(card|tile|chip|thumb|thumbnail|avatar|pill|badge)s?(\b|[-_])/i;

/** Something in the selector that says "a user can operate this". */
const INTERACTIVE =
  /(^|[\s>+~,])(button|a|input|select|textarea|summary|label)\b|\[role=["']?(button|link|tab|menuitem|switch|checkbox|radio|option)|:(hover|active|focus|focus-visible|checked|disabled)|\[(disabled|aria-pressed|aria-selected|aria-current|data-loading)|[-_a-z]*(btn|button|toggle|switch|tab|link|input|control|chip|nav)s?(\b|[-_])/i;

/** Alpha as written in `hsl(... / .14)` or `rgba(..., .14)` — the LAST slash or
 *  comma group in the layer's colour. Percent forms are normalised to a
 *  fraction, which is division by 100 and nothing else: this script composites
 *  nothing and computes no ratio. */
function trailingAlpha(value) {
  const m = /[/,]\s*(\d*\.?\d+)(%?)\s*\)/.exec(value);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (Number.isNaN(n)) return null;
  return m[2] === "%" ? n / 100 : n;
}

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

  /* Ground values, so "this surface is the page background" can be decided.
     Doc §12: a same-coloured surface is neumorphism, and doc §7 explains why it
     is also the 1.4.11 failure. Collected across the whole file first, because
     the ground is normally declared above the components that must not match
     it. */
  for (const node of nodes) {
    for (const d of node.decls) {
      if (d.prop === "--clay-bg" || d.prop === "--um-claymorphism-bg") {
        state.grounds.add(d.value.trim().toLowerCase());
      }
      if (/^(background|background-color)$/.test(d.prop) &&
          node.type === "rule" &&
          /(^|[\s>+~,])(html|body|:root)\b|[-_a-z]*(page|app|shell|canvas)s?(\b|[-_])/i.test(node.prelude)) {
        state.grounds.add(d.value.trim().toLowerCase());
      }
    }
  }

  for (const node of nodes) {
    const decls = node.decls;
    const label = contextLabel(node);

    /* --- box-shadow, the whole style ------------------------------------- */

    const shadows = decls.filter((d) => d.prop === "box-shadow" && !isNone(d.value));

    for (const d of shadows) {
      const layers = splitTop(d.value);
      const clay = isClayStack(d.value, layers);

      if (clay) {
        state.surfaces.push({ file, line: d.line, selector: node.prelude });
      }

      /* 1 — layer ceiling. Doc §8 budget, §13 validation item 3. */
      if (layers.length > LAYER_MAX && !hasVar(d.value)) {
        add("error", "layer-budget", file, d.line,
          "`" + label + "` declares " + layers.length + " shadow layers. The recipe is exactly four — rim, sheen, shade, drop — and doc §8 caps it there: four layers on forty visible elements is 160 blur rasterisations per full paint.");
      }

      /* 2 — blur ceilings. Doc §4 --clay-blur-max, §8 budget, §13 item 3. */
      let unresolved = 0;
      for (const layer of layers) {
        const px = layerBlurPx(layer);
        if (px === null) { if (hasVar(layer)) unresolved++; continue; }
        if (px > BLUR_MAX) {
          add("error", "blur-ceiling", file, d.line,
            "blur(" + px + "px) on `" + label + "` exceeds --clay-blur-max (" + BLUR_MAX + "px). Doc §8: a 68px blur samples an area roughly 18x a 16px one, and --clay-drop-4 is drawn at exactly the ceiling, so nothing may sit above it.");
        } else if (px > BLUR_REPEAT_MAX && REPEATING_STRONG.test(node.prelude)) {
          add("error", "blur-repeat", file, d.line,
            "blur(" + px + "px) on `" + label + "`, which matches a repeating list or grid item. Doc §8 budget and §13 validation item 3 cap repeated elements at " + BLUR_REPEAT_MAX + "px; a virtualised list re-rasterises this on every scroll tick.");
        } else if (px > BLUR_REPEAT_MAX && REPEATING_WEAK.test(node.prelude)) {
          add("warn", "blur-repeat", file, d.line,
            "blur(" + px + "px) on `" + label + "`. The selector is named like a repeated surface; doc §8 caps anything that repeats at " + BLUR_REPEAT_MAX + "px and reserves the " + BLUR_MAX + "px rung for modals. Confirm this renders once per view.");
        }
      }
      if (unresolved > 0) state.unresolvedBlurLayers += unresolved;

      /* 3 — hue-matched drop shadow. Doc §3, §10, §13 anti-pattern. */
      for (const layer of layers) {
        if (/(^|\s)inset(\s|$)/i.test(layer)) continue;
        if (!NEUTRAL_BLACK.test(layer)) continue;
        add(clay ? "error" : "warn", "neutral-drop", file, d.line,
          "`" + label + "` drops a neutral black shadow (`" + layer + "`). Doc §3 and §10: the drop shadow is tinted with the surface hue at 28-35% alpha, and `rgba(0,0,0,.25)` — the 2022 default — is the fastest way to make clay look cheap. Route it through --clay-shadow-h / -s / -l.");
      }

      /* 4 — the surface must own its colour. Doc §10, §12, §13 anti-pattern. */
      if (clay) {
        const bg = decls.find((x) => /^(background|background-color)$/.test(x.prop));
        if (bg) {
          const v = bg.value.trim().toLowerCase();
          if (state.grounds.has(v) || /var\(\s*--clay-bg\s*[,)]/i.test(v) || /var\(\s*--um-claymorphism-bg\s*[,)]/i.test(v)) {
            add("error", "surface-equals-ground", file, bg.line,
              "`" + label + "` carries the full clay stack over `" + bg.value + "`, which is the page ground. Doc §1 and §12: an element extruded out of a background it shares a colour with is neumorphism, not claymorphism, and doc §7 makes it the 1.4.11 failure as well. Give the surface its own colour — that independence is the whole reason clay passes contrast checks.");
          }
        }
      }
    }

    /* 5 — inset inside text-shadow. Doc §2: text cannot take inset shadows at
       all, so raised type is faked with two opposing offsets. */
    for (const d of decls) {
      if (d.prop !== "text-shadow") continue;
      if (/(^|\s)inset(\s|$)/i.test(d.value)) {
        add("error", "inset-text-shadow", file, d.line,
          "`" + label + "` puts `inset` in a `text-shadow`. No engine supports it — the whole declaration is dropped, so the type silently loses its treatment. Doc §2: fake raised text with two opposing `text-shadow` offsets instead.");
      }
    }

    /* 6 — what may not animate. Doc §6, §8, §13 validation item 9. */
    for (const d of decls) {
      if (/^(transition|transition-property|animation|animation-name)$/.test(d.prop)) {
        if (/border-radius/i.test(d.value)) {
          add("error", "animated-radius", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + label + "` animates `border-radius`. Doc §6: it forces a re-layout of the clip path and destroys the corner-smoothing illusion mid-flight.");
        }
        if (/box-shadow/i.test(d.value)) {
          const repeats = REPEATING_STRONG.test(node.prelude);
          add(repeats ? "error" : "warn", "animated-shadow", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + label + "` interpolates `box-shadow`" + (repeats ? ", and the selector matches a repeating list or grid item. Doc §13 validation item 9 fails this outright" : ". Doc §8: box-shadow is a paint-stage property, so every frame re-rasterises the blur") + ". Animate `transform` and cross-fade an absolutely positioned `::after` carrying the hover shadow — opacity is compositor-only.");
        } else if (/(^|[\s,])all([\s,]|$)/i.test(d.value)) {
          add("warn", "animated-shadow", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + label + "` transitions `all`, which silently includes `box-shadow` and `border-radius`. Name the properties.");
        }
      }
      if (d.prop === "will-change" && /box-shadow/i.test(d.value)) {
        add("error", "will-change-shadow", file, d.line,
          "`will-change: " + d.value + "` on `" + label + "`. Doc §8 calls this a trap by name: it allocates a layer without making the blur any cheaper, and dozens of promoted layers exhaust GPU memory on low-end devices. Use `will-change: transform` on at most the element being interacted with, and remove it afterwards.");
      }
    }

    /* 7 — keyframes that interpolate the shadow or the radius. */
    if (inAtRule(node, /@keyframes/i)) {
      for (const d of decls) {
        if (d.prop === "box-shadow" && !isNone(d.value)) {
          add("error", "animated-shadow", file, d.line,
            "`@keyframes` step sets `box-shadow`, interpolating a blur across every frame of the animation (doc §6, §8).");
        }
        if (d.prop === "border-radius") {
          add("error", "animated-radius", file, d.line,
            "`@keyframes` step sets `border-radius` (doc §6: never animate it).");
        }
      }
    }

    /* 8 — forced colors. Doc §5, §7, §13 validation item 4. Clay's boundary IS
       the shadow, and forced-colors forces `box-shadow: none`, so a block that
       nulls the shadow and stops there leaves the component with no boundary at
       all. */
    if (inAtRule(node, /forced-colors\s*:\s*active/i) && node.type === "rule") {
      state.forcedColorsRules++;
      const nullsShadow = decls.some((d) => d.prop === "box-shadow" && isNone(d.value));
      const border = decls.find((d) =>
        /^(border|border-width|border-style|border-inline|border-block|outline)$/.test(d.prop) &&
        !isNone(d.value) && !/^0(px)?\s/.test(d.value.trim()));
      if (border) state.forcedColorsBorders++;
      if (nullsShadow && !border) {
        add("error", "forced-colors-border", file, node.line,
          "`" + node.prelude + "` sets `box-shadow: none` inside `forced-colors: active` without declaring a border. Clay's entire boundary is the shadow, so this leaves the component as an undifferentiated block of Canvas. Doc §5 and §7: restore it with `border: var(--clay-border-hc)` — the `2px solid ButtonText` token, declared once in §4 so the two forced-colors blocks cannot drift apart.");
      }
    }

    for (const d of decls) {
      if (d.prop === "forced-color-adjust" && isNone(d.value)) {
        add("error", "forced-color-adjust", file, d.line,
          "`forced-color-adjust: none` on `" + label + "`. Doc §5 records a deliberate divergence from siblings 01, 02 and 03: clay does NOT opt out of the forced palette, because its boundary story is fill-vs-fill and the correct behaviour is to let the system colours win and rebuild the edge with a real border. Doc §7: keeping the look this way defeats the user's stated preference.");
      }
    }

    /* 9 — the dark-mode chalky-grey guard. Doc §13 validation item 8. A
       threshold comparison against two numbers the doc states; no compositing,
       no ratio, no WCAG constant. */
    if (isDarkContext(node)) {
      for (const d of decls) {
        if (!/^--(clay|um-claymorphism)-(rim|sheen|shade)$/.test(d.prop)) continue;
        const a = trailingAlpha(d.value);
        if (a === null) continue;
        const isShade = /shade$/.test(d.prop);
        if (isShade && a < DARK_SHADE_MIN) {
          add("error", "dark-alpha-band", file, d.line,
            "Dark `" + d.prop + "` alpha is " + a + ", below the " + DARK_SHADE_MIN + " floor in doc §13 validation item 8. Dark clay whose shade is not re-derived reads as chalky grey plastic; doc §4's dark block ships 0.55.");
        }
        if (!isShade && a > DARK_SHEEN_MAX) {
          add("error", "dark-alpha-band", file, d.line,
            "Dark `" + d.prop + "` alpha is " + a + ", above the " + DARK_SHEEN_MAX + " ceiling in doc §13 validation item 8. Doc §4's dark block ships rim 0.10 and sheen 0.14 — the sheen must drop hard or dark clay looks chalky.");
        }
      }
      state.darkBlocks++;
    }

    /* 10 — grid gaps. Doc §3 and §4 --clay-gap: overlapping clay shadows look
       like mud. */
    for (const d of decls) {
      if (!/^(gap|row-gap|column-gap|grid-gap)$/.test(d.prop)) continue;
      if (hasVar(d.value)) continue;
      for (const part of d.value.trim().split(/\s+/)) {
        const m = /^(-?\d*\.?\d+)px$/.exec(part);
        if (m && parseFloat(m[1]) < GAP_MIN) {
          add("warn", "grid-gap", file, d.line,
            "`" + label + "` sets `" + d.prop + ": " + d.value + "`. Doc §3 and §4 (`--clay-gap`) want at least " + GAP_MIN + "px between clay elements so the drop shadows never overlap; below that they merge and read as mud.");
          break;
        }
      }
    }

    /* 11 — affordance. Doc §7 SC 1.4.1 and §13 step 3: the full stack is
       reserved for elements that can be proven interactive; static panels take
       --clay-drop-1 only. Recorded per rule and judged at project level, since
       "static cards look identical to buttons" is a comparison, not a property
       of one rule. */
    for (const d of shadows) {
      const layers = splitTop(d.value);
      if (!isClayStack(d.value, layers)) continue;
      const rec = { file, line: d.line, selector: node.prelude };
      if (INTERACTIVE.test(node.prelude)) state.interactiveStacks.push(rec);
      else state.staticStacks.push(rec);
    }

    /* 12 — file-level signals the project checks aggregate. */
    if (node.type === "atrule") {
      if (/forced-colors/i.test(node.prelude)) state.queries.add("forced-colors");
      if (/prefers-reduced-motion/i.test(node.prelude)) state.queries.add("prefers-reduced-motion");
      if (/prefers-reduced-data/i.test(node.prelude)) state.queries.add("prefers-reduced-data");
      if (/prefers-reduced-transparency/i.test(node.prelude)) state.queries.add("prefers-reduced-transparency");
      if (/max-width\s*:\s*(4[0-9][0-9]|[1-3]?[0-9]?[0-9])px/i.test(node.prelude)) state.queries.add("small-screen");
    }
  }

  /* Doc §8 and §13's last anti-pattern: a Spline or WebGL scene above the fold
     on mobile. Detected on the raw source because it is a script tag or an
     import, not a declaration. */
  if (/spline-viewer|@splinetool|splinetool\/runtime|prod\.spline\.design/i.test(text)) {
    state.splineRefs.push(file);
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
    interactiveStacks: [],
    staticStacks: [],
    grounds: new Set(),
    queries: new Set(),
    splineRefs: [],
    forcedColorsRules: 0,
    forcedColorsBorders: 0,
    darkBlocks: 0,
    unresolvedBlurLayers: 0,
  };

  for (const { file, text } of inputs) scanFile(file, text, add, state);

  /* Project-level checks. Deliberately not per-file: doc §13's output list puts
     the four escape hatches in their own `clay-fallbacks.css` partial, so a
     per-file assertion would fire on a correctly split codebase. */
  if (state.surfaces.length > 0) {
    const required = [
      ["forced-colors", "Doc §7 and §13 validation item 4: forced-colors forces `box-shadow: none`, and clay's whole structure is the shadow, so every component needs a block that puts a real border back."],
      ["prefers-reduced-motion", "Doc §6 and §13 validation item 5: the press spring and hover lift come off, and each state must still produce a non-animated visual delta."],
      ["prefers-reduced-data", "Doc §8: below this query the blurs halve and the treatment drops to --clay-1."],
      ["small-screen", "Doc §8: the `(max-width: 480px)` branch is the other half of the same fallback — --clay-drop-3 to `0 12px 22px -8px`, --clay-drop-4 to `0 18px 32px -10px`, --clay-rim to none."],
    ];
    for (const [q, why] of required) {
      if (!state.queries.has(q)) {
        add("error", "a11y-blocks", "(project)", 0,
          "No `" + (q === "small-screen" ? "@media (max-width: 480px)" : "@media (" + q + ")") + "` block found in the scanned files, but " + state.surfaces.length + " clay surface(s) were. " + why);
      }
    }

    if (state.forcedColorsRules > 0 && state.forcedColorsBorders === 0) {
      add("error", "forced-colors-border", "(project)", 0,
        "A `forced-colors: active` block exists but no rule inside it declares a border. Doc §5's block sets `border: var(--clay-border-hc)` on every generated class; without it the components lose their only boundary in Windows High Contrast Mode.");
    }

    if (state.surfaces.length > SURFACE_BUDGET) {
      add("warn", "surface-budget", "(project)", 0,
        state.surfaces.length + " clay surfaces declared across the scanned files, against doc §8's budget of " + SURFACE_BUDGET + " per viewport. A declaration count is a proxy for a viewport count, not a measurement of one — confirm how many render together before treating this as a pass or a fail.");
    }

    if (state.staticStacks.length > 0 && state.interactiveStacks.length > 0) {
      const sample = state.staticStacks.slice(0, 5).map((s) => s.selector).join(", ");
      add("warn", "affordance-split", "(project)", 0,
        state.staticStacks.length + " selector(s) carry the full clay stack with no interactive signal, alongside " + state.interactiveStacks.length + " that do: " + sample + (state.staticStacks.length > 5 ? ", …" : "") + ". Doc §7 (SC 1.4.1) and §13 step 3: the full inset-plus-drop stack is reserved for elements that can be proven interactive, and static panels take --clay-drop-1 only. Applying it to both recreates neumorphism's everything-looks-pressable problem in a new costume.");
    }

    if (state.darkBlocks === 0) {
      add("warn", "dark-block", "(project)", 0,
        "No dark-theme block found alongside the clay surfaces. Doc §13's last anti-pattern refuses any output that omits the dark-mode block when `darkMode` is not `none`, and doc §4 requires the values twice — under the guarded media query and under `:root[data-theme=\"dark\"]`.");
    }

    if (state.unresolvedBlurLayers > 0) {
      add("info", "blur-ceiling", "(project)", 0,
        state.unresolvedBlurLayers + " shadow layer(s) express a length through `var()`, so their blur radius is not statically readable and was not checked against the " + BLUR_MAX + "px / " + BLUR_REPEAT_MAX + "px ceilings. `--clay-drop-4` is written this way on purpose — it is drawn at exactly `--clay-blur-max` — so this is expected for the token layer and worth a look anywhere else.");
    }
  }

  for (const file of state.splineRefs) {
    add("warn", "spline-above-fold", file, 0,
      "A Spline or WebGL 3D scene is referenced here. Doc §8: a Spline scene ships a WebGL runtime plus geometry in the 1-4MB range and holds the GPU, and doc §13's anti-pattern list refuses one above the fold on a mobile breakpoint. Static analysis cannot tell where it sits in the page — confirm it is below the fold or behind an interaction, and keep clay illustrations at or under 150KB as AVIF/WebP.");
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
      claySurfaces: state.surfaces.length,
      interactiveStacks: state.interactiveStacks.length,
      staticStacks: state.staticStacks.length,
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
      "clay-scan.mjs — claymorphism-specific static invariants\n\n" +
      "  node clay-scan.mjs [path ...] [--json] [--quiet] [--no-fail]\n\n" +
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
      summary.claySurfaces + " clay surface(s): " +
      summary.interactiveStacks + " interactive, " + summary.staticStacks + " static.\n" +
      "Accessibility queries present: " + (summary.a11yQueriesFound.join(", ") || "none") + ".\n" +
      summary.errors + " error(s), " + summary.warnings + " warning(s), " + summary.infos + " info.\n" +
      "Contrast, focus, target size and forced-colors keyword checks are not run here — call ui-morphism-core:a11y-validate.\n");
  }

  return !noFail && summary.errors > 0 ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
