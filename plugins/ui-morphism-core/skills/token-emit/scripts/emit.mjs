#!/usr/bin/env node
/**
 * emit.mjs — the `--um-*` token grammar and its emitters.
 *
 * Core owns the grammar, the closed group vocabulary, the dark-mode emission
 * shape, the Tailwind v4 group-to-namespace mapping and the five output
 * formats. It owns no token VALUES: what a style looks like belongs to the
 * style plugin, and nothing in this file knows what brutalism is.
 *
 * Specification: docs/00-comparison-matrix.md §7, restated in
 * ../references/token-grammar.md, group-vocabulary.md and tailwind-mapping.md.
 */

import { parseColor } from '../../a11y-validate/scripts/contrast.mjs';

export class TokenError extends Error {}

/**
 * The ten style segments, each the owning doc's frontmatter `name` character
 * for character. Order follows the doc numbering.
 */
export const STYLES = [
  'skeuomorphism',
  'neumorphism',
  'glassmorphism',
  'claymorphism',
  'minimalism',
  'maximalism',
  'brutalism',
  'liquid-glass',
  'bento-grid',
  'spatial-ui',
];

/**
 * The closed group vocabulary from §7.3. Twenty-two entries, and adding a
 * twenty-third is a cost paid by all ten styles' validators.
 *
 * `variants: null` marks a ladder whose steps are a style fact rather than a
 * shared one — `blur`, `weight`, `leading` and `tracking` differ per style, so
 * any `[a-z0-9]+` step is accepted there. Everywhere else the list is closed.
 * `''` in a list means the bare group name is itself a token (`ink`, `border`).
 */
export const GROUPS = {
  bg: { variants: [''] },
  surface: { variants: ['1', '2', '3', '4'] },
  ink: { variants: ['', 'muted', 'inverse'] },
  border: { variants: ['', 'strong'] },
  accent: { variants: ['', 'fg', 'subtle'] },
  danger: { variants: [''] },
  radius: { variants: ['sm', 'md', 'lg', 'pill'] },
  shadow: { variants: ['1', '2', '3', '4', '5', 'inset', 'press'] },
  elev: { variants: ['0', '1', '2', '3', '4', '5'] },
  blur: { variants: null },
  saturate: { variants: [''] },
  noise: { variants: ['opacity', 'freq'] },
  space: { variants: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  font: { variants: ['body', 'display', 'mono'] },
  text: { variants: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] },
  weight: { variants: null },
  leading: { variants: null },
  tracking: { variants: null },
  dur: { variants: ['fast', 'base', 'slow'] },
  ease: { variants: ['standard', 'enter', 'exit'] },
  focus: { variants: ['color', 'width', 'offset'] },
  target: { variants: ['min'] },
};

/**
 * Split a `group[-variant]` key into its parts. The group is the leading
 * segment, so `border-strong` splits as `border` + `strong`.
 */
function parseKey(key) {
  const dash = key.indexOf('-');
  if (dash === -1) return { group: key, variant: '' };
  return { group: key.slice(0, dash), variant: key.slice(dash + 1) };
}

/**
 * Check a token set against the grammar and the closed vocabulary.
 *
 * Returns `{ errors }` so a caller can report every problem at once rather than
 * one per run. Pass `{ throwOnError: true }` to turn the collected errors into
 * a `TokenError` instead.
 */
export function validateTokenSet(set, { throwOnError = false } = {}) {
  const errors = [];
  if (!STYLES.includes(set?.style)) {
    errors.push(`style: "${set?.style}" is not one of the ten segments (${STYLES.join(', ')})`);
  }
  for (const [themeName, theme] of Object.entries({ light: set?.light, dark: set?.dark })) {
    for (const key of Object.keys(theme ?? {})) {
      const { group, variant } = parseKey(key);
      if (!(group in GROUPS)) {
        errors.push(
          `${themeName}.${key}: "${group}" is not a group. The vocabulary is closed — ` +
            'a concept with no entry gets an inline value with a comment, not a token.',
        );
        continue;
      }
      const allowed = GROUPS[group].variants;
      if (allowed !== null && !allowed.includes(variant)) {
        errors.push(
          `${themeName}.${key}: "${variant || '(bare)'}" is not a variant of "${group}". ` +
            `Allowed: ${allowed.map((v) => v || '(bare)').join(', ')}.`,
        );
      }
    }
  }
  // Rule 3: every token must have a value on the bare selector, so an override
  // theme may only redeclare names the base theme already defines.
  const base = set?.polarity === 'dark-first' ? set?.dark : set?.light;
  const override = set?.polarity === 'dark-first' ? set?.light : set?.dark;
  for (const key of Object.keys(override ?? {})) {
    if (!(key in (base ?? {}))) {
      errors.push(
        `${key} is declared only in the override theme. Every token needs a value on bare ` +
          ':root, or it is undefined for every user whose preference points the other way.',
      );
    }
  }

  if (throwOnError && errors.length) throw new TokenError(errors.join('\n'));
  return { errors };
}

