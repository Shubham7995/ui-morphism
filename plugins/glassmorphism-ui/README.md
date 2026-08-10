# Glassmorphism UI

Frosted-glass surfaces for Claude Code — backdrop-blur navbars, cards, modals, popovers and
command palettes, with the `@supports` fallback, the contrast clamp and the blur budget
handled rather than hand-waved.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace. Source of
truth for every value this plugin emits is
[`docs/03-glassmorphism.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/03-glassmorphism.md).

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install glassmorphism-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does |
|---|---|
| `/glassmorphism-ui:apply` | Emits the five-rung glass elevation ladder plus its opaque mirror, generates the ground glass depends on, rewrites target components with the `@supports` fallback baked in, appends the four accessibility escape hatches, and validates every text pair against the composited backdrop. Writes files. |
| `/glassmorphism-ui:audit` | Reviews an existing glass implementation and writes `GLASS-AUDIT.md`. Reads only; changes nothing. |

## Why this plugin exists

The same `rgba(255,255,255,0.12)` panel with white text measures **14.6:1** over `#0B0B12`
and **1.57:1** over `#7DD3FC` — an ordinary sky-blue in a mesh gradient. Same panel, same
text, a 9.3× swing depending on where the user scrolled.

axe, Lighthouse and Figma's contrast plugins all compute against the declared
`background-color`. `backdrop-filter` means the declared background is not the effective one,
so they report the first number and never the second. Naive glassmorphism output is not
merely unpolished — it is actively wrong, and the standard tooling says it is fine.

Everything in this plugin follows from that: the contrast check runs against the composite at
**both** extremes of the ground, the text scrim floor of `0.56` alpha is a solved value rather
than a taste call, and the report always carries two ratios per text token.

## What it emits

- `tokens/glass.tokens.css` and, for Tailwind v4, `tokens/glass.theme.css`, plus the
  `--um-glassmorphism-*` alias bridge where the project consumes the shared grammar
- `components/glass/*` — `GlassSurface`, `GlassNav`, `GlassCard`, `GlassPopover`,
  `GlassModal`, `GlassButton`, `GlassInput`
- `styles/glass.layer.css` — `@layer glass` with the ground, the grain filter, the two-tone
  focus recipe, all four accessibility blocks, the print block and the `[data-transparency]`
  hook
- `styles/glass-ground.css` — the mesh-gradient backdrop and its clamping layer
- `reports/GLASS-AUDIT.md`

## Intensity

One number, 0–100, default 50, mapped onto five knobs: `fillAlpha`, `blurRadius`,
`saturation`, `borderAlpha`, `grainOpacity`. Every knob is monotone across the range.

**Intensity 0 is a bordered opaque tinted card, not nothing** — the same surface every
browser gets from the `@supports` fallback. **Intensity 100 still has to pass the
accessibility floor**; if it cannot, the skill clamps and records the clamp in the audit
rather than shipping a failing surface. Hard clamps — the 0.56 scrim floor, the 20px blur cap
on scroll-pinned surfaces, the 0.10 border-alpha floor, the 44px target — do not move with
intensity at all.

Full curve table, clamps and context caps: `skills/apply/SKILL.md`.

## What it will refuse

Thirteen anti-patterns from the research doc's §13, each with a detection signal and an
alternative — the full list is in `skills/apply/references/anti-patterns.md`. The most common:
body text on a low-alpha fill with no scrim and no clamped ground; a translucent fill with no
opaque fallback; `backdrop-filter` with no `-webkit-` twin; glass on tables, inputs and
long-form text; `transition: backdrop-filter` on hover; `opacity` on a glass ancestor; and any
glass left alive inside a `forced-colors: active` block.

## The bundled scanner

`skills/apply/scripts/glass-scan.mjs` is a dependency-free Node script that checks the
mechanical, style-specific invariants: the `-webkit-` twin, the `@supports` wrapper, animated
blur, `will-change` misuse, raster grain, live blur inside `forced-colors`, the scroll-pinned
blur cap, the four escape hatches, the print sheet, the transparency toggle, and the ancestor
backdrop-root hazards that silently kill the effect.

```
node skills/apply/scripts/glass-scan.mjs src --json
node --test "skills/apply/scripts/*.test.mjs"   # 28 tests, including the doc's own §5 recipe
```

It deliberately computes **no** contrast, focus, target-size or forced-colors keyword checks.
Those are the nine universal checks and they live in `ui-morphism-core:a11y-validate` — one
implementation, ten callers. A second contrast function is a correctness bug waiting to
happen.

## Layout

```
glassmorphism-ui/
├── .claude-plugin/plugin.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css,glass.layer.css}
│   │   └── scripts/{glass-scan.mjs,glass-scan.test.mjs}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`glass.layer.css` is doc §13's third output shipped as a file rather than described in
prose: the ground and its clamping modifier, the grain rule, the two-tone focus ring,
`scroll-margin-top`, all four accessibility queries, the `[data-transparency]` hook and the
print block. Four media queries reconstructed from memory is four chances to drop one, and
the one that gets dropped is `forced-colors`, where a live blur does the most damage.

`scripts/` earns its place here in a way it does not in every style: three of doc §13's
checklist lines are textual invariants over emitted CSS that no amount of prose enforces —
the `-webkit-` twin on the preceding line, the `@supports` wrapper around every translucent
branch, and the ancestor backdrop-root scan that `MARKETPLACE.md` §7.3 assigns to this
style by name. The last one in particular is a whole-file question, not a per-rule one.

## Provenance

| | |
|---|---|
| Source doc | `docs/03-glassmorphism.md` §13 |
| Last researched | 2026-08-08 |
| Status in 2026 | mainstream |
| Accessibility risk | high |
| Performance cost | medium |

## License

MIT.
