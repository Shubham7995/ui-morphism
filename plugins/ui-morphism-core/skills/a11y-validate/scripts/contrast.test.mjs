/**
 * contrast.test.mjs — run with `node --test` from this directory.
 *
 * Every expected number in this file is copied from a document in `docs/`, not
 * from memory. Docs quote most ratios at two decimals, so rows sourced from a
 * table are checked to +/- 0.005 — half a step of their own printed precision.
 * Figures the docs print at four or five decimals are checked at that precision.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  ColorError,
  backdropEnvelope,
  ceilTo,
  composite,
  contrastRatio,
  parseColor,
  passes,
  ratioFromLuminances,
  relativeLuminance,
  requiredTextRatio,
  solveMinAlpha,
  srgbToLinear,
  worstCaseRatio,
} from './contrast.mjs';

const SCRIPT = fileURLToPath(new URL('./contrast.mjs', import.meta.url));

/** Run the CLI and return `{ status, stdout }`; never throws on exit status. */
function cli(...args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
    return { status: 0, stdout };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? '' };
  }
}

test('srgbToLinear returns 0 for a zero channel', () => {
  assert.equal(srgbToLinear(0), 0);
});

test('relativeLuminance of black is 0', () => {
  assert.equal(relativeLuminance('#000000'), 0);
});

test('the three canonical WCAG reference pairs, measured unrounded', () => {
  // #767676 on white = 4.5422, black on white = 21, #0000FF on white = 8.5925.
  const grey = contrastRatio('#767676', '#ffffff');
  assert.ok(Math.abs(grey - 4.5422) <= 5e-5, `#767676 on white: got ${grey}`);
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
  const blue = contrastRatio('#0000FF', '#ffffff');
  assert.ok(Math.abs(blue - 8.5925) <= 5e-5, `#0000FF on white: got ${blue}`);
  // Order must not matter, and the ratio is symmetric.
  assert.equal(contrastRatio('#ffffff', '#000000'), 21);
  // #767676 is the darkest grey that clears 4.5:1 on white; one step fails.
  assert.ok(passes(grey, 4.5));
  assert.ok(!passes(contrastRatio('#777777', '#ffffff'), 4.5));
});

test('doc 07 §7 — the eleven verified rows of the brutalism contrast table', () => {
  // Quoted at two decimals in the doc, so checked to half a step of that.
  const rows = [
    ['#0A0A0A', '#FEF6E4', 18.4, 'body'],
    ['#0A0A0A', '#FFDC58', 14.74, 'yellow button'],
    ['#0A0A0A', '#67E8F9', 13.66, 'cyan'],
    ['#0A0A0A', '#A3E635', 13.13, 'lime'],
    ['#0A0A0A', '#FF7A1A', 7.59, 'orange'],
    ['#0A0A0A', '#FF6B9D', 7.39, 'pink'],
    ['#0A0A0A', '#FF4D4D', 6.05, 'danger'],
    ['#FFFFFF', '#FF6B9D', 2.68, 'white on pink — fail'],
    ['#FFDC58', '#FFFFFF', 1.34, 'yellow on white — catastrophic fail'],
    ['#000000', '#2E2E38', 1.56, 'black border on dark surface — fails 1.4.11'],
    ['#F5F0E6', '#2E2E38', 11.82, 'flipped border on dark surface — passes'],
  ];
  for (const [fg, bg, expected, label] of rows) {
    const got = contrastRatio(fg, bg);
    assert.ok(Math.abs(got - expected) <= 0.005, `${label}: expected ${expected}, got ${got}`);
  }
});

test('doc 09 §7 — the six opaque rows of the bento contrast table', () => {
  const rows = [
    ['#1d1d1f', '#f5f5f7', 15.46],
    ['#6e6e73', '#f5f5f7', 4.66],
    ['#f5f5f7', '#161617', 16.61],
    ['#a1a1a6', '#161617', 7.03],
    ['#0071e3', '#f5f5f7', 4.31],
    ['#0a84ff', '#161617', 4.96],
  ];
  for (const [fg, bg, expected] of rows) {
    const got = contrastRatio(fg, bg);
    assert.ok(Math.abs(got - expected) <= 0.005, `${fg} on ${bg}: expected ${expected}, got ${got}`);
  }
});

test('parseColor resolves every colour syntax the docs write, and refuses the rest', () => {
  assert.deepEqual(parseColor('#abc'), { r: 170, g: 187, b: 204, a: 1 });
  assert.deepEqual(parseColor('#0A0A0A'), { r: 10, g: 10, b: 10, a: 1 });
  assert.deepEqual(parseColor('#000f'), { r: 0, g: 0, b: 0, a: 1 });
  assert.ok(Math.abs(parseColor('#0000007f').a - 127 / 255) <= 1e-12, 'eight-digit alpha');
  assert.deepEqual(parseColor('rgb(0, 113, 227)'), { r: 0, g: 113, b: 227, a: 1 });
  assert.deepEqual(parseColor('rgba(255, 255, 255, 0.12)'), { r: 255, g: 255, b: 255, a: 0.12 });
  assert.deepEqual(parseColor('rgb(16 16 20 / 45%)'), { r: 16, g: 16, b: 20, a: 0.45 });
  assert.deepEqual(parseColor('white'), { r: 255, g: 255, b: 255, a: 1 });
  assert.deepEqual(parseColor('black'), { r: 0, g: 0, b: 0, a: 1 });
  const red = parseColor('hsl(0, 100%, 50%)');
  assert.ok(Math.abs(red.r - 255) <= 1e-9 && red.g <= 1e-9 && red.b <= 1e-9, 'hsl red');
  // Spaces this file does not convert must fail loudly rather than guess.
  assert.throws(() => parseColor('oklch(62% 0.19 259)'), ColorError);
  assert.throws(() => parseColor('color-mix(in oklab, red, blue)'), ColorError);
  assert.throws(() => parseColor('#12345'), ColorError);
  assert.throws(() => parseColor('rebeccapurple'), ColorError);
});

