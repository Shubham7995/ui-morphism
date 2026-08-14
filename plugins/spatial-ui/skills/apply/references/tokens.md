# Spatial UI tokens — machine-readable

Source of truth: `docs/10-spatial-ui.md` §4 (token table and ready-to-paste block), §7
(accessibility and the alpha derivations), §8 (budgets), §13 (intensity knobs). Every
number below is copied from those sections. Nothing here is derived from memory, and
nothing here overrides the doc. If a value in this file and a value in the doc disagree,
the doc is right and this file is stale.

Ready-to-paste artefacts live next door in `../assets/`:

| File | What it is |
|---|---|
| `assets/tokens.css` | The `:root`, both dark blocks and the three preference blocks, verbatim from doc §4 |
| `assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror, from doc §5 |
| `assets/tokens.um-aliases.css` | `--um-spatial-*` bridge onto the shared grammar |

## 0. Two name spaces, one set of values

The style's own prefix is `--sp-*`. The shared grammar that `ui-morphism-core:token-emit`
consumes is `--um-<style>-<group>[-<variant>]`, specified in
`docs/00-comparison-matrix.md` §7. Both are emitted: `--sp-*` carries the literal values,
`--um-spatial-*` aliases onto them. Ask `token-emit` for the `--um-spatial-*` set; ship
`assets/tokens.css` alongside it so the aliases resolve.

Groups this style populates: `bg`, `surface`, `ink`, `border`, `border-strong`, `radius`,
`shadow`, **`elev`**, `blur`, `saturate`, `space`, `text`, `weight`, `tracking`, `dur`,
`ease`, `focus`, `target`.

`elev` is the group this style exists to fill. Core's `group-vocabulary.md` defines it as
depth *level* — semantic rather than visual — and says outright that it "maps to a shadow
step in flat styles and to a `translateZ` step in `spatial-ui`". This is that style.
`--um-spatial-elev-N` is a distance on the z axis; `--um-spatial-shadow-N` is the shadow
pair that accompanies it; `--sp-k-N` is the counter-scale that cancels the growth. All
three move together.

Groups it deliberately does not populate, with the doc's reason:

| Group | Why not |
|---|---|
| `accent` | §3 and §4 name no action hue. The environment is deliberately low-chroma "so glass reads", and depth is the hierarchy channel. An accent competes with the thing the style ranks by. A host app's brand colour rides on top; this style does not supply one. |
| `danger` | Same reason. Error semantics come from the host system, not from a room. |
| `noise` | No grain layer. The material is blur plus saturation plus a 1px specular rim. |
| `font` | §4 states weights, sizes and tracking and no family stacks. Three invented stacks would be a typeface opinion the research does not have. |
| `leading` | §5 sets `line-height: 1.55` on one recipe class; it is not in the §4 token set. |
| `shadow-inset` | Depth here is in front of the surface, never carved into it. Carved is neumorphism, and §12 calls that pairing a direct contradiction. |
| `shadow-press` | §6's pressed state is a z change (`n → n−1`, floor 0) with the contact shadow tightened 40%, not a separate stacked shadow token. |

Tokens with no home in the closed group vocabulary keep their `--sp-*` names and are
consumed directly: `--sp-perspective`, `--sp-perspective-origin`, `--sp-comfort-width`,
`--sp-comfort-width-desk`, `--sp-z-push`, `--sp-k-1` … `--sp-k-5`, `--sp-ink-3`,
`--sp-panel-opaque`, `--sp-target-gaze`, `--sp-target-floor`, `--sp-orbiter-offset`,
`--sp-parallax-translate`, `--sp-parallax-tilt`.

## 1. The camera and the ladder

| Token | Value | Note |
|---|---|---|
| `--sp-perspective` | `1200px` | Web analogue of Android XR's 1.75 m spawn distance. 800px is punchy, 2400-4000px restrained. |
| `--sp-perspective-origin` | `50% 42%` | Android XR places the panel centre 5° below eye level. |
| `--sp-comfort-width` | `1413px` | The 41° content cone at a 500 mm viewing distance: `2 × 500 × tan(20.5°) ≈ 374 mm`. A defensible max-width, not a round number off a grid. |
| `--sp-comfort-width-desk` | `1693px` | The same cone at 600 mm. |
| `--sp-z-0` … `--sp-z-5` | `0.1 / 16 / 24 / 32 / 40 / 56 px` | Android XR `SpatialElevationLevel`, dp mapped 1:1 to px. `--sp-z-0` is a sentinel that forces a stacking context, not a distance. |
| `--sp-z-push` | `-125px` | Android XR `SpatialDialog` pushes the parent panel back by this much when a dialog opens. |
| `--sp-k-1` … `--sp-k-5` | `0.98667 / 0.98000 / 0.97333 / 0.96667 / 0.95333` | `1 − z / perspective` at 1200px. Emitted as literals; re-derived whenever the ladder or the camera moves. |

**Rung assignment does not change with intensity.** Orbiters and floating chrome sit at
level 1, raised panels at 2, popovers and menus at 3, sheets at 4, modal dialogs at 5.
That is §3's and §5's assignment and it is fixed; what intensity changes is how far apart
the rungs are, not which rung a component sits on.

**Why the ladder is not a `calc()`.** 16 / 24 / 32 / 40 / 56 is 8px × 2, 3, 4, 5, 7 — it
skips 6. It is not a uniform series, it is a set of dp values from Android XR, and a
`calc(N × unit)` rewrite would invent a regularity the source does not have and cut the
values loose from their provenance. §13 states this explicitly.

## 2. Surfaces, material and ink

| Token | Light | Dark | Note |
|---|---|---|---|
| `--sp-env` / `--sp-env-2` | `#e8eaf0` / `#dfe2ea` | `#0b0c10` / `#131620` | The room. Low chroma so the glass has something neutral to sample. |
| `--sp-panel` | `rgba(255, 255, 255, 0.72)` | `rgba(22, 24, 30, 0.72)` | The default panel. 0.72 already clears 4.5:1 against `--sp-ink-1` over *any* backdrop: 9.53:1 light and 6.52:1 dark, worst case. |
| `--sp-panel-legible` | `rgba(255, 255, 255, 0.92)` | `rgba(22, 24, 30, 0.90)` | For text over arbitrary imagery: 15.87:1 light, 12.37:1 dark, worst case. |
| `--sp-panel-opaque` | `#f7f8fb` | `#15171d` | The `prefers-reduced-transparency` / `forced-colors` mirror. |
| `--sp-hairline` | `rgba(16, 16, 20, 0.12)` | `rgba(255, 255, 255, 0.16)` | 1px edge so panels read at glancing angles. **Decorative** — see §3 below. |
| `--sp-specular` | `rgba(255, 255, 255, 0.65)` | `rgba(255, 255, 255, 0.28)` | 1px top-edge highlight. |
| `--sp-blur` / `--sp-blur-strong` | `24px` / `40px` | same | Matches the perceptual weight of system glass. |
| `--sp-saturate` | `165%` | `150%` | Gaussian blur averages colour toward grey; this is what stops the refraction going dead. |
| `--sp-ink-1` / `-2` / `-3` | `#101014` / `#43464f` / `#6b6f7b` | `#f5f6fa` / `#b9bdc9` / `#868b98` | The three visionOS vibrancy tiers. |

