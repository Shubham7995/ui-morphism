# Liquid Glass anti-patterns — the refusal list

Source of truth: `docs/08-liquid-glass.md` §13 "Anti-patterns the skill must refuse to
generate", cross-checked against §7 (accessibility), §8 (performance), §9 (when not to) and
§10 (do & don't).

The refusal *mechanism* belongs to `ui-morphism-core` — refuse, explain, offer an
alternative, record it in the audit's Refusals section. This file is the list and the
alternatives. Every entry gives the detection signal so the refusal is triggered by evidence
rather than by vibe, and names the `lg-scan.mjs` rule where there is one.

---

### 1. Glass on `<body>`, `<main>`, a scroll container, a `<table>`, or a chart or canvas wrapper

**Why.** Apple's own guidance is that only floating chrome is glass and content stays
opaque; §10 says it twice. Three separate things go wrong at once. Legibility: body copy and
data need a deterministic background, and here the background is whatever scrolled behind
it. Performance: a full-screen 1170×2532 glass sheet is one texture of **11.3 MiB**, more
than nine times the cost of three 88px toolbars, which is why a full-bleed glass background
is the one shape to refuse outright. And correctness: chart legibility over a warped,
blurred, colour-shifted backdrop is indefensible, which §9 lists as a "do not use" context
rather than a tuning problem.

A scroll container is its own case. §8: never apply glass to a scroll container's own
children, because a translating backdrop invalidates the snapshot every frame.

**Detect.** A rule declaring a live `backdrop-filter` whose selector names `body`, `main`,
`table`, `article`, `section`, `canvas`, `pre` or `figure`, or whose class hints at a chart,
grid, article, editor or content region, or which also declares `overflow: auto | scroll`.
`scripts/lg-scan.mjs` rules `glass-on-content` and `glass-on-scroller`.

**Offer instead.** Glass as the **frame**: a glass toolbar and sidebar over opaque content
cards. If the request is really "make the page feel like this", the answer is a controlled
gradient or a slow, low-frequency mesh ground *behind* opaque content, with one glass chrome
layer above it — which is Apple's own architecture, and which also keeps the contrast maths
valid because you control the luminance band. For a bento layout, render the grid container
as one glass surface with opaque internal dividers rather than nine glass tiles.

---

### 2. Nested glass surfaces of any depth

**Why.** This is the style's one hard fail, and it is architectural rather than aesthetic.
**Glass cannot sample glass.** The inner element's backdrop snapshot includes the outer
element's already-filtered output, so stacking is multiplicative rather than additive: two
stacked panels look worse *and* run slower than one. Apple's own renderer forbids it, which
is exactly why `GlassEffectContainer` exists — a shared sampling region for sibling glass,
because overlapping glass in separate containers renders incorrectly.

There is no intensity at which this becomes acceptable and no budget it can be traded
against. §13 item 11 says "hard fail" and means it.

**Detect.** A selector in which two combinator-separated compounds both name a glass class;
a glass-classed element rendered inside another in markup; a glass component whose children
include a glass component. `scripts/lg-scan.mjs` rule `nested-glass`, which checks both the
selector side and the markup side because neither sees the other's case.

**Offer instead.** One container, opaque children. Group the related surfaces into a single
glass element and give the inner cards a solid fill — which is also what makes the
composited contrast computable, since the inner card's background is then a colour you know.
On SwiftUI, one `GlassEffectContainer` with `glassEffectID`s on the members, and
`.glassEffectUnion` where they should read as one blob.

---

### 3. Fill alpha below 0.55, or below 0.62 when the backdrop is user-supplied

**Why.** Below roughly 0.55 no single foreground colour passes 4.5:1 across every backdrop,
so the surface is not merely risky — there is no ink you can pair with it that works. §7
solves the crossings: pure black text survives every backdrop from α ≈ 0.4553 and the
`#1C1C1E` ink this doc specifies from α ≈ 0.5145, both landing on the threshold exactly at a
black backdrop with no margin for a brand tint, a lighter ink or the rim. **0.55 is the
shipped floor; 0.62 is the safe default.**

The consequence of ignoring it is documented rather than hypothetical. At the α = 0.40 iOS
26 actually shipped, over a dark photo, white text reaches **3.80:1** and `#1C1C1E` reaches
**4.48:1** — neither foreground colour is safe. That is the failure users reported in
September 2025 and the reason Apple raised the floor in iOS 27, shipped a Tinted toggle in
26.1 and an opacity slider in 27.

**Detect.** A resolved `fillAlpha` below the floor, a hand-written `rgba()` fill below it on
a glass selector, or `backdropControl: arbitrary` with a fill under 0.62. The intensity
contract clamps it; a literal in a component file does not go through the contract.

**Offer instead.** Raise the fill to the floor and say what changed. If the design needs the
transparency, the order of escalation is: clamp the backdrop's luminance band; add the scrim
beneath; raise the fill; drop to Tier 1; drop to Tier 0. Recompute with
`ui-morphism-core:a11y-validate` after each step. Never ship a failing pair to satisfy an
intensity number.

---

### 4. Clear-variant glass with no dimming scrim beneath it

**Why.** Clear is permanently more transparent than the Regular floor — `0.28` light,
`0.26` dark — and Apple mandates a dimming layer under it. The scrim is what pins the
backdrop's maximum luminance, which is the only reason a contrast claim about a Clear
surface can be made at all. Apple additionally restricts Clear to three conditions holding
**simultaneously**: a media-rich backdrop, a content layer that tolerates dimming, and bold,
bright content on top. Two out of three is not a Clear surface.

**Detect.** A surface consuming `--lg-fill-clear` (or the Tailwind mirror's
`--color-glass-fill-clear`) with no `--lg-scrim` layer anywhere in the emitted files.
`scripts/lg-scan.mjs` rule `clear-without-scrim`.

**Offer instead.** Emit the scrim, or emit Regular. Regular is the adaptive default: it
works over any content, at any size, with anything layered on top, and needs no dimming
layer. A Clear surface with no scrim is a refusal, not a clamp — there is no reduced
version of it that is safe.

---

### 5. A `backdrop-filter` chain with no `@supports` fallback

**Why.** Two different failures wear this one coat. A browser with no `backdrop-filter` at
all renders the translucent fill unconditionally, which is unreadable text on a see-through
box — that is Tier 0's job. And a browser with `backdrop-filter` but no `url()` support —
Safari and Firefox, which is roughly half the web — **drops the entire declaration** when it
contains an SVG filter reference, so an ungated Tier 2 costs those users the blur as well as
the lens. That is why the refraction sits inside
`@supports (backdrop-filter: url(#lg-refract))` and the blur-only tier sits outside it.

The `-webkit-` twin belongs here too: Safari is the platform this material comes from, and
its older versions read only the prefixed form.

**Detect.** A `url()` in a `backdrop-filter` value outside a `@supports` test naming
`backdrop-filter: url(`; a project with glass surfaces and no
`@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`
block; a `backdrop-filter` with no `-webkit-backdrop-filter` beside it.
`scripts/lg-scan.mjs` rules `supports-tier2`, `supports-tier0` and `webkit-prefix`.

**Offer instead.** The three-tier ladder in `recipes.md` §1, emitted in the order 0, 1, 2.
Note that both spellings must be nulled in every block that nulls one; §5's own fallback
nulls only the unprefixed form.

---

### 6. Any transition or keyframe animating `backdrop-filter`, `filter` or `border-radius`

**Why.** Nearly every geometry change forces a full rebuild of the displacement map, and the
map is expensive to build — kube.io's derivation runs 127 ray simulations per radius.
Animating the blur radius re-runs the filter chain over a fresh source every frame on top of
that. §6 names the four cheap things — `transform`, `opacity`, `background-color` and
`feDisplacementMap`'s `scale` — and nothing else is on the list.

`transition: all` is the same anti-pattern written carelessly: it silently includes
`backdrop-filter` and `border-radius`.

**Detect.** `transition`, `transition-property`, `animation` or `animation-name` naming any
of the three, or naming `all`; a `@keyframes` step setting any of them; an SVG `<animate>`
whose `attributeName` is anything but `scale`. `scripts/lg-scan.mjs` rule `animated-optics`.

**Offer instead.** Animate `background-color` alpha for hover, `transform: scale()` for
press, `opacity` for enter and exit, and `feDisplacementMap@scale` for a lens that breathes.
The `glass-settle` overshoot in `motion.md` is the entrance; it uses only `transform` and
`opacity`. And do not animate anything on scroll: a translating backdrop invalidates the
snapshot every frame regardless of what is being interpolated.

---

### 7. Focus indicators relying on the glass border, a background-colour change, or an opacity change alone

**Why.** The glass border is `rgba(255,255,255,0.45)` and almost never reaches 3:1 against
an arbitrary backdrop — it fails 1.4.11 as a *boundary*, so it certainly cannot carry
2.4.11 as an *indicator*. A background-colour change on a translucent surface is a change to
one term of a composite whose other term is unknown. A white ring over glass over a bright
photo disappears. And `forced-colors: active` deletes `box-shadow`, so a shadow-only ring
vanishes in the mode that needs it most.

**Detect.** `outline: none` or `outline: 0` with no `outline` re-declared in the same rule
set; a `:focus-visible` rule whose only declarations are `background-color`, `opacity` or
`border-color`; a focus ring drawn purely as a `box-shadow`. This check belongs to
`ui-morphism-core:a11y-validate`.

**Offer instead.** The triple ring from `recipes.md` §5: a 3px accent `outline` at 2px
offset, plus `box-shadow: 0 0 0 5px rgba(0,0,0,0.55), 0 0 0 8px rgba(255,255,255,0.9)`.
Three concentric rings guarantee at least one edge with ≥ 3:1 against any backdrop. Under
`forced-colors: active`, `3px solid Highlight` and no shadow — the outline is the ring that
carries the criterion. And set `scroll-margin-top` to the sticky bar's height on every
focusable, because a focused element half-hidden under translucent chrome fails 2.4.11 too.

---

### 8. White text over a Clear surface with no scrim

**Why.** This is entry 3 and entry 4 in their worst combination, and it is worth its own
line because it is the single most reproduced screenshot of the iOS 26 backlash. At the
default fill over a mid-grey photo, `#1C1C1E` ink measures **10.89:1** and white on the same
surface measures **1.56:1**. Under Clear the fill is thinner still. Foreground polarity is
not a free choice on this material: the ink is paired with the fill.

**Detect.** A light foreground on a surface consuming `--lg-fill-clear`, or any white
foreground on a fill below the floor with no scrim between it and the backdrop.

**Offer instead.** Add the scrim — `rgba(0,0,0,0.22)` light, `rgba(0,0,0,0.34)` dark — which
pins the backdrop's maximum luminance and is exactly what makes white text viable; that is
why Apple mandates it under Clear. Or switch polarity to the dark ink and the Regular fill.
Whichever is chosen, recompute at both backdrop extremes before shipping it.

---

### 9. Displacement maps loaded from an external URL inside `feImage`

**Why.** `feImage` with an external `href` costs a network fetch **plus a decode inside the
filter graph**, which is a stall in the middle of a compositing pass rather than an ordinary
image load. §8 says inline it as a base64 data URI, and puts the budget at 8KB per map — a
300×56 8-bit map is roughly 2-6KB, so the budget is comfortable rather than tight.

**Detect.** `<feImage href="…">` where the value is not a `data:` URI.
`scripts/lg-scan.mjs` rule `fe-image-external`.

**Offer instead.** `node scripts/displacement-map.mjs --size=300x56@28 --json`, which
generates the map, inlines it, and fails the run if it breaks the budget. One map per
distinct component size, cached — and never regenerated on resize, hover or scroll, since
that is the rebuild the whole approach exists to avoid.

---

### 10. User-agent sniffing to branch tiers instead of `@supports` / `CSS.supports`

**Why.** The tier boundary is a feature boundary, and the feature test names the feature
itself, so it cannot pass in an engine that would then render nothing. A UA string cannot
say that: it is wrong on the day a browser ships the feature, wrong on the day one removes
it, wrong inside every embedded webview that spoofs, and wrong the moment the W3C SVG WG's
interoperable-refraction work lands and a second engine gains support. That thread —
issue #1142 — is the single thing that would move the Chromium-only ceiling, and a UA branch
is precisely what would fail to notice.

**Detect.** `navigator.userAgent`, `navigator.userAgentData` or `navigator.vendor` read in a
file that also names the glass tier, refraction or `backdrop-filter`.
`scripts/lg-scan.mjs` rule `ua-sniff`.

**Offer instead.** `CSS.supports("backdrop-filter", "url(#lg-refract)")` at runtime, and
`@supports (backdrop-filter: url(#lg-refract))` in the sheet. Device *capability* gating is
a different question and is legitimate: `navigator.hardwareConcurrency <= 4` or
`navigator.deviceMemory <= 4` drops to Tier 1 or Tier 0, per §8. Capability is not identity.

---

### 11. Removing or overriding a user's `prefers-reduced-transparency` or `prefers-reduced-motion` preference

**Why.** These are settings a user turned on deliberately, usually because the alternative
hurts. Overriding one — with a `!important`, with a "force glass" prop, with a
`[data-glass="always"]` escape hatch — is not a design decision, it is undoing an
accessibility setting from inside the page. Apple shipped a user-facing toggle in iOS 26.1
and a continuous opacity slider in iOS 27 precisely because mandatory transparency failed,
and the American Foundation for the Blind's December 2025 open letter is the reference
point for why.

There is a second-order version of the same mistake: **hard-coding an assumption about how
transparent the chrome will actually be.** An iOS 26.1 user may have selected Tinted; an
iOS 27 user may have moved the slider anywhere.

**Detect.** A rule inside one of the preference queries that re-enables the filter; a prop,
attribute or setting that bypasses the query; `!important` on a glass declaration outside
the accessibility layer.

**Offer instead.** Honour the query, and add the `[data-transparency="reduced"]` hook plus a
real in-app control **on top of it** — Safari does not implement
`prefers-reduced-transparency` as of August 2026, and Apple's own users are the ones most
likely to have Reduce Transparency on, so the media query alone is not coverage. A toggle
that lets a user turn glass *off* is the compliant version of this; one that lets a product
turn it back *on* is not.

---

### 12. Calling a blur-only implementation "Liquid Glass"

**Why.** Liquid Glass is glassmorphism plus displacement, specular tracking and adaptive
tint — a superset, not a rebrand. Ship the blur without the displacement and what you have
built is glassmorphism. That is a perfectly good thing to build, it is interoperable, it is
roughly 40% of the cost, and doc 03 is the better guide to building it. Calling it the other
thing sets an expectation the artefact does not meet and, on a team, quietly redefines the
word so the next person cannot ask for the real one.

**Detect.** Glass surfaces declared, no `url()` refraction anywhere, and class names,
component names or documentation saying liquid glass. `scripts/lg-scan.mjs` rule
`blur-only-named-glass`. The same applies whenever `refractionScale` resolves to 0 —
including at `a11yTarget: AAA`, at `perfTarget: low-end` and at intensity 0, all of which
are legitimate resolutions that simply are not this style.

**Offer instead.** Emit `glassmorphism` class names, say so in the report's Summary, and
point at `glassmorphism-ui` — which owns the blur-only material and its own five-rung
ladder. If the user wants the name, they need the lens, and the lens needs Chromium.

---

## Contexts where the answer is "not this style"

Doc §9. These are not code-level refusals — they are the cases where the correct response is
to say so before emitting anything.

Text-dense products read for long stretches: documentation, email, CRMs, admin panels, code
editors, financial tables, EHRs — cognitive drag from layered translucency is a documented
complaint and reading sessions amplify it. WCAG AA conformance obligations combined with a
backdrop you do not control. Audiences skewing toward low vision, dyslexia, ADHD or older
users. Sunlight and outdoor contexts: field service, delivery, agriculture, construction,
automotive dashboards. Low-end Android or budget hardware as a significant share of traffic.
Products needing cross-browser parity, since refraction is invisible to roughly half the
web. Print, email and PDF output as a first-class deliverable. Data visualisation surfaces
of any kind.

## Style clashes to flag rather than emit

Doc §12. **Neumorphism** clashes hardest: its premise is that the control is the same colour
as its background and extruded by shadow, this material's premise is that the control is a
separate optical object floating above, and combining them stacks two independently
accessibility-hostile systems. **Skeuomorphism** simulates texture where this simulates
optics; mixing them produces the Aqua-era look, though doc 01 §12 makes the narrower case
that glass above bevelled material below is the one combination that works. **Maximalism**
clashes specifically because the adaptive tint *samples* what is underneath, so the same
control changes colour as the page scrolls — clamp the ground under the glass and let the
maximalism run everywhere else. **Brutalism** is the opposite thesis and reads as unfinished
in a product, though the workable split on Apple platforms is brutalism inside your own
content views and platform glass for the chrome.

Three pair well and are worth naming as the recommendation rather than the compromise.
**Minimalism** is the necessary partner: this material only works because the content layer
beneath it is flat and opaque, which is literally Apple's own architecture. **Bento grids**
work when the grid *container* is the one glass surface. **Spatial UI** is the origin story —
visionOS is where this came from — and its rule that depth lives on one shared stage is what
keeps the glass from looking like decals. And an aurora or mesh gradient is the best
backdrop there is, because it lets you control the luminance range and therefore keeps the
contrast maths valid; keep its luminance band within roughly 25 points so the composite
never swings.
