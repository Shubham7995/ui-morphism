---
name: audit
description: >-
  Use to check a UI that ALREADY uses a bento or varied-span tile grid against this pattern's
  own invariants, when the user names it and wants a review rather than a change. The
  invariants it owns: the reading-flow guard — DOM order versus visual order, `grid-auto-flow:
  dense` or `order` over focusable tiles, an SC 1.3.2 failure; one heading and zero-or-one
  links per tile, and the two-links-under-an-overlay trap; the dominant tile's share and the
  distinct-span count; interactive-border alpha against the 3:1 crossing; scrim strength over
  imagery; fixed `grid-auto-rows` clipping text at 200% zoom; single-column collapse at 320px;
  and the tile-image byte budget. It audits LAYOUT ONLY and says nothing about surface
  treatment. Writes a report; never edits — use bento-grid-ui:apply to change anything. This
  is NOT a general design, taste, visual-craft or AI-slop audit, and not a general
  accessibility sweep: it will not answer "is my design good", "critique this UI", "find the
  AI tells" or "audit my site's accessibility". Dedicated design-quality, de-slopping,
  animation and a11y tools answer those better and should win them. To audit the surfaces
  inside the tiles use the style plugin by name: skeuomorphism-ui:audit, neumorphism-ui:audit,
  glassmorphism-ui:audit, claymorphism-ui:audit, minimalism-ui:audit, maximalism-ui:audit,
  brutalism-ui:audit, liquid-glass-ui:audit, spatial-ui:audit.
argument-hint: "[scope glob] [--budget-images=600KB] [--sticky-header=88px]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_SKILL_DIR}/../apply/scripts/assign-spans.mjs *)
license: MIT
metadata:
  sourceDoc: docs/09-bento-grid.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Bento grid: audit

Review an existing bento or tile grid and produce a written report. **This skill does not edit
source files.** It reads, measures and reports. If the user wants the findings fixed, hand off
to `bento-grid-ui:apply` with the report attached.

The audit exists because this pattern's failures are structural, and structural failures are
invisible to the tools people already run. Lighthouse and axe will not tell you that
`grid-auto-flow: dense` moved tile seven above tile three, that a tile contains two links under
a full-tile overlay so the second is unclickable, that `grid-auto-rows: 180px` clips its own
content at 200% zoom, or that the section ships 2.4MB of screenshots because no image carries a
`sizes` attribute. Every one of those is a shipped bento in the wild.

## Before you start

1. Run `ui-morphism-core:detect-stack` to locate the styling system and the component root. You
   need it to know which files hold the grid and which hold the tiles.
2. Read `references/checklist.md`. It is the checklist you are running, in order.
3. Establish scope. Default is the section the user named plus the stylesheet that governs it.
4. Ask what the **sticky header height** is, if there is one. SC 2.4.11 findings depend on it and
   it is not derivable from the grid's own CSS.

## Procedure

1. **Inventory the grid.** Find the container: `display: grid` with a spanning child, a
   `BentoGrid`-shaped component, or a Tailwind `grid-cols-*` list whose children carry
   `col-span-*` / `row-span-*`. Record for each tile: its span, its content type, its link count,
   its heading level, its media and that media's declared dimensions.

2. **Recompute the composition.** Feed the inventory to the planner as JSON:

   ```
   node ${CLAUDE_SKILL_DIR}/../apply/scripts/assign-spans.mjs <inventory.json> --json --no-fail
   ```

   Its `checks` array gives the decidable composition findings — hero count, distinct spans, tile
   count, one link per tile, dominant-tile area share, uniformity, empty cells, reveal budget,
   growable rows, sparse flow, mobile collapse — and its `tiles` array gives the span the content
   *would* have been assigned, which is the most useful column in the report when the shipped
   spans disagree with the content weight. `--no-fail` because an audit reports rather than
   exits.

3. **Run `ui-morphism-core:a11y-validate`** for all nine universal checks. Ask it for: body and
   muted text on both tile backgrounds, the accent on tile, the interactive border against the
   tile, the focus ring against the tile, and white text over the scrim composited on **pure
   white** imagery — the only safe assumption with CMS or user-supplied photographs. Never
   compute a ratio here.

4. **Check reading order by hand.** This is the finding the pattern exists to catch and it is
   not automatable. Read the DOM order, read the visual order the CSS produces, and say whether
   they are the same. Look specifically for `grid-auto-flow: dense`, `order`, negative
   `grid-row-start`, absolute positioning of sequential content, and any `reading-flow` used
   without a correct DOM order underneath.

