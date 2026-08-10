# The intensity contract

Source of truth: [`docs/MARKETPLACE.md` §7.2](https://github.com/Shubham7995/ui-morphism/blob/main/docs/MARKETPLACE.md).

One user-facing number, 0-100, mapped by each style onto its own three-to-five knobs. **Core owns the contract, the clamp mechanism and the context-cap mechanism. The style owns the curves, the knob values and the clamp values.** `scripts/intensity.mjs` implements the mechanisms; this file states the rules they enforce, in the order a style skill should check them.

A style skill satisfies this contract by declaring a knob table and passing it through `resolveIntensity()`. It does not re-implement any of the five rules.

---

## Rule 1 — Monotone

**Statement.** Every knob moves in one direction across 0 → 100. No knob reverses mid-range.

Where the visual reading is inverted, the *knob* moves inversely while intensity still means "more of this style". Three styles do this and all three are correct: `liquid-glass.fillAlpha` falls as intensity rises (more glass is less fill), `brutalism.radius` falls (more brutalism is less corner), `minimalism.decorationBudget` falls (more minimalism is less decoration).

**How it is checked.** `resolveIntensity()` sweeps 0 → 100 in steps of 1 and asserts each knob's sequence is non-increasing or non-decreasing throughout. A knob that reverses is an error, not a warning: a non-monotone knob makes intensity meaningless as a dial, because turning it up can undo the last turn.

## Rule 2 — Intensity 0 is a usable, accessible, recognisable-as-plain baseline, never nothing

**Statement.** At intensity 0 the style still emits a bordered, accessible, unornamented control. Glassmorphism at 0 is a bordered opaque tinted card. Skeuomorphism at 0 is a bordered unornamented control. Bento at 0 is a uniform card grid. Minimalism at 0 is a conventional interface with its affordances intact.

This is what makes intensity safe for an agent to turn: the bottom of the range is a defensible interface rather than an absence.

**How it is checked.** The style declares `baselineAtZero`, a short prose description plus the assertion that at intensity 0 the emitted token set still contains a `border-strong`, a `focus-color`/`focus-width`/`focus-offset` triple and a `target-min`. `resolveIntensity()` rejects a knob table whose zero point is described as "none", "off" or an empty string.

## Rule 3 — Intensity 100 still passes the accessibility floor

**Statement.** If intensity 100 cannot pass, the skill clamps and records the clamp in the audit report. It never ships a failing surface to satisfy a number.

**How it is checked.** `a11y-validate` runs on the emitted set at the requested intensity. Every correction it forces is fed back as a `clamp` entry with a before, an after and the criterion that forced it, and those entries appear in §5 Corrections of the audit report. A skill that reports "done" with an unrecorded clamp has violated the contract even if the shipped surface is compliant.

## Rule 4 — Hard clamps are independent of intensity

**Statement.** A hard clamp is a floor or ceiling that applies at every intensity, including 100. Core enforces the *existence* of a clamp table per style; the values in it are the style's.

The known hard clamps, from the owning docs:

| Style | Clamp | Direction |
|---|---|---|
| `maximalism` | `layerCount` ≤ 3 | ceiling |
| `liquid-glass` | `fillAlpha` ≥ 0.55 | floor |
| `neumorphism` | `hairlineOpacity` ≥ 0.55 | floor |
| `claymorphism` | `squishAmount` ≥ 0.93 | floor |
| `spatial-ui` | panel alpha ≥ 0.62 dark / ≥ 0.60 light on an arbitrary backdrop | floor |

`spatial-ui`'s pair is the one to copy the reasoning from: 0.62 and 0.60 are not aesthetic choices, they are the solutions of `solveMinAlpha()` against a worst-case backdrop, recorded in doc 10 §7 and reproduced by `a11y-validate`'s test suite.

**How it is checked.** `resolveIntensity()` requires a non-empty `clamps` object and applies every entry after the curve, never before. A clamped knob is reported, not silently substituted.

## Rule 5 — Context caps override intensity

**Statement.** A context cap lowers the *effective* intensity before any curve is evaluated, because the surface the style is being applied to cannot carry the requested loudness.

The known caps, from the owning docs:

| Style | Context | Cap |
|---|---|---|
| `maximalism` | `surfaceType: app-accent` | 45 |
| `brutalism` | `scope: product` | 45 |
| `liquid-glass` | `backdropControl: arbitrary` | 45 |
| `spatial-ui` | `backdropControl: arbitrary` | 45 |

**How it is checked.** `resolveIntensity()` takes the requested intensity plus a context object, applies the lowest matching cap, and returns `{ requested, effective, capApplied, capReason }`. When `capApplied` is true the audit report must carry the line in §5 Corrections: the user asked for 90, the surface is an app accent, the effective intensity was 45, and here is why. A cap that is applied without being reported is indistinguishable from a bug.

---

## Defaults, for reference

| Style | Default intensity |
|---|---|
| `skeuomorphism` | 60 |
| `neumorphism` | 45 |
| `glassmorphism` | 50 |
| `claymorphism` | 50 |
| `minimalism` | 60 |
| `maximalism` | 60 |
| `brutalism` | 60 |
| `liquid-glass` | 60 |
| `bento-grid` | 45 |
| `spatial-ui` | 55 |

Neumorphism and bento sit lowest for opposite reasons. Neumorphism, because coverage above roughly 0.6 collapses hierarchy — the style stops distinguishing planes. Bento, because span variance above roughly 2.0 stops reading as a grid at all.

## The knob table a style declares

Each style ships this as `assets/intensity.contract.json` at its plugin root, and `scripts/intensity.mjs` reads it directly. It is JSON rather than prose so that the resolution a style skill reports in §5 Corrections is computed, not retyped.

```json
{
  "style": "brutalism",
  "default": 60,
  "baselineAtZero": "A bordered, square, flat control with a visible focus ring.",
  "knobs": {
    "shadowOffset": { "anchors": [[0, 0], [50, 4], [100, 12]], "unit": "px" },
    "borderWidth":  { "anchors": [[0, 1], [24.9, 1], [25, 2], [49.9, 2], [50, 3],
                                  [74.9, 3], [75, 4], [99.9, 4], [100, 5]], "unit": "px" },
    "radius":       { "anchors": [[0, 12], [50, 5], [100, 0]], "unit": "px" },
    "chroma":       { "at0": 35, "at100": 100, "unit": "%" },
    "tilt":         { "at0": 0, "at100": 3, "unit": "deg" }
  },
  "clamps": {
    "borderWidth": { "min": 1 },
    "shadowOffset": { "min": 0 }
  },
  "contextCaps": [
    { "when": { "scope": "product" }, "cap": 45,
      "reason": "Product surfaces carry sustained reading; doc 07 §13 caps offset at 4px and border at 2px." }
  ]
}
```

**Three ways to declare a curve, in precedence order.**

- **`curve`** — a function. Module callers only; JSON cannot carry one.
- **`anchors`** — `[[intensity, value], …]`, ascending in intensity and spanning 0 to 100, interpolated piecewise-linearly. This is the form a JSON contract uses, and it is the one every style needs: all three built so far state a midpoint a straight line between the endpoints cannot reach (brutalism's "4px at 50" and "5px at 50", glassmorphism's rung defaults at 50, bento's defaults at 45). A straight line 0 → 12 would put brutalism's `shadowOffset` at 6px at intensity 50, and the doc says 4px.
- **`at0` / `at100`** — a straight line, for the knobs that genuinely are one.

**Stepped ladders are anchors with plateaus.** Brutalism's `borderWidth` is "stepped 1 / 2 / 3 / 4 / 5 at 0 / 25 / 50 / 75 / 100", which means the value holds across a band and jumps at the boundary. A plateau followed by a narrow ramp encodes that exactly, and because the ramps are 0.1 wide and sit just below each boundary, no integer intensity ever lands inside one. A plain `at0: 1, at100: 5` line would report 3.4px at intensity 60 where the style's own table says 3px, and that is the kind of half-a-pixel seam this contract exists to close.

The monotonicity sweep of rule 1 applies to all three forms, and a plateau is monotone.
