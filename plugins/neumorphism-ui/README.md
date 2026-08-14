# neumorphism-ui

Same-hue soft-extrusion restyling as a Claude Code plugin. Mirrored dual shadows at
`blur = 2 × distance`, raised and pressed rungs, one global light source — and the one
thing the style's own reference implementations get wrong, which is that none of it can
be the boundary of a control.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace.
Research source: [`docs/02-neumorphism.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/02-neumorphism.md),
last researched 2026-08-08.

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install neumorphism-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does | Writes files |
|---|---|---|
| `neumorphism-ui:apply` | Emits the token layer, rewrites controls to extruded and pressed surfaces with a real hairline on every one, writes the four guard blocks, scans, validates, and reports | yes |
| `neumorphism-ui:audit` | Reviews an existing neumorphic implementation against the checklist and writes a report | no — `Read`, `Glob`, `Grep` and the scanner in `--no-fail` mode |

## The one move

```css
.nm {
  background: var(--nm-surface);            /* identical to the parent's */
  border-radius: var(--nm-r-card);
  box-shadow:
     8px  8px 16px var(--nm-shadow-dark),   /* cast shadow  */
    -8px -8px 16px var(--nm-shadow-light);  /* rim highlight */
}
.nm:active {
  box-shadow:                                /* 0.6 × the raised distance */
    inset 5px 5px 10px var(--nm-shadow-dark),
    inset -5px -5px 10px var(--nm-shadow-light);
}
```

Two shadow layers, equal blur, mirrored offsets, spread 0, one light source. Everything
else in the style — the large radii, the mid-tone greys, the generous padding, the absent
borders — is downstream of that one decision.

## The refusal

**The central move of neumorphism cannot be made accessible.** This is not an
implementation problem and no setting fixes it.

The element's fill is the same colour as its parent by construction, so the pair that
describes its geometry is measured against its own surface: `#ffffff` on `#e6e7ee` is
**1.23:1**, `#b8b9be` on it is **1.59:1**, and in dark mode `#17191f` on `#2a2e39` is
**1.30:1** and `#3d4353` is **1.37:1**. The generator's own default pair is **1.32:1** and
**1.41:1**. WCAG SC 1.4.11 requires **3:1**. Every neumorphic shadow pair in normal use
lands between **1.2:1** and **1.7:1** — roughly half of what is required, in every
direction, at every setting. To clear 3:1 on `#e6e7ee` a boundary has to be at or below
`#848484` (**3.03:1**); `#858585` is the first grey that fails, at **2.99:1**. A grey that
dark against that surface is not a shadow, it is a border.

**And then forced-colors deletes the shadow entirely.** In Windows High Contrast Mode the
user agent forces `box-shadow: none`. Since 100% of this style's structure is
`box-shadow`, 100% of it disappears — every control becomes an unbordered rectangle of
`Canvas` on `Canvas` — and that includes any focus ring built from `box-shadow`.

So this plugin **refuses to ship a same-hue-only boundary**, in every mode, at every
intensity, for every request, including an explicit one. What it ships instead is the 2026
vocabulary the research records as the only version that ships: **clean neumorphism** — a
real `--nm-hairline` border at **3.20:1** light and **3.31:1** dark, a real accent carrying
state, and the extrusion kept as decoration on top. The refusal is stated to the user in
plain words, not buried in a report section: the sentence is in
[`skills/apply/references/anti-patterns.md`](./skills/apply/references/anti-patterns.md)
§0, which is the most important file in this plugin.

## What this plugin gets right that the ecosystem does not

- **The hairline is not optional.** Every generator, every component library and every
  Dribbble shot in this style ships a borderless control. This plugin adds
  `border: 1px solid var(--nm-hairline)` to every interactive element as a non-optional
  emission step, and `a11yMode: strict` — the default — refuses output that does not have
  one.
- **Focus is an `outline`, never a `box-shadow`.** The element already carries a shadow at
  rest, so a shadow-shaped ring adds no state delta, and forced-colors deletes it anyway.
  The floor is `outline: 3px` at `outline-offset: 3px`, above SC 2.4.13's minimum, because
  the ring has to clear the blurred halo rather than sit inside it.
- **A dark mode whose extrusion is still visible.** The original algorithm is
  multiplicative, so `#2a2e39 × 0.15` moves red by six levels and the effect vanishes into
  the base colour. The dark ramp is re-derived rather than reused, and the `0.8 / 1.4`
  highlight-shadow asymmetry inverts to `1.4 / 0.8`.
- **Reduced motion keeps the state change.** Only durations are zeroed. A reduced-motion
  user who loses press feedback has lost information, not decoration.
- **Every contrast figure is the research's.** This plugin computes no ratio anywhere;
  `ui-morphism-core:a11y-validate` is the single implementation in the marketplace.

## Intensity

One number, 0–100, default **45**, mapped onto five knobs. Resolved table at every five
points in [`skills/apply/references/tokens.md`](./skills/apply/references/tokens.md) §4.

| Knob | 0 | 45 (default) | 100 |
|---|---|---|---|
| `shadowDelta` | 0.03 | 0.075 | 0.14 light / 0.20 dark |
| `distance` | 2px | 5px | 20px |
| `radius` | 6px | 14px | 999px (pill) |
| `hairlineOpacity` | 0.55 | 1.0 | 1.0 |
| `coverage` | 0.05 | 0.35 | 1.0 |

`contentDensity: dense` caps intensity at 0; `a11yMode: strict` pins `hairlineOpacity` to
1.0; a list or grid item clamps `distance` to 8px and anything inside a scroller to 12px,
because blur is always twice the distance and the budgets are set on blur.

**Intensity 0 is not nothing.** It is a flat, bordered, fully usable control — the hairline
at 3.20:1, ink at 9.59:1, a 3px accent outline at 3px offset, a 44px target — with the
extrusion dialled out rather than the structure removed. It is also exactly what every
forced-colors user sees, which makes it the one rung guaranteed to be tested.

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
emission, the style-specific invariants, the budget rows, and the anti-pattern list. It
contains no contrast function. There is exactly one of those, and it is core's.

## Layout

```
neumorphism-ui/
├── .claude-plugin/plugin.json
├── assets/intensity.contract.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css}
│   │   └── scripts/{neu-scan.mjs,neu-scan.test.mjs}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`skills/apply/assets/tokens.css` is byte-identical to §4 of the research doc below its
header comment, and CI diffs it in both directions.

## The scanner

`skills/apply/scripts/neu-scan.mjs` runs the mechanical half of the style checklist:

```
node skills/apply/scripts/neu-scan.mjs <paths> [--json] [--quiet] [--no-fail]
```

It reports a control whose only boundary is the pair; `blur / distance` outside
`[1.5, 3.0]` and any non-zero spread; the two-layer and 40 / 24 / 16px blur ceilings; both
shadow axes in one document; `box-shadow` focus rings and outlines under the 3px / 3px
floor; a `forced-colors` block that nulls the shadow without restoring a border, and a
missing one altogether; a reduced-motion block that removes a state carrier rather than a
duration; a fill that is not the page ground; a pressed rung off `0.6 ×` its raised
counterpart; sub-44px targets, fixed heights, the sibling gap, `will-change` on a paint
property; the surface census; and a dark palette declared in only one of the two required
places.

It computes no contrast, no relative luminance and no alpha compositing, by design — those
are the nine universal checks and they belong to `ui-morphism-core:a11y-validate`. It
knows two things it cannot decide and says so rather than guessing: which end of a shadow
axis the light sits at, because that is a colour comparison it does not make, and whether
an element's computed parent really shares its fill, because that needs a rendered tree.

Tests: `node --test "skills/apply/scripts/*.test.mjs"` — 47 cases, each one a line from
§13's validation checklist or its anti-pattern list.

## Licence

MIT. See [`LICENSE`](./LICENSE).
