---
name: minimalism
title: Minimalism
aliases: [minimal UI, minimalist design, "less is more", Swiss style UI, International Typographic Style, flat design, flat 2.0, semi-flat, neo-minimalism, quiet UI, calm interface, content-first design]
category: ui-morphism
origin_year: 1960
peak_years: 2013-2020
status_2026: mainstream
difficulty: medium
a11y_risk: medium
perf_cost: low
plugin_slug: minimalism-ui
last_researched: 2026-08-08
---

## 1. Essence

Minimalism is the reduction of an interface to the smallest set of elements that still lets a user complete the task, with everything remaining carrying informational weight. The feeling it produces is calm confidence: nothing shouts, so the content itself becomes the hierarchy. The single defining visual move is **subtraction with compensation** — you delete the box, the gradient, the shadow, the divider, and then buy back the lost structure with whitespace, type scale, and a single accent hue.

Its permanent failure mode is confusing *visual* minimalism with *informational* minimalism. Stripping signifiers off a control does not make the control simpler; it makes it invisible. Every credible 2020s implementation of this style is minimalism plus a deliberately reintroduced affordance budget.

## 2. Origin & Timeline

- **1919–1933 — Bauhaus.** Functionalism, geometric primitives, sans-serif type, and the rejection of applied ornament establish the intellectual base. De Stijl (1917–1931) contributes the orthogonal grid and primary-plus-neutral palette.
- **1940s–1950s — Swiss Style / International Typographic Style.** Ernst Keller, Armin Hofmann and Josef Müller-Brockmann codify the mathematical grid, asymmetric layout, flush-left/ragged-right setting, photographic imagery over illustration, and neo-grotesque type. This is the direct ancestor of every modern UI grid. Nielsen Norman Group traces web minimalism explicitly through this lineage.
- **1947 — "Less is more."** The phrase popularised by Ludwig Mies van der Rohe becomes minimalism's unofficial motto; NN/g cites it as the movement's shorthand in web design.
- **1960s — Minimalism as a fine-art movement.** Post-war reaction against abstract expressionism: monochromatic palettes, geometric elements, industrial materials.
- **Late 1970s — Dieter Rams' ten principles for good design.** Written at Braun and published by Vitsœ, they end with the load-bearing tenth: *"Good design is as little design as possible."* Others that matter for UI: *unobtrusive*, *understandable*, *honest*, *long-lasting*, *thorough down to the last detail*. Rams' German formulation *"Weniger, aber besser"* — less, but better — is the more accurate translation of the intent than "less is more."
- **1983 — Edward Tufte's data-ink ratio.** *The Visual Display of Quantitative Information* argues for erasing non-data ink. This is minimalism reframed as an information-theoretic objective and is still the cleanest justification for the style in dashboards.
- **1990 — John M. Carroll's minimalism theory** in technical communication: brevity and simplicity *in the service of task-oriented results*, not as an aesthetic end.
- **1995 — Jakob Nielsen's usability heuristics.** Heuristic #8, "Aesthetic and Minimalist Design," enters the canon: interfaces should not contain information which is irrelevant or rarely needed.
- **c. 2000s — Google's homepage** demonstrates that a near-empty page can be the highest-value screen on the web. Broad adoption lags; the crowded portal remains the default.
- **2010 (May) — Responsive web design.** Ethan Marcotte's article in *A List Apart* forces designers to strip layouts down to what survives reflow. NN/g credits responsive design as a major accelerant of web minimalism.
- **2010 (21 October) — Windows Phone 7 ships with Metro.** Microsoft's "authentically digital" design language: no bevels, no gradients, no drop shadows, typography (Segoe) as the primary UI material, content over chrome. This is the first mass-market flat OS.
- **2012 — Windows 8** brings Metro/"Modern" to the desktop. It is also minimalism's first public catastrophe: hidden charms, invisible edge gestures, and unlabelled affordances. NN/g still cites Windows 8 as the cautionary example of minimalism practised as ideology.
- **2013 (18 September) — iOS 7 ships.** Apple, under Jony Ive, deletes the skeuomorphic texture layer of iOS 1–6 in a single release: hairline strokes, Helvetica Neue Light, translucency instead of dimensionality, and text-only buttons. Flat becomes the industry default overnight. It also launches the borderless-button and low-contrast-grey problems that dominate accessibility complaints for the next decade.
- **2014 (Google I/O) — Material Design.** Google's answer is *flat with rules*: an explicit 8dp baseline grid for layout and 4dp for type and iconography, plus a z-axis elevation model with defined shadow tokens. Material is the moment minimalism gets a spec rather than a mood.
- **2015–2017 — "Flat 2.0" / semi-flat.** The correction. Subtle shadows, slight gradients, and layering return purely as signifiers. NN/g's *Flat Design Best Practices* (Kate Moran, 12 March 2017) documents "click uncertainty" — users mousing over elements to discover whether they are clickable — and recommends never duplicating visual treatments between clickable and static elements, avoiding ghost buttons, and adding subtle depth.
- **2018–2021 — Systematised minimalism.** Design tokens, 4/8pt spacing scales, and modular type scales industrialise the style. Stripe, Linear, Notion and Vercel become the reference implementations: monochrome neutrals, one accent, hairline borders, huge whitespace, dense-but-quiet data display.
- **2021 (24 January) — NN/g re-states heuristic #8** (Therese Fessenden): minimalist *visual style* does not automatically satisfy the heuristic, and satisfying the heuristic does not require minimalist style. The article also popularises the 50-millisecond first-impression figure and the signal-to-noise framing.
- **2023 (October) — Vercel releases Geist**, an open-source type family (Geist Sans + Geist Mono) built with Basement Studio, explicitly described by Vercel as embodying "simplicity, minimalism, and speed" and drawing on Swiss design. It becomes the de-facto typeface of developer-tool minimalism. Geist Pixel was added later.
- **2023 (January) — shadcn/ui launches.** Copy-in components with neutral defaults, hairline borders, and token-driven theming make Linear-grade minimalism the path of least resistance for React teams.
- **WCAG 2.2 — Recommendation 5 October 2023; current revision published 12 December 2024.** (Stated in this exact form in docs 05, 06 and 10; 12 December 2024 is a revision of the Recommendation, not the date it reached Recommendation status.) Its new criteria — 2.4.11 Focus Not Obscured, 2.5.8 Target Size (Minimum, 24×24 CSS px) — land directly on minimalism's weak spots: tiny icon-only controls and sticky low-chrome headers that cover the focused element.
- **2025 (May) — Google announces Material 3 Expressive** at The Android Show ahead of I/O 2025. Google frames it as the outcome of roughly three years of research, 46 studies and over 18,000 participants, and argues that more expressive interfaces let users identify key UI elements substantially faster than the previous, flatter Material You. This is the most credible institutional argument against undifferentiated minimalism yet published by a platform vendor.
- **2025 (9 June, WWDC) — Apple announces Liquid Glass** and ships it in September 2025 across all six platforms: iOS 26, iPadOS 26, macOS Tahoe 26, watchOS 26, tvOS 26 and visionOS 26. It ends the flat era that ran from iOS 7 (2013) to iOS 18 (2024). Reporting through 2026 indicates Apple is pushing developers to adopt the new material rather than remain on legacy flat chrome.
- **2026 (January / July) — shadcn/ui and Base UI.** After introducing a Radix-or-Base-UI choice in December 2025 and shipping full Base UI documentation in January 2026, shadcn/ui made **Base UI the default in July 2026**. Two figures often repeated alongside this — "Base UI 1.6.0 is current stable" and "new projects choose Base UI over Radix roughly 2:1" — are **not independently verifiable**: the version moves, and the 2:1 ratio has no published methodology behind it. Check base-ui.com for the current version (reference 8) and treat the adoption ratio as an impression, not a measurement. Radix remains supported via `-b radix`. The minimalist default styling did not change; only the headless primitive layer did.
- **2026 status — mainstream, not dominant, and no longer the platform default.** Both major OS vendors have moved away from pure flatness: Apple toward glass/material depth, Google toward expressive colour and spring motion. Minimalism survives and thrives where it always did best — developer tools, B2B SaaS, documentation, editors, finance and AI chat surfaces — and it has absorbed a new label, the **"calm interface" / "quiet UI"** movement of 2026, which is a reaction against theatrical AI chrome (animated orbs, streaming shimmer, constant status theatre) rather than against decoration in general. *Treat "calm interface" as an unverified trade narrative, not a settled standard: it is attested only in design-trade writing (references 15 and 22), carries no platform-spec or research backing, and no figure in this doc depends on it.* If you held the prior that minimalism was still *the* default aesthetic of 2026, the search record contradicts it: it is now one deliberate option among several, and choosing it is a positioning decision.

## 3. Visual DNA

- **Achromatic base, single accent.** 90–95% of painted pixels are neutral (chroma ≤ 0.02 in OKLCH). Exactly one accent hue carries all primary actions and selection states. A second hue only ever appears for destructive/error semantics.
- **Whitespace as the structural element.** Section rhythm at 64–96px on desktop, 40–56px on mobile; card padding 16–24px; the gap between a label and its field is 6–8px while the gap between field groups is 24–32px. The 4:1 ratio between *within-group* and *between-group* spacing is what produces perceived grouping without dividers.
- **Hairline borders instead of shadows.** 1px (or `0.5px` on ≥2dppx displays) at 6–12% black in light mode, 8–12% white in dark. Borders do the work that elevation does in Material.
- **Near-zero elevation.** At most two shadow steps, both under 8px blur and under 8% opacity. Anything reading as "floating" is reserved for genuine overlays (menus, dialogs, toasts).
- **Small, consistent radius.** 6–10px is the modern default; 0px for the hard-Swiss variant; 999px only for pills and avatars. Radius never varies by component type within one system.
- **One or two typefaces, four weights maximum.** A neo-grotesque sans (Inter, Geist Sans, Helvetica Now, SF Pro, Söhne) plus optionally one mono for code and numerics. Weights: 400 / 500 / 600, with 700+ used sparingly or not at all — Vercel's Geist system is documented as capping at 600 for interface text.
- **Modular type scale, ratio 1.125–1.250.** Small ratios keep the page quiet; big display jumps (48–72px) appear only in marketing hero sections, never in product chrome.
- **Measure controlled at 45–75 characters.** Bringhurst's range, with ~66 CPL as the target for long-form and ~55 CPL for dense UI copy. Implemented as `max-width: 65ch`.
- **Content-first hierarchy.** Rank order is: content > labels > controls > chrome. Navigation is visually quieter than the thing being navigated.
- **Iconography at a single stroke weight.** 1.5px stroke on a 24px grid (or 1.25px on 20px), rounded caps, no fills except for selected states. Mixing filled and outline icons in one surface breaks the style instantly.
- **Restrained motion.** 120–200ms, opacity and 2–8px translation only. No bounce, no overshoot, no scale beyond 1.02.
- **Alignment discipline.** One optical left edge per column; numbers tabular-aligned (`font-variant-numeric: tabular-nums`); no centred body copy longer than two lines.

