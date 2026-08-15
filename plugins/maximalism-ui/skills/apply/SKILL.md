---
name: apply
description: >-
  Use when the user NAMES the style — maximalism, maximalist, dopamine design, more-is-more,
  anti-design collage — or describes its concrete moves: three stacked loud layers over a
  patterned or grainy ground, clashing saturated accents, display type at clamp(3rem, 12vw,
  11rem), stickers and cut-outs, marquees, zero-blur chromatic shadows, anti-grid tilt, or a
  Calm mode toggle. Also for deriving role-bound accents that swap ramps between light and
  dark, or retuning a loud surface by intensity 0-100. Loud is necessary but not sufficient:
  this style STACKS LAYERS. One bordered plane, however saturated, is brutalism-ui.
  ui-morphism is descriptive and plural: one named language, measured tokens, a stated
  when-not-to-use — not a design-quality tool. Do NOT use for open-ended quality work — "make
  it look good", "make it modern", "polish this", "clean this up", "make it less
  AI-generated", taste or visual-craft critique, de-slopping, animation craft, or a general
  accessibility sweep. Dedicated design, taste, animation and a11y tools answer those better
  and should win them. Nor for the other named languages: skeuomorphism-ui, neumorphism-ui,
  glassmorphism-ui, claymorphism-ui, minimalism-ui, liquid-glass-ui, bento-grid-ui,
  spatial-ui. To review without editing, use maximalism-ui:audit.
argument-hint: "[scope glob] [--intensity=0-100] [--surface-type=brand|campaign|editorial|app-accent] [--density=airy|standard|packed] [--dark-mode=media|class|none] [--motion=full|state-only|none] [--dry-run]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/max-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/06-maximalism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Maximalism: apply

Maximalism is the deliberate refusal of the flat, quiet, single-plane default. The single
defining move is **intentional layer stacking**: a patterned or textured ground, an opaque
content plane, and floating ornament that overlaps the content plane's bounding box.
Two planes reads as decorated minimalism; three reads as maximalism. Everything else —
oversized display type, four typefaces, clashing saturated colour, zero-blur chromatic
shadows, sticker tilt, blend-mode interference — hangs off that one move.

Three things follow from it and are not negotiable.

**The budget is three.** At most three loud layers may compete inside one viewport at one
time, where a loud layer is any of the eight things doc §6 names: patterned ground,
chromatic stacked shadow, rotated element, marquee, blend-mode overlay, oversized display
type, sticker cluster, animated ornament. Four is where usability testing turns. Nothing in
CSS can count them, so the cap is enforced by `scripts/max-scan.mjs`, by the `loudLayers`
guard in the emitted component, and by review.

**Accents are role-bound, and the roles flip between themes.** Half the palette is
decoration-only on any given ground, and which half flips when the theme changes: lime is
16.63:1 on ink and 1.12:1 on paper. In dark mode `--max-paper` and `--max-ink` swap, so
`--max-text-on-ink` describes text on a *cream* surface and must bind to a deep accent —
the lifted violet measures 2.46:1 there. Components reach for `--max-text-on-paper`,
`--max-text-on-ink` and `--max-accent-safe`, never for a raw accent.