test('composite mixes per channel in gamma-encoded sRGB', () => {
  // doc 10 §7: fill #14161C at alpha 0.585 over white -> rgb(117.5, 118.7, 122.2),
  // L = 0.18350, and white text on it measures 4.497:1 — which FAILS 4.5:1.
  const surface = composite('rgba(20,22,28,0.585)', '#ffffff');
  assert.ok(Math.abs(surface.r - 117.5) <= 0.05, `r: ${surface.r}`);
  assert.ok(Math.abs(surface.g - 118.7) <= 0.05, `g: ${surface.g}`);
  assert.ok(Math.abs(surface.b - 122.2) <= 0.05, `b: ${surface.b}`);
  assert.ok(Math.abs(relativeLuminance(surface) - 0.1835) <= 5e-5, 'L of the composite');
  const ratio = contrastRatio('#ffffff', surface);
  assert.ok(Math.abs(ratio - 4.497) <= 5e-4, `the round-up trap: ${ratio}`);
  assert.ok(!passes(ratio, 4.5), '4.497:1 fails 4.5:1 — it is not "4.5:1"');
});

test('the luminance-averaging model is not what this file does — doc 10 §7 example', () => {
  // White fill at alpha 0.20 over black, dark ink #101014. Per channel this is
  // 1.50:1; averaging luminances claims 4.52:1, which is the defect doc 10
  // names as "shipping body text at a third of the contrast you believed".
  const lightGlass = composite('rgba(255,255,255,0.20)', '#000000');
  const perChannel = contrastRatio('#101014', lightGlass);
  assert.ok(Math.abs(perChannel - 1.5) <= 0.005, `per-channel model: ${perChannel}`);
  const averagedL = 0.2 * relativeLuminance('#ffffff') + 0.8 * relativeLuminance('#000000');
  const averaged = ratioFromLuminances(relativeLuminance('#101014'), averagedL);
  assert.ok(Math.abs(averaged - 4.52) <= 0.005, `the optimistic model: ${averaged}`);
  assert.ok(averaged / perChannel > 3, 'averaging overstates this case by about 3x');
});

test('contrastRatio refuses a translucent operand rather than inventing a number', () => {
  assert.throws(() => contrastRatio('rgba(255,255,255,0.12)', '#000000'), ColorError);
  assert.throws(() => contrastRatio('#000000', 'rgba(0,0,0,0.5)'), ColorError);
  // The escape hatch exists for callers that have already reasoned about the
  // alpha, and it has to be asked for by name.
  assert.ok(contrastRatio('rgba(255,255,255,0.12)', '#000000', { assumeOpaque: true }) > 20);
});

test('doc 10 §7 alpha ladder — dark glass over a white backdrop, light text', () => {
  const fill = (a) => `rgba(20,22,28,${a})`;
  const white = '#ffffff';
  const ink = '#F5F6FA';
  const rows = [
    // alpha, L of composite, ratio vs pure white, ratio vs --sp-ink-1
    [0.62, 0.1576, 5.06, 4.68],
    [0.72, 0.09589, 7.2, 6.66],
    [0.83, 0.04762, 10.76, 9.96],
    [0.9, 0.02661, null, 12.69],
  ];
  for (const [alpha, luminance, vsWhite, vsInk] of rows) {
    const surface = composite(fill(alpha), white);
    const gotL = relativeLuminance(surface);
    assert.ok(Math.abs(gotL - luminance) <= 5e-5, `alpha ${alpha}: L ${gotL}`);
    if (vsWhite !== null) {
      const got = contrastRatio(white, surface);
      assert.ok(Math.abs(got - vsWhite) <= 0.005, `alpha ${alpha} vs white: ${got}`);
    }
    const gotInk = contrastRatio(ink, surface);
    assert.ok(Math.abs(gotInk - vsInk) <= 0.005, `alpha ${alpha} vs ink: ${gotInk}`);
  }
  // 0.62 is the honest floor for a backdrop you do not control; 0.585 is not.
  assert.ok(passes(contrastRatio(ink, composite(fill(0.62), white)), 4.5));
  assert.ok(!passes(contrastRatio(white, composite(fill(0.585), white)), 4.5));
});

