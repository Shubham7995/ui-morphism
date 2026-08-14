/**
 * Tests for max-scan.mjs, and for the intensity contract this plugin ships.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/06-maximalism.md — §6's loud-layer budget and
 * animation rules, §7's decorative-layer and reflow rules, §8's asset and
 * compositing budgets, or §13's self-run checklist and refusal list.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  parse,
  stripComments,
  scan,
  sceneKey,
  maxRotationDeg,
  shadowBlurPx,
  splitTopLevel,
  animatedProps,
  firstFamily,
  namesAny,
} from "./max-scan.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const one = (text, file = "a.css") => scan([{ file, text }]);
const rules = (res) => res.findings.map((f) => f.rule);
const errs = (res) => res.findings.filter((f) => f.severity === "error").map((f) => f.rule);

/* ------------------------------------------------------------------ parser */

test("the parser returns a root with the file's rules under it", () => {
  const root = parse(".a { color: red; }\n.b { color: blue; }");
  assert.equal(root.type, "root");
  assert.equal(root.children.length, 2);
  assert.equal(root.children[0].prelude, ".a");
  assert.equal(root.children[0].decls[0].prop, "color");
  assert.equal(root.children[0].decls[0].value, "red");
});

test("the parser records line numbers and nests at-rules", () => {
  const root = parse("@media (prefers-reduced-motion: reduce) {\n  .a { animation: none; }\n}");
  assert.equal(root.children[0].type, "atrule");
  assert.equal(root.children[0].children[0].prelude, ".a");
  assert.equal(root.children[0].children[0].decls[0].line, 2);
});

test("a brace inside a quoted url cannot desynchronise the brace stack", () => {
  const root = parse('.a { background: url("x{y.png"); } .b { color: red; }');
  assert.equal(root.children.length, 2);
  assert.equal(root.children[1].prelude, ".b");
});

test("comments are skipped by the parser and by stripComments", () => {
  const root = parse("/* .ghost { color: red } */ .a { color: blue; }");
  assert.equal(root.children.length, 1);
  assert.match(stripComments("/* data-calm */ .a{}"), /^\s*\.a\{\}$/);
});

/* ------------------------------------------------------------ value helpers */

test("splitTopLevel ignores delimiters inside parentheses", () => {
  assert.deepEqual(
    splitTopLevel("4px 4px 0 rgb(1, 2, 3), 8px 8px 0 var(--max-cyan)", ","),
    ["4px 4px 0 rgb(1, 2, 3)", "8px 8px 0 var(--max-cyan)"]);
});

test("shadowBlurPx reads the third length of each layer and ignores colour functions", () => {
  assert.equal(shadowBlurPx("6px 6px 0 var(--max-ink)"), null, "a var() value is not judged");
  assert.equal(shadowBlurPx("6px 6px 0 #0B0A0F"), null, "zero blur is the signature, not a finding");
  assert.equal(shadowBlurPx("0 4px 12px rgb(0 0 0 / .15)"), 12);
  assert.equal(shadowBlurPx("4px 4px 0 #FF2E88, 8px 8px 0 #00E5FF, 12px 12px 0 #0B0A0F"), null);
});

test("maxRotationDeg returns the largest magnitude, sign-independent", () => {
  assert.equal(maxRotationDeg("rotate(-1.5deg)"), 1.5);
  assert.equal(maxRotationDeg("rotate(5deg) skew(2deg)"), 5);
  assert.equal(maxRotationDeg("none"), null);
});

test("animatedProps reads shorthands and property lists alike", () => {
  assert.deepEqual(animatedProps("transition", "translate 220ms linear, box-shadow 220ms linear"),
    ["translate", "box-shadow"]);
  assert.deepEqual(animatedProps("transition-property", "width, height"), ["width", "height"]);
});

test("firstFamily unquotes and lower-cases the first family named", () => {
  assert.equal(firstFamily('"Archivo Expanded", "Anton", system-ui'), "archivo expanded");
});

test("namesAny does not fire on a substring: sticker is not a ticker", () => {
  assert.equal(namesAny(".max-scene__sticker", "marquee|ticker"), false);
  assert.equal(namesAny(".max-marquee__track", "marquee|ticker"), true);
  assert.equal(namesAny(".page-background", "ground|grain"), false);
  assert.equal(namesAny(".max-scene__ground", "ground|grain"), true);
});

