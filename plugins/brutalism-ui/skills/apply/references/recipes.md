# Neubrutalism recipes — condensed

Source of truth: `docs/07-brutalism.md` §5. The full listings are in the doc; this
file is the shape and the invariants, so the skill can emit correct code without
re-reading 300 lines of CSS. Where a recipe is short enough to be safer quoted than
paraphrased, it is quoted.

Every recipe below assumes `assets/tokens.css` is loaded. **A component sheet declares
no tokens of its own.** It consumes `--nb-*` and supplies inline fallbacks in the form
`var(--nb-dur, 150ms)`, never `--nb-dur: 150ms`. That is the difference between a
component that respects the app's theme and one that silently overrides it, and it is
Rule 2 of the shared token convention.

## 1. The shared primitive

Everything else is this plus a fill and a rung.

```css
.nb {
  border: var(--nb-bw) solid var(--nb-border);
  border-radius: var(--nb-radius);
  box-shadow: var(--nb-shadow);
  background: var(--nb-surface);
  color: var(--nb-ink);
}
```

Border **and** shadow, always both. `forced-colors` nulls `box-shadow` but keeps
border geometry, so a border-first element degrades and a shadow-only element
disappears.

## 2. Button — the signature interaction

```css
.nb-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--nb-space-2);
  min-height: var(--nb-target-min);
  padding: var(--nb-space-3) var(--nb-space-5);
  border: var(--nb-bw) solid var(--nb-border);
  border-radius: var(--nb-radius);
  box-shadow: var(--nb-shadow);
  background: var(--nb-accent);
  color: var(--nb-on-accent);
  font-family: var(--nb-font-body);
  font-size: var(--nb-text-base);
  font-weight: var(--nb-fw-heading);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform var(--nb-dur-fast) var(--nb-ease),
    box-shadow var(--nb-dur-fast) var(--nb-ease),
    background-color var(--nb-dur) var(--nb-ease);
}

/* The signature move: travel exactly the shadow offset, drop the shadow. */
.nb-btn:hover  { transform: translate(var(--nb-sx), var(--nb-sy)); box-shadow: 0 0 0 0 var(--nb-border); }
/* Active goes 1px further so a click still reads as a click after hover. */
.nb-btn:active { transform: translate(calc(var(--nb-sx) + 1px), calc(var(--nb-sy) + 1px)); box-shadow: 0 0 0 0 var(--nb-border); }
.nb-btn:focus-visible { outline: var(--nb-focus-w) solid var(--nb-focus-color); outline-offset: var(--nb-focus-offset); }
```

Invariants: the translate distance equals the shadow offset **exactly** — a different
amount leaves a visible sliver and breaks the rigid-object illusion. Wrap the hover
rule in `@media (hover: hover) and (pointer: fine)`; hover does not exist on touch and
the `:active` press is what touch users get.

Disabled drops to the sunk surface, never to `opacity` alone:

```css
.nb-btn[disabled], .nb-btn[aria-disabled="true"] {
  background: var(--nb-surface-sunk);
  color: var(--nb-ink-muted);
  box-shadow: none; transform: none; cursor: not-allowed;
}
```

`opacity: 0.5` on `#0A0A0A` over the `#FEF6E4` cream composites to `#848077`, which is
3.66:1 against that same cream and fails 1.4.3 for text that still looks enabled.

Variants: `--neutral` swaps the fill to `--nb-surface`, `--danger` to `--nb-danger`,
`--reverse` is flat at rest and lifts up-left on hover via `--nb-shadow-rev`.

## 3. Card, input, badge

- **Card** — `--nb-shadow-lg`, `padding: var(--nb-pad-card)`, a display-face title at
  `--nb-text-xl` with `--nb-track-tight`. Flex column, `gap: var(--nb-space-3)`.
- **Input** — `--nb-shadow-sm` at rest, `min-height: var(--nb-target-min)`,
  `font: inherit`, `::placeholder { color: var(--nb-ink-muted); opacity: 1 }`. On
  focus the outline appears **and** the shadow steps up to `--nb-shadow`; the outline
  is the indicator, the shadow step is a bonus. Invalid state tints the fill via
  `color-mix(in oklab, var(--nb-danger) 18%, var(--nb-surface))` and keeps the ink
  border — colour alone never carries the error (SC 1.4.1), so pair it with
  `aria-invalid="true"` and a visible message.
- **Badge / sticker** — `--nb-shadow-xs`, mono font, uppercase, `--nb-track-label`,
  `transform: rotate(-2deg)`. Decorative only. A badge that contains or *is* a control
  does not rotate.

## 4. The nine components the skill emits

`Button`, `Card`, `Input`, `Select`, `Badge`, `Tabs`, `Dialog`, `Alert`, `Table` —
each border-first, each carrying the three guard blocks. Notes that are not obvious
from the button:

