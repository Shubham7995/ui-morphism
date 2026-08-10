# Bento grid recipes

Condensed from `docs/09-bento-grid.md` §5 (Implementation Recipes), with the corrections §7 and
§13 require applied inline and marked. Read this before emitting anything; do not reconstruct a
rule from memory.

**Three corrections this file applies to §5's code, and why.**

1. `grid-auto-rows` is `minmax(var(--bento-row), auto)`, not the bare `var(--bento-row)` in the
   §5 snippet. §7 (SC 1.4.4) and the §13 self-run checklist both require the growable form: a
   fixed row unit clips tile content at 200% text zoom.
2. Every tile carries `scroll-margin-top`. §7 (SC 2.4.11, new in WCAG 2.2): a sticky header over
   a tall bento section hides the focused tile.
3. The reveal animation is not on `.bento__tile` unconditionally. It is opt-in through
   `[data-bento-reveal]` so a grid can be emitted with `motion: 0`, and the whole block sits
   behind `@media (prefers-reduced-motion: no-preference)` rather than being undone afterwards.

**Two authoring changes, stated so nobody thinks the token inventory drifted.**

- Spans are carried by `data-bento-span` rather than §5's `.bento__tile--hero` modifier classes,
  so the vanilla, React, Vue and Svelte outputs share exactly one selector set and the planner
  can emit one attribute per tile. The five span values are unchanged.
- Three custom properties below are **not** design tokens and are not in §4's 42-property
  inventory. They are per-tile authoring hooks that carry a resolved knob value, each with a
  fallback to a real token: `--bento-bleed` (the `mediaBleed` knob against this tile's padding,
  falling back to `--bento-pad-lg`), `--bento-media-scale` (the `motion` knob's media scale,
  falling back to `1`) and `--bento-scroll-margin` (the project's sticky-header height plus 8px,
  falling back to `88px`, which §7 requires and no token can know).

---

## 1. The emitted stylesheet — `styles/bento.layer.css`

Everything goes in one cascade layer so app styles can override it without a specificity fight.