test("sceneKey keys on the scene root, so BEM children share their scene's budget", () => {
  assert.equal(sceneKey("a.css", ".max-scene__ground"), "a.css :: max-scene");
  assert.equal(sceneKey("a.css", ".max-scene--riot"), "a.css :: max-scene");
  assert.equal(sceneKey("a.css", ".card"), "a.css :: (file)");
});

/* ------------------------------------------------- the loud-layer budget §6 */

test("three loud layers pass and a fourth in the same scene fails", () => {
  const three = `
    .max-scene { isolation: isolate; }
    .max-scene__ground { background-image: repeating-linear-gradient(45deg, red 0 10px, transparent 10px 24px); }
    .max-scene__sticker { border: 3px solid #0B0A0F; }
    .max-scene__marquee { border: 3px solid #0B0A0F; }
  `;
  assert.equal(errs(one(three)).includes("loud-layers"), false);

  const four = three + `
    .max-scene__card { border: 3px solid #0B0A0F; box-shadow: 4px 4px 0 #FF2E88, 8px 8px 0 #00E5FF, 12px 12px 0 #0B0A0F; }
  `;
  const res = one(four);
  assert.ok(errs(res).includes("loud-layers"));
  assert.equal(res.summary.maxLoudLayers, 4);
  assert.equal(res.summary.loudLayerCap, 3);
});

test("the census counts distinct kinds, so two stickers are one sticker cluster", () => {
  const res = one(`
    .max-scene__sticker-a { border: 3px solid #0B0A0F; }
    .max-scene__sticker-b { border: 3px solid #0B0A0F; }
  `);
  assert.equal(res.scenes[0].count, 1);
  assert.deepEqual(res.scenes[0].layers, ["sticker cluster"]);
});

test("a layer cancelled under forced-colors or reduced motion is not counted", () => {
  const res = one(`
    @media (forced-colors: active) {
      .max-scene__sticker { border: 2px solid CanvasText; }
    }
    @media (prefers-reduced-motion: reduce) {
      .max-scene__marquee { rotate: 0deg; }
    }
  `);
  assert.equal(res.scenes.length, 0);
});

/* ------------------------------------------------------- shadows and tilt §4 */

test("a non-zero shadow blur is an error — zero blur is the signature", () => {
  assert.ok(errs(one(".max-card { border: 2px solid #000; box-shadow: 0 4px 12px rgb(0 0 0 / .15); }"))
    .includes("shadow-blur"));
});

test("rotation past the 5deg ceiling is an error, and 5deg itself is not", () => {
  assert.ok(errs(one(".max-sticker { border: 2px solid #000; rotate: 6deg; }")).includes("tilt-ceiling"));
  assert.equal(errs(one(".max-sticker { border: 2px solid #000; rotate: 5deg; }")).includes("tilt-ceiling"), false);
});

test("a shadow with no border anywhere on its root class is a shadow-only boundary", () => {
  assert.ok(errs(one(".max-card { box-shadow: 6px 6px 0 #0B0A0F; }")).includes("shadow-only-boundary"));
});

test("a border declared on the base rule covers a modifier that only sets the shadow", () => {
  const res = one(`
    .max-card { border: 3px solid #0B0A0F; }
    .max-card--deep { box-shadow: 12px 12px 0 #0B0A0F; }
  `);
  assert.equal(errs(res).includes("shadow-only-boundary"), false);
});

/* ------------------------------------------------------------- blend modes §8 */

test("a full-viewport blend is an error and any blend without isolation warns", () => {
  const res = one(".overlay { position: fixed; mix-blend-mode: multiply; }");
  assert.ok(errs(res).includes("blend-fullscreen"));
  assert.ok(rules(res).includes("blend-isolation"));
});

test("a blend inside a file that declares isolation: isolate does not warn about isolation", () => {
  const res = one(`
    .max-scene { isolation: isolate; }
    .max-scene__grain { mix-blend-mode: multiply; }
  `);
  assert.equal(rules(res).includes("blend-isolation"), false);
});

/* ------------------------------------------------------ animated properties §6 */

