# Skeuomorphism tokens — machine-readable

Source of truth: `docs/01-skeuomorphism.md` §3 (visual DNA), §4 (token table and the
ready-to-paste block), §5 (the material tables in the React recipe), §7 (contrast
figures), §8 (budgets), §13 (intensity knobs). Every number below is copied from those
sections. Nothing here is derived from memory, and nothing here overrides the doc. If a
value in this file and a value in the doc disagree, the doc is right and this file is
stale.

Ready-to-paste artefacts live next door in `../assets/`:

| File | What it is |
|---|---|
| `assets/tokens.css` | The `:root` + both dark blocks, verbatim from doc §4 |
| `assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror, from doc §5 |
| `assets/tokens.um-aliases.css` | `--um-skeuomorphism-*` bridge onto the shared grammar |

## 0. The one thing everything else hangs off

A single overhead light source, rendered as a **four-layer shadow stack**: two outer
layers (contact, ambient) and two inset layers (top bevel highlight, bottom shade), on
every raised surface without exception. Gradients, grain, letterpress type, leather and
brushed metal are decoration hung off that lighting model. One shadow reads flat; four
read machined. Mixed light directions are the number-one tell of a fake.

Recessed containers — wells, inputs, slider tracks, slots — **invert** the stack:
highlight at the bottom, shade at the top. That is `--sk-elev-0`, and it is the only
permitted exception to the top-light rule. It is what makes a hole read as a hole rather
than as a bump.

## 1. Two name spaces, one set of values

The style's own prefix is `--sk-*`. The shared grammar that
`ui-morphism-core:token-emit` consumes is `--um-<style>-<group>[-<variant>]`, specified
in `docs/00-comparison-matrix.md` §7. Both are emitted: `--sk-*` carries the literal
values, `--um-skeuomorphism-*` aliases onto them. Ask `token-emit` for the
`--um-skeuomorphism-*` set; ship `assets/tokens.css` alongside it so the aliases resolve.

Groups this style populates: `bg`, `surface-1`, `ink`, `border`, `border-strong`,
`accent`, `danger`, `radius` (all four rungs), `elev` (0-3), `shadow-press`,
`noise-opacity`, `space` (1-7), `font-body`, `text`, `leading`, `tracking-label`, `dur`,
`ease`, `focus`, `target`.

Groups it deliberately does not populate, with the doc's reason:

| Group | Why not |
|---|---|
| `shadow-1` … `shadow-5` | §4 names the compounds `--sk-elev-0` … `--sk-elev-3` and defines them as depth levels that happen to be spelled as `box-shadow` values. A parallel `shadow-N` ramp would be the same four values under a second name. This is the mirror image of brutalism's choice — there elevation *is* offset distance, so the shadow ladder is the elevation ladder and no `elev` group exists — and it is the same reasoning. |
| `noise-freq` | §4: the grain is one inline-SVG data URI and a data URI is an opaque string, so CSS cannot interpolate a custom property inside it. `baseFrequency` is not a token and must not be advertised as one. See §5 below. |
| `blur` | No backdrop blur in this style. §12's sanctioned hybrid puts the blur on the glass layer above the material, which is `glassmorphism-ui`'s token. |
| `saturate` | Nothing here filters a backdrop. |
| `accent-subtle` | §4 tables one accent and one danger. Emphasis here comes from elevation and bevel depth, not from a paler fill. |
| `font-display` / `font-mono` | §4 tables one family stack. Its note asks for a real slab or grotesk on panel labels, which is advice to the project rather than a second token. |
| `weight` | §4 has no weight ramp; §5 sets `600` inline on controls and labels. |
| `tracking-tight` | The style tracks labels *out* — `0.06em`, uppercase — and never in. |
| `space-8` | §4's ramp is seven steps. An eighth would be a number no doc measured. |

Tokens with no home in the closed vocabulary keep their `--sk-*` names and are consumed
directly: `--sk-surface-hi` / `--sk-surface-lo` (the light and shade stops of one plane,
not two more planes), `--sk-well`, `--sk-face`, the four shadow atoms, the two press
layers, `--sk-emboss` / `--sk-deboss`, `--sk-specular`, `--sk-noise`, `--sk-hairline`,
`--sk-dur-panel` and `--sk-focus-ring`.

## 2. Colour

Contrast figures are §4's and §7's, computed against the stated adjacent colour.
`ui-morphism-core:a11y-validate` is still the thing that decides pass or fail; these are
quoted so a known pair can be recognised on sight rather than recomputed.

| Token | Light | Dark | Measured | Note |
|---|---|---|---|---|
| `--sk-bg` | `#d8cfbe` | `#17140f` | — | The desk or chassis behind all controls. Never `#fff`, never `#000` — real materials have a hue. |
| `--sk-surface-hi` | `#f7f2ea` | `#3a342a` | — | Top gradient stop. |
| `--sk-surface` | `#e8e0d2` | `#2e2920` | — | Mid stop, the nominal face colour. |
| `--sk-surface-lo` | `#d9cfbc` | `#23201a` | — | Bottom stop, about 15% luminance below `-hi`. |
| `--sk-well` | `#cfc4ae` | `#141109` | — | Recessed / inset container fill. |
| `--sk-border` | `#b8a98e` | `#4a4335` | **1.76:1** vs the face | **Decorative hairline only.** Never a control's boundary. |
| `--sk-border-strong` | `#7a6a4e` | `#8a7a5e` | light **4.01:1** vs face, **3.40:1** vs chassis; dark **3.46:1** vs face | The control boundary, in both themes. |
| `--sk-ink` | `#4a3f2d` | `#ede4d2` | light **7.85:1** on the face, **6.67:1** on the darkest stop; dark **11.4:1** on the face | Body text. |
| `--sk-ink-muted` | `#6b5c44` | `#c3b79f` | light **4.95:1** on the face | Secondary text. |
| `--sk-ink-inverse` | `#f7f2ea` | `#17140f` | — | For use on `--sk-accent`. |
| `--sk-accent` | `#5d4a36` | `#c9a24a` | — | Walnut / brass. |
| `--sk-danger` | `#8f2f21` | `#e0705e` | — | The recessed red indicator lamp. |

