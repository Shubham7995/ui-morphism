# Neumorphism recipes — condensed

Source of truth: `docs/02-neumorphism.md` §5. The full listings are in the doc; this
file is the shape and the invariants, so the skill can emit correct code without
re-reading 400 lines of CSS and TSX. Where a recipe is short enough to be safer quoted
than paraphrased, it is quoted.

Every recipe assumes `../assets/tokens.css` is loaded. **A component sheet declares no
tokens of its own.** It consumes `--nm-*` and supplies inline fallbacks in the form
`var(--nm-t-press, 120ms)`, never `--nm-t-press: 120ms`. That is the difference between
a component that respects the app's theme and one that silently overrides it.

## 1. The shared primitive

Everything else is this plus a rung and a shape.

```css
.nm-surface {
  background: var(--nm-surface);
  border-radius: var(--nm-r-card);
  box-shadow: var(--nm-raised-md);
  padding: var(--nm-sp-5);
}
```

Note what is *not* here: a border. A `.nm-surface` is a decorative plane, and a
decorative plane may be bounded by shadow alone. The moment it becomes interactive it
gets the hairline, and that transition is the one rule this whole plugin exists to
enforce.

## 2. Button — the signature control

```css
.nm-btn {
  -webkit-appearance: none;
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nm-sp-2);
  min-height: 44px;
  min-width: 44px;
  padding: var(--nm-sp-3) var(--nm-sp-5);
  font: 600 var(--nm-fs-200) / 1.2 var(--nm-font);
  color: var(--nm-text);
  background: var(--nm-surface);
  border: 1px solid var(--nm-hairline);   /* SC 1.4.11 carrier */
  border-radius: var(--nm-r-ctl);
  box-shadow: var(--nm-raised-sm);
  cursor: pointer;
  transition:
    box-shadow var(--nm-t-hover) var(--nm-e-out),
    transform  var(--nm-t-press) var(--nm-e-out),
    border-color var(--nm-t-hover) linear;
}

.nm-btn:hover { box-shadow: var(--nm-raised-md); transform: translateY(-1px); }
.nm-btn:active,
.nm-btn[aria-pressed="true"] {
  box-shadow: var(--nm-pressed-sm);
  transform: translateY(0);
  border-color: var(--nm-accent);
}
.nm-btn:focus-visible { outline: 3px solid var(--nm-accent); outline-offset: 3px; }
.nm-btn:disabled {
  box-shadow: none;
  border-color: color-mix(in oklch, var(--nm-hairline) 55%, var(--nm-surface));
  color: var(--nm-text-mut);
  cursor: not-allowed;
}
.nm-btn--primary {
  background: var(--nm-accent);
  color: var(--nm-accent-ink);
  border-color: var(--nm-accent);
}
```

Four invariants in that block, each of which is a defect if dropped:

- **The border is not decoration.** It is the only boundary that clears 3:1. A
  borderless `.nm-btn` is the anti-pattern this style is best known for.
- **The pressed state changes `border-color` as well as the shadow.** The shadow alone
  is 1.5:1 and cannot carry state — that is SC 1.4.1 and SC 1.4.11 failing together.
- **Focus is an `outline`, at 3px, offset 3px.** Offset 3px so the ring clears the
  blurred halo. Never `box-shadow`, which is invisible against an extrusion and deleted
  outright in forced-colors mode.
- **Disabled removes the extrusion.** Removing the shadow is the clearest disabled
  signal this style has, and it is paired with a real `disabled` attribute and a muted
  border rather than an `opacity` fade.

`.nm-btn--primary` is the one place the surface colour legitimately differs from its
parent: an accent fill is no longer a same-hue extrusion, and it is not pretending to
be. That is the escape hatch for "this control must be found", and §12 notes the
sharper version — a single brutalist CTA on a neumorphic canvas — as the one working
recipe for the contrast collision this style otherwise cannot produce.

## 3. Input — always pressed, never raised

An input is a well, not a button. It carries `--nm-pressed-md`, the hairline, a 44px
minimum height, and a focus outline at 2px offset rather than 3px because the ring sits
against an inset halo instead of an outset one.

```css
.nm-input {
  width: 100%;
  min-height: 44px;
  padding: var(--nm-sp-3) var(--nm-sp-4);
  font: 500 var(--nm-fs-300) / 1.4 var(--nm-font);
  color: var(--nm-text);
  background: var(--nm-surface);
  border: 1px solid var(--nm-hairline);
  border-radius: var(--nm-r-ctl);
  box-shadow: var(--nm-pressed-md);
  transition: border-color var(--nm-t-hover) linear;
}
.nm-input::placeholder { color: var(--nm-text-mut); }
.nm-input:focus-visible {
  outline: 3px solid var(--nm-accent);
  outline-offset: 2px;
  border-color: var(--nm-accent);
}
.nm-input[aria-invalid="true"] { border-color: var(--nm-danger); }
```

The invalid state tints the **border**, never the surface: tinting the surface breaks
the same-hue rule, and colour alone never carries an error — pair it with
`aria-invalid="true"` and a visible message.

