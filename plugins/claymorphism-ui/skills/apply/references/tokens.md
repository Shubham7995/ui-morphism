# Claymorphism tokens — machine-readable

Source of truth: `docs/04-claymorphism.md` §4 (token table and ready-to-paste block),
§7 (contrast figures), §8 (budgets), §13 (intensity knobs). Every number below is
copied from those sections. Nothing here is derived from memory, and nothing here
overrides the doc. If a value in this file and a value in the doc disagree, the doc
is right and this file is stale.

Ready-to-paste artefacts live next door in `../assets/`:

| File | What it is |
|---|---|
| `assets/tokens.css` | The `:root` + both dark blocks, verbatim from doc §4 |
| `assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror, from doc §5 |
| `assets/tokens.um-aliases.css` | `--um-claymorphism-*` bridge onto the shared grammar |

## 0. Two name spaces, one set of values

The style's own prefix is `--clay-*`. The shared grammar that
`ui-morphism-core:token-emit` consumes is `--um-<style>-<group>[-<variant>]`,
specified in `docs/00-comparison-matrix.md` §7. Both are emitted: `--clay-*` carries
the literal values, `--um-claymorphism-*` aliases onto them. Ask `token-emit` for the
`--um-claymorphism-*` set; ship `assets/tokens.css` alongside it so the aliases
resolve.

Groups this style populates: `bg`, `surface`, `ink`, `border`, `accent`, `danger`,
`radius`, `shadow`, `blur` (as an explicit `0px`), `space`, `font`, `text`, `weight`,
`leading`, `dur`, `ease`, `focus`, `target`.

Groups it deliberately does not populate, with the doc's reason:

| Group | Why not |
|---|---|
| `elev` | §4 labels the four drop shadows "Elevation 1 — chips" through "Elevation 4 — modals". The shadow ladder **is** the elevation ladder, and a parallel ramp is how a scale drifts. |
| `saturate` | Clay is opaque. There is no `backdrop-filter` and nothing behind the surface to saturate. |
| `noise` | No grain layer. Clay's material is matte and untextured; §12 puts texture maps in skeuomorphism and calls the graft a 2011 pastiche. |
| `accent-subtle` | The low-emphasis tint in this style is a pastel surface, which is already the `surface` ramp. |
| `tracking` | §4 declares no letter-spacing token. A token nothing consumes is worse than none. |

**One mapping is not one-to-one.** §7.3 says so directly: "Claymorphism has no single
`surface` — clay surfaces are per-hue, so `surface-1` … `surface-4` hold the pastel
ramp instead of an elevation ramp." The numbering is a slot index, not an ascent.
The full list of tokens that keep their `--clay-*` names is in the header of
`assets/tokens.um-aliases.css`; the load-bearing ones are `--clay-shadow-h` / `-s` /
`-l` (three numbers the shadow atoms compose, and the knob the per-surface hue match
turns), `--clay-border-hc` (the forced-colors border) and the four shadow atoms.

**Corner smoothing is not a token, and its absence is deliberate.** §4 states it: the
squircle geometry is a Figma corner-smoothing setting at `0.6`, and `border-radius`
draws a circular arc with no interoperable superellipse control for a custom property
to feed. Carry the 0.6 in the Figma library and the design spec. Do not invent a token
for it.

## 1. Colour

Every ratio below is doc §7's, computed there and quoted here so it can be recognised
on sight. `ui-morphism-core:a11y-validate` is still the thing that decides pass or
fail on anything this skill emits, and it is the only thing in this marketplace that
computes a ratio.

| Token | Light | Dark | Ratio | Note |
|---|---|---|---|---|
| `--clay-bg` | `#F4F1FB` | `#221D2E` | — | Tinted off-white, never `#FFF`. §3: pure white kills the float. |
| `--clay-bg-alt` | `#EDE7FF` | `#2A2438` | — | Section banding. |
| `--clay-surface` | `#FFFFFF` | `#2F2942` | — | The neutral clay card. |
| `--clay-lavender` | `#C7B9FF` | `#4A3E7A` | 8.87:1 light with `--clay-ink`; 8.18:1 dark with `#F2EFFA` | |
| `--clay-sky` | `#9FD8F5` | `#2C5670` | 10.22:1 with `--clay-ink` | |
| `--clay-mint` | `#8FE3B8` | `#2A5B45` | 10.40:1 with `--clay-ink` | |
| `--clay-butter` | `#FFD9A0` | `#5C4726` | 11.77:1 with `--clay-ink` | |
| `--clay-coral` | `#FFB3A7` | `#6A3730` | 9.20:1 with `--clay-ink` | |
| `--clay-primary` | `#5B3AE0` | `#A78BFA` | 6.72:1 with white; 6.01:1 dark with `#221D2E` | Also 6.02:1 against `--clay-bg`, which is what makes it usable as the focus colour. |
| `--clay-danger` | `#C7442C` | `#F09182` | 4.89:1 with white | Passes AA, fails AAA for body copy. |
| `--clay-ink` | `#241F3A` | `#F2EFFA` | 14.13:1 on light bg; 14.42:1 on dark bg | |
| `--clay-ink-muted` | `#4A4363` | `#B9B2CC` | 8.28:1 on `--clay-bg` | |
| `--clay-ink-on-clay` | `#241F3A` | `#F2EFFA` | see the pastel rows | Equal to `--clay-ink` in both themes by construction. It exists to record the intent "this is the ink that sits on a coloured clay surface". |

