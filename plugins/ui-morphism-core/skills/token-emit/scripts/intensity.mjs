#!/usr/bin/env node
/**
 * intensity.mjs — the intensity 0-100 contract, its clamp mechanism and its
 * context-cap mechanism.
 *
 * Core owns all three. A style owns its knob endpoints, its curves, its clamp
 * values and its caps. Specification: docs/MARKETPLACE.md §7.2, restated with
 * the five rules in ../references/intensity-contract.md.
 */

export class IntensityError extends Error {}

/**
 * Evaluate one knob at an intensity.
 *
 * Linear between the declared endpoints unless the style supplies a `curve`.
 * `at0` above `at100` is not an error — it is an inverse knob, which rule 1
 * explicitly permits as long as it does not reverse mid-range.
 */
function evaluateKnob(knob, value) {
  if (typeof knob.curve === 'function') return knob.curve(value);
  const raw = Array.isArray(knob.anchors)
    ? interpolateAnchors(knob.anchors, value)
    : knob.at0 + (knob.at100 - knob.at0) * (value / 100);
  // Kill the float dust that turns 7.2 into 7.199999999999999.
  return Number(raw.toFixed(6));
}

/**
 * Interpolate a declarative piecewise-linear curve.
 *
 * `anchors` is `[[intensity, value], ...]`, ascending in intensity and spanning
 * 0 to 100. A style owns its curves, but the contract the CLI consumes is JSON
 * and JSON cannot carry a function. Every style built so far states a midpoint
 * a straight line between the endpoints cannot reach — brutalism's "4px at 50"
 * and "5px at 50", glassmorphism's rung defaults at 50, bento's defaults at 45
 * — so the two-endpoint form alone cannot express a real style's knob table.
 * This is the declarative form of the `curve` escape hatch.
 */
function interpolateAnchors(anchors, value) {
  if (value <= anchors[0][0]) return anchors[0][1];
  for (let i = 1; i < anchors.length; i += 1) {
    const [x0, y0] = anchors[i - 1];
    const [x1, y1] = anchors[i];
    if (value <= x1) return y0 + ((y1 - y0) * (value - x0)) / (x1 - x0);
  }
  return anchors[anchors.length - 1][1];
}

/**
 * Resolve a style's knobs at a requested intensity.
 *
 * Returns `{ requested, effective, capApplied, capReason, knobs, clamped }`.
 * Everything the audit report's §5 needs is in that object, which is the point:
 * a cap that is applied without being reported is indistinguishable from a bug.
 */
export function resolveIntensity(contract, requested, context = {}) {
  // Rule 5: caps apply to the intensity, before any curve is evaluated. The
  // lowest matching cap wins, because two caps both apply.
  let effective = requested;
  let capApplied = false;
  let capReason = null;
  for (const cap of contract.contextCaps ?? []) {
    const matches = Object.entries(cap.when ?? {}).every(([key, value]) => context[key] === value);
    if (matches && cap.cap < effective) {
      effective = cap.cap;
      capApplied = true;
      capReason = cap.reason;
    }
  }

  const knobs = {};
  const clamped = [];
  for (const [name, knob] of Object.entries(contract.knobs ?? {})) {
    const raw = evaluateKnob(knob, effective);
    // Rule 4: hard clamps are independent of intensity, so they apply AFTER the
    // curve and at every value including 100. A clamped knob is reported.
    const bounds = contract.clamps?.[name] ?? {};
    let value = raw;
    if (bounds.min !== undefined && value < bounds.min) {
      value = bounds.min;
      clamped.push({ knob: name, from: raw, to: value, bound: 'min', limit: bounds.min });
    } else if (bounds.max !== undefined && value > bounds.max) {
      value = bounds.max;
      clamped.push({ knob: name, from: raw, to: value, bound: 'max', limit: bounds.max });
    }
    knobs[name] = value;
  }
  return { requested, effective, capApplied, capReason, knobs, clamped };
}

/**
 * Check a style's knob table against the five rules of the contract.
 *
 * Returns `{ errors }`. Rule 1 is checked by sweeping 0 to 100 in steps of 1
 * and asserting each knob's sequence never changes direction; the sweep is
 * cheap and it catches a curve whose endpoints look fine.
 */
