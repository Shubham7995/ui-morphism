#!/usr/bin/env python3
"""Numeric CI check for the ui-morphism doc set: recompute every contrast figure.

check-links.sh validates the *structure* of these docs. Nothing validated the
*numbers*, in a set whose README advertises measured contrast ratios. This does.

  1. every `N:1` / `N.N:1` / `N.NN:1` contrast claim is recomputed from the
     colours named beside it, and must agree within half a rounding step
  2. every stated relative luminance (`L 0.7512`, `L = 0.9416`, or a bare
     `0.7512` cell in a luminance table) is recomputed from its hex
  3. where a line states two luminances *and* a ratio, the ratio must follow
     from those two luminances — a row can be wrong three independent ways
     (bad L, bad L, and a ratio that matches neither) and only (3) sees all of it
  4. no claim may be rounded in the direction that makes it clear a WCAG
     threshold. W3C: values are not rounded up, so 2.999:1 fails 3:1.

The maths is WCAG 2.x, exactly:

    s = c / 255
    lin = s / 12.92                    if s <= 0.04045
        = ((s + 0.055) / 1.055) ** 2.4 otherwise
    L = 0.2126*linR + 0.7152*linG + 0.0722*linB
    ratio = (Lmax + 0.05) / (Lmin + 0.05)

Ratios agree within 0.055 — half a rounding step at 1dp, the loosest precision
the docs use. A figure that clears that bar but still is not what rounding to
its own precision gives (a 2dp table writing 15.42 where the maths says 15.46)
is printed as a near miss: informative, never a failure.

WHICH FIGURES ARE CHECKED, AND HOW A CLAIM FINDS ITS COLOURS

Scope widens one step at a time and the first match wins, so the tightest
reading that explains a figure is the one recorded:

    clause -> line or table row -> table row plus its header row

A clause is a sentence, a table cell, or anything either side of a semicolon or
an em dash. That split is what lets "AA 4.5:1 / 3:1 large." share a line with
"`#FFFFFF` on `#FFB3A7` is 1.71:1" without the requirements being measured
against the hexes. Colours come from hexes, from `white`/`black` written as
words, and — only where a scope cannot otherwise name two colours — from
resolving a `--token` the scope references against that doc's own declarations.

A figure CONVICTS only where its own unit really does name both operands: the
clause in prose, the row in a table. Prose that names one colour and describes
the other ("never `#000` on a dark surface: ~1.6:1") is reported as INFO, not
as a failure, because widening to the rest of the line only invents a pair the
sentence never meant.

WHAT IS EXCLUDED, AND WHY (all counted and printed, none of them fail the run)

  composited     the effective colour is an rgba fill over a backdrop this
                 checker cannot see. Excluded BEFORE matching is attempted:
                 run the matcher first and a stray pair on the same line will
                 "confirm" a figure it has nothing to do with.
  citation       the figure states a requirement rather than a measurement,
                 recognised two structural ways: its value is exactly a
                 canonical WCAG figure (3, 4.5, 7, 2.999), or it is introduced
                 by relational notation (`≥`, `>=`, `<`), which names a bound.
  no operands    no colour in scope at all.
  one operand    one colour in scope; no pair to compute.
  structural     inside a strikethrough span or a blockquote — the two ways a
                 doc can mark a figure as deliberately wrong. This is the ONLY
                 author-controlled suppression and it is structural on purpose.
                 An earlier check in this set was defeated by a keyword list,
                 because the words a doc uses to flag a bad value are the words
                 a real offence carries in its own comment. To have a figure
                 ignored here, mark it up; writing "incorrect" beside it does
                 nothing.

KNOWN BLIND SPOTS, stated so nobody reads a green run as more than it is:
a wrong figure landing on exactly 3, 4.5 or 7; a wrong figure inside an
alpha-composited claim; a figure whose operands are named in words the docs
never bind to a hex ("lime 16.63:1"). The INFO counts are the size of each.

Exits non-zero once, after printing every offence in every category.

Usage:  ./check-contrast.py [--json] [--verbose] [file.md ...]

  --json     machine-readable findings and summary, for a skill to consume
  --verbose  list every excluded figure, not just the counts

Pure standard library. Runs under `env -i PATH=/usr/bin:/bin python3`.
"""

import json
import os
import re
import sys

