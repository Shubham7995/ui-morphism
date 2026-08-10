# Glassmorphism audit checklist

Source of truth: `docs/03-glassmorphism.md` §13 "Validation checklist the skill must self-run
before reporting done", extended with §7's pass/fail list and §8's budgets. Run in this order.

Each item is tagged with who runs it:

- **[core]** — `ui-morphism-core:a11y-validate`. One implementation, ten callers. Never
  reimplement any of these, and in particular never write a contrast function here.
- **[scan]** — `../../apply/scripts/glass-scan.mjs`. Mechanical, static, style-specific.
- **[read]** — a human or model judgement over the source. Not automatable.
- **[eye]** — requires a rendered browser. Report as a manual TODO with the exact procedure,
  never as a pass.

---

## A. The §13 self-run checklist

| # | Check | Who | Threshold |
|---|---|---|---|
| A1 | Every `backdrop-filter` declaration has a matching `-webkit-backdrop-filter` on the preceding line | [scan] | exact |
| A2 | Every translucent fill lives inside `@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`, with an opaque declaration outside it | [scan] | exact |
| A3 | Worst-case composited contrast computed for each text token against **both** the darkest and brightest ground pixel | [core] | body ≥ 4.5:1, large/UI ≥ 3:1; ≥ 7:1 / 4.5:1 at `a11yFloor: AAA`; unrounded, so 2.999:1 fails |
| A4 | Every glass surface carries a border ≥ 1px, and where it delimits a control the border clears 3:1 against the composite | [scan] presence, [core] ratio | 3:1 |
| A5 | Two-tone focus ring present and verified against both extremes of the ground | [core] presence, [eye] verification | outline ≥ 2px + dark halo |
| A6 | `prefers-reduced-transparency`, `prefers-contrast: more`, `forced-colors: active` and `prefers-reduced-motion` blocks all present, each removing `backdrop-filter` | [scan] | all four |
| A7 | `forced-colors` block uses only system colour keywords and removes shadows | [core] | exact |
| A8 | No `opacity`, `filter`, `mask`, `clip-path` or `mix-blend-mode` on any ancestor of a glass element | [scan] candidates, [read] ancestry | zero confirmed |
| A9 | No `transition` or `animation` targets `backdrop-filter`, `filter` or `border-radius` | [scan] | zero |
| A10 | Glass surface count ≤ 3 (mobile / low-end) or ≤ 5 (desktop) per viewport; blurred area ≤ 30% / 50% | [scan] count, [read] per-route composition | budget |
| A11 | Every interactive target ≥ `--glass-target-min` (44px), never below the 24×24 SC 2.5.8 floor | [core] | 44px / 24px floor |
| A12 | `scroll-margin-top` set on focusable elements under any `position: sticky` glass bar | [read] | equal to header height |
| A13 | Grain is an inline SVG filter, not a raster asset | [scan] | 0 KB |
| A14 | Print stylesheet renders all glass surfaces opaque | [scan] | present |

## B. The §7 accessibility list

| # | Check | Who | Note |
|---|---|---|---|
| B1 | Body text ≥ 4.5:1 against the **composited** surface at the brightest and darkest scroll positions | [core] | The single most important row in the report |
| B2 | Large text and icons ≥ 3:1 under the same worst case | [core] | ≥ 24px, or ≥ 18.66px bold |
| B3 | Panel border ≥ 3:1 where it delimits an interactive control (1.4.11) | [core] | A `rgba(255,255,255,0.22)` hairline over a light composite is around 1.2:1 and fails outright |
| B4 | Focus ring visible on both the lightest and darkest possible backdrop | [eye] | Screenshot both extremes |
| B5 | No focusable element obscured by a sticky glass bar (2.4.11) | [read] | Partly visible through the bar does **not** satisfy the criterion |
| B6 | All interactive targets ≥ 24×24 CSS px (2.5.8) | [core] | |
| B7 | Every interactive control sizes from `--glass-target-min` (44px) | [core] | Check chips, pills and icon buttons first; measure the border box, not the blurred bleed |
| B8 | `@supports` fallback renders a fully opaque, readable surface | [scan] + [read] | |
| B9 | `prefers-reduced-transparency: reduce` → opacity ≥ 0.95 or fully solid, blur removed, grain removed | [scan] | |
| B10 | `prefers-contrast: more` → solid surface, border at text colour | [scan] + [read] | |
| B11 | `forced-colors: active` → `backdrop-filter: none`, system colours, visible border, no shadows | [scan] + [core] | Forced colors overrides colour but **not** `backdrop-filter` |
| B12 | `prefers-reduced-motion: reduce` → no transform or parallax, durations ≤ 1ms, no shimmer, `background-attachment: scroll` | [scan] + [read] | Zero the durations, do not delete the transitions |
| B13 | In-app transparency toggle exists | [scan] | Safari does not implement the media query, and it is the platform whose users most often have Reduce Transparency on |
| B14 | No information conveyed by transparency, blur or shadow alone | [core] | |
| B15 | Text spacing at 1.5 line-height / 0.12em letter-spacing does not clip (1.4.12) | [eye] | Glass panels are often sized tightly to their text; use `min-height`, never fixed `height` |
| B16 | Layout at 200% zoom and 320 CSS px width still readable (1.4.10) | [eye] | The blur cost scales with painted area, so this is a performance check too |
| B17 | VoiceOver + NVDA pass with visual order matching DOM order | [eye] | Glass panels are usually positioned, so visual and DOM order drift |
| B18 | Stacked glass modals use `<dialog>` or `aria-modal="true"` with a focus trap and an inert background | [read] | Otherwise the content visible through the glass stays reachable |
| B19 | Grain `<span>` and gradient-border pseudo-element are `aria-hidden` and take no pointer events | [read] | |

