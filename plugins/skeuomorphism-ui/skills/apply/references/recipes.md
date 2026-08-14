# Skeuomorphism recipes — condensed

Source of truth: `docs/01-skeuomorphism.md` §5. The full listings are in the doc; this
file is the shape and the invariants, so the skill can emit correct code without
re-reading 300 lines of CSS. Where a recipe is short enough to be safer quoted than
paraphrased, it is quoted.

Every recipe assumes `../assets/tokens.css` is loaded. **A component sheet declares no
tokens of its own.** It consumes `--sk-*` and supplies inline fallbacks in the form
`var(--sk-dur-press, 90ms)`, never `--sk-dur-press: 90ms`. That is the difference between
a component that respects the app's theme and one that silently overrides it.

## 1. The chassis, and where the grain lives

```css
.sk-panel {
  position: relative;
  isolation: isolate;
  background-color: var(--sk-bg);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-lg);
  padding: var(--sk-s-5);
  color: var(--sk-ink);
  font-family: var(--sk-font);
  box-shadow: var(--sk-elev-3);
}
/* Grain lives on a pseudo-element so it never re-rasterises with content */
.sk-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-image: var(--sk-noise);
  background-repeat: repeat;
  background-size: 160px 160px;
  opacity: var(--sk-noise-opacity);
  pointer-events: none;
}
```

Three invariants in eleven lines. `isolation: isolate` on the parent is what makes
`z-index: -1` on the pseudo-element sit behind the content but in front of the
background, instead of escaping to the root stacking context. `border-radius: inherit`
stops the grain squaring off the panel's corners. And **this is the only grain layer in
the scroll container** — children inherit the visual field rather than each carrying
their own.

## 2. The raised button — the four-layer stack in one rule

```css
.sk-button {
  --_travel: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sk-s-2);
  min-height: var(--sk-target-min);
  padding: 14px 28px;
  font: 600 var(--sk-fs-300)/1 var(--sk-font);
  color: var(--sk-ink);
  text-shadow: var(--sk-emboss);
  background: var(--sk-face);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-md);
  box-shadow: var(--sk-elev-2);
  cursor: pointer;
  user-select: none;
  transition:
    transform   var(--sk-dur-press) var(--sk-ease-press),
    filter      var(--sk-dur-hover) var(--sk-ease-standard);
}
.sk-button:hover { filter: brightness(1.03); }
.sk-button:active {
  transform: translateY(var(--_travel));
  background: linear-gradient(to bottom, var(--sk-surface-lo) 0%, var(--sk-well) 100%);
  box-shadow: var(--sk-press-inner), var(--sk-press-inner-2);
}
.sk-button[aria-pressed="true"] {
  background: linear-gradient(to bottom, var(--sk-surface-lo) 0%, var(--sk-well) 100%);
  box-shadow: var(--sk-press-inner), var(--sk-press-inner-2);
}
.sk-button:disabled {
  cursor: not-allowed;
  filter: saturate(.25);
  opacity: .55;
  box-shadow: var(--sk-elev-1);
  transform: none;
}
.sk-button:focus-visible {
  outline: var(--sk-focus-width) solid transparent; /* keeps forced-colors happy */
  box-shadow: var(--sk-elev-2), var(--sk-focus-ring);
}
```

Read the `:focus-visible` rule twice. It re-states `--sk-elev-2` **before** the ring: a
`box-shadow` declaration replaces the whole stack, so writing the ring alone would delete
the object's depth the moment it received focus. Where the stack was resolved at runtime
rather than taken from a static token, that is what `--sk-elev-current` exists for. The
transparent `outline` is not decoration either — in forced-colors mode the UA gives a
transparent outline a real system colour, so the control keeps a focus indicator after
every shadow in the file has been deleted.

**One deliberate deviation from the doc's own listing, and it is the only one in this
file.** §5's `.sk-button` names three transitioned properties and `box-shadow` is the
first of them. §6 says "**Do not animate `box-shadow`**" and §13's self-run checklist
requires "zero `transition` or `animation` declarations targeting `box-shadow`,
`background-image`, or gradient stops". §6 and §13 are the normative statements and §5 is
the illustrative listing, so the emitted rule drops the `box-shadow` term: the travel
still eases over 90ms on `transform`, and the four-layer-to-inset swap arrives in one
frame underneath it. Nothing is lost visually — 90ms is at the edge of perception, and
the shadow swap is exactly what reduced motion makes instant anyway — and the emitted
sheet passes its own checklist instead of shipping with a documented exception nobody
re-reads. Record it once in the audit's Corrections. Where a shadow genuinely has to
change smoothly, cross-fade two pseudo-elements carrying static shadows.

## 3. The recessed well — the stack inverted

