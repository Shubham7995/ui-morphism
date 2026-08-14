# Neumorphism tokens — machine-readable

Source of truth: `docs/02-neumorphism.md` §4 (token table and the two ready-to-paste
blocks), §7 (contrast figures), §8 (budgets), §13 (intensity knobs). Every number
below is copied from those sections. Nothing here is derived from memory, and nothing
here overrides the doc. If a value in this file and a value in the doc disagree, the
doc is right and this file is stale.

No contrast ratio in this file was computed here. Every one is quoted from §4 or §7,
and the thing that decides pass or fail on emitted output is
`ui-morphism-core:a11y-validate`. This plugin contains no contrast arithmetic; there is
exactly one implementation in the marketplace and it is core's.

Ready-to-paste artefacts live next door in `../assets/`:

| File | What it is |
|---|---|
| `assets/tokens.css` | The `:root` + both dark blocks, verbatim from doc §4's first block |
| `assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror, from doc §5 |
| `assets/tokens.um-aliases.css` | `--um-neumorphism-*` bridge onto the shared grammar |

## 0. Two name spaces, one set of values

The style's own prefix is `--nm-*`. The shared grammar that
`ui-morphism-core:token-emit` consumes is `--um-<style>-<group>[-<variant>]`, specified
in `docs/00-comparison-matrix.md` §7. Both are emitted: `--nm-*` carries the literal
values, `--um-neumorphism-*` aliases onto them. Ask `token-emit` for the
`--um-neumorphism-*` set; ship `assets/tokens.css` alongside it so the aliases resolve.

Groups this style populates: `bg`, `surface-1`, `ink`, `border`, `border-strong`,
`accent`, `danger`, `radius`, `shadow`, `space`, `font-body`, `text`, `dur`, `ease`,
`focus`, `target`.

Groups it deliberately does not populate, with the doc's reason:

| Group | Why not |
|---|---|
| `blur` | §4: "backdrop blur has no token at all, because neumorphism has no translucency — if you are blurring a backdrop you are doing glassmorphism." The shadow's own blur is geometry, carried by `--nm-b-*`. |
| `saturate` | No `backdrop-filter` exists in this style. |
| `noise` | No grain layer. §8 puts additional asset weight at 0 bytes. |
| `elev` | Elevation *is* the distance/blur rung, so the shadow ladder is the elevation ladder. §10 also caps the material: "neumorphism cannot express more than about two depth levels legibly." |
| `accent-subtle` | §3 item 11: one saturated element per screen. A desaturated tint on a same-hue surface is the surface. |
| `font-display`, `font-mono` | §4: "One family for the whole style." |
| `weight`, `leading`, `tracking` | §4 writes these as literals on purpose — 500 body / 600 label / 700 display, 1.5 body / 1.2 display. "The floor is a rule to enforce in review, not a dial to expose." |
| `surface-2` … `surface-4` | The style has exactly one plane. A second ascending surface colour is the one thing it may not have. |
| `shadow-4`, `shadow-5` | The raised ramp is three rungs. `--nm-d-xl` / `--nm-b-xl` exist as geometry for page-scale slabs, but §4 composes no shadow from them. |

Six tokens have no home in the closed vocabulary and keep their `--nm-*` names:
`--nm-surface-sunken` (a well descends; `surface-N` ascends), `--nm-flat` (the named
zero rung), `--nm-convex` / `--nm-concave` (shape states, not colours), and the raw
`--nm-d-*` / `--nm-b-*` ramp that the intensity knob moves.

## 1. Colour

Ratios are the doc's, against the surface of the same mode.

| Token | Light | Dark | Ratio vs surface | Note |
|---|---|---|---|---|
| `--nm-surface` | `#e6e7ee` | `#2a2e39` | — | Page background **and** element fill. Must be identical for element and parent. |
| `--nm-surface-sunken` | `#dfe0e8` | `#24272f` | — | Large wells only, never controls — a sunken control loses the same-hue illusion. |
| `--nm-shadow-light` | `#ffffff` | `#3d4353` | **1.23:1** / **1.37:1** | Highlight. Decorative. Never sufficient alone. |
| `--nm-shadow-dark` | `#b8b9be` | `#17191f` | **1.59:1** / **1.30:1** | Cast shadow. Decorative. Never sufficient alone. |
| `--nm-hairline` | `#7c7f93` | `#767d92` | **3.20:1** / **3.31:1** | The boundary that actually satisfies SC 1.4.11. Not optional. |
| `--nm-text` | `#33364d` | `#e8eaf2` | **9.59:1** / **11.29:1** | Body text, AAA. |
| `--nm-text-mut` | `#5a5e77` | `#a7adc2` | **5.16:1** / **6.07:1** | Muted text, AA normal. |
| `--nm-accent` | `#4c5bd4` | `#8f9dff` | **4.54:1** / **5.45:1** | Clears 4.5:1 text and 3:1 non-text. The state carrier. |
| `--nm-accent-ink` | `#ffffff` | `#141722` | — | Text and icons on an accent fill. |
| `--nm-danger` | `#b3261e` | `#ff9a92` | — | Destructive only; verify per surface. |

