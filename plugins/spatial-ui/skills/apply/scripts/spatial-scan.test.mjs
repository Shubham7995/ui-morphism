/**
 * Tests for spatial-scan.mjs.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/10-spatial-ui.md §13 — either the validation
 * checklist the skill self-runs, or the anti-pattern list it refuses — or one of
 * the §6 / §7 / §8 rules those lines rest on. The last three tests run the
 * scanner over the doc's own §5 reference implementation, which is the only
 * fixture in this file nobody wrote to be scanned.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { scan, zComponents, planeRotations, functionCalls } from "./spatial-scan.mjs";

/** Convenience: scan one virtual file and return its findings. */
const one = (name, text) => scan([{ file: name, text }]).findings;
const rules = (findings) => findings.map((f) => f.rule);
const errorsOf = (findings) => findings.filter((f) => f.severity === "error");
const of = (findings, rule) => findings.filter((f) => f.rule === rule);

/**
 * A minimal well-formed sheet: one camera on a stage that is not the root, two
 * rungs carrying their counter-scale, a glass panel, and both escape hatches.
 * Used as the base for single-defect fixtures.
 */
const GOOD = `
.sp-stage {
  position: relative;
  perspective: var(--sp-perspective);
  perspective-origin: var(--sp-perspective-origin);
  transform-style: preserve-3d;
  max-width: var(--sp-comfort-width);
}
.sp-depth-2 { transform: translateZ(var(--sp-z-2)) scale(var(--sp-k-2)); box-shadow: var(--sp-shadow-2); }
.sp-depth-5 { transform: translateZ(var(--sp-z-5)) scale(var(--sp-k-5)); box-shadow: var(--sp-shadow-5); }
.sp-panel {
  border-radius: var(--sp-radius-panel);
  background: var(--sp-panel);
  border: 1px solid var(--sp-hairline);
  transition: transform var(--sp-dur-depth) var(--sp-ease-depth);
}
.sp-btn {
  min-height: max(var(--sp-target-floor), var(--sp-target-pointer));
  min-width: max(var(--sp-target-floor), var(--sp-target-pointer));
}
@media (prefers-reduced-motion: reduce) {
  :root { --sp-parallax-translate: 0px; --sp-parallax-tilt: 0deg; }
}
@media (forced-colors: active) {
  .sp-stage { perspective: none; }
  .sp-panel { transform: none; background: Canvas; border: 1px solid CanvasText; }
}
`;

test("a well-formed stage, ladder and escape-hatch set produces no errors", () => {
  assert.deepEqual(errorsOf(one("clean.css", GOOD)), []);
});

/* --------------------------------------------------- SC 2.5.7, the headline */

test("a drag library with no keyboard path and no reset is two errors", () => {
  const findings = one("Panels.tsx", `
import { useDraggable } from "@dnd-kit/core";
export function Panel() {
  const { attributes, listeners } = useDraggable({ id: "panel" });
  return <section {...attributes} {...listeners} className="sp-panel" />;
}`);
  const hits = of(findings, "drag-alternative");
  assert.equal(hits.length, 2);
  assert.ok(hits.every((f) => f.severity === "error"));
  assert.ok(hits.some((f) => /keyboard handler/.test(f.message)));
  assert.ok(hits.some((f) => /reset control/.test(f.message)));
});

test("arrow-key nudging plus a reset control satisfies SC 2.5.7", () => {
  const findings = one("Panels.tsx", `
import { useDraggable } from "@dnd-kit/core";
export function Panel({ onMove, resetLayout }) {
  const { attributes, listeners } = useDraggable({ id: "panel" });
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") onMove(-8, 0);
    if (e.key === "ArrowRight") onMove(8, 0);
  };
  return (
    <section {...attributes} {...listeners} onKeyDown={onKeyDown} className="sp-panel">
      <button type="button" onClick={resetLayout}>Reset layout</button>
    </section>
  );
}`);
  assert.deepEqual(of(findings, "drag-alternative"), []);
});

test("a Compose XR movable()/resizable() panel is a drag affordance", () => {
  const findings = one("Panel.kt", `
SpatialPanel(SubspaceModifier.movable().resizable()) { Content() }`);
  assert.ok(of(findings, "drag-alternative").length >= 1);
  assert.ok(of(findings, "drag-alternative").every((f) => f.severity === "error"));
});

