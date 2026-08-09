---
name: glassmorphism
title: Glassmorphism
aliases: [glass morphism, frosted glass UI, glass UI, backdrop blur UI, acrylic, Aero Glass, translucent material]
category: ui-morphism
origin_year: 2020
peak_years: 2020-2022, 2025-2026
status_2026: mainstream
difficulty: medium
a11y_risk: high
perf_cost: medium
plugin_slug: glassmorphism-ui
last_researched: 2026-08-08
---

## 1. Essence

Glassmorphism is a surface treatment in which a UI panel behaves like a sheet of frosted glass: it is semi-transparent, it blurs and re-saturates whatever sits behind it, and it is edged with a hairline light border so you can still find where the pane ends. The feeling is depth without weight — you perceive a stack of physical planes floating above a colourful ground, and you retain peripheral awareness of the content underneath. The single defining move is `backdrop-filter: blur() saturate()` applied to a surface whose own `background` is only partially opaque. Everything else in the style — the 1px border, the inner top highlight, the vivid gradient behind it, the grain overlay — exists to make that one move read as *glass* rather than as *a smudge*.

## 2. Origin & Timeline

- **January 2007** — Microsoft ships Windows Vista to consumers with **Aero Glass**: translucent, Gaussian-blurred window chrome with a light reflection sweep. This is the first mass-market OS to make blurred translucency the default chrome material. Windows 7 (2009) refines it.
- **October 2007** — Mac OS X 10.5 Leopard introduces translucent menu bar and Stacks, adding a second mainstream reference point for OS-level translucency.
- **October 2012** — Windows 8 removes Aero Glass in favour of the flat Metro/Modern language. Blur is written off as a Vista-era embarrassment for roughly the next five years.
- **September 18, 2013** — iOS 7 ships. It is the flagship *flat* redesign, but critically it keeps translucency: Control Center, Notification Center, and navigation bars are live-blurred frosted panels. This is the moment the aesthetic becomes a phone-scale, everyday material rather than desktop chrome. Apple simultaneously ships **Settings → Accessibility → Reduce Transparency**, conceding on day one that the material has a legibility cost.
- **2017** — Microsoft announces the **Fluent Design System** with **Acrylic**, a formally specified translucent brush. Microsoft's own recipe, still published on Microsoft Learn, is a five-layer stack: *background → blur → exclusion blend → colour/tint overlay → noise*. The exclusion blend layer exists specifically to guarantee contrast of UI drawn on top; the noise layer exists to kill banding. This is the most rigorous vendor specification of the material that exists.
- **2019-07-30** — Chrome 76 ships `backdrop-filter` unprefixed, making the effect cheap on the web for the first time. (Safari had shipped `-webkit-backdrop-filter` back in Safari 9.)
- **June / November 2020** — Apple announces (WWDC, June 22) and releases (November 12) **macOS Big Sur**, which pushes translucent sidebars, toolbars and menus everywhere and gives the aesthetic a fresh, high-visibility reference implementation.
- **December 2020** — **Michal Malewicz** (Hype4 / Hype4 Academy) names and codifies the style as *glassmorphism* in a series of Medium/UX Collective posts, and Hype4 ships the **Glassmorphism CSS Generator**. The name is the contribution — the visual language already existed in Vista, iOS 7 and Big Sur, but naming it gave designers a search term, a hashtag and a shared rule set. Adoption on Dribbble and Behance is near-instant. Notably, Malewicz himself published *"Glassmorphism is my least favorite"* on **December 8, 2020**, within weeks of coining it, warning about exactly the overuse that followed.
- **October 5, 2021** — Windows 11 ships with **Mica** (opaque, wallpaper-tinted, cheap) alongside **Acrylic** (translucent, expensive, transient surfaces only). Microsoft's split is itself a design lesson: glass for transient UI, opaque material for persistent chrome.
- **2022-07-26** — Firefox 103 ships `backdrop-filter` unprefixed on Windows, macOS, Linux and Android. The long-running "glassmorphism doesn't work in Firefox" caveat, which shaped most 2020–2022 tutorials, is now obsolete — this is the single most common piece of stale advice still circulating.
- **5 June 2023** — Apple *announces* Vision Pro and visionOS, whose entire window model is glass over passthrough video. Spatial computing gives the material a functional justification (you must see your room through the UI) rather than a decorative one. The headset does not ship until **2 February 2024** (US, $3,499) — see [./10-spatial-ui.md](./10-spatial-ui.md) §2.
- **October 2023** — Chrome 118 ships the `prefers-reduced-transparency` media query (Edge 118 the same month), giving the web its first standard hook into the OS-level "Reduce Transparency" setting.
- **2024-09-16** — Safari 18 ships `backdrop-filter` **unprefixed**, which flips the feature to **Baseline: Newly available**. Global support crosses ~95% (Can I Use lists 95.69%). Baseline *Widely available* is projected for **2027-03-16**.
- **June 7, 2024** — Nielsen Norman Group publishes its glassmorphism article (Megan Brown), which is the point at which the style stops being a Dribbble trend and starts being discussed in mainstream UX literature with an explicit contrast caveat.
- **June 9, 2025 (WWDC25)** — Apple announces **Liquid Glass**, a system-wide dynamic material for iOS 26, iPadOS 26, macOS Tahoe 26, watchOS 26, tvOS 26 and visionOS 26. The taxonomy this set uses, stated identically in docs 01, 02, 03 and 08: **Liquid Glass is glassmorphism plus displacement, specular tracking and adaptive tint. It is a superset, not a rebrand; a blur-only implementation is glassmorphism.** See [./08-liquid-glass.md](./08-liquid-glass.md).
- **September 15, 2025** — iOS 26 and macOS Tahoe 26 ship publicly. Apple had already reduced transparency relative to the first betas after developer and accessibility pushback.
- **November 3, 2025** — Apple ships iOS 26.1 / macOS Tahoe 26.1 with a **Tinted** Liquid Glass option that raises surface opacity system-wide. Reading this correctly matters: the platform vendor with the largest investment in the material shipped a *turn it down* switch within seven weeks of release. Treat opacity as a user preference, not a brand constant.
- **2025-2026** — Google goes the other way and stays there: **Material 3 Expressive** (Android 16 QPR1, 2025; broader rollout 2026) adds heavy background blur to notification shade, recents and app drawer, but deliberately avoids glass-as-material framing — it is blur used for hierarchy inside a colour-first, opaque-surface system.
- **2026 status — mainstream, but demoted from headline to supporting role.** It is not dead and it is not dominant. Every major desktop and mobile OS now ships a blurred-translucency material as system chrome, which is the definition of mainstream. At the same time the design press has turned on decorative use — Creative Boom's 2026 "trends creatives are so over" list includes glass effects, and the widely repeated 2026 framing is "glass is a tool, not a trend." The honest read: **glass is now the default treatment for floating, transient, overlay chrome (navbars, command palettes, popovers, media controls, HUDs) and a bad default for content surfaces, forms and data tables.** Apple's Liquid Glass has absorbed the ambitious end of the style; plain glassmorphism has settled into the boring, useful middle.

**Where the research contradicted common priors:** (a) Windows Aero is usually dated 2007 but Vista's blurred chrome is properly a 2006 RTM / January 2007 consumer artifact; (b) Firefox has supported `backdrop-filter` unprefixed since 2022 — the "Firefox problem" is stale; (c) the term's originator publicly disliked the trend within a month of naming it; (d) `backdrop-filter` is *not yet* Baseline Widely Available and will not be until March 2027, so a fallback is still formally required, not optional politeness.

## 3. Visual DNA

- **Translucent fill, 6–24% alpha on dark, 28–60% on light** — The surface's own `background` is `rgba(255,255,255,0.06 … 0.24)` on dark grounds, or `rgba(15,18,28,0.28 … 0.60)` on light grounds. These are exactly the endpoints of the `--glass-fill-0 … -4` ladder in §4; the prose range and the token range are the same numbers by construction. Below 6% (dark) or 28% (light) the pane disappears; above ~25% on dark it stops reading as glass and becomes a tinted card, which is why 0.24 is the top rung and modals are the only thing allowed there.
- **Backdrop blur, 8–40px** — `backdrop-filter: blur(Npx)`. 8–12px for inline chips, 16–20px for navbars and cards, 28–40px for modals and sheets. The blur radius should scale with the element's z-elevation, not with its size.
- **Backdrop saturation boost, 140–180%** — Gaussian blur averages colour toward grey. `saturate(160%)` restores the chroma and is what separates convincing glass from a dirty window. This is the web analogue of Apple's *vibrancy*.
- **Hairline light border, 1px at 16–28% white** — `border: 1px solid rgba(255,255,255,0.22)`. Non-negotiable. It is the only thing that defines the pane's edge when the backdrop happens to match the fill, and it is the primary accommodation for low-vision users.
- **Directional inner highlight** — `inset 0 1px 0 rgba(255,255,255,0.35)` on the top edge and optionally `inset 0 -1px 0 rgba(0,0,0,0.12)` on the bottom. Simulates a light source above; makes the pane read as a *slab* with thickness rather than a decal.
- **Soft, wide, low-opacity drop shadow** — `0 8px 32px -8px rgba(0,0,0,0.35)`. Large blur radius, negative spread, never a hard offset. Glass is light; heavy shadows read as plastic (see [./04-claymorphism.md](./04-claymorphism.md)).
- **Generous corner radius, 12–28px** — 16px is the modern default for cards, 24–28px for sheets, 999px for pills. Sharp corners fight the material's softness. Radii below 8px make the 1px border look like a stroke rather than an edge.
- **A vivid, structured backdrop is a hard dependency** — Glass over flat `#111` is invisible. The style requires a mesh gradient, a photograph, an aurora wash, or overlapping colour blobs. Two to four saturated hues, ideally with a luminance range you control.
- **Multi-layer depth, 2–4 planes** — Background → optional mid-layer blobs → glass panel → optional second glass panel at different alpha. Each successive layer raises fill alpha and blur radius. More than four planes turns into mud.
- **Fine grain / noise overlay, 2–5% opacity** — An SVG `feTurbulence` layer at `baseFrequency` 0.8, `numOctaves` 4. Kills gradient banding in the blurred backdrop and adds the microtexture that real glass has. This is exactly the fifth layer of Microsoft's published Acrylic recipe. *The set uses three different grain recipes on purpose: 0.8 / 4 octaves at 0.02–0.05 here (soft, de-banding, must not fog the glass); 0.9 / 2 octaves at 0.04–0.06 in [./01-skeuomorphism.md](./01-skeuomorphism.md) (tight machining grain); 0.8 / 3 octaves at 0.04–0.12 in [./06-maximalism.md](./06-maximalism.md) (visible print texture). Copying the wrong one is the usual reason glass looks dirty.*
- **Content is opaque, the surface is not** — Text, icons and controls sitting on glass are rendered at full opacity, ideally on a nested higher-opacity scrim. Never fade the text to "match" the glass.
- **Cool, desaturated typography colour** — `#F4F6FB` / `rgba(255,255,255,0.92)` for primary, `rgba(255,255,255,0.66)` for secondary. Pure `#FFF` on glass tends to bloom against a bright backdrop.

## 4. Anatomy & Design Tokens

### Canonical values