**The two shadow figures are the whole argument of this plugin.** The generator default
is no better: `#e0e0e0` against `#bebebe` is **1.41:1** and against `#ffffff` is
**1.32:1**. Every neumorphic shadow pair in normal use lands between **1.2:1** and
**1.7:1** — roughly half of the 3:1 that SC 1.4.11 requires. §7 states the boundary
condition exactly: to reach 3:1 on `#e6e7ee` the boundary colour must be at or below
`#848484` (**3.03:1**), and `#858585` is the first grey that fails at **2.99:1**; on
`#e0e0e0` the threshold is `#7d7d7d` (**3.12:1**) and `#808080` fails at **2.99:1**.
The recommended `#7c7f93` clears it at **3.20:1**.

There is no combination of blur, distance or luminance delta that gets a same-hue
shadow to 3:1 while still looking neumorphic. The shadow cannot be the affordance.

## 2. Geometry, shadow, type, space, motion

| Token | Value | Note |
|---|---|---|
| `--nm-d-xs` / `--nm-b-xs` | `3px` / `6px` | 24–32px controls. |
| `--nm-d-sm` / `--nm-b-sm` | `5px` / `10px` | Default: buttons, chips, inputs. The rung the intensity knob moves. |
| `--nm-d-md` / `--nm-b-md` | `8px` / `16px` | Cards, panels. |
| `--nm-d-lg` / `--nm-b-lg` | `14px` / `28px` | Hero / feature surfaces. |
| `--nm-d-xl` / `--nm-b-xl` | `20px` / `40px` | neumorphism.io's initial value; page-scale slabs only. |
| `--nm-r-ctl` / `-card` / `-slab` / `-pill` | `14px` / `24px` / `36px` / `999px` | Generator default radius is size / 6. |
| `--nm-raised-sm` / `-md` / `-lg` | composed from `--nm-d-*`, `--nm-b-*` and the two shadow colours | Dark offset first, light offset second, spread omitted. |
| `--nm-pressed-sm` / `-md` | `inset 3px 3px 6px` / `inset 5px 5px 10px`, both colours | Literal offsets, not `var()`. See §3 below. |
| `--nm-flat` | `0 0 0 0 transparent` | The named zero rung. Animate to and from this, never to `none`, which is not interpolable. |
| `--nm-convex` / `--nm-concave` | `linear-gradient(145deg, …)` and the same stops reversed | `145deg` matches light source 1 (top-left). |
| `--nm-t-press` / `-hover` / `-morph` | `120ms` / `180ms` / `240ms` | |
| `--nm-e-in` / `--nm-e-out` | `cubic-bezier(0.4, 0, 1, 1)` / `cubic-bezier(0.16, 1, 0.3, 1)` | Press in: fast start, hard stop. Release: settle without overshoot. |
| `--nm-target-min` | `44px` | Above SC 2.5.8's 24px floor on purpose — see §4 below. |
| `--nm-font` | `"Inter", "SF Pro Text", system-ui, -apple-system, "Segoe UI", sans-serif` | One family for the whole style. |
| `--nm-fs-100` … `--nm-fs-700` | `12 / 14 / 16 / 20 / 24 / 32 / 44 px` | Seven steps, 1.25 ratio, 16px base at `--nm-fs-300`. No others. |
| `--nm-sp-1` … `--nm-sp-8` | `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px` | Eight steps, 4px base. No others. |

