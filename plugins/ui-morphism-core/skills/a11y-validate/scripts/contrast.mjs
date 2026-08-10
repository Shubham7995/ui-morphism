#!/usr/bin/env node
/**
 * contrast.mjs — WCAG 2.x contrast maths for the ui-morphism skills.
 *
 * Ported from docs/check-contrast.py, whose maths has been verified across two
 * adversarial audits. Four properties are load-bearing and none of them may be
 * relaxed:
 *
 *   1. WCAG 2.x relative luminance, on 0-255 sRGB channels:
 *        s = c/255 ;  lin = s <= 0.04045 ? s/12.92 : ((s+0.055)/1.055)**2.4
 *        L = 0.2126*R + 0.7152*G + 0.0722*B
 *        ratio = (Lmax + 0.05) / (Lmin + 0.05)
 *   2. UNROUNDED comparison. A value is never rounded up to meet a threshold,
 *      so 2.999:1 fails 3:1 and 4.497:1 fails 4.5:1. `passes()` therefore has
 *      no tolerance parameter, and adding one would be a defect.
 *   3. Alpha compositing per channel in GAMMA-ENCODED sRGB —
 *      C = a*C_fill + (1-a)*C_backdrop on each of R, G and B, and only then
 *      linearise and reduce to a luminance. Averaging the two luminances
 *      (L = a*L_fill + (1-a)*L_backdrop) is a different and consistently
 *      optimistic model: doc 10 §7 records it claiming 4.52:1 for a pair that
 *      measures 1.50:1.
 *   4. A worst-case-backdrop solver, because seven of the ten styles put a
 *      translucent surface over a ground they do not own.
 *
 * Usable as a module or as a CLI. `node contrast.mjs --help` for the commands.
 */

/**
 * WCAG 2.x relative luminance of an opaque colour.
 *
 * Alpha is ignored on purpose: a translucent colour has no luminance until it
 * is composited, and treating alpha as if it scaled luminance is the averaging
 * bug this file exists to prevent.
 */
export function relativeLuminance(color) {
  const c = parseColor(color);
  return 0.2126 * srgbToLinear(c.r) + 0.7152 * srgbToLinear(c.g) + 0.0722 * srgbToLinear(c.b);
}

export class ColorError extends Error {}

const NAMED_COLOURS = {
  transparent: [0, 0, 0, 0],
  black: [0, 0, 0, 1],
  silver: [192, 192, 192, 1],
  gray: [128, 128, 128, 1],
  grey: [128, 128, 128, 1],
  white: [255, 255, 255, 1],
  maroon: [128, 0, 0, 1],
  red: [255, 0, 0, 1],
  purple: [128, 0, 128, 1],
  fuchsia: [255, 0, 255, 1],
  magenta: [255, 0, 255, 1],
  green: [0, 128, 0, 1],
  lime: [0, 255, 0, 1],
  olive: [128, 128, 0, 1],
  yellow: [255, 255, 0, 1],
  navy: [0, 0, 128, 1],
  blue: [0, 0, 255, 1],
  teal: [0, 128, 128, 1],
  aqua: [0, 255, 255, 1],
  cyan: [0, 255, 255, 1],
};

const UNSUPPORTED_FNS = ['oklch', 'oklab', 'lab', 'lch', 'hwb', 'color', 'color-mix'];

function clamp(value, lo, hi) {
  return value < lo ? lo : value > hi ? hi : value;
}

function parseAlphaComponent(raw) {
  const text = String(raw).trim();
  const value = Number.parseFloat(text);
  if (!Number.isFinite(value)) throw new ColorError(`alpha "${raw}" is not a number`);
  return clamp(text.endsWith('%') ? value / 100 : value, 0, 1);
}

function parseChannelComponent(raw) {
  const text = String(raw).trim();
  const value = Number.parseFloat(text);
  if (!Number.isFinite(value)) throw new ColorError(`channel "${raw}" is not a number`);
  return clamp(text.endsWith('%') ? (value / 100) * 255 : value, 0, 255);
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const lightness = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * lightness - 1)) * clamp(s, 0, 1);
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - c / 2;
  const table = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ];
  return table[Math.floor(hue / 60)].map((v) => (v + m) * 255);
}

function splitComponents(body) {
  const [main, alphaPart, ...rest] = body.split('/');
  if (rest.length) throw new ColorError(`too many "/" separators in "${body}"`);
  const parts = main.trim().split(/[\s,]+/).filter(Boolean);
  if (alphaPart !== undefined) parts.push(alphaPart.trim());
  return parts;
}

