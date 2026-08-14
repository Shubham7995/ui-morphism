# Neumorphism motion

Source of truth: `docs/02-neumorphism.md` §6, with the paint cost from §8 and the
forced-colors consequences from §7.

The whole promise of this style is tactility, so state changes must feel **mechanical:
fast, short, and terminating hard.** The universal mistake is animating the shadow
distance over 300ms with an ease-in-out, which reads as rubber rather than plastic.

## State table

| State | Treatment | Values |
|---|---|---|
| Rest | Raised, `sm` elevation | `5px 5px 10px dark, -5px -5px 10px light` |
| Hover | One elevation step up, `translateY(-1px)` | to `8px 8px 16px`, `180ms cubic-bezier(0.16,1,0.3,1)` |
| Active / pressed | Inset at 60% of the outer distance, `translateY(0)`, accent border | `inset 3px 3px 6px dark, inset -3px -3px 6px light`, `120ms cubic-bezier(0.4,0,1,1)` |
| Selected / `aria-pressed="true"` | Persist the pressed shadow **and** switch `border-color` to accent | The border is the state carrier; the shadow alone is 1.5:1 and cannot be it |
| Focus-visible | `outline: 3px solid var(--nm-accent); outline-offset: 3px` | Never `box-shadow` |
| Disabled | `box-shadow: none`, muted border, muted ink, `cursor: not-allowed` | Removing the extrusion is the clearest disabled signal this style has |
| Loading | Pressed well plus a 1400ms linear translate sheen at 70% highlight opacity | Do not pulse the shadow itself |
| Error | `border-color: var(--nm-danger)` plus text | Tinting the surface breaks the same-hue rule |

## Durations and easing

`--nm-t-press` (120ms) is the press. `--nm-t-hover` (180ms) is the hover elevation
change. `--nm-t-morph` (240ms) is a theme or shape morph, which is the only thing in the
style permitted to take that long.

`--nm-e-in` is `cubic-bezier(0.4, 0, 1, 1)`: fast start, hard stop, which is what a real
switch feels like. `--nm-e-out` is `cubic-bezier(0.16, 1, 0.3, 1)`: a settle with no
overshoot. Never spring or bounce — an object moulded from the page does not wobble.

## What may and may not animate

**May:** `box-shadow` between two composed values, `border-color`,
`transform: translateY()` and `scale()`, and `background` on a toggle thumb.

**May not:** `filter: blur()` on the surface, `border-radius`, the surface colour itself
— it must track the page background, and animating it is the same-hue rule breaking
frame by frame — and the light source direction.

## The compositor-friendly press

`box-shadow` transitions repaint every frame, and this style has two layers per element
by definition. Where the press is on a hot path, render both states as stacked
pseudo-elements and cross-fade `opacity`, which stays on the compositor:

```css
.nm-btn-fast {
  position: relative;
  isolation: isolate;
  background: var(--nm-surface);
  border: 1px solid var(--nm-hairline);
  border-radius: var(--nm-r-ctl);
}
.nm-btn-fast::before,
.nm-btn-fast::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  transition: opacity var(--nm-t-press) var(--nm-e-out);
  will-change: opacity;
}
.nm-btn-fast::before { box-shadow: var(--nm-raised-sm);  opacity: 1; }
.nm-btn-fast::after  { box-shadow: var(--nm-pressed-sm); opacity: 0; }
.nm-btn-fast:active::before { opacity: 0; }
.nm-btn-fast:active::after  { opacity: 1; }
```

This is the one case where four shadow layers on an element is permitted rather than
two, and §8 names it explicitly. `will-change: opacity` goes on the interactive element
only — never blanket-applied, which forces dozens of layers and blows GPU memory.

Two cost numbers from §8 worth carrying into a decision. Blur radius drives cost
superlinearly in the blurred area: a 40px blur on a 300×80 button dirties roughly
60,800px per layer against about 22,000px at 8px blur, which is 2.8× the area for a
difference most users cannot see. And a 180ms hover transition across a 24-card grid
repaints 48 shadow layers eleven times. Halving the blur usually recovers more than
removing a third of the cards.

## prefers-reduced-motion

Remove the movement, never the state feedback.

```css
@media (prefers-reduced-motion: reduce) {
  .nm-btn, .nm-toggle__thumb, .nm-input { transition-duration: 1ms; }
  .nm-btn:hover { transform: none; }
  .nm-skeleton::after { animation: none; opacity: 0.35; transform: none; }
}
```

The pressed shadow and the accent border still apply; they apply instantly. A
reduced-motion user who loses press feedback has lost information, not decoration, and
§13 anti-pattern 10 refuses any block that removes a state-carrying property. Only
durations may be zeroed.

## prefers-reduced-transparency

This query does not strictly apply — the style has no translucency — but §6 asks for it
to be honoured anyway, as a proxy for "this user wants plainer surfaces": drop to a
single 2px/6px shadow and raise the hairline to 4.5:1.

## forced-colors

The user agent forces `box-shadow: none`, along with `text-shadow: none` and non-URL
`background-image: none`. In this style that is not a degradation, it is a deletion:
**100% of the visual structure is carried by `box-shadow`**, so every control becomes an
unbordered rectangle of `Canvas` on `Canvas`, and the transitions that animate between
two deleted shadows are animating nothing.

```css
@media (forced-colors: active) {
  .nm-surface, .nm-btn, .nm-input, .nm-toggle, .nm-toggle__thumb,
  .nm-flat, .nm-convex, .nm-concave, .nm-pressed {
    box-shadow: none;
    background: Canvas;
    border: 2px solid ButtonText;
    forced-color-adjust: none;
  }
  .nm-btn:hover { transform: none; }
  .nm-btn:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
  .nm-btn[aria-pressed="true"],
  .nm-toggle[aria-checked="true"] { border-color: Highlight; background: Highlight; color: HighlightText; }
  .nm-btn:disabled { color: GrayText; border-color: GrayText; }
}
```

The `translateY` is zeroed for the same reason brutalism zeroes its translate: with the
shadow gone, moving the element is motion with nothing attached to it. The border,
the outline and the `Highlight` mapping are what remain, and they are the reason a
neumorphic interface is usable at all in this mode.

## Loading and the sheen

The skeleton is a pressed well with a translated gradient sheen:

```css
.nm-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    color-mix(in oklch, var(--nm-shadow-light) 70%, transparent) 50%,
    transparent 100%);
  transform: translateX(-100%);
  animation: nm-sheen 1400ms linear infinite;
}
@keyframes nm-sheen { to { transform: translateX(100%); } }
```

It animates `transform` rather than a background position, so it stays on the
compositor, and it stops entirely under reduced motion. Do not animate the well's own
shadow instead: that is a repaint per frame on every skeleton on the page, which is the
opposite of what a loading state should cost.
