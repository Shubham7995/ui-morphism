# MARKETPLACE — turning ten docs into a Claude Code plugin marketplace

The plan for converting each style doc's **§13 Plugin Spec (draft)** into a shipping Claude Code skill, distributed as one marketplace of eleven plugins: the ten styles plus a shared `ui-morphism-core`.

Every structural claim below — file locations, field names, field types, defaults — is taken from the current Claude Code documentation at `code.claude.com/docs` (`plugin-marketplaces`, `plugins-reference`, `skills`), verified 2026-08-09. No fields are invented. Where a field exists but this plan does not use it, that is noted rather than silently omitted.

---

## 1. Identity

| | |
|---|---|
| **Marketplace name** | `ui-morphism` |
| **Install command** | `/plugin marketplace add <owner>/ui_morphism` |
| **Plugin install** | `/plugin install glassmorphism-ui@ui-morphism` |
| **Owner** | the repository owner (`owner.name` is required; `email` and `url` optional) |
| **Description** | "Ten researched UI surface styles as executable skills — tokens, components, and an accessibility validator for each." |

`ui-morphism` is not on the reserved-names list (`claude-code-marketplace`, `claude-code-plugins`, `claude-plugins-official`, `claude-plugins-community`, `claude-community`, `anthropic-marketplace`, `anthropic-plugins`, `agent-skills`, `anthropic-agent-skills`, `knowledge-work-plugins`, `life-sciences`, `claude-for-legal`, `claude-for-financial-services`, `financial-services-plugins`, `first-party-plugins`, `healthcare`), and it does not impersonate an official source. It is also kebab-case with no spaces, which the schema requires. Note that a user can register only one marketplace per name, so all eleven plugins must live in a single `marketplace.json` — which they do.

**Why eleven plugins and not one plugin with eleven skills.** A single plugin would force every user to carry all ten style skills' descriptions in context whether they want brutalism or not, and would make version pinning all-or-nothing. Separate plugins let a user install exactly the styles they work in, and let each style version independently as its research is refreshed. The shared logic that would otherwise be duplicated goes into `ui-morphism-core`, which the other ten declare in `dependencies` — Claude Code writes `true` into `enabledPlugins` for a plugin required by an active one, so core is enabled automatically at install.

---

## 2. Repository layout

The marketplace and the plugins live in the same repository, so plugin sources are relative paths. That keeps installs working whether a user adds the marketplace from a git source or a local directory, and it means the plugins can be private without any of them needing a separate access grant.

```text
ui_morphism/
├── .claude-plugin/
│   └── marketplace.json                 # the catalog — MUST be at repo root/.claude-plugin/
├── docs/                                # the research; the source of truth for every skill
│   ├── README.md
│   ├── 00-comparison-matrix.md
│   ├── 01-skeuomorphism.md … 10-spatial-ui.md
│   ├── MARKETPLACE.md
│   └── GLOSSARY.md
├── plugins/
│   ├── ui-morphism-core/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/
│   │   │   ├── detect-stack/
│   │   │   │   └── SKILL.md             # shared "what framework is this?" procedure
│   │   │   ├── a11y-validate/
│   │   │   │   ├── SKILL.md
│   │   │   │   └── scripts/
│   │   │   │       ├── contrast.mjs     # WCAG 2.x relative luminance, unrounded
│   │   │   │       ├── audit-css.mjs    # forced-colors / focus / motion / target-size sweep
│   │   │   │       └── budget.mjs       # layer + byte + blur-area counters
│   │   │   └── token-emit/
│   │   │       ├── SKILL.md
│   │   │       ├── references/
│   │   │       │   ├── token-grammar.md      # --um-<style>-<group>-<variant>
│   │   │       │   ├── group-vocabulary.md
│   │   │       │   └── tailwind-mapping.md
│   │   │       └── scripts/
│   │   │           └── emit.mjs         # tokens → css | @theme | ts | swift | kt
│   │   ├── assets/
│   │   │   └── report-template.md       # the shared audit-report shape
│   │   └── LICENSE
│   │
│   ├── skeuomorphism-ui/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/
│   │   │   ├── apply/
│   │   │   │   ├── SKILL.md             # the style skill (see §5)
│   │   │   │   ├── references/
│   │   │   │   │   ├── tokens.md        # doc §4, machine-readable
│   │   │   │   │   ├── recipes.md       # doc §5, condensed
│   │   │   │   │   ├── motion.md        # doc §6
│   │   │   │   │   └── anti-patterns.md # doc §13 refusal list
│   │   │   │   ├── assets/
│   │   │   │   │   ├── tokens.css       # the emitted :root block, verbatim
│   │   │   │   │   ├── tokens.theme.css # the Tailwind v4 @theme mirror
│   │   │   │   │   └── grain.svg        # the feTurbulence filter, inlined at emit time
│   │   │   │   └── scripts/
│   │   │   │       └── derive-palette.mjs   # brand hex → warmed material ramp
│   │   │   └── audit/
│   │   │       ├── SKILL.md             # review an existing implementation
│   │   │       └── references/
│   │   │           └── checklist.md     # doc §13 self-run checklist
│   │   ├── README.md
│   │   └── LICENSE
│   │
│   ├── neumorphism-ui/      …same shape
│   ├── glassmorphism-ui/    …same shape
│   ├── claymorphism-ui/     …same shape
│   ├── minimalism-ui/       …same shape
│   ├── maximalism-ui/       …same shape
│   ├── brutalism-ui/        …same shape
│   ├── liquid-glass-ui/     …same shape
│   ├── bento-grid-ui/       …same shape
│   └── spatial-ui/          …same shape
└── LICENSE
```

**Four structural constraints this layout respects:**

1. `marketplace.json` must be at `<repo-root>/.claude-plugin/marketplace.json`. Nothing else goes in that directory.
2. `plugin.json` must be at `<plugin-root>/.claude-plugin/plugin.json`. Every other directory — `skills/`, `commands/`, `agents/`, `hooks/`, `scripts/` — must be at the plugin root, **not** inside `.claude-plugin/`.
3. Skills are directories containing `SKILL.md`, discovered automatically from `skills/`. No `skills` field is needed in `plugin.json` for this layout.
4. A `CLAUDE.md` at a plugin root is *not* loaded as context. Instructions must live in a skill.

**On `references/`, `assets/` and `scripts/`.** These are conventional subdirectories, not schema fields — Claude Code does not enumerate them. They exist so the `SKILL.md` body stays short and the heavy material loads only when needed: `SKILL.md` says "read `references/tokens.md` before emitting", and the 200-line token table costs nothing until that happens. Inside a skill body, `${CLAUDE_SKILL_DIR}` resolves to the skill's own directory, and it also substitutes inside `allowed-tools` Bash rules, which is how a skill can run a bundled script without a permission prompt.

