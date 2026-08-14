# Skeuomorphism motion

Source of truth: `docs/01-skeuomorphism.md` §6, with the durations and easings from §4.

The rule that governs everything: **the material moves, the light does not.** The light
source is fixed at the top of the viewport. State changes are expressed by the object
travelling toward it or away from it, never by the highlight sliding around the object.
Every violation of that rule reads instantly as fake, and it is the reason none of the
transitions below touch a gradient stop or a bevel offset.

## State table

| State | Treatment | Values |
|---|---|---|
| Rest | Elevation 2 | the four-layer stack, `translateY(0)` |
| Hover | Surface brightens, elevation unchanged | `filter: brightness(1.03)`, 140ms `cubic-bezier(.4,0,.2,1)`. **Do not raise the button on hover** — pointer hover is not a physical event |
| Active / press | Travel down and invert the stack | `translateY(1px)`, outer shadows to 0, `inset 0 2px 5px rgba(0,0,0,.25)` + `inset 0 1px 1px rgba(0,0,0,.20)`, 90ms `cubic-bezier(.2,0,0,1)` |
| Release | Return with a very small overshoot | 220ms `cubic-bezier(.34,1.4,.64,1)`. Keep the overshoot under 4% — real plastic does not bounce |
| Latched (`aria-pressed="true"`) | Permanently in the pressed stack, plus a lit indicator | pressed shadows held; the indicator lamp gets `box-shadow: 0 0 6px 1px currentColor` |
| Focus-visible | Additive ring, never a replacement for the stack | `box-shadow: <stack>, 0 0 0 2px var(--sk-bg), 0 0 0 4px #2b6cb0` — 2px gap, then a 2px ring |
| Disabled | Desaturate, drop to elevation 1, no travel | `filter: saturate(.25)`, `opacity: .55`, `--sk-elev-1`, `cursor: not-allowed`, `transform: none` |
| Loading | A recessed well plus an indeterminate needle or LED, not a spinner | well shadows plus a 1.1s linear sweep on an inner element's `translate`. Never animate `box-shadow` for this |
| Toggle throw | The knob translates, the track colour crossfades | `translate` 220ms `cubic-bezier(.34,1.4,.64,1)`; track `background` 140ms linear |

## Durations

`--sk-dur-press` (90ms) is the press: it should feel instantaneous, because a physical
button bottoms out instantly. `--sk-dur-hover` (140ms) is the brightness change, which is
a light effect and should be gentler than the movement. `--sk-dur-release` (220ms) is the
return, deliberately longer than the press — a real key rises more slowly than it falls —
and it is the only duration paired with an overshoot easing. `--sk-dur-panel` (260ms) is
for a drawer, sheet or lid.

## What may and may not animate

**May:** `transform`, `translate`, `opacity`, `filter`.

**May not, ever:** `box-shadow` across many elements, `background-image`, and gradient
stops. Each frame of an animated shadow forces a repaint of the element's bounds, and
stacked four-layer shadows make that repaint expensive; an animated gradient is worse.
Never animate the grain layer.

When a shadow genuinely has to appear to change smoothly — a card lifting under a drag,
a panel settling — **cross-fade the `opacity` of two absolutely positioned
pseudo-elements that each carry a static shadow.** That runs on the compositor and holds
60fps on low-end Android where a `box-shadow` transition will not.

There is no sanctioned exception, including for the press. §5's own `.sk-button` listing
names `box-shadow` first in its `transition`, and §6 and §13 both forbid exactly that;
the emitted rule follows §6 and §13 and drops the term. The travel still eases on
`transform` over 90ms and the stack swaps underneath it in one frame, which at 90ms is
indistinguishable and is what reduced motion produces in any case. `recipes.md` §2 states
the deviation and the audit records it.

## prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  .sk-button,
  .sk-toggle::after,
  .sk-panel * {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
  /* Keep the *state* legible, drop the travel */
  .sk-button:active { transform: none; }
}
```

**Reduced motion must not remove the pressed appearance — only the movement.** The inset
shadow swap is a state indicator required by SC 1.4.11, so it stays; it just arrives
instantly. An implementation that deletes the whole `:active` rule under this query has
removed a conformance-relevant state indicator, which is a worse failure than the motion
it was trying to avoid.

The same applies to the toggle: the knob still ends up at the other end of the track, it
simply gets there in one frame.

## Intensity and motion

`travel` is the only motion knob, and it is coupled: below `shadowDepth` 0.25 the travel
is suppressed to 0 regardless of what the curve returns, so a 1px jump never happens
without shadow support behind it. At `intensity: 0` there is no travel and no transition
worth having — the baseline is a bordered, flat, instant control, and that is a usable
interface rather than a broken one.

`travel: 2px` is reserved for hardware metaphors 64px tall or more. On an ordinary 44px
control a 2px drop reads as a glitch.

## forced-colors

Forced-colors mode nulls `box-shadow` and `text-shadow`, which deletes the whole depth
language in one step, so the motion that depends on it stops meaning anything:

```css
@media (forced-colors: active) {
  .sk-button:active { transform: none; }
}
```

Keep the `aria-pressed` / `aria-checked` state carried by a system colour instead —
`Highlight` on the checked track — because with the shadows gone that attribute is the
only thing left saying which state the control is in.
