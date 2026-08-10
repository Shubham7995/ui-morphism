import test from "node:test";
import assert from "node:assert/strict";

import { plan } from "./assign-spans.mjs";

/** The canonical six-tile composition from docs/09-bento-grid.md §5. */
const CANONICAL = {
  intensity: 45,
  items: [
    { id: "perf", type: "screenshot", aspect: 1.71, words: 12, primary: true, links: 0 },
    { id: "uptime", type: "stat", words: 1, links: 0 },
    { id: "regions", type: "stat", words: 1, links: 0 },
    { id: "observability", type: "screenshot", aspect: 0.77, words: 4, links: 1 },
    { id: "integrations", type: "paragraph", words: 26, links: 0 },
    { id: "team", type: "screenshot", aspect: 1.33, words: 6, links: 0, cover: true },
  ],
};

test("plan() rejects an empty item list", () => {
  assert.throws(() => plan({ items: [] }), /non-empty/);
});

test("intensity 45 resolves to every knob default in doc §13", () => {
  assert.deepEqual(plan(CANONICAL).knobs, {
    spanVariance: 2,
    radius: 24,
    surfaceDelta: 8,
    mediaBleed: 40,
    motion: 45,
  });
});

test("every knob is monotone and clamped across the 0-100 sweep", () => {
  const at = (i) => plan({ ...CANONICAL, intensity: i }).knobs;
  assert.deepEqual(at(0), { spanVariance: 1, radius: 0, surfaceDelta: 0, mediaBleed: 0, motion: 0 });
  assert.deepEqual(at(100), { spanVariance: 3, radius: 32, surfaceDelta: 24, mediaBleed: 100, motion: 100 });
  assert.deepEqual(at(-40), at(0), "intensity below 0 clamps to 0");
  assert.deepEqual(at(140), at(100), "intensity above 100 clamps to 100");

  let prev = at(0);
  for (let i = 1; i <= 100; i += 1) {
    const k = at(i);
    for (const knob of Object.keys(k)) {
      assert.ok(k[knob] >= prev[knob], `${knob} reversed between intensity ${i - 1} and ${i}`);
      assert.equal(k[knob], Number(k[knob].toFixed(2)), `${knob} at intensity ${i} is not a settled value`);
    }
    prev = k;
  }
});

test("context caps override the requested intensity and are reported", () => {
  const comparable = plan({ ...CANONICAL, intensity: 100, contentShape: "comparable" });
  assert.equal(comparable.intensity.requested, 100);
  assert.equal(comparable.intensity.effective, 0);
  assert.match(comparable.intensity.caps[0].rule, /comparable/);

  assert.equal(plan({ ...CANONICAL, intensity: 90, tileSource: "cms" }).intensity.effective, 25);
  assert.equal(plan({ ...CANONICAL, intensity: 100, items: CANONICAL.items.slice(0, 3) }).intensity.effective, 0);
  assert.equal(
    plan({
      ...CANONICAL,
      intensity: 100,
      items: Array.from({ length: 11 }, (_, i) => ({ id: `t${i}`, type: "stat", words: 1, links: 0 })),
    }).intensity.effective,
    45
  );
  assert.equal(plan(CANONICAL).intensity.caps.length, 0, "the canonical section trips no cap");
});

test("content type and weight map onto the closed five-span vocabulary", () => {
  const spans = Object.fromEntries(plan(CANONICAL).tiles.map((t) => [t.id, t.span]));
  assert.deepEqual(spans, {
    perf: "hero",
    uptime: "unit",
    regions: "unit",
    observability: "tall",
    integrations: "wide",
    team: "unit",
  });
});

test("intensity 0 is a usable uniform card grid, not nothing", () => {
  const zero = plan({ ...CANONICAL, intensity: 0 });
  assert.equal(zero.band, "uniform");
  assert.equal(new Set(zero.tiles.map((t) => t.span)).size, 1, "intensity 0 emitted more than one span");
  assert.equal(zero.tiles.filter((t) => t.span === "hero").length, 0, "uniform grids have no dominant tile");
});

test("the mild band demotes the dominant tile and drops the two-row spans", () => {
  const mild = plan({ ...CANONICAL, intensity: 20 });
  assert.equal(mild.band, "mild");
  assert.equal(mild.tiles.find((t) => t.id === "perf").span, "wide", "the dominant tile is a wide, not a hero");
  assert.equal(mild.tiles.filter((t) => t.span === "hero" || t.span === "tall").length, 0);
  assert.match(mild.tiles.find((t) => t.id === "observability").rationale, /nearest span this band permits/);
});

test("placement lays single-row tiles left to right and wraps at the column count", () => {
  const { tiles } = plan({
    intensity: 0,
    items: Array.from({ length: 5 }, (_, i) => ({ id: `s${i}`, type: "stat", words: 1 })),
  });
  assert.deepEqual(
    tiles.map((t) => [t.row, t.col, t.colSpan, t.rowSpan]),
    [
      [0, 0, 3, 1],
      [0, 3, 3, 1],
      [0, 6, 3, 1],
      [0, 9, 3, 1],
      [1, 0, 3, 1],
    ]
  );
});

