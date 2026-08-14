---
name: audit
description: >-
  Use to check a UI that is ALREADY neumorphic — soft extrusion in the SAME colour as the page
  ground — against this style's own invariants, when the user names the style or its moves
  (mirrored dual shadows, pressed-in inputs) and wants a review rather than a change. The
  invariants it owns: the shadow-only affordance, where a same-hue pair measures 1.2:1 to
  1.7:1 and can never be a control's boundary; the forced-colors path, where box-shadow is
  deleted and 100% of the structure goes with it unless a real border is put back; box-shadow
  used as a focus ring; blur = 2 x distance with spread 0; one light source per document; a
  reduced-motion block that removes a state change rather than a duration; the 40 / 24 / 16px
  blur ceilings and the 24-element census. Writes a report; never edits — use
  neumorphism-ui:apply to change anything. This is NOT a general design, taste, visual-craft
  or AI-slop audit, and not a general accessibility sweep: it will not answer "is my design
  good", "critique this UI", "find the AI tells" or "audit my site's accessibility". Dedicated
  design-quality, de-slopping, animation and a11y tools answer those better and should win
  them. A surface with its OWN pastel fill is claymorphism-ui:audit; one imitating a material
  is skeuomorphism-ui:audit. Not for glassmorphism-ui:audit, minimalism-ui:audit,
  maximalism-ui:audit, brutalism-ui:audit, liquid-glass-ui:audit, bento-grid-ui:audit,
  spatial-ui:audit.
argument-hint: "[scope glob] [--theme=light|dark|both] [--format=markdown|json]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_SKILL_DIR}/../apply/scripts/neu-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/02-neumorphism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Neumorphism: audit

Review an existing neumorphic implementation and report. **This skill does not write to
source.** Its `allowed-tools` grant is read-only on purpose: `Read`, `Glob`, `Grep`, and
the bundled scanner, which reads and reports and changes nothing. If the review finds
something worth fixing, name the file, the selector and the fix, and hand the user to
`neumorphism-ui:apply`.

State the risk profile before the first check, because it decides where to look. This is
the highest-a11y-risk style in the set and the failure is **structural, not a matter of
execution**: the element and its background are the same colour by construction, so the
pair that describes its geometry measures **1.23:1** and **1.59:1** against the light
surface and **1.37:1** and **1.30:1** against the dark one, against the **3:1** SC 1.4.11
requires. No implementation can pass that check with a shadow. So the question this audit
asks is never "is the extrusion good enough" — it is **"what carries the boundary, and
what happens when `box-shadow` is deleted"**. A codebase whose shadows are beautiful and
whose controls have no border fails, and it fails at every intensity.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system and
   dark-mode strategy. The audit needs to know where the theme override lives before it
   can tell whether the dark palette was declared in both required places.
2. Read `references/checklist.md` in full. Every row is marked **core** or **style**; the
   core rows are run by `ui-morphism-core:a11y-validate`, and the mechanical half of the
   style rows is run by `../apply/scripts/neu-scan.mjs`.
3. Read `../apply/references/tokens.md` for the baseline values and the known-bad pairs
   this style produces, and `../apply/references/anti-patterns.md` for what a finding
   should recommend instead — §0 first, because it is the finding most of the others
   reduce to.
4. Establish scope. Default is the whole styling surface: token files, component
   stylesheets, and any Tailwind `@theme` or config block.

## Procedure

1. **Inventory.** Grep the scope for the style's fingerprints: `box-shadow` values with
   two mirrored offsets, `inset` pairs, `--nm-*` / `--um-neumorphism-*` custom
   properties, `linear-gradient(145deg` surfaces, radii at or above 14px on controls, and
   any element whose `background` equals the page ground. Record which dialect it follows
   — the neumorphism.io defaults (`#e0e0e0`, distance 20, blur 60, `colorDifference`
   0.15) or a hand-rolled token layer — and whether a hairline exists anywhere at all.

2. **Run the universal checks.** `ui-morphism-core:a11y-validate` over the scope. It owns
   all nine of them, including every contrast computation. This skill computes no ratios
   of its own — one implementation, ten callers.

3. **Run the scanner:**
   `node ${CLAUDE_SKILL_DIR}/../apply/scripts/neu-scan.mjs <scope> --json --no-fail`
   `--no-fail` because an audit reports rather than gates. It covers the shadow-only
   affordance, the geometry relations, the blur and layer ceilings, the shadow axis, the
   focus mechanism and its 3px / 3px floor, the forced-colors and reduced-motion blocks
   and what they may remove, the same-hue invariant, the pressed rung, targets, fixed
   heights, the sibling gap, `will-change` misuse, the surface census and the dark pair.

