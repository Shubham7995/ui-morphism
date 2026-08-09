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
#      is also held against a per-doc row-coverage RATCHET — a no-regression
#      baseline, NOT a coverage guarantee; see the note at the check itself
#   6. theme-selector discipline: guarded `:root[data-theme=…]`, never a bare one
#   7. the `target`-group token is referenced by name in §7, not restated as px
#   8. every markdown file quotes only tokens the doc owning that prefix declares
#   9. dead tokens: declared but never consumed by a var() (warning only)
#  10. every contrast figure recomputes from the WCAG maths (check-contrast.py).
#      If python3 is absent the figures go unchecked, and an unchecked set is a
#      failure, not a pass — the run reports SKIPPED and exits non-zero
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

# COMMITTED §4 ROW-COVERAGE BASELINE for check 5, in permille — the measured
# ratio of "§4 table rows naming at least one token" to "distinct properties the
# §4 CSS declares". This is a RATCHET: a doc may not drop below its own recorded
# figure (less ROW_SLACK), and when a doc rises the check prints a `ratchet` note
# asking for the number here to be raised. It is not a skip-list — a doc with no
# entry FAILS. Re-measure and edit the number here; never lower one silently.
#
# See the long note at check 5 for why this is per-doc rather than one global
# floor, and for exactly what it does and does not guarantee.
row_baseline_of() {
  case "$1" in
    01-*) echo 426  ;;   # 26 rows / 61 declared
    02-*) echo 689  ;;   # 40 / 58
    03-*) echo 565  ;;   # 26 / 46
    04-*) echo 514  ;;   # 35 / 68
    05-*) echo 500  ;;   # 35 / 70
    06-*) echo 591  ;;   # 42 / 71
    07-*) echo 370  ;;   # 23 / 62
    08-*) echo 787  ;;   # 37 / 47
    09-*) echo 1000 ;;   # 42 / 42
    10-*) echo 551  ;;   # 32 / 58
    *)    echo ''   ;;
  esac
}

