---
name: claymorphism
title: Claymorphism
aliases: [clay morphism, clay UI, claymorphic design, soft 3D UI, puffy UI, inflated UI, play-doh UI, clay design, fluffy 3D]
category: ui-morphism
origin_year: 2021
peak_years: 2021-2023
status_2026: niche
difficulty: medium
a11y_risk: medium
perf_cost: medium
plugin_slug: claymorphism-ui
last_researched: 2026-08-08
---

## 1. Essence

Claymorphism makes interface elements look like they were pressed out of soft modelling clay: fat corner radii, a saturated pastel fill, and a puffed-up dome of light and shade baked into the surface itself. The single defining move is a three-layer `box-shadow` — one bright inset highlight at the top, one darker inset shade at the bottom, and one very large soft outer drop shadow, hue-matched to the surface — which reads as an inflated object floating a few centimetres above the page. It feels friendly, toy-like, safe to touch, and slightly childish; that last quality is the whole reason it works in some products and destroys credibility in others.

The distinction from [neumorphism](./02-neumorphism.md) is structural, not decorative. Neumorphism extrudes an element *out of* a background it shares a colour with. Claymorphism gives the element its own colour and *floats it above* the background, which is exactly what restores the contrast neumorphism lost.

## 2. Origin & Timeline

- **2019-2020 — the prerequisite failure.** Michał Malewicz popularises neumorphism (soft UI). Within a year the community consensus is that it is unusable: same-colour surfaces plus low-contrast dual shadows produce interfaces where nothing looks pressable and text routinely fails WCAG 1.4.3. Claymorphism exists as a direct response to that failure.
- **2020-2021 — the 3D illustration pipeline arrives.** Blender 2.8+ with Eevee, Cinema 4D + Redshift, and the browser-native Spline editor make chunky, matte, subsurface-scattered "clay" renders cheap to produce. Artists such as Amrit Pal Singh (Face Pots) and Sam Briskar (Avatarz) push inflated 3D characters into mainstream product marketing; Icons8 ships clay-render icon sets. Malewicz's own framing is that UI had to catch up with the artwork already sitting next to it.
- **December 2021 — the term is coined.** Michał Malewicz publishes *Claymorphism in User Interfaces* on hype4.academy, defining it as what you get "if you simply inflated your neumorphic shapes": corner roundness "usually beyond 50%", two inner shadows (light top-left, dark bottom-right), and one large outer shadow that is allowed to move on the X axis as well as Y — deliberately breaking the flat-design convention of Y-only shadows. He names Pitch's "fluffy 3D" key visuals as an early in-product sighting.
- **January 2022 — first real library.** Adrian Bece publishes `clay.css` (github.com/codeAdrian/clay.css, repo created 8 Jan 2022, MIT). It is a single `.clay` utility class plus a SCSS mixin, driven by five custom properties. Its defaults are the closest thing the style has to a reference implementation: `border-radius: 32px`, outset `8px 8px 16px 0 rgba(0,0,0,.25)`, inset `-8px -8px 16px 0 rgba(0,0,0,.25)`, inset `8px 8px 16px 0 rgba(255,255,255,.2)`. It peaks at ~573 GitHub stars; last commit 23 Nov 2022.
- **16 March 2022 — mainstream editorial validation.** Adrian Bece's *Claymorphism: Will It Stick Around?* runs on Smashing Magazine. It publishes the canonical three-shadow snippet, and — critically — identifies the property that makes clay viable where neumorphism was not: a clay element may carry its own background colour independent of its container, so hierarchy and brand colour survive. Bece hedges the longevity question and ties clay's fate to the parallel rise of soft-3D and VR aesthetics (Meta Horizon Worlds is cited).
- **29 April 2022 — the Figma craft recipe.** Thalion (Przemysław Baraniak) publishes a step-by-step tutorial at uxmisfit.com with the numbers designers actually used: drop shadow blur 8-24px with a raised Y, first inner shadow Y 4-8px / blur 16-32px, second inner shadow Y 4-8px / blur 8-16px at 20-30% opacity, plus a tight -2px/-2px/4px light reflection at 50-80% opacity. Consistent top or top-left light is treated as non-negotiable. Figma's corner-smoothing (squircle) control becomes part of the standard workflow.
- **August-October 2022 — tooling saturation.** `tailwindcss-claymorphism` (dulltackle) ships to npm on 3 Aug 2022 and reaches 0.11.1 on 29 Oct 2022, generating `clay-sm-*` / `clay-md-*` utilities across the Tailwind palette; peer dependency `tailwindcss ^3.1.6`. Multiple free CSS generators appear (hype4.academy, jackyef.com, CSSnippets). The npm package has had **no release since October 2022** — it never gained Tailwind v4 support, which is a fair proxy for when the hype crested.
- **2023 — the plateau.** Clay stops being a general-purpose skin and becomes a genre marker. It concentrates in kids' apps, gamified education, habit trackers, and 3D landing pages. Neubrutalism absorbs the "we want personality" demand for products that need to look confident rather than cuddly.
- **2024 — consolidation and criticism.** LogRocket's overview (Angela Fabunan, 22 May 2024) frames clay explicitly as neumorphism's accessibility remediation rather than a new idea, and warns that soft gradients plus pastel fills still erode boundaries and contrast. Design-system teams keep the *interaction* pattern (chunky radii, tactile press) while dropping the *inset shadow stack*.
- **19 August 2025 — engineering refinement.** Daniel Fuller (Unorthodox CSS) publishes a five-layer clay recipe that adds a 1px rim light and a second tight drop shadow, and documents two things most tutorials miss: CSS shadows paint in declaration order with the first on top, and rotating a clay element requires counter-rotating its shadow to keep global illumination consistent. Text cannot take inset shadows at all, so raised type has to be faked with two opposing `text-shadow` offsets.
- **2025-2026 — packaged as a theme, not a movement.** Claymorphism survives mainly as a *preset*. tweakcn ships a `claymorphism` theme for shadcn/ui (`radius: 1.25rem`, Plus Jakarta Sans, `oklch(0.9232 0.0026 48.7171)` background, violet `oklch(0.5854 0.2041 277.1173)` primary, soft `2px 2px 10px 4px` shadow ramp — all verified against `tweakcn.com/r/themes/claymorphism.json`, reference 6) and shadcn.io redistributes it with imprecise figures (see reference 13). Community registries continue to appear: `1st-pouf` (a "puffy, pastel React UI kit" shadcn-style registry) was created 26 July 2026.
- **2026 status — niche, mildly resurging from a tiny base, not dominant.** Superdesign's telemetry across 208,000+ generations reports claymorphism moving from **0.03% of generations in January 2026 to 0.08% in May 2026** — a doubling, but of a rounding error, concentrated in children's products, edtech, and illustration-heavy landing pages. Setproduct (25 June 2026) reaches the same conclusion from the practitioner side: no longer trending, still viable for onboarding, kids' apps, friendly fintech, and Spline/Blender-driven 3D landing pages. **Correcting a common prior:** clay did *not* die with neumorphism, and it did *not* become a default like flat design. It became a deliberate personality choice with a measurable but small share, and the icon/illustration half of the trend (clay-rendered 3D icon packs) is considerably healthier than the CSS-surface half.

## 3. Visual DNA

- **Oversized corner radius** — 24-40px on cards, 16-20px on buttons, 999px on chips and pills. Malewicz's original guidance is roundness "beyond 50%" of the shorter side for hero shapes. Anything under 16px on an interactive element stops reading as clay.
- **The three-shadow stack** — exactly one outer drop shadow plus two insets, in this order: light inset (top), dark inset (bottom), outer drop. The insets are what create volume; the drop shadow is what creates float.
- **Hue-matched shadows** — the drop shadow is tinted with the surface hue at ~30-40% alpha, never neutral grey. `rgba(0,0,0,.25)` is the 2022 default and the fastest way to make clay look cheap; `hsl(258 60% 45% / .30)` under a lavender surface is the modern correction.
- **Independent surface colour** — unlike neumorphism, the element does not inherit the page background. This is the load-bearing difference and the reason clay can pass contrast checks at all.
- **Pastel-to-candy palette** — surfaces at roughly 70-90% lightness and 20-60% saturation: lavender, sky, mint, butter, coral. Page background is tinted off-white (`#F4F1FB`-ish), never pure `#FFFFFF`.
- **Single consistent light source** — top or top-left, applied identically to every element on the page. The light inset always sits on the lit edge, the dark inset always opposite. One inconsistent element breaks the whole illusion.
- **Squircle geometry** — Figma corner smoothing at 60-100%, or CSS `border-radius` with superellipse-ish proportions. Real clay does not have a circular arc at the corner.
- **Thick, generous padding** — 20-32px inside cards, 16-24px horizontal on buttons. Clay volume needs air; tight padding makes the insets collide with the text.
- **Rounded, high-x-height typography** — Nunito, Quicksand, Fredoka, Outfit, Baloo 2, Plus Jakarta Sans, at weight 500-700. Sharp grotesks (Inter, Helvetica Neue) visually fight the puffed geometry.
- **Optional 1px rim light** — `inset 0 1px 1px hsl(0 0% 100% / .35)` along the top edge, simulating a specular line where the clay catches the key light. Cheap and disproportionately convincing.
- **Floating layout, generous gaps** — 20-32px grid gaps so drop shadows do not overlap. Overlapping clay shadows look like mud.
- **Pressed-in active state** — depth collapses on press: `transform: scale(0.97)` plus halved shadow offsets. Static clay reads as decoration; squishy clay reads as a control.
- **Companion 3D artwork** — clay-rendered icons and characters (Blender Eevee/Cycles, Spline, Nomad Sculpt) sitting beside the CSS surfaces. In 2025-2026 this is often the *only* part of the trend a product adopts.

## 4. Anatomy & Design Tokens

