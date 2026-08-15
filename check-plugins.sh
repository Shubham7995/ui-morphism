#!/usr/bin/env bash
# Structural CI check for the ui-morphism plugin tree.
#
# ./docs/check-links.sh gates the research. Nothing gated the artefact built from
# it: the unit tests, the plugin manifests, the marketplace and the skills, none
# of them run by anything. This is that gate. The tree it now covers is complete
# — eleven plugins, ui-morphism-core plus one for each of the ten researched
# styles, with 493 tests over 15 files and 23 skills.
#
#   0. preflight: the plugin set on disk, the marketplace catalog and the tables
#      in this file all name the same plugins
#   1. `node --test` over every plugins/**/*.test.mjs, with the ASSERTIONS THOSE
#      TESTS EXECUTE counted and held against a committed per-file baseline.
#      Zero test files is a FAILURE; so is a file that asserts less than it did
#      when its baseline was recorded
#   2. `claude plugin validate --strict` on the repo root and on every plugin
#      directory
#   3. token fidelity: every plugins/<style>/skills/apply/assets/tokens.css
#      matches its owning doc's §4 CSS block declaration-for-declaration, in both
#      directions — missing, extra, and value-mismatched
#   4. the rest of the shipped stylesheet set: the Tailwind `@theme` mirror
#      carries tokens.css's VALUES, the `--um-*` bridge and the style layer
#      resolve every var() they read, and every literal they state is traceable
#      to tokens.css or to the owning doc
#   5. assets/intensity.contract.json against the owning doc §13: the default
#      intensity, the knob set itself, both endpoints of every knob to whatever
#      depth the doc's own table shape supports, and every context cap against a
#      committed registry
#   6. every marketplace source resolves to a directory that exists and holds a
#      .claude-plugin/plugin.json, every plugin.json name equals its marketplace
#      entry name exactly, and every entry that states a `version` states the
#      one its manifest ships
#   7. every skill directory holds a SKILL.md whose frontmatter parses and
#      carries `name` and `description`, with `name` equal to the directory
#   8. `allowed-tools` is a comma-separated scalar or a YAML list — never the
#      space-separated scalar the frontmatter contract does not read
#   9. no SKILL.md description exceeds DESC_MAX characters, and every one of them
#      still carries the deference clause. Every length is printed, whether it
#      passes or not, so drift is visible before it bites
#  10. every references/, assets/ or scripts/ path a SKILL.md names is on disk
#  11. every `N:1` contrast figure a plugin file prints is a figure its owning
#      doc prints — the plugin corpus restates the research's numbers and may not
#      invent one
#  12. nothing but plugin.json inside a plugin's .claude-plugin/, and nothing but
#      marketplace.json inside the repo root's
#  13. the contrast / luminance / alpha-compositing arithmetic lives in exactly
#      one file, and nothing outside ui-morphism-core so much as names it
#  14. every `apply` skill offers `--dry-run` — in its argument-hint, in its
#      Inputs table, and as the shared `## Dry run` section, byte-identical
#      across all ten
#  15. the report contract against audit-css.mjs's exported CHECKS: the seven
#      sections in every style skill match core's report-template.md headings in
#      order, and every prose copy of the nine universal rows — the template,
#      a11y-validate's own table, docs/MARKETPLACE.md §7.3, and all twenty
#      skills' §3 — names all nine, in the array's order where it is a table
#
# Conventions are check-links.sh's, deliberately: the same `==> checking …` /
# `  ok` shape, every offence in every category printed rather than the first,
# accumulate-then-exit-once, portable bash. Its two hardest-won lessons are
# carried over verbatim:
#
#   * A CHECK THAT CANNOT RUN FAILS. Missing node, missing claude, a doc with no
#     §4, a plugin with no registered owning doc, an empty glob, a baseline
#     nobody recorded — each of these prints a loud NOTRUN/MISSING and fails the
#     run. CI reads the exit code, not the log, so a skip that exits 0 is a
#     silent pass in louder type.
#   * NO KEYWORD SUPPRESSION LISTS. Where something is exempt it is exempt
#     structurally and the structure is stated at the check. Check 13 is the one
#     that would most obviously invite a list of "files allowed to say
#     contrastRatio"; it does not have one — see the note there.
#
# WHAT IS STILL NOT GATED, written down here because an ungated artefact class
# that nobody has written down is how every defect this gate now catches got in:
#
#   * glass.layer.css's ordinary CSS declarations — padding, radius, the ground
#     gradient's stops — are not held against anything. Check 4 gates its var()
#     references and its COLOUR literals; a wrong `12px` in it passes.
#   * plugins/*/references/*.md prose is gated only for the contrast figures it
#     prints (check 11) and only for PROVENANCE, not for arithmetic. A figure the
#     owning doc also states is inherited as correct from
#     docs/check-contrast.py, which recomputes the doc side; a figure swapped for
#     a DIFFERENT figure the same doc also states is not caught. Wiring
#     docs/check-contrast.py over plugins/**/*.md directly was tried and is not
#     wired: measured, it extracts 162 claims and verifies 25 of them, and it
#     reports 4 MISMATCHes on prose that names two ground colours and two ratios
#     without naming the text colour in the same clause. The doc's own copy of
#     that sentence resolves correctly; the plugin copies are reworded. Those are
#     SKILL.md wording defects, not gate defects, and gating on them today would
#     fail the run for a reason no edit here can fix.
#   * README.md and plugins/*/README.md are not checked at all.
#   * `allowed-tools` ENTRIES are checked for shape, not for existence: check 8
#     knows that `Bash(node …)` is well formed, and cannot know whether `Bash` is
#     a tool this platform has. That needs a live tool registry.
#   * bento-grid-ui's `tileSource: cms` intensity cap of 25 is the one context
#     cap in the set whose number appears nowhere in its owning doc — §13 states
#     no number and §9 states the constraint in prose. It is pinned by the
#     registry in cap_of() below and is NOT doc-gated. See the note there.
#   * skeuomorphism-ui's and minimalism-ui's knob ENDPOINT VALUES are not
#     doc-gated. Docs 01 and 05 write their §13 endpoint columns as prose — "no
#     shadows", "flat fill", "Dense, 12-24px section rhythm" — rather than as
#     values, so there is no number on the doc side to compare. Check 5 gates
#     their knob SET in both directions and says plainly that the endpoints are
#     ungated. See knob_table_shape_of().
#   * check 11's DOC-side figure pool is extracted from the whole doc, fenced
#     code included, because docs do state real figures inside fences. That pool
#     therefore also carries about a dozen values that are not contrast figures
#     at all — font-weights, a scale() argument, some alphas — and any of them
#     could source a plugin figure no doc actually claimed. The plugin side is
#     stripped; the doc side is not. See the note at the check.
#   * check 14 compares the ten `## Dry run` sections against EACH OTHER, with
#     the first-sorting apply skill as the reference. There is no external spec
#     for that text, so an edit applied uniformly to all ten passes. Green there
#     means consistent, never right. Check 15 does NOT have that weakness — its
#     authority is an exported array in the code that runs — but it reaches only
#     the section list and the nine row names. Everything else in a report-shape
#     section is prose: the column headers each section states, the wording of
#     what belongs in a row, the report's filename. None of that is compared.
#   * nothing verifies that `--dry-run` BEHAVES — that a run actually leaves the
#     project tree untouched and names its scratch path. No gate here runs a
#     skill, so every behavioural promise in a SKILL.md is text this script can
#     confirm the presence of and nothing more.
#   * check 3 compares tokens.css against ONE registered ```css fence per doc.
#     A second fence in a doc's §4 is registered in sec4_fences_of() and is not
#     compared against anything — today that is doc 02's alternative OKLCH
#     derivation, which no plugin ships.
#
# Exits non-zero once, after printing every offence in every category.

set -uo pipefail
cd "$(dirname "$0")" || exit 2

fail=0

# Scratch space for the assertion counter check 1 preloads into `node --test`.
# Removed on every exit path, including a failing one.
tmpdir=$(mktemp -d 2>/dev/null) || tmpdir=''
trap '[ -n "$tmpdir" ] && rm -rf "$tmpdir"' EXIT

# ----------------------------------------------------------------- registry ---

# The plugins built so far. docs/MARKETPLACE.md §8 plans eleven — core plus ten
# styles — and the set is now complete: every one of the ten researched styles
# has a plugin, and there is no eleventh style to add. This is the number that
# makes growing the set a reviewed act rather than an accident, exactly as
# DOC_COUNT does in check-links.sh. Changing it is the last step of adding a
# plugin, not the first.
#
# The set being COMPLETE does not make this constant dead. It now guards the
# other direction: a twelfth directory under plugins/ — a scratch copy, a
# half-started style with no doc behind it, an accidental `cp -r` — fails the
# preflight loudly rather than riding along. Verified by mutation: `mkdir
# plugins/zzz-ui` prints PLUGINSET found 12 … expected 11 and exits non-zero.
PLUGIN_COUNT=11

# The doc whose §4 owns each plugin's token layer, and whose §13 owns its
# intensity contract. A plugin with no entry here FAILS the preflight: this is a
# registry, not a skip-list.
#
# `-` means "declares no style token layer". ui-morphism-core is the only such
# plugin, and checks 3, 4 and 5 hold it to that by failing if a `-` plugin turns
# out to ship a tokens.css or an intensity contract after all — so `-` cannot be
# used to hide an artefact from a fidelity check.
doc_of() {
  case "$1" in
    ui-morphism-core)  echo '-'                         ;;
    skeuomorphism-ui)  echo 'docs/01-skeuomorphism.md'  ;;
    neumorphism-ui)    echo 'docs/02-neumorphism.md'    ;;
    glassmorphism-ui)  echo 'docs/03-glassmorphism.md'  ;;
    claymorphism-ui)   echo 'docs/04-claymorphism.md'   ;;
    minimalism-ui)     echo 'docs/05-minimalism.md'     ;;
    maximalism-ui)     echo 'docs/06-maximalism.md'     ;;
    brutalism-ui)      echo 'docs/07-brutalism.md'      ;;
    liquid-glass-ui)   echo 'docs/08-liquid-glass.md'   ;;
    bento-grid-ui)     echo 'docs/09-bento-grid.md'     ;;
    spatial-ui)        echo 'docs/10-spatial-ui.md'     ;;
    *)                 echo ''                          ;;
  esac
}

MARKETPLACE='.claude-plugin/marketplace.json'
CORE='plugins/ui-morphism-core'

# COMMITTED PER-FILE ASSERTION BASELINE for check 1 — how many assert calls each
# test file actually EXECUTES in a clean run. Same shape and same semantics as
# check-links.sh's row_baseline_of(): a drop FAILS, a rise prints a `ratchet`
# advisory asking for the number here to be raised, and a file with no entry
# FAILS rather than being skipped.
#
# WHY THIS EXISTS, AND WHY IT IS NOT A TEST COUNT. The previous revision of this
# check guarded vacuity with `# pass > 0`, and that guard could never fire.
# `node --test` in explicit-file mode counts every FILE as a top-level passing
# subtest, so `# pass` is bounded below by the number of files handed to it.
# Proven by mutation: truncating all seven *.test.mjs to zero bytes prints
# "7 test file(s) / tests 7 / pass 7 / fail 0", says `ok`, and exits 0 — the
# entire suite deleted in substance, the gate green, in the check written to
# prevent exactly that.
#
# So the number held here is assertions EXECUTED, not tests declared. It is
# measured, not derived: check 1 preloads a module into `node --test` that wraps
# every entry point of node:assert and node:assert/strict and records the call
# count per test file at process exit. Executed rather than static because a
# static grep counts an assertion sitting behind an early return, inside a
# `test.skip`, or in a helper nothing calls; the executed count is the only one
# that answers "did this suite actually assert anything".
#
# Measured today, all fifteen files, on the complete eleven-plugin set. The two
# four-figure counts are not typos: assign-spans sweeps 0-100 asserting per step,
# and displacement-map asserts per pixel over a generated squircle profile.
assert_baseline_of() {
  case "$1" in
    plugins/bento-grid-ui/skills/apply/scripts/assign-spans.test.mjs)            echo 6280 ;;
    plugins/claymorphism-ui/skills/apply/scripts/clay-scan.test.mjs)             echo   69 ;;
    plugins/glassmorphism-ui/skills/apply/scripts/glass-scan.test.mjs)           echo   40 ;;
    plugins/liquid-glass-ui/skills/apply/scripts/displacement-map.test.mjs)      echo 4233 ;;
    plugins/liquid-glass-ui/skills/apply/scripts/lg-scan.test.mjs)               echo   70 ;;
    plugins/maximalism-ui/skills/apply/scripts/max-scan.test.mjs)                echo  302 ;;
    plugins/minimalism-ui/skills/apply/scripts/quantize-scan.test.mjs)           echo  167 ;;
    plugins/neumorphism-ui/skills/apply/scripts/neu-scan.test.mjs)               echo  107 ;;
    plugins/skeuomorphism-ui/skills/apply/scripts/skeuo-scan.test.mjs)           echo   87 ;;
    plugins/spatial-ui/skills/apply/scripts/spatial-scan.test.mjs)               echo  123 ;;
    plugins/ui-morphism-core/skills/a11y-validate/scripts/audit-css.test.mjs)    echo   78 ;;
    plugins/ui-morphism-core/skills/a11y-validate/scripts/budget.test.mjs)       echo   46 ;;
    plugins/ui-morphism-core/skills/a11y-validate/scripts/contrast.test.mjs)     echo  274 ;;
    plugins/ui-morphism-core/skills/token-emit/scripts/emit.test.mjs)            echo  119 ;;
    plugins/ui-morphism-core/skills/token-emit/scripts/intensity.test.mjs)       echo   54 ;;
    *)                                                                          echo      ;;
  esac
}

# Every test file the baseline table names, so check 1 can fail on a DELETED
# test file as well as on a shrunken one. Kept in step with assert_baseline_of().
BASELINED_TESTS='plugins/bento-grid-ui/skills/apply/scripts/assign-spans.test.mjs
plugins/claymorphism-ui/skills/apply/scripts/clay-scan.test.mjs
plugins/glassmorphism-ui/skills/apply/scripts/glass-scan.test.mjs
plugins/liquid-glass-ui/skills/apply/scripts/displacement-map.test.mjs
plugins/liquid-glass-ui/skills/apply/scripts/lg-scan.test.mjs
plugins/maximalism-ui/skills/apply/scripts/max-scan.test.mjs
plugins/minimalism-ui/skills/apply/scripts/quantize-scan.test.mjs
plugins/neumorphism-ui/skills/apply/scripts/neu-scan.test.mjs
plugins/skeuomorphism-ui/skills/apply/scripts/skeuo-scan.test.mjs
plugins/spatial-ui/skills/apply/scripts/spatial-scan.test.mjs
plugins/ui-morphism-core/skills/a11y-validate/scripts/audit-css.test.mjs
plugins/ui-morphism-core/skills/a11y-validate/scripts/budget.test.mjs
plugins/ui-morphism-core/skills/a11y-validate/scripts/contrast.test.mjs
plugins/ui-morphism-core/skills/token-emit/scripts/emit.test.mjs
plugins/ui-morphism-core/skills/token-emit/scripts/intensity.test.mjs'

# Deadband below an assertion baseline before the ratchet bites. It is ZERO, for
# the reason XREF_SLACK is zero in check-links.sh: this ratchets an integer COUNT
# of the very events it adjudicates, not a ratio with a second moving term. One
# fewer assertion executed is exactly one fewer assertion executed, which is the
# event the ratchet exists to surface. Deleting a test is a reviewed edit:
# re-measure and lower the number in the same diff.
ASSERT_SLACK=0