## 3. The alphas, and why they are what they are

This is the section to read before touching a panel fill. **Nothing in this plugin computes
a contrast figure** — `ui-morphism-core:a11y-validate` owns the one implementation and
every number below is doc §7's, quoted so it can be recognised on sight.

The model matters more than any single number. A browser composites a translucent fill in
**gamma-encoded sRGB, one 8-bit channel at a time** — `C = α·C_fill + (1−α)·C_backdrop` on
each of R, G and B — and only then is the composite linearised and reduced to a luminance.
Averaging the two luminances instead is not an approximation; it is a different and
consistently **optimistic** model, and §7 measures it overstating a light fill on a dark
ground by roughly three times. Any figure derived that way is on the refusal list.

**Dark glass, light text, worst-case white backdrop:**

| α | Against pure white text | Against `--sp-ink-1` dark (`#f5f6fa`) |
|---|---|---|
| 0.585 | 4.497:1 — **fails**. This is the round-up trap: it is not "4.5:1". | — |
| 0.62 | 5.06:1 | 4.68:1 |
| 0.72 (`--sp-panel`) | 7.20:1 | 6.66:1 |
| 0.83 | 10.76:1 | 9.96:1 |
| 0.90 (`--sp-panel-legible`) | — | 12.69:1 |

The exact 4.5:1 crossing against pure white text is α = 0.5853; against the ink actually
paired with dark glass it is α = 0.6083. So the floor for an uncontrolled backdrop is
**α ≥ 0.62**, not 0.83. The 0.72 default is not the compromise it looks like: against pure
white text it already clears AAA, and against the real ink it reaches 6.66:1, where AAA
would need α ≥ 0.7336.