test("animating width or filter is an error, and transition: all is too", () => {
  assert.ok(errs(one(".a { transition: width 200ms linear; }")).includes("animated-prop"));
  assert.ok(errs(one(".a { transition: filter 200ms linear; }")).includes("animated-prop"));
  assert.ok(errs(one(".a { transition: all 200ms linear; }")).includes("animated-prop"));
});

test("the permitted list animates clean", () => {
  const res = one(".max-btn { transition: translate 220ms linear, box-shadow 220ms linear, background-color 220ms linear; }");
  assert.equal(errs(res).includes("animated-prop"), false);
});

/* ------------------------------------------- infinite motion, Calm mode §6 §7 */

test("an infinite animation with no data-calm hook fails, because SC 2.2.2 is Level A", () => {
  const res = one(`
    .max-marquee__track { animation: max-scroll 24s linear infinite; }
    @media (prefers-reduced-motion: reduce) { .max-marquee__track { animation: none; } }
  `);
  assert.ok(errs(res).includes("calm-toggle"));
  assert.equal(res.summary.infiniteAnimations, 1);
});

test("an infinite animation with a Calm hook and a pause control clears the Level A rows", () => {
  const res = one(`
    .max-marquee__track { animation: max-scroll 24s linear infinite; }
    @media (prefers-reduced-motion: reduce) { .max-marquee__track { animation: none; } }
    /* markup: */
    .calm-toggle::after { content: "data-calm"; }
  `, "calm.html");
  assert.equal(errs(res).includes("calm-toggle"), false, "a comment must not satisfy the hook");
});

test("infinite motion with no reduced-motion block at all is an error", () => {
  const res = one(`
    .max-marquee__track { animation: max-scroll 24s linear infinite; }
    .toggle[data-calm] { color: red; }
  `);
  assert.ok(errs(res).includes("a11y-blocks"));
});

test("a declaration cancelled inside the reduced-motion block is not counted as infinite", () => {
  const res = one(`
    @media (prefers-reduced-motion: reduce) {
      .max-marquee__track { animation-iteration-count: infinite; }
    }
  `);
  assert.equal(res.summary.infiniteAnimations, 0);
});

/* -------------------------------------------------------- assets and fonts §8 */

test("a raster texture on a grain or ground selector is an error", () => {
  assert.ok(errs(one(".max-scene__grain { background-image: url('noise.png'); }")).includes("raster-texture"));
});

test("a fifth font family is an error; four are the budget", () => {
  const four = `
    .a { font-family: "Archivo Expanded", sans-serif; }
    .b { font-family: "Archivo Condensed", sans-serif; }
    .c { font-family: "Inter", sans-serif; }
    .d { font-family: "JetBrains Mono", monospace; }
  `;
  assert.equal(errs(one(four)).includes("font-families"), false);
  assert.ok(errs(one(four + '.e { font-family: "Playfair Display", serif; }')).includes("font-families"));
});

/* ------------------------------------------------------- DOM order, reflow §7 */

test("order and row-reverse on sequential content warn", () => {
  assert.ok(rules(one(".a { order: 2; }")).includes("dom-order"));
  assert.ok(rules(one(".a { flex-direction: row-reverse; }")).includes("dom-order"));
});

test("absolute ornament warns unless a max-width: 640px block returns it to the flow", () => {
  assert.ok(rules(one(".max-sticker { position: absolute; }")).includes("reflow-ornament"));
  const fixed = `
    .max-sticker { position: absolute; }
    @media (max-width: 640px) { .max-sticker { position: static; } }
  `;
  assert.equal(rules(one(fixed)).includes("reflow-ornament"), false);
});

/* ------------------------------------------------------------ the safety set */

test("a loud scene with none of the safety blocks warns once per missing block", () => {
  const res = one(".max-scene__ground { background-image: repeating-conic-gradient(#0B0A0F 0% 25%, transparent 0% 50%); }");
  const blocks = res.findings.filter((f) => f.rule === "a11y-blocks");
  assert.equal(blocks.length, 3, "forced-colors, reduced transparency and the coarse-pointer block");
});

