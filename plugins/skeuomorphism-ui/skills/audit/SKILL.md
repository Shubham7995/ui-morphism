---
name: audit
description: >-
  Use to check a UI that is ALREADY skeuomorphic — surfaces imitating a named material —
  against this style's own invariants, when the user names the style or its moves (a
  four-layer shadow stack, bevels, letterpress type, a three-stop face gradient, SVG grain,
  hardware controls) and wants a review rather than a change. The invariants it owns: one
  overhead light source across every component, with the recessed inversion as the only
  exception; a real 1px border on every control, because forced-colors nulls box-shadow and a
  bevel is not a boundary; the grain layer that SURVIVES forced-colors, since
  background-image: none does not apply to url() backgrounds; text measured against the
  darkest gradient stop; and zero animated box-shadow. Writes a report; never edits — use
  skeuomorphism-ui:apply to change anything. This is NOT a general design, taste, visual-craft
  or AI-slop audit, and not a general accessibility sweep: it will not answer "is my design
  good", "critique this UI", "find the AI tells" or "audit my site's accessibility". Dedicated
  design-quality, de-slopping, animation and a11y tools answer those better and should win
  them. A soft surface imitating NO material is neumorphism-ui:audit (same colour as the page
  ground) or claymorphism-ui:audit (inflated pastel). Not for glassmorphism-ui:audit,
  minimalism-ui:audit, maximalism-ui:audit, brutalism-ui:audit, liquid-glass-ui:audit,
  bento-grid-ui:audit, spatial-ui:audit.
argument-hint: "[scope glob] [--theme=light|dark|both] [--format=markdown|json]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_SKILL_DIR}/../apply/scripts/skeuo-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/01-skeuomorphism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Skeuomorphism: audit

Review an existing skeuomorphic implementation and produce a written report. **This skill
does not write to source.** Its `allowed-tools` grant is read-only on purpose: `Read`,
`Glob`, `Grep` and the scanner. If the review finds something worth fixing, name the file,
the selector and the fix, and hand the user to `skeuomorphism-ui:apply`.

This style's risk profile is not the one people expect, and knowing it tells you where to
look. Unlike its closest relative, neumorphism,
skeuomorphism uses real borders and real value separation, so its *colour* is usually
sound: `#4a3f2d` on `#e8e0d2` is **7.85:1** and `--sk-border-strong` is **4.01:1** against
the face. What breaks is the **light model** and the **decoration budget** — a bevel used
as a boundary, a bottom-lit gradient under a top-lit stack, a well that bulges instead of
sinking, an animated shadow stack, a grain layer per component, and above all the
forced-colors path, where the UA deletes every shadow, every gradient and every text
shadow while leaving the `url()` grain alive on top of the user's forced palette. Do not
conclude the interface is fine because the contrast table is green.

Two structural questions decide what the rest of the audit means, so answer them first.
**Is the light direction one direction?** and **does every control have a real border?**
An implementation that fails either is not a skeuomorphic interface with defects; it is a
flat interface wearing four shadows, and the report should say so before it grades
anything else.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system and
   dark-mode strategy. The audit needs to know where the theme override lives before it
   can tell whether the dark bevel alphas and the dark grain opacity were re-derived
   rather than inherited from the light values.
2. Read `references/checklist.md` in full. Every row is marked **core** or **style**, and
   the rows marked **scan** are the ones `../apply/scripts/skeuo-scan.mjs` decides
   mechanically. The core rows are run by `ui-morphism-core:a11y-validate`; the rest are
   run here.
3. Read `../apply/references/tokens.md` for the baseline values, the material table and
   the known-bad pairs this style produces, `../apply/references/motion.md` for what may
   and may not animate, and `../apply/references/anti-patterns.md` for what a finding
   should recommend instead.
4. Establish scope. Default is the whole styling surface: token files, component
   stylesheets, and any Tailwind `@theme` or `@utility` block.

## Procedure