## 4. Anatomy & Design Tokens

Every token in this table is the **exact name emitted by the CSS block below it**. Minimalism is the one style in this set whose natural names (`--surface-1`, `--accent`, `--text-muted`) are also the names a host application is most likely to have already taken, so the `--min-` prefix is not decoration — it is collision avoidance. Do not strip it, and do not introduce a second, unprefixed dialect anywhere in the doc.

| Token group | Token | Light value | Dark value | Notes |
|---|---|---|---|---|
| Background | `--min-bg-canvas` | `#FFFFFF` | `#0A0A0A` | Pure white is acceptable here; the style has no glare-scattering shadows to compensate for |
| Background | `--min-bg-subtle` | `#FAFAFA` | `#131313` | Page-level wash behind cards |
| Surface | `--min-surface-1` | `#FFFFFF` | `#161616` | Card / panel |
| Surface | `--min-surface-2` | `#F5F5F5` | `#1E1E1E` | Input wells, code blocks, hover rows |
| Surface | `--min-surface-hover` | `#F0F0F0` | `#242424` | Row and list-item hover only |
| Border | `--min-border-subtle` | `rgb(0 0 0 / 0.08)` ≈ `#EBEBEB` | `rgb(255 255 255 / 0.10)` | Decorative separators only — 1.2:1, must not be the sole indicator of a control |
| Border | `--min-border-strong` | `#8F8F8F` | `#7A7A7A` | Interactive control boundaries. `#949494` on white is 3.03:1 — the lightest grey that clears the bar — so `#8F8F8F` (3.23:1) clears 1.4.11 with margin |
| Border | `--min-border-width` | `1px` | same | Never scale; the hairline is the style |
| Text | `--min-text-primary` | `#0A0A0A` | `#FAFAFA` | ≥ 18:1 both ways |
| Text | `--min-text-secondary` | `#525252` | `#B4B4B4` | 7.8:1 / 9.5:1 |
| Text | `--min-text-muted` | `#737373` | `#8F8F8F` | **4.74:1 on white** — the darkest grey you may call "muted." `#999999` is 2.85:1 and fails |
| Text | `--min-text-disabled` | `#A3A3A3` | `#6B6B6B` | Exempt from 1.4.3 but must never encode information alone |
| Accent | `--min-accent` | `#2563EB` | `#60A5FA` | 5.17:1 on white / 7.8:1 on `#0A0A0A` |
| Accent | `--min-accent-hover` / `--min-accent-active` | `#1D4ED8` / `#1E40AF` | `#93C5FD` / `#BFDBFE` | Interaction steps on the single accent |
| Accent | `--min-accent-fg` | `#FFFFFF` | `#0A0A0A` | Text on accent fill |
| Accent | `--min-accent-subtle` | `#EFF6FF` | `#101C2E` | Selected-row / tinted-badge ground only — never a text colour |
| Semantic | `--min-danger` / `--min-danger-fg` | `#DC2626` / `#FFFFFF` | `#F87171` / `#0A0A0A` | Only second hue permitted |
| Focus | `--min-focus-ring` | `#2563EB` | `#93C5FD` | |
| Focus | `--min-focus-ring-width` / `--min-focus-ring-offset` | `2px` / `2px` | same | Additive ring; see §6 |
| Radius | `--min-radius-sm / -md / -lg / -full` | `4px / 8px / 12px / 9999px` | same | `md` is the component default |
| Shadow | `--min-shadow-0` | `none` | same | Elevation 0 is a real, named rung |
| Shadow | `--min-shadow-1` | `0 1px 2px rgb(0 0 0 / 0.04)` | `0 1px 2px rgb(0 0 0 / 0.40)` | Resting cards; often omitted entirely |
| Shadow | `--min-shadow-2` | `0 4px 12px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04)` | `0 8px 24px rgb(0 0 0 / 0.50), 0 1px 2px rgb(0 0 0 / 0.40)` | Overlays only |
| Blur | `--min-backdrop-blur` / `--min-backdrop-saturate` | `0px` / `1` | same | Deliberate: zero backdrop-filter is what separates this style from glassmorphism |
| Saturation | neutral chroma | `≤ 0.006` OKLCH | `≤ 0.010` | Slightly warmer/cooler neutrals are allowed but must be consistent in sign |
| Elevation | steps | `0, 1, 2` | same | Three levels total: flat, raised, overlay |
| Type | `--min-font-sans` | `Inter, "Geist Sans", -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | — | One family; `--min-font-mono` only for code/numerics |
| Type | `--min-text-xs … --min-text-5xl` | `12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 px` | — | Scale ratio `1.200` (minor third) |
| Type | `--min-leading-tight / -snug / -normal` | `1.2 / 1.4 / 1.5` | — | 1.5 body; 1.5 is also WCAG 1.4.12's reflow floor |
| Type | `--min-tracking-tight` / `--min-tracking-display` | `-0.011em` at ≥24px / `-0.02em` at ≥36px | — | Optical correction only; body tracking is `0` |
| Type | `--min-weight-normal / -medium / -semibold` | `400 / 500 / 600` | — | No weight above 600 in this style |
| Type | `--min-measure` | `65ch` (max `75ch`) | — | Bringhurst 45–75 CPL |
| Spacing | `--min-space-1 … --min-space-24` | `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px` | — | 4px base unit |
| Sizing | `--min-control-sm / -md / -lg` | `32 / 36 / 40px` | — | 40px default hit target |
| Sizing | `--min-target-min` | `24px` | — | The SC 2.5.8 hard floor, not the resting size. Icon-only buttons never below 24×24 CSS px; `.min-btn` takes `min-width` from it and §7 forbids overriding it downward. Size from `--min-control-lg` (40px) wherever a control height is possible |
| Motion | `--min-dur-instant / -fast / -base / -slow` | `100 / 150 / 200 / 300ms` | — | Anything over 300ms reads as sluggish in this style |
| Motion | `--min-ease-standard` / `--min-ease-exit` | `cubic-bezier(0.2, 0, 0, 1)` / `cubic-bezier(0.4, 0, 1, 1)` | — | No spring, no `cubic-bezier` with negative control points |

### Ready-to-paste CSS custom properties

```css
:root {
  color-scheme: light dark;

  /* ---- Neutrals & surfaces ---- */
  --min-bg-canvas: #ffffff;
  --min-bg-subtle: #fafafa;
  --min-surface-1: #ffffff;
  --min-surface-2: #f5f5f5;
  --min-surface-hover: #f0f0f0;

  /* ---- Borders ---- */
  --min-border-subtle: rgb(0 0 0 / 0.08);
  --min-border-strong: #8f8f8f;
  --min-border-width: 1px;

  /* ---- Text ---- */
  --min-text-primary: #0a0a0a;
  --min-text-secondary: #525252;
  --min-text-muted: #737373;
  --min-text-disabled: #a3a3a3;

  /* ---- Accent (exactly one) ---- */
  --min-accent: #2563eb;
  --min-accent-hover: #1d4ed8;
  --min-accent-active: #1e40af;
  --min-accent-fg: #ffffff;
  --min-accent-subtle: #eff6ff;

  /* ---- Semantic (second hue only) ---- */
  --min-danger: #dc2626;
  --min-danger-fg: #ffffff;

  /* ---- Focus ---- */
  --min-focus-ring: #2563eb;
  --min-focus-ring-width: 2px;
  --min-focus-ring-offset: 2px;

  /* ---- Radius ---- */
  --min-radius-sm: 4px;
  --min-radius-md: 8px;
  --min-radius-lg: 12px;
  --min-radius-full: 9999px;

  /* ---- Elevation: three steps, no more ---- */
  --min-shadow-0: none;
  --min-shadow-1: 0 1px 2px rgb(0 0 0 / 0.04);
  --min-shadow-2: 0 4px 12px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04);

  /* ---- Typography ---- */
  --min-font-sans: Inter, "Geist Sans", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --min-font-mono: "Geist Mono", ui-monospace, SFMono-Regular, "SF Mono",
    Menlo, Consolas, monospace;

  --min-text-xs: 0.75rem;    /* 12px */
  --min-text-sm: 0.875rem;   /* 14px */
  --min-text-base: 1rem;     /* 16px */
  --min-text-lg: 1.125rem;   /* 18px */
  --min-text-xl: 1.25rem;    /* 20px */
  --min-text-2xl: 1.5rem;    /* 24px */
  --min-text-3xl: 1.875rem;  /* 30px */
  --min-text-4xl: 2.25rem;   /* 36px */
  --min-text-5xl: 3rem;      /* 48px */

  --min-leading-tight: 1.2;
  --min-leading-snug: 1.4;
  --min-leading-normal: 1.5;
  --min-tracking-tight: -0.011em;
  --min-tracking-display: -0.02em;
  --min-weight-normal: 400;
  --min-weight-medium: 500;
  --min-weight-semibold: 600;
  --min-measure: 65ch;

  /* ---- Spacing: 4px base ---- */
  --min-space-1: 4px;
  --min-space-2: 8px;
  --min-space-3: 12px;
  --min-space-4: 16px;
  --min-space-6: 24px;
  --min-space-8: 32px;
  --min-space-12: 48px;
  --min-space-16: 64px;
  --min-space-24: 96px;

  /* ---- Control sizing ---- */
  --min-control-sm: 32px;
  --min-control-md: 36px;
  --min-control-lg: 40px;
  --min-target-min: 24px; /* WCAG 2.2 SC 2.5.8 floor */

  /* ---- Motion ---- */
  --min-dur-instant: 100ms;
  --min-dur-fast: 150ms;
  --min-dur-base: 200ms;
  --min-dur-slow: 300ms;
  --min-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --min-ease-exit: cubic-bezier(0.4, 0, 1, 1);

  /* ---- Explicitly zero: the anti-glassmorphism guarantee ---- */
  --min-backdrop-blur: 0px;
  --min-backdrop-saturate: 1;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --min-bg-canvas: #0a0a0a;
    --min-bg-subtle: #131313;
    --min-surface-1: #161616;
    --min-surface-2: #1e1e1e;
    --min-surface-hover: #242424;

    --min-border-subtle: rgb(255 255 255 / 0.10);
    --min-border-strong: #7a7a7a;

    --min-text-primary: #fafafa;
    --min-text-secondary: #b4b4b4;
    --min-text-muted: #8f8f8f;
    --min-text-disabled: #6b6b6b;

    --min-accent: #60a5fa;
    --min-accent-hover: #93c5fd;
    --min-accent-active: #bfdbfe;
    --min-accent-fg: #0a0a0a;
    --min-accent-subtle: #101c2e;

    --min-danger: #f87171;
    --min-danger-fg: #0a0a0a;

    --min-focus-ring: #93c5fd;

    --min-shadow-1: 0 1px 2px rgb(0 0 0 / 0.40);
    --min-shadow-2: 0 8px 24px rgb(0 0 0 / 0.50), 0 1px 2px rgb(0 0 0 / 0.40);
  }
}

