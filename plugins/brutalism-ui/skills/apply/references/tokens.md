# Neubrutalism tokens — machine-readable

Source of truth: `docs/07-brutalism.md` §4 (token table and ready-to-paste block),
§7 (contrast figures), §8 (budgets), §13 (intensity knobs). Every number below is
copied from those sections. Nothing here is derived from memory, and nothing here
overrides the doc. If a value in this file and a value in the doc disagree, the doc
is right and this file is stale.

Ready-to-paste artefacts live next door in `../assets/`:

| File | What it is |
|---|---|
| `assets/tokens.css` | The `:root` + both dark blocks, verbatim from doc §4 |
| `assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror, from doc §5 |
| `assets/tokens.um-aliases.css` | `--um-brutalism-*` bridge onto the shared grammar |

## 0. Two name spaces, one set of values

The style's own prefix is `--nb-*`. The shared grammar that `ui-morphism-core:token-emit`
consumes is `--um-<style>-<group>[-<variant>]`, specified in
`docs/00-comparison-matrix.md` §7. Both are emitted: `--nb-*` carries the literal
values, `--um-brutalism-*` aliases onto them. Ask `token-emit` for the `--um-brutalism-*`
set; ship `assets/tokens.css` alongside it so the aliases resolve.

Groups this style populates: `bg`, `surface`, `ink`, `border`, `accent`, `danger`,
`radius`, `shadow`, `blur` (as an explicit `0px`), `space`, `font`, `text`, `weight`,
`leading`, `tracking`, `dur`, `ease`, `focus`, `target`.

Groups it deliberately does not populate, with the doc's reason:

| Group | Why not |
|---|---|
| `elev` | §4: "There is no separate elevation token group, deliberately." Elevation *is* offset distance, so the `shadow` ladder is the elevation ladder. Two names for one ramp is how a scale drifts. |
| `saturate` | No `backdrop-filter` exists in this style, so there is nothing to saturate. |
| `noise` | No grain layer. Paper grain over hard geometry is the "organic brutalism" dialect (§12), not the base style. |
| `accent-subtle` | §3: flat saturated fills only — "no desaturated tints; no gradients." |
| `radius-pill` | The style has no pill geometry. |

Three tokens have no home in the closed group vocabulary and keep their `--nb-*`
names: `--nb-surface-sunk` (recessed/disabled fill — not a `surface-N`, which
ascends), `--nb-overlay` (modal scrim), and `--nb-shadow-sm` (the 2px rung; the
vocabulary's ladder is five rungs and this style ships six).

## 1. Colour

Every ratio below uses `#0A0A0A` — the actual `--nb-ink` / `--nb-on-accent` token —
as the dark operand, never pure `#000000`. `#000000` is only ever `--nb-border`, and
only the border rows are computed against it. Quoting a `#000000` figure next to a
`#0A0A0A` label overstates every accent by roughly 0.4 to 1.1 ratio points.

| Token | Light | Dark | Ratio vs `#0A0A0A` | Note |
|---|---|---|---|---|
| `--nb-bg` | `#FEF6E4` | `#22222E` | 18.40:1 | Warm cream, never a neutral gray. A `#F5F5F5` ground makes the same components read as generic flat design. |
| `--nb-surface` | `#FFFFFF` | `#2E2E38` | — | Cards, sheets, inputs. |
| `--nb-surface-sunk` | `#F2EAD8` | `#1A1A24` | — | Disabled fill and recessed wells. |
| `--nb-ink` | `#0A0A0A` | `#F5F0E6` | — | Text and border colour source. |
| `--nb-ink-muted` | `#3D3D3D` | `#B9B4AC` | — | Placeholders, metadata, disabled text. |
| `--nb-border` | `#000000` | `#F5F0E6` | — | **Deviates from `ekmas` on purpose.** See §3 below. |
| `--nb-on-accent` | `#0A0A0A` | `#0A0A0A` | — | Same in both themes: accents do not flip. |
| `--nb-accent` | `#FFDC58` | `#FFDC58` | 14.74:1 | Yellow. |
| `--nb-accent-2` | `#FF6B9D` | `#FF6B9D` | 7.39:1 | Pink. **2.68:1 with `#FFFFFF` — never white-on-pink.** |
| `--nb-accent-3` | `#A3E635` | `#A3E635` | 13.13:1 | Lime. |
| `--nb-accent-4` | `#67E8F9` | `#67E8F9` | 13.66:1 | Cyan. |
| `--nb-accent-5` | `#FF7A1A` | `#FF7A1A` | 7.59:1 | Orange. |
| `--nb-danger` | `#FF4D4D` | `#FF4D4D` | 6.05:1 | AA; fails AAA for body copy. |
| `--nb-overlay` | `rgb(0 0 0 / 0.80)` | `rgb(0 0 0 / 0.85)` | — | The only transparency in the style. |