**The palette rule, stated once.** Every pastel is chosen so that `--clay-ink` clears
8:1 on it. Dark ink on pastel, never white. Saturated action colours are darkened
until *white* passes on them, which is why `--clay-danger` is `#C7442C` and not
`#E8573F`.

Known-bad pairs, quoted from §7 so they can be recognised rather than recomputed:

| Pair | Ratio | Verdict |
|---|---|---|
| `#FFFFFF` on `#FFB3A7` coral | 1.71:1 | Catastrophic fail. The single most common clay mistake. |
| `#FFFFFF` on `#E8573F` | 3.58:1 | Fails AA body text — the reason that red was rejected for `--clay-danger`. |
| `#C7B9FF` lavender against `#F4F1FB` page | 1.59:1 | Fails 1.4.11 as a *boundary*. See §3 below: this is the surface-edge problem, not a text problem. |

## 2. Geometry, shadow, type, space, motion

| Token | Value | Note |
|---|---|---|
| `--clay-r-chip` | `999px` | Pills, tags, avatars. Already at its geometric maximum; it does not scale with intensity. |
| `--clay-r-btn` | `20px` | Buttons. |
| `--clay-r-input` | `18px` | Inputs. Held at `--clay-r-btn` minus 2px across the ramp. |
| `--clay-r-card` | `32px` | Cards, panels. |
| `--clay-r-modal` | `40px` | Sheets, dialogs. Held at `--clay-r-card` plus 8px across the ramp. |
| `--clay-border` | `0 solid transparent` | A border **shorthand**, not a colour. Clay's edge is the shadow, so the width is zero — routing it through a token means one place to switch it on. |
| `--clay-border-hc` | `2px solid ButtonText` | Forced-colors only. Declared once, consumed by **both** forced-colors blocks in §5. |
| `--clay-rim` | `inset 0 1px 1px 0 hsl(0 0% 100% / .35)` | Specular edge. Cheap and disproportionately convincing; also the first layer to drop for perf. |
| `--clay-sheen` | `inset 0 10px 18px -6px hsl(0 0% 100% / .62)` | Top highlight. |
| `--clay-shade` | `inset 0 -10px 18px -6px hsl(258 45% 30% / .32)` | Bottom shade. |
| `--clay-drop-1` | `0 8px 16px -6px …/.28` | Elevation 1 — chips. |
| `--clay-drop-2` | `0 14px 26px -8px …/.30` | Elevation 2 — buttons. |
| `--clay-drop-3` | `0 24px 44px -12px …/.32` | Elevation 3 — cards. |
| `--clay-drop-4` | `0 38px var(--clay-blur-max) -16px …/.35` | Elevation 4 — modals. Drawn at exactly the ceiling, so the budget is the value. |
| `--clay-1` … `--clay-4` | `rim, sheen, shade, drop-N` | The composed rungs. Paint order is declaration order, **first layer on top**. |
| `--clay-pressed` | three layers, insets inverted | Dark inset on top, bright inset below, a short drop. |
| `--clay-blur-max` | `68px` | The per-layer perf budget from §8, expressed as a value. |
| `--clay-backdrop` | `blur(0)` | Clay is opaque, so the default is a no-op. Raised only on the §12 glass hybrid; `prefers-reduced-transparency` drops it to `none`. |
| `--clay-font` | `"Nunito", "Plus Jakarta Sans", ui-rounded, system-ui, sans-serif` | Rounded sans. §3: sharp grotesks visually fight the puffed geometry. |
| weights | `500 / 600 / 700` | Never 300-400 for UI labels. |
| `--clay-fs-xs` … `-3xl` | `13 / 15 / 17 / 20 / 25 / 31 / 39 px` | 1.25 ratio. |
| `--clay-lh-body` / `-display` | `1.55` / `1.18` | |
| `--clay-sp-1` … `-14` | `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 px` | |
| `--clay-gap` | `24px` | Minimum grid gap. Below it the drop shadows overlap and read as mud. |
| `--clay-dur-press` | `90ms` | Depth collapse. |
| `--clay-dur-release` | `260ms` | Spring back. |
| `--clay-dur-hover` | `180ms` | Lift. |
| `--clay-ease-out` | `cubic-bezier(.2,.8,.2,1)` | Press-in and hover. |
| `--clay-ease-squish` | `cubic-bezier(.34,1.56,.64,1)` | Overshoot **on release only**. |
| `--clay-focus-color` | `#5B3AE0` light, `#C7B9FF` dark | 6.02:1 against `--clay-bg`. |
| `--clay-focus-width` / `-offset` | `3px` / `3px` | The offset is required: a ring drawn on the element edge disappears into the drop shadow. |
| `--clay-target-min` | `48px` | Not the 24px SC 2.5.8 floor. §4 gives two style-specific reasons for the headroom: a `--clay-r-chip` pill rounds the corners off its own box, and the press state shrinks the element with `scale(.97)`, taking the hit box with it. 48px absorbs both and also clears 2.5.5 AAA. |

