# Anti-patterns this skill refuses to generate

Source of truth: `docs/06-maximalism.md` §13, "Anti-patterns the skill must refuse to
generate", with the reasoning from §6, §7, §8 and §10.

Follow the refusal protocol owned by `ui-morphism-core`: **refuse, explain in one sentence
why, offer the compliant alternative, and record the refusal in the audit report's Refusals
section** with the request, the reason and the alternative offered. Do not silently emit a
compliant variant and say nothing — the user asked for a thing and is entitled to know it was
changed.

A refusal is about generation. If the user has already shipped one of these, the `audit`
skill reports it as a finding; it does not refuse to look at it.

## The fourteen

**1. Body text placed directly on a pattern, gradient, photograph or grain layer with no
opaque plane behind it.** This is the style's defining accessibility failure and it is not a
contrast-value problem: a pair that measures 4.5:1 against the ground's *average* collapses
to something like 1.5:1 wherever the pattern is light. Measure against the lightest and
darkest pixel, or put a plane under the text.
*Offer:* the text on `--max-surface` or `--max-surface-2`, with the pattern behind the plane
rather than behind the words.

**2. Any text/ground pair below 4.5:1, or below 3:1 for large text — including "just for the
hero".** The hero is where this request always arrives, and the hero is the largest, most
photographed, most screenshotted text on the page.
*Offer:* the role binding for that ground (`--max-text-on-paper`, `--max-text-on-ink`), or
the accent as a *fill* with ink text, which is the palette rule read the other way.

**3. More than three loud layers in one viewport, at any intensity value.** Doc §6: four or
more is where usability testing turns. The cap does not move with the knob — `layerCount` is
hard-capped at 3 and the budget is per rendered viewport, not per file.
*Offer:* name the three that survive and say which one the fourth displaced. The cheapest to
drop, in doc §8's order, are the blend-mode overlay, then the grain, then the chromatic
shadow.

**4. An infinite animation with no pause mechanism and no Calm toggle.** SC 2.2.2 is **Level
A** and it is the criterion this style breaks most reliably. `prefers-reduced-motion` does
not discharge it: it is an OS-level setting the user may not want to turn on globally.
*Offer:* the `CalmToggle` from `recipes.md` §5, plus `animation: none` under reduced motion.
Both, not either.

**5. Any full-area colour change faster than 2.5 Hz, and any strobing
`mix-blend-mode: difference` inversion.** SC 2.3.1, and the failure mode is a seizure, not a
complaint.
*Offer:* a minimum period of 400ms on any full-area change; for the inversion effect, a
single transition rather than a loop.

**6. Interactive targets under 24×24 CSS px after transform, or rotated sticker buttons with
no enforced minimum.** Rotation shrinks the axis-aligned hit box while the offset shadow
inflates the apparent one, so the user aims at a target that is not there.
*Offer:* `min-height` and `min-width` from `--max-target-min` (44px), and a Manual TODO to
measure the transformed box.

**7. Focus indication removed, or replaced by a background-colour change alone.** SC 2.4.7,
and on a style where background changes are already ambient a background-only cue carries no
state delta at all.
*Offer:* the double ring — `outline: var(--max-focus-ring)` at `var(--max-focus-offset)` plus
the `--max-focus-outer` halo as a `box-shadow`. Cyan against ink is 12.82:1, so the ring is
visible against itself over any ground.

**8. `mix-blend-mode` on a full-viewport overlay, or any blend mode outside an
`isolation: isolate` container.** A full-viewport multiply is the single most expensive thing
in this style and costs real milliseconds per frame on integrated GPUs; a blend with no
isolation resolves against the whole page backdrop, which is both slower and unpredictable.
*Offer:* keep blended elements small, wrap every scene in `isolation: isolate`, or
pre-compose the result as a flat `color-mix()` tone.

