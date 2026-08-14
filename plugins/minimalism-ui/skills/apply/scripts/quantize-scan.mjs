#!/usr/bin/env node
/**
 * quantize-scan.mjs — the minimalism inventory, quantisation plan and
 * affordance-restoration pass.
 *
 * Source of truth: docs/05-minimalism.md §13 (the nine transformations, the
 * self-run validation checklist and the anti-pattern list), §4 (the ramps every
 * value is snapped onto), §3 (the elevation and neutral statements), §6
 * (durations and easings) and §7 (what must never be deleted).
 *
 * WHY THIS SCRIPT EXISTS. Minimalism is the only style in the set whose skill is
 * mostly SUBTRACTIVE, and doc §13 asks it for two things prose cannot deliver: a
 * quantisation two runs agree on, and a COUNT.
 * `reports/minimalism-diff-summary.md` is specified as "colours removed (count),
 * shadows removed (count), font sizes collapsed from N to 9, spacing values
 * collapsed from N to 9" — N is a measurement of the user's codebase, not a
 * number a model can estimate by reading. And snapping a 15px padding onto the
 * 4px ramp has to land on 16px every time, in every file, or the discipline the
 * style depends on ("one off-scale spacing value is immediately visible", §9) is
 * lost inside the tool meant to enforce it.
 *
 * THREE CLASSES OF FINDING, and the third is what makes this style safe:
 *
 *   quantise  a value off one of §4's ramps, with the rung it snaps to.
 *             Deterministic, reversible, counted.
 *   subtract  decoration §13 step 6 removes: backdrop-filter, blur and
 *             drop-shadow filters, text-shadow, mix-blend-mode, gradients on
 *             non-overlay surfaces, elevation above the resolved
 *             decorationBudget, weights above 600, durations above 300ms.
 *   restore   the compensating pass, §13 step 7, run ALWAYS. Ghost primary
 *             buttons, `outline: none` with no replacement, links stripped of
 *             their underline, targets under the SC 2.5.8 floor, fixed heights
 *             on text-bearing containers, px type and px measures. Subtraction
 *             without this pass is the style's documented failure mode:
 *             "stripping signifiers off a control does not make the control
 *             simpler; it makes it invisible" (§1).
 *
 * SCOPE. This script computes NO contrast, NO luminance, NO alpha compositing,
 * NO focus-visible verdict, NO forced-colors audit and NO reduced-motion audit.
 * Those are the nine universal checks and they belong to
 * ui-morphism-core:a11y-validate, the single implementation for all ten style
 * plugins. Where this script touches a colour it is sorting or counting it,
 * never judging whether it is legible. Do not add the maths here.
 *
 * Usage:
 *   node quantize-scan.mjs [path ...] [--json] [--quiet] [--no-fail]
 *                          [--decoration-budget=0-3]
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

/* ---------------------------------------------------------------- the ramps */

/** §4: --min-space-1 … --min-space-24, 4px base unit. */
export const SPACE_RAMP = [4, 8, 12, 16, 24, 32, 48, 64, 96];

/** §4: --min-radius-sm / -md / -lg / -full. §13 step 3 snaps to exactly these. */
export const RADIUS_RAMP = [4, 8, 12, 9999];

/** §4: --min-text-xs … --min-text-5xl in px. Scale ratio 1.200. */
export const TYPE_RAMP = [12, 14, 16, 18, 20, 24, 30, 36, 48];

/** §4: --min-dur-instant / -fast / -base / -slow. Nothing here exceeds 300ms. */
export const DURATION_RAMP = [100, 150, 200, 300];

/** §4: --min-weight-normal / -medium / -semibold. "No weight above 600." */
export const WEIGHT_RAMP = [400, 500, 600];

/** §7 / §4: the SC 2.5.8 floor. It is a floor, not the resting size. */
export const TARGET_MIN = 24;

