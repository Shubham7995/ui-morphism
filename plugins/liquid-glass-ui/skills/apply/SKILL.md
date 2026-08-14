---
name: apply
description: >-
  Use when the user NAMES the style — Liquid Glass, Apple Liquid Glass, iOS 26/27 glass,
  lensing or refractive glass — or describes its concrete moves: a backdrop that WARPS as well
  as blurs in a rim band, a specular highlight arc that tracks the pointer, floating capsule
  toolbars over artwork, `feDisplacementMap` refraction behind `@supports (backdrop-filter:
  url(#lg-refract))`, or SwiftUI `.glassEffect`. THE TEST against the two translucent-depth
  siblings: here the backdrop is GEOMETRICALLY DISPLACED, not merely blurred. Blur with no
  displacement is glassmorphism-ui; panels at measured translateZ under a perspective camera
  are spatial-ui. Also for upgrading a glassmorphism layer into real refraction, and for the
  SwiftUI, UIKit and React Native paths where the OS renders it. ui-morphism is descriptive
  and plural: one named language, measured tokens, a stated when-not-to-use — not a
  design-quality tool. Do NOT use for open-ended quality work — "make it look good", "make it
  modern", "polish this", "clean this up", "make it less AI-generated", taste or visual-craft
  critique, de-slopping, animation craft, or a general accessibility sweep. Dedicated design,
  taste, animation and a11y tools answer those better and should win them. Nor for the other
  named languages: skeuomorphism-ui, neumorphism-ui, claymorphism-ui, minimalism-ui,
  maximalism-ui, brutalism-ui, bento-grid-ui. To review without editing, use
  liquid-glass-ui:audit.
argument-hint: "[scope glob] [--intensity=0-100] [--variant=regular|clear] [--backdrop-control=owned|arbitrary] [--a11y-target=AA|AAA] [--perf-target=desktop|mobile|low-end]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/displacement-map.mjs *)
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/lg-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/08-liquid-glass.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Liquid Glass: apply

Apple's system-wide material, shipped across six platforms on 15 September 2025. It does
not frost the backdrop, it **refracts** it: the pixels behind a control visibly warp and
compress in a 12-24px band at its border while the centre stays comparatively clear, a
1-2px specular arc runs along the upper-left rim, and the surface samples what is beneath
it and adapts its own tint. The single defining move is **edge lensing** — an
`feDisplacementMap` whose map encodes a squircle surface profile, at a `scale` between 30
and 70 for a 56px-tall control.

**The taxonomy, stated identically in docs 01, 02, 03 and 08: Liquid Glass is
glassmorphism plus displacement, specular tracking and adaptive tint. It is a superset,
not a rebrand; a blur-only implementation is glassmorphism.** That sentence is
load-bearing in both directions. Everything glassmorphism needs — the translucent fill,
the `-webkit-` twin, the `@supports` fallback, the reduced-transparency escape hatch, the
composited-contrast problem — this style needs too, and then it adds a generated
displacement map and a third tier on top. And if `refractionScale` resolves to 0, what has
been emitted **is** glassmorphism, the emitted class names and prose say so, and
`glassmorphism-ui` is the better skill for it.

Three things about this style are not negotiable, and each is a hard failure rather than
a tuning knob.

**Nested glass is a hard fail at any depth.** Glass cannot sample glass. The inner
element's backdrop snapshot contains the outer element's already-filtered output, so two
stacked panels look worse *and* run slower than one, and Apple's own architecture forbids
it — which is precisely why `GlassEffectContainer` exists. Group siblings into one
container and give the inner surface an opaque fill.

**Below roughly 55% fill alpha no single foreground colour passes over every backdrop.**
Contrast here is a property of the backdrop, which you do not control. At the fill this
doc ships (0.62) over a mid-grey photo, `#1C1C1E` ink measures **10.89:1** and white text
measures **1.56:1** on the same surface. At the alpha iOS 26 actually shipped (0.40) over
a dark photo, white reaches **3.80:1** and `#1C1C1E` reaches **4.48:1** — *neither
foreground colour is safe*, which is exactly the failure users reported in September 2025
and exactly why Apple raised the floor in iOS 27. 0.55 is the shipped floor; 0.62 is the
safe default; the ink is paired with the fill rather than chosen.