---

## 3. `marketplace.json`

`metadata.pluginRoot` is set to `./plugins`, which lets each entry's `source` be a bare directory name instead of a full relative path.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-marketplace.json",
  "name": "ui-morphism",
  "description": "Ten researched UI surface styles as executable skills — tokens, components, and an accessibility validator for each.",
  "version": "0.1.0",
  "owner": {
    "name": "UI Morphism",
    "url": "https://github.com/OWNER/ui_morphism"
  },
  "metadata": {
    "pluginRoot": "./plugins"
  },
  "plugins": [
    {
      "name": "ui-morphism-core",
      "source": "ui-morphism-core",
      "displayName": "UI Morphism Core",
      "description": "Shared foundation for the ui-morphism style skills: host-framework detection, the --um-<style>-<group>-<variant> token grammar and emitters, the WCAG 2.2 contrast and forced-colors validator, and the common audit-report format. Installed automatically as a dependency of any style plugin.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["design-tokens", "accessibility", "wcag", "tailwind", "css", "validator"],
      "category": "design-system"
    },
    {
      "name": "skeuomorphism-ui",
      "source": "skeuomorphism-ui",
      "displayName": "Skeuomorphism UI",
      "description": "Physical, tactile, hardware-inspired interfaces — bevelled and embossed surfaces, leather/metal/wood/felt materials, audio-plugin and instrument-panel styling, and converting flat components into raised light-modelled surfaces with a consistent four-layer shadow stack.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["skeuomorphism", "realism", "texture", "bevel", "emboss", "material", "audio-ui", "hardware"],
      "category": "ui-style"
    },
    {
      "name": "neumorphism-ui",
      "source": "neumorphism-ui",
      "displayName": "Neumorphism UI",
      "description": "Soft UI / neomorphism — same-hue extruded and pressed-in surfaces for thermostats, smart-home panels, media transport and calculators, plus auditing an existing neumorphic UI for its characteristic 1.4.11 contrast and forced-colors failures.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["neumorphism", "neomorphism", "soft-ui", "extruded", "embossed", "smart-home"],
      "category": "ui-style"
    },
    {
      "name": "glassmorphism-ui",
      "source": "glassmorphism-ui",
      "displayName": "Glassmorphism UI",
      "description": "Frosted-glass surfaces — backdrop-blur navbars, cards, modals and command palettes, Apple- and Fluent-style translucent materials ported to the web, with the @supports fallback, contrast clamp and blur budget handled.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["glassmorphism", "backdrop-filter", "frosted", "acrylic", "translucent", "blur"],
      "category": "ui-style"
    },
    {
      "name": "claymorphism-ui",
      "source": "claymorphism-ui",
      "displayName": "Claymorphism UI",
      "description": "Soft puffy clay surfaces — inflated pastel cards and buttons with inset highlight-and-shade shadows for kids, edtech and wellness products, and converting flat or neumorphic interfaces into tactile clay.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["claymorphism", "clay-ui", "puffy", "squishy", "pastel", "edtech"],
      "category": "ui-style"
    },
    {
      "name": "minimalism-ui",
      "source": "minimalism-ui",
      "displayName": "Minimalism UI",
      "description": "Simplify, quiet down and de-clutter an interface — monochrome palette with one accent, 4/8pt spacing, a modular type scale, stripped shadows and gradients, and a compensating pass that restores the affordances subtraction removes.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["minimalism", "swiss", "clean", "quiet-ui", "type-scale", "spacing-system"],
      "category": "ui-style"
    },
    {
      "name": "maximalism-ui",
      "source": "maximalism-ui",
      "displayName": "Maximalism UI",
      "description": "Make a UI louder — layered collage, clashing saturated colour, oversized display type, stickers, marquees, patterned and grainy grounds, hard offset shadows and anti-grid placement, with a hard three-loud-layer cap and a Calm mode toggle.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["maximalism", "dopamine-design", "collage", "bold-typography", "anti-design", "brand"],
      "category": "ui-style"
    },
    {
      "name": "brutalism-ui",
      "source": "brutalism-ui",
      "displayName": "Brutalism & Neubrutalism UI",
      "description": "Neubrutalist restyling — hard 2-4px ink borders, zero-blur offset shadows, flat saturated fills and chunky display type, for making an interface look bolder, rawer and less like a generic AI-generated rounded-gray-card layout.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["brutalism", "neubrutalism", "neobrutalism", "hard-shadow", "sticker-ui", "anti-design"],
      "category": "ui-style"
    },
    {
      "name": "liquid-glass-ui",
      "source": "liquid-glass-ui",
      "displayName": "Liquid Glass UI",
      "description": "Apple Liquid Glass styling — refractive lensing surfaces, iOS 26/27-style floating toolbars and specular-rim controls for web, React Native or SwiftUI, including upgrading existing glassmorphism to true displacement-map refraction with a three-tier @supports ladder.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["liquid-glass", "apple", "ios-26", "refraction", "specular", "swiftui", "visionos"],
      "category": "ui-style"
    },
    {
      "name": "bento-grid-ui",
      "source": "bento-grid-ui",
      "displayName": "Bento Grid UI",
      "description": "Build or convert an asymmetric modular tile layout — Apple-style feature grids, dashboards, portfolio indexes and overview screens — assigning spans by content weight on a locked gutter with correct reading order and concentric media radii.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["bento", "grid", "layout", "feature-section", "dashboard", "css-grid"],
      "category": "ui-style"
    },
    {
      "name": "spatial-ui",
      "source": "spatial-ui",
      "displayName": "Spatial UI",
      "description": "Depth-based interfaces — floating panels at measured z-depth, visionOS and Android XR layouts, orbiter chrome, pointer and scroll parallax, and converting a flat shadow-elevation system into a real six-step depth ladder with distance-independent sizing.",
      "version": "0.1.0",
      "author": { "name": "UI Morphism" },
      "license": "MIT",
      "keywords": ["spatial", "visionos", "android-xr", "depth", "parallax", "perspective", "3d"],
      "category": "ui-style"
    }
  ]
}
```

**Field notes, all from the schema:**

- Required at the top level: `name`, `owner`, `plugins`. Everything else here is optional.
- Required per entry: `name` and `source`. `source` accepts a string (relative path) or an object with a `source` discriminator (`github`, `url`, `git-subdir`, `npm`, `archive`).
- `version` set in a marketplace entry pins the plugin, so users receive an update only when the string changes. If it is set in both the entry and `plugin.json`, **`plugin.json` wins**. Bump both together, or pick one place and be consistent — this plan keeps the authoritative version in `plugin.json` and mirrors it here for catalog display.
- `keywords` must be an array. A string value is a load error, not a warning.
- `category` and `tags` are marketplace-only fields; `displayName`, `description`, `version`, `author`, `homepage`, `repository`, `license`, `keywords` and `metadata` are shared with the plugin manifest schema.
- `strict` is omitted, which means it defaults to `true`: each plugin's own `plugin.json` is the authority for its components, and the marketplace entry may only supplement it.
- `dependencies` is declared in each plugin's `plugin.json` rather than here, so the dependency travels with the plugin regardless of how it is distributed.
- `renames` is not needed yet, but it is the field to use if `spatial-ui` is ever renamed to `spatial-ui-plugin` to avoid the plugin/skill name collision discussed in the Naming note at the end of §6.

Validate before publishing: `claude plugin validate ./plugins/skeuomorphism-ui --strict`. `--strict` promotes unrecognised-field warnings to errors, which catches a misspelling like `keyword` for `keywords` before users see it.

---

## 4. `plugin.json` — one complete example

`plugins/skeuomorphism-ui/.claude-plugin/plugin.json`:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "skeuomorphism-ui",
  "displayName": "Skeuomorphism UI",
  "version": "0.1.0",
  "description": "Physical, tactile, hardware-inspired interfaces. Emits a material token layer with a four-layer shadow stack, rewrites flat components into raised light-modelled surfaces, and self-audits every generated pair against WCAG 2.2.",
  "author": {
    "name": "UI Morphism",
    "url": "https://github.com/OWNER/ui_morphism"
  },
  "homepage": "https://github.com/OWNER/ui_morphism/blob/main/docs/01-skeuomorphism.md",
  "repository": "https://github.com/OWNER/ui_morphism",
  "license": "MIT",
  "keywords": [
    "skeuomorphism",
    "realism",
    "texture",
    "bevel",
    "emboss",
    "material",
    "audio-ui",
    "hardware",
    "design-tokens"
  ],
  "dependencies": [
    { "name": "ui-morphism-core", "version": "^0.1.0" }
  ],
  "metadata": {
    "sourceDoc": "docs/01-skeuomorphism.md",
    "docSection": "13",
    "lastResearched": "2026-08-08",
    "statusIn2026": "revival",
    "a11yRisk": "medium",
    "perfCost": "medium"
  }
}
```

