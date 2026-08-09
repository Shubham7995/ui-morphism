---
name: neumorphism
title: Neumorphism
aliases:
  - Neomorphism
  - Neuomorphism
  - Soft UI
  - SoftUI
  - New Skeuomorphism
  - Neo-skeuomorphism
  - Neumorphic design
  - Neumorphism 2.0
  - Clean Neumorphism
  - Extruded UI
  - Embossed UI
category: ui-morphism
origin_year: 2019
peak_years: 2019-12 to 2021-06
status_2026: accent-only
difficulty: medium
a11y_risk: high
perf_cost: medium
plugin_slug: neumorphism-ui
last_researched: 2026-08-08
---

> **Spelling note.** **Neumorphism** is the canonical spelling. It is a contraction of *new skeuomorphism*: Jason Kelley proposed "new skeuomorphism" in the comments of Michał Malewicz's 2019 article, Malewicz compressed it to "Neuomorphism", and the "o" was dropped to give **Neumorphism**. **Neomorphism** is a very common misspelling (people back-form it from "neo-"), and **Soft UI** is the vendor-neutral marketing name that generator tools and component kits use. All of these refer to the same thing and this document is the reference for all of them.

---

## 1. Essence

Neumorphism renders a control as a shape *extruded from* or *pressed into* the page rather than floating above it: the element's fill is the exact same colour as its parent background, and the only thing that describes its geometry is a pair of opposing box-shadows — a light one toward the light source and a dark one away from it. The result reads as soft moulded plastic or vacuum-formed silicone; the emotional register is calm, quiet, expensive, slightly clinical. The single defining move is the **dual shadow on a same-hue surface**: `box-shadow: Dpx Dpx Bpx <darker>, -Dpx -Dpx Bpx <lighter>` where `B = 2 × D` and the two colours are the surface colour shifted symmetrically in luminance. Everything else — the large radii, the pastel greys, the absent borders — is downstream of that one decision.

---

## 2. Origin & Timeline

- **August 2019** — Huawei ships the Honor Vision smart TV running HarmonyOS 1.0 with proto-neumorphic tiles: same-hue cards separated from the background only by soft paired shadows. This predates the Dribbble moment and is the earliest shipped, mass-market instance the record supports. *(Contradicts the common story that neumorphism started on Dribbble — the Dribbble shot popularised it, it did not invent it.)*
- **2 December 2019** — Michał Malewicz (Creative Director, Hype4 / hype4.academy) publishes **"Neumorphism in user interfaces"** on UX Collective. In the comments **Jason Kelley** suggests the label *new skeuomorphism*; Malewicz contracts it to *Neuomorphism* and it settles as **Neumorphism**. This is the naming event.
- **December 2019** — **Alexander Plyuto** posts *Skeuomorph Mobile Banking* to Dribbble. It goes viral (3,000+ likes) and becomes the canonical reference image. Within weeks Dribbble and Behance are saturated with same-hue extruded mockups.
- **Late December 2019** — Malewicz publishes **"Neumorphism will NOT be a huge trend in 2020"** on UX Collective, arguing the style cannot survive contact with real product constraints. The person who named it was its first serious critic, within a month.
- **20 March 2020** — Adrian Bece publishes **"Neumorphism and CSS"** on CSS-Tricks: the definitive implementation reference. It establishes the four light-source permutations, the flat / concave / convex / pressed taxonomy, and states plainly that soft shadows do not count toward WCAG contrast and that the style "shouldn't be applied to elements that can have various states, like inputs, select elements, progress bars."
- **9 April 2020** — Hampus Sethfors publishes **"Neumorphism — the accessible and inclusive way"** on Axess Lab. It runs neumorphic mockups through a low-vision simulator, shows the controls vanish entirely, and pins the failure to **WCAG 2.1 SC 1.4.11 Non-text Contrast (3:1)** and **SC 1.4.3 Contrast (Minimum) (4.5:1)**. This is the article that fixed "neumorphism is inaccessible" as the community consensus.
- **April 2020** — Malewicz publishes **"Loading: Neumorphism 2"** on UX Collective, partially walking back the total rejection and proposing a restrained, component-scoped version.
- **2020** — **neumorphism.io**, the CSS generator by **Adam Giebl** (React, BSD-3-Clause), becomes the de-facto spec. Its default output — `background: #e0e0e0; box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;` — is the single most-copied neumorphic snippet in existence. The repo is at 6,135 stars as of August 2026.
- **10 June 2020** — `tailwindcss-neumorphism` v0.1.0 published to npm. It is never updated again; the repo's last push is 13 February 2024.
- **12 November 2020** — Apple ships **macOS Big Sur (11.0)**. Its icon plinths, sidebar treatments and control chrome are widely read as neumorphic-adjacent. This is the high-water mark of first-party legitimacy, and neumorphism is recognised at the **iF Design Award 2020**.
- **21 February 2021** — `ui-neumorphism` v1.1.3 (AKAspanion, MIT, 653 stars) — the most complete React neumorphic component library, 50+ components — publishes its final npm release. The GitHub repo's last push is 17 July 2024. Nothing has replaced it.
- **2021** — HarmonyOS 2's interface takes a Red Dot Design Award. In the same year adoption starts falling off a cliff: glassmorphism (Big Sur's *other* material, plus Windows 11 Mica/Acrylic) absorbs the demand for "depth without skeuomorphism," and it does so with better contrast behaviour.
- **2022–2023** — Dormant as a system. Survives as a stock effect in CSS playgrounds and generator sites. Malewicz's own 2021 retrospective conclusion: neumorphism never achieved lasting mainstream adoption, but it *did* revive interest in inner shadows and partial skeuomorphic depth, which fed forward into later high-fidelity directions.
- **9 June 2025 (WWDC)** — Apple announces **Liquid Glass** across all six platforms — iOS 26 / iPadOS 26 / macOS Tahoe 26 / watchOS 26 / tvOS 26 / visionOS 26: translucent, specular, refractive. This is the largest platform-level endorsement of *material depth* since iOS 7 killed skeuomorphism — and it is explicitly glass, not extruded plastic. Any 2026 revival argument for neumorphism has to survive the fact that the biggest vendor picked the neighbouring style instead.
- **9 December 2025** — Big Human's "What Is Neumorphism in UI Design? A Complete 2026 Guide" states the position bluntly: "Neumorphism had a moment… what rose quickly fell just as fast," and notes Apple's move to glassmorphism.
- **2 March 2026** — The Interaction Design Foundation topic page (last updated 2 March 2026, re-dated 8 August 2026) still classifies it as a stylistic experiment whose survival depends on solving contrast, and recommends it only for design-forward and selectively-scoped work.
- **3 August 2026** — `tailwindcss-neumorphism-ui` (junwen-k, MIT) receives a commit. It is one of the very few neumorphic tooling repos with 2026 activity, and it has 15 stars. That number is a fair proxy for the size of the current ecosystem.
- **2026 state, plainly stated** — Neumorphism is **not dead, and it is not a system**. It is dead as a whole-interface language: no major design system, OS, or top-1000 web property ships a fully neumorphic UI. It is alive as an **accent treatment** — one component class at a time (toggles, sliders, media transport, numeric keypads, thermostat dials) inside an otherwise flat or glass interface. The active 2026 niches are consistently reported as smart-home and appliance controls, wellness/meditation apps, health and sleep trackers, single-purpose utilities (calculator, clock, music player), fintech dashboards wanting a "premium hardware" register, and portfolio/awards work. The 2026 vocabulary for the restrained version is **"Clean Neumorphism"** or **"New Neumorphism"**: neumorphic shadow on the surface, but a real 3:1 hairline border and a real accent colour carrying the state. That hybrid is the only version that ships.

---

## 3. Visual DNA

1. **Same-hue surface** — the element's `background` is identical (or within ΔL ≈ 0.02 in OKLCH) to the parent's. If the card is a different colour from the page, it is not neumorphism, it is a card with a soft shadow. This is the non-negotiable rule.
2. **Opposed dual shadow** — exactly two shadow layers, equal blur, mirrored offsets: `+D +D` in the dark colour, `−D −D` in the light colour. One shadow is the cast shadow, the other is the rim highlight.
3. **Blur = 2 × distance** — the generator's own handler enforces `blur = distance × 2` and `distance = size × 0.1`. Ratios far from 2:1 read as either a hard drop-shadow (blur < 1.5×) or fog (blur > 4×).
4. **Symmetric luminance shift** — the two shadow colours are the surface colour shifted by ±15% multiplicative luminance in the original algorithm (`colorDifference = 0.15`, applied as `channel + channel × ±0.15`). From `#e0e0e0` that yields `#ffffff` (clipped) and `#bebebe`.
5. **Mid-tone base, never white or black** — the base must have headroom in both directions. `#e0e0e0`, `#e6e7ee`, `#ebecf0`, `#f0f0f3` in light; `#2a2e39`, `#2c2f36`, `#31343c` in dark. On pure `#ffffff` the highlight has nowhere to go and the effect collapses to a one-sided drop shadow.
6. **Large radii** — the generator defaults to 50px radius on a 300px box, i.e. **r ≈ size / 6**, and offers a snap to `50%` (pill/circle). Radii under 12px make the shadow pair look like a printing error.
7. **No borders** — classic neumorphism has zero visible stroke. This is precisely the trait that makes it fail SC 1.4.11, and precisely the trait the 2026 "clean" variant abandons.
8. **Four canonical shape states** — *flat* (solid fill, outer shadow), *concave* (linear-gradient 145deg from −10% to +7% luminance, outer shadow), *convex* (gradient from +7% to −10%, outer shadow), *pressed* (`inset` on both shadows, no gradient). These are shape indices 0/2/3/1 in neumorphism.io.
9. **Consistent global light source** — one of four diagonals (top-left is the default, gradient angle 145°). Every extruded element on the page must agree. Mixed light sources are the most common amateur tell.
10. **Desaturated, near-neutral palette** — chroma is typically below 0.03 in OKLCH. Saturated neumorphism turns muddy because the ±15% shift on a saturated channel shifts hue, not just lightness.
11. **Colour used only for accents** — the one saturated element per screen (the active toggle track, the progress arc, the focus ring) is what actually carries the state. In a correct neumorphic system the shadows are decoration and the accent is information.
12. **Generous padding** — because the shadow needs room, neumorphic components run 1.5–2× the padding of a flat equivalent, and adjacent elements need a gap of at least `2 × distance + blur/2` or their shadows collide into visual mud.

---

## 4. Anatomy & Design Tokens

### Canonical token table

All contrast ratios below are computed with the WCAG 2.x relative-luminance formula against the surface colour of the same mode. Every token named here is the **exact custom property emitted by the CSS blocks in this section**, and the table is the complete inventory of them: all 58 declared `--nm-` properties appear below, and nothing appears below that is not declared. Quantities the style applies by hand rather than through a property are listed as prose after the table, with the reason each one cannot be a custom property.