**Hit area is measured on the transformed box.** A tilted sticker button hit-tests against
its axis-aligned bounding box after `rotate`, and the 6px offset shadow inflates the box the
user *sees*. `--max-target-min` is 44px for that reason, not because 24px is wrong.
Three of WCAG 2.2's new criteria — 2.4.11 Focus Not Obscured, 2.4.13 Focus Appearance and
2.5.8 Target Size — are precisely what floating rotated ornament breaks by accident.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark mode
   strategy and component root. Never guess, never rewrite silently, and confirm the
   detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` before emitting anything. Do not reproduce token values or
   contrast ratios from memory.
3. Establish `scope` and `surfaceType`. Doc §9 gates this style by context, not by taste:
   it reads as confident on a brand or campaign page and as chaos on a task-oriented app.
   Whole-app application on an unscoped request is an anti-pattern — say so and narrow it.
4. **Count what is already loud.** If the target already carries a patterned ground, a hero
   marquee or a chromatic shadow, those count against the budget of three before this run
   adds anything. Say what the starting count is before promising a third layer.

## Inputs

Doc §13's input table, with the defaults it states.

| Input | Type | Default |
|---|---|---|
| `framework` | vanilla \| tailwind4 \| react \| svelte \| vue \| swiftui | detected, confirmed |
| `basePalette` | 1-3 hex values | required; the ink/paper anchors and a 4-6 accent ramp are derived from it |
| `density` | airy \| standard \| packed | `standard` — multiplies the `--max-s-*` scale by 1.25 / 1.0 / 0.7 |
| `intensity` | 0-100 | 60 |
| `surfaceType` | brand \| campaign \| editorial \| app-accent | required |
| `darkMode` | media \| class \| none | `media` |
| `motionPolicy` | full \| state-only \| none | `full` |
| `dryRun` | flag | off — see [Dry run](#dry-run) |

`surfaceType: app-accent` hard-caps intensity at 45 and forbids marquees and patterned
grounds on data surfaces. Every supplied accent is re-checked by
`ui-morphism-core:a11y-validate` against both grounds in both themes before it is admitted
to a role binding.

## Procedure

1. **Detect and confirm the stack** — `ui-morphism-core:detect-stack`. Branch every later
   emission decision on its output enum, not on a second read of `package.json`.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — the curves, the clamps and the
   `surfaceType: app-accent` cap, all from doc §13. Do not resolve it by hand and do not
   reach into core's directory: call `ui-morphism-core:token-emit`, give it that path and
   the requested intensity and context, and let it run its own bundled `intensity.mjs`.
   Core owns the resolver; this plugin owns the numbers; the JSON file is the whole
   interface between them.

   Three things the contract deliberately leaves to this skill. Round `shadowStack` to
   integer px at emit time, half up — the contract carries the unrounded line so the
   monotonicity sweep reads the curve doc §5 states, so the default 60 resolves to 8.0 and
   ships as 8px. Resolve the `chroma` ramp under `pairedRamps` yourself: core reads `knobs`
   and does not read that block, and the chroma each admitted accent is scaled to is
   reported on the same audit line as its count. And apply the `contextClamps` entries —
   `app-accent` forcing `layerCount ≤ 1` and `motionLoad = 0`, `motionPolicy: state-only`
   and `none` forcing `motionLoad = 0` — after resolution, because core's resolver caps
   intensity rather than individual knobs. Record every cap, clamp and rounding, including
   the ones that changed nothing. `references/tokens.md` §4 is the same table in prose, for
   reading; the JSON is what runs.

3. **Emit the token layer** via `ui-morphism-core:token-emit` under the `--um-maximalism-*`
   grammar, with `assets/tokens.css` shipped alongside it as the `--max-*` value layer and
   `assets/tokens.um-aliases.css` as the bridge. Populate `bg`, `surface`, `ink`, `border`,
   `accent`, `radius`, `shadow`, `blur`, `noise`, `space`, `font`, `text`, `leading`,
   `tracking`, `dur`, `ease`, `focus`, `target`. Do **not** populate `elev`: elevation here
   is offset distance at zero blur, and the real depth device is the layer stack, which §4
   states plainly is not a token. Light values on bare `:root`; dark values duplicated under
   both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and
   `:root[data-theme="dark"]`, each carrying **both** accent ramps — lifted for the dark
   ground, `-deep` for the cream surface. For Tailwind v4, emit `assets/tokens.theme.css`'s
   `@theme` shape, never nested inside an at-rule, with the dark overrides outside it.
   Copy the files; do not retype the values.

4. **Build the layer stack, up to the resolved `layerCount` and never past three.** In
   order: the CSS-generated patterned ground (`repeating-linear-gradient`,
   `radial-gradient` halftone, `repeating-conic-gradient` checks — 0 KB, never an image),
   the inline `feTurbulence` grain at `--max-grain-opacity`, and exactly one ornament class
   from `references/recipes.md` §3 — stickers, marquee or rotated collage. Wrap the scene in
   `isolation: isolate` so every blend mode resolves inside the scene rather than against
   the page backdrop. Refuse the fourth layer and record the refusal.

5. **Rewrite the targeted components to the vocabulary.** Blurred shadows become zero-blur
   offset shadows at the resolved `shadowStack` depth, single ink below the point where the
   composition can afford the chromatic stack as one of its loud layers and
   `round(d/3)` magenta / `round(2d/3)` cyan / `d` ink at or above it. Uniform radii become
   the mixed set — a hard `--max-r-0` beside a `--max-r-pill` beside a `--max-r-blob`.
   Borders go to the 2 / 3 / 6px stroke scale in solid ink. The type stack becomes the
   display + kicker + body + mono quartet, four families and no more.

6. **Put every text run on an opaque plane.** Body text sits on `--max-surface` or
   `--max-surface-2`, never directly on the pattern, the grain, a gradient or a photograph.
   This is the style's single most common 1.4.3 failure and it is not a contrast-value
   problem — local contrast against a patterned ground collapses wherever the pattern is
   light, and the average tells you nothing.

7. **Install the safety layer** as one non-removable `@layer maximalism.safety`, containing
   all of: the double focus ring (`outline: var(--max-focus-ring)` at
   `var(--max-focus-offset)` plus the `--max-focus-outer` halo as a `box-shadow`, because an
   element gets only one outline), `min-height` and `min-width` from `--max-target-min` on
   every interactive element, `@media (prefers-reduced-motion: reduce)`,
   `@media (prefers-reduced-transparency: reduce)`, `@media (forced-colors: active)` and the
   mobile / coarse-pointer degradation block. The blocks are quoted in full in
   `references/motion.md` and `references/recipes.md` §6 — emit them from there rather than
   from memory, because the one that goes missing when they are retyped is `forced-colors`,
   where a shadow-only boundary disappears entirely.

8. **Emit the Calm mode toggle whenever any infinite animation is emitted.** `data-calm` on
   `<html>`, persisted to `localStorage`, stopping all ambient motion and dropping the
   texture layers. `prefers-reduced-motion` is an OS-level all-or-nothing setting and is not
   a substitute: a user who wants your marquee stopped without disabling animation on their
   whole machine has no other route, and SC 2.2.2 is Level A. Recipe in
   `references/recipes.md` §5.

9. **Run the style scanner:**
   `node ${CLAUDE_SKILL_DIR}/scripts/max-scan.mjs <emitted paths> --json`
   It counts loud layers per scene against the cap of three, finds raster noise and pattern
   assets, animated properties outside the permitted list, infinite animations with no Calm
   hook, missing safety blocks, blend modes outside an `isolation: isolate` container,
   rotation past the resolved tilt ceiling, non-zero shadow blur, absolutely positioned
   ornament that survives below 640px, decorative layers that are not `pointer-events: none`,
   `order` and `row-reverse` on sequential content, and the font-family census. Fix every
   error before continuing. It computes no contrast; that is step 10.

10. **Run `ui-morphism-core:a11y-validate`** over everything emitted. It owns all nine
    universal checks and every contrast computation — this skill computes no ratios of its
    own. Feed it the style-specific assertions from `../audit/references/checklist.md` as
    well, and every emitted text/ground pair in both themes. Where a pair fails, rewrite it
    to the nearest passing role-bound accent and record the substitution; where a knob value
    is what caused the failure, clamp the knob. Never ship a failing pair to satisfy an
    intensity number.

11. **Measure the budgets** from `references/tokens.md` §8 — font bytes, image bytes,
    composited-layer estimate, blend-mode count and the animated-property list — and
    downgrade if any is blown. The cheapest downgrades, in doc §8's order: `mix-blend-mode`
    to a pre-composed `color-mix()` tone, grain image to a CSS gradient, chromatic shadow to
    a single hard shadow, animated marquee to a static ticker, rotated absolute collage to a
    grid where two children share a cell. Each step removes roughly one loud layer, so the
    performance fix and the accessibility fix point the same way.

12. **Write the audit report** to `reports/MAXIMALISM-AUDIT.md` in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table with these rows: Style and plugin version; Intensity
   (effective, requested, and the context that capped it); Scope and `surfaceType`;
   Framework / styling system, with detection confidence and whether the user confirmed it;
   Dark mode (media / class / both); Files changed (written / modified / refused); Verdict
   (**PASS** / **PASS WITH CORRECTIONS** / **FAIL**). Then one paragraph: what was applied to
   what, and the loud-layer count this run left behind on each scene.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, at **three decimal places, unrounded**:
   a ratio a hair under 4.5 fails 4.5. One row per emitted pair **per theme**, because the
   role bindings rebind and a light-mode-only table is the failure this style ships. Every
   accent used as text carries a row on both grounds, so the decoration-only half of the
   palette is visible as such rather than absent.

3. **Checklist** — two tables, universal first, both with columns
   `Check | Verdict | Failing selector / note`. The universal table has exactly nine rows:
   text contrast (1.4.3), non-text contrast (1.4.11), focus visible (2.4.7 / 2.4.13), target
   size (2.5.8), forced colors, reduced motion, reduced transparency, colour-only encoding
   (1.4.1), DOM order (1.3.2). The style table carries the rows from
   `../audit/references/checklist.md`, plus this style's own loud-layer census: one row per
   emitted scene, naming each layer it counted and the total against the cap of three.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`, one row per number
   `references/tokens.md` §8 sets: font bytes total, display/kicker/body/mono family count,
   grain asset bytes, pattern asset bytes, collage and hero image bytes, composited-layer
   estimate, blend-mode count, added JS, and INP.

