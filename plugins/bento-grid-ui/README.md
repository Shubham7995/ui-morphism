# Bento Grid UI

Asymmetric modular tile layouts for Claude Code — Apple-style feature grids, dashboards,
portfolio indexes and overview screens, with spans assigned by content weight, a locked gutter,
correct reading order and concentric media radii.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace. Source of
truth for every value this plugin emits is
[`docs/09-bento-grid.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/09-bento-grid.md).

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install bento-grid-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does |
|---|---|
| `/bento-grid-ui:apply` | Classifies the existing content, assigns spans by content weight, plans the placement, emits the token layer, the `@layer bento` stylesheet and the `BentoGrid` / `BentoTile` components, hardens the media, and validates the result. Writes files. |
| `/bento-grid-ui:audit` | Reviews an existing bento or tile grid and writes `bento-audit.md`. Reads only; changes nothing. |

## Why this plugin is the odd one out

The other style plugins in this marketplace restyle surfaces. This one **restructures markup and
layout**. It reads existing content, classifies each item, assigns a span, rewrites DOM order,
adds intrinsic media dimensions, and barely touches colour. If the shared architecture — core's
framework detection, token grammar, contrast validator, intensity contract, report shape —
survives a skill that is mostly about `grid-column` and heading levels, it will survive the rest.

It also surfaces the hardest accessibility problem in the set that is not about contrast.
`grid-auto-flow: dense` pulls later tiles into earlier holes, so visual order stops matching DOM
order; tab order follows DOM and focus jumps around the composition. The CSS Grid spec calls
placement-based logical reordering *non-conforming*, not merely unfortunate. `reading-flow: grid-rows`
fixes it and shipped in Chrome 137 on 27 May 2025 — but it is not Baseline, with no Safari or
Firefox implementation as of August 2026, so it is enhancement layered on a DOM order that must
already be correct. Everything this plugin does about placement follows from that.

## What it emits

- `tokens/bento.css` and, for Tailwind v4, `tokens/bento.theme.css`
- `styles/bento.layer.css` — `@layer bento` with the grid, the five spans, the type scale, the
  media rules, the container-query interior, the responsive collapse, the focus ring, and the
  `prefers-reduced-motion` and `forced-colors` blocks
- `components/BentoGrid.*` and `components/BentoTile.*` with the span union closed, so the
  compiler rejects an invented size
- the rewritten section markup, DOM order equal to reading order
- `reports/bento-audit.md` — a per-tile table (span, content type, contrast, image weight,
  alt-text status, link count) plus a pass/fail line per checklist item

## Intensity

One number, 0–100, **default 45**, mapped onto five knobs: `spanVariance` 1.0→3.0,
`radius` 0→32px, `surfaceDelta` 0→24 luminance points, `mediaBleed` 0→100%, `motion` 0→100.
Every knob is monotone across the range and the test suite asserts it at every integer step.

The default is the lowest in the marketplace alongside neumorphism, for the opposite reason:
span variance above about 2.0 stops reading as a grid and starts reading as a collage.

**Intensity 0 is a uniform card grid, not nothing** — one span, square corners, tile background
equal to the page, media fully inset, no motion. The skill then tells you plainly that a uniform
grid is a card grid rather than a bento, and offers the simpler layout.

**Intensity 100 still has to pass the accessibility floor.** If it cannot, the skill clamps and
records the clamp. Hard clamps do not move with intensity at all: five distinct spans, one
dominant tile, one gutter value, `minmax(…, auto)` rows, a 0.45/0.35 interactive border alpha, a
`rgba(0,0,0,0.55)` scrim floor, 24/44px targets, a 400ms reveal budget, one link and one heading
per tile.

Four context caps override intensity outright — comparable content and fewer than four tiles cap
to 0, a CMS-driven tile list caps to 25, more than nine tiles caps to 45. Full curve table,
clamps and caps: `skills/apply/SKILL.md`.

## What it will refuse

Twelve anti-patterns from the research doc's §13, each with a detection signal and an
alternative — the full list is in `skills/apply/references/anti-patterns.md`. The most common:
`grid-auto-flow: dense` over focusable tiles with no guard; a card wrapped entirely in one `<a>`,
or two links under a full-tile overlay; text on a photograph with no scrim; `backdrop-filter` on
more than one element in the section; `role="grid"` on a marketing page; transitions on `width`,
`height`, `gap` or `grid-template-*`; uniform spans presented as a bento; more than nine tiles
with no hierarchy break; and dropping a tile when its data is empty instead of emitting an empty
state that preserves the span.

It also refuses the pattern outright for sequential, long-form and strictly comparable content,
because §9 says bento does not apply there and applying it anyway is a worse outcome than any
styling error.

## The bundled planner

`skills/apply/scripts/assign-spans.mjs` is a dependency-free Node script that owns the
composition arithmetic: intensity → knobs → span band, content type and weight → the closed
five-span vocabulary, sparse placement in DOM order, pixel geometry, `grid-template-areas` for
all three breakpoints, and the §13 checks that are decidable from the plan alone.

```
node skills/apply/scripts/assign-spans.mjs section.json --json
node --test "skills/apply/scripts/*.test.mjs"   # 15 tests, including the doc's own §5 composition
```

It is here because this is the one style whose central decision is arithmetic rather than taste.
"Which tile is the hero", "does this composition leave holes", "is the dominant tile really 30–40%
of the section", "does the reveal sequence fit in 400ms" and "what does `grid-template-areas`
actually look like for these six items" are all computable, and all of them are things a model
gets subtly wrong when it does them in prose. The placement cursor in particular never moves
backwards, which is how the planner guarantees it has not reordered content to close a gap.

It deliberately computes **no** contrast, focus, target-size, forced-colors or reduced-motion
checks. Those are the nine universal checks and they live in `ui-morphism-core:a11y-validate` —
one implementation, ten callers.

## Layout

```
bento-grid-ui/
├── .claude-plugin/plugin.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css}
│   │   └── scripts/{assign-spans.mjs,assign-spans.test.mjs}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`assets/tokens.css` is doc §4's `:root` block verbatim — all 42 `--bento-*` properties, both
dark-mode branches and the `@media (pointer: coarse)` target bump — and a diff against the doc is
part of keeping this plugin honest. `assets/tokens.theme.css` is its Tailwind v4 `@theme` mirror,
including the warning that in v4 `ease-[--ease-bento]` is a literal, is invalid CSS, and is
dropped silently.

## Licence

MIT. See `LICENSE`.
