---
name: liquid-glass
title: Liquid Glass
aliases: [Apple Liquid Glass, iOS 26 glass, lensing glass, refractive glass, glassmorphism 2.0, liquid glass UI]
category: ui-morphism
origin_year: 2025
peak_years: 2025-2027
status_2026: dominant
difficulty: high
a11y_risk: high
perf_cost: high
plugin_slug: liquid-glass-ui
last_researched: 2026-08-08
---

## 1. Essence

Liquid Glass is Apple's system-wide material, announced at WWDC 2025 and shipped across all six platforms — iOS 26, iPadOS 26, macOS Tahoe 26, watchOS 26, tvOS 26 and visionOS 26 — on 15 September 2025. Unlike frosted-glass blur, it treats a control as a physical lens: it *refracts* the backdrop (bending pixels through a simulated curved edge), throws a real-time specular highlight along its rim, adapts its tint to whatever passes underneath, and merges fluidly with neighbouring glass elements when they approach each other. The feeling is of a small piece of physical glass floating a millimetre above your content — cool, expensive, and slightly unnerving. The single defining move is **edge lensing**: the backdrop visibly warps and compresses in a 12-24px band at the element's border, while the centre stays comparatively clear.

**The taxonomy, stated identically in docs 01, 02, 03 and 08 of this set: Liquid Glass is glassmorphism plus displacement, specular tracking and adaptive tint. It is a superset, not a rebrand; a blur-only implementation is glassmorphism.** That is why "glassmorphism 2.0" stays in this doc's frontmatter aliases — it is the same lineage, one generation on — and it is also why the distinction is load-bearing for implementation: glassmorphism ([./03-glassmorphism.md](./03-glassmorphism.md)) is `backdrop-filter: blur()` plus a translucent fill, whereas Liquid Glass adds a displacement map. Ship the blur without the displacement and what you have built is glassmorphism; that is a perfectly good thing to build, and doc 03 is the better guide to building it.

## 2. Origin & Timeline

- **2007-2013 — prehistory.** Aqua (Mac OS X, 2000) and iOS 7's frosted sheets (2013) establish Apple's translucency vocabulary. iOS 7's move from skeuomorphism to flat is the last comparable system-wide redesign before 2025.
- **2020-2021 — glassmorphism.** Michal Malewicz coins/popularises "glassmorphism"; Windows 11 Mica/Acrylic and macOS Big Sur ship blur-based materials. This is the shallow ancestor — the same lineage without displacement, specular tracking or adaptive tint.
- **5 June 2023 — Apple announces Vision Pro and visionOS**, whose window model is glass that samples and refracts the passthrough environment. Craig Federighi later confirms visionOS is the direct inspiration for Liquid Glass.
- **2 February 2024 — Vision Pro ships** in the US at $3,499. Announcement and shipment are eight months apart and this doc previously ran them together; [./10-spatial-ui.md](./10-spatial-ui.md) §2 carries the same two dates.
- **9 June 2025 — WWDC 2025 keynote.** Apple announces Liquid Glass as a unified design language for every OS. Federighi describes it as a "digital meta-material" and says Apple's industrial design team fabricated physical glass of varying opacity and lensing properties to match the simulation. Sessions "Meet Liquid Glass" (WWDC25 219) and "Get to know the new design system" (WWDC25 356) define the two variants — **Regular** and **Clear** — plus the three optical layers (highlight, shadow, illumination).
- **June-July 2025 — immediate backlash.** Designers and accessibility advocates report unreadable toolbars over photos and in direct sunlight. Apple begins walking it back inside the beta cycle: **iOS 26 beta 2** (late June 2025) adds heavier blur and a darker Control Center backing; **beta 4** (22 July 2025) increases opacity on navigation bars and overlays.
- **15 September 2025 — general availability.** iOS 26, iPadOS 26, macOS Tahoe 26, watchOS 26, tvOS 26 and visionOS 26 ship. Apple's version-numbering switches to year-based (26 = the 2025-2026 cycle). Xcode 26 recompiles apps into the new design automatically; `UIDesignRequiresCompatibility = YES` in Info.plist is the only opt-out, and Apple states it will be removed in the next major Xcode release.
- **20 October 2025 — iOS 26.1 beta 4.** Apple tests a user-facing **Tinted** option.
- **3 November 2025 — iOS 26.1 ships.** *Settings > Display & Brightness > Liquid Glass* offers **Clear** (original) and **Tinted** (higher opacity, more contrast). This is a genuine reversal: Apple almost never ships a toggle for a design decision.
- **6 November 2025 — third-party gallery.** Apple publishes/expands the New Design Gallery at `developer.apple.com/design/new-design-gallery/` with iOS 18 vs iOS 26 side-by-sides for Crumbl, Linearity, Tide Guide, Lumy, Sky Guide, OmniFocus 4, Photoroom, CNN, American Airlines, Lowe's, LTK and others.
- **December 2025 — the American Foundation for the Blind publishes an open letter to Apple** about iOS 26 legibility. Reddit accessibility threads accumulate tens of thousands of upvotes.
- **2025-2026 — the web clone wave.** Dozens of CSS/SVG reimplementations appear: kube.io's physically-derived displacement-map article, `rdev/liquid-glass-react`, `nikdelvin/liquid-glass`, `callstack/liquid-glass` (React Native), `glincker/glinui` (Radix + Tailwind), Ein UI, plus generator sites. Figma ships a **native glass effect** in July 2025, removing the need for plugins.
> **Sourcing note for the 2026 entries.** Each 2026 bullet below now carries its §14 reference number inline. Every one of them is sourced to a **secondary** outlet — trade press or a single blog — so treat the precise dates as reported rather than confirmed, and follow the reference before quoting one onward. Two specifics that had *no* source at all have been removed outright: the "Golden Gate" codename for macOS 27, and WebKit bug #245510. The 2025 entries are on firmer ground: WWDC 2025, the 15 September GA, the 26.1 Tinted toggle and the AFB open letter are all corroborated in §14.

- **13 February 2026 — Instagram** rolls out a Liquid Glass navigation bar on iOS to a subset of users; WhatsApp is still on the old chrome at that point (ref 21, secondary). A staged rollout is inherently hard to date — treat the day as approximate.
- **6 May 2026 — Google says no.** Sameer Samat rules out a Liquid Glass-style redesign for Android 17, with Google continuing to evolve **Material 3 Expressive** instead — which does expand blur/translucency in menus, sliders and quick settings, but rejects refraction (ref 15, secondary). This ran against widespread "Android is copying Liquid Glass" rumours.
- **14 May 2026 — ADC award.** Liquid Glass / iOS 26 takes a **Gold Cube** at the Art Directors Club of New York awards in the Interactive/UX/UI category, while forum reaction stays hostile (ref 14, secondary). Both things are true at once.
- **8-12 June 2026 — WWDC 2026.** Apple Newsroom (23 March 2026) put the conference at Monday 8 June to Friday 12 June, keynote and first developer betas on 8 June; docs 01, 08 and 10 all use that span. iOS 27, iPadOS 27, macOS 27, watchOS 27, tvOS 27 and visionOS 27 are announced (refs 12, 13, 20). Apple **lowers default transparency**, adds a **user-facing opacity slider** (a continuous control replacing the binary Clear/Tinted toggle), tightens window corner radii on macOS, restores colour to active sidebars, stretches sidebars edge-to-edge, and refreshes first-party icons for recognisability. Public beta July 2026, GA expected mid-September 2026.
- **25 June 2026 — standards activity.** W3C SVG WG issue #1142 asks for an interoperable definition of backdrop displacement/refraction for "liquid glass" UI (ref 4). Still at discussion/triage with no browser positions recorded — check the live thread, since that is the single thing that would change the portability picture below.
- **August 2026 — where it stands.** Liquid Glass is **dominant**, not because it is loved but because it is the default rendering of every recompiled Apple app and the opt-out is on a removal schedule. On the web it is **mainstream as an accent** and still not interoperable.

**The one claim to verify before you build on this doc.** The entire Tier-2 recipe in §5 rests on `backdrop-filter: url(#filter)` — an SVG filter used as a backdrop-filter value — being **Chromium-only**, with Safari and Firefox supporting only the keyword filter functions (`blur()`, `saturate()`, and friends). That is the state of play as of this writing and it is why §5 wraps the refraction utility in `@supports (backdrop-filter: url(#lg-refract))` and ships a blur-only Tier 1 underneath. It is also the least well-sourced load-bearing claim in this doc, so confirm it yourself before shipping: check `caniuse.com/css-backdrop-filter` for the **`url()` value specifically** (the headline percentage covers the keyword functions, not this), read the WPT results for `filter-effects`, and run the `@supports` test above in each engine. If a second engine has shipped it since, Tier 2 stops being a Chromium-only enhancement and the fallback ladder in §5 can be collapsed. If you cannot confirm it, ship Tier 1 — a blur-only implementation is glassmorphism, which is a supported, interoperable thing to be.

Not dead, not dormant, and not a fad you can wait out on Apple platforms. On the web it is a decorative accent with a hard portability ceiling.

## 3. Visual DNA

- **Edge lensing (non-negotiable)** — the backdrop is displaced, not just blurred, in a rim band roughly 8-24px wide. Displacement magnitude peaks at the border and decays to zero by ~40% of the way inward. In SVG terms, `feDisplacementMap` with `scale` between 30 and 70 for a 56px-tall control.
- **Squircle surface profile** — Apple's lens curve is closer to a convex *squircle*, `y = ⁴√(1 - (1-x)⁴)`, than a circle. It produces a gentler shoulder and a harder terminal edge than a spherical dome. Corner geometry is continuous-curvature, not `border-radius` arcs.
- **Specular rim highlight** — a 1-2px bright arc along the upper-left (light source at roughly 135°), `rgba(255,255,255,0.55-0.90)`, blurred by ~1px, fading to near zero on the opposite rim. Position tracks device tilt on iOS; on the web it tracks pointer position or stays fixed.
- **Two variants.** **Regular** is the adaptive default: it works over any content, at any size, with anything layered on top, and needs no dimming layer. **Clear** is permanently more transparent and requires a dimming scrim beneath it; Apple restricts it to three conditions met simultaneously — media-rich content behind, a content layer that tolerates dimming, and bold/bright content on top.
- **Chromatic fringing** — a subtle per-channel offset (±0.5-1.5px between R and B displacement) at the rim, mimicking dispersion. Absent in most web clones; its absence is the main "tell".
- **Adaptive tint** — the surface samples average backdrop luminance and flips its own fill between a light tint and a dark tint, plus flips foreground text colour with it. This is a runtime behaviour, not a static token.
- **Saturation boost** — `saturate(160-190%)` on the sampled backdrop so refracted colour reads as glass rather than fog. LogRocket's SVG recipe pushes `feColorMatrix type="saturate"` far higher (values up to 50) but masks it to the rim only.
- **Shadow separation, not elevation stacks** — a single soft ambient shadow, typically `0 8px 32px rgba(0,0,0,0.12)` plus a tight `0 1px 2px rgba(0,0,0,0.10)`. No multi-step Material elevation ladder.
- **Capsule and concentric geometry** — controls are capsules (`border-radius: 999px`); containers use radii concentric with the device/window corner. On macOS 27 Apple *reduced* window corner radius after complaints that the 26 radii were cartoonish.
- **Fluid merge / morph** — two glass elements approaching each other blend like mercury droplets and separate again. In SwiftUI this is `GlassEffectContainer` + `glassEffectID`. There is no CSS equivalent; the closest is an SVG gooey filter (`feGaussianBlur` + `feColorMatrix` alpha contrast).
- **Content-layer separation** — chrome is glass, content is opaque. Apple's own guidance is that only floating chrome (toolbars, tab bars, sidebars, sheets, alerts, controls) is glass; never body content.
- **Opacity floor** — iOS 26 shipped with an effective material opacity floor around 40%; iOS 27 raises the default floor to roughly 60% and exposes a user slider on top of it.