/** §3: at most two shadow steps, "both under 8px blur and under 8% opacity". */
export const SHADOW_BLUR_MAX = 8;
export const SHADOW_ALPHA_MAX = 0.08;

/** §13 checklist item 2: at most 2 chromatic hues and 11 neutral steps. */
export const HUE_MAX = 2;
export const NEUTRAL_STEP_MAX = 11;

/**
 * The channel spread, out of 255, below which a colour literal SORTS as neutral
 * for the census. A coarse sorting device and nothing else: not a colour-space
 * conversion, not a chroma measurement, and emphatically not a luminance or
 * contrast computation. The authoritative chroma ceiling is the `chromaBudget`
 * knob in OKLCH, which ui-morphism-core resolves from
 * assets/intensity.contract.json; the authoritative legibility verdict is
 * ui-morphism-core:a11y-validate's. 8/255 sorts the whole §4 neutral ramp as
 * neutral while a brand tint at §13's 0.06 chroma ceiling sorts as chromatic,
 * which is all the census needs.
 */
export const NEUTRAL_SPREAD = 8;

/** §3: "Anything reading as 'floating' is reserved for genuine overlays." */
const OVERLAY_SELECTOR =
  /\b(dialog|modal|popover|menu|dropdown|tooltip|toast|sheet|drawer|command|combobox|listbox|overlay)\b/i;

/** Selectors naming a primary action, for the ghost-button pass (§13 step 7). */
const PRIMARY_SELECTOR = /\b(primary|cta|submit|confirm|main-action|btn-main)\b/i;

/** Selectors carrying text whose box must not be pinned (SC 1.4.12, §7). */
const TEXT_SELECTOR =
  /\b(label|caption|title|heading|h[1-6]|text|copy|prose|body|desc|description|hint|help|message|error|badge|chip|tag|cell|link|nav-item|menu-item)\b/i;

/** Selectors that are, or contain, a control. Used by the target-size pass. */
const CONTROL_SELECTOR =
  /(^|[\s>+~,])(a|button|input|select|textarea|summary)\b|\b(btn|button|icon-button|iconbtn|control|close|chevron|toggle|switch|checkbox|radio|tab|link)\b/i;

/** A prose container, for the px-measure pass (§13 checklist item 9). */
const PROSE_SELECTOR = /\b(prose|article|measure|copy|content|readable|markdown|md)\b/i;

const ICON_FONT =
  /\b(icomoon|fontawesome|font-awesome|material-icons|glyphicons|ionicons|feather-font)\b/i;

/* -------------------------------------------------------------- the parser */

/**
 * A deliberately small CSS-shaped parser. It runs over stylesheets and over
 * JS/TS files alike: backticks are NOT string delimiters here, so CSS held in a
 * template literal — which doc §5's React recipe does throughout — is parsed
 * like any other sheet. Quoted strings and comments are skipped, so a
 * `url("a{b.png")` cannot desynchronise the brace stack.
 *
 * Returns a flat list of rules: { selector, ancestors, line, decls }.
 */