**Light glass, dark text, worst-case black backdrop.** This is where luminance-averaging
does real damage:

| α | Against `--sp-ink-1` light (`#101014`) |
|---|---|
| 0.20 | 1.50:1. The averaging model claims 4.52:1 for exactly this case — a third of the contrast someone believed they had. |
| 0.40 | 3.31:1 — large text only, never body copy. |
| 0.483 | 4.495:1 — **still fails**. The crossing is α = 0.4833; α = 0.484 reaches 4.51:1. |
| 0.60 | 6.66:1 |
| 0.72 (`--sp-panel`) | 9.53:1 |
| 0.92 (`--sp-panel-legible`) | 15.87:1 |

Light glass is the more forgiving polarity, but its floor is **α ≥ 0.49**, not 0.20. Keep
**α ≥ 0.60** for light glass carrying body copy — below that the backdrop imagery stays
legible *through* the text, a real failure the ratio does not capture — and raise to 0.92
over photography.

**The hairline is decorative and the doc says so.** `rgba(16,16,20,0.12)` over a white
panel measures **1.29:1**. If a panel edge is the sole indicator of a control boundary it
needs ≥ 3:1, and that means `rgba(16,16,20,0.45)` at **3.05:1** — `0.42` reaches only
**2.79:1** and fails. Both of those are per-channel composites, not averaged luminances.
`--um-spatial-border-strong` exists for exactly this case; §7 states the light-panel alpha
and no dark counterpart, so the bridge resolves it to the tier-2 ink in both themes rather
than inventing one.

Never round a ratio up through its threshold. 4.497:1 fails 4.5:1; 2.96:1 fails 3:1.

## 4. Intensity → knobs

Curves are from §13, and the contract that runs them is
`${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json`. Default is **55**.

```
perspective(t)  = piecewise-linear through (0, 4000), (55, 1200), (100, 800)   # emitted as `none` at exactly 0
depthScale(t)   = piecewise-linear through (0, 0.25), (55, 1), (100, 2)
parallaxPx(t)   = piecewise-linear through (0, 0), (55, 12), (100, 24)         # hard-clamped at 12
parallaxDeg(t)  = parallaxPx(t) / 3                                            # hard-clamped at 4
panelAlpha(t)   = piecewise-linear through (0, 1.00), (45, 0.72), (55, 0.62), (100, 0.55)
panelBlur(t)    = piecewise-linear through (0, 0), (55, 24), (100, 48)
shadowAlpha(t)  = piecewise-linear through (0, 0.4), (55, 1), (100, 1.6)
shadowBlur(t)   = piecewise-linear through (0, 0.6), (55, 1), (100, 1.4)
```

Resolved, every five points, with the emit-time rounding applied and the pointer-parallax
clamp shown. Read the row, do not recompute. The alpha column is the *uncapped* curve:
`backdropControl: arbitrary` caps the effective intensity at 45, which is the row where
alpha reads 0.720 — doc §4's shipped `--sp-panel`.