| Component | Style-specific requirement |
|---|---|
| `Select` | Native `<select>`; the arrow is an ink glyph, not a shadow. Same 44px min-height. |
| `Tabs` | Selected tab flips fill to `--nb-accent` **and** changes border weight or adds a glyph — fill alone is a 1.4.1 failure. |
| `Dialog` | `--nb-overlay` scrim; under `prefers-reduced-transparency: reduce` push it to solid `#000` or the sunk surface. `--nb-shadow-2xl`. Focus trap and `scroll-margin-block` so the focused control is never obscured (SC 2.4.11). |
| `Alert` | Icon plus text plus fill; never fill alone. `role="status"` or `role="alert"` chosen by urgency. |
| `Table` | Borders on the table and on section boundaries, **not** on every cell — §9: 2px borders on every cell past a few dozen elements is unreadable noise. Header row gets the accent fill. |

## 5. Tailwind v4

`assets/tokens.theme.css` is the `@theme` block. Two invariants: `@theme` is never
nested inside an at-rule, and theme switching happens outside it on the `.dark`
selector. Utilities come out as `bg-nb-*`, `border-nb-border`, `rounded-nb`,
`shadow-nb`, `shadow-nb-lg`, `translate-x-nbx`, `font-nb-display`, `ease-nb`.

The button in markup, showing the guard classes that must survive minification:

```html
<button class="nb-guard inline-flex min-h-11 items-center justify-center gap-2
       rounded-nb border-2 border-nb-border bg-nb-accent px-6 py-3
       font-nb-body text-base font-bold text-nb-ink shadow-nb
       transition-all duration-100 ease-nb
       hover:translate-x-nbx hover:translate-y-nby hover:shadow-none
       active:translate-x-[5px] active:translate-y-[5px]
       focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nb-ink
       disabled:translate-none disabled:bg-nb-sunk disabled:text-nb-muted disabled:shadow-none
       motion-reduce:transition-none motion-reduce:hover:translate-none motion-reduce:hover:shadow-nb-sm">
  Ship it
</button>
```

For Tailwind v3 there is no `@theme`; extend `tailwind.config.ts` with the same values
under `theme.extend.colors / borderRadius / boxShadow / spacing / fontFamily` and keep
the token CSS file as the source.

## 6. React

One component file, zero dependencies beyond React, one injected stylesheet keyed by a
stable `STYLE_ID` so it is injected once. `BrutalRoot` takes `theme` and
`intensity` and writes only the four intensity-driven custom properties onto its own
element — `--nb-sx`, `--nb-sy`, `--nb-bw`, `--nb-radius`. Everything else inherits.

`BrutalButton` forwards a ref, renders a real `<button type="button">`, threads
`tone` / `size` / `loading` through `data-*` attributes, sets `aria-busy` while
loading, and disables on `loading` as well as `disabled`. `BrutalCard` renders an
`<article>` with `aria-labelledby` wired to a `useId` heading. Tilt is a `data-tilt`
attribute on the card, and it is off by default.

The loading spinner uses `steps(8, end)` rather than a smooth rotation — stepped
easing is part of the low-fidelity register, and under reduced motion the duration
stretches to 2400ms rather than the animation being deleted.

## 7. SwiftUI and other native targets

SwiftUI's `.shadow()` is always blurred and cannot express a zero-blur offset. Draw the
shadow as a filled `RoundedRectangle` behind the content, offset by
`BrutalTokens.offset`, and move the content by the same amount when pressed while the
backing shape returns to zero. Same technique for Jetpack Compose (`Modifier.shadow()`
is blur-based) and React Native (`shadowRadius` / Android `elevation` are blur-based;
set `elevation: 0` explicitly on Android or Material's ambient shadow reappears).
React Native 0.76+ on iOS supports `boxShadow` with `blurRadius: 0`, which is cleaner
where available.

## 8. Figma

Effect style `nb/shadow-4`: Drop shadow, X 4, Y 4, Blur **0**, Spread **0**, `#000000`
at 100%. Build `nb/shadow-1`, `-2`, `-6`, `-10`, `-16` for the rest of the ladder.
Corner radius 0 (or 5 for the softer dialect). A 2px inside stroke style `nb/border`.
Auto Layout does not reserve space for effects, so add 4-6px of bottom and right
padding to any frame with shadowed children or the shadow clips. Put `border-width`,
`shadow-offset` and `radius` in Variables so intensity is one mode switch.

## 9. Layout consequences that bite

- `box-shadow` does not participate in layout. Reserve `padding-right` and
  `padding-bottom` equal to the largest shadow offset on any shadow-containing
  container, or the depth silently disappears at the container edge.
- Keep grid gaps ≥ shadow offset + 4px. The hover translate moves the element outside
  its layout box and will overlap its neighbour on a tight grid.
- A 16px shadow inside an `overflow: hidden` ancestor is clipped.
- `will-change: transform` goes on the hovered subtree only
  (`.nb-grid:hover .nb-card`), never on the list-item base class. 200 promoted layers
  costs tens of megabytes of GPU memory on mobile.