| Token group | Token | Light value | Dark value | Notes / contrast |
|---|---|---|---|---|
| Surface | `--nm-surface` | `#e6e7ee` | `#2a2e39` | Page background. Must be identical for element and parent. L\* ≈ 91 / ≈ 19. |
| Surface | `--nm-surface-sunken` | `#dfe0e8` | `#24272f` | Large wells only, never controls — a sunken control loses the same-hue illusion. |
| Shadow colour | `--nm-shadow-light` | `#ffffff` | `#3d4353` | Highlight. **1.23:1** vs light surface; **1.37:1** vs dark surface. Never sufficient alone. |
| Shadow colour | `--nm-shadow-dark` | `#b8b9be` | `#17191f` | **1.59:1** vs light surface; **1.30:1** vs dark surface. Never sufficient alone. |
| Ink | `--nm-hairline` | `#7c7f93` | `#767d92` | Hairline / affordance border. **3.20:1** / **3.31:1** — this is what actually satisfies SC 1.4.11. |
| Ink | `--nm-text` | `#33364d` | `#e8eaf2` | Body text. **9.59:1** / **11.29:1** (AAA). |
| Ink | `--nm-text-mut` | `#5a5e77` | `#a7adc2` | Muted text. **5.16:1** / **6.07:1** (AA normal text). |
| Ink | `--nm-accent` | `#4c5bd4` | `#8f9dff` | Accent / active state. **4.54:1** / **5.45:1** — passes 4.5:1 text and 3:1 non-text. |
| Ink | `--nm-accent-ink` | `#ffffff` | `#141722` | Text and icons drawn on an accent fill. |
| Ink | `--nm-danger` | `#b3261e` | `#ff9a92` | Reserve for destructive; verify per surface. |
| Geometry | `--nm-d-xs` / `--nm-b-xs` | `3px` / `6px` | same | Shadow distance and blur, xs. For 24–32px controls. |
| Geometry | `--nm-d-sm` / `--nm-b-sm` | `5px` / `10px` | same | Default for buttons, chips, inputs. |
| Geometry | `--nm-d-md` / `--nm-b-md` | `8px` / `16px` | same | Cards, panels. |
| Geometry | `--nm-d-lg` / `--nm-b-lg` | `14px` / `28px` | same | Hero / feature surfaces. |
| Geometry | `--nm-d-xl` / `--nm-b-xl` | `20px` / `40px` | same | neumorphism.io initial value; page-scale slabs only. Blur is `2 × distance` at every rung: the generator's initial state is 20/60 (3:1) but its own slider handler enforces 2:1 — use 2:1. |
| Radius | `--nm-r-ctl` | `14px` | same | Buttons, inputs, chips. |
| Radius | `--nm-r-card` | `24px` | same | Cards, panels. |
| Radius | `--nm-r-slab` | `36px` | same | Page-scale slabs. Generator default is size / 6. |
| Radius | `--nm-r-pill` | `999px` | same | Pills, toggles, avatars. |
| Composed shadow | `--nm-raised-sm` | `--nm-d-sm` offsets at `--nm-b-sm`, dark then light | same | Extruded button/chip/input. Built entirely from the geometry and shadow-colour tokens, so retheming those retheme this. |
| Composed shadow | `--nm-raised-md` | `--nm-d-md` offsets at `--nm-b-md` | same | Extruded card or panel. |
| Composed shadow | `--nm-raised-lg` | `--nm-d-lg` offsets at `--nm-b-lg` | same | Extruded hero surface. |
| Composed shadow | `--nm-pressed-sm` | `inset 3px 3px 6px` dark, `inset -3px -3px 6px` light | same | Pressed counterpart of `--nm-raised-sm`. Literal offsets, not `var()`: see the inset-ratio note below. |
| Composed shadow | `--nm-pressed-md` | `inset 5px 5px 10px` dark, `inset -5px -5px 10px` light | same | Pressed counterpart of `--nm-raised-md`. |
| Composed shadow | `--nm-flat` | `0 0 0 0 transparent` | same | The named zero rung. Animate to and from this rather than to `none`, which is not interpolable. |
| Gradient | `--nm-convex` | `linear-gradient(145deg, #f6f7ff, #cfd0d6)` | `linear-gradient(145deg, #333845, #22252e)` | Bulging surface. `145deg` matches light source 1 (top-left). |
| Gradient | `--nm-concave` | `linear-gradient(145deg, #cfd0d6, #f6f7ff)` | `linear-gradient(145deg, #22252e, #333845)` | Dished surface — the same stops reversed. |
| Motion | `--nm-t-press` | `120ms` | same | Press. |
| Motion | `--nm-t-hover` | `180ms` | same | Hover. |
| Motion | `--nm-t-morph` | `240ms` | same | Theme / shape morph. |
| Motion | `--nm-e-in` | `cubic-bezier(0.4, 0, 1, 1)` | same | Press in. Fast start, hard stop: feels like a real switch. |
| Motion | `--nm-e-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | same | Release. Slight overshoot-free settle. |
| Target | `--nm-target-min` | `44px` | same | Deliberately above SC 2.5.8's 24px floor. §7 measures every same-hue boundary at 1.2–1.7:1, so the edge of a neumorphic control is not visible: a 24px target whose edge cannot be seen is effectively smaller than 24px. The blurred halo reads as part of the control but is not clickable, which biases pointing outward. When targets collide, widen the sibling gap described below — never shrink the target. |
| Type | `--nm-font` | `"Inter", "SF Pro Text", system-ui, -apple-system, "Segoe UI", sans-serif` | same | One family for the whole style. |
| Type | `--nm-fs-100` `--nm-fs-200` `--nm-fs-300` `--nm-fs-400` `--nm-fs-500` `--nm-fs-600` `--nm-fs-700` | `12 / 14 / 16 / 20 / 24 / 32 / 44 px` (`0.75 / 0.875 / 1 / 1.25 / 1.5 / 2 / 2.75 rem`) | same | The complete type scale — seven steps, no others. 1.25 ratio, 16px base at `--nm-fs-300`. |
| Spacing | `--nm-sp-1` `--nm-sp-2` `--nm-sp-3` `--nm-sp-4` `--nm-sp-5` `--nm-sp-6` `--nm-sp-7` `--nm-sp-8` | `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px` | same | The complete spacing ramp — eight steps, no others. 4px base unit. |
| Derivation | `--nm-base-l` | `0.918` | retune per mode | OKLCH lightness of the base surface, in the perceptual derivation block below. |
| Derivation | `--nm-base-c` | `0.012` | retune per mode | OKLCH chroma of the base surface. |
| Derivation | `--nm-base-h` | `274deg` | retune per mode | OKLCH hue of the base surface. |
| Derivation | `--nm-delta` | `0.075` | retune per mode | Intensity knob, `0.03 .. 0.12`. Drives both derived shadow colours; the only dial a theme needs to turn. |

**Five quantities in this style are not custom properties, and deliberately so.**

- **Shadow spread is `0`.** It is not a token because it is not a variable: spread grows the shadow's own silhouette away from the element, which breaks the same-hue illusion at any non-zero value. Every composed shadow above therefore omits the spread component entirely rather than routing a zero through a property that someone could override.
- **The inset (pressed) ratio is `0.6 × outer distance`.** Pressed depth reads deeper than it measures, so the pressed rungs are scaled down from their raised counterparts — `--nm-pressed-sm` is 3px against `--nm-d-sm`'s 5px, `--nm-pressed-md` is 5px against `--nm-d-md`'s 8px. The ratio is applied by hand when authoring those two values; CSS cannot round a `calc()` to the whole pixels this effect needs, so a ratio property would have no consumer.
- **The gradient luminance delta is `+7% / −10%`.** Asymmetric on purpose — the darker stop is stronger, because a highlight against a light field reads weaker than an equal-magnitude shadow. It is the rule used to compute the literal stops inside `--nm-convex` and `--nm-concave`, not a value any declaration reads.
- **Surface chroma is capped at `≤ 0.03` OKLCH light, `≤ 0.035` dark.** This is a review constraint on whatever you put in `--nm-base-c`, not a property of its own: CSS has no way to clamp a chroma channel, and accents are exempt from the cap, so a single token could not express it.
- **Minimum gap between extruded siblings is `2 × distance + blur / 2`** — 16px at `sm`, 24px at `md`. It is a per-pair layout computation that depends on which rung each neighbour uses, so it resolves to a different number in different places and cannot be one value. Use the `--nm-sp-*` step that clears it.

Two further deliberate absences: **backdrop blur has no token at all**, because neumorphism has no translucency — if you are blurring a backdrop you are doing glassmorphism (§12). And **font weight (500 body / 600 label / 700 display) and line height (1.5 body / 1.2 display) are written as literals** in §5 rather than tokenised; under-500 weights disappear on a low-contrast field, so the floor is a rule to enforce in review, not a dial to expose.

### Ready-to-paste custom properties

```css
:root {
  color-scheme: light dark;

  /* ---- surface ---- */
  --nm-surface:        #e6e7ee;
  --nm-surface-sunken: #dfe0e8;   /* only for large wells, never for controls */
  --nm-shadow-dark:    #b8b9be;
  --nm-shadow-light:   #ffffff;

  /* ---- ink ---- */
  --nm-text:      #33364d;        /*  9.59:1 on surface  */
  --nm-text-mut:  #5a5e77;        /*  5.16:1 on surface  */
  --nm-hairline:  #7c7f93;        /*  3.20:1 on surface  */
  --nm-accent:    #4c5bd4;        /*  4.54:1 on surface  */
  --nm-accent-ink:#ffffff;
  --nm-danger:    #b3261e;

  /* ---- geometry ---- */
  --nm-d-xs: 3px;  --nm-b-xs: 6px;
  --nm-d-sm: 5px;  --nm-b-sm: 10px;
  --nm-d-md: 8px;  --nm-b-md: 16px;
  --nm-d-lg: 14px; --nm-b-lg: 28px;
  --nm-d-xl: 20px; --nm-b-xl: 40px;

  --nm-r-ctl:  14px;
  --nm-r-card: 24px;
  --nm-r-slab: 36px;
  --nm-r-pill: 999px;

  /* ---- composed shadows ---- */
  --nm-raised-sm:
     var(--nm-d-sm)  var(--nm-d-sm)  var(--nm-b-sm) var(--nm-shadow-dark),
    calc(var(--nm-d-sm) * -1) calc(var(--nm-d-sm) * -1) var(--nm-b-sm) var(--nm-shadow-light);
  --nm-raised-md:
     var(--nm-d-md)  var(--nm-d-md)  var(--nm-b-md) var(--nm-shadow-dark),
    calc(var(--nm-d-md) * -1) calc(var(--nm-d-md) * -1) var(--nm-b-md) var(--nm-shadow-light);
  --nm-raised-lg:
     var(--nm-d-lg)  var(--nm-d-lg)  var(--nm-b-lg) var(--nm-shadow-dark),
    calc(var(--nm-d-lg) * -1) calc(var(--nm-d-lg) * -1) var(--nm-b-lg) var(--nm-shadow-light);
  --nm-pressed-sm:
    inset 3px 3px 6px var(--nm-shadow-dark),
    inset -3px -3px 6px var(--nm-shadow-light);
  --nm-pressed-md:
    inset 5px 5px 10px var(--nm-shadow-dark),
    inset -5px -5px 10px var(--nm-shadow-light);
  --nm-flat: 0 0 0 0 transparent;

  /* ---- surface gradients ---- */
  --nm-convex:  linear-gradient(145deg, #f6f7ff, #cfd0d6);
  --nm-concave: linear-gradient(145deg, #cfd0d6, #f6f7ff);

  /* ---- motion ---- */
  --nm-t-press: 120ms;
  --nm-t-hover: 180ms;
  --nm-t-morph: 240ms;
  --nm-e-in:    cubic-bezier(0.4, 0, 1, 1);
  --nm-e-out:   cubic-bezier(0.16, 1, 0.3, 1);

  /* ---- hit targets ---- */
  --nm-target-min: 44px;   /* SC 2.5.8 floor is 24px; 44 because the boundary
                              is 1.2-1.7:1 and cannot be aimed at precisely */

  /* ---- type & space ---- */
  --nm-font: "Inter", "SF Pro Text", system-ui, -apple-system, "Segoe UI", sans-serif;
  --nm-fs-100: 0.75rem; --nm-fs-200: 0.875rem; --nm-fs-300: 1rem;
  --nm-fs-400: 1.25rem; --nm-fs-500: 1.5rem;  --nm-fs-600: 2rem; --nm-fs-700: 2.75rem;
  --nm-sp-1: 4px;  --nm-sp-2: 8px;  --nm-sp-3: 12px; --nm-sp-4: 16px;
  --nm-sp-5: 24px; --nm-sp-6: 32px; --nm-sp-7: 48px; --nm-sp-8: 64px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --nm-surface:        #2a2e39;
    --nm-surface-sunken: #24272f;
    --nm-shadow-dark:    #17191f;   /* 1.30:1 */
    --nm-shadow-light:   #3d4353;   /* 1.37:1 */

    --nm-text:      #e8eaf2;        /* 11.29:1 */
    --nm-text-mut:  #a7adc2;        /*  6.07:1 */
    --nm-hairline:  #767d92;        /*  3.31:1 */
    --nm-accent:    #8f9dff;        /*  5.45:1 */
    --nm-accent-ink:#141722;
    --nm-danger:    #ff9a92;

    --nm-convex:  linear-gradient(145deg, #333845, #22252e);
    --nm-concave: linear-gradient(145deg, #22252e, #333845);
  }
}

:root[data-theme="dark"] {
  --nm-surface:        #2a2e39;
  --nm-surface-sunken: #24272f;
  --nm-shadow-dark:    #17191f;
  --nm-shadow-light:   #3d4353;
  --nm-text:      #e8eaf2;
  --nm-text-mut:  #a7adc2;
  --nm-hairline:  #767d92;
  --nm-accent:    #8f9dff;
  --nm-accent-ink:#141722;
  --nm-danger:    #ff9a92;
  --nm-convex:  linear-gradient(145deg, #333845, #22252e);
  --nm-concave: linear-gradient(145deg, #22252e, #333845);
}

body {
  background: var(--nm-surface);
  color: var(--nm-text);
  font-family: var(--nm-font);
  font-size: var(--nm-fs-300);
  line-height: 1.5;
}
```

### Deriving the two shadow colours from a base

**The original algorithm (neumorphism.io, `colorLuminance(hex, lum)`).** Per channel, `c' = clamp(0, round(c + c × lum), 255)` with `lum = +0.15` for the highlight and `lum = −0.15` for the shadow. From `#e0e0e0` (224): highlight `224 × 1.15 = 257.6 → 255 = #ffffff`, shadow `224 × 0.85 = 190.4 → 190 = #bebebe`. That reproduces the famous default exactly.

**Its two failure modes, and the fix.** (a) The model is *multiplicative*, so on dark bases the delta collapses: `#2a2e39 × 0.15` moves red by only 6 levels. You must raise `lum` to roughly 0.40–0.50 in dark mode to get a comparable read. (b) It clips: any base above ≈ `#dedede` pushes the highlight to pure white and you silently lose the top half of the effect. Use a perceptual, additive derivation instead:

```css
:root {
  --nm-base-l: 0.918;              /* OKLCH lightness of #e6e7ee */
  --nm-base-c: 0.012;
  --nm-base-h: 274deg;
  --nm-delta:  0.075;              /* intensity knob, 0.03 .. 0.12 */

  --nm-surface:      oklch(var(--nm-base-l) var(--nm-base-c) var(--nm-base-h));
  --nm-shadow-light: oklch(calc(var(--nm-base-l) + var(--nm-delta) * 0.8) var(--nm-base-c) var(--nm-base-h));
  --nm-shadow-dark:  oklch(calc(var(--nm-base-l) - var(--nm-delta) * 1.4) var(--nm-base-c) var(--nm-base-h));
}
```

The `0.8 / 1.4` asymmetry compensates for the fact that a highlight against a light field reads weaker than an equal-magnitude shadow. In dark mode invert it to `1.4 / 0.8`. `oklch()` is supported in all current evergreen browsers; keep the hex block above as the `@supports not (color: oklch(0 0 0))` fallback if you support older engines.

---

## 5. Implementation Recipes

### Vanilla CSS

A complete, accessible neumorphic control set. Note that every interactive element carries a real `--nm-hairline` border at 3.2:1 — that is deliberate and it is the difference between shippable and portfolio-only.

```css
/* Assumes the :root block from section 4 is loaded. */

.nm-surface {
  background: var(--nm-surface);
  border-radius: var(--nm-r-card);
  box-shadow: var(--nm-raised-md);
  padding: var(--nm-sp-5);
}

/* ---------------- Button ---------------- */
.nm-btn {
  -webkit-appearance: none;
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nm-sp-2);
  min-height: 44px;
  min-width: 44px;
  padding: var(--nm-sp-3) var(--nm-sp-5);
  font: 600 var(--nm-fs-200) / 1.2 var(--nm-font);
  color: var(--nm-text);
  background: var(--nm-surface);
  border: 1px solid var(--nm-hairline);   /* SC 1.4.11 carrier */
  border-radius: var(--nm-r-ctl);
  box-shadow: var(--nm-raised-sm);
  cursor: pointer;
  transition:
    box-shadow var(--nm-t-hover) var(--nm-e-out),
    transform  var(--nm-t-press) var(--nm-e-out),
    border-color var(--nm-t-hover) linear;
}

.nm-btn:hover {
  box-shadow: var(--nm-raised-md);
  transform: translateY(-1px);
}

.nm-btn:active,
.nm-btn[aria-pressed="true"] {
  box-shadow: var(--nm-pressed-sm);
  transform: translateY(0);
  border-color: var(--nm-accent);
}

.nm-btn:focus-visible {
  outline: 3px solid var(--nm-accent);
  outline-offset: 3px;
}

.nm-btn:disabled {
  box-shadow: none;
  border-color: color-mix(in oklch, var(--nm-hairline) 55%, var(--nm-surface));
  color: var(--nm-text-mut);
  cursor: not-allowed;
}

.nm-btn--primary {
  background: var(--nm-accent);
  color: var(--nm-accent-ink);
  border-color: var(--nm-accent);
}

/* ---------------- Input (always pressed) ---------------- */
.nm-input {
  width: 100%;
  min-height: 44px;
  padding: var(--nm-sp-3) var(--nm-sp-4);
  font: 500 var(--nm-fs-300) / 1.4 var(--nm-font);
  color: var(--nm-text);
  background: var(--nm-surface);
  border: 1px solid var(--nm-hairline);
  border-radius: var(--nm-r-ctl);
  box-shadow: var(--nm-pressed-md);
  transition: border-color var(--nm-t-hover) linear;
}
.nm-input::placeholder { color: var(--nm-text-mut); }
.nm-input:focus-visible {
  outline: 3px solid var(--nm-accent);
  outline-offset: 2px;
  border-color: var(--nm-accent);
}
.nm-input[aria-invalid="true"] { border-color: var(--nm-danger); }

/* ---------------- Toggle ---------------- */
.nm-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 64px;
  height: 36px;
  padding: 4px;
  background: var(--nm-surface);
  border: 1px solid var(--nm-hairline);
  border-radius: var(--nm-r-pill);
  box-shadow: var(--nm-pressed-sm);
  cursor: pointer;
}
.nm-toggle__thumb {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--nm-convex);
  border: 1px solid var(--nm-hairline);
  box-shadow: var(--nm-raised-sm);
  transition: transform var(--nm-t-press) var(--nm-e-out),
              background var(--nm-t-press) linear;
}
.nm-toggle[aria-checked="true"] { border-color: var(--nm-accent); }
.nm-toggle[aria-checked="true"] .nm-toggle__thumb {
  transform: translateX(28px);
  background: var(--nm-accent);
  border-color: var(--nm-accent);
}
.nm-toggle:focus-visible { outline: 3px solid var(--nm-accent); outline-offset: 3px; }

/* ---------------- Shape variants ---------------- */
.nm-flat    { background: var(--nm-surface); box-shadow: var(--nm-raised-md); }
.nm-convex  { background: var(--nm-convex);  box-shadow: var(--nm-raised-md); }
.nm-concave { background: var(--nm-concave); box-shadow: var(--nm-raised-md); }
.nm-pressed { background: var(--nm-surface); box-shadow: var(--nm-pressed-md); }

/* ---------------- Loading ---------------- */
.nm-skeleton {
  background: var(--nm-surface);
  border-radius: var(--nm-r-ctl);
  box-shadow: var(--nm-pressed-sm);
  position: relative;
  overflow: hidden;
}
.nm-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    color-mix(in oklch, var(--nm-shadow-light) 70%, transparent) 50%,
    transparent 100%);
  transform: translateX(-100%);
  animation: nm-sheen 1400ms linear infinite;
}
@keyframes nm-sheen { to { transform: translateX(100%); } }

/* ---------------- Reduced motion ---------------- */
@media (prefers-reduced-motion: reduce) {
  .nm-btn, .nm-toggle__thumb, .nm-input {
    transition-duration: 1ms;
  }
  .nm-btn:hover { transform: none; }
  .nm-skeleton::after { animation: none; opacity: 0.35; transform: none; }
}

/* ---------------- Forced colors: box-shadow is dropped, restore structure --- */
@media (forced-colors: active) {
  .nm-surface,
  .nm-btn,
  .nm-input,
  .nm-toggle,
  .nm-toggle__thumb,
  .nm-flat, .nm-convex, .nm-concave, .nm-pressed {
    box-shadow: none;
    background: Canvas;
    border: 2px solid ButtonText;
    forced-color-adjust: none;
  }
  .nm-btn { color: ButtonText; }
  .nm-btn:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
  .nm-btn[aria-pressed="true"],
  .nm-toggle[aria-checked="true"] { border-color: Highlight; background: Highlight; color: HighlightText; }
  .nm-btn:disabled { color: GrayText; border-color: GrayText; }
}

/* ---------------- Low-end / low-power fallback ---------------- */
@media (update: slow), (max-width: 480px) and (prefers-reduced-transparency: reduce) {
  .nm-surface, .nm-flat, .nm-convex, .nm-concave {
    box-shadow: 0 2px 6px var(--nm-shadow-dark);
  }
}
```

### Tailwind CSS v4

Tailwind v4 configures tokens in CSS via `@theme`. Variables under the `--shadow-*` namespace automatically generate `shadow-<name>` utilities; `--inset-shadow-*` generates `inset-shadow-<name>`. **No plugin is required** — the two historical plugins (`tailwindcss-neumorphism` v0.1.0, last published 10 June 2020; `tailwindcss-neumorphism-ui`, 15 stars) both predate or barely address v4 and are unnecessary now.

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-nm-surface:   #e6e7ee;
  --color-nm-dark:      #b8b9be;
  --color-nm-light:     #ffffff;
  --color-nm-hairline:  #7c7f93;
  --color-nm-text:      #33364d;
  --color-nm-muted:     #5a5e77;
  --color-nm-accent:    #4c5bd4;

  --radius-nm-ctl:  14px;
  --radius-nm-card: 24px;
  --radius-nm-slab: 36px;

  --shadow-nm-sm:  5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  --shadow-nm-md:  8px 8px 16px #b8b9be, -8px -8px 16px #ffffff;
  --shadow-nm-lg:  14px 14px 28px #b8b9be, -14px -14px 28px #ffffff;
  --inset-shadow-nm-sm: inset 3px 3px 6px #b8b9be, inset -3px -3px 6px #ffffff;
  --inset-shadow-nm-md: inset 5px 5px 10px #b8b9be, inset -5px -5px 10px #ffffff;

  --ease-nm-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Dark mode: redefine the same variables inside the dark selector. */
@custom-variant dark (&:where(.dark, .dark *));

.dark {
  --color-nm-surface:  #2a2e39;
  --color-nm-dark:     #17191f;
  --color-nm-light:    #3d4353;
  --color-nm-hairline: #767d92;
  --color-nm-text:     #e8eaf2;
  --color-nm-muted:    #a7adc2;
  --color-nm-accent:   #8f9dff;

  --shadow-nm-sm:  5px 5px 10px #17191f, -5px -5px 10px #3d4353;
  --shadow-nm-md:  8px 8px 16px #17191f, -8px -8px 16px #3d4353;
  --shadow-nm-lg:  14px 14px 28px #17191f, -14px -14px 28px #3d4353;
  --inset-shadow-nm-sm: inset 3px 3px 6px #17191f, inset -3px -3px 6px #3d4353;
  --inset-shadow-nm-md: inset 5px 5px 10px #17191f, inset -5px -5px 10px #3d4353;
}

@layer components {
  .nm-btn {
    @apply inline-flex min-h-11 min-w-11 items-center justify-center gap-2
           rounded-nm-ctl border border-nm-hairline bg-nm-surface
           px-6 py-3 text-sm font-semibold text-nm-text
           shadow-nm-sm transition-shadow duration-150 ease-nm-out
           hover:shadow-nm-md
           active:inset-shadow-nm-sm active:shadow-none active:border-nm-accent
           focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-nm-accent
           disabled:shadow-none disabled:text-nm-muted disabled:cursor-not-allowed
           motion-reduce:transition-none
           forced-colors:border-2 forced-colors:border-[ButtonText] forced-colors:shadow-none;
  }
  .nm-card {
    @apply rounded-nm-card bg-nm-surface p-6 shadow-nm-md
           forced-colors:border-2 forced-colors:border-[ButtonText] forced-colors:shadow-none;
  }
  .nm-input {
    @apply min-h-11 w-full rounded-nm-ctl border border-nm-hairline bg-nm-surface
           px-4 py-3 text-base text-nm-text inset-shadow-nm-md
           placeholder:text-nm-muted
           focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nm-accent
           forced-colors:shadow-none;
  }
}
```

Inline arbitrary-value form, if you would rather not register tokens:

```html
<button class="rounded-[14px] bg-[#e6e7ee] border border-[#7c7f93] px-6 py-3
               shadow-[5px_5px_10px_#b8b9be,-5px_-5px_10px_#ffffff]
               active:shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff]">
  Press me
</button>
```

### React component

TypeScript, zero dependencies beyond React. It ships the CSS with it, computes the shadow pair from an intensity knob, and refuses to render an unlabelled icon-only control.

```tsx
import * as React from "react";

/* ---------- colour math (WCAG 2.x relative luminance + OKLCH-free shading) ---------- */

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** neumorphism.io's colorLuminance(), fixed to clamp before rounding. */
function shade(hex: string, lum: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({ r: r + r * lum, g: g + g * lum, b: b + b * lum });
}

function relLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/* ---------- shadow builder ---------- */

export type Elevation = "xs" | "sm" | "md" | "lg" | "xl";
export type Shape = "flat" | "convex" | "concave" | "pressed";
export type LightSource = "top-left" | "top-right" | "bottom-right" | "bottom-left";

const DISTANCE: Record<Elevation, number> = { xs: 3, sm: 5, md: 8, lg: 14, xl: 20 };

const SIGN: Record<LightSource, [number, number]> = {
  "top-left": [1, 1],
  "top-right": [-1, 1],
  "bottom-right": [-1, -1],
  "bottom-left": [1, -1],
};

const ANGLE: Record<LightSource, number> = {
  "top-left": 145,
  "top-right": 225,
  "bottom-right": 315,
  "bottom-left": 45,
};

export interface ShadowSpec {
  boxShadow: string;
  background: string;
  darkColor: string;
  lightColor: string;
}

/**
 * @param base       surface colour, must equal the parent background
 * @param intensity  0-100; maps to a luminance delta of 0.04 .. 0.22
 */
export function buildNeumorphic(
  base: string,
  elevation: Elevation,
  shape: Shape,
  light: LightSource,
  intensity: number,
  isDark: boolean
): ShadowSpec {
  const clampedIntensity = Math.max(0, Math.min(100, intensity));
  // Dark surfaces need a bigger multiplicative delta to move the same perceptual amount.
  const scale = isDark ? 3.0 : 1.0;
  const delta = (0.04 + (clampedIntensity / 100) * 0.18) * scale;

  const darkColor = shade(base, -delta);
  const lightColor = shade(base, delta);

  const d = DISTANCE[elevation] * (shape === "pressed" ? 0.6 : 1);
  const blur = d * 2;
  const [sx, sy] = SIGN[light];
  const px = Math.round(d * sx);
  const py = Math.round(d * sy);
  const b = Math.round(blur);
  const inset = shape === "pressed" ? "inset " : "";

  const boxShadow =
    `${inset}${px}px ${py}px ${b}px ${darkColor}, ` +
    `${inset}${-px}px ${-py}px ${b}px ${lightColor}`;

  let background = base;
  if (shape === "convex") {
    background = `linear-gradient(${ANGLE[light]}deg, ${shade(base, 0.07 * scale)}, ${shade(base, -0.10 * scale)})`;
  } else if (shape === "concave") {
    background = `linear-gradient(${ANGLE[light]}deg, ${shade(base, -0.10 * scale)}, ${shade(base, 0.07 * scale)})`;
  }

  return { boxShadow, background, darkColor, lightColor };
}

/* ---------- component ---------- */

export interface NeuSurfaceProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "color"> {
  as?: "div" | "section" | "article" | "aside";
  base?: string;
  hairline?: string;
  elevation?: Elevation;
  shape?: Shape;
  light?: LightSource;
  intensity?: number;
  radius?: number;
  dark?: boolean;
  /** Draws the 3:1 affordance border. Keep true for anything interactive. */
  bordered?: boolean;
}

export const NeuSurface = React.forwardRef<HTMLDivElement, NeuSurfaceProps>(
  function NeuSurface(
    {
      as: Tag = "div",
      base = "#e6e7ee",
      hairline = "#7c7f93",
      elevation = "md",
      shape = "flat",
      light = "top-left",
      intensity = 45,
      radius = 24,
      dark = false,
      bordered = false,
      style,
      children,
      ...rest
    },
    ref
  ) {
    const spec = React.useMemo(
      () => buildNeumorphic(base, elevation, shape, light, intensity, dark),
      [base, elevation, shape, light, intensity, dark]
    );

    return (
      <Tag
        ref={ref as React.Ref<never>}
        style={{
          background: spec.background,
          boxShadow: spec.boxShadow,
          borderRadius: radius,
          border: bordered ? `1px solid ${hairline}` : undefined,
          color: "inherit",
          ...style,
        }}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);

export interface NeuButtonProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "color"> {
  base?: string;
  hairline?: string;
  accent?: string;
  elevation?: Elevation;
  light?: LightSource;
  intensity?: number;
  radius?: number;
  dark?: boolean;
  pressed?: boolean;
  /** Required when the button has no visible text. */
  label?: string;
}

export const NeuButton = React.forwardRef<HTMLButtonElement, NeuButtonProps>(
  function NeuButton(
    {
      base = "#e6e7ee",
      hairline = "#7c7f93",
      accent = "#4c5bd4",
      elevation = "sm",
      light = "top-left",
      intensity = 45,
      radius = 14,
      dark = false,
      pressed,
      label,
      children,
      disabled,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      style,
      ...rest
    },
    ref
  ) {
    const [active, setActive] = React.useState(false);
    const isPressed = pressed ?? active;

    const raised = React.useMemo(
      () => buildNeumorphic(base, elevation, "flat", light, intensity, dark),
      [base, elevation, light, intensity, dark]
    );
    const sunken = React.useMemo(
      () => buildNeumorphic(base, elevation, "pressed", light, intensity, dark),
      [base, elevation, light, intensity, dark]
    );

    if (process.env.NODE_ENV !== "production") {
      if (!label && typeof children !== "string") {
        // Icon-only buttons must be named. Fail loudly in dev.
        console.warn(
          "[NeuButton] No visible text and no `label` prop. " +
            "Neumorphic icon buttons have no perceivable affordance without an accessible name."
        );
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-pressed={pressed === undefined ? undefined : pressed}
        disabled={disabled}
        onPointerDown={(e) => {
          setActive(true);
          onPointerDown?.(e);
        }}
        onPointerUp={(e) => {
          setActive(false);
          onPointerUp?.(e);
        }}
        onPointerLeave={(e) => {
          setActive(false);
          onPointerLeave?.(e);
        }}
        style={{
          minHeight: 44,
          minWidth: 44,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "12px 24px",
          font: "600 0.875rem/1.2 Inter, system-ui, sans-serif",
          background: base,
          border: `1px solid ${isPressed && !disabled ? accent : hairline}`,
          borderRadius: radius,
          boxShadow: disabled ? "none" : isPressed ? sunken.boxShadow : raised.boxShadow,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.65 : 1,
          transition: "box-shadow 120ms cubic-bezier(0.16,1,0.3,1), border-color 120ms linear",
          ...style,
        }}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
```

Usage:

```tsx
export default function Demo() {
  return (
    <NeuSurface elevation="lg" radius={36} style={{ padding: 32 }}>
      <h2 style={{ margin: 0, marginBottom: 16 }}>Thermostat</h2>
      <NeuButton elevation="sm" intensity={45}>Cool</NeuButton>
      <NeuButton elevation="sm" intensity={45} label="Increase temperature">+</NeuButton>
    </NeuSurface>
  );
}
```

### Native / other platform

**SwiftUI — genuinely relevant.** This is the platform where neumorphism still has a maintained library: `costachung/Neumorphic` (MIT, 988 stars, v2.0.5, iOS 13+ / macOS 10.15+), which exists because SwiftUI has no native inner-shadow primitive. Its API is `.softOuterShadow()`, `.softInnerShadow(_:)`, `.softButtonStyle(_:)`, `.softSwitchToggleStyle()`, with press effects `.none`, `.flat`, `.hard`.

```swift
import SwiftUI

struct NeumorphicPalette {
    static let surface   = Color(red: 0.902, green: 0.906, blue: 0.933) // #e6e7ee
    static let dark      = Color(red: 0.722, green: 0.725, blue: 0.745) // #b8b9be
    static let light     = Color.white
    static let hairline  = Color(red: 0.486, green: 0.498, blue: 0.576) // #7c7f93
    static let accent    = Color(red: 0.298, green: 0.357, blue: 0.831) // #4c5bd4
}

struct NeuRaised: ViewModifier {
    var radius: CGFloat = 24
    var distance: CGFloat = 8
    func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .fill(NeumorphicPalette.surface)
                    .shadow(color: NeumorphicPalette.dark,
                            radius: distance, x: distance, y: distance)
                    .shadow(color: NeumorphicPalette.light,
                            radius: distance, x: -distance, y: -distance)
            )
            .overlay(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .strokeBorder(NeumorphicPalette.hairline, lineWidth: 1)
            )
    }
}

/// Inner shadow without a third-party dependency.
struct NeuPressed: ViewModifier {
    var radius: CGFloat = 14
    var distance: CGFloat = 5
    func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .fill(NeumorphicPalette.surface)
                    .overlay(
                        RoundedRectangle(cornerRadius: radius, style: .continuous)
                            .stroke(NeumorphicPalette.dark, lineWidth: distance * 2)
                            .blur(radius: distance)
                            .offset(x: distance / 2, y: distance / 2)
                            .mask(RoundedRectangle(cornerRadius: radius, style: .continuous))
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: radius, style: .continuous)
                            .stroke(NeumorphicPalette.light, lineWidth: distance * 2)
                            .blur(radius: distance)
                            .offset(x: -distance / 2, y: -distance / 2)
                            .mask(RoundedRectangle(cornerRadius: radius, style: .continuous))
                    )
            )
            .overlay(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .strokeBorder(NeumorphicPalette.hairline, lineWidth: 1)
            )
    }
}

struct NeuButtonStyle: ButtonStyle {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 15, weight: .semibold))
            .foregroundStyle(Color(red: 0.2, green: 0.212, blue: 0.302)) // #33364d
            .padding(.horizontal, 24)
            .frame(minWidth: 44, minHeight: 44)
            .modifier(configuration.isPressed
                      ? AnyViewModifierBox(NeuPressed())
                      : AnyViewModifierBox(NeuRaised(radius: 14, distance: 5)))
            .animation(reduceMotion ? nil : .easeOut(duration: 0.12),
                       value: configuration.isPressed)
    }
}

/// Small helper so the two modifiers can be swapped in one expression.
struct AnyViewModifierBox: ViewModifier {
    private let apply: (AnyView) -> AnyView
    init<M: ViewModifier>(_ modifier: M) {
        apply = { AnyView($0.modifier(modifier)) }
    }
    func body(content: Content) -> some View { apply(AnyView(content)) }
}

struct NeuDemo: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Thermostat").font(.title2.weight(.bold))
            Button("Cool") { }.buttonStyle(NeuButtonStyle())
        }
        .padding(32)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(NeumorphicPalette.surface)
    }
}
```

**Jetpack Compose — relevant but unmaintained upstream.** `fornewid/neumorphism` (Apache-2.0, 1,017 stars) is the reference Android implementation and is still receiving commits (last push 28 May 2026), but the author labels it "just experimental". Compose has no inner shadow either; the practical route in 2026 is a custom `drawBehind` with two `Paint` objects carrying `BlurMaskFilter`, plus `Modifier.border` for the 3:1 hairline. Do not rely on Material 3 elevation tokens — they render a single ambient/key shadow pair in the theme's shadow colour, which is the opposite of the neumorphic same-hue requirement.

**React Native — partially applicable.** iOS supports only a single `shadowColor`/`shadowOffset`/`shadowRadius` per view, so a neumorphic pair requires two nested wrapper `View`s (outer = dark shadow, inner = light shadow, innermost = content). On Android, `elevation` renders a single system shadow and cannot be coloured before API 28 (`outlineAmbientShadowColor` / `outlineSpotShadowColor`). The reliable cross-platform answer is `react-native-svg` with two `<feDropShadow>` filters, or a pre-rendered 9-slice asset. Budget for the fact that the effect will not be pixel-identical across the two platforms.

**Figma — fully applicable and this is where most neumorphism actually lives.** Two Drop Shadow effects on one frame: `X 8, Y 8, Blur 16, Spread 0` in the dark colour, and `X -8, Y -8, Blur 16, Spread 0` in the light colour. For pressed, switch both to Inner Shadow at 60% of the distance. Publish the pair as a single effect style named `nm/raised-md` so the light source cannot drift between files. Figma's shadow model matches CSS `box-shadow` exactly, so handoff is lossless — which is one reason the style over-indexes on design tools relative to shipped product.

---

## 6. Interaction & Motion

Neumorphism's whole promise is tactility, so state changes must feel mechanical: fast, short, and terminating hard. The universal mistake is animating the shadow *distance* over 300ms with an ease-in-out, which reads as rubber, not plastic.

| State | Treatment | Values |
|---|---|---|
| Rest | Raised, `sm` elevation | `5px 5px 10px dark, -5px -5px 10px light` |
| Hover | One elevation step up, `translateY(-1px)` | to `8px 8px 16px`, `180ms cubic-bezier(0.16,1,0.3,1)` |
| Active / pressed | Inset at 60% of the outer distance, `translateY(0)`, accent border | `inset 3px 3px 6px dark, inset -3px -3px 6px light`, `120ms cubic-bezier(0.4,0,1,1)` |
| Selected / `aria-pressed="true"` | Persist the pressed shadow **and** switch `border-color` to accent | Border is the state carrier; shadow alone is 1.5:1 and cannot be it |
| Focus-visible | `outline: 3px solid var(--nm-accent); outline-offset: 3px` | Never `box-shadow` — see §7 |
| Disabled | `box-shadow: none`, muted border, muted ink, `cursor: not-allowed` | Removing the extrusion is the clearest disabled signal this style has |
| Loading | Pressed well + a 1400ms linear translate sheen at 70% highlight opacity | Do not pulse the shadow itself |
| Error | `border-color: var(--nm-danger)` plus text; do not tint the surface | Tinting the surface breaks the same-hue rule |

**Animate:** `box-shadow` (accepting the paint cost, or via the two-layer opacity trick below), `border-color`, `transform: translateY()` / `scale()`, `background` on the thumb of a toggle.

**Do not animate:** `filter: blur()` on the surface, `border-radius`, the surface colour itself (it must track the page background), or the light source direction.

**The compositor-friendly press.** Because `box-shadow` transitions repaint every frame, render both shadow states as stacked pseudo-elements and cross-fade opacity, which stays on the compositor:

```css
.nm-btn-fast {
  position: relative;
  isolation: isolate;
  background: var(--nm-surface);
  border: 1px solid var(--nm-hairline);
  border-radius: var(--nm-r-ctl);
}
.nm-btn-fast::before,
.nm-btn-fast::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  transition: opacity var(--nm-t-press) var(--nm-e-out);
  will-change: opacity;
}
.nm-btn-fast::before { box-shadow: var(--nm-raised-sm);  opacity: 1; }
.nm-btn-fast::after  { box-shadow: var(--nm-pressed-sm); opacity: 0; }
.nm-btn-fast:active::before { opacity: 0; }
.nm-btn-fast:active::after  { opacity: 1; }
```

**Reduced motion.** `prefers-reduced-motion: reduce` must collapse every transition to `1ms` and remove `translateY` and the loading sheen. Critically, it must **not** remove the state change itself: the pressed shadow and the accent border still apply, they just apply instantly. A reduced-motion user who loses press feedback has lost information, not decoration.

**Reduced transparency.** `prefers-reduced-transparency: reduce` does not strictly apply — neumorphism has no translucency — but honour it anyway as a proxy for "this user wants plainer surfaces": drop to a single 2px/6px shadow and raise the hairline to 4.5:1.

---

## 7. Accessibility

Neumorphism is the highest-a11y-risk style in this set. The failure is structural, not a matter of execution: the effect is *defined* as low contrast, because the element and its background are the same colour by construction.

### The contrast math, exactly

WCAG relative luminance `L = 0.2126R + 0.7152G + 0.0722B` (linearised sRGB); ratio `= (L₁ + 0.05) / (L₂ + 0.05)`.

- Light surface `#e6e7ee` → L = 0.8015.
- Dark shadow `#b8b9be` → L = 0.4861. Ratio = **1.59:1**.
- Light shadow `#ffffff` → L = 1.0000. Ratio = **1.23:1**.
- Generator default `#e0e0e0` vs `#bebebe` = **1.41:1**; vs `#ffffff` = **1.32:1**.
- Dark surface `#2a2e39` → L = 0.0274. `#17191f` = **1.30:1**; `#3d4353` = **1.37:1**.

