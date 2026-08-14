---
name: apply
description: >-
  Use when the user NAMES the style — minimalism, minimal UI, flat design, Swiss style, quiet
  or calm UI — or describes its concrete moves: strip shadows, gradients and dividers; a
  monochrome ramp plus one accent; a 4/8pt spacing system or a modular type scale; a
  Linear-like or Vercel-like look; or a UI that feels busy or over-designed. THE TEST against
  the other flat-and-stark language: this one SUBTRACTS — hairline 1px borders, near-zero
  elevation, restrained colour. A request to ADD weight — 2-5px ink borders, hard offset
  shadows, saturated fills, chunky type — is brutalism-ui, equally flat and the opposite
  instruction. Also for the compensating pass only this style has: filled primary buttons, 3:1
  control boundaries, hover underlines, focus rings and 24px targets. ui-morphism is
  descriptive and plural: one named language, measured tokens, a stated when-not-to-use — not
  a design-quality tool. Do NOT use for open-ended quality work — "make it look good", "make
  it modern", "polish this", "clean this up", "make it less AI-generated", taste or
  visual-craft critique, de-slopping, animation craft, or a general accessibility sweep.
  Dedicated design, taste, animation and a11y tools answer those better and should win them.
  Nor for the other named languages: skeuomorphism-ui, neumorphism-ui, glassmorphism-ui,
  claymorphism-ui, maximalism-ui, liquid-glass-ui, bento-grid-ui, spatial-ui. To review
  without editing, use minimalism-ui:audit.
argument-hint: "[scope glob] [--intensity=0-100] [--density=comfortable|default|compact] [--dark-mode=none|media|class|both] [--a11y-target=AA|AA+focus-AAA|AAA] [--audience=general|novice] [--surface-type=general|safety-critical]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/quantize-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/05-minimalism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Minimalism: apply

Minimalism is the reduction of an interface to the smallest set of elements that still
lets a user complete the task, with everything remaining carrying informational weight.
The single defining move is **subtraction with compensation**: you delete the box, the
gradient, the shadow and the divider, and then buy back the lost structure with
whitespace, type scale and a single accent hue.

**This is the only skill in the set that is mostly subtractive, and that is the trap.**
Its permanent failure mode is not a bad colour — it is a deleted affordance. Doc §1 states
it plainly: stripping signifiers off a control does not make the control simpler, it makes
it invisible. Every credible 2020s implementation of this style is minimalism *plus* a
deliberately reintroduced affordance budget, which is why §13 step 7 exists, why it runs
**always** at every intensity, and why `affordanceFloor` is the one knob in this
marketplace that goes **up** as intensity goes up.

