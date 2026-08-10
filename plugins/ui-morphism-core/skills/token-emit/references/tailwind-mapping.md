# Tailwind v4 mapping

Source of truth: [`docs/00-comparison-matrix.md` §7.4 Rule 4](https://github.com/Shubham7995/ui-morphism/blob/main/docs/00-comparison-matrix.md).

Tailwind v4 generates utilities from theme variables by namespace. The mapping from our group vocabulary to those namespaces is mechanical, so `scripts/emit.mjs` performs it rather than asking a style skill to remember it.

## The table

| Group | Tailwind v4 namespace | Generated custom property | Utilities it produces |
|---|---|---|---|
| `bg`, `surface`, `ink`, `border`, `accent`, `danger` | `--color-*` | `--color-um-<style>-<group>[-<variant>]` | `bg-*`, `text-*`, `border-*`, `fill-*`, `ring-*` |
| `radius` | `--radius-*` | `--radius-um-<style>-<variant>` | `rounded-*` |
| `shadow` | `--shadow-*` | `--shadow-um-<style>-<step>` | `shadow-*` |
| `blur` | `--blur-*` | `--blur-um-<style>-<step>` | `blur-*`, `backdrop-blur-*` |
| `space` | `--spacing-*` | `--spacing-um-<style>-<step>` | `p-*`, `m-*`, `gap-*` |
| `text` | `--text-*` | `--text-um-<style>-<step>` | `text-*` |
| `font` | `--font-*` | `--font-um-<style>-<variant>` | `font-*` |
| `weight` | `--font-weight-*` | `--font-weight-um-<style>-<variant>` | `font-*` |
| `leading` | `--leading-*` | `--leading-um-<style>-<variant>` | `leading-*` |
| `tracking` | `--tracking-*` | `--tracking-um-<style>-<variant>` | `tracking-*` |
| `dur` | `--transition-duration-*` | `--transition-duration-um-<style>-<variant>` | `duration-*` |
| `ease` | `--ease-*` | `--ease-um-<style>-<variant>` | `ease-*` |
| `elev`, `saturate`, `noise`, `focus`, `target` | none | plain custom property in `:root` | consumed via `var()` or an `@utility` |

The last row is not a gap. Those five groups have no Tailwind namespace to map onto, so the emitter puts them in an ordinary `:root` block *outside* `@theme` and they are consumed with `var()`. Putting them inside `@theme` would generate nothing and imply a utility that does not exist.

## `@theme` is never nested inside an at-rule

```css
@import "tailwindcss";

/* Correct. Top level, never inside @media, @layer, @supports or anything else. */
@theme {
  --color-um-brutalism-bg: #fef6e4;
  --color-um-brutalism-ink: #0a0a0a;
  --color-um-brutalism-border: #000000;
  --radius-um-brutalism-md: 0px;
  --shadow-um-brutalism-2: 4px 4px 0 0 var(--color-um-brutalism-border);
  --spacing-um-brutalism-4: 16px;
  --ease-um-brutalism-standard: cubic-bezier(0.2, 0, 0, 1);
  --transition-duration-um-brutalism-base: 150ms;
}

/* Theme switching happens outside @theme, on ordinary selectors. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-um-brutalism-bg: #101010;
    --color-um-brutalism-border: #f5f0e6; /* never #000 on a dark surface: ~1.6:1 */
  }
}

:root[data-theme="dark"] {
  --color-um-brutalism-bg: #101010;
  --color-um-brutalism-border: #f5f0e6;
}
```

`@theme` declares the *design system*. It is processed once, at build time, to decide which utility classes exist. Nesting it inside a media query does not make the utilities conditional — it makes the emitted sheet wrong in a way that often still looks right in the browser during light mode, which is why this survives review. `emit.mjs` exports `assertThemeNotNested(css)` and runs it on its own output before returning.

Theme *values* switch on ordinary selectors, in the same three-block shape as the vanilla CSS output, referring to the generated `--color-um-*` names rather than the `--um-*` names.

## Why the mapping is mechanical rather than per-style

A mechanical group-to-namespace mapping puts every border token in one greppable place. `a11y-validate` can then check all ten styles' `border-strong` tokens, in both themes, with a single pass over `--color-um-*-border-strong`. A hand-written mapping in each style plugin would make that pass ten passes with ten sets of assumptions, and the one style that spelled it `--color-um-brutalism-borderStrong` would silently drop out of the audit.
