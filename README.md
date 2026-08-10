# ui-morphism

Ten UI style languages, researched to a common fourteen-section template, and turned into Claude Code
plugins. Each style doc carries token tables, working CSS, React / Tailwind / SwiftUI recipes, measured
contrast ratios, performance budgets and a sourced timeline. Each plugin turns that doc into two skills:
`apply`, which writes tokens and components into your codebase, and `audit`, which reviews an existing
implementation and writes a report without touching anything.

The research in [`docs/`](./docs/) is the source of truth. The plugins are generated from it, not the
other way round.

---

## The ten styles

Ratings are the verbatim frontmatter values from each doc; [`docs/README.md`](./docs/README.md#what-the-ratings-mean)
explains what they mean and adds the difficulty column.

| # | Style | The defining move | Status 2026 | A11y risk | Perf cost | Plugin |
|---|---|---|---|---|---|---|
| 01 | [Skeuomorphism](./docs/01-skeuomorphism.md) | Borrowed physical texture and lighting — one light source, four shadow layers | revival | Medium | Medium | `skeuomorphism-ui` — planned |
| 02 | [Neumorphism](./docs/02-neumorphism.md) | Same-hue surface extruded by two opposing shadows; structurally unable to reach 3:1 | accent-only | High | Medium | `neumorphism-ui` — planned |
| 03 | [Glassmorphism](./docs/03-glassmorphism.md) | Semi-transparent panel that blurs and re-saturates its backdrop, edged with a hairline border | mainstream | High | Medium | **`glassmorphism-ui` — built** |
| 04 | [Claymorphism](./docs/04-claymorphism.md) | Fat radii, pastel fill, an inflated dome of inset light and shade floating above the page | niche | Medium | Medium | `claymorphism-ui` — planned |
| 05 | [Minimalism](./docs/05-minimalism.md) | Subtraction with compensation — buy back structure with whitespace, type scale, one accent | mainstream | Medium | Low | `minimalism-ui` — planned |
| 06 | [Maximalism](./docs/06-maximalism.md) | Three or more overlapping loud planes, held in check by a hard layer budget | mainstream | High | High | `maximalism-ui` — planned |
| 07 | [Brutalism & Neubrutalism](./docs/07-brutalism.md) | Hard 2–4px borders and zero-blur offset shadows on flat saturated fills | mainstream | Medium | Low | **`brutalism-ui` — built** |
| 08 | [Liquid Glass](./docs/08-liquid-glass.md) | Apple's system material — refracts the backdrop through a lensed edge; glassmorphism plus displacement | dominant | High | High | `liquid-glass-ui` — planned |
| 09 | [Bento Grid](./docs/09-bento-grid.md) | Size-as-hierarchy inside a locked gutter: variable tile spans, invariant gap | mainstream | Medium | Low | **`bento-grid-ui` — built** |
| 10 | [Spatial UI](./docs/10-spatial-ui.md) | Panels at measured depths, counter-scaled so angular size holds constant | emerging | High | Medium | `spatial-ui` — planned |

Three companion docs sit alongside them: [00-comparison-matrix.md](./docs/00-comparison-matrix.md) flattens
all ten into comparable rows, [MARKETPLACE.md](./docs/MARKETPLACE.md) is the plugin build plan, and
[GLOSSARY.md](./docs/GLOSSARY.md) defines every term the docs assume.

---

## Built versus planned

All ten style docs are complete. **Four plugins exist**: `ui-morphism-core` and the three style plugins
chosen in [MARKETPLACE.md §8](./docs/MARKETPLACE.md) because they exercise three genuinely different
transformation classes — `brutalism-ui` (cheap surface restyle), `glassmorphism-ui` (expensive surface
restyle, and the style where naive output is actively wrong), `bento-grid-ui` (layout and markup rather
than surfaces).

The other seven are planned and unbuilt. They are deliberately **not** listed in `marketplace.json`: a
catalog entry is an install offer, and an entry pointing at a directory that does not exist fails at
install time with a bare `Source path does not exist` error. The roadmap lives here and in
MARKETPLACE.md §8; the catalog stays installable.

```text
.claude-plugin/marketplace.json   the catalog — four entries today
check-plugins.sh                  the plugin gate — tests, manifests, stylesheets, contracts, skills
docs/                             the research — source of truth, and its own two CI scripts
plugins/                          ui-morphism-core, brutalism-ui, glassmorphism-ui, bento-grid-ui
```

---

## Install

```
/plugin marketplace add Shubham7995/ui-morphism
/plugin install brutalism-ui@ui-morphism
```

The repository is private, so the GitHub source resolves only for an account with access. A local clone
always works and is the better path while the plugins are still moving:

```
git clone https://github.com/Shubham7995/ui-morphism.git
/plugin marketplace add /absolute/path/to/ui-morphism
```

Installing any style plugin pulls in `ui-morphism-core` automatically — it is declared in each style's
`dependencies`, and Claude Code enables a plugin required by an active one. Skills are namespaced by
plugin, so they invoke as `/brutalism-ui:apply`, `/glassmorphism-ui:audit`, and so on.

Before publishing, run the gate — it validates the catalog and all four plugin manifests, and twelve
other things besides:

```
./check-plugins.sh
```

---

## What this is not: descriptive, not normative

There is a good and growing set of design tools for Claude Code — Anthropic's first-party
`frontend-design`, `impeccable` with its brand and product modes and its 59 anti-AI-slop detectors,
`taste-skill` with its variance, motion-intensity and visual-density metrics, `emilkowalski/skills` for
animation craft, `ui-ux-pro-max`, `dataviz`. They are **normative**: they answer "make this better", and
for that question there is broadly one right answer. `accesslint` is normative in the same way about a
different axis, and it does something nothing here can: it drives a real browser and audits the live
DOM and accessibility tree.

ui-morphism answers a different question. It is **descriptive and plural**: ten named visual languages,
each with measured token values, a performance budget, a sourced timeline and an explicit
when-not-to-use. It has no opinion about whether your interface should be brutalist. It has a great deal
of measured detail about what happens if you decide it should be, including the cases where the honest
answer is "this style cannot be made compliant here, and here is the variant that can".

That difference is encoded in the skill descriptions, deliberately and at some cost to how often they
fire. **Every `apply` and `audit` skill triggers only on a named style or a concretely described one** —
"neubrutalist", "hard offset shadow", "frosted glass", "backdrop blur", "bento grid", "asymmetric feature
tiles". None of them triggers on "make it look good", "make it modern", "polish this", "clean this up",
"improve the design" or "make it less AI-generated". Those requests belong to the normative tools, and a
description that swallowed them would make this a bad citizen on a machine that already has one
installed. Animation is out of scope for the same reason in reverse: each doc's §6 motion material is
competent, and it is thin next to a skill built from a full animation course, so no skill here bids for
"animate this". The same applies to accessibility and to stack detection, which are the two places core
could most easily overreach: `ui-morphism-core:a11y-validate` bids only for worst-case *composited*
contrast over a translucent surface — the one measurement a static checker gets wrong and a live-DOM
auditor cannot see from CSS text — and hands "audit my site's accessibility" to a tool that drives a
browser. `ui-morphism-core:detect-stack` has nothing to contribute unless a ui-morphism style has
already been named, and says so.

The negative triggers therefore run in two directions: away from the nine sibling languages, and away
from general design-quality, taste, de-slopping, animation-craft, accessibility-sweep and
project-survey work. That clause sits at the end of every skill description, which is exactly where a
listing-cap truncation would silently remove it — hence check 9 of `./check-plugins.sh`, which asserts
both halves: that every description still carries the clause, and that it ends inside the listing cap.

---

## Architecture: one core, ten styles

The rule for what lives in `ui-morphism-core` is that anything whose correct answer is identical across
all ten styles — or whose wrong answer is a correctness bug rather than a taste disagreement — belongs
there. So core owns the `--um-<style>-<group>-<variant>` token grammar and its emitters, the dark-mode
emission shape, host-framework detection and its output contract, the WCAG 2.2 contrast and forced-colors
validator, the intensity 0–100 contract with its clamp and context-cap mechanism, and the shared
audit-report template. Each style plugin owns only what makes it that style: token *values*, which groups
it populates, component anatomy, its intensity-to-knob curves and clamp values, and its own anti-pattern
refusal list. The trade is real — a bug in core's `contrast.mjs` breaks all four plugins at once — but the
alternative is ten independent implementations of WCAG contrast maths, and duplicating taste is fine while
duplicating maths is not. The full division of labour is in
[MARKETPLACE.md §7](./docs/MARKETPLACE.md).

---

## CI

Two gates. One covers the research, one covers the artefact built from it. Both print every offence in
every category rather than the first, and both exit non-zero once, at the end.

```
./check-plugins.sh              # the artefact: plugins/, the manifests and the catalog
(cd docs && ./check-links.sh)   # the research: preflight + ten checks, the last of them numeric
```

**`./check-plugins.sh`** needs `bash`, `node` v22+ and the `claude` CLI. It runs every `*.test.mjs`
under `plugins/` through `node --test` and counts the assertions those tests actually execute, per
file, against a committed baseline — because `node --test` counts each FILE as a passing subtest, so
`# pass` alone cannot tell a suite from an empty one; validates the marketplace manifest and every
plugin manifest with `claude plugin validate --strict`; holds each
`plugins/<style>/skills/apply/assets/tokens.css` against its owning doc's §4 CSS block
declaration-for-declaration in both directions, and the Tailwind `@theme` mirror, the `--um-*` bridge
and `glass.layer.css` against that `tokens.css` and the doc; holds every
`assets/intensity.contract.json` against its owning doc's §13 — the default intensity, both endpoints
of every knob, and every context cap against a committed registry; resolves every marketplace `source`
to a directory carrying a `.claude-plugin/plugin.json` and checks its name equals the entry name;
parses every `SKILL.md` frontmatter, rejects a space-separated `allowed-tools` scalar, prints every
description length against the 1,450-character budget and asserts the deference clause is still in it;
resolves every `references/`, `assets/` or `scripts/` path a `SKILL.md` names; traces every `N:1`
contrast figure the plugin tree prints back to a figure the docs print; keeps `.claude-plugin/`
directories manifest-only; and asserts the WCAG contrast arithmetic exists in exactly one file, with
nothing outside `ui-morphism-core` so much as naming it.

**`docs/check-links.sh`** needs `bash` and `python3`. It verifies link targets, the fourteen-heading
contract, Tailwind v4 `@theme` and bracket-syntax rules, phantom tokens against a per-doc row-coverage
ratchet, theme-selector discipline, target-token wiring, cross-referenced token names against a count
ratchet, and dead tokens, then shells out to `docs/check-contrast.py` for the numeric half.
`./check-contrast.py` also runs standalone — `--verbose` for the exclusion list, `--json` for findings.

Neither script skips. A missing prerequisite — no `python3`, no `node`, no `claude` — is reported
loudly **and fails the run**, because CI reads the exit code and not the log, and a check that did not
run did not pass. The same rule covers an empty glob: zero test files, zero token layers or zero
catalog entries is a failure, never a quiet `ok`.

**What a green run does not prove.** For the research half, the authoritative account is
[what a green run proves, and what it does not](./docs/README.md#what-a-green-run-proves-and-what-it-does-not).
Read it before trusting `All structural checks passed.` — it is specific about how many contrast
figures are actually recomputed, about the alpha-composited ones that no tool can recompute and that
are hand-verified instead, and about the checks whose scope is narrower than the doc set. For the
plugin half: `check-plugins.sh` proves the artefact agrees with the research and with itself. It never
runs a skill, renders nothing, and has no way to tell whether a description triggers when it should.
The deference clauses that keep these skills off the incumbent tools' territory are held two ways —
the clause must be present, and it must end inside the listing cap, since it sits in the tail of each
description and the tail is what truncation eats first — but "present" is not "effective", and no gate
here can tell you that a description actually loses the requests it means to lose.

The script's own header carries the current list of what it does **not** gate — `glass.layer.css`'s
ordinary declarations, the plugin READMEs, whether an `allowed-tools` entry names a tool that exists,
the arithmetic (as opposed to the provenance) of a contrast figure restated in a reference file, and
the one intensity cap in the set whose number appears in no doc. Read it before trusting
`All plugin checks passed.` Every defect that gate now catches got in through a class nobody had
written down, so the list is part of the deliverable and not a footnote to it.

---

## Contributing to the research

`docs/` is the source of truth for every plugin, so a change there is a change to the artefact. To refresh
research: re-verify the numbered sources in each doc's §14, update the moving facts first, bump
`last_researched` in the frontmatter of every doc you touched, and re-run `docs/check-links.sh`. Hand-check
any alpha-composited contrast figure you edit — CI will stay green over a wrong one.

Editing a **§4 token block** of a doc that has a plugin is the one change that must not stop there: the
plugin's `skills/apply/assets/tokens.css` is that block, verbatim, and `./check-plugins.sh` compares the
two declaration-for-declaration. Change the doc, re-copy the block, run both scripts.

---

## License

MIT. See [LICENSE](./LICENSE).
