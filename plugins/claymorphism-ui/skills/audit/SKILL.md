---
name: audit
description: >-
  Use to check a UI that is ALREADY claymorphic — inflated pastel surfaces carrying their own
  fill — against its own invariants, when the user names it or its moves (inset sheen and
  shade, a hue-matched drop shadow, a squish press) and wants a review, not a change. The
  invariants it owns: the surface that must carry its OWN colour, not the page ground, since a
  matching one is neumorphism and the 1.4.11 failure; the forced-colors path, where box-shadow
  is deleted and clay's only boundary goes with it unless a real border is put back; the
  four-layer ceiling and the 68px / 48px blur budgets; the dark band that stops dark clay
  reading as chalky grey; box-shadow in a transition on a repeating selector; and the full
  stack on static panels beside interactive ones. Writes a report; never edits — use
  claymorphism-ui:apply to change anything. This is NOT a general design, taste, visual-craft
  or AI-slop audit, and not a general accessibility sweep: it will not answer "is my design
  good", "critique this UI", "find the AI tells" or "audit my site's accessibility". Dedicated
  design-quality, de-slopping, animation and a11y tools answer those better and should win
  them. A surface matching the page ground is neumorphism-ui:audit; one imitating a material
  is skeuomorphism-ui:audit. Not for glassmorphism-ui:audit, minimalism-ui:audit,
  maximalism-ui:audit, brutalism-ui:audit, liquid-glass-ui:audit, bento-grid-ui:audit,
  spatial-ui:audit.
argument-hint: "[scope glob] [--theme=light|dark|both] [--format=markdown|json]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_SKILL_DIR}/../apply/scripts/clay-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/04-claymorphism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Claymorphism: audit

Review an existing clay implementation and produce a written report. **This skill does
not write to source.** Its `allowed-tools` grant is read-only on purpose: `Read`,
`Glob`, `Grep` and the scanner. If the review finds something worth fixing, name the
file, the selector and the fix, and hand the user to `claymorphism-ui:apply`.

Clay's risk profile is specific, and knowing it tells you where to look. Its *text*
contrast is usually fine and often excellent — every pastel in the reference palette
clears 8:1 against dark ink, and a green text-contrast table is the normal result. What
breaks is everything else: the **element edge** (a blurred shadow at 30% alpha over a
similar-lightness ground rarely reaches 3:1 — `#C7B9FF` against `#F4F1FB` is 1.59:1),
the forced-colors path (the UA deletes `box-shadow`, and clay's boundary *is* the
shadow), the affordance split (static cards styled identically to buttons), dark mode
(light-mode alphas reused, which reads as chalky grey plastic), and the paint cost of
animating a large blur. Do not conclude the interface is fine because the contrast table
is green.

And check the one structural question first, because it decides whether this is even the
right audit: **do the clay surfaces carry their own colour, or the page's?** A surface
the same colour as the ground with soft shadows around it is neumorphism, and the
correct report says so rather than grading it against clay's checklist.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system and
   dark-mode strategy. The audit needs to know where the theme override lives before it
   can tell whether the dark sheen and shade were re-derived.
2. Read `references/checklist.md` in full. Every row is marked **[core]**, **[scan]**,
   **[read]** or **[eye]**; the core rows are run by `ui-morphism-core:a11y-validate`,
   the scan rows by `../apply/scripts/clay-scan.mjs`, and the rest here.
3. Read `../apply/references/tokens.md` for the baseline values and the known-bad pairs
   this style produces, and `../apply/references/anti-patterns.md` for what a finding
   should recommend instead.
4. Establish scope. Default is the whole styling surface: token files, component
   stylesheets, and any Tailwind `@theme` or config block.

## Procedure

1. **Inventory.** Grep the scope for the style's fingerprints: `box-shadow` values
   mixing `inset` and outer layers, `--clay-*` / `--um-claymorphism-*` custom
   properties, `border-radius` at or above 20px on controls, `scale(0.9…)` on `:active`,
   `shadow-clay-*` utilities, and any `hsl(… / .3)` shadow colour. Record every clay
   surface with its selector, elevation rung, surface colour, shadow hue and whether the
   selector carries an interactive signal.

2. **Answer the structural question.** For each surface, compare its background against
   the page ground. Record the result explicitly in the report even when it passes —
   "every surface carries its own colour" is the sentence that says this is
   claymorphism.

3. **Run the style scanner.**
   `node ${CLAUDE_SKILL_DIR}/../apply/scripts/clay-scan.mjs <paths> --json --no-fail`
   `--no-fail` because an audit reports rather than exits: the scanner returns 1 when it
   finds an error-severity item, and a non-zero exit here would read as the audit itself
   having failed rather than as the audit having found something.
   It reports the mechanical invariants: the four-layer ceiling, both blur ceilings,
   neutral drop shadows, a surface coloured with the ground, a forced-colors block that
   nulls the shadow without restoring a border, `forced-color-adjust: none`, `box-shadow`
   and `border-radius` inside transitions and keyframes, `will-change: box-shadow`,
   `inset` inside `text-shadow`, the dark sheen/shade band, the grid-gap floor, the
   affordance split and the four required media blocks. Every finding goes in the report
   with its file and line, whether or not you agree with the severity — say so in a note
   instead of dropping it.

