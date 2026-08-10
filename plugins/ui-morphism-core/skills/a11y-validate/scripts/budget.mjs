#!/usr/bin/env node
/**
 * budget.mjs — the layer, byte and blur-area counters for §4 of the audit
 * report.
 *
 * This file counts. It does not judge. Which numbers matter, and what the limit
 * is for each of them, comes from the owning doc's §8 and differs per style —
 * skeuomorphism cares about shadow layers and grain weight, glassmorphism about
 * blurred viewport area and glass-surface count, bento about image bytes. So
 * the limits arrive as input and core supplies the counters and the comparison.
 */

import { gzipSync } from 'node:zlib';

import { flattenRules, parseCss } from './audit-css.mjs';

/**
 * Split a comma-separated CSS list at the TOP level only.
 *
 * `0 1px 2px rgba(0,0,0,.2)` is one layer, not three. Counting the commas
 * inside `rgba()` is the single way this measurement goes wrong, and it goes
 * wrong in the direction that makes a sheet look worse than it is.
 */
export function splitTopLevel(value) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(') depth += 1;
    else if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** Count the shadow layers a stylesheet declares, per rule and overall. */
function censusShadowLayers(rules) {
  const perRule = [];
  for (const rule of rules) {
    for (const decl of rule.declarations) {
      if (decl.property !== 'box-shadow') continue;
      if (decl.value.trim() === 'none') continue;
      perRule.push({
        selector: rule.selector,
        line: decl.line,
        layers: splitTopLevel(decl.value).length,
      });
    }
  }
  const worst = perRule.reduce((a, b) => (a && a.layers >= b.layers ? a : b), null);
  return {
    perRule,
    rulesWithShadows: perRule.length,
    total: perRule.reduce((sum, r) => sum + r.layers, 0),
    max: worst?.layers ?? 0,
    worstSelector: worst?.selector ?? null,
  };
}

/**
 * Inventory every blurred surface.
 *
 * `backdrop-filter` blurs everything behind the element and is the expensive
 * one; `filter` blurs the element itself. The number the §8 budgets are
 * actually written against — the percentage of the viewport under a blur — is
 * not computable from CSS text, because the painted area depends on layout. It
 * is reported as an explicit unknown rather than estimated, because an
 * estimated performance number in a report is worse than an absent one.
 */
function inventoryBlur(rules) {
  const radii = [];
  const selectors = [];
  let backdropSurfaces = 0;
  let elementSurfaces = 0;

  for (const rule of rules) {
    let counted = false;
    for (const decl of rule.declarations) {
      if (decl.property !== 'backdrop-filter' && decl.property !== 'filter') continue;
      const found = [...decl.value.matchAll(/blur\(\s*([\d.]+)px\s*\)/g)].map((m) => Number(m[1]));
      if (found.length === 0) continue;
      radii.push(...found);
      if (decl.property === 'backdrop-filter') backdropSurfaces += 1;
      else elementSurfaces += 1;
      if (!counted) {
        selectors.push(rule.selector);
        counted = true;
      }
    }
  }

  return {
    backdropSurfaces,
    elementSurfaces,
    radii,
    maxRadius: radii.length ? Math.max(...radii) : 0,
    selectors,
    viewportPercentage: null,
    viewportPercentageNote:
      'not computable from CSS text — the painted area depends on layout. Measure it on the ' +
      'rendered page (DevTools paint flashing, or a screenshot of the blurred region against ' +
      'the viewport box) before comparing it to the style budget.',
  };
}

/**
 * Inventory the declarations that promote an element to its own compositing
 * layer. Layer count is what the paint-cost budgets in each doc §8 are written
 * against, and it is the number that turns a smooth page into a janky one on a
 * mid-range Android device.
 */
function inventoryCompositing(rules) {
  const selectors = new Set();
  for (const rule of rules) {
    for (const decl of rule.declarations) {
      const promotes =
        decl.property === 'will-change' ||
        (decl.property === 'transform' && /translate3d|translateZ|rotate3d|scale3d|perspective/.test(decl.value)) ||
        (decl.property === 'position' && /^(fixed|sticky)$/.test(decl.value.trim())) ||
        decl.property === 'backdrop-filter' ||
        (decl.property === 'animation' && decl.value.trim() !== 'none') ||
        decl.property === 'animation-name';
      if (promotes) selectors.add(rule.selector);
    }
  }
  return { selectors: [...selectors], count: selectors.size };
}

/** Raw and gzipped byte counts. */
function countBytes(source) {
  const raw = Buffer.byteLength(source);
  const gzip = gzipSync(Buffer.from(source)).length;
  return { raw, gzip };
}

/** The units CSS itself writes closed up against their number. */
const TIGHT_UNITS = new Set(['%', 'px', 'em', 'rem', 'ch', 'vh', 'vw', 'pt', 'fr', 'deg', 'ms', 's', 'x']);

/**
 * Join a measurement to its unit for §4 of the audit report.
 *
 * The unit string comes from the calling style's own §8 limit table, so a
 * symbol unit and a word unit land in the same table — `{ unit: "px" }` for a
 * blur radius beside `{ unit: "bytes" }` for a payload. Concatenating both the
 * same way is what put "8192bytes" and "0layers" in a report a human reads.
 */
export function withUnit(value, unit) {
  if (!unit) return `${value}`;
  return TIGHT_UNITS.has(unit) ? `${value}${unit}` : `${value} ${unit}`;
}

/** Read a dotted path out of a measurement object. */
function at(object, path) {
  return path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), object);
}

