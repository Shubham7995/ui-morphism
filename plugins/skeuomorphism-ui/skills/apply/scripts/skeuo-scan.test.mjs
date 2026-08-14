/**
 * Tests for skeuo-scan.mjs.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/01-skeuomorphism.md — either the §13
 * validation checklist the skill must self-run, the §13 anti-pattern list it
 * must refuse, the light model in §3, the forced-colors asymmetry in §7, or one
 * of the budgets §8 sets. GOOD is the doc's own recipe, so a false positive
 * anywhere in the scanner fails the first test rather than a user's build.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { scan, splitTop, shadowLayer, parse } from "./skeuo-scan.mjs";

/** Convenience: scan one virtual file and return its findings. */
const one = (name, text) => scan([{ file: name, text }]).findings;
const errorsOf = (findings) => findings.filter((f) => f.severity === "error");
const has = (findings, rule) => findings.some((f) => f.rule === rule);
const hasError = (findings, rule) =>
  findings.some((f) => f.rule === rule && f.severity === "error");

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

/**
 * Doc §5's vanilla recipe, with `references/recipes.md` §2's one stated
 * deviation applied: `box-shadow` is not in the button's `transition`, because
 * §6 and §13 forbid animating it and they are the normative statements.
 */
const GOOD = `
:root {
  --sk-noise-opacity: .05;
  --sk-noise: ${NOISE};
}
.sk-panel {
  position: relative;
  isolation: isolate;
  background-color: var(--sk-bg);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-lg);
  box-shadow: var(--sk-elev-3);
}
.sk-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-image: var(--sk-noise);
  background-repeat: repeat;
  background-size: 160px 160px;
  opacity: var(--sk-noise-opacity);
  pointer-events: none;
}
.sk-button {
  min-height: var(--sk-target-min);
  background: var(--sk-face);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-md);
  box-shadow: var(--sk-elev-2);
  text-shadow: var(--sk-emboss);
  transition: transform var(--sk-dur-press) var(--sk-ease-press),
              filter var(--sk-dur-hover) var(--sk-ease-standard);
}
.sk-button:hover { filter: brightness(1.03); }
.sk-button:active {
  transform: translateY(1px);
  background: linear-gradient(to bottom, var(--sk-surface-lo) 0%, var(--sk-well) 100%);
  box-shadow: var(--sk-press-inner), var(--sk-press-inner-2);
}
.sk-button:focus-visible {
  outline: var(--sk-focus-width) solid transparent;
  box-shadow: var(--sk-elev-2), var(--sk-focus-ring);
}
.sk-well {
  background: linear-gradient(to bottom, var(--sk-well) 0%, var(--sk-surface-lo) 100%);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  box-shadow: var(--sk-elev-0);
}
.sk-well:focus-within { box-shadow: var(--sk-elev-0), var(--sk-focus-ring); }
.sk-toggle {
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-pill);
  background: linear-gradient(to bottom, var(--sk-well), var(--sk-surface-lo));
  box-shadow: var(--sk-elev-0);
}
.sk-toggle::after {
  background:
    radial-gradient(ellipse 60% 40% at 50% 28%, var(--sk-specular), transparent 70%),
    var(--sk-face);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  box-shadow: var(--sk-shadow-contact), var(--sk-bevel-top);
  transition: translate var(--sk-dur-release) var(--sk-ease-release);
}
@media (prefers-reduced-motion: reduce) {
  .sk-button, .sk-toggle::after { transition-duration: 1ms; }
  .sk-button:active { transform: none; }
}
@media (prefers-contrast: more) {
  :root { --sk-ink: #2c2418; --sk-border-strong: #4a3f2d; }
  .sk-panel::before { opacity: 0; }
}
@media (forced-colors: active) {
  .sk-button, .sk-well, .sk-toggle {
    border: 2px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
    forced-color-adjust: none;
  }
  .sk-panel::before { display: none; }
  .sk-button:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
  .sk-toggle[aria-checked="true"] { background: Highlight; }
}
`;

/* --------------------------------------------------------------- the parser */

test("parse keeps a data-URI brace inside a quoted string from breaking the stack", () => {
  const root = parse(`.a { background-image: ${NOISE}; } .b { color: red; }`);
  assert.equal(root.children.length, 2);
  assert.equal(root.children[0].prelude, ".a");
  assert.equal(root.children[1].prelude, ".b");
  assert.equal(root.children[1].decls[0].prop, "color");
});

