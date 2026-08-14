---
name: apply
description: >-
  Use when the user NAMES the style — neumorphism, neomorphism, soft UI, new skeuomorphism —
  or describes its concrete moves: same-hue extruded or pressed-in surfaces, a mirrored dual
  shadow like "5px 5px 10px #b8b9be, -5px -5px 10px #fff", embossed toggles or keypads, or a
  thermostat or calculator surface. THE TEST against the two soft-surface siblings: here the
  surface is THE SAME COLOUR AS THE PAGE GROUND, no texture, no material. A surface with its
  own pastel fill is claymorphism-ui; one imitating leather, metal or wood is
  skeuomorphism-ui. "New skeuomorphism" is this skill; "neo-skeuomorphism" is
  skeuomorphism-ui. Also for its one refusal: a same-hue pair measures 1.2:1 to 1.7:1 and can
  never bound a control, so the output is clean neumorphism with a real hairline. ui-morphism
  is descriptive and plural: one named language, measured tokens, a stated when-not-to-use —
  not a design-quality tool. Do NOT use for open-ended quality work — "make it look good",
  "make it modern", "polish this", "clean this up", "make it less AI-generated", taste or
  visual-craft critique, de-slopping, animation craft, or a general accessibility sweep.
  Dedicated design, taste, animation and a11y tools answer those better and should win them.
  Nor for the other named languages: glassmorphism-ui, minimalism-ui, maximalism-ui,
  brutalism-ui, liquid-glass-ui, bento-grid-ui, spatial-ui. To review without editing, use
  neumorphism-ui:audit.
argument-hint: "[scope glob] [--intensity=0-100] [--scope=controls|controls+cards|all] [--density=compact|comfortable|spacious] [--light-source=top-left|top-right|bottom-right|bottom-left] [--dark-mode=none|media|class|both] [--a11y-mode=strict|standard]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/neu-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/02-neumorphism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Neumorphism: apply

A control rendered as a shape extruded from, or pressed into, the page rather than
floating above it. The element's fill is the **exact same colour as its parent**, and the
only thing describing its geometry is a pair of opposing shadows: `box-shadow: D D 2D
<darker>, -D -D 2D <lighter>`, spread 0, one global light source. Everything else — the
large radii, the mid-tone greys, the generous padding — is downstream of that one
decision.

**The central move of this style cannot be made accessible, and that is the first thing
to say out loud.** The pair is same-hue by construction, so it measures **1.23:1** and
**1.59:1** against the light surface and **1.37:1** and **1.30:1** against the dark one —
against the **3:1** SC 1.4.11 requires. The generator's own default is no better at
**1.32:1** and **1.41:1**. There is no value of blur, distance or luminance delta that
closes that gap while the result still looks neumorphic: to clear 3:1 on `#e6e7ee` the
boundary has to be at or below `#848484` (**3.03:1**), and a grey that dark is not a
shadow, it is a border. Then `forced-colors: active` forces `box-shadow: none`, and since
100% of this style's structure is `box-shadow`, 100% of it disappears — including any
focus ring built from one.

