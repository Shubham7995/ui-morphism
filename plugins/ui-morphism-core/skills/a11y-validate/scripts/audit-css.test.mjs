/**
 * audit-css.test.mjs — run with `node --test` from this directory.
 *
 * The nine universal checks are the table in docs/MARKETPLACE.md §7.3. Each
 * test below drives exactly one of them. Contrast maths is not re-tested here —
 * it belongs to contrast.test.mjs — what is tested is that the auditor finds
 * the right pairs in a stylesheet and asks contrast.mjs the right question.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import * as auditor from './audit-css.mjs';

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('./audit-css.mjs', import.meta.url));

/** Run the CLI and return `{ status, stdout, stderr }`; never throws. */
function cli(...args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? '', stderr: error.stderr ?? '' };
  }
}

/** Findings of one check, by id. */
function of(result, check) {
  return result.findings.filter((f) => f.check === check);
}

test('the parser reads rules, declarations and at-rules, and keeps line numbers', () => {
  const css = `/* a comment { with a brace } */
:root {
  --um-brutalism-ink: #0a0a0a;
}

@media (prefers-color-scheme: dark) {
  :root[data-theme="dark"] {
    --um-brutalism-ink: #f5f0e6; /* trailing */
  }
}

.btn::after { content: "}"; }
`;
  const sheet = auditor.parseCss(css);
  const rules = auditor.flattenRules(sheet);
  assert.deepEqual(
    rules.map((r) => r.selector),
    [':root', ':root[data-theme="dark"]', '.btn::after'],
  );
  assert.equal(rules[0].line, 2, 'line numbers survive the comment above');
  assert.equal(rules[1].line, 7);
  assert.deepEqual(rules[0].declarations, [
    { property: '--um-brutalism-ink', value: '#0a0a0a', line: 3 },
  ]);
  // A brace inside a comment or a string must not close a block.
  assert.deepEqual(rules[2].declarations, [{ property: 'content', value: '"}"', line: 12 }]);
  // The media query is recorded as the rule's at-rule context, which is what
  // lets the dark-theme checks know which theme they are looking at.
  assert.deepEqual(rules[1].atRules, ['@media (prefers-color-scheme: dark)']);
});

test('check 1 — text contrast, resolved through var() and judged unrounded', () => {
  const css = `
:root {
  --um-bento-grid-bg: #f5f5f7;
  --um-bento-grid-ink: #1d1d1f;
  --um-bento-grid-ink-muted: #6e6e73;
  --um-bento-grid-accent: #0071e3;
}
.tile { background-color: var(--um-bento-grid-bg); color: var(--um-bento-grid-ink); }
.tile__meta { background-color: #f5f5f7; color: var(--um-bento-grid-ink-muted); }
.tile__link { background: #f5f5f7; color: #0071e3; }
.tile__title { background: #f5f5f7; color: #6e6e73; font-size: 28px; }
`;
  const result = auditor.audit(css, { file: 'bento.css' });
  const findings = of(result, 'text-contrast');

  const bySelector = Object.fromEntries(findings.map((f) => [f.selector, f]));
  // 15.46:1 — a comfortable pass, and still reported so the table has a row.
  assert.equal(bySelector['.tile'].level, 'pass');
  assert.ok(Math.abs(bySelector['.tile'].ratio - 15.46) <= 0.005);
  assert.equal(bySelector['.tile'].required, 4.5);

  // 4.66:1 passes with almost no margin, which is doc 09's own warning.
  assert.equal(bySelector['.tile__meta'].level, 'pass');

  // 4.31:1 fails body text. Rounding it to "4.3" and calling it close is the
  // bug this whole project exists to prevent.
  assert.equal(bySelector['.tile__link'].level, 'fail');
  assert.ok(Math.abs(bySelector['.tile__link'].ratio - 4.31) <= 0.005);
  assert.match(bySelector['.tile__link'].message, /4\.5/);

  // At 28px the requirement drops to 3:1 under 1.4.3, so the same pair passes.
  assert.equal(bySelector['.tile__title'].required, 3);
  assert.equal(bySelector['.tile__title'].level, 'pass');

  // Every finding carries the file and the line, because a report row with no
  // location is not actionable.
  for (const f of findings) {
    assert.equal(f.file, 'bento.css');
    assert.ok(f.line > 0);
  }
});