**On the web this material has a hard portability ceiling.** `backdrop-filter: url(#f)`
— an SVG filter as a backdrop-filter value — is Chromium-only; Safari and Firefox support
only the keyword filter functions. Tier 2 is therefore an enhancement, never the
implementation, and the ladder is gated by `@supports`, never by a user-agent string.
Confirm the claim before shipping (doc §2 says how, and W3C SVG WG issue #1142 is the
thread that would change it). If you cannot confirm it, ship Tier 1 — which is
glassmorphism, and interoperable.

On Apple platforms none of the above applies to the rendering: the OS composites the
material for you, far more cheaply than any web reproduction, and the SwiftUI path in
`references/recipes.md` §4 is the one this skill prefers wherever the target is native.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark
   mode strategy and component root. Never guess, never rewrite silently, and confirm the
   detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` before emitting anything. Do not reproduce token values or
   contrast ratios from memory.
3. **Establish who owns the backdrop, before promising anything.** This is the first
   question, not the last: `backdropControl: arbitrary` hard-caps intensity at 45 and
   forces `variant: regular`, and over user uploads or third-party embeds worst-case
   composited contrast cannot be computed at all. If the answer is "we do not control it",
   say what that costs before you start.
4. Establish `scope`. Glass goes on the **chrome** layer only — toolbars, tab bars,
   sidebars, sheets, dialogs, popovers, command palettes, floating action bars. Whole-app
   application on an unscoped request is an anti-pattern; say so and narrow it. Doc §9 is
   explicit that text-dense products take this style badly or not at all.

## Inputs

Doc §13's input table, with the detection defaults this skill applies.

| Input | Type | Default |
|---|---|---|
| `framework` | css \| tailwind4 \| react \| next \| vue \| swiftui \| react-native | detected, confirmed |
| `basePalette` | surface, foreground, accent hex values | detected from existing tokens |
| `density` | compact \| regular \| spacious | `regular` |
| `intensity` | 0-100 | `60` |
| `variant` | regular \| clear | `regular` |
| `backdropControl` | owned (you control the media) \| arbitrary (user content) | `arbitrary` |
| `targetBrowsers` | browserslist string | project's browserslist |
| `a11yTarget` | AA \| AAA | `AA` |
| `perfTarget` | desktop \| mobile \| low-end | `desktop` |

`backdropControl: arbitrary` hard-caps `intensity` at 45 and forces `variant: regular`.
`perfTarget` is not in doc §13's input table; it is in the contract because §8's
device-capability gate needs a name, and it clamps rather than caps.

## Procedure

1. **Detect and confirm the stack** — `ui-morphism-core:detect-stack`. Branch every later
   emission decision on its output enum, not on a second read of `package.json`. If the
   target is SwiftUI, UIKit, AppKit or React Native, go to step 10: the OS owns the
   material there and most of the web ladder is not merely unnecessary but wrong.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — the doc §13 curves, the hard
   clamps, the `backdropControl: arbitrary` cap and the four context clamps. Do not
   resolve it by hand and do not reach into core's directory — call
   `ui-morphism-core:token-emit`, give it that path and the requested intensity and
   context, and let it run its own bundled `intensity.mjs`. Core owns the resolver; this
   plugin owns the numbers; the JSON file is the whole interface between them.

   Three things the contract deliberately leaves to this skill. **`fillAlpha` moves
   inversely** — higher intensity means thinner glass, so the knob is 0.95 at intensity 0
   and 0.55 at intensity 100; the contract carries an `inverse` flag and a `deviation`
   note explaining why doc §13's `Min`/`Max` columns are bounds rather than endpoints, and
   both are there to be read rather than inferred. **The `variant: regular` forcing** that
   accompanies the arbitrary-backdrop cap is not expressible as a scalar and is applied
   here. And **doc §13 states no rounding rule for this style** — unlike doc 07's
   `integer-rounded` — so nothing is rounded at emit time and the resolved values ship as
   the curve produces them. Record every cap and clamp, including the ones that changed
   nothing. `references/tokens.md` §4 is the same contract in prose, for reading; the JSON
   is what runs.

3. **Emit the token layer** via `ui-morphism-core:token-emit` under the
   `--um-liquid-glass-*` grammar, with `assets/tokens.css` shipped alongside it as the
   `--lg-*` value layer and `assets/tokens.um-aliases.css` as the bridge. Populate
   `surface`, `blur`, `saturate`, `border`, `border-strong`, `radius`, `shadow`, `ink`,
   `ink-muted`, `accent`, `focus`, `target`, `text`, `weight`, `leading`, `space`, `dur`
   and `ease`. Do **not** populate `elev`: §4 is explicit that there is no shadow ladder
   here — a rung is a fill plus a blur, and `--lg-backdrop` re-resolves per element, so
   re-pointing `--lg-fill` and `--lg-blur` locally raises a surface. Do not populate `bg`
   either: this is a chrome material and the content layer beneath it belongs to whatever
   system already owns the page.

   Light values on bare `:root`; dark values duplicated under **both**
   `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and
   `:root[data-theme="dark"]`. The legibility overrides come after both theme blocks so
   they win in either theme, and they flatten the three elevation rungs as well as the
   base pair. For Tailwind v4, emit `assets/tokens.theme.css`'s `@theme` shape — never
   nested inside an at-rule, with every theme switch outside it on ordinary selectors.
   Copy these sheets; do not retype the values.