Known-bad pairs, quoted so they can be recognised on sight rather than recomputed.
`ui-morphism-core:a11y-validate` is still the thing that decides pass or fail:

| Pair | Ratio | Verdict |
|---|---|---|
| `#FFFFFF` on `#FF6B9D` | 2.68:1 | Fail 1.4.3 |
| `#FFDC58` on `#FFFFFF` | 1.34:1 | Catastrophic fail |
| `#000000` border on `#2E2E38` | 1.56:1 | Fail 1.4.11 |
| `#F5F0E6` border on `#2E2E38` | 11.82:1 | Pass |
| `#A3E635` beside `#FFDC58` | ~1.12:1 | The two fills are indistinguishable; the 2px ink border is what carries the boundary. This is the argument against ever shipping a borderless variant. |
| `#0A0A0A` at 50% opacity over `#FEF6E4` | composites to `#848077`, 3.66:1 | Why disabled states must not rely on `opacity` alone. |

**Palette rule, stated once:** accents are backgrounds with `#0A0A0A` text. They are
never foregrounds on a light ground. At most three accent fills are visible in one
viewport (NN/g).

## 2. Geometry, shadow, type, space, motion

| Token | Value | Note |
|---|---|---|
| `--nb-bw` / `--nb-bw-thick` | `2px` / `4px` | 2px is the `neobrutalism.dev` default, 3px reads editorial, 4-5px is poster scale. |
| `--nb-radius` | `0px` | The `neobrutalism.com` dialect. |
| `--nb-radius-soft` | `5px` | The `ekmas` dialect. Anything ≥ 12px becomes claymorphism. |
| `--nb-sx` / `--nb-sy` | `4px` / `4px` | Blur and spread are always `0`. |
| `--nb-sx-rev` / `--nb-sy-rev` | `-4px` / `-4px` | The lifted/inverted variant. |
| `--nb-shadow-xs` | `1px 1px 0 0` | Chips, badges. |
| `--nb-shadow-sm` | `2px 2px 0 0` | Inputs, and the reduced-motion hover cue. |
| `--nb-shadow` | `var(--nb-sx) var(--nb-sy) 0 0` | Buttons. The rung the intensity knob moves. |
| `--nb-shadow-lg` | `6px 6px 0 0` | Cards. |
| `--nb-shadow-xl` | `10px 10px 0 1px` | Hero surfaces. The 1px spread is the reference library's, and it is the only permitted non-zero spread. |
| `--nb-shadow-2xl` | `16px 16px 0 1px` | Overlays. 16px is the practical ceiling (§3). |
| `--nb-font-display` | `"Archivo Black", "Lexend Mega", system-ui, sans-serif` | Weights 700-900. |
| `--nb-font-body` | `"Space Grotesk", "Public Sans", Inter, system-ui, sans-serif` | Weight 500 body — heavier than the usual 400, deliberately. |
| `--nb-font-mono` | `"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace` | Uppercase labels at `0.06em` tracking. |
| `--nb-fw-body` / `-heading` / `-display` | `500` / `700` / `900` | |
| `--nb-track-tight` / `--nb-track-label` | `-0.02em` / `0.06em` | |
| `--nb-text-xs` … `-2xl` | `0.75` / `0.875` / `1` / `1.25` / `1.5` / `2` rem | Minor-third-ish. |
| `--nb-text-display` | `clamp(2.5rem, 8vw, 5.5rem)` | Check the `min` actually fits at 320px and 200% zoom (SC 1.4.4 / 1.4.10). |
| `--nb-leading-tight` / `-body` | `1.05` / `1.55` | |
| `--nb-space-1` … `-8` | `4` / `8` / `12` / `16` / `24` / `32` / `48` / `64` px | |
| `--nb-pad-card` | `24px` | NN/g: 24-32px. `density` maps compact/default/roomy to 16/24/32px. |
| `--nb-dur-fast` / `--nb-dur` | `100ms` / `150ms` | `-fast` for tone and colour changes, base for anything that moves. Above 200ms the press feels rubbery. |
| `--nb-ease` | `cubic-bezier(0.2, 0, 0, 1)` | `linear` is also valid. Never spring, bounce or `ease-in-out`. |
| `--nb-focus-color` | `#0A0A0A` light, `#FFFFFF` dark | |
| `--nb-focus-w` / `--nb-focus-offset` | `3px` / `2px` | Solid, never dashed, never blurred. |
| `--nb-target-min` | `44px` | Exceeds SC 2.5.8's 24px floor on purpose. |