/**
 * The two theme polarities, and the selectors each one emits.
 *
 * `light-first` is the rule as written in §7.4: light on bare `:root`, dark
 * duplicated under the guarded media query and the attribute selector.
 * `dark-first` is the same rule mirrored, and it exists for exactly one style —
 * glassmorphism, which is dark-first because it does not own its ground. A
 * style setting it needs a reason in its own doc §4.
 */
const POLARITIES = {
  'light-first': {
    baseTheme: 'light',
    overrideTheme: 'dark',
    colorScheme: 'light dark',
    mediaQuery: '@media (prefers-color-scheme: dark)',
    guardedSelector: ':root:not([data-theme="light"])',
    attributeSelector: ':root[data-theme="dark"]',
  },
  'dark-first': {
    baseTheme: 'dark',
    overrideTheme: 'light',
    colorScheme: 'dark light',
    mediaQuery: '@media (prefers-color-scheme: light)',
    guardedSelector: ':root:not([data-theme="dark"])',
    attributeSelector: ':root[data-theme="light"]',
  },
};

function polarityOf(set) {
  const name = set.polarity ?? 'light-first';
  if (!(name in POLARITIES)) {
    throw new TokenError(`polarity "${name}" is not light-first or dark-first`);
  }
  return { name, ...POLARITIES[name] };
}

/** The tokens the override theme actually changes. Unchanged values stay inherited. */
function overrides(set, polarity) {
  const base = set[polarity.baseTheme] ?? {};
  const override = set[polarity.overrideTheme] ?? {};
  return Object.entries(override).filter(([key, value]) => base[key] !== value);
}

function declarations(entries, style, indent) {
  return entries.map(([key, value]) => `${indent}${tokenName(style, key)}: ${value};`).join('\n');
}

/**
 * Emit the vanilla `:root` stylesheet for a token set.
 *
 * The three-block shape is not configurable, because every way of varying it is
 * a bug: values only inside a media query are undefined for half the users, an
 * unguarded media query loses to nothing, and an attribute block that only sets
 * `color-scheme` produces dark text on a dark scrim.
 */
export function emitCss(set) {
  validateTokenSet(set, { throwOnError: true });
  const polarity = polarityOf(set);
  const style = set.style;
  const baseEntries = Object.entries(set[polarity.baseTheme] ?? {});
  const overrideEntries = overrides(set, polarity);

  const lines = [
    `/* --um-${style}-* tokens. Generated by ui-morphism-core:token-emit. */`,
    `/* Polarity: ${polarity.name}. ${polarity.baseTheme} values live on bare :root; ` +
      `${polarity.overrideTheme} values are duplicated under both override selectors. */`,
    '',
    ':root {',
    `  color-scheme: ${polarity.colorScheme};`,
    declarations(baseEntries, style, '  '),
    '}',
  ];

  if (overrideEntries.length) {
    lines.push(
      '',
      `${polarity.mediaQuery} {`,
      `  ${polarity.guardedSelector} {`,
      declarations(overrideEntries, style, '    '),
      '  }',
      '}',
      '',
      `${polarity.attributeSelector} {`,
      declarations(overrideEntries, style, '  '),
      '}',
    );
  }

  return `${lines.join('\n')}\n`;
}

/** Assert that no `@theme` block in the given CSS is nested inside an at-rule. */
export function assertThemeNotNested(css) {
  let depth = 0;
  for (let i = 0; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') depth -= 1;
    else if (css.startsWith('@theme', i) && depth > 0) {
      throw new TokenError(
        '@theme is nested inside an at-rule. It declares the design system and is processed ' +
          'once at build time; nesting it does not make utilities conditional, it makes the ' +
          'sheet wrong in a way that still looks right in light mode.',
      );
    }
  }
  return true;
}

