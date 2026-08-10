---
name: apply
description: >-
  Use when the user NAMES the pattern — "bento", "bento box layout", "Apple-style feature
  grid" — or describes its concrete moves: an asymmetric or varied-span tile grid where size
  encodes importance on a locked gutter, turning a list of features or stats into
  differently sized tiles, assigning spans by content weight, or fixing reading order
  against `grid-auto-flow: dense`. This skill
  restructures markup and layout; it does not restyle surfaces. ui-morphism is descriptive
  and plural — one named language with measured tokens and a stated when-not-to-use — not a
  design-quality tool. Do NOT use for open-ended quality work: "make it look good", "make it
  modern", "polish this", "clean this up", "improve the design", "make it less
  AI-generated", "fix my layout", general information-architecture or responsive-design
  review, taste or visual-craft critique, de-slopping, or animation and micro-interaction
  craft. A general design, taste or animation skill answers those better and should win
  them. Do not use for the sibling languages either:
  translucent panels (glassmorphism-ui), hard-bordered zero-blur restyling (brutalism-ui).
  Nor for Liquid Glass, soft extruded or puffy surfaces, material texture, quiet
  subtraction, layered collage, or depth ladders — separate visual
  languages, documented in docs/01 through docs/10, with plugins planned but not yet built.
  To review an existing bento without changing it, use bento-grid-ui:audit.
argument-hint: "[scope glob] [--density=airy|standard|compact] [--intensity=0-100] [--interactive-tiles] [--dark=media|class|none]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/assign-spans.mjs *)
license: MIT
metadata:
  sourceDoc: docs/09-bento-grid.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Bento grid: apply

A single shared grid whose cells deliberately differ in size: one dominant tile carrying the
headline claim, surrounded by smaller tiles each holding exactly one fact, metric, screenshot or
icon. The single defining move is **size-as-hierarchy inside a locked gutter** — variable spans,
invariant gap. Not the rounded corners, not the cards. If every tile is the same size you have a
card grid; if the gaps vary you have a collage.

**This skill is different from the other nine in the set: it restructures markup and layout, not
surfaces.** It reads existing content, classifies each item, assigns a span by content weight,
rewrites DOM order to match reading order, adds intrinsic media dimensions, and only then emits
a token layer. Most of what it changes is structure, and the hardest thing it has to get right
is not contrast — it is that **visual order and DOM order stay the same thing**. Everything
about `grid-auto-flow: dense`, `reading-flow` and explicit placement follows from that.

2026 position: mainstream, not dominant, no longer differentiating. It is the safe default for a
feature section and still the right answer for dashboards and overview screens. Say so if the
user's brief is to be memorable — bento is the floor, not the ceiling.

## Before you start

1. Run `ui-morphism-core:detect-stack` and record framework, styling system, dark-mode strategy
   and component root. Never guess, never rewrite silently, and confirm the detection with the
   user. `confidence: low` means ask.
2. Read `references/tokens.md` for the token table and `references/recipes.md` for the emitted
   stylesheet. Do not reproduce a value or a rule from memory.
3. Establish `scope`. Default is the single section the user named. Converting every card list
   in an app on an unscoped request is an anti-pattern; say so and narrow it.
4. **Check the content shape before promising a layout.** §9 is explicit about where the pattern
   does not apply: sequential content, long-form content, strictly comparable items, three
   items, and CMS-driven variable-length lists. Two of those are context caps and three are
   refusals — see `references/anti-patterns.md`. Finding this out after emitting the grid is
   worse than asking now.

## Inputs

Doc §13's input table, with the detection and validation source for each.

| Input | Type | Default |
|---|---|---|
| `framework` | vanilla-css \| tailwind-v4 \| react-ts \| vue \| svelte \| swiftui \| compose | detected by core, confirmed |
| `basePalette` | page bg, tile bg, fg, muted fg, accent (hex) | the Apple-neutral set in §4 |
| `density` | `airy` (gap 24, row 220) \| `standard` (gap 16, row 180) \| `compact` (gap 12, row 150) | `standard` |
| `intensity` | 0–100 | 45 |
| `tileCount` | integer, or derive from content | derive |
| `darkMode` | media \| class \| none | media |
| `interactiveTiles` | boolean | false |
| `contentShape` | parallel \| comparable \| sequential \| long-form | parallel; the last two are refusals |
| `tileSource` | authored \| cms | authored |
| `scope` | glob list | the named section |