export function validateContract(contract) {
  const errors = [];

  // Rule 1: monotone. An inverse knob is fine; a reversing one is not.
  for (const [name, knob] of Object.entries(contract.knobs ?? {})) {
    let direction = 0;
    let previous = evaluateKnob(knob, 0);
    for (let i = 1; i <= 100; i += 1) {
      const current = evaluateKnob(knob, i);
      const step = Math.sign(current - previous);
      if (step !== 0) {
        if (direction !== 0 && step !== direction) {
          errors.push(
            `knob "${name}" reverses direction at intensity ${i}. Rule 1: every knob moves in ` +
              'one direction across 0-100. An inverse knob is permitted; a reversing one makes ' +
              'intensity meaningless as a dial, because turning it up can undo the last turn.',
          );
          break;
        }
        direction = step;
      }
      previous = current;
    }
  }

  // Rule 2: intensity 0 is a usable, accessible, recognisable-as-plain
  // baseline, never nothing. A style that describes its zero as "off" has not
  // written a baseline, it has written an absence — and the whole reason
  // intensity is safe for an agent to turn is that the bottom of the range is a
  // defensible interface.
  const baseline = String(contract.baselineAtZero ?? '').trim();
  if (!baseline || /^(none|off|nothing|n\/a)\.?$/i.test(baseline)) {
    errors.push(
      'baselineAtZero must describe what intensity 0 still produces. Rule 2: zero is a ' +
        'bordered, accessible, unornamented baseline, never an absence.',
    );
  }

  // Rule 4: core enforces the EXISTENCE of a clamp table, never its values.
  const clamps = contract.clamps ?? {};
  if (Object.keys(clamps).length === 0) {
    errors.push(
      'clamps is empty. Rule 4: every style declares a clamp table, because a hard clamp is ' +
        'independent of intensity and has to hold at 100 as well as at 0. The values are yours.',
    );
  }
  for (const name of Object.keys(clamps)) {
    if (!(name in (contract.knobs ?? {}))) {
      errors.push(
        `clamps.${name} names a knob this contract does not declare, so it can never fire. ` +
          'A clamp that cannot fire reads as protection that is not there.',
      );
    }
  }

  return { errors };
}

/* --------------------------------------------------------------------- CLI */

const USAGE = `intensity.mjs — the intensity 0-100 contract, its clamps and its caps.

  node intensity.mjs <contract.json> --intensity=N [--context=k=v,k=v] [--format=text|json]

The contract is a style's knob table:

  {
    "style": "brutalism",
    "default": 60,
    "baselineAtZero": "A bordered, square, flat control with a visible focus ring.",
    "knobs":   { "shadowOffset": { "at0": 0, "at100": 12, "unit": "px" } },
    "clamps":  { "shadowOffset": { "min": 0 } },
    "contextCaps": [{ "when": { "scope": "product" }, "cap": 45, "reason": "..." }]
  }

The contract is validated against the five rules before it is resolved, and a
contract that breaks one exits 2 rather than resolving. The default output is
the line that belongs in §5 Corrections of the audit report.`;

/** The §5 Corrections line for a resolution. */
export function describe(result, style) {
  const lines = [
    `${style ?? 'style'}: requested ${result.requested}, effective ${result.effective}.`,
  ];
  if (result.capApplied) {
    lines.push(`  Context cap applied (contract rule 5): ${result.capReason}`);
  }
  for (const clamp of result.clamped) {
    lines.push(
      `  Clamped ${clamp.knob} from ${clamp.from} to ${clamp.to} at its ${clamp.bound} ` +
        `of ${clamp.limit} (contract rule 4).`,
    );
  }
  for (const [knob, value] of Object.entries(result.knobs)) {
    lines.push(`  ${knob} = ${value}`);
  }
  return lines.join('\n');
}

async function runCli(argv) {
  const flags = new Map();
  const positional = [];
  for (const arg of argv) {
    const m = /^--([a-z0-9-]+)(?:=(.*))?$/i.exec(arg);
    if (m) flags.set(m[1], m[2] === undefined ? true : m[2]);
    else positional.push(arg);
  }
  if (flags.has('help') || positional.length === 0) {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }

  // An unrecognised flag is rejected rather than ignored. The failure this
  // prevents is quiet and expensive: `--scope=product` looks exactly like the
  // real `--context=scope=product`, and silently dropping it resolves the full
  // uncapped intensity while printing a confident, wrong-looking-correct
  // result. A context cap that does not apply is the one output of this tool
  // nobody would think to double-check.
  const KNOWN = new Set(['help', 'intensity', 'context', 'format']);
  const unknown = [...flags.keys()].filter((k) => !KNOWN.has(k));
  if (unknown.length) {
    throw new IntensityError(
      `unknown flag${unknown.length > 1 ? 's' : ''}: ${unknown.map((k) => `--${k}`).join(', ')}. ` +
      `Known flags are ${[...KNOWN].map((k) => `--${k}`).join(', ')}. ` +
      `Context caps are passed as --context=key=value, for example --context=scope=product.`);
  }

  const { readFile } = await import('node:fs/promises');
  const contract = JSON.parse(await readFile(positional[0], 'utf8'));

  const { errors } = validateContract(contract);
  if (errors.length) {
    throw new IntensityError(`contract does not satisfy the intensity contract:\n${errors.join('\n')}`);
  }

  const context = {};
  for (const pair of String(flags.get('context') ?? '').split(',').filter(Boolean)) {
    const [key, value] = pair.split('=');
    context[key.trim()] = value?.trim();
  }

  const requested = flags.has('intensity') ? Number(flags.get('intensity')) : contract.default;
  if (!Number.isFinite(requested) || requested < 0 || requested > 100) {
    throw new IntensityError(`intensity "${flags.get('intensity')}" is not a number in 0-100`);
  }

  const result = resolveIntensity(contract, requested, context);
  if (flags.get('format') === 'json') {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write(`${describe(result, contract.style)}\n`);
  }
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`intensity.mjs: ${error.message}\n`);
      process.exitCode = 2;
    },
  );
}
