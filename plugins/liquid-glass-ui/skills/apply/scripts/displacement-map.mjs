#!/usr/bin/env node
/**
 * displacement-map.mjs — the squircle-profile displacement map, and the filter
 * that consumes it.
 *
 * Source of truth: docs/08-liquid-glass.md §3 (the squircle surface profile and
 * the 8-24px lensed rim band), §5 (the inline SVG `<defs>` recipe), §8 (the
 * displacement-map, filter-region and asset-weight budgets) and §13 (output 4:
 * "the inline SVG filter `<defs>` with a per-component-size displacement map,
 * inlined as a base64 data URI").
 *
 * WHY THIS IS A SCRIPT AND NOT PROSE. Every other style in this set emits CSS
 * whose values a table can hold. This one has to emit an IMAGE. The map encodes,
 * per pixel, how far the backdrop is bent at that point: red is the horizontal
 * offset, green the vertical, 128 is no displacement. Getting it right means
 * evaluating the surface profile's slope across a band that follows a rounded
 * rectangle's edge, resolving the outward normal at every pixel including inside
 * the corner arcs, and encoding the result as an 8-bit PNG that stays under 8KB
 * once base64'd. That is arithmetic a model does badly by hand and a table
 * cannot carry, because the answer changes with every component size — which is
 * exactly why §8 says to precompute one map per size and cache it as a data URI
 * rather than regenerate it on resize.
 *
 * THE PROFILE. Doc §3: Apple's lens curve is a convex squircle,
 * y = 4throot(1 - (1-x)^4), where x runs from the rim inward across the band and
 * y is the surface height. Refraction follows the surface SLOPE, not its height,
 * so the displacement magnitude at x is derived from dy/dx:
 *
 *     s(x) = (1-x)^3 * (1 - (1-x)^4)^(-3/4)      the slope
 *     m(x) = s / sqrt(1 + s^2)                    the sine of the surface tilt
 *
 * m is 1 at the rim and 0 at the band's inner edge, which is doc §3's
 * "displacement magnitude peaks at the border and decays to zero by ~40% of the
 * way inward" — most of the movement lives in the outer part of the band, so the
 * shoulder is gentle and the terminal edge is hard, which is what separates a
 * squircle from a spherical dome. Taking the sine rather than the raw slope is
 * what bounds it: the raw slope is infinite at the rim.
 *
 * WHAT THIS SCRIPT DOES NOT DO. It computes no contrast ratio, no relative
 * luminance and no alpha compositing. The greyscale values it writes are
 * geometry encoded as colour, not colour science. Every contrast judgement in
 * this plugin belongs to ui-morphism-core:a11y-validate — one implementation,
 * ten callers. It also does not emit the specular rim: that is a masked CSS
 * border gradient, written by hand, and it lives in ../references/recipes.md.
 *
 * Usage:
 *   node displacement-map.mjs [--size=WxH[@R] ...] [--band=16] [--scale=48]
 *                             [--id=lg-refract] [--saturate=1.35] [--json]
 *
 * Exit code 1 when any emitted map breaks a budget, 0 otherwise.
 */

import { deflateSync, inflateSync } from "node:zlib";

/** Doc §8: "Displacement map asset — <= 8KB, inlined as data URI". */
export const MAP_BUDGET_BYTES = 8 * 1024;

/** Doc §3: the lensed rim band is roughly 8-24px wide. */
export const BAND_MIN_PX = 8;
export const BAND_MAX_PX = 24;

/** Doc §13 knob table: feDisplacementMap scale runs 0-72. */
export const SCALE_MAX = 72;

/** Doc §4: the minimum hit area on every control. */
export const TARGET_MIN_PX = 44;

/* -------------------------------------------------------------- the profile */

/**
 * Displacement magnitude at normalised inward distance `t` across the band.
 * t = 0 is the rim, t = 1 is the inner edge of the band. Returns 0..1.
 */
export function lensMagnitude(t) {
  if (!(t > 0)) return 1;
  if (t >= 1) return 0;
  const u = 1 - t;
  const u4 = u * u * u * u;
  const slope = (u * u * u) / Math.pow(1 - u4, 0.75);
  return slope / Math.sqrt(1 + slope * slope);
}