**Why each field is here:**

- `name` is the only required field, and it is what namespaces the components: the skills below appear as `skeuomorphism-ui:apply` and `skeuomorphism-ui:audit`. If a marketplace entry lists the plugin under a different name, the marketplace entry's name is what `enabledPlugins` keys and `/plugin` uses — so keep them identical.
- No `skills` field: the default `skills/` scan finds both skill directories. `skills` only *adds* to that scan, so declaring it here would be redundant.
- `dependencies` accepts either a bare string or `{ "name", "version" }` with a semver constraint. `^0.1.0` lets core ship patches without every style plugin needing a release.
- `metadata` is free-form and Claude Code never reads it. It is used here to keep provenance attached to the artefact, so a stale plugin is identifiable without opening the docs.
- `defaultEnabled` is deliberately not set, so it defaults to `true`. A user who explicitly installs `skeuomorphism-ui` wants it on.
- Fields Claude Code does not recognise are ignored at load time and reported as warnings by `claude plugin validate`, so a `package.json`-style field left in here would not break anything — but `--strict` in CI will still flag it.

---

## 5. `SKILL.md` — one complete example

`plugins/skeuomorphism-ui/skills/apply/SKILL.md`. Source of truth: doc `01-skeuomorphism.md` §13, cross-checked against §4 (tokens), §6 (motion), §7 (accessibility) and §8 (performance).

Every frontmatter key below is a documented field. `name`, `description`, `allowed-tools` and `license` are part of the Agent Skills spec; `argument-hint` is a Claude Code extension. All are optional except that `description` is recommended, because it is what Claude matches against to decide when to load the skill. The combined `description` + `when_to_use` text is truncated at 1,536 characters in the skill listing, so the trigger sentence goes first.

````markdown
---
name: apply
description: >-
  Use when the user wants a physical, tactile, hardware-inspired interface — asks for
  skeuomorphic, realistic, textured, bevelled or embossed UI; names a material such as
  leather, brushed metal, wood, felt or rubber; wants audio-plugin, instrument-panel,
  camera or automotive-HMI styling; or says "make this feel like a real object". Also use
  when converting flat or Material components into raised, light-modelled surfaces with a
  consistent four-layer shadow stack, or when generating a skeuomorphic token layer for an
  existing brand palette. Do not use for soft same-colour extrusion (that is
  neumorphism-ui), puffy pastel surfaces (claymorphism-ui), or translucent panels
  (glassmorphism-ui / liquid-glass-ui).
argument-hint: "[scope glob] [--material=plastic|brushed-metal|wood|leather|felt|rubber] [--intensity=0-100]"
allowed-tools: Read Glob Grep Edit Write Bash(node ${CLAUDE_SKILL_DIR}/scripts/derive-palette.mjs *)
license: MIT
metadata:
  sourceDoc: docs/01-skeuomorphism.md
  lastResearched: "2026-08-08"
---

# Skeuomorphism: apply

Borrow the texture, shape and lighting of physical objects so a control announces what it
does before it is touched. The single defining move is a **consistent single overhead light
source rendered as a four-layer shadow stack** — contact + ambient outer, bevel + lip inset —
applied to every raised surface without exception. Everything else (gradients, grain,
letterpress type, materials) is decoration hung off that lighting model.

## Before you start

1. Load `ui-morphism-core:detect-stack` and record the framework and styling system. Never
   guess, and never rewrite silently — confirm the detection with the user.
2. Read `references/tokens.md` for the full token table. Do not reproduce values from memory.
3. Establish `scope`. Default is `src/components/ui/**`. Whole-app application on an
   unscoped request is an anti-pattern; say so and narrow it.

## Inputs

| Input | Type | Default |
|---|---|---|
| `framework` | react-ts \| react-js \| vue \| svelte \| html \| swiftui | detected, confirmed |
| `styling` | css \| css-modules \| tailwind-v4 \| styled-components | detected, confirmed |
| `basePalette` | 1-3 hex | brand primary, warmed |
| `material` | plastic \| brushed-metal \| wood \| leather \| felt \| rubber \| mixed | plastic |
| `density` | compact \| default \| comfortable | default (padding 10/14/18px, min-height 36/44/52px) |
| `intensity` | 0-100 | 60 |
| `scope` | glob list | `src/components/ui/**` |
| `darkMode` | media \| class \| both | both |

## Procedure