| Token group | Token | Value | Notes |
|---|---|---|---|
| Background | `--clay-bg` | `#F4F1FB` | Tinted off-white; never `#FFF` |
| Background | `--clay-bg-alt` | `#EDE7FF` | Section banding |
| Surface | `--clay-surface` | `#FFFFFF` | Neutral clay card |
| Surface | `--clay-lavender` | `#C7B9FF` | 8.87:1 with `--clay-ink` |
| Surface | `--clay-sky` | `#9FD8F5` | 10.22:1 with `--clay-ink` |
| Surface | `--clay-mint` | `#8FE3B8` | 10.40:1 with `--clay-ink` |
| Surface | `--clay-butter` | `#FFD9A0` | 11.77:1 with `--clay-ink` |
| Surface | `--clay-coral` | `#FFB3A7` | 9.20:1 with `--clay-ink` |
| Action | `--clay-primary` | `#5B3AE0` | 6.72:1 with white |
| Action | `--clay-danger` | `#C7442C` | 4.89:1 with white |
| Text | `--clay-ink` | `#241F3A` | 14.13:1 on `--clay-bg` |
| Text | `--clay-ink-muted` | `#4A4363` | 8.28:1 on `--clay-bg` |
| Border | `--clay-border` | `0 solid transparent` | Border shorthand. Clay uses shadow, not stroke, so the width is zero — but routing it through a token means one place to switch it on |
| Border | `--clay-border-hc` | `2px solid ButtonText` | Forced-colors fallback only. Declared once and consumed by **both** `@media (forced-colors: active)` blocks in §5, so the value is not written out twice |
| Radius | `--clay-r-chip` | `999px` | Pills, tags, avatars |
| Radius | `--clay-r-btn` | `20px` | Buttons, inputs |
| Radius | `--clay-r-card` | `32px` | Cards, panels |
| Radius | `--clay-r-modal` | `40px` | Sheets, dialogs |
| Shadow (sheen) | `--clay-sheen` | `inset 0 10px 18px -6px hsl(0 0% 100% / .62)` | Top highlight |
| Shadow (shade) | `--clay-shade` | `inset 0 -10px 18px -6px hsl(258 45% 30% / .32)` | Bottom shade |
| Shadow (rim) | `--clay-rim` | `inset 0 1px 1px 0 hsl(0 0% 100% / .35)` | Specular edge |
| Shadow (drop) | `--clay-drop-1` | `0 8px 16px -6px hsl(258 60% 45% / .28)` | Elevation 1 — chips |
| Shadow (drop) | `--clay-drop-2` | `0 14px 26px -8px hsl(258 60% 45% / .30)` | Elevation 2 — buttons |
| Shadow (drop) | `--clay-drop-3` | `0 24px 44px -12px hsl(258 60% 45% / .32)` | Elevation 3 — cards |
| Shadow (drop) | `--clay-drop-4` | `0 38px 68px -16px hsl(258 60% 45% / .35)` | Elevation 4 — modals |
| Blur ceiling | `--clay-blur-max` | `68px` | Hard perf budget per layer (§8). `--clay-drop-4` is drawn at exactly this ceiling, so lowering the budget lowers the modal shadow with it |
| Backdrop blur | `--clay-backdrop` | `blur(0)` | Clay is opaque, so the default is a no-op. Apply as `backdrop-filter: var(--clay-backdrop)` and raise it only on the glass hybrid in §12; `prefers-reduced-transparency` drops it to `none` |
| Saturation | surface chroma | `0.05-0.14` oklch | Pastel band |
| Type scale | `--clay-fs-xs … 3xl` | `13 / 15 / 17 / 20 / 25 / 31 / 39 px` | 1.25 ratio |
| Type | `--clay-font` | `"Nunito", "Plus Jakarta Sans", ui-rounded, system-ui, sans-serif` | Rounded sans |
| Type | weights | `500 / 600 / 700` | Never 300-400 for UI labels |
| Type | line-height | `1.55` body, `1.18` display | |
| Spacing | base unit | `4px`; scale `8 / 12 / 16 / 20 / 24 / 32 / 40 / 56` | |
| Spacing | grid gap | `24px` min | Prevents shadow collision |
| Motion | `--clay-dur-press` | `90ms` | Depth collapse |
| Motion | `--clay-dur-release` | `260ms` | Spring back |
| Motion | `--clay-dur-hover` | `180ms` | Lift |
| Motion | `--clay-ease-out` | `cubic-bezier(.2,.8,.2,1)` | |
| Motion | `--clay-ease-squish` | `cubic-bezier(.34,1.56,.64,1)` | Overshoot on release |
| Target | `--clay-target-min` | `48px` | Not the 24px SC 2.5.8 floor: §7 already prescribes 48x48 for clay, which also clears 2.5.5 Target Size (Enhanced, AAA). Two style-specific reasons it needs the headroom — a `--clay-r-chip` pill rounds the corners off its own box, so the reliably hittable area is smaller than the border box; and the press state shrinks the element with `scale(.97)` (down to `.93` at high squish), taking the hit box with it. 48px absorbs both and still reads as clay. |

**Corner smoothing is not a token.** The squircle geometry in §3 is a Figma corner-smoothing setting — `0.6`, i.e. 60% — and it has no cross-browser CSS equivalent to bind to: `border-radius` draws a circular arc, and there is no interoperable superellipse control for a custom property to feed. It is therefore deliberately absent from the table above and from the CSS block below, because a token nothing can consume is worse than no token at all. Carry the 0.6 in the Figma library and the design spec instead; §5's Figma note is where the build step lives.

```css
:root {
  color-scheme: light dark;

  /* --- ground --- */
  --clay-bg:            #F4F1FB;
  --clay-bg-alt:        #EDE7FF;
  --clay-surface:       #FFFFFF;

  /* --- clay surfaces --- */
  --clay-lavender:      #C7B9FF;
  --clay-sky:           #9FD8F5;
  --clay-mint:          #8FE3B8;
  --clay-butter:        #FFD9A0;
  --clay-coral:         #FFB3A7;

  /* --- actions & text --- */
  --clay-primary:       #5B3AE0;
  --clay-primary-ink:   #FFFFFF;
  --clay-danger:        #C7442C;
  --clay-danger-ink:    #FFFFFF;
  --clay-ink:           #241F3A;
  --clay-ink-muted:     #4A4363;
  --clay-ink-on-clay:   #241F3A;

  /* --- shadow hue: keep in sync with the dominant surface --- */
  --clay-shadow-h:      258;
  --clay-shadow-s:      60%;
  --clay-shadow-l:      45%;

  /* --- radii --- */
  --clay-r-chip:        999px;
  --clay-r-btn:         20px;
  --clay-r-input:       18px;
  --clay-r-card:        32px;
  --clay-r-modal:       40px;

  /* --- borders ---
     Clay's edge is the shadow, so the stroke is zero-width. It is still a token
     because forced-colors has to put a real border back, and that value is
     needed in two separate blocks in §5 — declaring it once is what stops the
     `2px solid ButtonText` literal from being written out twice. */
  --clay-border:        0 solid transparent;
  --clay-border-hc:     2px solid ButtonText;

  /* --- blur ceiling & backdrop ---
     --clay-blur-max is the per-layer perf budget argued in §8, and --clay-drop-4
     is drawn at exactly that ceiling, so the budget is the value rather than a
     comment about it. --clay-backdrop stays at blur(0) because clay is opaque;
     apply it as `backdrop-filter: var(--clay-backdrop)` and raise it only on the
     glass-hybrid overlays described in §12. */
  --clay-blur-max:      68px;
  --clay-backdrop:      blur(0);

  /* --- shadow atoms --- */
  --clay-rim:    inset 0 1px 1px 0 hsl(0 0% 100% / .35);
  --clay-sheen:  inset 0 10px 18px -6px hsl(0 0% 100% / .62);
  --clay-shade:  inset 0 -10px 18px -6px hsl(var(--clay-shadow-h) 45% 30% / .32);
  --clay-drop-1: 0 8px  16px -6px  hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .28);
  --clay-drop-2: 0 14px 26px -8px  hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .30);
  --clay-drop-3: 0 24px 44px -12px hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .32);
  --clay-drop-4: 0 38px var(--clay-blur-max) -16px hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .35);

  /* --- composed elevations (paint order: first layer on top) --- */
  --clay-1: var(--clay-rim), var(--clay-sheen), var(--clay-shade), var(--clay-drop-1);
  --clay-2: var(--clay-rim), var(--clay-sheen), var(--clay-shade), var(--clay-drop-2);
  --clay-3: var(--clay-rim), var(--clay-sheen), var(--clay-shade), var(--clay-drop-3);
  --clay-4: var(--clay-rim), var(--clay-sheen), var(--clay-shade), var(--clay-drop-4);
  --clay-pressed:
    inset 0 6px 12px -4px hsl(var(--clay-shadow-h) 45% 25% / .38),
    inset 0 -3px 8px -4px hsl(0 0% 100% / .30),
    0 4px 8px -4px hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .24);

  /* --- typography --- */
  --clay-font: "Nunito", "Plus Jakarta Sans", ui-rounded, system-ui, sans-serif;
  --clay-fs-xs:  0.8125rem;  /* 13px */
  --clay-fs-sm:  0.9375rem;  /* 15px */
  --clay-fs-md:  1.0625rem;  /* 17px */
  --clay-fs-lg:  1.25rem;    /* 20px */
  --clay-fs-xl:  1.5625rem;  /* 25px */
  --clay-fs-2xl: 1.9375rem;  /* 31px */
  --clay-fs-3xl: 2.4375rem;  /* 39px */
  --clay-lh-body: 1.55;
  --clay-lh-display: 1.18;

  /* --- spacing --- */
  --clay-sp-1: 4px;  --clay-sp-2: 8px;  --clay-sp-3: 12px; --clay-sp-4: 16px;
  --clay-sp-5: 20px; --clay-sp-6: 24px; --clay-sp-8: 32px; --clay-sp-10: 40px;
  --clay-sp-14: 56px;
  --clay-gap: 24px;

  /* --- motion --- */
  --clay-dur-press:   90ms;
  --clay-dur-release: 260ms;
  --clay-dur-hover:   180ms;
  --clay-ease-out:    cubic-bezier(.2, .8, .2, 1);
  --clay-ease-squish: cubic-bezier(.34, 1.56, .64, 1);

  /* --- focus --- */
  --clay-focus-color: #5B3AE0;
  --clay-focus-width: 3px;
  --clay-focus-offset: 3px;

  /* --- hit targets --- */
  --clay-target-min:  48px;   /* SC 2.5.8 floor is 24px; 48 also clears 2.5.5
                                 AAA and survives the press scale(.97) */
}

/* Light values live on bare `:root` above. The dark set is written twice —
   once guarded so it cannot beat an explicit `data-theme="light"`, once under
   `:root[data-theme="dark"]` so a manual toggle beats the OS preference. Both
   lists must stay identical; that is the whole point of the pattern, and it is
   the same shape used in docs 01, 02, 05, 06, 07, 08, 09 and 10.
   `@custom-media` or a Sass mixin is the sane way to avoid the duplication in
   a real codebase; it is spelled out here so the rule is legible. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --clay-bg:          #221D2E;
    --clay-bg-alt:      #2A2438;
    --clay-surface:     #2F2942;

    /* Dark clay is desaturated and darkened, not just alpha-reduced. */
    --clay-lavender:    #4A3E7A;
    --clay-sky:         #2C5670;
    --clay-mint:        #2A5B45;
    --clay-butter:      #5C4726;
    --clay-coral:       #6A3730;

    --clay-primary:     #A78BFA;
    --clay-primary-ink: #221D2E;   /* 6.01:1 */
    --clay-danger:      #F09182;
    --clay-danger-ink:  #221D2E;
    --clay-ink:         #F2EFFA;   /* 14.42:1 on --clay-bg */
    --clay-ink-muted:   #B9B2CC;
    --clay-ink-on-clay: #F2EFFA;   /* 8.18:1 on dark lavender */

    /* The sheen must drop hard or dark clay looks chalky. */
    --clay-rim:    inset 0 1px 1px 0 hsl(0 0% 100% / .10);
    --clay-sheen:  inset 0 10px 18px -6px hsl(258 40% 80% / .14);
    --clay-shade:  inset 0 -10px 18px -6px hsl(258 60% 6% / .55);

    --clay-shadow-h: 258;
    --clay-shadow-s: 45%;
    --clay-shadow-l: 8%;
    --clay-drop-1: 0 8px  16px -6px  hsl(258 45% 4% / .55);
    --clay-drop-2: 0 14px 26px -8px  hsl(258 45% 4% / .58);
    --clay-drop-3: 0 24px 44px -12px hsl(258 45% 4% / .62);
    --clay-drop-4: 0 38px var(--clay-blur-max) -16px hsl(258 45% 4% / .68);

    --clay-focus-color: #C7B9FF;
  }
}

/* Explicit opt-in override, so a toggle beats the media query both ways.
   This block redefines the full token list, not just `color-scheme`. */
:root[data-theme="dark"] {
  color-scheme: dark;

  --clay-bg:          #221D2E;
  --clay-bg-alt:      #2A2438;
  --clay-surface:     #2F2942;

  --clay-lavender:    #4A3E7A;
  --clay-sky:         #2C5670;
  --clay-mint:        #2A5B45;
  --clay-butter:      #5C4726;
  --clay-coral:       #6A3730;

  --clay-primary:     #A78BFA;
  --clay-primary-ink: #221D2E;   /* 6.01:1 */
  --clay-danger:      #F09182;
  --clay-danger-ink:  #221D2E;
  --clay-ink:         #F2EFFA;   /* 14.42:1 on --clay-bg */
  --clay-ink-muted:   #B9B2CC;
  --clay-ink-on-clay: #F2EFFA;   /* 8.18:1 on dark lavender */

  --clay-rim:    inset 0 1px 1px 0 hsl(0 0% 100% / .10);
  --clay-sheen:  inset 0 10px 18px -6px hsl(258 40% 80% / .14);
  --clay-shade:  inset 0 -10px 18px -6px hsl(258 60% 6% / .55);

  --clay-shadow-h: 258;
  --clay-shadow-s: 45%;
  --clay-shadow-l: 8%;
  --clay-drop-1: 0 8px  16px -6px  hsl(258 45% 4% / .55);
  --clay-drop-2: 0 14px 26px -8px  hsl(258 45% 4% / .58);
  --clay-drop-3: 0 24px 44px -12px hsl(258 45% 4% / .62);
  --clay-drop-4: 0 38px var(--clay-blur-max) -16px hsl(258 45% 4% / .68);

  --clay-focus-color: #C7B9FF;
}

:root[data-theme="light"] { color-scheme: light; }
```

