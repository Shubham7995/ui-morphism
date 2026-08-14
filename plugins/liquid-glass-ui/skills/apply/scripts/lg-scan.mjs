#!/usr/bin/env node
/**
 * lg-scan.mjs — Liquid Glass-specific static invariants.
 *
 * Source of truth: docs/08-liquid-glass.md §13 (the fifteen-item validation
 * checklist the skill self-runs, and the twelve anti-patterns it must refuse),
 * §5 (the three-tier `@supports` ladder and the inline filter `<defs>`), §6 (the
 * animatable set), §7 (the four escape hatches and the decorative-layer rules)
 * and §8 (the surface, refractor, blur and asset budgets).
 *
 * SCOPE. Only what is specific to this style AND mechanical enough to be got
 * wrong by accident:
 *
 *   - nested glass, at any depth, in CSS selectors and in markup. This is the
 *     one hard fail the style has: Apple's own renderer cannot sample glass with
 *     glass, which is why `GlassEffectContainer` exists (§8, §13 item 11)
 *   - the three-tier `@supports` ladder: refraction behind
 *     `url(#…)`-shaped feature test, and a Tier 0 opaque fallback underneath
 *   - the `-webkit-backdrop-filter` twin
 *   - transitions, keyframes and SVG `<animate>` elements touching the optics
 *     the doc forbids animating
 *   - `feImage` fetching a map instead of inlining it
 *   - user-agent sniffing where an `@supports` / `CSS.supports` test belongs
 *   - glass on content: body, main, tables, articles, canvases, scroll containers
 *   - the Clear variant without its mandatory scrim
 *   - the four accessibility escape hatches, and live blur left inside
 *     `forced-colors: active`
 *   - the decorative layers' `aria-hidden` / `focusable` / `pointer-events`
 *   - the surface, refractor and blur budgets
 *   - a blur-only surface being marketed as liquid glass
 *
 * It computes NO contrast, NO relative luminance, NO alpha compositing, NO focus
 * check and NO target size. Those are the nine universal checks and they belong
 * to ui-morphism-core:a11y-validate — one implementation, ten callers. Do not
 * add them here.
 *
 * Usage:
 *   node lg-scan.mjs [path ...] [--json] [--quiet] [--no-fail]
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

const MARKUP = new Set([".html", ".htm", ".vue", ".svelte", ".astro", ".jsx", ".tsx"]);

const SKIP_DIRS = new Set([
  "node_modules", ".git", ".next", ".nuxt", ".svelte-kit",
  "dist", "build", "out", "coverage", "vendor", "target", ".turbo", ".cache",
]);

/** Doc §13 knob table: blurRadius runs 0-28px. Doc §8 budget: <= 24px. */
export const BLUR_KNOB_MAX_PX = 28;
export const BLUR_BUDGET_PX = 24;

/** Doc §8 budgets: at most three glass surfaces, at most one of them refracting. */
export const SURFACE_BUDGET = 3;
export const REFRACTOR_BUDGET = 1;

/**
 * Elements that are content, not chrome. Doc §13 anti-pattern 1 and §10: glass
 * lives on the chrome layer and the content layer stays opaque.
 */