test('doc 10 §7 alpha ladder — light glass over a black backdrop, dark text', () => {
  const ink = '#101014';
  assert.ok(Math.abs(relativeLuminance(ink) - 0.00531) <= 5e-6, 'the ink luminance quoted');
  const at = (a) => composite(`rgba(255,255,255,${a})`, '#000000');
  const rows = [
    [0.4, 0.13287, 3.31],
    [0.6, 0.31855, 6.66],
    [0.72, 0.477, 9.53],
    [0.92, 0.82757, 15.87],
  ];
  for (const [alpha, luminance, ratio] of rows) {
    const surface = at(alpha);
    const gotL = relativeLuminance(surface);
    assert.ok(Math.abs(gotL - luminance) <= 5e-5, `alpha ${alpha}: L ${gotL}`);
    const got = contrastRatio(ink, surface);
    assert.ok(Math.abs(got - ratio) <= 0.005, `alpha ${alpha}: ${got}`);
  }
  // The second round-up trap: 0.483 measures 4.495:1 and fails; 0.484 passes.
  const trap = contrastRatio(ink, at(0.483));
  assert.ok(Math.abs(trap - 4.495) <= 5e-4, `the trap: ${trap}`);
  assert.ok(!passes(trap, 4.5), '4.495:1 still fails');
  assert.ok(passes(contrastRatio(ink, at(0.484)), 4.5));
  // And the legibility floor is 0.60, well above the 0.20 the style tempts.
  assert.ok(!passes(contrastRatio(ink, at(0.2)), 4.5));
});

test('doc 10 §7 and doc 09 §7 hairlines — where a boundary stops being decorative', () => {
  // doc 10: rgba(16,16,20,a) over a white panel. 0.12 is decorative (1.29:1),
  // 0.42 reaches only 2.79:1 and fails, 0.45 is the shipped 3.05:1.
  const white = '#ffffff';
  const spatial = (a) => composite(`rgba(16,16,20,${a})`, white);
  const decorative = spatial(0.12);
  assert.ok(Math.abs(decorative.r - 226.3) <= 0.05, `composite r ${decorative.r}`);
  assert.ok(Math.abs(relativeLuminance(decorative) - 0.76322) <= 5e-6, 'L of the hairline');
  assert.ok(Math.abs(contrastRatio(decorative, white) - 1.29) <= 0.005);
  assert.ok(!passes(contrastRatio(spatial(0.42), white), 3), '0.42 fails 1.4.11');
  const shipped = spatial(0.45);
  assert.ok(Math.abs(relativeLuminance(shipped) - 0.2943) <= 5e-5);
  assert.ok(Math.abs(contrastRatio(shipped, white) - 3.05) <= 0.005);
  assert.ok(passes(contrastRatio(shipped, white), 3));

  // doc 09: the same shape on a bento tile, light and dark.
  const tile = '#f5f5f7';
  const bento = (a) => composite(`rgba(0,0,0,${a})`, tile);
  assert.ok(Math.abs(contrastRatio(bento(0.06), tile) - 1.14) <= 0.005, 'decorative hairline');
  assert.ok(Math.abs(contrastRatio(bento(0.18), tile) - 1.52) <= 0.005, 'the 0.18 trap');
  assert.ok(Math.abs(contrastRatio(bento(0.45), tile) - 3.31) <= 0.005, 'shipped 0.45');
  const darkTile = '#161617';
  const darkBorder = composite('rgba(255,255,255,0.35)', darkTile);
  assert.ok(Math.abs(contrastRatio(darkBorder, darkTile) - 3.23) <= 0.005, 'shipped dark 0.35');
});

test('doc 03 §7 — the same glass panel swings 9.3x with the backdrop', () => {
  const panel = 'rgba(255,255,255,0.12)';
  const dark = contrastRatio('#ffffff', composite(panel, '#0B0B12'));
  const light = contrastRatio('#ffffff', composite(panel, '#7DD3FC'));
  assert.ok(Math.abs(dark - 14.6) <= 0.05, `over #0B0B12: ${dark}`);
  assert.ok(Math.abs(light - 1.57) <= 0.005, `over #7DD3FC: ${light}`);
  assert.ok(Math.abs(dark / light - 9.3) <= 0.05, 'the swing the doc names');
  assert.ok(passes(dark, 4.5) && !passes(light, 4.5), 'one panel, two verdicts');
});

test('doc 03 §7 — the ground clamp for a 12% white fill under white body text', () => {
  // The doc puts the 4.5:1 ceiling at roughly sRGB 100 and the 3:1 ceiling at
  // roughly sRGB 134. Both are exact to the step here.
  const panel = 'rgba(255,255,255,0.12)';
  const overGrey = (level) =>
    contrastRatio('#ffffff', composite(panel, { r: level, g: level, b: level }));
  assert.ok(passes(overGrey(100), 4.5), 'sRGB 100 still clears 4.5:1');
  assert.ok(!passes(overGrey(101), 4.5), 'one step brighter does not');
  assert.ok(passes(overGrey(134), 3), 'sRGB 134 still clears 3:1');
  assert.ok(!passes(overGrey(135), 3), 'one step brighter does not');
});