## Procedure

1. **Detect and confirm the stack.** `ui-morphism-core:detect-stack`. Branch every later step on
   its `styling` enum rather than re-reading `package.json`.

2. **Audit the existing markup.** Find the repeating card list or feature array. Count the
   items. Classify each one by content type — `stat`, `screenshot`, `chart`, `quote`,
   `paragraph`, `icon-text`, `cta`, `logos` — and record its body word count, its media aspect
   ratio, whether the image is a cover, and how many links it contains. That record is the
   planner's input; nothing later re-derives it.

3. **Plan the composition.** Write the classified items to a JSON file and run:

   ```
   node ${CLAUDE_SKILL_DIR}/scripts/assign-spans.mjs <input.json> --json
   ```

   The planner resolves intensity inline, because it needs the effective value to make span
   decisions in the same pass and a plan has to be computable offline. Its curves and its
   four context caps are declared in `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json`,
   which is the authority — `assign-spans.test.mjs` pins the planner against that file, and
   where the two disagree the planner is wrong. To produce the §5 Corrections line in core's
   shared wording, hand that same contract path to `ui-morphism-core:token-emit`, which
   resolves it with its own bundled `intensity.mjs`.

   The planner resolves intensity into the five knobs, applies the context caps, maps content type and
   weight onto the closed five-span vocabulary, places every tile in DOM order with a cursor
   that never moves backwards, computes the geometry, emits `grid-template-areas` for desktop,
   tablet and mobile, and runs the composition checks it can decide. Read `checks` before
   emitting anything: a `fail` is a refusal or a cap, not a warning. It computes no contrast —
   that is step 8.

4. **Confirm the plan with the user before writing files.** Show the span assignment with the
   rationale per tile, the dominant tile's share of the section, and any cap that fired. Span
   assignment is a content judgement wearing a layout costume; getting it wrong is expensive to
   unpick after the markup is rewritten.

5. **Emit the token layer** via `ui-morphism-core:token-emit`, from `assets/tokens.css` with
   the user's palette substituted, `assets/tokens.theme.css` for Tailwind v4, and
   `assets/tokens.um-aliases.css` as the `--um-bento-grid-*` grammar bridge when the project
   already speaks the shared grammar. Light
   values on bare `:root`; dark duplicated under both
   `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and
   `:root[data-theme="dark"]`; the `@media (pointer: coarse)` target bump last. Apply the
   `radius` and `surfaceDelta` knobs here — `references/tokens.md` §15 gives the bindings and
   the luminance-point arithmetic.

6. **Emit the grid.** `grid-template-areas` from the planner (deterministic) or explicit spans,
   with the tablet and mobile collapse maps. `grid-auto-rows: minmax(var(--bento-row), auto)`,
   never a bare length. **Never emit `grid-auto-flow: dense`** unless the grid is verified
   interaction-free, and then only inside `@supports (reading-flow: grid-rows)`.

7. **Normalise the frame and rewrite the tiles.** One radius, one gap, one border treatment, one
   shadow across every tile; nested media radius recomputed per tile as `outer − padding`. Then
   the interiors: exactly one `<h3>` per tile, any second CTA moved out, the
   eyebrow/title/body/stat type scale applied, `container-type: inline-size` plus the
   container-query interior reflow, `scroll-margin-top` on every tile, and chips sizing from
   `--bento-target-min`. The container becomes `<ul role="list">` inside
   `<section aria-labelledby>`, with DOM order equal to the intended reading order.

8. **Harden the media.** `width`/`height` or `aspect-ratio` on every image and video,
   `loading="lazy"`, `decoding="async"`, and `sizes="(max-width: 767px) 100vw, 50vw"` on every
   responsive image. A scrim behind any text over an image, never weaker than
   `rgba(0,0,0,0.55)`. At most one autoplaying video in the section, muted, `playsinline`,
   `preload="metadata"`, with a `poster`; every other video becomes its poster frame.

9. **Wire the accessibility layer** as `@layer bento`: the focus ring (3px, `outline-offset: 2px`,
   on the tile so `overflow: hidden` cannot clip it), the single full-tile link with its
   `::after` overlay, the `prefers-reduced-motion: reduce` block, and the `forced-colors: active`
   block that gives every tile a `CanvasText` border, drops shadows, hides the scrim and uses
   `Highlight` for focus. Under forced colors the tile background and shadow are stripped, so
   without that border the compartments dissolve and the composition disappears.

10. **Run `ui-morphism-core:a11y-validate`** for all nine universal checks. Every contrast number
    in this run is core's, including the scrim composite and the interactive border — never
    compute one here. Body text ≥ 4.5:1, large/UI ≥ 3:1, unrounded, so 2.999:1 fails. Watch
    `--bento-fg-muted` in particular: `#6e6e73` on `#f5f5f7` is 4.658:1 and a one-step palette
    change drops it under the floor. On failure, darken the token and recompute rather than
    shipping; record every correction.