**Measure against the darkest stop, not the average.** Embossed text on a mid-tone
material lowers *perceived* contrast even though the computed ratio does not move. `#4a3f2d`
on the mid stop `#e8e0d2` is **7.85:1** and on the darkest stop `#d9cfbc` is **6.67:1**;
both clear AA comfortably, but only the mid stop reaches AAA — the darkest stop lands
just under the 7:1 line, and W3C does not round up to meet a threshold. That gap is the
entire reason the measurement is taken against the darkest stop. If the face is tinted,
re-measure.

**Saturation and lightness bands for a derived face** (§13 step 2): warm the brand
colour, clamp saturation to **8-25%** and lightness to **82-95%** for faces, generate the
three stops at a **15%** luminance spread, and take the mid stop as the nominal surface.

## 3. Geometry, shadow, type, space, motion

| Token | Value | Note |
|---|---|---|
| `--sk-hairline` | `1px` | Never scale this. Materials have thin edges. |
| `--sk-r-sm` / `-md` / `-lg` / `-pill` | `4px` / `10px` / `16px` / `999px` | 10px is the canonical control radius. Radius is a material statement — see §4 below. |
| `--sk-shadow-contact` | `0 1px 2px rgba(0,0,0,.25)` → dark `.55` | L1, grounding. |
| `--sk-shadow-ambient` | `0 4px 10px rgba(0,0,0,.18)` → dark `0 6px 14px rgba(0,0,0,.45)` | L2, elevation. |
| `--sk-bevel-top` | `inset 0 1px 0 rgba(255,255,255,.80)` → dark `.14` | L3, the bevel. Not a boundary. |
| `--sk-bevel-bottom` | `inset 0 -2px 3px rgba(0,0,0,.12)` → dark `.40` | L4, the under-lip. |
| `--sk-press-inner` / `-2` | `inset 0 2px 5px rgba(0,0,0,.25)` / `inset 0 1px 1px rgba(0,0,0,.20)` | The pressed stack. |
| `--sk-elev-0` | inset stack only | Wells, inputs, tracks. The inverted one. |
| `--sk-elev-1` | L1 + L3 | Chips, tags, keys. |
| `--sk-elev-2` | L1 + L2 + L3 + L4 | Buttons, cards. **The default.** |
| `--sk-elev-3` | `0 2px 3px/.28`, `0 10px 24px/.22` + insets | Dialogs, floating panels. |
| `--sk-face` | 3-stop `linear-gradient(to bottom, hi 0%, surface 45%, lo 100%)` | The midpoint is at 45%, not 50%. |
| `--sk-emboss` / `--sk-deboss` | `0 1px 0 rgba(255,255,255,.70)` / `0 -1px 0 rgba(0,0,0,.35)` | Letterpress. Emboss on light faces, deboss on dark ones. |
| `--sk-specular` | `rgba(255,255,255,.45)` → dark `.28` | Elliptical hotspot, curved parts only. |
| `--sk-noise-opacity` | `.05` → dark `.07` | The only tokenised grain parameter. |
| `--sk-font` | `ui-sans-serif, -apple-system, "Segoe UI", Inter, system-ui, sans-serif` | |
| `--sk-fs-100` … `-700` | `12` / `14` / `16` / `18` / `24` / `32` / `44` px | 1.125-1.33 modular. Labels at 12px, `0.06em`, uppercase. |
| `--sk-lh-tight` / `-body` | `1.15` / `1.5` | |
| `--sk-label-tracking` | `.06em` | |
| `--sk-s-1` … `-7` | `4` / `8` / `12` / `16` / `24` / `32` / `48` px | Control padding default `14px 28px`. |
| `--sk-target-min` | `44px` | 24px is the SC 2.5.8 floor; 44px is the practical target and is what `.sk-button` takes its `min-height` from. |
| `--sk-dur-press` / `-hover` / `-release` / `-panel` | `90` / `140` / `220` / `260` ms | |
| `--sk-ease-press` | `cubic-bezier(.2, 0, 0, 1)` | |
| `--sk-ease-release` | `cubic-bezier(.34, 1.4, .64, 1)` | The only easing permitted an overshoot, and only under 4%. |
| `--sk-ease-standard` | `cubic-bezier(.4, 0, .2, 1)` | |
| `--sk-focus-ring` | `0 0 0 2px var(--sk-bg), 0 0 0 4px #2b6cb0` → dark `#7cb0ff` | 2px gap then 2px ring, additive to the resolved stack. |
| `--sk-focus-width` | `2px` | |