5. **Check the tile interiors.** One `<h3>` per tile at the right level under the section's
   `<h2>`; zero or one links; `role="list"` present on the `<ul>`; no `role="grid"`; decorative
   images at `alt=""` and informative screenshots with real alt text or a visible caption; chips
   and icon buttons sizing from `--bento-target-min` rather than a literal.

6. **Measure the budgets.** Total section image bytes against ≤ 600KB (warn) and ≤ 1.2MB (fail).
   Largest tile image against ≤ 200KB. Autoplaying videos against one per section at ≤ 2MB with a
   poster. `backdrop-filter` element count against ≤ 1. Unsized media against a CLS budget of
   0.02. Missing `sizes` attributes, which are the most common single cause of a blown budget.

7. **Check the escape hatches.** `prefers-reduced-motion: reduce` neutralising transform,
   animation and tile video; `forced-colors: active` giving every tile a `CanvasText` border,
   dropping shadows, hiding the scrim and using `Highlight` for focus.

8. **Write the report** in the shape below. Name it `bento-audit.md` unless the user asks
   otherwise.

## What the report contains

Seven sections, in this order, in every ui-morphism audit from every style. Do not add, remove
or reorder them: the order is what lets a user diff two styles' audits of the same codebase.
Where a section does not apply, write "None." — an empty section is information, a missing
section is a hole. The sections are fixed; this style supplies the rows.

1. **Summary** — a two-column table: Style and plugin version; Scope; Framework / styling system
   with detection confidence; Dark mode (media / class / none); the **reading-order verdict**,
   DOM order versus visual order stated as same or different with the offending declaration when
   different; Findings by severity; Verdict (**PASS** / **PASS WITH FINDINGS** / **FAIL**). Then
   one paragraph. The reading-order line is the headline finding of a bento audit and belongs at
   the top, not buried in the checklist.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Three decimal places, unrounded, including the scrim composite against **pure white**
   imagery. Auto-correction reads "none — audit only".

3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text contrast
   (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors, reduced motion,
   reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2). The style table is
   `references/checklist.md` row for row, plus the two tables this pattern adds:
   - **Per-tile table**: shipped span, the span the content weight implies, content type,
     computed text/background contrast, image weight, alt-text status, link count, heading
     level. One row per tile. Where shipped and implied spans differ, say which is right and why.
   - **Composition metrics**: tile count, distinct spans, dominant tile's share of the section
     area against §3's 30–40%, measured largest:smallest area ratio, empty cells, grid rows.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: the six numbers from step 6,
   each against its limit.

5. **Corrections** — empty by construction; this skill changes nothing. Write "None." and put
   what the user should change here as a `Finding | File and selector | Fix` table, ordered by
   severity.

6. **Refusals** — "None." An audit refuses nothing.

7. **Manual TODOs** — a checkbox list naming the *method*, not the concern. Always at least
   these three, because none is computable from source: tab through the whole section and
   confirm focus moves left-to-right and top-to-bottom with no jumps; render at 320px and
   confirm one column with no horizontal scroll; render at 200% text zoom and confirm no tile
   clips its content.

## Severity, so the report is actionable rather than a list

- **Fail** — a text pair below 4.5:1 or an interactive border below 3:1; `grid-auto-flow: dense`
  over focusable tiles with no `reading-flow` guard; two links in a tile under a full-tile
  overlay; a card wrapped entirely in one `<a>`; `role="grid"`; a fixed `grid-auto-rows` clipping
  text; horizontal scroll at 320px; text over imagery with no scrim; a missing focus indicator; a
  target below 24×24; image bytes above 1.2MB.
- **Risk** — inside the letter of the rules but fragile: muted text at 4.66:1 with no headroom; a
  hairline border on a tile that is a control; more than nine tiles; a CMS-driven tile count; a
  dominant tile outside the 30–40% band; image bytes above 600KB; missing `sizes`; unsized media.
- **Note** — style-fidelity findings that are not compliance findings: more than five distinct
  spans; mixed radii or gaps; icon-per-tile where the 2024–2026 wave uses product screenshots;
  a uniform grid presented as a bento; hover motion on non-interactive tiles.

Do not upgrade a Note to a Fail to make the report look decisive, and do not soften a Fail
because the composition is otherwise good. The severity is the useful part.
