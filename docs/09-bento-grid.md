---
name: bento-grid
title: Bento Grid
aliases: [bento box layout, bento UI, bento layout, modular card grid, asymmetric tile grid, Apple bento, bento section, feature bento]
category: ui-morphism
origin_year: 2022
peak_years: 2023-2025
status_2026: mainstream
difficulty: low
a11y_risk: medium
perf_cost: low
plugin_slug: bento-grid-ui
last_researched: 2026-08-08
---

## 1. Essence

A bento grid is a single shared grid whose cells deliberately differ in size: one or two hero tiles carrying the headline claim, surrounded by smaller tiles each holding exactly one fact, metric, screenshot or icon. Every tile shares the same corner radius, the same gap and the same surface treatment, so the asymmetry reads as composed rather than accidental. The feeling is *premium density* — the page tells you eight things at once and still looks calm, because size encodes importance and the uniform gutter does the visual housekeeping.

The single defining move is **size-as-hierarchy inside a locked gutter**. Not the rounded corners, not the cards. If every tile is the same size you have a card grid; if the gaps vary you have a collage. Bento is variable spans, invariant gap.

## 2. Origin & Timeline

- **Pre-digital — the bento box.** The Japanese *bentō* (弁当) is a single container subdivided into compartments of unequal size holding different foods. The layout metaphor is borrowed wholesale, including the implication that each compartment is a complete, self-contained item.
- **1920s-1960s — Swiss/International Typographic Style.** Modular grids with variable-span blocks (Josef Müller-Brockmann, *Grid Systems in Graphic Design*, 1981) are the direct typographic ancestor. Bento is a modular grid with a large radius and a marketing budget. See [./05-minimalism.md](./05-minimalism.md).
- **2010-2012 — Windows 8 / Metro Live Tiles.** Microsoft ships a Start screen of variable-span tiles (small/medium/wide/large) on a fixed gutter. Structurally this is bento; visually it is square-cornered and flat. It is the most under-credited precursor and it also demonstrates the failure mode — tiles with no content hierarchy become wallpaper.
- **2020-2021 — Apple silicon slides.** Apple's M1 (November 2020) and M1 Pro/Max (October 2021) event decks lean on compartmented spec slides. Sources disagree on whether these count as true bento; the compartmentalisation is there, the uniform radius/gutter discipline arrives slightly later.
- **2022 — the breakout.** Apple's WWDC 2022 keynote (6 June 2022, M2 announcement) uses dense multi-tile spec slides, and the **iPhone 14 product page (September 2022)** ships bento feature sections on apple.com. This is the moment the pattern moves from slideware to shipped web layout. My prior was that the pattern started at WWDC 2023; multiple 2025-2026 write-ups place the iPhone 14 page in 2022, so I am dating the breakout to 2022 and treating WWDC 2023 as the amplification event, not the origin.
- **2023 — copy-paste year.** WWDC 2023 slides push it further into designer consciousness. **bentogrids.com** launches as a curated gallery (Apple, Linear, Raycast, Notion and others, filterable by light/dark, hundreds of shots). Vercel's 2023 homepage refresh anchors a bento block below the hero. Dribbble fills with bento portfolio templates.
- **2024 — the default.** By mid-2024 the Linear/Vercel interpretation — dark surface, 1px hairline border, real product screenshots instead of icons — becomes the standard SaaS feature section. Tailwind Labs ships official **Bento Grids** marketing blocks in Tailwind Plus UI Blocks (three-column, two-row, and two-row-with-three-column-second-row variants, light and dark). Magic UI ships `BentoGrid`/`BentoCard`; Aceternity UI ships a Bento Grid category.
- **2025 — infrastructure catches up.** **`reading-flow` and `reading-order` ship in Chrome 137, stable 27 May 2025**, giving the first real fix for the dense-packing focus-order problem that had dogged the pattern since 2022. Subgrid and container queries are interoperable across Chrome/Safari/Firefox, so tiles can finally align internal content across a row and restyle themselves by their own width rather than the viewport's.
- **2026 (April) — the fatigue is now on the record.** Creative Boom's "10 trends that creatives are so over in 2026" (Tom May, 21 April 2026) lists bento grids at #9, alongside glassmorphism/liquid glass, gradients, lazy minimalism and template culture. The quoted practitioner line — "Bento boxes… but can't stop using them" — is the accurate summary of the pattern's 2026 position.
- **2026 (August) — where it stands.** **Mainstream, not dominant, and no longer differentiating.** It is the safe default for a feature section on a marketing page and it is still the right answer for dashboards and overview screens. It has stopped being a reason anyone remembers your site. Recent movement is toward *animated/interactive* bento (scroll-reactive tiles, per-tile video, drag-rearrangeable personal dashboards) rather than toward abandoning the layout. It is neither dead nor dormant; it has become plumbing.

## 3. Visual DNA

- **Variable spans on a locked gutter** — cells span 1-2 (sometimes 3) columns and 1-2 rows on a 4-, 6- or 12-column grid, while the gap never changes. Canonical desktop gap: **16px**; large-format/editorial: **24px**; mobile: **12px**.
- **One dominant tile** — a single 2×2 (or 2-col × full-height) hero occupying roughly **30-40% of the section's area**. Eye-tracking work cited in 2026 practitioner guides reports users fixate roughly **2.6× longer** on the largest tile regardless of its position, so the hero must carry the primary claim.
- **Large, uniform corner radius** — **24px** is the modern default (Tailwind `rounded-3xl`); Apple-style pages run **18-28px**. Every tile uses the same value. Nested media inside a tile uses a *concentric* radius: `inner = outer − padding`, so a 24px tile with 12px inset media gets 12px on the media.
- **Low-contrast surface separation** — tiles sit on the page at a delta of only a few luminance points. Light: page `#ffffff`, tile `#f5f5f7`. Dark: page `#000000`, tile `#161617` or `#1d1d1f`. Separation comes from the gap, not from shadow.
- **Hairline border, not elevation** — `1px solid rgba(0,0,0,0.06)` light, `1px solid rgba(255,255,255,0.08)` dark. Shadows, when present, are almost invisible at rest (`0 1px 2px rgba(0,0,0,0.04)`).
- **Padding scales with span** — small 1×1 tiles: **16-20px**; medium 2×1: **20-24px**; hero 2×2: **24-32px**. A hero with small-tile padding looks empty; a small tile with hero padding has no room for content.
- **One idea per cell** — a headline of ≤ 8 words plus one of: a number, a screenshot, an icon, a chart, a short paragraph. Two ideas in one cell is the most common way bento layouts fail.
- **Mixed media per cell, uniform frame** — a static image, an autoplaying muted loop, a live chart and a block of type can all coexist because the frame (radius, gap, padding, surface) is identical. The frame is what makes the heterogeneity legible.
- **Content bleeds to the tile edge** — screenshots and product UI are frequently cropped by the tile with `overflow: hidden`, often anchored bottom-right and allowed to run off. This is the Linear signature and it is what separates bento from a Bootstrap card deck.
- **Numbers as ornament** — spec tiles set a single figure at **40-72px**, weight 600-700, tracking **−0.02em to −0.04em**, with a 12-13px uppercase label above it.
- **Icons are optional and shrinking** — the 2023 wave used icon-per-tile; the 2024-2026 wave replaced icons with real product screenshots. Icon-only bento now reads as dated.
- **Rounded is not required, but consistency is** — brutalist bento with 0px radius and 3px black borders exists and works ([./07-brutalism.md](./07-brutalism.md)). What is non-negotiable is that all tiles agree.

## 4. Anatomy & Design Tokens

Every token named here is the **exact custom property emitted by the CSS block below**, and the table is the complete inventory of it: all 42 declared `--bento-` properties appear in the Token column, and nothing appears there that is not declared. Quantities the layout applies through media queries or by hand are listed as prose after the table, with the reason each one cannot be a custom property.