## 4. Anatomy & Design Tokens

| Token group | Token | Light value | Dark value | Notes |
|---|---|---|---|---|
| Surface fill | `--lg-fill` | `rgba(255,255,255,0.62)` | `rgba(28,28,30,0.58)` | 0.62 ≈ the iOS 27 default floor; iOS 26 shipped ~0.40 |
| Surface fill (clear) | `--lg-fill-clear` | `rgba(255,255,255,0.28)` | `rgba(28,28,30,0.26)` | Requires a scrim below |
| Scrim (for Clear) | `--lg-scrim` | `rgba(0,0,0,0.22)` | `rgba(0,0,0,0.34)` | Mandatory under Clear |
| Tint overlay | `--lg-tint` | `rgba(120,180,255,0.10)` | `rgba(120,180,255,0.08)` | Optional brand tint, keep ≤0.12 |
| Blur | `--lg-blur` | `20px` | `24px` | Backdrop gaussian; range 12-28px |
| Saturation | `--lg-sat` | `180%` | `160%` | Below 140% reads as fog |
| Brightness | `--lg-bright` | `108%` | `96%` | Compensates for blur's luminance flattening |
| Backdrop (composite) | `--lg-backdrop` | `blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright))` | same | Re-resolves per element, so re-pointing `--lg-blur` locally moves the whole filter |
| Refraction | `--lg-refract-scale` | `48` | `48` | `feDisplacementMap` scale, px; range 0-72 |
| Refraction band | `--lg-refract-band` | `16px` | `16px` | Width of the lensed rim |
| Rim highlight | `--lg-rim` | `rgba(255,255,255,0.85)` | `rgba(255,255,255,0.55)` | Upper-left arc |
| Rim shadow | `--lg-rim-dark` | `rgba(255,255,255,0.18)` | `rgba(255,255,255,0.10)` | Lower-right arc |
| Border | `--lg-border` | `1px solid rgba(255,255,255,0.45)` | `1px solid rgba(255,255,255,0.16)` | Never the only affordance |
| Radius (control) | `--lg-radius-control` | `999px` | `999px` | Capsule |
| Radius (card) | `--lg-radius-card` | `26px` | `26px` | Concentric with 12px inner padding |
| Radius (sheet) | `--lg-radius-sheet` | `38px` | `38px` | Matches iPhone display corner |
| Target | `--lg-target-min` | `44px` | `44px` | Minimum hit area on every control. 24px is the SC 2.5.8 floor but it assumes the user can *see* where the target ends; here `--lg-border` at 0.45 alpha rarely clears 3:1 (§7, 1.4.11), so the edge is often invisible and aiming is imprecise. 44px is also the Apple HIG value this style descends from, and the figure §5 and §7 already use |
| Shadow (ambient) | `--lg-shadow-ambient` | `0 8px 32px rgba(0,0,0,0.12)` | `0 8px 32px rgba(0,0,0,0.44)` | Single layer |
| Shadow (contact) | `--lg-shadow-contact` | `0 1px 2px rgba(0,0,0,0.10)` | `0 1px 2px rgba(0,0,0,0.30)` | Keeps edges from floating |
| Inner light | `--lg-inset` | `inset 0 1px 0 rgba(255,255,255,0.60)` | `inset 0 1px 0 rgba(255,255,255,0.22)` | Top bevel |
| Text primary | `--lg-fg` | `#1C1C1E` | `#F2F2F7` | 10.6:1 over the default fill composite |
| Text secondary | `--lg-fg-2` | `rgba(28,28,30,0.62)` | `rgba(242,242,247,0.66)` | Secondary only; verify per surface |
| Accent | `--lg-accent` | `#0A84FF` | `#0A84FF` | The single accent; system blue |
| Elevation 1 (fill) | `--lg-elev-1-fill` | `rgba(255,255,255,0.62)` | `rgba(28,28,30,0.58)` | Toolbars, tab bars. Rung 1 is the default — same value as `--lg-fill` |
| Elevation 1 (blur) | `--lg-elev-1-blur` | `20px` | `24px` | Same value as `--lg-blur` |
| Elevation 2 (fill) | `--lg-elev-2-fill` | `rgba(255,255,255,0.72)` | `rgba(28,28,30,0.68)` | Sheets, popovers |
| Elevation 2 (blur) | `--lg-elev-2-blur` | `24px` | `28px` | Sheets, popovers |
| Elevation 3 (fill) | `--lg-elev-3-fill` | `rgba(255,255,255,0.86)` | `rgba(28,28,30,0.82)` | Alerts, menus — nearly opaque |
| Elevation 3 (blur) | `--lg-elev-3-blur` | `28px` | `30px` | Alerts, menus |
| Type scale | `--lg-text-xs` `--lg-text-sm` `--lg-text-md` `--lg-text-lg` `--lg-text-xl` `--lg-text-2xl` | 13 / 15 / 17 / 20 / 28 / 34px | same | iOS-derived; 17px body minimum on glass |
| Type weight | `--lg-weight-on-glass` | `600` | same | 500-600 on glass; never 300/400 body text on glass |
| Spacing | `--lg-space-1` `--lg-space-2` `--lg-space-3` `--lg-space-4` `--lg-space-5` `--lg-space-6` | 4 / 8 / 12 / 16 / 24 / 32px | same | 12px min inset from lensed rim |
| Motion (state) | `--lg-dur-state` | `180ms` | same | Hover/active |
| Motion (morph) | `--lg-dur-morph` | `320ms` | same | Merge/split, sheet present |
| Motion (settle) | `--lg-dur-settle` | `520ms` | same | Liquid overshoot |
| Easing | `--lg-ease` | `cubic-bezier(0.32, 0.72, 0, 1)` | same | Apple-sheet-like decelerate |
| Easing (spring) | `--lg-ease-spring` | `linear(0, 0.35, 0.86, 1.04, 1.01, 1)` | same | Approximates a 0.8-damping spring |