/* Explicit class/attribute override so a toggle beats the media query both ways */
:root[data-theme="dark"] {
  --min-bg-canvas: #0a0a0a;
  --min-bg-subtle: #131313;
  --min-surface-1: #161616;
  --min-surface-2: #1e1e1e;
  --min-surface-hover: #242424;
  --min-border-subtle: rgb(255 255 255 / 0.10);
  --min-border-strong: #7a7a7a;
  --min-text-primary: #fafafa;
  --min-text-secondary: #b4b4b4;
  --min-text-muted: #8f8f8f;
  --min-text-disabled: #6b6b6b;
  --min-accent: #60a5fa;
  --min-accent-hover: #93c5fd;
  --min-accent-active: #bfdbfe;
  --min-accent-fg: #0a0a0a;
  --min-accent-subtle: #101c2e;
  --min-danger: #f87171;
  --min-danger-fg: #0a0a0a;
  --min-focus-ring: #93c5fd;
  --min-shadow-1: 0 1px 2px rgb(0 0 0 / 0.40);
  --min-shadow-2: 0 8px 24px rgb(0 0 0 / 0.50), 0 1px 2px rgb(0 0 0 / 0.40);
}
```

## 5. Implementation Recipes

### Vanilla CSS

A complete minimal surface kit: page shell, card, button variants, input, and a data row. Paste after the token block above.

```css
/* ---------- Base ---------- */
*,
*::before,
*::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--min-bg-subtle);
  color: var(--min-text-primary);
  font-family: var(--min-font-sans);
  font-size: var(--min-text-base);
  line-height: var(--min-leading-normal);
  font-synthesis-weight: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* ---------- Layout rhythm ---------- */
.min-page {
  max-width: 1120px;
  margin-inline: auto;
  padding: var(--min-space-16) var(--min-space-6);
  display: grid;
  gap: var(--min-space-16);
}

.min-section { display: grid; gap: var(--min-space-6); }

.min-prose {
  max-width: var(--min-measure);
  display: grid;
  gap: var(--min-space-4);
}

.min-prose h2 {
  margin: 0;
  font-size: var(--min-text-2xl);
  font-weight: var(--min-weight-semibold);
  line-height: var(--min-leading-tight);
  letter-spacing: var(--min-tracking-tight);
}

.min-prose p { margin: 0; color: var(--min-text-secondary); }

/* ---------- Card ---------- */
.min-card {
  background: var(--min-surface-1);
  border: var(--min-border-width) solid var(--min-border-subtle);
  border-radius: var(--min-radius-lg);
  padding: var(--min-space-6);
  box-shadow: var(--min-shadow-0);
  display: grid;
  gap: var(--min-space-3);
}

.min-card__title {
  font-size: var(--min-text-lg);
  font-weight: var(--min-weight-medium);
  letter-spacing: var(--min-tracking-tight);
}

.min-card__meta {
  font-size: var(--min-text-sm);
  color: var(--min-text-muted);
  font-variant-numeric: tabular-nums;
}

/* ---------- Buttons ---------- */
.min-btn {
  --_bg: var(--min-surface-1);
  --_fg: var(--min-text-primary);
  --_bd: var(--min-border-strong);

  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--min-space-2);
  min-height: var(--min-control-lg);
  min-width: var(--min-target-min);
  padding-inline: var(--min-space-4);
  border: var(--min-border-width) solid var(--_bd);
  border-radius: var(--min-radius-md);
  background: var(--_bg);
  color: var(--_fg);
  font: inherit;
  font-size: var(--min-text-sm);
  font-weight: var(--min-weight-medium);
  line-height: 1;
  cursor: pointer;
  transition:
    background-color var(--min-dur-fast) var(--min-ease-standard),
    border-color var(--min-dur-fast) var(--min-ease-standard),
    opacity var(--min-dur-fast) var(--min-ease-standard);
}

.min-btn:hover { background: var(--min-surface-hover); }
.min-btn:active { background: var(--min-surface-2); }

.min-btn--primary {
  --_bg: var(--min-accent);
  --_fg: var(--min-accent-fg);
  --_bd: var(--min-accent);
}
.min-btn--primary:hover {
  background: var(--min-accent-hover);
  border-color: var(--min-accent-hover);
}
.min-btn--primary:active {
  background: var(--min-accent-active);
  border-color: var(--min-accent-active);
}

/* Tertiary: the ONLY borderless variant, and it must carry an underline on hover */
.min-btn--quiet {
  --_bg: transparent;
  --_fg: var(--min-text-secondary);
  --_bd: transparent;
}
.min-btn--quiet:hover {
  background: var(--min-surface-2);
  color: var(--min-text-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.min-btn--danger {
  --_bg: var(--min-danger);
  --_fg: var(--min-danger-fg);
  --_bd: var(--min-danger);
}

.min-btn[disabled],
.min-btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading: no spinner theatre, just a 2px determinate-less bar under the label */
.min-btn[data-loading="true"] { position: relative; color: transparent; }
.min-btn[data-loading="true"]::after {
  content: "";
  position: absolute;
  inset-block-end: 4px;
  inset-inline: 12px;
  block-size: 2px;
  border-radius: 1px;
  background: currentColor;
  color: var(--_fg);
  animation: min-progress 1200ms var(--min-ease-standard) infinite;
  transform-origin: left center;
}

@keyframes min-progress {
  0%   { transform: scaleX(0); opacity: 0.35; }
  50%  { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(0); opacity: 0.35; transform-origin: right center; }
}

/* ---------- Focus ---------- */
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: var(--min-focus-ring-width) solid var(--min-focus-ring);
  outline-offset: var(--min-focus-ring-offset);
  border-radius: var(--min-radius-sm);
}

/* ---------- Input ---------- */
.min-field { display: grid; gap: var(--min-space-2); }

.min-label {
  font-size: var(--min-text-sm);
  font-weight: var(--min-weight-medium);
  color: var(--min-text-secondary);
}

.min-input {
  min-height: var(--min-control-lg);
  padding: 0 var(--min-space-3);
  background: var(--min-surface-1);
  color: var(--min-text-primary);
  border: var(--min-border-width) solid var(--min-border-strong);
  border-radius: var(--min-radius-md);
  font: inherit;
  font-size: var(--min-text-sm);
  transition: border-color var(--min-dur-fast) var(--min-ease-standard);
}

.min-input::placeholder { color: var(--min-text-muted); }
.min-input:hover { border-color: var(--min-text-secondary); }
.min-input:focus-visible { border-color: var(--min-accent); }

.min-help {
  font-size: var(--min-text-xs);
  color: var(--min-text-muted);
}

/* ---------- Data row: grouping by space, not by rules ---------- */
.min-list { display: grid; }
.min-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--min-space-4);
  padding: var(--min-space-3) var(--min-space-4);
  border-block-end: var(--min-border-width) solid var(--min-border-subtle);
}
.min-row:last-child { border-block-end: 0; }
.min-row:hover { background: var(--min-surface-2); }

/* ---------- Forced colors ---------- */
@media (forced-colors: active) {
  .min-card,
  .min-input,
  .min-btn { border: 1px solid ButtonBorder; }
  .min-btn--primary { forced-color-adjust: none; background: Highlight; color: HighlightText; }
  :where(a, button, input, select, textarea, summary):focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .min-btn[data-loading="true"]::after {
    animation: none;
    transform: scaleX(1);
    opacity: 0.6;
  }
}
```

### Tailwind CSS v4

Tailwind v4 replaced the JavaScript config with the CSS-first `@theme` directive. Variables declared in `@theme` both emit CSS custom properties and generate utilities. No plugin is required for this style; `@tailwindcss/typography` is optional if you render long-form Markdown.

```css
/* app.css */
@import "tailwindcss";

@theme {
  /* Nuke Tailwind's default 22-hue palette — minimalism ships one accent, not 220 colors. */
  --color-*: initial;

  --color-canvas: #ffffff;
  --color-subtle: #fafafa;
  --color-surface: #ffffff;
  --color-surface-2: #f5f5f5;
  --color-line: oklch(0 0 0 / 0.08);
  --color-line-strong: #8f8f8f;
  --color-ink: #0a0a0a;
  --color-ink-2: #525252;
  --color-ink-3: #737373;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-fg: #ffffff;
  --color-danger: #dc2626;
  --color-white: #ffffff;
  --color-black: #000000;
  --color-transparent: transparent;
  --color-current: currentColor;

  /* 4px base unit drives every p-*, gap-*, w-*, h-* utility */
  --spacing: 0.25rem;

  --font-sans: Inter, "Geist Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  --text-xs: 0.75rem;
  --text-xs--line-height: 1.3333;
  --text-sm: 0.875rem;
  --text-sm--line-height: 1.4286;
  --text-base: 1rem;
  --text-base--line-height: 1.5;
  --text-lg: 1.125rem;
  --text-lg--line-height: 1.5556;
  --text-2xl: 1.5rem;
  --text-2xl--line-height: 1.3333;
  --text-4xl: 2.25rem;
  --text-4xl--line-height: 1.1111;

  --tracking-tight: -0.011em;
  --tracking-display: -0.02em;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Two elevation steps only */
  --shadow-*: initial;
  --shadow-raised: 0 1px 2px rgb(0 0 0 / 0.04);
  --shadow-overlay: 0 4px 12px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04);

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  --container-measure: 65ch;
}

