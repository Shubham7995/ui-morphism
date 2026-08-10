# `<Style>` audit — `<scope>`

<!--
  The shared ui-morphism audit report. Source: docs/MARKETPLACE.md §7.5.

  The seven sections below are fixed, and they appear in this order in every
  report from every style plugin. That is the whole point: a user who runs
  minimalism-ui:audit and then brutalism-ui:audit can diff the two files, and a
  future "compare three styles on this codebase" workflow is a text diff rather
  than a parsing exercise.

  A style plugin supplies the ROWS. It does not add, remove or reorder the
  SECTIONS. Where a section does not apply, write "None." — an empty section is
  information, a missing section is a hole.

  Replace every <angle-bracketed> placeholder. Delete these comments.
-->

## 1. Summary

| | |
|---|---|
| **Style** | `<style>` v`<plugin version>` |
| **Intensity** | `<effective>` (requested `<requested>`, capped by `<context>`) |
| **Scope** | `<glob list>` |
| **Framework** | `<framework>` / `<styling>` — detected `<confidence>`, confirmed by user `<yes/no>` |
| **Dark mode** | `<media / class / both>` |
| **Files changed** | `<n>` written, `<n>` modified, `<n>` refused |
| **Verdict** | **`<PASS / PASS WITH CORRECTIONS / FAIL>`** |

`<One paragraph: what was applied, to what, and the single most important thing
the reader needs to know before looking at the numbers.>`

## 2. Contrast

Every ratio is WCAG 2.x relative luminance, computed by `ui-morphism-core:a11y-validate`, shown to **three decimal places and unrounded**. A value is never rounded up to meet a threshold: 2.999 fails 3, and 4.497 fails 4.5. Translucent surfaces are composited **per channel in gamma-encoded sRGB** against the stated backdrop, never by averaging luminances.

| Pair | Backdrop | Ratio | Required | Verdict | Auto-correction |
|---|---|---|---|---|---|
| `<fg token>` on `<bg token>` | `<opaque / worst-case / #hex>` | `<0.000>` | `<4.5 / 3>` | `<pass / FAIL>` | `<none / darkened to #xxxxxx>` |

`<For any style that emits a translucent surface, state the worst-case backdrop
used and why it is the worst case. For a fill over a ground the style does not
own, the worst case is the whole sRGB cube, and the answer comes from
worstCaseRatio(), not from the design mock's background.>`

## 3. Checklist

### Universal — the nine checks in `docs/MARKETPLACE.md` §7.3

| Check | Verdict | Failing selector / note |
|---|---|---|
| Text contrast (1.4.3) | `<pass / fail / n-a>` | |
| Non-text contrast (1.4.11) | | |
| Focus visible (2.4.7 / 2.4.13) | | |
| Target size (2.5.8) | | |
| Forced colors | | |
| Reduced motion | | |
| Reduced transparency | | |
| Colour-only encoding (1.4.1) | | |
| DOM order (1.3.2) | | |

### Style-specific — from `<style>`'s own checklist

| Check | Verdict | Failing selector / note |
|---|---|---|

## 4. Budgets

The numbers this style cares about, against its own doc §8 budget. A row is only here if the style's doc sets a number for it.

| Budget | Measured | Limit | Verdict |
|---|---|---|---|
| `<shadow layers per element>` | | | |
| `<blurred viewport percentage>` | | | |
| `<CSS bytes (raw / gzip)>` | | | |
| `<font bytes>` | | | |
| `<image bytes>` | | | |

## 5. Corrections

Every token the skill changed on its own initiative, with before, after and the reason. A correction that is not listed here did not happen as far as the reader is concerned.

| Token | Before | After | Reason |
|---|---|---|---|

Clamps and context caps go here too, including the case where nothing visible changed:

- `<Intensity capped from 90 to 45 because surfaceType is app-accent (contract rule 5).>`
- `<fillAlpha clamped to its 0.55 floor at intensity 100 (contract rule 4).>`

## 6. Refusals

Every anti-pattern requested and declined, with the reason and the alternative offered. If nothing was refused, write "None." — do not delete the section.

| Requested | Refused because | Offered instead |
|---|---|---|

## 7. Manual TODOs

What the skill could not verify statically, and what a human has to do about it. Be specific about the *method*, not just the concern.

- [ ] `<Screenshot the composited pixels of the glass header at three scroll
      positions and sample. Static analysis cannot see what backdrop-filter
      sampled, so the contrast rows above are worst-case bounds, not
      measurements of your actual page.>`
- [ ] `<Measure the axis-aligned bounding box of every rotated sticker after
      transform. The 24x24 floor applies to the transformed box.>`
- [ ] `<Test in Windows High Contrast. The forced-colors block is present and
      structurally correct; whether it looks right is not computable.>`
