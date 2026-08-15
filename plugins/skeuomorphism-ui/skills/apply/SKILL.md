---
name: apply
description: >-
  Use when the user NAMES the style — skeuomorphism, skeuomorphic, neo-skeuomorphism, material
  realism — or describes its concrete moves: a four-layer shadow stack under one overhead
  light, bevelled faces, a three-stop face gradient, letterpress type, fine SVG grain,
  leather, brushed metal, wood, felt or rubber, instrument-panel and audio-plugin controls,
  recessed wells, or "make this feel like a real object". THE TEST against the two
  soft-surface siblings: here the surface IMITATES A NAMED MATERIAL, with texture and a
  gradient face. A soft surface imitating nothing is neumorphism-ui when it is the same colour
  as the page ground, claymorphism-ui when it is an inflated pastel. "Neo-skeuomorphism" is
  this skill; "new skeuomorphism" is neumorphism-ui. ui-morphism is descriptive and plural:
  one named language, measured tokens, a stated when-not-to-use — not a design-quality tool.
  Do NOT use for open-ended quality work — "make it look good", "make it modern", "polish
  this", "clean this up", "make it less AI-generated", taste or visual-craft critique,
  de-slopping, animation craft, or a general accessibility sweep. Dedicated design, taste,
  animation and a11y tools answer those better and should win them. Nor for the other named
  languages: glassmorphism-ui, minimalism-ui, maximalism-ui, brutalism-ui, liquid-glass-ui,
  bento-grid-ui, spatial-ui. To review without editing, use skeuomorphism-ui:audit.
argument-hint: "[scope glob] [--intensity=0-100] [--material=plastic|brushed-metal|wood|leather|felt|rubber|mixed] [--density=compact|default|comfortable] [--dark-mode=media|class|both] [--framework=react-ts|react-js|vue|svelte|html|swiftui] [--dry-run]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/skeuo-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/01-skeuomorphism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Skeuomorphism: apply

Borrow the texture, shape, lighting and behaviour of a physical object so that a control
announces what it does before anyone touches it. The single defining move is **a
consistent, single overhead light source rendered as a four-layer shadow stack** — outer
contact, outer ambient, inset top bevel highlight, inset bottom shade — on every raised
surface without exception. Gradients, grain, letterpress type, leather and brushed metal
are decoration hung off that lighting model. One shadow reads flat; four read machined.

**The thing that makes this style different from every other one in the set: four
separate systems have to agree on one number.** The shadow stack, the three-stop face
gradient, the grain layer and the specular hotspot are four independent CSS mechanisms,
and they are only skeuomorphism when all four are lit from the same place. Get one of
them wrong — a bottom-lit gradient under a top-lit stack, a highlight on the wrong edge —
and the whole thing collapses into kitsch. Doc §3 names mixed light directions as the
number-one tell of a fake, and doc §9 warns that this style has a very low tolerance for
near-misses where flat design degrades gracefully. That is why the scanner in step 9
exists and why it checks polarity layer by layer.

Three things follow and are not negotiable.

**Every control carries a real 1px border.** `forced-colors: active` forces
`box-shadow: none`, `text-shadow: none` and `background-image: none`, so the entire style
disappears in one step; a bevel-bounded control becomes an invisible rectangle. Use
`--sk-border-strong` (**4.01:1** against the face, **3.40:1** against the chassis). The
decorative `--sk-border` measures **1.76:1** and is never a boundary.

**The grain layer needs `display: none` inside that same forced-colors block.**
`background-image: none` does *not* apply to `url()` backgrounds, so the SVG data-URI
grain is the one part of the style that **survives** the mode, and it survives it sitting
on top of the user's forced palette. This is the single most-missed line in the style.

**Grain frequency is not a token and must never be advertised as one.** A data URI is an
opaque string and CSS cannot interpolate a custom property inside it, so only the layer's
opacity is a variable. `baseFrequency` 0.9, `numOctaves` 2, `fractalNoise`, `stitch` and
the 160px tile are baked into `--sk-noise` and are edited in the URI, in all three places
that carry a copy of it. Changing them changes the *material*; `--sk-noise-opacity`
changes only the *intensity*.

