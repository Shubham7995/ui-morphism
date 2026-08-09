#!/usr/bin/env bash
# Structural CI check for the ui-morphism doc set.
#
#   1. every ](./NN-*.md) link target exists on disk
#   2. every doc carries the 14 required H2 headings, byte-identical and in order
#   3. no `@theme` block is nested inside an at-rule (Tailwind v4 drops those)
#   4. no Tailwind bracket-syntax reference to a bare custom property, judged
#      structurally: outside a fence a well-formed backtick span is a quotation
#      and is removed; inside a fence the raw line is tested, because a backtick
#      there is a literal character (a JS template delimiter), not markup
#   5. no phantom token: every name in the §4 token table is assigned somewhere
#      in the doc. Assigned outside §4 (a §5 runtime style object, say) is a
#      `note`, not a failure; assigned nowhere is a PHANTOM failure. The table
#      is also held against a degeneracy tripwire — NOT a coverage requirement;
#      see the long note at the check itself for exactly how weak that is
#   6. theme-selector discipline: guarded `:root[data-theme=…]`, never a bare one
#   7. the `target`-group token is referenced by name in §7, not restated as px
#   8. every markdown file quotes only tokens the doc owning that prefix declares
#   9. dead tokens: declared but never consumed by a var() (warning only)
#  10. every contrast figure recomputes from the WCAG maths (check-contrast.py)
#
# Exits non-zero once, after printing every offence in every category.

set -uo pipefail
cd "$(dirname "$0")" || exit 2

fail=0
docs=(0[1-9]-*.md 10-*.md)

# Short custom-property prefix per doc. Mirrors README's "Per-doc short prefixes"
# table; if a doc renames its prefix, change it in both places.
prefix_of() {
  case "$1" in
    01-*) echo 'sk'    ;;
    02-*) echo 'nm'    ;;
    03-*) echo 'glass' ;;
    04-*) echo 'clay'  ;;
    05-*) echo 'min'   ;;
    06-*) echo 'max'   ;;
    07-*) echo 'nb'    ;;
    08-*) echo 'lg'    ;;
    09-*) echo 'bento' ;;
    10-*) echo 'sp'    ;;
    *)    echo ''      ;;
  esac
}

# The inverse of prefix_of: the doc that owns (and must declare) a short prefix.
owner_of() {
  case "$1" in
    sk)    echo 01-skeuomorphism.md ;;
    nm)    echo 02-neumorphism.md   ;;
    glass) echo 03-glassmorphism.md ;;
    clay)  echo 04-claymorphism.md  ;;
    min)   echo 05-minimalism.md    ;;
    max)   echo 06-maximalism.md    ;;
    nb)    echo 07-brutalism.md     ;;
    lg)    echo 08-liquid-glass.md  ;;
    bento) echo 09-bento-grid.md    ;;
    sp)    echo 10-spatial-ui.md    ;;
    *)     echo ''                  ;;
  esac
}

# Every short prefix, in doc order. Kept in step with prefix_of / owner_of.
prefixes='sk nm glass clay min max nb lg bento sp'

# The four docs that reference every style but own no prefix of their own.
xrefs=(00-comparison-matrix.md README.md GLOSSARY.md MARKETPLACE.md)

# Every markdown file in the set. Check 8 reads all of them: a style doc quoting
# another style doc's token is the same cross-reference as the matrix doing it.
allfiles=("${xrefs[@]}" "${docs[@]}")

# Print a captured list only when it is non-empty, so `comm` never sees a blank.
lines() { [ -n "$1" ] && printf '%s\n' "$1"; return 0; }

# One numbered section, from its H2 up to (not including) the next H2.
section() {
  awk -v pat="$2" '
    $0 ~ pat        { inside = 1; print; next }
    inside && /^## /{ exit }
    inside
  ' "$1"
}

# Body lines of every ```css fence on stdin.
css_fences() {
  awk '
    /^```css/ { infence = 1; next }
    /^```/    { infence = 0; next }
    infence
  '
}

