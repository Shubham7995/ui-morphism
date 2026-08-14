---
name: audit
description: >-
  Use to check a UI that is ALREADY minimalist — monochrome plus one accent, hairline borders,
  near-zero elevation, ornament SUBTRACTED rather than added — against this style's own
  invariants, when the user names it and wants a review rather than a change. The invariants
  it owns: the two borders, where a 1.2:1 hairline is legal between rows and fails 1.4.11 as a
  control's only boundary; body greys lighter than #737373 (4.74:1 on white); ghost primaries;
  icon-only targets under the 24px floor; focus obscured by sticky headers; colour-only state;
  deleted labels and error messages; and the zero-JS, 40 KB CSS budget. Writes a report; never
  edits — use minimalism-ui:apply to change anything. This is NOT a general design, taste,
  visual-craft or AI-slop audit, and not a general accessibility sweep: it will not answer "is
  my design good", "critique this UI", "find the AI tells" or "audit my site's accessibility".
  Dedicated design-quality, de-slopping, animation and a11y tools answer those better and
  should win them. A flat UI that ADDS weight — 2-5px ink borders, hard offset shadows,
  saturated fills — is brutalism-ui:audit. Not for skeuomorphism-ui:audit,
  neumorphism-ui:audit, glassmorphism-ui:audit, claymorphism-ui:audit, maximalism-ui:audit,
  liquid-glass-ui:audit, bento-grid-ui:audit, spatial-ui:audit.
argument-hint: "[scope glob] [--theme=light|dark|both] [--a11y-target=AA|AA+focus-AAA|AAA] [--format=markdown|json]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_SKILL_DIR}/../apply/scripts/quantize-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/05-minimalism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Minimalism: audit

Review an existing minimalist implementation and report. **This skill does not write to
source.** Its `allowed-tools` grant is read-only on purpose: `Read`, `Glob`, `Grep`, and
the bundled scanner in `--no-fail` mode, which reads and reports and changes nothing. If
the review finds something worth fixing, name the file, the selector and the fix, and hand
the user to `minimalism-ui:apply`.

Minimalism's risk profile is the inverse of every other style in this set, and it
determines where to look. **What breaks here is what is missing, not what is present.** A
minimal interface fails by omission: a control with no visible boundary, a link with no
underline, a field with no label, a focused element with no ring, a 16px close glyph, a
group implied by whitespace that no screen reader can perceive. Grepping for bad
declarations finds very little; the audit has to ask what a control needs and check
whether it is there.

The two figures that anchor most findings, both from doc §7. Body text: `#737373` is
**4.74:1** on white and is the lightest legal grey — `#999999` is 2.85:1 and fails
everything. Boundaries: the 1.4.11 threshold on white is `#949494` at **3.03:1**, so the
ubiquitous `#E5E5E5` hairline at **1.26:1** is fine between two rows and is a failure the
moment it is the edge of an input or a secondary button.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system and
   dark-mode strategy. The audit needs to know where the theme override lives before it
   can check the dark theme's boundary token at all.
2. Read `references/checklist.md` in full. Every row is marked **core** or **style**; the
   core rows are run by `ui-morphism-core:a11y-validate` and the style rows are run here.
3. Read `../apply/references/tokens.md` for the baseline values and the known-bad greys
   this style produces, and `../apply/references/anti-patterns.md` for what a finding
   should recommend instead.
4. Establish scope. Default is the whole styling surface: token files, component
   stylesheets, and any Tailwind `@theme` or config block. Include the markup where
   labels, `aria-label` and semantic containers live — half this checklist is not
   answerable from CSS.

## Procedure

1. **Inventory.** Grep the scope for the style's fingerprints: `--min-*` /
   `--um-minimalism-*` custom properties, hairline `1px solid` borders at low alpha,
   `box-shadow` values under 8px blur, `border-radius` at 4 / 8 / 12px, `65ch` or a `px`
   prose measure, `tabular-nums`, `@theme` blocks with `--color-*: initial`, and any
   `#E5E5E5`-class hairline on a control. Record the token source and whether the
   implementation is token-driven at all or a hand-rolled set of literals.

2. **Run the scanner:**
   `node ${CLAUDE_SKILL_DIR}/../apply/scripts/quantize-scan.mjs <paths> --json --no-fail`
   It returns the `quantise` / `subtract` / `restore` findings and the palette census —
   colour literals, neutral literals, hue families, shadow declarations, and the ramp
   collapse counts. `--no-fail` keeps it advisory: this skill reports, it does not gate.
   The scanner computes no contrast, no luminance and no alpha compositing.

3. **Run the universal checks.** `ui-morphism-core:a11y-validate` over the scope. It owns
   all nine of them, including every contrast computation. This skill computes no ratios
   of its own — one implementation, ten callers.

