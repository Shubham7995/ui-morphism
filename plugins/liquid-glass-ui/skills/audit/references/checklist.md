# Liquid Glass audit checklist

Source of truth: `docs/08-liquid-glass.md` §13 "Validation checklist the skill self-runs",
extended with §7's pass/fail list, §8's budgets and §6's animatable set. Run in this order.

Each item is tagged with who runs it:

- **[core]** — `ui-morphism-core:a11y-validate`. One implementation, ten callers. Never
  reimplement any of these, and in particular never write a contrast function here.
- **[scan]** — `../../apply/scripts/lg-scan.mjs`. Mechanical, static, style-specific.
- **[map]** — `../../apply/scripts/displacement-map.mjs`. Geometry and asset budget.
- **[read]** — a human or model judgement over the source. Not automatable.
- **[eye]** — requires a rendered browser or device. Report as a manual TODO with the exact
  procedure, never as a pass.

---

## A. The §13 self-run checklist, item for item

| # | Check | Who | Threshold |
|---|---|---|---|
| A1 | Every glass surface's computed fill alpha | [read] resolution, [core] consequence | ≥ 0.55, and ≥ 0.62 when `backdropControl: arbitrary` |
| A2 | Foreground text contrast against the composite at backdrop luminance 0 **and** 255 | [core] | ≥ 4.5:1, or ≥ 7:1 at `a11yTarget: AAA`; unrounded, so 2.999:1 fails 3:1 |
| A3 | Non-text boundary contrast, or an opaque inner fill | [core] | ≥ 3:1 |
| A4 | Every interactive descendant has a focus-visible rule with at least two contrasting rings | [core] | ≥ 3px total ring |
| A5 | Every control sizes from `--lg-target-min` (44px) rather than a literal | [core] | fail below 24×24, warn below 44 |
| A6 | `@media (prefers-reduced-transparency: reduce)` block exists | [scan] | blur 0, alpha ≥ 0.95, refraction 0 |
| A7 | `@media (prefers-reduced-motion: reduce)` block exists | [scan] | cancels every sweep, morph and press transform |
| A8 | `@media (forced-colors: active)` block exists | [scan] presence, [core] keywords | system colours, decorative layers hidden, **both** filter spellings nulled |
| A9 | `@supports not (backdrop-filter: blur(1px))` fallback exists | [scan] | alpha ≥ 0.94 |
| A10 | Glass surface count per route; total glass area | [scan] census, [read] per-route composition | ≤ 3 surfaces (≤ 2 mobile); ≤ 25% of a 1440×900 viewport |
| A11 | **No nested glass — a glass element with a glass ancestor** | [scan] candidates, [read] ancestry | zero confirmed. **Hard fail, not a budget** |
| A12 | No `transition` or `animation` targets `backdrop-filter`, `filter`, `border-radius` or SVG filter geometry | [scan] | zero |
| A13 | Decorative layers carry `aria-hidden="true"` and `pointer-events: none`; inline filter `<svg>`s carry `aria-hidden="true" focusable="false"` | [scan] | all |
| A14 | Displacement maps ≤ 8KB each and inlined, never fetched | [map] size, [scan] `feImage` href | 8KB, `data:` only |
| A15 | SwiftUI: sibling `.glassEffect` views share a `GlassEffectContainer`; `.clear` is accompanied by a dimming layer | [read] | all |

## B. The §7 accessibility list