/**
 * Signed distance from a point to the edge of a rounded rectangle, plus the
 * outward unit normal at that point.
 *
 * The point (px, py) is measured from the box centre; (hx, hy) are the box's
 * half-extents and `r` its corner radius. Distance is negative inside the
 * shape and positive outside it. The normal is the direction the surface faces
 * at that point: axis-aligned along the straight runs, radial inside the corner
 * arcs, which is what makes the corners lens as arcs rather than as two
 * overlapping straight bands.
 */
export function roundedRectField(px, py, hx, hy, r) {
  const qx = Math.abs(px) - (hx - r);
  const qy = Math.abs(py) - (hy - r);
  const mx = Math.max(qx, 0);
  const my = Math.max(qy, 0);
  const outside = Math.hypot(mx, my);
  const inside = Math.min(Math.max(qx, qy), 0);
  const distance = outside + inside - r;

  let nx;
  let ny;
  if (qx > 0 && qy > 0) {
    const len = outside || 1;
    nx = qx / len;
    ny = qy / len;
  } else if (qx > qy) {
    nx = 1;
    ny = 0;
  } else if (qy > qx) {
    nx = 0;
    ny = 1;
  } else {
    /* Exactly on the diagonal of a corner region, or dead centre of a shape
       with no straight run at all. Split the difference rather than picking an
       axis arbitrarily — an arbitrary pick would put a visible seam down the
       diagonal of every square control. */
    nx = Math.SQRT1_2;
    ny = Math.SQRT1_2;
  }
  return {
    distance,
    nx: px < 0 ? -nx : nx,
    ny: py < 0 ? -ny : ny,
  };
}

/* ------------------------------------------------------------------ the map */

function clamp255(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/**
 * Build the RGB displacement map for one component size.
 *
 * Channel convention, and it is the one doc §5 states: 128 is no displacement,
 * red carries the horizontal offset and green the vertical. The offset points
 * OUTWARD along the local normal, so the rim samples backdrop from further out
 * and compresses it — which is what reads as a lens rather than as a smear.
 * Flipping the sign of the filter's `scale` flips it to a magnifying read; both
 * are legal and the outward one is Apple's.
 *
 * 8-bit encoding puts neutral at 128, which is 0.502 rather than 0.5, so a
 * neutral pixel still displaces by scale/510 — under a tenth of a pixel at the
 * default scale of 48. That residue is why the interior of the map is written
 * as exactly 128 everywhere rather than as something merely close to it: the
 * whole plateau then moves by the same sub-pixel amount, uniformly, and nothing
 * shears.
 */
export function buildMap({ width, height, radius, band }) {
  if (!Number.isInteger(width) || width <= 0) {
    throw new RangeError("width must be a positive integer number of pixels");
  }
  if (!Number.isInteger(height) || height <= 0) {
    throw new RangeError("height must be a positive integer number of pixels");
  }

  const hx = width / 2;
  const hy = height / 2;
  const r = Math.max(0, Math.min(radius ?? Math.min(hx, hy), hx, hy));
  const b = Math.max(1, Math.min(band, hx, hy));

  const rgb = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    const py = y + 0.5 - hy;
    for (let x = 0; x < width; x++) {
      const px = x + 0.5 - hx;
      const { distance, nx, ny } = roundedRectField(px, py, hx, hy, r);
      const depth = -distance;
      const m = depth > 0 ? lensMagnitude(depth / b) : 0;

      const i = (y * width + x) * 3;
      rgb[i] = clamp255(Math.round(127.5 + 127.5 * m * nx));
      rgb[i + 1] = clamp255(Math.round(127.5 + 127.5 * m * ny));
      rgb[i + 2] = 128;
    }
  }
  return { width, height, radius: r, band: b, rgb };
}

/* -------------------------------------------------------------- PNG codec */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  Buffer.from(data).copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/**
 * Encode 8-bit truecolour RGB as a PNG.
 *
 * Colour type 2 rather than 6: the map has no alpha to carry, and dropping the
 * channel removes a quarter of the bytes and every question about whether the
 * filter graph premultiplied it.
 *
 * Per-row filter selection is the standard minimum-sum-of-absolute-differences
 * heuristic over None / Sub / Up. It is not an optimisation here, it is what
 * makes the budget reachable: the interior rows of a map are identical to the
 * row above, so Up reduces most of the image to zeros.
 */
