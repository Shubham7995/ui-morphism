# Neubrutalism audit checklist

Two lists merged: the self-run validation checklist from `docs/07-brutalism.md` §13 and
the pass/fail checklist from §7. Each item is marked **core** or **style**.

- **core** — `ui-morphism-core:a11y-validate` runs it. Same logic for all ten styles;
  never reimplement it here, and in particular never write a second contrast function.
  There must be exactly one.
- **style** — this plugin's own. It encodes a fact about neubrutalism, not a fact about
  accessibility, so core has no business knowing it.

Record each row as pass / fail / not-applicable with the exact failing selector and,
for contrast rows, the computed ratio to three decimal places, unrounded.

## A. Contrast and colour

| # | Check | Owner |
|---|---|---|
| A1 | Every foreground/background pair ≥ 4.5:1 normal text, ≥ 3:1 for ≥ 24px or ≥ 19px bold. Unrounded: 2.999:1 fails a 3:1 requirement. | core |
| A2 | Every control boundary ≥ 3:1 against both its own fill and its surroundings (SC 1.4.11). | core |
| A3 | Border-vs-adjacent-surface ≥ 3:1 in **both** themes, checked explicitly in dark. | core |
| A4 | The dark-theme border token is not `#000` on a dark surface. `#000000` on `#2E2E38` is 1.56:1. This is the single most-copied failure in the ecosystem. | style |
| A5 | Every accent is used as a **background** with `#0A0A0A` text, never as text on a light ground. `#FFDC58` on `#FFFFFF` is 1.34:1. | style |
| A6 | No white text on any accent fill. `#FFFFFF` on `#FF6B9D` is 2.68:1. | style |
| A7 | No more than three accent colours visible in one viewport (NN/g). | style |
| A8 | Where two accent fills are adjacent, the ink border carries the boundary — `#A3E635` beside `#FFDC58` is about 1.12:1, so the fills alone are indistinguishable. | style |
| A9 | No state, error, selection or category conveyed by colour alone (SC 1.4.1). Flat blocks make this the style's easiest failure. | core |
| A10 | Disabled controls do not rely on `opacity` alone. 50% `#0A0A0A` over `#FEF6E4` composites to `#848077` — 3.66:1. | style |

## B. Structure and boundary

| # | Check | Owner |
|---|---|---|
| B1 | Every element that has a `box-shadow` also has a real `border`. No shadow-only boundaries. | style |
| B2 | No `backdrop-filter`, no `filter: blur()`, no non-zero shadow blur anywhere in the emitted CSS. | style |
| B3 | No non-zero shadow spread except `1px` on the `xl` and `2xl` rungs. | style |
| B4 | At most two shadow layers per element. | style |
| B5 | Interactive elements are real `<button>` / `<a>` / `<input>`, not `div role="button"`. Forced-colors picks system colours from native semantics. | style |
| B6 | Links keep their underlines. | style |

## C. Focus

| # | Check | Owner |
|---|---|---|
| C1 | A `:focus-visible` rule exists on every focusable element, uses `outline` and not `box-shadow`, has an offset, and clears 3:1. | core |
| C2 | No `outline: none` survives anywhere without a replacement outline in the same rule set. | core |
| C3 | The outline is ≥ 3px with `outline-offset` ≥ 2px — this style's floor, above the SC 2.4.13 minimum of 2px, because the element already carries a 2px ink border that a thinner ring blends into. | style |
| C4 | Focus is **additive** to the resting shadow, never substitutive. | style |
| C5 | No focused control is obscured by a sticky brutalist header or an overlapping sticker (SC 2.4.11). Check `scroll-margin-block`. | style |

## D. Targets and layout

| # | Check | Owner |
|---|---|---|
| D1 | Every target ≥ 24×24 CSS px hard floor; warn below 44×44. Re-measure the axis-aligned bounding box after any `rotate`. | core |
| D2 | Every control clamps to `var(--nb-target-min)` (44px). Badge-buttons and icon chips are the usual offenders — the border makes a 20px square look bigger than it is. | style |
| D3 | Warn on `order`, `row-reverse`, `grid-auto-flow: dense` or absolute positioning applied to sequential content (SC 1.3.2). | core |
| D4 | Tab order matches visual order in every rotated or absolutely-positioned composition. This is the style's most under-reported failure. | style |
| D5 | Nothing rotated contains a focusable descendant. Tilt is decorative only, within ±3°. | style |
| D6 | Grid gaps ≥ shadow offset + 4px, and no shadow is clipped by an ancestor `overflow: hidden`. Containers reserve right/bottom padding equal to the largest offset. | style |
| D7 | Display headings do not overflow at 320px width and 200% zoom (SC 1.4.4 / 1.4.10). Check the `min` of every `clamp()`. | style |

## E. Media queries and motion

| # | Check | Owner |
|---|---|---|
| E1 | A `@media (forced-colors: active)` block exists, uses system colour keywords, gives every shadow-bounded element a real border, and hides decorative pseudo-elements. No `forced-color-adjust: none` on a text-bearing element. | core |
| E2 | That block sets `box-shadow: none` **and** zeroes transforms on every generated class — with the shadow gone, the translate is motion with nothing attached to it. | style |
| E3 | A `prefers-reduced-motion: reduce` block exists, zeroes durations, and does not remove any state-carrying property. | core |
| E4 | Under reduce, translate and rotate are removed **and** a non-motion hover cue remains — the shadow shrinks to `--nb-shadow-sm` rather than the hover doing nothing. | style |
| E5 | The translate is wrapped in `@media (hover: hover) and (pointer: fine)`; touch gets `:active`. | style |
| E6 | Every marquee or ticker has a pause control, or stops under reduced motion (SC 2.2.2). | style |
| E7 | Under `prefers-reduced-transparency: reduce`, the modal overlay goes solid. It is the only transparency in the style, and there is no `backdrop-filter` to remove. | style |

## F. Budgets

| # | Check | Budget | Owner |
|---|---|---|---|
| F1 | Total emitted CSS, minified | ≤ 8 KB (§13) | style |
| F2 | Total emitted CSS, minified + brotli | ≤ 6 KB (§8) | style |
| F3 | Added JS for the aesthetic | 0 KB | style |
| F4 | Raster assets | 0 — the style is drawable in CSS | style |
| F5 | Display font, subset WOFF2 | ≤ 15 KB | style |
| F6 | Body font, two weights, subset WOFF2 | ≤ 45 KB | style |
| F7 | Mono font, optional, subset | ≤ 20 KB | style |
| F8 | `will-change` selectors | ≤ 1, on a hovered subtree, never a list-item base class | style |
| F9 | Fonts declared with `font-display: swap` and a `size-adjust`-tuned local fallback; warn if the display face is not subset | — | style |
| F10 | Hover frame cost on a 60-card grid | ≤ 4ms scripting + paint, 60fps sustained | style |

## G. Notes the report must carry regardless of pass or fail

- A tab-order note for every layout using `position: absolute` or `order`.
- The list of every intensity clamp and context cap that fired, with requested and
  applied values.
- The list of every anti-pattern requested and refused, with the alternative offered.
- Anything that could not be verified statically: rendered composited contrast,
  computed target size after a transform, real Windows High Contrast behaviour, and
  actual font subset sizes. These go in Manual TODOs, not in the pass column.
