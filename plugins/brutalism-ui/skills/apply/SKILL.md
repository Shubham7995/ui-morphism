---
name: apply
description: >-
  Use when the user NAMES the style — neubrutalism, neo-brutalism, brutalist UI — or
  describes its concrete moves: hard 2-5px ink borders, zero-blur offset shadows such as
  "4px 4px 0 #000", flat saturated fills on a cream ground, sticker tilt, or hover that
  translates an element into its own shadow. Also for a named reference (Gumroad,
  neobrutalism.com, ekmas/neobrutalism-components), or for deriving a neubrutalist token
  layer from a brand palette and retuning it by intensity 0-100. ui-morphism is
  descriptive and plural — one named language with
  measured tokens and a stated when-not-to-use — not a design-quality tool. Do NOT use for
  open-ended quality work: "make it look good", "make it modern", "polish this", "clean
  this up", "improve the design", "make it less AI-generated", taste or visual-craft
  critique, de-slopping, or animation and micro-interaction craft. A general design, taste
  or animation skill answers those better and should win them. Do not use for the sibling
  languages either: translucent or backdrop-blurred panels (glassmorphism-ui), tile-span
  layout (bento-grid-ui). Nor for the neighbouring languages this marketplace documents
  but has not yet shipped a plugin for: same-hue soft extrusion (docs/02), puffy pastel
  clay (docs/04), material texture (docs/01), layered collage (docs/06), quiet subtraction
  (docs/05), Apple Liquid Glass (docs/08), depth and parallax (docs/10). This style is
  defined by the absence of blur: if the request wants blur it is not this skill. To
  review without editing, use brutalism-ui:audit.
argument-hint: "[scope glob] [--intensity=0-100] [--scope=marketing|product|both] [--theme=light|dark|both] [--density=compact|default|roomy] [--motion=on|minimal]"
allowed-tools: Read Glob Grep Edit Write
license: MIT
metadata:
  sourceDoc: docs/07-brutalism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Brutalism: apply

Neubrutalism is flat design plus a border and an offset. The single defining move is
the **hard offset shadow**: `box-shadow: 4px 4px 0 0 #000` on an element that also has
`border: 2px solid #000`. No blur. No spread. No alpha. The shadow is a solid duplicate
of the element's box pushed down-right, so the surface reads as a paper sticker lifted
off the page rather than as a lit object. Hovering slides the element into its own
shadow. Everything else — flat saturated fills, cream ground, chunky display type,
mono labels, sticker tilt — hangs off that one move.

