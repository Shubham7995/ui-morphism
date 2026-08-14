# Claymorphism audit checklist

Two lists merged: the self-run validation checklist from `docs/04-claymorphism.md` §13
and the pass/fail checklist from §7, extended with §8's budgets. Run in this order.

Each row is tagged with who runs it:

- **[core]** — `ui-morphism-core:a11y-validate`. Same logic for all ten styles. One
  implementation, ten callers: never reimplement any of these here, and in particular
  never write a second contrast function.
- **[scan]** — `../../apply/scripts/clay-scan.mjs`. Mechanical, static,
  style-specific. It computes no ratio and no luminance.
- **[read]** — a human or model judgement over the source. Not automatable.
- **[eye]** — requires a rendered browser. Report as a Manual TODO with the exact
  procedure, never as a pass.

Record each row as pass / fail / not-applicable with the exact failing selector and,
for contrast rows, the computed ratio to three decimal places, unrounded.

---

## A. The §13 self-run checklist

| # | Check | Who | Threshold |
|---|---|---|---|
| A1 | Every generated foreground/background pair measured | [core] | ≥ 4.5:1 body, ≥ 3:1 at ≥ 24px or ≥ 19px bold; unrounded, so 4.497:1 fails 4.5 |
| A2 | Surface-to-adjacent-background contrast for every interactive element; below the floor, a 1px inset ring is injected and recorded | [core] ratio, [read] remedy | ≥ 3:1 (SC 1.4.11) |
| A3 | Shadow layers per selector | [scan] | ≤ 4 — rim, sheen, shade, drop |
| A4 | Blur radius per layer, and on any selector matching a list or grid item | [scan] | ≤ 68px (`--clay-blur-max`) anywhere; ≤ 48px on anything that repeats |
| A5 | A `@media (forced-colors: active)` rule exists for every generated component **and sets a visible border** | [scan] presence, [core] keywords | `border: var(--clay-border-hc)` on every generated class |
| A6 | A `@media (prefers-reduced-motion: reduce)` rule exists, and each state still produces a non-animated visual delta | [scan] presence, [read] delta | present, and the depth swap survives |
| A7 | `:focus-visible` present on every interactive component, clearing both the control and the page | [core] | ≥ 3px, offset ≥ 2px per §13; the shipped token is 3px at 3px offset per §4 and §7 |
| A8 | Every generated interactive component meets `--clay-target-min` | [core] | 48×48; **fail** below the 24×24 SC 2.5.8 floor, **warn** between the floor and the token |
| A9 | Dark-mode sheen and shade alphas — the chalky-grey guard | [scan] | dark sheen ≤ 0.20, dark shade ≥ 0.45 |
| A10 | No `transition` or `@keyframes` property list contains `box-shadow` on a selector that also matches a scrollable list item | [scan] | zero |
| A11 | Every depth-encoded state has a paired ARIA attribute | [read] | `aria-pressed` / `aria-selected` / `aria-current` / `aria-checked` / `aria-busy` |

## B. The §7 pass/fail checklist

| # | Check | Who | Note |
|---|---|---|---|
| B1 | Every text/background pair on a clay surface clears the floor. **Fail if any pastel carries white body text.** | [core] | `#FFFFFF` on `#FFB3A7` is 1.71:1 — the style's signature failure |
| B2 | Every clay control's **edge** measures ≥ 3:1 against its immediate background, via lightness delta or an explicit ring. **Fail if the only boundary is a blurred shadow.** | [core] | Test the element edge, not the text. `#C7B9FF` against `#F4F1FB` is 1.59:1 |
| B3 | `:focus-visible` produces a visible ring ≥ 3px at ≥ 3:1 against both the control and the page, not clipped by any ancestor | [core] ratio, [read] clipping | `overflow: hidden` on a rounded card is the usual clipper |
| B4 | All interactive targets ≥ 24×24 CSS px, ideally 48×48 | [core] | Measured **while pressed**, so the squish `scale()` is included |
| B5 | Non-interactive surfaces do not use the full clay stack. **Fail if static cards look identical to buttons.** | [scan] candidates, [read] verdict | SC 1.4.1 |
| B6 | A `forced-colors: active` block exists for every clay component and renders a visible border. **Fail if the component disappears with Windows High Contrast on.** | [scan] + [eye] | The UA forces `box-shadow: none`, and clay's whole structure is the shadow |
| B7 | `prefers-reduced-motion: reduce` disables the spring and lift but preserves a perceivable state change. **Fail if the state becomes invisible.** | [scan] + [read] | Removing the animation must not remove the feedback |
| B8 | Every state communicated by depth is also communicated by an ARIA attribute or text | [core] colour-only, [read] depth-only | Shadows convey nothing to assistive tech |
| B9 | Dark mode re-derives the sheen and shade rather than reusing light-mode alphas | [scan] | Same guard as A9, stated from the design side |
| B10 | At 200% zoom with WCAG 1.4.12 text spacing, no text clips against a rounded corner | [eye] | Reserve `padding ≥ border-radius × 0.75` on any card whose text can wrap |
| B11 | Every interactive control takes its `min-height` / `min-width` from `--clay-target-min` rather than a hard-coded height | [read] | Chips, pills and icon buttons first |

## C. Structure, colour and boundary — this style's own

