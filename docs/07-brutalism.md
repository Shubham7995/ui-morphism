---
name: brutalism
title: Brutalism & Neubrutalism
aliases: [neubrutalism, neo-brutalism, neobrutalism, brutalist web design, anti-design, hard-shadow UI, sticker UI]
category: ui-morphism
origin_year: 2014
peak_years: 2022-2026
status_2026: mainstream
difficulty: low
a11y_risk: medium
perf_cost: low
plugin_slug: brutalism-ui
last_researched: 2026-08-08
---

## 1. Essence

Brutalism on the web is two related but distinct things. **Raw web brutalism** (2014 onward) is anti-design: default HTML, system fonts, unstyled links, no grid discipline, deliberate ugliness as a rejection of template-driven polish. **Neubrutalism** (2021 onward) is the domesticated commercial descendant: a fully designed system built from hard 2-4px black borders, offset box-shadows with zero blur, flat saturated fills, and heavy display type, with all the usability affordances that raw brutalism throws away.

The single defining visual move of neubrutalism is the **hard offset shadow**: `box-shadow: 4px 4px 0 0 #000` on an element that also has `border: 2px solid #000`. No blur, no spread, no alpha. The shadow is a solid black duplicate of the element's box pushed down-right, which reads as a paper sticker lifted off the page rather than a soft light source. Hovering slides the element into its own shadow.

The feeling produced is loud, cheap-in-a-good-way, tactile, and unmistakably hand-built. In 2026 that last quality is the commercial argument: in a web full of AI-generated layouts that converge on the same soft-rounded gray card, visible authorial decisions read as a human signal.

## 2. Origin & Timeline

- **1950s-1960s — Architectural brutalism.** Raw board-marked concrete (*béton brut*), exposed structure, mass over ornament. Peter and Alison Smithson in the UK; the term popularised by critic Reyner Banham. Boston City Hall (1968) is the canonical North American example. The web movement borrows the *name and the honesty-of-materials rhetoric*, not the material vocabulary.
- **1990s — Accidental brutalism.** Early web pages are brutalist by default: no CSS, blue underlined links, `<table>` layout, system fonts. Craigslist (1996) and later Bloomberg's news pages preserve this look intentionally long after it stopped being necessary. This is the reference point neubrutalism nostalgically mines.
- **2014 — brutalistwebsites.com launches.** Pascal Deville, creative director at Zurich agency Freundliche Grüsse, starts cataloguing brutalist sites. His curation criterion is explicitly not just visual: "it's not only what you can see, it's also how it's built." This is the moment "brutalism" becomes a named web design category rather than an accident.
- **2016-2018 — Peak raw brutalism, then backlash.** Bloomberg's 2015 "What Is Code?" feature and a wave of agency/portfolio sites push the style into mainstream awareness. *Fast Company* runs a takedown in 2017. Critique consolidates around one point: the style's practitioners were mostly designers building for other designers, and the anti-usability posture was affordable only because nothing was at stake.
- **2019 — The counter-manifesto.** David Bryant Copeland publishes *Brutalist Web Design*, reframing brutalism as a set of **usability** principles rather than an aesthetic: content readable on all reasonable screens; only links and buttons respond to clicks; links are underlined and buttons look like buttons; the back button works; content is viewed by scrolling; decoration only when needed; performance is a feature. The site is still maintained (its current build was published 2024-04-04 and last updated 2025-06-01). This is the philosophical bridge from raw brutalism to neubrutalism.
- **November 2021 — Gumroad's redesign.** Announced by founder Sahil Lavingia in "Introducing the new Gumroad" on the company's tenth anniversary, the rebrand replaced a conventional SaaS look with thick black outlines, flat fills, and hard offset shadows across product and marketing. This is the inflection point: the first time a real commercial product with real revenue shipped the style at full strength. Within months, neubrutalist UI kits were climbing the Figma Community charts.
- **2022-2023 — Systematisation.** The style acquires a name (neubrutalism / neobrutalism), a component vocabulary, and reproducible tokens. Figma Community kits, Webflow "Neobrutalism" template categories, and Framer marketplace templates all appear. The aesthetic moves from mood to asset class.
- **2023-2024 — `ekmas/neobrutalism-components`.** Samuel Breznjak's shadcn/ui-derived React + Tailwind library becomes the de-facto reference implementation and canonicalises a specific token set: `--box-shadow-x: 4px`, `--box-shadow-y: 4px`, `--border-radius: 5px`, `border-2`, `--heading-font-weight: 700`, `--base-font-weight: 500`. Roughly 5.3k GitHub stars.
- **September 2024 — A correction to a common claim.** Figma's brand refresh (published 2024-09-16) is frequently cited as a neubrutalism adopter. The Figma post says the opposite: the refresh deliberately moved *past* "the static cursors and heavy black outlines that defined their brand for the past five years," toward Figma Sans (with Grilli Type), dynamic composition, and an expanded palette of "bold primaries, bright neons, and muted earthy tones." Figma is best described as **loud-flat, adjacent to neubrutalism, not an instance of it**. Do not cite it as a hard-border example.
- **11 April 2025 — Nielsen Norman Group codifies it.** Hayat Sheikh's "Neobrutalism: Definition and Best Practices" gives the style institutional definition and, crucially, guardrails: limit to 2-3 bold colours, 24-32px padding, bold headlines with clean body fonts (Roboto, Inter), verified contrast ratios. NN/g treating a trend as worth guidance is the signal it has stopped being a fad.
- **19 July 2025 — The reference library is retired.** Breznjak announces `ekmas/neobrutalism-components` is no longer maintained: he considers the goal achieved ("popularised the neo-brutalism style," "showed shadcn UI alternatives exist beyond monochromatic designs") and lost motivation. MIT licence, forks encouraged. Community consensus points to **RetroUI** as the maintained successor.
- **2025-2026 — Consolidation under a new name.** RetroUI rebrands to **neobrutalism.com**, shipping 50+ React components plus blocks and templates on Radix UI / Base UI with a shadcn-style CLI, a Tailwind v4 `@theme` token set, and a hosted MCP server so AI coding agents can search, preview, and install components. Its default tokens differ from the older library in one meaningful way: `--radius: 0` and a six-step hard-shadow scale (1px → 16px) rather than a single 4px offset.
- **2026 status — mainstream, not dominant, and quietly still growing.** The style is no longer novel and is no longer confined to portfolios. Two forces keep it alive past its predicted expiry: (a) it is the cheapest way to look non-generic when every AI-assisted layout converges on the same rounded-gray card, and (b) it has a genuinely low implementation cost, so it survives in marketing sites, creator tools, dev tools, and Gen-Z consumer brands where standing out beats blending in. The credible criticisms in 2026 are saturation (every third indie SaaS looks the same now) and corporate co-option (brands adopting the visual language of scrappy authenticity without any of the substance). Neither has killed it. **Verdict: mainstream for marketing surfaces and creator/dev-tool products; accent-only inside dense enterprise UI.**

## 3. Visual DNA

- **Hard offset shadow** — `box-shadow: <x> <y> 0 0 <ink>` where blur and spread are both exactly `0`. Canonical offset is `4px 4px`. Practical range `1px` (chips, inputs) to `16px` (hero cards). The offset is almost always positive-x/positive-y (down-right); reversing to `-4px -4px` is the "reverse" variant used for lifted/inverted states.
- **Ink-black borders** — `border: 2px solid #000` on essentially every interactive or containing element. 2px is the neobrutalism.dev default; 3px reads as heavier editorial; 4-5px is poster-scale. Border colour is a single token (`--nb-border`) shared with the shadow colour, which is what makes the shadow read as an extruded edge rather than a light effect.
- **Radius near zero** — either exactly `0` (neobrutalism.com default, the purer look) or a token `5px` (ekmas default, softens the sticker without rounding it). Anything ≥ 12px kills the style; it becomes claymorphism.
- **Flat saturated fills, no gradients** — solid single colours. Yellow `#FFDC58`, lime `#A3E635`, hot pink `#FF6B9D`, cyan `#67E8F9`, orange `#FF7A1A` are the recurring family. Two to three accents maximum per screen per NN/g guidance; more than three and hierarchy collapses.
- **Cream or off-white ground, never pure gray** — `#FEF6E4` / `#FFF7E8` class of warm off-whites. A neutral `#F5F5F5` gray ground makes the same components read as generic flat design.
- **Chunky display typography** — heavy grotesques or geometric sans at `font-weight: 700-900`, tight tracking (`letter-spacing: -0.02em`), sizes that clamp up to 4-6rem for hero text. Archivo Black + Space Grotesk is the neobrutalism.com default pairing. Lexend Mega, Public Sans, and Whyte also recur. Body copy sits at `font-weight: 500` — heavier than the usual 400, which is a deliberate part of the density.
- **Monospace as a second voice** — labels, metadata, badges, and technical chrome set in a mono at `text-transform: uppercase` and `letter-spacing: 0.06em`. This is the "technical brutalism" register.
- **Sticker composition** — elements overlap and rotate slightly (`transform: rotate(-2deg)`), pinned onto the ground rather than flowing in a grid. Rotation range is tight: ±1° to ±3°. Beyond 5° it reads as a scrapbook, not a UI.
- **Visible structure** — grid lines, section dividers at full border weight, exposed labels, and intentionally unhidden scaffolding. Dividers are the same 2px ink as component borders, not a hairline.
- **No blur anywhere** — no backdrop-filter, no soft drop-shadows, no glow. The absence of blur is as diagnostic as the presence of the hard shadow.
- **Hover = physical displacement** — the element translates by exactly the shadow offset and the shadow goes to `none`, so it visually presses flush into the page. This is the style's one signature interaction.
- **Illustration over photography** — flat vector, thick-outline illustration, emoji, and cut-out graphics. Photography, when used, is high-contrast, duotoned, or given its own 2px frame.

## 4. Anatomy & Design Tokens

Values below are drawn from the two reference implementations (`ekmas/neobrutalism-components` v4 and neobrutalism.com/RetroUI) with contrast figures computed against WCAG 2.x relative luminance. Every ratio quoted in this doc uses `#0A0A0A` — the actual `--nb-ink` / `--nb-on-accent` token — as the dark operand, never pure `#000000`. That distinction is worth about 0.9 of a ratio point on the yellow accent, so a figure computed against `#000000` will read slightly high for text that is never actually painted in `#000000`. `#000000` appears only as `--nb-border`, and only the border rows below are computed against it.

