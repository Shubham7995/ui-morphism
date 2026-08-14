/**
 * Tests for clay-scan.mjs.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/04-claymorphism.md — either the §13 validation
 * checklist the skill must self-run, the §13 anti-pattern list it must refuse,
 * or one of the budgets §8 sets. The hue cases are §5's per-surface map.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { scan, splitTop } from "./clay-scan.mjs";

/** Convenience: scan one virtual file and return its findings. */
const one = (name, text) => scan([{ file: name, text }]).findings;
const rules = (findings) => findings.map((f) => f.rule);
const errorsOf = (findings) => findings.filter((f) => f.severity === "error");
const has = (findings, rule) => findings.some((f) => f.rule === rule);

/**
 * A minimal well-formed sheet, used as the base for single-defect fixtures.
 * It is doc §5's vanilla recipe reduced to the parts the scanner reads: the
 * ground, one interactive clay surface with its own colour, the four required
 * media blocks, and a dark block whose sheen and shade are re-derived.
 */
const GOOD = `
:root {
  --clay-bg: #F4F1FB;
  --clay-rim:   inset 0 1px 1px 0 hsl(0 0% 100% / .35);
  --clay-sheen: inset 0 10px 18px -6px hsl(0 0% 100% / .62);
  --clay-shade: inset 0 -10px 18px -6px hsl(258 45% 30% / .32);
  --clay-border-hc: 2px solid ButtonText;
}
body { background: var(--clay-bg); }
.clay-btn {
  background: #5B3AE0;
  border-radius: 20px;
  min-height: 48px;
  box-shadow:
    inset 0 1px 1px 0 hsl(0 0% 100% / .35),
    inset 0 10px 18px -6px hsl(0 0% 100% / .62),
    inset 0 -10px 18px -6px hsl(258 45% 30% / .32),
    0 14px 26px -8px hsl(258 60% 45% / .30);
  transition: transform 260ms cubic-bezier(.34,1.56,.64,1);
}
.clay-grid { display: grid; gap: 24px; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --clay-rim:   inset 0 1px 1px 0 hsl(0 0% 100% / .10);
    --clay-sheen: inset 0 10px 18px -6px hsl(258 40% 80% / .14);
    --clay-shade: inset 0 -10px 18px -6px hsl(258 60% 6% / .55);
  }
}
@media (forced-colors: active) {
  .clay-btn { box-shadow: none; border: var(--clay-border-hc); }
}
@media (prefers-reduced-motion: reduce) {
  .clay-btn { transition-duration: 1ms; }
}
@media (prefers-reduced-data: reduce), (max-width: 480px) {
  :root { --clay-rim: none; }
}
`;

test("splitTop respects nested parentheses", () => {
  const parts = splitTop(
    "inset 0 1px 1px 0 hsl(0 0% 100% / .35), 0 8px 16px -6px hsl(258 60% 45% / .28)");
  assert.equal(parts.length, 2);
  assert.ok(parts[0].startsWith("inset"));
  assert.ok(parts[1].startsWith("0 8px"));
});

test("splitTop splits the four-layer stack into exactly four layers", () => {
  const parts = splitTop(
    "inset 0 1px 1px 0 hsl(0 0% 100% / .35)," +
    " inset 0 10px 18px -6px hsl(0 0% 100% / .62)," +
    " inset 0 -10px 18px -6px hsl(258 45% 30% / .32)," +
    " 0 24px 44px -12px hsl(258 60% 45% / .32)");
  assert.equal(parts.length, 4);
});

test("splitTop ignores commas inside a var() fallback and inside quotes", () => {
  assert.deepEqual(splitTop("var(--a, 1px), var(--b, 2px)"), ["var(--a, 1px)", "var(--b, 2px)"]);
  assert.deepEqual(splitTop("url(\"a,b.png\"), red"), ["url(\"a,b.png\")", "red"]);
});

test("splitTop returns an empty list for an empty value", () => {
  assert.deepEqual(splitTop("   "), []);
});

