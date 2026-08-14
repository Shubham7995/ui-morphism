# Liquid Glass tokens — machine-readable

Source of truth: `docs/08-liquid-glass.md` §4 "Anatomy & Design Tokens", with §7 for the
legibility floors, §8 for the budgets and §13 for the intensity contract. Every value in
this file is copied from those sections. Nothing here is derived, rounded or remembered.

| File | What it is |
|---|---|
| `../assets/tokens.css` | The literal `:root` sheet, verbatim from §4, including both dark blocks and both legibility overrides |
| `../assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror plus the `glass`, `glass-rim`, `glass-refract` and `glass-tier-0` utilities, from §5 |
| `../assets/tokens.um-aliases.css` | The `--um-liquid-glass-*` bridge onto the shared grammar |
| `../scripts/displacement-map.mjs` | The one thing in this style that is not a token: the squircle-profile map, generated per component size and inlined as a data URI |

**Polarity.** Light values live on bare `:root`. Dark is written twice — once guarded as
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` so it cannot beat
an explicit light toggle, and once under `:root[data-theme="dark"]` so a manual toggle
beats the OS preference. The legibility overrides come **after** both theme blocks so they
win in either theme. This is the same shape as docs 01, 02, 04, 05, 06, 07, 09 and 10;
glassmorphism is the one dark-first style in the set and this is not it.

**Naming.** The doc ships `--lg-*`. The shared grammar in `00-comparison-matrix.md` §7.1 is
`--um-<style>-<group>[-<variant>]`. Both names appear in every row below. Emit through
`ui-morphism-core:token-emit`, which owns the grammar, the validating regex, the output
formats and the dark-mode emission shape. This plugin owns only the right-hand columns —
the values, and which groups get populated at all.

**One thing is not a token and cannot become one.** SVG filter primitives do not read CSS
custom properties, so the displacement map's geometry — the squircle profile, the band
width in map pixels, the per-channel fringe offset — lives in the generated `<filter>`
markup and only `--lg-refract-scale` is a custom property. That is why this plugin ships a
script where most ship a table.

---

## 1. Surface fill — group `surface`

The material's own `background-color`, sitting above the filtered backdrop and below the
content. **This is the style's primary legibility lever and the only knob whose floor is
solved rather than chosen.**

| Convention name | Doc name | Light value | Dark value | Use |
|---|---|---|---|---|
| `--um-liquid-glass-surface-1` | `--lg-fill` | `rgba(255, 255, 255, 0.62)` | `rgba(28, 28, 30, 0.58)` | The Regular variant, and rung 1 |
| *(no group word — see §14)* | `--lg-fill-clear` | `rgba(255, 255, 255, 0.28)` | `rgba(28, 28, 30, 0.26)` | The Clear variant. Requires a scrim below |

`0.62` is approximately the iOS 27 default floor. iOS 26 shipped at roughly `0.40`, and
that is the number the September 2025 complaints were about.

**Two variants, and they are not two rungs.** **Regular** is the adaptive default: it works
over any content, at any size, with anything layered on top, and needs no dimming layer.
**Clear** is permanently more transparent and Apple restricts it to three conditions
holding *simultaneously* — a media-rich backdrop, a content layer that tolerates dimming,
and bold, bright content on top — with `--lg-scrim` mandatory beneath it. Default to
Regular. A Clear surface with no scrim is a refusal, not a clamp.

## 2. Scrim and tint

| Convention name | Doc name | Light value | Dark value | Note |
|---|---|---|---|---|
| *(no group word)* | `--lg-scrim` | `rgba(0, 0, 0, 0.22)` | `rgba(0, 0, 0, 0.34)` | Mandatory under Clear. It sits BELOW the surface rather than being one |
| *(no group word)* | `--lg-tint` | `rgba(120, 180, 255, 0.10)` | `rgba(120, 180, 255, 0.08)` | Optional brand tint, keep ≤ 0.12 |

The scrim is what makes white text viable under Clear: it pins the backdrop's maximum
luminance, which is the whole reason Apple mandates it. The tint is a layer inside the
material, not the material — above the backdrop, below the content, `pointer-events: none`.

