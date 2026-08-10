---
name: audit
description: >-
  Use to check a UI that is ALREADY neubrutalist against this style's own invariants, when
  the user names the style or its concrete moves — hard ink borders, zero-blur offset
  shadows, flat saturated fills — and wants a review rather than a change. The invariants
  it owns: the dark-mode border flip (a black border on a dark surface measures ~1.56:1
  and fails 1.4.11), every shadowed element also carrying a real border because
  forced-colors nulls `box-shadow`, no non-zero shadow blur or `backdrop-filter` anywhere,
  a focus outline distinguishable from the resting offset shadow, tilt never wrapping a
  focusable descendant, and the zero-JS / 8KB emitted-CSS budget. Also for re-checking
  output from brutalism-ui:apply. Writes a report; never edits — use brutalism-ui:apply to
  change the interface. This is NOT a general design, taste, visual-craft or AI-slop
  audit, and it is not a general accessibility sweep: it will not answer "is my design
  good", "critique this UI", "find the AI tells", "review my animations" or "audit my
  site's accessibility". Dedicated design-quality, de-slopping, animation and a11y tools
  answer those better and should win them. Do not use on translucent or backdrop-blurred
  surfaces (glassmorphism-ui:audit, liquid-glass-ui:audit), same-hue soft extrusion
  (neumorphism-ui:audit), puffy pastel clay (claymorphism-ui:audit) or tile-span grid
  layout (bento-grid-ui:audit).
argument-hint: "[scope glob] [--theme=light|dark|both] [--format=markdown|json]"
allowed-tools: Read Glob Grep
license: MIT
metadata:
  sourceDoc: docs/07-brutalism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Brutalism: audit

Review an existing neubrutalist implementation and report. **This skill does not write
to source.** Its `allowed-tools` grant is read-only on purpose: `Read`, `Glob`, `Grep`
and nothing else. If the review finds something worth fixing, name the file, the
selector and the fix, and hand the user to `brutalism-ui:apply`.

Neubrutalism's risk profile is unusual and worth stating before the first check, because
it determines where to look. Its *default palette* is often better than average —
`#0A0A0A` ink on `#FFDC58` is 14.74:1, AAA without trying. Its *default structure* is often
worse than average. What breaks is focus, targets, forced-colors, motion and DOM order,
not colour. Do not conclude the interface is fine because the contrast table is green.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system and
   dark-mode strategy. The audit needs to know where the theme override lives before it
   can tell whether the dark border was flipped.
2. Read `references/checklist.md` in full. Every row is marked **core** or **style**;
   the core rows are run by `ui-morphism-core:a11y-validate` and the style rows are run
   here.
3. Read `../apply/references/tokens.md` for the baseline values and the known-bad pairs
   this style produces, and `../apply/references/anti-patterns.md` for what a finding
   should recommend instead.
4. Establish scope. Default is the whole styling surface: token files, component
   stylesheets, and any Tailwind `@theme` or config block.

## Procedure

1. **Inventory.** Grep the scope for the style's fingerprints: `box-shadow` values with
   a zero blur, `border-radius: 0`, `translate` on `:hover`, `@theme` blocks,
   `--nb-*` / `--um-brutalism-*` / `--box-shadow-x` / `--border` custom properties, and
   any `oklch(0% 0 0)` in a dark selector. Record the token source and which dialect it
   follows — `neobrutalism.com` (`--radius: 0`, six-step ladder) or `ekmas`
   (`--border-radius: 5px`, single 4px offset).

2. **Run the universal checks.** `ui-morphism-core:a11y-validate` over the scope. It
   owns all nine of them, including every contrast computation. This skill computes no
   ratios of its own — one implementation, ten callers.

3. **Run the style checks** in `references/checklist.md`, sections A4-A8, A10, B, C3-C5,
   D2, D4-D7, E2, E4-E7, F. Two deserve a deliberate pass rather than a grep:

   - **The dark-border flip.** Find the dark theme's border token and check it in the
     dark theme specifically. A stylesheet that passes 1.4.11 in light and never
     redeclares the border is the single most common failure in this ecosystem, and a
     light-mode-only audit will not see it.
   - **Tab order in rotated or absolutely-positioned compositions.** Static analysis can
     flag the risk; it cannot confirm the order. Emit the list of composed regions as a
     Manual TODO with the elements to tab through.

4. **Measure the budgets** in `references/checklist.md` §F against the actual emitted
   bytes, not an estimate. If the numbers cannot be measured without a build, say so
   rather than reporting a guess.

5. **Write the report** using the shared template from `ui-morphism-core`
   (`assets/report-template.md`), in its section order: Summary, Contrast table,
   Checklist, Budgets, Corrections, Refusals, Manual TODOs. This skill makes no
   corrections and no refusals, so those two sections carry the finding list and the
   recommended fixes instead, each pointing at the anti-pattern it matches.

## Output

- `reports/brutalism-audit.md` — or stdout if the user asked for a review rather than a
  file. Nothing else is written.

Every finding carries: the file, the exact selector, the computed value where there is
one (three decimal places, unrounded), the criterion it fails, and the fix. A finding
without a selector is not a finding, it is a feeling.

## Verdict rules

- Any failing row in checklist section A, B1, B2, C1 or C2 is a **fail**, not a warning.
  These are contrast, boundary, blur and focus — the four things this style gets wrong
  in a way that stops people using the interface.
- A budget overrun is a **warning** unless added JS is non-zero or raster assets exist,
  which are **fails**: doc §8 puts both at exactly 0 because the style is drawable in
  CSS.
- Anything that could not be verified statically goes in Manual TODOs. Do not report an
  unverified check as a pass. Rendered composited contrast, computed target size after a
  transform, real Windows High Contrast behaviour and actual font subset sizes all
  belong there unless a headless browser was actually used.