/**
 * The §7.4 Rule 4 mapping from our group vocabulary to Tailwind v4 namespaces.
 * `null` means the group has no namespace and becomes a plain custom property.
 */
const TAILWIND_NAMESPACE = {
  bg: 'color',
  surface: 'color',
  ink: 'color',
  border: 'color',
  accent: 'color',
  danger: 'color',
  radius: 'radius',
  shadow: 'shadow',
  blur: 'blur',
  space: 'spacing',
  text: 'text',
  font: 'font',
  weight: 'font-weight',
  leading: 'leading',
  tracking: 'tracking',
  dur: 'transition-duration',
  ease: 'ease',
  elev: null,
  saturate: null,
  noise: null,
  focus: null,
  target: null,
};

/**
 * The generated theme-variable name for a token key, or `null` when the group
 * has no namespace and the token stays a plain custom property.
 *
 * The colour namespace keeps the group word (`--color-um-brutalism-border`)
 * because six groups collapse into it and dropping the word would collide.
 * Every other namespace already encodes the group, so it carries the variant.
 */
export function tailwindName(style, key) {
  const { group, variant } = parseKey(key);
  const namespace = TAILWIND_NAMESPACE[group];
  if (namespace === null || namespace === undefined) return null;
  const tail = namespace === 'color' ? key : variant;
  return `--${namespace}-um-${style}-${tail}`;
}

/**
 * Emit the Tailwind v4 mirror of a token set.
 *
 * `@theme` declares the design system and is always top level. Theme switching
 * happens outside it, on ordinary selectors, in the same three-block shape as
 * the vanilla output — and referring to the generated names, not the `--um-*`
 * ones, because those are what the utilities resolve against.
 */
export function emitTailwindTheme(set) {
  validateTokenSet(set, { throwOnError: true });
  const polarity = polarityOf(set);
  const style = set.style;
  const baseEntries = Object.entries(set[polarity.baseTheme] ?? {});
  const overrideEntries = overrides(set, polarity);

  const themed = (entries, indent) =>
    entries
      .filter(([key]) => tailwindName(style, key) !== null)
      .map(([key, value]) => `${indent}${tailwindName(style, key)}: ${value};`)
      .join('\n');
  const plain = (entries, indent) =>
    entries
      .filter(([key]) => tailwindName(style, key) === null)
      .map(([key, value]) => `${indent}${tokenName(style, key)}: ${value};`)
      .join('\n');

  const lines = [
    `/* Tailwind v4 mirror of the --um-${style}-* tokens. */`,
    '/* Generated by ui-morphism-core:token-emit. @theme is never nested. */',
    '@import "tailwindcss";',
    '',
    '@theme {',
    themed(baseEntries, '  '),
    '}',
    '',
    '/* elev, saturate, noise, focus and target have no Tailwind namespace, so */',
    '/* they stay plain custom properties and are consumed with var(). */',
    ':root {',
    `  color-scheme: ${polarity.colorScheme};`,
    plain(baseEntries, '  '),
    '}',
  ];

  if (overrideEntries.length) {
    const overrideLines = (indent) =>
      [themed(overrideEntries, indent), plain(overrideEntries, indent)].filter(Boolean).join('\n');
    lines.push(
      '',
      '/* Theme switching happens outside @theme, on ordinary selectors. */',
      `${polarity.mediaQuery} {`,
      `  ${polarity.guardedSelector} {`,
      overrideLines('    '),
      '  }',
      '}',
      '',
      `${polarity.attributeSelector} {`,
      overrideLines('  '),
      '}',
    );
  }

  const css = `${lines.join('\n')}\n`;
  assertThemeNotNested(css);
  return css;
}

/** `brutalism` -> `brutalism`, `liquid-glass` -> `liquidGlass`. */
function camel(text) {
  return text.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}

/** `liquid-glass` -> `LiquidGlass`. */
function pascal(text) {
  const c = camel(text);
  return c[0].toUpperCase() + c.slice(1);
}

/**
 * Emit the TypeScript mirror of a token set.
 *
 * Keys keep their CSS spelling rather than being camelCased, so one token is
 * one string in the stylesheet, the TypeScript and the audit report. The
 * accessor exists so a consumer never hand-writes the `--um-<style>-` prefix,
 * which is the whole reason the grammar is mechanical.
 */