1. **Derive the material palette.** Run `scripts/derive-palette.mjs` on the brand colours:
   clamp saturation to 8-25% and lightness to 82-95% for faces, generate three gradient
   stops at a 15% luminance spread, take the mid stop as the nominal surface.
2. **Emit the token layer** via `ui-morphism-core:token-emit` under the
   `--um-skeuomorphism-*` grammar: all four shadow atoms, three elevation compounds,
   `border-strong` solved for 3:1, `ink` solved for 4.5:1 against the *darkest* gradient
   stop, and a computed dark-mode override. Light values on bare `:root`; dark values
   duplicated under both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
   and `:root[data-theme="dark"]`.
3. **Rewrite the targeted components** — button, toggle, input, select, slider, card, panel,
   tab — to the four-layer stack plus a three-stop gradient plus a 1px `border-strong` plus
   letterpress type. Recessed containers (wells, inputs, slots) invert the stack: highlight
   at the bottom, shade at the top. That is the only permitted exception to the top-light rule.
4. **Insert exactly one grain layer** on the outermost chassis element, never per component,
   and wire its opacity to `--um-skeuomorphism-noise-opacity`.
5. **Wire the press interaction**: `translateY(1px)`, outer shadows collapse, insets deepen to
   `inset 0 2px 5px rgba(0,0,0,.25)`, 90ms press / 220ms release. Never transition `box-shadow`.
6. **Emit the accessibility layer** as its own cascade layer (`@layer skeuo-a11y`) covering
   `prefers-reduced-motion`, `prefers-contrast: more`, `prefers-reduced-transparency`, and
   `forced-colors: active`. The forced-colors block must `display: none` the grain layer:
   forced colors nulls `box-shadow`, `text-shadow` and `background-image`, but **not**
   `url()`-based backgrounds, so an SVG data-URI grain survives and actively harms legibility.
7. **Run `ui-morphism-core:a11y-validate`** and auto-darken `border-strong` and `ink` until
   3:1 / 4.5:1 hold, unrounded. Report every correction.
8. **Write the audit report** using the core report template.

## Outputs

- `tokens/skeuomorphism.css` and, for Tailwind, `tokens/skeuomorphism.theme.css` (`@theme`,
  never nested in an at-rule)
- `components/skeuo/*` with `intensity` and `material` threaded through as props
- `styles/skeuo-a11y.css` as `@layer skeuo-a11y`
- `reports/skeuomorphism-audit.md`

## Intensity knobs

| Knob | Range | Default | Note |
|---|---|---|---|
| `shadowDepth` | 0-1 multiplier on all four layers | 0.6 | Below 0.25, press travel is suppressed to avoid 1px jitter with no visual support |
| `gradientSpread` | 0-24% luminance top-to-bottom | 15% | Above 18% reads as a 2009 web button |
| `grainOpacity` | 0-0.08 | 0.05 light / 0.07 dark | Hard cap 0.08 |
| `materialFidelity` | 0-3 decorative layers | 2 | 0 colour, 1 +gradient, 2 +grain, 3 +specular and edge highlight |
| `travel` | 0-2px press displacement | 1px | 2px only for hardware metaphors ≥ 64px tall |

## Validation — all must pass before reporting done

Full checklist in `../audit/references/checklist.md`. The non-negotiable ones:

- [ ] Every control pair ≥ 3:1 unrounded (2.999:1 fails), text ≥ 4.5:1 against the darkest
      gradient stop it can sit on
- [ ] Focus indicator on every focusable element, additive to the shadow stack, ≥ 2px,
      ≥ 3:1, not clipped by an ancestor `overflow: hidden`
- [ ] `forced-colors: active` block present, uses system colour keywords, hides every grain
      and decorative pseudo-element, gives each control a real border
- [ ] Zero `transition` or `animation` targeting `box-shadow`, `background-image` or
      gradient stops
- [ ] One grain layer per scroll container, opacity ≤ 0.06 (≤ 0.08 dark)
- [ ] All targets ≥ 24×24px; flag below 44×44px
- [ ] Light direction identical across every emitted component
- [ ] `intensity: 0` still produces a bordered, accessible, unornamented control

## Refuse to generate

Read `references/anti-patterns.md` in full. Highest-frequency refusals:

- A control whose only boundary is a shadow or bevel, with no border meeting 3:1 — emit the
  bordered version instead and say why
- Neumorphic dual-shadow extrusion on a same-colour background — that is `neumorphism-ui`,
  it measures ~1.2-1.5:1, and it is out of scope here
- Mixed light directions in one emitted set
- Skeuomorphic treatment on body copy backgrounds, table rows, or any element holding more
  than ~120 characters of running text
- Drag-only knobs, dials or faders with no keyboard handler and no `role="slider"` with
  `aria-valuenow` / `aria-valuetext`
- `forced-color-adjust: none` on a text-bearing element
- Removing an existing focus indicator in favour of a "more realistic" pressed look
````

**Two things to notice about the frontmatter.** The `description` names both the trigger set *and* the three neighbouring skills it should not steal from — with ten overlapping style skills installed, negative triggers are what stop `claymorphism-ui:apply` from firing on "make it feel soft and physical". And `allowed-tools` scopes the Bash grant to exactly the bundled script path using `${CLAUDE_SKILL_DIR}`, which substitutes in both the skill body and the `allowed-tools` rule, so the pre-approval matches the exact command the body tells Claude to run. The grant clears at the next user message.

---

## 6. All ten skills

Each plugin ships two skills: `apply` (transform) and `audit` (review only, no writes). The table gives the `apply` skill; the `audit` skill in each plugin shares the style's checklist and emits only a report.

