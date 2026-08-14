/**
 * Tests for neu-scan.mjs.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/02-neumorphism.md §13 — either the validation
 * checklist the skill must self-run, or the anti-pattern list it must refuse —
 * or from the §7 accessibility rules and §8 budgets those two sections cite.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { scan, splitTop, layerGeometry, isNeumorphicPair } from "./neu-scan.mjs";

/** Convenience: scan one virtual file and return its findings. */
const one = (name, text) => scan([{ file: name, text }]).findings;

const rules = (findings) => findings.map((f) => f.rule);
const errorsOf = (findings) => findings.filter((f) => f.severity === "error");
const find = (findings, rule) => findings.find((f) => f.rule === rule);

/**
 * A well-formed sheet: the clean-neumorphism variant doc §13 ships. Hairline
 * border, accent focus outline, both dark blocks, all four guard queries, the
 * ramp at blur = 2 x distance and the pressed rung at 0.6x. Used as the base
 * for single-defect fixtures, and asserted clean on its own.
 */
const GOOD = `
:root {
  --nm-surface: #e6e7ee;
  --nm-hairline: #7c7f93;
  --nm-accent: #4c5bd4;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --nm-surface: #2a2e39; }
}
:root[data-theme="dark"] { --nm-surface: #2a2e39; }

.nm-btn {
  min-height: 44px;
  background: var(--nm-surface);
  border: 1px solid var(--nm-hairline);
  border-radius: 14px;
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  transition: box-shadow 180ms cubic-bezier(0.16, 1, 0.3, 1);
}
.nm-btn:active {
  box-shadow: inset 3px 3px 6px #b8b9be, inset -3px -3px 6px #ffffff;
  border-color: var(--nm-accent);
}
.nm-btn:focus-visible {
  outline: 3px solid var(--nm-accent);
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .nm-btn { transition-duration: 1ms; }
}
@media (forced-colors: active) {
  .nm-btn { box-shadow: none; background: Canvas; border: 2px solid ButtonText; }
}
@media (prefers-reduced-transparency: reduce) {
  .nm-btn { box-shadow: 0 2px 6px #b8b9be; }
}
@media (update: slow) {
  .nm-btn { box-shadow: 0 2px 6px #b8b9be; }
}
`;

/* ------------------------------------------------------------ value tools -- */

test("splitTop respects parentheses inside a shadow layer", () => {
  const parts = splitTop("5px 5px 10px rgb(184 185 190 / .5), -5px -5px 10px #fff");
  assert.equal(parts.length, 2);
  assert.equal(parts[0], "5px 5px 10px rgb(184 185 190 / .5)");
});

test("layerGeometry reads offsets, blur, spread and inset", () => {
  const g = layerGeometry("inset -5px -5px 10px 2px #ffffff");
  assert.deepEqual(g, { x: -5, y: -5, blur: 10, spread: 2, inset: true });
  assert.equal(layerGeometry("5px 5px var(--nm-b-sm) #b8b9be"), null);
});

test("isNeumorphicPair recognises mirrored offsets and the composed tokens", () => {
  const v = "5px 5px 10px #b8b9be, -5px -5px 10px #ffffff";
  assert.equal(isNeumorphicPair(v, splitTop(v)), true);
  const token = "var(--nm-raised-md)";
  assert.equal(isNeumorphicPair(token, splitTop(token)), true);
  const single = "0 2px 6px #b8b9be";
  assert.equal(isNeumorphicPair(single, splitTop(single)), false);
  const asym = "6px 6px 12px #b8b9be, -2px -2px 6px #ffffff";
  assert.equal(isNeumorphicPair(asym, splitTop(asym)), false);
});

/* ------------------------------------------------------------- the baseline */

test("the clean-neumorphism baseline produces no errors", () => {
  const findings = one("good.css", GOOD);
  assert.deepEqual(errorsOf(findings), [], "unexpected: " + JSON.stringify(errorsOf(findings), null, 2));
});

test("doc §8's own cheap fallbacks are not held to the ramp", () => {
  const findings = one("fallback.css", GOOD + `
.nm-cheap-1 { box-shadow: 6px 6px 12px #b8b9be, -2px -2px 6px #ffffff; }
.nm-cheap-2 { border: 1px solid var(--nm-hairline); box-shadow: 0 2px 6px #b8b9be; }
`);
  assert.deepEqual(errorsOf(findings), []);
  assert.ok(!rules(findings).includes("blur-ratio"));
});

/* ---------------------------------------------- the refusal that defines it */