| Token group | Token | Value (dark ground) | Value (light ground) | Notes |
| --- | --- | --- | --- | --- |
| Fill | `--glass-fill-0` | `rgba(255,255,255,0.06)` | `rgba(15,18,28,0.28)` | Flush / inline chips |
| Fill | `--glass-fill-1` | `rgba(255,255,255,0.10)` | `rgba(15,18,28,0.36)` | Cards |
| Fill | `--glass-fill-2` | `rgba(255,255,255,0.14)` | `rgba(15,18,28,0.44)` | Nav bars, toolbars |
| Fill | `--glass-fill-3` | `rgba(255,255,255,0.18)` | `rgba(15,18,28,0.52)` | Popovers, menus |
| Fill | `--glass-fill-4` | `rgba(255,255,255,0.24)` | `rgba(15,18,28,0.60)` | Modals, sheets |
| Scrim | `--glass-text-scrim` | `rgba(9,9,14,0.56)` | `rgba(255,255,255,0.72)` | Minimum for guaranteed 4.5:1 body text (see §7) |
| Blur | `--glass-blur-0…4` | `8px / 12px / 20px / 28px / 40px` | same | Scales with elevation, not size |
| Saturate | `--glass-saturate` | `160%` | `150%` | 140–180% usable band |
| Brightness | `--glass-brightness` | `1.06` | `0.98` | Optional; lifts dark backdrops |
| Border | `--glass-border-color` | `rgba(255,255,255,0.22)` | `rgba(15,18,28,0.14)` | 1px, always present |
| Border | `--glass-border-strong` | `rgba(255,255,255,0.34)` | `rgba(15,18,28,0.22)` | Hover / focus |
| Radius | `--glass-r-sm/md/lg/xl/pill` | `10px / 16px / 22px / 28px / 999px` | same | 16px default |
| Shadow | `--glass-shadow-1` | `0 1px 2px rgba(0,0,0,0.16)` | `0 1px 2px rgba(15,18,28,0.08)` | Resting card |
| Shadow | `--glass-shadow-2` | `0 8px 32px -8px rgba(0,0,0,0.38)` | `0 8px 32px -8px rgba(15,18,28,0.16)` | Nav, popover |
| Shadow | `--glass-shadow-3` | `0 24px 64px -16px rgba(0,0,0,0.48)` | `0 24px 64px -16px rgba(15,18,28,0.22)` | Modal |
| Shadow | `--glass-inner-top` | `inset 0 1px 0 rgba(255,255,255,0.35)` | `inset 0 1px 0 rgba(255,255,255,0.60)` | Slab highlight |
| Shadow | `--glass-inner-bottom` | `inset 0 -1px 0 rgba(0,0,0,0.14)` | `inset 0 -1px 0 rgba(15,18,28,0.06)` | Optional |
| Noise | `--glass-noise-opacity` | `0.035` | `0.028` | 0.02–0.05 band |
| Noise | `feTurbulence baseFrequency` | `0.8`, `numOctaves 4` | same | Higher = finer grain |
| Text | `--glass-fg` | `rgba(255,255,255,0.94)` | `rgba(12,14,22,0.94)` | |
| Text | `--glass-fg-muted` | `rgba(255,255,255,0.66)` | `rgba(12,14,22,0.62)` | Never below 0.60 |
| Type scale | 12 / 14 / 16 / 20 / 24 / 32 / 44 px | 1.5 line-height body, 1.15 display | | Avoid weights under 400 on glass |
| Spacing | 4 / 8 / 12 / 16 / 24 / 32 / 48 px | card padding 20–24px | | |
| Motion | `--glass-dur-in` | `180ms` | | Enter |
| Motion | `--glass-dur-out` | `120ms` | | Exit |
| Motion | `--glass-dur-blur` | `260ms` | | Blur-radius transitions only |
| Motion | `--glass-ease` | `cubic-bezier(0.2, 0, 0, 1)` | | Standard |
| Motion | `--glass-ease-out` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | | Exit |
| Target | `--glass-target-min` | `44px` | same | SC 2.5.8's floor is 24px; glass sits at 44 because the panel edge is not a dependable boundary. §7 puts the 1px hairline near **1.2:1** over a light composite, and the composite moves as the user scrolls, so the visible extent of a control is indeterminate — the user aims at an edge they cannot reliably see. Glass's signature components (docks, toolbars, bottom sheets) are touch-first as well, so 44 is the base value rather than a `pointer: coarse` override. Chips and pills are the controls this style shrinks; floor them here. |

### Elevation ladder

| Level | Use | Fill α | Blur | Border α | Shadow |
| --- | --- | --- | --- | --- | --- |
| 0 | Inline chip, tag, badge | 0.06 | 8px | 0.12 | none |
| 1 | Card, tile | 0.10 | 12px | 0.16 | `--glass-shadow-1` |
| 2 | Sticky nav, toolbar, dock | 0.14 | 20px | 0.22 | `--glass-shadow-2` |
| 3 | Popover, dropdown, command palette | 0.18 | 28px | 0.26 | `--glass-shadow-2` |
| 4 | Modal, bottom sheet | 0.24 | 40px | 0.30 | `--glass-shadow-3` |

### Ready-to-paste custom properties

```css
:root {
  color-scheme: light dark;

  /* ---- Ground (glass needs a vivid backdrop; this is the default) ---- */
  --glass-ground-1: #6d3bff;
  --glass-ground-2: #00c2ff;
  --glass-ground-3: #ff4d9d;
  --glass-ground-base: #0b0b12;

  /* ---- Fills ---- */
  --glass-fill-0: rgba(255, 255, 255, 0.06);
  --glass-fill-1: rgba(255, 255, 255, 0.10);
  --glass-fill-2: rgba(255, 255, 255, 0.14);
  --glass-fill-3: rgba(255, 255, 255, 0.18);
  --glass-fill-4: rgba(255, 255, 255, 0.24);
  --glass-text-scrim: rgba(9, 9, 14, 0.56);

  /* ---- Backdrop filter parts ---- */
  --glass-blur-0: 8px;
  --glass-blur-1: 12px;
  --glass-blur-2: 20px;
  --glass-blur-3: 28px;
  --glass-blur-4: 40px;
  --glass-saturate: 160%;
  --glass-brightness: 1.06;
  --glass-backdrop-1: blur(var(--glass-blur-1)) saturate(var(--glass-saturate));
  --glass-backdrop-2: blur(var(--glass-blur-2)) saturate(var(--glass-saturate));
  --glass-backdrop-3: blur(var(--glass-blur-3)) saturate(var(--glass-saturate));
  --glass-backdrop-4: blur(var(--glass-blur-4)) saturate(var(--glass-saturate));

  /* ---- Edges ---- */
  --glass-border-color: rgba(255, 255, 255, 0.22);
  --glass-border-strong: rgba(255, 255, 255, 0.34);
  --glass-r-sm: 10px;
  --glass-r-md: 16px;
  --glass-r-lg: 22px;
  --glass-r-xl: 28px;
  --glass-r-pill: 999px;

  /* ---- Shadows ---- */
  --glass-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.16);
  --glass-shadow-2: 0 8px 32px -8px rgba(0, 0, 0, 0.38);
  --glass-shadow-3: 0 24px 64px -16px rgba(0, 0, 0, 0.48);
  --glass-inner-top: inset 0 1px 0 rgba(255, 255, 255, 0.35);
  --glass-inner-bottom: inset 0 -1px 0 rgba(0, 0, 0, 0.14);

  /* ---- Texture ---- */
  --glass-noise-opacity: 0.035;

  /* ---- Foreground ---- */
  --glass-fg: rgba(255, 255, 255, 0.94);
  --glass-fg-muted: rgba(255, 255, 255, 0.66);
  --glass-accent: #7dd3fc;

  /* ---- Motion ---- */
  --glass-dur-in: 180ms;
  --glass-dur-out: 120ms;
  --glass-dur-blur: 260ms;
  --glass-ease: cubic-bezier(0.2, 0, 0, 1);
  --glass-ease-out: cubic-bezier(0.3, 0, 0.8, 0.15);

  /* ---- Hit targets (theme-independent: declared once, on bare :root) ---- */
  --glass-target-min: 44px;   /* 24px is the SC 2.5.8 floor; 44 because a
                                 ~1.2:1 hairline is not an aimable edge */

  /* ---- Opaque fallback surfaces (used by @supports + a11y queries) ---- */
  --glass-solid-1: #171a24;
  --glass-solid-2: #1d2130;
  --glass-solid-4: #232838;
}

/* Light ground override. Glass on a light backdrop must be a DARK tint,
   not a lighter white, or it vanishes.
   This doc is the one dark-first style in the set, so the polarity of rule (3)
   is inverted here: dark values live on bare `:root`, the light override is
   guarded with `:not([data-theme="dark"])`, and the full light token list is
   duplicated under `:root[data-theme="light"]` below. An explicit toggle then
   beats the OS preference in both directions — which is exactly what the
   guarded-media-query pattern in docs 01, 02, 05, 07 and 09 buys, mirrored. */
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --glass-ground-base: #eef1f8;
    --glass-fill-0: rgba(15, 18, 28, 0.28);
    --glass-fill-1: rgba(15, 18, 28, 0.36);
    --glass-fill-2: rgba(15, 18, 28, 0.44);
    --glass-fill-3: rgba(15, 18, 28, 0.52);
    --glass-fill-4: rgba(15, 18, 28, 0.60);
    --glass-text-scrim: rgba(255, 255, 255, 0.72);
    --glass-saturate: 150%;
    --glass-brightness: 0.98;
    --glass-border-color: rgba(15, 18, 28, 0.14);
    --glass-border-strong: rgba(15, 18, 28, 0.22);
    --glass-shadow-1: 0 1px 2px rgba(15, 18, 28, 0.08);
    --glass-shadow-2: 0 8px 32px -8px rgba(15, 18, 28, 0.16);
    --glass-shadow-3: 0 24px 64px -16px rgba(15, 18, 28, 0.22);
    --glass-inner-top: inset 0 1px 0 rgba(255, 255, 255, 0.60);
    --glass-inner-bottom: inset 0 -1px 0 rgba(15, 18, 28, 0.06);
    --glass-noise-opacity: 0.028;
    --glass-fg: rgba(12, 14, 22, 0.94);
    --glass-fg-muted: rgba(12, 14, 22, 0.62);
    --glass-accent: #0369a1;
    --glass-solid-1: #ffffff;
    --glass-solid-2: #f7f8fc;
    --glass-solid-4: #ffffff;
  }
}

/* Explicit overrides for apps with a manual theme toggle. Both lists are
   COMPLETE — a partial override leaves half the palette on the other theme's
   values, which is the bug that produces dark text on a dark scrim. */
:root[data-theme="dark"] {
  color-scheme: dark;
  --glass-ground-base: #0b0b12;
  --glass-fill-0: rgba(255, 255, 255, 0.06);
  --glass-fill-1: rgba(255, 255, 255, 0.10);
  --glass-fill-2: rgba(255, 255, 255, 0.14);
  --glass-fill-3: rgba(255, 255, 255, 0.18);
  --glass-fill-4: rgba(255, 255, 255, 0.24);
  --glass-text-scrim: rgba(9, 9, 14, 0.56);
  --glass-saturate: 160%;
  --glass-brightness: 1.06;
  --glass-border-color: rgba(255, 255, 255, 0.22);
  --glass-border-strong: rgba(255, 255, 255, 0.34);
  --glass-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.16);
  --glass-shadow-2: 0 8px 32px -8px rgba(0, 0, 0, 0.38);
  --glass-shadow-3: 0 24px 64px -16px rgba(0, 0, 0, 0.48);
  --glass-inner-top: inset 0 1px 0 rgba(255, 255, 255, 0.35);
  --glass-inner-bottom: inset 0 -1px 0 rgba(0, 0, 0, 0.14);
  --glass-noise-opacity: 0.035;
  --glass-fg: rgba(255, 255, 255, 0.94);
  --glass-fg-muted: rgba(255, 255, 255, 0.66);
  --glass-accent: #7dd3fc;
  --glass-solid-1: #171a24;
  --glass-solid-2: #1d2130;
  --glass-solid-4: #232838;
}

:root[data-theme="light"] {
  color-scheme: light;
  --glass-ground-base: #eef1f8;
  --glass-fill-0: rgba(15, 18, 28, 0.28);
  --glass-fill-1: rgba(15, 18, 28, 0.36);
  --glass-fill-2: rgba(15, 18, 28, 0.44);
  --glass-fill-3: rgba(15, 18, 28, 0.52);
  --glass-fill-4: rgba(15, 18, 28, 0.60);
  --glass-text-scrim: rgba(255, 255, 255, 0.72);
  --glass-saturate: 150%;
  --glass-brightness: 0.98;
  --glass-border-color: rgba(15, 18, 28, 0.14);
  --glass-border-strong: rgba(15, 18, 28, 0.22);
  --glass-shadow-1: 0 1px 2px rgba(15, 18, 28, 0.08);
  --glass-shadow-2: 0 8px 32px -8px rgba(15, 18, 28, 0.16);
  --glass-shadow-3: 0 24px 64px -16px rgba(15, 18, 28, 0.22);
  --glass-inner-top: inset 0 1px 0 rgba(255, 255, 255, 0.60);
  --glass-inner-bottom: inset 0 -1px 0 rgba(15, 18, 28, 0.06);
  --glass-noise-opacity: 0.028;
  --glass-fg: rgba(12, 14, 22, 0.94);
  --glass-fg-muted: rgba(12, 14, 22, 0.62);
  --glass-accent: #0369a1;
  --glass-solid-1: #ffffff;
  --glass-solid-2: #f7f8fc;
  --glass-solid-4: #ffffff;
}
```