1. **Inventory.** Grep the scope for the style's fingerprints: multi-layer `box-shadow`
   values mixing outer and `inset` layers, `--sk-*` / `--um-skeuomorphism-*` custom
   properties, `linear-gradient(to bottom, …)` with three stops, `text-shadow: 0 1px 0`
   letterpress, `feTurbulence` data URIs, `radial-gradient(… at 50% 28% …)` specular
   hotspots, and `translateY(1px)` on `:active`. Record every surface with its selector,
   its elevation rung, whether it is raised or recessed, and which material its radius and
   ramp imply.

2. **Answer the two structural questions.** Record both explicitly in the report even when
   they pass — "one overhead source across every surface, recessed containers inverted"
   and "every control carries a real `--sk-border-strong` edge" are the two sentences that
   say this is skeuomorphism rather than a costume.

3. **Run the style scanner.**
   `node ${CLAUDE_SKILL_DIR}/../apply/scripts/skeuo-scan.mjs <paths> --json --no-fail`
   `--no-fail` because an audit reports rather than exits: the scanner returns 1 when it
   finds an error-severity item, and a non-zero exit here would read as the audit itself
   having failed rather than as the audit having found something.
   It reports the mechanical invariants: outer shadows cast upward, a light inset at the
   bottom or a dark inset at the top of a raised surface, an inverted stack on a selector
   that names no recessed part, the single blurred shadow, a shadow-bounded control with
   no border, a face gradient running to top or missing the 45% midpoint, a specular
   hotspot outside the 25-35% band or on a flat rectangle, a focus rule that replaces the
   stack, a shadow-based ring with no transparent outline, the grain's baked parameters,
   opacity band, tile size and layer count, the `display: none` the grain needs inside
   forced-colors, `box-shadow` and `background-image` inside transitions and keyframes,
   `will-change: box-shadow`, a reduced-motion block that deletes the pressed state,
   raster textures, the 12px hybrid blur cap and the 2px travel ceiling. Every finding goes
   in the report with its file and line, whether or not you agree with the severity — say
   so in a note instead of dropping it.

4. **Run the universal checks.** `ui-morphism-core:a11y-validate` over the scope. It owns
   all nine of them, including every contrast computation. This skill computes no ratios
   of its own — one implementation, ten callers. Ask it explicitly for body text against
   the **darkest** gradient stop each text token can sit on, not the average and not the
   top stop: on the mid stop `#e8e0d2` the body ink is **7.85:1** and on the darkest stop
   `#d9cfbc` it is **6.67:1**, and an audit that measures the average will report AAA for
   a pair that does not reach it.

5. **Run the style checks** in `references/checklist.md`, sections A4-A7, A9, A10, B6-B10,
   C5, C6, D2-D4, D6, D7, E9 and F3, F5, F6, F9, F10. Three deserve a deliberate pass
   rather than a grep:

   - **The light direction, read rather than parsed.** The scanner catches polarity inside
     one `box-shadow` value. It cannot see that the *gradient* on one card runs the other
     way from the gradient on its neighbour, or that an illustration baked into an asset
     is lit from the left. Look at the set as a set. This is the failure doc §3 calls the
     number-one tell of a fake, and it is the one no static rule catches.
   - **The recessed inversion, element by element.** Every input, textarea, select, slider
     track and slot should sink; every button, card and chip should rise. A well that
     bulges is a shape no physical panel has, and it is the single most common way an
     implementation stops reading as hardware while passing every contrast check.
   - **Material honesty.** One global radius across metal, wood, glass and rubber tells
     the user every object is made of the same thing. Check the radius bands — 2-4px
     machined, 8-12px moulded, 16-24px soft goods — and check that a dial rotates, a fader
     travels linearly and a switch throws rather than fading.

6. **Measure the budgets** in `references/checklist.md` §F against the actual emitted bytes
   and the actual per-route composition, not an estimate. The scanner's grain-layer count
   is per file, and a file is a proxy for a scroll container rather than a measurement of
   one — say so rather than reporting a declaration count as a viewport count. If a number
   cannot be measured without a build, say that instead of reporting a guess.