test('check 2 — non-text contrast catches the dark-mode black-border trap', () => {
  // doc 07 §7: the most-copied neubrutalism library keeps a pure black border
  // in .dark, which measures 1.56:1 against its own dark surface and fails
  // 1.4.11. A mechanical group-to-name mapping is what makes this greppable.
  const css = `
:root {
  --um-brutalism-surface-1: #ffffff;
  --um-brutalism-border-strong: #000000;
}
:root[data-theme="dark"] {
  --um-brutalism-surface-1: #2e2e38;
  --um-brutalism-border-strong: #000000;
}
.btn { background: var(--um-brutalism-surface-1); border: 2px solid var(--um-brutalism-border-strong); }
`;
  const findings = of(auditor.audit(css, { file: 'nb.css' }), 'non-text-contrast');
  const light = findings.find((f) => f.theme === 'light');
  const dark = findings.find((f) => f.theme === 'dark');

  assert.equal(light.level, 'pass', 'black on white is 21:1');
  assert.equal(dark.level, 'fail');
  assert.ok(Math.abs(dark.ratio - 1.56) <= 0.005, `measured ${dark.ratio}`);
  assert.equal(dark.required, 3);
  assert.match(dark.message, /border-strong/);

  // Flipping the dark border to a light ink is the fix doc 07 states, and it
  // measures 11.82:1.
  const fixed = css.replace(
    /(\[data-theme="dark"\][\s\S]*?)--um-brutalism-border-strong: #000000;/,
    '$1--um-brutalism-border-strong: #f5f0e6;',
  );
  const fixedDark = of(auditor.audit(fixed, { file: 'nb.css' }), 'non-text-contrast').find(
    (f) => f.theme === 'dark',
  );
  assert.equal(fixedDark.level, 'pass');
  assert.ok(Math.abs(fixedDark.ratio - 11.82) <= 0.005);
});

test('check 2 — a theme-independent pair is reported once, with no theme prefix', () => {
  // The rule's colours are literal, so both themes resolve to the SAME pair and
  // measure the same ratio. Two rows differing only by a "light:"/"dark:"
  // prefix is one finding printed twice in §3 of the report.
  const css = `
:root { --um-x-surface-1: #ffffff; }
:root[data-theme="dark"] { --um-x-surface-1: #101014; }
.chip { background: #ffffff; border: 2px solid #cccccc; }
`;
  const findings = of(auditor.audit(css, { file: 'x.css' }), 'non-text-contrast').filter(
    (f) => f.selector === '.chip',
  );

  assert.equal(findings.length, 1, 'one pair, one row');
  assert.doesNotMatch(findings[0].message, /^(light|dark):/, 'no theme prefix on a shared pair');
  assert.equal(findings[0].theme, 'both');
  assert.equal(findings[0].level, 'fail', '#cccccc on #ffffff is 1.606:1');
});

test('check 3 — focus must be an outline, wide enough, offset, and never removed', () => {
  const css = `
.a:focus-visible { outline: 3px solid #0a0a0a; outline-offset: 2px; }
.b:focus-visible { outline: none; box-shadow: 0 0 0 3px #0a0a0a; }
.c:focus { outline: 1px solid #0a0a0a; outline-offset: 2px; }
.d:focus-visible { outline: 3px solid #0a0a0a; }
.e:focus-visible { outline: none; }
`;
  const findings = of(auditor.audit(css, { file: 'focus.css' }), 'focus');
  const by = (sel) => findings.filter((f) => f.selector === sel);

  assert.deepEqual(by('.a:focus-visible').map((f) => f.level), ['pass']);

  // A box-shadow ring is deleted outright by forced-colors, so a control whose
  // only focus indicator is a shadow has no focus indicator in that mode.
  const shadowRing = by('.b:focus-visible');
  assert.ok(shadowRing.some((f) => f.level === 'fail' && /box-shadow/.test(f.message)));

  // 2.4.13 sets a 2px minimum thickness.
  assert.ok(by('.c:focus').some((f) => f.level === 'fail' && /1px/.test(f.message)));

  // No offset is a warning rather than a failure: it is legible on a flat
  // control and invisible on one that already carries a 2px ink border.
  assert.ok(by('.d:focus-visible').some((f) => f.level === 'warn' && /offset/.test(f.message)));

  // outline: none with no replacement in the same rule is the classic bug.
  assert.ok(by('.e:focus-visible').some((f) => f.level === 'fail' && /replacement/.test(f.message)));

  // A sheet with focusable-looking selectors and no :focus-visible rule at all
  // fails once, at sheet level, rather than silently passing.
  const none = auditor.audit('button { background: #fff; color: #000; }', { file: 'x.css' });
  assert.ok(of(none, 'focus').some((f) => f.level === 'fail' && /no :focus-visible/.test(f.message)));
});