# COMMITTED CONTEXT-CAP REGISTRY for check 5 — every `contextCaps` entry each
# style's assets/intensity.contract.json declares, as
# `<whenKey>=<whenValue><TAB><cap><TAB><provenance>`.
#
# A cap is a shipped behaviour change: it silently lowers the intensity a user
# asked for. Nothing held one to anything, and changing brutalism's
# `scope: product` cap from 45 to 99 passed the whole gate. Both directions are
# adjudicated here — a cap in the contract with no entry here FAILS, and an entry
# here with no cap in the contract FAILS — so adding, removing or renumbering a
# cap is a reviewed diff rather than an edit nobody sees.
#
# PROVENANCE is checked at runtime, not just recorded:
#
#   doc    the number is stated in the owning doc's §13 and check 5 re-greps §13
#          for it, so deleting it from the doc fails the run too. Note that for a
#          cap of 0 this is nearly free — every §13 contains the digit 0 — and
#          those entries are really held by the registry alone. They are still
#          marked `doc` because the docs do state the intensity-0 rung in prose,
#          and a digit search is the honest limit of what this can assert.
#   nodoc  the number is stated NOWHERE in the owning doc, in any section. It is
#          pinned here and is not doc-gated, because there is nothing to gate it
#          against. There is exactly one such cap in the set today —
#          bento-grid-ui's `tileSource: cms` cap of 25, whose own `reason` cites
#          doc 09 §9, which argues the constraint in prose ("a CMS returning 4
#          items one day and 11 the next") and names no number. That is a real
#          gap in the research, not in this gate; it is recorded rather than
#          quietly tolerated.
cap_of() {
  case "$1" in
    bento-grid-ui) printf '%s\n' \
      'contentShape=comparable	0	doc' \
      'tileCountBand=under-4	0	doc' \
      'tileSource=cms	25	nodoc' \
      'tileCountBand=over-9	45	doc' ;;
    brutalism-ui) printf '%s\n' \
      'scope=product	45	doc' ;;
    claymorphism-ui) printf '%s\n' \
      'surface=data-dense	0	doc' \
      'register=high-gravity	0	doc' ;;
    glassmorphism-ui) printf '%s\n' \
      'perfTarget=low-end	0	doc' \
      'backdropControl=arbitrary	0	doc' ;;
    liquid-glass-ui) printf '%s\n' \
      'backdropControl=arbitrary	45	doc' ;;
    maximalism-ui) printf '%s\n' \
      'surfaceType=app-accent	45	doc' ;;
    minimalism-ui) printf '%s\n' \
      'audience=novice	0	doc' \
      'surfaceType=safety-critical	0	doc' ;;
    neumorphism-ui) printf '%s\n' \
      'contentDensity=dense	0	doc' ;;
    skeuomorphism-ui) printf '%s\n' \
      'surface=running-text	0	doc' \
      'surface=data-table	0	doc' ;;
    spatial-ui) printf '%s\n' \
      'backdropControl=arbitrary	45	doc' ;;
    ui-morphism-core) ;;   # declares no style token layer and no contract
    *) return 1 ;;
  esac
}

# WHERE EACH CONTRACT'S DEFAULT INTENSITY COMES FROM, for check 5.
#
#   doc      the owning doc's §13 inputs TABLE carries an `intensity | 0-100 | N`
#            row, and check 5 compares the contract against N.
#   derived  §13 states the 0-100 range without a default beside it, so there is
#            no number on the doc side to compare. The contract must then carry a
#            `defaultProvenance` string saying where its default came from, and
#            check 5 asserts that field is present and non-empty.
#
# There is exactly one `derived` plugin. Doc 04 is the only doc in the set whose
# §13 inputs are a bullet list rather than a table; claymorphism-ui's contract
# records that its 50 comes from §13's own "Reference (intensity 50)" knob column
# and from §5's React components, which default the prop to 50. Registered rather
# than inferred, so a doc that stops stating a default cannot quietly become an
# unchecked one — the previous revision printed NODEFAULT and passed.
default_provenance_of() {
  case "$1" in
    claymorphism-ui) echo 'derived' ;;
    *)               echo 'doc'     ;;
  esac
}

# HOW EACH DOC ENCODES ITS §13 KNOB ENDPOINTS. Three shapes, and which one a doc
# uses decides what check 5 can honestly assert about it.
#
#   oriented  the endpoint columns are labelled with an intensity — `Min
#             (intensity 0)` / `Max (intensity 100)` — and hold the knob VALUE at
#             that end. Fully gated: the contract value at 0 must appear in the
#             Min cell and the value at 100 in the Max cell. Docs 06, 07, 10.
#   range     a bare `Min` / `Max` pair, which states the numeric RANGE and says
#             nothing about which end intensity 0 sits at. Gated as a SET, with
#             the orientation pinned by knob_orientation_of() below. Docs 02, 03,
#             04, 08, 09.
#   prose     the endpoint columns DESCRIBE the behaviour at each end — "no
#             shadows", "flat fill", "Dense, 12-24px section rhythm" — rather
#             than stating the knob value, and the numeric range, where it is
#             stated at all, sits in a separate `Range` column in a shape that
#             differs per row. Docs 01 and 05.
#
# `prose` is the honest half of this table and the reason it exists. Docs 01 and
# 05 head their knob columns `At 0` / `At 100` and `At intensity 0` / `At
# intensity 100`, which the previous revision matched with nothing at all: both
# plugins reported NOKNOBS, five EXTRAKNOBs apiece and zero endpoints compared,
# and the run stayed green on them. Reading those headings now buys the KNOB SET
# in both directions — a knob added, removed or renamed fails — which is real and
# was not being had before. It does not buy the endpoint VALUES, because the doc
# does not state them as values, and no parser can extract a number a doc did not
# write. Those two contracts hold their endpoints by their own tests and by this
# registration alone; the endpoints are declared ungated here rather than
# reported as passing. Same treatment as the `nodoc` cap in cap_of().
knob_table_shape_of() {
  case "$1" in
    docs/01-skeuomorphism.md) echo 'prose'    ;;
    docs/05-minimalism.md)    echo 'prose'    ;;
    docs/06-maximalism.md)    echo 'oriented' ;;
    docs/07-brutalism.md)     echo 'oriented' ;;
    docs/10-spatial-ui.md)    echo 'oriented' ;;
    docs/02-neumorphism.md)   echo 'range'    ;;
    docs/03-glassmorphism.md) echo 'range'    ;;
    docs/04-claymorphism.md)  echo 'range'    ;;
    docs/08-liquid-glass.md)  echo 'range'    ;;
    docs/09-bento-grid.md)    echo 'range'    ;;
    *)                        echo ''         ;;
  esac
}

# COMMITTED KNOB ORIENTATION REGISTRY for the `range` docs, as
# `<knob><TAB>at0-is-min` or `<knob><TAB>at0-is-max` — which of the doc's two
# range cells the contract's intensity-0 value sits in. Deliberately NOT called
# ascending/descending: doc 04 tables `squishAmount` as Min `scale(1.00)` and Max
# `scale(0.93)`, so its "Min" column is the larger number, and a name implying
# numeric order would be wrong on that row.
#
# A bare Min/Max pair states the range and not the direction, so the direction is
# pinned here and re-asserted every run. Both ways: a knob that reverses fails,
# and an entry naming a knob no range table compares fails. Without it the set
# comparison would be a real loosening — `fillAlpha` running 0.55 → 0.95 instead
# of 0.95 → 0.55 inverts the whole material, and against a range alone both
# orientations satisfy the doc equally.
#
# The `oriented` and `prose` docs need no entries: the first gate direction from
# the doc itself, the second gate no endpoint numbers at all.
knob_orientation_of() {
  case "$1" in
    neumorphism-ui) printf '%s\n' \
      'coverage	at0-is-min'        \
      'shadowDelta	at0-is-min'    \
      'distance	at0-is-min'        \
      'hairlineOpacity	at0-is-min' \
      'radius	at0-is-min' ;;
    glassmorphism-ui) printf '%s\n' \
      'fillAlpha	at0-is-min'      \
      'blurRadius	at0-is-min'     \
      'saturation	at0-is-min'     \
      'borderAlpha	at0-is-min'    \
      'grainOpacity	at0-is-min' ;;
    claymorphism-ui) printf '%s\n' \
      'radiusScale	at0-is-min'    \
      'insetStrength	at0-is-min'  \
      'dropDepth	at0-is-min'      \
      'surfaceChroma	at0-is-min'  \
      'squishAmount	at0-is-min' ;;
    liquid-glass-ui) printf '%s\n' \
      'refractionScale	at0-is-min' \
      'fillAlpha	at0-is-max'      \
      'blurRadius	at0-is-min'     \
      'specularOpacity	at0-is-min' \
      'saturation	at0-is-min' ;;
    bento-grid-ui) printf '%s\n' \
      'spanVariance	at0-is-min'   \
      'radius	at0-is-min'         \
      'surfaceDelta	at0-is-min'   \
      'mediaBleed	at0-is-min'     \
      'motion	at0-is-min' ;;
    *) ;;
  esac
}

# ENDPOINT CELLS AN `oriented` DOC STATES IN WORDS, as `<knob><TAB>0|100`.
#
# One row in the set. docs/10-spatial-ui.md tables `--sp-perspective` Min
# (intensity 0) as "`none` (flat, shadows only)" — the CSS keyword, not a length
# — while the contract resolves intensity 0 to a 4000px camera, which is the same
# picture expressed in a property that has no `none`. There is no number in that
# cell to compare against, and there is no defect either.
#
# Registered rather than tolerated, and adjudicated both ways: an entry whose
# cell DOES state a number fails as stale, and an unregistered numberless cell in
# an `oriented` table fails and asks to be looked at.
endpoint_exempt_of() {
  case "$1" in
    spatial-ui) printf '%s\n' '--sp-perspective	0' ;;
    *) ;;
  esac
}

# COMMITTED COUNTS for the three checks whose natural failure mode is to
# adjudicate nothing and say `ok`. Each is a FLOOR with no deadband, measured
# from a clean run, and each guards a different extraction:
#
#   ASSET_DECL_BASELINE   declarations in the theme mirror / `--um-*` bridge /
#                         style layer that check 4 put through the value test.
#                         Break the CSS declaration regex and every file yields
#                         zero declarations, zero offences and an `ok`.
#   SKILLREF_BASELINE     paths named in a SKILL.md that check 10 resolved and
#                         tested for existence. Break the path regex and nine
#                         SKILL.md files reference nothing at all, cleanly.
#   FIGURE_BASELINE       distinct `N:1` contrast figures check 11 put through
#                         the owning-doc test. Reword every figure and the check
#                         certifies a corpus it never read — the exact defect
#                         docs/check-contrast.py records in its own §5.
#
# Re-measured on the complete eleven-plugin set. FIGURE_BASELINE moved for two
# reasons at once and both are in the number: seven more plugins to trace, and
# check 11 no longer counting `N : 1` out of fenced blocks and inline code spans
# on the plugin side. That second change LOWERS the count by five against the
# same tree, which is why this is a re-measurement and not an arithmetic bump.
ASSET_DECL_BASELINE=1454
SKILLREF_BASELINE=172
FIGURE_BASELINE=485

# A SKILL.md may name a path that belongs to ANOTHER plugin: core's a11y-validate
# says "the style plugin's own `references/checklist.md`" and core's token-emit
# says "the calling style plugin's `assets/intensity.contract.json`". Neither can
# be resolved from the naming skill, and both are correctly written. They are
# recognised structurally rather than by name — a bare `references/…` or
# `assets/…` reference in a skill that HAS NO such directory of its own cannot be
# about that skill — and counted. The count is a CEILING: a new unresolvable
# reference fails and asks to be looked at, because "this path is somebody else's"
# is exactly the sentence a genuinely broken path would also like to hide behind.
SKILLREF_FOREIGN_MAX=2

# The skill-listing description budget.
#
# DESC_LISTING_CAP is the platform fact stated in docs/MARKETPLACE.md §5: the
# listing truncates a skill's description text at 1,536 characters. DESC_MAX is
# the budget this repo holds itself to, and the 86-character gap is not slack for
# its own sake. Every description in this set ends with the deference clause —
# the sentence handing "make it look good", "audit my accessibility" and
# "animate this" to the incumbent tools that answer them better. That clause is
# load-bearing and it sits in the tail, which is precisely what truncation eats
# first. A description that fits at 1,536 but not at 1,450 is one edit away from
# shipping with its anti-hijack tail cut off, invisibly, with no error anywhere.
#
# The budget alone was the whole guarantee, and a budget is not a guarantee: nine
# lines of comment explained why the clause is load-bearing and the check then
# measured only the LENGTH, so deleting a deference clause outright passed. Check
# 9 now asserts the clause itself — see DEFERENCE_RE.
DESC_MAX=1450
DESC_LISTING_CAP=1536

# The deference clause, matched on the one phrase that carries its force: the
# hand-off verb. Every description in the set says some form of "a dedicated
# design-quality / animation / a11y tool answers those better and SHOULD WIN
# them" (or "…it"), and that sentence is the whole reason these skills are safe
# to install next to accesslint, impeccable, frontend-design, ui-ux-pro-max and
# dataviz. The pattern deliberately does not pin the surrounding wording: nine
# descriptions phrase the hand-off nine ways, and pinning prose would make this
# check a spelling test.
DEFERENCE_RE='should win (them|it)'

# ---------------------------------------------------------------- helpers -----

# Print a captured list only when it is non-empty, so `comm` never sees a blank.
lines() { [ -n "$1" ] && printf '%s\n' "$1"; return 0; }

# Indent a captured block one level, dropping a trailing blank line.
indent() { printf '%s\n' "$1" | sed 's/^/    /'; }

have_node=0; command -v node   >/dev/null 2>&1 && have_node=1
have_claude=0; command -v claude >/dev/null 2>&1 && have_claude=1

# Character count (code points, not bytes) of stdin. The descriptions are full of
# em dashes and curly quotes, and `wc -m` counts them per locale — under LC_ALL=C
# it reports bytes and silently over-measures by ~8 characters per description.
# node is already a hard prerequisite of check 1, so it does the counting.
charlen() {
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(String([...s].length)))'
}

# The code-point offset at which the deference clause ENDS, or the empty string
# if there is no clause at all. The offset is what check 9 needs: a clause that
# begins inside the budget but ends past DESC_LISTING_CAP is a clause the model
# never finishes reading.
deference_end() {
  node -e '
    let s = "";
    process.stdin.on("data", (d) => (s += d)).on("end", () => {
      const m = new RegExp(process.argv[1]).exec(s);
      process.stdout.write(m ? String([...s.slice(0, m.index + m[0].length)].length) : "");
    });
  ' "$DEFERENCE_RE"
}

# A dotted field out of a JSON file, or the empty string.
json_field() {
  node -e '
    const fs = require("fs");
    let o; try { o = JSON.parse(fs.readFileSync(process.argv[1], "utf8")); }
    catch (e) { process.stderr.write(String(e.message)); process.exit(3); }
    const v = process.argv[2].split(".").reduce((a, k) => (a == null ? a : a[k]), o);
    process.stdout.write(v == null ? "" : String(v));
  ' "$1" "$2"
}

# `name<TAB>source` for every marketplace entry. A `source` given as an object
# (github, url, git-subdir, npm, archive) prints as <non-local:KIND>, because
# this gate can only certify a path on disk and must say so rather than pass.
mk_entries() {
  node -e '
    const fs = require("fs");
    let m; try { m = JSON.parse(fs.readFileSync(process.argv[1], "utf8")); }
    catch (e) { process.stderr.write(String(e.message)); process.exit(3); }
    for (const e of (Array.isArray(m.plugins) ? m.plugins : [])) {
      const s = typeof e.source === "string"
        ? e.source
        : "<non-local:" + ((e.source && e.source.source) || "unknown") + ">";
      const v = e.version == null ? "" : String(e.version);
      process.stdout.write((e.name == null ? "<unnamed>" : String(e.name)) + "\t" + s + "\t" + v + "\n");
    }
  ' "$MARKETPLACE"
}

# The body of the Nth ```css fence inside a doc's §4.
sec4_css() {
  awk -v want="${2:-1}" '
    /^## 4\. Anatomy & Design Tokens/ { sec = 1; next }
    sec && /^## /                     { exit }
    !sec                              { next }
    /^```css/                         { n++; fence = (n == want); next }
    fence && /^```/                   { fence = 0; next }
    fence
  ' "$1"
}

# How many ```css fences that §4 has.
sec4_fence_count() {
  awk '
    /^## 4\. Anatomy & Design Tokens/ { sec = 1; next }
    sec && /^## /                     { exit }
    sec && /^```css/                  { n++ }
    END                               { print n + 0 }
  ' "$1"
}

# COMMITTED §4 FENCE REGISTRY for check 3, as `<total fences>:<contract fence>`.
#
# The contract is ONE block — the ready-to-paste custom-property block that
# tokens.css is a copy of. The previous revision asserted that by requiring §4 to
# hold exactly one ```css fence, and that assertion was not a fact about the
# corpus: docs/02-neumorphism.md §4 holds two, and the whole of neumorphism-ui's
# token layer went unchecked with a single FENCES line to show for it.
#
# "Just take the first fence" would have fixed the symptom and thrown away the
# guarantee, because a doc that grows a THIRD fence, or reorders its two, would
# then be compared against the wrong block silently. So the fence count is
# registered per doc and re-counted at runtime: a doc whose §4 fence count no
# longer matches this table FAILS and asks to be looked at, exactly as it did
# before, and the contract block is named rather than guessed.
#
# Nine of the ten docs put the ready-to-paste block alone in §4. Doc 02 puts a
# second `css` fence AFTER it, under "### Deriving the two shadow colours from a
# base" — an OKLCH derivation offered as an alternative to the hex block above
# it, explicitly not the block to paste. Fence 1 is the contract there.
sec4_fences_of() {
  case "$1" in
    docs/02-neumorphism.md) echo '2:1' ;;
    docs/0[13456789]-*.md|docs/10-*.md) echo '1:1' ;;
    *) echo '' ;;
  esac
}

# The body of a doc's §13, used by check 5.
sec13() {
  awk '
    /^## 13\. Plugin Spec \(draft\)/ { sec = 1; next }
    sec && /^## /                    { exit }
    sec
  ' "$1"
}

