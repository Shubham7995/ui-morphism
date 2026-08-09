---
name: skeuomorphism
title: Skeuomorphism
aliases: [skeuomorphic design, realism UI, rich texture UI, material realism, neo-skeuomorphism, digital materiality, photorealistic UI]
category: ui-morphism
origin_year: 1984
peak_years: 2007-2013
status_2026: revival
difficulty: high
a11y_risk: medium
perf_cost: medium
plugin_slug: skeuomorphism-ui
last_researched: 2026-08-08
---

## 1. Essence

Skeuomorphism is the practice of borrowing the texture, shape, lighting, and behaviour of physical objects so that a digital control announces what it does before you touch it. The feeling it produces is *tactility with authority*: a surface that looks like it was machined, stitched, or moulded reads as a thing you can press rather than a rectangle you must decode. The single defining move is a **consistent, single overhead light source rendered as a four-layer shadow stack** — two outer shadows (contact plus ambient) and two inset shadows (top bevel highlight plus bottom shade) — applied to every raised surface in the interface.

Everything else in the style (gradients, noise, leather, brushed metal, letterpress type) is decoration hung off that lighting model. Get the light wrong and the whole thing collapses into kitsch; get it right and you get affordance for free.

## 2. Origin & Timeline

- **Pre-digital.** The word comes from Greek *skeuos* (vessel, tool) and *morphē* (shape). It described ornament retained from an older manufacturing process — imitation rivets on cast metal, faux wood grain on plastic. Figma's design glossary and LogRocket's UX explainer both anchor the etymology this way.
- **1984 — Apple Macintosh.** The desktop metaphor ships: trash can, folders, calculator, document pages. Figma's resource library credits Steve Jobs with pushing this literal-object approach as the way to make a GUI legible to people who had never used one. NN/g's framing is more precise: early skeuomorphism was a *learning tool*, not a visual trend.
- **1988 — Don Norman, *The Design of Everyday Things*.** Popularised "affordance" as the vocabulary for why a physical-looking control communicates its use, while also warning against slavish imitation of obsolete forms. Skeuomorphism's intellectual defence and its critique arrive in the same book.
- **2000-2001 — Aqua (Mac OS X).** Pinstripes, gel buttons with pulsing specular highlights, drop shadows on windows. The first time an OS shipped a *rendered material* rather than a drawn icon.
- **2006-2009 — Windows Vista Aero and Windows 7.** Microsoft's counterpart: glass chrome, reflections, gradient-filled controls, Flip 3D. Distinct from Apple's leather-and-felt direction but the same underlying claim that surfaces should look like substances.
- **2007-2012 — iOS 1 through iOS 6, the peak.** Notes on yellow legal pad with a torn-paper edge, Voice Memos with a chromed 1950s microphone, Newsstand and iBooks with wooden shelves, Game Center's green felt and Find My Friends' stitched leather. Amazon's Kindle Fire shipped 3D wooden bookshelves. This is the period every retrospective points at.
- **2010-2012 — the counter-swing begins.** Microsoft's Metro language (Windows Phone 7, then Windows 8 in 2012) rejected ornament outright. Internally at Apple, the leather-and-felt maximalism became contested; Scott Forstall left in late 2012 and Jony Ive took over Human Interface.
- **June 2013 — iOS 7 kills it.** Announced at WWDC 2013 and shipped that September, iOS 7 stripped textures and bevels and replaced them with clarity, deference, and depth — thin type, saturated colour, translucent layers. Skeuomorphism went from house style to embarrassment inside one keynote. Figma dates the industry-wide flat turn to 2012-2013; NN/g dates the peak to "the early 2010s".
- **2014 — Google Material Design.** Not a return to skeuomorphism but a rebuttal to pure flatness: a single sheet-of-paper metaphor with elevation, a defined light source, and physics-based motion. Material is the compromise position that most of the industry actually adopted.
- **December 2019 — Neumorphism named.** Michał Malewicz publishes "Neumorphism in user interfaces" (UX Collective, 2 December 2019); Jason Kelley's comment on the draft supplies the word — "new skeuomorphism". Alexander Plyuto's "Skeuomorph Mobile Banking" Dribbble concept popularises the look the same month, and Huawei's Honor Vision (August 2019) had already shipped the treatment on a real product, so the widely repeated "Plyuto invented it" story is wrong on both ends. It is a *sibling* of skeuomorphism, not a revival: it kept the bevels and threw away the material metaphor and the borders, which is exactly why it failed accessibility. See [./02-neumorphism.md](./02-neumorphism.md).
- **2021-2024 — the underground keeps it alive.** Andy Works' (Not Boring) suite — Weather, Calculator, Timer, Habits — wins a 2022 Apple Design Award for 3D, haptics, and playful physicality. Arturia ships V Collection X (December 2023) with photoreal vintage synth panels. Audio plugins never abandoned the style at all.
- **9 June 2025 — Apple announces Liquid Glass at WWDC 2025.** Shipped September 2025 across all six platforms: iOS 26, iPadOS 26, macOS Tahoe 26, watchOS 26, tvOS 26, and visionOS 26. This is material realism, not object mimicry: panels behave as sheets of glass that refract and specular-highlight the content behind them. Apple also shipped **Icon Composer** with Xcode 26 — app icons are now built from a required background layer plus up to four stacked layers, each with its own specularity, translucency/frosting, blur, and neutral-or-chromatic shadow, exported as a single `.icon` file (1024 px grid for iPhone/iPad/Mac, 1088 px circular for Watch). The iOS 26 Camera icon restored the high-resolution lens illustration last seen in iOS 6.
- **June-December 2025 — the legibility backlash.** iOS 26 beta 2 darkened and increased blur on Control Center. In **iOS 26.1** (beta 4 on 20 October 2025; released 3 November 2025) Apple added *Settings → Display & Brightness → Liquid Glass* with **Tinted** and **Clear** options; Tinted raises opacity and contrast on lock-screen notifications, menus, and nav bars, but per MacRumors barely touches Control Center, App Library, icons, or widgets. Accessibility advocacy escalated through the autumn.
- **8-12 June 2026 — WWDC 2026 / iOS 27.** (Apple Newsroom, 23 March 2026: the conference runs Monday 8 June to Friday 12 June, keynote and first developer betas on 8 June.) Per MacRumors (Hartley Charlton, 10 June 2026), Apple replaced the binary toggle with a **transparency slider running from ultra clear to fully tinted**, added a **darkened edge** around Liquid Glass elements plus **brighter specular highlights**, improved how the material diffuses busy content, and made uniform toolbars appear when content scrolls underneath. Icon Composer gained multi-layer construction updates and in-tool OS previews. This is the largest correction to the material since launch — and note the direction of the correction: *more* bevel and edge definition, not less.
- **January 2026 — Euro NCAP.** New protocols penalise vehicles that bury horn, indicators, hazards, wipers, gear selection, door locks, and SOS in a touchscreen; five-star ratings now effectively require physical controls with tactile feedback. Automotive HMI teams responded by making the remaining on-screen controls read as *hardware* — raised, bevelled, high-contrast — which is skeuomorphism deployed for a safety reason rather than a nostalgic one.
- **2026 status — genuinely a revival, but a narrow one, and smaller than the trend press claims.** Every 2026 trend roundup (Figma, Lollypop, Fireart, Behance) lists texture, grain, and material depth as ascendant, and Apple has an OS-scale material language in market. But the hard usage number cuts the other way: Superdesign, analysing 208,000+ real UI generations between January and June 2026, found skeuomorphism **never exceeded 0.1% of generations — 71 projects, 113 prompt mentions total**. That contradicts the "skeuomorphism is back" headline and I am going to trust the count. The honest read for 2026: *material realism* is mainstream at the OS layer and in audio/automotive/creative-tool niches; *object-mimicry skeuomorphism* remains a deliberate, low-frequency stylistic choice.

## 3. Visual DNA

- **Single overhead light source** — every highlight sits at the top edge, every shade at the bottom, on every element on the page, without exception. Mixed light directions are the number-one tell of a fake.
- **Four-layer shadow stack** — contact `0 1px 2px rgba(0,0,0,.25)`, ambient `0 4px 10px rgba(0,0,0,.18)`, inset top bevel `inset 0 1px 0 rgba(255,255,255,.8)`, inset bottom shade `inset 0 -2px 3px rgba(0,0,0,.12)`. One shadow looks flat; four look machined.
- **Three-stop vertical gradient with ~15% luminance spread** — lightest stop at the top, midpoint around 45%, darkest at the bottom. Flat fills read as flat no matter how good the shadows are.
- **Letterpress / emboss type** — dark ink plus `text-shadow: 0 1px 0 rgba(255,255,255,.7)` on light surfaces; inverted (`0 -1px 0 rgba(0,0,0,.5)`) on dark ones. Costs nothing, sells the material instantly.
- **Warm, desaturated material palette** — tans, leather browns, brushed-steel greys, felt greens. Never `#fff` and never `#000`; real materials have a hue. Saturation typically 8-25%, lightness 82-95% for faces.
- **Fine grain, not visible texture** — SVG `feTurbulence` `fractalNoise`, `baseFrequency` 0.9, `numOctaves` 2, layer opacity **0.04-0.06**. Above 0.10 it stops reading as grain and starts reading as dirt. *Three docs in this set use inline-SVG grain with deliberately different parameters, and the difference is the point: skeuomorphism wants a tight, high-frequency machining grain (0.9 / 2 octaves, 0.04-0.06) that disappears at arm's length; [./03-glassmorphism.md](./03-glassmorphism.md) uses a softer 0.8 / 4 at 0.02-0.05 to break up backdrop-blur banding without fogging the glass; [./06-maximalism.md](./06-maximalism.md) uses 0.8 / 3 at 0.04-0.12 because there the grain is a visible print-texture statement, not a surface finish.*
- **Hairline material border** — 1px border one to two steps darker than the darkest gradient stop, so the object has a physical edge rather than a soft fade.
- **Radius that matches the imagined material** — 8-12 px for moulded plastic and metal, 2-4 px for stamped/machined parts, 16-24 px for rubber and soft goods. Radius is a material statement, not a brand token.
- **Specular hotspot on curved surfaces** — knobs, toggles, and pill switches get an elliptical white highlight at roughly 25-35% from the top, `opacity: .35-.55`, blurred 4-8 px. Flat rectangles do not get one.
- **Depressed state travels down and inward** — `translateY(1px)` plus the outer shadows collapsing and the insets deepening to `inset 0 2px 5px rgba(0,0,0,.25)`. The affordance is that the button *moved*.
- **Recessed containers invert the stack** — wells, inputs, and slots get the highlight at the *bottom* and the shade at the top, which is the only permitted exception to the top-light rule and is what makes it legible as a hole rather than a bump.
- **Real-object proportions** — a virtual VU meter, dial, or fader keeps the aspect ratio and travel of its physical referent. Getting the geometry wrong is more damaging than getting the texture wrong.

