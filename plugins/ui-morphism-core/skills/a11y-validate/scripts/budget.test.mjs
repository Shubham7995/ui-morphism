/**
 * budget.test.mjs — run with `node --test` from this directory.
 *
 * budget.mjs counts; it does not judge. Which numbers matter and what the
 * limits are is a style fact from each doc's §8, so the limits arrive as input
 * and core supplies the counters and the comparison.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import * as budget from './budget.mjs';

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('./budget.mjs', import.meta.url));

/** Run the CLI and return `{ status, stdout, stderr }`; never throws. */
function cli(...args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? '', stderr: error.stderr ?? '' };
  }
}

test('the layer census counts shadow layers per declaration and finds the worst', () => {
  const css = `
.flat { box-shadow: 0 1px 2px #0002; }
.skeuo {
  box-shadow:
    0 1px 1px rgba(0,0,0,.20),
    0 4px 10px rgba(0,0,0,.14),
    inset 0 1px 0 rgba(255,255,255,.55),
    inset 0 -1px 0 rgba(0,0,0,.18);
}
.none { color: #000; }
`;
  const measured = budget.measure(css, { file: 'a.css' });
  assert.equal(measured.shadowLayers.max, 4);
  assert.equal(measured.shadowLayers.worstSelector, '.skeuo');
  assert.equal(measured.shadowLayers.total, 5);
  assert.equal(measured.shadowLayers.rulesWithShadows, 2);
  // A comma inside rgba() is not a layer separator, which is the only thing
  // that makes this count wrong when it is wrong.
  assert.deepEqual(
    measured.shadowLayers.perRule.find((r) => r.selector === '.flat'),
    { selector: '.flat', line: 2, layers: 1 },
  );
});

test('the blur inventory records every blurred surface and its radius', () => {
  const css = `
.nav { backdrop-filter: blur(20px) saturate(160%); position: fixed; inset: 0 0 auto 0; height: 64px; }
.card { backdrop-filter: blur(12px); }
.hero { filter: blur(4px); }
.opaque { background: #fff; }
`;
  const { blur } = budget.measure(css, { file: 'g.css' });
  assert.equal(blur.backdropSurfaces, 2, 'backdrop-filter blurs what is behind it');
  assert.equal(blur.elementSurfaces, 1, 'filter blurs the element itself, which is cheaper');
  assert.deepEqual(blur.radii.sort((a, b) => a - b), [4, 12, 20]);
  assert.equal(blur.maxRadius, 20);
  assert.deepEqual(blur.selectors, ['.nav', '.card', '.hero']);

  // The blurred VIEWPORT PERCENTAGE is what the budgets are written against and
  // it is not computable from CSS text — the painted area depends on layout. It
  // is reported as an explicit unknown rather than estimated into the report.
  assert.equal(blur.viewportPercentage, null);
  assert.match(blur.viewportPercentageNote, /rendered/);
});

test('bytes are counted raw and gzipped, and compositing hints are inventoried', () => {
  const css = `
.a { will-change: transform; }
.b { transform: translateZ(0); }
.c { position: fixed; top: 0; }
.d { opacity: 0.5; animation: fade 2s infinite; }
.e { color: #000; }
`;
  const measured = budget.measure(css, { file: 'p.css' });
  assert.equal(measured.bytes.raw, Buffer.byteLength(css));
  assert.ok(measured.bytes.gzip > 0 && measured.bytes.gzip < measured.bytes.raw);

  // Every one of these promotes an element to its own compositing layer, which
  // is the number the paint-cost budgets in each doc §8 are written against.
  assert.deepEqual(measured.compositing.selectors.sort(), ['.a', '.b', '.c', '.d']);
  assert.equal(measured.compositing.count, 4);
});

