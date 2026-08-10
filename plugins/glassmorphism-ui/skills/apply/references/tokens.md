# Glassmorphism tokens — machine-readable

Source of truth: `docs/03-glassmorphism.md` §4 "Anatomy & Design Tokens". Every value in
this file is copied from that section. Nothing here is derived, rounded or remembered.

| File | What it is |
|---|---|
| `../assets/tokens.css` | The literal `:root` sheet, verbatim from §4 |
| `../assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror plus the `glass-*` composite utility, from §5 |
| `../assets/tokens.um-aliases.css` | The `--um-glassmorphism-*` bridge onto the shared grammar |
| `../assets/glass.layer.css` | `@layer glass` — the ground, grain, focus recipe and all four accessibility blocks (§13 output 3) |

**Polarity.** Glassmorphism is the one dark-first style in the set. Dark values live on
bare `:root`, the light override is the guarded media query
`@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) }`, and the
complete light list is duplicated under `:root[data-theme="light"]`. This mirrors
`00-comparison-matrix.md` §7.4 Rule 3 rather than breaking it; emit it that way and no
other way.

**Naming.** The doc ships `--glass-*`. The shared grammar in `00-comparison-matrix.md`
§7.1 is `--um-<style>-<group>[-<variant>]`. Both names appear in every row below. Emit
through `ui-morphism-core:token-emit`, which owns the grammar, the validating regex, the
output formats and the dark-mode emission shape. This plugin owns only the right-hand
columns — the values, and which groups get populated at all.

---

## 1. Fill ladder — group `surface`

The panel's own `background-color`. Translucent, and only ever declared inside the
`@supports` block; the opaque mirror in §6 is what ships outside it.

| Convention name | Doc name | Dark ground (white tint) | Light ground (ink tint) | Use |
|---|---|---|---|---|
| `--um-glassmorphism-surface-0` | `--glass-fill-0` | `rgba(255, 255, 255, 0.06)` | `rgba(15, 18, 28, 0.28)` | Flush / inline chips |
| `--um-glassmorphism-surface-1` | `--glass-fill-1` | `rgba(255, 255, 255, 0.10)` | `rgba(15, 18, 28, 0.36)` | Cards |
| `--um-glassmorphism-surface-2` | `--glass-fill-2` | `rgba(255, 255, 255, 0.14)` | `rgba(15, 18, 28, 0.44)` | Nav bars, toolbars |
| `--um-glassmorphism-surface-3` | `--glass-fill-3` | `rgba(255, 255, 255, 0.18)` | `rgba(15, 18, 28, 0.52)` | Popovers, menus |
| `--um-glassmorphism-surface-4` | `--glass-fill-4` | `rgba(255, 255, 255, 0.24)` | `rgba(15, 18, 28, 0.60)` | Modals, sheets |

The prose band in §3 (6–24% on dark, 28–60% on light) and this ladder are the same
numbers by construction. Below 0.06 dark / 0.28 light the pane disappears; above ~0.25
dark it stops reading as glass and becomes a tinted card, which is why 0.24 is the top
rung and modals are the only thing allowed there.

## 2. Text scrim — group `surface`, variant `scrim`

| Convention name | Doc name | Dark ground | Light ground |
|---|---|---|---|
| `--um-glassmorphism-surface-scrim` | `--glass-text-scrim` | `rgba(9, 9, 14, 0.56)` | `rgba(255, 255, 255, 0.72)` |

`0.56` is a solved value, not a taste call (doc §7): to guarantee white text at 4.5:1
against a worst-case pure-white backdrop, the composited surface luminance must be
≤ 0.183, which for an `rgb(10, 10, 15)` tint requires **α ≥ 0.558**. The crossing is
α = 0.55734; at 0.555 the composite is L = 0.1852 and white text reaches only 4.46:1,
which fails. Rounded to 0.56. **This is a hard clamp — never lower it for any intensity.**

## 3. Backdrop filter parts — groups `blur`, `saturate`

| Convention name | Doc name | Dark | Light | Use |
|---|---|---|---|---|
| `--um-glassmorphism-blur-0` | `--glass-blur-0` | `8px` | same | Elevation 0 — inline chip |
| `--um-glassmorphism-blur-1` | `--glass-blur-1` | `12px` | same | Elevation 1 — card |
| `--um-glassmorphism-blur-2` | `--glass-blur-2` | `20px` | same | Elevation 2 — nav, toolbar |
| `--um-glassmorphism-blur-3` | `--glass-blur-3` | `28px` | same | Elevation 3 — popover |
| `--um-glassmorphism-blur-4` | `--glass-blur-4` | `40px` | same | Elevation 4 — modal |
| `--um-glassmorphism-saturate` | `--glass-saturate` | `160%` | `150%` | 140–180% usable band |
| *(no group word)* | `--glass-brightness` | `1.06` | `0.98` | Optional; lifts dark backdrops. Consumed under its doc name — see §15 |

Blur scales with the element's z-elevation, not with its size. Composed shorthands, doc §4:

```css
--glass-backdrop-1: blur(var(--glass-blur-1)) saturate(var(--glass-saturate));
--glass-backdrop-2: blur(var(--glass-blur-2)) saturate(var(--glass-saturate));
--glass-backdrop-3: blur(var(--glass-blur-3)) saturate(var(--glass-saturate));
--glass-backdrop-4: blur(var(--glass-blur-4)) saturate(var(--glass-saturate));
```

## 4. Edges — groups `border`, `radius`

| Convention name | Doc name | Dark | Light | Note |
|---|---|---|---|---|
| `--um-glassmorphism-border` | `--glass-border-color` | `rgba(255, 255, 255, 0.22)` | `rgba(15, 18, 28, 0.14)` | 1px, always present |
| `--um-glassmorphism-border-strong` | `--glass-border-strong` | `rgba(255, 255, 255, 0.34)` | `rgba(15, 18, 28, 0.22)` | Hover / focus |
| `--um-glassmorphism-radius-sm` | `--glass-r-sm` | `10px` | same | |
| `--um-glassmorphism-radius-md` | `--glass-r-md` | `16px` | same | Default for cards |
| `--um-glassmorphism-radius-lg` | `--glass-r-lg` | `22px` | same | |
| `--um-glassmorphism-radius-xl` | `--glass-r-xl` | `28px` | same | Sheets |
| `--um-glassmorphism-radius-pill` | `--glass-r-pill` | `999px` | same | |

Radii below 8px make the 1px border look like a stroke rather than an edge (§3).

**`border-strong` is decorative here, not a compliant control boundary.** Doc §7 measures
a `rgba(255,255,255,0.22)` hairline over a light composite at roughly **1.2:1**. Where the
border is the only thing marking an interactive control, `ui-morphism-core:a11y-validate`
must solve it up to 3:1 against the composite and record the correction. That is the
`--glass-target-min: 44px` rationale as well — the user is aiming at an edge they cannot
reliably see.

## 5. Shadows — group `shadow`

| Convention name | Doc name | Dark | Light | Use |
|---|---|---|---|---|
| `--um-glassmorphism-shadow-1` | `--glass-shadow-1` | `0 1px 2px rgba(0, 0, 0, 0.16)` | `0 1px 2px rgba(15, 18, 28, 0.08)` | Resting card |
| `--um-glassmorphism-shadow-2` | `--glass-shadow-2` | `0 8px 32px -8px rgba(0, 0, 0, 0.38)` | `0 8px 32px -8px rgba(15, 18, 28, 0.16)` | Nav, popover |
| `--um-glassmorphism-shadow-3` | `--glass-shadow-3` | `0 24px 64px -16px rgba(0, 0, 0, 0.48)` | `0 24px 64px -16px rgba(15, 18, 28, 0.22)` | Modal |
| `--um-glassmorphism-shadow-inset-top` | `--glass-inner-top` | `inset 0 1px 0 rgba(255, 255, 255, 0.35)` | `inset 0 1px 0 rgba(255, 255, 255, 0.60)` | Slab highlight |
| `--um-glassmorphism-shadow-inset-bottom` | `--glass-inner-bottom` | `inset 0 -1px 0 rgba(0, 0, 0, 0.14)` | `inset 0 -1px 0 rgba(15, 18, 28, 0.06)` | Optional |

Large blur radius, negative spread, never a hard offset. `forced-colors: active` strips
shadows entirely, which is the second reason the 1px border is mandatory.

## 6. Opaque mirror — group `surface`, variant `solid`

Every rung the plugin emits needs a matching solid. This is what renders outside the
`@supports` block, under `prefers-reduced-transparency`, under `prefers-contrast: more`,
at intensity 0, in print, and on `perfTarget: low-end`.

| Convention name | Doc name | Dark | Light |
|---|---|---|---|
| `--um-glassmorphism-surface-solid-1` | `--glass-solid-1` | `#171a24` | `#ffffff` |
| `--um-glassmorphism-surface-solid-2` | `--glass-solid-2` | `#1d2130` | `#f7f8fc` |
| `--um-glassmorphism-surface-solid-4` | `--glass-solid-4` | `#232838` | `#ffffff` |

