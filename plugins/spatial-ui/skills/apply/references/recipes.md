# Spatial UI recipes — condensed

Source of truth: `docs/10-spatial-ui.md` §5. The full listings are in the doc; this file is
the shape and the invariants, so the skill can emit correct code without re-reading 400
lines of CSS, TSX, Swift and Kotlin. Where a recipe is short enough to be safer quoted than
paraphrased, it is quoted.

Every recipe below assumes `assets/tokens.css` is loaded. **A component sheet declares no
tokens of its own.** It consumes `--sp-*` and supplies inline fallbacks in the form
`var(--sp-dur-depth, 320ms)`, never `--sp-dur-depth: 320ms`. That is the difference between
a component that respects the app's theme and one that silently overrides it.

## 1. The three primitives

Everything else is these three plus a rung.

```css
/* The stage: the ONLY element that owns a camera. Never body, never html,
   never an ancestor of position: fixed chrome. */
.sp-stage {
  position: relative;
  perspective: var(--sp-perspective);
  perspective-origin: var(--sp-perspective-origin);
  transform-style: preserve-3d;
  max-width: var(--sp-comfort-width);
  margin-inline: auto;
  background: radial-gradient(120% 90% at 50% 0%, var(--sp-env-2), var(--sp-env));
  min-height: 100svh;
  isolation: isolate;
}

/* The depth utilities: level, counter-scale and shadow pair, always all three. */
.sp-depth-1 { transform: translateZ(var(--sp-z-1)) scale(var(--sp-k-1)); box-shadow: var(--sp-shadow-1); }
.sp-depth-2 { transform: translateZ(var(--sp-z-2)) scale(var(--sp-k-2)); box-shadow: var(--sp-shadow-2); }
.sp-depth-3 { transform: translateZ(var(--sp-z-3)) scale(var(--sp-k-3)); box-shadow: var(--sp-shadow-3); }
.sp-depth-4 { transform: translateZ(var(--sp-z-4)) scale(var(--sp-k-4)); box-shadow: var(--sp-shadow-4); }
.sp-depth-5 { transform: translateZ(var(--sp-z-5)) scale(var(--sp-k-5)); box-shadow: var(--sp-shadow-5); }
```

Three invariants in those five lines. **Every z carries its counter-scale** — without it
the panel grows as it comes forward and reads as a zoom, not a depth. **Every z carries a
shadow *pair*** — a tight contact shadow plus a wide ambient one; a single shadow reads as
flat-design elevation. **Nothing lands between rungs.**

The panel itself is border-first, and the glass is added only where the browser can
actually sample a backdrop:

```css
.sp-panel {
  position: relative;
  transform-style: preserve-3d;
  border-radius: var(--sp-radius-panel);
  background: var(--sp-panel);
  border: 1px solid var(--sp-hairline);
  color: var(--sp-ink-1);
  transition:
    transform var(--sp-dur-depth) var(--sp-ease-depth),
    box-shadow var(--sp-dur-depth) var(--sp-ease-depth),
    background-color var(--sp-dur-hover) linear;
}

@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .sp-panel {
    -webkit-backdrop-filter: blur(var(--sp-blur)) saturate(var(--sp-saturate));
    backdrop-filter: blur(var(--sp-blur)) saturate(var(--sp-saturate));
  }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .sp-panel { background: var(--sp-panel-opaque); }
}
```

`-webkit-backdrop-filter` goes on the line **before** the unprefixed property, and the
opaque branch lives outside the `@supports` so a browser with no blur gets a solid panel
rather than unreadable text on a see-through box.

The 1px specular rim is a masked pseudo-element, not a second border:

```css
.sp-panel::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(180deg, var(--sp-specular), transparent 42%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
  pointer-events: none;
}
```

## 2. Orbiter — the one component with three accessibility strings attached

Detached chrome at depth level 1, `--sp-orbiter-offset` (20px) clear of the panel edge,
`--sp-panel-legible` rather than `--sp-panel` because it floats over the panel *and* the
room, and `--sp-blur-strong`.

```css
.sp-orbiter {
  position: absolute; left: 50%; bottom: calc(-1 * var(--sp-orbiter-offset));
  display: flex; gap: var(--sp-gap-target); padding: 6px;
  border-radius: var(--sp-radius-capsule);
  background: var(--sp-panel-legible);
  border: 1px solid var(--sp-hairline);
  box-shadow: var(--sp-shadow-1);
  transform: translate3d(-50%, 0, var(--sp-z-1)) scale(var(--sp-k-1));
}
```

The three strings, all of them from §7 of the doc:

1. **The hover target spans the 20px gap (SC 1.4.13).** An orbiter that appears on hover
   and vanishes when the pointer crosses the gap between panel and orbiter fails outright.
   Extend the hoverable area with a transparent `::after` on the panel or a padded wrapper
   — never with a `transition-delay`, which is a guess about pointer speed.
2. **It is a DOM child of its panel, or `aria-owns`-linked to it.** Visual position here
   is set by transforms, which the accessibility tree cannot see.