| # | Check | Who | Note |
|---|---|---|---|
| B1 | Body text contrast over the darkest **and** brightest possible backdrop | [core] | ≥ 4.5:1 in both extremes. The single most important row in the report |
| B2 | Large text and icons under the same worst case | [core] | ≥ 3:1 in both extremes |
| B3 | Control boundary perceivable (1.4.11) | [core] | ≥ 3:1 rim, or an opaque inner fill. The 1px `rgba(255,255,255,0.45)` rim almost never reaches it against an arbitrary backdrop, and icon-only glass buttons fail the same way |
| B4 | Focus indicator visible over black, over white and over a saturated photo | [core] presence, [eye] verification | ≥ 3:1, ≥ 2px thick, three concentric rings |
| B5 | Target size | [core] | ≥ 24×24px floor, 44×44px the working minimum — including capsules inside a merged glass bar, which §7 records rendering at 32-36px |
| B6 | No focusable element obscured by a sticky glass bar (2.4.11) | [read] | `scroll-margin-top` equal to the bar's height. Partly visible *through* the bar does not satisfy the criterion |
| B7 | `prefers-reduced-transparency: reduce` | [scan] | fill ≥ 0.95, blur 0, refraction 0 |
| B8 | `prefers-contrast: more` fallback present | [scan] + [read] | It is what reaches Safari users, who have no reduced-transparency query at all |
| B9 | `forced-colors: active` | [scan] + [core] | Opaque, system colours, decorative layers hidden. The UA overrides colour but **not** `backdrop-filter` |
| B10 | `prefers-reduced-motion: reduce` | [scan] + [read] | Durations to 1ms rather than deleted; loading indicator static and still visible |
| B11 | In-app transparency toggle exists | [scan] | Safari does not implement the media query, and Apple's own users are the likeliest to have Reduce Transparency on |
| B12 | No `backdrop-filter` support | [scan] | Solid fallback ≥ 0.94 opacity |
| B13 | Zoom to 400% and reflow at 320px | [eye] | No clipped or overlapped glass chrome. Deeply nested containers with `contain: paint` clip content at 320px |
| B14 | Text spacing at increased line-height does not clip (1.4.12) | [eye] | Glass chrome is tightly packed; user stylesheets push content out of the lensed rim. Use `min-height`, never fixed `height` |
| B15 | Text over glass weight and size | [read] | ≥ 500 weight at ≤ 17px; never 300/400 body text on any translucent surface |
| B16 | No information conveyed by transparency, blur, the specular sweep or shadow alone | [core] | The sweep is decoration and must never be the only signal for loading, focus or selection |
| B17 | Merged or morphing glass groups keep accessible name, role and focus order through the morph | [read] | Do not remove a button from the DOM mid-morph |
| B18 | Floating chrome is in DOM order matching visual order, or inside a landmark | [read] | It is usually appended late for stacking reasons and appears at the top of the screen |
| B19 | Screen reader pass with visual order matching DOM order | [eye] | VoiceOver and NVDA |
| B20 | Apple platforms: `accessibilityReduceTransparency` and `accessibilityReduceMotion` read **separately** | [read] | Separate settings; users commonly enable only one |

## C. The ladder — this style's own structural matrix

| # | Check | Who | Threshold |
|---|---|---|---|
| C1 | Tier 2 sits inside `@supports (backdrop-filter: url(#…))` | [scan] | exact. An ungated `url()` costs Safari and Firefox the blur as well as the lens |
| C2 | Tier 1 stands up on its own — blur, saturate, border, rim, shadow | [read] | It is what most users see |
| C3 | Tier 0 exists and is opaque | [scan] | ≥ 0.94 |
| C4 | `-webkit-backdrop-filter` present on every declaration, **including the ones that null it** | [scan] | exact |
| C5 | Tier branching uses `@supports` / `CSS.supports`, never a user-agent string | [scan] | zero UA branches |
| C6 | Device-capability gate present | [scan] | `hardwareConcurrency <= 4` or `deviceMemory <= 4` drops a tier |
| C7 | `@media print` renders every glass surface opaque | [read] | `backdrop-filter` does not exist in print, email HTML or PDF export |
| C8 | Refraction disabled below a size threshold | [read] | A 32px chip does not read as a lens and pays full cost |

## D. Performance budgets (§8)