test('worstCaseRatio brackets a translucent fill against every backdrop in sRGB', () => {
  // Composite luminance is monotone in each backdrop channel, so black and
  // white bound it — and every value between is reachable along the diagonal.
  const env = backdropEnvelope('rgba(20,22,28,0.62)');
  assert.ok(env.luminanceMin < env.luminanceMax);
  assert.ok(
    Math.abs(env.luminanceMax - relativeLuminance(composite('rgba(20,22,28,0.62)', '#ffffff'))) <=
      1e-12,
  );

  // Dark glass under light text: the worst ground is white, and the answer
  // agrees with the doc 10 ladder.
  const darkGlass = worstCaseRatio('rgba(20,22,28,0.72)', '#ffffff');
  assert.deepEqual(darkGlass.worstBackdrop, parseColor('#ffffff'));
  assert.ok(Math.abs(darkGlass.ratio - 7.2) <= 0.005, `dark glass: ${darkGlass.ratio}`);

  // Light glass under dark text: the worst ground is black.
  const lightGlass = worstCaseRatio('rgba(255,255,255,0.72)', '#101014');
  assert.deepEqual(lightGlass.worstBackdrop, parseColor('#000000'));
  assert.ok(Math.abs(lightGlass.ratio - 9.53) <= 0.005, `light glass: ${lightGlass.ratio}`);

  // And when the envelope straddles the foreground, some backdrop makes the
  // composite exactly as light as the text: the honest answer is 1:1.
  const straddled = worstCaseRatio('rgba(255,255,255,0.20)', '#808080');
  assert.equal(straddled.ratio, 1);
  assert.equal(straddled.envelopeStraddlesForeground, true);
  // And the straddle names the backdrop that produces it, rather than shrugging.
  const grey = straddled.worstBackdrop;
  assert.ok(grey && grey.r > 0 && grey.r < 255, `a real grey ground: ${JSON.stringify(grey)}`);
  const matched = composite('rgba(255,255,255,0.20)', grey);
  assert.ok(
    Math.abs(relativeLuminance(matched) - relativeLuminance('#808080')) <= 1e-9,
    'the named backdrop really does erase the text',
  );
});

test('ceilTo rounds a floor upward, because a minimum that truncates is not a minimum', () => {
  // The docs print every alpha crossing this way: doc 10 §7's exact 0.585213
  // appears as 0.5853, doc 09 §7's 0.419826 as 0.4199, doc 03 §7's 0.557337 as
  // 0.55734. Truncating a floor publishes a number that fails its own target.
  assert.equal(ceilTo(0.585212755886, 4), 0.5853);
  assert.equal(ceilTo(0.419826162817, 4), 0.4199);
  assert.equal(ceilTo(0.557337113238, 5), 0.55734);
  // A value already exact at the requested precision must not be pushed a step.
  assert.equal(ceilTo(0.62, 2), 0.62);
  assert.equal(ceilTo(0.45, 2), 0.45);
  assert.equal(ceilTo(3, 4), 3);
});

test('solveMinAlpha reproduces every alpha crossing the docs print', () => {
  // Each expected value is the doc's own printed figure, and the docs print a
  // crossing ceiled to their precision — so these are equality assertions, not
  // tolerance assertions. Sources: doc 03 §7 and doc 10 §7.
  const white = '#ffffff';

  // doc 03 §7: an rgb(10,10,15) text scrim guaranteeing white text 4.5:1
  // against a worst-case pure-white backdrop needs alpha >= 0.55734, and the
  // doc rounds that to 0.56. At 0.555 the composite is L = 0.1852 and white
  // text reaches only 4.46:1.
  const scrim = solveMinAlpha('rgb(10,10,15)', white, { target: 4.5 });
  assert.equal(scrim.feasible, true);
  assert.equal(ceilTo(scrim.alpha, 5), 0.55734);
  assert.equal(scrim.ceil2, 0.56);
  const justUnder = composite('rgba(10,10,15,0.555)', white);
  assert.ok(Math.abs(relativeLuminance(justUnder) - 0.1852) <= 5e-5, 'L at 0.555');
  assert.ok(Math.abs(contrastRatio(white, justUnder) - 4.46) <= 0.005, 'ratio at 0.555');
  assert.ok(!passes(contrastRatio(white, justUnder), 4.5));

  // doc 10 §7, dark glass under light text, worst case a blown-out white page.
  assert.equal(ceilTo(solveMinAlpha('#14161C', white, { target: 4.5 }).alpha, 4), 0.5853);
  assert.equal(ceilTo(solveMinAlpha('#14161C', '#F5F6FA', { target: 4.5 }).alpha, 4), 0.6083);
  assert.equal(ceilTo(solveMinAlpha('#16181E', '#F5F6FA', { target: 4.5 }).alpha, 4), 0.6135);
  assert.equal(ceilTo(solveMinAlpha('#14161C', '#F5F6FA', { target: 7 }).alpha, 4), 0.7336);

  // doc 10 §7, light glass under dark text, worst case black.
  assert.equal(ceilTo(solveMinAlpha(white, '#101014', { target: 4.5 }).alpha, 4), 0.4833);

  // The doc's honest floor of 0.62 for dark glass is the two-decimal ceiling of
  // the 0.6083 crossing plus the margin the doc chose, so the solver's own
  // two-decimal answer must not exceed it.
  assert.ok(solveMinAlpha('#14161C', '#F5F6FA', { target: 4.5 }).ceil2 <= 0.62);
});