```css
@layer bento {
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
    grid-auto-rows: minmax(var(--bento-row), auto);
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
    contain: layout paint style;
    scroll-margin-top: var(--bento-scroll-margin, 88px);
  }

  .bento__tile[data-bento-span="hero"]  { grid-column: span 6; grid-row: span 2; padding: var(--bento-pad-lg); }
  .bento__tile[data-bento-span="wide"]  { grid-column: span 6; grid-row: span 1; padding: var(--bento-pad-md); }
  .bento__tile[data-bento-span="tall"]  { grid-column: span 3; grid-row: span 2; padding: var(--bento-pad-md); }
  .bento__tile[data-bento-span="unit"]  { grid-column: span 3; grid-row: span 1; padding: var(--bento-pad-sm); }
  .bento__tile[data-bento-span="strip"] { grid-column: 1 / -1;  grid-row: span 1; padding: var(--bento-pad-md); }

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
  .bento__tile[data-bento-span="hero"] .bento__title {
    font: var(--bento-hero);
    letter-spacing: var(--bento-hero-tracking);
  }
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

  /* Chips, pills and icon buttons: the only elements in a tile that can fall
     under the SC 2.5.8 floor. They size from the token, never from a literal. */
  .bento__chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--bento-target-min);
    min-width: var(--bento-target-min);
    padding-inline: 12px;
    border-radius: var(--bento-radius-chip);
    color: var(--bento-accent);
    text-decoration: none;
  }

  /* ---------- media ---------- */
  .bento__media {
    display: block;
    width: 100%;
    height: auto;
    margin-top: var(--bento-pad-stack);
    border-radius: var(--bento-radius-media);
  }
  /* Bleed: the screenshot runs off the bottom-right of the tile. --bento-bleed
     is the mediaBleed knob resolved against this tile's padding token. */
  .bento__media--bleed {
    margin: auto calc(var(--bento-bleed, var(--bento-pad-lg)) * -1)
                 calc(var(--bento-bleed, var(--bento-pad-lg)) * -1) auto;
    width: calc(100% + var(--bento-bleed, var(--bento-pad-lg)));
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
  .bento__tile--onImage > :not(.bento__cover):not(.bento__scrim) {
    position: relative;
    z-index: 2;
  }
  .bento__title--onImage { color: #fff; margin-top: auto; }

  /* ---------- container-query interior ---------- */
  @container tile (min-width: 420px) {
    .bento__tile[data-bento-span="unit"] {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }
  @container tile (max-width: 260px) {
    .bento__body { display: none; }
  }

  /* ---------- responsive collapse ---------- */
  @media (max-width: 1279px) {
    .bento__grid { --bento-cols: 6; }
    .bento__tile[data-bento-span="hero"],
    .bento__tile[data-bento-span="wide"] { grid-column: span 6; }
    .bento__tile[data-bento-span="tall"],
    .bento__tile[data-bento-span="unit"] { grid-column: span 3; }
  }

  @media (max-width: 767px) {
    .bento__grid {
      --bento-cols: 1;
      gap: 12px;                      /* vertical rhythm, not a grid gutter */
      grid-auto-rows: auto;           /* let content set the height */
    }
    .bento__tile,
    .bento__tile[data-bento-span] {
      grid-column: 1 / -1;
      grid-row: auto;
      min-height: 200px;
      padding: var(--bento-pad-sm);
    }
    .bento__tile[data-bento-span="hero"] { min-height: 320px; }
    .bento__media--bleed {
      margin: auto calc(var(--bento-pad-sm) * -1) calc(var(--bento-pad-sm) * -1) auto;
      width: calc(100% + var(--bento-pad-sm));
    }
  }

  /* ---------- interactive tiles ---------- */
  .bento__tile:has(a),
  .bento__tile:has(button) { border: var(--bento-border-interactive); }

  .bento__tile a::after {             /* full-tile hit area, one link per tile */
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
  }

  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    .bento__tile:has(a),
    .bento__tile:has(button) {
      transition: transform var(--bento-dur-hover) var(--bento-ease),
                  box-shadow var(--bento-dur-hover) var(--bento-ease);
    }
    .bento__tile:has(a:hover),
    .bento__tile:has(button:hover) {
      transform: translateY(var(--bento-lift));
      box-shadow: var(--bento-shadow-hover);
    }
    .bento__tile:has(a:hover) .bento__media,
    .bento__tile:has(a:hover) .bento__cover {
      scale: var(--bento-media-scale, 1);
      transition: scale 400ms var(--bento-ease);
    }
    .bento__tile:has(a:active) {
      transform: translateY(0);
      transition-duration: var(--bento-dur-press);
    }
  }

  .bento__tile:has(a:focus-visible),
  .bento__tile:has(button:focus-visible) {
    outline: 3px solid var(--bento-focus);
    outline-offset: 2px;
  }

  /* ---------- states ---------- */
  .bento__tile[aria-disabled="true"] {
    filter: grayscale(1);
    opacity: 0.55;
    cursor: not-allowed;
  }
  /* An empty tile keeps its span and says why. Never remove it: a missing tile
     breaks the composition and shifts layout. */
  .bento__tile--empty { justify-content: center; color: var(--bento-fg-muted); }

  /* ---------- below the fold ---------- */
  .bento__grid--below-fold .bento__tile {
    content-visibility: auto;
    contain-intrinsic-size: auto var(--bento-row);
  }

  /* ---------- reveal ---------- */
  @media (prefers-reduced-motion: no-preference) {
    .bento__tile[data-bento-reveal] {
      animation: bento-in var(--bento-dur-reveal) var(--bento-ease) both;
      animation-timeline: view();
      animation-range: entry 0% cover 22%;
    }
  }

  /* ---------- accessibility ---------- */
  @media (prefers-reduced-motion: reduce) {
    .bento__tile,
    .bento__tile[data-bento-reveal],
    .bento__tile:has(a:hover) {
      animation: none;
      transition: none;
      transform: none;
      opacity: 1;
    }
    .bento__tile img,
    .bento__tile .bento__cover { scale: 1; }
    .bento__tile video { display: none; }   /* pair with a poster <img> */
  }

  @media (forced-colors: active) {
    .bento__tile { border: 1px solid CanvasText; box-shadow: none; }
    .bento__scrim { display: none; }        /* the image under it is not forced-color-adjusted */
    .bento__tile:has(a:focus-visible),
    .bento__tile:has(button:focus-visible) { outline: 3px solid Highlight; }
  }
}

@keyframes bento-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
```

## 2. Markup

A bento section is a list of peers: `<section aria-labelledby>` → `<h2>` → `<ul role="list">` →
`<li>` tiles, one `<h3>` each. Never `role="grid"` — that is for interactive tabular widgets and
it imposes a two-dimensional keyboard model nobody expects on a marketing page.