/**
 * Judge a measurement against a limit table supplied by the style.
 *
 * The keys are dotted paths into `measure()`'s result, and the limits come from
 * the owning doc's §8. Core has no numbers of its own, so a measurement the
 * style did not ask about produces no row: §4 of the audit report carries only
 * the numbers that style's doc sets a limit for.
 */
export function compare(measured, limits) {
  const rows = [];
  for (const [key, spec] of Object.entries(limits ?? {})) {
    const value = at(measured, key);
    const unit = spec.unit ?? '';
    if (value === null || value === undefined) {
      rows.push({
        key,
        label: spec.label ?? key,
        measured: null,
        limit: spec.limit,
        unit,
        verdict: 'unknown',
        note:
          at(measured, `${key}Note`) ??
          'not computable from CSS text. Measure it on the rendered page.',
      });
      continue;
    }
    rows.push({
      key,
      label: spec.label ?? key,
      measured: value,
      limit: spec.limit,
      unit,
      verdict: value <= spec.limit ? 'pass' : 'FAIL',
    });
  }
  return rows;
}

/** Measure every counter this file knows how to compute. */
export function measure(source, { file = 'stylesheet.css' } = {}) {
  const rules = flattenRules(parseCss(source));
  return {
    file,
    bytes: countBytes(source),
    shadowLayers: censusShadowLayers(rules),
    blur: inventoryBlur(rules),
    compositing: inventoryCompositing(rules),
  };
}

/* --------------------------------------------------------------------- CLI */

const USAGE = `budget.mjs — layer, byte and blur counters for §4 of the audit report.

  node budget.mjs <file.css>... [--budget=limits.json] [--format=md|json]

Counters: bytes.raw, bytes.gzip, shadowLayers.max, shadowLayers.total,
shadowLayers.rulesWithShadows, blur.backdropSurfaces, blur.elementSurfaces,
blur.maxRadius, blur.viewportPercentage, compositing.count.

The limits file maps any of those dotted paths to { limit, label, unit }, and it
comes from the owning style doc's §8. This file has no numbers of its own, so a
counter with no limit is reported and not judged.

Without --budget the run only reports, and exits 0. With it, exit status is 1
when any limit is exceeded. A counter whose value is not computable from CSS
text is reported as "unknown" and never counts as a pass.`;

function renderMarkdown(measurements, rows) {
  const lines = [];
  for (const m of measurements) {
    lines.push(
      `### ${m.file}`,
      '',
      `- CSS bytes: ${m.bytes.raw} raw, ${m.bytes.gzip} gzip`,
      `- Shadow layers: ${m.shadowLayers.max} worst (\`${m.shadowLayers.worstSelector ?? 'none'}\`), ` +
        `${m.shadowLayers.total} across ${m.shadowLayers.rulesWithShadows} rules`,
      `- Blurred surfaces: ${m.blur.backdropSurfaces} backdrop, ${m.blur.elementSurfaces} element, ` +
        `max radius ${m.blur.maxRadius}px`,
      `- Compositing hints: ${m.compositing.count}`,
      '',
    );
  }
  if (rows.length) {
    lines.push('| Budget | Measured | Limit | Verdict |', '|---|---|---|---|');
    for (const r of rows) {
      const measured = r.measured === null ? `unknown — ${r.note}` : withUnit(r.measured, r.unit);
      lines.push(`| ${r.label} | ${measured} | ${withUnit(r.limit, r.unit)} | ${r.verdict} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

async function runCli(argv) {
  const flags = new Map();
  const files = [];
  for (const arg of argv) {
    const m = /^--([a-z0-9-]+)(?:=(.*))?$/i.exec(arg);
    if (m) flags.set(m[1], m[2] === undefined ? true : m[2]);
    else files.push(arg);
  }
  if (flags.has('help') || files.length === 0) {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }

  const { readFile } = await import('node:fs/promises');
  const measurements = [];
  for (const file of files) {
    measurements.push(measure(await readFile(file, 'utf8'), { file }));
  }

  const limits = flags.has('budget') ? JSON.parse(await readFile(flags.get('budget'), 'utf8')) : {};
  const rows = measurements.flatMap((m) => compare(m, limits));

  if (flags.get('format') === 'json') {
    process.stdout.write(`${JSON.stringify({ measurements, rows }, null, 2)}\n`);
  } else {
    process.stdout.write(`${renderMarkdown(measurements, rows)}\n`);
  }

  return rows.some((r) => r.verdict === 'FAIL') ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`budget.mjs: ${error.message}\n`);
      process.exitCode = 2;
    },
  );
}