4. **Run the universal checks.** `ui-morphism-core:a11y-validate` over the scope. It
   owns all nine of them, including every contrast computation. This skill computes no
   ratios of its own — one implementation, ten callers. Ask it for the **element edge**
   against its adjacent background as well as the text pairs; that is the row this style
   fails on, and a text-only contrast table will not show it.

5. **Run the style checks** in `references/checklist.md`, sections A, B, C, D and E.
   Three deserve a deliberate pass rather than a grep:

   - **The dark sheen and shade.** Find the dark theme's shadow atoms and read their
     alphas in the dark theme specifically. A stylesheet that redeclares the colours in
     dark mode and leaves the shadow alphas on the light values is the most common
     failure in this style, and a light-mode-only audit will not see it.
   - **The affordance split.** The scanner reports candidates because static CSS cannot
     resolve which elements are actually interactive at runtime. For each candidate,
     check whether the selector can only match a static panel. A `.stat-card` with the
     full stack next to a `.clay-btn` with the same stack is the finding; a `.card` that
     is itself an `<a>` is not.
   - **The light source.** One consistent direction, top or top-left, across every
     element on every screen. This is a read, not a grep: an element whose sheen sits on
     the wrong edge breaks the illusion for the whole page and no static rule catches it.

6. **Measure the budgets** in `references/checklist.md` §E against the actual emitted
   bytes and the actual per-route composition, not an estimate. The scanner's surface
   count is a count of declarations, not of what renders together — say so rather than
   reporting a declaration count as a viewport count.

7. **Write the report** in the shape below. Name it `clay-audit.md` unless the user asks
   otherwise.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the
same codebase. Where a section does not apply, write "None." — an empty section is
information, a missing section is a hole. The style supplies the rows; the sections are
fixed.

1. **Summary** — a two-column table: Style and plugin version; Scope; Framework /
   styling system with detection confidence; Dark mode (media / class / both); whether
   every clay surface carries its own colour; Findings by severity; Verdict
   (**PASS** / **PASS WITH FINDINGS** / **FAIL**). Then one paragraph naming the single
   most important finding.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict |
   Auto-correction`. Every ratio is `ui-morphism-core:a11y-validate`'s, three decimal
   places, unrounded. The Auto-correction column reads "none — audit only". **Every clay
   surface's edge against its adjacent background is always one of the rows**, in both
   themes, alongside the text pairs.

3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector
   / note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text
   contrast (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced
   colors, reduced motion, reduced transparency, colour-only encoding (1.4.1), DOM order
   (1.3.2). The style table is `references/checklist.md`, row for row, plus one matrix
   this style adds: **the affordance split** — every selector carrying the full stack and
   every selector carrying `--clay-drop-1` only, with the interactive signal (or its
   absence) that decided it.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: shadow layers per
   element, clay elements per viewport, maximum blur on any layer, maximum blur on
   anything that repeats, nested elevation depth, clay illustration bytes, emitted CSS
   bytes, added JS.

5. **Corrections** — empty by construction; this skill changes nothing. Write "None."
   and put the recommended fixes here as a `Finding | File and selector | Fix` table,
   ordered by severity, each pointing at the anti-pattern it matches.

6. **Refusals** — "None." An audit refuses nothing.

7. **Manual TODOs** — a checkbox list naming the *method*, not the concern: open a real
   Windows High Contrast session and confirm every component still has a boundary;
   measure the computed target box **after** the press transform; set 200% zoom with
   WCAG 1.4.12 text spacing and look for text clipping against the rounded corners; run
   a scroll trace on a 4× CPU-throttled profile and read the Rendering + Painting share;
   and weigh every clay illustration and locate it relative to the fold on a mobile
   breakpoint.

## Output

- `reports/clay-audit.md` — or stdout if the user asked for a review rather than a file.
  Nothing else is written.

Every finding carries: the file, the exact selector, the computed value where there is
one (three decimal places, unrounded), the criterion it fails, and the fix. A finding
without a selector is not a finding, it is a feeling.

## Verdict rules

- Any failing row in checklist section A1-A5, A7-A9, B1-B3, B5-B7 or C1-C4 is a **fail**,
  not a warning. Those are contrast, the boundary, forced colors, focus, the affordance
  split, the dark band and the surface-colour invariant — the things that stop people
  using the interface, or that mean the interface is not this style.
- A budget overrun is a **warning**, except an illustration or Spline scene above the
  fold on mobile, which is a **fail**: §8 puts a hard number on both and §13 refuses the
  scene outright.
- A style-fidelity finding is a **note**, not a fail: a neutral drop shadow on a coloured
  surface, radii below 16px on controls, a sharp grotesk in place of a rounded sans, an
  inconsistent light direction. Report them, and do not upgrade one to a fail to make
  the report look decisive.
- Anything that could not be verified statically goes in Manual TODOs. Do not report an
  unverified check as a pass. Real Windows High Contrast behaviour, computed target size
  after the press transform, text clipping at 200% zoom, the scroll trace and the real
  weight and position of any 3D asset all belong there unless a browser was actually
  used.