So this skill **refuses to ship a same-hue-only boundary**, in every mode, at every
intensity, for every request, including an explicit one. What it ships is the 2026
vocabulary doc §2 records as the only version that ships: **clean neumorphism** — the
same extrusion, plus a real `--nm-hairline` border at **3.20:1** light and **3.31:1**
dark, plus an accent that carries state, with the extrusion demoted to decoration. Say
that to the user in plain words before you write anything; the sentence to use is in
`references/anti-patterns.md` §0.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark
   mode strategy and component root. Never guess, never rewrite silently, and confirm the
   detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` before emitting anything. Do not reproduce token values or
   contrast ratios from memory, and compute none: every ratio in this plugin is doc §4's
   or §7's, and the thing that decides pass or fail on emitted output is
   `ui-morphism-core:a11y-validate`.
3. Establish `scope`. The default is `controls+cards`; doc §13 step 8 restricts the
   treatment to a control allowlist — `button`, `input`, `select`, `[role=switch]`,
   `[role=slider]`, `.card` — and leaves tables, lists and long-form text flat.
   `scope: all` requires an explicit opt-in and prints a warning. Doc §9 rules the style
   out for content-dense surfaces entirely; if the target is an admin console, an
   analytics dashboard, a CRM, an email client or an IDE, say so before you start.
4. Check the base colour has headroom **both ways**. Doc §13 step 2 rejects a base with
   L > 0.96 or L < 0.06: on pure white the highlight has nowhere to go and the effect
   collapses to a one-sided drop shadow.

## Inputs

| Input | Type | Default |
|---|---|---|
| `framework` | vanilla-css \| tailwind-v4 \| react-css-modules \| styled-components \| swiftui \| compose | detected, confirmed |
| `baseColor` | hex / OKLCH | `#e6e7ee` light, `#2a2e39` dark |
| `accentColor` | hex | `#4c5bd4` light, `#8f9dff` dark — re-solved if it fails on the surface |
| `density` | compact \| comfortable \| spacious | comfortable |
| `intensity` | 0–100 | 45 |
| `lightSource` | top-left \| top-right \| bottom-right \| bottom-left | top-left (gradient angle 145deg) |
| `scope` | controls \| controls+cards \| all | controls+cards |
| `darkMode` | none \| media \| class \| both | both |
| `a11yMode` | strict \| standard | strict |
| `target` | glob list | `src/components/ui/**` |

`a11yMode: strict` is the default and it refuses any output that fails SC 1.4.11 rather
than warning about it. `lightSource` is one value for the whole document — doc §13
anti-pattern 8 refuses mixed diagonals and normalises them.

## Procedure

1. **Detect and confirm the stack** — `ui-morphism-core:detect-stack`. Branch every later
   emission decision on its output enum, not on a second read of `package.json`.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — curves, clamps, the
   `contentDensity: dense` cap and the five context clamps, all from doc §13. Do not
   resolve it by hand and do not reach into core's directory: call
   `ui-morphism-core:token-emit`, give it that path and the requested intensity and
   context, and let it run its own bundled `intensity.mjs`. Core owns the resolver; this
   plugin owns the numbers; the JSON file is the whole interface between them.

   Four things the contract leaves to this skill, because core's resolver caps intensity
   rather than individual knobs. Round `distance` to integer px at emit time and derive
   `blur` as exactly twice the **rounded** distance, never scaled independently. Apply the
   two surface clamps after resolution — `distance ≤ 8px` on a list or grid item, `≤ 12px`
   inside a scroller — which are doc §8's 16px and 24px blur ceilings expressed as
   distance. Pin `hairlineOpacity` to 1.0 in `a11yMode: strict`. And send the
   **composited** hairline to `ui-morphism-core:a11y-validate` whenever the opacity
   resolves below 1.0: the 0.55 floor is a clamp, not a guarantee for an arbitrary
   hairline over an arbitrary surface. Record every cap, clamp and rounding, including the
   ones that changed nothing. `references/tokens.md` §4 is the same table in prose, with
   the resolved values at every five points; the JSON is what runs.