SC 1.4.11 requires **3:1**. Every neumorphic shadow pair in normal use lands between 1.2:1 and 1.7:1 — roughly **half** the required ratio. To reach 3:1 on `#e6e7ee` you need a boundary colour at or below **#848484** (3.03:1; `#858585` is the first grey that fails, at 2.99:1); the recommended `#7c7f93` gives 3.20:1. On `#e0e0e0` the 3:1 threshold is **#7d7d7d** (3.12:1); `#808080` gives 2.99:1 and fails. There is no combination of blur, distance, or luminance delta that gets a same-hue shadow to 3:1 while still looking neumorphic. **The shadow cannot be the affordance. A border, an accent fill, or a text label must be.**

### WCAG 2.2 criteria this style tends to violate

| Criterion | Level | How neumorphism fails it | Fix |
|---|---|---|---|
| **1.4.1 Use of Color** | A | Active/selected state signalled only by an inset shadow | Add an icon, label, or `aria-pressed` + border change |
| **1.4.3 Contrast (Minimum)** | AA | Pale greys chosen "to match the shadows" put body text at 2–3:1 | Ink at ≥ 4.5:1 (`#33364d` = 9.59:1); large text ≥ 3:1 |
| **1.4.11 Non-text Contrast** | AA | **The core failure.** Button, input, toggle and slider boundaries sit at 1.2–1.7:1 | 1px `#7c7f93` hairline (3.20:1) on every interactive boundary; accent for state |
| **1.4.12 Text Spacing** | AA | Tight neumorphic cards clip when users override spacing | Never fix component heights; use `min-height` and let content grow |
| **2.4.7 Focus Visible** | AA | Focus commonly styled with `box-shadow`, which is invisible against the extrusion and **deleted entirely** in forced-colors mode | `outline: 3px solid` + `outline-offset: 3px`, always |
| **2.4.11 Focus Not Obscured (Minimum)** | AA (2.2, new) | 40–60px blurred shadows on sticky headers visually swallow a focused control below them | Keep `outline-offset` ≥ 3px and sticky-header shadow blur ≤ 16px |
| **2.4.13 Focus Appearance** | AAA (2.2, new) | Needs a ≥ 2px-thick perimeter indicator at ≥ 3:1 against adjacent colours | `outline: 3px solid var(--nm-accent)` — accent is 4.54:1, clears it |
| **2.5.8 Target Size (Minimum)** | AA (2.2, new) | Neumorphic keypads and icon rows get packed to 32px so the shadows do not collide | ≥ 24×24 CSS px minimum, 44×44 recommended; increase gap instead of shrinking targets |
| **1.4.13 Content on Hover or Focus** | AA | Hover-only elevation change is the sole hover signal | Pair with a border or ink change |

