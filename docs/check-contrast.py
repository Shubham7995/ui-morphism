#!/usr/bin/env python3
"""Numeric CI check for the ui-morphism doc set: recompute every contrast figure.

check-links.sh validates the *structure* of these docs. Nothing validated the
*numbers*, in a set whose README advertises measured contrast ratios. This does.

  1. every `N:1` / `N.N:1` / `N.NN:1` / `N.NNN:1` contrast claim is recomputed
     from the colours named beside it, and must agree within half a rounding
     step
  2. every stated relative luminance (`L 0.7512`, `L = 0.9416`, `L ≈ 0.0217`,
     or a bare `0.7512` cell in a luminance table) is recomputed from its hex
  3. where a line states two luminances *and* a ratio, the ratio must follow
     from those two luminances — a row can be wrong three independent ways
     (bad L, bad L, and a ratio that matches neither) and only (3) sees all of it
  4. no claim may be rounded in the direction that makes it clear a WCAG
     threshold. W3C: values are not rounded up, so 2.999:1 fails 3:1.
  5. the number of claims each file yields may not fall below a committed
     baseline, so a future regression in the extraction regex cannot shrink
     what is checked without failing the run
  6. the number of claims each file VERIFIES may not fall below a committed
     floor, and the number it EXCLUDES may not rise above a committed
     ceiling, so a regression in ADJUDICATION cannot move the corpus out of
     the maths and into a non-failing bucket without failing the run

The maths is WCAG 2.x, exactly:

    s = c / 255
    lin = s / 12.92                    if s <= 0.04045
        = ((s + 0.055) / 1.055) ** 2.4 otherwise
    L = 0.2126*linR + 0.7152*linG + 0.0722*linB
    ratio = (Lmax + 0.05) / (Lmin + 0.05)

TOLERANCE IS THE CLAIM'S OWN PRECISION, NOT A FIXED SLACK

A figure is checked against half a rounding step at the precision it was
written at: 0.0005 for `4.497:1`, 0.005 for `15.46:1`, 0.055 for `7.8:1` (1dp
keeps a hair of slack for the last-digit ambiguity a single decimal really
has), 0.5 for `21:1`.
A flat 0.055 applied to a 2dp figure is eleven times looser than the figure
claims to be, and lets `7.85` stand where the maths says `7.81`. Most of this
set is written at 2dp, so the flat bar was the default case, not the edge.

Because the bar now matches the precision, "inside tolerance but not what
rounding to its own precision gives" is a FAILURE (NEARMISS), not a note. At
2dp and 0dp the class is empty by construction; at 1dp it is exactly the
0.05–0.055 sliver, which is a wrong last digit and nothing else.

A STATED LUMINANCE IS HELD TO THE SAME RULE. It used to be a flat 0.0005,
justified as "stated luminances are given to 4dp"; doc 10 writes them to five
throughout, so the bar was fifty times looser than the printed figure claims
to be and `0.15760` could be written `0.15799` without a word. The bar is now
half a step at the digits actually written — plus, and never instead of, the
luminance range the OWNER's own printed precision allows. An α-composite
printed `rgb(117.5, 118.7, 122.2)` has a luminance range, not a value, and
tightening the claim's half-step without widening for the operand's would
convict correct lines in exactly the place the tightening was aimed.

A REPORTED VALUE IS TRUNCATED, NEVER ROUNDED. A failure line may not print a
figure the pair does not have: `round(2.99534, 2)` is `3.0`, so the message
saying a `3:1` claim fails used to say the maths gives 3.0.

WHICH FIGURES ARE CHECKED, AND HOW A CLAIM FINDS ITS COLOURS

Scope widens one step at a time and the first match wins, so the tightest
reading that explains a figure is the one recorded:

    clause -> line, markdown row, or enclosing <tr> -> that row plus its header

A clause is a sentence, a table cell, or anything either side of a semicolon or
an em dash. That split is what lets "AA 4.5:1 / 3:1 large." share a line with
"`#FFFFFF` on `#FFB3A7` is 1.71:1" without the requirements being measured
against the hexes. Colours come from opaque hexes (3-, 6-, and 4-/8-digit whose
alpha channel is full), from opaque `rgb()`/`hsl()` values in either the legacy
comma syntax or the modern space-and-slash one, from `white`/`black` written as
words, and — only where a scope cannot otherwise name two colours — from
resolving a `--token` the scope references against that doc's own declarations.

A row unit is a markdown pipe row OR an HTML `<tr>…</tr>`, which may span many
lines: a `<td>` naming two hexes and a `<td>` on the next line stating the
ratio are one row and are checked as one, exactly as the pipe form is.

A parenthetical aside is a clause of its own, and the sentence around it stays
one clause across the gap. "**4.68:1** against `#F5F6FA` (4.60:1 with the
`#16181E` fill)" makes two statements about two different composites; read as
one clause, the aside borrows the outer pair and a correct line convicts.

A figure CONVICTS only where its own unit really does name both operands: the
clause in prose, the row in a table. Prose that names one colour and describes
the other ("never `#000` on a dark surface: ~1.6:1") is reported as INFO, not
as a failure, because widening to the rest of the line only invents a pair the
sentence never meant.

AN OPERAND IS KNOWN ONLY AS PRECISELY AS IT WAS WRITTEN

The same principle as the claim tolerance, applied to the other side of the
comparison. A channel written `110.5` is a rounded value, so the colour is the
real one to within ±0.05 and the ratio inherits that; a value the doc marks
`≈` is stated to be rounded to the nearest step. Doc 10 prints an α-composite
as `rgb(109.3, 110.5, 114.3)` where the arithmetic gives (109.3, 110.54,
114.26), and doc 03 writes "Composite ≈ `#28282E`" for (40.28, 40.28, 46.44):
recomputing from the printed digits alone and holding the result to 0.005
convicts three correct lines. An integer channel or a plain hex is exact and
gets no slack whatsoever, so this buys a false figure nothing.

WHAT IS EXCLUDED, AND WHY (all counted and printed, none of them fail the run)

  composited     an ALPHA-BEARING COLOUR VALUE is in scope, so the effective
                 colour depends on a backdrop this checker cannot see.
                 Recognised by parsing colour values, never by vocabulary:
                 an `rgb()`/`rgba()`/`hsl()`/`hsla()` whose alpha resolves to
                 strictly between 0 and 1 (or to something unresolvable such
                 as `var(--x)` or `α`), a 4- or 8-digit hex whose alpha nibble
                 is neither full nor zero, or a `color-mix()` against
                 `transparent`. Alpha 0 and alpha 1 are NOT compositing —
                 `rgba(0,0,0,0)` changes no pixel and suppresses nothing.
                 Excluded BEFORE matching is attempted: run the matcher first
                 and a stray pair on the same line will "confirm" a figure it
                 has nothing to do with.
                 This is a structural test on values, not a word list. The
                 previous revision of this file excluded any clause containing
                 the letters "over", "alpha", "composite" or "backdrop", which
                 meant a false figure could be hidden by writing one ordinary
                 English word beside it — the same defect check-links.sh's
                 check 4 shipped with. Removing it put ~110 alpha claims under
                 the maths for the first time.
  citation       the figure states a requirement rather than a measurement.
                 A requirement has nothing to be measured against, and that
                 is the test: a canonical WCAG value (3, 4.5, 7, 2.999) is a
                 citation ONLY WHERE NO OPERAND PAIR IS IN SCOPE — no clause
                 naming two colours, and, in a table, no row naming two. The
                 other form is relational notation (`≥`, `>=`, `<`) in front
                 of the figure, which states a bound and names nothing to
                 recompute, whatever else is on the line.
                 The value alone used to be enough, and that made a third of
                 the set unfalsifiable in the one place conformance is being
                 asserted: `| #0071e3 | #f5f5f7 | 7:1 |` for a pair measuring
                 4.31 exited 0, and so did `3.00:1` for 2.9953. Two colours
                 plus a figure is a measurement no matter which figure it is,
                 and the ROUNDUP check — which exists for exactly the values
                 3, 4.5 and 7 — could not fire on a single claim while the
                 value-only exemption stood.
                 THE BUCKET IS PRINTED AS THREE NUMBERS, NOT ONE. It used to
                 print as "bare WCAG thresholds with no colour operands", and
                 that label was false for nine of its members and hid the one
                 shape of the old exemption that survives. The split is:
                   * citations with NO operand pair in scope — nothing to
                     recompute, the honest majority;
                   * relational bounds (`≥ 8:1`) that DO have a pair in scope
                     — a bound still states no measurement, so this is a
                     separate and defensible line rather than a blind spot;
                   * canonical WCAG values that DO have a pair in scope and
                     are exempted anyway because the cell is not bare. THIS
                     IS THE REMAINING BLIND SPOT, it is exempt from MISMATCH,
                     NEARMISS and ROUNDUP at once, and every one of its
                     members is printed by file:line so it can be eyeballed
                     rather than trusted. Seven today, all genuine.
  no operands    no colour in scope at all, in a scope that could convict.
                 A table row naming two colours is never in this bucket, even
                 when the figure cell carries other words: the row is the
                 unit, and the unit names the pair.
  one operand    one colour in scope; no pair to compute.
  structural     inside a STRIKETHROUGH span — the one way a doc can mark a
                 figure as deliberately wrong. This is the ONLY
                 author-controlled suppression and it is structural on purpose.
                 An earlier check in this set was defeated by a keyword list,
                 because the words a doc uses to flag a bad value are the words
                 a real offence carries in its own comment. To have a figure
                 ignored here, mark it up; writing "incorrect" beside it does
                 nothing.
                 A BLOCKQUOTE USED TO SUPPRESS TOO, AND IT WAS FAR TOO CHEAP.
                 Structural is necessary but not sufficient: the marker also
                 has to be one nobody reaches for by accident. Nobody writes
                 `~~4.5:1~~` without meaning "this figure is wrong"; `> 4.5:1`
                 is ordinary markdown — a callout, a pull quote, an admonition,
                 a quoted paragraph of spec. A false figure moved into a
                 routine callout exited 0 with nothing changing anywhere in the
                 output but one INFO count. Strikethrough is kept because it is
                 unambiguous. `>` is dropped because it is not, and a
                 suppression marker that costs one character of ordinary
                 formatting is a keyword list wearing punctuation.
                 A suppressed claim is still COUNTED — it lands in the claims
                 denominator and in the printed "suppressed by structure"
                 total. A claim that vanishes silently is indistinguishable
                 from one that was never written, which is exactly what a
                 figure hidden behind a marker relies on.

KNOWN BLIND SPOTS, stated so nobody reads a green run as more than it is:

  * a wrong figure landing on exactly 3, 4.5, 7 or 2.999 *and* written where
    the cell is not a bare measurement — the only remaining shape of the
    citation exemption. It is no longer merely stated here: the members are
    counted and printed by file:line in their own INFO line, because a blind
    spot nobody can enumerate is a blind spot nobody audits;
  * a claim written to seven or more decimals: CLAIM_RE reads up to six, and
    the deepest figure in the set is three. The fraction used to stop at
    three, which put every 4dp figure in this bullet — and unlike a shrink,
    an ADDED figure the regex cannot see leaves no trace at all: check 5 is a
    floor, so injecting `9.9987:1` for a pair measuring 4.3134 produced
    output byte-identical to the clean run. Widening to six costs nothing
    (`tolerance_for` already handles arbitrary dp, and no figure in the set
    changes bucket) and closes the reachable part of the hole;
  * a wrong figure inside a claim that really does carry an alpha value;
  * a stated luminance with no colour literal to its left inside its own
    clause: doc 08 §7 writes "C = 130.80 → L ≈ 0.2262" for a composite it
    never prints as a colour, so there is nothing to recompute it from. 15 of
    them, counted and printed rather than dropped;
  * operands named in words the docs never bind to a hex ("lime 16.63:1");
  * operands written in a colour space this file does not convert (`oklch()`,
    `oklab()`, `lab()`, `color()`) — read as no operands, not as wrong;
  * the OPPOSITE of a blind spot and the one false-positive shape left: a
    clause that describes a composite in words while naming two opaque
    colours ("3.72:1 for dark glass under `#F5F6FA` over white") is
    recomputed from the two it names and convicts. The figure may be right
    about a surface the sentence never writes down. The fix is in the doc —
    print the composite, as doc 10 §8 does everywhere else — not in a word
    list here, because "glass", "under" and "over" are the same words a real
    offence carries in its own comment.

The INFO counts are the size of each.

A GREEN RUN MUST MEAN SOMETHING WAS READ

Every check above compares a number to a number, so every one of them passes
vacuously over an empty set. Rewording each `N:1` in the doc set to "N to 1"
took the run to zero claims and it still printed "All contrast figures agree
with the WCAG maths" and exited 0; so did pointing it at a directory holding
no markdown. Both now fail, and so does any file whose claim count drops
below its committed CLAIM_BASELINE — the ratchet that makes a regression in
the extraction regex visible, since a figure the regex stops matching is the
one kind of defect that leaves no other trace.

AND A GREEN RUN MUST MEAN SOMETHING WAS ADJUDICATED

CLAIM_BASELINE guards the DENOMINATOR and nothing guarded the NUMERATOR, which
left the whole corpus one line away from being green and unread. Inserting
`return True` as the first statement of `alpha_bearing()` gave 576 claims, 0
verified, 576 excluded, "All contrast figures agree with the WCAG maths",
exit 0 — CLAIM_BASELINE cannot fire, because extraction was never touched. The
plausible version of that edit is not sabotage but caution: writing
`composite_scope = clause if alpha_bearing(clause) else wide` reads like "be
safer about alpha" and quietly moves a figure out of adjudication for good.
Every exclusion bucket in this file is non-failing by design, so any of them
widening is a silent win for the run.

So VERIFIED_BASELINE is a per-file FLOOR on the numerator, in the same shape
and with the same ratchet semantics as CLAIM_BASELINE: below it fails, a file
with no committed number fails, above it prints an advisory to raise it.

IT IS PAIRED WITH EXCLUDED_CEILING, AND THAT IS NOT THE SAME FACT TWICE.

The obvious objection is that verified and excluded are two views of one
number, so flooring one already ceilings the other. They would be, if the
claims total were fixed and there were two buckets. There are three —

    claims = verified + excluded + convicted (MISMATCH / NEARMISS)

— and the total is not fixed, so the floor and the ceiling see different
regressions:

  * a widened exclusion that swallows a VERIFIED claim moves verified down.
    The floor catches it; the ceiling also would.
  * a widened exclusion that swallows a CONVICTED claim leaves verified
    untouched and turns a red run green. The floor cannot see it — verified
    is still exactly at baseline — and the ceiling is the only thing in this
    file that can. This is precisely the shape an author reaches for when a
    figure they just wrote fails: not "delete the check", but "surely this
    one is composited / a citation / not really a measurement".
  * a doc gaining new figures raises claims. The floor stays satisfied
    whatever those figures do; only the ceiling asks what happened to them.

The ceiling's cost is that adding an unverifiable figure — one more "AA
requires 4.5:1" in prose — fails the run until the number is raised in a
reviewed diff. That is the feature, not the toll. The unverifiable buckets are
where every defect this file has ever had went to hide; growth in them is
exactly the event that should need a human to sign it. The ceiling falls, like
the floor rises, only by advisory.

Neither replaces the other and neither is a coverage guarantee. Together they
say: this file adjudicated at least as much of this doc as it did the day
these numbers were committed, and excused no more of it.

Exits non-zero once, after printing every offence in every category.

Usage:  ./check-contrast.py [--json] [--verbose] [file.md ...]

  --json     machine-readable findings and summary, for a skill to consume
  --verbose  list every excluded figure, not just the counts

Pure standard library. Runs under `env -i PATH=/usr/bin:/bin python3`.
"""