/**
 * Parse a CSS colour into `{ r, g, b, a }`, channels 0-255 (floats, so a
 * composite is never quantised) and alpha 0-1. Throws `ColorError` on anything
 * it cannot resolve exactly, including colour spaces it does not convert —
 * guessing at `oklch()` would produce a wrong number instead of an error.
 */
export function parseColor(input) {
  if (input && typeof input === 'object' && 'r' in input && 'g' in input && 'b' in input) {
    return {
      r: clamp(Number(input.r), 0, 255),
      g: clamp(Number(input.g), 0, 255),
      b: clamp(Number(input.b), 0, 255),
      a: input.a === undefined ? 1 : clamp(Number(input.a), 0, 1),
    };
  }
  if (typeof input !== 'string') throw new ColorError(`not a colour: ${JSON.stringify(input)}`);
  const text = input.trim().toLowerCase();
  if (!text) throw new ColorError('empty colour string');

  if (Object.prototype.hasOwnProperty.call(NAMED_COLOURS, text)) {
    const [r, g, b, a] = NAMED_COLOURS[text];
    return { r, g, b, a };
  }

  if (text.startsWith('#')) {
    const hex = text.slice(1);
    if (!/^[0-9a-f]+$/.test(hex)) throw new ColorError(`"${input}" is not a hex colour`);
    if (hex.length === 3 || hex.length === 4) {
      const expand = (ch) => Number.parseInt(ch + ch, 16);
      return {
        r: expand(hex[0]),
        g: expand(hex[1]),
        b: expand(hex[2]),
        a: hex.length === 4 ? expand(hex[3]) / 255 : 1,
      };
    }
    if (hex.length === 6 || hex.length === 8) {
      const pair = (i) => Number.parseInt(hex.slice(i, i + 2), 16);
      return { r: pair(0), g: pair(2), b: pair(4), a: hex.length === 8 ? pair(6) / 255 : 1 };
    }
    throw new ColorError(`"${input}" has ${hex.length} hex digits; 3, 4, 6 or 8 are colours`);
  }

  const fn = /^([a-z-]+)\((.*)\)$/s.exec(text);
  if (!fn) throw new ColorError(`"${input}" is not a colour this file can parse`);
  const [, name, body] = fn;
  if (UNSUPPORTED_FNS.includes(name)) {
    throw new ColorError(
      `${name}() is not converted here — resolve it to sRGB hex or rgb() before measuring contrast`,
    );
  }
  const parts = splitComponents(body);
  if (parts.length < 3 || parts.length > 4) {
    throw new ColorError(`${name}() needs 3 or 4 components, got ${parts.length}`);
  }
  const alpha = parts.length === 4 ? parseAlphaComponent(parts[3]) : 1;
  if (name === 'rgb' || name === 'rgba') {
    return {
      r: parseChannelComponent(parts[0]),
      g: parseChannelComponent(parts[1]),
      b: parseChannelComponent(parts[2]),
      a: alpha,
    };
  }
  if (name === 'hsl' || name === 'hsla') {
    const [r, g, b] = hslToRgb(
      Number.parseFloat(parts[0]),
      Number.parseFloat(parts[1]) / 100,
      Number.parseFloat(parts[2]) / 100,
    );
    return { r, g, b, a: alpha };
  }
  throw new ColorError(`${name}() is not a colour function this file understands`);
}

/**
 * The luminance envelope of a translucent fill over an unknown backdrop.
 *
 * Composite luminance is monotone increasing in every backdrop channel, so over
 * the whole sRGB cube it is bounded by the composite over black and the
 * composite over white — and every value between the two is reachable by
 * walking the black-to-white diagonal. That interval is the whole truth about a
 * fill whose ground you do not control.
 */
export function backdropEnvelope(fill) {
  const overBlack = composite(fill, '#000000');
  const overWhite = composite(fill, '#ffffff');
  return {
    overBlack,
    overWhite,
    luminanceMin: relativeLuminance(overBlack),
    luminanceMax: relativeLuminance(overWhite),
  };
}

/**
 * The grey backdrop, if any, that makes a translucent fill composite to exactly
 * the given luminance. Returns `null` when the target is outside the envelope.
 *
 * Bisection on the black-to-white diagonal. Composite luminance is continuous
 * and monotone along it, so the crossing is unique when it exists.
 */
function backdropForLuminance(fill, targetLuminance) {
  const env = backdropEnvelope(fill);
  if (targetLuminance < env.luminanceMin || targetLuminance > env.luminanceMax) return null;
  let lo = 0;
  let hi = 255;
  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    const l = relativeLuminance(composite(fill, { r: mid, g: mid, b: mid }));
    if (l < targetLuminance) lo = mid;
    else hi = mid;
  }
  const level = (lo + hi) / 2;
  return { r: level, g: level, b: level, a: 1 };
}