```html
<section class="bento" aria-labelledby="bento-heading">
  <h2 id="bento-heading" class="bento__heading">Everything in one place</h2>

  <ul class="bento__grid" role="list">
    <li class="bento__tile" data-bento-span="hero">
      <p class="bento__eyebrow">Performance</p>
      <h3 class="bento__title">Ships in 40&nbsp;milliseconds, everywhere.</h3>
      <p class="bento__body">Edge-rendered by default. No cold starts, no region picking.</p>
      <img class="bento__media bento__media--bleed" src="/img/perf.avif" alt=""
           width="720" height="420" loading="lazy" decoding="async"
           sizes="(max-width: 767px) 100vw, 50vw">
    </li>

    <li class="bento__tile" data-bento-span="unit">
      <p class="bento__eyebrow">Uptime</p>
      <p class="bento__stat">99.99<span class="bento__stat-unit">%</span></p>
    </li>

    <li class="bento__tile" data-bento-span="unit">
      <p class="bento__eyebrow">Regions</p>
      <p class="bento__stat">38</p>
    </li>

    <li class="bento__tile" data-bento-span="tall">
      <p class="bento__eyebrow">Observability</p>
      <h3 class="bento__title"><a href="/observability">Every request, traced.</a></h3>
      <img class="bento__media bento__media--bleed" src="/img/traces.avif" alt=""
           width="480" height="620" loading="lazy" decoding="async"
           sizes="(max-width: 767px) 100vw, 25vw">
    </li>

    <li class="bento__tile" data-bento-span="wide">
      <p class="bento__eyebrow">Integrations</p>
      <h3 class="bento__title">Connects to the stack you already run.</h3>
    </li>

    <li class="bento__tile bento__tile--onImage" data-bento-span="strip">
      <img class="bento__cover" src="/img/team.avif" alt="" width="1280" height="360"
           loading="lazy" decoding="async" sizes="100vw">
      <div class="bento__scrim"></div>
      <h3 class="bento__title bento__title--onImage">Built by the people who run it.</h3>
    </li>
  </ul>
</section>
```

Every image carries intrinsic `width`/`height`, `loading="lazy"`, `decoding="async"` and
`sizes`. Omitting `sizes` is the single most common bento performance bug: on mobile every tile
is full-width and the browser is otherwise told to fetch the desktop 2× screenshot.

## 3. Deterministic placement with `grid-template-areas`

Preferred over auto-placement whenever the composition is fixed, because it makes visual
position explicit while DOM order stays the reading order.
`scripts/assign-spans.mjs` emits these three blocks directly.

```css
.bento__grid--areas {
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-areas:
    "perf perf perf perf perf perf uptime uptime uptime regions regions regions"
    "perf perf perf perf perf perf observability observability observability . . ."
    "integrations integrations integrations integrations integrations integrations observability observability observability team team team";
}
.bento__grid--areas > [data-bento-area="perf"] { grid-area: perf; }
/* …one rule per tile; the planner emits the full set. */

@media (max-width: 767px) {
  .bento__grid--areas {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-template-areas: "perf" "uptime" "regions" "observability" "integrations" "team";
  }
}
```

A `.` in the template is an intentional empty cell. The planner reports the count rather than
packing it away, because closing a hole means reordering, and reordering breaks reading order.

## 4. Dense packing — only under a guard

`grid-auto-flow: dense` pulls later items into earlier holes, so visual order stops matching DOM
order and both screen-reader traversal and tab order diverge from what a sighted user sees. The
CSS Grid spec calls that non-conforming, not merely unfortunate.

```css
/* Progressive enhancement only. reading-flow is Chromium 137+ (stable 27 May
   2025) and is not Baseline — no Safari or Firefox as of August 2026 — so the
   DOM order underneath must already be correct without it. */
@supports (reading-flow: grid-rows) {
  .bento__grid--dense {
    grid-auto-flow: dense;
    reading-flow: grid-rows;
  }
}
```

Emit this only when the grid contains zero focusable elements, or when the user explicitly
accepts the guard and the DOM order is already the reading order. The planner never emits dense
on its own.

## 5. Tailwind CSS v4

No plugin required: container queries and `has-*` variants are core in v4. Tokens come from
`../assets/tokens.theme.css`.