/* Dark mode: a plain variant driven by data-theme, plus the system default */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@layer base {
  :root { color-scheme: light dark; }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --color-canvas: #0a0a0a;
      --color-subtle: #131313;
      --color-surface: #161616;
      --color-surface-2: #1e1e1e;
      --color-line: oklch(1 0 0 / 0.10);
      --color-line-strong: #7a7a7a;
      --color-ink: #fafafa;
      --color-ink-2: #b4b4b4;
      --color-ink-3: #8f8f8f;
      --color-accent: #60a5fa;
      --color-accent-hover: #93c5fd;
      --color-accent-fg: #0a0a0a;
      --color-danger: #f87171;
    }
  }

  :root[data-theme="dark"] {
    --color-canvas: #0a0a0a;
    --color-subtle: #131313;
    --color-surface: #161616;
    --color-surface-2: #1e1e1e;
    --color-line: oklch(1 0 0 / 0.10);
    --color-line-strong: #7a7a7a;
    --color-ink: #fafafa;
    --color-ink-2: #b4b4b4;
    --color-ink-3: #8f8f8f;
    --color-accent: #60a5fa;
    --color-accent-hover: #93c5fd;
    --color-accent-fg: #0a0a0a;
    --color-danger: #f87171;
  }

  body {
    background-color: var(--color-subtle);
    color: var(--color-ink);
    font-family: var(--font-sans);
  }
}
```

Markup using only the tokens above:

```html
<main class="mx-auto max-w-[70rem] px-6 py-16 grid gap-16">
  <section class="grid gap-6">
    <div class="grid gap-3 max-w-(--container-measure)">
      <h1 class="text-4xl font-semibold tracking-display text-ink">Invoices</h1>
      <p class="text-base text-ink-2">
        Every invoice issued in the current billing period. Nothing is hidden behind a filter.
      </p>
    </div>

    <div class="rounded-lg border border-line bg-surface">
      <div class="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line px-4 py-3 hover:bg-surface-2">
        <div class="grid gap-1">
          <span class="text-sm font-medium text-ink">INV-2026-0148</span>
          <span class="text-xs text-ink-3 tabular-nums">Issued 12 Jul 2026 &middot; $4,200.00</span>
        </div>
        <a
          href="/invoices/148"
          class="inline-flex min-h-10 items-center rounded-md border border-line-strong px-4 text-sm font-medium text-ink transition-colors duration-150 ease-standard hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View
        </a>
      </div>
      <div class="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 hover:bg-surface-2">
        <div class="grid gap-1">
          <span class="text-sm font-medium text-ink">INV-2026-0147</span>
          <span class="text-xs text-ink-3 tabular-nums">Issued 28 Jun 2026 &middot; $1,180.00</span>
        </div>
        <a
          href="/invoices/147"
          class="inline-flex min-h-10 items-center rounded-md border border-line-strong px-4 text-sm font-medium text-ink transition-colors duration-150 ease-standard hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View
        </a>
      </div>
    </div>

    <button
      type="button"
      class="inline-flex min-h-10 w-fit items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg shadow-raised transition-colors duration-150 ease-standard hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      New invoice
    </button>
  </section>
</main>
```

Notes on v4 specifics: `--color-*: initial` clears the default palette so nobody can reach for `bg-fuchsia-400`; `--spacing: 0.25rem` regenerates the whole numeric spacing scale from a single 4px unit; `--shadow-*: initial` removes Tailwind's six shadow steps and leaves the two this style permits; `max-w-(--container-measure)` is v4's shorthand for referencing a theme variable in an arbitrary value.

### React component

TypeScript, props-driven, zero dependencies beyond React. Ships the three components that carry 80% of a minimalist system: `Stack` (the whitespace engine), `Button`, and `Card`.

```tsx
// minimal-ui.tsx
import * as React from "react";

/* ------------------------------------------------------------------ */
/* Spacing scale — the only place magic numbers are allowed to live    */
/* ------------------------------------------------------------------ */

const SPACE = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
  12: "48px",
  16: "64px",
  24: "96px",
} as const;

export type Space = keyof typeof SPACE;

/* ------------------------------------------------------------------ */
/* Stack                                                               */
/* ------------------------------------------------------------------ */

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between children, in 4px units from the minimal scale. */
  gap?: Space;
  /** Flow direction. */
  direction?: "row" | "column";
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch";
  /** Main-axis distribution. */
  justify?: "start" | "center" | "end" | "between";
  /** Clamp to a readable measure (65ch). Column direction only. */
  measure?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

const ALIGN = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" } as const;
const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const;

export function Stack({
  gap = 4,
  direction = "column",
  align = "stretch",
  justify = "start",
  measure = false,
  as = "div",
  style,
  ...rest
}: StackProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      {...rest}
      style={{
        display: "flex",
        flexDirection: direction,
        gap: SPACE[gap],
        alignItems: ALIGN[align],
        justifyContent: JUSTIFY[justify],
        maxWidth: measure && direction === "column" ? "65ch" : undefined,
        ...style,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a progress bar and sets aria-busy. Keeps the button focusable. */
  loading?: boolean;
  /** Accessible label; required when the button has no visible text. */
  label?: string;
  /** Leading glyph. Must be decorative — the label carries the meaning. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const HEIGHTS: Record<ButtonSize, string> = { sm: "32px", md: "36px", lg: "40px" };
const PADDING: Record<ButtonSize, string> = { sm: "0 12px", md: "0 14px", lg: "0 16px" };

const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "var(--min-accent)",
    color: "var(--min-accent-fg)",
    borderColor: "var(--min-accent)",
  },
  secondary: {
    background: "var(--min-surface-1)",
    color: "var(--min-text-primary)",
    borderColor: "var(--min-border-strong)",
  },
  quiet: {
    background: "transparent",
    color: "var(--min-text-secondary)",
    borderColor: "transparent",
  },
  danger: {
    background: "var(--min-danger)",
    color: "var(--min-danger-fg)",
    borderColor: "var(--min-danger)",
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "lg", loading = false, label, icon, children, disabled, style, ...rest },
  ref,
) {
  const iconOnly = !children;

  if (process.env.NODE_ENV !== "production" && iconOnly && !label) {
    console.warn("[minimal-ui] Icon-only Button requires a `label` prop for screen readers.");
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={rest.type ?? "button"}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-label={iconOnly ? label : undefined}
      data-variant={variant}
      data-loading={loading || undefined}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACE[2],
        minHeight: HEIGHTS[size],
        /* WCAG 2.2 SC 2.5.8 floor for icon-only targets — from the token,
           so a theme override moves the floor in one place, not two */
        minWidth: iconOnly ? "var(--min-target-min)" : undefined,
        inlineSize: iconOnly ? HEIGHTS[size] : undefined,
        padding: iconOnly ? 0 : PADDING[size],
        border: "1px solid",
        borderRadius: "var(--min-radius-md)",
        font: "inherit",
        fontSize: size === "sm" ? "var(--min-text-xs)" : "var(--min-text-sm)",
        fontWeight: 500,
        lineHeight: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background-color 150ms cubic-bezier(0.2,0,0,1), border-color 150ms cubic-bezier(0.2,0,0,1)",
        ...VARIANTS[variant],
        ...style,
      }}
    >
      {icon ? <span aria-hidden="true" style={{ display: "inline-flex" }}>{icon}</span> : null}
      <span style={{ visibility: loading ? "hidden" : "visible" }}>{children}</span>
      {loading ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            insetInline: "12px",
            insetBlockEnd: "4px",
            blockSize: "2px",
            borderRadius: "1px",
            background: "currentColor",
            opacity: 0.7,
          }}
        />
      ) : null}
      {loading ? <span style={{ position: "absolute", inlineSize: 1, blockSize: 1, overflow: "hidden", clipPath: "inset(50%)" }}>Loading</span> : null}
    </button>
  );
});

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** 0 = flat (default), 1 = hairline shadow, 2 = overlay. Nothing above 2 exists. */
  elevation?: 0 | 1 | 2;
  padding?: Space;
  /** Renders as <section> with an accessible name when `title` is supplied. */
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

const SHADOWS = ["none", "var(--min-shadow-1)", "var(--min-shadow-2)"] as const;

export function Card({
  elevation = 0,
  padding = 6,
  title,
  description,
  footer,
  children,
  style,
  ...rest
}: CardProps) {
  const headingId = React.useId();
  return (
    <section
      {...rest}
      aria-labelledby={title ? headingId : undefined}
      style={{
        display: "grid",
        gap: SPACE[3],
        background: "var(--min-surface-1)",
        border: "1px solid var(--min-border-subtle)",
        borderRadius: "var(--min-radius-lg)",
        padding: SPACE[padding],
        boxShadow: SHADOWS[elevation],
        ...style,
      }}
    >
      {title ? (
        <h3
          id={headingId}
          style={{
            margin: 0,
            fontSize: "var(--min-text-lg)",
            fontWeight: 500,
            letterSpacing: "-0.011em",
            color: "var(--min-text-primary)",
          }}
        >
          {title}
        </h3>
      ) : null}
      {description ? (
        <p style={{ margin: 0, fontSize: "var(--min-text-sm)", color: "var(--min-text-secondary)", maxWidth: "65ch" }}>
          {description}
        </p>
      ) : null}
      {children}
      {footer ? (
        <div style={{ display: "flex", gap: SPACE[2], justifyContent: "flex-end", paddingBlockStart: SPACE[2] }}>
          {footer}
        </div>
      ) : null}
    </section>
  );
}
```

Usage:

```tsx
export function InvoicePanel() {
  return (
    <Stack gap={8} measure>
      <Card
        title="Payment method"
        description="Charges are made to the card on file at the end of each billing period."
        elevation={0}
        footer={
          <>
            <Button variant="quiet">Cancel</Button>
            <Button variant="primary">Update card</Button>
          </>
        }
      >
        <Stack direction="row" gap={2} align="center">
          <span style={{ fontFamily: "var(--min-font-mono)", fontSize: "var(--min-text-sm)" }}>
            •••• 4242
          </span>
          <span style={{ fontSize: "var(--min-text-xs)", color: "var(--min-text-muted)" }}>
            Expires 04/29
          </span>
        </Stack>
      </Card>
    </Stack>
  );
}
```

### Native / other platform — SwiftUI

SwiftUI is the genuinely relevant target here, because since iOS 26 the platform default is *no longer* minimal. Apple's Liquid Glass material is applied automatically to standard bars and controls once you build against the iOS 26 SDK. A minimalist app on Apple platforms in 2026 is therefore an act of deliberate opt-out: flat fills, hairline separators, and system typography with no glass.

```swift
import SwiftUI

// MARK: - Tokens

enum Min {
    static let space1: CGFloat = 4
    static let space2: CGFloat = 8
    static let space3: CGFloat = 12
    static let space4: CGFloat = 16
    static let space6: CGFloat = 24
    static let space8: CGFloat = 32

    static let radius: CGFloat = 8
    static let radiusLarge: CGFloat = 12
    static let controlHeight: CGFloat = 44   // Apple HIG minimum touch target