### Focus-visible strategy

1. Use `:focus-visible`, not `:focus` — a pressed neumorphic button that keeps a focus ring after a mouse click looks broken and trains people to ignore rings.
2. Use `outline`, never `box-shadow`. Outline is the only focus mechanism that survives Windows High Contrast Mode.
3. `outline-offset: 3px` minimum, so the ring clears the blurred shadow halo.
4. Accent `#4c5bd4` on `#e6e7ee` is 4.54:1 and on `#2a2e39` `#8f9dff` is 5.45:1 — both exceed the 3:1 floor for focus indicators.
5. Add `:focus-visible { outline-color: Highlight }` inside `@media (forced-colors: active)`.

### Screen readers and DOM order

Neumorphism is a purely visual layer and adds no semantics, which is precisely the risk: it makes a `<div>` look exactly as clickable as a `<button>`, so teams stop using real elements.

- Use native `<button>`, `<input>`, `<a>`. If you must use a `<div>`, supply `role`, `tabindex="0"`, and keyboard handlers for both Enter and Space.
- Pressed/selected toggles need `aria-pressed` (button) or `role="switch"` + `aria-checked`. The inset shadow communicates nothing to assistive technology.
- Icon-only neumorphic controls — the most common pattern in this style — must carry `aria-label`. The React component above warns in development when they do not.
- Neumorphic "wells" (inset containers) are often used as visual grouping. Give them a real `<fieldset>`/`<legend>` or `role="group"` + `aria-labelledby` so the grouping exists non-visually.
- The visual reading order of a neumorphic dashboard is often driven by shadow depth rather than DOM order. Verify tab order matches the perceived hierarchy.

