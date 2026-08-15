---
name: apply
description: >-
  Use when the user NAMES the style — claymorphism, clay UI, play-doh, squishy or puffy UI —
  or describes its concrete moves: inflated pastel cards and buttons, 24-40px radii with an
  inset sheen above and shade below plus one large hue-matched drop shadow, a press that
  squishes and inverts the light, or a kids, edtech or wellness surface. THE TEST against the
  two soft-surface siblings: here the surface carries ITS OWN PASTEL FILL, distinct from the
  page ground, inflated at a large radius, with no texture and no material. A soft surface
  matching the page ground is neumorphism-ui; one imitating leather, metal or wood is
  skeuomorphism-ui. Also for converting a flat or neumorphic interface into clay, where the
  surface taking its own colour is what restores the contrast neumorphism loses. ui-morphism
  is descriptive and plural: one named language, measured tokens, a stated when-not-to-use —
  not a design-quality tool. Do NOT use for open-ended quality work — "make it look good",
  "make it modern", "polish this", "clean this up", "make it less AI-generated", taste or
  visual-craft critique, de-slopping, animation craft, or a general accessibility sweep.
  Dedicated design, taste, animation and a11y tools answer those better and should win them.
  Nor for the other named languages: glassmorphism-ui, minimalism-ui, maximalism-ui,
  brutalism-ui, liquid-glass-ui, bento-grid-ui, spatial-ui. To review without editing, use
  claymorphism-ui:audit.
argument-hint: "[scope glob] [--intensity=0-100] [--density=comfortable|cozy|compact] [--dark-mode=none|media|class] [--framework=vanilla-css|tailwind-v4|react|vue|svelte|swiftui|react-native] [--dry-run]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/clay-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/04-claymorphism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Claymorphism: apply

Interface elements pressed out of soft modelling clay: fat corner radii, a saturated
pastel fill, and a puffed-up dome of light and shade baked into the surface itself. The
single defining move is a **four-layer `box-shadow`** — a 1px specular rim, a bright
inset sheen at the top, a darker inset shade at the bottom, and one very large soft
outer drop shadow hue-matched to the surface — which reads as an inflated object
floating a few centimetres above the page.

**The thing that makes this style different from neumorphism, which it otherwise shares
most of its machinery with: a clay element carries its OWN colour and floats above the
ground, where a neumorphic element shares the ground's colour and is extruded out of
it.** That independence is not a stylistic preference. It is the entire reason clay can
pass a contrast check at all — every pastel in the token layer clears 8:1 against dark
ink, and none of those figures is reachable by a surface that inherits the page's
colour. A "clay" card the same colour as the page is neumorphism wearing clay's
shadows, and this skill refuses to generate one.

Two more things follow and are not negotiable. **Forced-colors mode deletes
`box-shadow`, and clay's boundary IS the shadow** — so every generated component ships
a `@media (forced-colors: active)` block that puts a real `2px solid ButtonText` border
back, and clay deliberately does *not* write `forced-color-adjust: none` the way
siblings 01, 02 and 03 do. And **the full inset-plus-drop stack goes only to elements
that can be proven interactive**; static panels take the drop shadow alone, or clay
recreates neumorphism's everything-looks-pressable problem in a new costume.

**Canonical tooling for this style is dead, and that is a fact you act on rather than
report.** `tailwindcss-claymorphism` peers on `tailwindcss ^3.1.6` and has had no
release since October 2022; `clay.css` last shipped a commit in November 2022. Tailwind
v4 needs no plugin here — `@theme` generates the utilities from custom properties
directly. Do not install either package.

