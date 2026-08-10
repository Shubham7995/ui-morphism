#!/usr/bin/env node
/**
 * assign-spans.mjs — the bento composition planner.
 *
 * Source of truth: docs/09-bento-grid.md §4 (the span vocabulary and the token
 * values), §3 (one dominant tile at 30-40% of the section area), §7 (DOM order
 * is reading order), §9 (when the pattern does and does not apply) and §13 (the
 * intensity knobs, the self-run checklist and the anti-pattern list).
 *
 * SCOPE. This script decides layout arithmetic and nothing else:
 *
 *   - intensity 0-100 → the five knobs in §13, with the context caps applied
 *   - content type + content weight → the closed five-span vocabulary
 *   - sparse placement in DOM order, so the plan never reorders a tile
 *   - pixel geometry: column width, tile area, the dominant tile's share of
 *     the section, and the measured largest:smallest area ratio
 *   - grid-template-areas for desktop, tablet and mobile
 *   - the composition checks from §13 that are decidable from the plan alone
 *
 * It computes NO contrast, NO focus check, NO target size, NO forced-colors
 * audit and NO reduced-motion audit. Those are the nine universal checks and
 * they belong to ui-morphism-core:a11y-validate, which is the single
 * implementation for all ten style plugins. Do not add them here.
 *
 * Usage:
 *   node assign-spans.mjs <input.json> [--json] [--no-fail]
 *   node assign-spans.mjs --stdin [--json] [--no-fail]
 *
 * Input is the plan request: { items, intensity?, columns?, gap?, rowUnit?,
 * maxWidth?, contentShape?, tileSource?, hierarchyBreak? }. Each item is
 * { id, type, words?, aspect?, cover?, primary?, links? }.
 *
 * Exit code 1 when any check fails, 0 otherwise (suppressed by --no-fail).
 */

import { readFileSync } from "node:fs";

const DEFAULT_INTENSITY = 45;

function segment(i, atZero, atDefault, atHundred) {
  return i <= DEFAULT_INTENSITY
    ? atZero + (atDefault - atZero) * (i / DEFAULT_INTENSITY)
    : atDefault + (atHundred - atDefault) * ((i - DEFAULT_INTENSITY) / (100 - DEFAULT_INTENSITY));
}

/* Span vocabulary — docs/09-bento-grid.md §4, "Span vocabulary" table.
 * `desktop: null` means the full row (grid-column: 1 / -1). */
const SPANS = {
  hero: { desktop: 6, tablet: 6, rows: 2, pad: "--bento-pad-lg" },
  wide: { desktop: 6, tablet: 6, rows: 1, pad: "--bento-pad-md" },
  tall: { desktop: 3, tablet: 3, rows: 2, pad: "--bento-pad-md" },
  unit: { desktop: 3, tablet: 3, rows: 1, pad: "--bento-pad-sm" },
  strip: { desktop: null, tablet: null, rows: 1, pad: "--bento-pad-md" },
};

/* Content type → natural span. docs/09-bento-grid.md §13 step 2: "stats become
 * unit; vertical screenshots become tall; horizontal ones become wide; CTAs
 * become strip". */
const ITEM_TYPES = ["stat", "screenshot", "chart", "quote", "paragraph", "icon-text", "cta", "logos"];

function naturalSpan(item) {
  switch (item.type) {
    case "stat":
    case "icon-text":
      return "unit";
    case "cta":
    case "logos":
      return "strip";
    case "screenshot":
    case "chart":
      // A cover image is the tile's background rather than inset media, so it
      // carries at most a heading and stays a small image tile (§5).
      if (item.cover === true) return "unit";
      return typeof item.aspect === "number" && item.aspect > 0 && item.aspect < 1 ? "tall" : "wide";
    case "quote":
    case "paragraph":
      return (item.words ?? 0) >= 24 ? "wide" : "unit";
    default:
      return "unit";
  }
}

/* The dominant tile: the item marked as the primary claim, else the heaviest
 * by body length with a bonus for carrying media (§13 step 2, §3). */
function heroIndex(items) {
  const flagged = items.findIndex((it) => it.primary === true);
  if (flagged >= 0) return flagged;
  let best = 0;
  let bestWeight = -Infinity;
  items.forEach((it, idx) => {
    const weight = (it.words ?? 0) + (it.type === "screenshot" || it.type === "chart" ? 6 : 0);
    if (weight > bestWeight) {
      bestWeight = weight;
      best = idx;
    }
  });
  return best;
}