test("the doc §5 recipe plus its safety blocks scans without an error", () => {
  const res = one(`
    .max-scene { isolation: isolate; background-color: #FFF8E7; }
    .max-scene__ground { background-image: radial-gradient(circle at 1px 1px, #0B0A0F 1.5px, transparent 1.6px); }
    .max-scene__grain { background-image: url("data:image/svg+xml,%3Csvg%3E%3CfeTurbulence/%3E%3C/svg%3E"); mix-blend-mode: multiply; pointer-events: none; }
    .max-card { border: 3px solid #0B0A0F; box-shadow: 6px 6px 0 #0B0A0F; transform: rotate(-1.5deg); }
    .max-btn { border: 3px solid #0B0A0F; transition: translate 220ms linear, box-shadow 220ms linear; }
    @media (prefers-reduced-motion: reduce) { .max-marquee__track { animation: none; } }
    @media (prefers-reduced-transparency: reduce) { .max-scene__grain { display: none; } }
    @media (forced-colors: active) { .max-card { border: 2px solid CanvasText; box-shadow: none; } }
    @media (max-width: 720px), (pointer: coarse) { .max-scene__grain { display: none; } }
  `);
  assert.deepEqual(errs(res), []);
  assert.ok(res.summary.safetyBlocksFound.includes("forced-colors"));
  assert.ok(res.summary.safetyBlocksFound.includes("coarse-degradation"));
});

test("an empty scan reports nothing and fails nothing", () => {
  const res = scan([]);
  assert.deepEqual(res.findings, []);
  assert.equal(res.summary.filesScanned, 0);
});

/* -------------------------------------------------- the shipped token layer */

test("assets/tokens.css declares both dark blocks and both accent ramps", () => {
  const css = readFileSync(join(HERE, "..", "assets", "tokens.css"), "utf8");
  assert.ok(css.includes('@media (prefers-color-scheme: dark)'));
  assert.ok(css.includes(':root:not([data-theme="light"])'));
  assert.ok(css.includes(':root[data-theme="dark"]'));
  assert.ok(css.includes("--max-violet-deep"));
  assert.ok(css.includes("--max-cobalt-deep"));
});

test("the dark role bindings pick from the deep ramp on the cream surface", () => {
  const css = readFileSync(join(HERE, "..", "assets", "tokens.css"), "utf8");
  const dark = css.slice(css.indexOf(':root[data-theme="dark"]'));
  assert.match(dark, /--max-text-on-ink:\s*var\(--max-violet-deep\)/);
  assert.match(dark, /--max-text-on-paper:\s*var\(--max-lime\)/);
});

test("tokens.css declares the 44px target minimum and the four-part focus ring", () => {
  const css = readFileSync(join(HERE, "..", "assets", "tokens.css"), "utf8");
  assert.match(css, /--max-target-min:\s*44px/);
  assert.match(css, /--max-focus-w:\s*4px/);
  assert.match(css, /--max-focus-offset:\s*2px/);
  assert.match(css, /--max-focus-ring:\s*var\(--max-focus-w\) solid var\(--max-focus-inner\)/);
});

test("@theme is never nested inside an at-rule in the Tailwind mirror", () => {
  const css = readFileSync(join(HERE, "..", "assets", "tokens.theme.css"), "utf8");
  const root = parse(css);
  const nested = [];
  const visit = (n, depth) => {
    for (const c of n.children) {
      if (/^@theme\b/.test(c.prelude) && depth > 0) nested.push(c.prelude);
      visit(c, depth + 1);
    }
  };
  visit(root, 0);
  assert.deepEqual(nested, []);
});

/* ------------------------------------------------- the intensity contract §13 */

const contract = JSON.parse(
  readFileSync(join(HERE, "..", "..", "..", "assets", "intensity.contract.json"), "utf8"));

test("the contract declares doc §13's five knobs and its default of 60", () => {
  assert.equal(contract.default, 60);
  assert.deepEqual(Object.keys(contract.knobs).sort(),
    ["chromaSpread", "layerCount", "motionLoad", "shadowStack", "tiltRange"]);
});

test("every knob's endpoints are doc §13's endpoints", () => {
  const ends = (k) => {
    const a = contract.knobs[k].anchors;
    return [a[0][1], a[a.length - 1][1]];
  };
  assert.deepEqual(ends("layerCount"), [1, 3]);
  assert.deepEqual(ends("chromaSpread"), [1, 6]);
  assert.deepEqual(ends("shadowStack"), [2, 12]);
  assert.deepEqual(ends("tiltRange"), [0, 5]);
  assert.deepEqual(ends("motionLoad"), [0, 3]);
  assert.deepEqual([contract.pairedRamps.chroma.anchors[0][1],
                    contract.pairedRamps.chroma.anchors[1][1]], [0.1, 0.3]);
});