**Rung assignment comes from the component role, not from the geometry of whatever
shadow was there before.** Chips sit on `--clay-1`, buttons on `--clay-2`, cards on
`--clay-3`, modals and sheets on `--clay-4`. This is §4's elevation labelling and it
is fixed. §7 below is the conversion procedure that follows from it.

**Shadow hue follows the surface's own colour.** §5 ships the map; hold it, because a
neutral shadow is the fastest way to make clay look cheap (§3, §10).

| Surface | `--clay-shadow-h` |
|---|---|
| `--clay-surface` (white) | `258` — the default |
| `--clay-lavender` | `258` |
| `--clay-sky` | `202` |
| `--clay-mint` | `152` |
| `--clay-butter` | `36` |
| `--clay-coral` | `8` |

## 3. The independent surface colour, and the forced-colors border

Two facts carry this style, and both are consequences of one thing: **a clay element
has its own background colour and floats above the ground, where a neumorphic element
shares the ground's colour and is extruded out of it** (§1).

**Fact one — the independence is what makes clay pass contrast checks at all.** §1 and
§3 both state it, and §7 attributes clay's viability to it directly. A surface whose
background equals the page background is neumorphism wearing clay's shadows, and it is
the 1.4.11 failure. This skill refuses to generate one, and `scripts/clay-scan.mjs`
fails a run that contains one.

