# Bento grid tokens

Source of truth: `docs/09-bento-grid.md` §4 (Anatomy & Design Tokens). Every value below is
that section's, unchanged. The emitted stylesheet is `../assets/tokens.css` — it is the §4
`:root` block verbatim, and `../assets/tokens.theme.css` is its Tailwind v4 `@theme` mirror.

Do not reproduce a value from memory, and do not re-derive one that is written here. Where a
value is computed rather than declared — the concentric media radius, the tile background at a
non-default `surfaceDelta` — the arithmetic is stated in full at the bottom of this file.

The token layer is emitted through `ui-morphism-core:token-emit`, which owns the
`--um-<style>-<group>-<variant>` grammar, the group vocabulary, the five output formats, the
dark-mode emission shape and the Tailwind namespace mapping. This file owns only the values.

**Prefix.** The doc emits `--bento-*` and the assets ship that prefix, because it is what the
recipes in §5 reference. Under the shared grammar the same tokens are
`--um-bento-grid-<group>-<variant>`. `MARKETPLACE.md` §9 open question 13 has not been decided,
so emit `--bento-*` and, when the project already uses the `--um-*` grammar, ask core to emit
the aliased pair rather than picking one silently.

---

## 1. Grid

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--bento-cols` | `12` | same | Desktop column count (≥ 1280px). `6` for simple three-across sections. Reassigned inside the media queries, not duplicated as a second token. |
| `--bento-gap` | `16px` | same | The locked gutter. One value for the whole section; never varied per tile. |
| `--bento-gap-lg` | `24px` | same | Editorial / large-format gutter. Swap `--bento-gap` for it at the section root; never mix the two. |
| `--bento-row` | `180px` | same | Auto-row unit. A 1×1 tile is 180px tall; a two-row tile is 376px with a 16px gap. |
| `--bento-max-w` | `1280px` | same | Max section width. Above it add side padding — do not add columns. |

## 2. Surface

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--bento-page-bg` | `#ffffff` | `#000000` | Page ground behind the grid. |
| `--bento-tile-bg` | `#f5f5f7` | `#161617` | Default tile. ΔL ≈ 8.6 points light, ≈ 0.8 dark. |
| `--bento-tile-bg-raised` | `#ffffff` | `#1d1d1f` | For tiles sitting on a tinted section. |

## 3. Border

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--bento-border` | `1px solid rgba(0, 0, 0, 0.06)` | `1px solid rgba(255, 255, 255, 0.08)` | Hairline, ≈ 1.14:1 light. Decorative only, never the sole indicator of anything. |
| `--bento-border-interactive` | `1px solid rgba(0, 0, 0, 0.45)` | `1px solid rgba(255, 255, 255, 0.35)` | Clears 3:1 against the tile — 3.31:1 light, 3.23:1 dark. Use when the tile is itself a control. |

The interactive alphas are solved values, not round numbers. Over `#f5f5f7` the 3:1 crossing is
`rgba(0,0,0,0.4199)`, so the token ships `0.45`; over `#161617` the crossing is
`rgba(255,255,255,0.3294)`, so the token ships `0.35`. `0.18` measures 1.52:1 and is a
frequently copied mistake.

## 4. Radius

| Token | Value | Notes |
|---|---|---|
| `--bento-radius` | `24px` | Tile. Tailwind `rounded-3xl`. Every tile in a grid uses the same value. |
| `--bento-radius-media` | `12px` | Nested media. Concentric: `inner = outer − padding`. |
| `--bento-radius-chip` | `999px` | Chips and badges. |

## 5. Elevation

| Token | Light | Dark |
|---|---|---|
| `--bento-shadow-rest` | `0 1px 2px rgba(0, 0, 0, 0.04)` | `0 1px 2px rgba(0, 0, 0, 0.40)` |
| `--bento-shadow-hover` | `0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)` | `0 8px 24px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.35)` |

Separation comes from the gap, not from the shadow. The hover shadow appears only on tiles that
are genuinely interactive, and only paired with `--bento-lift`.

## 6. Padding

| Token | Value | Applies to |
|---|---|---|
| `--bento-pad-sm` | `20px` | `unit` (1×1) |
| `--bento-pad-md` | `24px` | `wide`, `tall`, `strip` (2×1, 1×2) |
| `--bento-pad-lg` | `32px` | `hero` (2×2) |
| `--bento-pad-stack` | `16px` | Internal gap, media → title |
| `--bento-pad-tight` | `8px` | Internal gap, title → body |

## 7. Targets

| Token | Value | Notes |
|---|---|---|
| `--bento-target-min` | `24px`, `44px` under `@media (pointer: coarse)` | Minimum hit area for anything interactive. |

The tile is never the constraint — a `unit` tile is three columns by 180px. The token is sized
for the "Learn more →" chips, tag pills and icon buttons *inside* a tile: the 24px SC 2.5.8
floor with a mouse, 44px on touch, because below 768px every tile is full-width and those chips
become thumb targets. Chips must take `min-height` / `min-width` from the token, never a
literal.