## 3. Optics — groups `blur`, `saturate`

| Convention name | Doc name | Light | Dark | Note |
|---|---|---|---|---|
| `--um-liquid-glass-blur` | `--lg-blur` | `20px` | `24px` | Backdrop gaussian; usable range 12-28px |
| `--um-liquid-glass-saturate` | `--lg-sat` | `180%` | `160%` | Below 140% the material reads as fog rather than glass |
| *(no group word)* | `--lg-bright` | `108%` | `96%` | Compensates for blur's luminance flattening |
| *(no group word)* | `--lg-refract-scale` | `48` | `48` | `feDisplacementMap` scale, unitless; range 0-72 |
| *(no group word)* | `--lg-refract-band` | `16px` | `16px` | Width of the lensed rim |
| *(a composition, not a token)* | `--lg-backdrop` | `blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright))` | same | Re-resolves per element |

`--lg-backdrop` is the mechanism the elevation ladder runs on: it is substituted per
element, so re-pointing `--lg-blur` locally moves the whole filter chain without
redeclaring it.

`--lg-refract-scale` is the single knob that separates this style from glassmorphism.
At 0 there is no lens, no Tier 2, no generated map, and the correct name for what has
been emitted is glassmorphism.

## 4. The intensity curve, resolved

Doc §13's knob table, resolved. The running contract is
`../../../assets/intensity.contract.json`; this is the same thing in prose, for reading.

| Knob | Min | Max | Default | Effect |
|---|---|---|---|---|
| `refractionScale` | 0 | 72 | 48 | `feDisplacementMap@scale`; 0 disables Tier 2 entirely |
| `fillAlpha` | 0.55 | 0.95 | 0.62 | Surface opacity; the floor is a hard clamp, not a suggestion |
| `blurRadius` | 0px | 28px | 20px | Backdrop gaussian |
| `specularOpacity` | 0.00 | 0.90 | 0.55 | Rim highlight peak alpha |
| `saturation` | 100% | 190% | 180% | Backdrop chroma boost |

**`fillAlpha` moves inversely.** Doc §13 heads its columns `Min` and `Max` rather than doc
07's `Min (intensity 0)` / `Max (intensity 100)`, and the sentence under the table states
the inversion outright: higher intensity means thinner glass but never below the 0.55
clamp. So for this knob the Min and Max cells are **bounds**, and the direction of travel
is prose: 0.95 at intensity 0, 0.55 at intensity 100. Doc §5's reference React component is
the tie-breaker and agrees — it documents `intensity` as `0 = flat opaque card, 100 =
maximum refraction and transparency`, and its alpha falls with intensity onto the floor.
Every other knob rises with intensity.

### The formula

Each knob is piecewise linear through three anchors — intensity 0, the stated default at
intensity 60, and intensity 100 — so the default is reachable exactly rather than
approximately:

```
knob(i) = i <= 60 ? START + (DEFAULT - START) * (i / 60)
                  : DEFAULT + (END - DEFAULT) * ((i - 60) / 40)
```

`START` is the value at 0 and `END` the value at 100; for `fillAlpha` those are 0.95 and
0.55 respectively, and for every other knob they are the Min and Max cells in that order.

### Resolved at every ten points

| Intensity | `refractionScale` | `fillAlpha` | `blurRadius` | `specularOpacity` | `saturation` |
|---|---|---|---|---|---|
| 0 | 0 | 0.9500 | 0.000px | 0.0000 | 100.0% |
| 10 | 8 | 0.8950 | 3.333px | 0.0917 | 113.3% |
| 20 | 16 | 0.8400 | 6.667px | 0.1833 | 126.7% |
| 30 | 24 | 0.7850 | 10.000px | 0.2750 | 140.0% |
| 40 | 32 | 0.7300 | 13.333px | 0.3667 | 153.3% |
| **45** | **36** | **0.7025** | **15.000px** | **0.4125** | **160.0%** |
| 50 | 40 | 0.6750 | 16.667px | 0.4583 | 166.7% |
| **60** | **48** | **0.6200** | **20.000px** | **0.5500** | **180.0%** |
| 70 | 54 | 0.6025 | 22.000px | 0.6375 | 182.5% |
| 80 | 60 | 0.5850 | 24.000px | 0.7250 | 185.0% |
| 90 | 66 | 0.5675 | 26.000px | 0.8125 | 187.5% |
| 100 | 72 | 0.5500 | 28.000px | 0.9000 | 190.0% |

