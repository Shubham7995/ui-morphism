# Glossary

Every technical term used across the ten style documents, alphabetical. Each entry gives a definition and the docs that rely on the term. Doc numbers refer to the filenames in [README.md](./README.md): 01 skeuomorphism · 02 neumorphism · 03 glassmorphism · 04 claymorphism · 05 minimalism · 06 maximalism · 07 brutalism · 08 liquid-glass · 09 bento-grid · 10 spatial-ui.

---

## A

**Acrylic** — Microsoft's formally specified translucent brush in Fluent Design (2017), published as a five-layer stack: background → blur → exclusion blend → colour/tint overlay → noise. It is the most rigorous vendor specification of a glass material that exists, and the exclusion-blend layer exists specifically to guarantee contrast of UI drawn on top. *Docs: 03, 08.*

**Affordance** — the property of a control that communicates how it can be used. Popularised for design by Don Norman in *The Design of Everyday Things* (1988), which both defends skeuomorphism's rationale and warns against slavish imitation. The recurring failure across this doc set is deleting a signifier and assuming the affordance survives. *Docs: 01, 02, 05, 07.*

**Ambient shadow** — the wide, soft, low-opacity shadow that describes an object's general separation from the page, as distinct from the tight contact shadow directly beneath it. In skeuomorphism it is layer two of four (`0 4px 10px rgba(0,0,0,.18)`); in spatial UI it is the second half of every depth-proportional shadow pair. *Docs: 01, 08, 10.*

**Angular size** — how large something appears from the viewer's position, measured as an angle rather than in pixels or metres. Spatial UI's defining commitment is *distance-independent sizing*: an element is placed at a depth and then counter-scaled so its angular size stays constant, leaving parallax and shadow as the only depth cues. *Doc: 10.*

**Anti-grid placement** — deliberately positioning elements against a grid that still exists underneath: rotations of −4° to +5°, negative margins pulling cards into each other, `grid-area` overlaps that make two children share a cell. The discipline is that you break a grid you can see. *Doc: 06.*

**Aqua** — Apple's Mac OS X interface (2000–2001): pinstripes, gel buttons with pulsing specular highlights, window drop shadows. The first time an OS shipped a *rendered material* rather than a drawn icon, and the reference point critics reach for when skeuomorphism and Liquid Glass are combined badly. *Docs: 01, 03, 08.*

**Aurora / mesh gradient** — a large, soft-focus, multi-hue background produced by overlapping radial or conic colour fields. Named across the set as the required or best partner for any translucent style, because it supplies a vivid ground you *control*, which is what keeps the contrast maths valid. Keep the luminance band inside roughly 25 L\* points. *Docs: 03, 04, 06, 07, 08, 09, 10.*

## B

**`backdrop-filter`** — the CSS property that applies a filter to whatever is painted behind an element rather than to the element itself. Baseline *newly available* since 2024-09-16 (when Safari 18 unprefixed it), projected to reach *widely available* on 2027-03-16, so an `@supports` fallback is still formally required. Firefox has supported it unprefixed since Firefox 103 (2022-07-26), which makes the ubiquitous "doesn't work in Firefox" caveat four years stale. *Docs: 03, 04, 08, 09, 10.*

**Backdrop root** — the nearest ancestor that establishes what a `backdrop-filter` element can sample. Any ancestor with `opacity < 1`, `filter`, `mask`, `clip-path`, `mix-blend-mode` or `will-change` silently becomes one and breaks the effect. Scanning ancestors for accidental backdrop roots is a required step in the glassmorphism skill. *Doc: 03.*

**Backdrop snapshot** — the per-frame capture of the content behind a `backdrop-filter` element that the compositor must take before blurring it. This is why per-tile glass is expensive: a 3×3 grid of glass tiles is nine snapshots per frame, whereas one glass container with opaque dividers is one. *Docs: 03, 08, 09.*

**Baseline (Web Platform)** — the cross-browser support status labels used by MDN and the Web Platform Dashboard: *newly available* when a feature has shipped in all core browsers, *widely available* 30 months later. Relevant here for `backdrop-filter` (newly available, widely available projected 2027-03-16), `prefers-reduced-transparency` (still not Baseline, unsupported in Safari) and `reading-flow` (Chrome 137 only, not Baseline). *Docs: 01, 03, 06, 09, 10.*

**Bevel** — a simulated chamfered edge, produced with an inset light shadow on the lit edge and an inset dark shadow opposite. Skeuomorphism uses `inset 0 1px 0 rgba(255,255,255,.80)` on top and `inset 0 -2px 3px rgba(0,0,0,.12)` on the bottom. Neumorphism kept the bevel and threw away the material metaphor around it. *Docs: 01, 02, 08.*