## 5. Implementation Recipes

### Vanilla CSS

```css
/* clay.css — depends on the :root token block above */

.clay {
  background: var(--clay-surface);
  color: var(--clay-ink-on-clay);
  border: var(--clay-border);
  border-radius: var(--clay-r-card);
  box-shadow: var(--clay-3);
  padding: var(--clay-sp-8);
  font-family: var(--clay-font);
  font-size: var(--clay-fs-md);
  line-height: var(--clay-lh-body);
}

.clay--lavender { background: var(--clay-lavender); --clay-shadow-h: 258; }
.clay--sky      { background: var(--clay-sky);      --clay-shadow-h: 202; }
.clay--mint     { background: var(--clay-mint);     --clay-shadow-h: 152; }
.clay--butter   { background: var(--clay-butter);   --clay-shadow-h: 36;  }
.clay--coral    { background: var(--clay-coral);    --clay-shadow-h: 8;   }

/* Elevation classes are 1-4 complete. `.clay--3` matters even though `.clay`
   already defaults to `--clay-3`: without it you cannot reset an element that
   inherited `.clay--1` back to the default rung. */
.clay--1 { box-shadow: var(--clay-1); }
.clay--2 { box-shadow: var(--clay-2); }
.clay--3 { box-shadow: var(--clay-3); }
/* The token is `--clay-r-modal`. Reading the misspelled `--clay-modal` here,
   with a `40px` fallback, looked right because the fallback matched — which is
   exactly why the bug survived: theming `--clay-r-modal` had no effect on
   modals, and nothing rendered wrong until someone changed the token. */
.clay--4 { box-shadow: var(--clay-4); border-radius: var(--clay-r-modal); }

/* ---------- Button ---------- */
.clay-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--clay-sp-2);
  min-height: 48px;                    /* WCAG 2.2 2.5.8 target size */
  min-width: 48px;
  padding: var(--clay-sp-3) var(--clay-sp-6);
  border: var(--clay-border);
  border-radius: var(--clay-r-btn);
  background: var(--clay-primary);
  color: var(--clay-primary-ink);
  font: 700 var(--clay-fs-md)/1.2 var(--clay-font);
  cursor: pointer;
  box-shadow: var(--clay-2);
  transform: translateY(0) scale(1);
  transition:
    transform  var(--clay-dur-release) var(--clay-ease-squish),
    box-shadow var(--clay-dur-hover)   var(--clay-ease-out),
    filter     var(--clay-dur-hover)   var(--clay-ease-out);
}

.clay-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--clay-3);
  filter: brightness(1.04);
}

.clay-btn:active {
  transform: translateY(1px) scale(.97);
  box-shadow: var(--clay-pressed);
  transition-duration: var(--clay-dur-press);
  transition-timing-function: var(--clay-ease-out);
}

.clay-btn:focus-visible {
  outline: var(--clay-focus-width) solid var(--clay-focus-color);
  outline-offset: var(--clay-focus-offset);
}

.clay-btn[disabled],
.clay-btn[aria-disabled="true"] {
  cursor: not-allowed;
  filter: grayscale(.55);
  opacity: .62;
  box-shadow: var(--clay-1);
  transform: none;
}

.clay-btn[data-loading="true"] {
  pointer-events: none;
  color: transparent;
  position: relative;
}
.clay-btn[data-loading="true"]::after {
  content: "";
  position: absolute;
  inset: 50% auto auto 50%;
  width: 18px; height: 18px;
  margin: -9px 0 0 -9px;
  border: 3px solid currentColor;
  border-top-color: var(--clay-primary-ink);
  border-radius: 999px;
  animation: clay-spin 720ms linear infinite;
}
@keyframes clay-spin { to { transform: rotate(360deg); } }

/* ---------- Input ---------- */
.clay-input {
  width: 100%;
  min-height: 48px;
  padding: var(--clay-sp-3) var(--clay-sp-5);
  border: var(--clay-border);
  border-radius: var(--clay-r-input);
  background: var(--clay-surface);
  color: var(--clay-ink);
  font: 500 var(--clay-fs-md)/1.4 var(--clay-font);
  /* Inputs invert the light: recessed, not inflated. */
  box-shadow:
    inset 0 6px 12px -6px hsl(var(--clay-shadow-h) 45% 30% / .34),
    inset 0 -4px 8px -6px hsl(0 0% 100% / .55);
}
.clay-input::placeholder { color: var(--clay-ink-muted); opacity: 1; }
.clay-input:focus-visible {
  outline: var(--clay-focus-width) solid var(--clay-focus-color);
  outline-offset: var(--clay-focus-offset);
}

/* ---------- Forced colors ----------
   Note the deliberate divergence from siblings 01, 02 and 03, which all write
   `forced-color-adjust: none` in this block: clay does NOT opt out of the
   forced palette. §7 argues that clay's whole boundary story is fill-vs-fill,
   so once the UA has substituted system colours the correct behaviour is to
   let them win and rebuild the boundary with a real 2px border. There is
   therefore no `forced-color-adjust` declaration here at all — `auto` is the
   initial value, so declaring it would be dead code.

   The border comes from `--clay-border-hc`, not from a literal. The Tailwind
   mirror below needs the identical value, and two hand-written copies of
   `2px solid ButtonText` is exactly how they drift apart. */
@media (forced-colors: active) {
  .clay, .clay-btn, .clay-input {
    box-shadow: none;
    border: var(--clay-border-hc);
    background: ButtonFace;
    color: ButtonText;
  }
  .clay-btn:focus-visible,
  .clay-input:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .clay-btn { transition-duration: 1ms; }
  .clay-btn:hover  { transform: none; }
  .clay-btn:active { transform: none; }
  .clay-btn[data-loading="true"]::after { animation-duration: 1600ms; }
}

/* ---------- Reduced transparency (clay is opaque, so only the sheen softens) ---------- */
@media (prefers-reduced-transparency: reduce) {
  :root {
    --clay-sheen: inset 0 6px 10px -6px hsl(0 0% 100% / .35);
    /* No-op unless you hybridised with glass; if you did, this is where the
       backdrop blur comes off. See §7. */
    --clay-backdrop: none;
  }
}
```

### Tailwind CSS v4

