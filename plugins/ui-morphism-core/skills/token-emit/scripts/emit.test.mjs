/**
 * emit.test.mjs — run with `node --test` from this directory.
 *
 * The grammar, the closed vocabulary and the Tailwind mapping are taken from
 * docs/00-comparison-matrix.md §7. The dark-mode emission shape and the
 * "@theme is never nested" invariant are both bug classes this repository has
 * already hit, so they are asserted structurally rather than by eye.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GROUPS,
  STYLES,
  TOKEN_NAME_RE,
  TokenError,
  assertThemeNotNested,
  emitCss,
  emitTailwindTheme,
  emitTypeScript,
  tokenName,
  validateTokenSet,
} from './emit.mjs';

// A namespace import as well, so a test for a not-yet-written emitter fails on
// its own assertion instead of breaking the whole module at link time.
import * as tokens from './emit.mjs';

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('./emit.mjs', import.meta.url));

/** Run the CLI and return `{ status, stdout, stderr }`; never throws. */
function cli(...args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? '', stderr: error.stderr ?? '' };
  }
}

/** A structurally complete brutalism set. Values from doc 07 §4. */
function brutalismSet() {
  return {
    style: 'brutalism',
    light: {
      bg: '#fef6e4',
      'surface-1': '#ffffff',
      ink: '#0a0a0a',
      border: '#000000',
      'border-strong': '#000000',
      accent: '#ffdc58',
      'radius-md': '0px',
      'shadow-2': '4px 4px 0 0 var(--um-brutalism-border)',
      'space-4': '16px',
      'blur-0': '0px',
      'dur-base': '150ms',
      'ease-standard': 'cubic-bezier(0.2, 0, 0, 1)',
      'focus-color': '#0a0a0a',
      'focus-width': '3px',
      'focus-offset': '2px',
      'target-min': '44px',
    },
    dark: {
      bg: '#101010',
      'surface-1': '#1a1a1a',
      ink: '#f5f0e6',
      border: '#f5f0e6',
      'border-strong': '#f5f0e6',
      'focus-color': '#f5f0e6',
    },
  };
}

test('tokenName builds --um-<style>-<group>[-<variant>] and refuses an unknown segment', () => {
  assert.equal(tokenName('spatial-ui', 'elev-5'), '--um-spatial-ui-elev-5');
  assert.equal(tokenName('liquid-glass', 'radius-pill'), '--um-liquid-glass-radius-pill');
  assert.equal(tokenName('neumorphism', 'border-strong'), '--um-neumorphism-border-strong');
  assert.equal(tokenName('bento-grid', 'space-4'), '--um-bento-grid-space-4');
  assert.match(tokenName('brutalism', 'ink'), TOKEN_NAME_RE);
  assert.equal(STYLES.length, 10, 'ten style segments, no more and no fewer');
  // No abbreviations, ever: --um-lg-* versus --um-gl-* is the two-character
  // collision §7.2 spells the segments out to avoid.
  assert.throws(() => tokenName('lg', 'radius-md'), TokenError);
  assert.throws(() => tokenName('glass', 'ink'), TokenError);
});

test('the group vocabulary is the closed set of twenty-two from §7.3', () => {
  assert.deepEqual(Object.keys(GROUPS).sort(), [
    'accent', 'bg', 'blur', 'border', 'danger', 'dur', 'ease', 'elev', 'focus',
    'font', 'ink', 'leading', 'noise', 'radius', 'saturate', 'shadow', 'space',
    'surface', 'target', 'text', 'tracking', 'weight',
  ]);
});

test('validateTokenSet refuses a key whose group is outside the vocabulary', () => {
  assert.deepEqual(validateTokenSet(brutalismSet()).errors, [], 'a real set is clean');
  // The name MATCHES the regex — the regex is the shape check and the
  // vocabulary is the meaning check, so both have to run.
  assert.match('--um-brutalism-wibble-3', TOKEN_NAME_RE);
  const set = brutalismSet();
  set.light['wibble-3'] = '1px';
  assert.match(validateTokenSet(set).errors.join('\n'), /wibble/);
  assert.throws(() => validateTokenSet(set, { throwOnError: true }), TokenError);
});