import json
import math
import os
import re
import sys

# A claim is checked at half a rounding step of ITS OWN precision. A flat bar
# is only ever right for one precision, and applying 1dp's slack to the 2dp
# figures that make up most of this set made the check eleven times looser than
# the numbers it was reading: 7.85 passed where the maths says 7.81.
# 1dp keeps 0.055 rather than 0.05 — a single decimal genuinely carries
# last-digit ambiguity, and 0.05 exactly is the boundary, not inside it.
TOLERANCE_1DP = 0.055


def tolerance_for(dp):
    """Half a rounding step at `dp` decimal places."""
    if dp == 1:
        return TOLERANCE_1DP
    return max(0.5 * 10.0 ** -dp, 1e-12)


def shown(value, dp):
    """`value` at `dp` decimals, TRUNCATED toward zero — never rounded up.

    A failure message must not itself read as clearing the bar it is reporting
    a miss against. `round()` at two decimals prints 4.4999 as `4.50` and
    2.9953 as `3.00`, so the MISMATCH line for a claim of `4.5:1` said
    "computed 4.50:1" and the ROUNDUP line said "is 3.00:1 — under the 3:1
    bar". Truncation cannot say that: every digit printed is a digit the value
    really has, and a value below a bar prints below it.
    """
    q = 10.0 ** dp
    return math.floor(value * q) / q

# The canonical WCAG figures. A claim whose value is exactly one of these MAY
# be a CITATION of a requirement rather than a measurement — "AA requires
# 4.5:1", "the 3:1 floor", "2.999:1 fails". Across this set they appear 160+
# times, constantly on lines that also carry hexes ("rejects any accent below
# 4.5:1 against `#0A0A0A`").
#
# Membership is NOT sufficient on its own, and treating it as sufficient was
# the largest hole this file has had. A third of every claim in the set — 188
# of 570 — was exempt from MISMATCH, NEARMISS and ROUNDUP simultaneously, at
# every precision the value can be written at (3, 3.0, 3.00, 4.5, 4.50, 7,
# 7.00). The exemption was strongest exactly where a doc asserts conformance:
# a table row `| #0071e3 | #f5f5f7 | 7:1 |` whose pair measures 4.3134 passed,
# and so did `3.00:1` for 2.9953. ROUNDUP, written for these three values,
# could not fire on a single claim in the set.
#
# The real distinction is structural, not numeric: "AA requires 4.5:1" names
# nothing to measure, while "`#xxx` on `#yyy` — 4.5:1" names two colours and
# is therefore a measurement. So the value only exempts where NO OPERAND PAIR
# IS IN SCOPE (see `citation` in check_file). 2.999 is in this set because the
# docs cite it five times as the canonical round-up failure; until CLAIM_RE
# was widened to three decimals it was unreachable dead weight, because no
# three-decimal figure could be extracted at all.
WCAG_THRESHOLDS = {3.0, 4.5, 7.0, 2.999}

# Thresholds a measured claim must not be rounded up through.
ROUNDUP_BARS = (3.0, 4.5, 7.0)

# COMMITTED CLAIM-EXTRACTION BASELINE — how many `N:1` figures each file
# yields. This is a RATCHET, in the same shape and for the same reason as
# check-links.sh's §4 row-coverage ratchet: a file may not yield FEWER claims
# than the number recorded here, a file with no recorded number FAILS, and a
# file that rises prints an advisory asking for the number to be raised. The
# baseline only ever moves up, and only in a reviewed diff.
#
# It exists because of how the three-decimal hole failed. A claim CLAIM_RE
# cannot match does not fail, does not report, and does not reach any INFO
# bucket — it leaves the denominator, and the only evidence is a total that is
# one smaller than it was. Every other check in this file compares a number to
# a number; this one is the only defence against the checker quietly reading
# less of the set than it used to, which is the failure mode that produces a
# green run over unread text. Injecting `19.999:1` for a pair measuring 15.46
# used to move exactly one number in the whole output, and nobody reads a
# total for a decrement.
#
# Not a coverage guarantee. It says "no file yields fewer figures than it did
# when this was measured", never "every figure in this file is checked" — the
# INFO buckets are where that question is answered, and they are large.
CLAIM_BASELINE = {
    '00-comparison-matrix.md': 31,
    '01-skeuomorphism.md': 45,
    '02-neumorphism.md': 85,
    '03-glassmorphism.md': 28,
    '04-claymorphism.md': 56,
    '05-minimalism.md': 47,
    '06-maximalism.md': 97,
    '07-brutalism.md': 50,
    '08-liquid-glass.md': 22,
    '09-bento-grid.md': 35,
    '10-spatial-ui.md': 41,
    'GLOSSARY.md': 9,
    'MARKETPLACE.md': 18,
    'README.md': 12,
}

