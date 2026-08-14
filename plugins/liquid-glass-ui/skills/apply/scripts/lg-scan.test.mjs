/**
 * Tests for lg-scan.mjs.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/08-liquid-glass.md — §5's three-tier ladder,
 * §6's animatable set, §7's escape hatches and decorative-layer rules, §8's
 * budgets, or §13's validation checklist and anti-pattern list.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  scan,
  parse,
  stripComments,
  selectorClasses,
  selectorCompounds,
  tagClasses,
  walkTags,
  BLUR_KNOB_MAX_PX,
  BLUR_BUDGET_PX,
} from "./lg-scan.mjs";

/* ------------------------------------------------------------- the fixtures */

/**
 * The four escape hatches, so a fixture under test is not failing on them.
 *
 * Every block that nulls the filter nulls BOTH spellings. Doc §5's own fallback
 * writes only the unprefixed `backdrop-filter: none`, and on Safari 15-17 that
 * leaves `-webkit-backdrop-filter` alive in exactly the branch whose whole job
 * is to remove it. The scanner holds the emitted sheet to the pair, so the
 * fixture is written the way the plugin emits rather than the way §5 prints.
 */
const A11Y_LAYER = `
@media (prefers-reduced-transparency: reduce) {
  .lg { background-color: rgba(246, 246, 248, 0.98);
        -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@media (prefers-contrast: more) {
  .lg { background-color: rgba(255, 255, 255, 0.92); }
}
@media (forced-colors: active) {
  .lg { background: Canvas; color: CanvasText; border: 1px solid CanvasText;
        -webkit-backdrop-filter: none; backdrop-filter: none; box-shadow: none; }
}
@media (prefers-reduced-motion: reduce) {
  .lg, .lg-btn { transition-duration: 1ms; }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .lg { background-color: rgba(246, 246, 248, 0.94);
        -webkit-backdrop-filter: none; backdrop-filter: none; }
}
[data-transparency="reduced"] { --lg-blur: 0px; }
`;

/** Doc §5's Tier 1 base, trimmed to what the scanner reads. */
const TIER_1 = `
.lg {
  color: var(--lg-fg);
  background-color: var(--lg-fill);
  border: 1px solid var(--lg-border);
  border-radius: var(--lg-radius-card);
  -webkit-backdrop-filter: var(--lg-backdrop);
  backdrop-filter: var(--lg-backdrop);
  contain: paint;
}
`;

const TIER_2 = `
@supports (backdrop-filter: url(#lg-refract)) {
  .lg--refract {
    -webkit-backdrop-filter: url(#lg-refract) blur(var(--lg-blur)) saturate(var(--lg-sat));
    backdrop-filter: url(#lg-refract) blur(var(--lg-blur)) saturate(var(--lg-sat));
  }
}
`;

const DEVICE_GATE = `
const lite = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
`;

const css = (text) => [{ file: "app.css", text }];
const project = (text, extra = []) =>
  scan([{ file: "app.css", text: TIER_1 + A11Y_LAYER + text }, { file: "gate.js", text: DEVICE_GATE }, ...extra]);

const rules = (result) => result.findings.map((f) => f.rule);
const errorsOf = (result) => result.findings.filter((f) => f.severity === "error").map((f) => f.rule);

/* ---------------------------------------------------------------- the parser */

test("the parser survives a data URI containing a brace", () => {
  const root = parse(`.a { background: url("data:image/svg+xml,%3Csvg{%3E"); color: red; }
.b { color: blue; }`);
  assert.equal(root.children.length, 2, "the brace inside the quoted URI must not open a block");
  assert.equal(root.children[1].prelude, ".b");
});

test("comments are stripped without losing line positions", () => {
  const out = stripComments("a\n/* two\nthree */b\n<!-- four -->\nc");
  assert.equal(out.split("\n").length, 5);
  assert.ok(!out.includes("two"));
  assert.ok(!out.includes("four"));
});

test("selector classes and compounds split the way the nesting check needs", () => {
  assert.deepEqual(selectorClasses(".lg .lg-card:hover"), ["lg", "lg-card"]);
  assert.deepEqual(selectorCompounds(".lg > .lg-card"), [[".lg", ".lg-card"]]);
  assert.deepEqual(selectorCompounds(".a, .b"), [[".a"], [".b"]]);
});