export function parse(text) {
  const rules = [];
  const stack = [];
  let buf = "";
  let bufLine = 1;
  let line = 1;
  let current = { selector: "", ancestors: [], line: 1, decls: [] };

  const pushDecl = () => {
    const raw = buf.trim();
    buf = "";
    if (!raw) return;
    const ci = raw.indexOf(":");
    if (ci <= 0) return;
    const prop = raw.slice(0, ci).trim().toLowerCase();
    if (!/^-{0,2}[a-z][a-z0-9-]*$/.test(prop)) return;
    current.decls.push({ prop, value: raw.slice(ci + 1).trim(), line: bufLine });
  };

  const norm = (s) => s.replace(/\s+/g, " ").trim();

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      const skipped = text.slice(i, end === -1 ? text.length : end + 2);
      line += (skipped.match(/\n/g) || []).length;
      i = end === -1 ? text.length : end + 1;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < text.length && text[j] !== ch) {
        if (text[j] === "\\") j++;
        else if (text[j] === "\n") line++;
        j++;
      }
      buf += text.slice(i, Math.min(j + 1, text.length));
      i = j;
      continue;
    }
    if (ch === "\n") {
      line++;
      buf += " ";
      continue;
    }
    if (ch === "{") {
      /* A backtick ends whatever JS preceded the sheet. `const css = ` is not
         part of the first selector, so the selector starts after the last one
         seen. Backticks are deliberately not string delimiters above — that is
         what lets a template literal be parsed as a sheet at all. */
      const tick = buf.lastIndexOf("`");
      const selector = norm(tick === -1 ? buf : buf.slice(tick + 1));
      buf = "";
      if (current.decls.length) rules.push({ ...current });
      stack.push(current);
      current = {
        selector,
        ancestors: stack.filter((r) => r.selector).map((r) => r.selector),
        line: bufLine,
        decls: [],
      };
      continue;
    }
    if (ch === "}") {
      pushDecl();
      if (current.decls.length || current.selector) rules.push(current);
      const parent = stack.pop();
      current = parent
        ? { selector: parent.selector, ancestors: parent.ancestors, line: parent.line, decls: [] }
        : { selector: "", ancestors: [], line, decls: [] };
      continue;
    }
    if (ch === ";") {
      pushDecl();
      continue;
    }
    if (buf.trim() === "" && !/\s/.test(ch)) bufLine = line;
    buf += ch;
  }
  pushDecl();
  if (current.decls.length) rules.push(current);
  return rules;
}

/* --------------------------------------------------------------- utilities */

/**
 * Nearest value on a ramp. The map is total: every finite input lands on a rung.
 *
 * `tie` decides the direction when a value sits exactly between two rungs, which
 * on these evenly-spaced ramps happens constantly (6 between 4 and 8, 10 between
 * 8 and 12, 15 between 14 and 16, 450 between 400 and 500). The default is
 * `"down"` — the subtractive direction, which is this style's default posture.
 * Two call sites pass `"up"` instead, and both do it for a stated reason:
 *
 *   font-size  the larger rung is the legibility-safe direction. A 15px body
 *              size resolving to 14px makes text smaller than the author asked
 *              for, which is the wrong way to move under §7's 1.4.3 / 1.4.4
 *              posture.
 *   radius     the softer silhouette is the one that survives; the ramp's own
 *              12px ceiling is what stops the drift, since every value above it
 *              snaps back down to 12 regardless (9999 being the pill rung, which
 *              nothing rounds into).
 *
 * Ties are the only thing `tie` touches. A value nearer one rung than the other
 * always goes to the nearer rung.
 */
export function snap(value, ramp, tie = "down") {
  let best = ramp[0];
  let bestDist = Math.abs(value - ramp[0]);
  for (const r of ramp) {
    const d = Math.abs(value - r);
    if (d < bestDist || (d === bestDist && tie === "up" && r > best)) {
      best = r;
      bestDist = d;
    }
  }
  return best;
}

/** px value of a static length token, or null. A bare `0` counts as 0. */
export function toPx(token, rootPx = 16) {
  const t = token.trim();
  if (/^0$/.test(t)) return 0;
  const m = /^(-?[0-9]*\.?[0-9]+)(px|rem|em)$/.exec(t);
  if (!m) return null;
  const n = Number(m[1]);
  return m[2] === "px" ? n : n * rootPx;
}

/** ms value of a time token, or null. */
export function toMs(token) {
  const m = /^(-?[0-9]*\.?[0-9]+)(ms|s)$/.exec(token.trim());
  if (!m) return null;
  return m[2] === "s" ? Number(m[1]) * 1000 : Number(m[1]);
}

/** #rgb / #rrggbb / rgb() to [r,g,b]. Notation reading only; no colour maths. */
export function rgbOf(literal) {
  const hex = /^#([0-9a-f]{3,8})$/i.exec(literal.trim());
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split("").map((c) => c + c).join("");
    if (h.length < 6) return null;
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const fn = /^rgba?\(([^)]*)\)$/i.exec(literal.trim());
  if (fn) {
    const parts = fn[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) return parts;
  }
  return null;
}

