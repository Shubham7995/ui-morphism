#!/usr/bin/env node
/**
 * glass-scan.mjs — glassmorphism-specific static invariants.
 *
 * Source of truth: docs/03-glassmorphism.md §13 (the validation checklist the
 * skill must self-run, and the anti-pattern list it must refuse), §7
 * (forced-colors and reduced-transparency), §8 (blur budget), §5 (the @supports
 * wrapper and the prefix pairing).
 *
 * SCOPE. This script checks only what is specific to this style and mechanical
 * enough to be got wrong by accident:
 *
 *   - the -webkit-backdrop-filter twin
 *   - the @supports wrapper around every translucent branch
 *   - ancestor backdrop-root hazards (opacity < 1, filter, mask, clip-path,
 *     mix-blend-mode, will-change) — MARKETPLACE.md §7.3 names this scan as a
 *     style-specific check
 *   - transitions and keyframes that interpolate a blur radius
 *   - raster grain assets
 *   - the four accessibility escape hatches, the print sheet and the in-app
 *     transparency toggle
 *   - the glass-surface census and the scroll-pinned blur cap
 *
 * It computes NO contrast, NO focus-visible check, NO target size and NO
 * forced-colors keyword audit. Those are the nine universal checks and they
 * belong to ui-morphism-core:a11y-validate, which is the single implementation.
 * Do not add them here.
 *
 * Usage:
 *   node glass-scan.mjs [path ...] [--json] [--quiet] [--no-fail]
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

const BACKDROP_ROOT_PROPS = new Set([
  "filter", "mask", "mask-image", "-webkit-mask", "-webkit-mask-image",
  "clip-path", "-webkit-clip-path", "mix-blend-mode", "will-change",
]);

/* ------------------------------------------------------------------ parser */

/**
 * A deliberately small CSS-shaped parser. It runs over stylesheets and over
 * JS/TS files alike: backticks are NOT treated as string delimiters, so CSS
 * held in a template literal (the React recipe in doc §5 does exactly this) is
 * parsed like any other sheet. Quoted strings and comments are skipped, so a
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
 * strings survive, so `[data-transparency="reduced"]` still counts. The comment
 * rules are the parser's own: block comments, plus `//` line comments except
 * where a preceding `:` makes it a URL scheme.
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
const hasVar = (v) => /var\(|--value\(/.test(v);

/** First simple selector of each compound, minus pseudos and BEM modifiers. */
function rootClasses(prelude) {
  return prelude
    .split(",")
    .map((s) => s.trim().split(/[\s>+~]+/)[0] || "")
    .map((s) => s.replace(/::?[a-z-]+(\([^)]*\))?/gi, ""))
    .map((s) => s.split("--")[0])
    .filter(Boolean);
}

function endsInPseudoElement(prelude) {
  return prelude
    .split(",")
    .every((s) => /(::(before|after|backdrop|marker|placeholder|selection|first-line|first-letter)|:(before|after))\s*$/i.test(s.trim()));
}

function blurPx(value) {
  const m = /blur\(\s*([\d.]+)px\s*\)/i.exec(value);
  return m ? parseFloat(m[1]) : null;
}

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

/* ------------------------------------------------------------------- checks */

