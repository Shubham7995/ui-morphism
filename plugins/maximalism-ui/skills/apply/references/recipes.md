# Maximalism recipes — condensed

Source of truth: `docs/06-maximalism.md` §5, with the safety blocks from §6, §7 and §8. The
full listings are in the doc; this file is the shape and the invariants, so the skill can
emit correct code without re-reading 700 lines. Where a recipe is short enough to be safer
quoted than paraphrased, it is quoted.

Every recipe assumes `../assets/tokens.css` is loaded. **A component sheet declares no tokens
of its own.** It consumes `--max-*` and supplies inline fallbacks in the form
`var(--max-dur-hover, 220ms)`, never `--max-dur-hover: 220ms`. That is the difference between
a component that respects the app's theme and one that silently overrides it.

## 1. The scene, and the three planes

The scene is the unit the layer budget is counted against, and it is also the blend-mode
container. Both jobs are done by one declaration:

```css
.max-scene {
  position: relative;
  isolation: isolate;              /* contain blend modes to this scene */
  background-color: var(--max-paper);
  color: var(--max-ink);
  font-family: var(--max-font-body);
  line-height: var(--max-leading-body);
  padding: var(--max-s-7) var(--max-s-5);
  overflow: clip;
}
```

Without `isolation: isolate`, every `mix-blend-mode` inside resolves against the whole page
backdrop: the compositor reads back more, the result depends on what happens to be scrolled
behind, and doc §8 measures the containment as roughly halving blend cost on its own.

**Plane 1, the patterned ground.** CSS-generated, always. Two gradients, no bytes:

```css
.max-scene__ground {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    repeating-linear-gradient(
      45deg,
      color-mix(in oklab, var(--max-magenta) 14%, transparent) 0 10px,
      transparent 10px 24px
    ),
    radial-gradient(
      circle at 1px 1px,
      color-mix(in oklab, var(--max-ink) 22%, transparent) 1.5px,
      transparent 1.6px
    );
  background-size: auto, 18px 18px;
}
```

Alternatives from §3, all still 0 bytes: checkerboards and `repeating-conic-gradient` checks
at a 12-24px repeat, diagonal stripes, halftone dot grids. The ground is never a flat fill
and never an image.

**Plane 2, the grain.** The inline `feTurbulence` data URI in `--max-grain`, screened over
everything at `--max-grain-opacity`, `pointer-events: none`, `aria-hidden="true"`. It is a
*visible print texture* in this style — which is why its opacity ceiling is higher than the
same filter's in docs 01 and 03, and why that ceiling must not be copied into either.

**Plane 3, the ornament.** Exactly one of: stickers, a marquee, or rotated collage. The card
itself is not a loud layer; the thing overlapping it is.

Both decorative planes carry `aria-hidden="true"` and `pointer-events: none`, without
exception. A decorative layer that can take a pointer event is a layer that can swallow a
click on the control underneath it.

## 2. Type

```css
.max-kicker {
  font-family: var(--max-font-kicker);
  font-size: var(--max-t-cap);
  letter-spacing: var(--max-track-kicker);
  text-transform: uppercase;
  color: var(--max-text-on-paper);   /* the role binding, never a raw accent */
  margin: 0 0 var(--max-s-3);
}

.max-display {
  font-family: var(--max-font-display);
  font-size: var(--max-t-hero);
  line-height: var(--max-leading-display);
  letter-spacing: var(--max-track-display);
  text-transform: uppercase;
  margin: 0 0 var(--max-s-6);
  text-wrap: balance;
}
.max-display em {
  font-style: normal;
  -webkit-text-stroke: 3px var(--max-ink);
  color: transparent;               /* outline word, ground shows through */
  paint-order: stroke fill;
}
```