test("the reference sheet is clean", () => {
  const findings = one("clay.css", GOOD);
  assert.deepEqual(errorsOf(findings), [], "expected no errors, got " + JSON.stringify(rules(findings)));
});

test("more than four shadow layers fails the §8 layer budget", () => {
  const findings = one("a.css", GOOD + `
.too-many {
  background: #C7B9FF;
  box-shadow:
    inset 0 1px 1px 0 hsl(0 0% 100% / .35),
    inset 0 10px 18px -6px hsl(0 0% 100% / .62),
    inset 0 -10px 18px -6px hsl(258 45% 30% / .32),
    0 14px 26px -8px hsl(258 60% 45% / .30),
    0 24px 44px -12px hsl(258 60% 45% / .32);
}`);
  const hit = findings.find((f) => f.rule === "layer-budget");
  assert.ok(hit, "expected a layer-budget finding");
  assert.equal(hit.severity, "error");
});

test("a blur above --clay-blur-max is an error anywhere", () => {
  const findings = one("a.css", GOOD + `
.hero {
  background: #C7B9FF;
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 44px 76px -16px hsl(258 60% 45% / .42);
}`);
  const hit = findings.find((f) => f.rule === "blur-ceiling");
  assert.ok(hit, "expected a blur-ceiling finding");
  assert.equal(hit.severity, "error");
});

test("a 68px blur on a repeating list item is an error, not a warning", () => {
  const findings = one("a.css", GOOD + `
.feed-item {
  background: #8FE3B8;
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 38px 68px -16px hsl(152 60% 45% / .35);
}`);
  const hit = findings.find((f) => f.rule === "blur-repeat");
  assert.ok(hit, "expected a blur-repeat finding");
  assert.equal(hit.severity, "error");
});

test("a 68px blur on a card-named selector is a warning, not an error", () => {
  const findings = one("a.css", GOOD + `
.clay-card {
  background: #9FD8F5;
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 38px 68px -16px hsl(202 60% 45% / .35);
}`);
  const hit = findings.find((f) => f.rule === "blur-repeat");
  assert.ok(hit, "expected a blur-repeat finding");
  assert.equal(hit.severity, "warn");
});

test("a 44px blur on a repeating item is under the budget and passes", () => {
  const findings = one("a.css", GOOD + `
.feed-item {
  background: #8FE3B8;
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 24px 44px -12px hsl(152 60% 45% / .32);
}`);
  assert.equal(has(findings, "blur-repeat"), false);
});

test("a neutral rgba(0,0,0,.25) drop shadow on a clay stack is refused", () => {
  const findings = one("a.css", GOOD + `
.cheap {
  background: #FFD9A0;
  box-shadow: inset 8px 8px 16px 0 rgba(255,255,255,.2),
              inset -8px -8px 16px 0 rgba(0,0,0,.25),
              8px 8px 16px 0 rgba(0,0,0,.25);
}`);
  const hit = findings.find((f) => f.rule === "neutral-drop");
  assert.ok(hit, "expected a neutral-drop finding");
  assert.equal(hit.severity, "error");
});

test("a hue-matched drop shadow is not reported as neutral", () => {
  assert.equal(has(one("a.css", GOOD), "neutral-drop"), false);
});

test("a clay surface coloured with the page ground is neumorphism and is refused", () => {
  const findings = one("a.css", GOOD + `
.same {
  background: var(--clay-bg);
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 24px 44px -12px hsl(258 60% 45% / .32);
}`);
  const hit = findings.find((f) => f.rule === "surface-equals-ground");
  assert.ok(hit, "expected a surface-equals-ground finding");
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /neumorphism/);
});

test("a surface matching the literal ground colour is caught too", () => {
  const findings = one("a.css", GOOD + `
.same-literal {
  background: #F4F1FB;
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 24px 44px -12px hsl(258 60% 45% / .32);
}`);
  assert.ok(has(findings, "surface-equals-ground"));
});

