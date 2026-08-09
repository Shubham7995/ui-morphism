---
name: spatial-ui
title: Spatial UI
aliases: [spatial design, spatial computing UI, XR UI, depth UI, volumetric UI, 3D interface design, spatial interface, z-depth UI, spatial-inspired UI]
category: ui-morphism
origin_year: 2023
peak_years: 2024-2027
status_2026: emerging
difficulty: high
a11y_risk: high
perf_cost: medium
plugin_slug: spatial-ui
last_researched: 2026-08-08
---

## 1. Essence

Spatial UI treats the interface as a set of physical panels suspended at measured distances from the viewer rather than as ink printed on a page. Depth is not decoration: it is the primary hierarchy channel, replacing the drop-shadow elevation ladder with an actual z-axis, an actual camera, and an actual angular size budget. The feeling is of standing in a room full of floating glass surfaces that hold their apparent size no matter how far away they drift.

The single defining move is **distance-independent sizing**: an element is positioned at a depth, then counter-scaled so its *angular* size stays constant. Everything else — glass materials, ornaments, parallax, gaze-sized targets — follows from taking that one commitment seriously. This doc covers both the native XR dialect (visionOS, Android XR, Meta Horizon OS) and the flat-screen dialect that borrows its vocabulary for ordinary web UI, because in 2026 the second is far more likely to be what you actually ship.

## 2. Origin & Timeline

- **1993 — the term is coined.** "Spatial computing" appears in academic HCI literature long before Apple's marketing; Simon Greenwold's 2003 MIT Media Lab thesis is the citation most often used for the modern definition. Neither produced a UI style.
- **2010-2016 — the first industrial attempts.** Microsoft Kinect (2010), Google Glass (2013), Microsoft HoloLens (2016) and its Windows Mixed Reality Fluent Design work establish holographic panels, gaze cursors and world-locked content. HoloLens's design language is the direct ancestor of everything below, but it never reached consumer scale.
- **2019-2023 — WebXR and Quest.** The W3C Immersive Web WG advances the WebXR Device API; Meta Quest establishes flat panels floating in space as the default app presentation on a consumer headset.
- **25 August 2021 — W3C publishes XR Accessibility User Requirements (XAUR)** as a Working Group Note: 19 categories of user need, from motion-agnostic interaction to safe-harbour controls. This is still the only cross-vendor accessibility document for spatial interfaces in 2026.
- **5 June 2023 — WWDC23.** Apple announces Vision Pro and visionOS and, critically, *publishes the numbers*: 60pt minimum tap targets, 20pt ornament overlap, three vibrancy levels, glass window material, Dynamic Scale. Session "Design for spatial user interfaces" (WWDC23 10076) is the founding document of the style as a **design system** rather than a research area.
- **2 February 2024 — Apple Vision Pro ships in the US at $3,499.** IDC later puts 2024 shipments at roughly 390,000 units.
- **12 December 2024 — `androidx.xr.compose:1.0.0-alpha01`.** Google ships the first Jetpack Compose for XR alpha alongside the Android XR announcement, introducing `Subspace`, `SpatialPanel`, `Orbiter`, `SpatialRow/Column/Box`, `SpatialDialog`, `SpatialPopup` and `SpatialElevation`. The vocabulary of the style is now cross-vendor.
- **May 2025 — Meta begins rolling out "Navigator"**, a system-wide overlay UI for Horizon OS, replacing the older oval-shaped panel that obscured the view with a dimmed full-field overlay.
- **15 September 2025 — visionOS 26.** Persistent **spatial widgets** that anchor to walls and tables and survive between sessions, **spatial scenes** (2D photos converted to parallax depth), more realistic Personas, PlayStation VR2 Sense controller support. Safari on visionOS 26 adds **Spatial Browsing**, which is an app-level reader-mode-like feature on qualifying article pages, not a new web API.
- **21 October 2025 — Samsung Galaxy XR** (formerly Project Moohan) launches at **$1,799** as the first Android XR device: dual 3552×3840 micro-OLED at up to 90 Hz, Snapdragon XR2+ Gen 2, 16 GB / 256 GB, 545 g headset plus a 302 g tethered battery.
- **Late 2025 - 2026 — Google expands the Android XR design system** to three device classes (XR headsets, wired XR glasses, AI glasses) and publishes hard numbers the Apple HIG never did: 0.868 dp-to-dmm, 0.75-5 m depth range, 1.75 m spawn distance, 41° content cone, 5° downward tilt, a six-step `SpatialElevation` ladder in dp. **Material Design for XR** ships as a developer preview layered on Material 3.
- **Early 2026 — the headset market contracts sharply.** The figures below are quoted in identical form here and in §11; where a number is a *forecast* rather than a *measurement* it says so. All of them are analyst estimates from paywalled trackers (refs 24, 25), so treat them as directional and re-check before quoting onward.
  - **Measured:** IDC puts Vision Pro at roughly **45,000 units in 2025** against **390,000 in 2024**. Meta shipped about **1.7 million Quest units in the first three quarters of 2025, down 16% YoY**. Counterpoint reports Q1 2026 VR headset shipments **down 17% YoY and 39% QoQ**. Smart glasses grew **211.2%** in 2025.
  - **Forecast:** IDC expects overall MR/VR headset shipments to fall **42.8%** for 2025, and projects a **29.3% CAGR** for smart glasses through 2029.
  - The read either way: this contradicts the 2024 consensus that spatial UI would ride headset volume. **The hardware is shrinking while the design language spreads.**
- **February 2026 — Interop 2026 focus areas published.** Nineteen focus areas including **scroll-driven animations**, view transitions, anchor positioning and CSS `contrast-color()`. **WebXR is not among them, nor among the four investigation areas.** If you were told WebXR is an Interop 2026 target, that is wrong — I checked the `web-platform-tests/interop` 2026 README directly. The web platform is instead standardising exactly the primitives the *flat-screen* spatial dialect needs.
- **11 March 2026 — Meta's Immersive Web SDK UIKit docs updated**: a Three.js + Yoga flexbox 3D UI runtime with MSDF text and per-panel instancing, intrinsic sizes in centimetres converted to metres for world space.
- **16 May 2026 — `@react-three/uikit@1.0.73`.** (Package versions and publish dates move; check the npm registry rather than trusting this line.) The pmndrs stack (react-three-fiber, `@react-three/xr`, `@react-three/uikit`) is the de facto open-source spatial component library.
- **8-12 June 2026 — WWDC 2026 / visionOS 27.** Apple Newsroom (23 March 2026) put the conference at Monday 8 June to Friday 12 June; keynote and developer beta 1 on 8 June, general release expected autumn 2026. Docs 01, 08 and 10 all use that span. **Windows gain curvature**; a redesigned Control Center; notifications you interact with by eye; Siri becomes a placeable 3D orb activated by looking at it; panoramas convert to spatial scenes. RealityKit adds physical-space lighting, projective textures, 3D Gaussian splatting, cloth simulation and a reverb mesh API. New **Spatial Accessories** framework, plus **Spatial Preview** and **Foveated Streaming** for extending desktop software to the headset.
- **June 2026 — Meta completes the Navigator rollout** to all Quest headsets after more than a year of staged testing; seven tabs (You, Notifications, People, App Library, Quick Controls, Show/Hide Windows, Passthrough/VR Home). The Worlds tab, added October 2025, was removed in early 2026 when Horizon Worlds pivoted away from VR.
- **15 July 2026 — `androidx.xr.compose:1.0.0-alpha16`.** (Check `developer.android.com/jetpack/androidx/releases/xr-compose` for the current alpha; the exact number moves every few weeks. The *structural* claim is the durable one:) still alpha, nineteen months after alpha01, with no stable release. Treat the Android XR spatial API surface as unstable.
- **August 2026 — where it stands.** Spatial UI is **emerging, not dominant, and bifurcated.** The native XR dialect is a niche with excellent documentation and a shrinking install base. The flat-screen dialect — depth ladders, floating panels, orbiter-style chrome, pointer parallax, scroll-driven depth — is spreading fast through mainstream web and product design and is the version most teams will implement. It is neither dead nor dormant; it is a design vocabulary that outgrew its hardware.

## 3. Visual DNA

- **A real camera** — a single `perspective` value on a stage element, typically **1200px** for a punchy read and **2400-4000px** for a restrained one, with `perspective-origin` around **50% 42%** to mimic the 5° downward gaze angle Android XR specifies for panel placement.
- **A discrete depth ladder, not a shadow ladder** — six steps borrowed straight from Android XR's `SpatialElevation`: **0.1 / 16 / 24 / 32 / 40 / 56 dp**, mapped 1:1 to px on the web. Orbiters sit at 16, popovers at 32, dialogs at 56. Nothing lands between steps.
- **Distance-independent sizing (Dynamic Scale)** — an element pushed to `translateZ(56px)` under `perspective: 1200px` grows by `1200 / (1200 − 56) = 1.049`. Counter-scale by `(1200 − 56) / 1200 = 0.9533` so apparent size is unchanged and only the parallax and shadow read as depth. Android XR does the same thing physically: panels hold constant apparent size between **0.75 m and 1.75 m**, then scale at **0.5 m per m** beyond that.
- **Panels, not cards** — the atomic unit is a rectangular surface with **32px** corner radius (Android XR default), a hairline edge, and content that fills it edge to edge. Meta Horizon OS panels default to **1024 × 640 dp** with a **384 × 500 dp** minimum; Android XR caps panels at **2560 × 1800 dp**; visionOS windows default to **1280 × 720 pt**, which at 1360 pt/m is **0.941 m × 0.529 m** of real-world glass.
- **Ornaments / orbiters** — controls detach from the panel and float beside or in front of it. visionOS ornaments overlap the window's bottom edge by **20pt**; Android XR orbiters sit **20dp** clear of the panel edge at **15-16dp** of z-elevation and must never overlap the panel by more than **50%** of their own size.
- **Environment-sampling glass** — panels are translucent and pull colour from whatever is behind them, with **3 vibrancy tiers** (primary / secondary / tertiary) for foreground content. On the web: `backdrop-filter: blur(24-40px) saturate(165%)` over a fill whose alpha is set by contrast math, not by taste.
- **Depth-proportional shadow pairs** — every panel gets a tight contact shadow plus a wide ambient shadow, both scaled by depth step. At level 5 that is roughly `0 12px 28px -8px rgba(12,14,22,.26), 0 48px 96px -32px rgba(12,14,22,.42)`. Single-shadow elevation reads as flat-design, not spatial.
- **Gaze-grade hit targets** — **60pt minimum** on visionOS because eye tracking is imprecise; **56 × 56 dp** recommended on Android XR with a **48dp** visual icon inside it and **4dp** offset between target and affordance. Compare **44pt** on iOS and **24 × 24 CSS px** as the WCAG 2.2 floor. Spatial UI's targets are 1.4-2.5× larger than flat UI's.
- **Generous, quantised spacing** — **8dp** minimum between adjacent targets, **16pt** between stacked buttons, **4pt** of focus-feedback padding inside lists. Density is deliberately low; a spatial panel holds roughly half the controls a desktop panel does.
- **One weight step bolder** — visionOS shifts body copy from Regular to **Medium** and titles from Semibold to **Bold**, with slightly increased tracking. Android XR sets a **14dp** floor on font size and asks for Normal weight or heavier. Nothing is lighter than 500 on glass.
- **A comfort cone** — primary content lives inside the central **41°** of the field of view. At a 500 mm laptop viewing distance that cone is `2 × 500 × tan(20.5°) ≈ 374 mm ≈ 1413 CSS px` wide; at 600 mm it is ≈ 1693 px. That is a defensible derivation for a max content width, not a round number pulled from a grid.
- **Parallax as the depth confirmation** — layers translate against each other on pointer move, scroll or head motion. Amplitude is small: **8-16px** of translation and **2-6°** of tilt across the full input range. More than that and the illusion breaks into nausea.
- **Concentric, continuous corners** — outer radius equals inner radius plus the padding between them. Apple states the rule explicitly; it matters more in spatial UI because nested panels are seen off-axis and mismatched arcs are obvious.

## 4. Anatomy & Design Tokens

Every name in the Token column is the **exact custom property emitted by the CSS block below it** — copy `var(--sp-…)` straight out of the table and it resolves. `--sp-` is the single prefix for this doc; the only other custom properties that appear anywhere here are per-element locals written with a leading underscore (`--_depth`, `--_z` in §5) and Tailwind v4's own namespaced keys (`--color-sp-*`, `--radius-sp-*`, …) in the mirror.