| # | Budget | Limit | Who |
|---|---|---|---|
| D1 | Glass surfaces simultaneously in viewport | ≤ 3, ≤ 2 mobile | [scan] + [read] |
| D2 | Total glass area | ≤ 25% of viewport | [read] |
| D3 | Refracting (SVG-filtered) surfaces | ≤ 1 | [scan] |
| D4 | Blur radius | ≤ 24px | [scan] |
| D5 | Frame time contribution from glass | ≤ 4ms on a mid-tier device | [eye] |
| D6 | Displacement map asset | ≤ 8KB each, inlined | [map] |
| D7 | INP regression vs. the opaque baseline | ≤ 20ms | [eye] |
| D8 | GPU texture estimate | Reported, not capped. Height is what costs: three 1170×88 bars are ≈ 1.2 MiB together, one 1170×2532 sheet is 11.3 MiB | [read] |
| D9 | `will-change: backdrop-filter` only on surfaces that actually animate, removed when they stop | [scan] | zero permanent |
| D10 | Filter region as tight as the effect allows | [map] | Compare against the flat 140% box, in both directions |

## E. Style-fidelity checks

These are not compliance findings. Report them as Notes.

| # | Check | Who |
|---|---|---|
| E1 | Every `blur()` paired with `saturate()` in the 160-190% band — below 140% the material reads as fog | [scan] + [read] |
| E2 | Refraction `scale` inside doc §3's 30-70 band for a control of that height | [read] |
| E3 | The lensed rim band is 8-24px wide — narrower reads as a bright line, wider warps the whole surface | [map] |
| E4 | Chromatic fringing present, or its absence acknowledged. It is absent in most web clones and is the main tell | [read] |
| E5 | Fill and blur differ across the three elevation rungs rather than one value everywhere | [read] |
| E6 | Controls are capsules; container radii are concentric with the window or device corner | [read] |
| E7 | Shadow is one ambient layer plus one contact layer — not a Material elevation ladder | [read] |
| E8 | Glass occupies exactly one layer of the z-stack: chrome, never content | [read] |
| E9 | The content layer beneath the glass is flat and opaque | [read] |
| E10 | The backdrop is something worth refracting — a mesh gradient, artwork, video — with a luminance band under roughly 25 points | [read] |

## F. Things that are refusals, not findings

If the audit turns these up, the recommendation is to remove the glass rather than tune it.
Full list with alternatives in `../../apply/references/anti-patterns.md`.

- Glass on `<body>`, `<main>`, a scroll container, a `<table>`, or a chart or canvas wrapper
- Nested glass at any depth
- A Clear surface with no scrim, and white text on one
- A fill below 0.55, or below 0.62 on a backdrop the project does not control
- A displacement map fetched from a URL inside `feImage`
- A user's `prefers-reduced-transparency` or `prefers-reduced-motion` overridden from inside
  the page
- Text-dense, regulated, outdoor, low-end-Android or print-first products — §9 contexts
  where the answer is "not this style" rather than "this style, tuned down"

## G. The three manual TODOs that always appear

None is computable from source text. Report them with this exact procedure rather than
marking them pass.

1. **Screenshot the composited pixels at three scroll positions and sample them.** Use a
   deliberately hostile backdrop — a high-contrast checkerboard photo — not the project's
   hand-picked marketing gradient. Pick the position where the brightest part of the
   backdrop sits behind body text; that is the number that matters and the one no static
   tool can produce.
2. **Verify the triple-ring focus indicator over black, over white and over a saturated
   photo.** The accent ring survives some backdrops, the dark halo survives light ones, the
   light halo survives dark ones. Confirm at least one is visible in all three.
3. **Measure frame time on a mid-tier device through a 1000px scroll with the chrome
   pinned.** A 20px blur over a full-width 88px toolbar is already 3-6ms per frame on a 2022
   mid-range Android before the displacement pass; this is the measurement that says whether
   the lens is affordable for this product's actual users.