The two bold rows are the ones that matter. **60** is the default. **45** is where
`backdropControl: arbitrary` caps, and it is worth reading across: at 45 the fill resolves
to 0.7025, which is above the 0.62 arbitrary-backdrop floor, so the cap satisfies the floor
on its own and the floor never has to be applied as a separate correction. It is recorded
in the audit anyway, because a clamp that changed nothing is evidence that it was checked.

**Doc §13 states no rounding rule for this style**, unlike doc 07's `integer-rounded`, so
nothing is rounded at emit time and the values above ship as the curve produces them.

Reading the table sideways is also informative. Below intensity 30 the saturation is under
140%, which §4 says reads as fog rather than glass — correct, because at that intensity the
blur is small enough that there is little to re-saturate. Above intensity 90 the blur
passes §8's 24px budget, which the skill reports rather than silently clamping, because
the budget is a route-level measurement and not a knob bound. And doc §3 puts the usable
`scale` band at 30-70 for a 56px-tall control, so the top of the `refractionScale` range is
deliberately past what a toolbar should use.

### Hard clamps and context caps

Both tables are in `../SKILL.md` under "Intensity knobs" and in the contract JSON. The two
worth repeating here, because they are the ones a token table tempts you to interpolate
past:

- **`fillAlpha` never goes below 0.55**, and never below 0.62 when the backdrop is
  user-supplied. §7 solves both numbers; see §7 of this file.
- **Under `variant: clear` the ceiling is 0.28**, and the guarantee moves to the scrim.
  The 0.55 clamp is on the Regular fill; Clear is the other variant, not a rung below it.

## 5. Edges — groups `border`, `radius`

| Convention name | Doc name | Light | Dark | Note |
|---|---|---|---|---|
| `--um-liquid-glass-border` | `--lg-border` | `rgba(255, 255, 255, 0.45)` | `rgba(255, 255, 255, 0.16)` | 1px, always present. Never the only affordance |
| `--um-liquid-glass-border-strong` | `--lg-rim` | `rgba(255, 255, 255, 0.85)` | `rgba(255, 255, 255, 0.55)` | The specular arc's bright end, upper-left |
| *(no group word)* | `--lg-rim-dark` | `rgba(255, 255, 255, 0.18)` | `rgba(255, 255, 255, 0.10)` | The arc's dim end, lower-right |
| *(no group word)* | `--lg-inset` | `inset 0 1px 0 rgba(255, 255, 255, 0.60)` | `inset 0 1px 0 rgba(255, 255, 255, 0.22)` | Top bevel |
| `--um-liquid-glass-radius-pill` | `--lg-radius-control` | `999px` | same | Capsule controls |
| `--um-liquid-glass-radius-sm` / `-md` | `--lg-radius-card` | `26px` | same | Cards, concentric with 12px inner padding |
| `--um-liquid-glass-radius-lg` | `--lg-radius-sheet` | `38px` | same | Sheets; matches the iPhone display corner |

**The border is the control boundary; the rim is not.** §7 is explicit: the 1px
`rgba(255,255,255,0.45)` rim almost never reaches 3:1 against an arbitrary backdrop, so the
boundary of the control is not perceivable and icon-only glass buttons fail the same way.
These two values are the resting *appearance*. Where the border delimits an interactive
control, `ui-morphism-core:a11y-validate` must solve it up to 3:1 against the composite and
the correction goes in the audit. That is also the `--lg-target-min: 44px` rationale — the
user is aiming at an edge they cannot reliably see.

Corner geometry is continuous-curvature and concentric with the device or window corner,
not a ladder of arbitrary radii. On macOS 27 Apple *reduced* the window corner radius after
complaints that the 26 radii were cartoonish.

## 6. Depth — group `shadow`