| Token group | Token | Light value | Dark value | Notes |
|---|---|---|---|---|
| Grid | `--bento-cols` | `12` | same | Desktop column count (≥1280px). Use `6` for simple 3-across sections. Reassigned at the breakpoints — see the note below. |
| Grid | `--bento-gap` | `16px` | same | The locked gutter. One value for the whole section; never vary it per tile. |
| Grid | `--bento-gap-lg` | `24px` | same | Editorial / large-format gutter. Swap `--bento-gap` for this at the section root, do not mix the two. |
| Grid | `--bento-row` | `180px` | same | Auto-row unit. A 1×1 tile is 180px tall; a 2-row tile is 376px with a 16px gap. |
| Grid | `--bento-max-w` | `1280px` | same | Max section width. Above this add side padding — do not add columns. |
| Surface | `--bento-page-bg` | `#ffffff` | `#000000` | Page ground behind the grid. |
| Surface | `--bento-tile-bg` | `#f5f5f7` | `#161617` | Default tile. ΔL ≈ 8.6 points light, ≈ 0.8 dark. |
| Surface | `--bento-tile-bg-raised` | `#ffffff` | `#1d1d1f` | For tiles sitting on a tinted section. |
| Border | `--bento-border` | `1px solid rgba(0,0,0,0.06)` | `1px solid rgba(255,255,255,0.08)` | Hairline. ~1.14:1 — decorative only, never the sole indicator. |
| Border | `--bento-border-interactive` | `1px solid rgba(0,0,0,0.45)` | `1px solid rgba(255,255,255,0.35)` | Clears 3:1 against the tile — 3.31:1 light, 3.23:1 dark. Use when the tile is itself a control. |
| Radius | `--bento-radius` | `24px` | same | Tile. Tailwind `rounded-3xl`. |
| Radius | `--bento-radius-media` | `12px` | same | Nested media. Concentric: outer − padding. |
| Radius | `--bento-radius-chip` | `999px` | same | Chips and badges. |
| Shadow | `--bento-shadow-rest` | `0 1px 2px rgba(0,0,0,0.04)` | `0 1px 2px rgba(0,0,0,0.40)` | Resting tile. |
| Shadow | `--bento-shadow-hover` | `0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)` | `0 8px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.35)` | Hover only; pair with `--bento-lift`. |
| Padding | `--bento-pad-sm` | `20px` | same | tile-sm (1×1). |
| Padding | `--bento-pad-md` | `24px` | same | tile-md (2×1). |
| Padding | `--bento-pad-lg` | `32px` | same | tile-lg (2×2). |
| Padding | `--bento-pad-stack` | `16px` | same | Internal gap, media → title. |
| Padding | `--bento-pad-tight` | `8px` | same | Internal gap, title → body. |
| Target | `--bento-target-min` | `24px`, `44px` under `@media (pointer: coarse)` | same | Minimum hit area for anything interactive. The tile itself is never the constraint — a `unit` tile is 3 cols × 180px — but the "Learn more →" chips, tag pills and icon buttons *inside* it are, so the token is sized for them: the 24px SC 2.5.8 floor with a mouse, and 44px on touch, because below 768px every tile goes full-width and those same chips become thumb targets. When a whole tile is the control, it inherits the token and passes trivially |
| Type | `--bento-eyebrow` | `600 13px/1.3 system-ui, -apple-system, "Segoe UI", sans-serif` | same | Eyebrow. Uppercase it in the rule, not the token. Drawn in `--bento-fg-muted`. |
| Type | `--bento-eyebrow-tracking` | `0.06em` | same | Positive tracking is what makes the uppercase eyebrow legible. |
| Type | `--bento-title` | `600 clamp(20px, 1.4vw + 12px, 28px)/1.2 system-ui, -apple-system, sans-serif` | same | Tile title. |
| Type | `--bento-title-tracking` | `-0.02em` | same | Optical correction at title size. |
| Type | `--bento-hero` | `600 clamp(28px, 2.6vw + 8px, 44px)/1.1 system-ui, -apple-system, sans-serif` | same | Hero-tile title. |
| Type | `--bento-hero-tracking` | `-0.03em` | same | Tighter again at display size. |
| Type | `--bento-body` | `400 16px/1.5 system-ui, -apple-system, sans-serif` | same | Body copy. Drawn in `--bento-fg-muted`. |
| Type | `--bento-stat` | `700 clamp(40px, 4vw, 72px)/1 system-ui, -apple-system, sans-serif` | same | Stat numeral. Set `font-variant-numeric: tabular-nums` alongside it. |
| Type | `--bento-stat-tracking` | `-0.04em` | same | The tightest step in the scale. |
| Colour | `--bento-fg` | `#1d1d1f` | `#f5f5f7` | Text primary. 15.46:1 / 16.61:1 on tile. |
| Colour | `--bento-fg-muted` | `#6e6e73` | `#a1a1a6` | Text secondary. 4.66:1 / 7.03:1 on tile. |
| Colour | `--bento-accent` | `#0071e3` | `#0a84ff` | Accent. 4.31:1 / 4.96:1 vs tile. |
| Colour | `--bento-focus` | `#0071e3` | `#0a84ff` | Focus ring. Same value as the accent today, but a separate property so a theme can decouple them without weakening the ring. |
| Colour | `--bento-scrim` | `linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0) 70%)` | same | Image scrim. ≥ 4.7:1 for white text over pure white imagery. |
| Motion | `--bento-dur-hover` | `180ms` | same | Hover. |
| Motion | `--bento-dur-press` | `90ms` | same | Press. |
| Motion | `--bento-dur-reveal` | `320ms` | same | Scroll reveal. |
| Motion | `--bento-stagger` | `40ms` | same | Per-tile reveal offset; cap the total sequence at 400ms (see below). |
| Motion | `--bento-ease` | `cubic-bezier(0.2, 0, 0, 1)` | same | Standard, decelerating. |
| Motion | `--bento-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | same | Exit. |
| Motion | `--bento-lift` | `-2px` | same | Hover lift, applied as `translateY(var(--bento-lift))`. Never scale the tile. |

**Four quantities in this section are not custom properties.**

- **The tablet and mobile column counts (`6` at 768–1279px, `1` below 768px)** are not separate tokens — they are reassignments of `--bento-cols` inside the media queries in §5, which is the whole reason the column count is a property rather than a literal in `grid-template-columns`. A per-breakpoint column token would be a value nothing reads. Halve every span at 6 columns; at 1 column every span goes full-width.
- **The mobile gutter (`12px`)** is written as a literal `gap` in the sub-768px block in §5. It is deliberately not a third gap token: at one column the gutter is a vertical rhythm between stacked cards, not a grid gutter, so binding it to the same property family would invite someone to use 12px on desktop and break the locked-gutter rule that defines the style.
- **The reveal cap (`400ms` total)** is a budget, not a value: it is `--bento-dur-reveal` plus `--bento-stagger × n`, so what it constrains is the tile count you may stagger, not any single declaration. Past roughly two tiles of stagger you drop the stagger, not the duration.
- **The concentric radius rule (`inner = outer − padding`)** produces `--bento-radius-media` at the default tile size — 24px tile with 12px inset media gives 12px — but it is arithmetic over two other tokens whose operands change per tile size, so it is a rule to apply when authoring a nested-media radius, not a property. `calc(var(--bento-radius) - var(--bento-pad-sm))` would be wrong on any tile using `--bento-pad-md` or `--bento-pad-lg`.

```css
:root {
  /* ---- grid ---- */
  --bento-cols: 12;
  --bento-gap: 16px;
  --bento-gap-lg: 24px;
  --bento-row: 180px;
  --bento-max-w: 1280px;

  /* ---- surface ---- */
  --bento-page-bg: #ffffff;
  --bento-tile-bg: #f5f5f7;
  --bento-tile-bg-raised: #ffffff;
  --bento-border: 1px solid rgba(0, 0, 0, 0.06);
  --bento-border-interactive: 1px solid rgba(0, 0, 0, 0.45);

  /* ---- shape ---- */
  --bento-radius: 24px;
  --bento-radius-media: 12px;
  --bento-radius-chip: 999px;

  /* ---- elevation ---- */
  --bento-shadow-rest: 0 1px 2px rgba(0, 0, 0, 0.04);
  --bento-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);

  /* ---- spacing ---- */
  --bento-pad-sm: 20px;
  --bento-pad-md: 24px;
  --bento-pad-lg: 32px;
  --bento-pad-stack: 16px;
  --bento-pad-tight: 8px;

  /* ---- targets ---- */
  /* Sized for the chips and icon buttons inside a tile, not the tile: those are
     the only elements here that can fall under the SC 2.5.8 floor. Bumped to
     the touch minimum on coarse pointers below. */
  --bento-target-min: 24px;

  /* ---- colour ---- */
  --bento-fg: #1d1d1f;
  --bento-fg-muted: #6e6e73;
  --bento-accent: #0071e3;
  --bento-focus: #0071e3;
  --bento-scrim: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.28) 45%,
    rgba(0, 0, 0, 0) 70%
  );

  /* ---- type ---- */
  --bento-eyebrow: 600 13px/1.3 system-ui, -apple-system, "Segoe UI", sans-serif;
  --bento-eyebrow-tracking: 0.06em;
  --bento-title: 600 clamp(20px, 1.4vw + 12px, 28px)/1.2 system-ui, -apple-system, sans-serif;
  --bento-title-tracking: -0.02em;
  --bento-hero: 600 clamp(28px, 2.6vw + 8px, 44px)/1.1 system-ui, -apple-system, sans-serif;
  --bento-hero-tracking: -0.03em;
  --bento-body: 400 16px/1.5 system-ui, -apple-system, sans-serif;
  --bento-stat: 700 clamp(40px, 4vw, 72px)/1 system-ui, -apple-system, sans-serif;
  --bento-stat-tracking: -0.04em;

  /* ---- motion ---- */
  --bento-dur-press: 90ms;
  --bento-dur-hover: 180ms;
  --bento-dur-reveal: 320ms;
  --bento-stagger: 40ms;
  --bento-ease: cubic-bezier(0.2, 0, 0, 1);
  --bento-ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --bento-lift: -2px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bento-page-bg: #000000;
    --bento-tile-bg: #161617;
    --bento-tile-bg-raised: #1d1d1f;
    --bento-border: 1px solid rgba(255, 255, 255, 0.08);
    --bento-border-interactive: 1px solid rgba(255, 255, 255, 0.35);
    --bento-shadow-rest: 0 1px 2px rgba(0, 0, 0, 0.40);
    --bento-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.35);
    --bento-fg: #f5f5f7;
    --bento-fg-muted: #a1a1a6;
    --bento-accent: #0a84ff;
    --bento-focus: #0a84ff;
  }
}

:root[data-theme="dark"] {
  --bento-page-bg: #000000;
  --bento-tile-bg: #161617;
  --bento-tile-bg-raised: #1d1d1f;
  --bento-border: 1px solid rgba(255, 255, 255, 0.08);
  --bento-border-interactive: 1px solid rgba(255, 255, 255, 0.35);
  --bento-shadow-rest: 0 1px 2px rgba(0, 0, 0, 0.40);
  --bento-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.35);
  --bento-fg: #f5f5f7;
  --bento-fg-muted: #a1a1a6;
  --bento-accent: #0a84ff;
  --bento-focus: #0a84ff;
}

/* Touch. This is the same breakpoint story as the grid: under 768px the layout
   collapses to one column, every tile is full-width, and the in-tile chips stop
   being mouse targets and start being thumb targets. 24px clears the SC 2.5.8
   floor but not a fingertip. Placed last so it wins in both themes. */
@media (pointer: coarse) {
  :root { --bento-target-min: 44px; }
}
```

**Span vocabulary.** Only five spans should exist in a given section. More than five and the composition stops reading as a system.

| Name | Desktop (12-col) | Tablet (6-col) | Mobile | Use |
|---|---|---|---|---|
| `hero` | `span 6 / span 2` | `span 6 / span 2` | full | primary claim |
| `wide` | `span 6 / span 1` | `span 6 / span 1` | full | secondary feature with horizontal media |
| `tall` | `span 3 / span 2` | `span 3 / span 2` | full | vertical screenshot, list |
| `unit` | `span 3 / span 1` | `span 3 / span 1` | full | one stat, one icon+line |
| `strip` | `span 12 / span 1` | `span 6 / span 1` | full | full-bleed CTA or logo row |

## 5. Implementation Recipes

### Vanilla CSS

```html
<section class="bento" aria-labelledby="bento-heading">
  <h2 id="bento-heading" class="bento__heading">Everything in one place</h2>

  <ul class="bento__grid" role="list">
    <li class="bento__tile bento__tile--hero">
      <p class="bento__eyebrow">Performance</p>
      <h3 class="bento__title bento__title--hero">Ships in 40&nbsp;milliseconds, everywhere.</h3>
      <p class="bento__body">Edge-rendered by default. No cold starts, no region picking.</p>
      <img class="bento__media bento__media--bleed" src="/img/perf.avif" alt="" width="720" height="420" loading="lazy" decoding="async">
    </li>

    <li class="bento__tile bento__tile--unit">
      <p class="bento__eyebrow">Uptime</p>
      <p class="bento__stat">99.99<span class="bento__stat-unit">%</span></p>
    </li>

    <li class="bento__tile bento__tile--unit">
      <p class="bento__eyebrow">Regions</p>
      <p class="bento__stat">38</p>
    </li>

    <li class="bento__tile bento__tile--tall">
      <p class="bento__eyebrow">Observability</p>
      <h3 class="bento__title">Every request, traced.</h3>
      <img class="bento__media bento__media--bleed" src="/img/traces.avif" alt="" width="480" height="620" loading="lazy" decoding="async">
    </li>

    <li class="bento__tile bento__tile--wide">
      <p class="bento__eyebrow">Integrations</p>
      <h3 class="bento__title">Connects to the stack you already run.</h3>
    </li>

    <li class="bento__tile bento__tile--unit bento__tile--image">
      <img class="bento__cover" src="/img/team.avif" alt="" width="480" height="360" loading="lazy" decoding="async">
      <div class="bento__scrim"></div>
      <h3 class="bento__title bento__title--onImage">Built by the people who run it.</h3>
    </li>
  </ul>