5. **Corrections** — columns `Token | Before | After | Reason`, one row per token this skill
   changed on its own initiative, including every accent it re-bound to a role token after a
   contrast failure. Then a bullet per intensity cap, clamp and rounding, **including the
   ones that changed nothing** — the `app-accent` cap, both `motionPolicy` clamps, the
   `shadowStack` rounding and the tilt ceiling all appear here.

6. **Refusals** — columns `Requested | Refused because | Offered instead`, one row per
   `references/anti-patterns.md` entry that fired. The fourth loud layer is the entry that
   fires most; name which three survived.

7. **Manual TODOs** — a checkbox list of what could not be verified statically, each naming
   the *method* rather than the concern: measure the axis-aligned bounding box of every
   rotated control after transform, sample the lightest and darkest pixel of every patterned
   ground under its text, tab through every anti-grid composition, run the page in Edge's
   forced-colors emulation, measure real font subset bytes, and watch one full marquee cycle
   with Calm mode on and off.

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

- `tokens/maximalism.tokens.css` — the `:root` block, both dark blocks and the role bindings
- `tokens/maximalism.theme.css` — the Tailwind v4 `@theme` mirror when `framework=tailwind4`
- `styles/maximalism.safety.css` — the `@layer maximalism.safety` sheet: focus, target size,
  reduced motion, reduced transparency, forced colors and low-end degradation
