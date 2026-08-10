---
name: apply
description: >-
  Use when the user NAMES the style — glassmorphism, frosted glass, acrylic — or describes
  its concrete moves: backdrop-blur, translucent or see-through panels, a frosted navbar,
  card, modal, popover, command palette, dock or HUD, or porting an Apple Material or
  Fluent Acrylic look to the web. Also for the mechanics only this style has: the
  `@supports` opaque fallback, the `-webkit-backdrop-filter` twin,
  `prefers-reduced-transparency` handling, the mesh-gradient ground glass depends on, a
  five-rung fill-and-blur ladder, or toning existing glass down for contrast, blur cost or
  battery. ui-morphism is descriptive and plural — one named language with measured tokens
  and a stated when-not-to-use — not a design-quality tool. Do NOT use for open-ended
  quality work: "make it look good", "make it modern", "polish this", "clean this up",
  "improve the design", "make it less AI-generated", taste or visual-craft critique,
  de-slopping, or animation and micro-interaction craft. A general design, taste or
  animation skill answers those better and should win them. Do not use for the sibling
  languages either: Apple Liquid Glass refraction, lensing or iOS 26
  specular chrome (liquid-glass-ui), same-hue soft extrusion on an opaque ground
  (neumorphism-ui), puffy pastel clay (claymorphism-ui), hard-bordered zero-blur surfaces
  (brutalism-ui), depth ladders and parallax (spatial-ui), tile-span layout
  (bento-grid-ui), stripping decoration out (minimalism-ui). To review an implementation
  without changing it, use glassmorphism-ui:audit.
argument-hint: "[scope glob] [--tone=light|dark|auto] [--scope=chrome|overlays|cards|all] [--intensity=0-100] [--perf-target=desktop|mobile|low-end]"
allowed-tools: Read Glob Grep Edit Write Bash(node ${CLAUDE_SKILL_DIR}/scripts/glass-scan.mjs *)
license: MIT
metadata:
  sourceDoc: docs/03-glassmorphism.md
  docSection: "13"
  lastResearched: "2026-08-08"
---

# Glassmorphism: apply

A panel that behaves like a sheet of frosted glass — semi-transparent, blurring and
re-saturating whatever sits behind it, edged with a hairline light border so you can still
find where the pane ends. The single defining move is **`backdrop-filter: blur() saturate()`
applied to a surface whose own `background` is only partially opaque.** The 1px border, the
inner top highlight, the vivid ground and the grain overlay all exist to make that one move
read as *glass* rather than as *a smudge*.

**The thing that makes this style different from every other one in the set: the effective
background of your text is not a known colour.** It is a composite of the panel fill and
whatever the user has scrolled behind it. The same `rgba(255,255,255,0.12)` panel with white
text measures **14.6:1** over `#0B0B12` and **1.57:1** over `#7DD3FC` — an ordinary sky-blue
in a mesh gradient. Same panel, same text, a 9.3× swing. axe, Lighthouse and Figma's contrast
plugins all compute against the declared `background-color` and cannot see what
`backdrop-filter` sampled, so they report the first number and never the second. Every
contrast decision in this skill is made against the **composited** surface at both extremes
of the ground, and it is made by `ui-morphism-core:a11y-validate`, never by this skill.

2026 position: mainstream but demoted from headline to supporting role. Glass is the default
treatment for floating, transient, overlay chrome, and a bad default for content surfaces,
forms and data tables. Apple's Liquid Glass has absorbed the ambitious end; plain
glassmorphism has settled into the boring, useful middle.

## Before you start

1. Run `ui-morphism-core:detect-stack` and record framework, styling system, dark-mode
   strategy and component root. Never guess, never rewrite silently, and confirm the
   detection with the user. `confidence: low` means ask.
2. Read `references/tokens.md` for the token table. Do not reproduce values from memory.
3. Establish `scope`. Default is `chrome` — sticky nav, toolbars, docks. Whole-app
   application on an unscoped request is an anti-pattern; say so and narrow it.
4. **Check the ground before promising anything.** Glass over flat `#111` is invisible. If
   the project's background is flat or neutral you are generating a ground as part of this
   work (step 3 below), and that changes the blast radius — say so before you start.

## Inputs