2026 position: niche and mildly resurging from a tiny base — 0.03% of Superdesign's
generations in January 2026 to 0.08% in May 2026 — concentrated in children's products,
edtech, wellness and illustration-heavy landing pages. Clay is excellent as a 5% accent
and poor as a 100% skin.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark
   mode strategy and component root. Never guess, never rewrite silently, and confirm
   the detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` before emitting anything. Do not reproduce token values
   or contrast ratios from memory.
3. Establish `scope`. Whole-app application on an unscoped request is an anti-pattern —
   say so and narrow it. §9 is explicit that clay costs roughly a quarter to a third of
   usable content area against a flat card, so a data-dense or high-gravity surface is
   a refusal answered with accent-only scoping, not a tuning exercise.
4. **Check what the surfaces are coloured with before promising anything.** If the
   components currently inherit the page background, the conversion is not "add
   shadows" — it is "give every surface its own colour", and that changes the blast
   radius. Say so before you start.

## Inputs

| Input | Type | Default |
|---|---|---|
| `framework` | vanilla-css \| tailwind-v4 \| react \| vue \| svelte \| swiftui \| react-native | detected, confirmed |
| `basePalette` | 1-5 seed colours (hex or oklch), or `auto` to derive a pastel ramp from an existing brand primary | `auto` |
| `density` | comfortable \| cozy \| compact | comfortable |
| `intensity` | 0-100 | 50 |
| `darkMode` | none \| media \| class | detected, confirmed |
| `scope` | glob or component list | required — the skill never rewrites an entire codebase unasked |
| `dryRun` | flag | off — see [Dry run](#dry-run) |

`density: compact` may trade padding for density but still floors targets at
`--clay-target-min` (48px) and caps `radiusScale` at 32px, because §7's SC 1.4.12 rule
is `padding ≥ border-radius × 0.75`. Every supplied or derived pastel is re-checked
against `--clay-ink-on-clay` (`#241F3A`) by `ui-morphism-core:a11y-validate` before it
ships.

## Procedure

1. **Detect and confirm the stack** — `ui-morphism-core:detect-stack`. Branch every
   later emission decision on its output enum, not on a second read of `package.json`.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — curves, clamps, the two
   context caps and the three context clamps, all from doc §13. Do not resolve it by
   hand and do not reach into core's directory: call `ui-morphism-core:token-emit`,
   give it that path and the requested intensity and context, and let it run its own
   bundled `intensity.mjs`. Core owns the resolver; this plugin owns the numbers; the
   JSON file is the whole interface between them.

   Three things the contract deliberately leaves to this skill. Apply the **rounding**
   stated in `references/tokens.md` §4 at emit time — §13 states no rounding for this
   style, so the derivation has to be visible rather than implicit. Apply the three
   `contextClamps` — the repeating-selector 48px blur cap, the under-480px 32px cap
   with the rim at zero, and the `density: compact` 32px radius cap — **after**
   resolution, because core's resolver caps intensity rather than individual knobs. And
   record the **blur ceiling**: `dropDepth` reaches 76px at intensity 100 while
   `--clay-blur-max` is 68px, so every run above 78 clamps, and that clamp goes in the
   report with the requested value beside the applied one. Record every cap and clamp,
   including the ones that changed nothing.

3. **Emit the token layer** via `ui-morphism-core:token-emit` under the
   `--um-claymorphism-*` grammar, with `assets/tokens.css` shipped alongside it as the
   `--clay-*` value layer and `assets/tokens.um-aliases.css` as the bridge. Populate
   `bg`, `surface`, `ink`, `border`, `accent`, `danger`, `radius`, `shadow`, `blur`
   (explicitly `0px` — clay is opaque and declaring the zero is the contract), `space`,
   `font`, `text`, `weight`, `leading`, `dur`, `ease`, `focus`, `target`. Do **not**
   populate `elev`: §4 labels the four drop shadows "Elevation 1 — chips" through
   "Elevation 4 — modals", so the shadow ladder *is* the elevation ladder and a parallel
   ramp is how a scale drifts. Light values on bare `:root`; dark values duplicated
   under both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
   and `:root[data-theme="dark"]`, with identical lists. Put a computed contrast comment
   on every pastel. For Tailwind v4, emit `assets/tokens.theme.css`'s `@theme` shape —
   never nested inside an at-rule, with the theme switching outside it.

   The dark block **re-derives** the sheen and shade rather than alpha-reducing the
   light ones: rim 0.10, sheen 0.14, shade 0.55. Reusing light-mode alphas is what makes
   dark clay read as chalky grey plastic, and §13's validation item 8 turns it into a
   hard assertion — dark sheen ≤ 0.20, dark shade ≥ 0.45.