**Three relations that are applied when a value is written, and are not properties.**

- **`blur = 2 × distance`, at every rung.** The generator's own slider handler enforces
  it. Ratios far from 2:1 read as a hard drop shadow below 1.5× or as fog above 4×.
  §13 anti-pattern 9 refuses and clamps anything outside `[1.5, 3.0]`.
- **The pressed rungs are `0.6 × the raised distance`.** Pressed depth reads deeper
  than it measures, so `--nm-pressed-sm` is 3px against `--nm-d-sm`'s 5px and
  `--nm-pressed-md` is 5px against `--nm-d-md`'s 8px. §4: CSS cannot round a `calc()`
  to the whole pixels this effect needs, so a ratio property would have no consumer.
- **The gradient stops are `+7% / −10%` luminance.** Asymmetric on purpose: a highlight
  against a light field reads weaker than an equal-magnitude shadow. It is the rule
  that produced the literal stops in `--nm-convex` and `--nm-concave`.

**Two quantities that are review constraints rather than tokens.** Surface chroma is
capped at `≤ 0.03` OKLCH light and `≤ 0.035` dark — CSS cannot clamp a chroma channel,
and accents are exempt, so a single token could not express it. And the minimum gap
between extruded siblings is `2 × distance + blur / 2` — 16px at `sm`, 24px at `md` —
which depends on which rung each neighbour uses and so resolves differently in
different places. Use the `--nm-sp-*` step that clears it.

**Spread is `0` and is not a token.** Spread grows the shadow's own silhouette away
from the element, which breaks the same-hue illusion at any non-zero value, so every
composed shadow omits the component rather than routing a zero through a property
someone could override.

## 3. Deriving the two shadow colours

§4 ships two derivations and they are alternatives, not layers.

**The hex block** (`assets/tokens.css`) is the default and the fallback. It is
neumorphism.io's algorithm, `c' = clamp(0, round(c + c × lum), 255)` per channel with
`lum = ±0.15`, evaluated once and written down. From `#e0e0e0` that is the famous
`#ffffff` / `#bebebe` pair exactly.

**Its two failure modes, from §4.** The model is *multiplicative*, so on dark bases the
delta collapses — `#2a2e39 × 0.15` moves red by six levels — and `lum` has to rise to
roughly 0.40–0.50 in dark mode for a comparable read. And it clips: any base above
about `#dedede` pushes the highlight to pure white and silently loses the top half of
the effect.

**The perceptual block** is §4's fix, and it is the second `css` fence in that section.
It is quoted here rather than shipped in `assets/`, because it re-declares
`--nm-surface`, `--nm-shadow-light` and `--nm-shadow-dark` as `oklch()` and would
override the hex block if the two were concatenated:

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

The `0.8 / 1.4` asymmetry compensates for the highlight reading weaker than an
equal-magnitude shadow. **In dark mode invert it to `1.4 / 0.8`.** Ship the hex block
as the `@supports not (color: oklch(0 0 0))` fallback if you support older engines.

Which one to emit: the perceptual block when the user supplies a base colour, because
it is the one that survives a dark base and a near-white base; the hex block when the
user takes the defaults, because it is the block §4 ships and the one every downstream
contrast figure was measured against.

## 4. Intensity → knobs