## 5. Implementation Recipes

### Vanilla CSS

A complete, runnable panel including the vivid ground, the `@supports` fallback, the grain layer, and the accessibility escape hatches.

```html
<div class="glass-stage">
  <section class="glass glass--2">
    <h2 class="glass__title">Deploy preview</h2>
    <p class="glass__body">Build 4c91f2 finished in 42s. 3 routes changed.</p>
    <button class="glass-btn" type="button">Promote to production</button>
  </section>
</div>

<!-- One inline SVG, reused by every glass surface on the page. -->
<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
  <filter id="glass-grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
</svg>
```

```css
/* 1 — The ground. Glass is invisible without one. */
.glass-stage {
  min-height: 100svh;
  padding: 48px;
  display: grid;
  place-items: center;
  background-color: var(--glass-ground-base);
  background-image:
    radial-gradient(60rem 40rem at 12% 18%, color-mix(in oklab, var(--glass-ground-1) 70%, transparent), transparent 60%),
    radial-gradient(50rem 36rem at 88% 24%, color-mix(in oklab, var(--glass-ground-2) 70%, transparent), transparent 62%),
    radial-gradient(46rem 34rem at 50% 96%, color-mix(in oklab, var(--glass-ground-3) 60%, transparent), transparent 60%);
  background-attachment: fixed;
}

/* 2 — Opaque baseline. This is what every browser gets first. */
.glass {
  position: relative;
  isolation: isolate;
  max-width: 30rem;
  padding: 24px;
  border-radius: var(--glass-r-md);
  border: 1px solid var(--glass-border-color);
  background-color: var(--glass-solid-2);
  color: var(--glass-fg);
  box-shadow: var(--glass-shadow-2), var(--glass-inner-top), var(--glass-inner-bottom);
}

/* 3 — Progressive enhancement. Only browsers that can actually blur
      get the translucent fill, so unsupported browsers never render
      unreadable low-alpha text panels. */
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass {
    background-color: var(--glass-fill-1);
    -webkit-backdrop-filter: var(--glass-backdrop-1);
    backdrop-filter: var(--glass-backdrop-1);
  }
  .glass--2 {
    background-color: var(--glass-fill-2);
    -webkit-backdrop-filter: var(--glass-backdrop-2);
    backdrop-filter: var(--glass-backdrop-2);
  }
  .glass--4 {
    background-color: var(--glass-fill-4);
    -webkit-backdrop-filter: var(--glass-backdrop-4);
    backdrop-filter: var(--glass-backdrop-4);
    border-radius: var(--glass-r-xl);
    box-shadow: var(--glass-shadow-3), var(--glass-inner-top);
  }
}

/* 4 — Grain. Sits above the fill, below the content. */
.glass::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  filter: url(#glass-grain);
  opacity: var(--glass-noise-opacity);
  pointer-events: none;
  /* Grain must not be a backdrop root itself — no opacity on the parent. */
}

/* 5 — Gradient hairline. Replaces the flat border with a lit edge.
      mask-composite carves the interior out of a 1px-padded gradient box. */
.glass--lit {
  border-color: transparent;
}
.glass--lit::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.10) 42%,
    rgba(255, 255, 255, 0.05) 58%,
    rgba(255, 255, 255, 0.30) 100%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.glass__title { margin: 0 0 6px; font: 600 20px/1.25 system-ui, sans-serif; }
.glass__body  { margin: 0 0 20px; font: 400 15px/1.55 system-ui, sans-serif; color: var(--glass-fg-muted); }

/* 6 — Controls on glass get their own, stronger surface. */
.glass-btn {
  appearance: none;
  padding: 10px 18px;
  border-radius: var(--glass-r-pill);
  border: 1px solid var(--glass-border-strong);
  background: var(--glass-fill-3);
  color: var(--glass-fg);
  font: 600 14px/1 system-ui, sans-serif;
  cursor: pointer;
  transition:
    background-color var(--glass-dur-in) var(--glass-ease),
    border-color var(--glass-dur-in) var(--glass-ease),
    transform var(--glass-dur-in) var(--glass-ease);
}
.glass-btn:hover { background: var(--glass-fill-4); border-color: rgba(255, 255, 255, 0.46); }
.glass-btn:active { transform: translateY(1px) scale(0.985); }
.glass-btn:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.55);
}

/* 7 — Accessibility escape hatches. All three are mandatory. */
@media (prefers-reduced-transparency: reduce) {
  .glass, .glass--2, .glass--4 {
    background-color: var(--glass-solid-2);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
  .glass::after { display: none; }
}

@media (prefers-contrast: more) {
  .glass, .glass--2, .glass--4 {
    background-color: var(--glass-solid-1);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    border-color: var(--glass-fg);
  }
  .glass__body { color: var(--glass-fg); }
}

@media (forced-colors: active) {
  .glass, .glass--2, .glass--4, .glass-btn {
    background-color: Canvas;
    color: CanvasText;
    border: 1px solid CanvasText;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
    forced-color-adjust: none;
  }
  .glass::after, .glass--lit::before { display: none; }
  .glass-btn:focus-visible { outline: 2px solid Highlight; }
}

@media (prefers-reduced-motion: reduce) {
  .glass-btn { transition-duration: 1ms; }
  .glass-stage { background-attachment: scroll; }
}
```

**Two gotchas that break this more often than anything else.** First, `backdrop-filter` samples the *backdrop root*, and any ancestor with `opacity < 1`, `filter`, `mask`, `clip-path`, `mix-blend-mode`, or a matching `will-change` becomes a backdrop root — the blur will then only sample content inside that ancestor and the panel will look flat. Second, the element must have a translucent `background`; a fully opaque background hides the blurred backdrop entirely.

### Tailwind CSS v4

Tailwind v4 ships `backdrop-blur-{xs,sm,md,lg,xl,2xl,3xl}` mapping to `4px / 8px / 12px / 16px / 24px / 40px / 64px`, plus `backdrop-saturate-*`. No plugin is required for the core effect; a plugin is only worth it if you want a single `glass-2` class instead of a six-utility string. Define the ladder as theme tokens and expose it with `@utility`.

```css
/* app.css */
@import "tailwindcss";

@theme {
  /* Extra blur stops so the elevation ladder maps 1:1 to utilities. */
  --blur-glass-0: 8px;
  --blur-glass-1: 12px;
  --blur-glass-2: 20px;
  --blur-glass-3: 28px;
  --blur-glass-4: 40px;

  /* The 0 step must exist or `glass-0` resolves to nothing and the pane is
     transparent. Keep the ladder complete: 0,1,2,3,4 in both namespaces. */
  --color-glass-fill-0: rgba(255, 255, 255, 0.06);
  --color-glass-fill-1: rgba(255, 255, 255, 0.10);
  --color-glass-fill-2: rgba(255, 255, 255, 0.14);
  --color-glass-fill-3: rgba(255, 255, 255, 0.18);
  --color-glass-fill-4: rgba(255, 255, 255, 0.24);
  --color-glass-edge: rgba(255, 255, 255, 0.22);
  --color-glass-edge-strong: rgba(255, 255, 255, 0.34);
  --color-glass-solid: #1d2130;

  --radius-glass: 16px;
  --radius-glass-lg: 28px;

  --shadow-glass-1: 0 1px 2px rgba(0, 0, 0, 0.16);
  --shadow-glass-2: 0 8px 32px -8px rgba(0, 0, 0, 0.38);
  --shadow-glass-3: 0 24px 64px -16px rgba(0, 0, 0, 0.48);

  --ease-glass: cubic-bezier(0.2, 0, 0, 1);
}

/* Composite utility: opaque first, glass only where supported. */
@utility glass-* {
  border-width: 1px;
  border-color: var(--color-glass-edge);
  border-radius: var(--radius-glass);
  background-color: var(--color-glass-solid);
  box-shadow: var(--shadow-glass-2), inset 0 1px 0 rgba(255, 255, 255, 0.35);

  /* v4 matcher syntax is `--value(--namespace-*)` — no space before the `*`.
     With a space the matcher never resolves and the utility silently falls
     back to the opaque fill, so `glass-2` is never glass. */
  @supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background-color: --value(--color-glass-fill-*);
    -webkit-backdrop-filter: blur(--value(--blur-glass-*)) saturate(160%);
    backdrop-filter: blur(--value(--blur-glass-*)) saturate(160%);
  }

  @media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
    background-color: var(--color-glass-solid);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }

  @media (forced-colors: active) {
    background-color: Canvas;
    border-color: CanvasText;
    box-shadow: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
```

Usage, both with the composite utility and with raw utilities if you prefer to stay vanilla:

```html
<!-- Composite -->
<nav class="glass-2 sticky top-4 mx-auto flex w-[min(64rem,92vw)] items-center
            gap-6 px-6 py-3 text-white/90">
  <span class="font-semibold">Aperture</span>
  <a class="text-white/70 hover:text-white transition-colors duration-150" href="#">Docs</a>
  <a class="text-white/70 hover:text-white transition-colors duration-150" href="#">Pricing</a>
</nav>

<!-- Raw utilities, no plugin, no custom theme.
     Outer drop shadow and inner highlight are ONE declaration: `shadow-[…]` and
     `[box-shadow:…]` both write box-shadow, and the arbitrary-property utility
     wins, so stacking them silently deletes the elevation.
     The `not` keyword in an @supports condition needs a following space, which
     in Tailwind's arbitrary-variant syntax is written as an underscore. -->
<div class="rounded-2xl border border-white/20 bg-white/10
            backdrop-blur-lg backdrop-saturate-150
            [box-shadow:0_8px_32px_-8px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.35)]
            supports-[not_(backdrop-filter:blur(1px))]:bg-slate-800
            motion-reduce:transition-none
            p-6 text-white/90">
  Frosted card
</div>

<!-- Arbitrary blur value when the ladder does not fit -->
<div class="backdrop-blur-[18px] backdrop-saturate-[165%] bg-white/12">…</div>
```

Note the `supports-[not_(...)]` variant: Tailwind v4 supports `supports-*` variants directly, which is the terse equivalent of the `@supports` block above — but the generated condition must be `@supports not (backdrop-filter: blur(1px))` with a space after `not`, or the whole at-rule is invalid CSS and the opaque fallback never applies. Tailwind turns the underscore into that space. If you would rather not depend on that, keep the plain `@supports` block from the Vanilla CSS recipe earlier in this section; it is the more reliable route. `motion-reduce:` and `contrast-more:` variants are built in; `prefers-reduced-transparency` has no built-in variant as of v4, so declare it in the `@utility`/`@layer` CSS as shown.

### React component

TypeScript, no dependencies beyond React. Props drive elevation, intensity, tone and the interactive affordance; the component injects its own stylesheet once and renders a single shared grain filter.