| Input | Type | Default |
|---|---|---|
| `framework` | css \| tailwind4 \| tailwind3 \| react \| vue \| svelte \| swiftui \| react-native | detected, confirmed |
| `basePalette` | 2–4 ground hex + foreground + accent | derived from existing tokens, else `#6d3bff / #00c2ff / #ff4d9d` on `#0b0b12` |
| `tone` | `light` (white tint, dark ground) \| `dark` (ink tint, light ground) \| `auto` | `auto` |
| `density` | compact \| comfortable \| spacious → padding 12/20/28px, radius 10/16/22px | `comfortable` |
| `intensity` | 0–100 | 50 |
| `scope` | chrome \| overlays \| cards \| all | `chrome` |
| `a11yFloor` | AA \| AA-strict \| AAA | `AA` |
| `perfTarget` | desktop \| mobile \| low-end | `mobile` |

## Procedure

1. **Detect and confirm the stack.** `ui-morphism-core:detect-stack`. Branch every later
   step on its `styling` enum rather than re-reading `package.json`.

2. **Resolve intensity through core.** This style's knob table is
   `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` — the doc §13 curves, the hard
   clamps and the two caps that resolve to the opaque rung. Do not resolve it by hand and
   do not reach into core's directory — call `ui-morphism-core:token-emit`, give it that
   path and the requested intensity and context, and let it run its own bundled
   `intensity.mjs`. Core owns the resolver; this plugin owns the numbers; the JSON file is
   the whole interface between them.

   The contract's `contextClamps` block — the `perfTarget: mobile` 20px blur ceiling and
   the `a11yFloor: AAA` 0.56 fill floor — is applied by this skill after resolution,
   because core's resolver caps intensity rather than individual knobs. Report those on the
   same audit line as a resolved cap. Record every clamp whether or not it changed
   anything. The tables below are the same contract in prose, for reading; the JSON is what
   runs.

3. **Audit the ground, and build one if there is not one.** Glass is a treatment that
   depends on a backdrop it does not own. If the page background is flat or neutral, emit a
   mesh-gradient ground from two to four saturated hues over `--glass-ground-base`, then put
   a `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55))` darkening layer between the ground
   and the glass so the brightest pixel behind body text stays under the ceiling: with a 12%
   white fill, white body text clears 4.5:1 while the backdrop stays at or below roughly
   `#646464` (sRGB 100), and 3:1 large-text/UI while it stays at or below roughly `#868686`
   (sRGB 134). If the ground is user-supplied, third-party or an iframe, you cannot clamp it
   — go straight to the mandatory scrim (anti-pattern 12).

4. **Emit the token layer** via `ui-morphism-core:token-emit` under the
   `--um-glassmorphism-*` grammar: all five fill rungs, all five blur steps, saturate,
   border and border-strong, the five radii, three shadows plus both insets, the noise pair,
   ink and ink-muted, accent, focus, target, and **an opaque `--glass-solid-*` mirror for
   every rung**. Polarity is inverted for this style: dark values on bare `:root`, the light
   override guarded as `@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) }`,
   and the complete light list duplicated under `:root[data-theme="light"]`. Both lists are
   complete — a partial override is what produces dark text on a dark scrim.
   `assets/tokens.css` is that sheet already written out, `assets/tokens.theme.css` is the
   Tailwind v4 mirror, and `assets/tokens.um-aliases.css` is the `--um-glassmorphism-*`
   bridge. Copy them; do not retype the values.

5. **Rewrite the targeted components to the ladder.** Opaque baseline first — background,
   1px border, inner top highlight, shadow, radius. Then the `@supports ((backdrop-filter:
   blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` block containing the translucent
   fill, `-webkit-backdrop-filter` and `backdrop-filter` in that order. Never the other way
   round. Components, anatomy and the `GlassInput` exception are in `references/recipes.md` §6.

6. **Insert exactly one grain filter per page** — the inline `feTurbulence` at
   `baseFrequency 0.8`, `numOctaves 4`, greyed with `feColorMatrix saturate 0` — and wire the
   overlay layer to `--glass-noise-opacity`. One SVG, reused by every surface. Never a raster
   asset; the asset-weight budget for this style is 0 KB.