/* Bands of the spanVariance knob. The knob's documented range (1.0 → 3.0,
 * default 2.0) is a *target* largest:smallest area ratio; the closed span
 * vocabulary quantises it, so the planner reports the ratio the emitted
 * composition actually measures alongside the requested one. Monotone: the
 * permitted set only ever grows with intensity. */
const BANDS = {
  uniform: { permit: ["unit", "wide"], hero: null },
  mild: { permit: ["wide", "unit", "strip"], hero: "wide" },
  canonical: { permit: ["hero", "wide", "tall", "unit", "strip"], hero: "hero" },
  emphatic: { permit: ["hero", "wide", "tall", "unit", "strip"], hero: "hero" },
};

function bandFor(spanVariance) {
  if (spanVariance < 1.25) return "uniform";
  if (spanVariance < 1.75) return "mild";
  if (spanVariance < 2.5) return "canonical";
  return "emphatic";
}

/** Snap a span onto the band's permitted set, preferring the next size down. */
const SPAN_ORDER = ["unit", "tall", "wide", "hero", "strip"];

function permit(span, permitted) {
  if (permitted.includes(span)) return span;
  const from = SPAN_ORDER.indexOf(span);
  for (let d = 1; d < SPAN_ORDER.length; d += 1) {
    const down = SPAN_ORDER[from - d];
    if (down && permitted.includes(down)) return down;
    const up = SPAN_ORDER[from + d];
    if (up && permitted.includes(up)) return up;
  }
  return "unit";
}

function assignSpans(items, band = "canonical") {
  const cfg = BANDS[band];
  if (cfg.hero === null) {
    // A uniform grid: one span for every tile. Two-up for a short section,
    // four-up otherwise. This is a card grid and the report says so.
    const span = items.length <= 4 ? "wide" : "unit";
    return items.map((item) => ({
      ...item,
      span,
      rationale: "uniform grid: this intensity band emits one span for every tile",
    }));
  }
  const hIdx = heroIndex(items);
  return items.map((item, idx) => {
    if (idx === hIdx) {
      return {
        ...item,
        span: cfg.hero,
        rationale: item.primary === true ? "marked as the primary claim" : "heaviest item by body length and media weight",
      };
    }
    const natural = naturalSpan(item);
    const span = permit(natural, cfg.permit.filter((s) => s !== "hero"));
    return {
      ...item,
      span,
      rationale:
        span === natural
          ? `content type "${item.type}" maps to ${span}`
          : `content type "${item.type}" maps to ${natural}; ${span} is the nearest span this band permits`,
    };
  });
}

/* Placement — emulates the CSS sparse auto-placement algorithm, in DOM order,
 * with a cursor that never moves backwards. That is deliberate: DOM order is
 * reading order (§7, SC 1.3.2), so the planner never reorders tiles to close a
 * hole. */
function place(tiles, columns, key) {
  const grid = [];
  const ensure = (r) => {
    while (grid.length <= r) grid.push(new Array(columns).fill(null));
  };
  const isFree = (r, c, w, h) => {
    ensure(r + h - 1);
    for (let rr = r; rr < r + h; rr += 1) {
      for (let cc = c; cc < c + w; cc += 1) {
        if (grid[rr][cc] !== null) return false;
      }
    }
    return true;
  };

  let cursorRow = 0;
  let cursorCol = 0;

  const placed = tiles.map((tile) => {
    const declared = SPANS[tile.span][key];
    const w = declared === null ? columns : Math.min(declared, columns);
    const h = SPANS[tile.span].rows;

    let r = cursorRow;
    let c = cursorCol;
    while (c + w > columns || !isFree(r, c, w, h)) {
      if (c + w > columns) {
        r += 1;
        c = 0;
      } else {
        c += 1;
      }
    }

    ensure(r + h - 1);
    for (let rr = r; rr < r + h; rr += 1) {
      for (let cc = c; cc < c + w; cc += 1) grid[rr][cc] = tile.id;
    }
    cursorRow = r;
    cursorCol = c + w;

    return { ...tile, row: r, col: c, colSpan: w, rowSpan: h };
  });

  return { grid, placed };
}

/* Geometry — pixel areas at the section's max width, so the dominant tile's
 * share is measured the way §3 states it: a share of the section's area. */
