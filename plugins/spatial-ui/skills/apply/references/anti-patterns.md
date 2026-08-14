# Anti-patterns this skill refuses to generate

Source of truth: `docs/10-spatial-ui.md` §13, "Anti-patterns the skill must refuse to
generate", with the reasoning from §6, §7, §8 and §10.

Follow the refusal protocol owned by `ui-morphism-core`: **refuse, explain in one sentence
why, offer the compliant alternative, and record the refusal in the audit report's Refusals
section** with the request, the reason and the alternative offered. Do not silently emit a
compliant variant and say nothing — the user asked for a thing and is entitled to know it
was changed.

A refusal is about generation. If the user has already shipped one of these, the `audit`
skill reports it as a finding; it does not refuse to look at it.

Six of the thirteen are detected mechanically by `../scripts/spatial-scan.mjs`. Those rows
say so, and they name the scanner's rule id, so a refusal and a finding are traceable to
each other.

## The thirteen

**1. Parallax or scroll-driven depth with no `prefers-reduced-motion` guard that DETACHES
the listener.** Zeroing `--sp-parallax-translate` is half the job: the listener still fires
and still runs `getBoundingClientRect` on every pointer move, for no visual result. §6 is
explicit that the reduction is *keep the depth, drop the movement*, and that the listener is
removed rather than muted. The media query is also re-read on `change`, because a user can
turn Reduce Motion on while the page is open.
*Scanner:* `reduced-motion-detach`.
*Offer:* the `sync()` pattern in `recipes.md` §5 — `removeEventListener` first, re-add only
when `(pointer: fine)` matches and reduced motion does not, and a `change` listener on both
queries.

**2. Depth as the only encoding of a state, a selection or a hierarchy relationship.** The
accessibility tree gets a flat DOM; `translateZ` is invisible to it. This is SC 1.3.1, and
it is the failure that makes this style's risk rating high rather than medium. A "selected"
card that is only one rung further forward says nothing to a screen reader, a magnifier user
or anyone with reduced stereopsis.
*Offer:* the semantic equivalent alongside the depth — `aria-modal` / `<dialog>` at level 5,
`role="menu"` at level 3, `aria-current` or `aria-selected` for selection, headings and
landmarks for panels. The depth stays; it just stops being the only channel.

**3. Glass panels under body text below the alpha floor on a backdrop the project does not
control — and any contrast figure derived by averaging luminances.** With
`backdropControl: arbitrary` the floors are **α ≥ 0.62** for dark glass carrying light text
and **α ≥ 0.60** for light glass carrying dark text (its contrast floor is 0.49; 0.60 is the
legibility floor, because below it the backdrop imagery stays legible *through* the text — a
real failure the ratio does not capture). Both figures are §7's, composited per 8-bit channel
in gamma-encoded sRGB.

The second half of this refusal is the model, not the number. Averaging the fill's and the
backdrop's luminances is not an approximation; it is a different and consistently optimistic
model. §7 measures it: a white fill at α 0.20 over black is **1.50:1**, and the averaging
model claims **4.52:1** for exactly that case. Anyone who trusted it shipped body text at a
third of the contrast they believed they had.
*Offer:* the alpha at or above the floor, or `--sp-panel-legible`, or an opaque panel.
Ratios come from `ui-morphism-core:a11y-validate` and from nothing else in this plugin;
never round a ratio up through its threshold — 4.497:1 fails 4.5:1 and 2.96:1 fails 3:1.

**4. Drag-only panel movement or resizing, with no keyboard and no single-tap alternative.**
SC 2.5.7 Dragging Movements, Level AA. This is the criterion this style breaks most reliably
and the one nobody discusses. It applies to `movable()` and `resizable()` on Compose XR, to
drag-to-reposition windows, to drag-based depth controls and to a CSS `resize` handle
nobody thought of as a drag.
*Scanner:* `drag-alternative`, which reports the missing keyboard path and the missing reset
control as two findings so the fix is unambiguous.
*Offer:* arrow-key nudging on a focusable handle **and** a visible "reset layout" control.
Both halves: a keyboard path that can strand a panel off-screen is not an alternative.

**5. Text planes rotated more than 12° from the viewing plane.** Subpixel antialiasing and
legibility collapse past that. The rotation that matters is out of plane — `rotateX`,
`rotateY`, `rotate3d` about x or y. An in-plane `rotate()` turns the glyphs without tilting
the surface they sit on and is a different question.
*Scanner:* `text-plane-rotation`.
*Offer:* ≤ 12°, or move the text out of the rotated plane and rotate a decorative sibling.

