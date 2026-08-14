---
name: audit
description: >-
  Use to check a UI ALREADY on Apple Liquid Glass — a backdrop that WARPS as well as blurs,
  iOS 26/27 toolbars, a `backdrop-filter: url(#…)` displacement filter, or SwiftUI
  `.glassEffect` surfaces — against its own invariants, when the user names it and wants a
  review, not a change. The invariants it owns: nested glass, a hard fail: the material cannot
  sample itself; the fill-alpha floor below which no foreground colour passes over every
  backdrop; the three-tier `@supports` ladder and its opaque Tier 0; composited contrast at
  both backdrop luminance extremes, which axe and Lighthouse miss by measuring the declared
  `background-color`; the triple-ring focus indicator; displacement maps inlined not fetched;
  and the surface, refractor and blur budgets. Writes a report; never edits — use
  liquid-glass-ui:apply to change anything. This is NOT a general design, taste, visual-craft
  or AI-slop audit, and not a general accessibility sweep: it will not answer "is my design
  good", "critique this UI", "find the AI tells" or "audit my site's accessibility". Dedicated
  design-quality, de-slopping, animation and a11y tools answer those better and should win
  them. A blurred backdrop with NO displacement is glassmorphism-ui:audit; panels at
  translateZ under a camera, spatial-ui:audit. Not for skeuomorphism-ui:audit,
  neumorphism-ui:audit, claymorphism-ui:audit, minimalism-ui:audit, maximalism-ui:audit,
  brutalism-ui:audit, bento-grid-ui:audit.
argument-hint: "[scope glob] [--a11y-target=AA|AAA] [--perf-target=desktop|mobile|low-end] [--format=markdown|json]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_SKILL_DIR}/../apply/scripts/lg-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/08-liquid-glass.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Liquid Glass: audit

Review an existing Liquid Glass implementation and produce a written report. **This skill
does not write to source.** Its `allowed-tools` grant is read-only on purpose: `Read`,
`Glob`, `Grep` and the scanner. If the review finds something worth fixing, name the file,
the selector and the fix, and hand the user to `liquid-glass-ui:apply`.

The audit exists because two different classes of tooling cannot do this job.

**Contrast tools measure the wrong background.** axe, Lighthouse and Figma's contrast
plugins compute against the declared `background-color`, and a `backdrop-filter` means the
declared background is not the effective one. At the fill this style ships (0.62) over a
mid-grey photo, `#1C1C1E` ink measures **10.89:1** and white text on the *same surface*
measures **1.56:1**. A tool reporting one number for that surface is reporting the wrong
number. Every contrast row in this report carries two, computed at backdrop luminance 0 and
at 255.

**Nothing else checks the structure at all.** Nested glass is this style's one hard fail —
glass cannot sample glass, which is why `GlassEffectContainer` exists — and no linter,
bundler or accessibility tool knows that. Neither does anything check that the refraction
tier is gated by `@supports` rather than a user-agent string, that the displacement map is
inlined rather than fetched, or that a surface calling itself liquid glass has a lens at
all.

One framing to carry into the first check. On Apple platforms this material is the OS's
job and the audit is mostly about *conversion correctness* — containers, variants,
preferences read separately. On the web it is a decorative accent with a hard portability
ceiling: `backdrop-filter: url(#f)` is Chromium-only, so the honest question is often not
"is the lens correct" but "does the lens exist for anyone but a third of this project's
users, and does the tier underneath it stand up on its own".

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark-mode
   strategy and component root. The audit needs to know where the theme override lives and
   whether the target is web or native before it can judge anything.
2. Read `references/checklist.md` in full. It is the checklist you are running, in order.
   Every row is tagged with who runs it.
3. Read `../apply/references/tokens.md` for the baseline values and the solved floors, and
   `../apply/references/anti-patterns.md` for what a finding should recommend instead.
4. **Confirm who owns the backdrop.** Half of this style's failure modes are properties of
   the backdrop rather than of the surface. If the backdrop is user-supplied, third-party or
   an embed, the answer to most contrast questions is "you cannot guarantee this", and that
   is itself the finding rather than a gap in the audit.
5. Establish scope. Default is the whole styling layer plus the component root, plus any
   inline SVG filter `<defs>` wherever they live.

## Procedure