test("parse reads a nested at-rule as a child of its block", () => {
  const root = parse("@utility sk-grain { &::before { opacity: .05; } }");
  assert.equal(root.children[0].type, "atrule");
  assert.equal(root.children[0].children[0].prelude, "&::before");
  assert.equal(root.children[0].children[0].decls[0].value, ".05");
});

test("splitTop splits the four-layer stack into exactly four layers", () => {
  const parts = splitTop(
    "0 1px 2px rgba(0,0,0,.25), 0 4px 10px rgba(0,0,0,.18)," +
    " inset 0 1px 0 rgba(255,255,255,.80), inset 0 -2px 3px rgba(0,0,0,.12)");
  assert.equal(parts.length, 4);
  assert.ok(parts[2].startsWith("inset"));
});

test("splitTop does not split inside rgba()", () => {
  assert.equal(splitTop("0 1px 2px rgba(0,0,0,.25)").length, 1);
});

test("shadowLayer reads the doc's contact layer", () => {
  const l = shadowLayer("0 1px 2px rgba(0,0,0,.25)");
  assert.equal(l.inset, false);
  assert.equal(l.x, 0);
  assert.equal(l.y, 1);
  assert.equal(l.blur, 2);
  assert.equal(l.tone, "dark");
});

test("shadowLayer reads the doc's top bevel as a light inset at a positive y", () => {
  const l = shadowLayer("inset 0 1px 0 rgba(255,255,255,.80)");
  assert.equal(l.inset, true);
  assert.equal(l.y, 1);
  assert.equal(l.tone, "light");
});

test("shadowLayer reads the doc's under-lip as a dark inset at a negative y", () => {
  const l = shadowLayer("inset 0 -2px 3px rgba(0,0,0,.12)");
  assert.equal(l.inset, true);
  assert.equal(l.y, -2);
  assert.equal(l.tone, "dark");
});

test("shadowLayer leaves a rem offset unresolved rather than guessing", () => {
  assert.equal(shadowLayer("0 0.5rem 1rem rgba(0,0,0,.2)").y, null);
});

/* ------------------------------------------------------------ the good case */

test("the doc's own recipe produces no errors", () => {
  const findings = one("skeuo.css", GOOD);
  assert.deepEqual(errorsOf(findings).map((f) => f.rule + ":" + f.line), []);
});

test("the doc's own recipe is counted as skeuomorphic", () => {
  const { summary } = scan([{ file: "skeuo.css", text: GOOD }]);
  assert.ok(summary.skeuoSurfaces >= 6);
  assert.equal(summary.grainLayers, 1);
  assert.equal(summary.speculars, 1);
  assert.deepEqual(summary.a11yQueriesFound,
    ["forced-colors", "prefers-contrast", "prefers-reduced-motion"]);
});

/* ---------------------------------------------------------- the light model */

test("an outer shadow cast upward is a light-direction error", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  box-shadow: 0 -4px 10px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.8);
}`);
  assert.ok(hasError(f, "light-direction"));
});

test("a light inset at the bottom of a raised surface is a light-direction error", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  box-shadow: 0 4px 10px rgba(0,0,0,.18), inset 0 -1px 0 rgba(255,255,255,.8);
}`);
  assert.ok(hasError(f, "light-direction"));
});

test("a dark inset at the top of a raised surface is a light-direction error", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  box-shadow: 0 4px 10px rgba(0,0,0,.18), inset 0 2px 4px rgba(0,0,0,.22);
}`);
  assert.ok(hasError(f, "light-direction"));
});

test("the literal four-layer stack from doc §4 passes the polarity checks", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  box-shadow:
    0 1px 2px rgba(0,0,0,.25),
    0 4px 10px rgba(0,0,0,.18),
    inset 0 1px 0 rgba(255,255,255,.80),
    inset 0 -2px 3px rgba(0,0,0,.12);
}`);
  assert.equal(errorsOf(f).length, 0);
});

test("the literal elev-0 well from doc §4 is an inversion, not a violation", () => {
  const src = GOOD + `
.sk-input {
  border: 1px solid #7a6a4e;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.22), inset 0 -1px 0 rgba(255,255,255,.55);
}`;
  const { summary, findings } = scan([{ file: "a.css", text: src }]);
  assert.equal(errorsOf(findings).length, 0);
  assert.equal(summary.inversions, 1);
});

