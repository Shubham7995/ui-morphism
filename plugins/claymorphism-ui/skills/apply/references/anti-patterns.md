# Anti-patterns this skill refuses to generate

Source of truth: `docs/04-claymorphism.md` §13, "Anti-patterns the skill must refuse to
generate", with the reasoning from §7, §9 and §10.

Follow the refusal protocol owned by `ui-morphism-core`: **refuse, explain in one
sentence why, offer the compliant alternative, and record the refusal in the audit
report's Refusals section** with the request, the reason and the alternative offered.
Do not silently emit a compliant variant and say nothing — the user asked for a thing
and is entitled to know it was changed.

A refusal is about generation. If the user has already shipped one of these, the
`audit` skill reports it as a finding; it does not refuse to look at it.

---

## 0. The refusal that defines this style

Read this before the numbered list, because entry 2 is the whole reason this plugin is
separable from `neumorphism-ui`.

**A clay surface owns its colour.** §1 states the structural difference in one
sentence: neumorphism extrudes an element *out of* a background it shares a colour
with; claymorphism gives the element its own colour and *floats it above* the
background. §7 then attributes clay's entire viability to that one property — the
independent fill is what restores the contrast neumorphism lost, and it is why every
pastel in §4 clears 8:1 against `--clay-ink` — a figure no surface that inherits the
page's colour can reach, because it has no colour of its own to be measured against.

So a request for "clay, but the cards should be the same colour as the page" is not a
tuning request. It is a request for the other style, wearing this one's shadows, with
this one's shadows unable to do anything about it. Say so plainly:

> A clay surface has to carry its own colour — that independence is the only reason
> clay passes contrast checks where neumorphism does not. A card the same colour as the
> page with soft shadows around it *is* neumorphism, and its only boundary is a blurred
> shadow that will not reach the 3:1 SC 1.4.11 asks for — clay's own lavender manages
> only 1.59:1 against the pale page, and that surface at least has a colour of its own.
> I am giving the cards their own pastel from the ramp. If you
> genuinely want the same-hue extrusion, that is `neumorphism-ui`, and it ships a real
> hairline for exactly this reason.

---

## The eleven

**1. White or light-grey text on any pastel clay surface.** `#FFFFFF` on `#FFB3A7`
coral is **1.71:1** — a hard fail, and the most common clay mistake in the wild. Every
pastel in §4 was chosen so that dark ink clears 8:1 on it.
*Offer:* `--clay-ink-on-clay` (`#241F3A`), which reaches 9.20:1 on that same coral. If
the design needs white text, the fill has to become a saturated action colour dark
enough to carry it — `#5B3AE0` at 6.72:1, or `#C7442C` at 4.89:1, never `#E8573F` at
3.58:1.

**2. A clay surface whose background colour equals the page background.** See §0 above.
That is neumorphism, and §7 makes it the 1.4.11 failure as well: the boundary is a
blurred shadow at ~30% alpha over a same-lightness ground, and it does not reach 3:1.
*Offer:* a pastel from the §4 ramp with its matching `--clay-shadow-h`, and — where the
surface-to-ground delta is still thin — the `1px hsl(258 40% 55% / .55)` inset ring
§7 prescribes as mitigation (b).

**3. Removal, suppression, or `outline: none` on any focus indicator, under any styling
justification.** §7 names the exact excuse this style produces: designers delete the
ring because it "breaks the softness". SC 2.4.7 does not have a softness exemption.
*Offer:* `outline: var(--clay-focus-width) solid var(--clay-focus-color); outline-offset:
var(--clay-focus-offset)` — 3px at 3px offset. The offset is not decoration: a ring
drawn on the element edge disappears into the drop shadow. Check as well that it is not
clipped by an ancestor's `overflow: hidden` on a rounded card.

**4. The full clay stack on non-interactive elements when interactive elements in the
same view use it too.** §7 (SC 1.4.1): this recreates neumorphism's
"everything-looks-pressable" problem in a new costume, which is the failure clay exists
to fix.
*Offer:* reserve the inset-sheen-plus-drop stack for elements that can be *proven*
interactive — `button`, `a`, `[role=button]`, `input`, `[tabindex]`, a framework click
handler — and give static panels a flat fill with `--clay-drop-1` only.

**5. `box-shadow` inside a `transition` or `@keyframes` on virtualised lists, scroll
containers, or anything matched by a repeating selector.** §8: `box-shadow` is a
paint-stage property, so every frame re-rasterises the blur, and a 44px blur in a
virtualised list re-rasters on every scroll tick on mid-range Android.
*Offer:* animate `transform` on the parent and cross-fade the `opacity` of an
absolutely positioned `::after` carrying the hover shadow — `opacity` is
compositor-only. The full recipe is in `motion.md`.

**6. `forced-color-adjust: none` used to preserve the aesthetic in Windows High
Contrast mode.** §7: it defeats the user's stated preference. §5 records that clay
deviates from siblings 01, 02 and 03 deliberately here — it does not opt out of the
forced palette at all, so the property does not appear in its forced-colors block in
any form.
*Offer:* let the system colours win and rebuild the boundary with a real border —
`border: var(--clay-border-hc)` (`2px solid ButtonText`), plus `box-shadow: none`,
`background: ButtonFace`, `color: ButtonText`, and `outline: 3px solid Highlight` on
focus.

