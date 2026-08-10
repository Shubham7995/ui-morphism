# Glassmorphism anti-patterns — the refusal list

Source of truth: `docs/03-glassmorphism.md` §13 "Anti-patterns the skill must refuse to
generate", cross-checked against §7 (accessibility), §8 (performance), §9 (when not to)
and §10 (do & don't).

The refusal *mechanism* belongs to `ui-morphism-core` — refuse, explain, offer an
alternative, record it in the audit's Refusals section. This file is the list and the
alternatives. Every entry gives the detection signal so the refusal is triggered by
evidence rather than by vibe.

---

### 1. Body text directly on a fill below 0.30 alpha with no scrim and no clamped ground

**Why.** This is the style's central failure. The same `rgba(255,255,255,0.12)` panel with
white text measures **14.6:1** over `#0B0B12` and **1.57:1** over `#7DD3FC` — an ordinary
sky-blue in a mesh gradient. Same panel, same text, a 9.3× swing depending on where the
user scrolled. Automated tools do not catch it: axe, Lighthouse and Figma's contrast
plugins compute against the declared `background-color` and cannot see what
`backdrop-filter` sampled.

**Detect.** A text-bearing element whose nearest background is a fill rung at α < 0.30,
with no `--glass-text-scrim` child wrapper and no darkening layer over the ground.

**Offer instead**, in the doc's order of preference:
1. **Clamp the ground.** With a 12% white fill, white body text clears 4.5:1 as long as the
   backdrop stays at or below roughly `#646464` (sRGB 100); the 3:1 large-text/UI ceiling
   is roughly `#868686` (sRGB 134). Enforce with a
   `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55))` darkening layer between ground and
   glass.
2. **Nest a text scrim** at `rgba(9,9,14,0.56)`. Solved, not chosen: guaranteeing white
   text at 4.5:1 against a worst-case pure-white backdrop needs composited luminance
   ≤ 0.183, which for an `rgb(10,10,15)` tint requires α ≥ 0.558 (crossing 0.55734).
3. **Raise the panel fill to 0.56+** and say plainly that it is now a tinted card with a
   blur, not glass. For dense reading surfaces that is the correct trade.

Recompute with `ui-morphism-core:a11y-validate` after whichever fix is applied. Never ship
a failing pair.

---

### 2. Any translucent fill without a matching `@supports` opaque fallback

**Why.** `backdrop-filter` reached Baseline *newly available* on 2024-09-16 and is not
projected to be *widely available* until 2027-03-16. A fallback is formally required, not
politeness. A browser without blur renders the low-alpha background unconditionally, which
is unreadable text on a see-through box.

**Detect.** A rule declaring a fill rung or `backdrop-filter` that is not nested inside
`@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` with an
opaque declaration outside it. `scripts/glass-scan.mjs` rule `supports-fallback`.

**Offer instead.** The two-block pattern from `recipes.md` §1: opaque baseline first,
`@supports` enhancement second.

---

### 3. `backdrop-filter` without the `-webkit-` prefixed twin

**Why.** Safari 18 unprefixed it in September 2024. Safari 15–17 is still a real install
base and only understands `-webkit-backdrop-filter`. "Safari unprefixed it" is not a
reason to drop the prefix.

**Detect.** A declaration block containing `backdrop-filter` with no
`-webkit-backdrop-filter` on the preceding line. `scripts/glass-scan.mjs` rule
`webkit-prefix`.

**Offer instead.** Emit the prefixed line first, unprefixed second, always paired.

---

### 4. Glass on `<table>`, `<input>`, `<textarea>`, `<select>` or long-form article containers

**Why.** Form-field boundaries must satisfy 1.4.11 against an unknowable backdrop, which
cannot be guaranteed. Body copy needs a deterministic background. Data tables are where a
misread digit has a cost. Doc §9 lists all of these as "do not use" contexts.

**Detect.** Target selectors or components matching those elements, or any container
holding running text.

**Offer instead.** Glass as the **frame**, not the content: a glass sidebar and header
over opaque data cards. `GlassInput` emits an opaque field with a boundary solved to 3:1,
sitting inside a glass container.

---

### 5. Four or more stacked or nested translucent layers

**Why.** Each layer is a separate shader pass reading the composite below it — three
stacked panes is three full passes. More than four planes turns into mud (§3), and doc §9
says that if the hierarchy needs that many planes, the hierarchy is the problem.

**Detect.** Nesting depth of glass surfaces > 3 in the emitted tree, or a viewport where
more than three translucent panes overlap.

**Offer instead.** The rule of one (§12): in a single product, glass is the treatment for
exactly one layer of the z-stack. Chrome or overlays, not both, and never content. Flatten
the extra layers to opaque surfaces.

---

### 6. `transition: backdrop-filter` or keyframes interpolating a blur radius on hover or scroll

**Why.** It re-runs the blur shader every frame over a fresh source. This is the single
most expensive thing the style can do.

**Detect.** `transition` or `animation` shorthand or longhand naming `backdrop-filter`,
`filter` or `border-radius` on an interactive or scroll-driven selector.
`scripts/glass-scan.mjs` rule `animated-backdrop`.

**Offer instead.** Animate `background-color` alpha, `transform` and `opacity` on the
content. A one-time blur "wake-up" on mount (`260ms`) is permitted; on hover it is not.

---

### 7. `opacity < 1` on a glass element or any ancestor to express a disabled state

**Why.** It makes the element a backdrop root and silently kills the blur. The result is a
wrong render that costs nothing, which is worse than an expensive correct one.

**Detect.** `opacity` below 1 declared on a glass selector or on a selector that can match
one of its ancestors. `scripts/glass-scan.mjs` rule `backdrop-root`.

**Offer instead.** Put `opacity: 0.5` on the **content**, drop the surface to elevation 0,
remove the border highlight, and carry the disabled state in text and ARIA as well.

---

### 8. A raster noise or grain image asset when the SVG filter will do

**Why.** A noise PNG is 20–200 KB for something an inline `feTurbulence` filter does better
and resolution-independently, at roughly 220 bytes gzipped. The style's asset-weight budget
is **0 KB**.

**Detect.** `url(...)` pointing at `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif` or `.gif` in a
rule that also carries `backdrop-filter`, or in a rule whose selector names grain/noise.
`scripts/glass-scan.mjs` rule `raster-grain`.

**Offer instead.** The shared inline SVG filter from `recipes.md` §1, at
`baseFrequency 0.8` / `numOctaves 4`, rendered once per page.

---

### 9. Removing or nulling `outline` on a focusable glass surface without a compliant replacement

**Why.** A single-colour focus ring cannot work on glass because the ring's surroundings
are unknowable, and `outline: none` plus a background change is invisible on a translucent
surface. `forced-colors: active` also deletes `box-shadow`, so a shadow-only ring vanishes
entirely in the mode that needs it most.

**Detect.** `outline: none` or `outline: 0` with no `outline` re-declared in the same rule.
This check belongs to `ui-morphism-core:a11y-validate`.

**Offer instead.** The two-tone ring: `outline: 2px solid #fff; outline-offset: 2px;` plus
`box-shadow: 0 0 0 5px rgba(0,0,0,0.55)`. Under `forced-colors: active`, `2px solid Highlight`.

---

### 10. Any glass treatment left active inside a `forced-colors: active` block

**Why.** In forced colors the UA overrides colours but **does not override
`backdrop-filter`**. A blur left in place smears the forced-colour backdrop and destroys
the whole point of the mode. Forced colors also strips shadows, so if a shadow was the only
edge affordance there is now none.

**Detect.** A `@media (forced-colors: active)` block that does not set
`backdrop-filter: none`, or its absence entirely. `scripts/glass-scan.mjs` rules
`a11y-blocks` and `forced-colors-blur`.

**Offer instead.** `background-color: Canvas; color: CanvasText; border: 1px solid CanvasText;
box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none;` plus
`display: none` on grain and gradient-hairline pseudo-elements.

---

### 11. Information conveyed only by transparency level, blur amount or shadow depth

**Why.** "Disabled" communicated only by a lower fill alpha is invisible to a screen reader
and near-invisible to a low-vision user. This is one of the nine universal checks.

**Detect.** A state, error, selection or category distinguished between variants only by
fill alpha, blur radius or shadow step.

**Offer instead.** Add a text label, an icon with an accessible name, or an ARIA state, and
keep the visual difference as reinforcement.

---

### 12. Glass over a background the project does not control

**Why.** User uploads, third-party iframes and unstyled embeds mean the contrast argument
collapses — the ground cannot be clamped, so worst-case composited contrast cannot be
computed at all.

**Detect.** A glass surface whose backdrop resolves to user-supplied media, an `<iframe>`,
or a third-party embed.

**Offer instead.** A mandatory opaque scrim between the uncontrolled content and the pane,
at ≥ 0.56 alpha. If the user declines the scrim, emit the opaque mirror and say why.

---

### 13. `will-change: backdrop-filter` sprayed as a performance fix

**Why.** `backdrop-filter` already forces a compositing layer. Adding `will-change` mostly
increases memory, and on an ancestor it silently creates a backdrop root that breaks the
effect. `transform: translateZ(0)` as a blanket fix has the same problem.

**Detect.** `will-change` naming `backdrop-filter`, `filter`, `opacity` or `transform` on a
glass selector or a candidate ancestor. `scripts/glass-scan.mjs` rules `will-change-fix`
and `backdrop-root`.

**Offer instead.** The real levers from §8, in descending fidelity: pre-blur a static
backdrop once; drop the blur and keep the tint; reduce radius and raise alpha
(`blur(10px) + 0.18α` ≈ `blur(24px) + 0.10α` at roughly half the shader cost); gate glass
by viewport and input modality; gate by `navigator.hardwareConcurrency <= 4`,
`navigator.deviceMemory <= 4` or `navigator.connection.saveData`; `content-visibility: auto`
on off-screen glass sections.

---

## Contexts where the answer is "not this style"

Doc §9. These are not code-level refusals — they are the cases where the correct response
is to say so before emitting anything.

Long-form reading. Data tables, spreadsheets, financial figures, dosages, medical records.
Form fields and their validation state. Government, healthcare, banking core flows,
education, insurance claims and utilities — regulated surfaces under Section 508,
EN 301 549 and the EAA, enforceable in the EU since June 2025. Audiences skewing older or
low-vision. Content-heavy pages with user-generated backgrounds. Low-end Android and
emerging-market products. Print, email HTML and PDF export, where `backdrop-filter` does
not exist at all.

## Style clashes to flag rather than emit

Doc §12. Neumorphism (needs an opaque mid-tone monochrome surface; its shadows land on a
moving backdrop and read as dirt, and both styles fail accessibility in the same direction
so the risk compounds rather than averages). Brutalism (opposed intent; there is no
coherent middle, except a brutalist page with one glass overlay used as a clearly-foreign
floating layer). Maximalism (its loud uncontrolled ground is exactly what §7's contrast
argument depends on clamping — if the user wants both, clamp underneath the glass
specifically and let the maximalism run everywhere the glass is not). Claymorphism
(inconsistent material physics — clay is chunky opaque volume, glass is thinness; if you
must, clay for primary CTAs and glass for containers, never the reverse). High-density
systems such as data grids and trading terminals.