Curves are from §13, and the machine-readable copy is
`${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json`. That file is what runs; this
table is the same contract in prose, for reading. Default intensity is **45**, the
lowest default in the set alongside bento — because coverage above roughly 0.6
collapses hierarchy, and this style stops distinguishing planes before it stops looking
like itself.

| Knob | 0 | 45 (default) | 100 | Unit |
|---|---|---|---|---|
| `shadowDelta` | 0.03 | 0.075 | 0.14 light / 0.20 dark | OKLCH L offset (`--nm-delta`) |
| `distance` | 2px | 5px | 20px | px at the `sm` rung; blur derives as 2× |
| `radius` | 6px | 14px | 999px (pill) | px, control |
| `hairlineOpacity` | 0.55 | 1.0 | 1.0 | alpha |
| `coverage` | 0.05 | 0.35 | 1.0 | fraction of interactive elements treated |

Resolved, every five points. Read the row; do not recompute. `distance` is
integer-rounded at emit time and `blur` is always twice the rounded distance, so the
two columns are the pair that ships.

| intensity | shadowDelta (light) | distance | blur | radius | hairlineOpacity | coverage |
|---|---|---|---|---|---|---|
| 0 | 0.030 | 2px | 4px | 6px | 0.55 | 0.05 |
| 5 | 0.035 | 2px | 4px | 7px | 0.60 | 0.08 |
| 10 | 0.040 | 3px | 6px | 8px | 0.65 | 0.12 |
| 15 | 0.045 | 3px | 6px | 9px | 0.70 | 0.15 |
| 20 | 0.050 | 3px | 6px | 10px | 0.75 | 0.18 |
| 25 | 0.055 | 4px | 8px | 10px | 0.80 | 0.22 |
| 30 | 0.060 | 4px | 8px | 11px | 0.85 | 0.25 |
| 35 | 0.065 | 4px | 8px | 12px | 0.90 | 0.28 |
| 40 | 0.070 | 5px | 10px | 13px | 0.95 | 0.32 |
| **45** | **0.075** | **5px** | **10px** | **14px** | **1.00** | **0.35** |
| 50 | 0.081 | 6px | 12px | 16px | 1.00 | 0.41 |
| 55 | 0.087 | 8px | 16px | 18px | 1.00 | 0.47 |
| 60 | 0.093 | 9px | 18px | 20px | 1.00 | 0.53 |
| 65 | 0.099 | 10px | 20px | 22px | 1.00 | 0.59 |
| 70 | 0.105 | 12px | 24px | 24px | 1.00 | 0.65 |
| 75 | 0.110 | 13px | 26px | 27px | 1.00 | 0.70 |
| 80 | 0.116 | 15px | 30px | 30px | 1.00 | 0.76 |
| 85 | 0.122 | 16px | 32px | 33px | 1.00 | 0.82 |
| 90 | 0.128 | 17px | 34px | 36px | 1.00 | 0.88 |
| 95 | 0.134 | 19px | 38px | 36px | 1.00 | 0.94 |
| 100 | 0.140 | 20px | 40px | 999px | 1.00 | 1.00 |

Three readings of that table that matter:

- **`radius` walks the style's own rungs.** 14px control at the default, 24px card at
  70, 36px slab at 90, and the 999px pill only at exactly 100 — because the pill is a
  *snap*, not a size. neumorphism.io's radius slider snaps to 50% at its maximum (§11),
  and interpolating between 36px and 999px would produce radii no rung in §4 names.
- **`hairlineOpacity` rises and then holds.** It reaches 1.0 at the default and stays
  there for the whole top half of the range. The floor of 0.55 at intensity 0 is §13's
  hard clamp, and it is the lowest value that still resolves ≥ 3:1 after alpha
  compositing. It is the floor, not a licence: whatever opacity resolves, the
  *composited* hairline goes to `ui-morphism-core:a11y-validate` against the actual
  surface, and if the composite does not clear 3:1 the skill raises the opacity or
  darkens `--nm-hairline` and records the correction.