**Blend mode** — a compositing operator (`multiply`, `screen`, `difference`, `exclusion`) that determines how overlapping layers combine. Maximalism uses blend modes to produce genuine layer *interference* rather than stacked opaque rectangles; Microsoft's Acrylic recipe uses an exclusion layer to protect contrast. Requires an `isolation: isolate` container. *Docs: 03, 06.*

## C

**Calm interface / quiet UI** — the 2026 label for minimalism's current revival. Narrower than earlier minimalism: it is a reaction specifically against AI interface theatrics (animated assistant orbs, streaming shimmer, progress narration) rather than against decoration in general. *Doc: 05.*

**Calm mode** — a persistent in-app toggle (`data-calm` on `<html>`, stored in `localStorage`) that stops all ambient motion and drops texture layers. Required whenever a style emits infinite animation, because WCAG 2.2.2 Pause, Stop, Hide is Level A and cannot be satisfied by an OS media query alone. *Doc: 06.*

**Cascade layer (`@layer`)** — a CSS mechanism for grouping rules into explicitly ordered layers, so a whole treatment can be overridden or deleted without specificity fights. Every style skill in this set emits its output inside a named layer (`@layer brutalism`, `@layer skeuo-a11y`, and so on) so the style can be removed in one deletion. *Docs: all.*

**Chroma** — the colourfulness axis in OKLCH, roughly analogous to saturation but perceptually uniform. Used as a hard budget: minimalism caps non-accent chroma at ≤ 0.02, neumorphism stays below 0.03 because the ±15% luminance shift on a saturated channel shifts hue rather than lightness, claymorphism references 0.09 for pastels, maximalism runs 0.18–0.30. *Docs: 01, 02, 04, 05, 06, 07.*

**Chromatic fringing** — a subtle per-channel offset (±0.5–1.5px between red and blue displacement) at a lens rim, mimicking optical dispersion. Present in Apple's Liquid Glass, absent in nearly every web clone, and its absence is the main "tell". *Doc: 08.*

**Clear (Liquid Glass variant)** — the permanently more transparent of Apple's two Liquid Glass variants, requiring a dimming scrim beneath it and restricted by Apple to three simultaneously-met conditions: media-rich content behind, a content layer that tolerates dimming, and bold or bright content on top. Contrast with *Regular*, the adaptive default. Also the name of one option in the iOS 26.1 user toggle. *Docs: 01, 03, 08.*

**Comfort cone** — the central region of the field of view where primary content belongs. Android XR specifies 41°; at a 500mm laptop viewing distance that computes to `2 × 500 × tan(20.5°) ≈ 374mm ≈ 1413 CSS px`, which is a derived max content width rather than a round number. *Doc: 10.*

**Composited layer** — a surface the GPU rasterises and stores independently so it can be transformed without repainting. Cheap to move, expensive in memory. Spatial UI caps concurrent composited layers at 25 and GPU layer memory at 96 MiB. *Docs: 03, 08, 10.*

**Concentric radius** — nesting rule where an inner element's corner radius equals the outer radius minus the padding between them, so the arcs stay parallel. Stated explicitly by Apple; it matters most in spatial UI, where nested panels are seen off-axis and mismatched arcs are obvious. *Docs: 04, 08, 09, 10.*

**Contact shadow** — the tight, dark, short-offset shadow immediately beneath an object that describes where it touches the surface. Layer one of skeuomorphism's four (`0 1px 2px rgba(0,0,0,.25)`), and the first half of every spatial depth-proportional pair. Its absence is what makes an object look pasted on. *Docs: 01, 08, 10.*

**Container query** — a CSS query that styles an element based on its own container's size rather than the viewport's. Interoperable across Chrome, Safari and Firefox, and what lets a bento tile restyle its interior by its own width regardless of span. *Doc: 09.*

**Continuous curvature** — corner geometry where the curvature changes smoothly rather than jumping from straight to circular arc. Apple's corners are continuous; CSS `border-radius` produces circular arcs. See also *squircle*. *Docs: 08, 10.*

**Corner smoothing** — Figma's control for how superelliptical a corner is, 0–100%. Claymorphism workflows run 60–100% because real clay does not have a circular arc at the corner. *Docs: 04, 08.*

**Counter-scale** — multiplying an element by `(perspective − z) / perspective` after pushing it to `translateZ(z)`, so its apparent size is unchanged and only parallax and shadow read as depth. At `perspective: 1200px` and `translateZ(56px)` the factor is `1144 / 1200 = 0.9533`. *Doc: 10.*

## D

**Data-ink ratio** — Edward Tufte's 1983 principle that the proportion of ink devoted to data should be maximised and non-data ink erased. Minimalism reframed as an information-theoretic objective, and still the cleanest justification for the style in dashboards. *Doc: 05.*