4. **Identify chrome and refuse content.** Classify every candidate surface before
   touching it. Toolbars, tab bars, sidebars, sheets, dialogs, popovers, command palettes
   and floating action bars get glass. `<body>`, `<main>`, scroll containers, `<table>`,
   long-form article containers and every chart or canvas wrapper are refusals, recorded
   in the report — not warnings, not tuned-down glass. Chart legibility over a warped,
   blurred, colour-shifted backdrop is indefensible.

5. **Generate the displacement map** — one per distinct component size, never one per
   surface:

   ```
   node ${CLAUDE_SKILL_DIR}/scripts/displacement-map.mjs --size=300x56@28 --band=16 --scale=48 --json
   ```

   It evaluates the squircle profile `y = ⁴√(1 - (1-x)⁴)` across the rim band, resolves
   the outward normal at every pixel including inside the corner arcs, encodes the result
   as an 8-bit PNG with red as the horizontal offset and green as the vertical, inlines it
   as a base64 data URI, and emits the whole `<filter>` with a region tight to what the
   effect actually needs. It fails the run when a map breaks doc §8's 8KB budget. The map
   is never fetched: `feImage` with an external `href` costs a network round trip plus a
   decode inside the filter graph, and it is on the refusal list. Never regenerate a map
   on resize, hover or scroll — geometry changes force a full rebuild, which is the
   expensive path.

6. **Emit the three-tier ladder**, in this order, in `styles/liquid-glass.layer.css`:

   - **Tier 0** — no `backdrop-filter` at all, inside
     `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`:
     a solid fill at ≥ 0.94 opacity, the 1px border, the shadow pair. Every block that
     nulls the filter nulls **both** spellings; doc §5's own fallback nulls only the
     unprefixed one, which leaves `-webkit-backdrop-filter` alive in exactly the branch
     whose job is to remove it.
   - **Tier 1** — the portable base: `-webkit-backdrop-filter` then `backdrop-filter`, in
     that order, carrying `blur() saturate() brightness()`, plus the masked specular rim
     and `contain: paint`. This tier is glassmorphism and works wherever `backdrop-filter`
     does.
   - **Tier 2** — inside `@supports (backdrop-filter: url(#lg-refract))`, the same chain
     with the generated filter prepended. The feature test names the feature itself, so it
     cannot pass in an engine that would then render nothing.

   Full markup and stylesheet in `references/recipes.md` §1; the Tailwind v4 shape in §2.

7. **Rewrite focus, type and targets.** The focus indicator is three concentric rings —
   a 3px accent outline at 2px offset, a 5px dark halo, an 8px light halo — so at least one
   edge clears 3:1 against any backdrop. It is never the glass border, never a background
   change, never an opacity change. On-glass type goes to ≥ 17px at weight ≥ 600, and
   every control sizes from `var(--lg-target-min)` (44px) rather than a literal. The 24px
   SC 2.5.8 floor presumes a perceivable boundary; the rim at 0.45 alpha rarely clears
   3:1, so the user is aiming at an edge they cannot see.