test("an interactive element whose only boundary is the pair is an error", () => {
  const findings = one("btn.css", GOOD.replace("  border: 1px solid var(--nm-hairline);\n", ""));
  const hit = find(findings, "shadow-only-affordance");
  assert.ok(hit, "expected a shadow-only-affordance finding");
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /1\.2:1 and 1\.7:1/);
  assert.match(hit.message, /--nm-hairline/);
});

test("a border declared on the base rule covers the pressed state rule", () => {
  const findings = one("btn.css", GOOD);
  assert.ok(!rules(findings).includes("shadow-only-affordance"));
});

test("a non-interactive surface with no border is not refused", () => {
  const findings = one("card.css", GOOD + `
.nm-card { background: var(--nm-surface); box-shadow: 8px 8px 16px #b8b9be, -8px -8px 16px #ffffff; }
`);
  assert.ok(!rules(findings).includes("shadow-only-affordance"));
});

/* ------------------------------------------------------------------ geometry */

test("blur / distance outside [1.5, 3.0] is an error", () => {
  const findings = one("ratio.css", GOOD + `
.nm-fog { background: var(--nm-surface); box-shadow: 6px 6px 30px #b8b9be, -6px -6px 30px #ffffff; }
`);
  const hit = find(findings, "blur-ratio");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /5\.00/);
});