```tsx
// GlassSurface.tsx
import * as React from "react";

export type GlassElevation = 0 | 1 | 2 | 3 | 4;
export type GlassTone = "light" | "dark";

export interface GlassSurfaceProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "style"> {
  /** Depth in the glass ladder. Drives fill alpha, blur radius and shadow. */
  elevation?: GlassElevation;
  /** 0–100. Scales fill alpha and blur around the elevation defaults. */
  intensity?: number;
  /** "light" = white tint (for dark grounds). "dark" = ink tint (for light grounds). */
  tone?: GlassTone;
  /** Corner radius in px. */
  radius?: number;
  /** Adds the SVG grain layer. */
  grain?: boolean;
  /** Adds hover/active feedback. Only set on genuinely interactive surfaces. */
  interactive?: boolean;
  /** Wraps children in a higher-opacity scrim so body text is guaranteed readable. */
  textScrim?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

const FILL_ALPHA: Record<GlassElevation, number> = { 0: 0.06, 1: 0.1, 2: 0.14, 3: 0.18, 4: 0.24 };
const BLUR_PX: Record<GlassElevation, number> = { 0: 8, 1: 12, 2: 20, 3: 28, 4: 40 };
const BORDER_ALPHA: Record<GlassElevation, number> = { 0: 0.12, 1: 0.16, 2: 0.22, 3: 0.26, 4: 0.3 };
const SHADOW: Record<GlassElevation, string> = {
  0: "none",
  1: "0 1px 2px rgba(0,0,0,0.16)",
  2: "0 8px 32px -8px rgba(0,0,0,0.38)",
  3: "0 8px 32px -8px rgba(0,0,0,0.38)",
  4: "0 24px 64px -16px rgba(0,0,0,0.48)",
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const STYLE_ID = "glass-surface-styles";

/* One token layer for the whole doc. This sheet declares NO new prefix: every
   custom property below is a `--glass-*` name from §4. The four per-instance
   values the component computes (`--glass-fill`, `--glass-fill-hover`,
   `--glass-blur`, `--glass-radius`) are the resolved rungs of the §4 ladders,
   and each one falls back to the §4 `:root` value when the component is
   rendered without inline vars — so theming `--glass-*` at the app root really
   does re-theme <GlassSurface>. */
const CSS = `
.gs{position:relative;isolation:isolate;
  color:var(--glass-fg, rgba(255,255,255,0.94));
  border-style:solid;border-width:1px;
  background-color:var(--glass-solid, var(--glass-solid-2, #1d2130));
  transition:background-color var(--glass-dur-in,180ms) var(--glass-ease,cubic-bezier(.2,0,0,1)),
             border-color var(--glass-dur-in,180ms) var(--glass-ease,cubic-bezier(.2,0,0,1)),
             transform var(--glass-dur-in,180ms) var(--glass-ease,cubic-bezier(.2,0,0,1)),
             box-shadow var(--glass-dur-in,180ms) var(--glass-ease,cubic-bezier(.2,0,0,1));}
@supports ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
  .gs{background-color:var(--glass-fill, var(--glass-fill-1));
      -webkit-backdrop-filter:blur(var(--glass-blur, var(--glass-blur-1))) saturate(var(--glass-saturate,160%));
      backdrop-filter:blur(var(--glass-blur, var(--glass-blur-1))) saturate(var(--glass-saturate,160%));}
}
.gs__grain{position:absolute;inset:0;z-index:-1;border-radius:inherit;
  filter:url(#glass-grain);opacity:var(--glass-noise-opacity,0.035);pointer-events:none;}
.gs__scrim{position:relative;border-radius:calc(var(--glass-radius, var(--glass-r-md,16px)) - 6px);
  background:var(--glass-text-scrim);padding:12px 14px;}
.gs--i:hover{background-color:var(--glass-fill-hover, var(--glass-fill-2));
  border-color:var(--glass-border-strong);}
.gs--i:active{transform:translateY(1px) scale(.99);}
.gs--i:focus-visible{outline:2px solid #fff;outline-offset:2px;
  box-shadow:0 0 0 5px rgba(0,0,0,.55);}
@media (prefers-reduced-motion:reduce){.gs{transition-duration:1ms}.gs--i:active{transform:none}}
@media (prefers-reduced-transparency:reduce),(prefers-contrast:more){
  .gs{background-color:var(--glass-solid, var(--glass-solid-2, #1d2130))!important;
      -webkit-backdrop-filter:none!important;backdrop-filter:none!important;}
  .gs__grain{display:none}
  .gs__scrim{background:transparent;padding:0}
}
@media (forced-colors:active){
  .gs{background-color:Canvas!important;color:CanvasText;border-color:CanvasText;
      box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}
  .gs__grain{display:none}
  .gs--i:focus-visible{outline:2px solid Highlight}
}
`;

function useGlassStyles(): void {
  React.useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Render exactly once per app, near the root. */
export function GlassGrainFilter(): React.JSX.Element {
  return (
    <svg width={0} height={0} aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <filter id="glass-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={4} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
  );
}

export function GlassSurface({
  elevation = 1,
  intensity = 50,
  tone = "light",
  radius = 16,
  grain = true,
  interactive = false,
  textScrim = false,
  as = "div",
  className,
  children,
  style,
  ...rest
}: GlassSurfaceProps): React.JSX.Element {
  useGlassStyles();

  const k = clamp(intensity, 0, 100) / 50; // 1.0 at the default of 50
  const isLight = tone === "light";
  const rgb = isLight ? "255,255,255" : "15,18,28";

  const alpha = clamp(FILL_ALPHA[elevation] * k, 0.04, isLight ? 0.3 : 0.72);
  const blur = Math.round(clamp(BLUR_PX[elevation] * k, 4, 48));
  const border = clamp(BORDER_ALPHA[elevation] * k, 0.1, 0.42);
  const sat = Math.round(clamp(100 + 60 * k, 100, 200));

  // Every key here is a §4 `--glass-*` name. Anything the component does not
  // compute is deliberately absent, so the app-level `:root` value shows
  // through — that is the bridge between the documented token layer and this
  // component.
  const vars = {
    "--glass-fill": `rgba(${rgb},${alpha.toFixed(3)})`,
    "--glass-fill-hover": `rgba(${rgb},${clamp(alpha * 1.35, 0.06, isLight ? 0.36 : 0.8).toFixed(3)})`,
    "--glass-solid": isLight ? "#1d2130" : "#ffffff",
    "--glass-fg": isLight ? "rgba(255,255,255,0.94)" : "rgba(12,14,22,0.94)",
    "--glass-text-scrim": isLight ? "rgba(9,9,14,0.56)" : "rgba(255,255,255,0.72)",
    "--glass-blur": `${blur}px`,
    "--glass-saturate": `${sat}%`,
    "--glass-noise-opacity": grain ? "0.035" : "0",
    "--glass-radius": `${radius}px`,
    "--glass-border-strong": `rgba(${rgb},${clamp(border * 1.5, 0.12, 0.55).toFixed(3)})`,
    borderRadius: `${radius}px`,
    borderColor: `rgba(${rgb},${border.toFixed(3)})`,
    boxShadow:
      SHADOW[elevation] === "none"
        ? `inset 0 1px 0 rgba(255,255,255,${isLight ? 0.35 : 0.6})`
        : `${SHADOW[elevation]}, inset 0 1px 0 rgba(255,255,255,${isLight ? 0.35 : 0.6})`,
    ...style,
  } as React.CSSProperties;

  const Tag = as as React.ElementType;

  return (
    <Tag
      className={["gs", interactive ? "gs--i" : "", className].filter(Boolean).join(" ")}
      style={vars}
      {...rest}
    >
      {grain ? <span className="gs__grain" aria-hidden="true" /> : null}
      {textScrim ? <div className="gs__scrim">{children}</div> : children}
    </Tag>
  );
}
```

```tsx
// Usage
import { GlassSurface, GlassGrainFilter } from "./GlassSurface";

export default function App() {
  return (
    <>
      <GlassGrainFilter />
      <GlassSurface as="nav" elevation={2} intensity={55} radius={999}
                    style={{ padding: "10px 20px", display: "flex", gap: 20 }}>
        <strong>Aperture</strong>
        <a href="#docs">Docs</a>
      </GlassSurface>

      <GlassSurface elevation={1} intensity={40} radius={16} textScrim
                    style={{ padding: 24, maxWidth: 420 }}>
        <h2 style={{ margin: 0 }}>Weekly digest</h2>
        <p style={{ margin: "6px 0 0" }}>12 new issues, 4 closed.</p>
      </GlassSurface>
    </>
  );
}
```

### Native / other platform

**SwiftUI (verified against Apple Developer documentation).** Apple has shipped a first-class material system since iOS 15 / macOS 12, and it is strictly better than hand-rolling a blur because it handles vibrancy, Reduce Transparency and Increase Contrast for you.

```swift
import SwiftUI

struct GlassCard<Content: View>: View {
    var cornerRadius: CGFloat = 16
    /// .ultraThinMaterial … .thickMaterial map to the glassmorphism elevation ladder.
    var material: Material = .regularMaterial
    @ViewBuilder var content: Content

    // Honour the system accessibility switches explicitly.
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        content
            .padding(20)
            .background {
                if reduceTransparency {
                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(colorScheme == .dark ? Color(white: 0.11) : Color.white)
                } else {
                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(material)
                }
            }
            .overlay {
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(
                        LinearGradient(
                            colors: [.white.opacity(0.45), .white.opacity(0.08)],
                            startPoint: .topLeading, endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            }
            .shadow(color: .black.opacity(0.28), radius: 24, x: 0, y: 10)
    }
}

struct Stage: View {
    var body: some View {
        ZStack {
            LinearGradient(colors: [.purple, .cyan, .pink],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()

            GlassCard(cornerRadius: 22, material: .thinMaterial) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Deploy preview").font(.headline)
                    Text("Build 4c91f2 · 42s").font(.subheadline).foregroundStyle(.secondary)
                }
            }
            .frame(maxWidth: 360)
        }
    }
}
```

Material ladder mapping: `.ultraThinMaterial` → elevation 0-1, `.thinMaterial` → 1-2, `.regularMaterial` → 2-3, `.thickMaterial` → 4, `.bar` → toolbars and tab bars. All are iOS 15+/macOS 12+. On iOS 26 and later, `.glassEffect(_:in:)`, `GlassEffectContainer` and `glassEffectID(_:in:)` supersede these for chrome — that is Liquid Glass territory, covered in [./08-liquid-glass.md](./08-liquid-glass.md). Use `Material` for content surfaces and `glassEffect` for floating controls.

**Windows / WinUI (verified against Microsoft Learn).** Use `AcrylicBrush` / `DesktopAcrylicBackdrop` rather than a custom blur. Microsoft's own guidance is explicit and worth importing into web work verbatim: use acrylic only on **transient** surfaces (flyouts, menus, light-dismiss popups); use an opaque background for persistent vertical panes; never place two acrylic panes edge to edge (visible seam); never put accent-coloured text on acrylic, because it will not clear the minimum contrast ratio at the default 14px size. Windows automatically falls back to a solid colour in High Contrast, when Battery Saver is on, when *Transparency effects* is off, and on low-end hardware.

**Android / Jetpack Compose.** There is no Compose-native "backdrop blur" primitive equivalent to `backdrop-filter`. The platform capability is `RenderEffect.createBlurEffect(...)` with `View.setRenderEffect` (API 31+), and `Window.setBackgroundBlurRadius` for blurring behind a window (API 31+, and only when the system reports blurs enabled — it is disabled under battery saver and on many low-tier devices). Material 3 Expressive on Android 16 QPR1 uses this for the notification shade, recents and app drawer. If you need it inside Compose, the pragmatic route in 2026 is the community `Haze` library; treat it as an external dependency and gate it behind a capability check with an opaque fallback.

**React Native.** `backdrop-filter` is not supported. Use `expo-blur`'s `BlurView` (`intensity` 0–100, `tint` light/dark/default) on Expo, or `@react-native-community/blur` on bare RN. Both are real native blur views on iOS and best-effort on Android; always render an opaque `View` fallback when `AccessibilityInfo.isReduceTransparencyEnabled()` returns true.

**Figma.** Layer blur blurs the layer itself; **Background blur** is the `backdrop-filter` equivalent — that is the one you want, and it only works when the fill alpha is below 100%. Build the panel as a component with variants for elevation 0–4 and bind fill/blur to variables so the ladder stays consistent between design and code.

## 6. Interaction & Motion

The rule that governs everything here: **animate colour and transform, not blur radius.** Changing `backdrop-filter: blur()` forces the compositor to re-run the blur shader over a fresh source every frame, which is the single most expensive thing you can do with this style. Changing `background-color` alpha is nearly free.

| State | Treatment | Values |
| --- | --- | --- |
| Rest | Ladder defaults | fill α per elevation, border 0.16–0.30 |
| Hover | Raise fill alpha ~35%, raise border alpha ~50% | `0.10 → 0.14`, border `0.22 → 0.34`; `180ms` `cubic-bezier(0.2,0,0,1)` |
| Active / pressed | Slight depress, no blur change | `transform: translateY(1px) scale(0.985)`; `90ms` |
| Focus-visible | Solid 2px ring **plus** a dark halo | `outline: 2px solid #fff; outline-offset: 2px; box-shadow: 0 0 0 5px rgba(0,0,0,0.55)` — the halo is what makes a white ring survive a white backdrop |
| Selected | Border to accent, fill +1 rung, add 3px left/inset accent bar | `border-color: var(--glass-accent)` |
| Disabled | Drop to elevation 0, remove border highlight, `opacity` on the **content only** | content `opacity: 0.5`; do not put `opacity` on the glass element itself — that makes it a backdrop root and kills the blur |
| Loading | Shimmer inside the scrim, not across the glass | 1.2s linear translate of a `linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent)` |
| Error | Border to `#ff6b81` at 0.55 alpha, fill +1 rung, keep blur | never signal by transparency alone |

Entry and exit for popovers/modals: fade `opacity 0 → 1` **and** `translateY(6px → 0)` plus `scale(0.98 → 1)` over `180ms`, exit over `120ms`. If you want a blur "wake-up", animate it once on mount only — `transition: backdrop-filter 260ms` on entry is acceptable; on hover it is not.

Things that should never animate in this style: the grain layer (it flickers), `backdrop-filter` on scroll, the ground gradient position on scroll (use `background-attachment: fixed` and let the compositor handle it, or better, don't move it), and border-radius.

`prefers-reduced-motion: reduce` handling: collapse all durations to `1ms` rather than removing transitions (avoids state-change flashes), drop the `translateY`/`scale` components entirely, keep the opacity crossfade, stop any shimmer, and switch `background-attachment: fixed` to `scroll` — parallax-feeling grounds are a vestibular trigger and fixed attachment is also a scroll-performance liability on iOS Safari.

## 7. Accessibility

This is the style's weak point and the reason its `a11y_risk` is **high**. Everything below is concrete.

### The criteria it actually violates

- **1.4.3 Contrast (Minimum), AA** — Body text at 4.5:1, large text (≥24px, or ≥18.66px bold) at 3:1. The failure mode is unique to this style: the effective background of the text is *not a known colour*, because it is a composite of the panel fill and whatever the user has scrolled behind it.
- **1.4.11 Non-text Contrast, AA** — The panel's 1px border, focus rings, icon-only buttons and form field boundaries must hit 3:1 against *adjacent* colours. A `rgba(255,255,255,0.22)` hairline over a light backdrop composite is typically around 1.2:1 and fails outright. The border is a visual affordance, not an accessible boundary — if the border is the only thing marking a control, it must be strengthened.
- **1.4.6 Contrast (Enhanced), AAA** — 7:1 body / 4.5:1 large. Effectively unreachable with glass unless you use a text scrim, which is the point.
- **2.4.7 Focus Visible, AA** and **2.4.11 Focus Not Obscured (Minimum), AA (new in WCAG 2.2)** — Sticky glass headers and docks are a classic 2.4.11 failure: a keyboard-focused element scrolls under the translucent bar and is still *partly* visible through it, which does not satisfy the criterion. Add `scroll-margin-top` equal to the header height on every focusable target.
- **1.4.12 Text Spacing, AA** — Glass panels are often sized tightly to their text; at 1.5× line height / 0.12em letter spacing they clip. Use `min-height`, never fixed `height`.
- **2.5.8 Target Size (Minimum), AA (new in WCAG 2.2)** — 24×24 CSS px minimum. Glass chips and pill buttons tend to be styled down to 20px tall because the material looks better small. Pad to 24, or maintain 24px of clear spacing.
- **1.4.10 Reflow** and **1.4.4 Resize Text** — At 200% zoom a full-width glass header eats a large share of the viewport; the blur cost also scales with the painted area.

### Contrast math you should actually run

Take a panel at `rgba(255,255,255,0.12)` with white text. Composite the fill over the backdrop, then compute contrast against the composite — not against the panel colour and not against the raw backdrop.

- Backdrop `#0B0B12` (relative luminance ≈ 0.0035). Composite ≈ `#28282E`, L ≈ 0.0217. White text: **14.6:1**. Comfortable pass.
- Backdrop `#7DD3FC` (a perfectly ordinary sky-blue in a mesh gradient, L ≈ 0.580). Composite ≈ `#8DD8FC`, L ≈ 0.618. White text: **1.57:1**. Catastrophic fail.

Same panel, same text, a 9.3× swing in contrast depending on where the user scrolled. That is the whole problem in two numbers.

Three ways to make it deterministic, in order of preference:

1. **Clamp the ground.** If you control the background and cap its brightest pixel behind body text, the maths closes. With a 12% white fill, white body text clears 4.5:1 as long as the backdrop stays at or below roughly `#646464` (sRGB 100). For the 3:1 large-text/UI threshold, the ceiling is roughly `#868686` (sRGB 134). Enforce this by putting a `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55))` darkening layer between the ground and the glass.
2. **Nest a text scrim.** Wrap the text block in a child with `background: rgba(9,9,14,0.56)`. That number is not arbitrary: to guarantee white text at 4.5:1 against a *worst-case pure white* backdrop, the composited surface luminance must be ≤ 0.183, which for a `rgb(10,10,15)` tint requires **α ≥ 0.558** (the crossing is α = 0.55734; at 0.555 the composite is L = 0.1852 and white text reaches only 4.46:1, which fails). Round to 0.56. Anything below that is a bet on the backdrop.
3. **Raise the panel fill itself** to 0.56+ and accept that it is now a tinted card with a blur, not glass. For dense reading surfaces this is the correct trade.

Automated tools will not catch any of this. Axe, Lighthouse and Figma's contrast plugins compute against the declared `background-color` and cannot see what `backdrop-filter` sampled. You must test manually: screenshot the composited pixels at three scroll positions and sample.

### Focus-visible strategy

A single-colour focus ring cannot work on glass, because the ring's surroundings are unknowable. Use a **two-tone ring**: a 2px white/`Highlight` outline with `outline-offset: 2px`, plus a 5px dark `box-shadow` halo behind it. One of the two will always have contrast. Never rely on `outline: none` plus a background change — background changes on translucent surfaces are frequently invisible.

### Screen reader and DOM order

Glass is purely presentational, so the primary risks are structural rather than semantic:

- Panels are usually positioned with `position: fixed`/`absolute`, so visual order and DOM order drift apart. Fix DOM order; do not fix it with `tabindex` values above 0.
- Stacked glass modals rendered in a portal must use `<dialog>` or an `aria-modal="true"` container with a focus trap and an inert background, otherwise the visible-through-the-glass content underneath remains reachable by screen readers and keyboard.
- The grain `<span>` and the `::before` gradient border must be `aria-hidden` / pseudo-elements and must not receive pointer events.
- Announce state changes through text and ARIA, never through translucency. "Disabled" communicated only by a lower fill alpha is invisible to a screen reader and near-invisible to a low-vision user.

### Forced colors / Windows High Contrast

In `forced-colors: active`, the UA overrides colours but **`backdrop-filter` is not overridden** — a blur left in place will smear the forced-colour backdrop and destroy the whole point of the mode. You must explicitly set `backdrop-filter: none`, `background-color: Canvas`, `color: CanvasText`, `border: 1px solid CanvasText`, `box-shadow: none`. Note also that forced-colors strips shadows entirely, so if a shadow was your only edge affordance you now have none — which is a second reason the 1px border is mandatory. Use `Highlight` for focus rings. Microsoft's Acrylic does exactly this automatically; on the web you do it by hand.

### Reduce transparency / reduce motion

`@media (prefers-reduced-transparency: reduce)` support, stated identically in docs 01, 03, 06, 08 and 10 of this set: Chrome and Edge 118+ (October 2023) ship it; Firefox has it behind the `layout.css.prefers-reduced-transparency.enabled` flag; Safari does not implement it as of August 2026 — even though macOS and iOS are the platforms with the most prominent Reduce Transparency setting. MDN accordingly marks it experimental and not Baseline, so **do not treat the media query as sufficient coverage**. Ship an in-app "Reduce transparency" toggle in your settings that sets `data-transparency="reduced"` on `<html>`, and honour both signals. On native, read `UIAccessibility.isReduceTransparencyEnabled` / SwiftUI's `\.accessibilityReduceTransparency` / `AccessibilityInfo.isReduceTransparencyEnabled()`.

Pair it with `prefers-contrast: more`, which should also produce the opaque variant.

### Pass/fail checklist

- [ ] Body text ≥ 4.5:1 against the **composited** surface at the brightest and darkest scroll positions of the backdrop.
- [ ] Large text and icons ≥ 3:1 under the same worst case.
- [ ] Panel border or an adjacent boundary ≥ 3:1 where the border delimits an interactive control (1.4.11).
- [ ] Focus ring visible on both the lightest and darkest possible backdrop (two-tone ring verified by screenshot).
- [ ] No focusable element is obscured by a sticky glass bar; `scroll-margin-top` set (2.4.11).
- [ ] All interactive targets ≥ 24×24 CSS px (2.5.8).
- [ ] Every interactive control sizes from `--glass-target-min` (44px) — check the chips, pills and icon buttons first, since those are the ones this material tempts you to shrink, and measure the border box rather than the blurred bleed around it.
- [ ] `@supports` fallback renders a fully opaque, readable surface.
- [ ] `prefers-reduced-transparency: reduce` → opacity ≥ 0.95 or fully solid, blur removed, grain removed.
- [ ] `prefers-contrast: more` → solid surface, border at text colour.
- [ ] `forced-colors: active` → `backdrop-filter: none`, system colours, visible border, no shadows.
- [ ] `prefers-reduced-motion: reduce` → no transform/parallax, durations ≤ 1ms, no shimmer, `background-attachment: scroll`.
- [ ] In-app transparency toggle exists (covers Safari's missing media query).
- [ ] No information conveyed by transparency, blur or shadow alone.
- [ ] Text spacing at 1.5 line-height / 0.12em letter-spacing does not clip (1.4.12).
- [ ] Layout at 200% zoom and 320 CSS px width still readable (1.4.10).
- [ ] VoiceOver + NVDA pass with visual order matching DOM order.

## 8. Performance

**What it costs.** `backdrop-filter` promotes the element to its own composited layer and runs a two-pass separable Gaussian blur over the *snapshotted backdrop region* on the GPU, every frame in which the backdrop changes. It skips layout and it skips paint of the element itself, but it does not skip the shader pass. The cost scales with **painted area × blur radius**, not with DOM node count. A 40px blur over a full-width 64px header is far cheaper than a 20px blur over a full-screen modal backdrop.

**Concrete behaviour to plan around:**

- Cost is roughly linear in area and sub-linear but significant in radius. Doubling the blur radius on a large surface is typically more expensive than doubling the number of small blurred elements.
- **Scroll is the killer.** When the backdrop scrolls under a fixed glass bar, the sampled region changes every frame and the blur must be recomputed. This is what pushes compositing off the fast path on mid-tier Android and older iPhones. Firefox's tracker for laggy `backdrop-filter: blur` under many elements (bugzilla 1718471) is the canonical write-up of the failure mode.
- Nested/stacked glass compounds: each layer is a separate shader pass reading the composite below it. Three stacked translucent panes is three full passes.
- `backdrop-filter` on an element inside an ancestor that is itself a backdrop root produces a *wrong* result cheaply, which is worse than an expensive correct one. Watch for `opacity < 1`, `filter`, `mask`, `clip-path`, `mix-blend-mode` and `will-change` on ancestors.
- Microsoft states plainly that acrylic is GPU-intensive enough to shorten battery life, and disables it automatically under Battery Saver and on low-end hardware. Assume the same physics apply on the web; the browser will not disable it for you.

**Budgets to hold yourself to:**

| Budget | Value |
| --- | --- |
| Simultaneously visible glass surfaces | ≤ 3 on mobile, ≤ 5 on desktop |
| Total blurred area in viewport | ≤ 30% of viewport px on mobile, ≤ 50% on desktop |
| Blur radius on any scroll-pinned surface | ≤ 20px |
| Blur radius on a full-viewport overlay | ≤ 24px, and pair with a ≥ 0.45 alpha scrim so you can afford less blur |
| Frame budget on a mid-tier Android (target: Pixel 6a class, 4× CPU throttle in DevTools) | ≥ 55 fps during a 1000px scroll |
| Extra INP attributable to glass hover states | ≤ 8ms |
| Asset weight | 0 KB — the grain is an inline SVG filter, roughly 220 bytes gzipped; never ship a noise PNG for this |

**Cheaper fallbacks, in descending fidelity:**

1. **Blur once, not per frame.** For a hero panel over a static image, pre-blur a copy of the image and position it behind the panel with `clip-path`/`background-position` alignment. Zero per-frame cost.
2. **Drop the blur, keep the tint.** `background: rgba(255,255,255,0.14)` with the 1px border and inner highlight still reads as a light, layered surface. This is the single highest-value degradation and most users will not notice.
3. **Reduce radius, raise alpha.** Perceptually, `blur(10px) + 0.18 alpha` is close to `blur(24px) + 0.10 alpha`, at roughly half the shader cost.
4. **Gate by viewport and input.** Apply glass only at `@media (min-width: 768px)` and/or `@media (hover: hover) and (pointer: fine)`; give touch/small screens the opaque surface.
5. **Gate by device signal.** `navigator.hardwareConcurrency <= 4` or `navigator.deviceMemory <= 4` → set `data-glass="off"` and serve the opaque tokens. Also honour `navigator.connection.saveData`.
6. **`content-visibility: auto`** on off-screen glass sections so they are not composited at all until near the viewport.

Do **not** reach for `will-change: backdrop-filter` or `transform: translateZ(0)` as a blanket fix. `backdrop-filter` already forces a layer; adding `will-change` mostly increases memory and, on ancestors, silently creates a backdrop root that breaks the effect.

## 9. When To Use / When Not To

**Use it for:**

- **Floating, transient chrome** — sticky navbars, docks, command palettes (⌘K), context menus, toasts, media playback controls, HUD overlays. This is Microsoft's Acrylic guidance and it generalises perfectly.
- **Media-forward products** — video players, photo editors, music apps, map overlays. Anything where the user genuinely benefits from seeing what is behind the panel.
- **Spatial and camera-based UI** — visionOS, AR overlays, camera capture UI. Here translucency is functional, not decorative.
- **Marketing and product landing pages** for developer tools, AI products, fintech and crypto — one glass nav plus one glass hero card over a mesh gradient is the current house style, and it reads as "current, well-made" to that audience.
- **Onboarding, lock screens, empty states, pricing tables** — low-density, short-lived, low-stakes surfaces where a bad contrast moment does not cost the user anything.
- **Dashboards where the glass is the *frame*, not the content** — glass sidebar and header over opaque data cards is a good, sustainable pattern.

**Do not use it for:**

- **Long-form reading** — articles, documentation, email bodies, legal text, chat transcripts. Body copy needs a deterministic background.
- **Data tables, spreadsheets, financial figures, dosages, medical records** — anywhere a misread digit has a cost.
- **Form fields and their validation state** — input boundaries must satisfy 1.4.11 against an unknowable backdrop, which you cannot guarantee.
- **Government, healthcare, banking core flows, education, insurance claims, utilities** — regulated or compliance-audited surfaces (Section 508, EN 301 549, EAA which became enforceable in the EU in June 2025). The audit risk is not worth the aesthetic.
- **Audiences skewing older or low-vision** — translucency and low contrast are the two things this group reports most consistently as barriers.
- **Content-heavy pages with user-generated backgrounds** — you lose control of the ground, and the whole contrast argument collapses.
- **Low-end Android and emerging-market products** — assume 4 GB RAM, no reliable GPU headroom, and battery anxiety.
- **Print, email HTML, PDF export** — `backdrop-filter` does not exist in any of these. Your export pipeline must have a solid variant.
- **Anywhere you would need more than three stacked glass layers** to express the hierarchy. If the hierarchy needs that many planes, the hierarchy is the problem.

## 10. Do & Don't

| Do | Don't |
| --- | --- |
| Pair every `backdrop-filter: blur()` with `saturate(140–180%)` so the blurred backdrop keeps its chroma. | Don't ship blur alone — desaturated grey mush reads as a rendering bug, not as glass. |
| Always ship a 1px border at 16–30% alpha (or a masked gradient hairline). | Don't rely on the drop shadow for the edge — `forced-colors: active` strips shadows and the pane loses its boundary entirely. |
| Put body text on a nested scrim at ≥ 0.56 alpha, or clamp the ground so the brightest pixel behind text stays ≤ `#646464`. | Don't place body text directly on a 10–14% fill over an uncontrolled backdrop — contrast can swing from 14.6:1 to 1.6:1 on the same panel. |
| Wrap the translucent styles in `@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` with an opaque default outside it. | Don't declare the low-alpha background unconditionally and hope — a browser without blur renders unreadable text on a see-through box. |
| Ship `-webkit-backdrop-filter` alongside the unprefixed property. | Don't drop the prefix "because Safari 18 unprefixed it" — Safari 15–17 is still a real install base and only understands the prefixed form. |
| Scale blur radius with elevation: 8 / 12 / 20 / 28 / 40px for levels 0–4. | Don't use one blur value everywhere — uniform blur flattens the depth hierarchy the style exists to create. |
| Animate `background-color` alpha, `transform` and `opacity` on interaction. | Don't animate `backdrop-filter` on hover or scroll — it re-runs the blur shader every frame. |
| Keep to ≤ 3 simultaneously visible glass surfaces on mobile and ≤ 30% of viewport area blurred. | Don't stack four translucent panes; each is a separate shader pass reading the composite below it. |
| Add a 2–5% `feTurbulence` grain layer above the fill. | Don't ship a noise PNG for this — it is 20–200 KB for something an inline 220-byte SVG filter does better and resolution-independently. |
| Apply `opacity` to the *content* when disabling a control. | Don't apply `opacity < 1` to the glass element or any of its ancestors — that makes it a backdrop root and silently kills the blur. |
| Handle `prefers-reduced-transparency`, `prefers-contrast: more` and `forced-colors: active` explicitly, and add an in-app toggle. | Don't assume the media query covers you — Safari does not implement `prefers-reduced-transparency`, and it is the platform whose users are most likely to have Reduce Transparency on. |
| Set `scroll-margin-top` equal to the sticky glass header height on focusable elements. | Don't let keyboard focus land half-visible under a translucent bar — that is a WCAG 2.2 SC 2.4.11 failure, not a cosmetic nit. |
| Use the platform material (`Material` / `AcrylicBrush` / `BlurView`) on native. | Don't hand-roll a native blur — you lose vibrancy, Reduce Transparency, High Contrast and battery-saver fallbacks that the platform gives you free. |
| Design the ground first, then the glass. | Don't retrofit glass onto a flat neutral background — with nothing behind it, the blur has nothing to do and the panel just looks washed out. |

## 11. In The Wild (2024-2026)

Verified examples only.

- **Apple — iOS 26 / iPadOS 26 / macOS Tahoe 26 (shipped September 15, 2025).** Liquid Glass as the system-wide material: Control Center, Lock Screen, tab bars, toolbars, sidebars, sheets. The most consequential deployment of the aesthetic ever made, and its evolution rather than plain glassmorphism. In **26.1 (November 3, 2025)** Apple added a **Tinted** appearance that raises opacity system-wide after sustained legibility criticism. Full treatment in [./08-liquid-glass.md](./08-liquid-glass.md).
- **Apple — SwiftUI `Material` (iOS 15+/macOS 12+, still shipping in 2026).** `.ultraThinMaterial` through `.thickMaterial` plus `.bar` are the canonical five-rung glass ladder, and the direct ancestor of the elevation table in §4. Used across iPadOS folder backgrounds, macOS notification stacks and NN/g's cited examples.
- **Apple — visionOS (2024 onward).** Windows are glass over camera passthrough. The only mainstream context where translucency is functionally required rather than decorative.
- **Microsoft — Fluent Design Acrylic, Windows 10/11 and WinUI 3 (docs last updated July 2026).** The most precisely specified glass material in the industry: background → blur → exclusion blend → tint → noise. Applied by default to `MenuFlyout`, `AutoSuggestBox`, `ComboBox` and other light-dismiss popups. Automatically degrades to solid in High Contrast, Battery Saver, when *Transparency effects* is off, on Xbox/HoloLens/tablet mode, and when a window deactivates.
- **Microsoft — Windows 11 Mica (2021 onward).** The instructive counter-example: Microsoft explicitly built an *opaque* wallpaper-tinted material for persistent app chrome specifically because acrylic was too expensive and too illegible for it. Glass for transient, Mica for permanent.
- **Google — Material 3 Expressive, Android 16 QPR1 (2025) and 2026 rollout.** Adds background blur to notification shade, recents and app drawer. Google deliberately positions this as blur-for-hierarchy inside a colour-first opaque system rather than as a glass material — the clearest live example of using the technique without adopting the style.
- **Hype4 Academy — Glassmorphism CSS Generator (2020, still live and maintained in 2026).** The original tool from the person who named the style; blur/transparency/border sliders producing production CSS. Still the most-linked generator.
- **shadcn ecosystem glass libraries (2024-2026).** `shadcn-glass-ui` (npm, ~59 components, TypeScript, drop-in for shadcn/ui), `glasscn-ui` (shadcn components with glassmorphic variants and adjustable blur), and `glasscn` (a shadcn registry of Liquid-Glass-styled components). The existence of three competing registries in the most popular React component ecosystem is the strongest single indicator that the style is mainstream infrastructure in 2026, not a Dribbble trend.
- **`@casoon/tailwindcss-glass`** — a Tailwind CSS v4 plugin packaging glass effects with backdrop-filter support and fallbacks, for teams that want the ladder as utilities rather than hand-rolled CSS.
- **Design-press status, 2026.** IxDF's glassmorphism topic page (updated August 2026) still lists it as an established, selectively used trend. Creative Boom's 2026 "10 trends creatives are so over" list includes glass effects. Both are true simultaneously, and that tension is the accurate picture of the style's 2026 position.

Examples that circulate widely in blog listicles — specific SaaS marketing sites, fintech dashboards, particular launcher and terminal apps — were not independently verifiable during this research and are deliberately omitted.

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui. Styles named without a link (aurora/mesh gradients, Material Design, retro/Y2K, retro terminal) have no file in this set.

**Works well:**

- **[./08-liquid-glass.md](./08-liquid-glass.md) — Liquid Glass.** Not a hybrid, a succession. Liquid Glass is glassmorphism plus displacement, specular tracking and adaptive tint — a superset, not a rebrand; a blur-only implementation is glassmorphism. Everything in this doc is the substrate. Practical rule for 2026: use plain glassmorphism on the web where you need cross-browser predictability and cheap compositing; use Liquid Glass on Apple platforms where the OS renders it for you. Mixing both in one product looks like two design eras colliding — pick one per surface class.
- **Aurora / mesh-gradient backgrounds — no doc in this set.** The single most important partner. Glass requires a vivid, structured ground and mesh gradients supply one you fully control, which is also how you satisfy the contrast clamp in §7. Treat the ground as a hard dependency of this style, not an option; build it yourself from two to four `radial-gradient()` blobs over a base colour, and clamp its brightest pixel per §7.
- **[./09-bento-grid.md](./09-bento-grid.md) — Bento grids.** Glass tiles in a bento layout is the dominant 2024-2026 landing-page composition. It works because bento gives every tile a fixed footprint, which caps total blurred area and keeps you inside the performance budget.
- **[./10-spatial-ui.md](./10-spatial-ui.md) — Spatial UI.** The context that makes the material *necessary* rather than decorative: on a passthrough canvas you have to see the room through the window. Everything in §7 gets harder, because the ground is the user's living room and you cannot clamp it — so the text scrim stops being optional. Keep the glass on the shared stage's z-ladder rather than giving each pane its own perspective.
- **[./01-skeuomorphism.md](./01-skeuomorphism.md) — Skeuomorphism.** Distant ancestor, and glass is the one skeuomorphic material that survived the flat purge, because unlike stitched leather it does real informational work: it tells you there is content behind this pane. Do not add other skeuomorphic materials on top; glass plus wood grain is 2011.
- **Dark mode / neon-accent aesthetics.** Glass is easier on dark grounds: white-tint fills are self-evidently "light passing through," the 1px white border has contrast to spare, and neon accents survive the blur when you keep `saturate()` up.
- **[./05-minimalism.md](./05-minimalism.md) — Minimalism / flat.** A perfectly good pairing when the roles are split: glass for chrome, flat opaque for content. This is exactly Windows 11's Acrylic-plus-Mica split and Android's blur-plus-opaque-surfaces approach. (Doc 05 owns flat and flat 2.0 as aliases; Google Material Design has no doc of its own in this set.)
- **Motion/spring-driven systems.** Glass panels sliding in with a spring feel physical. Just remember §6: animate transform and alpha, never blur radius.

**Clashes:**

- **[./02-neumorphism.md](./02-neumorphism.md) — Neumorphism.** Direct conflict. Neumorphism needs an opaque, mid-tone, monochrome surface so its inner/outer shadows read as extrusion; glass needs translucency and a vivid ground. Put them together and the neumorphic shadows land on a moving backdrop and read as dirt. They also fail accessibility in the same direction, so combining them compounds the risk rather than averaging it.
- **[./07-brutalism.md](./07-brutalism.md) — Brutalism / neubrutalism.** Opposed intent. Brutalism is hard 2–4px black borders, zero radius, flat blocks of colour, hard offset shadows, deliberate crudeness. Glass is softness and depth. There is no coherent middle; you get a design that looks unfinished. The only exception that works is a brutalist page with one glass overlay used as a clearly-foreign floating layer.
- **[./06-maximalism.md](./06-maximalism.md) — Maximalism.** Tempting and usually wrong. Maximalism's whole point is a loud, uncontrolled ground, and §7's entire contrast argument depends on clamping the ground. If you want both, clamp underneath the glass specifically (a `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55))` layer between the collage and the pane) and let the maximalism run everywhere the glass is not.
- **[./04-claymorphism.md](./04-claymorphism.md) — Claymorphism.** Both are soft and rounded, so they superficially seem compatible, but clay is defined by chunky opaque volume and dual inner shadows while glass is defined by thinness and transparency. Side by side they read as inconsistent material physics. If you must, use clay for primary CTAs and glass for containers, never the reverse.
- **High-density / information-dense systems** (data grids, trading terminals, admin tables). Glass is a low-density material. Any style in the set that optimises for information density will fight it.
- **Anything with an uncontrolled ground** — user-uploaded wallpapers, embedded third-party content, unstyled iframes. Glass over content you do not control is a contrast bet you will lose.

**The rule of one:** in a single product, glass should be the treatment for exactly one layer of the z-stack. Chrome or overlays, not both, and never content.

## 13. Plugin Spec (draft)

**Skill name:** `glassmorphism-ui`

**Description (triggering):**
> Use when the user asks to make a UI look like frosted glass, add glassmorphism, apply a backdrop-blur or translucent surface treatment, build a glass navbar/card/modal/command palette, port an Apple- or Fluent-style translucent material to the web, or audit an existing glass UI for contrast, browser fallbacks and blur performance. Also use when the user says "frosted", "blurry panel", "see-through card", "acrylic", or asks to tone glass down for accessibility.

**What the skill does:**

1. Detects the framework and styling layer (plain CSS, CSS Modules, Tailwind v3 vs v4, styled-components, SwiftUI, React Native) and the existing colour system.
2. Emits a five-rung glass elevation ladder (fill alpha, blur radius, border alpha, shadow, radius) as design tokens in the project's native format, plus an opaque `--glass-solid-*` mirror for every rung.
3. Audits the page's background layer. If the ground is flat or neutral, it generates a mesh-gradient or radial-blob ground and a darkening scrim tuned so the brightest pixel behind body text stays under the contrast ceiling computed in §7.
4. Rewrites target components to the ladder: adds `background-color` + `backdrop-filter` + `-webkit-backdrop-filter` + 1px border + inner top highlight + shadow, wrapped in `@supports`, with the opaque declaration outside the block.
5. Injects the shared `feTurbulence` grain filter once and wires the 2–5% overlay layer.
6. Appends the accessibility layer: `prefers-reduced-transparency`, `prefers-contrast: more`, `forced-colors: active`, `prefers-reduced-motion`, plus a `[data-transparency="reduced"]` hook and a settings toggle stub (because Safari lacks the media query).
7. Adds two-tone focus rings to every interactive glass surface and `scroll-margin-top` to focusable elements under sticky glass bars.
8. Scans ancestors of every new glass element for accidental backdrop roots (`opacity < 1`, `filter`, `mask`, `clip-path`, `mix-blend-mode`, `will-change`) and reports or fixes them.
9. Counts simultaneously visible glass surfaces and estimated blurred viewport area, and downgrades rungs automatically if the budget is exceeded.
10. Produces a written audit with the computed worst-case contrast ratios per text token.

**Inputs it needs from the user:**

| Input | Type | Default |
| --- | --- | --- |
| `framework` | `css` \| `tailwind4` \| `tailwind3` \| `react` \| `vue` \| `svelte` \| `swiftui` \| `react-native` | detected |
| `basePalette` | ground colours (2–4 hex) + foreground + accent | derived from existing tokens, else `#6d3bff / #00c2ff / #ff4d9d` on `#0b0b12` |
| `tone` | `light` (white tint, dark ground) \| `dark` (ink tint, light ground) \| `auto` | `auto` |
| `density` | `compact` \| `comfortable` \| `spacious` → padding 12/20/28px, radius 10/16/22px | `comfortable` |
| `intensity` | 0-100 | 50 |
| `scope` | which surfaces to convert: `chrome` \| `overlays` \| `cards` \| `all` | `chrome` |
| `a11yFloor` | `AA` \| `AA-strict` \| `AAA` | `AA` |
| `perfTarget` | `desktop` \| `mobile` \| `low-end` | `mobile` |

**Outputs it produces:**

1. `glass.tokens.css` (or `@theme` block / `tokens.ts` / Swift `enum`) — the full ladder plus opaque mirror plus dark/light overrides.
2. A component set: `GlassSurface`, `GlassNav`, `GlassCard`, `GlassPopover`, `GlassModal`, `GlassButton`, `GlassInput`, each with the `@supports` fallback and a11y layer baked in.
3. `glass.layer.css` — a `@layer glass { … }` containing the ground, grain filter, focus-ring recipe and all four accessibility media blocks, ordered so app styles can override it.
4. `glass-ground.svg` / gradient CSS for the required backdrop.
5. `GLASS-AUDIT.md` — per-token worst-case contrast maths, glass-surface count per route, estimated blurred viewport percentage, fallback coverage matrix, and a list of ancestor backdrop-root hazards found.

**Validation checklist the skill must self-run before reporting done:**

- [ ] Every `backdrop-filter` declaration has a matching `-webkit-backdrop-filter` on the preceding line.
- [ ] Every translucent fill lives inside `@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`, with an opaque declaration outside it.
- [ ] Worst-case composited contrast computed for each text token against both the darkest and brightest ground pixel; body ≥ 4.5:1, large/UI ≥ 3:1 (≥ 7:1 / 4.5:1 if `a11yFloor: AAA`). Fail = raise fill alpha or insert a text scrim, then recompute. Never ship a failing pair.
- [ ] Every glass surface carries a border ≥ 1px, and where it delimits a control the border clears 3:1.
- [ ] Two-tone focus ring present and verified against both extremes of the ground.
- [ ] `prefers-reduced-transparency`, `prefers-contrast: more`, `forced-colors: active` and `prefers-reduced-motion` blocks all present and each removes `backdrop-filter`.
- [ ] `forced-colors` block uses only system colour keywords and removes shadows.
- [ ] No `opacity`, `filter`, `mask`, `clip-path` or `mix-blend-mode` on any ancestor of a glass element.
- [ ] No `transition` or `animation` targets `backdrop-filter`, `filter` or `border-radius`.
- [ ] Glass surface count ≤ 3 (mobile / low-end) or ≤ 5 (desktop) per viewport; blurred area ≤ 30% / 50%.
- [ ] Every interactive target ≥ `--glass-target-min` (44px), and never below the 24×24 CSS px SC 2.5.8 floor.
- [ ] `scroll-margin-top` set on focusable elements under any `position: sticky` glass bar.
- [ ] Grain is an inline SVG filter, not a raster asset.
- [ ] Print stylesheet renders all glass surfaces opaque.

**Intensity knobs (3-5, with ranges):**

| Knob | Min | Max | Default (intensity 50) | Notes |
| --- | --- | --- | --- | --- |
| `fillAlpha` | 0.04 | 0.30 (light tone) / 0.72 (dark tone) | 0.10-0.14 | The primary legibility lever. Above 0.30 it stops being glass. |
| `blurRadius` | 4px | 48px | 12-20px | Hard-capped at 20px on scroll-pinned surfaces and 24px on full-viewport overlays regardless of intensity. |
| `saturation` | 100% | 200% | 160% | Below 130% the material reads grey and dead. |
| `borderAlpha` | 0.10 | 0.45 | 0.16-0.26 | Never allowed to reach 0; the border is structural. |
| `grainOpacity` | 0.00 | 0.06 | 0.035 | Above 0.06 it reads as compression artefacts. |

Intensity 0 must still produce a visible, bordered, opaque-fallback surface — it degrades to a tinted card, never to nothing. Intensity 100 must still pass the `a11yFloor` contrast check; if it cannot, the skill clamps and says so in the audit rather than shipping a failing surface.

**Anti-patterns the skill must refuse to generate:**

1. Body text placed directly on a fill below 0.30 alpha with no scrim and no clamped ground.
2. Any translucent fill without a matching `@supports` opaque fallback.
3. `backdrop-filter` without the `-webkit-` prefixed twin.
4. Glass applied to `<table>`, `<input>`, `<textarea>`, `<select>` or long-form article containers.
5. Four or more stacked/nested translucent layers.
6. `transition: backdrop-filter` or `animation` keyframes that interpolate a blur radius on hover or scroll.
7. `opacity: 0.5` (or any value < 1) applied to a glass element or its ancestors to express a disabled state.
8. A raster noise/grain image asset when the SVG filter will do.
9. Removal or nulling of `outline` on a focusable glass surface without a compliant replacement ring.
10. Any glass treatment left active inside a `forced-colors: active` block.
11. Information conveyed only by transparency level, blur amount or shadow depth.
12. Glass over a background the project does not control (user uploads, third-party iframes, unstyled embeds) without a mandatory opaque scrim between them.
13. `will-change: backdrop-filter` sprayed as a performance "fix".

## 14. References

1. `backdrop-filter` — CSS reference — https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter — MDN Web Docs / Mozilla — accessed 2026-08-08 — **[primary]** (syntax, filter function list, backdrop-root rules, Baseline 2024 status, Chrome 76 / Edge 79 / Firefox 103 / Safari 9-with-prefix)
2. Filter Effects Module Level 2 — `backdrop-filter` — https://drafts.csswg.org/filter-effects-2/#BackdropFilterProperty — W3C / CSS Working Group — Editor's Draft — **[primary]** (the normative definition)
3. backdrop-filter — Web Platform Features Explorer — https://web-platform-dx.github.io/web-features-explorer/features/backdrop-filter/ — W3C WebDX Community Group — accessed 2026-08-08 — **[primary]** (Baseline newly available 2024-09-16; widely available projected 2027-03-16; Safari 18 / Safari iOS 18 released 2024-09-16; Firefox 103 released 2022-07-26; Chrome 76 released 2019-07-30)
4. CSS Backdrop Filter — Can I use — https://caniuse.com/css-backdrop-filter — Alexis Deveria / caniuse.com — accessed 2026-08-08 — **[secondary]** (95.69% global support; per-browser version table)
5. Acrylic material — Windows apps — https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic — Microsoft Learn — updated 2026-07-22 — **[primary]** (the five-layer acrylic recipe: background, blur, exclusion blend, colour/tint, noise; transient-surface guidance; GPU/battery cost; automatic fallback in High Contrast, Battery Saver, low-end hardware, Transparency-effects-off; "no accent-coloured text on acrylic at 14px")
6. Glassmorphism: Definition and Best Practices — https://www.nngroup.com/articles/glassmorphism/ — Megan Brown, Nielsen Norman Group — 2024-06-07 — **[secondary]** (three defining characteristics; contrast and blur guidance; named platform examples)
7. Glassmorphism Meets Accessibility: Can Frosted Glass Be Inclusive? — https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/ — Nicko Syropoulos, Axess Lab — 2025-06-11 — **[secondary]** (4.5:1 / 3:1 thresholds, blur-sensitivity and magnifier concerns, reduced-transparency/motion recommendations, testing methodology)
8. Glassmorphism is my least favorite — https://michalmalewicz.medium.com/glassmorphism-is-my-least-favorite-cf7876925354 — Michal Malewicz — 2020-12-08 — **[primary]** (the person who coined the term, publishing reservations about it within weeks)
9. Glassmorphism CSS Generator — https://hype4.academy/tools/glassmorphism-generator — Hype4 Academy / Michal Malewicz — 2020, still live 2026 — **[primary]** (the original generator)
10. `backdrop-filter: blur()` — Tailwind CSS docs — https://tailwindcss.com/docs/backdrop-filter-blur — Tailwind Labs — accessed 2026-08-08 — **[primary]** (v4 utility scale: xs 4px, sm 8px, md 12px, lg 16px, xl 24px, 2xl 40px, 3xl 64px; `@theme` customisation; arbitrary-value syntax)
11. CSS `prefers-reduced-transparency` — https://developer.chrome.com/blog/css-prefers-reduced-transparency — Chrome for Developers — Chrome 118, October 2023 — **[primary]** (syntax, OS mapping, guidance to raise opacity to 80–95% or remove overlays entirely)
12. `prefers-reduced-transparency` — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency — MDN Web Docs — accessed 2026-08-08 — **[primary]** (feature definition and support notes)
13. `Material` — SwiftUI — https://developer.apple.com/documentation/swiftui/material — Apple Developer Documentation — **[primary]** (`ultraThinMaterial`, `thinMaterial`, `regularMaterial`, `thickMaterial`, `bar`; iOS 15+/macOS 12+)
14. `glassEffect(_:in:)` — SwiftUI — https://developer.apple.com/documentation/swiftui/view/glasseffect(_:in:) — Apple Developer Documentation — iOS 26+ — **[primary]** (the Liquid Glass API that supersedes `Material` for chrome)
15. Apple redesigns its operating systems with 'Liquid Glass' at WWDC 25 — https://techcrunch.com/2025/06/09/apple-redesigns-its-operating-systems-with-liquid-glass/ — TechCrunch — 2025-06-09 — **[secondary]** (announcement date and platform list)
16. iOS 26, macOS Tahoe, and more are coming on September 15 — https://appleinsider.com/articles/25/09/09/ios-26-macos-tahoe-and-more-are-coming-on-september-15 — AppleInsider — 2025-09-09 — **[secondary]** (public release date)
17. Apple Releases macOS Tahoe 26.1 With New Liquid Glass Setting and More — https://www.macrumors.com/2025/11/03/apple-releases-macos-tahoe-26-1/ — MacRumors — 2025-11-03 — **[secondary]** (the Tinted / reduced-transparency option added after backlash)
18. What Is Glassmorphism? — https://ixdf.org/literature/topics/glassmorphism — Interaction Design Foundation — updated 2026-08-08 — **[secondary]** (2026 status framing, timeline, design principles)
19. What is glassmorphism? How to create glassmorphic designs — https://blog.logrocket.com/ux-design/what-is-glassmorphism/ — Eric Chung, updated by Daniel Schwarz, LogRocket — 2025-04-18 — **[secondary]** (property breakdown, when-to-use/avoid guidance)
20. 1718471 — backdrop-filter: blur is laggy when many elements are rendered — https://bugzilla.mozilla.org/show_bug.cgi?id=1718471 — Mozilla Bugzilla — **[primary]** (the canonical record of the multi-element blur performance failure mode)
21. Grainy Gradients — https://css-tricks.com/grainy-gradients/ — CSS-Tricks — **[secondary]** (the `feTurbulence` + `feColorMatrix` noise-overlay technique)
22. SVG Filter Effects: Creating Texture with `<feTurbulence>` — https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/ — Sara Soueidan, Codrops — 2019-02-19 — **[secondary]** (`baseFrequency` / `numOctaves` parameter behaviour)
23. Realistic Frosted Glassmorphism in CSS With Gradient Borders — https://smarative.com/blog/realistic-frosted-glassmorphism-css-gradient-borders — Smarative — **[secondary]** (the `mask-composite: exclude` gradient-hairline technique)
24. shadcn-glass-ui — https://www.npmjs.com/package/shadcn-glass-ui — npm — v2.11.x, 2026 — **[secondary]** (ecosystem evidence: a maintained glassmorphism component registry for shadcn/ui)
25. glasscn-ui — shadcn/ui component library with glassmorphism variants — https://github.com/itsjavi/glasscn-ui — **[secondary]** (ecosystem evidence)
26. `@casoon/tailwindcss-glass` — https://www.npmjs.com/package/@casoon/tailwindcss-glass — npm — **[secondary]** (Tailwind v4 glass plugin with backdrop-filter support and fallbacks)
27. Your Pixel's big Android 16 QPR1 update brings more than just Material 3 Expressive — https://www.androidauthority.com/android-16-qpr1-features-3594123/ — Android Authority — 2025 — **[secondary]** (background blur in notification shade, recents and app drawer)
28. 10 trends that creatives are so over in 2026 — https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/ — Creative Boom — 2026 — **[secondary]** (evidence of the design-press backlash against decorative glass)