# Permille of churn tolerated below a baseline before the ratchet bites. Derived
# from the measurements, not from the current minimum. Two edits have to be told
# apart, and 25 is the width that separates them:
#
#   * RETIRING a token — dropping it from the table AND from the §4 CSS — is
#     ordinary churn. Both terms fall, so the ratio barely moves: at most 10
#     permille per token across the ten docs (worst cases 01, 03, 07). 25
#     absorbs two retirements on every doc, and in practice 2-4 before firing
#     (doc 09, at 42/42, stays at 1.000 however many it retires).
#   * BLANKING a row — prosifying a Token cell while the property stays declared
#     — is the regression this exists to catch. Only the numerator falls, so it
#     moves the ratio 2-24x harder. Measured, every one of the ten docs absorbs
#     exactly one blanked row and fires on the second. That uniformity is the
#     point: the old global floor let doc 07 blank 7 rows and doc 09 blank 31.
#
# This is not a floor on coverage; it is the deadband around a doc's own figure.
ROW_SLACK=25

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

  # ROW-COVERAGE RATCHET — a no-regression baseline, NOT a coverage guarantee.
  #
  # The numerator counts table ROWS that name at least one real token, not
  # unique names. A row is the unit the table is written in; unique names let a
  # multi-token cell carry the whole column. Doc 02 spends 58 names over 40
  # rows, so a unique-name numerator over-reported it by 45% and the check could
  # be walked past by prosifying rows whose neighbours named two apiece.
  #
  # Row coverage across the ten docs, measured — rows naming a token / §4 CSS
  # declarations:
  #
  #     01 26/61 .426  02 40/58 .689  03 26/46 .565  04 35/68 .514  05 35/70 .500
  #     06 42/71 .591  07 23/62 .370  08 37/47 .787  09 42/42 1.000 10 32/58 .551
  #
  # A previous revision floored this globally at a quarter and justified the
  # looseness by claiming the 0.370–1.000 spread came from docs writing large
  # families as one stem row (`--nb-shadow-*`), which the extraction drops on
  # purpose. That claim is false, and measurably so: across all ten §4 Token
  # columns the number of cells containing a `*` is ZERO. No doc in this set
  # writes a family-stem row at all, so no doc is penalised for doing it and the
  # spread needs another explanation.
  #
  # The real driver is how many properties a doc's §4 CSS declares that its
  # table never mentions in any form. Measured, untabled declarations run 0 for
  # docs 02, 08 and 09 — which table everything they declare — up to 37 for doc
  # 01, and they are dominated by enumerated scale steps and internal derived
  # properties: `--sk-s-1…7`, `--sk-fs-100…700`, `--clay-sp-1…14`,
  # `--max-t-sm…3xl`, `--nb-space-2…8`, alongside helpers like `--sk-press-inner`
  # and `--clay-shadow-h/l/s`. Whether a doc enumerates a scale in CSS while
  # documenting only its semantic tokens is a fixed, per-doc property of how that
  # doc is built. It is stable across edits and it differs 2.7x between docs.
  #
  # That is precisely why a single global floor cannot do the job asked of it.
  # It has to bite on doc 02 at 15 naming rows (0.259) while clearing doc 07 at
  # 0.370, so it must land in (0.259, 0.370] — a band whose only landmark is the
  # current minimum. Picking a number there IS reading the tightest doc and
  # sliding underneath it, which is a suppression list with extra steps. It also
  # distributes the guarantee absurdly: at a 0.30 floor doc 07 could shed 4 of
  # 23 rows (17%) before failing while doc 09 could shed 29 of 42 (69%).
  #
  # So the floor is per-doc and committed, in row_baseline_of() above, with a
  # ROW_SLACK deadband derived from the size of one token's churn rather than
  # from the current minimum. Measured, every one of the ten docs now absorbs
  # exactly one blanked row and fails on the second — the same guarantee for all
  # ten, instead of one that scales with how loosely a doc happened to be
  # written (old global floor: 7 blanked rows for doc 07, 31 for doc 09). Doc 02
  # at 15 rows lands at 0.258 against a floor of 0.664 and fails by two and a
  # half times over.
  #
  # What this now guarantees: no doc's §4 table silently documents fewer of its
  # tokens than it did on the day the baseline was recorded. What it still does
  # NOT guarantee, and cannot: that any baseline is itself adequate. Doc 07 is
  # committed at 0.370, and 0.370 is a poor showing — the ratchet freezes that,
  # it does not fix it. A pass here means "this table has not regressed", never
  # "this table documents its token set". Only the PHANTOM half of this check
  # speaks to correctness, and it speaks about names the table prints, not about
  # names it omits.
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
  # ratio entirely — zero rows against zero declarations passed silently.
  #
  # A doc with no committed baseline FAILS. That is what keeps row_baseline_of()
  # from becoming a skip-list: adding a doc to the set without measuring it is
  # an offence, not an exemption.
  base=$(row_baseline_of "$f")
  if [ "$n_declared" -eq 0 ]; then
    printf '  NODECL   %s: §4 CSS declares no --%s-… property at all\n' "$f" "$p"
    fail=1; tokens_ok=0
  elif [ -z "$base" ]; then
    printf '  NOBASELINE %s has no committed §4 row-coverage baseline (measured %s/%s) — add one to row_baseline_of()\n' \
      "$f" "$n_rows" "$n_declared"
    fail=1; tokens_ok=0
  else
    permille=$((n_rows * 1000 / n_declared))
    floor=$((base - ROW_SLACK))
    [ "$floor" -lt 0 ] && floor=0
    if [ "$permille" -lt "$floor" ]; then
      printf '  NONAMES  %s: only %s §4 table row(s) name a token, against %s declared properties (%d.%03d) — below the committed baseline %d.%03d less %d.%03d slack\n' \
        "$f" "$n_rows" "$n_declared" \
        "$((permille / 1000))" "$((permille % 1000))" \
        "$((base / 1000))" "$((base % 1000))" \
        "$((ROW_SLACK / 1000))" "$((ROW_SLACK % 1000))"
      fail=1; tokens_ok=0
    elif [ "$permille" -gt "$((base + ROW_SLACK))" ]; then
      printf '  ratchet  %s: §4 row coverage is now %d.%03d, above its committed baseline %d.%03d — raise it in row_baseline_of()\n' \
        "$f" "$((permille / 1000))" "$((permille % 1000))" \
        "$((base / 1000))" "$((base % 1000))"
    fi
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
# python3 missing means the check did not run, and a check that did not run did
# not pass: it is reported as SKIPPED and it FAILS the run. Printing a loud skip
# and then exiting 0 was the same silent pass in louder type — CI reads the exit
# code, not the log, so every contrast figure in the set went unread while the
# build stayed green. That is the exact failure mode this check exists to remove.
# An environment without python3 cannot verify these numbers and must say so in
# the only channel CI listens to.
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
  echo "  ^ this check did not run, so it did not pass, and the run FAILS. Install"
  echo "    python3, or run ./check-contrast.py by hand under an interpreter you"
  echo "    do have and re-run this script before trusting any verdict"
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "FAILED — see above."
  exit 1
fi
echo
echo "All structural checks passed."