**Rung assignment does not change with intensity.** Chips and badges sit on `-xs`,
buttons and inputs on the base rung, cards on `-lg`, hero and overlay surfaces on
`-xl` / `-2xl`. This is §4's elevation paragraph, and it is fixed.

## 3. The dark-mode border flip

The single most-copied mistake in this ecosystem. `ekmas/neobrutalism-components`
keeps `--border: oklch(0% 0 0)` in `.dark`; pure black against a `#2E2E38`-class dark
surface is **1.56:1** and fails SC 1.4.11 outright. `--nb-border` must be a light ink
(`#F5F0E6`, 11.82:1) in dark mode.

The token layer must therefore emit dark values in **both** places, per the shared
emission shape: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
and `:root[data-theme="dark"]`. `assets/tokens.css` already does. A partial override —
half the palette left on the light theme's values — is the bug that produces a black
border on a dark card.

For Tailwind, the flip lives outside `@theme`, on the `.dark` selector, because
`@theme` may never be nested inside an at-rule.

## 4. Intensity → knobs

Curves are from §13. Three of the five knobs state an endpoint pair *and* a midpoint
that a straight line cannot reach, so those three are piecewise-linear through all
three stated anchors. This keeps every knob monotone across 0→100, which is the shared
intensity contract's first rule.

```
shadowOffset(t) = round( t <= 50 ?  4*t/50           :  4 + 8*(t-50)/50 )    # 0px … 12px, 4px at 50
radius(t)       = round( t <= 50 ? 12 - 7*t/50       :  5 - 5*(t-50)/50 )    # 12px … 0px, 5px at 50
borderWidth(t)  = min(5, 1 + floor(t/25))                                    # 1/2/3/4/5 at 0/25/50/75/100
chroma(t)       = 35% + 0.65*t                                               # % of the source OKLCH C
tilt(t)         = round(3*t/100, 1)                                          # 0deg … 3deg
```

Resolved, every five points. Read the row, do not recompute:

| intensity | shadowOffset | borderWidth | radius | chroma | tilt |
|---|---|---|---|---|---|
| 0 | 0px | 1px | 12px | 35% | 0deg |
| 5 | 0px | 1px | 11px | 38% | 0.2deg |
| 10 | 1px | 1px | 11px | 42% | 0.3deg |
| 15 | 1px | 1px | 10px | 45% | 0.5deg |
| 20 | 2px | 1px | 9px | 48% | 0.6deg |
| 25 | 2px | 2px | 9px | 51% | 0.8deg |
| 30 | 2px | 2px | 8px | 55% | 0.9deg |
| 35 | 3px | 2px | 7px | 58% | 1.1deg |
| 40 | 3px | 2px | 6px | 61% | 1.2deg |
| **45** | **4px** | **2px** | 6px | 64% | 1.4deg |
| 50 | 4px | 3px | 5px | 68% | 1.5deg |
| 55 | 5px | 3px | 5px | 71% | 1.7deg |
| **60** | **6px** | **3px** | **4px** | **74%** | **1.8deg** |
| 65 | 6px | 3px | 4px | 77% | 2deg |
| 70 | 7px | 3px | 3px | 81% | 2.1deg |
| 75 | 8px | 4px | 3px | 84% | 2.3deg |
| 80 | 9px | 4px | 2px | 87% | 2.4deg |
| 85 | 10px | 4px | 2px | 90% | 2.6deg |
| 90 | 10px | 4px | 1px | 94% | 2.7deg |
| 95 | 11px | 4px | 1px | 97% | 2.9deg |
| 100 | 12px | 5px | 0px | 100% | 3deg |

Row 60 is the default. Row 45 is the ceiling `scope: product` imposes, and it lands
on 4px / 2px / 0deg on its own — which is exactly what §13's product clamp asks for,
and is the check that the piecewise reading of the curves is the intended one.

**What the knobs write.** Only four custom properties change; nothing else in
`assets/tokens.css` is touched. This is precisely what §5's `BrutalRoot` does.

```css
[data-brutal-root] {
  --nb-sx: <shadowOffset>;  --nb-sy: <shadowOffset>;
  --nb-sx-rev: -<shadowOffset>;  --nb-sy-rev: -<shadowOffset>;
  --nb-bw: <borderWidth>;
  --nb-radius: <radius>;
  --nb-pad-card: <16 | 24 | 32px per density>;
}
```

`shadowOffset: 0` is a mode, not just a value: emit §8's named `.nb--flat` fallback —
`box-shadow: none` on every generated class, border only. §8 puts that at "maybe 70%
strength for literally one extra property," and §12 names minimalism as the style's
natural low-intensity fallback. That is what makes intensity 0 a usable, accessible,
recognisable baseline rather than nothing.