# Every CSS declaration on stdin, as `context<TAB>property#N<TAB>value`.
#
# A real (if small) CSS tokenizer rather than a line regex, because the two sides
# of check 3 are formatted by different hands: the plugin copy carries a
# provenance header the doc does not, and either side may wrap a long shadow
# value across lines. Comments are stripped, whitespace inside a declaration is
# collapsed, string literals are respected so a `;` or `{` inside quotes does not
# end a declaration, and the enclosing selector / at-rule stack is carried into
# the key so `--x: 1` under `:root` and under `:root[data-theme="dark"]` are two
# different declarations rather than a false match.
#
# `#N` is the occurrence index of that property within that context, so a
# deliberately repeated declaration (a `-webkit-` fallback pair, a progressive
# re-declaration) compares one-for-one instead of collapsing.
css_decls() {
  awk '
    { buf = buf $0 "\n" }

    function norm(s) {
      gsub(/[[:space:]]+/, " ", s); sub(/^ /, "", s); sub(/ $/, "", s); return s
    }
    function ctx(   i, r) {
      r = ""
      for (i = 1; i <= depth; i++) r = (r == "" ? stack[i] : r " > " stack[i])
      return r
    }
    function flush(t,   d, p, v, i, key) {
      d = norm(t); if (d == "") return
      i = index(d, ":")
      if (i == 0) { key = ctx() "\t<statement>"; seen[key]++; printf "%s#%d\t%s\n", key, seen[key], d; return }
      p = norm(substr(d, 1, i - 1)); v = norm(substr(d, i + 1))
      key = ctx() "\t" p; seen[key]++
      printf "%s#%d\t%s\n", key, seen[key], v
    }

    END {
      sq = sprintf("%c", 39)

      # Strip comments first. An unterminated one drops the rest of the file,
      # which is right: the rest of the file is inside a comment.
      s = buf; out = ""
      while (1) {
        i = index(s, "/*")
        if (i == 0) { out = out s; break }
        out = out substr(s, 1, i - 1)
        s = substr(s, i + 2)
        j = index(s, "*/")
        if (j == 0) break
        s = substr(s, j + 2)
      }

      depth = 0; tok = ""; q = ""
      n = length(out)
      for (k = 1; k <= n; k++) {
        c = substr(out, k, 1)
        if (q != "") { tok = tok c; if (c == q) q = ""; continue }
        if (c == "\"" || c == sq) { q = c; tok = tok c; continue }
        if (c == "{") { depth++; stack[depth] = norm(tok); tok = ""; continue }
        if (c == "}") {
          flush(tok); tok = ""
          if (depth > 0) { delete stack[depth]; depth-- }
          continue
        }
        if (c == ";")  { flush(tok); tok = ""; continue }
        if (c == "\n" || c == "\t") { tok = tok " "; continue }
        tok = tok c
      }
      flush(tok)
    }
  '
}

# The frontmatter block of a SKILL.md — between the leading `---` and the next
# one — or nothing at all if the file does not open with `---`.
frontmatter() {
  awk '
    NR == 1 && $0 != "---" { exit }
    NR == 1                { fm = 1; next }
    fm && $0 == "---"      { exit }
    fm
  ' "$1"
}

# One frontmatter scalar, with YAML folded/literal block scalars folded to a
# single line. Handles `key: value`, `key: >-` and `key: |-` followed by an
# indented block; that is the whole of the YAML this repo's frontmatter uses, and
# a key written in a shape this cannot read reports empty, which fails check 7
# rather than passing on a value nobody parsed.
fm_scalar() {
  frontmatter "$1" | awk -v key="$2" '
    BEGIN { inline = "^" key ":[[:space:]]"; block = "^" key ":[[:space:]]*[>|][-+]?[[:space:]]*$" }
    !blk && $0 ~ block  { blk = 1; next }
    !blk && $0 ~ inline { sub(inline, ""); sub(/^[[:space:]]+/, ""); print; found = 1; exit }
    blk {
      if ($0 ~ /^[^[:space:]]/) { exit }
      sub(/^[[:space:]]+/, ""); sub(/[[:space:]]+$/, "")
      out = (out == "" ? $0 : out " " $0)
    }
    END { if (blk && out != "") print out }
  '
}

# ------------------------------------------------------- 0. plugin registry ---
# Four separate things have to agree about which plugins exist: the directories
# under plugins/, the entries in marketplace.json, doc_of() in this file, and
# PLUGIN_COUNT. A plugin that slips past one of them does not fail in any legible
# way further down — it surfaces three screens later as an unrelated NODOC, or,
# worse, as nothing at all. So the agreement is asserted once, up front, and the
# failure message names every table that has to change.
echo "==> checking the plugin set is the registered set"
reg_ok=1

plugin_dirs=()
for d in plugins/*/; do
  [ -d "$d" ] || continue
  plugin_dirs+=("${d%/}")
done

if [ "${#plugin_dirs[@]}" -ne "$PLUGIN_COUNT" ]; then
  printf '  PLUGINSET found %s plugin dir(s) under plugins/, expected %s: %s\n' \
    "${#plugin_dirs[@]}" "$PLUGIN_COUNT" "${plugin_dirs[*]:-<none>}"
  fail=1; reg_ok=0
fi

if [ ! -f "$MARKETPLACE" ]; then
  printf '  MISSING  %s is not on disk — the catalog cannot be checked at all\n' "$MARKETPLACE"
  fail=1; reg_ok=0
fi

if [ "$have_node" -eq 0 ]; then
  echo "  NOTRUN   node is not on PATH. This preflight, and checks 1, 4, 5, 6, 9, 10 and 11 need it and did NOT run."
  echo "           A check that did not run did not pass; install node v22+ and re-run."
  fail=1; reg_ok=0
fi
if [ "$have_claude" -eq 0 ]; then
  echo "  NOTRUN   the \`claude\` CLI is not on PATH. Check 2 did NOT run."
  fail=1; reg_ok=0
fi
if [ -z "$tmpdir" ] || [ ! -d "$tmpdir" ]; then
  echo "  NOTMP    mktemp -d produced no scratch directory — check 1 cannot preload its assertion counter."
  fail=1; reg_ok=0
else
  # NODE_OPTIONS is a space-separated list with no quoting of its own, so a
  # scratch path containing a space cannot be handed to `--import`. Say so and
  # fail rather than run check 1 with the counter silently absent, which would
  # report zero assertions everywhere and look like a suite-wide regression.
  case "$tmpdir" in
    *[[:space:]]*)
      printf '  TMPSPACE scratch dir %s contains a space; NODE_OPTIONS cannot carry it. Set TMPDIR to a path without spaces and re-run.\n' "$tmpdir"
      fail=1; reg_ok=0 ;;
  esac
fi

mk_names=''
if [ "$have_node" -eq 1 ] && [ -f "$MARKETPLACE" ]; then
  mk_raw=$(mk_entries)
  if [ $? -ne 0 ]; then
    printf '  BADJSON  %s did not parse\n' "$MARKETPLACE"
    fail=1; reg_ok=0
  else
    mk_names=$(printf '%s\n' "$mk_raw" | awk -F'\t' 'NF { print $1 }' | sort)
  fi

  n_entries=$(printf '%s' "$mk_names" | grep -c .)
  if [ "$n_entries" -eq 0 ]; then
    printf '  NOENTRY  %s lists no plugins — check 6 would adjudicate nothing\n' "$MARKETPLACE"
    fail=1; reg_ok=0
  fi

  disk_names=$(printf '%s\n' "${plugin_dirs[@]}" | sed 's|^plugins/||' | sort)
  while IFS= read -r n; do
    [ -n "$n" ] || continue
    printf '  UNLISTED %s is built under plugins/ but has no marketplace.json entry — it cannot be installed\n' "$n"
    fail=1; reg_ok=0
  done < <(comm -23 <(lines "$disk_names") <(lines "$mk_names"))
  while IFS= read -r n; do
    [ -n "$n" ] || continue
    printf '  UNBUILT  %s has a marketplace.json entry but no plugins/%s directory\n' "$n" "$n"
    fail=1; reg_ok=0
  done < <(comm -13 <(lines "$disk_names") <(lines "$mk_names"))
fi

for d in "${plugin_dirs[@]}"; do
  p=${d#plugins/}
  if [ -z "$(doc_of "$p")" ]; then
    printf '  NODOC    %s has no entry in doc_of() — its token layer and its intensity contract cannot be held against any doc\n' "$p"
    fail=1; reg_ok=0
  fi
  if ! cap_of "$p" >/dev/null 2>&1; then
    printf '  NOCAPS   %s has no entry in cap_of() — its intensity context caps cannot be adjudicated\n' "$p"
    fail=1; reg_ok=0
  fi
done

if [ "$reg_ok" -eq 1 ]; then
  echo "  ok"
else
  echo "  ^ the plugin set or its registration changed. Growing it is a reviewed decision,"
  echo "    not a side effect: update doc_of(), cap_of(), knob_table_shape_of(),"
  echo "    knob_orientation_of(), default_provenance_of(), sec4_fences_of(),"
  echo "    assert_baseline_of(), BASELINED_TESTS and PLUGIN_COUNT in this script,"
  echo "    .claude-plugin/marketplace.json, and README's \"The complete set\" — then re-run."
fi

# --------------------------------------------------------------- 1. tests -----
# node --test over an explicit file list rather than `node --test plugins/`. The
# directory form resolves the argument as a module before it globs and dies with
# MODULE_NOT_FOUND on this tree; more importantly, an explicit list is countable.
#
# The count that matters is NOT the file count and NOT `# pass`. See the long
# note at assert_baseline_of() for the mutation that proved why: `# pass` is
# bounded below by the number of files, so zero-byte test files pass it. What is
# counted instead is every node:assert entry point the suite actually calls, per
# file, by preloading a counter into `node --test` through NODE_OPTIONS — which
# the test runner passes to the child process it spawns per file, so each child
# reports its own file's total. The wrappers delegate to the originals and
# preserve `this`, arguments, return value and thrown AssertionError, so the
# suite's verdict is unchanged by being measured.
echo "==> running node --test over plugins/**/*.test.mjs"
test_files=()
while IFS= read -r f; do test_files+=("$f"); done \
  < <(find plugins -type f -name '*.test.mjs' 2>/dev/null | sort)

tests_ok=1
if [ "$have_node" -eq 0 ]; then
  echo "  NOTRUN   node is not on PATH — NO unit test in this tree was executed."
  echo "  ^ this check did not run, so it did not pass, and the run FAILS."
  fail=1; tests_ok=0
elif [ -z "$tmpdir" ] || [ ! -d "$tmpdir" ]; then
  echo "  NOTRUN   no scratch directory, so the assertion counter could not be written."
  echo "  ^ running the suite without counting its assertions is the vacuity hole this"
  echo "    check exists to close, so it is not run at all and the run FAILS."
  fail=1; tests_ok=0
elif [ "${#test_files[@]}" -eq 0 ]; then
  echo "  NOTESTS  the plugins/**/*.test.mjs glob matched nothing."
  echo "  ^ an empty glob reporting ok is the vacuity defect this repo has hit twice."
  echo "    Zero test files is a FAILURE, not a clean run."
  fail=1; tests_ok=0
else
  printf '  %s test file(s)\n' "${#test_files[@]}"

  # Every test file must be registered, and every registered file must be on
  # disk. Without the second direction, deleting a test file and its baseline
  # entry in one edit is indistinguishable from never having had it.
  for f in "${test_files[@]}"; do
    if [ -z "$(assert_baseline_of "$f")" ]; then
      printf '  NOBASELINE %s has no committed assertion baseline — add one to assert_baseline_of() and BASELINED_TESTS\n' "$f"
      fail=1; tests_ok=0
    fi
  done
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    if [ ! -f "$f" ]; then
      printf '  GONE     %s is registered in BASELINED_TESTS but is not on disk — a deleted test file is a reviewed edit\n' "$f"
      fail=1; tests_ok=0
    fi
  done < <(printf '%s\n' "$BASELINED_TESTS")

  counter="$tmpdir/assert-counter.mjs"
  counts="$tmpdir/assert-counts.tsv"
  : > "$counts"
  cat > "$counter" <<'COUNTER'
// Preloaded into every `node --test` child through NODE_OPTIONS by
// check-plugins.sh. Counts executed node:assert calls and records the total for
// the file the child was given, at exit.
//
// The entry points are named explicitly rather than discovered by walking the
// module, because `assert.ok === assert` and `assert.strict` is itself a
// callable carrying the whole API: a blind walk either misses `ok` or replaces
// the object that `import assert from "node:assert/strict"` resolves to, and
// the second one breaks every test in the tree. Naming the API is not a
// suppression list — an entry point missing from it can only make the count
// LOWER, which trips the ratchet rather than hiding a regression behind it.
import { createRequire } from 'node:module';
import { appendFileSync } from 'node:fs';