# COMMITTED ADJUDICATION BASELINE — how many of those claims each file
# actually puts through the WCAG maths and agrees with (the FLOOR), and how
# many it excuses into a non-failing bucket (the CEILING). Same shape as
# CLAIM_BASELINE, same ratchet discipline, and measured the same way: from a
# clean run, never by hand.
#
# CLAIM_BASELINE guards the denominator. Nothing guarded the numerator, and
# that is a whole class of defect rather than one bug. Putting `return True`
# at the top of `alpha_bearing()` produced 576 claims, 0 verified, 576
# excluded, "All contrast figures agree with the WCAG maths", exit 0: not one
# number in the coverage section moved, because extraction was untouched. The
# realistic form of the same edit is a caution, not a sabotage —
# `composite_scope = clause if alpha_bearing(clause) else wide` — and it takes
# a single figure out of adjudication for good.
#
# The two halves are not one fact written twice. claims = verified + excluded
# + convicted, and the total moves, so:
#   * an exclusion that swallows a VERIFIED claim drops the numerator — the
#     floor fires;
#   * an exclusion that swallows a CONVICTED claim leaves the numerator
#     exactly at baseline and turns a red run green — only the ceiling fires;
#   * new figures in a doc raise claims, and only the ceiling asks whether
#     they were adjudicated or excused.
#
# The ceiling means a new unverifiable figure fails the run until the number
# is raised in review. That is deliberate. Every hole this file has had lived
# in the non-failing buckets, so those buckets growing is the event most worth
# a human's signature. Floors only rise and ceilings only fall by advisory,
# and only in a reviewed diff.
#
# A file that verifies nothing today records 0 rather than being left out: an
# absent entry FAILS (there is no such thing as an unmeasured file), and a 0
# floor still pairs with a real ceiling, which is what actually holds
# 08-liquid-glass.md, MARKETPLACE.md and README.md in place.
VERIFIED_BASELINE = {
    '00-comparison-matrix.md': 8,
    '01-skeuomorphism.md': 13,
    '02-neumorphism.md': 17,
    '03-glassmorphism.md': 2,
    '04-claymorphism.md': 32,
    '05-minimalism.md': 23,
    '06-maximalism.md': 21,
    '07-brutalism.md': 26,
    '08-liquid-glass.md': 0,
    '09-bento-grid.md': 7,
    '10-spatial-ui.md': 7,
    'GLOSSARY.md': 1,
    'MARKETPLACE.md': 0,
    'README.md': 0,
}

# excluded = claims - verified - MISMATCH - NEARMISS, per file, exactly as the
# summary line computes it for the whole run.
EXCLUDED_CEILING = {
    '00-comparison-matrix.md': 23,
    '01-skeuomorphism.md': 32,
    '02-neumorphism.md': 68,
    '03-glassmorphism.md': 26,
    '04-claymorphism.md': 24,
    '05-minimalism.md': 24,
    '06-maximalism.md': 76,
    '07-brutalism.md': 24,
    '08-liquid-glass.md': 22,
    '09-bento-grid.md': 28,
    '10-spatial-ui.md': 34,
    'GLOSSARY.md': 8,
    'MARKETPLACE.md': 18,
    'README.md': 12,
}

# ------------------------------------------------------------------ maths ---