    static let canvas = Color(.systemBackground)
    static let surface2 = Color(.secondarySystemBackground)
    static let line = Color.primary.opacity(0.10)
    static let lineStrong = Color.primary.opacity(0.35)
    static let ink = Color.primary
    static let ink2 = Color.secondary
    static let accent = Color(red: 0.145, green: 0.388, blue: 0.922)  // #2563EB

    static let duration: Double = 0.18
}

// MARK: - Button style

struct MinimalButtonStyle: ButtonStyle {
    enum Variant { case primary, secondary, quiet }
    var variant: Variant = .secondary

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 15, weight: .medium))
            .frame(minHeight: Min.controlHeight)
            .padding(.horizontal, Min.space4)
            .foregroundStyle(foreground)
            .background(background(pressed: configuration.isPressed))
            .overlay(
                RoundedRectangle(cornerRadius: Min.radius, style: .continuous)
                    .strokeBorder(border, lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: Min.radius, style: .continuous))
            .contentShape(RoundedRectangle(cornerRadius: Min.radius, style: .continuous))
            .animation(.easeOut(duration: Min.duration), value: configuration.isPressed)
    }

    private var foreground: Color {
        switch variant {
        case .primary: return .white
        case .secondary: return Min.ink
        case .quiet: return Min.ink2
        }
    }

    private func background(pressed: Bool) -> Color {
        switch variant {
        case .primary: return pressed ? Min.accent.opacity(0.85) : Min.accent
        case .secondary: return pressed ? Min.surface2 : Min.canvas
        case .quiet: return pressed ? Min.surface2 : .clear
        }
    }

    private var border: Color {
        switch variant {
        case .primary: return .clear
        case .secondary: return Min.lineStrong
        case .quiet: return .clear
        }
    }
}

// MARK: - Card

struct MinimalCard<Content: View>: View {
    let title: String
    var subtitle: String? = nil
    @ViewBuilder var content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: Min.space3) {
            Text(title)
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(Min.ink)
            if let subtitle {
                Text(subtitle)
                    .font(.system(size: 14))
                    .foregroundStyle(Min.ink2)
                    .fixedSize(horizontal: false, vertical: true)
            }
            content()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(Min.space6)
        .background(Min.canvas)
        .overlay(
            RoundedRectangle(cornerRadius: Min.radiusLarge, style: .continuous)
                .strokeBorder(Min.line, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: Min.radiusLarge, style: .continuous))
    }
}

// MARK: - Screen

struct BillingScreen: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Min.space8) {
                Text("Billing")
                    .font(.system(size: 34, weight: .semibold))
                    .kerning(-0.6)

                MinimalCard(
                    title: "Payment method",
                    subtitle: "Charges are made to the card on file at the end of each billing period."
                ) {
                    HStack(spacing: Min.space2) {
                        Text("•••• 4242").font(.system(size: 14, design: .monospaced))
                        Text("Expires 04/29").font(.system(size: 12)).foregroundStyle(Min.ink2)
                    }
                    HStack(spacing: Min.space2) {
                        Button("Cancel") {}.buttonStyle(MinimalButtonStyle(variant: .quiet))
                        Button("Update card") {}.buttonStyle(MinimalButtonStyle(variant: .primary))
                    }
                    .padding(.top, Min.space2)
                }
            }
            .padding(Min.space4)
        }
        .background(Min.surface2)
        .scrollBounceBehavior(.basedOnSize)
        .animation(reduceMotion ? nil : .easeOut(duration: Min.duration), value: reduceMotion)
    }
}
```

Two practical notes for 2026 Apple targets: standard `NavigationStack` bars and `.toolbar` items will pick up Liquid Glass automatically when compiled with the iOS 26 SDK, so keep custom minimal chrome inside the content area rather than fighting the system bars; and if you deliberately reduce translucency, honour `@Environment(\.accessibilityReduceTransparency)` so you are not the only surface in the OS that ignores the user's setting.

## 6. Interaction & Motion

Minimalism has fewer visual channels than any other style in this set, so state must be encoded in *colour value* and *border* rather than in depth, glow, or texture. The rule: every state change must be perceptible at 200% zoom, in greyscale, and with animations disabled.

| State | Treatment | Values |
|---|---|---|
| Rest | Flat fill, hairline border | `var(--min-surface-1)`, `1px solid var(--min-border-strong)` for controls (`--min-border-strong` is the 3:1 boundary token defined in §4 — `--min-border-subtle` is decorative and must not be used here) |
| Hover | Background steps one surface level; never move the element | `var(--min-surface-hover)` (light: `#F0F0F0`, ~2% luminance drop); `var(--min-dur-fast)` |
| Hover (link) | Underline appears | `text-decoration: underline; text-underline-offset: 3px` — colour alone fails 1.4.1 |
| Active/pressed | Background steps a second level, no transform, or `scale(0.98)` max | `var(--min-surface-2)`; `var(--min-dur-instant)`; easing `var(--min-ease-exit)` |
| Focus-visible | 2px solid accent ring at 2px offset — **outside** the element so it is never clipped | `outline: var(--min-focus-ring-width) solid var(--min-focus-ring); outline-offset: var(--min-focus-ring-offset)` |
| Selected | Accent-tinted background plus a 2px accent inline-start bar | `background: var(--min-accent-subtle)`, `box-shadow: inset 2px 0 0 var(--min-accent)` |
| Disabled | 50% opacity, `cursor: not-allowed`, `aria-disabled` | Never rely on opacity alone to communicate *why* |
| Loading | Determinate bar when progress is known; a 2px indeterminate bar otherwise. No spinners over 24px, no skeleton shimmer | 1200ms loop; announce via `aria-busy` + visually-hidden "Loading" |
| Error | 1px `var(--min-danger)` border plus a text message with an icon; never colour-only | Message at `var(--min-text-sm)`, `--min-danger` on `--min-surface-1` = 4.83:1 in light mode |
| Empty | Single sentence plus one primary action; no illustration larger than 96px | — |

**Durations.** 100ms for colour-only feedback on a control the pointer is already over; 150ms for hover/active; 200ms for local expansion (accordion, popover); 300ms for full-panel transitions. Nothing in this style should exceed 300ms — the whole point is that the interface gets out of the way.

**Easing.** `cubic-bezier(0.2, 0, 0, 1)` for entrances and state changes (fast start, long settle), `cubic-bezier(0.4, 0, 1, 1)` for exits. Springs and overshoot belong to Material 3 Expressive and claymorphism, not here. If a motion curve has a control point outside `[0,1]`, it is off-style.

**What should animate:** `opacity`, `background-color`, `border-color`, `color`, `transform: translate` up to 8px, `transform: scale` between 0.98 and 1.02, and `clip-path`/`grid-template-rows` for disclosure.

**What must not animate:** layout-affecting properties (`width`, `height`, `padding`, `margin`, `top/left`), `box-shadow` on large surfaces (paint-expensive), `filter`, `letter-spacing`, and anything with an infinite loop that is not communicating an ongoing process.

**prefers-reduced-motion.** Reduce, do not delete. Keep opacity cross-fades at ≤ 100ms so state changes remain legible; remove all translation, all looping animation, all parallax and all `scroll-behavior: smooth`. The global reset shown in the Vanilla CSS recipe is a safe floor; prefer per-component overrides that preserve a short fade.

```css
@media (prefers-reduced-motion: reduce) {
  .min-popover { animation: none; transition: opacity 100ms linear; }
  .min-btn:active { transform: none; }
}
```

## 7. Accessibility

Minimalism is not inherently inaccessible — the Swiss grid, generous leading, and short measures are genuinely helpful. The risk is concentrated in what gets deleted. Ranked by how often it actually fails audits:

**1.4.3 Contrast (Minimum) — AA, 4.5:1 body / 3:1 for text ≥ 24px or ≥ 18.66px bold.** The signature failure of the style. Contrast math on white (`#FFFFFF`, relative luminance 1.0):

| Grey | Relative luminance | Ratio on `#FFFFFF` | Verdict |
|---|---|---|---|
| `#525252` | 0.0844 | 7.81:1 | Pass AAA |
| `#737373` | 0.1714 | 4.74:1 | Pass AA — the lightest legal body grey |
| `#8A8A8A` | 0.2542 | 3.45:1 | Fail body, pass large text |
| `#999999` | 0.3185 | 2.85:1 | Fail everything |
| `#A3A3A3` | 0.3663 | 2.52:1 | Disabled text only |

The arithmetic is `(L1 + 0.05) / (L2 + 0.05)`. On white this reduces to `1.05 / (L + 0.05)`, so hitting 4.5:1 requires `L ≤ 0.1833` — i.e. roughly `#757575` or darker. Anything in the `#888`–`#AAA` band that a designer calls "secondary text" is a defect.

**1.4.11 Non-text Contrast — AA, 3:1.** Hairline borders are the other signature failure. `#E5E5E5` on white is 1.26:1. That is fine for a *decorative* separator between two rows, but if a 1px border is the only thing telling a user where an input or a secondary button begins, it must reach 3:1. On white the boundary colour is `#949494` (3.03:1 — the lightest grey that clears the bar; `#959595` is already 2.995:1, and WCAG does not round up to meet a threshold); ship `#8F8F8F` for margin. Same rule applies to the unchecked state of checkboxes, toggle tracks, slider rails, and focus indicators.

**2.4.7 Focus Visible — AA** and **2.4.13 Focus Appearance — AAA.** Never write `outline: none` without an immediate replacement. Use `:focus-visible`, not `:focus`, so pointer users do not see rings. The AAA target is an indicator at least as large as a 2px perimeter of the component with 3:1 between focused and unfocused pixels — a 2px accent outline at 2px offset satisfies it and is the recommended default even if you only claim AA.

**2.4.11 Focus Not Obscured (Minimum) — AA.** Minimalist layouts love thin sticky headers and edge-to-edge sticky footers. A focused element scrolled under a `position: sticky` bar violates this. Fix with `scroll-margin-block: calc(<your sticky header height> + var(--min-space-2))` on every focusable element — the header height is your application's own value, not a `--min-` token, so substitute it literally or declare it under your own prefix — or set `scroll-padding-block-start` on the scroll container.

**2.5.8 Target Size (Minimum) — AA, 24×24 CSS px.** Icon-only ghost buttons at 16px, close "×" glyphs, and dense table row actions are the usual offenders. That floor is a token, not a literal: `--min-target-min` (`24px`) is the value `.min-btn` takes its `min-width` from in §5, and nothing in a downstream theme may override it downward. The floor is not the target, though — the resting size comes from `--min-control-lg` (`40px`), and 44×44 is the better product decision on any touch-primary surface, so reach for `--min-target-min` only when a control genuinely cannot be given a control height. The alternative to sizing up is the spacing exception: a smaller target passes if a `--min-target-min`-diameter (24px) circle centred on it does not intersect the circle of any adjacent target.