/**
 * The lowest contrast a translucent fill can offer a foreground, over any
 * backdrop in the sRGB cube.
 *
 * Composite luminance is monotone increasing in every backdrop channel, so the
 * whole reachable interval is [composite over black, composite over white].
 * Against a fixed foreground luminance the ratio decreases as the composite
 * approaches that luminance, so:
 *
 *   - if the interval lies entirely below the foreground, the worst ground is
 *     white (the composite gets as close as it can from below);
 *   - if it lies entirely above, the worst ground is black;
 *   - if the interval STRADDLES the foreground luminance, some real backdrop
 *     makes the composite exactly as light as the text and the honest answer is
 *     1:1. That is not a pathological case — it is what "I do not control the
 *     ground" means for a low-alpha fill.
 *
 * Returns `{ ratio, worstBackdrop, composite, luminance,
 * envelopeStraddlesForeground, envelope }`.
 */
export function worstCaseRatio(fill, foreground) {
  const fg = parseColor(foreground);
  if (fg.a < 1) {
    throw new ColorError(
      `foreground is translucent (alpha ${fg.a}); composite it over its own surface first`,
    );
  }
  const lFg = relativeLuminance(fg);
  const env = backdropEnvelope(fill);

  if (lFg >= env.luminanceMin && lFg <= env.luminanceMax) {
    const worstBackdrop = backdropForLuminance(fill, lFg);
    return {
      ratio: 1,
      worstBackdrop,
      composite: worstBackdrop ? composite(fill, worstBackdrop) : null,
      luminance: lFg,
      envelopeStraddlesForeground: true,
      envelope: env,
    };
  }

  // Outside the envelope: the worst ground is whichever endpoint the composite
  // luminance ends up nearest the foreground on.
  const overWhiteIsWorse = env.luminanceMax < lFg;
  const worstBackdrop = parseColor(overWhiteIsWorse ? '#ffffff' : '#000000');
  const surface = overWhiteIsWorse ? env.overWhite : env.overBlack;
  const luminance = overWhiteIsWorse ? env.luminanceMax : env.luminanceMin;
  return {
    ratio: ratioFromLuminances(lFg, luminance),
    worstBackdrop,
    composite: surface,
    luminance,
    envelopeStraddlesForeground: false,
    envelope: env,
  };
}

/**
 * Round a floor value UP to `dp` decimal places.
 *
 * A minimum alpha is a floor, so truncating it would publish a number that
 * fails the requirement it was solved for. The docs quote every crossing this
 * way — doc 10's exact 0.585213 is printed as 0.5853, doc 09's 0.419826 as
 * 0.4199 — and reproducing that is how the tests pin the solver to the docs
 * rather than to a tolerance.
 */
export function ceilTo(value, dp) {
  const scale = 10 ** dp;
  // Nudge by one part in 1e9 of a step so a value that is already exact at this
  // precision does not get pushed to the next step by binary representation.
  return Math.ceil(value * scale - 1e-9) / scale;
}

/**
 * The minimum alpha at which a translucent fill lets a foreground clear a
 * target ratio.
 *
 * `backdrop` defaults to the worst case over the whole sRGB cube, which is the
 * only safe assumption for a ground the style does not own (doc 03 §7's ground
 * clamp and doc 10 §7's alpha ladders are both this question). Pass an explicit
 * backdrop when the ground IS known — a hairline over a known tile, a scrim
 * over a known page — and the answer narrows accordingly.
 *
 * The ratio is monotone non-decreasing in alpha for any fill on the far side of
 * the foreground, so bisection is exact rather than a search. When alpha = 1
 * still misses the target the fill itself is the problem, and the result says
 * so instead of returning a number.
 *
 * Returns `{ feasible, alpha, ratio, ceil2, ceil4, target, backdrop,
 * ratioAtOne }`.
 */