4. **Give every targeted surface its own colour, then its own shadow hue.** Pick from
   the pastel ramp or derive one at the resolved `surfaceChroma`, holding OKLCH L and H
   so the 70-90% lightness band survives. Then set `--clay-shadow-h` on the element from
   the map in `references/tokens.md` §2 — lavender 258, sky 202, mint 152, butter 36,
   coral 8 — so the shadow atoms re-derive themselves per surface. A neutral
   `rgba(0,0,0,α)` drop shadow on a coloured surface is on the refusal list.

5. **Split interactive from static before you emit a single shadow.** The full
   four-layer stack goes only to elements you can prove are interactive — `button`,
   `a`, `[role=button]`, `input`, `[tabindex]`, a framework click handler. Everything
   else gets `--clay-drop-1` and nothing more. Assign the rung by component role, not by
   the geometry of whatever shadow was there before: chip → `--clay-1`, button →
   `--clay-2`, card → `--clay-3`, modal or sheet → `--clay-4`. The full conversion
   procedure is `references/recipes.md` and `references/tokens.md` §7.

6. **Invert the recipe for text inputs and wells** so they read recessed rather than
   inflated: two inset layers, no drop shadow. This is the one place clay borrows
   neumorphism's direction on purpose, and §12 prescribes it explicitly in place of
   importing neumorphism wholesale.

7. **Install the press-and-release motion system.** `:active` inverts the insets — dark
   on top — and applies `scale(0.97)` with a 1px translate; 90ms `--clay-ease-out` on
   the way down, 260ms `--clay-ease-squish` on the way back. Overshoot on release only.
   Rewrite any existing `transition: box-shadow` on a repeating or scrollable selector
   into a pseudo-element `opacity` cross-fade, and never animate `border-radius`.
   `references/motion.md` has the state table and the cross-fade recipe.

8. **Write the four guard blocks.** They are mandatory on every generated sheet:
   `@media (forced-colors: active)` (shadows to `none`, `border: var(--clay-border-hc)`,
   system colours, transforms zeroed, and **no** `forced-color-adjust`),
   `@media (prefers-reduced-motion: reduce)` (spring and lift removed, an instant depth
   swap kept so the state stays perceivable),
   `@media (prefers-reduced-transparency: reduce)` (the sheen softens; a near no-op
   unless the design was hybridised with glass), and
   `@media (prefers-reduced-data: reduce), (max-width: 480px)` (blurs halve, the rim
   goes to `none`). Emit them inside `@layer claymorphism` so the restyle can be toggled
   off without specificity fights.

9. **Run the style scanner:**
   `node ${CLAUDE_SKILL_DIR}/scripts/clay-scan.mjs <emitted paths> --json`
   It checks the layer ceiling, both blur ceilings, neutral drop shadows, a surface
   whose background equals the ground, the forced-colors border, `forced-color-adjust`,
   `box-shadow` and `border-radius` in transitions and keyframes, `will-change:
   box-shadow`, `inset` inside `text-shadow`, the dark sheen/shade band, the grid-gap
   floor, the affordance split and the four required media blocks. Fix every error
   before continuing. It computes no contrast; that is step 10.

10. **Validate.** Run `ui-morphism-core:a11y-validate` over everything emitted. It owns
    all nine universal checks and every contrast computation — this skill computes no
    ratios of its own. Feed it the style-specific assertions from
    `../audit/references/checklist.md` as well, and specifically ask it for the
    **element edge** against its adjacent background, not only the text: clay's boundary
    is a blurred shadow and that is where it fails quietly. Where an edge falls short,
    escalate in this order and record what you did: (a) pick a darker surface from the
    ramp; (b) add the `1px hsl(258 40% 55% / .55)` inset ring §7 prescribes, which
    survives independently of the blur. Where a value fails, clamp it and record the
    clamp; never ship a failing pair to satisfy an intensity number.