**9. Raster noise or pattern images where a CSS or SVG equivalent exists.** 200-600 KB of PNG
where a ~2 KB inline `feTurbulence` data URI does the same job, or a 100-400 KB tiled image
where `repeating-linear-gradient` costs nothing.
*Offer:* `--max-grain` for texture, the gradient recipes in `recipes.md` §1 for grounds. The
raster budget for this style is 0 bytes.

**10. Maximalist treatment applied to tables, charts, form validation, error states or
checkout steps when `surfaceType` is `app-accent`.** Doc §9: the style reads as confident
where exploration is the point and as chaos on a task-oriented surface. Inside an app it
survives as *one* loud surface — an empty state, a celebration, an upgrade wall — inside an
otherwise quiet product.
*Offer:* the `app-accent` cap (intensity 45, one loud layer, no marquee, no patterned ground)
applied to the celebration surface only, with the data surfaces left alone.

**11. `order` or `flex-direction: row-reverse` used to achieve anti-grid placement on
sequential content.** SC 1.3.2: it decouples DOM order from visual order, and anti-grid
layouts are already the most common source of that mismatch in this style.
*Offer:* build the reading order in the DOM, then displace visually with `grid-area`,
`translate` and `rotate`.

**12. Shadow-only container boundaries with no real `border`.** `forced-colors: active`
discards `box-shadow` entirely, and a card whose only edge was a coloured shadow becomes
invisible in one step.
*Offer:* `border: var(--max-stroke-2) solid var(--max-ink)` on every container, with the
shadow as the decoration it is.

**13. Glassmorphic translucent panels layered over a patterned maximalist ground.** Two
styles whose failure modes compound: the panel's effective background becomes the pattern,
which is exactly the unknowable backdrop glass already struggles with, and the pattern is
what the opaque plane existed to hide.
*Offer:* an opaque plane here, or hand the request to `glassmorphism-ui` and say plainly that
the ground has to go quiet for glass to work.

**14. More than four font families, or a font payload above 180 KB.** Three to four families
is the style's signature; five is not more maximalist, it is unbudgeted. Doc §8 puts naive
display-face loading at 480-900 KB against a 180 KB budget.
*Offer:* one variable font with weight and width axes in place of six statics, subset to
Latin, `woff2`, `font-display: swap`, preload only the hero face.

## Two more the doc argues for elsewhere

Not on §13's numbered list, but ruled out just as firmly.

**A lifted accent bound to `--max-text-on-ink` in dark mode.** §7 measures the lifted violet
at 2.46:1 on the cream surface — a hard 1.4.3 failure on the exact token that exists to make
such failures impossible. Not one lifted accent clears 3:1 there. The `-deep` ramp is the
only correct answer, and this is the single most likely defect to ship because it is
invisible in light mode.

**A decorative layer that is not `aria-hidden="true"` and `pointer-events: none`.** §7 is
categorical about it. A grain plane that can take a pointer event swallows clicks on the
control beneath it; a duplicated marquee track that is not hidden is announced twice.

## Adjacent-style handoffs

Not refusals — redirections. When the request is really for a neighbour, say so.

| Request | Actually |
|---|---|
| Translucent panels, frosted chrome, `backdrop-filter` | `glassmorphism-ui` |
| Refraction, specular rims, iOS 26/27 chrome | `liquid-glass-ui` |
| One bordered plane, hard shadow, no layer stack, no collage | `brutalism-ui` — and it is the closest neighbour: this style's intensity 0 lands very near its default |
| Strip it back to one accent and no ornament | `minimalism-ui` |
| Asymmetric tile spans, feature grids | `bento-grid-ui` — per-tile containment is also how this style caps loud layers on a dashboard |
| Panels at measured depth, parallax, a perspective stage | `spatial-ui` |
| Same-hue soft extrusion, "pressed-in" surfaces | `neumorphism-ui` |
| Puffy pastel surfaces, large radii, inset sheen | `claymorphism-ui` |
| Leather, wood, brushed metal, real-object mimicry | `skeuomorphism-ui` |
