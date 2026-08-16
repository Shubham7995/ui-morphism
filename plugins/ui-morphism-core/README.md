# ui-morphism-core

The shared foundation the ten ui-morphism style plugins are built on. It owns the four
problems that have one correct answer regardless of which style is being applied:
detecting the host stack, emitting tokens under one grammar, computing WCAG contrast, and
resolving an intensity 0-100 onto a style's knobs.

Part of the [ui-morphism](https://github.com/Shubham7995/ui-morphism) marketplace.
Specification: [`docs/MARKETPLACE.md` §7](https://github.com/Shubham7995/ui-morphism/blob/main/docs/MARKETPLACE.md),
token grammar: [`docs/00-comparison-matrix.md` §7](https://github.com/Shubham7995/ui-morphism/blob/main/docs/00-comparison-matrix.md).

**This is not a design skill.** It decides nothing about how a UI should look, ships no
component, and holds no token value. Every number in it is a threshold from a W3C success
criterion, never a taste judgement.

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install ui-morphism-core@ui-morphism
```

You normally do not install this directly. Every style plugin declares it in
`dependencies`, and Claude Code enables a required plugin automatically.

## Skills

| Skill | What it does | Writes files |
|---|---|---|
| `ui-morphism-core:detect-stack` | Framework, styling system, Tailwind major version, dark-mode strategy, existing token system, component root — as one fixed JSON contract that every style skill branches on | no |
| `ui-morphism-core:a11y-validate` | The nine universal WCAG 2.2 checks, all contrast maths, and the layer/byte/blur budget counters | no |
| `ui-morphism-core:token-emit` | The `--um-<style>-<group>[-<variant>]` grammar and its five emitters, the dark-mode emission shape, the Tailwind v4 mapping, and the intensity contract | yes |

## The line between core and a style

The rule, from `MARKETPLACE.md` §7: **anything whose correct answer is identical across all
ten styles, or whose wrong answer is a correctness bug rather than a taste disagreement,
lives here.** Everything that encodes what a style *looks like* stays in the style plugin.

| Core owns | A style owns |
|---|---|
| The token grammar, the closed 22-group vocabulary, the emitters, the dark-mode shape | Its token *values*, and which groups it populates |
| Contrast maths, focus, target size, forced-colors, reduced-motion, colour-only, DOM order | Its own invariants — same-hue, blur = 2 × distance, nested-glass, reading-flow |
| Framework detection and its output contract | Component emission for the detected framework |
| The intensity contract, the clamp mechanism, the context-cap mechanism | Its knob curves, clamp values and cap thresholds |
| The audit-report template and its section order | Which budget numbers appear in the report |
| The refusal mechanism — refuse, explain, offer an alternative, record it | Its own anti-pattern list |

## Why the contrast maths is here and nowhere else

It is the single most-repeated piece of logic across the ten style specs and the single
easiest to get subtly wrong. Four properties in `scripts/contrast.mjs` are load-bearing:

1. **WCAG 2.x relative luminance**, unrounded.
2. **Comparison is unrounded.** `passes()` has no tolerance parameter, so 2.999:1 fails
   3:1 and 4.497:1 fails 4.5:1. Adding a tolerance would be a defect, not a convenience.
3. **Alpha composites per channel in gamma-encoded sRGB** — `C = a·C_fill + (1−a)·C_backdrop`
   on each of R, G and B, and only then linearise. Averaging the two luminances is a
   different and consistently optimistic model: doc 10 §7 records it claiming 4.52:1 for a
   pair that measures 1.50:1.
4. **A worst-case-backdrop solver**, because seven of the ten styles put a translucent
   surface over a ground they do not own.

`contrastRatio()` throws on a translucent operand rather than inventing a number, and
`oklch()` / `lab()` / `color-mix()` are refused rather than guessed at.

```
node skills/a11y-validate/scripts/contrast.mjs ratio       "#0A0A0A" "#FFDC58" --target=4.5
node skills/a11y-validate/scripts/contrast.mjs worst-case  "rgba(255,255,255,0.12)" "#ffffff"
node skills/a11y-validate/scripts/contrast.mjs solve-alpha "#09090E" "#ffffff" --target=4.5
```

## The intensity contract

One user-facing number, 0-100, mapped by each style onto its own three-to-five knobs. Core
owns the contract; the style owns the mapping. Five rules, all enforced by
`scripts/intensity.mjs`:

1. **Monotone.** No knob reverses mid-range. An inverse knob is fine; a reversing one makes
   the dial meaningless.
2. **Intensity 0 is a usable, accessible, recognisable-as-plain baseline, never nothing.**
   This is what makes the number safe for an agent to turn.
3. **Intensity 100 still passes the accessibility floor**, or the skill clamps and records
   the clamp.
4. **Hard clamps are independent of intensity.** Core enforces that a clamp table exists;
   the values are the style's.
5. **Context caps override intensity**, and a cap that is applied without being reported is
   indistinguishable from a bug.

The interface is a single file: each style plugin ships
`assets/intensity.contract.json`, and hands core the path.

```
node skills/token-emit/scripts/intensity.mjs \
  ../brutalism-ui/assets/intensity.contract.json --intensity=90 --context=scope=product
```

A contract that breaks one of the five rules exits 2 instead of resolving, so a style whose
knob table reverses direction, or whose zero is described as "off", finds out here rather
than in a shipped stylesheet.

## Layout

```
ui-morphism-core/
├── .claude-plugin/plugin.json
├── assets/report-template.md
├── skills/
│   ├── detect-stack/
│   │   └── SKILL.md
│   ├── a11y-validate/
│   │   ├── SKILL.md
│   │   └── scripts/{contrast,audit-css,budget}{.mjs,.test.mjs}
│   └── token-emit/
│       ├── SKILL.md
│       ├── references/{token-grammar,group-vocabulary,tailwind-mapping,intensity-contract}.md
│       └── scripts/{emit,intensity}{.mjs,.test.mjs}
├── README.md
└── LICENSE
```

Three differences from a style plugin's shape, each of them deliberate.

**`assets/` sits at the plugin root, not inside a skill.** `report-template.md` is not owned
by any one of the three skills: `a11y-validate` fills in §2, §3, §4 and §7 of it, and all
twenty style skills reproduce its seven sections. A shared file under one skill's directory
would imply an ownership that does not exist. `check-plugins.sh` check 15 grades every
prose copy of those sections against it.

**No `assets/*.css` anywhere, and no `tokens.css` at all.** Core owns the token *grammar*
and the emitters, never a value. The moment a colour appears in this directory, the line in
[The line between core and a style](#the-line-between-core-and-a-style) has been crossed.

**The three skills carry different subdirectories, and the asymmetry is the design.**
`detect-stack` is procedure only — one `SKILL.md`, nothing to bundle, because its whole
output is a JSON contract the caller branches on. `a11y-validate` has `scripts/` but no
`references/`: the only checklist it names belongs to the calling style plugin, which is
why check 10 reports it as one of the two references unresolvable by construction.
`token-emit` has both, because the token grammar, the closed group vocabulary and the
Tailwind namespace map are reference material a skill reads on demand rather than carries
in its body.

## Tests

```
node --test skills/a11y-validate/scripts/*.test.mjs skills/token-emit/scripts/*.test.mjs
```

The contrast suite pins the implementation against the worked examples in the research
docs — doc 03's 14.6:1-to-1.57:1 swing, doc 09's 0.4199 and 0.3294 crossings, doc 10's
0.5853 alpha ladder — rather than against a tolerance. When a doc number and this code
disagree, one of them is wrong and the test says which.

## License

MIT.