Three constraints that bite. `--max-leading-display: 0.9` plus `-0.04em` tracking breaks when
a user forces 1.5 line-height and 0.12em spacing under SC 1.4.12, so tight tracking goes only
on headings with room to reflow and never inside a fixed height. The `clamp()` floor of 48px
must actually fit at 320px and 200% zoom. And the outlined-word treatment relies on
`-webkit-text-stroke`, which forced-colors discards — the `forced-colors` block below puts
the fill back.

## 3. Ornament: sticker, marquee, collage

**Sticker.** Absolutely positioned, rotated, blob-radius, hard shadow. Two rules make it
legal: if it carries information ("50% OFF") it is real text with an `aria-label` giving the
full sentence, never an image or a `::before`; and if it is interactive it takes
`--max-target-min` on both axes and gets re-measured after the rotate.

```css
.max-sticker {
  position: absolute;
  top: -18px;
  right: -14px;
  display: grid;
  place-items: center;
  min-width: 76px;
  padding: var(--max-s-2) var(--max-s-3);
  background: var(--max-magenta);
  color: var(--max-paper);          /* 3.31:1 — large text only */
  font-family: var(--max-font-display);
  font-size: var(--max-t-lg);       /* 20px display weight qualifies as large text */
  border: var(--max-stroke-2) solid var(--max-ink);
  border-radius: var(--max-r-blob);
  transform: rotate(var(--max-tilt-l));
  box-shadow: var(--max-shadow-hard);
}
```

The cream-on-magenta pair is the one place in this style where a sub-4.5 ratio is legal, and
it is legal *only* at display size. Drop the font size and the same rule becomes a 1.4.3
failure.

**Marquee.** A 2× duplicated track translating `-50%` over `--max-dur-marquee`, the whole
thing `aria-hidden` so the duplicated text is never announced twice. It is decorative motion
and therefore an SC 2.2.2 liability the moment it runs past five seconds — a pause control or
Calm mode is mandatory, not a nicety. Under reduced motion the animation stops and the
container becomes `overflow-x: auto`, so the content is still readable as static scrollable
text rather than clipped.

**Collage.** Overlap by 8-24px, tilt within the resolved ceiling, negative margins or shared
`grid-area` cells. Build the reading order in the DOM first, then displace visually with
`grid-area`, `translate` and `rotate` — never with `order` or `flex-direction: row-reverse`
on content that has a sequence. Below 640px every absolutely positioned fragment collapses
into the single-column flow.

## 4. Card and button

The card is an opaque plane, and that is its whole job: it is what makes text over a
patterned ground legal.

```css
.max-card {
  position: relative;
  max-width: 34rem;
  background: var(--max-surface);   /* opaque, never translucent over pattern */
  color: var(--max-ink);
  border: var(--max-stroke-2) solid var(--max-ink);
  border-radius: var(--max-r-2);
  box-shadow: var(--max-shadow-stack);
  padding: var(--max-s-5);
  transform: rotate(var(--max-tilt-s));
}
```

The button carries the state language, the target minimum and the signature press:

```css
.max-btn {
  --_y: 0px;
  font: inherit;
  font-family: var(--max-font-display);
  font-size: var(--max-t-base);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-height: var(--max-target-min);
  min-width: var(--max-target-min);
  padding: var(--max-s-3) var(--max-s-5);
  background: var(--max-cyan);
  color: var(--max-ink);            /* 12.82:1 */
  border: var(--max-stroke-2) solid var(--max-ink);
  border-radius: var(--max-r-pill);
  box-shadow: var(--max-shadow-hard);
  cursor: pointer;
  translate: 0 var(--_y);
  transition:
    translate var(--max-dur-hover) var(--max-ease-snap),
    box-shadow var(--max-dur-hover) var(--max-ease-snap),
    background-color var(--max-dur-hover) linear;
}
.max-btn:hover  { --_y: var(--max-lift); box-shadow: 10px 10px 0 var(--max-ink); background: var(--max-lime); }
.max-btn:active { --_y: 2px;             box-shadow: var(--max-shadow-press); }
.max-btn:disabled {
  background: var(--max-surface-2);
  color: var(--max-muted);
  box-shadow: none;
  cursor: not-allowed;
  filter: saturate(0.2);
}
```