**Dense grid flow** — `grid-auto-flow: dense`, which lets the browser backfill gaps by pulling later items into earlier holes. It produces tighter bento packing and decouples visual order from DOM order, which breaks SC 1.3.2 Meaningful Sequence and SC 2.4.3 Focus Order the moment a tile contains a focusable element. *Doc: 09.*

**Design token** — a named, reusable value (colour, radius, duration) that decouples a design decision from its usages. This set standardises on `--um-<style>-<group>-<variant>`; see [00-comparison-matrix.md §7](./00-comparison-matrix.md). **DTCG** is the Design Tokens Community Group's interchange format, used for Figma and Style Dictionary round-tripping. *Docs: all; DTCG specifically 02.*

**Displacement map** — an SVG filter primitive (`feDisplacementMap`) that offsets each pixel of one input by the channel values of another, producing refraction rather than blur. Liquid Glass's defining mechanism, at `scale` 30–70 for a 56px-tall control. Only Chromium supports SVG filters as a `backdrop-filter` value, so this does not work cross-browser as of August 2026. *Doc: 08.*

**Dopamine design** — the 2023-onward framing of saturated, high-energy visual design as an explicitly *emotional* argument, positioned against the anxiety and neutrality of minimalist environments. Borrowed from "dopamine dressing" and "dopamine décor". *Doc: 06.*

**dp / dmm** — density-independent pixel (Android) and the millimetre-scale unit Android XR converts it to for world-space placement, at a published ratio of **0.868 dp-to-dmm**. Google publishes numbers where Apple publishes principles. *Doc: 10.*

**Dragging Movements (SC 2.5.7)** — WCAG 2.2 Level AA criterion requiring that any function operated by dragging also be operable by a single pointer without dragging. Identified as the criterion spatial UI breaks most reliably and that almost nobody discusses: every `movable()` or `resizable()` panel needs a non-drag alternative. *Doc: 10.*

**Dynamic Scale** — Apple's visionOS term for keeping a window's apparent size constant as its distance changes. Android XR implements the same behaviour with published numbers: constant apparent size between 0.75m and 1.75m, then scaling at 0.5m per m beyond. *Doc: 10.*

## E

**Edge lensing** — the visible warping and compression of the backdrop in a band roughly 8–24px wide at an element's border, with displacement peaking at the edge and decaying to zero by about 40% inward. Liquid Glass's non-negotiable move; without it you have glassmorphism with a marketing name. *Doc: 08.*

**Elevation** — the abstraction of depth as a discrete ladder of levels. Material expresses it as shadow steps in dp; minimalism allows at most two; brutalism replaces it with a hard offset; spatial UI replaces it with a real z-axis at 0.1 / 16 / 24 / 32 / 40 / 56 dp. In the shared token grammar, `elev` is the semantic level and `shadow` is its visual rendering. *Docs: 01, 02, 05, 07, 10.*

**Emboss / letterpress** — type treated as if pressed into or raised out of a surface, faked with `text-shadow: 0 1px 0 rgba(255,255,255,.7)` on light grounds and `0 -1px 0 rgba(0,0,0,.5)` on dark ones. Costs nothing and sells the material instantly. Text cannot take inset shadows, so raised type is always two opposing offsets. *Docs: 01, 04.*

**Exclusion blend** — the blend-mode layer in Microsoft's published Acrylic recipe whose specific job is to guarantee contrast for UI drawn on top of the translucent surface. Absent from essentially every web glassmorphism tutorial. *Doc: 03.*

## F

**`feTurbulence`** — the SVG filter primitive that generates Perlin-style noise, used across the set to produce grain. Typical parameters: `type="fractalNoise"`, `baseFrequency` 0.8–0.9, `numOctaves` 2–4, tiled at 160px — the three docs deliberately differ (01 uses 0.9 / 2, 03 uses 0.8 / 4, 06 uses 0.8 / 3). Preferred over a raster texture because it costs bytes rather than a network request. *Docs: 01, 03, 06.*

**Focus Appearance (SC 2.4.13)** — WCAG 2.2 Level AAA criterion specifying the minimum area and contrast of a focus indicator. Named as one of the three new criteria that maximalism and spatial UI break by accident. *Docs: 06, 10.*

**Focus Not Obscured (SC 2.4.11)** — WCAG 2.2 Level AA criterion requiring that a focused element not be entirely hidden by author-created content. It lands directly on minimalism's thin sticky headers and on maximalism's and spatial UI's floating ornament. The usual fix is `scroll-margin-top` on focusable elements under sticky chrome. *Docs: 05, 06, 09, 10.*