Tailwind v4 needs no plugin for this — `@theme` generates `shadow-*` and `rounded-*` utilities from custom properties directly. The old `tailwindcss-claymorphism` npm plugin (v0.11.1, published 29 Oct 2022) peers on `tailwindcss ^3.1.6` and has not been updated for v4; do not reach for it.

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-clay-bg:       #F4F1FB;
  --color-clay-surface:  #FFFFFF;
  --color-clay-lavender: #C7B9FF;
  --color-clay-sky:      #9FD8F5;
  --color-clay-mint:     #8FE3B8;
  --color-clay-butter:   #FFD9A0;
  --color-clay-coral:    #FFB3A7;
  --color-clay-primary:  #5B3AE0;
  --color-clay-ink:      #241F3A;
  --color-clay-ink-muted:#4A4363;

  --radius-clay-btn:   20px;
  --radius-clay-card:  32px;
  --radius-clay-modal: 40px;

  --font-clay: "Nunito", "Plus Jakarta Sans", ui-rounded, system-ui, sans-serif;

  --ease-clay:        cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-clay-squish: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Generates shadow-clay-1 … shadow-clay-4 and shadow-clay-pressed */
  --shadow-clay-1:
    inset 0 1px 1px 0 hsl(0 0% 100% / .35),
    inset 0 10px 18px -6px hsl(0 0% 100% / .62),
    inset 0 -10px 18px -6px hsl(258 45% 30% / .32),
    0 8px 16px -6px hsl(258 60% 45% / .28);
  --shadow-clay-2:
    inset 0 1px 1px 0 hsl(0 0% 100% / .35),
    inset 0 10px 18px -6px hsl(0 0% 100% / .62),
    inset 0 -10px 18px -6px hsl(258 45% 30% / .32),
    0 14px 26px -8px hsl(258 60% 45% / .30);
  --shadow-clay-3:
    inset 0 1px 1px 0 hsl(0 0% 100% / .35),
    inset 0 10px 18px -6px hsl(0 0% 100% / .62),
    inset 0 -10px 18px -6px hsl(258 45% 30% / .32),
    0 24px 44px -12px hsl(258 60% 45% / .32);
  --shadow-clay-4:
    inset 0 1px 1px 0 hsl(0 0% 100% / .35),
    inset 0 10px 18px -6px hsl(0 0% 100% / .62),
    inset 0 -10px 18px -6px hsl(258 45% 30% / .32),
    0 38px 68px -16px hsl(258 60% 45% / .35);
  --shadow-clay-pressed:
    inset 0 6px 12px -4px hsl(258 45% 25% / .38),
    inset 0 -3px 8px -4px hsl(0 0% 100% / .30),
    0 4px 8px -4px hsl(258 60% 45% / .24);
}

@layer components {
  .clay-card {
    @apply bg-clay-surface text-clay-ink font-clay
           rounded-clay-card shadow-clay-3 p-8;
  }
  .clay-button {
    @apply inline-flex items-center justify-center gap-2
           min-h-12 min-w-12 px-6 py-3
           bg-clay-primary text-white font-clay font-bold
           rounded-clay-btn shadow-clay-2 border-0 cursor-pointer
           transition-[transform,box-shadow,filter] duration-200 ease-clay
           hover:-translate-y-0.5 hover:shadow-clay-3 hover:brightness-105
           active:translate-y-px active:scale-[0.97] active:shadow-clay-pressed active:duration-100
           focus-visible:outline-3 focus-visible:outline-clay-primary focus-visible:outline-offset-[3px]
           disabled:grayscale-[55%] disabled:opacity-60 disabled:shadow-clay-1
           disabled:translate-y-0 disabled:cursor-not-allowed
           motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0;
  }
}

/* Forced-colors escape hatch. `--clay-border-hc` is a plain custom property, not
   a `@theme` entry, so ship the §4 `:root` block alongside `app.css`; that is
   what keeps this border identical to the vanilla one instead of a second copy
   of the same literal. */
@media (forced-colors: active) {
  .clay-card, .clay-button {
    box-shadow: none;
    border: var(--clay-border-hc);
  }
}
```

Inline arbitrary-value form, if you would rather not define components:

```html
<button class="rounded-[20px] bg-[#5B3AE0] text-white px-6 min-h-12 font-bold
  shadow-[inset_0_10px_18px_-6px_rgba(255,255,255,.62),inset_0_-10px_18px_-6px_rgba(59,44,110,.32),0_14px_26px_-8px_rgba(91,58,224,.30)]
  active:scale-[0.97] transition-transform duration-200">
  Start
</button>
```

### React component

```tsx
// ClaySurface.tsx — React 18+, TypeScript, zero external dependencies.
import React, { forwardRef } from "react";

export type ClayTone =
  | "surface" | "lavender" | "sky" | "mint" | "butter" | "coral" | "primary";
export type ClayElevation = 1 | 2 | 3 | 4;

const TONES: Record<ClayTone, { bg: string; ink: string; hue: number }> = {
  surface:  { bg: "#FFFFFF", ink: "#241F3A", hue: 258 },
  lavender: { bg: "#C7B9FF", ink: "#241F3A", hue: 258 },
  sky:      { bg: "#9FD8F5", ink: "#241F3A", hue: 202 },
  mint:     { bg: "#8FE3B8", ink: "#241F3A", hue: 152 },
  butter:   { bg: "#FFD9A0", ink: "#241F3A", hue: 36  },
  coral:    { bg: "#FFB3A7", ink: "#241F3A", hue: 8   },
  primary:  { bg: "#5B3AE0", ink: "#FFFFFF", hue: 258 },
};

const DROP: Record<ClayElevation, string> = {
  1: "0 8px 16px -6px",
  2: "0 14px 26px -8px",
  3: "0 24px 44px -12px",
  4: "0 38px 68px -16px",
};

const DROP_ALPHA: Record<ClayElevation, number> = { 1: 0.28, 2: 0.3, 3: 0.32, 4: 0.35 };

/**
 * `intensity` 0-100 scales the whole clay effect:
 *   0   = flat card, no insets, hairline drop shadow
 *   50  = reference recipe
 *   100 = maximum puff (large radius, strong sheen, deep drop)
 */
function claySoftShadow(
  tone: ClayTone,
  elevation: ClayElevation,
  intensity: number,
): string {
  const k = Math.min(100, Math.max(0, intensity)) / 50; // 0 → 2
  const { hue } = TONES[tone];
  const sheen = (0.62 * k).toFixed(3);
  const shade = (0.32 * k).toFixed(3);
  const rim = (0.35 * k).toFixed(3);
  const drop = (DROP_ALPHA[elevation] * k).toFixed(3);
  const inset = Math.round(10 * k);
  const blur = Math.round(18 * k);
  return [
    `inset 0 1px 1px 0 hsl(0 0% 100% / ${rim})`,
    `inset 0 ${inset}px ${blur}px -6px hsl(0 0% 100% / ${sheen})`,
    `inset 0 -${inset}px ${blur}px -6px hsl(${hue} 45% 30% / ${shade})`,
    `${DROP[elevation]} hsl(${hue} 60% 45% / ${drop})`,
  ].join(", ");
}

export interface ClaySurfaceProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tone?: ClayTone;
  elevation?: ClayElevation;
  radius?: number;
  intensity?: number;
  as?: "div" | "section" | "article" | "aside";
}

export const ClaySurface = forwardRef<HTMLDivElement, ClaySurfaceProps>(
  function ClaySurface(
    {
      tone = "surface",
      elevation = 3,
      radius = 32,
      intensity = 50,
      as: Tag = "div",
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const t = TONES[tone];
    return (
      <Tag
        ref={ref as React.Ref<HTMLDivElement>}
        style={{
          background: t.bg,
          color: t.ink,
          borderRadius: radius,
          boxShadow: claySoftShadow(tone, elevation, intensity),
          padding: 32,
          fontFamily:
            '"Nunito", "Plus Jakarta Sans", ui-rounded, system-ui, sans-serif',
          lineHeight: 1.55,
          ...style,
        }}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

export interface ClayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ClayTone;
  intensity?: number;
  loading?: boolean;
}

export const ClayButton = forwardRef<HTMLButtonElement, ClayButtonProps>(
  function ClayButton(
    { tone = "primary", intensity = 50, loading = false, disabled,
      children, style, onKeyDown, ...rest },
    ref,
  ) {
    const [pressed, setPressed] = React.useState(false);
    const t = TONES[tone];
    const inert = disabled || loading;

    const pressedShadow =
      `inset 0 6px 12px -4px hsl(${t.hue} 45% 25% / .38),` +
      ` inset 0 -3px 8px -4px hsl(0 0% 100% / .30),` +
      ` 0 4px 8px -4px hsl(${t.hue} 60% 45% / .24)`;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-busy={loading || undefined}
        data-pressed={pressed || undefined}
        onPointerDown={() => !inert && setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") setPressed(true);
          onKeyDown?.(e);
        }}
        onKeyUp={() => setPressed(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minHeight: 48,
          minWidth: 48,
          padding: "12px 24px",
          border: 0,
          borderRadius: 20,
          background: t.bg,
          color: t.ink,
          fontFamily:
            '"Nunito", "Plus Jakarta Sans", ui-rounded, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 17,
          cursor: inert ? "not-allowed" : "pointer",
          opacity: disabled ? 0.62 : 1,
          filter: disabled ? "grayscale(55%)" : undefined,
          transform: pressed ? "translateY(1px) scale(0.97)" : "none",
          boxShadow: pressed
            ? pressedShadow
            : claySoftShadow(tone, 2, intensity),
          transition:
            "transform 260ms cubic-bezier(.34,1.56,.64,1), box-shadow 180ms cubic-bezier(.2,.8,.2,1)",
          ...style,
        }}
        {...rest}
      >
        {loading ? "Loading…" : children}
      </button>
    );
  },
);
```

### Native / other platform

SwiftUI is genuinely relevant here: the Duolingo-style tactile button is the most common native expression of clay, and `.shadow()` plus a gradient overlay reproduces the inset stack that SwiftUI lacks natively.

```swift
// ClayCard.swift — SwiftUI, iOS 16+ / macOS 13+
// One exception, gated below: `.sensoryFeedback(_:trigger:)` is iOS 17.0+ /
// macOS 14.0+. Everything else in this file compiles against iOS 16 / macOS 13.
import SwiftUI

struct Clay: ViewModifier {
    var fill: Color
    var cornerRadius: CGFloat = 32
    var intensity: Double = 0.5          // 0…1, mirrors the web `intensity` knob
    var pressed: Bool = false

    func body(content: Content) -> some View {
        let k = max(0, min(1, intensity)) * 2
        let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)

        return content
            .padding(24)
            .background(
                shape
                    .fill(fill)
                    // Top sheen -> bottom shade, faking the two inset shadows.
                    .overlay(
                        shape.fill(
                            LinearGradient(
                                colors: [
                                    .white.opacity(0.55 * k),
                                    .clear,
                                    .black.opacity(0.18 * k)
                                ],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .blendMode(.overlay)
                    )
                    // 1px specular rim.
                    .overlay(
                        shape.strokeBorder(.white.opacity(0.35 * k), lineWidth: 1)
                    )
            )
            .clipShape(shape)
            .shadow(
                color: fill.opacity(pressed ? 0.18 : 0.34 * k),
                radius: pressed ? 6 : 22 * k,
                x: 0,
                y: pressed ? 3 : 14 * k
            )
            .scaleEffect(pressed ? 0.97 : 1.0)
            .animation(.spring(response: 0.26, dampingFraction: 0.55), value: pressed)
    }
}

extension View {
    func clay(_ fill: Color,
              cornerRadius: CGFloat = 32,
              intensity: Double = 0.5,
              pressed: Bool = false) -> some View {
        modifier(Clay(fill: fill, cornerRadius: cornerRadius,
                      intensity: intensity, pressed: pressed))
    }
}

/// `.sensoryFeedback(_:trigger:)` requires iOS 17.0 / macOS 14.0, above this
/// file's stated deployment target, so it is applied through an availability
/// gate rather than inline. On iOS 16 / macOS 13 the button is silent; the
/// visual squish still carries the affordance.
private extension View {
    @ViewBuilder
    func clayPressFeedback(_ pressed: Bool) -> some View {
        if #available(iOS 17.0, macOS 14.0, tvOS 17.0, watchOS 10.0, *) {
            self.sensoryFeedback(.impact(weight: .light), trigger: pressed)
        } else {
            self
        }
    }
}

struct ClayButtonStyle: ButtonStyle {
    var fill: Color = Color(red: 0.357, green: 0.227, blue: 0.878) // #5B3AE0
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 17, weight: .bold, design: .rounded))
            .foregroundStyle(.white)
            .frame(minHeight: 48)
            .padding(.horizontal, 24)
            .clay(fill, cornerRadius: 20, pressed: configuration.isPressed)
            .clayPressFeedback(configuration.isPressed)
    }
}