- **`distance` crosses the budgets before it crosses its own ceiling.** At 55 the blur
  is 16px, which is §8's ceiling for list and grid items; at 65 it is 20px; at 100 it
  is 40px, which is §8's absolute maximum. Anything inside a scroller is clamped to
  24px of blur — 12px of distance — regardless of intensity.

**What the knobs write.** Six custom properties change on the root element; nothing in
`assets/tokens.css` is edited.

```css
[data-nm-root] {
  --nm-delta: <shadowDelta>;
  --nm-d-sm: <distance>;   --nm-b-sm: <2 × distance>;
  --nm-r-ctl: <radius>;
  --nm-hairline: color-mix(in oklch, <hairline> <hairlineOpacity × 100>%, var(--nm-surface));
}
```

The other rungs follow `--nm-d-sm` by §4's own proportions — xs is 0.6×, md is 1.6×,
lg is 2.8×, xl is 4× — each rounded to integer px with blur recomputed as twice the
rounded distance, never scaled independently.

**Intensity 0 is not nothing.** It is a flat, bordered, fully usable control: the
hairline at **3.20:1**, ink at **9.59:1**, a 3px accent outline at 3px offset, and a
44px target, with the extrusion dialled out rather than the structure removed. §12
names minimalism as this style's default host and describes the 2026 shipping
configuration as a flat information layer with neumorphism on a bounded control
cluster; intensity 0 is that host with the cluster switched off. It is also exactly
what every forced-colors user sees, which makes it the one rung guaranteed to be
tested.

**Intensity 100 still has to pass the floor.** If a resolved value fails, clamp it,
ship the clamp, and record it in §5 Corrections of the report. Never ship a failing
pair to satisfy a number.

## 5. Hard clamps, independent of intensity

These do not move at any intensity, in any scope, for any user request.

| Clamp | Value | Source |
|---|---|---|
| Shadow blur | exactly `2 × distance`; refuse and clamp outside `[1.5, 3.0]` | §3, §13 |
| Shadow spread | exactly `0` | §4, §8, §13 |
| Pressed distance | `0.6 ×` the raised distance | §4, §6 |
| Shadow layers per element | 2, and 4 only for the pseudo-element cross-fade | §8, §13 |
| Blur ceiling | 40px; ≤ 24px inside a scroller; ≤ 16px on list/grid items | §8 |
| Non-shadow boundary | every interactive element has one at ≥ 3:1 | §7, §13 |
| `hairlineOpacity` floor | 0.55, hard-clamped; 0 is never exposed | §13 |
| Focus indicator | `outline` ≥ 3px at ≥ 3px offset, never `box-shadow` | §7 |
| Target size | `--nm-target-min` 44px, hard floor 24×24 CSS px | §7 |
| Same-hue invariant | element background token equals its parent's, ΔL ≤ 0.02 OKLCH | §3, §13 |
| Light source | one global value for the document | §3, §13 |
| Sibling gap | `2 × distance + blur / 2` | §3, §10 |
| Ink floor | no text token below 4.5:1 | §7, §13 |
| Elements per route | warn above 12 in the initial viewport, fail above 24 | §8, §13 |
| Surface chroma | ≤ 0.03 OKLCH light, ≤ 0.035 dark | §4 |

## 6. Context caps and clamps, which override intensity

