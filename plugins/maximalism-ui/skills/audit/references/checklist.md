# Maximalism audit checklist

Two lists merged: the twelve self-run validation checks from `docs/06-maximalism.md` §13 and
the pass/fail checklist from §7. Each item is marked **core**, **style** or **scan**.

- **core** — `ui-morphism-core:a11y-validate` runs it. Same logic for all ten styles; never
  reimplement it here, and in particular never write a second contrast function. There must
  be exactly one.
- **style** — this plugin's own, decided by reading. It encodes a fact about maximalism, not
  a fact about accessibility, so core has no business knowing it.
- **scan** — this plugin's own, decided mechanically by
  `../../apply/scripts/max-scan.mjs`. The scanner's findings are inputs to the report, not
  the report.

Record each row as pass / fail / not-applicable with the exact failing selector and, for
contrast rows, the computed ratio to three decimal places, unrounded.

## A. Contrast and colour

| # | Check | Owner |
|---|---|---|
| A1 | Every text/ground pair ≥ 4.5:1 normal text, ≥ 3:1 for ≥ 24px or ≥ 18.66px bold. Unrounded: a ratio a hair under the bar fails the bar. | core |
| A2 | Every control boundary ≥ 3:1 against both its own fill and its surroundings (SC 1.4.11). | core |
| A3 | Every pair re-checked in **both** themes. The role bindings rebind under dark; a light-mode-only pass proves nothing about the dark one. | core |
| A4 | `--max-text-on-ink` binds to a **deep** accent in dark mode, never a lifted one. The lifted violet on cream is 2.46:1 — the single most likely defect in this style, and invisible in light mode. | style |
| A5 | Lime, cyan and orange are never text on the paper ground: 1.12:1, 1.45:1 and 2.70:1. Orange fails even the 3:1 non-text bar, so it is decorative only. | style |
| A6 | Violet and cobalt are never text on the ink ground: 2.80:1 and 2.89:1. | style |
| A7 | Cream on magenta (3.31:1) appears only at large-text size — 20px display weight qualifies, 16px body does not. | style |
| A8 | No accent is used as the **only** boundary indicator on a light ground. Magenta at 3.31:1 sits on the 1.4.11 line and the lifted accents sit under it. | style |
| A9 | Components consume `--max-text-on-paper`, `--max-text-on-ink` and `--max-accent-safe`, not raw accent tokens. A raw accent in a `color` declaration is the finding, whatever it measures today. | style |
| A10 | No state, error, selection or category conveyed by colour alone (SC 1.4.1). On a composition with four saturated fills, a tint is not a distinguishable state change. | core |
| A11 | Disabled controls use `--max-muted` (9.26:1 light surface, 8.86:1 dark) plus `filter: saturate(0.2)`, never `opacity` alone. | style |

## B. The layer stack

| # | Check | Owner |
|---|---|---|
| B1 | No text sits directly on a pattern, gradient, photograph or grain layer. The nearest ancestor with an opaque background is a surface, not the scene. | style |
| B2 | Loud layers counted per scene; no scene exceeds **three**. Name every layer counted: patterned ground, chromatic stacked shadow, rotated element, marquee, blend-mode overlay, oversized display type, sticker cluster, animated ornament. | scan |
| B3 | Every scene carrying a blend mode is wrapped in `isolation: isolate`. | scan |
| B4 | No `mix-blend-mode` on a full-viewport overlay. | scan |
| B5 | Every container's structural boundary is a real `border`, not a shadow. Forced colours discards `box-shadow` in one step. | scan |
| B6 | Shadow blur is exactly 0 everywhere. A blurred shadow is a different style. | scan |
| B7 | Every decorative layer carries `aria-hidden="true"` **and** `pointer-events: none`. | scan |
| B8 | Duplicated marquee content is duplicated *inside* the `aria-hidden` container, so it is announced once or not at all. | style |
| B9 | Stickers carrying information are real text with an `aria-label` giving the full sentence — never an image, never a `::before`. | style |

## C. Focus

| # | Check | Owner |
|---|---|---|
| C1 | A `:focus-visible` rule exists on every focusable element, uses `outline`, has an offset, and clears 3:1. | core |
| C2 | No `outline: none` survives anywhere without a replacement in the same rule set. | core |
| C3 | The ring is the **double** ring: 4px inner at 2px offset plus the ink halo as a `box-shadow`. One ring is not enough when the ground colour is unpredictable. | style |
| C4 | The ring is verified against all six accents plus paper, ink and a photographic ground (SC 2.4.7 / 2.4.13). | core |
| C5 | No focused control is obscured by a sticky marquee bar, a floating sticker or an overlapping rotated card (SC 2.4.11). Check `scroll-margin-block` against the sticky bar's height. | style |
| C6 | Floating ornament is out of the focus path's z-order as well as `pointer-events: none` — an ornament that cannot be clicked can still cover. | style |