test("tag classes are read from class, className and a braced literal", () => {
  assert.deepEqual(tagClasses(' class="lg lg--bar"'), ["lg", "lg--bar"]);
  assert.deepEqual(tagClasses(" className={'lg'}"), ["lg"]);
  assert.deepEqual(tagClasses(" className={`glass`}"), ["glass"]);
  assert.deepEqual(tagClasses(" className={clsx(a, b)}"), [],
    "a runtime class list is invisible to a static scan and must not be guessed at");
});

test("the tag walker maintains a stack and pops void and self-closing elements", () => {
  const seen = [];
  walkTags('<div class="a"><img class="b"/><span class="c">x</span></div><p class="d">y</p>',
    (tag, stack) => seen.push([tag.name, stack.map((s) => s.name).join(">")]));
  assert.deepEqual(seen, [["div", ""], ["img", "div"], ["span", "div"], ["p", ""]]);
});

/* ------------------------------------------------------------- nested glass */

test("glass inside glass is an error in a selector — the style's one hard fail", () => {
  const result = project(`.lg .lg-inner { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }`);
  assert.ok(errorsOf(result).includes("nested-glass"),
    "a rule describing a glass surface inside another glass surface must fail");
  const finding = result.findings.find((f) => f.rule === "nested-glass");
  assert.match(finding.message, /GlassEffectContainer/);
});

test("glass inside glass is an error in markup as well as in CSS", () => {
  const result = project("", [{
    file: "Toolbar.html",
    text: '<nav class="lg lg--bar">\n  <div class="lg lg-card">Now Playing</div>\n</nav>',
  }]);
  const finding = result.findings.find((f) => f.rule === "nested-glass");
  assert.ok(finding, "a glass element rendered inside a glass element must fail");
  assert.equal(finding.line, 2);
});

test("glass siblings inside an opaque container are not nested glass", () => {
  const result = project("", [{
    file: "Toolbar.html",
    text: '<div class="container">\n  <nav class="lg">a</nav>\n  <nav class="lg">b</nav>\n</div>',
  }]);
  assert.ok(!rules(result).includes("nested-glass"),
    "one shared container with sibling glass surfaces is the correct shape, not a finding");
});

/* --------------------------------------------------------------- the ladder */

test("Tier 2 outside its own @supports test is an error", () => {
  const result = project(`.lg--refract {
    -webkit-backdrop-filter: url(#lg-refract) blur(20px);
    backdrop-filter: url(#lg-refract) blur(20px);
  }`);
  assert.ok(errorsOf(result).includes("supports-tier2"));
});

test("Tier 2 inside its own @supports test is clean", () => {
  const result = project(TIER_2);
  assert.ok(!rules(result).includes("supports-tier2"));
});

test("a missing Tier 0 fallback is a project-level error", () => {
  const result = scan(css(TIER_1));
  assert.ok(errorsOf(result).includes("supports-tier0"));
  assert.equal(result.summary.tier0Fallback, false);
});

test("backdrop-filter with no -webkit- twin is an error", () => {
  const result = project(`.lg-sheet { backdrop-filter: blur(24px); }`);
  assert.ok(errorsOf(result).includes("webkit-prefix"));
});

/* ------------------------------------------------------------- the optics */

test("animating a backdrop filter, a filter or a corner radius is an error", () => {
  for (const value of ["backdrop-filter 200ms", "filter 200ms", "border-radius 200ms"]) {
    const result = project(`.lg-x { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px);
      transition: ${value}; }`);
    assert.ok(errorsOf(result).includes("animated-optics"), `transition: ${value} must fail`);
  }
});

test("transitioning `all` is a warning, because it silently includes the optics", () => {
  const result = project(`.lg-y { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px);
    transition: all 200ms; }`);
  const finding = result.findings.find((f) => f.rule === "animated-optics");
  assert.equal(finding.severity, "warn");
});

test("a keyframe step that sets the optics is an error", () => {
  const result = project(`@keyframes wake { from { backdrop-filter: blur(0px); } to { backdrop-filter: blur(20px); } }`);
  assert.ok(errorsOf(result).includes("animated-optics"));
});

test("animating feDisplacementMap@scale is allowed; animating geometry is not", () => {
  const ok = project("", [{ file: "defs.html", text: '<animate attributeName="scale" to="60"/>' }]);
  assert.ok(!rules(ok).includes("animated-optics"),
    "doc §6 names `scale` as cheap precisely because it does not rebuild the map");
  const bad = project("", [{ file: "defs.html", text: '<animate attributeName="baseFrequency" to="0.02"/>' }]);
  assert.ok(errorsOf(bad).includes("animated-optics"));
});