### Forced-colors / Windows High Contrast Mode

This is the hard stop. In forced-colors mode the user agent forces **`box-shadow: none`** (along with `text-shadow: none` and non-URL `background-image: none`), and overrides `color`, `background-color`, `border-color`, `outline-color`, and SVG `fill`/`stroke` with system colours. A neumorphic interface therefore loses **100% of its visual structure** in WHCM: every control becomes an unbordered rectangle of `Canvas` on `Canvas`.

You must ship a `@media (forced-colors: active)` block (see §5) that:
- sets `border: 2px solid ButtonText` on every surface that was defined by shadow alone,
- sets `outline: 3px solid Highlight` for focus,
- maps selected states to `Highlight`/`HighlightText` and disabled to `GrayText`,
- uses `forced-color-adjust: none` only where you genuinely need to preserve a brand colour, and never on text.

Adding `border: 2px solid transparent` at rest is a useful trick: transparent borders are forced opaque in WHCM, so structure reappears with no light-mode cost — but reserve the layout space for it up front.

### Pass/fail checklist

- [ ] Every interactive element has a boundary at ≥ 3:1 against its surface that is **not** a shadow.
- [ ] Body text ≥ 4.5:1; text ≥ 18.66px bold or ≥ 24px ≥ 3:1.
- [ ] Selected / on / active state is carried by colour **and** shape or text, not by shadow direction alone.
- [ ] `:focus-visible` uses `outline` ≥ 3px with `outline-offset` ≥ 3px at ≥ 3:1.
- [ ] `@media (forced-colors: active)` block exists and restores borders and focus.
- [ ] Every icon-only control has an accessible name.
- [ ] All targets ≥ 24×24 CSS px (SC 2.5.8); 44×44 for touch-primary surfaces.
- [ ] Every interactive element takes its `min-height`/`min-width` from `--nm-target-min` (44px) and nothing overrides it downward — measure the border box, not the shadow halo, which is not clickable.
- [ ] `prefers-reduced-motion: reduce` removes transitions but preserves state changes.
- [ ] Rendered at 200% zoom and 400% zoom with no clipping (SC 1.4.4, 1.4.10).
- [ ] Passes a low-vision / cataract simulator: controls still locatable with shadows removed.
- [ ] Greyscale + 50% contrast reduction screenshot: interactive elements still findable.
- [ ] Automated axe / Lighthouse run clean for `color-contrast` and `link-in-text-block`.