| Token group | Token | Light value | Dark value | Notes |
|---|---|---|---|---|
| Ground | `--nb-bg` | `#FEF6E4` | `#22222E` | Warm cream, not gray. 18.40:1 vs `#0A0A0A`. |
| Surface | `--nb-surface` | `#FFFFFF` | `#2E2E38` | Cards, sheets, inputs. |
| Ink | `--nb-ink` | `#0A0A0A` | `#F5F0E6` | Text and border colour source. |
| Border | `--nb-border` | `#000000` | `#F5F0E6` | **Deviates from ekmas on purpose** — see §7. |
| Accent (primary) | `--nb-accent` | `#FFDC58` | `#FFDC58` | 14.74:1 with `#0A0A0A` ink. |
| Accent 2 | `--nb-accent-2` | `#FF6B9D` | `#FF6B9D` | 7.39:1 with `#0A0A0A` ink; **2.68:1 with `#FFFFFF` — never white-on-pink**. |
| Accent 3 | `--nb-accent-3` | `#A3E635` | `#A3E635` | 13.13:1 with `#0A0A0A` ink. |
| Accent 4 | `--nb-accent-4` | `#67E8F9` | `#67E8F9` | 13.66:1 with `#0A0A0A` ink. |
| Accent 5 | `--nb-accent-5` | `#FF7A1A` | `#FF7A1A` | 7.59:1 with `#0A0A0A` ink. |
| Danger | `--nb-danger` | `#FF4D4D` | `#FF4D4D` | 6.05:1 with `#0A0A0A` ink. |
| Border width | `--nb-bw` / `--nb-bw-thick` | `2px` / `4px` | same | 2px default, 3px editorial, 4-5px poster. |
| Radius | `--nb-radius` | `0px` | same | Alt token `--nb-radius-soft: 5px` for the ekmas dialect. |
| Shadow X/Y | `--nb-sx` / `--nb-sy` | `4px` / `4px` | same | Blur and spread are always `0`. Negated as `--nb-sx-rev` / `--nb-sy-rev`. |
| Shadow scale | `--nb-shadow-xs` … `--nb-shadow-2xl` | `1px`→`16px` | same | Six steps: `-xs` 1, `-sm` 2, `--nb-shadow` (base) 4, `-lg` 6, `-xl` 10 (+1 spread), `-2xl` 16 (+1 spread). |
| Blur | — | `0` | `0` | Categorically absent. `backdrop-filter: none`. |
| Saturation | — | 85-100% OKLCH chroma-max for accents | same | No desaturated tints; no gradients. |
| Body font | `--nb-font-body` | Space Grotesk, Public Sans, Inter | same | `font-weight: 500` body. |
| Display font | `--nb-font-display` | Archivo Black, Lexend Mega | same | `font-weight: 700-900`. |
| Mono font | `--nb-font-mono` | JetBrains Mono, IBM Plex Mono | same | Uppercase labels, `0.06em` tracking. |
| Type scale | `--nb-text-xs…display` | 0.75 / 0.875 / 1 / 1.25 / 1.5 / 2 / clamp(2.5rem,8vw,5.5rem) rem | same | Minor-third-ish, with a violent jump to display. |
| Spacing | `--nb-space-1…8` | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px | same | Card padding 24-32px (NN/g). |
| Motion | `--nb-dur-fast` / `--nb-dur` | `100ms` / `150ms` | same | Press must feel instant. |
| Easing | `--nb-ease` | `cubic-bezier(0.2, 0, 0, 1)` | same | Snappy out-curve; `linear` also valid. |
| Focus ring | `--nb-focus-w` / `--nb-focus-offset` | `3px` / `2px` | same | Solid, never dashed, never blurred. |
| Min target | `--nb-target-min` | `44px` | same | Exceeds WCAG 2.2 SC 2.5.8's 24px floor. |

**There is no separate elevation token group, deliberately.** In this style elevation *is* offset distance — not blur, not opacity, not a tint — so the six-step `--nb-shadow-*` scale is the elevation ladder, and an element's "elevation step" means which step of that scale it sits on (`-xs` for chips and badges, `--nb-shadow` for buttons and inputs, `-lg` for cards, `-xl`/`-2xl` for hero and overlay surfaces). Do not introduce a parallel `elev` ladder on top of it; two names for one ramp is how the scale drifts.

### Ready-to-paste custom property block

```css
:root {
  color-scheme: light dark;

  /* ---- surfaces ---- */
  --nb-bg:            #FEF6E4;
  --nb-surface:       #FFFFFF;
  --nb-surface-sunk:  #F2EAD8;
  --nb-ink:           #0A0A0A;
  --nb-ink-muted:     #3D3D3D;
  --nb-border:        #000000;
  --nb-on-accent:     #0A0A0A;

  /* ---- accents (ratios are vs --nb-on-accent #0A0A0A; all pass >=4.5:1) ---- */
  --nb-accent:        #FFDC58;  /* 14.74:1 */
  --nb-accent-2:      #FF6B9D;  /*  7.39:1 */
  --nb-accent-3:      #A3E635;  /* 13.13:1 */
  --nb-accent-4:      #67E8F9;  /* 13.66:1 */
  --nb-accent-5:      #FF7A1A;  /*  7.59:1 */
  --nb-danger:        #FF4D4D;  /*  6.05:1 */
  --nb-overlay:       rgb(0 0 0 / 0.80);

  /* ---- geometry ---- */
  --nb-bw:            2px;
  --nb-bw-thick:      4px;
  --nb-radius:        0px;
  --nb-radius-soft:   5px;

  /* ---- hard shadows: blur and spread are always 0 ---- */
  --nb-sx:            4px;
  --nb-sy:            4px;
  --nb-sx-rev:        -4px;
  --nb-sy-rev:        -4px;
  --nb-shadow-xs:     1px 1px 0 0 var(--nb-border);
  --nb-shadow-sm:     2px 2px 0 0 var(--nb-border);
  --nb-shadow:        var(--nb-sx) var(--nb-sy) 0 0 var(--nb-border);
  --nb-shadow-lg:     6px 6px 0 0 var(--nb-border);
  --nb-shadow-xl:     10px 10px 0 1px var(--nb-border);
  --nb-shadow-2xl:    16px 16px 0 1px var(--nb-border);
  --nb-shadow-rev:    var(--nb-sx-rev) var(--nb-sy-rev) 0 0 var(--nb-border);

  /* ---- type ---- */
  --nb-font-display: "Archivo Black", "Lexend Mega", system-ui, sans-serif;
  --nb-font-body:    "Space Grotesk", "Public Sans", Inter, system-ui, sans-serif;
  --nb-font-mono:    "JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace;
  --nb-fw-body:      500;
  --nb-fw-heading:   700;
  --nb-fw-display:   900;
  --nb-track-tight:  -0.02em;
  --nb-track-label:   0.06em;

  --nb-text-xs:      0.75rem;
  --nb-text-sm:      0.875rem;
  --nb-text-base:    1rem;
  --nb-text-lg:      1.25rem;
  --nb-text-xl:      1.5rem;
  --nb-text-2xl:     2rem;
  --nb-text-display: clamp(2.5rem, 8vw, 5.5rem);
  --nb-leading-tight: 1.05;
  --nb-leading-body:  1.55;

  /* ---- space ---- */
  --nb-space-1: 4px;  --nb-space-2: 8px;  --nb-space-3: 12px; --nb-space-4: 16px;
  --nb-space-5: 24px; --nb-space-6: 32px; --nb-space-7: 48px; --nb-space-8: 64px;
  --nb-pad-card: 24px;

  /* ---- motion ---- */
  --nb-dur-fast: 100ms;
  --nb-dur:      150ms;
  --nb-ease:     cubic-bezier(0.2, 0, 0, 1);

  /* ---- focus / targets ---- */
  --nb-focus-color:  #0A0A0A;
  --nb-focus-w:      3px;
  --nb-focus-offset: 2px;
  --nb-target-min:   44px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --nb-bg:           #22222E;
    --nb-surface:      #2E2E38;
    --nb-surface-sunk: #1A1A24;
    --nb-ink:          #F5F0E6;
    --nb-ink-muted:    #B9B4AC;
    /* Light border in dark mode. Keeping #000 (as ekmas does) against the
       #2E2E38 dark surface gives 1.56:1 and fails WCAG 1.4.11. */
    --nb-border:       #F5F0E6;
    --nb-on-accent:    #0A0A0A;
    --nb-focus-color:  #FFFFFF;
    --nb-overlay:      rgb(0 0 0 / 0.85);
  }
}

:root[data-theme="dark"] {
  --nb-bg:           #22222E;
  --nb-surface:      #2E2E38;
  --nb-surface-sunk: #1A1A24;
  --nb-ink:          #F5F0E6;
  --nb-ink-muted:    #B9B4AC;
  --nb-border:       #F5F0E6;
  --nb-on-accent:    #0A0A0A;
  --nb-focus-color:  #FFFFFF;
  --nb-overlay:      rgb(0 0 0 / 0.85);
}
```

## 5. Implementation Recipes

### Vanilla CSS