def _linear(channel):
    s = channel / 255.0
    return s / 12.92 if s <= 0.04045 else ((s + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = rgb
    return 0.2126 * _linear(r) + 0.7152 * _linear(g) + 0.0722 * _linear(b)


def contrast(rgb_a, rgb_b):
    la, lb = luminance(rgb_a), luminance(rgb_b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def ratio_from_luminances(la, lb):
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


# ------------------------------------------------------------- extraction ---

# 3- and 6-digit hex are opaque colours. 4- and 8-digit carry an alpha channel:
# full alpha (`#RGBF`, `#RRGGBBFF`) is an opaque colour, zero alpha paints
# nothing, and anything between the two is a composite marker. 5- and 7-digit
# are not colours at all. The lookbehind keeps `&#9733;` (an HTML entity) and
# `issue#1142` from being read as colours.
HEX_RE = re.compile(r'(?<![&\w])#([0-9A-Fa-f]{3,8})\b')

# A contrast claim. Guarded on both sides so `1.4.11` and `0.868 dp` cannot
# produce one, and so `21:10` is not read as `21:1`.
#
# THE FRACTION MUST REACH THREE DIGITS. At `{1,2}` a figure like `4.497:1`
# matched NOTHING: the leading-digit alternative fails on the trailing `7`,
# and every later start position is blocked by the lookbehind (`.497` is
# preceded by `.`, `497` by `4`). The claim did not fail, did not report, did
# not even reach the INFO buckets — it left the denominator entirely, and the
# only trace was the claims total dropping by one. ELEVEN such claims are in
# the set and they are the safety-critical ones: doc 10's own round-up-trap
# worked examples (10:1179, 10:1183 at 4.497:1, 10:1196 at 4.495:1, and
# plus README's own restatement of the first, in its check-10 entry — a line
# number is deliberately not given there, because README is edited often and a
# stale pointer is worse than none), 05:1176's 2.995:1, and the six `2.999:1`
# citations at 01:832, 01:1039, 07:936, GLOSSARY:173, MARKETPLACE:429 and
# MARKETPLACE:525 that state the rule this file's check 4 enforces.
# `tolerance_for(3)` already returned 0.0005; nothing but the regex was in
# the way.
#
# AND IT NOW REACHES SIX, because three had the same hole one digit further
# out and the ratchet cannot see that direction. CLAIM_BASELINE is a FLOOR: it
# fires on a figure that stops being extracted, and says nothing about a
# figure that never was. Adding a table row claiming `9.9987:1` for a pair
# measuring 4.3134 produced output byte-for-byte identical to the clean run
# and exited 0 — no bucket moved, no count moved, nothing to read. Six digits
# is not a guess at how deep a doc might go; it is the point past which the
# figure is no longer plausibly a contrast ratio. `tolerance_for` already
# handles arbitrary dp (0.5e-6 at 6dp, floored at 1e-12), `decimals()` reads
# whatever is written, and the set contains nothing deeper than three — so
# widening moved not one figure between buckets and cost nothing at all.
CLAIM_RE = re.compile(r'(?<![\d.])(\d{1,3}(?:\.\d{1,6})?):1(?![\d:])')

# `L 0.7512`, `L = 0.7512`, `L: 0.7512`, `L ≈ 0.0217`, `L ~ 0.0217`. Capital L
# only — lowercase `l` is a unit, a list marker and a variable name all over
# these docs. The approx forms are not decoration: docs 03 and 08 write six
# luminances that way and every one of them was invisible while the separator
# class was `[=:]` plus whitespace.
L_LABELLED_RE = re.compile(r'\bL[₁₂₀-₉]?\s*(?:[=:]|≈|~)?\s*(0\.\d{3,6})\b')

# A custom-property name, for resolving `8.87:1 with --clay-ink`.
TOKEN_RE = re.compile(r'--[A-Za-z0-9_-]+')

# Named colours resolved as operands. Deliberately tiny: these two are the only
# ones the set writes as words instead of hex ("15.6:1 with black text"), and
# resolving a CSS named colour is colour parsing, not a suppression list.
# A hyphen does NOT end the word here: `off-white` is not white and
# `near-black` is not black — they are prose for "a colour near that one", and
# reading them as the pure value invents a 21:1 pair out of a sentence that
# names no colour at all (doc 06's do/don't table says exactly that). The same
# guard keeps the CSS property `white-space` from being a colour.
NAMED_COLOURS = {'white': (255, 255, 255), 'black': (0, 0, 0)}
NAMED_RE = re.compile(r'(?<![\w-])(white|black)(?![\w-])', re.IGNORECASE)

# Colour functions. Opaque ones are operands; partially transparent ones are
# what makes a claim composited. Both facts come from PARSING the value.
COLOUR_FN_RE = re.compile(
    r'(?<![\w-])(rgba?|hsla?|hwb|oklch|oklab|lab|lch|color-mix|color)\(',
    re.IGNORECASE)

# Colour spaces this file does not convert to sRGB. They are opaque unless
# their alpha slot says otherwise, so they never suppress; they simply do not
# become operands, and the figure lands in "no colour operands in scope".
UNCONVERTED_FNS = {'oklch', 'oklab', 'lab', 'lch', 'color', 'hwb'}

# Clause boundaries. A line is not the unit of meaning — a sentence or a table
# cell is. Splitting here is what lets "AA 4.5:1 / 3:1 large." coexist on one
# line with "`#FFFFFF` on `#FFB3A7` is 1.71:1" without the thresholds being
# checked against the hexes. Boundaries: table pipe, semicolon, em/en dash, and
# a sentence end (optionally through closing markup) followed by a capital.
CLAUSE_RE = re.compile(r'[.!?][`*_)\]]*\s+(?=[A-Z(\[`*"])|[;|]|—|–')

# Residue test for a "bare" clause: a table cell holding nothing but the figure.
# `| **7.85:1** |` and `1.76:1 ` (after an em-dash split) are measurements bound
# to their row. `pass 1.4.11 (3:1) as a focus ring` is not.
ALNUM_RE = re.compile(r'[0-9A-Za-z]')

# Relational notation immediately in front of a figure ("≥ 3:1", ">= 8:1",
# "≤ 1.5:1") states a BOUND, not a measurement, so there is nothing to
# recompute. This is notation, not vocabulary — no words are matched.
# An ASCII `<`/`>` only reads as a relation when it is not closing an HTML tag:
# `<td>9.50:1</td>` ends in `>` and would otherwise make every figure in an
# HTML table a "bound" and exempt from conviction.
BOUND_RE = re.compile(r'(?:[≥≤]=?|(?<![\w/"\'])[<>]=?)\s*[`*_]{0,2}\s*$')


def hex_alpha(text):
    """Alpha of a hex string as 0..1, or None when the form carries no alpha."""
    if len(text) == 4:
        return int(text[3], 16) / 15.0
    if len(text) == 8:
        return int(text[6:8], 16) / 255.0
    return None


def parse_hex(text):
    """(r, g, b) for an OPAQUE hex, else None.

    Opaque means 3- or 6-digit, or 4-/8-digit whose alpha channel is full.
    A partially transparent hex has no single colour to return; a fully
    transparent one has no colour at all. 5- and 7-digit are not colours.
    """
    a = hex_alpha(text)
    if a is not None:
        if a < 1.0:
            return None
        text = text[:3] if len(text) == 4 else text[:6]
    if len(text) == 3:
        return tuple(int(c * 2, 16) for c in text)
    if len(text) == 6:
        return tuple(int(text[i:i + 2], 16) for i in (0, 2, 4))
    return None


def _balanced(text, open_paren):
    """Text inside the parens opening at `open_paren`, and the index after."""
    depth = 0
    for i in range(open_paren, len(text)):
        if text[i] == '(':
            depth += 1
        elif text[i] == ')':
            depth -= 1
            if depth == 0:
                return text[open_paren + 1:i], i + 1
    return None, len(text)


def colour_calls(text):
    """(name, args, start, end) for every balanced colour function call."""
    out = []
    pos = 0
    while True:
        m = COLOUR_FN_RE.search(text, pos)
        if not m:
            return out
        args, after = _balanced(text, m.end() - 1)
        if args is None:
            return out
        out.append((m.group(1).lower(), args, m.start(), after))
        pos = after


NUM_RE = re.compile(r'^[+-]?(?:\d+\.?\d*|\.\d+)(%?)$')


def _number(token):
    """A CSS number or percentage as a float, or None if it is not one."""
    t = token.strip().strip('`*_ ')
    if not NUM_RE.match(t):
        return None
    if t.endswith('%'):
        return float(t[:-1]) / 100.0
    return float(t)


def _split_args(args):
    """(components, alpha_token) for both CSS argument syntaxes.

    Modern: `rgb(12 14 22 / 0.18)` — components then a slash then alpha.
    Legacy: `rgba(12, 14, 22, 0.18)` — four commas-separated values.
    `alpha_token` is None when the value states no alpha at all.
    """
    if '/' in args:
        head, _, tail = args.partition('/')
        return re.split(r'[\s,]+', head.strip()), tail.strip()
    parts = [p.strip() for p in args.split(',')]
    if len(parts) == 1:
        parts = re.split(r'[\s]+', args.strip())
    if len(parts) == 4:
        return parts[:3], parts[3]
    return parts, None


def call_alpha(name, args):
    """Alpha of a colour call: a float, None for "opaque/unstated", or
    'unknown' when the slot is filled with something unresolvable."""
    if name == 'color-mix':
        # A mix against `transparent` is a partially transparent result. Any
        # other mix of opaque colours is opaque.
        return 0.5 if re.search(r'(?<![\w-])transparent(?![\w-])', args,
                                re.IGNORECASE) else None
    _, alpha = _split_args(args)
    if alpha is None or alpha == '':
        return None
    value = _number(alpha)
    if value is None:
        # `var(--x)`, `${shade}`, `α` — an alpha slot is filled with something
        # this file cannot resolve, so it must be assumed to composite.
        return 'unknown'
    return value


def _hsl_to_rgb(h, s, l):
    h = (h % 360.0) / 60.0
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs(h % 2 - 1))
    m = l - c / 2
    r, g, b = ((c, x, 0), (x, c, 0), (0, c, x),
               (0, x, c), (x, 0, c), (c, 0, x))[int(h) % 6]
    return tuple(round((v + m) * 255, 4) for v in (r, g, b))


def call_slack(name, args):
    """How far a colour call's channels may be from the value meant.

    A channel written `110.5` is a value rounded to one decimal, so the colour
    it prints is the real one to within ±0.05 — and the ratio computed from it
    inherits that. Doc 10 §8 prints an α-composite as `rgb(109.3, 110.5,
    114.3)` when the arithmetic gives (109.3, 110.54, 114.26); holding its
    stated 4.68:1 against the printed channels alone convicts a correct line
    by 0.0017. Integer channels are exact and get no slack at all.
    """
    comps, _ = _split_args(args)
    worst = 0.0
    for c in comps[:3]:
        t = c.strip().strip('`*_ ')
        pct = t.endswith('%')
        t = t[:-1] if pct else t
        if '.' not in t:
            continue
        half = 0.5 * 10.0 ** -len(t.split('.')[1])
        worst = max(worst, half * (2.55 if pct else 1.0))
    # An hsl() channel maps through a conversion, so a decimal anywhere in it
    # is worth about a whole 8-bit step by the time it reaches sRGB.
    if name.startswith('hsl') and worst:
        worst = max(worst, 0.5)
    return worst


def call_rgb(name, args):
    """(r, g, b) for an OPAQUE, convertible colour call, else None."""
    if name in UNCONVERTED_FNS or name == 'color-mix':
        return None
    comps, _ = _split_args(args)
    values = [_number(c) for c in comps[:3]]
    if len(values) < 3 or any(v is None for v in values):
        return None
    if name.startswith('hsl'):
        raw = [c.strip() for c in comps[:3]]
        if not raw[1].endswith('%') or not raw[2].endswith('%'):
            return None
        return _hsl_to_rgb(values[0], values[1], values[2])
    scaled = [v * 255.0 if c.strip().endswith('%') else v
              for v, c in zip(values, comps[:3])]
    if any(v < 0 or v > 255 for v in scaled):
        return None
    return tuple(scaled)


def alpha_bearing(text):
    """True when `text` names a colour value that is PARTLY transparent.

    Structural, not lexical. Alpha exactly 0 paints nothing and alpha exactly
    1 is opaque; only a value strictly between the two makes the effective
    colour depend on a backdrop this checker cannot see. That is why appending
    an inert `rgba(0,0,0,0)` — or the word "alpha", or "over", or "composite",
    which this function never reads — cannot take a figure out of the check.
    """
    for name, args, _, _ in colour_calls(text):
        a = call_alpha(name, args)
        if a == 'unknown':
            return True
        if isinstance(a, float) and 0.0 < a < 1.0:
            return True
    for m in HEX_RE.finditer(text):
        a = hex_alpha(m.group(1))
        if a is not None and 0.0 < a < 1.0:
            return True
    return False


# An operand the doc itself marks as approximate. `≈`/`~` in front of a colour
# says "this is the value rounded", and the docs use it exactly that way:
# doc 03 writes "Composite ≈ `#28282E`" for a composite whose real channels are
# (40.28, 40.28, 46.44). Holding the ratio to the printed hex convicts a
# correct line by 0.06. Notation, not vocabulary — no words are read.
APPROX_RE = re.compile(r'(?:≈|(?<!~)~(?!~))\s*[`*_]{0,2}\s*$')


def colour_literals(text):
    """(position, label, rgb, slack) for every opaque colour LITERAL, in order.

    Literals only — hexes and colour functions. `white` and `black` written as
    words are operands (see `colour_operands`) but never literals, because a
    stated luminance binds to the literal on its left and "over a white panel
    (`L = 0.76322`)" would otherwise bind 0.76322 to pure white.

    `slack` is how far each channel may be from the value meant, given how the
    value was written: 0 for an exact hex or integer channel, half a printed
    step for a decimal channel, a whole step for an `≈`-marked value.
    """
    out = []
    for m in HEX_RE.finditer(text):
        rgb = parse_hex(m.group(1))
        if rgb is not None:
            out.append((m.start(), '#' + m.group(1), rgb, 0.0))
    for name, args, start, _ in colour_calls(text):
        if call_alpha(name, args) not in (None, 1.0):
            continue
        rgb = call_rgb(name, args)
        if rgb is not None:
            out.append((start, '%s(%s)' % (name, re.sub(r'\s+', ' ',
                                                        args.strip())),
                        rgb, call_slack(name, args)))
    out = [(pos, label, rgb,
            max(slack, 0.5) if APPROX_RE.search(text[:pos]) else slack)
           for pos, label, rgb, slack in out]
    out.sort()
    return out


def colour_operands(text):
    """Every opaque colour in `text`, as (label, rgb, slack), de-duplicated."""
    found = []
    seen = set()
    for _, label, rgb, slack in colour_literals(text):
        if rgb not in seen:
            seen.add(rgb)
            found.append((label, rgb, slack))
    for m in NAMED_RE.finditer(text):
        rgb = NAMED_COLOURS[m.group(1).lower()]
        if rgb not in seen:
            seen.add(rgb)
            found.append((m.group(1).lower(), rgb, 0.0))
    return found


def aside_spans(line):
    """(open, close) of every parenthesised aside — not a function call.

    A parenthetical is a clause in exactly the sense a semicolon-delimited
    phrase is, and doc 10 §8 needs it to be: "**4.68:1** against `#F5F6FA`
    (4.60:1 with the `#16181E` fill)" states one figure about the composite the
    sentence names and a second about a composite it does not. Read as one
    clause the aside borrows the outer pair and convicts a correct line.
    A `(` glued to an identifier opens `rgb(`, `var(`, `hsl(` — a value, not
    an aside — and is left alone.
    """
    out = []
    depth = 0
    start = None
    for i, ch in enumerate(line):
        if ch == '(':
            if depth == 0:
                glued = i > 0 and (line[i - 1].isalnum() or line[i - 1] in '_-')
                start = None if glued else i
            depth += 1
        elif ch == ')' and depth:
            depth -= 1
            if depth == 0 and start is not None and i > start + 1:
                out.append((start, i))
                start = None
    return out


def clause_spans(line):
    """(start, end) of every clause in `line`, in order."""
    spans = []
    pos = 0
    for m in CLAUSE_RE.finditer(line):
        if m.end() > pos:
            spans.append((pos, m.start()))
        pos = m.end()
    spans.append((pos, len(line)))
    return [(a, b) for a, b in spans if b > a] or [(0, len(line))]


def clause_at(line, index):
    """(text, spans) of the clause holding `index`, with asides lifted out."""
    asides = aside_spans(line)
    for oa, ob in asides:
        if not oa < index <= ob:
            continue
        # An aside is a clause, and it splits like one: GLOSSARY writes
        # "(`rgba(0,0,0,0.06)` on `#f5f5f7` = 1.15:1; `#E5E5E5` on white =
        # 1.26:1)" — one composited figure and one computable one, separated
        # by the semicolon that separates any other pair of clauses.
        inner = line[oa + 1:ob]
        for a, b in clause_spans(inner):
            if a <= index - oa - 1 < b:
                return inner[a:b], [(oa + 1 + a, oa + 1 + b)]
        return inner, [(oa + 1, ob)]
    for a, b in clause_spans(line):
        if not a <= index < b:
            continue
        spans, cursor = [], a
        for oa, ob in asides:
            if a <= oa < b:
                if oa > cursor:
                    spans.append((cursor, oa))
                cursor = ob + 1
        if b > cursor:
            spans.append((cursor, b))
        return ''.join(line[x:y] for x, y in spans), spans
    return line, [(0, len(line))]


def is_bare(clause, claim_text):
    """True when the clause is nothing but the figure — a table measurement."""
    residue = clause.replace(claim_text, '', 1)
    # `<td>` and `<code>` are markup around the measurement in exactly the way
    # backticks and asterisks are, and an HTML cell holding nothing but the
    # figure is as bare as `| **7.85:1** |`.
    residue = re.sub(r'<[^<>]*>', '', residue)
    residue = re.sub(r'[`*_~\s()\[\]|>=≥≤≈~–—.,:/-]', '', residue)
    return not ALNUM_RE.search(residue)


def table_row(line):
    stripped = line.strip()
    return stripped.startswith('|') and not re.match(r'^\|[\s:|-]*$', stripped)


TD_OPEN_RE = re.compile(r'<t[dh]\b[^<>]*>', re.IGNORECASE)
TD_CLOSE_RE = re.compile(r'</t[dh]\s*>', re.IGNORECASE)


def cell_at(line, index):
    """(start, end) of the table CELL holding `index`; the whole line if none.

    A ROW is the unit that names the pair. A CELL is the unit that states the
    figure, and the two are not the same question. `| #fff | #000 | 15.49:1 |`
    is a data row whose last cell measures its first two; doc 00's comparison
    matrix is a table whose "cells" are multi-sentence paragraphs carrying
    figures about surfaces the row never writes down. Read as clauses the two
    shapes are indistinguishable, which is why the conviction rule below is
    written on the cell.
    """
    if table_row(line):
        pos = 0
        for part in line.split('|'):
            if pos <= index < pos + len(part):
                return pos, pos + len(part)
            pos += len(part) + 1
        return 0, len(line)
    opens = [m.end() for m in TD_OPEN_RE.finditer(line) if m.end() <= index]
    if opens:
        a = opens[-1]
        close = TD_CLOSE_RE.search(line, a)
        return a, close.start() if close and close.start() > index else len(line)
    return 0, len(line)


def html_rows(lines):
    """lineno -> text of the enclosing HTML `<tr>…</tr>`, and its header row.

    A `<tr>` is a row in exactly the sense a pipe row is, and it is routinely
    written across several lines: one `<td>` naming two hexes, the next `<td>`
    stating the ratio. Read line by line, that figure has no operands in scope
    and is never checked at all — a hole that reports itself as "no operands".
    Binding every line of a `<tr>` to the whole `<tr>` closes it.
    """
    row_for, header_for = {}, {}
    header = None
    i, n = 0, len(lines)
    while i < n:
        if re.search(r'</?table\b', lines[i], re.IGNORECASE):
            header = None
        if not re.search(r'<tr\b', lines[i], re.IGNORECASE):
            i += 1
            continue
        j = i
        while j < n - 1 and not re.search(r'</tr\s*>', lines[j], re.IGNORECASE):
            j += 1
        block = lines[i:j + 1]
        text = ' '.join(s.strip() for s in block)
        for k in range(i, j + 1):
            row_for[k + 1] = text
            if header is not None:
                header_for[k + 1] = header
        if header is None and any(re.search(r'<th\b', s, re.IGNORECASE)
                                  for s in block):
            header = text
        i = j + 1
    return row_for, header_for


# ------------------------------------------------------- token resolution ---


def token_map(text):
    """`--name` -> [rgb, ...] for every custom property assigned a literal hex.

    Only consulted when a claim's own unit names fewer than two colours (doc
    04's §4 table writes "8.87:1 with `--clay-ink`"). A token with a light and a
    dark value contributes both.
    """
    out = {}
    for m in re.finditer(r'(--[A-Za-z0-9_-]+)\s*:\s*(#[0-9A-Fa-f]{3,8})\b', text):
        rgb = parse_hex(m.group(2)[1:])
        if rgb is None:
            continue
        out.setdefault(m.group(1), [])
        if rgb not in out[m.group(1)]:
            out[m.group(1)].append(rgb)
    return out


DECLARED_HERE_RE = re.compile(r'(--[A-Za-z0-9_-]+)\s*:')


def resolved_operands(text, tokens):
    """Operands contributed by `--token` names *referenced* in `text`.

    A token declared on this very line is skipped: `--nm-shadow-dark: #17191f;
    /* 1.30:1 */` would otherwise resolve the name to the hex sitting next to
    it and "compute" a colour against itself, which is 1.00:1 and nonsense.

    A token with a light value and a dark value contributes both, tagged with
    the same source name so they can never be paired with each other.
    """
    declared = set(DECLARED_HERE_RE.findall(text))
    found = []
    seen = set()
    for m in TOKEN_RE.finditer(text):
        name = m.group(0)
        if name in declared or name in seen:
            continue
        seen.add(name)
        for rgb in tokens.get(name, ()):
            found.append((name, rgb, 0.0))
    return found


# ------------------------------------------------- structural suppressions ---
# The one exclusion that is not about colour: a line that deliberately prints a
# WRONG figure in order to correct it. Detected by STRUCTURE only — inside a
# strikethrough span, and nothing else. There is no keyword list here on
# purpose: an earlier check in this set was defeated by exactly that, because
# the words a doc uses to flag a bad value are the words a real offence carries
# in its own comment. If a doc wants a figure ignored it must mark it up.
#
# BLOCKQUOTE USED TO SUPPRESS AS WELL, AND IT WAS TOO CHEAP TO KEEP.
# "Structural, not lexical" is the right rule and it was not the whole rule:
# the marker also has to be one an author cannot reach by accident, because a
# suppression is a hole the doc is allowed to punch in its own check. `~~` and
# `>` are not comparable on that axis. Nobody writes `~~4.5:1~~` without
# meaning "this figure is wrong" — the span exists to strike a value out. A
# `>` line is ordinary markdown: a callout, an admonition, a pull quote, a
# quoted paragraph of the spec, a note block in every doc in this set. Moving
# a false figure into one exited 0 with nothing changing anywhere in the
# output but a single INFO count, which is the same defect as hiding it behind
# the word "over" with a different character.
#
# So the whole-line blockquote span is gone and strikethrough is the only
# suppression. The set has exactly one suppressed claim today —
# 00-comparison-matrix.md:41, the struck-through `~~3.13:1~~` — and it is
# unaffected; no line in the set is blockquoted AND carries a figure, so this
# moved nothing. The alternative was to keep blockquote and print file:line for
# every suppressed claim, so that a hole punched this way at least leaves a
# line in the output. That is strictly worse: it makes the run noisier in
# order to preserve a marker with no legitimate use here, when deleting the
# marker costs the doc set nothing.

STRIKE_RE = re.compile(r'~~.+?~~', re.DOTALL)


def suppressed_spans(line):
    spans = [(m.start(), m.end()) for m in STRIKE_RE.finditer(line)]
    return spans, 'strikethrough' if spans else None


# ------------------------------------------------------------- the checks ---


def best_pair(operands, target):
    """Closest computed pair to `target`, as (ratio, label_a, label_b).

    An operand may carry a third element: the per-channel slack its written
    precision allows. Where there is slack the pair does not compute a single
    ratio but a range, and the value reported is the one in that range closest
    to `target` — the fairest reading of a colour printed to finite precision,
    and identical to the old behaviour whenever the slack is zero.
    """
    best = None
    for i in range(len(operands)):
        for j in range(i + 1, len(operands)):
            la, ra = operands[i][0], operands[i][1]
            lb, rb = operands[j][0], operands[j][1]
            if la == lb:
                continue          # one token's light and dark value are not a pair
            sa = operands[i][2] if len(operands[i]) > 2 else 0.0
            sb = operands[j][2] if len(operands[j]) > 2 else 0.0
            r = contrast(ra, rb)
            if sa or sb:
                reach = []
                for s, rgb in ((sa, ra), (sb, rb)):
                    reach.append([luminance(tuple(min(255.0, max(0.0, c + d))
                                                  for c in rgb))
                                  for d in ((-s, s) if s else (0.0,))])
                spread = [ratio_from_luminances(x, y)
                          for x in reach[0] for y in reach[1]]
                r = min(max(target, min(spread)), max(spread))
            if best is None or abs(r - target) < abs(best[0] - target):
                best = (r, la, lb)
    return best


def decimals(claim_text):
    head = claim_text.split(':')[0]
    return len(head.split('.')[1]) if '.' in head else 0


def check_file(path, findings, stats):
    name = os.path.basename(path)
    with open(path, encoding='utf-8') as fh:
        text = fh.read()
    lines = text.splitlines()
    tokens = token_map(text)

    # Header scope. A markdown table can put the two grounds in the header and
    # the accent in the body row — doc 06's dark ramp is exactly that shape:
    #
    #   | Accent | Value | On `--max-paper` `#0B0A0F` | On `--max-ink` `#FFF8E7` |
    #   | `--max-lime` | `#C6FF00` | **16.63:1** | 1.12:1 |
    #
    # Neither figure is computable from its own row. `header_for[lineno]` is the
    # header row of the table each body row belongs to.
    header_for = {}
    i = 0
    while i < len(lines):
        if table_row(lines[i]) and i + 1 < len(lines) \
                and re.match(r'^\s*\|[\s:|-]*$', lines[i + 1]):
            head = lines[i]
            j = i + 2
            while j < len(lines) and table_row(lines[j]):
                header_for[j + 1] = head
                j += 1
            i = j
        else:
            i += 1

    # The same thing for HTML tables, whose rows routinely span several lines.
    tr_for, tr_header_for = html_rows(lines)
    header_for.update(tr_header_for)

    for n, line in enumerate(lines, 1):
        strike, strike_kind = suppressed_spans(line)
        row = table_row(line) or n in tr_for
        unit = tr_for.get(n, line)
        unit_ops = colour_operands(unit)
        unit_tier = 'unit'
        if len({op[0] for op in unit_ops}) < 2:
            # A resolved token that lands on a colour the line already prints is
            # the same colour under two names — doc 06's ramp rows write both
            # `--max-lime` and `#C6FF00`. Keeping it would make the row look
            # self-sufficient and compute a 1.00:1 pair against itself.
            literal = {op[1] for op in unit_ops}
            unit_ops = unit_ops + [op for op in resolved_operands(unit, tokens)
                                   if op[1] not in literal]
            unit_tier = 'unit+tokens'
        # The widest scope: the row plus its table header. Tried last, and only
        # for table rows, so a header's grounds can never leak into prose.
        wide_ops, wide = unit_ops, unit
        if n in header_for:
            head = header_for[n]
            literal = {op[1] for op in unit_ops}
            wide_ops = unit_ops + [op for op in colour_operands(head)
                                   if op[1] not in literal]
            wide = unit + ' ' + head

        # doc 01's token table is `| Line | --sk-border | LIGHT | DARK | note |`
        # — two hex literals that are one token in light mode and in dark mode.
        # Nothing is ever painted with one on the other, so pairing them
        # invents a ratio the row never claimed. `best_pair` already refuses to
        # pair a token's two values; relabelling the literals with the token
        # that declares them is what lets it see that is what they are.
        # Only LITERALS are relabelled — an operand already carrying a token
        # name was resolved from one and is labelled correctly. And only where
        # the colour belongs to exactly one multi-valued token: doc 06 declares
        # `--max-ink` and `--max-paper` as the same two colours swapped between
        # modes, so "some token declares this hex" would fuse both operands
        # into one name and make a correct row unpairable.
        claimed = {}
        for tname in set(TOKEN_RE.findall(wide)):
            if len(tokens.get(tname, ())) > 1:
                for rgb in tokens[tname]:
                    claimed.setdefault(rgb, set()).add(tname)
        modes = {rgb: next(iter(names)) for rgb, names in claimed.items()
                 if len(names) == 1}
        if modes:
            def as_modes(ops):
                return [(modes.get(op[1], op[0]),) + tuple(op[1:])
                        if not op[0].startswith('--') else op for op in ops]
            unit_ops, wide_ops = as_modes(unit_ops), as_modes(wide_ops)

        # ---------------------------------------------- 2. stated luminance ---
        # (position, value, source, digits). `digits` is how many decimals the
        # doc actually wrote, and it is what sets the bar: a flat 0.0005 was
        # fifty times looser than doc 10's five-decimal luminances claim to be,
        # and let 0.15760 be written 0.15799 without a word. Same principle as
        # the ratio tolerance, and the same function computes it.
        stated = []
        for m in L_LABELLED_RE.finditer(line):
            stated.append((m.start(1), float(m.group(1)), 'labelled',
                           len(m.group(1).split('.')[1])))
        if row:
            # The bare-cell form is only ever written to four decimals in this
            # set. Reading three would sweep in every alpha value in a table.
            pos = 0
            for cell in line.split('|'):
                c = re.sub(r'[`*\s]', '', cell)
                if re.fullmatch(r'0\.\d{4}', c):
                    stated.append((pos, float(c), 'table cell', 4))
                pos += len(cell) + 1

        # A stated luminance belongs to the colour literal on its LEFT — the
        # one it was just computed from. There is deliberately no fallback to
        # a literal on the RIGHT: "→ `L = 0.15760` → 5.06:1 against `#F5F6FA`"
        # states the luminance of the composite named earlier in the sentence,
        # not of the ink it is then compared with, and reaching rightwards
        # reported three such lines in doc 10 as wrong when they are right.
        # With nothing to its left the figure is unbound, and says so.
        #
        # Left is not enough on its own: it must be left WITHIN THE SAME
        # CLAUSE. Doc 03 §9 writes "for a `rgb(10,10,15)` tint requires α ≥
        # 0.558; at 0.555 the composite is L = 0.1852" — the luminance is the
        # composite's, the composite is never written down, and the tint hex
        # across the semicolon is not its owner. In a table the cells are the
        # row's, so the row is the unit there, exactly as for a ratio.
        literals = colour_literals(line)

        for pos, value, source, digits in sorted(stated):
            if any(a <= pos < b for a, b in strike):
                stats['suppressed'] = stats.get('suppressed', 0) + 1
                continue
            _, own_spans = clause_at(line, pos)
            left = [h for h in literals
                    if h[0] < pos and any(a <= h[0] < b for a, b in own_spans)]
            if not left and row:
                left = [h for h in literals if h[0] < pos]
            owner = left[-1] if left else None
            if owner is None:
                stats['lum_unbound'] = stats.get('lum_unbound', 0) + 1
                continue
            actual = luminance(owner[2])
            # The owner is known only as precisely as it was written, exactly
            # as for a ratio operand: doc 10 prints an α-composite as
            # `rgb(117.5, 118.7, 122.2)`, so its luminance is a range, not a
            # point. Luminance is monotone in every channel, so the range is
            # bounded by the two corners. The claim's own half-step is added
            # to that range, never substituted for it — tightening the bar to
            # the printed precision without this would convict correct lines.
            slack = owner[3]
            lo = hi = actual
            if slack:
                lo = luminance(tuple(max(0.0, c - slack) for c in owner[2]))
                hi = luminance(tuple(min(255.0, c + slack) for c in owner[2]))
            tol = tolerance_for(digits)
            if value < lo - tol or value > hi + tol:
                findings.append({
                    'kind': 'LUMINANCE', 'file': name, 'line': n,
                    'stated': value, 'actual': shown(actual, digits + 1),
                    'nearest': shown(lo if value < lo else hi, digits + 1),
                    'dp': digits, 'colour': owner[1], 'source': source,
                    'text': line.strip()[:160],
                })
            else:
                stats['lum_verified'] = stats.get('lum_verified', 0) + 1

        # ----------------------------------------------------- 1. + 3. + 4. ---
        row_lum_values = [v for _, v, _, _ in sorted(stated)]

        for m in CLAIM_RE.finditer(line):
            claim_text = m.group(0)
            claim = float(m.group(1))
            # Counted BEFORE the suppression test, so a suppressed claim shows
            # up in the denominator and in the "suppressed by structure" total.
            # Counting after meant a marked-up line could delete a figure from
            # the run without leaving a trace: the totals were identical
            # whether the line existed or not, which is exactly what hiding a
            # false figure behind a marker relies on.
            stats['claims'] = stats.get('claims', 0) + 1
            by_file = stats.setdefault('claims_by_file', {})
            by_file[name] = by_file.get(name, 0) + 1
            if any(a <= m.start() < b for a, b in strike):
                stats['suppressed'] = stats.get('suppressed', 0) + 1
                stats.setdefault('suppressed_kinds', set()).add(strike_kind)
                continue

            tol = tolerance_for(decimals(claim_text))
            clause, clause_spans_here = clause_at(line, m.start())
            clause_ops = colour_operands(clause)
            bare = is_bare(clause, claim_text)

            # Can this figure be convicted at all — does its own unit name two
            # colours? Outside a table the unit is the clause; inside one the
            # row names the pair and a CELL states the figure, so the question
            # splits in two: does the row name a pair, and is this cell that
            # row's measurement of it?
            #
            # A cell is the row's measurement when it states exactly one figure
            # and names no colour of its own. That is what separates
            # `| #fff | #000 | 15.49:1 zz |` — where the junk is noise around
            # the row's one figure — from doc 00's comparison matrix, whose
            # cells are paragraphs naming their own colours and their own
            # several figures, and from doc 06's "(6.64:1 / 6.45:1)", two
            # figures against a cream ground the row never writes down. The
            # old gate was `is_bare` on the CLAUSE, and it broke on contact
            # with one extra word: `15.49:1 zz` and `x 15.49:1` both stopped
            # being bare, both scored zero clause operands, and both were
            # filed under "no operands" — the non-failing bucket — while the
            # row went on naming the pair in plain sight.
            ca, cb = cell_at(line, m.start())
            cell = line[ca:cb]
            cell_bare = is_bare(cell, claim_text)
            row_measurement = (len(CLAIM_RE.findall(cell)) == 1
                               and not colour_operands(cell))

            clause_pairable = len({op[0] for op in clause_ops}) >= 2
            wide_pairable = len({op[0] for op in wide_ops}) >= 2
            convicts = clause_pairable or (row and wide_pairable
                                           and row_measurement)

            # A citation is a figure that states a requirement rather than a
            # measurement, recognised two structural ways and no other:
            #   * relational notation (`≥`, `>=`, `<`) immediately in front of
            #     the figure, which states a bound and names nothing to
            #     recompute — true regardless of what else is on the line;
            #   * a canonical WCAG value (3, 4.5, 7, 2.999) that is NOT a bare
            #     measurement cell in a row naming two colours.
            #
            # The second clause used to be "the value is canonical", full
            # stop, and that alone made 188 of 570 claims — a third of the set
            # — exempt from MISMATCH, NEARMISS and ROUNDUP simultaneously, at
            # every precision the value can be written at (3, 3.0, 3.00, 4.5,
            # 4.50, 7, 7.00). It was strongest exactly where a doc asserts
            # conformance: `| #0071e3 | #f5f5f7 | 7:1 |` for a pair measuring
            # 4.3134 exited 0, `3.00:1` for 2.9953 exited 0, and ROUNDUP —
            # written for these three values and no others — could not fire on
            # a single claim in the set.
            #
            # A BARE CELL is the strictest structural evidence a doc set gives
            # that a figure is a measurement: the row names two colours and
            # the cell says nothing but the number. Prose is not enough, and
            # measurably so — "`#5B3AE0` against `#F4F1FB` is 6.02:1,
            # comfortably over the 3:1 requirement" and "rejects any accent
            # below 4.5:1 against `#0A0A0A`" both name a pair and both cite,
            # so a clause-level rule reports six correct lines in this set as
            # wrong. What survives as a blind spot is a canonical value
            # written in prose, or in a cell that says anything else; what
            # does not survive is a conformance table asserting 7:1 for 4.31.
            bounded = bool(BOUND_RE.search(line[:m.start()]))
            citation = (bounded
                        or (claim in WCAG_THRESHOLDS
                            and not (row and wide_pairable and cell_bare)))

            # Does an operand pair exist anywhere this figure could have been
            # measured against? Not the same question as `convicts`, which
            # additionally demands the cell be the row's measurement. This is
            # the weaker "were two colours in scope at all", and it is what
            # decides whether a citation is honestly unmeasurable or is a
            # canonical value sitting next to a pair with an exemption.
            pair_in_scope = clause_pairable or (row and wide_pairable)

            # 3. self-consistency: two stated luminances plus a ratio. Checked
            # independently of the colours, because a row can state operands
            # that are themselves wrong AND a ratio that does not follow from
            # them — two different lies that hide each other.
            #
            # Scoped to the claim's own clause, widening to the row only when
            # the clause holds fewer than two (a table states its luminances in
            # separate cells). Whole-line scope was wrong: doc 10 line 1160
            # states two INDEPENDENT composites, each with its own luminance
            # and its own ratio against an unstated white ground, and pairing
            # one measurement's L with the other's convicted four correct
            # figures on the strength of an arithmetic relation nobody claimed.
            lum_values = [v for p, v, _, _ in sorted(stated)
                          if any(a <= p < b for a, b in clause_spans_here)]
            if len(lum_values) < 2 and row:
                lum_values = row_lum_values
            if len(lum_values) >= 2:
                implied = [ratio_from_luminances(lum_values[i], lum_values[j])
                           for i in range(len(lum_values))
                           for j in range(i + 1, len(lum_values))]
                closest = min(implied, key=lambda r: abs(r - claim))
                if abs(closest - claim) > tol:
                    findings.append({
                        'kind': 'INCONSISTENT', 'file': name, 'line': n,
                        'claim': claim, 'implied': round(closest, 2),
                        'luminances': lum_values,
                        'text': line.strip()[:160],
                    })
                else:
                    stats['consistency_verified'] = stats.get('consistency_verified', 0) + 1

            # Composited-alpha claims are excluded BEFORE any matching is
            # attempted. Doing it the other way round lets a stray pair on the
            # line masquerade as a verification: GLOSSARY's hairline sentence
            # states 1.15:1 for `rgba(0,0,0,0.06)` over the tile, and #E5E5E5
            # on white is 1.16:1 — near enough to "confirm" a figure it has
            # nothing to do with. The effective colour of an alpha fill depends
            # on a backdrop this checker cannot see, so the honest answer is
            # "not verified", and that is what gets counted.
            #
            # `alpha_bearing` PARSES colour values. It reads no words at all,
            # so no figure can be lifted out of the check by writing one next
            # to it, and a value that composites nothing — `rgba(0,0,0,0)` —
            # lifts nothing either.
            composite_scope = clause if alpha_bearing(clause) else (
                wide if len(clause_ops) < 2 else '')
            if alpha_bearing(composite_scope or ''):
                stats['composited'] = stats.get('composited', 0) + 1
                stats.setdefault('composited_where', []).append('%s:%d' % (name, n))
                continue

            # 1. recompute, widening one scope at a time: the clause (tight),
            # then the whole line or row, then the row plus its table header.
            # First match wins, so the tightest scope that explains the figure
            # is the one recorded.
            match = None
            tier = None
            for ops, label in ((clause_ops, 'clause'), (unit_ops, unit_tier),
                               (wide_ops, 'row+header')):
                if len(ops) < 2:
                    continue
                b = best_pair(ops, claim)
                if b and abs(b[0] - claim) <= tol:
                    match, tier = b, label
                    break

            if match:
                tiers = stats.setdefault('tiers', {})
                tiers[tier] = tiers.get(tier, 0) + 1
                # Near miss: inside the claim's own tolerance, but still not
                # the digits rounding produces. Now that the bar IS the claim's
                # precision this is a failure, not a note — the class is empty
                # by construction at 2dp and 0dp, and at 1dp it is exactly the
                # 0.05–0.055 sliver, which is a wrong last digit and nothing
                # else. It was INFO only because a flat 0.055 bar made the
                # class large and mostly harmless; that bar is gone.
                dp = decimals(claim_text)
                if round(match[0], dp) != round(claim, dp):
                    stats['nearmiss'] = stats.get('nearmiss', 0) + 1
                    findings.append({
                        'kind': 'NEARMISS', 'file': name, 'line': n,
                        'claim': claim, 'dp': dp,
                        'actual': float('%.*f' % (dp, match[0])),
                        'pair': [match[1], match[2]],
                        'text': line.strip()[:160],
                    })
                else:
                    stats['verified'] = stats.get('verified', 0) + 1
                    # Per file, for the VERIFIED_BASELINE floor. The global
                    # total cannot carry that check: one file gaining a
                    # verified figure would paper over another losing one,
                    # which is the whole point of doing it per file in
                    # CLAIM_BASELINE too.
                    v_by_file = stats.setdefault('verified_by_file', {})
                    v_by_file[name] = v_by_file.get(name, 0) + 1
                # 4. never round in the direction that makes a claim pass.
                for t in ROUNDUP_BARS if not citation else ():
                    if claim >= t > match[0]:
                        rdp = max(2, decimals(claim_text) + 2)
                        findings.append({
                            'kind': 'ROUNDUP', 'file': name, 'line': n,
                            'claim': claim, 'actual': shown(match[0], rdp),
                            'dp': rdp,
                            'threshold': t, 'pair': [match[1], match[2]],
                            'text': line.strip()[:160],
                        })
                        break
                continue

            # Unverified, and not composited: classify why.
            #
            # The citation bucket is split three ways on the way in, because
            # printing it as one number labelled "bare WCAG thresholds with no
            # colour operands" was false for nine of its 174 members and hid
            # the last surviving shape of the value-only exemption. A
            # canonical 3 / 4.5 / 7 written in prose beside two hexes is
            # exempt from MISMATCH, NEARMISS and ROUNDUP simultaneously, and
            # that fact was invisible inside an aggregate whose label said the
            # operands were not there. Every member of that third bucket is
            # recorded by file:line and printed unconditionally: an
            # unenumerable blind spot is one nobody ever audits.
            if citation:
                stats['threshold'] = stats.get('threshold', 0) + 1
                if not pair_in_scope:
                    stats['cite_bare'] = stats.get('cite_bare', 0) + 1
                elif bounded:
                    # `≥ 8:1` beside a pair. A bound states no measurement
                    # whatever is next to it, so this is a distinct line
                    # rather than a blind spot — but it is not "no operand
                    # pair in scope" either, and saying so was the lie.
                    stats['cite_bound_pair'] = stats.get('cite_bound_pair', 0) + 1
                    stats.setdefault('cite_bound_pair_where', []).append(
                        '%s:%d  %s' % (name, n, claim_text))
                else:
                    stats['cite_value_pair'] = stats.get('cite_value_pair', 0) + 1
                    stats.setdefault('cite_value_pair_where', []).append(
                        '%s:%d  %s' % (name, n, claim_text))
                continue

            # A claim only CONVICTS when its own unit really does name both
            # operands. Outside a table the unit is the clause: "The decorative
            # `--sk-border: #b8a98e` measures **1.76:1**" names one colour and
            # describes the other, and widening to the rest of the line just
            # invents a pair the sentence never meant. Inside a table the row is
            # the unit — that is what a row is for — so a row that names two
            # colours must agree with the figure in it.
            #
            # THE CONVICTS TEST RUNS FIRST. It used to run after an
            # `operand_count == 0` early return that read the CLAUSE, so a
            # table row that named both colours escaped the moment its figure
            # cell held one extra word: `| #fff | #000 | 15.49:1 zz |` and
            # `| … | x 15.49:1 |` both stopped being bare, both scored zero
            # clause operands, and both were filed under "no operands" — the
            # non-failing bucket — while the row went on naming the pair. The
            # comment above promised the opposite and could never be reached.
            if convicts:
                ops = clause_ops if clause_pairable else wide_ops
                b = best_pair(ops, claim)
                dp = max(2, decimals(claim_text) + 2)
                findings.append({
                    'kind': 'MISMATCH', 'file': name, 'line': n,
                    'claim': claim, 'actual': shown(b[0], dp), 'dp': dp,
                    'pair': [b[1], b[2]],
                    'candidates': sorted({o[0] for o in ops}),
                    'text': line.strip()[:160],
                })
                # A wrong figure that is ALSO on the passing side of a bar the
                # maths does not clear is two separate problems, and the second
                # one is the one that ships an inaccessible control. Tightening
                # the tolerance moved several of these out of the matched
                # branch, so the bar test runs on the convicting pair as well.
                for t in ROUNDUP_BARS if not citation else ():
                    if claim >= t > b[0]:
                        findings.append({
                            'kind': 'ROUNDUP', 'file': name, 'line': n,
                            'claim': claim, 'actual': shown(b[0], dp),
                            'dp': dp,
                            'threshold': t, 'pair': [b[1], b[2]],
                            'text': line.strip()[:160],
                        })
                        break
                continue

            # Nothing convicting: say which of the two innocent shapes it is.
            # A figure with one colour beside it is a different report from a
            # figure with none, and both are INFO.
            operand_count = len(clause_ops) if clause_ops else (
                len(unit_ops) if bare else 0)
            if operand_count == 0:
                stats['no_operands'] = stats.get('no_operands', 0) + 1
                stats.setdefault('no_operands_where', []).append(
                    '%s:%d  %s' % (name, n, claim_text))
                continue
            stats['single_operand'] = stats.get('single_operand', 0) + 1
            stats.setdefault('single_operand_where', []).append(
                '%s:%d  %s  (best available pair does not match)'
                % (name, n, claim_text))


# ------------------------------------------------------------------ main ---


def main(argv):
    as_json = '--json' in argv
    verbose = '--verbose' in argv
    args = [a for a in argv if not a.startswith('--')]

    here = os.path.dirname(os.path.abspath(__file__))
    if args:
        paths = [a if os.path.isabs(a) else os.path.join(here, a) for a in args]
    else:
        paths = sorted(os.path.join(here, f) for f in os.listdir(here)
                       if f.endswith('.md'))

    findings = []
    stats = {
        'claims': 0, 'verified': 0, 'composited': 0, 'threshold': 0,
        'cite_bare': 0, 'cite_bound_pair': 0, 'cite_value_pair': 0,
        'no_operands': 0, 'single_operand': 0, 'suppressed': 0, 'nearmiss': 0,
        'lum_verified': 0, 'lum_unbound': 0, 'consistency_verified': 0,
        'tiers': {}, 'composited_where': [], 'no_operands_where': [],
        'single_operand_where': [], 'nearmiss_where': [],
        'cite_bound_pair_where': [], 'cite_value_pair_where': [],
        'claims_by_file': {}, 'verified_by_file': {},
        'suppressed_kinds': set(),
    }
    for p in paths:
        if os.path.exists(p):
            check_file(p, findings, stats)

    # ------------------------------------------------------ 5. + vacuity ---
    # A green run has to mean "the figures were read and they agree". Without
    # this it also means "there were no figures", and the two are printed
    # identically. Rewording every `N:1` in the set to "N to 1" took the run
    # from 572 claims to 0 and it still said "All contrast figures agree with
    # the WCAG maths" and exited 0; so did pointing it at a directory with no
    # markdown in it. check-links.sh carries exactly this tripwire.
    coverage = []
    seen = [os.path.basename(p) for p in paths if os.path.exists(p)]
    if not seen:
        coverage.append({'kind': 'NOTHINGREAD', 'file': '(none)', 'line': 0,
                         'detail': 'no .md file was read at all'})
    elif stats['claims'] == 0:
        coverage.append({'kind': 'NOCLAIMS', 'file': ', '.join(seen), 'line': 0,
                         'detail': 'not one N:1 figure was extracted'})
    for b in seen:
        got = stats.get('claims_by_file', {}).get(b, 0)
        base = CLAIM_BASELINE.get(b)
        if base is None:
            coverage.append({'kind': 'NOBASELINE', 'file': b, 'line': 0,
                             'claims': got, 'baseline': None})
        elif got < base:
            coverage.append({'kind': 'SHRANK', 'file': b, 'line': 0,
                             'claims': got, 'baseline': base})
    ratchet = [(b, stats.get('claims_by_file', {}).get(b, 0),
                CLAIM_BASELINE[b]) for b in seen
               if b in CLAIM_BASELINE
               and stats.get('claims_by_file', {}).get(b, 0) > CLAIM_BASELINE[b]]

    # ------------------------------------------ 6. adjudication conservation ---
    # CLAIM_BASELINE guards the denominator; this guards the numerator. Without
    # it an exclusion bucket can absorb the whole corpus — `return True` at the
    # top of `alpha_bearing()` gives 0 verified, 576 excluded and a green run —
    # because every bucket in the INFO block is non-failing by design and the
    # coverage section only ever asks how many figures were EXTRACTED.
    #
    # The floor alone is not enough, and the ceiling is not the same fact
    # written twice. claims = verified + excluded + convicted — three buckets,
    # and the total moves — so an exemption that widens just far enough to
    # swallow a MISMATCH leaves verified exactly at its floor, leaves the
    # claims total alone, and turns a red run green. Nothing else in this file
    # can see that. `excluded` is computed here exactly as the summary line
    # computes it for the whole run, so the per-file numbers add up to the
    # printed totals by construction rather than by agreement.
    bad_by_file, nm_by_file = {}, {}
    for f in findings:
        if f['kind'] == 'MISMATCH':
            bad_by_file[f['file']] = bad_by_file.get(f['file'], 0) + 1
        elif f['kind'] == 'NEARMISS':
            nm_by_file[f['file']] = nm_by_file.get(f['file'], 0) + 1

    conservation = []
    verified_by_file, excluded_by_file = {}, {}
    for b in seen:
        v = stats['verified_by_file'].get(b, 0)
        x = (stats['claims_by_file'].get(b, 0) - v
             - bad_by_file.get(b, 0) - nm_by_file.get(b, 0))
        verified_by_file[b], excluded_by_file[b] = v, x
        floor = VERIFIED_BASELINE.get(b)
        ceiling = EXCLUDED_CEILING.get(b)
        if floor is None:
            conservation.append({'kind': 'NOFLOOR', 'file': b, 'line': 0,
                                 'verified': v, 'baseline': None})
        elif v < floor:
            conservation.append({'kind': 'UNVERIFIED', 'file': b, 'line': 0,
                                 'verified': v, 'baseline': floor})
        if ceiling is None:
            conservation.append({'kind': 'NOCEILING', 'file': b, 'line': 0,
                                 'excluded': x, 'baseline': None})
        elif x > ceiling:
            conservation.append({'kind': 'ABSORBED', 'file': b, 'line': 0,
                                 'excluded': x, 'baseline': ceiling})
    # Advisories, in the same direction-of-travel sense as the claim ratchet:
    # a floor may only be raised and a ceiling may only be lowered, and only
    # in a reviewed diff.
    adj_ratchet = [('verified', b, verified_by_file[b], VERIFIED_BASELINE[b])
                   for b in seen if b in VERIFIED_BASELINE
                   and verified_by_file[b] > VERIFIED_BASELINE[b]]
    adj_ratchet += [('excluded', b, excluded_by_file[b], EXCLUDED_CEILING[b])
                    for b in seen if b in EXCLUDED_CEILING
                    and excluded_by_file[b] < EXCLUDED_CEILING[b]]

    findings.sort(key=lambda f: (f['file'], f['line'], f['kind']))
    mismatches = [f for f in findings
                  if f['kind'] in ('MISMATCH', 'NEARMISS', 'LUMINANCE',
                                   'INCONSISTENT', 'ROUNDUP')]
    failed = bool(mismatches) or bool(coverage) or bool(conservation)

    if as_json:
        out = dict(stats)
        out['suppressed_kinds'] = sorted(k for k in stats['suppressed_kinds'] if k)
        out['excluded_by_file'] = excluded_by_file
        print(json.dumps({
            'files': [os.path.basename(p) for p in paths],
            'tolerance': {'%ddp' % d: tolerance_for(d)
                          for d in (0, 1, 2, 3, 4, 5, 6)},
            'luminance_tolerance': 'half a step at the digits written',
            'findings': findings,
            'coverage': coverage,
            'ratchet': [{'file': b, 'claims': g, 'baseline': z}
                        for b, g, z in ratchet],
            # A consumer that sees failed:true with nothing in the payload
            # explaining it is back to reading prose, and the conservation
            # section is the one that fails with no finding attached to a line.
            'conservation': conservation,
            'adjudication_ratchet': [{'measure': w, 'file': b, 'count': g,
                                      'baseline': z}
                                     for w, b, g, z in adj_ratchet],
            'summary': out,
            'failed': failed,
        }, indent=2, sort_keys=True))
        return 1 if failed else 0

    print('==> checking recomputed contrast ratios in %d .md file(s)'
          % len(paths))
    bad = [f for f in findings if f['kind'] == 'MISMATCH']
    for f in bad:
        # `%.*f` on a TRUNCATED value: the message may not print a figure the
        # pair does not have. `round(2.99534, 2)` is `3.0`, so the line that
        # says a claim of 3:1 is wrong used to say the maths gives 3.0.
        print('  MISMATCH  %s:%d  claims %s:1, computed %.*f:1 (%s vs %s)'
              % (f['file'], f['line'], f['claim'], f['dp'], f['actual'],
                 f['pair'][0], f['pair'][1]))
        print('            candidates on the line: %s'
              % ' '.join(f['candidates']))
    print('  ok' if not bad else '  ^ recompute with the WCAG formula and correct the doc')

    print('==> checking every figure is what rounding to its own precision gives')
    nm = [f for f in findings if f['kind'] == 'NEARMISS']
    for f in nm:
        print('  NEARMISS  %s:%d  claims %s:1, rounds to %s:1 at %ddp (%s vs %s)'
              % (f['file'], f['line'], f['claim'],
                 ('%.*f' % (f['dp'], f['actual'])), f['dp'],
                 f['pair'][0], f['pair'][1]))
    print('  ok' if not nm else '  ^ inside tolerance, but the last digit is not the one the maths gives')

    print('==> checking stated relative luminances')
    lum = [f for f in findings if f['kind'] == 'LUMINANCE']
    for f in lum:
        # Printed at the precision the doc chose plus one digit. At a fixed
        # 4dp a five-decimal claim and its five-decimal refutation printed as
        # the same number, and the finding read as a tie.
        print('  LUMINANCE %s:%d  %s states L %.*f, computes to %.*f (%s)'
              % (f['file'], f['line'], f['colour'], f['dp'], f['stated'],
                 f['dp'] + 1, f['actual'], f['source']))
    print('  ok' if not lum else '  ^ a stated luminance does not belong to the colour beside it')

    print('==> checking ratios follow from their own stated luminances')
    inc = [f for f in findings if f['kind'] == 'INCONSISTENT']
    for f in inc:
        print('  INCONSISTENT %s:%d  claims %s:1, but L %s imply %s:1'
              % (f['file'], f['line'], f['claim'],
                 ' / '.join('%.4f' % v for v in f['luminances']), f['implied']))
    print('  ok' if not inc else '  ^ the row disagrees with itself')

    print('==> checking no claim is rounded up through a WCAG threshold')
    ru = [f for f in findings if f['kind'] == 'ROUNDUP']
    for f in ru:
        print('  ROUNDUP   %s:%d  claims %s:1 but %s vs %s is %s:1 — under the %s:1 bar'
              % (f['file'], f['line'], f['claim'], f['pair'][0], f['pair'][1],
                 f['actual'], f['threshold']))
    print('  ok' if not ru else '  ^ W3C: values are not rounded up to meet a threshold')

    print('==> checking claim extraction has not regressed (coverage ratchet)')
    for c in coverage:
        if c['kind'] == 'NOTHINGREAD':
            print('  NOTHINGREAD  no .md file was read — an unread set is not '
                  'a passing set')
        elif c['kind'] == 'NOCLAIMS':
            print('  NOCLAIMS     %d file(s) read and not one N:1 figure was '
                  'extracted' % len(seen))
        elif c['kind'] == 'NOBASELINE':
            print('  NOBASELINE   %s yields %d claim(s) and has no committed '
                  'baseline — add one to CLAIM_BASELINE'
                  % (c['file'], c['claims']))
        else:
            print('  SHRANK       %s yields %d claim(s), below its committed '
                  'baseline of %d — a figure stopped being extracted'
                  % (c['file'], c['claims'], c['baseline']))
    for b, got, base in ratchet:
        print('  ratchet      %s now yields %d claim(s), above its baseline of '
              '%d — raise it in CLAIM_BASELINE' % (b, got, base))
    print('  ok' if not coverage else
          '  ^ a claim the regex stops matching leaves no other trace')

    print('==> checking adjudication has not regressed '
          '(verified floor / excluded ceiling)')
    for c in conservation:
        if c['kind'] == 'NOFLOOR':
            print('  NOFLOOR      %s verifies %d claim(s) and has no committed '
                  'floor — add one to VERIFIED_BASELINE'
                  % (c['file'], c['verified']))
        elif c['kind'] == 'UNVERIFIED':
            print('  UNVERIFIED   %s verifies %d claim(s), below its committed '
                  'floor of %d — %d figure(s) left the maths without failing'
                  % (c['file'], c['verified'], c['baseline'],
                     c['baseline'] - c['verified']))
        elif c['kind'] == 'NOCEILING':
            print('  NOCEILING    %s excuses %d claim(s) and has no committed '
                  'ceiling — add one to EXCLUDED_CEILING'
                  % (c['file'], c['excluded']))
        elif c['kind'] == 'ABSORBED':
            print('  ABSORBED     %s excuses %d claim(s), above its committed '
                  'ceiling of %d — an exclusion bucket grew by %d'
                  % (c['file'], c['excluded'], c['baseline'],
                     c['excluded'] - c['baseline']))
    for what, b, got, base in adj_ratchet:
        verb, edge, move, where = (
            ('verifies', 'floor', 'raise', 'VERIFIED_BASELINE')
            if what == 'verified' else
            ('excuses', 'ceiling', 'lower', 'EXCLUDED_CEILING'))
        print('  ratchet      %s now %s %d claim(s) against a committed %s of '
              '%d — %s it in %s' % (b, verb, got, edge, base, move, where))
    print('  ok' if not conservation else
          '  ^ a figure moved into a non-failing bucket leaves no other trace')

    print('==> claims that cannot be recomputed (INFO — never a failure)')
    print('  info     %3d composited: an alpha-bearing colour value is in scope'
          % stats['composited'])
    # The citation bucket, split three ways. It used to print as one number
    # labelled "bare WCAG thresholds with no colour operands", which was false
    # for nine of its members and hid the last surviving shape of the
    # value-only exemption inside an aggregate whose label denied it existed.
    print('  info     %3d requirement citations with no operand pair in scope'
          % stats['cite_bare'])
    print('  info     %3d relational bound(s) (≥ / ≤ / <) WITH a pair in scope '
          '— a bound states no measurement' % stats['cite_bound_pair'])
    for w in stats['cite_bound_pair_where']:
        print('             %s' % w)
    print('  info     %3d canonical WCAG value(s) WITH a pair in scope, '
          'exempted as citations (the remaining blind spot)'
          % stats['cite_value_pair'])
    # Printed unconditionally, not behind --verbose: this is the one bucket
    # whose members are exempt from MISMATCH, NEARMISS and ROUNDUP at once,
    # and a blind spot nobody can enumerate is a blind spot nobody audits.
    for w in stats['cite_value_pair_where']:
        print('             %s' % w)
    print('  info     %3d figures with no colour operands in scope' % stats['no_operands'])
    print('  info     %3d figures naming only one colour (no pair to compute)'
          % stats['single_operand'])
    print('  info     %3d suppressed by structure (%s)'
          % (stats['suppressed'],
             ', '.join(sorted(k for k in stats['suppressed_kinds'] if k))
             or 'strikethrough only; none present'))
    # Printed for the same reason a suppressed claim is counted: a figure that
    # leaves the run without a line is indistinguishable from one nobody
    # wrote. Doc 08 §7 states luminances of composites it never prints as a
    # colour ("C = 130.80 → L ≈ 0.2262"), so there is nothing to recompute
    # them from — but the count says so out loud instead of the denominator
    # quietly being smaller.
    print('  info     %3d stated luminance(s) with no colour to their left in '
          'the same clause' % stats['lum_unbound'])
    if verbose:
        for label, key in (('composited', 'composited_where'),
                           ('no operands', 'no_operands_where'),
                           ('single operand', 'single_operand_where')):
            for w in stats[key]:
                print('             %-15s %s' % (label, w))

    print('  ---')
    print('  %d contrast claim(s): %d verified, %d excluded, %d mismatched'
          '%s.'
          % (stats['claims'], stats['verified'],
             stats['claims'] - stats['verified'] - len(bad) - len(nm),
             len(bad),
             (', %d near miss' % len(nm)) if nm else ''))
    print('  %d stated luminance(s) verified, %d wrong.'
          % (stats['lum_verified'], len(lum)))
    print('  %d ratio/luminance consistency check(s) passed, %d failed.'
          % (stats['consistency_verified'], len(inc)))

    if failed:
        print()
        print('FAILED — see above.')
        return 1
    print()
    print('All contrast figures agree with the WCAG maths.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
