# Neumorphism audit checklist

Two lists merged: the twelve-item validation checklist the skill must self-run from
`docs/02-neumorphism.md` §13, and the pass/fail checklist from §7. Each item is marked
**core** or **style**.

- **core** — `ui-morphism-core:a11y-validate` runs it. Same logic for all ten styles;
  never reimplement it here, and in particular never write a second contrast function.
  There must be exactly one.
- **style** — this plugin's own. It encodes a fact about neumorphism, not a fact about
  accessibility, so core has no business knowing it. The mechanical half of these is
  run by `../../apply/scripts/neu-scan.mjs`.

Record each row as pass / fail / not-applicable with the exact failing selector and,
for contrast rows, the computed ratio to three decimal places, unrounded.

## A. Contrast and colour

| # | Check | Owner |
|---|---|---|
| A1 | Every foreground/background pair ≥ 4.5:1 normal text, ≥ 3:1 for ≥ 24px or ≥ 18.66px bold. Unrounded: 2.999:1 fails a 3:1 requirement. | core |
| A2 | Every control boundary ≥ 3:1 against its own fill and its surroundings (SC 1.4.11). | core |
| A3 | The boundary that satisfies A2 is **not** a shadow. Every interactive element has a non-shadow boundary — border, accent fill or text label — at ≥ 3:1. | style |
| A4 | The shadow-vs-surface ratios are *reported*, explicitly labelled "decorative, not an affordance", so nobody mistakes them for compliance. Expected 1.2:1 to 1.7:1. | style |
| A5 | Hairline vs surface ≥ 3:1 in **both** themes, checked in dark specifically. `#7c7f93` is 3.20:1 light and `#767d92` is 3.31:1 dark. | core |
| A6 | Accent vs surface ≥ 3:1, and ≥ 4.5:1 wherever it is used as text. Accent ink vs accent fill ≥ 4.5:1. | core |
| A7 | No text token below 4.5:1 — including any token chosen "to match the shadows". | style |
| A8 | Where `hairlineOpacity` is below 1.0, the **composited** hairline is what is measured, not the source colour. The floor of 0.55 is a clamp, not a guarantee for an arbitrary hairline over an arbitrary surface. | style |
| A9 | No state, error, selection or category conveyed by colour alone, and none conveyed by shadow direction alone (SC 1.4.1). | core |
| A10 | Surface chroma ≤ 0.03 OKLCH light, ≤ 0.035 dark. Above that, the ±luminance shift drags hue and the pair goes muddy. Accents are exempt. | style |

## B. The same-hue invariant and geometry

| # | Check | Owner |
|---|---|---|
| B1 | Every neumorphic element's background token equals its computed parent's, to within ΔL ≤ 0.02 OKLCH. Warn on every violation with the offending selector. | style |
| B2 | `blur == 2 × distance` on every emitted shadow; the ratio is never outside `[1.5, 3.0]`. | style |
| B3 | `spread == 0` on every emitted shadow, with no exceptions. | style |
| B4 | Pressed rungs are 0.6× their raised counterparts, and inset maps to inset. | style |
| B5 | At most two shadow layers per element — four only on the documented pseudo-element cross-fade. | style |
| B6 | One light source for the whole document. All offsets share one sign pair. | style |
| B7 | Gap between extruded siblings ≥ `2 × distance + blur / 2` (16px at `sm`, 24px at `md`), and no shadow is clipped by an ancestor `overflow: hidden`. | style |
| B8 | `--nm-surface-sunken` appears on wells only, never on a control. A sunken control loses the same-hue illusion. | style |
| B9 | Interactive elements are real `<button>` / `<a>` / `<input>`, not a `<div>` made to look pressable. Forced-colors picks system colours from native semantics. | style |
| B10 | Every icon-only control has an accessible name. | core |

## C. Focus

| # | Check | Owner |
|---|---|---|
| C1 | A `:focus-visible` rule exists on every focusable element, uses `outline` and not `box-shadow`, has an offset, and clears 3:1. | core |
| C2 | No `outline: none` survives anywhere without a replacement outline in the same rule set. | core |
| C3 | The outline is ≥ 3px with `outline-offset` ≥ 3px — this style's floor, above the SC 2.4.13 minimum, because the ring has to clear the blurred halo rather than sit inside it. | style |
| C4 | `:focus-visible`, not `:focus`. A pressed neumorphic button that keeps a ring after a mouse click looks broken and trains people to ignore rings. | style |
| C5 | An `outline-color: Highlight` override exists inside `@media (forced-colors: active)`. | style |
| C6 | No focused control is obscured by a sticky header (SC 2.4.11). Sticky-header shadow blur ≤ 16px and `outline-offset` ≥ 3px. | style |

## D. Targets and layout

