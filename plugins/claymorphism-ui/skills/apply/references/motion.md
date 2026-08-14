# Claymorphism motion

Source of truth: `docs/04-claymorphism.md` §6, with the perf argument from §8 and the
reduced-motion requirement from §7.

The whole motion language is one idea: **clay is squeezable, so the motion system
animates depth, not colour.** A clay control that only changes tint on press has thrown
away the entire metaphor.

## State table

| State | Transform | Shadow | Duration / easing |
|---|---|---|---|
| Rest | `none` | `--clay-2` (buttons), `--clay-3` (cards) | — |
| Hover | `translateY(-2px)` | `--clay-3`, plus `filter: brightness(1.04)` | 180ms `cubic-bezier(.2,.8,.2,1)` |
| Active / press | `translateY(1px) scale(0.97)` | `--clay-pressed` — **the insets flip: dark on top** | in 90ms `ease-out`, out 260ms `cubic-bezier(.34,1.56,.64,1)` |
| Focus-visible | unchanged | unchanged | 3px solid `--clay-focus-color`, offset 3px, instant |
| Disabled | `none` | `--clay-1` | `grayscale(55%)`, `opacity: .62` |
| Loading | `none` | `--clay-2` frozen | 720ms linear spinner, `aria-busy="true"` |
| Drag | `scale(1.03) rotate(1.5deg)` | `--clay-4`, counter-rotate the shadow if it lives on a pseudo-element | 200ms `--clay-ease-out` |

## The seven rules that matter

1. **The press must invert the light.** On `:active` the bright inset moves to the
   bottom and the dark inset to the top. That inversion is what makes the element read
   as pressed *into* the page rather than pushed away from the viewer. Shrinking alone
   is not clay.
2. **Do not transition `box-shadow` on frequently repainted elements.** Every frame
   re-rasterises the blur. For lists, carousels and scroll-linked animation, put the
   hover shadow on an absolutely positioned `::after` with the same radius and
   cross-fade its `opacity`, which is compositor-only, while animating `transform` on
   the parent.
3. **Overshoot only on release.** `cubic-bezier(.34,1.56,.64,1)` on press-in makes the
   button feel loose; on release it makes it feel elastic. Press-in is a fast,
   linear-ish `ease-out` at 90ms.
4. **Total press-cycle budget: under 400ms.** 90ms down plus 260ms spring back. Longer
   and the interface feels laggy rather than soft.
5. **Never animate `border-radius`.** It forces a re-layout of the clip path and
   destroys the corner-smoothing illusion mid-flight.
6. **Rotation needs shadow compensation.** A rotating clay element rotates its drop
   shadow with it and the global light direction breaks. Counter-rotate the
   shadow-bearing pseudo-element by the negative angle.
7. **Haptics support the metaphor; they never carry it.** SwiftUI
   `.sensoryFeedback(.impact(weight: .light))` on press — **iOS 17.0+ / macOS 14.0+**,
   so gate it with `if #available(iOS 17.0, macOS 14.0, *)` when the deployment target
   is iOS 16 / macOS 13 — or `HapticFeedbackConstants.CONTEXT_CLICK` on Android. The
   physical feedback does half the work of the visual metaphor, but the squish transform
   has to carry the state on its own.

## What may and may not animate

**May:** `transform` (translate, scale and rotate), `opacity` on a shadow-bearing
pseudo-element, `filter: brightness()`, `background-color`.

**May not:** `box-shadow` on anything that repeats or scrolls, `border-radius` ever,
`width` / `height` / `top` / `left` (layout thrash), and any `@keyframes` containing
`box-shadow` that runs longer than one press cycle.

`box-shadow` is a paint-stage property, not a composited one. Animating it invalidates
the layer and forces re-rasterisation every frame; `transform` and `opacity` are
compositor-only. That is the whole of §8's measurable rule, and it is why the
cross-fade pattern exists.

The cross-fade, for a grid of clay cards:

```css
.clay-card { position: relative; transition: transform var(--clay-dur-hover) var(--clay-ease-out); }
.clay-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: var(--clay-drop-3);
  opacity: 0;
  transition: opacity var(--clay-dur-hover) var(--clay-ease-out);
  pointer-events: none;
}
.clay-card:hover { transform: translateY(-2px); }
.clay-card:hover::after { opacity: 1; }
```

The pseudo-element is `pointer-events: none` and carries no content, so it needs no
`aria-hidden` — it is not in the accessibility tree to begin with.

## Scroll containers

§8 names them the danger zone. Clay cards inside a virtualised list with a 44px blur
re-raster on every scroll tick on mid-range Android. Two remedies, in order:

1. Promote the **scroller** with `will-change: transform` — the scroller, not the
   items.
2. Reduce to `--clay-drop-1` while `data-scrolling="true"` and restore it when the
   scroll settles.

`will-change: box-shadow` is not a remedy and §8 calls it a trap by name: it allocates
a layer without making the blur any cheaper, and dozens of promoted layers exhaust GPU
memory on low-end devices. `will-change: transform` goes on at most the element
currently being interacted with, and comes off afterwards.

## prefers-reduced-motion

Remove the movement, never the state feedback. §7 is explicit that removing the
animation must not remove the feedback: a reduced-motion user still needs to see that
the button is pressed.

```css
@media (prefers-reduced-motion: reduce) {
  .clay-btn,
  .clay-card,
  .clay-chip {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
  /* Keep the state legible without movement: swap depth instantly. */
  .clay-btn:hover  { transform: none; box-shadow: var(--clay-3); }
  .clay-btn:active { transform: none; box-shadow: var(--clay-pressed); }
  /* Long-running indeterminate spinners become a slow, low-amplitude pulse. */
  .clay-btn[data-loading="true"]::after { animation: clay-spin 1600ms linear infinite; }
}
```

The squish and its overshoot are a vestibular trigger, which is why this query is the
one the §5 block keys off. `motion: minimal` as an input ships this behaviour
unconditionally rather than only under the media query.

## Depth is not a state

Shadows convey nothing to assistive technology. Every state this file expresses as
depth needs a paired attribute — `aria-pressed`, `aria-selected`, `aria-current`,
`aria-busy`, `aria-checked` — and §13's validation item 10 makes that an assertion the
skill self-runs. A pressed clay button with no `aria-pressed` is a button whose state
exists only for sighted mouse users.

## forced-colors

Forced-colors mode forces `box-shadow: none`, which deletes the entire depth language
in one step. The motion that depends on it has to stop with it, or the element moves
for no visible reason:

```css
@media (forced-colors: active) {
  .clay, .clay-btn, .clay-input {
    box-shadow: none;
    border: var(--clay-border-hc);
    background: ButtonFace;
    color: ButtonText;
  }
  .clay-btn:hover, .clay-btn:active { transform: none; }
  .clay-btn:focus-visible,
  .clay-input:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
}
```

Note again what is absent: no `forced-color-adjust`. Clay does not opt out of the
forced palette — see `tokens.md` §3.