Doc §5 writes the two minimums as literal `44px`; this plugin emits them from
`--max-target-min` instead, because doc §7's checklist requires the token and a literal is
what drifts when the scale moves. The value is the same 44px.

Ink on cyan and ink on lime are both fills with ink text — the two accents that cannot carry
text on the paper ground carry it perfectly as backgrounds under ink, which is the palette
rule read in the other direction.

## 5. The Calm toggle

The one component this style has that no sibling does, and it is a Level A requirement rather
than a feature. `prefers-reduced-motion` is an OS-level, all-or-nothing setting; a user who
wants this page's marquee stopped without disabling animation on their whole machine has no
other route.

- A real `<button>` with `aria-pressed`, visible, in the page, not buried in a settings modal
- Sets `data-calm="true"` on `<html>` and persists it to `localStorage`
- While calm: every ambient and infinite animation stops, the grain and pattern planes are
  hidden, and large tilts flatten. State transitions survive — calm is not "no feedback"
- Initialised before first paint so the page never starts a marquee it is about to stop
- Emitted **whenever any infinite animation is emitted**, with no exceptions

```css
:root[data-calm="true"] .max-marquee__track,
:root[data-calm="true"] [data-max-ambient] { animation: none; }
:root[data-calm="true"] .max-scene__grain,
:root[data-calm="true"] .max-scene__ground { display: none; }
:root[data-calm="true"] [data-max-tilt] { rotate: 0deg; }
```

Doc §8 also gates on device capability where a script is already running:
`if (navigator.deviceMemory && navigator.deviceMemory <= 4) document.documentElement.dataset.calm = "true";`
— the same switch, thrown for a performance reason.

## 6. The safety layer

Emit these as one `@layer maximalism.safety`. All five blocks, every time. Quoted from doc §5,
§6 and §8 rather than paraphrased, because the block that goes missing when they are retyped
is `forced-colors`, and that is the one where a shadow-only boundary disappears entirely.

```css
/* Focus: double ring so it survives every ground colour. */
:where(.max-scene) :is(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: var(--max-focus-ring);
  outline-offset: var(--max-focus-offset);
  box-shadow: 0 0 0 calc(var(--max-focus-w) + var(--max-focus-offset) + 2px) var(--max-focus-outer);
  border-radius: inherit;
}

/* Reduced motion: kill ambient motion, keep state feedback. */
@media (prefers-reduced-motion: reduce) {
  .max-marquee__track { animation: none; transform: none; }
  .max-marquee { overflow-x: auto; }
  .max-btn { transition-duration: 1ms; }
  .max-btn:hover { --_y: 0px; box-shadow: var(--max-shadow-hard); }
  *, *::before, *::after { animation-iteration-count: 1 !important; }
}

/* Reduced transparency: drop the texture planes. */
@media (prefers-reduced-transparency: reduce) {
  .max-scene__grain { display: none; }
  .max-scene__ground { background-image: none; background: var(--max-surface-2); }
}

/* Forced colours: strokes must survive. */
@media (forced-colors: active) {
  .max-scene__ground,
  .max-scene__grain { display: none; }
  .max-card,
  .max-btn,
  .max-sticker,
  .max-marquee { border: 2px solid CanvasText; box-shadow: none; background: Canvas; color: CanvasText; }
  .max-display em { -webkit-text-stroke: 0; color: CanvasText; }
  :where(.max-scene) :is(a, button):focus-visible { outline: 3px solid Highlight; }
}

/* Coarse pointer or narrow viewport: assume a constrained GPU. */
@media (max-width: 720px), (pointer: coarse) {
  .max-scene__grain { display: none; }
  .max-card { box-shadow: var(--max-shadow-hard); }  /* one layer, not three */
  .max-scene__ground { background-image: none; background: var(--max-surface-2); }
}
@media (prefers-reduced-data: reduce) {
  .max-scene__grain,
  [data-max-decorative-image] { display: none; }
}
```