| Plugin : skill | Triggering description (condensed) | Intensity knobs (min → max, default) | Outputs |
|---|---|---|---|
| `skeuomorphism-ui:apply` | Physical, tactile, hardware-inspired UI; skeuomorphic, realistic, textured, bevelled, embossed; leather/metal/wood/felt; audio-plugin or instrument-panel styling; "make this feel like a real object"; converting flat components to raised light-modelled surfaces. | `shadowDepth` 0→1 (0.6) · `gradientSpread` 0→24% (15%) · `grainOpacity` 0→0.08 (0.05/0.07 dark) · `materialFidelity` 0→3 (2) · `travel` 0→2px (1px) | `tokens/skeuomorphism.css` + `.theme.css`; `components/skeuo/*`; `@layer skeuo-a11y` sheet; contrast + paint-cost + asset-weight audit |
| `neumorphism-ui:apply` | Neumorphism, neomorphism, soft UI, "soft/extruded/embossed/pressed-in buttons", "new skeuomorphism"; thermostat, smart-home panel, media transport, calculator, wellness app; converting flat or Material components to soft extrusion; auditing an existing neumorphic UI. | `shadowDelta` 0.03→0.14 light / 0.20 dark (0.075) · `distance` 2→20px (5px, blur = 2×) · `radius` 6→999px (14px) · `hairlineOpacity` **0.55 floor**→1.0 (1.0) · `coverage` 0.05→1.0 (0.35) | `tokens/neumorphism.css` + DTCG `.json`; 10-component set with all states; `@layer neumorphism` sheet; audit with per-token ratios and a shadow-layer census |
| `glassmorphism-ui:apply` | Frosted glass, glassmorphism, backdrop-blur, translucent surfaces; glass navbar/card/modal/command palette; porting Apple or Fluent materials to the web; "frosted", "blurry panel", "see-through card", "acrylic"; toning glass down for accessibility. | `fillAlpha` 0.04→0.30 light-tone / 0.72 dark-tone (0.10-0.14) · `blurRadius` 4→48px (12-20px) · `saturation` 100→200% (160%) · `borderAlpha` 0.10→0.45, never 0 (0.16-0.26) · `grainOpacity` 0→0.06 (0.035) | 5-rung ladder tokens + opaque mirror; 7 glass components with `@supports` baked in; generated mesh-gradient ground; `GLASS-AUDIT.md` with worst-case composited contrast |
| `claymorphism-ui:apply` | Claymorphism, clay UI, play-doh or squishy interfaces; inflated 3D-looking cards and buttons; playful kids/edtech/wellness aesthetic; converting flat or neumorphic interfaces into pastel clay with inset highlight-and-shade. | `radiusScale` 8/6px→48/28px (32/20px) · `insetStrength` sheen 0→0.85, shade 0→0.48 (0.62/0.32) · `dropDepth` `0 2px 4px -2px`@0.12→`0 44px 76px -16px`@0.42 · `surfaceChroma` 0.02→0.16 OKLCH (0.09) · `squishAmount` `scale(1.00)`→`scale(0.93)`+3px | `clay.tokens.css`; 8 clay components; `@layer claymorphism`; `clay-fallbacks.css`; `clay-audit.md` with blur-budget count |
| `minimalism-ui:apply` | Simplify, quiet down or de-clutter; minimal, clean, Swiss, Linear-like, Vercel-like, "less is more"; strip shadows/gradients/borders; monochrome plus one accent; 4/8pt spacing or a modular type scale; "this feels busy / noisy / over-designed". | `chromaBudget` 0.00→0.06 chroma, accent 1→15% of pixels · `decorationBudget` 3→0 shadow steps, opacity 0.12→0.00 · `whitespaceMultiplier` 0.75→2.0 · `typeContrast` ratio 1.414→1.125, weights {400,500,600,700}→{400,500} · `affordanceFloor` 0→100, **never below 40**, inverted | `tokens/minimalism.css` + `@theme`; 5 components; `@layer minimalism`; before/after contrast table plus a quantisation inventory (colours removed, shadows removed, N font sizes → 9) |
| `maximalism-ui:apply` | Make a UI louder, bolder, more expressive; dense layered layouts, clashing colour, oversized display type, collage/sticker/scrapbook, hard offset shadows, patterned or grainy grounds, marquees, anti-grid placement, dopamine design, Y2K density. Brand/campaign/landing surfaces, not app shells. | `layerCount` 1→3, **hard cap 3** · `chromaSpread` 1 accent @0.10→6 @0.30 · `shadowStack` `2px 2px 0`→`4/8/12px` three-colour · `tiltRange` 0→±5deg · `motionLoad` 0 loops→3 loops + 24s marquee, forced to 0 under reduced-motion or Calm mode | `maximalism.tokens.css` with role bindings; `maximalism.safety.css` as a non-removable `@layer`; 7 components including `CalmToggle`; optional Figma variable JSON with Quiet/Loud/Riot modes at intensity 25/60/90 |
| `brutalism-ui:apply` | Neubrutalism / neo-brutalism / brutalist restyling; hard black borders, zero-blur offset shadows, flat saturated fills, chunky display type; "bolder", "rawer", "more hand-made", "sticker-like", "less like a generic AI-generated rounded-gray card"; auditing an existing neubrutalist UI. | `shadowOffset` 0→12px (4px at 50) · `borderWidth` 1→5px stepped · `radius` 12→0px, inverse (5px at 50) · `chroma` 35→100% of source OKLCH C, L held · `tilt` 0→3deg, decorative only. `scope: product` clamps offset ≤ 4px, border ≤ 2px, tilt = 0 | `brutalism.tokens.css` with a contrast comment per accent; `@theme` block; 9 components; `@layer brutalism`; optional Figma Variables JSON; `brutalism-audit.md` |
| `liquid-glass-ui:apply` | Apple Liquid Glass — refractive/lensing surfaces, iOS 26/27 floating toolbars, specular-rim controls, "Apple-like" translucent chrome for web or React Native; modernising existing glassmorphism into true refraction; auditing an implementation for contrast, performance or reduced-transparency failures. | `refractionScale` 0→72 (48) · `fillAlpha` **0.55 hard clamp**→0.95 (0.62, moves inversely to intensity) · `blurRadius` 0→28px (20px) · `specularOpacity` 0→0.90 (0.55) · `saturation` 100→190% (180%) | `tokens/liquid-glass.css`; `LiquidGlass` + `LiquidGlassFilterDefs`; three-tier `@supports` ladder; inlined displacement maps ≤ 8KB each; audit measuring contrast at backdrop luminance 0 **and** 255 |
| `bento-grid-ui:apply` | Build, convert or refine a bento grid — asymmetric modular tile layout for a feature section, marketing page, dashboard, portfolio index or overview screen. "bento", "bento box layout", "Apple-style feature grid", "tile grid", "modular card grid", "asymmetric grid", "turn these features into a varied-span grid". | `spanVariance` 1.0→3.0 (2.0) · `radius` 0→32px (24px) · `surfaceDelta` 0→24 luminance points (8) · `mediaBleed` 0→100% (40%) · `motion` 0→100 (45), hard-clamped to 0 under reduced-motion | `tokens/bento.css`; `BentoGrid` + `BentoTile` with a typed closed span union; `@layer bento`; `bento-audit.md` as a per-tile table (span, content type, contrast, image weight, alt-text, link count); a 320px collapse check |
| `spatial-ui:apply` | Spatial or depth-based interface — floating panels at measured z-depth, visionOS/Android XR layouts, orbiter or ornament chrome, pointer or scroll parallax, 3D-transformed cards, "spatial computing" look; converting a flat shadow-elevation system to a real depth ladder; auditing for reduced-motion, target-size, dragging-alternative and contrast failures. | `perspective` none→800px (1200px at 55) · depth-ladder multiplier 0.25×→2× (1× = 16/24/32/40/56) · parallax 0px/0deg→24px/8deg (12px/4°) · panel alpha/blur 1.00/0px→0.55/48px, clamped by the validator · shadow multiplier 0.4×/0.6×→1.6×/1.4× | `tokens/spatial-ui.css` / `.swift` / `.kt`; `SpatialStage`, `SpatialPanel`, `SpatialOrbiter`, `SpatialDialog`, `SpatialLayer`; `@layer spatial`; audit including a diff of every `position: fixed` element relocated out of the perspective subtree |