Two things follow from it and are not negotiable. **Every shadowed element also has a
real border**, because forced-colors mode nulls `box-shadow` and the border is what
survives. And **the border token flips to a light ink in dark mode**, because the
most-copied reference library keeps it black and measures 1.56:1 against its own dark
surface.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark
   mode strategy and component root. Never guess, never rewrite silently, and confirm
   the detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` before emitting anything. Do not reproduce token values
   or contrast ratios from memory.
3. Establish `scope`. Default is `src/components/ui/**`. Whole-app application on an
   unscoped request is an anti-pattern — say so and narrow it. Doc §9 is explicit that
   dense enterprise UI takes this style as an accent, not a skin.

## Inputs

| Input | Type | Default |
|---|---|---|
| `framework` | tailwind-v4 \| tailwind-v3 \| css \| css-modules \| styled-components \| swiftui \| react-native | detected, confirmed |
| `basePalette` | 1-3 hex accents + a ground | `#FFDC58`, `#FF6B9D`, `#A3E635` on `#FEF6E4` |
| `density` | compact \| default \| roomy | default (16 / 24 / 32px card padding) |
| `intensity` | 0-100 | 60 |
| `scope` | marketing \| product \| both | marketing |
| `theme` | light \| dark \| both | both |
| `motion` | on \| minimal | on |
| `target` | glob list | `src/components/ui/**` |

`scope: product` caps intensity at 45 and forces the quiet dialect. Every supplied
accent is re-checked against `--nb-on-accent` (`#0A0A0A`) and rejected below 4.5:1.

## Procedure

1. **Detect and confirm the stack** — `ui-morphism-core:detect-stack`. Branch every
   later emission decision on its output enum, not on a second read of `package.json`.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — curves, clamps and the
   `scope: product` cap, all from doc §13. Do not resolve it by hand and do not reach into
   core's directory — call `ui-morphism-core:token-emit`, give it that path and the
   requested intensity and context, and let it run its own bundled `intensity.mjs`. Core
   owns the resolver; this plugin owns the numbers; the JSON file is the whole interface
   between them, and it returns the cap and every clamp already formatted for §5 of the
   report.

   Two things the contract deliberately leaves to this skill. Round `shadowOffset` to
   integer px at emit time — doc §13 says "linear, integer-rounded", and the contract
   carries the unrounded curve so the monotonicity sweep reads the line the doc states, so
   the default 60 resolves to 5.6 and ships as 6px. And apply the three extra
   `scope: product` clamps — `shadowOffset ≤ 4px`, `borderWidth ≤ 2px`, `tilt = 0` — after
   resolution, because core's resolver caps intensity rather than individual knobs. Record
   every cap, clamp and rounding: the audit reports the requested value next to the applied
   value. `references/tokens.md` §4 is the same table in prose, for reading; the JSON is
   what runs.

3. **Emit the token layer** via `ui-morphism-core:token-emit` under the
   `--um-brutalism-*` grammar, with `assets/tokens.css` shipped alongside it as the
   `--nb-*` value layer and `assets/tokens.um-aliases.css` as the bridge. Populate
   `bg`, `surface`, `ink`, `border`, `accent`, `danger`, `radius`, `shadow`, `blur`
   (explicitly `0px` — declaring the zero is the contract), `space`, `font`, `text`,
   `weight`, `leading`, `tracking`, `dur`, `ease`, `focus`, `target`. Do **not**
   populate `elev`: in this style elevation *is* offset distance, so the six-step
   shadow ladder is the elevation ladder, and a parallel ramp is how a scale drifts.
   Light values on bare `:root`; dark values duplicated under both
   `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and
   `:root[data-theme="dark"]`. Put a computed contrast comment on every accent.
   For Tailwind v4, emit `assets/tokens.theme.css`'s `@theme` shape — never nested
   inside an at-rule, with the `.dark` overrides outside it.

4. **Rewrite the targeted component styles.** Normalise `border-radius` toward the
   resolved radius. Replace every blurred `box-shadow` with the nearest hard rung using
   the conversion rule in `references/tokens.md` §7. Add
   `border: var(--nb-bw) solid var(--nb-border)` to every surface and control. Convert
   gradients to their dominant flat colour. Remove every `backdrop-filter`.

5. **Install the signature interaction** on all buttons and links-as-buttons: hover
   translates by *exactly* the shadow offset and drops the shadow, active goes one
   pixel further, `:focus-visible` adds a real outline that is additive to the resting
   shadow. Wrap the translate in `@media (hover: hover) and (pointer: fine)`.

6. **Retype the hierarchy.** Display face on `h1`-`h3` at weight 700-900 with
   `-0.02em` tracking, body at weight 500, mono uppercase at `0.06em` on labels, badges
   and metadata. Give display headings `overflow-wrap: anywhere` and check the `min` of
   the `clamp()` actually fits at 320px and 200% zoom.

7. **Write the three guard blocks.** They are mandatory on every generated sheet:
   `@media (forced-colors: active)` (shadows to `none`, a system-colour border on every
   generated class, transforms zeroed), `@media (prefers-reduced-motion: reduce)`
   (translate and rotate removed, the shadow-shrink hover cue kept), and
   `@media (hover: hover) and (pointer: fine)` around the translate. Emit them inside
   `@layer brutalism` so the restyle can be toggled off without touching the app's own
   CSS.

8. **Validate.** Run `ui-morphism-core:a11y-validate` over everything emitted. It owns
   all nine universal checks and every contrast computation — this skill computes no
   ratios of its own. Feed it the style-specific assertions from
   `../audit/references/checklist.md` as well. Where a value fails, clamp it and record
   the clamp; never ship a failing pair to satisfy an intensity number.

9. **Write the audit report** to `reports/brutalism-audit.md` using the shared report
   template from `ui-morphism-core` (`assets/report-template.md`), with this style's
   budget rows from `references/tokens.md` §8 and every refusal from
   `references/anti-patterns.md` that fired.

## Outputs

- `tokens/brutalism.tokens.css` — the `:root` plus both dark blocks, with a contrast
  comment per accent
- `tokens/brutalism.theme.css` — the Tailwind v4 `@theme` mirror, or a
  `tailwind.config.ts` extension for v3
- `components/brutal/*` — `Button`, `Card`, `Input`, `Select`, `Badge`, `Tabs`,
  `Dialog`, `Alert`, `Table`, each border-first and carrying the three guard blocks
- `styles/brutalism.layer.css` — the `@layer brutalism { }` override sheet
- `reports/brutalism-audit.md`
- optional `tokens/brutalism.figma.json` — Figma Variables and Effect Styles

## Intensity knobs

Full resolved table at every five points in `references/tokens.md` §4. Curves are from
doc §13. Three knobs state an endpoint pair *and* a midpoint that a straight line
cannot reach, so those three are piecewise-linear through all three stated anchors;
every knob stays monotone across 0→100.

| Knob | 0 | 50 | 100 | Default (60) | Note |
|---|---|---|---|---|---|
| `shadowOffset` | 0px | 4px | 12px | 6px | Sets `--nb-sx` / `--nb-sy`. At 0 the whole set switches to §8's named `.nb--flat` fallback: border only, no shadow. |
| `borderWidth` | 1px | 3px | 5px | 3px | Stepped 1/2/3/4/5 at 0/25/50/75/100. Never 0. |
| `radius` | 12px | 5px | 0px | 4px | Inverse. 12px is the ceiling — at or above it, this is claymorphism. |
| `chroma` | 35% | 68% | 100% | 74% | Percentage of the source accent's OKLCH C, with L and H held. |
| `tilt` | 0deg | 1.5deg | 3deg | 1.8deg | Decorative badges and stickers only, never a focusable or its ancestor. |

**Hard clamps, independent of intensity:** shadow blur exactly 0; spread 0 except 1px
on the `xl` and `2xl` rungs; radius ≤ 12px; border width ≥ 1px; focus outline ≥ 3px at
≥ 2px offset; targets ≥ 24×24 CSS px with 44px shipped; ≤ 3 accent fills per view;
≤ 2 shadow layers per element; the dark border is never `#000`; tilt never applies to
anything containing a focusable descendant.

**Context caps, which override intensity:** `scope: product` caps intensity at 45 and
then clamps `shadowOffset ≤ 4px`, `borderWidth ≤ 2px`, `tilt = 0`. `motion: minimal`
ships the shadow-shrink hover only. Both are reported in the audit.

Intensity 0 is not nothing. It is a bordered, unornamented, fully usable control on a
cream ground — which doc §12 identifies as this style's own minimalism fallback, since
neubrutalism is flat design plus a border and an offset, and dialling both to their
floor lands you exactly there.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`; `ui-morphism-core:a11y-validate`
runs the universal half. The non-negotiable ones:

- [ ] Every emitted foreground/background pair ≥ 4.5:1 normal text, ≥ 3:1 large text
      and non-text. Unrounded — 2.999:1 fails 3:1.
- [ ] Border-vs-adjacent-surface ≥ 3:1 in **both** themes, with the dark border
      explicitly asserted not to be `#000` on a dark surface
- [ ] Every element that received a `box-shadow` also has a `border`
- [ ] `@media (forced-colors: active)` block present, setting `box-shadow: none` plus a
      system-colour border on every generated class
- [ ] `@media (prefers-reduced-motion: reduce)` block present, removing translate and
      rotate and leaving a non-motion hover cue
- [ ] Every `:focus-visible` uses `outline` ≥ 3px with `outline-offset` ≥ 2px, and no
      rule anywhere sets `outline: none` without a replacement in the same rule set
- [ ] Every interactive rule yields a computed box ≥ 24×24 CSS px; warn below 44px;
      re-measure the axis-aligned bounding box after any rotate
- [ ] No `backdrop-filter`, no `filter: blur()`, no non-zero shadow blur anywhere
- [ ] ≤ 2 shadow layers per element, ≤ 3 accents per generated view
- [ ] `will-change` on at most one hovered-subtree selector, never a list-item base
- [ ] Total emitted CSS ≤ 8 KB minified (≤ 6 KB minified + brotli); added JS = 0
- [ ] Fonts declared with `font-display: swap` and a `size-adjust` fallback; warn if
      the display face is not subset
- [ ] A tab-order note emitted for every generated layout using `position: absolute` or
      `order`
- [ ] `intensity: 0` still produces a bordered, accessible, unornamented control

## Refuse to generate

Read `references/anti-patterns.md` in full and follow the core refusal protocol:
refuse, explain, offer the compliant alternative, record it in the report. Highest
frequency:

- A `box-shadow` with non-zero blur or spread presented as a neubrutalist shadow
- A `box-shadow`-based focus indicator, or `outline: none` with no replacement
- Accent-coloured text on a light ground, or white text on any accent fill
- Black borders in a dark theme
- Any blur at all — `backdrop-filter` or `filter: blur()`
- `div`/`span` with `role="button"` in place of a real `<button>`
- Rotation on any element containing a focusable descendant
- A control whose only boundary is a shadow, with no border