| # | Check | Owner |
|---|---|---|
| D1 | Every target ≥ 24×24 CSS px hard floor; warn below 44×44. Measure the border box, not the shadow halo, which is not clickable. | core |
| D2 | Every generated interactive component resolves `min-height` / `min-width` from `--nm-target-min` (44px) and nothing overrides it downward. | style |
| D3 | Warn on `order`, `row-reverse`, `grid-auto-flow: dense` or absolute positioning applied to sequential content (SC 1.3.2). | core |
| D4 | Tab order matches the perceived hierarchy. The visual reading order of a neumorphic dashboard is often driven by shadow depth rather than DOM order. | style |
| D5 | No fixed component heights. `min-height` only, so a text-spacing override cannot clip (SC 1.4.12). | style |
| D6 | Neumorphic wells used for visual grouping carry a real `<fieldset>`/`<legend>` or `role="group"` + `aria-labelledby`. | style |
| D7 | Nothing clips or overflows at 200% and 400% zoom (SC 1.4.4, 1.4.10). | core |

## E. Media queries and motion

| # | Check | Owner |
|---|---|---|
| E1 | A `@media (forced-colors: active)` block exists, uses system colour keywords, and gives every shadow-bounded element a real border. No `forced-color-adjust: none` on a text-bearing element. | core |
| E2 | That block sets `box-shadow: none` **and** zeroes transforms on every generated class — with the shadow gone, the translate is motion with nothing attached to it. It also maps selected to `Highlight`/`HighlightText` and disabled to `GrayText`. | style |
| E3 | A `prefers-reduced-motion: reduce` block exists, zeroes durations, and does not remove any state-carrying property. | core |
| E4 | Under reduce, the pressed shadow and the accent border still apply — instantly. The loading sheen stops and drops to a static opacity. | style |
| E5 | `prefers-reduced-transparency: reduce` is honoured as a proxy for plainer surfaces: single 2px/6px shadow, hairline raised to 4.5:1. | style |
| E6 | No `transition` or `animation` targets `filter`, `border-radius`, the surface colour, or the light-source direction. | style |
| E7 | The low-end fallback block exists — `@media (update: slow)` and the narrow-viewport reduced-transparency pair — and drops to a single soft shadow. | style |

## F. Budgets

| # | Check | Budget | Owner |
|---|---|---|---|
| F1 | Neumorphic elements in the initial viewport | ≤ 12 warn, > 24 fail | style |
| F2 | Shadow layers per element | 2, or 4 on the cross-fade | style |
| F3 | Max blur radius | 40px | style |
| F4 | Blur inside any element with `overflow: auto \| scroll` | ≤ 24px | style |
| F5 | Blur on list or grid items | ≤ 16px | style |
| F6 | Elements animating a shadow simultaneously | ≤ 4 | style |
| F7 | Paint time per frame on a 4× CPU-throttled profile | ≤ 4ms | style |
| F8 | Long animation frames attributable to paint during hover or press | none > 50ms | style |
| F9 | Additional asset weight | 0 bytes — no images, no fonts, no scripts | style |
| F10 | CSS delta for the token layer plus components | ≈ 3–5 KB before gzip | style |
| F11 | `will-change` | on the element being interacted with only, never blanket-applied | style |

## G. Dark mode

| # | Check | Owner |
|---|---|---|
| G1 | Dark values are declared in **both** places: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]`. A partial override is what leaves half the palette on the light theme's values. | style |
| G2 | The dark-mode luminance delta is at least 2× the light-mode delta. This is asserted against the **multiplicative** derivation — doc §5 ships `scale = 3.0` for dark against `1.0` for light — and not against the additive `--nm-delta` knob, whose own §13 ceilings are 0.14 and 0.20. | style |
| G3 | The `0.8 / 1.4` highlight/shadow asymmetry is inverted to `1.4 / 0.8` in dark mode. | style |
| G4 | The dark base has headroom in both directions: not near-black, not near-white. §13 step 2 rejects a base with L > 0.96 or L < 0.06. | style |
| G5 | Both gradients (`--nm-convex`, `--nm-concave`) are restated in dark, not inherited. | style |

## H. Notes the report must carry regardless of pass or fail

- The shadow-vs-surface ratios, labelled decorative, so the Contrast table cannot be
  misread as saying the extrusion complies.
- A tab-order note for every layout using `position: absolute` or `order`.
- Every intensity clamp and context cap that fired, with requested and applied values,
  including the ones that changed nothing.
- Every anti-pattern requested and refused, with the alternative offered.
- Anything that could not be verified statically. These go in Manual TODOs, not in the
  pass column: real Windows High Contrast behaviour, a low-vision or cataract simulator
  pass, a greyscale plus contrast-reduced screenshot with every control still findable,
  computed target size after any transform, and measured paint cost on a throttled
  profile.