- `components/max/*` — `Card`, `Button`, `Sticker`, `Marquee`, `Kicker`, `DisplayHeading`,
  `CalmToggle`
- `reports/MAXIMALISM-AUDIT.md`
- optional `tokens/maximalism.figma.json` — Figma variables with three modes, Quiet / Loud /
  Riot, mapped to intensity 25 / 60 / 90

## Intensity knobs

Doc §13's table, with the resolved column from
`${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json`. Full resolution at every five points
in `references/tokens.md` §4.

| Knob | 0 | 100 | Default (60) | Controls |
|---|---|---|---|---|
| `layerCount` | 1 (flat surface only) | 3 (ground + grain + ornament) | 2 | Number of simultaneous loud planes; **hard-capped at 3 regardless of intensity** |
| `chromaSpread` | 1 accent at OKLCH chroma 0.10 | 6 accents at chroma 0.30 | 4 accents at chroma 0.22 | Palette breadth and saturation |
| `shadowStack` | `2px 2px 0` single ink | `4/8/12px` three-colour chromatic | 8px | Offset shadow depth and layer count |
| `tiltRange` | `0deg` | `±5deg` | `±3deg` | Rotation applied to cards, stickers, marquees |
| `motionLoad` | 0 ambient animations, 120ms state transitions only | 3 ambient loops, 24s marquee, scroll-linked rotation | 1 ambient loop | Ambient motion volume; forced to 0 under `prefers-reduced-motion` or Calm mode |

`layerCount`, `chromaSpread` and `motionLoad` are counts, so their ladders are stepped
rather than continuous; `shadowStack` and `tiltRange` are linear across the whole range.
Every knob is monotone across 0→100.