export function emitTypeScript(set) {
  validateTokenSet(set, { throwOnError: true });
  const style = set.style;
  const name = camel(style);
  const Type = pascal(style);
  const theme = (tokens) =>
    Object.entries(tokens ?? {})
      .map(([key, value]) => `    '${key}': '${value.replace(/'/g, "\\'")}',`)
      .join('\n');

  return `/* --um-${style}-* tokens. Generated by ui-morphism-core:token-emit. */

export const ${name}Tokens = {
  light: {
${theme(set.light)}
  },
  dark: {
${theme(set.dark)}
  },
} as const;

export type ${Type}TokenName = keyof typeof ${name}Tokens.light;

/** The custom property reference for a token, so no caller writes the prefix. */
export const ${name}Var = (name: ${Type}TokenName): string => \`var(--um-${style}-\${name})\`;
`;
}

/* ------------------------------------------------------- native emitters */

/**
 * What a token's value IS, decided from the value itself rather than from the
 * group, because several groups hold more than one kind — `focus-color` is a
 * colour and `focus-width` is a length.
 *
 * `raw` is the honest answer for a CSS value with no native equivalent: a
 * four-layer `box-shadow`, a `cubic-bezier`, a font stack. Those are carried as
 * strings with a comment saying so. Inventing an `NSShadow` for a shadow stack
 * would be a lie with a type on it, and the consumer would not find out until
 * it rendered.
 */