**Naming note.** Skills are namespaced by plugin name, so these invoke as `/glassmorphism-ui:apply`, `/brutalism-ui:audit`, and so on. Keeping the skill directory names short (`apply`, `audit`) avoids `/skeuomorphism-ui:skeuomorphism-ui`. The `name` field in each `SKILL.md` frontmatter pins the invocation name so it survives the versioned install directory that marketplace installs use.

---

## 7. Shared architecture

Ten skills that each detect a framework, emit tokens, compute contrast, and write a report is ten copies of four hard problems. The rule for what goes in `ui-morphism-core`: **anything whose correct answer is identical across all ten styles, or whose incorrect answer is a correctness bug rather than a taste disagreement.** Everything that encodes what a style *looks like* stays in the style plugin.

### 7.1 Common token schema — **core**

The `--um-<style>-<group>-<variant>` grammar, the closed group vocabulary, and the emitters live in `ui-morphism-core:token-emit`. Full specification in [00-comparison-matrix.md §7](./00-comparison-matrix.md).

Core owns:
- The grammar and its validating regex.
- The closed group vocabulary (`bg`, `surface`, `ink`, `border`, `accent`, `danger`, `radius`, `shadow`, `elev`, `blur`, `saturate`, `noise`, `space`, `font`, `text`, `weight`, `leading`, `tracking`, `dur`, `ease`, `focus`, `target`).
- The five output formats: vanilla `:root` CSS, Tailwind v4 `@theme`, TypeScript object, SwiftUI `enum`, Compose `object`.
- The dark-mode emission shape: light on bare `:root`, dark duplicated under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` **and** `:root[data-theme="dark"]`.
- The Tailwind group → namespace mapping (`color`→`--color-um-*`, `radius`→`--radius-*`, `shadow`→`--shadow-*`, `blur`→`--blur-*`, `space`→`--spacing-*`, `ease`→`--ease-*`) and the invariant that `@theme` is never nested inside an at-rule.

Style plugins own: their token *values*, and which groups they populate. Glassmorphism has no `bg` because it depends on a ground it does not own; minimalism sets `blur: 0px` explicitly as a contract; brutalism sets `radius-sm/md/lg` all to `0`. Those are style facts, not shared logic.

**Why core:** four of the ten docs currently emit dark mode only one way and three use two different prefixes internally. Centralising emission makes those classes of bug impossible rather than merely discouraged.

### 7.2 Intensity 0-100 — **core scale, per-style curves**

One user-facing number, mapped by each style onto its own three-to-five knobs. Core owns the contract; the style owns the mapping.

The contract, which every style must satisfy:

1. **Monotone.** Every knob moves in one direction across 0→100. No knob reverses mid-range. Where the visual reading is inverted — `liquid-glass` `fillAlpha`, `brutalism` `radius`, `minimalism` `decorationBudget` — the *knob* moves inversely while intensity still means "more of this style".
2. **Intensity 0 is a usable, accessible, recognisable-as-plain baseline, never nothing.** Glassmorphism at 0 is a bordered opaque tinted card. Skeuomorphism at 0 is a bordered unornamented control. Bento at 0 is a uniform card grid. This is what makes intensity a safe knob for an agent to turn.
3. **Intensity 100 still passes the a11y floor.** If it cannot, the skill clamps and records the clamp in the audit; it never ships a failing surface to satisfy a number.
4. **Hard clamps are independent of intensity.** `maximalism.layerCount` ≤ 3, `liquid-glass.fillAlpha` ≥ 0.55, `neumorphism.hairlineOpacity` ≥ 0.55, `claymorphism.squishAmount` ≥ 0.93, `spatial-ui` panel alpha ≥ 0.62 dark / ≥ 0.60 light on an arbitrary backdrop. Core enforces the *existence* of a clamp table per style; the values are the style's.
5. **Context caps override intensity.** `maximalism.surfaceType: app-accent` caps at 45; `brutalism.scope: product` caps at 45; `liquid-glass.backdropControl: arbitrary` caps at 45; `spatial-ui.backdropControl: arbitrary` caps at 45. Core provides the cap mechanism and the audit line that reports the cap was applied.

Defaults, for reference: skeuomorphism 60, neumorphism 45, glassmorphism 50, claymorphism 50, minimalism 60, maximalism 60, brutalism 60, liquid-glass 60, bento-grid 45, spatial-ui 55. Neumorphism and bento sit lowest for opposite reasons — neumorphism because coverage above ~0.6 collapses hierarchy, bento because span variance above ~2.0 stops reading as a grid.

### 7.3 Accessibility validator — **core, no exceptions**

`ui-morphism-core:a11y-validate` with `scripts/contrast.mjs` and `scripts/audit-css.mjs`. Every style skill calls it; no style skill implements its own.

Universal checks (identical logic for all ten):

| Check | Rule |
|---|---|
| Text contrast | ≥ 4.5:1 normal, ≥ 3:1 for ≥ 24px or ≥ 19px bold. **Unrounded** — the W3C states values are not rounded, so 2.999:1 fails. |
| Non-text contrast (1.4.11) | Every control boundary ≥ 3:1 against both its fill and its surroundings. |
| Focus | A `:focus-visible` rule exists on every focusable element, uses `outline` not `box-shadow`, ≥ 2px (≥ 3px where the style specifies), with an offset, ≥ 3:1, and no `outline: none` survives without a replacement in the same rule. |
| Target size (2.5.8) | ≥ 24×24 CSS px hard floor; warn below 44×44; re-measure the axis-aligned bounding box after any `rotate`. |
| Forced colors | A `@media (forced-colors: active)` block exists, uses system colour keywords, gives every shadow-bounded element a real border, and hides decorative pseudo-elements. No `forced-color-adjust: none` on text-bearing elements. |
| Reduced motion | A `prefers-reduced-motion: reduce` block exists, zeroes durations, and — separately — does **not** remove any state-carrying property. |
| Reduced transparency | Required for any style emitting `backdrop-filter`, plus an in-app toggle, because Safari does not implement the media query. |
| Colour-only encoding | No state, error, selection or category conveyed by colour, depth, blur or shadow alone. |
| DOM order (1.3.2) | Warn on `order`, `row-reverse`, `grid-auto-flow: dense` or absolute positioning applied to sequential content. |

Style-specific checks stay in the style plugin's `references/checklist.md` because they encode style facts: neumorphism's same-hue invariant and `blur == 2 × distance` assertion, glassmorphism's ancestor backdrop-root scan, liquid-glass's nested-glass hard fail, spatial-ui's SC 2.5.7 dragging-alternative detection, bento's one-heading-per-tile and reading-flow guard.

**The strongest argument for centralising this:** the contrast function is the single most-repeated piece of logic across all ten specs and the single easiest to get subtly wrong. Every doc independently specifies unrounded comparison, and every doc independently specifies compositing alpha over a worst-case backdrop. One implementation, ten callers.

### 7.4 Host-framework detection — **core**

`ui-morphism-core:detect-stack`. One procedure, one output shape, called first by every style skill.

Detection inputs: `package.json` dependencies, `@import "tailwindcss"` versus `tailwind.config.*` (v4 versus v3), presence of `*.module.css`, `styled-components` / `emotion` imports, `Package.swift`, `build.gradle.kts` with `androidx.xr.*`, `app.vue` / `svelte.config.js` / `next.config.*`.

Output contract:

```json
{
  "framework": "react-ts",
  "styling": "tailwind-v4",
  "darkModeStrategy": "class",
  "existingTokenSystem": "shadcn",
  "componentRoot": "src/components/ui",
  "confidence": "high",
  "evidence": ["package.json: react@19, tailwindcss@4.1", "src/app.css: @import \"tailwindcss\""]
}
```

Two rules the shared skill enforces: **detection is always confirmed with the user, never applied silently** — this appears independently in six of the ten specs — and **`confidence: low` means ask, do not guess**. Standardising the output shape also means a style skill's emit step can branch on one enum instead of re-reading `package.json`.

### 7.5 Audit-report format — **core template, style-supplied rows**

`ui-morphism-core/assets/report-template.md` defines one shape:

1. **Summary** — style, intensity, scope, framework, files changed, pass/fail.
2. **Contrast table** — pair, computed ratio (3 decimal places, unrounded), required, verdict, auto-correction applied.
3. **Checklist** — universal checks first, style-specific after, each pass/fail with the failing selector.
4. **Budgets** — the numbers this style cares about: shadow-layer count, blurred-viewport percentage, glass-surface count, loud-layer count, composited layers, CSS bytes, font bytes, image bytes — against the doc's §8 budget.
5. **Corrections** — every token the skill changed on its own, with before, after and reason.
6. **Refusals** — every anti-pattern requested and declined, with the reason and the offered alternative.
7. **Manual TODOs** — what the skill could not verify statically.

Uniform reports mean a user who runs `minimalism-ui:audit` then `brutalism-ui:audit` can diff them, and it makes a future "compare three styles on this codebase" workflow trivial.

### 7.6 The line, stated plainly

| Concern | Core | Per-style | Why |
|---|---|---|---|
| Token grammar, group vocabulary, emitters, dark-mode shape, Tailwind mapping | ✅ | | Identical everywhere; the current per-doc drift is pure cost |
| Token *values* and which groups are populated | | ✅ | This *is* the style |
| Contrast maths, focus, target size, forced-colors, reduced-motion, reduced-transparency, colour-only, DOM order | ✅ | | Same rules, same spec, easiest thing to get subtly wrong |
| Style-specific invariants (same-hue, blur=2×distance, nested-glass, dragging alternative, one-heading-per-tile) | | ✅ | Encode style facts, not accessibility facts |
| Framework detection and its output contract | ✅ | | Six specs independently describe the same procedure |
| Component *emission* for a detected framework | | ✅ | Component anatomy is style-specific |
| Intensity 0-100 contract, clamp mechanism, context caps | ✅ | | The contract is what makes the number safe |
| Intensity → knob curves and clamp values | | ✅ | Per-style by definition |
| Audit report template and section order | ✅ | | Comparability across styles |
| Which budget numbers appear in the report | | ✅ | Each doc's §8 budget differs |
| Anti-pattern *refusal mechanism* (refuse, explain, offer alternative) | ✅ | | Same behaviour, different lists |
| The anti-pattern lists themselves | | ✅ | 11-13 style-specific items each |

**The case against a shared core, stated fairly.** It adds a dependency edge to every plugin, makes core's versioning a release bottleneck, and means a bug in `contrast.mjs` breaks all ten at once. The counter: the alternative is ten independent copies of a WCAG contrast implementation, which is a correctness surface, not a convenience one. Duplicating taste is fine; duplicating maths is not. Keeping core small — three skills, three scripts, one template, no components, no style values — bounds the blast radius.

---

## 8. Build order

Build `ui-morphism-core` first, then three style plugins as the proof of concept, chosen because they exercise three genuinely different transformation classes and between them touch every shared subsystem.

**0. `ui-morphism-core`** — nothing else can be built honestly without it. Ship `detect-stack`, `a11y-validate` (with `contrast.mjs` first; `audit-css.mjs` can start as a grep-level pass), and `token-emit` with only the CSS and Tailwind v4 outputs. Defer the SwiftUI and Compose emitters until a consumer needs them.

**1. `brutalism-ui`** — the proof that the pipeline works end to end.
Difficulty **low**, perf cost **low**, and the visual result is unambiguous, so a broken output is obvious at a glance rather than a matter of taste. The transformation is the simplest in the set: normalise radius toward 0, replace every blurred shadow with the nearest hard-offset step, add a border to every surface, remove `backdrop-filter`. It exercises token emission, component rewriting and the whole a11y validator, and it has one interesting validator case worth getting right early — the dark-mode border flip, since the most-copied reference library ships pure black borders on a dark surface at ≈1.6:1. Total emitted CSS is budgeted at ≤ 8 KB with 0 KB of JS, so the artefact is easy to inspect by hand. If `brutalism-ui` cannot produce a clean audit, nothing more ambitious will.

**2. `glassmorphism-ui`** — the proof that the validator is real.
Highest likely demand (every OS ships a translucent material and "make it frosted" is a constant request), and it is the style where naive output is *actively wrong*: the same `rgba(255,255,255,0.12)` panel measures 14.6:1 over `#0B0B12` and 1.57:1 over `#7DD3FC`. Building this second forces `contrast.mjs` to handle alpha compositing against a worst-case backdrop rather than a flat pair, which is the capability seven of the ten styles eventually need. It also forces the `@supports` fallback pattern, the `prefers-reduced-transparency` plus in-app-toggle pattern (Safari has no media query), and the blurred-area performance budget — all of which `liquid-glass-ui` and `spatial-ui` reuse verbatim.