| Convention name | Doc name | Light | Dark | Use |
|---|---|---|---|---|
| `--um-liquid-glass-shadow-2` | `--lg-shadow-ambient` | `0 8px 32px rgba(0, 0, 0, 0.12)` | `0 8px 32px rgba(0, 0, 0, 0.44)` | The single soft ambient layer |
| `--um-liquid-glass-shadow-1` | `--lg-shadow-contact` | `0 1px 2px rgba(0, 0, 0, 0.10)` | `0 1px 2px rgba(0, 0, 0, 0.30)` | Keeps edges from floating |
| `--um-liquid-glass-shadow-inset` | `--lg-inset` | see §5 | see §5 | Top bevel |

Shadow separation, not an elevation stack: one ambient layer, one contact layer, one inner
bevel. There is no multi-step Material elevation ladder in this style, and adding one is
how a scale drifts. `forced-colors: active` strips shadows entirely, which is the second
reason the 1px border is mandatory.

## 7. Foreground — groups `ink`, `accent`

| Convention name | Doc name | Light | Dark | Note |
|---|---|---|---|---|
| `--um-liquid-glass-ink` | `--lg-fg` | `#1C1C1E` | `#F2F2F7` | **10.89:1** over the default fill composite; the dark pair is **8.45:1** |
| `--um-liquid-glass-ink-muted` | `--lg-fg-2` | `rgba(28, 28, 30, 0.62)` | `rgba(242, 242, 247, 0.66)` | Secondary only; verify per surface |
| `--um-liquid-glass-accent` | `--lg-accent` | `#0A84FF` | `#0A84FF` | The single accent; system blue |

**The ink is paired with the fill, not chosen.** These are the numbers doc §7 computes, and
they are the reason this plugin exists:

- **Default fill (α = 0.62) over a mid-grey photo (B = 128).** With `#1C1C1E` ink:
  **10.89:1** — passes AA and AAA for body text. With white text on the *same surface*:
  **1.56:1 — fails everything.** One surface, one backdrop, two foreground colours: one
  clears AAA and the other fails every threshold there is.
- **The iOS 26 shipping floor (α = 0.40) over a dark photo (B = 48).** White text:
  **3.80:1**, which passes 1.4.3 only for large text. `#1C1C1E` ink: **4.48:1**, just under
  the bar. *Neither foreground colour is safe.* That is exactly the failure users reported
  in September 2025, and exactly why Apple raised the floor in iOS 27.
- **The practical rule.** With α ≥ 0.62 and a *known* foreground polarity you clear 4.5:1
  across the full backdrop range 0-255. The bare crossings sit lower and are worth knowing:
  pure black text survives every backdrop from α ≈ 0.4553, and the `#1C1C1E` ink this doc
  actually specifies from α ≈ 0.5145. Both land on the threshold exactly at a black
  backdrop, with no margin for a brand tint, a lighter ink or the rim. **0.55 is the
  shipped floor; 0.62 is the safe default.**

Doc §7 states the compositing model as `C = 255α + B(1-α)` in 8-bit sRGB, with relative
luminance following the standard transfer function. This plugin never evaluates it. Every
ratio in every report comes from `ui-morphism-core:a11y-validate` — one implementation, ten
callers — and the figures above are reproduced from the doc as provenance, not recomputed.

**There is no `danger` group.** §4 declares no error colour: this material carries state in
the content layer, never in the glass, because a state signalled by fill alpha alone is
invisible against half the backdrops it will sit on. The accent is the only hue the
material itself takes.

## 8. Budgets

Doc §8's table, and the rows the audit's Budgets section carries.

| Budget | Target |
|---|---|
| Glass surfaces simultaneously in viewport | ≤ 3 (≤ 2 on mobile) |
| Total glass area | ≤ 25% of viewport |
| Refracting (SVG-filtered) surfaces | ≤ 1 |
| Blur radius | ≤ 24px; every extra 8px is roughly linear extra cost |
| Frame time contribution from glass | ≤ 4ms on a mid-tier device |
| Displacement map asset | ≤ 8KB, inlined as a data URI |
| INP regression vs. opaque baseline | ≤ 20ms |