const log = process.env.UM_ASSERT_LOG;
if (log) {
  const require = createRequire(import.meta.url);
  const METHODS = [
    'ok', 'equal', 'notEqual', 'strictEqual', 'notStrictEqual',
    'deepEqual', 'notDeepEqual', 'deepStrictEqual', 'notDeepStrictEqual',
    'partialDeepStrictEqual', 'throws', 'doesNotThrow', 'rejects',
    'doesNotReject', 'match', 'doesNotMatch', 'ifError', 'fail',
  ];
  globalThis.__um_assert_calls = 0;
  const assert = require('node:assert');
  const seen = new Set();
  for (const obj of [assert, assert.strict]) {
    if (!obj || seen.has(obj)) continue;
    seen.add(obj);
    for (const k of METHODS) {
      const d = Object.getOwnPropertyDescriptor(obj, k);
      if (!d || !d.configurable || !d.writable || typeof d.value !== 'function') continue;
      const orig = d.value;
      Object.defineProperty(obj, k, {
        ...d,
        value: function (...args) {
          globalThis.__um_assert_calls++;
          return orig.apply(this, args);
        },
      });
    }
  }
  process.on('exit', () => {
    try {
      appendFileSync(log, (process.argv[1] || '') + '\t' + globalThis.__um_assert_calls + '\n');
    } catch { /* the count is reported as missing, which fails the check */ }
  });
}
COUNTER

  test_out=$(UM_ASSERT_LOG="$counts" NODE_OPTIONS="--import $counter" \
             node --test "${test_files[@]}" 2>&1)
  test_rc=$?
  summary=$(printf '%s\n' "$test_out" | grep -E '^# (tests|pass|fail|skipped|todo) ')
  if [ "$test_rc" -ne 0 ]; then
    # EVERY failing subtest with its diagnostic block, not the first and not the
    # whole TAP stream. A `not ok` line opens the block; the YAML `...`
    # terminator closes it. If nothing matched, the run did not fail on an
    # assertion — it crashed, or the reporter changed — so print everything
    # rather than swallow it.
    failures=$(printf '%s\n' "$test_out" | awk '
      /^[[:space:]]*not ok /                     { keep = 1 }
      keep                                       { print }
      keep && /^[[:space:]]*\.\.\.[[:space:]]*$/ { keep = 0 }
    ')
    if [ -n "$failures" ]; then
      indent "$failures"
      printf '%s\n' "$summary" | sed 's/^# /  /'
    else
      indent "$test_out"
    fi
    echo "  ^ node --test exited $test_rc"
    fail=1; tests_ok=0
  else
    printf '%s\n' "$summary" | sed 's/^# /  /'
  fi

  # The counter also fires in any child process a test spawns — audit-css.mjs,
  # emit.mjs and friends are exercised through execFileSync — so rows are matched
  # to the test files by path and everything else is ignored. A test file with no
  # row at all is a file whose counter never loaded, which is a FAILURE: it is
  # indistinguishable, from the log, from a file that asserted nothing.
  asserts_total=0
  for f in "${test_files[@]}"; do
    abs="$PWD/$f"
    n=$(awk -F'\t' -v p="$abs" '$1 == p { s += $2; seen = 1 } END { if (seen) print s + 0 }' "$counts")
    base=$(assert_baseline_of "$f")
    if [ -z "$n" ]; then
      printf '  NOCOUNT  %s produced no assertion count — the counter did not load, so this file was NOT measured\n' "$f"
      fail=1; tests_ok=0
      continue
    fi
    asserts_total=$((asserts_total + n))
    if [ -z "$base" ]; then
      continue          # already reported as NOBASELINE above
    fi
    floor=$((base - ASSERT_SLACK))
    [ "$floor" -lt 0 ] && floor=0
    if [ "$n" -lt "$floor" ]; then
      printf '  ASSERTDROP %-72s %s executed, below the committed baseline %s\n' "$f" "$n" "$base"
      fail=1; tests_ok=0
    elif [ "$n" -gt "$base" ]; then
      printf '  ratchet  %-72s %s executed, above the committed baseline %s — raise it in assert_baseline_of()\n' "$f" "$n" "$base"
    else
      printf '  ok       %-72s %s assertion(s)\n' "$f" "$n"
    fi
  done
  printf '  %s assertion(s) executed across %s file(s)\n' "$asserts_total" "${#test_files[@]}"
  if [ "$asserts_total" -eq 0 ]; then
    echo "  NOASSERTS the whole suite executed zero assertions."
    echo "  ^ tests that assert nothing pass. This is the vacuity class, and it is a FAILURE."
    fail=1; tests_ok=0
  fi
fi
[ "$tests_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------------------ 2. manifest validate ---
# The repo root (marketplace manifest) and every plugin directory (plugin
# manifest). --strict promotes unrecognised-field warnings to errors, which is
# what catches `keyword` for `keywords` before a user does — docs/MARKETPLACE.md
# §3 asks for exactly this in CI.
#
# It does not, however, read the CONTENT of a field it recognises: `allowed-tools`
# is type-checked and then accepted, space-separated or not, real tool names or
# `NotARealTool, AlsoFake(zzz)`. That is check 8's job, and it is why check 8
# exists next to a validator that already ran.
echo "==> checking claude plugin validate --strict"
if [ "$have_claude" -eq 0 ]; then
  echo "  NOTRUN   the \`claude\` CLI is not on PATH — NO manifest was validated."
  echo "  ^ this check did not run, so it did not pass, and the run FAILS."
  fail=1
else
  validate_ok=1
  targets=(".")
  for d in "${plugin_dirs[@]}"; do targets+=("$d"); done
  for t in "${targets[@]}"; do
    out=$(claude plugin validate "$t" --strict 2>&1)
    if [ $? -ne 0 ]; then
      printf '  INVALID  %s\n' "$t"
      indent "$out"
      fail=1; validate_ok=0
    else
      printf '  ok       %s\n' "$t"
    fi
  done
  [ "$validate_ok" -eq 1 ] && echo "  ok"
fi

# --------------------------------------------------------- 3. token fidelity ---
# The cross-document-drift class. Each style plugin ships assets/tokens.css as
# "the doc's §4 block, verbatim"; nothing until now made that true. A value edited
# in the doc and not in the plugin — or the reverse — ships a plugin whose tokens
# disagree with the research it claims to be generated from, and every downstream
# claim (the contrast figures above all) is measured against the doc's numbers.
#
# The comparison is keyed on selector-context plus property, so it reports the
# three failure directions separately: MISSING (doc declares it, the plugin does
# not), EXTRA (the plugin declares it, the doc does not) and VALUE (both declare
# it, differently). Comments are stripped on both sides — the plugin copy's
# provenance header is not a declaration and is not drift.
echo "==> checking tokens.css against its owning doc §4, declaration for declaration"
tok_ok=1
tok_files=0
tok_decls=0

# This check needs no node: the extraction and the comparison are awk and comm.
#
# Both directions of the disk/registry relation. A plugin registered with an
# owning doc must ship a tokens.css; a plugin registered `-` must not.
for d in "${plugin_dirs[@]}"; do
  p=${d#plugins/}
  doc=$(doc_of "$p")
  css="$d/skills/apply/assets/tokens.css"
  [ -n "$doc" ] || continue          # already failed in the preflight

  if [ "$doc" = '-' ]; then
    if [ -f "$css" ]; then
      printf '  UNMAPPED %s is registered as declaring no token layer, but %s exists\n' "$p" "$css"
      fail=1; tok_ok=0
    fi
    continue
  fi

  if [ ! -f "$css" ]; then
    printf '  NOCSS    %s: %s is missing, so %s §4 was NOT compared against anything\n' "$p" "$css" "$doc"
    fail=1; tok_ok=0; continue
  fi
  if [ ! -f "$doc" ]; then
    printf '  NODOCFILE %s: owning doc %s is not on disk — %s was NOT checked\n' "$p" "$doc" "$css"
    fail=1; tok_ok=0; continue
  fi

  reg=$(sec4_fences_of "$doc")
  if [ -z "$reg" ]; then
    printf '  NOFENCEREG %s has no entry in sec4_fences_of() — which of its §4 ```css blocks is the contract is unknown, so %s was NOT compared\n' \
      "$doc" "$css"
    fail=1; tok_ok=0; continue
  fi
  want_n=${reg%%:*}
  want_i=${reg##*:}
  nf=$(sec4_fence_count "$doc")
  if [ "$nf" -ne "$want_n" ]; then
    printf '  FENCES   %s §4 holds %s ```css block(s); sec4_fences_of() registers %s, so %s was NOT compared\n' \
      "$doc" "$nf" "$want_n" "$css"
    fail=1; tok_ok=0; continue
  fi

  doc_side=$(sec4_css "$doc" "$want_i" | css_decls | sort)
  css_side=$(css_decls < "$css" | sort)
  n_doc=$(printf '%s' "$doc_side" | grep -c .)
  n_css=$(printf '%s' "$css_side" | grep -c .)

  if [ "$n_doc" -eq 0 ] || [ "$n_css" -eq 0 ]; then
    printf '  NODECL   %s: extracted %s declaration(s) from %s §4 and %s from %s — an empty side compares nothing\n' \
      "$p" "$n_doc" "$doc" "$n_css" "$css"
    fail=1; tok_ok=0; continue
  fi

  tok_files=$((tok_files + 1))
  tok_decls=$((tok_decls + n_css))
  printf '  %-17s %s decl(s) vs %s §4\n' "$p" "$n_css" "$doc"

  doc_keys=$(printf '%s\n' "$doc_side" | awk -F'\t' '{ print $1 "\t" $2 }' | sort)
  css_keys=$(printf '%s\n' "$css_side" | awk -F'\t' '{ print $1 "\t" $2 }' | sort)

  while IFS=$'\t' read -r sel prop; do
    [ -n "${prop:-}" ] || continue
    v=$(printf '%s\n' "$doc_side" | awk -F'\t' -v s="$sel" -v q="$prop" '$1 == s && $2 == q { print $3; exit }')
    printf '  MISSING  %s: %s §4 declares `%s: %s` under `%s`; tokens.css does not\n' \
      "$p" "$doc" "${prop%%#*}" "$v" "${sel:-<top level>}"
    fail=1; tok_ok=0
  done < <(comm -23 <(lines "$doc_keys") <(lines "$css_keys"))

  while IFS=$'\t' read -r sel prop; do
    [ -n "${prop:-}" ] || continue
    v=$(printf '%s\n' "$css_side" | awk -F'\t' -v s="$sel" -v q="$prop" '$1 == s && $2 == q { print $3; exit }')
    printf '  EXTRA    %s: tokens.css declares `%s: %s` under `%s`; %s §4 does not\n' \
      "$p" "${prop%%#*}" "$v" "${sel:-<top level>}" "$doc"
    fail=1; tok_ok=0
  done < <(comm -13 <(lines "$doc_keys") <(lines "$css_keys"))

  while IFS=$'\t' read -r sel prop; do
    [ -n "${prop:-}" ] || continue
    dv=$(printf '%s\n' "$doc_side" | awk -F'\t' -v s="$sel" -v q="$prop" '$1 == s && $2 == q { print $3; exit }')
    cv=$(printf '%s\n' "$css_side" | awk -F'\t' -v s="$sel" -v q="$prop" '$1 == s && $2 == q { print $3; exit }')
    [ "$dv" = "$cv" ] && continue
    printf '  VALUE    %s: `%s` under `%s` — doc says `%s`, tokens.css says `%s`\n' \
      "$p" "${prop%%#*}" "${sel:-<top level>}" "$dv" "$cv"
    fail=1; tok_ok=0
  done < <(comm -12 <(lines "$doc_keys") <(lines "$css_keys"))
done

if [ "$tok_files" -eq 0 ]; then
  echo "  NOTOKENS no plugins/<style>/skills/apply/assets/tokens.css was compared against anything."
  echo "  ^ zero comparisons is a FAILURE, not a clean run."
  fail=1
else
  printf '  %s token layer(s), %s declaration(s) held against their docs\n' "$tok_files" "$tok_decls"
  [ "$tok_ok" -eq 1 ] && echo "  ok"
fi

# ------------------------------------------- 4. the rest of the stylesheets ----
# tokens.css was the only shipped stylesheet anything looked at. Each style also
# ships a Tailwind v4 `@theme` mirror and a `--um-*` grammar bridge, and
# glassmorphism ships its accessibility layer; corrupting a colour in any of them
# passed the entire gate. All three are shipped artefacts a user pastes into a
# project, and all three restate values that live somewhere else.
#
# Three different relations, adjudicated three different ways, because they are
# three different claims:
#
#   * tokens.theme.css says of itself "values match assets/tokens.css exactly;
#     only the names change". So every literal value in it must be a value
#     tokens.css declares. STRICT — the doc is not an alternative source here,
#     because the mirror's whole claim is about tokens.css.
#   * tokens.um-aliases.css maps `--um-<style>-*` onto `--nb-*` / `--glass-*` /
#     `--bento-*`, mostly as var() references. Where it states a literal instead,
#     the value must be traceable to tokens.css or to the owning doc: the shared
#     grammar has groups the style layer does not declare (a focus width, a type
#     scale) and those values are the doc's, not tokens.css's. Measured today: 9
#     literals mirror tokens.css, 15 are stated by the docs.
#   * glass.layer.css is a stylesheet, not a token file, so its ordinary
#     declarations are its own. What is checked is that every COLOUR it states is
#     one the doc or tokens.css states — a `#000000` there is doc 03's `#000` —
#     and that every var() it reads resolves. Its non-colour literals are NOT
#     gated; see the ungated list in the header.
#
# A var() reference is checked against tokens.css, the alias file and the
# referencing file itself. A reference carrying a FALLBACK — `var(--x, 64px)` —
# is exempt, structurally rather than by name: a fallback is the declaration of
# what happens when the token is absent, which is exactly the failure this check
# looks for, answered in the stylesheet itself.
#
# Colour comparison canonicalises notation, not value: `rgb(0 0 0 / .04)`,
# `rgba(0,0,0,0.04)` and `#000` / `#000000` are the same colour written by
# different hands, and the two sides of every comparison here were written by
# different hands. Nothing rounds and nothing is fuzzy: one digit of difference
# in any channel is a mismatch.
echo "==> checking the theme mirror, the --um-* bridge and the style layer against tokens.css"
asset_ok=1
asset_decls=0
if [ "$have_node" -eq 0 ]; then
  echo "  NOTRUN   node is not on PATH — NO shipped stylesheet was compared."
  fail=1; asset_ok=0
else
  for d in "${plugin_dirs[@]}"; do
    p=${d#plugins/}
    doc=$(doc_of "$p")
    base="$d/skills/apply/assets"
    [ -n "$doc" ] || continue
    if [ "$doc" = '-' ]; then
      if [ -d "$base" ]; then
        printf '  UNMAPPED %s is registered as declaring no token layer, but %s exists\n' "$p" "$base"
        fail=1; asset_ok=0
      fi
      continue
    fi
    if [ ! -f "$base/tokens.css" ] || [ ! -f "$doc" ]; then
      continue                        # already reported by check 3
    fi
    if [ ! -f "$base/tokens.theme.css" ]; then
      printf '  NOMIRROR %s ships no %s — the Tailwind mirror this style documents was NOT compared\n' \
        "$p" "$base/tokens.theme.css"
      fail=1; asset_ok=0
    fi

    out=$(node -e '
      const fs = require("fs");
      const [base, doc] = process.argv.slice(1);

      const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");
      // Canonical form for comparison: lowercase, whitespace collapsed, short
      // hex expanded, rgb()/rgba() in either syntax reduced to one spelling.
      const canon = (v) => {
        let s = v.toLowerCase().replace(/\s+/g, " ").trim();
        s = s.replace(/#([0-9a-f])([0-9a-f])([0-9a-f])\b/g, "#$1$1$2$2$3$3");
        s = s.replace(/rgba?\(([^()]*)\)/g, (m, inner) => {
          const [head, tail] = inner.includes("/") ? inner.split("/") : [inner, null];
          let c = head.trim().split(/[\s,]+/).filter(Boolean);
          let a = tail !== null ? tail.trim() : (c.length > 3 ? c[3] : "1");
          c = c.slice(0, 3);
          if (c.length < 3) return m;
          a = String(a).replace(/^\./, "0.");
          if (a.includes(".")) a = a.replace(/0+$/, "").replace(/\.$/, "");
          return "rgba(" + c.join(",") + "," + a + ")";
        });
        return s.replace(/\s*,\s*/g, ",");
      };
      const hexOf = (v) => {
        const m = canon(v).match(/^rgba\((\d+),(\d+),(\d+),/);
        return m ? "#" + [1, 2, 3].map((i) => Number(m[i]).toString(16).padStart(2, "0")).join("") : null;
      };
      const declsOf = (f) => {
        const s = strip(fs.readFileSync(f, "utf8")); const out = [];
        const re = /(--[A-Za-z0-9_-]+)\s*:\s*([^;{}]+)[;}]/g; let m;
        while ((m = re.exec(s))) out.push([m[1], m[2].replace(/\s+/g, " ").trim()]);
        return out;
      };
      const varsOf = (f) => {
        const s = strip(fs.readFileSync(f, "utf8")); const out = [];
        const re = /var\(\s*(--[A-Za-z0-9_-]+)\s*(,?)/g; let m;
        while ((m = re.exec(s))) out.push([m[1], m[2] === ","]);
        return out;
      };

      const tokFile = base + "/tokens.css";
      const tok = declsOf(tokFile);
      const tokVals = new Set(tok.map((d) => canon(d[1])));
      const known = new Set(tok.map((d) => d[0]));
      const docTxt = canon(fs.readFileSync(doc, "utf8"));
      const tokTxt = canon(fs.readFileSync(tokFile, "utf8"));
      const aliasFile = base + "/tokens.um-aliases.css";
      if (fs.existsSync(aliasFile)) for (const [n] of declsOf(aliasFile)) known.add(n);

      let adjudicated = 0;
      const say = (kind, file, msg) => console.log(kind + "\t" + file + "\t" + msg);

      // One acceptance ladder, used by every literal this check looks at:
      // the value tokens.css declares, the value the doc states anywhere, or —
      // for a colour — the same colour the doc states in the other notation.
      // docs/03 writes the error border as `#ff6b81` at 0.55 alpha in prose and
      // the bridge writes it as rgba(255,107,129,0.55); those are one colour.
      const traced = (v) => {
        const c = canon(v);
        if (tokVals.has(c) || docTxt.includes(c) || tokTxt.includes(c)) return true;
        const h = hexOf(v);
        return Boolean(h && (docTxt.includes(h) || tokTxt.includes(h)));
      };

      for (const name of ["tokens.theme.css", "tokens.um-aliases.css", "glass.layer.css"]) {
        const f = base + "/" + name;
        if (!fs.existsSync(f)) continue;
        const own = new Set(declsOf(f).map((d) => d[0]));
        const mirrorOnly = name === "tokens.theme.css";

        for (const [n, v] of declsOf(f)) {
          if (/var\(/.test(v)) continue;             // a reference, checked below
          adjudicated++;
          if (mirrorOnly) {
            if (!tokVals.has(canon(v))) {
              say("MIRROR", name, "`" + n + ": " + v + "` is not a value tokens.css declares");
            }
            continue;
          }
          if (!traced(v)) {
            say("UNTRACED", name, "`" + n + ": " + v + "` appears neither in tokens.css nor in " + doc);
          }
        }

        // Colour literals OUTSIDE a custom-property declaration — the ordinary
        // rules of a stylesheet. Only glass.layer.css has any; the token files
        // are declarations end to end, and those were judged above, so the
        // declarations are removed first rather than judged twice.
        const body = strip(fs.readFileSync(f, "utf8"))
          .replace(/--[A-Za-z0-9_-]+\s*:\s*[^;{}]+[;}]/g, " ");
        for (const col of new Set(body.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^()]*\)/g) || [])) {
          adjudicated++;
          if (!traced(col)) {
            say("COLOUR", name, "`" + col + "` appears neither in tokens.css nor in " + doc);
          }
        }

        for (const [n, hasFallback] of varsOf(f)) {
          if (hasFallback) continue;                 // self-sufficient by construction
          adjudicated++;
          if (known.has(n) || own.has(n)) continue;
          say("UNRESOLVED", name, "reads `var(" + n + ")`, which nothing in tokens.css, the --um-* bridge or this file declares");
        }
      }
      console.log("COUNT\t\t" + adjudicated);
    ' "$base" "$doc" 2>&1)

    if [ $? -ne 0 ]; then
      printf '  SCANFAIL %s: the stylesheet scan itself failed\n' "$p"
      indent "$out"
      fail=1; asset_ok=0; continue
    fi

    n=$(printf '%s\n' "$out" | awk -F'\t' '$1 == "COUNT" { print $3; exit }')
    asset_decls=$((asset_decls + ${n:-0}))
    printf '  %-17s %s value(s) and reference(s) adjudicated\n' "$p" "${n:-0}"
    while IFS=$'\t' read -r kind file msg; do
      case "${kind:-}" in
        MIRROR|UNTRACED|COLOUR|UNRESOLVED)
          printf '  %-9s %s/%s: %s\n' "$kind" "$p" "$file" "$msg"
          fail=1; asset_ok=0 ;;
      esac
    done < <(printf '%s\n' "$out")
  done

  if [ "$asset_decls" -lt "$ASSET_DECL_BASELINE" ]; then
    printf '  UNTESTED only %s stylesheet value(s) reached the comparison, against a committed baseline of %s\n' \
      "$asset_decls" "$ASSET_DECL_BASELINE"
    echo "  ^ this check adjudicated less than it did when the baseline was recorded, so an ok"
    echo "    here would certify values it never read. Either the extraction regressed (fix it),"
    echo "    or declarations were genuinely deleted (re-measure and lower ASSET_DECL_BASELINE)."
    fail=1; asset_ok=0
  elif [ "$asset_decls" -gt "$ASSET_DECL_BASELINE" ]; then
    printf '  ratchet  %s stylesheet value(s) adjudicated, above the committed baseline %s — raise ASSET_DECL_BASELINE\n' \
      "$asset_decls" "$ASSET_DECL_BASELINE"
  fi
fi
[ "$asset_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------------- 5. the intensity contract ---
# assets/intensity.contract.json is the entire interface between a style plugin
# and ui-morphism-core:token-emit — the curves, the clamps and the context caps
# that decide what a user's `--intensity=70` actually resolves to. It was
# ungated. Changing brutalism's `scope: product` cap from 45 to 99 was a shipped
# behaviour change with no doc backing and a green run.
#
# Three relations, all against the owning doc's §13:
#
#   * the default intensity, read out of §13's own inputs table (the row whose
#     first cell is `intensity` and whose next cell is the `0-100` range);
#   * every knob, both directions — a knob in the contract with no §13 row and a
#     §13 row with no knob both fail — and both ENDPOINTS of each, read from
#     §13's Min and Max columns. The doc labels those columns "Min (intensity 0)"
#     and "Max (intensity 100)", so the contract's value at 0 and at 100 is what
#     they are compared with. A Max cell naming two numbers (glassmorphism's
#     `0.30 (light tone) / 0.72 (dark tone)`) is satisfied by either.
#   * every context cap, against cap_of() above.
#
# The MIDPOINT is deliberately not checked. Each doc writes its intensity-50
# behaviour in its own shape — a Curve column in prose for doc 07, a "Default
# 24px" clause inside an Effect column for doc 09, a "Default (intensity 50)"
# column carrying RANGES for doc 03 — and pinning three different prose shapes
# would be a spelling test, not a check. What that leaves ungated: a contract
# whose curve is anchored at the wrong midpoint while both endpoints are right.
# assign-spans.test.mjs pins bento's midpoints against this file directly; the
# other two styles have no equivalent.
echo "==> checking assets/intensity.contract.json against its owning doc §13"
cap_ok=1
cap_files=0
if [ "$have_node" -eq 0 ] || [ -z "$tmpdir" ] || [ ! -d "$tmpdir" ]; then
  echo "  NOTRUN   node or a scratch directory is unavailable — NO intensity contract was read."
  fail=1; cap_ok=0
else
  for d in "${plugin_dirs[@]}"; do
    p=${d#plugins/}
    doc=$(doc_of "$p")
    contract="$d/assets/intensity.contract.json"
    [ -n "$doc" ] || continue

    if [ "$doc" = '-' ]; then
      if [ -f "$contract" ]; then
        printf '  UNMAPPED %s is registered as declaring no token layer, but ships %s\n' "$p" "$contract"
        fail=1; cap_ok=0
      fi
      continue
    fi
    if [ ! -f "$contract" ]; then
      printf '  NOCONTRACT %s: %s is missing, so %s §13 was NOT compared against anything\n' "$p" "$contract" "$doc"
      fail=1; cap_ok=0; continue
    fi
    if [ ! -f "$doc" ]; then
      printf '  NODOCFILE %s: owning doc %s is not on disk — %s was NOT checked\n' "$p" "$doc" "$contract"
      fail=1; cap_ok=0; continue
    fi

    s13="$tmpdir/sec13.$p.md"
    sec13 "$doc" > "$s13"
    if [ ! -s "$s13" ]; then
      printf '  NOSECTION %s has no §13 — %s was NOT checked\n' "$doc" "$contract"
      fail=1; cap_ok=0; continue
    fi

    caps_file="$tmpdir/caps.$p.tsv"
    cap_of "$p" > "$caps_file" 2>/dev/null
    orient_file="$tmpdir/orient.$p.tsv"
    knob_orientation_of "$p" > "$orient_file" 2>/dev/null
    exempt_file="$tmpdir/exempt.$p.tsv"
    endpoint_exempt_of "$p" > "$exempt_file" 2>/dev/null
    def_prov=$(default_provenance_of "$p")
    shape=$(knob_table_shape_of "$doc")
    if [ -z "$shape" ]; then
      printf '  NOSHAPE  %s has no entry in knob_table_shape_of() — how its §13 encodes knob endpoints is unknown, so %s was NOT compared\n' \
        "$doc" "$contract"
      fail=1; cap_ok=0; continue
    fi

    out=$(node -e '
      const fs = require("fs");
      const [contractPath, secPath, capsPath, docName, orientPath, defProv, exemptPath, shape] = process.argv.slice(1);
      const say = (k, m) => console.log(k + "\t" + m);

      let j;
      try { j = JSON.parse(fs.readFileSync(contractPath, "utf8")); }
      catch (e) { say("BADJSON", String(e.message)); process.exit(0); }

      const sec = fs.readFileSync(secPath, "utf8");
      const rows = sec.split("\n").filter((l) => /^\s*\|/.test(l));
      const cells = (l) => l.split("|").slice(1, -1).map((c) => c.replace(/`/g, "").trim());
      const nums = (s) => (s.match(/-?[0-9]+(?:\.[0-9]+)?/g) || []).map(Number);

      // --- the default intensity, out of the §13 inputs table -----------------
      let docDefault = null;
      for (const l of rows) {
        const c = cells(l);
        if (!c.length || c[0].toLowerCase() !== "intensity") continue;
        const i = c.findIndex((x) => /^0\s*[-–]\s*100$/.test(x));
        if (i >= 0 && c[i + 1] !== undefined) docDefault = nums(c[i + 1])[0];
      }
      // Nine docs table their inputs and state the default beside the 0-100
      // range. Doc 04 writes its §13 inputs as a BULLET LIST and names a range
      // with no default, so there is nothing on that side to compare and the
      // check said so and moved on — a NOTRUN that exited 0. Which of the two
      // situations a plugin is in is registered rather than inferred, so a doc
      // that stops stating a default fails instead of silently going unchecked.
      if (defProv === "derived") {
        if (docDefault !== undefined && docDefault !== null) {
          say("DEFAULTPROV", docName + " §13 now states default intensity " + docDefault + ", but the registry records the default for this plugin as derived — re-register it as `doc`");
        } else if (!String(j.defaultProvenance || "").trim()) {
          say("NOPROV", docName + " §13 states no default intensity and the contract carries no `defaultProvenance` explaining where " + j.default + " came from");
        } else {
          say("note", "default intensity " + j.default + " is NOT stated by " + docName + " §13; it is derived, and the contract `defaultProvenance` field says from what");
        }
      } else if (docDefault === undefined || docDefault === null) {
        say("NODEFAULT", docName + " §13 states no `intensity | 0-100 | N` input row, so the contract default was NOT checked");
      } else if (j.default !== docDefault) {
        say("DEFAULT", "contract default is " + j.default + "; " + docName + " §13 says " + docDefault);
      }

      // --- the knob table -----------------------------------------------------
      //
      // The ten docs head this table five different ways, and the previous
      // revision read only one of them. `Min` / `Max` matched docs 02, 03, 04,
      // 08 and 09; docs 01 ("At 0" / "At 100") and 05 ("At intensity 0" / "At
      // intensity 100") matched NOTHING, so skeuomorphism-ui and minimalism-ui
      // reported NOKNOBS, five EXTRAKNOBs each and zero endpoints compared —
      // two whole intensity contracts held against nothing.
      //
      // The five headings also carry two DIFFERENT MEANINGS, which is the part
      // that mattered. A column labelled with an intensity — `Min (intensity
      // 0)`, `At 0`, `At intensity 0` — states the value AT that endpoint, so
      // the comparison is oriented. A bare `Min` / `Max` pair states the knob
      // numeric RANGE and says nothing about which end intensity 0 sits at.
      // Reading a bare `Min` as "the value at intensity 0" is what made
      // the `fillAlpha` of liquid-glass-ui look broken: the contract runs 0.95 → 0.55
      // because a glassier surface is a THINNER fill, and doc 08 tables that
      // same pair as the range 0.55 .. 0.95. The contract was right and the
      // check was wrong.
      const ORIENT_LO = /^(min\s*\(\s*intensity\s*0\s*\)|at\s*(intensity\s*)?0)$/i;
      const ORIENT_HI = /^(max\s*\(\s*intensity\s*100\s*\)|at\s*(intensity\s*)?100)$/i;
      let col = null; const docKnobs = {};
      for (const l of sec.split("\n")) {
        if (!/^\s*\|/.test(l)) { col = null; continue; }
        const c = cells(l);
        if (!c.length || /^:?-+:?$/.test(c[0])) continue;
        if (!col) {
          const k = c.findIndex((x) => /^knob\b/i.test(x));
          if (k < 0) continue;
          let lo = c.findIndex((x) => ORIENT_LO.test(x));
          let hi = c.findIndex((x) => ORIENT_HI.test(x));
          let oriented = true;
          if (lo < 0 || hi < 0) {
            lo = c.findIndex((x) => /^min\b/i.test(x));
            hi = c.findIndex((x) => /^max\b/i.test(x));
            oriented = false;
          }
          if (lo >= 0 && hi >= 0) col = { k, lo, hi, oriented };
          continue;
        }
        // Doc 07 glosses in parentheses — `chroma (accent saturation)`; doc 05
        // glosses after an em dash — `chromaBudget — max OKLCH chroma …`. Doc
        // 10 states one knob as two custom properties joined by " / ", which is
        // the real knob name and must survive both strips.
        const name = (c[col.k] || "")
          .replace(/\s*[—–]\s.*$/, "")
          .replace(/\s*\(.*\)\s*$/, "")
          .trim();
        // `oriented` is carried on the ROW, not read back off `col` later: `col`
        // is reset the moment the table ends, and reading it after the loop is
        // how this check briefly reported NOKNOBS for all ten docs at once.
        if (name) docKnobs[name] = { lo: nums(c[col.lo] || ""), hi: nums(c[col.hi] || ""), oriented: col.oriented };
      }
      if (!Object.keys(docKnobs).length) {
        say("NOKNOBS", docName + " §13 yielded no knob table this check can read — the knob curves were NOT checked");
      }

      const jKnobs = j.knobs || {};
      for (const n of Object.keys(jKnobs)) {
        if (!docKnobs[n]) say("EXTRAKNOB", "contract declares knob `" + n + "`; " + docName + " §13 tables no such knob");
      }
      for (const n of Object.keys(docKnobs)) {
        if (!jKnobs[n]) say("MISSINGKNOB", docName + " §13 tables knob `" + n + "`; the contract declares no such knob");
      }

      // The shape the doc was registered as must be the shape it still has. A
      // doc that reformats its knob table from oriented columns to a bare range,
      // or the other way, changes what this check is entitled to assert, and it
      // may not do that silently.
      const seenShape = Object.values(docKnobs).some((d) => d.oriented) ? "oriented" : "range";
      if (shape !== "prose" && shape !== seenShape) {
        say("SHAPE", docName + " §13 now heads its knob table as `" + seenShape + "`; knob_table_shape_of() registers `" + shape + "`");
      }

      // Orientation registry for the `range` docs, keyed knob -> at0-is-min |
      // at0-is-max: which of the two range cells the intensity-0 value sits in.
      const orient = new Map();
      for (const l of fs.readFileSync(orientPath, "utf8").split("\n")) {
        if (!l.trim()) continue;
        const [k, dir] = l.split("\t");
        orient.set(k, dir);
      }
      const orientSeen = new Set();

      // Endpoint cells an `oriented` doc states in words rather than numbers.
      const exempt = new Set();
      for (const l of fs.readFileSync(exemptPath, "utf8").split("\n")) {
        if (!l.trim()) continue;
        const [k, x] = l.split("\t");
        exempt.add(k + "@" + x);
      }
      const exemptSeen = new Set();

      let endpoints = 0;
      for (const [n, k] of Object.entries(jKnobs)) {
        const dk = docKnobs[n];
        if (!dk) continue;
        const at = (x) => {
          if (Array.isArray(k.anchors)) {
            const a = k.anchors.find((a) => a[0] === x);
            return a ? a[1] : undefined;
          }
          return x === 0 ? k.at0 : k.at100;
        };
        const v0 = at(0), v100 = at(100);
        if (v0 === undefined || v100 === undefined) {
          say("NOENDPOINT", "knob `" + n + "` states no value at intensity " + (v0 === undefined ? 0 : 100) + " — no anchor there and no at0/at100");
          continue;
        }
        if (shape === "prose") continue;   // knob names gated above; values are not gated at all
        if (dk.oriented) {
          for (const [x, got, want, label] of
               [[0, v0, dk.lo, "Min (intensity 0)"], [100, v100, dk.hi, "Max (intensity 100)"]]) {
            const key = n + "@" + x;
            if (!want.length) {
              if (exempt.has(key)) { exemptSeen.add(key); say("note", "knob `" + n + "` at intensity " + x + ": " + docName + " §13 states that end in words, not a number — registered in endpoint_exempt_of() and NOT doc-gated"); }
              else say("NONUMBER", "knob `" + n + "` at intensity " + x + ": " + docName + " §13 " + label + " states no number, so " + got + " was NOT compared");
              continue;
            }
            if (exempt.has(key)) {
              exemptSeen.add(key);
              say("STALEEXEMPT", "endpoint_exempt_of() registers `" + n + "` at intensity " + x + " as stated in words; " + docName + " §13 " + label + " now states " + want.join(" / "));
              continue;
            }
            endpoints++;
            if (!want.includes(got)) {
              say("ENDPOINT", "knob `" + n + "` is " + got + " at intensity " + x + "; " + docName + " §13 " + label + " says " + want.join(" / "));
            }
          }
        } else {
          if (!dk.lo.length || !dk.hi.length) {
            say("NONUMBER", "knob `" + n + "`: " + docName + " §13 tables no numeric Min/Max pair, so " + v0 + " → " + v100 + " was NOT compared");
            continue;
          }
          endpoints += 2;
          const loFirst = dk.lo.includes(v0) && dk.hi.includes(v100);
          const hiFirst = dk.hi.includes(v0) && dk.lo.includes(v100);
          if (!loFirst && !hiFirst) {
            say("ENDPOINT", "knob `" + n + "` runs " + v0 + " → " + v100 + "; " + docName + " §13 tables the range " + dk.lo.join("/") + " .. " + dk.hi.join("/"));
            continue;
          }
          const dir = loFirst ? "at0-is-min" : "at0-is-max";
          orientSeen.add(n);
          const reg = orient.get(n);
          if (!reg) {
            say("NOORIENT", "knob `" + n + "` runs " + dir + " (" + v0 + " → " + v100 + ") and " + docName + " §13 states only a range; register it in knob_orientation_of()");
          } else if (reg !== dir) {
            say("ORIENT", "knob `" + n + "` now runs " + dir + " (" + v0 + " → " + v100 + "); the committed registry says " + reg);
          }
        }
      }
      for (const n of orient.keys()) {
        if (!orientSeen.has(n)) say("GONEORIENT", "knob_orientation_of() registers `" + n + "`; no range-tabled knob of that name was compared");
      }
      for (const key of exempt) {
        if (!exemptSeen.has(key)) say("GONEEXEMPT", "endpoint_exempt_of() registers `" + key.replace("@", "` at intensity ") + "; no such knob endpoint was reached");
      }
      if (shape === "prose") {
        say("note", docName + " §13 states its knob endpoints in words, not values (knob_table_shape_of: prose). The knob SET was gated in both directions; the endpoint numbers were NOT gated against the doc, because the doc does not state them");
      }

      // --- the context caps ---------------------------------------------------
      const registry = new Map();
      for (const l of fs.readFileSync(capsPath, "utf8").split("\n")) {
        if (!l.trim()) continue;
        const [when, cap, prov] = l.split("\t");
        registry.set(when, { cap: Number(cap), prov });
      }
      const seen = new Set();
      for (const c of (j.contextCaps || [])) {
        const keys = Object.keys(c.when || {});
        if (keys.length !== 1) {
          say("CAPSHAPE", "a contextCaps entry has " + keys.length + " condition keys; this registry keys a cap on exactly one");
          continue;
        }
        const key = keys[0] + "=" + c.when[keys[0]];
        seen.add(key);
        const reg = registry.get(key);
        if (!reg) {
          say("UNREGISTERED", "contract caps `" + key + "` at " + c.cap + "; cap_of() has no entry for it");
          continue;
        }
        if (reg.cap !== c.cap) {
          say("CAP", "`" + key + "` caps intensity at " + c.cap + "; the committed registry says " + reg.cap);
          continue;
        }
        if (reg.prov === "doc") {
          const re = new RegExp("(^|[^0-9.])" + String(reg.cap).replace(".", "\\.") + "([^0-9]|$)");
          if (!re.test(sec)) {
            say("UNSOURCEDCAP", "`" + key + "` caps at " + reg.cap + ", recorded as stated by " + docName + " §13, which no longer states that number");
          }
        } else {
          say("note", "`" + key + "` caps at " + reg.cap + " — recorded in cap_of() as stated nowhere in " + docName + ", and therefore NOT doc-gated");
        }
      }
      for (const key of registry.keys()) {
        if (!seen.has(key)) say("GONECAP", "cap_of() registers `" + key + "`; the contract declares no such cap");
      }
      say("COUNT", String(endpoints));
      say("KNOBS", String(Object.keys(jKnobs).filter((n) => docKnobs[n]).length));
    ' "$contract" "$s13" "$caps_file" "$doc" "$orient_file" "$def_prov" "$exempt_file" "$shape" 2>&1)

    if [ $? -ne 0 ]; then
      printf '  SCANFAIL %s: the contract scan itself failed\n' "$p"
      indent "$out"
      fail=1; cap_ok=0; continue
    fi

    n=$(printf '%s\n' "$out" | awk -F'\t' '$1 == "COUNT" { print $2; exit }')
    nk=$(printf '%s\n' "$out" | awk -F'\t' '$1 == "KNOBS" { print $2; exit }')
    if [ "$shape" = 'prose' ]; then
      # Zero endpoints is the REGISTERED outcome here, not a silent skip. What
      # must still be non-zero is the knob set: a prose doc whose knob table
      # yields no knobs at all has told this check nothing.
      if [ -z "$nk" ] || [ "$nk" -eq 0 ]; then
        printf '  NOKNOBSET %s: %s §13 is registered `prose`, so no endpoint is gated — and not one knob NAME was compared either\n' "$p" "$doc"
        fail=1; cap_ok=0
      else
        cap_files=$((cap_files + 1))
        printf '  %-17s %s knob name(s) vs %s §13, endpoints NOT doc-gated (prose)\n' "$p" "$nk" "$doc"
      fi
    elif [ -z "$n" ] || [ "$n" -eq 0 ]; then
      printf '  NOENDPOINTS %s: not one knob endpoint was compared against %s §13\n' "$p" "$doc"
      fail=1; cap_ok=0
    else
      cap_files=$((cap_files + 1))
      printf '  %-17s %s knob endpoint(s) vs %s §13\n' "$p" "$n" "$doc"
    fi
    while IFS=$'\t' read -r kind msg; do
      case "${kind:-}" in
        COUNT|KNOBS|'') ;;
        note) printf '  note     %s: %s\n' "$p" "$msg" ;;
        *)    printf '  %-9s %s: %s\n' "$kind" "$p" "$msg"; fail=1; cap_ok=0 ;;
      esac
    done < <(printf '%s\n' "$out")
  done

  if [ "$cap_files" -eq 0 ]; then
    echo "  NOCONTRACTS no intensity contract was compared against anything."
    echo "  ^ zero comparisons is a FAILURE, not a clean run."
    fail=1; cap_ok=0
  fi
fi
[ "$cap_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------------ 6. catalog ↔ manifest -------
# Every source resolves to a real directory carrying .claude-plugin/plugin.json,
# every plugin.json name equals its marketplace entry name exactly, and where an
# entry also states a version, that version equals the manifest's.
#
# The name half is not cosmetic. Claude Code keys enabledPlugins on the
# marketplace entry's name while the plugin's own components are namespaced by
# plugin.json's name, so a mismatch installs a plugin whose skills are addressed
# under a name nothing enables — docs/MARKETPLACE.md §4 states the rule and this
# is what enforces it.
#
# The version half is not cosmetic either, for a quieter reason. plugin.json
# wins where the two disagree, so a stale marketplace version does not break an
# install — it misreports one. The catalog is what a user reads before deciding
# to install, and it is the copy nothing else in this repository would ever
# contradict, so drift here is invisible until someone compares the two by hand.
# docs/MARKETPLACE.md §10.3 records lockstep versioning as the shipped policy
# and named this gate as the hole; this closes it. An entry that omits `version`
# is not an offence — it delegates to the manifest, which is the other legal
# policy — but an entry that states one must state the right one.
echo "==> checking marketplace sources resolve, and names and versions match their manifests"
cat_ok=1
cat_checked=0
cat_versioned=0
if [ "$have_node" -eq 0 ] || [ ! -f "$MARKETPLACE" ]; then
  echo "  NOTRUN   node or $MARKETPLACE is unavailable — NO catalog entry was resolved."
  fail=1; cat_ok=0
else
  proot=$(json_field "$MARKETPLACE" 'metadata.pluginRoot')
  while IFS=$'\t' read -r name src entry_ver; do
    [ -n "${name:-}" ] || continue
    cat_checked=$((cat_checked + 1))

    case "$src" in
      \<non-local:*)
        printf '  NONLOCAL %s: source is %s, which this gate cannot resolve to a directory on disk\n' "$name" "$src"
        fail=1; cat_ok=0; continue ;;
    esac

    # A source is a path relative to the repo root, and the manifest schema
    # requires the leading `./` — `claude plugin validate` rejects a bare
    # directory name with `plugins.N.source: Invalid input`, with or without
    # metadata.pluginRoot, so this catalog sets no pluginRoot. The bare-name
    # branch below is kept anyway: it costs one case arm, and resolving a name
    # the schema would have rejected is strictly better than resolving it
    # against the repo root and reporting the wrong missing directory.
    case "$src" in
      ./*|../*|/*) dir="$src" ;;
      *)           dir="${proot:+$proot/}$src" ;;
    esac
    dir=${dir#./}

    if [ ! -d "$dir" ]; then
      printf '  NOSOURCE %s: source `%s` resolves to %s, which is not a directory — install fails with a bare "Source path does not exist"\n' \
        "$name" "$src" "$dir"
      fail=1; cat_ok=0; continue
    fi
    if [ ! -f "$dir/.claude-plugin/plugin.json" ]; then
      printf '  NOMANIFEST %s: %s has no .claude-plugin/plugin.json\n' "$name" "$dir"
      fail=1; cat_ok=0; continue
    fi

    mname=$(json_field "$dir/.claude-plugin/plugin.json" 'name')
    if [ $? -ne 0 ]; then
      printf '  BADJSON  %s/.claude-plugin/plugin.json did not parse\n' "$dir"
      fail=1; cat_ok=0; continue
    fi
    if [ "$mname" != "$name" ]; then
      printf '  NAME     %s: marketplace entry is `%s`, plugin.json says `%s` — enabledPlugins keys the former and components namespace under the latter\n' \
        "$dir" "$name" "${mname:-<unset>}"
      fail=1; cat_ok=0
    fi

    if [ -n "${entry_ver:-}" ]; then
      cat_versioned=$((cat_versioned + 1))
      mver=$(json_field "$dir/.claude-plugin/plugin.json" 'version')
      if [ "$mver" != "$entry_ver" ]; then
        printf '  VERSION  %s: catalog offers `%s`, plugin.json ships `%s` — plugin.json wins, so the catalog is advertising a version nobody installs\n' \
          "$name" "$entry_ver" "${mver:-<unset>}"
        fail=1; cat_ok=0
      fi
    fi
  done < <(mk_entries)

  if [ "$cat_checked" -eq 0 ]; then
    echo "  NOENTRIES the catalog yielded no entries to resolve."
    echo "  ^ zero entries adjudicated is a FAILURE, not a clean run."
    fail=1; cat_ok=0
  else
    printf '  %s catalog entry/entries resolved, %s of them version-compared\n' \
      "$cat_checked" "$cat_versioned"
  fi
fi
[ "$cat_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------------------------ 7. SKILL.md -----
# Every skill directory holds a SKILL.md with parseable frontmatter carrying
# `name` and `description`, and `name` equals the directory. The directory is
# what the skill is discovered as; the `name` field is what pins the invocation
# across a versioned install directory (docs/MARKETPLACE.md §6 Naming note).
# Disagreement means the skill answers to two names.
echo "==> checking every skill has a parseable SKILL.md with name and description"
skill_ok=1
# Globbed, not found(1)-walked: a skill directory is exactly one level under a
# plugin's skills/, and `find -mindepth`/`-maxdepth`/`-depth n` are the three
# mutually incompatible spellings of that constraint across BSD and GNU. The
# glob says it once and portably. A nested directory below a skill is the
# skill's own references/ or scripts/, not a second skill.
skill_dirs=()
for sd in plugins/*/skills/*/; do
  [ -d "$sd" ] || continue
  skill_dirs+=("${sd%/}")
done

if [ "${#skill_dirs[@]}" -eq 0 ]; then
  echo "  NOSKILLS the plugins/*/skills/* glob matched nothing — zero skills checked."
  echo "  ^ zero is a FAILURE, not a clean run."
  fail=1; skill_ok=0
fi

descs=''    # "len<TAB>defenceEnd<TAB>path" per skill, carried into check 9
for sd in "${skill_dirs[@]}"; do
  f="$sd/SKILL.md"
  if [ ! -f "$f" ]; then
    printf '  NOSKILL  %s has no SKILL.md — the directory is not a skill\n' "$sd"
    fail=1; skill_ok=0; continue
  fi
  fm=$(frontmatter "$f")
  if [ -z "$fm" ]; then
    printf '  NOFM     %s: no parseable `---` frontmatter block\n' "$f"
    fail=1; skill_ok=0; continue
  fi
  sname=$(fm_scalar "$f" name)
  sdesc=$(fm_scalar "$f" description)
  if [ -z "$sname" ]; then
    printf '  NONAME   %s: frontmatter carries no `name`\n' "$f"
    fail=1; skill_ok=0
  elif [ "$sname" != "$(basename "$sd")" ]; then
    printf '  NAME     %s: frontmatter name is `%s`, directory is `%s` — the skill answers to two names\n' \
      "$f" "$sname" "$(basename "$sd")"
    fail=1; skill_ok=0
  fi
  if [ -z "$sdesc" ]; then
    printf '  NODESC   %s: frontmatter carries no `description` (or it is in a shape this parser cannot read)\n' "$f"
    fail=1; skill_ok=0
    continue
  fi
  if [ "$have_node" -eq 1 ]; then
    n=$(printf '%s' "$sdesc" | charlen)
    # `-` rather than an empty field: bash treats a run of TABs as ONE delimiter
    # (tab is IFS whitespace), so an empty middle field silently shifts the path
    # into it and the row is dropped by the `[ -n "$f" ]` guard — which is to say
    # the description with NO deference clause would be the one description this
    # check never looked at. Found by mutation, in the check written to catch it.
    dend=$(printf '%s' "$sdesc" | deference_end)
    descs="${descs}${n}	${dend:--}	${f}
"
  fi
done
[ "$skill_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------------- 8. the frontmatter grant ---
# `allowed-tools` is the skill's tool grant. The frontmatter contract reads it as
# a COMMA-separated scalar or a YAML list; a space-separated scalar parses as one
# tool name with spaces in it, which matches nothing, so the grant is inert and
# the skill silently runs on whatever the session already allows.
#
# All nine SKILL.md files in this repo shipped exactly that. `claude plugin
# validate --strict` does not catch it and cannot: it type-checks the field and
# stops, and it accepts `NotARealTool, AlsoFake(zzz)` without a word. So the
# syntax is adjudicated here.
#
# A parenthesised argument — `Bash(node ${CLAUDE_SKILL_DIR}/scripts/x.mjs *)` —
# legitimately contains spaces, so the argument is removed before the entry is
# judged. Whatever is left must be a single bare token. That is the whole rule,
# and it is structural: nothing is exempt by name.
#
# What this does NOT check: whether the named tools exist. See the header.
echo "==> checking the allowed-tools grant syntax"
grant_ok=1
grant_checked=0
for sd in "${skill_dirs[@]}"; do
  f="$sd/SKILL.md"
  [ -f "$f" ] || continue

  verdict=$(frontmatter "$f" | awk '
    function paren_free(s) { while (s ~ /\([^()]*\)/) gsub(/\([^()]*\)/, "", s); return s }
    function trim(s) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", s); return s }
    function judge(entry,   e) {
      e = trim(paren_free(entry))
      if (e == "") { print "EMPTY\t" entry; bad = 1; return }
      if (e ~ /[[:space:]]/) { print "SPACESEP\t" trim(entry); bad = 1; return }
      if (e !~ /^[A-Za-z][A-Za-z0-9_.:-]*$/) { print "SHAPE\t" trim(entry); bad = 1; return }
      n++
    }
    function split_scalar(s,   i, k, parts) {
      # A flow sequence is a list written on one line.
      if (s ~ /^\[.*\]$/) { sub(/^\[/, "", s); sub(/\]$/, "", s) }
      k = split(s, parts, ",")
      for (i = 1; i <= k; i++) judge(parts[i])
    }

    # `allowed-tools: value`
    !seen && /^allowed-tools:[[:space:]]*[^[:space:]>|]/ {
      seen = 1; v = $0; sub(/^allowed-tools:[[:space:]]*/, "", v); split_scalar(v); next
    }
    # `allowed-tools: >-` / `|-` — a folded or literal block scalar. It folds to
    # one line, so it is judged exactly as an inline scalar is.
    !seen && /^allowed-tools:[[:space:]]*[>|][-+]?[[:space:]]*$/ { seen = 1; blk = 1; next }
    blk {
      if ($0 ~ /^[^[:space:]]/) { blk = 0 } else { acc = (acc == "" ? trim($0) : acc " " trim($0)); next }
    }
    # `allowed-tools:` followed by an indented YAML block sequence.
    !seen && /^allowed-tools:[[:space:]]*$/ { seen = 1; seq = 1; next }
    seq {
      if ($0 ~ /^[[:space:]]*-[[:space:]]+/) { e = $0; sub(/^[[:space:]]*-[[:space:]]+/, "", e); judge(e); items++; next }
      if ($0 ~ /^[^[:space:]]/) { seq = 0 }
    }

    END {
      if (blk || acc != "") split_scalar(acc)
      if (!seen) { print "NOGRANT\t"; exit }
      if (seq && items == 0) { print "EMPTYSEQ\t"; exit }
      print "COUNT\t" n + 0
    }
  ')

  n=$(printf '%s\n' "$verdict" | awk -F'\t' '$1 == "COUNT" { print $2; exit }')
  grant_checked=$((grant_checked + ${n:-0}))
  while IFS=$'\t' read -r kind entry; do
    case "${kind:-}" in
      COUNT|'') ;;
      SPACESEP)
        printf '  SPACESEP %s: `allowed-tools` entry `%s` is space-separated. The contract is a comma-separated\n' "$f" "$entry"
        printf '           scalar or a YAML list; as written this is ONE tool name containing spaces, it matches\n'
        printf '           nothing, and the grant is inert.\n'
        fail=1; grant_ok=0 ;;
      SHAPE)
        printf '  SHAPE    %s: `allowed-tools` entry `%s` is not a bare tool name with an optional (argument)\n' "$f" "$entry"
        fail=1; grant_ok=0 ;;
      EMPTY)
        printf '  EMPTY    %s: `allowed-tools` has an empty entry — a stray comma or a dangling list item\n' "$f"
        fail=1; grant_ok=0 ;;
      EMPTYSEQ)
        printf '  EMPTYSEQ %s: `allowed-tools:` opens a list and lists nothing\n' "$f"
        fail=1; grant_ok=0 ;;
      NOGRANT)
        printf '  NOGRANT  %s: no `allowed-tools` in the frontmatter. Every skill in this set declares one, and a\n' "$f"
        printf '           skill that stops declaring one loses its grant with no error anywhere.\n'
        fail=1; grant_ok=0 ;;
    esac
  done < <(printf '%s\n' "$verdict")
