---
name: audit
description: >-
  Use to check a UI that ALREADY uses frosted glass, backdrop-blur or acrylic — translucency
  over a merely BLURRED backdrop, with no refraction and no perspective camera — against its
  invariants, when the user names it and wants a review, not a change. The invariants it owns:
  worst-case composited contrast at both the darkest and brightest ground pixel, which axe,
  Lighthouse and Figma miss by measuring the declared `background-color`; the ancestor
  backdrop-root scan (`opacity` below 1, `filter`, `mask`, `clip-path`) that silently kills
  it; the `@supports` wrapper and the `-webkit-` twin; stacked glass panes; the glass-surface
  and blurred-viewport budgets; and the four escape hatches plus print and the transparency
  toggle Safari makes mandatory. Writes a report; never edits — use glassmorphism-ui:apply to
  change anything. This is NOT a general design, taste, visual-craft or AI-slop audit, and not
  a general accessibility sweep: it will not answer "is my design good", "critique this UI",
  "find the AI tells" or "audit my site's accessibility". Dedicated design-quality,
  de-slopping, animation and a11y tools answer those better and should win them. A warping or
  lensing backdrop is liquid-glass-ui:audit; panels at translateZ under a camera are
  spatial-ui:audit. Not for skeuomorphism-ui:audit, neumorphism-ui:audit,
  claymorphism-ui:audit, minimalism-ui:audit, maximalism-ui:audit, brutalism-ui:audit,
  bento-grid-ui:audit.
argument-hint: "[scope glob] [--a11y-floor=AA|AA-strict|AAA] [--perf-target=desktop|mobile|low-end]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_SKILL_DIR}/../apply/scripts/glass-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/03-glassmorphism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Glassmorphism: audit

Review an existing glass implementation and produce a written report. **This skill does not
edit source files.** It reads, measures and reports. If the user wants the findings fixed,
hand off to `glassmorphism-ui:apply` with the report attached.

The audit exists because the standard tooling cannot do this job. axe, Lighthouse and
Figma's contrast plugins compute against the declared `background-color`, and
`backdrop-filter` means the declared background is not the effective one. A panel at
`rgba(255,255,255,0.12)` with white text measures **14.6:1** over `#0B0B12` and **1.57:1**
over `#7DD3FC`. A tool that reports one number for that surface is reporting the wrong
number. Every contrast row in this report carries two.

## Before you start

1. Run `ui-morphism-core:detect-stack` to locate the styling system and the component root.
   You need it to know which files hold the glass and which hold the ground.
2. Read `references/checklist.md`. It is the checklist you are running, in order.
3. Establish scope. Default is the whole styling layer plus the component root.
4. Confirm with the user what the **ground** is. Half of this style's failure modes are
   properties of the backdrop, not of the panel, and if the ground is user-supplied or
   third-party the answer to most questions is already "you cannot guarantee this".

## Procedure

1. **Inventory.** Find every glass surface: rules declaring `backdrop-filter`, components
   named for glass, and Tailwind `backdrop-blur-*` / `backdrop-saturate-*` utility usage in
   markup. Record the selector, elevation rung, fill alpha, blur radius, border alpha and
   whether it is `position: sticky` or `fixed`.

2. **Run the style scanner.**
   `node ${CLAUDE_SKILL_DIR}/../apply/scripts/glass-scan.mjs <paths> --json --no-fail`
   `--no-fail` because an audit reports rather than exits: the scanner returns 1 when it
   finds an error-severity item, and a non-zero exit here would read as the audit itself
   having failed rather than as the audit having found something.
   It reports the mechanical invariants: the `-webkit-` twin, the `@supports` wrapper,
   animated blur, `will-change` misuse, raster grain, live blur inside `forced-colors`, the
   scroll-pinned blur cap, the four escape hatches, the print sheet, the transparency toggle,
   and the ancestor backdrop-root hazards. Every finding goes in the report with its file and
   line, whether or not you agree with the severity — say so in a note instead of dropping it.

