# Anti-patterns this skill refuses to generate

Source of truth: `docs/05-minimalism.md` §13, "Anti-patterns the skill must refuse to
generate", with the reasoning from §7 and §10.

Follow the refusal protocol owned by `ui-morphism-core`: **refuse, explain in one
sentence why, offer the compliant alternative, and record the refusal in the audit
report's Refusals section** with the request, the reason and the alternative offered.
Do not silently emit a compliant variant and say nothing — the user asked for a thing
and is entitled to know it was changed.

A refusal is about generation. If the user has already shipped one of these, the `audit`
skill reports it as a finding; it does not refuse to look at it.

One thing distinguishes this list from every other style's. **Most of these are refusals
to delete, not refusals to add.** This skill's job is subtraction, and the failure mode
of subtraction is an invisible control, not an ugly one. Where another style's refusal
list stops it from emitting too much, half of this one stops it from removing too much.

## The twelve

**1. Body text below 4.5:1, or large text below 3:1, on any surface it can render
against.** The signature failure of the style. `#999999` is 2.85:1 and `#AAAAAA` is
2.32:1; anything in the `#888`–`#AAA` band that a designer calls "secondary text" is a
defect. `#737373` is 4.74:1 and is the lightest legal body grey on white.
*Offer:* substitute the nearest passing value — `--min-text-muted` for muted copy,
`--min-text-secondary` for secondary copy — and log the substitution. Never ship a
failing pair to satisfy an intensity number.

**2. A ghost or outline-only button as the primary action on any screen.** Doc §10 ships
solid, filled primary buttons; NN/g advises against ghost buttons as the primary CTA and
reported click rates run materially lower. NN/g's flat-design guidance also documents
"click uncertainty" — users mousing over elements to find out whether they are clickable.
*Offer:* `background: var(--min-accent); color: var(--min-accent-fg); border-color:
var(--min-accent)`. A ghost variant survives as `--quiet`, tertiary only, with a hover
underline.

**3. `outline: none` on any focusable element without a replacement indicator in the same
rule.** SC 2.4.7. There is no version of this that is acceptable.
*Offer:* `outline: var(--min-focus-ring-width) solid var(--min-focus-ring);
outline-offset: var(--min-focus-ring-offset)`, on `:focus-visible` rather than `:focus`.

**4. A control boundary that is the control's only affordance and does not reach 3:1.**
`#E5E5E5` on white is 1.26:1. That is fine for a decorative separator between two rows and
is a 1.4.11 failure the moment it is the edge of an input, a secondary button, an
unchecked checkbox, a toggle track or a slider rail. The boundary colour on white is
`#949494` at 3.03:1 — `#959595` is already 2.995:1, and WCAG does not round up to meet a
threshold.
*Offer:* `--min-border-strong` (`#8F8F8F`, 3.23:1), which clears the bar with margin.

**5. Interactive targets smaller than `--min-target-min` (24×24 CSS px), or icon-only
buttons without an `aria-label`.** Icon-only ghost buttons at 16px, close "×" glyphs and
dense table row actions are the usual offenders, and SC 2.5.8 lands squarely on them.
*Offer:* take the floor from `var(--min-target-min)` and the resting size from
`var(--min-control-lg)` (40px), never a literal; 44×44 on any touch-primary surface. The
alternative to sizing up is the spacing exception — a smaller target passes if a 24px
circle centred on it does not intersect the circle of any adjacent target. Add
`aria-label` on the control and `aria-hidden="true"` on the glyph.

**6. Colour as the sole carrier of state, error, selection or category.** SC 1.4.1.
Minimal palettes push teams to encode meaning in the single accent hue: selected tab =
blue text, error = red text.
*Offer:* a second channel every time — underline, icon, weight change, inline-start bar,
or a text label. Selected rows get `--min-accent-subtle` **plus** `inset 2px 0 0
var(--min-accent)`.

**7. Placeholder text used as the only field label.** SC 3.3.2. The placeholder
disappears on focus, is often below contrast, and is not an accessible name.
*Offer:* a visible `<label>`, with the placeholder kept only as an example of the format.

**8. Removal of a visible label, help text, error message, required-field marker or
`<legend>` in the name of cleanliness.** This is the refusal that defines the style. §1:
"Stripping signifiers off a control does not make the control simpler; it makes it
invisible." The skill may restyle any of these; it may never delete them.
*Offer:* restyle — `--min-text-sm` at `--min-text-secondary` for the label,
`--min-text-xs` at `--min-text-muted` for help text — and keep every node in the DOM.

