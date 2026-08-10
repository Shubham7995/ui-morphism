---
name: a11y-validate
description: >-
  Use for the one measurement general accessibility tooling skips or gets wrong:
  worst-case COMPOSITED contrast over a translucent surface, solved per channel in
  gamma-encoded sRGB — what a glass or scrim panel actually measures over a ground
  the style does not own, the minimum alpha that clears a target, and why an
  automated contrast checker disagrees. Its contract is internal: a ui-morphism
  style skill calls it on the token set that skill just emitted, as the validation
  step of applying or auditing one NAMED style, and no style skill implements its
  own contrast maths. Over that emitted CSS it also runs the nine checks the ten
  styles share, and it answers a direct question about a specific colour pair or a
  stated alpha. This is NOT a general accessibility sweep and NOT a page audit: it
  reads CSS text and cannot see the rendered DOM, the accessibility tree, names,
  roles, focus order or live composited pixels. Hand "audit my site accessibility",
  "is this page accessible", "run an a11y check" and "check WCAG compliance" to a
  live-DOM accessibility auditor — one that drives a real browser and inspects the
  rendered tree answers those better and should win them. Read-only: it measures
  and reports, it never edits.
argument-hint: "[css glob] [--fail-on=fail|warn]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/contrast.mjs *)
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/audit-css.mjs *)
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/budget.mjs *)
license: MIT
metadata:
  sourceDoc: docs/MARKETPLACE.md
  docSection: "7.3"
  contrastReference: docs/check-contrast.py
  lastResearched: "2026-08-09"
---

# Accessibility validator

One implementation, ten callers. The contrast function is the single most-repeated piece of logic across all ten style specs and the single easiest to get subtly wrong, so it lives here and nowhere else.

## Three rules that are not negotiable

**1. Comparison is unrounded.** The W3C states a value is never rounded up to meet a threshold, so 2.999:1 fails 3:1 and 4.497:1 fails 4.5:1. `passes(ratio, required)` has no tolerance parameter and adding one would be a defect, not a convenience. Report ratios to three decimal places.

**2. Alpha composites per channel in gamma-encoded sRGB.** `C = a*C_fill + (1-a)*C_backdrop` on each of R, G and B, and only then linearise and reduce to a luminance. Averaging the two luminances is a different and consistently optimistic model: doc 10 §7 records it claiming 4.52:1 for a pair that measures 1.50:1. Never write `L = a*L_fill + (1-a)*L_backdrop`.

**3. A surface over a ground the style does not own is measured against the worst case,** not against the design mock's background. White text on the same `rgba(255,255,255,0.12)` panel measures 14.596:1 when that panel composites over `#0B0B12` and 1.569:1 when it composites over `#7DD3FC`. Use `worst-case`, and say in the report that the number is a bound rather than a measurement of the user's page.

## The nine universal checks

Identical logic for all ten styles. Style-specific invariants stay in the style plugin's own `references/checklist.md`, because they encode style facts rather than accessibility facts.

| Check | Rule |
|---|---|
| Text contrast (1.4.3) | ≥ 4.5:1 normal, ≥ 3:1 for ≥ 24px or ≥ 18.66px bold. Unrounded. |
| Non-text contrast (1.4.11) | Every control boundary ≥ 3:1 against both its fill and its surroundings, **in both themes**. |
| Focus (2.4.7, 2.4.13) | A `:focus-visible` rule on every focusable element, using `outline` not `box-shadow`, ≥ 2px, with an offset, ≥ 3:1, and no surviving `outline: none` without a replacement in the same rule. |
| Target size (2.5.8) | ≥ 24×24 CSS px hard floor; warn below 44×44; re-measure the axis-aligned bounding box after any `rotate`. |
| Forced colors | A `@media (forced-colors: active)` block exists, uses system colour keywords, gives every shadow-bounded element a real border, hides decorative pseudo-elements, and carries no `forced-color-adjust: none` on a text-bearing element. |
| Reduced motion | A `prefers-reduced-motion: reduce` block exists, zeroes durations, and — separately — removes no state-carrying property. |
| Reduced transparency | Required for any style emitting `backdrop-filter`, **plus an in-app toggle**, because Safari does not implement the media query. |
| Colour-only encoding (1.4.1) | No state, error, selection or category conveyed by colour, depth, blur or shadow alone. |
| DOM order (1.3.2) | Warn on `order`, `*-reverse`, `grid-auto-flow: dense` or absolute positioning applied to sequential content. |

