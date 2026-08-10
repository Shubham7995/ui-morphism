---
name: detect-stack
description: >-
  Use immediately before applying or auditing one NAMED ui-morphism style, as that
  skill's first step. It emits the single fixed JSON contract the ten style skills
  branch on — framework, styling system, Tailwind v4 versus v3, dark-mode strategy,
  component root, and whether a token system such as shadcn or Material is already
  in place — so that ten skills detecting independently do not produce ten slightly
  different answers. Read-only: it never edits a file, never applies its own
  findings, and chooses nothing about how the UI should look. Do NOT use as a
  general project survey or stack-detection step for frontend work at large.
  Determining the stack is the opening move of almost every frontend task, and this
  skill is not that opener: it does not serve "build me a settings page", "add a
  component here", "what is this repo built with", "set up Tailwind", or any
  open-ended design, quality, de-slopping or accessibility request. Those belong to
  the skill or tool that owns the work, and it should win them. With no ui-morphism
  style named, this skill has nothing to contribute.
argument-hint: "[project root, default .]"
allowed-tools:
  - Read
  - Glob
  - Grep
license: MIT
metadata:
  sourceDoc: docs/MARKETPLACE.md
  docSection: "7.4"
  lastResearched: "2026-08-09"
---

# Detect stack

One procedure, one output shape, called first by every style skill. The point is not that detection is hard — it is that ten skills detecting independently produce ten slightly different answers, and the first divergence anyone notices is a Tailwind v3 project that received a v4 `@theme` block.

## Two rules this skill enforces, without exception

**1. Detection is always confirmed with the user. It is never applied silently.**
Print the result, name the evidence, and ask before anything downstream acts on it. This requirement appears independently in six of the ten style specs, which is what makes it a shared rule rather than a per-style preference. A user who says "no, we're migrating off styled-components" has just saved a rewrite of every component in the scope.

**2. `confidence: "low"` means ask, not guess.**
Low confidence is a question, not a hedged answer. Do not pick the most likely value and proceed with a caveat in the report — state what is ambiguous, state the candidates, and let the user choose. A wrong framework guess produces files in the wrong language; a wrong styling guess produces a token layer nothing consumes.

## Detection inputs

Read these, in this order. Stop reading once every field is resolved with high confidence; the later inputs exist to break ties.

| Signal | Read from | Resolves |
|---|---|---|
| Dependency graph | `package.json` — `dependencies`, `devDependencies`, `peerDependencies` | `framework`, and the coarse `styling` |
| Tailwind major version | `@import "tailwindcss"` in any `.css` (v4) versus a `tailwind.config.{js,ts,cjs,mjs}` plus `tailwind` in deps (v3) | `styling: tailwind-v4` vs `tailwind-v3` |
| CSS Modules | any `*.module.css` / `*.module.scss` | `styling: css-modules` |
| CSS-in-JS | `styled-components` or `@emotion/*` imports in source, not just in deps | `styling: styled-components` / `emotion` |
| Framework config | `next.config.*`, `svelte.config.js`, `app.vue` / `nuxt.config.*`, `vite.config.*`, `astro.config.*` | `framework`, and the component root |
| TypeScript | `tsconfig.json`, `.ts`/`.tsx` sources | `react-ts` vs `react-js` |
| Apple platforms | `Package.swift`, `*.xcodeproj`, `.swift` sources importing `SwiftUI` | `framework: swiftui` |
| Android XR | `build.gradle.kts` containing `androidx.xr.*` | `framework: compose-xr` |
| Dark-mode strategy | `darkMode: 'class'` in a v3 config; `@custom-variant dark` or `data-theme` / `.dark` selectors in CSS; `prefers-color-scheme` blocks with no class hook | `darkModeStrategy` |
| Existing tokens | `components.json` (shadcn), `--mui-*` / `--mantine-*` / `--chakra-*` / `--radix-*` custom properties, an existing `--um-*` set | `existingTokenSystem` |
| Component root | the deepest directory holding the most component files: `src/components/ui`, `src/components`, `app/components`, `components`, `lib/components`, `Sources/<Target>/Views` | `componentRoot` |