3. **It must not obscure a focused control (SC 2.4.11).** It sits in front by
   construction, so every focusable behind it needs `scroll-margin` compensation, or focus
   moves the orbiter.

Escape dismisses it. Overlap with the panel never exceeds 50% of the orbiter's own size —
visionOS ornaments overlap the window's bottom edge by 20pt and Android XR orbiters sit
20dp clear at 15-16dp of z-elevation, which is the range those two numbers come from.

## 3. Tailwind v4

`../assets/tokens.theme.css` is the `@theme` block. Two invariants: `@theme` is never
nested inside an at-rule, and theme switching happens outside it. The depth utilities are
**not** in the theme file — they carry a per-element local and an `@supports` ladder rather
than a token value — so emit them into the project's own sheet:

```css
/* Underscore-prefixed local: a bare `--z` is a name a host app is very likely to
   have taken already, and it would feed both calcs below. */
@utility sp-depth-* {
  --_z: --value(integer);
  transform: translateZ(calc(var(--_z) * 8px + 8px))
             scale(calc(1 - (var(--_z) * 8px + 8px) / 1200));
}

@utility sp-glass {
  background-color: var(--color-sp-panel);
  border: 1px solid var(--color-sp-hairline);
  @supports (backdrop-filter: blur(1px)) {
    backdrop-filter: blur(24px) saturate(165%);
    -webkit-backdrop-filter: blur(24px) saturate(165%);
  }
  @media (prefers-reduced-transparency: reduce) {
    background-color: var(--color-sp-panel-legible);
    backdrop-filter: none;
  }
  @media (forced-colors: active) {
    background-color: Canvas;
    border-color: CanvasText;
    backdrop-filter: none;
  }
}
```

Two naming traps, both of which fail silently:

- The ladder is registered as `--spacing-sp-z0` … `--spacing-sp-z5`, so the generated
  utilities are `translate-z-sp-z0` … `translate-z-sp-z5`. **The key name is what appears
  in the utility.** Registering them as `--spacing-sp-1` … `-5` generates a different set
  and every class in the markup silently does nothing.
- `max-*` in v4 is reserved for breakpoint and container-query negation, so
  `max-pointer-coarse:` **does not compile at all** — and the 60px gaze-target upsize, this
  style's headline accessibility rule, would never apply. The upsize is `pointer-coarse:`;
  the negation, where you genuinely want it, is `not-pointer-coarse:`.

## 4. Gaze-grade controls

```css
.sp-btn {
  min-height: max(var(--sp-target-floor), var(--sp-target-pointer));
  min-width:  max(var(--sp-target-floor), var(--sp-target-pointer));
  border-radius: var(--sp-radius-capsule);
  font-size: var(--sp-font-min);
  font-weight: var(--sp-weight-body);
}
@media (pointer: coarse), (hover: none) {
  .sp-btn {
    min-height: max(var(--sp-target-floor), var(--sp-target-gaze));
    min-width:  max(var(--sp-target-floor), var(--sp-target-gaze));
  }
}
.sp-btn:focus-visible { outline: 3px solid #0a63f8; outline-offset: 3px; }
```

The `max()` is what makes `--sp-target-floor` load-bearing rather than decorative: even if
a host theme overrides `--sp-target-pointer` downward, the rendered control cannot fall
under the 24px SC 2.5.8 floor. Size from the tokens, never from a literal — §7 notes that
the failure mode here is the opposite of the usual one. Nobody sets the token too low;
somebody hard-codes `min-height: 32px` on an orbiter button to keep the capsule slim, and
the literal beats the token.

Focus needs two rings on glass, because a single outline colour may match either the panel
or the backdrop: an inner 1px `rgba(255,255,255,.9)` ring inside the border box and an
outer 3px solid brand ring at 3px offset. Never animate a focus ring, and never rely on
the depth lift alone — a keyboard user who cannot perceive depth gets nothing from it.

## 5. Parallax, and the reduced-motion contract

Two custom properties, one rAF-coalesced write per frame, and — the part that gets skipped
— the **listener detached** rather than zeroed when motion is off.

```js
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const fine   = window.matchMedia("(pointer: fine)");

function sync() {
  const on = fine.matches && !reduce.matches;
  stage.dataset.tilt = on ? "on" : "off";
  stage.removeEventListener("pointermove", onMove);
  stage.removeEventListener("pointerleave", reset);
  if (on) {
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", reset, { passive: true });
  } else {
    reset();
  }
}
reduce.addEventListener("change", sync);
fine.addEventListener("change", sync);
sync();
```

`onMove` normalises the pointer to −1…1 against the stage's bounding box, clamps, and
schedules one `requestAnimationFrame` write of `--sp-px` / `--sp-py`. A zeroed listener
still runs `getBoundingClientRect` on every pointer move, which is the cost the detach
exists to remove; and both media queries are re-read on `change`, because a user can turn
Reduce Motion on while the page is open.

The gate on `(pointer: fine)` is not a performance nicety. A finger on glass has no
meaningful camera position, so touch users get no tilt at all — and under
`(pointer: coarse)` there is no pointer parallax to compute, which removes most of the cost
automatically.