```css
:root {
  /* ---- surface ---- */
  --lg-fill:            rgba(255, 255, 255, 0.62);
  --lg-fill-clear:      rgba(255, 255, 255, 0.28);
  --lg-scrim:           rgba(0, 0, 0, 0.22);
  --lg-tint:            rgba(120, 180, 255, 0.10);

  /* ---- optics ---- */
  --lg-blur:            20px;
  --lg-sat:             180%;
  --lg-bright:          108%;
  --lg-refract-scale:   48;      /* unitless: feDisplacementMap scale */
  --lg-refract-band:    16px;
  --lg-backdrop:        blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright));

  /* ---- elevation rungs ----
     There is no shadow ladder in this style (§3): elevation is carried by the
     material itself, so each rung is a fill + a blur, not a box-shadow step.
     Rung 1 IS the default pair above. To raise a surface, re-point the two
     base tokens locally — `--lg-backdrop` is substituted per element, so it
     picks the new blur up automatically:
       .lg-sheet { --lg-fill: var(--lg-elev-2-fill);
                   --lg-blur: var(--lg-elev-2-blur); }  */
  --lg-elev-1-fill:     rgba(255, 255, 255, 0.62);
  --lg-elev-1-blur:     20px;
  --lg-elev-2-fill:     rgba(255, 255, 255, 0.72);
  --lg-elev-2-blur:     24px;
  --lg-elev-3-fill:     rgba(255, 255, 255, 0.86);
  --lg-elev-3-blur:     28px;

  /* ---- edges ---- */
  --lg-rim:             rgba(255, 255, 255, 0.85);
  --lg-rim-dark:        rgba(255, 255, 255, 0.18);
  --lg-border:          rgba(255, 255, 255, 0.45);
  --lg-inset:           inset 0 1px 0 rgba(255, 255, 255, 0.60);

  /* ---- geometry ---- */
  --lg-radius-control:  999px;
  --lg-radius-card:     26px;
  --lg-radius-sheet:    38px;

  /* ---- targets ---- */
  /* SC 2.5.8's floor is 24px, but that floor presumes a perceivable boundary.
     The glass rim is frequently under 3:1 against its backdrop, so the user is
     aiming at an edge they cannot see — 44px (the Apple HIG value) is the
     working minimum for every capsule, icon button and merged-bar segment. */
  --lg-target-min:      44px;

  /* ---- depth ---- */
  --lg-shadow-ambient:  0 8px 32px rgba(0, 0, 0, 0.12);
  --lg-shadow-contact:  0 1px 2px rgba(0, 0, 0, 0.10);

  /* ---- foreground ---- */
  --lg-fg:              #1C1C1E;
  --lg-fg-2:            rgba(28, 28, 30, 0.62);
  --lg-accent:          #0A84FF;

  /* ---- type ---- */
  --lg-text-xs:  13px;
  --lg-text-sm:  15px;
  --lg-text-md:  17px;
  --lg-text-lg:  20px;
  --lg-text-xl:  28px;
  --lg-text-2xl: 34px;
  --lg-weight-on-glass: 600;

  /* ---- space ---- */
  --lg-space-1: 4px;
  --lg-space-2: 8px;
  --lg-space-3: 12px;
  --lg-space-4: 16px;
  --lg-space-5: 24px;
  --lg-space-6: 32px;

  /* ---- motion ---- */
  --lg-dur-state:  180ms;
  --lg-dur-morph:  320ms;
  --lg-dur-settle: 520ms;
  --lg-ease:        cubic-bezier(0.32, 0.72, 0, 1);
  --lg-ease-spring: linear(0, 0.35, 0.86, 1.04, 1.01, 1);
}

/* Light values live on bare `:root` above. Dark is written twice: once guarded
   so it cannot beat an explicit `data-theme="light"`, and once under
   `:root[data-theme="dark"]` so a manual toggle beats the OS preference.
   Same shape as docs 01, 02, 04, 05, 06, 07, 09 and 10. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --lg-fill:           rgba(28, 28, 30, 0.58);
    --lg-fill-clear:     rgba(28, 28, 30, 0.26);
    --lg-scrim:          rgba(0, 0, 0, 0.34);
    --lg-tint:           rgba(120, 180, 255, 0.08);
    --lg-blur:           24px;
    --lg-sat:            160%;
    --lg-bright:         96%;
    --lg-elev-1-fill:    rgba(28, 28, 30, 0.58);
    --lg-elev-1-blur:    24px;
    --lg-elev-2-fill:    rgba(28, 28, 30, 0.68);
    --lg-elev-2-blur:    28px;
    --lg-elev-3-fill:    rgba(28, 28, 30, 0.82);
    --lg-elev-3-blur:    30px;
    --lg-rim:            rgba(255, 255, 255, 0.55);
    --lg-rim-dark:       rgba(255, 255, 255, 0.10);
    --lg-border:         rgba(255, 255, 255, 0.16);
    --lg-inset:          inset 0 1px 0 rgba(255, 255, 255, 0.22);
    --lg-shadow-ambient: 0 8px 32px rgba(0, 0, 0, 0.44);
    --lg-shadow-contact: 0 1px 2px rgba(0, 0, 0, 0.30);
    --lg-fg:             #F2F2F7;
    --lg-fg-2:           rgba(242, 242, 247, 0.66);
    --lg-accent:         #0A84FF;
  }
}

/* Explicit opt-in override, so a toggle beats the media query both ways. */
:root[data-theme="dark"] {
  color-scheme: dark;
  --lg-fill:           rgba(28, 28, 30, 0.58);
  --lg-fill-clear:     rgba(28, 28, 30, 0.26);
  --lg-scrim:          rgba(0, 0, 0, 0.34);
  --lg-tint:           rgba(120, 180, 255, 0.08);
  --lg-blur:           24px;
  --lg-sat:            160%;
  --lg-bright:         96%;
  --lg-elev-1-fill:    rgba(28, 28, 30, 0.58);
  --lg-elev-1-blur:    24px;
  --lg-elev-2-fill:    rgba(28, 28, 30, 0.68);
  --lg-elev-2-blur:    28px;
  --lg-elev-3-fill:    rgba(28, 28, 30, 0.82);
  --lg-elev-3-blur:    30px;
  --lg-rim:            rgba(255, 255, 255, 0.55);
  --lg-rim-dark:       rgba(255, 255, 255, 0.10);
  --lg-border:         rgba(255, 255, 255, 0.16);
  --lg-inset:          inset 0 1px 0 rgba(255, 255, 255, 0.22);
  --lg-shadow-ambient: 0 8px 32px rgba(0, 0, 0, 0.44);
  --lg-shadow-contact: 0 1px 2px rgba(0, 0, 0, 0.30);
  --lg-fg:             #F2F2F7;
  --lg-fg-2:           rgba(242, 242, 247, 0.66);
  --lg-accent:         #0A84FF;
}
:root[data-theme="light"] { color-scheme: light; }

/* User/OS legibility overrides — treat as mandatory, not optional.
   These come AFTER the theme blocks so they win in both themes. */
@media (prefers-reduced-transparency: reduce) {
  :root {
    --lg-fill:        rgba(246, 246, 248, 0.98);
    --lg-fill-clear:  rgba(246, 246, 248, 0.98);
    --lg-blur:        0px;
    --lg-sat:         100%;
    --lg-bright:      100%;
    --lg-refract-scale: 0;
    /* Flatten the rungs too, or a surface that re-points --lg-fill/--lg-blur
       at rung 2 or 3 walks straight back through this override. */
    --lg-elev-1-fill: rgba(246, 246, 248, 0.98);
    --lg-elev-2-fill: rgba(246, 246, 248, 0.98);
    --lg-elev-3-fill: rgba(246, 246, 248, 0.98);
    --lg-elev-1-blur: 0px;
    --lg-elev-2-blur: 0px;
    --lg-elev-3-blur: 0px;
  }
  :root[data-theme="dark"] {
    --lg-fill: rgba(24, 24, 26, 0.98);
    --lg-fill-clear: rgba(24, 24, 26, 0.98);
    --lg-elev-1-fill: rgba(24, 24, 26, 0.98);
    --lg-elev-2-fill: rgba(24, 24, 26, 0.98);
    --lg-elev-3-fill: rgba(24, 24, 26, 0.98);
  }
}
@media (prefers-color-scheme: dark) and (prefers-reduced-transparency: reduce) {
  :root:not([data-theme="light"]) {
    --lg-fill: rgba(24, 24, 26, 0.98);
    --lg-fill-clear: rgba(24, 24, 26, 0.98);
    --lg-elev-1-fill: rgba(24, 24, 26, 0.98);
    --lg-elev-2-fill: rgba(24, 24, 26, 0.98);
    --lg-elev-3-fill: rgba(24, 24, 26, 0.98);
  }
}
@media (prefers-contrast: more) {
  :root {
    --lg-fill:   rgba(255, 255, 255, 0.92);
    --lg-border: rgba(0, 0, 0, 0.55);
    --lg-blur:   10px;
    --lg-refract-scale: 0;
    --lg-elev-1-fill: rgba(255, 255, 255, 0.92);
    --lg-elev-2-fill: rgba(255, 255, 255, 0.94);
    --lg-elev-3-fill: rgba(255, 255, 255, 0.96);
    --lg-elev-1-blur: 10px;
    --lg-elev-2-blur: 10px;
    --lg-elev-3-blur: 10px;
  }
}
```

## 5. Implementation Recipes

### Vanilla CSS

Two layers of fidelity. Tier 1 is the portable base (works everywhere `backdrop-filter` works). Tier 2 adds real refraction and only runs in Chromium.

```html
<!-- Displacement + specular filter. Inline once per document. -->
<svg width="0" height="0" aria-hidden="true" focusable="false"
     style="position:absolute;pointer-events:none">
  <defs>
    <!-- A radial-ish gradient pair encodes displacement in R (x) and G (y).
         128 = zero displacement; 0..255 maps to -1..+1 of `scale`. -->
    <linearGradient id="lg-dx" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"    stop-color="#000000"/>
      <stop offset="0.18" stop-color="#808080"/>
      <stop offset="0.82" stop-color="#808080"/>
      <stop offset="1"    stop-color="#ffffff"/>
    </linearGradient>
    <linearGradient id="lg-dy" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="#000000"/>
      <stop offset="0.18" stop-color="#808080"/>
      <stop offset="0.82" stop-color="#808080"/>
      <stop offset="1"    stop-color="#ffffff"/>
    </linearGradient>

    <filter id="lg-refract" x="-20%" y="-20%" width="140%" height="140%"
            color-interpolation-filters="sRGB">
      <!-- Build the displacement map: red = horizontal, green = vertical. -->
      <feImage result="dx"
        href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2'%3E%3C/svg%3E"/>
      <feFlood flood-color="#808080" result="neutral"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008"
                    numOctaves="2" seed="7" result="noise"/>
      <feComposite in="noise" in2="neutral" operator="arithmetic"
                   k1="0" k2="0.18" k3="0.82" k4="0" result="map"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="48"
                         xChannelSelector="R" yChannelSelector="G"
                         result="displaced"/>
      <feColorMatrix in="displaced" type="saturate" values="1.35"/>
    </filter>
  </defs>
</svg>

<nav class="lg lg--bar">
  <button class="lg-btn" type="button">Library</button>
  <button class="lg-btn" type="button" aria-current="page">Now Playing</button>
  <button class="lg-btn" type="button">Search</button>
</nav>
```

```css
/* ---------- Tier 1: portable base ---------- */
.lg {
  position: relative;
  isolation: isolate;
  color: var(--lg-fg);
  background-color: var(--lg-fill);
  border: 1px solid var(--lg-border);
  border-radius: var(--lg-radius-card);
  box-shadow: var(--lg-shadow-ambient), var(--lg-shadow-contact), var(--lg-inset);
  -webkit-backdrop-filter: var(--lg-backdrop);
  backdrop-filter: var(--lg-backdrop);
  /* Clip the expensive paint region so the compositor can cache it. */
  contain: paint;
  will-change: backdrop-filter;
}

/* Brand tint sits above the backdrop, below content. */
.lg::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--lg-tint);
  pointer-events: none;
  z-index: -1;
}

/* Specular rim: bright upper-left arc, dim lower-right arc. */
.lg::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--lg-rim) 0%,
    rgba(255, 255, 255, 0) 38%,
    rgba(255, 255, 255, 0) 62%,
    var(--lg-rim-dark) 100%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}

.lg--bar {
  display: flex;
  gap: var(--lg-space-2);
  padding: var(--lg-space-2);
  border-radius: var(--lg-radius-control);
}

.lg-btn {
  appearance: none;
  border: 0;
  border-radius: var(--lg-radius-control);
  padding: 10px 18px;
  min-height: 44px;                 /* WCAG 2.2 SC 2.5.8 target size */
  font: var(--lg-weight-on-glass) var(--lg-text-md)/1.2 system-ui, sans-serif;
  color: var(--lg-fg);
  background: transparent;
  cursor: pointer;
  transition:
    background-color var(--lg-dur-state) var(--lg-ease),
    transform        var(--lg-dur-state) var(--lg-ease);
}
.lg-btn:hover           { background: rgba(255, 255, 255, 0.28); }
.lg-btn:active          { transform: scale(0.97); background: rgba(255, 255, 255, 0.40); }
.lg-btn[aria-current]   { background: rgba(255, 255, 255, 0.46); }
.lg-btn:focus-visible {
  outline: 3px solid var(--lg-accent);
  outline-offset: 2px;
  /* Second ring guarantees visibility against any backdrop (SC 2.4.11/2.4.13). */
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.55);
}
.lg-btn:disabled { opacity: 0.42; cursor: not-allowed; }

/* ---------- Tier 2: real refraction, Chromium only ---------- */
@supports (backdrop-filter: url(#lg-refract)) {
  .lg--refract {
    -webkit-backdrop-filter: url(#lg-refract) blur(var(--lg-blur)) saturate(var(--lg-sat));
            backdrop-filter: url(#lg-refract) blur(var(--lg-blur)) saturate(var(--lg-sat));
    /* Refraction reads better with a thinner fill; keep contrast via the scrim. */
    background-color: color-mix(in srgb, var(--lg-fill) 78%, transparent);
  }
}

/* ---------- Fallbacks ---------- */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .lg {
    background-color: rgba(246, 246, 248, 0.94);
    backdrop-filter: none;
  }
  @media (prefers-color-scheme: dark) {
    .lg { background-color: rgba(24, 24, 26, 0.94); }
  }
}

@media (forced-colors: active) {
  .lg {
    background: Canvas;
    color: CanvasText;
    border: 1px solid CanvasText;
    backdrop-filter: none;
    box-shadow: none;
  }
  .lg::before, .lg::after { display: none; }
  .lg-btn:focus-visible { outline: 3px solid Highlight; }
}

@media (prefers-reduced-motion: reduce) {
  .lg, .lg-btn { transition-duration: 1ms; }
  .lg-btn:active { transform: none; }
}
```

