# Anti-patterns this skill refuses to generate

Source of truth: `docs/02-neumorphism.md` §13, "Anti-patterns the skill must refuse to
generate", with the reasoning from §7 and §10.

Follow the refusal protocol owned by `ui-morphism-core`: **refuse, explain in one
sentence why, offer the compliant alternative, and record the refusal in the audit
report's Refusals section** with the request, the reason and the alternative offered.
Do not silently emit a compliant variant and say nothing — the user asked for a thing
and is entitled to know it was changed.

A refusal is about generation. If the user has already shipped one of these, the
`audit` skill reports it as a finding; it does not refuse to look at it.

---

## 0. The refusal that defines this style

Read this before the numbered list, because every entry below is a consequence of it.

**The central move of neumorphism cannot be made accessible.** The element's fill is
the same colour as its parent by construction, so the only thing describing its
geometry is a pair of same-hue shadows — and there is no value of blur, distance or
luminance delta that gets such a pair to the 3:1 that SC 1.4.11 requires while it still
looks neumorphic. The measured range is **1.2:1** to **1.7:1**: `#ffffff` against
`#e6e7ee` is **1.23:1**, `#b8b9be` against it is **1.59:1**, and in dark mode `#17191f`
against `#2a2e39` is **1.30:1** and `#3d4353` is **1.37:1**. The generator's own default
pair is **1.32:1** and **1.41:1**. Roughly half of what is required, in every direction,
at every setting.

To clear 3:1 against `#e6e7ee` the boundary has to be at or below `#848484`
(**3.03:1**) — `#858585` is the first grey that fails, at **2.99:1**. A grey that dark
against that surface is not a shadow, it is a border.

**And then forced-colors deletes the shadow entirely.** In Windows High Contrast Mode
the user agent forces `box-shadow: none`. Since 100% of this style's structure is
`box-shadow`, 100% of it disappears: every control becomes an unbordered rectangle of
`Canvas` on `Canvas`. That includes any focus ring built from `box-shadow`, which is
why the focus indicator in this style is an `outline` and nothing else.

So this skill **refuses to ship a same-hue-only boundary**, in every mode, at every
intensity, for every request, including an explicit one. What it ships instead is the
2026 vocabulary the doc names: **clean neumorphism** — a real `--nm-hairline` border at
**3.20:1** light and **3.31:1** dark, a real accent carrying state, and the extrusion
kept as decoration on top. §2 records that this is the only version that ships, and
§11's own survey finds the surviving artefacts are generators and component
collections rather than shipped products. That asymmetry is the finding.

Say this to the user in plain words when they ask for the borderless version. Do not
bury it in a report section. The sentence to use:

> The shadow pair is between 1.2:1 and 1.7:1 against its own surface, so it cannot be
> the boundary of a control — and in Windows High Contrast Mode it is deleted outright,
> which takes the whole interface with it. I am shipping the clean-neumorphism variant:
> the same extrusion, plus a 3.20:1 hairline and an accent that carries state. Here is
> what that changes.

---

## The twelve

**1. A shadow-only affordance.** Any interactive element whose sole boundary is the
neumorphic pair. Non-negotiable, in every mode, and the reason entry 0 exists.
*Offer:* the same element with `border: 1px solid var(--nm-hairline)` — 3.20:1 light,
3.31:1 dark — and the accent on the active state.

**2. `box-shadow`-based focus rings.** Invisible against an extrusion, because the
element already has a shadow at rest and a shadow-shaped ring adds no state delta — and
deleted entirely in forced-colors mode, which leaves the control with no visible focus
at all. This is the single most common neumorphic accessibility bug after entry 1.
*Offer:* `outline: 3px solid var(--nm-accent); outline-offset: 3px`, plus an
`outline-color: Highlight` override inside `@media (forced-colors: active)`. The accent
is 4.54:1 light and 5.45:1 dark, both clear of the 3:1 floor for a focus indicator.

**3. Output with no `forced-colors` block.** Refuse to write the files at all. Every
other style degrades in that mode; this one vanishes.
*Offer:* the §5 block — `box-shadow: none`, `background: Canvas`, `border: 2px solid
ButtonText` on every generated class, `Highlight` / `HighlightText` for selected,
`GrayText` for disabled, `outline: 3px solid Highlight` for focus.

**4. A neumorphic surface whose background differs from its parent's.** That is not
neumorphism, it is a card with a soft drop shadow wearing a costume (§10).
*Offer:* fix the parent so the two match to within ΔL ≤ 0.02 OKLCH, or downgrade the
element to a plain soft-shadow card — and say which of the two you did.

**5. Neumorphic body text, links, table rows or data cells.** These need contrast, not
depth. §9: content-dense surfaces lose 30–50% of their information density to this
style's padding and shadow gaps.
*Offer:* flat rows with a hairline rule, and the neumorphic treatment reserved for the
controls around them.

**6. Error, warning or destructive state carried by shadow direction.** Inset-versus-
outset is not a semantic. It fails SC 1.4.1 and SC 1.4.11 simultaneously, and it is
invisible to assistive technology.
*Offer:* colour **and** icon **and** text — `border-color: var(--nm-danger)`,
`aria-invalid="true"`, and a visible message. Never tint the surface: that breaks the
same-hue rule.

**7. Neumorphism on `<a>` elements inside running prose.** Violates SC 1.4.1 and
link-in-text-block at once, and turns a link into something that looks pressable but
does not read as a link.
*Offer:* keep the underline and the link colour; extrude the surrounding control, not
the words.