**Chroma without a build step.** Scale accents in CSS with relative colour syntax,
holding L and H so the hue and lightness of the brand colour survive:

```css
:root {
  --nb-chroma: 0.74;                       /* intensity 60 */
  --nb-accent: oklch(from #FFDC58 l calc(c * var(--nb-chroma)) h);
}
```

OKLCH `l` is perceptual lightness, not WCAG relative luminance, so holding it keeps
contrast close but does not freeze it. Every scaled accent goes to
`ui-morphism-core:a11y-validate` before it ships. Where relative colour syntax is not
available, ask `ui-morphism-core:token-emit` for pre-resolved hexes at the chosen
chroma instead of hand-computing them.

## 5. Hard clamps, independent of intensity

These do not move at any intensity, in any scope, for any user request.

| Clamp | Value | Source |
|---|---|---|
| Shadow blur | exactly `0` | §3, §13 |
| Shadow spread | `0`, except `1px` on the `xl` and `2xl` rungs | §4, §13 |
| Radius ceiling | `12px` — at or above this it is claymorphism | §3, §12 |
| Border width floor | `1px`; a surface never has zero boundary | §7, §10 |
| Focus outline | `outline`, ≥ 3px, `outline-offset` ≥ 2px | §4, §7 |
| Target size | ≥ 24×24 CSS px hard floor, `--nb-target-min` 44px shipped | §7 |
| Accent fills per view | ≤ 3 | §7, NN/g |
| Shadow layers per element | ≤ 2 | §8, §13 |
| Dark-mode border | never `#000` | §7 |
| Tilt | never on an element containing a focusable descendant | §10, §13 |

## 6. Context caps, which override intensity

| Context | Cap |
|---|---|
| `scope: product` | intensity ≤ 45, and then `shadowOffset ≤ 4px`, `borderWidth ≤ 2px`, `tilt = 0` |
| `motion: minimal` | hover is the shadow-shrink cue only; no translate, no tilt transition |
| `prefers-reduced-motion: reduce` | runtime, not a cap: `transform` is removed and the shadow-shrink cue replaces it |
| `forced-colors: active` | runtime: shadows and transforms zeroed, colours pinned to system keywords |

Report every cap that fired in the audit's Corrections section, with the requested
value and the applied value.

## 7. Converting an existing blurred shadow

§13 step 3: "replaces every blurred `box-shadow` with the nearest hard-offset step."
The equivalence rule, stated so two runs agree:

```
reach = max( 0, max(|offset-x|, |offset-y|) + blur/2 + spread )
```

A soft shadow's perceived extent is its offset plus roughly half its blur; a hard
shadow has no penumbra, so half the blur is the closest honest equivalent. Spread is
signed — the negative spread that soft-shadow systems use to tighten a large blur
genuinely reduces the shadow's reach.

Snap `reach` to the nearest rung of `{1, 2, 4, 6, 10, 16}` and emit
`<rung>px <rung>px 0 <0|1>px var(--nb-border)`. Worked examples:

| Input | reach | Rung |
|---|---|---|
| `0 1px 2px rgb(0 0 0 / .06)` | 2 | `--nb-shadow-sm` |
| `0 4px 12px rgb(0 0 0 / .15)` | 10 | `--nb-shadow-xl` |
| `0 2px 4px -1px rgb(0 0 0 / .1)` | 3 | `--nb-shadow` (4px) |
| `0 20px 40px -12px rgb(0 0 0 / .25)` | 28 | `--nb-shadow-2xl` — the ladder's 16px top rung, which is also §3's practical ceiling |
| `inset 0 2px 4px rgb(0 0 0 / .2)` | — | **No equivalent.** Refuse; replace with a border or `--nb-surface-sunk`. |

## 8. Budgets to report

| Item | Budget | Source |
|---|---|---|
| Display font, subset WOFF2 | ≤ 15 KB | §8 |
| Body font, 2 weights, subset WOFF2 | ≤ 45 KB | §8 |
| Mono font, optional, subset | ≤ 20 KB | §8 |
| Style CSS, minified + brotli | ≤ 6 KB | §8 |
| Style CSS, minified | ≤ 8 KB | §13 item 11 |
| Raster assets | 0 — the style is drawable in CSS | §8 |
| Added JS for the aesthetic | 0 | §8, §13 item 11 |
| Hover frame budget, 60-card grid | ≤ 4ms scripting + paint, 60fps sustained | §8 |
| `will-change` selectors | ≤ 1, on a hovered subtree, never a list-item base class | §8, §13 item 10 |