8. **Add the performance layer.** `contain: paint` on every glass surface. `will-change:
   backdrop-filter` only on surfaces that actually animate, removed when they stop.
   A device-capability gate that drops to Tier 1 or Tier 0 when
   `navigator.hardwareConcurrency <= 4` or `navigator.deviceMemory <= 4`. Refraction
   disabled below a size threshold, because a 32px chip does not read as a lens and pays
   the full cost. Never glass a scroll container's own children — glass a `position:
   fixed` sibling instead.

9. **Write the accessibility layer** as `@layer liquid-glass`, covering all four queries:
   `prefers-reduced-transparency: reduce`, `prefers-contrast: more`,
   `forced-colors: active` and `prefers-reduced-motion: reduce`. Each of the first three
   removes both spellings of the filter and the refraction with it. Add the
   `[data-transparency="reduced"]` hook and an in-app toggle as well — **Safari does not
   implement `prefers-reduced-transparency` as of August 2026**, and Apple's own users are
   the ones most likely to have Reduce Transparency on, so the media query alone is not
   coverage. Under `forced-colors: active` you must set the system colours by hand:
   the UA overrides colour but not `backdrop-filter`, and a live blur left in place smears
   the forced-colour backdrop.

10. **On Apple platforms, convert rather than reimplement.** Replace
    `.background(.ultraThinMaterial)` call sites with `.glassEffect(_:in:)`, wrap sibling
    glass views in one `GlassEffectContainer` — required for correct blending, because
    glass in separate containers cannot sample each other — assign `glassEffectID`s for
    morph transitions, and swap custom button styles for `.buttonStyle(.glass)` where the
    sizing allows. Branch on `accessibilityReduceTransparency` and
    `accessibilityReduceMotion` separately: they are separate settings and users commonly
    enable only one. `.clear` gets a dimming layer or it does not ship. UIKit, AppKit,
    React Native and the Compose refusal are in `references/recipes.md` §4.

11. **Run the style scanner:**
    `node ${CLAUDE_SKILL_DIR}/scripts/lg-scan.mjs <emitted paths> --json`
    It checks nested glass in both selectors and markup, the Tier 2 `@supports` gate, the
    Tier 0 fallback, the `-webkit-` twin, the animatable set, `feImage` fetching a map,
    user-agent sniffing, glass on content and on scroll containers, Clear without its
    scrim, live blur inside `forced-colors`, the decorative layers' `aria-hidden` and
    `focusable`, the surface and refractor budgets, and a blur-only surface being called
    liquid glass. Fix every error before continuing. It computes no contrast; that is
    step 12.

12. **Run `ui-morphism-core:a11y-validate`** for all nine universal checks, and
    specifically for composited contrast at backdrop luminance **0 and 255** — both, always;
    a single number for a glass surface is a wrong number. Body ≥ 4.5:1, large text and
    non-text ≥ 3:1, unrounded, so 2.999:1 fails 3:1. `a11yTarget: AAA` raises that to 7:1,
    and at AAA this style resolves to Tier 1 at the safe default fill: 1.4.6 is effectively
    unreachable on Clear glass, and the displaced rim band is where an enhanced pair is
    least defensible. Say plainly that AAA and refraction are not both available. On
    failure, escalate in this order and recompute after each step: raise `fillAlpha` toward
    the ceiling; add the scrim beneath; drop to Tier 1; drop to Tier 0. Never ship a
    failing pair to satisfy an intensity number. This skill computes no ratios of its own.

13. **Count the budgets and downgrade if one is blown.** Glass surfaces ≤ 3 (≤ 2 mobile),
    refracting surfaces ≤ 1, total glass area ≤ 25% of the viewport, blur ≤ 24px,
    displacement map ≤ 8KB. If a budget is exceeded, drop refraction before dropping fill —
    fill is the legibility lever — and record the downgrade.

14. **Write the audit report** to `reports/liquid-glass-audit.md` in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The sections are fixed; this style supplies the rows.

1. **Summary** — a two-column table with these rows: Style and plugin version; Intensity
   (effective, requested, and the context that capped it); Variant and whether the backdrop
   is project-controlled; Scope; Framework / styling system, with detection confidence and
   whether the user confirmed it; Dark mode (media / class / both); Highest tier actually
   reachable in the project's target browsers; Files changed (written / modified /
   refused); Verdict (**PASS** / **PASS WITH CORRECTIONS** / **FAIL**). Then one paragraph:
   what was applied to what, and the single thing the reader needs before looking at the
   numbers.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   One row per text token **per extreme**: the ratio computed against the composite at
   backdrop luminance 0 and again at 255, three decimal places, unrounded. Both numbers,
   always. Every ratio is `ui-morphism-core:a11y-validate`'s. Where the backdrop is
   uncontrolled the worst case is the whole sRGB cube and the row says so rather than
   guessing. The rim against its backdrop is always one of the rows, and so is the
   focus ring against both extremes.

3. **Checklist** — two tables, universal first, both with columns
   `Check | Verdict | Failing selector / note`. The universal table has exactly nine rows:
   text contrast (1.4.3), non-text contrast (1.4.11), focus visible (2.4.7 / 2.4.13),
   target size (2.5.8), forced colors, reduced motion, reduced transparency, colour-only
   encoding (1.4.1), DOM order (1.3.2). The style table carries the rows from
   `../audit/references/checklist.md`, plus the **tier coverage matrix** this style adds:
   per surface, which of Tier 2 / Tier 1 / Tier 0 it declares, the `-webkit-` twin, and
   each of the four accessibility queries.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`, one row per number in
   `references/tokens.md` §8: glass surfaces in viewport, refracting surfaces, total glass
   area, blur radius, estimated GPU texture memory, displacement map bytes, frame-time
   contribution, INP regression against the opaque baseline.