7. **Write the report** in the shape below. Name it `skeuomorphism-audit.md` unless the
   user asks otherwise.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table: Style and plugin version; Scope; Framework / styling
   system with detection confidence; Dark mode (media / class / both); whether the light
   direction is single and whether every control carries a real border; Findings by
   severity; Verdict (**PASS** / **PASS WITH FINDINGS** / **FAIL**). Then one paragraph
   naming the single most important finding.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict |
   Auto-correction`. Every ratio is `ui-morphism-core:a11y-validate`'s, three decimal
   places, unrounded. The Auto-correction column reads "none — audit only". **Every text
   token against the darkest gradient stop it can sit on is always one of the rows**, named
   as the darkest stop in the Backdrop column, and so is every control boundary against
   both its own fill and the surface behind it, in both themes.

3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text
   contrast (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors,
   reduced motion, reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2).
   The style table is `references/checklist.md`, row for row, plus one matrix this style
   adds: **the light model** — every surface with its rung, whether it is raised or
   recessed, the y-sign of each outer layer, the edge each inset sits on, and the direction
   of its face gradient. That matrix is what makes a mixed-light finding reviewable rather
   than an assertion.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: grain layers per scroll
   container, grain opacity light and dark, decorative image bytes per route, largest
   single raster texture, emitted CSS bytes gzipped, simultaneously animating shadow
   stacks, hybrid backdrop-blur radius and count, added JS.

5. **Corrections** — empty by construction; this skill changes nothing. Write "None." and
   put the recommended fixes here as a `Finding | File and selector | Fix` table, ordered
   by severity, each pointing at the anti-pattern in `../apply/references/anti-patterns.md`
   it matches.

6. **Refusals** — "None." An audit refuses nothing.

7. **Manual TODOs** — a checkbox list naming the *method*, not the concern: open a real
   Windows High Contrast session and confirm every control still has a boundary and the
   grain is gone; screenshot and sample the rendered pixels of body text over the grained
   and gradient-filled surface rather than trusting the declared stop; measure the computed
   target box of every knob, dial and fader in a cluster; run the interface at 320px and at
   200% zoom with the SC 1.4.12 text-spacing overrides and look for clipped uppercase
   letterpress labels and panels that will not reflow; weigh the real gzipped CSS and every
   decorative asset; and run a scroll trace on a 4× CPU-throttled mid-range Android profile
   and read interaction-to-next-paint.

## Output

- `reports/skeuomorphism-audit.md` — or stdout if the user asked for a review rather than
  a file. Nothing else is written.

Every finding carries: the file, the exact selector, the computed value where there is one
(three decimal places, unrounded), the criterion it fails, and the fix. A finding without a
selector is not a finding, it is a feeling.

## Verdict rules

- Any failing row in checklist section A1-A3, A5, B1-B4, C1-C4 or E1-E2 is a **fail**, not
  a warning. Those are contrast, the boundary, the light model, focus and the forced-colors
  path — the things that stop people using the interface, or that mean the interface is not
  this style.
- An animated `box-shadow`, `background-image` or gradient stop is a **fail** rather than a
  budget note: doc §6, §8 and §13 all put it at zero, and it is a defect in the emitted
  code rather than a quantity to tune.
- Any other budget overrun is a **warning**, except a raster texture with text baked into
  it, which is a **fail**: it carries no accessible name at all.
- A style-fidelity finding is a **note**, not a fail: one global radius across four
  materials, a specular hotspot on a flat rectangle, a gradient midpoint at 50% instead of
  45%, grain at the wrong frequency. Report them, and do not upgrade one to a fail to make
  the report look decisive — with the exception of a mixed light direction, which doc §3
  and §10 treat as structural and which belongs in the fail column.
- Anything that could not be verified statically goes in Manual TODOs. Do not report an
  unverified check as a pass. Rendered contrast over a grained and gradient-filled surface,
  real Windows High Contrast behaviour, computed target size in a dial cluster, actual
  gzipped byte counts and interaction-to-next-paint on a real mid-range Android all belong
  there unless a browser was actually used.