| Group | Token | Light value | Dark value | Provenance |
|---|---|---|---|---|
| Camera | `--sp-perspective` | `1200px` | same | web analogue of a 1.75 m spawn distance |
| Camera | `--sp-perspective-origin` | `50% 42%` | same | Android XR: panel centre 5° below eye level |
| Camera | `--sp-comfort-width` | `1413px` | same | 41° cone at 500 mm viewing distance |
| Camera | `--sp-comfort-width-desk` | `1693px` | same | the same 41° cone at a 600 mm desk distance |
| Depth | `--sp-z-0` … `--sp-z-5` | `0.1 / 16 / 24 / 32 / 40 / 56 px` | same | Android XR `SpatialElevationLevel` (dp) |
| Depth | `--sp-z-push` (behind modal) | `-125px` | same | Android XR `SpatialDialog` panel pushback |
| Depth | `--sp-k-1` … `--sp-k-5` | `0.98667 / 0.98 / 0.97333 / 0.96667 / 0.95333` | same | counter-scale, `1 − z / perspective` |
| Surface | `--sp-env` / `--sp-env-2` | `#E8EAF0` / `#DFE2EA` | `#0B0C10` / `#131620` | neutral room, low chroma so glass reads |
| Surface | `--sp-panel` | `rgba(255,255,255,0.72)` | `rgba(22,24,30,0.72)` | visionOS-style translucency. 0.72 already clears 4.5:1 against `--sp-ink-1` over *any* backdrop — 9.53:1 light, 6.52:1 dark, worst case (§7) |
| Surface | `--sp-panel-legible` | `rgba(255,255,255,0.92)` | `rgba(22,24,30,0.90)` | contrast-safe over arbitrary backdrops: 15.87:1 (light) / 12.37:1 (dark) worst case, per-channel sRGB compositing (§7) |
| Surface | `--sp-panel-opaque` | `#F7F8FB` | `#15171D` | reduce-transparency / forced-colors |
| Surface | `--sp-hairline` | `rgba(16,16,20,0.12)` | `rgba(255,255,255,0.16)` | 1px edge so panels read at glancing angles |
| Surface | `--sp-specular` | `rgba(255,255,255,0.65)` | `rgba(255,255,255,0.28)` | top edge highlight, 1px |
| Material | `--sp-blur` / `--sp-blur-strong` | `24px` / `40px` | same | matches perceptual weight of system glass |
| Material | `--sp-saturate` | `165%` | `150%` | keeps refracted colour from going grey |
| Ink | `--sp-ink-1` | `#101014` | `#F5F6FA` | vibrancy tier 1 |
| Ink | `--sp-ink-2` | `#43464F` | `#B9BDC9` | vibrancy tier 2 |
| Ink | `--sp-ink-3` | `#6B6F7B` | `#868B98` | vibrancy tier 3 |
| Radius | `--sp-radius-panel` / `-card` / `-control` / `-capsule` | `32 / 20 / 14 / 999 px` | same | Android XR 32dp panel default |
| Target | `--sp-target-gaze` / `--sp-target-pointer` / `--sp-target-floor` | `60 / 44 / 24 px` | same | visionOS 60pt, iOS 44pt, WCAG 2.2 SC 2.5.8. The floor is a clamp `.sp-btn` wraps in `max()`, never a size to design to — see §7 |
| Spacing | `--sp-gap-list` / `--sp-gap-target` / `--sp-gap-stack` / `--sp-orbiter-offset` | `4 / 8 / 16 / 20 px` | same | WWDC23 10076 + Android XR orbiter guidance |
| Type | `--sp-font-min` / `--sp-text-body` / `--sp-text-title` | `14 / 17 / 22 px` | same | Android XR 14dp floor |
| Type | `--sp-weight-body` / `--sp-weight-title` / `--sp-tracking` | `500 / 700 / 0.01em` | same | visionOS weight bump; text sits on a moving backdrop |
| Shadow | `--sp-shadow-1` | `0 2px 6px -2px rgba(12,14,22,.18), 0 8px 20px -8px rgba(12,14,22,.22)` | `0 2px 6px -2px rgba(0,0,0,.42), 0 8px 20px -8px rgba(0,0,0,.48)` | contact + ambient pair |
| Shadow | `--sp-shadow-2` | `0 4px 10px -3px rgba(12,14,22,.20), 0 14px 32px -12px rgba(12,14,22,.26)` | `0 4px 10px -3px rgba(0,0,0,.46), 0 14px 32px -12px rgba(0,0,0,.52)` | contact + ambient pair |
| Shadow | `--sp-shadow-3` | `0 6px 14px -4px rgba(12,14,22,.22), 0 22px 48px -18px rgba(12,14,22,.30)` | `0 6px 14px -4px rgba(0,0,0,.50), 0 22px 48px -18px rgba(0,0,0,.56)` | contact + ambient pair |
| Shadow | `--sp-shadow-4` | `0 9px 20px -6px rgba(12,14,22,.24), 0 34px 70px -24px rgba(12,14,22,.36)` | `0 9px 20px -6px rgba(0,0,0,.54), 0 34px 70px -24px rgba(0,0,0,.60)` | contact + ambient pair |
| Shadow | `--sp-shadow-5` | `0 12px 28px -8px rgba(12,14,22,.26), 0 48px 96px -32px rgba(12,14,22,.42)` | `0 12px 28px -8px rgba(0,0,0,.58), 0 48px 96px -32px rgba(0,0,0,.66)` | contact + ambient pair. Dark keeps the geometry but swaps the tinted ink for pure black at roughly twice the alpha — a tinted shadow is invisible on a `#0B0C10` room |
| Motion | `--sp-dur-hover` / `-depth` / `-panel` | `120 / 320 / 480 ms` | same | short state, medium depth, long scene |
| Motion | `--sp-ease-depth` | `cubic-bezier(.2,0,0,1)` | same | emphasised decelerate |
| Motion | `--sp-ease-settle` | `cubic-bezier(.34,1.32,.64,1)` | same | slight overshoot on panel arrival |
| Motion | `--sp-parallax-translate` / `--sp-parallax-tilt` | `12px` / `4deg` | same | full-range amplitude, nausea-safe; both drop to zero under `prefers-reduced-motion` |

```css
:root {
  color-scheme: light dark;

  /* ---- Stage / camera ---- */
  --sp-perspective: 1200px;
  --sp-perspective-origin: 50% 42%;
  --sp-comfort-width: 1413px;      /* 41° cone at 500mm */
  --sp-comfort-width-desk: 1693px; /* 41° cone at 600mm */

  /* ---- Depth ladder (Android XR SpatialElevation, dp -> px) ---- */
  --sp-z-0: 0.1px;
  --sp-z-1: 16px;   /* orbiter, floating chrome */
  --sp-z-2: 24px;   /* raised panel */
  --sp-z-3: 32px;   /* popover, menu */
  --sp-z-4: 40px;   /* sheet */
  --sp-z-5: 56px;   /* modal dialog */
  --sp-z-push: -125px;

  /* ---- Counter-scale = 1 - z / perspective (Dynamic Scale) ---- */
  --sp-k-1: 0.98667;
  --sp-k-2: 0.98000;
  --sp-k-3: 0.97333;
  --sp-k-4: 0.96667;
  --sp-k-5: 0.95333;

  /* ---- Surfaces ---- */
  --sp-env: #e8eaf0;
  --sp-env-2: #dfe2ea;
  --sp-panel: rgba(255, 255, 255, 0.72);
  --sp-panel-legible: rgba(255, 255, 255, 0.92);
  --sp-panel-opaque: #f7f8fb;
  --sp-hairline: rgba(16, 16, 20, 0.12);
  --sp-specular: rgba(255, 255, 255, 0.65);

  /* ---- Material ---- */
  --sp-blur: 24px;
  --sp-blur-strong: 40px;
  --sp-saturate: 165%;

  /* ---- Ink (3 vibrancy tiers) ---- */
  --sp-ink-1: #101014;
  --sp-ink-2: #43464f;
  --sp-ink-3: #6b6f7b;

  /* ---- Radius ---- */
  --sp-radius-panel: 32px;
  --sp-radius-card: 20px;
  --sp-radius-control: 14px;
  --sp-radius-capsule: 999px;

  /* ---- Targets & spacing ---- */
  --sp-target-gaze: 60px;
  --sp-target-pointer: 44px;
  --sp-target-floor: 24px;
  --sp-gap-list: 4px;
  --sp-gap-target: 8px;
  --sp-gap-stack: 16px;
  --sp-orbiter-offset: 20px;

  /* ---- Type ---- */
  --sp-font-min: 14px;
  --sp-text-body: 17px;
  --sp-text-title: 22px;
  --sp-weight-body: 500;
  --sp-weight-title: 700;
  --sp-tracking: 0.01em;

  /* ---- Shadows: contact + ambient, per depth step ---- */
  --sp-shadow-1: 0 2px 6px -2px rgba(12, 14, 22, 0.18),
                 0 8px 20px -8px rgba(12, 14, 22, 0.22);
  --sp-shadow-2: 0 4px 10px -3px rgba(12, 14, 22, 0.20),
                 0 14px 32px -12px rgba(12, 14, 22, 0.26);
  --sp-shadow-3: 0 6px 14px -4px rgba(12, 14, 22, 0.22),
                 0 22px 48px -18px rgba(12, 14, 22, 0.30);
  --sp-shadow-4: 0 9px 20px -6px rgba(12, 14, 22, 0.24),
                 0 34px 70px -24px rgba(12, 14, 22, 0.36);
  --sp-shadow-5: 0 12px 28px -8px rgba(12, 14, 22, 0.26),
                 0 48px 96px -32px rgba(12, 14, 22, 0.42);

  /* ---- Motion ---- */
  --sp-dur-hover: 120ms;
  --sp-dur-depth: 320ms;
  --sp-dur-panel: 480ms;
  --sp-ease-depth: cubic-bezier(0.2, 0, 0, 1);
  --sp-ease-settle: cubic-bezier(0.34, 1.32, 0.64, 1);
  --sp-parallax-translate: 12px;
  --sp-parallax-tilt: 4deg;
}

/* Light values live on bare `:root` above. The dark set is written twice:
   once guarded so it cannot beat an explicit `data-theme="light"`, and once
   under `:root[data-theme="dark"]` so a manual toggle beats the OS
   preference. Same shape as docs 01, 02, 04, 05, 06, 07, 08 and 09. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --sp-env: #0b0c10;
    --sp-env-2: #131620;
    --sp-panel: rgba(22, 24, 30, 0.72);
    --sp-panel-legible: rgba(22, 24, 30, 0.90);
    --sp-panel-opaque: #15171d;
    --sp-hairline: rgba(255, 255, 255, 0.16);
    --sp-specular: rgba(255, 255, 255, 0.28);
    --sp-saturate: 150%;
    --sp-ink-1: #f5f6fa;
    --sp-ink-2: #b9bdc9;
    --sp-ink-3: #868b98;
    --sp-shadow-1: 0 2px 6px -2px rgba(0, 0, 0, 0.42),
                   0 8px 20px -8px rgba(0, 0, 0, 0.48);
    --sp-shadow-2: 0 4px 10px -3px rgba(0, 0, 0, 0.46),
                   0 14px 32px -12px rgba(0, 0, 0, 0.52);
    --sp-shadow-3: 0 6px 14px -4px rgba(0, 0, 0, 0.50),
                   0 22px 48px -18px rgba(0, 0, 0, 0.56);
    --sp-shadow-4: 0 9px 20px -6px rgba(0, 0, 0, 0.54),
                   0 34px 70px -24px rgba(0, 0, 0, 0.60);
    --sp-shadow-5: 0 12px 28px -8px rgba(0, 0, 0, 0.58),
                   0 48px 96px -32px rgba(0, 0, 0, 0.66);
  }
}

/* Explicit opt-in override, so a toggle beats the media query both ways. */
:root[data-theme="dark"] {
  color-scheme: dark;
  --sp-env: #0b0c10;
  --sp-env-2: #131620;
  --sp-panel: rgba(22, 24, 30, 0.72);
  --sp-panel-legible: rgba(22, 24, 30, 0.90);
  --sp-panel-opaque: #15171d;
  --sp-hairline: rgba(255, 255, 255, 0.16);
  --sp-specular: rgba(255, 255, 255, 0.28);
  --sp-saturate: 150%;
  --sp-ink-1: #f5f6fa;
  --sp-ink-2: #b9bdc9;
  --sp-ink-3: #868b98;
  --sp-shadow-1: 0 2px 6px -2px rgba(0, 0, 0, 0.42),
                 0 8px 20px -8px rgba(0, 0, 0, 0.48);
  --sp-shadow-2: 0 4px 10px -3px rgba(0, 0, 0, 0.46),
                 0 14px 32px -12px rgba(0, 0, 0, 0.52);
  --sp-shadow-3: 0 6px 14px -4px rgba(0, 0, 0, 0.50),
                 0 22px 48px -18px rgba(0, 0, 0, 0.56);
  --sp-shadow-4: 0 9px 20px -6px rgba(0, 0, 0, 0.54),
                 0 34px 70px -24px rgba(0, 0, 0, 0.60);
  --sp-shadow-5: 0 12px 28px -8px rgba(0, 0, 0, 0.58),
                 0 48px 96px -32px rgba(0, 0, 0, 0.66);
}
:root[data-theme="light"] { color-scheme: light; }

/* Users who ask for less transparency get solid panels and no sampling.
   These preference blocks come after the theme blocks so they win in both. */
@media (prefers-reduced-transparency: reduce) {
  :root {
    --sp-panel: var(--sp-panel-opaque);
    --sp-panel-legible: var(--sp-panel-opaque);
    --sp-blur: 0px;
    --sp-blur-strong: 0px;
    --sp-saturate: 100%;
  }
}

/* Users who ask for less motion get depth without movement. */
@media (prefers-reduced-motion: reduce) {
  :root {
    --sp-parallax-translate: 0px;
    --sp-parallax-tilt: 0deg;
    --sp-dur-depth: 1ms;
    --sp-dur-panel: 1ms;
  }
}

/* Windows High Contrast / forced colors: flatten completely. */
@media (forced-colors: active) {
  :root {
    --sp-perspective: none;
    --sp-panel: Canvas;
    --sp-panel-legible: Canvas;
    --sp-panel-opaque: Canvas;
    --sp-hairline: CanvasText;
    --sp-blur: 0px;
    --sp-saturate: 100%;
    --sp-shadow-1: none;
    --sp-shadow-2: none;
    --sp-shadow-3: none;
    --sp-shadow-4: none;
    --sp-shadow-5: none;
  }
}
```