test("inset inside text-shadow is an error", () => {
  const findings = one("a.css", GOOD + `
.raised { text-shadow: inset 0 1px 0 #fff; }`);
  const hit = findings.find((f) => f.rule === "inset-text-shadow");
  assert.ok(hit, "expected an inset-text-shadow finding");
  assert.equal(hit.severity, "error");
});

test("transitioning box-shadow on a repeating selector fails §13 item 9", () => {
  const findings = one("a.css", GOOD + `
.result-item {
  background: #FFB3A7;
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 8px 16px -6px hsl(8 60% 45% / .28);
  transition: box-shadow 180ms ease;
}`);
  const hit = findings.find((f) => f.rule === "animated-shadow");
  assert.ok(hit, "expected an animated-shadow finding");
  assert.equal(hit.severity, "error");
});

test("transitioning box-shadow elsewhere is a warning", () => {
  const findings = one("a.css", GOOD + `
.panel { transition: box-shadow 180ms ease; }`);
  const hit = findings.find((f) => f.rule === "animated-shadow");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("transitioning all is warned about because it silently includes box-shadow", () => {
  const findings = one("a.css", GOOD + `
.panel { transition: all 180ms ease; }`);
  const hit = findings.find((f) => f.rule === "animated-shadow");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("animating border-radius is an error, in a transition and in keyframes", () => {
  const t = one("a.css", GOOD + `.p { transition: border-radius 200ms ease; }`);
  assert.equal(t.find((f) => f.rule === "animated-radius").severity, "error");

  const k = one("b.css", GOOD + `
@keyframes squish { to { border-radius: 40px; } }`);
  assert.equal(k.find((f) => f.rule === "animated-radius").severity, "error");
});

test("a keyframe step that sets box-shadow is an error", () => {
  const findings = one("a.css", GOOD + `
@keyframes puff { to { box-shadow: 0 24px 44px -12px hsl(258 60% 45% / .32); } }`);
  const hit = findings.find((f) => f.rule === "animated-shadow");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("will-change: box-shadow is the §8 trap and is an error", () => {
  const findings = one("a.css", GOOD + `.p { will-change: box-shadow; }`);
  const hit = findings.find((f) => f.rule === "will-change-shadow");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("will-change: transform is left alone", () => {
  assert.equal(has(one("a.css", GOOD + `.p { will-change: transform; }`), "will-change-shadow"), false);
});

test("a forced-colors block that nulls the shadow without a border is an error", () => {
  const bad = GOOD.replace(
    ".clay-btn { box-shadow: none; border: var(--clay-border-hc); }",
    ".clay-btn { box-shadow: none; background: ButtonFace; }");
  const findings = one("a.css", bad);
  const hit = findings.find((f) => f.rule === "forced-colors-border");
  assert.ok(hit, "expected a forced-colors-border finding");
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /--clay-border-hc/);
});

test("forced-color-adjust: none is an error", () => {
  const findings = one("a.css", GOOD + `.p { forced-color-adjust: none; }`);
  const hit = findings.find((f) => f.rule === "forced-color-adjust");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("a dark sheen above 0.20 fails the chalky-grey guard", () => {
  const findings = one("a.css", GOOD + `
:root[data-theme="dark"] {
  --clay-sheen: inset 0 10px 18px -6px hsl(258 40% 80% / .62);
  --clay-shade: inset 0 -10px 18px -6px hsl(258 60% 6% / .55);
}`);
  const hit = findings.find((f) => f.rule === "dark-alpha-band");
  assert.ok(hit, "expected a dark-alpha-band finding");
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /sheen/);
});

test("a dark shade below 0.45 fails the same guard", () => {
  const findings = one("a.css", GOOD + `
:root[data-theme="dark"] {
  --clay-sheen: inset 0 10px 18px -6px hsl(258 40% 80% / .14);
  --clay-shade: inset 0 -10px 18px -6px hsl(258 60% 6% / .32);
}`);
  const hit = findings.find((f) => f.rule === "dark-alpha-band");
  assert.ok(hit);
  assert.match(hit.message, /shade/);
});

test("the doc's own dark block clears the guard", () => {
  const findings = one("a.css", GOOD + `
:root[data-theme="dark"] {
  --clay-rim:   inset 0 1px 1px 0 hsl(0 0% 100% / .10);
  --clay-sheen: inset 0 10px 18px -6px hsl(258 40% 80% / .14);
  --clay-shade: inset 0 -10px 18px -6px hsl(258 60% 6% / .55);
}`);
  assert.equal(has(findings, "dark-alpha-band"), false);
});

test("a percentage alpha is normalised before the band is checked", () => {
  const findings = one("a.css", GOOD + `
:root[data-theme="dark"] {
  --clay-sheen: inset 0 10px 18px -6px hsl(258 40% 80% / 62%);
}`);
  assert.ok(has(findings, "dark-alpha-band"));
});

test("a grid gap below 24px is warned about", () => {
  const findings = one("a.css", GOOD + `.tight { display: grid; gap: 12px; }`);
  const hit = findings.find((f) => f.rule === "grid-gap");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("a 24px grid gap is at the floor and passes", () => {
  assert.equal(has(one("a.css", GOOD), "grid-gap"), false);
});

test("each missing accessibility block is reported once, at project level", () => {
  const stripped = `
:root { --clay-bg: #F4F1FB; }
body { background: var(--clay-bg); }
.clay-btn {
  background: #5B3AE0;
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 14px 26px -8px hsl(258 60% 45% / .30);
}`;
  const findings = one("a.css", stripped);
  const blocks = findings.filter((f) => f.rule === "a11y-blocks");
  assert.equal(blocks.length, 4);
  assert.ok(blocks.every((f) => f.severity === "error" && f.file === "(project)"));
});

test("no clay surfaces means no project-level accessibility findings", () => {
  const findings = one("a.css", `.plain { background: #fff; border: 1px solid #ccc; }`);
  assert.equal(has(findings, "a11y-blocks"), false);
});

test("the full stack on static panels beside interactive ones is warned about", () => {
  const findings = one("a.css", GOOD + `
.stat-panel {
  background: #FFD9A0;
  box-shadow: inset 0 10px 18px -6px hsl(0 0% 100% / .62),
              0 24px 44px -12px hsl(36 60% 45% / .32);
}`);
  const hit = findings.find((f) => f.rule === "affordance-split");
  assert.ok(hit, "expected an affordance-split finding");
  assert.equal(hit.severity, "warn");
  assert.equal(hit.file, "(project)");
});

test("a Spline scene is flagged against the §8 asset budget", () => {
  const findings = one("Hero.tsx",
    `import Spline from "@splinetool/react-spline";\nexport const Hero = () => <Spline scene="x" />;\n` + GOOD);
  const hit = findings.find((f) => f.rule === "spline-above-fold");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("the summary counts surfaces and splits them by affordance", () => {
  const { summary } = scan([{ file: "a.css", text: GOOD }]);
  assert.equal(summary.claySurfaces, 1);
  assert.equal(summary.interactiveStacks, 1);
  assert.equal(summary.staticStacks, 0);
  assert.deepEqual(summary.a11yQueriesFound,
    ["forced-colors", "prefers-reduced-data", "prefers-reduced-motion", "small-screen"]);
});

test("findings are sorted with errors first", () => {
  const findings = one("a.css", GOOD + `
.tight { display: grid; gap: 8px; }
.p { forced-color-adjust: none; }`);
  const firstWarn = findings.findIndex((f) => f.severity === "warn");
  const lastError = findings.map((f) => f.severity).lastIndexOf("error");
  assert.ok(lastError < firstWarn, "errors must precede warnings");
});

test("CSS inside a template literal is parsed like any other sheet", () => {
  const findings = one("Card.tsx", "const css = `\n" + GOOD + "\n.p { will-change: box-shadow; }\n`;\n");
  assert.ok(has(findings, "will-change-shadow"));
});

test("a commented-out declaration is not a finding", () => {
  const findings = one("a.css", GOOD + `
/* .p { will-change: box-shadow; } */
.q { color: red; }`);
  assert.equal(has(findings, "will-change-shadow"), false);
});