### Tailwind CSS v4

No plugin required. Tailwind v4's `@theme` gives you the tokens; refraction needs the same inline SVG filter as above plus one `@utility`.

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-glass-fill:       rgb(255 255 255 / 0.62);
  --color-glass-fill-clear: rgb(255 255 255 / 0.28);
  --color-glass-border:     rgb(255 255 255 / 0.45);
  --color-glass-rim:        rgb(255 255 255 / 0.85);
  --color-glass-fg:         #1C1C1E;
  --color-glass-accent:     #0A84FF;

  --blur-glass:        20px;
  --radius-glass:      26px;
  --radius-glass-pill: 999px;

  --shadow-glass:
    0 8px 32px rgb(0 0 0 / 0.12),
    0 1px 2px rgb(0 0 0 / 0.10),
    inset 0 1px 0 rgb(255 255 255 / 0.60);

  --ease-glass: cubic-bezier(0.32, 0.72, 0, 1);
  --animate-glass-settle: glass-settle 520ms var(--ease-glass);
}

@keyframes glass-settle {
  0%   { transform: scale(0.94); opacity: 0; }
  62%  { transform: scale(1.015); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* Base surface. */
@utility glass {
  background-color: var(--color-glass-fill);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-glass);
  box-shadow: var(--shadow-glass);
  color: var(--color-glass-fg);
  -webkit-backdrop-filter: blur(var(--blur-glass)) saturate(180%) brightness(108%);
          backdrop-filter: blur(var(--blur-glass)) saturate(180%) brightness(108%);
  contain: paint;
  isolation: isolate;
}

/* Specular rim as a masked border gradient. */
@utility glass-rim {
  position: relative;
}
@utility glass-rim-after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg,
    var(--color-glass-rim) 0%, transparent 38%,
    transparent 62%, rgb(255 255 255 / 0.18) 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}

/* Chromium-only refraction. */
@utility glass-refract {
  @supports (backdrop-filter: url(#lg-refract)) {
    -webkit-backdrop-filter: url(#lg-refract) blur(var(--blur-glass)) saturate(180%);
            backdrop-filter: url(#lg-refract) blur(var(--blur-glass)) saturate(180%);
    background-color: rgb(255 255 255 / 0.48);
  }
}

/* `@theme` is only processed at the TOP LEVEL of the stylesheet. A `@theme`
   block nested inside `@media` is silently dropped by Tailwind v4 — which,
   for the block below, would mean the mandatory reduced-transparency fallback
   never emits at all and the entire dark palette never emits at all. Override
   the plain custom properties inside `@layer theme` instead; they are the same
   variables the `@utility` rules above already read, so the utilities follow. */
@layer theme {
  /* §7 calls this fallback mandatory. It has to actually ship. */
  @media (prefers-reduced-transparency: reduce) {
    :root {
      --color-glass-fill:       rgb(246 246 248 / 0.98);
      --color-glass-fill-clear: rgb(246 246 248 / 0.98);
      --blur-glass: 0px;
    }
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --color-glass-fill:   rgb(28 28 30 / 0.58);
      --color-glass-border: rgb(255 255 255 / 0.16);
      --color-glass-rim:    rgb(255 255 255 / 0.55);
      --color-glass-fg:     #F2F2F7;
      --blur-glass:         24px;
      --shadow-glass:
        0 8px 32px rgb(0 0 0 / 0.44),
        0 1px 2px rgb(0 0 0 / 0.30),
        inset 0 1px 0 rgb(255 255 255 / 0.22);
    }

    /* Reduced transparency still wins inside dark mode. */
    @media (prefers-reduced-transparency: reduce) {
      :root:not([data-theme="light"]) {
        --color-glass-fill:       rgb(28 28 30 / 0.98);
        --color-glass-fill-clear: rgb(28 28 30 / 0.98);
        --blur-glass: 0px;
      }
    }
  }

  /* Explicit opt-in, so a toggle beats the media query in both directions. */
  :root[data-theme="dark"] {
    color-scheme: dark;
    --color-glass-fill:   rgb(28 28 30 / 0.58);
    --color-glass-border: rgb(255 255 255 / 0.16);
    --color-glass-rim:    rgb(255 255 255 / 0.55);
    --color-glass-fg:     #F2F2F7;
    --blur-glass:         24px;
    --shadow-glass:
      0 8px 32px rgb(0 0 0 / 0.44),
      0 1px 2px rgb(0 0 0 / 0.30),
      inset 0 1px 0 rgb(255 255 255 / 0.22);
  }
  @media (prefers-reduced-transparency: reduce) {
    :root[data-theme="dark"] {
      --color-glass-fill:       rgb(28 28 30 / 0.98);
      --color-glass-fill-clear: rgb(28 28 30 / 0.98);
      --blur-glass: 0px;
    }
  }

  :root[data-theme="light"] { color-scheme: light; }
}
```

Markup:

```html
<!-- Every token below is registered in `@theme`, so use the GENERATED utility
     name: `animate-glass-settle`, `ease-glass`, `rounded-glass-pill`,
     `outline-glass-accent`. Bracket syntax takes a literal value, so
     `ease-[--ease-glass]` emits `transition-timing-function: --ease-glass`,
     which is an invalid value the browser drops — you get default easing, no
     entrance animation and no focus-ring colour, silently.
     If you do need to reference a variable directly, v4's syntax is
     parentheses, not brackets: `ease-(--ease-glass)`,
     `outline-(--color-glass-accent)`. -->
<nav class="glass glass-refract glass-rim before:glass-rim-after
            flex gap-2 p-2 rounded-glass-pill
            motion-safe:animate-glass-settle">
  <button class="min-h-11 rounded-full px-[18px] py-2.5 text-[17px] font-semibold
                 transition-colors duration-[180ms] ease-glass
                 hover:bg-white/28 active:bg-white/40
                 focus-visible:outline-3 focus-visible:outline-offset-2
                 focus-visible:outline-glass-accent">
    Library
  </button>
</nav>
```

If you prefer arbitrary values over `@utility`, the one-liner equivalent is
`backdrop-blur-[20px] backdrop-saturate-180 bg-white/62 border border-white/45 rounded-[26px] shadow-[0_8px_32px_rgb(0_0_0/0.12)]`.

### React component

TypeScript, zero dependencies beyond React. Handles feature detection, `prefers-reduced-transparency`, `prefers-reduced-motion`, forced colors, an `intensity` knob (0-100), and pointer-tracked specular highlight.

```tsx
// LiquidGlass.tsx
import * as React from "react";

type Variant = "regular" | "clear";

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0 = flat opaque card, 100 = maximum refraction and transparency. */
  intensity?: number;
  variant?: Variant;
  /** Corner radius in px. Use 999 for capsule controls. */
  radius?: number;
  /** Optional brand tint, any CSS color. Keep alpha <= 0.12. */
  tint?: string;
  /** Follow the pointer with the specular highlight. */
  trackPointer?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const FILTER_ID = "liquid-glass-refract";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function useSupportsSvgBackdrop(): boolean {
  const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    setOk(
      typeof CSS !== "undefined" &&
        CSS.supports("backdrop-filter", `url(#${FILTER_ID})`)
    );
  }, []);
  return ok;
}

/** Injects the displacement/specular filter once per document. */
export function LiquidGlassFilterDefs({ scale = 48 }: { scale?: number }) {
  return (
    <svg
      width={0}
      height={0}
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        <filter
          id={FILTER_ID}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodColor="#808080" result="neutral" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.006"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feComposite
            in="noise"
            in2="neutral"
            operator="arithmetic"
            k1={0}
            k2={0.16}
            k3={0.84}
            k4={0}
            result="map"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feColorMatrix in="displaced" type="saturate" values="1.35" />
        </filter>
      </defs>
    </svg>
  );
}

export function LiquidGlass({
  intensity = 60,
  variant = "regular",
  radius = 26,
  tint,
  trackPointer = false,
  as = "div",
  children,
  style,
  ...rest
}: LiquidGlassProps) {
  const Tag = as as React.ElementType;
  const ref = React.useRef<HTMLDivElement | null>(null);

  const reduceTransparency = useMediaQuery("(prefers-reduced-transparency: reduce)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const forcedColors = useMediaQuery("(forced-colors: active)");
  const moreContrast = useMediaQuery("(prefers-contrast: more)");
  const supportsRefraction = useSupportsSvgBackdrop();

  const t = Math.min(100, Math.max(0, intensity)) / 100;
  const flat = reduceTransparency || forcedColors || moreContrast;

  // Opacity floor: never below 0.55 for `regular`, never below 0.30 for `clear`.
  const baseAlpha = variant === "clear" ? 0.30 : 0.55;
  const alpha = flat ? 0.98 : baseAlpha + (1 - baseAlpha) * (1 - t) * 0.75;
  const blur = flat ? 0 : Math.round(8 + 20 * t);
  const sat = flat ? 100 : Math.round(120 + 80 * t);

  const [spec, setSpec] = React.useState({ x: 30, y: 22 });
  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!trackPointer || reduceMotion || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setSpec({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    },
    [trackPointer, reduceMotion]
  );

  const backdrop = flat
    ? "none"
    : supportsRefraction && t > 0.35
      ? `url(#${FILTER_ID}) blur(${blur}px) saturate(${sat}%)`
      : `blur(${blur}px) saturate(${sat}%)`;

  const surfaceStyle: React.CSSProperties = {
    position: "relative",
    isolation: "isolate",
    borderRadius: radius,
    color: "var(--lg-fg, #1C1C1E)",
    backgroundColor: `rgba(255,255,255,${alpha.toFixed(3)})`,
    border: `1px solid rgba(255,255,255,${flat ? 0.9 : 0.45})`,
    boxShadow: flat
      ? "none"
      : "0 8px 32px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.60)",
    WebkitBackdropFilter: backdrop,
    backdropFilter: backdrop,
    contain: "paint",
    transition: reduceMotion
      ? "none"
      : "background-color 180ms cubic-bezier(0.32,0.72,0,1), box-shadow 180ms cubic-bezier(0.32,0.72,0,1)",
    ...style,
  };

  const rimStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    pointerEvents: "none",
    background: `radial-gradient(120% 90% at ${spec.x}% ${spec.y}%, rgba(255,255,255,${(
      0.20 + 0.55 * t
    ).toFixed(2)}) 0%, rgba(255,255,255,0) 55%)`,
    mixBlendMode: "screen",
    opacity: flat ? 0 : 1,
  };

  const tintStyle: React.CSSProperties | undefined = tint
    ? {
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        background: tint,
        pointerEvents: "none",
        opacity: flat ? 0 : 1,
      }
    : undefined;

  return (
    <Tag ref={ref} style={surfaceStyle} onPointerMove={onPointerMove} {...rest}>
      {tintStyle ? <span aria-hidden="true" style={tintStyle} /> : null}
      <span aria-hidden="true" style={rimStyle} />
      <span style={{ position: "relative", display: "block" }}>{children}</span>
    </Tag>
  );
}
```

Usage:

```tsx
export default function App() {
  return (
    <>
      <LiquidGlassFilterDefs scale={48} />
      <LiquidGlass
        intensity={70}
        variant="regular"
        radius={999}
        trackPointer
        style={{ padding: "8px", display: "flex", gap: 8 }}
      >
        <button style={{ minHeight: 44, padding: "10px 18px", borderRadius: 999 }}>
          Library
        </button>
        <button style={{ minHeight: 44, padding: "10px 18px", borderRadius: 999 }}>
          Search
        </button>
      </LiquidGlass>
    </>
  );
}
```

### Native / other platform

This is the one style where the native implementation is the canonical one and the web is the imitation.

**SwiftUI (iOS 26+/iOS 27, Xcode 26+):**

```swift
import SwiftUI