</section>
```

```css
/* ---------- container ---------- */
.bento {
  max-width: var(--bento-max-w);
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 40px);
  background: var(--bento-page-bg);
  color: var(--bento-fg);
}

.bento__heading {
  font: var(--bento-hero);
  letter-spacing: var(--bento-hero-tracking);
  margin: 0 0 clamp(24px, 4vw, 48px);
}

.bento__grid {
  display: grid;
  grid-template-columns: repeat(var(--bento-cols), minmax(0, 1fr));
  grid-auto-rows: var(--bento-row);
  gap: var(--bento-gap);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* ---------- tiles ---------- */
.bento__tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--bento-pad-tight);
  overflow: hidden;
  padding: var(--bento-pad-sm);
  background: var(--bento-tile-bg);
  border: var(--bento-border);
  border-radius: var(--bento-radius);
  box-shadow: var(--bento-shadow-rest);
  container-type: inline-size;
  container-name: tile;
  isolation: isolate;
}

.bento__tile--hero  { grid-column: span 6; grid-row: span 2; padding: var(--bento-pad-lg); }
.bento__tile--wide  { grid-column: span 6; grid-row: span 1; padding: var(--bento-pad-md); }
.bento__tile--tall  { grid-column: span 3; grid-row: span 2; padding: var(--bento-pad-md); }
.bento__tile--unit  { grid-column: span 3; grid-row: span 1; }
.bento__tile--strip { grid-column: 1 / -1;  grid-row: span 1; padding: var(--bento-pad-md); }

/* ---------- typography ---------- */
.bento__eyebrow {
  margin: 0;
  font: var(--bento-eyebrow);
  letter-spacing: var(--bento-eyebrow-tracking);
  text-transform: uppercase;
  color: var(--bento-fg-muted);
}
.bento__title {
  margin: 0;
  font: var(--bento-title);
  letter-spacing: var(--bento-title-tracking);
  text-wrap: balance;
}
.bento__title--hero { font: var(--bento-hero); letter-spacing: var(--bento-hero-tracking); }
.bento__title--onImage { color: #fff; margin-top: auto; position: relative; z-index: 2; }
.bento__body {
  margin: 0;
  max-width: 46ch;
  font: var(--bento-body);
  color: var(--bento-fg-muted);
  text-wrap: pretty;
}
.bento__stat {
  margin: auto 0 0;
  font: var(--bento-stat);
  letter-spacing: var(--bento-stat-tracking);
  font-variant-numeric: tabular-nums;
}
.bento__stat-unit { font-size: 0.5em; margin-inline-start: 0.08em; }

/* ---------- media ---------- */
.bento__media {
  display: block;
  width: 100%;
  height: auto;
  margin-top: var(--bento-pad-stack);
  border-radius: var(--bento-radius-media);
}
/* bleed: let the screenshot run off the bottom-right of the tile */
.bento__media--bleed {
  margin: auto calc(var(--bento-pad-lg) * -1) calc(var(--bento-pad-lg) * -1) auto;
  width: calc(100% + var(--bento-pad-lg));
  max-width: none;
  border-radius: var(--bento-radius-media) 0 0 0;
}
.bento__cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.bento__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--bento-scrim);
  pointer-events: none;
}

/* ---------- container-query interior ---------- */
@container tile (min-width: 420px) {
  .bento__tile--unit { flex-direction: row; align-items: flex-end; justify-content: space-between; }
}
@container tile (max-width: 260px) {
  .bento__body { display: none; }
}

/* ---------- responsive collapse ---------- */
@media (max-width: 1279px) {
  .bento__grid { --bento-cols: 6; }
  .bento__tile--hero  { grid-column: span 6; }
  .bento__tile--wide  { grid-column: span 6; }
  .bento__tile--tall  { grid-column: span 3; }
  .bento__tile--unit  { grid-column: span 3; }
}

@media (max-width: 767px) {
  .bento__grid {
    --bento-cols: 1;
    gap: 12px;
    grid-auto-rows: auto;            /* let content set the height */
  }
  .bento__tile,
  .bento__tile--hero,
  .bento__tile--wide,
  .bento__tile--tall,
  .bento__tile--unit,
  .bento__tile--strip {
    grid-column: 1 / -1;
    grid-row: auto;
    min-height: 200px;
    padding: var(--bento-pad-sm);
  }
  .bento__tile--hero { min-height: 320px; }
  .bento__media--bleed {
    margin: auto calc(var(--bento-pad-sm) * -1) calc(var(--bento-pad-sm) * -1) auto;
    width: calc(100% + var(--bento-pad-sm));
  }
}

/* ---------- interactive tiles ---------- */
.bento__tile:has(a),
.bento__tile:has(button) { border: var(--bento-border-interactive); }

.bento__tile a::after {              /* full-tile hit area, one link per tile */
  content: "";
  position: absolute;
  inset: 0;
  z-index: 3;
}

.bento__tile:has(a:hover),
.bento__tile:has(button:hover) {
  transform: translateY(var(--bento-lift));
  box-shadow: var(--bento-shadow-hover);
  transition: transform var(--bento-dur-hover) var(--bento-ease),
              box-shadow var(--bento-dur-hover) var(--bento-ease);
}
.bento__tile:has(a:active) { transform: translateY(0); transition-duration: var(--bento-dur-press); }