| intensity | perspective | depthScale | ladder 1-5 (px) | parallax | panel α | blur | shadow α / blur |
|---|---|---|---|---|---|---|---|
| 0 | none | 0.25× | 4 / 6 / 8 / 10 / 14 | 0px / 0deg | 1.000 | 0px | 0.40× / 0.60× |
| 5 | 3745px | 0.318× | 5 / 8 / 10 / 13 / 18 | 1.1px / 0.36deg | 0.969 | 2px | 0.45× / 0.64× |
| 10 | 3491px | 0.386× | 6 / 9 / 12 / 15 / 22 | 2.2px / 0.73deg | 0.938 | 4px | 0.51× / 0.67× |
| 15 | 3236px | 0.455× | 7 / 11 / 15 / 18 / 25 | 3.3px / 1.09deg | 0.907 | 7px | 0.56× / 0.71× |
| 20 | 2982px | 0.523× | 8 / 13 / 17 / 21 / 29 | 4.4px / 1.45deg | 0.876 | 9px | 0.62× / 0.75× |
| 25 | 2727px | 0.591× | 9 / 14 / 19 / 24 / 33 | 5.5px / 1.82deg | 0.844 | 11px | 0.67× / 0.78× |
| 30 | 2473px | 0.659× | 11 / 16 / 21 / 26 / 37 | 6.5px / 2.18deg | 0.813 | 13px | 0.73× / 0.82× |
| 35 | 2218px | 0.727× | 12 / 17 / 23 / 29 / 41 | 7.6px / 2.55deg | 0.782 | 15px | 0.78× / 0.85× |
| 40 | 1964px | 0.795× | 13 / 19 / 25 / 32 / 45 | 8.7px / 2.91deg | 0.751 | 17px | 0.84× / 0.89× |
| **45** | **1709px** | **0.864×** | **14 / 21 / 28 / 35 / 48** | **9.8px / 3.27deg** | **0.720** | **20px** | **0.89× / 0.93×** |
| 50 | 1455px | 0.932× | 15 / 22 / 30 / 37 / 52 | 10.9px / 3.64deg | 0.670 | 22px | 0.95× / 0.96× |
| **55** | **1200px** | **1×** | **16 / 24 / 32 / 40 / 56** | **12px / 4deg** | **0.620** | **24px** | **1.00× / 1.00×** |
| 60 | 1156px | 1.111× | 18 / 27 / 36 / 44 / 62 | 12px / 4deg | 0.612 | 27px | 1.07× / 1.04× |
| 65 | 1111px | 1.222× | 20 / 29 / 39 / 49 / 68 | 12px / 4deg | 0.604 | 29px | 1.13× / 1.09× |
| 70 | 1067px | 1.333× | 21 / 32 / 43 / 53 / 75 | 12px / 4deg | 0.597 | 32px | 1.20× / 1.13× |
| 75 | 1022px | 1.444× | 23 / 35 / 46 / 58 / 81 | 12px / 4deg | 0.589 | 35px | 1.27× / 1.18× |
| 80 | 978px | 1.556× | 25 / 37 / 50 / 62 / 87 | 12px / 4deg | 0.581 | 37px | 1.33× / 1.22× |
| 85 | 933px | 1.667× | 27 / 40 / 53 / 67 / 93 | 12px / 4deg | 0.573 | 40px | 1.40× / 1.27× |
| 90 | 889px | 1.778× | 28 / 43 / 57 / 71 / 100 | 12px / 4deg | 0.566 | 43px | 1.47× / 1.31× |
| 95 | 844px | 1.889× | 30 / 45 / 60 / 76 / 106 | 12px / 4deg | 0.558 | 45px | 1.53× / 1.36× |
| 100 | 800px | 2× | 32 / 48 / 64 / 80 / 112 | 12px / 4deg | 0.550 | 48px | 1.60× / 1.40× |

Row 55 reproduces doc §4's shipped block exactly: perspective 1200px, the 1× ladder, blur
24px, parallax 12px / 4°, 1× shadows — and the counter-scales it re-derives are
`0.98667 / 0.98000 / 0.97333 / 0.96667 / 0.95333`, which are §4's `--sp-k-1` … `--sp-k-5`
digit for digit. That identity is the check that the curve anchors are the intended ones.

**What the knobs write.** Only the generator writes these; they are not runtime tokens.