**Forced colors** — the accessibility mode (Windows High Contrast Mode and equivalents) that replaces the author's palette with a user-chosen system palette, detectable via `@media (forced-colors: active)`. The user agent forces `box-shadow`, `text-shadow` and `background-image` to `none` — but **not** `url()`-based background images, so an SVG data-URI grain layer survives and needs an explicit `display: none`. Because it deletes `box-shadow`, it deletes 100% of neumorphism's and claymorphism's visual structure, and any box-shadow-based focus ring with it. *Docs: all.*

**Fractal noise** — see *`feTurbulence`* and *grain*.

## G

**Gaze target** — a hit target sized for eye tracking rather than a finger or cursor. visionOS specifies a 60pt minimum because eye tracking is imprecise; Android XR recommends 56 × 56 dp with a 48dp visual icon inside it. Compare 44pt on iOS and the 24 × 24 CSS px WCAG floor — spatial targets are 1.4–2.5× larger. *Doc: 10.*

**`GlassEffectContainer`** — the SwiftUI construct that groups sibling glass views so they can merge and morph. Its real reason for existing is architectural rather than performance-related: Apple's renderer cannot sample glass with glass, so siblings must share one container to blend. *Docs: 08, 10.*

**Grain** — a fine noise overlay, typically an `feTurbulence` layer at 2–8% opacity, used to kill gradient banding and add the microtexture real materials have. Skeuomorphism declares 0.05 light / 0.07 dark against a stated 0.04–0.06 light band that its own checklist widens to 0.08 on dark surfaces; glassmorphism declares 0.035 light / 0.028 dark inside a 0.02–0.05 band; maximalism declares 0.08 light / 0.05 dark inside a 0.04–0.12 range. Above roughly 0.10 it stops reading as grain and starts reading as dirt or compression artefacts. *Docs: 01, 03, 06.*

## H

**Hairline border** — a 1px (or 0.5px at ≥ 2dppx) boundary at low alpha, used to define an edge without adding elevation. Critical distinction in this set: a *decorative* hairline (`rgba(0,0,0,0.06)` on `#f5f5f7` = 1.14:1; `#E5E5E5` on white = 1.26:1) is legal as ornament and illegal as a control's only boundary, which is why every style needs a second `border-strong` token clearing 3:1. *Docs: 01, 02, 03, 05, 09.*

**Halftone** — a dot-pattern print texture, used in maximalism both as a patterned ground and as a photographic cut-out treatment. *Doc: 06.*

**Hard offset shadow** — `box-shadow: <x> <y> 0 0 <ink>` with blur and spread both exactly zero, producing a solid duplicate of the element's box pushed down-right. Neubrutalism's defining move at a canonical `4px 4px`; maximalism stacks three in different colours. Because paint cost scales with the square of the blur radius and the blur is zero, it is roughly as cheap as a background fill. *Docs: 06, 07.*

**Hue-matched shadow** — a drop shadow tinted with the surface's own hue rather than neutral black, e.g. `hsl(258 60% 45% / .30)` under a lavender surface. Claymorphism's modern correction to the `rgba(0,0,0,.25)` default that propagated from the 2022 reference implementation. *Doc: 04.*

## I

**Icon Composer** — Apple's app-icon tool shipped with Xcode 26 (June 2025). Icons are built from a required background layer plus up to four stacked layers, each with its own specularity, translucency, blur and shadow, exported as a `.icon` file on a 1024px grid (1088px circular for Watch). *Doc: 01.*

**Inset shadow** — `box-shadow` with the `inset` keyword, painting inside the element's border box. Produces bevels, wells and the inflated dome of claymorphism. Note that CSS shadows paint in declaration order with the first on top. *Docs: 01, 02, 04.*

**Intensity knob** — a named parameter in a style's plugin spec that a single 0–100 intensity value maps onto. Each style defines three to five. Contract: monotone across the range, intensity 0 yields a usable accessible baseline rather than nothing, intensity 100 still passes the a11y floor, and hard clamps are independent of intensity. *Docs: §13 of all ten; consolidated in [MARKETPLACE.md](./MARKETPLACE.md) §7.2.*

**Interaction to Next Paint (INP)** — the Core Web Vital measuring responsiveness to user input. Cited as a 2026 design-phase constraint rather than an engineering cleanup, which is what makes maximalism's motion load a design decision. *Doc: 06.*

## L

**Leading** — line height. Compressed to 0.86–0.94 for maximalist display type; held at 1.5 for minimalist body copy, which is also WCAG 1.4.12's floor. *Docs: 05, 06.*

**Lensing** — see *edge lensing*.

**Light source (global)** — the single agreed direction from which every highlight and shade in an interface is drawn. Skeuomorphism, neumorphism, claymorphism and spatial UI all encode one; mixed directions are the number-one tell of an amateur implementation, and the reason two depth styles cannot be combined unless they agree. Recessed containers inverting the stack is the one permitted exception. *Docs: 01, 02, 04, 10.*

