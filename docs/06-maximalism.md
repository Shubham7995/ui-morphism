---
name: maximalism
title: Maximalism
aliases: [maximalist design, digital maximalism, more-is-more, dopamine design, anti-minimalism, maximalist web design, visual maximalism, collage UI]
category: ui-morphism
origin_year: 1995
peak_years: 2023-2026
status_2026: mainstream
difficulty: high
a11y_risk: high
perf_cost: high
plugin_slug: maximalism-ui
last_researched: 2026-08-08
---

## 1. Essence

Maximalism is the deliberate refusal of the flat, sans-serif, generous-whitespace default that has governed product design since roughly 2013. It fills the frame: layered surfaces, clashing saturated colour, several typefaces at once, display type sized past the viewport, stickers and cut-out collage fragments, patterned grounds, and things that move. The feeling it produces is presence and personality — the sense that a human with taste and nerve made this, rather than a component library. The single defining move is **intentional layer stacking**: at least three visually distinct planes (ground pattern, content plane, floating ornament) that overlap and are allowed to interfere with each other, instead of the single quiet plane minimalism insists on.

Executed badly it is noise. Executed well it is the loudest legible thing on the internet, and the discipline that separates the two is not restraint in the abstract — it is a hard rule about how many loud layers may compete inside one viewport at one time.

## 2. Origin & Timeline

- **Pre-digital roots.** Sources consistently trace maximalism's lineage to Baroque and Rococo ornament, the Memphis Group (founded Milan, 1981, Ettore Sottsass) and its clashing laminates and squiggle motifs, and 1960s psychedelia. Paula Scher's Pentagram work is repeatedly cited as the figure who moved "more is more" into commercially serious graphic design.
- **Mid-to-late 1990s — the accidental web maximalism.** LogRocket's November 2025 retrospective frames 90s maximalism as "a creative response to two contrasting factors: limited bandwidth and the desire for expressive personal sites," with the trait set of bright neon colour clashes, dense text blocks with minimal spacing, animated GIFs and flashing elements, and tiled or textured backgrounds. GeoCities-era personal pages are the canonical artefact — mostly unintentional maximalism, but the visual vocabulary that today's revival quotes.
- **2000-2008 — Flash-era excess.** Full-screen intros, sound on load, custom cursors, non-rectangular layouts. Toptal's essay describes this period as "early web chaos with Flash animations, garish colors, and poor navigation" — the mess that justified what came next.
- **2013-2020 — the flat suppression.** iOS 7 (2013) and Google's Material Design (2014) made flat, high-whitespace, single-family typography the industry default. Maximalism goes effectively extinct in shipped product UI and survives only in fashion, music, and agency portfolio work.
- **2021-2022 — neo-brutalism cracks the door.** Thick black strokes, hard offset shadows, saturated fills and unapologetic asymmetry re-enter the mainstream via creator tools and indie portfolios. Gumroad's redesign is the flashpoint: pink and yellow sections, thick black borders, massive headlines, and a genuinely divided design-Twitter reaction. Gumroad reported stronger brand recall from the bold layout than from cleaner alternatives.
- **2023 — the term goes mainstream in trend writing.** "Dopamine design" / "dopamine décor" enters the vocabulary as an explicitly *emotional* argument for saturation, framed as a counter to the anxiety and neutrality of minimalist environments. 1stDibs' designer survey put maximalism at 34% of most-requested styles this year — the baseline the later numbers move from.
- **October 2023 — the browser starts helping.** Chrome 118 and Edge 118 ship the `prefers-reduced-transparency` media feature, giving heavy-layering styles a first-class way to back off. Firefox keeps it behind the `layout.css.prefers-reduced-transparency.enabled` flag; Safari still does not support it as of August 2026. MDN marks it experimental and not Baseline. This matters: maximalism cannot rely on it as the only defence.
- **September 16, 2024 — Figma's rebrand.** Figma's own blog documents the shift away from "vector vernacular — the static cursors and heavy black outlines" toward a "vibrant and maximalist approach to color that contrasts bold primaries, bright neons, and muted earthy hues," three hero colour schemes each with light and dark modes, custom variable typeface **Figma Sans** commissioned from **Grilli Type** (plus Figma Sans Condensed, Figma Mono, and Figma Hand by OH no Type), and a system of "primitives" — illustrated shapes from blobs to smiley faces — with oversized "jumbo nodes" at bounding-box corners. Creative Director **Damien Correll** led the year-long in-house refresh; the brand explicitly rejects colour ownership: the idea of a brand "owning" a colour was called unrealistic in 2024. This is the moment maximalism stops being an agency indulgence and becomes a serious product-company brand strategy.
- **WCAG 2.2 — Recommendation 5 October 2023; current revision published 12 December 2024.** (Stated in this exact form in docs 05, 06 and 10. The December 2024 date is a revision of an existing Recommendation, not the date WCAG 2.2 reached Recommendation status — an earlier draft of this doc had that wrong in both the timeline and reference 2.) Adds 2.4.11 Focus Not Obscured (Minimum, AA), 2.4.12 (AAA), 2.4.13 Focus Appearance (AAA), 2.5.7 Dragging Movements (AA), 2.5.8 Target Size (Minimum, AA), 3.2.6 Consistent Help (A), 3.3.7 Redundant Entry (A), 3.3.8/3.3.9 Accessible Authentication. Three of these — 2.4.11, 2.4.13, 2.5.8 — are precisely the criteria that layered, sticker-dense, floating-ornament maximalism breaks by accident.
- **January 22, 2025 — Tailwind CSS v4.0.** `@theme` tokens compile to real CSS custom properties, `color-mix()` and registered `@property` land in the core, gradient APIs expand to conic/radial/angled linear with `oklch` interpolation. This is the toolchain that makes token-driven maximalism practical instead of a pile of one-off classes.
- **November 17, 2025 — hard survey data.** 1stDibs' ninth annual Interior Designer Trends Survey (468 design professionals worldwide) puts **maximalism at 39%** of most-requested styles, **up from 34% in 2023**, with eclecticism at 38%. Interiors, not web — but it is the only large-N longitudinal number available and the direction is unambiguous.
- **December 4, 2025 — Spotify Wrapped 2025, and a correction to the prior.** Spotify's own design write-up (Jeremy Wirth, Global Executive Creative Director; Rasmus Wangelin, Head of Brand Design) describes treating "Wrapped this year as a collage" — "bold, layered, textured, and full of life," type "dancing like sound waves," drawing on 1980s-90s mixtape inserts, club flyers and hand-made zines, with "DIY energy" and "expression, not perfection." **But the palette was cut back to primarily black-and-white with selective pops of colour used only for key moments.** If your prior was that 2025-26 maximalism means rainbow saturation everywhere, the search data contradicts it: the mature form trades *colour* density for *texture, layer and type* density. The pivot was partly a reaction to the "AI slop" criticism levelled at Wrapped 2024.
- **December 9, 2025 — Pinterest Predicts 2026.** Framed around nonconformity, self-preservation and escapism. Maximalist trends carry the biggest search deltas: "Glamoratti" with **"80s luxury" +225%** and **"chunky belt" +65%**; "Glitchy Glam" with **"avant garde makeup editorial" +270%** and **"nails with different colors on each hand" +125%**; "Brooched" with **"maximalist accessories" +105%**. Pinterest explicitly positions intentional imperfection — "beauty is missing the mark — on purpose."
- **Q1 2026 — Awwwards leans immersive, not collage.** **Second correction to the prior:** award-circuit maximalism in 2026 skews heavily to real-time 3D and scroll-driven cinematics, while flat collage maximalism has migrated to brand and marketing pages rather than the award shortlist. *This is a qualitative claim and it is stated as one on purpose.* An earlier draft of this doc gave a precise breakdown — "of 47 Site of the Day winners in Q1 2026, 29 used Three.js, 8 raw WebGL, 4 Babylon.js" — sourced only to reference 20, a site with no published methodology. The figure does not survive a sanity check: Awwwards awards one Site of the Day *per day*, so Q1 has roughly 90 winners, not 47, and 41-of-47 would put the 3D share at 87%, which is implausible on its face. Verify against the Awwwards SOTD archive itself before quoting any number here, and define the sample explicitly when you do.
- **2026 — codified in vendor trend guidance.** Figma's own resource library lists **Maximalism as trend #10** for 2026 — "rich colors, overlapping visuals, bold fonts, and dense compositions" — naming **Spotify** and **Liquid Death** as exemplars, alongside separate entries for Bold Typography (#4, naming Glossier and Samsung), Vibrant Colour Palettes (#3, naming Lush, Headspace, Starface, and explicitly citing Y2K nostalgia and dopamine design), and Neo-brutalism / anti-design (#12, naming Balenciaga, Diesel, Mailchimp).
- **June 2026 — the discipline hardens.** Practitioner writing converges on context-gating rather than blanket approval. Select Interactive (June 29, 2026): "Maximalism reads as confident on a brand or campaign page where exploration is the point; it reads as chaos on a task-oriented app," with the parallel rule that "motion should enhance comprehension, not decorate it," and that Interaction to Next Paint is now a design-phase constraint rather than an engineering cleanup. Toptal's essay (Danae Botha, updated June 10, 2026) argues minimalism became dogma and that maximalism "demands more from a designer" specifically because layered compositions need deliberate screen-reader handling and WCAG 2.2 contrast work.

**Verdict for 2026: resurging and mainstream, but bifurcated.** It is the default expressive register for brand sites, campaign pages, music and food-and-beverage, creator tools and Gen-Z-facing consumer products. It is still correctly rare inside task-oriented application shells, where it survives as accent-only — one loud surface (empty state, celebration moment, upgrade wall) inside an otherwise quiet product.

## 3. Visual DNA

- **Layer stacking, minimum three planes** — a patterned or textured ground, an opaque content plane, and floating ornament (stickers, arrows, blobs, cut-outs) that overlaps the content plane's bounding box by 8-24px. Two planes reads as decorated minimalism; three or more reads as maximalism.
- **Oversized display type** — hero type at `clamp(3rem, 12vw, 11rem)`, i.e. 48px floor / 176px ceiling, with tracking pulled to `-0.03em` to `-0.05em` and line-height compressed to `0.86`-`0.94`. Exaggerated hierarchy is the point: display at 96-176px sitting directly beside 12-14px captions, a 7-12× ratio, where minimalism would use 2-3×.
- **Multiple typeface families, deliberately unresolved** — 3 to 4 families in one composition: a heavy grotesque or fat display face for headlines, a condensed or stencil face for kickers, a serif or slab for pull-quotes, and a mono for metadata. Mixing weights alone is not maximalism.
- **Clashing saturated colour with an anchor** — 4 to 7 hues at chroma 0.18-0.30 in OKLCH, deliberately non-analogous (magenta against acid lime against cobalt), all anchored by one near-black ink and one off-white paper that do the actual legibility work. Note the 2025-26 refinement: Spotify Wrapped 2025 ran a near-monochrome ground with colour reserved for key moments, and that is now the more defensible pattern.
- **Hard, blur-free offset shadows** — `6px 6px 0 var(--ink)` rather than a soft ambient shadow, frequently stacked in multiple colours: `4px 4px 0 magenta, 8px 8px 0 cyan, 12px 12px 0 ink`. Zero blur radius is the tell.
- **Thick strokes** — 2px, 3px, and 6px ink borders. Everything is outlined; the outline is the grid.
- **Patterned grounds** — halftone dots, checkerboards, diagonal stripes at 12-24px repeat, repeating-conic checks, or SVG `feTurbulence` grain at `baseFrequency` 0.8 / `numOctaves` 3, opacity 0.04-0.12. The ground is never a flat fill. *Three docs in this set ship an inline-SVG grain recipe with different parameters, on purpose: here the grain is a **visible print texture** and is meant to be seen, hence the high opacity ceiling; [./01-skeuomorphism.md](./01-skeuomorphism.md) uses 0.9 / 2 at 0.04-0.06 for an invisible machining finish; [./03-glassmorphism.md](./03-glassmorphism.md) uses 0.8 / 4 at 0.02-0.05 purely to de-band a blurred backdrop. Do not copy this doc's opacity into either of the others.*
- **Anti-grid placement** — elements rotated `-4deg` to `+5deg`, negative margins pulling cards into each other, `grid-area` overlaps that make two children share cells. The underlying grid still exists; things are placed *against* it, not without it.
- **Sticker and collage fragments** — die-cut shapes with white keylines (2-4px), torn-paper edges, halftone photo cut-outs, arrow doodles, tape strips. Rotated, drop-shadowed, and never aligned to the type baseline.
- **Motion as texture** — infinite marquees at 12-30s per cycle, hover states that translate and drop their shadow, blob morphs, scroll-linked rotation. Motion is ambient rather than functional, which is exactly what makes `prefers-reduced-motion` non-optional.
- **Mixed radii in one composition** — a 0px hard rectangle beside a 999px pill beside a 42%/58% organic blob. A single consistent radius immediately reads as a different style.
- **Blend modes for interference** — `mix-blend-mode: multiply` on overlapping colour plates, `difference` on a logo so it self-inverts over any ground, `screen` on grain layers. This is the technique that produces genuine layer *interference* rather than stacked opaque rectangles.

