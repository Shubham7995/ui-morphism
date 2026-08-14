# Claymorphism recipes — condensed

Source of truth: `docs/04-claymorphism.md` §5. The full listings are in the doc; this
file is the shape and the invariants, so the skill can emit correct code without
re-reading 500 lines of CSS, TSX and Swift. Where a recipe is short enough to be safer
quoted than paraphrased, it is quoted.

Every recipe below assumes `../assets/tokens.css` is loaded. **A component sheet
declares no tokens of its own.** It consumes `--clay-*` and supplies inline fallbacks
in the form `var(--clay-dur-press, 90ms)`, never `--clay-dur-press: 90ms`. That is the
difference between a component that respects the app's theme and one that silently
overrides it.

The one exception is `--clay-shadow-h`. A per-surface hue override **is** a local
declaration and is meant to be: `.clay--sky { --clay-shadow-h: 202 }` is how the
shadow atoms re-derive themselves for that surface, and it is the mechanism the whole
hue-matching rule runs on.

## 1. The shared primitive

Everything else is this plus a fill, a rung and a hue.

```css
.clay {
  background: var(--clay-surface);
  color: var(--clay-ink-on-clay);
  border: var(--clay-border);
  border-radius: var(--clay-r-card);
  box-shadow: var(--clay-3);
  padding: var(--clay-sp-8);
  font-family: var(--clay-font);
  font-size: var(--clay-fs-md);
  line-height: var(--clay-lh-body);
}

.clay--lavender { background: var(--clay-lavender); --clay-shadow-h: 258; }
.clay--sky      { background: var(--clay-sky);      --clay-shadow-h: 202; }
.clay--mint     { background: var(--clay-mint);     --clay-shadow-h: 152; }
.clay--butter   { background: var(--clay-butter);   --clay-shadow-h: 36;  }
.clay--coral    { background: var(--clay-coral);    --clay-shadow-h: 8;   }
```

Own colour **and** own hue, always both. The background is what separates clay from
neumorphism; the hue is what separates clay from a generic drop shadow.

**Emit all four elevation classes, `.clay--1` through `.clay--4`, including `.clay--3`.**
`.clay` already defaults to `--clay-3`, so `.clay--3` looks redundant — it is not.
Without it there is no way to reset an element that inherited `.clay--1` back to the
default rung. `.clay--4` also raises the radius to `--clay-r-modal`.

`--clay-r-modal` is the token. §5 records a bug worth not repeating: an earlier draft
read `var(--clay-modal, 40px)` there, and it looked correct because the fallback
matched the token's value. Theming `--clay-r-modal` simply had no effect on modals, and
nothing rendered wrong until someone changed the token.

## 2. Button — the signature interaction

```css
.clay-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--clay-sp-2);
  min-height: 48px;                    /* WCAG 2.2 2.5.8 target size */
  min-width: 48px;
  padding: var(--clay-sp-3) var(--clay-sp-6);
  border: var(--clay-border);
  border-radius: var(--clay-r-btn);
  background: var(--clay-primary);
  color: var(--clay-primary-ink);
  font: 700 var(--clay-fs-md)/1.2 var(--clay-font);
  cursor: pointer;
  box-shadow: var(--clay-2);
  transform: translateY(0) scale(1);
  transition:
    transform  var(--clay-dur-release) var(--clay-ease-squish),
    box-shadow var(--clay-dur-hover)   var(--clay-ease-out),
    filter     var(--clay-dur-hover)   var(--clay-ease-out);
}

.clay-btn:hover  { transform: translateY(-2px); box-shadow: var(--clay-3); filter: brightness(1.04); }
.clay-btn:active {
  transform: translateY(1px) scale(.97);
  box-shadow: var(--clay-pressed);
  transition-duration: var(--clay-dur-press);
  transition-timing-function: var(--clay-ease-out);
}
.clay-btn:focus-visible {
  outline: var(--clay-focus-width) solid var(--clay-focus-color);
  outline-offset: var(--clay-focus-offset);
}
```

Invariants, all from §6:

- **The press inverts the light.** `--clay-pressed` puts the dark inset on top and the
  bright one below. Merely shrinking the element is not clay — the inversion is what
  makes it read as pressed *into* the page rather than pushed away from the viewer.