Layers consume the two properties with a per-element depth multiplier:

```css
@property --sp-px { syntax: "<number>"; initial-value: 0; inherits: true; }
@property --sp-py { syntax: "<number>"; initial-value: 0; inherits: true; }

.sp-layer {
  position: absolute; inset: 0; pointer-events: none;
  transform: translate3d(
    calc(var(--sp-px) * var(--sp-parallax-translate) * var(--_depth, 1)),
    calc(var(--sp-py) * var(--sp-parallax-translate) * var(--_depth, 1)), 0);
}
```

`--_depth` is underscore-prefixed on purpose: a bare `--depth` on a host ancestor would
silently feed this translate.

The scroll variant uses `animation-timeline: scroll()`, which runs off the main thread in
Chromium and is dramatically cheaper than a scroll listener. Scroll-driven animations are
an Interop 2026 focus area, so support is actively converging. Its amplitude cap is ±40px
of z per viewport of scroll, separate from the pointer cap.

## 6. React

One module, zero dependencies beyond React 18+. `SpatialStage` owns the camera, the
`--sp-amp` / `--sp-tilt` amplitudes and the pointer listener; `SpatialPanel` consumes the
ladder; `SpatialOrbiter` places detached chrome; `SpatialDialog` adds the −125px pushback
on the content behind it.

Notes that are not obvious from the CSS:

- The panel computes `k = 1 − z / perspective` from the stage's context value, so changing
  the camera on the stage re-derives every counter-scale in the tree. Do not hard-code it.
- The lift on hover is `depth + 1`, floored at 5, and it is driven by
  `onPointerEnter` / `onPointerLeave` **and** `onFocusCapture` / `onBlurCapture`, so
  keyboard and mouse agree. The blur handler checks `currentTarget.contains(relatedTarget)`
  so focus moving *within* the panel does not drop it.
- `onPointerMove` early-returns on `event.pointerType !== "mouse"`, which is the React
  equivalent of the `(pointer: fine)` gate.
- `willChange: "transform"` is set only while the panel is animating, never on the base
  style. A permanent `will-change` on every panel in a grid pre-promotes every layer and
  exhausts GPU memory on mid-range Android.

## 7. Native targets

**SwiftUI (visionOS 2+ / 26+).** Three scene types are the whole model: `WindowGroup` (a
flat glass window), `WindowGroup` with `.windowStyle(.volumetric)` (a bounded 3D volume),
and `ImmersiveSpace`. `.defaultSize(width: 1280, height: 720)` is the visionOS window
default and is about 0.94 m × 0.53 m of real glass at 1360 pt per metre. Convert
`.background(.thinMaterial)` to `.glassBackgroundEffect()`, add `.hoverEffect(.highlight)`
for gaze feedback, size buttons at `minWidth: 60, minHeight: 60`, and turn a bottom toolbar
into `.ornament(attachmentAnchor: .scene(.bottom))` with a −20pt offset.

**Jetpack Compose for XR.** `Subspace` wraps the content, the root layout becomes a
`SpatialPanel` sized with `SubspaceModifier` under the 2560 × 1800 dp cap, the nav bar
becomes an `Orbiter` at 20dp offset, and the manifest gains
`android:enableOnBackInvokedCallback="true"` or back navigation from a spatial panel
misbehaves. **Pin an explicit `1.0.0-alphaNN`**: the API has been alpha since December 2024
and the surface is not stable. `movable()` and `resizable()` are exactly the modifiers SC
2.5.7 applies to — every panel carrying either needs a keyboard path and a visible reset.

**Figma.** Apple ships a visionOS design kit and Google an Android XR Design System, both
in the Figma Community; the `XR Design Tools` plugin's FOV Guide Generator is the fastest
way to check a layout against the 41° cone. Figma has no native z-depth model, so encode
depth as a named layer style plus a shadow token and let code apply the transform.

## 8. Layout consequences that bite

- **`perspective` establishes a containing block for `position: fixed` and
  `position: absolute` descendants.** A fixed header inside the stage stops being fixed.
  This is the most common bug in spatial layouts. Keep the stage a sibling of fixed chrome,
  never an ancestor. So does any non-`none` `transform`, `filter` or `will-change:
  transform` — the containing-block rule is not specific to `perspective`.
- **`transform-style: preserve-3d` promotes every transformed child to its own composited
  layer.** Layer memory is `width × height × 4 bytes`; one full-viewport 1440 × 900 layer
  costs 4.94 MiB, and twenty of those is a real problem on a 4 GB Android device.
- **`preserve-3d` on a scrolling list container is a refusal, not a warning.** Every row
  becomes a layer.
- **`box-shadow` does not participate in layout.** The ambient shadow at level 5 reaches
  96px; an ancestor with `overflow: hidden` clips it and the depth quietly disappears.
- **A 3D-transformed element cannot be `position: sticky` in a way anyone expects.** Put
  stickiness outside the stage.
- Below 640px, drop to `perspective: none` and a single column. The stage still reflows at
  320 CSS px without two-dimensional scrolling, which is SC 1.4.10.
