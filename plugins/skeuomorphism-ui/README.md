# skeuomorphism-ui

Skeuomorphic restyling as a Claude Code plugin. One overhead light source rendered as a
four-layer shadow stack, a three-stop face gradient, a hairline material border,
letterpress type and a single fine SVG grain layer — plus the forced-colors and light-model
work that hand-rolled implementations of this style get wrong.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace.
Research source: [`docs/01-skeuomorphism.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/01-skeuomorphism.md),
last researched 2026-08-08.

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install skeuomorphism-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does | Writes files |
|---|---|---|
| `skeuomorphism-ui:apply` | Emits the material token layer, rewrites components to the four-layer stack with a 3-stop face and a real border, inverts the stack for recessed wells, puts one grain layer on the chassis, writes the guard blocks, scans, validates and reports | yes |
| `skeuomorphism-ui:audit` | Reviews an existing skeuomorphic implementation against the checklist and writes a report | no — `Read`, `Glob`, `Grep` and the scanner |

## The one move

```css
.sk-button {
  background: linear-gradient(to bottom,           /* light at the top      */
    var(--sk-surface-hi) 0%,
    var(--sk-surface)   45%,                        /* 45%, not 50%          */
    var(--sk-surface-lo) 100%);
  border: 1px solid var(--sk-border-strong);        /* the real boundary     */
  box-shadow:
    0 1px 2px rgba(0,0,0,.25),                      /* L1 contact            */
    0 4px 10px rgba(0,0,0,.18),                     /* L2 ambient            */
    inset 0 1px 0 rgba(255,255,255,.80),            /* L3 top bevel          */
    inset 0 -2px 3px rgba(0,0,0,.12);               /* L4 under-lip          */
  text-shadow: 0 1px 0 rgba(255,255,255,.70);       /* letterpress           */
}
.sk-button:active {
  transform: translateY(1px);                       /* it moved              */
  box-shadow:
    inset 0 2px 5px rgba(0,0,0,.25),
    inset 0 1px 1px rgba(0,0,0,.20);                /* and the light flipped */
}
```

Everything else hangs off that lighting model. One shadow reads flat; four read machined.
Recessed containers — wells, inputs, slider tracks — **invert** the stack, highlight at the
bottom and shade at the top, and that is the only permitted exception to the top-light
rule. It is what makes a hole read as a hole rather than as a bump.

## What this plugin gets right that hand-rolled implementations do not

- **The grain survives forced-colors, and nothing else does.** The mode forces
  `box-shadow: none`, `text-shadow: none` and `background-image: none`, which deletes the
  entire style in one step — except that `background-image: none` does *not* apply to
  `url()` backgrounds. So the SVG data-URI grain is left alive, on top of the user's forced
  palette, after every bevel around it has gone. This plugin emits an explicit
  `display: none` for the grain pseudo-element in the same block, and both the apply and
  audit paths assert it.
- **Four systems, one light direction.** The shadow stack, the face gradient, the grain and
  the specular hotspot are four independent CSS mechanisms that are only this style when
  they agree on where the light is. The bundled scanner reads polarity layer by layer:
  every outer shadow offset downward, the light inset at the top of a raised surface, the
  dark inset at the bottom, the gradient running `to bottom`, the hotspot in the 25-35%
  band, and the recessed inversion as the only exception.
- **A bevel is not a boundary.** Every control carries a real 1px `--sk-border-strong`,
  which is **4.01:1** against the face and **3.40:1** against the chassis. The decorative
  `--sk-border` measures **1.76:1** and is on the refusal list as a control edge.
- **Contrast measured against the darkest stop.** A 3-stop gradient has three backgrounds,
  and the body ink is **7.85:1** on the mid stop but **6.67:1** on the darkest one. Both
  clear AA; only one reaches AAA. Measuring the average is how a 3.8:1 label ships.
- **Grain frequency is not a token, and is not advertised as one.** A data URI is an opaque
  string and CSS cannot interpolate a custom property inside it, so `baseFrequency` 0.9,
  `numOctaves` 2 and the 160px tile live in the URI and are edited in all three places that
  carry a copy. `--sk-noise-opacity` is the only tokenised grain parameter — the frequency
  changes the *material*, the opacity changes the *intensity*.

## Intensity

One number, 0-100, default 60, mapped onto five knobs. Resolved table at every five points
in `skills/apply/references/tokens.md` §6.

| Knob | 0 | 100 | Default (60) |
|---|---|---|---|
| `shadowDepth` | no shadows | the full four layers at doc §4's literal values | 0.60 |
| `gradientSpread` | flat fill | 24%, polished metal only | 15% |
| `grainOpacity` | none | 0.08 | 0.05 light / 0.07 dark |
| `materialFidelity` | colour only | + gradient, + grain, + specular and edge highlight | 2 |
| `travel` | none | 2px | 1px |

Intensity 60 is the row that reproduces the shipped `tokens.css` exactly: 15% is the spread
`--sk-surface-hi` and `--sk-surface-lo` already carry, and 0.05 / 0.07 are the shipped
`--sk-noise-opacity` values.

`surface: running-text` and `surface: data-table` both cap at **0**, and both are recorded
as a refusal as well as a cap. Intensity 0 is not nothing: it is the mid-stop face as a
flat fill, the 1px material edge, body-grade ink, the additive focus ring and the 44px
target — which is where doc §8's degradation ladder ends, and it calls that a perfectly
respectable place to land.

## What it delegates to `ui-morphism-core`

| Concern | Skill |
|---|---|
| Framework and styling-system detection | `ui-morphism-core:detect-stack` |
| Token grammar, emitters, dark-mode emission shape, Tailwind mapping | `ui-morphism-core:token-emit` |
| All nine universal accessibility checks, including every contrast computation | `ui-morphism-core:a11y-validate` |
| Intensity contract, clamp mechanism, context caps | core contract |
| Audit report section order | marketplace convention, reproduced in full in each skill |
| Refusal protocol — refuse, explain, offer the alternative | core contract |

This plugin owns the token *values*, the intensity curves and clamps, the material table,
component emission, the style-specific invariants, the budget rows and the anti-pattern
list. It contains no contrast function. There is exactly one of those, and it is core's.

## Layout

```
skeuomorphism-ui/
├── .claude-plugin/plugin.json
├── assets/intensity.contract.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css}
│   │   └── scripts/{skeuo-scan.mjs,skeuo-scan.test.mjs}
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`skeuo-scan.mjs` earns its place because this style's invariants are geometric rather than
arithmetic, and geometry is exactly what prose cannot enforce. Whether an inset sits on the
top edge or the bottom, whether an outer offset is positive, whether a gradient runs `to
bottom`, whether the grain's `display: none` is present in the forced-colors block and
whether the tile is still 160px are all decidable from the text of a stylesheet and all
invisible on a read-through — and doc §9 is explicit that this style has a very low
tolerance for near-misses where flat design degrades gracefully. The scanner computes no
contrast ratio, no relative luminance and no alpha compositing; those are core's, and it
says so in its own header. Run it directly:

```
node skills/apply/scripts/skeuo-scan.mjs <paths> --json
node --test "skills/apply/scripts/*.test.mjs"
```

## Licence

MIT. See [`LICENSE`](./LICENSE).