TOLERANCE = 0.055     # half a rounding step at 1dp — the loosest precision used
L_TOLERANCE = 0.0005  # stated luminances are given to 4dp

# The canonical WCAG figures. A claim whose value is exactly one of these is a
# CITATION of a requirement, not a measurement — "AA requires 4.5:1", "the 3:1
# floor", "2.999:1 fails". Across this set they appear 130+ times, constantly on
# lines that also carry hexes ("rejects any accent below 4.5:1 against
# `#0A0A0A`"), so treating them as measurements produces nothing but noise.
# Citations are recomputed and counted when a pair does match, but they never
# convict. The cost is stated plainly: a genuinely wrong figure that happens to
# land on exactly 3, 4.5 or 7 is not caught by this check.
WCAG_THRESHOLDS = {3.0, 4.5, 7.0, 2.999}

# Thresholds a measured claim must not be rounded up through.
ROUNDUP_BARS = (3.0, 4.5, 7.0)

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
# the effective colour depends on a backdrop, so they are composite markers, not
# operands. 5- and 7-digit are not colours at all.
HEX_RE = re.compile(r'#([0-9A-Fa-f]{3,8})\b')

# A contrast claim. Guarded on both sides so `1.4.11` and `0.868 dp` cannot
# produce one, and so `21:10` is not read as `21:1`.
CLAIM_RE = re.compile(r'(?<![\d.])(\d{1,3}(?:\.\d{1,2})?):1(?![\d:])')

# `L 0.7512`, `L = 0.7512`, `L: 0.7512`. Capital L only — lowercase `l` is a
# unit, a list marker and a variable name all over these docs.
L_LABELLED_RE = re.compile(r'\bL[₁₂₀-₉]?\s*[=:]?\s*(0\.\d{3,6})\b')

# A custom-property name, for resolving `8.87:1 with --clay-ink`.
TOKEN_RE = re.compile(r'--[A-Za-z0-9_-]+')

# Named colours resolved as operands. Deliberately tiny: these two are the only
# ones the set writes as words instead of hex ("15.6:1 with black text"), and
# resolving a CSS named colour is colour parsing, not a suppression list.
NAMED_COLOURS = {'white': (255, 255, 255), 'black': (0, 0, 0)}
NAMED_RE = re.compile(r'\b(white|black)\b', re.IGNORECASE)

# Alpha compositing markers. A claim whose effective colour is an rgba fill over
# a backdrop cannot be recomputed from declared hexes; docs 03, 08 and 10 are
# built on them and they are correct. Counted as INFO, never as a failure.
COMPOSITE_RE = re.compile(
    r'rgba\(|hsla\(|alpha|α|\bover\b|composite|backdrop|/\s*\.\d|'
    r'#[0-9A-Fa-f]{4}\b|#[0-9A-Fa-f]{8}\b',
    re.IGNORECASE)

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
BOUND_RE = re.compile(r'(?:[≥≤<>]=?|>=|<=)\s*[`*_]{0,2}\s*$')


def parse_hex(text):
    """(r, g, b) for an opaque hex, or None for an alpha or malformed one."""
    if len(text) == 3:
        return tuple(int(c * 2, 16) for c in text)
    if len(text) == 6:
        return tuple(int(text[i:i + 2], 16) for i in (0, 2, 4))
    return None


def colour_operands(text):
    """Every opaque colour named in `text`, as (label, rgb), de-duplicated."""
    found = []
    seen = set()
    for m in HEX_RE.finditer(text):
        rgb = parse_hex(m.group(1))
        if rgb is not None and rgb not in seen:
            seen.add(rgb)
            found.append(('#' + m.group(1), rgb))
    for m in NAMED_RE.finditer(text):
        rgb = NAMED_COLOURS[m.group(1).lower()]
        if rgb not in seen:
            seen.add(rgb)
            found.append((m.group(1).lower(), rgb))
    return found


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
    for a, b in clause_spans(line):
        if a <= index < b:
            return line[a:b], a
    return line, 0


def is_bare(clause, claim_text):
    """True when the clause is nothing but the figure — a table measurement."""
    residue = clause.replace(claim_text, '', 1)
    residue = re.sub(r'[`*_~\s()\[\]|>=≥≤≈~–—.,:/-]', '', residue)
    return not ALNUM_RE.search(residue)


