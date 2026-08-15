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
| 01 | [Skeuomorphism](./docs/01-skeuomorphism.md) | Borrowed physical texture and lighting — one light source, four shadow layers | revival | Medium | Medium | **`skeuomorphism-ui`** |
| 02 | [Neumorphism](./docs/02-neumorphism.md) | Same-hue surface extruded by two opposing shadows; structurally unable to reach 3:1 | accent-only | High | Medium | **`neumorphism-ui`** |
| 03 | [Glassmorphism](./docs/03-glassmorphism.md) | Semi-transparent panel that blurs and re-saturates its backdrop, edged with a hairline border | mainstream | High | Medium | **`glassmorphism-ui`** |
| 04 | [Claymorphism](./docs/04-claymorphism.md) | Fat radii, pastel fill, an inflated dome of inset light and shade floating above the page | niche | Medium | Medium | **`claymorphism-ui`** |
| 05 | [Minimalism](./docs/05-minimalism.md) | Subtraction with compensation — buy back structure with whitespace, type scale, one accent | mainstream | Medium | Low | **`minimalism-ui`** |
| 06 | [Maximalism](./docs/06-maximalism.md) | Three or more overlapping loud planes, held in check by a hard layer budget | mainstream | High | High | **`maximalism-ui`** |
| 07 | [Brutalism & Neubrutalism](./docs/07-brutalism.md) | Hard 2–4px borders and zero-blur offset shadows on flat saturated fills | mainstream | Medium | Low | **`brutalism-ui`** |
| 08 | [Liquid Glass](./docs/08-liquid-glass.md) | Apple's system material — refracts the backdrop through a lensed edge; glassmorphism plus displacement | dominant | High | High | **`liquid-glass-ui`** |
| 09 | [Bento Grid](./docs/09-bento-grid.md) | Size-as-hierarchy inside a locked gutter: variable tile spans, invariant gap | mainstream | Medium | Low | **`bento-grid-ui`** |
| 10 | [Spatial UI](./docs/10-spatial-ui.md) | Panels at measured depths, counter-scaled so angular size holds constant | emerging | High | Medium | **`spatial-ui`** |

Three companion docs sit alongside them: [00-comparison-matrix.md](./docs/00-comparison-matrix.md) flattens
all ten into comparable rows, [MARKETPLACE.md](./docs/MARKETPLACE.md) is the plugin build plan, and
[GLOSSARY.md](./docs/GLOSSARY.md) defines every term the docs assume.

---

## The complete set

All ten style docs are complete and **all eleven plugins exist** — `ui-morphism-core` plus one plugin per
style — so `marketplace.json` lists eleven entries and every one of them resolves to a directory on disk.
There is no roadmap column left: [MARKETPLACE.md §8](./docs/MARKETPLACE.md) records the order they were
built in and why, which is still the best short account of what each one exercises, but it is now history
rather than a plan.

A catalog entry is an install offer, and an entry pointing at a directory that does not exist fails at
install time with a bare `Source path does not exist`. That constraint is what kept the catalog at four
entries while seven plugins were unbuilt; it is satisfied by construction now, and `check-plugins.sh`
check 6 re-asserts it on every run rather than trusting it.

```text
.claude-plugin/marketplace.json   the catalog — eleven entries, one per plugin
check-plugins.sh                  the plugin gate — tests, manifests, stylesheets, contracts, skills
docs/                             the research — source of truth, and its own two CI scripts
plugins/                          ui-morphism-core + ten style plugins, 23 skills, 15 test files
```

`PLUGIN_COUNT` in `check-plugins.sh` is 11 and still load-bearing in the other direction: a twelfth
directory under `plugins/` — a scratch copy, a half-started style with no doc behind it — fails the
preflight rather than riding along.

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

