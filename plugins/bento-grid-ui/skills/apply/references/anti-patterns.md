# Bento grid anti-patterns — the refusal list

Source: `docs/09-bento-grid.md` §13 ("Anti-patterns the skill must refuse to generate"), with
the supporting numbers from §7, §8, §9 and §10.

`ui-morphism-core` owns the refusal *mechanism*: refuse, explain why, offer the alternative,
record it in the audit's Refusals section. This file owns the list and, for each entry, the
detection signal and the alternative to offer. A refusal is not a lecture — state the failure,
name the number, emit the alternative, move on.

The twelve entries below are §13's, in §13's order.

---

## 1. `grid-auto-flow: dense` on a grid containing a link, button or form control

**Why.** Dense packing pulls later items into earlier holes, so visual order stops matching DOM
order. Tab order follows DOM, so focus jumps around the composition (SC 2.4.3), and the
accessibility tree reads in an order nobody sees (SC 1.3.2). The CSS Grid spec is explicit:
using `order` and grid placement for *logical* reordering is non-conforming. This is a
conformance failure, not a preference.

**Detect.** `grid-auto-flow: dense` or Tailwind `grid-flow-dense` in a rule whose subtree
contains `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>` or `tabindex="0"`.

**Offer.** Explicit placement with `grid-template-areas` — deterministic, no auto-flow
surprises, and it is what `scripts/assign-spans.mjs` emits. If the user insists on dense's tight
packing, the only acceptable form is dense inside `@supports (reading-flow: grid-rows)` with
`reading-flow: grid-rows`, layered on a DOM order that is already correct: `reading-flow` is
Chromium 137+ (stable 27 May 2025) and is **not Baseline** — no Safari or Firefox as of August
2026 — so every other browser gets the unguarded hazard.

## 2. `backdrop-filter` on more than one element inside the section

**Why.** Each backdrop-filtered element costs its own backdrop snapshot per frame. Nine glass
tiles is nine snapshots and it will tank a mid-tier phone.

**Detect.** More than one rule declaring `backdrop-filter` / `-webkit-backdrop-filter`, or more
than one `backdrop-blur-*` utility, within the section subtree.

**Offer.** Apply the glass to the **grid container** as a single surface with opaque internal
dividers, and keep the tiles opaque. If the user wants frosted tiles specifically, hand off to
`glassmorphism-ui:apply` for the ground and the fallback ladder, and keep the blur count at one.

## 3. More than one autoplaying video per section, or any autoplaying video without a `poster`

**Why.** Tile videos run 1–6MB each; the budget is one per section at ≤ 2MB. Without a poster
the tile is blank until the first frame decodes, which is both a CLS and a perceived-performance
problem. Anything that plays automatically for more than five seconds also engages WCAG 2.2.2.

**Detect.** More than one `<video autoplay>` in the section, or any `<video autoplay>` without a
`poster` attribute.

**Offer.** One autoplaying loop, `muted playsinline preload="metadata"` with a `poster`, paused
off-screen; every other tile gets its poster frame as a static image. Under
`prefers-reduced-motion: reduce` the video is replaced by the poster, with a visible play
control if the content is informative.

## 4. Text over a photograph with no scrim, or a scrim weaker than `rgba(0,0,0,0.55)`

**Why.** `#ffffff` over `rgba(0,0,0,0.55)` composited on pure white imagery measures **4.76:1**
— the minimum viable scrim. `rgba(0,0,0,0.72)` gives **9.23:1** and is what headlines use. The
white-image assumption is the only safe one with user- or CMS-supplied photography.

**Detect.** A text node inside a tile that also carries a cover image, with no scrim element or
gradient layer between them; or a scrim whose darkest stop is below 0.55 alpha.

**Offer.** `--bento-scrim` — `linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 45%,
rgba(0,0,0,0) 70%)` — behind the text, and `ui-morphism-core:a11y-validate` re-checks the pair
against the worst-case backdrop. If the imagery is uncontrolled and the text must be small,
move the text out of the image tile.

## 5. A card nested entirely inside a single `<a>`, or two links sharing one tile with a full-tile overlay

**Why.** Wrapping the card produces a link whose accessible name is the tile's entire text
content — an unusable announcement. Two links plus a full-tile `::after` overlay makes the
second link unreachable by pointer while still being reachable by keyboard, which is worse than
either alone.

**Detect.** An `<a>` that is the tile's only child and contains the heading, body and media; or
more than one `<a>` / `<button>` in a tile whose rule includes an `::after { position: absolute;
inset: 0 }`.

**Offer.** One `<a>` on the heading, with `::after { content: ""; position: absolute; inset: 0 }`
for the full-tile hit area. If the tile genuinely needs two destinations, drop the overlay and
make both links ordinary inline links with ≥ 24×24px targets.

## 6. `role="grid"` on a marketing bento section

**Why.** `role="grid"` is for interactive tabular widgets. It imposes a two-dimensional keyboard
model — arrow-key cell navigation — that nobody expects on a feature section, and it replaces
the list semantics that actually describe the content.

**Detect.** `role="grid"`, `role="row"`, `role="gridcell"` on the section, the `<ul>` or the
tiles.

**Offer.** `<section aria-labelledby>` → `<h2>` → `<ul role="list">` → `<li>` tiles, one `<h3>`
per tile. Keep `role="list"` explicitly: Safari drops list semantics from a `list-style: none`
list.