```css
:root {
  --sp-perspective: <perspective, or `none` at intensity 0>;
  --sp-z-1: <16 × depthScale>;  /* … through --sp-z-5, integer px, --sp-z-0 unscaled */
  --sp-k-1: <1 − z1 / perspective>;  /* … through --sp-k-5, five decimals */
  --sp-panel: rgba(<fill>, <panelAlpha>);
  --sp-blur: <panelBlur>;  --sp-blur-strong: <panelBlur × 40 / 24>;
  --sp-shadow-1: <both layers, alpha × shadowAlpha, blur radius × shadowBlur>;
  --sp-parallax-translate: <min(parallaxPx, 12)>;
  --sp-parallax-tilt: <min(parallaxDeg, 4)>;
}
```

`depthScale`, the panel-alpha pair and the shadow multipliers are applied **before** the
CSS is written, not at runtime. §13 is explicit about why: the counter-scale and shadow
ladders are emitted as literals, so a unit the page could change at runtime would move the
panels without moving their counter-scale or their shadows, breaking the apparent-size
invariant §5 depends on — and at intensity 0 the camera is `none`, so the counter-scale
cannot be recovered as a live `calc()` either.

## 5. Hard clamps, independent of intensity

These do not move at any intensity, in any context, for any user request.

| Clamp | Value | Source |
|---|---|---|
| Panel alpha, uncontrolled backdrop | ≥ 0.62 dark glass / ≥ 0.60 light glass | §7, §13 |
| Panel alpha, contrast floor | ≥ 0.49 light glass — below the legibility floor, quoted so the gap is visible | §7 |
| Pointer parallax | ≤ 12px translate, ≤ 4° tilt | §4, §6, §10 |
| Scroll-driven depth | ≤ ±40px of z per viewport of scroll | §6 |
| Depth values | always a rung of the six-step ladder × `depthScale`; never between rungs | §3, §13 |
| Counter-scale | every non-zero z carries `scale(1 − z / perspective)` | §3, §5 |
| Target size | ≥ 24px floor, 44px pointer, 60px under `(pointer: coarse)` / `(hover: none)` | §7 |
| Target separation | ≥ 8px between adjacent targets | §3, §7 |
| Type | ≥ 14px, weight ≥ 500 | §3, §7 |
| Text plane rotation | ≤ 12° from the viewing plane | §13 |
| `preserve-3d` nesting | ≤ 3 deep, never on a scrolling list container | §8, §13 |
| Concurrent `backdrop-filter` surfaces | ≤ 6 | §8 |
| Composited layers / GPU layer memory | ≤ 25 / ≤ 96 MiB | §8 |
| Permanent `will-change` | 0 | §8, §13 |
| Panels changing depth at once | ≤ 3 | §8 |
| `position: fixed` inside a perspective subtree | never | §8, §13 |

**The parallax clamp needs its reasoning stated**, because the knob's declared maximum is
larger than it. §13's knob row tops out at 24px / 8° and covers "pointer **and scroll**
parallax amplitude" together. §6, §10 and §4 all put the *pointer* cap at 12px / 4° and
call it nausea-safe full-range amplitude, and §6 gives scroll-driven depth its own separate
±40px cap. So the amplitude above 12px / 4° belongs to the scroll variant, and pointer
parallax is clamped at 12px / 4° at every intensity including 100. The tension between the
two sections is real; it is recorded here and in the contract's `clampNotes` rather than
resolved silently.

## 6. Context caps and clamps, which override intensity

| Context | Effect |
|---|---|
| `backdropControl: arbitrary` (the default) | Intensity ≤ 45, and panel alpha floored at 0.62 dark / 0.60 light |
| `target: headset` or `both` | Target floor 60px, the 41° content cone, the 14px type floor |
| `density: compact` with a headset target | **Rejected outright**, not clamped. §13 says so, and compact plus 60px targets plus 8px separation is a contradiction |
| `material: solid` | The opaque mirror everywhere; no `backdrop-filter` is emitted at all |
| `prefers-reduced-motion: reduce` | Runtime: parallax tokens to zero **and** the pointer listener detached |
| `prefers-reduced-transparency: reduce` | Runtime: every glass fill to `--sp-panel-opaque`, blur `0px`, saturate `100%` |
| `forced-colors: active` | Runtime: `perspective: none`, `transform: none`, `Canvas` / `CanvasText`, every shadow removed |