## 5. Implementation Recipes

### Vanilla CSS

```html
<div class="sp-stage" id="stage">
  <div class="sp-layer sp-layer--bg" data-depth="0.25"></div>

  <section class="sp-panel sp-depth-2" data-depth="1">
    <header class="sp-panel__head">
      <h2 class="sp-title">Flight 1187</h2>
      <p class="sp-sub">Gate C14 &middot; boards 18:40</p>
    </header>
    <div class="sp-panel__body">
      <p class="sp-body">Seat 14A, window. Checked bag tracked to carousel 3.</p>
    </div>

    <!-- Ornament / orbiter: floats 16px in front, overlaps bottom edge by 20px -->
    <nav class="sp-orbiter" aria-label="Trip actions">
      <button class="sp-btn" type="button">Boarding pass</button>
      <button class="sp-btn" type="button">Directions</button>
      <button class="sp-btn" type="button">Share</button>
    </nav>
  </section>
</div>
```

```css
/* ---------- Stage: the only element that owns a camera ---------- */
.sp-stage {
  position: relative;
  perspective: var(--sp-perspective);
  perspective-origin: var(--sp-perspective-origin);
  transform-style: preserve-3d;
  max-width: var(--sp-comfort-width);
  margin-inline: auto;
  padding: 64px 24px 96px;
  background: radial-gradient(120% 90% at 50% 0%, var(--sp-env-2), var(--sp-env));
  min-height: 100svh;
  isolation: isolate;
}

/* ---------- Depth utilities ---------- */
.sp-depth-1 { transform: translateZ(var(--sp-z-1)) scale(var(--sp-k-1)); box-shadow: var(--sp-shadow-1); }
.sp-depth-2 { transform: translateZ(var(--sp-z-2)) scale(var(--sp-k-2)); box-shadow: var(--sp-shadow-2); }
.sp-depth-3 { transform: translateZ(var(--sp-z-3)) scale(var(--sp-k-3)); box-shadow: var(--sp-shadow-3); }
.sp-depth-4 { transform: translateZ(var(--sp-z-4)) scale(var(--sp-k-4)); box-shadow: var(--sp-shadow-4); }
.sp-depth-5 { transform: translateZ(var(--sp-z-5)) scale(var(--sp-k-5)); box-shadow: var(--sp-shadow-5); }

/* ---------- Panel ---------- */
.sp-panel {
  position: relative;
  transform-style: preserve-3d;
  border-radius: var(--sp-radius-panel);
  background: var(--sp-panel);
  border: 1px solid var(--sp-hairline);
  color: var(--sp-ink-1);
  padding: 28px 28px 44px;
  max-width: 640px;
  margin-inline: auto;
  transition:
    transform var(--sp-dur-depth) var(--sp-ease-depth),
    box-shadow var(--sp-dur-depth) var(--sp-ease-depth),
    background-color var(--sp-dur-hover) linear;
  will-change: transform;
}

/* Glass only where the browser can actually sample a backdrop. */
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .sp-panel {
    -webkit-backdrop-filter: blur(var(--sp-blur)) saturate(var(--sp-saturate));
    backdrop-filter: blur(var(--sp-blur)) saturate(var(--sp-saturate));
  }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .sp-panel { background: var(--sp-panel-opaque); }
}

/* 1px specular rim on the top edge only. */
.sp-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(180deg, var(--sp-specular), transparent 42%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
  pointer-events: none;
}

/* ---------- Typography ---------- */
.sp-title { font-size: var(--sp-text-title); font-weight: var(--sp-weight-title);
            letter-spacing: var(--sp-tracking); margin: 0 0 4px; }
.sp-sub   { font-size: var(--sp-font-min); font-weight: var(--sp-weight-body);
            color: var(--sp-ink-2); margin: 0; }
.sp-body  { font-size: var(--sp-text-body); font-weight: var(--sp-weight-body);
            line-height: 1.55; margin: 20px 0 0; }

/* ---------- Orbiter: detached chrome at depth level 1 ---------- */
.sp-orbiter {
  position: absolute;
  left: 50%;
  bottom: calc(-1 * var(--sp-orbiter-offset));
  display: flex;
  gap: var(--sp-gap-target);
  padding: 6px;
  border-radius: var(--sp-radius-capsule);
  background: var(--sp-panel-legible);
  border: 1px solid var(--sp-hairline);
  box-shadow: var(--sp-shadow-1);
  transform: translate3d(-50%, 0, var(--sp-z-1)) scale(var(--sp-k-1));
}
@supports (backdrop-filter: blur(1px)) {
  .sp-orbiter {
    backdrop-filter: blur(var(--sp-blur-strong)) saturate(var(--sp-saturate));
  }
}

/* ---------- Gaze-grade controls ---------- */
.sp-btn {
  /* max() makes --sp-target-floor load-bearing rather than decorative: even if
     a host theme overrides --sp-target-pointer downward, the rendered control
     cannot fall under the 24px SC 2.5.8 floor. See §7. */
  min-height: max(var(--sp-target-floor), var(--sp-target-pointer));
  min-width: max(var(--sp-target-floor), var(--sp-target-pointer));
  padding: 0 18px;
  border: 0;
  border-radius: var(--sp-radius-capsule);
  background: transparent;
  color: var(--sp-ink-1);
  font: inherit;
  font-size: var(--sp-font-min);
  font-weight: var(--sp-weight-body);
  cursor: pointer;
  transition: transform var(--sp-dur-hover) var(--sp-ease-depth),
              background-color var(--sp-dur-hover) linear;
}
/* Pointer-coarse and gaze contexts get the 60px visionOS target, clamped by
   the same floor. */
@media (pointer: coarse), (hover: none) {
  .sp-btn {
    min-height: max(var(--sp-target-floor), var(--sp-target-gaze));
    min-width: max(var(--sp-target-floor), var(--sp-target-gaze));
  }
}
.sp-btn:hover { background: color-mix(in oklab, var(--sp-ink-1) 10%, transparent);
                transform: translateZ(6px); }
.sp-btn:active { transform: translateZ(-2px); }
.sp-btn:focus-visible {
  outline: 3px solid #0a63f8;
  outline-offset: 3px;
  border-radius: var(--sp-radius-capsule);
}
.sp-btn[disabled] { opacity: 0.4; cursor: not-allowed; transform: none; }

/* ---------- Parallax layers driven by two custom properties ---------- */
@property --sp-px { syntax: "<number>"; initial-value: 0; inherits: true; }
@property --sp-py { syntax: "<number>"; initial-value: 0; inherits: true; }

.sp-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform:
    translate3d(
      calc(var(--sp-px) * var(--sp-parallax-translate) * var(--_depth, 1)),
      calc(var(--sp-py) * var(--sp-parallax-translate) * var(--_depth, 1)),
      0
    );
  transition: transform 60ms linear;
}
.sp-layer--bg {
  /* Per-element local, underscore-prefixed like `--_travel` in doc 01: a bare
     `--depth` on a host ancestor would silently feed this translate. */
  --_depth: 0.25;
  background:
    radial-gradient(38% 28% at 22% 18%, rgba(120, 160, 255, 0.28), transparent 70%),
    radial-gradient(34% 26% at 78% 30%, rgba(255, 150, 190, 0.22), transparent 70%);
  filter: blur(28px);
}

/* Tilt the whole stage very slightly toward the pointer. */
.sp-stage[data-tilt="on"] {
  transform: rotateX(calc(var(--sp-py) * var(--sp-parallax-tilt) * -1))
             rotateY(calc(var(--sp-px) * var(--sp-parallax-tilt)));
  transition: transform 120ms var(--sp-ease-depth);
}

/* ---------- Reduced motion: keep the depth, drop the movement ---------- */
@media (prefers-reduced-motion: reduce) {
  .sp-panel, .sp-btn, .sp-layer, .sp-stage[data-tilt="on"] { transition: none; }
  .sp-stage[data-tilt="on"] { transform: none; }
}

/* ---------- Forced colors: no camera, no glass, visible edges ---------- */
@media (forced-colors: active) {
  .sp-stage { perspective: none; }
  .sp-panel, .sp-orbiter { transform: none; backdrop-filter: none; forced-color-adjust: none;
                           background: Canvas; border: 1px solid CanvasText; }
  .sp-panel::before, .sp-layer { display: none; }
  .sp-btn:focus-visible { outline: 3px solid Highlight; }
}
```

```js
// Pointer parallax, rAF-coalesced, opt-out honoured, ~0.2ms of main thread per frame.
(function () {
  const stage = document.getElementById("stage");
  if (!stage) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(pointer: fine)");
  let raf = 0;
  let nx = 0;
  let ny = 0;

  function apply() {
    raf = 0;
    stage.style.setProperty("--sp-px", nx.toFixed(4));
    stage.style.setProperty("--sp-py", ny.toFixed(4));
  }

  function onMove(event) {
    const rect = stage.getBoundingClientRect();
    nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;  // -1 .. 1
    ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;  // -1 .. 1
    nx = Math.max(-1, Math.min(1, nx));
    ny = Math.max(-1, Math.min(1, ny));
    if (!raf) raf = requestAnimationFrame(apply);
  }

  function reset() {
    nx = 0;
    ny = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  }

  function sync() {
    const on = fine.matches && !reduce.matches;
    stage.dataset.tilt = on ? "on" : "off";
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", reset);
    if (on) {
      stage.addEventListener("pointermove", onMove, { passive: true });
      stage.addEventListener("pointerleave", reset, { passive: true });
    } else {
      reset();
    }
  }

  reduce.addEventListener("change", sync);
  fine.addEventListener("change", sync);
  sync();
})();
```

### Tailwind CSS v4

No plugin is required. Tailwind v4's `@theme` block emits the tokens as real custom properties, and `perspective-*`, `transform-3d`, `translate-z-*`, `rotate-x-*` and `backface-*` ship in core as of v4.

```css
/* app.css */
@import "tailwindcss";

@theme {
  /* Camera */
  --perspective-stage: 1200px;

  /* Depth ladder. The key name is what appears in the utility, so these
     generate translate-z-sp-z0 … translate-z-sp-z5 (not …-sp-1 … …-sp-5). */
  --spacing-sp-z0: 0.1px;
  --spacing-sp-z1: 16px;
  --spacing-sp-z2: 24px;
  --spacing-sp-z3: 32px;
  --spacing-sp-z4: 40px;
  --spacing-sp-z5: 56px;

  /* Radii */
  --radius-sp-panel: 32px;
  --radius-sp-card: 20px;
  --radius-sp-control: 14px;

  /* Colors */
  --color-sp-env: #e8eaf0;
  --color-sp-panel: rgb(255 255 255 / 0.72);
  --color-sp-panel-legible: rgb(255 255 255 / 0.92);
  --color-sp-hairline: rgb(16 16 20 / 0.12);
  --color-sp-ink-1: #101014;
  --color-sp-ink-2: #43464f;

  /* Shadows */
  --shadow-sp-1: 0 2px 6px -2px rgb(12 14 22 / 0.18), 0 8px 20px -8px rgb(12 14 22 / 0.22);
  --shadow-sp-3: 0 6px 14px -4px rgb(12 14 22 / 0.22), 0 22px 48px -18px rgb(12 14 22 / 0.30);
  --shadow-sp-5: 0 12px 28px -8px rgb(12 14 22 / 0.26), 0 48px 96px -32px rgb(12 14 22 / 0.42);

  /* Motion */
  --ease-sp-depth: cubic-bezier(0.2, 0, 0, 1);
  --ease-sp-settle: cubic-bezier(0.34, 1.32, 0.64, 1);
}

/* `@theme` above is at the top level, which is the only place Tailwind v4
   processes it. Overrides go here, as plain custom-property redeclarations
   inside `@layer theme` — never as a `@theme` block nested in an at-rule. */
@layer theme {
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --color-sp-env: #0b0c10;
      --color-sp-panel: rgb(22 24 30 / 0.72);
      --color-sp-panel-legible: rgb(22 24 30 / 0.90);
      --color-sp-hairline: rgb(255 255 255 / 0.16);
      --color-sp-ink-1: #f5f6fa;
      --color-sp-ink-2: #b9bdc9;
    }
  }

  /* Explicit opt-in, so a toggle beats the media query in both directions. */
  :root[data-theme="dark"] {
    color-scheme: dark;
    --color-sp-env: #0b0c10;
    --color-sp-panel: rgb(22 24 30 / 0.72);
    --color-sp-panel-legible: rgb(22 24 30 / 0.90);
    --color-sp-hairline: rgb(255 255 255 / 0.16);
    --color-sp-ink-1: #f5f6fa;
    --color-sp-ink-2: #b9bdc9;
  }
  :root[data-theme="light"] { color-scheme: light; }
}

/* Depth utility bundles level + counter-scale + shadow in one class. */
@utility sp-depth-* {
  /* Underscore-prefixed local: a bare `--z` is a name a host app is very
     likely to have already taken, and it would feed both calcs below. */
  --_z: --value(integer);
  transform: translateZ(calc(var(--_z) * 8px + 8px))
             scale(calc(1 - (var(--_z) * 8px + 8px) / 1200));
}

/* Glass that degrades on its own. */
@utility sp-glass {
  background-color: var(--color-sp-panel);
  border: 1px solid var(--color-sp-hairline);
  @supports (backdrop-filter: blur(1px)) {
    backdrop-filter: blur(24px) saturate(165%);
    -webkit-backdrop-filter: blur(24px) saturate(165%);
  }
  @media (prefers-reduced-transparency: reduce) {
    background-color: var(--color-sp-panel-legible);
    backdrop-filter: none;
  }
  @media (forced-colors: active) {
    background-color: Canvas;
    border-color: CanvasText;
    backdrop-filter: none;
  }
}
```