7. **Emit the accessibility layer** as `@layer glass`, covering all four queries:
   `prefers-reduced-transparency: reduce`, `prefers-contrast: more`, `forced-colors: active`
   and `prefers-reduced-motion: reduce`. Every one of them must set `backdrop-filter: none`
   and `-webkit-backdrop-filter: none`. Add the `[data-transparency="reduced"]` attribute
   hook and a settings-toggle stub as well — **Safari does not implement
   `prefers-reduced-transparency`**, and it is the platform whose users are most likely to
   have Reduce Transparency on, so the media query alone is not coverage. Add a `@media print`
   block that renders every glass surface opaque. `assets/glass.layer.css` is this whole
   layer already written — the ground, the ground-clamping modifier, the grain rule, the
   two-tone focus recipe, `scroll-margin-top`, all four queries, the `[data-transparency]`
   hook and the print block. Emit it and rewrite only the selector list; reconstructing it
   from memory is how one of the four queries goes missing.

8. **Wire focus and scroll.** Two-tone ring on every interactive glass surface: `outline: 2px
   solid #fff; outline-offset: 2px` plus `box-shadow: 0 0 0 5px rgba(0,0,0,0.55)`. One of the
   two always has contrast against an unknowable backdrop. Then set `scroll-margin-top` equal
   to the sticky glass header's height on every focusable target — a keyboard-focused element
   sitting half-visible under a translucent bar is an SC 2.4.11 failure, not a cosmetic nit.

9. **Run the style scanner:**
   `node ${CLAUDE_SKILL_DIR}/scripts/glass-scan.mjs <emitted paths> --json`
   It checks the `-webkit-` twin, the `@supports` wrapper, animated blur, `will-change`
   misuse, raster grain, live blur inside `forced-colors`, the scroll-pinned blur cap, the
   four escape hatches, the print sheet, the transparency toggle, and the ancestor
   backdrop-root hazards — `opacity < 1`, `filter`, `mask`, `clip-path`, `mix-blend-mode`,
   `will-change` — which is the scan `MARKETPLACE.md` §7.3 assigns to this style. Fix every
   error before continuing. It computes no contrast; that is step 10.

10. **Run `ui-morphism-core:a11y-validate`** for all nine universal checks, and specifically
    for composited contrast at the darkest **and** brightest ground pixel. Body ≥ 4.5:1,
    large/UI ≥ 3:1, unrounded — 2.999:1 fails. `a11yFloor: AAA` raises that to 7:1 / 4.5:1.
    On failure, escalate in this order and recompute after each step, recording what you did:
    (a) clamp the ground with the darkening layer; (b) nest the text in a scrim at
    `rgba(9,9,14,0.56)`; (c) raise the panel fill to ≥ 0.56 and tell the user plainly that
    the surface is now a tinted card with a blur, not glass. Never ship a failing pair.

11. **Count the budget and downgrade if it is blown.** Simultaneously visible glass surfaces
    ≤ 3 mobile / ≤ 5 desktop; blurred viewport area ≤ 30% mobile / ≤ 50% desktop. If either
    is exceeded, drop rungs — lower blur before lower fill, since fill is the legibility
    lever — and record the downgrade.

12. **Write `GLASS-AUDIT.md`** using the `ui-morphism-core` report template, with the budget
    rows named in "What goes in the report" below.

## Outputs

- `tokens/glass.tokens.css`, and for Tailwind `tokens/glass.theme.css` (`@theme`, never
  nested in an at-rule); `tokens.ts` or a Swift `enum` where the stack calls for it
- `components/glass/*` — `GlassSurface`, `GlassNav`, `GlassCard`, `GlassPopover`,
  `GlassModal`, `GlassButton`, `GlassInput`, each with the `@supports` fallback baked in
- `styles/glass.layer.css` as `@layer glass` — ground, grain filter, focus recipe, all four
  accessibility blocks, the print block and the `[data-transparency]` hook
- `styles/glass-ground.css` (or `glass-ground.svg`) — the mesh-gradient backdrop and its
  clamping layer
- `reports/GLASS-AUDIT.md`

## Intensity knobs

Ranges, defaults and notes are doc §13's intensity table verbatim. Default intensity is 50.

| Knob | Min | Max | Default (intensity 50) | Note |
|---|---|---|---|---|
| `fillAlpha` | 0.04 | 0.30 light tone / 0.72 dark tone | 0.10–0.14 | The primary legibility lever. Above 0.30 it stops being glass. |
| `blurRadius` | 4px | 48px | 12–20px | Hard-capped at 20px on scroll-pinned surfaces and 24px on full-viewport overlays regardless of intensity. |
| `saturation` | 100% | 200% | 160% | Below 130% the material reads grey and dead. |
| `borderAlpha` | 0.10 | 0.45 | 0.16–0.26 | Never allowed to reach 0; the border is structural. |
| `grainOpacity` | 0.00 | 0.06 | 0.035 | Above 0.06 it reads as compression artefacts. `tone: dark` — the ink tint used on a light ground — defaults to 0.028 instead. |

