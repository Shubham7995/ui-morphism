# liquid-glass-ui

Apple's Liquid Glass material as a Claude Code plugin — refractive lensing chrome, specular
rims, capsule toolbars — with the displacement map generated rather than guessed, the
three-tier `@supports` ladder emitted rather than described, and the two things the
ecosystem gets wrong refused outright.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace.
Research source:
[`docs/08-liquid-glass.md`](https://github.com/Shubham7995/ui-morphism/blob/main/docs/08-liquid-glass.md),
last researched 2026-08-08.

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install liquid-glass-ui@ui-morphism
```

`ui-morphism-core` is declared as a dependency and is enabled automatically.

## Skills

| Skill | What it does | Writes files |
|---|---|---|
| `liquid-glass-ui:apply` | Emits the token layer, generates the displacement map per component size, writes the three-tier ladder and the four accessibility blocks, rewrites chrome components, converts SwiftUI call sites, validates, and reports | yes |
| `liquid-glass-ui:audit` | Reviews an existing implementation against the checklist and writes a report | no — `Read`, `Glob`, `Grep` and the scanner only |

## The one move

Not blur — **displacement**. The backdrop is bent through a simulated curved edge in a
12-24px band at the border, and the centre stays comparatively clear.

```css
@supports (backdrop-filter: url(#lg-refract)) {
  .lg--refract {
    -webkit-backdrop-filter: url(#lg-refract) blur(var(--lg-blur)) saturate(var(--lg-sat));
            backdrop-filter: url(#lg-refract) blur(var(--lg-blur)) saturate(var(--lg-sat));
  }
}
```

`#lg-refract` is an `feDisplacementMap` whose map encodes Apple's squircle surface profile,
`y = ⁴√(1 - (1-x)⁴)` — a gentler shoulder and a harder terminal edge than a spherical dome.
Red is the horizontal offset, green the vertical, 128 is neutral.

**Liquid Glass is glassmorphism plus displacement, specular tracking and adaptive tint.**
A superset, not a rebrand. Ship the blur without the displacement and what you have built is
glassmorphism — which is a perfectly good thing to build, is interoperable, and has its own
plugin, `glassmorphism-ui`.

## What this plugin gets right that the ecosystem does not

- **Nested glass is a hard fail, and the scanner catches it from both sides.** Glass cannot
  sample glass: the inner element's backdrop snapshot contains the outer element's
  already-filtered output, so stacking is multiplicative rather than additive and Apple's
  own renderer forbids it — which is exactly why `GlassEffectContainer` exists. Web clones
  nest glass constantly because nothing tells them not to. `lg-scan.mjs` checks the selector
  side *and* the markup side, because neither sees the other's case.
- **The fill floor is solved, not chosen.** Below roughly 0.55 alpha there is no foreground
  colour that passes over every backdrop. At the α = 0.40 iOS 26 actually shipped, over a
  dark photo, white text reaches **3.80:1** and `#1C1C1E` reaches **4.48:1** — neither is
  safe. 0.55 is the shipped floor; 0.62 is the safe default; the ink is paired with the fill
  rather than picked.
- **The map is generated, and it is checked.** A displacement map is an image, not a value a
  table can hold, and it changes with every component size. `displacement-map.mjs` evaluates
  the squircle profile across the rim band, resolves the outward normal inside the corner
  arcs, encodes an 8-bit PNG, inlines it as a data URI, and fails the run if it breaks the
  8KB budget.
- **The filter region is derived from the scale, in both directions.** Doc §5's printed
  `140%` box is too loose on a full-width panel and too *tight* on a 56px toolbar, where it
  crops the displaced result at exactly the rim the effect lives in. The script computes it.
- **The `@supports` ladder is a ladder.** Tier 2 refraction is Chromium-only; Tier 1 is
  glassmorphism and reaches everyone; Tier 0 is an opaque card and reaches the rest. Emitted
  in that order, gated by feature tests, never by a user-agent string.

## Intensity

One number, 0-100, default 60, mapped onto five knobs. Resolved at every ten points in
`skills/apply/references/tokens.md` §4.

| Knob | 0 | 60 (default) | 100 |
|---|---|---|---|
| `refractionScale` | 0 | 48 | 72 |
| `fillAlpha` | 0.95 | 0.62 | 0.55 |
| `blurRadius` | 0px | 20px | 28px |
| `specularOpacity` | 0.00 | 0.55 | 0.90 |
| `saturation` | 100% | 180% | 190% |

**`fillAlpha` moves inversely** — higher intensity means thinner glass, never below the 0.55
clamp. Doc §13 heads its columns `Min`/`Max` rather than naming the endpoints, so for that
one knob the columns are bounds and the direction of travel is prose; the contract carries
an `inverse` flag so the reading is explicit rather than inferred.

`backdropControl: arbitrary` — the default — hard-caps intensity at **45** and forces the
Regular variant. `a11yTarget: AAA` and `perfTarget: low-end` both take `refractionScale` to
0, which resolves this style to Tier 1 and is said plainly rather than shipped quietly.

**Intensity 0 is a near-opaque bordered surface**, fully usable and fully accessible — the
same rung Tier 0 and reduced transparency both collapse to. It is also not this style and
not glassmorphism either: with no blur and no lens it is an opaque card, and the skill says
so rather than shipping the name.

## What it will refuse

Twelve anti-patterns from §13, each with a detection signal and an alternative — the full
list is in `skills/apply/references/anti-patterns.md`. The most common: nested glass at any
depth; glass on `<body>`, `<main>`, tables, charts and scroll containers; a fill below the
floor; Clear without its scrim; refraction with no `@supports` gate; animating
`backdrop-filter`, `filter` or `border-radius`; a displacement map fetched rather than
inlined; user-agent sniffing; and calling a blur-only surface Liquid Glass.

## The bundled scripts

```
node skills/apply/scripts/displacement-map.mjs --size=300x56@28 --scale=48 --json
node skills/apply/scripts/lg-scan.mjs src --json
NODE_OPTIONS= node --test "skills/apply/scripts/*.test.mjs"    # 65 tests
```

`displacement-map.mjs` generates the map and the `<filter>` that consumes it. It exists
because this is the one style in the set that has to emit an **image**: the map encodes, per
pixel, how far the backdrop is bent there, and the answer changes with every component size.
That is arithmetic a model does badly by hand and a table cannot carry.

`lg-scan.mjs` checks the mechanical, style-specific invariants: nested glass in selectors
and in markup, the Tier 2 `@supports` gate, the Tier 0 fallback, the `-webkit-` twin, the
animatable set, `feImage` fetching a map, user-agent sniffing, glass on content and on
scroll containers, Clear without its scrim, live blur inside `forced-colors`, the decorative
layers' `aria-hidden` and `focusable`, the surface and refractor budgets, and a blur-only
surface being called liquid glass.

Neither computes **any** contrast, luminance or alpha compositing. Those are the nine
universal checks and they live in `ui-morphism-core:a11y-validate` — one implementation, ten
callers. A second contrast function is a correctness bug waiting to happen.

## What it delegates to `ui-morphism-core`

| Concern | Skill |
|---|---|
| Framework and styling-system detection | `ui-morphism-core:detect-stack` |
| Token grammar, emitters, dark-mode emission shape, Tailwind mapping | `ui-morphism-core:token-emit` |
| All nine universal accessibility checks, including every contrast computation | `ui-morphism-core:a11y-validate` |
| Intensity contract, clamp mechanism, context caps | core contract |
| Audit report section order | marketplace convention, reproduced in full in each skill |
| Refusal protocol — refuse, explain, offer the alternative | core contract |

This plugin owns the token *values*, the intensity curves and clamps, the displacement-map
geometry, component emission, the style-specific invariants, the budget rows, and the
anti-pattern list.

## Layout

```
liquid-glass-ui/
├── .claude-plugin/plugin.json
├── assets/intensity.contract.json
├── skills/
│   ├── apply/
│   │   ├── SKILL.md
│   │   ├── references/{tokens,recipes,motion,anti-patterns}.md
│   │   ├── assets/{tokens.css,tokens.theme.css,tokens.um-aliases.css}
│   │   └── scripts/{displacement-map,lg-scan}.mjs + tests
│   └── audit/
│       ├── SKILL.md
│       └── references/checklist.md
├── README.md
└── LICENSE
```

`tokens.css` is doc §4's `:root` block byte for byte — light values on bare `:root`, dark
duplicated under both the guarded media query and `:root[data-theme="dark"]`, and the
reduced-transparency and increased-contrast overrides last so they win in either theme.
Those overrides flatten all three elevation rungs, not just the base pair: a surface that
re-points its fill and blur at rung 2 walks straight back through a rung-blind override,
which is a bug that only appears for users who have Reduce Transparency on and therefore
never appears in review.

## The portability ceiling, stated

`backdrop-filter: url(#f)` — an SVG filter as a backdrop-filter value — is **Chromium-only**.
Safari and Firefox support only the keyword filter functions, so the signature effect is
invisible to roughly half the web. `caniuse` reports `backdrop-filter` support for the
keyword functions, not for the `url()` value, so the headline percentage does not answer
this question. Verify it yourself before shipping; W3C SVG WG issue #1142 (filed 25 June
2026, still at discussion) is the thread that would change the picture.

On Apple platforms none of this applies. The OS composites the material for you, far more
cheaply than any web reproduction, and `skills/apply/references/recipes.md` §4 is the path
this plugin prefers wherever the target is native.

## Provenance

| | |
|---|---|
| Source doc | `docs/08-liquid-glass.md` §13 |
| Last researched | 2026-08-08 |
| Status in 2026 | dominant |
| Accessibility risk | high |
| Performance cost | high |

## Licence

MIT. See [`LICENSE`](./LICENSE).