**Fact two — the independence does not by itself satisfy 1.4.11, and this is where
clay quietly fails.** The boundary of a clay button is made of *shadow*, and a soft
shadow at 30% alpha over a similar-lightness background rarely reaches 3:1 against the
adjacent colour. §7's own worked case: `#C7B9FF` against `#F4F1FB` is **1.59:1**. The
two mitigations §7 states, in order:

1. Keep the surface-to-background lightness delta at 3:1 or better — pick a darker
   surface.
2. Add a `1px` `hsl(258 40% 55% / .55)` inset ring that survives independently of the
   blur. That ring is `--um-claymorphism-border-strong` in the alias sheet, and it is
   what every control's edge is measured against.

Test the **element edge**, not the text. A green contrast table for the text says
nothing about whether the button has a visible boundary.

**And forced-colors deletes the shadow outright.** In Windows High Contrast Mode the
user agent forces `box-shadow: none` and `text-shadow: none`. Since clay's entire
structure is the shadow, a clay UI collapses into undifferentiated blocks of `Canvas`
unless a real border is put back. Every generated component therefore ships a
`@media (forced-colors: active)` block that sets `border: var(--clay-border-hc)` —
`2px solid ButtonText`.

**Clay deviates from siblings 01, 02 and 03 here, on purpose.** Those three write
`forced-color-adjust: none` in that block. Clay does **not**: §5 and §7 argue that
clay's whole boundary story is fill-vs-fill, so once the UA has substituted system
colours the correct behaviour is to let them win and rebuild the boundary with a real
border. There is therefore no `forced-color-adjust` declaration in the block at all —
`auto` is the initial value, so declaring it would be dead code.

## 4. Intensity → knobs

Doc §13's knob table, verbatim:

| Knob | Min | Reference (intensity 50) | Max | Effect |
|---|---|---|---|---|
| `radiusScale` | 8px card / 6px button | 32px / 20px | 48px / 28px | Corner puff; below 16px on controls the style stops reading as clay |
| `insetStrength` | sheen 0.00 / shade 0.00 | sheen 0.62 / shade 0.32 | sheen 0.85 / shade 0.48 | The inflation itself; 0 yields a flat tinted card |
| `dropDepth` | `0 2px 4px -2px` @ 0.12 | `0 24px 44px -12px` @ 0.32 | `0 44px 76px -16px` @ 0.42 | How far the object floats; also the main perf lever |
| `surfaceChroma` | 0.02 oklch (near-grey) | 0.09 oklch (pastel) | 0.16 oklch (candy) | Palette saturation; above 0.16 the dark-ink contrast floor starts breaking |
| `squishAmount` | `scale(1.00)` | `scale(0.97)` + 1px translate | `scale(0.93)` + 3px translate | Press deformation; capped at 0.93 because further shrink makes 24px targets miss their own hit area |

`assets/intensity.contract.json` is what runs; this section is the same contract in
prose, for reading. Do not resolve intensity by hand — hand the contract path to
`ui-morphism-core:token-emit` and let core's bundled resolver run it.

**Default 50, and its provenance.** Doc 04 is the one doc in the set whose §13 inputs
are a bullet list rather than a table, so it states the range (`0-100`) without stating
a default beside it. 50 is the doc's own reference point twice over: §13's knob table
labels its middle column "Reference (intensity 50)", and §5's React implementation
declares `intensity = 50` as the default prop on both `ClaySurface` and `ClayButton`.
`MARKETPLACE.md` §7.2 lists claymorphism at 50 as well. Recorded as a derivation
because a default the doc does not state in its inputs list must not look like a doc
figure.

### The curve

Every knob states three anchors — 0, 50 and 100 — and a straight line cannot reach all
three, so every knob is piecewise-linear through them:

```
knob(t) = t <= 50 ? MIN + (REF - MIN) * (t / 50)
                  : REF + (MAX - REF) * ((t - 50) / 50)
```