11. **Count the budget.** Total section image bytes against ≤ 600KB (warn) and ≤ 1.2MB (fail);
    largest tile image against ≤ 200KB; autoplaying video against one per section at ≤ 2MB;
    `backdrop-filter` elements against ≤ 1. Downgrade assets rather than the layout, and record
    the downgrade.

12. **Write `bento-audit.md`** in the seven-section shape set out in "What goes in the report"
    below, with the 320px and 200%-zoom checks as manual TODOs.

## Outputs

- `tokens/bento.css`, and for Tailwind `tokens/bento.theme.css` (`@theme`, never nested inside
  an at-rule)
- `styles/bento.layer.css` as `@layer bento` — grid, tiles, spans, typography, media, container
  queries, responsive collapse, focus, forced-colors and reduced-motion
- `components/BentoGrid.*` and `components/BentoTile.*` in the detected framework, with the span
  union closed so the compiler rejects an invented size
- the rewritten section markup, DOM order equal to reading order
- `reports/bento-audit.md` — a per-tile table (assigned span, content type, computed
  text/background contrast, image weight, alt-text status, link count) plus a pass/fail line per
  §7 checklist item
- a one-column mobile preview snippet and the 320px screenshot instruction, so the collapse can
  be eyeballed

## Intensity knobs

Ranges and defaults are doc §13's intensity table verbatim. Default intensity is **45** — low
for the set, because span variance above about 2.0 stops reading as a grid.

| Knob | Min (intensity 0) | Max (intensity 100) | Default (intensity 45) | Note |
|---|---|---|---|---|
| `spanVariance` | 1.0 | 3.0 | 2.0 | Target largest:smallest tile-area ratio. 1.0 is a uniform card grid; 3.0 is a 2×2 hero beside 1×1 units. Quantised into four bands by the planner, which reports the ratio the composition actually measures. |
| `radius` | 0px | 32px | 24px | 0px is brutalist / Live Tile; 24px is the Apple default; 32px is clay-adjacent. One value for every tile. |
| `surfaceDelta` | 0 | 24 | 8 | Luminance points between page and tile background. 0 means tiles are defined by the gap alone; 24 is strongly separated cards. |
| `mediaBleed` | 0% | 100% | 40% | How far tile media runs past the padding box. 0% is fully inset with a concentric radius; 100% is full-bleed cover. |
| `motion` | 0 | 100 | 45 | 0 is no reveal and no hover lift; 50 is a 320ms reveal with a −2px lift; 100 is a 400ms reveal, −4px lift, 1.03 media scale and per-tile parallax. |

### The curve

Two linear segments per knob, anchored so intensity 45 lands exactly on the default:

```
knob(i) = i <= 45 ? MIN + (DEFAULT - MIN) * (i / 45)
                  : DEFAULT + (MAX - DEFAULT) * ((i - 45) / 55)
```

Every knob is monotone increasing across 0→100 and the planner's test sweep asserts it at every
integer step. "More intensity" always means "more of this style".

**Intensity 0 is a uniform card grid, not nothing.** One span for every tile, square corners,
tile background equal to the page background, media fully inset at a concentric radius, no
reveal and no hover lift — separation comes from the gap and the hairline border alone. It is
recognisable as plain, fully accessible, and the planner's `uniform-is-not-bento` check warns
that this is a card grid so the user hears it from the skill rather than discovering it.