**1.4.1 Use of Color — A.** Minimalist palettes push teams to encode meaning in the single accent hue: selected tab = blue text, error = red text. Add a second channel every time — underline, icon, weight change, inline-start bar, or text label.

**1.4.12 Text Spacing — AA.** Tight, precisely-tuned typography breaks when users override spacing. Test with line-height 1.5×, paragraph spacing 2×, letter-spacing 0.12em, word-spacing 0.16em. Fixed-height buttons and single-line truncated labels are the things that break; use `min-height` rather than `height`, and avoid `overflow: hidden` on text containers.

**1.4.4 Resize Text — AA, 200%.** Use `rem` for type and `ch`/`rem` for measure. A `max-width` set in `px` will not grow with text size and will clip at 200%.

**Screen reader and DOM order.** Minimalism encourages visually implied grouping — space instead of a fieldset, size instead of a heading. Screen readers cannot see space. Every visual group needs a real semantic container: `<section aria-labelledby>`, `<fieldset><legend>`, `<nav aria-label>`, a real `<h2>`. Never simulate a heading with a `<div>` in a larger font. And because minimal layouts lean on CSS grid/flex reordering, verify that `order`, `grid-area`, and `flex-direction: row-reverse` have not decoupled DOM order from visual order (SC 1.3.2 Meaningful Sequence, 2.4.3 Focus Order).

**Forced colors / Windows High Contrast.** Minimalism actually degrades well here because it has little to lose — but transparent-background ghost buttons vanish entirely, since `background: transparent` plus `border: transparent` leaves nothing for the forced palette to paint. Inside `@media (forced-colors: active)`, give every interactive element `border: 1px solid ButtonBorder`, and map the primary action to `Highlight`/`HighlightText` with `forced-color-adjust: none` only on that fill. Never use `background-image` gradients to convey state; they are removed.

**Reduce transparency and reduce motion.** This style declares `--min-backdrop-blur: 0px`, so `prefers-reduced-transparency` is mostly a no-op — which is a genuine advantage over glassmorphism. Still honour it on any overlay scrim: raise scrim opacity from 0.4 to 0.85 rather than blurring.

### Pass/fail checklist

- [ ] Every text colour on every surface it can appear on measures ≥ 4.5:1 (≥ 3:1 for ≥24px or ≥18.66px bold). Automate it; do not eyeball it.
- [ ] No body text uses a grey lighter than `#737373` on white or darker than `#787878` on `#0A0A0A`.
- [ ] Every control whose boundary is its only affordance has a border ≥ 3:1 against its adjacent background.
- [ ] `:focus-visible` produces a 2px ring at 2px offset on 100% of interactive elements, including custom widgets and links inside prose.
- [ ] No focused element can be fully covered by a sticky header or footer at any viewport height (`scroll-margin` set).
- [ ] Every interactive target takes its floor from `--min-target-min` (24px) rather than a hard-coded literal and measures ≥ 24×24 CSS px, or satisfies the 24px spacing exception.
- [ ] No state, status, or category is communicated by colour alone.
- [ ] Applying the 1.4.12 text-spacing overrides clips or overlaps nothing.
- [ ] At 200% browser zoom and 320px CSS width, the page reflows with no horizontal scroll (1.4.10).
- [ ] Every visually implied group has a matching semantic container with an accessible name.
- [ ] `forced-colors: active` renders every button, input, and card with a visible boundary.
- [ ] `prefers-reduced-motion: reduce` removes translation and looping animation while keeping state changes legible.
- [ ] Icon-only buttons all carry an `aria-label`; the icon itself is `aria-hidden`.
- [ ] Placeholder text is never the only label (3.3.2 Labels or Instructions).

## 8. Performance

Minimalism is the cheapest style in this set, and that is one of its strongest arguments in 2026 when Core Web Vitals feed both ranking and conversion.

**Rendering cost.** The expensive CSS features — `backdrop-filter`, large-radius `box-shadow`, multi-stop gradients, `filter: blur()`, `mix-blend-mode` — are all absent by definition. A minimal surface is a solid `background-color` plus a 1px `border`, which the rasteriser handles in a single fast path. There is no compositing layer promotion, so no extra GPU memory per card and no layer-explosion on long lists.

**Paint and layout.** The two rules that matter:
1. Animate only `opacity` and `transform`. Both are composited and skip layout and paint entirely. Transitioning `background-color` triggers paint but not layout, which is acceptable on small controls and unacceptable on full-width sticky headers during scroll.
2. Use `contain: content` on repeated list items and `content-visibility: auto` with a `contain-intrinsic-size` on long off-screen sections. Because minimal rows have predictable heights, `contain-intrinsic-size: 0 64px` is easy to get right, and it removes off-screen rows from layout and paint entirely.

**Asset weight budgets.** For a minimalist product page, a defensible budget:

| Asset | Budget | Rationale |
|---|---|---|
| CSS (critical, inlined) | ≤ 14 KB compressed | Fits the initial TCP congestion window |
| CSS (total) | ≤ 40 KB compressed | A one-accent token system rarely exceeds this |
| Fonts | ≤ 2 files, ≤ 120 KB total | One variable sans (WOFF2, subset to `latin`) ≈ 30–45 KB; add mono only if code is displayed |
| Icons | Inline SVG sprite ≤ 8 KB | Never an icon *font*: it blocks text render and breaks in forced-colors |
| Images above the fold | ≤ 150 KB | Minimalism uses few, so make them AVIF/WebP and `fetchpriority="high"` on the LCP one |
| JS for the visual layer | 0 KB | This style needs no runtime; all of it is CSS |

**Fonts are the single biggest risk.** In a style where typography carries the entire hierarchy, a late-swapping webfont produces the most visible CLS on the page. Use `font-display: swap` plus `size-adjust`/`ascent-override` on a matched local fallback so the swap causes near-zero reflow, preload exactly one weight-axis file, and prefer a variable font over four static cuts. A single variable WOFF2 subset to Latin typically lands at 30–45 KB versus 4 × ~25 KB for static weights.

**Mobile and low-end devices.** This is where minimalism wins outright. No blur means no per-frame GPU readback, which is the specific thing that drops glassmorphic UIs from 60fps to 20–30fps on older Android hardware. Realistic targets on a mid-tier 2022 Android phone throttled 4×: LCP ≤ 2.0s, INP ≤ 150ms, CLS ≤ 0.05, and steady 60fps scroll on a 500-row list with `content-visibility: auto`.

**Cheaper fallbacks, if you somehow still exceed budget.** Drop `--min-shadow-1` entirely and rely on borders (saves a paint pass per card); replace `border` with `box-shadow: inset 0 0 0 1px` only when you need to avoid affecting layout, otherwise prefer `border` since it does not create a paint region larger than the box; render list separators with a single `background: linear-gradient` on the container rather than N per-row borders when N > 200; and use `system-ui` with zero webfonts, which costs you brand distinctiveness but takes font weight to 0 KB.

## 9. When To Use / When Not To