Doc §2 records that the canonical CSS-Tricks reference says plainly this style "shouldn't
be applied to elements that can have various states, like inputs, select elements,
progress bars". That is not a reason to refuse an input; it is the reason the input
above is a well with a real border and a real accent, rather than a same-hue rectangle.

## 4. Toggle — where the accent does the work

The track is pressed, the thumb is raised and convex, and `aria-checked="true"` moves
the thumb **and** flips both the track border and the thumb fill to the accent. The
travel is 28px on a 64×36 track with a 26px thumb.

```css
.nm-toggle[aria-checked="true"] { border-color: var(--nm-accent); }
.nm-toggle[aria-checked="true"] .nm-toggle__thumb {
  transform: translateX(28px);
  background: var(--nm-accent);
  border-color: var(--nm-accent);
}
```

Position alone is not enough for a screen reader and colour alone is not enough for SC
1.4.1, so the element is a real `role="switch"` with `aria-checked`, or a native
checkbox with the visual on a sibling. The inset shadow communicates nothing to
assistive technology.

## 5. The four shape variants

`flat` (solid fill, outer shadow), `convex` (gradient +7% → −10%, outer shadow),
`concave` (the same stops reversed), `pressed` (`inset` on both shadows, no gradient).
These are shape indices 0/2/3/1 in neumorphism.io. One light source for the document —
top-left, gradient angle `145deg` — and every extruded element agrees with it. Mixed
diagonals are the most common amateur tell and §13 anti-pattern 8 refuses them.

```css
.nm-flat    { background: var(--nm-surface); box-shadow: var(--nm-raised-md); }
.nm-convex  { background: var(--nm-convex);  box-shadow: var(--nm-raised-md); }
.nm-concave { background: var(--nm-concave); box-shadow: var(--nm-raised-md); }
.nm-pressed { background: var(--nm-surface); box-shadow: var(--nm-pressed-md); }
```

## 6. The ten components the skill emits

`Button`, `IconButton`, `Card`, `Input`, `Textarea`, `Switch`, `Slider`,
`SegmentedControl`, `Well`, `Skeleton` — each with rest / hover / active / focus /
disabled / loading already wired. Notes that are not obvious from the button:

| Component | Style-specific requirement |
|---|---|
| `IconButton` | The most common pattern in this style and the most common failure. It must carry an `aria-label`; the React recipe warns in development when it does not. 44×44 minimum, measured on the border box and not the halo. |
| `Card` | `--nm-raised-md`, `--nm-r-card`, `--nm-sp-5` padding. Interactive cards get the hairline; purely decorative ones may be shadow-bounded. |
| `Textarea` | As `Input`, plus `min-height` rather than a fixed height, so a text-spacing override cannot clip it (SC 1.4.12). |
| `Slider` | Pressed track, raised thumb, accent fill on the filled portion. The thumb is 44px of hit area even when it draws smaller. |
| `SegmentedControl` | Selected segment goes pressed **and** takes the accent border **and** carries `aria-pressed` — three signals because the shadow is worth none. |
| `Well` | An inset container used for visual grouping. It needs a real `<fieldset>`/`<legend>` or `role="group"` + `aria-labelledby`, or the grouping exists only for sighted users. It uses `--nm-surface-sunken`; controls never do. |
| `Skeleton` | Pressed well plus a 1400ms linear translate sheen at 70% highlight opacity. Do not pulse the shadow itself. Under reduced motion the sheen stops and drops to `opacity: 0.35`. |

## 7. The three mandatory guard blocks

Every generated sheet carries all three. They are not optional and §13 anti-pattern 3
refuses to write files without the forced-colors one.

```css
@media (prefers-reduced-motion: reduce) {
  .nm-btn, .nm-toggle__thumb, .nm-input { transition-duration: 1ms; }
  .nm-btn:hover { transform: none; }
  .nm-skeleton::after { animation: none; opacity: 0.35; transform: none; }
}

@media (forced-colors: active) {
  .nm-surface, .nm-btn, .nm-input, .nm-toggle, .nm-toggle__thumb,
  .nm-flat, .nm-convex, .nm-concave, .nm-pressed {
    box-shadow: none;
    background: Canvas;
    border: 2px solid ButtonText;
    forced-color-adjust: none;
  }
  .nm-btn { color: ButtonText; }
  .nm-btn:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
  .nm-btn[aria-pressed="true"],
  .nm-toggle[aria-checked="true"] { border-color: Highlight; background: Highlight; color: HighlightText; }
  .nm-btn:disabled { color: GrayText; border-color: GrayText; }
}

@media (update: slow), (max-width: 480px) and (prefers-reduced-transparency: reduce) {
  .nm-surface, .nm-flat, .nm-convex, .nm-concave {
    box-shadow: 0 2px 6px var(--nm-shadow-dark);
  }
}
```

The forced-colors block is the whole visual language being rebuilt from nothing. The
user agent forces `box-shadow: none`, so every surface that was defined by shadow alone
becomes an unbordered rectangle of `Canvas` on `Canvas`. `forced-color-adjust: none`
appears there only on non-text-bearing surfaces; never on text.