function geometry(placed, rows, { columns, gap, rowUnit, maxWidth }) {
  const colWidth = (maxWidth - (columns - 1) * gap) / columns;
  const widthOf = (n) => n * colWidth + (n - 1) * gap;
  const heightOf = (n) => n * rowUnit + (n - 1) * gap;

  const sized = placed.map((t) => ({
    ...t,
    widthPx: Math.round(widthOf(t.colSpan)),
    heightPx: Math.round(heightOf(t.rowSpan)),
    areaPx: Math.round(widthOf(t.colSpan) * heightOf(t.rowSpan)),
  }));

  const sectionHeight = heightOf(rows);
  const sectionArea = maxWidth * sectionHeight;
  const areas = sized.map((t) => t.areaPx);
  const dominant = sized.find((t) => t.areaPx === Math.max(...areas));

  return {
    tiles: sized,
    metrics: {
      maxWidthPx: maxWidth,
      colWidthPx: Math.round(colWidth * 100) / 100,
      sectionHeightPx: sectionHeight,
      sectionAreaPx: sectionArea,
      measuredAreaRatio: Math.round((Math.max(...areas) / Math.min(...areas)) * 100) / 100,
      heroAreaShare: Math.round((dominant.areaPx / sectionArea) * 1000) / 1000,
    },
  };
}

/* Context caps — MARKETPLACE.md §7.2 rule 5. Every cap is grounded in
 * docs/09-bento-grid.md §9 or §13; a cap always beats the requested
 * intensity, and is always reported. */
function capsFor(input) {
  const caps = [];
  const n = input.items.length;

  if (input.contentShape === "comparable") {
    caps.push({
      cap: 0,
      rule: "contentShape: comparable",
      reason:
        "Strictly comparable items (pricing tiers, plan features, product variants) demand equal " +
        "visual weight; the moment one tile is larger, users read it as 'recommended'. §9.",
    });
  }
  if (n < 4) {
    caps.push({
      cap: 0,
      rule: `tileCount: ${n}`,
      reason: "Fewer than four items is a card row wearing a costume, not a bento. §9.",
    });
  }
  if (input.tileSource === "cms") {
    caps.push({
      cap: 25,
      rule: "tileSource: cms",
      reason:
        "A bento composition is hand-tuned. A source returning 4 items one day and 11 the next breaks " +
        "it, so the layout is held near-uniform, where a changing count degrades safely. §9.",
    });
  }
  if (n > 9) {
    caps.push({
      cap: 45,
      rule: `tileCount: ${n}`,
      reason:
        "More than nine tiles in one section needs a hierarchy break — a sub-heading or a second grid — " +
        "before size can encode importance. §13 anti-patterns.",
    });
  }
  return caps;
}

/* The motion knob resolves to a discrete ladder, because the reveal budget in
 * §4 — `--bento-dur-reveal` plus `--bento-stagger` × n, capped at 400ms total —
 * is a hard cap that does not scale with intensity. At a 400ms reveal there is
 * no stagger budget left, so the tiles arrive together. Every value here is a
 * §4 token or a §13 knob endpoint. */
function motionLadder(motion) {
  if (motion <= 0) {
    return { reveal: 0, stagger: 0, staggeredTiles: 0, lift: 0, mediaScale: 1, parallax: false };
  }
  const reveal = motion > 75 ? 400 : 320;
  const staggeredTiles = Math.floor((400 - reveal) / 40);
  return {
    reveal,
    stagger: staggeredTiles > 0 ? 40 : 0,
    staggeredTiles,
    lift: motion > 75 ? -4 : -2,
    mediaScale: motion > 50 ? 1.03 : 1,
    parallax: motion > 75,
  };
}

/** grid-area names must be CSS identifiers, so ids are normalised. */
function areaName(id) {
  const safe = String(id).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return /^[A-Za-z]/.test(safe) ? safe : `t-${safe}`;
}

/** Render an occupancy matrix as a grid-template-areas value. Holes are `.`. */
function toAreas(grid) {
  return grid
    .map((row) => `    "${row.map((cell) => (cell === null ? "." : areaName(cell))).join(" ")}"`)
    .join("\n");
}

/* Composition checks — docs/09-bento-grid.md §13 "Self-run validation
 * checklist", restricted to the items a layout planner can decide from the plan
 * object alone. Contrast, focus, target size, forced-colors, reduced-motion,
 * colour-only encoding and DOM-order warnings are the nine universal checks and
 * belong to ui-morphism-core:a11y-validate. Nothing below recomputes any of
 * them; the checklist items that need markup or a browser are carried by
 * ../../audit/references/checklist.md instead.
 *
 * status is "pass" | "warn" | "fail"; `ok` is "no check failed". */
