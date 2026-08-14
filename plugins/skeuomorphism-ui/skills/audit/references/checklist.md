# Skeuomorphism audit checklist

Two lists merged: the self-run validation checklist from `docs/01-skeuomorphism.md` §13
and the pass/fail checklist from §7. Each item is marked **core** or **style**.

- **core** — `ui-morphism-core:a11y-validate` runs it. Same logic for all ten styles;
  never reimplement it here, and in particular never write a second contrast function.
  There must be exactly one.
- **style** — this plugin's own. It encodes a fact about skeuomorphism, not a fact about
  accessibility, so core has no business knowing it. The rows marked **scan** are the ones
  `../../apply/scripts/skeuo-scan.mjs` decides mechanically.

Record each row as pass / fail / not-applicable with the exact failing selector and, for
contrast rows, the computed ratio to three decimal places, unrounded.

## A. Contrast and colour

| # | Check | Owner |
|---|---|---|
| A1 | Every foreground/background pair ≥ 4.5:1 normal text, ≥ 3:1 for ≥ 24px or ≥ 19px bold. Unrounded: 2.999:1 fails a 3:1 requirement. | core |
| A2 | Every control boundary ≥ 3:1 against **both** its own fill and the surface behind it (SC 1.4.11). | core |
| A3 | Border-vs-adjacent-surface ≥ 3:1 in **both** themes, checked explicitly in dark. | core |
| A4 | Body text measured against the **darkest** gradient stop it can sit on, never the average and never the top stop. `#4a3f2d` on `#e8e0d2` is 7.85:1; on `#d9cfbc` it is 6.67:1, and the difference is the whole reason the measurement is taken this way. | style |
| A5 | `--sk-border` (`#b8a98e`, 1.76:1) is used decoratively only and is never a control's boundary. `--sk-border-strong` (4.01:1 vs the face, 3.40:1 vs the chassis) is. | style |
| A6 | No face or ground is `#ffffff` or `#000000`. Faces sit at 8-25% saturation and 82-95% lightness; every material has a hue. | style |
| A7 | Where the face was derived from a brand colour, or where a material ramp other than §5's four is in use, every pair was re-measured rather than inherited. | style |
| A8 | No state, error, selection or lamp conveyed by colour or texture alone (SC 1.4.1). "Lit means armed" needs a shape, a label or a position change. | core |
| A9 | Toggle states differ by ≥ 3:1 from each other, or carry a non-colour cue. | style |
| A10 | Disabled controls do not rely on `opacity` alone to carry the state. | style |

## B. The light model and structure

| # | Check | Owner |
|---|---|---|
| B1 | **One light direction across the whole emitted set.** Every outer shadow is offset downward; every light inset sits at the top of a raised surface and every dark inset at the bottom. | style, scan |
| B2 | Recessed containers — wells, inputs, selects, textareas, slider tracks, slots — invert the stack and are the **only** inversion. | style, scan |
| B3 | Every raised surface carries the full four-layer stack at its rung; no single-shadow surface is presented as this style. | style, scan |
| B4 | Every element that relies on a shadow or bevel for its edge also has a real `border`. | style, scan |
| B5 | The face gradient has three stops running top-light to bottom-dark, with the midpoint at 45%. Wells run the other way. | style, scan |
| B6 | The specular hotspot appears only on curved parts — knobs, toggles, pill switches — at 25-35% from the top. No flat rectangle has one. | style |
| B7 | Radius matches the implied material: 2-4px machined, 8-12px moulded, 16-24px soft goods. Not one global radius across every material on screen. | style |
| B8 | Letterpress polarity follows the surface: `--sk-emboss` on light faces, `--sk-deboss` on dark ones. | style |
| B9 | Grain, bevel and specular layers are `aria-hidden` pseudo-elements or spans, never real content, and no text is baked into a texture. | style |
| B10 | Interactive elements are real `<button>` / `<a>` / `<input>`, not a `div` with a role. Forced-colors picks system colours from native semantics. | style |

## C. Focus

| # | Check | Owner |
|---|---|---|
| C1 | A `:focus-visible` rule exists on every focusable element and clears 3:1 against adjacent colours. | core |
| C2 | No `outline: none` survives anywhere without a replacement in the same rule set. | core |
| C3 | The focus rule is **additive**: it re-states the element's resolved stack — `--sk-elev-N` or `--sk-elev-current` — before the ring, so focus does not delete the object's depth. | style, scan |
| C4 | The ring is ≥ 2px with a 2px gap, and is paired with `outline: <width> solid transparent` so forced-colors has something to colour. | style, scan |
| C5 | No focused control is obscured by a raised panel or a sticky toolbar (SC 2.4.11). Raised surfaces overlap by design here; check `scroll-margin-block`. | style |
| C6 | No focus indicator was removed in favour of a "more realistic" pressed appearance. | style |