test("a ratio inside the band but off the 2x ramp is a warning", () => {
  const findings = one("ratio.css", GOOD + `
.nm-off { background: var(--nm-surface); box-shadow: 4px 4px 10px #b8b9be, -4px -4px 10px #ffffff; }
`);
  const hit = find(findings, "blur-ratio");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("non-zero spread is an error", () => {
  const findings = one("spread.css", GOOD + `
.nm-spread { background: var(--nm-surface); box-shadow: 5px 5px 10px 2px #b8b9be, -5px -5px 10px 2px #ffffff; }
`);
  const hit = find(findings, "shadow-spread");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("more than two layers on one element is an error", () => {
  const findings = one("layers.css", GOOD + `
.nm-stack {
  background: var(--nm-surface);
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff, 0 1px 2px #b8b9be;
}
`);
  const hit = find(findings, "layer-budget");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("blur above the 40px ceiling is an error", () => {
  const findings = one("blur.css", GOOD + `
.nm-slab { background: var(--nm-surface); box-shadow: 24px 24px 48px #b8b9be, -24px -24px 48px #ffffff; }
`);
  const hit = find(findings, "blur-ceiling");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("blur above 24px inside a scrolling container is an error", () => {
  const findings = one("scroll.css", GOOD + `
.nm-scroller {
  overflow: auto;
  background: var(--nm-surface);
  box-shadow: 16px 16px 32px #b8b9be, -16px -16px 32px #ffffff;
}
`);
  const hit = find(findings, "blur-scroller");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("blur above 16px on a repeating list item is a warning", () => {
  const findings = one("list.css", GOOD + `
.result-item { background: var(--nm-surface); box-shadow: 10px 10px 20px #b8b9be, -10px -10px 20px #ffffff; }
`);
  const hit = find(findings, "blur-repeat");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("a pressed rung off 0.6x its raised counterpart is a warning", () => {
  const findings = one("pressed.css", GOOD + `
.nm-pad { background: var(--nm-surface); box-shadow: 8px 8px 16px #b8b9be, -8px -8px 16px #ffffff; }
.nm-pad:active { box-shadow: inset 8px 8px 16px #b8b9be, inset -8px -8px 16px #ffffff; }
`);
  const hit = find(findings, "pressed-ratio");
  assert.ok(hit);
  assert.match(hit.message, /5px/);
});

/* ------------------------------------------------------------- light source */

test("two shadow axes in one document is an error", () => {
  const findings = one("light.css", GOOD + `
.nm-wrong { background: var(--nm-surface); box-shadow: -5px 5px 10px #b8b9be, 5px -5px 10px #ffffff; }
`);
  const hit = find(findings, "mixed-light-source");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /145deg/);
  assert.match(hit.message, /anti-diagonal/);
});

test("one axis used twice is not a mixed light source", () => {
  const findings = one("light.css", GOOD + `
.nm-also { background: var(--nm-surface); box-shadow: 8px 8px 16px #b8b9be, -8px -8px 16px #ffffff; }
`);
  assert.ok(!rules(findings).includes("mixed-light-source"));
});

/* -------------------------------------------------------------------- focus */

test("a box-shadow focus ring is an error", () => {
  const findings = one("focus.css", GOOD + `
.nm-chip:focus-visible { box-shadow: 0 0 0 3px #4c5bd4; }
`);
  const hit = find(findings, "focus-shadow");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /forced-colors/);
});

test("an outline under 3px is an error", () => {
  const findings = one("focus.css", GOOD.replace("outline: 3px solid var(--nm-accent);", "outline: 2px solid var(--nm-accent);"));
  const hit = find(findings, "focus-width");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("an outline offset under 3px is an error", () => {
  const findings = one("focus.css", GOOD.replace("outline-offset: 3px;", "outline-offset: 1px;"));
  const hit = find(findings, "focus-offset");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test(":focus without :focus-visible is a warning", () => {
  const findings = one("focus.css", GOOD.replace(".nm-btn:focus-visible {", ".nm-btn:focus {"));
  const hit = find(findings, "focus-visible");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

/* ------------------------------------------------------------ forced colors */

test("neumorphic surfaces with no forced-colors block is an error", () => {
  const stripped = GOOD.replace(/@media \(forced-colors: active\) \{[^}]*\{[^}]*\}[^}]*\}/, "");
  const findings = one("nofc.css", stripped);
  const hit = find(findings, "forced-colors-missing");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /100% of this style's structure/);
});

test("nulling the shadow inside forced-colors without a border is an error", () => {
  const findings = one("fc.css", GOOD.replace("box-shadow: none; background: Canvas; border: 2px solid ButtonText;", "box-shadow: none; background: Canvas;"));
  const hit = find(findings, "forced-colors-border");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("a live shadow inside forced-colors is a warning", () => {
  const findings = one("fc.css", GOOD.replace("box-shadow: none; background: Canvas; border: 2px solid ButtonText;", "box-shadow: 5px 5px 10px #b8b9be; border: 2px solid ButtonText;"));
  const hit = find(findings, "forced-colors-shadow");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("a transform left alive inside forced-colors is a warning", () => {
  const findings = one("fc.css", GOOD.replace("box-shadow: none; background: Canvas;", "box-shadow: none; transform: translateY(-1px); background: Canvas;"));
  const hit = find(findings, "forced-colors-transform");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("the doc's own guard utility is not reported as a defect", () => {
  const findings = one("guard.css", GOOD + `
@layer utilities {
  @media (forced-colors: active) {
    .nm-guard {
      box-shadow: none !important;
      background: Canvas !important;
      border: 2px solid ButtonText !important;
    }
    .nm-guard:focus-visible {
      outline: 3px solid Highlight !important;
      outline-offset: 2px;
    }
  }
}
`);
  assert.deepEqual(errorsOf(findings), []);
  assert.ok(!rules(findings).includes("forced-colors-shadow"));
  assert.ok(!rules(findings).includes("focus-offset"));
});

test("the 3px offset floor still applies outside forced-colors", () => {
  const findings = one("offset.css", GOOD.replace("outline-offset: 3px;", "outline-offset: 2px;"));
  assert.ok(find(findings, "focus-offset"));
});

/* ------------------------------------------------------------------- motion */

test("reduced motion removing a state carrier is an error", () => {
  const findings = one("rm.css", GOOD.replace(".nm-btn { transition-duration: 1ms; }", ".nm-btn { transition-duration: 1ms; box-shadow: none; }"));
  const hit = find(findings, "reduced-motion-state");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /Only durations may be zeroed/);
});

test("no reduced-motion block at all is an error", () => {
  const stripped = GOOD.replace(/@media \(prefers-reduced-motion: reduce\) \{[^}]*\{[^}]*\}[^}]*\}/, "");
  const findings = one("norm.css", stripped);
  const hit = find(findings, "reduced-motion-missing");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("animating border-radius or filter is an error", () => {
  const findings = one("anim.css", GOOD + `
.nm-morph { transition: border-radius 240ms linear; }
`);
  const hit = find(findings, "animated-forbidden");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("transition: all is a warning", () => {
  const findings = one("anim.css", GOOD + `
.nm-lazy { transition: all 180ms linear; }
`);
  const hit = find(findings, "animated-forbidden");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("will-change on a paint property is an error", () => {
  const findings = one("wc.css", GOOD + `
.nm-btn { will-change: box-shadow; }
`);
  const hit = find(findings, "will-change-paint");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("blanket will-change on a non-interactive selector is a warning", () => {
  const findings = one("wc.css", GOOD + `
.nm-panel { will-change: opacity; }
`);
  const hit = find(findings, "will-change-blanket");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

/* -------------------------------------------------------- the same-hue rule */

test("a pair over a fill that is not the ground is a warning", () => {
  const findings = one("hue.css", GOOD + `
.nm-tinted { background: #ffffff; box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff; }
`);
  const hit = find(findings, "same-hue");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
  assert.match(hit.message, /soft drop shadow wearing a costume/);
});

test("a pair over var(--nm-surface) is not flagged", () => {
  const findings = one("hue.css", GOOD);
  assert.ok(!rules(findings).includes("same-hue"));
});

test("a sunken control is a warning", () => {
  const findings = one("sunk.css", GOOD + `
.nm-toggle {
  background: var(--nm-surface-sunken);
  border: 1px solid var(--nm-hairline);
  box-shadow: inset 3px 3px 6px #b8b9be, inset -3px -3px 6px #ffffff;
}
`);
  const hit = find(findings, "sunken-control");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

/* ---------------------------------------------------- targets and semantics */

test("a min-height below the 44px token is a warning and below 24px an error", () => {
  const warned = one("t.css", GOOD.replace("min-height: 44px;", "min-height: 32px;"));
  const w = find(warned, "target-min");
  assert.ok(w);
  assert.equal(w.severity, "warn");

  const failed = one("t.css", GOOD.replace("min-height: 44px;", "min-height: 20px;"));
  const e = find(failed, "target-min");
  assert.ok(e);
  assert.equal(e.severity, "error");
});

test("a fixed height on a control is a warning", () => {
  const findings = one("t.css", GOOD.replace("min-height: 44px;", "height: 44px;"));
  const hit = find(findings, "fixed-height");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
  assert.match(hit.message, /1\.4\.12/);
});

test("a div dressed as a control is a warning", () => {
  const findings = one("fake.css", GOOD + `
div[role="button"].nm-fake { background: var(--nm-surface); box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff; }
`);
  const hit = find(findings, "fake-control");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("a sibling gap under 16px is a warning", () => {
  const findings = one("gap.css", GOOD + `
.nm-row { display: flex; gap: 8px; }
`);
  const hit = find(findings, "sibling-gap");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

/* ------------------------------------------------------ project-level state */

test("a partial dark override is an error", () => {
  const findings = one("dark.css", GOOD.replace(':root[data-theme="dark"] { --nm-surface: #2a2e39; }', ""));
  const hit = find(findings, "dark-pair");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /data-theme="dark"/);
});

test("the element census warns above 12 and fails above 24", () => {
  const many = (n) => {
    let css = GOOD;
    for (let i = 0; i < n; i++) {
      css += `\n.nm-cell-${i} { background: var(--nm-surface); box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff; }`;
    }
    return css;
  };
  const warned = find(one("census.css", many(13)), "element-census");
  assert.ok(warned);
  assert.equal(warned.severity, "warn");

  const failed = find(one("census.css", many(30)), "element-census");
  assert.ok(failed);
  assert.equal(failed.severity, "error");
});

test("guard blocks may live in a separate file", () => {
  const components = GOOD
    .replace(/@media \(forced-colors: active\) \{[^}]*\{[^}]*\}[^}]*\}/, "")
    .replace(/@media \(prefers-reduced-motion: reduce\) \{[^}]*\{[^}]*\}[^}]*\}/, "");
  const layer = `
@media (forced-colors: active) {
  .nm-btn { box-shadow: none; background: Canvas; border: 2px solid ButtonText; }
}
@media (prefers-reduced-motion: reduce) {
  .nm-btn { transition-duration: 1ms; }
}
`;
  const findings = scan([
    { file: "components.css", text: components },
    { file: "neumorphism.layer.css", text: layer },
  ]).findings;
  assert.deepEqual(errorsOf(findings), []);
});

test("the summary reports the surface count and the light sources", () => {
  const result = scan([{ file: "good.css", text: GOOD }]);
  assert.equal(result.summary.neumorphicSurfaces, 2);
  assert.deepEqual(result.summary.lightSources, ["main-diagonal"]);
  assert.deepEqual(result.summary.a11yQueriesFound, [
    "forced-colors", "prefers-reduced-motion", "prefers-reduced-transparency", "update-slow",
  ]);
  assert.equal(result.summary.errors, 0);
});

test("a sheet with no neumorphic surfaces reports nothing", () => {
  const result = scan([{ file: "flat.css", text: ".x { color: #33364d; box-shadow: 0 1px 2px rgb(0 0 0 / .06); }" }]);
  assert.deepEqual(result.findings, []);
  assert.equal(result.summary.neumorphicSurfaces, 0);
});

test("the composed tokens are counted as surfaces and not mis-measured", () => {
  const findings = one("token.css", GOOD + `
.nm-card { background: var(--nm-surface); box-shadow: var(--nm-raised-md); }
`);
  assert.ok(!rules(findings).includes("blur-ratio") || find(findings, "blur-ratio").severity === "info");
  assert.equal(scan([{ file: "token.css", text: GOOD + `
.nm-card { background: var(--nm-surface); box-shadow: var(--nm-raised-md); }
` }]).summary.neumorphicSurfaces, 3);
});
