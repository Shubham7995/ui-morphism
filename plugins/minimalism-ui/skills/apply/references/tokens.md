# Minimalism tokens — machine-readable

Source of truth: `docs/05-minimalism.md` §4 (token table and ready-to-paste block),
§3 (the visual invariants), §6 (motion), §7 (contrast figures and the pass/fail
checklist), §8 (budgets), §13 (intensity knobs). Every number below is copied from
those sections. Nothing here is derived from memory, and nothing here overrides the
doc. If a value in this file and a value in the doc disagree, the doc is right and
this file is stale.

Ready-to-paste artefacts live next door in `../assets/`:

| File | What it is |
|---|---|
| `assets/tokens.css` | The `:root` + both dark blocks, verbatim from doc §4 |
| `assets/tokens.theme.css` | The Tailwind v4 `@theme` mirror, from doc §5 |
| `assets/tokens.um-aliases.css` | `--um-minimalism-*` bridge onto the shared grammar |

## 0. Two name spaces, one set of values

The style's own prefix is `--min-*`. The shared grammar that
`ui-morphism-core:token-emit` consumes is `--um-<style>-<group>[-<variant>]`,
specified in `docs/00-comparison-matrix.md` §7. Both are emitted: `--min-*` carries
the literal values, `--um-minimalism-*` aliases onto them. Ask `token-emit` for the
`--um-minimalism-*` set; ship `assets/tokens.css` alongside it so the aliases resolve.

The prefix is not decoration. Doc §4 is explicit that minimalism is the one style in
this set whose natural names — `--surface-1`, `--accent`, `--text-muted` — are also the
names a host application has most likely already taken. Do not strip `--min-`, and do
not introduce a second, unprefixed dialect anywhere.

Groups this style populates: `bg`, `surface`, `ink`, `border`, `accent`,
`accent-subtle`, `danger`, `radius`, `elev`, `shadow`, `blur` (as an explicit `0px`),
`saturate` (as an explicit `1`), `space`, `font`, `text`, `weight`, `leading`,
`tracking`, `dur`, `ease`, `focus`, `target`.

Groups it deliberately does not populate, with the doc's reason:

| Group | Why not |
|---|---|
| `noise` | No grain layer exists. §3 and §8: a minimal surface is a solid `background-color` plus a 1px border, and the absence of a texture pass is half of why the style is the cheapest in the set. |
| `surface-3` / `surface-4` | §4 ships two planes plus a hover step. A third and fourth plane is how a monochrome system starts encoding hierarchy in luminance it cannot spare. |
| `ease-enter` | §4 declares `standard` and `exit` only. There is no separate entrance curve; `standard` is it. |

Unlike brutalism, `elev` **is** populated here, and populated separately from `shadow`.
Doc §4 gives elevation three steps — `0, 1, 2` — and names the zero rung out loud:
"Elevation 0 is a real, named rung." The intensity knob `decorationBudget` counts rungs,
so the semantic name is the thing it moves.