function checkPlan({ items, band, tiles, metrics, grid, motion, hierarchyBreak }) {
  const checks = [];
  const add = (id, status, detail) => checks.push({ id, status, detail });

  const heroes = tiles.filter((t) => t.span === "hero").length;
  const expectedHeroes = band === "canonical" || band === "emphatic" ? 1 : 0;
  add(
    "hero-count",
    heroes === expectedHeroes ? "pass" : "fail",
    `${heroes} hero-span tile(s); the ${band} band emits ${expectedHeroes}. §13: exactly one dominant tile per grid.`
  );

  const distinct = [...new Set(tiles.map((t) => t.span))];
  add(
    "distinct-spans",
    distinct.length <= 5 ? "pass" : "fail",
    `${distinct.length} distinct span value(s) — ${distinct.join(", ")}. §13 permits at most five.`
  );

  const n = items.length;
  if (n < 4) {
    add(
      "tile-count",
      "warn",
      `${n} tiles. §9: three things is a card row wearing a costume. The composition is held uniform; say so and offer the simpler layout.`
    );
  } else if (n > 9 && hierarchyBreak !== true) {
    add(
      "tile-count",
      "fail",
      `${n} tiles with no declared hierarchy break. §13 refuses more than nine tiles in one section without a sub-heading or a second grid.`
    );
  } else if (n > 9) {
    add("tile-count", "pass", `${n} tiles, split by a declared hierarchy break.`);
  } else {
    add("tile-count", "pass", `${n} tiles, inside the 4-9 band §9 calls this pattern's home ground.`);
  }

  const overLinked = items.filter((it) => (it.links ?? 0) > 1);
  const unknownLinks = items.filter((it) => typeof it.links !== "number");
  if (overLinked.length > 0) {
    add(
      "one-link-per-tile",
      "fail",
      `${overLinked.map((it) => it.id).join(", ")} declare more than one link. §7: a full-tile overlay makes the second link unclickable.`
    );
  } else if (unknownLinks.length > 0) {
    add(
      "one-link-per-tile",
      "warn",
      `link count undeclared for ${unknownLinks.map((it) => it.id).join(", ")}. Read the markup and confirm each tile carries zero or one link.`
    );
  } else {
    add("one-link-per-tile", "pass", "every tile declares zero or one link.");
  }

  if (expectedHeroes === 0) {
    add(
      "hero-area-share",
      "pass",
      `${band} band: size does not encode hierarchy at this intensity, so §3's 30-40% dominant-tile rule does not apply.`
    );
  } else {
    const share = metrics.heroAreaShare;
    const pct = (share * 100).toFixed(1);
    add(
      "hero-area-share",
      share >= 0.3 && share <= 0.4 ? "pass" : "warn",
      `the dominant tile is ${pct}% of the section area; §3 puts it at 30-40%.`
    );
  }

  add(
    "uniform-is-not-bento",
    distinct.length === 1 ? "warn" : "pass",
    distinct.length === 1
      ? "every tile has the same span. This is a card grid, not a bento — §13 requires saying so and offering the simpler layout."
      : `${distinct.length} span sizes in use, so size can encode importance.`
  );

  add(
    "holes",
    grid.holes === 0 ? "pass" : "warn",
    grid.holes === 0
      ? "the composition leaves no empty cells."
      : `${grid.holes} empty cell(s). The planner never reorders tiles to close a hole, because DOM order is reading order (§7, SC 1.3.2). Fill them with a strip or an extra unit, or accept the gap.`
  );

  const revealTotal = motion.reveal + motion.stagger * motion.staggeredTiles;
  add(
    "reveal-budget",
    revealTotal <= 400 ? "pass" : "fail",
    `${revealTotal}ms total reveal sequence against the 400ms cap in §4.`
  );

  add(
    "auto-rows-growable",
    /^minmax\(\d+px,\s*auto\)$/.test(grid.gridAutoRows) ? "pass" : "fail",
    `grid-auto-rows is ${grid.gridAutoRows}. §7 (SC 1.4.4): a bare fixed row unit clips content at 200% text zoom.`
  );

  add(
    "dense-flow",
    grid.autoFlow === "sparse" ? "pass" : "fail",
    `grid-auto-flow is ${grid.autoFlow}. The planner never emits dense, so no tile is visually reordered away from its DOM position (§7, SC 1.3.2).`
  );

  const mobileRows = grid.templateAreas.mobile.split("\n");
  const oneColumn =
    mobileRows.length === items.length && mobileRows.every((r) => r.trim().split(/\s+/).length === 1);
  add(
    "mobile-collapse",
    oneColumn ? "pass" : "fail",
    oneColumn
      ? `below 768px the grid is ${items.length} full-width rows in DOM order.`
      : "the mobile template is not one full-width column per tile (§7, SC 1.4.10)."
  );

  return checks;
}