## 4. Anatomy & Design Tokens

All contrast figures below are computed with the WCAG 2.x relative-luminance formula against the stated adjacent colour.

| Token group | Token | Light value | Dark value | Notes / measured contrast |
|---|---|---|---|---|
| Ground | `--sk-bg` | `#d8cfbe` | `#17140f` | Desk/chassis behind all controls |
| Surface | `--sk-surface-hi` | `#f7f2ea` | `#3a342a` | Top gradient stop |
| Surface | `--sk-surface` | `#e8e0d2` | `#2e2920` | Mid stop, the nominal face colour |
| Surface | `--sk-surface-lo` | `#d9cfbc` | `#23201a` | Bottom stop; ~15% luminance below `-hi` |
| Surface | `--sk-well` | `#cfc4ae` | `#141109` | Recessed/inset container fill |
| Line | `--sk-border` | `#b8a98e` | `#4a4335` | Decorative hairline only (1.76:1 — not a control boundary) |
| Line | `--sk-border-strong` | `#7a6a4e` | `#8a7a5e` | Control boundary. Light: **4.01:1** vs face, **3.40:1** vs ground. Dark: **3.46:1** vs face |
| Ink | `--sk-ink` | `#4a3f2d` | `#ede4d2` | Body text. Light **7.85:1** on face (AAA). Dark **11.4:1** on face |
| Ink | `--sk-ink-muted` | `#6b5c44` | `#c3b79f` | Secondary text; light ≈ 4.9:1 on face |
| Accent | `--sk-accent` | `#5d4a36` | `#c9a24a` | Walnut / brass |
| Accent | `--sk-danger` | `#8f2f21` | `#e0705e` | Recessed red indicator lamp |
| Radius | `--sk-r-sm` / `-md` / `-lg` / `-pill` | `4px` / `10px` / `16px` / `999px` | same | 10 px is the canonical control radius |
| Border width | `--sk-hairline` | `1px` | `1px` | Never scale this; materials have thin edges |
| Shadow L1 | `--sk-shadow-contact` | `0 1px 2px rgba(0,0,0,.25)` | `0 1px 2px rgba(0,0,0,.55)` | Grounding |
| Shadow L2 | `--sk-shadow-ambient` | `0 4px 10px rgba(0,0,0,.18)` | `0 6px 14px rgba(0,0,0,.45)` | Elevation |
| Shadow L3 | `--sk-bevel-top` | `inset 0 1px 0 rgba(255,255,255,.80)` | `inset 0 1px 0 rgba(255,255,255,.14)` | The bevel |
| Shadow L4 | `--sk-bevel-bottom` | `inset 0 -2px 3px rgba(0,0,0,.12)` | `inset 0 -2px 3px rgba(0,0,0,.40)` | Under-lip |
| Elevation 0 | `--sk-elev-0` | inset stack only | inset stack only | Wells, inputs, tracks |
| Elevation 1 | `--sk-elev-1` | L1 + L3 | L1 + L3 | Chips, tags, keys |
| Elevation 2 | `--sk-elev-2` | L1 + L2 + L3 + L4 | same roles | Buttons, cards — the default |
| Elevation 3 | `--sk-elev-3` | `0 2px 3px/.28`, `0 10px 24px/.22` + insets | deepened | Dialogs, floating panels |
| Elevation | `--sk-elev-current` | runtime | runtime | Runtime-only. The elevation stack actually resolved for one element, so a rule that overrides `box-shadow` (e.g. `:focus-visible`) can re-state it. Set by §5's React component to `buildShadow(k, elevation, dark)` — the `--sk-elev-{0..3}` compound selected by the `elevation` prop with every layer's offset, blur and alpha multiplied by `k = intensity/100`. Not set in `:root`; authors using the static tokens reference `--sk-elev-2` directly |
| Motion | `--sk-press-travel` | `1px` | `1px` | Runtime-only. Y displacement of the pressed state. Set by §5's React component to `k >= 0.25 ? 1px : 0px` — travel is suppressed below intensity 25 so a 1 px jump never happens without shadow support (see the `shadowDepth` knob in §13). The vanilla recipe hard-codes the equivalent as a local `--_travel` |
| Texture | `--sk-noise-opacity` | `0.05` | `0.07` | Opacity of the grain layer, and the only tokenised grain parameter. Dark surfaces need slightly more grain to read. Frequency, octaves and tile size are baked into `--sk-noise` — see the note below the table |
| Specular | `--sk-specular` | `rgba(255,255,255,.45)` | `rgba(255,255,255,.28)` | Elliptical hotspot on curved parts |
| Type | family | `ui-sans-serif, -apple-system, "Segoe UI", Inter, system-ui, sans-serif` | same | Use a real slab or grotesk for panel labels |
| Type scale | 12 / 14 / 16 / 18 / 24 / 32 / 44 px | — | — | 1.125-1.33 modular; labels 12 px with `0.06em` tracking, uppercase |
| Line height | 1.15 (display) / 1.5 (body) | — | — | |
| Spacing | 4 / 8 / 12 / 16 / 24 / 32 / 48 px | — | — | Control padding default `14px 28px` |
| Hit target | `--sk-target-min` | `44px` | `44px` | 24 px is the WCAG 2.2 floor (2.5.8); 44 px is the practical target. Consumed as `min-height` by `.sk-button` in §5 and named in §7 |
| Motion | press / hover / release / panel | `90ms` / `140ms` / `220ms` / `260ms` | same | See §6 for easings |

**Grain parameters other than opacity are not tokens.** The grain ships as one inline-SVG data URI (`--sk-noise`), and a data URI is an opaque string — CSS cannot interpolate a custom property inside it — so only the layer's opacity can be a variable. The remaining parameters are baked into the URI and must be edited there, in all three places that carry a copy of it: the `--sk-noise` declaration below, the Tailwind `@utility sk-grain` in §5, and the `NOISE` constant in §5's React component. Those values are `type="fractalNoise"`, **`baseFrequency` 0.9**, **`numOctaves` 2**, `stitchTiles="stitch"`, on a **160 px** tile painted at `background-size: 160px 160px`. 0.9 / 2 is the tight machining grain argued for in §3; changing it changes the *material*, whereas `--sk-noise-opacity` changes only the *intensity*. This is also why §13 splits the two: the `grainOpacity` knob rewrites `--sk-noise-opacity`, while the `material` input's "grain frequency" means emitting a different data URI.

```css
:root {
  color-scheme: light dark;

  /* ---- Ground & surfaces ---- */
  --sk-bg:            #d8cfbe;
  --sk-surface-hi:    #f7f2ea;
  --sk-surface:       #e8e0d2;
  --sk-surface-lo:    #d9cfbc;
  --sk-well:          #cfc4ae;

  /* ---- Lines ---- */
  --sk-hairline:      1px;
  --sk-border:        #b8a98e;
  --sk-border-strong: #7a6a4e;

  /* ---- Ink ---- */
  --sk-ink:           #4a3f2d;
  --sk-ink-muted:     #6b5c44;
  --sk-ink-inverse:   #f7f2ea;
  --sk-accent:        #5d4a36;
  --sk-danger:        #8f2f21;

  /* ---- Radii ---- */
  --sk-r-sm:   4px;
  --sk-r-md:  10px;
  --sk-r-lg:  16px;
  --sk-r-pill: 999px;

  /* ---- Shadow atoms ---- */
  --sk-shadow-contact: 0 1px 2px rgba(0,0,0,.25);
  --sk-shadow-ambient: 0 4px 10px rgba(0,0,0,.18);
  --sk-bevel-top:      inset 0 1px 0 rgba(255,255,255,.80);
  --sk-bevel-bottom:   inset 0 -2px 3px rgba(0,0,0,.12);
  --sk-press-inner:    inset 0 2px 5px rgba(0,0,0,.25);
  --sk-press-inner-2:  inset 0 1px 1px rgba(0,0,0,.20);

  /* ---- Elevation compounds ---- */
  --sk-elev-0: inset 0 2px 4px rgba(0,0,0,.22), inset 0 -1px 0 rgba(255,255,255,.55);
  --sk-elev-1: var(--sk-shadow-contact), var(--sk-bevel-top);
  --sk-elev-2: var(--sk-shadow-contact), var(--sk-shadow-ambient),
               var(--sk-bevel-top), var(--sk-bevel-bottom);
  --sk-elev-3: 0 2px 3px rgba(0,0,0,.28), 0 10px 24px rgba(0,0,0,.22),
               var(--sk-bevel-top), var(--sk-bevel-bottom);

  /* ---- Material gradient ---- */
  --sk-face: linear-gradient(to bottom,
              var(--sk-surface-hi) 0%,
              var(--sk-surface)   45%,
              var(--sk-surface-lo) 100%);

  /* ---- Emboss ---- */
  --sk-emboss:  0 1px 0 rgba(255,255,255,.70);
  --sk-deboss:  0 -1px 0 rgba(0,0,0,.35);

  /* ---- Specular ---- */
  --sk-specular: rgba(255,255,255,.45);

  /* ---- Grain (inline SVG, ~330 bytes, no network request) ---- */
  --sk-noise-opacity: .05;
  --sk-noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");

  /* ---- Type ---- */
  --sk-font: ui-sans-serif, -apple-system, "Segoe UI", Inter, system-ui, sans-serif;
  --sk-fs-100: 12px; --sk-fs-200: 14px; --sk-fs-300: 16px;
  --sk-fs-400: 18px; --sk-fs-500: 24px; --sk-fs-600: 32px; --sk-fs-700: 44px;
  --sk-lh-tight: 1.15; --sk-lh-body: 1.5;
  --sk-label-tracking: .06em;

  /* ---- Space ---- */
  --sk-s-1: 4px; --sk-s-2: 8px; --sk-s-3: 12px;
  --sk-s-4: 16px; --sk-s-5: 24px; --sk-s-6: 32px; --sk-s-7: 48px;
  --sk-target-min: 44px;

  /* ---- Motion ---- */
  --sk-dur-press:   90ms;
  --sk-dur-hover:  140ms;
  --sk-dur-release:220ms;
  --sk-dur-panel:  260ms;
  --sk-ease-press:   cubic-bezier(.2, 0, 0, 1);
  --sk-ease-release: cubic-bezier(.34, 1.4, .64, 1);
  --sk-ease-standard:cubic-bezier(.4, 0, .2, 1);

  /* ---- Focus ---- */
  --sk-focus-ring:   0 0 0 2px var(--sk-bg), 0 0 0 4px #2b6cb0;
  --sk-focus-width:  2px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --sk-bg:            #17140f;
    --sk-surface-hi:    #3a342a;
    --sk-surface:       #2e2920;
    --sk-surface-lo:    #23201a;
    --sk-well:          #141109;
    --sk-border:        #4a4335;
    --sk-border-strong: #8a7a5e;
    --sk-ink:           #ede4d2;
    --sk-ink-muted:     #c3b79f;
    --sk-ink-inverse:   #17140f;
    --sk-accent:        #c9a24a;
    --sk-danger:        #e0705e;

    --sk-shadow-contact: 0 1px 2px rgba(0,0,0,.55);
    --sk-shadow-ambient: 0 6px 14px rgba(0,0,0,.45);
    --sk-bevel-top:      inset 0 1px 0 rgba(255,255,255,.14);
    --sk-bevel-bottom:   inset 0 -2px 3px rgba(0,0,0,.40);
    --sk-press-inner:    inset 0 2px 6px rgba(0,0,0,.60);
    --sk-press-inner-2:  inset 0 1px 1px rgba(0,0,0,.45);
    --sk-elev-0: inset 0 2px 5px rgba(0,0,0,.65), inset 0 -1px 0 rgba(255,255,255,.10);
    --sk-elev-3: 0 2px 4px rgba(0,0,0,.6), 0 12px 28px rgba(0,0,0,.5),
                 var(--sk-bevel-top), var(--sk-bevel-bottom);

    --sk-emboss:  0 1px 0 rgba(255,255,255,.10);
    --sk-deboss:  0 -1px 0 rgba(0,0,0,.60);
    --sk-specular: rgba(255,255,255,.28);
    --sk-noise-opacity: .07;
    --sk-focus-ring: 0 0 0 2px var(--sk-bg), 0 0 0 4px #7cb0ff;
  }
}

:root[data-theme="dark"] {
  --sk-bg:            #17140f;
  --sk-surface-hi:    #3a342a;
  --sk-surface:       #2e2920;
  --sk-surface-lo:    #23201a;
  --sk-well:          #141109;
  --sk-border:        #4a4335;
  --sk-border-strong: #8a7a5e;
  --sk-ink:           #ede4d2;
  --sk-ink-muted:     #c3b79f;
  --sk-ink-inverse:   #17140f;
  --sk-accent:        #c9a24a;
  --sk-danger:        #e0705e;
  --sk-shadow-contact: 0 1px 2px rgba(0,0,0,.55);
  --sk-shadow-ambient: 0 6px 14px rgba(0,0,0,.45);
  --sk-bevel-top:      inset 0 1px 0 rgba(255,255,255,.14);
  --sk-bevel-bottom:   inset 0 -2px 3px rgba(0,0,0,.40);
  --sk-press-inner:    inset 0 2px 6px rgba(0,0,0,.60);
  --sk-press-inner-2:  inset 0 1px 1px rgba(0,0,0,.45);
  --sk-elev-0: inset 0 2px 5px rgba(0,0,0,.65), inset 0 -1px 0 rgba(255,255,255,.10);
  --sk-elev-3: 0 2px 4px rgba(0,0,0,.6), 0 12px 28px rgba(0,0,0,.5),
               var(--sk-bevel-top), var(--sk-bevel-bottom);
  --sk-emboss:  0 1px 0 rgba(255,255,255,.10);
  --sk-deboss:  0 -1px 0 rgba(0,0,0,.60);
  --sk-specular: rgba(255,255,255,.28);
  --sk-noise-opacity: .07;
  --sk-focus-ring: 0 0 0 2px var(--sk-bg), 0 0 0 4px #7cb0ff;
}
```

