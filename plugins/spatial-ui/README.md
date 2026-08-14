# Spatial UI

Depth as the hierarchy channel — floating panels at measured `translateZ`, one camera on one
stage, orbiter chrome, and the counter-scale that holds a panel's apparent size constant as
it comes forward. Both dialects: native XR, and the flat-screen depth idiom most teams
actually ship.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace. Source of
truth for every value this plugin emits is
[`docs/10-spatial-ui.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/10-spatial-ui.md).

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install spatial-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does |
|---|---|
| `/spatial-ui:apply` | Emits the six-step depth ladder with its counter-scale and shadow pairs, places exactly one perspective stage and moves `position: fixed` chrome out of it, converts a toolbar into an orbiter, adds reduced-motion-guarded pointer parallax, gives every movable panel a non-drag path, and validates every emitted surface. Writes files. |
| `/spatial-ui:audit` | Reviews an existing spatial implementation and writes `reports/spatial-ui-audit.md`. Reads only; changes nothing. |

## Why this plugin exists

**Two dialects, and the second one is the job.** The native XR dialect has excellent
documentation and a shrinking install base: IDC counted roughly 45,000 Vision Pro units in
2025 against 390,000 in 2024, and Counterpoint reported Q1 2026 VR headset shipments down 17%
year on year. Meanwhile the flat-screen dialect — depth ladders, floating panels, orbiter
chrome, pointer parallax, scroll-driven depth — is spreading fast through mainstream product
design, and the primitives it needs are exactly what the browsers are standardising:
scroll-driven animations, view transitions and anchor positioning are Interop 2026 focus
areas, and WebXR is not. The design language outgrew its hardware. `target: screen` is the
default here for that reason.

**The single defining move is distance-independent sizing.** Push a panel to
`translateZ(56px)` under `perspective: 1200px` and it grows by `1200 / (1200 − 56)`. Counter-
scale it by `(1200 − 56) / 1200 = 0.95333` and its apparent size is unchanged, leaving only
the parallax and the shadow pair to read as depth. A `translateZ` without its counter-scale
is a zoom, not a depth — and the counter-scale, the rung and the shadow pair move together or
the invariant is gone.

**SC 2.5.7 Dragging Movements is the criterion this style breaks most reliably, and the one
nobody discusses.** `movable()`, `resizable()`, drag-to-reposition windows, drag-based depth
controls and a CSS `resize` handle nobody thought of as a drag all require a single-pointer,
non-dragging alternative at Level AA. In a spatial codebase it is almost always absent. Every
movable or resizable panel this plugin emits ships arrow-key nudging and a visible reset
control, the bundled scanner reports each missing half as its own error, and the audit treats
the omission as a fail on its own regardless of everything else on the page.

**And the alpha floors are per-channel, not averaged.** Browsers composite a translucent fill
in gamma-encoded sRGB one 8-bit channel at a time. Averaging the fill's and the backdrop's
luminances instead is not an approximation — it is a different and consistently optimistic
model. A white fill at α 0.20 over black measures **1.50:1**; the averaging model claims
**4.52:1** for exactly that case. Over a backdrop the project does not control, the honest
floors are α ≥ 0.62 for dark glass under light text and α ≥ 0.60 for light glass under dark
text.

## What it emits

- `tokens/spatial-ui.tokens.css` — the `--sp-*` set: the camera, the ladder, the
  counter-scales, the surfaces, the ink tiers, the targets, the shadow pairs and the motion
  tokens, with light on bare `:root`, dark under both the guarded media query and
  `:root[data-theme="dark"]`, and the reduced-transparency, reduced-motion and forced-colors
  overrides after them
- `tokens/spatial-ui.theme.css` — the Tailwind v4 `@theme` mirror; or `SpatialTokens.swift` /
  `SpatialTokens.kt` where the stack calls for it
- `components/spatial/*` — `SpatialStage`, `SpatialPanel`, `SpatialOrbiter`, `SpatialDialog`
  (with the −125px content pushback) and `SpatialLayer`
- `styles/spatial.layer.css` — `@layer spatial { }` holding the depth utilities, the glass
  `@supports` ladder and the forced-colors flattening
- `reports/spatial-ui-audit.md`

## Intensity

One number, 0-100, default **55**, mapped onto five knobs: the camera distance, the ladder
multiplier, the parallax pair, the panel alpha/blur pair and the shadow multiplier. Every
knob is monotone across the range; two are inverse, because more intensity means a *closer*
camera and *less* fill.

**Intensity 0 is not nothing.** It is a flat, cameraless interface with the ladder at its
0.25× rung and the contact-plus-ambient shadow pairs still carrying the hierarchy, fully
opaque panels and no parallax — which is exactly doc §8's tier-1 fallback, "90% of the read
for 5% of the cost". Panels still have a hairline, controls still size from the target
tokens, and focus is still a real outline.

**The ladder multiplier is deliberately not a token.** It multiplies `--sp-z-1` … `--sp-z-5`,
re-derives every counter-scale and rescales every shadow pair *before* the CSS is written. A
unit the page could change at runtime would move the panels without moving their
counter-scale or their shadows, and at intensity 0 there is no perspective left to recover
the counter-scale from.

Hard clamps do not move with intensity at all: the alpha floors, the 12px / 4° pointer-
parallax cap, ladder quantisation, the counter-scale, the 24px target floor, the 12° text-
plane ceiling, the layer and memory budgets, zero permanent `will-change`, and no
`position: fixed` inside a perspective subtree.

Full curve table resolved at every five points, the clamps and the context caps:
`skills/apply/references/tokens.md` §4-§6 and `assets/intensity.contract.json`.

## What it will refuse

Thirteen anti-patterns from the research doc's §13, each with a detection signal and an
alternative — the full list is in `skills/apply/references/anti-patterns.md`. The most
common: drag-only panel movement; a reduced-motion guard that zeroes a variable instead of
detaching the listener; depth as the only encoding of a state; glass below the alpha floor on
a backdrop nobody controls, and any contrast figure derived by averaging luminances;
`perspective` on `body`; a `translateZ` with no counter-scale; `backdrop-filter` on repeated
items; permanent `will-change`; and Compose XR code generated without pinning an explicit
`1.0.0-alphaNN`.

## The bundled scanner

`skills/apply/scripts/spatial-scan.mjs` is a dependency-free Node script that checks the
mechanical, style-specific invariants: the dragging alternative, the camera's containing
block, ladder quantisation and the missing counter-scale, `preserve-3d` nesting and
`preserve-3d` on scrollers, the `backdrop-filter` census and its placement on animated or
repeated elements, interpolation of `backdrop-filter` / `perspective` / `width` / `height`,
permanent `will-change`, the reduced-motion detach, forced-colors flattening, text planes
past 12°, interactive sizes written as literals, and the GPU layer-memory estimate.

```
node skills/apply/scripts/spatial-scan.mjs src --json
node --test "skills/apply/scripts/*.test.mjs"   # 61 tests
```

It deliberately computes **no** contrast, luminance, alpha composite, focus, target-size or
forced-colors keyword check. Those are the nine universal checks and they live in
`ui-morphism-core:a11y-validate` — one implementation, ten callers. A second contrast
function is a correctness bug waiting to happen, and the way it goes wrong is silent.

Three of its checks cannot be closed statically and say so in their own output: whether a
`position: fixed` element is *rendered* inside the stage, how deep `preserve-3d` nests at
runtime, and how many blurred surfaces are on screen at once. All three are carried as Manual
TODOs with the procedure rather than reported as passes.

The last three tests run the scanner over the doc's own §5 reference build. It produces
exactly one error, and that is on purpose: §5's listing ships `will-change: transform` on the
base `.sp-panel` rule while §8 and §13 both forbid a permanent promotion on a non-animating
element. The plugin follows §8 and §13, and the test pins that decision so it cannot be
reversed quietly.

## Layout

```
spatial-ui/
├── .claude-plugin/plugin.json
├── assets/intensity.contract.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css}
│   │   └── scripts/{spatial-scan.mjs,spatial-scan.test.mjs}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`assets/tokens.css` is doc §4's block verbatim, header comment aside — CI diffs it against
the doc in both directions. `scripts/` earns its place here for the same reason it does in
glassmorphism: several of doc §13's checklist lines are textual invariants over emitted code
that no amount of prose enforces, and the dragging alternative in particular is a
cross-file question rather than a per-rule one.

## Where this style should not go

Doc §9, quoted rather than softened: dense data work, text-first reading, anything with a
hard performance floor, regulated interfaces, users who are physically moving, audiences with
known vestibular sensitivity, products where the backdrop behind the glass cannot be
controlled — and as a whole-page treatment, because a page that is spatial all the way down
is a page with no ground plane. This is a chrome-and-hero language. If the request is really
for one of those surfaces, the answer is a lower intensity only if the answer is not a
different style.

## Provenance

| | |
|---|---|
| Source doc | `docs/10-spatial-ui.md` §13 |
| Last researched | 2026-08-08 |
| Status in 2026 | emerging |
| Accessibility risk | high |
| Performance cost | medium |

## License

MIT.
