/**
 * Tests for displacement-map.mjs.
 *
 * Run: node --test "skills/apply/scripts/*.test.mjs"
 *
 * Every case is a line from docs/08-liquid-glass.md — §3's squircle profile and
 * lensed rim band, §5's filter recipe, §8's map, region and asset budgets, or
 * §13's output 4 and its anti-pattern list.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  lensMagnitude,
  roundedRectField,
  buildMap,
  encodePng,
  decodePng,
  filterRegion,
  plan,
  parseSize,
  MAP_BUDGET_BYTES,
} from "./displacement-map.mjs";

/* ------------------------------------------------------------ the profile */

test("the lens profile peaks at the rim and reaches zero at the band's inner edge", () => {
  assert.equal(lensMagnitude(0), 1);
  assert.equal(lensMagnitude(1), 0);
  assert.equal(lensMagnitude(1.5), 0);
});

test("the lens profile decays monotonically across the band", () => {
  let previous = Infinity;
  for (let i = 0; i <= 40; i++) {
    const m = lensMagnitude(i / 40);
    assert.ok(m <= previous, `magnitude rose at t=${i / 40}: ${m} > ${previous}`);
    assert.ok(m >= 0 && m <= 1, `magnitude out of range at t=${i / 40}: ${m}`);
    previous = m;
  }
});

test("most of the displacement lives in the outer part of the band", () => {
  // Doc §3: "peaks at the border and decays to zero by ~40% of the way inward" —
  // a gentle shoulder and a hard terminal edge, not a spherical dome.
  assert.ok(lensMagnitude(0.5) < 0.15, `expected a hard terminal edge, got ${lensMagnitude(0.5)}`);
  assert.ok(lensMagnitude(0.25) > 0.4, `expected a gentle shoulder, got ${lensMagnitude(0.25)}`);
});

/* -------------------------------------------------------------- the field */

test("the rounded-rect field is negative inside and positive outside", () => {
  assert.ok(roundedRectField(0, 0, 150, 28, 28).distance < 0);
  assert.ok(roundedRectField(200, 0, 150, 28, 28).distance > 0);
});

test("the outward normal on a straight run is axis-aligned and points away from the centre", () => {
  const right = roundedRectField(140, 0, 150, 28, 28);
  assert.deepEqual([right.nx, right.ny], [1, 0]);
  const left = roundedRectField(-140, 0, 150, 28, 28);
  assert.deepEqual([left.nx, left.ny], [-1, 0]);
  const top = roundedRectField(0, -20, 150, 28, 28);
  assert.deepEqual([top.nx, top.ny], [0, -1]);
});

test("the outward normal inside a corner arc is diagonal and unit length", () => {
  const corner = roundedRectField(140, 20, 150, 28, 28);
  assert.ok(corner.nx > 0 && corner.ny > 0, "corner normal should point out and down");
  assert.ok(Math.abs(Math.hypot(corner.nx, corner.ny) - 1) < 1e-9);
});

/* ---------------------------------------------------------------- the map */

test("the map's interior is exactly neutral and its rim is not", () => {
  const { rgb, width } = buildMap({ width: 300, height: 56, radius: 28, band: 16 });
  const at = (x, y) => {
    const i = (y * width + x) * 3;
    return [rgb[i], rgb[i + 1], rgb[i + 2]];
  };
  assert.deepEqual(at(150, 28), [128, 128, 128], "the centre must not displace");
  assert.ok(at(0, 28)[0] < 40, `the left rim should push hard leftward, got R=${at(0, 28)[0]}`);
});

test("displacement points outward, so the two rims mirror each other", () => {
  const { rgb, width } = buildMap({ width: 300, height: 56, radius: 28, band: 16 });
  const red = (x, y) => rgb[(y * width + x) * 3];
  const green = (x, y) => rgb[(y * width + x) * 3 + 1];
  assert.ok(red(0, 28) < 128, "left rim displaces negative in x");
  assert.ok(red(299, 28) > 128, "right rim displaces positive in x");
  assert.equal(red(0, 28) + red(299, 28), 255, "the two rims must be symmetric");
  assert.ok(green(150, 0) < 128, "top rim displaces negative in y");
  assert.ok(green(150, 55) > 128, "bottom rim displaces positive in y");
});

