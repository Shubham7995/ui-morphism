# Maximalism tokens — machine-readable

Source of truth: `docs/06-maximalism.md` §4 (token table and ready-to-paste block), §7
(contrast figures, light and dark), §8 (budgets), §13 (intensity knobs). Every number below
is copied from those sections. Nothing here is derived from memory, and nothing here
overrides the doc. If a value in this file and a value in the doc disagree, the doc is right
and this file is stale.

Ready-to-paste artefacts live next door in `../assets/`:

| File | What it is |
|---|---|
| `assets/tokens.css` | The `:root` + both dark blocks, verbatim from doc §4 |
| `assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror, from doc §5 |
| `assets/tokens.um-aliases.css` | `--um-maximalism-*` bridge onto the shared grammar |

## 0. Two name spaces, one set of values

The style's own prefix is `--max-*`. The shared grammar that `ui-morphism-core:token-emit`
consumes is `--um-<style>-<group>[-<variant>]`, specified in `docs/00-comparison-matrix.md`
§7. Both are emitted: `--max-*` carries the literal values, `--um-maximalism-*` aliases onto
them, in that direction only, so the verbatim §4 block stays the single place a value is
written.

Groups this style populates: `bg`, `surface`, `ink`, `border`, `accent`, `radius`, `shadow`,
`blur`, `noise`, `space`, `font`, `text`, `leading`, `tracking`, `dur`, `ease`, `focus`,
`target`.

Groups it deliberately does not populate, with the doc's reason:

| Group | Why not |
|---|---|
| `elev` | §3: elevation here is a hard offset at zero blur, so the shadow ladder *is* the elevation ladder. The style's real depth device is the layer stack, and §4 states in as many words that the layer budget is not a token because nothing in CSS can count layers. |
| `saturate` | There is no `backdrop-filter` in this style. `--max-boost` is a `filter` applied to imagery, and §4 is explicit that it is never applied to text, so it is not a backdrop saturation. |
| `danger` | §4 declares no destructive hue; the palette is expressive, not semantic. Binding one of the six accents to `danger` would put a colour into an error state §7 has not measured for it — orange is 2.70:1 on paper and fails even the 3:1 non-text bar. |
| `weight` | §4 declares no weight tokens. Weight lives in the family stack: a display face is chosen, not dialled. |

Three tokens have no home in the closed group vocabulary and keep their `--max-*` names:
`--max-boost` (the imagery filter), `--max-lift` (the hover translate distance), and the
three role bindings `--max-text-on-paper` / `--max-text-on-ink` / `--max-accent-safe`, which
are not a colour ramp but a legality rule expressed as custom properties.

## 1. Colour, and the rule that makes it survivable

Two ground anchors do all the legibility work; six accents do the shouting. **Every accent
is decoration on one of the two grounds and text on the other, and which is which flips
between themes.** That is the whole palette rule, and it is why components consume the role
bindings rather than the raw accents.

| Token | Light | Dark | Note |
|---|---|---|---|
| `--max-paper` | `#FFF8E7` | `#0B0A0F` | Warm cream, near-black in dark. The grounds swap; the names do not. |
| `--max-ink` | `#0B0A0F` | `#FFF8E7` | Paper on ink is **18.63:1** in both themes. |
| `--max-surface` | `#FFFFFF` | `#17141F` | The opaque content plane. Never translucent over a pattern. |
| `--max-surface-2` | `#F2ECDA` | `#221D2E` | Second plane, 2% darker than paper. |
| `--max-muted` | `#4A4553` | `#B9B2C6` | Disabled text and metadata: 9.26:1 on the light surface, 8.86:1 on the dark one. |
| `--max-magenta` | `#FF2E88` | `#FF5BA0` | |
| `--max-lime` | `#C6FF00` | `#C6FF00` | Does not lift; it is already at the top of the ramp. |
| `--max-cyan` | `#00E5FF` | `#00E5FF` | Does not lift. Also the focus ring's inner colour. |
| `--max-violet` | `#6C2BD9` | `#B18CFF` | |
| `--max-cobalt` | `#1B39FF` | `#7EA0FF` | |
| `--max-orange` | `#FF6B00` | `#FF8A33` | |
| `--max-violet-deep` | — | `#6C2BD9` | Dark mode only. |
| `--max-cobalt-deep` | — | `#1B39FF` | Dark mode only. |