4. **Run the style checks** in `references/checklist.md`, sections A4–A8, A10–A11, B, C3–C5,
   D2, D4–D9, E2, E4–E8, F. Four deserve a deliberate pass rather than a grep:

   - **Which border carries which job.** Find every control — input, secondary button,
     unchecked checkbox, toggle track, slider rail — and check the boundary it actually
     uses, in **both** themes. A stylesheet where every element shares one hairline token
     passes a light-mode eyeball and fails 1.4.11 on half its controls.
   - **What is missing.** For each form field, is there a visible `<label>` or only a
     placeholder? For each icon-only control, is there an `aria-label` and an
     `aria-hidden` glyph? For each visually implied group, is there a real semantic
     container with a name? Absence does not appear in a grep for bad values.
   - **Focus under sticky chrome.** Static analysis can find the `position: sticky` bar and
     the missing `scroll-margin-block`; it cannot confirm the behaviour. Emit the list of
     sticky regions as a Manual TODO with the elements to tab through at a short viewport.
   - **Colour-only encoding.** Selected tabs, selected rows, error fields, status badges
     and category chips in a one-accent palette. Check for the second channel — underline,
     icon, weight, inline-start bar, text label — rather than for the colour.

5. **Measure the budgets** in `references/checklist.md` §F against the actual emitted
   bytes, not an estimate. If the numbers cannot be measured without a build, say so
   rather than reporting a guess. Font bytes are the one to insist on: in a style where
   typography carries the whole hierarchy, a late-swapping webfont is the largest CLS risk
   on the page.

6. **Write the report** in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table: Style and plugin version; Scope; Framework / styling
   system with detection confidence; Dark mode (media / class / both); Findings by
   severity; Verdict (**PASS** / **PASS WITH FINDINGS** / **FAIL**). Then one paragraph
   naming the single most important finding.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, three decimal places, unrounded. The
   Auto-correction column reads "none — audit only". Every control boundary against its
   adjacent surface is a row, in both themes, and so is every grey used for body copy.

3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text
   contrast (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors,
   reduced motion, reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2).
   The style table is `references/checklist.md`, row for row.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: critical CSS bytes, total
   CSS bytes, added JS, font files and bytes, icon sprite bytes, above-the-fold image
   bytes, accent coverage, shadow rungs used, neutral steps, chromatic hues.

5. **Corrections** — empty by construction; this skill changes nothing. Write "None." and
   put the recommended fixes here as a `Finding | File and selector | Fix` table, ordered
   by severity, each pointing at the anti-pattern it matches. Findings that are *missing
   affordance* — no boundary, no underline, no label, no ring, no target — get their own
   sub-table under the heading "Missing affordance", because in this style they are the
   majority and burying them among value corrections misreports the run.

6. **Refusals** — "None." An audit refuses nothing.

7. **Manual TODOs** — a checkbox list naming the *method*, not the concern: tab through
   every sticky-header region at a short viewport, tab through every reordered grid or
   flex region, apply the SC 1.4.12 text-spacing overrides in a browser, test in Windows
   High Contrast, measure real font subset sizes, and view the finished UI in greyscale.

## Output

- `reports/minimalism-audit.md` — or stdout if the user asked for a review rather than a
  file. Nothing else is written.

Every finding carries: the file, the exact selector, the computed value where there is one
(three decimal places, unrounded), the criterion it fails, and the fix. A finding without
a selector is not a finding, it is a feeling. For a missing-affordance finding the
"selector" is the element that should have had the thing and does not — name it precisely,
because "some buttons lack focus rings" is unactionable.

## Verdict rules

- Any failing row in checklist section A1–A6, B1–B3, B6, C1–C2 or D1 is a **fail**, not a
  warning. These are text contrast, control boundary, the ghost primary, the declared
  zero blur, the deleted label, focus and target size — the things that stop people using
  the interface, and the six ways this style breaks in the field.
- A missing label, help text, error message, required-field marker or `<legend>` is
  always a fail, regardless of how the rest of the audit reads. Doc §13 forbids removing
  them at any intensity, and their absence is this style's signature defect.
- A budget overrun is a **warning** unless added JS for the visual layer is non-zero or an
  icon font is present, which are **fails**: doc §8 puts visual-layer JS at exactly 0
  because the style is entirely CSS, and an icon font blocks text render and breaks in
  forced-colors.
- Anything that could not be verified statically goes in Manual TODOs. Do not report an
  unverified check as a pass. Real Windows High Contrast behaviour, the text-spacing
  overrides, computed target size after layout, actual font subset sizes and the greyscale
  pass all belong there unless a browser was actually used.