struct GlassToolbar: View {
    @Namespace private var glassNamespace
    @State private var expanded = false
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ZStack(alignment: .bottom) {
            // Let artwork bleed under the glass chrome.
            Image("cover")
                .resizable()
                .scaledToFill()
                .backgroundExtensionEffect()
                .ignoresSafeArea()

            GlassEffectContainer(spacing: 16) {
                HStack(spacing: 16) {
                    Button("Library") {}
                        .buttonStyle(.glass)
                        .glassEffectID("library", in: glassNamespace)

                    Button {
                        withAnimation(reduceMotion ? .none : .spring(response: 0.32,
                                                                     dampingFraction: 0.8)) {
                            expanded.toggle()
                        }
                    } label: {
                        Image(systemName: expanded ? "chevron.down" : "chevron.up")
                            .frame(width: 44, height: 44)
                    }
                    .buttonStyle(.glass)
                    .glassEffectID("toggle", in: glassNamespace)

                    if expanded {
                        Button("Search") {}
                            .buttonStyle(.glass)
                            .glassEffectID("search", in: glassNamespace)
                    }
                }
                .padding(8)
                // `.regular` adapts and needs no scrim; `.clear` requires one.
                .glassEffect(reduceTransparency ? .regular.tint(.thinMaterial.opacity(1))
                                                : .regular.interactive(),
                             in: .capsule)
            }
            .padding(.bottom, 24)
        }
    }
}
```

Key API surface, all introduced with iOS 26 / macOS 26:

| API | Purpose |
|---|---|
| `.glassEffect(_:in:isEnabled:)` | Applies Liquid Glass to any view, clipped to a shape |
| `Glass.regular` / `Glass.clear` | The two variants; `.clear` needs a dimming layer beneath |
| `.interactive()` | Adds press/hover reaction (scale, highlight sweep) |
| `.tint(_:)` | Brand tint applied inside the material |
| `GlassEffectContainer(spacing:)` | Shared sampling region; required for correct blending. Glass cannot sample other glass, so overlapping glass in separate containers renders incorrectly |
| `.glassEffectID(_:in:)` | Matched-geometry morph between glass shapes across state changes |
| `.glassEffectUnion(id:namespace:)` | Force several shapes to render as one merged blob |
| `.buttonStyle(.glass)` / `.glassProminent` | Standard glass buttons; prefer over manual `.glassEffect` |
| `.backgroundExtensionEffect()` | Mirrors/extends content under floating chrome so glass has something to refract |
| `.scrollEdgeEffectStyle(_:for:)` | Controls the fade where scrolling content meets glass bars |

**UIKit/AppKit:** `UIGlassEffect` (a `UIVisualEffect` subclass) with `UIVisualEffectView`, `UIGlassContainerEffect` for grouping, and `UIButton.Configuration.glass()` / `.prominentGlass()`. `NSGlassEffectView` and `NSGlassEffectContainerView` on macOS. Recompiling against the iOS 26 SDK opts you in automatically; there is no per-screen granularity.

**Opting out:** set `UIDesignRequiresCompatibility` to `YES` in Info.plist. It reverts bars, toolbars, tab bars, sheets and system chrome to the pre-26 design. Apple states this is intended for debugging and short-term migration and will be removed in the next major Xcode release — plan migration, do not plan residency.

**React Native:** `@callstack/liquid-glass` exposes `LiquidGlassView` (`effect: 'clear' | 'regular' | 'none'`, `interactive`, `tintColor`, `colorScheme`, `animated`, `animationDuration`), `LiquidGlassContainerView` for merging, and the `isLiquidGlassSupported` constant. Requires Xcode 26+, React Native 0.80+, and iOS 26+; it degrades to a plain `View` elsewhere and does not work in Expo Go. `interactive` cannot be changed after mount.

**Jetpack Compose:** not applicable as a first-class material. Google confirmed in May 2026 that Android 17 will not adopt Liquid Glass; Material 3 Expressive extends blur and translucency (menus, sliders, quick settings) but deliberately omits refraction. If you need it on Android, you are writing an AGSL `RuntimeShader` yourself against `Modifier.graphicsLayer(renderEffect = ...)`, and you own the perf and accessibility consequences.

**Figma:** native glass effect shipped July 2025 (no plugin needed) — use the glass material with refraction/depth controls rather than stacked blur layers. **Framer** has no native equivalent as of mid-2026; community workarounds use layered blur plus an SVG filter in a code component.

## 6. Interaction & Motion

| State | Treatment | Values |
|---|---|---|
| Rest | Base fill, rim highlight fixed at 135° | fill `0.62`, blur `20px`, rim `0.85` |
| Hover (pointer) | Fill +0.06, rim brightens, highlight follows cursor | `background-color` +6%, `180ms`, `cubic-bezier(0.32,0.72,0,1)` |
| Active / pressed | Scale `0.97`, fill +0.14, contact shadow shrinks to `0 0 0` | `120ms` in, `280ms` out with spring easing |
| Focus-visible | 3px accent ring, offset 2px, plus a 5px dark halo behind it | Never rely on the glass border alone |
| Selected / current | Fill `0.46` inner pill inside the bar | Persistent, not motion-dependent |
| Disabled | `opacity: 0.42`, refraction off, no pointer events | Keep the label at ≥3:1 against the composite |
| Loading | Rim highlight sweeps 0→100% across the element, 1200ms, `ease-in-out`, infinite | Disable entirely under reduced motion; use a static indeterminate bar instead |
| Morph / merge | Two capsules blend and separate | `320ms`, spring `linear(0,0.35,0.86,1.04,1.01,1)` |
| Sheet present | Scale `0.94 → 1.015 → 1.0`, opacity 0→1 | `520ms` settle |

Rules:

- **Animate:** `opacity`, `transform`, `background-color`, and `feDisplacementMap`'s `scale` attribute (cheap — it does not rebuild the map).
- **Do not animate:** `backdrop-filter`'s blur radius, filter region size, `border-radius`, or anything that forces regeneration of the displacement map. kube.io's analysis is explicit that nearly every geometry change forces a full map rebuild, and that is the expensive path.
- **Do not animate on scroll.** Recomputing a backdrop filter every frame while the backdrop is also translating is the single most reliable way to drop below 60fps on mid-range hardware.
- The specular sweep is decoration. It must never be the only signal that something is loading, focused, or selected.

```css
@media (prefers-reduced-motion: reduce) {
  .lg, .lg-btn, .lg-sheet {
    transition-duration: 1ms !important;
    animation: none !important;
  }
  .lg-btn:active { transform: none; }
  .lg--loading::after { animation: none; opacity: 1; }
}
```

On Apple platforms, honour `accessibilityReduceMotion` for the morph animations and `accessibilityReduceTransparency` for the material itself; they are separate settings and users commonly enable only one.

## 7. Accessibility

This is the highest-risk style in the set. The core problem is structural: **contrast becomes a property of the backdrop, which you do not control.**

### Criteria most often violated

- **1.4.3 Contrast (Minimum), AA** — text over a translucent surface has a contrast ratio that varies with whatever scrolls behind it. A toolbar label that measures 7:1 over a dark photo can measure 2.1:1 two seconds later.
- **1.4.11 Non-text Contrast, AA** — the 1px `rgba(255,255,255,0.45)` rim almost never reaches 3:1 against an arbitrary backdrop, so the boundary of the control is not perceivable. Icon-only glass buttons fail the same way.
- **1.4.6 Contrast (Enhanced), AAA** — effectively unreachable on Clear glass.
- **1.4.12 Text Spacing** — glass chrome is usually tightly packed; user stylesheets that increase line-height clip content out of the lensed rim.
- **2.4.7 / 2.4.11 Focus Appearance** — a focus ring drawn in white over glass over a bright photo disappears. Needs the dual-ring treatment.
- **2.5.8 Target Size (Minimum), AA** — capsule controls in a merged glass bar frequently render at 32-36px. 24×24px is the floor; 44×44px is the practical target.
- **1.4.10 Reflow** — deeply nested glass containers with `contain: paint` can clip content at 320px width.

### Contrast math

Compositing a white glass fill of alpha α over a backdrop channel value `B` gives `C = 255α + B(1-α)` in sRGB 8-bit space. Relative luminance then follows the standard sRGB transfer function.

- **Default fill (α = 0.62) over a mid-grey photo (B = 128):** C ≈ 176 → L ≈ 0.435. With `#1C1C1E` text (L ≈ 0.0116): **(0.485)/(0.0616) ≈ 7.9:1** — passes AA and AAA for body text. With white text: 1.05/0.485 = **2.2:1 — fails everything.**
- **iOS 26 shipping floor (α = 0.40) over a dark photo (B = 48):** C ≈ 131 → L ≈ 0.226. White text: 1.05/0.276 = **3.8:1** (passes 1.4.3 only for large text ≥24px/18.66px bold). Black text: 0.276/0.0616 = **4.5:1**, right on the boundary. Neither foreground colour is safe — this is exactly the failure mode users reported in September 2025, and exactly why Apple raised the floor to ~0.60 in iOS 27.
- **Practical rule:** with α ≥ 0.62 and a *known* foreground polarity, you clear 4.5:1 across the full backdrop range 0-255. Below α = 0.55 there is no single foreground colour that survives all backdrops. **0.55 is the hard floor; 0.62 is the safe default.**
- If you must go lower, add the scrim: a `rgba(0,0,0,0.22)` layer beneath Clear glass pins the backdrop's maximum luminance and makes white text viable. Apple mandates this for the Clear variant.