11. **Count the budgets and downgrade if one is blown.** Four shadow layers per element,
    forty clay elements per viewport, 68px blur anywhere, 48px on anything that repeats,
    two nested elevation levels per subtree, 150KB per clay illustration, zero Spline
    scenes above the fold on mobile. If a budget is exceeded, cut the drop shadow's blur
    before you cut the insets — §8 is explicit that the outer drop is the expensive
    layer and the insets are bounded by the element's own area — and record the
    downgrade.

12. **Write the audit report** to `reports/clay-audit.md` in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the
same codebase. Where a section does not apply, write "None." — an empty section is
information, a missing section is a hole. The style supplies the rows; the sections are
fixed.

1. **Summary** — a two-column table with these rows: Style and plugin version; Intensity
   (effective, requested, and the context that capped it); Scope; Framework / styling
   system, with detection confidence and whether the user confirmed it; Dark mode
   (none / media / class); Files changed (written / modified / refused); Verdict
   (**PASS** / **PASS WITH CORRECTIONS** / **FAIL**). Then one paragraph: what was
   applied to what, and the single thing the reader needs before looking at the numbers
   — which is usually whether the surfaces had to be recoloured to stop being
   neumorphism.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict |
   Auto-correction`. Every ratio is `ui-morphism-core:a11y-validate`'s, at **three
   decimal places, unrounded**: 2.999 fails 3, 4.497 fails 4.5. One row per emitted
   pair, and **every clay surface's edge against its adjacent background is always one
   of them** — the text rows alone are the half of this style that does not fail.

3. **Checklist** — two tables, universal first, both with columns
   `Check | Verdict | Failing selector / note`. The universal table has exactly nine
   rows: text contrast (1.4.3), non-text contrast (1.4.11), focus visible
   (2.4.7 / 2.4.13), target size (2.5.8), forced colors, reduced motion, reduced
   transparency, colour-only encoding (1.4.1), DOM order (1.3.2). The style table
   carries the rows from `../audit/references/checklist.md`, plus one matrix this style
   adds: **the affordance split** — every selector that received the full stack and
   every selector that received `--clay-drop-1` only, with the interactive signal that
   decided it.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`, one row per number
   `references/tokens.md` §8 sets: shadow layers per element, clay elements per
   viewport, maximum blur on any layer, maximum blur on anything that repeats, nested
   elevation depth, illustration bytes, emitted CSS bytes, added JS.

5. **Corrections** — columns `Token | Before | After | Reason`, one row per token this
   skill changed on its own initiative — every surface recoloured off the page ground
   belongs here. Then a bullet per intensity cap, clamp and rounding, **including the
   ones that changed nothing**: the two context caps, the three context clamps, the
   68px blur ceiling and the rounding rule.

6. **Refusals** — columns `Requested | Refused because | Offered instead`, one row per
   `references/anti-patterns.md` entry that fired.

7. **Manual TODOs** — a checkbox list naming the *method* rather than the concern. For
   this style it always includes at least these three, because none is computable from
   CSS text: open the interface in a real Windows High Contrast session and confirm
   every component still has a boundary; measure the computed target box **after** the
   press transform; and set 200% zoom with WCAG 1.4.12 text spacing and look for text
   clipping against the rounded corners.

## Dry run

`--dry-run` runs everything above and changes nothing in the project. Every step executes in
full — the stack is detected and confirmed, intensity resolves through core, the token layer
and the component rewrites are generated, and `ui-morphism-core:a11y-validate` runs over the
real emitted CSS — so the contrast table, the checklist and the budgets are measurements and
not estimates. A dry run that guessed at its own numbers would be worth less than no dry run.