**9. More than two chromatic hues in the generated palette.** One accent and one danger
semantic, plus at most eleven neutral steps. §10: a third and fourth hue "for variety" is
where minimal systems die.
*Offer:* collapse to `--min-accent` and `--min-danger`, and carry every other distinction
on the neutral ramp, on weight, or on space.

**10. `backdrop-filter` on a base-layer surface.** The token layer declares
`--min-backdrop-blur: 0px` as an explicit contract, and declaring the zero is what
separates this style from glassmorphism. Blur also destroys the performance advantage
that is one of minimalism's main reasons to exist, and it breaks the contrast guarantees
the moment content scrolls under a translucent surface.
*Offer:* an opaque `--min-surface-*` fill. If the request genuinely wants blur it is a
different style — hand it to `glassmorphism-ui` and say so. §12's documented hybrid is a
flat, opaque base layer with blur on floating overlays only; that is glassmorphism's
skill to run, not this one's.

**11. Infinite looping animation that does not represent an in-progress operation, and
any animation that survives `prefers-reduced-motion: reduce`.** Skeleton shimmer on a
loaded surface and ambient background motion are the usual offenders.
*Offer:* a determinate indicator, or a finite iteration count; and a reduced-motion block
that keeps the state visible while stopping the loop. Reduce, do not delete.

**12. Fixed `px` heights on text-bearing containers, and `overflow: hidden` on label
text.** Both break under the SC 1.4.12 text-spacing overrides — line-height 1.5×,
paragraph spacing 2×, letter-spacing 0.12em, word-spacing 0.16em.
*Offer:* `min-height` rather than `height`; let text wrap, or clamp visibly while keeping
the full value reachable.

## Two more the doc argues for elsewhere

Not on §13's numbered list, but §7 and §8 rule them out just as firmly.

**Icon fonts, and replacing text labels with unlabelled icons to save space.** §8: an
icon font blocks text render and breaks in forced-colors. And an unlabelled icon is the
"visual minimalism mistaken for informational minimalism" failure in its purest form.
*Offer:* an inline SVG sprite under 8 KB, and a visible label beside the glyph.

**A `px` `max-width` on a prose container, or `px` font sizes for body copy.** §7: a
`max-width` set in `px` will not grow with text size and will clip at 200% zoom
(SC 1.4.4).
*Offer:* `var(--min-measure)` — 65ch — and `rem` type throughout.

## The whole-app hazard

Minimalism applied whole-app to a **novice, occasional or low-confidence** audience is
not an anti-pattern the skill refuses outright — it is a context cap. Doc §9: consumer
government services, healthcare intake for older adults and first-run onboarding "need
maximum signifiers, not maximum restraint", and NN/g's flat-design guidance limits
low-signifier design to simple sites, returning users and tech-expert audiences. The same
applies to safety-critical and irreversible surfaces, where delete, transfer and deploy
actions need loud, unambiguous, over-signified controls.

`assets/intensity.contract.json` caps both contexts at intensity 0 **and** clamps
`affordanceFloor` to 100 in the same breath. Say the cap out loud in the report rather
than applying it silently — and note that the cap alone would move the inverted knob the
wrong way, which is why the pair exists.

## Adjacent-style handoffs

Not refusals — redirections. When the request is really for a neighbour, say so. Name a
plugin only where one exists.

| Request | Actually |
|---|---|
| Translucent panels, frosted chrome, `backdrop-filter` | `glassmorphism-ui` |
| Refraction, specular rims, iOS 26/27 chrome | `liquid-glass-ui` |
| Soft same-hue extrusion, "pressed-in" surfaces | `neumorphism-ui` |
| Puffy pastel surfaces, radii ≥ 24px, inset sheen | `claymorphism-ui` |
| Simulated material, texture, rendered physical objects | `skeuomorphism-ui` |
| Three loud layers, four typefaces, collage, blend modes | `maximalism-ui` |
| Hard ink borders and zero-blur offset shadows | `brutalism-ui` — and §12 calls "Swiss brutalism" the most defensible way to make a minimal system distinctive |
| Asymmetric tile spans, feature grids | `bento-grid-ui` — §12 calls this the natural escape hatch a monochrome system needs for marketing pages |
| Depth ladders, parallax, z-axis composition | `spatial-ui` |
| "Make it look good", "polish this", "clean this up", a general accessibility sweep | Not this plugin. A design-quality, de-slopping, animation or a11y tool answers those better. |