test("CSS `resize` is a drag affordance too, and it is the one nobody reads as one", () => {
  const findings = one("panel.css", `.sp-panel { resize: both; overflow: auto; }`);
  const hits = of(findings, "drag-alternative");
  assert.equal(hits.length, 2);
  assert.ok(hits.every((f) => /resize: both/.test(f.message)));
});

test("`resize: none` is not a drag affordance", () => {
  assert.deepEqual(of(one("panel.css", `.sp-panel { resize: none; }`), "drag-alternative"), []);
});

test("an ordinary pointerdown handler is not a drag affordance", () => {
  const findings = one("Button.tsx", `
export const Btn = () => <button onPointerDown={() => setPressed(true)}>Go</button>;`);
  assert.deepEqual(of(findings, "drag-alternative"), []);
});

test("a pointerdown handler that repositions a panel IS a drag affordance", () => {
  const findings = one("Drag.tsx", `
export function Panel({ setPosition }) {
  return <section onPointerDown={(e) => setPosition(dragFrom(e))} className="sp-panel" />;
}`);
  assert.ok(of(findings, "drag-alternative").length >= 1);
});

/* ------------------------------------------------------- camera containment */

test("perspective on body is an error; perspective on a stage class is not", () => {
  const bad = one("a.css", `body { perspective: 1200px; }`);
  assert.equal(of(bad, "camera-on-root").length, 1);
  assert.equal(of(bad, "camera-on-root")[0].severity, "error");
  assert.deepEqual(of(one("b.css", `.sp-stage { perspective: 1200px; }`), "camera-on-root"), []);
});

test("perspective on :root and on the universal selector are both errors", () => {
  assert.equal(of(one("c.css", `:root { perspective: 800px; }`), "camera-on-root").length, 1);
  assert.equal(of(one("d.css", `* { perspective: 800px; }`), "camera-on-root").length, 1);
});

test("position: fixed written under the stage is an error", () => {
  const findings = one("e.css", `
.sp-stage { perspective: 1200px; }
.sp-stage .app-header { position: fixed; top: 0; }`);
  const hit = of(findings, "fixed-in-camera").find((f) => f.severity === "error");
  assert.ok(hit);
  assert.match(hit.message, /stops being fixed/);
});

test("the camera may be declared BELOW the fixed rule and still be found", () => {
  const findings = one("f.css", `
.sp-stage .app-header { position: fixed; }
.sp-stage { perspective: 1200px; }`);
  assert.ok(of(findings, "fixed-in-camera").some((f) => f.severity === "error"));
});

test("a fixed element that is a sibling of the stage is clean", () => {
  const findings = one("g.css", `
.sp-stage { perspective: 1200px; }
.app-header { position: fixed; top: 0; }`);
  assert.deepEqual(errorsOf(of(findings, "fixed-in-camera")), []);
});

test("a non-none transform establishes the containing block just as perspective does", () => {
  const findings = one("h.css", `
.hero { transform: translateZ(0); }
.hero .sticky-bar { position: sticky; }`);
  assert.ok(of(findings, "fixed-in-camera").some((f) => f.severity === "error"));
});

/* ---------------------------------------------- the ladder and counter-scale */

test("a translateZ with no counter-scale is an error", () => {
  const findings = one("i.css", `.sp-panel { transform: translateZ(var(--sp-z-3)); }`);
  const hit = of(findings, "counter-scale")[0];
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /is a zoom, not a depth/);
});

test("a literal z at or above the first rung also needs its counter-scale", () => {
  assert.ok(of(one("j.css", `.p { transform: translateZ(56px); }`), "counter-scale").length === 1);
  assert.deepEqual(of(one("k.css", `.p { transform: translateZ(56px) scale(0.95333); }`), "counter-scale"), []);
});

test("translate3d carries its z in the third argument, past nested calc()", () => {
  const findings = one("l.css", `
.sp-orbiter { transform: translate3d(calc(-50% + 2px), 0, var(--sp-z-1)); }`);
  assert.equal(of(findings, "counter-scale").length, 1);
});