---

## 8. Performance

**What it costs.** `box-shadow` is a paint-time operation, not a compositor one. Chromium/Skia and Gecko/WebRender both implement blurred box shadows as a multi-pass box blur; a standard triple box blur touches every pixel roughly six times on CPU, and each shadow costs on the order of three draw calls plus a shader switch on GPU — expensive specifically on mobile GPUs. Neumorphism doubles this by definition: **two shadow layers per element**, and often four when you add the pressed pseudo-element for the compositor trick.

**Where the cost concentrates.**
- Blur radius drives cost superlinearly in the blurred region's area. A 40px blur on a 300×80 button dirties roughly `(300+80)×(80+80) ≈ 60,800` px per layer versus `≈ 22,000` px at 8px blur — about **2.8×** the blurred area for a shadow most users cannot distinguish from the smaller one.
- Transitioning `box-shadow` invalidates paint every frame. A 60fps 180ms hover transition on a card grid of 24 items repaints all 48 shadow layers 11 times.
- Inset shadows on scrolling containers are worse than outer shadows: they are clipped to the border-box and re-rasterised on every scroll offset change if the element is not on its own layer.
- Shadow spread (`spread > 0`) increases the blurred area without improving the effect. Neumorphism should always use spread 0.

**Measurable budgets.**

| Budget | Target |
|---|---|
| Neumorphic elements in the initial viewport | ≤ 12 |
| Shadow layers per element | 2 (4 only for the pseudo-element cross-fade) |
| Max blur radius | 40px; ≤ 24px on any element inside a scroller |
| Blur on list/grid items | ≤ 16px |
| Animated-shadow elements simultaneously | ≤ 4 |
| Paint time per frame (Chrome DevTools Performance) | ≤ 4ms on a 4× CPU-throttled profile |
| Long-animation-frame budget | no LoAF > 50ms attributable to paint during hover/press |
| Additional asset weight | **0 bytes** — no images, no fonts, no scripts |
| CSS delta for a full neumorphic token layer + components | ≈ 3–5 KB before gzip |

**Mobile and low-end notes.** Neumorphism's saving grace is that it is pure CSS — zero network cost, no backdrop-filter, no compositing of a live-blurred backdrop (which is what makes glassmorphism genuinely expensive). Its liability is scroll performance on grids of shadowed cards on mid-range Android. On a 2019-class device, a 30-card grid at 40px blur will drop frames during flings. Mitigations, in order of effectiveness:

1. Reduce blur before reducing the number of elements. Halving blur from 40px to 20px typically recovers more than removing a third of the cards.
2. Apply neumorphism only to elements above the fold and to controls; leave list items flat with a hairline border.
3. Use `content-visibility: auto` with `contain-intrinsic-size` on off-screen card sections so their shadows are never painted.
4. Cross-fade opacity on pseudo-elements instead of transitioning `box-shadow` (§6).
5. `will-change: opacity` only on the element currently being interacted with — never blanket-applied, which forces dozens of unnecessary layers and blows GPU memory.

**Cheaper fallbacks, in descending fidelity.**

```css
/* 1. Single-layer approximation: keeps the highlight, drops half the cost. */
.nm-cheap-1 { box-shadow: 6px 6px 12px var(--nm-shadow-dark),
                          -2px -2px 6px var(--nm-shadow-light); }

/* 2. Border + one soft shadow. Reads "soft" and passes 1.4.11 on its own. */
.nm-cheap-2 { border: 1px solid var(--nm-hairline);
              box-shadow: 0 2px 6px var(--nm-shadow-dark); }

/* 3. Zero-paint: hairline only. Use inside long virtualised lists. */
.nm-cheap-3 { border: 1px solid var(--nm-hairline); box-shadow: none; }

/* 4. Static 9-slice or pre-baked SVG for a repeated ornamental slab.
      Only worth it when the same shape repeats 50+ times and never animates. */
```

`filter: drop-shadow()` is often GPU-accelerated where `box-shadow` is not, and can be faster for a single shadow — but it follows the alpha silhouette rather than the border-box, so two stacked `drop-shadow()` filters on an opaque rounded rect give a subtly different (and usually worse) neumorphic read. Test before swapping.

---

## 9. When To Use / When Not To

**Use it when:**
- You are building a **digital twin of physical hardware**: thermostats, smart-home switch panels, amplifier and mixer UIs, camera controls, appliance dashboards. The extrusion metaphor is literally correct here, and this is the strongest 2026 niche.
- You need a **calm, low-arousal register**: meditation, sleep, breathing, journaling, mood-tracking apps. Low contrast is a feature when the goal is "do not stimulate".
- You are decorating **a small, bounded set of controls** — a media transport bar, a numeric keypad, a set of segmented toggles — inside an otherwise flat interface.
- You want a **premium-hardware feel in fintech or wearables companion apps** without going full glass.
- The product is a **single-purpose utility** with 3–8 controls total: calculator, timer, clock, EQ, tip splitter. Small surface area means the affordance problem is memorisable.
- You are doing **portfolio, concept, or awards work** where visual distinctiveness is the deliverable and the audience is designers.
- Your product has a **controlled hardware target** (a kiosk, an in-car head unit you specify, an appliance panel) where you know the display, viewing angle, and ambient light.

**Do not use it when:**
- The product is **content-dense**: admin consoles, analytics dashboards with tables, CRMs, email clients, IDEs. Neumorphism's padding requirements and shadow gaps cost 30–50% of your information density.
- You have **legal accessibility obligations** — public sector (EN 301 549, Section 508), education, healthcare, banking under the European Accessibility Act. A default-neumorphic system will not survive an audit without so much remediation that nothing neumorphic remains.
- **Older or low-vision users are a core segment.** The style is measurably worse for exactly the population most likely to use zoom, high contrast, or screen magnification.
- You need **many simultaneous states**: multi-select tables, kanban boards, form validation matrices. Neumorphism has essentially two states (up, down) and everything beyond that needs colour anyway.
- The interface will be used in **bright outdoor light or on low-quality panels**. A 1.5:1 shadow is the first thing to vanish under glare or on a cheap TN screen.
- You are building a **general-purpose design system** for many teams. The style requires per-component judgement that does not scale across contributors, and 2026 tooling for it is effectively unmaintained.
- Your brand needs **high energy, urgency, or contrast** — commerce checkout, ticketing, sports, news. Consider [./07-brutalism.md](./07-brutalism.md) instead.
- You are **shipping on Windows to enterprise users**, where Windows High Contrast Mode uptake is real and your entire visual language evaporates.

---

## 10. Do & Don't

| Do | Don't |
|---|---|
| Keep the element's `background` identical to its parent's, to within ΔL ≤ 0.02 OKLCH. | Put a neumorphic shadow on a card whose fill differs from the page — that is just a soft drop shadow wearing a costume. |
| Add a 1px `#7c7f93` (3.20:1) hairline to every interactive boundary. | Ship a borderless neumorphic button and call the 1.5:1 shadow the affordance. |
| Keep `blur = 2 × distance` and `spread = 0`. | Use spread, or blur ratios above 4× — you get fog, plus a bigger paint region for no visual gain. |
| Pick one light source (top-left, `145deg`) and enforce it globally with a token. | Let individual components choose their own light direction; mixed diagonals are the #1 amateur tell. |
| Carry state with an accent colour plus the shadow: `border-color: var(--nm-accent)` on pressed. | Signal on/off with inset-vs-outset shadow alone — it fails SC 1.4.1 and 1.4.11 simultaneously. |
| Use `outline: 3px solid` with `outline-offset: 3px` for focus. | Use `box-shadow` for focus rings — invisible against extrusion and force-removed in WHCM. |
| Ship a `@media (forced-colors: active)` block that restores 2px `ButtonText` borders. | Assume the shadows will render in Windows High Contrast Mode. They will not; `box-shadow` is forced to `none`. |
| Raise the luminance delta to ~0.40–0.50 multiplicative in dark mode. | Reuse the light-mode `0.15` delta on a dark surface — the effect disappears into the base colour. |
| Restrict neumorphism to controls and one hero surface; keep lists, tables and text blocks flat. | Apply it to every element on the page; a fully neumorphic screen has no hierarchy because everything sits at the same depth. |
| Give siblings a gap of at least `2 × distance + blur / 2` (16px at `sm`, 24px at `md`). | Pack neumorphic cards at 8px gaps; overlapping shadow halos turn into grey mud. |
| Cross-fade two pseudo-elements' opacity for press feedback. | Transition `box-shadow` across a 24-card grid and then wonder why fling scrolling stutters. |
| Cap blur at 40px, and at 16px inside any scrolling container. | Copy neumorphism.io's initial `20px / 60px` values straight onto a 44px button — the shadow will be larger than the control. |
| Test a greyscale, contrast-reduced screenshot and confirm every control is still findable. | Judge the design only on a colour-calibrated 5K display in a dim studio. |
| Use `min-height`, never fixed heights, so text-spacing overrides do not clip (SC 1.4.12). | Hard-code component heights to keep shadow geometry tidy. |
| Reserve saturated colour for the single most important action on screen. | Make the whole palette saturated — the ±luminance shift drags hue and everything goes muddy. |

---

## 11. In The Wild (2024-2026)

Only verified items appear here. Note the shape of this list: the surviving artefacts are **tools and component collections**, not shipped products. That asymmetry is itself the finding.

