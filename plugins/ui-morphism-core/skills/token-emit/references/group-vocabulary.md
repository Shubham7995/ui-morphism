# The closed group vocabulary

Source of truth: [`docs/00-comparison-matrix.md` §7.3](https://github.com/Shubham7995/ui-morphism/blob/main/docs/00-comparison-matrix.md). Twenty-two groups. Every doc uses the same word for the same concept, and only these words.

`scripts/emit.mjs` exports this table as `GROUPS` and rejects any key whose group is not in it. Where a group has a closed variant list, the emitter checks the variant too; where the ladder is style-dependent (`blur`, `weight`, `leading`, `tracking`) any `[a-z0-9]+` variant is accepted.

| Group | Variants / steps | Closed? | Concept |
|---|---|---|---|
| `bg` | — | yes | Page ground. The thing surfaces sit on. |
| `surface` | `1` … `4` | yes | Raised or distinct planes, ascending. `surface-1` is the default card. |
| `ink` | *(bare)*, `muted`, `inverse` | yes | Foreground text and icon colour. `ink` is body-copy grade (≥ 4.5:1); `ink-muted` is still ≥ 4.5:1; `ink-inverse` is for use on `accent`. |
| `border` | *(bare)*, `strong` | yes | `border` is decorative and may sit below 3:1. `border-strong` is the control boundary and **must** clear 3:1 unrounded. Every style with a shadow-only affordance is required to define `border-strong`. |
| `accent` | *(bare)*, `fg`, `subtle` | yes | The single action hue, its foreground, and a low-emphasis tint. |
| `danger` | — | yes | Destructive / error semantics. The only second hue minimalism permits. |
| `radius` | `sm`, `md`, `lg`, `pill` | yes | Corner geometry. `pill` is `999px`. |
| `shadow` | `1` … `5`, `inset`, `press` | yes | Composed, ready-to-use `box-shadow` values. `press` is the active-state stack. |
| `elev` | `0` … `5` | yes | Depth *level*, semantic rather than visual. Maps to a shadow step in flat styles and to a `translateZ` step in `spatial-ui`. |
| `blur` | numeric steps | no | Backdrop blur radius. Explicitly `0px` in `minimalism` and `brutalism` — declaring the zero is the contract. |
| `saturate` | — | yes | Backdrop saturation percentage. |
| `noise` | `opacity`, `freq` | yes | Grain layer opacity and `feTurbulence` `baseFrequency`. |
| `space` | `1` … `8` | yes | Spacing ramp. `space-4` is the 16px-class default step. |
| `font` | `body`, `display`, `mono` | yes | Family stacks. |
| `text` | `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl` | yes | Font-size ramp. |
| `weight` | named steps | no | Font weights the style permits. |
| `leading` | named steps | no | Line height. |
| `tracking` | named steps | no | Letter spacing. |
| `dur` | `fast`, `base`, `slow` | yes | Transition durations. |
| `ease` | `standard`, `enter`, `exit` | yes | Timing functions. |
| `focus` | `color`, `width`, `offset` | yes | Focus indicator. Required in every style; never expressed as `box-shadow`, because `forced-colors` deletes a shadow and leaves the control with no visible focus at all. |
| `target` | `min` | yes | Minimum hit target. Floor is 24px (SC 2.5.8); eight of the ten styles set 44px or more. |

## Which groups a style populates is a style fact

Core owns the vocabulary. It does not own which entries a style fills in, and gaps carry meaning:

- **Glassmorphism has no `bg`** — it depends on a ground it does not own. A glassmorphism token set that emits `bg` is describing a page it did not agree to own.
- **Minimalism sets `blur: 0px` explicitly** — declaring the zero is the contract, not an omission.
- **Brutalism sets `radius-sm`, `radius-md` and `radius-lg` all to `0`** — the same reasoning.
- **Claymorphism has no single `surface`** — clay surfaces are per-hue, so `surface-1` … `surface-4` hold the pastel ramp instead of an elevation ramp.
- **Spatial UI carries three target sizes** — 44px pointer, 60px gaze, 24px floor. The convention resolves the pointer value to `target-min` and keeps the other two as documented style values.

## Two groups that are never optional

**`border-strong`** — required in every style whose controls can be bounded by a shadow, a bevel, a blur or a fill alone, which is eight of the ten. It is the token `a11y-validate` checks first, in both themes, because the most-copied neubrutalism reference library ships a pure black border in its dark theme at roughly 1.6:1 against its own dark surface.

**`focus-color` / `focus-width` / `focus-offset`** — required in all ten. `focus-width` is at least `2px`, and the emitted rule uses `outline`, never `box-shadow`.