test('compare() judges measurements against a style-supplied limit table', () => {
  const css = `
.a { box-shadow: 0 1px 2px #0002, 0 4px 10px #0001, inset 0 1px 0 #fff9; }
.b { backdrop-filter: blur(28px); }
`;
  const measured = budget.measure(css, { file: 'x.css' });

  // Limits come from the OWNING doc's §8. Core has no numbers of its own, so a
  // key it is not given is simply not judged.
  const rows = budget.compare(measured, {
    'shadowLayers.max': { limit: 4, label: 'Shadow layers per element' },
    'blur.maxRadius': { limit: 20, label: 'Backdrop blur radius', unit: 'px' },
    'bytes.gzip': { limit: 8192, label: 'CSS bytes (gzip)' },
  });

  const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
  assert.equal(byKey['shadowLayers.max'].measured, 3);
  assert.equal(byKey['shadowLayers.max'].verdict, 'pass');
  assert.equal(byKey['blur.maxRadius'].measured, 28);
  assert.equal(byKey['blur.maxRadius'].verdict, 'FAIL');
  assert.equal(byKey['blur.maxRadius'].label, 'Backdrop blur radius');
  assert.equal(byKey['bytes.gzip'].verdict, 'pass');
  assert.equal(rows.length, 3, 'exactly the rows the style asked for, in its order');

  // A measurement the style did not ask about produces no row at all — §4 of
  // the report only carries numbers the style's own doc sets a limit for.
  assert.deepEqual(budget.compare(measured, {}), []);

  // An unknown value is reported as unknown rather than compared against a
  // limit it cannot meet or miss.
  const unknown = budget.compare(measured, {
    'blur.viewportPercentage': { limit: 25, label: 'Blurred viewport', unit: '%' },
  });
  assert.equal(unknown[0].verdict, 'unknown');
  assert.match(unknown[0].note, /rendered/);
});

test('a measurement is joined to its unit with a separator when the unit is a word', () => {
  // §4 of the audit report is read by a human. "8192bytes" and "0layers" are
  // what concatenation produces, and both shipped verbatim into the report.
  assert.equal(budget.withUnit(8192, 'bytes'), '8192 bytes');
  assert.equal(budget.withUnit(0, 'layers'), '0 layers');
  assert.equal(budget.withUnit(3, 'surfaces'), '3 surfaces');

  // The units CSS itself writes closed up stay closed up.
  assert.equal(budget.withUnit(28, 'px'), '28px');
  assert.equal(budget.withUnit(25, '%'), '25%');
  assert.equal(budget.withUnit(200, 'ms'), '200ms');

  // No unit is still just the number, with no stray space.
  assert.equal(budget.withUnit(4, ''), '4');
  assert.equal(budget.withUnit(4, undefined), '4');
});

test('the markdown table renders a word unit with its separator, in both columns', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'um-budget-unit-'));
  const css = path.join(dir, 'g.css');
  writeFileSync(css, '.b { box-shadow: 0 1px 2px #0002; }');
  const limits = path.join(dir, 'budget.json');
  writeFileSync(
    limits,
    JSON.stringify({
      'bytes.gzip': { limit: 8192, label: 'CSS bytes (gzip)', unit: 'bytes' },
      'shadowLayers.max': { limit: 4, label: 'Shadow layers', unit: 'layers' },
    }),
  );

  // This table is §4 of a user-facing audit report, verbatim.
  const out = cli(css, `--budget=${limits}`).stdout;
  assert.doesNotMatch(out, /\d(bytes|layers)/, 'no "8192bytes" or "1layers" in a report row');
  assert.match(out, /\| 8192 bytes \|/, 'the limit column carries the separator too');
  assert.match(out, /\| 1 layers \|/);

  rmSync(dir, { recursive: true, force: true });
});

test('the CLI measures files, applies a --budget file, and exits on an exceeded limit', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'um-budget-'));
  const css = path.join(dir, 'g.css');
  writeFileSync(css, '.b { backdrop-filter: blur(28px); }');

  // Without a budget it only reports, and reporting is never a failure.
  const bare = cli(css);
  assert.equal(bare.status, 0);
  assert.match(bare.stdout, /28/);

  const limits = path.join(dir, 'budget.json');
  writeFileSync(
    limits,
    JSON.stringify({ 'blur.maxRadius': { limit: 20, label: 'Backdrop blur radius', unit: 'px' } }),
  );
  const judged = cli(css, `--budget=${limits}`);
  assert.equal(judged.status, 1, 'an exceeded limit exits 1');
  assert.match(judged.stdout, /Backdrop blur radius/);
  assert.match(judged.stdout, /FAIL/);
  assert.match(judged.stdout, /\|/, 'markdown, because it lands in §4 of the report');

  const json = JSON.parse(cli(css, `--budget=${limits}`, '--format=json').stdout);
  assert.equal(json.rows[0].verdict, 'FAIL');
  assert.equal(json.measurements[0].blur.maxRadius, 28);

  assert.equal(cli('--help').status, 0);
  rmSync(dir, { recursive: true, force: true });
});
