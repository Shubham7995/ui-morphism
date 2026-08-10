/**
 * intensity.test.mjs — run with `node --test` from this directory.
 *
 * The five rules under test are stated in ../references/intensity-contract.md
 * and come from docs/MARKETPLACE.md §7.2. Core owns the contract, the clamp
 * mechanism and the context-cap mechanism; the knob values in these fixtures
 * belong to a style and are used only to exercise the mechanism.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import * as intensity from './intensity.mjs';

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('./intensity.mjs', import.meta.url));

/** Run the CLI and return `{ status, stdout, stderr }`; never throws. */
function cli(...args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? '', stderr: error.stderr ?? '' };
  }
}

/** doc 07 §13's brutalism knobs, used here only as a worked example. */
function brutalismContract() {
  return {
    style: 'brutalism',
    default: 60,
    baselineAtZero: 'A bordered, square, flat control with a visible focus ring.',
    knobs: {
      shadowOffset: { at0: 0, at100: 12, unit: 'px' },
      borderWidth: { at0: 1, at100: 5, unit: 'px' },
      radius: { at0: 12, at100: 0, unit: 'px' },
      chroma: { at0: 35, at100: 100, unit: '%' },
      tilt: { at0: 0, at100: 3, unit: 'deg' },
    },
    clamps: { borderWidth: { min: 1, max: 5 } },
    contextCaps: [
      {
        when: { scope: 'product' },
        cap: 45,
        reason: 'Product surfaces carry sustained reading (doc 07 §13).',
      },
    ],
  };
}

test('resolveIntensity interpolates every knob between its declared endpoints', () => {
  const at60 = intensity.resolveIntensity(brutalismContract(), 60);
  assert.equal(at60.requested, 60);
  assert.equal(at60.effective, 60);
  assert.deepEqual(at60.knobs, {
    shadowOffset: 7.2,
    borderWidth: 3.4,
    // An inverse knob still moves with intensity — the knob falls while the
    // style gets louder, which is rule 1's whole point.
    radius: 4.8,
    chroma: 74,
    tilt: 1.8,
  });
});

test('rule 5 — a context cap lowers the effective intensity BEFORE any curve runs', () => {
  const loud = intensity.resolveIntensity(brutalismContract(), 90, { scope: 'product' });
  assert.equal(loud.requested, 90);
  assert.equal(loud.effective, 45, 'doc 07 caps product surfaces at 45');
  assert.equal(loud.capApplied, true);
  assert.match(loud.capReason, /sustained reading/);
  // The knobs are the capped ones, not the requested ones.
  assert.deepEqual(loud.knobs, intensity.resolveIntensity(brutalismContract(), 45).knobs);

  // A request already below the cap is untouched, and reports no cap.
  const quiet = intensity.resolveIntensity(brutalismContract(), 30, { scope: 'product' });
  assert.equal(quiet.effective, 30);
  assert.equal(quiet.capApplied, false);
  assert.equal(quiet.capReason, null);

  // A context the style does not cap on leaves the request alone.
  assert.equal(intensity.resolveIntensity(brutalismContract(), 90, { scope: 'brand' }).effective, 90);

  // The lowest matching cap wins when more than one applies.
  const twoCaps = brutalismContract();
  twoCaps.contextCaps.push({ when: { surfaceType: 'app-accent' }, cap: 30, reason: 'Second cap.' });
  const capped = intensity.resolveIntensity(twoCaps, 100, {
    scope: 'product',
    surfaceType: 'app-accent',
  });
  assert.equal(capped.effective, 30);
});

test('rule 4 — a hard clamp applies AFTER the curve and is reported, never silent', () => {
  const contract = brutalismContract();
  // A style whose curve would push a knob past its own floor at low intensity.
  contract.knobs.borderWidth = { at0: 0, at100: 5, unit: 'px' };
  contract.clamps.borderWidth = { min: 1, max: 5 };

  const at0 = intensity.resolveIntensity(contract, 0);
  assert.equal(at0.knobs.borderWidth, 1, 'clamped up to its floor');
  assert.deepEqual(at0.clamped, [
    { knob: 'borderWidth', from: 0, to: 1, bound: 'min', limit: 1 },
  ]);

  // The clamp is independent of intensity: it also bites at 100.
  contract.knobs.borderWidth = { at0: 2, at100: 9, unit: 'px' };
  const at100 = intensity.resolveIntensity(contract, 100);
  assert.equal(at100.knobs.borderWidth, 5);
  assert.deepEqual(at100.clamped, [
    { knob: 'borderWidth', from: 9, to: 5, bound: 'max', limit: 5 },
  ]);

  // Nothing to report when the curve stays inside the bounds.
  assert.deepEqual(intensity.resolveIntensity(contract, 40).clamped, []);
});

test('rule 1 — validateContract sweeps 0 to 100 and rejects a knob that reverses', () => {
  assert.deepEqual(intensity.validateContract(brutalismContract()).errors, []);

  // A knob that goes up then comes back down makes intensity meaningless as a
  // dial, because turning it up can undo the last turn.
  const reversing = brutalismContract();
  reversing.knobs.tilt = { at0: 0, at100: 0, curve: (i) => (i <= 50 ? i / 10 : (100 - i) / 10) };
  assert.match(intensity.validateContract(reversing).errors.join('\n'), /tilt/);

  // An INVERSE knob is not a reversing one, and must pass.
  const inverse = brutalismContract();
  inverse.knobs.fillAlpha = { at0: 0.95, at100: 0.55 };
  assert.deepEqual(intensity.validateContract(inverse).errors, []);
});