```html
<!-- `--perspective-stage` is registered in @theme, so the generated utility is
     `perspective-stage`; the `perspective-[var(--perspective-stage)]` longhand
     works but is noise. Note also `pointer-coarse:` below — `max-*` in v4 is
     reserved for breakpoint and container-query negation, so
     `max-pointer-coarse:` does not compile at all and the 60px gaze-target
     upsize (this doc's headline accessibility rule) would never apply. The
     negation, if you need it, is `not-pointer-coarse:`. -->
<div class="perspective-stage [perspective-origin:50%_42%]
            transform-3d mx-auto max-w-[1413px] bg-sp-env px-6 py-16 min-h-svh isolate">

  <section class="relative transform-3d mx-auto max-w-[640px] rounded-sp-panel sp-glass
                  text-sp-ink-1 px-7 pt-7 pb-11 shadow-sp-3
                  translate-z-sp-z3 scale-[0.97333]
                  transition-[transform,box-shadow] duration-[320ms] ease-sp-depth
                  hover:translate-z-sp-z4 hover:shadow-sp-5
                  motion-reduce:transition-none motion-reduce:hover:translate-z-sp-z3">

    <h2 class="text-[22px] font-bold tracking-[0.01em]">Flight 1187</h2>
    <p class="mt-1 text-sm font-medium text-sp-ink-2">Gate C14 · boards 18:40</p>
    <p class="mt-5 text-[17px]/[1.55] font-medium">
      Seat 14A, window. Checked bag tracked to carousel 3.
    </p>

    <nav aria-label="Trip actions"
         class="absolute left-1/2 -bottom-5 flex gap-2 rounded-full p-1.5 sp-glass
                shadow-sp-1 -translate-x-1/2 translate-z-sp-z1">
      <button type="button"
              class="min-h-11 min-w-11 rounded-full px-4 text-sm font-medium
                     transition-transform duration-[120ms] ease-sp-depth
                     hover:bg-sp-ink-1/10 hover:translate-z-[6px]
                     focus-visible:outline-3 focus-visible:outline-offset-[3px]
                     focus-visible:outline-blue-600
                     disabled:opacity-40 disabled:hover:translate-z-0
                     pointer-coarse:min-h-15 pointer-coarse:min-w-15">
        Boarding pass
      </button>
    </nav>
  </section>
</div>
```

### React component

TypeScript, no dependencies beyond React 18+. Ships a stage that owns the camera and the parallax, plus a panel that consumes the depth ladder.

```tsx
// SpatialPanel.tsx
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type DepthLevel = 0 | 1 | 2 | 3 | 4 | 5;

const DEPTH_PX: Record<DepthLevel, number> = { 0: 0.1, 1: 16, 2: 24, 3: 32, 4: 40, 5: 56 };

const SHADOWS: Record<DepthLevel, string> = {
  0: "none",
  1: "0 2px 6px -2px rgba(12,14,22,.18), 0 8px 20px -8px rgba(12,14,22,.22)",
  2: "0 4px 10px -3px rgba(12,14,22,.20), 0 14px 32px -12px rgba(12,14,22,.26)",
  3: "0 6px 14px -4px rgba(12,14,22,.22), 0 22px 48px -18px rgba(12,14,22,.30)",
  4: "0 9px 20px -6px rgba(12,14,22,.24), 0 34px 70px -24px rgba(12,14,22,.36)",
  5: "0 12px 28px -8px rgba(12,14,22,.26), 0 48px 96px -32px rgba(12,14,22,.42)",
};

type StageContextValue = { perspective: number; intensity: number; animate: boolean };

const StageContext = createContext<StageContextValue>({
  perspective: 1200,
  intensity: 60,
  animate: true,
});

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export interface SpatialStageProps {
  children: ReactNode;
  /** Camera distance in px. 800 = dramatic, 1200 = default, 4000 = subtle. */
  perspective?: number;
  /** 0-100. Scales parallax amplitude and tilt. 0 disables both. */
  intensity?: number;
  /** Max content width; 1413px is the 41 degree comfort cone at 500mm. */
  maxWidth?: number;
  className?: string;
}

export function SpatialStage({
  children,
  perspective = 1200,
  intensity = 60,
  maxWidth = 1413,
  className,
}: SpatialStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reduced = usePrefersReducedMotion();
  const active = intensity > 0 && !reduced;

  const write = useCallback((x: number, y: number) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--sp-px", x.toFixed(4));
    node.style.setProperty("--sp-py", y.toFixed(4));
  }, []);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!active || event.pointerType !== "mouse") return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        write(x, y);
      });
    },
    [active, write],
  );

  const onPointerLeave = useCallback(() => write(0, 0), [write]);

  useEffect(() => {
    if (!active) write(0, 0);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [active, write]);

  const amp = (intensity / 100) * 12; // px
  const tilt = (intensity / 100) * 4; // deg

  const style: CSSProperties = {
    perspective: `${perspective}px`,
    perspectiveOrigin: "50% 42%",
    transformStyle: "preserve-3d",
    maxWidth: `${maxWidth}px`,
    marginInline: "auto",
    isolation: "isolate",
    // Consumed by children via var(--sp-amp) / var(--sp-tilt).
    ["--sp-amp" as string]: `${amp}px`,
    ["--sp-tilt" as string]: `${tilt}deg`,
    ["--sp-px" as string]: "0",
    ["--sp-py" as string]: "0",
    transform: active
      ? "rotateX(calc(var(--sp-py) * var(--sp-tilt) * -1)) rotateY(calc(var(--sp-px) * var(--sp-tilt)))"
      : undefined,
    transition: active ? "transform 120ms cubic-bezier(.2,0,0,1)" : undefined,
  };

  return (
    <StageContext.Provider value={{ perspective, intensity, animate: active }}>
      <div
        ref={ref}
        className={className}
        style={style}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {children}
      </div>
    </StageContext.Provider>
  );
}

export interface SpatialPanelProps {
  children: ReactNode;
  /** 0-5. Maps to the Android XR SpatialElevation ladder. */
  depth?: DepthLevel;
  /** Depth the panel rises to on hover/focus-within. Defaults to depth + 1. */
  hoverDepth?: DepthLevel;
  /** "glass" samples the backdrop; "solid" never does. */
  material?: "glass" | "solid";
  /** Extra parallax multiplier; 0 pins the panel to the stage. */
  parallax?: number;
  as?: "div" | "section" | "article" | "aside";
  className?: string;
  style?: CSSProperties;
}

export function SpatialPanel({
  children,
  depth = 2,
  hoverDepth,
  material = "glass",
  parallax = 0,
  as: Tag = "section",
  className,
  style,
}: SpatialPanelProps) {
  const { perspective, animate } = useContext(StageContext);
  const [lifted, setLifted] = useState(false);

  const target: DepthLevel =
    lifted && animate ? (hoverDepth ?? (Math.min(5, depth + 1) as DepthLevel)) : depth;

  const z = DEPTH_PX[target];
  const k = 1 - z / perspective; // Dynamic Scale: hold angular size constant.

  const glass =
    material === "glass"
      ? {
          backgroundColor: "var(--sp-panel, rgba(255,255,255,.72))",
          backdropFilter: "blur(24px) saturate(165%)",
          WebkitBackdropFilter: "blur(24px) saturate(165%)",
        }
      : { backgroundColor: "var(--sp-panel-opaque, #f7f8fb)" };

  const merged: CSSProperties = {
    position: "relative",
    transformStyle: "preserve-3d",
    borderRadius: "var(--sp-radius-panel, 32px)",
    border: "1px solid var(--sp-hairline, rgba(16,16,20,.12))",
    color: "var(--sp-ink-1, #101014)",
    boxShadow: SHADOWS[target],
    willChange: animate ? "transform" : undefined,
    transform: [
      `translate3d(calc(var(--sp-px, 0) * var(--sp-amp, 0px) * ${parallax})`,
      `calc(var(--sp-py, 0) * var(--sp-amp, 0px) * ${parallax})`,
      `${z}px) scale(${k.toFixed(5)})`,
    ].join(", "),
    transition: animate
      ? "transform 320ms cubic-bezier(.2,0,0,1), box-shadow 320ms cubic-bezier(.2,0,0,1)"
      : "none",
    ...glass,
    ...style,
  };

  return (
    <Tag
      className={className}
      style={merged}
      onPointerEnter={() => setLifted(true)}
      onPointerLeave={() => setLifted(false)}
      onFocusCapture={() => setLifted(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setLifted(false);
      }}
    >
      {children}
    </Tag>
  );
}

export interface SpatialOrbiterProps {
  children: ReactNode;
  /** Which panel edge the orbiter hugs. */
  anchor?: "bottom" | "top" | "left" | "right";
  /** Clearance from the panel edge in px. Android XR recommends 20dp. */
  offset?: number;
  label: string;
  className?: string;
}

export function SpatialOrbiter({
  children,
  anchor = "bottom",
  offset = 20,
  label,
  className,
}: SpatialOrbiterProps) {
  const { perspective } = useContext(StageContext);
  const z = DEPTH_PX[1];
  const k = 1 - z / perspective;

  const placement: CSSProperties =
    anchor === "bottom"
      ? { left: "50%", bottom: -offset, transform: `translate3d(-50%,0,${z}px) scale(${k})` }
      : anchor === "top"
        ? { left: "50%", top: -offset, transform: `translate3d(-50%,0,${z}px) scale(${k})` }
        : anchor === "left"
          ? { top: "50%", left: -offset, transform: `translate3d(-100%,-50%,${z}px) scale(${k})` }
          : { top: "50%", right: -offset, transform: `translate3d(100%,-50%,${z}px) scale(${k})` };

  return (
    <nav
      aria-label={label}
      className={className}
      style={{
        position: "absolute",
        display: "flex",
        gap: 8,
        padding: 6,
        borderRadius: 999,
        backgroundColor: "var(--sp-panel-legible, rgba(255,255,255,.92))",
        backdropFilter: "blur(40px) saturate(165%)",
        WebkitBackdropFilter: "blur(40px) saturate(165%)",
        border: "1px solid var(--sp-hairline, rgba(16,16,20,.12))",
        boxShadow: SHADOWS[1],
        ...placement,
      }}
    >
      {children}
    </nav>
  );
}
```

```tsx
// Usage
export default function TripCard() {
  return (
    <SpatialStage perspective={1200} intensity={60}>
      <SpatialPanel depth={3} parallax={0.6} style={{ maxWidth: 640, margin: "64px auto", padding: "28px 28px 44px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.01em", margin: 0 }}>Flight 1187</h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--sp-ink-2)", margin: "4px 0 0" }}>
          Gate C14 · boards 18:40
        </p>
        <SpatialOrbiter label="Trip actions">
          <button type="button" style={{ minHeight: 44, minWidth: 44, padding: "0 18px", border: 0, borderRadius: 999, background: "transparent", font: "inherit", fontWeight: 500 }}>
            Boarding pass
          </button>
        </SpatialOrbiter>
      </SpatialPanel>
    </SpatialStage>
  );
}
```

### Native / other platform

Both native XR platforms are genuinely relevant here — the style originated in them and the web dialect is a translation.

**SwiftUI (visionOS 2+ / 26+).** The three scene types are the whole model: `WindowGroup` (a flat glass window), `WindowGroup` with `.windowStyle(.volumetric)` (a bounded 3D volume), and `ImmersiveSpace`.