## 4. Anatomy & Design Tokens

All contrast ratios below are computed against the WCAG 2.x relative-luminance formula.

| Token group | Token | Value | Notes |
|---|---|---|---|
| Ground | `--max-paper` | `#FFF8E7` | Warm cream. L = 0.9416 |
| Ground | `--max-ink` | `#0B0A0F` | Near-black. L = 0.0032. Paper-on-ink = **18.63:1** |
| Accent | `--max-magenta` | `#FF2E88` | L = 0.2499. On ink **5.63:1** (AA text). On paper 3.31:1 (large text / non-text only) |
| Accent | `--max-lime` | `#C6FF00` | L = 0.8353. On ink **16.63:1**. On paper 1.12:1 — **never** on paper |
| Accent | `--max-cyan` | `#00E5FF` | L = 0.6326. On ink **12.82:1**. On paper 1.45:1 — never on paper |
| Accent | `--max-violet` | `#6C2BD9` | L = 0.0993. On paper **6.64:1** (AA text). On ink 2.80:1 — never on ink |
| Accent | `--max-cobalt` | `#1B39FF` | L = 0.1038. On paper **6.45:1**. On ink 2.89:1 — never on ink |
| Accent | `--max-orange` | `#FF6B00` | L = 0.3178. On ink **6.91:1**. On paper 2.70:1 — fails even 3:1, decorative only |
| Surface | `--max-surface` | `#FFFFFF` | Opaque content plane; never translucent over pattern |
| Surface | `--max-surface-2` | `#F2ECDA` | Second plane, 2% darker than paper |
| Border | `--max-stroke-1 / 2 / 3` | `2px / 3px / 6px` | Solid `--max-ink` |
| Radius | `--max-r-0 / 1 / 2 / 3` | `0 / 4px / 14px / 28px` | Mix within one composition |
| Radius | `--max-r-pill` | `999px` | |
| Radius | `--max-r-blob` | `42% 58% 63% 37% / 51% 42% 58% 49%` | Organic sticker shape |
| Shadow | `--max-shadow-hard` | `6px 6px 0 var(--max-ink)` | Zero blur |
| Shadow | `--max-shadow-stack` | `4px 4px 0 #FF2E88, 8px 8px 0 #00E5FF, 12px 12px 0 var(--max-ink)` | 3-layer chromatic |
| Shadow | `--max-shadow-press` | `2px 2px 0 var(--max-ink)` | Active state |
| Elevation | `--max-lift` | `-4px` | Hover translate on both axes |
| Blur | `--max-blur-halo` | `28px` | Only for behind-content glow, never over text |
| Grain | `--max-grain-opacity` | `0.08` | Range 0.04-0.12 |
| Filter | `--max-boost` | `saturate(1.35) contrast(1.06)` | Applied to imagery, not to text |
| Type | `--max-font-display` | `"Archivo Expanded", "Anton", system-ui, sans-serif` | |
| Type | `--max-font-kicker` | `"Archivo Condensed", "Oswald", sans-serif` | |
| Type | `--max-font-body` | `"Inter", system-ui, sans-serif` | |
| Type | `--max-font-mono` | `"JetBrains Mono", ui-monospace, monospace` | |
| Type scale | `--max-t-cap` → `--max-t-hero` | `12 / 14 / 16 / 20 / 28 / 42 / 64 / clamp(3rem,12vw,11rem)` | Ratio ≈ 1.5 |
| Type | `--max-track-display` | `-0.04em` | |
| Type | `--max-leading-display` | `0.9` | |
| Spacing | `--max-s-1` → `--max-s-7` | `4 / 8 / 12 / 20 / 32 / 52 / 84 px` | Fibonacci-adjacent |
| Rotation | `--max-tilt-s / m / l` | `-1.5deg / -3deg / 5deg` | |
| Motion | `--max-dur-tap` | `120ms` | |
| Motion | `--max-dur-hover` | `220ms` | |
| Motion | `--max-dur-enter` | `420ms` | |
| Motion | `--max-dur-marquee` | `24s` | Linear, infinite |
| Motion | `--max-ease-snap` | `cubic-bezier(0.2, 0.9, 0.1, 1.25)` | Overshoot |
| Motion | `--max-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | |
| Focus | `--max-focus-ring` | `var(--max-focus-w) solid var(--max-focus-inner)` → `4px solid #00E5FF` | The inner ring, composed from `--max-focus-w` and `--max-focus-inner` and consumed directly by the `:focus-visible` rule in §5. Cyan is 12.82:1 on ink. The `2px` offset is `--max-focus-offset`, and the outer ink halo is `--max-focus-outer` drawn as a `box-shadow`, because an element gets only one `outline` |
| Target | `--max-target-min` | `44px` | Minimum hit area on every interactive element. Not the 24px SC 2.5.8 floor: a tilted sticker button hit-tests against its *transformed* box, so the dependable clickable area is smaller than the drawn one, and the 6px offset shadow makes the visual box look larger still. 44px is what survives `--max-tilt-l` plus `--max-shadow-hard` — measure after transform |
| Role | `--max-text-on-paper` | light `var(--max-violet)` / dark `var(--max-lime)` | The only accent legal as **text on the ground colour**. Rebound per theme — see the dark block below and the dark contrast table in §7 |
| Role | `--max-text-on-ink` | light `var(--max-lime)` / dark `var(--max-violet-deep)` | The only accent legal as **text on the ink colour**. In dark mode "ink" is cream, so this must bind to a *deep* accent, never a lifted one |
| Role | `--max-accent-safe` | light `var(--max-magenta)` / dark `var(--max-magenta)` | Passes AA on the ground in both themes; on the opposite surface it is large-text / non-text only |
| Accent (dark ramp) | `--max-violet-deep` / `--max-cobalt-deep` | `#6C2BD9` / `#1B39FF` | Dark mode only. The lifted accents all fail on cream; these two are the only ones that carry text there (6.64:1 / 6.45:1) |

**The loud-layer budget is a rule, not a token.** The cap — **three** simultaneous loud layers per viewport, with §6 defining what counts as one — is a review and lint constraint, not a CSS value. Nothing in CSS can count the loud layers in a viewport, so there is no declaration for it and no `var()` that could read one; writing it as a custom property would only produce a number no stylesheet consumes. It is enforced where it can be: by eye in design review, by the `loudLayers` guard in the §5 React component, by the per-tile containment described in §12, and by check 2 of the skill's validation list in §13. Everything that *is* a token appears in the table above and is declared in the CSS block below.

```css
:root {
  color-scheme: light dark;

  /* ---- Ground & ink ---- */
  --max-paper:        #FFF8E7;
  --max-ink:          #0B0A0F;
  --max-surface:      #FFFFFF;
  --max-surface-2:    #F2ECDA;
  --max-muted:        #4A4553;

  /* ---- Chroma ---- */
  --max-magenta:      #FF2E88;
  --max-lime:         #C6FF00;
  --max-cyan:         #00E5FF;
  --max-violet:       #6C2BD9;
  --max-cobalt:       #1B39FF;
  --max-orange:       #FF6B00;

  /* Role bindings: which accents are legal as TEXT on which ground */
  --max-text-on-paper: var(--max-violet);   /* 6.64:1 */
  --max-text-on-ink:   var(--max-lime);     /* 16.63:1 */
  --max-accent-safe:   var(--max-magenta);  /* 5.63:1 on ink, 3.31:1 on paper */

  /* ---- Strokes & radii ---- */
  --max-stroke-1: 2px;
  --max-stroke-2: 3px;
  --max-stroke-3: 6px;
  --max-r-0: 0px;
  --max-r-1: 4px;
  --max-r-2: 14px;
  --max-r-3: 28px;
  --max-r-pill: 999px;
  --max-r-blob: 42% 58% 63% 37% / 51% 42% 58% 49%;

  /* ---- Shadows (zero blur is the signature) ---- */
  --max-shadow-hard:  6px 6px 0 var(--max-ink);
  --max-shadow-press: 2px 2px 0 var(--max-ink);
  --max-shadow-stack: 4px 4px 0 var(--max-magenta),
                      8px 8px 0 var(--max-cyan),
                      12px 12px 0 var(--max-ink);
  --max-lift: -4px;

  /* ---- Texture ---- */
  --max-grain-opacity: 0.08;
  --max-boost: saturate(1.35) contrast(1.06);
  --max-blur-halo: 28px;
  --max-grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");

  /* ---- Type ---- */
  --max-font-display: "Archivo Expanded", "Anton", system-ui, sans-serif;
  --max-font-kicker:  "Archivo Condensed", "Oswald", sans-serif;
  --max-font-body:    "Inter", system-ui, -apple-system, sans-serif;
  --max-font-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  --max-t-cap:  0.75rem;   /* 12px */
  --max-t-sm:   0.875rem;  /* 14px */
  --max-t-base: 1rem;      /* 16px */
  --max-t-lg:   1.25rem;   /* 20px */
  --max-t-xl:   1.75rem;   /* 28px */
  --max-t-2xl:  2.625rem;  /* 42px */
  --max-t-3xl:  4rem;      /* 64px */
  --max-t-hero: clamp(3rem, 12vw, 11rem);

  --max-track-display: -0.04em;
  --max-track-kicker:  0.14em;
  --max-leading-display: 0.9;
  --max-leading-body:    1.55;

  /* ---- Space & tilt ---- */
  --max-s-1: 4px;
  --max-s-2: 8px;
  --max-s-3: 12px;
  --max-s-4: 20px;
  --max-s-5: 32px;
  --max-s-6: 52px;
  --max-s-7: 84px;
  --max-tilt-s: -1.5deg;
  --max-tilt-m: -3deg;
  --max-tilt-l: 5deg;

  /* ---- Motion ---- */
  --max-dur-tap:     120ms;
  --max-dur-hover:   220ms;
  --max-dur-enter:   420ms;
  --max-dur-marquee: 24s;
  --max-ease-snap: cubic-bezier(0.2, 0.9, 0.1, 1.25);
  --max-ease-out:  cubic-bezier(0.22, 1, 0.36, 1);

  /* ---- Focus ----
     Two concentric rings. `--max-focus-ring` is the composite the :focus-visible
     rule in §5 consumes as its `outline` shorthand; the outer halo has to be a
     box-shadow because an element gets only one outline. */
  --max-focus-inner:  var(--max-cyan);
  --max-focus-outer:  var(--max-ink);
  --max-focus-w:      4px;
  --max-focus-offset: 2px;
  --max-focus-ring:   var(--max-focus-w) solid var(--max-focus-inner);

  /* ---- Targets ---- */
  /* WCAG 2.2 SC 2.5.8 floor is 24px; this style needs more. Rotation means the
     hit test runs against the transformed box, and the hard offset shadow
     inflates the apparent one, so the area a user can reliably hit is smaller
     than the area they see. Measure after transform, not before. */
  --max-target-min: 44px;
}

/* ---------------------------------------------------------------------------
   DARK MODE. Read this before editing it.

   In dark mode `--max-paper` and `--max-ink` SWAP: "paper" becomes near-black
   and "ink" becomes cream. That means `--max-text-on-ink` — a role token whose
   whole job is to prevent illegal accent-on-ground pairings — now describes
   text on a CREAM surface, and the lifted, high-luminance accents are exactly
   the wrong answer for it. The lifted violet #B18CFF measures 2.46:1 on cream:
   a hard 1.4.3 failure, on the one token §7 holds up as the mechanism that
   makes those failures impossible.

   So the dark block keeps BOTH ramps: the lifted accents for decoration and
   text on the dark ground, and the original deep accents (suffix `-deep`) for
   text on the cream surface. The role bindings pick from the correct ramp.
   Full dark-mode contrast table in §7.

   Structure follows the set-wide rule: light on bare `:root`, dark duplicated
   under a guarded media query AND under `:root[data-theme="dark"]`, so an
   explicit toggle beats the OS preference in both directions.
--------------------------------------------------------------------------- */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --max-paper:     #0B0A0F;
    --max-ink:       #FFF8E7;
    --max-surface:   #17141F;
    --max-surface-2: #221D2E;
    --max-muted:     #B9B2C6;

    /* Lifted ramp — legal as TEXT on the dark ground, decorative on cream. */
    --max-magenta: #FF5BA0;   /* 6.82:1 on paper, 2.73:1 on ink */
    --max-violet:  #B18CFF;   /* 7.58:1 on paper, 2.46:1 on ink — NOT text on ink */
    --max-cobalt:  #7EA0FF;   /* 7.85:1 on paper, 2.37:1 on ink */
    --max-orange:  #FF8A33;   /* 8.39:1 on paper, 2.22:1 on ink */

    /* Deep ramp — the only accents that carry text on the cream ink surface. */
    --max-violet-deep: #6C2BD9;  /* 6.64:1 on ink (cream) */
    --max-cobalt-deep: #1B39FF;  /* 6.45:1 on ink (cream) */

    --max-text-on-paper: var(--max-lime);         /* 16.63:1 on #0B0A0F */
    --max-text-on-ink:   var(--max-violet-deep);  /* 6.64:1 on #FFF8E7 */
    --max-accent-safe:   var(--max-magenta);      /* 6.82:1 on paper; on ink 2.73:1, decorative only */

    --max-shadow-hard:  6px 6px 0 var(--max-ink);
    --max-shadow-press: 2px 2px 0 var(--max-ink);
    --max-shadow-stack: 4px 4px 0 var(--max-magenta),
                        8px 8px 0 var(--max-cyan),
                        12px 12px 0 var(--max-ink);

    --max-grain-opacity: 0.05;   /* grain reads louder on dark; halve it */
    --max-boost: saturate(1.18) contrast(1.02);
  }
}

/* Explicit opt-in override, so a toggle beats the media query both ways.
   This block redefines the full token list — setting only `color-scheme`
   here (as an earlier draft did) meant the toggle changed nothing at all. */
:root[data-theme="dark"] {
  color-scheme: dark;

  --max-paper:     #0B0A0F;
  --max-ink:       #FFF8E7;
  --max-surface:   #17141F;
  --max-surface-2: #221D2E;
  --max-muted:     #B9B2C6;

  --max-magenta: #FF5BA0;
  --max-violet:  #B18CFF;
  --max-cobalt:  #7EA0FF;
  --max-orange:  #FF8A33;

  --max-violet-deep: #6C2BD9;
  --max-cobalt-deep: #1B39FF;

  --max-text-on-paper: var(--max-lime);
  --max-text-on-ink:   var(--max-violet-deep);
  --max-accent-safe:   var(--max-magenta);

  --max-shadow-hard:  6px 6px 0 var(--max-ink);
  --max-shadow-press: 2px 2px 0 var(--max-ink);
  --max-shadow-stack: 4px 4px 0 var(--max-magenta),
                      8px 8px 0 var(--max-cyan),
                      12px 12px 0 var(--max-ink);

  --max-grain-opacity: 0.05;
  --max-boost: saturate(1.18) contrast(1.02);
}

:root[data-theme="light"] { color-scheme: light; }
```