## Procedure

1. **Establish scope.** Which stylesheets, and which pairs. If the caller is a style skill, that is the set it just emitted plus the components it rewrote.
2. **Run the sheet audit.**
   ```bash
   node ${CLAUDE_SKILL_DIR}/scripts/audit-css.mjs tokens/*.css styles/*.css --format=md
   ```
   Markdown is the default because the output lands directly in §3 of the audit report. `--format=json` when a skill needs to branch on the result; `--fail-on=warn` for a stricter gate. Exit status is 1 when anything at or above the threshold is found.
3. **Measure any pair the sheet audit could not resolve.** A colour whose background comes from an ancestor is not computable from CSS text, and the audit reports it as a `todo` rather than a pass.
   ```bash
   node ${CLAUDE_SKILL_DIR}/scripts/contrast.mjs ratio "#0A0A0A" "#FFDC58" --target=4.5
   ```
4. **For every translucent surface, use the worst-case path.** Never `ratio` on a composited surface with a made-up backdrop.
   ```bash
   node ${CLAUDE_SKILL_DIR}/scripts/contrast.mjs worst-case "rgba(20,22,28,0.72)" "#F5F6FA" --target=4.5
   node ${CLAUDE_SKILL_DIR}/scripts/contrast.mjs solve-alpha "#14161C" "#F5F6FA" --target=4.5
   ```
   `solve-alpha` returns the exact crossing plus `ceil2`, the lowest two-decimal alpha that still clears it. Pass `--backdrop=#f5f5f7` when the ground genuinely is known — a hairline over a known tile, a scrim over a known page. Over a known backdrop whose luminance sits on the far side of the foreground from the fill's there is no single minimum: the composite passes through the text on its way from ground to fill, the ratio falls to 1:1 there and rises again. That answer comes back flagged `nonMonotone` with the interval of alphas that MISS the target, and it is reported as an interval — never quoted as a minimum.
5. **Count the budgets.**
   ```bash
   node ${CLAUDE_SKILL_DIR}/scripts/budget.mjs tokens/*.css --budget=budget.json
   ```
   The limits file comes from the calling style's own doc §8. This skill has no numbers of its own, so a counter with no limit is reported and not judged.
6. **Solve the correction; hand the edit back to the caller.** This skill's `allowed-tools` are read-only, so it computes the fix rather than writing it — the darker `ink`, the `border-strong` that clears 3:1, the alpha that clears the target — names the file and the token, and returns it to the style skill that called it. That skill applies it and re-runs step 2. A correction that is not written into §5 of the report did not happen as far as the reader is concerned.
7. **Write §2, §3, §4 and §7 of the audit report** using `${CLAUDE_PLUGIN_ROOT}/assets/report-template.md`.

## What this skill cannot know, and must say so

Static analysis of CSS text cannot see:

- **What a `backdrop-filter` actually sampled.** Axe, Lighthouse and Figma's contrast plugins all compute against the declared `background-color` and are wrong about glass for the same reason. The worst-case number is a bound; the real page needs a screenshot at three scroll positions with the composited pixels sampled.
- **Computed target size after a transform.** A rotated sticker hit-tests against its transformed box.
- **Whether reordered content is sequential.** A decorative dense grid is fine; a dense grid of links is a 1.3.2 failure. Only a human knows which one it is.

Every one of these is emitted as a `todo` finding whose message names the measurement. None of them is ever emitted as silence, and none is ever estimated into a number — an estimated accessibility figure in a report is worse than an absent one, because it gets quoted.

## Refuse

- Do not report a rounded ratio as passing. "4.5:1" for a pair measuring 4.497 is the defect this whole toolchain exists to prevent.
- Do not measure a translucent operand against an invented backdrop. `contrastRatio` throws on a translucent operand on purpose; the escape hatch has to be asked for by name.
- Do not convert `oklch()`, `lab()` or `color-mix()` by guessing. Resolve them to sRGB first, or report them as unresolvable.
- Do not accept a `box-shadow` as a focus indicator. Forced colors deletes it.
- Do not mark a check as passing because the sheet has no relevant rules. A sheet with no `:focus-visible` and a styled `button` fails the focus check; it does not skip it.
