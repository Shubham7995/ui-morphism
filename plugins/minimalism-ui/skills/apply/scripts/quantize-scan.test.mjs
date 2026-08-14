/**
 * Tests for quantize-scan.mjs.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/05-minimalism.md — §13's nine transformations,
 * its self-run validation checklist and its anti-pattern list, plus the ramps in
 * §4 and the elevation, motion and accessibility statements in §3, §6 and §7.
 *
 * No case asserts anything about contrast, luminance or alpha compositing. Those
 * verdicts are ui-morphism-core:a11y-validate's, and this module does not compute
 * them.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  scan,
  parse,
  snap,
  toPx,
  toMs,
  rgbOf,
  hueSector,
  alphaOf,
  report,
  SPACE_RAMP,
  RADIUS_RAMP,
  TYPE_RAMP,
  DURATION_RAMP,
  WEIGHT_RAMP,
  TARGET_MIN,
  HUE_MAX,
  NEUTRAL_STEP_MAX,
} from "./quantize-scan.mjs";

/** Convenience: scan one virtual file and return its findings. */
const one = (name, text, options) => scan([{ file: name, text }], options).findings;
const kinds = (findings) => findings.map((f) => f.kind);
const messages = (findings) => findings.map((f) => f.message).join("\n");
const errorsOf = (findings) => findings.filter((f) => f.severity === "error");
const find = (findings, needle) => findings.find((f) => f.message.includes(needle));

/* ------------------------------------------------------------------ ramps */

test("the ramps are the ones doc §4 declares", () => {
  assert.deepEqual(SPACE_RAMP, [4, 8, 12, 16, 24, 32, 48, 64, 96]);
  assert.deepEqual(RADIUS_RAMP, [4, 8, 12, 9999]);
  assert.deepEqual(TYPE_RAMP, [12, 14, 16, 18, 20, 24, 30, 36, 48]);
  assert.deepEqual(DURATION_RAMP, [100, 150, 200, 300]);
  assert.deepEqual(WEIGHT_RAMP, [400, 500, 600]);
  assert.equal(TARGET_MIN, 24);
  assert.equal(HUE_MAX, 2);
  assert.equal(NEUTRAL_STEP_MAX, 11);
});

test("snap puts an off-ramp padding on the nearest 4px rung", () => {
  assert.equal(snap(15, SPACE_RAMP), 16);
  assert.equal(snap(13, SPACE_RAMP), 12);
  assert.equal(snap(1, SPACE_RAMP), 4);
  assert.equal(snap(1000, SPACE_RAMP), 96);
});

test("snap is total and breaks ties toward the smaller rung", () => {
  assert.equal(snap(6, SPACE_RAMP), 4);
  assert.equal(snap(10, SPACE_RAMP), 8);
  assert.equal(snap(6, RADIUS_RAMP), 4);
});

test("snap is stable — quantising a ramp value returns it unchanged", () => {
  for (const v of SPACE_RAMP) assert.equal(snap(v, SPACE_RAMP), v);
  for (const v of TYPE_RAMP) assert.equal(snap(v, TYPE_RAMP), v);
  for (const v of DURATION_RAMP) assert.equal(snap(v, DURATION_RAMP), v);
});

test("toPx reads px, rem and a bare zero, and refuses everything else", () => {
  assert.equal(toPx("16px"), 16);
  assert.equal(toPx("1rem"), 16);
  assert.equal(toPx("0.875rem"), 14);
  assert.equal(toPx("0"), 0);
  assert.equal(toPx("65ch"), null);
  assert.equal(toPx("var(--min-space-4)"), null);
  assert.equal(toPx("auto"), null);
});

test("toMs reads ms and s", () => {
  assert.equal(toMs("150ms"), 150);
  assert.equal(toMs("0.4s"), 400);
  assert.equal(toMs("ease-out"), null);
});

/* --------------------------------------------------------------- notation */

