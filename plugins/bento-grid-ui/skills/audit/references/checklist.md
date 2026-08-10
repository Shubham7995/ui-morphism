# Bento grid audit checklist

Source of truth: `docs/09-bento-grid.md` §13 "Self-run validation checklist", extended with §7's
pass/fail list and §8's budgets. Run in this order.

Each item is tagged with who runs it:

- **[core]** — `ui-morphism-core:a11y-validate`. One implementation, ten callers. Never
  reimplement any of these, and in particular never write a contrast function here.
- **[plan]** — `../../apply/scripts/assign-spans.mjs`. Composition arithmetic, decidable from the
  tile inventory alone.
- **[read]** — a human or model judgement over the source. Not automatable.
- **[eye]** — requires a rendered browser. Report as a manual TODO with the exact procedure,
  never as a pass.

---

## A. The §13 self-run checklist

| # | Check | Who | Threshold |
|---|---|---|---|
| A1 | WCAG contrast computed for every text/background pair actually produced | [core] | ≥ 4.5:1 body text, ≥ 3:1 for any border that signals interactivity; unrounded, so 2.999:1 fails |
| A2 | Exactly one `hero`-span tile per grid | [plan] | 1 (0 in the uniform and mild intensity bands, by design) |
| A3 | At most five distinct span values | [plan] | ≤ 5 |
| A4 | Zero focusable elements inside any grid setting `grid-auto-flow: dense` without `reading-flow` | [read] | zero. `reading-flow` is Chromium 137+ and not Baseline, so a guard is enhancement, not coverage |
| A5 | Every tile contains 0 or 1 links, and exactly one heading at the correct level | [plan] links, [read] heading level | 0–1 links, one `<h3>` under the section `<h2>` |
| A6 | Every `<img>` and `<video>` has intrinsic dimensions or `aspect-ratio` | [read] | 100% |
| A7 | `sizes` present on every responsive image | [read] | 100%. `(max-width: 767px) 100vw, 50vw` is the default pair |
| A8 | At most one autoplaying video in the section, and it has a `poster` | [read] | ≤ 1, poster required |
| A9 | `@media (prefers-reduced-motion: reduce)` block exists and neutralises transform, animation and video | [read] | present, all three |
| A10 | `@media (forced-colors: active)` block sets a `CanvasText` border on tiles | [read] + [core] | present; also hides the scrim and uses `Highlight` for focus |
| A11 | `grid-auto-rows` uses `minmax(x, auto)`, not a bare fixed value | [plan] on emitted plans, [read] on shipped CSS | growable |
| A12 | Single-column collapse below 768px, no horizontal overflow at 320px | [plan] template, [eye] verification | one column |
| A13 | No `backdrop-filter` on more than one element in the section | [read] | ≤ 1 |
| A14 | No transition or animation targets `width`, `height`, `gap`, `grid-template-*` or `border-radius` | [read] | zero |
| A15 | Total image bytes reported | [read] | warn > 600KB, fail > 1.2MB |

## B. The §7 accessibility list

| # | Check | Who | Note |
|---|---|---|---|
| B1 | Tab through the section: focus moves left-to-right, top-to-bottom, matching what is seen. No jumps | [eye] | The headline finding of a bento audit (SC 2.4.3) |
| B2 | DOM order is the intended reading order (SC 1.3.2) | [read] | The CSS Grid spec calls placement-based logical reordering non-conforming. Look for `dense`, `order`, negative `grid-row-start`, absolute positioning |
| B3 | Body and muted text ≥ 4.5:1 on both tile backgrounds | [core] | `#6e6e73` on `#f5f5f7` is 4.658:1 — passing with no headroom. Any palette change re-opens this |
| B4 | Any border that signals interactivity ≥ 3:1 against the tile (1.4.11) | [core] | The `rgba(0,0,0,0.06)` hairline is 1.14:1 and is decorative only. `0.18` measures 1.52:1 and does not clear it; the crossings are 0.4199 light and 0.3294 dark |
| B5 | Focus ring fully visible, not clipped by `overflow: hidden`; 3px, ≥ 3:1, `outline-offset: 2px` | [core] ratio, [eye] clipping | Put the outline on the tile, not the inner link, or drop `overflow: hidden` on interactive tiles and clip the media instead |
| B6 | Every tile has `scroll-margin-top` ≥ sticky header height + 8px (SC 2.4.11) | [read] | Not derivable from the grid's CSS — ask for the header height |
| B7 | Text over imagery sits above a scrim of at least `rgba(0,0,0,0.55)` | [core] | 4.76:1 white-on-white worst case; `0.72` gives 9.23:1 and is what headlines use. Verify against the *lightest* region of the image |
| B8 | Every interactive element inside a tile ≥ 24×24 CSS px (SC 2.5.8) | [core] | The tile is never the constraint; the chips inside it are |
| B9 | Chips, pills and icon buttons take `min-height` / `min-width` from `--bento-target-min` | [read] | 24px with a mouse, 44px under `@media (pointer: coarse)` |
| B10 | At 320px width: one column, no horizontal scroll, no clipped text (SC 1.4.10) | [eye] | A four-column grid left unchanged at mobile produces 70px tiles and overflow |
| B11 | At 200% text zoom: `grid-auto-rows` is growable and no tile clips its content (SC 1.4.4) | [eye] | Fixed 180px rows plus `overflow: hidden` is the failure |
| B12 | Heading levels sequential: section `<h2>`, tiles `<h3>`. No tile uses `<h2>` | [read] | |
| B13 | Decorative images have `alt=""`; informative screenshots have descriptive alt or a caption | [read] | |
| B14 | `prefers-reduced-motion: reduce` disables reveal, hover lift and media scale, and swaps tile video for a poster | [read] | Autoplaying tile loops are this pattern's biggest reduced-motion hazard; WCAG 2.2.2 applies past five seconds |
| B15 | `forced-colors: active` keeps every tile boundary visible via `CanvasText` | [read] + [core] | Forced colors strips `background-color` and `box-shadow`, so without the border the compartments dissolve |
| B16 | The scrim is hidden under `forced-colors: active` | [read] | The image beneath it is not forced-color-adjusted, so the scrim survives as a dark smear over adjusted text |
| B17 | Semantics: `<section aria-labelledby>` → `<h2>` → `<ul role="list">` → `<li>`. No `role="grid"` | [read] | `role="grid"` imposes a two-dimensional keyboard model nobody expects here |
| B18 | One link per tile, implemented as a single `<a>` with an `::after` full-tile overlay | [read] | Wrapping the card in an `<a>` gives the link the whole tile's text as its accessible name; two links plus an overlay makes the second unclickable |
| B19 | No state, category or emphasis carried by tile size, colour or shadow alone | [core] | Size is hierarchy, not information |
| B20 | Screen reader announces the section heading, then a list of N items, then each tile's heading and body once | [eye] | |