test('validateTokenSet closes the variant list where §7.3 closes it, and opens it where it does not', () => {
  const closed = brutalismSet();
  closed.light['radius-huge'] = '48px';
  assert.match(validateTokenSet(closed).errors.join('\n'), /radius-huge/);

  // blur, weight, leading and tracking have style-dependent ladders, so any
  // step is accepted there — the steps are a style fact, not a shared one.
  const open = brutalismSet();
  open.light['blur-3'] = '0px';
  open.light['weight-black'] = '900';
  open.light['tracking-tight'] = '-0.02em';
  assert.deepEqual(validateTokenSet(open).errors, []);
});

test('validateTokenSet refuses a token that exists only in the override theme', () => {
  // Rule 3's first property: a token defined only inside a media query is
  // undefined for every user whose OS preference points the other way.
  const set = brutalismSet();
  set.dark['accent-subtle'] = '#332b00';
  assert.match(validateTokenSet(set).errors.join('\n'), /accent-subtle/);
  // And the style segment itself is checked, since an unknown one makes every
  // emitted name unrecognisable to the cross-style validator.
  const wrongStyle = brutalismSet();
  wrongStyle.style = 'neubrutalism';
  assert.match(validateTokenSet(wrongStyle).errors.join('\n'), /neubrutalism/);
});