test("rgbOf reads the notations a stylesheet actually uses", () => {
  assert.deepEqual(rgbOf("#737373"), [115, 115, 115]);
  assert.deepEqual(rgbOf("#FFF"), [255, 255, 255]);
  assert.deepEqual(rgbOf("rgb(37 99 235)"), [37, 99, 235]);
  assert.deepEqual(rgbOf("rgba(0,0,0,0.04)"), [0, 0, 0]);
  assert.equal(rgbOf("currentColor"), null);
});

test("hueSector sorts the §4 neutral ramp as neutral", () => {
  for (const grey of ["#ffffff", "#fafafa", "#f5f5f5", "#f0f0f0", "#737373", "#525252", "#0a0a0a", "#161616"]) {
    assert.equal(hueSector(grey), "neutral", grey + " should sort as neutral");
  }
});

test("hueSector separates the accent from the danger hue", () => {
  const accent = hueSector("#2563eb");
  const danger = hueSector("#dc2626");
  assert.notEqual(accent, "neutral");
  assert.notEqual(danger, "neutral");
  assert.notEqual(accent, danger);
});

test("alphaOf reads a stated alpha and never composites one", () => {
  assert.equal(alphaOf("rgb(0 0 0 / 0.04)"), 0.04);
  assert.equal(alphaOf("rgba(0,0,0,0.4)"), 0.4);
  assert.equal(alphaOf("#0a0a0a"), 1);
  assert.equal(alphaOf("#0a0a0a80"), 128 / 255);
});

/* ---------------------------------------------------------------- parser */

test("the parser keeps declarations, selectors and line numbers", () => {
  const rules = parse("\n.a {\n  color: red;\n  padding: 15px;\n}\n");
  const rule = rules.find((r) => r.selector === ".a");
  assert.ok(rule);
  assert.equal(rule.decls.length, 2);
  assert.equal(rule.decls[1].prop, "padding");
  assert.equal(rule.decls[1].line, 4);
});

test("the parser survives a brace inside a quoted string", () => {
  const rules = parse('.a { background-image: url("x{y.png"); color: red; }');
  const rule = rules.find((r) => r.selector === ".a");
  assert.equal(rule.decls.length, 2);
});

test("the parser records the at-rule ancestry a nested rule sits under", () => {
  const rules = parse("@media (min-width: 40rem) { .dialog { box-shadow: 0 4px 12px rgba(0,0,0,0.06); } }");
  const rule = rules.find((r) => r.selector === ".dialog");
  assert.ok(rule.ancestors.some((a) => a.startsWith("@media")));
});

test("the parser reads CSS out of a JS template literal", () => {
  const rules = parse("const css = `\n.card { padding: 15px; }\n`;");
  const rule = rules.find((r) => r.selector === ".card");
  assert.ok(rule, "expected the template-literal rule to be parsed");
  assert.equal(rule.decls[0].prop, "padding");
});

/* -------------------------------------------------------------- quantise */

test("§13 step 4: an off-ramp padding is quantised, with the token named", () => {
  const findings = one("a.css", ".card { padding: 15px; }");
  const hit = find(findings, "off the 4px ramp");
  assert.ok(hit);
  assert.equal(hit.kind, "quantise");
  assert.equal(hit.severity, "warn");
  assert.equal(hit.fix, "16px (--min-space-4)");
});

test("§13 step 4: a value already on the ramp produces nothing", () => {
  assert.deepEqual(one("a.css", ".card { padding: 24px; gap: 8px; }"), []);
});

test("§13 step 3: radius snaps to 4 / 8 / 12 / 9999", () => {
  const findings = one("a.css", ".card { border-radius: 10px; }");
  const hit = find(findings, "not one of 4 / 8 / 12 / 9999px");
  assert.ok(hit);
  assert.equal(hit.fix, "12px");
});

test("§13 step 5: font-size snaps onto the nine-step 1.200 ramp", () => {
  const findings = one("a.css", ".t { font-size: 15px; }");
  const hit = find(findings, "off the nine-step 1.200 ramp");
  assert.ok(hit);
  assert.equal(hit.fix, "1rem");
});

