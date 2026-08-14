# Spatial UI audit checklist

Two lists merged: the self-run validation checklist from `docs/10-spatial-ui.md` §13 and the
pass/fail checklist from §7, extended with §6's motion rules and §8's budgets. Run in this
order.

Every row is marked with who runs it:

- **core** — `ui-morphism-core:a11y-validate` runs it. Same logic for all ten styles; never
  reimplement it here, and in particular never write a second contrast, luminance or
  alpha-compositing function. There must be exactly one.
- **scan** — `../../apply/scripts/spatial-scan.mjs` runs it. Mechanical, static,
  style-specific. The rule id in the Note column is the id the scanner prints.
- **style** — this plugin's own reading. It encodes a fact about spatial UI, not a fact
  about accessibility, so neither of the other two has any business knowing it. Where a row
  can only be settled in a rendered browser it says so, and it goes in the report's Manual
  TODOs rather than in the pass column.

Record each row as pass / fail / not-applicable with the exact failing selector and, for
contrast rows, the computed ratio to three decimal places, unrounded.

**Why the order is what it is.** Doc §7 rates this style's accessibility risk high because
it stacks three independently hazardous mechanisms: translucency over a backdrop nobody
controls, motion the user did not initiate, and hierarchy encoded in a channel assistive
technology cannot read. Section A covers the first, E the second, G the third. A clean
section A proves none of the other two is handled.

## A. Contrast and material

| # | Check | Owner | Note |
|---|---|---|---|
| A1 | Every glass surface carrying text measures ≥ 4.5:1 against the **worst-case** backdrop, not the mock's backdrop. ≥ 3:1 for ≥ 24px or ≥ 19px bold. Unrounded: 4.497:1 fails 4.5:1 and 2.96:1 fails 3:1 | core | One row per text token per extreme of the backdrop. A single number for a glass surface is a wrong number |
| A2 | The composite is computed **per 8-bit channel in gamma-encoded sRGB** — `C = α·C_fill + (1−α)·C_bd` — and then linearised, never by averaging the two luminances | core | The averaging model claims 4.52:1 where the per-channel model measures 1.50:1. Any figure in the source or in a code comment that could only have come from the wrong model is a finding in its own right |
| A3 | Over a backdrop the project does not control, dark glass under light body text is at α ≥ 0.62 and light glass under dark body text at α ≥ 0.60 | style | Light glass's contrast floor is 0.49; 0.60 is the legibility floor, because below it the backdrop imagery stays legible *through* the text |
| A4 | `--sp-panel` at 0.72 and `--sp-panel-legible` at 0.92 / 0.90 are unmodified, or the modification was re-measured | style | §4's shipped worst cases: 9.53:1 and 6.52:1 for `--sp-panel`, 15.87:1 and 12.37:1 for `--sp-panel-legible` |
| A5 | Any panel alpha at or below 0.55 is paired with `backdropControl: owned` and a luminance-capped ground | style | The knob floor is 0.55 and doc §13 measures dark glass there at 3.71:1 under `#F5F6FA`. Below the arbitrary-backdrop floor it is a bet on a pixel nobody has seen |
| A6 | Where a panel edge is the sole indicator of a control boundary it clears 3:1 (SC 1.4.11) | core | `--sp-hairline` at `rgba(16,16,20,0.12)` measures 1.29:1 and is decorative. The boundary-carrying alpha is `rgba(16,16,20,0.45)` at 3.05:1; `0.42` reaches only 2.79:1 and fails |
| A7 | `--sp-saturate` accompanies every `blur()` | style | Gaussian blur averages colour toward grey; 165% light / 150% dark is what stops the refraction going dead |
| A8 | An opaque mirror exists for every glass token, and `material: solid` emits no `backdrop-filter` at all | style | `--sp-panel-opaque` is the mirror |
| A9 | No state, error, selection or category conveyed by colour alone (SC 1.4.1) | core | |
| A10 | Disabled controls do not rely on `opacity` alone | style | §6 pins disabled to level 0 at opacity 0.40 with the shadow removed — the pinning and the shadow removal are the state, not the fade |

## B. Depth, camera and geometry