export function encodePng(width, height, rgb) {
  const bpp = 3;
  const stride = width * bpp;
  const raw = Buffer.alloc((stride + 1) * height);
  const prior = Buffer.alloc(stride);
  const line = Buffer.alloc(stride);
  const cand = [Buffer.alloc(stride), Buffer.alloc(stride), Buffer.alloc(stride)];

  for (let y = 0; y < height; y++) {
    Buffer.from(rgb.buffer, rgb.byteOffset + y * stride, stride).copy(line);

    for (let i = 0; i < stride; i++) {
      const left = i >= bpp ? line[i - bpp] : 0;
      cand[0][i] = line[i];
      cand[1][i] = (line[i] - left) & 0xff;
      cand[2][i] = (line[i] - prior[i]) & 0xff;
    }

    let best = 0;
    let bestScore = Infinity;
    for (let f = 0; f < 3; f++) {
      let score = 0;
      for (let i = 0; i < stride; i++) {
        const v = cand[f][i];
        score += v < 128 ? v : 256 - v;
      }
      if (score < bestScore) {
        bestScore = score;
        best = f;
      }
    }

    raw[y * (stride + 1)] = best;
    cand[best].copy(raw, y * (stride + 1) + 1);
    line.copy(prior);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // colour type: truecolour
  ihdr[10] = 0; // compression: deflate
  ihdr[11] = 0; // filter: adaptive
  ihdr[12] = 0; // interlace: none

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * Decode a PNG this module produced, back to { width, height, rgb }.
 *
 * It exists so the tests can assert on pixels rather than on byte counts: a map
 * that compresses beautifully and encodes the wrong direction is precisely the
 * failure this script is here to prevent, and only a decode catches it. Handles
 * what encodePng emits and nothing else — 8-bit colour type 2, row filters
 * None / Sub / Up.
 */
export function decodePng(buf) {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < sig.length; i++) {
    if (buf[i] !== sig[i]) throw new Error("not a PNG");
  }

  let off = 8;
  let width = 0;
  let height = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[9] !== 2) throw new Error("unsupported PNG format");
    } else if (type === "IDAT") {
      idat.push(Buffer.from(data));
    } else if (type === "IEND") {
      break;
    }
    off += len + 12;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const bpp = 3;
  const stride = width * bpp;
  const rgb = new Uint8Array(width * height * 3);
  const prior = Buffer.alloc(stride);
  const line = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const left = i >= bpp ? line[i - bpp] : 0;
      if (f === 0) line[i] = src[i];
      else if (f === 1) line[i] = (src[i] + left) & 0xff;
      else if (f === 2) line[i] = (src[i] + prior[i]) & 0xff;
      else throw new Error("unsupported PNG row filter " + f);
    }
    line.copy(Buffer.from(rgb.buffer, rgb.byteOffset + y * stride, stride));
    line.copy(prior);
  }
  return { width, height, rgb };
}

/* ------------------------------------------------------------- filter defs */

/**
 * The filter region, in percentages, tight to what the effect actually needs.
 *
 * Doc §8: `x="-20%" y="-20%" width="140%" height="140%"` inflates the
 * rasterized area by roughly 96%, and filter regions should be kept as tight as
 * the effect allows. The displacement pulls in backdrop from at most `scale/2`
 * pixels beyond the edge, so that plus a pixel of slack for rounding is the
 * whole requirement — and on a wide, short toolbar it is a far smaller box than
 * a flat 140%.
 */
export function filterRegion({ width, height, scale }) {
  const pad = Math.ceil(Math.abs(scale) / 2) + 1;
  /* Round the PADDING once, upward, and derive x/width from the rounded figure.
     Rounding x and width independently leaves a region that is a tenth of a
     percent off centre, and rounding either of them down under-provides the
     very edge the lens lives on — a region a fraction of a pixel too small
     crops the displaced result at the rim rather than somewhere invisible. */
  const ceil1 = (n) => Math.ceil(n * 10) / 10;
  const px = ceil1((pad / width) * 100);
  const py = ceil1((pad / height) * 100);
  const w = Math.round((100 + 2 * px) * 10) / 10;
  const h = Math.round((100 + 2 * py) * 10) / 10;
  return {
    x: -px,
    y: -py,
    width: w,
    height: h,
    /* The rasterized area against the element's own box, so the audit can put
       it next to doc §8's 1.96x for the default region. */
    areaFactor: Math.round((w / 100) * (h / 100) * 100) / 100,
  };
}

