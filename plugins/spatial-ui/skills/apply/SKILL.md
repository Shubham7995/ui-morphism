---
name: apply
description: >-
  Use when the user NAMES the style — spatial UI, spatial computing, visionOS, Android XR,
  depth or volumetric UI — or describes its concrete moves: panels floating at measured
  translateZ on a six-step depth ladder, a perspective stage with the counter-scale that holds
  apparent size constant, orbiter or ornament chrome, pointer or scroll parallax, or
  converting a flat shadow-elevation scale into a real depth ladder. Both dialects: native XR,
  and the flat-screen depth idiom most teams ship. THE TEST against the two translucent-depth
  siblings: here depth is GEOMETRY — a `perspective` camera and z positions — and translucency
  is optional decoration on top. Translucent panels with no camera are glassmorphism-ui when
  the backdrop is merely blurred, liquid-glass-ui when it refracts. ui-morphism is descriptive
  and plural: one named language, measured tokens, a stated when-not-to-use — not a
  design-quality tool. Do NOT use for open-ended quality work — "make it look good", "make it
  modern", "polish this", "clean this up", "make it less AI-generated", taste or visual-craft
  critique, de-slopping, animation craft, or a general accessibility sweep. Dedicated design,
  taste, animation and a11y tools answer those better and should win them. Nor for the other
  named languages: skeuomorphism-ui, neumorphism-ui, claymorphism-ui, minimalism-ui,
  maximalism-ui, brutalism-ui, bento-grid-ui. To review without editing, use spatial-ui:audit.
argument-hint: "[scope glob] [--intensity=0-100] [--target=screen|headset|both] [--backdrop-control=owned|arbitrary] [--material=glass|solid] [--density=compact|regular|spacious] [--a11y-target=AA|AAA] [--dry-run]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash(node ${CLAUDE_SKILL_DIR}/scripts/spatial-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/10-spatial-ui.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Spatial UI: apply

The interface is a set of physical panels suspended at measured distances from the viewer,
not ink printed on a page. Depth is the primary hierarchy channel and it replaces the
drop-shadow elevation ladder with an actual z axis, an actual camera and an actual angular
size budget.

The single defining move is **distance-independent sizing**. An element is positioned at a
depth and then counter-scaled so its *angular* size is unchanged: push a panel to
`translateZ(56px)` under `perspective: 1200px` and it grows by `1200 / (1200 − 56)`, so you
scale it by `(1200 − 56) / 1200 = 0.95333` to cancel that. Only the parallax and the shadow
pair are left to read as depth. Everything else in the style — the six-step ladder, the
glass, the orbiters, the gaze-grade targets — follows from taking that one commitment
seriously. A `translateZ` without its counter-scale is a zoom, not a depth.

**Two dialects, and the second one is the job.** The native XR dialect (visionOS, Android
XR, Horizon OS) is a niche with excellent documentation and a shrinking install base: IDC
counted roughly 45,000 Vision Pro units in 2025 against 390,000 in 2024. The flat-screen
dialect — depth ladders, floating panels, orbiter chrome, pointer parallax, scroll-driven
depth — is spreading fast through mainstream product design and is what most requests
actually want. Ask which one before you emit anything. `target: screen` is the default for
a reason.

**The criterion this style breaks that nobody discusses is SC 2.5.7 Dragging Movements.**
`movable()`, `resizable()`, drag-to-reposition windows and drag-based depth controls all
require a single-pointer, non-dragging alternative. Every movable or resizable panel this
skill emits ships arrow-key nudging, a visible reset control, and a keyboard handler — or
it does not ship. This is checked by `scripts/spatial-scan.mjs`, and it is a hard error,
not a warning.

## Before you start

