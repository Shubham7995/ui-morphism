---
name: audit
description: >-
  Use to check a UI that is ALREADY maximalist — loud layers STACKED over a patterned ground,
  not one bordered plane — against this style's own invariants, when the user names it or its
  moves (collage stickers, marquees, oversized display type) and wants a review rather than a
  change. The invariants it owns: the three-loud-layer budget per viewport; role-bound
  accents, since half the palette is decoration-only on any ground and which half flips with
  the theme; hit area re-measured on the transformed box after rotation, not the drawn one;
  focus never obscured by floating ornament; a pause control or Calm mode on every infinite
  marquee, which is Level A; and text never on a pattern without an opaque plane behind it.
  Writes a report; never edits — use maximalism-ui:apply to change anything. This is NOT a
  general design, taste, visual-craft or AI-slop audit, and not a general accessibility sweep:
  it will not answer "is my design good", "critique this UI", "find the AI tells" or "audit my
  site's accessibility". Dedicated design-quality, de-slopping, animation and a11y tools
  answer those better and should win them. One saturated bordered plane with no layer stack is
  brutalism-ui:audit. Not for skeuomorphism-ui:audit, neumorphism-ui:audit,
  glassmorphism-ui:audit, claymorphism-ui:audit, minimalism-ui:audit, liquid-glass-ui:audit,
  bento-grid-ui:audit, spatial-ui:audit.
argument-hint: "[scope glob] [--theme=light|dark|both] [--surface-type=brand|campaign|editorial|app-accent] [--format=markdown|json]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/skills/apply/scripts/max-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/06-maximalism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Maximalism: audit

Review an existing maximalist implementation and report. **This skill does not write to
source.** Its grant is read-only on purpose: `Read`, `Glob`, `Grep`, and the bundled scanner,
which reads and prints and changes nothing. If the review finds something worth fixing, name
the file, the selector and the fix, and hand the user to `maximalism-ui:apply`.

This style's risk profile is the inverse of its neighbours' and it decides where to look.
Doc §7 opens by calling maximalism the highest-risk style in the set: it is not inherently
inaccessible, it fails **by default**, and every safeguard is something someone had to add
on purpose. So the absent thing is the finding. A patterned ground with no opaque plane under
the text, a marquee with no pause control, a sticker button whose 44px was measured before
the rotate, a dark block that redeclared the ground colours and left the accents on their
light-mode values — none of these appear as a wrong declaration. They appear as a missing
one, and a grep for what is present will not find them.

Two consequences worth stating before the first check. **A light-mode-only audit of this
style is not an audit.** The role bindings rebind under dark, `--max-paper` and `--max-ink`
swap, and the accents that carry text on the dark ground are exactly the ones that fail on
the cream surface. **And the loud-layer count is a property of the rendered viewport, not of
a file.** Count per scene, name each layer counted, and where scenes compose at runtime say
so rather than reporting a number the composition can exceed.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system and
   dark-mode strategy. The audit needs to know where the theme override lives before it can
   tell whether the accent ramps were rebound or merely re-listed.
2. Read `references/checklist.md` in full. Every row is marked **core** or **style**; the
   core rows are run by `ui-morphism-core:a11y-validate` and the style rows are run here.
3. Read `../apply/references/tokens.md` for the baseline values and the known-bad pairs this
   style produces, and `../apply/references/anti-patterns.md` for what a finding should
   recommend instead.
4. Establish scope and `surfaceType`. Default scope is the whole styling surface: token
   files, component stylesheets, any Tailwind `@theme` block, and the markup that carries the
   decorative layers. `surfaceType: app-accent` changes several rows from warning to failure
   — marquees and patterned grounds are forbidden on data surfaces, not merely discouraged.

## Procedure

1. **Inventory.** Grep the scope for the style's fingerprints: `--max-*` and
   `--um-maximalism-*` custom properties, zero-blur `box-shadow` values with two or three
   colour stops, `mix-blend-mode`, `repeating-linear-gradient` / `repeating-conic-gradient` /
   halftone `radial-gradient` grounds, `feTurbulence`, `rotate` and `transform: rotate` on
   cards and badges, `animation` with `infinite`, `clamp(` in a font-size, and any
   `data-calm` hook. Record the token source and whether the project owns the ground it is
   layering over.

2. **Run the universal checks.** `ui-morphism-core:a11y-validate` over the scope, in both
   themes. It owns all nine of them, including every contrast computation. This skill
   computes no ratios of its own — one implementation, ten callers.