**6. More than three nested `preserve-3d` contexts, or `preserve-3d` on a scrolling list
container.** Each level multiplies matrix work and defeats layer squashing; on a scroller,
every row becomes its own composited layer. §8 makes the scroller case a refusal rather than
a budget line.
*Scanner:* `preserve-3d-scroller` and `preserve-3d-nesting`.
*Offer:* one 3D context on the stage, one on the panel, and flat children. If the list must
be inside the stage, drop `preserve-3d` on the list and let its rows be 2D.

**7. `backdrop-filter` on repeated list or grid items, or on any element that animates its
transform.** Cost scales with the *area* of the blurred element and re-runs on every frame in
which the element or anything behind it moves. On a repeated item the count is whatever the
data returns rather than whatever the design drew.
*Scanner:* `backdrop-on-repeated` (error) and `backdrop-on-animated`, which separates a
continuous keyframe animation (error) from the bounded hover-lift transition §6's own state
table asks for (warning).
*Offer:* one blurred surface per view — the chrome, not the content — with opaque cards
inside it, and shadows swapped at the transition endpoints rather than blurred continuously.

**8. Permanent `will-change: transform` or `will-change: backdrop-filter` on non-animating
elements.** It pre-promotes every layer and exhausts GPU memory on mid-range Android.
*Scanner:* `permanent-will-change`.
*Offer:* §8's discipline — add the hint on `pointerenter`, remove it on `transitionend`, or
scope the rule to `:hover` / `:focus-within` / a `data-` state so the promotion exists only
while something is moving.

**9. `perspective` on `body`, on `html`, or on any ancestor of `position: fixed` chrome.**
`perspective` establishes a containing block for `fixed` and `absolute` descendants, so a
fixed header inside the stage silently stops being fixed. §8 calls this the most common bug
in spatial layouts, and it is not specific to `perspective`: any non-`none` `transform`,
`filter` or `will-change: transform` does the same thing.
*Scanner:* `camera-on-root` and `fixed-in-camera`.
*Offer:* one stage element that is a **sibling** of the fixed chrome, and a reported diff of
every element moved out of the subtree.

**10. Auto-playing camera fly-throughs, continuous idle drift, or device-orientation
parallax on mobile.** Motion the user did not initiate and cannot stop. SC 2.2.2 the moment
it runs past five seconds, and on a phone in a moving vehicle it is nausea rather than
delight. There is no amplitude at which a camera that moves by itself is a good idea in a
product interface.
*Offer:* motion bound to an input the user controls — pointer, scroll, or a state change —
capped at 12px of translate and 4° of tilt, with an off switch when it exceeds that.

**11. Interactive targets below `--sp-target-floor` (24 CSS px) anywhere, or below
`--sp-target-gaze` (60px) when `target` includes headset.** §7 notes the failure mode here is
the opposite of the usual one: nobody sets the token too low, somebody hard-codes
`min-height: 32px` on an orbiter button to keep the capsule slim and the literal beats the
token.
*Scanner:* `target-literal`, which flags the literal. Whether a given value clears SC 2.5.8
is `ui-morphism-core:a11y-validate`'s verdict.
*Offer:* `max(var(--sp-target-floor), var(--sp-target-pointer))`, upgraded to
`--sp-target-gaze` under `(pointer: coarse)` or `(hover: none)`, with ≥ 8px separation
between adjacent targets.

**12. Viewport-unit-only type scales, `user-scalable=no`, or any construct that prevents 200%
text zoom inside a transformed panel.** Transforms do not scale with font size, so a panel
sized to its text at 100% clips at 200%. SC 1.4.4, and it is the one that has to be tested
rather than reasoned about.
*Offer:* `clamp()` with a rem `min` and a rem `max`, `min-height` rather than `height` on
every panel, and no `maximum-scale` in the viewport meta.

**13. Claiming visionOS or Android XR API support that is not in the pinned SDK version — in
particular, Compose XR code with no explicit `1.0.0-alphaNN`.** `androidx.xr.compose` went
from `1.0.0-alpha01` on 12 December 2024 to `1.0.0-alpha16` on 15 July 2026 and has no stable
release; the surface moves every few weeks.
*Offer:* an explicit alpha pin in the build file, the API surface checked against that
version's release notes, and a plain statement in the report that this is an unstable API.

## Three more the doc argues for just as firmly

Not on §13's numbered list, and ruled out elsewhere in the research with the same force.