**Two tokens are runtime-only** and are deliberately absent from `assets/tokens.css`, as
§4 tables them. `--sk-elev-current` is the elevation stack one element actually resolved,
so a rule that overrides `box-shadow` — `:focus-visible` above all — can re-state it
instead of deleting it. `--sk-press-travel` is the Y displacement of the pressed state.
Both are written inline onto the element. Authors using the static tokens reference
`--sk-elev-2` directly, and the vanilla recipe hard-codes the travel as a local
`--_travel`.

**Rung assignment does not change with intensity.** Wells, inputs and tracks sit on
`elev-0`; chips, tags and keys on `elev-1`; buttons and cards on `elev-2`; dialogs and
floating panels on `elev-3`. Intensity scales every layer of whichever rung an element
already sits on; it never promotes an element to a different rung.

## 4. Material judgement — the part the tokens cannot decide

Radius, face ramp, ink, specular strength and texture are a statement about *what the
object is made of*. No token derives them, and getting the geometry wrong is more
damaging than getting the texture wrong. §3's bands are the constraint; §5's tables are
the four materials the doc actually resolves.

| `material` | Radius | Face ramp (hi / mid / lo) | Ink | Specular | Texture |
|---|---|---|---|---|---|
| `plastic` | `10px` (`--sk-r-md`) | `#f7f2ea` / `#e8e0d2` / `#d9cfbc` | `#4a3f2d` | `--sk-specular` on curved parts | grain only |
| `brushed-metal` | `4px` (`--sk-r-sm`) | `#f2f3f4` / `#dcdfe2` / `#c2c7cc` | `#2d3238` | strongest — polished metal is where §13 allows the 24% gradient spread | grain, plus §8's tiling 2-colour **brushed-lines** SVG pattern where a directional finish is wanted |
| `wood` | `8px` | `#b98b58` / `#a3763f` / `#8a5f2e` | `#2f2113` | subdued; wood scatters | grain only |
| `rubber` | `18px` | `#4b4b4d` / `#3a3a3c` / `#2b2b2d` | `#f2efe8` | subdued and wide | grain; **deboss, not emboss** — the face is dark, so the letterpress inverts to `--sk-deboss` |
| `leather` | `16px` (`--sk-r-lg`) | **derived** — §13 step 2 from a brown in the project's palette | derived, re-measured | subdued | §8's tiling 2-colour **stitch** pattern |
| `felt` | `16px` (`--sk-r-lg`) | **derived** — the only felt colours the doc states are the toggle track's `#4e6b3c` → `#6d8c52` | derived, re-measured | none — felt has no specular | §8's tiling 2-colour **mesh** pattern |
| `mixed` | per component | per component | per component | per component | one grain layer for the whole chassis |