struct ClayDemo: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Daily streak")
                .font(.system(size: 25, weight: .heavy, design: .rounded))
                .clay(Color(red: 0.78, green: 0.725, blue: 1.0))   // #C7B9FF
            Button("Continue") { }
                .buttonStyle(ClayButtonStyle())
        }
        .padding(32)
        .background(Color(red: 0.957, green: 0.945, blue: 0.984))  // #F4F1FB
    }
}
```

Notes for other targets:

- **React Native:** `shadowColor/shadowOffset/shadowRadius` is iOS-only and Android's `elevation` cannot be hue-tinted or inset. Reproduce the two insets with `expo-linear-gradient` (or `react-native-linear-gradient`) layered inside a `borderRadius`-clipped `View`, and accept a single elevation shadow on Android. `react-native-svg` filters are the only route to a true inner shadow.
- **Jetpack Compose:** `Modifier.shadow()` supports `ambientColor`/`spotColor` on API 28+, so the tinted drop shadow works; the insets need a `Brush.verticalGradient` overlay inside a `clip(RoundedCornerShape(32.dp))`.
- **Figma:** build with two Inner Shadows (light Y +4-8, blur 16-32; dark Y -4 to -8, blur 8-16 at 20-30% opacity) and one Drop Shadow (blur 8-24, positive Y), then turn corner smoothing to ~60% for the squircle. Publish the shadow trio as a single Effect Style so designers cannot desynchronise the light direction.

## 6. Interaction & Motion

Clay's whole promise is that surfaces are squeezable. The motion system must therefore animate *depth*, not colour.

| State | Transform | Shadow | Duration / easing |
|---|---|---|---|
| Rest | `none` | `--clay-2` (buttons), `--clay-3` (cards) | — |
| Hover | `translateY(-2px)` | `--clay-3`, `filter: brightness(1.04)` | 180ms `cubic-bezier(.2,.8,.2,1)` |
| Active / press | `translateY(1px) scale(0.97)` | `--clay-pressed` (insets flip: dark on top) | in 90ms `ease-out`, out 260ms `cubic-bezier(.34,1.56,.64,1)` |
| Focus-visible | unchanged | unchanged | 3px solid `--clay-focus-color`, offset 3px, instant |
| Disabled | `none` | `--clay-1` | `grayscale(55%)`, `opacity: .62` |
| Loading | `none` | `--clay-2` frozen | 720ms linear spinner, `aria-busy="true"` |
| Drag | `scale(1.03) rotate(1.5deg)` | `--clay-4`, counter-rotate shadow if using a pseudo-element | 200ms `--clay-ease-out` |

Rules that matter:

- **The press must invert the light.** Merely shrinking the element is not clay. On `:active` the bright inset moves to the bottom and the dark inset to the top, which is what makes it read as pressed into the page rather than pushed away from the viewer.
- **Do not transition `box-shadow` on frequently repainted elements.** Every frame re-rasterises the blur. For lists, carousels, and scroll-linked animation, place the hover shadow on an absolutely positioned `::after` with the same radius and cross-fade its `opacity` (compositor-only), animating `transform` on the parent.
- **Overshoot only on release.** `cubic-bezier(.34,1.56,.64,1)` on press-in makes the button feel loose; on release it makes it feel elastic. Press-in should be a fast, linear-ish `ease-out` at 90ms.
- **Total press-cycle budget: under 400ms.** 90ms down plus 260ms spring back. Longer and the interface feels laggy rather than soft.
- **Never animate `border-radius`.** It forces a re-layout of the clip path and destroys the corner-smoothing illusion mid-flight.
- **Rotation needs shadow compensation.** If a clay element rotates, its drop shadow rotates with it and the global light direction breaks. Counter-rotate the shadow-bearing pseudo-element by the negative angle.
- **Haptics on native.** SwiftUI `.sensoryFeedback(.impact(weight: .light))` on press — **iOS 17.0+ / macOS 14.0+**, so gate it with `if #available(iOS 17.0, macOS 14.0, *)` if you support iOS 16 / macOS 13, as the `clayPressFeedback` helper in §5 does — or `HapticFeedbackConstants.CONTEXT_CLICK` on Android. The physical feedback is doing half the work of the visual metaphor, but it must never be the only feedback: the squish transform has to carry the state on its own.

```css
@media (prefers-reduced-motion: reduce) {
  .clay-btn,
  .clay-card,
  .clay-chip {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
  /* Keep the state legible without movement: swap depth instantly. */
  .clay-btn:hover  { transform: none; box-shadow: var(--clay-3); }
  .clay-btn:active { transform: none; box-shadow: var(--clay-pressed); }
  /* Long-running indeterminate spinners become a slow, low-amplitude pulse. */
  .clay-btn[data-loading="true"]::after {
    animation: clay-spin 1600ms linear infinite;
  }
}
```

## 7. Accessibility

Claymorphism is a real improvement over neumorphism, but "better than the worst" is not the bar. These are the criteria it actually threatens.

**WCAG 2.2 criteria at risk**

- **1.4.3 Contrast (Minimum), AA 4.5:1 / 3:1 large.** The failure mode is white text on a pastel clay surface. `#FFFFFF` on `#FFB3A7` (coral) is 1.71:1 — a hard fail. The fix is a dark ink token: `#241F3A` on `#FFB3A7` is 9.20:1. Every pastel surface in section 4 was chosen so that `--clay-ink` clears 8:1. Saturated action colours must be darkened until white passes: `#E8573F` with white is only 3.58:1, whereas `#C7442C` reaches 4.89:1 and `#5B3AE0` reaches 6.72:1.
- **1.4.11 Non-text Contrast, 3:1.** This is where clay fails most often and most quietly. The boundary of a clay button is made of shadow, and a soft shadow at 30% alpha over a similar-lightness background rarely reaches 3:1 against the adjacent colour. Two mitigations: (a) keep surface-to-background lightness delta at 3:1 or better — `#C7B9FF` against `#F4F1FB` is only 1.59:1, so on a pale page a lavender card needs either a darker surface or (b) a `1px` `hsl(258 40% 55% / .55)` inset ring that survives independently of the blur. Test the *element edge*, not the text.
- **1.4.1 Use of Color / affordance.** Applying the clay treatment to non-interactive cards and to buttons alike recreates neumorphism's "everything looks pressable" problem in a new costume. Reserve the full stack (inset sheen + drop) for interactive elements and give static panels a flat fill with only `--clay-drop-1`.
- **2.4.7 / 2.4.11 Focus Visible & Focus Not Obscured (Minimum).** Designers routinely delete the focus ring because it "breaks the softness". Do not. Use a 3px solid ring at 3px offset in `--clay-focus-color`; the offset is required because a ring drawn on the element edge disappears into the drop shadow. `#5B3AE0` against `#F4F1FB` is 6.02:1, comfortably over the 3:1 requirement. Also verify the ring is not clipped by an ancestor's `overflow: hidden` on a rounded card.
- **2.5.8 Target Size (Minimum), 24x24 CSS px.** Clay's chunky look usually helps here, but pill-shaped chips and icon buttons in dense clay layouts often shrink below 24px. Ship 48x48 as the default minimum; that also satisfies 2.5.5 (AAA).
- **1.4.12 Text Spacing.** Large radii plus generous padding mean text sits close to a curved edge. At 1.5x line-height and 0.12em letter-spacing, clay cards frequently clip. Reserve `padding` >= `border-radius * 0.75` on any card whose text can wrap.

**Contrast worked examples (sRGB, WCAG 2.x formula)**

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `#241F3A` | `#F4F1FB` page | 14.13:1 | Pass AAA |
| `#241F3A` | `#C7B9FF` lavender | 8.87:1 | Pass AAA |
| `#241F3A` | `#9FD8F5` sky | 10.22:1 | Pass AAA |
| `#241F3A` | `#8FE3B8` mint | 10.40:1 | Pass AAA |
| `#241F3A` | `#FFD9A0` butter | 11.77:1 | Pass AAA |
| `#241F3A` | `#FFB3A7` coral | 9.20:1 | Pass AAA |
| `#4A4363` muted | `#F4F1FB` | 8.28:1 | Pass AAA |
| `#FFFFFF` | `#5B3AE0` primary | 6.72:1 | Pass AA/AAA-large |
| `#FFFFFF` | `#C7442C` danger | 4.89:1 | Pass AA only |
| `#FFFFFF` | `#E8573F` (rejected) | 3.58:1 | **Fail AA body text** |
| `#F2EFFA` | `#221D2E` dark page | 14.42:1 | Pass AAA |
| `#F2EFFA` | `#4A3E7A` dark lavender | 8.18:1 | Pass AAA |
| `#221D2E` | `#A78BFA` dark primary | 6.01:1 | Pass AA |

**Forced colors / Windows High Contrast.** In forced-colors mode the user agent forces `box-shadow: none` and `text-shadow: none`. Since clay's entire structure *is* the shadow, a clay UI collapses into undifferentiated blocks of `Canvas`. Every clay component must ship a `@media (forced-colors: active)` block that replaces the shadow with `border: var(--clay-border-hc)` — the `2px solid ButtonText` token from §4, declared once so the two forced-colors blocks in §5 cannot drift apart — and uses system colours (`ButtonFace`, `ButtonText`, `Highlight`, `Canvas`, `CanvasText`). Do not reach for `forced-color-adjust: none` to "keep the look" — that defeats the user's stated preference.

**Reduce transparency / reduce motion.** Clay surfaces are opaque, so `prefers-reduced-transparency` is only relevant if you have hybridised with glass; if you have, drop `backdrop-filter` to `none` and raise the surface alpha to 1. `prefers-reduced-motion: reduce` must kill the press spring and hover lift while keeping an instant depth change so state is still perceivable — removing the animation must not remove the feedback.