test('solveMinAlpha over a KNOWN backdrop — the bento and spatial hairline crossings', () => {
  // doc 09 §7: clearing 3:1 against #f5f5f7 crosses at rgba(0,0,0,0.4199), and
  // --bento-border-interactive ships 0.45 (3.31:1). In dark mode the crossing
  // over #161617 is rgba(255,255,255,0.3294) and the token ships 0.35 (3.23:1).
  const light = solveMinAlpha('#000000', '#f5f5f7', { target: 3, backdrop: '#f5f5f7' });
  assert.equal(ceilTo(light.alpha, 4), 0.4199);
  const dark = solveMinAlpha('#ffffff', '#161617', { target: 3, backdrop: '#161617' });
  assert.equal(ceilTo(dark.alpha, 4), 0.3294);
  assert.ok(passes(contrastRatio(composite('rgba(0,0,0,0.45)', '#f5f5f7'), '#f5f5f7'), 3));
  assert.ok(passes(contrastRatio(composite('rgba(255,255,255,0.35)', '#161617'), '#161617'), 3));

  // doc 10 §7 puts the same boundary at rgba(16,16,20,0.45) over a white panel
  // and records that 0.42 reaches only 2.79:1, so the crossing sits between.
  const hairline = solveMinAlpha('rgb(16,16,20)', '#ffffff', { target: 3, backdrop: '#ffffff' });
  assert.ok(hairline.alpha > 0.42 && hairline.alpha <= 0.45, `crossing ${hairline.alpha}`);
  assert.equal(hairline.ceil2, 0.45, 'and 0.45 is exactly the alpha doc 10 ships');

  // doc 09 §7 scrims, worst case a pure-white photograph underneath.
  const scrim = (a) => contrastRatio('#ffffff', composite(`rgba(0,0,0,${a})`, '#ffffff'));
  assert.ok(Math.abs(scrim(0.55) - 4.76) <= 0.005, 'the minimum viable scrim');
  assert.ok(Math.abs(scrim(0.72) - 9.23) <= 0.005, 'the headline scrim');
  // The true two-decimal crossing is 0.54; the doc ships 0.55 for margin, which
  // is a style decision sitting one step above a maths result, exactly as it
  // should be.
  const black = solveMinAlpha('#000000', '#ffffff', { target: 4.5, backdrop: '#ffffff' });
  assert.equal(black.ceil2, 0.54);
  assert.ok(passes(scrim(black.ceil2), 4.5) && !passes(scrim(0.53), 4.5));
});

test('solveMinAlpha refuses to bisect when the foreground straddles fill and backdrop', () => {
  // The precondition bisection needs is that the ratio be monotone in alpha.
  // It is not, when the foreground luminance sits STRICTLY BETWEEN the fill's
  // and the backdrop's: the composite walks from the backdrop to the fill, so
  // it passes through the foreground, the ratio falls to 1:1 there and rises
  // again. #808080 text over a white fill on a black ground is that case —
  // alpha 0.10 clears 3:1, alpha 0.50 measures 1:1, alpha 0.95 clears 3:1
  // again, and a bisection reports the LAST crossing as if it were the first.
  const result = solveMinAlpha('#ffffff', '#808080', { target: 3, backdrop: '#000000' });
  const ratioAt = (a) => contrastRatio('#808080', composite(`rgba(255,255,255,${a})`, '#000000'));

  assert.equal(result.nonMonotone, true, 'the straddle must be declared, not bisected through');
  assert.ok(
    Math.abs(result.crossoverAlpha - 0.502) <= 0.002,
    `#808080 is reached at alpha 128/255; got ${result.crossoverAlpha}`,
  );
  assert.ok(Math.abs(ratioAt(result.crossoverAlpha) - 1) <= 1e-6, 'and there the ratio is 1:1');

  // The honest answer is the interval that FAILS, not a single "minimum".
  const [low, high] = result.failsBetween;
  assert.ok(low > 0 && low < result.crossoverAlpha && high > result.crossoverAlpha && high < 1);
  assert.ok(passes(ratioAt(low - 1e-6), 3), 'everything below the interval clears the target');
  assert.ok(!passes(ratioAt(low + 1e-6), 3), 'and the interval itself does not');
  assert.ok(!passes(ratioAt(high - 1e-6), 3));
  assert.ok(passes(ratioAt(high + 1e-6), 3), 'the far branch clears it again');

  // A caller that only reads `alpha` still gets a value that clears the target,
  // and it is the first alpha on the upper branch that does.
  assert.equal(result.feasible, true);
  assert.equal(result.alpha, high);
  assert.ok(passes(ratioAt(result.ceil2), 3));
});

test('a straddle with TWO clearing branches reports both intervals', () => {
  // The both-sides case the straddle handling was written for. Its answer is a
  // SET of intervals: alpha up to the tint crossing clears 3:1, alpha from the
  // opaque crossing clears it again, and the gap between them does not.
  const result = solveMinAlpha('#ffffff', '#808080', { target: 3, backdrop: '#000000' });
  const [low, high] = result.failsBetween;
  assert.equal(result.feasible, true);
  assert.equal(result.clearingIntervals.length, 2);
  assert.deepEqual(result.clearingIntervals[0], [0, low]);
  assert.deepEqual(result.clearingIntervals[1], [high, 1]);
  assert.equal(result.tintAlpha, low);
  assert.equal(result.alpha, high);
});