The doc ships three solids for five rungs: rung 0 borrows `solid-1`, rung 3 borrows
`solid-2`. Do not interpolate new hexes — use the three the doc gives.

## 7. Texture — group `noise`

| Convention name | Doc name | Dark | Light |
|---|---|---|---|
| `--um-glassmorphism-noise-opacity` | `--glass-noise-opacity` | `0.035` | `0.028` |
| *(not a token — see below)* | `feTurbulence baseFrequency` | `0.8`, `numOctaves 4` | same |

`baseFrequency` and `numOctaves` are SVG filter-primitive attributes, and filter
primitives do not read CSS custom properties. They cannot be tokenised, so the grain
recipe lives in the inline `<filter>` markup (`recipes.md` §1) and only its **opacity** is
a token. A `--um-glassmorphism-noise-freq` custom property would look like a control and
change nothing.

Band is 0.02–0.05. This is exactly the fifth layer of Microsoft's published Acrylic
recipe, and it exists to kill banding in the blurred backdrop.

**Use this recipe and no other.** The set carries three deliberately different grain
recipes: `0.8 / 4 octaves at 0.02–0.05` here (soft, de-banding, must not fog the glass);
`0.9 / 2 octaves at 0.04–0.06` in skeuomorphism; `0.8 / 3 octaves at 0.04–0.12` in
maximalism. Copying the wrong one is the usual reason glass looks dirty.