test("a permanent will-change on a surface that never animates is a warning", () => {
  const result = project(`.lg-z { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px);
    will-change: backdrop-filter; }`);
  const finding = result.findings.find((f) => f.rule === "will-change");
  assert.equal(finding.severity, "warn");
});

/* ------------------------------------------------------------- the map */

test("feImage fetching a map is an error; a data URI is not", () => {
  const bad = project("", [{ file: "defs.html", text: '<feImage href="/maps/lens.png"/>' }]);
  assert.ok(errorsOf(bad).includes("fe-image-external"));
  const good = project("", [{ file: "defs.html", text: '<feImage href="data:image/png;base64,iVBORw0KGgo="/>' }]);
  assert.ok(!rules(good).includes("fe-image-external"));
});

test("the inline filter defs must be hidden from assistive technology", () => {
  const bare = project("", [{ file: "defs.html", text: '<svg width="0"><defs><filter id="lg-refract"></filter></defs></svg>' }]);
  assert.equal(errorsOf(bare).filter((r) => r === "defs-aria").length, 2,
    "both aria-hidden and focusable are required, and each is its own finding");
  const hidden = project("", [{
    file: "defs.html",
    text: '<svg width="0" aria-hidden="true" focusable="false"><defs><filter id="lg-refract"></filter></defs></svg>',
  }]);
  assert.ok(!rules(hidden).includes("defs-aria"));
  assert.equal(hidden.summary.filterDefs, 1);
});

test("an svg that carries no filter primitives is not a filter defs block", () => {
  const result = project("", [{ file: "icon.html", text: '<svg viewBox="0 0 16 16"><path d="M0 0h16v16H0z"/></svg>' }]);
  assert.ok(!rules(result).includes("defs-aria"));
  assert.equal(result.summary.filterDefs, 0);
});

/* ------------------------------------------------------------ the refusals */

test("user-agent sniffing where a feature test belongs is an error", () => {
  const result = project("", [{
    file: "tier.js",
    text: 'const tier = /Chrome/.test(navigator.userAgent) ? "refract" : "blur";',
  }]);
  assert.ok(errorsOf(result).includes("ua-sniff"));
});

test("reading the user agent for something unrelated to the tier is not a finding", () => {
  const result = project("", [{ file: "analytics.js", text: 'track({ ua: navigator.userAgent });' }]);
  assert.ok(!rules(result).includes("ua-sniff"));
});

test("glass on a content element is an error", () => {
  const result = project(`table.report { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }`);
  assert.ok(errorsOf(result).includes("glass-on-content"));
});

test("glass on a chart wrapper is an error even when the element is a div", () => {
  const result = project(`.chart-panel { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }`);
  assert.ok(errorsOf(result).includes("glass-on-content"));
});

test("glass on the element's own scroll container is an error", () => {
  const result = project(`.lg-list { overflow-y: auto; -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }`);
  assert.ok(errorsOf(result).includes("glass-on-scroller"));
});

test("the Clear variant with no scrim anywhere is an error", () => {
  const result = project(`.lg-clear { background-color: var(--lg-fill-clear);
    -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }`);
  assert.ok(errorsOf(result).includes("clear-without-scrim"));
});

test("the Clear variant with a scrim beneath it is clean", () => {
  const result = project(`.lg-scrim { background: var(--lg-scrim); }
.lg-clear { background-color: var(--lg-fill-clear);
  -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }`);
  assert.ok(!rules(result).includes("clear-without-scrim"));
});

test("live blur inside forced colors is an error", () => {
  const result = project(`@media (forced-colors: active) { .lg-bad { backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px); } }`);
  assert.ok(errorsOf(result).includes("forced-colors-live"));
});

test("a decorative rim layer that intercepts pointers is a warning", () => {
  const result = project(`.lg-rim::after { content: ""; background: linear-gradient(135deg, #fff, transparent); }`);
  const finding = result.findings.find((f) => f.rule === "decorative-layer");
  assert.equal(finding.severity, "warn");
});

/* -------------------------------------------------------------- the budgets */

test("a blur past the knob maximum is an error and one past the budget is a warning", () => {
  const over = project(`.lg-a { -webkit-backdrop-filter: blur(40px); backdrop-filter: blur(40px); }`);
  assert.ok(errorsOf(over).includes("blur-max"));
  assert.equal(over.summary.maxBlurPx, 40);
  assert.ok(40 > BLUR_KNOB_MAX_PX);

  const budget = project(`.lg-b { -webkit-backdrop-filter: blur(26px); backdrop-filter: blur(26px); }`);
  const finding = budget.findings.find((f) => f.rule === "blur-budget");
  assert.equal(finding.severity, "warn");
  assert.ok(26 > BLUR_BUDGET_PX && 26 <= BLUR_KNOB_MAX_PX);
});