done
if [ "$grant_checked" -eq 0 ]; then
  echo "  NOGRANTS not one allowed-tools entry was read across the whole skill set."
  echo "  ^ zero entries adjudicated is a FAILURE, not a clean run."
  fail=1; grant_ok=0
else
  printf '  %s tool grant(s) adjudicated across %s skill(s)\n' "$grant_checked" "${#skill_dirs[@]}"
fi
[ "$grant_ok" -eq 1 ] && echo "  ok"

# --------------------------------------- 9. description budget and deference ---
# Two things about the same string, and the second is the one that matters.
#
# LENGTH: no description exceeds DESC_MAX. Every length prints — see the note at
# DESC_MAX for why the budget sits below the platform's own cap.
#
# THE DEFERENCE CLAUSE ITSELF: the budget exists to keep the clause from being
# truncated away, and until now the budget was the ONLY thing checked. Nine lines
# of comment explained that the clause is load-bearing and nothing asserted that
# it was there, so deleting one outright — the exact failure the budget is a
# proxy for — passed. Both halves are now checked: the clause must be present,
# and it must END inside DESC_LISTING_CAP, because a clause that begins in the
# budget and finishes past the cap is a clause the model never finishes reading.
echo "==> checking SKILL.md description lengths (cap $DESC_MAX, listing truncates at $DESC_LISTING_CAP) and the deference clause"
desc_ok=1
n_desc=$(printf '%s' "$descs" | grep -c .)
if [ "$have_node" -eq 0 ]; then
  echo "  NOTRUN   node is not on PATH — NO description was measured."
  fail=1; desc_ok=0