```css
.sk-well {
  background: linear-gradient(to bottom, var(--sk-well) 0%, var(--sk-surface-lo) 100%);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  border-radius: var(--sk-r-md);
  box-shadow: var(--sk-elev-0);
  padding: var(--sk-s-3) var(--sk-s-4);
  color: var(--sk-ink);
  font: var(--sk-fs-300)/var(--sk-lh-body) var(--sk-font);
}
.sk-well:focus-within { box-shadow: var(--sk-elev-0), var(--sk-focus-ring); }
```

The gradient runs **dark to light** — the opposite direction to `--sk-face` — because the
top of a hole is in shadow and the bottom catches the light. `--sk-elev-0` is
`inset 0 2px 4px rgba(0,0,0,.22), inset 0 -1px 0 rgba(255,255,255,.55)`: shade at the
top, highlight at the bottom. Every input, textarea, select, slider track and slot uses
this. Getting it upside down is the single most common way an implementation stops
reading as hardware, because a well that bulges is a shape no physical panel has.

## 4. The toggle — the only place a specular hotspot belongs

```css
.sk-toggle::after {
  background:
    radial-gradient(ellipse 60% 40% at 50% 28%, var(--sk-specular), transparent 70%),
    var(--sk-face);
  border: var(--sk-hairline) solid var(--sk-border-strong);
  box-shadow: var(--sk-shadow-contact), var(--sk-bevel-top);
  transition: translate var(--sk-dur-release) var(--sk-ease-release);
}
.sk-toggle[aria-checked="true"] { background: linear-gradient(to bottom, #4e6b3c, #6d8c52); }
.sk-toggle[aria-checked="true"]::after { translate: calc(var(--_w) - var(--_h)) 0; }
```

The hotspot sits at **28% from the top** — inside §3's 25-35% band — because that is
where a curved surface catches an overhead light. Flat rectangles do not get one. The
track is a well (`--sk-elev-0`), the knob is a raised object, and the knob **throws**:
`translate` moves it, the track colour crossfades under it. A toggle that fades between
two colours without moving anything is a switch drawn by someone who has not held one.

The checked track is the doc's felt green. The state must also carry a non-colour cue —
position is one, and the knob's travel supplies it — because "the lit lamp means armed"
fails SC 1.4.1 if lit and unlit differ only in hue.

## 5. Labels

```css
.sk-label {
  font: 600 var(--sk-fs-100)/1 var(--sk-font);
  letter-spacing: var(--sk-label-tracking);
  text-transform: uppercase;
  color: var(--sk-ink-muted);
  text-shadow: var(--sk-emboss);
}
```

Letterpress costs nothing and sells the material instantly: dark ink plus a 1px white
shadow *below* the glyph on a light surface, inverted to `--sk-deboss` on a dark one.
Uppercase at `0.06em` is a legibility trade — check it survives the SC 1.4.12 text-spacing
overrides at line-height 1.5 and letter-spacing 0.12em before shipping it on anything
longer than two words.

## 6. The three mandatory guard blocks

Never optional, and written in the same commit as the component.

```css
@media (prefers-reduced-motion: reduce) {
  .sk-button, .sk-toggle::after { transition-duration: 1ms; }
  .sk-button:active { transform: none; }
}
@media (prefers-contrast: more) {
  :root { --sk-ink: #2c2418; --sk-border-strong: #4a3f2d; }
  .sk-panel::before { opacity: 0; }
}
@media (forced-colors: active) {
  .sk-button, .sk-well, .sk-toggle {
    border: 2px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
    forced-color-adjust: none;
  }
  .sk-panel::before { display: none; }
  .sk-button:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
  .sk-toggle[aria-checked="true"] { background: Highlight; }
}
```

`forced-colors: active` forces `box-shadow: none`, `text-shadow: none` and
`background-image: none`, so **the entire style disappears**. Every bevel, every gradient.
If a control's only boundary was a shadow it becomes an invisible rectangle, which is why
the 1px `--sk-border-strong` is not negotiable. Note the asymmetry that catches people:
`background-image: none` does *not* apply to `url()` backgrounds, so the SVG data-URI
grain **survives** the mode and can wreck legibility. `display: none` it explicitly.
`forced-color-adjust: none` goes on the control, never on text.

A fourth block, `prefers-reduced-transparency: reduce`, is required whenever the hybrid
puts a translucent layer over the material: collapse it to an opaque fill. Treat it as
progressive enhancement — Chrome and Edge 118+ ship it, Firefox has it behind a flag, and
Safari does not support it as of August 2026, so it is never the only path to a legible
UI.

## 7. Tailwind v4

`../assets/tokens.theme.css` is the `@theme` block plus the two utilities. Three
invariants: `@theme` is never nested inside an at-rule; theme switching happens outside it
on ordinary selectors; and the shadow **atoms** are the only shadow values written out,
with every compound composed from them by `var()` so the four numbers live in one place
per theme.