3. **Emit the token layer** via `ui-morphism-core:token-emit` under the
   `--um-neumorphism-*` grammar, with `assets/tokens.css` shipped alongside it as the
   `--nm-*` value layer and `assets/tokens.um-aliases.css` as the bridge. Populate `bg`,
   `surface-1`, `ink`, `border`, `border-strong`, `accent`, `danger`, `radius`, `shadow`,
   `space`, `font-body`, `text`, `dur`, `ease`, `focus`, `target`. Do **not** populate
   `blur` — doc §4: backdrop blur has no token at all in this style, and the shadow's own
   blur is geometry carried by `--nm-b-*` — nor `elev`, because elevation *is* the
   distance rung, nor `surface-2`…`surface-4`, because the style has exactly one plane.
   Light values on bare `:root`; dark values duplicated under **both**
   `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and
   `:root[data-theme="dark"]`. For Tailwind v4 emit `assets/tokens.theme.css`'s `@theme`
   shape — never nested inside an at-rule, with the dark overrides outside it. If the user
   supplies a base colour, emit doc §4's perceptual OKLCH derivation quoted in
   `references/tokens.md` §3 instead of the hex block, and keep the hex block as the
   `@supports not (color: oklch(0 0 0))` fallback.

4. **Rewrite the targeted component styles.** For every element in scope: force the
   `background` to the surface token, replace the existing `box-shadow` with the
   neumorphic pair using the conversion rule in `references/tokens.md` §7, snap the radius
   to the nearest `--nm-r-*` rung, and **add `border: 1px solid var(--nm-hairline)` to
   every interactive element** as a non-optional step. Inputs, wells and anything that
   reads as "receiving" take the pressed rung; buttons, cards and panels take the raised
   one. Components and their anatomy are in `references/recipes.md` §§2–6.

5. **Rewrite interaction states** to the table in `references/motion.md`: hover one rung
   up plus `translateY(-1px)`, active to the pressed rung plus `border-color:
   var(--nm-accent)`, disabled to no shadow with muted border and ink. Convert every
   `:focus` to `:focus-visible`, and every `box-shadow`-based focus ring to
   `outline: 3px solid var(--nm-accent); outline-offset: 3px`. The accent, not the shadow
   direction, is what carries state: doc §6 is explicit that the shadow alone cannot be
   the state carrier.

6. **Write the four guard blocks**, mandatory on every generated sheet and specified in
   `references/recipes.md` §7: `@media (forced-colors: active)` restoring
   `border: 2px solid ButtonText` on every generated class with `Highlight` /
   `HighlightText` for selected and `GrayText` for disabled;
   `@media (prefers-reduced-motion: reduce)` zeroing durations while every state change
   still applies; `@media (prefers-reduced-transparency: reduce)` dropping to a single
   soft shadow; and the low-end `@media (update: slow)` fallback. Emit them inside
   `@layer neumorphism` so the whole treatment can be switched off by removing one layer.

7. **Run the style scanner:**
   `node ${CLAUDE_SKILL_DIR}/scripts/neu-scan.mjs <emitted paths> --json`
   It checks the shadow-only affordance, `blur = 2 × distance` and spread 0, the two-layer
   and blur ceilings, the shadow axis across the document, `box-shadow` focus rings and
   the 3px / 3px outline floor, the forced-colors and reduced-motion blocks and what they
   may remove, the same-hue invariant, the pressed rung against 0.6×, targets, fixed
   heights, the sibling gap, `will-change` misuse, the surface census and the dark-mode
   pair. Fix every error before continuing. It computes no contrast; that is step 8.

8. **Validate.** Run `ui-morphism-core:a11y-validate` over everything emitted. It owns all
   nine universal checks and every contrast computation — this skill computes none. Feed
   it the style-specific assertions from `../audit/references/checklist.md` as well, and
   have it *report* the shadow-vs-surface ratios explicitly labelled "decorative, not an
   affordance", so nobody reads them as compliance. Where a value fails, clamp it and
   record the clamp; never ship a failing pair to satisfy an intensity number.

9. **Write the audit report** to `reports/neumorphism-audit.md` in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table with these rows: Style and plugin version; Intensity
   (effective, requested, and the context that capped it); Scope; Framework / styling
   system, with detection confidence and whether the user confirmed it; Dark mode
   (media / class / both); Files changed (written / modified / refused); Verdict
   (**PASS** / **PASS WITH CORRECTIONS** / **FAIL**). Then one paragraph: what was applied
   to what, and the single thing the reader needs before looking at the numbers — for this
   style, that the extrusion is decoration and the hairline is the boundary.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, at **three decimal places,
   unrounded**: 2.999 fails 3, 4.497 fails 4.5. One row per emitted pair — hairline, body
   ink, muted ink, accent, accent ink on accent fill, focus outline — and **both shadow
   colours against their own surface are always rows, labelled "decorative, not an
   affordance"**. A Contrast table for this style that omits the shadows is the one that
   lets someone believe the extrusion complies.

3. **Checklist** — two tables, universal first, both with columns
   `Check | Verdict | Failing selector / note`. The universal table has exactly nine rows:
   text contrast (1.4.3), non-text contrast (1.4.11), focus visible (2.4.7 / 2.4.13),
   target size (2.5.8), forced colors, reduced motion, reduced transparency, colour-only
   encoding (1.4.1), DOM order (1.3.2). The style table carries the rows from
   `../audit/references/checklist.md`, sections A through G.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`, one row per number
   `references/tokens.md` §8 sets: neumorphic elements in the initial viewport, shadow
   layers per element, maximum blur radius, blur inside a scroller, blur on list or grid
   items, elements animating a shadow simultaneously, paint time per frame, added asset
   weight (0 bytes), and emitted CSS bytes.

