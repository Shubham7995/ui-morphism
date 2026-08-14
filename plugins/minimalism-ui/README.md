# minimalism-ui

Minimalist restyling as a Claude Code plugin. Monochrome neutrals plus one accent,
hairline borders instead of shadows, a 4px spacing ramp, a 1.200 type scale — and the
compensating pass that puts back the affordance subtraction deletes.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace.
Research source: [`docs/05-minimalism.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/05-minimalism.md),
last researched 2026-08-08.

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install minimalism-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does | Writes files |
|---|---|---|
| `minimalism-ui:apply` | Collapses the palette, quantises radius, spacing, type and motion onto the doc's ramps, reduces elevation to three named rungs, strips decoration, runs the affordance-restoration pass, validates, and reports | yes |
| `minimalism-ui:audit` | Reviews an existing minimalist implementation against the checklist and writes a report | no — `Read`, `Glob`, `Grep`, plus the scanner in `--no-fail` mode |

## The one move

Subtraction with compensation. Delete the box, the gradient, the shadow and the divider;
buy the structure back with whitespace, type scale and a single accent hue.

```css
.min-card {
  background: var(--min-surface-1);
  border: 1px solid var(--min-border-subtle);   /* decorative — 1.2:1, separators only */
  border-radius: var(--min-radius-lg);
  box-shadow: var(--min-shadow-0);              /* none. Elevation 0 is a named rung. */
}
.min-btn {
  border: 1px solid var(--min-border-strong);   /* #8F8F8F — 3.23:1, a real boundary */
  min-height: var(--min-control-lg);            /* 40px resting */
  min-width: var(--min-target-min);             /* 24px SC 2.5.8 floor, from the token */
}
```

Those two border tokens look interchangeable and are not. That single distinction is
most of this plugin.

## What makes this plugin different from the other nine

**It is the only one that is mostly subtractive, and the only one whose main job is to
add things back.** Every other style in this set fails by adding something wrong. This
one fails by removing something necessary: a control's boundary, a link's underline, a
field's label, a focus ring, a target's size. Doc §1 says it in one line — *stripping
signifiers off a control does not make the control simpler; it makes it invisible.*

So `apply` runs an **affordance-restoration pass** at every intensity, in every scope,
unconditionally. It converts ghost primary buttons to filled, raises control boundaries
below 3:1 to `--min-border-strong`, restores hover underlines, adds `:focus-visible`
rings, pads icon-only targets up to `--min-target-min`, and refuses to delete a label,
help text, an error message, a required-field marker or a `<legend>` under any
circumstances. That pass gets its own sub-table in the audit report, because in this
style it is the point of the run rather than an appendix to it.

## What this plugin gets right that the ecosystem does not

- **The two borders.** `--min-border-subtle` is 1.2:1 and decorative — legal between two
  rows, and a WCAG 1.4.11 failure the moment it is the edge of an input or a secondary
  button. The 1.4.11 boundary on white is `#949494` at 3.03:1, so the ubiquitous
  `#E5E5E5` hairline at 1.26:1 can never be a control's only affordance.
  `--min-border-strong` (`#8F8F8F`, 3.23:1) clears it with margin, and this plugin
  asserts the distinction in both the apply and audit paths, in both themes.
- **The lightest legal grey.** `#737373` is 4.74:1 on white. `#999999` is 2.85:1 and
  `#AAAAAA` is 2.32:1 — anything in that band presented as "secondary text" is a defect,
  and it is the single most common one in the style.
- **The inverted knob.** `affordanceFloor` goes **up** as intensity goes up, and clamps
  at 40 rather than 0. Aggressive minimalism increases the risk of lost affordance, so
  the skill compensates rather than compounds. Intensity 0 is not "no minimalism" — it is
  a conventional interface with its affordances intact, one that has not yet been
  subtracted from.
- **Context caps that raise the floor rather than lower it.** Doc §9 rules the style out
  for novice audiences and safety-critical surfaces. Both cap intensity at 0 *and* clamp
  `affordanceFloor` to 100 in the same breath, because a cap alone would move the
  inverted knob the wrong way and delete signifiers from exactly the audience that needs
  the most.
- **The declared zero.** `--min-backdrop-blur: 0px` and `--min-backdrop-saturate: 1` are
  written out rather than omitted. Declaring the zero is the contract that separates this
  style from glassmorphism, and it is what makes "no blur anywhere" checkable.

## Intensity

One number, 0-100, default 60, mapped onto five knobs. Resolved table at every five
points in `skills/apply/references/tokens.md` §4.

| Knob | 0 | 50 | 100 | Default (60) |
|---|---|---|---|---|
| `chromaBudget` | 0.06 | 0.027 | 0.00 | 0.020 |
| `decorationBudget` | 3 rungs | 1 rung | 0 rungs | 1 rung |
| `whitespaceMultiplier` | 0.75× | 0.96× | 2.00× | 1.00× |
| `typeContrast` | 1.414 | 1.236 | 1.125 | 1.200 |
| `affordanceFloor` | 40 | 50 | 100 | 60 |

Three knobs carry a paired curve — `accentCoveragePct`, `shadowOpacityMax` and
`gradientsAllowed` sit beside their parents. Three carry an anchor at the default
intensity that a straight line cannot reach, each because a linear reading would
contradict the doc at the one value most users never change: a linear `chromaBudget`
resolves to 0.024 against §3's stated 0.02 ceiling, a linear `whitespaceMultiplier` ships
a 144px section gap against §3's stated 64–96px rhythm, and a linear `typeContrast`
generates a 1.241 ratio the doc does not ship against §4's stated 1.200. The reasoning is
recorded in `assets/intensity.contract.json` next to each anchor.

## What it delegates to `ui-morphism-core`

| Concern | Skill |
|---|---|
| Framework and styling-system detection | `ui-morphism-core:detect-stack` |
| Token grammar, emitters, dark-mode emission shape, Tailwind mapping | `ui-morphism-core:token-emit` |
| All nine universal accessibility checks, including every contrast computation | `ui-morphism-core:a11y-validate` |
| Intensity contract, clamp mechanism, context caps | core contract |
| Audit report section order | marketplace convention, reproduced in full in each skill |
| Refusal protocol — refuse, explain, offer the alternative | core contract |

This plugin owns the token *values*, the intensity curves and clamp values, component
emission, the style-specific invariants, the budget rows, the quantisation rules and the
anti-pattern list. It contains no contrast function. There is exactly one of those, and it
is core's.

## The bundled scanner

`skills/apply/scripts/quantize-scan.mjs` is a dependency-free Node script that does the
two things prose cannot: a quantisation two runs agree on, and a **count**.

```
node skills/apply/scripts/quantize-scan.mjs src --json --decoration-budget=1
node --test "skills/apply/scripts/*.test.mjs"   # 50 tests, including the doc's own §5 recipe
```

It returns three classes of finding — `quantise` (a value off one of §4's ramps, with the
rung it snaps to), `subtract` (the decoration §13 step 6 removes) and `restore` (the
compensating pass) — plus the palette census and the ramp-collapse counts that
`reports/minimalism-diff-summary.md` is specified to carry. "Font sizes collapsed from N
to 9" needs an N, and N is a measurement of the user's codebase, not a number a model can
estimate by reading it.

It deliberately computes **no** contrast, luminance, alpha compositing, focus, target-size
or forced-colors verdict. Those are the nine universal checks and they live in
`ui-morphism-core:a11y-validate` — one implementation, ten callers. Where the scanner
touches a colour it is sorting or counting it, never judging whether it is legible.

## Layout

```
minimalism-ui/
├── .claude-plugin/plugin.json
├── assets/intensity.contract.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css}
│   │   └── scripts/{quantize-scan.mjs,quantize-scan.test.mjs}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`assets/tokens.css` is byte-identical to doc §4's ready-to-paste `:root` block plus both
dark blocks; CI diffs it in both directions. `assets/tokens.um-aliases.css` bridges the
`--min-*` values onto the shared `--um-minimalism-*` grammar, reading in one direction
only so the verbatim block stays the single place a value is written.

## When not to use it

Doc §9, condensed, because a style plugin that cannot say when to decline is a style
guide with a install command. Not for products that must differentiate on feel in a
crowded consumer market; not for novice, occasional or low-confidence audiences; not for
inherently emotional or expressive domains; not for safety-critical or irreversible
interfaces; not for teams that cannot maintain the discipline, since one off-scale value
is immediately visible in a style with no slack; not for native Apple UI in 2026 that
wants to feel current, because the platform has moved to Liquid Glass; and not where
marketing needs to convey abundance.

## Licence

MIT. See [`LICENSE`](./LICENSE).
