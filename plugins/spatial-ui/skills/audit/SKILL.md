---
name: audit
description: >-
  Use to check a UI that is ALREADY spatial — panels at measured translateZ under a
  `perspective` camera — against this style's own invariants, when the user names it or its
  moves (a perspective stage, orbiters, pointer or scroll parallax) and wants a review rather
  than a change. The invariants it owns: SC 2.5.7 Dragging Movements, the criterion this style
  breaks most reliably and nobody discusses, so every movable or resizable panel needs a
  non-drag alternative; every z step carrying its counter-scale; no position: fixed inside a
  perspective subtree; a parallax listener detached under reduced motion rather than zeroed;
  panel alpha over a backdrop the project does not own; and the layer, backdrop-filter and
  GPU-memory budgets. Writes a report; never edits — use spatial-ui:apply to change anything.
  This is NOT a general design, taste, visual-craft or AI-slop audit, and not a general
  accessibility sweep: it will not answer "is my design good", "critique this UI", "find the
  AI tells" or "audit my site's accessibility". Dedicated design-quality, de-slopping,
  animation and a11y tools answer those better and should win them. Translucent panels with NO
  camera are glassmorphism-ui:audit (blurred backdrop) or liquid-glass-ui:audit (refracting
  backdrop). Not for skeuomorphism-ui:audit, neumorphism-ui:audit, claymorphism-ui:audit,
  minimalism-ui:audit, maximalism-ui:audit, brutalism-ui:audit, bento-grid-ui:audit.
argument-hint: "[scope glob] [--theme=light|dark|both] [--target=screen|headset|both] [--format=markdown|json]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/skills/apply/scripts/spatial-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/10-spatial-ui.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Spatial UI: audit

Review an existing spatial implementation and report. **This skill does not write to
source.** Its `allowed-tools` grant is read-only apart from one bundled scanner that reads
and prints: `Read`, `Glob`, `Grep` and `node ../apply/scripts/spatial-scan.mjs`. If the review finds
something worth fixing, name the file, the selector and the fix, and hand the user to
`spatial-ui:apply`.

Two things determine where to look, and they are worth stating before the first check.

**This style's failures are structural, not chromatic.** Doc §7 rates its accessibility
risk high because it stacks three independently hazardous mechanisms: translucency over a
backdrop nobody controls, motion the user did not initiate, and hierarchy encoded in a
channel assistive technology cannot read. A clean contrast table proves none of that is
handled.

**SC 2.5.7 Dragging Movements is the criterion this style breaks most reliably and the one
nobody discusses.** `movable()`, `resizable()`, drag-to-reposition panels and drag-based
depth controls all need a single-pointer, non-dragging alternative. Look for it first, in
every framework the project uses, and report its absence as a fail rather than a note. In
a spatial codebase it is almost always absent.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system and
   dark-mode strategy. The audit needs to know where the theme override lives before it
   can tell whether the dark panel alpha was set at all.
2. Read `references/checklist.md` in full. Every row is marked **core**, **scan** or
   **style**: core rows are run by `ui-morphism-core:a11y-validate`, scan rows by the
   bundled `spatial-scan.mjs`, and style rows by reading.
3. Read `../apply/references/tokens.md` for the baseline values and the alpha floors, and
   `../apply/references/anti-patterns.md` for what a finding should recommend instead.
4. Establish scope and `target`. Default scope is the whole styling surface: token files,
   component stylesheets, any Tailwind `@theme` or config block, and the JS or TSX that
   drives the parallax. A CSS-only scope cannot see the reduced-motion detach, which is
   half of this style's motion story.

## Procedure

1. **Inventory.** Grep the scope for the style's fingerprints: `perspective`,
   `perspective-origin`, `transform-style: preserve-3d`, `translateZ` / `translate3d` with
   a non-zero z, `backdrop-filter`, `--sp-*` / `--um-spatial-*` custom properties,
   `pointermove` listeners writing custom properties, `animation-timeline: scroll()`,
   `androidx.xr.compose` imports, `.glassBackgroundEffect()`, `.ornament(`. Record which
   dialect the project is in — native XR or the flat-screen depth idiom — because half the
   checks below read differently in each.

2. **Run the universal checks.** `ui-morphism-core:a11y-validate` over the scope. It owns
   all nine of them, including every contrast computation. This skill computes no ratios
   of its own — one implementation, ten callers. For every glass surface, ask it for the
   composite at both extremes of the backdrop, per 8-bit channel in gamma-encoded sRGB. A
   single number for a glass surface is a wrong number.