**3. `bento-grid-ui`** — the proof that the architecture generalises beyond surface styling.
Difficulty low, perf cost low, but the transformation class is completely different: it restructures *markup and layout* rather than restyling surfaces. It reads existing content, classifies items, assigns spans by content weight, rewrites DOM order, and adds intrinsic media dimensions. If the core abstractions survive a skill that barely touches colour, they will survive the rest. It also surfaces the reading-order problem (`grid-auto-flow: dense` versus `reading-flow`, Chrome 137 only, not Baseline) early, which is the hardest a11y case in the set that is *not* about contrast.

**Then, in this order and for these reasons:**

4. **`minimalism-ui`** — high demand and mostly subtractive, but it needs the "affordance restoration" compensating pass, which is the first skill that has to *add* things back. Build it once `a11y-validate` is trustworthy enough to drive that pass.
5. **`neumorphism-ui`** — small audience but the best test of the refusal machinery, because the style's central move cannot be made compliant and the skill has to say so and offer the "clean neumorphism" variant instead.
6. **`claymorphism-ui`** — shares almost all of its machinery with neumorphism (inset stacks, hue-derived shadows, squish press), so it is cheap once 5 is done.
7. **`liquid-glass-ui`** — depends on everything glassmorphism built, plus SVG displacement generation and the three-tier `@supports` ladder. High value on Apple platforms, hard portability ceiling on the web; worth waiting until the SwiftUI emitter exists.
8. **`spatial-ui`** — depends on the glass work plus a depth ladder, counter-scale maths and the SC 2.5.7 dragging-alternative detector. Also the most likely to churn: `androidx.xr.compose` is still alpha with breaking changes as recent as July 2026.
9. **`maximalism-ui`** — the most bespoke and the hardest to automate well. Three loud layers, four typefaces, blend modes, a Calm-mode toggle component and role-bound accents that flip between themes. Build it last, when the refusal and budget machinery is mature.
10. **`skeuomorphism-ui`** — deliberately last despite being doc 01. Highest craft requirement, no reference component library to lean on, and the lowest measured real-world demand of the ten (never above 0.1% of 208,000+ generations). It is the best showcase and the worst first build.