test("a z of zero is not a rung and needs no counter-scale", () => {
  const findings = one("m.css", `
.sp-layer { transform: translate3d(calc(var(--sp-px) * 12px), calc(var(--sp-py) * 12px), 0); }`);
  assert.deepEqual(of(findings, "counter-scale"), []);
  assert.deepEqual(of(findings, "ladder-quantisation"), []);
});

test("a z between rungs is an error; a z on the base ladder is a hard-coding warning", () => {
  const off = of(one("n.css", `.p { transform: translateZ(48px) scale(0.96); }`), "ladder-quantisation");
  assert.equal(off.length, 1);
  assert.equal(off[0].severity, "error");
  assert.match(off[0].message, /six-step ladder/);

  const literal = of(one("o.css", `.p { transform: translateZ(40px) scale(0.966); }`), "ladder-quantisation");
  assert.equal(literal.length, 1);
  assert.equal(literal[0].severity, "warn");
  assert.match(literal[0].message, /depthScale/);
});

test("a literal z below the first rung is read as a state delta, not a rung", () => {
  const findings = one("p.css", `.sp-btn:hover { transform: translateZ(6px); }`);
  assert.deepEqual(of(findings, "counter-scale"), []);
  const info = of(findings, "ladder-quantisation")[0];
  assert.equal(info.severity, "info");
});

test("a negative z — the -125px dialog pushback — is exempt from both rules", () => {
  const findings = one("q.css", `.sp-content--pushed { transform: translateZ(var(--sp-z-push)); }`);
  assert.deepEqual(of(findings, "counter-scale"), []);
  assert.deepEqual(of(findings, "ladder-quantisation"), []);
});

/* --------------------------------------------------------------- preserve-3d */