const CONTENT_SELECTORS =
  /(^|[\s,>+~])(body|main|table|thead|tbody|tr|td|th|article|section|canvas|pre|code|figure)([\s,>+~:.[]|$)/i;

const CONTENT_CLASSHINT = /(chart|graph|plot|canvas|table|grid-body|article|prose|content|editor|dataviz)/i;

/* ------------------------------------------------------------------ parser */

/**
 * A deliberately small CSS-shaped parser. It runs over stylesheets and over
 * JS/TS files alike: backticks are NOT string delimiters here, so CSS held in a
 * template literal — which the React recipe in doc §5 does — is parsed like any
 * other sheet. Quoted strings and comments are skipped, so a
 * `url("data:image/svg+xml,%3Csvg{")` cannot desynchronise the brace stack.
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
 * strings survive, so `[data-transparency="reduced"]` still counts. A file that
 * merely *mentions* `navigator.userAgent` in prose is documenting the refusal,
 * not committing it, and a check a comment can satisfy — or trip — is not a
 * check.
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

    if (ch === "<" && text.startsWith("<!--", i)) {
      const end = text.indexOf("-->", i + 4);
      const stop = end === -1 ? text.length : end + 3;
      for (let k = i; k < stop; k++) if (text[k] === "\n") out += "\n";
      i = stop - 1;
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
const hasVar = (v) => /var\(|--value\(/.test(v);

/** Self first, then ancestors. Tailwind's `@utility` nests `@supports` directly,
 *  so the node carrying the declarations IS the at-rule and an ancestors-only
 *  test would miss it. */
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

/** Every class name mentioned anywhere in a selector, in source order. */
export function selectorClasses(prelude) {
  return (prelude.match(/\.(-?[_a-zA-Z][\w-]*)/g) || []).map((s) => s.slice(1));
}

/** One entry per comma-separated selector, split into its combinator-separated compounds. */
export function selectorCompounds(prelude) {
  return prelude
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.split(/\s*[>+~]\s*|\s+/).filter(Boolean));
}

function blurPx(value) {
  const m = /blur\(\s*([\d.]+)px\s*\)/i.exec(value);
  return m ? parseFloat(m[1]) : null;
}

const isLiveGlassValue = (v) => !isNone(v) && /blur\(|url\(|saturate\(|var\(/i.test(v);

/* ------------------------------------------------------- markup tag walking */

const TAG_RE = /<(\/?)([A-Za-z][A-Za-z0-9._:-]*)((?:"[^"]*"|'[^']*'|[^<>])*?)(\/?)>/g;
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/**
 * The class names an opening tag carries, from `class`, `className` or Svelte's
 * `class:` directives. Only literal strings are read: a class list assembled at
 * runtime by `clsx(...)` is invisible to a static scan, which is stated in the
 * finding rather than guessed at.
 */
export function tagClasses(attrs) {
  const out = [];
  const re = /\b(?:class|className)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)\s*\})/g;
  let m;
  while ((m = re.exec(attrs))) {
    const literal = m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? "";
    for (const c of literal.split(/\s+/)) if (c) out.push(c);
  }
  return out;
}

/**
 * Walk a markup-ish file as a tag stack, calling `onOpen(tag, classes, line,
 * depthOfGlassAncestors)` for every opening tag that carries at least one class.
 *
 * Deliberately forgiving: unbalanced or unknown tags are tolerated because JSX
 * and template files are not guaranteed to be well-formed HTML from a regex's
 * point of view. The scan only ever *reports* when two glass-classed elements
 * nest, so a mis-parsed fragment has to carry a glass class twice before it can
 * produce a finding.
 */
export function walkTags(text, visit) {
  const stack = [];
  TAG_RE.lastIndex = 0;
  let m;
  while ((m = TAG_RE.exec(text))) {
    const [full, closing, rawName, attrs, selfClose] = m;
    const name = rawName.toLowerCase();
    const line = text.slice(0, m.index).split("\n").length;

    if (closing) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === name) { stack.length = i; break; }
      }
      continue;
    }

    const classes = tagClasses(attrs);
    const entry = { name, classes, line, attrs };
    visit(entry, stack);

    if (!selfClose && !VOID_TAGS.has(name) && !full.endsWith("/>")) stack.push(entry);
  }
}

/* ------------------------------------------------------------------- checks */