test("§13 checklist item 9: body-grade px type is flagged for restoration as rem", () => {
  const hit = find(one("a.css", ".t { font-size: 14px; }"), "does not respond to the user's text size");
  assert.ok(hit);
  assert.equal(hit.kind, "restore");
  assert.equal(hit.fix, "0.875rem");
});

test("§4: no weight above 600 survives, and off-ramp weights quantise", () => {
  const heavy = find(one("a.css", "h1 { font-weight: 800; }"), "above this style's 600 ceiling");
  assert.ok(heavy);
  assert.equal(heavy.kind, "subtract");
  assert.equal(heavy.severity, "error");
  const off = find(one("a.css", ".x { font-weight: 450; }"), "off the 400 / 500 / 600 ramp");
  assert.ok(off);
  assert.equal(off.fix, "400");
});

test("§13 step 8: durations quantise onto 100 / 150 / 200 / 300ms", () => {
  const hit = find(one("a.css", ".b { transition: 220ms; }"), "off the 100 / 150 / 200 / 300ms ramp");
  assert.ok(hit);
  assert.equal(hit.fix, "200ms");
});

test("§4: a duration above 300ms is an error, not a rounding", () => {
  const hit = find(one("a.css", ".b { transition-duration: 0.6s; }"), "above the 300ms ceiling");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.equal(hit.kind, "subtract");
});

test("§6: a spring or overshoot easing is off-style", () => {
  const hit = find(one("a.css", ".b { transition-timing-function: cubic-bezier(0.34, -1.56, 0.64, 1); }"), "overshoot easing");
  assert.ok(hit);
  assert.equal(hit.kind, "subtract");
});

/* -------------------------------------------------------------- subtract */

test("§13 step 6 and §4: backdrop-filter is refused and handed to glassmorphism-ui", () => {
  const findings = one("a.css", ".nav { backdrop-filter: blur(12px); }");
  const hit = find(findings, "backdrop-filter on a base-layer surface");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.message, /glassmorphism-ui/);
});

test("§13 step 6: blur, drop-shadow, text-shadow and mix-blend-mode are removed", () => {
  const findings = one(
    "a.css",
    ".a { filter: blur(4px); } .b { text-shadow: 0 1px 0 #000; } .c { mix-blend-mode: multiply; }",
  );
  assert.equal(errorsOf(findings).length, 3);
  assert.equal(new Set(kinds(findings)).size, 1);
  assert.equal(kinds(findings)[0], "subtract");
});