test('every alpha the straddle branch recommends rounds away from 1:1 and clears', () => {
  // Each branch's shippable two-decimal alpha rounds AWAY from the crossover —
  // up on the opaque side, down on the tint side — so no recommendation can
  // land in the gap it was solved to avoid. Rounding a tint ceiling up, or a
  // whole branch to a floor of 0, is how the CLI came to advise alpha 0.
  const result = solveMinAlpha('#ffffff', '#808080', { target: 3, backdrop: '#000000' });
  const ratioAt = (a) => contrastRatio('#808080', composite(`rgba(255,255,255,${a})`, '#000000'));
  const [low, high] = result.failsBetween;

  assert.ok(result.tintFloor2 <= low, 'the tint value rounds down, onto the clearing side');
  assert.ok(passes(ratioAt(result.tintFloor2), 3), 'and clears the target');
  assert.ok(result.ceil2 >= high, 'the opaque value rounds up, onto the clearing side');
  assert.ok(passes(ratioAt(result.ceil2), 3), 'and clears the target');

  const out = cli('solve-alpha', '#ffffff', '#808080', '--target=3', '--backdrop=#000000');
  assert.equal(out.status, 0);
  assert.match(out.stdout, /clears 3:1/);
  assert.match(out.stdout, /misses it/);
  assert.match(out.stdout, /as a tint/, 'both branches are offered when both exist');
  const recommended = [...out.stdout.matchAll(/(\d+\.\d+) if/g)].map((m) => Number(m[1]));
  assert.equal(recommended.length, 2, 'one number per clearing branch');
  for (const value of recommended) {
    assert.ok(passes(ratioAt(value), 3), `alpha ${value} measures ${ratioAt(value)} — recommended`);
  }
});

test('a straddle with a reachable LOW solution is feasible, not "unreachable"', () => {
  // BUG 1. #808080 over a white fill on a black ground at 4:1: alpha 0 measures
  // 5.3172:1 and clears the target, alpha 1 measures 3.9494:1 and does not.
  // Every alpha up to the crossing at 0.135614 clears, so the pair is
  // REACHABLE. Judging feasibility on alpha 1 alone called it unreachable and
  // the CLI printed that verdict over a perfectly good low-alpha answer.
  const result = solveMinAlpha('#ffffff', '#808080', { target: 4, backdrop: '#000000' });
  const ratioAt = (a) => contrastRatio('#808080', composite(`rgba(255,255,255,${a})`, '#000000'));

  assert.equal(result.nonMonotone, true);
  assert.equal(result.feasible, true, 'a solved low branch means feasible');
  assert.ok(Math.abs(result.ratioAtZero - 5.3172) <= 5e-4, `alpha 0: ${result.ratioAtZero}`);
  assert.ok(Math.abs(result.ratioAtOne - 3.9494) <= 5e-4, `alpha 1: ${result.ratioAtOne}`);

  // Exactly one clearing interval, and it is the tint branch running up from 0.
  assert.equal(result.clearingIntervals.length, 1);
  const [lo, hi] = result.clearingIntervals[0];
  assert.equal(lo, 0);
  assert.ok(Math.abs(hi - 0.1356139) <= 1e-6, `the tint crossing: ${hi}`);
  assert.equal(result.tintAlpha, hi);
  assert.ok(passes(ratioAt(hi - 1e-6), 4), 'everything below the crossing clears');
  assert.ok(!passes(ratioAt(hi + 1e-6), 4), 'and nothing above it does');

  // The opaque branch genuinely has no solution, and that is said with a null
  // rather than with a number that fails.
  assert.equal(result.alpha, null);
  assert.equal(result.ceil2, null);
  assert.equal(result.ratio, null);
  // The tint recommendation rounds DOWN, away from the crossing, and clears.
  assert.equal(result.tintFloor2, 0.13);
  assert.ok(passes(ratioAt(result.tintFloor2), 4), 'the shipped tint alpha clears 4:1');

  // And the CLI must not call a reachable pair unreachable.
  const out = cli('solve-alpha', '#ffffff', '#808080', '--target=4', '--backdrop=#000000');
  assert.equal(out.status, 0, 'a reachable pair exits 0');
  assert.doesNotMatch(out.stdout, /unreachable/i);
  assert.match(out.stdout, /not monotone/i);
  assert.match(out.stdout, /0\.1356/, 'the tint crossing is printed');
  assert.match(out.stdout, /ship 0\.13\b/, 'and a shippable two-decimal tint alpha');
});