```html
<section class="mx-auto max-w-[1280px] bg-bento-page px-4 dark:bg-black sm:px-10"
         aria-labelledby="f-h">
  <h2 id="f-h" class="mb-8 text-4xl font-semibold tracking-[-0.03em] text-bento-fg dark:text-[#f5f5f7]">
    Everything in one place
  </h2>

  <ul role="list"
      class="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4 md:auto-rows-bento-row xl:grid-cols-12">

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
           sizes="(max-width: 767px) 100vw, 50vw"
           class="mt-auto -mb-8 -mr-8 w-[calc(100%+2rem)] max-w-none rounded-tl-bento-media">
    </li>

    <li class="bento-tile md:col-span-3 xl:col-span-3">
      <p class="text-[13px] font-semibold uppercase tracking-[0.06em] text-bento-muted dark:text-[#a1a1a6]">Uptime</p>
      <p class="mt-auto text-6xl font-bold tabular-nums tracking-[-0.04em]">99.99<span class="text-3xl">%</span></p>
    </li>

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
           sizes="(max-width: 767px) 100vw, 25vw"
           class="mt-auto -mb-6 -mr-6 w-[calc(100%+1.5rem)] max-w-none rounded-tl-bento-media">
    </li>

    <li class="bento-tile p-6 md:col-span-3 md:row-span-2 xl:col-span-6">
      <div class="flex flex-col gap-2 @[420px]:flex-row @[420px]:items-end @[420px]:justify-between">
        <h3 class="text-2xl font-semibold tracking-[-0.02em]">Connects to the stack you already run.</h3>
        <p class="text-base text-bento-muted dark:text-[#a1a1a6]">120+ integrations</p>
      </div>
    </li>
  </ul>
</section>
```

The `.bento-tile` component class is in `../assets/tokens.theme.css`'s companion layer:

```css
@layer components {
  .bento-tile {
    @apply relative flex flex-col gap-2 overflow-hidden rounded-bento
           bg-bento-tile p-5 text-bento-fg shadow-bento
           ring-1 ring-black/6 dark:bg-[#161617] dark:text-[#f5f5f7] dark:ring-white/8;
    container-type: inline-size;
    scroll-margin-top: 88px;
  }
}
```

Two Tailwind-specific traps:

- `auto-rows-bento-row` generates a bare `180px`. Pair it with a raw
  `[grid-auto-rows:minmax(180px,auto)]` utility at the breakpoint where tiles hold text, or the
  200% zoom check fails.
- Bracket syntax takes a literal, so `ease-[--ease-bento]` is invalid CSS and silently dropped.
  Use the theme utility (`ease-bento`) or the parenthesis shorthand (`ease-(--bento-ease)`).

## 6. React + TypeScript

The span vocabulary is a closed union, so the compiler rejects an invented size. Styling comes
from the emitted `@layer bento` stylesheet rather than inline styles — inline styles cannot
carry the media queries, container queries or `:has()` rules the pattern depends on.

```tsx
// BentoGrid.tsx
import * as React from "react";

export type BentoSpan = "hero" | "wide" | "tall" | "unit" | "strip";

export interface BentoGridProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Base column count at the widest breakpoint. 12 or 6. Default 12. */
  columns?: 6 | 12;
  /** Gutter in px, applied to every gap. Default 16. */
  gap?: number;
  /** Height of one grid row unit in px. Default 180. */
  rowUnit?: number;
  /** Skip render work for off-screen tiles. Only for grids below the fold. */
  belowFold?: boolean;
  children: React.ReactNode;
}

export function BentoGrid({
  columns = 12,
  gap = 16,
  rowUnit = 180,
  belowFold = false,
  className,
  style,
  children,
  ...rest
}: BentoGridProps) {
  const vars = {
    "--bento-cols": String(columns),
    "--bento-gap": `${gap}px`,
    "--bento-row": `${rowUnit}px`,
    ...style,
  } as React.CSSProperties;

  return (
    <ul
      {...rest}
      role="list"
      className={["bento__grid", belowFold ? "bento__grid--below-fold" : null, className]
        .filter(Boolean)
        .join(" ")}
      style={vars}
    >
      {children}
    </ul>
  );
}

export interface BentoTileProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  span?: BentoSpan;
  eyebrow?: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  /** Big numeral variant. Rendered instead of body. */
  stat?: string;
  /** Renders a single full-tile link. One link per tile, never two. */
  href?: string;
  /** Decorative background image URL. Adds the scrim automatically. */
  cover?: string;
  /** Media that bleeds off the bottom-right corner. */
  media?: React.ReactNode;
  /** Reveal this tile on scroll. Ignored under prefers-reduced-motion. */
  reveal?: boolean;
  children?: React.ReactNode;
}

export function BentoTile({
  span = "unit",
  eyebrow,
  title,
  body,
  stat,
  href,
  cover,
  media,
  reveal = false,
  className,
  children,
  ...rest
}: BentoTileProps) {
  const onImage = Boolean(cover);
  const heading = href ? <a href={href}>{title}</a> : title;

  return (
    <li
      {...rest}
      data-bento-span={span}
      data-bento-reveal={reveal ? "" : undefined}
      className={["bento__tile", onImage ? "bento__tile--onImage" : null, className]
        .filter(Boolean)
        .join(" ")}
    >
      {cover ? (
        <>
          <img className="bento__cover" src={cover} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="bento__scrim" aria-hidden="true" />
        </>
      ) : null}

      {eyebrow ? <p className="bento__eyebrow">{eyebrow}</p> : null}

      {title ? (
        <h3 className={onImage ? "bento__title bento__title--onImage" : "bento__title"}>{heading}</h3>
      ) : null}

      {stat ? (
        <p className="bento__stat">{stat}</p>
      ) : body ? (
        <p className="bento__body">{body}</p>
      ) : null}

      {media}
      {children}
    </li>
  );
}
```