1. Call `ui-morphism-core:detect-stack` and record the framework, styling system, dark mode
   strategy and component root. Never guess, never rewrite silently, and confirm the
   detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` before emitting anything. Do not reproduce token values,
   ladder steps, alphas or contrast figures from memory.
3. Establish `scope` and `target`. Default scope is chrome and hero surfaces —
   `src/components/{layout,hero,nav}/**`. Doc §9 is explicit that this is a
   chrome-and-hero language: a page that is spatial all the way down is a page with no
   ground plane. Whole-app application on an unscoped request is an anti-pattern; say so
   and narrow it.
4. **Find the `position: fixed` chrome before you place the camera.** `perspective`
   establishes a containing block for `fixed` and `absolute` descendants, so a fixed header
   inside a perspective stage silently stops being fixed. This is doc §8's most common
   spatial layout bug. Grep for it first, and plan the stage as a *sibling* of that chrome.
5. **Ask who owns the backdrop.** `backdropControl` defaults to `arbitrary` because most
   projects cannot promise what sits behind a glass panel. Arbitrary caps intensity at 45
   and floors the panel alpha. If the answer is "user-uploaded photos", the honest output
   is opaque panels, and doc §9 says so directly.

## Inputs

| Input | Type | Default |
|---|---|---|
| `framework` | css \| tailwind4 \| react \| next \| vue \| svelte \| swiftui \| compose-xr | detected, confirmed |
| `basePalette` | environment, surface, ink, accent hex values | detected from existing tokens |
| `density` | compact \| regular \| spacious | `regular` |
| `intensity` | 0-100 | `55` |
| `target` | screen \| headset \| both | `screen` |
| `backdropControl` | owned \| arbitrary | `arbitrary` |
| `material` | glass \| solid | `glass` |
| `a11yTarget` | AA \| AAA | `AA` |
| `dryRun` | flag | off — see [Dry run](#dry-run) |

`target: headset` forces 60px minimum targets, the 41° content cone and the 14px type
floor. `backdropControl: arbitrary` forces panel alpha ≥ 0.62 (dark) / ≥ 0.60 (light) and
caps intensity at 45. `density: compact` is **rejected outright** when `target` includes
headset — compact density plus 60px gaze targets plus 8px minimum separation is a
contradiction, and resolving it by moving one of the three resolves it by breaking it.

## Procedure

1. **Detect and confirm the stack** — `ui-morphism-core:detect-stack`. Branch every later
   emission decision on its output enum, not on a second read of `package.json`.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — curves, clamps, the
   `backdropControl: arbitrary` cap and the context clamps, all from doc §13. Do not
   resolve it by hand and do not reach into core's directory: call
   `ui-morphism-core:token-emit`, give it that path and the requested intensity and
   context, and let it run its own bundled `intensity.mjs`. Core owns the resolver; this
   plugin owns the numbers; the JSON file is the whole interface between them.

   Four things the contract deliberately leaves to this skill. Round the ladder, the
   camera distance and both blur radii to integer px at emit time. Derive the tilt as
   `translate / 3` — that identity holds at every anchor. Apply the `contextClamps` block
   after resolution, because core's resolver caps intensity rather than individual knobs.
   And re-derive `--sp-k-1` … `--sp-k-5` from `1 − z / perspective` after both the ladder
   and the camera have settled. Record every cap, clamp and rounding: the audit reports
   the requested value next to the applied value. `references/tokens.md` §4 is the same
   table in prose, resolved at every five points; the JSON is what runs.

3. **Emit the token layer** via `ui-morphism-core:token-emit` under the `--um-spatial-*`
   grammar, with `assets/tokens.css` shipped alongside it as the `--sp-*` value layer and
   `assets/tokens.um-aliases.css` as the bridge. Populate `bg`, `surface`, `ink`,
   `border`, `border-strong`, `radius`, `shadow`, **`elev`**, `blur`, `saturate`, `space`,
   `text`, `weight`, `tracking`, `dur`, `ease`, `focus`, `target`. `elev` is the group
   this style exists to fill: core's vocabulary defines it as depth *level*, semantic
   rather than visual, and says it maps to a `translateZ` step here. Do **not** populate
   `accent` or `danger` — doc §3 and §4 name no action hue, because a low-chroma room is
   what lets depth do the ranking. Light values on bare `:root`; dark values duplicated
   under both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
   and `:root[data-theme="dark"]`, then the three preference blocks after them so they
   win in both themes. For Tailwind v4, emit `assets/tokens.theme.css`'s `@theme` shape —
   never nested inside an at-rule, with the dark overrides outside it.

4. **Place exactly one stage.** One element owns `perspective`, `perspective-origin` and
   `transform-style: preserve-3d`. Never `body`, never `html`, never an ancestor of
   `position: fixed` chrome. Move every fixed element out of that subtree and **report
   each move by selector** — that diff is a required row in the audit. Set the stage's
   `max-width` from `--sp-comfort-width` (1413px, the 41° cone at 500mm) or
   `--sp-comfort-width-desk` (1693px at 600mm), and add the `perspective: none`
   single-column reflow at ≤ 640px and at 320 CSS px.

5. **Map the existing elevation scale onto the ladder.** Rank the project's current
   shadow-elevation steps and assign them in order to `--sp-z-1` … `--sp-z-5` (16 / 24 /
   32 / 40 / 56, times `depthScale`). Preserve relative order; never invent a value
   between rungs. Orbiters land at level 1, popovers and menus at 3, sheets at 4, dialogs
   at 5. `--sp-z-0` is a 0.1px sentinel that forces a stacking context, not a distance,
   and it is never scaled. Every panel gets `translateZ(z)` **and** `scale(k)` **and** its
   matching shadow pair; the three move together or the apparent-size invariant is gone.

6. **Convert one navigation or toolbar component into an orbiter.** 20px clear of the
   panel edge, depth level 1, DOM child of the panel it belongs to (or `aria-owns`-linked
   to it), and a hover target that **spans the 20px gap** — an orbiter that vanishes when
   the pointer crosses the gap fails SC 1.4.13 outright. Escape dismisses it. Never more
   than 50% overlap with the panel.

7. **Add parallax, gated twice.** rAF-coalesced pointer parallax on `(pointer: fine)` and
   `!prefers-reduced-motion`, writing two custom properties and nothing else. When
   disabled, **detach the listener** rather than zeroing its output — doc §6 is explicit,
   and a zeroed listener still runs `getBoundingClientRect` on every pointer move.
   Optionally emit the `animation-timeline: scroll()` variant instead; it runs off the
   main thread in Chromium and scroll-driven animations are an Interop 2026 focus area.

8. **Size the targets and the type.** 44px from `--sp-target-pointer`, 60px from
   `--sp-target-gaze` under `(pointer: coarse)` or `(hover: none)`, both wrapped in
   `max()` with `--sp-target-floor` so a host theme cannot push the rendered control under
   24px. 8px minimum separation. Body weight one step up to 500, titles to 700, nothing
   below 14px. In Tailwind v4 the coarse-pointer variant is `pointer-coarse:`;
   `max-pointer-coarse:` does not compile at all, which would silently delete the whole
   gaze-target rule.

9. **Give every movable or resizable panel a non-drag path (SC 2.5.7).** Arrow-key
   nudging on a focusable handle, a visible "reset layout" control, and — on Compose XR —
   the same for `movable()` / `resizable()`. This is the criterion this style breaks most
   reliably. If the user asks for drag-only repositioning, refuse and offer this.

10. **Run the style scanner:**
    `node ${CLAUDE_SKILL_DIR}/scripts/spatial-scan.mjs <emitted paths> --json`
    It checks the dragging alternative, `position: fixed` inside a perspective subtree,
    `perspective` on `html`/`body`/`:root`, ladder quantisation, missing counter-scale,
    `preserve-3d` nesting depth and `preserve-3d` on scrolling containers, the
    `backdrop-filter` surface census, `backdrop-filter` on animated or repeated elements,
    animated `backdrop-filter` / `perspective` / `width` / `height`, permanent
    `will-change`, the reduced-motion detach, forced-colors flattening, text planes
    rotated past 12°, target sizes written as literals instead of tokens, and the GPU
    layer-memory estimate. Fix every error before continuing. It computes no contrast
    ratio, no focus check and no forced-colors keyword audit; those are step 11's.

11. **Validate.** Run `ui-morphism-core:a11y-validate` over everything emitted. It owns
    all nine universal checks and **every** contrast computation — this skill computes no
    ratios of its own. Give it each glass surface composited per 8-bit channel in
    gamma-encoded sRGB (`C = α·C_fill + (1−α)·C_backdrop`) at both extremes of the
    backdrop, never by averaging the two luminances: that second model is not an
    approximation, it is a different and consistently optimistic one, and doc §7 measures
    it overstating a light fill on a dark ground by roughly three times. Feed it the
    style-specific assertions from `../audit/references/checklist.md` as well. Where a
    value fails, clamp it and record the clamp; never ship a failing pair to satisfy an
    intensity number.

12. **Count the budgets and downgrade if one is blown.** Concurrent `backdrop-filter`
    surfaces ≤ 6, composited layers ≤ 25, GPU layer memory ≤ 96 MiB, `preserve-3d` nesting
    ≤ 3, panels changing depth at once ≤ 3, added CSS ≤ 4 KB gzipped. Downgrade in doc
    §8's order: drop glass before dropping the ladder, because the ladder plus the shadow
    pairs is 90% of the read for 5% of the cost. Record every downgrade.

13. **Write the audit report** to `reports/spatial-ui-audit.md` in the shape below.

## The report shape

Seven sections, in this order, in every ui-morphism audit from every style. Do not add,
remove or reorder them: the order is what lets a user diff two styles' audits of the same
codebase. Where a section does not apply, write "None." — an empty section is information,
a missing section is a hole. The style supplies the rows; the sections are fixed.

1. **Summary** — a two-column table with these rows: Style and plugin version; Intensity
   (effective, requested, and the context that capped it); Scope; Target (screen / headset
   / both) and `backdropControl`; Framework / styling system, with detection confidence
   and whether the user confirmed it; Dark mode (media / class / both); Files changed
   (written / modified / refused); Verdict (**PASS** / **PASS WITH CORRECTIONS** /
   **FAIL**). Then one paragraph: what was applied to what, which dialect was emitted, and
   the single thing the reader needs before looking at the numbers.

2. **Contrast** — columns `Pair | Backdrop | Ratio | Required | Verdict | Auto-correction`.
   Every ratio is `ui-morphism-core:a11y-validate`'s, at **three decimal places,
   unrounded**: 4.497 fails 4.5 and 2.999 fails 3. One row per text token per extreme of
   the backdrop — the composite at `C_bd = 0` and again at `C_bd = 255` — because a single
   number for a glass surface is a wrong number. Where the backdrop is not owned, the
   worst case is the whole sRGB cube and the row says so.

3. **Checklist** — two tables, universal first, both with columns
   `Check | Verdict | Failing selector / note`. The universal table has exactly nine rows:
   text contrast (1.4.3), non-text contrast (1.4.11), focus visible (2.4.7 / 2.4.13),
   target size (2.5.8), forced colors, reduced motion, reduced transparency, colour-only
   encoding (1.4.1), DOM order (1.3.2). The style table carries the rows from
   `../audit/references/checklist.md`, plus two matrices this style adds:
   - **Depth ledger** — per panel: depth level, z in px, the counter-scale applied, the
     shadow pair, and the semantic role that carries the same information for a screen
     reader (`aria-modal`, `role="menu"`, heading, landmark).
   - **Camera containment** — every `position: fixed` element found inside the perspective
     subtree, with its selector, where it moved to, and whether the move was verified.

4. **Budgets** — columns `Budget | Measured | Limit | Verdict`, one row per number
   `references/tokens.md` §8 sets: concurrent `backdrop-filter` surfaces, composited
   layers, estimated GPU layer memory, `preserve-3d` nesting depth, panels animating depth
   at once, main-thread cost per parallax frame, emitted CSS bytes, added JS bytes.

5. **Corrections** — columns `Token | Before | After | Reason`, one row per token this
   skill changed on its own initiative. Then a bullet per intensity cap, clamp and
   rounding, **including the ones that changed nothing** — the `backdropControl: arbitrary`
   cap, the alpha floor, the 12px / 4° pointer-parallax clamp, the `target: headset` 60px
   floor, and the integer rounding of the ladder, the camera and both blurs all appear
   here.

6. **Refusals** — columns `Requested | Refused because | Offered instead`, one row per
   `references/anti-patterns.md` entry that fired.

7. **Manual TODOs** — a checkbox list of what could not be verified statically, each
   naming the *method* rather than the concern: sample the composited pixels behind every
   glass panel at three scroll positions; tab through the interface and confirm no focused
   control sits behind an orbiter or a level-5 dialog; drive every movable panel with the
   keyboard alone; measure real GPU layer memory in the browser's layer panel rather than
   from the estimate; test at 200% text zoom inside a transformed panel, because
   transforms do not scale with font size; and test real Windows High Contrast behaviour.

## Dry run

`--dry-run` runs everything above and changes nothing in the project. Every step executes in
full — the stack is detected and confirmed, intensity resolves through core, the token layer
and the component rewrites are generated, and `ui-morphism-core:a11y-validate` runs over the
real emitted CSS — so the contrast table, the checklist and the budgets are measurements and
not estimates. A dry run that guessed at its own numbers would be worth less than no dry run.

What changes is where the output lands. Nothing inside the project tree is created, modified
or deleted, and no report file is written. The complete proposed output goes to a scratch
directory outside the project — `$TMPDIR/ui-morphism-dry-run-<style>/`, or
`/tmp/ui-morphism-dry-run-<style>/` where `$TMPDIR` is unset — so the validator has real files
to read and the user has something to diff. The report is printed in the reply instead of
saved, and its Summary carries two extra rows: **Mode**, `dry run — no project files written`,
and **Scratch**, the absolute path. **Files changed** becomes `would write / would modify /
refused`.

Name that scratch path in the report. A dry run that claims to have written nothing while
writing somewhere it does not name is the one outcome worse than not offering the mode.

`--dry-run` is opt-in and is not the default. A skill invoked by name against a confirmed
scope was asked to do something, and a silent no-op is its own kind of surprise. The
read-only question — "what is wrong with what I already have" rather than "what would this
style do to it" — belongs to this plugin's `audit` skill, which holds no `Write` grant at all
and so cannot write whatever it is told.

## Outputs

- `tokens/spatial-ui.tokens.css` — the `:root` plus both dark blocks plus the
  reduced-transparency, reduced-motion and forced-colors overrides
- `tokens/spatial-ui.theme.css` — the Tailwind v4 `@theme` mirror; or `SpatialTokens.swift`
  / `SpatialTokens.kt` where the stack calls for it
- `components/spatial/*` — `SpatialStage`, `SpatialPanel`, `SpatialOrbiter`,
  `SpatialDialog` (with the −125px content pushback), `SpatialLayer` (parallax background)
- `styles/spatial.layer.css` — `@layer spatial { }` holding the depth utilities, the glass
  `@supports` ladder and the forced-colors flattening, ordered after the project's base
  layer
- `reports/spatial-ui-audit.md`

## Intensity knobs

Full resolved table at every five points in `references/tokens.md` §4. Curves are from doc
§13. Every knob is monotone across 0→100; two are inverse, which the contract permits —
more intensity means a *closer* camera and *less* fill.

| Knob | 0 | 55 (default) | 100 | Note |
|---|---|---|---|---|
| `--sp-perspective` | `none` | 1200px | 800px | Camera distance; lower = stronger foreshortening. The curve anchors at 4000px at intensity 0 only so it is defined there; the emitter writes the keyword `none` at exactly 0. |
| `depthScale` | 0.25× → 4/6/8/10/14 | 1× → 16/24/32/40/56 | 2× → 32/48/64/80/112 | Scales steps 1-5. `--sp-z-0` stays 0.1px. Not a token, ever: it is applied by the generator, which then re-derives every counter-scale and rescales every shadow pair. |
| `--sp-parallax-translate` / `--sp-parallax-tilt` | 0px / 0deg | 12px / 4deg | 24px / 8deg | Tilt is translate ÷ 3 at every anchor. Pointer parallax is hard-clamped at 12px / 4deg — see below. |
| Panel alpha / blur | 1.00 / 0px | 0.62 / 24px | 0.55 / 48px | The alpha curve also anchors 0.72 at intensity 45, which is where the default run lands once the arbitrary-backdrop cap fires — and 0.72 is doc §4's shipped `--sp-panel`. |
| Shadow multiplier | 0.4× alpha, 0.6× blur | 1× | 1.6× alpha, 1.4× blur | Both shadows in the pair scale together. |

**Hard clamps, independent of intensity:** panel alpha ≥ 0.62 dark / ≥ 0.60 light on an
arbitrary backdrop; pointer parallax ≤ 12px translate and ≤ 4° tilt; scroll-driven depth
≤ ±40px of z per viewport of scroll; every z quantised to the six-step ladder; every z
carries its counter-scale; targets ≥ 24px with 44px pointer / 60px gaze shipped and ≥ 8px
separation; type ≥ 14px at weight ≥ 500; text planes ≤ 12° from the viewing plane;
`preserve-3d` nesting ≤ 3 and never on a scrolling container; ≤ 6 concurrent
`backdrop-filter` surfaces; ≤ 25 composited layers and ≤ 96 MiB of GPU layer memory; zero
permanent `will-change`; no `position: fixed` inside a perspective subtree.

The parallax clamp is the one that needs stating out loud, because the knob's declared
maximum is larger than it. Doc §13's row tops out at 24px / 8°, and doc §6, §10 and §4 all
put the *pointer* parallax cap at 12px / 4° and call it nausea-safe. Doc §13's row covers
pointer **and scroll** amplitude together, and doc §6 gives scroll-driven depth its own
±40px cap, so the amplitude above 12px / 4° belongs to the scroll variant and pointer
parallax stays clamped at every intensity including 100. The tension is real; it is
recorded rather than resolved silently, here and in the contract's `clampNotes`.

**Context caps, which override intensity:** `backdropControl: arbitrary` — the default —
caps intensity at 45 and floors the panel alpha. `target: headset` or `both` forces the
60px target floor. `density: compact` with a headset target is refused, not clamped.

Intensity 0 is not nothing. It is a flat, cameraless interface with the depth ladder at
its 0.25× rung, the contact-plus-ambient shadow pairs still carrying the hierarchy, fully
opaque panels and no parallax — which is exactly doc §8's tier-1 fallback, "90% of the read
for 5% of the cost". Panels still have a hairline, controls still size from the target
tokens, and focus is still a real outline.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`; `ui-morphism-core:a11y-validate` runs
the universal half and `scripts/spatial-scan.mjs` runs the mechanical half. The
non-negotiable ones:

- [ ] Every glass surface carrying text measures ≥ 4.5:1 against the **worst-case**
      backdrop, composited per channel in gamma-encoded sRGB, unrounded
- [ ] Over an uncontrolled backdrop, dark glass under light body text is at α ≥ 0.62 and
      light glass under dark body text at α ≥ 0.60
- [ ] Every draggable or resizable panel has a keyboard path and a visible non-drag
      control (SC 2.5.7)
- [ ] Every `translateZ` carries its `scale(1 − z / perspective)`, and every z is on the
      ladder
- [ ] No `position: fixed` descendant of any `perspective` or `transform` subtree
- [ ] `prefers-reduced-motion: reduce` zeroes both parallax tokens **and** the listener is
      detached, not merely zeroed
- [ ] `prefers-reduced-transparency: reduce` produces fully opaque panels; every
      `backdrop-filter` is inside `@supports` with a non-glass alternative outside it
- [ ] `@media (forced-colors: active)` sets `perspective: none`, `transform: none`,
      `Canvas` / `CanvasText` and removes every shadow
- [ ] Every depth level ≥ 3 has a matching semantic role, and orbiters are DOM children of
      their panel or `aria-owns`-linked to it
- [ ] Focused elements are never obscured by an orbiter, dialog or sticky depth layer
      (SC 2.4.11); orbiter hover targets include the 20px gap and dismiss on Escape
      (SC 1.4.13)
- [ ] The page reflows to a single column with `perspective: none` at 320 CSS px
- [ ] Text scales to 200% without clipping inside a transformed panel — transforms do not
      scale with font size, so this is tested, not assumed
- [ ] Budgets met: ≤ 6 blurred surfaces, ≤ 25 layers, ≤ 96 MiB, ≤ 3 nesting, ≤ 4 KB gzipped
- [ ] `intensity: 0` still produces a usable, accessible, plain interface

## Refuse to generate

Read `references/anti-patterns.md` in full and follow the core refusal protocol: refuse,
explain in one sentence, offer the compliant alternative, record it in the report. Highest
frequency:

- Drag-only panel movement or resizing with no keyboard and no single-tap alternative
- Parallax or scroll-driven depth whose reduced-motion guard zeroes a variable instead of
  detaching the listener
- Depth as the only encoding of a state, a selection or a hierarchy relationship
- Glass panels below the alpha floor on a backdrop the project does not control, and any
  contrast figure derived by averaging luminances rather than compositing per channel
- `perspective` on `body`, `html`, or any ancestor of `position: fixed` chrome
- A `translateZ` with no counter-scale, or a z value that is not on the ladder
- `backdrop-filter` on repeated list or grid items, or on anything that animates its
  transform
- Permanent `will-change: transform` or `will-change: backdrop-filter`
- Text planes rotated more than 12° from the viewing plane
- Auto-playing camera fly-throughs, idle drift, or device-orientation parallax on mobile
- Compose XR code generated without pinning an explicit `1.0.0-alphaNN`