| # | Check | Who | Note |
|---|---|---|---|
| C1 | **No clay surface's background equals the page background.** | [scan] | The load-bearing invariant. A matching surface is neumorphism, and §7 makes it the 1.4.11 failure |
| C2 | Every drop shadow is hue-matched to its own surface at 28-35% alpha; no neutral `rgba(0,0,0,α)` on a coloured surface | [scan] | `--clay-shadow-h` is set per surface via §5's map |
| C3 | One consistent light source across every element on every screen — sheen on the lit edge, shade opposite | [read] | One inconsistent element breaks the whole illusion |
| C4 | `forced-color-adjust: none` appears nowhere | [scan] | Clay does not opt out of the forced palette; §5 has no such declaration at all |
| C5 | At most two nested clay elevation levels in one subtree | [read] | Three or more turn into mud |
| C6 | Grid gaps ≥ 24px (`--clay-gap`) wherever clay elements are neighbours | [scan] literals, [read] layout | Overlapping drop shadows read as mud |
| C7 | No `inset` inside any `text-shadow` | [scan] | Unsupported by every engine, so the declaration is dropped silently; raised type is two opposing offsets |
| C8 | Rotated clay elements counter-rotate their shadow-bearing pseudo-element | [read] | Otherwise the global light direction breaks |
| C9 | Radii on interactive elements are at or above 16px, or the style has stopped reading as clay | [read] | A fidelity note, not a compliance finding — unless intensity is deliberately at the flat rung |
| C10 | Both dark blocks present and complete: the guarded media query **and** `:root[data-theme="dark"]`, with identical value lists | [scan] presence, [read] completeness | A partial override is what leaves light-mode ink on a dark surface |

## D. Motion and media queries

| # | Check | Who | Note |
|---|---|---|---|
| D1 | The press inverts the light — dark inset on top, bright below — rather than only shrinking the element | [read] | Shrinking alone is not clay |
| D2 | Press cycle under 400ms total: 90ms down, 260ms spring back | [read] | Longer reads as laggy rather than soft |
| D3 | Overshoot easing appears on release only, never on press-in | [read] | `--clay-ease-squish` on the resting transition, `--clay-ease-out` on `:active` |
| D4 | `border-radius` appears in no `transition` or `@keyframes` | [scan] | Forces a re-layout of the clip path |
| D5 | `will-change: box-shadow` appears nowhere | [scan] | §8 names it a trap: a layer that does not make the blur cheaper |
| D6 | `will-change: transform` is scoped to the element being interacted with and removed afterwards | [read] | Never on a repeated list-item base class |
| D7 | A `prefers-reduced-data: reduce` block and a `(max-width: 480px)` branch both exist, halving blurs and dropping the rim | [scan] | §8's cheaper-fallbacks block |
| D8 | `prefers-reduced-transparency: reduce` softens the sheen, and removes `backdrop-filter` if the design was hybridised with glass | [scan] | Near no-op for pure clay, which is the point |
| D9 | Haptics on native are paired with a visible squish, never the only feedback, and gated behind `#available(iOS 17.0, macOS 14.0, *)` | [read] | `.sensoryFeedback` is iOS 17 / macOS 14 |

## E. Budgets (§8)

| # | Budget | Limit | Who |
|---|---|---|---|
| E1 | Shadow layers per element | ≤ 4 | [scan] |
| E2 | Clay elements per viewport | ≤ 40 | [scan] count, [read] per-route composition |
| E3 | Blur radius on any layer | ≤ 68px | [scan] |
| E4 | Blur radius on anything that repeats | ≤ 48px | [scan] |
| E5 | Clay illustration weight, AVIF/WebP | ≤ 150KB each | [read] |
| E6 | Spline / WebGL scene above the fold on mobile | 0 | [scan] candidates, [read] position |
| E7 | CSS asset weight for the style itself | near zero — a few hundred bytes of custom properties | [read] |
| E8 | Rendering + Painting share of main-thread time during a scroll trace | ≤ 25% | [eye] |
| E9 | Frame rate on a 4× CPU-throttled profile | ≥ 55fps | [eye] |
| E10 | Layout shift attributable to shadows | 0 — shadows never affect layout, so any CLS is coming from the images | [eye] |

## F. Things that are refusals, not findings

If the audit turns these up, the recommendation is to remove or rescope the clay, not
to tune it. Full list with alternatives in `../../apply/references/anti-patterns.md`.

- A clay surface the same colour as the page ground — that is neumorphism
- White or light-grey text on any pastel fill
- Clay applied wholesale to data tables, financial statements, medical records or
  admin dashboards; §9 and §13 both rule this out, and the answer is accent-only
  scoping
- Clay and neumorphism mixed in one interface — §12 calls it the worst combination in
  the doc set
- A translucent clay surface, or a displacement filter on one; the insets need an
  opaque body to shade
- Any state, selection or severity encoded in depth alone

## G. Notes the report must carry regardless of pass or fail

- The list of every intensity clamp and context cap that fired, with requested and
  applied values — including the ones that changed nothing.
- The list of every anti-pattern requested and refused, with the alternative offered.
- Which surfaces received the full stack and which received the reduced
  `--clay-drop-1` treatment, so the affordance split is auditable rather than asserted.
- Anything that could not be verified statically. These go in Manual TODOs, not in the
  pass column:
  - real Windows High Contrast behaviour, in an actual Windows session;
  - computed target size **after** the press transform;
  - text clipping at 200% zoom with WCAG 1.4.12 text spacing;
  - the scroll trace and the frame rate on a throttled profile;
  - the real byte weight of any clay illustration or Spline scene, and where it sits
    relative to the fold on a mobile breakpoint.