test('check 4 — target size floors at 24px, warns below 44, and re-measures after rotate', () => {
  const css = `
.chip { min-height: 20px; min-width: 20px; }
.pill { min-height: 32px; }
.btn { min-height: 44px; min-width: 44px; }
.sticker { min-height: 44px; min-width: 44px; transform: rotate(-3deg); }
`;
  const findings = of(auditor.audit(css, { file: 't.css' }), 'target-size');
  const by = (sel) => findings.filter((f) => f.selector === sel);

  // 24x24 is a hard floor under 2.5.8.
  assert.ok(by('.chip').some((f) => f.level === 'fail' && /24/.test(f.message)));
  // Between 24 and 44 is compliant and still worth flagging for touch.
  assert.ok(by('.pill').some((f) => f.level === 'warn' && /44/.test(f.message)));
  assert.deepEqual(by('.btn').map((f) => f.level), ['pass']);

  // A rotated target hit-tests against its transformed box, and the axis-aligned
  // bounding box of that is not computable from CSS text — so it is a todo that
  // names the method, not a pass.
  assert.ok(by('.sticker').some((f) => f.level === 'todo' && /bounding box/.test(f.message)));
});

test('check 5a — a sheet with shadow-bounded elements and no forced-colors block fails', () => {
  const missing = auditor.audit('.card { box-shadow: 0 2px 8px #0003; }', { file: 'a.css' });
  const findings = of(missing, 'forced-colors');
  assert.ok(findings.some((f) => f.level === 'fail' && /no @media \(forced-colors/.test(f.message)));
});

test('check 5b — inside the block, colours must be system keywords and shadows need borders', () => {
  const bad = `
.card { box-shadow: 0 2px 8px #0003; }
@media (forced-colors: active) {
  .card { background: #ffffff; color: #000000; }
  .label { forced-color-adjust: none; color: #333333; }
}
`;
  const findings = of(auditor.audit(bad, { file: 'b.css' }), 'forced-colors');
  // Hard-coded colours defeat the whole mode: the UA is substituting the user's
  // palette and the sheet is overriding it back.
  assert.ok(findings.some((f) => f.level === 'fail' && /system colour keyword/.test(f.message)));
  // A shadow-bounded element loses its boundary, because the mode nulls
  // box-shadow — it needs a real border restored here.
  assert.ok(findings.some((f) => f.level === 'fail' && /border/.test(f.message)));
  // forced-color-adjust: none on a text-bearing rule opts that text out of the
  // user's palette entirely.
  assert.ok(findings.some((f) => f.level === 'fail' && /forced-color-adjust/.test(f.message)));

  const good = `
.card { box-shadow: 0 2px 8px #0003; }
@media (forced-colors: active) {
  .card { background: Canvas; color: CanvasText; border: 1px solid CanvasText; box-shadow: none; }
  .card::after { display: none; }
}
`;
  const clean = of(auditor.audit(good, { file: 'c.css' }), 'forced-colors');
  assert.ok(clean.length > 0 && clean.every((f) => f.level === 'pass'), JSON.stringify(clean));
});

test('check 6 — reduced motion zeroes durations without removing state-carrying properties', () => {
  const missing = auditor.audit('.x { transition: transform 200ms ease; }', { file: 'm.css' });
  assert.ok(
    of(missing, 'reduced-motion').some((f) => f.level === 'fail' && /prefers-reduced-motion/.test(f.message)),
  );

  // Zeroing the duration is the fix. Removing the outline, the border or the
  // background at the same time takes away a state cue from exactly the users
  // who asked for less movement, not less information.
  const overreach = `
.x { transition: transform 200ms ease; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  .x:focus-visible { outline: none; }
}
`;
  const findings = of(auditor.audit(overreach, { file: 'm2.css' }), 'reduced-motion');
  assert.ok(findings.some((f) => f.level === 'fail' && /state-carrying/.test(f.message)));

  const good = `
.x { transition: transform 200ms ease; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;
  const clean = of(auditor.audit(good, { file: 'm3.css' }), 'reduced-motion');
  assert.ok(clean.length > 0 && clean.every((f) => f.level === 'pass'), JSON.stringify(clean));
});

test('check 7a — a sheet that emits backdrop-filter must handle reduced transparency', () => {
  const glass = '.panel { backdrop-filter: blur(20px); background: rgba(255,255,255,0.12); }';
  const findings = of(auditor.audit(glass, { file: 'g.css' }), 'reduced-transparency');
  assert.ok(findings.some((f) => f.level === 'fail' && /prefers-reduced-transparency/.test(f.message)));

  // A style with no translucency at all is not asked for any of this.
  assert.deepEqual(
    of(auditor.audit('.card { background: #fff; }', { file: 'o.css' }), 'reduced-transparency'),
    [],
  );
});

test('check 7b — the media query alone is not coverage, because Safari lacks it', () => {
  const queryOnly = `.panel { backdrop-filter: blur(20px); background: rgba(255,255,255,0.12); }
@media (prefers-reduced-transparency: reduce) {
  .panel { backdrop-filter: none; background: #0b0b12; }
}
`;
  const partial = of(auditor.audit(queryOnly, { file: 'g2.css' }), 'reduced-transparency');
  assert.ok(partial.some((f) => f.level === 'fail' && /Safari/.test(f.message)));

  const both = `${queryOnly}
[data-transparency="reduced"] .panel { backdrop-filter: none; background: #0b0b12; }
`;
  const clean = of(auditor.audit(both, { file: 'g3.css' }), 'reduced-transparency');
  assert.ok(clean.length > 0 && clean.every((f) => f.level === 'pass'), JSON.stringify(clean));
});

test('check 8 — a state rule that only changes colour, depth or blur is colour-only', () => {
  const css = `
.field[aria-invalid="true"] { border-color: #ff4d4d; }
.chip[aria-selected="true"] { background: #ffdc58; box-shadow: 0 0 0 2px #0a0a0a; }
.row.is-error { color: #b00020; content: "!"; }
.tab[aria-selected="true"] { background: #fff; border-bottom: 3px solid #0a0a0a; font-weight: 700; }
`;
  const findings = of(auditor.audit(css, { file: 's.css' }), 'colour-only');
  const by = (sel) => findings.filter((f) => f.selector === sel);

  assert.ok(by('.field[aria-invalid="true"]').some((f) => f.level === 'warn'));
  // Depth is not a second channel: a shadow is invisible in forced-colors and
  // means nothing to a screen reader.
  assert.ok(by('.chip[aria-selected="true"]').some((f) => f.level === 'warn'));
  // A glyph and a weight change are real second channels.
  assert.deepEqual(by('.row.is-error'), []);
  assert.deepEqual(by('.tab[aria-selected="true"]'), []);
});

test('check 9 — DOM order warns on reordering applied to sequential content', () => {
  const css = `
.grid { display: grid; grid-auto-flow: dense; }
.list { display: flex; flex-direction: row-reverse; }
.item { order: 3; }
.badge { position: absolute; inset: 0 auto auto 0; }
.plain { display: grid; grid-template-columns: repeat(4, 1fr); }
`;
  const findings = of(auditor.audit(css, { file: 'd.css' }), 'dom-order');
  const selectors = findings.map((f) => f.selector);
  assert.ok(selectors.includes('.grid'));
  assert.ok(selectors.includes('.list'));
  assert.ok(selectors.includes('.item'));
  assert.ok(selectors.includes('.badge'));
  assert.ok(!selectors.includes('.plain'), 'an ordinary grid is not a reordering');
  // These are warnings: the CSS cannot tell whether the content is sequential,
  // and a decorative grid is allowed to be dense.
  assert.ok(findings.every((f) => f.level === 'warn'));
  assert.ok(findings.some((f) => /1\.3\.2/.test(f.message)));
});

test('the CLI prints a markdown table and exits 1 on a failing sheet', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'um-audit-'));
  const file = path.join(dir, 'bad.css');
  writeFileSync(file, '.link { background: #f5f5f7; color: #0071e3; }');

  const md = cli(file);
  assert.equal(md.status, 1, 'a failing sheet exits 1 so a skill step fails loudly');
  assert.match(md.stdout, /text-contrast/);
  assert.match(md.stdout, /4\.31/);
  assert.match(md.stdout, /\|/, 'markdown is the default because it lands in §3 of the report');
  rmSync(dir, { recursive: true, force: true });
});

test('the CLI also emits JSON, names all nine checks, and honours --fail-on', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'um-audit2-'));
  const file = path.join(dir, 'bad.css');
  writeFileSync(file, '.link { background: #f5f5f7; color: #0071e3; }');

  const json = JSON.parse(cli(file, '--format=json').stdout);
  assert.ok(json.summary.fail >= 1);
  assert.equal(json.findings[0].file, file);
  // The nine checks are always named, so a report can state which ones ran
  // rather than leaving the reader to infer it from the findings present.
  assert.deepEqual(json.checks, [
    'text-contrast',
    'non-text-contrast',
    'focus',
    'target-size',
    'forced-colors',
    'reduced-motion',
    'reduced-transparency',
    'colour-only',
    'dom-order',
  ]);

  // --fail-on=warn is the stricter CI gate.
  const warnOnly = path.join(dir, 'warn.css');
  writeFileSync(warnOnly, '.chip { min-height: 32px; }');
  assert.equal(cli(warnOnly).status, 0);
  assert.equal(cli(warnOnly, '--fail-on=warn').status, 1);

  assert.equal(cli('--help').status, 0);
  assert.match(cli('--help').stdout, /nine universal accessibility checks/);
  rmSync(dir, { recursive: true, force: true });
});