def table_row(line):
    stripped = line.strip()
    return stripped.startswith('|') and not re.match(r'^\|[\s:|-]*$', stripped)


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
            found.append((name, rgb))
    return found


# ------------------------------------------------- structural suppressions ---
# The one exclusion that is not about colour: a line that deliberately prints a
# WRONG figure in order to correct it. Detected by STRUCTURE only — inside a
# strikethrough span, or inside a blockquote. There is no keyword list here on
# purpose: an earlier check in this set was defeated by exactly that, because
# the words a doc uses to flag a bad value are the words a real offence carries
# in its own comment. If a doc wants a figure ignored it must mark it up.

STRIKE_RE = re.compile(r'~~.+?~~', re.DOTALL)


def suppressed_spans(line):
    if re.match(r'^\s{0,3}>', line):
        return [(0, len(line))], 'blockquote'
    spans = [(m.start(), m.end()) for m in STRIKE_RE.finditer(line)]
    return spans, 'strikethrough' if spans else None


# ------------------------------------------------------------- the checks ---


def best_pair(operands, target):
    """Closest computed pair to `target`, and the full set of computed pairs."""
    best = None
    for i in range(len(operands)):
        for j in range(i + 1, len(operands)):
            (la, ra), (lb, rb) = operands[i], operands[j]
            if la == lb:
                continue          # one token's light and dark value are not a pair
            r = contrast(ra, rb)
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

    for n, line in enumerate(lines, 1):
        strike, strike_kind = suppressed_spans(line)
        row = table_row(line)
        unit = line
        unit_ops = colour_operands(unit)
        unit_tier = 'unit'
        if len({l for l, _ in unit_ops}) < 2:
            # A resolved token that lands on a colour the line already prints is
            # the same colour under two names — doc 06's ramp rows write both
            # `--max-lime` and `#C6FF00`. Keeping it would make the row look
            # self-sufficient and compute a 1.00:1 pair against itself.
            literal = {rgb for _, rgb in unit_ops}
            unit_ops = unit_ops + [(t, rgb) for t, rgb
                                   in resolved_operands(unit, tokens)
                                   if rgb not in literal]
            unit_tier = 'unit+tokens'
        # The widest scope: the row plus its table header. Tried last, and only
        # for table rows, so a header's grounds can never leak into prose.
        wide_ops, wide = unit_ops, unit
        if n in header_for:
            head = header_for[n]
            literal = {rgb for _, rgb in unit_ops}
            wide_ops = unit_ops + [op for op in colour_operands(head)
                                   if op[1] not in literal]
            wide = line + ' ' + head

        # ---------------------------------------------- 2. stated luminance ---
        stated = []  # (position, value, source)
        for m in L_LABELLED_RE.finditer(line):
            stated.append((m.start(1), float(m.group(1)), 'labelled'))
        if row:
            pos = 0
            for cell in line.split('|'):
                c = re.sub(r'[`*\s]', '', cell)
                if re.fullmatch(r'0\.\d{4}', c):
                    stated.append((pos, float(c), 'table cell'))
                pos += len(cell) + 1

        hexes = [(m.start(), '#' + m.group(1), parse_hex(m.group(1)))
                 for m in HEX_RE.finditer(line) if parse_hex(m.group(1))]

        for pos, value, source in sorted(stated):
            if any(a <= pos < b for a, b in strike):
                stats['suppressed'] = stats.get('suppressed', 0) + 1
                continue
            left = [h for h in hexes if h[0] < pos]
            owner = left[-1] if left else (hexes[0] if hexes else None)
            if owner is None:
                stats['lum_unbound'] = stats.get('lum_unbound', 0) + 1
                continue
            actual = luminance(owner[2])
            if abs(actual - value) > L_TOLERANCE:
                findings.append({
                    'kind': 'LUMINANCE', 'file': name, 'line': n,
                    'stated': value, 'actual': round(actual, 4),
                    'colour': owner[1], 'source': source,
                    'text': line.strip()[:160],
                })
            else:
                stats['lum_verified'] = stats.get('lum_verified', 0) + 1

        # ----------------------------------------------------- 1. + 3. + 4. ---
        lum_values = [v for _, v, _ in sorted(stated)]

        for m in CLAIM_RE.finditer(line):
            claim_text = m.group(0)
            claim = float(m.group(1))
            if any(a <= m.start() < b for a, b in strike):
                stats['suppressed'] = stats.get('suppressed', 0) + 1
                stats.setdefault('suppressed_kinds', set()).add(strike_kind)
                continue
            stats['claims'] = stats.get('claims', 0) + 1

            clause, offset = clause_at(line, m.start())
            clause_ops = colour_operands(clause)
            bare = is_bare(clause, claim_text)

            # A citation is a figure that states a requirement rather than a
            # measurement, recognised two structural ways and no other:
            #   * the value is exactly a canonical WCAG figure (3, 4.5, 7,
            #     2.999) — the set writes those 130+ times as requirements,
            #     routinely on lines that also carry hexes;
            #   * the figure is introduced by relational notation (`≥`, `>=`,
            #     `<`), which states a bound and names nothing to recompute.
            # Citations are still recomputed and counted when a pair matches;
            # they simply never convict.
            citation = (claim in WCAG_THRESHOLDS
                        or bool(BOUND_RE.search(line[:m.start()])))

            # 3. self-consistency: two stated luminances plus a ratio. Checked
            # independently of the colours, because a row can state operands
            # that are themselves wrong AND a ratio that does not follow from
            # them — two different lies that hide each other.
            if len(lum_values) >= 2:
                implied = [ratio_from_luminances(lum_values[i], lum_values[j])
                           for i in range(len(lum_values))
                           for j in range(i + 1, len(lum_values))]
                closest = min(implied, key=lambda r: abs(r - claim))
                if abs(closest - claim) > TOLERANCE:
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
            composite_scope = clause if COMPOSITE_RE.search(clause) else (
                wide if len(clause_ops) < 2 else '')
            if COMPOSITE_RE.search(composite_scope or ''):
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
                if b and abs(b[0] - claim) <= TOLERANCE:
                    match, tier = b, label
                    break

            if match:
                stats['verified'] = stats.get('verified', 0) + 1
                tiers = stats.setdefault('tiers', {})
                tiers[tier] = tiers.get(tier, 0) + 1
                # Near miss: agrees at the run's 0.055 tolerance, but is not
                # what rounding to the claim's OWN precision produces. A 2dp
                # table writing 15.42 where the maths gives 15.46 is inside
                # tolerance and still not the number. INFO, never a failure —
                # the failing tolerance is fixed by contract.
                dp = decimals(claim_text)
                if round(match[0], dp) != round(claim, dp):
                    stats['nearmiss'] = stats.get('nearmiss', 0) + 1
                    stats.setdefault('nearmiss_where', []).append(
                        '%s:%d  claims %s:1, rounds to %s:1 at %ddp'
                        % (name, n, claim_text.replace(':1', ''),
                           ('%.*f' % (dp, match[0])), dp))
                # 4. never round in the direction that makes a claim pass.
                for t in ROUNDUP_BARS if not citation else ():
                    if claim >= t > match[0]:
                        findings.append({
                            'kind': 'ROUNDUP', 'file': name, 'line': n,
                            'claim': claim, 'actual': round(match[0], 2),
                            'threshold': t, 'pair': [match[1], match[2]],
                            'text': line.strip()[:160],
                        })
                        break
                continue

            # Unverified, and not composited: classify why.
            if citation:
                stats['threshold'] = stats.get('threshold', 0) + 1
                continue

            operand_count = len(clause_ops) if clause_ops else (
                len(unit_ops) if bare else 0)
            if operand_count == 0:
                stats['no_operands'] = stats.get('no_operands', 0) + 1
                stats.setdefault('no_operands_where', []).append(
                    '%s:%d  %s' % (name, n, claim_text))
                continue

            # A claim only CONVICTS when its own unit really does name both
            # operands. Outside a table the unit is the clause: "The decorative
            # `--sk-border: #b8a98e` measures **1.76:1**" names one colour and
            # describes the other, and widening to the rest of the line just
            # invents a pair the sentence never meant. Inside a table the row is
            # the unit — that is what a row is for — so a row that names two
            # colours must agree with the figure in it.
            clause_pairable = len({l for l, _ in clause_ops}) >= 2
            wide_pairable = len({l for l, _ in wide_ops}) >= 2
            ops = clause_ops if clause_pairable else wide_ops
            convicts = clause_pairable or (row and wide_pairable)
            if not convicts:
                stats['single_operand'] = stats.get('single_operand', 0) + 1
                stats.setdefault('single_operand_where', []).append(
                    '%s:%d  %s  (best available pair does not match)'
                    % (name, n, claim_text))
                continue

            b = best_pair(ops, claim)
            findings.append({
                'kind': 'MISMATCH', 'file': name, 'line': n,
                'claim': claim, 'actual': round(b[0], max(2, decimals(claim_text))),
                'pair': [b[1], b[2]],
                'candidates': sorted({o[0] for o in ops}),
                'text': line.strip()[:160],
            })


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
        'no_operands': 0, 'single_operand': 0, 'suppressed': 0, 'nearmiss': 0,
        'lum_verified': 0, 'lum_unbound': 0, 'consistency_verified': 0,
        'tiers': {}, 'composited_where': [], 'no_operands_where': [],
        'single_operand_where': [], 'nearmiss_where': [],
        'suppressed_kinds': set(),
    }
    for p in paths:
        check_file(p, findings, stats)

    findings.sort(key=lambda f: (f['file'], f['line'], f['kind']))
    mismatches = [f for f in findings
                  if f['kind'] in ('MISMATCH', 'LUMINANCE', 'INCONSISTENT',
                                   'ROUNDUP')]

    if as_json:
        out = dict(stats)
        out['suppressed_kinds'] = sorted(k for k in stats['suppressed_kinds'] if k)
        print(json.dumps({
            'files': [os.path.basename(p) for p in paths],
            'tolerance': TOLERANCE,
            'luminance_tolerance': L_TOLERANCE,
            'findings': findings,
            'summary': out,
            'failed': bool(mismatches),
        }, indent=2, sort_keys=True))
        return 1 if mismatches else 0

    print('==> checking recomputed contrast ratios in %d .md file(s)'
          % len(paths))
    bad = [f for f in findings if f['kind'] == 'MISMATCH']
    for f in bad:
        print('  MISMATCH  %s:%d  claims %s:1, computed %s:1 (%s vs %s)'
              % (f['file'], f['line'], f['claim'], f['actual'],
                 f['pair'][0], f['pair'][1]))
        print('            candidates on the line: %s'
              % ' '.join(f['candidates']))
    print('  ok' if not bad else '  ^ recompute with the WCAG formula and correct the doc')

    print('==> checking stated relative luminances')
    lum = [f for f in findings if f['kind'] == 'LUMINANCE']
    for f in lum:
        print('  LUMINANCE %s:%d  %s states L %.4f, computes to %.4f (%s)'
              % (f['file'], f['line'], f['colour'], f['stated'], f['actual'],
                 f['source']))
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

    print('==> claims that cannot be recomputed (INFO — never a failure)')
    print('  info     %3d composited-alpha (rgba fill over a backdrop, no declared hex)'
          % stats['composited'])
    print('  info     %3d bare WCAG thresholds with no colour operands' % stats['threshold'])
    print('  info     %3d figures with no colour operands in scope' % stats['no_operands'])
    print('  info     %3d figures naming only one colour (no pair to compute)'
          % stats['single_operand'])
    print('  info     %3d near miss: inside tolerance, but not what rounding to the'
          % stats['nearmiss'])
    print('               claim\'s own precision gives — review, never a failure')
    for w in stats['nearmiss_where']:
        print('             %s' % w)
    print('  info     %3d suppressed by structure (%s)'
          % (stats['suppressed'],
             ', '.join(sorted(k for k in stats['suppressed_kinds'] if k))
             or 'strikethrough / blockquote; none present'))
    if verbose:
        for label, key in (('composited', 'composited_where'),
                           ('no operands', 'no_operands_where'),
                           ('single operand', 'single_operand_where')):
            for w in stats[key]:
                print('             %-15s %s' % (label, w))

    print('  ---')
    print('  %d contrast claim(s): %d verified, %d excluded, %d mismatched.'
          % (stats['claims'], stats['verified'],
             stats['claims'] - stats['verified'] - len(bad), len(bad)))
    print('  %d stated luminance(s) verified, %d wrong.'
          % (stats['lum_verified'], len(lum)))
    print('  %d ratio/luminance consistency check(s) passed, %d failed.'
          % (stats['consistency_verified'], len(inc)))

    if mismatches:
        print()
        print('FAILED — see above.')
        return 1
    print()
    print('All contrast figures agree with the WCAG maths.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