3. **Run the scanner:**
   `node ${CLAUDE_PLUGIN_ROOT}/skills/apply/scripts/max-scan.mjs <scope> --json`
   It carries the mechanical half of `references/checklist.md`: the loud-layer census, raster
   texture assets, animated properties outside the permitted list, infinite animation without
   a Calm hook, the four safety blocks, blend modes outside an `isolation: isolate` container,
   rotation past 5deg, non-zero shadow blur, absolute ornament surviving below 640px,
   decorative layers that are not `pointer-events: none`, `order` and `row-reverse`, and the
   font-family census. Its findings are inputs to the report, not the report.

4. **Run the style checks** in `references/checklist.md` that the scanner cannot decide.
   Four deserve a deliberate pass rather than a grep:

   - **The dark-mode role bindings.** Find the dark block and check that
     `--max-text-on-ink` binds to a deep accent rather than a lifted one. A dark block that
     redeclares the grounds and the lifted ramp but leaves the role bindings pointing at the
     lifted violet ships text on cream at 2.46:1, and it looks completely correct in light
     mode.
   - **Text over pattern.** Trace every text-bearing element to the plane it sits on. If the
     nearest ancestor with an opaque background is the scene rather than a surface, the text
     is on the pattern and the average contrast figure is meaningless.
   - **Target size after transform.** A `min-height: 44px` on a rotated element is a claim
     about the drawn box, not the hit box. Flag every rotated interactive element and put the
     measurement in Manual TODOs; static analysis can find them and cannot measure them.
   - **Tab order in anti-grid compositions.** `grid-area` overlaps, negative margins and
     absolutely positioned collage are exactly where DOM order and visual order come apart.
     Emit the list of composed regions with the elements to tab through.

5. **Measure the budgets** in `references/checklist.md` §F against the actual emitted bytes
   and the actual layer count, not an estimate. If a number cannot be measured without a
   build or a screenshot, say so rather than reporting a guess.

6. **Write the report** in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information, a
missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table: Style and plugin version; Scope and `surfaceType`;
   Framework / styling system with detection confidence; Dark mode (media / class / both);
   Loud-layer count per scene against the cap of three; Findings by severity; Verdict
   (**PASS** / **PASS WITH FINDINGS** / **FAIL**). Then one paragraph naming the single most
   important finding.
2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, three decimal places, unrounded. The
   Auto-correction column reads "none — audit only". One row per pair **per theme**; the
   dark-mode binding of `--max-text-on-ink` against the cream surface is always one of them.
3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text contrast
   (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors, reduced
   motion, reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2). The style
   table is `references/checklist.md`, row for row, plus the per-scene loud-layer census that
   names every layer it counted.
4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: font bytes, font-family
   count, grain and pattern asset bytes, collage and hero image bytes, composited-layer
   estimate, blend-mode count, added JS, INP.
5. **Corrections** — empty by construction; this skill changes nothing. Write "None." and put
   the recommended fixes here as a `Finding | File and selector | Fix` table, ordered by
   severity, each pointing at the anti-pattern it matches.
6. **Refusals** — "None." An audit refuses nothing.
7. **Manual TODOs** — a checkbox list naming the *method*, not the concern: measure the
   axis-aligned bounding box of every rotated control after transform, sample the lightest
   and darkest pixel of every patterned ground under its text, tab through every anti-grid
   region, run the page in Edge's forced-colors emulation, measure real font subset bytes,
   and watch one full marquee cycle with Calm mode on and off.

## Output

- `reports/MAXIMALISM-AUDIT.md` — or stdout if the user asked for a review rather than a
  file. Nothing else is written.

Every finding carries: the file, the exact selector, the computed value where there is one
(three decimal places, unrounded), the criterion it fails, and the fix. A finding without a
selector is not a finding, it is a feeling.

## Verdict rules

- Any failing row in checklist section A, B1, B2, C1, C2 or D1 is a **fail**, not a warning.
  These are contrast, the opaque plane under text, the layer budget, focus and target size —
  the five things this style gets wrong in a way that stops people using the interface.
- An infinite animation with no pause control and no Calm toggle is a **fail** on its own.
  SC 2.2.2 is Level A, and it is the criterion this style breaks most reliably.
- A budget overrun is a **warning** unless a raster noise or pattern asset exists, or the
  font payload is over 180 KB, which are **fails**: doc §8 puts raster texture at 0 bytes
  because CSS and an inline SVG filter do the same work.
- Anything that could not be verified statically goes in Manual TODOs. Do not report an
  unverified check as a pass. Composited contrast over a pattern, computed target size after
  a transform, real Windows High Contrast behaviour, actual font subset bytes and the
  rendered loud-layer count all belong there unless a browser was actually used.