**A `translateZ` with no counter-scale, or a z value that is not on the ladder.** §3 and §5:
an element at z under a camera grows by `perspective / (perspective − z)`, and
`scale(1 − z / perspective)` is what cancels it. Without the counter-scale the panel reads as
a zoom rather than a depth, which is the single move the whole style rests on. And the ladder
is 0.1 / 16 / 24 / 32 / 40 / 56 — the Android XR `SpatialElevation` dp values — so nothing
lands between rungs.
*Scanner:* `counter-scale` and `ladder-quantisation`.
*Offer:* `translateZ(var(--sp-z-N)) scale(var(--sp-k-N))` with the matching `--sp-shadow-N`.
The three move together or the apparent-size invariant is gone.

**An orbiter whose hover target does not span the 20px gap.** §7, SC 1.4.13: content that
appears on hover must be dismissible, hoverable and persistent, and a floating toolbar that
vanishes when the pointer crosses the gap between panel and orbiter fails outright.
*Offer:* extend the hoverable area with a transparent `::after` on the panel or a padded
wrapper, and dismiss on Escape. Never a `transition-delay` — that is a guess about pointer
speed, not a hover target.

**Spatial UI as a whole-page treatment.** §9: this is a chrome-and-hero language, and a page
that is spatial all the way down is a page with no ground plane. Depth costs vertical space,
forces 44-60px targets and halves information density; on dense data work, long-form reading
or a regulated flow the answer is not a lower intensity, it is a different style.
*Offer:* narrow the scope to chrome and hero surfaces, or ship intensity 0 — §8's tier-1
fallback, which is the depth ladder and the shadow pairs with no camera at all, "90% of the
read for 5% of the cost".

## One thing the research contradicts itself about, recorded rather than resolved

§5's vanilla-CSS listing ships `will-change: transform` on the base `.sp-panel` rule. §8 and
§13 both forbid a permanent promotion on a non-animating element. This plugin follows §8 and
§13: the emitted panel carries no base `will-change`, and the scanner reports the doc's own
listing as one `permanent-will-change` error. `spatial-scan.test.mjs` pins that decision so
it cannot be reversed quietly. If a user pastes §5's listing verbatim and asks why it fails,
this is the answer — the listing is a reading aid, the rule is the rule.

## Adjacent-style handoffs

Not refusals — redirections. When the request is really for a neighbour, say so, and hand it
over rather than bending this style toward it. §12 supplies every row.

| Request | Actually |
|---|---|
| Translucent frosted panels with no camera and no z axis | `glassmorphism-ui` — §12 calls it the required partner: glass owns the surface, this style owns the camera. Almost every real implementation is both |
| Refraction, lensing rims, specular arcs, iOS 26/27 chrome | `liquid-glass-ui` — same lineage, opposite scale, and §12 warns that displacement plus backdrop sampling plus a 3D transform on one element is three expensive mechanisms at once. One lensing surface, plain glass on the panels |
| Strip it to one accent, no ornament, a quiet type scale | `minimalism-ui` — §12 calls it the best structural partner: depth only reads if the surfaces are quiet |
| Simulated material, texture, stitching, real-world affordance | `skeuomorphism-ui` — philosophical ancestor, category error in practice. Leather on floating glass is two things claiming to be physical at once |
| Puffy pastel surfaces, 24-40px radii, inset sheen | `claymorphism-ui` — §12 calls this pairing surprisingly good, on one condition: keep the clay opaque |
| Same-hue soft extrusion, "pressed into the surface" | `neumorphism-ui` — §12 calls it a direct contradiction. Neumorphism's premise is zero distance from a shared surface; this style's is separation in depth. Do not combine them |
| Three loud layers, clashing accents, collage, marquees | `maximalism-ui` — depth needs an empty ground plane and maximalism fills it. The only version that works is maximalist content inside strictly minimal spatial chrome |
| Hard ink borders, zero-blur offset shadows, anti-illusionism | `brutalism-ui` — §12 allows it as a deliberate collision on a portfolio and warns that in a product it reads as a half-finished migration |
| Asymmetric tile spans, feature grids | `bento-grid-ui` — works on one condition §12 states from both sides: the depth lives on a shared canvas behind the grid, and no tile gets its own `translateZ` |
| A slow mesh or aurora gradient behind the panels | No doc in this set, and the ideal ground plane — it gives parallax something to move against and caps the backdrop's luminance range so the alpha floors stay valid. Keep the gradient inside roughly 25 L\* points |