Each knob's scalar drags companions with it. `radiusScale`'s scalar is the **card**
radius, which is what §13's cells lead with; the button ramp is the same cells'
second figure, and input and modal hold their §4 offsets from it (`button - 2px`,
`card + 8px`). `insetStrength`'s scalar is the **sheen** alpha; the shade is the same
cells' second figure and the rim is derived — `sheen × 0.35 / 0.62`, because §13 tables
no rim endpoint, §4 ships `--clay-rim` at 0.35 against a 0.62 sheen, and §5's React
reference scales rim and sheen by the same factor. `dropDepth`'s scalar is the drop's
**Y offset**; blur, spread and alpha are the same cells' other figures.

**Rounding, stated because §13 does not state it for this style.** Radii and the three
drop lengths round to integer px; alphas to two decimal places, matching §4's own
`.62` / `.32` / `.35`; chroma to three, because two cannot keep the ramp monotone
between 0.02 and 0.09; the squish scale to three; the press translate to one.

**Inset geometry does not move with intensity.** §5's React `claySoftShadow` scales the
inset offset and blur by `k = intensity / 50` as well as the alphas. §13's knob table —
which is the contract — names only the alphas, so this plugin holds the inset offset at
`10px` and the inset blur at `18px` from §4 and moves the alphas alone. §5 is the doc
showing the shape; §13 is the doc setting the ceiling. Recorded here as a derivation so
the divergence from the React listing is visible rather than accidental.

### Resolved, every five points

Read the row; do not recompute. Alphas are the light theme's — see the dark band in §5.

| intensity | radius card/btn | sheen | shade | rim | drop (y / blur / spread) | drop alpha | chroma | squish | translateY |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 8px / 6px | 0.00 | 0.00 | 0.00 | 2px / 4px / -2px | 0.12 | 0.020 | scale(1.000) | 0px |
| 5 | 10px / 7px | 0.06 | 0.03 | 0.04 | 4px / 8px / -3px | 0.14 | 0.027 | scale(0.997) | 0.1px |
| 10 | 13px / 9px | 0.12 | 0.06 | 0.07 | 6px / 12px / -4px | 0.16 | 0.034 | scale(0.994) | 0.2px |
| 15 | 15px / 10px | 0.19 | 0.10 | 0.10 | 9px / 16px / -5px | 0.18 | 0.041 | scale(0.991) | 0.3px |
| 20 | 18px / 12px | 0.25 | 0.13 | 0.14 | 11px / 20px / -6px | 0.20 | 0.048 | scale(0.988) | 0.4px |
| 25 | 20px / 13px | 0.31 | 0.16 | 0.17 | 13px / 24px / -7px | 0.22 | 0.055 | scale(0.985) | 0.5px |
| 30 | 22px / 14px | 0.37 | 0.19 | 0.21 | 15px / 28px / -8px | 0.24 | 0.062 | scale(0.982) | 0.6px |
| 35 | 25px / 16px | 0.43 | 0.22 | 0.24 | 17px / 32px / -9px | 0.26 | 0.069 | scale(0.979) | 0.7px |
| 40 | 27px / 17px | 0.50 | 0.26 | 0.28 | 20px / 36px / -10px | 0.28 | 0.076 | scale(0.976) | 0.8px |
| 45 | 30px / 19px | 0.56 | 0.29 | 0.31 | 22px / 40px / -11px | 0.30 | 0.083 | scale(0.973) | 0.9px |
| **50** | **32px / 20px** | **0.62** | **0.32** | **0.35** | **24px / 44px / -12px** | **0.32** | **0.090** | **scale(0.970)** | **1px** |
| 55 | 34px / 21px | 0.64 | 0.34 | 0.36 | 26px / 47px / -12px | 0.33 | 0.097 | scale(0.966) | 1.2px |
| 60 | 35px / 22px | 0.67 | 0.35 | 0.38 | 28px / 50px / -13px | 0.34 | 0.104 | scale(0.962) | 1.4px |
| 65 | 37px / 22px | 0.69 | 0.37 | 0.39 | 30px / 54px / -13px | 0.35 | 0.111 | scale(0.958) | 1.6px |
| 70 | 38px / 23px | 0.71 | 0.38 | 0.40 | 32px / 57px / -14px | 0.36 | 0.118 | scale(0.954) | 1.8px |
| 75 | 40px / 24px | 0.73 | 0.40 | 0.41 | 34px / 60px / -14px | 0.37 | 0.125 | scale(0.950) | 2px |
| 80 | 42px / 25px | 0.76 | 0.42 | 0.43 | 36px / 63px / -14px | 0.38 | 0.132 | scale(0.946) | 2.2px |
| 85 | 43px / 26px | 0.78 | 0.43 | 0.44 | 38px / 66px / -15px | 0.39 | 0.139 | scale(0.942) | 2.4px |
| 90 | 45px / 26px | 0.80 | 0.45 | 0.45 | 40px / **68px** (clamped from 70) / -15px | 0.40 | 0.146 | scale(0.938) | 2.6px |
| 95 | 46px / 27px | 0.83 | 0.46 | 0.47 | 42px / **68px** (clamped from 73) / -16px | 0.41 | 0.153 | scale(0.934) | 2.8px |
| 100 | 48px / 28px | 0.85 | 0.48 | 0.48 | 44px / **68px** (clamped from 76) / -16px | 0.42 | 0.160 | scale(0.930) | 3px |