**Screen reader and DOM order.** Clay's floating cards invite absolute positioning and CSS-order tricks in bento-ish layouts; keep DOM order equal to visual order (1.3.2 Meaningful Sequence). Shadows convey nothing to assistive tech, so pressed and selected states need `aria-pressed`, `aria-selected`, or `aria-current` — never shadow alone. Decorative clay-rendered 3D illustrations get `alt=""` / `aria-hidden="true"`; clay icons that carry meaning need accessible names.

**Pass/fail checklist**

1. Every text/background pair on a clay surface measures >= 4.5:1 (>= 3:1 at 24px+ or 19px bold). Fail if any pastel carries white body text.
2. Every clay control's edge measures >= 3:1 against its immediate background, via lightness delta or an explicit ring. Fail if the only boundary is a blurred shadow.
3. `:focus-visible` produces a visible ring >= 3px at >= 3:1 against both the control and the page, not clipped by any ancestor. Fail if focus styling is removed anywhere.
4. All interactive targets >= 24x24 CSS px, ideally 48x48. Fail otherwise.
5. Non-interactive surfaces do not use the full clay stack. Fail if static cards look identical to buttons.
6. `@media (forced-colors: active)` block exists for every clay component and renders a visible border. Fail if the component disappears with Windows High Contrast on.
7. `prefers-reduced-motion: reduce` disables the spring and lift but preserves a perceivable state change. Fail if the state becomes invisible.
8. Every state communicated by depth is also communicated by an ARIA attribute or text. Fail if `aria-pressed`/`aria-current` is missing.
9. Dark mode re-derives the sheen and shade rather than reusing light-mode alphas. Fail if dark clay looks chalky or grey.
10. Zoom to 200% and set text spacing to WCAG 1.4.12 values: no text clips against a rounded corner. Fail on any clip.
11. Every interactive control takes its `min-height`/`min-width` from `--clay-target-min` (48x48), measured *while pressed* so the squish `scale()` is included. Fail if a chip, pill or icon button resolves smaller, or if the token is bypassed with a hard-coded height.

## 8. Performance

- **Blur cost scales roughly with the square of the blur radius.** A 68px blur samples an area roughly 18x larger than a 16px blur. The `--clay-drop-4` layer (68px) should exist only on modals and never on repeated list items.
- **Layers multiply.** The reference recipe is four shadow layers per element (rim, sheen, shade, drop). Four layers on 40 visible elements is 160 blur rasterisations per full paint. Budget: **<= 4 layers per element, <= 40 clay elements per viewport, <= 48px blur on anything that repeats.**
- **Insets are cheaper than the outer drop.** Inset shadows are clipped to the border box, so their cost is bounded by the element's own area. The outer drop shadow's cost is bounded by area + spread + blur in every direction — it is the expensive one. If you must cut cost, cut the drop shadow's blur before you cut the insets.
- **`box-shadow` is a paint-stage property, not a composited one.** Animating it invalidates the layer and forces re-rasterisation every frame. `transform` and `opacity` are compositor-only. Measurable rule: animate `transform`; cross-fade a pseudo-element's `opacity` for shadow changes; never put `box-shadow` in a `@keyframes` that runs longer than one press cycle.
- **Scroll containers are the danger zone.** Clay cards inside a virtualised list with a 44px blur will re-raster on every scroll tick on mid-range Android. Either promote the list to its own layer with `will-change: transform` on the *scroller*, or reduce to `--clay-drop-1` while `data-scrolling="true"`.
- **`will-change` is a trap here.** Adding `will-change: box-shadow` allocates a layer but does not make the blur cheaper, and dozens of promoted layers exhaust GPU memory on low-end devices. Use `will-change: transform` on at most the element currently being interacted with, and remove it afterwards.
- **Asset weight is near zero for CSS clay** — the entire style is a few hundred bytes of custom properties. The cost shows up when teams pair CSS clay with 3D clay illustration: a single Blender-rendered hero PNG at 2x commonly runs 400KB-1.5MB, and a Spline scene ships a WebGL runtime plus geometry in the 1-4MB range and holds the GPU. **Budget: <= 150KB per clay illustration as AVIF/WebP, and no Spline scene above the fold on mobile.**
- **Measurable targets.** In Chrome DevTools Performance, a clay page should keep "Rendering" + "Painting" under 25% of main-thread time during a scroll trace, and hold >= 55fps on a 4x-CPU-throttled profile. Lighthouse should not report layout shift from shadows (shadows never affect layout, so any CLS is coming from your images).
- **Cheaper fallbacks, in order of savings:** (1) drop the 1px rim light — visually cheap, costs one full layer; (2) replace the outer drop with a single `filter: drop-shadow()` only if the element has transparency, otherwise keep `box-shadow` (it is cheaper for opaque rectangles); (3) replace the two insets with a single `linear-gradient` background overlay, which is a gradient fill rather than a blur and is markedly cheaper; (4) below a `(max-width: 480px)` or `(prefers-reduced-data: reduce)` breakpoint, halve every blur and drop to `--clay-1`.

```css
@media (prefers-reduced-data: reduce), (max-width: 480px) {
  :root {
    --clay-drop-3: 0 12px 22px -8px hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .30);
    --clay-drop-4: 0 18px 32px -10px hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .32);
    --clay-rim: none;
  }
}

/* Gradient-overlay fallback: two insets replaced by one background layer. */
.clay--cheap {
  background-image: linear-gradient(
    to bottom,
    hsl(0 0% 100% / .45) 0%,
    hsl(0 0% 100% / 0) 38%,
    hsl(258 45% 30% / .18) 100%
  );
  box-shadow: var(--clay-drop-2);
}
```

## 9. When To Use / When Not To

**Use it when**

- The product is for children or families: habit trackers, chore apps, early-literacy and early-numeracy tools, kids' banking. Joon (kids' ADHD chore and habit tracker) is the archetype.
- Gamified learning and streak mechanics, where a big pressable button is the core interaction and tactility drives repeat engagement — the Duolingo pattern.
- Onboarding, empty states, and celebration moments inside otherwise neutral products. Clay is excellent as a 5% accent and poor as a 100% skin.
- Marketing and landing pages that already carry Blender/Spline clay renders and need the UI chrome to match the artwork.
- Wellness, meditation, journaling, and mood-tracking apps where softness is a deliberate emotional signal.
- Creative and "toy" tools — sticker makers, avatar builders, kids' music apps — where the interface should feel like an object.
- Physical-product companion apps for soft goods, toys, and pet tech.
- Consumer fintech aimed at under-25s that wants to feel unintimidating, provided the numbers themselves stay in high-contrast neutral typography.

**Avoid it when**

- The interface is data-dense. Clay's radii and padding cost roughly a quarter to a third of usable content area versus a flat card; dashboards, tables, and IDEs cannot afford it.
- Trust and gravity are the product: banking core flows, insurance, legal, medical records, government services, security tooling. Clay reads as unserious at best and condescending at worst.
- Enterprise B2B software with power users. Clay has essentially never been adopted in enterprise systems, and the density penalty is the reason.
- The brand voice is precise, technical, editorial, or luxury. Clay actively fights those registers; use [./07-brutalism.md](./07-brutalism.md) for confident, [./05-minimalism.md](./05-minimalism.md) (which covers Swiss / International Typographic style) for precise.
- You need dense multi-layer stacking. Three or more nested clay levels turn into visual mud because the drop shadows overlap.
- The primary target is low-end Android with long scrolling lists — the blur budget will not hold.
- Accessibility is being retrofitted rather than designed in. Clay's boundary-by-shadow model requires deliberate 1.4.11 work; if there is no budget for that, ship flat.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Tint the drop shadow with the surface hue at 28-35% alpha (`hsl(258 60% 45% / .30)`) | Don't ship the 2022 default `rgba(0,0,0,.25)` — neutral grey shadows read as generic drop-shadow, not clay |
| Give every clay element its own background colour, independent of the page | Don't inherit the page background for the surface — that is neumorphism, and it will fail 1.4.11 |
| Keep one light source (top or top-left) across every element on every screen | Don't mix top-lit cards with top-left-lit buttons; one inconsistency kills the illusion |
| Use dark ink (`#241F3A`) on pastel surfaces, verified at >= 8:1 | Don't put white text on pastel — `#FFF` on `#FFB3A7` is 1.71:1 |
| Reserve the full inset+drop stack for interactive elements only | Don't apply clay to static cards and buttons alike — affordance collapses exactly as it did in neumorphism |
| Invert the inset light on `:active` and add `scale(0.97)` | Don't fake the press with `opacity` or colour change alone; clay must deform |
| Set radius 24-40px on cards, 16-20px on buttons, with Figma corner smoothing ~60% | Don't drop below 16px on interactive elements — it stops reading as clay and starts reading as a bug |
| Cap blur at 48px on repeating elements and 68px on modals | Don't stack six shadow layers on list items; blur cost scales with the square of the radius |
| Re-derive the sheen and shade for dark mode (sheen alpha ~0.14, shade ~0.55) | Don't reuse light-mode shadow alphas in dark mode — the result is chalky grey plastic |
| Ship a `@media (forced-colors: active)` border fallback for every component | Don't rely on shadow for boundaries without a fallback; forced-colors sets `box-shadow: none` |
| Pair with rounded sans at weight 500-700 (Nunito, Quicksand, Fredoka, Plus Jakarta Sans) | Don't set clay in Inter or Helvetica Neue; sharp grotesks fight the puffed geometry |
| Keep grid gaps >= 24px so drop shadows never overlap | Don't nest clay three levels deep; overlapping soft shadows turn into mud |
| Animate `transform`, cross-fade shadow via a pseudo-element's `opacity` | Don't transition `box-shadow` directly on scroll-linked or list elements |
| Keep a 3px focus ring at 3px offset, outside the shadow | Don't delete the focus ring because it "breaks the softness" |

## 11. In The Wild (2024-2026)