### Focus-visible strategy

```css
:where(.lg) :is(a, button, [role="button"], input, select, summary):focus-visible {
  outline: 3px solid #0A84FF;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.55), 0 0 0 8px rgba(255, 255, 255, 0.9);
  border-radius: inherit;
}
@media (forced-colors: active) {
  :where(.lg) :focus-visible { outline: 3px solid Highlight; box-shadow: none; }
}
```

Three concentric rings (accent, dark, light) guarantee at least one edge with ≥3:1 against any backdrop. This satisfies 2.4.11 Focus Appearance without depending on the surface.

### Screen reader and DOM order

- The rim, tint and specular layers must be `aria-hidden="true"` and `pointer-events: none`. They are decorative `<span>`s and will otherwise be announced as empty group members.
- The inline `<svg>` holding filter `<defs>` needs `aria-hidden="true"` and `focusable="false"`; without `focusable="false"` legacy IE-era behaviour and some AT still stop on it.
- Floating glass chrome is typically appended at the end of the DOM for stacking reasons but appears at the top of the screen. Either place it in DOM order matching visual order or wrap it in a landmark (`<nav>`, `<header>`) so it is reachable directly.
- Merged/morphing glass groups change shape but must not change accessible name, role, or focus order. Do not remove a button from the DOM mid-morph.

### Forced colors / Windows High Contrast

`backdrop-filter` is not automatically neutralised in forced-colors mode. You must explicitly set `background: Canvas`, `color: CanvasText`, `border: 1px solid CanvasText`, `backdrop-filter: none`, and hide the decorative pseudo-elements. Otherwise the surface stays translucent while text flips to system colours, which is worse than either.

### Reduce transparency / reduce motion

- Web: `@media (prefers-reduced-transparency: reduce)` — support, stated identically in docs 01, 03, 06, 08 and 10: Chrome and Edge 118+ only; Firefox behind the `layout.css.prefers-reduced-transparency.enabled` flag; **Safari does not support it as of August 2026**, which is precisely the wrong gap for this style, since Apple's own users are the ones most likely to have Reduce Transparency on. Collapse to a 98%-opaque surface with `blur(0)` where the query lands, pair it with a `prefers-contrast: more` fallback, and ship an in-app toggle — the media query alone does not cover your Safari users.
- Apple platforms: read `accessibilityReduceTransparency` and `accessibilityDarkerSystemColors` (Increase Contrast). The system already swaps Liquid Glass for an opaque material, but custom `.glassEffect` surfaces should still branch, and any custom text colour you chose for glass must be re-checked against the opaque fallback.
- iOS 26.1+ users may have set Settings > Display & Brightness > Liquid Glass to **Tinted**; iOS 27 users may have moved the opacity slider. Never hard-code assumptions about how transparent your chrome will actually be.

### Pass/fail checklist

| # | Check | Pass condition |
|---|---|---|
| 1 | Body text contrast over the darkest and brightest possible backdrop | ≥4.5:1 in both extremes |
| 2 | Large text / icons | ≥3:1 in both extremes |
| 3 | Control boundary perceivable | ≥3:1 rim or an opaque inner fill |
| 4 | Focus indicator | Visible over black, white, and a saturated photo; ≥3:1, ≥2px thick |
| 5 | Target size | ≥24×24px minimum, 44×44px recommended |
| 6 | `prefers-reduced-transparency` | Fill ≥0.95, blur 0, refraction 0 |
| 7 | `prefers-reduced-motion` | No sweeps, no morphs, no scale on press |
| 8 | `forced-colors: active` | Opaque, system colours, decorative layers hidden |
| 9 | Decorative layers | `aria-hidden` + `pointer-events: none` |
| 10 | No `backdrop-filter` support | Solid fallback ≥0.94 opacity |
| 11 | Zoom to 400% / 320px reflow | No clipped or overlapped glass chrome |
| 12 | Text over glass weight | ≥500 weight at ≤17px |
| 13 | Target size comes from the token | Every control's computed `min-height`/`min-width` resolve from `var(--lg-target-min)` (44px), with no hard-coded size below it — including capsules inside a merged glass bar |

## 8. Performance

**What it costs.** A `backdrop-filter` forces the browser to (1) snapshot the backdrop behind the element into a texture, (2) run the filter chain on the GPU, (3) composite the result. Every distinct glass element gets its own backdrop snapshot and its own compositing layer. Adding an SVG filter to the chain adds a displacement pass that samples the map texture per output pixel.

Concrete effects to plan for:

- **Layer count.** Each glass surface promotes to its own compositor layer. On a 1170×2532 device, three full-width glass bars ≈ 3 extra full-width RGBA textures ≈ 11MB of GPU memory before the filter's intermediate buffers.
- **Stacking is multiplicative, not additive.** Glass over glass means the inner element's snapshot includes the outer element's already-filtered output. Two stacked panels look worse *and* run slower than one. Apple's own architecture forbids it: glass cannot sample glass, which is exactly why `GlassEffectContainer` exists.
- **Scroll is the worst case.** A translating backdrop invalidates the snapshot every frame. A 20px blur over a full-width 88px toolbar on a 2022 mid-range Android costs roughly 3-6ms/frame; add SVG displacement and you are at or past the 16.7ms budget.
- **Displacement map regeneration.** kube.io documents that changing element size, shape, or refraction geometry forces a full rebuild of the displacement map (127 ray simulations per radius in their derivation). Animating `scale` is cheap; animating geometry is not. Precompute maps per component size and cache them as data URIs.
- **`feImage` with an external `href`** costs a network fetch plus a decode inside the filter graph. Inline the map as a base64 data URI (a 300×56 8-bit PNG map is roughly 2-6KB).
- **Filter region.** `x="-20%" y="-20%" width="140%" height="140%"` on a large element inflates the rasterized area by ~96%. Keep filter regions as tight as the effect allows.

**Budgets.**

| Budget | Target |
|---|---|
| Glass surfaces simultaneously in viewport | ≤3 (≤2 on mobile) |
| Total glass area | ≤25% of viewport |
| Refracting (SVG-filtered) surfaces | ≤1 |
| Blur radius | ≤24px; every extra 8px is roughly linear extra cost |
| Frame time contribution from glass | ≤4ms on a mid-tier device |
| Displacement map asset | ≤8KB, inlined as data URI |
| INP regression vs. opaque baseline | ≤20ms |

**Mitigations.**

- `contain: paint` (or `contain: strict` where layout allows) on every glass surface, so invalidation cannot escape the element's bounds.
- `will-change: backdrop-filter` on surfaces that actually animate — and remove it when they stop. Leaving it on permanently pins the layer in GPU memory.
- Disable refraction below a size threshold; a 32px chip does not read as a lens and pays full cost.
- Feature-gate on device: `navigator.hardwareConcurrency <= 4` or `navigator.deviceMemory <= 4` → drop to Tier 1 (blur only) or Tier 0 (opaque).
- Respect `prefers-reduced-transparency` and Save-Data; both are free performance wins that also improve accessibility.
- Never apply glass to a scroll container's own children — apply it to a `position: fixed` sibling.

**Cheaper fallbacks, in descending fidelity:**

1. Blur + saturate + rim gradient (Tier 1) — ~40% of the cost, works in all evergreen browsers.
2. Static pre-rendered blur image behind an opaque-ish fill — near-zero runtime cost, no adaptivity.
3. Solid tinted fill at 94-98% opacity with a 1px border and a soft shadow — zero cost, and honestly what most dashboards should ship.

Native Apple platforms are the exception: Liquid Glass is composited by the OS on Apple silicon and is far cheaper there than any web reproduction. Federighi cited Apple silicon's compute as a precondition for shipping the material at all.

## 9. When To Use / When Not To

**Use it when:**

- You are building a native Apple app targeting iOS 26+/macOS 26+. You do not really have a choice; opting out has an expiry date.
- Floating chrome sits over rich, owned media: photo viewers, video players, music apps, maps, camera UIs, AR/spatial interfaces.
- Marketing sites, product launch pages, and hero sections for premium hardware, audio, automotive, or AI products where a controlled gradient backdrop makes contrast predictable.
- Ambient/glanceable surfaces: lock screens, widgets, HUD overlays, media controls, now-playing bars.
- OS-adjacent or Apple-ecosystem-adjacent products where matching the platform's language is the point.
- As one accent surface in an otherwise opaque system — a single command palette, a single floating toolbar.

**Do not use it when:**

