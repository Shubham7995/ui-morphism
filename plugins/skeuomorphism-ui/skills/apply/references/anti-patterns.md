# Anti-patterns this skill refuses to generate

Source of truth: `docs/01-skeuomorphism.md` §13, "Anti-patterns the skill must refuse to
generate", with the reasoning from §7, §8 and §10.

Follow the refusal protocol owned by `ui-morphism-core`: **refuse, explain in one sentence
why, offer the compliant alternative, and record the refusal in the audit report's
Refusals section** with the request, the reason and the alternative offered. Do not
silently emit a compliant variant and say nothing — the user asked for a thing and is
entitled to know it was changed.

A refusal is about generation. If the user has already shipped one of these, the `audit`
skill reports it as a finding; it does not refuse to look at it.

## The twelve

**1. A control whose only boundary is a shadow or a bevel, with no border meeting 3:1.**
This is the failure that kills implementations. `forced-colors: active` nulls
`box-shadow`, so a bevel-bounded control becomes an invisible rectangle, and a bevel
highlight is not a boundary under SC 1.4.11 in any mode. The decorative
`--sk-border: #b8a98e` measures **1.76:1** and does not count.
*Offer:* the bordered version, `border: var(--sk-hairline) solid var(--sk-border-strong)`
— **4.01:1** against the face and **3.40:1** against the chassis — with a note that it was
added.

**2. Neumorphic dual-shadow extrusion** — `box-shadow: -Npx -Npx X light, Npx Npx X dark`
on a same-colour background. That is a different style, it measures 1.2:1 to 1.7:1 against
its own ground, and it is out of scope here.
*Offer:* this style's four-layer stack with a real border, or hand the request to
`neumorphism-ui` if soft same-hue extrusion is genuinely what was wanted.

**3. Any `transition: box-shadow`, or `@keyframes` mutating `box-shadow`.** Every frame
repaints the element's bounds, and a four-layer stack makes that repaint expensive. The
same applies to `background-image` and to gradient stops. Note that §5's own `.sk-button`
listing transitions `box-shadow`; §6 and §13 forbid it and they are the normative
statements, so the emitted rule drops the term.
*Offer:* transition `transform` and `filter`, let the stack swap in one frame, or
cross-fade two absolutely positioned pseudo-elements that each carry a static shadow —
that runs on the compositor.

**4. Grain opacity above 0.08, or more than one grain layer per scroll container.** Above
0.10 it stops reading as grain and starts reading as dirt; twenty components with their
own `::before` is twenty extra paint rectangles.
*Offer:* `--sk-noise-opacity` at 0.05 light / 0.07 dark, one layer on the outermost
chassis, children inheriting the visual field.

**5. Raster textures over 40 KB, or any texture with text baked into it.** A 512×512 noise
PNG is 40-90 KB and buys nothing visible at 5% opacity against a ~330-byte data URI. Text
in a texture carries no accessible name at all.
*Offer:* the inline `feTurbulence` data URI, or §8's tiling 2-colour SVG pattern (stitch,
mesh, brushed lines) at ≤ 2 KB. Put the words in text.

**6. Skeuomorphic treatment on body-copy backgrounds, table rows, or any element holding
more than about 120 characters of running text.** Texture behind body copy costs
comprehension and hurts SC 1.4.3; bevels on every row of a table are noise competing with
the data.
*Offer:* the intensity-0 baseline for the text container — bordered, flat, legible — with
the style carried by the chrome around it. This is the `surface: running-text` and
`surface: data-table` cap in the intensity contract, and it fires as a cap *and* is
recorded as a refusal.

**7. A drag-only knob, dial or fader.** No keyboard handler, no `role="slider"`, no
`aria-valuenow` / `aria-valuetext` is a straight SC 2.1.1 failure, and the fact that the
physical referent is rotated by hand is not an argument.
*Offer:* `role="slider"` with the full value triple plus `aria-valuetext`, arrow-key and
Home/End handling, and drag as an addition rather than the only route.

