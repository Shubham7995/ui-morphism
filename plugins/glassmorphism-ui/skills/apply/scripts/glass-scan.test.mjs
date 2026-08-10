/**
 * Tests for glass-scan.mjs.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/03-glassmorphism.md §13 — either the validation
 * checklist the skill must self-run, or the anti-pattern list it must refuse.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { scan } from "./glass-scan.mjs";

/** Convenience: scan one virtual file and return its findings. */
const one = (name, text) => scan([{ file: name, text }]).findings;

test("backdrop-filter without the -webkit- twin is an error", () => {
  const findings = one("a.css", `
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .p { border: 1px solid #fff; backdrop-filter: blur(12px) saturate(160%); }
}`);
  const hit = findings.find((f) => f.rule === "webkit-prefix");
  assert.ok(hit, "expected a webkit-prefix finding");
  assert.equal(hit.severity, "error");
  assert.equal(hit.line, 3);
});

const rules = (findings) => findings.map((f) => f.rule);
const errorsOf = (findings) => findings.filter((f) => f.severity === "error");

/** A minimal well-formed sheet, used as the base for single-defect fixtures. */
const GOOD = `
.glass {
  border: 1px solid rgba(255,255,255,0.22);
  background-color: #1d2130;
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.38);
}
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass {
    background-color: rgba(255,255,255,0.10);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    backdrop-filter: blur(12px) saturate(160%);
  }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background-color: #1d2130; -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@media (prefers-contrast: more) {
  .glass { background-color: #171a24; -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@media (forced-colors: active) {
  .glass { background-color: Canvas; border: 1px solid CanvasText; -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@media (prefers-reduced-motion: reduce) {
  .glass { transition-duration: 1ms; }
}
@media print {
  .glass { background-color: #ffffff; -webkit-backdrop-filter: none; backdrop-filter: none; }
}
[data-transparency="reduced"] .glass { -webkit-backdrop-filter: none; backdrop-filter: none; }
/* feTurbulence baseFrequency 0.8 numOctaves 4 */
`;

test("a sheet with all four escape hatches produces no errors", () => {
  assert.deepEqual(errorsOf(one("clean.css", GOOD)), []);
});

test("translucent branch outside @supports is an error", () => {
  const findings = one("b.css", `
.p {
  border: 1px solid #fff;
  background-color: rgba(255,255,255,0.10);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  backdrop-filter: blur(12px) saturate(160%);
}`);
  assert.ok(rules(findings).includes("supports-fallback"));
});

test("an @supports condition is not a declaration needing a prefix twin", () => {
  const findings = one("c.css", `
@supports (backdrop-filter: blur(1px)) {
  .p { border: 1px solid #fff; }
}`);
  assert.equal(rules(findings).filter((r) => r === "webkit-prefix").length, 0);
});

test("transition naming backdrop-filter is an error; transition: all is a warning", () => {
  const findings = one("d.css", `
.p:hover { transition: backdrop-filter 260ms ease; }
.q:hover { transition: all 200ms ease; }
`);
  const bad = findings.filter((f) => f.rule === "animated-backdrop");
  assert.equal(bad.length, 2);
  assert.equal(bad.find((f) => f.line === 2).severity, "error");
  assert.equal(bad.find((f) => f.line === 3).severity, "warn");
});

test("keyframes interpolating a blur is an error", () => {
  const findings = one("e.css", `
@keyframes wake {
  from { backdrop-filter: blur(0px); }
  to   { backdrop-filter: blur(20px); }
}`);
  assert.equal(findings.filter((f) => f.rule === "animated-backdrop" && f.severity === "error").length, 2);
});

