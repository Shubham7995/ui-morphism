# Minimalism recipes — condensed

Source of truth: `docs/05-minimalism.md` §5. The full listings are in the doc; this
file is the shape and the invariants, so the skill can emit correct code without
re-reading 300 lines of CSS. Where a recipe is short enough to be safer quoted than
paraphrased, it is quoted.

Every recipe below assumes `assets/tokens.css` is loaded. **A component sheet declares
no tokens of its own.** It consumes `--min-*` and supplies inline fallbacks in the form
`var(--min-dur-fast, 150ms)`, never `--min-dur-fast: 150ms`. That is the difference
between a component that respects the app's theme and one that silently overrides it.

Emit everything inside `@layer minimalism { … }`. This style is adopted by *removing*
things from an existing sheet, so the ability to switch the whole restyle off in one
deletion — and to lose specificity wars on purpose — matters more here than anywhere
else in the set.

## 1. The shared primitive

There is no shared decorative primitive. That is the point: a minimal surface is a solid
fill plus, at most, a 1px boundary.

```css
.min-surface {
  background: var(--min-surface-1);
  color: var(--min-text-primary);
  border: var(--min-border-width) solid var(--min-border-subtle);
  border-radius: var(--min-radius-lg);
  box-shadow: var(--min-shadow-0);
}
```

`--min-shadow-0` is written out rather than omitted, because elevation 0 is a named rung
and writing it is what stops a host sheet's inherited shadow from leaking through.

The one decision this primitive forces on every element: **which border**.
`--min-border-subtle` is decorative and sits at 1.2:1. `--min-border-strong` is
`#8F8F8F`, 3.23:1, and is the only one a control may rely on. Cards take subtle;
buttons, inputs, selects, checkboxes, toggle tracks and slider rails take strong.

## 2. Button — the compensating pass in one component

```css
.min-btn {
  --_bg: var(--min-surface-1);
  --_fg: var(--min-text-primary);
  --_bd: var(--min-border-strong);

  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--min-space-2);
  min-height: var(--min-control-lg);
  min-width: var(--min-target-min);
  padding-inline: var(--min-space-4);
  border: var(--min-border-width) solid var(--_bd);
  border-radius: var(--min-radius-md);
  background: var(--_bg);
  color: var(--_fg);
  font: inherit;
  font-size: var(--min-text-sm);
  font-weight: var(--min-weight-medium);
  line-height: 1;
  cursor: pointer;
  transition:
    background-color var(--min-dur-fast) var(--min-ease-standard),
    border-color var(--min-dur-fast) var(--min-ease-standard),
    opacity var(--min-dur-fast) var(--min-ease-standard);
}

.min-btn:hover  { background: var(--min-surface-hover); }
.min-btn:active { background: var(--min-surface-2); }

.min-btn--primary {
  --_bg: var(--min-accent);
  --_fg: var(--min-accent-fg);
  --_bd: var(--min-accent);
}
.min-btn--primary:hover  { background: var(--min-accent-hover); border-color: var(--min-accent-hover); }
.min-btn--primary:active { background: var(--min-accent-active); border-color: var(--min-accent-active); }
```

Four invariants, each of which is a defect the style ships without them:

1. **The primary variant is a solid fill.** Doc §10: ship solid, filled primary buttons.
   NN/g advises against ghost buttons as the primary CTA and reported click rates run
   materially lower. An outline-only primary is on the refusal list.
2. **`min-height` comes from `--min-control-lg` and `min-width` from
   `--min-target-min`.** Never a literal. §7 is explicit: the 24px floor is a token so a
   theme override moves the floor in one place, and nothing downstream may override it
   downward. 40px is the resting size; 44×44 is the better product decision on any
   touch-primary surface.
3. **`--min-border-strong` is the default boundary**, not `--min-border-subtle`. The
   secondary button's border is its only affordance.
4. **`--quiet` is the only borderless variant, and it buys the boundary back on hover**
   with a background step *and* an underline:

```css
.min-btn--quiet {
  --_bg: transparent;
  --_fg: var(--min-text-secondary);
  --_bd: transparent;
}
.min-btn--quiet:hover {
  background: var(--min-surface-2);
  color: var(--min-text-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

Disabled is `opacity: 0.5` plus `cursor: not-allowed` plus a real `disabled` or
`aria-disabled` — and never opacity alone to communicate *why*. Loading is a 2px
indeterminate bar under the label, not a spinner and not a skeleton shimmer:

```css
.min-btn[data-loading="true"] { position: relative; color: transparent; }
.min-btn[data-loading="true"]::after {
  content: "";
  position: absolute;
  inset-block-end: 4px;
  inset-inline: 12px;
  block-size: 2px;
  border-radius: 1px;
  background: currentColor;
  color: var(--_fg);
  animation: min-progress 1200ms var(--min-ease-standard) infinite;
  transform-origin: left center;
}
```

The loop is legal because it represents an in-progress operation; pair it with
`aria-busy` and a visually hidden "Loading". Under reduced motion the animation stops and
the bar rests at `scaleX(1)` at `opacity: 0.6` — it does not disappear.

## 3. Focus, input, and the data row

Focus is one rule and it covers everything:

```css
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: var(--min-focus-ring-width) solid var(--min-focus-ring);
  outline-offset: var(--min-focus-ring-offset);
  border-radius: var(--min-radius-sm);
}
```

`:focus-visible`, never `:focus`, so pointer users do not see rings. `outline`, never
`box-shadow`, because forced-colors deletes a shadow. Offset, so the ring sits outside
the element and is never clipped by an ancestor.

**Input.** `min-height: var(--min-control-lg)`, `border: var(--min-border-width) solid
var(--min-border-strong)`, `font: inherit`, placeholder at `--min-text-muted`. Hover
darkens the border to `--min-text-secondary`; focus takes it to `--min-accent` *in
addition to* the outline, never instead of it. A visible `<label>` is mandatory —
placeholder text is never the only label (SC 3.3.2), and the label is one of the things
this skill may restyle and may never delete. Error state is a `--min-danger` border
**plus** a message with an icon, plus `aria-invalid="true"`; colour alone fails 1.4.1.

**Data row.** This is where the style earns its keep and where it most often overreaches:

```css
.min-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--min-space-4);
  padding: var(--min-space-3) var(--min-space-4);
  border-block-end: var(--min-border-width) solid var(--min-border-subtle);
}
.min-row:last-child { border-block-end: 0; }
.min-row:hover { background: var(--min-surface-2); }
```

The row separator is the one legitimate use of `--min-border-subtle` at 1.2:1: it
separates two rows, it is not a control, and nothing depends on seeing it. The row's
*actions* are controls and take a real boundary. Selected rows get
`background: var(--min-accent-subtle)` **plus** `box-shadow: inset 2px 0 0
var(--min-accent)` — a tint alone is colour-only encoding.

## 4. The five components the skill emits

`Stack`, `Button`, `Card`, `Input`, `ListRow` — doc §13 output 3, props-driven, no
runtime dependencies. Notes that are not obvious from the button:

| Component | Style-specific requirement |
|---|---|
| `Stack` | The whitespace engine, and the only place spacing magic numbers may live. Gaps come from the 4px scale by index, not by px value. `measure` clamps to `65ch` and only in column direction. It is what replaces dividers: 8px inside a group, 32px between groups, the 4:1 ratio §3 names. |
| `Card` | `elevation` is `0`, `1` or `2`, and nothing above 2 exists. Renders a real `<section>` with `aria-labelledby` wired to a `useId` heading when `title` is supplied — space is not a heading and screen readers cannot see it. |
| `Input` | Label, help text and error message are separate rendered nodes, each with an id wired into `aria-describedby`. None of the three may be dropped for visual quietness. |
| `ListRow` | Semantic `<li>` inside a real list, or a `<tr>` in a real table. Hover is a background step, never a transform. Row actions are real controls at `--min-control-lg`. |
| Icon-only anything | `aria-label` is required and the icon is `aria-hidden="true"`. The React recipe warns in development when an icon-only `Button` has no `label`, which is the cheapest place to catch it. |

Icons are a single stroke weight throughout — 1.5px on a 24px grid, or 1.25px on 20px —
with no fills except for selected states. Mixing filled and outline icons on one surface
breaks the style instantly (§3), and it is a thing to check rather than to emit.

## 5. Tailwind v4

`assets/tokens.theme.css` is the `@theme` block. Three invariants: `@theme` is never
nested inside an at-rule; theme switching happens outside it, on the media query and the
`[data-theme="dark"]` selector; and both resets are non-negotiable.

- `--color-*: initial` clears Tailwind's default palette, so nobody can reach for
  `bg-fuchsia-400`. It also removes `transparent` and `currentColor` as theme colours;
  reach for them as arbitrary values or re-declare them in your own layer.
- `--shadow-*: initial` clears the six default shadow steps and leaves the three this
  style permits — `shadow-flat`, `shadow-raised`, `shadow-overlay`.
- `--spacing: 4px` regenerates the whole numeric spacing scale from a single 4px unit,
  so `p-4` is 16px and `gap-6` is 24px with no per-value declarations.

`max-w-(--container-measure)` is v4's shorthand for referencing a theme variable in an
arbitrary value, and it is how the 65ch measure reaches markup. Control sizing is
`min-h-control-lg` and `min-w-target-min` from the `--spacing-*` namespace — never
`min-w-6`, which is the same 24px expressed as a literal nobody can re-theme.

A row action, showing the classes that carry the affordance:

```html
<a href="/invoices/148"
   class="inline-flex min-h-control-lg items-center rounded-md border border-line-strong
          px-4 text-sm font-medium text-ink transition-colors duration-150 ease-standard
          hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-accent">
  View