**Hard clamps, independent of intensity:** three loud layers per viewport, at any value, in
any context; shadow blur exactly 0; targets ≥ 44px from `--max-target-min`, re-measured on
the transformed box; the double focus ring at 4px inner and 2px offset; grain opacity
0.04-0.12, shipped at 0.08 light and 0.05 dark; four font families and 180 KB of font bytes;
zero raster noise or pattern assets; no full-area colour change faster than 2.5 Hz; no blend
mode on a full-viewport overlay or outside an `isolation: isolate` container; no
`position: absolute` ornament below 640px; a pause control on every infinite animation.

**Context caps, which override intensity:** `surfaceType: app-accent` caps intensity at 45,
which resolves to one loud layer, and then clamps `motionLoad` to 0 and forbids marquees and
patterned grounds outright. `motionPolicy: state-only` and `none` clamp `motionLoad` to 0;
`none` additionally collapses state transitions to 1ms at emit time. All are reported.

**Intensity 0 is not nothing.** It is one opaque content plane on the flat paper ground: a
real 2px ink border, a mixed-radius surface, a single 2px ink offset shadow, the display and
body pair at rest, the double focus ring and the 44px target minimum. Doc §2 records that a
two-plane composition reads as decorated minimalism, so a one-plane composition is the
honest floor — a shippable brand card, not an absence.

## Validation — all must pass before reporting done

Doc §13's twelve self-run checks, in its order. The full list with owners is in
`../audit/references/checklist.md`; `ui-morphism-core:a11y-validate` runs the universal half
and `scripts/max-scan.mjs` runs the mechanical half.

- [ ] Every emitted text/ground pair computed by `ui-morphism-core:a11y-validate` in both
      themes: body ≥ 4.5:1, large text and non-text boundaries ≥ 3:1, unrounded
- [ ] Loud layers counted per scene; no scene exceeds three
- [ ] Every interactive element takes `min-height` and `min-width` from `--max-target-min`
      rather than a literal, and the axis-aligned box after `rotate` still measures ≥ 44px
- [ ] The double focus ring clears 3:1 against each emitted accent plus paper, ink and a
      neutral mid-grey stand-in for photography
- [ ] A `@media (prefers-reduced-motion: reduce)` block exists and cancels every
      `animation-iteration-count: infinite` declaration emitted
- [ ] A `CalmToggle` is emitted wherever any infinite animation is
- [ ] A `@media (forced-colors: active)` block exists, and every container's boundary is a
      real `border` rather than a shadow
- [ ] Total emitted font weight ≤ 180 KB, four families at most, and no raster noise or
      pattern asset emitted at all
- [ ] No animated property outside `transform` / `translate` / `rotate` / `scale` /
      `opacity` / `box-shadow` / `background-color`
- [ ] No `position: absolute` ornament below 640px, and no horizontal overflow at 320px
- [ ] Every decorative layer carries `aria-hidden="true"` and `pointer-events: none`
- [ ] DOM order matches reading order — no `order` and no `row-reverse` on sequential content
- [ ] `intensity: 0` still produces a bordered, accessible, unornamented plane

## Refuse to generate

Read `references/anti-patterns.md` in full and follow the core refusal protocol: refuse,
explain in one sentence, offer the compliant alternative, record it in the report's Refusals
section. Highest frequency:

- A fourth loud layer, at any intensity value
- Body text on a pattern, gradient, photograph or grain layer with no opaque plane behind it
- Any text/ground pair below 4.5:1, or 3:1 for large text — including "just for the hero"
- An infinite animation with no pause mechanism and no Calm toggle
- Lime, cyan or orange used as text or as the only boundary on the paper ground
- A rotated sticker button with no enforced minimum, or any target under 44px after transform
- Focus indication removed, or replaced by a background-colour change alone
- `mix-blend-mode` on a full-viewport overlay, or any blend mode outside an
  `isolation: isolate` container
- A raster noise or pattern image where CSS or an inline SVG filter does the same work
- Maximalist treatment on tables, charts, form validation, error states or checkout steps
  when `surfaceType` is `app-accent`
- More than four font families, or a font payload above 180 KB
- Glassmorphic translucent panels layered over a patterned maximalist ground