test("an inverted stack on a selector that names no recessed part is a warning", () => {
  const f = one("a.css", GOOD + `
.sk-hero-card {
  border: 1px solid #7a6a4e;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.22), inset 0 -1px 0 rgba(255,255,255,.55);
}`);
  assert.ok(has(f, "inversion-scope"));
  assert.equal(errorsOf(f).length, 0);
});

test("a focus ring is not read as a shadow with a light direction", () => {
  const f = one("a.css", GOOD + `
.sk-chip {
  border: 1px solid #7a6a4e;
  box-shadow: 0 0 0 2px var(--sk-bg), 0 0 0 4px #2b6cb0;
}`);
  assert.equal(errorsOf(f).length, 0);
});

/* -------------------------------------------------------- the stack and edge */

test("a single blurred shadow presented as this style is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; box-shadow: 0 2px 4px rgba(0,0,0,.2); }`);
  assert.ok(hasError(f, "flat-shadow"));
});

test("outer layers with no inset are a warning, not a pass", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  box-shadow: 0 1px 2px rgba(0,0,0,.25), 0 4px 10px rgba(0,0,0,.18);
}`);
  assert.ok(has(f, "flat-shadow"));
});

test("a shadow-bounded control with no border is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { box-shadow: var(--sk-elev-2); }`);
  assert.ok(hasError(f, "border-missing"));
});

test("a border declared on the base rule covers its own state rules", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; box-shadow: var(--sk-elev-2); }
.sk-card:hover { box-shadow: var(--sk-elev-3); }`);
  assert.equal(errorsOf(f).length, 0);
});

test("border: none does not satisfy the boundary rule", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: none; box-shadow: var(--sk-elev-2); }`);
  assert.ok(hasError(f, "border-missing"));
});

/* --------------------------------------------------------- the face gradient */

test("a face gradient running to top is a light-direction error", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  background: linear-gradient(to top, #f7f2ea 0%, #e8e0d2 45%, #d9cfbc 100%);
  box-shadow: var(--sk-elev-2);
}`);
  assert.ok(hasError(f, "gradient-direction"));
});

test("a 3-stop face whose midpoint is not 45% is a warning", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  background: linear-gradient(to bottom, #f7f2ea 0%, #e8e0d2 50%, #d9cfbc 100%);
  box-shadow: var(--sk-elev-2);
}`);
  assert.ok(has(f, "gradient-midpoint"));
});

test("the doc's 45% midpoint passes", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  background: linear-gradient(to bottom, #f7f2ea 0%, #e8e0d2 45%, #d9cfbc 100%);
  box-shadow: var(--sk-elev-2);
}`);
  assert.ok(!has(f, "gradient-midpoint"));
});

test("pure white and pure black gradient stops are a warning", () => {
  const f = one("a.css", GOOD + `
.sk-card {
  border: 1px solid #7a6a4e;
  background: linear-gradient(to bottom, #ffffff 0%, #e8e0d2 45%, #000000 100%);
  box-shadow: var(--sk-elev-2);
}`);
  assert.ok(has(f, "pure-material"));
});

test("a specular hotspot outside the 25-35% band is a warning", () => {
  const f = one("a.css", GOOD + `
.sk-knob::after {
  border: 1px solid #7a6a4e;
  background: radial-gradient(ellipse 60% 40% at 50% 60%, var(--sk-specular), transparent 70%);
}`);
  assert.ok(has(f, "specular-band"));
});

test("a specular hotspot on a selector naming no curved part is reported", () => {
  const f = one("a.css", GOOD + `
.sk-banner {
  border: 1px solid #7a6a4e;
  background: radial-gradient(ellipse 60% 40% at 50% 28%, var(--sk-specular), transparent 70%);
}`);
  assert.ok(has(f, "specular-scope"));
});

/* ------------------------------------------------------------------- focus */

test("a focus ring that replaces the stack is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; box-shadow: var(--sk-elev-2); }
.sk-card:focus-visible {
  outline: 2px solid transparent;
  box-shadow: 0 0 0 4px #2b6cb0;
}`);
  assert.ok(hasError(f, "focus-additive"));
});