.bento__tile:has(a:focus-visible) {
  outline: 3px solid var(--bento-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .bento__tile,
  .bento__tile:has(a:hover) { transition: none; transform: none; }
}

@media (forced-colors: active) {
  .bento__tile { border: 1px solid CanvasText; box-shadow: none; }
  .bento__scrim { display: none; }
  .bento__tile:has(a:focus-visible) { outline: 3px solid Highlight; }
}
```

**On `grid-auto-flow: dense`.** It is deliberately absent above. Dense packing pulls later items into earlier holes, so the visual order stops matching DOM order and both screen-reader traversal and tab order diverge from what a sighted user sees. Use it only when every tile in the grid is non-interactive decoration, or pair it with `reading-flow` (below). If you want dense's tight look without the hazard, place tiles explicitly with `grid-template-areas` instead.

```css
/* Dense packing, made safe on Chromium 137+. Progressive enhancement only. */
@supports (reading-flow: grid-rows) {
  .bento__grid--dense {
    grid-auto-flow: dense;
    reading-flow: grid-rows;   /* focus + a11y tree follow visual rows */
  }
}
```

**`grid-template-areas` variant** — deterministic placement, no dense, no auto-flow surprises:

```css
.bento__grid--areas {
  display: grid;
  gap: var(--bento-gap);
  grid-auto-rows: var(--bento-row);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-areas:
    "hero hero stat1 stat2"
    "hero hero tall  wide"
    "img  img  tall  wide";
}
.bento__grid--areas > :nth-child(1) { grid-area: hero; }
.bento__grid--areas > :nth-child(2) { grid-area: stat1; }
.bento__grid--areas > :nth-child(3) { grid-area: stat2; }
.bento__grid--areas > :nth-child(4) { grid-area: tall; }
.bento__grid--areas > :nth-child(5) { grid-area: wide; }
.bento__grid--areas > :nth-child(6) { grid-area: img; }

@media (max-width: 767px) {
  .bento__grid--areas {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-template-areas: "hero" "stat1" "stat2" "tall" "wide" "img";
  }
}
```

### Tailwind CSS v4

No plugin required. Everything below is core Tailwind v4 plus `@theme` tokens. Container queries are built into core in v4 (`@container`, `@md:` style variants), so the old `@tailwindcss/container-queries` plugin is unnecessary.

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-bento-page: #ffffff;
  --color-bento-tile: #f5f5f7;
  --color-bento-fg: #1d1d1f;
  --color-bento-muted: #6e6e73;
  --color-bento-accent: #0071e3;

  --radius-bento: 24px;
  --radius-bento-media: 12px;

  --spacing-bento-gap: 16px;
  --spacing-bento-row: 180px;

  --ease-bento: cubic-bezier(0.2, 0, 0, 1);
  --animate-bento-in: bento-in 320ms var(--ease-bento) both;

  --shadow-bento: 0 1px 2px rgb(0 0 0 / 0.04);
  --shadow-bento-hover: 0 8px 24px rgb(0 0 0 / 0.08), 0 2px 6px rgb(0 0 0 / 0.04);
}

@keyframes bento-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}

@layer components {
  .bento-tile {
    @apply relative flex flex-col gap-2 overflow-hidden rounded-bento
           bg-bento-tile p-5 text-bento-fg shadow-bento
           ring-1 ring-black/6 dark:bg-[#161617] dark:text-[#f5f5f7] dark:ring-white/8;
    container-type: inline-size;
  }
}

@custom-variant dark (&:where(.dark, .dark *));
```

```html
<section class="mx-auto max-w-[1280px] bg-bento-page px-4 dark:bg-black sm:px-10">
  <h2 class="mb-8 text-4xl font-semibold tracking-[-0.03em] text-bento-fg dark:text-[#f5f5f7]">
    Everything in one place
  </h2>

  <ul role="list"
      class="grid grid-cols-1 gap-3
             md:grid-cols-6 md:gap-4 md:auto-rows-bento-row
             xl:grid-cols-12">

    <!-- hero: 2x2 -->
    <li class="bento-tile p-8 md:col-span-6 md:row-span-2 xl:col-span-6">
      <p class="text-[13px] font-semibold uppercase tracking-[0.06em] text-bento-muted dark:text-[#a1a1a6]">
        Performance
      </p>
      <h3 class="text-balance text-3xl font-semibold tracking-[-0.03em] md:text-[44px] md:leading-[1.1]">
        Ships in 40 milliseconds, everywhere.
      </h3>
      <p class="max-w-[46ch] text-pretty text-base text-bento-muted dark:text-[#a1a1a6]">
        Edge-rendered by default. No cold starts, no region picking.
      </p>
      <img src="/img/perf.avif" alt="" width="720" height="420" loading="lazy" decoding="async"
           class="mt-auto -mb-8 -mr-8 w-[calc(100%+2rem)] max-w-none rounded-tl-bento-media">
    </li>

    <!-- unit stat -->
    <li class="bento-tile md:col-span-3 xl:col-span-3">
      <p class="text-[13px] font-semibold uppercase tracking-[0.06em] text-bento-muted dark:text-[#a1a1a6]">Uptime</p>
      <p class="mt-auto text-6xl font-bold tabular-nums tracking-[-0.04em]">99.99<span class="text-3xl">%</span></p>
    </li>

    <!-- unit stat -->
    <li class="bento-tile md:col-span-3 xl:col-span-3">
      <p class="text-[13px] font-semibold uppercase tracking-[0.06em] text-bento-muted dark:text-[#a1a1a6]">Regions</p>
      <p class="mt-auto text-6xl font-bold tabular-nums tracking-[-0.04em]">38</p>
    </li>

    <!-- tall, interactive: whole tile is one link -->
    <li class="bento-tile group p-6 ring-black/45 transition-[transform,box-shadow] duration-[180ms] ease-bento
               hover:-translate-y-0.5 hover:shadow-bento-hover
               has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px]
               has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-bento-accent
               motion-reduce:transform-none motion-reduce:transition-none
               md:col-span-3 md:row-span-2 xl:col-span-3 dark:ring-white/35">
      <p class="text-[13px] font-semibold uppercase tracking-[0.06em] text-bento-muted dark:text-[#a1a1a6]">Observability</p>
      <h3 class="text-2xl font-semibold tracking-[-0.02em]">
        <a href="/observability" class="after:absolute after:inset-0 after:z-10 after:content-['']">
          Every request, traced.
        </a>
      </h3>
      <img src="/img/traces.avif" alt="" width="480" height="620" loading="lazy" decoding="async"
           class="mt-auto -mb-6 -mr-6 w-[calc(100%+1.5rem)] max-w-none rounded-tl-bento-media">
    </li>

    <!-- wide, interior reflows by its own width, not the viewport -->
    <li class="bento-tile p-6 md:col-span-3 md:row-span-2 xl:col-span-6">
      <div class="flex flex-col gap-2 @[420px]:flex-row @[420px]:items-end @[420px]:justify-between">
        <h3 class="text-2xl font-semibold tracking-[-0.02em]">Connects to the stack you already run.</h3>
        <p class="text-base text-bento-muted dark:text-[#a1a1a6]">120+ integrations</p>
      </div>
    </li>

    <!-- image tile with scrim -->
    <li class="bento-tile isolate justify-end md:col-span-6 xl:col-span-12">
      <img src="/img/team.avif" alt="" width="1280" height="360" loading="lazy" decoding="async"
           class="absolute inset-0 -z-10 h-full w-full object-cover">
      <div class="pointer-events-none absolute inset-0 -z-10
                  bg-[linear-gradient(to_top,rgb(0_0_0/0.72),rgb(0_0_0/0.28)_45%,transparent_70%)]"></div>
      <h3 class="relative text-2xl font-semibold tracking-[-0.02em] text-white">
        Built by the people who run it.
      </h3>
    </li>
  </ul>
</section>
```

Notes:
- **Every token above is registered in `@theme`, so the markup uses the generated utility name** — `rounded-bento`, `rounded-tl-bento-media`, `ease-bento`, `auto-rows-bento-row` — not bracket syntax. In Tailwind v4 brackets take a *literal* value, so `ease-[--ease-bento]` emits `transition-timing-function: --ease-bento` and `rounded-tl-[--radius-bento-media]` emits `border-top-left-radius: --radius-bento-media`. Both are invalid CSS values, dropped silently: you get default easing and square media corners with no error anywhere. If you genuinely need to point at a custom property rather than a theme key, v4's shorthand is parentheses — `ease-(--ease-bento)`, `rounded-tl-(--radius-bento-media)`. The same bug class is documented in [./08-liquid-glass.md](./08-liquid-glass.md) §5.
- `has-[a:focus-visible]:` requires Tailwind v3.4+/v4 `has-*` variants and browser `:has()` support (interoperable since late 2023).
- `@[420px]:` is a core container-query variant in v4; the parent needs `container-type: inline-size`, provided by the `.bento-tile` component class.
- If you need dense packing, add `grid-flow-dense` plus a raw `[reading-flow:grid-rows]` utility inside a `@supports` block. Do not ship dense on an interactive grid without it.

### React component

TypeScript, no dependencies beyond React. Spans are a closed vocabulary so the compiler catches invented sizes, and the collapse behaviour is centralised.

```tsx
// BentoGrid.tsx
import * as React from "react";

/* ---------- span vocabulary ---------- */

export type BentoSpan = "hero" | "wide" | "tall" | "unit" | "strip";

const SPAN_STYLE: Record<BentoSpan, React.CSSProperties> = {
  hero:  { gridColumn: "span 6",  gridRow: "span 2", padding: "var(--bento-pad-lg)" },
  wide:  { gridColumn: "span 6",  gridRow: "span 1", padding: "var(--bento-pad-md)" },
  tall:  { gridColumn: "span 3",  gridRow: "span 2", padding: "var(--bento-pad-md)" },
  unit:  { gridColumn: "span 3",  gridRow: "span 1", padding: "var(--bento-pad-sm)" },
  strip: { gridColumn: "1 / -1",  gridRow: "span 1", padding: "var(--bento-pad-md)" },
};

/* ---------- grid ---------- */

export interface BentoGridProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Base column count at the widest breakpoint. 12 or 6. Default 12. */
  columns?: 6 | 12;
  /** Gutter in px, applied to every gap. Default 16. */
  gap?: number;
  /** Height of one grid row unit in px. Default 180. */
  rowUnit?: number;
  /** Dense packing. Only safe when no tile is interactive. Default false. */
  dense?: boolean;
  children: React.ReactNode;
}

export function BentoGrid({
  columns = 12,
  gap = 16,
  rowUnit = 180,
  dense = false,
  style,
  children,
  ...rest
}: BentoGridProps) {
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridAutoRows: `${rowUnit}px`,
    gap: `${gap}px`,
    listStyle: "none",
    margin: 0,
    padding: 0,
    ...(dense ? { gridAutoFlow: "dense", readingFlow: "grid-rows" } as React.CSSProperties : null),
    ...style,
  };

  if (process.env.NODE_ENV !== "production" && dense) {
    // eslint-disable-next-line no-console
    console.warn(
      "[BentoGrid] dense=true reorders tiles visually without reordering the DOM. " +
        "Only use it when every tile is non-interactive, or verify reading-flow support."
    );
  }

  return (
    <ul {...rest} style={gridStyle}>
      {children}
    </ul>
  );
}

/* ---------- tile ---------- */

export interface BentoTileProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  span?: BentoSpan;
  eyebrow?: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  /** Renders a single full-tile link. One link per tile, never two. */
  href?: string;
  /** Decorative background image URL. Adds a scrim automatically. */
  cover?: string;
  /** Media that bleeds off the bottom-right corner. */
  media?: React.ReactNode;
  /** Big numeral variant. Overrides body. */
  stat?: string;
  children?: React.ReactNode;
}

export function BentoTile({
  span = "unit",
  eyebrow,
  title,
  body,
  href,
  cover,
  media,
  stat,
  children,
  style,
  ...rest
}: BentoTileProps) {
  const onImage = Boolean(cover);

  const tileStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "var(--bento-pad-tight)",
    overflow: "hidden",
    background: onImage ? "#000" : "var(--bento-tile-bg)",
    border: href ? "var(--bento-border-interactive)" : "var(--bento-border)",
    borderRadius: "var(--bento-radius)",
    boxShadow: "var(--bento-shadow-rest)",
    containerType: "inline-size",
    isolation: "isolate",
    color: onImage ? "#fff" : "var(--bento-fg)",
    transition:
      "transform var(--bento-dur-hover) var(--bento-ease), box-shadow var(--bento-dur-hover) var(--bento-ease)",
    ...SPAN_STYLE[span],
    ...style,
  };

  return (
    <li {...rest} style={tileStyle} data-bento-span={span} data-bento-interactive={href ? "" : undefined}>
      {cover ? (
        <>
          <img
            src={cover}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              background: "var(--bento-scrim)",
            }}
          />
        </>
      ) : null}

      {eyebrow ? (
        <p
          style={{
            position: "relative",
            zIndex: 2,
            margin: 0,
            font: "var(--bento-eyebrow)",
            letterSpacing: "var(--bento-eyebrow-tracking)",
            textTransform: "uppercase",
            color: onImage ? "rgba(255,255,255,0.82)" : "var(--bento-fg-muted)",
          }}
        >
          {eyebrow}
        </p>
      ) : null}

      {title ? (
        <h3
          style={{
            position: "relative",
            zIndex: 2,
            margin: 0,
            font: span === "hero" ? "var(--bento-hero)" : "var(--bento-title)",
            letterSpacing: span === "hero" ? "var(--bento-hero-tracking)" : "var(--bento-title-tracking)",
            textWrap: "balance",
            marginTop: onImage ? "auto" : undefined,
          }}
        >
          {href ? (
            <a
              href={href}
              style={{ color: "inherit", textDecoration: "none" }}
              // full-tile hit area without nesting the whole card in an <a>
              onFocus={(e) => e.currentTarget.parentElement?.parentElement?.scrollIntoView({ block: "nearest" })}
            >
              {title}
              <span
                aria-hidden="true"
                style={{ position: "absolute", inset: 0, zIndex: 3 }}
              />
            </a>
          ) : (
            title
          )}
        </h3>
      ) : null}

      {stat ? (
        <p
          style={{
            position: "relative",
            zIndex: 2,
            margin: "auto 0 0",
            font: "var(--bento-stat)",
            letterSpacing: "var(--bento-stat-tracking)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {stat}
        </p>
      ) : body ? (
        <p
          style={{
            position: "relative",
            zIndex: 2,
            margin: 0,
            maxWidth: "46ch",
            font: "var(--bento-body)",
            color: onImage ? "rgba(255,255,255,0.88)" : "var(--bento-fg-muted)",
            textWrap: "pretty",
          }}
        >
          {body}
        </p>
      ) : null}

      {media ? (
        <div style={{ position: "relative", zIndex: 2, marginTop: "auto" }}>{media}</div>
      ) : null}

      {children}
    </li>
  );
}
```

```tsx
// usage
export default function Features() {
  return (
    <section aria-labelledby="f-h">
      <h2 id="f-h">Everything in one place</h2>
      <BentoGrid columns={12} gap={16} rowUnit={180}>
        <BentoTile
          span="hero"
          eyebrow="Performance"
          title="Ships in 40 milliseconds, everywhere."
          body="Edge-rendered by default. No cold starts, no region picking."
        />
        <BentoTile span="unit" eyebrow="Uptime" stat="99.99%" />
        <BentoTile span="unit" eyebrow="Regions" stat="38" />
        <BentoTile span="tall" eyebrow="Observability" title="Every request, traced." href="/observability" />
        <BentoTile span="wide" eyebrow="Integrations" title="Connects to the stack you already run." />
        <BentoTile span="strip" cover="/img/team.avif" title="Built by the people who run it." />
      </BentoGrid>
    </section>
  );
}
```

Pair it with a small stylesheet for the responsive collapse, because inline styles cannot carry media queries:

```css
@media (max-width: 1279px) {
  [data-bento-span] { grid-column: span 3 !important; }
  [data-bento-span="hero"], [data-bento-span="wide"] { grid-column: span 6 !important; }
}
@media (max-width: 767px) {
  [data-bento-span] { grid-column: 1 / -1 !important; grid-row: auto !important; min-height: 200px; }
  [data-bento-span="hero"] { min-height: 320px; }
}
@media (hover: hover) {
  [data-bento-interactive]:hover { transform: translateY(-2px); box-shadow: var(--bento-shadow-hover); }
}
@media (prefers-reduced-motion: reduce) {
  [data-bento-span] { transition: none !important; transform: none !important; }
}
[data-bento-interactive]:has(a:focus-visible) { outline: 3px solid var(--bento-focus); outline-offset: 2px; }
```

### Native / other platform

Bento is genuinely relevant on native because Apple ships it in marketing and in widget stacks, but neither SwiftUI nor Compose gives you CSS Grid's two-axis spanning for free.

**SwiftUI.** `Grid` (iOS 16+/macOS 13+) supports column spanning via `.gridCellColumns(_:)`. There is no row-span equivalent, so a true 2×2 hero next to two stacked 1×1 tiles has to be built as nested stacks. This compiles and runs as-is:

```swift
import SwiftUI

struct BentoTokens {
    static let gap: CGFloat = 16
    static let radius: CGFloat = 24
    static let padSm: CGFloat = 20
    static let padLg: CGFloat = 32
    static let row: CGFloat = 180
    static let tile = Color(.sRGB, red: 0.961, green: 0.961, blue: 0.969, opacity: 1) // #F5F5F7
    static let stroke = Color.black.opacity(0.06)
    static let muted = Color(.sRGB, red: 0.431, green: 0.431, blue: 0.451, opacity: 1) // #6E6E73
}

struct BentoTile<Content: View>: View {
    var padding: CGFloat = BentoTokens.padSm
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 8) { content }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            .padding(padding)
            .background(BentoTokens.tile)
            .clipShape(RoundedRectangle(cornerRadius: BentoTokens.radius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: BentoTokens.radius, style: .continuous)
                    .stroke(BentoTokens.stroke, lineWidth: 1)
            )
    }
}

struct Eyebrow: View {
    let text: String
    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 13, weight: .semibold))
            .kerning(0.78)                       // 0.06em at 13pt
            .foregroundStyle(BentoTokens.muted)
    }
}

struct BentoSection: View {
    var body: some View {
        VStack(spacing: BentoTokens.gap) {

            // Row block: 2x2 hero beside a 1x1 + 1x1 stack
            HStack(alignment: .top, spacing: BentoTokens.gap) {
                BentoTile(padding: BentoTokens.padLg) {
                    Eyebrow(text: "Performance")
                    Text("Ships in 40 milliseconds, everywhere.")
                        .font(.system(size: 34, weight: .semibold))
                        .kerning(-1.0)
                    Text("Edge-rendered by default. No cold starts.")
                        .font(.system(size: 16))
                        .foregroundStyle(BentoTokens.muted)
                    Spacer(minLength: 0)
                }
                .frame(height: BentoTokens.row * 2 + BentoTokens.gap)

                VStack(spacing: BentoTokens.gap) {
                    BentoTile {
                        Eyebrow(text: "Uptime")
                        Spacer(minLength: 0)
                        Text("99.99%")
                            .font(.system(size: 44, weight: .bold))
                            .monospacedDigit()
                            .kerning(-1.76)
                    }
                    BentoTile {
                        Eyebrow(text: "Regions")
                        Spacer(minLength: 0)
                        Text("38")
                            .font(.system(size: 44, weight: .bold))
                            .monospacedDigit()
                            .kerning(-1.76)
                    }
                }
                .frame(height: BentoTokens.row * 2 + BentoTokens.gap)
            }

            // Full-width strip using Grid + gridCellColumns
            Grid(horizontalSpacing: BentoTokens.gap, verticalSpacing: BentoTokens.gap) {
                GridRow {
                    BentoTile { Eyebrow(text: "Integrations"); Text("120+").font(.title2.weight(.semibold)) }
                    BentoTile { Eyebrow(text: "SDKs"); Text("9").font(.title2.weight(.semibold)) }
                }
                GridRow {
                    BentoTile(padding: BentoTokens.padSm) {
                        Text("Connects to the stack you already run.")
                            .font(.system(size: 22, weight: .semibold))
                    }
                    .gridCellColumns(2)          // column span; no row-span equivalent exists
                }
            }
            .frame(height: BentoTokens.row * 2 + BentoTokens.gap)
        }
        .padding(BentoTokens.gap)
        .background(Color.white)
    }
}
```

Use `RoundedRectangle(cornerRadius:style: .continuous)` rather than `.circular` — the squircle is what makes a 24pt radius read as Apple rather than as Bootstrap. For scrolling grids, `LazyVGrid` has no spanning at all; if you need bento inside a scroll view, either build fixed row blocks like the above or implement a custom `Layout`.

**Jetpack Compose.** `LazyVerticalGrid` supports **column** spanning only, via `item(span = { GridItemSpan(maxLineSpan) })` or `items(span = { GridItemSpan(2) })`. There is no row span. Two workable strategies: (1) accept column-only spanning and encode hierarchy with tile height, or (2) use `LazyVerticalStaggeredGrid`, which gives variable heights but gives up the strict shared row rhythm. For a fixed, non-scrolling bento hero, nested `Row`/`Column` with `Modifier.weight()` is the accurate translation.

**Figma / Framer.** Build the grid as an auto-layout wrap frame only if all tiles are equal; for real bento use a frame with absolute-positioned children plus a visible layout grid (columns = 12, gutter = 16, margin = 40, stretch). Framer's Stack does not span, so use its Grid layer or place tiles on a canvas frame with pinned constraints. Keep one component per span size (`Tile/Hero`, `Tile/Wide`, `Tile/Tall`, `Tile/Unit`) so the vocabulary stays closed in design as well as in code.

## 6. Interaction & Motion

Bento tiles are large targets, which means the interaction problem is not discoverability, it is restraint. A grid of eight tiles that all animate on hover reads as a slot machine.

| State | Treatment | Values |
|---|---|---|
| Rest | hairline border, near-zero shadow | `border: 1px solid rgba(0,0,0,0.06)`, `box-shadow: 0 1px 2px rgba(0,0,0,0.04)` |
| Hover (interactive tiles only) | lift + shadow bloom, no scale | `translateY(-2px)`, `0 8px 24px rgba(0,0,0,0.08)`, `180ms cubic-bezier(0.2,0,0,1)` |
| Hover (media inside tile) | image scale, tile stays put | `img { scale: 1.03 }`, `400ms cubic-bezier(0.2,0,0,1)`, tile has `overflow: hidden` |
| Active / press | settle to baseline, fast | `translateY(0)`, `90ms`, optional `scale(0.995)` on the tile only if the whole tile is the button |
| Focus-visible | 3px ring, 2px offset, outside the radius | `outline: 3px solid #0071e3; outline-offset: 2px` (light) / `#0a84ff` (dark) |
| Disabled | desaturate + lower opacity, keep border | `filter: grayscale(1); opacity: 0.55; cursor: not-allowed`, remove hover transition |
| Loading | skeleton tile at exact final span | tile keeps its `grid-column`/`grid-row`; inner blocks get a 1200ms linear shimmer or, better, a static `--bento-tile-bg` at 60% with no animation |
| Empty | keep the tile, show a one-line reason | never collapse the tile — a missing tile breaks the composition and causes layout shift |

**Reveal on scroll.** The one motion that genuinely improves a bento section: tiles fade and rise into place as the section enters the viewport.

```css
.bento__tile {
  animation: bento-in var(--bento-dur-reveal) var(--bento-ease) both;
  animation-timeline: view();
  animation-range: entry 0% cover 22%;
}
@keyframes bento-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
```

If you use JS/IntersectionObserver instead, stagger by `40ms` per tile in **DOM order**, and cap the total sequence at **400ms**. A 9-tile grid staggered at 120ms takes 1.08s and users will scroll past the last tile before it exists.

**What should animate:** opacity, `transform: translate`, `transform: scale` on nested media, `box-shadow`, `background-color`.
**What should never animate:** `grid-template-columns`, `grid-row`, `width`, `height`, `gap`, `border-radius` across breakpoints. All of these force layout on every frame across the entire grid. If you must animate the grid geometry itself (a rearranging dashboard), use the View Transitions API or FLIP with transforms, not by animating grid properties.

**Reduced motion.**

```css
@media (prefers-reduced-motion: reduce) {
  .bento__tile {
    animation: none;
    transition: none;
    transform: none;
    opacity: 1;
  }
  .bento__tile img { scale: 1; }
  .bento__tile video { display: none; }         /* pair with a poster <img> */
}
```

Autoplaying loops inside tiles are the biggest reduced-motion hazard in this pattern. Under `prefers-reduced-motion: reduce`, swap every tile video for its poster frame, and provide a visible play control if the video is informative rather than decorative (WCAG 2.2.2 applies to anything that auto-plays for more than 5 seconds).

## 7. Accessibility

Bento is low-risk structurally and medium-risk in practice, because the same three mistakes recur: dense packing, text on imagery, and tiles that are secretly buttons.

**Criteria this pattern tends to fail.**

- **1.3.2 Meaningful Sequence (A)** — the headline risk. `grid-auto-flow: dense` and `order` change visual placement without changing the accessibility tree. The CSS Grid spec is explicit: *"Authors must use `order` and the grid-placement properties only for visual, not logical, reordering of content. Style sheets that use these features to perform logical reordering are non-conforming."* If your dense grid's visual reading order differs from DOM order, that is a conformance failure, not a preference.
- **2.4.3 Focus Order (A)** — same root cause. Tab order follows DOM; a densely packed grid sends focus jumping around the composition.
- **1.4.3 Contrast (Minimum) (AA)** — text over imagery in cover tiles, and muted body copy on tinted tile surfaces. `#6e6e73` on `#f5f5f7` computes to **4.66:1**, which passes at 16px but leaves almost no margin; lightening the tile or darkening the text by one step drops it below 4.5:1.
- **1.4.11 Non-text Contrast (AA)** — the signature hairline. `rgba(0,0,0,0.06)` composited on `#f5f5f7` yields `#e6e6e8`, a contrast of **1.14:1** against the tile. That is fine for a decorative divider and a failure if the border is the only thing indicating "this tile is a control". Clearing 3:1 against `#f5f5f7` takes far more alpha than it looks: the crossing is `rgba(0,0,0,0.4199)`, so `--bento-border-interactive` ships `0.45` (**3.31:1**). In dark mode the crossing over `#161617` is `rgba(255,255,255,0.3294)` and the token ships `0.35` (**3.23:1**).
- **2.4.7 Focus Visible (AA)** and **2.4.13 Focus Appearance (AAA)** — `overflow: hidden` on the tile clips an inset focus ring. Use `outline-offset: 2px` with the outline on the tile (not the inner link), or drop `overflow: hidden` for interactive tiles and clip the media instead.
- **2.4.11 Focus Not Obscured (Minimum) (AA, new in 2.2)** — sticky headers over a tall bento section will hide the focused tile. Add `scroll-margin-top` equal to header height plus 8px on every tile.
- **2.5.8 Target Size (Minimum) (AA, new in 2.2)** — the tiles are huge, but the small "Learn more →" chips, tag pills and icon buttons inside them frequently are not. Every interactive element inside a tile needs a **24×24 CSS px** minimum hit area.
- **1.4.10 Reflow (AA)** — at 320 CSS px width the grid must be one column with no horizontal scroll. A `grid-template-columns: repeat(4, 1fr)` left unchanged at mobile produces 70px-wide tiles and overflow.
- **1.4.4 Resize Text (AA)** — fixed `grid-auto-rows: 180px` clips content at 200% text zoom. Switch to `grid-auto-rows: minmax(180px, auto)` so tiles can grow.

**Contrast math you can reuse.**

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `#1d1d1f` | `#f5f5f7` | 15.46:1 | pass AAA |
| `#6e6e73` | `#f5f5f7` | 4.66:1 | pass AA normal text, fail AAA |
| `#f5f5f7` | `#161617` | 16.61:1 | pass AAA |
| `#a1a1a6` | `#161617` | 7.03:1 | pass AAA normal text |
| `#0071e3` | `#f5f5f7` | 4.31:1 | pass 1.4.11 (3:1) as a focus ring; fails 4.5:1 as body text |
| `#0a84ff` | `#161617` | 4.96:1 | pass AA text and 1.4.11 |
| `rgba(0,0,0,0.06)` border | `#f5f5f7` | 1.14:1 | decorative only, fails 1.4.11 for controls |
| `#ffffff` | `rgba(0,0,0,0.55)` over white imagery | 4.76:1 | pass AA — this is the minimum viable scrim |
| `#ffffff` | `rgba(0,0,0,0.72)` over white imagery | 9.23:1 | comfortable margin, use for headlines |

The scrim numbers are worst case: they assume the photograph under the scrim is pure white. That is the only assumption that is safe with user-supplied or CMS-supplied imagery.

**DOM order strategy.** Author the HTML in the order the content should be *read*, then place tiles with `grid-template-areas` or explicit `grid-column`/`grid-row`. Reserve `grid-auto-flow: dense` for grids where every tile is decorative. On Chromium 137+ (stable 27 May 2025) you can opt into `reading-flow: grid-rows` to make focus and the a11y tree follow visual rows; it is **not Baseline** (no Safari or Firefox implementation as of August 2026), so treat it as progressive enhancement layered on a DOM order that is already correct.

**Semantics.** A bento section is a list of peers: `<ul role="list">` with `<li>` tiles, wrapped in a `<section aria-labelledby>`. Each tile gets one `<h3>` under the section's `<h2>`. Do not use `role="grid"` — that is for interactive tabular widgets and it imposes a two-dimensional keyboard model users will not expect on a marketing page. Decorative cover images take `alt=""`; screenshots that carry information need real alt text or a visible caption.

**One link per tile.** The full-tile hit area should come from a single `<a>` with an `::after { position: absolute; inset: 0 }` pseudo-element. Nesting the entire card inside an `<a>` produces a link whose accessible name is the whole tile's text. Putting two links in a tile with a full-tile overlay makes the second link unclickable.

**Forced colors / Windows High Contrast.** Under `forced-colors: active`, `background-color` and `box-shadow` are stripped, so tiles dissolve into the page and the composition disappears. Add an explicit `border: 1px solid CanvasText` so the compartments survive, hide the scrim (`display: none`) because the underlying image is not forced-color-adjusted, and use `Highlight` for focus rings. Test with `forced-color-adjust: none` only on brand-critical logos.

**Reduce transparency.** Bento itself is opaque, so `prefers-reduced-transparency` matters only when you combine it with glass tiles ([./03-glassmorphism.md](./03-glassmorphism.md) / [./08-liquid-glass.md](./08-liquid-glass.md)). In that case fall back to `--bento-tile-bg` at full opacity.

**Pass/fail checklist.**

- [ ] Tab through the whole section: focus moves left-to-right, top-to-bottom, matching what you see. No jumps.
- [ ] `grid-auto-flow: dense` is absent, or the grid contains zero focusable elements, or `reading-flow` is applied with a correct DOM fallback.
- [ ] Every tile has exactly one link or zero links. Never two.
- [ ] Focus ring is fully visible and not clipped by `overflow: hidden`; 3px, ≥ 3:1 against the tile, `outline-offset: 2px`.
- [ ] Every tile has `scroll-margin-top` ≥ sticky header height + 8px.
- [ ] All text over imagery sits above a scrim of at least `rgba(0,0,0,0.55)`, verified against the lightest region of the image.
- [ ] Every interactive element inside a tile is ≥ 24×24 CSS px.
- [ ] Chips, pills and icon buttons take their `min-height`/`min-width` from `--bento-target-min` rather than a literal, and the computed value is 24px with a mouse and 44px under `@media (pointer: coarse)`.
- [ ] At 320px viewport width: one column, no horizontal scroll, no clipped text.
- [ ] At 200% text zoom: `grid-auto-rows` is `minmax(..., auto)` and no tile clips its content.
- [ ] Heading levels are sequential: section `<h2>`, tiles `<h3>`. No tile uses `<h2>`.
- [ ] Decorative images have `alt=""`; informative screenshots have descriptive alt or a caption.
- [ ] `prefers-reduced-motion: reduce` disables reveal animation, hover lift, media scale, and swaps tile video for a poster.
- [ ] `forced-colors: active` keeps every tile boundary visible via `CanvasText`.
- [ ] Screen reader announces the section heading, then a list of N items, then each tile's heading and body once.

## 8. Performance

Bento is one of the cheapest visual styles in this set. CSS Grid layout with explicit spans is a single layout pass; there is no blur, no filter, no compositing trickery. `grid-auto-flow: dense` costs marginally more than sparse packing because the algorithm rescans earlier tracks for holes, but on grids of 6-20 items the difference is unmeasurable. **The style itself is not your performance problem. The contents of the tiles are.**

**Where the cost actually is.**

| Source | Typical cost | Mitigation |
|---|---|---|
| Per-tile product screenshots | 80-400KB each × 8 tiles | AVIF/WebP, `srcset` at 1×/2×, cap total section at **600KB** |
| Autoplaying tile videos | 1-6MB each | **One per section, max 2MB**, `muted playsinline preload="metadata"`, `poster` required, pause off-screen |
| Per-tile `backdrop-filter` | one backdrop snapshot **per tile** | Never. Apply glass to the section, not to nine children |
| Per-tile canvas/WebGL | one context per tile, GPU memory | One shared canvas behind the grid, or static frames |
| Layout shift from unsized media | CLS 0.1-0.3 | `width`/`height` attributes or `aspect-ratio` on every image |
| Reveal animation on 12 tiles | 12 concurrent compositor layers | Only `opacity` + `transform`; remove `will-change` after the animation |

**Budgets to hold yourself to** for a single above-the-fold bento section:

- Total transferred bytes: **≤ 600KB** (images + video posters + fonts already counted elsewhere).
- Largest tile image: **≤ 200KB** AVIF at 2× for a 720×420 slot.
- CLS contribution: **≤ 0.02**. Achieved by fixed `grid-auto-rows` plus intrinsic sizing on all media.
- Main-thread work for the reveal: **≤ 4ms/frame** on a mid-tier Android (Moto G-class). Transform + opacity only keeps you there.
- Style recalc on hover: scoped to one tile. If hovering a tile invalidates the whole grid you have a `:has()` selector on a shared ancestor — move it down.

**Compositing.** Tiles are ordinary painted boxes. They get their own compositor layer only when you animate `transform`/`opacity` or set `will-change`. Promoting 12 tiles permanently costs GPU memory roughly equal to their pixel area × 4 bytes: a 12-tile grid at 1280×720 total is about **3.7MB** of layer memory, which is fine on desktop and noticeable on a 2GB Android device. Set `will-change: transform` immediately before an animation and remove it on `animationend`.

**Below-the-fold tiles** benefit from containment:

```css
.bento__tile {
  contain: layout paint style;
}
.bento__grid--below-fold .bento__tile {
  content-visibility: auto;
  contain-intrinsic-size: auto 180px;   /* prevents scrollbar jumping */
}
```

`content-visibility: auto` skips rendering work for off-screen tiles entirely; the `contain-intrinsic-size` value must match your row unit or the scrollbar will jitter.

**Low-end and mobile notes.** On mobile the grid collapses to one column, which means every tile is now full-width and every screenshot is being downloaded at a size it will never display at. Use `sizes="(max-width: 767px) 100vw, 50vw"` on all tile images; skipping this is the single most common bento performance bug. Also drop `grid-auto-rows` to `auto` on mobile so tiles are content-height rather than 180px multiples — fixed rows on a phone produce either empty space or clipping.

**Cheaper fallbacks.** If your budget will not support screenshots in every tile: use a two-tone flat illustration or a large numeral. A stat tile costs zero bytes beyond text and, per the eye-tracking figures cited above, competes well with imagery for attention. A bento built entirely from type and colour renders in a single paint and is completely legitimate — see [./05-minimalism.md](./05-minimalism.md).

## 9. When To Use / When Not To

**Use it when:**

- You have **4-9 parallel, non-sequential features** to communicate and no natural ordering between them. This is the pattern's home ground and roughly 70% of real-world usage is exactly this: a SaaS marketing feature section.
- You need an **overview/at-a-glance dashboard** — status, metrics, recent activity, quick actions — where the user scans rather than reads. Bento's size-as-importance encoding does real work here.
- The content is genuinely **heterogeneous in media type**: a chart, a screenshot, a quote, a number, a map. The uniform frame is what makes mixing them look intentional.
- You are building a **personal or studio portfolio index** where each tile is a distinct project and there is no ranking.
- You need a **product spec sheet** that photographs well for social sharing. Apple's original use case, and still the best one.
- You are building **widget or module galleries** — settings hubs, integration directories, app launchers.
- You want density without noise: a bento communicates 6-9 discrete benefits in roughly the vertical space a three-across feature row uses for three.

**Do not use it when:**

- The content is **sequential**. Onboarding, checkout, a tutorial, a pricing comparison, a changelog. Anything with an order should be a list, a stepper or a table. Bento actively fights sequence because it invites the eye to enter at the largest tile.
- The content is **long-form**. Documentation, articles, legal text, case studies. Bento forces brevity; long text truncated to fit a compartment loses its argument.
- The items are **strictly comparable**. Pricing tiers, plan features, product variants. Comparison demands equal visual weight; the moment one tile is bigger, users read it as "recommended" whether you meant that or not.
- You only have **three things to say**. A three-tile bento is a card row wearing a costume.
- Every tile would be **the same size**. Then you have a card grid, and you should call it that and drop the ceremony.
- The tiles are **data-driven and variable in count**. A bento composition is hand-tuned; a CMS returning 4 items one day and 11 the next will produce a broken composition unless you build an explicit layout algorithm per count.
- Your audience is **enterprise procurement or regulated industries** reading for compliance detail. Density reads as marketing evasion there.
- **Differentiation is the goal.** As of 2026 a bento section signals "competent, current, and interchangeable with our competitors". If your brief is to be memorable, bento is the floor, not the ceiling.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Give the grid exactly one dominant tile occupying 30-40% of the section area | Make three tiles "hero-sized" — nothing dominates and the hierarchy collapses |
| Keep the gap identical everywhere: `16px` desktop, `12px` mobile | Vary gaps between tiles to "balance" the composition — that turns bento into a collage |
| Limit yourself to five span sizes (`hero`, `wide`, `tall`, `unit`, `strip`) | Invent a new span for every tile; nine unique spans reads as a bug |
| Author DOM order to match reading order, then place with `grid-template-areas` | Reach for `grid-auto-flow: dense` on a grid containing links or buttons |
| Use `grid-auto-rows: minmax(180px, auto)` so tiles grow under text zoom | Hard-code `grid-auto-rows: 180px` and clip content at 200% zoom |
| Put one idea, one heading and at most one CTA in each tile | Cram two features into a hero tile because it "has room" |
| Use `border-radius: 24px` on every tile and `inner = outer − padding` on nested media | Mix 8px, 16px and 24px radii across tiles in the same grid |
| Strengthen the border to `rgba(0,0,0,0.45)` when the tile is clickable | Rely on a `0.06` alpha hairline (1.14:1) to signal interactivity, or assume `0.18` clears 3:1 — it measures 1.52:1 |
| Collapse to one full-width column below 768px | Keep four columns on mobile and ship 70px-wide tiles |
| Give text over imagery a scrim of at least `rgba(0,0,0,0.55)` | Set white text directly on a photograph and hope |
| Ship a poster frame and pause off-screen video; one autoplaying loop per section max | Autoplay six looping videos, one per tile, on a phone |
| Add `sizes="(max-width: 767px) 100vw, 50vw"` to every tile image | Serve the desktop 2× screenshot to a 390px phone |
| Reveal tiles with `opacity` + `translateY`, staggered 40ms, capped at 400ms total | Animate `grid-template-columns`, `width`, `height` or `gap` |
| Apply glass or blur to the grid container as one surface | Give nine child tiles `backdrop-filter` and nine backdrop snapshots |
| Keep an empty tile visible with a one-line explanation | Remove a tile when its data is missing and let the composition reflow |
| Use `<ul role="list">` + `<li>` + one `<h3>` per tile | Use `role="grid"`, or nest a whole card inside a single `<a>` |

## 11. In The Wild (2024-2026)

Only entries I could verify in this research pass are listed.

- **Apple (apple.com product pages, 2022-present).** The iPhone 14 page (September 2022) is the widely cited first mainstream web deployment; the pattern has recurred on Apple silicon and iPhone feature sections since. Apple's keynote decks — WWDC 2022 (M2, 6 June 2022) onward — use the same compartmented spec grid, with tiles that are mostly a single number plus a label.
- **Linear.** Dark bento feature grid built from real product screenshots rather than icons or illustrations, with UI cropped by the tile edge. Widely treated as the reference implementation for developer-tool marketing and the template most 2024-2026 SaaS sites copy.
- **Vercel.** The 2023 homepage refresh placed a bento block below the hero animation — edge functions, ISR, image optimisation, observability, preview deployments — each tile carrying a live mini-graphic.
- **Framer.** Uses bento blocks for capability rollups and customer logos, typically with one cell carrying an embedded animation as a live demonstration of the motion editor.
- **Raycast, Notion, Stripe, Cursor.** All ship bento or bento-derived feature sections on their marketing pages and appear repeatedly in 2025-2026 roundups and in the bentogrids.com gallery.
- **Attio.** Featured on bentogrids.com as a shipped product bento; a CRM feature grid.
- **Huly.** Features section built as eight distinct collaboration features in individual compartments — a clear example of the "too many equal tiles" edge, useful as a counter-reference.
- **Payhawk.** Landing hero combining screenshots, integration logos and feature highlights in a single bento composition.
- **Microsoft Windows 8 / Windows Phone Live Tiles (2010-2012).** The structural ancestor: variable-span tiles (small/medium/wide/large) on a fixed gutter, square corners, flat fills.
- **Tailwind Plus (Tailwind Labs), UI Blocks → Marketing → Sections → Bento Grids.** Official first-party blocks: *Three column bento grid*, *Two row bento grid*, and *Two row bento grid with three column second row*, each in light and dark. Code is behind the Tailwind Plus paid tier; previews are public.
- **Magic UI, `bento-grid` component.** `BentoGrid` + `BentoCard`, installed with `pnpm dlx shadcn@latest add @magicui/bento-grid`. `BentoCard` props: `name`, `className`, `background`, `Icon`, `description`, `href`, `cta`. Layout is driven by per-card Tailwind classes such as `"col-span-3 lg:col-span-1"` and `"lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3"`, with `lg:grid-rows-3` on the container.
- **Aceternity UI.** Ships a dedicated Bento Grid category and component built on React + Tailwind + Motion.
- **shadcn ecosystem blocks.** Shadcn Studio and Launch UI both publish copy-paste bento grid blocks; BentoTailwind exists as a dedicated React/Next.js bento component product.
- **bentogrids.com.** Curated gallery of bento designs across graphic, web and animation categories, filterable by light/dark, with source links; features work from Apple, Linear, Raycast, Notion and others. The de facto reference library for the pattern since 2023.
- **Lapa Ninja, "Bento Grid" category.** Roughly 75 curated bento landing pages, a useful volume indicator for how normalised the pattern became.
- **Creative Boom, April 2026.** Not a product, but the clearest dated evidence of the pattern's current standing: bento grids ranked #9 in "10 trends that creatives are so over in 2026", with practitioners admitting they keep shipping them anyway.

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui. Styles named without a link have no file in this set.

- **[./05-minimalism.md](./05-minimalism.md) — the parent.** Bento *is* a Swiss modular grid with a 24px radius. Everything minimalism says about type scale, restraint and whitespace applies directly. The combination is the default state of 2024-2026 SaaS design and it is boring in the good way: extremely legible, zero risk, zero memorability.
- **[./03-glassmorphism.md](./03-glassmorphism.md) — works, with one hard rule.** Frosted tiles over a shared gradient look excellent. Apply the blur to the **grid container** as a single surface with opaque internal dividers, never to each tile. Nine `backdrop-filter` children means nine backdrop snapshots per frame and it will tank a mid-tier phone. Also check every tile's text contrast independently, because the gradient underneath varies.
- **[./08-liquid-glass.md](./08-liquid-glass.md) — same constraint, higher cost.** Liquid Glass is a displacement map; running it per tile is worse than glassmorphism per tile. Use it for the section's floating chrome (a sticky filter bar above the grid) and keep the tiles opaque.
- **[./07-brutalism.md](./07-brutalism.md) — a genuinely good clash.** Neubrutalist bento — 0px radius, 3px solid black borders, flat `4px 4px 0 #000` offset shadows, saturated fills — is one of the few ways to make bento feel authored in 2026. The grid discipline keeps brutalism from becoming chaos; brutalism keeps bento from becoming wallpaper. Portfolios and indie products only.
- **[./06-maximalism.md](./06-maximalism.md) — the surprising fit.** Bento is the strongest container for maximalist content because the fixed gutter and uniform radius supply the structure that maximalism refuses to supply itself. Load the tiles with clashing colour, dense collage and heavy type; keep the grid rigid. This is the "editorial bento" look.
- **[./04-claymorphism.md](./04-claymorphism.md) — works at small scale.** Puffy, high-radius tiles with soft dual shadows read as friendly and suit consumer and education products. It stops working past about six tiles: the shadow bloom eats the gutter and the compartments stop reading as compartments. Increase the gap to 24px if you go this way.
- **[./02-neumorphism.md](./02-neumorphism.md) — clashes.** Neumorphism's premise is that the tile is the same colour as the page, defined only by extrusion shadows. Bento's premise is compartments separated by a visible gutter. Combining them gives you a grid of near-invisible boundaries with a 1.1:1 contrast problem in every direction. Do not.
- **[./01-skeuomorphism.md](./01-skeuomorphism.md) — only as tile content.** A textured, materially-rendered object *inside* a flat bento tile is a strong contrast play (this is essentially how Apple photographs hardware inside spec tiles). Making the tile chrome itself skeuomorphic — stitched leather compartments — is a 2011 joke.
- **[./10-spatial-ui.md](./10-spatial-ui.md) — works, on one condition: the depth must live on a shared canvas behind the grid.** Bento reads as a single composition because every tile sits on one plane; transforming individual tiles in 3D breaks exactly that, and you get a scatter of unrelated cards instead of a grid. Put the perspective on the grid *container*, give the whole plane a single z-position, and let parallax happen behind it. Doc 10's rule — one stage, one perspective origin, one depth ladder — is what makes the combination survivable, and its §12 states the same condition from the other side.
- **Aurora / mesh gradients — no doc in this set.** The best cheap upgrade to a plain bento: a single slow low-frequency gradient behind the whole grid, tiles at 92-100% opacity on top. One shared background, no per-tile cost. Keep the gradient's luminance range within about 25 points so tile text contrast stays valid everywhere on the canvas.
- **Retro / Y2K — no doc in this set.** Bento is a straightforward pastiche vehicle for Windows 8 Live Tiles: square corners, saturated flat fills, tiles that flip. Cheap to build, instantly dated on purpose, and it inherits all of the Live Tile motion problems — honour `prefers-reduced-motion` or the flipping becomes a 2.2.2 failure.

## 13. Plugin Spec (draft)

**Skill name:** `bento-grid-ui`

**Description (triggering):** "Use when the user wants to build, convert, or refine a bento grid — an asymmetric modular tile layout — for a feature section, marketing page, dashboard, portfolio index or overview screen. Triggers on 'bento', 'bento box layout', 'Apple-style feature grid', 'tile grid', 'modular card grid', 'asymmetric grid', or a request to turn a list of features/cards into a varied-span grid."

**What the skill does.**

1. **Audits the existing markup.** Finds the repeating card list or feature array, counts items, and classifies each by content type (stat, screenshot, quote, icon+text, chart, CTA).
2. **Assigns spans.** Maps content types onto the five-span vocabulary using content weight: the item with the longest body or the primary claim becomes `hero`; stats become `unit`; vertical screenshots become `tall`; horizontal ones become `wide`; CTAs become `strip`. Refuses to produce more than five distinct spans.
3. **Emits the grid.** Generates a `grid-template-areas` layout (deterministic) or explicit spans, with tablet and mobile collapse maps. Never emits `grid-auto-flow: dense` unless the grid is verified interaction-free, and then only with a `@supports (reading-flow: grid-rows)` guard.
4. **Normalises the frame.** Forces one radius, one gap, one border treatment, one shadow across all tiles; rewrites nested media radii to `outer − padding`.
5. **Rewrites tile internals.** Enforces one heading per tile, moves any second CTA out, applies the eyebrow/title/body/stat type scale, adds `container-type: inline-size` and container-query interior reflow.
6. **Hardens media.** Adds `width`/`height` or `aspect-ratio`, `loading="lazy"`, `decoding="async"`, `sizes`, and a scrim behind any text over an image. Converts multiple autoplaying videos down to one with posters.
7. **Wires accessibility.** Converts the container to `<ul role="list">`, reorders DOM to match intended reading order, adds a single full-tile link with `::after` overlay, `scroll-margin-top`, focus ring, `forced-colors` block, `prefers-reduced-motion` block.
8. **Emits a token layer** and a diff-style audit report.

**Inputs required from the user.**

| Input | Values | Default |
|---|---|---|
| framework | `vanilla-css`, `tailwind-v4`, `react-ts`, `vue`, `svelte`, `swiftui`, `compose` | detect from repo |
| base palette | page bg, tile bg, fg, muted fg, accent (hex) | Apple-neutral set from §4 |
| density | `airy` (gap 24, row 220), `standard` (gap 16, row 180), `compact` (gap 12, row 150) | `standard` |
| intensity | 0-100 | 45 |
| tile count | integer, or "derive from content" | derive |
| dark mode | `media`, `class`, `none` | `media` |
| interactive tiles | boolean | false |

**Outputs.**

1. `tokens/bento.css` — the `:root` block from §4 with the user's palette substituted, plus both dark-mode override blocks.
2. `components/` — `BentoGrid` + `BentoTile` in the requested framework, with the closed span union typed.
3. A CSS layer `@layer bento { … }` containing grid, tile, responsive collapse, focus, forced-colors and reduced-motion rules, so it can be overridden by app styles without specificity fights.
4. `bento-audit.md` — per-tile table: assigned span, content type, computed text/background contrast ratio, image weight, alt-text status, link count, plus a pass/fail line for each checklist item in §7.
5. A one-column mobile preview snippet and a 320px-width screenshot instruction so the collapse can be eyeballed.

**Self-run validation checklist.**

- [ ] Compute WCAG contrast for every text/background pair actually produced; fail the run below 4.5:1 for body text and 3:1 for any border that signals interactivity.
- [ ] Assert exactly one `hero`-span tile per grid.
- [ ] Assert ≤ 5 distinct span values.
- [ ] Assert zero focusable elements inside any grid that sets `grid-auto-flow: dense` without `reading-flow`.
- [ ] Assert every tile contains 0 or 1 links, and exactly one heading at the correct level.
- [ ] Assert every `<img>` and `<video>` has intrinsic dimensions or `aspect-ratio`.
- [ ] Assert `sizes` is present on every responsive image.
- [ ] Assert at most one autoplaying video in the section and that it has a `poster`.
- [ ] Assert a `@media (prefers-reduced-motion: reduce)` block exists and neutralises transform, animation and video.
- [ ] Assert a `@media (forced-colors: active)` block sets a `CanvasText` border on tiles.
- [ ] Assert `grid-auto-rows` uses `minmax(x, auto)` and not a bare fixed value.
- [ ] Assert single-column collapse below 768px and no horizontal overflow at 320px.
- [ ] Assert no `backdrop-filter` on more than one element in the section.
- [ ] Assert no transition or animation targets `width`, `height`, `gap`, `grid-template-*` or `border-radius`.
- [ ] Report total image bytes; warn above 600KB, fail above 1.2MB.

**Intensity knobs.**

| Knob | Min | Max | Effect at 0 / at 100 |
|---|---|---|---|
| `spanVariance` | 1.0 | 3.0 | Ratio between largest and smallest tile area. 1.0 = uniform card grid; 3.0 = a 2×2 hero beside 1×1 units. Default 2.0. |
| `radius` | 0px | 32px | 0px = brutalist/Live Tile; 24px = Apple default; 32px = clay-adjacent. Default 24px. |
| `surfaceDelta` | 0 | 24 | Luminance points between page and tile background. 0 = tiles defined by gap alone; 24 = strongly separated cards. Default 8. |
| `mediaBleed` | 0% | 100% | How far tile media runs past the padding box. 0% = fully inset with concentric radius; 100% = full-bleed cover. Default 40%. |
| `motion` | 0 | 100 | 0 = no reveal, no hover lift; 50 = 320ms reveal + `-2px` lift; 100 = 400ms reveal, `-4px` lift, 1.03 media scale, per-tile parallax. Hard-clamped to 0 under `prefers-reduced-motion`. Default 45. |

**Anti-patterns the skill must refuse to generate.**

- `grid-auto-flow: dense` on any grid containing a link, button or form control, without a `reading-flow` guard and a correct DOM order underneath.
- `backdrop-filter` on more than one element inside the section.
- More than one autoplaying video per bento section, or any autoplaying video without a `poster`.
- Text placed directly over a photograph with no scrim, or a scrim weaker than `rgba(0,0,0,0.55)`.
- A card nested entirely inside a single `<a>`, or two links sharing one tile with a full-tile overlay.
- `role="grid"` on a marketing bento section.
- Transitions or keyframes on `width`, `height`, `gap`, `grid-template-columns`, `grid-template-rows` or `border-radius`.
- Uniform spans presented as a bento (this is a card grid; the skill should say so and offer the simpler layout).
- More than nine tiles in a single section without a hierarchy break (a sub-heading or a second grid).
- Fixed `grid-auto-rows` with `overflow: hidden` on tiles containing text.
- Removing a tile when its data is empty; the skill must emit an explicit empty state that preserves the span.
- Multiple radii, multiple gap values, or multiple border treatments within one grid.

## 14. References

1. *reading-flow — CSS* — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/reading-flow — MDN Web Docs / Mozilla — accessed August 2026 — **[primary]** (values `normal`, `flex-visual`, `flex-flow`, `grid-columns`, `grid-rows`, `grid-order`, `source-order`; "limited availability", not Baseline)
2. *Grid layout and accessibility* — https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Accessibility — MDN Web Docs / Mozilla — accessed August 2026 — **[primary]** (quotes the CSS Grid spec's "Reordering and Accessibility" section: reordering via `order`/grid placement is non-conforming for logical reordering)
3. *Reading flow ships in Chrome 137* — https://rachelandrew.co.uk/archives/2025/05/02/reading-flow-ships-in-chrome-137/ — Rachel Andrew — 2 May 2025 — **[primary]** (Chrome 137 stable 27 May 2025)
4. *Solving the CSS layout and source order disconnect* — https://developer.chrome.com/blog/reading-order — Chrome for Developers — (pre-ship proposal; property names later changed) — **[primary]**
5. *Tailwind CSS Bento Grids — Official Tailwind UI Components* — https://tailwindcss.com/plus/ui-blocks/marketing/sections/bento-grids — Tailwind Labs — accessed August 2026 — **[primary]** (three-column, two-row, and two-row-with-three-column-second-row blocks, light and dark; code behind Tailwind Plus)
6. *Bento Grid — Magic UI* — https://magicui.design/docs/components/bento-grid — Magic UI — accessed August 2026 — **[primary]** (`BentoGrid`/`BentoCard` API, `pnpm dlx shadcn@latest add @magicui/bento-grid`, verbatim `col-span-3 lg:col-span-1` style classes)
7. *Bento grid layout with CSS grid and container queries* — https://iamsteve.me/blog/bento-layout-css-grid — Steve McKinney — accessed August 2026 — **[secondary]** (12-column `repeat(12, minmax(0,1fr))`, `gap: 1rem`, `grid-auto-rows: 1fr` at ≥1280px, span-6/span-3 vocabulary, `@container/section` interior reflow)
8. *Bento Grid: CSS and Tailwind Recipe, Real Examples and Limits* — https://www.superdesign.dev/styles/bento-grid — Superdesign — accessed August 2026 — **[secondary]** (`repeat(4, minmax(0,1fr))`, `grid-auto-rows: 180px`, `gap: 16px`, `border-radius: 24px`, `#f5f5f7` / `#161617` + `rgba(255,255,255,0.08)`, `rgba(0,0,0,0.55)` scrim, focus-order and mobile-collapse failure modes)
9. *Designing Bento Grids That Actually Work: A 2026 Practical Guide* — https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide — SaaSFrame — 2026 — **[secondary]** (3-4/2/1 column collapse, 16-24px gutters, padding by tile size, 2.6× fixation on the largest tile, Huly and Payhawk examples)
10. *10 trends that creatives are so over in 2026* — https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/ — Tom May, Creative Boom — 21 April 2026 — **[secondary]** (bento grids at #9; "Bento boxes… but can't stop using them")
11. *Apple's bento grid playbook, four keynote decks compared* — https://www.deck.gallery/blog/apple-bento-grid-decks-roundup/ — Deck.gallery — accessed August 2026 — **[secondary]** (WWDC 2022 M2 spec slides; iPhone 14 page, September 2022, as the mainstream web breakout)
12. *Bento Grids* — https://bentogrids.com/ — Bento Grids (curated gallery) — launched 2023, ongoing — **[primary]** (reference collection; Apple, Linear, Raycast, Notion, Attio)
13. *Best Free Bento Grid Components* — https://ui.aceternity.com/categories/bento-grid — Aceternity UI — accessed August 2026 — **[primary]**
14. *Shadcn Bento Grid* — https://shadcnstudio.com/blocks/bento-grid/bento-grid — Shadcn Studio — accessed August 2026 — **[primary]**
15. *How to Use Bento Grids Design in Your Web Projects* — https://www.freecodecamp.org/news/bento-grids-in-web-design/ — freeCodeCamp — **[secondary]** (bento-box origin, CSS Grid technique)
16. *Bento Grid Landing Pages: 75 Examples & Inspiration* — https://www.lapa.ninja/category/bento-grid/ — Lapa Ninja — accessed August 2026 — **[secondary]** (volume indicator for adoption)
17. *SwiftUI Grid, LazyVGrid, LazyHGrid Explained with Code Examples* — https://www.avanderlee.com/swiftui/grid-lazyvgrid-lazyhgrid-gridviews/ — Antoine van der Lee — accessed August 2026 — **[secondary]** (`.gridCellColumns(_:)` provides column spanning; no row-span equivalent)
18. *LazyVerticalGrid & StaggeredGrid: Compose Grid Layout Guide* — https://dev.to/myougatheaxo/lazyverticalgrid-staggeredgrid-compose-grid-layout-guide-419l — DEV Community — accessed August 2026 — **[secondary]** (`GridItemSpan(maxLineSpan)` for column spanning in `LazyVerticalGrid`)
19. *Building a Bento Grid Layout with Modern CSS Grid* — https://www.wearedevelopers.com/en/magazine/682/building-a-bento-grid-layout-with-modern-css-grid — WeAreDevelopers — accessed August 2026 — **[secondary]** (auto-placement + `grid-auto-flow` vs explicit `grid-column`/`grid-row` placement, with companion repo)
20. *CSS Container Queries + Subgrid: The Layout Trilogy That's Now in Every Browser* — https://www.sitepoint.com/css-container-queries-subgrid-the-layout-trilogy-thats-now-in-every-browser/ — SitePoint — accessed August 2026 — **[secondary]** (container queries Chrome 105+/Firefox 110+/Safari 16+; subgrid Chrome 117+/Firefox 71+/Safari 16+)