**Live Tile** — the variable-span tiles (small/medium/wide/large) on a fixed gutter that Microsoft shipped in Windows Phone 7 and Windows 8 (2010–2012). Structurally the bento grid's most under-credited ancestor, and also its cautionary example: tiles with no content hierarchy become wallpaper. *Doc: 09.*

**Loud layer** — a visually assertive plane (patterned ground, grain overlay, floating ornament) in maximalism's layer-stacking model. Hard-capped at three per viewport regardless of intensity, and the budget is shared across styles rather than per-style. *Doc: 06.*

**Luminance delta** — the difference in relative luminance between two colours, used here as a design parameter rather than a contrast ratio. Neumorphism's shadow pair is the surface shifted symmetrically by ±0.075 (light) or up to ±0.20 (dark); bento's `surfaceDelta` is 0–24 luminance points between page and tile. *Docs: 02, 09.*

## M

**Marquee** — an infinitely scrolling horizontal band of text or images, at 12–30s per cycle in maximalism. Because it is infinite it requires a pause mechanism under WCAG 2.2.2 (Level A), independent of `prefers-reduced-motion`. *Docs: 06, 07.*

**Material 3 Expressive** — Google's May 2025 evolution of Material Design, presented as the outcome of roughly three years, 46 studies and 18,000+ participants, arguing that more expressive interfaces let users identify key UI elements substantially faster. It adds heavy background blur for hierarchy while deliberately rejecting glass-as-material framing, and Google publicly confirmed on 2026-05-06 that Android 17 would continue with it rather than adopt Liquid Glass. *Docs: 03, 05, 07, 08.*

**Meaningful Sequence (SC 1.3.2)** — WCAG Level A criterion requiring that reading order be programmatically determinable. Broken by rotated, absolutely-positioned collage layouts and by dense grid packing — named as neubrutalism's most under-reported failure, ahead of contrast. *Docs: 06, 07, 09.*

**Measure** — line length, expressed in characters per line. Bringhurst's range is 45–75 CPL, with ~66 as the long-form target and ~55 for dense UI copy; implemented as `max-width: 65ch`. *Doc: 05.*

**Metro** — Microsoft's "authentically digital" design language (Windows Phone 7, 2010-10-21; Windows 8, 2012): no bevels, no gradients, no drop shadows, typography as the primary material, content over chrome. The first mass-market flat OS, and NN/g's standing cautionary example of minimalism practised as ideology. *Docs: 01, 03, 05, 06.*

**Mica** — Windows 11's opaque, wallpaper-tinted, cheap material, shipped alongside Acrylic in October 2021. The split is itself the design lesson: glass for transient UI, opaque material for persistent chrome, because acrylic was too costly to run everywhere. *Doc: 03.*

**`mix-blend-mode`** — see *blend mode*.

**Modular scale** — a type scale generated by repeated multiplication by a fixed ratio. Minimalism uses 1.125–1.250 (a nine-step 1.200 scale gives 12/14/16/18/20/24/30/36/48px); maximalism deliberately breaks it with a 7–12× ratio between display and caption where minimalism would use 2–3×. *Docs: 05, 06.*

**MSDF text** — multi-channel signed distance field text rendering, used by Meta's Immersive Web SDK UIKit to keep type crisp at arbitrary 3D scales. *Doc: 10.*

## N

**Neo-grotesque** — the sans-serif classification covering Helvetica, Inter, Geist Sans, SF Pro and Söhne. Minimalism's default voice; neubrutalism uses heavier grotesques and geometrics (Archivo Black, Space Grotesk, Lexend Mega) at weight 700–900. *Docs: 05, 07.*

**Non-text contrast (SC 1.4.11)** — WCAG Level AA criterion requiring 3:1 for user-interface components and graphical objects needed to understand content. The single most-cited criterion in this doc set. W3C states values are not rounded, so 2.999:1 fails. Neumorphism's failure against it is structural: no combination of blur, distance and same-hue luminance delta reaches 3:1, with measured pairs landing at 1.23–1.59:1. *Docs: all.*

**Noise overlay** — see *grain*.

## O

**OKLCH** — a perceptually uniform colour space with lightness, chroma and hue axes, and the CSS function `oklch()`. Used throughout for palette derivation because changing chroma at fixed L does not move contrast, which is what makes a saturation knob safe. Tailwind v4's gradient interpolation also uses it. *Docs: 02, 04, 05, 06, 07.*

**Orbiter** — Android XR's term for a control that detaches from its panel and floats beside it, at 20dp clear of the panel edge, 15–16dp of z-elevation, never overlapping the panel by more than 50% of its own size. Apple's equivalent is the *ornament*. *Doc: 10.*