## 5. Implementation Recipes

### Vanilla CSS

```html
<section class="max-scene">
  <div class="max-scene__ground" aria-hidden="true"></div>
  <div class="max-scene__grain" aria-hidden="true"></div>

  <header class="max-hero">
    <p class="max-kicker">Issue 04 &middot; Everything At Once</p>
    <h1 class="max-display">MORE<br><em>IS</em> MORE</h1>
  </header>

  <div class="max-marquee" aria-hidden="true">
    <div class="max-marquee__track">
      <span>NEW DROP&nbsp;&nbsp;&#9733;&nbsp;&nbsp;NEW DROP&nbsp;&nbsp;&#9733;&nbsp;&nbsp;</span>
      <span>NEW DROP&nbsp;&nbsp;&#9733;&nbsp;&nbsp;NEW DROP&nbsp;&nbsp;&#9733;&nbsp;&nbsp;</span>
    </div>
  </div>

  <article class="max-card">
    <span class="max-sticker">50% OFF</span>
    <h2 class="max-card__title">Sunburst Tote</h2>
    <p class="max-card__body">Screen-printed cotton canvas. One size, loud.</p>
    <button class="max-btn" type="button">Add to bag</button>
  </article>
</section>
```

```css
/* Assumes the :root token block from section 4 is loaded. */

.max-scene {
  position: relative;
  isolation: isolate;              /* contain blend modes to this scene */
  background-color: var(--max-paper);
  color: var(--max-ink);
  font-family: var(--max-font-body);
  line-height: var(--max-leading-body);
  padding: var(--max-s-7) var(--max-s-5);
  overflow: clip;
}

/* --- Plane 1: patterned ground --- */
.max-scene__ground {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    repeating-linear-gradient(
      45deg,
      color-mix(in oklab, var(--max-magenta) 14%, transparent) 0 10px,
      transparent 10px 24px
    ),
    radial-gradient(
      circle at 1px 1px,
      color-mix(in oklab, var(--max-ink) 22%, transparent) 1.5px,
      transparent 1.6px
    );
  background-size: auto, 18px 18px;
}

/* --- Plane 2: grain, screened over everything --- */
.max-scene__grain {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: var(--max-grain);
  background-size: 160px 160px;
  opacity: var(--max-grain-opacity);
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* --- Display type --- */
.max-kicker {
  font-family: var(--max-font-kicker);
  font-size: var(--max-t-cap);
  letter-spacing: var(--max-track-kicker);
  text-transform: uppercase;
  color: var(--max-text-on-paper);   /* violet, 6.64:1 on cream */
  margin: 0 0 var(--max-s-3);
}

.max-display {
  font-family: var(--max-font-display);
  font-size: var(--max-t-hero);
  line-height: var(--max-leading-display);
  letter-spacing: var(--max-track-display);
  text-transform: uppercase;
  margin: 0 0 var(--max-s-6);
  text-wrap: balance;
}
.max-display em {
  font-style: normal;
  -webkit-text-stroke: 3px var(--max-ink);
  color: transparent;               /* outline word, ground shows through */
  paint-order: stroke fill;
}

/* --- Marquee: decorative, duplicated, hidden from AT --- */
.max-marquee {
  border-block: var(--max-stroke-2) solid var(--max-ink);
  background: var(--max-lime);
  overflow: hidden;
  transform: rotate(var(--max-tilt-s));
  margin-block: var(--max-s-5);
}
.max-marquee__track {
  display: flex;
  width: max-content;
  font-family: var(--max-font-display);
  font-size: var(--max-t-lg);
  text-transform: uppercase;
  padding-block: var(--max-s-2);
  color: var(--max-ink);            /* ink on lime = 16.63:1 */
  animation: max-scroll var(--max-dur-marquee) linear infinite;
  will-change: transform;
}
@keyframes max-scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

/* --- Plane 3: card + floating ornament --- */
.max-card {
  position: relative;
  max-width: 34rem;
  background: var(--max-surface);   /* opaque, never translucent over pattern */
  color: var(--max-ink);
  border: var(--max-stroke-2) solid var(--max-ink);
  border-radius: var(--max-r-2);
  box-shadow: var(--max-shadow-stack);
  padding: var(--max-s-5);
  transform: rotate(var(--max-tilt-s));
}
.max-card__title {
  font-family: var(--max-font-display);
  font-size: var(--max-t-2xl);
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 var(--max-s-3);
}
.max-card__body { margin: 0 0 var(--max-s-4); max-width: 46ch; }

.max-sticker {
  position: absolute;
  top: -18px;
  right: -14px;
  display: grid;
  place-items: center;
  min-width: 76px;
  padding: var(--max-s-2) var(--max-s-3);
  background: var(--max-magenta);
  color: var(--max-paper);          /* cream on magenta = 3.31:1 -> large text only */
  font-family: var(--max-font-display);
  font-size: var(--max-t-lg);       /* 20px bold qualifies as large text */
  border: var(--max-stroke-2) solid var(--max-ink);
  border-radius: var(--max-r-blob);
  transform: rotate(var(--max-tilt-l));
  box-shadow: var(--max-shadow-hard);
}

/* --- Button --- */
.max-btn {
  --_y: 0px;
  font: inherit;
  font-family: var(--max-font-display);
  font-size: var(--max-t-base);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-height: 44px;                 /* > 24x24 for WCAG 2.5.8, > 44 for comfort */
  min-width: 44px;
  padding: var(--max-s-3) var(--max-s-5);
  background: var(--max-cyan);
  color: var(--max-ink);            /* 12.82:1 */
  border: var(--max-stroke-2) solid var(--max-ink);
  border-radius: var(--max-r-pill);
  box-shadow: var(--max-shadow-hard);
  cursor: pointer;
  translate: 0 var(--_y);
  transition:
    translate var(--max-dur-hover) var(--max-ease-snap),
    box-shadow var(--max-dur-hover) var(--max-ease-snap),
    background-color var(--max-dur-hover) linear;
}
.max-btn:hover  { --_y: var(--max-lift); box-shadow: 10px 10px 0 var(--max-ink); background: var(--max-lime); }
.max-btn:active { --_y: 2px;             box-shadow: var(--max-shadow-press); }
.max-btn:disabled {
  background: var(--max-surface-2);
  color: var(--max-muted);
  box-shadow: none;
  cursor: not-allowed;
  filter: saturate(0.2);
}

/* --- Focus: double ring so it survives every ground colour --- */
:where(.max-scene) :is(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: var(--max-focus-ring);
  outline-offset: var(--max-focus-offset);
  box-shadow: 0 0 0 calc(var(--max-focus-w) + var(--max-focus-offset) + 2px) var(--max-focus-outer);
  border-radius: inherit;
}

/* --- Reduced motion: kill ambient motion, keep state feedback --- */
@media (prefers-reduced-motion: reduce) {
  .max-marquee__track { animation: none; transform: none; }
  .max-marquee { overflow-x: auto; }
  .max-btn { transition-duration: 1ms; }
  .max-btn:hover { --_y: 0px; box-shadow: var(--max-shadow-hard); }
  *, *::before, *::after { animation-iteration-count: 1 !important; }
}

/* --- Reduced transparency / reduced data: drop the texture planes --- */
@media (prefers-reduced-transparency: reduce) {
  .max-scene__grain { display: none; }
  .max-scene__ground { background-image: none; background: var(--max-surface-2); }
}

/* --- Forced colors (Windows High Contrast): strokes must survive --- */
@media (forced-colors: active) {
  .max-scene__ground,
  .max-scene__grain { display: none; }
  .max-card,
  .max-btn,
  .max-sticker,
  .max-marquee { border: 2px solid CanvasText; box-shadow: none; background: Canvas; color: CanvasText; }
  .max-display em { -webkit-text-stroke: 0; color: CanvasText; }
  :where(.max-scene) :is(a, button):focus-visible { outline: 3px solid Highlight; }
}
```

### Tailwind CSS v4