3. **Run `ui-morphism-core:a11y-validate`** for all nine universal checks. For every text
   token on glass, ask it for the composited ratio at the **darkest** and the **brightest**
   pixel of the ground. If the ground is a mesh gradient the project controls, those two
   pixels are computable. If it is a photograph, user upload or third-party embed, they are
   not — record that as an unmeasurable surface, which is itself the finding.

4. **Verify the backdrop-root hazards by hand.** The scanner reports candidates because
   static CSS cannot resolve a DOM tree. For each candidate, check whether the selector can
   actually match an ancestor of a glass surface. A `filter` on a `::after` grain layer is
   fine. An `opacity: 0.98` on a page wrapper is the reason the blur looks flat.

5. **Measure the budgets.** Simultaneously visible glass surfaces per route against ≤ 3
   mobile / ≤ 5 desktop. Estimated blurred viewport area against ≤ 30% / ≤ 50%. Maximum blur
   radius on any scroll-pinned surface against ≤ 20px. Stacked translucent depth against ≤ 3.
   Grain asset weight against 0 KB.

6. **Check the structural accessibility items** the scanner cannot see: `scroll-margin-top`
   on focusables under sticky glass bars (SC 2.4.11), modals using `<dialog>` or
   `aria-modal="true"` with a focus trap and an inert background, target sizes, and whether
   any state is carried by transparency, blur or shadow alone.

7. **Write the report** in the shape below. Name it `GLASS-AUDIT.md` unless the user asks
   otherwise.

## What the report contains

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information, a
missing section is a hole. The sections are fixed; this style supplies the rows.

1. **Summary** — a two-column table: Style and plugin version; Scope; Framework / styling
   system with detection confidence; Tone and dark-mode strategy; whether the ground is
   project-controlled; Findings by severity; Verdict (**PASS** / **PASS WITH FINDINGS** /
   **FAIL**). Then one paragraph naming the single most important finding.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   One row per text token per extreme: **two ratios each**, composited over the darkest
   ground pixel and over the brightest, three decimal places, unrounded. Auto-correction
   reads "none — audit only". Where the ground is uncontrolled, the row says "unmeasurable"
   and explains why rather than guessing.

3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text contrast
   (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors, reduced
   motion, reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2). The style
   table is `references/checklist.md` row for row, plus two matrices this style adds:
   - **Fallback coverage**: per surface, the `@supports` fallback, the `-webkit-` twin, and
     each of `prefers-reduced-transparency`, `prefers-contrast`, `forced-colors`,
     `prefers-reduced-motion`, `@media print` and the `[data-transparency]` hook.
   - **Backdrop-root hazards**: selector, property, file, line, and your verdict on whether
     it can be an ancestor.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: the five numbers from step 5,
   each against its limit.

5. **Corrections** — empty by construction; this skill changes nothing. Write "None." and put
   what the user should change here as a `Finding | File and selector | Fix` table, ordered
   by severity.

6. **Refusals** — "None." An audit refuses nothing.

7. **Manual TODOs** — a checkbox list naming the *method*, not the concern. For this style,
   always at least these two, because neither is computable from CSS text: screenshot the
   composited pixels at three scroll positions and sample them, and verify the focus ring
   against both the lightest and darkest possible backdrop.

## Severity, so the report is actionable rather than a list

- **Fail** — a contrast pair below the floor, a translucent fill with no opaque fallback, a
  `backdrop-filter` with no `-webkit-` twin, live blur inside `forced-colors: active`, a
  missing focus indicator, or a target below 24×24.
- **Risk** — inside the letter of the rules but a bet on the ground: body text on a fill below
  0.30 with no scrim, an uncontrolled backdrop, blur over the budget, more than three stacked
  panes, glass on a content or form surface.
- **Note** — style-fidelity findings that are not compliance findings: blur without
  `saturate()`, a uniform blur radius that flattens the elevation hierarchy, grain outside the
  0.02–0.05 band, radii below 8px making the hairline read as a stroke.

Do not upgrade a Note to a Fail to make the report look decisive, and do not soften a Fail
because the design is otherwise good. The severity is the useful part.