| # | Check | Owner | Note |
|---|---|---|---|
| B1 | Every non-zero `translateZ` carries its `scale(1 − z / perspective)` | scan | `counter-scale`. A translateZ without its counter-scale is a zoom, not a depth. **A failure here is a fail, not a warning** |
| B2 | No `position: fixed` descendant of any `perspective`, `transform`, `filter` or `will-change: transform` subtree, and no `perspective` on `html`, `body` or `:root` | scan | `fixed-in-camera`, `camera-on-root`. The scanner adjudicates textual descendants only; whether a fixed element is *rendered* inside the stage is a DOM question and belongs in Manual TODOs. **A failure here is a fail** |
| B3 | Every z is a rung of the six-step ladder — 0.1 / 16 / 24 / 32 / 40 / 56, times `depthScale`. Nothing lands between rungs | scan | `ladder-quantisation`. A literal on the base ladder is still a finding: `depthScale` moves the rungs before the CSS is written and a literal does not move with them |
| B4 | Rung assignment matches the fixed map: orbiters and floating chrome at 1, raised panels at 2, popovers and menus at 3, sheets at 4, modal dialogs at 5 | style | Intensity changes how far apart the rungs are, never which rung a component sits on |
| B5 | Every rung emits three things together — `translateZ`, the counter-scale and the matching `--sp-shadow-N` **pair** | style | A single shadow reads as flat-design elevation. Contact plus ambient is the style |
| B6 | `--sp-z-0` is a `0.1px` sentinel and is never scaled by `depthScale` | style | It forces a stacking context; it does not express a distance |
| B7 | A modal at level 5 pushes its content panel back to `--sp-z-push` (−125px) | style | Android XR `SpatialDialog` behaviour |
| B8 | `transform-style: preserve-3d` nests ≤ 3 deep and never sits on a scrolling list container | scan | `preserve-3d-nesting`, `preserve-3d-scroller`. The scanner's nesting count is textual and is a floor; confirm the runtime depth in the browser's layer panel |
| B9 | No text plane rotated more than 12° from the viewing plane | scan | `text-plane-rotation`. Out-of-plane only: an in-plane `rotate()` turns the glyphs without tilting the surface |
| B10 | The stage's `max-width` comes from `--sp-comfort-width` (1413px) or `--sp-comfort-width-desk` (1693px), not from a round number | style | The 41° content cone at 500mm and at 600mm |
| B11 | Corners are concentric: outer radius equals inner radius plus the padding between them | style | Mismatched arcs are obvious on a surface seen off-axis |
| B12 | No ancestor `overflow: hidden` clips a level-5 ambient shadow, which reaches 96px | style | `box-shadow` does not participate in layout, so the depth quietly disappears rather than erroring |

## C. Focus

| # | Check | Owner | Note |
|---|---|---|---|
| C1 | A `:focus-visible` rule exists on every focusable element, uses `outline` rather than `box-shadow`, has an offset, and clears 3:1 | core | **A failure here is a fail** |
| C2 | No `outline: none` survives anywhere without a replacement outline in the same rule set | core | **A failure here is a fail** |
| C3 | The indicator is a two-ring pattern: an inner 1px light ring inside the border box and an outer 3px solid ring at 3px offset | style | A single outline colour on glass may match either the panel or the backdrop |
| C4 | Focus never relies on the depth lift alone, and focus rings are never animated | style | §6 gives focus-visible no z change at all: a keyboard user who cannot perceive depth would get nothing from a lift |
| C5 | Focus-within on a panel matches the hover lift, so keyboard and pointer agree | style | |
| C6 | No focused control is obscured by an orbiter, a level-5 dialog or a sticky depth layer (SC 2.4.11) | style | Floating surfaces sit in front by construction. Static analysis lists the candidates; only a tab-through settles it. Manual TODO |

## D. Targets, input and the dragging alternative