No plugin required. Tailwind v4.0 (released January 22, 2025) exposes every `@theme` token as a real CSS custom property, which is what makes the intensity knobs in §13 work at runtime.

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-paper:     #FFF8E7;
  --color-ink:       #0B0A0F;
  --color-surface:   #FFFFFF;
  --color-surface-2: #F2ECDA;
  --color-magenta:   #FF2E88;
  --color-lime:      #C6FF00;
  --color-cyan:      #00E5FF;
  --color-violet:    #6C2BD9;
  --color-cobalt:    #1B39FF;
  --color-orange:    #FF6B00;

  --font-display: "Archivo Expanded", "Anton", system-ui, sans-serif;
  --font-kicker:  "Archivo Condensed", "Oswald", sans-serif;
  --font-body:    "Inter", system-ui, sans-serif;

  --text-hero: clamp(3rem, 12vw, 11rem);
  --text-hero--line-height: 0.9;
  --text-hero--letter-spacing: -0.04em;

  --radius-blob: 42% 58% 63% 37% / 51% 42% 58% 49%;

  --shadow-hard:  6px 6px 0 #0B0A0F;
  --shadow-press: 2px 2px 0 #0B0A0F;
  --shadow-stack: 4px 4px 0 #FF2E88, 8px 8px 0 #00E5FF, 12px 12px 0 #0B0A0F;

  --ease-snap: cubic-bezier(0.2, 0.9, 0.1, 1.25);
  --animate-marquee: max-scroll 24s linear infinite;

  @keyframes max-scroll {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(-50%, 0, 0); }
  }
}

/* Custom utilities — v4 @utility, no plugin. */
@utility grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
  mix-blend-mode: multiply;
  opacity: 0.08;
  pointer-events: none;
}

@utility halftone {
  background-image: radial-gradient(circle at 1px 1px,
    color-mix(in oklab, var(--color-ink) 22%, transparent) 1.5px, transparent 1.6px);
  background-size: 18px 18px;
}

@utility outline-type {
  -webkit-text-stroke: 3px var(--color-ink);
  color: transparent;
  paint-order: stroke fill;
}

@utility focus-loud {
  &:focus-visible {
    outline: 4px solid var(--color-cyan);
    outline-offset: 2px;
    box-shadow: 0 0 0 8px var(--color-ink);
  }
}

/* Ambient motion is opt-out at the source, not per component. */
@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none !important; }
}
```

```html
<section class="relative isolate overflow-clip bg-paper text-ink px-8 py-21">
  <div class="absolute inset-0 -z-10 halftone" aria-hidden="true"></div>
  <div class="absolute inset-0 -z-10 grain" aria-hidden="true"></div>

  <p class="font-kicker text-xs uppercase tracking-[0.14em] text-violet mb-3">
    Issue 04 &middot; Everything At Once
  </p>

  <h1 class="font-display text-hero uppercase mb-13 text-balance">
    MORE <span class="outline-type">IS</span> MORE
  </h1>

  <div class="overflow-hidden border-y-[3px] border-ink bg-lime -rotate-[1.5deg] my-8" aria-hidden="true">
    <div class="flex w-max animate-marquee font-display text-xl uppercase py-2">
      <span class="px-4">NEW DROP &#9733; NEW DROP &#9733;</span>
      <span class="px-4">NEW DROP &#9733; NEW DROP &#9733;</span>
    </div>
  </div>

  <article class="relative max-w-lg bg-surface border-[3px] border-ink rounded-[14px]
                  shadow-stack p-8 -rotate-[1.5deg]">
    <span class="absolute -top-[18px] -right-[14px] grid place-items-center min-w-[76px]
                 px-3 py-2 bg-magenta text-paper font-display text-xl
                 border-[3px] border-ink rounded-blob rotate-[5deg] shadow-hard">
      50% OFF
    </span>
    <h2 class="font-display text-[2.625rem] leading-none tracking-tight mb-3">Sunburst Tote</h2>
    <p class="mb-5 max-w-[46ch]">Screen-printed cotton canvas. One size, loud.</p>
    <button type="button"
      class="focus-loud min-h-11 min-w-11 px-8 py-3 bg-cyan text-ink font-display uppercase
             tracking-wide border-[3px] border-ink rounded-full shadow-hard
             transition-[translate,box-shadow,background-color] duration-200 ease-snap
             hover:-translate-y-1 hover:shadow-[10px_10px_0_#0B0A0F] hover:bg-lime
             active:translate-y-0.5 active:shadow-press
             disabled:bg-surface-2 disabled:shadow-none disabled:saturate-[0.2]
             motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      Add to bag
    </button>
  </article>
</section>
```

### React component

TypeScript, no dependencies beyond React. The `intensity` prop (0-100) is the single control that scales every loud dimension; the `loudLayers` guard enforces the budget from §6.

```tsx
// MaxCard.tsx
import * as React from "react";

export type MaxIntensity = number; // 0-100

export interface MaxCardProps extends React.HTMLAttributes<HTMLElement> {
  /** 0 = quiet neo-brutalist card, 100 = full collage. Default 60. */
  intensity?: MaxIntensity;
  title: string;
  /** Optional die-cut sticker text. Counts as one loud layer. */
  sticker?: string;
  /** Patterned ground behind the card. Counts as one loud layer. */
  pattern?: "none" | "halftone" | "stripes" | "checks";
  /** Chromatic stacked shadow instead of single ink shadow. */
  chromaticShadow?: boolean;
  /** Palette accent used for the sticker and hover fill. */
  accent?: "magenta" | "lime" | "cyan" | "violet" | "cobalt" | "orange";
  children?: React.ReactNode;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Maps 0-100 to the five physical knobs. Every output is a real CSS value. */
function scale(i: MaxIntensity) {
  const t = clamp(i, 0, 100) / 100;
  return {
    tilt: `${(-4.5 * t).toFixed(2)}deg`,                 // 0 -> -4.5deg
    strokePx: `${Math.round(1 + 5 * t)}px`,              // 1px -> 6px
    shadowPx: Math.round(2 + 10 * t),                    // 2px -> 12px
    grain: (0.02 + 0.1 * t).toFixed(3),                  // 0.02 -> 0.12
    radius: t < 0.34 ? "14px" : t < 0.67 ? "6px" : "0px",// loud = harder corners
    stickerRot: `${(2 + 6 * t).toFixed(1)}deg`,
  };
}

const PATTERNS: Record<NonNullable<MaxCardProps["pattern"]>, string> = {
  none: "none",
  halftone:
    "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--max-ink) 22%, transparent) 1.5px, transparent 1.6px)",
  stripes:
    "repeating-linear-gradient(45deg, color-mix(in oklab, var(--max-magenta) 16%, transparent) 0 10px, transparent 10px 24px)",
  checks:
    "repeating-conic-gradient(color-mix(in oklab, var(--max-ink) 10%, transparent) 0% 25%, transparent 0% 50%)",
};

const PATTERN_SIZE: Record<NonNullable<MaxCardProps["pattern"]>, string> = {
  none: "auto",
  halftone: "18px 18px",
  stripes: "auto",
  checks: "24px 24px",
};

export function MaxCard({
  intensity = 60,
  title,
  sticker,
  pattern = "halftone",
  chromaticShadow = true,
  accent = "magenta",
  children,
  style,
  ...rest
}: MaxCardProps) {
  const s = scale(intensity);

  // Loud-layer budget: pattern + sticker + chromatic shadow + tilt.
  const loudLayers =
    (pattern !== "none" ? 1 : 0) +
    (sticker ? 1 : 0) +
    (chromaticShadow ? 1 : 0) +
    (intensity >= 50 ? 1 : 0);

  React.useEffect(() => {
    if (loudLayers > 3 && process.env.NODE_ENV !== "production") {
      console.warn(
        `[MaxCard] ${loudLayers} loud layers on "${title}" exceeds the budget of 3. ` +
          `Drop one of: pattern, sticker, chromaticShadow, or intensity below 50.`
      );
    }
  }, [loudLayers, title]);

  const shadow = chromaticShadow
    ? `${Math.round(s.shadowPx / 3)}px ${Math.round(s.shadowPx / 3)}px 0 var(--max-magenta), ` +
      `${Math.round((s.shadowPx * 2) / 3)}px ${Math.round((s.shadowPx * 2) / 3)}px 0 var(--max-cyan), ` +
      `${s.shadowPx}px ${s.shadowPx}px 0 var(--max-ink)`
    : `${s.shadowPx}px ${s.shadowPx}px 0 var(--max-ink)`;

  return (
    <article
      {...rest}
      style={{
        position: "relative",
        isolation: "isolate",
        background: "var(--max-surface)",
        color: "var(--max-ink)",
        border: `${s.strokePx} solid var(--max-ink)`,
        borderRadius: s.radius,
        boxShadow: shadow,
        padding: "var(--max-s-5)",
        rotate: s.tilt,
        fontFamily: "var(--max-font-body)",
        ...style,
      }}
    >
      {pattern !== "none" && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            backgroundImage: PATTERNS[pattern],
            backgroundSize: PATTERN_SIZE[pattern],
            opacity: Number(s.grain) * 6,
            pointerEvents: "none",
          }}
        />
      )}

      {sticker && (
        <span
          style={{
            position: "absolute",
            top: -18,
            right: -14,
            display: "grid",
            placeItems: "center",
            minWidth: 76,
            padding: "var(--max-s-2) var(--max-s-3)",
            background: `var(--max-${accent})`,
            color: "var(--max-paper)",
            fontFamily: "var(--max-font-display)",
            fontSize: "var(--max-t-lg)",
            lineHeight: 1.1,
            border: `${s.strokePx} solid var(--max-ink)`,
            borderRadius: "var(--max-r-blob)",
            rotate: s.stickerRot,
            boxShadow: "var(--max-shadow-hard)",
          }}
        >
          {sticker}
        </span>
      )}

      <h2
        style={{
          fontFamily: "var(--max-font-display)",
          fontSize: "var(--max-t-2xl)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          margin: "0 0 var(--max-s-3)",
        }}
      >
        {title}
      </h2>

      <div style={{ maxWidth: "46ch", lineHeight: "var(--max-leading-body)" }}>{children}</div>
    </article>
  );
}

export interface MaxButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intensity?: MaxIntensity;
  loading?: boolean;
}