</a>
```

`border-line-strong`, not `border-line`. That single class is the difference between a
control with a 3.23:1 boundary and a control with a 1.2:1 one.

## 6. React

One component file, zero dependencies beyond React. `SPACE` is the only place magic
numbers live, and every component reads `var(--min-*)` for colour, radius, elevation and
motion so a theme swap is a token swap.

`Button` forwards a ref, renders a real `<button>` with an explicit `type`, sets
`aria-busy` while loading, keeps itself focusable while loading, and takes its icon-only
`minWidth` from `var(--min-target-min)` rather than a literal — a theme override then
moves the floor in one place instead of two. `Card` renders a `<section>` with
`aria-labelledby` bound to a `useId` heading, and its `SHADOWS` array is three entries
long because the elevation ladder is three rungs long. `Stack` is the whitespace engine
and clamps to `65ch` only in column direction, because a measure on a row is meaningless.

Where the host uses CSS Modules or styled-components instead, the same rules apply and
the tokens are still `--min-*`: this style's output is CSS custom properties plus
markup discipline, and the component layer is the thinnest part of it.

## 7. SwiftUI and other native targets

SwiftUI is the genuinely interesting target, because since iOS 26 the platform default is
*no longer* minimal. Liquid Glass is applied automatically to standard bars and controls
once you build against the iOS 26 SDK, so a minimalist Apple app in 2026 is a deliberate
opt-out rather than a default.

Two consequences for emission. Keep custom minimal chrome **inside the content area**
rather than fighting `NavigationStack` bars and `.toolbar` items, which will pick up the
system material regardless. And if you deliberately reduce translucency, honour
`@Environment(\.accessibilityReduceTransparency)` so you are not the only surface in the
OS ignoring the user's setting.

Control height on Apple platforms is 44pt — the HIG minimum touch target — not the web's
40px resting size. That is a platform floor, not a token override, and it does not travel
back to the web build.

## 8. Figma

Nine type styles at the resolved ratio, three elevation effect styles (`min/flat` as no
effect at all, `min/raised`, `min/overlay`), two border colour styles named
`min/line` and `min/line-strong` so the decorative one cannot be picked for a control by
accident, and the 4px spacing ramp as Variables. Put `whitespaceMultiplier` and the type
ratio in Variables so intensity is one mode switch rather than nine edits.

## 9. Layout consequences that bite

- **`max-width` in `px` does not grow at 200% zoom.** Prose measures are `ch`; type is
  `rem`. A `px` measure clips at 200% and fails SC 1.4.4.
- **Fixed heights on text-bearing containers break under the SC 1.4.12 overrides.** Use
  `min-height`, never `height`, and avoid `overflow: hidden` on anything carrying a
  label. Test at line-height 1.5×, paragraph spacing 2×, letter-spacing 0.12em,
  word-spacing 0.16em.
- **Thin sticky headers cover the focused element.** This style loves them, and SC 2.4.11
  lands directly on them. Set `scroll-margin-block` equal to the sticky header's height
  plus `var(--min-space-2)` on every focusable, or `scroll-padding-block-start` on the
  scroll container. The header height is your application's own value, not a `--min-`
  token — substitute it literally or declare it under your own prefix.
- **Visual grouping is not semantic grouping.** Space instead of a `<fieldset>`, size
  instead of an `<h2>`, a gap instead of a `<section>` — screen readers see none of it.
  Every visually implied group gets a real container with an accessible name.
- **Grid and flex reordering decouples DOM order from visual order.** Check `order`,
  `grid-area` and `row-reverse` against SC 1.3.2 and 2.4.3 wherever the layout uses them.
- **`contain: content` on repeated list items and `content-visibility: auto` with a
  `contain-intrinsic-size` on long off-screen sections** are close to free here, because
  minimal rows have predictable heights — `contain-intrinsic-size: 0 64px` is easy to get
  right and removes off-screen rows from layout and paint entirely.
