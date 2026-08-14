# Minimalism motion

Source of truth: `docs/05-minimalism.md` §6, with the durations and easings from §4 and
the performance constraints from §8.

The whole motion language is one constraint: **this style has fewer visual channels than
any other in the set, so state must be encoded in colour value and border rather than in
depth, glow or texture.** The rule §6 states, and the one every row below serves: every
state change must be perceptible at 200% zoom, in greyscale, and with animations
disabled.

That last clause is the one that matters. If the interface only communicates state
*through* the transition, the transition is carrying meaning it cannot be trusted to
deliver, and a reduced-motion user gets nothing.

## State table

| State | Treatment | Values |
|---|---|---|
| Rest | Flat fill, hairline boundary | `var(--min-surface-1)`; `1px solid var(--min-border-strong)` for controls — `--min-border-subtle` is decorative and must not be used here |
| Hover | Background steps one surface level; the element never moves | `var(--min-surface-hover)` (light `#F0F0F0`, ~2% luminance drop); `var(--min-dur-fast)` |
| Hover (link) | Underline appears | `text-decoration: underline; text-underline-offset: 3px` — colour alone fails 1.4.1 |
| Active / pressed | Background steps a second level, no transform, or `scale(0.98)` at most | `var(--min-surface-2)`; `var(--min-dur-instant)`; `var(--min-ease-exit)` |
| Focus-visible | 2px solid accent ring at 2px offset, **outside** the element so it is never clipped | `outline: var(--min-focus-ring-width) solid var(--min-focus-ring); outline-offset: var(--min-focus-ring-offset)` |
| Selected | Accent-tinted ground **plus** a 2px accent inline-start bar | `background: var(--min-accent-subtle)`; `box-shadow: inset 2px 0 0 var(--min-accent)` |
| Disabled | 50% opacity, `cursor: not-allowed`, real `disabled` or `aria-disabled` | Never opacity alone to communicate *why* |
| Loading | Determinate bar where progress is known, a 2px indeterminate bar otherwise. No spinner over 24px, no skeleton shimmer | 1200ms loop; `aria-busy` plus a visually hidden "Loading" |
| Error | 1px `var(--min-danger)` boundary **plus** a text message with an icon | Message at `var(--min-text-sm)`; `--min-danger` on `--min-surface-1` is 4.83:1 in light mode |
| Empty | One sentence plus one primary action; no illustration larger than 96px | — |

Every row that says "plus" is a 1.4.1 requirement, not a stylistic preference. Selected,
error and loading each need a second channel because the first one is colour.

## Durations and easing

| Token | Value | What it is for |
|---|---|---|
| `--min-dur-instant` | 100ms | Colour-only feedback on a control the pointer is already over |
| `--min-dur-fast` | 150ms | Hover and active |
| `--min-dur-base` | 200ms | Local expansion — accordion, popover, disclosure |
| `--min-dur-slow` | 300ms | Full-panel transitions |

Nothing in this style exceeds 300ms. §6: over 300ms reads as sluggish, and the whole
point is that the interface gets out of the way. A duration above the ceiling is an
error, not a value to round.

Easing is `cubic-bezier(0.2, 0, 0, 1)` for entrances and state changes — fast start, long
settle — and `cubic-bezier(0.4, 0, 1, 1)` for exits. Springs and overshoot belong to
Material 3 Expressive and to claymorphism, not here. The mechanical test §6 gives: **if a
motion curve has a control point outside `[0,1]`, it is off-style.** That is what the
scanner greps for, and it catches `cubic-bezier(0.34, -1.56, 0.64, 1)` and every
`spring` / `elastic` / `bounce` keyword alias.

## What may and may not animate

**May:** `opacity`, `background-color`, `border-color`, `color`, `transform: translate`
up to 8px, `transform: scale` between 0.98 and 1.02, and `clip-path` or
`grid-template-rows` for disclosure.

**May not:** layout-affecting properties — `width`, `height`, `padding`, `margin`,
`top`/`left`; `box-shadow` on large surfaces, which is paint-expensive; `filter`;
`letter-spacing`; and any infinite loop that is not communicating an ongoing process.

The performance rule behind that split (§8): `opacity` and `transform` are composited and
skip layout and paint entirely. `background-color` triggers paint but not layout, which
is acceptable on small controls and unacceptable on a full-width sticky header during
scroll. Since hover in this style *is* a `background-color` step, that distinction is the
one to hold: step the background on rows and buttons, not on the sticky bar.

## prefers-reduced-motion

**Reduce, do not delete.** §6 is explicit, and it is the one place where the global
`0.01ms` reset is a floor rather than a good answer. Keep opacity cross-fades at
≤ 100ms so state changes stay legible; remove all translation, all looping animation, all
parallax and all `scroll-behavior: smooth`.

```css
@media (prefers-reduced-motion: reduce) {
  .min-popover { animation: none; transition: opacity 100ms linear; }
  .min-btn:active { transform: none; }
  .min-btn[data-loading="true"]::after {
    animation: none;
    transform: scaleX(1);
    opacity: 0.6;
  }
}
```

The loading bar is the worked example of "reduce, not delete": the loop stops, and the
bar stays visible at rest, because a user who has asked for less motion has not asked to
stop being told the button is busy.

Doc §10 names the failure directly: don't nuke all transitions to `0.01ms` in a way that
makes state changes imperceptible. The global reset in §5's vanilla recipe is a safe
floor to ship *alongside* per-component overrides that preserve a short fade — not
instead of them.

## forced-colors

Minimalism degrades well here because it has little to lose — with one exception, and it
is the exception this style creates: **transparent-background ghost controls vanish
entirely**, since `background: transparent` plus `border: transparent` leaves nothing for
the forced palette to paint.

```css
@media (forced-colors: active) {
  .min-card,
  .min-input,
  .min-btn { border: 1px solid ButtonBorder; }
  .min-btn--primary { forced-color-adjust: none; background: Highlight; color: HighlightText; }
  :where(a, button, input, select, textarea, summary):focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
}
```

Every interactive element gets a real `ButtonBorder` boundary. `forced-color-adjust: none`
appears on the primary fill and nowhere else — never on a text-bearing element. And never
use a `background-image` gradient to convey state: forced-colors removes it.

## prefers-reduced-transparency

Nearly a no-op, and that is a genuine advantage of this style over glassmorphism: the
token layer declares `--min-backdrop-blur: 0px`, so there is no translucent material to
downgrade. Still honour it on any overlay scrim — raise scrim opacity from 0.4 to 0.85
rather than blurring, since blurring is the thing this style does not do.

## Motion and the sticky header

Two SC 2.4.11 hazards travel together in this style and both are motion-adjacent. A thin
sticky header covering a focused element is a failure at any viewport height, and
`scroll-behavior: smooth` makes it worse by animating the element under the bar. Set
`scroll-margin-block` on focusables, drop smooth scrolling under reduced motion, and
verify by tabbing through at a short viewport rather than by reading the CSS.