What changes is where the output lands. Nothing inside the project tree is created, modified
or deleted, and no report file is written. The complete proposed output goes to a scratch
directory outside the project — `$TMPDIR/ui-morphism-dry-run-<style>/`, or
`/tmp/ui-morphism-dry-run-<style>/` where `$TMPDIR` is unset — so the validator has real files
to read and the user has something to diff. The report is printed in the reply instead of
saved, and its Summary carries two extra rows: **Mode**, `dry run — no project files written`,
and **Scratch**, the absolute path. **Files changed** becomes `would write / would modify /
refused`.

Name that scratch path in the report. A dry run that claims to have written nothing while
writing somewhere it does not name is the one outcome worse than not offering the mode.

`--dry-run` is opt-in and is not the default. A skill invoked by name against a confirmed
scope was asked to do something, and a silent no-op is its own kind of surprise. The
read-only question — "what is wrong with what I already have" rather than "what would this
style do to it" — belongs to this plugin's `audit` skill, which holds no `Write` grant at all
and so cannot write whatever it is told.

## Outputs

- `tokens/clay.tokens.css` — the `:root` plus both dark blocks, with a contrast comment
  per pastel; `tokens/clay.theme.css` for Tailwind v4 (`@theme`, never nested in an
  at-rule); or `ClayTokens.swift` where the stack calls for it
- `components/clay/*` — `Card`, `Button`, `IconButton`, `Chip`, `Input`, `Toggle`,
  `Modal`, `Toast`, each carrying its own surface colour, its own shadow hue and the
  four guard blocks
- `styles/clay.layer.css` — the `@layer claymorphism { }` override sheet
- `styles/clay-fallbacks.css` — the forced-colors, reduced-motion, reduced-transparency,
  reduced-data and small-screen blocks
- `reports/clay-audit.md`

## Intensity knobs

Doc §13's table, verbatim. Default intensity is **50** — see `references/tokens.md` §4
for its provenance, which is a derivation rather than a figure §13's inputs list states.
Full resolved table at every five points in `references/tokens.md` §4.

| Knob | Min | Reference (intensity 50) | Max | Effect |
|---|---|---|---|---|
| `radiusScale` | 8px card / 6px button | 32px / 20px | 48px / 28px | Corner puff; below 16px on controls the style stops reading as clay |
| `insetStrength` | sheen 0.00 / shade 0.00 | sheen 0.62 / shade 0.32 | sheen 0.85 / shade 0.48 | The inflation itself; 0 yields a flat tinted card |
| `dropDepth` | `0 2px 4px -2px` @ 0.12 | `0 24px 44px -12px` @ 0.32 | `0 44px 76px -16px` @ 0.42 | How far the object floats; also the main perf lever |
| `surfaceChroma` | 0.02 oklch (near-grey) | 0.09 oklch (pastel) | 0.16 oklch (candy) | Palette saturation; above 0.16 the dark-ink contrast floor starts breaking |
| `squishAmount` | `scale(1.00)` | `scale(0.97)` + 1px translate | `scale(0.93)` + 3px translate | Press deformation; capped at 0.93 because further shrink makes 24px targets miss their own hit area |

**Hard clamps, independent of intensity:** ≤ 4 shadow layers per element; ≤ 68px blur
on any layer and ≤ 48px on anything that repeats; ≤ 40 clay elements per viewport; dark
sheen ≤ 0.20 and dark shade ≥ 0.45; `squishAmount` never below 0.93; ≤ 2 nested clay
elevation levels per subtree; grid gaps ≥ 24px; targets ≥ 48px measured while pressed
and never below the 24×24 SC 2.5.8 floor; focus outline ≥ 3px at ≥ 3px offset, never a
`box-shadow`; `padding ≥ border-radius × 0.75` on any card whose text can wrap; a
surface colour never equal to the page background; a hue-matched drop shadow, never
neutral; `box-shadow` never inside a `transition` or `@keyframes` on a repeating
selector; `forced-color-adjust` never `none`.

**Context caps, which override intensity:** `surface: data-dense` and
`register: high-gravity` both cap at **0** — the flat rung, which §9 calls by its plain
name, ship flat. Three context clamps apply after resolution: a repeating selector caps
blur at 48px, an under-480px viewport caps it at 32px and zeroes the rim, and
`density: compact` caps the radius at 32px. All are reported in the audit.