function scanCss(file, text, add, state) {
  const root = parse(text);
  const nodes = [];
  walk(root, (n) => nodes.push(n));

  /* Pass one: which class names name a glass surface in this file. A class
     counts as glass if a rule matching it declares a live `backdrop-filter`, or
     paints itself with one of the material's own fill tokens. Collected before
     the checks run because a nested-selector check needs the whole file's
     vocabulary, not the rules it has read so far. */
  for (const node of nodes) {
    if (node.type !== "rule") continue;
    const glassy = node.decls.some((d) =>
      (d.prop === "backdrop-filter" || d.prop === "-webkit-backdrop-filter") && isLiveGlassValue(d.value)) ||
      node.decls.some((d) =>
        /^(background|background-color)$/.test(d.prop) &&
        /--lg-fill|--color-glass-fill|--um-liquid-glass-surface/.test(d.value));
    if (!glassy) continue;
    for (const compound of selectorCompounds(node.prelude)) {
      for (const c of selectorClasses(compound[compound.length - 1] || "")) state.glassClasses.add(c);
    }
  }

  for (const node of nodes) {
    const decls = node.decls;
    const bd = decls.filter((d) => d.prop === "backdrop-filter");
    const bdWebkit = decls.filter((d) => d.prop === "-webkit-backdrop-filter");
    const live = bd.filter((d) => isLiveGlassValue(d.value));

    /* 1 — the -webkit- twin. Doc §5 writes both on every tier. */
    if (bd.length > 0 && bdWebkit.length === 0) {
      add("error", "webkit-prefix", file, bd[0].line,
        "`backdrop-filter` on `" + contextLabel(node) + "` has no `-webkit-backdrop-filter` twin. Safari is the platform this material comes from and the prefixed form is what its older versions read.");
    }

    for (const d of live) {
      const refracting = /url\(/i.test(d.value);
      state.surfaces.push({ file, line: d.line, selector: node.prelude, refracting, blur: blurPx(d.value) });
      if (refracting) state.refractors.push({ file, line: d.line, selector: node.prelude });

      /* 2 — Tier 2 behind its own feature test. Doc §5, §13 step 5 and
         anti-pattern 10: the ladder is gated by `@supports`, never by a
         user-agent string. The test names the feature itself, so it cannot pass
         in an engine that would then render nothing. */
      if (refracting && !inAtRule(node, /@supports[^{]*backdrop-filter\s*:\s*url\(/i)) {
        add("error", "supports-tier2", file, d.line,
          "`" + contextLabel(node) + "` uses an SVG filter as a `backdrop-filter` value outside `@supports (backdrop-filter: url(#lg-refract))`. Only Chromium accepts a `url()` there; Safari and Firefox drop the whole declaration and the surface loses its blur as well as its lens.");
      }

      /* 3 — the blur knob and the blur budget. */
      const px = blurPx(d.value);
      if (px !== null && px > BLUR_KNOB_MAX_PX) {
        add("error", "blur-max", file, d.line,
          "blur(" + px + "px) exceeds the knob maximum of " + BLUR_KNOB_MAX_PX + "px (doc §13 intensity table).");
      } else if (px !== null && px > BLUR_BUDGET_PX) {
        add("warn", "blur-budget", file, d.line,
          "blur(" + px + "px) is over doc §8's " + BLUR_BUDGET_PX + "px performance budget. Every extra 8px is roughly linear extra cost, and the budget is a route-level measurement rather than a knob bound — report it, do not silently clamp it.");
      }

      /* 4 — glass on content rather than chrome. Doc §13 anti-pattern 1. */
      const label = contextLabel(node);
      if (CONTENT_SELECTORS.test(label) || CONTENT_CLASSHINT.test(label)) {
        add("error", "glass-on-content", file, d.line,
          "`" + label + "` puts glass on a content surface. Doc §10: chrome is glass, content is opaque — never body copy, tables, charts or a canvas wrapper. Chart legibility over a warped, blurred, colour-shifted backdrop is indefensible (§9).");
      }
      const scrolls = decls.some((x) => /^overflow(-x|-y)?$/.test(x.prop) && /(auto|scroll)/i.test(x.value));
      if (scrolls) {
        add("error", "glass-on-scroller", file, d.line,
          "`" + label + "` is its own scroll container and carries glass. Doc §8: never apply glass to a scroll container's own children — a translating backdrop invalidates the snapshot every frame. Apply it to a `position: fixed` sibling instead.");
      }
    }

    /* 5 — the animatable set. Doc §6: transform, opacity, background-color and
       feDisplacementMap@scale. Nothing else. */
    for (const d of decls) {
      if (/^(transition|transition-property|animation|animation-name)$/.test(d.prop)) {
        if (/backdrop-filter|(^|[\s,(])filter([\s,)]|$)|border-radius/i.test(d.value)) {
          add("error", "animated-optics", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + contextLabel(node) + "` interpolates a backdrop filter, a filter or a corner radius. Doc §6: every geometry change forces a full rebuild of the displacement map, and that is the expensive path.");
        } else if (/(^|[\s,])all([\s,]|$)/i.test(d.value)) {
          add("warn", "animated-optics", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + contextLabel(node) + "` transitions `all`, which silently includes `backdrop-filter` and `border-radius`. Name the properties.");
        }
      }
      if (d.prop === "will-change" && /backdrop-filter|filter/i.test(d.value)) {
        const animated = decls.some((x) => /^(transition|animation)/.test(x.prop));
        add(animated ? "info" : "warn", "will-change", file, d.line,
          "`will-change: " + d.value + "` on `" + contextLabel(node) + "`. Doc §8 allows it on surfaces that actually animate and requires removing it when they stop; leaving it on permanently pins the layer in GPU memory.");
      }
    }

    if (inAtRule(node, /@keyframes/i)) {
      for (const d of decls) {
        if ((d.prop === "backdrop-filter" || d.prop === "-webkit-backdrop-filter" || d.prop === "filter" || d.prop === "border-radius") && !isNone(d.value)) {
          add("error", "animated-optics", file, d.line,
            "`@keyframes` step sets `" + d.prop + "`, interpolating it across frames (doc §6).");
        }
      }
    }

    /* 6 — glass left alive inside forced colors. Doc §7 is explicit that the UA
       does not neutralise `backdrop-filter` for you. */
    if (inAtRule(node, /forced-colors\s*:\s*active/i)) {
      for (const d of live) {
        add("error", "forced-colors-live", file, d.line,
          "`" + contextLabel(node) + "` keeps `backdrop-filter: " + d.value + "` inside `forced-colors: active`. The surface stays translucent while text flips to system colours, which is worse than either.");
      }
      if (decls.some((d) => d.prop === "backdrop-filter" && isNone(d.value))) state.forcedColorsNulls = true;
    }

    /* 7 — nested glass in a selector. Doc §13 item 11: a hard fail, not a
       budget. Two compounds of the same selector both naming a glass class means
       the rule itself describes glass inside glass. */
    if (node.type === "rule") {
      for (const compound of selectorCompounds(node.prelude)) {
        if (compound.length < 2) continue;
        const hits = compound
          .map((part, i) => ({ i, classes: selectorClasses(part).filter((c) => state.glassClasses.has(c)) }))
          .filter((x) => x.classes.length > 0);
        if (hits.length >= 2) {
          add("error", "nested-glass", file, node.line,
            "`" + node.prelude + "` describes a glass surface inside another glass surface (`." + hits[0].classes[0] + "` … `." + hits[hits.length - 1].classes[0] + "`). Glass cannot sample glass — Apple's own renderer forbids it, which is exactly why `GlassEffectContainer` exists (§8, §13 item 11). Group the siblings in one container and give the inner surface an opaque fill.");
        }
      }
    }

    /* 8 — the accessibility escape hatches, collected for the project check. */
    if (node.type === "atrule") {
      if (/prefers-reduced-transparency/i.test(node.prelude)) state.queries.add("prefers-reduced-transparency");
      if (/prefers-contrast/i.test(node.prelude)) state.queries.add("prefers-contrast");
      if (/forced-colors/i.test(node.prelude)) state.queries.add("forced-colors");
      if (/prefers-reduced-motion/i.test(node.prelude)) state.queries.add("prefers-reduced-motion");
      if (/^@supports\s+not\b[^{]*backdrop-filter/i.test(node.prelude)) state.tier0 = true;
    }

    /* 9 — the Clear variant and its mandatory scrim. Doc §4, §13 anti-pattern 4. */
    for (const d of decls) {
      if (/--lg-fill-clear|--color-glass-fill-clear/.test(d.value) && !/^--/.test(d.prop)) {
        state.clearUses.push({ file, line: d.line, selector: contextLabel(node) });
      }
      if (/^--/.test(d.prop) && /--lg-scrim|--color-glass-scrim/.test(d.prop)) continue;
      if (/--lg-scrim|--color-glass-scrim/.test(d.value)) state.scrimUses.push({ file, line: d.line });
    }

    /* 10 — decorative layers take no pointer events. Doc §7. */
    if (node.type === "rule" && /::(before|after)/i.test(node.prelude) &&
        decls.some((d) => /^(background|background-image|content)$/.test(d.prop)) &&
        /rim|spec|tint|glow|sheen/i.test(node.prelude)) {
      if (!decls.some((d) => d.prop === "pointer-events" && /none/i.test(d.value))) {
        add("warn", "decorative-layer", file, node.line,
          "`" + node.prelude + "` paints a decorative rim, tint or specular layer and does not set `pointer-events: none`. Doc §7: the rim, tint and specular layers are decoration and must never intercept a pointer.");
      }
    }
  }
}

function scanText(file, text, add, state) {
  const code = stripComments(text);

  /* 11 — user-agent sniffing where a feature test belongs. Doc §13
     anti-pattern 10. Only counted where the file also branches on the tier, so
     an analytics call that happens to read the UA string is not a finding. */
  if (/navigator\.(userAgent|userAgentData|vendor)/.test(code) &&
      /(backdrop-filter|backdropFilter|refract|liquid.?glass|tier)/i.test(code)) {
    const line = code.slice(0, code.search(/navigator\.(userAgent|userAgentData|vendor)/)).split("\n").length;
    add("error", "ua-sniff", file, line,
      "This file reads the user-agent string and also names the glass tier. Doc §13 step 5: the ladder is gated by `@supports` / `CSS.supports`, never by a user-agent string. `CSS.supports(\"backdrop-filter\", \"url(#lg-refract)\")` is the test.");
  }

  /* 12 — the map is inlined, never fetched. Doc §8, §13 item 14 and
     anti-pattern 9. */
  const feImage = /<feImage\b[^>]*?\b(?:xlink:)?href\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*[`"']([^`"']*)[`"']\s*\})/gi;
  let m;
  while ((m = feImage.exec(code))) {
    const href = m[1] ?? m[2] ?? m[3] ?? "";
    if (/^data:/i.test(href.trim())) continue;
    add("error", "fe-image-external", file, code.slice(0, m.index).split("\n").length,
      "`feImage` fetches `" + href.slice(0, 60) + "`. Doc §8: an external `href` costs a network fetch plus a decode inside the filter graph. Inline the map as a base64 data URI — `scripts/displacement-map.mjs` emits one under the 8KB budget.");
  }

  /* 13 — SVG geometry animated from markup. Doc §6: `feDisplacementMap@scale`
     is the one filter attribute that is cheap to animate, because it does not
     rebuild the map. */
  const animateEl = /<animate\b[^>]*\battributeName\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  while ((m = animateEl.exec(code))) {
    const attr = (m[1] ?? m[2] ?? "").trim();
    if (/^scale$/i.test(attr)) continue;
    add("error", "animated-optics", file, code.slice(0, m.index).split("\n").length,
      "`<animate attributeName=\"" + attr + "\">` animates SVG filter geometry. Doc §6: animating `feDisplacementMap`'s `scale` is cheap because it does not rebuild the map; animating anything that changes the filter's geometry forces a full rebuild.");
  }

  /* 14 — the inline filter `<defs>` is hidden from assistive technology.
     Doc §7 and §13 item 13. */
  const svgOpen = /<svg\b((?:"[^"]*"|'[^']*'|[^<>])*)>/gi;
  while ((m = svgOpen.exec(code))) {
    const attrs = m[1];
    const end = code.toLowerCase().indexOf("</svg>", m.index);
    const body = code.slice(m.index, end === -1 ? code.length : end);
    if (!/<(filter|feDisplacementMap|feImage|feTurbulence)\b/i.test(body)) continue;
    state.filterDefs++;
    const line = code.slice(0, m.index).split("\n").length;
    if (!/aria-hidden\s*=\s*(?:"|'|\{)?\s*(?:"|')?true/i.test(attrs)) {
      add("error", "defs-aria", file, line,
        "The inline `<svg>` holding the filter `<defs>` has no `aria-hidden=\"true\"`. It is decoration and will otherwise be announced as an empty group member (doc §7).");
    }
    if (!/focusable\s*=\s*(?:"|'|\{)?\s*(?:"|')?false/i.test(attrs)) {
      add("error", "defs-aria", file, line,
        "The inline `<svg>` holding the filter `<defs>` has no `focusable=\"false\"`. Without it, legacy behaviour and some assistive technology still stop on it (doc §7).");
    }
  }

  /* 15 — nested glass in markup. The hard fail again, from the other side: a
     selector-level scan cannot see a glass component rendered inside another
     glass component. */
  if (MARKUP.has(extname(file).toLowerCase())) {
    walkTags(code, (tag, stack) => {
      if (!tag.classes.some((c) => isGlassClass(c, state))) return;
      const outer = stack.find((a) => a.classes.some((c) => isGlassClass(c, state)));
      if (!outer) return;
      add("error", "nested-glass", file, tag.line,
        "`<" + tag.name + " class=\"" + tag.classes.join(" ") + "\">` is a glass surface inside `<" + outer.name + " class=\"" + outer.classes.join(" ") + "\">`, which is also glass. Doc §8: the inner element's snapshot includes the outer element's already-filtered output, so it looks worse AND runs slower; doc §13 item 11 makes it a hard fail. Put the siblings in one container.");
    });
  }

  /* 16 — the in-app transparency control. Safari does not implement
     `prefers-reduced-transparency` (doc §7), and Apple's own users are the ones
     most likely to have Reduce Transparency on. */
  if (/data-transparency/.test(code)) state.transparencyToggle = true;
  if (/hardwareConcurrency|deviceMemory/.test(code)) state.deviceGate = true;
  if (/liquid.?glass/i.test(code)) state.namesLiquidGlass.add(file);
}

function isGlassClass(cls, state) {
  if (state.glassClasses.has(cls)) return true;
  /* Utility-first markup names the effect directly. `glass` and `glass-refract`
     are the `@utility` names this plugin's own Tailwind mirror ships. */
  return /^backdrop-blur(-|$)/.test(cls) || cls === "glass" || cls === "glass-refract";
}

/* ------------------------------------------------------------------- driver */

/**
 * Scan a set of already-read files.
 *
 * Two passes on purpose. The glass vocabulary is a whole-project fact — the
 * stylesheet that defines `.lg` and the template that nests two of them are
 * different files — so every stylesheet is read before any markup is judged.
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
    refractors: [],
    glassClasses: new Set(),
    queries: new Set(),
    clearUses: [],
    scrimUses: [],
    namesLiquidGlass: new Set(),
    filterDefs: 0,
    tier0: false,
    forcedColorsNulls: false,
    transparencyToggle: false,
    deviceGate: false,
  };

  for (const { file, text } of inputs) scanCss(file, text, add, state);
  for (const { file, text } of inputs) scanText(file, text, add, state);

  /* Project-level checks. Deliberately not per-file: doc §13's outputs put the
     token layer, the components and the `@layer liquid-glass` sheet in three
     different files, and each of them is allowed to carry only its own part. */
  if (state.surfaces.length > 0) {
    const required = [
      ["prefers-reduced-transparency", "Doc §7 and §13 item 6: fill >= 0.95, blur 0, refraction 0. Treat it as mandatory, and ship the in-app toggle too — Safari does not implement the query."],
      ["prefers-contrast", "Doc §4 and §7: `prefers-contrast: more` pairs with reduced transparency and is the fallback that reaches Safari users."],
      ["forced-colors", "Doc §7 and §13 item 8: `backdrop-filter` is not neutralised for you. Set system colours, null the filter, hide the decorative pseudo-elements."],
      ["prefers-reduced-motion", "Doc §6 and §13 item 7: no sweeps, no morphs, no scale on press."],
    ];
    for (const [q, why] of required) {
      if (!state.queries.has(q)) {
        add("error", "a11y-blocks", "(project)", 0,
          "No `@media (" + q + ")` block found in the scanned files, but " + state.surfaces.length + " glass surface(s) were. " + why);
      }
    }
    if (state.queries.has("forced-colors") && !state.forcedColorsNulls) {
      add("warn", "forced-colors-live", "(project)", 0,
        "A `forced-colors: active` block exists but no rule inside it sets `backdrop-filter: none`. Null it explicitly — the UA will not.");
    }
    if (!state.tier0) {
      add("error", "supports-tier0", "(project)", 0,
        "No `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` fallback found. Doc §13 item 9 requires the Tier 0 rung: a solid fill at >= 0.94 opacity for every engine that has no backdrop filter at all.");
    }
    if (!state.transparencyToggle) {
      add("warn", "transparency-toggle", "(project)", 0,
        "No `data-transparency` hook found. Doc §7: Safari does not support `prefers-reduced-transparency`, and Apple's own users are the ones most likely to have Reduce Transparency on, so the media query alone is not coverage.");
    }
    if (!state.deviceGate) {
      add("info", "device-gate", "(project)", 0,
        "No `navigator.hardwareConcurrency` or `navigator.deviceMemory` check found. Doc §8 and §13 step 7: feature-gate on device and drop to Tier 1 or Tier 0 at four cores or four gigabytes.");
    }
    if (state.surfaces.length > SURFACE_BUDGET) {
      add("warn", "surface-budget", "(project)", 0,
        state.surfaces.length + " glass surface(s) declared against doc §8's budget of " + SURFACE_BUDGET + " simultaneously in the viewport (2 on mobile). A declaration is not a viewport, so confirm the per-route count before treating this as a pass or a fail.");
    }
    if (state.refractors.length > REFRACTOR_BUDGET) {
      add("error", "refractor-budget", "(project)", 0,
        state.refractors.length + " refracting surface(s) declared: " +
        state.refractors.map((r) => r.selector).join(", ") +
        ". Doc §8 budgets exactly " + REFRACTOR_BUDGET + ". Refraction adds a displacement pass sampling the map per output pixel, on top of a blur that already costs 3-6ms per frame on a mid-range Android.");
    }
    if (state.refractors.length === 0 && state.namesLiquidGlass.size > 0) {
      add("warn", "blur-only-named-glass", "(project)", 0,
        "Glass surfaces are declared, none of them refract, and " + state.namesLiquidGlass.size + " file(s) call the result liquid glass. Doc §13's last anti-pattern: with `refractionScale` at 0 the emitted class names and docs say `glassmorphism`, not `liquid-glass`. A blur-only implementation is glassmorphism, which is a perfectly good and far more portable thing to be.");
    }
  }

  if (state.clearUses.length > 0 && state.scrimUses.length === 0) {
    add("error", "clear-without-scrim", state.clearUses[0].file, state.clearUses[0].line,
      "`" + state.clearUses[0].selector + "` uses the Clear variant's fill and no `--lg-scrim` layer appears anywhere in the scanned files. Doc §4: the scrim is mandatory under Clear, and Apple restricts Clear to three conditions holding at once — a media-rich backdrop, content that tolerates dimming, and a bold bright foreground. A Clear surface with no scrim is a refusal, not a clamp.");
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
      glassSurfaces: state.surfaces.length,
      refractingSurfaces: state.refractors.length,
      filterDefs: state.filterDefs,
      maxBlurPx: state.surfaces.reduce((n, s) => (s.blur !== null && s.blur > n ? s.blur : n), 0) || null,
      a11yQueriesFound: [...state.queries].sort(),
      tier0Fallback: state.tier0,
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
      "lg-scan.mjs — Liquid Glass-specific static invariants\n\n" +
      "  node lg-scan.mjs [path ...] [--json] [--quiet] [--no-fail]\n\n" +
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
      summary.glassSurfaces + " glass surface(s), " + summary.refractingSurfaces + " refracting, " +
      summary.filterDefs + " inline filter defs, max literal blur " +
      (summary.maxBlurPx === null ? "n/a" : summary.maxBlurPx + "px") + ".\n" +
      "Tier 0 fallback: " + (summary.tier0Fallback ? "present" : "ABSENT") + ".\n" +
      "Accessibility queries present: " + (summary.a11yQueriesFound.join(", ") || "none") + ".\n" +
      summary.errors + " error(s), " + summary.warnings + " warning(s), " + summary.infos + " info.\n" +
      "Contrast, focus, target size and forced-colors keyword checks are not run here — call ui-morphism-core:a11y-validate.\n");
  }

  return !noFail && summary.errors > 0 ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