export function MaxButton({
  intensity = 60,
  loading = false,
  disabled,
  children,
  style,
  ...rest
}: MaxButtonProps) {
  const s = scale(intensity);
  const [pressed, setPressed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const isOff = disabled || loading;

  const offset = pressed ? Math.max(2, s.shadowPx - 6) : hovered && !isOff ? s.shadowPx + 4 : s.shadowPx;

  return (
    <button
      {...rest}
      disabled={isOff}
      aria-busy={loading || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      style={{
        minHeight: 44,
        minWidth: 44,
        padding: "var(--max-s-3) var(--max-s-5)",
        fontFamily: "var(--max-font-display)",
        fontSize: "var(--max-t-base)",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        background: isOff ? "var(--max-surface-2)" : hovered ? "var(--max-lime)" : "var(--max-cyan)",
        color: isOff ? "var(--max-muted)" : "var(--max-ink)",
        border: `${s.strokePx} solid var(--max-ink)`,
        borderRadius: "var(--max-r-pill)",
        boxShadow: isOff ? "none" : `${offset}px ${offset}px 0 var(--max-ink)`,
        translate: pressed ? "0 2px" : hovered && !isOff ? "0 -4px" : "0 0",
        cursor: isOff ? "not-allowed" : "pointer",
        transition: "translate 220ms cubic-bezier(0.2,0.9,0.1,1.25), box-shadow 220ms cubic-bezier(0.2,0.9,0.1,1.25), background-color 220ms linear",
        ...style,
      }}
    >
      {loading ? "Working…" : children}
    </button>
  );
}
```

Pair it with one global rule so the component never has to know about the media query:

```css
@media (prefers-reduced-motion: reduce) {
  button, a, [role="button"] { transition-duration: 1ms !important; }
}
```

### Native / other platform

Maximalism is genuinely portable to SwiftUI — hard offset shadows, rotation, blend modes and mixed corner shapes all have first-class APIs — and this matters for consumer apps that want an expressive onboarding or celebration screen inside an otherwise standard shell.

```swift
import SwiftUI

struct MaxTokens {
    static let paper   = Color(red: 1.00, green: 0.973, blue: 0.906) // #FFF8E7
    static let ink     = Color(red: 0.043, green: 0.039, blue: 0.059) // #0B0A0F
    static let magenta = Color(red: 1.00, green: 0.180, blue: 0.533) // #FF2E88
    static let lime    = Color(red: 0.776, green: 1.00, blue: 0.00)  // #C6FF00
    static let cyan    = Color(red: 0.00, green: 0.898, blue: 1.00)  // #00E5FF
}

/// Zero-blur offset shadow: SwiftUI's .shadow always blurs, so draw a copy behind.
struct HardShadow: ViewModifier {
    var offset: CGFloat = 6
    var color: Color = MaxTokens.ink
    var radius: CGFloat = 14

    func body(content: Content) -> some View {
        content.background(
            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .fill(color)
                .offset(x: offset, y: offset)
        )
    }
}

extension View {
    func hardShadow(_ offset: CGFloat = 6, color: Color = MaxTokens.ink, radius: CGFloat = 14) -> some View {
        modifier(HardShadow(offset: offset, color: color, radius: radius))
    }
}

struct MaxCardView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @State private var pressed = false

    let title: String
    let body_: String
    let sticker: String?

    var body: some View {
        ZStack(alignment: .topTrailing) {
            VStack(alignment: .leading, spacing: 12) {
                Text(title)
                    .font(.system(size: 42, weight: .black, design: .default))
                    .textCase(.uppercase)
                    .kerning(-1.0)
                    .lineLimit(2)
                Text(body_)
                    .font(.system(size: 16))
                    .foregroundStyle(MaxTokens.ink)
                Button("Add to bag") { }
                    .font(.system(size: 16, weight: .heavy))
                    .textCase(.uppercase)
                    .frame(minWidth: 44, minHeight: 44)
                    .padding(.horizontal, 24)
                    .background(Capsule().fill(MaxTokens.cyan))
                    .overlay(Capsule().stroke(MaxTokens.ink, lineWidth: 3))
                    .foregroundStyle(MaxTokens.ink)
                    .hardShadow(pressed ? 2 : 6, radius: 999)
                    .offset(y: pressed ? 2 : 0)
                    .animation(reduceMotion ? nil : .spring(response: 0.22, dampingFraction: 0.6),
                               value: pressed)
            }
            .padding(24)
            .frame(maxWidth: 520, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(.white)
                    .overlay(
                        // Halftone ground; dropped entirely under Reduce Transparency.
                        reduceTransparency ? nil :
                        Canvas { ctx, size in
                            let step: CGFloat = 18
                            var y: CGFloat = 0
                            while y < size.height {
                                var x: CGFloat = 0
                                while x < size.width {
                                    ctx.fill(Path(ellipseIn: CGRect(x: x, y: y, width: 3, height: 3)),
                                             with: .color(MaxTokens.ink.opacity(0.18)))
                                    x += step
                                }
                                y += step
                            }
                        }
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    )
            )
            .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous)
                .stroke(MaxTokens.ink, lineWidth: 3))
            .hardShadow(10)
            .rotationEffect(.degrees(-1.5))

            if let sticker {
                Text(sticker)
                    .font(.system(size: 20, weight: .black))
                    .foregroundStyle(MaxTokens.paper)
                    .padding(.horizontal, 12).padding(.vertical, 8)
                    .background(Circle().fill(MaxTokens.magenta))
                    .overlay(Circle().stroke(MaxTokens.ink, lineWidth: 3))
                    .rotationEffect(.degrees(5))
                    .offset(x: 14, y: -18)
                    .accessibilityLabel("\(sticker) discount")
            }
        }
        .padding(32)
        .background(MaxTokens.paper)
    }
}
```

**Figma / Framer notes.** In Figma, build the loud layers as separate top-level frames with `Blend mode: Multiply` on the grain frame and clip content on the scene frame, and keep every accent as a *variable* rather than a raw fill so the intensity knob can be a mode swap (Quiet / Loud / Riot). In Framer, ambient marquees should use a Loop override with `Appear` disabled and an explicit `useReducedMotion()` guard, because Framer's default scroll and loop components do not honour the OS preference on their own.

**Jetpack Compose / React Native:** viable for the card, sticker and hard-shadow layers; not viable for blend-mode-driven layer interference without dropping to a custom shader or `RenderEffect`. If the design depends on `mix-blend-mode: difference` type inversion, expect to pre-render two asset variants instead.

## 6. Interaction & Motion

**The loud-layer budget.** The single rule that makes this style survivable: **at most three loud layers may compete inside one viewport at one time**, where a loud layer is any of — patterned ground, chromatic stacked shadow, rotated element, marquee, blend-mode overlay, oversized display type, sticker cluster, or animated ornament. Count them. Four or more is where usability testing turns.

**State treatments**

| State | Treatment | Values |
|---|---|---|
| Rest | Hard offset shadow, full stroke | `box-shadow: 6px 6px 0 ink`, `border: 3px` |
| Hover | Lift and deepen shadow, swap fill | `translate: 0 -4px`, shadow `10px 10px 0`, `background: lime`, `220ms` `--max-ease-snap` |
| Active / pressed | Push into the shadow | `translate: 0 2px`, shadow `2px 2px 0`, `120ms` linear |
| Focus-visible | Double ring, ground-independent | `outline: 4px solid cyan; outline-offset: 2px` plus `box-shadow: 0 0 0 8px ink` |
| Disabled | Desaturate, remove elevation | `filter: saturate(0.2)`, `box-shadow: none`, `color: --max-muted` (9.26:1 on surface light, 8.86:1 dark) |
| Loading | Text swap plus a 2px striped progress rail, never a spinner over pattern | `aria-busy="true"`, rail `repeating-linear-gradient` 8px, `1.2s` linear |
| Selected | Invert the plane rather than tint it | `background: ink; color: lime` (16.63:1) |

**Durations and easings.** Taps 120ms, hovers 220ms, entrances 420ms, ambient marquees 24s per full cycle (a 2× duplicated track translating `-50%`). Use `--max-ease-snap: cubic-bezier(0.2, 0.9, 0.1, 1.25)` for anything with a physical press metaphor — the overshoot past 1 is what makes a hard-shadow button feel like a physical object. Use `--max-ease-out: cubic-bezier(0.22, 1, 0.36, 1)` for entrances. Never use `ease-in-out` on state changes; it makes the snap feel mushy and defeats the style.

**What should animate:** `transform` / `translate`, `rotate`, `scale`, `opacity`, `box-shadow` offset (accepting the paint cost), and `background-color`. **What should not animate:** `width`, `height`, `top/left`, `margin`, `filter: blur()`, `backdrop-filter`, `border-width`, or anything that triggers layout on a page that already has 20+ composited layers. Scroll-linked rotation is acceptable only via `animation-timeline: view()` or a `ResizeObserver`-throttled rAF loop — never a raw `scroll` listener writing styles synchronously, which is the fastest way to blow the 200ms INP threshold.

**Flash safety.** Nothing may flash more than three times per second (WCAG 2.3.1). Colour-cycling backgrounds, strobing stickers and rapid `mix-blend-mode: difference` inversions are the three patterns that trip this in practice. Keep any full-area colour change to a minimum period of 400ms.

**prefers-reduced-motion.** The correct behaviour is not "disable all animation" — it is: stop everything ambient and infinite, keep everything that reports state.

```css
@media (prefers-reduced-motion: reduce) {
  /* 1. Kill ambient/infinite motion outright. */
  .max-marquee__track,
  [data-max-ambient] { animation: none !important; }

  /* 2. Make the marquee readable as static, scrollable content. */
  .max-marquee { overflow-x: auto; }

  /* 3. Keep state feedback, but instant and without displacement. */
  .max-btn { transition-duration: 1ms !important; }
  .max-btn:hover { translate: none; }

  /* 4. Freeze scroll-driven timelines. */
  * { animation-timeline: none !important; }

  /* 5. Rotation is vestibular for some users at scale; flatten large tilts. */
  [data-max-tilt] { rotate: 0deg !important; }
}
```

Provide a persistent in-page "Calm mode" toggle as well. `prefers-reduced-motion` is an OS-level, all-or-nothing setting, and a user who wants your marquee stopped without turning off animation on their whole machine has no other route. Store it in `localStorage` and reflect it as `data-calm="true"` on `<html>`.

## 7. Accessibility

Maximalism is the highest-risk style in this set. It is not inherently inaccessible, but it fails by default and every safeguard must be added deliberately. Toptal's 2026 essay puts it correctly: maximalism "demands more from a designer" precisely because text over patterns, layered stacking order, and rich animation each require explicit work.

**Criteria most often violated**

| Criterion | Level | How maximalism breaks it | Fix |
|---|---|---|---|
| **1.4.3 Contrast (Minimum)** | AA | Text at 4.5:1 against a *flat* accent, then dropped onto a patterned or photographic ground where local contrast collapses to 1.5:1 | Text sits only on opaque planes. Measure against the *lightest and darkest* pixel of the ground, not the average |
| **1.4.11 Non-text Contrast** | AA | 3px ink borders pass, but coloured borders (magenta on cream, 3.31:1) sit right on the 3:1 line and lime/cyan borders on cream (1.12:1, 1.45:1) fail outright | Never use lime, cyan, or orange as the *only* boundary indicator on a light ground |
| **1.4.12 Text Spacing** | AA | `line-height: 0.9` display type plus `letter-spacing: -0.04em` breaks when a user forces 1.5 line-height / 0.12em spacing | Apply tight tracking only to headings that have room to reflow; never clip with fixed heights |
| **1.4.13 Content on Hover or Focus** | AA | Sticker tooltips and hover-revealed collage fragments that cannot be dismissed | Make them dismissible with `Esc`, hoverable, and persistent |
| **2.2.2 Pause, Stop, Hide** | A | Infinite marquees, auto-rotating collages and looping GIF stickers that run longer than five seconds alongside other content | A visible pause control, or a global Calm mode toggle. This is a Level A failure — it is not negotiable |
| **2.3.1 Three Flashes** | A | Colour-cycling grounds and strobing `difference` blends | Cap full-area colour change frequency at 2.5Hz; prefer ≤ 1 change per 400ms |
| **2.4.7 Focus Visible** | AA | A single-colour focus ring disappears the moment focus lands on an element sitting on that colour | Double ring: 4px cyan inner + ink outer halo. Verified against all six accents |
| **2.4.11 Focus Not Obscured (Minimum)** | AA (new in 2.2) | Floating stickers, rotated overlapping cards, and sticky marquee bars cover the focused control | Reserve `scroll-margin-block` equal to sticky-bar height; keep ornament `pointer-events: none` and out of the focus path's z-order |
| **2.4.13 Focus Appearance** | AAA (new in 2.2) | Thin rings against a busy ground | The double-ring recipe meets the 2px-perimeter / 3:1-change bar |
| **2.5.8 Target Size (Minimum)** | AA (new in 2.2) | Rotated stickers used as buttons often have a bounding box under 24×24 CSS px once transformed | Enforce `min-height: 44px; min-width: 44px` on every interactive element. Rotation shrinks the axis-aligned hit box — measure after transform |
| **1.4.10 Reflow** | AA | Absolutely positioned collage fragments and negative margins overflow at 320px CSS width / 400% zoom | Collapse to a single column and drop all `position: absolute` ornament below 640px |
| **3.2.3 / 3.2.4 Consistent Navigation & Identification** | AA | Anti-grid layouts that move the nav on each page and style the same action three different ways | Ornament varies; navigation and primary actions do not |

**Contrast math you can reuse — light mode.** Using the palette in §4 against the two grounds:

- On ink `#0B0A0F`: lime **16.63:1** ✅, cyan **12.82:1** ✅, orange **6.91:1** ✅, magenta **5.63:1** ✅, violet 2.80:1 ❌, cobalt 2.89:1 ❌
- On paper `#FFF8E7`: violet **6.64:1** ✅, cobalt **6.45:1** ✅, magenta 3.31:1 ⚠️ (large text ≥ 18.66px bold / 24px regular, and non-text only), orange 2.70:1 ❌ (fails even the 3:1 non-text bar), cyan 1.45:1 ❌, lime 1.12:1 ❌
- Paper on ink: **18.63:1** ✅

**Contrast math — dark mode.** This table is not optional decoration; it is the reason the dark block in §4 carries two accent ramps. In dark mode the ground tokens swap — `--max-paper` becomes near-black `#0B0A0F` and `--max-ink` becomes cream `#FFF8E7` — so the *lifted* accents that make the dark ground sing are all illegal as text on the cream surface. Every ratio below is computed with the WCAG 2.x relative-luminance formula.