```swift
import SwiftUI
import RealityKit

@main
struct TripApp: App {
    var body: some Scene {
        // Flat glass window, sized in points; 1360 pt == 1 metre.
        WindowGroup(id: "trip") {
            TripView()
        }
        .defaultSize(width: 1280, height: 720)   // ~0.94m x 0.53m

        // Bounded volume, sized in real-world metres.
        WindowGroup(id: "bag") {
            BagVolumeView()
        }
        .windowStyle(.volumetric)
        .defaultSize(width: 0.6, height: 0.4, depth: 0.4, in: .meters)
    }
}

struct TripView: View {
    @State private var showDetail = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Flight 1187")
                .font(.title).fontWeight(.bold)          // one weight step up from iOS
            Text("Gate C14 · boards 18:40")
                .font(.callout).fontWeight(.medium)
                .foregroundStyle(.secondary)             // vibrancy tier 2

            Button("Boarding pass") { showDetail.toggle() }
                .frame(minWidth: 60, minHeight: 60)      // 60pt gaze target
                .hoverEffect(.highlight)                 // gaze feedback
        }
        .padding(28)
        .frame(maxWidth: .infinity, alignment: .leading)
        .glassBackgroundEffect()                         // system glass material
        // Ornament: floats past the window's bottom edge by 20pt.
        .ornament(attachmentAnchor: .scene(.bottom), contentAlignment: .center) {
            HStack(spacing: 16) {
                Button { } label: { Label("Directions", systemImage: "map") }
                Button { } label: { Label("Share", systemImage: "square.and.arrow.up") }
            }
            .buttonStyle(.borderless)
            .labelStyle(.iconOnly)
            .padding(12)
            .glassBackgroundEffect(in: .capsule)
            .offset(y: -20)
        }
    }
}
```

**Jetpack Compose for XR (Android XR).** Verified against `androidx.xr.compose:1.0.0-alpha16` (15 July 2026). This API is still alpha; pin the version.

```kotlin
// build.gradle.kts
// implementation("androidx.xr.compose:compose:1.0.0-alpha16")

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.xr.compose.spatial.Orbiter
import androidx.xr.compose.spatial.OrbiterAnchorPoint
import androidx.xr.compose.spatial.Subspace
import androidx.xr.compose.subspace.SpatialPanel
import androidx.xr.compose.subspace.SpatialRow
import androidx.xr.compose.subspace.layout.SubspaceModifier
import androidx.xr.compose.subspace.layout.height
import androidx.xr.compose.subspace.layout.movable
import androidx.xr.compose.subspace.layout.resizable
import androidx.xr.compose.subspace.layout.width

@Composable
fun TripSubspace() {
    Subspace {
        // 825dp curve radius is Google's guidance for a row that wraps the user.
        SpatialRow(curveRadius = 825.dp) {
            SpatialPanel(
                SubspaceModifier
                    .width(1400.dp)      // well under the 2560dp cap
                    .height(824.dp)      // under the 1800dp cap
                    .movable()
                    .resizable()
            ) {
                Surface(color = Color(0xFF15171D)) {
                    Column(Modifier.padding(28.dp)) {
                        Text("Flight 1187", color = Color.White, fontSize = 34.sp)
                        Spacer(Modifier.height(4.dp))
                        Text("Gate C14 · boards 18:40", color = Color(0xFFB9BDC9), fontSize = 18.sp)
                    }
                }

                // Orbiter: detached chrome, 20dp clear of the panel edge.
                Orbiter(
                    anchorPoint = OrbiterAnchorPoint.Bottom,
                    offset = 20.dp,
                ) {
                    Row(
                        Modifier
                            .background(Color(0xCC15171D))
                            .height(96.dp)               // > 56dp target minimum
                            .width(560.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("Boarding pass", color = Color.White, fontSize = 20.sp)
                        Text("Directions", color = Color.White, fontSize = 20.sp)
                    }
                }
            }
        }
    }
}
```

Add `android:enableOnBackInvokedCallback="true"` to the activity in the manifest, or back navigation from a spatial panel misbehaves.

**Figma.** Apple ships an official visionOS design kit and Google ships an Android XR Design System file in the Figma Community. The `XR Design Tools` plugin includes an FOV Guide Generator and FOV Calculator, which is the fastest way to check that a layout stays inside the 41° cone; `XR-Viewer` previews a frame on a spatial canvas. Figma has no native z-depth model, so encode depth as a named layer style plus a shadow token and let code apply the transform.

## 6. Interaction & Motion

**States.** Depth is the primary state channel; colour is secondary.

| State | Depth change | Other treatment | Duration / easing |
|---|---|---|---|
| Rest | level `n` | shadow `n`, fill `--sp-panel` | — |
| Hover (pointer) | `n → n+1` (+8px z) | fill lightens by 4%, specular rim brightens | 120ms `cubic-bezier(.2,0,0,1)` |
| Hover (gaze, visionOS) | no z change | system `hoverEffect` highlight only | platform-controlled, ~100ms |
| Active / pressed | `n → n−1`, floor 0 (−8px z) | fill darkens 6%, contact shadow tightens 40% | 90ms `linear` |
| Focus-visible | no z change | 3px solid ring, 3px offset, plus 1px inner light ring | instant, never animated |
| Focus-within (panel) | `n → n+1` | matches hover so keyboard and mouse agree | 320ms `cubic-bezier(.2,0,0,1)` |
| Disabled | pinned to level 0 | opacity 0.40, shadow removed, no parallax | 0ms |
| Loading | pinned to current level | 1.6s opacity pulse 1.0 → 0.55 on content only, never on z | 1600ms `ease-in-out` |
| Modal open | content panel `→ −125px`, dialog `→ 56px` | scrim `rgba(8,9,12,.44)` behind dialog | 480ms `cubic-bezier(.2,0,0,1)` |

**What should animate.** `transform` (translate3d, scale, rotateX/Y), `opacity`, `box-shadow` when it is a discrete swap between two token values, and `filter: blur()` only on decorative background layers.

**What must not animate.** `backdrop-filter` on a moving element — the backdrop snapshot re-rasterises every frame and is the single biggest cost in this style. Also never animate `perspective` itself (it recomputes the whole 3D containing block), `width`/`height`, or the depth of more than three panels simultaneously.

**Amplitudes.** Pointer parallax caps at **12px of translation** and **4° of tilt** across the full input range at intensity 100. Scroll-driven depth caps at **±40px of z** over a full viewport of scroll. Both numbers come from the same constraint the XR platforms enforce physically: Android XR keeps content inside a 41° cone and 0.75-5 m depth band precisely so the vestibular system is not asked to reconcile large apparent motion with a stationary body.

**Spring feel.** Panels arriving in space should overshoot slightly — `cubic-bezier(.34,1.32,.64,1)` over 480ms — because real objects settle. Panels leaving should not overshoot; use the plain decelerate curve so exit reads as intentional.

**prefers-reduced-motion.** The correct reduction is *keep the depth, drop the movement*. Static translateZ, static shadows and static counter-scale are all fine for a vestibular-sensitive user; what triggers symptoms is optical flow that does not match head motion. Concretely: set `--sp-parallax-translate: 0px`, `--sp-parallax-tilt: 0deg`, collapse depth transitions to 1ms, and disable the pointer listener entirely rather than just zeroing its output. Also gate on `(pointer: fine)` so touch users never get tilt — a finger on glass has no meaningful "camera position".

On visionOS the platform-level equivalents are Settings → Accessibility → Motion → Reduce Motion, and, since visionOS 2.1, Settings → Awareness & Safety → **Stabilize Nearby Content**. Respect both by reading `UIAccessibility.isReduceMotionEnabled` and avoiding self-initiated window motion.

## 7. Accessibility

This style carries **high** risk. It stacks three independently hazardous mechanisms: translucency over uncontrolled backdrops, motion not initiated by the user, and hierarchy encoded in a channel assistive technology cannot read.

**WCAG 2.2 criteria most often failed:**

- **1.3.1 Info and Relationships (A)** — depth is the hierarchy. A screen reader gets a flat DOM. Every depth level must have a semantic equivalent: `<dialog>`/`aria-modal` for level 5, `role="menu"` or a popover for level 3, headings and landmarks for panels.
- **1.4.3 Contrast (Minimum) (AA)** — the composite of glass fill over an arbitrary backdrop is where this fails. Math below.
- **1.4.11 Non-text Contrast (AA)** — a 1px `rgba(16,16,20,0.12)` hairline composites to `rgb(226.3, 226.3, 226.8)` over a white panel (`L = 0.76322`), which is **1.29:1**. It is decorative only. If the panel edge is the sole indicator of a control boundary, you need ≥ 3:1, and that means **`rgba(16,16,20,0.45)`** — composite `rgb(147.4, 147.4, 149.2)`, `L = 0.29430`, **3.05:1** — or a real border. `0.42` reaches only **2.79:1** and fails; both of these are per-channel composites, not averaged luminances.
- **1.4.13 Content on Hover or Focus (AA)** — orbiters that appear on hover must be dismissible, hoverable and persistent. A floating toolbar that vanishes when the pointer crosses the 20px gap between panel and orbiter fails outright. Fix by making the gap part of the hover target.
- **2.4.7 Focus Visible (AA)** and **2.4.11 Focus Not Obscured (Minimum) (AA)** — 2.4.11 is the sleeper failure. Floating orbiters and level-5 dialogs sit *in front* of content; a focused control behind them is obscured. Every floating surface needs either `scroll-margin` compensation on focusable descendants or a rule that focus moves the obscuring layer.
- **2.5.7 Dragging Movements (AA)** — this is the criterion spatial UI breaks most reliably and most people miss. `movable()` and `resizable()` panels, drag-to-reposition windows, and drag-based depth controls all require a single-pointer non-dragging alternative. Ship arrow-key nudging and a "reset layout" button.
- **2.5.8 Target Size (Minimum) (AA)** — `--sp-target-floor` (`24px`) is the WCAG floor, and spatial UI should never approach it. Size from `--sp-target-pointer` (`44px`), and from `--sp-target-gaze` (`60px`) under `(pointer: coarse)` or `(hover: none)`, which is what `.sp-btn` in §5 does — it writes `max(var(--sp-target-floor), var(--sp-target-pointer))` so the floor still clamps the result if a host theme moves the pointer token down. The failure mode is the opposite of usual — designers shrink orbiter buttons to keep the capsule slim, which is a hard-coded literal beating the token, not a token being set too low.
- **2.3.3 Animation from Interactions (AAA)** and **2.2.2 Pause, Stop, Hide (A)** — pointer parallax is motion triggered by interaction; scroll-driven depth that continues after the user stops is auto-playing motion. Both need an off switch beyond the OS setting if the effect exceeds the amplitudes above.
- **1.4.10 Reflow (AA)** — a `perspective` stage with a fixed `max-width: 1413px` must still reflow at 320 CSS px without two-dimensional scrolling. Drop to `perspective: none` and a single column below 640px.

**Contrast math, done properly.** Browsers composite a translucent fill in **gamma-encoded sRGB, one 8-bit channel at a time** — `C = α·C_fill + (1−α)·C_backdrop` on each of R, G and B — and only *then* is the composited colour linearised and reduced to a relative luminance; averaging the two luminances instead (`L = α·L_fill + (1−α)·L_bd`) is not an approximation but a different and consistently **optimistic** model, and it overstates the contrast of light fills over dark grounds by enough to ship illegible text. Doc 08 §7 states the same per-channel rule; the two agree.

The full procedure, and the only one this doc's numbers use:

```
C = α·C_fill + (1−α)·C_backdrop              per channel, 0-255 sRGB
s = C/255 ;  lin = s ≤ 0.04045 ? s/12.92 : ((s+0.055)/1.055)^2.4
L = 0.2126·linR + 0.7152·linG + 0.0722·linB
ratio = (L_max + 0.05) / (L_min + 0.05)
```

Never round a ratio up through its threshold. 4.497:1 fails 4.5:1; 2.96:1 fails 3:1.

**Dark glass, light text, worst-case white backdrop** (a blown-out photo, a light-mode page behind). Fill `#14161C` = rgb(20, 22, 28). The shipped dark `--sp-panel` is `rgba(22,24,30,α)` = `#16181E`, two 8-bit steps lighter; it shifts every ratio below by at most 0.35 of a point and changes no conclusion, so both are quoted where it matters.

- **α = 0.585** → composite `rgb(117.5, 118.7, 122.2)` → `L = 0.18350`. Against pure white text: `1.05 / 0.23350` = **4.497:1 — fails**. This is the round-up trap: it is not "4.5:1".
- The exact 4.5:1 crossing against pure white text is **α = 0.5853**. Against the ink token actually paired with dark glass, `--sp-ink-1` dark `#F5F6FA` (`L = 0.92226`), it is **α = 0.6083**; with the `#16181E` token fill, **α = 0.6135**.
- **α = 0.62** → composite `rgb(109.3, 110.5, 114.3)` → `L = 0.15760` → **5.06:1** against white, **4.68:1** against `#F5F6FA` (4.60:1 with the `#16181E` fill). First two-decimal step that passes with margin.
- **α = 0.72** (the shipped `--sp-panel`) → composite `rgb(85.8, 87.2, 91.6)` → `L = 0.09589` → `1.05 / 0.14589` = **7.20:1** against white, **6.66:1** against `#F5F6FA`. Passes AA and AAA for body text.
- **α = 0.83** → `L = 0.04762` → **10.76:1** / **9.96:1**. Not wrong, just more than twice the headroom AA asks for.
- **α = 0.90** (`--sp-panel-legible` dark) → `L = 0.02661` → **12.69:1** against `#F5F6FA`.

So the honest rule for a backdrop you do not control is **α ≥ 0.62 for dark glass carrying light body text** — not 0.83. The 0.72 default is not the compromise it looks like; against pure white text it already clears AAA (7.20:1). Against the real `#F5F6FA` ink it reaches 6.66:1 — AAA needs α ≥ 0.7336 there, so 0.72 is AA with a wide margin and just short of AAA.

