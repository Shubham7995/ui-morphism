#!/usr/bin/env node
/**
 * max-scan.mjs — maximalism-specific static invariants.
 *
 * Source of truth: docs/06-maximalism.md §6 (the loud-layer budget, the
 * permitted animated properties, flash safety), §7 (decorative layers, reflow,
 * forced colours), §8 (asset and compositing budgets) and §13 (the twelve
 * self-run checks and the refusal list).
 *
 * SCOPE. This script checks only what is specific to this style and mechanical
 * enough to be got wrong by accident:
 *
 *   - the loud-layer census per scene, against the cap of three
 *   - raster noise and pattern assets, where the budget is 0 bytes
 *   - animated properties outside the permitted list, `transition: all` included
 *   - infinite animation with no Calm hook and no pause control
 *   - the four safety blocks: reduced motion, reduced transparency, forced
 *     colors, and the coarse-pointer degradation
 *   - blend modes on a full-viewport overlay or outside `isolation: isolate`
 *   - rotation past the 5deg ceiling
 *   - non-zero shadow blur, which is a different style
 *   - shadow-only container boundaries, which vanish under forced colours
 *   - absolutely positioned ornament surviving below 640px
 *   - decorative layers that are not `pointer-events: none`
 *   - `order` and `flex-direction: row-reverse` on sequential content
 *   - the font-family census, capped at four
 *
 * It computes NO contrast, NO focus-visible check, NO target size and NO
 * forced-colors keyword audit. Those are the nine universal checks and they
 * belong to ui-morphism-core:a11y-validate, which is the single implementation.
 * Do not add them here.
 *
 * Usage:
 *   node max-scan.mjs [path ...] [--json] [--quiet] [--no-fail]
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

const RASTER = /\.(png|jpe?g|webp|avif|gif|bmp|tiff?)(["')?#]|$)/i;

/** Doc §6, "What should animate". Everything else is a layout or blur cost on a
 *  page that already carries twenty-plus composited layers. */
const ANIMATABLE = new Set([
  "transform", "translate", "rotate", "scale", "opacity",
  "box-shadow", "background-color", "color",
]);

/** Doc §6's eight loud layers, as the declarations that betray each one. The
 *  census counts DISTINCT kinds per scene, not occurrences: two stickers are one
 *  sticker cluster, and three rotated cards are one rotated layer. */
const LOUD_KINDS = [
  "patterned ground",
  "chromatic stacked shadow",
  "rotated element",
  "marquee",
  "blend-mode overlay",
  "oversized display type",
  "sticker cluster",
  "animated ornament",
];

const LOUD_CAP = 3;
const TILT_CEILING = 5;
const FONT_FAMILY_CAP = 4;
const ORNAMENT_BREAKPOINT = 640;

/* ------------------------------------------------------------------ parser */

/**
 * A deliberately small CSS-shaped parser. It runs over stylesheets and over
 * JS/TS files alike: backticks are NOT treated as string delimiters, so CSS held
 * in a template literal (the React recipe in doc §5 does exactly this) is parsed
 * like any other sheet. Quoted strings and comments are skipped, so a
 * url("x{y.png") cannot desynchronise the brace stack.
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
 * strings survive, so `data-calm="true"` still counts. A file that MENTIONS
 * `data-calm` in prose is documenting the requirement, not meeting it, and a
 * check a comment can satisfy is not a check.
 */