- **Overshoot on release only.** The rest state carries `--clay-ease-squish` at 260ms
  because that is the transition the element runs *back* through; `:active` overrides
  both duration and easing to 90ms `--clay-ease-out` on the way down. Springing on
  press-in makes the button feel loose.
- **The focus ring is offset.** A ring drawn on the element edge disappears into the
  drop shadow (§7).

Disabled drops a rung and desaturates — and does not rely on `opacity` alone to carry
the state, because `aria-disabled` is what tells assistive tech:

```css
.clay-btn[disabled],
.clay-btn[aria-disabled="true"] {
  cursor: not-allowed; filter: grayscale(.55); opacity: .62;
  box-shadow: var(--clay-1); transform: none;
}
```

Loading freezes the rung, hides the label, sets `aria-busy="true"` and spins a
720ms `linear` pseudo-element. Under reduced motion that duration stretches to 1600ms
rather than the animation being deleted.

## 3. Input — the inverted recipe

Inputs and wells read **recessed**, not inflated. This is the one place clay borrows
neumorphism's direction on purpose, and it is deliberate: §12 says that if you want
subtle recesses you use this rather than importing neumorphism wholesale.

```css
.clay-input {
  width: 100%;
  min-height: 48px;
  padding: var(--clay-sp-3) var(--clay-sp-5);
  border: var(--clay-border);
  border-radius: var(--clay-r-input);
  background: var(--clay-surface);
  color: var(--clay-ink);
  font: 500 var(--clay-fs-md)/1.4 var(--clay-font);
  box-shadow:
    inset 0 6px 12px -6px hsl(var(--clay-shadow-h) 45% 30% / .34),
    inset 0 -4px 8px -6px hsl(0 0% 100% / .55);
}
.clay-input::placeholder { color: var(--clay-ink-muted); opacity: 1; }
```

Two layers, both inset, no drop shadow. An input that floats is a button.

## 4. The eight components the skill emits

`Card`, `Button`, `IconButton`, `Chip`, `Input`, `Toggle`, `Modal`, `Toast` — §13's
output list. Each carries the four guard blocks from §7 below. Notes that are not
obvious from the button:

| Component | Style-specific requirement |
|---|---|
| `Card` | Static by default: `--clay-drop-1` only, no inset stack. It gets the full stack only if it is itself a link or a button. §7 SC 1.4.1. |
| `IconButton` | `--clay-r-chip` and 48×48 minimum, measured **while pressed**. The pill rounds the corners off its own box, so the reliably hittable area is already smaller than the border box before `scale(.97)` shrinks it. |
| `Chip` | `--clay-1`, `--clay-r-chip`. Selected state flips fill **and** sets `aria-selected` or `aria-pressed` — depth alone communicates nothing to assistive tech (§7). |
| `Toggle` | The travelling knob is the affordance; the track's inset is the well. `role="switch"` with `aria-checked`, and a non-colour cue for the on state. |
| `Modal` | `--clay-4` and `--clay-r-modal`. This is the only place the 68px blur is allowed (§8). `<dialog>` or `aria-modal="true"`, focus trap, inert background. |
| `Toast` | `--clay-2`. `role="status"` or `role="alert"` chosen by urgency; never depth alone to signal severity. |

**Two nested elevation levels, maximum, in one subtree** (§9, §13). Three or more turn
into visual mud because the drop shadows overlap.

## 5. Tailwind v4

`../assets/tokens.theme.css` is the `@theme` block. Three invariants: `@theme` is never
nested inside an at-rule; theme switching happens outside it on ordinary selectors; and
`assets/tokens.css` ships alongside it, because `--clay-border-hc` is a plain custom
property with no Tailwind namespace and the forced-colors block needs it.

**Do not reach for the old plugin.** §5 is explicit: `tailwindcss-claymorphism`
(v0.11.1, 29 October 2022) peers on `tailwindcss ^3.1.6`, never gained v4 support, and
has had no release since. Tailwind v4 needs no plugin for this — `@theme` generates
`shadow-*`, `rounded-*` and `font-*` from custom properties directly.

Utilities come out as `bg-clay-*`, `text-clay-*`, `rounded-clay-btn`, `shadow-clay-1`
through `shadow-clay-4`, `shadow-clay-pressed`, `font-clay`, `ease-clay`,
`ease-clay-squish`. The component layer:

```css
@layer components {
  .clay-button {
    @apply inline-flex items-center justify-center gap-2
           min-h-12 min-w-12 px-6 py-3
           bg-clay-primary text-white font-clay font-bold
           rounded-clay-btn shadow-clay-2 border-0 cursor-pointer
           transition-[transform,box-shadow,filter] duration-200 ease-clay
           hover:-translate-y-0.5 hover:shadow-clay-3 hover:brightness-105
           active:translate-y-px active:scale-[0.97] active:shadow-clay-pressed active:duration-100
           focus-visible:outline-3 focus-visible:outline-clay-primary focus-visible:outline-offset-[3px]
           disabled:grayscale-[55%] disabled:opacity-60 disabled:shadow-clay-1
           disabled:translate-y-0 disabled:cursor-not-allowed
           motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0;
  }
}
```

For Tailwind v3 there is no `@theme`; extend `tailwind.config.ts` with the same values
under `theme.extend.colors / borderRadius / boxShadow / fontFamily` and keep the token
CSS file as the source.

## 6. React

`ClaySurface` and `ClayButton`, one file, zero dependencies beyond React. The shape
that matters:

- A `TONES` record mapping each tone to `{ bg, ink, hue }`. The hue is what makes the
  shadow match the surface, and it is why the record is the single place a tone is
  defined. `primary` is `#5B3AE0` with white ink; every pastel is its own fill with
  `#241F3A` ink.
- A `claySoftShadow(tone, elevation, intensity)` helper composing the four layers in
  paint order — rim, sheen, shade, drop — and scaling the alphas by
  `k = clamp(0, 100, intensity) / 50`.
- `ClaySurface` takes `tone`, `elevation` (1-4), `radius`, `intensity` and an `as`
  prop; it forwards a ref and spreads the rest.
- `ClayButton` renders a real `<button type="button">`, tracks a `pressed` state from
  `onPointerDown` / `Up` / `Leave` **and** from `keydown` / `keyup` on Space and Enter,
  sets `aria-busy` while loading, and treats `loading` as inert alongside `disabled`.

**The keyboard half is not optional.** Pointer events alone leave a keyboard user with
no press feedback at all, which is exactly the state-invisible-to-some-users failure
§7 is about.

**Where the React listing and the knob table disagree, the knob table wins.** §5's
`claySoftShadow` scales linearly by `k`, which reaches a 1.24 sheen at intensity 100.
§13's table caps the sheen at 0.85 and the shade at 0.48. The linear `k` form is the
doc showing the shape; the knob table is the contract. Clamp to it — and clamp the
inset offset and blur too, which §13 does not scale at all (see `tokens.md` §4).

## 7. The four guard blocks

Mandatory on every generated sheet (§13 step 6). Emit them inside
`@layer claymorphism` so the restyle can be toggled off without specificity fights,
and keep them together in a `clay-fallbacks.css` partial.

**Forced colors** — the one that decides whether the interface survives at all:

```css
@media (forced-colors: active) {
  .clay, .clay-btn, .clay-input {
    box-shadow: none;
    border: var(--clay-border-hc);
    background: ButtonFace;
    color: ButtonText;
  }
  .clay-btn:focus-visible,
  .clay-input:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
}
```

The border comes from the token, not from a literal. §5 says why: the Tailwind mirror
needs the identical value, and two hand-written copies of `2px solid ButtonText` is
exactly how they drift apart. Note also what is **absent** — there is no
`forced-color-adjust` declaration. Siblings 01, 02 and 03 write
`forced-color-adjust: none` here; clay does not, because §5 and §7 argue that clay's
boundary story is fill-vs-fill and the correct behaviour is to let the system colours
win. `auto` is the initial value, so declaring it would be dead code.

**Reduced motion** — kill the movement, keep the feedback:

```css
@media (prefers-reduced-motion: reduce) {
  .clay-btn { transition-duration: 1ms; }
  .clay-btn:hover  { transform: none; box-shadow: var(--clay-3); }
  .clay-btn:active { transform: none; box-shadow: var(--clay-pressed); }
  .clay-btn[data-loading="true"]::after { animation-duration: 1600ms; }
}
```

**Reduced transparency** — a near no-op for an opaque style, and that is the point:

```css
@media (prefers-reduced-transparency: reduce) {
  :root {
    --clay-sheen: inset 0 6px 10px -6px hsl(0 0% 100% / .35);
    --clay-backdrop: none;
  }
}
```