test("a two-row tile blocks the cells beneath it, and later tiles flow around", () => {
  const { tiles } = plan(CANONICAL);
  assert.deepEqual(
    tiles.map((t) => [t.row, t.col, t.colSpan, t.rowSpan]),
    [
      [0, 0, 6, 2], // hero occupies rows 0-1, columns 0-5
      [0, 6, 3, 1],
      [0, 9, 3, 1],
      [1, 6, 3, 2], // tall skips the hero's second row and takes rows 1-2
      [2, 0, 6, 1], // wide drops to row 2, where the hero has ended
      [2, 9, 3, 1], // and the last unit fits beside the tall
    ]
  );
});

test("the grid reports its row count and its empty cells, and never reorders", () => {
  const { grid, tiles } = plan(CANONICAL);
  assert.deepEqual(
    tiles.map((t) => t.id),
    CANONICAL.items.map((i) => i.id),
    "the planner reordered tiles; DOM order is reading order"
  );
  assert.equal(grid.rows, 3);
  assert.equal(grid.holes, 3, "row 1 columns 9-11 are left empty by this composition");
  assert.equal(grid.gridAutoRows, "minmax(180px, auto)");
});

test("the dominant tile measures 30-40% of the section area at 1280px", () => {
  const { metrics, tiles } = plan(CANONICAL);
  const hero = tiles.find((t) => t.span === "hero");
  // 12 columns, 16px gutters, 1280px section: a column is 92px, so a span-6
  // tile is 632px wide and a span-2-row tile is 376px tall.
  assert.equal(metrics.colWidthPx, 92);
  assert.equal(hero.widthPx, 632);
  assert.equal(hero.heightPx, 376);
  assert.equal(metrics.sectionHeightPx, 572);
  assert.ok(
    metrics.heroAreaShare >= 0.3 && metrics.heroAreaShare <= 0.4,
    `dominant tile is ${(metrics.heroAreaShare * 100).toFixed(1)}% of the section, outside the 30-40% band in §3`
  );
  assert.equal(metrics.measuredAreaRatio, 4.29);
});

test("grid-template-areas is emitted for all three breakpoints, holes marked with a dot", () => {
  const { grid } = plan(CANONICAL);
  const p = "perf perf perf perf perf perf";
  const integrations = "integrations integrations integrations integrations integrations integrations";
  const obs = "observability observability observability";
  assert.deepEqual(
    grid.templateAreas.desktop.split("\n").map((r) => r.trim()),
    [
      `"${p} uptime uptime uptime regions regions regions"`,
      `"${p} ${obs} . . ."`,
      `"${integrations} ${obs} team team team"`,
    ]
  );
  assert.equal(grid.templateAreas.mobile.split("\n").length, CANONICAL.items.length);
  assert.match(grid.templateAreas.tablet, /perf/);
});

test("the planner rejects input the span vocabulary cannot express", () => {
  assert.throws(() => plan({ items: [{ id: "a", type: "carousel" }] }), /unknown type/);
  assert.throws(() => plan({ items: [{ type: "stat" }] }), /string id/);
  assert.throws(
    () =>
      plan({
        items: [
          { id: "a", type: "stat", primary: true },
          { id: "b", type: "stat", primary: true },
        ],
      }),
    /exactly one dominant tile/
  );
});

test("the motion knob resolves to a ladder that respects the 400ms reveal budget", () => {
  const ladder = (i) => plan({ ...CANONICAL, intensity: i }).motion;
  assert.deepEqual(ladder(0), { reveal: 0, stagger: 0, staggeredTiles: 0, lift: 0, mediaScale: 1, parallax: false });
  assert.deepEqual(ladder(45), { reveal: 320, stagger: 40, staggeredTiles: 2, lift: -2, mediaScale: 1, parallax: false });
  assert.deepEqual(ladder(60), { reveal: 320, stagger: 40, staggeredTiles: 2, lift: -2, mediaScale: 1.03, parallax: false });
  assert.deepEqual(ladder(100), { reveal: 400, stagger: 0, staggeredTiles: 0, lift: -4, mediaScale: 1.03, parallax: true });
  for (let i = 0; i <= 100; i += 1) {
    const m = ladder(i);
    assert.ok(m.reveal + m.stagger * m.staggeredTiles <= 400, `reveal sequence exceeds 400ms at intensity ${i}`);
  }
});

test("the canonical section passes every composition check the planner can decide", () => {
  const result = plan(CANONICAL);
  const byId = Object.fromEntries(result.checks.map((c) => [c.id, c.status]));
  assert.equal(byId["hero-count"], "pass");
  assert.equal(byId["distinct-spans"], "pass");
  assert.equal(byId["tile-count"], "pass");
  assert.equal(byId["one-link-per-tile"], "pass");
  assert.equal(byId["hero-area-share"], "pass");
  assert.equal(byId["uniform-is-not-bento"], "pass");
  assert.equal(byId.holes, "warn", "three empty cells are reported, not silently packed away");
  assert.equal(result.ok, true);
});