elif [ "$n_desc" -eq 0 ]; then
  echo "  NODESCS  no description was measured."
  echo "  ^ zero measurements is a FAILURE, not a clean run."
  fail=1; desc_ok=0
else
  while IFS=$'\t' read -r n dend f; do
    [ -n "${f:-}" ] || continue
    if [ "$n" -gt "$DESC_LISTING_CAP" ]; then
      printf '  TRUNCATED %5s  %s  (over the %s listing cap by %s — the tail, which carries the deference clause, does not reach the model)\n' \
        "$n" "$f" "$DESC_LISTING_CAP" "$((n - DESC_LISTING_CAP))"
      fail=1; desc_ok=0
    elif [ "$n" -gt "$DESC_MAX" ]; then
      printf '  TOOLONG   %5s  %s  (over the %s budget by %s; %s to the listing cap)\n' \
        "$n" "$f" "$DESC_MAX" "$((n - DESC_MAX))" "$((DESC_LISTING_CAP - n))"
      fail=1; desc_ok=0
    else
      printf '  ok        %5s  %s\n' "$n" "$f"
    fi

    if [ "$dend" = '-' ]; then
      printf '  NODEFER   %5s  %s  carries no deference clause. Every description in this set hands\n' "$n" "$f"
      printf '            "make it look good", "audit my accessibility" and "animate this" to the tool that\n'
      printf '            answers them better, in a sentence saying that tool should win them. Without it this\n'
      printf '            skill bids against accesslint, impeccable, frontend-design and ui-ux-pro-max on\n'
      printf '            their own ground. The length budget is a proxy for this clause; it is not this clause.\n'
      fail=1; desc_ok=0
    elif [ "$dend" -gt "$DESC_LISTING_CAP" ]; then
      printf '  CUTDEFER  %5s  %s  deference clause ends at %s, past the %s listing cap — it is truncated away\n' \
        "$n" "$f" "$dend" "$DESC_LISTING_CAP"
      fail=1; desc_ok=0
    fi
  done < <(printf '%s' "$descs")