`@utility sk-grain` declares its own `::before` rather than being paired with the
`before:` variant — Tailwind injects `content: var(--tw-content)` into `before:`, so the
pairing is undefined. The utility carries its own dark, `prefers-contrast` and
`forced-colors` branches for the grain opacity.

The button in markup, showing the classes that must survive minification:

```html
<button type="button"
  class="sk-face inline-flex min-h-11 items-center justify-center rounded-sk
         border border-sk-border-strong px-7 py-3.5 text-base font-semibold
         text-sk-ink shadow-sk-raised
         [text-shadow:0_1px_0_rgb(255_255_255/.7)]
         transition-[box-shadow,transform] duration-90 ease-sk-press
         hover:brightness-[1.03]
         active:translate-y-px active:shadow-sk-pressed
         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cb0]
         disabled:cursor-not-allowed disabled:opacity-55 disabled:saturate-25
         motion-reduce:transition-none motion-reduce:active:translate-y-0">
  Engage
</button>
```

## 8. React

One component file, zero dependencies beyond React, one injected stylesheet keyed by a
stable `STYLE_ID` so it is injected once. The component **mints no token namespace of its
own**: every computed value is written inline onto the element as a §4 `--sk-*` custom
property, so the scoped sheet reads exactly the names the vanilla recipe reads.

`SkeuoButton` takes `intensity` (0-100, default 60), `material`, `elevation` (0-3),
`pressed`, and `grain`. It derives `k = clamp(intensity, 0, 100) / 100` and multiplies
every offset, blur and alpha by it — that is the `shadowDepth` knob, and it is why the
knob's curve is a straight line. `buildShadow(k, elevation, dark)` returns the resolved
stack; the component writes it to both `boxShadow` and `--sk-elev-current`, so
`:focus-visible` can re-state the stack it is adding a ring to. `--sk-press-travel` is
`k >= 0.25 ? 1px : 0px`. The grain is a separate `aria-hidden` `<span>`, not a
pseudo-element, so it can be switched off by prop.

Two details worth copying rather than reinventing. The focus ring is spelled out in the
scoped sheet rather than pulled from `--sk-focus-ring`, so the component stands alone
without the §4 `:root` block, and `--sk-bg` is set inline to keep the ring's inner halo on
the material's own ground colour. And `dark` is derived from the *material* — rubber has a
dark face — rather than from the theme, because the letterpress inverts with the surface
under it, not with the OS preference.

## 9. SwiftUI and other native targets

`SkeuoButtonStyle` takes `intensity` as 0…1 and `cornerRadius`, reads
`accessibilityReduceMotion` and `colorScheme` from the environment, and builds the face as
a three-stop `LinearGradient` at locations 0.0 / 0.45 / 1.0. The bevel is a
`strokeBorder` with a white-to-clear gradient at `0.80 * k`, drawn *inside* the material
edge stroke. Contact and ambient shadows are two `.shadow()` calls whose opacity goes to
zero when pressed; the inner press shade is a `.overlay` with `.blendMode(.multiply)`,
because SwiftUI has no inset shadow. The offset is `pressed && k >= 0.25 ? 1 : 0` — the
same suppression rule as the web.

`.glassEffect` is Apple's material, not this style. Build the bevelled hardware first and
put it *on* glass if you want the hybrid; never the other way round.

For iOS 26+ app icons, do not hand-paint bevels. Build foreground / mid-ground /
background as separate SVG layers on the 1024px grid (1088px circular for Watch), import
them into Icon Composer, and set specularity, translucency, blur and shadow per group.
Hand-baked highlights fight the system's own.

## 10. Layout and composition consequences that bite

- **Fixed-aspect hardware panels do not reflow.** A 1200px-wide mixer is an SC 1.4.10
  failure at 320px. Provide a stacked layout below 640px rather than horizontal scroll.
- **Build panel geometry with CSS Grid placement, not absolute positioning.** Skeuomorphic
  layouts habitually put the chassis markup before the content it frames; keep DOM order
  equal to reading order.
- **A focused control must not be hidden behind a raised panel or sticky toolbar** —
  SC 2.4.11. Raised surfaces overlap by design here, so check it deliberately.
- **A visual knob is `role="slider"`** with `aria-valuenow` / `-valuemin` / `-valuemax` /
  `-valuetext` and arrow-key handling. A drag-only dial is a straight SC 2.1.1 failure.
- **A latching hardware button is `<button aria-pressed>`; a bypass switch is
  `role="switch" aria-checked`.** Never `aria-pressed` on a link.
- **Grain, bevel and specular layers are `aria-hidden` pseudo-elements or spans**, never
  real content. A "leather ledger" that implies a finance context carries no accessible
  name — put it in text.