- **Duolingo** — the clearest mainstream product expression of the tactile half of the style. Large pressable buttons built on a solid bottom-shadow offset (the widely replicated `0 4px 0 0` pattern rather than a blurred clay stack), rounded geometry, saturated-but-soft colour, and a press animation that collapses the depth. Duolingo does not use the inset sheen/shade recipe; it takes clay's *interaction model* and rejects its *rendering technique*. Continuous through 2024-2026.
- **Joon (Joon: Kids ADHD Chore Tracker, App Store id1482225056)** — kids' habit and chore app for ages 6-12 built around a virtual pet. Soft inflated shapes and 3D characters used precisely because they read as safe to both children and parents. Cited by Superdesign in 2026 as a working clay-genre example.
- **tweakcn `claymorphism` theme (2025-2026)** — a shipped, installable shadcn/ui theme. Verified token values from its registry item: `--radius: 1.25rem` (20px), Plus Jakarta Sans / Lora / Roboto Mono, light background `oklch(0.9232 0.0026 48.7171)`, primary `oklch(0.5854 0.2041 277.1173)`, accent `oklch(0.9376 0.0260 321.9388)`, and a soft shadow ramp built from `2px 2px 10px 4px hsl(240 4% 60% / 0.18)`. Notably it is *soft* clay, not puffy clay — no inset stack at all, just chunky radii and diffuse shadows. Redistributed by shadcn.io as "Claymorphism" — but do not take the numbers from that redistribution: it restates the background as `oklch(0.95 0.02 280)` (a violet tint) and the radius as a "16-24px" range, and both are wrong against the registry item. Reference 6 is the source of truth for every figure quoted here.
- **`clay.css` by Adrian Bece (codeAdrian)** — the reference open-source implementation, MIT, ~573 GitHub stars. Single `.clay` class plus SCSS mixin, five custom properties, 32px default radius. Archived in practice: last commit 23 November 2022. Still the snippet most tutorials copy.
- **`tailwindcss-claymorphism` (dulltackle)** — npm package generating `clay-sm-*` / `clay-md-*` utilities across 22 Tailwind palette colours. Latest release 0.11.1 on 29 October 2022, peer `tailwindcss ^3.1.6`, MIT. No Tailwind v4 support; a good marker of when the trend peaked.
- **Hype4 Academy Claymorphism CSS Generator** — Malewicz's own tool, still live in 2026. Its defaults are the canonical numbers: `border-radius: 26px`, `backdrop-filter: blur(5px)`, `box-shadow: 35px 35px 68px 0 rgba(145,192,255,.5), inset -8px -8px 16px 0 rgba(145,192,255,.6), inset 0 11px 28px 0 rgb(255,255,255)`. The `backdrop-filter` in the default output is the clearest evidence that clay was conceived partly as a glass hybrid.
- **`1st-pouf` (moji2002, GitHub, created 26 July 2026)** — a "puffy, pastel React UI kit" distributed as a shadcn-style registry on Tailwind. Evidence that new clay tooling is still being authored in 2026, at a small scale.
- **`clay-vue` (Byloth)** — reusable Vue components in the claymorphism style; repo created March 2023, still receiving commits in July 2026.
- **Figma Community** — a dedicated "Claymorphism - Clay Effects" plugin plus multiple free clay UI kits and templates; the Figma-side ecosystem is materially healthier than the CSS-side one.
- **Clay-rendered 3D icon packs** — Icons8, IconScout, and getillustrations ship Blender-rendered clay icon sets that continued to be produced and updated through 2025-2026. Icon-trend surveys in 2026 place claymorphic icons at peak adoption with an expected pullback in 18-24 months, which is the single strongest signal that the *illustration* half of the trend outlived the *interface* half.
- **Superdesign generation telemetry (2026)** — across 208,000+ generations, claymorphism rose from 0.03% (January 2026) to 0.08% (May 2026) of output, spread over about 70 projects, concentrated in children's products, edtech, and illustration-heavy landing pages. Small but doubling.

Deliberately excluded for lack of verification: claims that Slack, iMessage, or Facebook Messenger "use claymorphism" (they use rounded geometry, which is not the same thing), and any claim that a named bank or major SaaS shipped a full clay design system.

## 12. Hybrids & Neighbors