- The product is text-dense and read for long stretches: documentation, email, CRMs, admin panels, code editors, financial tables, EHRs. Cognitive drag from layered translucency is a documented complaint, and reading sessions amplify it.
- You are subject to WCAG AA conformance obligations and cannot control the backdrop (user-uploaded avatars, arbitrary photos, embedded third-party content).
- Your audience skews toward low vision, dyslexia, ADHD, or older users. The American Foundation for the Blind's December 2025 letter to Apple is the reference point.
- Sunlight/outdoor usage is a primary context: field service, delivery, agriculture, construction, automotive dashboards.
- Low-end Android or budget hardware is a significant share of your traffic.
- You need cross-browser parity: refraction does not exist in Safari or Firefox today, so your "signature" effect is invisible to roughly half the web.
- Print, email, or PDF output is a first-class deliverable.
- Data visualisation surfaces. Chart legibility over a warped, blurred, colour-shifted backdrop is indefensible.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Keep glass on the chrome layer (toolbars, tab bars, sheets, popovers, controls) and keep content opaque. | Don't put body copy, tables, or charts on a glass surface. |
| Default to the **Regular** variant; it adapts and needs no scrim. | Don't reach for **Clear** unless all three of Apple's conditions hold — media-rich backdrop, scrim-tolerant content, bold bright foreground. |
| Enforce a fill-opacity floor of 0.55 (0.62 recommended) and verify both luminance extremes. | Don't ship the iOS 26-era 0.40 floor; Apple itself raised it to ~0.60 in iOS 27 after a year of complaints. |
| Put a dimming scrim under every Clear surface. | Don't stack glass on glass — it costs more and looks worse; glass cannot sample glass. |
| Group related glass elements in one container (`GlassEffectContainer` natively, one filter region on web). | Don't give each button its own `backdrop-filter`; you multiply snapshots for no visual gain. |
| Precompute and inline displacement maps as data URIs per component size. | Don't regenerate the displacement map on resize, hover, or scroll. |
| Use a triple-ring focus indicator (accent + dark + light). | Don't rely on the 1px rim as either the control boundary or the focus indicator. |
| Ship a Tier-1 (blur-only) and Tier-0 (opaque) fallback behind `@supports`. | Don't let Safari and Firefox users see a broken or flat-looking control with no rim and no lens. |
| Honour `prefers-reduced-transparency`, `prefers-contrast`, `forced-colors`, and `prefers-reduced-motion` explicitly. | Don't assume the OS neutralises `backdrop-filter` for you in high contrast mode — it does not. |
| Cap the effect: ≤3 glass surfaces and ≤25% of viewport area. | Don't glass the whole page background; that is a gradient with extra steps. |
| Raise text weight to 500-600 and size to ≥17px on glass. | Don't use 300/400-weight body text over any translucent surface. |
| Animate `transform`, `opacity`, `background-color`, and `feDisplacementMap@scale`. | Don't animate blur radius, filter region, or border-radius. |
| Test against a deliberately hostile backdrop (a high-contrast checkerboard photo). | Don't validate contrast against your one hand-picked marketing gradient. |
| Give users a control if glass is heavy in your product. | Don't make transparency mandatory — Apple shipped a toggle in 26.1 and a slider in 27 precisely because mandatory failed. |

## 11. In The Wild (2024-2026)

- **Apple — iOS 26 / iPadOS 26 / macOS Tahoe 26 / watchOS 26 / tvOS 26 / visionOS 26** (15 September 2025). The reference implementation: lensing toolbars, floating tab bars that shrink on scroll, glass Control Center, translucent app icons with a shimmer layer, glass sidebars in Mail/Finder/Music.
- **Apple — iOS 26.1** (3 November 2025). Settings > Display & Brightness > Liquid Glass with **Clear** and **Tinted** options — the first time Apple has shipped a user-facing switch for a system design decision of this scale.
- **Apple — iOS 27 / iPadOS 27 / macOS 27** (announced at WWDC 2026, 8-12 June 2026; keynote and developer beta 1 on 8 June; GA expected mid-September 2026). Lower default transparency, a continuous opacity slider, edge-to-edge coloured active sidebars, tighter window corner radii, refreshed first-party icons. (Refs 12, 13, 20 — all secondary. The "Golden Gate" codename circulating for macOS 27 has no source and is not repeated here.)
- **Apple New Design Gallery** (`developer.apple.com/design/new-design-gallery/`, expanded 6 November 2025) with iOS 18 vs iOS 26 comparisons. Named third-party adopters include **Crumbl** (moved brand pink from toolbar to content layer), **Linearity** (two-column iPad inspector), **Tide Guide**, **GrowPal**, **Lumy**, **Sky Guide**, **OmniFocus 4**, **Photoroom**, **CNN**, **Essayist**, **Lucid Motors**, **American Airlines**, **Lowe's**, **LTK**, **CardPointers**, **AllTrails**, **Carrot Weather**, **Fantastical**, **Kroger**, **SketchPro**, **Trello**, **Le Monde**.
- **Instagram (iOS)** — Liquid Glass navigation bar rolled out to a subset of users around 13 February 2026; WhatsApp had not shipped an equivalent at that time (ref 21, secondary; staged rollout, so the date is approximate).
- **Art Directors Club of New York, 2026 awards** (14 May 2026) — Gold Cube for iOS 26 in Interactive/UX/UI (ref 14, secondary).
- **Google / Android** — explicitly *not* adopting. Sameer Samat ruled out a Liquid Glass redesign for Android 17 on 6 May 2026; Material 3 Expressive continues instead, expanding blur/translucency in menus, sliders and quick settings without refraction (ref 15, secondary).
- **Figma** — native glass effect shipped July 2025, replacing the plugin-and-stacked-blur workflow. Community files such as "iOS 26 Liquid Glass With Refraction" are widely forked.
- **Web libraries and tools (2025-2026):** `callstack/liquid-glass` (`@callstack/liquid-glass`, React Native, ~1.6k stars); `rdev/liquid-glass-react`; `nikdelvin/liquid-glass` (CSS+SVG only, `LiquidGlass`/`LiquidText`/`LiquidButton`); `glincker/glinui` (50+ React primitives on Radix + Tailwind, `npx glinui add`); **Ein UI** (shadcn-compatible React/Next.js glass components); `creativoma/liquid-glass` (Tailwind React component); `Mael-667/Liquid-Glass-CSS`; `yanglei1826877278/liquid-glass` (CSS/HTML generator, also a Vue component); Outpace Studios' "Liquid glass for the web".
- **Technique write-ups that actually moved the field:** kube.io's Snell-Descartes-derived displacement-map derivation (the definitive treatment of *why* Apple's curve is a squircle), LogRocket's `feImage` + `feDisplacementMap` + `feComposite` production recipe (8 December 2025), and CSS-Tricks' "Getting Clarity on Apple's Liquid Glass" (Geoff Graham, 17 July 2025).
- **Standards activity:** W3C SVG WG issue #1142, filed 25 June 2026, proposing an interoperable `BackdropGraphic` filter input or a higher-level refraction primitive so `backdrop-filter` can do this without DOM-cloning hacks (ref 4). Still open, no browser positions recorded — check the live thread, since this is the only thing that would move the Chromium-only ceiling described in §2. (A WebKit bug number for "SVG filters in `backdrop-filter`" circulates alongside this; it could not be verified in this pass and is not cited here. Search bugs.webkit.org directly if you need the tracking issue.)

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui. Styles named without a link have no file in this set.

- **[./03-glassmorphism.md](./03-glassmorphism.md) — direct ancestor, and the same lineage.** Liquid Glass is glassmorphism plus displacement, specular tracking and adaptive tint: a superset, not a rebrand. Glassmorphism is `blur + translucent fill + light border`; this doc adds the displacement map and the merge behaviour. The honest hybrid is what most teams should ship: glassmorphism everywhere, one Liquid Glass hero surface. If your budget forces a choice, glassmorphism at α ≥ 0.6 is safer and 60% cheaper.
- **[./05-minimalism.md](./05-minimalism.md) — the necessary partner.** Liquid Glass only works because the content layer beneath it is flat and opaque. A page that is glass all the way down is unreadable. Pair one glass chrome layer over a flat content layer; this is literally Apple's own architecture. Doc 05 owns flat and flat 2.0 as aliases, so its `--min-*` tokens are the ones to reach for on that content layer.
- **[./01-skeuomorphism.md](./01-skeuomorphism.md) — spiritual cousin, clashing execution.** Both simulate physical material. Skeuomorphism simulates *texture* (leather, felt, brushed metal); Liquid Glass simulates *optics*. Mixing them produces the Aqua-era look. Avoid unless that is deliberately the brief — though note doc 01 §12 makes the narrower case that *glass above, bevelled material below* is the one combination that does work, and this material is the vendor version of it.
- **[./02-neumorphism.md](./02-neumorphism.md) — clashes hard.** Neumorphism's premise is that the control is the same colour as its background, extruded by shadow. Liquid Glass's premise is that the control is a separate optical object floating above. Combining them yields controls that are simultaneously flush and floating, and stacks two independently a11y-hostile systems. Do not. And do not read this material as neumorphism's more accessible successor: this doc rates `a11y_risk: high` for reasons §7 sets out at length.
- **[./04-claymorphism.md](./04-claymorphism.md) — occasionally works.** Opaque clay content cards under a glass toolbar is legible and playful. Do not make the clay itself translucent; it kills the soft-solid read.
- **[./06-maximalism.md](./06-maximalism.md) — clashes, and specifically because of the adaptive tint.** Glass over a collage ground is already a contrast bet (see the glassmorphism entry in doc 06 §12); Liquid Glass makes it worse, because the tint *samples* what is underneath, so the same control changes colour as the page scrolls. If you need both, clamp the ground under the glass and let the maximalism run everywhere else.
- **[./07-brutalism.md](./07-brutalism.md) — deliberate clash only.** Hard 4px black borders and zero-blur shadows are the exact opposite thesis. As a shock juxtaposition on a portfolio site it reads intentional; in a product it reads unfinished. On Apple platforms the workable split is brutalism inside your own content views, platform glass for the chrome.
- **[./09-bento-grid.md](./09-bento-grid.md) — strong pairing, with a caveat.** Bento tiles over a shared gradient look excellent in glass, but a 3×3 bento of glass tiles is 9 backdrop snapshots. Render the *grid container* as one glass surface with opaque internal dividers instead of nine glass children.
- **[./10-spatial-ui.md](./10-spatial-ui.md) — native pairing, and the origin story.** visionOS is where Liquid Glass came from: Federighi names it as the direct inspiration. Parallax, depth layering and a lensing chrome layer reinforce each other, and doc 10's rule that depth must live on one shared stage is what keeps the glass from looking like decals. On the web, keep 3D scenes on a `<canvas>` beneath the glass rather than transforming glass elements in 3D — a transformed backdrop-filter element re-rasterizes every frame.
- **Aurora / mesh gradients — no doc in this set; best backdrop.** A slow, low-frequency mesh gradient behind glass gives refraction something legible to bend, and — critically — lets you *control* the luminance range so contrast math stays valid. This is the highest-value combination on the web. Keep the gradient's luminance band within roughly 25 points so the composite never swings.

## 13. Plugin Spec (draft)

**Skill name:** `liquid-glass-ui`

**Description:** "Use when the user wants Apple Liquid Glass styling — refractive/lensing glass surfaces, iOS 26/27-style floating toolbars, specular-rim controls, or an 'Apple-like' translucent chrome layer — applied to a web or React Native UI, or when they ask to modernise existing glassmorphism into true refraction. Also use when auditing an existing liquid-glass implementation for contrast, performance, or reduced-transparency failures."

**What the skill does:**