# `NR:--name` for every custom-property name a markdown file prints *as code* —
# inside a fenced block, or inside an inline backtick span. A name written in
# running prose is not a code reference and is not reported.
#
# Spans are found with a non-greedy `` `…` `` match rather than by splitting on
# backticks and keeping alternate fields: on a line with an ODD number of
# backticks the split silently discards everything past the last one, so a
# `--token` after a stray backtick went unseen.
code_tokens() {
  awk '
    /^[[:space:]]*```/ { fence = !fence; next }
    {
      if (fence) { emit($0); next }
      rest = $0
      while (match(rest, /`[^`]*`/)) {
        # match() inside emit() clobbers RSTART/RLENGTH — read them first.
        st = RSTART; len = RLENGTH
        span = substr(rest, st + 1, len - 2)
        rest = substr(rest, st + len)
        emit(span)
      }
    }
    function emit(s) {
      while (match(s, /--[A-Za-z0-9_*-]+/)) {
        print NR ":" substr(s, RSTART, RLENGTH)
        s = substr(s, RSTART + RLENGTH)
      }
    }
  ' "$1"
}

# Lines that use Tailwind bracket syntax against a bare custom property, judged
# structurally rather than by keyword. The exemption is a markdown inline code
# span, and a markdown inline code span only exists OUTSIDE a fence:
#
#   * outside a fence, a well-formed `` `…` `` span is a quotation — the docs
#     cannot warn about this pattern without naming it — so every span is
#     removed and only what survives is treated as markup. The span is found by
#     a non-greedy match, not by splitting the line on backticks: the split kept
#     odd-numbered fields, so a line with an ODD number of backticks lost its
#     whole tail and any offence sitting in it. Eight lines inside fences carry
#     an odd count today (JS template-literal delimiters in docs 01, 03, 07, 08)
#     and every region around them inherited that blind spot.
#   * inside a fence there is no such thing as a code span. A backtick there is
#     a literal character in the sample — `const CSS = ` opens a JS template
#     literal — so honouring it as a quotation hands any fenced line a free
#     exemption by writing one backtick. The RAW line is tested instead.
#
# So a genuine `ease-[--x]` in a ```css fence, in a ```jsx fence, in an HTML
# comment inside a ```html fence, or loose in prose all fail. Only prose that
# quotes the pattern in backticks is exempt. Outside a fence, spans are joined
# with a newline so removing one can never splice a match out of two halves.
#
# The name after `--` may be any CSS identifier: `ease-[--Glass-Ease-X]` is the
# same bug as `ease-[--glass-ease-x]`, so the class is [A-Za-z_], not [a-z].
bracket_hits() {
  awk '
    FNR == 1           { fence = 0 }
    /^[[:space:]]*```/ { fence = !fence; next }
    {
      if (fence) {
        bare = $0
      } else {
        bare = ""
        rest = $0
        while (match(rest, /`[^`]*`/)) {
          bare = bare substr(rest, 1, RSTART - 1) "\n"
          rest = substr(rest, RSTART + RLENGTH)
        }
        bare = bare rest
      }
      if (bare ~ /[a-z0-9]-\[--[A-Za-z_]/) printf "%s:%d:%s\n", FILENAME, FNR, $0
    }
  ' *.md
}