/**
 * The complete `<filter>` element for one size, with the map inlined.
 *
 * `feImage` takes a `data:` URI and never a URL: doc §8 is explicit that an
 * external `href` costs a network fetch plus a decode inside the filter graph,
 * and doc §13 lists a fetched map among the anti-patterns the skill must
 * refuse to generate.
 */
export function filterMarkup({ id, dataUri, width, height, scale, saturate, region }) {
  return [
    `    <filter id="${id}" x="${region.x}%" y="${region.y}%" width="${region.width}%" height="${region.height}%"`,
    `            filterUnits="objectBoundingBox" color-interpolation-filters="sRGB">`,
    `      <!-- Red is the horizontal offset, green the vertical, 128 is neutral. -->`,
    `      <feImage href="${dataUri}"`,
    `               x="0" y="0" width="${width}" height="${height}"`,
    `               preserveAspectRatio="none" result="map"/>`,
    `      <feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}"`,
    `                         xChannelSelector="R" yChannelSelector="G" result="displaced"/>`,
    `      <feColorMatrix in="displaced" type="saturate" values="${saturate}"/>`,
    `    </filter>`,
  ].join("\n");
}

/** The one inline `<svg>` per document that carries every filter. */
export function defsMarkup(filters) {
  return [
    `<!-- One per document, never one per component. Decorative, so it is hidden`,
    `     from assistive technology; focusable="false" because some AT still`,
    `     stops on an inline SVG without it. -->`,
    `<svg width="0" height="0" aria-hidden="true" focusable="false"`,
    `     style="position:absolute;pointer-events:none">`,
    `  <defs>`,
    ...filters,
    `  </defs>`,
    `</svg>`,
  ].join("\n");
}

/* -------------------------------------------------------------- the planner */

/**
 * Generate every map and its filter, and adjudicate the budgets.
 *
 * @param {{sizes: {width:number,height:number,radius?:number}[], band?:number,
 *          scale?:number, id?:string, saturate?:number}} options
 */
export function plan({ sizes, band = 16, scale = 48, id = "lg-refract", saturate = 1.35 }) {
  const findings = [];
  const add = (severity, rule, message) => findings.push({ severity, rule, message });

  if (scale < 0 || scale > SCALE_MAX) {
    add("error", "scale-range",
      `scale ${scale} is outside the 0-${SCALE_MAX} knob range (doc §13). Doc §3 puts the readable band at 30-70 for a 56px-tall control.`);
  }
  if (scale === 0) {
    add("error", "scale-zero",
      "scale 0 disables Tier 2 entirely (doc §13). Emit no filter, no map and no url() backdrop-filter — and do not call the result liquid-glass, because a blur-only surface is glassmorphism.");
  }
  if (band < BAND_MIN_PX || band > BAND_MAX_PX) {
    add("warn", "band-range",
      `band ${band}px is outside doc §3's ${BAND_MIN_PX}-${BAND_MAX_PX}px lensed rim. Narrower and it reads as a bright line rather than a lens; wider and the whole surface warps instead of its edge.`);
  }

  const maps = [];
  for (const size of sizes) {
    const { width, height } = size;
    const radius = size.radius ?? Math.min(width, height) / 2;

    if (Math.min(width, height) < TARGET_MIN_PX) {
      add("warn", "below-target",
        `${width}x${height} is under the ${TARGET_MIN_PX}px target floor (doc §4). Doc §8: disable refraction below a size threshold — a 32px chip does not read as a lens and pays the full cost.`);
    }

    const map = buildMap({ width, height, radius, band });
    const png = encodePng(map.width, map.height, map.rgb);
    const dataUri = `data:image/png;base64,${png.toString("base64")}`;
    const region = filterRegion({ width, height, scale });
    const filterId = sizes.length === 1 ? id : `${id}-${width}x${height}`;

    if (dataUri.length > MAP_BUDGET_BYTES) {
      add("error", "map-budget",
        `${filterId}: the inlined map is ${dataUri.length} bytes, over doc §8's ${MAP_BUDGET_BYTES}-byte budget. Shrink the map's pixel dimensions rather than the element — preserveAspectRatio="none" stretches it to fit, so a half-resolution map costs a quarter of the bytes and loses nothing a ${band}px band can show.`);
    }

    maps.push({
      id: filterId,
      width,
      height,
      radius: map.radius,
      band: map.band,
      scale,
      pngBytes: png.length,
      dataUriBytes: dataUri.length,
      region,
      dataUri,
      markup: filterMarkup({ id: filterId, dataUri, width, height, scale, saturate, region }),
    });
  }

  if (maps.length > 1) {
    add("info", "one-refractor",
      `${maps.length} maps generated. Doc §8's budget allows at most ONE refracting surface in a viewport, so these are per-component-size caches, not per-surface licences.`);
  }

  return {
    summary: {
      maps: maps.length,
      scale,
      band,
      totalDataUriBytes: maps.reduce((n, m) => n + m.dataUriBytes, 0),
      budgetBytes: MAP_BUDGET_BYTES,
      errors: findings.filter((f) => f.severity === "error").length,
      warnings: findings.filter((f) => f.severity === "warn").length,
    },
    maps,
    findings,
    defs: defsMarkup(maps.map((m) => m.markup)),
  };
}