export function plan(input) {
  if (!Array.isArray(input?.items) || input.items.length === 0) {
    throw new Error("input.items must be a non-empty array");
  }
  for (const item of input.items) {
    // ITEM_TYPES is the closed content-type vocabulary declared at the top of
    // this module, alongside the span table it maps onto.
    if (!ITEM_TYPES.includes(item?.type)) {
      throw new Error(`unknown type "${item?.type}"`);
    }
    if (typeof item.id !== "string" || item.id.length === 0) {
      throw new Error("every item needs a string id");
    }
  }
  // The third assertion of "the planner rejects input the span vocabulary
  // cannot express": two dominant tiles is not a bento (§3, §13).
  if (input.items.filter((it) => it.primary === true).length > 1) {
    throw new Error("a bento has exactly one dominant tile");
  }
  const requested = Math.min(100, Math.max(0, input.intensity ?? DEFAULT_INTENSITY));
  const caps = capsFor(input);
  const i = caps.reduce((n, c) => Math.min(n, c.cap), requested);
  const round2 = (n) => Math.round(n * 100) / 100;
  const knobs = {
    spanVariance: round2(segment(i, 1.0, 2.0, 3.0)),
    radius: Math.round(segment(i, 0, 24, 32)),
    surfaceDelta: round2(segment(i, 0, 8, 24)),
    mediaBleed: Math.round(segment(i, 0, 40, 100)),
    motion: i,
  };
  const band = bandFor(knobs.spanVariance);
  const columns = input.columns ?? 12;
  const rowUnit = input.rowUnit ?? 180;
  const desktop = place(assignSpans(input.items, band), columns, "desktop");
  const geom = geometry(desktop.placed, desktop.grid.length, {
    columns,
    gap: input.gap ?? 16,
    rowUnit,
    maxWidth: input.maxWidth ?? 1280,
  });
  const motion = motionLadder(knobs.motion);
  const tiles = geom.tiles.map((t) => ({
    id: t.id,
    type: t.type,
    span: t.span,
    padding: `var(${SPANS[t.span].pad})`,
    row: t.row,
    col: t.col,
    colSpan: t.colSpan,
    rowSpan: t.rowSpan,
    widthPx: t.widthPx,
    heightPx: t.heightPx,
    areaPx: t.areaPx,
    rationale: t.rationale,
  }));
  const grid = {
    columns,
    rowUnit,
    rows: desktop.grid.length,
    holes: desktop.grid.reduce((n, row) => n + row.filter((cell) => cell === null).length, 0),
    // §7 (SC 1.4.4): the row unit is a floor, never a ceiling, so a tile can
    // grow at 200% text zoom instead of clipping.
    gridAutoRows: `minmax(${rowUnit}px, auto)`,
    // Never "dense". §7: dense packing pulls later tiles into earlier holes and
    // separates visual order from DOM order.
    autoFlow: "sparse",
    templateAreas: {
      desktop: toAreas(desktop.grid),
      // §4 span table: at 6 columns hero and wide go full width, tall and
      // unit keep 3, strip stays the whole row.
      tablet: toAreas(place(assignSpans(input.items, band), columns === 12 ? 6 : columns, "tablet").grid),
      // Below 768px every tile is full width, in DOM order (§5).
      mobile: input.items.map((item) => `    "${areaName(item.id)}"`).join("\n"),
    },
  };
  const checks = checkPlan({
    items: input.items,
    band,
    tiles,
    metrics: geom.metrics,
    grid,
    motion,
    hierarchyBreak: input.hierarchyBreak,
  });

  return {
    metrics: geom.metrics,
    intensity: { requested, effective: i, caps },
    knobs,
    motion,
    band,
    tiles,
    grid,
    checks,
    ok: checks.every((c) => c.status !== "fail"),
  };
}

const STATUS_LABEL = { pass: "PASS", warn: "WARN", fail: "FAIL" };