test('rule 2 — intensity 0 must be a described baseline, never an absence', () => {
  for (const empty of ['', 'none', 'off', 'nothing', undefined]) {
    const contract = brutalismContract();
    contract.baselineAtZero = empty;
    assert.match(
      intensity.validateContract(contract).errors.join('\n'),
      /baselineAtZero/,
      `"${empty}" is not a baseline`,
    );
  }
});

test('rule 4 — core enforces that a clamp table EXISTS, and leaves its values alone', () => {
  const noClamps = brutalismContract();
  delete noClamps.clamps;
  assert.match(intensity.validateContract(noClamps).errors.join('\n'), /clamps/);

  const emptyClamps = brutalismContract();
  emptyClamps.clamps = {};
  assert.match(intensity.validateContract(emptyClamps).errors.join('\n'), /clamps/);

  // A clamp naming a knob that does not exist never fires, which is worse than
  // having no clamp at all — it reads as protection that is not there.
  const stray = brutalismContract();
  stray.clamps = { fillAlpha: { min: 0.55 } };
  assert.match(intensity.validateContract(stray).errors.join('\n'), /fillAlpha/);

  // Core has no opinion about the VALUES: a 0.55 floor and a 3-layer ceiling
  // are equally acceptable, because they are the style's numbers.
  const values = brutalismContract();
  values.clamps = { shadowOffset: { max: 4 }, tilt: { max: 0 } };
  assert.deepEqual(intensity.validateContract(values).errors, []);
});

test('the CLI resolves a contract file and reports the cap in report-ready prose', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'um-intensity-'));
  const file = path.join(dir, 'contract.json');
  writeFileSync(file, JSON.stringify(brutalismContract()));

  const plain = JSON.parse(cli(file, '--intensity=60', '--format=json').stdout);
  assert.equal(plain.effective, 60);
  assert.equal(plain.knobs.shadowOffset, 7.2);

  const capped = cli(file, '--intensity=90', '--context=scope=product');
  assert.equal(capped.status, 0);
  // The default output is the line that goes straight into §5 Corrections.
  assert.match(capped.stdout, /requested 90/);
  assert.match(capped.stdout, /effective 45/);
  assert.match(capped.stdout, /sustained reading/);

  // A contract that breaks the five rules fails loudly rather than resolving.
  const broken = path.join(dir, 'broken.json');
  const bad = brutalismContract();
  bad.baselineAtZero = 'none';
  writeFileSync(broken, JSON.stringify(bad));
  const failed = cli(broken, '--intensity=50');
  assert.equal(failed.status, 2);
  assert.match(failed.stderr, /baselineAtZero/);

  assert.equal(cli('--help').status, 0);
  rmSync(dir, { recursive: true, force: true });
});

/* --------------------------------------------------------------------------
 * Declarative curves. A style owns its curves (rule 1), but the contract the
 * CLI consumes is JSON, and JSON cannot carry a function. Every style built so
 * far states a midpoint a straight line between the endpoints cannot reach —
 * brutalism's "4px at 50" and "5px at 50", glassmorphism's rung defaults at 50,
 * bento's defaults at 45 — so the two-endpoint form alone cannot express a real
 * style's knob table.
 * ------------------------------------------------------------------------ */

test('anchors express a piecewise-linear curve a two-endpoint line cannot reach', () => {
  // docs/07-brutalism.md §13: shadowOffset is 0px at 0, 4px at 50, 12px at 100.
  const knob = { anchors: [[0, 0], [50, 4], [100, 12]] };
  const contract = {
    style: 'brutalism',
    baselineAtZero: 'A bordered, square, flat control with a visible focus ring.',
    knobs: { shadowOffset: knob },
    clamps: { shadowOffset: { min: 0 } },
  };
  const at = (i) => intensity.resolveIntensity(contract, i).knobs.shadowOffset;

  assert.equal(at(0), 0);
  assert.equal(at(50), 4, 'the declared midpoint is hit exactly, not averaged away');
  assert.equal(at(100), 12);
  assert.equal(at(25), 2, 'lower segment interpolates between 0 and 4');
  assert.equal(at(60), 5.6, 'upper segment interpolates between 4 and 12');
  // A straight line 0 -> 12 would put intensity 50 at 6px, which is the whole
  // reason the anchor form exists.
  assert.notEqual(at(50), 6);

  assert.deepEqual(intensity.validateContract(contract).errors, []);
});

test('an inverse anchored knob is monotone and still hits its midpoint', () => {
  // docs/07-brutalism.md §13: radius is 12px at 0, 5px at 50, 0px at 100.
  const contract = {
    style: 'brutalism',
    baselineAtZero: 'A bordered, square, flat control with a visible focus ring.',
    knobs: { radius: { anchors: [[0, 12], [50, 5], [100, 0]] } },
    clamps: { radius: { max: 12 } },
  };
  const at = (i) => intensity.resolveIntensity(contract, i).knobs.radius;
  assert.equal(at(0), 12);
  assert.equal(at(50), 5);
  assert.equal(at(100), 0);
  assert.equal(at(60), 4);
  assert.deepEqual(intensity.validateContract(contract).errors, []);
});

test('the monotone sweep still rejects an anchored knob that reverses', () => {
  const contract = {
    style: 'demo',
    baselineAtZero: 'A plain control.',
    knobs: { wobble: { anchors: [[0, 0], [50, 10], [100, 2]] } },
    clamps: { wobble: { min: 0 } },
  };
  const { errors } = intensity.validateContract(contract);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /wobble/);
  assert.match(errors[0], /reverses direction/);
});