| Context | Effect |
|---|---|
| `contentDensity: dense` | Caps intensity at **0**. §9 lists admin consoles, analytics dashboards with tables, CRMs, email clients and IDEs under "do not use it when"; §13 anti-pattern 11 refuses whole-page application on a route with a `<table>`, a virtualised list, or more than 24 interactive elements. |
| `theme: dark` | `shadowDelta` ceiling moves from 0.14 to 0.20, and the `0.8 / 1.4` asymmetry inverts to `1.4 / 0.8`. |
| `surface: list-or-grid-item` | `distance ≤ 8px`, because §8 caps blur on list and grid items at 16px. |
| `surface: inside-scroller` | `distance ≤ 12px`, because §8 caps blur inside a scroller at 24px. |
| `scope: controls` | `coverage ≤ 0.35`. The doc's default scope is `controls+cards`. |
| `a11yMode: strict` (default) | `hairlineOpacity` pinned to 1.0. §13: strict "refuses any output that fails 1.4.11". |
| `prefers-reduced-motion: reduce` | Runtime, not a cap: durations collapse, state changes stay. |
| `prefers-reduced-transparency: reduce` | Runtime: single 2px/6px shadow, hairline raised to 4.5:1. §6 honours it as a proxy for "plainer surfaces" even though the style has no translucency. |
| `forced-colors: active` | Runtime: every shadow is deleted by the user agent. The `@media` block is what puts the structure back. |

Report every cap and clamp that fired in the audit's Corrections section, with the
requested value and the applied value — including the ones that changed nothing.

## 7. Converting an existing shadow

§13 step 4: replace `shadow-*` / `elevation` / `box-shadow` declarations with the
neumorphic pair. The rule, stated so two runs agree:

```
distance = round( max(|offset-x|, |offset-y|, blur / 2) )
```

then snap `distance` to the nearest rung of `{3, 5, 8, 14, 20}`, emit
`d d 2d <dark>, -d -d 2d <light>`, force the element's background to `--nm-surface`,
and add the hairline border. Worked examples:

| Input | distance | Rung |
|---|---|---|
| `0 1px 2px rgb(0 0 0 / .06)` | 1 | `--nm-raised-sm` at `xs` (3px) |
| `0 4px 12px rgb(0 0 0 / .15)` | 6 | `--nm-raised-sm` (5px) |
| `0 10px 20px rgb(0 0 0 / .12)` | 10 | `--nm-raised-md` (8px) |
| `0 20px 40px -12px rgb(0 0 0 / .25)` | 20 | `--nm-raised-lg` (14px) — 20px is slab scale and §10 warns against putting it on a control |
| `inset 0 2px 4px rgb(0 0 0 / .2)` | 2 | `--nm-pressed-sm` — inset maps to inset |
| Material `elevation: 4` | — | **No equivalent.** §12: Material casts one key plus one ambient shadow in a neutral colour onto a *different-coloured* surface. You cannot express neumorphism in Material 3 elevation tokens; override them, do not translate them. |

Two things the conversion always does, and they are not optional. The element's
background becomes the surface token — a neumorphic shadow on a card whose fill differs
from the page is a soft drop shadow wearing a costume (§10), and §13 anti-pattern 4
refuses it. And the element gets the hairline, because the shadow it just received is
between **1.2:1** and **1.7:1** and cannot be the boundary.

## 8. Budgets to report

| Item | Budget | Source |
|---|---|---|
| Neumorphic elements in the initial viewport | ≤ 12; fail above 24 | §8, §13 |
| Shadow layers per element | 2 (4 only for the pseudo-element cross-fade) | §8 |
| Max blur radius | 40px; ≤ 24px inside a scroller | §8 |
| Blur on list/grid items | ≤ 16px | §8 |
| Elements animating a shadow simultaneously | ≤ 4 | §8 |
| Paint time per frame, 4× CPU-throttled | ≤ 4ms | §8 |
| Long-animation-frame budget | no LoAF > 50ms attributable to paint during hover or press | §8 |
| Additional asset weight | **0 bytes** — no images, no fonts, no scripts | §8 |
| CSS delta for the token layer plus components | ≈ 3–5 KB before gzip | §8 |

The cheap fallbacks, in descending fidelity, are §8's own and are named rather than
invented: a single-layer approximation that keeps the highlight; border plus one soft
shadow, which reads "soft" and passes SC 1.4.11 on its own; hairline only, for
virtualised lists; and a static 9-slice or pre-baked SVG, worth it only when the same
shape repeats 50+ times and never animates.