`prefers-reduced-transparency` shipped in Chrome and Edge 118+ in October 2023, sits behind a
flag in Firefox and is unsupported in Safari as of August 2026. Honour it — and never make it
the only defence. The baseline design has to be legible with every texture layer present,
because most users will never trigger the query.

## 7. Tailwind v4

`../assets/tokens.theme.css` is the `@theme` block. Two invariants: `@theme` is never nested
inside an at-rule, and theme switching happens outside it on ordinary selectors. Names are
prefixed `max-`, so utilities read `bg-max-paper`, `text-max-hero`, `shadow-max-hard`,
`rounded-max-blob`, `ease-max-snap`.

Three custom utilities cover what no built-in expresses — `grain`, `halftone` and
`outline-type` — plus `focus-loud` for the double ring. Ambient motion is opted out at the
source rather than per component:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-max-marquee { animation: none !important; }
}
```

## 8. React

One component file, no dependencies beyond React. The `intensity` prop scales every loud
dimension through the same curves as `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json`,
and a `loudLayers` guard counts pattern + sticker + chromatic shadow + `intensity >= 50` and
warns in development when the total exceeds three. That guard is the budget expressed as
code, and it is the reason the React path is the one to prefer where the framework allows: a
prose cap is checked by review, a counted cap is checked by the runtime.

Components: `Card`, `Button`, `Sticker`, `Marquee`, `Kicker`, `DisplayHeading`, `CalmToggle`.
`Button` renders a real `<button type="button">`, sets `aria-busy` while loading, and disables
on `loading` as well as `disabled`. `Sticker` takes an `aria-label` carrying the full
sentence. `Marquee` refuses to render without either a pause control or a `CalmToggle`
present.

## 9. SwiftUI and other native targets

SwiftUI's `.shadow()` always blurs and cannot express a zero-blur offset. Draw the shadow as a
filled `RoundedRectangle` behind the content, offset by the resolved amount, and move the
content by the same amount when pressed while the backing shape stays put. Rotation, mixed
corner shapes and blend modes all have first-class APIs, so the card, sticker and hard-shadow
layers port cleanly; read `accessibilityReduceMotion` and `accessibilityReduceTransparency`
and drop the ground layer under the latter.

Jetpack Compose and React Native carry the card, sticker and hard-shadow layers but not
blend-mode layer interference without dropping to a shader or `RenderEffect`. If the design
depends on `mix-blend-mode: difference` self-inversion, pre-render two asset variants instead.

## 10. Figma and Framer

In Figma, build the loud layers as separate top-level frames, `Multiply` on the grain frame,
clip content on the scene frame, and keep every accent as a *variable* rather than a raw fill
so the intensity knob is a mode swap — Quiet / Loud / Riot at 25 / 60 / 90. In Framer, ambient
marquees need a Loop override with `Appear` disabled and an explicit `useReducedMotion()`
guard: Framer's default scroll and loop components do not honour the OS preference on their
own.

## 11. Layout consequences that bite

- `box-shadow` does not participate in layout. Reserve right and bottom padding equal to the
  deepest offset in the stack, or the third shadow layer clips at the container edge.
- Ornament that overlaps by 8-24px needs the overlap to live outside `overflow: hidden`, or
  the overlap — the thing that makes it read as maximalism — is invisible.
- Below 640px, every `position: absolute` fragment rejoins the flow. At 320px there is no
  horizontal scrollbar. Both are SC 1.4.10, and both are checked by the scanner.
- A scroll listener that reads `getBoundingClientRect()` on twelve rotated stickers and
  writes `style.transform` in the same frame is the characteristic bug of this style. Use
  `animation-timeline: scroll()` / `view()` where supported and an `IntersectionObserver` plus
  rAF pattern elsewhere. Never read and write geometry in one synchronous block.