**Use it when:**
- The product is a **tool people use daily** — code editors, terminals, issue trackers, analytics, CRMs, admin panels. Repeat exposure makes decoration fatiguing and makes learned affordances safe.
- The **content is the product**: documentation, long-form reading, knowledge bases, writing apps, email clients.
- You are building **AI chat and agent surfaces**. The 2026 "calm interface" consensus is that users want the result, not the theatre; minimal chat shells (ChatGPT, Claude) are the reference implementations.
- The audience is **technical or professional** and the brand promise is competence, precision, or trust — developer tools, fintech, legal, healthcare records, B2B SaaS.
- **Information density is high** and every non-data pixel competes with data (Tufte's argument applies literally to dashboards and tables).
- **Performance or reach is a hard constraint**: low-end devices, poor networks, embedded webviews, or an SEO-sensitive marketing site.
- You need a system that **ages slowly**. Minimal systems from 2018 still look current; the 2018 gradient-mesh ones do not.

**Do not use it when:**
- The product must **differentiate on feel** in a crowded consumer market. Minimalism's defining weakness in 2026 is that everyone has it; Google's Material 3 Expressive research was motivated precisely by apps looking interchangeable.
- The audience is **novice, occasional, or low-confidence** — consumer government services, healthcare intake for older adults, first-run onboarding. These users need maximum signifiers, not maximum restraint. NN/g's flat-design guidance limits low-signifier design to simple sites, returning users, and tech-expert audiences.
- The domain is **inherently emotional or expressive**: children's products, games, entertainment, social, creative communities, event marketing.
- The interface is **safety-critical or irreversible**. Delete, transfer, and deploy actions need loud, unambiguous, over-signified controls.
- Your team **cannot maintain the discipline**. Minimalism has no slack: one off-scale spacing value, one extra grey, or one unaligned edge is immediately visible. Styles with more visual noise hide inconsistency; this one amplifies it.
- You are shipping **native Apple UI in 2026** and want to feel current. The platform has moved to Liquid Glass; a fully flat app now reads as legacy unless flatness is the brand.
- **Marketing needs to convey abundance** — pricing pages with many differentiated tiers, feature-comparison landing pages, or anything where "we do a lot" is the message.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Set body text no lighter than `#737373` on white (4.74:1) and verify every pair with a contrast tool. | Don't use `#999` or `#AAA` for "secondary" text; those are 2.85:1 and 2.32:1 and fail 1.4.3. |
| Give every interactive control a boundary at ≥ 3:1 (`#8F8F8F` or darker on white). | Don't let a 1.26:1 hairline (`#E5E5E5`) be the only thing defining a button or input. |
| Use exactly one accent hue plus one semantic danger hue. | Don't add a third and fourth hue "for variety"; that is where minimal systems die. |
| Encode hierarchy with a 1.200 type scale, weight (400/500/600), and spacing. | Don't encode hierarchy with colour alone, and don't jump straight from 16px to 48px inside product chrome. |
| Group with a 4:1 spacing ratio — 8px inside a group, 32px between groups. | Don't reach for a divider line every time two things need separating. |
| Ship solid, filled primary buttons. | Don't ship ghost buttons as the primary CTA; NN/g advises against them and reported click rates run materially lower. |
| Clamp body copy to `max-width: 65ch` (Bringhurst's 45–75 CPL). | Don't let text run the full width of a 1440px viewport because "whitespace is on the sides." |
| Keep transitions at 100–200ms on `opacity`, `background-color`, `transform`. | Don't animate `width`, `height`, `margin`, or `box-shadow` on scroll-adjacent elements. |
| Size icon-only controls to at least 24×24 CSS px, ideally 40–44px. | Don't ship 16px close glyphs in dense tables; that fails SC 2.5.8. |
| Use `:focus-visible` with a 2px ring at 2px offset on everything focusable. | Don't write `outline: none` anywhere, ever, without an equivalent replacement in the same rule. |
| Give every visually implied group a real semantic container and accessible name. | Don't substitute whitespace for `<fieldset>`, `<section aria-labelledby>`, or a real heading. |
| Load one variable font, subset, preloaded, with a metric-matched fallback. | Don't load four static weights plus an icon font; it is the largest CLS and LCP risk in this style. |
| Test the whole UI in greyscale and in Windows High Contrast before shipping. | Don't assume "it's already flat, so high contrast is fine" — transparent ghost controls disappear entirely. |
| Reduce motion under `prefers-reduced-motion`, keeping a ≤100ms fade for state legibility. | Don't nuke all transitions to `0.01ms` in a way that makes state changes imperceptible. |

## 11. In The Wild (2024-2026)

- **Vercel — Geist design system and typeface.** Geist Sans and Geist Mono were released open-source in October 2023, built with Basement Studio; Vercel states the family embodies "simplicity, minimalism, and speed" and is inspired by Swiss design. Geist Pixel was added subsequently. Vercel's own product surfaces — dashboard, docs, `vercel.com` — are the canonical monochrome-plus-one-accent implementation, with mono-influenced typography and systematic 4px-based spacing.
- **shadcn/ui.** Launched January 2023; the default `neutral`/`zinc` theme is textbook minimalism — hairline borders, `rounded-md`, near-zero shadow, one accent. It introduced a Radix-or-Base-UI choice in December 2025 via `npx shadcn create`, shipped complete Base UI documentation in January 2026, and **made Base UI the default in July 2026** (Base UI 1.6.0), reporting a roughly 2:1 preference for Base UI among new projects. The visual language did not change with the primitive swap, which is itself evidence of how stable this aesthetic has become.
- **Linear.** The reference for dense, quiet, keyboard-first B2B minimalism: a tight spacing ramp in the 4–32px range, monochrome surfaces with a single accent, and near-invisible chrome around high-density issue lists.
- **Stripe.** Long-standing exemplar of minimalism at marketing scale — light display weights, disciplined whitespace, restrained accent use, and typography doing the hierarchy work rather than boxes and shadows.
- **Anthropic's Claude and OpenAI's ChatGPT web interfaces.** Both are minimal chat shells: a single conversation column, a collapsible thread sidebar, high-contrast text on a plain ground, and accent colour used almost exclusively for state and brand marks. Comparative reviews of conversational AI UIs through 2025–2026 describe both as deliberately utilitarian and distraction-free.
- **Nielsen Norman Group's own guidance corpus.** *The Roots of Minimalism in Web Design* (Kate Moran, 2015), *Flat Design Best Practices* (Kate Moran, 2017), and *Aesthetic and Minimalist Design — Usability Heuristic #8* (Therese Fessenden, 2021) remain the most cited practitioner references, and all three argue for minimalism as a task-service discipline rather than a visual trend.
- **Material Design 3 (Google).** Still built on a 4dp/8dp dual grid with components sized in multiples of 8 — the spacing substrate most minimal systems inherit — even as the 2025 Material 3 Expressive layer moves Google's *expression* away from restraint.
- **Apple platforms, as counterexample.** iOS 7 (2013) through iOS 18 (2024) were the flat era; iOS 26 and its siblings, announced at WWDC 2025, replaced it with Liquid Glass. Any 2026 Apple-native app that stays fully flat is now making a deliberate stylistic choice against the platform default.
- **The 2026 "calm interface" / "quiet UI" discourse.** Design writing through 2026 frames the newest wave of minimalism as a reaction against AI interface theatrics — animated assistant orbs, streaming shimmer, constant progress narration — arguing for silent execution and summarised results instead. Treat this as a live trend narrative rather than a settled standard; it is well-attested in trade publications but not yet in platform specs.

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui. Styles named without a link have no file in this set. Note that flat design, flat 2.0, semi-flat and Swiss / International Typographic style are aliases of *this* doc, not separate entries.

**Combinations that work:**

- **Minimalism + [Glassmorphism](./03-glassmorphism.md) — "minimal shell, glass overlay."** Keep the entire base layer flat and opaque; apply `backdrop-filter` only to floating layers (command palette, sheet, notification). You get depth exactly where the z-order needs explaining and you pay the GPU cost on 5% of pixels. This is essentially what Apple did with Liquid Glass over otherwise clean content.
- **Minimalism + Google Material Design (no doc in this set) — "flat 2.0."** Minimal palette and typography, Material's elevation tokens used purely as signifiers. This is the historically validated correction to iOS-7-era flatness that NN/g recommended in 2017 and it is still the safest default for consumer products. Flat 2.0 is an alias of this doc, so the tokens in §4 already express it: use `--min-shadow-1` as the only elevation and keep `--min-border-strong` as the boundary.
- **Minimalism + [Bento grid](./09-bento-grid.md).** A natural fit: the bento layout supplies visual interest through composition and rhythm rather than through decoration, which is exactly the escape hatch a monochrome system needs for marketing pages.
- **Minimalism + [Brutalism](./07-brutalism.md) — "Swiss brutalism."** Set radius to `0`, borders to `1px solid #000` at 21:1, drop shadows entirely, and use one loud accent. Works extremely well for editorial, portfolios, and dev-tool marketing; it is the most defensible way to make a minimal system distinctive.
- **Minimalism + [Spatial UI](./10-spatial-ui.md), used sparingly.** Depth as the *only* ornament is very much in this style's spirit: no colour, no texture, just a two- or three-rung z-ladder that explains layering. Keep the whole ladder inside `--min-shadow-0/1/2` semantics and refuse perspective transforms on content.
- **Minimalism + aurora / mesh gradient (no doc in this set), tightly bounded.** One soft mesh gradient in the hero, monochrome everywhere below the fold. Keeps the personality budget spent in a single place.
- **Minimalism + dark mode.** Nearly free, because there is no material to re-simulate — only tokens to swap. Contrast with [Neumorphism](./02-neumorphism.md), whose dual light/shadow model has to be rebuilt from scratch per theme.

**Combinations that clash:**

- **Minimalism + [Neumorphism](./02-neumorphism.md).** Direct contradiction. Neumorphism's soft extruded surfaces need low-contrast, same-hue light and shadow, which is the exact pattern minimalism's contrast discipline forbids. Layering them yields the worst of both: illegible controls that also look dated.
- **Minimalism + [Skeuomorphism](./01-skeuomorphism.md).** Mutually exclusive by definition — one adds simulated material, the other removes it. The only viable version is a single skeuomorphic anchor object (a rendered device, a texture in one hero image) in an otherwise flat system.
- **Minimalism + [Claymorphism](./04-claymorphism.md).** Clay's large radii, chunky dual shadows, and pastel palette overwhelm a one-accent monochrome system. Pick one.
- **Minimalism + [Maximalism](./06-maximalism.md).** The set's cleanest opposition: one style's thesis is subtraction, the other's is accumulation. They cannot share a page at equal weight, only alternate by zone — and if you are alternating by zone you have two design systems and should say so out loud in the spec.
- **Minimalism + retro / Y2K (no doc in this set).** Y2K's chrome, noise, and colour saturation actively fight subtraction. There is no stable midpoint; attempts read as unresolved rather than eclectic.
- **Minimalism + heavy glassmorphism everywhere.** Full-page blur destroys the performance advantage that is one of minimalism's main reasons to exist, and it breaks the 1.4.3 contrast guarantees the moment content scrolls under a translucent surface.

## 13. Plugin Spec (draft)

**Skill name:** `minimalism-ui`

**Description:** "Use when the user wants to simplify, quiet down, or de-clutter an interface — asks for a minimal, clean, Swiss, Linear-like, Vercel-like, or 'less is more' look, wants to strip shadows/gradients/borders, wants a monochrome palette with a single accent, wants a 4/8pt spacing system or a modular type scale, or complains that a UI feels busy, noisy, or over-designed."

**What the skill does — concrete transformations applied to the user's code:**

1. **Palette collapse.** Inventories every colour literal in the codebase, clusters them, and rewrites them to a generated neutral ramp (9 steps) plus exactly one accent and one danger hue. Emits a mapping report of every replacement made.
2. **Shadow reduction.** Replaces every `box-shadow` with one of three tokens (`--min-shadow-0`, `--min-shadow-1`, `--min-shadow-2`) based on the element's z-role, and converts card elevation to `1px` hairline borders where the element is not an overlay.
3. **Radius normalisation.** Snaps all `border-radius` values to `{4, 8, 12, 9999}px` based on component size.
4. **Spacing quantisation.** Rounds every `padding`, `margin`, and `gap` to the nearest value on the 4px ramp `{4,8,12,16,24,32,48,64,96}`, and enforces the 4:1 within-group / between-group ratio inside detected form and list structures.
5. **Type-scale enforcement.** Reduces the font-size inventory to the nine-step 1.200 scale, caps weight usage at 400/500/600, applies `-0.011em` tracking above 24px and `-0.02em` above 36px, and adds `max-width: 65ch` to prose containers.
6. **Decoration removal.** Strips `backdrop-filter`, multi-stop gradients, `filter: blur/drop-shadow`, `text-shadow`, and `mix-blend-mode` from non-overlay elements. Sets `--min-backdrop-blur: 0px` as an explicit contract.
7. **Affordance restoration** (the compensating pass, run always): converts ghost primary buttons to filled, raises any control border below 3:1 to `#8F8F8F`-equivalent, adds hover underlines to text links, adds `:focus-visible` rings where missing, and pads icon-only targets up to `--min-target-min` (24×24 CSS px), sizing from the token rather than emitting a literal.
8. **Motion normalisation.** Rewrites transition durations into `{100,150,200,300}ms`, replaces spring/overshoot easings with `cubic-bezier(0.2,0,0,1)` / `cubic-bezier(0.4,0,1,1)`, and injects a `prefers-reduced-motion` block.
9. **Dark-mode generation.** Emits the paired dark token set with `:root` defaults, a `prefers-color-scheme` block guarded by `:root:not([data-theme="light"])`, and a `[data-theme="dark"]` override.

**Inputs it needs from the user:**

| Input | Type | Default | Notes |
|---|---|---|---|
| `framework` | `vanilla-css` \| `tailwind-v4` \| `react-css-modules` \| `styled-components` \| `swiftui` | detected from repo | Determines output format |
| `basePalette` | hex accent, optional neutral tint (`warm` \| `cool` \| `pure`) | `#2563EB`, `pure` | Only one accent is accepted; a second is rejected |
| `density` | `comfortable` \| `default` \| `compact` | `default` | Maps to control heights 44/40/32px and spacing multiplier 1.25/1.0/0.75 |
| `intensity` | 0–100 | 60 | Drives the knobs below |
| `darkMode` | `none` \| `media` \| `class` \| `both` | `both` | |
| `a11yTarget` | `AA` \| `AA+focus-AAA` \| `AAA` | `AA+focus-AAA` | Sets the contrast floors the validator enforces |

**Outputs it produces:**

1. `tokens/minimalism.css` — the full `:root` custom-property block plus both dark-mode overrides.
2. `tokens/minimalism.theme.css` — a Tailwind v4 `@theme` block (when `framework = tailwind-v4`), including `--color-*: initial` and `--shadow-*: initial` resets.
3. `components/` — `Stack`, `Button`, `Card`, `Input`, `ListRow` in the target framework, props-driven, no runtime dependencies.
4. `styles/minimalism.layer.css` — a `@layer minimalism { ... }` sheet so the style can be adopted without specificity wars and removed in one deletion.
5. `reports/minimalism-audit.md` — before/after contrast table for every colour pair, a list of every value quantised (with the original), every ghost button converted, every target resized, and remaining manual TODOs.
6. `reports/minimalism-diff-summary.md` — human-readable inventory: colours removed (count), shadows removed (count), font sizes collapsed from N to 9, spacing values collapsed from N to 9.

**Validation checklist the skill must self-run before reporting success:**

- [ ] Compute contrast for every generated foreground/background pair; fail the run if any body-text pair is < 4.5:1 or any control boundary is < 3:1.
- [ ] Assert the emitted palette contains ≤ 2 chromatic hues and ≤ 11 neutral steps.
- [ ] Assert zero `backdrop-filter` and zero `filter: blur()` declarations outside an explicitly allow-listed overlay selector list.
- [ ] Assert every `transition-duration` and `animation-duration` is ≤ 300ms, and that a `prefers-reduced-motion: reduce` block exists and covers every animated selector.
- [ ] Assert a `:focus-visible` rule exists whose specificity covers all of `a, button, input, select, textarea, summary, [tabindex]`, and that no `outline: none` survives without a sibling replacement in the same rule.
- [ ] Assert every generated interactive element declares `min-height ≥ 24px` and, for icon-only variants, `min-width ≥ 24px`.
- [ ] Assert a `@media (forced-colors: active)` block exists giving every control a `ButtonBorder` boundary.
- [ ] Assert the dark-mode token set defines every token defined in light mode (no orphans) and that both the media-query and attribute overrides are present.
- [ ] Assert no font-size is declared in `px` for body copy (must be `rem`) and no prose container has a `px` `max-width`.
- [ ] Report the total CSS delta in compressed bytes and fail if it exceeds 40 KB.

**Intensity knobs (3–5), with ranges:**

| Knob | Range | At intensity 0 | At intensity 100 |
|---|---|---|---|
| `chromaBudget` — max OKLCH chroma allowed on non-accent surfaces, and share of pixels the accent may occupy | `0.00–0.06` chroma; accent coverage `1%–15%` | Neutrals may carry a tint; accent used freely | Strict achromatic neutrals; accent limited to primary action + focus ring |
| `decorationBudget` — number of permitted elevation/decoration layers | `0–3` shadow steps, shadow opacity `0.00–0.12` | Three shadow steps, gradients allowed on heroes | Zero shadows, borders only, no gradients anywhere |
| `whitespaceMultiplier` — scalar on the between-group spacing ramp | `0.75–2.0` | Dense, 12–24px section rhythm | Airy, 96–192px section rhythm |
| `typeContrast` — ratio of the modular scale and permitted weight span | ratio `1.125–1.414`; weights `{400,500,600,700}` → `{400,500}` | High display contrast, bold weights available | Small ratio, two weights, hierarchy carried by size and space alone |
| `affordanceFloor` — how much signifier is retained regardless of the above | `0–100` (never below 40 in shipped output) | Minimum legal signifiers | Filled buttons, 3:1 borders everywhere, underlined links, 44px targets |

`affordanceFloor` is deliberately inverted relative to the others: raising overall `intensity` must *raise* it, not lower it. Aggressive minimalism increases the risk of lost affordance, so the skill compensates rather than compounds.

**Anti-patterns the skill must refuse to generate:**

- Body text below 4.5:1 or large text below 3:1 on any surface it can render against — refuse and substitute the nearest passing value, logging the substitution.
- A ghost/outline-only button as the **primary** action on any screen.
- `outline: none` on any focusable element without a replacement indicator in the same rule.
- Interactive targets smaller than `--min-target-min` (24×24 CSS px), or icon-only buttons without an `aria-label`.
- Colour as the sole carrier of state, error, selection, or category.
- Placeholder text used as the only field label.
- Removal of a visible label, help text, error message, required-field marker, or `<legend>` in the name of "cleanliness" — the skill may restyle these, never delete them.
- More than two chromatic hues in the generated palette.
- `backdrop-filter` on base-layer surfaces (that is [glassmorphism](./03-glassmorphism.md); hand off rather than blend).
- Infinite looping animations that do not represent an in-progress operation, and any animation that survives `prefers-reduced-motion: reduce`.
- Fixed-`px` heights on text-bearing containers (breaks SC 1.4.12) or `overflow: hidden` on label text.
- Icon fonts, or replacing text labels with unlabelled icons to save space.

## 14. References

1. The Roots of Minimalism in Web Design — https://www.nngroup.com/articles/roots-minimalism-web-design/ — Nielsen Norman Group, Kate Moran — 28 June 2015 — [primary]
2. Flat-Design Best Practices — https://www.nngroup.com/articles/flat-design-best-practices/ — Nielsen Norman Group, Kate Moran — 12 March 2017 — [primary]
3. Aesthetic and Minimalist Design (Usability Heuristic #8) — https://www.nngroup.com/articles/aesthetic-minimalist-design/ — Nielsen Norman Group, Therese Fessenden — 24 January 2021 — [primary]
4. Dieter Rams: ten principles for good design — https://www.vitsoe.com/us/about/good-design — Vitsœ — principles articulated in the late 1970s; page current — [primary]
5. Web Content Accessibility Guidelines (WCAG) 2.2 — https://www.w3.org/TR/WCAG22/ — W3C — W3C Recommendation, current revision 12 December 2024 — [primary]
6. Theme variables (`@theme` directive) — https://tailwindcss.com/docs/theme — Tailwind Labs — Tailwind CSS v4 documentation, accessed 8 August 2026 — [primary]
7. Changelog — https://ui.shadcn.com/docs/changelog — shadcn/ui — accessed 8 August 2026 — [primary] (shadcn/ui publishes one dated changelog page, not per-entry sub-paths; quote the July 2026 "Base UI is now the default" entry and the January 2026 Base UI documentation entry from it. Earlier drafts of this doc cited `/docs/changelog/2026-07-base-ui-default` and `/docs/changelog/2026-01-base-ui`, which are not real URLs.)
8. Base UI — https://base-ui.com/ — Base UI (MUI + Radix maintainers) — accessed 8 August 2026 — [primary] (version history for the "1.6.0 current stable" claim in §2; verify the version at the time you read this rather than trusting the number here)
9. Geist Font — https://vercel.com/font — Vercel — typeface released October 2023 with Basement Studio; page accessed 8 August 2026 — [primary]
10. The Birth of Geist: A Typeface Crafted for the Web — https://basement.studio/post/the-birth-of-geist-a-typeface-crafted-for-the-web — Basement Studio — 2023 — [primary]
11. Material 3 Expressive deep dive: features, rollout timeline, supported devices — https://www.androidauthority.com/google-material-3-expressive-features-changes-availability-supported-devices-3556392/ — Android Authority — May 2025 — [secondary]
12. Google gives Android a vibrant, colorful new look with Material 3 Expressive — https://siliconangle.com/2025/05/13/google-gives-android-vibrant-colorful-new-look-material-3-expressive/ — SiliconANGLE — 13 May 2025 — [secondary]
13. Adopting Liquid Glass — https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass — Apple Developer Documentation — accessed 8 August 2026 — [primary] (Apple's own material documentation, used in place of the third-party `glassui.dev` write-up an earlier draft cited. [./08-liquid-glass.md](./08-liquid-glass.md) carries the full sourcing for this material, including the 26.1 Tinted toggle and the iOS 27 slider.)
14. Stop holding out hope, Liquid Glass will be mandatory in iOS 27 — https://appleinsider.com/articles/26/03/26/stop-holding-out-hope-liquid-glass-will-be-mandatory-in-ios-27 — AppleInsider — 26 March 2026 — [secondary]
15. Calm Interfaces 2026: The Anti-Theatric Movement in AI-Native Design — https://lucky.graphics/learn/calm-interface-audit-2026-efficiency/ — Lucky Graphics — 25 April 2026 — **[secondary, unverified trade narrative]** (a small independent design blog, not a named trade publication or platform vendor. Together with reference 22 it is the only sourcing for the "calm interface" movement described in §2 and §11. No figure from it is quoted as a measurement anywhere in this doc, and both places that mention the movement label it a live trend narrative rather than a settled standard. Do not upgrade it without a better source.)
16. Optimal Line Length for Readability: The 50–75 Character Rule Explained — https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/ — UXPin — 2026 — [secondary]
17. Readability: The Optimal Line Length — https://baymard.com/blog/line-length-readability — Baymard Institute — [secondary]
18. Ghost Buttons: UX Disaster or Effective Design? — https://cxl.com/blog/ghost-buttons/ — CXL — [secondary]
19. Ghost buttons in design: pros and cons for your website — https://webflow.com/blog/ghost-buttons — Webflow — [secondary]
20. Spacing, grids, and layouts — https://www.designsystems.com/space-grids-and-layouts/ — DesignSystems.com (Figma) — [secondary]
21. Comparing Conversational AI Tool User Interfaces 2025 — https://intuitionlabs.ai/articles/conversational-ai-ui-comparison-2025 — IntuitionLabs — 2025 — [secondary]
22. UX/UI design trends for 2026: calm interfaces, transparent AI and the end of visual theatrics — https://elements.envato.com/learn/ux-ui-design-trends — Envato Elements — 2026 — [secondary]
23. iOS 7 — https://en.wikipedia.org/wiki/IOS_7 — Wikipedia — release date 18 September 2013 — [secondary]
24. Windows Phone 7 — https://en.wikipedia.org/wiki/Windows_Phone_7 — Wikipedia — worldwide release 21 October 2010 — [secondary]