Tokens with no home in the closed group vocabulary, which keep their `--min-*` names and
are consumed directly: `--min-surface-hover` (the row hover step — not a `surface-N`,
which ascends by elevation), `--min-text-secondary` and `--min-text-disabled` (the `ink`
group has three rungs and this style ships four foreground greys), `--min-shadow-0` (the
named zero rung; the vocabulary's shadow ladder starts at 1), `--min-dur-instant`,
`--min-text-4xl` / `-5xl` (the two display rungs §3 confines to marketing),
`--min-space-24`, `--min-control-sm` / `-md` / `-lg`, `--min-measure`, and
`--min-border-width`.

## 1. Colour

Every ratio below is quoted from `docs/05-minimalism.md` §4 and §7. This plugin computes
none of them; `ui-morphism-core:a11y-validate` computes every ratio that any emitted pair
is judged on.

| Token | Light | Dark | Ratio | Note |
|---|---|---|---|---|
| `--min-bg-canvas` | `#FFFFFF` | `#0A0A0A` | — | Pure white is acceptable here; the style has no glare-scattering shadows to compensate for. |
| `--min-bg-subtle` | `#FAFAFA` | `#131313` | — | Page-level wash behind cards. |
| `--min-surface-1` | `#FFFFFF` | `#161616` | — | Card / panel. |
| `--min-surface-2` | `#F5F5F5` | `#1E1E1E` | — | Input wells, code blocks, hover rows. |
| `--min-surface-hover` | `#F0F0F0` | `#242424` | — | Row and list-item hover only. |
| `--min-border-subtle` | `rgb(0 0 0 / 0.08)` ≈ `#EBEBEB` | `rgb(255 255 255 / 0.10)` | 1.2:1 | **Decorative separators only.** Never the sole indicator of a control. |
| `--min-border-strong` | `#8F8F8F` | `#7A7A7A` | 3.23:1 | Interactive control boundaries. See §3. |
| `--min-text-primary` | `#0A0A0A` | `#FAFAFA` | ≥ 18:1 both ways | |
| `--min-text-secondary` | `#525252` | `#B4B4B4` | 7.8:1 / 9.5:1 | §7 states the light figure to two decimals as 7.81:1. |
| `--min-text-muted` | `#737373` | `#8F8F8F` | 4.74:1 on white | The darkest grey you may call "muted", and the lightest legal body grey. |
| `--min-text-disabled` | `#A3A3A3` | `#6B6B6B` | 2.52:1 | Exempt from 1.4.3, and must never encode information alone. |
| `--min-accent` | `#2563EB` | `#60A5FA` | 5.17:1 on white / 7.8:1 on `#0A0A0A` | Exactly one accent hue. |
| `--min-accent-hover` / `-active` | `#1D4ED8` / `#1E40AF` | `#93C5FD` / `#BFDBFE` | — | Interaction steps on the single accent. |
| `--min-accent-fg` | `#FFFFFF` | `#0A0A0A` | — | Text on accent fill. |
| `--min-accent-subtle` | `#EFF6FF` | `#101C2E` | — | Selected-row / tinted-badge **ground** only. Never a text colour, never a border. |
| `--min-danger` / `-fg` | `#DC2626` / `#FFFFFF` | `#F87171` / `#0A0A0A` | 4.83:1 on `--min-surface-1` in light | The only second hue permitted. |
| `--min-focus-ring` | `#2563EB` | `#93C5FD` | — | |

Known-bad values, quoted from §7 and §10 so they can be recognised on sight rather than
recomputed. `ui-morphism-core:a11y-validate` is still the thing that decides pass or fail:

| Value | Ratio on `#FFFFFF` | Verdict |
|---|---|---|
| `#8A8A8A` | 3.45:1 | Fails body text, passes large text |
| `#999999` | 2.85:1 | Fails everything — the single most common "secondary text" defect |
| `#A3A3A3` | 2.52:1 | Disabled text only |
| `#AAAAAA` | 2.32:1 | Fails everything |
| `#E5E5E5` hairline | 1.26:1 | Fine as a decorative row separator; **never** a control's only boundary |
| `#949494` | 3.03:1 | The exact 1.4.11 boundary on white — the lightest grey that clears the bar |
| `#959595` | 2.995:1 | Already below the bar. WCAG does not round up to meet a threshold |

**Palette rule, stated once:** exactly one accent hue plus one danger hue, and no more.
Doc §10: a third and fourth hue "for variety" is where minimal systems die. The neutral
ramp carries everything else, and the emitted palette holds ≤ 11 neutral steps.

## 2. Geometry, shadow, type, space, motion

| Token | Value | Note |
|---|---|---|
| `--min-border-width` | `1px` | Never scaled. §4: the hairline is the style. |
| `--min-radius-sm / -md / -lg / -full` | `4 / 8 / 12 / 9999px` | `md` is the component default. Radius never varies by component type within one system (§3). |
| `--min-shadow-0` | `none` | A real, named rung. |
| `--min-shadow-1` | `0 1px 2px rgb(0 0 0 / 0.04)` (dark `0 1px 2px rgb(0 0 0 / 0.40)`) | Resting cards; often omitted entirely. |
| `--min-shadow-2` | `0 4px 12px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04)` (dark `0 8px 24px rgb(0 0 0 / 0.50), 0 1px 2px rgb(0 0 0 / 0.40)`) | Overlays only. |
| `--min-backdrop-blur` / `--min-backdrop-saturate` | `0px` / `1` | Declared, never omitted. This is the anti-glassmorphism contract. |
| `--min-font-sans` | `Inter, "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | One family. |
| `--min-font-mono` | `"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace` | Code and numerics only. |
| `--min-text-xs … -5xl` | `12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48px`, declared in `rem` | Nine steps, ratio 1.200 (minor third). |
| `--min-leading-tight / -snug / -normal` | `1.2 / 1.4 / 1.5` | 1.5 body; also SC 1.4.12's floor. |
| `--min-tracking-tight` / `-display` | `-0.011em` at ≥ 24px / `-0.02em` at ≥ 36px | Optical correction only. Body tracking is `0`. |
| `--min-weight-normal / -medium / -semibold` | `400 / 500 / 600` | §4: no weight above 600 in this style. |
| `--min-measure` | `65ch` (max `75ch`) | Bringhurst's 45–75 CPL. Expressed in `ch` so it grows at 200% zoom. |
| `--min-space-1 … -24` | `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px` | 4px base unit. |
| `--min-control-sm / -md / -lg` | `32 / 36 / 40px` | 40px is the default resting size. |
| `--min-target-min` | `24px` | The SC 2.5.8 hard floor, **not** the resting size. |
| `--min-dur-instant / -fast / -base / -slow` | `100 / 150 / 200 / 300ms` | Anything over 300ms reads as sluggish here. |
| `--min-ease-standard` / `--min-ease-exit` | `cubic-bezier(0.2, 0, 0, 1)` / `cubic-bezier(0.4, 0, 1, 1)` | No spring, no control point outside `[0,1]`. |
| `--min-focus-ring-width` / `-offset` | `2px` / `2px` | Additive ring, outside the element. |

**Rung assignment does not change with intensity.** Ordinary cards sit at elevation 0 or
1; genuine overlays — menus, dialogs, toasts, popovers, command palettes — sit at 2.
Everything else is flat. What intensity changes is how many rungs are *available*
(`decorationBudget`), never which rung a component is assigned.

**Spacing carries grouping, not dividers.** §3: 6–8px between a label and its field,
24–32px between field groups. The 4:1 ratio between within-group and between-group
spacing is what produces perceived grouping without a rule line, which is why
`whitespaceMultiplier` scales only the between-group half of the ramp
(`--min-space-8` upward). Scaling both would cancel the knob out.

## 3. The two borders, and the compensating pass

This style's signature failure is not a bad colour. It is a **deleted affordance**, and
the token layer encodes the difference in two names that look interchangeable and are not.

- `--min-border-subtle` — `rgb(0 0 0 / 0.08)`, about `#EBEBEB` on white, **1.2:1**. A
  decorative separator between two rows. It is legal, it is idiomatic, and it may never
  be the only thing telling a user where a control begins.
- `--min-border-strong` — `#8F8F8F`, **3.23:1**. The control boundary. §7 puts the exact
  1.4.11 threshold on white at `#949494` (3.03:1), so `#8F8F8F` clears it with margin.

The ubiquitous `#E5E5E5` hairline is **1.26:1**. As a row separator that is fine. As the
edge of an input, a secondary button, an unchecked checkbox, a toggle track or a slider
rail it is a 1.4.11 failure, and it is the failure this style ships most often.

Which is why doc §13 step 7 exists and why it runs **always**, at every intensity, in
every scope: *affordance restoration*. It is the only additive step in an otherwise
subtractive skill.

| Restored | From | To |
|---|---|---|
| Ghost primary button | transparent fill, transparent or hairline border | `--min-accent` fill with `--min-accent-fg` text |
| Control boundary below 3:1 | `--min-border-subtle` or a host hairline | `--min-border-strong` |
| Link with its underline stripped | colour-only | underline, or an underline on `:hover` at `text-underline-offset: 3px` |
| Missing focus indicator | `outline: none`, or nothing at all | `outline: var(--min-focus-ring-width) solid var(--min-focus-ring); outline-offset: var(--min-focus-ring-offset)` |
| Icon-only target under the floor | a 16px glyph | `min-width: var(--min-target-min)`, resting size from `--min-control-lg` |

`affordanceFloor` is the knob that governs how much of this is applied, and it is
deliberately **inverted**: raising overall `intensity` *raises* it. Aggressive minimalism
increases the risk of lost affordance, so the skill compensates rather than compounds.
Its clamp floor is 40, so even the least aggressive run still ships a filled primary
button, a 3:1 boundary, an underline and a focus ring.

**Dark mode.** Every dark value is declared twice, per the shared emission shape: under
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and again under
`:root[data-theme="dark"]`, so a system preference and an explicit toggle each win in
both directions. `assets/tokens.css` already does this. A partial override — half the
palette left on the light theme's values — is the bug that produces `#8F8F8F` text on
`#161616`. For Tailwind the overrides live outside `@theme`, because `@theme` may never
be nested inside an at-rule.

## 4. Intensity → knobs

Curves, clamps, the default and both context caps are
`../../../assets/intensity.contract.json`, which is doc §13's knob table encoded. Do not
resolve intensity by hand: hand it and the requested intensity to
`ui-morphism-core:token-emit`, which owns the resolver. This table is the same thing in
prose, for reading.

Three knobs state an anchor at the default intensity that a straight line between the
endpoints cannot reach, and the contract records why for each: a linear `chromaBudget`
would emit a ramp louder than §3's own stated `0.02` ceiling at the default, a linear
`whitespaceMultiplier` would ship a 144px section gap as the out-of-the-box rhythm
against §3's stated 64–96px, and a linear `typeContrast` would generate a 1.241 ratio the
doc does not ship against §4's stated 1.200. Two knobs are stepped rather than
continuous, because a shadow rung and a font weight are counts, not lengths.

Resolved, every five points. Read the row, do not recompute:

| intensity | chromaBudget | accentCoverage | decorationBudget | shadowOpacityMax | whitespaceMultiplier | typeContrast | weightMax | affordanceFloor |
|---|---|---|---|---|---|---|---|---|
| 0 | 0.060 | 15.0% | 3 | 0.120 | 0.75 | 1.414 | 600 | 40 |
| 5 | 0.057 | 14.3% | 3 | 0.115 | 0.77 | 1.396 | 600 | 40 |
| 10 | 0.053 | 13.6% | 3 | 0.110 | 0.79 | 1.378 | 600 | 40 |
| 15 | 0.050 | 12.9% | 3 | 0.105 | 0.81 | 1.361 | 600 | 40 |
| 20 | 0.047 | 12.2% | 3 | 0.100 | 0.83 | 1.343 | 600 | 40 |
| 25 | 0.043 | 11.5% | 2 | 0.095 | 0.85 | 1.325 | 600 | 40 |
| 30 | 0.040 | 10.8% | 2 | 0.090 | 0.88 | 1.307 | 600 | 40 |
| 35 | 0.037 | 10.1% | 2 | 0.085 | 0.90 | 1.289 | 600 | 40 |
| 40 | 0.033 | 9.4% | 2 | 0.080 | 0.92 | 1.271 | 600 | 40 |
| 45 | 0.030 | 8.7% | 2 | 0.075 | 0.94 | 1.253 | 600 | 45 |
| 50 | 0.027 | 8.0% | 1 | 0.070 | 0.96 | 1.236 | 600 | 50 |
| 55 | 0.023 | 7.3% | 1 | 0.065 | 0.98 | 1.218 | 600 | 55 |
| **60** | **0.020** | **6.6%** | **1** | **0.060** | **1.00** | **1.200** | **600** | **60** |
| 65 | 0.018 | 5.9% | 1 | 0.052 | 1.13 | 1.191 | 600 | 65 |
| 70 | 0.015 | 5.2% | 1 | 0.045 | 1.25 | 1.181 | 600 | 70 |
| 75 | 0.013 | 4.5% | 0 | 0.037 | 1.38 | 1.172 | 500 | 75 |
| 80 | 0.010 | 3.8% | 0 | 0.030 | 1.50 | 1.163 | 500 | 80 |
| 85 | 0.007 | 3.1% | 0 | 0.022 | 1.63 | 1.153 | 500 | 85 |
| 90 | 0.005 | 2.4% | 0 | 0.015 | 1.75 | 1.144 | 500 | 90 |
| 95 | 0.002 | 1.7% | 0 | 0.007 | 1.88 | 1.134 | 500 | 95 |
| 100 | 0.000 | 1.0% | 0 | 0.000 | 2.00 | 1.125 | 500 | 100 |

Notes the table cannot carry:

- **`weightMax` never shows 700.** The contract's paired curve states a 700 band below
  intensity 25, and the hard clamp `weightMax ≤ 600` overrides it, because §4 says "No
  weight above 600 in this style" and §3 says 700+ is used sparingly or not at all. The
  clamp fires at every intensity below 25 and is reported as a Correction every time,
  including when it changes nothing.
- **`gradientsAllowed` is true only while `decorationBudget == 3`** — intensity below 25.
  Doc §13 permits "gradients allowed on heroes" at 0 and "no gradients anywhere" at 100
  and states nothing in between; tying the permission to the top rung is this plugin's
  reading, recorded as such in the contract. Gradients are hero-only wherever they are
  permitted at all, and §13 step 6 strips multi-stop gradients from non-overlay elements
  regardless of intensity.
- **`accentCoverage` is a budget to report, not a property to emit.** It is the share of
  painted pixels the accent may occupy, and at the default 6.6% it sits inside the 5–10%
  that §3's "90–95% of painted pixels are neutral" implies. Count accent fills per view
  and report the estimate; do not pretend to have measured pixels.
- **`affordanceFloor` is clamped at 40, not 0.** The contract's curve runs 0→100 and the
  clamp lifts the bottom half of the range. That clamp is what makes every intensity in
  this style ship a usable interface.

**What the knobs write.** Only the root element is touched; nothing in
`assets/tokens.css` is edited:

```css
[data-min-root] {
  --min-space-8:  calc(32px * <whitespaceMultiplier>);
  --min-space-12: calc(48px * <whitespaceMultiplier>);
  --min-space-16: calc(64px * <whitespaceMultiplier>);
  --min-space-24: calc(96px * <whitespaceMultiplier>);
}
```

`decorationBudget`, `typeContrast`, `chromaBudget` and `affordanceFloor` are not custom
properties at all — they are emission decisions. `decorationBudget` decides how many of
`--min-shadow-0/1/2` the generated sheet is allowed to reference; `typeContrast`
regenerates the nine type rungs at the resolved ratio; `chromaBudget` bounds the OKLCH
chroma of the generated neutral ramp; `affordanceFloor` decides how much of §3's
restoration table is applied. Record each resolved value in the audit's Corrections
section whether or not it changed anything.

**Intensity 0 is not nothing, and it is not "no minimalism".** It is a conventional
interface with its affordances intact: the full three-rung elevation ladder, a tinted
neutral ramp, the wide 1.414 type scale, a dense 0.75× rhythm — and, because
`affordanceFloor` is inverted and clamped at 40, still a filled primary button, a
`--min-border-strong` boundary, underlined links, a 2px focus ring at 2px offset and
targets sized from `--min-target-min`. It is an ordinary interface that has not yet been
subtracted from.

## 5. Hard clamps, independent of intensity

These do not move at any intensity, in any scope, for any user request. None of them is a
knob; several are enforced by `ui-morphism-core:a11y-validate` rather than by anything
here.

| Clamp | Value | Source |
|---|---|---|
| Body text contrast | ≥ 4.5:1, and ≥ 3:1 for ≥ 24px or ≥ 18.66px bold | §7, §13 |
| Control boundary contrast | ≥ 3:1 wherever the boundary is the control's only affordance | §7 |
| Focus indicator | `outline`, ≥ 2px at ≥ 2px offset, on 100% of focusables. Never `box-shadow` | §4, §7 |
| Target size | ≥ 24×24 CSS px, taken from `--min-target-min`, never overridden downward | §7, §13 |
| Resting control size | `--min-control-lg` (40px) wherever a control height is possible; 44px on touch-primary surfaces | §7 |
| Weight ceiling | 600 | §4 |
| Chromatic hues | ≤ 2 — one accent, one danger | §13 |
| Neutral steps | ≤ 11 | §13 |
| Backdrop blur | `0px`, declared explicitly, on every base-layer surface | §4, §13 |
| Duration ceiling | ≤ 300ms on every transition and animation | §4, §6 |
| Easing | no control point outside `[0,1]` | §6 |
| Border width | `1px`, never scaled | §4 |
| Measure | `65ch`, max `75ch`, in `ch` or `rem` — never a `px` `max-width` | §7, §13 |
| Radius ceiling | `12px`, plus `9999px` for pills and avatars only | §3, §4 |

Three things the skill may restyle and may never delete, at any intensity: a visible
label, help text or an error message; a required-field marker or a `<legend>`; and the
semantic container of a visually implied group.

## 6. Context caps, which override intensity

Doc §13 states no numeric cap for this style. It states when-not-to-use conditions in §9
instead, and the contract turns two of them into caps. Both resolve to intensity **0** —
this style's least-subtracted rung — and both are **paired with a clamp that raises
`affordanceFloor` to 100**, because `affordanceFloor` is the inverted knob and a cap
alone would move it the wrong way.

| Context | Cap | Paired clamp |
|---|---|---|
| `audience: novice` | intensity 0 | `affordanceFloor ≥ 100` |
| `surfaceType: safety-critical` | intensity 0 | `affordanceFloor ≥ 100` |
| `prefers-reduced-motion: reduce` | runtime, not a cap: translation and looping animation removed, a ≤ 100ms fade kept | — |
| `forced-colors: active` | runtime: every control takes a `ButtonBorder` boundary, the primary action maps to `Highlight`/`HighlightText` | — |

Core's resolver caps intensity; it does not consume `contextClamps`. The skill applies the
paired clamp after resolution and reports it on the same audit line as the cap that
triggered it. Capping intensity for a novice audience without the pair *deletes*
signifiers, which is precisely this style's documented failure mode.

## 7. Converting existing values

§13 steps 2–5 and 8 are quantisations, and two runs have to agree on them.
`../scripts/quantize-scan.mjs` implements exactly these rules and reports the count;
this section is the rule it implements.

**Ramps.** Space `{4, 8, 12, 16, 24, 32, 48, 64, 96}`; radius `{4, 8, 12, 9999}`; type
`{12, 14, 16, 18, 20, 24, 30, 36, 48}`; duration `{100, 150, 200, 300}`; weight
`{400, 500, 600}`.

**Snapping.** Nearest rung. Ties go to the smaller rung by default — the subtractive
direction — with two stated exceptions: `font-size` ties go **up**, because the larger
rung is the legibility-safe direction, and `border-radius` ties go **up**, because the
12px ceiling is what stops the drift and the softer silhouette is the one that survives.
Worked examples:

| Input | Snaps to | Why |
|---|---|---|
| `padding: 15px` | `16px` (`--min-space-4`) | Nearest, no tie |
| `border-radius: 10px` | `12px` (`--min-radius-lg`) | Tie between 8 and 12, radius ties up |
| `font-size: 15px` | `1rem` | Tie between 14 and 16, type ties up |
| `font-size: 14px` | `0.875rem` | On the ramp, but re-expressed in `rem` — `px` type does not respond to the user's text size |
| `font-weight: 450` | `400` | Tie between 400 and 500, weight ties down |
| `transition: 220ms` | `200ms` | Nearest, no tie |
| `transition: 0.6s` | **error, not a rounding** | Above the 300ms ceiling |
| `font-weight: 800` | **error, not a rounding** | Above the 600 ceiling |

**Shadows.** An element's rung comes from its z-role, not from the size of the shadow it
happens to have: overlay selectors — dialog, modal, popover, menu, dropdown, tooltip,
toast, sheet, drawer, command palette, combobox, listbox — take `--min-shadow-2`;
everything else takes `--min-shadow-1` or, where `decorationBudget` is 0, a
`--min-border-subtle` hairline instead. §3 caps resting elevation at "under 8px blur and
under 8% opacity", so a resting shadow above either is reported. A card that loses its
shadow gains a border; it never loses both.

**Colours.** Cluster the inventory, then map: neutrals onto the `--min-bg-*` /
`--min-surface-*` / `--min-text-*` ramp, the dominant chromatic family onto `--min-accent`
and its hover/active steps, the red family onto `--min-danger`, and everything else onto
nothing — a third hue family is an error, not a rounding. Emit the mapping report §13
requires: every replacement made, with the original beside it.

**Gradients.** Multi-stop gradients on non-overlay surfaces become their dominant flat
colour. A gradient on a genuine overlay survives only while `gradientsAllowed` is true.

## 8. Budgets to report

| Item | Budget | Source |
|---|---|---|
| CSS, critical and inlined | ≤ 14 KB compressed — fits the initial congestion window | §8 |
| CSS, total | ≤ 40 KB compressed | §8, §13 item 10 |
| Fonts | ≤ 2 files, ≤ 120 KB total; one variable sans subset to `latin` is 30–45 KB | §8 |
| Icons | inline SVG sprite ≤ 8 KB. Never an icon *font* | §8 |
| Images above the fold | ≤ 150 KB, AVIF/WebP, `fetchpriority="high"` on the LCP one | §8 |
| JS for the visual layer | 0 KB — this style needs no runtime | §8, §13 |
| Accent coverage | the resolved `accentCoverage` for the run; 6.6% at the default | §13, §3 |
| Shadow rungs used | ≤ the resolved `decorationBudget`; 1 at the default | §13 |
| Neutral steps emitted | ≤ 11 | §13 |
| Chromatic hues emitted | ≤ 2 | §13 |
| LCP / INP / CLS, mid-tier 2022 Android throttled 4× | ≤ 2.0s / ≤ 150ms / ≤ 0.05, 60fps on a 500-row list with `content-visibility: auto` | §8 |

**Fonts are the single biggest risk in this style**, because typography carries the whole
hierarchy and a late-swapping webfont produces the most visible CLS on the page. Declare
`font-display: swap` plus `size-adjust` / `ascent-override` on a matched local fallback,
preload exactly one weight-axis file, and prefer one variable font over four static cuts.
If the budget is still blown: drop `--min-shadow-1` entirely and rely on borders, render
list separators as one `background: linear-gradient` on the container rather than N
per-row borders past about 200 rows, and fall back to `system-ui` with zero webfonts,
which costs brand distinctiveness and takes font weight to 0 KB.