**Light glass, dark text, worst-case black backdrop.** This is where luminance-averaging does real damage. A white fill at alpha α over black composites to `rgb(255α, 255α, 255α)` — its luminance is *not* α, it is the sRGB transfer function applied to α. With `--sp-ink-1` light `#101014` (`L = 0.00531`):

- **α = 0.20** → composite `rgb(51, 51, 51)` → `L = 0.03310` → `0.08310 / 0.05531` = **1.50:1**. The luminance-averaging model claims 4.52:1 for exactly this case. Anyone who trusted it shipped body text at a third of the contrast they believed they had.
- **α = 0.40** → `rgb(102,102,102)` → `L = 0.13287` → **3.31:1** — large text only, never body copy.
- **α = 0.483** → `L = 0.19864` → **4.495:1 — still fails.** The exact crossing is **α = 0.4833**; α = 0.484 → **4.51:1**.
- **α = 0.60** → `L = 0.31855` → **6.66:1**.
- **α = 0.72** (`--sp-panel` light) → `L = 0.47700` → **9.53:1**.
- **α = 0.92** (`--sp-panel-legible` light) → `L = 0.82757` → **15.87:1**.

Light glass is still the more forgiving polarity, but its floor is **α ≥ 0.49**, not 0.20. Keep **α ≥ 0.60** for light glass carrying body copy — below that the backdrop imagery stays legible *through* the text, a real failure the ratio does not capture — and raise to 0.92 over photography.

**Focus-visible strategy.** A single outline is not enough on glass because the outline colour may match either the panel or the backdrop. Use a two-ring pattern: an inner 1px `rgba(255,255,255,.9)` ring inside the border box and an outer 3px solid brand ring at 3px offset. Never animate focus rings and never rely on the depth lift alone — a keyboard user who cannot perceive depth gets nothing.

**Screen reader and DOM order.** In a spatial layout, visual position is set by transforms and z-depth, which are invisible to the accessibility tree. Two rules: (1) DOM order must match reading order, not visual depth order; (2) an orbiter that visually belongs to a panel must be a DOM child of that panel or be associated with `aria-owns`/`aria-controls`. Announce depth changes only when they carry meaning — a modal opening is `aria-modal`, a hover lift is nothing.

**Forced colors / Windows High Contrast.** `backdrop-filter` and `box-shadow` are discarded; `transform` is not. The result is unstyled panels floating at arbitrary angles with no visible edges. Set `perspective: none`, `transform: none`, `background: Canvas`, `border: 1px solid CanvasText` inside `@media (forced-colors: active)`, and use `Highlight` for focus rings. Do not use `forced-color-adjust: none` except on the panel background, and only to restore the border.

**Reduce transparency.** `prefers-reduced-transparency: reduce` must swap every glass fill to its opaque token and set blur to 0. Support, stated identically in docs 01, 03, 06, 08 and 10 of this set: Chrome and Edge 118+ ship it; Firefox has it behind the `layout.css.prefers-reduced-transparency.enabled` flag; Safari does not support it as of August 2026, so on the web this query alone does not cover Apple users — pair it with `prefers-contrast: more` and an in-app toggle. On visionOS, read `UIAccessibility.isReduceTransparencyEnabled` / SwiftUI's `\.accessibilityReduceTransparency` directly, which is the reliable signal on that platform.

**XR-specific requirements (from W3C XAUR, 25 August 2021).** If you ship an actual headset build: provide a motion-agnostic input path so every control is reachable with one input method; allow gesture remapping; provide a "safe harbour" shortcut back to a known comfortable state; keep any flicker under **3 flashes per second**; offer a mono-audio option; size signing-avatar video at **≥ 1/3** of the original stream; expose interaction-speed controls.

**Pass/fail checklist.**

- [ ] Every glass surface carrying text measures ≥ 4.5:1 against the *worst-case* backdrop, not the design mock's backdrop — composited **per channel in gamma-encoded sRGB** (`C = α·C_fill + (1−α)·C_bd`), never by averaging luminances, and never rounded up through the threshold.
- [ ] Over an uncontrolled backdrop, dark glass under light body text is at **α ≥ 0.62** and light glass under dark body text at **α ≥ 0.60** (contrast floor 0.49; 0.60 is the legibility floor).
- [ ] Panel edges that convey boundaries measure ≥ 3:1 (1.4.11) — `rgba(16,16,20,0.45)` over a light panel, not 0.42.
- [ ] Every draggable/resizable panel has a keyboard and single-tap alternative (2.5.7).
- [ ] Focused elements are never obscured by an orbiter, dialog or sticky depth layer (2.4.11).
- [ ] Orbiter hover targets include the 20px gap; content is dismissible with Escape (1.4.13).
- [ ] Interactive targets size from `--sp-target-pointer` (44px) / `--sp-target-gaze` (60px under coarse pointer) rather than literals, and the computed box never falls below `--sp-target-floor` (24px) (2.5.8).
- [ ] `prefers-reduced-motion: reduce` removes all parallax and tilt, and the pointer listener is detached, not merely zeroed.
- [ ] `prefers-reduced-transparency: reduce` produces fully opaque panels.
- [ ] `forced-colors: active` flattens the camera and restores visible borders.
- [ ] Page reflows to a single column with `perspective: none` at 320 CSS px width (1.4.10).
- [ ] DOM order equals reading order; depth carries no information absent from semantics (1.3.1).
- [ ] Tab order does not jump between depth layers unpredictably; modal levels trap focus.
- [ ] Text scales to 200% without clipping inside transformed panels (1.4.4) — transforms do not scale with font size, so test it.

## 8. Performance

**The cost model.** Three things generate GPU work here, in descending order of expense:

1. **`backdrop-filter`** — forces the browser to snapshot everything painted behind the element, run a separable Gaussian blur plus a colour matrix, and composite the result. Cost scales with the *area of the element*, not the complexity of the backdrop. It re-runs on every frame in which the element or anything behind it moves.
2. **`transform-style: preserve-3d`** — each 3D rendering context and each transformed child gets promoted to its own composited layer. Layer memory is `width × height × 4 bytes`; a full-viewport 1440 × 900 layer costs **4.94 MiB** of GPU memory. Twenty of those is 99 MiB, which is a real problem on a 4 GB Android device.
3. **`perspective`** — cheap in itself, but it establishes a containing block for `position: fixed` and `position: absolute` descendants. This is the most common bug in spatial layouts: a fixed header inside a perspective stage stops being fixed. Keep the stage a sibling of fixed chrome, never an ancestor.

**Budgets that hold up.**

| Metric | Budget | Why |
|---|---|---|
| Concurrent `backdrop-filter` surfaces on screen | ≤ 6 | Each is a full backdrop read-back; 12+ visibly drops frames on an M1 Air at 1440p |
| Total composited layers | ≤ 25 | Chrome's own layer-explosion heuristics degrade past this |
| GPU layer memory | ≤ 96 MiB | Roughly 19 full-viewport layers at 1440 × 900 |
| Nested `preserve-3d` contexts | ≤ 3 deep | Each level multiplies matrix work and defeats layer squashing |
| Main-thread work per parallax frame | ≤ 1.5 ms | Leaves headroom inside an 8.33 ms frame at 120 Hz |
| Parallax input handling | 1 rAF-coalesced write per frame | Raw `pointermove` fires up to 1000 Hz on high-poll mice |
| Panel animation concurrency | ≤ 3 panels changing depth at once | Each triggers a re-raster of its backdrop |
| Extra CSS weight for the whole style | ≤ 4 KB gzipped | It is tokens plus ~15 rules; anything larger means you shipped a 3D library by accident |

**Paint and layout.** Done correctly this style triggers **zero layout and zero paint** during interaction: `translate3d`, `scale` and `opacity` are compositor-only properties. The failure mode is animating `box-shadow` across arbitrary values, which repaints. Fix by cross-fading two pseudo-elements each carrying a fixed shadow token, or by accepting the discrete swap at the transition endpoints.

**`will-change` discipline.** Apply `will-change: transform` only to elements that are actually moving right now, and remove it afterwards. A permanent `will-change: transform, backdrop-filter` on every panel pre-promotes every layer and will exhaust GPU memory on mid-range Android. Scope it with a class you add on `pointerenter` and remove on `transitionend`.

**Mobile and low-end.** Android WebView's `backdrop-filter` blur is materially slower than desktop Chrome; on devices reporting `navigator.deviceMemory <= 4` or `navigator.hardwareConcurrency <= 4`, drop to the opaque fallback and disable parallax. Under `(pointer: coarse)` there is no pointer parallax to compute at all, which removes most of the cost automatically. Scroll-driven depth via `animation-timeline: scroll()` runs off the main thread in Chromium and is dramatically cheaper than a scroll listener; scroll-driven animations are an Interop 2026 focus area, so cross-browser support is actively converging.

**Asset weight.** The flat-screen dialect adds no assets — it is CSS. The moment you reach for Three.js you change category: `three` plus `@react-three/fiber` plus `@react-three/drei` is roughly 600 KB - 1 MB gzipped before your own scene, plus GLB models at 1-10 MB each. `@react-three/uikit` (1.0.73, May 2026) adds MSDF font atlases. If your "spatial UI" needs WebGL, budget a separate performance conversation and lazy-load the canvas below the fold.

**Cheaper fallbacks, in order of preference.** (1) Depth ladder with shadows and counter-scale but no `perspective` at all — 90% of the read for 5% of the cost. (2) `perspective` plus static `translateZ`, no parallax. (3) Parallax on `(pointer: fine)` only. (4) Full glass. Ship tier 1 as the baseline and let `@supports` and media queries upgrade.

## 9. When To Use / When Not To

**Use it for:**

- Native XR apps on visionOS, Android XR or Horizon OS — there is no alternative; this *is* the platform language.
- Product marketing and launch pages where the artefact is genuinely three-dimensional: hardware, devices, physical products, architecture, mapping.
- Dashboards with a strong figure/ground split — one focused work surface plus peripheral context panels. Depth expresses "this is primary, that is ambient" better than shadow ever did.
- Onboarding, empty states and hero moments where you have a single object to explain and time to spend on it.
- Creative and media tools (timelines, layer stacks, 3D scene editors) where the mental model is already spatial and depth maps to a real concept.
- Any interface that will later be ported to a headset. Building the depth ladder now makes the port a configuration change rather than a rewrite.
- Games, spatial-audio apps, and anything where the environment is content.

**Do not use it for:**

- Dense data work — tables, spreadsheets, log viewers, admin CRUD. Depth costs vertical space, forces 44-60px targets and halves the information density these users need.
- Text-first reading experiences. Documentation, news, long-form. Parallax under a paragraph is hostile.
- Anything with a hard performance floor: low-end Android, in-store kiosks, embedded browsers, e-ink, TV browsers.
- Regulated interfaces — banking transaction lists, medical records, government forms, checkout. Translucency over unknown backdrops plus motion is exactly the combination auditors flag.
- Interfaces where users are moving: automotive, in-transit mobile, warehouse handhelds. Parallax on a bumpy train is nausea.
- Users with known vestibular sensitivity as a primary segment, and audiences skewing older where vestibular sensitivity prevalence rises.
- Products where you cannot control the backdrop behind glass (user-uploaded photos as page backgrounds). Either control it or go opaque.
- As a whole-page treatment. Spatial UI is a chrome-and-hero language. A page that is spatial all the way down is a page with no ground plane.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Quantise depth to the six-step ladder (0.1 / 16 / 24 / 32 / 40 / 56) so hierarchy is countable | Assign arbitrary `translateZ` values per component until nothing reads as a system |
| Counter-scale by `1 − z / perspective` so apparent size stays constant | Let elements grow as they come forward, which reads as a zoom, not a depth |
| Put `perspective` on one stage element and keep `position: fixed` chrome outside it | Wrap the whole `<body>` in a perspective context and then wonder why the sticky header broke |
| Composite fill over worst-case backdrop **per channel in sRGB**, then derive alpha (≥ 0.62 dark glass / ≥ 0.60 light glass, arbitrary backdrop) | Average the fill and backdrop *luminances* — it overstates light-on-dark contrast by 3× — or pick 0.7 because it looked right over the one gradient in the mock |
| Size targets at 44px pointer / 60px gaze with 8px minimum separation | Shrink orbiter buttons to keep the capsule slim and land under 24px |
| Give every draggable or resizable panel a keyboard and single-tap alternative (2.5.7) | Ship `movable() / resizable()` as the only way to reposition anything |
| Cap parallax at 12px translate and 4° tilt, and detach the listener under reduced-motion | Bind a 60px parallax to scroll and call the reduced-motion media query "handled" because you zeroed a variable |
| Make DOM order match reading order and expose depth semantically (`aria-modal`, headings, landmarks) | Let z-depth be the only thing that says "this is the important panel" |
| Flatten completely under `forced-colors: active` — `perspective: none`, solid `Canvas`, `CanvasText` borders | Leave transforms on in high-contrast mode so panels float edgeless at odd angles |
| Animate only `transform` and `opacity`; swap shadows at endpoints | Animate `backdrop-filter`, `perspective`, or `width` and burn the frame budget |
| Keep primary content inside a 41° cone (≈ 1413px at 500mm) with the centroid slightly below the eye line | Stretch panels edge-to-edge on a 34" ultrawide and force head movement to read a sentence |
| Use one weight step bolder than your flat scale (500 body / 700 titles) and never below 14px | Reuse a 300-weight 13px flat-design scale on translucent glass |
| Cap concurrent `backdrop-filter` surfaces at 6 and scope `will-change` to elements in motion | Put permanent `will-change: transform, backdrop-filter` on every card in a grid |
| Ship the depth ladder + shadows as tier 1 and upgrade to glass and parallax via `@supports`/media queries | Ship the maximal version and add fallbacks "later" |