**Ornament** — two distinct meanings. In visionOS, a control attached outside a window's bounds, overlapping its bottom edge by 20pt (Apple's term for what Android XR calls an orbiter). In maximalism, the third plane of floating decoration — stickers, arrows, blobs, cut-outs — overlapping the content plane by 8–24px. *Docs: 06, 10.*

## P

**Parallax** — differential movement of layers against each other on pointer, scroll or head motion, used as the confirmation that depth is real. Amplitude must be small: 8–16px of translation and 2–6° of tilt across the full input range. Beyond that the illusion breaks into nausea. The listener must be *detached* under `prefers-reduced-motion`, not merely zeroed. *Doc: 10.*

**Passthrough** — the live camera feed of the user's real environment shown behind UI on a mixed-reality headset. It is the functional justification for glass in visionOS — you must be able to see your room through the interface — rather than a decorative one. *Docs: 03, 10.*

**`perspective` / `perspective-origin`** — the CSS properties that establish a 3D viewing frustum on a stage element. Spatial UI uses 1200px for a punchy read and 2400–4000px for a restrained one, with the origin around `50% 42%` to mimic Android XR's 5° downward panel tilt. A `perspective` or `transform` ancestor becomes the containing block for `position: fixed` descendants, which is why fixed chrome must live outside the stage. *Doc: 10.*

**`prefers-color-scheme`** — the media query exposing the OS light/dark preference. This set's required emission shape is light values on bare `:root`, with dark values duplicated under both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]`, so an explicit user choice wins in either direction. *Docs: all.*

**`prefers-contrast`** — the media query exposing a user request for more or less contrast (`more`, `less`, `custom`). Used to raise border and ink tokens in the texture-heavy styles. *Docs: 01, 03, 08.*

**`prefers-reduced-motion`** — the media query exposing the OS reduce-motion preference. Required by every style in the set. The rule that matters: it may zero durations and remove travel, but it must **not** remove any state-carrying property — a pressed button must still look pressed. *Docs: all.*

**`prefers-reduced-transparency`** — the media query exposing the OS reduce-transparency preference. Shipped in Chrome/Edge 118 (October 2023), still behind a flag in Firefox, and **still unsupported in Safari** as of 2026 due to WebKit fingerprinting concerns — which is exactly the platform whose users most commonly enable Reduce Transparency. It therefore cannot be the only path to a legible UI; an in-app toggle is required. *Docs: 01, 03, 06, 08, 10.*

**Press travel** — the downward displacement of a control on `:active`, typically `translateY(1px)`, accompanied by the outer shadows collapsing and the insets deepening. Skeuomorphism fixes it at 1px (`--sk-press-travel`, same in light and dark) and claymorphism pairs the same 1px translate with `scale(0.97)`; below `shadowDepth` 0.25 skeuomorphism suppresses it entirely to avoid a jitter with no visual support. *Docs: 01, 04.*

**Progressive enhancement tier ladder** — the three-tier `@supports` structure used by Liquid Glass: Tier 2 (SVG refraction, Chromium only), Tier 1 (blur + saturate + rim), Tier 0 (opaque fill ≥ 0.94). Gated by feature detection, never by user-agent sniffing. *Doc: 08.*

## R

**`reading-flow` / `reading-order`** — CSS properties that decouple focus and reading order from DOM order for grid and flex containers, letting a visually reordered layout expose the intended sequence. Shipped in Chrome 137 (stable 2025-05-27) with `grid-rows` / `grid-columns` / `grid-order` values; no Safari or Firefox support as of August 2026, so it is not yet a fix you can rely on. *Doc: 09.*

**Recessed well** — see *well*.