function render(result) {
  const lines = [];
  const { intensity, knobs, band, grid, metrics, motion } = result;

  lines.push(
    `intensity ${intensity.effective} (requested ${intensity.requested})` +
      (intensity.caps.length > 0 ? `, capped by ${intensity.caps.length} context rule(s)` : "")
  );
  for (const cap of intensity.caps) {
    lines.push(`  cap ${cap.cap} — ${cap.rule}: ${cap.reason}`);
  }
  lines.push(
    `knobs: spanVariance ${knobs.spanVariance}, radius ${knobs.radius}px, ` +
      `surfaceDelta ${knobs.surfaceDelta}, mediaBleed ${knobs.mediaBleed}%, motion ${knobs.motion} (band: ${band})`
  );
  lines.push(
    `motion: reveal ${motion.reveal}ms, stagger ${motion.stagger}ms × ${motion.staggeredTiles} tile(s), ` +
      `lift ${motion.lift}px, media scale ${motion.mediaScale}, parallax ${motion.parallax}`
  );
  lines.push("");
  lines.push("tile                 span   place            size          rationale");
  for (const t of result.tiles) {
    lines.push(
      "  " +
        t.id.padEnd(19) +
        t.span.padEnd(7) +
        `r${t.row} c${t.col} ${t.colSpan}×${t.rowSpan}`.padEnd(17) +
        `${t.widthPx}×${t.heightPx}`.padEnd(14) +
        t.rationale
    );
  }
  lines.push("");
  lines.push(
    `grid: ${grid.columns} columns × ${grid.rows} rows, ${grid.holes} empty cell(s), ` +
      `grid-auto-rows: ${grid.gridAutoRows}, grid-auto-flow: ${grid.autoFlow}`
  );
  lines.push(
    `geometry at ${metrics.maxWidthPx}px wide: column ${metrics.colWidthPx}px, ` +
      `section ${metrics.sectionHeightPx}px tall, dominant tile ${(metrics.heroAreaShare * 100).toFixed(1)}% of the section, ` +
      `measured largest:smallest area ${metrics.measuredAreaRatio}`
  );
  lines.push("");
  lines.push("grid-template-areas (desktop):");
  lines.push(grid.templateAreas.desktop);
  lines.push("");
  for (const c of result.checks) {
    lines.push(`${STATUS_LABEL[c.status]} ${c.id} — ${c.detail}`);
  }
  lines.push("");
  lines.push(
    "Contrast, focus, target size, forced-colors and reduced-motion are not checked here — call ui-morphism-core:a11y-validate."
  );
  return lines.join("\n") + "\n";
}

export function main(argv) {
  const args = argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(
      "assign-spans.mjs — the bento composition planner\n\n" +
        "  node assign-spans.mjs <input.json> [--json] [--no-fail]\n" +
        "  node assign-spans.mjs --stdin [--json] [--no-fail]\n\n" +
        "  --json     machine-readable output\n" +
        "  --no-fail  always exit 0\n\n" +
        "Input: { items: [{ id, type, words?, aspect?, cover?, primary?, links? }], intensity?,\n" +
        "columns?, gap?, rowUnit?, maxWidth?, contentShape?, tileSource?, hierarchyBreak? }.\n" +
        "Types: stat, screenshot, chart, quote, paragraph, icon-text, cta, logos.\n\n" +
        "Contrast, focus, target size and forced-colors checks are not run here. They belong\n" +
        "to ui-morphism-core:a11y-validate.\n"
    );
    return 0;
  }

  const json = args.includes("--json");
  const noFail = args.includes("--no-fail");
  const stdin = args.includes("--stdin");
  const files = args.filter((a) => !a.startsWith("--"));

  if (!stdin && files.length !== 1) {
    process.stderr.write("assign-spans.mjs: expected exactly one input JSON path, or --stdin. See --help.\n");
    return 2;
  }

  let text;
  try {
    text = readFileSync(stdin ? 0 : files[0], "utf8");
  } catch (err) {
    process.stderr.write(`assign-spans.mjs: cannot read input — ${err.message}\n`);
    return 2;
  }

  let result;
  try {
    result = plan(JSON.parse(text));
  } catch (err) {
    process.stderr.write(`assign-spans.mjs: ${err.message}\n`);
    return 2;
  }

  process.stdout.write(json ? JSON.stringify(result, null, 2) + "\n" : render(result));
  return !noFail && !result.ok ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