## D. Targets, keyboard and layout

| # | Check | Owner |
|---|---|---|
| D1 | Every target ≥ 24×24 CSS px hard floor; warn below 44×44. | core |
| D2 | Every control sizes from `var(--sk-target-min)` rather than a literal. Knob banks and dial clusters are the usual offenders. | style |
| D3 | Every hardware metaphor is keyboard-operable: `role="slider"` with `aria-valuenow` / `-valuemin` / `-valuemax` / `-valuetext` plus arrow keys on knobs, dials and faders. Drag-only is an SC 2.1.1 failure. | style |
| D4 | Latching buttons use `<button aria-pressed>`; bypass switches use `role="switch" aria-checked`; neither is on a link. | style |
| D5 | DOM order equals reading order. Panel geometry is built with CSS Grid placement, not absolute positioning (SC 1.3.2). | core |
| D6 | The page reflows at 320px with no two-dimensional scrolling; no fixed-width hardware panel below 640px (SC 1.4.10). | style |
| D7 | Uppercase letterpress labels survive the SC 1.4.12 text-spacing overrides — line-height 1.5, letter-spacing 0.12em — without clipping. | style |

## E. Media queries and motion

| # | Check | Owner |
|---|---|---|
| E1 | A `@media (forced-colors: active)` block exists, uses system colour keywords, and gives every control a real border. No `forced-color-adjust: none` on a text-bearing element. | core |
| E2 | That block **hides the grain explicitly** (`display: none`). `background-image: none` does not apply to `url()` backgrounds, so an SVG data-URI grain survives forced-colors and can wreck legibility. | style, scan |
| E3 | A `prefers-reduced-motion: reduce` block exists and zeroes durations. | core |
| E4 | Under reduce, the travel is removed and the **pressed appearance is preserved** — the inset swap is an SC 1.4.11 state indicator, so it stays and simply arrives instantly. | style, scan |
| E5 | A `prefers-contrast: more` block exists and sets the grain opacity to 0, darkens ink and borders, and flattens the gradient spread to about 6%. | style, scan |
| E6 | Where the hybrid layers anything translucent over the material, a `prefers-reduced-transparency: reduce` block collapses it to an opaque fill — treated as progressive enhancement, since Safari does not support the query as of August 2026. | style, scan |
| E7 | Zero `transition` or `animation` declarations target `box-shadow`, `background-image` or gradient stops, and no `@keyframes` mutates them. | style, scan |
| E8 | The grain layer is never animated, and neither is any gradient stop. | style, scan |
| E9 | Hover brightens rather than raises: no elevation change on hover, because pointer hover is not a physical event. | style |

## F. Budgets

| # | Check | Budget | Owner |
|---|---|---|---|
| F1 | Grain layers per scroll container | ≤ 1, on the chassis | style, scan |
| F2 | Grain opacity | ≤ 0.06 light, ≤ 0.08 dark | style, scan |
| F3 | Decorative image bytes per route | ≤ 60 KB | style |
| F4 | Any single raster texture | ≤ 40 KB, none with text baked in | style, scan |
| F5 | Emitted CSS, tokens + component layer | ≤ 8 KB gzipped | style |
| F6 | Simultaneously animating 4-layer shadows | ≤ 60 | style |
| F7 | Backdrop blur, hybrid only | radius ≤ 12px, ≤ 2 backdrop-filtered elements per viewport | style, scan |
| F8 | `will-change` | only on elements about to animate, and released afterwards | style, scan |
| F9 | Interaction to next paint on a Moto G-class device | ≤ 200 ms | style |
| F10 | Long tasks attributable to style recalculation on hover | none > 50 ms | style |

## G. Notes the report must carry regardless of pass or fail

- The material assignment for every rewritten component — which material, which radius,
  which ramp — and whether the ramp came from §5's four resolved materials or was derived
  under §13 step 2 and re-measured.
- The list of every intensity clamp and context cap that fired, with requested and applied
  values, including the ones that changed nothing.
- The list of every anti-pattern requested and refused, with the alternative offered.
- Anything that could not be verified statically: rendered contrast against a grained and
  gradient-filled surface, real Windows High Contrast behaviour, computed target size in
  a dial cluster, actual gzipped byte counts, and interaction-to-next-paint on a real
  mid-range Android. These go in Manual TODOs, not in the pass column.