Every `apply` skill takes `--dry-run`, and it means the strict thing. The run happens in full — stack
detection, intensity resolution, token emission, component rewriting, and a real
`ui-morphism-core:a11y-validate` pass over the CSS it actually produced — so the contrast table and
the budgets are measurements, not estimates. Only the destination changes: the proposed output lands
in a scratch directory outside your project, nothing in the project tree is created or modified, no
report file is written, and the report comes back in the reply with the scratch path named in it. It
is opt-in rather than the default, because a skill invoked by name against a confirmed scope was asked
to do something. The `audit` half of every pair is the other way to look before touching anything: it
holds no `Write` grant at all, so it cannot write whatever it is told to.

Before publishing, run the gate — it validates the catalog and all eleven plugin manifests, and twelve
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

### Routing: three clusters where the languages read alike

Ten descriptions competing for the same request is the failure mode that costs most, and it is not evenly
distributed. Seven of the ten are separated by their own names. Three clusters are not, because a user who
does not already know the vocabulary describes all the members of a cluster the same way. Each cluster is
therefore split by one physical question, stated in capitals in every description in it, in both the
`apply` and the `audit` skill:

| Cluster | The question | Routes to |
|---|---|---|
| Soft and physical | Does the surface imitate a named material? | yes → `skeuomorphism-ui` |
| | Is it the same colour as the page ground? | yes → `neumorphism-ui` |
| | Does it carry its own pastel fill, inflated at a large radius? | yes → `claymorphism-ui` |
| Translucent layered depth | Is the backdrop blurred and nothing else? | yes → `glassmorphism-ui` |
| | Is the backdrop geometrically displaced — refracted, lensed? | yes → `liquid-glass-ui` |
| | Is there a `perspective` camera with elements at measured `translateZ`? | yes → `spatial-ui` |
| Flat and stark | Does the request SUBTRACT — hairlines, near-zero elevation, one accent? | yes → `minimalism-ui` |
| | Does it ADD weight — 2–5px ink borders, hard offset shadows, loud fills? | yes → `brutalism-ui` |

Two name collisions are called out explicitly rather than left to chance, because they are genuine
synonyms pointing opposite ways: **"neo-skeuomorphism" is `skeuomorphism-ui`; "new skeuomorphism" is
`neumorphism-ui`.** Both descriptions say so.

Outside the clusters the discriminators are one line each: `maximalism-ui` stacks layers where
`brutalism-ui` is one bordered plane, and `bento-grid-ui` restructures markup and layout rather than
restyling surfaces, so it composes with any of the ten rather than competing with them.

None of this is gated. `check-plugins.sh` check 9 asserts every description is under budget and still
carries its deference clause; nothing here can tell you a description routes correctly, and the routing
above is a design claim, not a measured one.

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
refusal list. The trade is real — a bug in core's `contrast.mjs` breaks all ten style plugins at once — but the
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
`assets/intensity.contract.json` against its owning doc's §13 — the default intensity, the knob set in
both directions, both endpoints of every knob to whatever depth the doc's own table shape supports, and
every context cap against a committed registry; resolves every marketplace `source`
to a directory carrying a `.claude-plugin/plugin.json` and checks its name and, where the entry
states one, its version against that manifest — `claude plugin validate` does neither, and in fact
accepts a `source` pointing at a directory that does not exist;
parses every `SKILL.md` frontmatter, rejects a space-separated `allowed-tools` scalar, prints every
description length against the 1,450-character budget and asserts the deference clause is still in it;
resolves every `references/`, `assets/` or `scripts/` path a `SKILL.md` names; traces every `N:1`
contrast figure the plugin tree prints back to a figure the docs print; keeps `.claude-plugin/`
directories manifest-only; asserts the WCAG contrast arithmetic exists in exactly one file, with
nothing outside `ui-morphism-core` so much as naming it; and holds the ten `apply` skills' `--dry-run`
contract byte-identical, in the argument hint, the Inputs table and the `## Dry run` section alike.

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
the arithmetic (as opposed to the provenance) of a contrast figure restated in a reference file, the one
intensity cap in the set whose number appears in no doc, and the two contracts whose knob endpoints their
docs state as prose rather than as values. Read it before trusting
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
