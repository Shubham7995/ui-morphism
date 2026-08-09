# ui-morphism — the ten style docs

Ten UI style languages, documented to the same fourteen-section template, at a depth you can build from: token tables, working CSS, React / Tailwind / SwiftUI recipes, measured contrast ratios, performance budgets, and a sourced timeline for each. The ten style docs run about 12,600 lines and carry 229 numbered references between them; the three top-level companion docs add another 1,320 lines. Every doc's frontmatter reads `last_researched: 2026-08-08`, and every factual claim in the set is pinned to that date.

To refresh the research: re-verify the numbered sources in each doc's **§14 References**, update the moving facts first (Baseline dates, library release dates and star counts, telemetry percentages, WCAG criteria status, platform version numbers), then bump `last_researched` in the frontmatter of every doc you touched and re-run `./check-links.sh`. Facts that move fastest are flagged with explicit dates in the prose, so a date search is a reasonable first pass. Recount references with:

```
awk '/^## 14\. References/{f=1;next} /^## /{f=0} f && /^[0-9]+\. /' 0[1-9]-*.md 10-*.md | wc -l
```

This file is also the canonical index for the set: the filename map, the token convention, and the structural contract every doc has to satisfy all live below, starting at [The ten docs](#the-ten-docs).

---

## The Ten Styles

| # | Style | What it is | Origin | Status 2026 | A11y risk | Perf cost | Difficulty | Doc |
|---|---|---|---|---|---|---|---|---|
| 01 | **Skeuomorphism** | Borrowed physical texture and lighting so a control announces its function; one light source, four shadow layers | 1984 | revival | Medium | Medium | High | [01-skeuomorphism.md](./01-skeuomorphism.md) |
| 02 | **Neumorphism** | Same-hue surface extruded by two opposing shadows; calm moulded plastic, structurally unable to reach 3:1 | 2019 | accent-only | High | Medium | Medium | [02-neumorphism.md](./02-neumorphism.md) |
| 03 | **Glassmorphism** | Semi-transparent panel that blurs and re-saturates its backdrop, edged with a hairline border; depth without weight | 2020 | mainstream | High | Medium | Medium | [03-glassmorphism.md](./03-glassmorphism.md) |
| 04 | **Claymorphism** | Fat radii, pastel fill, an inflated dome of inset light and shade floating above the page | 2021 | niche | Medium | Medium | Medium | [04-claymorphism.md](./04-claymorphism.md) |
| 05 | **Minimalism** | Subtraction with compensation: delete the box and shadow, buy back structure with whitespace, type scale, one accent | 1960 | mainstream | Medium | Low | Medium | [05-minimalism.md](./05-minimalism.md) |
| 06 | **Maximalism** | Three or more overlapping loud planes — clashing colour, several typefaces, collage ornament — held by a budget rule | 1995 | mainstream | High | High | High | [06-maximalism.md](./06-maximalism.md) |
| 07 | **Brutalism & Neubrutalism** | Hard 2–4px borders and zero-blur offset shadows on flat saturated fills; raw anti-design and its commercial descendant | 2014 | mainstream | Medium | Low | Low | [07-brutalism.md](./07-brutalism.md) |
| 08 | **Liquid Glass** | Apple's system material: refracts the backdrop through a lensed edge, tracks speculars, adapts tint — glassmorphism plus displacement | 2025 | dominant | High | High | High | [08-liquid-glass.md](./08-liquid-glass.md) |
| 09 | **Bento Grid** | Size-as-hierarchy inside a locked gutter: variable tile spans, invariant gap, one shared surface treatment | 2022 | mainstream | Medium | Low | Low | [09-bento-grid.md](./09-bento-grid.md) |
| 10 | **Spatial UI** | Panels at measured depths, counter-scaled so angular size holds constant; depth replaces the shadow elevation ladder | 2023 | emerging | High | Medium | High | [10-spatial-ui.md](./10-spatial-ui.md) |

### What the ratings mean

All four ratings are the verbatim frontmatter values (`origin_year`, `status_2026`, `a11y_risk`, `perf_cost`, `difficulty`). They are a three-step scale, not a score, and they are relative to the other nine styles in this set — not to the web at large.

- **A11y risk** — how much work stands between a faithful implementation and a conformant one. *High* does not mean unusable; it means the default rendering fails something measurable and the doc's §7 tells you which token has to change. Neumorphism is high because same-hue pairs measure 1.23–1.59:1 at every blur and distance; glassmorphism is high because one panel swings 9.3× in contrast depending on what is behind it; liquid-glass and spatial-ui are high because both have a hard fill-alpha floor below which no foreground colour works.
- **Perf cost** — paint and GPU cost per surface, at the budgets each doc's §8 sets. *Low* means the style costs about what a `background-color` costs; *high* means per-frame backdrop sampling or large font and image payloads, with a hard cap on concurrent surfaces per route.
- **Difficulty** — implementation and design skill, together. *Low* means a border, an offset and a fill. *High* means several layers that must agree on one light source, a camera, or a displacement map.
- **Status 2026** — where the style actually sits in shipped products, not in trend roundups. `revival` and `niche` are small by measurement; `accent-only` means alive as one component class inside another style's shell, dead as a whole-interface language; `dominant` means default-on rather than chosen.

Sentence-level reasoning behind every rating is in [00-comparison-matrix.md](./00-comparison-matrix.md) §2 Cost, with the product-category fit in §3.

---

## Pick a style

Each line names the constraint that decides it. If none of these describe your product, read §3 Fit in the comparison matrix and each candidate's §9 When To Use / When Not To.

1. **Automotive or in-cabin HMI** → **01 skeuomorphism** → avoid **05 minimalism**. Euro NCAP's protocols, effective January 2026, penalise vehicles that bury horn, indicators, hazards, wipers, gear selection, door locks or SOS in a touchscreen; five stars now effectively require physical controls, and the controls that stay on screen have to read as hardware — raised, bevelled, high-contrast.
2. **Cross-browser web shipping before 2027-03-16** → **09 bento-grid** or **05 minimalism** → avoid **03 glassmorphism** or **08 liquid-glass** as load-bearing structure. `backdrop-filter` is Baseline *newly available* (2024-09-16); *widely available* is projected for **2027-03-16**, so every glass surface still needs an `@supports` query with an opaque fallback declared outside the block.
3. **Anything with a legal accessibility obligation** → **05 minimalism** or **07 brutalism** → avoid **02 neumorphism**. `forced-colors` deletes `box-shadow`, and in neumorphism `box-shadow` is 100% of the visual structure, including any box-shadow-based focus ring. Brutalism survives the same deletion only because the rule is "border *and* shadow, never shadow alone".
4. **Forms, data tables, admin dashboards, anything read for hours** → **05 minimalism** → avoid **02 neumorphism**, **06 maximalism**, and glass on the content plane. Glassmorphism's honest position is default for floating transient chrome, bad default for content; maximalism's own §9 gates it out of checkout, forms, error states, charts and tables.
5. **UI over user-uploaded imagery or third-party iframes** → opaque surfaces (**05**, **09**) → avoid **03 glassmorphism**. An identical `rgba(255,255,255,0.12)` panel measures 14.6:1 over `#0B0B12` and 1.57:1 over `#7DD3FC` — a 9.3× swing on one component, driven by a backdrop you do not control.
6. **Low-end Android, or a tight paint budget** → **07 brutalism** → avoid **08 liquid-glass**. `box-shadow` paint cost scales with the square of the blur radius and brutalism's blur is exactly 0, so a hard shadow costs about what a fill costs; the budget is ≤ 8 KB CSS and 0 KB JS. Liquid Glass caps at 3 glass surfaces per route and 25% of a 1440×900 viewport before it stops being affordable.
7. **A native Apple app on iOS 26 / macOS Tahoe 26 or later** → **08 liquid-glass** → avoid hand-rolling **03 glassmorphism** on top of it. Recompiling against the SDK opts you in by default and the opt-out is on a removal schedule; the OS renders the material, which is why maintenance is Medium on Apple platforms and High on the web, where no interoperable primitive exists.
8. **Native XR on Android** → **10 spatial-ui**, pinning an explicit alpha version → avoid treating the API surface as stable. `androidx.xr.compose` was at `1.0.0-alpha16` on 2026-07-15, with breaking changes in July 2026 and no stable release; unpinned code rots between builds.
9. **A flat-screen page that needs a sense of dimension** → **10 spatial-ui**, flat-screen dialect → avoid anything that depends on WebXR. Interop 2026's nineteen focus areas include scroll-driven animations, view transitions and anchor positioning — the primitives the flat-screen dialect actually needs — and WebXR is in neither the focus areas nor the four investigation areas.
10. **A feature section, spec overview or marketing grid** → **09 bento-grid** → avoid `grid-auto-flow: dense`. `reading-flow` shipped in Chrome 137 only and is not Baseline, so dense packing detaches visual order from DOM order and breaks SC 1.3.2 Meaningful Sequence and 2.4.3 Focus Order everywhere else.
11. **A kids' app, edtech product or gamified tracker** → **04 claymorphism** → avoid **02 neumorphism**. Clay gives the element its own colour and floats it above the ground, which is precisely what restores the contrast a same-hue extrusion loses. Both still need a non-shadow boundary, because `forced-colors` deletes `box-shadow` and clay's boundaries *are* the shadow.
12. **A brand or campaign page that must not look AI-generated** → **07 brutalism** for the cheap version, **06 maximalism** for the expensive one → avoid either inside the app shell. Brutalism is the lowest-cost way to look non-generic (Low difficulty, Low perf, Low maintenance). Maximalism's cost is almost entirely typography and imagery: cap font payload at 180 KB and emit no raster noise or pattern assets.

---

## How to read a style doc

Every doc carries the same fourteen sections in the same order (the exact heading strings are in [Required structure](#required-structure) below). This is the *which section answers which question* view — open the one that matches what you are trying to do rather than reading front to back.

| Open § | When you are asking |
|---|---|
| **1. Essence** | "Is this even the style I mean?" One paragraph, plus the single defining move that separates it from its nearest neighbour. |
| **2. Origin & Timeline** | "When did this start, and is it dead?" Dated events with sources — what to cite when someone challenges the style's currency. |
| **3. Visual DNA** | "What does it actually look like, numerically?" Radii, shadow language, blur ranges, palette temperament — the values you match against a reference screenshot. |
| **4. Anatomy & Design Tokens** | "What do I put in the token file?" The normative token table and the matching CSS block, light and dark. Start here for any new implementation. |
| **5. Implementation Recipes** | "How do I write the component?" React, Tailwind and SwiftUI recipes that consume the §4 tokens rather than redeclaring them. |
| **6. Interaction & Motion** | "It renders — now what happens on hover, press, focus and `prefers-reduced-motion`?" Durations, easings, and what must stop moving. |
| **7. Accessibility** | "Will this pass review?" Measured contrast ratios, `forced-colors` behaviour, focus-ring strategy, and the WCAG 2.2 criteria this style breaks most often. Read before you build, not after. |
| **8. Performance** | "How many of these can I put on one page?" Per-surface cost, hard caps, payload budgets, and the specific thing that gets expensive first. |
| **9. When To Use / When Not To** | "Should we adopt this at all?" Product categories on both sides of the line, and the conditions that flip the answer. |
| **10. Do & Don't** | "What do I check in code review?" Paired rules, short enough to use as a checklist. |
| **11. In The Wild (2024-2026)** | "Who actually ships this?" Named products and dated examples — the section to quote to a stakeholder. |
| **12. Hybrids & Neighbors** | "Can I combine this with X?" and "How is this different from Y?" Every link out to another style doc lives here, resolved against the filename map below. |
| **13. Plugin Spec (draft)** | "How does this become a Claude Code skill?" Inputs, intensity knobs, validation gates. Pairs with [MARKETPLACE.md](./MARKETPLACE.md). |
| **14. References** | "Where did that number come from?" Numbered sources with publisher and date, marked primary or secondary. |

---

## The other three top-level docs

- **[00-comparison-matrix.md](./00-comparison-matrix.md)** — all ten styles flattened into comparable rows: visual signature, cost, product fit, trajectory to 2031, a full pairwise combination grid, the family tree, and the shared token convention. Use it to choose between styles or to check whether two of them can coexist on one page.
- **[MARKETPLACE.md](./MARKETPLACE.md)** — the plan for turning each doc's §13 Plugin Spec into a shipping Claude Code skill, distributed as one marketplace of eleven plugins (the ten styles plus a shared `ui-morphism-core`): repository layout, `marketplace.json`, `plugin.json`, a complete `SKILL.md`, and the shared accessibility validator.
- **[GLOSSARY.md](./GLOSSARY.md)** — every technical term used across the set, alphabetical, each with a definition and the list of docs that depend on it. Use it when a doc assumes you know what lensing, vibrancy, `forced-colors` or Baseline means.

---

# Canonical index

This section is the **single source of truth** for two things the ten style docs kept getting wrong independently: which file each style lives in, and what its design tokens are called. Every doc's §12 "Hybrids & Neighbors" section now links against the table below. Nothing else in the set may invent its own numbering.

## The ten docs

Ten files. No more, no fewer. The `name` column is the value of the doc's frontmatter `name`, which is also its token namespace segment (see below).

| # | File | `name` | Title | Aliases folded into this doc |
|---|---|---|---|---|
| 01 | [./01-skeuomorphism.md](./01-skeuomorphism.md) | `skeuomorphism` | Skeuomorphism | realism UI, material realism, neo-skeuomorphism, digital materiality, photorealistic UI |
| 02 | [./02-neumorphism.md](./02-neumorphism.md) | `neumorphism` | Neumorphism | neomorphism, soft UI, new skeuomorphism, extruded UI, embossed UI, clean neumorphism |
| 03 | [./03-glassmorphism.md](./03-glassmorphism.md) | `glassmorphism` | Glassmorphism | frosted glass UI, backdrop-blur UI, Acrylic, Aero Glass, translucent material |
| 04 | [./04-claymorphism.md](./04-claymorphism.md) | `claymorphism` | Claymorphism | clay UI, soft 3D UI, puffy UI, inflated UI, play-doh UI, fluffy 3D |
| 05 | [./05-minimalism.md](./05-minimalism.md) | `minimalism` | Minimalism | **flat design, flat 2.0, semi-flat**, **Swiss style / International Typographic Style**, quiet UI, calm interface, content-first design |
| 06 | [./06-maximalism.md](./06-maximalism.md) | `maximalism` | Maximalism | dopamine design, more-is-more, anti-minimalism, collage UI |
| 07 | [./07-brutalism.md](./07-brutalism.md) | `brutalism` | Brutalism & Neubrutalism | neubrutalism, neo-brutalism, neobrutalism, anti-design, hard-shadow UI, sticker UI |
| 08 | [./08-liquid-glass.md](./08-liquid-glass.md) | `liquid-glass` | Liquid Glass | Apple Liquid Glass, iOS 26 glass, lensing glass, refractive glass, glassmorphism 2.0 |
| 09 | [./09-bento-grid.md](./09-bento-grid.md) | `bento-grid` | Bento Grid | bento box layout, bento UI, modular card grid, asymmetric tile grid |
| 10 | [./10-spatial-ui.md](./10-spatial-ui.md) | `spatial-ui` | Spatial UI | spatial computing UI, XR UI, depth UI, volumetric UI, z-depth UI |

### Styles that are discussed but have no file

These get named in prose across the set. **Do not link them.** A `](./NN-` link to any of these is a broken link, and the CI check below will fail on it.

| Style | Where it is covered |
|---|---|
| Flat design / flat 2.0 / semi-flat | Alias of **05 minimalism**; doc 01 §8 and §12 also describe it as the low-intensity floor of skeuomorphism |
| Swiss / International Typographic style | Alias of **05 minimalism** |
| Google Material Design | Described in prose in 01 §12, 02 §12, 05 §12 and 07 §12. No doc. |
| Aurora / mesh gradients | Described in prose in 01, 02, 03, 04, 06, 07, 08, 09, 10 §12 — it is the ground plane most of these styles want, not a style of its own. No doc. |
| Retro / Y2K / Frutiger Aero | Described in prose in 01 §12, 04 §12, 05 §12, 06 §12, 07 §12, 09 §12. No doc. |
| Retro terminal / CRT | Described in prose in 01 §12 as skeuomorphism of a specific object. No doc. |

### Historical filenames that never existed

Earlier drafts of these docs linked to files that were never on disk. If you find one of these strings anywhere in the set, it is a bug: `02-flat-design.md`, `04-neumorphism.md`, `05-claymorphism.md`, `05-neubrutalism.md`, `06-brutalism.md`, `06-flat-design.md`, `06-flat-material.md`, `06-material-design.md`, `06-neubrutalism.md`, `07-aurora-gradients.md`, `07-aurora-mesh-gradients.md`, `07-claymorphism.md`, `07-material-design.md`, `08-aurora-gradient.md`, `08-aurora-gradients.md`, `08-bento-grid.md`, `09-aurora-gradient.md`, `09-swiss-minimalism.md`, `09-y2k-frutiger-aero.md`, `10-bento-grid.md`, `10-liquid-glass.md`, `10-retro-terminal.md`, `10-retro-y2k.md`, `10-spatial-3d.md`, `10-swiss-minimalism.md`.

## Required structure

Every doc carries the same fourteen H2 headings, in this order, byte-identical:

```
## 1. Essence
## 2. Origin & Timeline
## 3. Visual DNA
## 4. Anatomy & Design Tokens
## 5. Implementation Recipes
## 6. Interaction & Motion
## 7. Accessibility
## 8. Performance
## 9. When To Use / When Not To
## 10. Do & Don't
## 11. In The Wild (2024-2026)
## 12. Hybrids & Neighbors
## 13. Plugin Spec (draft)
## 14. References
```

Note the hyphen in `(2024-2026)`. An en-dash there breaks any tooling that matches heading text exactly.

## Shared token convention

The normative name shape for tokens across the set:

```
--um-<style>-<group>-<variant>
```

- `--um-` — the ui-morphism namespace. One namespace for the whole set, so a host application's tokens can never collide with ours.
- `<style>` — the doc's frontmatter `name`, verbatim, no abbreviations: `skeuomorphism`, `neumorphism`, `glassmorphism`, `claymorphism`, `minimalism`, `maximalism`, `brutalism`, `liquid-glass`, `bento-grid`, `spatial-ui`.
- `<group>` — from the fixed vocabulary below, and only from it. Every doc uses the same word for the same concept.
- `<variant>` — optional step or role.

**Per-element locals are written with a leading underscore** — `--_travel`, `--_depth`, `--_z`. A local is a value a recipe sets on one element and reads back a line later, never a shared token, so it is exempt from the one-prefix rule; but it must never be a plain unprefixed name like `--travel`, because custom properties inherit, and a host application that happens to define `--travel` on an ancestor would silently feed the wrong value into the recipe. The underscore is what keeps a local local.

### Group vocabulary

| Group | Variants | Meaning |
|---|---|---|
| `bg` | — | The page ground behind everything |
| `surface` | `-1` … `-4` | Content planes, ascending |
| `ink` | `-muted`, `-inverse` | Text and foreground |
| `border` | `-strong` | `border` is decorative; `border-strong` is the ≥ 3:1 control boundary |
| `accent` | `-fg`, `-subtle` | The single accent, its foreground, its tinted ground |
| `danger` | — | The one semantic hue |
| `radius` | `-sm`, `-md`, `-lg`, `-pill` | |
| `shadow` | `-1` … `-5`, `-inset`, `-press` | |
| `elev` | `-0` … `-5` | Composite elevation, where a doc has one |
| `blur` | — | |
| `saturate` | — | |
| `noise` | `-opacity`, `-freq` | |
| `space` | `-1` … `-8` | |
| `font` | `-body`, `-display`, `-mono` | |
| `text` | `-xs` … `-3xl` | |
| `weight` | — | |
| `leading` | — | |
| `tracking` | — | |
| `dur` | `-fast`, `-base`, `-slow` | |
| `ease` | `-standard`, `-enter`, `-exit` | |
| `focus` | `-color`, `-width`, `-offset` | |
| `target` | `-min` | |

Examples: `--um-skeuomorphism-elev-1`, `--um-neumorphism-border-strong`, `--um-glassmorphism-blur-2`, `--um-liquid-glass-radius-pill`, `--um-bento-grid-space-4`, `--um-spatial-ui-elev-5`.

### Per-doc short prefixes

Each doc currently ships a short prefix rather than the full `--um-` form, because the short names are what the code samples read as. The mapping is mechanical and one-to-one — `--sk-elev-1` is `--um-skeuomorphism-elev-1`, `--glass-blur-2` is `--um-glassmorphism-blur-2`, and so on:

| Doc | Short prefix | Expands to |
|---|---|---|
| 01 skeuomorphism | `--sk-` | `--um-skeuomorphism-` |
| 02 neumorphism | `--nm-` | `--um-neumorphism-` |
| 03 glassmorphism | `--glass-` | `--um-glassmorphism-` |
| 04 claymorphism | `--clay-` | `--um-claymorphism-` |
| 05 minimalism | `--min-` | `--um-minimalism-` |
| 06 maximalism | `--max-` | `--um-maximalism-` |
| 07 brutalism | `--nb-` | `--um-brutalism-` |
| 08 liquid-glass | `--lg-` | `--um-liquid-glass-` |
| 09 bento-grid | `--bento-` | `--um-bento-grid-` |
| 10 spatial-ui | `--sp-` | `--um-spatial-ui-` |

Whichever form you emit, **one doc uses exactly one prefix**. That is rule 2 below.

### The four rules every doc follows

1. **The §4 token table and the §4 CSS block use identical names.** No unprefixed names in the table and prefixed names in the code.
2. **§5's React / Tailwind / SwiftUI recipes consume the §4 tokens — they do not declare a parallel set.** A recipe may supply inline fallbacks (`var(--nb-dur, 150ms)`), never redeclarations. Two prefixes inside one doc is a bug.
3. **Light values on bare `:root`; dark values duplicated under both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]`.** The guard is what lets an explicit toggle beat the OS preference in *both* directions, and the duplication is what makes the toggle actually change something. A `:root[data-theme="dark"] { color-scheme: dark; }` block that redefines no tokens is not an override. (Doc 03 is dark-first by design and mirrors the whole pattern: dark on bare `:root`, light guarded with `:not([data-theme="dark"])`, and a complete `:root[data-theme="light"]` block.)
4. **The Tailwind mirror maps group → v4 namespace mechanically** — `color` → `--color-um-<style>-<group>`, `radius` → `--radius-…`, `shadow` → `--shadow-…`, `ease` → `--ease-…`, `space` → `--spacing-…` — **and never nests `@theme` inside an at-rule.** Tailwind v4 only processes a top-level `@theme`. Put overrides in `@layer theme` as plain custom-property redeclarations. Reference registered theme keys by their generated utility name (`ease-glass`, `rounded-bento`), never with bracket syntax (`ease-[--ease-glass]` emits an invalid literal); if you must point at a variable, v4's syntax is parentheses: `ease-(--ease-glass)`.

## CI check

`./check-links.sh` runs ten checks — nine structural, plus a numeric one it shells out to — prints every offence in every category, and exits non-zero if any of them fail except the ninth, which is a warning. Checks 1, 3, 4, 8 and 10 read all fourteen markdown files; checks 2, 5, 6, 7 and 9 read the ten style docs. Checks 1, 3 and 4 get there by globbing `*.md`, and check 10's `check-contrast.py` does the same when given no arguments, so those four read whatever markdown is on disk — fourteen files today; check 8 walks an explicit list of the four prefix-less docs plus the ten style docs. Either way no markdown file in this directory escapes those five. Run it before committing.

**A check that cannot run is a failure, not a pass.** There is no skip-list anywhere in the script and no branch that reports "not checked" while returning success — the only non-failing findings are check 9's dead-token `warn` lines, check 5's runtime-token `note` lines, and check 5's `ratchet` lines, all three of which are advisory by design and say so.

1. **Link targets** — every `](./NN-…md)` reference points at a file that is on disk.
2. **Heading contract** — every doc carries the 14 required H2s, byte-identical and in order.
3. **Nested `@theme`** — no `@theme` is indented inside an at-rule; Tailwind v4 only processes a top-level one (rule 4).
4. **Bracket references** — no `utility-[--custom-prop]` bracket syntax, which emits an invalid literal instead of reading the variable (rule 4). Judged structurally, and the structure is markdown's: **outside** a fence a well-formed backtick span is a quotation and is removed, so prose may name the bad pattern in order to warn about it; **inside** a fence the raw line is tested, because a backtick there is a literal character in the sample (a JS template delimiter) and not markup. A fenced block therefore gets no exemption at all — if you need to name the pattern inside one, write it as `ease-[…]` or move the sentence into the prose around the fence. The name after `--` may be any CSS identifier, so `ease-[--Ease-Glass]` fails exactly as `ease-[--ease-glass]` does.
5. **Phantom tokens, in two tiers, plus a per-doc row-coverage ratchet** — every name in the §4 token table's `Token` column must resolve to an assignment (rule 1). A name assigned nowhere in the doc is a `PHANTOM` and fails; a name §4 tables but §5 assigns at runtime is a `note` and does not fail.

   Separately, the check holds each table against a **committed row-coverage baseline**. It counts table **rows** that name at least one token — rows, not unique names, so one multi-token cell cannot stand in for the column — over the distinct properties §4's CSS declares, and compares that ratio to a figure recorded per doc in the script's `row_baseline_of()`. Below the baseline (less a 0.025 deadband) is `NONAMES` and fails; a §4 whose CSS declares nothing is `NODECL` and fails; **a doc with no recorded baseline is `NOBASELINE` and fails**, which is what stops the table becoming a skip-list. When a doc's coverage rises above its baseline the check prints an advisory `ratchet` line asking for the number to be raised. The baseline only ever moves up, and only in a reviewed diff.

   The measured baselines: **01** 26/61 = 0.426 · **02** 40/58 = 0.689 · **03** 26/46 = 0.565 · **04** 35/68 = 0.514 · **05** 35/70 = 0.500 · **06** 42/71 = 0.591 · **07** 23/62 = 0.370 · **08** 37/47 = 0.787 · **09** 42/42 = 1.000 · **10** 32/58 = 0.551.

   This is per-doc rather than one global floor because the 2.7x spread above is real and structural. It is *not* caused by docs writing large families as one stem row — across all ten §4 `Token` columns the number of cells containing a `*` is **zero**, so no doc is penalised for a habit none of them has. It is caused by how many properties a doc's §4 CSS declares that its table never mentions at all: nil for docs 02, 08 and 09, which table everything they declare, rising to 37 for doc 01, and dominated by enumerated scale steps (`--sk-s-1…7`, `--clay-sp-1…14`, `--nb-space-2…8`, `--max-t-sm…3xl`) plus internal derived properties (`--sk-press-inner`, `--clay-shadow-h/l/s`). Any *global* floor would have to sit inside (0.259, 0.370] to bite a degenerate doc 02 while clearing a healthy doc 07 — a band whose only landmark is the current minimum, so choosing in it means reading the tightest doc and sliding underneath it. It would also hand out wildly unequal slack: at a 0.30 floor doc 07 could blank 4 of its 23 rows before failing and doc 09 could blank 29 of its 42.

   **What the ratchet guarantees, and what it does not.** It guarantees no regression: measured, every one of the ten docs now absorbs exactly one blanked row and fails on the second, the same strength for all ten — where the previous global quarter-floor let doc 07 blank 7 rows and doc 09 blank 31 in silence. Retiring a token properly, dropping it from the table *and* the CSS, moves both terms and is absorbed as ordinary churn (2–4 tokens per doc). It does **not** guarantee coverage, and cannot: a baseline is only as good as the table it was measured from. Doc 07 is committed at 0.370, and 0.370 is a poor showing — the ratchet freezes that number, it does not improve it. A pass here means "this table has not regressed since its baseline was recorded", never "this table documents its token set". Only the `PHANTOM` half speaks to correctness, and it speaks about the names the table prints, not the ones it omits.
6. **Theme-selector discipline** — every doc carries a `:root[data-theme="dark"]` override (`:root[data-theme="light"]` for the dark-first doc 03) and no bare `[data-theme=…]` at the head of a selector, which at specificity (0,1,0) loses to the guarded media block at (0,2,0) and makes the toggle a no-op (rule 3).
7. **Target token wired to §7** — every `target`-group token declared in §4 is named in §7, so the accessibility section cannot drift from the token by restating a pixel literal.
8. **Cross-reference tokens** — every `--<short-prefix>-…` name any of the fourteen files prints as code is declared by the doc that owns that prefix. It reads all fourteen, not just the four prefix-less docs: a style doc quoting another style doc's token — §12 Hybrids & Neighbors does it constantly — is the same cross-reference as the matrix doing it, and used to go unchecked. A file is never tested against its **own** prefix; that is the definition of a cross-reference, and a doc's own names are covered by checks 5 and 9. Family stems are exempt in exactly two forms, a name ending `-*` and a bare prefix like `--nb-`. A plain trailing hyphen is *not* a stem: a stale name that merely ends in one used to be waved through, and is now checked like any other name. The aspirational `--um-` names match no short prefix and are never considered.
9. **Dead tokens** — declared tokens with no `var()` consumer anywhere in the file, printed as a warning with a count. Not a failure: a scale step or a documented reference value may legitimately have no consumer.
10. **Contrast figures** — `./check-links.sh` shells out to `./check-contrast.py`, which recomputes every `N:1` contrast claim and every stated relative luminance in all fourteen files from the WCAG 2.x formula, checks that a row stating two luminances *and* a ratio agrees with itself, and refuses a figure rounded up through a 3:1, 4.5:1 or 7:1 threshold. A mismatch fails the run. Figures it cannot recompute — alpha-composited colours, bare WCAG requirements, a clause naming only one colour — are counted and printed as INFO and never fail. If `python3` is not on `PATH`, or `./check-contrast.py` is not on disk, the check prints a loud `SKIPPED` (or `MISSING`) **and fails the run**: no contrast figure in the set was read, and an unread set is not a passing set. Earlier revisions printed that skip and still exited 0, which meant CI — which reads the exit code, not the log — stayed green over completely unverified numbers. Run `./check-contrast.py --verbose` for the full exclusion list, or `--json` for machine-readable findings.