The defaults are ranges because each knob's default is **per elevation rung**, from the
ladder in `references/tokens.md` §14. Rung 1 (card) is 0.10 / 12px / 0.16; rung 2 (nav) is
0.14 / 20px / 0.22. The "12–20px" in the table is rungs 1 through 2, which is where the
common cases sit.

### The curve

Two linear segments per knob, anchored so intensity 50 lands exactly on the rung default:

```
knob(i) = i <= 50 ? MIN + (DEFAULT - MIN) * (i / 50)
                  : DEFAULT + (MAX - DEFAULT) * ((i - 50) / 50)
```

Every knob is monotone increasing across 0→100, and "more intensity" always means "more of
this style". Worked anchors for rung 1 (card), light tone:

| Intensity | fillAlpha | blurRadius | saturation | borderAlpha | grainOpacity |
|---|---|---|---|---|---|
| 0 | *opaque rung — see below* | — | — | 0.10 | 0.00 |
| 25 | 0.070 | 8px | 130% | 0.130 | 0.018 |
| 50 | 0.100 | 12px | 160% | 0.160 | 0.035 |
| 75 | 0.200 | 30px | 180% | 0.305 | 0.048 |
| 100 | 0.300 | 48px | 200% | 0.450 | 0.060 |

**Intensity 0 is a discrete, usable rung, not "nothing".** It emits the opaque mirror:
`--glass-solid-*` fill, the 1px border, the inner top highlight, the shadow and the radius,
with **no `@supports` branch, no `backdrop-filter` and no grain**. That is a bordered opaque
tinted card — recognisable as plain, fully accessible, and the same surface every browser
gets from the fallback path anyway. The knob minima in the table are the values at intensity
1, not at 0.

**Intensity 100 still has to pass the floor.** If the composited contrast check fails at 100,
clamp — via the step-10 escalation ladder — and record the clamp in the audit. Never ship a
failing surface to satisfy a number.

### Hard clamps — independent of intensity, never negotiable

| Clamp | Value | Source |
|---|---|---|
| Text scrim alpha | ≥ **0.56** whenever body text sits on glass over an unclamped ground | §7: the crossing is α = 0.55734; at 0.555 white text reaches only 4.46:1 |
| `fillAlpha` floor | ≥ 0.04 | §13 knob table |
| `fillAlpha` ceiling | ≤ 0.30 light tone, ≤ 0.72 dark tone | §13 knob table |
| `borderAlpha` floor | ≥ 0.10, never 0 | §13: the border is structural |
| `blurRadius` on any `position: sticky` or `fixed` surface | ≤ 20px | §8 budget |
| `blurRadius` on a full-viewport overlay | ≤ 24px, paired with a ≥ 0.45 alpha scrim | §8 budget |
| `blurRadius` ceiling | ≤ 48px | §13 knob table |
| `grainOpacity` ceiling | ≤ 0.06 | §13 knob table |
| Hit target | ≥ 44px (`--glass-target-min`), never below the 24×24 SC 2.5.8 floor | §4, §7 |
| Simultaneous glass surfaces | ≤ 3 mobile, ≤ 5 desktop | §8 budget |
| Blurred viewport area | ≤ 30% mobile, ≤ 50% desktop | §8 budget |
| Stacked translucent layers | ≤ 3 | §13 anti-pattern 5 |

### Context caps — these override intensity

| Context | Cap |
|---|---|
| `perfTarget: low-end` | `blurRadius → 0`, opaque mirror shipped, `data-glass="off"`. Gate on `navigator.hardwareConcurrency <= 4`, `navigator.deviceMemory <= 4` or `navigator.connection.saveData` (§8 fallback 5). |
| `perfTarget: mobile` | Surfaces ≤ 3, blurred area ≤ 30%, and every pinned surface at the 20px blur cap. |
| Ground not controlled by the project | Mandatory opaque scrim at ≥ 0.56 between backdrop and pane. The result is a tinted card; say so. |
| `a11yFloor: AAA` | 7:1 body / 4.5:1 large. In practice this forces the text scrim — §7 calls AAA effectively unreachable with glass without one. |
| `scope` targeting content, forms or tables | Not a cap — a refusal. See `references/anti-patterns.md` entry 4. |
| Any of the four accessibility queries active | The intensity-0 opaque path, at runtime. |