1. **Inventory.** Find every glass surface: rules declaring `backdrop-filter`, components
   named for glass, Tailwind `backdrop-blur-*` usage in markup, and on Apple platforms every
   `.glassEffect`, `UIGlassEffect`, `NSGlassEffectView` and `LiquidGlassView` call site.
   Record per surface: the selector, the tier it reaches, the fill alpha, the blur radius,
   the refraction scale, whether it is `position: fixed` or `sticky`, and whether it is
   Regular or Clear.

2. **Run the style scanner.**
   `node ${CLAUDE_SKILL_DIR}/../apply/scripts/lg-scan.mjs <paths> --json --no-fail`
   `--no-fail` because an audit reports rather than exits: the scanner returns 1 when it
   finds an error-severity item, and a non-zero exit here would read as the audit itself
   having failed rather than as the audit having found something.

   It reports the mechanical invariants: nested glass in both selectors and markup, the
   Tier 2 `@supports` gate, the Tier 0 fallback, the `-webkit-` twin, the animatable set,
   `feImage` fetching a map, user-agent sniffing, glass on content and on scroll containers,
   Clear without its scrim, live blur inside `forced-colors`, the decorative layers'
   `aria-hidden` and `focusable`, the surface and refractor budgets, and a blur-only surface
   being called liquid glass. Every finding goes in the report with its file and line,
   whether or not you agree with the severity — say so in a note instead of dropping it.

3. **Run `ui-morphism-core:a11y-validate`** for all nine universal checks. For every text
   token on glass, ask it for the composited ratio at backdrop luminance **0 and 255** —
   both, always. This skill computes no ratios of its own; there is one contrast
   implementation and it is core's. Where the backdrop is a controlled gradient those two
   extremes are computable. Where it is a photograph, a user upload or a third-party embed
   they are not, and the surface is recorded as unmeasurable — which is the finding.

4. **Adjudicate the nesting findings by hand.** The scanner reports candidates because
   static text cannot resolve a rendered tree: a class list assembled by `clsx()` is
   invisible to it, and a `.lg .lg-card` selector may describe a combination the app never
   renders. For each candidate, decide whether the inner surface can actually be a
   descendant of the outer one. A confirmed nesting is a **fail**, not a risk — there is no
   intensity at which it becomes acceptable.

5. **Check the tier ladder as a matrix, not as a list.** Per surface: does Tier 2 exist and
   is it gated; does Tier 1 stand up on its own for the Safari and Firefox majority; does
   Tier 0 exist at ≥ 0.94 opacity; is the `-webkit-` twin present on every declaration,
   *including the ones that null the filter*. That last one is the quiet failure: nulling
   only the unprefixed spelling leaves `-webkit-backdrop-filter` alive in exactly the branch
   whose job is to remove it.

6. **Measure the budgets** against §8: glass surfaces in viewport (≤ 3, ≤ 2 mobile),
   refracting surfaces (≤ 1), total glass area (≤ 25%), blur radius (≤ 24px), displacement
   map bytes (≤ 8KB, inlined), and the GPU texture estimate. If a number cannot be measured
   without a build or a browser, say so rather than reporting a guess.

7. **Check the structural accessibility items the scanner cannot see:** `scroll-margin-top`
   on focusables under a sticky glass bar; modals using `<dialog>` or `aria-modal="true"`
   with a focus trap and an inert background; whether any state is carried by transparency,
   blur or the specular sweep alone; whether merged or morphing groups keep their accessible
   name, role and focus order through the morph; and whether floating chrome appended late
   in the DOM sits in a landmark or in visual order.

8. **On Apple platforms, check the conversion rather than the CSS.** Do sibling
   `.glassEffect` views share one `GlassEffectContainer`? Is every `.clear` accompanied by a
   dimming layer? Are `accessibilityReduceTransparency` and `accessibilityReduceMotion` read
   **separately** — they are separate settings and users commonly enable only one? Are
   custom text colours re-checked against the opaque fallback, which is a different surface?
   Is `UIDesignRequiresCompatibility` still set, and does the team know it is on a removal
   schedule?

9. **Write the report** in the shape below. Name it `reports/liquid-glass-audit.md` unless
   the user asks otherwise.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information, a
missing section is a hole. The sections are fixed; this style supplies the rows.