function scanFile(file, text, add, state) {
  const root = parse(text);
  const nodes = [];
  walk(root, (n) => nodes.push(n));

  /* Which root classes have a border declared anywhere in this file. The doc's
     own recipe puts the border on `.glass` and the blur on `.glass--2`, so a
     per-rule border check alone would fire on correct code. */
  const borderRoots = new Set();
  for (const n of nodes) {
    if (n.type !== "rule") continue;
    const hasBorder = n.decls.some((d) =>
      /^(border|border-width|border-color|border-style|border-inline|border-block)$/.test(d.prop) && !isNone(d.value));
    if (hasBorder) for (const rc of rootClasses(n.prelude)) borderRoots.add(rc);
  }

  for (const node of nodes) {
    const decls = node.decls;
    const bd = decls.filter((d) => d.prop === "backdrop-filter");
    const bdWebkit = decls.filter((d) => d.prop === "-webkit-backdrop-filter");
    const liveGlass = bd.filter((d) => !isNone(d.value));

    /* 1 — the -webkit- twin. Doc §13 checklist line 1, anti-pattern 3. */
    if (bd.length > 0 && bdWebkit.length === 0) {
      add("error", "webkit-prefix", file, bd[0].line,
        "`backdrop-filter` on `" + contextLabel(node) + "` has no `-webkit-backdrop-filter` twin. Safari 15-17 is still a real install base and only understands the prefixed form.");
    }

    /* 2 — the @supports wrapper. Doc §13 checklist line 2, anti-pattern 2. */
    for (const d of liveGlass) {
      if (!inAtRule(node, /@supports[^{]*backdrop-filter/i)) {
        add("error", "supports-fallback", file, d.line,
          "Translucent branch on `" + contextLabel(node) + "` is not inside `@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`. A browser without blur renders unreadable text on a see-through box.");
      }
    }

    /* 3 — census, blur caps, saturate pairing, border presence. */
    for (const d of liveGlass) {
      const px = blurPx(d.value);
      state.surfaces.push({ file, line: d.line, selector: node.prelude, blur: px });

      if (px !== null && px > 48) {
        add("error", "blur-max", file, d.line,
          "blur(" + px + "px) exceeds the knob maximum of 48px (doc §13 intensity table).");
      }
      const pinned = decls.some((x) => x.prop === "position" && /sticky|fixed/i.test(x.value));
      if (pinned && px !== null && px > 20) {
        add("error", "blur-cap-pinned", file, d.line,
          "blur(" + px + "px) on a scroll-pinned surface exceeds the 20px cap (doc §8 budget). This cap is independent of intensity.");
      }
      if (!hasVar(d.value) && /blur\(/i.test(d.value) && !/saturate\(/i.test(d.value)) {
        add("warn", "saturate-missing", file, d.line,
          "`" + contextLabel(node) + "` blurs without `saturate()`. Gaussian blur averages colour toward grey; 140-180% is what separates glass from a dirty window (doc §3, §10).");
      }
      const hasBorderHere = chain(node).some((n) => n.decls.some((x) =>
        /^(border|border-width|border-color|border-style)$/.test(x.prop) && !isNone(x.value)));
      const inherits = rootClasses(contextLabel(node)).some((rc) => borderRoots.has(rc));
      if (!hasBorderHere && !inherits) {
        add("warn", "border-missing", file, d.line,
          "`" + contextLabel(node) + "` declares no border and no base rule sharing its root class declares one. The 1px hairline is non-negotiable: `forced-colors: active` strips shadows, so a shadow-only edge leaves the pane with no boundary at all (doc §3, §7, §10).");
      }
    }

    /* 4 — animated blur. Doc §13 checklist line 9, anti-pattern 6. */
    for (const d of decls) {
      if (/^(transition|transition-property|animation|animation-name)$/.test(d.prop)) {
        if (/backdrop-filter|(^|[\s,(])filter([\s,)]|$)|border-radius/i.test(d.value)) {
          add("error", "animated-backdrop", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + contextLabel(node) + "` interpolates a blur radius, filter or border-radius. Every frame re-runs the blur shader over a fresh source (doc §6).");
        } else if (/(^|[\s,])all([\s,]|$)/i.test(d.value)) {
          add("warn", "animated-backdrop", file, d.line,
            "`" + d.prop + ": " + d.value + "` on `" + contextLabel(node) + "` transitions `all`, which silently includes `backdrop-filter`. Name the properties.");
        }
      }
      if (d.prop === "will-change" && /backdrop-filter|filter/i.test(d.value)) {
        add("error", "will-change-fix", file, d.line,
          "`will-change: " + d.value + "` is the anti-pattern-13 performance fix. `backdrop-filter` already forces a compositing layer; this only adds memory, and on an ancestor it creates a backdrop root that breaks the effect (doc §8).");
      }
    }

    /* 5 — keyframes that interpolate a blur. */
    if (inAtRule(node, /@keyframes/i)) {
      for (const d of decls) {
        if ((d.prop === "backdrop-filter" || d.prop === "filter") && !isNone(d.value)) {
          add("error", "animated-backdrop", file, d.line,
            "`@keyframes` step sets `" + d.prop + "`, interpolating a blur across frames (doc §6, anti-pattern 6).");
        }
      }
    }

    /* 6 — backdrop-root hazards. MARKETPLACE.md §7.3 style-specific check. */
    const pseudoOnly = node.type === "rule" && endsInPseudoElement(node.prelude);
    for (const d of decls) {
      let hazard = null;
      if (d.prop === "opacity") {
        if (hasVar(d.value)) hazard = "opacity: " + d.value + " (a var(), unresolvable statically)";
        else {
          const n = parseFloat(d.value);
          if (!Number.isNaN(n) && n < 1) hazard = "opacity: " + d.value;
        }
      } else if (BACKDROP_ROOT_PROPS.has(d.prop) && !isNone(d.value) && !/^normal$/i.test(d.value.trim())) {
        hazard = d.prop + ": " + d.value;
      }
      if (!hazard) continue;

      if (pseudoOnly) {
        add("info", "backdrop-root", file, d.line,
          "`" + contextLabel(node) + "` sets " + hazard + ". It is a pseudo-element, so it cannot be an ancestor of a glass surface — no action needed unless a glass surface is nested inside it.");
      } else {
        add("warn", "backdrop-root", file, d.line,
          "`" + contextLabel(node) + "` sets " + hazard + ". If this selector can match an ancestor of a glass surface it becomes the backdrop root, and the blur samples only inside it — a wrong result rendered cheaply, which is worse than an expensive correct one (doc §5, §8).");
      }
    }

    /* 7 — raster grain. Doc §13 checklist line 13, anti-pattern 8. */
    const grainish = /grain|noise|texture/i.test(node.prelude);
    for (const d of decls) {
      if (!/^(background|background-image|content|mask|mask-image|-webkit-mask|-webkit-mask-image)$/.test(d.prop)) continue;
      if (!RASTER.test(d.value)) continue;
      if (grainish || liveGlass.length > 0) {
        add("error", "raster-grain", file, d.line,
          "`" + contextLabel(node) + "` loads a raster image where the inline `feTurbulence` filter belongs. The asset-weight budget for this style is 0 KB; the SVG filter is roughly 220 bytes gzipped (doc §8, §10).");
      }
    }

    /* 8 — glass left alive inside forced-colors. Doc §7, anti-pattern 10. */
    if (inAtRule(node, /forced-colors\s*:\s*active/i)) {
      for (const d of liveGlass) {
        add("error", "forced-colors-blur", file, d.line,
          "`" + contextLabel(node) + "` keeps `backdrop-filter: " + d.value + "` inside a `forced-colors: active` block. The UA overrides colours but not `backdrop-filter`; a live blur smears the forced-colour backdrop and destroys the point of the mode.");
      }
      if (decls.some((d) => d.prop === "backdrop-filter" && isNone(d.value))) {
        state.forcedColorsNulls = true;
      }
    }

    /* 9 — file-level signals the project checks aggregate. */
    if (node.type === "atrule") {
      if (/prefers-reduced-transparency/i.test(node.prelude)) state.queries.add("prefers-reduced-transparency");
      if (/prefers-contrast/i.test(node.prelude)) state.queries.add("prefers-contrast");
      if (/forced-colors/i.test(node.prelude)) state.queries.add("forced-colors");
      if (/prefers-reduced-motion/i.test(node.prelude)) state.queries.add("prefers-reduced-motion");
      if (/^@media[^{]*\bprint\b/i.test(node.prelude)) state.queries.add("print");
    }
  }

  /* Comments are stripped first: a file that *mentions* `feTurbulence` or
     `data-transparency` in prose is documenting the requirement, not meeting
     it, and a check a comment can satisfy is not a check. */
  const code = stripComments(text);
  if (/data-transparency/.test(code)) state.transparencyToggle = true;
  if (/feTurbulence/i.test(code)) state.svgGrain = true;
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
    queries: new Set(),
    transparencyToggle: false,
    svgGrain: false,
    forcedColorsNulls: false,
  };

  for (const { file, text } of inputs) scanFile(file, text, add, state);

  /* Project-level checks. Deliberately not per-file: the accessibility layer
     legitimately lives in its own sheet (doc §13 output 3, glass.layer.css). */
  if (state.surfaces.length > 0) {
    const required = [
      ["prefers-reduced-transparency", "Doc §7: required for any style emitting backdrop-filter, and Safari has no media query for it."],
      ["prefers-contrast", "Doc §7: `prefers-contrast: more` must produce the opaque variant."],
      ["forced-colors", "Doc §7: forced colors does not override `backdrop-filter`; you must null it by hand."],
      ["prefers-reduced-motion", "Doc §6: durations collapse to 1ms and `background-attachment` switches to `scroll`."],
    ];
    for (const [q, why] of required) {
      if (!state.queries.has(q)) {
        add("error", "a11y-blocks", "(project)", 0,
          "No `@media (" + q + ")` block found in the scanned files, but " + state.surfaces.length + " glass surface(s) were. " + why);
      }
    }
    if (state.queries.has("forced-colors") && !state.forcedColorsNulls) {
      add("warn", "forced-colors-blur", "(project)", 0,
        "A `forced-colors: active` block exists but no rule inside it sets `backdrop-filter: none`. Null it explicitly.");
    }
    if (!state.queries.has("print")) {
      add("warn", "print-opaque", "(project)", 0,
        "No `@media print` block found. Doc §13: the print stylesheet must render all glass surfaces opaque — `backdrop-filter` does not exist in print, email HTML or PDF export.");
    }
    if (!state.transparencyToggle) {
      add("warn", "transparency-toggle", "(project)", 0,
        "No `data-transparency` hook found. Safari does not implement `prefers-reduced-transparency`, and it is the platform whose users are most likely to have Reduce Transparency on, so an in-app toggle is required (doc §7).");
    }
    if (!state.svgGrain) {
      add("info", "raster-grain", "(project)", 0,
        "No `feTurbulence` filter found. If the design carries grain it must be the inline SVG filter at baseFrequency 0.8 / numOctaves 4, not a raster asset (doc §4, §8).");
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
      glassSurfaces: state.surfaces.length,
      maxBlurPx: state.surfaces.reduce((m, s) => (s.blur !== null && s.blur > m ? s.blur : m), 0) || null,
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
      "glass-scan.mjs — glassmorphism-specific static invariants\n\n" +
      "  node glass-scan.mjs [path ...] [--json] [--quiet] [--no-fail]\n\n" +
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
      summary.glassSurfaces + " glass surface(s), max literal blur " + (summary.maxBlurPx === null ? "n/a" : summary.maxBlurPx + "px") + ".\n" +
      "Accessibility queries present: " + (summary.a11yQueriesFound.join(", ") || "none") + ".\n" +
      summary.errors + " error(s), " + summary.warnings + " warning(s), " + summary.infos + " info.\n" +
      "Contrast, focus, target size and forced-colors keyword checks are not run here — call ui-morphism-core:a11y-validate.\n");
  }

  return !noFail && summary.errors > 0 ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