**Deviation, stated.** `MARKETPLACE.md` §7.2 rule 5 gives sibling styles a numeric intensity
cap (`liquid-glass` and `spatial-ui` cap at 45 on an arbitrary backdrop). Doc 03 names no such
number for glassmorphism, so the caps above are expressed at the knob level, using only
numbers the doc states. If core's cap mechanism requires a scalar, `perfTarget: low-end` maps
to 0 and an uncontrolled ground maps to whatever intensity leaves `fillAlpha` at the 0.56
scrim floor — but that derivation is not in the doc and should be recorded as such.

## What goes in the report

Core owns the template and the section order. These are the rows this style supplies:

- **Contrast table** — one row per text token, with the ratio computed against the composite
  at the darkest ground pixel and again at the brightest, three decimal places, unrounded.
  Both numbers, always. A single number for a glass surface is a wrong number.
- **Budgets** — glass surfaces visible per route; estimated blurred viewport percentage;
  maximum blur radius on any scroll-pinned surface; stacked-layer depth; CSS bytes; asset
  weight, which must be 0 KB for the grain.
- **Fallback coverage matrix** — for each emitted surface: `@supports` fallback,
  `prefers-reduced-transparency`, `prefers-contrast`, `forced-colors`, `prefers-reduced-motion`,
  print, and the `[data-transparency]` hook.
- **Backdrop-root hazards** — every ancestor found by `glass-scan.mjs`, with the selector and
  the property, and whether it was fixed or reported.
- **Corrections** — every token the skill changed on its own, with before, after and reason.
- **Refusals** — every anti-pattern requested and declined, with the alternative offered.
- **Manual TODOs** — what could not be verified statically. For this style that always
  includes: screenshot the composited pixels at three scroll positions and sample them, and
  verify the focus ring against both extremes of the ground. Neither is computable from CSS
  text, and saying so is part of the report.

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`. The non-negotiable ones:

- [ ] Every `backdrop-filter` has a matching `-webkit-backdrop-filter` on the preceding line
- [ ] Every translucent fill lives inside the `@supports` block, with an opaque declaration
      outside it
- [ ] Worst-case composited contrast computed for every text token against **both** the
      darkest and brightest ground pixel; body ≥ 4.5:1, large/UI ≥ 3:1, unrounded
- [ ] Every glass surface carries a ≥ 1px border, and where it delimits a control that border
      clears 3:1 against the composite
- [ ] Two-tone focus ring present, verified against both extremes of the ground
- [ ] All four accessibility blocks present, each removing `backdrop-filter`
- [ ] No `opacity < 1`, `filter`, `mask`, `clip-path`, `mix-blend-mode` or `will-change` on any
      ancestor of a glass element
- [ ] No `transition` or `animation` targets `backdrop-filter`, `filter` or `border-radius`
- [ ] Glass surfaces ≤ 3 / ≤ 5, blurred area ≤ 30% / ≤ 50%
- [ ] Every interactive target ≥ 44px
- [ ] `scroll-margin-top` set on focusables under any sticky glass bar
- [ ] Grain is the inline SVG filter, not a raster asset
- [ ] Print stylesheet renders all glass surfaces opaque
- [ ] `intensity: 0` still produces a bordered, opaque, accessible surface

## Refuse to generate

Read `references/anti-patterns.md` in full — it carries the detection signal and the
alternative for each of the thirteen. Core owns the refusal mechanism: refuse, explain, offer
the alternative, record it. The highest-frequency ones:

- Body text directly on a fill below 0.30 alpha with no scrim and no clamped ground — this is
  the 14.6:1-to-1.57:1 case, and it is the reason this plugin exists
- A translucent fill with no `@supports` opaque fallback, or `backdrop-filter` with no
  `-webkit-` twin
- Glass on `<table>`, `<input>`, `<textarea>`, `<select>` or a long-form article container
- Four or more stacked translucent layers
- `transition: backdrop-filter` on hover or scroll, and blur-interpolating keyframes
- `opacity < 1` on a glass element or an ancestor to express disabled state
- A raster noise asset where the SVG filter belongs
- Any glass left alive inside a `forced-colors: active` block
- Glass over a background the project does not control, without a mandatory opaque scrim
- `will-change: backdrop-filter` as a performance fix
