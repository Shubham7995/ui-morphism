# Maximalism motion

Source of truth: `docs/06-maximalism.md` §6, with the flash and pause rules from §7 and the
compositing costs from §8.

The motion language has two halves that must not be confused, because every accessibility
rule in this style turns on the distinction. **Ambient motion is texture** — marquees, blob
morphs, scroll-linked rotation, drifting ornament — and it exists to make the page feel
alive. **State motion is feedback** — the press, the hover lift, the entrance — and it exists
to tell the user what just happened.

Reduced motion, Calm mode and the `motionLoad` knob all do the same thing: they take the
first half to zero and leave the second half alone. "Disable all animation" is the wrong
implementation of every one of them.

## State table

Doc §6's table, with the tokens that carry each value.

| State | Treatment | Values |
|---|---|---|
| Rest | Hard offset shadow, full stroke | `box-shadow: 6px 6px 0 ink`, `border: 3px` |
| Hover | Lift and deepen the shadow, swap the fill | `translate: 0 -4px`, shadow `10px 10px 0`, `background: lime`, 220ms `--max-ease-snap` |
| Active / pressed | Push into the shadow | `translate: 0 2px`, shadow `2px 2px 0`, 120ms linear |
| Focus-visible | Double ring, ground-independent | `outline: 4px solid cyan; outline-offset: 2px` plus `box-shadow: 0 0 0 8px ink` |
| Disabled | Desaturate, remove elevation | `filter: saturate(0.2)`, `box-shadow: none`, `color: --max-muted` (9.26:1 on the light surface, 8.86:1 dark) |
| Loading | Text swap plus a 2px striped progress rail — never a spinner over a pattern | `aria-busy="true"`, rail `repeating-linear-gradient` 8px, 1.2s linear |
| Selected | Invert the plane rather than tint it | `background: ink; color: lime` (16.63:1) |

Selection inverting the plane rather than tinting it is not a stylistic preference. On a
composition that already carries four saturated fills, a tint is not a distinguishable state
change, and a state carried by colour alone fails SC 1.4.1 regardless.

## Durations and easing

Taps 120ms, hovers 220ms, entrances 420ms, ambient marquees 24s per full cycle — a 2×
duplicated track translating `-50%`.

`--max-ease-snap: cubic-bezier(0.2, 0.9, 0.1, 1.25)` for anything with a physical press
metaphor: the overshoot past 1 is what makes a hard-shadow button feel like an object rather
than a rectangle changing colour. `--max-ease-out: cubic-bezier(0.22, 1, 0.36, 1)` for
entrances. Never `ease-in-out` on a state change — it makes the snap mushy and defeats the
style's whole physical conceit.

## What may and may not animate

**May:** `transform`, `translate`, `rotate`, `scale`, `opacity`, `box-shadow` offset
(accepting the paint cost), and `background-color`.

**May not:** `width`, `height`, `top` / `left`, `margin`, `filter: blur()`,
`backdrop-filter`, `border-width`, or anything else that triggers layout on a page already
carrying twenty-plus composited layers. This is a hard list, it is checked by
`../scripts/max-scan.mjs`, and `transition: all` fails it because it silently includes every
banned property.

Animating `box-shadow` offset repaints the element's own bounds. Past about eight
simultaneously visible hover-shadowed cards, move to a pseudo-element rectangle offset with
`translate`, which stays on the compositor.

Scroll-linked rotation is acceptable only via `animation-timeline: view()` or a throttled rAF
loop. A raw `scroll` listener that writes styles synchronously is the fastest way to blow the
200ms INP threshold, and INP is the budget doc §8 singles out as the one to watch.

## Flash safety

Nothing may flash more than three times per second (SC 2.3.1). The three patterns that trip
this in practice are colour-cycling backgrounds, strobing stickers, and rapid
`mix-blend-mode: difference` inversions. Cap full-area colour change at 2.5 Hz and keep any
such change to a minimum period of 400ms.

## prefers-reduced-motion

Stop everything ambient and infinite; keep everything that reports state.

```css
@media (prefers-reduced-motion: reduce) {
  /* 1. Kill ambient/infinite motion outright. */
  .max-marquee__track,
  [data-max-ambient] { animation: none !important; }

  /* 2. Make the marquee readable as static, scrollable content. */
  .max-marquee { overflow-x: auto; }

  /* 3. Keep state feedback, but instant and without displacement. */
  .max-btn { transition-duration: 1ms !important; }
  .max-btn:hover { translate: none; }

  /* 4. Freeze scroll-driven timelines. */
  * { animation-timeline: none !important; }

  /* 5. Rotation is vestibular for some users at scale; flatten large tilts. */
  [data-max-tilt] { rotate: 0deg !important; }
}
```

Line 4 is the one most often missing. A scroll-driven timeline is not an `animation` in the
sense the first rule cancels — it is motion bound to the scroll position, and it keeps
running unless the timeline itself is removed.

## Calm mode

The media query is not sufficient on its own and the reason is not technical. It is an
OS-level, all-or-nothing setting: a user who wants *this page's* marquee stopped, without
turning off animation across their entire machine, cannot express that through it.

So every page that emits an infinite animation also emits a persistent in-page Calm toggle:
`data-calm="true"` on `<html>`, persisted to `localStorage`, doing everything the reduced
motion block does plus dropping the texture layers. WCAG 2.2.2 Pause, Stop, Hide is **Level
A** — the lowest bar in the standard — and an infinite marquee running alongside other
content with no pause mechanism fails it outright. That makes the toggle a requirement, not
an affordance.

The same switch is thrown for performance where a script is already running:
`navigator.deviceMemory <= 4` sets `data-calm` too. One mechanism, two reasons.

## Ambient motion and the loud-layer budget

An animated ornament is a loud layer. So is a marquee. So is a blend-mode overlay. The
`motionLoad` knob and the `layerCount` knob are therefore not independent: at intensity 100 a
scene may run three ambient loops, but if it is already spending its three layers on ground,
grain and a sticker cluster, animating any of them does not buy a fourth. Count first, then
animate.

## forced-colors

Forced-colors mode discards `background-image`, `box-shadow` and `mix-blend-mode`. A card
whose only boundary is a coloured shadow becomes invisible, so the depth language that the
motion sits on is simply gone — and motion attached to a shadow that no longer renders is
motion with nothing attached to it.

```css
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
```

Test it in Edge's forced-colors emulation rather than trusting the cascade. Every container
needs a real `border` — not a shadow — as its structural boundary, in every theme, at every
intensity.