## 5. Implementation Recipes

### Vanilla CSS

A complete, runnable panel: grained chassis, raised button, recessed well, toggle with specular highlight. Assumes the `:root` block above is loaded.

```css
/* ---------- Chassis ---------- */
.sk-panel {
  position: relative;
  isolation: isolate;
  background-color: var(--sk-bg);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-lg);
  padding: var(--sk-s-5);
  color: var(--sk-ink);
  font-family: var(--sk-font);
  box-shadow: var(--sk-elev-3);
}
/* Grain lives on a pseudo-element so it never re-rasterises with content */
.sk-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-image: var(--sk-noise);
  background-repeat: repeat;
  background-size: 160px 160px;
  opacity: var(--sk-noise-opacity);
  pointer-events: none;
}

/* ---------- Raised button ---------- */
.sk-button {
  --_travel: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sk-s-2);
  min-height: var(--sk-target-min);
  padding: 14px 28px;
  font: 600 var(--sk-fs-300)/1 var(--sk-font);
  color: var(--sk-ink);
  text-shadow: var(--sk-emboss);
  background: var(--sk-face);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-md);
  box-shadow: var(--sk-elev-2);
  cursor: pointer;
  user-select: none;
  transition:
    box-shadow  var(--sk-dur-press) var(--sk-ease-press),
    transform   var(--sk-dur-press) var(--sk-ease-press),
    filter      var(--sk-dur-hover) var(--sk-ease-standard);
}
.sk-button:hover { filter: brightness(1.03); }
.sk-button:active {
  transform: translateY(var(--_travel));
  background: linear-gradient(to bottom, var(--sk-surface-lo) 0%, var(--sk-well) 100%);
  box-shadow: var(--sk-press-inner), var(--sk-press-inner-2);
}
.sk-button[aria-pressed="true"] {
  background: linear-gradient(to bottom, var(--sk-surface-lo) 0%, var(--sk-well) 100%);
  box-shadow: var(--sk-press-inner), var(--sk-press-inner-2);
}
.sk-button:disabled {
  cursor: not-allowed;
  filter: saturate(.25);
  opacity: .55;
  box-shadow: var(--sk-elev-1);
  transform: none;
}
.sk-button:focus-visible {
  outline: var(--sk-focus-width) solid transparent; /* keeps forced-colors happy */
  box-shadow: var(--sk-elev-2), var(--sk-focus-ring);
}

/* ---------- Recessed well / input ---------- */
.sk-well {
  background: linear-gradient(to bottom, var(--sk-well) 0%, var(--sk-surface-lo) 100%);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-md);
  box-shadow: var(--sk-elev-0);
  padding: var(--sk-s-3) var(--sk-s-4);
  color: var(--sk-ink);
  font: var(--sk-fs-300)/var(--sk-lh-body) var(--sk-font);
}
.sk-well:focus-within { box-shadow: var(--sk-elev-0), var(--sk-focus-ring); }

/* ---------- Toggle with specular hotspot ---------- */
.sk-toggle {
  --_w: 64px; --_h: 34px; --_pad: 3px;
  position: relative;
  inline-size: var(--_w);
  block-size: var(--_h);
  min-height: 0;
  padding: 0;
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-pill);
  background: linear-gradient(to bottom, var(--sk-well), var(--sk-surface-lo));
  box-shadow: var(--sk-elev-0);
  cursor: pointer;
}
.sk-toggle::after {
  content: "";
  position: absolute;
  inset-block: var(--_pad);
  inset-inline-start: var(--_pad);
  inline-size: calc(var(--_h) - var(--_pad) * 2 - 2px);
  border-radius: 50%;
  background:
    radial-gradient(ellipse 60% 40% at 50% 28%, var(--sk-specular), transparent 70%),
    var(--sk-face);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  box-shadow: var(--sk-shadow-contact), var(--sk-bevel-top);
  transition: translate var(--sk-dur-release) var(--sk-ease-release);
}
.sk-toggle[aria-checked="true"] {
  background: linear-gradient(to bottom, #4e6b3c, #6d8c52);
}
.sk-toggle[aria-checked="true"]::after {
  translate: calc(var(--_w) - var(--_h)) 0;
}
.sk-toggle:focus-visible { box-shadow: var(--sk-elev-0), var(--sk-focus-ring); }

/* ---------- Labels ---------- */
.sk-label {
  font: 600 var(--sk-fs-100)/1 var(--sk-font);
  letter-spacing: var(--sk-label-tracking);
  text-transform: uppercase;
  color: var(--sk-ink-muted);
  text-shadow: var(--sk-emboss);
}

/* ---------- Accessibility overrides ---------- */
@media (prefers-reduced-motion: reduce) {
  .sk-button, .sk-toggle::after { transition-duration: 1ms; }
  .sk-button:active { transform: none; }
}
@media (prefers-contrast: more) {
  :root { --sk-ink: #2c2418; --sk-border-strong: #4a3f2d; }
  .sk-panel::before { opacity: 0; }
}
@media (forced-colors: active) {
  .sk-button, .sk-well, .sk-toggle {
    border: 2px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
    forced-color-adjust: none;
  }
  .sk-panel::before { display: none; }
  .sk-button:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
  .sk-toggle[aria-checked="true"] { background: Highlight; }
}
```

```html
<div class="sk-panel">
  <p class="sk-label" id="lbl-out">Output</p>
  <div class="sk-well" role="group" aria-labelledby="lbl-out">-6.0 dB</div>
  <button class="sk-button" type="button">Engage</button>
  <button class="sk-toggle" type="button" role="switch"
          aria-checked="false" aria-label="Bypass"
          onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') !== 'true')">
  </button>
</div>
```

### Tailwind CSS v4

Tailwind v4 (v4.0 shipped early 2025, v4.1 April 2025) compiles every `@theme` entry to a real CSS custom property, which suits this style — the shadow stacks stay readable as named tokens. **No plugin is required**; multi-layer `box-shadow`, `inset`, gradients, and SVG data URIs are all expressible with `@theme` plus arbitrary values.

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-sk-bg:            #d8cfbe;
  --color-sk-surface-hi:    #f7f2ea;
  --color-sk-surface:       #e8e0d2;
  --color-sk-surface-lo:    #d9cfbc;
  --color-sk-well:          #cfc4ae;
  --color-sk-border:        #b8a98e;
  --color-sk-border-strong: #7a6a4e;
  --color-sk-ink:           #4a3f2d;
  --color-sk-ink-muted:     #6b5c44;
  --color-sk-accent:        #5d4a36;

  --radius-sk:      10px;
  --radius-sk-lg:   16px;

  --shadow-sk-raised:
    0 1px 2px rgb(0 0 0 / .25),
    0 4px 10px rgb(0 0 0 / .18),
    inset 0 1px 0 rgb(255 255 255 / .80),
    inset 0 -2px 3px rgb(0 0 0 / .12);
  --shadow-sk-pressed:
    inset 0 2px 5px rgb(0 0 0 / .25),
    inset 0 1px 1px rgb(0 0 0 / .20);
  --shadow-sk-well:
    inset 0 2px 4px rgb(0 0 0 / .22),
    inset 0 -1px 0 rgb(255 255 255 / .55);

  --ease-sk-press:   cubic-bezier(.2, 0, 0, 1);
  --ease-sk-release: cubic-bezier(.34, 1.4, .64, 1);
}