test('a straddle with NO low solution never recommends the failing alpha 0', () => {
  // BUG 2. #808080 over a white fill on a #3a3a3a ground at 3.8:1: alpha 0
  // measures only 2.8800:1, so nothing below the crossing clears and the tint
  // branch is empty. Leaving the bisection's `low` at its initial 0 made the
  // failing interval open at 0 and produced "ship 0 if it is meant to read as
  // a tint" — a recommendation a full point short of its own target.
  const result = solveMinAlpha('#ffffff', '#808080', { target: 3.8, backdrop: '#3a3a3a' });
  const ratioAt = (a) => contrastRatio('#808080', composite(`rgba(255,255,255,${a})`, '#3a3a3a'));

  assert.equal(result.nonMonotone, true);
  assert.equal(result.feasible, true, 'the opaque branch still clears');
  assert.ok(Math.abs(result.ratioAtZero - 2.88) <= 5e-4, `alpha 0: ${result.ratioAtZero}`);
  assert.ok(!passes(result.ratioAtZero, 3.8), 'alpha 0 does not clear the target');

  assert.equal(result.tintAlpha, null, 'no tint solution exists');
  assert.equal(result.tintFloor2, null, 'so there is nothing to ship as a tint');
  assert.equal(result.clearingIntervals.length, 1);
  assert.ok(Math.abs(result.clearingIntervals[0][0] - 0.9771258) <= 1e-6);
  assert.equal(result.clearingIntervals[0][1], 1);
  assert.ok(Math.abs(result.alpha - 0.9771258) <= 1e-6, `the opaque crossing: ${result.alpha}`);
  assert.equal(result.ceil2, 0.98);
  assert.ok(passes(ratioAt(result.ceil2), 3.8), 'and 0.98 really clears 3.8:1');

  // No number the CLI prints as a recommendation may fail the target.
  const out = cli('solve-alpha', '#ffffff', '#808080', '--target=3.8', '--backdrop=#3a3a3a');
  assert.equal(out.status, 0);
  assert.doesNotMatch(out.stdout, /as a tint/, 'there is no tint branch to describe');
  assert.match(out.stdout, /not monotone/i);
  assert.match(out.stdout, /nothing below the crossover clears it/);
  assert.match(out.stdout, /0\.9771/, 'the interval that does clear');
  assert.match(out.stdout, /ship 0\.98/);
  const recommended = [...out.stdout.matchAll(/ship (\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
  assert.ok(recommended.length > 0, 'something was recommended');
  for (const value of recommended) {
    assert.ok(passes(ratioAt(value), 3.8), `alpha ${value} measures ${ratioAt(value)} — recommended`);
  }
});

test('solveMinAlpha says so when no alpha can rescue the pair', () => {
  // A mid-grey fill under near-identical grey text is unreachable at any alpha,
  // and the honest answer is a refusal rather than a clamped number.
  const hopeless = solveMinAlpha('#808080', '#7f7f7f', { target: 4.5 });
  assert.equal(hopeless.feasible, false);
  assert.equal(hopeless.alpha, null);
  assert.equal(hopeless.ceil2, null);
  assert.ok(hopeless.ratioAtOne < 4.5, `best possible ${hopeless.ratioAtOne}`);

  // The refusal is decided unrounded too: #767676 on white is 4.5422, so a
  // target one ten-thousandth above that is out of reach and must be reported
  // as such rather than rounded into a pass.
  const nearMiss = solveMinAlpha('#767676', '#ffffff', { target: 4.5423, backdrop: '#ffffff' });
  assert.equal(nearMiss.feasible, false);
  assert.ok(solveMinAlpha('#767676', '#ffffff', { target: 4.5422, backdrop: '#ffffff' }).feasible);
});

test('a straddle where NEITHER branch clears is the genuinely unreachable case', () => {
  // Same geometry as the tint-less case, target raised to 4:1. Alpha 0 measures
  // 2.8800:1, alpha 1 measures 3.9494:1, and the ratio only falls between them,
  // so the maximum over [0, 1] is max(alpha 0, alpha 1) and no alpha clears.
  // This is the ONLY straddle for which "unreachable" is the honest verdict.
  const result = solveMinAlpha('#ffffff', '#808080', { target: 4, backdrop: '#3a3a3a' });
  assert.equal(result.nonMonotone, true);
  assert.equal(result.feasible, false);
  assert.deepEqual(result.clearingIntervals, []);
  assert.equal(result.alpha, null);
  assert.equal(result.ratio, null);
  assert.equal(result.ceil2, null);
  assert.equal(result.ceil4, null);
  assert.equal(result.tintAlpha, null);
  assert.equal(result.tintFloor2, null);
  assert.ok(result.ratioAtZero < 4 && result.ratioAtOne < 4, 'both ends fall short');

  const out = cli('solve-alpha', '#ffffff', '#808080', '--target=4', '--backdrop=#3a3a3a');
  assert.equal(out.status, 1, 'an unreachable pair exits 1');
  assert.doesNotMatch(out.stdout, /ship /, 'nothing may be recommended');
  assert.match(out.stdout, /no alpha clears 4:1/);
  assert.match(out.stdout, /2\.8800/);
  assert.match(out.stdout, /3\.9494/);
  // The shape is still described first — it is why alpha 1 is not the best case
  // and why a bisection would have answered confidently and wrongly.
  assert.match(out.stdout, /not monotone/i);
});

test('the ordinary monotone solve is untouched by the straddle handling', () => {
  // The regression guard for both fixes. A monotone solve has one answer, and
  // it keeps its single alpha, its wording, and its silence about branches —
  // none of the non-monotone fields appear on it at all.
  const known = solveMinAlpha('#000000', '#f5f5f7', { target: 3, backdrop: '#f5f5f7' });
  assert.equal(known.feasible, true);
  assert.equal(known.nonMonotone, false);
  assert.equal(ceilTo(known.alpha, 4), 0.4199);
  assert.equal(known.ceil2, 0.42);
  assert.equal(known.crossoverAlpha, undefined, 'no crossover on a monotone solve');
  assert.equal(known.clearingIntervals, undefined);
  assert.equal(known.tintAlpha, undefined);
  assert.equal(known.tintFloor2, undefined);
  assert.ok(passes(contrastRatio(composite('rgba(0,0,0,0.42)', '#f5f5f7'), '#f5f5f7'), 3));

  // The worst-case path is monotone by construction and must stay that way.
  const worst = solveMinAlpha('#14161C', '#F5F6FA', { target: 4.5 });
  assert.equal(worst.nonMonotone, false);
  assert.equal(worst.feasible, true);
  assert.equal(ceilTo(worst.alpha, 4), 0.6083);

  // The monotone unreachable case keeps its own wording and its exit 1.
  const hopeless = cli('solve-alpha', '#808080', '#7f7f7f', '--target=4.5');
  assert.equal(hopeless.status, 1);
  assert.match(hopeless.stdout, /unreachable — even at alpha 1/);
  assert.doesNotMatch(hopeless.stdout, /monotone/i);

  const out = cli('solve-alpha', '#000000', '#f5f5f7', '--target=3', '--backdrop=#f5f5f7');
  assert.equal(out.status, 0);
  assert.match(out.stdout, /needs alpha >= 0\.419826/);
  assert.match(out.stdout, /ship 0\.42 — the lowest two-decimal alpha that still clears it/);
  assert.doesNotMatch(out.stdout, /monotone|tint|interval|clears 3:1/i);
});

test('requiredTextRatio implements the 1.4.3 large-text rule the checks table states', () => {
  // >= 4.5:1 normal, >= 3:1 for >= 24px or >= 18.66px bold (14pt in CSS px).
  assert.equal(requiredTextRatio(), 4.5);
  assert.equal(requiredTextRatio({ fontSizePx: 23.99 }), 4.5);
  assert.equal(requiredTextRatio({ fontSizePx: 24 }), 3);
  assert.equal(requiredTextRatio({ fontSizePx: 18.66, fontWeight: 700 }), 3);
  assert.equal(requiredTextRatio({ fontSizePx: 19, fontWeight: 700 }), 3);
  assert.equal(requiredTextRatio({ fontSizePx: 18, fontWeight: 700 }), 4.5);
  assert.equal(requiredTextRatio({ fontSizePx: 19, fontWeight: 600 }), 4.5, 'semibold is not bold');
  // 1.4.6 AAA, which docs 03 and 09 both quote: 7:1 body, 4.5:1 large.
  assert.equal(requiredTextRatio({ enhanced: true }), 7);
  assert.equal(requiredTextRatio({ fontSizePx: 24, enhanced: true }), 4.5);
});

test('the CLI reports a non-monotone solve-alpha as an interval, not as a minimum', () => {
  // "needs alpha >= 0.879566" is true of the upper branch and false of the
  // question the caller asked, because alpha 0.10 clears the target too. A
  // number a skill will paste into a token file must not be silently the wrong
  // root, so the CLI says the word and prints the interval that fails.
  const out = cli('solve-alpha', '#ffffff', '#808080', '--target=3', '--backdrop=#000000').stdout;
  assert.doesNotMatch(out, /needs alpha >=/, 'not a minimum — there are two clearing branches');
  assert.match(out, /not monotone/i);
  assert.match(out, /0\.50/, 'the 1:1 crossover');
  assert.match(out, /0\.2\d\d\d.*0\.8\d\d\d|0\.8\d\d\d/s, 'the failing interval');

  const json = JSON.parse(
    cli('solve-alpha', '#ffffff', '#808080', '--target=3', '--backdrop=#000000', '--json').stdout,
  );
  assert.equal(json.nonMonotone, true);
  assert.equal(json.failsBetween.length, 2);

  // The ordinary monotone case keeps its wording and its silence about branches.
  const plain = cli('solve-alpha', '#000000', '#f5f5f7', '--target=3', '--backdrop=#f5f5f7').stdout;
  assert.match(plain, /needs alpha >=/);
  assert.doesNotMatch(plain, /monotone/i);
});

test('the CLI answers the four questions a skill asks it, and exits non-zero on a miss', () => {
  const ratio = cli('ratio', '#767676', '#ffffff');
  assert.equal(ratio.status, 0);
  assert.match(ratio.stdout, /4\.5422/);

  // A --target turns the command into a verdict, and a miss must be exit 1 so a
  // skill's Bash step fails loudly rather than printing a number nobody reads.
  assert.equal(cli('ratio', '#767676', '#ffffff', '--target=4.5').status, 0);
  const miss = cli('ratio', '#777777', '#ffffff', '--target=4.5');
  assert.equal(miss.status, 1);
  assert.match(miss.stdout, /FAIL/);

  const composited = JSON.parse(cli('composite', 'rgba(20,22,28,0.585)', '#fff', '--json').stdout);
  assert.ok(Math.abs(composited.composite.r - 117.5) <= 0.05);
  assert.ok(Math.abs(composited.luminance - 0.1835) <= 5e-5);

  const worst = JSON.parse(cli('worst-case', 'rgba(20,22,28,0.72)', '#ffffff', '--json').stdout);
  assert.ok(Math.abs(worst.ratio - 7.2) <= 0.005);
  assert.equal(worst.envelopeStraddlesForeground, false);

  const solved = JSON.parse(
    cli('solve-alpha', '#14161C', '#F5F6FA', '--target=4.5', '--json').stdout,
  );
  assert.equal(solved.feasible, true);
  assert.equal(ceilTo(solved.alpha, 4), 0.6083);

  const known = JSON.parse(
    cli('solve-alpha', '#000000', '#f5f5f7', '--target=3', '--backdrop=#f5f5f7', '--json').stdout,
  );
  assert.equal(ceilTo(known.alpha, 4), 0.4199);

  // Unresolvable input is an error with a message, never a guessed number.
  assert.equal(cli('ratio', 'oklch(62% 0.19 259)', '#ffffff').status, 2);
  assert.equal(cli('--help').status, 0);
});