5. **Corrections** — columns `Token | Before | After | Reason`, one row per token this
   skill changed on its own initiative — every hairline added, every background forced to
   the surface, every radius snapped, every light source normalised. Then a bullet per
   intensity cap, clamp and rounding, **including the ones that changed nothing**: the
   `contentDensity: dense` cap, the two surface distance clamps, the `a11yMode: strict`
   hairline pin, and the integer rounding of `distance`.

6. **Refusals** — columns `Requested | Refused because | Offered instead`, one row per
   `references/anti-patterns.md` entry that fired. If the user asked for borderless
   neumorphism, entry 0 is the first row in this table and the refusal is also stated in
   the Summary paragraph, not buried here.

7. **Manual TODOs** — a checkbox list of what could not be verified statically, each
   naming the *method* rather than the concern: a low-vision or cataract simulator pass
   with the shadows discounted, a greyscale plus contrast-reduced screenshot with every
   control still findable, real Windows High Contrast behaviour, measured paint cost on a
   4× CPU-throttled profile, computed target size after any transform, and a tab-through
   confirming order matches the perceived depth hierarchy.

## Outputs

- `tokens/neumorphism.css` — the `:root` plus both dark blocks, with a contrast comment
  per ink token and the two shadow colours marked decorative
- `tokens/neumorphism.theme.css` — the Tailwind v4 `@theme` mirror
- `tokens/neumorphism.json` — the same tokens in DTCG format for Figma / Style Dictionary
- `components/neu/*` — `Button`, `IconButton`, `Card`, `Input`, `Textarea`, `Switch`,
  `Slider`, `SegmentedControl`, `Well`, `Skeleton`, each hairline-first and carrying
  rest / hover / active / focus / disabled / loading
- `styles/neumorphism.layer.css` — the `@layer neumorphism { }` sheet with all four guard
  blocks, so the treatment can be disabled wholesale by removing one layer
- `reports/neumorphism-audit.md`

## Intensity knobs

Ranges and defaults are doc §13's intensity table verbatim. Default intensity is **45** —
the lowest in the set alongside bento, because coverage above roughly 0.6 collapses
hierarchy and this style stops distinguishing planes before it stops looking like itself.
The resolved values at every five points are in `references/tokens.md` §4.

| Knob | Min | Default (45) | Max | Effect |
|---|---|---|---|---|
| `shadowDelta` | 0.03 | 0.075 | 0.14 light / 0.20 dark | OKLCH L offset of the pair from the surface (`--nm-delta`). Below 0.03 the extrusion is invisible; above the max it stops being same-hue and reads as a bordered card. |
| `distance` | 2px | 5px | 20px | px at the `sm` rung; blur derives as 2×, and the ramp scales with it. Above 12 at `sm` the shadow is bigger than the control. |
| `radius` | 6px | 14px | 999px (pill) | Control radius, walking §4's own rungs: 14 control, 24 card, 36 slab, 999 pill at exactly 100. Under 6 the pair reads as a rendering artefact. |
| `hairlineOpacity` | 0.55 | 1.0 | 1.0 | **Floor 0.55, hard-clamped** — the lowest value that still resolves ≥ 3:1 after alpha compositing. 0 is never exposed. |
| `coverage` | 0.05 | 0.35 | 1.0 | Fraction of interactive elements treated. The single most important knob for whether the result ships; above ~0.6 hierarchy collapses. |