**Light mode**, from §7. On ink `#0B0A0F`: lime **16.63:1** ✅, cyan **12.82:1** ✅, orange
**6.91:1** ✅, magenta **5.63:1** ✅, violet 2.80:1 ❌, cobalt 2.89:1 ❌. On paper `#FFF8E7`:
violet **6.64:1** ✅, cobalt **6.45:1** ✅, magenta 3.31:1 ⚠️ (large text ≥ 18.66px bold /
24px regular, and non-text only), orange 2.70:1 ❌ — which fails even the 3:1 non-text bar —
cyan 1.45:1 ❌, lime 1.12:1 ❌.

**Dark mode**, from §7's second table. The grounds have swapped, so `--max-paper` is the
near-black and `--max-ink` is the cream:

| Accent (dark ramp) | Value | On `--max-paper` `#0B0A0F` | On `--max-ink` `#FFF8E7` |
|---|---|---|---|
| `--max-lime` | `#C6FF00` | **16.63:1** ✅ | 1.12:1 ❌ |
| `--max-cyan` | `#00E5FF` | **12.82:1** ✅ | 1.45:1 ❌ |
| `--max-orange` | `#FF8A33` | **8.39:1** ✅ | 2.22:1 ❌ |
| `--max-cobalt` | `#7EA0FF` | **7.85:1** ✅ | 2.37:1 ❌ |
| `--max-violet` | `#B18CFF` | **7.58:1** ✅ | 2.46:1 ❌ |
| `--max-magenta` | `#FF5BA0` | **6.82:1** ✅ | 2.73:1 ❌ |
| `--max-violet-deep` | `#6C2BD9` | 2.80:1 ❌ | **6.64:1** ✅ |
| `--max-cobalt-deep` | `#1B39FF` | 2.89:1 ❌ | **6.45:1** ✅ |

Read the two right-hand columns together: **not one lifted accent clears 3:1 on the cream
surface.** That is why the dark block carries two ramps rather than one rotated palette.

### The role bindings

| Token | Light | Dark | Means |
|---|---|---|---|
| `--max-text-on-paper` | `var(--max-violet)` — 6.64:1 | `var(--max-lime)` — 16.63:1 | The only accent legal as text on the ground colour |
| `--max-text-on-ink` | `var(--max-lime)` — 16.63:1 | `var(--max-violet-deep)` — 6.64:1 | The only accent legal as text on the ink colour. `--max-cobalt-deep` at 6.45:1 is the interchangeable alternative in dark. |
| `--max-accent-safe` | `var(--max-magenta)` | `var(--max-magenta)` | Passes AA on the ground in both themes; on the opposite surface it is large-text and non-text only |

Binding `--max-text-on-ink` to the *lifted* violet in dark mode — the mistake an earlier
draft of the doc shipped — puts `#B18CFF` on cream at 2.46:1, a hard 1.4.3 failure on the
one token whose entire job is to make that failure impossible. Check this binding
specifically in every audit.

Known-bad pairs, quoted so they can be recognised on sight rather than recomputed.
`ui-morphism-core:a11y-validate` is still the thing that decides pass or fail:

| Pair | Ratio | Verdict |
|---|---|---|
| Lime `#C6FF00` text on paper `#FFF8E7` | 1.12:1 | Catastrophic fail |
| Cyan `#00E5FF` text on paper `#FFF8E7` | 1.45:1 | Fail 1.4.3 and 1.4.11 |
| Orange `#FF6B00` on paper `#FFF8E7` | 2.70:1 | Fails 1.4.3 and the 3:1 non-text bar — decorative only |
| Lifted violet `#B18CFF` on cream `#FFF8E7` in dark mode | 2.46:1 | Fail 1.4.3, and the most likely one to ship |
| Magenta `#FF2E88` as a lone border on paper | 3.31:1 | Sits right on the 1.4.11 line; never the only boundary |
| Cream `#FFF8E7` on magenta `#FF2E88` | 3.31:1 | Large text only — 20px display weight qualifies, 16px body does not |

## 2. Geometry, shadow, type, space, motion

| Token | Value | Note |
|---|---|---|
| `--max-stroke-1 / -2 / -3` | `2px` / `3px` / `6px` | Solid `--max-ink`. Everything is outlined; the outline is the grid. |
| `--max-r-0 / -1 / -2 / -3` | `0` / `4px` / `14px` / `28px` | Mix within one composition — a single consistent radius reads as a different style. |
| `--max-r-pill` | `999px` | |
| `--max-r-blob` | `42% 58% 63% 37% / 51% 42% 58% 49%` | Organic sticker shape. |
| `--max-shadow-hard` | `6px 6px 0 var(--max-ink)` | Zero blur is the signature. |
| `--max-shadow-press` | `2px 2px 0 var(--max-ink)` | Active state. |
| `--max-shadow-stack` | `4px 4px 0 #FF2E88, 8px 8px 0 #00E5FF, 12px 12px 0 var(--max-ink)` | Three-layer chromatic. Counts as one loud layer. |
| `--max-lift` | `-4px` | Hover translate. |
| `--max-blur-halo` | `28px` | Only behind content, never over text. |
| `--max-grain-opacity` | `0.08` light, `0.05` dark | Range 0.04-0.12. Grain reads louder on dark, so it is halved there. |
| `--max-boost` | `saturate(1.35) contrast(1.06)` | Imagery only, never text. `saturate(1.18) contrast(1.02)` in dark. |
| `--max-grain` | inline `feTurbulence` data URI, `baseFrequency 0.8`, `numOctaves 3` | A **visible print texture** here, unlike the same filter in docs 01 and 03. Do not copy this opacity ceiling into either of those. |
| `--max-font-display` | `"Archivo Expanded", "Anton", system-ui, sans-serif` | |
| `--max-font-kicker` | `"Archivo Condensed", "Oswald", sans-serif` | |
| `--max-font-body` | `"Inter", system-ui, -apple-system, sans-serif` | |
| `--max-font-mono` | `"JetBrains Mono", ui-monospace, SFMono-Regular, monospace` | Four families. There is no fifth. |
| `--max-t-cap` … `--max-t-3xl` | `12 / 14 / 16 / 20 / 28 / 42 / 64` px | Ratio ≈ 1.5. |
| `--max-t-hero` | `clamp(3rem, 12vw, 11rem)` | 48px floor, 176px ceiling. Check the floor actually fits at 320px and 200% zoom. |
| `--max-track-display` / `--max-track-kicker` | `-0.04em` / `0.14em` | |
| `--max-leading-display` / `--max-leading-body` | `0.9` / `1.55` | |
| `--max-s-1` … `--max-s-7` | `4 / 8 / 12 / 20 / 32 / 52 / 84` px | Fibonacci-adjacent. `density` multiplies by 1.25 / 1.0 / 0.7. |
| `--max-tilt-s / -m / -l` | `-1.5deg` / `-3deg` / `5deg` | The sign lives here; the magnitude ceiling comes from the `tiltRange` knob. |
| `--max-dur-tap / -hover / -enter / -marquee` | `120ms` / `220ms` / `420ms` / `24s` | |
| `--max-ease-snap` | `cubic-bezier(0.2, 0.9, 0.1, 1.25)` | Overshoot past 1 — that is what makes a hard-shadow button feel physical. |
| `--max-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances. |
| `--max-focus-inner` / `--max-focus-outer` | `var(--max-cyan)` / `var(--max-ink)` | Cyan against ink is 12.82:1, so the ring is visible against *itself* over any photograph. |
| `--max-focus-w` / `--max-focus-offset` | `4px` / `2px` | |
| `--max-focus-ring` | `var(--max-focus-w) solid var(--max-focus-inner)` | The `outline` shorthand the `:focus-visible` rule consumes. The outer halo is a `box-shadow`, because an element gets only one outline. |
| `--max-target-min` | `44px` | Not the 24px SC 2.5.8 floor. See §3. |

## 3. Why the target minimum is 44px and not 24px

SC 2.5.8's floor is 24×24 CSS px. This style ships 44px, and the reason is mechanical rather
than generous.

A rotated element hit-tests against its **axis-aligned bounding box after the transform**,
not against the box you drew. Rotation shrinks the usable inner area relative to the drawn
one. The hard offset shadow then works in the opposite direction: it makes the element look
6 to 12px bigger than it is on two sides, so the user aims at a target that is not there.
A sticker button at `--max-tilt-l` with `--max-shadow-hard` and a nominal 32px box is
comfortably under the floor once both are accounted for.

So: every interactive element takes `min-height` and `min-width` from `--max-target-min`
rather than a literal — a literal is what drifts — and the check is re-run on the transformed
box. Static analysis can find every rotated control; it cannot measure one. The measurement
is a Manual TODO in every report, naming the elements.

## 4. Intensity → knobs

Curves are from §13, and the machine-readable form is
`${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json`, which is what actually runs. Three of
the five knobs are counts, so their ladders are stepped; two are linear.

```
layerCount(t)   = t < 50 ? 1 : t < 75 ? 2 : 3                 # hard cap 3, always
chromaSpread(t) = 1 + floor(t / 20), capped at 6              # accents admitted
chroma(t)       = 0.10 + 0.002 * t                            # OKLCH C each accent is scaled to
shadowStack(t)  = round(2 + 0.10 * t)                         # px, deepest offset, half up
tiltRange(t)    = 0.05 * t                                    # deg, magnitude ceiling
motionLoad(t)   = t < 34 ? 0 : t < 67 ? 1 : t < 90 ? 2 : 3    # ambient loops
```

Resolved, every five points. Read the row, do not recompute:

| intensity | layerCount | chromaSpread | chroma | shadowStack | tiltRange | motionLoad |
|---|---|---|---|---|---|---|
| 0 | 1 | 1 | 0.100 | 2px | 0deg | 0 |
| 5 | 1 | 1 | 0.110 | 3px | 0.25deg | 0 |
| 10 | 1 | 1 | 0.120 | 3px | 0.5deg | 0 |
| 15 | 1 | 1 | 0.130 | 4px | 0.75deg | 0 |
| 20 | 1 | 2 | 0.140 | 4px | 1deg | 0 |
| 25 | 1 | 2 | 0.150 | 5px | 1.25deg | 0 |
| 30 | 1 | 2 | 0.160 | 5px | 1.5deg | 0 |
| 35 | 1 | 2 | 0.170 | 6px | 1.75deg | 1 |
| 40 | 1 | 3 | 0.180 | 6px | 2deg | 1 |
| **45** | **1** | **3** | **0.190** | **7px** | **2.25deg** | **1 → 0** |
| 50 | 2 | 3 | 0.200 | 7px | 2.5deg | 1 |
| 55 | 2 | 3 | 0.210 | 8px | 2.75deg | 1 |
| **60** | **2** | **4** | **0.220** | **8px** | **3deg** | **1** |
| 65 | 2 | 4 | 0.230 | 9px | 3.25deg | 1 |
| 70 | 2 | 4 | 0.240 | 9px | 3.5deg | 2 |
| 75 | 3 | 4 | 0.250 | 10px | 3.75deg | 2 |
| 80 | 3 | 5 | 0.260 | 10px | 4deg | 2 |
| 85 | 3 | 5 | 0.270 | 11px | 4.25deg | 2 |
| 90 | 3 | 5 | 0.280 | 11px | 4.5deg | 3 |
| 95 | 3 | 5 | 0.290 | 12px | 4.75deg | 3 |
| 100 | 3 | 6 | 0.300 | 12px | 5deg | 3 |

Row 60 is the default: two loud layers, four accents at chroma 0.22 — inside §3's stated 4-7
hues at chroma 0.18-0.30 — an 8px shadow, a 3deg tilt ceiling and one ambient loop. Row 45 is
the ceiling `surfaceType: app-accent` imposes; its `motionLoad` is written `1 → 0` because
the cap alone leaves one ambient loop and the context clamp then removes it, which is §13's
"forbids marquees and patterned grounds on data surfaces" stated as a number.

**What the knobs write.** Nothing in `assets/tokens.css` is edited. The resolved values are
written as overrides onto the scene root, and everything else inherits:

```css
[data-max-scene] {
  --max-shadow-hard: <shadowStack>px <shadowStack>px 0 var(--max-ink);
  --max-shadow-stack: <round(d/3)>px <round(d/3)>px 0 var(--max-magenta),
                      <round(2d/3)>px <round(2d/3)>px 0 var(--max-cyan),
                      <d>px <d>px 0 var(--max-ink);
  --max-tilt-s: <-0.3 * tiltRange>deg;
  --max-tilt-m: <-0.6 * tiltRange>deg;
  --max-tilt-l: <tiltRange>deg;
  --max-s-1 … --max-s-7: <scale × 1.25 | 1.0 | 0.7 per density>;
}
```

`layerCount`, `chromaSpread` and `motionLoad` write no custom property at all. They are
composition decisions: how many loud planes the scene may spend, how many accents enter the
palette, how many infinite animations exist. A number no stylesheet consumes should not be
declared as one — §4 makes exactly this argument about the layer budget.

**Chroma without a build step.** Scale accents in CSS with relative colour syntax, holding L
and H so the hue and lightness of the brand colour survive:

```css
[data-max-scene] {
  --max-chroma: 0.22;                                          /* intensity 60 */
  --max-magenta: oklch(from #FF2E88 l var(--max-chroma) h);
}
```

OKLCH `l` is perceptual lightness, not the luminance WCAG measures, so holding it keeps
contrast close but does not freeze it. Every scaled accent goes to
`ui-morphism-core:a11y-validate` before it ships, and a scaled accent that no longer clears
its role binding's bar loses the role, not the check. Where relative colour syntax is
unavailable, ask `ui-morphism-core:token-emit` for pre-resolved hexes at the chosen chroma.

## 5. Hard clamps, independent of intensity

These do not move at any intensity, in any context, for any user request.

| Clamp | Value | Source |
|---|---|---|
| Loud layers per viewport | ≤ **3** | §3, §6, §13 |
| Shadow blur | exactly `0` | §3, §4 |
| Target size | ≥ 44px from `--max-target-min`, re-measured after transform, never below the 24×24 SC 2.5.8 floor | §4, §7 |
| Focus ring | 4px inner at 2px offset, plus the ink halo as a `box-shadow` | §4, §7 |
| Grain opacity | 0.04-0.12; shipped 0.08 light, 0.05 dark | §3, §4 |
| Font families | ≤ 4 | §3, §13 |
| Font payload | ≤ 180 KB total | §8, §13 |
| Raster noise or pattern assets | 0 bytes | §8, §13 |
| Full-area colour change | ≤ 2.5 Hz, minimum period 400ms | §6, §7 |
| Blend modes | never on a full-viewport overlay, never outside `isolation: isolate` | §8, §13 |
| Absolute ornament | none below the 640px breakpoint; no horizontal overflow at 320px | §7, §13 |
| Text on pattern | never, without an opaque plane behind it | §7, §13 |
| Pause control | on every infinite animation, plus a Calm toggle wherever one is emitted | §6, §7 |

## 6. Context caps, which override intensity

| Context | Cap |
|---|---|
| `surfaceType: app-accent` | intensity ≤ 45, then `layerCount ≤ 1` and `motionLoad = 0`; marquees and patterned grounds forbidden outright on data surfaces |
| `motionPolicy: state-only` | `motionLoad = 0`; state transitions unaffected |
| `motionPolicy: none` | `motionLoad = 0`, and state transitions collapse to 1ms at emit time |
| `prefers-reduced-motion: reduce` | runtime, not a cap: ambient and infinite motion stops, state feedback survives, large tilts flatten |
| Calm mode (`data-calm="true"`) | runtime: same as above, plus the texture layers drop — and it is user-controllable, which the media query is not |
| `forced-colors: active` | runtime: patterns and grain hidden, boundaries fall back to real borders in system colours |

Report every cap that fired, with the requested value and the applied value, including the
ones that changed nothing.

## 7. Converting an existing surface

| Input | Becomes | Rule |
|---|---|---|
| A blurred `box-shadow` | `<d>px <d>px 0` at the resolved `shadowStack` depth | Blur goes to zero. The offset is the knob's, not the source's — this style's shadow is a solid duplicate of the box, so a blurred shadow's reach has no meaning to preserve. |
| A uniform `border-radius` | The mixed set: `--max-r-0`, `--max-r-2`, `--max-r-pill`, `--max-r-blob` in one composition | A single consistent radius is what makes a maximalist attempt read as ordinary flat design. |
| A 1px hairline border | `--max-stroke-1` (2px), `-2` (3px) or `-3` (6px) | Everything is outlined. Never 0 — a shadow-only boundary vanishes under forced colours. |
| A single font family | The display + kicker + body + mono quartet | Mixing weights alone is not maximalism. Four is also the ceiling. |
| A flat background fill | One CSS-generated patterned ground, if the layer budget has room | 0 bytes: `repeating-linear-gradient`, halftone `radial-gradient`, `repeating-conic-gradient`. Never an image. |
| A raster noise texture | `--max-grain`, the inline `feTurbulence` data URI | 200-600 KB becomes ≤ 2 KB. |
| An accent used as body text on the ground | The role binding for that ground | The accent's own hex is what the check will fail on; the role binding is the fix, not a rewrite of the palette. |

## 8. Budgets to report

| Item | Budget | Source |
|---|---|---|
| Display typefaces, all families | ≤ 180 KB total | §8 |
| Font families | ≤ 4 | §3, §13 |
| Grain / noise texture | ≤ 2 KB — inline SVG data URI, or a 160×160 tile at ≤ 4 KB | §8 |
| Patterned grounds | 0 KB — CSS gradients only | §8 |
| Collage cut-outs and stickers | ≤ 250 KB total, AVIF with alpha or SVG | §8 |
| Hero imagery | ≤ 200 KB, AVIF, `srcset` at 480/960/1440, explicit dimensions | §8 |
| Images above the fold | ≤ 600 KB | §8 |
| JS, compressed | ≤ 120 KB | §8 |
| LCP | ≤ 2.5s on throttled 4G / mid-tier Android | §8 |
| CLS | ≤ 0.1 | §8 |
| INP | ≤ 200ms — the one to watch, and a design-phase constraint rather than an engineering cleanup | §8 |
| Composited layers per scene | 25-40 is the routine range; `isolation: isolate` per scene roughly halves blend cost | §8 |
| Animated hover shadows | ≤ 8 simultaneously visible cards before moving to a translated pseudo-element | §8 |