**Intensity 100 still has to pass the floor.** If a knob at 100 pushes a pair below its
threshold — `surfaceDelta 24` moving the tile background far enough that `--bento-fg-muted`
drops under 4.5:1 is the realistic case — clamp the token, recompute through
`ui-morphism-core:a11y-validate`, and record the clamp in the audit. Never ship a failing
surface to satisfy a number.

### Hard clamps — independent of intensity, never negotiable

| Clamp | Value | Source |
|---|---|---|
| Distinct spans per grid | ≤ 5 | §4 span vocabulary, §13 self-run checklist |
| Dominant tiles per grid | exactly 1 (0 in the uniform and mild bands) | §3, §13 |
| Gutter | one value per section per breakpoint: 16px desktop, 12px below 768px, 24px editorial | §3, §4 |
| `grid-auto-rows` | `minmax(<row>, auto)`, never a bare length | §7 (SC 1.4.4), §13 |
| Interactive border alpha | ≥ 0.45 light, ≥ 0.35 dark | §7: the 3:1 crossings are 0.4199 and 0.3294 |
| Scrim over imagery | darkest stop ≥ `rgba(0,0,0,0.55)` | §7: 4.76:1 white-on-white worst case |
| Hit target inside a tile | ≥ 24px, ≥ 44px under `@media (pointer: coarse)` | §4, §7 (SC 2.5.8) |
| Reveal sequence | ≤ 400ms total, reveal + stagger × n | §4, §6 |
| Links per tile | 0 or 1 | §7 |
| Headings per tile | exactly 1, at `<h3>` under the section `<h2>` | §7 |
| Autoplaying video | ≤ 1 per section, ≤ 2MB, `poster` required | §8 |
| `backdrop-filter` elements in the section | ≤ 1 | §8, §12 |
| Section image bytes | warn > 600KB, fail > 1.2MB; largest tile image ≤ 200KB | §8 |
| Motion under `prefers-reduced-motion: reduce` | `motion → 0` | §13 knob table |

### Context caps — these override intensity

The planner applies all four and reports each one with its reason.

| Context | Cap | Why |
|---|---|---|
| `contentShape: comparable` | **0** | Comparison demands equal visual weight; a larger tile reads as "recommended" whether you meant it or not (§9) |
| Fewer than 4 tiles | **0** | Three things is a card row wearing a costume (§9) |
| `tileSource: cms` | **25** | A bento composition is hand-tuned; a source returning 4 items one day and 11 the next breaks it, so the layout is held near-uniform where a changing count degrades safely (§9) |
| More than 9 tiles | **45** | Size encodes importance only while the eye holds the whole composition; past nine it needs a hierarchy break before variance helps (§13) |

A cap always beats the requested intensity, and a capped run says so in the report's Summary
rather than quietly emitting something smaller than asked for.

## What goes in the report

Seven sections, in this order, in every ui-morphism audit from every style. Do not add, remove
or reorder them: the order is what lets a user diff two styles' audits of the same codebase.
Where a section does not apply, write "None." — an empty section is information, a missing
section is a hole. The sections are fixed; this style supplies the rows.

1. **Summary** — a two-column table: Style and plugin version; Intensity (effective, requested,
   and the context cap that fired); Scope; Framework / styling system with detection confidence
   and whether the user confirmed; Dark mode (media / class / none); Files changed (written /
   modified / refused); Verdict (**PASS** / **PASS WITH CORRECTIONS** / **FAIL**). Then one
   paragraph: what was restructured, and whether DOM order still equals reading order.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   `--bento-fg` and `--bento-fg-muted` on tile and raised tile, the accent on tile, the
   interactive border against the tile, and white over the scrim composited on **pure white**
   imagery. Three decimal places, unrounded.