Two figures from §8 that make the budgets legible rather than arbitrary. **Height is what
costs, not count**: on a 1170×2532 device, three full-width 88px glass bars are three
1170×88 RGBA textures at roughly **0.39 MiB** each — about **1.2 MiB** together — while a
single full-screen 1170×2532 glass sheet is one texture of **11.3 MiB**, more than nine
times all three bars. That is why a full-bleed glass background is the one shape to refuse
outright. And **stacking is multiplicative, not additive**: glass over glass means the
inner element's snapshot includes the outer element's already-filtered output, so two
stacked panels look worse *and* run slower than one.

Cheaper fallbacks in descending fidelity, from §8: blur + saturate + rim gradient (Tier 1)
at roughly 40% of the cost and working in every evergreen browser; a static pre-rendered
blur image behind an opaque-ish fill, at near-zero runtime cost and no adaptivity; a solid
tinted fill at 94-98% opacity with a 1px border and a soft shadow, at zero cost — and
honestly what most dashboards should ship.

## 9. Type and space — groups `text`, `weight`, `leading`, `space`

| Convention name | Doc name | Value |
|---|---|---|
| `--um-liquid-glass-text-xs` … `-2xl` | `--lg-text-xs` … `--lg-text-2xl` | `13 / 15 / 17 / 20 / 28 / 34px` |
| `--um-liquid-glass-weight-min` | `--lg-weight-on-glass` | `600` |
| `--um-liquid-glass-space-1` … `-6` | `--lg-space-1` … `--lg-space-6` | `4 / 8 / 12 / 16 / 24 / 32px` |

iOS-derived, and the two floors are legibility values rather than taste: **17px is the body
minimum on glass** and **500-600 is the weight band**. Never 300 or 400-weight body text
over any translucent surface — thin type disappears into a displaced, blurred backdrop long
before it disappears on an opaque one.

`--lg-space-3` (12px) is the minimum inset from the lensed rim. Text closer than that sits
inside the displacement band and warps with the backdrop.

## 10. Motion — groups `dur`, `ease`

| Convention name | Doc name | Value | Use |
|---|---|---|---|
| `--um-liquid-glass-dur-fast` | `--lg-dur-state` | `180ms` | Hover / active |
| `--um-liquid-glass-dur-base` | `--lg-dur-morph` | `320ms` | Merge / split, sheet present |
| `--um-liquid-glass-dur-slow` | `--lg-dur-settle` | `520ms` | Liquid overshoot |
| `--um-liquid-glass-ease-standard` | `--lg-ease` | `cubic-bezier(0.32, 0.72, 0, 1)` | Apple-sheet-like decelerate |
| `--um-liquid-glass-ease-spring` | `--lg-ease-spring` | `linear(0, 0.35, 0.86, 1.04, 1.01, 1)` | Approximates a 0.8-damping spring |

Full behaviour, the animatable set and the reduced-motion collapse in `motion.md`.

## 11. Focus — group `focus`

§4 declares no focus custom properties; §5 and §7 write the ring literally. These are those
literals promoted to tokens. The group is mandatory in every style
(`00-comparison-matrix.md` §7.3) precisely because `forced-colors` deletes `box-shadow`, so
the ring may never be a `box-shadow` alone.

| Convention name | Value | Source |
|---|---|---|
| `--um-liquid-glass-focus-color` | `var(--lg-accent)` — `#0A84FF` | §5, §7 |
| `--um-liquid-glass-focus-width` | `3px` | §5, §7 |
| `--um-liquid-glass-focus-offset` | `2px` | §5, §7 |
| *(not tokens — see §14)* | `box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.55), 0 0 0 8px rgba(255, 255, 255, 0.9)` | §7 |

**Three concentric rings — accent, dark, light — guarantee at least one edge with ≥ 3:1
against any backdrop.** That is what satisfies 2.4.11 without depending on the surface. The
two halo rings are additive to the outline and are not a substitute for it; do not "fix"
them into a single ring. Under `forced-colors: active` the outline becomes
`3px solid Highlight` and the halos go with the rest of the shadows, which is exactly why
the outline is the ring that carries the criterion.

## 12. Hit target — group `target`

| Convention name | Doc name | Value |
|---|---|---|
| `--um-liquid-glass-target-min` | `--lg-target-min` | `44px` |

