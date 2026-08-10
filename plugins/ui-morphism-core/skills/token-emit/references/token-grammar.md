# The `--um-*` token grammar

Source of truth: [`docs/00-comparison-matrix.md` §7.1-7.2](https://github.com/Shubham7995/ui-morphism/blob/main/docs/00-comparison-matrix.md). This file restates it in the form the emitter enforces. Where this file and the doc disagree, the doc wins and this file is the bug.

## The shape

```
--um-<style>-<group>[-<variant>]
```

One `--um-` root (ui-morphism), then the style segment, then a group word from the closed vocabulary in [`group-vocabulary.md`](./group-vocabulary.md), then an optional variant or step.

```css
--um-skeuomorphism-shadow-1
--um-neumorphism-border-strong
--um-glassmorphism-blur-2
--um-liquid-glass-radius-pill
--um-bento-grid-space-4
--um-spatial-ui-elev-5
```

## The validating regex

```
^--um-(skeuomorphism|neumorphism|glassmorphism|claymorphism|minimalism|maximalism|brutalism|liquid-glass|bento-grid|spatial-ui)-[a-z]+(-[a-z0-9]+)?$
```

`scripts/emit.mjs` exports this as `TOKEN_NAME_RE` and applies it to every name it emits. A name that fails is an error, not a warning: the whole point of a mechanical grammar is that a cross-style validator can be written once, and one non-conforming name makes that false.

Note what the regex permits and the vocabulary does not. `--um-brutalism-wibble-3` matches the regex — `wibble` is `[a-z]+` — and is still rejected, because `wibble` is not a group. The regex is the shape check; the vocabulary is the meaning check. Both run.

## The ten style segments

Each segment is the owning doc's frontmatter `name`, character for character, including the hyphens.

| Doc | Style segment | Legacy prefix in the doc |
|---|---|---|
| 01 | `skeuomorphism` | `--sk-*` |
| 02 | `neumorphism` | `--nm-*` |
| 03 | `glassmorphism` | `--glass-*` |
| 04 | `claymorphism` | `--clay-*` |
| 05 | `minimalism` | `--min-*` |
| 06 | `maximalism` | `--max-*` |
| 07 | `brutalism` | `--nb-*` |
| 08 | `liquid-glass` | `--lg-*` |
| 09 | `bento-grid` | `--bento-*` |
| 10 | `spatial-ui` | `--sp-*` |

No abbreviations, ever. The verbosity is deliberate: these names appear in generated code that a human reads once and a validator reads every build, and `--um-lg-*` versus `--um-gl-*` is exactly the two-character collision that produces a silent wrong-token bug.

## The four rules

**Rule 1 — one set of names per style.** The token table and the emitted CSS use identical names. No unprefixed names in prose with prefixed names in code.

**Rule 2 — component sheets consume tokens, they never redeclare them.** A component stylesheet may write `var(--um-brutalism-dur-base, 150ms)` — an inline fallback is consumption. It may not write `--um-brutalism-dur-base: 150ms`, and it may not introduce a second prefix of its own. This is the single easiest regression to reintroduce, because a sheet that declares its own tokens renders correctly standalone and silently ignores the host theme.

**Rule 3 — light on bare `:root`, dark duplicated under both selectors.** See [the dark-mode emission shape](#the-dark-mode-emission-shape) below.

**Rule 4 — the Tailwind v4 mirror maps group to namespace mechanically, and `@theme` is never nested inside an at-rule.** See [`tailwind-mapping.md`](./tailwind-mapping.md).

## The dark-mode emission shape

This is a bug class, not a preference. `emit.mjs` produces exactly this and offers no option to produce anything else.

```css
:root {
  color-scheme: light dark;
  --um-glassmorphism-surface-1: rgba(255, 255, 255, 0.10);
  --um-glassmorphism-border-strong: rgba(255, 255, 255, 0.34);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --um-glassmorphism-surface-1: rgba(255, 255, 255, 0.14);
    --um-glassmorphism-border-strong: rgba(255, 255, 255, 0.42);
  }
}

:root[data-theme="dark"] {
  --um-glassmorphism-surface-1: rgba(255, 255, 255, 0.14);
  --um-glassmorphism-border-strong: rgba(255, 255, 255, 0.42);
}
```

Three properties matter, and each of them is a defect if dropped:

1. **Every token has a value on bare `:root`.** A token defined *only* inside a media query is undefined for every user whose OS preference points the other way. `emit.mjs` rejects a token set whose override theme declares a name the base theme does not.
2. **The media block is guarded with `:not([data-theme="light"])`,** so an explicit light choice beats the OS preference.
3. **The attribute block repeats the same declarations,** so an explicit dark choice wins in both directions. It must redeclare real tokens; a block that only sets `color-scheme` is the partial-override bug that produces dark text on a dark scrim.

**The one legitimate mirror.** Glassmorphism is dark-first: it does not own its ground, and its default surface is a light fill over a dark page. For that polarity the same rule is mirrored, not relaxed — dark values on bare `:root`, the *light* override guarded as `@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) }`, and the complete light list duplicated under `:root[data-theme="light"]`. `emit.mjs` takes `polarity: "dark-first"` for this and emits a comment saying which polarity it used. No other style may set it without a documented reason in its own doc §4.

## What is not a token

A concept with no entry in the group vocabulary does not get a token; it gets an inline value with a comment. Liquid Glass's displacement scale and Spatial UI's stage `perspective` are both in this category. Resist adding groups — the vocabulary is closed on purpose, and every addition is a cost paid by all ten styles' validators.