## 7. Transitions or keyframes on `width`, `height`, `gap`, `grid-template-columns`, `grid-template-rows` or `border-radius`

**Why.** Every one of them forces layout on every frame across the entire grid, not just the
animating tile.

**Detect.** Any `transition` or `@keyframes` naming those properties, or `transition: all` on a
tile or the grid.

**Offer.** `opacity` and `transform` only. If the grid geometry itself has to move — a
rearranging dashboard — use the View Transitions API or a FLIP transform.

## 8. Uniform spans presented as a bento

**Why.** Bento is variable spans on an invariant gap. If every tile is the same size you have a
card grid, and calling it a bento adds ceremony without adding hierarchy.

**Detect.** One distinct span value across the grid — `scripts/assign-spans.mjs` reports this as
the `uniform-is-not-bento` check.

**Offer.** Say plainly that this is a card grid and emit the simpler layout: a
`repeat(auto-fit, minmax(280px, 1fr))` grid with the same radius, gap and border treatment. If
the user wants bento, ask which item carries the primary claim — that is the hero, and without
one there is no bento.

## 9. More than nine tiles in a single section without a hierarchy break

**Why.** Size encodes importance only while the eye can hold the whole composition. Past nine
tiles it becomes wallpaper — the Windows 8 Live Tile failure mode, and the reason the doc lists
an eight-equal-tile features section as a counter-reference.

**Detect.** Item count > 9 with no sub-heading or second grid between them.

**Offer.** Split into two grids under separate sub-headings, or promote three or four items and
move the rest into a list. The planner caps intensity at 45 in this case and fails the
`tile-count` check until a hierarchy break is declared.

## 10. Fixed `grid-auto-rows` with `overflow: hidden` on tiles containing text

**Why.** At 200% text zoom the content grows and the tile does not, so the text is clipped by
the `overflow: hidden` that exists for media bleed (SC 1.4.4).

**Detect.** `grid-auto-rows: <length>` without `minmax(..., auto)`, on a grid whose tiles set
`overflow: hidden` and contain text.

**Offer.** `grid-auto-rows: minmax(var(--bento-row), auto)` — the row unit becomes a floor
rather than a ceiling. On mobile drop to `auto` entirely so tiles are content-height.

## 11. Removing a tile when its data is empty

**Why.** A missing tile leaves a hole in a hand-tuned composition and reflows everything after
it, which is both a layout shift and a loss of the grid's meaning.

**Detect.** Conditional rendering that returns `null` for a tile, or a filter over the item list
before the spans are assigned.

**Offer.** An explicit empty state that preserves the span: the tile stays, keeps its
`grid-column` / `grid-row`, and carries a one-line reason in `--bento-fg-muted`. That is the
`.bento__tile--empty` rule in the emitted layer.

## 12. Multiple radii, multiple gap values, or multiple border treatments in one grid

**Why.** The uniform frame is what makes heterogeneous tile content legible as a system. Vary
the gap and you have a collage; vary the radius and you have a bug. §10's Do/Don't table names
mixing 8px, 16px and 24px radii across tiles in one grid explicitly.

**Detect.** More than one `border-radius` value, more than one `gap` value at a single
breakpoint, or a mix of bordered and borderless tiles within the section.

**Offer.** Normalise to `--bento-radius`, `--bento-gap` and `--bento-border` across every tile,
with nested media at the concentric `inner = outer − padding`. The only permitted per-tile
variation is padding, which scales with span, and the interactive border, which is a state.

---

## Not on §13's list, but refuse anyway: the wrong content shape

§9 says when the pattern does not apply, and applying it anyway is a worse outcome than any
styling error. These are refusals with an alternative, not caps.

| Request | Why bento fails | Offer instead |
|---|---|---|
| Sequential content — onboarding, checkout, a tutorial, a changelog | Bento invites the eye to enter at the largest tile, which actively fights sequence | An ordered list, a stepper, or a table |
| Long-form content — docs, articles, legal text, case studies | Compartments force brevity; a truncated argument is not an argument | A prose layout with a sidebar |
| Strictly comparable items — pricing tiers, plan features, product variants | Comparison demands equal visual weight; a larger tile reads as "recommended" whether you meant it or not | A comparison table or an equal-weight card row. The planner caps intensity to 0 for `contentShape: comparable`, which emits exactly that |
| Three items | A three-tile bento is a card row wearing a costume | A three-across card row |
| A CMS-driven list of variable length | A bento composition is hand-tuned; 4 items one day and 11 the next breaks it | A uniform responsive card grid, or an explicit per-count layout map. The planner caps `tileSource: cms` at 25 |

## The performance refusals

From §8's budgets. These fail the run rather than warning it:

- Total section image bytes above **1.2MB** (warn above **600KB**).
- Any single tile image above **200KB** at 2× for a 720×420 slot.
- A responsive tile image with no `sizes` attribute — on mobile every tile is full-width, so
  without it the browser fetches the desktop 2× asset for a 390px phone. This is the single most
  common bento performance bug.
- Any `<img>` or `<video>` with neither intrinsic `width`/`height` nor `aspect-ratio`: unsized
  media in a tile contributes 0.1–0.3 CLS against a budget of 0.02.
