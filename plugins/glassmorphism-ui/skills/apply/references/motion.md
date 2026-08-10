# Glassmorphism motion

Source of truth: `docs/03-glassmorphism.md` §6 "Interaction & Motion", with the duration
and easing values from §4.

## The rule that governs everything

**Animate colour and transform, not blur radius.** Changing `backdrop-filter: blur()`
forces the compositor to re-run the blur shader over a fresh source every frame, which is
the single most expensive thing you can do with this style. Changing `background-color`
alpha is nearly free.

## Tokens

| Token | Doc name | Value | Use |
|---|---|---|---|
| `--um-glassmorphism-dur-base` | `--glass-dur-in` | `180ms` | Enter |
| `--um-glassmorphism-dur-fast` | `--glass-dur-out` | `120ms` | Exit |
| `--um-glassmorphism-dur-slow` | `--glass-dur-blur` | `260ms` | Blur-radius transitions **on mount only** |
| `--um-glassmorphism-ease-standard` | `--glass-ease` | `cubic-bezier(0.2, 0, 0, 1)` | Standard |
| `--um-glassmorphism-ease-exit` | `--glass-ease-out` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Exit |

The press duration, `90ms`, is stated in §6's Active row and has no token in §4. Emit it
inline with a comment, per the group-vocabulary rule that a concept with no group gets a
value inline rather than an invented token.

## State table

| State | Treatment | Values |
|---|---|---|
| Rest | Ladder defaults | fill α per elevation, border 0.16–0.30 |
| Hover | Raise fill alpha ~35%, raise border alpha ~50% | `0.10 → 0.14`, border `0.22 → 0.34`; `180ms` `cubic-bezier(0.2,0,0,1)` |
| Active / pressed | Slight depress, no blur change | `transform: translateY(1px) scale(0.985)`; `90ms` |
| Focus-visible | Solid 2px ring **plus** a dark halo | `outline: 2px solid #fff; outline-offset: 2px; box-shadow: 0 0 0 5px rgba(0,0,0,0.55)` — the halo is what makes a white ring survive a white backdrop |
| Selected | Border to accent, fill +1 rung, add 3px left/inset accent bar | `border-color: var(--glass-accent)` |
| Disabled | Drop to elevation 0, remove border highlight, `opacity` on the **content only** | content `opacity: 0.5`; do not put `opacity` on the glass element itself — that makes it a backdrop root and kills the blur |
| Loading | Shimmer inside the scrim, not across the glass | 1.2s linear translate of a `linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent)` |
| Error | Border to `#ff6b81` at 0.55 alpha, fill +1 rung, keep blur | never signal by transparency alone |

Two of these rows are refusals in disguise. The Disabled row is doc §13 anti-pattern 7 —
`opacity < 1` on the glass element or any ancestor silently kills the blur, so disabled
state goes on the content. The Error row is anti-pattern 11 — state may never be carried
by transparency, blur or shadow alone, so the accent border is accompanied by text and
ARIA.

## Enter and exit

Popovers and modals: fade `opacity 0 → 1` **and** `translateY(6px → 0)` plus
`scale(0.98 → 1)` over `180ms`; exit over `120ms`.

A blur "wake-up" is permitted **once, on mount only** — `transition: backdrop-filter 260ms`
on entry is acceptable. On hover it is not, and the scanner treats a `transition` or
`animation` naming `backdrop-filter` on any interactive selector as an error.

## Never animate

- The grain layer. It flickers.
- `backdrop-filter` on scroll.
- The ground gradient position on scroll. Use `background-attachment: fixed` and let the
  compositor handle it — or better, do not move it.
- `border-radius`.

## `prefers-reduced-motion: reduce`

Collapse all durations to `1ms` rather than removing transitions — removing them causes
state-change flashes. Then:

- Drop the `translateY` and `scale` components entirely.
- Keep the opacity crossfade.
- Stop any shimmer.
- Switch `background-attachment: fixed` to `scroll`. Parallax-feeling grounds are a
  vestibular trigger, and fixed attachment is also a scroll-performance liability on iOS
  Safari.

The reduced-motion block must not remove a state-carrying property; it only zeroes
durations and removes the transform components. `ui-morphism-core:a11y-validate` checks
that separation as one of its nine universal checks.