export function solveMinAlpha(fill, foreground, { target = 4.5, backdrop = null } = {}) {
  const base = parseColor(fill);
  const at = (alpha) => {
    const tinted = { r: base.r, g: base.g, b: base.b, a: alpha };
    if (backdrop === null) return worstCaseRatio(tinted, foreground).ratio;
    return contrastRatio(foreground, composite(tinted, backdrop));
  };

  const ratioAtOne = at(1);
  if (!(ratioAtOne >= target)) {
    return {
      feasible: false,
      alpha: null,
      ratio: null,
      ceil2: null,
      ceil4: null,
      target,
      backdrop: backdrop === null ? 'worst-case' : parseColor(backdrop),
      ratioAtOne,
    };
  }

  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (at(mid) >= target) hi = mid;
    else lo = mid;
  }
  const alpha = hi;
  return {
    feasible: true,
    alpha,
    ratio: at(alpha),
    ceil2: ceilTo(alpha, 2),
    ceil4: ceilTo(alpha, 4),
    target,
    backdrop: backdrop === null ? 'worst-case' : parseColor(backdrop),
    ratioAtOne,
  };
}

/**
 * The required ratio for a piece of text, from WCAG 1.4.3's large-text rule:
 * 3:1 at >= 24px, or >= 18.66px when bold (weight >= 700); 4.5:1 otherwise.
 *
 * The 18.66px figure is 14pt expressed in CSS pixels and is the number the
 * criterion is written against; several of the docs round it to 19px in prose,
 * which is the conservative direction and does not change a verdict.
 */
export function requiredTextRatio({ fontSizePx = 16, fontWeight = 400, enhanced = false } = {}) {
  const bold = Number(fontWeight) >= 700;
  const large = fontSizePx >= 24 || (bold && fontSizePx >= 18.66);
  if (enhanced) return large ? 4.5 : 7;
  return large ? 3 : 4.5;
}

/**
 * Composite a translucent fill over an opaque backdrop, per channel, in
 * gamma-encoded sRGB: C = a*C_fill + (1-a)*C_backdrop.
 *
 * This is what a browser does, and it is not interchangeable with averaging the
 * two luminances. Doc 10 §7 records the averaging model claiming 4.52:1 for a
 * pair that measures 1.50:1 — a light fill over a dark ground is where the two
 * models diverge by roughly 3x, in the optimistic direction.
 *
 * Channels are returned as floats. Rounding here is not free: doc 10 quotes
 * `rgb(117.5, 118.7, 122.2)`, and the integer version moves the ratio in the
 * third decimal, which is exactly the precision the unrounded-comparison rule
 * cares about.
 */
export function composite(fill, backdrop) {
  const f = parseColor(fill);
  const b = parseColor(backdrop);
  if (b.a < 1) {
    throw new ColorError('backdrop must be opaque; composite the backdrop stack first');
  }
  const mix = (fc, bc) => f.a * fc + (1 - f.a) * bc;
  return { r: mix(f.r, b.r), g: mix(f.g, b.g), b: mix(f.b, b.b), a: 1 };
}