4. **Run the style checks** in `references/checklist.md` that the scanner cannot reach —
   A4, A8, A10, B1 where the parent is computed rather than declared, B7's clipping
   ancestor, C6, D4, D6, E5, E7, F6 through F11, and G2 through G5. Three deserve a
   deliberate pass rather than a grep:

   - **The boundary question, per component.** For every interactive element, name what
     draws its edge at rest. If the answer is the shadow, it is a fail, not a warning,
     and it is the report's headline finding. Doc §7 sets the threshold exactly: on
     `#e6e7ee` a boundary has to sit at or below `#848484` (**3.03:1**) to clear 3:1, and
     `#858585` is the first grey that fails at **2.99:1**.
   - **Forced colors, end to end.** Read the `forced-colors: active` block against the
     list of classes that carry a shadow, not against itself. A block that exists but
     covers six of nine shadow-bounded classes leaves three controls invisible in Windows
     High Contrast Mode, and a light-mode-only reading will not see it.
   - **The dark-mode delta.** Doc §13 validation item 10 asserts the dark delta is at
     least 2× the light one, against the **multiplicative** derivation — doc §5 ships
     `scale = 3.0` dark against `1.0` light — not against the additive `--nm-delta` knob.
     Conflating the two is how a dark theme ends up with an invisible extrusion.

5. **Measure the budgets** in `references/checklist.md` §F against the actual emitted
   bytes and the actual rendered route, not an estimate. The element census the scanner
   prints is a count of declarations, which is a proxy for a viewport count and not a
   measurement of one — say which you used. If a number cannot be measured without a
   build or a browser, put it in Manual TODOs rather than reporting a guess.

6. **Write the report** in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table: Style and plugin version; Scope; Framework / styling
   system with detection confidence; Dark mode (media / class / both); Findings by
   severity; Verdict (**PASS** / **PASS WITH FINDINGS** / **FAIL**). Then one paragraph
   naming the single most important finding — for this style, almost always what carries
   the boundary and what survives forced-colors.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, three decimal places, unrounded. The
   Auto-correction column reads "none — audit only". **Both shadow colours against their
   own surface are always rows, labelled "decorative, not an affordance"**, alongside the
   hairline, both ink tokens, the accent, accent ink on accent fill and the focus outline.
   A Contrast table for this style that omits the shadows is the one that lets a reader
   believe the extrusion complies.

3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text
   contrast (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors,
   reduced motion, reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2).
   The style table is `references/checklist.md`, row for row, sections A through G.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: neumorphic elements in the
   initial viewport, shadow layers per element, maximum blur radius, blur inside a
   scroller, blur on list or grid items, elements animating a shadow simultaneously, paint
   time per frame, added asset weight, and emitted CSS bytes.

5. **Corrections** — empty by construction; this skill changes nothing. Write "None." and
   put the recommended fixes here as a `Finding | File and selector | Fix` table, ordered
   by severity, each pointing at the anti-pattern in `../apply/references/anti-patterns.md`
   it matches.

6. **Refusals** — "None." An audit refuses nothing. If the reviewed code contains a
   pattern the apply skill would refuse to generate, that is a finding in section 5, not a
   refusal here.

7. **Manual TODOs** — a checkbox list naming the *method*, not the concern: a low-vision
   or cataract simulator pass with the shadows discounted, a greyscale plus
   contrast-reduced screenshot with every control still findable, real Windows High
   Contrast behaviour, measured paint cost on a 4× CPU-throttled profile, computed target
   size after any transform, rendering at 200% and 400% zoom, and a tab-through confirming
   order matches the perceived depth hierarchy.

## Output

- `reports/neumorphism-audit.md` — or stdout if the user asked for a review rather than a
  file. Nothing else is written.

Every finding carries: the file, the exact selector, the computed value where there is one
(three decimal places, unrounded), the criterion it fails, and the fix. A finding without
a selector is not a finding, it is a feeling.

## Verdict rules

- Any failing row in checklist section A1–A3, A5–A7, B1–B3, C1–C3 or E1–E2 is a **fail**,
  not a warning. These are the boundary, the ink, the same-hue invariant, the geometry,
  the focus mechanism and the forced-colors restoration — the six things that decide
  whether the interface is operable at all.
- A shadow-only affordance is a fail on its own, regardless of how the rest of the audit
  reads, and it goes in the Summary paragraph. Doc §7: the shadow cannot be the
  affordance; a border, an accent fill or a text label must be.
- A budget overrun is a **warning** unless added asset weight is non-zero, which is a
  **fail**: doc §8 puts it at exactly 0 bytes because the style is pure CSS.
- Anything that could not be verified statically goes in Manual TODOs. Do not report an
  unverified check as a pass. Rendered composited contrast, computed target size after a
  transform, real Windows High Contrast behaviour, paint cost and the low-vision
  simulation all belong there unless a browser was actually used.