# The cells of the column headed exactly "Token", for every markdown table on
# stdin that has one. Tables without such a header (doc 09's tile-name table,
# doc 02's descriptive table) contribute nothing.
token_column() {
  awk '
    /^```/                { fence = !fence; next }
    fence                 { next }
    /^\|[[:space:]]*:?-+/ { next }
    /^\|/ {
      n = split($0, cell, "|")
      if (!col) {
        for (i = 2; i <= n; i++) {
          h = cell[i]; gsub(/^[[:space:]]+|[[:space:]]+$/, "", h)
          if (tolower(h) == "token") { col = i; break }
        }
        next
      }
      if (col <= n) print cell[col]
      next
    }
    { col = 0 }
  '
}

# ---------------------------------------------------------------- 1. links ---
echo "==> checking ./NN-*.md link targets"
while IFS= read -r hit; do
  file=${hit%%:*}
  rest=${hit#*:}
  line=${rest%%:*}
  target=$(printf '%s' "$hit" | grep -o '](\./[0-9][0-9][^)]*\.md)' | sed 's/^](\.\///; s/)$//')
  for t in $target; do
    if [ ! -f "$t" ]; then
      printf '  BROKEN  %s:%s -> ./%s\n' "$file" "$line" "$t"
      fail=1
    fi
  done
done < <(grep -n '](\./[0-9][0-9][^)]*\.md)' -- *.md)
[ "$fail" -eq 0 ] && echo "  ok"

# ------------------------------------------------------------- 2. headings ---
echo "==> checking the 14 required H2 headings"
read -r -d '' EXPECTED <<'EOF'
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
EOF

heads_ok=1
for f in "${docs[@]}"; do
  actual=$(grep '^## ' "$f")
  if [ "$actual" != "$EXPECTED" ]; then
    echo "  HEADINGS  $f differs from the canonical 14:"
    diff <(printf '%s\n' "$EXPECTED") <(printf '%s\n' "$actual") | sed 's/^/    /'
    fail=1; heads_ok=0
  fi
done
[ "$heads_ok" -eq 1 ] && echo "  ok"

# --------------------------------------------------- 3. nested @theme block ---
# `@theme` is only processed at the top level of a stylesheet. Inside the fenced
# code blocks a nested one shows up as an indented `@theme`.
echo "==> checking for @theme nested inside an at-rule"
if grep -n '^[[:space:]]\+@theme' -- *.md; then
  echo "  ^ @theme must be at the top level; use @layer theme { :root { ... } } instead"
  fail=1
else
  echo "  ok"
fi

# ------------------------------------------- 4. bracket-syntax var reference ---
# `ease-[--ease-x]` emits the literal string `--ease-x` as a CSS value, silently.
# The docs have to be able to *name* that pattern in order to warn about it, so
# the exemption is structural — in PROSE a backtick span is a quotation, and
# everything else, prose or fence, is markup. No keyword list: the words the
# docs use when discussing this bug are exactly the words a real offence would
# carry in its comment. See bracket_hits() for why a fence gets no exemption.
echo "==> checking for Tailwind bracket references to bare custom properties"
brackets=$(bracket_hits)
if [ -n "$brackets" ]; then
  printf '%s\n' "$brackets"
  echo "  ^ use the generated theme utility name, or v4 parens: ease-(--ease-x)"
  fail=1
else
  echo "  ok"
fi

# ------------------------------------------------- 5. phantom §4 tokens ------
# Every custom-property name printed in the §4 token table must be assigned
# somewhere in the doc. A name that nothing assigns is a PHANTOM: it reads as
# copy-pasteable and resolves to nothing. A name §4 tables but assigns further
# down — a §5 runtime style object, say — is a legitimate two-tier case and is
# reported as a `note`, not a failure.
#
# The table is also held against a DEGENERACY TRIPWIRE. Read the next paragraph
# before trusting it: it is not a coverage requirement and does not certify that
# the table documents the token set. It exists so that extraction yielding
# nothing — a prose-filled Token column, a column that stopped being found at
# all — cannot print "ok" while certifying a table the check never read.
echo "==> checking §4 token tables for phantom tokens"
tokens_ok=1
for f in "${docs[@]}"; do
  p=$(prefix_of "$f")
  [ -n "$p" ] || { echo "  NOPREFIX  $f has no registered short prefix"; fail=1; tokens_ok=0; continue; }

  sec4=$(section "$f" '^## 4\. Anatomy & Design Tokens')
  if [ -z "$sec4" ]; then
    echo "  NOSECTION  $f has no §4 to check"; fail=1; tokens_ok=0; continue
  fi

  # Names printed in the table's Token column. A trailing hyphen means the cell
  # wrote a family stem (`--nb-shadow-*`), not a name, so drop those.
  tabled=$(printf '%s\n' "$sec4" | token_column \
    | grep -o -- "--${p}-[A-Za-z0-9_-]*" | grep -v -- '-$' | sort -u)

  # Names declared by the §4 CSS block.
  declared=$(printf '%s\n' "$sec4" | css_fences \
    | grep -o -- "--${p}-[A-Za-z0-9_-]*[[:space:]]*:" \
    | sed 's/[[:space:]]*:$//' | sort -u)

  # Names assigned anywhere in the doc — a CSS declaration, or a §5 runtime
  # style object (`"--sk-elev-current": shadow`). Used to separate a true
  # phantom (assigned nowhere) from a token §4 documents but §5 sets.
  anywhere=$(grep -o -- "--${p}-[A-Za-z0-9_-]*[\"']\{0,1\}[[:space:]]*:" "$f" \
    | sed 's/[^A-Za-z0-9_-]*$//' | sort -u)

  # DEGENERACY TRIPWIRE — deliberately weak, and stated as such.
  #
  # The numerator counts table ROWS that name at least one real token, not
  # unique names. A row is the unit the table is written in; unique names let a
  # multi-token cell carry the whole column. Doc 02 spends 58 names over 40
  # rows, so the old numerator over-reported it by 45% and the tripwire could be
  # walked past by prosifying rows whose surviving neighbours named two apiece.
  #
  # Row coverage across the ten docs, measured — rows naming a token / §4 CSS
  # declarations:
  #
  #     01 26/61 .43   02 40/58 .69   03 26/46 .57   04 35/68 .51   05 35/70 .50
  #     06 42/71 .59   07 23/62 .37   08 37/47 .79   09 42/42 1.0   10 32/58 .55
  #
  # The floor stays at a quarter, and the honest reason is that no coverage
  # number is derivable from that spread. It runs 0.37 to 1.00, a 2.7x range
  # driven by how much of a token set each doc writes as family-stem rows
  # (`--nb-shadow-*`), which the extraction drops on purpose. That is an
  # authorial style choice, not a quality signal. Any floor in (0.25, 0.37] is
  # picked by reading the current minimum and sliding just underneath it, which
  # is a suppression list with extra steps; a quarter predates the measurement
  # and is not fitted to it.
  #
  # So: what this catches is a column that names (almost) nothing. What it does
  # NOT catch is a table that quietly stops documenting a third of its tokens.
  # Doc 07 — the tightest doc — would have to fall from 23 naming rows to 15
  # before this fires, and doc 09 from 42 to 10. Do not read a pass here as
  # "§4 documents its tokens"; only the PHANTOM half of this check says that,
  # and it says it about names the table does print, not about names it omits.
  n_declared=$(printf '%s' "$declared" | grep -c .)
  n_rows=$(printf '%s\n' "$sec4" | token_column | awk -v p="$p" '
    function names_one(s,   t) {
      while (match(s, "--" p "-[A-Za-z0-9_*-]+")) {
        t = substr(s, RSTART, RLENGTH)
        s = substr(s, RSTART + RLENGTH)
        if (t !~ /[-*]$/) return 1      # a family stem is not a name
      }
      return 0
    }
    names_one($0) { rows++ }
    END { print rows + 0 }
  ')

  # A §4 whose CSS declares nothing is itself degenerate, and used to skip the
  # tripwire entirely — zero rows against zero declarations passed silently.
  if [ "$n_declared" -eq 0 ]; then
    printf '  NODECL   %s: §4 CSS declares no --%s-… property at all\n' "$f" "$p"
    fail=1; tokens_ok=0
  elif [ "$((n_rows * 4))" -lt "$n_declared" ]; then
    printf '  NONAMES  %s: only %s §4 table row(s) name a token, against %s declared properties\n' \
      "$f" "$n_rows" "$n_declared"
    fail=1; tokens_ok=0
  fi

  while IFS= read -r t; do
    [ -n "$t" ] || continue
    ln=$(grep -n -- "$t" "$f" | head -1 | cut -d: -f1)
    printf '  PHANTOM  %s:%s  %s is in the §4 table but nothing declares it\n' "$f" "$ln" "$t"
    fail=1; tokens_ok=0
  done < <(comm -23 <(lines "$tabled") <(lines "$anywhere"))

  while IFS= read -r t; do
    [ -n "$t" ] || continue
    ln=$(grep -n -- "$t" "$f" | head -1 | cut -d: -f1)
    printf '  note     %s:%s  %s is tabled in §4 but assigned outside it (runtime token)\n' "$f" "$ln" "$t"
  done < <(comm -12 <(comm -23 <(lines "$tabled") <(lines "$declared")) <(lines "$anywhere"))
done
[ "$tokens_ok" -eq 1 ] && echo "  ok"

# ------------------------------------------- 6. theme-selector discipline ----
# A bare `[data-theme="dark"]` is specificity (0,1,0) and loses to the guarded
# `:root:not([data-theme="light"])` media block at (0,2,0) — the toggle then
# silently does nothing. Every override must be anchored on `:root`.
echo "==> checking theme-selector discipline"
theme_ok=1
for f in "${docs[@]}"; do
  case "$f" in
    03-*) want=':root[data-theme="light"]' ;;   # doc 03 is dark-first
    *)    want=':root[data-theme="dark"]'  ;;
  esac
  if ! grep -qF -- "$want" "$f"; then
    printf '  MISSING  %s has no %s override block\n' "$f" "$want"
    fail=1; theme_ok=0
  fi

  bare=$(awk -v file="$f" '
    function depth(s,   t, o, c) {
      t = s; o = gsub(/\(/, "(", t)
      t = s; c = gsub(/\)/, ")", t)
      return o - c
    }
    {
      start = 1
      while ((i = index(substr($0, start), "[data-theme=")) > 0) {
        abs = start + i - 1
        pre = substr($0, 1, abs - 1)
        head = pre; sub(/[[:space:]]+$/, "", head)
        if (depth(pre) <= 0 && (head == "" || head ~ /,$/))
          printf "  BARE     %s:%d  %s\n", file, NR, $0
        start = abs + 1
      }
    }
  ' "$f")
  if [ -n "$bare" ]; then
    printf '%s\n' "$bare"
    fail=1; theme_ok=0
  fi
done
[ "$theme_ok" -eq 1 ] && echo "  ok" || \
  echo "  ^ anchor every theme override on :root — a bare [data-theme=…] loses to the media guard"

# -------------------------------------------- 7. target token wired to §7 ----
# The target-size token exists to serve §7. A §7 that restates the pixel literal
# instead of naming the token lets the two drift apart silently.
echo "==> checking the target-group token is referenced by name in §7"
target_ok=1
for f in "${docs[@]}"; do
  p=$(prefix_of "$f")
  [ -n "$p" ] || continue
  sec4=$(section "$f" '^## 4\. Anatomy & Design Tokens')
  sec7=$(section "$f" '^## 7\. Accessibility')

  targets=$(printf '%s\n' "$sec4" | css_fences \
    | grep -o -- "--${p}-target[A-Za-z0-9_-]*[[:space:]]*:" \
    | sed 's/[[:space:]]*:$//' | sort -u)

  if [ -z "$targets" ]; then
    printf '  NOTARGET %s declares no --%s-target… token in §4\n' "$f" "$p"
    fail=1; target_ok=0
    continue
  fi
  if [ -z "$sec7" ]; then
    printf '  NOSECTION %s has no §7 to check\n' "$f"
    fail=1; target_ok=0
    continue
  fi
  while IFS= read -r t; do
    [ -n "$t" ] || continue
    if ! printf '%s\n' "$sec7" | grep -qF -- "$t"; then
      printf '  UNWIRED  %s: §7 never names %s (bare pixel literal instead?)\n' "$f" "$t"
      fail=1; target_ok=0
    fi
  done < <(lines "$targets")
done
[ "$target_ok" -eq 1 ] && echo "  ok"

# ------------------------------------- 8. cross-reference token references ---
# A cross-reference is any file printing a `--<prefix>-…` name that a DIFFERENT
# doc owns, and this reads all fourteen. It used to read only the four docs that
# own no prefix — 00-comparison-matrix.md, README.md, GLOSSARY.md and
# MARKETPLACE.md — which left the commonest cross-reference of all unchecked:
# one style doc quoting another style doc's token. §12 Hybrids & Neighbors and
# the comparison prose in §9 do that constantly, so a rename in doc 07 could
# leave a stale `--nb-…` standing in doc 09 and nothing noticed.
#
# A file is never checked against its OWN prefix here. That is not an exemption
# but the definition of the check: a doc's own names are its declarations, and
# they are covered by check 5 (tabled but never assigned) and check 9 (assigned
# but never read). Measured, self-checking would report only extraction gaps —
# `@property --sp-px { … }`, `["--sp-amp" as string]:`, and doc 04's comment
# quoting the misspelling it exists to document — none of them stale names.
#
# Family stems name a group, not a token, and are exempt in exactly two forms:
# a name ending `-*` (`--nb-shadow-*`), and a bare prefix (`--nb-`). The old
# test also let through anything ending in a plain hyphen, so `--glass-blur-9-`
# — a stale name with a typo, not a stem — was skipped. `--um-` convention names
# match no short prefix and so are never considered in the first place.
echo "==> checking every doc quotes only tokens the owning doc declares"
xref_ok=1
for f in "${allfiles[@]}"; do
  [ -f "$f" ] || { printf '  MISSING  %s is not on disk\n' "$f"; fail=1; xref_ok=0; continue; }
  own=$(prefix_of "$f")
  # Dedupe in place: `sort -u` would reorder line numbers lexically, and a
  # keyed sort would collapse two distinct tokens sharing one line.
  hits=$(code_tokens "$f" | awk '!seen[$0]++')
  [ -n "$hits" ] || continue

  for p in $prefixes; do
    [ "$p" = "$own" ] && continue
    o=$(owner_of "$p")
    [ -n "$o" ] && [ -f "$o" ] || continue

    mine=$(printf '%s\n' "$hits" | grep -- ":--${p}-")
    [ -n "$mine" ] || continue

    declared=$(grep -o -- "--${p}-[A-Za-z0-9_-]*[\"']\{0,1\}[[:space:]]*:" "$o" \
      | sed 's/[^A-Za-z0-9_-]*$//' | sort -u)

    while IFS= read -r hit; do
      [ -n "$hit" ] || continue
      ln=${hit%%:*}
      t=${hit#*:}
      case "$t" in
        *-\*)      continue ;;   # family stem: --nb-shadow-*
        "--${p}-") continue ;;   # the prefix itself, written bare
      esac
      printf '%s\n' "$declared" | grep -qx -- "$t" && continue
      printf '  UNDECLARED  %s:%s  %s is not declared in %s\n' "$f" "$ln" "$t" "$o"
      fail=1; xref_ok=0
    done < <(printf '%s\n' "$mine")
  done
done
[ "$xref_ok" -eq 1 ] && echo "  ok" || \
  echo "  ^ a doc names a token the doc owning that prefix does not declare"

# ------------------------------------------------------- 9. dead tokens ------
# Declared but never read through var() anywhere in the file. Not a failure: a
# scale step or a documented reference value may legitimately have no consumer.
echo "==> checking for dead tokens (warning only)"
dead_total=0
for f in "${docs[@]}"; do
  p=$(prefix_of "$f")
  [ -n "$p" ] || continue

  declared=$(grep -o -- "--${p}-[A-Za-z0-9_-]*[[:space:]]*:" "$f" \
    | sed 's/[[:space:]]*:$//' | sort -u)
  consumed=$(grep -o -- "var([[:space:]]*--${p}-[A-Za-z0-9_-]*" "$f" \
    | sed 's/^var([[:space:]]*//' | sort -u)

  dead=$(comm -23 <(lines "$declared") <(lines "$consumed"))
  n=$(printf '%s' "$dead" | grep -c . )
  if [ "$n" -gt 0 ]; then
    dead_total=$((dead_total + n))
    printf '  warn     %s: %s declared without a var() consumer\n' "$f" "$n"
    printf '%s\n' "$dead" | tr '\n' ' ' | fold -s -w 88 | sed 's/^/             /; s/[[:space:]]*$//'
    echo
  fi
done
if [ "$dead_total" -eq 0 ]; then
  echo "  ok"
else
  echo "  ---"
  printf '  %s dead token(s) across the set — review, but not a failure.\n' "$dead_total"
fi

# ---------------------------------------------------- 10. contrast figures ---
# Checks 1-9 validate structure. Nothing here validated the *numbers*, in a set
# whose README advertises measured contrast ratios, so ./check-contrast.py
# recomputes every `N:1` claim and every stated relative luminance from the
# WCAG 2.x maths. It already prints in this script's house style and exits
# non-zero on a mismatch; its output is indented one level under this heading
# and its own closing verdict dropped, because the run has one verdict and it
# is printed at the bottom of this file.
#
# python3 missing is a SKIP, and a loud one. A silent pass would mean the run
# says "All structural checks passed" while every contrast figure in the set
# went unread — the exact failure mode this check exists to remove.
echo "==> checking recomputed contrast figures (check-contrast.py)"
if [ ! -f ./check-contrast.py ]; then
  echo "  MISSING  ./check-contrast.py is not on disk — contrast figures were NOT checked"
  fail=1
elif command -v python3 >/dev/null 2>&1; then
  contrast_out=$(python3 ./check-contrast.py 2>&1)
  contrast_rc=$?
  printf '%s\n' "$contrast_out" | awk '
    $0 == "FAILED — see above." { next }
    $0 == "All contrast figures agree with the WCAG maths." { next }
    { keep[++n] = $0 }
    END {
      while (n > 0 && keep[n] ~ /^[[:space:]]*$/) n--
      for (i = 1; i <= n; i++) print (keep[i] == "" ? "" : "  " keep[i])
    }
  '
  if [ "$contrast_rc" -ne 0 ]; then
    echo "  ^ a stated contrast figure or luminance disagrees with the WCAG maths"
    fail=1
  fi
else
  echo "  SKIPPED  python3 is not on PATH — NO contrast figure in this set was checked."
  echo "  ^ this check did not run and did not pass; install python3, or run"
  echo "    ./check-contrast.py by hand before trusting the verdict below"
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "FAILED — see above."
  exit 1
fi
echo
echo "All structural checks passed."