/**
 * Sorts a colour literal into `neutral` or one of six coarse hue sectors, by
 * which channel is largest and which is smallest. A census sorting device for
 * §13 checklist item 2 — not a hue angle, not a chroma, and not an input to any
 * accessibility decision.
 */
export function hueSector(literal) {
  const rgb = rgbOf(literal);
  if (!rgb) return null;
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min <= NEUTRAL_SPREAD) return "neutral";
  const hi = max === r ? "r" : max === g ? "g" : "b";
  const lo = min === r ? "r" : min === g ? "g" : "b";
  return hi + "-" + lo;
}

/** The alpha a colour literal STATES, or 1. Read, never composited. */
export function alphaOf(literal) {
  const fn = /^rgba?\(([^)]*)\)$/i.exec(literal.trim());
  if (fn) {
    const parts = fn[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length >= 4) {
      const a = parts[3].endsWith("%") ? Number(parts[3].slice(0, -1)) / 100 : Number(parts[3]);
      return Number.isFinite(a) ? a : 1;
    }
    return 1;
  }
  const hex = /^#([0-9a-f]{8})$/i.exec(literal.trim());
  if (hex) return parseInt(hex[1].slice(6, 8), 16) / 255;
  return 1;
}

const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\([^()]*\)|hsla?\([^()]*\)/g;

const isOverlay = (rule) =>
  OVERLAY_SELECTOR.test(rule.selector) || rule.ancestors.some((a) => OVERLAY_SELECTOR.test(a));

const declOf = (rule, prop) => rule.decls.find((d) => d.prop === prop);

/** The --min-space-N token name for a rung on the 4px ramp. */
const spaceToken = (px) => "--min-space-" + px / 4;

/* ------------------------------------------------------------------- scan */

/**
 * @param {{file: string, text: string}[]} files
 * @param {{decorationBudget?: number}} [options] `decorationBudget` is the
 *   resolved knob from assets/intensity.contract.json — how many shadow rungs
 *   this run may emit. Core resolves it; this script only reads it, and defaults
 *   to the one rung the default intensity 60 resolves to.
 */