1. Detects the framework (plain CSS, Tailwind v3/v4, React, Next.js, Vue, SwiftUI, React Native) and the existing token system.
2. Emits a token layer (`--lg-*` custom properties or a Tailwind `@theme` block) with light, dark, `prefers-reduced-transparency`, and `prefers-contrast` variants.
3. Identifies **chrome** elements (nav, toolbar, tab bar, sheet, dialog, popover, command palette, floating action bar) and applies glass **only** to those. It explicitly refuses to glass content regions, tables, and chart containers.
4. Generates the inline SVG filter `<defs>` with a per-component-size displacement map, inlined as a base64 data URI, plus the specular rim mask.
5. Wraps the effect in a three-tier progressive enhancement ladder: Tier 2 (SVG refraction, Chromium), Tier 1 (blur + saturate + rim), Tier 0 (opaque ≥0.94 fill), gated by `@supports` — never by user-agent sniffing.
6. Rewrites focus styles to the triple-ring pattern and bumps on-glass type to ≥17px/600.
7. Adds `contain: paint`, scoped `will-change`, and a device-capability gate that drops to Tier 1 when `deviceMemory <= 4` or `hardwareConcurrency <= 4`.
8. On SwiftUI, converts `.background(.ultraThinMaterial)` call sites to `.glassEffect(_:in:)`, groups siblings into a `GlassEffectContainer`, assigns `glassEffectID`s for morph transitions, and swaps custom button styles for `.buttonStyle(.glass)` where the sizing allows.
9. Produces an audit report with measured contrast at both backdrop luminance extremes.

**Inputs from the user:**

| Input | Type | Default |
|---|---|---|
| `framework` | `css` \| `tailwind4` \| `react` \| `next` \| `vue` \| `swiftui` \| `react-native` | detected |
| `basePalette` | surface, foreground, accent hex values | detected from existing tokens |
| `density` | `compact` \| `regular` \| `spacious` | `regular` |
| `intensity` | 0-100 | `60` |
| `variant` | `regular` \| `clear` | `regular` |
| `backdropControl` | `owned` (you control the media) \| `arbitrary` (user content) | `arbitrary` |
| `targetBrowsers` | browserslist string | project's browserslist |
| `a11yTarget` | `AA` \| `AAA` | `AA` |

`backdropControl: arbitrary` hard-caps `intensity` at 45 and forces `variant: regular`.

**Outputs:**

- `tokens/liquid-glass.css` (or `theme.liquid-glass.ts` for Tailwind v4) — the full `--lg-*` set with all four media-query overrides.
- `components/LiquidGlass.tsx` + `LiquidGlassFilterDefs.tsx` (or `.swift` / `.vue` equivalents).
- `styles/liquid-glass.layer.css` — a `@layer liquid-glass { ... }` block so it never wins specificity fights with the host system unintentionally.
- `assets/displacement-*.png` inlined as data URIs in the emitted filter, one per distinct component size.
- `reports/liquid-glass-audit.md` — per-surface contrast at backdrop luminance 0 and 255, layer count, estimated GPU texture memory, media-query coverage matrix, and a pass/fail line per checklist item in §7.

**Validation checklist the skill self-runs:**

1. Every glass surface has computed fill alpha ≥ 0.55 (≥ 0.62 when `backdropControl: arbitrary`).
2. Foreground text contrast ≥ 4.5:1 (or 7:1 for `AAA`) computed against composites at backdrop luminance 0 **and** 255.
3. Non-text boundary contrast ≥ 3:1, or an opaque inner fill is present.
4. Every interactive descendant has a focus-visible rule with ≥3px total ring and at least two contrasting rings.
5. Confirm every emitted control sizes from `--lg-target-min` (44px) rather than a literal; fail below the 24×24px SC 2.5.8 floor, warn on any computed size below the token.
6. `@media (prefers-reduced-transparency: reduce)` block exists and sets blur to 0 and alpha ≥ 0.95.
7. `@media (prefers-reduced-motion: reduce)` block exists and cancels all sweeps, morphs and press transforms.
8. `@media (forced-colors: active)` block exists, sets system colours, and hides decorative pseudo-elements.
9. `@supports not (backdrop-filter: blur(1px))` fallback exists with alpha ≥ 0.94.
10. Glass surface count ≤ 3 per route; total glass area ≤ 25% of a 1440×900 viewport.
11. No nested glass (a glass element with a glass ancestor) — hard fail.
12. No `transition`/`animation` targeting `backdrop-filter`, `filter`, `border-radius`, or SVG filter geometry.
13. All decorative layers carry `aria-hidden="true"` and `pointer-events: none`; all inline filter `<svg>`s carry `aria-hidden="true" focusable="false"`.
14. Displacement map assets ≤ 8KB each and inlined, not fetched.
15. SwiftUI output: sibling `.glassEffect` views share a `GlassEffectContainer`; `.clear` usage is accompanied by a dimming layer.

**Intensity knobs:**

| Knob | Min | Max | Default | Effect |
|---|---|---|---|---|
| `refractionScale` | 0 | 72 | 48 | `feDisplacementMap@scale`; 0 disables Tier 2 entirely |
| `fillAlpha` | 0.55 | 0.95 | 0.62 | Surface opacity; the floor is a hard clamp, not a suggestion |
| `blurRadius` | 0px | 28px | 20px | Backdrop gaussian |
| `specularOpacity` | 0.00 | 0.90 | 0.55 | Rim highlight peak alpha |
| `saturation` | 100% | 190% | 180% | Backdrop chroma boost |

`intensity` (0-100) maps monotonically onto all five, with `fillAlpha` moving *inversely* — higher intensity means thinner glass but never below the 0.55 clamp.

**Anti-patterns the skill must refuse to generate:**

- Glass applied to `<body>`, `<main>`, a scroll container, a `<table>`, or any chart/canvas wrapper.
- Nested glass surfaces of any depth.
- Fill alpha below 0.55, or below 0.62 when the backdrop is user-supplied.
- Clear-variant glass without a dimming scrim beneath it.
- A `backdrop-filter` chain with no `@supports` fallback.
- Any transition or keyframe animating `backdrop-filter`, `filter`, or `border-radius`.
- Focus indicators that rely on the glass border, a background-colour change, or an opacity change alone.
- White text over a Clear surface with no scrim.
- Displacement maps loaded from an external URL inside `feImage`.
- User-agent sniffing to branch tiers instead of `@supports` / `CSS.supports`.
- Removing or overriding a user's `prefers-reduced-transparency` / `prefers-reduced-motion` preference.
- Marketing copy calling a blur-only implementation "Liquid Glass" — if `refractionScale` is 0, the emitted class names and docs say `glassmorphism`, not `liquid-glass`.

## 14. References

1. Meet Liquid Glass — WWDC25 Session 219 — https://developer.apple.com/videos/play/wwdc2025/219/ — Apple Inc. — 9 June 2025 — [primary]
2. Get to know the new design system — WWDC25 Session 356 — https://developer.apple.com/videos/play/wwdc2025/356/ — Apple Inc. — 9 June 2025 — [primary]
3. Apple Design Resources — New Design Gallery — https://developer.apple.com/design/new-design-gallery/ — Apple Inc. — expanded 6 November 2025 — [primary]
4. Filter Effects: define interoperable backdrop displacement/refraction for "liquid glass" UI (Issue #1142) — https://github.com/w3c/svgwg/issues/1142 — W3C SVG Working Group / filed by Jofdt — 25 June 2026 — [primary]
5. Opting your app out of the Liquid Glass redesign with Xcode 26 — https://www.donnywals.com/opting-your-app-out-of-the-liquid-glass-redesign-with-xcode-26/ — Donny Wals — 2025 — [primary]
6. callstack/liquid-glass — Liquid Glass in React Native — https://github.com/callstack/liquid-glass — Callstack — 2025-2026 — [primary]
7. Liquid Glass in the Browser: Refraction with CSS and SVG — https://kube.io/blog/liquid-glass-css-svg/ — kube.io — 2025 — [primary]
8. How to create Liquid Glass effects with CSS and SVG — https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/ — Rahul Chhodde, LogRocket — 8 December 2025 — [secondary]
9. Getting Clarity on Apple's Liquid Glass — https://css-tricks.com/getting-clarity-on-apples-liquid-glass/ — Geoff Graham, CSS-Tricks — 17 July 2025 — [secondary]
10. Liquid Glass — https://en.wikipedia.org/wiki/Liquid_Glass — Wikipedia — accessed 8 August 2026 — [secondary]
11. Apple Releases iOS 26.1 With Liquid Glass Toggle — https://www.macrumors.com/2025/11/03/apple-releases-ios-26-1/ — MacRumors — 3 November 2025 — [secondary]
12. Everything announced at Apple's WWDC 2026 keynote — https://www.engadget.com/2189698/everything-announced-at-apples-wwdc-2026-keynote/ — Engadget — 8 June 2026 — [secondary]
13. WWDC 2026: Liquid Glass (and a Rare Apple Concession) — https://drlogic.com/article/wwdc-2026-liquid-glass-and-a-rare-apple-concession/ — Dr Logic — 9 June 2026 — [secondary]
14. Liquid Glass is controversial, but it just won a prestigious design award — https://appleinsider.com/articles/26/05/14/liquid-glass-is-controversial-but-it-just-won-a-prestigious-design-award — AppleInsider — 14 May 2026 — [secondary]
15. Liquid Glass for Android is "not happening," at least not for Pixels — https://9to5google.com/2026/05/06/liquid-glass-for-android-is-not-happening-at-least-not-for-pixels/ — 9to5Google — 6 May 2026 — [secondary]
16. Glassmorphism vs neumorphism vs liquid glass (2026) — https://www.setproduct.com/blog/liquid-glass-vs-glassmorphism — Roman Kamushken, Setproduct — 9 June 2026 — [secondary]
17. Apple spotlights third-party apps adopting Liquid Glass in iOS 26 and more — https://9to5mac.com/2025/11/06/apple-spotlights-third-party-apps-adopting-liquid-glass-in-ios-26-and-more/ — 9to5Mac — 6 November 2025 — [secondary]
18. iOS 26 Beta 2 tones down the Liquid Glass effect — https://www.gsmarena.com/ios_26_beta_2_tones_down_the_liquid_glass_effect-news-68379.php — GSMArena — June 2025 — [secondary]
19. iOS 26: Reduce Transparency of Apple's Liquid Glass Design — https://www.macrumors.com/how-to/ios-reduce-transparency-liquid-glass-effect/ — MacRumors — 2025 — [secondary]
20. iOS 27 Liquid Glass vs iOS 26: What Apple Fixed in June 2026 — https://andrew.ooo/answers/ios-27-liquid-glass-vs-ios-26-accessibility-changes-june-2026/ — andrew.ooo — June 2026 — [secondary]
21. Instagram finally brings "Liquid Glass" UI to iOS navigation bar — https://piunikaweb.com/2026/02/13/instagram-liquid-glass-navbar-update-whatsapp-delay/ — PiunikaWeb — 13 February 2026 — [secondary]
22. Apple announces iOS 26 release date: September 15 — https://9to5mac.com/2025/09/09/apple-announces-ios-26-release-date-september-15/ — 9to5Mac — 9 September 2025 — [secondary]