**Intensity 0 is not nothing.** It is a flat pastel-tinted card — 8px card / 6px button
radius, no rim, no sheen, no shade, a hairline `0 2px 4px -2px` drop at 0.12 alpha still
tinted with the surface hue, and no press deformation — that keeps everything which is
not ornament: its **own** background colour, dark ink on every pastel, a 3px focus ring
at 3px offset, and 48×48 targets. Recognisable as plain, fully accessible, and still not
neumorphism. Intensity 0 flattens the volume; it never flattens the surface colour.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`; `ui-morphism-core:a11y-validate`
runs the universal half. The non-negotiable ones:

- [ ] Every emitted foreground/background pair ≥ 4.5:1 body, ≥ 3:1 at ≥ 24px or ≥ 19px
      bold. Unrounded — 4.497:1 fails 4.5:1
- [ ] Every clay control's **edge** ≥ 3:1 against its immediate background, by lightness
      delta or by the explicit inset ring. A blurred shadow alone is not a boundary
- [ ] No emitted surface's background equals the page background
- [ ] Every drop shadow hue-matched to its own surface; no neutral `rgba(0,0,0,α)`
- [ ] ≤ 4 shadow layers per selector; ≤ 68px blur anywhere; ≤ 48px on anything that
      repeats
- [ ] `@media (forced-colors: active)` present on every generated component, setting
      `box-shadow: none` **and** a visible `--clay-border-hc` border, with no
      `forced-color-adjust` declaration anywhere
- [ ] `@media (prefers-reduced-motion: reduce)` present, removing the spring and the
      lift and leaving a perceivable instant depth change
- [ ] `prefers-reduced-transparency` and the `prefers-reduced-data` / `(max-width: 480px)`
      blocks both present
- [ ] Dark block present under **both** selectors, complete, with sheen ≤ 0.20 and
      shade ≥ 0.45
- [ ] Every `:focus-visible` uses `outline` ≥ 3px with `outline-offset` ≥ 3px, and no
      rule anywhere sets `outline: none` without a replacement in the same rule set
- [ ] Every interactive rule yields a computed box ≥ 48×48 CSS px, measured with the
      press `scale()` applied, and never below the 24×24 floor
- [ ] No `transition`, `animation` or `@keyframes` targets `box-shadow` on a repeating
      selector, and none targets `border-radius` anywhere
- [ ] No `will-change: box-shadow` anywhere
- [ ] Static panels carry `--clay-drop-1` only, and no non-interactive selector carries
      the full stack while an interactive one in the same view does
- [ ] Every depth-encoded state carries a paired ARIA attribute
- [ ] `padding ≥ border-radius × 0.75` on every card whose text can wrap
- [ ] `intensity: 0` still produces a coloured, accessible, unornamented control

## Refuse to generate

Read `references/anti-patterns.md` in full and follow the core refusal protocol: refuse,
explain, offer the compliant alternative, record it in the report. Highest frequency:

- A clay surface whose background colour equals the page background — that is
  neumorphism, and the skill says so and offers the correct clay alternative
- White or light-grey text on any pastel clay surface
- Removal, suppression or `outline: none` on any focus indicator, under any styling
  justification
- The full clay stack on non-interactive elements when interactive elements in the same
  view use it too
- `box-shadow` inside a `transition` or `@keyframes` on a virtualised list, scroll
  container or any repeating selector
- `forced-color-adjust: none` used to preserve the aesthetic in Windows High Contrast
- Clay applied wholesale to data tables, financial statements, medical records or admin
  dashboards
- More than two nested clay elevation levels in a single subtree
- Neutral `rgba(0,0,0,α)` drop shadows on coloured surfaces
- Any output that omits the dark-mode block when `darkMode` is not `none`
- Spline or WebGL 3D scenes injected above the fold on a mobile breakpoint