3. **Run the scanner.**
   `node ${CLAUDE_PLUGIN_ROOT}/skills/apply/scripts/spatial-scan.mjs <scope> --json`
   It owns the mechanical rows of `references/checklist.md`: the dragging alternative,
   `position: fixed` inside a perspective subtree, `perspective` on `html` / `body` /
   `:root`, ladder quantisation, missing counter-scale, `preserve-3d` nesting and
   `preserve-3d` on scrolling containers, the `backdrop-filter` census, animated
   `backdrop-filter` / `perspective` / `width` / `height`, permanent `will-change`, the
   reduced-motion detach, forced-colors flattening, text planes past 12°, target sizes
   written as literals, and the GPU layer-memory estimate.

4. **Run the style checks** in `references/checklist.md` that neither of the above owns.
   Three deserve a deliberate pass rather than a grep:

   - **The dragging alternative.** The scanner finds drag affordances and the absence of a
     keyboard path in the same file. It cannot tell whether a `onKeyDown` handler actually
     moves the panel, or whether a "Reset layout" button is reachable. Read the handler.
   - **Depth versus semantics.** For every panel above level 2, ask what a screen reader
     is told. A modal at level 5 with no `aria-modal`, a menu at level 3 with no `role`,
     or a "selected" state expressed only as a z change are all SC 1.3.1 failures that no
     static pattern will surface.
   - **Focus obscured by a floating layer (SC 2.4.11).** Orbiters and level-5 dialogs sit
     *in front* of content by construction. Static analysis can list every floating
     surface and every focusable behind it; it cannot confirm the overlap. Emit the list
     as a Manual TODO with the elements to tab through.

5. **Measure the budgets** in `references/checklist.md` §F against the actual emitted
   bytes and the actual layer census, not an estimate. The GPU layer-memory number the
   scanner prints is an estimate at a stated viewport and must be reported as one; if the
   real number cannot be measured without a browser, say so rather than reporting a guess.

6. **Write the report** in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table: Style and plugin version; Scope; Dialect (native XR /
   flat-screen) and `target`; Framework / styling system with detection confidence; Dark
   mode (media / class / both); Findings by severity; Verdict (**PASS** / **PASS WITH
   FINDINGS** / **FAIL**). Then one paragraph naming the single most important finding.
2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, three decimal places, unrounded — a
   ratio of 4.497 fails a 4.5:1 requirement. One row per text token per extreme of the
   backdrop; where the backdrop is not owned by the project, the worst case is the whole
   sRGB cube and the row says so. The Auto-correction column reads "none — audit only".
3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text
   contrast (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors,
   reduced motion, reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2).
   The style table is `references/checklist.md`, row for row, plus two matrices:
   - **Depth ledger** — per panel: depth level, z in px, whether a counter-scale
     accompanies it, the shadow pair, and the semantic role carrying the same information.
   - **Camera containment** — every `position: fixed` element inside a perspective or
     transform subtree, by selector and file.
4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: concurrent
   `backdrop-filter` surfaces, composited layers, estimated GPU layer memory,
   `preserve-3d` nesting depth, panels animating depth at once, emitted CSS bytes, added
   JS bytes.
5. **Corrections** — empty by construction; this skill changes nothing. Write "None." and
   put the recommended fixes here as a `Finding | File and selector | Fix` table, ordered
   by severity, each pointing at the anti-pattern it matches.
6. **Refusals** — "None." An audit refuses nothing.
7. **Manual TODOs** — a checkbox list naming the *method*, not the concern: sample the
   composited pixels behind every glass panel at three scroll positions; tab through and
   confirm no focused control sits behind an orbiter or a level-5 dialog; drive every
   movable panel with the keyboard alone; measure real GPU layer memory in the browser's
   layer panel; test at 200% text zoom inside a transformed panel; test real Windows High
   Contrast behaviour.

## Output

- `reports/spatial-ui-audit.md` — or stdout if the user asked for a review rather than a
  file. Nothing else is written.

Every finding carries: the file, the exact selector, the computed value where there is one
(three decimal places, unrounded), the criterion it fails, and the fix. A finding without a
selector is not a finding, it is a feeling.

## Verdict rules

- Any failing row in checklist section A, B1, B2, C1, C2 or D1 is a **fail**, not a
  warning. Those are contrast, the counter-scale, the camera's containing block, focus,
  and the dragging alternative — the things that stop people using the interface rather
  than making it look wrong.
- A missing non-drag alternative on any movable or resizable panel is a **fail** on its
  own, regardless of everything else on the page. It is SC 2.5.7 at Level AA and it is
  this style's signature omission.
- A budget overrun is a **warning** unless GPU layer memory exceeds the limit or a
  `backdrop-filter` sits on a repeated list item, which are **fails**: both take the
  interface below interactive frame rates on the mid-range Android hardware doc §8 names.
- Anything that could not be verified statically goes in Manual TODOs. Do not report an
  unverified check as a pass. Rendered composited contrast, real layer memory, actual
  focus obscuring, keyboard-driven panel movement and real Windows High Contrast behaviour
  all belong there unless a browser was actually used.