The input radius is the button column minus 2px and the modal radius is the card
column plus 8px, at every row: 18px / 40px at intensity 50, 4px / 16px at 0, 26px /
56px at 100.

**The blur clamp fires above intensity 78 and must be reported every run.** `dropDepth`
reaches 76px at 100 and `--clay-blur-max` is 68px, so the top fifth of the range
resolves to the ceiling. That is a clamp that changes an emitted value, and it goes in
the audit's Corrections section with the requested value beside the applied one.

**What the knobs write.** Intensity rewrites a small set of custom properties on the
style root and nothing else in `assets/tokens.css` is touched:

```css
[data-clay-root] {
  --clay-r-card: <card>;  --clay-r-btn: <button>;
  --clay-r-input: calc(var(--clay-r-btn) - 2px);
  --clay-r-modal: calc(var(--clay-r-card) + 8px);
  --clay-rim:   inset 0 1px 1px 0 hsl(0 0% 100% / <rim>);
  --clay-sheen: inset 0 10px 18px -6px hsl(0 0% 100% / <sheen>);
  --clay-shade: inset 0 -10px 18px -6px hsl(var(--clay-shadow-h) 45% 30% / <shade>);
  --clay-drop-3: 0 <y>px <blur>px <spread>px
                 hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / <alpha>);
  --clay-squish: <scale>;  --clay-press-y: <translateY>;
}
```

Rungs 1, 2 and 4 keep their §4 proportions to rung 3, which is the reference the knob
table's `dropDepth` cells describe.

**Chroma without a build step.** Scale pastels in CSS with relative colour syntax,
holding L and H so the hue and the 70-90% lightness band survive:

```css
[data-clay-root] {
  --clay-chroma: 0.090;                                  /* intensity 50 */
  --clay-lavender: oklch(from #C7B9FF l var(--clay-chroma) h);
}
```

OKLCH `l` is perceptual lightness, not WCAG relative luminance, so holding it keeps
contrast close but does not freeze it. Every scaled surface goes to
`ui-morphism-core:a11y-validate` before it ships. Where relative colour syntax is
unavailable, ask `ui-morphism-core:token-emit` for pre-resolved hexes at the chosen
chroma rather than computing them here.

**Intensity 0 is a discrete, usable rung, not "nothing".** It is a flat pastel-tinted
card: 8px card / 6px button radius, no rim, no sheen, no shade, a hairline
`0 2px 4px -2px` drop at 0.12 alpha still tinted with the surface hue, chroma pulled
back to 0.02, and no press deformation. It keeps everything that is not ornament — its
**own** background colour rather than the page ground, dark `--clay-ink` on every
pastel, a 3px focus ring at 3px offset, and 48×48 targets. It is recognisable as plain,
fully accessible, and still not neumorphism: §10 and §12 are explicit that a surface
whose colour equals the page background is the other style and the 1.4.11 failure, so
intensity 0 flattens the *volume* and never the *surface colour*.