test("more than one refracting surface is an error", () => {
  const result = project(`@supports (backdrop-filter: url(#lg-refract)) {
    .lg-bar { -webkit-backdrop-filter: url(#lg-refract) blur(20px); backdrop-filter: url(#lg-refract) blur(20px); }
    .lg-sheet { -webkit-backdrop-filter: url(#lg-refract) blur(24px); backdrop-filter: url(#lg-refract) blur(24px); }
  }`);
  assert.ok(errorsOf(result).includes("refractor-budget"));
  assert.equal(result.summary.refractingSurfaces, 2);
});

test("more glass surfaces than the budget is a warning, because a declaration is not a viewport", () => {
  const result = project(`.lg-1 { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }
.lg-2 { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }
.lg-3 { -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }`);
  const finding = result.findings.find((f) => f.rule === "surface-budget");
  assert.equal(finding.severity, "warn");
  assert.equal(result.summary.glassSurfaces, 4);
});

test("calling a blur-only surface liquid glass is a warning", () => {
  const result = project("", [{ file: "Nav.jsx", text: 'export const LiquidGlassNav = () => null;' }]);
  const finding = result.findings.find((f) => f.rule === "blur-only-named-glass");
  assert.ok(finding, "with refractionScale at 0 the emitted names say glassmorphism, not liquid-glass");
  assert.match(finding.message, /glassmorphism/);
});

test("the same surface with real refraction is not misnamed", () => {
  const result = project(TIER_2, [{ file: "Nav.jsx", text: 'export const LiquidGlassNav = () => null;' }]);
  assert.ok(!rules(result).includes("blur-only-named-glass"));
});

/* ------------------------------------------------------- the four hatches */

test("each missing escape hatch is its own project-level error", () => {
  const result = scan(css(TIER_1 + `
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .lg { backdrop-filter: none; }
}`));
  const missing = result.findings.filter((f) => f.rule === "a11y-blocks");
  assert.equal(missing.length, 4);
  assert.deepEqual(result.summary.a11yQueriesFound, []);
});

test("a forced-colors block that never nulls the filter is a warning", () => {
  const result = scan(css(TIER_1 + `
@media (prefers-reduced-transparency: reduce) { .lg { backdrop-filter: none; } }
@media (prefers-contrast: more) { .lg { background: #fff; } }
@media (prefers-reduced-motion: reduce) { .lg { transition-duration: 1ms; } }
@media (forced-colors: active) { .lg { background: Canvas; } }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .lg { backdrop-filter: none; }
}`));
  const finding = result.findings.find((f) => f.rule === "forced-colors-live");
  assert.equal(finding.severity, "warn");
});

test("no transparency toggle and no device gate are reported, at their own severities", () => {
  const result = scan([{ file: "app.css", text: TIER_1 + A11Y_LAYER.replace('[data-transparency="reduced"] { --lg-blur: 0px; }', "") }]);
  assert.equal(result.findings.find((f) => f.rule === "transparency-toggle").severity, "warn");
  assert.equal(result.findings.find((f) => f.rule === "device-gate").severity, "info");
});

/* ------------------------------------------------------------ the clean run */

test("the doc's own §5 recipe plus its accessibility layer raises no errors", () => {
  const result = project(TIER_2, [{
    file: "index.html",
    text: '<svg width="0" height="0" aria-hidden="true" focusable="false">\n' +
      '  <defs><filter id="lg-refract">\n' +
      '    <feImage href="data:image/png;base64,iVBORw0KGgo="/>\n' +
      '    <feDisplacementMap in="SourceGraphic" in2="map" scale="48"/>\n' +
      '  </filter></defs>\n</svg>\n' +
      '<nav class="lg lg--bar lg--refract"><button class="lg-btn">Library</button></nav>',
  }]);
  assert.equal(result.summary.errors, 0, JSON.stringify(result.findings, null, 2));
  assert.equal(result.summary.refractingSurfaces, 1);
  assert.equal(result.summary.tier0Fallback, true);
  assert.deepEqual(result.summary.a11yQueriesFound, [
    "forced-colors", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency",
  ]);
});

test("an empty project is not reported as a compliant one", () => {
  const result = scan([]);
  assert.equal(result.summary.glassSurfaces, 0);
  assert.equal(result.findings.length, 0,
    "with no glass surfaces there is nothing to hold to the ladder — silence here is the absence of a subject, not a pass");
});