test('emitCss puts light on bare :root and duplicates dark under BOTH selectors', () => {
  const css = emitCss(brutalismSet());

  // Light values on bare :root, with color-scheme declared.
  assert.match(css, /^:root \{/m);
  assert.match(css, /:root \{[^}]*color-scheme: light dark;/s);
  assert.match(css, /:root \{[^}]*--um-brutalism-bg: #fef6e4;/s);
  assert.match(css, /:root \{[^}]*--um-brutalism-target-min: 44px;/s);

  // Dark under the guarded media query...
  assert.match(
    css,
    /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{/,
  );
  // ...and again under the attribute selector, with REAL tokens both times.
  const mediaBlock = /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{([^}]*)\}/.exec(css)[1];
  const attrBlock = /\n:root\[data-theme="dark"\] \{([^}]*)\}/.exec(css)[1];
  assert.match(mediaBlock, /--um-brutalism-border-strong: #f5f0e6;/);
  assert.deepEqual(
    mediaBlock.trim().split('\n').map((l) => l.trim()),
    attrBlock.trim().split('\n').map((l) => l.trim()),
    'the two dark blocks must declare exactly the same tokens',
  );

  // Only the tokens that actually change are redeclared; an unchanged token
  // stays inherited from :root rather than being restated in three places.
  assert.doesNotMatch(mediaBlock, /--um-brutalism-target-min/);

  // Every name emitted matches the grammar.
  for (const [, name] of css.matchAll(/(--um-[a-z0-9-]+):/g)) {
    assert.match(name, TOKEN_NAME_RE, `${name} must match the grammar`);
  }

  // An invalid set never reaches the output.
  const broken = brutalismSet();
  broken.light['wibble-3'] = '1px';
  assert.throws(() => emitCss(broken), TokenError);
});

test('emitCss mirrors the rule for a dark-first style rather than relaxing it', () => {
  // Glassmorphism is the one legitimate mirror: it does not own its ground, so
  // its dark values are the bare-:root values and the LIGHT list is the guarded
  // override. §7.4 Rule 3 calls this an exception to the polarity, not the rule.
  const glass = {
    style: 'glassmorphism',
    polarity: 'dark-first',
    dark: {
      'surface-1': 'rgba(255, 255, 255, 0.14)',
      'border-strong': 'rgba(255, 255, 255, 0.42)',
      'blur-2': '20px',
      saturate: '160%',
    },
    light: {
      'surface-1': 'rgba(255, 255, 255, 0.10)',
      'border-strong': 'rgba(255, 255, 255, 0.34)',
      'blur-2': '20px',
      saturate: '160%',
    },
  };
  const css = emitCss(glass);
  assert.match(css, /:root \{[^}]*color-scheme: dark light;/s);
  assert.match(css, /:root \{[^}]*--um-glassmorphism-surface-1: rgba\(255, 255, 255, 0\.14\);/s);
  assert.match(
    css,
    /@media \(prefers-color-scheme: light\) \{\s*:root:not\(\[data-theme="dark"\]\) \{/,
  );
  assert.match(css, /\n:root\[data-theme="light"\] \{/);
  assert.match(css, /--um-glassmorphism-surface-1: rgba\(255, 255, 255, 0\.10\);/);
  // The unchanged tokens are not restated in the override blocks.
  assert.doesNotMatch(css.split('@media')[1], /--um-glassmorphism-blur-2/);
  // Glassmorphism owns no page ground, so a `bg` token would be a claim it has
  // no right to make — but that is a style fact, and core only checks that the
  // polarity itself is one of the two it knows.
  assert.throws(() => emitCss({ ...glass, polarity: 'sideways' }), TokenError);
});

test('emitTailwindTheme maps group to namespace and never nests @theme', () => {
  const css = emitTailwindTheme(brutalismSet());
  assert.match(css, /^@import "tailwindcss";/m);

  // §7.4 Rule 4's table, applied mechanically.
  const theme = /@theme \{([\s\S]*?)\n\}/.exec(css)[1];
  assert.match(theme, /--color-um-brutalism-bg: #fef6e4;/);
  assert.match(theme, /--color-um-brutalism-border-strong: #000000;/);
  assert.match(theme, /--radius-um-brutalism-md: 0px;/);
  assert.match(theme, /--shadow-um-brutalism-2: 4px 4px 0 0 var\(--um-brutalism-border\);/);
  assert.match(theme, /--spacing-um-brutalism-4: 16px;/);
  assert.match(theme, /--blur-um-brutalism-0: 0px;/);
  assert.match(theme, /--ease-um-brutalism-standard: cubic-bezier\(0\.2, 0, 0, 1\);/);
  assert.match(theme, /--transition-duration-um-brutalism-base: 150ms;/);

  // The five namespace-less groups are plain custom properties in :root, not
  // theme variables — putting them in @theme would imply utilities that do not
  // exist.
  assert.doesNotMatch(theme, /focus|target|elev|saturate|noise/);
  assert.match(css, /:root \{[^}]*--um-brutalism-focus-width: 3px;/s);
  assert.match(css, /:root \{[^}]*--um-brutalism-target-min: 44px;/s);

  // @theme is top level. Nothing may wrap it, and the emitter checks its own
  // output rather than trusting the code above it.
  assert.match(css, /^@theme \{/m);
  assert.equal(assertThemeNotNested(css), true);
  assert.throws(
    () => assertThemeNotNested('@media (min-width: 40rem) {\n  @theme {\n    --color-x: red;\n  }\n}'),
    TokenError,
  );

  // Theme switching happens outside @theme, on ordinary selectors, in the same
  // three-block shape — and it refers to the GENERATED names.
  assert.match(
    css,
    /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{/,
  );
  assert.match(css, /\n:root\[data-theme="dark"\] \{/);
  assert.match(css, /--color-um-brutalism-border-strong: #f5f0e6;/);
});

test('emitTypeScript emits both themes plus the var() accessor, keyed by the CSS names', () => {
  const ts = emitTypeScript(brutalismSet());
  assert.match(ts, /export const brutalismTokens = \{/);
  assert.match(ts, /light: \{[\s\S]*?'border-strong': '#000000',/);
  assert.match(ts, /dark: \{[\s\S]*?'border-strong': '#f5f0e6',/);
  assert.match(ts, /\} as const;/);
  assert.match(ts, /export type BrutalismTokenName = keyof typeof brutalismTokens\.light;/);
  // The accessor is what stops a consumer hand-writing the prefix and getting
  // it subtly wrong, which is the whole reason the grammar is mechanical.
  assert.match(ts, /`var\(--um-brutalism-\$\{name\}\)`/);
  // Keys stay in CSS spelling rather than being camelCased, so a token is one
  // string in the stylesheet, the TypeScript and the audit report.
  assert.doesNotMatch(ts, /borderStrong/);
});

test('emitSwift types what SwiftUI has a type for and refuses to fake the rest', () => {
  const swift = tokens.emitSwift(brutalismSet());
  assert.match(swift, /^import SwiftUI$/m);
  assert.match(swift, /public enum BrutalismTokens \{/);
  assert.match(swift, /public enum Light \{/);
  assert.match(swift, /public enum Dark \{/);

  // Colours become Color, lengths become CGFloat, durations become seconds.
  assert.match(swift, /public static let bg = Color\(red: 0\.996, green: 0\.965, blue: 0\.894/);
  assert.match(swift, /public static let radiusMd: CGFloat = 0/);
  assert.match(swift, /public static let targetMin: CGFloat = 44/);
  assert.match(swift, /public static let durBase: TimeInterval = 0\.15/);

  // A CSS value with no SwiftUI equivalent is carried as a String and SAYS so.
  // Inventing a NSShadow for a four-layer box-shadow would be a lie with a type.
  assert.match(
    swift,
    /\/\/\/ CSS value, not translated[\s\S]*?public static let shadow2: String = "4px 4px 0 0 var\(--um-brutalism-border\)"/,
  );
  assert.match(swift, /public static let easeStandard: String = "cubic-bezier\(0\.2, 0, 0, 1\)"/);
});

test('emitCompose emits Color/Dp/millis and carries untranslatable CSS as a String', () => {
  const kt = tokens.emitCompose(brutalismSet());
  assert.match(kt, /^import androidx\.compose\.ui\.graphics\.Color$/m);
  assert.match(kt, /^import androidx\.compose\.ui\.unit\.Dp$/m);
  assert.match(kt, /^import androidx\.compose\.ui\.unit\.dp$/m);
  assert.match(kt, /object BrutalismTokens \{/);
  assert.match(kt, /object Light \{/);
  assert.match(kt, /object Dark \{/);

  // Colour literals are 0xAARRGGBB, which is the order Compose reads them in.
  assert.match(kt, /val bg: Color = Color\(0xFFFEF6E4\)/);
  assert.match(kt, /val ink: Color = Color\(0xFF0A0A0A\)/);
  assert.match(kt, /val radiusMd: Dp = 0\.dp/);
  assert.match(kt, /val targetMin: Dp = 44\.dp/);
  // Compose animation durations are integer milliseconds, not seconds.
  assert.match(kt, /const val durBase: Long = 150L/);
  assert.match(kt, /const val shadow2: String = "4px 4px 0 0 var\(--um-brutalism-border\)"/);
});

test('the CLI reads a token-set JSON file and writes any of the five formats', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'um-emit-'));
  const input = path.join(dir, 'tokens.json');
  writeFileSync(input, JSON.stringify(brutalismSet()));

  assert.match(cli(input, '--format=css').stdout, /--um-brutalism-bg: #fef6e4;/);
  assert.match(cli(input, '--format=theme').stdout, /@theme \{/);
  assert.match(cli(input, '--format=ts').stdout, /export const brutalismTokens/);
  assert.match(cli(input, '--format=swift').stdout, /import SwiftUI/);
  assert.match(cli(input, '--format=kt').stdout, /object BrutalismTokens/);

  // --out writes the file and says where it went.
  const out = path.join(dir, 'brutalism.css');
  const written = cli(input, '--format=css', `--out=${out}`);
  assert.equal(written.status, 0);
  assert.match(readFileSync(out, 'utf8'), /:root \{/);

  // An invalid set fails loudly with the whole list of problems, and nothing
  // reaches disk. A validator that stops at the first error makes a ten-token
  // mistake into ten runs.
  const broken = brutalismSet();
  broken.light['wibble-3'] = '1px';
  broken.light['radius-huge'] = '4px';
  const badInput = path.join(dir, 'broken.json');
  writeFileSync(badInput, JSON.stringify(broken));
  const failed = cli(badInput, '--format=css');
  assert.equal(failed.status, 2);
  assert.match(failed.stderr, /wibble/);
  assert.match(failed.stderr, /radius-huge/);

  assert.equal(cli('--help').status, 0);
  rmSync(dir, { recursive: true, force: true });
});