test("will-change: backdrop-filter is the anti-pattern-13 error", () => {
  const hit = one("f.css", `.p { will-change: backdrop-filter; }`).find((f) => f.rule === "will-change-fix");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("opacity below 1 on a normal selector is a backdrop-root warning", () => {
  const hit = one("g.css", `.wrap { opacity: 0.5; }`).find((f) => f.rule === "backdrop-root");
  assert.ok(hit);
  assert.equal(hit.severity, "warn");
});

test("opacity: 1 and mix-blend-mode: normal are not hazards", () => {
  const findings = one("h.css", `.wrap { opacity: 1; mix-blend-mode: normal; }`);
  assert.equal(rules(findings).filter((r) => r === "backdrop-root").length, 0);
});

test("a hazard on a pseudo-element is info, not warn — it cannot be an ancestor", () => {
  const hits = one("i.css", `.glass::after { filter: url(#glass-grain); opacity: 0.035; }`)
    .filter((f) => f.rule === "backdrop-root");
  assert.equal(hits.length, 2);
  assert.ok(hits.every((f) => f.severity === "info"));
});

test("raster grain next to a glass rule is an error", () => {
  const findings = one("j.css", `
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .p {
    border: 1px solid #fff;
    background-image: url("/img/noise.png");
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    backdrop-filter: blur(12px) saturate(160%);
  }
}`);
  assert.ok(findings.some((f) => f.rule === "raster-grain" && f.severity === "error"));
});

test("a live blur left inside forced-colors: active is an error", () => {
  const findings = one("k.css", `
@media (forced-colors: active) {
  .p { -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
}`);
  assert.ok(findings.some((f) => f.rule === "forced-colors-blur" && f.severity === "error"));
});

test("blur above the 48px knob maximum is an error", () => {
  const findings = one("l.css", GOOD.replace(/blur\(12px\)/g, "blur(64px)"));
  assert.ok(findings.some((f) => f.rule === "blur-max" && f.severity === "error"));
});

test("blur above 20px on a scroll-pinned surface is an error, independent of intensity", () => {
  const findings = one("m.css", `
.nav { position: sticky; border: 1px solid #fff; background-color: #1d2130; }
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .nav {
    position: sticky;
    -webkit-backdrop-filter: blur(40px) saturate(160%);
    backdrop-filter: blur(40px) saturate(160%);
  }
}`);
  assert.ok(findings.some((f) => f.rule === "blur-cap-pinned" && f.severity === "error"));
});

test("blur without saturate is a warning", () => {
  const findings = one("n.css", GOOD.replace(/ saturate\(160%\)/g, ""));
  assert.ok(findings.some((f) => f.rule === "saturate-missing" && f.severity === "warn"));
});

test("a glass rule inherits its border from the base rule sharing its root class", () => {
  const findings = one("o.css", `
.glass { border: 1px solid rgba(255,255,255,0.22); background-color: #1d2130; }
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass--2 {
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    backdrop-filter: blur(20px) saturate(160%);
  }
}`);
  assert.equal(rules(findings).filter((r) => r === "border-missing").length, 0);
});

test("a borderless glass surface with no base rule is a warning", () => {
  const findings = one("p.css", `
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .lonely {
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    backdrop-filter: blur(20px) saturate(160%);
  }
}`);
  assert.ok(findings.some((f) => f.rule === "border-missing" && f.severity === "warn"));
});

test("each missing accessibility escape hatch is a project-level error", () => {
  const findings = one("q.css", `
.p { border: 1px solid #fff; background-color: #1d2130; }
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .p { -webkit-backdrop-filter: blur(12px) saturate(160%); backdrop-filter: blur(12px) saturate(160%); }
}`);
  const missing = findings.filter((f) => f.rule === "a11y-blocks");
  assert.equal(missing.length, 4);
  assert.ok(missing.every((f) => f.severity === "error" && f.file === "(project)"));
});

test("no glass in the project means no project-level findings at all", () => {
  const findings = one("r.css", `.card { background: #fff; border: 1px solid #ddd; }`);
  assert.deepEqual(findings.filter((f) => f.file === "(project)"), []);
});

test("missing print sheet and missing transparency toggle are warnings", () => {
  const findings = one("s.css", GOOD
    .replace(/@media print \{[\s\S]*?\n\}/, "")
    .replace(/\[data-transparency="reduced"\][^\n]*\n/, ""));
  assert.ok(findings.some((f) => f.rule === "print-opaque" && f.severity === "warn"));
  assert.ok(findings.some((f) => f.rule === "transparency-toggle" && f.severity === "warn"));
});

test("the a11y layer may live in a separate file from the glass rules", () => {
  const { findings } = scan([
    { file: "glass.css", text: `
.p { border: 1px solid #fff; background-color: #1d2130; }
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .p { -webkit-backdrop-filter: blur(12px) saturate(160%); backdrop-filter: blur(12px) saturate(160%); }
}` },
    { file: "glass.layer.css", text: GOOD.slice(GOOD.indexOf("@media (prefers-reduced-transparency")) },
  ]);
  assert.equal(findings.filter((f) => f.rule === "a11y-blocks").length, 0);
});

test("CSS held in a JS template literal is parsed like a stylesheet", () => {
  const findings = one("GlassSurface.tsx", `
const CSS = \`
.gs{position:relative;background-color:#1d2130;border:1px solid rgba(255,255,255,.22);}
@supports ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
  .gs{backdrop-filter:blur(12px) saturate(160%);}
}
\`;
`);
  assert.ok(findings.some((f) => f.rule === "webkit-prefix" && f.severity === "error"));
});

test("a url() containing a brace cannot desynchronise the parser", () => {
  const findings = one("t.css", `.a { background: url("x{y.png"); } .b { opacity: 0.4; }`);
  assert.ok(findings.some((f) => f.rule === "backdrop-root" && f.line === 1));
});

test("summary reports the surface census and the maximum literal blur", () => {
  const { summary } = scan([{ file: "u.css", text: GOOD }]);
  assert.equal(summary.glassSurfaces, 1);
  assert.equal(summary.maxBlurPx, 12);
  assert.deepEqual(summary.a11yQueriesFound, [
    "forced-colors", "prefers-contrast", "prefers-reduced-motion",
    "prefers-reduced-transparency", "print",
  ]);
});

test("a feTurbulence mention inside a comment does not satisfy the grain check", () => {
  // GOOD names the filter only in a trailing comment. Documentation is not an
  // implementation, so the project-level grain note must still be raised.
  const findings = one("comment-grain.css", GOOD);
  assert.ok(findings.some((f) => f.rule === "raster-grain" && f.severity === "info"));
});

test("a data-transparency mention inside a comment does not satisfy the toggle check", () => {
  const findings = one("comment-toggle.css", GOOD
    .replace(/\[data-transparency="reduced"\][^\n]*\n/, "/* honours data-transparency elsewhere */\n"));
  assert.ok(findings.some((f) => f.rule === "transparency-toggle" && f.severity === "warn"));
});

test("a real feTurbulence filter in markup does satisfy the grain check", () => {
  const findings = one("page.html", GOOD +
    `\n<svg width="0" height="0" aria-hidden="true"><filter id="glass-grain">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" /></filter></svg>\n`);
  assert.equal(findings.filter((f) => f.rule === "raster-grain").length, 0);
});

test("the doc's own §5 reference stylesheet passes with zero errors", async () => {
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const here = dirname(fileURLToPath(import.meta.url));
  const doc = readFileSync(join(here, "../../../../../docs/03-glassmorphism.md"), "utf8");
  const lines = doc.split("\n");
  const html = lines.slice(279, 294).join("\n");   // §5 markup block
  const css = lines.slice(297, 454).join("\n");    // §5 stylesheet block
  const { findings, summary } = scan([{ file: "doc-recipe.css", text: css + "\n" + html }]);
  assert.deepEqual(errorsOf(findings), [], JSON.stringify(findings, null, 2));
  assert.ok(summary.glassSurfaces >= 3, `expected the ladder rungs, got ${summary.glassSurfaces}`);
});