Four rules that come with this table.

1. **Radius bands, from §3:** 2-4px for stamped and machined parts, 8-12px for moulded
   plastic and metal, 16-24px for rubber and soft goods. `brushed-metal` at 4px is
   machined, not moulded — that is why it is the one material below the plastic band.
   Never apply one global 12px radius to metal, wood, glass and rubber alike.
2. **Leather and felt have no tabled ramp, and inventing one is not permitted.** §5
   resolves four materials; these two are derived by §13 step 2 from the project's own
   colours and then re-measured. Say so in the audit rather than shipping hexes from
   nowhere.
3. **`rubber` and `wood` are dark or saturated faces.** Their ink is not `--sk-ink`, the
   letterpress inverts, and every pair goes back through
   `ui-morphism-core:a11y-validate` against the *darkest* stop of that ramp. Nothing in
   this file quotes a ratio for a material ramp, because the doc measures none.
4. **`mixed` still has one light source.** Different materials may share a screen;
   different light directions may not.

## 5. Grain: one parameter is a token and three are not

`--sk-noise-opacity` is a variable. `baseFrequency` **0.9**, `numOctaves` **2**,
`type="fractalNoise"`, `stitchTiles="stitch"` and the **160px** tile are baked into the
`--sk-noise` data URI, because a data URI is an opaque string and CSS cannot interpolate
a custom property inside it. They are edited in the URI, in all three places that carry a
copy of it:

1. the `--sk-noise` declaration in `../assets/tokens.css`;
2. the `@utility sk-grain` in `../assets/tokens.theme.css`;
3. the `NOISE` constant in doc §5's React component.

Edit all three or none. 0.9 / 2 is the tight machining grain §3 argues for, and it is
deliberately different from the neighbours': `docs/03-glassmorphism.md` uses a softer
0.8 / 4 at 0.02-0.05 to break up backdrop-blur banding, and `docs/06-maximalism.md` uses
0.8 / 3 at 0.04-0.12 because there the grain is a visible print statement rather than a
surface finish. **Changing the frequency changes the material; changing the opacity
changes only the intensity.** That is why §13 splits them across two different inputs:
the `grainOpacity` knob rewrites `--sk-noise-opacity`, while the `material` input's
"grain frequency" means emitting a different data URI.

Two more grain rules, both from §8: **one grain layer per scroll container, on the
chassis** — twenty components with their own `::before` means twenty extra paint
rectangles — and **inline SVG, never a PNG**: the data URI is about 330 bytes and
rasterises once per unique tile size, where a 512×512 noise PNG is 40-90 KB and buys
nothing visible at 5% opacity.

## 6. Intensity → knobs

Curves are from §13, and the contract that runs is
`${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json`. Two knobs state an endpoint pair
*and* a default that a straight line between the endpoints cannot reach, so those two are
piecewise-linear through all three anchors; `materialFidelity` is an integer ladder, so it
is plateaus with a 0.1-wide ramp below each boundary. Every knob is monotone across
0 → 100.

```
shadowDepth(t)      = t/100                                            # 0 … 1, linear
gradientSpread(t)   = t <= 60 ?  0.25*t          : 15 + 0.225*(t-60)   # 0% … 24%, 15% at 60
grainOpacity(t)     = t <= 60 ?  0.05*t/60       : 0.05 + 0.03*(t-60)/40   # light
grainOpacityDark(t) = t <= 60 ?  0.07*t/60       : 0.07 + 0.01*(t-60)/40   # dark
materialFidelity(t) = t == 0 ? 0 : t < 25 ? 1 : t < 75 ? 2 : 3         # decorative layers
travel(t)           = round( t <= 60 ? t/60 : 1 + (t-60)/40 )          # px, then 0 below t=25
```

Resolved, every five points. Read the row, do not recompute:

| intensity | shadowDepth | gradientSpread | grainOpacity light / dark | materialFidelity | travel |
|---|---|---|---|---|---|
| 0 | 0.00 | 0.0% | .000 / .000 | 0 | 0px |
| 5 | 0.05 | 1.3% | .004 / .006 | 1 | 0px |
| 10 | 0.10 | 2.5% | .008 / .012 | 1 | 0px |
| 15 | 0.15 | 3.8% | .013 / .018 | 1 | 0px |
| 20 | 0.20 | 5.0% | .017 / .023 | 1 | 0px |
| 25 | 0.25 | 6.3% | .021 / .029 | 2 | 0px |
| 30 | 0.30 | 7.5% | .025 / .035 | 2 | 1px |
| 35 | 0.35 | 8.8% | .029 / .041 | 2 | 1px |
| 40 | 0.40 | 10.0% | .033 / .047 | 2 | 1px |
| 45 | 0.45 | 11.3% | .038 / .053 | 2 | 1px |
| 50 | 0.50 | 12.5% | .042 / .058 | 2 | 1px |
| 55 | 0.55 | 13.8% | .046 / .064 | 2 | 1px |
| **60** | **0.60** | **15.0%** | **.050 / .070** | **2** | **1px** |
| 65 | 0.65 | 16.1% | .054 / .071 | 2 | 1px |
| 70 | 0.70 | 17.3% | .058 / .073 | 2 | 1px |
| 75 | 0.75 | 18.4% | .061 / .074 | 3 | 1px |
| 80 | 0.80 | 19.5% | .065 / .075 | 3 | 2px |
| 85 | 0.85 | 20.6% | .069 / .076 | 3 | 2px |
| 90 | 0.90 | 21.8% | .073 / .078 | 3 | 2px |
| 95 | 0.95 | 22.9% | .076 / .079 | 3 | 2px |
| 100 | 1.00 | 24.0% | .080 / .080 | 3 | 2px |

Row 60 is the default, and it is the row that reproduces `assets/tokens.css` exactly:
15% spread is the spread `--sk-surface-hi` and `--sk-surface-lo` already carry, and
0.05 / 0.07 are the shipped `--sk-noise-opacity` values. That is the check that the
piecewise reading of the curves is the intended one.

Three readings that are easy to get wrong:

- **Row 25 is where the press starts moving.** §13 suppresses travel below
  `shadowDepth` 0.25 so a 1px jump never happens without shadow support. Rounding alone
  would already give 0px up to intensity 29; the suppression is a separate floor and is
  applied after rounding, so both agree below 25 and the floor is what the audit records.
- **Row 75 is where the specular hotspot and the edge highlight appear.**
  `materialFidelity` 3 is the loudest rung and §9 reserves it for one or two hero objects
  per screen.
- **Above 18% spread starts looking like a 2009 web button.** That is a warning, not a
  clamp; §13 permits 24% for polished metal.

**What the knobs write.** Only these custom properties change; nothing else in
`assets/tokens.css` is touched. This is what §5's React component does with `k`.

```css
[data-skeuo-root] {
  --sk-noise-opacity: <grainOpacity>;
  --sk-press-travel:  <travel>;
  /* every layer of the resolved rung, with offset, blur and alpha scaled by shadowDepth */
  --sk-elev-current:  <the resolved stack>;
  --sk-press-inner:   inset 0 <2k>px <5k>px rgba(0,0,0,<0.25k + 0.05>);
  --sk-press-inner-2: inset 0 1px 1px rgba(0,0,0,<0.20k>);
}
```

Note the `+ 0.05` on the pressed inner shadow: §5's component adds a floor there so the
pressed state stays visible as a *state* even at low intensity, where a pure multiple of
`k` would fade it to nothing. The pressed appearance is an SC 1.4.11 state indicator, not
decoration.

## 7. Hard clamps, independent of intensity

These do not move at any intensity, in any context, for any user request.

| Clamp | Value | Source |
|---|---|---|
| Light direction | one overhead source across every emitted component | §3, §10, §13 |
| Recessed inversion | the only permitted exception to the top-light rule | §3 |
| Shadow layers on a raised surface | exactly 4 at `elev-2` | §3, §10 |
| Grain opacity ceiling | `0.08` — the skill will not emit higher | §13 |
| Grain layers per scroll container | ≤ 1, on the chassis | §8, §13 |
| Grain frequency | `fractalNoise`, 0.9, 2 octaves, stitch, 160px tile | §4 |
| Control boundary | a real 1px `--sk-border-strong`; a bevel is never the boundary | §7, §10 |
| Focus indicator | additive to the stack, ≥ 2px, never a replacement | §6, §7 |
| Target size | ≥ 24×24 CSS px hard floor, `--sk-target-min` 44px shipped | §7 |
| Animated `box-shadow` | never | §6, §8, §13 |
| Decorative image bytes | ≤ 60 KB per route, no raster texture > 40 KB | §8, §13 |
| Emitted CSS | ≤ 8 KB gzipped for tokens plus the component layer | §8, §13 |
| Hybrid backdrop blur | ≤ 12px radius, ≤ 2 backdrop-filtered elements per viewport | §8, §12 |