`border: 2px solid transparent` at rest is a useful addition on decorative surfaces:
transparent borders are forced opaque in forced-colors mode, so structure reappears
with no light-mode cost — but reserve the layout space for it up front.

## 8. Tailwind v4

`../assets/tokens.theme.css` is the `@theme` block. Two invariants: `@theme` is never
nested inside an at-rule, and theme switching happens outside it. Utilities come out as
`bg-nm-surface`, `border-nm-hairline`, `rounded-nm-ctl`, `shadow-nm-sm`,
`inset-shadow-nm-md`, `text-nm-300`, `ease-nm-out`, `min-h-nm-target`.

```html
<button class="nm-guard inline-flex min-h-nm-target min-w-nm-target items-center
       justify-center gap-nm-2 rounded-nm-ctl border border-nm-hairline
       bg-nm-surface px-nm-5 py-nm-3 text-nm-200 font-semibold text-nm-text
       shadow-nm-sm transition-shadow duration-150 ease-nm-out
       hover:shadow-nm-md
       active:inset-shadow-nm-sm active:shadow-none active:border-nm-accent
       focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-nm-accent
       disabled:shadow-none disabled:text-nm-muted disabled:cursor-not-allowed
       motion-reduce:transition-none">
  Press me
</button>
```

`nm-guard` is the class the theme sheet's `forced-colors` rule targets. It must survive
minification and it goes on every element carrying a shadow utility. Doc §5 also gives
the inline arbitrary-value form for projects that would rather not register tokens; it
is legitimate, and it still needs the border and the guard class.

## 9. React

One component file, zero dependencies beyond React. `buildNeumorphic(base, elevation,
shape, light, intensity, isDark)` returns `{ boxShadow, background, darkColor,
lightColor }`, and three of its details are load-bearing:

- **`const scale = isDark ? 3.0 : 1.0`.** Dark surfaces need a bigger multiplicative
  delta to move the same perceptual amount. This is the line that satisfies §13's
  validation 10 — the dark-mode delta being at least twice the light-mode one — and it
  is a different model from the additive `--nm-delta` knob in `tokens.md` §4. Do not
  conflate them.
- **`const d = DISTANCE[elevation] * (shape === "pressed" ? 0.6 : 1)`, then
  `blur = d * 2`.** The two relations, in two lines, in the order the doc writes them.
- **The development-time warning on an icon-only button with no `label`.** Neumorphic
  icon buttons have no perceivable affordance without an accessible name, and this is
  the style's most common shipped defect. Keep the warning.

`NeuSurface` takes `bordered` and defaults it to `false`, because a surface may be
decorative. `NeuButton` has no such prop: it always draws the border, and it swaps the
border colour to the accent when pressed. That asymmetry is the API expressing the
rule.

## 10. Native targets

**SwiftUI** is where the style still has a maintained library: `costachung/Neumorphic`
(MIT, 988 stars, v2.0.5, iOS 13+ / macOS 10.15+), which exists because SwiftUI has no
native inner-shadow primitive. Its API is `.softOuterShadow()`, `.softInnerShadow(_:)`,
`.softButtonStyle(_:)`, `.softSwitchToggleStyle()`. Doc §5 also gives a dependency-free
`NeuPressed` modifier that fakes the inner shadow with two blurred, offset, masked
strokes. Both get the `strokeBorder(hairline)` overlay; it is not optional there either.

**Jetpack Compose** has no inner shadow: use a custom `drawBehind` with two `Paint`
objects carrying `BlurMaskFilter`, plus `Modifier.border` for the hairline. Do not
reach for Material 3 elevation tokens — they render a single ambient/key pair in the
theme's shadow colour onto a different-coloured surface, which is the opposite of the
same-hue requirement.

**React Native** supports only one `shadowColor` per view on iOS, so the pair needs two
nested wrapper `View`s. On Android `elevation` renders a single system shadow and
cannot be coloured before API 28. The reliable cross-platform answer is
`react-native-svg` with two `<feDropShadow>` filters, or a pre-rendered 9-slice. Budget
for the effect not being pixel-identical across the two platforms.

**Figma** is fully applicable and is where most neumorphism actually lives: two Drop
Shadow effects on one frame, `X 8, Y 8, Blur 16, Spread 0` dark and `X -8, Y -8, Blur
16, Spread 0` light, switched to Inner Shadow at 60% of the distance for pressed.
Publish the pair as a single effect style named `nm/raised-md` so the light source
cannot drift between files.

## 11. Layout consequences that bite

- `box-shadow` does not participate in layout. Reserve padding equal to the largest
  offset on any shadow-containing container, or the depth disappears at the edge.
- Siblings need a gap of at least `2 × distance + blur / 2` — 16px at `sm`, 24px at
  `md`. Packed at 8px, the halos merge into grey mud.
- Neumorphic components run 1.5–2× the padding of a flat equivalent. That is where §9's
  "30–50% of your information density" goes.
- A 40px shadow inside an `overflow: hidden` ancestor is clipped, and inside a scroller
  it re-rasterises on every scroll offset change.
- Use `min-height`, never a fixed height, so text-spacing overrides do not clip
  (SC 1.4.12).
