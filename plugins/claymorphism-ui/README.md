# claymorphism-ui

Claymorphic restyling as a Claude Code plugin. Puffy pastel surfaces, 24-40px radii, a
four-layer rim/sheen/shade/drop shadow stack hue-matched to each surface's own colour,
and a press that squishes and inverts the light — plus the accessibility work that this
style's reference implementations skip.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace.
Research source: [`docs/04-claymorphism.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/04-claymorphism.md),
last researched 2026-08-08.

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install claymorphism-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does | Writes files |
|---|---|---|
| `claymorphism-ui:apply` | Emits the token layer, gives every targeted surface its own colour and shadow hue, rewrites components to the four-layer stack with the squish press, inverts the recipe for inputs, writes the four guard blocks, validates, and reports | yes |
| `claymorphism-ui:audit` | Reviews an existing clay implementation against the checklist and writes a report | no — `Read`, `Glob`, `Grep` and the scanner |

## The one move

```css
.clay {
  background: var(--clay-lavender);          /* its OWN colour, not the page's */
  --clay-shadow-h: 258;                      /* the shadow hue follows the fill */
  border-radius: var(--clay-r-card);
  box-shadow:
    inset 0 1px  1px  0    hsl(0 0% 100% / .35),   /* rim   — specular edge */
    inset 0 10px 18px -6px hsl(0 0% 100% / .62),   /* sheen — lit from the top */
    inset 0 -10px 18px -6px hsl(258 45% 30% / .32),/* shade — opposite the light */
    0 24px 44px -12px      hsl(258 60% 45% / .32); /* drop  — the float */
}
.clay:active { transform: translateY(1px) scale(.97); box-shadow: var(--clay-pressed); }
```

Four layers, in paint order with the first on top. The insets create volume; the drop
creates float; the press inverts the light so the element reads as squeezed into the
page rather than pushed away from the viewer.

## What this plugin gets right that the ecosystem does not

- **The surface owns its colour, and that is the whole style.** Claymorphism is a direct
  remediation of neumorphism's contrast failure: same soft-shadow vocabulary, but with
  an independent surface colour and a real drop shadow. Every pastel in the token layer
  clears 8:1 against `--clay-ink` (`#241F3A`) — lavender 8.87:1, sky 10.22:1, mint
  10.40:1, butter 11.77:1, coral 9.20:1 — none of which is reachable by a surface that
  inherits the page's colour. A "clay" card the same colour as the page is neumorphism
  wearing clay's shadows, and this plugin refuses to generate one.
- **The boundary is tested, not assumed.** Clay's text contrast is usually excellent and
  its *edge* contrast usually is not: `#C7B9FF` against `#F4F1FB` is 1.59:1 and fails SC
  1.4.11. The apply skill measures the element edge, not only the text, and escalates to
  a darker surface or the `1px hsl(258 40% 55% / .55)` inset ring that survives
  independently of the blur.
- **Forced colors deletes `box-shadow`, and clay's boundary *is* the shadow.** Every
  generated component ships a `@media (forced-colors: active)` block that puts a real
  `2px solid ButtonText` border back, from a single `--clay-border-hc` token so the
  vanilla and Tailwind blocks cannot drift apart. And unlike siblings 01, 02 and 03,
  clay writes no `forced-color-adjust: none` at all — it does not opt out of the forced
  palette.
- **Dark mode re-derives the light, rather than dimming it.** Rim 0.10, sheen 0.14,
  shade 0.55 — not the light-mode alphas reduced. Reusing them is what makes dark clay
  read as chalky grey plastic, and both skills assert the band (sheen ≤ 0.20,
  shade ≥ 0.45).
- **Static panels do not look like buttons.** The full inset-plus-drop stack goes only
  to elements that can be proven interactive; everything else gets `--clay-drop-1`.
  Applying it to both recreates neumorphism's everything-looks-pressable problem in a
  new costume.
- **It does not install dead tooling.** `tailwindcss-claymorphism` peers on
  `tailwindcss ^3.1.6` and has had no release since October 2022; `clay.css` last
  shipped a commit in November 2022. Tailwind v4 needs no plugin — `@theme` generates the
  utilities from custom properties directly, and this plugin ships that block.

## Intensity

One number, 0-100, default 50, mapped onto five knobs. Resolved table at every five
points in `skills/apply/references/tokens.md` §4.

| Knob | 0 | 50 | 100 |
|---|---|---|---|
| `radiusScale` | 8px card / 6px button | 32px / 20px | 48px / 28px |
| `insetStrength` | sheen 0.00 / shade 0.00 | sheen 0.62 / shade 0.32 | sheen 0.85 / shade 0.48 |
| `dropDepth` | `0 2px 4px -2px` @ 0.12 | `0 24px 44px -12px` @ 0.32 | `0 44px 76px -16px` @ 0.42 |
| `surfaceChroma` | 0.02 oklch | 0.09 oklch | 0.16 oklch |
| `squishAmount` | `scale(1.00)` | `scale(0.97)` + 1px | `scale(0.93)` + 3px |

`surface: data-dense` and `register: high-gravity` both cap intensity at 0 — §9 calls it
by its plain name, ship flat. The blur clamp at `--clay-blur-max` (68px) fires above
intensity 78 and is reported every run.

**Intensity 0 is not nothing.** It is a flat pastel-tinted card that keeps everything
which is not ornament: its own background colour, dark ink on every pastel, a 3px focus
ring at 3px offset, and 48×48 targets. It flattens the volume, never the surface colour
— because a surface the colour of the page is the other style.

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
claymorphism-ui/
├── .claude-plugin/plugin.json
├── assets/intensity.contract.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css}
│   │   └── scripts/{clay-scan.mjs,clay-scan.test.mjs}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`skills/apply/assets/tokens.css` is byte-identical to doc §4's `:root` block apart from
a file header, and CI diffs it both directions.

## The scanner

`skills/apply/scripts/clay-scan.mjs` is a dependency-free static checker for the
invariants that are specific to this style and mechanical enough to be got wrong by
accident: the four-layer ceiling, the 68px and 48px blur ceilings, neutral
`rgba(0,0,0,α)` drop shadows, a surface coloured with the page ground, a forced-colors
block that nulls the shadow without restoring a border, `forced-color-adjust: none`,
`box-shadow` and `border-radius` inside transitions and keyframes,
`will-change: box-shadow`, `inset` inside a `text-shadow`, the dark sheen/shade band,
the grid-gap floor, the affordance split and the four required media blocks.

It computes no contrast ratio, no relative luminance and no alpha compositing. Those are
the nine universal checks and they belong to `ui-morphism-core:a11y-validate` — one
implementation, ten callers.

```
node skills/apply/scripts/clay-scan.mjs <paths> [--json] [--quiet] [--no-fail]
node --test "skills/apply/scripts/*.test.mjs"
```

## Licence

MIT. See [`LICENSE`](./LICENSE).