Clay surfaces are opaque, so this only softens the sheen — unless you hybridised with
glass, in which case this is where the backdrop blur comes off.

**Reduced data and small screens** — the perf fallback from §8:

```css
@media (prefers-reduced-data: reduce), (max-width: 480px) {
  :root {
    --clay-drop-3: 0 12px 22px -8px hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .30);
    --clay-drop-4: 0 18px 32px -10px hsl(var(--clay-shadow-h) var(--clay-shadow-s) var(--clay-shadow-l) / .32);
    --clay-rim: none;
  }
}
```

## 8. The gradient-overlay fallback

§8's third cheaper fallback: two blurred insets replaced by one gradient fill, which is
markedly cheaper because it is not a blur at all. Emit it as a named modifier so it can
be applied to the elements that repeat rather than globally.

```css
.clay--cheap {
  background-image: linear-gradient(
    to bottom,
    hsl(0 0% 100% / .45) 0%,
    hsl(0 0% 100% / 0) 38%,
    hsl(258 45% 30% / .18) 100%
  );
  box-shadow: var(--clay-drop-2);
}
```

## 9. SwiftUI and other native targets

SwiftUI is genuinely relevant here — the Duolingo-style tactile button is the most
common native expression of clay, and SwiftUI has no inset shadow.

- **SwiftUI:** a `Clay` `ViewModifier` filling a `RoundedRectangle(style: .continuous)`,
  overlaying a top-to-bottom `LinearGradient` in `.overlay` blend mode to fake the two
  insets, a `strokeBorder` at `white.opacity(0.35 × k)` for the rim, and `.shadow()`
  for the drop. `.scaleEffect(pressed ? 0.97 : 1.0)` with
  `.spring(response: 0.26, dampingFraction: 0.55)`.
- **Haptics are gated, not inline.** `.sensoryFeedback(.impact(weight: .light), trigger:)`
  is **iOS 17.0+ / macOS 14.0+**. §5 wraps it in an
  `if #available(iOS 17.0, macOS 14.0, tvOS 17.0, watchOS 10.0, *)` helper so the file
  still compiles at its stated iOS 16 / macOS 13 target. On the older OS the button is
  silent and the visual squish carries the affordance on its own — which §6 requires
  anyway: haptics must never be the only feedback.
- **React Native:** `shadowColor/shadowOffset/shadowRadius` is iOS-only and Android's
  `elevation` cannot be hue-tinted or inset. Reproduce the insets with
  `expo-linear-gradient` inside a `borderRadius`-clipped `View`, and accept a single
  elevation shadow on Android. `react-native-svg` filters are the only route to a true
  inner shadow.
- **Jetpack Compose:** `Modifier.shadow()` supports `ambientColor` / `spotColor` on
  API 28+, so the tinted drop works; the insets need a `Brush.verticalGradient` overlay
  inside a `clip(RoundedCornerShape(32.dp))`.
- **Figma:** two Inner Shadows (light Y +4-8, blur 16-32; dark Y -4 to -8, blur 8-16 at
  20-30% opacity) and one Drop Shadow (blur 8-24, positive Y), then corner smoothing to
  ~60%. Publish the shadow trio as a single Effect Style so designers cannot
  desynchronise the light direction.

## 10. Layout consequences that bite

- **Grid gaps ≥ 24px** (`--clay-gap`). Overlapping clay shadows look like mud. This is
  the one place clay fights bento layout, whose gutters are usually tighter (§12):
  widen the gutter or reduce to `--clay-drop-1` inside the grid.
- **`padding ≥ border-radius × 0.75`** on any card whose text can wrap, or the text
  clips against the curve at 200% zoom and WCAG 1.4.12 text spacing (§7).
- **A large drop shadow inside an `overflow: hidden` ancestor is clipped**, and so is
  the focus ring at its 3px offset. Check both on rounded cards.
- **Rotation needs shadow compensation.** If a clay element rotates, its drop shadow
  rotates with it and the global light direction breaks. Counter-rotate the
  shadow-bearing pseudo-element by the negative angle (§6).
- **Text cannot take inset shadows at all.** Raised type is faked with two opposing
  `text-shadow` offsets (§2). `inset` inside a `text-shadow` is dropped by every
  engine, silently.
- **Keep DOM order equal to visual order.** Clay's floating cards invite absolute
  positioning and CSS-order tricks in bento-ish layouts; that is SC 1.3.2 (§7).
