# Anti-patterns this skill refuses to generate

Source of truth: `docs/07-brutalism.md` §13, "Anti-patterns the skill must refuse to
generate", with the reasoning from §7 and §10.

Follow the refusal protocol owned by `ui-morphism-core`: **refuse, explain in one
sentence why, offer the compliant alternative, and record the refusal in the audit
report's Refusals section** with the request, the reason and the alternative offered.
Do not silently emit a compliant variant and say nothing — the user asked for a thing
and is entitled to know it was changed.

A refusal is about generation. If the user has already shipped one of these, the
`audit` skill reports it as a finding; it does not refuse to look at it.

## The thirteen

**1. A `box-shadow` with non-zero blur or spread presented as a neubrutalist shadow.**
Blur and spread are exactly `0`. Spread `1px` is permitted only on the `xl` and `2xl`
rungs, matching the reference library. A soft shadow makes it generic flat design
instantly, and it is the single most diagnostic property in the style.
*Offer:* the nearest hard rung by the conversion rule in `tokens.md` §7.

**2. `outline: none` on a focusable element without an equivalent replacement outline
in the same rule set.** SC 2.4.7. There is no version of this that is acceptable.
*Offer:* `outline: var(--nb-focus-w) solid var(--nb-focus-color); outline-offset: var(--nb-focus-offset)`.

**3. A `box-shadow`-based focus indicator.** The hard shadow is present at rest, so a
shadow-shaped focus ring provides no state delta and is indistinguishable from the
resting state — and forced-colors deletes it entirely. This is the most common
neubrutalist accessibility bug.
*Offer:* a real `outline`, ≥ 3px, offset 2px, additive to the resting shadow.

**4. Accent-coloured text on a light ground, or white text on any accent fill.**
`#FFDC58` on `#FFFFFF` is 1.34:1. `#FFFFFF` on `#FF6B9D` is 2.68:1. Accents are
backgrounds with `#0A0A0A` text; that is the whole palette rule.
*Offer:* the accent as a fill with `--nb-on-accent` text.

**5. Black borders in a dark theme.** `#000000` against a `#2E2E38`-class surface is
1.56:1 and fails SC 1.4.11. The most-copied reference library ships exactly this.
*Offer:* `--nb-border: #F5F0E6` in dark mode — 11.82:1.

**6. `backdrop-filter`, `filter: blur()`, or any blur, in any generated rule.** The
absence of blur is as diagnostic as the presence of the hard shadow. If the request
genuinely wants blur, it is a different style — hand it to `glassmorphism-ui`, or to
Liquid Glass (`docs/08-liquid-glass.md`, no plugin yet), and say so.
*Offer:* an opaque fill, or the documented "opaque brutalist shell containing one
glass modal as a deliberate register shift" from §12.

**7. `<div role="button">` or `<span role="button">` in place of a real `<button>`.**
Forced-colors picks system colours from *native element semantics*, not ARIA roles, so
a `div role="button"` never gets `ButtonText`. It is also Copeland's principle 3:
buttons should look like and be buttons.
*Offer:* a real `<button>`, or an `<a>` where it navigates.

**8. Rotation on any element that contains a focusable descendant.** Tilt breaks
hit-testing intuition and focus-order legibility, and SC 2.5.8 is measured on the
axis-aligned bounding box *after* the transform. Tilt is for decorative badges and
stickers only, within ±3°.
*Offer:* rotate a decorative sibling, or tilt the badge and not the card.

**9. Infinite marquees or tickers without a pause control.** SC 2.2.2 the moment it
runs longer than five seconds.
*Offer:* a visible pause/play control, plus `animation: none` under
`prefers-reduced-motion`.

**10. `will-change: transform` on a repeated list-item class.** 200 promoted layers
costs tens of megabytes of GPU memory on mobile.
*Offer:* `.nb-grid:hover .nb-card { will-change: transform }` — promote only while
interaction is possible, then release.

**11. More than three accent fills in a single generated view.** NN/g's cap. Past
three, hierarchy collapses and the design reads as a template rather than a decision.
*Offer:* two or three accents with roles assigned (primary action, highlight,
destructive) and the rest emitted as opt-in tokens.

**12. `opacity`-only disabled states.** `opacity: 0.5` on `#0A0A0A` over the `#FEF6E4`
cream composites to `#848077` — 3.66:1 against that same cream, failing 1.4.3 for text
that still looks enabled.
*Offer:* `background: var(--nb-surface-sunk); color: var(--nb-ink-muted)`, shadow
removed, `cursor: not-allowed`, plus a real `disabled` or `aria-disabled`.

**13. Blanket removal of link underlines.** Contradicts SC 1.4.1 and Copeland's
principle 3 at once.
*Offer:* keep underlines; use weight, colour and the hard shadow for emphasis instead.

## Two more the doc argues for elsewhere

These are not on §13's numbered list but the doc rules them out just as firmly, and
they are worth refusing for the same reason.

**A control whose only boundary is the shadow.** Every element that relies on the hard
shadow for its boundary must also have a real `border` (§7 rule 1, §10 row 1). Forced
colors deletes the shadow; the border survives as geometry. There is no borderless
variant of this style.

**Neubrutalist styling applied whole-app to a dense enterprise surface.** §9: 2px
borders on every cell plus offset shadows produce unreadable visual noise past a few
dozen elements. Narrow the scope, or apply `scope: product` (which caps intensity at
45 and forces the quiet dialect), or restrict the treatment to empty states.

## Adjacent-style handoffs

Not refusals — redirections. When the request is really for a neighbour, say so. Name a
plugin only where one exists; for the rest, name the visual language and its doc, and say
plainly that a plugin is planned but not yet built. Sending a user to install something
that does not exist is worse than telling them nothing.

| Request | Actually |
|---|---|
| Soft blurred shadows, same-hue extrusion, "pressed-in" | neumorphism — `docs/02-neumorphism.md`; no plugin yet |
| Puffy pastel surfaces, radii ≥ 24px, inset sheen | claymorphism — `docs/04-claymorphism.md`; no plugin yet |
| Translucent panels, frosted chrome, `backdrop-filter` | `glassmorphism-ui` |
| Refraction, specular rims, iOS 26/27 chrome | Liquid Glass — `docs/08-liquid-glass.md`; no plugin yet |
| Three loud layers, four typefaces, collage, blend modes | maximalism — `docs/06-maximalism.md`; no plugin yet |
| Strip it down to one accent and no ornament | minimalism — `docs/05-minimalism.md`; no plugin yet, and §12 calls minimalism this style's own low-intensity fallback, so `intensity: 0` here lands in the same place |
| Asymmetric tile spans, feature grids | `bento-grid-ui` — and §12 calls brutalism + bento the best combination in the set |