**Shipped platform interfaces (historical, still visible)**
- **Huawei HarmonyOS / Honor Vision smart TV** (launched August 2019; HarmonyOS 2's interface took a Red Dot Design Award in 2021). Same-hue tiles with paired soft shadows. The earliest mass-market instance on record, predating the Dribbble moment.
- **Apple macOS Big Sur 11.0** (released 12 November 2020). Icon plinths, sidebar treatments and control chrome with raised/inset elements blended into the background. Widely cited — including by Big Human's December 2025 retrospective — as the most prominent product-level neumorphism, and equally cited as the last one, since Apple's 2025 **Liquid Glass** (WWDC, 9 June 2025; iOS 26 / iPadOS 26 / macOS Tahoe 26 / watchOS 26 / tvOS 26 / visionOS 26) moved the company decisively to translucency instead.

**Generators and tooling (active)**
- **neumorphism.io** — Adam Giebl, React, BSD-3-Clause, **6,135 GitHub stars**, last push 24 October 2025. Still the de-facto specification. Controls: base colour (default `#e0e0e0`), size (default 300), radius (default 50, snaps to `50%` at max), distance (default 20), blur (default 60, but the distance handler enforces `blur = distance × 2`), intensity (`colorDifference`, default 0.15), four light sources, four shapes (flat / pressed / concave / convex). Its output template is literally `border-radius / background / box-shadow`.
- **Uiverse.io** — open-source UI element library; **189+ elements tagged `neumorphism`** in CSS and Tailwind as of 2026 (buttons, cards, switches, inputs). Cross-linked from neumorphism.io itself. This is where the style's community energy actually lives now.
- **design.dev/tools/neumorphism**, **codeshack.io/css-neumorphism-generator**, and several other generators offering live preview across button / card / input / toggle with flat, concave, convex and pressed modes.

**Component libraries (mostly frozen)**
- **`ui-neumorphism`** (AKAspanion, MIT, **653 stars**) — the most complete React implementation, 50+ components. Final npm release **v1.1.3 on 21 February 2021**; last GitHub push 17 July 2024. Usable, unmaintained.
- **`Neumorphic`** (costachung, MIT, **988 stars**, v2.0.5, iOS 13+/macOS 10.15+) — SwiftUI soft-UI utility with `.softOuterShadow()`, `.softInnerShadow()`, `.softButtonStyle()`, `.softSwitchToggleStyle()` and `.none/.flat/.hard` press effects. Last push 31 October 2024. Still the best native implementation of the style anywhere.
- **`neumorphism`** (fornewid, Apache-2.0, **1,017 stars**) — Android/Compose experiment, last push **28 May 2026**; the highest-starred neumorphic repo with genuine 2026 activity, though the author labels it experimental.
- **`tailwindcss-neumorphism`** (sambeevors, **160 stars**) — npm v0.1.0, published **10 June 2020**, never updated; repo last push 13 February 2024.
- **`tailwindcss-neumorphism-ui`** (junwen-k, MIT, **15 stars**) — commits as recently as **3 August 2026**. Star count is a fair index of how small the current ecosystem is.
- **`neumorphic-react`** (mrturck, MIT, 4 stars, v0.1.7, 7 March 2020) — historical only.

**Current editorial positions (2025-2026)**
- **Big Human**, "What Is Neumorphism in UI Design? A Complete 2026 Guide", 9 December 2025 — treats it as a failed trend; notes Apple's shift to glassmorphism.
- **Interaction Design Foundation** topic page, last updated 2 March 2026 — a stylistic experiment whose future depends on solving contrast; recommends selective use only.
- Multiple 2026 trend write-ups converge on the same segmentation: neumorphism survives in **smart-home remotes, music players, calculators, health dashboards, fintech and productivity accents**, always component-scoped, always paired with a real border or accent, and always inside an otherwise flat or glass shell.

**Deliberately excluded.** Several trend posts name Stripe, Spotify and generic "Apple iOS apps" as neumorphic. Those claims do not survive inspection — Stripe uses gradient-mesh and flat cards, Spotify uses flat/dark surfaces with standard drop shadows — so they are left out.

---

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui.

- **[./01-skeuomorphism.md](./01-skeuomorphism.md) — direct ancestor.** Neumorphism is literally "new skeuomorphism": it keeps skeuomorphism's physicality and throws away its textures, bevels and photographic materials. The hybrid ("neo-skeuomorphism") is neumorphic geometry plus one real material texture — brushed metal on a slider track, felt in a well. It works when the texture appears exactly once per screen and fails the moment two materials compete.
- **[./03-glassmorphism.md](./03-glassmorphism.md) — the style that beat it, and its best partner.** These are complementary rather than competing: neumorphism is opaque and extruded, glassmorphism is translucent and floating. The reliable combo is **neumorphic base plane + glass overlay**: the page and its controls are neumorphic, and modals, popovers and the nav bar are glass. This gives you an unambiguous z-order (glass is always above, neumorphism is always the ground), and it solves neumorphism's worst problem — a glass panel has a real background differential and a real border, so it passes 1.4.11 easily. The clash to avoid: glass *inside* a neumorphic well, where the well's inset shadow shows through the blur and reads as a rendering bug.
- **[./04-claymorphism.md](./04-claymorphism.md) — nearest cousin.** Clay is neumorphism with colour, bigger radii, and a two-tone inner shadow. They combine well in one direction only: clay elements sitting *on* a neumorphic surface. Reverse it and the neumorphic element disappears against the saturated clay.
- **[./05-minimalism.md](./05-minimalism.md) — the default host.** This is the 2026 shipping configuration: a flat, minimal information layer (type, tables, lists, nav) with neumorphism applied only to a bounded control cluster. Minimalism carries the density and the contrast; neumorphism carries the tactility. Nearly every credible 2026 example is this hybrid. Doc 05 owns flat design and flat 2.0 as aliases — there is no separate flat-design file in this set.
- **[./06-maximalism.md](./06-maximalism.md) — clashes, and there is no rescue.** Maximalism's whole argument is simultaneous high-chroma competition for attention; neumorphism's whole argument is a single hue at a 1.5:1 differential. Put them together and the neumorphic controls simply disappear. If a maximalist page needs a tactile control, give it a real border and an accent fill and accept that it is no longer neumorphism.
- **[./07-brutalism.md](./07-brutalism.md) — total clash, and occasionally the point.** Neubrutalism's hard 3–4px black offset shadows and near-1.0 contrast are the exact opposite of soft same-hue extrusion. Mixing them at equal weight looks like a broken stylesheet. The one working recipe is a **neumorphic canvas with a single brutalist primary CTA** — the contrast collision makes the CTA unmissable, which is precisely what neumorphism otherwise cannot do.
- **[./08-liquid-glass.md](./08-liquid-glass.md) — the successor, and the honest comparison.** Apple's 2025 material solves the same problem (depth without literal skeuomorphism) with refraction, specular tracking and adaptive tint instead of cast shadows. **It is not a contrast win.** Apple has walked its opacity back twice — the 26.1 *Tinted* toggle (3 November 2025) and the iOS 27 clear-to-tinted slider — after sustained legibility criticism, including the American Foundation for the Blind's December 2025 open letter; doc 08 rates it `a11y_risk: high`. See [./08-liquid-glass.md](./08-liquid-glass.md) §7. So the choice between them is not "glass is more accessible": for Apple-native targets in 2026, Liquid Glass is the platform-consistent answer and neumorphism is off-platform; on the web, both need a real border or accent to carry state, and neither shadow nor refraction may be the sole affordance. Where they combine: neumorphic *hardware controls* inside a liquid-glass *chrome* — a thermostat dial that feels moulded, in a glass panel that floats.
- **[./09-bento-grid.md](./09-bento-grid.md) — structurally excellent.** Bento's equal-weight tiled cells are exactly the layout neumorphism wants: uniform, generously gapped, each cell one extruded slab. Keep the gap at ≥ 24px so shadow halos do not merge, and vary tile *size* rather than tile *elevation*, because neumorphism cannot express more than about two depth levels legibly.
- **[./10-spatial-ui.md](./10-spatial-ui.md) — works only if the depth budget is shared.** Spatial UI expresses hierarchy with a real z-ladder on one perspective stage; neumorphism expresses it with a faked light source and can carry roughly two levels. Use spatial depth for *layering* (which panel is in front) and neumorphism for *affordance* (which thing you press), never both for the same distinction. On a spatial canvas the same-hue rule still binds: the control must match the panel it is extruded from, not the environment behind it.
- **Google Material Design — no doc in this set; conceptually incompatible, mechanically adjacent.** Material's elevation model is a single light source casting one key + one ambient shadow in a *neutral shadow colour* onto a *different-coloured* surface. Neumorphism requires a same-hue surface and two opposed shadows. You cannot express neumorphism in Material 3 elevation tokens; you have to override them. Material's motion tokens and 48dp target sizes, however, transfer cleanly and are worth stealing.
- **Aurora / mesh gradients — no doc in this set; clashes on the surface, works as a backdrop.** An aurora mesh behind a neumorphic panel breaks the same-hue rule and kills the effect. What does work is a very low-chroma aurora *as the page background*, with the neumorphic surface sampling its local colour — expensive to get right, striking when you do.

---

## 13. Plugin Spec (draft)

### Skill name & description

**`neumorphism-ui`**

> **Use when** the user asks for neumorphism, neomorphism, soft UI, "soft/extruded/embossed/pressed-in buttons", "new skeuomorphism", or a tactile hardware-like interface — for example a thermostat, smart-home panel, media transport, calculator, or wellness app — or when they want to convert existing flat or Material components to a soft extruded look. Also use when reviewing an existing neumorphic UI for the contrast and forced-colors failures the style is prone to.

### What the skill does

1. **Detects the stack** — reads `package.json`, `tailwind.config.*` / `@import "tailwindcss"`, `*.module.css`, `Package.swift`, `build.gradle.kts` — and picks the correct output target (vanilla CSS, Tailwind v4 `@theme`, CSS-in-JS, SwiftUI, Compose).
2. **Derives a token layer from the user's base colour.** Converts to OKLCH, verifies there is luminance headroom in both directions (rejects bases with L > 0.96 or L < 0.06), and emits `--nm-surface`, `--nm-shadow-light`, `--nm-shadow-dark`, `--nm-hairline`, `--nm-text`, `--nm-text-mut`, `--nm-accent` — with the hairline and ink **solved for** their contrast targets (3:1 and 4.5:1) rather than picked by eye.
3. **Generates the elevation ramp** — five distance/blur pairs at `blur = 2 × distance`, plus matching inset variants at 0.6× distance, plus the four shape variants (flat / convex / concave / pressed) at `145deg`.
4. **Rewrites components.** Replaces `shadow-*` / `elevation` / `box-shadow` declarations with the neumorphic pair, forces the element background to the surface token, bumps radii to the nearest ramp value, and **injects the hairline border on every interactive element** as a non-optional step.
5. **Rewrites interaction states** to the §6 table, converting `:focus` to `:focus-visible` with `outline`, and converting any `box-shadow`-based focus ring to an outline.
6. **Emits the mandatory guard blocks**: `@media (prefers-reduced-motion: reduce)`, `@media (forced-colors: active)`, and the low-end fallback.
7. **Runs an audit** and writes a report with computed contrast ratios for every generated pair, shadow-layer counts per viewport, and a WCAG 2.2 checklist result.
8. **Scopes itself.** By default it applies neumorphism only to elements matching a control allowlist (`button`, `input`, `select`, `[role=switch]`, `[role=slider]`, `.card`) and explicitly leaves tables, lists and long-form text flat. Whole-page application requires an explicit `--scope=all` opt-in and prints a warning.

### Inputs it needs from the user

| Input | Type | Default | Notes |
|---|---|---|---|
| `framework` | `vanilla-css \| tailwind-v4 \| react-css-modules \| styled-components \| swiftui \| compose` | auto-detected | |
| `baseColor` | hex / OKLCH | `#e6e7ee` light, `#2a2e39` dark | Must have headroom both ways |
| `accentColor` | hex | `#4c5bd4` | Re-solved if it fails 4.5:1 on the surface |
| `density` | `compact \| comfortable \| spacious` | `comfortable` | Drives radius, padding and sibling gap |
| `intensity` | 0–100 | 45 | See knobs below |
| `lightSource` | `top-left \| top-right \| bottom-right \| bottom-left` | `top-left` | Global, single value |
| `scope` | `controls \| controls+cards \| all` | `controls+cards` | `all` prints a warning |
| `darkMode` | `none \| media \| class \| both` | `both` | |
| `a11yMode` | `strict \| standard` | `strict` | `strict` refuses any output that fails 1.4.11 |

### Outputs it produces

- `tokens/neumorphism.css` — the full `:root` + dark-mode override block from §4, with every value computed from the user's base.
- `tokens/neumorphism.json` — the same tokens in DTCG format for Figma/Style Dictionary round-tripping.
- A component set for the detected framework: `Button`, `IconButton`, `Card`, `Input`, `Textarea`, `Switch`, `Slider`, `SegmentedControl`, `Well`, `Skeleton` — each with rest/hover/active/focus/disabled/loading states already wired.
- `styles/neumorphism.layer.css` — a `@layer neumorphism { … }` sheet so the treatment can be disabled wholesale by removing one layer.
- `reports/neumorphism-audit.md` — per-token contrast ratios with pass/fail, a shadow-layer census by route, an estimated paint cost, and the WCAG 2.2 checklist from §7.
- A `forced-colors` and `prefers-reduced-motion` block appended to the layer, never optional.
- A diff summary listing every element that received a hairline border and why.

### Validation checklist the skill must self-run

1. **Contrast.** Compute WCAG ratios for: hairline vs surface (**≥ 3.0**), body ink vs surface (**≥ 4.5**), muted ink vs surface (**≥ 4.5**), accent vs surface (**≥ 3.0**, and ≥ 4.5 if used as text), accent ink vs accent (**≥ 4.5**), focus outline vs surface (**≥ 3.0**). Also *report* the shadow-vs-surface ratios (expected 1.2–1.7) explicitly labelled "decorative, not an affordance", so no one mistakes them for compliance.
2. **Affordance.** Assert that every interactive element has at least one non-shadow boundary at ≥ 3:1. Fail the build in `a11yMode: strict` if not.
3. **Focus.** Assert every focusable element resolves an `outline` (not `box-shadow`) at ≥ 3px with `outline-offset` ≥ 3px, and that a `forced-colors` `Highlight` override exists.
4. **Forced colors.** Assert a `@media (forced-colors: active)` block exists and sets a border on every class that had a shadow-only boundary.
5. **Reduced motion.** Assert a `prefers-reduced-motion: reduce` block exists, that it zeroes durations, and — separately — that it does **not** remove any state-carrying property.
6. **Target size.** Assert every generated interactive component has `min-height`/`min-width` ≥ `--nm-target-min` (44px); fail below the 24px SC 2.5.8 floor, warn between 24px and the token.
7. **Same-hue invariant.** Assert each neumorphic element's background token equals its computed parent background token; warn on every violation with the offending selector.
8. **Geometry.** Assert `blur == 2 × distance` and `spread == 0` on every generated shadow.
9. **Performance.** Count neumorphic elements per route; fail above 24, warn above 12. Assert no blur > 40px, and none > 16px inside an element with `overflow: auto|scroll`.
10. **Dark-mode delta.** Assert the dark-mode luminance delta is ≥ 2× the light-mode delta, so the effect does not vanish.
11. **Semantics.** Assert no `div`/`span` received an interactive neumorphic class without `role` + `tabindex` + key handlers; assert every icon-only control has an accessible name.
12. **Fallback.** Assert the cheap fallback block exists and that removing the `@layer neumorphism` sheet leaves a usable, contrast-passing interface.

### Intensity knobs

| Knob | Min | Default | Max | Effect |
|---|---|---|---|---|
| `shadowDelta` (luminance offset of the pair from the surface) | 0.03 | 0.075 | 0.14 light / 0.20 dark | Below 0.03 the extrusion is invisible; above the max it stops being same-hue and reads as a bordered card. |
| `distance` (px, at the `sm` step; blur derives as 2×) | 2 | 5 | 20 | Scales the whole ramp proportionally. Above 12 at `sm` the shadow is bigger than the control. |
| `radius` (px, control) | 6 | 14 | 999 (pill) | Under 6 the shadow pair reads as a rendering artefact. |
| `hairlineOpacity` (0 = pure neumorphism, 1 = fully visible border) | 0.55 | 1.0 | 1.0 | **Floor is 0.55, hard-clamped**, which is the lowest value that still resolves ≥ 3:1 after alpha compositing. The skill will not expose 0. |
| `coverage` (fraction of interactive elements that receive the treatment) | 0.05 | 0.35 | 1.0 | The single most important knob for whether the result ships. Above ~0.6 hierarchy collapses. |

### Anti-patterns the skill must refuse to generate

1. **A shadow-only affordance.** Any interactive element whose sole boundary is the neumorphic pair. Non-negotiable, in every mode.
2. **`box-shadow`-based focus rings.** Refuse and rewrite to `outline`, because WHCM deletes `box-shadow`.
3. **Output with no `forced-colors` block.** Refuse to write files.
4. **A neumorphic surface whose background differs from its parent's.** Refuse and either fix the parent or downgrade the element to a plain soft-shadow card, stating which.
5. **Neumorphic body text, links, table rows, or data cells.** Refuse; these need contrast, not depth.
6. **Neumorphic error, warning or destructive states carried by shadow direction.** Refuse; require colour + icon + text.
7. **Neumorphism on `<a>` elements inside running prose.** Refuse; violates 1.4.1 and link-in-text-block.
8. **Mixed light sources within one document.** Refuse; normalise to the single `lightSource` input and report the overrides.
9. **`shadow-spread > 0`, or `blur / distance` outside [1.5, 3.0].** Refuse and clamp.
10. **Removing state changes under `prefers-reduced-motion`.** Refuse; only durations may be zeroed.
11. **Whole-page neumorphism on a route containing a `<table>`, a virtualised list, or more than 24 interactive elements.** Refuse and offer `scope: controls`.
12. **Pale ink chosen "to match the shadows"** — any text token below 4.5:1. Refuse and re-solve the token.

---

## 14. References

1. **Neumorphism** — https://en.wikipedia.org/wiki/Neumorphism — Wikipedia — accessed 8 August 2026 — [secondary] — origin dates, Huawei Honor Vision (August 2019), macOS Big Sur (12 November 2020), iF Design Award 2020, Red Dot 2021, decline narrative.
2. **Neumorphism in user interfaces** — https://hype4.academy/articles/design/neumorphism-in-user-interfaces — Michał Malewicz, Hype4 (originally UX Collective, December 2019; updated 2021) — [primary] — the naming event (Jason Kelley's "new skeuomorphism" → "Neuomorphism" → Neumorphism), the alexplyuto Dribbble shot, the dual-shadow requirement, the author's own retrospective that the trend did not achieve lasting adoption but revived inner shadows.
3. **Neumorphism will NOT be a huge trend in 2020** — https://uxdesign.cc/neumorphism-will-not-be-a-huge-trend-in-2020-67a8c35e52cc — Michał Malewicz, UX Collective, late 2019 — [primary] — the originator's own early rejection of the style.
4. **Loading: Neumorphism 2** — https://uxdesign.cc/loading-neumorphism-2-2f6534732c32 — Michał Malewicz, UX Collective, April 2020 — [primary] — partial reversal and the case for a restrained, component-scoped version.
5. **Neumorphism and CSS** — https://css-tricks.com/neumorphism-and-css/ — Adrian Bece, CSS-Tricks, 20 March 2020 — [primary] — the canonical implementation reference: four light-source permutations, flat/concave/convex/pressed taxonomy, the `--h1/--v1/--blur1` variable pattern, and the warning against using it on stateful controls.
6. **Neumorphism — the accessible and inclusive way** — https://axesslab.com/neumorphism/ — Hampus Sethfors, Axess Lab, 9 April 2020 — [primary] — the low-vision simulation, the 3:1 (SC 1.4.11) and 4.5:1 (SC 1.4.3) thresholds, and the requirement for explicit interactivity indicators and icon labels.
7. **adamgiebl/neumorphism** — https://github.com/adamgiebl/neumorphism — Adam Giebl, BSD-3-Clause, 6,135 stars, last push 24 October 2025 — [primary] — source of the exact algorithm: `colorLuminance(hex, lum)` per-channel `c + c × lum`, `colorDifference` default 0.15, defaults `#e0e0e0` / size 300 / radius 50 / distance 20 / blur 60, `blur = distance × 2` and `distance = size × 0.1` in the slider handlers, gradient angle 145° with +0.07 / −0.10 stops, shape indices 0=flat 1=pressed 2=concave 3=convex.
8. **Neumorphism/Soft UI CSS shadow generator** — https://neumorphism.io/ — Adam Giebl — accessed 8 August 2026 — [primary] — the live generator whose default output is the most-copied neumorphic snippet.
9. **Understanding Success Criterion 1.4.11: Non-text Contrast** — https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html — W3C Web Accessibility Initiative — [primary] — normative 3:1 requirement for visual information required to identify user interface components and states, the definition of a UI component, adjacent-colour handling, and the inactive-component and essential-graphic exceptions.
10. **@media/forced-colors** — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors — MDN Web Docs, Mozilla — [primary] — the authoritative list: `box-shadow`, `text-shadow` and non-URL `background-image` are forced to `none`; `color`, `background-color`, `border-color`, `outline-color`, `column-rule-color`, `text-decoration-color`, `text-emphasis-color`, `-webkit-tap-highlight-color` and SVG `fill`/`stroke` are overridden with system colours. Includes the border-instead-of-shadow example.
11. **The Guide To Windows High Contrast Mode** — https://www.smashingmagazine.com/2022/06/guide-windows-high-contrast-mode/ — Cristian Díaz, Smashing Magazine, 15 June 2022 — [secondary] — outline is the only reliable focus mechanism in WHCM; the transparent-border technique; why background and box-shadow feedback is lost.
12. **What Is Neumorphism in UI Design? A Complete 2026 Guide** — https://www.bighuman.com/blog/neumorphism — Big Human, 9 December 2025 — [secondary] — 2026 status assessment ("rose quickly, fell just as fast"), macOS Big Sur as the flagship example, Apple's move to glassmorphism.
13. **What Is Neumorphism?** — https://ixdf.org/literature/topics/neumorphism — Interaction Design Foundation, last updated 2 March 2026 — [secondary] — definition, characteristics (large shadow radius, semi-flat muted palette, rounded corners), accessibility criticism, and the "stylistic experiment" status verdict.
14. **costachung/Neumorphic** — https://github.com/costachung/neumorphic — MIT, 988 stars, v2.0.5, iOS 13+/macOS 10.15+, last push 31 October 2024 — [primary] — SwiftUI soft-UI API surface: `.softOuterShadow()`, `.softInnerShadow(_:)`, `.softButtonStyle(_:)`, `.softSwitchToggleStyle()`, press effects `.none/.flat/.hard`.
15. **AKAspanion/ui-neumorphism** — https://github.com/AKAspanion/ui-neumorphism — MIT, 653 stars, npm v1.1.3 published 21 February 2021, last push 17 July 2024 — [primary] — the most complete React neumorphic component library, and evidence of the ecosystem's freeze.
16. **fornewid/neumorphism** — https://github.com/fornewid/neumorphism — Apache-2.0, 1,017 stars, last push 28 May 2026 — [primary] — the Android/Compose reference implementation, self-described as experimental.
17. **junwen-k/tailwindcss-neumorphism-ui** — https://github.com/junwen-k/tailwindcss-neumorphism-ui — MIT, 15 stars, last push 3 August 2026 — [primary] — one of the few neumorphic tooling repos with 2026 activity.
18. **sambeevors/tailwindcss-neumorphism** — https://github.com/sambeevors/tailwindcss-neumorphism — 160 stars, npm v0.1.0 published 10 June 2020, last push 13 February 2024 — [primary] — the original Tailwind plugin, unmaintained; documents why v4 `@theme` is now the right route.
19. **box-shadow — Effects** — https://tailwindcss.com/docs/box-shadow — Tailwind Labs — [primary] — `--shadow-*` and `--inset-shadow-*` theme namespaces generate `shadow-<name>` / `inset-shadow-<name>` utilities in v4; confirms no plugin is needed.
20. **Neumorphism UI Elements in CSS & Tailwind** — https://uiverse.io/ui/neumorphism-ui and https://uiverse.io/elements?tags=neumorphism — Uiverse.io — accessed 8 August 2026 — [primary] — 189+ open-source neumorphic elements; the largest active collection.
21. **Drawing CSS Box Shadows in WebRender** — https://pcwalton.github.io/_posts/2015-12-21-drawing-css-box-shadows-in-webrender.html — Patrick Walton, Mozilla — [primary] — the rendering cost model: triple box blur touches every pixel ~6× on CPU, and each box shadow costs roughly three draw calls plus a shader switch, which is expensive on mobile GPUs.
22. **WWDC 2025: iOS 26, new Liquid Glass design and everything else Apple announced** — https://www.engadget.com/big-tech/wwdc-2025-ios-26-new-liquid-glass-design-and-everything-else-apple-announced-171718769.html — Engadget, 9 June 2025 — [secondary] — Liquid Glass across iOS 26 / iPadOS 26 / macOS Tahoe / watchOS / visionOS / tvOS; the platform-level move to translucent depth rather than extruded depth.
23. **Neumorphism: Its Origin Story & Influence on the UI Design World** — https://www.svgator.com/blog/neumorphism-origin-influence-design/ — SVGator — [secondary] — corroborates the December 2019 Plyuto Dribbble shot and the comment-thread naming.
24. **Understanding Success Criterion 1.4.3: Contrast (Minimum)** — https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html — W3C WAI — [primary] — the 4.5:1 / 3:1 text thresholds used in every contrast calculation in §4 and §7.