## 5. Hard clamps, independent of intensity

These do not move at any intensity, in any scope, for any user request.

| Clamp | Value | Source |
|---|---|---|
| Shadow layers per element | ≤ 4 — rim, sheen, shade, drop | §8, §13 item 3 |
| Blur per layer | ≤ 68px anywhere (`--clay-blur-max`) | §4, §8 |
| Blur on anything that repeats | ≤ 48px | §8 budget, §13 item 3 |
| Clay elements per viewport | ≤ 40 | §8 |
| Dark sheen alpha | ≤ 0.20 | §13 item 8 — the chalky-grey guard |
| Dark shade alpha | ≥ 0.45 | §13 item 8 |
| `squishAmount` | ≥ `scale(0.93)` | §13: further shrink makes 24px targets miss their own hit area |
| Nested clay elevation levels | ≤ 2 in one subtree | §9, §13 anti-pattern |
| Grid gap | ≥ 24px (`--clay-gap`) | §3, §4 |
| Hit target | ≥ 48px (`--clay-target-min`), measured **while pressed**; never below the 24×24 SC 2.5.8 floor | §4, §7 item 11 |
| Focus ring | `outline` ≥ 3px at ≥ 3px offset, never removed, never a `box-shadow` | §4, §7 |
| Padding versus radius | ≥ `border-radius × 0.75` on any card whose text can wrap | §7, SC 1.4.12 |
| Surface colour | never equal to the page background | §10, §12, §13 anti-pattern |
| Drop shadow hue | matched to the surface at 28-35% alpha; never neutral `rgba(0,0,0,α)` on a coloured surface | §3, §10, §13 anti-pattern |
| `box-shadow` in motion | never inside a `transition` or `@keyframes` property list on a repeating selector | §6, §8, §13 item 9 |
| `forced-color-adjust` | never `none` | §5, §7, §13 anti-pattern |
| Clay illustration weight | ≤ 150KB as AVIF/WebP; no Spline scene above the fold on mobile | §8, §13 anti-pattern |

## 6. Context caps, which override intensity

| Context | Cap |
|---|---|
| `surface: data-dense` | intensity → **0**. §9: clay costs roughly a quarter to a third of usable content area against a flat card, and §13's anti-pattern list names data tables, financial statements, medical records and admin dashboards outright. Applying the full stack wholesale to such a surface is a **refusal**, answered with accent-only scoping; this cap is what happens when clay is nonetheless scoped onto one. §9 calls the result by its plain name: ship flat. |
| `register: high-gravity` | intensity → **0**. §9: banking core flows, insurance, legal, medical records, government services and security tooling. The flat rung keeps the token layer, the focus ring and the target sizes and drops the volume that carries the toy register. |
| `repeating: true` | `dropDepth.blur ≤ 48px` on any selector this run judges to match a list, grid or carousel item (§8, §13 item 3). |
| `viewport: under-480` | `dropDepth.blur ≤ 32px` and `insetStrength.rim → 0`, matching §8's `(prefers-reduced-data: reduce), (max-width: 480px)` block: `--clay-drop-3` to `0 12px 22px -8px` @ 0.30, `--clay-drop-4` to `0 18px 32px -10px` @ 0.32, `--clay-rim` to `none`. |
| `density: compact` | `radiusScale ≤ 32px`. §7 SC 1.4.12: padding must stay ≥ `radius × 0.75`, and compact trades padding for density, so the radius comes down with it. Targets still floor at `--clay-target-min`. |
| `prefers-reduced-motion: reduce` | Runtime, not a cap: the spring and the lift come off and an instant depth change replaces them. |
| `forced-colors: active` | Runtime: shadows to `none`, `--clay-border-hc` in their place, system colours. |

Report every cap that fired in the audit's Corrections section, with the requested
value beside the applied value, **including the ones that changed nothing**.

## 7. Converting an existing surface