test("every knob is monotone non-decreasing across its anchors", () => {
  for (const [name, knob] of Object.entries(contract.knobs)) {
    let lastT = -1;
    let lastV = -Infinity;
    for (const [t, v] of knob.anchors) {
      assert.ok(t > lastT, name + " anchors must ascend in intensity");
      assert.ok(v >= lastV, name + " must not decrease at intensity " + t);
      lastT = t; lastV = v;
    }
  }
});

test("the clamps agree with the knob endpoints, so no clamp can widen a knob", () => {
  for (const [name, knob] of Object.entries(contract.knobs)) {
    const a = knob.anchors;
    assert.equal(contract.clamps[name].min, a[0][1], name + " clamp floor");
    assert.equal(contract.clamps[name].max, a[a.length - 1][1], name + " clamp ceiling");
  }
});

test("layerCount is hard-capped at three at every anchor, which is the whole budget", () => {
  for (const [, v] of contract.knobs.layerCount.anchors) assert.ok(v <= 3);
});

test("the app-accent cap is 45 and clamps the layer and motion knobs", () => {
  const cap = contract.contextCaps.find((c) => c.when.surfaceType === "app-accent");
  assert.equal(cap.cap, 45);
  const clamp = contract.contextClamps.find((c) => c.when.surfaceType === "app-accent");
  assert.equal(clamp.clamps.layerCount.max, 1);
  assert.equal(clamp.clamps.motionLoad.max, 0);
});

test("both motionPolicy clamps take ambient motion to zero", () => {
  for (const policy of ["state-only", "none"]) {
    const c = contract.contextClamps.find((x) => x.when.motionPolicy === policy);
    assert.equal(c.clamps.motionLoad.max, 0, policy);
  }
});

test("the contract records the clamps that no knob bound can express", () => {
  const keys = Object.keys(contract.clampsNotExpressibleHere);
  for (const k of ["loudLayersPerViewport", "textOnPattern", "targetMin", "focusRing",
                   "fontFamilies", "rasterTexture", "flashRate", "blendModes",
                   "absoluteOrnament", "pauseControl"]) {
    assert.ok(keys.includes(k), "missing " + k);
  }
});

/* ------------------------------------------- the knob table the skill prints */

/** The curves in ../references/tokens.md §4, resolved. */
const resolve = (t) => ({
  layerCount: t < 50 ? 1 : t < 75 ? 2 : 3,
  chromaSpread: Math.min(6, 1 + Math.floor(t / 20)),
  chroma: Number((0.1 + 0.002 * t).toFixed(3)),
  shadowStack: Math.round(2 + 0.1 * t),
  tiltRange: Number((0.05 * t).toFixed(2)),
  motionLoad: t < 34 ? 0 : t < 67 ? 1 : t < 90 ? 2 : 3,
});

test("the default of 60 resolves to the row the SKILL.md prints", () => {
  assert.deepEqual(resolve(60),
    { layerCount: 2, chromaSpread: 4, chroma: 0.22, shadowStack: 8, tiltRange: 3, motionLoad: 1 });
});

test("the app-accent ceiling of 45 resolves to one loud layer", () => {
  const r = resolve(45);
  assert.equal(r.layerCount, 1);
  assert.equal(r.shadowStack, 7);
  assert.equal(r.tiltRange, 2.25);
});

test("intensity 0 is a usable floor rather than nothing: one plane, one shadow, no tilt", () => {
  assert.deepEqual(resolve(0),
    { layerCount: 1, chromaSpread: 1, chroma: 0.1, shadowStack: 2, tiltRange: 0, motionLoad: 0 });
});

test("intensity 100 lands on every knob's stated maximum", () => {
  assert.deepEqual(resolve(100),
    { layerCount: 3, chromaSpread: 6, chroma: 0.3, shadowStack: 12, tiltRange: 5, motionLoad: 3 });
});

test("the resolved curves are monotone at every five points", () => {
  let prev = null;
  for (let t = 0; t <= 100; t += 5) {
    const r = resolve(t);
    if (prev) for (const k of Object.keys(r)) assert.ok(r[k] >= prev[k], k + " decreased at " + t);
    prev = r;
  }
});