## C. Composition (§3, §4, §9, §10)

| # | Check | Who | Threshold |
|---|---|---|---|
| C1 | Exactly one dominant tile, at 30–40% of the section area | [plan] | §3. Users fixate roughly 2.6× longer on the largest tile regardless of position, so it must carry the primary claim |
| C2 | The gutter is one value across the whole section | [read] | 16px desktop, 12px below 768px, 24px editorial. Varying it per tile turns bento into collage |
| C3 | One radius across every tile; nested media at `outer − padding` | [read] | Mixing 8/16/24px radii in one grid reads as a bug |
| C4 | One border and one shadow treatment across every tile, interactive state excepted | [read] | |
| C5 | Padding scales with span: 20 / 24 / 32px for unit / wide-tall-strip / hero | [read] | A hero with small-tile padding looks empty |
| C6 | One idea per cell: a heading ≤ 8 words plus one of a number, screenshot, icon, chart or short paragraph | [read] | Two ideas in one cell is the most common way bento fails |
| C7 | The grid is not uniform | [plan] | Every tile the same span is a card grid; say so and offer the simpler layout |
| C8 | Tile count 4–9, or a declared hierarchy break | [plan] | Below 4 is a card row; above 9 is wallpaper |
| C9 | The content is parallel and non-sequential | [read] | §9: sequential, long-form and strictly comparable content are refusals, not caps |
| C10 | Empty cells are intentional | [plan] | The planner reports holes rather than closing them, because closing one means reordering |
| C11 | An empty tile keeps its span and shows a one-line reason | [read] | Removing it reflows the composition |

## D. Performance budgets (§8)

| # | Budget | Who | Limit |
|---|---|---|---|
| D1 | Total transferred bytes for the section | [read] | ≤ 600KB warn, > 1.2MB fail |
| D2 | Largest tile image | [read] | ≤ 200KB AVIF at 2× for a 720×420 slot |
| D3 | Autoplaying video | [read] | ≤ 1 per section, ≤ 2MB, `muted playsinline preload="metadata"` with a poster, paused off-screen |
| D4 | `sizes` on every tile image | [read] | 100%. Skipping it is the single most common bento performance bug |
| D5 | CLS contribution | [eye] | ≤ 0.02, achieved by intrinsic sizing on all media plus growable rows |
| D6 | `backdrop-filter` elements in the section | [read] | ≤ 1. Per-tile blur means one backdrop snapshot per tile per frame |
| D7 | Per-tile canvas or WebGL contexts | [read] | ≤ 1 shared context behind the grid |
| D8 | Reveal main-thread work | [eye] | ≤ 4ms/frame on a mid-tier Android; transform and opacity only |
| D9 | Promoted compositor layers | [read] | `will-change` set immediately before an animation and removed on `animationend`. 12 tiles at 1280×720 is ≈ 3.7MB of layer memory |
| D10 | Style recalc on hover scoped to one tile | [eye] | A `:has()` selector on a shared ancestor invalidates the whole grid — move it down |
| D11 | Below-the-fold grids use `content-visibility: auto` with a matching `contain-intrinsic-size` | [read] | The intrinsic size must equal the row unit or the scrollbar jitters |

## E. What this checklist deliberately does not check

- **Contrast maths.** [core] owns it. There is one implementation for all ten style plugins and
  a second one here would be a correctness bug waiting to disagree with it.
- **Focus, target size, forced-colors keywords, reduced motion, reduced transparency,
  colour-only encoding and DOM-order warnings** as *universal* rules. Also [core]. The rows above
  that mention them are the style-specific instances — where the ring sits relative to
  `overflow: hidden`, which element the border belongs to, what the scrim does under forced
  colors — not re-implementations.
- **Whether bento is the right pattern at all.** That is §9, it is a conversation with the user,
  and it belongs in the report's Summary rather than as a checklist row.
