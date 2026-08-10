# Neubrutalism motion

Source of truth: `docs/07-brutalism.md` §6, with the durations reconciled in §12.

The whole motion language is one idea: **the element and its shadow are two rigid
bodies, and interaction collapses the gap between them.** Nothing eases slowly.
Nothing fades.

## State table

| State | Treatment | Values |
|---|---|---|
| Rest | Border + hard shadow at the element's rung on the `--nb-shadow-*` ladder | `border: var(--nb-bw) solid var(--nb-border)`, `box-shadow: var(--nb-shadow)` |
| Hover | Translate by exactly the shadow offset, shadow to `none` | `transform: translate(var(--nb-sx), var(--nb-sy))`; `box-shadow: 0 0 0 0` |
| Active / pressed | Translate offset + 1px, shadow `none` | `translate(calc(var(--nb-sx) + 1px), calc(var(--nb-sy) + 1px))` |
| Focus-visible | Solid outline outside the border, never replacing it | `outline: var(--nb-focus-w) solid var(--nb-focus-color); outline-offset: var(--nb-focus-offset)` |
| Disabled | Shadow removed, fill drops to the sunk surface, no transform | `background: var(--nb-surface-sunk)`; `color: var(--nb-ink-muted)`; `cursor: not-allowed` |
| Loading | Shadow removed — the element reads as pressed-and-held — plus `aria-busy="true"` and a stepped spinner | `steps(8, end)` 700ms rotation |
| Selected / checked | Fill flips to accent, shadow stays; optionally inverts to `--nb-shadow-rev` | `background: var(--nb-accent)` **plus a non-colour cue** |
| Error | Fill tinted with danger via `color-mix`, border stays ink | `color-mix(in oklab, var(--nb-danger) 18%, var(--nb-surface))` |

## Durations and easing

`--nb-dur-fast` (100ms) is for feedback the user should *feel* rather than watch — a
tone swap, a colour change, a 1px nudge. `--nb-dur` (150ms) is for anything that
**moves**: the 4px translate plus the shadow disappearing is an affordance that needs
to be seen, and at 100ms it reads as a jump rather than a press. Doc §12 states this
reconciliation explicitly; earlier drafts had it the other way round.

Anything above 200ms makes the press feel rubbery and destroys the solid-object
illusion. Easing is `cubic-bezier(0.2, 0, 0, 1)` or plain `linear`. Never spring,
never bounce, never `ease-in-out` — overshoot contradicts the rigid-object metaphor.
Stepped easings (`steps(4, end)`, `steps(8, end)`) on loaders and marquees reinforce
the low-fidelity register and are idiomatic here.

## What may and may not animate

**May:** `transform` (translate and rotate only), `box-shadow` between two hard values,
`background-color`, `border-color`.

**May not:** blur (there is none), `opacity` fades on primary content,
`width` / `height` / `top` / `left` (layout thrash), and shadow blur interpolation.

Animating `box-shadow` does force a repaint of the element's own bounds. On lists of
more than about 50 hoverable cards, transition `transform` only and toggle the shadow
with a non-transitioned class change:

```css
.nb-card--dense { transition-property: transform; transition-duration: 100ms; transition-timing-function: var(--nb-ease); }
.nb-card--dense:hover { transform: translate(var(--nb-sx), var(--nb-sy)); box-shadow: none; }
```

## Touch

Hover does not exist on touch. Wrap the translate in
`@media (hover: hover) and (pointer: fine)` and give touch users the `:active` press.
Without the guard, a tap on iOS leaves the element stuck in its hovered position.

## prefers-reduced-motion

Remove the movement, never the state feedback. Reduced-motion users still need a hover
affordance, and a `box-shadow` size change without a transform is a non-vestibular cue.

```css
@media (prefers-reduced-motion: reduce) {
  .nb-btn { transition-duration: 1ms; }
  /* keep a visible difference: shrink the shadow instead of moving the box */
  .nb-btn:hover  { transform: none; box-shadow: var(--nb-shadow-sm); }
  .nb-btn:active { transform: none; box-shadow: none; }
  .nb-badge, .nb-card[data-tilt="true"] { transform: none; }
  .nb-marquee { animation: none; }
  .b-spinner { animation-duration: 2400ms; }
}
```

`motion: minimal` as an input ships this behaviour unconditionally rather than only
under the media query.

## Marquees and tickers

A genuine idiom here — the reference library ships
`--animate-marquee: marquee 5s linear infinite`. Also a genuine SC 2.2.2 (Pause, Stop,
Hide) liability the moment it runs longer than five seconds. Every marquee gets a real
pause control, and stops under `prefers-reduced-motion`. A marquee with neither is on
the refusal list.

## forced-colors

Forced-colors mode forces `box-shadow: none`, which deletes the entire depth language
in one step, so the motion that depends on it has to stop too:

```css
@media (forced-colors: active) {
  .nb, .nb-btn, .nb-card, .nb-input, .nb-badge { border: 2px solid ButtonBorder; box-shadow: none; }
  .nb-btn { background: ButtonFace; color: ButtonText; }
  .nb-btn:hover, .nb-btn:active { transform: none; }
  .nb-btn:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
  .nb-badge { transform: none; }
}
```

The transforms are zeroed because with the shadow gone, translating the element is
motion with no meaning attached to it.