§13 step 2: "replaces flat `border` + `box-shadow` declarations with the four-layer
clay stack, raises `border-radius` to the clay scale, and swaps neutral shadow colours
for hue-matched ones derived from each element's own background."

The order matters, because two of the five steps can refuse the conversion outright.

1. **Decide whether the element gets the stack at all.** §13 step 3: the full stack
   goes only to elements that can be *proven* interactive — `button`, `a`,
   `[role=button]`, `input`, `[tabindex]`, a framework `onClick` handler. Everything
   else is a static panel and takes `--clay-drop-1` and nothing more. Applying the
   stack to both recreates neumorphism's "everything looks pressable" problem in a new
   costume (§7, SC 1.4.1).
2. **Pick the rung from the role, not from the old shadow.** Chip → `--clay-1`,
   button → `--clay-2`, card → `--clay-3`, modal or sheet → `--clay-4`. There is no
   `reach`-style geometric conversion here and there should not be: §4 assigns rungs by
   component, and a 2px `0 1px 2px` shadow on a card is evidence the card was flat, not
   evidence it belongs on rung 1.
3. **Give the surface its own colour.** If the element's background equals the page
   ground, that is the conversion — pick a pastel from the ramp, or derive one, and say
   so. An element that keeps the ground's colour and gains clay's shadows is
   neumorphism (§1, §12) and is refused.
4. **Derive the shadow hue from the surface you just picked**, via the §2 map, and set
   `--clay-shadow-h` on the element. Neutral `rgba(0,0,0,α)` is replaced, not kept.
5. **Raise the radius to the clay scale** and check §7's padding rule at the same time:
   `padding ≥ border-radius × 0.75` on anything whose text can wrap, or the text clips
   against the curve at 200% zoom and WCAG 1.4.12 text spacing.

**Inputs and wells invert the recipe.** They read recessed rather than inflated, which
is §5's two-layer inset shadow, and is the one place clay borrows neumorphism's
direction on purpose:

```css
box-shadow:
  inset 0 6px 12px -6px hsl(var(--clay-shadow-h) 45% 30% / .34),
  inset 0 -4px 8px -6px hsl(0 0% 100% / .55);
```

**There is no conversion for an existing inset-only neumorphic surface.** Refuse and
explain: the same-hue extrusion is a different style with a different failure mode, and
the correct answer is either clay's inverted input recipe above or `neumorphism-ui`.

## 8. Budgets to report

| Item | Budget | Source |
|---|---|---|
| Shadow layers per element | ≤ 4 | §8, §13 item 3 |
| Clay elements per viewport | ≤ 40 | §8 |
| Blur on any layer | ≤ 68px | §4, §8 |
| Blur on anything that repeats | ≤ 48px | §8, §13 item 3 |
| Nested clay elevation levels | ≤ 2 per subtree | §9, §13 |
| Clay illustration, AVIF/WebP | ≤ 150KB each | §8 |
| Spline / WebGL scene above the fold on mobile | 0 | §8, §13 |
| CSS asset weight for the style itself | near zero — a few hundred bytes of custom properties | §8 |
| Rendering + Painting share of main-thread time during a scroll trace | ≤ 25% | §8 |
| Frame rate on a 4× CPU-throttled profile | ≥ 55fps | §8 |
| Layout shift attributable to shadows | 0 — shadows never affect layout, so any CLS is coming from the images | §8 |
| `will-change` selectors | at most the element currently being interacted with, `transform` only, removed afterwards | §8 |

**Cheaper fallbacks, in §8's order of savings:** drop the 1px rim light (one full layer
for very little visual cost); replace the outer drop with `filter: drop-shadow()` only
if the element has transparency, otherwise keep `box-shadow`, which is cheaper for
opaque rectangles; replace the two insets with a single `linear-gradient` background
overlay, which is a gradient fill rather than a blur and is markedly cheaper; and below
`(max-width: 480px)` or `(prefers-reduced-data: reduce)`, halve every blur and drop to
`--clay-1`.