## 8. Colour

| Token | Light | Dark | Measured |
|---|---|---|---|
| `--bento-fg` | `#1d1d1f` | `#f5f5f7` | 15.46:1 light / 16.61:1 dark on tile |
| `--bento-fg-muted` | `#6e6e73` | `#a1a1a6` | 4.66:1 light / 7.03:1 dark on tile |
| `--bento-accent` | `#0071e3` | `#0a84ff` | 4.31:1 light / 4.96:1 dark vs tile |
| `--bento-focus` | `#0071e3` | `#0a84ff` | Same value as the accent today, but a separate property so a theme can decouple them without weakening the ring. |
| `--bento-scrim` | `linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0) 70%)` | same | Image scrim. ≥ 4.7:1 for white text over pure white imagery. |

`--bento-fg-muted` at 4.66:1 passes AA for normal text with almost no margin. Lightening the
tile or darkening the text by one step drops it under 4.5:1, so any palette substitution must be
re-checked by `ui-morphism-core:a11y-validate` rather than assumed.

`--bento-accent` at 4.31:1 passes 1.4.11 as a focus ring or a UI boundary and **fails** 4.5:1 as
body text on the tile. Do not set body copy in the accent.

## 9. Type

| Token | Value | Notes |
|---|---|---|
| `--bento-eyebrow` | `600 13px/1.3 system-ui, -apple-system, "Segoe UI", sans-serif` | Uppercase it in the rule, not the token. Drawn in `--bento-fg-muted`. |
| `--bento-eyebrow-tracking` | `0.06em` | Positive tracking is what makes the uppercase eyebrow legible. |
| `--bento-title` | `600 clamp(20px, 1.4vw + 12px, 28px)/1.2 system-ui, -apple-system, sans-serif` | Tile title. |
| `--bento-title-tracking` | `-0.02em` | Optical correction at title size. |
| `--bento-hero` | `600 clamp(28px, 2.6vw + 8px, 44px)/1.1 system-ui, -apple-system, sans-serif` | Hero-tile title. |
| `--bento-hero-tracking` | `-0.03em` | Tighter again at display size. |
| `--bento-body` | `400 16px/1.5 system-ui, -apple-system, sans-serif` | Body copy. Drawn in `--bento-fg-muted`. |
| `--bento-stat` | `700 clamp(40px, 4vw, 72px)/1 system-ui, -apple-system, sans-serif` | Stat numeral. Set `font-variant-numeric: tabular-nums` alongside it. |
| `--bento-stat-tracking` | `-0.04em` | The tightest step in the scale. |

## 10. Motion

