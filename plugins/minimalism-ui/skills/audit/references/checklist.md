# Minimalism audit checklist

Two lists merged: the self-run validation checklist from `docs/05-minimalism.md` §13 and
the pass/fail checklist from §7. Each item is marked **core** or **style**.

- **core** — `ui-morphism-core:a11y-validate` runs it. Same logic for all ten styles;
  never reimplement it here, and in particular never write a second contrast function.
  There must be exactly one.
- **style** — this plugin's own. It encodes a fact about minimalism, not a fact about
  accessibility, so core has no business knowing it.

Record each row as pass / fail / not-applicable with the exact failing selector and, for
contrast rows, the computed ratio to three decimal places, unrounded.

One structural note before the rows. In every other style in this set, a failing row means
something was *added* wrongly. In this one, most failing rows mean something was
*removed* — a label, a boundary, an underline, a focus ring, a target. Read the tables
with that asymmetry in mind: the empty-looking interface is the suspect, not the alibi.

## A. Contrast and colour

| # | Check | Owner |
|---|---|---|
| A1 | Every foreground/background pair ≥ 4.5:1 normal text, ≥ 3:1 for ≥ 24px or ≥ 18.66px bold, on every surface it can render against. Unrounded: 2.999:1 fails a 3:1 requirement. | core |
| A2 | Every control boundary ≥ 3:1 against its adjacent background (SC 1.4.11). | core |
| A3 | Border-vs-adjacent-surface ≥ 3:1 in **both** themes, checked explicitly in dark. | core |
| A4 | No body text lighter than `#737373` on white (4.74:1) or darker than `#787878` on `#0A0A0A`. Any grey in the `#888`–`#AAA` band presented as "secondary text" is the defect. | style |
| A5 | The decorative hairline is not carrying a control. `--min-border-subtle` at 1.2:1 — `#E5E5E5` at 1.26:1 in a host sheet — is legal between two rows and illegal as the edge of an input, a secondary button, an unchecked checkbox, a toggle track or a slider rail. | style |
| A6 | Where a boundary was raised, it reaches the real threshold: `#949494` is 3.03:1 and `#959595` is 2.995:1. WCAG does not round up to meet a threshold. | style |
| A7 | The palette carries ≤ 2 chromatic hues — one accent, one danger — and ≤ 11 neutral steps. | style |
| A8 | `--min-accent-subtle` is used as a ground only, never as a text colour and never as a border. | style |
| A9 | No state, error, selection or category conveyed by colour alone (SC 1.4.1). A one-accent palette makes this the style's easiest failure: selected tab = blue text, error = red text. | core |
| A10 | Disabled text is exempt from 1.4.3 but encodes nothing on its own; disabled state carries a second channel and a real `disabled` or `aria-disabled`. | style |
| A11 | Neutral chroma is consistent in sign — a ramp does not mix warm and cool greys — and sits inside the resolved `chromaBudget`. | style |

## B. Structure and boundary

| # | Check | Owner |
|---|---|---|
| B1 | No primary action is a ghost or outline-only button. Doc §10 ships solid filled primaries; NN/g reports materially lower click rates for ghost CTAs. | style |
| B2 | Every element that lost its shadow has a border. A card never loses both. | style |
| B3 | No `backdrop-filter` and no `filter: blur()` on a base-layer surface, and `--min-backdrop-blur: 0px` is declared rather than omitted. | style |
| B4 | ≤ 3 elevation rungs exist in total, and no element sits above the resolved `decorationBudget`. Resting shadows stay under 8px blur and under 8% opacity. | style |
| B5 | Links keep an underline, or gain one on `:hover` at `text-underline-offset: 3px`. | style |
| B6 | No visible label, help text, error message, required-field marker or `<legend>` has been removed. Placeholder text is never the only label (SC 3.3.2). | style |
| B7 | Every visually implied group has a real semantic container with an accessible name — `<section aria-labelledby>`, `<fieldset><legend>`, `<nav aria-label>`, a real `<h2>`. No `<div>` in a larger font simulating a heading. | style |
| B8 | Interactive elements are real `<button>` / `<a>` / `<input>`, not a `div` with `role="button"`. | style |
| B9 | Icons are a single stroke weight on one surface; filled and outline icons are not mixed. | style |

## C. Focus

| # | Check | Owner |
|---|---|---|
| C1 | A `:focus-visible` rule exists on every focusable element, uses `outline` and not `box-shadow`, has an offset, and clears 3:1. | core |
| C2 | No `outline: none` survives anywhere without a replacement outline in the same rule set. | core |
| C3 | The ring is ≥ 2px at ≥ 2px offset, which also satisfies SC 2.4.13 and is the recommended default even when only AA is claimed. | style |
| C4 | The rule is on `:focus-visible`, not `:focus`, so pointer users do not see rings — and the distinction has not been used as an excuse to drop the indicator entirely. | style |
| C5 | No focused element is obscured by a thin sticky header or an edge-to-edge sticky footer at any viewport height (SC 2.4.11). Check `scroll-margin-block` on focusables, or `scroll-padding-block-start` on the scroll container. | style |

## D. Targets and layout