**7. Clay applied wholesale to data tables, financial statements, medical records, or
admin dashboards.** §9: clay's radii and padding cost roughly a quarter to a third of
usable content area against a flat card, and trust-and-gravity products read clay as
unserious at best and condescending at worst. §11 records that clay has essentially
never been adopted in enterprise UI, and the density penalty is the reason.
*Offer:* accent-only scoping — the primary CTA, the onboarding illustrations, the empty
states and the celebration moments, on a flat or minimal base. §12 calls that the most
common successful 2025-2026 deployment. If the surface is nonetheless in scope, the
intensity contract caps it at 0, which §9 calls by its plain name: ship flat.

**8. More than two nested clay elevation levels in a single subtree.** §9: three or
more turn into visual mud because the drop shadows overlap.
*Offer:* two levels, and grid gaps at or above `--clay-gap` (24px) so neighbouring
shadows never collide.

**9. Neutral `rgba(0,0,0,α)` drop shadows on coloured surfaces.** §3 calls
`rgba(0,0,0,.25)` — the 2022 `clay.css` default — the fastest way to make clay look
cheap; §10 puts it in the first Don't row.
*Offer:* the hue-matched form, `hsl(var(--clay-shadow-h) var(--clay-shadow-s)
var(--clay-shadow-l) / .30)`, with `--clay-shadow-h` set from the surface's own colour
via the map in `tokens.md` §2.

**10. Any output that omits the dark-mode block when `darkMode` is not `none`.** And a
dark block that reuses the light-mode shadow alphas is the same failure with extra
steps: §10 says the result is chalky grey plastic, and §13's validation item 8 turns it
into a hard assertion — dark sheen ≤ 0.20, dark shade ≥ 0.45.
*Offer:* §4's dark block, re-derived rather than alpha-reduced — rim 0.10, sheen 0.14,
shade 0.55 — written **twice**, once under
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and once
under `:root[data-theme="dark"]`, so a system preference and an explicit toggle both
win in both directions.

**11. Spline or WebGL 3D scenes injected above the fold on a mobile breakpoint.** §8: a
Spline scene ships a WebGL runtime plus geometry in the 1-4MB range and holds the GPU.
*Offer:* a pre-rendered still at or under 150KB as AVIF/WebP above the fold, with the
interactive scene lazy-loaded below it or behind an explicit interaction.

## Two more the doc argues for elsewhere

Not on §13's numbered list, but the doc rules them out just as firmly.

**Clay and neumorphism mixed in one interface.** §12 calls this "the single worst
combination in this doc set", because a same-coloured extruded element next to a
floating coloured one destroys the reader's model of where the light and the ground
plane are.
*Offer:* if the request is for subtle recesses, use clay's own inverted inset recipe
for inputs and wells (`recipes.md` §3) rather than importing neumorphism wholesale.

**A translucent clay surface.** §12: never make a clay element itself translucent — the
insets need an opaque body to shade, and a translucent clay surface reads as a smudge.
The same applies to a displacement filter from Liquid Glass.
*Offer:* the documented split — clay for the opaque, pressable objects; glass or Liquid
Glass for the overlays, sheets and nav bars that sit above them. Watch the compounded
cost: `backdrop-filter` plus a 44px blur on the same element is the most expensive
combination available.

## Adjacent-style handoffs

Not refusals — redirections. When the request is really for a neighbour, say so. All
ten style plugins exist, so every row here names one.

| Request | Actually |
|---|---|
| Same-hue soft extrusion on a shared ground, "pressed-in", soft UI | `neumorphism-ui` — the parent, and the one to keep at arm's length. §12: mixing the two is the worst combination in the set. |
| Translucent panels, frosted chrome, `backdrop-filter` | `glassmorphism-ui`. §12: this one works and was in the original recipe — Malewicz's own generator emits `backdrop-filter: blur(5px)`. Clay for opaque pressable objects, glass for the overlays above them. |
| Refraction, specular rims, iOS 26 / 27 chrome | `liquid-glass-ui`. Same split as glass, one rung more expensive. Never give a clay surface a displacement filter. |
| Leather, brushed metal, wood, stitching, photographic materials | `skeuomorphism-ui` — the adjacent ancestor. §12: clay simulates one generic, untextured, matte material; adding texture maps produces a 2011 pastiche. The one legitimate borrow is its discipline about a single light source. |
| Hard ink borders, zero-blur offset shadows, 0px radius | `brutalism-ui`. §12: structurally opposite and cannot coexist in one component; they can coexist across a *site* with strict zoning and real art direction. |
| Strip it back, flat information layer, one accent | `minimalism-ui` — §12 calls it clay's pragmatic host, and the most common successful deployment is a minimal base with clay on exactly one layer. |
| Three loud layers, high chroma, collage, blend modes | `maximalism-ui`. §12: works, with one rule — the collage may not run *behind* a clay card, because a busy ground makes the hue-matched boundary position-dependent and untestable against 1.4.11. |
| Asymmetric tile spans, feature grids | `bento-grid-ui` — a natural fit, with the caveat that bento's tight gutters fight clay's ≥ 24px gap requirement. Widen the gutters or reduce to `--clay-drop-1` inside the grid. |
| A real z-ladder, perspective, parallax | `spatial-ui`. §12 calls this clay's most defensible future: let the stage own perspective and parallax, let clay own the object's own volume, and never give a clay card its own perspective transform on top of the stage's. |
| "Make it look good", "polish this", "less AI-generated", animation craft, a general a11y sweep | None of the ten. Hand it to the general design, de-slopping, animation or accessibility tool the user already has — `accesslint`, `impeccable`, `frontend-design`, `ui-ux-pro-max`. This skill answers a named visual language, not a quality judgement. |