| Token | Value | Notes |
|---|---|---|
| `--bento-dur-press` | `90ms` | Press. |
| `--bento-dur-hover` | `180ms` | Hover. |
| `--bento-dur-reveal` | `320ms` | Scroll reveal. |
| `--bento-stagger` | `40ms` | Per-tile reveal offset. Cap the total sequence at 400ms. |
| `--bento-ease` | `cubic-bezier(0.2, 0, 0, 1)` | Standard, decelerating. |
| `--bento-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Exit. |
| `--bento-lift` | `-2px` | Hover lift, applied as `translateY(var(--bento-lift))`. Never scale the tile. |

---

## 11. Four quantities that are deliberately not tokens

Emitting any of these as a custom property is a defect, and §4 says why for each.

1. **Tablet and mobile column counts** (`6` at 768–1279px, `1` below 768px) are reassignments of
   `--bento-cols` inside the media queries. A per-breakpoint column token would be a value
   nothing reads. Halve every span at 6 columns; at 1 column every span is full-width.
2. **The mobile gutter (`12px`)** is a literal `gap` in the sub-768px block. At one column the
   gutter is vertical rhythm between stacked cards, not a grid gutter; binding it to the gap
   family would invite someone to use 12px on desktop and break the locked-gutter rule that
   defines the style.
3. **The reveal cap (400ms total)** is a budget: `--bento-dur-reveal` + `--bento-stagger × n`.
   What it constrains is how many tiles you may stagger, not any single declaration. Past
   roughly two tiles of stagger you drop the stagger, not the duration.
4. **The concentric radius rule (`inner = outer − padding`)** is arithmetic over two tokens whose
   operands change per tile size. `calc(var(--bento-radius) - var(--bento-pad-sm))` is wrong on
   any tile using `--bento-pad-md` or `--bento-pad-lg`. Compute it per tile at emit time.

## 12. Span vocabulary

Only five spans exist. More than five and the composition stops reading as a system.

| Name | Desktop (12-col) | Tablet (6-col) | Mobile | Padding | Use |
|---|---|---|---|---|---|
| `hero` | `span 6 / span 2` | `span 6 / span 2` | full | `--bento-pad-lg` | primary claim |
| `wide` | `span 6 / span 1` | `span 6 / span 1` | full | `--bento-pad-md` | secondary feature with horizontal media |
| `tall` | `span 3 / span 2` | `span 3 / span 2` | full | `--bento-pad-md` | vertical screenshot, list |
| `unit` | `span 3 / span 1` | `span 3 / span 1` | full | `--bento-pad-sm` | one stat, one icon + line |
| `strip` | `span 12 / span 1` | `span 6 / span 1` | full | `--bento-pad-md` | full-bleed CTA or logo row |

At 1280px with 12 columns and a 16px gutter a column is 92px, so a `hero` is 632 × 376px and a
`unit` is 308 × 180px. `scripts/assign-spans.mjs` computes this geometry and reports the
dominant tile's share of the section, which §3 puts at 30–40%.

## 13. Tailwind v4 mapping

`../assets/tokens.theme.css` is the mirror. The namespace mapping is core's
(`token-emit/references/tailwind-mapping.md`): colour → `--color-*`, radius → `--radius-*`,
shadow → `--shadow-*`, spacing/gap/row/padding → `--spacing-*`, easing → `--ease-*`, keyframe
binding → `--animate-*`.

Two rules that are not negotiable:

- `@theme` is never nested inside an at-rule, so the dark values live in plain `:root` blocks in
  core's dark-mode emission shape.
- Reference a theme token from markup by its generated utility name — `rounded-bento`,
  `ease-bento`, `auto-rows-bento-row`. In v4 **bracket syntax takes a literal**, so
  `ease-[--ease-bento]` emits `transition-timing-function: --ease-bento`, which is invalid CSS,
  dropped silently: default easing, square media corners, no error anywhere. To point at a
  custom property use the parenthesis shorthand: `ease-(--bento-ease)`,
  `rounded-tl-(--bento-radius-media)`.

Tailwind has no theme namespace for raw durations, tracking steps, composite `font` shorthands,
gradients or translate distances, so those stay as plain custom properties in the same file and
are consumed with the parenthesis shorthand.

## 14. Dark-mode emission shape

Core's shape, used by `../assets/tokens.css` exactly:

1. Light values on bare `:root`.
2. Dark values under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`.
3. The same dark values duplicated under `:root[data-theme="dark"]`.
4. `@media (pointer: coarse) { :root { --bento-target-min: 44px; } }` **last**, so it wins in
   both themes.

Both dark lists are complete. A partial override is what produces a light hairline on a dark
tile.

## 15. Which token each intensity knob moves

Knob ranges and defaults are §13's; the bindings below are how this skill applies them. The
curve is two linear segments anchored so intensity 45 lands exactly on the default:

```
knob(i) = i <= 45 ? MIN + (DEFAULT - MIN) * (i / 45)
                  : DEFAULT + (MAX - DEFAULT) * ((i - 45) / 55)
```

| Knob | Moves | How |
|---|---|---|
| `spanVariance` | the span vocabulary in use | Quantised into four bands by `scripts/assign-spans.mjs`. It changes which spans are permitted, not a token. |
| `radius` | `--bento-radius`, and `--bento-radius-media` through it | `--bento-radius-media = radius − padding`, per tile. `--bento-radius-chip` stays `999px`. |
| `surfaceDelta` | `--bento-tile-bg` (and `--bento-tile-bg-raised`) | See below. |
| `mediaBleed` | the bleed margin on `.bento__media--bleed` | `bleed = mediaBleed% × the tile's padding token`. 0% is fully inset with a concentric radius; 100% is the full negative-margin bleed §5 emits, which at `--bento-pad-lg` is 32px. |
| `motion` | `--bento-dur-reveal`, `--bento-stagger`, `--bento-lift`, media scale | Resolved as a discrete ladder, because the 400ms reveal budget does not scale with intensity. |

**`surfaceDelta` is in WCAG relative-luminance points × 100**, which is the unit §4's note uses:
`#ffffff` → `#f5f5f7` is ΔL 8.57 and the note says "≈ 8.6 points light"; `#000000` → `#161617`
is ΔL 0.806 and the note says "≈ 0.8 dark". Ask `ui-morphism-core:a11y-validate` for the
luminance; never compute one here.

The two themes have different anchor deltas at the same default knob value of 8, so the knob is
applied as a **ratio to each theme's anchor**:

```
emitted ΔL = anchor ΔL × (surfaceDelta / 8)
   light anchor 8.57  (#ffffff → #f5f5f7)
   dark  anchor 0.806 (#000000 → #161617)
```

At `surfaceDelta: 0` both are 0 — the tile is the page colour and separation comes from the gap
alone, which is exactly what §13 says intensity 0 means. At the default 8 the emitted values are
§4's verbatim in both themes. **This ratio is a derivation, not a doc statement**: §13 defines
the knob in luminance points and §4 fixes both anchor pairs, and applying 8 points literally to
`#000000` would emit a dark tile far lighter than `#161617`. Record the derivation in the audit
whenever `surfaceDelta ≠ 8`.