Report every cap and clamp that fired in the audit's Corrections section, with the
requested value and the applied value — including the ones that changed nothing.

**Reduce-transparency support is not what it looks like.** Chrome and Edge 118+ ship
`prefers-reduced-transparency`; Firefox has it behind a flag; **Safari does not support it
as of August 2026**, and Safari is the platform whose users are most likely to have Reduce
Transparency on. On the web, pair the query with `prefers-contrast: more` and an in-app
toggle. On visionOS, read `UIAccessibility.isReduceTransparencyEnabled` or SwiftUI's
`\.accessibilityReduceTransparency` directly, which is the reliable signal there.

## 7. Converting an existing shadow-elevation scale

§13 step 2: map the project's shadow ladder onto the six-step depth ladder, preserving
relative order, and refuse to invent depth values outside it. The rule, stated so two runs
agree:

1. Collect every distinct `box-shadow` value in the project and rank them by
   `max(|offset-y|, |offset-x|) + blur/2 + spread`. That is the same perceived-extent
   measure the flat styles use, and it orders an elevation scale reliably.
2. Assign the ranked list **in order** to the rungs the components already occupy —
   floating chrome to level 1, raised surfaces to 2, popovers and menus to 3, sheets to 4,
   modals to 5. Rank order is preserved; the absolute numbers are discarded, because a
   `0 4px 12px` shadow is not "24px of depth", it is "the third rung".
3. More than five distinct shadows means the project has an elevation scale with no
   system in it. Collapse to five and report the collapse; do not add a sixth rung.
4. Fewer than five means some rungs go unused. That is fine and it is the common case:
   most projects use three.
5. Every assignment emits three things together — `translateZ(z)`, `scale(1 − z /
   perspective)` and the matching `--sp-shadow-N` pair. An assignment that emits one or two
   of the three is the bug this rule exists to prevent.

## 8. Budgets to report

| Item | Budget | Source |
|---|---|---|
| Concurrent `backdrop-filter` surfaces on screen | ≤ 6 | §8 — each is a full backdrop read-back; 12+ visibly drops frames on an M1 Air at 1440p |
| Total composited layers | ≤ 25 | §8 — Chrome's own layer-explosion heuristics degrade past this |
| GPU layer memory | ≤ 96 MiB | §8 — roughly 19 full-viewport layers at 1440 × 900, where one such layer costs 4.94 MiB |
| Nested `preserve-3d` contexts | ≤ 3 deep | §8 |
| Main-thread work per parallax frame | ≤ 1.5 ms | §8 — leaves headroom inside an 8.33 ms frame at 120 Hz |
| Parallax input handling | 1 rAF-coalesced write per frame | §8 — raw `pointermove` fires up to 1000 Hz on high-poll mice |
| Panels changing depth at once | ≤ 3 | §8 |
| Extra CSS for the whole style | ≤ 4 KB gzipped | §8 — it is tokens plus about fifteen rules; larger means a 3D library shipped by accident |
| Raster assets | 0 — the flat-screen dialect is CSS | §8 |
| Added JS | the parallax listener only, and zero when parallax is off | §8 |

**The moment WebGL enters, the budget changes category.** `three` plus
`@react-three/fiber` plus `@react-three/drei` is roughly 600 KB - 1 MB gzipped before your
own scene, plus GLB models at 1-10 MB each. If a request genuinely needs that, it is a
separate performance conversation and the canvas is lazy-loaded below the fold.

**Cheaper fallbacks, in doc §8's order of preference.** (1) Depth ladder with shadow pairs
and counter-scale but no `perspective` at all — 90% of the read for 5% of the cost.
(2) `perspective` plus static `translateZ`, no parallax. (3) Parallax on `(pointer: fine)`
only. (4) Full glass. Ship tier 1 as the baseline and let `@supports` and media queries
upgrade. Downgrading means walking back up that list, and it means dropping glass before
dropping the ladder.