/* Utilities Tailwind cannot express ergonomically */
@utility sk-face {
  background-image: linear-gradient(
    to bottom,
    var(--color-sk-surface-hi) 0%,
    var(--color-sk-surface) 45%,
    var(--color-sk-surface-lo) 100%
  );
}
/* One static utility that owns its own pseudo-element. Do not try to pair a
   `content`-bearing @utility with the `before:` variant — Tailwind injects its
   own `content: var(--tw-content)` into `before:`, so the pairing is undefined.
   Declare the ::before inside the utility instead. */
@utility sk-grain {
  position: relative;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: .05;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  }

  @media (prefers-color-scheme: dark) { &::before { opacity: .07; } }
  @media (prefers-contrast: more)     { &::before { opacity: 0; } }
  @media (forced-colors: active)      { &::before { display: none; } }
}

/* `@theme` must sit at the top level of the stylesheet. A `@theme` nested inside
   `@media` is not processed by Tailwind v4, so the whole override silently
   vanishes. Redefine the plain custom properties inside `@layer theme` instead —
   they are the same variables the utilities above already reference. */
@layer theme {
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --color-sk-bg:            #17140f;
      --color-sk-surface-hi:    #3a342a;
      --color-sk-surface:       #2e2920;
      --color-sk-surface-lo:    #23201a;
      --color-sk-well:          #141109;
      --color-sk-border-strong: #8a7a5e;
      --color-sk-ink:           #ede4d2;
      --shadow-sk-raised:
        0 1px 2px rgb(0 0 0 / .55),
        0 6px 14px rgb(0 0 0 / .45),
        inset 0 1px 0 rgb(255 255 255 / .14),
        inset 0 -2px 3px rgb(0 0 0 / .40);
    }
  }

  /* Explicit opt-in, so a toggle beats the media query in both directions. */
  :root[data-theme="dark"] {
    color-scheme: dark;
    --color-sk-bg:            #17140f;
    --color-sk-surface-hi:    #3a342a;
    --color-sk-surface:       #2e2920;
    --color-sk-surface-lo:    #23201a;
    --color-sk-well:          #141109;
    --color-sk-border-strong: #8a7a5e;
    --color-sk-ink:           #ede4d2;
    --shadow-sk-raised:
      0 1px 2px rgb(0 0 0 / .55),
      0 6px 14px rgb(0 0 0 / .45),
      inset 0 1px 0 rgb(255 255 255 / .14),
      inset 0 -2px 3px rgb(0 0 0 / .40);
  }
}
```

```html
<div class="sk-grain rounded-sk-lg border border-sk-border-strong
            bg-sk-bg p-6 text-sk-ink shadow-sk-raised">
  <button type="button"
    class="sk-face inline-flex min-h-11 items-center justify-center rounded-sk
           border border-sk-border-strong px-7 py-3.5 text-base font-semibold
           text-sk-ink shadow-sk-raised
           [text-shadow:0_1px_0_rgb(255_255_255/.7)]
           transition-[box-shadow,transform] duration-90 ease-sk-press
           hover:brightness-[1.03]
           active:translate-y-px active:shadow-sk-pressed
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cb0]
           disabled:cursor-not-allowed disabled:opacity-55 disabled:saturate-25
           motion-reduce:transition-none motion-reduce:active:translate-y-0">
    Engage
  </button>
</div>
```

### React component

TypeScript, no dependencies beyond React. Emits its own scoped stylesheet once, exposes an `intensity` prop (0-100) that scales the whole lighting model, and honours `prefers-reduced-motion` at the CSS layer. It mints no token namespace of its own: every computed value is written inline onto the element as a §4 `--sk-*` custom property, so the scoped sheet reads exactly the names the vanilla recipe reads. The focus ring is spelled out rather than pulled from `--sk-focus-ring` so the component stays standalone without the §4 `:root` block; setting `--sk-bg` inline keeps the ring's inner halo on the material's own ground colour.

```tsx
// SkeuoButton.tsx
import { useId, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";

type Material = "plastic" | "metal" | "rubber" | "wood";
type Elevation = 0 | 1 | 2 | 3;

export interface SkeuoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 0 = flat, 100 = full 2011-era rendering. Default 60. */
  intensity?: number;
  material?: Material;
  elevation?: Elevation;
  /** Renders as a latching switch with aria-pressed. */
  pressed?: boolean;
  grain?: boolean;
  children?: ReactNode;
}

const MATERIAL_RADIUS: Record<Material, number> = {
  metal: 4,
  plastic: 10,
  wood: 8,
  rubber: 18,
};

const MATERIAL_FACE: Record<Material, [string, string, string]> = {
  plastic: ["#f7f2ea", "#e8e0d2", "#d9cfbc"],
  metal:   ["#f2f3f4", "#dcdfe2", "#c2c7cc"],
  rubber:  ["#4b4b4d", "#3a3a3c", "#2b2b2d"],
  wood:    ["#b98b58", "#a3763f", "#8a5f2e"],
};

const MATERIAL_INK: Record<Material, string> = {
  plastic: "#4a3f2d",
  metal:   "#2d3238",
  rubber:  "#f2efe8",
  wood:    "#2f2113",
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function buildShadow(k: number, elevation: Elevation, dark: boolean): string {
  const base = dark ? 1.9 : 1;
  const contact = `0 1px ${(2 * k).toFixed(2)}px rgba(0,0,0,${(0.25 * k * base).toFixed(3)})`;
  const ambient = `0 ${(4 * k).toFixed(1)}px ${(10 * k).toFixed(1)}px rgba(0,0,0,${(0.18 * k * base).toFixed(3)})`;
  const bevel = `inset 0 1px 0 rgba(255,255,255,${((dark ? 0.14 : 0.8) * k).toFixed(3)})`;
  const lip = `inset 0 -2px 3px rgba(0,0,0,${(0.12 * k * base).toFixed(3)})`;
  if (elevation === 0) return `inset 0 ${(2 * k).toFixed(1)}px ${(4 * k).toFixed(1)}px rgba(0,0,0,${(0.22 * k).toFixed(3)})`;
  if (elevation === 1) return [contact, bevel].join(", ");
  if (elevation === 3) return [contact, `0 ${(10 * k).toFixed(1)}px ${(24 * k).toFixed(1)}px rgba(0,0,0,${(0.22 * k * base).toFixed(3)})`, bevel, lip].join(", ");
  return [contact, ambient, bevel, lip].join(", ");
}

const STYLE_ID = "skeuo-button-styles";
const SHEET = `
.skeuo-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  min-height:44px;padding:14px 28px;font:600 16px/1 ui-sans-serif,-apple-system,"Segoe UI",system-ui,sans-serif;
  cursor:pointer;user-select:none;position:relative;isolation:isolate;
  transition:box-shadow 90ms cubic-bezier(.2,0,0,1),transform 90ms cubic-bezier(.2,0,0,1),filter 140ms ease}
.skeuo-btn:hover:not(:disabled){filter:brightness(1.03)}
.skeuo-btn:active:not(:disabled){transform:translateY(var(--sk-press-travel));box-shadow:var(--sk-press-inner),var(--sk-press-inner-2)}
.skeuo-btn[aria-pressed="true"]{box-shadow:var(--sk-press-inner),var(--sk-press-inner-2)}
.skeuo-btn:disabled{cursor:not-allowed;opacity:.55;filter:saturate(.25);transform:none}
.skeuo-btn:focus-visible{outline:2px solid transparent;box-shadow:var(--sk-elev-current),0 0 0 2px var(--sk-bg),0 0 0 4px #2b6cb0}
.skeuo-btn__grain{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;
  background-image:var(--sk-noise);background-size:160px 160px;opacity:var(--sk-noise-opacity);pointer-events:none}
@media (prefers-reduced-motion: reduce){
  .skeuo-btn{transition-duration:1ms}
  .skeuo-btn:active:not(:disabled){transform:none}
}
@media (forced-colors: active){
  .skeuo-btn{border:2px solid ButtonText;background:ButtonFace;color:ButtonText;forced-color-adjust:none}
  .skeuo-btn__grain{display:none}
  .skeuo-btn:focus-visible{outline:3px solid Highlight;outline-offset:2px}
}
`;

function ensureSheet() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = SHEET;
  document.head.appendChild(el);
}