/* ---------------------------------------------------------------------- CLI */

/** `300x56@28` -> { width: 300, height: 56, radius: 28 }. */
export function parseSize(spec) {
  const m = /^(\d+)x(\d+)(?:@(\d+(?:\.\d+)?))?$/.exec(String(spec).trim());
  if (!m) throw new Error(`bad --size "${spec}"; expected WxH or WxH@radius, e.g. 300x56@28`);
  return {
    width: Number(m[1]),
    height: Number(m[2]),
    radius: m[3] === undefined ? undefined : Number(m[3]),
  };
}

const SEV_LABEL = { error: "ERROR", warn: "WARN ", info: "INFO " };

export function main(argv) {
  const args = argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(
      "displacement-map.mjs — the squircle-profile displacement map and its filter\n\n" +
      "  node displacement-map.mjs [--size=WxH[@R] ...] [--band=16] [--scale=48]\n" +
      "                            [--id=lg-refract] [--saturate=1.35] [--json]\n\n" +
      "  --size      component size in CSS px, repeatable, one map per size\n" +
      "  --band      lensed rim width in px (doc §3: 8-24)\n" +
      "  --scale     feDisplacementMap scale (doc §13 knob: 0-72)\n" +
      "  --id        filter id; suffixed with the size when more than one\n" +
      "  --saturate  feColorMatrix saturate value on the displaced result\n" +
      "  --json      machine-readable output\n\n" +
      "Contrast, luminance and compositing are not computed here. They belong to\n" +
      "ui-morphism-core:a11y-validate.\n");
    return 0;
  }

  const flag = (name, fallback) => {
    const hit = args.find((a) => a.startsWith(`--${name}=`));
    return hit === undefined ? fallback : hit.slice(name.length + 3);
  };

  const sizes = args
    .filter((a) => a.startsWith("--size="))
    .map((a) => parseSize(a.slice("--size=".length)));
  if (sizes.length === 0) sizes.push({ width: 300, height: 56, radius: 28 });

  const result = plan({
    sizes,
    band: Number(flag("band", 16)),
    scale: Number(flag("scale", 48)),
    id: String(flag("id", "lg-refract")),
    saturate: Number(flag("saturate", 1.35)),
  });

  if (args.includes("--json")) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else {
    for (const f of result.findings) {
      process.stdout.write(`  ${SEV_LABEL[f.severity]} ${f.rule} — ${f.message}\n`);
    }
    process.stdout.write("\n" + result.defs + "\n\n");
    for (const m of result.maps) {
      process.stdout.write(
        `${m.id}: ${m.width}x${m.height}, radius ${m.radius}, band ${m.band}px, scale ${m.scale}\n` +
        `  PNG ${m.pngBytes} B, data URI ${m.dataUriBytes} B of the ${MAP_BUDGET_BYTES} B budget\n` +
        `  filter region ${m.region.width}% x ${m.region.height}% (${m.region.areaFactor}x the element's own area)\n`);
    }
    process.stdout.write(
      `\n${result.summary.maps} map(s), ${result.summary.totalDataUriBytes} inlined byte(s) total, ` +
      `${result.summary.errors} error(s), ${result.summary.warnings} warning(s).\n` +
      "The specular rim is a masked CSS border gradient and is not generated here — see ../references/recipes.md.\n");
  }

  return result.summary.errors > 0 ? 1 : 0;
}

if (import.meta.url === "file://" + process.argv[1]) {
  process.exit(main(process.argv));
}