function valueKind(value) {
  const text = String(value).trim();
  if (/^#[0-9a-f]{3,8}$/i.test(text)) return 'color';
  if (/^rgba?\(|^hsla?\(/i.test(text)) return 'color';
  if (/^-?\d*\.?\d+px$/.test(text)) return 'length';
  if (/^-?\d*\.?\d+ms$/.test(text)) return 'duration-ms';
  if (/^-?\d*\.?\d+s$/.test(text)) return 'duration-s';
  if (/^-?\d*\.?\d+$/.test(text)) return 'number';
  return 'raw';
}

function numberIn(value) {
  return Number.parseFloat(String(value));
}

/** Emit the SwiftUI mirror of a token set. */
export function emitSwift(set) {
  validateTokenSet(set, { throwOnError: true });
  const style = set.style;
  const Type = pascal(style);

  const member = (key, value) => {
    const name = camel(key);
    switch (valueKind(value)) {
      case 'color': {
        const c = parseColor(value);
        const f = (n) => Number((n / 255).toFixed(3));
        return (
          `      public static let ${name} = Color(red: ${f(c.r)}, green: ${f(c.g)}, ` +
          `blue: ${f(c.b)}, opacity: ${Number(c.a.toFixed(3))})`
        );
      }
      case 'length':
        return `      public static let ${name}: CGFloat = ${numberIn(value)}`;
      case 'duration-ms':
        return `      public static let ${name}: TimeInterval = ${numberIn(value) / 1000}`;
      case 'duration-s':
        return `      public static let ${name}: TimeInterval = ${numberIn(value)}`;
      case 'number':
        return `      public static let ${name}: Double = ${numberIn(value)}`;
      default:
        return (
          '      /// CSS value, not translated: no SwiftUI type carries this.\n' +
          `      public static let ${name}: String = ${JSON.stringify(String(value))}`
        );
    }
  };

  const theme = (label, tokens) =>
    [
      `    public enum ${label} {`,
      Object.entries(tokens ?? {})
        .map(([key, value]) => member(key, value))
        .join('\n'),
      '    }',
    ].join('\n');

  return `// --um-${style}-* tokens. Generated by ui-morphism-core:token-emit.
import SwiftUI

public enum ${Type}Tokens {
${theme('Light', set.light)}

${theme('Dark', set.dark)}
}
`;
}

/** Emit the Jetpack Compose mirror of a token set. */
export function emitCompose(set) {
  validateTokenSet(set, { throwOnError: true });
  const style = set.style;
  const Type = pascal(style);

  const member = (key, value) => {
    const name = camel(key);
    switch (valueKind(value)) {
      case 'color': {
        const c = parseColor(value);
        const hex = (n) =>
          Math.round(n)
            .toString(16)
            .toUpperCase()
            .padStart(2, '0');
        const argb = `0x${hex(c.a * 255)}${hex(c.r)}${hex(c.g)}${hex(c.b)}`;
        return `    val ${name}: Color = Color(${argb})`;
      }
      case 'length':
        return `    val ${name}: Dp = ${numberIn(value)}.dp`;
      case 'duration-ms':
        return `    const val ${name}: Long = ${Math.round(numberIn(value))}L`;
      case 'duration-s':
        return `    const val ${name}: Long = ${Math.round(numberIn(value) * 1000)}L`;
      case 'number':
        return `    const val ${name}: Float = ${numberIn(value)}f`;
      default:
        return (
          '    // CSS value, not translated: no Compose type carries this.\n' +
          `    const val ${name}: String = ${JSON.stringify(String(value))}`
        );
    }
  };

  const theme = (label, values) =>
    [
      `  object ${label} {`,
      Object.entries(values ?? {})
        .map(([key, value]) => member(key, value))
        .join('\n'),
      '  }',
    ].join('\n');

  return `// --um-${style}-* tokens. Generated by ui-morphism-core:token-emit.
package uimorphism.tokens

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

object ${Type}Tokens {
${theme('Light', set.light)}

${theme('Dark', set.dark)}
}
`;
}

/* --------------------------------------------------------------------- CLI */

/** The five output formats, by the name the CLI and the skills use. */
export const FORMATS = {
  css: emitCss,
  theme: emitTailwindTheme,
  ts: emitTypeScript,
  swift: emitSwift,
  kt: emitCompose,
};

/** Emit a token set in the named format. */
export function emit(set, format) {
  if (!(format in FORMATS)) {
    throw new TokenError(`format "${format}" is not one of ${Object.keys(FORMATS).join(', ')}`);
  }
  return FORMATS[format](set);
}

const USAGE = `emit.mjs — --um-<style>-<group>[-<variant>] tokens, five ways.

  node emit.mjs <tokens.json> --format=css|theme|ts|swift|kt [--out=PATH]

The input is a token set:

  {
    "style": "brutalism",              one of the ten segments
    "polarity": "light-first",         or "dark-first"; optional, default light-first
    "light": { "bg": "#fef6e4", ... }, keys are <group>[-<variant>]
    "dark":  { "bg": "#101010", ... }  may only redeclare names "light" defines
  }

Formats:
  css     vanilla :root, dark duplicated under both override selectors
  theme   Tailwind v4 @theme, never nested, plus the theme-switch blocks
  ts      TypeScript object, both themes, keys in CSS spelling
  swift   SwiftUI enum: Color / CGFloat / TimeInterval, raw CSS as String
  kt      Compose object: Color / Dp / Long millis, raw CSS as String

Without --out the result goes to stdout. Exit status is 2 on a token set that
does not validate, and every problem is reported at once rather than the first.`;

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

  const { readFile, writeFile } = await import('node:fs/promises');
  const set = JSON.parse(await readFile(positional[0], 'utf8'));
  const format = flags.get('format') ?? 'css';
  const output = emit(set, format);

  if (flags.has('out')) {
    await writeFile(flags.get('out'), output);
    process.stdout.write(`wrote ${flags.get('out')} (${format}, ${output.length} bytes)\n`);
  } else {
    process.stdout.write(output);
  }
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`emit.mjs: ${error.message}\n`);
      process.exitCode = 2;
    },
  );
}

/** The validating regex from §7.1. Shape only — the vocabulary check is separate. */
export const TOKEN_NAME_RE = new RegExp(`^--um-(${STYLES.join('|')})-[a-z]+(-[a-z0-9]+)?$`);

/**
 * Build a full custom-property name from a style segment and a `group[-variant]`
 * key. Throws rather than emitting a name no validator will recognise.
 */
export function tokenName(style, key) {
  if (!STYLES.includes(style)) {
    throw new TokenError(
      `"${style}" is not a style segment. The ten are: ${STYLES.join(', ')} — ` +
        'and they are spelled out in full, never abbreviated.',
    );
  }
  const name = `--um-${style}-${key}`;
  if (!TOKEN_NAME_RE.test(name)) {
    throw new TokenError(`"${name}" does not match the --um-<style>-<group>[-<variant>] grammar`);
  }
  return name;
}