## 8. Foreground — groups `ink`, `accent`, `danger`

| Convention name | Doc name | Dark | Light | Note |
|---|---|---|---|---|
| `--um-glassmorphism-ink` | `--glass-fg` | `rgba(255, 255, 255, 0.94)` | `rgba(12, 14, 22, 0.94)` | Pure `#FFF` blooms against a bright backdrop |
| `--um-glassmorphism-ink-muted` | `--glass-fg-muted` | `rgba(255, 255, 255, 0.66)` | `rgba(12, 14, 22, 0.62)` | Never below 0.60 |
| `--um-glassmorphism-accent` | `--glass-accent` | `#7dd3fc` | `#0369a1` | |
| `--um-glassmorphism-danger` | (doc §6, error state) | `#ff6b81` at `0.55` alpha as a border | same | Never signal by transparency alone |

## 9. Ground — group `bg`

`MARKETPLACE.md` §7.1 states glassmorphism populates no `bg` group, "because it depends on
a ground it does not own". Doc §4 nevertheless ships a default ground, and doc §13 step 3
has the skill *generate* one when the project's background is flat or neutral. Both are
correct: **emit these only in generated-ground mode.** When the project already has a
vivid, structured ground, leave its background tokens alone and populate no `bg` group.

| Convention name | Doc name | Dark | Light |
|---|---|---|---|
| `--um-glassmorphism-bg` | `--glass-ground-base` | `#0b0b12` | `#eef1f8` |
| `--um-glassmorphism-bg-stop-1` | `--glass-ground-1` | `#6d3bff` | same |
| `--um-glassmorphism-bg-stop-2` | `--glass-ground-2` | `#00c2ff` | same |
| `--um-glassmorphism-bg-stop-3` | `--glass-ground-3` | `#ff4d9d` | same |

Glass over flat `#111` is invisible. The style requires a mesh gradient, a photograph, an
aurora wash, or overlapping colour blobs — two to four saturated hues with a luminance
range you control (§3). Treat the ground as a hard dependency, not an option.

## 10. Motion — groups `dur`, `ease`

| Convention name | Doc name | Value | Use |
|---|---|---|---|
| `--um-glassmorphism-dur-fast` | `--glass-dur-out` | `120ms` | Exit |
| `--um-glassmorphism-dur-base` | `--glass-dur-in` | `180ms` | Enter |
| `--um-glassmorphism-dur-slow` | `--glass-dur-blur` | `260ms` | Blur-radius transitions **on mount only** |
| `--um-glassmorphism-ease-standard` | `--glass-ease` | `cubic-bezier(0.2, 0, 0, 1)` | Standard |
| `--um-glassmorphism-ease-exit` | `--glass-ease-out` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Exit |

Full behaviour in `motion.md`.

## 11. Focus — group `focus`

The doc declares no focus custom properties; it writes the ring literally in §5 and §6.
These are those literals, promoted to tokens. The group is mandatory in every style
(`00-comparison-matrix.md` §7.3) precisely because `forced-colors` deletes `box-shadow`,
so the ring may never be a `box-shadow` alone.

| Convention name | Value (dark tone) | Source |
|---|---|---|
| `--um-glassmorphism-focus-color` | `#ffffff` | §5 `.glass-btn:focus-visible`, §6 focus-visible row |
| `--um-glassmorphism-focus-width` | `2px` | same |
| `--um-glassmorphism-focus-offset` | `2px` | same |
| `--um-glassmorphism-focus-halo` | `0 0 0 5px rgba(0, 0, 0, 0.55)` | same — the dark halo behind the ring |