```css
/* Assumes the :root block from section 4 is loaded. */

body {
  margin: 0;
  background: var(--nb-bg);
  color: var(--nb-ink);
  font-family: var(--nb-font-body);
  font-weight: var(--nb-fw-body);
  font-size: var(--nb-text-base);
  line-height: var(--nb-leading-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--nb-font-display);
  font-weight: var(--nb-fw-heading);
  letter-spacing: var(--nb-track-tight);
  line-height: var(--nb-leading-tight);
  margin: 0 0 var(--nb-space-4);
}

h1 { font-size: var(--nb-text-display); font-weight: var(--nb-fw-display); }

/* ---------- shared primitive ---------- */
.nb {
  border: var(--nb-bw) solid var(--nb-border);
  border-radius: var(--nb-radius);
  box-shadow: var(--nb-shadow);
  background: var(--nb-surface);
  color: var(--nb-ink);
}

/* ---------- button ---------- */
.nb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nb-space-2);
  min-height: var(--nb-target-min);
  padding: var(--nb-space-3) var(--nb-space-5);
  border: var(--nb-bw) solid var(--nb-border);
  border-radius: var(--nb-radius);
  box-shadow: var(--nb-shadow);
  background: var(--nb-accent);
  color: var(--nb-on-accent);
  font-family: var(--nb-font-body);
  font-size: var(--nb-text-base);
  font-weight: var(--nb-fw-heading);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform var(--nb-dur-fast) var(--nb-ease),
    box-shadow var(--nb-dur-fast) var(--nb-ease),
    background-color var(--nb-dur) var(--nb-ease);
}

/* The signature move: travel exactly the shadow offset, drop the shadow. */
.nb-btn:hover {
  transform: translate(var(--nb-sx), var(--nb-sy));
  box-shadow: 0 0 0 0 var(--nb-border);
}

/* Active goes 1px further so a click still reads as a click after hover. */
.nb-btn:active {
  transform: translate(calc(var(--nb-sx) + 1px), calc(var(--nb-sy) + 1px));
  box-shadow: 0 0 0 0 var(--nb-border);
}

.nb-btn:focus-visible {
  outline: var(--nb-focus-w) solid var(--nb-focus-color);
  outline-offset: var(--nb-focus-offset);
}

.nb-btn[disabled],
.nb-btn[aria-disabled="true"] {
  background: var(--nb-surface-sunk);
  color: var(--nb-ink-muted);
  box-shadow: none;
  transform: none;
  cursor: not-allowed;
  /* Do not rely on opacity alone: 0.5 opacity on #0A0A0A over the #FEF6E4
     cream composites to #848077, which is 3.66:1 against that same cream
     and fails 1.4.3 for enabled-looking text. */
}

.nb-btn--neutral { background: var(--nb-surface); }
.nb-btn--danger  { background: var(--nb-danger); }

/* "Reverse" variant: flat at rest, lifts up-left on hover. */
.nb-btn--reverse { box-shadow: none; }
.nb-btn--reverse:hover {
  transform: translate(var(--nb-sx-rev), var(--nb-sy-rev));
  box-shadow: var(--nb-shadow);
}

/* ---------- card ---------- */
.nb-card {
  border: var(--nb-bw) solid var(--nb-border);
  border-radius: var(--nb-radius);
  box-shadow: var(--nb-shadow-lg);
  background: var(--nb-surface);
  padding: var(--nb-pad-card);
  display: flex;
  flex-direction: column;
  gap: var(--nb-space-3);
}

.nb-card__title {
  font-family: var(--nb-font-display);
  font-size: var(--nb-text-xl);
  letter-spacing: var(--nb-track-tight);
  margin: 0;
}

/* ---------- input ---------- */
.nb-input {
  width: 100%;
  min-height: var(--nb-target-min);
  padding: var(--nb-space-3) var(--nb-space-4);
  border: var(--nb-bw) solid var(--nb-border);
  border-radius: var(--nb-radius);
  box-shadow: var(--nb-shadow-sm);
  background: var(--nb-surface);
  color: var(--nb-ink);
  font: inherit;
}

.nb-input::placeholder { color: var(--nb-ink-muted); opacity: 1; }

.nb-input:focus-visible {
  outline: var(--nb-focus-w) solid var(--nb-focus-color);
  outline-offset: var(--nb-focus-offset);
  box-shadow: var(--nb-shadow);
}

.nb-input[aria-invalid="true"] {
  background: color-mix(in oklab, var(--nb-danger) 18%, var(--nb-surface));
}

/* ---------- badge / sticker ---------- */
.nb-badge {
  display: inline-block;
  padding: var(--nb-space-1) var(--nb-space-3);
  border: var(--nb-bw) solid var(--nb-border);
  border-radius: var(--nb-radius);
  box-shadow: var(--nb-shadow-xs);
  background: var(--nb-accent-3);
  color: var(--nb-on-accent);
  font-family: var(--nb-font-mono);
  font-size: var(--nb-text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--nb-track-label);
  transform: rotate(-2deg);
}

/* ---------- Windows High Contrast / forced-colors ----------
   box-shadow is forced to none in forced-colors mode, so the entire
   depth language disappears. Borders survive, so lean on them. */
@media (forced-colors: active) {
  .nb, .nb-btn, .nb-card, .nb-input, .nb-badge {
    border: 2px solid ButtonBorder;
    box-shadow: none;
  }
  .nb-btn { background: ButtonFace; color: ButtonText; }
  .nb-btn:hover, .nb-btn:active { transform: none; }
  .nb-btn:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
  .nb-badge { transform: none; }
}

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .nb-btn, .nb-input, .nb-card { transition-duration: 1ms; }
  .nb-btn:hover { transform: none; box-shadow: var(--nb-shadow-sm); }
  .nb-btn:active { transform: none; box-shadow: none; }
  .nb-badge { transform: none; }
}
```

### Tailwind CSS v4

No plugin is required. Tailwind v4's `@theme` directive generates the utilities directly from CSS custom properties, which suits this style well because the shadow, border, and radius are all one-value tokens.

```css
/* app.css */
@import "tailwindcss";

@theme {
  /* colors -> bg-*, text-*, border-* */
  --color-nb-bg:        #FEF6E4;
  --color-nb-surface:   #FFFFFF;
  --color-nb-sunk:      #F2EAD8;
  --color-nb-ink:       #0A0A0A;
  --color-nb-muted:     #3D3D3D;
  --color-nb-border:    #000000;
  --color-nb-accent:    #FFDC58;
  --color-nb-accent-2:  #FF6B9D;
  --color-nb-accent-3:  #A3E635;
  --color-nb-accent-4:  #67E8F9;
  --color-nb-accent-5:  #FF7A1A;
  --color-nb-danger:    #FF4D4D;

  /* radius -> rounded-nb */
  --radius-nb: 0px;

  /* hard shadows -> shadow-nb, shadow-nb-lg, ... */
  --shadow-nb-xs:  1px 1px 0 0 var(--color-nb-border);
  --shadow-nb-sm:  2px 2px 0 0 var(--color-nb-border);
  --shadow-nb:     4px 4px 0 0 var(--color-nb-border);
  --shadow-nb-lg:  6px 6px 0 0 var(--color-nb-border);
  --shadow-nb-xl:  10px 10px 0 1px var(--color-nb-border);
  --shadow-nb-2xl: 16px 16px 0 1px var(--color-nb-border);

  /* offsets as spacing -> translate-x-nbx, translate-y-nby */
  --spacing-nbx:      4px;
  --spacing-nby:      4px;
  --spacing-nbx-rev: -4px;
  --spacing-nby-rev: -4px;

  /* type -> font-nb-display / font-nb-body / font-nb-mono */
  --font-nb-display: "Archivo Black", "Lexend Mega", system-ui, sans-serif;
  --font-nb-body:    "Space Grotesk", "Public Sans", Inter, system-ui, sans-serif;
  --font-nb-mono:    "JetBrains Mono", ui-monospace, monospace;

  --ease-nb: cubic-bezier(0.2, 0, 0, 1);
}

/* Dark mode via a class on <html>. */
@custom-variant dark (&:where(.dark, .dark *));

.dark {
  --color-nb-bg:      #22222E;
  --color-nb-surface: #2E2E38;
  --color-nb-sunk:    #1A1A24;
  --color-nb-ink:     #F5F0E6;
  --color-nb-muted:   #B9B4AC;
  --color-nb-border:  #F5F0E6;
}

/* forced-colors + reduced-motion guards, applied globally to nb utilities */
@layer utilities {
  @media (forced-colors: active) {
    .nb-guard { box-shadow: none !important; border-color: ButtonBorder !important; }
  }
}
```

Markup:

```html
<button
  class="nb-guard inline-flex min-h-11 items-center justify-center gap-2
         rounded-nb border-2 border-nb-border bg-nb-accent
         px-6 py-3 font-nb-body text-base font-bold text-nb-ink
         shadow-nb transition-all duration-100 ease-nb
         hover:translate-x-nbx hover:translate-y-nby hover:shadow-none
         active:translate-x-[5px] active:translate-y-[5px]
         focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nb-ink
         disabled:translate-none disabled:bg-nb-sunk disabled:text-nb-muted disabled:shadow-none
         motion-reduce:transition-none motion-reduce:hover:translate-none motion-reduce:hover:shadow-nb-sm">
  Ship it
</button>

<article
  class="nb-guard flex flex-col gap-3 rounded-nb border-2 border-nb-border
         bg-nb-surface p-6 shadow-nb-lg">
  <h3 class="font-nb-display text-2xl tracking-[-0.02em]">Hard edges only</h3>
  <p class="font-nb-body font-medium text-nb-ink">
    Blur is zero. Spread is zero. The shadow is the border, displaced.
  </p>
  <span class="w-fit -rotate-2 rounded-nb border-2 border-nb-border bg-nb-accent-3
               px-3 py-1 font-nb-mono text-xs font-bold uppercase tracking-[0.06em]
               text-nb-ink shadow-nb-xs">new</span>
</article>
```

### React component

TypeScript, props-driven, zero dependencies beyond React. Ships its own scoped stylesheet so it works in any bundler.