2026 position: a genuine revival but a narrow one, and smaller than the trend press
claims. Material realism is mainstream at the OS layer and in audio, automotive and
creative-tool niches, while object-mimicry skeuomorphism never exceeded 0.1% of 208,000+
measured UI generations between January and June 2026. Accent, not foundation.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark
   mode strategy and component root. Never guess, never rewrite silently, and confirm the
   detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` before emitting anything. Do not reproduce token values or
   contrast ratios from memory. `references/recipes.md` is the component shape,
   `references/motion.md` the state table, `references/anti-patterns.md` the refusals.
3. Establish `scope`. Default is `src/components/ui/**`. Whole-app application on an
   unscoped request is an anti-pattern — say so and narrow it. Doc §9 puts dense
   enterprise UI, tables, dashboards and content-first reading products on the avoid list
   outright, and its own formulation is the argument: maximum intensity on one element
   beats 30% everywhere.
4. **Decide what the objects are made of before you touch a shadow.** Radius, face ramp,
   ink and specular strength are a statement about material, and doc §3 is explicit that
   getting the geometry wrong is more damaging than getting the texture wrong. The four
   materials the doc resolves are in `references/tokens.md` §4; `leather` and `felt` have
   no tabled ramp and must be derived and re-measured rather than invented.

## Inputs

| Input | Type | Default |
|---|---|---|
| `framework` | react-ts \| react-js \| vue \| svelte \| html \| swiftui | detected, confirmed |
| `styling` | css \| css-modules \| tailwind-v4 \| styled-components | detected, confirmed |
| `basePalette` | 1-3 hex values | brand primary, warmed into a material ramp |
| `material` | plastic \| brushed-metal \| wood \| leather \| felt \| rubber \| mixed | plastic |
| `density` | compact \| default \| comfortable | default — padding 10 / 14 / 18px, min-height 36 / 44 / 52px |
| `intensity` | 0-100 | 60 |
| `scope` | glob list | `src/components/ui/**` |
| `darkMode` | media \| class \| both | both |
| `dryRun` | flag | off — see [Dry run](#dry-run) |

`density: compact` may trade padding for density but never takes a target below the
24×24 SC 2.5.8 floor, and every control still sizes from `var(--sk-target-min)` rather
than a literal. Detection is offered for confirmation, never applied silently.

## Procedure

1. **Detect and confirm the stack** — `ui-morphism-core:detect-stack`. Branch every later
   emission decision on its output enum, not on a second read of `package.json`.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — the five curves, the hard
   clamps, the two context caps and the three context clamps, all from doc §13. Do not
   resolve it by hand and do not reach into core's directory: call
   `ui-morphism-core:token-emit`, give it that path and the requested intensity and
   context, and let it run its own bundled `intensity.mjs`. Core owns the resolver; this
   plugin owns the numbers; the JSON file is the whole interface between them.

   Three things the contract deliberately leaves to this skill. Round `travel` to integer
   px at emit time — the contract carries the unrounded curve so the monotonicity sweep
   reads the line doc §13 states. Apply the **travel floor** after rounding: doc §4 and
   §13 suppress the press displacement to 0 below `shadowDepth` 0.25, so a 1px jump never
   happens without shadow support, and that floor is independent of the curve. And apply
   the three `contextClamps` — `perfTarget: low-end` capping `materialFidelity` at 1,
   `prefersContrast: more` taking `grainOpacity` to 0 and `gradientSpread` to 6%, and
   `controlHeight: under-64` capping `travel` at 1px — after resolution, because core's
   resolver caps intensity rather than individual knobs. Record every cap, clamp, floor
   and rounding, **including the ones that changed nothing**. `references/tokens.md` §6 is
   the same contract in prose with the table resolved at every five points; the JSON is
   what runs.

3. **Derive the material palette.** Warm the user's brand colours: clamp saturation to
   8-25% and lightness to 82-95% for faces, generate the three gradient stops at the
   resolved `gradientSpread`, and take the mid stop as the nominal surface so the
   component's colour identity does not shift. Never `#ffffff` and never `#000000` — no
   physical material is pure white or pure black. Every derived ramp goes back through
   `ui-morphism-core:a11y-validate` against the **darkest** stop of that ramp, not the
   average and not the top stop.

4. **Emit the token layer** via `ui-morphism-core:token-emit` under the
   `--um-skeuomorphism-*` grammar, with `assets/tokens.css` shipped alongside it as the
   `--sk-*` value layer and `assets/tokens.um-aliases.css` as the bridge. Populate `bg`,
   `surface-1`, `ink`, `border`, `border-strong`, `accent`, `danger`, `radius`, `elev`
   (0-3), `shadow-press`, `noise-opacity`, `space`, `font-body`, `text`, `leading`,
   `tracking-label`, `dur`, `ease`, `focus`, `target`. Do **not** populate `shadow-1` …
   `shadow-5`: doc §4 names the compounds `--sk-elev-0` … `--sk-elev-3` and defines them
   as depth levels that happen to be spelled as `box-shadow` values, so a parallel shadow
   ramp is the same four values under a second name. Do **not** populate `noise-freq`; see
   step 6. Light values on bare `:root`; dark values duplicated under both
   `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and
   `:root[data-theme="dark"]`, with identical lists, so an explicit toggle beats the OS
   preference in both directions. For Tailwind v4, emit `assets/tokens.theme.css`'s
   `@theme` shape — never nested inside an at-rule, with the theme switching outside it in
   `@layer theme`, because Tailwind v4 does not process a `@theme` inside a media query
   and the whole override vanishes silently.

5. **Rewrite the targeted components by role, not by geometry.** Button, toggle/switch,
   input, select, slider, card, panel and tab go to the four-layer stack plus the 3-stop
   `--sk-face` plus a 1px `--sk-border-strong` plus letterpress type. The rung comes from
   the role and does not move with intensity: wells, inputs, selects, textareas and slider
   tracks take `--sk-elev-0` and **invert** the stack — highlight at the bottom, shade at
   the top — which is the only permitted exception to the top-light rule and is what makes
   a hole read as a hole; chips, tags and keys take `--sk-elev-1`; buttons and cards take
   `--sk-elev-2`; dialogs and floating panels take `--sk-elev-3`. The full conversion table
   is `references/tokens.md` §9 and the component shapes are `references/recipes.md`.

6. **Insert exactly one grain layer, on the outermost chassis.** One
   `::before` with `background-image: var(--sk-noise)` at `background-size: 160px 160px`,
   `pointer-events: none`, behind the content via `z-index: -1` under an
   `isolation: isolate` parent, with `opacity: var(--sk-noise-opacity)` wired to the
   resolved `grainOpacity`. Never one per component — twenty components with their own
   `::before` is twenty extra paint rectangles. Never a raster tile: the data URI is about
   330 bytes and a 512×512 noise PNG is 40-90KB and buys nothing visible at 5% opacity.
   The frequency parameters are baked into the URI, so if the `material` input calls for a
   different grain you emit a **different data URI** and change it in all three places that
   carry a copy — `assets/tokens.css`, the `@utility sk-grain` in `assets/tokens.theme.css`
   and the `NOISE` constant in the React component. Edit all three or none.

7. **Install the motion system.** Hover brightens and does not raise — pointer hover is
   not a physical event. Press travels `translateY(var(--sk-press-travel))` **and** swaps
   to the inset stack; the affordance is the movement plus the light inversion, not a
   colour change. Release returns over 220ms with under 4% overshoot. Animate `transform`,
   `translate`, `opacity` and `filter` only. **Never put `box-shadow` in a `transition` or
   a `@keyframes`** — doc §5's own `.sk-button` listing does, doc §6 and §13 forbid it and
   they are the normative statements, so the emitted rule drops the term and the audit
   records the deviation once. Where a shadow genuinely has to change smoothly, cross-fade
   two absolutely positioned pseudo-elements each carrying a static shadow.
   `references/motion.md` has the state table.

8. **Write the guard blocks** as a separate cascade layer, `@layer skeuo-a11y`, so it
   always wins: `@media (prefers-reduced-motion: reduce)` (durations to 1ms, travel
   removed, **pressed appearance preserved** — the inset swap is an SC 1.4.11 state
   indicator, so it stays and simply arrives instantly), `@media (prefers-contrast: more)`
   (grain opacity 0, ink and borders darkened, gradient spread flattened to about 6%),
   `@media (forced-colors: active)` (system colour keywords, a real border on every
   control, `forced-color-adjust: none` on the control chrome and never on text, and the
   grain pseudo-element explicitly `display: none`), and
   `@media (prefers-reduced-transparency: reduce)` wherever the hybrid layers anything
   translucent over the material — progressive enhancement only, since Chrome and Edge
   118+ ship the query, Firefox has it behind a flag and Safari does not support it as of
   August 2026.

9. **Run the style scanner:**
   `node ${CLAUDE_SKILL_DIR}/scripts/skeuo-scan.mjs <emitted paths> --json`
   It checks the light direction layer by layer — every outer shadow falling downward, the
   light inset at the top of a raised surface and the dark inset at the bottom, and the
   recessed inversion as the only exception — plus the single blurred shadow presented as
   this style, a shadow-bounded control with no border, the face gradient's direction and
   45% midpoint, the specular band, a `:focus-visible` rule that replaces the stack
   instead of adding to it, the grain's baked parameters, opacity band and layer count,
   the `display: none` the grain needs inside forced-colors, `box-shadow` and
   `background-image` inside transitions and keyframes, `will-change: box-shadow`, the
   pressed state surviving reduced motion, raster textures, the 12px hybrid blur cap and
   the 2px travel ceiling. Fix every error before continuing. It computes no contrast;
   that is step 10.

10. **Validate.** Run `ui-morphism-core:a11y-validate` over everything emitted. It owns
    all nine universal checks and every contrast computation — this skill computes no
    ratios of its own. Feed it the style-specific assertions from
    `../audit/references/checklist.md` as well, and specifically ask it to measure body
    text against the **darkest** gradient stop it can sit on: `#4a3f2d` on the mid stop
    `#e8e0d2` is **7.85:1** and on the darkest stop `#d9cfbc` is **6.67:1**, and that gap
    is the whole reason the measurement is taken this way. Where a pair falls short,
    auto-darken `--sk-border-strong` and `--sk-ink` until 3:1 and 4.5:1 hold against the
    darkest adjacent stop, recompute, and record what changed. Never ship a failing pair
    to satisfy an intensity number.

11. **Count the budgets and downgrade if one is blown.** Decorative image bytes ≤ 60KB per
    route with no single raster texture over 40KB; emitted CSS ≤ 8KB gzipped for tokens
    plus the component layer; one grain layer per scroll container; ≤ 60 simultaneously
    animating four-layer shadows; hybrid backdrop blur ≤ 12px radius on ≤ 2 elements per
    viewport. If a budget is blown, walk doc §8's degradation ladder in its stated order —
    drop the grain, then elevation 2 to elevation 1, then the 3-stop gradient to the mid
    fill plus the 1px top bevel, then photographic textures to a 2KB tiling SVG pattern —
    and record the downgrade rather than inventing a new economy.

12. **Write the audit report** to `reports/skeuomorphism-audit.md` in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table with these rows: Style and plugin version; Intensity
   (effective, requested, and the context that capped it); Scope; Framework / styling
   system, with detection confidence and whether the user confirmed it; Dark mode (media /
   class / both); Files changed (written / modified / refused); Verdict (**PASS** / **PASS
   WITH CORRECTIONS** / **FAIL**). Then one paragraph: what was applied to what, and the
   single thing the reader needs before looking at the numbers — which for this style is
   usually which material each rewritten component was assigned and whether its ramp was
   tabled or derived.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, at **three decimal places,
   unrounded**: 2.999 fails 3, 4.497 fails 4.5. One row per emitted pair, and **every text
   token measured against the darkest gradient stop it can sit on is always one of them**,
   named as the darkest stop in the Backdrop column. The control boundary against both its
   own fill and the surface behind it is always another, in both themes.

3. **Checklist** — two tables, universal first, both with columns `Check | Verdict |
   Failing selector / note`. The universal table has exactly nine rows: text contrast
   (1.4.3), non-text contrast (1.4.11), focus visible (2.4.7 / 2.4.13), target size
   (2.5.8), forced colors, reduced motion, reduced transparency, colour-only encoding
   (1.4.1), DOM order (1.3.2). The style table carries the rows from
   `../audit/references/checklist.md`, plus one matrix this style adds: **the material
   assignment** — every rewritten component with its material, radius, face ramp, ink and
   whether the ramp came from doc §5's four resolved materials or was derived under §13
   step 2 and re-measured.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`, one row per number
   `references/tokens.md` §10 sets: grain layers per scroll container, grain opacity light
   and dark, decorative image bytes per route, largest single raster texture, emitted CSS
   bytes gzipped, simultaneously animating shadow stacks, hybrid backdrop-blur radius and
   count, added JS.

5. **Corrections** — columns `Token | Before | After | Reason`, one row per token this
   skill changed on its own initiative — every auto-darkened border or ink belongs here,
   and so does the dropped `box-shadow` term in the button's `transition`. Then a bullet
   per intensity cap, clamp, floor and rounding, **including the ones that changed
   nothing**: the two context caps, the three context clamps, the travel rounding and the
   `shadowDepth` 0.25 travel floor.

6. **Refusals** — columns `Requested | Refused because | Offered instead`, one row per
   `references/anti-patterns.md` entry that fired.

7. **Manual TODOs** — a checkbox list naming the *method* rather than the concern. For
   this style it always includes at least these four, because none is computable from CSS
   text: open a real Windows High Contrast session and confirm every control still has a
   boundary and the grain is gone; sample the rendered pixels of body text over the grained
   and gradient-filled surface rather than trusting the declared stop; measure the computed
   target box of every knob, dial and fader in a cluster; and run the interface at 320px
   and at 200% zoom with the SC 1.4.12 text-spacing overrides applied, looking for clipped
   uppercase letterpress labels and for a fixed-width hardware panel that will not reflow.

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

- `tokens/skeuomorphism.css` — the `:root` block plus the dark override duplicated under
  both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and
  `:root[data-theme="dark"]`, with a computed contrast comment on every ink and border
- `tokens/skeuomorphism.tailwind.css` — the `@theme` + `@utility` variant when Tailwind v4
  is selected, `@theme` always at the top level and the overrides in `@layer theme`
- `components/skeuo/*` — the rewritten or newly generated set, typed, with `intensity` and
  `material` threaded through, each carrying its own border and guard blocks
- `styles/skeuo-a11y.css` — the reduced-motion, increased-contrast, reduced-transparency
  and forced-colors blocks as `@layer skeuo-a11y`
- `reports/skeuomorphism-audit.md`

## Intensity knobs

Doc §13's table, verbatim. Default intensity is **60**, and 60 is the row that reproduces
`assets/tokens.css` exactly — 15% spread is the spread `--sk-surface-hi` and
`--sk-surface-lo` already carry, and 0.05 / 0.07 are the shipped `--sk-noise-opacity`
values. Full resolved table at every five points in `references/tokens.md` §6.

| Knob | Range | At 0 | At 100 | Notes |
|---|---|---|---|---|
| `shadowDepth` | 0-1 multiplier on all four layers | no shadows | contact `0 1px 2px/.25`, ambient `0 4px 10px/.18`, bevel `.80`, lip `.12` | Below 0.25 the press travel is suppressed to avoid a 1px jitter with no visual support |
| `gradientSpread` | 0-24% luminance between top and bottom stop | flat fill | 24% (only for polished metal) | Default 15%. Above 18% starts looking like a 2009 web button |
| `grainOpacity` | 0-0.08 | none | 0.08 | Default 0.05 light / 0.07 dark. Hard-capped at 0.08; the skill will not emit higher |
| `materialFidelity` | 0-3 (0 = colour only, 1 = + gradient, 2 = + grain, 3 = + specular hotspot & edge highlight) | colour | full | Controls how many decorative layers exist, which is the real perf lever |
| `travel` | 0-2px press displacement | none | 2px | Default 1px. 2px only for large hardware metaphors ≥ 64px tall |

**Hard clamps, independent of intensity:** one overhead light source across every emitted
component, with the recessed inversion as the only exception; exactly four shadow layers
on a raised surface at `elev-2`, never a single shadow presented as this style; grain
opacity ≤ 0.08 and ≤ 1 grain layer per scroll container; grain frequency fixed at
`fractalNoise` / 0.9 / 2 octaves / stitch on a 160px tile, edited in the URI and never
tabled as a custom property; a real 1px `--sk-border-strong` on every control, never a
bevel as the boundary; the focus indicator additive to the resolved stack, ≥ 2px, never a
replacement; targets ≥ `--sk-target-min` (44px) and never below the 24×24 SC 2.5.8 floor;
text measured against the darkest gradient stop it can sit on; zero animated `box-shadow`,
`background-image` or gradient stops; decorative image bytes ≤ 60KB per route with no
raster texture over 40KB and no text baked into one; emitted CSS ≤ 8KB gzipped; hybrid
backdrop blur ≤ 12px on ≤ 2 elements per viewport.

**Context caps, which override intensity:** `surface: running-text` and
`surface: data-table` both cap at **0** — doc §13 refuses skeuomorphic treatment on
body-copy backgrounds, on table rows and on anything holding more than roughly 120
characters of running text, and the intensity-0 rung is the bordered, unornamented,
legible container that answer resolves to. Both fire as a cap *and* are recorded as a
refusal. Three context clamps apply after resolution: `perfTarget: low-end` caps
`materialFidelity` at 1, `prefersContrast: more` takes `grainOpacity` to 0 and
`gradientSpread` to 6%, and `controlHeight: under-64` caps `travel` at 1px. All are
reported in the audit.

**Intensity 0 is not nothing.** It is the mid-stop face colour as a flat fill, the 1px
`--sk-border-strong` material edge, `--sk-ink` at body-copy grade, the additive focus ring
and the 44px target — with no shadow stack, no gradient, no grain, no specular hotspot and
no press travel. Doc §8's degradation ladder ends exactly there and calls it a perfectly
respectable place to land: flat 2.0 / semi-flat, which `minimalism-ui` owns as an alias.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`; `ui-morphism-core:a11y-validate`
runs the universal half and `scripts/skeuo-scan.mjs` decides the mechanical half. The
non-negotiable ones:

- [ ] Every emitted foreground/background pair ≥ 4.5:1 body text, ≥ 3:1 at ≥ 24px or
      ≥ 19px bold, measured against the **darkest** gradient stop. Unrounded — 2.999:1
      fails 3:1
- [ ] Every control boundary ≥ 3:1 against **both** its own fill and the surface behind
      it, in both themes, and never `--sk-border` alone
- [ ] Light direction identical across every emitted component; recessed containers are
      the only inversion, and every one of them inverts **both** insets
- [ ] Every raised surface carries the full stack at its rung; no single blurred shadow
      ships as this style
- [ ] Every element relying on a shadow or bevel for its edge also has a real `border`
- [ ] `@media (forced-colors: active)` present, using system colour keywords, giving every
      control a border, hiding the grain with `display: none`, and with no
      `forced-color-adjust: none` on a text-bearing element
- [ ] `@media (prefers-reduced-motion: reduce)` present, removing the travel and
      **preserving** the pressed appearance
- [ ] `@media (prefers-contrast: more)` present, setting grain opacity to 0
- [ ] Zero `transition`, `animation` or `@keyframes` targeting `box-shadow`,
      `background-image` or gradient stops; no `will-change: box-shadow`
- [ ] Every `:focus-visible` re-states the resolved stack before the ring and pairs it
      with `outline: var(--sk-focus-width) solid transparent`, and no rule anywhere sets
      `outline: none` without a replacement in the same rule set
- [ ] Every interactive rule yields a computed box ≥ 24×24 CSS px, sized from
      `var(--sk-target-min)` rather than a literal
- [ ] Grain layer count ≤ 1 per scroll container; opacity ≤ 0.06 light, ≤ 0.08 dark
- [ ] Every hardware metaphor is keyboard-operable — `role="slider"` with `aria-valuenow`,
      `-valuemin`, `-valuemax` and `-valuetext` plus arrow keys on knobs, dials and faders
- [ ] Decorative layers are `aria-hidden`; no text is baked into a texture
- [ ] The page reflows at 320px with no two-dimensional scrolling, and uppercase
      letterpress labels survive the SC 1.4.12 text-spacing overrides
- [ ] Dark-mode variant generated under both selectors and independently contrast-checked
- [ ] `intensity: 0` still produces a bordered, accessible, unornamented control

## Refuse to generate

Read `references/anti-patterns.md` in full and follow the core refusal protocol: refuse,
explain in one sentence, offer the compliant alternative, record it in the report's
Refusals section. Highest frequency:

- A control whose only boundary is a shadow or a bevel, with no border meeting 3:1
- Neumorphic dual-shadow extrusion on a same-colour background — that is `neumorphism-ui`,
  and doc §12 measures typical neumorphic controls at 1.2:1 to 1.7:1 against their own
  ground
- Any `transition: box-shadow`, or `@keyframes` mutating `box-shadow`, a gradient or the
  grain
- Grain opacity above 0.08, or more than one grain layer per scroll container
- Raster textures over 40KB, or any texture with text baked into it
- Skeuomorphic treatment on body-copy backgrounds, table rows, or any element holding more
  than about 120 characters of running text
- Drag-only knobs, dials or faders with no keyboard handler and no `role="slider"`
- Mixed light directions in a single emitted set
- `forced-color-adjust: none` on a text-bearing element
- Removing an existing focus indicator in favour of a "more realistic" pressed look
- Fixed-width hardware panels that cannot reflow below 640px
- Full-app application when the request was for a single component
