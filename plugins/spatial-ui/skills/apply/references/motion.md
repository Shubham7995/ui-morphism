# Spatial UI motion

Source of truth: `docs/10-spatial-ui.md` §6, with the amplitudes reconciled against §4 and
§10 and the reduced-motion behaviour from §7.

The whole motion language is one idea: **depth is the primary state channel and colour is
secondary.** A panel does not light up when you point at it, it comes forward. Nothing
about that is decorative — it is the same channel the hierarchy is already encoded in, one
rung further along.

## State table

| State | Depth change | Other treatment | Duration / easing |
|---|---|---|---|
| Rest | level `n` | shadow `n`, fill `--sp-panel` | — |
| Hover (pointer) | `n → n+1` (+8px z) | fill lightens by 4%, specular rim brightens | 120ms `cubic-bezier(.2,0,0,1)` |
| Hover (gaze, visionOS) | no z change | system `hoverEffect` highlight only | platform-controlled, ~100ms |
| Active / pressed | `n → n−1`, floor 0 (−8px z) | fill darkens 6%, contact shadow tightens 40% | 90ms `linear` |
| Focus-visible | no z change | 3px solid ring at 3px offset, plus a 1px inner light ring | instant, never animated |
| Focus-within (panel) | `n → n+1` | matches hover so keyboard and mouse agree | 320ms `cubic-bezier(.2,0,0,1)` |
| Disabled | pinned to level 0 | opacity 0.40, shadow removed, no parallax | 0ms |
| Loading | pinned to current level | 1.6s opacity pulse 1.0 → 0.55 on content only, never on z | 1600ms `ease-in-out` |
| Modal open | content panel → `--sp-z-push` (−125px), dialog → level 5 | scrim `rgba(8,9,12,.44)` behind the dialog | 480ms `cubic-bezier(.2,0,0,1)` |

Two rows deserve reading twice. **Focus-visible does not move the panel** — a keyboard user
who cannot perceive depth would get nothing from a lift, so the ring is the indicator and
the lift is at most a bonus. **Loading pulses opacity on the content, never on z** — a
panel that breathes in and out of the room is optical flow with no cause, which is exactly
what triggers vestibular symptoms.

## Durations and easing

`--sp-dur-hover` (120ms) is for state the user should *feel*: a fill change, a rim
brightening. `--sp-dur-depth` (320ms) is for anything that moves along z. `--sp-dur-panel`
(480ms) is for a panel arriving in or leaving the scene.

`--sp-ease-depth` is `cubic-bezier(0.2, 0, 0, 1)`, an emphasised decelerate: the panel
leaves quickly and settles slowly, which is how a thing with mass behaves.
`--sp-ease-settle` is `cubic-bezier(0.34, 1.32, 0.64, 1)` and it overshoots slightly.
Overshoot is for **arrival only**. A panel leaving does not bounce; use the plain
decelerate so the exit reads as intentional rather than as a spring that ran out.

## What may and may not animate

**May:** `transform` (`translate3d`, `scale`, `rotateX` / `rotateY`), `opacity`,
`box-shadow` when it is a discrete swap between two token values, and `filter: blur()` on
decorative background layers only.

**May not, and each for its own reason:**

- **`backdrop-filter` on a moving element.** The backdrop snapshot re-rasterises every
  frame. This is the single biggest cost in the style.
- **`perspective` itself.** It recomputes the whole 3D containing block.
- **`width` / `height` / `top` / `left`.** Layout thrash.
- **The depth of more than three panels at once.** Each triggers a re-raster of its own
  backdrop.

Done correctly this style triggers **zero layout and zero paint** during interaction:
`translate3d`, `scale` and `opacity` are compositor-only. The failure mode is animating
`box-shadow` across arbitrary values, which repaints. Fix it by cross-fading two
pseudo-elements each carrying a fixed shadow token, or by accepting the discrete swap at
the transition endpoints.

## Amplitudes

Pointer parallax caps at **12px of translation and 4° of tilt** across the full input
range. Scroll-driven depth caps at **±40px of z** over a full viewport of scroll. Both
numbers come from the same constraint the XR platforms enforce physically: Android XR keeps
content inside a 41° cone and a 0.75-5 m depth band precisely so the vestibular system is
never asked to reconcile large apparent motion with a stationary body.

`../assets/tokens.css` ships exactly those two numbers, and the intensity contract clamps
the pointer pair there at every intensity — see `tokens.md` §5 for why the knob's declared
maximum is larger than the clamp and which of the two the scroll variant gets.

## prefers-reduced-motion

**The correct reduction is: keep the depth, drop the movement.** Static `translateZ`,
static shadows and static counter-scale are all fine for a vestibular-sensitive user. What
triggers symptoms is optical flow that does not match head motion. So the reduction is not
"turn the style off":

```css
@media (prefers-reduced-motion: reduce) {
  :root { --sp-parallax-translate: 0px; --sp-parallax-tilt: 0deg;
          --sp-dur-depth: 1ms; --sp-dur-panel: 1ms; }
  .sp-panel, .sp-btn, .sp-layer, .sp-stage[data-tilt="on"] { transition: none; }
  .sp-stage[data-tilt="on"] { transform: none; }
}
```

And the half that CSS cannot do: **detach the pointer listener**, do not merely zero its
output. `../references/recipes.md` §5 has the `sync()` function that does it. A listener
that still fires and writes zeros runs `getBoundingClientRect` on every pointer move for no
visual result, and the media query is re-read on `change` because a user can turn Reduce
Motion on while the page is open. This is the assertion `../scripts/spatial-scan.mjs`
makes, and doc §13 states it as a refusal: parallax without a guard that detaches is on the
list of things the skill will not generate.

Gate on `(pointer: fine)` as well, so touch users never get tilt. A finger on glass has no
meaningful camera position.

On visionOS the platform equivalents are Settings → Accessibility → Motion → Reduce Motion
and, since visionOS 2.1, Settings → Awareness & Safety → **Stabilize Nearby Content**.
Respect both by reading `UIAccessibility.isReduceMotionEnabled` and avoiding self-initiated
window motion.

## Motion that needs an off switch beyond the OS setting

Pointer parallax is motion triggered by interaction (SC 2.3.3, AAA). Scroll-driven depth
that continues after the user stops scrolling is auto-playing motion (SC 2.2.2, Level A).
Both need a control in the interface if the effect exceeds the amplitudes above — and the
honest reading is that if you are reaching past 12px and 4°, you have already decided the
effect matters enough to need the switch.

Auto-playing camera fly-throughs, continuous idle drift and device-orientation parallax on
mobile are on the refusal list outright. There is no amplitude at which a camera that moves
by itself is a good idea in a product interface.

## forced-colors

Forced-colors mode discards `backdrop-filter` and `box-shadow` but **keeps `transform`**.
The result, if nothing is done, is unstyled panels floating at arbitrary angles with no
visible edges — the worst possible output, because the depth language is gone and the
geometry that expressed it is still there.

```css
@media (forced-colors: active) {
  .sp-stage { perspective: none; }
  .sp-panel, .sp-orbiter { transform: none; backdrop-filter: none; forced-color-adjust: none;
                           background: Canvas; border: 1px solid CanvasText; }
  .sp-panel::before, .sp-layer { display: none; }
  .sp-btn:focus-visible { outline: 3px solid Highlight; }
}
```

`forced-color-adjust: none` appears on the panel background only, and only to restore the
border. It never goes on a text-bearing element.