test("a shadow-only focus ring with no outline is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; box-shadow: var(--sk-elev-2); }
.sk-card:focus-visible { box-shadow: var(--sk-elev-2), var(--sk-focus-ring); }`);
  assert.ok(hasError(f, "focus-outline"));
});

test("outline: none beside a shadow ring is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; box-shadow: var(--sk-elev-2); }
.sk-card:focus-visible {
  outline: none;
  box-shadow: var(--sk-elev-2), var(--sk-focus-ring);
}`);
  assert.ok(hasError(f, "focus-outline"));
});

test(":focus-within on a container is not held to the transparent-outline rule", () => {
  const f = one("a.css", GOOD + `
.sk-group { border: 1px solid #7a6a4e; box-shadow: var(--sk-elev-0); }
.sk-group:focus-within { box-shadow: var(--sk-elev-0), var(--sk-focus-ring); }`);
  assert.ok(!has(f, "focus-outline"));
});

/* ------------------------------------------------------------------- grain */

test("a grain frequency that is not 0.9 / 2 is a warning about the material", () => {
  const f = one("a.css", GOOD.replace("baseFrequency='0.9' numOctaves='2'",
    "baseFrequency='0.8' numOctaves='4'"));
  assert.ok(has(f, "grain-frequency"));
  assert.ok(f.some((x) => x.rule === "grain-frequency" && /0\.8 \/ 4/.test(x.message)));
});

test("grain opacity above the 0.08 ceiling is an error", () => {
  const f = one("a.css", GOOD.replace("--sk-noise-opacity: .05;", "--sk-noise-opacity: .12;"));
  assert.ok(hasError(f, "grain-opacity"));
});

test("grain opacity above the 0.06 light budget is a warning", () => {
  const f = one("a.css", GOOD.replace("--sk-noise-opacity: .05;", "--sk-noise-opacity: .07;"));
  assert.ok(has(f, "grain-opacity"));
  assert.ok(!hasError(f, "grain-opacity"));
});

test("the same 0.07 in a dark block is within the dark allowance", () => {
  const f = one("a.css", GOOD + `
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --sk-noise-opacity: .07; }
}`);
  assert.ok(!has(f, "grain-opacity"));
});

test("two grain layers in one file is a warning about paint rectangles", () => {
  const f = one("a.css", GOOD + `
.sk-card::before {
  content: "";
  background-image: var(--sk-noise);
  background-size: 160px 160px;
  pointer-events: none;
}`);
  assert.ok(has(f, "grain-count"));
});

test("a grain tile painted at a size other than 160px is a warning", () => {
  const f = one("a.css", GOOD.replace("background-size: 160px 160px;", "background-size: 64px 64px;"));
  assert.ok(has(f, "grain-frequency"));
});

/* --------------------------------------------------- forced colors and contrast */

test("forced-colors that hides the grain with background-image: none is an error", () => {
  const f = one("a.css", GOOD.replace(
    ".sk-panel::before { display: none; }",
    ".sk-panel::before { background-image: none; }"));
  assert.ok(hasError(f, "forced-colors-grain"));
  assert.ok(f.some((x) => x.rule === "forced-colors-grain" && /url\(\)/.test(x.message)));
});

test("forced-colors with no grain rule at all is an error", () => {
  const f = one("a.css", GOOD.replace(".sk-panel::before { display: none; }", ""));
  assert.ok(hasError(f, "forced-colors-grain"));
});

test("a missing forced-colors block is an error", () => {
  const f = one("a.css", GOOD.replace("@media (forced-colors: active)", "@media (min-width: 60rem)"));
  assert.ok(hasError(f, "a11y-blocks"));
});

test("a missing prefers-contrast block is an error", () => {
  const f = one("a.css", GOOD.replace("@media (prefers-contrast: more)", "@media (min-width: 40rem)"));
  assert.ok(hasError(f, "a11y-blocks"));
});

test("a prefers-contrast block that leaves the grain up is an error", () => {
  const f = one("a.css", GOOD.replace(".sk-panel::before { opacity: 0; }", ".sk-panel::before { opacity: .03; }"));
  assert.ok(hasError(f, "contrast-grain"));
});

test("a live box-shadow inside forced-colors is a warning", () => {
  const f = one("a.css", GOOD + `
@media (forced-colors: active) {
  .sk-card { box-shadow: var(--sk-elev-2); }
}`);
  assert.ok(has(f, "forced-colors-shadow"));
});

