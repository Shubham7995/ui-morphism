# brutalism-ui

Neubrutalist restyling as a Claude Code plugin. Hard 2-4px ink borders, zero-blur
offset shadows, flat saturated fills, chunky display type — and the accessibility work
that the style's reference implementations get wrong.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace.
Research source: [`docs/07-brutalism.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/07-brutalism.md),
last researched 2026-08-08.

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install brutalism-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does | Writes files |
|---|---|---|
| `brutalism-ui:apply` | Emits the token layer, rewrites components to border-first surfaces with the signature hover interaction, writes the three guard blocks, validates, and reports | yes |
| `brutalism-ui:audit` | Reviews an existing neubrutalist implementation against the checklist and writes a report | no — `Read`, `Glob`, `Grep` only |

## The one move

```css
.nb {
  border: 2px solid var(--nb-border);
  border-radius: 0;
  box-shadow: 4px 4px 0 0 var(--nb-border);   /* blur 0. spread 0. no alpha. */
}
.nb:hover {
  transform: translate(4px, 4px);              /* exactly the shadow offset */
  box-shadow: 0 0 0 0 var(--nb-border);
}
```

Everything else in the style hangs off that. The shadow is a solid duplicate of the
element's box, so the surface reads as a paper sticker lifted off the page rather than
as a lit object, and hovering slides it into its own shadow.

## What this plugin gets right that the ecosystem does not

- **The dark-mode border flip.** The most-copied reference library keeps
  `--border: oklch(0% 0 0)` in its dark theme. Pure black against a `#2E2E38`-class
  dark surface is 1.56:1 and fails WCAG 1.4.11 outright. This plugin flips the border
  token to a light ink (`#F5F0E6`, 11.82:1) and asserts it in both the apply and audit
  paths.
- **Border and shadow, never shadow alone.** `forced-colors` mode nulls `box-shadow`,
  which deletes the entire depth language in one step. Borders survive as geometry.
  A control whose only boundary is a shadow is on the refusal list.
- **A real focus outline.** The style's most common bug is `outline: none` plus "the
  shadow is the focus indicator". The shadow is present at rest, so it carries no state
  delta, and forced-colors deletes it. This plugin ships `outline: 3px` at 2px offset,
  additive to the resting shadow.
- **Correct contrast operands.** Every ratio uses `#0A0A0A`, the actual ink token,
  rather than pure `#000000` — a difference of roughly 0.4 to 1.1 ratio points that
  otherwise overstates every accent in the palette.

## Intensity

One number, 0-100, default 60, mapped onto five knobs. Resolved table at every five
points in `skills/apply/references/tokens.md` §4.

| Knob | 0 | 50 | 100 | Default |
|---|---|---|---|---|
| `shadowOffset` | 0px | 4px | 12px | 6px |
| `borderWidth` | 1px | 3px | 5px | 3px |
| `radius` | 12px | 5px | 0px | 4px |
| `chroma` | 35% | 68% | 100% | 74% |
| `tilt` | 0deg | 1.5deg | 3deg | 1.8deg |

`scope: product` caps intensity at 45 and clamps `shadowOffset ≤ 4px`,
`borderWidth ≤ 2px`, `tilt = 0`. Intensity 0 is not nothing: it is a bordered,
unornamented, fully usable control, which is this style's own documented minimalism
fallback.

## What it delegates to `ui-morphism-core`

| Concern | Skill |
|---|---|
| Framework and styling-system detection | `ui-morphism-core:detect-stack` |
| Token grammar, emitters, dark-mode emission shape, Tailwind mapping | `ui-morphism-core:token-emit` |
| All nine universal accessibility checks, including every contrast computation | `ui-morphism-core:a11y-validate` |
| Intensity contract, clamp mechanism, context caps | core contract |
| Audit report template and section order | `ui-morphism-core/assets/report-template.md` |
| Refusal protocol — refuse, explain, offer the alternative | core contract |

This plugin owns the token *values*, the intensity curves and clamp values, component
emission, the style-specific invariants, the budget rows, and the anti-pattern list.
It contains no contrast function. There is exactly one of those, and it is core's.

## Layout

```
brutalism-ui/
├── .claude-plugin/plugin.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   └── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

No `scripts/`, and that is a decision rather than an omission. The three places a
bundled script would earn its keep are all already closed in prose: the five knob
curves are integer arithmetic resolved at every five points in
`skills/apply/references/tokens.md` §4, with the formulas beside the table for the
values in between; the blurred-shadow conversion is a one-line `reach` formula
snapped to a six-element ladder, with four worked examples in §7 of the same file;
and the one piece of colour maths — scaling accent OKLCH chroma with lightness and
hue held — is expressible in CSS relative colour syntax, or delegated to
`ui-morphism-core:token-emit` where that syntax is unavailable. Nothing here reads
or classifies arbitrary content the way a layout skill does. Adding a script would
put a second copy of the doc's numbers in the plugin, which is the drift this whole
set is trying to avoid.

## Licence

MIT. See [`LICENSE`](./LICENSE).