**Milestone to aim at:** core + the first three plugins is a publishable v0.1.0. It covers a cheap style, an expensive style and a layout, proves the shared architecture across all three, and gives real usage data on the intensity contract before eight more plugins are locked to it.

---

## 9. Open questions

Decide these before writing code, because each one is expensive to reverse after publication.

**Distribution and packaging**

1. **One repository or eleven?** This plan uses one repo with relative-path sources, which keeps installs working from git or local and keeps private plugins private without extra grants. Splitting later means switching every entry to a `github` source and losing the atomic-commit property between a doc and its plugin. Decide now.
2. **Does the marketplace ship the docs too?** The `docs/` directory is the source of truth, and skills reference it in `metadata.sourceDoc`, but nothing loads it at runtime. Either accept the duplication between `docs/NN-style.md` §4 and `plugins/<name>/skills/apply/references/tokens.md`, or generate the references from the docs in CI. Duplication drifts; generation adds a build step.
3. **Versioning policy.** `version` may be set in `plugin.json`, in the marketplace entry, or both — and `plugin.json` wins when both are set. Pick one authoritative location. Then decide whether all eleven version in lockstep (simple, noisy) or independently (accurate, and requires tracking which core version each style needs).
4. **`defaultEnabled`.** All eleven default to `true`. Should `ui-morphism-core` ship `defaultEnabled: false` so it activates only via the dependency edge? Dependency resolution writes `true` for a required plugin anyway, so this mainly affects a user who installs core directly.

**Skill design**

5. **Two skills per plugin, or one with a mode argument?** `apply` and `audit` have genuinely different risk profiles — one writes files, one does not — and separate skills let `audit` be safely model-invoked while `apply` might warrant `disable-model-invocation: true`. Against: twenty-two skill descriptions in context instead of eleven.
6. **Should `apply` be `disable-model-invocation: true`?** It rewrites source files. Setting it true means only the user can trigger it, at the cost of Claude never reaching for it during a broader task. Recommendation: leave `apply` model-invocable but make the scoping step mandatory and confirmed; set it true only if real usage shows unwanted rewrites.
7. **How do ten overlapping descriptions avoid stealing each other's triggers?** "Make it feel soft and physical" legitimately matches skeuomorphism, neumorphism and claymorphism. Options: negative triggers in each `description` (used in §5's example), or a single `ui-morphism-core:choose-style` router skill that reads the request and hands off. The router is cleaner but adds a hop, and a router that picks wrong is worse than three descriptions that overlap honestly.
8. **`context: fork`?** A style transformation across a component directory generates a lot of intermediate output. Running `apply` in a forked subagent keeps the main thread clean, but the user loses visibility into a long file-rewriting operation. Probably no for `apply`, plausibly yes for `audit`.
9. **How wide should `allowed-tools` be?** The §5 example pre-approves only `Read Glob Grep Edit Write` plus one exact bundled script path. Broadening it to bare `Bash` would let the skill run the project's own formatter and linter after rewriting — convenient, and a much larger grant. Note that a project-level skill's `allowed-tools` takes effect once the workspace trust dialog is accepted, so this is a real trust surface.

**Technical**

10. **How much of the validator is static analysis versus rendered?** Contrast on declared token pairs is computable from CSS text. Contrast of *composited* glass over an arbitrary backdrop, and computed target size after a `rotate`, are not — they need a headless browser. Does core take a Playwright or Chrome DevTools dependency, or does it report those as manual TODOs? This decision determines whether `glassmorphism-ui`'s central claim can be verified or only estimated.
11. **Which frameworks are v1?** Every doc lists five to eight targets. Emitting vanilla CSS plus Tailwind v4 plus React/TS covers most demand; SwiftUI matters for `liquid-glass-ui`, and Compose XR only for `spatial-ui`. Shipping a half-working Vue path is worse than shipping none.
12. **Do the skills write files or propose diffs?** Every spec says the skill emits files. A dry-run mode that prints the audit and the diff without writing would make the first use of any style skill far less alarming. Should `--dry-run` be universal, and should it be the default on first invocation in a repository?
13. **Where does the `--um-*` migration happen?** Publishing skills that emit `--um-<style>-*` while the docs still show `--sk-*`, `--nm-*` and friends guarantees confusion. Either update all ten docs' §4 and §5 first, or have the skills emit both names with the legacy set aliased to the new one for one release.
14. **Is there a `hooks` story?** A `PostToolUse` hook on `Write|Edit` that re-runs `a11y-validate` on any file a style skill touched would make the validator continuous rather than end-of-run. It is also the kind of thing that gets annoying fast. Worth prototyping in core behind an off-by-default setting.
