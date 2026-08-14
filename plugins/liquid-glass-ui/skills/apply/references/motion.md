# Liquid Glass motion

Source of truth: `docs/08-liquid-glass.md` §6 "Interaction & Motion", with the durations and
easings from §4 and the cost model from §8.

## The rule that governs everything

**Animate the four cheap things and nothing else.** `transform`, `opacity`,
`background-color`, and `feDisplacementMap`'s `scale` attribute — that last one because
changing it does not rebuild the displacement map.

Everything else in the optics is a rebuild. kube.io's analysis is explicit that nearly every
geometry change forces a full regeneration of the map, and that is the expensive path: their
derivation runs 127 ray simulations per radius. So `backdrop-filter`'s blur radius, the
filter region's size, `border-radius` and any SVG filter geometry are off the table, and a
`transition: all` is off the table with them because it silently includes two of the four.

**And do not animate on scroll at all.** Recomputing a backdrop filter every frame while the
backdrop is also translating is the single most reliable way to drop below 60fps on
mid-range hardware. A 20px blur over a full-width 88px toolbar costs roughly 3-6ms per frame
on a 2022 mid-range Android before any displacement is added; add the displacement pass and
you are at or past the 16.7ms budget.

## Tokens

| Convention name | Doc name | Value | Use |
|---|---|---|---|
| `--um-liquid-glass-dur-fast` | `--lg-dur-state` | `180ms` | Hover, active |
| `--um-liquid-glass-dur-base` | `--lg-dur-morph` | `320ms` | Merge / split, sheet present |
| `--um-liquid-glass-dur-slow` | `--lg-dur-settle` | `520ms` | Liquid overshoot |
| `--um-liquid-glass-ease-standard` | `--lg-ease` | `cubic-bezier(0.32, 0.72, 0, 1)` | Apple-sheet-like decelerate |
| `--um-liquid-glass-ease-spring` | `--lg-ease-spring` | `linear(0, 0.35, 0.86, 1.04, 1.01, 1)` | Approximates a 0.8-damping spring |

Three durations from §6 have no token in §4 and are emitted inline with a comment, per the
rule that a concept with no group gets a value rather than an invented token: the `120ms`
press-in, the `280ms` press-out, and the `1200ms` loading sweep.

## State table

| State | Treatment | Values |
|---|---|---|
| Rest | Base fill, rim highlight fixed at 135° | fill `0.62`, blur `20px`, rim `0.85` |
| Hover (pointer) | Fill +0.06, rim brightens, highlight follows the cursor | `background-color` +6%, `180ms`, `cubic-bezier(0.32,0.72,0,1)` |
| Active / pressed | Scale `0.97`, fill +0.14, contact shadow shrinks to `0 0 0` | `120ms` in, `280ms` out with spring easing |
| Focus-visible | 3px accent ring at 2px offset, plus a 5px dark halo and an 8px light halo | Never the glass border alone |
| Selected / current | Fill `0.46` inner pill inside the bar | Persistent, not motion-dependent |
| Disabled | `opacity: 0.42`, refraction off, no pointer events | Keep the label at ≥ 3:1 against the composite |
| Loading | Rim highlight sweeps 0→100% across the element | `1200ms`, `ease-in-out`, infinite. Disabled entirely under reduced motion |
| Morph / merge | Two capsules blend and separate | `320ms`, spring `linear(0,0.35,0.86,1.04,1.01,1)` |
| Sheet present | Scale `0.94 → 1.015 → 1.0`, opacity 0→1 | `520ms` settle |

Two rows are refusals in disguise.

**Selected** is marked "persistent, not motion-dependent" because a selection carried by a
sweep or a transition is invisible to anyone who has reduced motion on, and invisible to a
screen reader regardless. The inner pill and `aria-current` are the signal; the motion is
reinforcement.

**Disabled** keeps its label at ≥ 3:1 *against the composite*, which is the number that
moves as the user scrolls. `opacity: 0.42` on the whole surface is the doc's value and it
is the ceiling, not a starting point — and the disabled state carries an ARIA attribute as
well, because a state signalled by transparency alone is one of the nine universal
failures.

**The specular sweep is decoration.** §6 states it outright: it must never be the only
signal that something is loading, focused or selected. Under reduced motion the sweep stops
and a static indeterminate bar takes its place — the loading state does not simply
disappear.

## Hover, and the pointer that is not there

Wrap the pointer-tracked highlight in `@media (hover: hover) and (pointer: fine)`. On touch
the highlight has nothing to track, and a hover state that latches on tap is worse than no
hover state. The `trackPointer` prop in `recipes.md` §3 does the same thing in JavaScript
and additionally returns early under reduced motion.

## Entrance and exit

Sheets and popovers use the `glass-settle` overshoot: `scale(0.94)` and `opacity: 0` to
`scale(1.015)` at 62% to `scale(1)` and `opacity: 1`, over `520ms` on `--lg-ease`. That is
the "liquid" in the name — the surface overshoots and settles rather than easing flat into
place.

```css
@keyframes glass-settle {
  0%   { transform: scale(0.94); opacity: 0; }
  62%  { transform: scale(1.015); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
```

Both properties in that keyframe are on the cheap list. There is no blur wake-up on entry in
this style — unlike glassmorphism, which permits one on mount — because the map is what
would be rebuilt, not just the blur.

## Merge and morph

Two glass elements approaching each other blend like mercury droplets and separate again.
On Apple platforms this is `GlassEffectContainer` plus `glassEffectID`, and it is the
platform's job. **There is no CSS equivalent.** The closest is an SVG gooey filter —
`feGaussianBlur` followed by `feColorMatrix` alpha contrast — and it is a separate filter
graph over the *elements*, not over the backdrop, so it composes badly with the displacement
filter and doubles the filter cost. Emit it only when the user asks for the merge
specifically, and say what it costs.

Whatever the mechanism, a merging group must not change accessible name, role or focus
order while it morphs, and a button must not be removed from the DOM mid-morph.

## `prefers-reduced-motion: reduce`

```css
@media (prefers-reduced-motion: reduce) {
  .lg, .lg-btn, .lg-sheet {
    transition-duration: 1ms !important;
    animation: none !important;
  }
  .lg-btn:active { transform: none; }
  .lg--loading::after { animation: none; opacity: 1; }
}
```

Collapse durations to `1ms` rather than deleting the transitions — deleting them causes
state-change flashes. Then drop the press `transform`, stop the sweep, stop the morph, and
leave the loading indicator *visible and static* rather than gone. The reduced-motion block
must not remove a state-carrying property; it only zeroes durations and removes the motion
components, and `ui-morphism-core:a11y-validate` checks that separation as one of its nine
universal checks.

## On Apple platforms

Honour `accessibilityReduceMotion` for the morph animations and
`accessibilityReduceTransparency` for the material itself. **They are separate settings and
users commonly enable only one**, so branching on one and assuming the other is how a build
ships a fully animated opaque toolbar, or a still translucent one. Both appear in the
SwiftUI recipe in `recipes.md` §4, read independently.