3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text contrast
   (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors, reduced
   motion, reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2). The style
   table carries `../audit/references/checklist.md` plus the two tables this pattern adds:
   - **Per-tile table**: assigned span, content type, why that span, computed text/background
     contrast, image weight, alt-text status, link count. One row per tile. §13 asks for
     exactly this and it is the most useful artefact the run produces.
   - **Composition metrics**: tile count, distinct spans, dominant tile's share of the section
     area against §3's 30–40%, measured largest:smallest area ratio against the requested
     `spanVariance`, empty cell count, grid rows.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: total image bytes against
   600KB / 1.2MB, largest tile image against 200KB, autoplaying video count and bytes,
   `backdrop-filter` element count, CLS contribution against 0.02, and the promoted-layer
   estimate if the reveal is enabled.

5. **Corrections** — columns `Token | Before | After | Reason`, one row per token this skill
   changed on its own. A `surfaceDelta` other than 8 always appears here, with the
   luminance-point derivation. Then a bullet per context cap and clamp the planner reported,
   **including the ones that changed nothing**.

6. **Refusals** — columns `Requested | Refused because | Offered instead`, one row per
   `references/anti-patterns.md` entry that fired.

7. **Manual TODOs** — a checkbox list naming the *method*, not the concern. Always at least
   these three, because none is computable from source: the 320px-width collapse check, the
   200% text-zoom check, and a tab-through confirming focus moves left-to-right and
   top-to-bottom with no jumps.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`. The non-negotiable ones:

- [ ] Every text/background pair computed by `ui-morphism-core:a11y-validate`: ≥ 4.5:1 body,
      ≥ 3:1 for any border that signals interactivity, unrounded
- [ ] Exactly one dominant tile, and ≤ 5 distinct span values
- [ ] DOM order equals intended reading order; tab order moves left-to-right, top-to-bottom
- [ ] No `grid-auto-flow: dense` on any grid containing a focusable element without a
      `reading-flow` guard and a correct DOM order underneath
- [ ] Every tile has 0 or 1 links, and exactly one `<h3>`
- [ ] Every `<img>` and `<video>` has intrinsic dimensions or `aspect-ratio`, and every
      responsive image has `sizes`
- [ ] At most one autoplaying video, with a `poster`
- [ ] `prefers-reduced-motion: reduce` block present, neutralising transform, animation and
      video
- [ ] `forced-colors: active` block present, setting a `CanvasText` border on tiles and hiding
      the scrim
- [ ] `grid-auto-rows` uses `minmax(…, auto)`
- [ ] Single-column collapse below 768px and no horizontal overflow at 320px
- [ ] No `backdrop-filter` on more than one element in the section
- [ ] No transition or animation targets `width`, `height`, `gap`, `grid-template-*` or
      `border-radius`
- [ ] Focus ring visible and not clipped by `overflow: hidden`; 3px, `outline-offset: 2px`
- [ ] Every tile has `scroll-margin-top` ≥ sticky header height + 8px
- [ ] Total image bytes reported; warn above 600KB, fail above 1.2MB
- [ ] `intensity: 0` still produces a usable, accessible, uniform card grid

## Refuse to generate

Read `references/anti-patterns.md` in full — it carries the detection signal and the alternative
for each of the twelve. Core owns the refusal mechanism: refuse, explain, offer the alternative,
record it. The highest-frequency ones:

- `grid-auto-flow: dense` on a grid containing a link, button or form control, with no
  `reading-flow` guard — this is a conformance failure under SC 1.3.2, not a preference
- A card nested entirely inside a single `<a>`, or two links sharing a tile that has a full-tile
  `::after` overlay
- Text over a photograph with no scrim, or a scrim weaker than `rgba(0,0,0,0.55)`
- `backdrop-filter` on more than one element in the section — apply glass to the container, not
  to nine children
- More than one autoplaying video per section, or any autoplaying video without a `poster`
- `role="grid"` on a marketing bento section
- Transitions or keyframes on `width`, `height`, `gap`, `grid-template-*` or `border-radius`
- Uniform spans presented as a bento — say it is a card grid and offer the simpler layout
- More than nine tiles with no hierarchy break
- Fixed `grid-auto-rows` with `overflow: hidden` on tiles containing text
- Dropping a tile when its data is empty instead of emitting an empty state that keeps the span
- Multiple radii, gaps or border treatments inside one grid
- A bento for sequential, long-form or strictly comparable content — §9 says the pattern does not
  apply, and applying it anyway is a worse outcome than any styling error