test("preserve-3d on a scrolling container is a refusal, not a budget line", () => {
  const hit = of(one("r.css", `.sp-list { transform-style: preserve-3d; overflow-y: auto; }`), "preserve-3d-scroller")[0];
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("preserve-3d nested four deep in the selectors is over budget", () => {
  const findings = one("s.css", `
.a { transform-style: preserve-3d; }
.a .b { transform-style: preserve-3d; }
.a .b .c { transform-style: preserve-3d; }
.a .b .c .d { transform-style: preserve-3d; }`);
  const hit = of(findings, "preserve-3d-nesting")[0];
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /4 deep/);
});

test("preserve-3d three deep is reported as a census, not a failure", () => {
  const findings = one("t.css", `
.a { transform-style: preserve-3d; }
.a .b { transform-style: preserve-3d; }
.a .b .c { transform-style: preserve-3d; }`);
  const hit = of(findings, "preserve-3d-nesting")[0];
  assert.equal(hit.severity, "info");
  assert.match(hit.message, /floor/);
});

/* ------------------------------------------------------------ backdrop-filter */

test("seven distinct backdrop-filter surfaces exceed the budget of six", () => {
  const sheet = Array.from({ length: 7 }, (_, i) =>
    `.s${i} { backdrop-filter: blur(24px) saturate(165%); }`).join("\n");
  const hit = of(one("u.css", GOOD + sheet), "backdrop-census")[0];
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("six surfaces are inside the budget", () => {
  const sheet = Array.from({ length: 6 }, (_, i) =>
    `.s${i} { backdrop-filter: blur(24px); }`).join("\n");
  assert.deepEqual(of(one("v.css", GOOD + sheet), "backdrop-census"), []);
});

test("backdrop-filter on a repeated list item is an error", () => {
  const findings = one("w.css", `.feed li { backdrop-filter: blur(24px); }`);
  const hit = of(findings, "backdrop-on-repeated")[0];
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("a class whose name merely contains `li` is not a repeated item", () => {
  assert.deepEqual(of(one("x.css", `.list-item { backdrop-filter: blur(24px); }`), "backdrop-on-repeated"), []);
});

test("backdrop-filter plus a keyframe animation of transform is an error", () => {
  const findings = one("y.css", `
.drift { backdrop-filter: blur(24px); animation: drift 8s linear infinite; }
@keyframes drift { to { transform: translateZ(32px) scale(0.973); } }`);
  const hit = of(findings, "backdrop-on-animated")[0];
  assert.equal(hit.severity, "error");
});

test("backdrop-filter plus a transitioned transform is the style's own recipe — a warning", () => {
  const findings = one("z.css", `
.sp-panel { backdrop-filter: blur(24px); transition: transform 320ms cubic-bezier(0.2, 0, 0, 1); }`);
  const hit = of(findings, "backdrop-on-animated")[0];
  assert.equal(hit.severity, "warn");
});

test("a live backdrop-filter inside forced-colors is an error", () => {
  const findings = one("aa.css", `
@media (forced-colors: active) {
  .sp-panel { perspective: none; transform: none; backdrop-filter: blur(24px); }
}`);
  assert.ok(of(findings, "forced-colors-flatten").some((f) => /live .backdrop-filter./.test(f.message)));
});

/* ------------------------------------------------ properties that must not move */

test("transitioning backdrop-filter, perspective, width or height is an error", () => {
  for (const prop of ["backdrop-filter", "perspective", "width", "height"]) {
    const findings = one("bb.css", `.p { transition: ${prop} 300ms ease; }`);
    const hit = of(findings, "animated-property")[0];
    assert.ok(hit, prop);
    assert.equal(hit.severity, "error", prop);
  }
});

test("transition: all is a warning, because it silently includes them", () => {
  const hit = of(one("cc.css", `.p { transition: all 200ms ease; }`), "animated-property")[0];
  assert.equal(hit.severity, "warn");
});

test("a keyframe step that sets perspective is an error", () => {
  const findings = one("dd.css", `@keyframes fly { from { perspective: 2400px; } to { perspective: 800px; } }`);
  assert.equal(of(findings, "animated-property").filter((f) => f.severity === "error").length, 2);
});

test("transitioning transform and opacity is exactly what the style asks for", () => {
  assert.deepEqual(of(one("ee.css", `.p { transition: transform 320ms ease, opacity 120ms linear; }`), "animated-property"), []);
});

/* ------------------------------------------------------------- will-change */

test("an unscoped will-change is permanent and is an error", () => {
  const hit = of(one("ff.css", `.sp-card { will-change: transform; }`), "permanent-will-change")[0];
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("will-change scoped to a hovered subtree or a data-state is clean", () => {
  assert.deepEqual(of(one("gg.css", `.sp-grid:hover .sp-card { will-change: transform; }`), "permanent-will-change"), []);
  assert.deepEqual(of(one("hh.css", `.sp-panel[data-animating] { will-change: transform; }`), "permanent-will-change"), []);
});

/* ------------------------------------------------------ reduced motion, JS half */

test("a pointermove listener that is never removed is the zeroed-not-detached error", () => {
  const findings = one("parallax.js", `
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
stage.addEventListener("pointermove", onMove, { passive: true });
reduce.addEventListener("change", sync);`);
  const hit = of(findings, "reduced-motion-detach").find((f) => /never removed/.test(f.message));
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("a listener with no reduced-motion signal at all is an error", () => {
  const findings = one("parallax2.js", `
stage.addEventListener("pointermove", onMove);
stage.removeEventListener("pointermove", onMove);`);
  assert.ok(of(findings, "reduced-motion-detach").some((f) => /no .prefers-reduced-motion. signal/.test(f.message)));
});

test("add plus remove plus the media query plus a change listener is clean", () => {
  const findings = one("parallax3.js", `
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const fine = window.matchMedia("(pointer: fine)");
function sync() {
  const on = fine.matches && !reduce.matches;
  stage.removeEventListener("pointermove", onMove);
  if (on) stage.addEventListener("pointermove", onMove, { passive: true });
}
reduce.addEventListener("change", sync);
sync();`);
  assert.deepEqual(of(findings, "reduced-motion-detach"), []);
});

test("a comment mentioning removeEventListener does not satisfy the detach check", () => {
  const findings = one("parallax4.js", `
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
// we removeEventListener("pointermove", onMove) elsewhere
stage.addEventListener("pointermove", onMove);
reduce.addEventListener("change", sync);`);
  assert.ok(of(findings, "reduced-motion-detach").some((f) => /never removed/.test(f.message)));
});

test("a JSX onPointerMove with no reduced-motion signal is an error, and with one is an info to read", () => {
  const bad = one("Stage.tsx", `export const S = () => <div onPointerMove={onMove} />;`);
  assert.ok(of(bad, "reduced-motion-detach").some((f) => f.severity === "error"));

  const guarded = one("Stage2.tsx", `
const reduce = useReducedMotion();
export const S = () => <div onPointerMove={reduce ? undefined : onMove} />;`);
  const info = of(guarded, "reduced-motion-detach")[0];
  assert.equal(info.severity, "info");
  assert.match(info.message, /Read it/);
});

/* -------------------------------------------------------- forced colors, CSS half */

test("emitting the style with no forced-colors block at all is an error", () => {
  const findings = one("ii.css", `.sp-stage { perspective: 1200px; }`);
  const hit = of(findings, "forced-colors-flatten")[0];
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /floating at arbitrary angles/);
});

test("a forced-colors block that forgets perspective: none or transform: none is an error each", () => {
  const noPerspective = one("jj.css", `
.sp-stage { perspective: 1200px; }
@media (forced-colors: active) { .sp-panel { transform: none; } }`);
  assert.ok(of(noPerspective, "forced-colors-flatten").some((f) => /perspective: none/.test(f.message)));

  const noTransform = one("kk.css", `
.sp-stage { perspective: 1200px; }
@media (forced-colors: active) { .sp-stage { perspective: none; } }`);
  assert.ok(of(noTransform, "forced-colors-flatten").some((f) => /transform: none/.test(f.message)));
});

test("no spatial style in the file means no project-level escape-hatch findings", () => {
  const findings = one("ll.css", `.card { background: #fff; border: 1px solid #ddd; }`);
  assert.deepEqual(findings.filter((f) => f.file === "(project)"), []);
});

/* ------------------------------------------------------------- text planes */

test("a text plane rotated past 12 degrees is an error", () => {
  const hit = of(one("mm.css", `.sp-panel { transform: rotateY(24deg) scale(0.97); }`), "text-plane-rotation")[0];
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("12 degrees exactly is inside the ceiling, and units are converted", () => {
  assert.deepEqual(of(one("nn.css", `.p { transform: rotateX(12deg); }`), "text-plane-rotation"), []);
  assert.equal(of(one("oo.css", `.p { transform: rotateX(0.25turn); }`), "text-plane-rotation").length, 1);
});

test("an in-plane rotate() does not tilt the text plane", () => {
  assert.deepEqual(of(one("pp.css", `.sticker { transform: rotate(30deg); }`), "text-plane-rotation"), []);
});

test("a steep rotation on a decorative pseudo-element is a warning, not an error", () => {
  const hit = of(one("qq.css", `.sp-panel::after { transform: rotateY(40deg); }`), "text-plane-rotation")[0];
  assert.equal(hit.severity, "warn");
});

/* ----------------------------------------------------------- target tokens */

test("a literal min-height on a control is an error; the token form is clean", () => {
  const hit = of(one("rr.css", `.sp-btn { min-height: 32px; }`), "target-literal")[0];
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /a11y-validate/);
  assert.deepEqual(of(one("ss.css", `.sp-btn { min-height: max(var(--sp-target-floor), var(--sp-target-pointer)); }`), "target-literal"), []);
});

test("a literal size on a non-interactive panel is not a target finding", () => {
  assert.deepEqual(of(one("tt.css", `.sp-panel { width: 640px; }`), "target-literal"), []);
});

/* -------------------------------------------------------------- the budgets */

test("the layer estimate counts promoted selectors and reports itself as a floor", () => {
  const { summary, findings } = scan([{ file: "uu.css", text: GOOD }]);
  assert.equal(summary.promotedLayerSelectors, 3);
  assert.equal(summary.estimatedLayerMiB, 14.8);
  assert.deepEqual(summary.cameraSelectors, [".sp-stage"]);
  const hit = of(findings, "gpu-layer-memory")[0];
  assert.equal(hit.severity, "info");
  assert.match(hit.message, /ESTIMATE and a FLOOR/);
});

test("twenty promoted selectors blow the 96 MiB budget and become an error", () => {
  const sheet = Array.from({ length: 20 }, (_, i) =>
    `.p${i} { transform: translateZ(var(--sp-z-1)) scale(var(--sp-k-1)); }`).join("\n");
  const { summary, findings } = scan([{ file: "vv.css", text: GOOD + sheet }]);
  assert.ok(summary.estimatedLayerMiB > 96);
  assert.equal(of(findings, "gpu-layer-memory")[0].severity, "error");
});

/* ---------------------------------------------------------- parser and grammar */

test("zComponents reads translateZ, translate3d and ladder tokens", () => {
  assert.deepEqual(zComponents("translateZ(56px)"), [{ kind: "literal", raw: "56px", px: 56 }]);
  assert.equal(zComponents("translate3d(-50%, 0, var(--sp-z-1))")[0].kind, "token");
  assert.equal(zComponents("translate3d(0, 0, var(--um-spatial-elev-3))")[0].kind, "token");
  assert.equal(zComponents("translateZ(var(--host-depth))")[0].kind, "opaque");
  assert.deepEqual(zComponents("scale(0.97) rotate(2deg)"), []);
});

test("functionCalls survives nested parentheses and adjacent calls", () => {
  const calls = functionCalls("translate3d(calc(var(--a) * (2 + 1)), 0, 16px) scale(0.98)");
  assert.deepEqual(calls.map((c) => c.name), ["translate3d", "scale"]);
  assert.equal(calls[0].args.length, 3);
  assert.equal(calls[0].args[2], "16px");
});

test("planeRotations ignores rotate3d about the z axis alone", () => {
  assert.deepEqual(planeRotations("rotate3d(0, 0, 1, 45deg)"), []);
  assert.equal(planeRotations("rotate3d(1, 0, 0, 45deg)").length, 1);
});

test("CSS held in a JS template literal is parsed like a stylesheet", () => {
  const findings = one("SpatialPanel.tsx", `
const CSS = \`
.sp-panel{transform:translateZ(var(--sp-z-3));}
\`;`);
  assert.ok(of(findings, "counter-scale").some((f) => f.severity === "error"));
});

test("a url() containing a brace cannot desynchronise the parser", () => {
  const findings = one("ww.css", `.a { background: url("x{y.png"); } .b { transform: translateZ(56px); }`);
  assert.ok(of(findings, "counter-scale").some((f) => f.line === 1));
});

/* ------------------------------------------- the doc's own §5 reference build */

/** docs/10-spatial-ui.md §5 "Vanilla CSS": the markup, the stylesheet and the
 *  parallax module, sliced out of the doc at scan time so the fixture cannot
 *  drift from the research. */
async function docRecipe() {
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const here = dirname(fileURLToPath(import.meta.url));
  const lines = readFileSync(join(here, "../../../../../docs/10-spatial-ui.md"), "utf8").split("\n");
  return [
    { file: "doc-recipe.html", text: lines.slice(294, 314).join("\n") },
    { file: "doc-recipe.css", text: lines.slice(317, 494).join("\n") },
    { file: "doc-recipe.js", text: lines.slice(497, 546).join("\n") },
  ];
}

test("the doc's §5 reference build is recognised as this style at all", async () => {
  const { summary } = scan(await docRecipe());
  assert.deepEqual(summary.cameraSelectors, [".sp-stage"]);
  assert.equal(summary.glassSurfaces, 2);
  assert.equal(summary.preserve3dSelectors, 2);
  assert.equal(summary.dragAffordances, 0);
});

test("the doc's §5 parallax module passes the reduced-motion detach in full", async () => {
  const { findings } = scan(await docRecipe());
  assert.deepEqual(of(findings, "reduced-motion-detach"), []);
});

test("the doc's §5 stylesheet carries exactly one error: a permanent will-change on .sp-panel", async () => {
  // Not a scanner defect and not a doc typo — a real tension inside the
  // research. §5's listing ships `will-change: transform` on the base
  // `.sp-panel` rule, and §8 and §13 both forbid a permanent promotion on a
  // non-animating element. The plugin follows §8 and §13, and this test pins
  // that decision so it cannot be quietly reversed.
  const { findings } = scan(await docRecipe());
  const errs = errorsOf(findings);
  assert.equal(errs.length, 1, JSON.stringify(errs, null, 2));
  assert.equal(errs[0].rule, "permanent-will-change");
  assert.match(errs[0].message, /\.sp-panel/);
  assert.deepEqual(
    rules(findings.filter((f) => f.severity === "warn")).sort(),
    ["backdrop-on-animated"],
  );
});