## Output contract

Emit exactly this shape. Field names and enum values are fixed — a style skill branches on them, so an invented value is a silent no-op downstream.

```json
{
  "framework": "react-ts",
  "styling": "tailwind-v4",
  "darkModeStrategy": "class",
  "existingTokenSystem": "shadcn",
  "componentRoot": "src/components/ui",
  "confidence": "high",
  "evidence": ["package.json: react@19, tailwindcss@4.1", "src/app.css: @import \"tailwindcss\""]
}
```

| Field | Values |
|---|---|
| `framework` | `react-ts` · `react-js` · `vue` · `svelte` · `angular` · `html` · `swiftui` · `compose-xr` · `unknown` |
| `styling` | `css` · `css-modules` · `sass` · `tailwind-v4` · `tailwind-v3` · `styled-components` · `emotion` · `vanilla-extract` · `swiftui-native` · `compose-native` · `unknown` |
| `darkModeStrategy` | `media` · `class` · `data-attribute` · `both` · `none` |
| `existingTokenSystem` | `shadcn` · `material` · `mantine` · `chakra` · `radix-themes` · `custom` · `um` · `none` |
| `componentRoot` | a repository-relative path, or `null` when no component directory exists yet |
| `confidence` | `high` · `medium` · `low` |
| `evidence` | array of `"<file>: <the string that decided it>"`, one per resolved field, minimum two entries |

**Confidence is a whole-result judgement, not a per-field one.** Rate it:

- **high** — every field resolved from a file that states it directly, with no contradicting signal.
- **medium** — one field inferred rather than read (a component root chosen by file count, a dark-mode strategy inferred from selectors), everything else direct.
- **low** — two or more styling systems in active use, no `package.json`, a framework in dependencies but absent from source, or a Tailwind version that cannot be pinned. **Ask.**

## Procedure

1. **Glob the root** for `package.json`, `tsconfig.json`, `tailwind.config.*`, `next.config.*`, `svelte.config.js`, `nuxt.config.*`, `vite.config.*`, `components.json`, `Package.swift`, `build.gradle.kts`. Read the ones that exist.
2. **Resolve `framework`.** Dependencies decide the family; `tsconfig.json` plus `.tsx` files decide `-ts` versus `-js`. A framework in `dependencies` with zero imports in source is stale — record it as evidence *against* and drop confidence to `low`.
3. **Resolve `styling`, and pin the Tailwind major version explicitly.** `@import "tailwindcss"` in a stylesheet is v4. A `tailwind.config.*` with a `content` array is v3. Both present means a migration is in flight: that is `low` confidence, and the question to ask is which one the new tokens should target.
4. **Resolve `darkModeStrategy`.** `class` when `.dark` or `darkMode: 'class'` drives it, `data-attribute` when `[data-theme]` does, `media` when only `prefers-color-scheme` blocks exist, `both` when a media query is paired with a class or attribute override, `none` when there is no dark path at all. `both` is what the ui-morphism emitters produce, so a project reporting `media` is a project whose explicit theme choice currently loses to the OS.
5. **Resolve `existingTokenSystem`.** Grep for the marker custom properties. This matters because a style skill must layer *onto* an existing system rather than replace it — a shadcn project wants `--um-*` tokens feeding `--background` and `--foreground`, not competing with them.
6. **Resolve `componentRoot`** by file count, not by convention. Report the path that actually holds the components.
7. **Emit the JSON, print the evidence, and ask for confirmation.** Then stop. This skill does not proceed to apply anything.

## What to say when confirming

Show the JSON, then one sentence per field that a user can disagree with in plain language:

> React with TypeScript, styled with Tailwind v4 (`@import "tailwindcss"` in `src/app.css`, `tailwindcss@4.1.13` in `package.json`). Dark mode switches on the `.dark` class. shadcn/ui is already installed, so the new tokens will feed its variables rather than replace them. Components live in `src/components/ui`. Is that right?

If confidence is `low`, replace the last sentence with the actual question and do not proceed until it is answered.