## 11. In The Wild (2024-2026)

**Platforms and first-party systems**

- **Apple visionOS** — Vision Pro shipped 2 February 2024 at $3,499. **visionOS 26** (15 September 2025) added persistent spatial widgets anchored to walls and tables, spatial scenes generated from 2D photos, and Safari's Spatial Browsing. **visionOS 27** (announced WWDC 2026, 8 June 2026; developer beta same day; autumn 2026 release) adds curved windows, an eye-activated Siri orb you place in the room, eye-driven notification interaction, a redesigned Control Center, panorama-to-spatial-scene conversion, the Spatial Accessories framework, and Spatial Preview / Foveated Streaming for extending desktop software into the headset.
- **Android XR / Samsung Galaxy XR** — Galaxy XR launched 21 October 2025 at $1,799 (dual 3552 × 3840 micro-OLED, 90 Hz, Snapdragon XR2+ Gen 2, 545 g + 302 g battery), the first Android XR device. Google's Android XR design guidance is the most numerically specific spatial design documentation any vendor has published: 0.868 dp-to-dmm, 41° content cone, 5° downward panel tilt, 0.75-5 m depth range, 1.75 m spawn distance, a six-level `SpatialElevation` ladder, 32dp panel radius, 56dp targets, 14dp type floor.
- **Jetpack Compose for XR** — `androidx.xr.compose` from `1.0.0-alpha01` (12 December 2024) to `1.0.0-alpha16` (15 July 2026). `Subspace`, `SpatialPanel`, `Orbiter`, `SpatialRow/Column/Box`, `SpatialDialog` (pushes the parent panel back 125dp), `SpatialPopup`, `SpatialElevation`, `SpatialGltfModel`, `SpatialExternalSurface`. Still alpha after nineteen months.
- **Material Design for XR** — a developer preview layered on Material 3 that adds spatially adaptive dialogs, navigation bars that pop out into an Orbiter, a `SpaceToggleButton`, and an `EnableXrComponentOverrides` wrapper so an existing Compose app spatialises without a rewrite.
- **Meta Horizon OS** — Navigator, a system-wide dimmed overlay UI, began staged rollout in May 2025 and reached all Quest headsets in June 2026 with seven tabs. Panel guidance: 1024 × 640 dp default, 384 × 500 dp minimum, single / hinged / theater configurations, a pill-shaped Control Bar below the bottom-centre edge, and panels that hold content only (no chrome inside the panel itself).
- **Meta Immersive Web SDK — Spatial UI UIKit** (docs updated 11 March 2026) — a Three.js + Yoga flexbox 3D UI runtime with `Container`, `Text`, `Image`, `Video`, `Svg`, `Input`, `Textarea`, MSDF text with glyph instancing, panel instancing to minimise draw calls, and hover/active/focus/breakpoint style variants. Intrinsic sizes in centimetres, converted to metres for world space.

**Web and open source**

- **WebSpatial SDK** — minimal HTML/CSS/DOM extensions plus a polyfill-style SDK that gives web pages panel decomposition, z-axis positioning, background materials and an `innerDepth` DOM API. Ships today on visionOS (packaged as a hybrid App Store app carrying the WebSpatial Runtime) and PICO OS 6; JSAR/Rokid, IRIS OS, Android XR and Meta Horizon OS are in progress. Presented at **W3C TPAC 2025**, with W3C minutes dated 10 November 2025. React integration via `jsxImportSource: "@webspatial/react-sdk"`.
- **`@react-three/uikit`** (pmndrs) — version 1.0.73 published 16 May 2026. Flexbox-based 3D UI on top of react-three-fiber and Yoga, with themable pre-styled kits, MSDF text and instancing. Paired with `@react-three/xr` this is the default open-source route to a spatial UI in the browser.
- **Interop 2026** — nineteen focus areas including **scroll-driven animations**, view transitions, anchor positioning, CSS `contrast-color()` and CSS `zoom`. WebXR is not among them. The practical read: browsers are standardising the primitives for *flat-screen* spatial UI while immersive-web interop remains a vendor-by-vendor affair.

**Design tooling**

- Apple's official **visionOS design kit** and Google's **Android XR Design System** are both published in the Figma Community. The **XR Design Tools** Figma plugin provides an FOV Guide Generator and FOV Calculator for checking layouts against a target field of view; **XR-Viewer** previews a Figma frame on a spatial 3D canvas.

**Market reality check.** Identical figures to §2, with the same measurement/forecast split. **Measured:** IDC counted roughly 45,000 Vision Pro units in 2025 against 390,000 in 2024; Meta shipped about 1.7 million Quest units in the first three quarters of 2025, down 16% YoY; Counterpoint reported Q1 2026 VR headset shipments **down 17% YoY and 39% QoQ**; smart glasses grew 211.2% in 2025. **Forecast:** IDC expected overall MR/VR headset shipments to fall 42.8% for 2025, and projects a 29.3% CAGR for smart glasses to 2029. All are analyst estimates from paywalled trackers (refs 24, 25) — directional, not audited. Spatial UI's *aesthetic* is expanding through mainstream product design faster than its hardware is selling — which is why the flat-screen dialect is the one worth investing in right now.

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui. Styles named without a link have no file in this set.

- **[./03-glassmorphism.md](./03-glassmorphism.md) — the required partner.** Spatial UI supplies the depth ladder and the camera; glassmorphism supplies the surface. Almost every real implementation is both. The division of labour: glassmorphism owns `background`, `backdrop-filter` and the hairline; spatial UI owns `perspective`, `translateZ`, counter-scale and shadow pairing. Keep the alpha contract from section 7 and this combination is the single most productive hybrid in the set.
- **[./08-liquid-glass.md](./08-liquid-glass.md) — same lineage, opposite scale.** Liquid Glass came out of visionOS; Apple has said so. It is what a spatial panel's *material* looks like when you zoom all the way in on the edge. They combine beautifully — a lensing chrome layer floating at depth level 1 over spatial content panels is literally the visionOS composition — but the combined cost is brutal: SVG displacement plus backdrop sampling plus a 3D transform is three GPU-expensive mechanisms on one element. Use Liquid Glass on exactly one surface (the orbiter) and plain glass on the panels.
- **[./05-minimalism.md](./05-minimalism.md) — the best structural partner.** Depth is a loud hierarchy channel; it only reads if the surfaces themselves are quiet. A minimalist type scale, a two-colour palette and generous whitespace let the z-axis do all the ranking work. This is the pairing that ships in production most often and ages best.
- **[./01-skeuomorphism.md](./01-skeuomorphism.md) — philosophical ancestor, careful in practice.** Both argue that pixels should behave like objects. Skeuomorphism simulates *texture and affordance*; spatial UI simulates *position and optics*. A skeuomorphic control inside a spatial panel works when the texture is subtle (a brushed dial, a paper card). It fails when both layers claim to be physical at once — leather stitching on a floating glass panel reads as a category error.
- **[./04-claymorphism.md](./04-claymorphism.md) — surprisingly good.** Opaque, soft-shadowed clay objects arranged on a real depth ladder read as toys on shelves, which is a coherent and friendly metaphor. Clay's chunky 60px+ forms already meet gaze target sizes. Keep the clay opaque — translucent clay destroys the soft-solid read and doubles the compositing cost.
- **[./02-neumorphism.md](./02-neumorphism.md) — direct contradiction.** Neumorphism's entire premise is that the control is extruded from a shared surface at zero distance. Spatial UI's premise is that surfaces are separated in depth. Combining them produces controls that are simultaneously flush and floating, and stacks two low-contrast systems. Do not.
- **[./06-maximalism.md](./06-maximalism.md) — clashes for a structural reason.** Depth needs an empty ground plane to be legible; maximalism fills it. If every layer is busy, parallax reads as visual noise rather than separation. The only version that works is maximalist *content* inside strictly minimal spatial *chrome*.
- **[./07-brutalism.md](./07-brutalism.md) — deliberate collision only.** Brutalism rejects illusionism; spatial UI is entirely illusionistic. Hard 3px black borders with no shadow on panels floating at 56px of z is an intentional joke, and it can be a good one on a portfolio. In a product it reads as a half-finished migration.
- **[./09-bento-grid.md](./09-bento-grid.md) — works, on one condition: the 3D depth must live on a shared canvas behind the grid.** Bento reads as a single composition precisely because every tile sits on one plane. Give individual tiles their own `translateZ` and perspective and you destroy that — the grid stops being a grid and becomes a scatter of unrelated cards. The pattern that works: put `perspective` on the grid *container*, hold the whole plane at one depth level, and let the parallax happen on the ground plane behind it. Bento is also a useful discipline for this style in the other direction, because it forces a fixed footprint per surface and therefore a bounded number of composited layers. Doc 09 §12 states the same condition from its side.
- **Aurora / mesh-gradient backdrops — no doc in this set** — the ideal ground plane. A slow, low-frequency gradient gives parallax something to move against and lets you cap the backdrop luminance range so the glass contrast math stays valid. Keep the gradient's luminance band inside roughly 25 L\* points.

## 13. Plugin Spec (draft)

**Skill name:** `spatial-ui`

**Description:** "Use when the user wants a spatial or depth-based interface — floating panels at measured z-depth, visionOS/Android XR-style layouts, orbiter or ornament chrome, pointer or scroll parallax, 3D-transformed cards, or a 'spatial computing' look — applied to a web, React, SwiftUI or Jetpack Compose XR UI. Also use when converting a flat shadow-elevation system to a real depth ladder, or when auditing an existing spatial/parallax implementation for reduced-motion, target-size, dragging-alternative and contrast failures."

**What the skill does:**

1. Detects framework (plain CSS, Tailwind v4, React, Next.js, Vue, Svelte, SwiftUI/visionOS, Jetpack Compose XR) and any existing token or elevation system.
2. Maps the project's existing shadow-elevation scale onto the six-step depth ladder (0.1 / 16 / 24 / 32 / 40 / 56), preserving relative order. It refuses to invent depth values outside the ladder.
3. Emits a token layer (`--sp-*` custom properties, or a Tailwind v4 `@theme` block, or a Swift `enum`/Kotlin `object`) with light, dark, `prefers-reduced-transparency`, `prefers-reduced-motion` and `forced-colors` overrides.
4. Inserts exactly one stage element that owns `perspective` and `perspective-origin`, and moves any `position: fixed` chrome out of that subtree, reporting each move.
5. Applies `translateZ` plus the computed counter-scale `1 − z / perspective` to each panel, so apparent size is preserved.
6. Converts a chosen navigation or toolbar component into an orbiter with the 20px offset, level-1 depth, and a hover target that spans the gap (1.4.13).
7. Adds rAF-coalesced pointer parallax gated on `(pointer: fine)` and `prefers-reduced-motion`, with the listener **detached** rather than zeroed when disabled. Optionally emits a `scroll()`-timeline variant instead.
8. Raises interactive targets to 44px pointer / 60px coarse, bumps body weight one step and enforces the 14px type floor.
9. On visionOS output: converts `.background(.thinMaterial)` to `.glassBackgroundEffect()`, adds `.hoverEffect(.highlight)`, sets `.defaultSize` in points or metres, and converts a bottom toolbar into `.ornament(attachmentAnchor: .scene(.bottom))` with a −20pt offset.
10. On Compose XR output: wraps content in `Subspace`, converts the root layout to `SpatialPanel` with `SubspaceModifier` sizing under the 2560 × 1800 dp cap, converts the nav bar to an `Orbiter` at 20dp offset, and adds `enableOnBackInvokedCallback="true"` to the manifest.
11. Produces an audit report with measured worst-case contrast, layer count, backdrop-filter surface count and estimated GPU layer memory.

**Inputs from the user:**

| Input | Type | Default |
|---|---|---|
| `framework` | `css` \| `tailwind4` \| `react` \| `next` \| `vue` \| `svelte` \| `swiftui` \| `compose-xr` | detected |
| `basePalette` | environment, surface, ink, accent hex values | detected from existing tokens |
| `density` | `compact` \| `regular` \| `spacious` | `regular` |
| `intensity` | 0-100 | `55` |
| `target` | `screen` \| `headset` \| `both` | `screen` |
| `backdropControl` | `owned` \| `arbitrary` | `arbitrary` |
| `material` | `glass` \| `solid` | `glass` |
| `a11yTarget` | `AA` \| `AAA` | `AA` |

`target: headset` forces 60px minimum targets, the 41° content cone and a 14px type floor. `backdropControl: arbitrary` forces panel alpha ≥ 0.62 (dark) / ≥ 0.60 (light — the contrast floor is 0.49, but 0.60 is the legibility floor from §7) and caps `intensity` at 45. `density: compact` is rejected outright when `target` includes `headset`.

**Outputs:**