test("the blue channel is unused and constant", () => {
  const { rgb } = buildMap({ width: 64, height: 64, radius: 16, band: 16 });
  for (let i = 2; i < rgb.length; i += 3) assert.equal(rgb[i], 128);
});

test("a non-integer or non-positive size is refused rather than silently rounded", () => {
  assert.throws(() => buildMap({ width: 300.5, height: 56, radius: 28, band: 16 }), RangeError);
  assert.throws(() => buildMap({ width: 0, height: 56, radius: 28, band: 16 }), RangeError);
});

/* ---------------------------------------------------------------- the PNG */

test("the PNG round-trips pixel for pixel", () => {
  const map = buildMap({ width: 120, height: 44, radius: 22, band: 16 });
  const decoded = decodePng(encodePng(map.width, map.height, map.rgb));
  assert.equal(decoded.width, 120);
  assert.equal(decoded.height, 44);
  assert.deepEqual(Array.from(decoded.rgb), Array.from(map.rgb));
});

test("the PNG carries a valid signature and an 8-bit truecolour IHDR", () => {
  const map = buildMap({ width: 32, height: 32, radius: 8, band: 8 });
  const png = encodePng(map.width, map.height, map.rgb);
  assert.deepEqual(Array.from(png.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.toString("ascii", 12, 16), "IHDR");
  assert.equal(png[24], 8, "bit depth must be 8");
  assert.equal(png[25], 2, "colour type must be truecolour, not RGBA");
});

/* ------------------------------------------------------------- the budget */

test("a toolbar-sized map fits doc §8's 8KB inlined budget", () => {
  const result = plan({ sizes: [{ width: 300, height: 56, radius: 28 }] });
  const [map] = result.maps;
  assert.ok(map.dataUriBytes <= MAP_BUDGET_BYTES,
    `expected <= ${MAP_BUDGET_BYTES} bytes inlined, got ${map.dataUriBytes}`);
  assert.equal(result.summary.errors, 0);
});

test("a map that blows the budget is an error, not a warning", () => {
  const result = plan({ sizes: [{ width: 1440, height: 900, radius: 26 }] });
  assert.ok(result.findings.some((f) => f.rule === "map-budget" && f.severity === "error"),
    "a full-viewport map must fail the asset budget");
});

test("the region is derived from the scale, so on a large surface it is far tighter than 140%", () => {
  // Doc §8: `x="-20%" y="-20%" width="140%" height="140%"` inflates the
  // rasterized area by ~96%, and regions should be kept as tight as the effect
  // allows. On anything large relative to the displacement, the effect allows a
  // great deal tighter.
  const region = filterRegion({ width: 1440, height: 900, scale: 48 });
  assert.ok(region.width < 140 && region.height < 140,
    `expected a region tighter than 140%, got ${region.width}% x ${region.height}%`);
  assert.ok(region.areaFactor < 1.96, `expected under doc §8's 1.96x, got ${region.areaFactor}x`);
  // The region is centred on the element: the padding is one rounded number and
  // both the offset and the extent come from it. Compared with a tolerance
  // because 100 + 2 * 1.8 is not exactly 103.6 in binary floating point.
  assert.ok(Math.abs(region.x + (region.width - 100) / 2) < 1e-9);
  assert.ok(Math.abs(region.y + (region.height - 100) / 2) < 1e-9);
});

test("on a short control the derived region is TALLER than 140%, because 140% would clip the lens", () => {
  // The displacement pulls the backdrop in from up to scale/2 = 24px beyond the
  // edge. A flat 140% of a 56px-tall toolbar is 11.2px of headroom, less than
  // half of what the lens reaches for, so doc §5's default region crops the
  // displaced result at exactly the rim the effect lives in. "As tight as the
  // effect allows" is a floor as well as a ceiling, and this is the case where
  // it binds from below.
  const region = filterRegion({ width: 300, height: 56, scale: 48 });
  assert.ok(region.height > 140,
    `a 56px-tall control at scale 48 needs more than 140%, got ${region.height}%`);
  assert.ok(region.width < 140,
    `the horizontal axis is 300px wide and still needs less, got ${region.width}%`);
  const padPx = ((region.height - 100) / 200) * 56;
  assert.ok(padPx >= 24, `the region must cover the full scale/2 reach, got ${padPx}px`);
});

test("the region grows with scale, because that is how far the backdrop is pulled in", () => {
  const small = filterRegion({ width: 300, height: 56, scale: 12 });
  const large = filterRegion({ width: 300, height: 56, scale: 72 });
  assert.ok(large.width > small.width);
});

/* ------------------------------------------------------------- the markup */

test("the emitted filter inlines the map and never fetches it", () => {
  const { defs, maps } = plan({ sizes: [{ width: 300, height: 56, radius: 28 }] });
  assert.ok(defs.includes('href="data:image/png;base64,'), "feImage must carry a data URI");
  assert.ok(!/href="(?!data:)/.test(defs), "no external href may appear in the defs");
  assert.ok(maps[0].markup.includes('xChannelSelector="R"'));
  assert.ok(maps[0].markup.includes('yChannelSelector="G"'));
});

test("the inline defs svg is hidden from assistive technology", () => {
  const { defs } = plan({ sizes: [{ width: 300, height: 56, radius: 28 }] });
  assert.ok(defs.includes('aria-hidden="true"'));
  assert.ok(defs.includes('focusable="false"'));
});

test("more than one size gets size-suffixed filter ids", () => {
  const { maps } = plan({
    sizes: [{ width: 300, height: 56, radius: 28 }, { width: 120, height: 44, radius: 22 }],
    id: "lg-refract",
  });
  assert.deepEqual(maps.map((m) => m.id), ["lg-refract-300x56", "lg-refract-120x44"]);
});

/* --------------------------------------------------------- the knob bounds */

test("scale 0 is an error, because a blur-only surface is glassmorphism", () => {
  const { findings } = plan({ sizes: [{ width: 300, height: 56, radius: 28 }], scale: 0 });
  assert.ok(findings.some((f) => f.rule === "scale-zero" && f.severity === "error"));
});

test("scale beyond the doc §13 knob maximum of 72 is an error", () => {
  const { findings } = plan({ sizes: [{ width: 300, height: 56, radius: 28 }], scale: 96 });
  assert.ok(findings.some((f) => f.rule === "scale-range" && f.severity === "error"));
});

test("a band outside doc §3's 8-24px window is a warning", () => {
  const wide = plan({ sizes: [{ width: 300, height: 56, radius: 28 }], band: 40 });
  assert.ok(wide.findings.some((f) => f.rule === "band-range" && f.severity === "warn"));
  const ok = plan({ sizes: [{ width: 300, height: 56, radius: 28 }], band: 16 });
  assert.ok(!ok.findings.some((f) => f.rule === "band-range"));
});

test("a component under the 44px target floor warns rather than refracting silently", () => {
  const { findings } = plan({ sizes: [{ width: 32, height: 32, radius: 16 }] });
  assert.ok(findings.some((f) => f.rule === "below-target" && f.severity === "warn"));
});

test("generating more than one map notes the one-refracting-surface budget", () => {
  const { findings } = plan({
    sizes: [{ width: 300, height: 56, radius: 28 }, { width: 120, height: 44, radius: 22 }],
  });
  assert.ok(findings.some((f) => f.rule === "one-refractor" && f.severity === "info"));
});

/* ----------------------------------------------------------------- the CLI */

test("--size parses WxH and WxH@radius, and refuses anything else", () => {
  assert.deepEqual(parseSize("300x56"), { width: 300, height: 56, radius: undefined });
  assert.deepEqual(parseSize("300x56@28"), { width: 300, height: 56, radius: 28 });
  assert.throws(() => parseSize("300 by 56"));
});