**8. Mixed light directions in a single emitted set.** A top-lit button beside a
bottom-lit card destroys the illusion instantly, and it is the number-one tell of a fake.
The only permitted inversion is a recessed container.
*Offer:* one overhead source everywhere, with wells, inputs and tracks on `--sk-elev-0`.

**9. `forced-color-adjust: none` on a text-bearing element.** It opts the element out of
the user's forced palette, which is the one thing the mode exists to guarantee. It belongs
on the control chrome only.
*Offer:* `forced-color-adjust: none` on the control, system colour keywords
(`ButtonFace` / `ButtonText`, `Canvas` / `CanvasText`, `Highlight`) on everything, and
nothing at all on the text.

**10. Removing an existing focus indicator in favour of a "more realistic" pressed look.**
The pressed stack is a state, not a focus indicator, and a keyboard user cannot see where
they are. §6's ring is *additive*.
*Offer:* `box-shadow: <the resolved stack>, var(--sk-focus-ring)` plus
`outline: var(--sk-focus-width) solid transparent` so forced-colors has something to
colour.

**11. Fixed-width hardware panels that cannot reflow below 640px.** A 1200px mixer is an
SC 1.4.10 failure, and horizontal scroll is not a fix.
*Offer:* a stacked layout below 640px built with CSS Grid placement, keeping DOM order
equal to reading order.

**12. Full-app application when the request was for a single component.** The measured
2026 usage says accent, not foundation, and §9 is explicit that this style is a deliberate
low-frequency choice.
*Offer:* the `scope` glob the user actually asked for, and say so. Doc §9's own
formulation is the argument: maximum intensity on one element beats 30% everywhere.

## Four more the doc argues for just as firmly

Not on §13's numbered list, but §10 rules them out in the same terms.

**A single `0 2px 4px rgba(0,0,0,.2)` presented as skeuomorphic.** One shadow reads flat.
The style is the four-layer stack — contact, ambient, inset bevel, inset lip — and
anything less is flat design with a drop shadow.

**`#ffffff` and `#000000` as material colours.** No physical material is pure white or
pure black. Faces sit at 8-25% saturation and 82-95% lightness; the ground has a hue.

**One global radius across metal, wood, glass and rubber.** Radius is a material
statement: 2-4px machined, 8-12px moulded, 16-24px soft goods. A single 12px value tells
the user every object on the screen is made of the same thing.

**Every card, input, chip and tooltip at full bevel.** Hierarchy collapses. Reserve
`materialFidelity` 3 — the specular hotspot and the edge highlight — for one or two hero
objects per screen.

## Adjacent-style handoffs

Not refusals — redirections. When the request is really for a neighbour, say so and name
the plugin.

| Request | Actually |
|---|---|
| Soft same-hue extrusion, borderless, "pressed-in" pills | `neumorphism-ui` — the closest relative and the worst combination; do not run both on one screen |
| Translucent panels, frosted chrome, `backdrop-filter` | `glassmorphism-ui`. §12: glass above, material below — never the reverse |
| Refraction, specular tracking, iOS 26/27 chrome | `liquid-glass-ui` — glassmorphism plus displacement and adaptive tint, a superset rather than a rebrand |
| Puffy pastel surfaces, radii ≥ 24px, inflated soft clay | `claymorphism-ui`. Works with an intensity ceiling, provided both share one light source |
| Strip it down, remove the ornament, one accent | `minimalism-ui`. §8's degradation ladder ends there, and `intensity: 0` here lands in the same place |
| Three loud layers, four typefaces, collage, blend modes | `maximalism-ui`. §12: maximalism supplies the field, this style supplies the objects in it |
| Hard 2-5px borders, zero-blur offset shadows, sticker tilt | `brutalism-ui`. §12 calls the pair a clash: one is anti-illusion, the other pro-illusion |
| Asymmetric tile spans, feature grids | `bento-grid-ui`. §12 calls this a strong combination — a rack of modules — provided every cell shares one elevation and one light direction |
| Depth ladders, parallax, a shared perspective stage | `spatial-ui`. §12 calls it the strongest argument for this style, with the constraint that depth comes from the stage rather than from each control |