| Accent (dark ramp) | Value | On `--max-paper` `#0B0A0F` | On `--max-ink` `#FFF8E7` |
|---|---|---|---|
| `--max-lime` | `#C6FF00` | **16.63:1** ✅ | 1.12:1 ❌ |
| `--max-cyan` | `#00E5FF` | **12.82:1** ✅ | 1.45:1 ❌ |
| `--max-orange` | `#FF8A33` | **8.39:1** ✅ | 2.22:1 ❌ |
| `--max-cobalt` | `#7EA0FF` | **7.85:1** ✅ | 2.37:1 ❌ |
| `--max-violet` | `#B18CFF` | **7.58:1** ✅ | 2.46:1 ❌ |
| `--max-magenta` | `#FF5BA0` | **6.82:1** ✅ | 2.73:1 ❌ |
| `--max-violet-deep` | `#6C2BD9` | 2.80:1 ❌ | **6.64:1** ✅ |
| `--max-cobalt-deep` | `#1B39FF` | 2.89:1 ❌ | **6.45:1** ✅ |
| `--max-ink` on `--max-paper` | cream on near-black | **18.63:1** ✅ | — |

Read the two right-hand columns together: **not one lifted accent clears 3:1 on the cream surface.** The correct dark-mode bindings are therefore `--max-text-on-paper: var(--max-lime)` (16.63:1) and `--max-text-on-ink: var(--max-violet-deep)` (6.64:1) — `--max-cobalt-deep` at 6.45:1 is the interchangeable alternative. Binding `--max-text-on-ink` to the lifted violet, as an earlier draft did, produced `#B18CFF` on cream at **2.46:1**: a hard 1.4.3 failure on the exact token this section holds up as the safeguard.

The practical consequence: **half your accents are decoration-only on any given ground, and which half flips between light and dark mode.** That is why the token block in §4 defines `--max-text-on-paper`, `--max-text-on-ink` and `--max-accent-safe` role bindings and rebinds them — against recomputed ratios, not by rotating the palette and hoping — under both `prefers-color-scheme: dark` and `[data-theme="dark"]`, rather than letting authors pick colours directly.

**Focus-visible strategy.** One ring is not enough when the ground colour is unpredictable. Use two concentric rings whose combination always contains at least one colour ≥ 3:1 against whatever is behind it: `outline: 4px solid var(--max-cyan); outline-offset: 2px` plus `box-shadow: 0 0 0 8px var(--max-ink)`. Cyan-vs-ink is 12.82:1 internally, so the ring is visible against itself even where both are over a photograph. Never rely on `:focus` alone, and never remove the outline in favour of a background change on a style where background changes are already ambient.

**Screen reader and DOM order.** Anti-grid layouts are the most common source of DOM/visual order mismatch in this style. Rules: build the reading order in the DOM first, then displace visually with `grid-area`, `translate` and `rotate` — never with `order` or `flex-direction: row-reverse` on content that has a meaningful sequence. Every decorative layer (`ground`, `grain`, marquee, sticker doodles, arrows, tape) gets `aria-hidden="true"` and `pointer-events: none`. Duplicated marquee content must be duplicated *inside* an `aria-hidden` container so it is announced once or not at all. Stickers that carry real information ("50% OFF") must be real text with an `aria-label` giving the full sentence, not an image or a `::before`.

**Forced colours / Windows High Contrast.** Under `forced-colors: active`, all `background-image`, `box-shadow` and `mix-blend-mode` are discarded or overridden by the OS palette. A maximalist card whose only boundary is a coloured shadow becomes invisible. Every container therefore needs a real `border` — not a shadow — as its structural boundary, and the `@media (forced-colors: active)` block should explicitly reset patterns to `Canvas`, strokes to `CanvasText`, and the focus ring to `Highlight`. Test with Edge's forced-colors emulation, not by trusting the cascade.

**Reduce transparency.** `prefers-reduced-transparency` support, stated identically in docs 01, 03, 06, 08 and 10 of this set: shipped in Chrome and Edge 118+ (October 2023), behind the `layout.css.prefers-reduced-transparency.enabled` flag in Firefox, and unsupported in Safari as of August 2026 — WebKit has raised fingerprinting concerns. MDN marks it experimental and not Baseline. Honour it where available (drop grain, flatten patterned grounds) but **never make it the only defence**: the baseline design must be legible with all texture layers present, because most users will never trigger the query.

**Pass/fail checklist**

- [ ] Every text run measured against the darkest AND lightest pixel of its actual ground, ≥ 4.5:1 (or ≥ 3:1 for text ≥ 24px / 18.66px bold)
- [ ] No text placed directly on a pattern without an opaque plane behind it
- [ ] Every interactive target ≥ 44×44 CSS px measured **after** rotation
- [ ] Every interactive element takes its `min-height` and `min-width` from `--max-target-min` (44px) rather than a literal, and the computed value still measures ≥ 44px on the transformed box (2.5.8)
- [ ] Focus ring visible on all six accent colours plus paper, ink, and a photographic ground
- [ ] Focused element never obscured by sticky bars or floating ornament (2.4.11)
- [ ] Every infinite animation has a pause control or is stopped by Calm mode (2.2.2)
- [ ] Nothing changes full-area colour more than twice per second (2.3.1)
- [ ] `prefers-reduced-motion: reduce` stops all ambient motion, keeps all state feedback
- [ ] Layout reflows to a single column at 320px CSS width with no horizontal scroll (1.4.10)
- [ ] Layout survives 200% text zoom and forced 1.5 line-height / 0.12em letter-spacing (1.4.12)
- [ ] Tab order matches visual order despite anti-grid placement
- [ ] All decorative layers `aria-hidden="true"` + `pointer-events: none`
- [ ] `@media (forced-colors: active)` block present and manually verified in Edge
- [ ] Automated axe/Lighthouse pass **plus** one keyboard-only and one screen-reader pass — automation cannot see contrast against a pattern

## 8. Performance

Maximalism is the most expensive style in this set on every axis except JavaScript, and it is expensive in ways that automated budgets catch late.

**Compositing and layer count.** Each `mix-blend-mode` value other than `normal` creates a new stacking context, and blending forces the compositor to read back the backdrop before it can paint the element. A scene with a patterned ground, a multiplied grain layer, three chromatically-shadowed cards and a rotated marquee routinely produces 25-40 composited layers. Wrap each scene in `isolation: isolate` so blending is contained to the scene rather than resolving against the whole page backdrop — this alone typically halves blend cost. Keep blended elements small: a full-viewport `mix-blend-mode: multiply` overlay is the single most expensive thing in this style and costs real milliseconds per frame on integrated GPUs.

**Paint cost of hard shadows.** `box-shadow` with zero blur is far cheaper than a blurred shadow (no Gaussian pass), which is a genuine performance argument for the maximalist look over glassmorphism. But animating shadow *offset* still repaints; if you animate hover shadows on more than about eight simultaneously visible cards, move to a pseudo-element rectangle offset with `translate` instead, which stays on the compositor.

**Asset weight — the real problem.** Maximalism's cost is fonts and imagery, not CSS.

| Asset | Typical naive weight | Budget | How |
|---|---|---|---|
| Display typefaces (3-4 families) | 480-900 KB | **≤ 180 KB total** | One variable font with a weight+width axis replaces 6 statics; subset to Latin; `woff2`; `font-display: swap`; preload only the hero face |
| Grain / noise texture | 200-600 KB PNG | **≤ 2 KB** | Inline SVG `feTurbulence` data URI, or a 160×160 tiled PNG at ≤ 4 KB |
| Patterned grounds | 100-400 KB image | **0 KB** | `repeating-linear-gradient`, `repeating-conic-gradient`, `radial-gradient` dot grids |
| Collage cut-outs / stickers | 1-3 MB PNG set | **≤ 250 KB total** | AVIF with alpha, or SVG; `loading="lazy"` for anything below the fold; `decoding="async"` |
| Hero imagery | 1-2 MB | **≤ 200 KB** | AVIF, `srcset` at 480/960/1440, explicit `width`/`height` to protect CLS |

**Suggested page budget for a maximalist marketing page:** ≤ 180 KB fonts, ≤ 600 KB images above the fold, ≤ 120 KB JS (compressed), LCP ≤ 2.5s on a throttled 4G / mid-tier Android profile, CLS ≤ 0.1, **INP ≤ 200ms**. INP is the one to watch: industry reporting through 2026 has it as the most commonly failed Core Web Vital, and the practitioner consensus is that immersive and maximalist work ships fine "but only when you decide up front what the page can afford in JavaScript, media weight, and main-thread time, and design within it."

**Layout thrash.** The characteristic maximalist bug is a scroll listener that reads `getBoundingClientRect()` on twelve rotated stickers and writes `style.transform` in the same frame. Use `animation-timeline: scroll()` / `view()` where supported and an `IntersectionObserver` + rAF pattern elsewhere; never read and write geometry in the same synchronous block.

**Mobile and low-end devices.** Blend modes and large composited layers are where cheap Android devices fall over. Ship a reduced scene below a threshold:

```css
/* Coarse pointer + narrow viewport: assume constrained GPU. */
@media (max-width: 720px), (pointer: coarse) {
  .max-scene__grain { display: none; }
  .max-card { box-shadow: var(--max-shadow-hard); }  /* one layer, not three */
  .max-scene__ground { background-image: none; background: var(--max-surface-2); }
}
@media (prefers-reduced-data: reduce) {
  .max-scene__grain,
  [data-max-decorative-image] { display: none; }
}
```

Also gate on device memory in JS where you already have a script running: `if ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4) document.documentElement.dataset.calm = "true";`

**Cheaper fallbacks, in order of cost saved:** replace `mix-blend-mode` with a pre-composed `color-mix()` flat tone; replace a grain image with a CSS `repeating-conic-gradient` at low opacity; replace a chromatic 3-layer shadow with a single hard shadow; replace an animated marquee with a static ticker; replace rotated absolutely-positioned collage with a CSS grid where two children share a cell. Each step removes roughly one loud layer, which is also the accessibility remedy — the performance and a11y fixes point the same direction, which is unusual and worth exploiting.

## 9. When To Use / When Not To

**Use it when**

- The product's differentiator is taste, culture, or personality: music, streaming, fashion, food and beverage, festivals, publishing, agencies. Figma's own 2026 trend guidance names Spotify and Liquid Death as the reference points.
- You are building a **campaign or brand page** where exploration is the goal and there is no task to complete. This is the single strongest signal.
- Creator tools and indie SaaS competing against enterprise sameness, where brand recall beats familiarity — the Gumroad case, where the bold layout measurably outperformed cleaner alternatives on recall.
- Gen-Z-facing consumer products, where the Pinterest Predicts 2026 data (nonconformity, "beauty is missing the mark — on purpose") describes the actual audience expectation.
- Annual recaps, celebration moments, achievement screens, and end-of-year "wrapped" formats — the pattern Spotify has made into a genre.
- Editorial and long-form storytelling where scroll depth is the KPI and visual variety earns it.
- Empty states, upgrade walls, and onboarding inside an otherwise quiet product — accent-only maximalism, one loud surface at a time.
- Physical-adjacent brands (merch, print, events) where the digital surface should feel like the printed poster.

**Avoid it when**