| # | Check | Owner | Note |
|---|---|---|---|
| D1 | Every movable or resizable panel has a keyboard path **and** a visible non-drag control (SC 2.5.7) | scan + style | `drag-alternative`. The criterion this style breaks most reliably and the one nobody discusses. **A missing alternative is a fail on its own, regardless of everything else on the page.** The scanner finds the affordance and the absence of a handler; only reading tells you whether the handler moves the panel and whether the reset is reachable |
| D2 | The check above was run against every framework in the project — CSS `resize`, drag libraries, `onPointerDown` repositioning, Compose XR `movable()` / `resizable()`, SwiftUI `DragGesture` | style | A CSS `resize: both` handle is a drag affordance that nobody reads as one |
| D3 | Interactive targets size from `--sp-target-pointer` (44px), and from `--sp-target-gaze` (60px) under `(pointer: coarse)` or `(hover: none)`, wrapped in `max()` with `--sp-target-floor` | scan + core | `target-literal` finds the literal; the size verdict against SC 2.5.8 is core's |
| D4 | Nothing computes below the 24px floor, ever | core | |
| D5 | ≥ 8px separation between adjacent targets; 16px between stacked buttons | style | |
| D6 | `target: headset` or `both` forces the 60px floor everywhere, and `density: compact` with a headset target was rejected rather than clamped | style | Compact plus 60px targets plus 8px separation is a contradiction |
| D7 | The orbiter's hover target spans the 20px gap, and Escape dismisses it (SC 1.4.13) | style | A `transition-delay` is a guess about pointer speed, not a hover target |
| D8 | The orbiter overlaps its panel by no more than 50% of its own size | style | visionOS ornaments overlap by 20pt; Android XR orbiters sit 20dp clear |
| D9 | Type is ≥ 14px at weight ≥ 500, and text scales to 200% without clipping inside a transformed panel (SC 1.4.4) | style | Transforms do not scale with font size, so this is tested, not assumed. Manual TODO |
| D10 | The page reflows to a single column with `perspective: none` at 320 CSS px and at ≤ 640px (SC 1.4.10) | style | |

## E. Motion and the media-query set

| # | Check | Owner | Note |
|---|---|---|---|
| E1 | A `prefers-reduced-motion: reduce` block exists and zeroes `--sp-parallax-translate` and `--sp-parallax-tilt` | core | |
| E2 | The pointer listener is **detached** under reduce, not merely zeroed, and both media queries are re-read on `change` | scan | `reduced-motion-detach`. A zeroed listener still runs `getBoundingClientRect` on every pointer move. In JSX the detach is the conditional binding, and static analysis cannot see the difference between an unbound handler and one that returns early — read it |
| E3 | The reduction keeps the depth and drops the movement: static `translateZ`, static shadows and static counter-scale all survive | style | The style is not turned off under reduce. What triggers symptoms is optical flow with no cause |
| E4 | Parallax is gated on `(pointer: fine)` as well | style | A finger on glass has no meaningful camera position |
| E5 | Pointer parallax is ≤ 12px of translate and ≤ 4° of tilt at every intensity, including 100 | style | §13's knob row tops out at 24px / 8° and covers pointer **and scroll** amplitude together; §4, §6 and §10 all cap the pointer pair at 12px / 4°. The tension is recorded in `../../apply/references/tokens.md` §5, not resolved silently |
| E6 | Scroll-driven depth is ≤ ±40px of z per viewport of scroll, and does not continue after the user stops | style | Motion that continues is auto-playing motion (SC 2.2.2) |
| E7 | Only `transform`, `opacity` and discrete shadow swaps animate | scan | `animated-property`. `backdrop-filter`, `perspective`, `width` and `height` are errors; `transition: all` is a warning because it silently includes them |
| E8 | No auto-playing camera fly-through, idle drift or device-orientation parallax | style | |
| E9 | ≤ 3 panels change depth at once | style | Each triggers a re-raster of its own backdrop. Manual TODO where the count depends on data |
| E10 | A `prefers-reduced-transparency: reduce` block swaps every glass fill to its opaque token and sets blur to 0 | core | Chrome and Edge 118+ ship the query, Firefox has it behind a flag, **Safari does not support it as of August 2026**. Pair it with `prefers-contrast: more` and an in-app toggle |
| E11 | A `forced-colors: active` block sets `perspective: none` and `transform: none` | scan | `forced-colors-flatten`. Forced colors discards `backdrop-filter` and `box-shadow` and **keeps** `transform`, so doing nothing leaves edgeless panels floating at odd angles |
| E12 | That block uses only system colour keywords, and `forced-color-adjust: none` appears on the panel background only — never on a text-bearing element | core | |
| E13 | Every `backdrop-filter` sits inside `@supports`, with a non-glass alternative outside it | style | The opaque branch lives outside the `@supports`, so a browser with no blur gets a solid panel rather than unreadable text on a see-through box |