fi
[ "$desc_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------------ 10. SKILL.md path targets ---
# A SKILL.md that tells the model to read `references/tokens.md`, run
# `${CLAUDE_SKILL_DIR}/scripts/glass-scan.mjs` or copy
# `${CLAUDE_PLUGIN_ROOT}/assets/intensity.contract.json` has made a promise about
# the shipped tree. Nothing checked it: a typo in a path, or deleting an asset a
# SKILL.md still names, passed the whole gate and fails at the user, mid-run.
#
# What counts as a path reference is deliberately narrow, and narrow
# STRUCTURALLY rather than by keyword: a string ending in a real extension and
# anchored on one of the four ways this repo addresses its own tree —
# `${CLAUDE_SKILL_DIR}/…`, `${CLAUDE_PLUGIN_ROOT}/…`, a `../` hop to a sibling
# skill, or a bare `references|assets|scripts|docs/…`. That is the addressing
# scheme, so it is also exactly the set of strings that can be resolved. The
# OUTPUT paths a skill promises to write — `tokens/glass.tokens.css`,
# `styles/glass.layer.css`, `reports/GLASS-AUDIT.md` — are anchored on none of
# them and are not, and must not be, checked for existence.
#
# A bare `references/…` in a skill that HAS NO references/ directory is about
# somebody else's skill: core's a11y-validate says "the style plugin's own
# `references/checklist.md`". That is recognised by the absence of the directory,
# not by reading the sentence, and it is counted against SKILLREF_FOREIGN_MAX so
# the category cannot quietly grow.
echo "==> checking every path a SKILL.md names is on disk"
ref_ok=1
if [ "$have_node" -eq 0 ]; then
  echo "  NOTRUN   node is not on PATH — NO SKILL.md path reference was resolved."
  fail=1; ref_ok=0
else
  ref_out=$(node -e '
    const fs = require("fs"), path = require("path");
    const RE = /(?:\$\{CLAUDE_SKILL_DIR\}|\$\{CLAUDE_PLUGIN_ROOT\}|(?:\.\.\/)+|(?:references|assets|scripts|docs)\/)[A-Za-z0-9._\/${}-]*\.(?:md|css|mjs|json|js|ts|svg|py)/g;
    let adjudicated = 0, foreign = 0;
    for (const plug of fs.readdirSync("plugins")) {
      const skillsDir = "plugins/" + plug + "/skills";
      if (!fs.existsSync(skillsDir)) continue;
      for (const s of fs.readdirSync(skillsDir)) {
        const sd = skillsDir + "/" + s;
        const f = sd + "/SKILL.md";
        if (!fs.existsSync(f)) continue;
        for (const hit of new Set(fs.readFileSync(f, "utf8").match(RE) || [])) {
          let rel = hit, base = sd;
          if (rel.startsWith("${CLAUDE_SKILL_DIR}/")) rel = rel.slice("${CLAUDE_SKILL_DIR}/".length);
          else if (rel.startsWith("${CLAUDE_PLUGIN_ROOT}/")) { rel = rel.slice("${CLAUDE_PLUGIN_ROOT}/".length); base = "plugins/" + plug; }
          else if (rel.startsWith("docs/")) base = ".";
          else if (!rel.startsWith("..")) {
            const top = rel.split("/")[0];
            if (!fs.existsSync(path.join(sd, top))) {
              foreign++;
              console.log("foreign\t" + f + "\t" + hit + "\t(this skill has no " + top + "/ of its own, so the path is another plugin’s and cannot be resolved from here)");
              continue;
            }
          }
          const target = path.normalize(path.join(base, rel));
          adjudicated++;
          if (!fs.existsSync(target)) console.log("MISSING\t" + f + "\t" + hit + "\t" + target);
        }
      }
    }
    console.log("COUNT\t" + adjudicated + "\t" + foreign + "\t");
  ' 2>&1)

  if [ $? -ne 0 ]; then
    echo "  SCANFAIL the path scan itself failed"
    indent "$ref_out"
    fail=1; ref_ok=0
  else
    while IFS=$'\t' read -r kind f hit extra; do
      case "${kind:-}" in
        MISSING)
          printf '  MISSING  %s names `%s`, which resolves to %s — not on disk\n' "$f" "$hit" "$extra"
          fail=1; ref_ok=0 ;;
        foreign)
          printf '  note     %s names `%s` %s\n' "$f" "$hit" "$extra" ;;
      esac
    done < <(printf '%s\n' "$ref_out")

    n_ref=$(printf '%s\n' "$ref_out" | awk -F'\t' '$1 == "COUNT" { print $2; exit }')
    n_foreign=$(printf '%s\n' "$ref_out" | awk -F'\t' '$1 == "COUNT" { print $3; exit }')
    printf '  %s path reference(s) resolved, %s unresolvable by construction\n' "${n_ref:-0}" "${n_foreign:-0}"
    if [ "${n_ref:-0}" -lt "$SKILLREF_BASELINE" ]; then
      printf '  UNTESTED only %s path reference(s) reached the existence test, against a committed baseline of %s\n' \
        "${n_ref:-0}" "$SKILLREF_BASELINE"
      echo "  ^ the extraction adjudicated less than when the baseline was recorded. Fix it, or"
      echo "    re-measure and lower SKILLREF_BASELINE in a reviewed diff."
      fail=1; ref_ok=0
    elif [ "${n_ref:-0}" -gt "$SKILLREF_BASELINE" ]; then
      printf '  ratchet  %s path reference(s) resolved, above the committed baseline %s — raise SKILLREF_BASELINE\n' \
        "${n_ref:-0}" "$SKILLREF_BASELINE"
    fi
    if [ "${n_foreign:-0}" -gt "$SKILLREF_FOREIGN_MAX" ]; then
      printf '  FOREIGN  %s path reference(s) could not be resolved at all, above the committed ceiling of %s\n' \
        "${n_foreign:-0}" "$SKILLREF_FOREIGN_MAX"
      echo "  ^ every one of these is a path this gate cannot check. Two are known and correct"
      echo "    (core naming the CALLING style's files). A third needs reading before it is"
      echo "    accepted: raise SKILLREF_FOREIGN_MAX only with the reason in the diff."
      fail=1; ref_ok=0
    fi
  fi
fi
[ "$ref_ok" -eq 1 ] && echo "  ok"

# -------------------------------------------- 11. contrast figure provenance ---
# The plugin tree restates the research's contrast figures — in SKILL.md prose,
# in references/tokens.md tables, in the audit checklists. A wrong ratio written
# into any of them passed everything.
#
# Correctness of a figure is docs/check-contrast.py's job, and it does it well
# over docs/: it recomputes every `N:1` claim from the colours named beside it.
# What is checked HERE is provenance — that every figure a plugin file prints is
# a figure its owning doc prints — because a figure that matches a verified doc
# figure inherits that verification, and a figure that matches nothing in the doc
# was made up somewhere between the research and the artefact.
#
# "Prints" allows a plugin file to be MORE precise than the doc, and only more:
# a doc figure of `14.6:1` grounds a plugin's `14.596:1`, because 14.596 rounds
# to 14.6 at the doc's own printed precision. It never allows the reverse, and it
# never allows a figure the doc does not state at any precision.
#
# ui-morphism-core owns no doc, so its files are held against the whole doc set —
# which is right: core's figures come from MARKETPLACE.md and 00-comparison-
# matrix.md as much as from any style doc.
#
# What this does not catch, stated plainly: swapping one doc-stated figure for a
# DIFFERENT doc-stated figure. See the ungated list in the header for why the
# arithmetic itself is not recomputed here.
echo "==> checking every contrast figure a plugin file prints is one its doc prints"
fig_ok=1
if [ "$have_node" -eq 0 ] || [ -z "$tmpdir" ] || [ ! -d "$tmpdir" ]; then
  echo "  NOTRUN   node or a scratch directory is unavailable — NO contrast figure was traced."
  fail=1; fig_ok=0
else
  owners="$tmpdir/owners.tsv"
  : > "$owners"
  for d in "${plugin_dirs[@]}"; do
    p=${d#plugins/}
    printf '%s\t%s\n' "$p" "$(doc_of "$p")" >> "$owners"
  done

  fig_out=$(node -e '
    const fs = require("fs"), path = require("path");
    const owners = new Map(
      fs.readFileSync(process.argv[1], "utf8").split("\n").filter(Boolean)
        .map((l) => l.split("\t"))
    );
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true })
      .flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
    const RE = /([0-9]+(?:\.[0-9]+)?)\s*:\s*1(?![0-9])/g;

    // CODE IS NOT A CONTRAST CLAIM, and `N : 1` inside it is not a figure. Four
    // ternaries and one destructuring line in the plugin tree read as figures to
    // a bare regex and were reported as fabricated ratios:
    //
    //   `travel(t) = round( t <= 60 ? t/60 : 1 + (t-60)/40 )`   → "60:1"
    //   `.scaleEffect(pressed ? 0.97 : 1.0)`                    → "0.97:1"
    //   `(shape === "pressed" ? 0.6 : 1)`                       → "0.6:1"
    //   `at0: 1, at100: 5`                                      → "0:1"
    //
    // So the PLUGIN side — the side whose extraction decides what gets
    // adjudicated, and where a false positive is a false failure — drops fenced
    // blocks and inline code spans before matching.
    //
    // The DOC side is deliberately NOT stripped, and the asymmetry is the point.
    // That side is a POOL OF SOURCES: a figure missing from it is a false
    // failure, and the docs do state real figures inside fences — doc 07 line
    // 285 argues the `#848077` composite at 3.66:1 inside a fenced walk-through,
    // and brutalism-ui restates that figure in four files. Stripping there broke
    // all four. Being permissive on the source side costs only sensitivity: the
    // pool carries about a dozen values that are not figures at all (300, 400
    // and 500 out of font-weights, 0.97 out of a scale() call, some alphas), and
    // any of them could "source" a plugin figure no doc actually claimed. That
    // is a real hole, it is smaller than the false failures the symmetric
    // version caused, and it is recorded in the ungated list in the header.
    const codeless = (txt) => {
      let out = "", fence = false;
      for (const line of txt.split("\n")) {
        if (/^\s*```/.test(line)) { fence = !fence; continue; }
        if (!fence) out += line.replace(/`[^`]*`/g, " ") + "\n";
      }
      return out;
    };
    const rawFigs = (txt) => { const out = []; let m; RE.lastIndex = 0; while ((m = RE.exec(txt))) out.push(m[1]); return out; };
    const figs = (txt) => rawFigs(codeless(txt));
    const dp = (s) => (s.split(".")[1] || "").length;

    const docFigs = {}; const all = [];
    for (const f of fs.readdirSync("docs").filter((x) => x.endsWith(".md"))) {
      docFigs["docs/" + f] = rawFigs(fs.readFileSync("docs/" + f, "utf8"));
      all.push(...docFigs["docs/" + f]);
    }
    if (!all.length) { console.log("NODOCFIGS\t\t\t"); process.exit(0); }

    let adjudicated = 0;
    for (const f of walk("plugins").filter((x) => x.endsWith(".md"))) {
      const plug = f.split(path.sep)[1];
      const doc = owners.get(plug);
      if (doc === undefined) { console.log("NOOWNER\t" + f + "\t\t"); continue; }
      const pool = doc === "-" ? all : docFigs[doc];
      const label = doc === "-" ? "the doc set" : doc;
      if (!pool) { console.log("NODOCFILE\t" + f + "\t" + doc + "\t"); continue; }
      const seen = new Set();
      for (const F of figs(fs.readFileSync(f, "utf8"))) {
        if (seen.has(F)) continue;
        seen.add(F);
        adjudicated++;
        const ok = pool.some((G) => dp(G) <= dp(F) && Number(Number(F).toFixed(dp(G))) === Number(G));
        if (!ok) console.log("UNSOURCED\t" + f + "\t" + F + "\t" + label);
      }
    }
    console.log("COUNT\t" + adjudicated + "\t\t");
  ' "$owners" 2>&1)

  if [ $? -ne 0 ]; then
    echo "  SCANFAIL the figure scan itself failed"
    indent "$fig_out"
    fail=1; fig_ok=0
  else
    while IFS=$'\t' read -r kind f fig label; do
      case "${kind:-}" in
        UNSOURCED)
          printf '  UNSOURCED %s prints %s:1, which %s does not state at any precision\n' "$f" "$fig" "$label"
          fail=1; fig_ok=0 ;;
        NOOWNER)
          printf '  NOOWNER  %s belongs to a plugin with no doc_of() entry — its figures were NOT traced\n' "$f"
          fail=1; fig_ok=0 ;;
        NODOCFILE)
          printf '  NODOCFILE %s: owning doc %s is not on disk — its figures were NOT traced\n' "$f" "$fig"
          fail=1; fig_ok=0 ;;
        NODOCFIGS)
          echo "  NODOCFIGS not one N:1 figure was extracted from docs/ — the scan is broken, and an ok"
          echo "            here would certify plugin figures against an empty corpus."
          fail=1; fig_ok=0 ;;
      esac
    done < <(printf '%s\n' "$fig_out")

    n_fig=$(printf '%s\n' "$fig_out" | awk -F'\t' '$1 == "COUNT" { print $2; exit }')
    printf '  %s distinct contrast figure(s) traced to the docs\n' "${n_fig:-0}"
    if [ "${n_fig:-0}" -lt "$FIGURE_BASELINE" ]; then
      printf '  UNTESTED only %s figure(s) reached the provenance test, against a committed baseline of %s\n' \
        "${n_fig:-0}" "$FIGURE_BASELINE"
      echo "  ^ rewording every N:1 in the tree takes this check to zero findings and zero work."
      echo "    Fix the extraction, or re-measure and lower FIGURE_BASELINE in a reviewed diff."
      fail=1; fig_ok=0
    elif [ "${n_fig:-0}" -gt "$FIGURE_BASELINE" ]; then
      printf '  ratchet  %s figure(s) traced, above the committed baseline %s — raise FIGURE_BASELINE\n' \
        "${n_fig:-0}" "$FIGURE_BASELINE"
    fi
  fi
fi
[ "$fig_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------------ 12. .claude-plugin contents --
# docs/MARKETPLACE.md §2, constraints 1 and 2: marketplace.json must be at
# <repo-root>/.claude-plugin/ and nothing else goes there; plugin.json must be at
# <plugin-root>/.claude-plugin/ and every other directory — skills/, commands/,
# agents/, hooks/, scripts/ — lives at the plugin root instead. A skills/
# directory that lands inside .claude-plugin/ is not discovered and the plugin
# loads with no components and no error.
echo "==> checking nothing but the manifest sits in any .claude-plugin/"
cp_ok=1
cp_dirs=()
while IFS= read -r cd_; do cp_dirs+=("$cd_"); done \
  < <(find . -name .git -prune -o -type d -name '.claude-plugin' -print 2>/dev/null \
      | sed 's|^\./||' | sort)

if [ "${#cp_dirs[@]}" -eq 0 ]; then
  echo "  NOCPDIRS no .claude-plugin/ directory was found anywhere — nothing was checked."
  fail=1; cp_ok=0
fi
for c in "${cp_dirs[@]}"; do
  case "$c" in
    .claude-plugin) want='marketplace.json' ;;
    *)              want='plugin.json'      ;;
  esac
  if [ ! -f "$c/$want" ]; then
    printf '  NOMANIFEST %s/ has no %s\n' "$c" "$want"
    fail=1; cp_ok=0
  fi
  while IFS= read -r e; do
    [ -n "$e" ] || continue
    b=$(basename "$e")
    [ "$b" = "$want" ] && continue
    printf '  STRAY    %s — only %s belongs in %s/\n' "$e" "$want" "$c"
    fail=1; cp_ok=0
    # `! -path "$c"` rather than -mindepth 1: same effect, and POSIX.
  done < <(find "$c" ! -path "$c" 2>/dev/null | sed 's|^\./||' | sort)