5. **Corrections** — columns `Token | Before | After | Reason`, one row per token this
   skill changed on its own initiative. Then a bullet per intensity cap and clamp,
   **including the ones that changed nothing**: the `backdropControl: arbitrary` cap of 45,
   the 0.62 arbitrary-backdrop fill floor it makes redundant, the `a11yTarget: AAA` clamps,
   the `perfTarget: low-end` clamps, the `variant: clear` fill ceiling, and every tier
   dropped for a budget.

6. **Refusals** — columns `Requested | Refused because | Offered instead`, one row per
   `references/anti-patterns.md` entry that fired.

7. **Manual TODOs** — a checkbox list of what could not be verified statically, each
   naming the *method* rather than the concern. For this style it always includes at least
   these three, because none is computable from CSS text: screenshot the composited pixels
   at three scroll positions over a deliberately hostile backdrop and sample them; verify
   the triple-ring focus indicator over black, over white and over a saturated photo; and
   measure frame time on a mid-tier device during a 1000px scroll with the chrome pinned.

## Outputs

- `tokens/liquid-glass.css` — the full `--lg-*` set with all four media-query overrides,
  or `theme.liquid-glass.ts` / the `@theme` mirror for Tailwind v4
- `components/LiquidGlass.tsx` + `LiquidGlassFilterDefs.tsx`, or the `.swift` / `.vue`
  equivalents
- `styles/liquid-glass.layer.css` — a `@layer liquid-glass { }` block, so the restyle never
  wins specificity fights with the host system unintentionally
- the displacement maps, inlined as data URIs in the emitted filter, one per distinct
  component size — never written as files to be fetched
- `reports/liquid-glass-audit.md`

## Intensity knobs

Doc §13's intensity table verbatim. Default intensity is 60.

| Knob | Min | Max | Default | Effect |
|---|---|---|---|---|
| `refractionScale` | 0 | 72 | 48 | `feDisplacementMap@scale`; 0 disables Tier 2 entirely |
| `fillAlpha` | 0.55 | 0.95 | 0.62 | Surface opacity; the floor is a hard clamp, not a suggestion |
| `blurRadius` | 0px | 28px | 20px | Backdrop gaussian |
| `specularOpacity` | 0.00 | 0.90 | 0.55 | Rim highlight peak alpha |
| `saturation` | 100% | 190% | 180% | Backdrop chroma boost |