/** Contrast ratio from two already-computed luminances. Unrounded. */
export function ratioFromLuminances(la, lb) {
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Contrast ratio between two opaque colours, unrounded and order-independent.
 *
 * Throws if either operand carries alpha, because the answer would be a
 * fiction. Pass `{ assumeOpaque: true }` only when the caller has already
 * reasoned about the alpha — composite() and worstCaseRatio() are the honest
 * routes for a translucent surface.
 */
export function contrastRatio(colorA, colorB, { assumeOpaque = false } = {}) {
  const a = parseColor(colorA);
  const b = parseColor(colorB);
  if (!assumeOpaque) {
    for (const [label, c] of [
      ['first', a],
      ['second', b],
    ]) {
      if (c.a < 1) {
        throw new ColorError(
          `${label} operand is translucent (alpha ${c.a}); composite it over a backdrop first ` +
            '— see composite(), worstCaseRatio() and solveMinAlpha()',
        );
      }
    }
  }
  return ratioFromLuminances(relativeLuminance(a), relativeLuminance(b));
}

/**
 * The verdict. Raw comparison, no epsilon, no rounding: 2.999 fails 3, and
 * 4.497 fails 4.5. The W3C states a value is never rounded up to meet a
 * threshold, so this function has no tolerance parameter and never will.
 */
export function passes(ratio, required) {
  return ratio >= required;
}

/** sRGB transfer function, on a single 0-255 channel. */
export function srgbToLinear(channel) {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/* --------------------------------------------------------------------- CLI */

const USAGE = `contrast.mjs — WCAG 2.x contrast maths, unrounded.

  ratio       <fg> <bg> [--target=N]        an opaque pair
  composite   <fill> <backdrop>             per-channel sRGB composite
  worst-case  <fill> <fg> [--target=N]      lowest ratio over any backdrop
  solve-alpha <fill> <fg> [--target=N] [--backdrop=COLOR]
                                            minimum alpha that clears --target

Colours: #rgb, #rrggbb, #rgba, #rrggbbaa, rgb()/rgba(), hsl()/hsla() and the
16 CSS2 keywords. oklch()/lab()/color-mix() are refused rather than guessed at.

--target defaults to 4.5. --json prints the whole result object. Exit status is
1 when a --target is given and the measured value misses it, and 2 on bad input.`;

function formatRatio(value) {
  return `${value.toFixed(4)}:1`;
}

function formatColor(c) {
  const round = (n) => (Number.isInteger(n) ? n : Number(n.toFixed(1)));
  return c.a < 1
    ? `rgba(${round(c.r)}, ${round(c.g)}, ${round(c.b)}, ${Number(c.a.toFixed(4))})`
    : `rgb(${round(c.r)}, ${round(c.g)}, ${round(c.b)})`;
}

function runCli(argv) {
  const flags = new Map();
  const positional = [];
  for (const arg of argv) {
    const m = /^--([a-z0-9-]+)(?:=(.*))?$/i.exec(arg);
    if (m) flags.set(m[1], m[2] === undefined ? true : m[2]);
    else positional.push(arg);
  }
  const [command, ...args] = positional;
  if (!command || flags.has('help') || command === 'help') {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }
  const json = flags.has('json');
  const target = flags.has('target') ? Number(flags.get('target')) : null;
  const emit = (object, lines) => {
    if (json) process.stdout.write(`${JSON.stringify(object, null, 2)}\n`);
    else for (const line of lines) process.stdout.write(`${line}\n`);
  };

  if (command === 'ratio') {
    if (args.length !== 2) throw new Error('ratio needs exactly two colours');
    const ratio = contrastRatio(args[0], args[1]);
    const required = target ?? 4.5;
    const ok = passes(ratio, required);
    emit({ foreground: args[0], background: args[1], ratio, required, passes: ok }, [
      `${args[0]} on ${args[1]}: ${formatRatio(ratio)} — ${ok ? 'pass' : 'FAIL'} at ${required}:1`,
    ]);
    return target !== null && !ok ? 1 : 0;
  }

  if (command === 'composite') {
    if (args.length !== 2) throw new Error('composite needs a fill and a backdrop');
    const surface = composite(args[0], args[1]);
    const luminance = relativeLuminance(surface);
    emit({ fill: args[0], backdrop: args[1], composite: surface, luminance }, [
      `${args[0]} over ${args[1]} = ${formatColor(surface)}  L = ${luminance.toFixed(5)}`,
    ]);
    return 0;
  }

  if (command === 'worst-case') {
    if (args.length !== 2) throw new Error('worst-case needs a fill and a foreground');
    const result = worstCaseRatio(args[0], args[1]);
    const required = target ?? 4.5;
    const ok = passes(result.ratio, required);
    const ground = result.envelopeStraddlesForeground
      ? 'a backdrop that matches the foreground exactly'
      : formatColor(result.worstBackdrop);
    emit({ fill: args[0], foreground: args[1], required, passes: ok, ...result }, [
      `${args[1]} on ${args[0]}: worst case ${formatRatio(result.ratio)} over ${ground} —` +
        ` ${ok ? 'pass' : 'FAIL'} at ${required}:1`,
      result.envelopeStraddlesForeground
        ? '  some real backdrop makes the composite exactly as light as the text'
        : `  composite ${formatColor(result.composite)}  L = ${result.luminance.toFixed(5)}`,
    ]);
    return target !== null && !ok ? 1 : 0;
  }

  if (command === 'solve-alpha') {
    if (args.length !== 2) throw new Error('solve-alpha needs a fill and a foreground');
    const result = solveMinAlpha(args[0], args[1], {
      target: target ?? 4.5,
      backdrop: flags.has('backdrop') ? flags.get('backdrop') : null,
    });
    if (!result.feasible) {
      emit(result, [
        `${args[1]} on ${args[0]}: unreachable — even at alpha 1 the pair measures ` +
          `${formatRatio(result.ratioAtOne)}, short of ${result.target}:1`,
      ]);
      return 1;
    }
    const ground =
      result.backdrop === 'worst-case'
        ? 'a worst-case backdrop'
        : `a ${formatColor(result.backdrop)} backdrop`;
    emit(result, [
      `${args[1]} on ${args[0]} needs alpha >= ${result.alpha.toFixed(6)} for ` +
        `${result.target}:1 over ${ground}`,
      `  ship ${result.ceil2} — the lowest two-decimal alpha that still clears it`,
    ]);
    return 0;
  }

  throw new Error(`unknown command "${command}"\n\n${USAGE}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exitCode = runCli(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`contrast.mjs: ${error.message}\n`);
    process.exitCode = 2;
  }
}