1. **Summary** — a two-column table: Style and plugin version; Scope; Framework / styling
   system with detection confidence; Dark mode (media / class / both); Variant in use
   (Regular / Clear / both); whether the backdrop is project-controlled; the highest tier
   actually reachable in the project's target browsers; Findings by severity; Verdict
   (**PASS** / **PASS WITH FINDINGS** / **FAIL**). Then one paragraph naming the single most
   important finding.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   One row per text token **per extreme**: two ratios each, composited at backdrop luminance
   0 and at 255, three decimal places, unrounded — 2.999:1 fails 3:1. Auto-correction reads
   "none — audit only". Where the backdrop is uncontrolled the worst case is the whole sRGB
   cube and the row says "unmeasurable" with the reason rather than a guess. The rim against
   its backdrop is always one of the rows, and so is the focus ring at both extremes.

3. **Checklist** — two tables, universal first, both `Check | Verdict | Failing selector /
   note`. The universal table has exactly nine rows: text contrast (1.4.3), non-text
   contrast (1.4.11), focus visible (2.4.7 / 2.4.13), target size (2.5.8), forced colors,
   reduced motion, reduced transparency, colour-only encoding (1.4.1), DOM order (1.3.2).
   The style table is `references/checklist.md` row for row, plus two matrices this style
   adds:
   - **Tier coverage** — per surface: Tier 2 present and gated, Tier 1, Tier 0, the
     `-webkit-` twin on every declaration including the nulling ones, and each of
     `prefers-reduced-transparency`, `prefers-contrast`, `forced-colors`,
     `prefers-reduced-motion`, `@media print` and the `[data-transparency]` hook.
   - **Nesting** — every candidate the scanner found, with selector or component, file,
     line, and your adjudication of whether the inner surface can actually be a descendant.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`: glass surfaces in viewport;
   refracting surfaces; estimated glass area as a percentage of viewport; maximum blur
   radius; estimated GPU texture memory; displacement map bytes and whether they are inlined;
   frame-time contribution; INP regression against the opaque baseline.

5. **Corrections** — empty by construction; this skill changes nothing. Write "None." and
   put the recommended fixes here as a `Finding | File and selector | Fix` table, ordered by
   severity, each pointing at the anti-pattern it matches.

6. **Refusals** — "None." An audit refuses nothing.

7. **Manual TODOs** — a checkbox list naming the *method*, not the concern. For this style
   it always includes at least these three, because none is computable from source text:
   screenshot the composited pixels at three scroll positions over a deliberately hostile
   backdrop — a high-contrast checkerboard photo, not the project's hand-picked marketing
   gradient — and sample them; verify the triple-ring focus indicator over black, over white
   and over a saturated photo; and measure frame time on a mid-tier device through a 1000px
   scroll with the chrome pinned.

## Output

- `reports/liquid-glass-audit.md` — or stdout if the user asked for a review rather than a
  file. Nothing else is written.

Every finding carries: the file, the exact selector or call site, the computed value where
there is one (three decimal places, unrounded), the criterion it fails, and the fix. A
finding without a selector is not a finding, it is a feeling.

## Severity, so the report is actionable rather than a list

- **Fail** — nested glass confirmed; a fill alpha below 0.55, or below 0.62 on an
  uncontrolled backdrop; a contrast pair below the floor at either extreme; a translucent
  fill with no Tier 0 fallback; refraction with no `@supports` gate; a `backdrop-filter`
  with no `-webkit-` twin; live blur inside `forced-colors: active`; a Clear surface with no
  scrim; a missing or single-ring focus indicator; a target below 24×24; a displacement map
  fetched rather than inlined; a preference query overridden.
- **Risk** — inside the letter of the rules but a bet on the backdrop: an uncontrolled
  backdrop at any alpha; glass over user media; blur or surface count over budget; the
  specular sweep carrying a state; `will-change` left on permanently; no device gate; no
  in-app transparency control on a product with an Apple-heavy audience.
- **Note** — style-fidelity findings that are not compliance findings: blur without
  `saturate()`; saturation under 140%, where the material reads as fog; a refraction `scale`
  outside the 30-70 band for a control of that height; missing chromatic fringing, which is
  the usual tell that a web clone is a clone; a uniform fill across all three elevation
  rungs; radii that are not concentric with the window corner.

Do not upgrade a Note to a Fail to make the report look decisive, and do not soften a Fail
because the design is otherwise good. The severity is the useful part.

One verdict rule specific to this style. **A blur-only implementation is not a failing
Liquid Glass implementation — it is a passing glassmorphism implementation with the wrong
name on it.** If no surface refracts, say so in the Summary, audit it against what it
actually is, record the naming as a finding, and point at `glassmorphism-ui:audit` for the
rest.