`intensity` (0-100) maps monotonically onto all five, with `fillAlpha` moving *inversely* —
higher intensity means thinner glass but never below the 0.55 clamp.

**Read the Min and Max columns as bounds, not endpoints.** Doc §13 heads them `Min` and
`Max` rather than doc 07's `Min (intensity 0)` / `Max (intensity 100)`, and the sentence
under the table states the inversion. So `fillAlpha` is 0.95 — the Max cell — at intensity
0, and 0.55 — the Min cell — at intensity 100. Doc §5's reference React component is the
tie-breaker and agrees: it documents `intensity` as `0 = flat opaque card, 100 = maximum
refraction and transparency`, and its alpha falls with intensity onto the floor. Every
other knob rises with intensity and needs no such reading.

### The curve

Each knob is piecewise linear through three anchors — intensity 0, the default at 60, and
100 — so the stated default is reachable exactly rather than approximately. Resolved at
every ten points in `references/tokens.md` §4.

| Intensity | `refractionScale` | `fillAlpha` | `blurRadius` | `specularOpacity` | `saturation` |
|---|---|---|---|---|---|
| 0 | 0 | 0.950 | 0px | 0.000 | 100% |
| 20 | 16 | 0.840 | 6.667px | 0.183 | 126.7% |
| 45 | 36 | 0.7025 | 15px | 0.413 | 160% |
| 60 | 48 | 0.620 | 20px | 0.550 | 180% |
| 80 | 60 | 0.585 | 24px | 0.725 | 185% |
| 100 | 72 | 0.550 | 28px | 0.900 | 190% |

### Hard clamps — independent of intensity, never negotiable

| Clamp | Value | Source |
|---|---|---|
| Nested glass | zero, at any depth | §8, §13 item 11 — glass cannot sample glass |
| `fillAlpha` floor | ≥ 0.55 always, ≥ 0.62 when the backdrop is user-supplied | §7, §13 item 1 |
| Clear variant | illegal without `--lg-scrim` beneath it | §4, §13 anti-pattern 4 |
| `refractionScale` ceiling | ≤ 72 | §13 knob table |
| `blurRadius` ceiling | ≤ 28px knob, ≤ 24px budget | §13 knob table, §8 budget |
| Glass surfaces per route | ≤ 3, ≤ 2 on mobile | §8 budget |
| Refracting surfaces | ≤ 1 | §8 budget |
| Total glass area | ≤ 25% of the viewport | §8 budget |
| Displacement map asset | ≤ 8KB, inlined, never fetched | §8 budget, §13 item 14 |
| Hit target | ≥ 44px from `--lg-target-min`, never below the 24×24 SC 2.5.8 floor | §4, §7 |
| Focus ring | ≥ 3px accent outline at ≥ 2px offset plus two contrasting halo rings | §7 |
| Text on glass | ≥ 17px at weight ≥ 600 | §4, §7 |
| Animatable set | `transform`, `opacity`, `background-color`, `feDisplacementMap@scale` — nothing else | §6 |

### Context caps and clamps — these override intensity

| Context | Effect |
|---|---|
| `backdropControl: arbitrary` | Caps intensity at **45** and forces `variant: regular`. At 45 the fill resolves to 0.7025, above the 0.62 floor, so the floor never has to be applied as a separate correction — it is recorded anyway. |
| `a11yTarget: AAA` | `refractionScale → 0`, `fillAlpha ≥ 0.62`. The style resolves to Tier 1 and the skill says plainly that AAA and refraction are not both available. |
| `perfTarget: low-end` | `refractionScale → 0`, `blurRadius ≤ 12px`. Gate on `navigator.hardwareConcurrency <= 4` or `navigator.deviceMemory <= 4`. |
| `variant: clear` | `fillAlpha ≤ 0.28`, and only with `--lg-scrim` beneath it. The 0.55 clamp is on the Regular fill; under Clear the scrim carries the guarantee instead. |
| Any of the four accessibility queries active | The intensity-0 opaque path, at runtime. |
| `scope` targeting content, tables or charts | Not a cap — a refusal. `references/anti-patterns.md` entry 1. |