- The interface is task-oriented and repeated daily: dashboards, admin consoles, CRMs, ticketing, IDEs, spreadsheets. "Maximalism reads as confident on a brand or campaign page where exploration is the point; it reads as chaos on a task-oriented app."
- Users are under time pressure or stress: checkout flows, banking, insurance claims, healthcare portals, emergency information.
- Regulated or high-trust contexts — finance, health, legal, government. Visual density reads as unseriousness, and WCAG conformance is often contractual rather than aspirational.
- The audience skews toward cognitive, attention, or vestibular disabilities, or toward older users; W3C's COGA guidance on making content usable for people with cognitive and learning disabilities is essentially a list of things this style does by default.
- Data-dense surfaces: tables, charts, analytics. Patterned grounds destroy the figure-ground separation charts depend on.
- Low-end device or low-bandwidth markets where the asset budget cannot absorb 180 KB of fonts plus AVIF collage.
- You do not have a designer who can hold the loud-layer budget. Maximalism executed by consensus becomes clutter within two sprints, because every stakeholder adds one more element and nobody removes one.
- Localisation into scripts with different metrics (Arabic, Thai, CJK) where 0.9 line-height display type clips diacritics and where 3-4 font families rarely all exist.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Cap the composition at **3 loud layers per viewport** and audit every new element against that count | Add a fourth pattern, sticker, or animation because a stakeholder asked for "more energy" |
| Anchor the palette with one near-black ink and one off-white paper doing all the legibility work | Let two saturated accents carry a text-on-background relationship (magenta on cyan is 2.28:1) |
| Put body text on an **opaque plane** with a real border | Set text directly on a halftone, photo, or gradient ground and hope the average contrast saves you |
| Bind accents to roles per ground (`--max-text-on-paper`, `--max-text-on-ink`) and swap them in dark mode | Let authors pick accent colours freely — half your palette fails on any given ground, and which half flips |
| Use `min-height: 44px; min-width: 44px` and re-measure the hit box **after** rotation | Ship a 5°-rotated 22px sticker as a button and assume 2.5.8 passes |
| Use a **double focus ring** (4px cyan inner + ink outer) so it survives every ground | Use a single-colour ring, or replace focus with a background swap on a style full of background swaps |
| Generate patterns and grain in CSS/SVG (≤ 2 KB) | Ship a 400 KB PNG noise tile and a 900 KB font stack |
| Give every infinite animation a pause control plus a persistent "Calm mode" toggle | Rely on `prefers-reduced-motion` alone — it is OS-wide and all-or-nothing |
| Wrap each blended scene in `isolation: isolate` and keep blend layers small | Apply `mix-blend-mode` to a full-viewport overlay on every page |
| Build reading order in the DOM, then displace visually with `grid-area` / `translate` / `rotate` | Reorder with `order` or `row-reverse` and break the tab sequence |
| Mark every ornament `aria-hidden="true"` and `pointer-events: none` | Let a decorative sticker sit in the accessibility tree announcing "image" |
| Keep navigation, primary actions, and error states visually consistent across the site | Restyle the nav per page because the anti-grid "wants" it |
| Ship a real `border` on every container so forced-colors mode keeps the boundary | Depend on `box-shadow` as the only edge — it disappears in Windows High Contrast |
| Degrade to one shadow, no grain, no pattern below 720px or on coarse pointers | Ship the full 40-composited-layer scene to a 4 GB Android device |
| Reserve maximalism for the brand surface and let the app shell stay quiet | Roll the aesthetic through settings screens, tables, and form validation |

## 11. In The Wild (2024-2026)

- **Figma brand refresh (September 16, 2024)** — the reference implementation. Figma's own blog documents "a vibrant and maximalist approach to color that contrasts bold primaries, bright neons, and muted earthy hues," three hero colour schemes each with light and dark modes, the custom variable typeface **Figma Sans** by **Grilli Type** (plus Figma Sans Condensed, Figma Mono, and Figma Hand by OH no Type), and a shape system of "primitives" with oversized "jumbo nodes." Led in-house over roughly a year by Creative Director **Damien Correll**. It's Nice That's coverage the same day notes the deliberate removal of cursors from everyday branding and the shift from Dinamo's Whyte to Figma Sans.
- **Spotify Wrapped 2025 (December 4, 2025)** — collage maximalism at consumer scale, and the most instructive counter-example to naive "more colour" maximalism. Jeremy Wirth (Global Executive Creative Director) and Rasmus Wangelin (Head of Brand Design) describe treating Wrapped "as a collage," "bold, layered, textured, and full of life," with type "dancing like sound waves" and source material from 1980s-90s mixtape inserts, club flyers and hand-made zines. The palette was cut to primarily black-and-white with colour reserved for key moments — a direct response to the "AI slop" criticism of Wrapped 2024.
- **Gumroad** — the neo-brutalist maximalist redesign that split design Twitter: pink and yellow sections, thick black borders, massive headlines. Gumroad's own user surveys reportedly showed stronger brand recall from the bold layout than from cleaner alternatives, which is the most-cited commercial evidence for the style.
- **Liquid Death** — named by Figma's 2026 trends resource as a maximalism exemplar alongside Spotify, for dense, high-energy, deliberately unhinged brand-site composition in a category (canned water) with no inherent visual interest.
- **Starface** and **Feastables** — cited in Toptal's June 2026 essay as commercially successful maximalist brand identities; Starface also appears in Figma's Vibrant Colour Palettes trend entry alongside Lush and Headspace, explicitly tied to Y2K nostalgia and dopamine design.
- **Glossier** and **Samsung** — named by Figma's 2026 trends resource under Bold Typography for kinetic lettering and variable fonts, the typographic half of the maximalist toolkit deployed inside otherwise disciplined brand systems.
- **Balenciaga, Diesel, Mailchimp** — named by Figma under neo-brutalism / anti-design for "raw, unpolished visuals," the adjacent style maximalism most often borrows strokes and hard shadows from.
- **ekmas/neobrutalism-components (neobrutalism.dev)** — Samuel Breznjak's React + Tailwind library on the shadcn/ui copy-paste model, ~5.3k GitHub stars, MIT. **Archived: the maintainer announced on 19 July 2025 that it is no longer maintained.** Its published tokens are still the most-copied numbers in the ecosystem, so it remains worth reading as a spec even though you should not start a project on it.
- **neobrutalism.com / RetroUI** — the maintained successor by the same author, shipping **50+ React components** plus blocks and templates on Radix UI / Base UI, a shadcn-style CLI, a Tailwind v4 `@theme` token set and a hosted MCP server. This is the current open-source starting point for the hard-stroke, hard-shadow half of the maximalist vocabulary; it does not ship the collage, grain, or blend-mode layers, which you add yourself. These are **two separate projects**, not one — the widely repeated "neobrutalism.dev has 100+ components and is the most complete option" line conflates them and its component count has no source. Full treatment in [./07-brutalism.md](./07-brutalism.md) §2 and §11.
- **Awwwards Site of the Day, 2026** — the award circuit's expression of maximalism this year is scroll-driven 3D cinematics rather than flat collage; heavy video backgrounds and full-page hero-image-with-overlay-text are both visibly in decline. No renderer-share percentages are quoted here: the numbers previously carried in this entry came from reference 20, which publishes no methodology and whose sample size (47 winners in a quarter) is inconsistent with Awwwards awarding one SOTD per day. Re-derive from the Awwwards archive if you need a figure.
- **1stDibs ninth annual Interior Designer Trends Survey (November 17, 2025)** — 468 design professionals worldwide; maximalism cited by **39%** as a most-requested style, up from **34% in 2023**; eclecticism at 38%; chocolate brown the top colour at 33%. Interiors rather than digital, but it is the only large-sample longitudinal measurement of the style's trajectory.
- **Pinterest Predicts 2026 (December 9, 2025)** — 21 trends framed around nonconformity, self-preservation and escapism, with the maximalist entries carrying the largest search deltas: "80s luxury" +225%, "avant garde makeup editorial" +270%, "maximalist accessories" +105%, "lace nails" +215%, "nails with different colors on each hand" +125%.

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui. Rows without a link are styles with no file in this set.

| Sibling | Combination | Verdict |
|---|---|---|
| [./07-brutalism.md](./07-brutalism.md) | Neo-brutalism supplies the hard 6px stroke, zero-blur offset shadow, and saturated flat fills; maximalism adds the third plane (pattern, collage, grain) and the second and third typeface. | **Best pairing by far.** Neo-brutalism is effectively maximalism with the layer count capped at two. Start there, add one layer. Doc 07 also owns the component-library landscape (neobrutalism.com / RetroUI), so take your primitives from there. |
| [./05-minimalism.md](./05-minimalism.md) | Grid discipline and flat components underneath, maximalist expression on top. | **The professional's combination, and the cheapest substrate.** A rigorous Swiss grid — which doc 05 owns as an alias, along with flat and flat 2.0 — is what stops anti-grid placement from becoming random; you break a grid you can see. Most well-executed maximalism is a strict 12-column baseline grid with three deliberate violations, built from flat components inside a loud container. |
| [./01-skeuomorphism.md](./01-skeuomorphism.md) | Torn paper, tape, halftone print texture, cassette inserts, stickers — physical-media skeuomorphism rather than the leather-and-linen kind. | **Works, and is the 2025-26 form.** Spotify Wrapped 2025's mixtape and zine references are exactly this hybrid. Keep the two grain recipes distinct: skeuomorphism's is 0.9 / 2 octaves at 0.04-0.06, this doc's is 0.8 / 3 at 0.04-0.12. |
| [./09-bento-grid.md](./09-bento-grid.md) | A bento grid as the container, maximalist treatment inside each tile. | **Works, and is the safest way to ship maximalism in a product.** Bento caps the blast radius: each tile is a bounded loud surface, the grid keeps reading order intact, and the three-loud-layer budget becomes enforceable per tile rather than per page. |
| [./03-glassmorphism.md](./03-glassmorphism.md) | Frosted panels floating over a maximalist ground. | **Clashes, and is an accessibility trap.** Glass depends on a legible backdrop; maximalist grounds are deliberately illegible. Text contrast becomes unmeasurable, and the combination stacks `backdrop-filter` blur (expensive) on top of blend modes (expensive). If you must, make the glass ≥ 92% opaque, which means it is no longer glass. |
| [./08-liquid-glass.md](./08-liquid-glass.md) | Apple's refractive material over a collage ground. | **Clashes harder than plain glass.** Liquid Glass adds displacement and an adaptive tint that *samples* the backdrop — point it at a maximalist ground and the tint chases the collage, so the same control changes colour as the page scrolls. Everything in the glassmorphism row applies, one rung more expensive. |
| [./02-neumorphism.md](./02-neumorphism.md) | Soft extruded surfaces inside a loud scene. | **Clashes hard.** Neumorphism's whole premise is low contrast between element and ground, and it already struggles with 1.4.11. Dropping it into a maximalist scene destroys both — the soft shadows vanish against pattern, and the low-contrast affordance becomes invisible. |
| [./04-claymorphism.md](./04-claymorphism.md) | Chunky rounded 3D clay shapes as the collage ornament. | **Works as ornament only.** Clay blobs make excellent stickers and mascots on a maximalist ground. Do not use clay for the interactive controls — its soft edges lose the hard-stroke affordance the style relies on, and clay's hue-matched shadow boundary becomes untestable over pattern. |
| [./10-spatial-ui.md](./10-spatial-ui.md) | Collage fragments distributed across a real z-ladder on one perspective stage. | **Works, and is where award-circuit maximalism actually went.** The scroll-driven 3D cinematics that dominate the 2026 shortlist are this hybrid. The discipline doc 10 supplies is the one maximalism most needs: a single shared stage and a fixed depth ladder, so parallax reads as space rather than as drift. Budget it as a loud layer — it counts against the three-layer cap. |
| Retro / Y2K — no doc in this set | Y2K supplies chrome gradients, bubble 3D, iridescence and lens flares; maximalism supplies the density and the collage grammar. | **Works well**, and is the dominant Gen-Z-facing hybrid. Watch the asset budget — chrome and iridescence are image-heavy where flat maximalism is not. |
| Aurora / mesh gradients — no doc in this set | Aurora mesh gradients as the ground plane under maximalist collage. | **Conditional.** Beautiful, but a mesh gradient plus grain plus blend mode plus stickers is four loud layers and blows both the budget and the GPU. Use the gradient *instead of* the pattern, never in addition. |

**Combination rules that hold across all of the above:** the loud-layer budget is shared, not per-style — pairing two styles does not give you six layers. And whichever style supplies the *interactive* controls should supply them consistently for the entire product; mixing a glass button and a hard-shadow button in one view destroys the affordance vocabulary faster than any amount of decoration.

## 13. Plugin Spec (draft)

**Skill name:** `maximalism-ui`

**Description:** Use when the user wants to make a UI louder, bolder, more expressive, or more "maximalist" — asking for dense layered layouts, clashing saturated colour, oversized display typography, collage or sticker or scrapbook treatments, hard offset shadows, patterned or grainy backgrounds, marquees, anti-grid placement, dopamine design, Y2K density, or an escape from flat minimal sameness — and when the surface is a brand page, campaign page, landing page, celebration moment, or creator-facing product rather than a task-oriented app shell.

**What the skill does**