**Hard clamps, independent of intensity:** blur exactly `2 × distance`, refused and
clamped outside `[1.5, 3.0]`; spread exactly 0; pressed distance `0.6 ×` the raised
distance; 2 shadow layers per element, 4 only on the pseudo-element cross-fade; blur ≤
40px, ≤ 24px inside a scroller, ≤ 16px on list or grid items; a non-shadow boundary at ≥
3:1 on every interactive element; `outline` ≥ 3px at ≥ 3px offset, never `box-shadow`;
targets at `--nm-target-min` 44px with a hard 24×24 floor; one light source per document;
sibling gap `2 × distance + blur / 2`; no text token below 4.5:1; warn above 12
neumorphic elements in the initial viewport and fail above 24; surface chroma ≤ 0.03
OKLCH light and ≤ 0.035 dark.

**Context caps and clamps, which override intensity:** `contentDensity: dense` caps
intensity at **0**; `theme: dark` moves the `shadowDelta` ceiling to 0.20 and inverts the
0.8 / 1.4 highlight-shadow asymmetry to 1.4 / 0.8; `surface: list-or-grid-item` and
`surface: inside-scroller` clamp `distance` to 8px and 12px; `scope: controls` holds
`coverage` at 0.35; `a11yMode: strict` pins `hairlineOpacity` to 1.0. All are reported.

**Intensity 0 is not nothing.** It is a flat, bordered, fully usable control: the hairline
at 3.20:1, ink at 9.59:1, a 3px accent outline at 3px offset and a 44px target, with the
extrusion dialled out rather than the structure removed. Doc §12 names minimalism as this
style's default host, and intensity 0 is that host with the cluster switched off. It is
also exactly what every forced-colors user sees, which makes it the one rung guaranteed to
be tested.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`; `ui-morphism-core:a11y-validate`
runs the universal half and `scripts/neu-scan.mjs` runs the mechanical style half. The
non-negotiable ones:

- [ ] Every interactive element has a boundary at ≥ 3:1 against its surface that is
      **not** a shadow. Unrounded — 2.999:1 fails 3:1
- [ ] The shadow-vs-surface ratios appear in the report labelled decorative, never as a
      pass
- [ ] Body ink ≥ 4.5:1 and muted ink ≥ 4.5:1; no token chosen "to match the shadows"
- [ ] Every `:focus-visible` uses `outline` ≥ 3px at ≥ 3px offset, never `box-shadow`,
      with an `outline-color: Highlight` override inside forced-colors
- [ ] `@media (forced-colors: active)` present, giving every shadow-bounded class a real
      border and zeroing transforms
- [ ] `@media (prefers-reduced-motion: reduce)` present, zeroing durations and removing
      **no** state-carrying property
- [ ] `blur == 2 × distance` and `spread == 0` on every emitted shadow
- [ ] ≤ 2 shadow layers per element; blur ≤ 40px, ≤ 24px in a scroller, ≤ 16px on list
      items
- [ ] Every neumorphic element's background token equals its computed parent's, ΔL ≤ 0.02
      OKLCH
- [ ] One light source across the whole document
- [ ] Every interactive component resolves `min-height` / `min-width` from
      `--nm-target-min`, and nothing overrides it downward
- [ ] Dark values declared in **both** the guarded media query and `:root[data-theme="dark"]`
- [ ] Icon-only controls carry an accessible name; no `div` or `span` was made pressable
- [ ] Added asset weight 0 bytes; emitted CSS ≈ 3–5 KB before gzip
- [ ] `intensity: 0` still produces a bordered, accessible, unornamented control

## Refuse to generate

Read `references/anti-patterns.md` in full — §0 is the refusal that defines this style and
every numbered entry is a consequence of it. Follow the core refusal protocol: refuse,
explain in one sentence why, offer the compliant alternative, record it in the report.
Highest frequency:

- A shadow-only affordance — any interactive element whose sole boundary is the pair.
  Non-negotiable, in every mode, at every intensity, including on an explicit request
- A `box-shadow`-based focus ring
- Output with no `forced-colors` block — refuse to write the files at all
- A neumorphic surface whose background differs from its parent's
- Neumorphic body text, links, table rows or data cells
- State carried by inset-versus-outset shadow alone, including error and destructive state
- Mixed light sources within one document
- `spread > 0`, or `blur / distance` outside `[1.5, 3.0]`
- A reduced-motion block that removes a state change rather than a duration
- Whole-page neumorphism on a route with a `<table>`, a virtualised list, or more than 24
  interactive elements
- Pale ink chosen "to match the shadows"