/* ------------------------------------------------------------------ motion */

test("transition: box-shadow is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; transition: box-shadow 200ms ease; }`);
  assert.ok(hasError(f, "animated-shadow"));
});

test("transition: all is a warning because it includes the stack", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; transition: all 200ms ease; }`);
  assert.ok(has(f, "animated-shadow"));
});

test("transition: background-image is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; transition: background-image 200ms ease; }`);
  assert.ok(hasError(f, "animated-background"));
});

test("a keyframe step that sets box-shadow is an error", () => {
  const f = one("a.css", GOOD + `
@keyframes pulse { from { box-shadow: var(--sk-elev-1); } to { box-shadow: var(--sk-elev-3); } }`);
  assert.ok(hasError(f, "animated-shadow"));
});

test("a keyframe step that animates the grain is an error", () => {
  const f = one("a.css", GOOD + `
@keyframes drift { to { background-image: var(--sk-noise); } }`);
  assert.ok(hasError(f, "animated-background"));
});

test("will-change: box-shadow is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { border: 1px solid #7a6a4e; will-change: box-shadow; }`);
  assert.ok(hasError(f, "will-change-shadow"));
});

test("reduced motion that deletes the pressed shadows is an error", () => {
  const f = one("a.css", GOOD + `
@media (prefers-reduced-motion: reduce) {
  .sk-button:active { box-shadow: none; }
}`);
  assert.ok(hasError(f, "reduced-motion-state"));
});

test("reduced motion that restores a raised stack on the pressed state is an error", () => {
  const f = one("a.css", GOOD + `
@media (prefers-reduced-motion: reduce) {
  .sk-button:active { box-shadow: var(--sk-elev-2); }
}`);
  assert.ok(hasError(f, "reduced-motion-state"));
});

test("reduced motion that only removes the travel is correct", () => {
  const { findings } = scan([{ file: "a.css", text: GOOD }]);
  assert.ok(!has(findings, "reduced-motion-state"));
});

/* ------------------------------------------------- textures, hybrid, travel */

test("a raster texture on a decorative selector is an error", () => {
  const f = one("a.css", GOOD + `
.sk-leather { background-image: url("/img/leather.jpg"); }`);
  assert.ok(hasError(f, "raster-texture"));
});

test("a backdrop blur above the 12px hybrid cap is an error", () => {
  const f = one("a.css", GOOD + `
.sk-glass { backdrop-filter: blur(24px); }`);
  assert.ok(hasError(f, "hybrid-blur"));
});

test("a backdrop blur at the cap passes", () => {
  const f = one("a.css", GOOD + `
.sk-glass { backdrop-filter: blur(12px); }`);
  assert.ok(!has(f, "hybrid-blur"));
});

test("more than two backdrop-filtered elements is a warning", () => {
  const f = one("a.css", GOOD + `
.a1 { backdrop-filter: blur(8px); }
.a2 { backdrop-filter: blur(8px); }
.a3 { backdrop-filter: blur(8px); }`);
  assert.ok(has(f, "hybrid-blur"));
});

test("press travel above 2px is an error", () => {
  const f = one("a.css", GOOD + `
.sk-card { --sk-press-travel: 4px; }`);
  assert.ok(hasError(f, "travel-ceiling"));
});

test("press travel at 2px passes", () => {
  const f = one("a.css", GOOD + `
.sk-card { --sk-press-travel: 2px; }`);
  assert.ok(!has(f, "travel-ceiling"));
});

/* ------------------------------------------------------------------ driver */

test("an empty scan reports nothing and no surfaces", () => {
  const { summary, findings } = scan([]);
  assert.equal(summary.filesScanned, 0);
  assert.equal(summary.skeuoSurfaces, 0);
  assert.equal(findings.length, 0);
});

test("findings are sorted with errors first", () => {
  const f = one("a.css", GOOD + `
.sk-card { box-shadow: 0 2px 4px rgba(0,0,0,.2); transition: all 1s; }`);
  assert.ok(f.length >= 2);
  assert.equal(f[0].severity, "error");
});

test("the scanner computes no contrast figure of its own", () => {
  const f = one("a.css", GOOD);
  assert.ok(!f.some((x) => /:1\b/.test(x.message)));
});