- `tokens/spatial-ui.css` (or `theme.spatial.ts`, `SpatialTokens.swift`, `SpatialTokens.kt`) — the full `--sp-*` set with all five media-query overrides.
- A component set: `SpatialStage`, `SpatialPanel`, `SpatialOrbiter`, `SpatialDialog` (with the −125px content pushback), `SpatialLayer` (parallax background).
- A CSS layer `@layer spatial { … }` containing the depth utilities, glass `@supports` ladder and forced-colors flattening, ordered after the project's base layer.
- `spatial-ui-audit.md` — per-surface worst-case contrast, target-size violations, dragging-alternative gaps, layer/memory estimates, and a diff of every `position: fixed` element relocated out of the perspective subtree.

**Validation checklist the skill self-runs:**

1. **Contrast.** For each glass surface, composite **per 8-bit channel in gamma-encoded sRGB** — `C = α·C_fill + (1−α)·C_bd` at `C_bd = 0` and `C_bd = 255` — *then* linearise and compute `L`, and require ≥ 4.5:1 for body text and ≥ 3:1 for ≥ 24px/bold text and for boundary-conveying edges. The validator must reject any implementation that interpolates luminances (`α·L_fill + (1−α)·L_bd`); that model overstates light-fill-on-dark-backdrop contrast by roughly 3× and is the specific bug this rule exists to catch. Truncate, never round, when comparing to a threshold. Fail the build if any surface fails at either extreme when `backdropControl: arbitrary`.
2. **Target size.** Assert every interactive element sizes from `--sp-target-pointer` (44 CSS px) and from `--sp-target-gaze` (60 px) under `(pointer: coarse)` rather than from a literal; hard-fail below `--sp-target-floor` (24 px, SC 2.5.8). Assert ≥ `--sp-gap-target` (8px) separation.
3. **Dragging alternatives.** Detect any drag-initiated reposition/resize and require a keyboard handler plus a visible non-drag control (SC 2.5.7).
4. **Focus.** Assert a `:focus-visible` rule with ≥ 3:1 ring contrast that is not the depth lift alone, and check no floating layer can obscure a focused element (SC 2.4.11).
5. **Reduced motion.** Assert `prefers-reduced-motion: reduce` zeroes parallax tokens *and* that the JS detaches its listener; assert the page renders identically after removing all `transition` declarations.
6. **Reduced transparency & forced colors.** Assert opaque fallbacks exist for every glass token, and that `@media (forced-colors: active)` sets `perspective: none`, `transform: none`, `Canvas`/`CanvasText` and removes shadows.
7. **Fallbacks.** Assert every `backdrop-filter` is inside `@supports` with a non-glass alternative, and that a `perspective: none` single-column layout exists at ≤ 640px and at 320 CSS px (SC 1.4.10).
8. **Performance.** Count concurrent `backdrop-filter` surfaces (≤ 6), composited layers (≤ 25), `preserve-3d` nesting depth (≤ 3), and permanent `will-change` declarations (must be 0). Estimate GPU layer memory at the target viewport and fail above 96 MiB.
9. **Containing block.** Assert no `position: fixed` descendant exists inside a `perspective` or `transform` subtree.
10. **Semantics.** Assert every depth level ≥ 3 has a matching role (`dialog`/`aria-modal`, `menu`, `tooltip`), and that orbiters are DOM children of, or `aria-owns`-linked to, their panel.

**Intensity knobs:**

| Knob | Min (intensity 0) | Max (intensity 100) | Effect |
|---|---|---|---|
| `--sp-perspective` | `none` (flat, shadows only) | `800px` | Camera distance; lower = stronger foreshortening |
| `depthScale` (ladder multiplier) | `0.25×` → 4 / 6 / 8 / 10 / 14 px | `2×` → 32 / 48 / 64 / 80 / 112 px | Scales steps 1-5 of the six-step ladder; `--sp-z-0` stays at `0.1px` |
| `--sp-parallax-translate` / `--sp-parallax-tilt` | `0px` / `0deg` | `24px` / `8deg` | Pointer and scroll parallax amplitude |
| Panel alpha / blur | `1.00` / `0px` (fully opaque) | `0.55` / `48px` | Material translucency. The 0.55 end is below the arbitrary-backdrop floor — dark glass at α 0.55 over white composites to `rgb(125.8, 126.9, 130.2)`, only **3.71:1** under `#F5F6FA` — and is reachable only with `backdropControl: owned`; the contrast validator hard-clamps it to 0.62 / 0.60 otherwise |
| Shadow multiplier | `0.4×` alpha, `0.6×` blur radius | `1.6×` alpha, `1.4×` blur radius | Ambient/contact shadow strength |

Default `intensity: 55` yields perspective 1200px, the 1× ladder, 12px/4° parallax, alpha 0.72 (arbitrary backdrop — the §7 floor is 0.62 dark / 0.49 light, so 0.72 carries real margin) or 0.62 (owned and luminance-capped), and 1× shadows.

**The ladder multiplier is not a token.** `depthScale`, like the panel-alpha and shadow multipliers beside it, is applied by the generator when it emits §4's block: it multiplies the `--sp-z-1` … `--sp-z-5` literals, re-derives `--sp-k-1` … `--sp-k-5` from `1 − z / perspective`, and rescales the shadow pairs to match, all before the CSS is written. It is deliberately not a `--sp-*` custom property. Two reasons. The counter-scale and shadow ladders are emitted as literals, so a unit the page could change at runtime would move the panels without moving their counter-scale or their shadows, breaking the apparent-size invariant §5 depends on — and at intensity 0 `--sp-perspective` is `none`, so the counter-scale cannot be recovered as a live `calc()` either. Second, the ladder is not a uniform unit series to begin with: `--sp-z-0` is a `0.1px` sentinel that exists to force a stacking context rather than a distance, and 16 / 24 / 32 / 40 / 56 are the Android XR `SpatialElevation` dp values — 8px × 2, 3, 4, 5, 7, skipping 6 — so a `calc(N × unit)` rewrite would invent a regularity the source does not have and cut the values loose from their provenance. That is also why the row above enumerates five numbers for a six-step ladder: step 0 is not scaled. Everything that *is* a token appears in §4's table and CSS block.

**Anti-patterns the skill must refuse to generate:**

- Parallax or scroll-driven depth without a `prefers-reduced-motion` guard that detaches the listener.
- Depth as the only encoding of a state, a selection, or a hierarchy relationship.
- Glass panels with light body text below α 0.62, or with dark body text below α 0.49, when `backdropControl: arbitrary` — and any contrast figure derived by averaging luminances rather than compositing per channel.
- Drag-only panel movement or resizing with no keyboard or single-tap alternative.
- Text planes rotated more than 12° from the viewing plane (subpixel antialiasing and legibility collapse).
- More than three nested `preserve-3d` contexts, or `preserve-3d` on a scrolling list container.
- `backdrop-filter` on repeated list or grid items, or on any element that animates its transform.
- Permanent `will-change: transform` / `will-change: backdrop-filter` on non-animating elements.
- `perspective` applied to `body`, `html`, or any ancestor of `position: fixed` chrome.
- Auto-playing camera fly-throughs, continuous idle drift, or device-orientation parallax on mobile.
- Interactive targets below `--sp-target-floor` (24 CSS px) anywhere, or below `--sp-target-gaze` (60 px) when `target` includes `headset`.
- Viewport-unit-only type scales, `user-scalable=no`, or any construct that prevents 200% text zoom inside a transformed panel.
- Claiming visionOS or Android XR API support that is not in the pinned SDK version — in particular, generating Compose XR code without pinning an explicit `1.0.0-alphaNN`.

## 14. References

1. Design for spatial user interfaces (WWDC23 session 10076) — https://developer.apple.com/videos/play/wwdc2023/10076/ — Apple Developer — June 2023 — **[primary]**
2. Spatial layout — Human Interface Guidelines — https://developer.apple.com/design/human-interface-guidelines/spatial-layout — Apple Developer — accessed 8 August 2026 — **[primary]**
3. Q&A: Spatial design for visionOS — https://developer.apple.com/news/?id=fi8ne6ji — Apple Developer News — **[primary]**
4. Develop spatial UI with Jetpack Compose for XR — https://developer.android.com/develop/xr/jetpack-xr-sdk/ui-compose — Google / Android Developers — accessed 8 August 2026 — **[primary]**
5. Spatial UI — Android XR design guidance — https://developer.android.com/design/ui/xr/guides/spatial-ui — Google / Android Developers — accessed 8 August 2026 — **[primary]**
6. Scale, sizes, and visual design — Android XR — https://developer.android.com/design/ui/xr/guides/visual-design — Google / Android Developers — accessed 8 August 2026 — **[primary]**
7. Compose for XR release notes (`androidx.xr.compose` 1.0.0-alpha01 → 1.0.0-alpha16) — https://developer.android.com/jetpack/androidx/releases/xr-compose — Google / Android Developers — 12 December 2024 to 15 July 2026 — **[primary]**
8. Panels — Meta Horizon OS design — https://developers.meta.com/horizon/design/panels/ — Meta — accessed 8 August 2026 — **[primary]**
9. Spatial UI UIKit — Meta Immersive Web SDK — https://latest.developers.meta.com/horizon/documentation/web/iwsdk-concept-spatial-ui-uikit/ — Meta — updated 11 March 2026 — **[primary]**
10. XR Accessibility User Requirements (XAUR) — https://www.w3.org/TR/xaur/ — W3C Accessible Platform Architectures WG (Working Group Note) — 25 August 2021 — **[primary]**
11. Web Content Accessibility Guidelines (WCAG) 2.2 — https://www.w3.org/TR/WCAG22/ — W3C Recommendation — 5 October 2023, updated 12 December 2024 — **[primary]**
12. Interop 2026 focus areas (README) — https://github.com/web-platform-tests/interop/blob/main/2026/README.md — web-platform-tests project (Apple, Google, Microsoft, Mozilla, Bocoup, Igalia) — February 2026 — **[primary]**
13. WebSpatial — Introduction / Handbook — https://webspatial.dev/docs/introduction — WebSpatial project — accessed 8 August 2026 — **[primary]**
14. WebSpatial API for Spatialized HTML/CSS and PWAs — W3C TPAC 2025 presentation — https://tpac2025.webspatial.dev/ — presented at W3C TPAC 2025 — **[primary]**
15. `@react-three/uikit` on npm (v1.0.73) — https://www.npmjs.com/package/@react-three/uikit — pmndrs — published 16 May 2026 — **[primary]**
16. Material Design for XR (Developer Preview) — https://m3.material.io/blog/material-design-xr-dev-preview — Google Material Design — **[primary]**
17. If you experience motion sickness while using Apple Vision Pro — https://support.apple.com/en-us/118497 — Apple Support (Reduce Motion; Stabilize Nearby Content in visionOS 2.1+) — **[primary]**
18. Apple announces new accessibility features, including Eye Tracking — https://www.apple.com/newsroom/2024/05/apple-announces-new-accessibility-features-including-eye-tracking/ — Apple Newsroom — May 2024 — **[primary]**
19. visionOS 27 announced with new features for Apple Vision Pro — https://9to5mac.com/2026/06/08/visionos-27-announced-with-new-features-for-vision-pro/ — 9to5Mac — 8 June 2026 — [secondary]
20. Spatial computing & Apple Intelligence upgrades collide in visionOS 27 — https://appleinsider.com/articles/26/06/08/spatial-computing-apple-intelligence-upgrades-collide-in-visionos-27 — AppleInsider — 8 June 2026 — [secondary]
21. visionOS 26 available from Sep 15, with spatial widgets, new Personas and more — https://9to5mac.com/2025/09/09/visionos-26-available-from-sep-15-with-spatial-widgets-new-personas-and-more/ — 9to5Mac — 9 September 2025 — [secondary]
22. Samsung Galaxy XR — https://en.wikipedia.org/wiki/Samsung_Galaxy_XR — Wikipedia (launch date 21 October 2025, $1,799, hardware specs) — [secondary]
23. Meta's new "Navigator" system UI finally rolled out to all Quest headsets — https://www.uploadvr.com/meta-horizon-os-navigator-ui-finally-rolled-out-to-all-quest-headsets/ — UploadVR — June 2026 — [secondary]
24. Headset hype meets harsh reality as Apple and Meta VR shipments fizzle in 2025 — https://www.theregister.com/2026/01/02/apple_vision_pro_meta_quest_sales_drop/ — The Register, citing IDC (Francisco Jeronimo) — 2 January 2026 — [secondary]
25. Global XR (AR & VR headsets) market share: quarterly — https://counterpointresearch.com/en/insights/global-xr-ar-vr-headsets-market-share-quarterly — Counterpoint Research (Q1 2026 shipments −17% YoY) — 2026 — [secondary]
26. Understanding real-world sizes for visionOS — https://www.createwithswift.com/understanding-real-world-sizes-for-visionos/ — Create with Swift (1 m = 1360 pt; 1280×720 pt ≈ 0.94 × 0.53 m) — [secondary]
27. The complete guide to designing for visionOS — https://think.design/blog/the-complete-guide-to-designing-for-visionos/ — Think Design (60×60 pt targets, 20 pt ornament overlap, 6-item tab bar) — [secondary]
28. 3D CSS guide: perspective, preserve-3d and translateZ — https://www.carmenansio.com/articles/3d-css-guide/ — Carmen Ansio — [secondary]