test("§13 step 6: a multi-stop gradient on a non-overlay surface is an error", () => {
  const hit = find(
    one("a.css", ".hero { background: linear-gradient(#fff, #eee, #ddd); }"),
    "gradient on a non-overlay surface",
  );
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("§3: a genuine overlay keeps its gradient and its second elevation rung", () => {
  const findings = one(
    "a.css",
    ".dialog { background: linear-gradient(#fff, #eee, #ddd); box-shadow: 0 8px 24px rgba(0,0,0,0.5); }",
    { decorationBudget: 2 },
  );
  assert.deepEqual(findings, [], messages(findings));
});

test("§3: three shadow layers exceed the two-step ceiling", () => {
  const hit = find(
    one("a.css", ".c { box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.04); }"),
    "shadow layers",
  );
  assert.ok(hit);
  assert.equal(hit.fix, "--min-shadow-1");
});

test("§3: a resting shadow over 8px blur or 8% opacity is reported", () => {
  const findings = one("a.css", ".c { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }");
  assert.ok(find(findings, "blur on a resting surface"));
  assert.ok(find(findings, "under 8% opacity"));
});

test("the resolved decorationBudget decides whether an ordinary card may be raised at all", () => {
  const raised = "0 1px 2px rgba(0,0,0,0.04)";
  assert.equal(
    find(one("a.css", ".c { box-shadow: " + raised + "; }", { decorationBudget: 1 }), "decorationBudget"),
    undefined,
  );
  const hit = find(one("a.css", ".c { box-shadow: " + raised + "; }", { decorationBudget: 0 }), "decorationBudget");
  assert.ok(hit);
  assert.match(hit.fix, /--min-border-subtle/);
});

test("§8: an icon font is refused", () => {
  const hit = find(one("a.css", ".i { font-family: FontAwesome, sans-serif; }"), "icon font");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
});

test("§13 anti-patterns: an infinite animation is reported", () => {
  const hit = find(one("a.css", ".shimmer { animation: pulse 2s linear infinite; }"), "infinite animation");
  assert.ok(hit);
  assert.equal(hit.kind, "subtract");
});

/* --------------------------------------------------------------- restore */

test("§13 step 7: outline: none with no replacement is an error", () => {
  const hit = find(one("a.css", ".btn:focus { outline: none; }"), "outline: none with no replacement");
  assert.ok(hit);
  assert.equal(hit.kind, "restore");
  assert.equal(hit.severity, "error");
  assert.match(hit.fix, /--min-focus-ring/);
});

test("§13 step 7: outline: none WITH a replacement in the same rule is accepted", () => {
  const findings = one(
    "a.css",
    ".btn:focus-visible { outline: none; outline: 2px solid var(--min-focus-ring); outline-offset: 2px; }",
  );
  assert.deepEqual(findings, [], messages(findings));
});

test("§13 step 7: a ghost primary button is converted to a filled one", () => {
  const hit = find(
    one("a.css", ".btn-primary { background: transparent; border: 1px solid transparent; }"),
    "ghost primary action",
  );
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.fix, /--min-accent/);
});

test("§10: an outline-only primary is reported separately from a fully ghost one", () => {
  const hit = find(
    one("a.css", ".cta.button { background-color: transparent; border: 1px solid #8f8f8f; }"),
    "outline-only primary action",
  );
  assert.ok(hit);
  assert.equal(hit.kind, "restore");
});

test("a filled primary button produces no restoration finding", () => {
  const findings = one(
    "a.css",
    ".btn-primary { background: var(--min-accent); border: 1px solid var(--min-accent); }",
  );
  assert.deepEqual(findings, [], messages(findings));
});

test("§13 step 7: a link stripped of its underline is restored", () => {
  const hit = find(one("a.css", "a.link { text-decoration: none; }"), "link underline removed");
  assert.ok(hit);
  assert.equal(hit.kind, "restore");
});

test("§7: a control under the 24px SC 2.5.8 floor is sized up from the token", () => {
  const hit = find(one("a.css", ".icon-button { width: 16px; height: 16px; }"), "SC 2.5.8 floor");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.match(hit.fix, /--min-target-min/);
  assert.match(hit.fix, /--min-control-lg/);
});

test("§7: the floor is a floor — a 24px control passes and a 40px control passes", () => {
  assert.deepEqual(one("a.css", ".btn { min-width: 24px; }"), []);
  assert.deepEqual(one("a.css", ".btn { min-height: 40px; }"), []);
});

test("§7 and SC 1.4.12: a fixed height or overflow: hidden on text is reported", () => {
  assert.ok(find(one("a.css", ".label { height: 20px; }"), "fixed height on a text-bearing container"));
  assert.ok(find(one("a.css", ".help-text { overflow: hidden; }"), "overflow: hidden on a text container"));
});

test("§13 checklist item 9: a px prose measure is replaced with the ch measure", () => {
  const hit = find(one("a.css", ".prose { max-width: 640px; }"), "prose measure in px");
  assert.ok(hit);
  assert.match(hit.fix, /--min-measure/);
});

/* ---------------------------------------------------------------- census */

test("§13 checklist item 2: more than two chromatic hues is an error", () => {
  const findings = one("a.css", ":root { --a: #2563eb; --b: #dc2626; --c: #16a34a; --d: #f0f0f0; }");
  const hit = find(findings, "coarse hue families");
  assert.ok(hit);
  assert.equal(hit.severity, "error");
  assert.equal(hit.selector, "<palette census>");
});

test("§13 checklist item 2: one accent plus one danger passes the census", () => {
  const findings = one("a.css", ":root { --a: #2563eb; --b: #dc2626; --c: #737373; }");
  assert.equal(find(findings, "coarse hue families"), undefined);
});

test("the neutral-step ceiling is reported once the ramp is over eleven literals", () => {
  const greys = ["#ffffff", "#fafafa", "#f5f5f5", "#f0f0f0", "#ebebeb", "#e5e5e5",
    "#a3a3a3", "#8f8f8f", "#737373", "#525252", "#262626", "#161616", "#0a0a0a"];
  const css = ":root {" + greys.map((g, i) => "--g" + i + ": " + g + ";").join("") + "}";
  const hit = find(one("a.css", css), "distinct neutral literals");
  assert.ok(hit);
  assert.equal(hit.kind, "subtract");
});

/* --------------------------------------------------------------- summary */

test("the summary carries the counts reports/minimalism-diff-summary.md needs", () => {
  const { summary } = scan([
    { file: "a.css", text: ".a { padding: 15px; font-size: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); color: #2563eb; }" },
    { file: "b.css", text: ".b { padding: 24px; border-radius: 10px; transition: 220ms; }" },
  ]);
  assert.equal(summary.files, 2);
  assert.equal(summary.shadowDeclarations, 1);
  assert.equal(summary.spacingValues.found, 2);
  assert.equal(summary.spacingValues.target, 9);
  assert.equal(summary.fontSizes.found, 1);
  assert.equal(summary.fontSizes.target, 9);
  assert.equal(summary.radiusValues.found, 1);
  assert.equal(summary.radiusValues.target, 4);
  assert.equal(summary.durationValues.found, 1);
  assert.equal(summary.durationValues.target, 4);
  assert.equal(summary.colourLiterals, 2);
  assert.equal(
    summary.counts.quantise + summary.counts.subtract + summary.counts.restore,
    summary.counts.error + summary.counts.warn,
  );
});

test("the default decorationBudget is the one intensity 60 resolves to", () => {
  assert.equal(scan([]).summary.decorationBudget, 1);
});

test("scanning nothing finds nothing and still reports the ramps", () => {
  const result = scan([]);
  assert.deepEqual(result.findings, []);
  assert.equal(result.summary.counts.error, 0);
  assert.match(report(result, true), /font sizes 0 -> 9/);
});

test("the report says out loud that it computes no accessibility verdict", () => {
  const text = report(scan([]), true);
  assert.match(text, /ui-morphism-core:a11y-validate/);
  assert.match(text, /computes none of them/);
});

/* ------------------------------------------------------- the whole style */

test("a sheet written in the style's own tokens produces no finding at all", () => {
  const findings = one(
    "clean.css",
    `
.min-card {
  background: var(--min-surface-1);
  border: var(--min-border-width) solid var(--min-border-subtle);
  border-radius: var(--min-radius-lg);
  padding: var(--min-space-6);
  box-shadow: var(--min-shadow-0);
}
.min-btn {
  min-height: var(--min-control-lg);
  min-width: var(--min-target-min);
  padding-inline: var(--min-space-4);
  border-radius: var(--min-radius-md);
  font-size: var(--min-text-sm);
  font-weight: var(--min-weight-medium);
  transition: background-color var(--min-dur-fast) var(--min-ease-standard);
}
.min-btn--primary {
  background: var(--min-accent);
  color: var(--min-accent-fg);
  border-color: var(--min-accent);
}
:where(a, button, input):focus-visible {
  outline: var(--min-focus-ring-width) solid var(--min-focus-ring);
  outline-offset: var(--min-focus-ring-offset);
}
`,
  );
  assert.deepEqual(findings, [], messages(findings));
});
