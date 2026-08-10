---
name: token-emit
description: >-
  Its contract is internal: a ui-morphism style skill calls it to emit that ONE
  NAMED style's own token set in the shared --um-<style>-<group>-<variant>
  grammar, as vanilla :root CSS, a Tailwind v4 @theme mirror, a TypeScript
  object, a SwiftUI enum or a Compose object, so the dark-mode emission shape and
  the Tailwind namespace mapping are identical across all ten styles and no style
  skill hand-writes a stylesheet. It also validates a token set already in that
  grammar against the closed group vocabulary, and resolves an intensity 0-100
  onto the calling style's knobs. Owns no token values. Do NOT use for general
  token, theming or design-system work with no ui-morphism style named: "set up
  design tokens", "build a design system", "export my tokens", "export our design
  tokens to Tailwind", "generate a theme", "validate our design tokens", or
  naming, scale and theming review of a token set this skill did not emit. A
  design-system or design-quality tool owns that work and should win it. With no
  ui-morphism style named, this skill has nothing to emit.
argument-hint: "[tokens.json] [--format=css|theme|ts|swift|kt] [--out=path]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/emit.mjs *)
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/intensity.mjs *)
license: MIT
metadata:
  sourceDoc: docs/00-comparison-matrix.md
  docSection: "7"
  lastResearched: "2026-08-09"
---

# Token emit

Core owns the grammar, the closed group vocabulary, the five emitters, the dark-mode emission shape, the Tailwind v4 mapping, and the intensity contract. It owns **no token values**: what a style looks like belongs to the style plugin, and nothing in this skill knows what brutalism is.

Four of the ten docs originally emitted dark mode only one way, and three used two different prefixes internally. Centralising emission makes those classes of bug impossible rather than merely discouraged.

## Read before emitting

Do not reproduce any of this from memory. The four references are short and they are the specification:

- [`references/token-grammar.md`](./references/token-grammar.md) — the shape, the regex, the ten style segments, the four rules, the dark-mode emission shape.
- [`references/group-vocabulary.md`](./references/group-vocabulary.md) — the twenty-two groups, their variants, and which ones are closed.
- [`references/tailwind-mapping.md`](./references/tailwind-mapping.md) — group to namespace, and why `@theme` is never nested.
- [`references/intensity-contract.md`](./references/intensity-contract.md) — the five rules of the 0-100 dial, and the clamp and cap mechanisms.

## The input

A token set is JSON. Keys are `<group>[-<variant>]`, values are CSS values.

```json
{
  "style": "brutalism",
  "polarity": "light-first",
  "light": { "bg": "#fef6e4", "ink": "#0a0a0a", "border-strong": "#000000" },
  "dark":  { "bg": "#101010", "ink": "#f5f0e6", "border-strong": "#f5f0e6" }
}
```

`polarity` defaults to `light-first`. `dark-first` exists for glassmorphism, which does not own its ground; any other style setting it needs a reason in its own doc §4.

## Procedure

1. **Load `ui-morphism-core:detect-stack`** and confirm the framework and styling system with the user. A Tailwind v3 project must not receive a v4 `@theme` block.
2. **Resolve the intensity** onto the style's knobs before deciding any value. The contract is the calling style plugin's `assets/intensity.contract.json` — that file is the entire interface between core and a style on this subject, and a style skill hands over its path rather than resolving anything itself or reaching into this directory:
   ```bash
   node ${CLAUDE_SKILL_DIR}/scripts/intensity.mjs <style-plugin>/assets/intensity.contract.json \
     --intensity=60 --context=scope=product
   ```
   The result carries `requested`, `effective`, `capApplied`, `capReason`, the resolved `knobs` and every `clamped` entry. All of that goes into §5 of the audit report — a cap that is applied without being reported is indistinguishable from a bug.

   A contract that does not satisfy the five rules exits 2 instead of resolving, so a style whose knob table reverses direction, or whose zero is described as "off", finds out here rather than in a shipped stylesheet.
3. **Build the token set** from the style's own values. Populate only the groups the style actually has: glassmorphism has no `bg` because it depends on a ground it does not own, minimalism declares `blur-0: 0px` because declaring the zero is the contract.
4. **Validate before writing anything.** The emitters validate on every call and refuse to produce output for a set that fails, so an invalid set never reaches disk.
5. **Emit each format the detected stack needs.**
   ```bash
   node ${CLAUDE_SKILL_DIR}/scripts/emit.mjs tokens.json --format=css   --out=tokens/brutalism.css
   node ${CLAUDE_SKILL_DIR}/scripts/emit.mjs tokens.json --format=theme --out=tokens/brutalism.theme.css
   node ${CLAUDE_SKILL_DIR}/scripts/emit.mjs tokens.json --format=ts    --out=src/tokens/brutalism.ts
   node ${CLAUDE_SKILL_DIR}/scripts/emit.mjs tokens.json --format=swift --out=Sources/Tokens/Brutalism.swift
   node ${CLAUDE_SKILL_DIR}/scripts/emit.mjs tokens.json --format=kt    --out=tokens/BrutalismTokens.kt
   ```
6. **Run `ui-morphism-core:a11y-validate` on the emitted CSS**, correct what it flags, re-emit, and record every correction.

## The two invariants this skill exists to hold

**Dark mode emits in exactly three blocks.** Light values on bare `:root` with `color-scheme` declared; dark values duplicated under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` **and** under `:root[data-theme="dark"]`. Values live on bare `:root` so a token is never defined only inside a media query. The media block is guarded so an explicit light choice beats the OS preference. The attribute block repeats real declarations so an explicit dark choice wins in both directions. `emit.mjs` offers no option to produce anything else, and it rejects a set whose override theme declares a name the base theme does not.

**`@theme` is never nested inside an at-rule.** It declares the design system and is processed once at build time to decide which utility classes exist; nesting it does not make utilities conditional, it makes the sheet wrong in a way that still looks right during light mode. Theme *values* switch outside `@theme`, on ordinary selectors, in the same three-block shape. `emit.mjs` runs `assertThemeNotNested()` on its own output before returning it.

## What the native emitters will and will not claim

Colours become `Color`, lengths become `CGFloat` / `Dp`, durations become `TimeInterval` seconds / `Long` milliseconds. Anything with no native equivalent — a four-layer `box-shadow`, a `cubic-bezier`, a font stack — is carried as a `String` with a comment saying it is an untranslated CSS value. Inventing an `NSShadow` for a shadow stack would be a lie with a type on it, and the consumer would not find out until it rendered.

## Refuse

- **A group outside the vocabulary.** The list is closed on purpose. A concept with no entry gets an inline value with a comment, not a token, and not a twenty-third group.
- **An abbreviated style segment.** `--um-lg-*` versus `--um-gl-*` is exactly the two-character collision the spelled-out names exist to prevent.
- **A token declared only in the dark theme.** It is undefined for every user whose preference points the other way.
- **A component stylesheet that declares its own tokens.** A sheet may consume `var(--um-brutalism-dur-base, 150ms)`; it may not declare `--um-brutalism-dur-base: 150ms`, and it may not introduce a second prefix. That sheet renders correctly standalone and silently ignores the host theme, which is why it survives review.
- **Emitting a Tailwind v4 `@theme` block into a v3 project.** Detect first, confirm, then emit.