```tsx
// Brutal.tsx
import * as React from "react";

/* ------------------------------------------------------------------ */
/* Tokens + styles, injected once.                                     */
/* ------------------------------------------------------------------ */

const STYLE_ID = "brutal-ui-styles";

/* This sheet declares NO tokens of its own. It consumes the §4 `--nb-*` layer
   and supplies inline fallbacks so the components still render standalone —
   `var(--nb-dur, 150ms)`, not `--nb-dur: 150ms`. That is the difference
   between a component that respects the app's theme and one that quietly
   overrides it: an earlier draft declared a parallel `--b-*` set here, so
   anyone theming `--nb-*` saw no change in the React components at all.

   On the one value that genuinely differed: the old `--b-dur` was 100ms and
   §4's `--nb-dur` is 150ms. The set-wide token is 150ms and that is what these
   components use. §4 also defines `--nb-dur-fast: 100ms` for the tap-scale
   feedback that wants to beat the eye; the button below uses the 150ms base
   because the shadow-collapse travel needs to be *seen*, not just felt.

   Tokens the old `--b-*` set simply did not have, and which are now available
   because this sheet reads §4: `--nb-accent-4`, `--nb-accent-5`, the full
   `--nb-shadow-xs … -2xl` scale, `--nb-shadow-rev`, `--nb-bw-thick`,
   `--nb-radius-soft`, `--nb-focus-color / -w / -offset`, `--nb-target-min`,
   `--nb-overlay`, and the type/space scales. */
const CSS = `
[data-brutal-root] {
  color: var(--nb-ink, #0A0A0A);
  background: var(--nb-bg, #FEF6E4);
  font-family: var(--nb-font-body, "Space Grotesk", "Public Sans", Inter, system-ui, sans-serif);
  font-weight: var(--nb-fw-body, 500);
}
/* Dark values come from the §4 token layer (its guarded media query plus its
   :root[data-theme="dark"] block). This selector exists only so a root that is
   themed locally — a preview pane, a Storybook frame — still flips. */
[data-brutal-root][data-theme="dark"] {
  color-scheme: dark;
  --nb-bg: #22222E;
  --nb-surface: #2E2E38;
  --nb-surface-sunk: #1A1A24;
  --nb-ink: #F5F0E6;
  --nb-ink-muted: #B9B4AC;
  --nb-border: #F5F0E6;
  --nb-on-accent: #0A0A0A;
  --nb-focus-color: #FFFFFF;
  --nb-overlay: rgb(0 0 0 / 0.85);
}
.b-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: var(--nb-target-min, 44px); padding: 12px 24px;
  border: var(--nb-bw, 2px) solid var(--nb-border, #000000);
  border-radius: var(--nb-radius, 0px);
  box-shadow: var(--nb-sx, 4px) var(--nb-sy, 4px) 0 0 var(--nb-border, #000000);
  background: var(--nb-accent, #FFDC58); color: var(--nb-on-accent, #0A0A0A);
  font: inherit; font-weight: var(--nb-fw-heading, 700); line-height: 1; cursor: pointer;
  transition: transform var(--nb-dur, 150ms) var(--nb-ease, cubic-bezier(0.2, 0, 0, 1)),
              box-shadow var(--nb-dur, 150ms) var(--nb-ease, cubic-bezier(0.2, 0, 0, 1));
}
.b-btn[data-tone="neutral"] { background: var(--nb-surface, #FFFFFF); color: var(--nb-ink, #0A0A0A); }
.b-btn[data-tone="danger"]  { background: var(--nb-danger, #FF4D4D); color: var(--nb-on-accent, #0A0A0A); }
.b-btn[data-size="sm"] { min-height: 36px; padding: 8px 16px; font-size: var(--nb-text-sm, 0.875rem); }
.b-btn[data-size="lg"] { min-height: 56px; padding: 16px 32px; font-size: var(--nb-text-lg, 1.25rem); }
.b-btn:hover:not(:disabled):not([data-loading="true"]) {
  transform: translate(var(--nb-sx, 4px), var(--nb-sy, 4px));
  box-shadow: 0 0 0 0 var(--nb-border, #000000);
}
.b-btn:active:not(:disabled):not([data-loading="true"]) {
  transform: translate(calc(var(--nb-sx, 4px) + 1px), calc(var(--nb-sy, 4px) + 1px));
  box-shadow: 0 0 0 0 var(--nb-border, #000000);
}
.b-btn:focus-visible {
  outline: var(--nb-focus-w, 3px) solid var(--nb-focus-color, #0A0A0A);
  outline-offset: var(--nb-focus-offset, 2px);
}
.b-btn:disabled, .b-btn[data-loading="true"] {
  background: var(--nb-surface-sunk, #F2EAD8); color: var(--nb-ink-muted, #3D3D3D);
  box-shadow: none; transform: none; cursor: not-allowed;
}
.b-spinner {
  width: 14px; height: 14px; flex: none;
  border: 2px solid currentColor; border-right-color: transparent;
  animation: b-spin 700ms steps(8, end) infinite;
}
@keyframes b-spin { to { transform: rotate(360deg); } }
.b-card {
  display: flex; flex-direction: column; gap: 12px;
  padding: var(--nb-pad-card, 24px);
  border: var(--nb-bw, 2px) solid var(--nb-border, #000000);
  border-radius: var(--nb-radius, 0px);
  background: var(--nb-surface, #FFFFFF);
  box-shadow: var(--nb-shadow-lg, 6px 6px 0 0 var(--nb-border, #000000));
}
.b-card[data-tilt="true"] { transform: rotate(-1.5deg); }
.b-card__title { margin: 0;
  font-family: var(--nb-font-display, "Archivo Black", "Lexend Mega", system-ui, sans-serif);
  font-size: var(--nb-text-xl, 1.5rem);
  letter-spacing: var(--nb-track-tight, -0.02em); line-height: var(--nb-leading-tight, 1.05); }
.b-badge {
  display: inline-block; width: fit-content; padding: 4px 12px;
  border: var(--nb-bw, 2px) solid var(--nb-border, #000000);
  border-radius: var(--nb-radius, 0px);
  box-shadow: var(--nb-shadow-xs, 1px 1px 0 0 var(--nb-border, #000000));
  background: var(--nb-accent-3, #A3E635); color: var(--nb-on-accent, #0A0A0A);
  font-family: var(--nb-font-mono, "JetBrains Mono", ui-monospace, monospace);
  font-size: var(--nb-text-xs, 0.75rem); font-weight: var(--nb-fw-heading, 700);
  text-transform: uppercase; letter-spacing: var(--nb-track-label, 0.06em);
}
@media (forced-colors: active) {
  .b-btn, .b-card, .b-badge { box-shadow: none; border-color: ButtonBorder; }
  .b-btn { background: ButtonFace; color: ButtonText; }
  .b-btn:hover, .b-btn:active { transform: none; }
  .b-card[data-tilt="true"] { transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .b-btn { transition-duration: 1ms; }
  .b-btn:hover:not(:disabled) { transform: none;
    box-shadow: var(--nb-shadow-sm, 2px 2px 0 0 var(--nb-border, #000000)); }
  .b-btn:active:not(:disabled) { transform: none; box-shadow: none; }
  .b-card[data-tilt="true"] { transform: none; }
  .b-spinner { animation-duration: 2400ms; }
}
`;

function useBrutalStyles(): void {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export interface BrutalRootProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: "light" | "dark";
  /** 0-100. Scales border width, shadow offset and tilt. */
  intensity?: number;
}

export function BrutalRoot({
  theme = "light",
  intensity = 60,
  style,
  children,
  ...rest
}: BrutalRootProps) {
  useBrutalStyles();
  const t = Math.min(100, Math.max(0, intensity));
  const offset = Math.round(2 + (t / 100) * 8);      // 2px .. 10px
  const border = t < 33 ? 2 : t < 75 ? 3 : 4;         // 2px .. 4px
  const radius = t < 33 ? 6 : t < 75 ? 3 : 0;         // 6px .. 0px

  return (
    <div
      data-brutal-root=""
      data-theme={theme}
      style={{
        ["--nb-sx" as string]: `${offset}px`,
        ["--nb-sy" as string]: `${offset}px`,
        ["--nb-bw" as string]: `${border}px`,
        ["--nb-radius" as string]: `${radius}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "accent" | "neutral" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingLabel?: string;
}

export const BrutalButton = React.forwardRef<
  HTMLButtonElement,
  BrutalButtonProps
>(function BrutalButton(
  {
    tone = "accent",
    size = "md",
    loading = false,
    loadingLabel = "Loading",
    disabled,
    children,
    className,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={["b-btn", className].filter(Boolean).join(" ")}
      data-tone={tone}
      data-size={size}
      data-loading={loading ? "true" : "false"}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="b-spinner" aria-hidden="true" />}
      <span>{loading ? loadingLabel : children}</span>
    </button>
  );
});

/* ------------------------------------------------------------------ */
/* Card + Badge                                                        */
/* ------------------------------------------------------------------ */

export interface BrutalCardProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode;
  badge?: React.ReactNode;
  tilt?: boolean;
}

export function BrutalCard({
  title,
  badge,
  tilt = false,
  children,
  className,
  ...rest
}: BrutalCardProps) {
  const headingId = React.useId();
  return (
    <article
      className={["b-card", className].filter(Boolean).join(" ")}
      data-tilt={tilt ? "true" : "false"}
      aria-labelledby={title ? headingId : undefined}
      {...rest}
    >
      {badge && <span className="b-badge">{badge}</span>}
      {title && (
        <h3 id={headingId} className="b-card__title">
          {title}
        </h3>
      )}
      {children}
    </article>
  );
}

export function BrutalBadge({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={["b-badge", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </span>
  );
}
```

Usage:

```tsx
export default function Demo() {
  return (
    <BrutalRoot intensity={70} theme="light" style={{ background: "#FEF6E4", padding: 32 }}>
      <BrutalCard title="Hard edges only" badge="new" tilt>
        <p>Blur is zero. Spread is zero.</p>
        <BrutalButton tone="accent" onClick={() => alert("clack")}>
          Ship it
        </BrutalButton>
      </BrutalCard>
    </BrutalRoot>
  );
}
```

### Native / other platform

**SwiftUI** is the most relevant native target: the hard offset shadow maps to an offset rectangle rather than SwiftUI's `.shadow()` modifier, which is always blurred. Draw the shadow as a real shape underneath.

```swift
import SwiftUI

struct BrutalTokens {
    static let ink       = Color.black
    static let bg        = Color(red: 0.996, green: 0.965, blue: 0.894) // #FEF6E4
    static let surface   = Color.white
    static let accent    = Color(red: 1.0,   green: 0.863, blue: 0.345) // #FFDC58
    static let border: CGFloat = 2
    static let radius: CGFloat = 0
    static let offset:  CGFloat = 4
    static let duration: Double = 0.10
}

/// Hard, unblurred offset shadow. SwiftUI's .shadow() cannot do blur 0 cleanly,
/// so the "shadow" is a filled shape drawn behind the content.
struct HardShadow: ViewModifier {
    var offset: CGFloat = BrutalTokens.offset
    var pressed: Bool = false

    func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: BrutalTokens.radius)
                    .fill(BrutalTokens.surface)
            )
            .overlay(
                RoundedRectangle(cornerRadius: BrutalTokens.radius)
                    .strokeBorder(BrutalTokens.ink, lineWidth: BrutalTokens.border)
            )
            .background(
                RoundedRectangle(cornerRadius: BrutalTokens.radius)
                    .fill(BrutalTokens.ink)
                    .offset(x: pressed ? 0 : offset, y: pressed ? 0 : offset)
            )
            .offset(x: pressed ? offset : 0, y: pressed ? offset : 0)
    }
}

struct BrutalButtonStyle: ButtonStyle {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var tint: Color = BrutalTokens.accent

    func makeBody(configuration: Configuration) -> some View {
        let pressed = configuration.isPressed
        return configuration.label
            .font(.system(size: 17, weight: .bold, design: .default))
            .foregroundStyle(BrutalTokens.ink)
            .padding(.horizontal, 24)
            .frame(minHeight: 44)
            .background(
                RoundedRectangle(cornerRadius: BrutalTokens.radius).fill(tint)
            )
            .overlay(
                RoundedRectangle(cornerRadius: BrutalTokens.radius)
                    .strokeBorder(BrutalTokens.ink, lineWidth: BrutalTokens.border)
            )
            .background(
                RoundedRectangle(cornerRadius: BrutalTokens.radius)
                    .fill(BrutalTokens.ink)
                    .offset(x: pressed ? 0 : BrutalTokens.offset,
                            y: pressed ? 0 : BrutalTokens.offset)
            )
            .offset(x: pressed ? BrutalTokens.offset : 0,
                    y: pressed ? BrutalTokens.offset : 0)
            .animation(reduceMotion ? nil : .easeOut(duration: BrutalTokens.duration),
                       value: pressed)
    }
}

struct BrutalDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Text("HARD EDGES ONLY")
                .font(.system(size: 34, weight: .black))
                .kerning(-0.7)

            VStack(alignment: .leading, spacing: 12) {
                Text("Card").font(.system(size: 22, weight: .bold))
                Text("Blur is zero. Spread is zero.")
            }
            .padding(24)
            .frame(maxWidth: .infinity, alignment: .leading)
            .modifier(HardShadow(offset: 6))

            Button("Ship it") { }
                .buttonStyle(BrutalButtonStyle())
        }
        .padding(32)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(BrutalTokens.bg)
    }
}
```

**Figma notes.** Build the shadow as an **Effect style** named `nb/shadow-4` with type *Drop shadow*, X 4, Y 4, Blur **0**, Spread **0**, colour `#000000` at 100%. Create `nb/shadow-1`, `-2`, `-6`, `-10`, `-16` for the scale. Set corner radius on all components to 0 (or 5 for the softer dialect), and create a 2px inside stroke style `nb/border`. Because Figma's Auto Layout does not reserve space for effects, always add 4-6px of bottom/right padding to frames containing shadowed children or the shadow will clip. Use Variables for `border-width`, `shadow-offset`, and `radius` so the intensity knob is a single mode switch.

**Jetpack Compose / React Native.** Both are viable but need the same workaround as SwiftUI: Compose's `Modifier.shadow()` and React Native's `shadowRadius`/Android `elevation` are blur-based and cannot express a zero-blur offset. Draw a second offset `Box`/`View` behind the content filled with the border colour. On React Native for Android, `elevation` also forces a Material-style ambient shadow, so set `elevation: 0` explicitly and use the offset-view technique. React Native 0.76+ on iOS supports `boxShadow` with `blurRadius: 0`, which is the cleaner path where available.

## 6. Interaction & Motion

The whole motion language is one idea: **the element and its shadow are two rigid bodies, and interaction collapses the gap between them.** Nothing eases slowly; nothing fades.

| State | Treatment | Values |
|---|---|---|
| Rest | Border + hard shadow at the element's step on the `--nb-shadow-*` scale | `border: var(--nb-bw) solid var(--nb-border)`, `box-shadow: var(--nb-shadow)` |
| Hover | Translate by exactly the shadow offset, shadow to `none` | `transform: translate(4px, 4px)`; `box-shadow: 0 0 0 0` |
| Active / pressed | Translate offset + 1px, shadow `none` | `translate(5px, 5px)` |
| Focus-visible | Solid outline outside the border, never replacing it | `outline: 3px solid var(--nb-focus-color); outline-offset: 2px` |
| Disabled | Shadow removed, fill drops to sunk surface, no transform | `background: var(--nb-surface-sunk)`; `color: var(--nb-ink-muted)`; `cursor: not-allowed`; `aria-disabled` or `disabled` |
| Loading | Shadow removed (element reads as pressed-and-held), `aria-busy="true"`, stepped spinner | `steps(8, end)` 700ms rotation |
| Selected / checked | Fill flips to accent, shadow stays; optionally shadow inverts to `--nb-shadow-rev` | `background: var(--nb-accent)` |
| Error | Fill tinted with danger via `color-mix`, border stays ink | `color-mix(in oklab, var(--nb-danger) 18%, var(--nb-surface))` |

**Durations.** `100ms` for the press displacement, `150ms` for colour changes, `0ms` (instant) for shadow removal if you want a harder mechanical read. Anything above `200ms` makes the press feel rubbery and destroys the "solid object" illusion. The style is genuinely better with *fast and slightly abrupt* motion than with smooth motion.

**Easing.** `cubic-bezier(0.2, 0, 0, 1)` (aggressive out-curve) or plain `linear`. Avoid spring/bounce easings and avoid `ease-in-out` — overshoot contradicts the rigid-object metaphor. Stepped easings (`steps(4, end)`) on loaders and marquees reinforce the low-fidelity register.

**What should animate:** `transform` (translate/rotate only), `box-shadow` between two hard values, `background-color`, `border-color`.
**What should not animate:** blur (there is none), `opacity` fades on primary content, `width`/`height`/`top`/`left` (layout thrash), and shadow blur interpolation. Animating `box-shadow` does force repaint, so on lists of more than ~50 hoverable cards, animate only `transform` and toggle the shadow with a non-transitioned class change.

**Marquees and tickers** are a genuine idiom here (the reference library ships `--animate-marquee: marquee 5s linear infinite`). They are also a WCAG 2.2 SC 2.2.2 (Pause, Stop, Hide) liability if they run longer than 5 seconds: provide a pause control or stop them under `prefers-reduced-motion`.

**prefers-reduced-motion.** Do not delete the state feedback, only the movement. Under reduce:

```css
@media (prefers-reduced-motion: reduce) {
  .nb-btn { transition-duration: 1ms; }
  /* keep a visible difference: shrink the shadow instead of moving the box */
  .nb-btn:hover  { transform: none; box-shadow: var(--nb-shadow-sm); }
  .nb-btn:active { transform: none; box-shadow: none; }
  .nb-badge, .nb-card[data-tilt="true"] { transform: none; }
  .nb-marquee { animation: none; }
}
```

The shadow-shrink substitution matters: reduced-motion users still need a hover affordance, and `box-shadow` size change without transform is a non-vestibular cue.

## 7. Accessibility

Neubrutalism's risk profile is unusual: its *default* palette is often better than average for contrast, and its *default* structure is often worse than average. High-contrast black-on-yellow passes AAA trivially. What breaks is focus, targets, forced-colors, motion, and DOM order.

### Criteria most often violated

- **1.4.3 Contrast (Minimum), AA.** The failure is almost never black-on-accent; it is *white-on-accent* and *accent-on-white*. White text on `#FF6B9D` is **2.68:1** (fail). Yellow `#FFDC58` text on white is **1.34:1** (catastrophic fail). Rule: accents are backgrounds with black text, never foregrounds on light grounds.
- **1.4.11 Non-text Contrast, AA.** Requires ≥ 3:1 for UI component boundaries and states against adjacent colours. Two specific traps: (a) **dark mode with black borders.** `ekmas/neobrutalism-components` keeps `--border: oklch(0% 0 0)` in `.dark`; that black border against a `#2E2E38`-class dark surface is **1.56:1** and fails. Flip the border to a light ink in dark mode. (b) Accent-on-accent adjacency, e.g. a lime button on a yellow section — `#A3E635` vs `#FFDC58` is about **1.12:1**, so the button's *fill* is invisible and only the border carries the boundary. The 2px ink border rescues this, which is a real argument for never shipping borderless variants.
- **1.4.1 Use of Color, A.** Because everything is a flat block, state is frequently communicated by fill colour alone (selected chip, error field). Add a glyph, a border-weight change, or text.
- **2.4.7 Focus Visible, AA** and **2.4.13 Focus Appearance, AAA.** The most common neubrutalist bug is `outline: none` plus "the shadow is the focus indicator." A shadow is not a focus ring: it is present at rest. Use a real `outline` at ≥ 2px (2.4.13 requires a minimum 2px thickness and 3:1 contrast against both the focused and unfocused states); 3px with 2px offset is the safe choice here because the element already has a 2px ink border that a thin ring would blend into.
- **2.4.11 Focus Not Obscured (Minimum), AA.** Sticker-style overlapping and rotated elements, plus sticky brutalist headers with heavy borders, routinely cover a focused control. Reserve `scroll-margin-block: calc(var(--header-h) + 8px)` on focusable content.
- **2.5.8 Target Size (Minimum), AA.** The `44px` `--nb-target-min` floor from §4 comfortably exceeds this criterion's 24×24 CSS px minimum, which is why every control in §5 sets `min-height: var(--nb-target-min)`. Neubrutalist badge-buttons and icon chips are often 20px squares because the border makes them look bigger than they are. Note the border is inside the 24px box: a 24px button with 2px borders has a 20px content area but still satisfies 2.5.8 since the criterion measures the target, not the content. Ship the `--nb-target-min` 44px anyway for touch.
- **2.2.2 Pause, Stop, Hide, A.** Marquees, auto-rotating stickers, infinite tickers.
- **2.3.3 Animation from Interactions, AAA.** Bulk page-level tilt/parallax; honour `prefers-reduced-motion`.
- **1.3.1 Info and Relationships / 1.3.2 Meaningful Sequence, A.** Asymmetric, absolutely-positioned, rotated collage layouts often produce a DOM order that does not match the visual order. This is the style's most under-reported failure. Any layout built with `position: absolute` plus `order`/`grid-area` reordering must be tab-tested.
- **1.4.4 Resize Text / 1.4.10 Reflow, AA.** `clamp(2.5rem, 8vw, 5.5rem)` display type at 320px width and 200% zoom overflows constantly. Set a `min` in the clamp that actually fits, and give display headings `overflow-wrap: anywhere` plus `hyphens: auto`.

### Contrast math you can reuse

Foreground in the text rows is `#0A0A0A`, the `--nb-ink` / `--nb-on-accent` token from §4 — not pure `#000000`, which in this token set is only ever the *border* colour. Ratios are WCAG 2.x relative-luminance, shown to two decimals. Per W3C, a value is never rounded *up* to meet a threshold: 2.999:1 fails a 3:1 requirement.

| Pair | Ratio | Verdict |
|---|---|---|
| `#0A0A0A` on `#FEF6E4` (body) | 18.40:1 | AAA |
| `#0A0A0A` on `#FFDC58` (yellow btn) | 14.74:1 | AAA |
| `#0A0A0A` on `#67E8F9` (cyan) | 13.66:1 | AAA |
| `#0A0A0A` on `#A3E635` (lime) | 13.13:1 | AAA |
| `#0A0A0A` on `#FF7A1A` (orange) | 7.59:1 | AAA |
| `#0A0A0A` on `#FF6B9D` (pink) | 7.39:1 | AAA |
| `#0A0A0A` on `#FF4D4D` (danger) | 6.05:1 | AA (fails AAA body) |
| `#FFFFFF` on `#FF6B9D` | 2.68:1 | **Fail** |
| `#FFDC58` on `#FFFFFF` | 1.34:1 | **Fail** |
| `#000000` border on `#2E2E38` dark surface | 1.56:1 | **Fail 1.4.11** |
| `#F5F0E6` border on `#2E2E38` dark surface | 11.82:1 | Pass |

Swapping the foreground to pure `#000000` raises each text row by roughly 0.4-1.1 — yellow becomes 15.63:1, danger 6.42:1, the cream ground 19.52:1 — which is why the operand has to be stated. Quoting a `#000000` figure next to a `#0A0A0A` label overstates every accent in the table.

### Focus-visible strategy

```css
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: 3px solid var(--nb-focus-color);
  outline-offset: 2px;
  /* keep the resting shadow so focus is additive, not substitutive */
}
@media (forced-colors: active) {
  :where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
}
```

Never use `box-shadow` spread as the focus ring in this style — it is indistinguishable from the resting hard shadow, and it disappears entirely in forced-colors mode.

### Forced colors / Windows High Contrast

Per MDN, forced-colors mode forces `box-shadow: none` and `text-shadow: none`, and overrides `color`, `background-color`, `border-color`, and `outline-color` with system colours. **This deletes the entire neubrutalist depth language in one step.** Borders survive as shapes (their colour is overridden but their geometry remains), which is why a border-first implementation degrades gracefully and a shadow-only one does not.

Rules:
1. Every element that relies on the hard shadow for its boundary must also have a real `border`.
2. Add a `@media (forced-colors: active)` block that zeroes shadows and transforms and pins colours to `ButtonFace`/`ButtonText`/`Canvas`/`CanvasText`/`Highlight`.
3. System colours are chosen from *native element semantics*, not ARIA roles — a `<div role="button">` will not get `ButtonText`. Use real `<button>` elements. This is also a plain Copeland-brutalism principle: buttons should look like and be buttons.
4. Use `forced-color-adjust: none` only on decorative brand marks, never on interactive controls.

### Reduce transparency

The style uses no transparency except modal overlays (`rgb(0 0 0 / 0.8)`). Under `prefers-reduced-transparency: reduce`, push overlays to a solid `#000` or to the sunk surface. There is no `backdrop-filter` to remove, which is one of the style's genuine accessibility advantages over glassmorphism.

### Pass/fail checklist

- [ ] Every accent colour is used as a **background** with `#0A0A0A` text, never as text on a light ground.
- [ ] No more than 3 accent colours are visible in one viewport.
- [ ] Border-vs-adjacent-surface contrast ≥ 3:1 in **both** themes (check dark mode explicitly).
- [ ] Every interactive element has a real `border`, not shadow-only definition.
- [ ] `:focus-visible` uses `outline`, ≥ 3px, offset 2px, ≥ 3:1 against both the component and the page.
- [ ] No `outline: none` anywhere without a replacement outline.
- [ ] All targets ≥ 24×24 CSS px, and every control clamps to `var(--nb-target-min)` (44px); rotated stickers measured after transform.
- [ ] Tab order matches visual order in every rotated/absolutely-positioned composition.
- [ ] `@media (forced-colors: active)` block exists and was tested in Windows High Contrast.
- [ ] `@media (prefers-reduced-motion: reduce)` removes translate/tilt but keeps a visible hover cue.
- [ ] Any marquee/ticker has a pause control or stops under reduced motion.
- [ ] Display headings do not overflow at 320px width and 200% zoom.
- [ ] State is never signalled by fill colour alone.
- [ ] Disabled controls do not rely on `opacity` alone for their contrast story.

## 8. Performance

Neubrutalism is one of the cheapest visual styles to render. It is the direct opposite of glassmorphism on every performance axis.

**Rendering cost.** The paint cost of `box-shadow` scales roughly with the square of the blur radius, because each shadow pixel samples a neighbourhood proportional to the blur. Neubrutalism sets blur to `0`, so a hard shadow is a single solid rect fill — approximately the same cost as a `background-color` on an equally sized box. There is no Gaussian pass, no separate blur surface, and no `backdrop-filter` readback of the compositor's backing store.

**Compositing.** At rest, a hard-shadowed card needs no layer promotion. On hover, the element animates `transform: translate()`, which is a compositor-only property and does not trigger layout or paint. The `box-shadow` change *does* repaint, but only the element's own bounds. Two mitigations for dense grids:

```css
/* 1. Promote only while interaction is possible, then release. */
.nb-card { will-change: auto; }
.nb-grid:hover .nb-card { will-change: transform; }

/* 2. On very dense lists, transition transform only and swap the shadow
      via a non-transitioned custom property. */
.nb-card--dense {
  transition: transform 100ms var(--nb-ease);
  transition-property: transform;
}
.nb-card--dense:hover { transform: translate(4px, 4px); box-shadow: none; }
```

Never blanket-apply `will-change: transform` to every card: on a 200-card grid that creates 200 composited layers and can cost tens of megabytes of GPU memory on mobile.

**Layout implications.** `box-shadow` does not participate in layout, so a 16px offset shadow will be clipped by any ancestor with `overflow: hidden` and will not be counted by Auto Layout-style padding logic. Reserve `padding-right`/`padding-bottom` equal to the largest shadow offset on shadow-containing containers, or the design silently loses its depth at container edges. Similarly, the hover translate moves the element *outside* its layout box; on a tightly packed grid this creates visual overlap with the neighbour. Keep grid gaps ≥ shadow offset + 4px.

**Asset weight.** The style's real cost is fonts, not pixels. Archivo Black is display-only and should be subset to Latin + the characters actually used; a full-weight Archivo Black WOFF2 is roughly 25-40 KB, and a subset can land under 12 KB. Space Grotesk at 500 + 700 is roughly 30-45 KB for two subset weights. Budget:

| Item | Budget |
|---|---|
| Display font (subset, WOFF2) | ≤ 15 KB |
| Body font, 2 weights (subset, WOFF2) | ≤ 45 KB |
| Mono font (optional, subset) | ≤ 20 KB |
| Style CSS (tokens + components, minified + brotli) | ≤ 6 KB |
| Raster assets | 0 — the style is drawable in CSS |
| Added JS for the aesthetic | 0 |
| Hover frame budget on a 60-card grid | ≤ 4ms scripting + paint, 60fps sustained |

Always ship `font-display: swap` and a `size-adjust`-tuned local fallback; a heavy display face swapping in late causes a large CLS on hero text sized at 5.5rem.

**Mobile / low-end.** Two device-specific notes. First, hover states do not exist on touch, so wrap the translate in `@media (hover: hover) and (pointer: fine)` and provide an `:active` press for touch. Second, at `devicePixelRatio` 2-3, a 2px border renders crisply, but a 1px hard shadow can land on a half-pixel and look grey; keep the minimum shadow offset at 2px for anything that matters. Neubrutalism is a *good* choice for low-end Android precisely because there is nothing to blur.

**Cheaper fallbacks.** If you must strip cost further: drop the shadow entirely and keep only the 2-3px border (`.nb--flat`). The style still reads at maybe 70% strength and costs literally one extra property. Conversely, if a design uses layered multi-colour shadows (`4px 4px 0 #000, 8px 8px 0 #FF6B9D`), each additional shadow is another full rect fill — cap at two layers.

## 9. When To Use / When Not To

**Use it when:**

- **Creator, indie, and prosumer tools.** Gumroad is the proof: the aesthetic communicates "made by a small team that has opinions." Marketplaces, newsletter tools, tip jars, portfolio hosts.
- **Developer tools and technical marketing sites.** The mono-label / grid-line / high-contrast register maps naturally onto docs, changelogs, status pages, and CLI-adjacent products.
- **Gen-Z and youth consumer brands.** Feastables is the cleanest commercial example: chunky buttons, sticker graphics, high-energy colour.
- **Data-dense pages that need scannability.** FPL Radar boxes complex statistics into high-contrast cards, which genuinely improves reading over low-contrast tabular defaults.
- **Conference, event, and campaign microsites.** Short-lived, personality-forward, low accessibility surface area, high memorability payoff.
- **Marketing/landing surfaces of an otherwise conventional product.** The most common 2026 usage: neubrutalist marketing site, neutral product UI.
- **Anywhere you are one of forty identical competitors** and differentiation is worth more than familiarity.
- **Low-end device targets** where you want visual personality without blur cost.

**Avoid it when:**

- **Regulated or high-stakes flows** — banking, healthcare, insurance, legal, government. The visual language reads as unserious, and the accessibility surface is larger than a neutral system's.
- **Dense enterprise applications** — data grids, admin consoles, IDE-like tools. 2px borders on every cell plus offset shadows produce unreadable visual noise past a few dozen elements. Use it for the empty states and nothing else.
- **Long-form reading products.** Heavy body weight (500), tight tracking, and saturated grounds fatigue readers over thousands of words.
- **Audiences with low vision, migraine or photosensitivity sensitivity as a primary segment.** Large fields of saturated yellow and pink at full chroma are physically uncomfortable for some users; there is no neutral mode short of abandoning the style.
- **Products where trust and calm are the core emotion** — funeral services, mental health, elder care, therapy.
- **Multi-brand or white-label platforms.** The style is too opinionated to theme; every tenant will look like your brand, not theirs.
- **Anything with a heavy internationalisation load.** Display faces like Archivo Black have thin script coverage; CJK, Arabic, and Devanagari fallbacks will not carry the weight and the design collapses in those locales.
- **When your only reason is "it's trending."** By 2026 the style is common enough that using it badly reads as a template, which defeats its entire purpose.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Give every element **both** a border and a hard shadow, so it survives forced-colors mode where `box-shadow` is forced to `none`. | Define an element's boundary with `box-shadow` alone — it vanishes in Windows High Contrast and in print. |
| Set blur and spread to exactly `0` (`4px 4px 0 0`). | Use `4px 4px 8px rgb(0 0 0 / 0.2)` — a soft shadow makes it generic flat design instantly. |
| Make hover translate **exactly** the shadow offset (`translate(4px, 4px)` for a `4px 4px` shadow). | Translate a different amount than the shadow offset, which leaves a visible sliver and breaks the rigid-object illusion. |
| Use accents as **backgrounds** with `#0A0A0A` text (yellow gives 14.74:1). | Set accent-coloured text on white — `#FFDC58` on `#FFFFFF` is 1.34:1. |
| Flip `--nb-border` to a light ink in dark mode. | Keep `#000000` borders in dark mode as the reference library does — on `#2E2E38` that is 1.56:1 and fails SC 1.4.11. |
| Use a real `outline` at 3px / 2px offset for `:focus-visible`. | Reuse the hard shadow as the focus indicator; it is already present at rest and provides no state delta. |
| Cap the palette at 2-3 accents per screen (NN/g guidance) and 24-32px card padding. | Use six saturated fills on one page and 8px padding — hierarchy disappears and density becomes hostile. |
| Keep grid gaps ≥ shadow offset + 4px and reserve container padding equal to the largest offset. | Let a 16px shadow sit inside an `overflow: hidden` ancestor and get clipped. |
| Keep transitions at 100-150ms with a hard out-curve or `linear`. | Add spring/bounce easings or 400ms transitions — overshoot contradicts the solid-object metaphor. |
| Keep tilt within ±3° and only on decorative stickers/badges. | Rotate cards, inputs, or anything containing a focusable control; it breaks hit-testing intuition and focus-order legibility. |
| Restrict `will-change: transform` to the hovered subtree. | Blanket-apply `will-change` to every card in a long grid and blow out GPU memory on mobile. |
| Subset the display font and set `font-display: swap` with a size-adjusted fallback. | Ship a full-coverage Archivo Black and eat a large CLS on a 5.5rem hero. |
| Use semantic `<button>`, `<a>`, `<input>`; underline links. | Build `div role="button"` stickers — forced-colors picks system colours from native semantics, not ARIA. |
| Verify tab order after every absolutely-positioned collage layout. | Assume visual order equals DOM order in an asymmetric composition. |
| Give marquees a pause control or stop them under `prefers-reduced-motion`. | Run an infinite ticker with no control and fail SC 2.2.2. |

## 11. In The Wild (2024-2026)

Only entries verified during research are listed.

- **Gumroad** (gumroad.com) — the canonical commercial adopter. Rebrand announced by Sahil Lavingia in "Introducing the new Gumroad" on the company's tenth anniversary, November 2021, and still the reference look in 2026 across marketing and product: thick black outlines, flat fills, offset drop shadows, scannable flat card blocks. Cited by NN/g (2025) and by neobrutalism.com's 2026 roundup.
- **Feastables** (feastables.com) — MrBeast's snack brand. Bold chunky buttons and sticker-like graphics targeting a Gen-Z audience; a high-energy, tactile commerce implementation. Listed in the January 2026 neobrutalism.com roundup.
- **neobrutalism.com** (formerly **RetroUI**) — the maintained 2026 reference library. 50+ React/Next.js components plus blocks and templates, built on Radix UI and Base UI, installed via a shadcn-style CLI, with a hosted MCP server so AI agents can search, preview, and install components. Defaults: `--radius: 0`, background `#fff7e8`, primary `#ffdc58`, border `#000`, a six-step hard-shadow scale from `1px 1px 0 0` to `16px 16px 0 1px`, Archivo Black for headings and Space Grotesk for body. Not affiliated with official shadcn/ui.
- **ekmas/neobrutalism-components** (neobrutalism.dev) — Samuel Breznjak's shadcn/ui-derived React + Tailwind library, ~5.3k stars, MIT. **Archived: the maintainer announced on 19 July 2025 that it is no longer maintained.** Its published tokens remain the most-copied numbers in the ecosystem: `--box-shadow-x/y: 4px`, `--reverse-box-shadow-x/y: -4px`, `--border-radius: 5px`, `--heading-font-weight: 700`, `--base-font-weight: 500`, `--shadow: var(--box-shadow-x) var(--box-shadow-y) 0px 0px var(--border)`, with `border-2` and `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none` on the default button variant. A v4 release migrated it to Tailwind v4 `@theme inline`. Sixteen colour presets ship as shadcn registry `registry:style` items.
- **Nielsen Norman Group** — "Neobrutalism: Definition and Best Practices," Hayat Sheikh, 11 April 2025. The style's first mainstream-usability-institution treatment; supplies the 2-3 colour cap, 24-32px padding, and bold-headline/clean-body-font guidance now widely followed. Cites Figma, Gumroad, 99percentoffsale.com, byooooob.com, Tony's Chocolonely, cyanbanister.com, and dodonut.com as examples.
- **brutalistwebsites.com** — Pascal Deville's directory, running since 2014. Still the archive of record for raw web brutalism as distinct from neubrutalism.
- **brutalist-web.design** — David Bryant Copeland's seven usability principles. Current build published 2024-04-04, content last updated 2025-06-01, source on GitHub. This is the doctrinal text for "brutalism as honesty," and it is worth noting it contains no visual prescriptions at all.
- **FPL Radar** — Fantasy Premier League data platform using high-contrast neubrutalist cards to make dense statistics scannable. A useful counterexample to the claim that the style is decorative only.
- **Roze Bunker**, **GT Maru**, **Rewind**, **DesignThinkers (RGD)**, **Curry Cafe**, **Kristi Digital**, **Lydia Amaruch**, **Studio Job** — the remainder of the neobrutalism.com January 2026 roundup, spanning beverage branding, type foundry work, a YouTube tool with a mosaic-grid layout, a conference site, hospitality, and three portfolios. Representative of where the style actually lives in 2026: brand, event, and portfolio surfaces rather than core product UI.
- **HyperUI** — maintains a free Tailwind "Neobrutalism" component category.
- **Figma** — often miscited here. Figma's 2024 brand refresh (published 16 September 2024, with Figma Sans by Grilli Type) explicitly moved *away* from "heavy black outlines." Figma's palette expansion into bold primaries and bright neons is adjacent to the style; its border language is not. Treat as neighbour, not exemplar.

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md), which is the single source of truth for the set's numbering: 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui. Rows without a link name a style that has no file in this set.

| Combination | Verdict | Notes |
|---|---|---|
| **Brutalism + Bento grid** ([./09-bento-grid.md](./09-bento-grid.md)) | **Works, best combo in the set** | Bento's tiled modules want visible boundaries; hard borders plus offset shadows give each tile a physical edge. Use one shadow size across the grid so tiles read as coplanar, and keep gaps ≥ offset + 4px. |
| **Brutalism + Minimalism** ([./05-minimalism.md](./05-minimalism.md)) | **Works — and minimalism is also the parent** | Two things at once. As a *dialect*: reduce to one accent, 2px borders, 2px shadows, generous whitespace, one display face — "quiet brutalism", the enterprise-safe version and the most common way the style survives inside serious products. As an *ancestor*: neubrutalism is flat design plus a border and an offset, and doc 05 owns flat and flat 2.0 as aliases, so dialling `--nb-bw` to 0 and the shadow to `none` lands you exactly there. That makes minimalism the natural low-intensity fallback for the whole style. |
| **Brutalism + Maximalism** ([./06-maximalism.md](./06-maximalism.md)) | **Works — the loudest coherent pairing** | Neubrutalism is effectively maximalism with the layer count capped at two: it supplies the hard stroke, the zero-blur offset and the flat saturated fill; maximalism adds the third plane (pattern, collage, grain) and the second and third typeface. Start from this doc's tokens and add exactly one layer. Doc 06 §12 states the same verdict from the other side. |
| **Brutalism + Skeuomorphism** ([./01-skeuomorphism.md](./01-skeuomorphism.md)) | **Selective** | Only the *flat-symbolic* subset works (a chunky faux-physical toggle, a paper-sticker metaphor). Photographic textures, bevels, and inner glows clash immediately. This is also where retro / Y2K and Windows-98-chrome pastiche belong — shared DNA of pixel edges, mono labels and sticker collage, and NN/g explicitly notes 90s button motifs inside neobrutalism. Watch that you do not end up with two competing nostalgias. |
| **Brutalism + Spatial UI** ([./10-spatial-ui.md](./10-spatial-ui.md)) | **Selective, and instructive** | The hard offset shadow is a *fake* depth cue that deliberately announces itself as fake; spatial UI's z-ladder is a real one. Running both on the same element gives the eye two contradictory depth reports. The pattern that works: let the spatial stage move whole brutalist panels on the z-axis and keep the offset shadow at a single fixed size inside them, so it reads as the panel's printed drop shadow rather than as elevation. |
| **Brutalism + Neumorphism** ([./02-neumorphism.md](./02-neumorphism.md)) | **Clashes hard** | Neumorphism is soft dual-shadow low-contrast extrusion; neubrutalism is hard single-shadow maximum-contrast. They are opposite answers to the same question. Combining them produces mush and inherits both accessibility problems. |
| **Brutalism + Glassmorphism** ([./03-glassmorphism.md](./03-glassmorphism.md)) | **Clashes, with one exception** | Neubrutalism is defined partly by the absence of blur, so `backdrop-filter` is a direct contradiction. The one workable pattern: a fully opaque brutalist shell containing a single glass overlay/modal as a deliberate register shift. Do not mix them at component level. |
| **Brutalism + Claymorphism** ([./04-claymorphism.md](./04-claymorphism.md)) | **Clashes** | Clay's large radii (24px+) and soft inner shadows are the exact inverse of zero radius and hard outer offset. Anything above ~8px radius pulls the design toward clay and the borders start to look like a mistake. |
| **Brutalism + Liquid Glass** ([./08-liquid-glass.md](./08-liquid-glass.md)) | **Clashes hardest in the set** | Liquid Glass is refraction, specular highlights, and continuous curvature — three things neubrutalism defines itself by not having. On Apple platforms, do not fight the system material: keep brutalism inside your own content views and let the platform chrome stay glass. |
| **Brutalism + Google Material Design** (no doc in this set) | **Clashes** | Material's elevation model is blur-and-opacity-based ambient/key light. Hard zero-blur offsets contradict it at the token level, and Material's 4-28dp elevation scale has no hard-shadow equivalent. Pick one. Material 3 Expressive's louder shapes are closer, but the shadow language still fights. |
| **Brutalism + aurora / gradient mesh** (no doc in this set) | **Works as a background only** | A soft mesh gradient behind fully opaque hard-bordered cards is a common and effective 2026 pattern — the gradient supplies atmosphere, the cards supply structure. Never put a gradient *inside* a brutalist component fill. |

**Reconciling the two duration tokens.** §4 defines `--nb-dur-fast: 100ms` and `--nb-dur: 150ms`, and the React sheet in §5 uses `--nb-dur` (150ms) for the button's shadow-collapse travel. Earlier drafts of the React sheet hard-coded 100ms, which is the wrong rung: 100ms is for feedback the user should *feel* rather than watch (a colour swap, a 1px nudge), whereas the whole affordance here is a 4px translate plus a shadow disappearing, and at 100ms that reads as a jump rather than a press. Use `--nb-dur-fast` for tone/colour changes and `--nb-dur` for anything that moves.

**Named hybrid dialects worth knowing (all observed in 2026 writing):** *Pop-brutalism* (maximum chroma, sticker collage, consumer), *technical brutalism* (mono type, blueprint grids, dev tools), and *organic brutalism* (paper grain and rough edges layered over the hard geometry). The first is the most common and the most saturated; the second ages best in product UI.

## 13. Plugin Spec (draft)

**Skill name:** `brutalism-ui`

**Description (triggering):** "Use when the user wants to restyle a web UI into neubrutalism / neo-brutalism / brutalist design — hard black borders, zero-blur offset shadows, flat saturated fills, chunky display type — or asks to make an interface look bolder, rawer, more hand-made, sticker-like, or less like a generic AI-generated rounded-gray-card layout. Also use for auditing an existing neubrutalist UI for contrast, focus, forced-colors, and reduced-motion failures."

**What the skill does:**

1. Detects the target stack (Tailwind v3/v4, CSS Modules, styled-components, vanilla CSS, SwiftUI) and the existing token source, if any.
2. Emits a `brutalism.tokens.css` (or `@theme` block, or a Swift `enum`) containing the border, radius, shadow-scale, accent, type, spacing, and motion tokens from §4, with computed contrast values in comments.
3. Rewrites component styles: sets `border-radius` toward 0, replaces every blurred `box-shadow` with the nearest hard-offset step, adds `border: var(--nb-bw) solid var(--nb-border)` to every surface and control, converts gradients to their dominant flat colour, removes `backdrop-filter`.
4. Installs the signature interaction on all buttons/links-as-buttons: `hover:translate(offset)` + `shadow: none`, `active` at offset+1px, `focus-visible` outline.
5. Retypes the hierarchy: display face on `h1`-`h3` at 700-900 with `-0.02em`, body at weight 500, mono uppercase on labels/badges/metadata.
6. Injects the three guard blocks it must always write: `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)`, and `@media (hover: hover) and (pointer: fine)` around the translate.
7. Runs an audit pass and writes `brutalism-audit.md` with every contrast pair, every target size, every focus indicator, and every DOM-vs-visual order risk it found.

**Inputs it needs from the user:**

| Input | Type | Default | Notes |
|---|---|---|---|
| `framework` | `tailwind-v4 \| tailwind-v3 \| css \| css-modules \| styled-components \| swiftui \| react-native` | detected | Determines emitted artefact shape. |
| `basePalette` | 1-3 hex accents + ground | `#FFDC58`, `#FF6B9D`, `#A3E635` on `#FEF6E4` | Skill re-derives on-accent text colour and rejects any accent below 4.5:1 against `#0A0A0A`. |
| `density` | `compact \| default \| roomy` | `default` | Maps to 16 / 24 / 32px card padding. |
| `intensity` | 0-100 | `60` | See knobs below. |
| `scope` | `marketing \| product \| both` | `marketing` | `product` caps intensity at 45 and forces the quiet dialect. |
| `theme` | `light \| dark \| both` | `both` | `both` forces the dark-mode border flip. |
| `motion` | `on \| minimal` | `on` | `minimal` ships shadow-shrink hover only. |

**Outputs it produces:**

- `brutalism.tokens.css` — the `:root` + dark-mode block, with a contrast comment per accent.
- `@theme` block for Tailwind v4 (or `tailwind.config.ts` extension for v3).
- A component set: `Button`, `Card`, `Input`, `Select`, `Badge`, `Tabs`, `Dialog`, `Alert`, `Table` — each with border-first styling and the three guard blocks.
- `brutalism.layer.css` — a `@layer brutalism { }` override sheet so the restyle can be toggled off without touching the app's own CSS.
- `brutalism-audit.md` — pass/fail table against the §7 checklist, with the exact failing selectors and computed ratios.
- Optional `brutalism.figma.json` — Figma Variables and Effect Styles matching the tokens.

**Self-run validation checklist:**

1. Every emitted foreground/background pair computes ≥ 4.5:1 (normal text) or ≥ 3:1 (large text / non-text). Fail the run and report rather than shipping a failing pair.
2. Border-vs-adjacent-surface ≥ 3:1 in **both** light and dark. Explicitly assert the dark border is not `#000` on a dark surface.
3. Every element that received a `box-shadow` also has a `border`.
4. A `@media (forced-colors: active)` block exists and sets `box-shadow: none` plus a system-colour border on every generated class.
5. A `@media (prefers-reduced-motion: reduce)` block exists, removes `translate` and `rotate`, and leaves a non-motion hover cue.
6. Every `:focus-visible` uses `outline` ≥ 3px with `outline-offset` ≥ 2px, and no rule anywhere sets `outline: none` without a replacement.
7. Every interactive rule yields a computed box ≥ 24×24 CSS px; warn below 44px.
8. No `backdrop-filter`, no `filter: blur()`, no non-zero shadow blur in emitted CSS.
9. No more than 2 shadow layers per element; no more than 3 accents referenced per generated view.
10. `will-change` appears on at most one hovered-subtree selector, never on a list item base class.
11. Total emitted CSS ≤ 8 KB minified; total added JS = 0.
12. Fonts are declared with `font-display: swap` and a `size-adjust` fallback; the skill warns if the display face is not subset.
13. A tab-order note is emitted for every generated layout using `position: absolute` or `order`.

**Intensity knobs (0-100 maps onto these ranges):**

| Knob | Min (intensity 0) | Max (intensity 100) | Curve |
|---|---|---|---|
| `shadowOffset` | `0px` (no shadow) | `12px` | linear, integer-rounded; 4px at 50 |
| `borderWidth` | `1px` | `5px` | stepped: 1 / 2 / 3 / 4 / 5 at 0 / 25 / 50 / 75 / 100 |
| `radius` | `12px` | `0px` | inverse linear; 5px at 50 |
| `chroma` (accent saturation) | 35% of source chroma | 100% of source chroma | linear in OKLCH C, L held constant so contrast never moves |
| `tilt` (sticker rotation) | `0deg` | `3deg` | linear; applies to badges/decorative only, never to focusables |

`scope: product` hard-clamps `shadowOffset ≤ 4px`, `borderWidth ≤ 2px`, `tilt = 0`.

**Anti-patterns the skill must refuse to generate:**

- Any `box-shadow` with a non-zero blur or spread presented as a neubrutalist shadow (spread `1px` is permitted only on the `xl`/`2xl` steps, matching the reference library).
- `outline: none` on any focusable element without an equivalent replacement outline in the same rule set.
- A `box-shadow`-based focus indicator.
- Accent-coloured **text** on a light ground (yellow-on-white and similar), or white text on any of the accent fills.
- Black borders in a dark theme.
- `backdrop-filter` or any blur, in any generated rule.
- `div`/`span` with `role="button"` in place of a real `<button>`.
- Rotation on any element that contains a focusable descendant.
- Infinite marquees or tickers without a pause control.
- `will-change: transform` applied to a repeated list-item class.
- More than three accent fills in a single generated view.
- `opacity`-only disabled states.
- Blanket removal of link underlines (contradicts both SC 1.4.1 and Copeland's principle 3).

## 14. References

1. "Neobrutalism: Definition and Best Practices" — https://www.nngroup.com/articles/neobrutalism/ — Nielsen Norman Group, Hayat Sheikh — 11 April 2025 — **[primary]** (usability-institution definition, colour cap and padding guidance, named examples)
2. "Brutalist Web Design" — https://brutalist-web.design/ — David Bryant Copeland — published 4 April 2024, content last updated 1 June 2025 — **[primary]** (the seven principles; the usability reframing of brutalism)
3. `ekmas/neobrutalism-components` — https://github.com/ekmas/neobrutalism-components — Samuel Breznjak — v4, MIT, ~5.3k stars — **[primary]** (canonical token values; `src/styling/globals.css`, `public/r/styling/*.json`, `src/components/ui/button.tsx` read directly)
4. "no longer maintained" (Discussion #100) — https://github.com/ekmas/neobrutalism-components/discussions/100 — Samuel Breznjak — 19 July 2025 — **[primary]** (archival announcement; RetroUI named as successor by the community)
5. Neobrutalism components documentation — https://www.neobrutalism.dev/docs — Samuel Breznjak — accessed 8 August 2026 — **[primary]**
6. NeoBrutalism (formerly RetroUI) installation & theming — https://neobrutalism.com/docs/installation — accessed 8 August 2026 — **[primary]** (`--radius: 0`, `#fff7e8` / `#ffdc58` / `#000`, six-step hard-shadow scale, Archivo Black + Space Grotesk)
7. "12 Neobrutalist Websites You Should Know in 2026" — https://neobrutalism.com/blogs/12-neobrutalist-websites-you-should-know-in-2026 — Dov Azencot — 14 January 2026 — **[secondary]** (verified 2026 example set: Gumroad, Feastables, FPL Radar, Roze Bunker, GT Maru, Rewind, DesignThinkers, Curry Cafe, Kristi Digital, Lydia Amaruch, Studio Job)
8. "forced-colors" CSS media feature — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors — MDN Web Docs, Mozilla — accessed 8 August 2026 — **[primary]** (`box-shadow` forced to `none`; forced property list; system colours chosen by native semantics; `forced-color-adjust`)
9. "Understanding SC 1.4.11: Non-text Contrast" — https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html — W3C WAI — **[primary]** (3:1 for UI component boundaries)
10. "Understanding SC 2.4.13: Focus Appearance" — https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html — W3C WAI — **[primary]** (minimum 2px indicator thickness, 3:1 focused-vs-unfocused; AAA in WCAG 2.2)
11. "Neubrutalism in web design" — https://blog.logrocket.com/ux-design/neubrutalism-web-design/ — LogRocket Blog, Eric Chung — 22 November 2023 — **[secondary]** (brutalism-vs-neubrutalism distinction; Whyte / Lexend Mega / Public Sans typography; 45-degree unblurred shadows; accessibility critique)
12. "Introducing the new Gumroad" — https://sahil.gumroad.com/p/introducing-the-new-gumroad — Sahil Lavingia, Gumroad — November 2021 (tenth-anniversary rebrand: new brand, website, fonts, colors) — **[primary]**
13. "Figma on Figma: Our Latest Brand Refresh" — https://www.figma.com/blog/figma-on-figma-evolving-our-visual-language/ — Figma, Carly Ayres — 16 September 2024 — **[primary]** (explicitly moves away from "heavy black outlines"; Figma Sans by Grilli Type; expanded palette — the source that corrects the common "Figma is neubrutalist" claim)
14. "Crafting the Visual Identity for Config 2024" — https://www.figma.com/blog/config-2024-branding/ — Figma — 2024 — **[primary]**
15. "Brutalist Web Design Finally Gets A Takedown" — https://www.fastcompany.com/90136486/brutalist-web-design-finally-gets-a-takedown — Fast Company — 2017 — **[secondary]** (Pascal Deville, brutalistwebsites.com founded 2014, Craigslist as long-running example, the mid-2010s backlash)
16. "box-shadow" — https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow — MDN Web Docs, Mozilla — accessed 8 August 2026 — **[primary]** (offset/blur/spread semantics; zero blur produces a sharp-edged shadow)
17. "Styling for Windows high contrast with new standards for forced colors" — https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/ — Microsoft Edge Blog — 17 September 2020 — **[primary]**
18. "Windows High Contrast Mode, Forced Colors Mode And CSS Custom Properties" — https://www.smashingmagazine.com/2022/03/windows-high-contrast-colors-mode-css-custom-properties/ — Smashing Magazine — March 2022 — **[secondary]**
19. "Neo-Brutalism design trends in 2026: Building bold and memorable Web pages" — https://pixso.net/articles/neo-brutalism-design/ — Pixso — 2026 — **[secondary]** (2px-5px border range; black/white plus one neon accent; 2026 status)
20. "Brutalism vs Neubrutalism in UI Design: Unpacking the Differences" — https://www.cccreative.design/blogs/brutalism-vs-neubrutalism-in-ui-design — CC Creative — 2026 — **[secondary]** (the AI-sameness argument for the style's 2026 persistence)
21. "Neobrutalism Tailwind CSS Components" — https://hyperui.dev/components/neobrutalism/ — HyperUI — accessed 8 August 2026 — **[secondary]**
22. "Neubrutalism" — https://aesthetics.fandom.com/wiki/Neubrutalism — Aesthetics Wiki — accessed 8 August 2026 — **[secondary]** (mid-2010s precursors, late-2010s/early-2020s formation, 2022-2023 mainstreaming)