## C. Performance budgets (§8)

| # | Budget | Limit | Who |
|---|---|---|---|
| C1 | Simultaneously visible glass surfaces | ≤ 3 mobile, ≤ 5 desktop | [scan] + [read] |
| C2 | Total blurred area in viewport | ≤ 30% mobile, ≤ 50% desktop | [read] |
| C3 | Blur radius on any scroll-pinned surface | ≤ 20px | [scan] |
| C4 | Blur radius on a full-viewport overlay | ≤ 24px, paired with a ≥ 0.45 alpha scrim | [read] |
| C5 | Frame budget on a mid-tier Android (Pixel 6a class, 4× CPU throttle) | ≥ 55 fps during a 1000px scroll | [eye] |
| C6 | Extra INP attributable to glass hover states | ≤ 8ms | [eye] |
| C7 | Asset weight for the grain | 0 KB — inline SVG filter, roughly 220 bytes gzipped | [scan] |
| C8 | Stacked translucent layers | ≤ 3 | [read] |

## D. Style-fidelity checks

These are not compliance findings. Report them as Notes.

| # | Check | Who |
|---|---|---|
| D1 | Every `blur()` paired with `saturate(140–180%)` — blur alone reads as a rendering bug, not as glass | [scan] |
| D2 | Blur radius scales with elevation (8 / 12 / 20 / 28 / 40px for rungs 0–4), not one value everywhere | [read] |
| D3 | Fill alpha inside the documented band: 0.06–0.24 on dark, 0.28–0.60 on light | [read] |
| D4 | Grain in the 0.02–0.05 band, at `baseFrequency 0.8` / `numOctaves 4` — not skeuomorphism's 0.9/2 or maximalism's 0.8/3 | [read] |
| D5 | Corner radius ≥ 8px, so the 1px border reads as an edge rather than a stroke | [read] |
| D6 | A vivid, structured ground exists. Glass over flat `#111` is invisible | [read] |
| D7 | Content rendered at full opacity, never faded to "match" the glass | [read] |
| D8 | Glass occupies exactly one layer of the z-stack — chrome or overlays, not both, and never content | [read] |

## E. Things that are refusals, not findings

If the audit turns up any of these, the recommendation is to remove the glass, not to tune it.
Full list with alternatives in `../../apply/references/anti-patterns.md`.

- Glass on `<table>`, `<input>`, `<textarea>`, `<select>` or long-form article containers
- Glass over a background the project does not control, with no opaque scrim between them
- Regulated surfaces — government, healthcare, banking core flows, education, insurance
  claims, utilities. Section 508, EN 301 549 and the EAA, enforceable in the EU since June
  2025. The audit risk outweighs the aesthetic
- Four or more stacked translucent layers, which means the hierarchy is the problem
- Any state, error, selection or category encoded only in transparency, blur or shadow

## F. The two manual TODOs that always appear

Neither is computable from CSS text. Report them with this exact procedure rather than
marking them pass.

1. **Screenshot the composited pixels at three scroll positions and sample them.** Pick the
   position where the brightest part of the ground sits behind body text; that is the number
   that matters, and it is the one no static tool can produce.
2. **Verify the two-tone focus ring against both extremes of the ground.** The white outline
   survives a dark backdrop, the dark halo survives a light one. Confirm that at least one of
   them is visible in both screenshots.