| # | Check | Owner |
|---|---|---|
| D1 | Every target ≥ 24×24 CSS px hard floor; warn below 44×44 on a touch-primary surface. | core |
| D2 | The floor comes from `--min-target-min` rather than a literal, and nothing downstream overrides it downward. The resting size comes from `--min-control-lg` (40px) wherever a control height is possible. | style |
| D3 | Warn on `order`, `row-reverse`, `grid-auto-flow: dense` or absolute positioning applied to sequential content (SC 1.3.2). | core |
| D4 | Tab order matches visual order everywhere the layout reorders with `order`, `grid-area` or `flex-direction: row-reverse` (SC 2.4.3). Minimal layouts lean on grid and flex reordering more than most. | style |
| D5 | Prose containers are clamped to `65ch` (max `75ch`) in `ch` or `rem` — never a `px` `max-width`, which does not grow at 200% zoom. | style |
| D6 | Body type is declared in `rem`, not `px` (SC 1.4.4). | style |
| D7 | No fixed `px` height on a text-bearing container and no `overflow: hidden` on label text; applying the SC 1.4.12 overrides — line-height 1.5×, paragraph spacing 2×, letter-spacing 0.12em, word-spacing 0.16em — clips and overlaps nothing. | style |
| D8 | At 200% zoom and 320px CSS width the page reflows with no horizontal scroll (SC 1.4.10). | style |
| D9 | Spacing sits on the 4px ramp, and grouping is carried by the ~4:1 between-group to within-group ratio rather than by a divider on every boundary. | style |

## E. Media queries and motion

| # | Check | Owner |
|---|---|---|
| E1 | A `@media (forced-colors: active)` block exists, uses system colour keywords, and gives every button, input and card a visible boundary. No `forced-color-adjust: none` on a text-bearing element. | core |
| E2 | That block specifically rescues transparent-background ghost controls, which have neither fill nor border for the forced palette to paint and otherwise vanish entirely. `forced-color-adjust: none` appears on the primary fill only, mapped to `Highlight` / `HighlightText`. | style |
| E3 | A `prefers-reduced-motion: reduce` block exists, covers every animated selector, and does not remove any state-carrying property. | core |
| E4 | Under reduce the interface **reduces rather than deletes**: translation, looping animation, parallax and `scroll-behavior: smooth` are gone, and a ≤ 100ms opacity fade remains so state changes stay legible. A blanket `0.01ms` reset that makes state imperceptible is a finding, not a pass. | style |
| E5 | Every duration ≤ 300ms and on the `{100, 150, 200, 300}`ms ramp; every easing is `cubic-bezier(0.2, 0, 0, 1)` or `cubic-bezier(0.4, 0, 1, 1)`, with no control point outside `[0,1]`. | style |
| E6 | No infinite animation that does not represent an in-progress operation. Skeleton shimmer on loaded content and ambient background motion are the usual offenders. | style |
| E7 | Under `prefers-reduced-transparency: reduce`, overlay scrims go more opaque (0.4 → 0.85) rather than blurring. Mostly a no-op here, which is a genuine advantage of the style. | style |
| E8 | Hover animates `background-color` on rows and controls, not on a full-width sticky header during scroll, and nothing animates `width`, `height`, `padding`, `margin`, `top`/`left`, `filter` or `letter-spacing`. | style |

## F. Budgets

| # | Check | Budget | Owner |
|---|---|---|---|
| F1 | Critical CSS, inlined | ≤ 14 KB compressed (§8) | style |
| F2 | Total CSS | ≤ 40 KB compressed (§8, §13 item 10) | style |
| F3 | Added JS for the visual layer | 0 KB — this style needs no runtime | style |
| F4 | Fonts | ≤ 2 files, ≤ 120 KB total | style |
| F5 | Icons | inline SVG sprite ≤ 8 KB; **never** an icon font | style |
| F6 | Images above the fold | ≤ 150 KB, AVIF/WebP, `fetchpriority="high"` on the LCP one | style |
| F7 | Fonts declared with `font-display: swap` and a `size-adjust` / `ascent-override` metric-matched local fallback, exactly one weight-axis file preloaded, variable rather than four static cuts | — | style |
| F8 | Accent coverage | ≤ the resolved `accentCoveragePct`; 6.6% at the default intensity | style |
| F9 | Field metrics on a mid-tier 2022 Android throttled 4× | LCP ≤ 2.0s, INP ≤ 150ms, CLS ≤ 0.05, 60fps on a 500-row list with `content-visibility: auto` | style |

## G. Notes the report must carry regardless of pass or fail

- The restoration log: every ghost button, raised boundary, restored underline, added
  focus ring, padded target, added semantic container and restored second channel. In this
  style that log is the point of the run.
- A tab-order note for every layout using `order`, `grid-area`, `row-reverse` or
  `position: absolute`.
- The list of every intensity clamp and context cap that fired, with requested and applied
  values — including the `weightMax ≤ 600` clamp and any `affordanceFloor` context clamp,
  which are reported even when they change nothing.
- The list of every anti-pattern requested and refused, with the alternative offered.
- Anything that could not be verified statically: real Windows High Contrast behaviour,
  the SC 1.4.12 text-spacing overrides applied in a browser, computed target size after
  layout, actual font subset sizes, and a greyscale pass over the finished UI. These go in
  Manual TODOs, not in the pass column.