done
[ "$cp_ok" -eq 1 ] && echo "  ok"

# -------------------------------------------- 13. one contrast implementation --
# The architecture's central claim, from docs/MARKETPLACE.md §7.3 and README:
# "the contrast function is the single most-repeated piece of logic across all
# ten specs and the single easiest to get subtly wrong. One implementation, ten
# callers." Nothing enforced it. Ten copies of the sRGB transfer function is a
# correctness surface, and the way it goes wrong is silent — a second copy that
# rounds, or that averages luminances instead of compositing per channel, gives
# plausible numbers that are simply not WCAG's.
#
# Two signatures, adjudicated differently, and the difference is the whole reason
# this check needs no suppression list:
#
#   * ARITHMETIC — 0.2126, 0.7152, 0.0722, 0.04045, 12.92, 1.055, ** 2.4. These
#     are the maths itself. EXACTLY ONE file in the tree may carry any of them.
#     Zero is a failure too: if nothing matches, the scan is broken and an `ok`
#     here would certify a claim it never tested.
#   * API NAMES — relativeLuminance, contrastRatio. A caller has to say these
#     words; audit-css.mjs imports them, the test file exercises them, the README
#     and SKILL.md document them. A suppression list of "files allowed to say
#     contrastRatio" would be exactly the anti-pattern check-links.sh refuses,
#     and it would grow one entry every time someone added a second
#     implementation. So the exemption is STRUCTURAL: a file may name the API iff
#     it also names `contrast.mjs` — that is, iff it points at the one
#     implementation, as an import, a documented command line, or a citation. A
#     file that names the maths without naming where the maths lives is a
#     suspected second implementation and fails. Nothing can satisfy this by
#     being on a list; it is satisfied by actually deferring to the one file.
#
# Both are absolute outside plugins/ui-morphism-core/: a style plugin has no
# business computing or naming a contrast ratio at all.
echo "==> checking the contrast maths lives in exactly one file"
math_ok=1
ARITH='0\.2126|0\.7152|0\.0722|0\.04045|12\.92|1\.055|\*\*[[:space:]]*2\.4'
APINAME='relativeLuminance|contrastRatio'

arith_files=''
api_files=''
while IFS= read -r f; do
  [ -n "$f" ] || continue
  if grep -q -E -- "$ARITH" "$f" 2>/dev/null; then
    arith_files="${arith_files}${f}
"
  fi
  if grep -q -E -- "$APINAME" "$f" 2>/dev/null; then
    api_files="${api_files}${f}
"
  fi
done < <(find plugins -type f 2>/dev/null | sort)

n_arith=$(printf '%s' "$arith_files" | grep -c .)
if [ "$n_arith" -eq 0 ]; then
  echo "  NOMATHS  not one file in plugins/ carries the WCAG transfer-function constants."
  echo "  ^ the scan found nothing to adjudicate, so an ok here would certify nothing."
  echo "    Either the implementation moved out of plugins/, or this scan is broken."
  fail=1; math_ok=0
elif [ "$n_arith" -gt 1 ]; then
  printf '  DUPMATHS %s files carry the contrast/luminance arithmetic; exactly one may:\n' "$n_arith"
  printf '%s' "$arith_files" | sed 's/^/    /'
  fail=1; math_ok=0
else
  impl=$(printf '%s' "$arith_files" | sed 's/[[:space:]]*$//')
  case "$impl" in
    "$CORE"/*) printf '  the one implementation: %s\n' "$impl" ;;
    *) printf '  OUTSIDE  the contrast arithmetic lives in %s, outside %s/\n' "$impl" "$CORE"
       fail=1; math_ok=0 ;;
  esac
fi

while IFS= read -r f; do
  [ -n "$f" ] || continue
  case "$f" in
    "$CORE"/*) ;;
    *) printf '  OUTSIDE  %s names the contrast API; only %s/ may\n' "$f" "$CORE"
       fail=1; math_ok=0; continue ;;
  esac
  # Inside core, the arithmetic file is the definition. Every other file naming
  # the API must point at it.
  [ "$f" = "${impl:-}" ] && continue
  if ! grep -q -F -- 'contrast.mjs' "$f"; then
    printf '  UNSOURCED %s names the contrast API without naming contrast.mjs — a caller cites the one implementation; a second implementation does not\n' "$f"
    fail=1; math_ok=0
  fi
done < <(printf '%s' "$api_files")

[ "$math_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------------------ 14. the dry-run mode ---
# Every `apply` skill offers `--dry-run`, and offers the SAME one.
#
# This is the only promise in the set that a user acts on before reading any
# output: they add a flag because they were told the project will not be
# touched. Ten skills each describing that promise in their own words is how one
# of them ends up writing a report file anyway, or omitting the scratch path, or
# quietly skipping validation because nothing was going to land. So the section
# is normative shared text and this compares it byte for byte across the ten.
#
# Three separate things are asserted, because two of them can hold while the
# third is broken: the flag is in `argument-hint`, where a user discovers it;
# `dryRun` is in the Inputs table, which is the skill's normative input list;
# and the `## Dry run` section is present and identical. A flag advertised in
# the hint with no section behind it is worse than no flag.
#
# `audit` skills are deliberately out of scope. They hold no Write grant, so
# they are dry by construction and a mode switch would imply otherwise.
#
# What this cannot catch: the ten are compared against each other, and the
# reference is whichever file sorts first, not an external spec. An edit applied
# uniformly to all ten passes. That is the correct trade — the failure this
# guards against is drift, and there is no second source to check the text
# against — but it means a green here says "consistent", never "right".
echo "==> checking every apply skill offers the same --dry-run contract"
dry_ok=1
dry_checked=0
dry_ref=''
dry_ref_file=''

while IFS= read -r f; do
  [ -n "$f" ] || continue
  dry_checked=$((dry_checked + 1))

  # Anchored to the argument-hint LINE. A whole-file grep for --dry-run passes
  # on the section below, which names the flag a dozen times, so it would
  # certify the hint without ever reading it — caught by mutation, not review.
  grep -q -E '^argument-hint:.*--dry-run' "$f" || {
    printf '  NOHINT   %s: argument-hint does not offer --dry-run\n' "$f"
    fail=1; dry_ok=0
  }
  grep -q -F -- '`dryRun`' "$f" || {
    printf '  NOINPUT  %s: the Inputs table has no dryRun row\n' "$f"
    fail=1; dry_ok=0
  }

  body=$(awk '/^## Dry run$/ { s = 1 } s && /^## / && !/^## Dry run$/ { exit } s' "$f")
  if [ -z "$body" ]; then
    printf '  NOSECTION %s: no ## Dry run section\n' "$f"
    fail=1; dry_ok=0; continue
  fi

  if [ -z "$dry_ref" ]; then
    dry_ref=$body; dry_ref_file=$f; continue
  fi
  if [ "$body" != "$dry_ref" ]; then
    printf '  DIFFERS  %s: its ## Dry run section is not the one in %s\n' "$f" "$dry_ref_file"
    printf '%s\n' "$(diff <(printf '%s\n' "$dry_ref") <(printf '%s\n' "$body") | sed 's/^/    /')"
    fail=1; dry_ok=0
  fi
done < <(find plugins -path '*/skills/apply/SKILL.md' 2>/dev/null | sort)

if [ "$dry_checked" -eq 0 ]; then
  echo "  NOAPPLY  the scan found no apply skill to check."
  echo "  ^ zero skills adjudicated is a FAILURE, not a clean run."
  fail=1; dry_ok=0
else
  printf '  %s apply skill(s) compared against %s\n' "$dry_checked" "${dry_ref_file:-<none>}"
fi
[ "$dry_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------- 15. the shared report contract ---
# The seven report sections and the nine universal checklist rows are the same
# in every report from every style, and they are written down in five places:
# core's assets/report-template.md, core's a11y-validate/SKILL.md,
# docs/MARKETPLACE.md §7.3, the §3 Checklist item of all twenty style skills,
# and — the only one that runs — audit-css.mjs's exported CHECKS array. That
# last file cites §7.3 by name as the source of its ORDER, which is exactly the
# kind of citation that goes stale unread; it is graded here for that reason,
# even though it lives outside plugins/.
#
# CHECKS is therefore the authority here, not the prose. A report row the tool
# never emits is a promise to a user that nothing fulfils, and a check the tool
# runs that no report has a row for is a result nobody reads. This compares
# every prose copy against the array.
#
# Anti-vacuity, three ways, because a check this shape is easy to get wrong:
#   * The pattern map's keys must EQUAL CHECKS. Add a tenth check to
#     audit-css.mjs and this fails until the gate knows how to recognise it —
#     rather than quietly certifying nine of ten.
#   * The nine are matched inside the extracted §3 Checklist item ONLY, never
#     against the whole file. "forced colors" and "reduced motion" appear in
#     every one of these skills as procedure steps and guard blocks, so a
#     file-wide grep would pass on a skill whose report lists neither.
#   * Section names come from the template's own headings, so the expected list
#     is read rather than restated. Zero skills adjudicated, an empty section
#     list, or an unreadable template each fail loudly.
#
# Whitespace is collapsed before matching: these are wrapped markdown lines, and
# "non-text\n   contrast (1.4.11)" is the same row as the unwrapped one.
echo "==> checking the report contract against audit-css.mjs's CHECKS"
rep_ok=1
if [ "$have_node" -eq 0 ]; then
  echo "  NOTRUN   node is unavailable — NO report contract was compared."
  fail=1; rep_ok=0
else
  rep_out=$(node --input-type=module -e '
    import fs from "node:fs";
    import path from "node:path";
    const CORE = process.argv[1];
    const { CHECKS } = await import(
      path.resolve(CORE, "skills/a11y-validate/scripts/audit-css.mjs"));

    // One pattern per check id. Specific enough that a row for a DIFFERENT
    // check cannot satisfy it: every one is anchored on the SC number where
    // the criterion has one, and on the two-word name where it does not.
    const PATTERNS = {
      "text-contrast":         /(?:^|[^-])\btext contrast \(1\.4\.3\)/i,
      "non-text-contrast":     /\bnon-text contrast \(1\.4\.11\)/i,
      "focus":                 /\bfocus\b[^|(]{0,20}\(2\.4\.7/i,
      "target-size":           /\btarget size \(2\.5\.8\)/i,
      "forced-colors":         /\bforced colors\b/i,
      "reduced-motion":        /\breduced motion\b/i,
      "reduced-transparency":  /\breduced transparency\b/i,
      "colour-only":           /\bcolou?r-only\b[^|(]{0,20}\(1\.4\.1\)/i,
      "dom-order":             /\bDOM order \(1\.3\.2\)/i,
    };

    const out = [];
    let bad = 0;
    const flat = (s) => s.replace(/\s+/g, " ");

    const known = Object.keys(PATTERNS);
    if (JSON.stringify(known) !== JSON.stringify(CHECKS)) {
      out.push("  DRIFT    audit-css.mjs exports [" + CHECKS.join(", ") + "]");
      out.push("           this gate knows how to recognise [" + known.join(", ") + "]");
      out.push("  ^ the check set moved and the gate did not. Nothing below is trustworthy.");
      process.stdout.write(out.join("\n") + "\n");
      process.exit(1);
    }

    const tplPath = path.join(CORE, "assets/report-template.md");
    const tpl = fs.readFileSync(tplPath, "utf8");
    const sections = [...tpl.matchAll(/^## (\d)\. (.+)$/gm)].map((m) => m[2]);
    if (sections.length === 0) {
      out.push("  NOSECTIONS " + tplPath + " states no numbered report sections");
      process.stdout.write(out.join("\n") + "\n");
      process.exit(1);
    }

    // The universal rows of a `Check | ... ` table: header, separator, then data.
    const rowsOf = (block) =>
      block.split("\n").filter((l) => l.startsWith("| ")).slice(1)
        .map((l) => flat(l.split("|")[1].trim()));

    const gradeRows = (label, rows) => {
      if (rows.length !== CHECKS.length) {
        out.push("  ROWCOUNT " + label + ": " + rows.length +
                 " universal row(s), CHECKS has " + CHECKS.length);
        bad++; return;
      }
      CHECKS.forEach((c, i) => {
        if (!PATTERNS[c].test(rows[i])) {
          out.push("  ROWORDER " + label + ": row " + (i + 1) + " is `" + rows[i] +
                   "`, expected the one for `" + c + "`");
          bad++;
        }
      });
    };

    gradeRows(tplPath, rowsOf(
      tpl.split(/^### Universal[^\n]*$/m)[1].split(/^###/m)[0]));

    // docs/MARKETPLACE.md §7.3 is the fifth copy, and audit-css.mjs cites it by
    // name as the source of the array ORDER. A citation nothing checks is how
    // the cited text and the citing code drift apart, so it is graded here even
    // though it lives outside plugins/.
    const mkPath = "docs/MARKETPLACE.md";
    if (!fs.existsSync(mkPath)) {
      out.push("  NOPLAN   " + mkPath + " is missing — the check set order it is cited for went uncompared");
      bad++;
    } else {
      const mk = fs.readFileSync(mkPath, "utf8");
      const mkBlock = mk.split(/^### 7\.3 [^\n]*$/m)[1];
      if (mkBlock === undefined) {
        out.push("  NO73     " + mkPath + " has no §7.3 heading");
        bad++;
      } else {
        gradeRows(mkPath + " §7.3", rowsOf(mkBlock.split(/^### /m)[0]));
      }
    }

    const avPath = path.join(CORE, "skills/a11y-validate/SKILL.md");
    const av = fs.readFileSync(avPath, "utf8");
    const avBlock = av.split(/^## The nine universal checks$/m)[1];
    if (avBlock === undefined) {
      out.push("  NOTABLE  " + avPath + " has no `## The nine universal checks` section");
      bad++;
    } else {
      gradeRows(avPath, rowsOf(avBlock.split(/^## /m)[0]));
    }

    let seen = 0;
    const plugins = fs.readdirSync(path.dirname(CORE)).sort();
    for (const p of plugins) {
      if (p === path.basename(CORE)) continue;
      for (const s of ["apply", "audit"]) {
        const f = path.join(path.dirname(CORE), p, "skills", s, "SKILL.md");
        if (!fs.existsSync(f)) continue;
        seen++;
        const src = fs.readFileSync(f, "utf8");
        const m = src.match(
          /^## (?:The report shape|What goes in the report|What the report contains)$([\s\S]*?)(?=^## )/m);
        if (!m) {
          out.push("  NOREPORT " + f + ": no report-shape section");
          bad++; continue;
        }
        const items = [...m[1].matchAll(/^(\d)\. \*\*([^*]+)\*\*/gm)].map((x) => x[2]);
        if (items.join("|") !== sections.join("|")) {
          out.push("  SECTIONS " + f + ": " + (items.join("|") || "<none>"));
          out.push("           template says: " + sections.join("|"));
          bad++;
        }
        // Item 3 runs to the next numbered item, or to the end of the section
        // if it is last. A lazy match with `$` in the lookahead would stop at
        // the first line ending under /m and grade an empty string, which is a
        // green run over nothing — the one outcome this file never allows.
        const item3 = m[1].match(/^3\. \*\*[^*]+\*\*([\s\S]*)/m);
        if (!item3) {
          out.push("  NOITEM3  " + f + ": no section 3 to carry the universal rows");
          bad++; continue;
        }
        const rest = item3[1].split(/^\d\. \*\*/m)[0];
        if (rest.trim() === "") {
          out.push("  EMPTY3   " + f + ": section 3 has no body to compare");
          bad++; continue;
        }
        const body = flat(rest);
        const missing = CHECKS.filter((c) => !PATTERNS[c].test(body));
        if (missing.length) {
          out.push("  MISSING  " + f + ": its §3 names no row for " + missing.join(", "));
          bad++;
        }
      }
    }

    if (seen === 0) {
      out.push("  NOSKILLS the scan found no style skill to compare.");
      out.push("  ^ zero skills adjudicated is a FAILURE, not a clean run.");
      bad++;
    } else {
      out.push("  " + seen + " style skill(s) compared against " + CHECKS.length +
               " CHECKS and " + sections.length + " template section(s)");
    }
    process.stdout.write(out.join("\n") + "\n");
    process.exit(bad ? 1 : 0);
  ' "$CORE" 2>&1)
  rep_rc=$?
  printf '%s\n' "$rep_out"
  if [ "$rep_rc" -ne 0 ]; then fail=1; rep_ok=0; fi
fi
[ "$rep_ok" -eq 1 ] && echo "  ok"

if [ "$fail" -ne 0 ]; then
  echo
  echo "FAILED — see above."
  exit 1
fi
echo
echo "All plugin checks passed."
