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

TOLERANCE IS THE CLAIM'S OWN PRECISION, NOT A FIXED SLACK

A figure is checked against half a rounding step at the precision it was
written at: 0.005 for `15.46:1`, 0.055 for `7.8:1` (1dp keeps a hair of slack
for the last-digit ambiguity a single decimal really has), 0.5 for `21:1`.
A flat 0.055 applied to a 2dp figure is eleven times looser than the figure
claims to be, and lets `7.85` stand where the maths says `7.81`. Most of this
set is written at 2dp, so the flat bar was the default case, not the edge.

Because the bar now matches the precision, "inside tolerance but not what
rounding to its own precision gives" is a FAILURE (NEARMISS), not a note. At
2dp and 0dp the class is empty by construction; at 1dp it is exactly the
0.05–0.055 sliver, which is a wrong last digit and nothing else.

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
                 A suppressed claim is still COUNTED — it lands in the claims
                 denominator and in the printed "suppressed by structure"
                 total. A claim that vanishes silently is indistinguishable
                 from one that was never written, which is what a blockquote
                 hiding a false figure relies on.

KNOWN BLIND SPOTS, stated so nobody reads a green run as more than it is:

  * a wrong figure landing on exactly 3, 4.5 or 7;
  * a wrong figure inside a claim that really does carry an alpha value;
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

L_TOLERANCE = 0.0005  # stated luminances are given to 4dp

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
    return max(0.5 * 10.0 ** -dp, 1e-9)

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
# full alpha (`#RGBF`, `#RRGGBBFF`) is an opaque colour, zero alpha paints
# nothing, and anything between the two is a composite marker. 5- and 7-digit
# are not colours at all. The lookbehind keeps `&#9733;` (an HTML entity) and
# `issue#1142` from being read as colours.
HEX_RE = re.compile(r'(?<![&\w])#([0-9A-Fa-f]{3,8})\b')

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

        for pos, value, source in sorted(stated):
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
        row_lum_values = [v for _, v, _ in sorted(stated)]

        for m in CLAIM_RE.finditer(line):
            claim_text = m.group(0)
            claim = float(m.group(1))
            # Counted BEFORE the suppression test, so a suppressed claim shows
            # up in the denominator and in the "suppressed by structure" total.
            # Counting after meant a blockquote could delete a figure from the
            # run without leaving a trace: the totals were identical whether
            # the line existed or not, which is exactly what hiding a false
            # figure behind a `>` relies on.
            stats['claims'] = stats.get('claims', 0) + 1
            if any(a <= m.start() < b for a, b in strike):
                stats['suppressed'] = stats.get('suppressed', 0) + 1
                stats.setdefault('suppressed_kinds', set()).add(strike_kind)
                continue

            tol = tolerance_for(decimals(claim_text))
            clause, clause_spans_here = clause_at(line, m.start())
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
            #
            # Scoped to the claim's own clause, widening to the row only when
            # the clause holds fewer than two (a table states its luminances in
            # separate cells). Whole-line scope was wrong: doc 10 line 1160
            # states two INDEPENDENT composites, each with its own luminance
            # and its own ratio against an unstated white ground, and pairing
            # one measurement's L with the other's convicted four correct
            # figures on the strength of an arithmetic relation nobody claimed.
            lum_values = [v for p, v, _ in sorted(stated)
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
            clause_pairable = len({op[0] for op in clause_ops}) >= 2
            wide_pairable = len({op[0] for op in wide_ops}) >= 2
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
            # A wrong figure that is ALSO on the passing side of a bar the
            # maths does not clear is two separate problems, and the second
            # one is the one that ships an inaccessible control. Tightening
            # the tolerance moved several of these out of the matched branch,
            # so the bar test runs on the convicting pair as well.
            for t in ROUNDUP_BARS if not citation else ():
                if claim >= t > b[0]:
                    findings.append({
                        'kind': 'ROUNDUP', 'file': name, 'line': n,
                        'claim': claim, 'actual': round(b[0], 2),
                        'threshold': t, 'pair': [b[1], b[2]],
                        'text': line.strip()[:160],
                    })
                    break


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
                  if f['kind'] in ('MISMATCH', 'NEARMISS', 'LUMINANCE',
                                   'INCONSISTENT', 'ROUNDUP')]

    if as_json:
        out = dict(stats)
        out['suppressed_kinds'] = sorted(k for k in stats['suppressed_kinds'] if k)
        print(json.dumps({
            'files': [os.path.basename(p) for p in paths],
            'tolerance': {'%ddp' % d: tolerance_for(d) for d in (0, 1, 2)},
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
    print('  info     %3d composited: an alpha-bearing colour value is in scope'
          % stats['composited'])
    print('  info     %3d bare WCAG thresholds with no colour operands' % stats['threshold'])
    print('  info     %3d figures with no colour operands in scope' % stats['no_operands'])
    print('  info     %3d figures naming only one colour (no pair to compute)'
          % stats['single_operand'])
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

    if mismatches:
        print()
        print('FAILED — see above.')
        return 1
    print()
    print('All contrast figures agree with the WCAG maths.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