**8. Mixed light sources within one document.** The four permutations are top-left
(default, gradient angle 145°), top-right, bottom-right and bottom-left, and every
extruded element on the page must agree. Mixed diagonals are the most common amateur
tell.
*Offer:* normalise every element to the single `lightSource` input and report each
override in the audit's Corrections table.

**9. `spread > 0`, or `blur / distance` outside `[1.5, 3.0]`.** Spread grows the
shadow's own silhouette away from the element and breaks the same-hue illusion at any
non-zero value. Below 1.5× the pair reads as a hard drop shadow; above 3× it is fog,
and above 4× it is fog that costs 2.8× the paint area for no visual gain.
*Offer:* clamp to `blur = 2 × distance`, `spread = 0`, and say what was clamped.

**10. Removing state changes under `prefers-reduced-motion`.** Only durations may be
zeroed. A reduced-motion user who loses press feedback has lost information, not
decoration.
*Offer:* `transition-duration: 1ms`, `transform: none`, and the pressed shadow plus the
accent border still applying — instantly.

**11. Whole-page neumorphism on a route containing a `<table>`, a virtualised list, or
more than 24 interactive elements.** §8 fails above 24 neumorphic elements and warns
above 12; §9 rules the style out for admin consoles, analytics dashboards, CRMs, email
clients and IDEs.
*Offer:* `scope: controls`, which is where the doc's own default sits, or the
`contentDensity: dense` context cap, which resolves the route to the intensity-0 rung —
a hairline-bounded, accent-carrying, fully accessible control set with no extrusion.

**12. Pale ink chosen "to match the shadows".** Any text token below 4.5:1. The whole
palette drifts pale in this style because the designer is matching the ink to a
low-contrast field.
*Offer:* re-solve the token. `#33364d` is 9.59:1 and `#5a5e77` is 5.16:1; both were
solved for their targets rather than picked by eye.

---

## Three more the doc argues for just as firmly

Not on §13's numbered list, and refused for the same reasons.

**A `<div>` or `<span>` made to look pressable.** Neumorphism adds no semantics, which
is precisely the risk: it makes a `<div>` look exactly as clickable as a `<button>`, so
teams stop using real elements. Forced-colors also picks its system colours from native
element semantics rather than ARIA roles.
*Offer:* a real `<button>`, `<input>` or `<a>`. If a `<div>` is genuinely unavoidable,
it needs `role`, `tabindex="0"` and key handlers for **both** Enter and Space.

**An icon-only control with no accessible name.** The most common pattern in this style
and the one with no visual affordance at all once the shadow is discounted. The React
recipe in §5 warns in development for exactly this reason; keep the warning.
*Offer:* `aria-label`, or a visible label.

**A target under 44px because the shadows were colliding.** §4 sets `--nm-target-min` to
44px deliberately, above SC 2.5.8's 24px floor, because the boundary is 1.2–1.7:1 and
cannot be aimed at precisely, and because the blurred halo reads as part of the control
but is not clickable, which biases pointing outward.
*Offer:* widen the sibling gap to `2 × distance + blur / 2` — 16px at `sm`, 24px at
`md`. Never shrink the target.

---

## Adjacent-style handoffs

Not refusals — redirections. When the request is really for a neighbour, say so. All
ten style plugins exist, so every row here names one.

| Request | Actually |
|---|---|
| Translucent panels, frosted chrome, `backdrop-filter` | `glassmorphism-ui`. §12 calls it this style's best partner: neumorphic base plane, glass overlay, unambiguous z-order — and a glass panel has a real background differential and a real border, so it passes 1.4.11 easily. The clash to avoid is glass *inside* a neumorphic well. |
| Puffy pastel surfaces, big radii, two-tone inner shadow, saturated fills | `claymorphism-ui`. §12: clay on a neumorphic surface works; the reverse makes the neumorphic element disappear. |
| Textures, bevels, photographic materials, real-world metaphors | `skeuomorphism-ui` — the direct ancestor. Neumorphism is literally "new skeuomorphism" with the textures thrown away. |
| Refraction, specular rims, iOS 26 / 27 chrome | `liquid-glass-ui`. §12 is blunt that it is **not** a contrast win — doc 08 rates it high a11y risk too — but for Apple-native targets it is the platform-consistent answer and neumorphism is off-platform. |
| Hard ink borders, zero-blur offset shadows | `brutalism-ui`. §12: the one working combination is a neumorphic canvas with a single brutalist CTA, because the contrast collision makes it unmissable, which is precisely what neumorphism cannot do. |
| Strip it back, flat information layer, one accent | `minimalism-ui` — §12 calls it this style's default host, and the 2026 shipping configuration is minimalism carrying the density with neumorphism on a bounded control cluster. |
| Three loud layers, high chroma, collage | `maximalism-ui`. §12: total clash with no rescue. At a 1.5:1 differential the neumorphic controls simply disappear. |
| Asymmetric tile spans, feature grids | `bento-grid-ui` — §12 calls it structurally excellent for this style. Keep the gap ≥ 24px so halos do not merge, and vary tile *size* rather than tile *elevation*. |
| A real z-ladder, parallax, one perspective stage | `spatial-ui`. §12: use spatial depth for layering and neumorphism for affordance, never both for the same distinction. |
| "Make it look good", "polish this", "less AI-generated", animation craft, a general a11y sweep | None of the ten. Hand it to the general design, de-slopping, animation or accessibility tool the user already has — `accesslint`, `impeccable`, `frontend-design`, `ui-ux-pro-max`. This skill answers a named visual language, not a quality judgement. |