The ring is **two-tone by construction**: a solid `outline` plus a `box-shadow` halo, so
one of the two always has contrast against an unknowable backdrop. The halo is additive
to the outline and is not a substitute for it — do not "fix" it into a single ring.
Under `forced-colors: active` the outline becomes `2px solid Highlight` and the halo is
dropped with the rest of the shadows.

The doc specifies only the dark-tone pair. For `tone: dark` (ink tint on a light ground),
solve the ring colour with `ui-morphism-core:a11y-validate` against the light-tone
composite and record the value chosen in the audit. Do not guess an inverse.

## 12. Hit target — group `target`

| Convention name | Doc name | Value |
|---|---|---|
| `--um-glassmorphism-target-min` | `--glass-target-min` | `44px` |

Theme-independent — declared once, on bare `:root`. SC 2.5.8's floor is 24px; glass sits
at 44 because the panel edge is not a dependable boundary. §7 puts the 1px hairline near
1.2:1 over a light composite, and the composite moves as the user scrolls, so the visible
extent of a control is indeterminate. Glass's signature components (docks, toolbars,
bottom sheets) are touch-first as well, so 44 is the base value rather than a
`pointer: coarse` override. Chips and pills are what this style tempts you to shrink;
floor them here.

## 13. Type and space — groups `text`, `leading`, `weight`, `space`

| Convention name | Value | Source |
|---|---|---|
| `--um-glassmorphism-text-xs` … `-3xl` | `12 / 14 / 16 / 20 / 24 / 32 / 44px` | §4 type scale |
| `--um-glassmorphism-leading-body` | `1.5` | §4 |
| `--um-glassmorphism-leading-display` | `1.15` | §4 |
| `--um-glassmorphism-weight-min` | `400` | §4 — "avoid weights under 400 on glass" |
| `--um-glassmorphism-space-1` … `-7` | `4 / 8 / 12 / 16 / 24 / 32 / 48px` | §4 spacing ramp |

Card padding is 20–24px (§4). Density presets from §13: `compact` / `comfortable` /
`spacious` → padding 12 / 20 / 28px, radius 10 / 16 / 22px.

---

## 14. Elevation ladder — the binding table

This is the table the emitter walks. One row per rung; the rung is the unit, not the
individual token.

| Level | Use | Fill α | Blur | Border α | Shadow |
|---|---|---|---|---|---|
| 0 | Inline chip, tag, badge | 0.06 | 8px | 0.12 | none |
| 1 | Card, tile | 0.10 | 12px | 0.16 | `--glass-shadow-1` |
| 2 | Sticky nav, toolbar, dock | 0.14 | 20px | 0.22 | `--glass-shadow-2` |
| 3 | Popover, dropdown, command palette | 0.18 | 28px | 0.26 | `--glass-shadow-2` |
| 4 | Modal, bottom sheet | 0.24 | 40px | 0.30 | `--glass-shadow-3` |

Border alpha is a per-rung value from this ladder and is *not* in the §4 custom-property
block, which ships only the two named border colours. When emitting per-rung borders,
derive them as `rgba(255,255,255,α)` on dark tone and `rgba(15,18,28,α)` on light tone,
using the α column above.

---

## 15. Vocabulary deviations, stated

Two rows above extend a step range in the closed group vocabulary
(`00-comparison-matrix.md` §7.3). Neither invents a group word.

1. **`surface-0`** — the vocabulary nominates `surface-1`…`-4`; this style's ladder has
   five rungs because elevation 0 (inline chips) is a real, documented rung. The `shadow`
   and `elev` groups already carry `-0`/`-5` steps, so the step range is per-style while
   the group word is fixed. Core's group-vocabulary reference should confirm this reading
   before the first release.
2. **`radius-xl`** — the vocabulary nominates `-sm`, `-md`, `-lg`, `-pill`; §4 ships a
   28px `xl` step for sheets between `lg` and `pill`.

Two §4 properties have no group word at all and therefore keep their `--glass-*` names
rather than being forced into one:

- **`--glass-brightness`** (`1.06` dark / `0.98` light) — an optional term in the
  `backdrop-filter` chain, not a surface property. Inventing a `brightness` group for one
  optional value would widen the closed vocabulary for every style.
- **`--glass-backdrop-1` … `-4`** — the composed `blur() saturate()` shorthands. They are
  compositions of two tokens, not tokens.

Groups this style deliberately leaves empty: `elev` (a rung is fill + blur + border +
shadow together, per §14 — a parallel `elev` ramp would be a second name for the same five
steps), `font` (§4 fixes a scale and a weight floor but no families), `tracking` (§4 ships
no letter-spacing; the 0.12em in §7 is the SC 1.4.12 test condition, not a token), and
`bg` outside generated-ground mode (§9).

Everything else maps one-to-one.
