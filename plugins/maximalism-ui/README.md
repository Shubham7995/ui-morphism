# maximalism-ui

Maximalist restyling as a Claude Code plugin. Three loud layers, clashing saturated colour,
oversized display type, collage stickers and marquees — with the budget, the role-bound
palette and the WCAG 2.2 work that decides whether the result is presence or noise.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace.
Research source: [`docs/06-maximalism.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/06-maximalism.md),
last researched 2026-08-08.

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install maximalism-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does | Writes files |
|---|---|---|
| `maximalism-ui:apply` | Emits the token layer and its role bindings, builds up to three loud layers over an opaque content plane, rewrites components to the maximalist vocabulary, installs the safety layer and the Calm toggle, validates, and reports | yes |
| `maximalism-ui:audit` | Reviews an existing maximalist implementation against the checklist and writes a report | no — `Read`, `Glob`, `Grep` and the scanner |

## The one move

```css
.max-scene {
  position: relative;
  isolation: isolate;               /* contain every blend mode to this scene */
}
/* 1. patterned ground   2. grain    3. one ornament — and never a fourth */
```

Two planes reads as decorated minimalism. Three reads as maximalism. Four is where usability
testing turns, and that is the entire discipline of the style: not restraint in the abstract,
but a hard rule about how many loud layers may compete inside one viewport at one time.

## What this plugin gets right that the ecosystem does not

- **The layer budget is counted, not admired.** Doc §6's cap of three is enforced three ways:
  the `layerCount` knob is hard-capped at 3 at every intensity, the emitted React component
  carries a `loudLayers` guard that warns in development, and
  `skills/apply/scripts/max-scan.mjs` runs a per-scene census and fails the run at four.
- **Accents are role-bound, and the roles flip between themes.** Lime is 16.63:1 on ink and
  1.12:1 on paper. In dark mode the grounds swap, so `--max-text-on-ink` describes text on a
  *cream* surface and every lifted accent is illegal there — not one of them clears 3:1. The
  dark block therefore carries two ramps, and components consume `--max-text-on-paper`,
  `--max-text-on-ink` and `--max-accent-safe` rather than a raw accent. Binding the lifted
  violet to `--max-text-on-ink` gives 2.46:1 on cream, and it looks perfect in light mode.
- **Hit area is measured on the transformed box.** A tilted sticker button hit-tests against
  its axis-aligned bounding box after `rotate`, while the hard offset shadow inflates the box
  the user sees. `--max-target-min` is 44px for that mechanical reason, every control derives
  its minimums from the token rather than a literal, and the re-measurement is a named Manual
  TODO in every report.
- **A Calm mode toggle, because SC 2.2.2 is Level A.** `prefers-reduced-motion` is an
  OS-level, all-or-nothing setting. A user who wants your marquee stopped without disabling
  animation on their whole machine has no other route, so the toggle ships wherever an
  infinite animation does.
- **A hard font budget.** Four families, 180 KB. Doc §8 measures the naive version of this
  style's type at 480-900 KB, and the fix is one variable font with weight and width axes
  rather than six statics.

## Intensity

One number, 0-100, default 60, mapped onto five knobs. Resolved table at every five points in
`skills/apply/references/tokens.md` §4.

| Knob | 0 | 100 | Default (60) |
|---|---|---|---|
| `layerCount` | 1 loud plane | 3 loud planes | 2 |
| `chromaSpread` | 1 accent at chroma 0.10 | 6 accents at chroma 0.30 | 4 accents at 0.22 |
| `shadowStack` | `2px 2px 0` single ink | `4/8/12px` chromatic | 8px |
| `tiltRange` | 0deg | ±5deg | ±3deg |
| `motionLoad` | 0 ambient loops | 3 ambient loops | 1 |

`surfaceType: app-accent` caps intensity at 45 — one loud layer, no ambient motion, no
marquee and no patterned ground on a data surface. **Intensity 0 is not nothing:** it is one
opaque plane with a real border, a single hard shadow, the double focus ring and the 44px
target minimum — a shippable brand card, which is what the doc's own "two planes reads as
decorated minimalism" implies about one.

## What it delegates to `ui-morphism-core`

| Concern | Skill |
|---|---|
| Framework and styling-system detection | `ui-morphism-core:detect-stack` |
| Token grammar, emitters, dark-mode emission shape, Tailwind mapping | `ui-morphism-core:token-emit` |
| All nine universal accessibility checks, including every contrast computation | `ui-morphism-core:a11y-validate` |
| Intensity contract, clamp mechanism, context caps | core contract |
| Audit report section order | marketplace convention, reproduced in full in each skill |
| Refusal protocol — refuse, explain, offer the alternative | core contract |

This plugin owns the token *values*, the intensity curves and clamps, the loud-layer census,
component emission, the style invariants, the budget rows and the anti-pattern list. It
contains no contrast function. There is exactly one of those, and it is core's.

## The bundled scanner

`skills/apply/scripts/max-scan.mjs` is a dependency-free Node script covering the mechanical
half of the checklist: the loud-layer census per scene, raster texture assets, animated
properties outside doc §6's permitted list, infinite animation with no Calm hook, the four
safety blocks, blend modes outside an `isolation: isolate` container, rotation past the 5deg
ceiling, non-zero shadow blur, shadow-only boundaries, absolute ornament surviving below
640px, `order` and `row-reverse`, and the four-family font census.

```
node skills/apply/scripts/max-scan.mjs src --json
node --test "skills/apply/scripts/*.test.mjs"   # 50 tests
```

`scripts/` earns its place here for one reason above the others: **the layer budget is a
counting problem, and prose cannot count.** Nothing in CSS can express "at most three loud
layers in this viewport" — doc §4 says so explicitly and declines to invent a custom property
for it — so the cap survives only where something actually tallies it. The scanner computes
**no** contrast, focus, target-size or forced-colors keyword checks; those are the nine
universal checks and they live in `ui-morphism-core:a11y-validate`. One implementation, ten
callers.

## Layout

```
maximalism-ui/
├── .claude-plugin/plugin.json
├── assets/intensity.contract.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css}
│   │   └── scripts/{max-scan.mjs,max-scan.test.mjs}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`assets/tokens.css` is doc §4's `:root` block byte for byte, including both dark blocks and
both accent ramps. The Tailwind mirror carries the same values under `max-`-prefixed names,
with `@theme` never nested inside an at-rule and the dark overrides outside it.

## When not to use it

Doc §9 gates this style by context rather than by taste, and the plugin repeats the gate. It
reads as confident on a brand page, a campaign page, an editorial layout, a celebration
moment or a creator-facing product. It reads as chaos on a task-oriented app shell, where it
survives only as `surfaceType: app-accent` — one loud surface, capped, with the tables,
charts, forms and checkout steps left alone.

## Provenance

| | |
|---|---|
| Source doc | `docs/06-maximalism.md` §13 |
| Last researched | 2026-08-08 |
| Status in 2026 | mainstream |
| Accessibility risk | high |
| Performance cost | high |

## Licence

MIT. See [`LICENSE`](./LICENSE).