Sibling filenames below are taken from the canonical index in [./README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui. Styles named without a link have no file in this set.

- **[Neumorphism](./02-neumorphism.md) — the parent, and the one to keep at arm's length.** Clay is a direct remediation of neumorphism's contrast failure: same soft-shadow vocabulary, but with an independent surface colour and a real drop shadow. Mixing the two in one interface is the single worst combination in this doc set, because a same-coloured extruded element next to a floating coloured one destroys the reader's model of where the light and the ground plane are. If you want subtle recesses, use clay's *inverted* inset recipe for inputs (shown in section 5) rather than importing neumorphism wholesale.
- **[Glassmorphism](./03-glassmorphism.md) — works, and was in the original recipe.** Malewicz's own generator emits `backdrop-filter: blur(5px)` alongside the clay shadows. The working split: clay for opaque, pressable objects; glass for overlays, sheets, and nav bars that sit above them. Never make a clay element itself translucent — the insets need an opaque body to shade, and a translucent clay surface reads as a smudge. Watch the compounded cost: `backdrop-filter` plus a 44px blur on the same element is the most expensive combination available.
- **[Skeuomorphism](./01-skeuomorphism.md) — adjacent ancestor, mostly incompatible.** Both simulate physical material, but skeuomorphism simulates *specific* materials with texture maps and gradients, while clay simulates one generic, untextured, matte material. Adding leather stitching or brushed metal to a clay UI produces a 2011 pastiche. The one legitimate borrow is skeuomorphism's discipline about a single consistent light source, which clay needs just as badly.
- **[Brutalism / neubrutalism](./07-brutalism.md) — clashes structurally.** Neubrutalism's hard 4px black offset shadow and 0px radius are the exact opposite of clay's blurred hue-matched shadow and 32px radius. They cannot coexist in one component. They can coexist across a *site* if you zone them strictly — brutalist editorial sections, clay product/onboarding sections — but this needs real art direction, not a token merge.
- **[Minimalism / flat](./05-minimalism.md) — the pragmatic host.** The most common successful 2025-2026 deployment is a flat or minimal base with clay applied to exactly one layer: the primary CTA, the onboarding illustrations, and the celebration states. This keeps density and accessibility while buying the personality. Doc 05 owns flat and flat 2.0 as aliases. Google Material Design has no doc of its own here, but Material 3's tonal surfaces and larger corner tokens make the same graft easy if that is your base.
- **[Maximalism](./06-maximalism.md) — works, and shares a decade.** Both are reactions against flat neutrality, both spend budget on personality, and both live comfortably at high chroma. The one rule: maximalism's collage may not run *behind* a clay card, because clay's boundary is a hue-matched shadow and a busy ground makes that boundary position-dependent and untestable against 1.4.11. Give every clay object a calm local ground and let the maximalism happen around it.
- **[Bento grids](./09-bento-grid.md) — natural fit, with a caveat.** Bento's tiled cells and clay's chunky radii were made for each other, and this is where clay most often appears on 2025-2026 landing pages. The caveat: bento's tight gutters fight clay's need for >= 24px gaps to prevent shadow overlap. Widen the gutters or reduce to `--clay-drop-1` inside the grid.
- **[Liquid Glass](./08-liquid-glass.md) — layer it, don't blend it.** Same split as glassmorphism above, one rung more expensive: clay for the opaque pressable objects, Liquid Glass for the chrome floating over them. Never give a clay surface a displacement filter — clay's read depends on an opaque body for the insets to shade.
- **[Spatial UI](./10-spatial-ui.md) — strong pairing, and clay's most defensible future.** Clay is already a soft-3D language, so it survives being placed on a real z-ladder better than any other style here. Let the spatial stage own perspective and parallax and let clay own the object's own volume; do not give a clay card its own perspective transform on top of the stage's, or the light source and the camera disagree.
- **Aurora / mesh gradients — no doc in this set; strong pairing.** A soft mesh-gradient background gives clay's drop shadow somewhere interesting to land, and both live in the same pastel lightness band. The rule is that the gradient must stay under roughly 12% chroma variance behind any clay card, or the 1.4.11 edge contrast becomes position-dependent and untestable.
- **Y2K / Frutiger Aero — no doc in this set; genuine sibling.** Both descend from glossy, inflated, optimistic 3D. Clay is the matte, desaturated, subsurface-scattered version; Frutiger Aero is the glossy, specular, high-saturation version. Swapping clay's diffuse sheen for a hard specular highlight moves you from one to the other, which makes this the easiest deliberate crossfade available.
- **Swiss / International Typographic style — covered as an alias of [./05-minimalism.md](./05-minimalism.md), not a separate doc; opposed on every axis.** Grid discipline, sharp corners, neutral palette, and information density are all negations of clay. The only useful borrow runs the other way: Swiss typographic scale and spacing rigour applied to clay's layout prevents the whole thing from turning into a soft-edged mess.

## 13. Plugin Spec (draft)

**Skill name:** `claymorphism-ui`

**Description (triggering):** "Use when the user wants a soft, puffy, clay-like UI — asks for claymorphism, clay UI, play-doh or squishy interfaces, inflated 3D-looking cards and buttons, a playful kids/edtech/wellness aesthetic, or wants to convert an existing flat or neumorphic interface into tactile pastel clay surfaces with inset highlight-and-shade shadows."

**What the skill does**

1. Emits a token layer: pastel surface ramp, dark ink pair, hue-linked shadow atoms (rim, sheen, shade, four drop elevations), radius scale, rounded-sans type scale, spacing scale, and motion tokens — with a matching dark-mode override block that re-derives sheen and shade alphas rather than reusing light values.
2. Rewrites component surfaces: replaces flat `border` + `box-shadow` declarations with the four-layer clay stack, raises `border-radius` to the clay scale, and swaps neutral shadow colours for hue-matched ones derived from each element's own background.
3. Splits interactive from static: applies the full stack only to elements it can prove are interactive (`button`, `a`, `[role=button]`, `input`, `[tabindex]`, framework `onClick` handlers) and gives static panels a reduced `--clay-drop-1`-only treatment.
4. Installs the press-and-release motion system: `:active` inset inversion plus `scale(0.97)`, 90ms press / 260ms spring release, and rewrites any existing `transition: box-shadow` into a pseudo-element opacity cross-fade on repeating elements.
5. Inverts the recipe for text inputs and wells so they read as recessed rather than inflated.
6. Adds the required media blocks: `prefers-reduced-motion`, `forced-colors`, `prefers-reduced-data`, and a `max-width: 480px` blur reduction.
7. Runs a contrast pass, recolouring text tokens (not surfaces) until every pair clears 4.5:1, and reporting anything it could not fix.
8. Optionally swaps the type stack to a rounded sans and offers a matched clay 3D icon strategy (no assets generated, only guidance and slots).

**Inputs required from the user**

- `framework`: `vanilla-css` | `tailwind-v4` | `react` | `vue` | `svelte` | `swiftui` | `react-native`
- `basePalette`: 1-5 seed colours (hex or oklch), or `auto` to derive a pastel ramp from an existing brand primary
- `density`: `comfortable` | `cozy` | `compact` — drives radius, padding, and target size (`compact` may trade padding for density but still floors targets at `--clay-target-min`)
- `intensity`: `0-100` — the master knob (see below)
- `darkMode`: `none` | `media` | `class`
- `scope`: glob or component list to transform, so the skill never rewrites an entire codebase unasked

**Outputs produced**

- `clay.tokens.css` (or `@theme` block for Tailwind v4, or a `ClayTokens.swift` enum) — the full custom property set with dark-mode override
- `clay.components.css` / `Clay*.tsx` — Card, Button, IconButton, Chip, Input, Toggle, Modal, Toast
- A CSS `@layer claymorphism` wrapper so the style can be disabled or overridden without specificity fights
- `clay-audit.md` — per-element contrast table with computed ratios, blur-budget count, list of elements that received reduced treatment, and every unfixable finding
- A `clay-fallbacks.css` partial holding the forced-colors, reduced-motion, reduced-data, and small-screen blocks

**Self-run validation checklist**

1. Compute WCAG 2.x contrast for every generated foreground/background pair; fail the run if any text pair is below 4.5:1 (or 3:1 for >= 24px / 19px bold).
2. Compute surface-to-adjacent-background contrast for every interactive element; if below 3:1, inject a 1px inset ring and record it in the audit.
3. Count shadow layers per selector and blur radii; fail if any selector exceeds 4 layers, or if a selector matching a list/grid item exceeds 48px blur.
4. Assert a `@media (forced-colors: active)` rule exists for every generated component and that it sets a visible border.
5. Assert a `@media (prefers-reduced-motion: reduce)` rule exists and that each state still produces a non-animated visual delta.
6. Assert `:focus-visible` is present on every interactive component, is at least 3px, has an offset of at least 2px, and clears 3:1 against both the control and the page.
7. Assert every generated interactive component meets `--clay-target-min` (48x48); fail below the 24x24 CSS px SC 2.5.8 floor, warn between the floor and the token.
8. Assert dark-mode sheen alpha <= 0.20 and shade alpha >= 0.45; fail otherwise (this is the chalky-grey guard).
9. Assert no `transition` or `@keyframes` property list contains `box-shadow` on a selector that also matches a scrollable list item.
10. Assert every depth-encoded state has a paired ARIA attribute in the generated components.

**Intensity knobs (min/max)**

| Knob | Min | Reference (intensity 50) | Max | Effect |
|---|---|---|---|---|
| `radiusScale` | 8px card / 6px button | 32px / 20px | 48px / 28px | Corner puff; below 16px on controls the style stops reading as clay |
| `insetStrength` | sheen 0.00 / shade 0.00 | sheen 0.62 / shade 0.32 | sheen 0.85 / shade 0.48 | The inflation itself; 0 yields a flat tinted card |
| `dropDepth` | `0 2px 4px -2px` @ 0.12 | `0 24px 44px -12px` @ 0.32 | `0 44px 76px -16px` @ 0.42 | How far the object floats; also the main perf lever |
| `surfaceChroma` | 0.02 oklch (near-grey) | 0.09 oklch (pastel) | 0.16 oklch (candy) | Palette saturation; above 0.16 the dark-ink contrast floor starts breaking |
| `squishAmount` | `scale(1.00)` | `scale(0.97)` + 1px translate | `scale(0.93)` + 3px translate | Press deformation; capped at 0.93 because further shrink makes 24px targets miss their own hit area |

**Anti-patterns the skill must refuse to generate**

- White or light-grey text on any pastel clay surface.
- A clay surface whose background colour equals the page background — that is neumorphism, and the skill should say so and offer the correct clay alternative instead.
- Removal, suppression, or `outline: none` on any focus indicator, under any styling justification.
- The full clay stack on non-interactive elements when interactive elements in the same view use it too.
- `box-shadow` inside `transition` or `@keyframes` on virtualised lists, scroll containers, or anything matched by a repeating selector.
- `forced-color-adjust: none` used to preserve the aesthetic in Windows High Contrast mode.
- Clay applied wholesale to data tables, financial statements, medical records, or admin dashboards; the skill should warn and offer accent-only scoping instead.
- More than two nested clay elevation levels in a single subtree.
- Neutral `rgba(0,0,0,α)` drop shadows on coloured surfaces.
- Any output that omits the dark-mode block when `darkMode` is not `none`.
- Spline or WebGL 3D scenes injected above the fold on a mobile breakpoint.

## 14. References

1. *Claymorphism in User Interfaces* — https://hype4.academy/articles/design/claymorphism-in-user-interfaces — Michał Malewicz, Hype4 Academy — December 2021 — **[primary]** (the article that coined the term)
2. *Claymorphism CSS Generator* — https://hype4.academy/tools/claymorphism-generator — Hype4 Academy — 2021, live 2026 — **[primary]** (canonical defaults: 26px radius, 35/35/68 outer, -8/-8/16 and 0/11/28 insets, `backdrop-filter: blur(5px)`)
3. *Claymorphism: Will It Stick Around?* — https://www.smashingmagazine.com/2022/03/claymorphism-css-ui-design-trend/ — Adrian Bece, Smashing Magazine — 16 March 2022 — **[secondary]** (canonical three-shadow snippet; the independent-background-colour insight)
4. *clay.css* — https://github.com/codeAdrian/clay.css — Adrian Bece (codeAdrian), MIT — repo created 8 January 2022, last commit 23 November 2022 — **[primary]** (reference implementation; 32px radius, `8px 8px 16px 0 rgba(0,0,0,.25)` outset, `±8px` insets)
5. *tailwindcss-claymorphism* — https://github.com/dulltackle/tailwindcss-claymorphism and the npm registry record for the package — dulltackle, MIT — first publish 3 August 2022, latest 0.11.1 on 29 October 2022, peer `tailwindcss ^3.1.6` — **[primary]**
6. *tweakcn claymorphism theme registry item* — https://tweakcn.com/r/themes/claymorphism.json — jnsahaj/tweakcn — retrieved 8 August 2026 — **[primary]** (verified oklch tokens, `--radius: 1.25rem`, Plus Jakarta Sans, full light/dark shadow ramp)
7. *forced-colors — CSS media feature* — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors — MDN Web Docs, Mozilla — continuously updated — **[primary]** (confirms `box-shadow` and `text-shadow` are forced to `none`; documents `forced-color-adjust`)
8. *Claymorphism tutorial – How to mimic clay in UI design* — https://uxmisfit.com/2022/04/29/claymorphism-tutorial-how-to-mimic-clay-in-ui-design/ — Thalion (Przemysław Baraniak) — 29 April 2022 — **[secondary]** (Figma numeric recipe: drop blur 8-24px, inner shadows Y 4-8px / blur 16-32px and 8-16px at 20-30%, reflection -2/-2/4 at 50-80%)
9. *What is claymorphism in web design?* — https://blog.logrocket.com/ux-design/what-is-claymorphism-web-design/ — Angela Fabunan, LogRocket Blog — 22 May 2024 — **[secondary]** (positions clay as neumorphism's accessibility remediation; contrast criticism)
10. *Fun with Claymorphism* — https://unorthodocss.com/ui-frameworks/2025/08/19/fun-with-claymorphism.html — Daniel Fuller, Unorthodox CSS — 19 August 2025 — **[secondary]** (five-layer recipe with rim light; shadow paint order; counter-rotating shadows; text-shadow workaround)
11. *Claymorphism UI design: recipe, examples, AI guidelines* — https://www.setproduct.com/blog/claymorphism-design-guide — Roman Kamushken, Setproduct — 25 June 2026 — **[secondary]** (2026 status; radius scale 16-32px; hue-matched shadow rule; rounded-typeface guidance)
12. *Claymorphism: CSS Recipe, Examples and When the Squish Works* — https://superdesign.dev/styles/claymorphism — Superdesign — 2026 — **[secondary]** (generation telemetry: 0.03% Jan 2026 to 0.08% May 2026 across 208,000+ generations; Duolingo and Joon examples; ~29% content-area penalty for dashboards)
13. *Claymorphism* (shadcn/ui theme) — https://www.shadcn.io/theme/claymorphism — shadcn.io — 2026 — **[secondary, imprecise restatement — do not quote its numbers]** (an aggregator page redistributing the tweakcn theme. It gives the background as `oklch(0.95 0.02 280)` and the radius as "16-24px". Neither matches the registry item in reference 6, which is the source of truth: `oklch(0.9232 0.0026 48.7171)` — a near-neutral *warm* off-white at chroma 0.0026, hue 48.7 — and `--radius: 1.25rem` exactly. shadcn.io's figures describe a violet-tinted background at chroma 0.02, hue 280, which is a different colour, and a range rather than a value. §2 and §11 quote reference 6 throughout; this entry is retained only so the discrepancy is on the record.)
14. *Claymorphism — DESIGN.md* — https://designmd.app/library/claymorphism — designmd.app — 2026 — **[secondary, aggregator]** (token summary; 2026 niche status; explicit note that clay was never adopted in enterprise UI)
15. *Joon: Kids ADHD Chore Tracker* — https://apps.apple.com/us/app/joon-kids-adhd-chore-tracker/id1482225056 — Joon App, Apple App Store — listing current 2026 — **[primary]** (verifies the product named as a clay-genre example exists and targets kids 6-12)
16. *Understanding SC 1.4.11: Non-text Contrast (Level AA)* — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — W3C Web Accessibility Initiative, WCAG 2.2 — current — **[primary]** (the 3:1 adjacent-colour requirement that §7's entire boundary-contrast argument rests on, including the rule that ratios are not rounded)
17. *Understanding SC 1.4.3: Contrast (Minimum) (Level AA)* — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — W3C Web Accessibility Initiative, WCAG 2.2 — current — **[primary]** (4.5:1 body / 3:1 large-text thresholds used for every ink-on-clay figure in §4 and §7)
18. *Understanding SC 2.5.8: Target Size (Minimum) (Level AA)* — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — W3C Web Accessibility Initiative, WCAG 2.2 — current — **[primary]** (the 24×24 floor behind the 48px `min-height` on `.clay-btn`)
19. *box-shadow* — https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow — MDN Web Docs, Mozilla — continuously updated — **[primary]** (`inset` semantics, the offset/blur/spread order, and the rule that shadows paint in declaration order with the first on top — the behaviour reference 10 relies on)
20. *Duolingo Design* — https://design.duolingo.com/ — Duolingo — accessed 8 August 2026 — **[primary]** (Duolingo's own design-system site; the source for the §11 claim about its button depth and press-collapse interaction, in place of second-hand trend-blog attribution)
21. *prefers-reduced-motion* — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — MDN Web Docs, Mozilla — continuously updated — **[primary]** (the squish/overshoot animation in §6 is a vestibular trigger; this is the query the §5 block keys off)