## D. Targets and layout

| # | Check | Owner |
|---|---|---|
| D1 | Every target ≥ 24×24 CSS px hard floor; warn below 44×44. Re-measure the axis-aligned bounding box after any `rotate`. | core |
| D2 | Every interactive element derives `min-height` and `min-width` from `--max-target-min` rather than a literal, and the computed value is still ≥ 44px on the transformed box. | style |
| D3 | Warn on `order`, `row-reverse`, `grid-auto-flow: dense` or absolute positioning applied to sequential content (SC 1.3.2). | core |
| D4 | Tab order matches visual order in every anti-grid composition — `grid-area` overlaps, negative margins, rotated collage. This is the style's most under-reported failure. | style |
| D5 | No `position: absolute` ornament survives below the 640px breakpoint, and there is no horizontal overflow at 320px CSS width (SC 1.4.10). | scan |
| D6 | Layout survives 200% text zoom and forced 1.5 line-height / 0.12em letter-spacing (SC 1.4.12). Check every `clamp()` floor and every fixed height on tightly tracked display type. | style |
| D7 | Rotation stays within the resolved `tiltRange` ceiling, and never exceeds 5deg. | scan |
| D8 | Containers reserve right and bottom padding equal to the deepest shadow offset, and no shadow is clipped by an ancestor `overflow: hidden`. | style |

## E. Media queries and motion

| # | Check | Owner |
|---|---|---|
| E1 | A `@media (forced-colors: active)` block exists, uses system colour keywords, hides the pattern and grain planes, and gives every element a real border. No `forced-color-adjust: none` on a text-bearing element. | core |
| E2 | A `prefers-reduced-motion: reduce` block exists and cancels every emitted `animation-iteration-count: infinite`, freezes `animation-timeline`, and flattens large tilts — while leaving state feedback alive. | core |
| E3 | Under reduce, the marquee becomes `overflow-x: auto` rather than simply stopping, so its content is still readable. | style |
| E4 | A `CalmToggle` exists wherever any infinite animation does, sets `data-calm` on `<html>`, and persists to `localStorage` (SC 2.2.2, Level A). | scan |
| E5 | Every infinite animation additionally has a visible pause control or is covered by Calm mode. | style |
| E6 | No animated property outside `transform` / `translate` / `rotate` / `scale` / `opacity` / `box-shadow` / `background-color`. `transition: all` fails this row. | scan |
| E7 | No full-area colour change faster than 2.5 Hz; minimum period 400ms (SC 2.3.1). | style |
| E8 | A `prefers-reduced-transparency: reduce` block exists and drops the grain and flattens the ground — and the design is legible with every texture layer present anyway, because Safari does not implement the query. | core |
| E9 | A coarse-pointer / narrow-viewport degradation block exists: grain off, single shadow rather than chromatic, flat ground. | style |
| E10 | Scroll-linked motion uses `animation-timeline` or a throttled rAF loop, never a raw `scroll` listener writing styles synchronously. | style |

## F. Budgets

| # | Check | Budget | Owner |
|---|---|---|---|
| F1 | Font families | ≤ 4 | scan |
| F2 | Total font payload, subset WOFF2 | ≤ 180 KB | style |
| F3 | Raster noise or pattern assets | 0 bytes — inline SVG or CSS gradients | scan |
| F4 | Grain texture | ≤ 2 KB inline, or a 160×160 tile at ≤ 4 KB | style |
| F5 | Collage cut-outs and stickers | ≤ 250 KB total | style |
| F6 | Hero imagery | ≤ 200 KB | style |
| F7 | Images above the fold | ≤ 600 KB | style |
| F8 | JS, compressed | ≤ 120 KB | style |
| F9 | LCP / CLS / INP | ≤ 2.5s / ≤ 0.1 / ≤ 200ms | style |
| F10 | Composited layers per scene | 25-40 routine; each scene wrapped in `isolation: isolate` | style |
| F11 | Simultaneously visible hover-animated shadows | ≤ 8 before moving to a translated pseudo-element | style |

## G. Notes the report must carry regardless of pass or fail

- The loud-layer census: one row per scene, every layer named, the total against the cap.
- A tab-order note for every anti-grid composition — `grid-area` overlap, negative margin,
  absolute ornament, rotation.
- Every intensity clamp and context cap that fired, with requested and applied values.
- Every anti-pattern requested and refused, with the alternative offered.
- Anything that could not be verified statically: composited contrast over a pattern,
  computed target size after a transform, real Windows High Contrast behaviour, actual font
  subset bytes, and the rendered loud-layer count. These go in Manual TODOs, not in the pass
  column.