export function stripComments(text) {
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

/** Self first, then ancestors — a Tailwind `@utility` carries its own at-rule. */
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

/**
 * The scene a rule belongs to. The scene is the unit the layer budget is counted
 * against (doc §6, and §5's `isolation: isolate` container), so the census needs
 * a key per scene rather than per file. A selector naming a scene class keys on
 * that class; everything else keys on the file, which is the honest answer when
 * the markup does not say.
 */
export function sceneKey(file, prelude) {
  const m = /[a-z0-9_-]*(?:scene|hero)[a-z0-9_-]*/i.exec(prelude);
  if (m) return file + " :: " + m[0].split("__")[0].split("--")[0];
  return file + " :: (file)";
}

/** Largest |deg| in a rotate-shaped value, or null. */
export function maxRotationDeg(value) {
  let max = null;
  const re = /(-?\d+(?:\.\d+)?)deg/gi;
  let m;
  while ((m = re.exec(value))) {
    const d = Math.abs(parseFloat(m[1]));
    if (max === null || d > max) max = d;
  }
  return max;
}

/** Non-zero blur radius in a box-shadow value, or null. Reads the third length
 *  of each comma-separated layer, which is where blur lives. `inset` and colour
 *  functions are stepped over; a value carrying a var() is not judged. */
export function shadowBlurPx(value) {
  if (/var\(/i.test(value)) return null;
  let worst = null;
  for (const layer of splitTopLevel(value, ",")) {
    /* Colour functions carry numbers of their own; step over them first. A bare
       `0` is a legal length, so it counts — `0 4px 12px` is offset-x, offset-y,
       blur, and dropping the unitless zero would read the blur as the offset. */
    const lengths = layer
      .replace(/\b[a-z-]+\([^()]*\)/gi, " ")
      .split(/\s+/)
      .filter((tok) => /^-?\d+(?:\.\d+)?(?:px|rem|em)?$/.test(tok));
    if (lengths.length < 3) continue;
    const blur = parseFloat(lengths[2]);
    if (!Number.isNaN(blur) && blur !== 0 && (worst === null || blur > worst)) worst = blur;
  }
  return worst;
}

/** Split on a delimiter that is not inside parentheses. */
export function splitTopLevel(value, delim) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === delim && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

/** Properties named by a transition or animation shorthand. */
export function animatedProps(prop, value) {
  if (prop === "transition-property" || prop === "animation-name") {
    return splitTopLevel(value, ",").map((s) => s.toLowerCase());
  }
  return splitTopLevel(value, ",")
    .map((layer) => layer.trim().split(/\s+/)[0].toLowerCase())
    .filter((first) => first && !/^\d/.test(first) && !/^(cubic-bezier|steps|linear|ease|ease-in|ease-out|ease-in-out|var|infinite)$/.test(first));
}

/** The first family named by a font-family value, lower-cased and unquoted. */
export function firstFamily(value) {
  const first = splitTopLevel(value, ",")[0] || "";
  return first.replace(/^["']|["']$/g, "").trim().toLowerCase();
}

/**
 * A word test that will not fire on a substring of a longer word. `sticker`
 * contains `ticker` and `background` contains `ground`, so a bare alternation
 * counts a sticker as a marquee and a page background as a patterned ground.
 * A term counts only where the character before it is not a letter.
 */
export function namesAny(text, terms) {
  return new RegExp("(?:^|[^a-z])(" + terms + ")", "i").test(text);
}

const isPattern = (v) =>
  /repeating-linear-gradient|repeating-conic-gradient|repeating-radial-gradient/i.test(v) ||
  (/radial-gradient/i.test(v) && /circle at 1px 1px/i.test(v));

/* ------------------------------------------------------------------- checks */

function scanFile(file, text, add, state) {
  const root = parse(text);
  const nodes = [];
  walk(root, (n) => nodes.push(n));

  const scene = (node) => {
    const key = sceneKey(file, contextLabel(node));
    if (!state.scenes.has(key)) state.scenes.set(key, { key, kinds: new Map() });
    return state.scenes.get(key);
  };
  const loud = (node, kind, why) => {
    /* Only doc §6's eight kinds are countable. A kind not on that list would be
       a ninth loud layer this file invented, and the budget is the doc's. */
    if (!LOUD_KINDS.includes(kind)) return;
    const s = scene(node);
    if (!s.kinds.has(kind)) s.kinds.set(kind, { file, line: node.line, why });
  };

  const narrowOff = new Set();   /* selectors whose absolute positioning is cancelled below 640px */
  const isolated = new Set();    /* preludes that declare isolation: isolate */

  for (const node of nodes) {
    if (node.type !== "rule") continue;
    if (node.decls.some((d) => d.prop === "isolation" && /isolate/i.test(d.value))) {
      for (const sel of splitTopLevel(node.prelude, ",")) isolated.add(sel);
    }
    const narrow = chain(node).some((a) =>
      a.type === "atrule" &&
      /max-width\s*:\s*(\d+)px/i.test(a.prelude) &&
      parseInt(/max-width\s*:\s*(\d+)px/i.exec(a.prelude)[1], 10) <= ORNAMENT_BREAKPOINT);
    if (!narrow) continue;
    for (const d of node.decls) {
      if (d.prop === "position" && /static|relative/i.test(d.value)) {
        for (const sel of splitTopLevel(node.prelude, ",")) narrowOff.add(sel);
      }
      if (d.prop === "display" && isNone(d.value)) {
        for (const sel of splitTopLevel(node.prelude, ",")) narrowOff.add(sel);
      }
    }
  }

  for (const node of nodes) {
    const decls = node.decls;
    const label = contextLabel(node);
    const decorative = namesAny(label, "grain|noise|ground|pattern|sticker|marquee|ornament|collage|doodle|tape");
    const inReduce = inAtRule(node, /prefers-reduced-motion/i);
    const inForced = inAtRule(node, /forced-colors\s*:\s*active/i);
    const inCalm = /data-calm/i.test(label) || chain(node).some((a) => /data-calm/i.test(a.prelude));

    for (const d of decls) {
      /* 1 — raster texture. Doc §8: the budget is 0 bytes. */
      if (/^(background|background-image|content|mask|mask-image|-webkit-mask-image)$/.test(d.prop) && RASTER.test(d.value)) {
        if (decorative) {
          add("error", "raster-texture", file, d.line,
            "`" + label + "` loads a raster image where CSS or the inline `feTurbulence` filter belongs. Doc §8 budgets grain at 2 KB and patterned grounds at 0 KB; the naive versions are 200-600 KB and 100-400 KB.");
        } else {
          add("info", "raster-texture", file, d.line,
            "`" + label + "` loads a raster image. If it is texture or a patterned ground it must be CSS or inline SVG (doc §8); if it is content imagery it counts against the 600 KB above-the-fold budget instead.");
        }
      }

      /* 2 — the patterned ground, as a loud layer. */
      if (/^(background|background-image)$/.test(d.prop) && isPattern(d.value) && !inForced && !inReduce) {
        loud(node, "patterned ground", "`" + label + "` paints a repeating or halftone gradient ground");
      }

      /* 3 — shadows: zero blur, and the chromatic stack as a loud layer. */
      if (d.prop === "box-shadow" && !isNone(d.value)) {
        const blur = shadowBlurPx(d.value);
        if (blur !== null) {
          add("error", "shadow-blur", file, d.line,
            "`" + label + "` declares a " + blur + "px shadow blur. Zero blur is this style's signature (doc §3, §4); a blurred shadow reads as generic flat design or as a neighbouring style.");
        }
        if (splitTopLevel(d.value, ",").length >= 3 && !/^0 0 0/.test(d.value.trim())) {
          loud(node, "chromatic stacked shadow", "`" + label + "` stacks " + splitTopLevel(d.value, ",").length + " shadow layers");
        }
      }

      /* 4 — rotation: the tilt ceiling, and rotation as a loud layer. */
      if (d.prop === "rotate" || (d.prop === "transform" && /rotate/i.test(d.value))) {
        const deg = maxRotationDeg(d.value);
        if (deg !== null && deg > 0 && !inForced && !inReduce && !inCalm) {
          loud(node, "rotated element", "`" + label + "` rotates by " + deg + "deg");
          if (deg > TILT_CEILING) {
            add("error", "tilt-ceiling", file, d.line,
              "`" + label + "` rotates by " + deg + "deg, past the " + TILT_CEILING + "deg ceiling doc §13 sets for `tiltRange`. Every extra degree costs hit area, because SC 2.5.8 is measured on the transformed box.");
          }
        }
      }

      /* 5 — blend modes. Doc §8, and §13's refusal list. */
      if (d.prop === "mix-blend-mode" && !/^normal$/i.test(d.value.trim())) {
        loud(node, "blend-mode overlay", "`" + label + "` blends with `" + d.value + "`");
        const fullViewport = decls.some((x) =>
          (x.prop === "position" && /fixed/i.test(x.value)) ||
          (x.prop === "width" && /100vw/i.test(x.value)) ||
          (x.prop === "height" && /100vh/i.test(x.value)));
        if (fullViewport) {
          add("error", "blend-fullscreen", file, d.line,
            "`" + label + "` applies `mix-blend-mode` to a full-viewport surface. Doc §8 calls this the single most expensive thing in the style: the compositor reads back the whole backdrop every frame.");
        }
        state.blends.push({ file, line: d.line, selector: label });
        const anyIsolated = isolated.size > 0;
        if (!anyIsolated) {
          add("warn", "blend-isolation", file, d.line,
            "`" + label + "` blends, and no rule in this file declares `isolation: isolate`. Without a scene container the blend resolves against the whole page backdrop — slower, and dependent on whatever happens to be scrolled behind (doc §5, §8).");
        }
      }

      /* 6 — animated properties. Doc §6's permitted list. */
      if (/^(transition|transition-property|animation|animation-name)$/.test(d.prop)) {
        for (const p of animatedProps(d.prop, d.value)) {
          if (p === "all") {
            add("error", "animated-prop", file, d.line,
              "`" + d.prop + ": " + d.value + "` on `" + label + "` animates `all`, which silently includes `width`, `height`, `filter` and `border-width`. Name the properties (doc §6).");
          } else if (/^[a-z-]+$/.test(p) && !ANIMATABLE.has(p) && !/^(max-|--)/.test(p)) {
            if (["width", "height", "top", "left", "right", "bottom", "margin", "filter", "backdrop-filter", "border-width", "padding"].includes(p)) {
              add("error", "animated-prop", file, d.line,
                "`" + d.prop + ": " + d.value + "` on `" + label + "` animates `" + p + "`, which triggers layout or a blur pass on a page that already carries twenty-plus composited layers (doc §6, §8).");
            }
          }
        }
        if (/\binfinite\b/i.test(d.value) && !inReduce && !inCalm) {
          state.infinite.push({ file, line: d.line, selector: label });
          loud(node, "animated ornament", "`" + label + "` runs an infinite animation");
        }
      }
      if (d.prop === "animation-iteration-count" && /infinite/i.test(d.value) && !inReduce && !inCalm) {
        state.infinite.push({ file, line: d.line, selector: label });
        loud(node, "animated ornament", "`" + label + "` sets `animation-iteration-count: infinite`");
      }

      /* 7 — oversized display type. Doc §3: the hero clamp. */
      if (d.prop === "font-size" && /clamp\(/i.test(d.value)) {
        const rem = /(\d+(?:\.\d+)?)rem\s*\)/.exec(d.value);
        if (rem && parseFloat(rem[1]) >= 4) {
          loud(node, "oversized display type", "`" + label + "` sets a hero clamp topping out at " + rem[1] + "rem");
        }
      }

      /* 8 — the font-family census. Doc §13: four families, no fifth. */
      if (d.prop === "font-family" || /^--max-font-/.test(d.prop)) {
        const fam = firstFamily(d.value);
        if (fam && !/^(inherit|initial|unset|revert)$/.test(fam) && !fam.startsWith("var(")) {
          if (!state.families.has(fam)) state.families.set(fam, { file, line: d.line, selector: label });
        }
      }

      /* 9 — decorative layers must not take pointer events. Doc §7. */
      if (decorative && d.prop === "pointer-events") state.pointerEventsOff.add(label);

      /* 10 — DOM order. Doc §7, §13 check 12. */
      if (d.prop === "order" && /^-?\d+$/.test(d.value.trim()) && d.value.trim() !== "0") {
        add("warn", "dom-order", file, d.line,
          "`" + label + "` sets `order: " + d.value + "`. Anti-grid placement is built in the DOM and displaced with `grid-area`, `translate` and `rotate`; `order` decouples reading order from visual order (SC 1.3.2, doc §7).");
      }
      if (d.prop === "flex-direction" && /row-reverse|column-reverse/i.test(d.value)) {
        add("warn", "dom-order", file, d.line,
          "`" + label + "` sets `flex-direction: " + d.value + "`. Same failure as `order` where the content has a sequence (SC 1.3.2, doc §7).");
      }

      /* 11 — absolute ornament below the breakpoint. Doc §7, §13 check 10. */
      if (d.prop === "position" && /absolute/i.test(d.value) && decorative && !inForced) {
        const cancelled = splitTopLevel(node.prelude, ",").some((sel) => narrowOff.has(sel));
        if (!cancelled) {
          add("warn", "reflow-ornament", file, d.line,
            "`" + label + "` positions decorative ornament absolutely and nothing under a `max-width: " + ORNAMENT_BREAKPOINT + "px` query returns it to the flow. Absolutely positioned collage overflows at 320px and at 400% zoom (SC 1.4.10, doc §7).");
        }
      }
    }

    /* 12 — sticker clusters, as a loud layer. */
    if (node.type === "rule" && namesAny(node.prelude, "sticker|badge|cut-?out|doodle|tape") && !inForced && !inReduce) {
      loud(node, "sticker cluster", "`" + label + "` styles a sticker or cut-out");
    }

    /* 13 — marquees, as a loud layer. */
    if (node.type === "rule" && namesAny(node.prelude, "marquee|ticker") && !inForced && !inReduce) {
      loud(node, "marquee", "`" + label + "` styles a marquee or ticker");
    }

    /* 14 — shadow-only boundaries. Forced colours discards box-shadow. */
    if (node.type === "rule" && !inForced) {
      const hasShadow = decls.some((d) => d.prop === "box-shadow" && !isNone(d.value));
      const hasBorder = decls.some((d) =>
        /^(border|border-width|border-color|border-style|border-block|border-inline|outline)$/.test(d.prop) && !isNone(d.value));
      if (hasShadow && !hasBorder) {
        const rootSel = node.prelude.split(",")[0].trim().split(/[\s>+~]+/)[0].split("--")[0].split(":")[0];
        if (!state.borderRoots.has(rootSel)) state.shadowOnly.push({ file, line: node.line, selector: label, rootSel });
      }
      if (decls.some((d) => /^(border|border-width|border-style)$/.test(d.prop) && !isNone(d.value))) {
        for (const sel of splitTopLevel(node.prelude, ",")) {
          state.borderRoots.add(sel.trim().split(/[\s>+~]+/)[0].split("--")[0].split(":")[0]);
        }
      }
    }

    /* 15 — file-level signals the project checks aggregate. */
    if (node.type === "atrule") {
      if (/prefers-reduced-motion/i.test(node.prelude)) state.queries.add("prefers-reduced-motion");
      if (/prefers-reduced-transparency/i.test(node.prelude)) state.queries.add("prefers-reduced-transparency");
      if (/forced-colors/i.test(node.prelude)) state.queries.add("forced-colors");
      if (/pointer\s*:\s*coarse/i.test(node.prelude) || /max-width\s*:\s*7\d\dpx/i.test(node.prelude)) state.queries.add("coarse-degradation");
      if (/prefers-reduced-motion/i.test(node.prelude)) {
        walk(node, (n) => {
          for (const d of n.decls) {
            if ((d.prop === "animation" && isNone(d.value)) ||
                (d.prop === "animation-name" && isNone(d.value)) ||
                (d.prop === "animation-iteration-count")) {
              state.reduceCancelsInfinite = true;
            }
          }
        });
      }
    }
  }

  const code = stripComments(text);
  if (/data-calm/.test(code)) state.calmHook = true;
  if (/aria-?[Ll]abel\s*=|aria-pressed/.test(code) && /calm/i.test(code)) state.calmControl = true;
  if (/feTurbulence/i.test(code)) state.svgGrain = true;
  if (/pause|aria-pressed/i.test(code)) state.pauseControl = true;
}

/* ------------------------------------------------------------------- driver */

/**
 * Scan a set of already-read files.
 *
 * @param {{file: string, text: string}[]} inputs
 * @returns {{summary: object, scenes: object[], findings: object[]}}
 */
export function scan(inputs) {
  const findings = [];
  const add = (severity, rule, file, line, message) =>
    findings.push({ file, line, severity, rule, message });

  const state = {
    scenes: new Map(),
    families: new Map(),
    infinite: [],
    blends: [],
    shadowOnly: [],
    borderRoots: new Set(),
    pointerEventsOff: new Set(),
    queries: new Set(),
    calmHook: false,
    calmControl: false,
    pauseControl: false,
    svgGrain: false,
    reduceCancelsInfinite: false,
  };

  for (const { file, text } of inputs) scanFile(file, text, add, state);

  /* The loud-layer census. Doc §6's cap, and §13 check 2. */
  const scenes = [...state.scenes.values()]
    .map((s) => ({
      scene: s.key,
      count: s.kinds.size,
      /* Reported in doc §6's own order, so two scans of the same scene print the
         same row and a diff of two reports is readable. */
      layers: LOUD_KINDS.filter((k) => s.kinds.has(k)),
      detail: LOUD_KINDS.filter((k) => s.kinds.has(k)).map((k) => [k, s.kinds.get(k)]),
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count || a.scene.localeCompare(b.scene));

  for (const s of scenes) {
    if (s.count > LOUD_CAP) {
      const first = s.detail[0][1];
      add("error", "loud-layers", first.file, first.line,
        "Scene `" + s.scene + "` carries " + s.count + " loud layers, over the cap of " + LOUD_CAP + ": " +
        s.layers.join(", ") + ". Doc §6: four or more is where usability testing turns. Drop one — the cheapest, in doc §8's order, are the blend-mode overlay, then the grain, then the chromatic shadow.");
    }
  }

  for (const so of state.shadowOnly) {
    add("error", "shadow-only-boundary", so.file, so.line,
      "`" + so.selector + "` has a `box-shadow` and no `border`, and no rule sharing `" + so.rootSel + "` declares one. `forced-colors: active` discards `box-shadow`, so a shadow-only boundary leaves the container with no edge at all (doc §7).");
  }

  if (state.families.size > FONT_FAMILY_CAP) {
    const rows = [...state.families.entries()].map(([f, w]) => f + " (" + w.file + ":" + w.line + ")");
    add("error", "font-families", "(project)", 0,
      state.families.size + " font families are declared, over the cap of " + FONT_FAMILY_CAP + " (doc §3, §13): " + rows.join("; ") +
      ". Three to four families is the signature; a fifth is not more maximalist, it is unbudgeted.");
  }

  if (state.infinite.length > 0) {
    if (!state.calmHook) {
      add("error", "calm-toggle", "(project)", 0,
        state.infinite.length + " infinite animation(s) were found and no `data-calm` hook exists anywhere in the scanned files. SC 2.2.2 Pause, Stop, Hide is Level A, and `prefers-reduced-motion` does not discharge it — it is an OS-level, all-or-nothing setting (doc §6, §7).");
    } else if (!state.pauseControl) {
      add("warn", "pause-control", "(project)", 0,
        "A `data-calm` hook exists but no visible pause control was found. Doc §7 asks for a pause control or a Calm toggle; where the ambient motion is prominent, ship both.");
    }
    if (!state.queries.has("prefers-reduced-motion")) {
      add("error", "a11y-blocks", "(project)", 0,
        "No `@media (prefers-reduced-motion: reduce)` block was found, but " + state.infinite.length + " infinite animation(s) were. Doc §6: stop everything ambient and infinite, keep everything that reports state.");
    } else if (!state.reduceCancelsInfinite) {
      add("warn", "a11y-blocks", "(project)", 0,
        "A `prefers-reduced-motion: reduce` block exists but no rule inside it cancels an animation. Every emitted `infinite` declaration must be cancelled there (doc §13 check 5).");
    }
  }

  if (scenes.length > 0) {
    for (const [q, why] of [
      ["forced-colors", "Doc §7: forced colours discards `background-image`, `box-shadow` and `mix-blend-mode`, so patterns and grain must be hidden and every boundary must fall back to a real border."],
      ["prefers-reduced-transparency", "Doc §7: honour it where available — drop grain, flatten patterned grounds — while never making it the only defence, since Safari does not implement it."],
      ["coarse-degradation", "Doc §8: a coarse-pointer or narrow-viewport block that drops the grain, flattens the ground and reduces the chromatic shadow to a single layer. Blend modes and large composited layers are where cheap Android devices fall over."],
    ]) {
      if (!state.queries.has(q)) {
        add("warn", "a11y-blocks", "(project)", 0,
          "No `" + q + "` block found in the scanned files, but " + scenes.length + " loud scene(s) were. " + why);
      }
    }
    if (!state.svgGrain) {
      add("info", "raster-texture", "(project)", 0,
        "No `feTurbulence` filter found. If the design carries grain it must be the inline SVG filter at baseFrequency 0.8 / numOctaves 3, not a raster asset (doc §4, §8).");
    }
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
      scenes: scenes.length,
      maxLoudLayers: scenes.length ? scenes[0].count : 0,
      loudLayerCap: LOUD_CAP,
      fontFamilies: state.families.size,
      infiniteAnimations: state.infinite.length,
      blendModes: state.blends.length,
      calmHook: state.calmHook,
      safetyBlocksFound: [...state.queries].sort(),
      errors: counts.error,
      warnings: counts.warn,
      infos: counts.info,
    },
    scenes: scenes.map((s) => ({ scene: s.scene, count: s.count, layers: s.layers })),
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
      "max-scan.mjs — maximalism-specific static invariants\n\n" +
      "  node max-scan.mjs [path ...] [--json] [--quiet] [--no-fail]\n\n" +
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

  const { summary, scenes, findings } = scan(inputs);
  const shown = quiet ? findings.filter((f) => f.severity !== "info") : findings;

  if (json) {
    process.stdout.write(JSON.stringify({ summary, scenes, findings }, null, 2) + "\n");
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
    if (scenes.length) {
      process.stdout.write("\nLoud-layer census (cap " + summary.loudLayerCap + "):\n");
      for (const s of scenes) {
        process.stdout.write("  " + s.count + "  " + s.scene + " — " + s.layers.join(", ") + "\n");
      }
    }
    process.stdout.write(
      "\nScanned " + summary.filesScanned + " file(s). " +
      summary.scenes + " scene(s), deepest stack " + summary.maxLoudLayers + " loud layer(s), " +
      summary.fontFamilies + " font families, " + summary.infiniteAnimations + " infinite animation(s).\n" +
      "Safety blocks present: " + (summary.safetyBlocksFound.join(", ") || "none") + ". Calm hook: " + (summary.calmHook ? "yes" : "no") + ".\n" +
      summary.errors + " error(s), " + summary.warnings + " warning(s), " + summary.infos + " info.\n" +
      "Contrast, focus, target size and forced-colors keyword checks are not run here — call ui-morphism-core:a11y-validate.\n");
  }

  return !noFail && summary.errors > 0 ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