export function scan(files, options = {}) {
  const decorationBudget = options.decorationBudget ?? 1;
  const findings = [];
  const colours = new Map();
  const spacing = new Set();
  const radii = new Set();
  const sizes = new Set();
  const durations = new Set();
  let shadowDecls = 0;

  const add = (kind, severity, rule, d, message, fix) =>
    findings.push({
      kind,
      severity,
      selector: rule.selector || "<root>",
      file: rule.file,
      line: d ? d.line : rule.line,
      prop: d ? d.prop : null,
      message,
      fix: fix ?? null,
    });

  for (const { file, text } of files) {
    for (const rule of parse(text)) {
      rule.file = file;
      const overlay = isOverlay(rule);

      for (const d of rule.decls) {
        const value = d.value;
        const isToken = d.prop.startsWith("--");

        /* -------------------------------------------------- palette census */
        for (const lit of value.match(COLOUR_LITERAL) || []) {
          const key = lit.toLowerCase().replace(/\s+/g, "");
          const entry = colours.get(key) || { literal: lit, count: 0, sector: hueSector(lit) };
          entry.count++;
          colours.set(key, entry);
        }

        /* ------------------------------------------------------- quantise */
        if (/^(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$/.test(d.prop)) {
          for (const token of value.split(/\s+/)) {
            const px = toPx(token);
            if (px === null || px <= 0) continue;
            spacing.add(px);
            const target = snap(px, SPACE_RAMP);
            if (target !== px) {
              add("quantise", "warn", rule, d,
                d.prop + ": " + token + " is off the 4px ramp",
                target + "px (" + spaceToken(target) + ")");
            }
          }
        }

        if (/border(-(top|bottom))?(-(left|right|start|end))?-radius$/.test(d.prop)) {
          for (const token of value.split(/[\s/]+/)) {
            const px = toPx(token);
            if (px === null || px <= 0) continue;
            radii.add(px);
            const target = snap(px, RADIUS_RAMP, "up");
            if (target !== px) {
              add("quantise", "warn", rule, d,
                "border-radius: " + token + " is not one of 4 / 8 / 12 / 9999px",
                target + "px");
            }
          }
        }

        if (d.prop === "font-size") {
          const px = toPx(value);
          if (px !== null && px > 0) {
            sizes.add(px);
            const target = snap(px, TYPE_RAMP, "up");
            if (target !== px) {
              add("quantise", "warn", rule, d,
                "font-size: " + value + " is off the nine-step 1.200 ramp",
                target / 16 + "rem");
            }
            if (/px$/.test(value.trim()) && px <= 24 && !isToken) {
              add("restore", "warn", rule, d,
                "body-grade font-size in px does not respond to the user's text size (SC 1.4.4)",
                px / 16 + "rem");
            }
          }
        }

        if (d.prop === "font-weight") {
          const w = Number(value);
          if (Number.isFinite(w) && w > 0) {
            if (w > 600) {
              add("subtract", "error", rule, d,
                "font-weight " + w + " is above this style's 600 ceiling (doc §4)", "600");
            } else if (!WEIGHT_RAMP.includes(w)) {
              add("quantise", "warn", rule, d,
                "font-weight " + w + " is off the 400 / 500 / 600 ramp",
                String(snap(w, WEIGHT_RAMP)));
            }
          }
        }

        if (/^(transition|animation)(-duration)?$/.test(d.prop)) {
          for (const token of value.split(/[\s,]+/)) {
            const ms = toMs(token);
            if (ms === null || ms <= 0) continue;
            durations.add(ms);
            if (ms > 300) {
              add("subtract", "error", rule, d,
                ms + "ms is above the 300ms ceiling — over 300ms reads as sluggish in this style (doc §4)",
                "300ms");
            } else if (!DURATION_RAMP.includes(ms)) {
              add("quantise", "warn", rule, d,
                ms + "ms is off the 100 / 150 / 200 / 300ms ramp",
                snap(ms, DURATION_RAMP) + "ms");
            }
          }
        }

        if (/cubic-bezier\([^)]*[(,]\s*-/.test(value) || /\b(spring|elastic|bounce|back-out|easeback)\b/i.test(value)) {
          add("subtract", "warn", rule, d,
            "spring or overshoot easing — a control point outside [0,1] is off-style (doc §6)",
            "cubic-bezier(0.2, 0, 0, 1) entering, cubic-bezier(0.4, 0, 1, 1) exiting");
        }

        /* ------------------------------------------------------- subtract */
        if ((d.prop === "backdrop-filter" || d.prop === "-webkit-backdrop-filter") && value.trim() !== "none") {
          add("subtract", "error", rule, d,
            "backdrop-filter on a base-layer surface — this style declares --min-backdrop-blur: 0px as an explicit contract, and a request that genuinely wants blur belongs to glassmorphism-ui",
            "remove; keep an opaque --min-surface-* fill");
        }
        if (d.prop === "filter" && /\b(blur|drop-shadow)\(/.test(value)) {
          add("subtract", "error", rule, d,
            "filter: blur() / drop-shadow() is decoration §13 step 6 removes", "remove");
        }
        if (d.prop === "text-shadow" && value.trim() !== "none") {
          add("subtract", "error", rule, d, "text-shadow is decoration §13 step 6 removes", "remove");
        }
        if (d.prop === "mix-blend-mode" && value.trim() !== "normal") {
          add("subtract", "error", rule, d, "mix-blend-mode is decoration §13 step 6 removes", "remove");
        }
        if (/(linear|radial|conic)-gradient\(/.test(value) && !overlay) {
          const stops = (value.match(COLOUR_LITERAL) || []).length;
          add("subtract", stops >= 3 ? "error" : "warn", rule, d,
            stops + "-stop gradient on a non-overlay surface (§13 step 6)",
            "the dominant flat colour");
        }

        if (d.prop === "box-shadow" && value.trim() !== "none") {
          shadowDecls++;
          const layerValues = value.split(/,(?![^()]*\))/);
          const layers = layerValues.length;
          const wantRung = overlay ? 2 : 1;
          if (layers > 2) {
            add("subtract", "warn", rule, d,
              layers + " shadow layers — this style ships at most two steps (doc §3)",
              overlay ? "--min-shadow-2" : "--min-shadow-1");
          }
          /* The blur radius is the third length of a layer, so the lengths have
             to be read per layer and with the colour removed first — `rgb(0 0 0
             / 0.06)` contributes three bare numbers that would otherwise be
             counted as geometry, and a leading unitless `0` offset is a length
             that a px-only match drops. */
          for (const layer of layerValues) {
            const geometry = layer
              .replace(/[a-z-]+\([^()]*\)/gi, " ")
              .replace(/#[0-9a-f]{3,8}\b/gi, " ");
            const lengths = (geometry.match(/-?[0-9]*\.?[0-9]+(?:px|rem|em)?\b/g) || [])
              .map((t) => toPx(t))
              .filter((n) => n !== null);
            const blur = lengths[2];
            if (Number.isFinite(blur) && blur > SHADOW_BLUR_MAX && !overlay) {
              add("subtract", "warn", rule, d,
                blur + "px blur on a resting surface — §3 keeps both steps under 8px blur",
                "--min-shadow-1, or a --min-border-strong hairline instead");
            }
          }
          for (const lit of value.match(COLOUR_LITERAL) || []) {
            const a = alphaOf(lit);
            if (a > SHADOW_ALPHA_MAX && !overlay) {
              add("subtract", "warn", rule, d,
                "shadow colour states alpha " + a + " — §3 keeps resting elevation under 8% opacity",
                "--min-shadow-1");
            }
          }
          if (wantRung > decorationBudget) {
            add("subtract", "warn", rule, d,
              "elevation is above the resolved decorationBudget of " + decorationBudget + " rung(s)",
              decorationBudget === 0
                ? "border: var(--min-border-width) solid var(--min-border-subtle)"
                : "--min-shadow-" + decorationBudget);
          }
        }

        if (d.prop === "font-family" && ICON_FONT.test(value)) {
          add("subtract", "error", rule, d,
            "icon font — it blocks text render and breaks in forced-colors (doc §8)",
            "an inline SVG sprite");
        }

        if (/^animation(-iteration-count)?$/.test(d.prop) && /\binfinite\b/.test(value)) {
          add("subtract", "warn", rule, d,
            "infinite animation — permitted only where it represents an in-progress operation (§13 anti-patterns)",
            "a determinate indicator, or a finite iteration count");
        }

        /* -------------------------------------------------------- restore */
        if (d.prop === "outline" && /^(none|0(px)?)$/.test(value.trim())) {
          const replaced = rule.decls.some(
            (o) =>
              (o.prop === "outline" && !/^(none|0(px)?)$/.test(o.value.trim())) ||
              o.prop === "outline-width" || o.prop === "outline-color" || o.prop === "outline-style",
          );
          if (!replaced) {
            add("restore", "error", rule, d,
              "outline: none with no replacement indicator in the same rule (SC 2.4.7)",
              "outline: var(--min-focus-ring-width) solid var(--min-focus-ring); outline-offset: var(--min-focus-ring-offset)");
          }
        }

        if (d.prop === "text-decoration" && /\bnone\b/.test(value) &&
            /(^|[\s>+~,])a\b|\blink\b/i.test(rule.selector) && !/:hover/.test(rule.selector)) {
          add("restore", "warn", rule, d,
            "link underline removed — in a monochrome system colour alone fails SC 1.4.1",
            "keep the underline, or restore it on :hover with text-underline-offset: 3px");
        }

        if ((d.prop === "height" || d.prop === "width") && TEXT_SELECTOR.test(rule.selector)) {
          const px = toPx(value);
          if (px !== null && px > 0) {
            add("restore", "warn", rule, d,
              "fixed " + d.prop + " on a text-bearing container breaks under the 1.4.12 text-spacing overrides",
              "min-" + d.prop + ": " + px + "px");
          }
        }

        if (d.prop === "overflow" && /\bhidden\b/.test(value) && TEXT_SELECTOR.test(rule.selector)) {
          add("restore", "warn", rule, d,
            "overflow: hidden on a text container clips under the 1.4.12 spacing overrides",
            "let it wrap, or clamp visibly and keep the full value reachable");
        }

        if (d.prop === "max-width" && PROSE_SELECTOR.test(rule.selector) && /px$/.test(value.trim())) {
          add("restore", "warn", rule, d,
            "prose measure in px does not grow with text size at 200% zoom (SC 1.4.4)",
            "var(--min-measure) — 65ch");
        }

        if (/^(width|height|min-width|min-height)$/.test(d.prop) && CONTROL_SELECTOR.test(rule.selector)) {
          const px = toPx(value);
          if (px !== null && px > 0 && px < TARGET_MIN) {
            add("restore", "error", rule, d,
              d.prop + ": " + value + " on a control is below the " + TARGET_MIN + "px SC 2.5.8 floor",
              "take the floor from var(--min-target-min) and the resting size from var(--min-control-lg)");
          }
        }
      }

      /* ------------------------------ rule-level restore: ghost primaries */
      if (PRIMARY_SELECTOR.test(rule.selector) && CONTROL_SELECTOR.test(rule.selector)) {
        const bg = declOf(rule, "background") || declOf(rule, "background-color");
        const border = declOf(rule, "border") || declOf(rule, "border-color") || declOf(rule, "border-width");
        if (bg && /^(transparent|none|rgba\([^)]*,\s*0\s*\))$/i.test(bg.value.trim())) {
          const borderEmpty = !border || /\b(transparent|none|0)\b/.test(border.value);
          add("restore", "error", rule, bg,
            borderEmpty
              ? "ghost primary action: transparent fill and no boundary. Doc §10 ships solid, filled primary buttons; NN/g advises against ghost buttons as the primary CTA and reported click rates run materially lower"
              : "outline-only primary action — doc §10: ship solid, filled primary buttons",
            "background: var(--min-accent); color: var(--min-accent-fg); border-color: var(--min-accent)");
        }
      }
    }
  }

  /* ------------------------------------------------------------- census */
  const sectors = new Map();
  for (const entry of colours.values()) {
    if (!entry.sector) continue;
    sectors.set(entry.sector, (sectors.get(entry.sector) || 0) + 1);
  }
  const neutralCount = sectors.get("neutral") || 0;
  const hueFamilies = [...sectors.keys()].filter((s) => s !== "neutral");

  const census = { file: "<census>", selector: "<palette census>", line: 0, ancestors: [], decls: [] };
  if (hueFamilies.length > HUE_MAX) {
    add("subtract", "error", census, null,
      hueFamilies.length + " coarse hue families in the palette (" + hueFamilies.join(", ") +
        "); this style permits " + HUE_MAX + " chromatic hues — one accent and one danger",
      "collapse to --min-accent plus --min-danger");
  }
  if (neutralCount > NEUTRAL_STEP_MAX) {
    add("subtract", "warn", census, null,
      neutralCount + " distinct neutral literals; the generated ramp is " + NEUTRAL_STEP_MAX + " steps at most",
      "map onto --min-bg-* / --min-surface-* / --min-text-*");
  }

  const summary = {
    files: files.length,
    colourLiterals: colours.size,
    neutralLiterals: neutralCount,
    hueFamilies,
    shadowDeclarations: shadowDecls,
    fontSizes: { found: sizes.size, target: TYPE_RAMP.length },
    spacingValues: { found: spacing.size, target: SPACE_RAMP.length },
    radiusValues: { found: radii.size, target: RADIUS_RAMP.length },
    durationValues: { found: durations.size, target: DURATION_RAMP.length },
    decorationBudget,
    counts: {
      quantise: findings.filter((f) => f.kind === "quantise").length,
      subtract: findings.filter((f) => f.kind === "subtract").length,
      restore: findings.filter((f) => f.kind === "restore").length,
      error: findings.filter((f) => f.severity === "error").length,
      warn: findings.filter((f) => f.severity === "warn").length,
    },
  };

  return { findings, summary };
}

/* -------------------------------------------------------------------- CLI */

function collect(target, out, root) {
  let st;
  try {
    st = statSync(target);
  } catch {
    return out;
  }
  if (st.isDirectory()) {
    for (const entry of readdirSync(target)) {
      if (SKIP_DIRS.has(entry)) continue;
      collect(join(target, entry), out, root);
    }
    return out;
  }
  if (!SCANNABLE.has(extname(target))) return out;
  out.push({ file: relative(root, target) || target, text: readFileSync(target, "utf8") });
  return out;
}

export function report(result, quiet = false) {
  const { findings, summary } = result;
  const lines = [];
  lines.push("minimalism quantize-scan");
  lines.push(
    "  files " + summary.files + " · colour literals " + summary.colourLiterals +
      " (" + summary.neutralLiterals + " neutral, " + summary.hueFamilies.length +
      " hue famil" + (summary.hueFamilies.length === 1 ? "y" : "ies") + ")" +
      " · shadow declarations " + summary.shadowDeclarations,
  );
  lines.push(
    "  font sizes " + summary.fontSizes.found + " -> " + summary.fontSizes.target +
      " · spacing " + summary.spacingValues.found + " -> " + summary.spacingValues.target +
      " · radii " + summary.radiusValues.found + " -> " + summary.radiusValues.target +
      " · durations " + summary.durationValues.found + " -> " + summary.durationValues.target,
  );
  lines.push(
    "  quantise " + summary.counts.quantise + " · subtract " + summary.counts.subtract +
      " · restore " + summary.counts.restore +
      "  (" + summary.counts.error + " error, " + summary.counts.warn + " warn)",
  );
  if (!quiet) {
    for (const f of findings) {
      lines.push("  " + f.severity.toUpperCase().padEnd(5) + " " + f.kind.padEnd(8) + " " +
        f.file + ":" + f.line + "  " + f.selector);
      lines.push("        " + f.message);
      if (f.fix) lines.push("        -> " + f.fix);
    }
  }
  lines.push("  Contrast, focus, target size after transform, forced-colors and reduced-motion");
  lines.push("  verdicts belong to ui-morphism-core:a11y-validate. This scan computes none of them.");
  return lines.join("\n");
}

function main(argv) {
  const paths = [];
  let json = false;
  let quiet = false;
  let noFail = false;
  let decorationBudget = 1;
  for (const arg of argv) {
    if (arg === "--json") json = true;
    else if (arg === "--quiet") quiet = true;
    else if (arg === "--no-fail") noFail = true;
    else if (arg.startsWith("--decoration-budget=")) decorationBudget = Number(arg.split("=")[1]);
    else paths.push(arg);
  }
  const root = process.cwd();
  const files = [];
  for (const p of paths.length ? paths : ["."]) collect(resolve(root, p), files, root);
  const result = scan(files, { decorationBudget });
  process.stdout.write((json ? JSON.stringify(result, null, 2) : report(result, quiet)) + "\n");
  if (!noFail && result.summary.counts.error > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === new URL("file://" + process.argv[1]).href) {
  main(process.argv.slice(2));
}