export function SkeuoButton({
  intensity = 60,
  material = "plastic",
  elevation = 2,
  pressed,
  grain = true,
  children,
  style,
  className,
  ...rest
}: SkeuoButtonProps) {
  ensureSheet();
  useId(); // stable across SSR hydration

  const k = clamp(intensity, 0, 100) / 100;
  const dark = material === "rubber";
  const [hi, mid, lo] = MATERIAL_FACE[material];
  const ink = MATERIAL_INK[material];
  const radius = MATERIAL_RADIUS[material];

  const shadow = buildShadow(k, elevation, dark);
  const cssVars: CSSProperties & Record<string, string> = {
    background: `linear-gradient(to bottom, ${hi} 0%, ${mid} 45%, ${lo} 100%)`,
    color: ink,
    border: `1px solid ${dark ? "#141416" : "#7a6a4e"}`,
    borderRadius: `${radius}px`,
    boxShadow: shadow,
    textShadow: dark
      ? `0 -1px 0 rgba(0,0,0,${(0.5 * k).toFixed(2)})`
      : `0 1px 0 rgba(255,255,255,${(0.7 * k).toFixed(2)})`,
    "--sk-elev-current": shadow,
    "--sk-press-inner": `inset 0 ${(2 * k).toFixed(1)}px ${(5 * k).toFixed(1)}px rgba(0,0,0,${(0.25 * k + 0.05).toFixed(3)})`,
    "--sk-press-inner-2": `inset 0 1px 1px rgba(0,0,0,${(0.2 * k).toFixed(3)})`,
    "--sk-press-travel": `${(k >= 0.25 ? 1 : 0)}px`,
    "--sk-bg": dark ? "#17140f" : "#d8cfbe",
    "--sk-noise-opacity": grain ? (0.05 * k).toFixed(3) : "0",
    "--sk-noise": NOISE,
    ...style,
  };

  return (
    <button
      type="button"
      {...rest}
      aria-pressed={pressed}
      className={["skeuo-btn", className].filter(Boolean).join(" ")}
      style={cssVars}
    >
      {grain ? <span className="skeuo-btn__grain" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
```

```tsx
// usage
<SkeuoButton intensity={72} material="metal" onClick={() => {}}>Record</SkeuoButton>
<SkeuoButton intensity={40} material="plastic" pressed elevation={2}>Loop</SkeuoButton>
<SkeuoButton intensity={90} material="rubber" disabled>Arm</SkeuoButton>
```

### Native / other platform — SwiftUI

SwiftUI is the genuinely relevant target: this style originated on Apple platforms, and iOS 26/27's Liquid Glass gives you a system material to layer against. Note that `.glassEffect` is Apple's material, not skeuomorphism — the code below builds the *bevelled hardware* look and then optionally sits it on a glass ground.

```swift
import SwiftUI

struct SkeuoButtonStyle: ButtonStyle {
    /// 0…1. Scales the whole lighting model.
    var intensity: Double = 0.6
    var cornerRadius: CGFloat = 10

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var scheme

    private var faceGradient: LinearGradient {
        let stops: [Color] = scheme == .dark
            ? [Color(red: 0.227, green: 0.204, blue: 0.165),
               Color(red: 0.180, green: 0.161, blue: 0.125),
               Color(red: 0.137, green: 0.125, blue: 0.102)]
            : [Color(red: 0.969, green: 0.949, blue: 0.918),
               Color(red: 0.910, green: 0.878, blue: 0.824),
               Color(red: 0.851, green: 0.812, blue: 0.737)]
        return LinearGradient(
            stops: [.init(color: stops[0], location: 0.0),
                    .init(color: stops[1], location: 0.45),
                    .init(color: stops[2], location: 1.0)],
            startPoint: .top, endPoint: .bottom
        )
    }

    func makeBody(configuration: Configuration) -> some View {
        let k = max(0, min(1, intensity))
        let pressed = configuration.isPressed
        let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)

        return configuration.label
            .font(.system(size: 16, weight: .semibold))
            .foregroundStyle(scheme == .dark
                             ? Color(red: 0.929, green: 0.894, blue: 0.824)
                             : Color(red: 0.290, green: 0.247, blue: 0.176))
            .padding(.vertical, 14)
            .padding(.horizontal, 28)
            .frame(minHeight: 44)
            .background {
                shape.fill(faceGradient)
                // Top bevel highlight
                shape.strokeBorder(
                    LinearGradient(colors: [.white.opacity(0.80 * k), .clear],
                                   startPoint: .top, endPoint: .center),
                    lineWidth: 1
                )
                // Material edge
                shape.strokeBorder(Color(red: 0.478, green: 0.416, blue: 0.306), lineWidth: 1)
            }
            .clipShape(shape)
            // Contact + ambient shadows
            .shadow(color: .black.opacity(pressed ? 0 : 0.25 * k), radius: 1, x: 0, y: 1)
            .shadow(color: .black.opacity(pressed ? 0 : 0.18 * k), radius: 5, x: 0, y: 4)
            // Inner press shade
            .overlay {
                shape
                    .fill(.black.opacity(pressed ? 0.18 * k : 0))
                    .blendMode(.multiply)
            }
            .offset(y: pressed && k >= 0.25 ? 1 : 0)
            .animation(reduceMotion ? nil : .easeOut(duration: 0.09), value: pressed)
            .contentShape(shape)
    }
}

struct SkeuoDemo: View {
    var body: some View {
        VStack(spacing: 20) {
            Button("Engage") {}
                .buttonStyle(SkeuoButtonStyle(intensity: 0.75))
            Button("Bypass") {}
                .buttonStyle(SkeuoButtonStyle(intensity: 0.4, cornerRadius: 18))
        }
        .padding(32)
        .background(Color(red: 0.847, green: 0.812, blue: 0.745))
    }
}
```

**Figma / Icon Composer note.** For iOS 26+ app icons, do not hand-paint bevels. Build foreground / mid-ground / background as separate SVG layers on the 1024 px grid (1088 px circular for Watch), import them into Icon Composer (ships with Xcode 26), and set specularity, translucency/frosting, blur, and neutral-or-chromatic shadow per group. Export the single `.icon` file; the system renders the light response per mode. Hand-baked highlights will fight the system's own.

## 6. Interaction & Motion

The rule that governs everything here: **the material moves, the light does not.** The light source is fixed at the top of the viewport; state changes are expressed by the object travelling toward or away from it.

| State | Treatment | Values |
|---|---|---|
| Rest | Elevation 2 | 4-layer stack, `translateY(0)` |
| Hover | Surface brightens, elevation unchanged | `filter: brightness(1.03)`, 140 ms `cubic-bezier(.4,0,.2,1)`. Do **not** raise the button on hover — pointer hover is not a physical event |
| Active / press | Travel down + invert stack | `translateY(1px)`, outer shadows → 0, `inset 0 2px 5px rgba(0,0,0,.25)` + `inset 0 1px 1px rgba(0,0,0,.20)`, 90 ms `cubic-bezier(.2,0,0,1)` |
| Release | Return with a very small overshoot | 220 ms `cubic-bezier(.34,1.4,.64,1)`. Keep overshoot under 4% — real plastic does not bounce |
| Latched (`aria-pressed="true"`) | Permanently in the pressed stack, plus a lit indicator | Pressed shadows held; indicator lamp gets `box-shadow: 0 0 6px 1px currentColor` |
| Focus-visible | Additive ring, never a replacement for the shadow stack | `box-shadow: <stack>, 0 0 0 2px var(--sk-bg), 0 0 0 4px #2b6cb0` — 2 px offset gap then 2 px ring, ≥ 3:1 against both the button face and the chassis |
| Disabled | Desaturate, drop to elevation 1, no travel | `filter: saturate(.25)`, `opacity: .55`, `--sk-elev-1`, `cursor: not-allowed`, `transform: none` |
| Loading | Recessed well + an indeterminate needle/LED, not a spinner | Well shadows + a 1.1 s linear sweep on `translate` of an inner element; never animate `box-shadow` for this |
| Toggle throw | Knob translates, track colour crossfades | `translate` 220 ms `cubic-bezier(.34,1.4,.64,1)`; track `background` 140 ms linear |

Animate `transform`, `translate`, `opacity`, and `filter`. **Do not animate `box-shadow`** — each frame forces a repaint of the shadow, and stacked shadows make that repaint expensive. When you need a shadow to appear to change smoothly, cross-fade the `opacity` of two absolutely positioned pseudo-elements that each carry a static shadow; that runs on the compositor.

Never animate the grain layer, never animate the gradient stops, and never animate `background-image`.

```css
@media (prefers-reduced-motion: reduce) {
  .sk-button,
  .sk-toggle::after,
  .sk-panel * {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
  /* Keep the *state* legible, drop the travel */
  .sk-button:active { transform: none; }
}
```

Reduced motion must not remove the pressed *appearance* — only the movement. The inset shadow swap is a state indicator required by 1.4.11, so it stays; it just arrives instantly.

## 7. Accessibility

Skeuomorphism is not inherently inaccessible — unlike [neumorphism](./02-neumorphism.md), it uses real borders and real value separation. The risks come from decoration overwhelming information.

### Criteria most at risk

- **1.4.3 Contrast (Minimum), AA 4.5:1.** Embossed text (`text-shadow: 0 1px 0 white`) on a mid-tone material lowers *perceived* contrast even though the computed ratio is unchanged. Measure ink against the **darkest** gradient stop, not the average. With the tokens above: `#4a3f2d` on `#d9cfbc` = **6.67:1**; on the mid stop `#e8e0d2` = **7.85:1**. Both clear AA comfortably, but only the mid stop reaches AAA — the darkest stop lands just under the 7:1 line, and W3C does not round up to meet a threshold. That gap is the whole reason you measure against the darkest stop rather than the average. If you tint the face, re-measure against the darkest stop.
- **1.4.11 Non-text Contrast, AA 3:1.** This is the one that kills bad implementations. Per W3C, UI components need 3:1 against *adjacent colours*, and computed values are not rounded (2.999:1 fails). A bevel highlight is not a boundary. Use `--sk-border-strong: #7a6a4e` — **4.01:1** against the button face and **3.40:1** against the chassis. The decorative `--sk-border: #b8a98e` measures **1.76:1** and must never be the only edge of a control. Toggle states must also differ by 3:1 from each other or carry a non-colour cue.
- **1.4.1 Use of Color.** "The lit lamp means armed" fails if lit/unlit differ only in hue. Add a shape, label, or position change.
- **2.4.7 Focus Visible / 2.4.11 Focus Not Obscured (Minimum) / 2.4.13 Focus Appearance.** The additive-ring pattern in §6 satisfies 2.4.7 and gets you a 2 px-thick, ≥ 3:1 indicator for 2.4.13 (AAA). Because skeuomorphic surfaces overlap and cast shadows, check 2.4.11: a focused control must not be fully hidden behind a raised panel or sticky toolbar.
- **2.5.8 Target Size (Minimum), AA 24×24 px.** Skeuomorphic hardware metaphors tempt you into dense knob banks. 24 px is the floor; `--sk-target-min` (44 px) is the practical target for anything a finger touches, and every control should size from that token rather than a literal — `.sk-button` in §5 takes its `min-height` from it. Spacing exception applies only if the 24 px circles do not overlap.
- **1.4.12 Text Spacing.** Letterpress labels in tight uppercase tracking break when users force line-height 1.5 and letter-spacing 0.12em. Test with the standard text-spacing bookmarklet.
- **1.4.10 Reflow.** Fixed-aspect hardware panels (a 1200 px-wide "mixer") do not reflow to 320 px. Provide a stacked layout below 640 px rather than horizontal scroll.

### Contrast maths worked

Relative luminance for the core tokens (WCAG formula, sRGB):

| Colour | L | Against | Ratio |
|---|---|---|---|
| `#4a3f2d` ink | 0.0520 | `#e8e0d2` face (L 0.7512) | **7.85:1** |
| `#4a3f2d` ink | 0.0520 | `#d9cfbc` darkest stop (L 0.6301) | **6.67:1** |
| `#6b5c44` muted | 0.1120 | `#e8e0d2` face | **4.95:1** |
| `#7a6a4e` strong border | 0.1500 | `#e8e0d2` face | **4.01:1** |
| `#7a6a4e` strong border | 0.1500 | `#d8cfbe` chassis (L 0.6296) | **3.40:1** |
| `#b8a98e` hairline | 0.4052 | `#e8e0d2` face | 1.76:1 — **decorative only** |
| `#ede4d2` dark ink | 0.7820 | `#2e2920` dark face (L 0.0227) | **11.4:1** |
| `#8a7a5e` dark border | 0.2013 | `#2e2920` dark face | **3.46:1** |

### Forced colors / Windows High Contrast

In `forced-colors: active`, the UA forces `box-shadow: none`, `text-shadow: none`, and `background-image: none` (except `url()`-based images). **The entire style disappears** — every bevel, every gradient, every grain layer. If your control's only boundary was a shadow, it becomes an invisible rectangle. The mandatory mitigation is a real `border` using system colour keywords, as in the `@media (forced-colors: active)` block in §5. Use `ButtonFace`/`ButtonText` for controls, `Canvas`/`CanvasText` for surfaces, `Highlight` for selection and focus. Apply `forced-color-adjust: none` only on the control itself, never on text.

Note that `background-image: none` does *not* apply to `url()` backgrounds — which means an SVG data-URI grain layer **survives** forced-colors mode and can wreck legibility. Explicitly `display: none` the grain pseudo-element in that media block.

### Reduced transparency and reduced motion

- `prefers-reduced-motion: reduce` — handled in §6. Required.
- `prefers-reduced-transparency: reduce` — mapped from macOS *Accessibility → Display → Reduce transparency*, iOS *Display & Text Size → Reduce Transparency*, Windows *Personalization → Colors → Transparency effects*. **Support, stated identically in docs 01, 03, 06, 08 and 10 of this set:** Chrome and Edge 118+ ship it; Firefox has it behind the `layout.css.prefers-reduced-transparency.enabled` flag; Safari does not support it as of August 2026. Per MDN it is therefore **not Baseline** and still marked experimental — treat it as progressive enhancement and never make it the only path to a legible UI. If you layer skeuomorphic hardware over a translucent panel, collapse to an opaque fill under this query.
- `prefers-contrast: more` — drop the grain to 0, darken ink and borders, flatten gradient spread to ~6%.

### Screen reader and DOM order

- Grain, bevel, and specular layers must be `aria-hidden="true"` pseudo-elements or spans, never real content.
- A visual "knob" is a `role="slider"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax`/`aria-valuetext`, plus arrow-key handling — rotating a dial by drag alone fails 2.1.1 Keyboard.
- A latching hardware button is `<button aria-pressed>`, a bypass switch is `role="switch" aria-checked`. Do not use `aria-pressed` on links.
- Skeuomorphic layouts often place the "chassis" markup before the content it frames. Keep DOM order equal to reading order; use CSS Grid placement, not absolute positioning, to build panel geometry.
- Textured background images with meaning (a "leather ledger" implying a finance context) carry no accessible name. Put it in text.

### Pass/fail checklist

- [ ] Every interactive control has a border ≥ 3:1 against **both** its own fill and the surface behind it.
- [ ] Body text ≥ 4.5:1 measured against the **darkest** gradient stop it sits on.
- [ ] Focus indicator is additive, ≥ 2 px, ≥ 3:1 against adjacent colours, and never clipped by `overflow: hidden`.
- [ ] All targets ≥ 24×24 px; primary targets ≥ `--sk-target-min` (44×44 px).
- [ ] `forced-colors: active` block present; grain hidden; borders use system colours; verified in Windows High Contrast.
- [ ] `prefers-reduced-motion: reduce` removes travel but preserves the pressed state.
- [ ] `prefers-contrast: more` sets grain opacity 0.
- [ ] No state communicated by texture or hue alone.
- [ ] Decorative layers are `aria-hidden`; no text baked into texture images.
- [ ] Page reflows at 320 px with no two-dimensional scrolling (1.4.10).
- [ ] Text-spacing overrides do not clip embossed labels (1.4.12).
- [ ] Automated axe/Lighthouse pass, then a manual keyboard-only run of the full flow.

## 8. Performance

### Where the cost actually is

Multi-layer `box-shadow`, `linear-gradient`, `text-shadow`, and SVG data-URI backgrounds have been universally supported without prefixes since roughly 2012 and are all **paint-time** work, not layout work. That is good news: nothing here triggers reflow. The problems are (a) paint area, (b) repaint frequency, and (c) asset weight when people reach for photographic textures.

| Technique | Cost class | Budget |
|---|---|---|
| 4-layer `box-shadow` on a 200×48 button | Paint, cheap | Unlimited at rest; ≤ 60 simultaneously animating |
| 3-stop `linear-gradient` | Paint, near-free | Unlimited |
| SVG `feTurbulence` data-URI grain, 160 px tile | One rasterisation, cached | ~330 bytes inline; 1 tile reused everywhere |
| Photographic leather/metal JPEG 1024², q75 | Network + decode + memory | 80-200 KB each — budget **≤ 60 KB total** texture per route |
| `backdrop-filter: blur()` on a skeuo panel | GPU, expensive | Keep radius ≤ 12 px; ≤ 2 backdrop-filtered elements per viewport |
| Animating `box-shadow` | Repaint every frame | **Never** |
| Animating `transform` / `opacity` | Compositor | Preferred; free |
| `filter: brightness()` on hover | GPU, cheap | Fine; promotes a layer, so cap concurrent hovers |

### Concrete guidance

- **Use inline SVG noise, not a PNG.** The `feTurbulence` data URI above is ~330 bytes and rasterises once per unique tile size. A 512×512 PNG noise tile is 40-90 KB and buys nothing visible at 5% opacity. Vendor 2026 trend write-ups make the same point: CSS noise and grain give you material depth without the WebGL/3D processor cost.
- **One grain layer per scroll container, not one per component.** Twenty components each with their own `::before` grain layer means twenty extra paint rectangles. Put the grain on the chassis and let children inherit the visual field.
- **Never animate the shadow stack.** Cross-fade two pseudo-elements carrying static shadows via `opacity`; that stays on the compositor and holds 60 fps on low-end Android where a `box-shadow` transition will not.
- **Cap `will-change`.** Promote only elements that are actually about to animate, and remove the hint afterwards. A page full of `will-change: box-shadow` will exhaust GPU memory on a 4 GB Android device.
- **Blur radii ≤ 20 px, and ≤ 12 px if the element is large.** Large blur-filtered surfaces can drive GPU utilisation to 100%; a full-screen blurred overlay is the classic way to drop a mid-range Android phone to 20 fps.
- **Measurable budgets.** Target: first-paint CSS for the style ≤ 8 KB gzipped (tokens + component layer); total decorative image weight ≤ 60 KB per route; interaction-to-next-paint ≤ 200 ms on a Moto G-class device; no long task > 50 ms attributable to style recalculation on hover.
- **Test on a mid-range Android, not a MacBook.** Chrome DevTools 4× CPU throttle plus a Lighthouse mobile run is the minimum gate.

### Cheaper fallbacks, in order of degradation

1. Drop the grain layer (`--sk-noise-opacity: 0`) — saves one paint rect per container, costs almost nothing visually below 200% zoom.
2. Reduce elevation 2 → elevation 1 (two shadow layers instead of four).
3. Replace the 3-stop gradient with the mid-tone flat fill plus the 1 px top bevel — you keep 70% of the read at 20% of the paint.
4. Replace photographic textures with a tiling 2-colour SVG pattern (stitch, mesh, brushed lines) at ≤ 2 KB.
5. At the floor, you are left with a bordered, slightly gradient-filled button — i.e. flat 2.0 / semi-flat, which is a perfectly respectable place to land. (Flat 2.0 has no doc of its own in this set; it is covered as an alias under [./05-minimalism.md](./05-minimalism.md).)

## 9. When To Use / When Not To

**Use it when**

- The product emulates hardware and users already own the physical referent: audio plugins and DAWs, synths, guitar pedals, camera apps, DJ software, radio/scanner apps, lab instruments.
- Automotive and in-cabin HMI, where Euro NCAP's January 2026 protocols push toward tactile-reading controls and glanceability outranks minimalism.
- Onboarding a low-digital-literacy or first-time audience — NN/g's original argument, and still the strongest one: real-world mimicry lowers the learning curve.
- Kids' and educational software where the metaphor *is* the lesson (a xylophone, an abacus, a clock face).
- Games, casino/arcade, and companion apps where diegetic UI is expected.
- High-consequence controls that must never be mistaken for decoration — arming, publishing, deleting, emergency stop. A control that visibly protrudes is harder to misread than a tinted rectangle.
- Brand moments: a single hero object, a 404, a pricing "machine", a physical-product marketing site. Skeuomorphism at 100% intensity on one element beats 30% everywhere.
- Spatial/XR surfaces, where a control with no material reads as a floating decal.

**Avoid it when**

- Dense, data-heavy enterprise UI — tables, admin consoles, dashboards, analytics. Every bevel is visual noise competing with the data. Use [./05-minimalism.md](./05-minimalism.md) (which covers flat and flat 2.0) or Google Material Design, which has no doc of its own in this set.
- Content-first reading products: news, docs, blogs, long-form. Texture behind body copy costs comprehension and hurts 1.4.3.
- Teams without a dedicated visual designer. This style has a very low tolerance for near-misses: inconsistent light direction or a 3-stop gradient with the wrong spread reads as "cheap" instantly, whereas flat design degrades gracefully.
- Products that must ship 40+ components fast. The token surface here is 4-6× a flat system's.
- Anything with a hard accessibility mandate and no budget for a forced-colors pass — the shadow-stripping behaviour of Windows High Contrast means you *must* write the fallback, not "get to it later".
- Ultra-low-end device targets with heavy scroll: many grain layers plus many shadow stacks is the exact profile that stutters.
- When the physical referent is dead to your audience. A floppy disk, a Rolodex, a cassette — these are decoration for anyone under 30, not affordance.
- As a whole-app default in 2026. The measured usage says accent, not foundation.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Fix one light source at the top and apply it to every element, including recessed ones (which invert the stack). | Mix light directions — a top-lit button next to a bottom-lit card destroys the illusion instantly. |
| Use the full four-layer stack: contact + ambient + inset bevel + inset lip. | Ship a single `0 2px 4px rgba(0,0,0,.2)` and call it skeuomorphic; one shadow reads flat. |
| Give every control a real 1 px border at ≥ 3:1 against both adjacent colours. | Rely on the bevel highlight as the control boundary — it vanishes in forced-colors mode and fails 1.4.11. |
| Keep grain at 0.04-0.06 opacity from an inline SVG `feTurbulence` tile. | Push noise past 0.10 or ship 90 KB photographic texture PNGs; the first reads as dirt, the second as bloat. |
| Use warm, hue-bearing material colours (tans, steels, felts). | Use `#ffffff` and `#000000` — no physical material is pure white or pure black. |
| Animate `transform`, `translate`, `opacity`, `filter`. | Animate `box-shadow`, `background-image`, or gradient stops. |
| Make the press state travel 1 px down *and* invert to inset shadows. | Change only colour on press; the affordance is the movement plus the light inversion. |
| Write the `@media (forced-colors: active)` block in the same commit as the component. | Assume Windows High Contrast will "mostly work" — it forces `box-shadow: none` and erases the entire style. |
| Match radius to the implied material: 4 px machined, 10 px moulded, 18 px rubber. | Apply one global 12 px radius to metal, wood, glass, and rubber alike. |
| Reserve maximum intensity for one or two hero objects per screen. | Render every card, input, chip, and tooltip at full bevel — the hierarchy collapses. |
| Keep the metaphor's geometry honest: a fader travels linearly, a dial rotates, a VU needle sweeps. | Draw a dial and then require a linear drag, or draw a switch that fades instead of throwing. |
| Provide keyboard operation for every hardware metaphor (arrow keys on `role="slider"`). | Ship drag-only knobs; that is a straight 2.1.1 failure. |
| Test contrast against the darkest gradient stop. | Test against the average or the top stop and quietly ship a 3.8:1 label. |

## 11. In The Wild (2024-2026)

Only entries I could verify in this research pass.

- **Apple — Liquid Glass** (announced WWDC 2025, 9 June 2025; shipped September 2025 across all six platforms — iOS 26 / iPadOS 26 / macOS Tahoe 26 / watchOS 26 / tvOS 26 / visionOS 26). Toolbars, sheets, and controls behave as refractive glass sheets over content. It is material realism, not object mimicry — but it is Apple explicitly re-adopting light response, specular highlights, and depth for the first time since iOS 6. Refined again in **iOS 27** (WWDC 2026, 8-12 June 2026; keynote 8 June): darkened edges, brighter specular highlights, better diffusion of busy backgrounds, and a clear-to-tinted transparency slider. On the taxonomy question, this set's settled position: Liquid Glass is glassmorphism plus displacement, specular tracking and adaptive tint — a superset, not a rebrand; a blur-only implementation is glassmorphism. See [./08-liquid-glass.md](./08-liquid-glass.md).
- **Apple — Icon Composer** (Xcode 26, June 2025; updated at WWDC 2026). Turns app-icon production into a layered material pipeline: background layer plus up to four layers, each with specularity, translucency/frosting, blur, and neutral or chromatic shadow, exported as `.icon`. 1024 px grid for iPhone/iPad/Mac, 1088 px circular for Watch.
- **Apple — iOS 26 Camera icon.** Restored the high-resolution lens illustration last used in iOS 6; the Photos icon is built as layered stained glass. Direct, dateable evidence of Apple reversing the 2013 position on illustrative icons.
- **Apple — iOS 26.1 Liquid Glass control** (beta 4 on 20 October 2025; released 3 November 2025). *Settings → Display & Brightness → Liquid Glass* with **Tinted** and **Clear**. Tinted raises opacity and contrast on lock-screen notifications, menus, and nav bars. Notable as a documented case of a material language being walked back for legibility.
- **Andy Works — (Not Boring) Weather / Calculator / Timer / Habits** (2021-present; (Not Boring) Habits won a 2022 Apple Design Award and is profiled in Apple's own *Behind the Design*). 3D objects, haptics, sound, and purchasable cosmetic "skins" that re-material the whole app. The clearest modern proof that physicality can be the product rather than a veneer.
- **Lux — Halide Mark III** (iOS, shipped 2025). Custom typography derived from etched lettering on camera bodies and lenses; a film-window motif borrowed from analog bodies; dial-style gestures that map to photographer muscle memory. Skeuomorphism used as *interaction* design, not just texture.
- **Arturia — V Collection X** (December 2023) **and V Collection 11 Pro** (current line). Photoreal recreations of Minimoog, Wurlitzer EP200, and others, with fully scalable high-resolution panels so the realism survives on 4K displays — historically the hardest technical problem for this style. Arturia's own positioning is that the skeuomorphic panel is what convinces users the emulation is authentic.
- **Teenage Engineering** (hardware and teenage.engineering/designs). Worth naming precisely because it is the *counter-example* often mislabelled as skeuomorphic: TE's software and web surfaces carry depth, texture, and character but explicitly refuse to pretend a screen is an analog control panel. Their modular, constraint-driven system is the reference for "hardware-feeling without hardware-faking".
- **Poolsuite** (poolsuite.net). A full retro desktop metaphor — draggable windows, chrome, era-correct chrome and typography — as an actual, running consumer product rather than a Dribbble shot.
- **Automotive HMI, from January 2026.** Euro NCAP's revised protocols penalise cars that route horn, indicators, hazards, wipers, gear selection, door locks, or SOS through a touchscreen; five stars now effectively require physical controls with tactile feedback. The measurable downstream effect on screen design is bevelled, hardware-reading on-screen controls with high-contrast edges.
- **Figma Community skeuomorphic kits** (multiple, 2024-2026): "Skeuomorphic UI Pack" and "Skeuomorphism UI Kit" among others, plus UI Store Design's free neumorphic/skeuomorphic element set. These are Figma files, not code libraries — as of this research there is **no widely adopted open-source skeuomorphic component library** for React/Vue on the scale of a shadcn or Radix, which is itself a signal about the style's real production footprint.
- **Superdesign usage telemetry** (January-June 2026, 208,000+ generations): skeuomorphism appeared in **71 projects / 113 prompt mentions**, never exceeding **0.1%** of generations. The honest counterweight to every "skeuomorphism is back" headline published in the same window.

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui.

- **[./02-neumorphism.md](./02-neumorphism.md) — closest relative, worst combination.** Neumorphism kept skeuomorphism's bevels and discarded its material metaphor and its borders, which is why typical neumorphic controls land at 1.2:1–1.7:1 against their background and fail 1.4.11 outright. If you want soft extrusion, take skeuomorphism's `--sk-border-strong` with you. Do not run both systems on one screen: two different extrusion languages read as a bug.
- **[./03-glassmorphism.md](./03-glassmorphism.md) — works, and it is the 2026 combination.** A translucent, refractive layer over opaque, bevelled hardware beneath. The rule is *glass above, material below* — a frosted panel floating over a grained chassis. Reverse it (opaque hardware sitting on top of glass) and the depth model breaks. Cap it at two backdrop-filtered layers and blur ≤ 12 px, and provide an opaque fallback under `prefers-reduced-transparency`. Note the taxonomy: Apple's Liquid Glass is *glassmorphism plus displacement, specular tracking and adaptive tint* — a superset, not a rebrand — so the skeuomorphism + glass hybrid described here is the ancestor of Liquid Glass rather than a synonym for it.
- **[./04-claymorphism.md](./04-claymorphism.md) — works with an intensity ceiling.** Clay is skeuomorphism with a single soft material and inflated radii. Use clay for playful containers and skeuomorphic detail for the controls inside them. Both must share one light source; if clay uses diffuse omnidirectional light and skeuo uses a hard top light, they fight.
- **[./05-minimalism.md](./05-minimalism.md) — works as a base layer.** The pragmatic production pattern: minimal/flat everywhere, skeuomorphic on the three controls that matter. This is Flat 2.0 taken to its logical end and it is what most real 2026 products actually ship. Doc 05 owns flat, flat 2.0, semi-flat and Swiss/International Typographic style as aliases; none of them has a separate file in this set.
- **[./06-maximalism.md](./06-maximalism.md) — works, and shares a premise.** Both styles spend pixels on ornament. The rule that keeps the pair coherent is that maximalism supplies the *field* (colour, collage, type scale, grain) and skeuomorphism supplies the *objects* inside it. Keep the four-layer stack and the single light source untouched by the maximalist palette, or the controls stop reading as hardware.
- **[./07-brutalism.md](./07-brutalism.md) — clashes.** Neubrutalism's hard 4 px offset shadow is a deliberate anti-illusion; skeuomorphism's four-layer stack is a pro-illusion. Putting them together produces neither. The only exception is a knowingly retro "OS chrome" pastiche where the sharp offset *is* the period reference — which is also where retro-terminal treatments (phosphor glow, scanlines, CRT curvature) belong. Retro terminal and Y2K have no doc of their own in this set; treat them as skeuomorphism of a specific object and keep bezel grain and screen scanlines at different frequencies so they do not moiré.
- **[./08-liquid-glass.md](./08-liquid-glass.md) — works, and is the vendor version of the glass-above-material rule.** Apple's material is what happens when you give the glass layer displacement and specular tracking while leaving real, bevelled surfaces underneath. Read doc 08 §7 before adopting it: the a11y risk is high and Apple has walked the opacity back twice.
- **[./09-bento-grid.md](./09-bento-grid.md) — works well.** Bento is a layout system, not a surface system. Skeuomorphic cells inside a bento grid is a strong, coherent combination — it is essentially a rack of modules — provided every cell uses the same elevation and light direction.
- **[./10-spatial-ui.md](./10-spatial-ui.md) — works, and is the strongest argument for the style.** On a spatial canvas a control with no material reads as a floating decal, so skeuomorphism's job — announce that this is a thing you can press — matters more, not less. The constraint is that depth must come from the shared stage (one perspective, one z-ladder) rather than from each control inventing its own; keep the four-layer stack for material and let the canvas own parallax.
- **Aurora / mesh gradients — no doc in this set; clashes at the surface, works as a ground.** Large soft-focus colour fields have no light source and no edges, which is the opposite premise. Use aurora as a background behind a grained chassis, never as the fill of a bevelled control.
- **Google Material Design — no doc in this set; works, with a caveat.** Material already has a defined light source and elevation scale, so the shadow model composes cleanly; map Material elevation 1/3/6/8 dp onto `--sk-elev-1/2/3`. The caveat is that Material's single-paper metaphor conflicts with skeuomorphism's *many materials* premise. Pick one: Material's physics with skeuomorphic surfaces, or don't mix.

## 13. Plugin Spec (draft)

**Skill name:** `skeuomorphism-ui`

**Description (triggering):** "Use when the user wants a physical, tactile, hardware-inspired interface — skeuomorphic, realistic, textured, bevelled, embossed, leather/metal/wood/felt materials, audio-plugin or instrument-panel styling, or a 'make this feel like a real object' request — and when converting flat components into raised, light-modelled surfaces with a consistent shadow stack."

### What the skill does

1. Reads the target codebase and detects the framework (React/Next, Vue/Nuxt, Svelte, plain HTML, SwiftUI) and the styling system (vanilla CSS, CSS Modules, Tailwind v4, styled-components).
2. Derives a material palette from the user's existing brand colours by warming them: clamps saturation to 8-25% and lightness to 82-95% for faces, then generates the three gradient stops at a 15% luminance spread and picks the mid stop as the nominal surface.
3. Emits the token layer (`--sk-*`) with a computed dark-mode override, including all four shadow atoms and the three elevation compounds.
4. Rewrites targeted components — button, toggle/switch, input, select, slider, card, panel, tab — to the four-layer stack plus 3-stop gradient plus 1 px strong border plus letterpress type.
5. Inserts a single inline-SVG grain layer on the outermost chassis element (not per component) and wires `--sk-noise-opacity` to the intensity knob.
6. Adds the required media blocks: `prefers-reduced-motion`, `prefers-contrast: more`, `prefers-reduced-transparency`, and `forced-colors: active`.
7. Runs a contrast audit on every generated pair and auto-darkens `--sk-border-strong` and `--sk-ink` until 3:1 / 4.5:1 are satisfied against the darkest adjacent stop, then reports what it changed.
8. Produces a before/after paint-cost estimate: count of shadow layers, count of grain layers, total added CSS bytes, total added image bytes.

### Inputs needed from the user

| Input | Type | Default | Notes |
|---|---|---|---|
| `framework` | enum: react-ts \| react-js \| vue \| svelte \| html \| swiftui | detected | Detection is offered for confirmation, never silent |
| `styling` | enum: css \| css-modules \| tailwind-v4 \| styled-components | detected | Tailwind path emits `@theme` + `@utility` |
| `basePalette` | 1-3 hex values | brand primary | Warmed and desaturated into a material ramp |
| `material` | enum: plastic \| brushed-metal \| wood \| leather \| felt \| rubber \| mixed | plastic | Drives radius, grain frequency, and specular strength |
| `density` | enum: compact \| default \| comfortable | default | Maps to padding 10/14/18 px and min-height 36/44/52 px |
| `intensity` | 0-100 | 60 | See knobs below |
| `scope` | glob list | `src/components/ui/**` | Files the skill may rewrite |
| `darkMode` | enum: media \| class \| both | both | |

### Outputs

- `tokens/skeuomorphism.css` — the `:root` block (light values) plus a dark override duplicated under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]`, so an explicit toggle beats the OS preference in both directions.
- `tokens/skeuomorphism.tailwind.css` — `@theme` + `@utility` variant, when Tailwind is selected. The `@theme` block is always emitted at the top level of the stylesheet; dark and preference overrides are emitted as plain custom-property redeclarations inside `@layer theme`, never as a `@theme` block nested in an at-rule (Tailwind v4 does not process those).
- `components/skeuo/*` — the rewritten or newly generated component set, typed, with `intensity` and `material` props threaded through.
- `styles/skeuo-a11y.css` — the reduced-motion, increased-contrast, reduced-transparency, and forced-colors layer, emitted as a separate cascade layer (`@layer skeuo-a11y`) so it always wins.
- `reports/skeuomorphism-audit.md` — contrast table with computed ratios, list of auto-corrections, paint-cost estimate, asset weight, and any refused requests with reasons.

### Validation checklist the skill self-runs

- [ ] Every generated control pair computes ≥ 3:1 (border vs. fill **and** border vs. surrounding) — unrounded, so 2.999:1 fails.
- [ ] Every text token computes ≥ 4.5:1 against the **darkest** gradient stop it can sit on (≥ 3:1 for ≥ 24 px / ≥ 19 px bold).
- [ ] Focus indicator exists on every focusable element, is additive to the shadow stack, ≥ 2 px, ≥ 3:1 against adjacent colours, and not clipped by an ancestor `overflow: hidden`.
- [ ] All targets ≥ 24×24 px; interactive targets flagged if < 44×44 px.
- [ ] `forced-colors: active` block present, uses system colour keywords, hides every grain/decor pseudo-element, and gives each control a real border.
- [ ] `prefers-reduced-motion: reduce` present and preserves pressed/checked appearance while removing travel.
- [ ] Zero `transition` or `animation` declarations targeting `box-shadow`, `background-image`, or gradient stops.
- [ ] Grain layer count ≤ 1 per scroll container; grain opacity ≤ 0.06 (≤ 0.08 dark).
- [ ] Total added decorative image bytes ≤ 60 KB per route; no raster texture > 40 KB.
- [ ] Added CSS ≤ 8 KB gzipped for tokens + component layer.
- [ ] Dark-mode variant generated and independently contrast-checked.
- [ ] Light direction is identical across every emitted component; recessed elements are the only inversion.
- [ ] A flat fallback path exists (`--sk-intensity: 0` produces a bordered, accessible, unornamented control).

### Intensity knobs

| Knob | Range | At 0 | At 100 | Notes |
|---|---|---|---|---|
| `shadowDepth` | 0-1 multiplier on all four layers | no shadows | contact `0 1px 2px/.25`, ambient `0 4px 10px/.18`, bevel `.80`, lip `.12` | Below 0.25 the press travel is suppressed to avoid a 1 px jitter with no visual support |
| `gradientSpread` | 0-24% luminance between top and bottom stop | flat fill | 24% (only for polished metal) | Default 15%. Above 18% starts looking like a 2009 web button |
| `grainOpacity` | 0-0.08 | none | 0.08 | Default 0.05 light / 0.07 dark. Hard-capped at 0.08; the skill will not emit higher |
| `materialFidelity` | 0-3 (0 = colour only, 1 = + gradient, 2 = + grain, 3 = + specular hotspot & edge highlight) | colour | full | Controls how many decorative layers exist, which is the real perf lever |
| `travel` | 0-2 px press displacement | none | 2 px | Default 1 px. 2 px only for large hardware metaphors ≥ 64 px tall |

### Anti-patterns the skill must refuse to generate

- Controls whose only boundary is a shadow or bevel, with no border meeting 3:1 — refuse, and emit the bordered version instead with a note.
- Neumorphic dual-shadow extrusion (`box-shadow: -Npx -Npx X light, Npx Npx X dark`) on a same-colour background. That is [neumorphism](./02-neumorphism.md), it measures 1.2:1–1.7:1 against its own ground (the range measured in [./02-neumorphism.md](./02-neumorphism.md) §7), and it is out of scope for this skill.
- Any `transition: box-shadow` or `@keyframes` mutating `box-shadow`.
- Grain opacity above 0.08, or more than one grain layer per scroll container.
- Raster textures over 40 KB, or any texture with text baked into it.
- Skeuomorphic treatment applied to body copy backgrounds, table rows, or any element containing more than ~120 characters of running text.
- Drag-only knobs, dials, or faders with no keyboard handler and no `role="slider"` with `aria-valuenow`/`aria-valuetext`.
- Mixed light directions in a single emitted set.
- `forced-color-adjust: none` on text-bearing elements.
- Removal of an existing focus indicator in favour of a "more realistic" pressed look.
- Fixed-width hardware panels that cannot reflow below 640 px.
- Full-app application when the request was for a single component; the skill scopes to `scope` and says so.

## 14. References

1. *Skeuomorphism* — https://www.nngroup.com/articles/skeuomorphism/ — Megan Chan, Nielsen Norman Group — 15 March 2024. [primary]
2. *Skeuomorphism: Definition, CSS Recipe, 2026 Revival and Examples* — https://superdesign.dev/styles/skeuomorphism — Superdesign — 2026 (includes January-June 2026 telemetry across 208,000+ generations). [secondary]
3. *What is skeuomorphism?* — https://www.figma.com/resource-library/what-is-skeuomorphism/ — Figma Resource Library — accessed 8 August 2026. [secondary]
4. *Skeuomorphism in UX: Definition, examples, and relevance today* — https://blog.logrocket.com/ux-design/skeuomorphism-ux-design-examples/ — Angela Fabunan, LogRocket Blog — 14 July 2026. [secondary]
5. *Understanding SC 1.4.11: Non-text Contrast (Level AA)* — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — W3C Web Accessibility Initiative, WCAG 2.2 — current. [primary]
6. *forced-colors — CSS media feature* — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors — MDN Web Docs, Mozilla — current. [primary]
7. *prefers-reduced-transparency — CSS media feature* — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency — MDN Web Docs, Mozilla — current (marked experimental, not Baseline). [primary]
8. *Here's How Liquid Glass Is Changing in iOS 27* — https://www.macrumors.com/2026/06/10/how-liquid-glass-is-changing-in-ios-27/ — Hartley Charlton, MacRumors — 10 June 2026. [secondary]
9. *Here's How the iOS 26.1 Transparency Toggle Changes Liquid Glass* — https://www.macrumors.com/2025/10/20/ios-26-1-transparency-option-liquid-glass/ — Juli Clover, MacRumors — 20 October 2025. [secondary]
10. *Crafting Liquid Glass app icons with Icon Composer* — https://www.createwithswift.com/crafting-liquid-glass-app-icons-with-icon-composer/ — Create with Swift — 12 June 2025. [secondary, documents primary Apple tooling]
11. *WWDC 2025: iOS 26, new Liquid Glass design and everything else Apple announced* — https://www.engadget.com/big-tech/wwdc-2025-ios-26-new-liquid-glass-design-and-everything-else-apple-announced-171718769.html — Engadget — 9 June 2025. [secondary]
12. *Behind the Design: (Not Boring) Habits* — https://developer.apple.com/news/?id=9ab1g4r3 — Apple Developer News — 2022. [primary]
13. *Halide Mark III* — https://www.lux.camera/halide-mark-iii/ — Lux Optics — 2025. [primary]
14. *Everything you need to know about Arturia's V Collection X* — https://musictech.com/features/everything-you-need-to-know-arturia-v-collection-x/ — MusicTech — December 2023. [secondary]
15. *Cars will need buttons not just touchscreens to get a 5-star Euro NCAP safety rating* — https://etsc.eu/cars-will-need-buttons-not-just-touchscreens-to-get-a-5-star-euro-ncap-safety-rating/ — European Transport Safety Council — 2025 (protocols effective January 2026). [primary]
16. *Flat Design: Its Origins, Its Problems, and Why Flat 2.0 Is Better for Users* — https://www.nngroup.com/articles/flat-design/ — Nielsen Norman Group. [primary]
17. *Tailwind CSS v4.0* — https://tailwindcss.com/blog/tailwindcss-v4 — Tailwind Labs — 2025 (v4.0 release; v4.1 April 2025). [primary]
18. *Flat Design is Dead: The Rise of "Neo-Skeuomorphism" in 2026* — https://www.userology.co/blogs/neo-skeuomorphism-ui-trends-2026-spatial — Shrey Khokhra, Userology — 21 February 2026. [secondary; qualitative claims only, no published metrics]
19. *Top Web Design Trends for 2026* — https://www.figma.com/resource-library/web-design-trends/ — Figma — 2026. [secondary]
20. *Apple's new Liquid Glass design puts the spotlight on skeuomorphism for the first time since iOS 6* — https://www.techradar.com/phones/iphone/apples-new-liquid-glass-design-puts-the-spotlight-on-skeuomorphism-for-the-first-time-since-ios-6-and-im-all-for-it — TechRadar — 2025. [secondary]
