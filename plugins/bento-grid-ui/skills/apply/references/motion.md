# Bento grid motion

Source: `docs/09-bento-grid.md` §6 (Interaction & Motion), with the durations and easings from
§4 and the budget from §8.

Bento tiles are large targets, so the interaction problem is not discoverability, it is
restraint. **A grid of eight tiles that all animate on hover reads as a slot machine.** Motion
belongs to the tiles that are genuinely interactive, and to the section's one entrance.

## State table

| State | Treatment | Values |
|---|---|---|
| Rest | hairline border, near-zero shadow | `border: 1px solid rgba(0,0,0,0.06)`, `box-shadow: 0 1px 2px rgba(0,0,0,0.04)` |
| Hover (interactive tiles only) | lift + shadow bloom, no scale | `translateY(-2px)`, `0 8px 24px rgba(0,0,0,0.08)`, `180ms cubic-bezier(0.2,0,0,1)` |
| Hover (media inside a tile) | image scales, tile stays put | `img { scale: 1.03 }`, `400ms cubic-bezier(0.2,0,0,1)`, tile has `overflow: hidden` |
| Active / press | settle to baseline, fast | `translateY(0)`, `90ms`; optional `scale(0.995)` on the tile only when the whole tile is the button |
| Focus-visible | 3px ring, 2px offset, outside the radius | `outline: 3px solid #0071e3; outline-offset: 2px` light, `#0a84ff` dark |
| Disabled | desaturate and dim, keep the border | `filter: grayscale(1); opacity: 0.55; cursor: not-allowed`, hover transition removed |
| Loading | skeleton tile at the exact final span | the tile keeps its `grid-column` / `grid-row`; inner blocks get a 1200ms linear shimmer, or better, a static `--bento-tile-bg` at 60% with no animation |
| Empty | keep the tile, show a one-line reason | never collapse it — a missing tile breaks the composition and shifts layout |

Never scale the tile itself on hover. Scaling a tile breaks the locked gutter, which is the one
thing that makes the asymmetry read as composed.

## Reveal on scroll

The one motion that genuinely improves a bento section: tiles fade and rise as the section
enters the viewport.

```css
@media (prefers-reduced-motion: no-preference) {
  .bento__tile[data-bento-reveal] {
    animation: bento-in var(--bento-dur-reveal) var(--bento-ease) both;
    animation-timeline: view();
    animation-range: entry 0% cover 22%;
  }
}
@keyframes bento-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
```

With an IntersectionObserver instead, stagger by `40ms` per tile **in DOM order** and cap the
whole sequence at **400ms**. A nine-tile grid staggered at 120ms takes 1.08s and users scroll
past the last tile before it exists.

## The 400ms budget, and what the motion knob does with it

The cap is `--bento-dur-reveal` + `--bento-stagger × n`, so what it constrains is how many tiles
you may stagger, not any single declaration. Past roughly two tiles of stagger you drop the
stagger, not the duration. `scripts/assign-spans.mjs` resolves the knob into this ladder and
asserts the total:

| `motion` | reveal | stagger | staggered tiles | lift | media scale | parallax |
|---|---|---|---|---|---|---|
| 0 | none | — | 0 | 0 | 1 | no |
| 1–50 | 320ms | 40ms | 2 | −2px | 1 | no |
| 51–75 | 320ms | 40ms | 2 | −2px | 1.03 | no |
| 76–100 | 400ms | — | 0 | −4px | 1.03 | yes |

At 400ms of reveal there is no stagger budget left, so the tiles arrive together. That is the
budget doing its job, not a missing feature.

## What may and may not animate

**May animate:** `opacity`, `transform: translate`, `transform: scale` on nested media,
`box-shadow`, `background-color`.

**Never animate:** `grid-template-columns`, `grid-template-rows`, `grid-row`, `grid-column`,
`width`, `height`, `gap`, `border-radius` across breakpoints. Every one of them forces layout on
every frame across the entire grid. If the grid geometry itself must move — a rearranging
dashboard — use the View Transitions API or a FLIP transform, never the grid properties.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .bento__tile {
    animation: none;
    transition: none;
    transform: none;
    opacity: 1;
  }
  .bento__tile img { scale: 1; }
  .bento__tile video { display: none; }   /* pair with a poster <img> */
}
```

`opacity: 1` in that block is load-bearing: a reveal animation with `both` fill leaves the tile
at `opacity: 0` if the animation is merely cancelled.

The `motion` knob is **hard-clamped to 0** under `prefers-reduced-motion: reduce`, independent
of intensity. Emitting the block is not optional and it is not a downgrade — it is the same
composition without the entrance.

**Autoplaying loops inside tiles are the biggest reduced-motion hazard in this pattern.** Under
reduce, swap every tile video for its poster frame. If the video is informative rather than
decorative, give it a visible play control: WCAG 2.2.2 applies to anything that plays
automatically for more than five seconds.

## Performance notes that constrain motion

- Tiles are ordinary painted boxes. They get a compositor layer only when you animate
  `transform` / `opacity` or set `will-change`. A 12-tile grid at 1280×720 promoted permanently
  costs roughly **3.7MB** of layer memory — fine on desktop, noticeable on a 2GB Android device.
  Set `will-change: transform` immediately before an animation and remove it on `animationend`.
- Main-thread work for the reveal: **≤ 4ms/frame** on a mid-tier Android. Transform and opacity
  only keeps you there.
- Style recalc on hover must be scoped to one tile. If hovering a tile invalidates the whole
  grid, there is a `:has()` selector on a shared ancestor — move it down onto the tile.