Two numbers carry most of the risk, both from doc §7. `#737373` is **4.74:1** on white and
is the lightest legal body grey; anything in the `#888`–`#AAA` band that a designer calls
"secondary text" is a defect. And the 1.4.11 boundary on white is `#949494` at **3.03:1**,
so the ubiquitous `#E5E5E5` hairline at **1.26:1** is fine as a row separator and can
never be a control's only affordance. WCAG 2.2's newest criteria — 2.5.8 Target Size and
2.4.11 Focus Not Obscured — land directly on this style's icon-only ghost controls and
thin sticky headers.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark
   mode strategy and component root. Never guess, never rewrite silently, and confirm the
   detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` before emitting anything. Do not reproduce token values or
   contrast ratios from memory.
3. Establish `scope`. Default is `src/components/ui/**` plus the app's token and global
   stylesheets. A subtractive pass over an unscoped repository deletes things the user did
   not offer up — narrow it, and say why.
4. Establish `audience` and `surfaceType` before resolving intensity. Doc §9 rules this
   style out for novice, occasional and low-confidence audiences and for safety-critical
   or irreversible surfaces, and the intensity contract turns both into caps. Asking
   costs one sentence; getting it wrong deletes signifiers from a healthcare intake form.

## Inputs

| Input | Type | Default |
|---|---|---|
| `framework` | vanilla-css \| tailwind-v4 \| react-css-modules \| styled-components \| swiftui | detected, confirmed |
| `basePalette` | one hex accent, plus a neutral tint of `warm` \| `cool` \| `pure` | `#2563EB`, `pure` |
| `density` | comfortable \| default \| compact | default |
| `intensity` | 0-100 | 60 |
| `darkMode` | none \| media \| class \| both | both |
| `a11yTarget` | AA \| AA+focus-AAA \| AAA | AA+focus-AAA |
| `audience` | general \| novice | general, confirmed |
| `surfaceType` | general \| safety-critical | general, confirmed |
| `target` | glob list | `src/components/ui/**` |

`density` maps to control heights 44 / 40 / 32px and a spacing multiplier of
1.25 / 1.0 / 0.75. **Only one accent is accepted**; a second chromatic hue is rejected,
and the danger semantic is not a slot the user fills. Every supplied accent goes to
`ui-morphism-core:a11y-validate` against `--min-accent-fg` in both themes before it ships.

## Procedure

1. **Detect and confirm the stack** — `ui-morphism-core:detect-stack`. Branch every later
   emission decision on its output enum, not on a second read of `package.json`.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — curves, clamps and both
   context caps, all from doc §13. Do not resolve it by hand and do not reach into core's
   directory: call `ui-morphism-core:token-emit`, give it that path and the requested
   intensity and context, and let it run its own bundled resolver. Core owns the resolver;
   this plugin owns the numbers; the JSON file is the whole interface between them.

   Three things the contract deliberately leaves to this skill. Apply the **paired
   `contextClamps`** after resolution — core's resolver caps intensity rather than
   individual knobs, and `affordanceFloor` is inverted, so a `novice` or `safety-critical`
   cap alone would take it to its floor, which is the opposite of what doc §9 asks for.
   Apply the **hard `weightMax ≤ 600` clamp** over the paired curve's 700 band below
   intensity 25, because §4 says no weight above 600 exists in this style. And resolve the
   **paired curves** — `accentCoveragePct`, `shadowOpacityMax`, `gradientsAllowed` — which
   sit beside their parent knob rather than on it. Record every cap, clamp and paired
   resolution: the audit reports the requested value next to the applied value, including
   where nothing changed. `references/tokens.md` §4 is the same table in prose, for
   reading; the JSON is what runs.

3. **Inventory before you subtract.** Run
   `node ${CLAUDE_SKILL_DIR}/scripts/quantize-scan.mjs <scope paths> --json --decoration-budget=<resolved>`
   over the scope. It returns three classes of finding — `quantise` (a value off one of
   §4's ramps, with the rung it snaps to), `subtract` (decoration §13 step 6 removes) and
   `restore` (the compensating pass) — plus the counts
   `reports/minimalism-diff-summary.md` is specified to carry: colour literals, neutral
   literals, hue families, shadow declarations, and font sizes / spacing / radii /
   durations collapsed from N to the ramp length. N is a measurement of the user's
   codebase, not a number to estimate by reading. It computes no contrast, no luminance
   and no alpha compositing; that is step 9.

4. **Emit the token layer** via `ui-morphism-core:token-emit` under the
   `--um-minimalism-*` grammar, with `assets/tokens.css` shipped alongside it as the
   `--min-*` value layer and `assets/tokens.um-aliases.css` as the bridge. Populate `bg`,
   `surface`, `ink`, `border`, `accent`, `accent-subtle`, `danger`, `radius`, `elev`,
   `shadow`, `blur` (explicitly `0px` — declaring the zero is the contract), `saturate`
   (explicitly `1`), `space`, `font`, `text`, `weight`, `leading`, `tracking`, `dur`,
   `ease`, `focus`, `target`. Do **not** populate `noise`, a third or fourth `surface`
   plane, or a separate `ease-enter`. Light values on bare `:root`; dark values duplicated
   under both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
   and `:root[data-theme="dark"]`. For Tailwind v4, emit `assets/tokens.theme.css`'s
   `@theme` shape — never nested inside an at-rule, with both dark blocks outside it, and
   both `--color-*: initial` and `--shadow-*: initial` retained.

5. **Collapse the palette.** Cluster every colour literal the scan found; map neutrals
   onto the `--min-bg-*` / `--min-surface-*` / `--min-text-*` ramp under the resolved
   `chromaBudget`, the dominant chromatic family onto `--min-accent` and its hover and
   active steps, and the red family onto `--min-danger`. A third hue family is an error,
   not a rounding. Emit the mapping report §13 requires: every replacement, with the
   original beside it. Assert ≤ 2 chromatic hues and ≤ 11 neutral steps before moving on.

6. **Quantise geometry, type, space and motion** to the scan's plan — radius onto
   `{4, 8, 12, 9999}`, spacing onto the 4px ramp, type onto the nine rungs at the resolved
   `typeContrast` ratio, weights onto `{400, 500, 600}`, durations onto
   `{100, 150, 200, 300}`ms, easings onto `--min-ease-standard` / `--min-ease-exit`. Scale
   only the between-group half of the spacing ramp by `whitespaceMultiplier`; §3's 4:1
   within-to-between ratio is what produces perceived grouping, and scaling both cancels
   the knob out. Apply `--min-tracking-tight` above 24px and `--min-tracking-display`
   above 36px, and clamp prose containers to `var(--min-measure)`.

7. **Subtract decoration.** Strip `backdrop-filter`, `filter: blur()` and
   `filter: drop-shadow()`, `text-shadow`, `mix-blend-mode`, and multi-stop gradients on
   non-overlay elements. Reduce every `box-shadow` to a rung by z-role, not by size:
   overlays take `--min-shadow-2`, everything else takes `--min-shadow-1` or, where the
   resolved `decorationBudget` is 0, a `--min-border-subtle` hairline instead. **A card
   that loses its shadow gains a border. It never loses both.**

8. **Run the compensating pass — always, at every intensity.** This is §13 step 7 and
   `references/tokens.md` §3, and it is the step that makes the rest of this skill safe.
   Convert ghost primary buttons to filled. Raise any control boundary below 3:1 to
   `--min-border-strong`. Restore hover underlines on text links. Add `:focus-visible`
   rings wherever they are missing and wherever `outline: none` has no replacement in the
   same rule. Pad icon-only targets up to `var(--min-target-min)`, sizing from the token
   rather than emitting a literal, with the resting size from `var(--min-control-lg)`. Add
   `scroll-margin-block` to focusables under any sticky header. Give every visually
   implied group a real semantic container with an accessible name. Restore the second
   channel on anything encoded in colour alone. And put back nothing the user asked to
   delete without saying so — this pass is reported line by line in the audit.

9. **Write the guard blocks.** Mandatory on every generated sheet:
   `@media (forced-colors: active)` giving every control a `ButtonBorder` boundary and
   mapping the primary fill to `Highlight` / `HighlightText`;
   `@media (prefers-reduced-motion: reduce)` that removes translation and looping
   animation while keeping a ≤ 100ms fade so state stays legible; and
   `prefers-reduced-transparency` handling on any overlay scrim. Emit them inside
   `@layer minimalism` so the restyle can be removed in one deletion. See
   `references/motion.md`.

10. **Validate.** Run `ui-morphism-core:a11y-validate` over everything emitted. It owns
    all nine universal checks and every contrast computation — this skill computes no
    ratios of its own. Feed it the style-specific assertions from
    `../audit/references/checklist.md` as well. Where a value fails, clamp it and record
    the clamp; never ship a failing pair to satisfy an intensity number.

11. **Write the audit report** to `reports/minimalism-audit.md` in the shape below, and
    the inventory to `reports/minimalism-diff-summary.md`.

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
   to what, and the single thing the reader needs before looking at the numbers.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, at **three decimal places,
   unrounded**: 2.999 fails 3, 4.497 fails 4.5. One row per emitted pair, and the control
   boundary against its adjacent surface is always one of them, in **both** themes.

3. **Checklist** — two tables, universal first, both with columns
   `Check | Verdict | Failing selector / note`. The universal table has exactly nine rows:
   text contrast (1.4.3), non-text contrast (1.4.11), focus visible (2.4.7 / 2.4.13),
   target size (2.5.8), forced colors, reduced motion, reduced transparency, colour-only
   encoding (1.4.1), DOM order (1.3.2). The style table carries the rows from
   `../audit/references/checklist.md`.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`, one row per number
   `references/tokens.md` §8 sets: critical CSS bytes, total CSS bytes, font files and
   bytes, icon sprite bytes, above-the-fold image bytes, added JS, accent coverage, shadow
   rungs used, neutral steps emitted, chromatic hues emitted.

5. **Corrections** — columns `Token | Before | After | Reason`, one row per token this
   skill changed on its own initiative, plus every value quantised with its original.
   Then a bullet per intensity cap, clamp and paired resolution, **including the ones that
   changed nothing**: the `weightMax ≤ 600` clamp, any context cap and its paired
   `affordanceFloor` clamp, and each of the three paired curves.

   This section carries the restoration log as its own sub-table:
   `Restored | File and selector | From | To`. One row per ghost button converted, control
   boundary raised, underline restored, focus ring added, target padded up, semantic
   container added, and second channel restored. In this style that sub-table is the point
   of the run, not an appendix to it.

6. **Refusals** — columns `Requested | Refused because | Offered instead`, one row per
   `references/anti-patterns.md` entry that fired. Anything the user asked to delete that
   §13 forbids deleting — a label, help text, an error message, a required-field marker, a
   `<legend>` — belongs here, not in Corrections.

7. **Manual TODOs** — a checkbox list of what could not be verified statically, each
   naming the *method* rather than the concern: a tab-through of every reordered grid or
   flex region, a keyboard pass at a short viewport with the sticky header in place, real
   Windows High Contrast behaviour, actual font subset sizes, the SC 1.4.12 text-spacing
   overrides applied in a browser, and a greyscale pass over the finished UI.

## Outputs

- `tokens/minimalism.css` — the `:root` plus both dark blocks
- `tokens/minimalism.theme.css` — the Tailwind v4 `@theme` mirror, when the framework is
  `tailwind-v4`
- `components/minimal/*` — `Stack`, `Button`, `Card`, `Input`, `ListRow`, props-driven,
  no runtime dependencies. Shapes, per-component requirements and the layout consequences
  that bite are in `references/recipes.md`; a component sheet declares no tokens of its
  own and consumes `--min-*` with inline fallbacks
- `styles/minimalism.layer.css` — the `@layer minimalism { }` sheet, so the style can be
  adopted without specificity wars and removed in one deletion
- `reports/minimalism-audit.md`
- `reports/minimalism-diff-summary.md` — colours removed, shadows removed, font sizes
  collapsed from N to 9, spacing values collapsed from N to 9
- optional `tokens/minimalism.figma.json` — Figma Variables and text/effect styles

## Intensity knobs

Full resolved table at every five points in `references/tokens.md` §4. Curves are from
doc §13, encoded in `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json`. Three knobs
carry an anchor at the default that a straight line between the endpoints cannot reach,
and the contract records why for each; two are stepped, because a shadow rung and a font
weight are counts rather than lengths. Every knob is monotone across 0→100.

| Knob | 0 | 50 | 100 | Default (60) | Note |
|---|---|---|---|---|---|
| `chromaBudget` | 0.06 | 0.027 | 0.00 | 0.020 | Max OKLCH chroma on non-accent surfaces. Paired with `accentCoveragePct`: 15% → 8% → 1%, 6.6% at the default. |
| `decorationBudget` | 3 | 1 | 0 | 1 | Permitted shadow rungs, stepped at 25 / 50 / 75. Paired with `shadowOpacityMax` (0.12 → 0.07 → 0.00, 0.06 at the default) and `gradientsAllowed` (true only while the budget is 3). |
| `whitespaceMultiplier` | 0.75 | 0.96 | 2.00 | 1.00 | Scalar on the **between-group** ramp only — `--min-space-8` and above. |
| `typeContrast` | 1.414 | 1.236 | 1.125 | 1.200 | Modular scale ratio. Paired with `weightMax`, which the hard 600 clamp pins below intensity 25. |
| `affordanceFloor` | 40 | 50 | 100 | 60 | **Inverted**: raising intensity raises it. Clamped at 40, never 0. |

**Hard clamps, independent of intensity:** body text ≥ 4.5:1 and large text ≥ 3:1; any
control boundary that is the control's only affordance ≥ 3:1; focus an `outline` ≥ 2px at
≥ 2px offset on 100% of focusables, never a `box-shadow`; targets ≥ 24×24 CSS px taken
from `--min-target-min` and never overridden downward, resting size from
`--min-control-lg`; weight ceiling 600; ≤ 2 chromatic hues and ≤ 11 neutral steps;
`--min-backdrop-blur: 0px` declared on every base-layer surface; every duration ≤ 300ms;
no easing control point outside `[0,1]`; border width `1px`; measure `65ch` in `ch` or
`rem`, never `px`; radius ceiling 12px plus 9999px for pills.

**Context caps, which override intensity:** `audience: novice` and
`surfaceType: safety-critical` each cap intensity at **0** and, in the same breath, clamp
`affordanceFloor` to **100**. Doc §13 states no numeric cap for this style — it states the
when-not-to-use conditions in §9 instead — and the contract records that derivation. The
pairing is not optional: capping intensity alone moves the inverted knob the wrong way and
deletes signifiers from exactly the audience §9 says needs the most.

**Intensity 0 is not nothing, and it is not "no minimalism".** It is a conventional
interface with its affordances intact — the full three-rung ladder, a tinted ramp, the
wide 1.414 scale, a dense 0.75× rhythm — and still a filled primary button, a
`--min-border-strong` boundary, underlined links, a 2px focus ring at 2px offset and
targets sized from `--min-target-min`, because `affordanceFloor` is clamped at 40. It is
an ordinary interface that has not yet been subtracted from.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`; `ui-morphism-core:a11y-validate`
runs the universal half. The non-negotiable ones:

- [ ] Every emitted foreground/background pair ≥ 4.5:1 normal text, ≥ 3:1 large text and
      non-text, on **every surface it can render against**. Unrounded — 2.999:1 fails 3:1.
- [ ] No body text lighter than `--min-text-muted` on a light surface, in either theme
- [ ] Every control whose boundary is its only affordance takes `--min-border-strong`, in
      **both** themes, and no `--min-border-subtle` carries a control anywhere
- [ ] A `:focus-visible` rule exists whose specificity covers all of
      `a, button, input, select, textarea, summary, [tabindex]`, using `outline` at ≥ 2px
      and ≥ 2px offset, and no `outline: none` survives without a replacement in the same
      rule
- [ ] No focused element can be fully covered by a sticky header or footer at any viewport
      height — `scroll-margin-block` set on every focusable
- [ ] Every interactive element declares `min-height` ≥ 24px and, icon-only, `min-width`
      ≥ 24px, taken from `--min-target-min` rather than a literal
- [ ] The emitted palette carries ≤ 2 chromatic hues and ≤ 11 neutral steps
- [ ] Zero `backdrop-filter` and zero `filter: blur()` outside an explicitly allow-listed
      overlay selector list, and `--min-backdrop-blur: 0px` declared
- [ ] Every `transition-duration` and `animation-duration` ≤ 300ms, with a
      `prefers-reduced-motion: reduce` block covering every animated selector and keeping
      a ≤ 100ms fade
- [ ] A `@media (forced-colors: active)` block gives every button, input and card a
      `ButtonBorder` boundary, with `forced-color-adjust: none` on the primary fill only
- [ ] The dark token set defines every token the light set defines — no orphans — and both
      the media-query and the `[data-theme="dark"]` override are present
- [ ] No body font-size in `px` and no prose container with a `px` `max-width`
- [ ] No state, status or category communicated by colour alone
- [ ] No label, help text, error message, required-field marker or `<legend>` was deleted
- [ ] Every visually implied group has a matching semantic container with an accessible
      name
- [ ] Total emitted CSS ≤ 40 KB compressed, critical ≤ 14 KB compressed, added JS = 0
- [ ] `intensity: 0` still produces a filled primary button, a 3:1 boundary, underlined
      links and a visible focus ring

## Refuse to generate

Read `references/anti-patterns.md` in full and follow the core refusal protocol: refuse,
explain, offer the compliant alternative, record it in the report. Highest frequency, and
note that half of these are refusals to **delete**:

- Body text below 4.5:1, or a control boundary below 3:1
- A ghost or outline-only button as the primary action
- `outline: none` with no replacement in the same rule
- An interactive target below `--min-target-min`, or an icon-only button with no
  `aria-label`
- Colour as the sole carrier of state, error, selection or category
- Placeholder text as the only field label
- **Deleting** a visible label, help text, an error message, a required-field marker or a
  `<legend>` in the name of cleanliness
- More than two chromatic hues in the generated palette
- `backdrop-filter` on a base-layer surface — that is glassmorphism; hand it off
- Infinite animation that represents no in-progress operation, or any animation surviving
  `prefers-reduced-motion: reduce`
- Fixed `px` heights on text-bearing containers, or `overflow: hidden` on label text
- Icon fonts, or replacing a text label with an unlabelled icon to save space