**Reduce Transparency** — the OS-level accessibility setting (Apple shipped it alongside iOS 7 in September 2013, conceding the material's legibility cost on day one) that the `prefers-reduced-transparency` media query exposes. *Docs: 03, 08.*

**Reflow (SC 1.4.10)** — WCAG Level AA criterion requiring content to be usable at 320 CSS px width without two-dimensional scrolling. Checked by every style skill; it is the reason fixed-width hardware panels and absolutely-positioned ornament are refused below the 640px breakpoint. *Docs: 06, 09, 10.*

**Refraction** — bending light through a medium, simulated with a displacement map. The property that separates Liquid Glass from glassmorphism: glass blurs what is behind it, a lens *moves* it. *Doc: 08.*

**Regular (Liquid Glass variant)** — the adaptive default variant: works over any content, at any size, with anything layered on top, and needs no dimming layer. Contrast with *Clear*. *Doc: 08.*

**Rim light** — a thin bright line along a lit edge, `inset 0 1px 1px hsl(0 0% 100% / .35)` in claymorphism, or a 1–2px specular arc at roughly 135° in Liquid Glass. Cheap and disproportionately convincing. *Docs: 04, 08.*

## S

**Same-hue surface** — neumorphism's non-negotiable rule that an element's background is identical to its parent's (within ΔL ≈ 0.02 in OKLCH). If the card is a different colour from the page it is not neumorphism, it is a card with a soft shadow — and that difference is precisely what claymorphism reintroduced to fix the contrast failure. *Doc: 02.*

**`saturate()`** — the filter function used to restore chroma that Gaussian blur averages toward grey. 140–180% for glassmorphism, 160–190% for Liquid Glass, 165% for spatial panels. Below about 130% the material reads grey and dead. This is the web analogue of *vibrancy*. *Docs: 03, 08, 10.*

**Scrim** — an opaque or semi-opaque layer inserted between a variable backdrop and foreground text to guarantee contrast. Load-bearing maths: to guarantee white body text at 4.5:1 against a worst-case white backdrop, a dark scrim needs alpha ≥ 0.558, which means a "real" glass panel at 10–14% fill alpha can never safely carry body text without one. Bento requires `rgba(0,0,0,0.55)` minimum behind text over photography. *Docs: 03, 08, 09.*

**Shadow stack** — an ordered set of `box-shadow` layers composing one effect. Skeuomorphism's is four (contact, ambient, bevel, lip); claymorphism's is three (light inset, dark inset, hue-matched drop) plus an optional rim; neumorphism's is exactly two, mirrored. Layers paint in declaration order with the first on top. *Docs: 01, 02, 04.*

**Skeuomorph** — from Greek *skeuos* (vessel, tool) and *morphē* (shape): an ornament retained from an older manufacturing process, such as imitation rivets on cast metal or faux wood grain on plastic. *Doc: 01.*

**`SpatialElevation`** — Android XR's six-step depth ladder in dp: 0.1 / 16 / 24 / 32 / 40 / 56. Mapped 1:1 to px in this set's flat-screen dialect, with orbiters at 16, popovers at 32 and dialogs at 56, and nothing landing between steps. *Doc: 10.*

**Specular highlight** — the bright reflection where a light source hits a curved surface. Skeuomorphism places an elliptical hotspot at 25–35% from the top on knobs and pill switches at 0.35–0.55 opacity; Liquid Glass runs a live 1–2px rim arc that tracks device tilt on iOS and pointer position on the web. Apple's iOS 27 refinement *brightened* these — a legibility fix that added material rather than removing it. *Docs: 01, 08, 10.*

**Spread (box-shadow)** — the fourth length in a `box-shadow`, expanding or contracting the shadow's shape before blurring. Neumorphism requires it to be exactly 0; neubrutalism permits `1px` only on its `xl` and `2xl` steps, matching the reference library. *Docs: 02, 07.*

**Squircle** — a superellipse-derived shape between a square and a circle. Claymorphism uses it via Figma corner smoothing; Liquid Glass's lens profile is closer to a convex squircle, `y = ⁴√(1 − (1−x)⁴)`, than a spherical dome — derived from Snell-Descartes in kube.io's analysis rather than from any Apple documentation. *Docs: 04, 08.*

**Squish** — claymorphism's press deformation: `transform: scale(0.97)` plus a 1px translate and halved shadow offsets, over 90ms press and 260ms spring release. Capped at `scale(0.93)` because further shrink makes a 24px target miss its own hit area. *Doc: 04.*

**Sticker composition** — elements pinned onto the ground rather than flowing in a grid: die-cut shapes with 2–4px white keylines, slight rotation (±1° to ±3°, beyond 5° it reads as a scrapbook), tape strips, torn-paper edges. Rotation on anything containing a focusable descendant is refused. *Docs: 06, 07.*

**Subgrid** — the CSS Grid value that lets a nested grid adopt its parent's tracks, so tile interiors can align across a row. Interoperable across Chrome, Safari and Firefox. *Doc: 09.*

**Subsurface scattering** — the rendering behaviour where light penetrates a translucent material and diffuses inside it, giving clay its characteristic soft matte look. Relevant to the Blender/Spline-rendered illustration half of claymorphism, which in 2026 is healthier than the CSS-surface half. *Doc: 04.*

**Superellipse** — the mathematical family `|x/a|ⁿ + |y/b|ⁿ = 1` underlying squircle geometry. *Docs: 04, 08.*

**`@supports`** — the CSS feature query. Required around every `backdrop-filter` declaration with an opaque fallback outside the block, because `backdrop-filter` is not yet Baseline widely available. Also the correct gate for the Liquid Glass tier ladder, in place of user-agent sniffing. *Docs: 03, 08, 10.*

**Surface delta** — the luminance difference between the page background and a card or tile background. Bento runs it deliberately low (page `#ffffff` / tile `#f5f5f7`), letting the gap rather than the surface do the separating; the intensity knob exposes 0–24 luminance points. *Doc: 09.*

## T

**Target Size (SC 2.5.8)** — WCAG 2.2 Level AA criterion setting a 24 × 24 CSS px minimum for pointer targets. The floor across every style in this set; most set 44px, spatial UI 60px under `(pointer: coarse)`. It lands hardest on minimalism's icon-only ghost controls and on maximalism's rotated sticker buttons, whose axis-aligned bounding box must be re-measured after the rotation. *Docs: all.*

**`@theme`** — Tailwind v4's block for declaring design tokens that compile to real CSS custom properties and generate utilities. Must never be nested inside a media query or other at-rule; theme switching happens on ordinary selectors outside it. This set maps token groups to v4 namespaces mechanically (`color`→`--color-*`, `radius`→`--radius-*`, `shadow`→`--shadow-*`, `space`→`--spacing-*`, `ease`→`--ease-*`). *Docs: all.*

**Tinted** — the higher-opacity Liquid Glass option Apple added in iOS 26.1 / macOS Tahoe 26.1 on 2025-11-03, seven weeks after release, later replaced in iOS 27 by a continuous transparency slider. Notable as a case of the vendor with the largest investment in a material shipping a turn-it-down switch. *Docs: 01, 03, 08.*

**Tracking** — letter spacing. Pulled to −0.03em/−0.05em for maximalist display type, −0.02em for neubrutalist headings, and applied as optical correction only in minimalism (−0.011em above 24px, −0.02em above 36px). *Docs: 05, 06, 07.*

**Travel** — see *press travel*.

## V

**Variable span** — a bento tile occupying more than one grid cell (`grid-column: span 6; grid-row: span 2`). Bento's actual defining property is variable spans on an invariant gap: uniform spans give a card grid, varying gaps give a collage. Neither SwiftUI `Grid` nor Compose `LazyVerticalGrid` supports *row* spanning, so true 2D bento on native needs nested stacks or a custom layout. *Doc: 09.*

**Vibrancy** — Apple's term for the colour and contrast boost applied to content drawn on a translucent material so it remains legible against a blurred backdrop. visionOS exposes three tiers (primary / secondary / tertiary) for foreground content. The web analogue is `saturate()` in the backdrop filter chain. *Docs: 03, 10.*

## W

**WCAG 2.2** — the current W3C Recommendation, published 2024-12-12. Its nine new criteria land unusually hard on this doc set: 2.4.11 Focus Not Obscured (AA), 2.4.12 (AAA), 2.4.13 Focus Appearance (AAA), 2.5.7 Dragging Movements (AA), 2.5.8 Target Size Minimum (AA), 3.2.6 Consistent Help (A), 3.3.7 Redundant Entry (A), 3.3.8/3.3.9 Accessible Authentication. *Docs: all.*

**Well** — a container drawn as a recess rather than a raised object, produced by inverting the shadow stack so the highlight sits at the bottom and the shade at the top. The only permitted exception to the global-light rule, and what makes an input read as a hole rather than a bump. *Docs: 01, 02, 04.*

**`will-change`** — the CSS hint that promotes an element to its own composited layer ahead of an animation. Overused as a performance "fix"; the style skills refuse permanent `will-change` on non-animating elements, cap it at one hovered-subtree selector, and never allow it on a repeated list-item class. Note that it also silently creates a *backdrop root*. *Docs: 03, 07, 08, 10.*

---

## Also referenced

**`contain: paint`** — containment hint that confines an element's painting to its own box, used to bound the cost of a glass surface. *Doc: 08.*

**Halftone / duotone photography** — high-contrast photographic treatments that let images coexist with flat saturated fills without breaking the style. *Docs: 06, 07.*

**Three.js / WebGL / Babylon.js** — the 3D renderers behind 2026's award-circuit work. Award-circuit maximalism this year skews heavily to real-time 3D and scroll-driven cinematics, while flat collage maximalism has migrated to brand and marketing pages rather than the award shortlist. No renderer-share percentages are quoted here: the breakdown this entry used to carry came from a source that publishes no methodology and whose quarterly sample size is inconsistent with Awwwards awarding one Site of the Day per day. Re-derive from the Awwwards archive if you need a figure, and define the sample. *Docs: 06, 10.*

**`@react-three/uikit` / Immersive Web SDK UIKit** — the open-source spatial component runtimes: pmndrs' `@react-three/uikit` (v1.0.73, 2026-05-16) and Meta's Three.js + Yoga flexbox UIKit (docs updated 2026-03-11). *Doc: 10.*

**WebXR Device API** — the W3C Immersive Web WG specification for headset access from the browser. Worth knowing what it is *not*: WebXR is not among Interop 2026's nineteen focus areas or four investigation areas, despite widely circulated 2026 claims to the contrary. *Doc: 10.*