```tsx
// usage
import { BentoGrid, BentoTile } from "./BentoGrid";

export default function Features() {
  return (
    <section className="bento" aria-labelledby="f-h">
      <h2 id="f-h" className="bento__heading">Everything in one place</h2>
      <BentoGrid columns={12} gap={16} rowUnit={180}>
        <BentoTile
          span="hero"
          eyebrow="Performance"
          title="Ships in 40 milliseconds, everywhere."
          body="Edge-rendered by default. No cold starts, no region picking."
          media={
            <img
              className="bento__media bento__media--bleed"
              src="/img/perf.avif"
              alt=""
              width={720}
              height={420}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          }
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

`BentoGrid` has no `dense` prop. Dense packing is a DOM-order hazard, not a layout preference,
and a component prop is the wrong place to make that trade — if a project needs it, apply
`.bento__grid--dense` from §4 deliberately, with the `@supports` guard and a verified
interaction-free grid.

## 7. Vue and Svelte

Same structure, same class names, same stylesheet — the layer does all the work, so the
component is a thin wrapper in every framework. Keep the span union closed:
`type BentoSpan = 'hero' | 'wide' | 'tall' | 'unit' | 'strip'` in Vue's `defineProps<{}>()` or
Svelte's `$props()` typing, and keep `role="list"` on the `<ul>` — Safari drops list semantics
from a `list-style: none` list without it.

## 8. Native

**SwiftUI.** `Grid` (iOS 16+/macOS 13+) spans columns with `.gridCellColumns(_:)` and has **no
row-span equivalent**, so a true 2×2 hero beside two stacked 1×1 tiles is built as nested
stacks with explicit heights (`row * 2 + gap`). `LazyVGrid` has no spanning at all; for a
scrolling bento use fixed row blocks or a custom `Layout`. Use
`RoundedRectangle(cornerRadius:style: .continuous)` — the squircle is what makes a 24pt radius
read as Apple rather than as Bootstrap. §5 carries a complete, compiling `BentoSection`.

**Jetpack Compose.** `LazyVerticalGrid` spans columns only, via
`item(span = { GridItemSpan(maxLineSpan) })`. Either accept column-only spanning and encode
hierarchy with tile height, or use `LazyVerticalStaggeredGrid` and give up the shared row
rhythm. For a fixed non-scrolling hero, nested `Row`/`Column` with `Modifier.weight()` is the
accurate translation.

**Figma / Framer.** One component per span size (`Tile/Hero`, `Tile/Wide`, `Tile/Tall`,
`Tile/Unit`, `Tile/Strip`) so the vocabulary stays closed in design as well as in code. Use a
frame with a visible layout grid (columns 12, gutter 16, margin 40, stretch); auto-layout wrap
only works when every tile is equal, which is the one case that is not a bento.

## 9. The two checks that need a browser

Neither is computable from source, so both are emitted as instructions and reported as manual
TODOs rather than as passes:

1. **320px width.** One column, no horizontal scroll, no clipped text (SC 1.4.10).
2. **200% text zoom.** No tile clips its content; `grid-auto-rows` is growable, so tiles get
   taller instead (SC 1.4.4).