## F. Budgets

| # | Budget | Limit | Owner |
|---|---|---|---|
| F1 | Concurrent `backdrop-filter` surfaces on screen | ≤ 6 | scan (`backdrop-census`) + style for the on-screen count |
| F2 | Total composited layers | ≤ 25 | scan (`gpu-layer-memory`), as an estimate |
| F3 | GPU layer memory at the target viewport | ≤ 96 MiB | scan, as an estimate: 4.94 MiB per full-viewport 1440 × 900 layer, counting selectors rather than elements, so it is a floor. Measure the real number in the browser's layer panel |
| F4 | Nested `preserve-3d` contexts | ≤ 3 deep | scan |
| F5 | Panels animating depth at once | ≤ 3 | style |
| F6 | Main-thread work per parallax frame | ≤ 1.5 ms | style — browser only, Manual TODO |
| F7 | Parallax input handling | 1 rAF-coalesced write per frame | style. Raw `pointermove` fires up to 1000 Hz on high-poll mice |
| F8 | Extra CSS for the whole style | ≤ 4 KB gzipped | style. Larger means a 3D library shipped by accident |
| F9 | Raster assets | 0 — the flat-screen dialect is CSS | style |
| F10 | Added JS | the parallax listener only, and 0 when parallax is off | style |
| F11 | Permanent `will-change` declarations | 0 | scan (`permanent-will-change`) |
| F12 | WebGL, if present at all | a separate performance conversation, lazy-loaded below the fold | style. `three` + `@react-three/fiber` + `@react-three/drei` is roughly 600 KB - 1 MB gzipped before the scene |

## G. Semantics and DOM order

| # | Check | Owner | Note |
|---|---|---|---|
| G1 | Every depth level ≥ 3 has a matching role: `<dialog>` / `aria-modal` at 5, `role="menu"` or a popover at 3 | style | Depth is invisible to the accessibility tree (SC 1.3.1) |
| G2 | No state, selection or hierarchy relationship is encoded in depth alone | style | The style's defining risk. A "selected" card one rung forward says nothing to a screen reader |
| G3 | DOM order matches reading order, not visual depth order | core | Visual position here is set by transforms |
| G4 | Every orbiter is a DOM child of its panel, or `aria-owns` / `aria-controls`-linked to it | style | |
| G5 | Depth changes are announced only when they carry meaning — a modal opening is `aria-modal`, a hover lift is nothing | style | |
| G6 | Tab order does not jump between depth layers unpredictably, and modal levels trap focus | style | Manual TODO: static analysis flags the risk, a tab-through confirms the order |
| G7 | Panels carry headings and landmarks so the hierarchy survives with the camera turned off | style | |
| G8 | On a headset build: a motion-agnostic input path, remappable gestures, a safe-harbour shortcut, flicker under 3 flashes per second, a mono-audio option, signing video at ≥ 1/3 of the original stream, and interaction-speed controls | style | W3C XAUR, 25 August 2021 — still the only cross-vendor accessibility document for spatial interfaces. Not applicable to `target: screen` |

## H. Notes the report must carry regardless of pass or fail

- The **depth ledger**: per panel, the depth level, the z in px, whether a counter-scale
  accompanies it, the shadow pair, and the semantic role carrying the same information.
- The **camera containment** table: every `position: fixed` or `sticky` element found inside
  a perspective or transform subtree, by selector and file, and whether the finding was
  textual or confirmed against the markup.
- Which dialect the project is in — native XR or the flat-screen depth idiom — because half
  the rows above read differently in each.
- Every intensity clamp and context cap that fired, with the requested and the applied value,
  including the ones that changed nothing.
- Every anti-pattern requested and refused, with the alternative offered.
- Anything that could not be verified statically, named by **method** rather than by concern:
  sample the composited pixels behind every glass panel at three scroll positions; tab
  through and confirm no focused control sits behind an orbiter or a level-5 dialog; drive
  every movable panel with the keyboard alone; measure real GPU layer memory in the browser's
  layer panel rather than from the estimate; test at 200% text zoom inside a transformed
  panel; test real Windows High Contrast behaviour. These go in Manual TODOs, never in the
  pass column.