## 8. Context caps and clamps, which override intensity

| Context | Effect |
|---|---|
| `surface: running-text` | intensity capped at 0. §13 refuses skeuomorphic treatment on body-copy backgrounds and anything holding more than roughly 120 characters of running text |
| `surface: data-table` | intensity capped at 0 for the rows. §13 names table rows; §9 puts dense enterprise UI on the avoid list. Chrome around the table may still carry the style |
| `perfTarget: low-end` | `materialFidelity ≤ 1` — §8's ladder drops the grain first, then the specular layer |
| `prefersContrast: more` | `grainOpacity = 0`, `gradientSpread ≤ 6%`, ink and borders darkened (§7) |
| `controlHeight: under-64` | `travel ≤ 1px` — §13 reserves 2px for hardware metaphors ≥ 64px tall |
| `prefers-reduced-motion: reduce` | runtime, not a cap: travel removed, pressed *appearance* kept |
| `forced-colors: active` | runtime: the entire style is deleted by the UA and a real border plus system colours is what survives |

Report every cap and clamp that fired in the audit's Corrections section, with the
requested value and the applied value, **including the ones that changed nothing**.

## 9. Converting an existing flat or soft-shadowed component

§13 step 4 rewrites targeted components to the four-layer stack. There is no arithmetic
here and none should be invented: the mapping is by **role**, because §4 assigns the
rungs by role and the rung does not move with intensity.

| What you found | What it becomes |
|---|---|
| Any raised card or button with one blurred shadow | `--sk-elev-2` — the full four layers, plus `--sk-face`, plus a 1px `--sk-border-strong` |
| A chip, tag, badge or key | `--sk-elev-1` |
| A dialog, popover or floating panel | `--sk-elev-3` |
| An input, textarea, select, slider track or any recessed slot | `--sk-elev-0` — the inverted stack, and the fill drops to `--sk-well` |
| An `inset` shadow used to mean "pressed" | `--sk-press-inner` + `--sk-press-inner-2`, with `translateY(var(--sk-press-travel))` |
| A flat fill | the 3-stop `--sk-face`; keep the mid stop as the nominal colour so the component's colour identity does not shift |
| A Material Design elevation of 1 / 3 / 6 / 8 dp | `--sk-elev-1` / `-2` / `-2` / `-3`. §12 states this mapping directly, with the caveat that Material's single-paper metaphor conflicts with this style's many-materials premise: pick one |
| A neumorphic dual-shadow extrusion | **Refuse.** It is a different style, out of scope, and §12 measures typical neumorphic controls at 1.2:1 to 1.7:1 against their own ground. Hand it to `neumorphism-ui` |

## 10. Budgets to report

| Item | Budget | Source |
|---|---|---|
| Inline SVG grain data URI | ~330 bytes, one tile reused everywhere | §8 |
| Decorative image bytes per route | ≤ 60 KB total | §8, §13 |
| Any single raster texture | ≤ 40 KB, and none with text baked in | §13 |
| Style CSS, tokens + component layer | ≤ 8 KB gzipped | §8, §13 |
| 4-layer `box-shadow` at rest | unlimited; ≤ 60 simultaneously animating | §8 |
| 3-stop `linear-gradient` | unlimited — paint, near-free | §8 |
| Grain layers | 1 per scroll container | §8, §13 |
| Backdrop blur, hybrid only | radius ≤ 12px, ≤ 2 elements per viewport | §8 |
| Animated `box-shadow` | 0 | §8, §13 |
| Interaction to next paint, Moto G-class device | ≤ 200 ms | §8 |
| Long tasks from style recalculation on hover | none > 50 ms | §8 |
| `will-change` | only on elements about to animate; removed afterwards | §8 |
| Blur radii generally | ≤ 20px, and ≤ 12px on a large element | §8 |

Test on a mid-range Android, not a MacBook: DevTools 4× CPU throttle plus a Lighthouse
mobile run is the minimum gate.