1. Emits a `maximalism.tokens.css` layer with the full custom-property set from §4, including the dark-mode override block and the role bindings (`--max-text-on-paper`, `--max-text-on-ink`) that prevent illegal accent-on-ground pairings.
2. Rewrites the target components to the maximalist vocabulary: replaces soft blurred shadows with zero-blur offset shadows, replaces uniform border-radius with the mixed radius set, thickens borders to the 2/3/6px scale, and swaps the type stack to a display + kicker + body + mono quartet.
3. Adds up to three loud layers per scene — a CSS-generated patterned ground, an SVG-`feTurbulence` grain overlay, and one ornament class (stickers, marquee, or rotated collage) — and refuses to add a fourth.
4. Installs the double focus ring, the 44px minimum target enforcement, the `prefers-reduced-motion` block, the `prefers-reduced-transparency` block, the `forced-colors` block, and the mobile/coarse-pointer degradation block as a single non-removable `@layer maximalism.safety`.
5. Adds a persistent "Calm mode" toggle component (`data-calm` on `<html>`, persisted to `localStorage`) that stops all ambient motion and drops texture layers, satisfying WCAG 2.2.2 independently of OS settings.
6. Runs a contrast audit across every emitted text/ground pair and rewrites any failing pair to the nearest passing role-bound accent, reporting each substitution.
7. Emits a performance report: font bytes, image bytes, composited-layer estimate, blend-mode count, and animated-property list, flagged against the §8 budgets.

**Inputs it needs from the user**

| Input | Type | Default | Notes |
|---|---|---|---|
| `framework` | `vanilla` \| `tailwind4` \| `react` \| `svelte` \| `vue` \| `swiftui` | required | Determines emitted artefact shape |
| `basePalette` | 1-3 hex values | required | Skill derives the ink/paper anchors and a 4-6 accent ramp in OKLCH at chroma 0.18-0.30 |
| `density` | `airy` \| `standard` \| `packed` | `standard` | Maps to the `--max-s-*` spacing scale multiplier (1.25× / 1.0× / 0.7×) |
| `intensity` | 0-100 | `60` | Drives the five knobs below |
| `surfaceType` | `brand` \| `campaign` \| `editorial` \| `app-accent` | required | `app-accent` hard-caps intensity at 45 and forbids marquees and patterned grounds on data surfaces |
| `darkMode` | `media` \| `class` \| `none` | `media` | |
| `motionPolicy` | `full` \| `state-only` \| `none` | `full` | `state-only` omits all ambient/infinite animation from the output |

**Outputs it produces**

- `maximalism.tokens.css` — the `:root` block, dark-mode override, and role bindings
- `maximalism.safety.css` — `@layer` containing focus, target-size, reduced-motion, reduced-transparency, forced-colors, and low-end degradation rules
- Component set for the chosen framework: `Card`, `Button`, `Sticker`, `Marquee`, `Kicker`, `DisplayHeading`, `CalmToggle`
- `theme.css` `@theme` block when `framework=tailwind4`
- `MAXIMALISM-AUDIT.md` — contrast table with computed ratios for every emitted pair, loud-layer count per scene, asset budget table, and a list of every substitution the skill made and why
- Optional Figma variable JSON with three modes (Quiet / Loud / Riot) mapped to intensity 25 / 60 / 90

**Validation checklist the skill must self-run before returning**

1. Compute the WCAG relative-luminance contrast for every emitted text/ground pair; fail the run if any body text is below 4.5:1 or any large text/non-text boundary below 3:1.
2. Count loud layers per emitted scene; fail if any scene exceeds 3.
3. Confirm every interactive element derives its `min-height` and `min-width` from `--max-target-min` (44px) rather than a hard-coded value, that the computed size is ≥ that token, and re-check the axis-aligned bounding box after any `rotate`.
4. Confirm the double focus ring renders with ≥ 3:1 against each of the emitted accents plus paper, ink, and a neutral mid-grey stand-in for photography.
5. Confirm a `@media (prefers-reduced-motion: reduce)` block exists and that every `animation-iteration-count: infinite` declaration is cancelled by it.
6. Confirm a `CalmToggle` is emitted whenever any infinite animation is emitted (WCAG 2.2.2 is Level A).
7. Confirm a `@media (forced-colors: active)` block exists and that every container has a real `border` and not shadow-only boundaries.
8. Confirm total emitted font weight ≤ 180 KB and that no raster noise/pattern asset is emitted at all.
9. Confirm no animated property outside `transform`/`translate`/`rotate`/`scale`/`opacity`/`box-shadow`/`background-color`.
10. Confirm the layout has no `position: absolute` ornament remaining below the 640px breakpoint and no horizontal overflow at 320px CSS width.
11. Confirm every decorative element carries `aria-hidden="true"` and `pointer-events: none`.
12. Confirm DOM order matches intended reading order — no `order` or `row-reverse` applied to sequential content.

**Intensity knobs**

| Knob | Min (intensity 0) | Max (intensity 100) | Controls |
|---|---|---|---|
| `layerCount` | 1 (flat surface only) | 3 (ground + grain + ornament) | Number of simultaneous loud planes; **hard-capped at 3 regardless of intensity** |
| `chromaSpread` | 1 accent at OKLCH chroma 0.10 | 6 accents at chroma 0.30 | Palette breadth and saturation |
| `shadowStack` | `2px 2px 0` single ink | `4/8/12px` three-colour chromatic | Offset shadow depth and layer count |
| `tiltRange` | `0deg` | `±5deg` | Rotation applied to cards, stickers, marquees |
| `motionLoad` | 0 ambient animations, 120ms state transitions only | 3 ambient loops, 24s marquee, scroll-linked rotation | Ambient motion volume; forced to 0 under `prefers-reduced-motion` or Calm mode |

**Anti-patterns the skill must refuse to generate**

- Body text placed directly on a pattern, gradient, photograph, or grain layer without an opaque plane behind it
- Any text/ground pair below 4.5:1 (or 3:1 for large text) — including "just for the hero"
- More than three loud layers in one viewport, at any intensity value
- An infinite animation with no pause mechanism and no Calm toggle
- Any full-area colour change faster than 2.5 Hz, and any strobing `mix-blend-mode: difference` inversion
- Interactive targets under 24×24 CSS px after transform, or rotated sticker buttons with no enforced minimum
- Focus indication removed, or replaced by a background-colour change alone
- `mix-blend-mode` applied to a full-viewport overlay, or blend modes used without an `isolation: isolate` container
- Raster noise or pattern images when a CSS/SVG equivalent exists
- Maximalist treatment applied to tables, charts, form validation, error states, or checkout steps when `surfaceType` is `app-accent`
- `order` / `flex-direction: row-reverse` used to achieve anti-grid placement on sequential content
- Shadow-only container boundaries with no real `border` (invisible under forced colours)
- Glassmorphic translucent panels layered over patterned maximalist grounds
- More than four font families, or a font payload above 180 KB

## 14. References

1. *mix-blend-mode — CSS* — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode — MDN Web Docs, Mozilla — Baseline widely available since January 2020; page current 2026 — **[primary]**
2. *Web Content Accessibility Guidelines (WCAG) 2.2* — https://www.w3.org/TR/WCAG22/ — W3C — **W3C Recommendation 5 October 2023; current revision published 12 December 2024** — **[primary]**
3. *Making Content Usable for People with Cognitive and Learning Disabilities* — https://www.w3.org/TR/coga-usable/ — W3C (COGA Task Force) — **[primary]**
4. *Figma on Figma: Our Latest Brand Refresh* — https://www.figma.com/blog/figma-on-figma-evolving-our-visual-language/ — Figma Blog — September 16, 2024 — **[primary]**
5. *An expansive and expressive brand refresh marks a more "flexible" Figma* — https://www.itsnicethat.com/features/figma-brand-refresh-graphic-design-spotlight-160924 — It's Nice That — September 16, 2024 — **[secondary]**
6. *Designing 2025 Wrapped: Turning a Year of Listening into Art* — https://spotifyselects.substack.com/p/designing-2025-wrapped-turning-a — attributed to Spotify (Jeremy Wirth, Rasmus Wangelin) — December 4, 2025 — **[secondary, unverified provenance]** (a Substack newsletter, not a page on `spotify.com`, `newsroom.spotify.com` or `engineering.atspotify.com`. Every named individual, quoted title and the "cut back to black-and-white" claim in §2, §3 and §11 rests on this one source; nothing in it has been corroborated on an official Spotify channel. Downgraded from [primary] accordingly — if you find the write-up on a Spotify-owned domain, cite that instead and re-promote it.)
7. *Top Web Design Trends for 2026* — https://www.figma.com/resource-library/web-design-trends/ — Figma Resource Library — 2026 — **[primary]**
8. *Pinterest Predicts™: Nonconformity, self-preservation, and escapism drive 21 trends for 2026* — https://newsroom.pinterest.com/news/pinterest-predicts-nonconformity-self-preservation-and-escapism-drive-21-trends-for-2026/ — Pinterest Newsroom — December 9, 2025 — **[primary]**
9. *2026 Interior Design Trends: 1stDibs Survey Identifies Maximalism, Chocolate Brown, and Vintage Antiques as Top Designer Choices* — https://www.businesswire.com/news/home/20251117050937/en/2026-Interior-Design-Trends-1stDibs-Survey-Identifies-Maximalism-Chocolate-Brown-and-Vintage-Antiques-as-Top-Designer-Choices — 1stDibs via BusinessWire — November 17, 2025 — **[primary]**
10. *Tailwind CSS v4.0* — https://tailwindcss.com/blog/tailwindcss-v4 — Tailwind Labs — January 22, 2025 — **[primary]**
11. *CSS prefers-reduced-transparency* — https://developer.chrome.com/blog/css-prefers-reduced-transparency — Chrome for Developers — October 25, 2023 — **[primary]**
12. *prefers-reduced-transparency — CSS media feature* — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency — MDN Web Docs — updated April 2026 — **[primary]**
13. *forced-colors — CSS media feature* — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors — MDN Web Docs — updated April 2026 — **[primary]**
14. *What is maximalism in 90s web design?* — https://blog.logrocket.com/ux-design/maximalism-in-90s-web-design/ — Neel Dozome, LogRocket Blog — November 21, 2025 — **[secondary]**
15. *Maximalist Design and the Problem with Minimalism* — https://www.toptal.com/designers/ui/maximalist-design — Danae Botha, Toptal — updated June 10, 2026 — **[secondary]**
16. *Web Design Trends 2026 That Actually Survive Performance Budgets and AI Agents* — https://www.select-interactive.com/news/web-design-trends-2026-that-survive-performance-and-ai-agents — Select Interactive — June 29, 2026 — **[secondary]**
17. *The Re-Emergence of Maximalist Web Design and What it Might Mean?* — https://imanila.ph/2026/01/12/the-re-emergence-of-maximalist-web-design-and-what-it-might-mean/ — iManila — January 12, 2026 — **[secondary]**
18. *NeoBrutalism — Retro UI components for React* — https://neobrutalism.com/ — the maintained RetroUI project — accessed 8 August 2026 — **[primary]** (50+ components, Tailwind v4 `@theme` tokens, shadcn-style CLI. Note the domain/name pairing carefully: this is **neobrutalism.com**, the successor. It is a different project from **neobrutalism.dev** / `ekmas/neobrutalism-components`, which the same author archived on 19 July 2025 — see reference 18a. An earlier draft of this doc cited this URL while the body text named neobrutalism.dev, conflating the two.)
18a. *ekmas/neobrutalism-components* — https://github.com/ekmas/neobrutalism-components — Samuel Breznjak, MIT, ~5.3k stars — **archived 19 July 2025** — **[primary]** (the original neobrutalism.dev library; its token values are still the most-copied in the ecosystem)
19. *Understanding SC 1.4.11: Non-text Contrast (Level AA)* — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — W3C Web Accessibility Initiative — current — **[primary]** (the 3:1 adjacent-colour rule behind every ⚠️/❌ verdict in §7's two contrast tables. Replaces the previous entry here, a token summary on `docs.mew.design` that carried no verifiable authorship and duplicated material already sourced to references 14 and 15.)
20. *Awwwards — Site of the Day archive* — https://www.awwwards.com/websites/sites_of_the_day/ — Awwwards — accessed 8 August 2026 — **[primary]** (the winner list itself, one per day, which is the only defensible basis for any renderer-share claim about the award circuit. Replaces the previous entry, `digitalstrategyforce.com`, whose Q1 2026 breakdown is quoted nowhere in this doc any more: it publishes no methodology and its stated sample of 47 quarterly winners is inconsistent with the one-per-day cadence.)