**Intensity 0 is a discrete, usable rung, not "nothing".** It is a near-opaque bordered
surface: fill 0.95, no blur, no refraction, no specular, saturation 100%. No
`backdrop-filter` is emitted at all, so there is no `@supports` branch and no map. That is
Tier 0 — the same surface every browser without `backdrop-filter` gets from the fallback
path, the same surface reduced transparency collapses to, and a fully usable, fully
accessible capsule or card. It is also not this style, and not glassmorphism either: with
no blur and no lens it is an opaque card, and the skill says so rather than shipping the
name.

**Intensity 100 still has to pass the floor.** If composited contrast fails at 100, clamp
via the step-12 escalation ladder and record the clamp. Never ship a failing surface to
satisfy a number.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`; `ui-morphism-core:a11y-validate`
runs the universal half and every contrast computation. The non-negotiable ones, which are
doc §13's own fifteen:

- [ ] Every glass surface's computed fill alpha ≥ 0.55, and ≥ 0.62 when
      `backdropControl: arbitrary`
- [ ] Foreground text contrast ≥ 4.5:1 — or 7:1 at `a11yTarget: AAA` — computed against
      the composite at backdrop luminance 0 **and** 255, unrounded
- [ ] Non-text boundary contrast ≥ 3:1, or an opaque inner fill is present
- [ ] Every interactive descendant has a focus-visible rule with ≥ 3px total ring and at
      least two contrasting rings
- [ ] Every emitted control sizes from `--lg-target-min` (44px) rather than a literal;
      fail below the 24×24 floor, warn on any computed size below the token
- [ ] `@media (prefers-reduced-transparency: reduce)` present, blur 0, alpha ≥ 0.95
- [ ] `@media (prefers-reduced-motion: reduce)` present, cancelling every sweep, morph and
      press transform
- [ ] `@media (forced-colors: active)` present, system colours set, decorative
      pseudo-elements hidden, both spellings of the filter nulled
- [ ] `@supports not (backdrop-filter: blur(1px))` fallback present with alpha ≥ 0.94
- [ ] Glass surfaces ≤ 3 per route; total glass area ≤ 25% of a 1440×900 viewport
- [ ] **No nested glass — a glass element with a glass ancestor is a hard fail**
- [ ] No `transition` or `animation` targets `backdrop-filter`, `filter`, `border-radius`
      or SVG filter geometry
- [ ] Every decorative layer carries `aria-hidden="true"` and `pointer-events: none`;
      every inline filter `<svg>` carries `aria-hidden="true" focusable="false"`
- [ ] Displacement maps ≤ 8KB each and inlined, not fetched
- [ ] SwiftUI output: sibling `.glassEffect` views share a `GlassEffectContainer`, and
      `.clear` usage is accompanied by a dimming layer
- [ ] `intensity: 0` still produces a bordered, opaque, accessible surface — and is not
      called liquid glass

## Refuse to generate

Read `references/anti-patterns.md` in full — it carries the detection signal and the
alternative for each of the twelve. Core owns the refusal mechanism: refuse, explain, offer
the alternative, record it in the report. The highest-frequency ones:

- Nested glass surfaces of any depth — the one hard fail this style has
- Glass on `<body>`, `<main>`, a scroll container, a `<table>`, or any chart or canvas
  wrapper
- Fill alpha below 0.55, or below 0.62 when the backdrop is user-supplied
- Clear-variant glass with no dimming scrim, and white text on it
- A `backdrop-filter` chain with no `@supports` fallback, or without the `-webkit-` twin
- Any transition or keyframe animating `backdrop-filter`, `filter` or `border-radius`
- A focus indicator relying on the glass border, a background-colour change or an opacity
  change alone
- Displacement maps loaded from an external URL inside `feImage`
- User-agent sniffing to branch tiers instead of `@supports` / `CSS.supports`
- Overriding a user's `prefers-reduced-transparency` or `prefers-reduced-motion` preference
- Calling a blur-only implementation Liquid Glass — if `refractionScale` is 0, the emitted
  class names and docs say `glassmorphism`