Theme-independent, declared once on bare `:root`. SC 2.5.8's floor is 24px, but that floor
presumes a perceivable boundary; the rim at 0.45 alpha rarely clears 3:1 against its
backdrop, so the user is aiming at an edge they cannot see. 44px is also the Apple HIG value
this style descends from. Capsules inside a merged glass bar are what this style tempts you
to shrink — §7 records them rendering at 32-36px — so floor them here.

## 13. The elevation ladder — the binding table

This is the table the emitter walks. **A rung is a fill plus a blur, not a box-shadow
step**: §3 says elevation is carried by the material itself, so there is no shadow ladder
and no `elev` group. To raise a surface, re-point the two base tokens locally and let
`--lg-backdrop` pick the new blur up:

```css
.lg-sheet { --lg-fill: var(--lg-elev-2-fill); --lg-blur: var(--lg-elev-2-blur); }
```

| Rung | Use | Light fill | Dark fill | Light blur | Dark blur |
|---|---|---|---|---|---|
| 1 | Toolbars, tab bars — **the default pair** | `rgba(255, 255, 255, 0.62)` | `rgba(28, 28, 30, 0.58)` | `20px` | `24px` |
| 2 | Sheets, popovers | `rgba(255, 255, 255, 0.72)` | `rgba(28, 28, 30, 0.68)` | `24px` | `28px` |
| 3 | Alerts, menus — nearly opaque | `rgba(255, 255, 255, 0.86)` | `rgba(28, 28, 30, 0.82)` | `28px` | `30px` |

Rung 1 is `--lg-fill` / `--lg-blur` by identity, not by coincidence. The rungs ascend in
opacity as they ascend in importance, which is the opposite of the usual instinct and is
correct: an alert is the surface you least want unreadable.

Every legibility override flattens **all three rungs**, not just the base pair. A surface
that re-points its fill and blur at rung 2 or 3 would otherwise walk straight back through
a rung-blind override — which is a bug that only appears for users who have Reduce
Transparency on, and therefore never appears in review.

## 14. Vocabulary deviations, stated

Groups this style deliberately leaves **empty**:

- **`elev`** — §4 is explicit that there is no shadow ladder. §13 above is the ladder, and a
  parallel `elev` ramp would be a second name for the same three steps.
- **`bg`** — this is a chrome material. The content layer beneath it belongs to whatever
  system already owns the page, and §12 names doc 05's `--min-*` tokens as the ones to
  reach for there. Glass all the way down is unreadable.
- **`font`** — §4 fixes a type scale and a weight floor but names no families; the recipes
  use `system-ui`, which is the point on Apple platforms.
- **`tracking`** — §4 ships no letter-spacing values.
- **`noise`** — this material has no grain layer. Its texture is optical, not granular, and
  a noise overlay reads as a dirty lens.
- **`danger`**, and every accent beyond the first — see §7.

Concepts with **no group word in the closed vocabulary** (`00-comparison-matrix.md` §7.3),
which therefore keep their `--lg-*` names and are consumed directly. Core's rule is that a
concept with no entry gets a value with a comment, not a twenty-third group and not an
invented variant. Each is still validated by `ui-morphism-core:a11y-validate`; an alias is a
naming convenience, not the thing that makes a value safe.

| Token | Why it has no group |
|---|---|
| `--lg-bright` | A term in a filter chain, not a surface property |
| `--lg-backdrop` | A composition of three tokens, not a token |
| `--lg-refract-scale` | An SVG filter-primitive attribute, unitless by necessity |
| `--lg-refract-band` | The geometry of an effect, not of a box |
| `--lg-fill-clear` | The other *variant*, not a rung above or below Regular |
| `--lg-scrim` | Sits below the surface rather than being one |
| `--lg-tint` | A layer inside the material, not the material |
| `--lg-rim` / `--lg-rim-dark` | A highlight; `border` is the boundary |
| `--lg-elev-{1,2,3}-{fill,blur}` | Fill+blur pairs — see `elev` above |
| The two focus halo rings | `focus` is colour, width and offset; the halos are a fourth thing, and they live in the focus recipe in `recipes.md` §5 |

Everything else maps one-to-one.
