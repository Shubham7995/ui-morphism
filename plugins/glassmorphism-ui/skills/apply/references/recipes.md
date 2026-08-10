# Glassmorphism recipes — condensed

Source of truth: `docs/03-glassmorphism.md` §5 "Implementation Recipes". The code blocks
below are reproduced from that section unchanged; the prose is condensed. Read this file
before emitting any component. Do not reconstruct these patterns from memory — the
ordering of the `@supports` block, the prefix pairing and the grain layer's stacking
context are all load-bearing.

**The two gotchas that break this more often than anything else.**

1. `backdrop-filter` samples the **backdrop root**. Any ancestor with `opacity < 1`,
   `filter`, `mask`, `clip-path`, `mix-blend-mode`, or a matching `will-change` becomes a
   backdrop root — the blur then only samples content inside that ancestor and the panel
   looks flat. Run `scripts/glass-scan.mjs` to find them.
2. The element must have a **translucent** `background`. A fully opaque background hides
   the blurred backdrop entirely, and the effect silently does nothing.

---

## 1. Vanilla CSS — the reference implementation

Complete and runnable: the vivid ground, the opaque baseline, the `@supports`
enhancement, the grain layer, the masked gradient hairline, the control surface, and all
four accessibility escape hatches.

### Markup

```html
<div class="glass-stage">
  <section class="glass glass--2">
    <h2 class="glass__title">Deploy preview</h2>
    <p class="glass__body">Build 4c91f2 finished in 42s. 3 routes changed.</p>
    <button class="glass-btn" type="button">Promote to production</button>
  </section>
</div>

<!-- One inline SVG, reused by every glass surface on the page. -->
<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
  <filter id="glass-grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
</svg>
```

One inline SVG per page, reused by every glass surface. Never one per component.

### Stylesheet

```css
/* 1 — The ground. Glass is invisible without one. */
.glass-stage {
  min-height: 100svh;
  padding: 48px;
  display: grid;
  place-items: center;
  background-color: var(--glass-ground-base);
  background-image:
    radial-gradient(60rem 40rem at 12% 18%, color-mix(in oklab, var(--glass-ground-1) 70%, transparent), transparent 60%),
    radial-gradient(50rem 36rem at 88% 24%, color-mix(in oklab, var(--glass-ground-2) 70%, transparent), transparent 62%),
    radial-gradient(46rem 34rem at 50% 96%, color-mix(in oklab, var(--glass-ground-3) 60%, transparent), transparent 60%);
  background-attachment: fixed;
}

/* 2 — Opaque baseline. This is what every browser gets first. */
.glass {
  position: relative;
  isolation: isolate;
  max-width: 30rem;
  padding: 24px;
  border-radius: var(--glass-r-md);
  border: 1px solid var(--glass-border-color);
  background-color: var(--glass-solid-2);
  color: var(--glass-fg);
  box-shadow: var(--glass-shadow-2), var(--glass-inner-top), var(--glass-inner-bottom);
}

/* 3 — Progressive enhancement. Only browsers that can actually blur
      get the translucent fill, so unsupported browsers never render
      unreadable low-alpha text panels. */
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass {
    background-color: var(--glass-fill-1);
    -webkit-backdrop-filter: var(--glass-backdrop-1);
    backdrop-filter: var(--glass-backdrop-1);
  }
  .glass--2 {
    background-color: var(--glass-fill-2);
    -webkit-backdrop-filter: var(--glass-backdrop-2);
    backdrop-filter: var(--glass-backdrop-2);
  }
  .glass--4 {
    background-color: var(--glass-fill-4);
    -webkit-backdrop-filter: var(--glass-backdrop-4);
    backdrop-filter: var(--glass-backdrop-4);
    border-radius: var(--glass-r-xl);
    box-shadow: var(--glass-shadow-3), var(--glass-inner-top);
  }
}

/* 4 — Grain. Sits above the fill, below the content. */
.glass::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  filter: url(#glass-grain);
  opacity: var(--glass-noise-opacity);
  pointer-events: none;
  /* Grain must not be a backdrop root itself — no opacity on the parent. */
}

/* 5 — Gradient hairline. Replaces the flat border with a lit edge.
      mask-composite carves the interior out of a 1px-padded gradient box. */
.glass--lit {
  border-color: transparent;
}
.glass--lit::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.10) 42%,
    rgba(255, 255, 255, 0.05) 58%,
    rgba(255, 255, 255, 0.30) 100%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.glass__title { margin: 0 0 6px; font: 600 20px/1.25 system-ui, sans-serif; }
.glass__body  { margin: 0 0 20px; font: 400 15px/1.55 system-ui, sans-serif; color: var(--glass-fg-muted); }

/* 6 — Controls on glass get their own, stronger surface. */
.glass-btn {
  appearance: none;
  padding: 10px 18px;
  border-radius: var(--glass-r-pill);
  border: 1px solid var(--glass-border-strong);
  background: var(--glass-fill-3);
  color: var(--glass-fg);
  font: 600 14px/1 system-ui, sans-serif;
  cursor: pointer;
  transition:
    background-color var(--glass-dur-in) var(--glass-ease),
    border-color var(--glass-dur-in) var(--glass-ease),
    transform var(--glass-dur-in) var(--glass-ease);
}
.glass-btn:hover { background: var(--glass-fill-4); border-color: rgba(255, 255, 255, 0.46); }
.glass-btn:active { transform: translateY(1px) scale(0.985); }
.glass-btn:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.55);
}

/* 7 — Accessibility escape hatches. All three are mandatory. */
@media (prefers-reduced-transparency: reduce) {
  .glass, .glass--2, .glass--4 {
    background-color: var(--glass-solid-2);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
  .glass::after { display: none; }
}

@media (prefers-contrast: more) {
  .glass, .glass--2, .glass--4 {
    background-color: var(--glass-solid-1);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    border-color: var(--glass-fg);
  }
  .glass__body { color: var(--glass-fg); }
}

@media (forced-colors: active) {
  .glass, .glass--2, .glass--4, .glass-btn {
    background-color: Canvas;
    color: CanvasText;
    border: 1px solid CanvasText;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
    forced-color-adjust: none;
  }
  .glass::after, .glass--lit::before { display: none; }
  .glass-btn:focus-visible { outline: 2px solid Highlight; }
}

@media (prefers-reduced-motion: reduce) {
  .glass-btn { transition-duration: 1ms; }
  .glass-stage { background-attachment: scroll; }
}
```

Blocks 1, 4, 6 and 7 of this stylesheet — the ground, the grain, the focus ring and the
accessibility hatches — ship pre-assembled as `../assets/glass.layer.css`, wrapped in
`@layer glass` and extended with the ground-clamping modifier, `scroll-margin-top`, the
`[data-transparency="reduced"]` hook and the print block that doc §13 requires. Emit that
file rather than retyping these blocks; what stays with the components is blocks 2, 3 and
5, because those are where the project's own selectors live.

**Numbered order matters.** Block 2 (opaque baseline) must precede block 3 (`@supports`),
or a browser without `backdrop-filter` renders unreadable text on a see-through box.
Block 4 (grain) sits above the fill and below the content at `z-index: -1` inside an
`isolation: isolate` context — it must not itself become a backdrop root, which is why
there is no `opacity` on the parent. Block 5 (`.glass--lit`) is optional: it replaces the
flat border with a lit gradient hairline by carving the interior out of a 1px-padded
gradient box with `mask-composite`. Block 7's three media blocks are **mandatory**, not
optional polish.

---

## 2. Tailwind CSS v4

Tailwind v4 ships `backdrop-blur-{xs,sm,md,lg,xl,2xl,3xl}` mapping to
`4px / 8px / 12px / 16px / 24px / 40px / 64px`, plus `backdrop-saturate-*`. No plugin is
required for the core effect. A plugin is only worth it if you want a single `glass-2`
class instead of a six-utility string.

The `@theme` block and the `glass-*` composite utility ship as
`../assets/tokens.theme.css`. Emit that file, then use it:

```html
<!-- Composite -->
<nav class="glass-2 sticky top-4 mx-auto flex w-[min(64rem,92vw)] items-center
            gap-6 px-6 py-3 text-white/90">
  <span class="font-semibold">Aperture</span>
  <a class="text-white/70 hover:text-white transition-colors duration-150" href="#">Docs</a>
  <a class="text-white/70 hover:text-white transition-colors duration-150" href="#">Pricing</a>
</nav>

<!-- Raw utilities, no plugin, no custom theme.
     Outer drop shadow and inner highlight are ONE declaration: `shadow-[…]` and
     `[box-shadow:…]` both write box-shadow, and the arbitrary-property utility
     wins, so stacking them silently deletes the elevation.
     The `not` keyword in an @supports condition needs a following space, which
     in Tailwind's arbitrary-variant syntax is written as an underscore. -->
<div class="rounded-2xl border border-white/20 bg-white/10
            backdrop-blur-lg backdrop-saturate-150
            [box-shadow:0_8px_32px_-8px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.35)]
            supports-[not_(backdrop-filter:blur(1px))]:bg-slate-800
            motion-reduce:transition-none
            p-6 text-white/90">
  Frosted card
</div>

<!-- Arbitrary blur value when the ladder does not fit -->
<div class="backdrop-blur-[18px] backdrop-saturate-[165%] bg-white/12 rounded-2xl
            border border-white/20 p-6 text-white/90">
  Off-ladder card
</div>
```

Three Tailwind-specific traps, all from doc §5:

- The `supports-[not_(backdrop-filter:blur(1px))]` variant must generate
  `@supports not (backdrop-filter: blur(1px))` **with a space after `not`**, or the whole
  at-rule is invalid CSS and the opaque fallback never applies. Tailwind turns the
  underscore into that space. If you would rather not depend on that, keep the plain
  `@supports` block from the vanilla recipe — it is the more reliable route.
- `shadow-[…]` and `[box-shadow:…]` both write `box-shadow`, and the arbitrary-property
  utility wins. Stacking them silently deletes the elevation. Outer drop shadow and inner
  highlight are **one** declaration.
- `motion-reduce:` and `contrast-more:` variants are built in. `prefers-reduced-transparency`
  has no built-in variant as of v4 — declare it in the `@utility`/`@layer` CSS.

---

## 3. React component

TypeScript, no dependencies beyond React. Props drive elevation, intensity, tone and the
interactive affordance; the component injects its stylesheet once and renders a single
shared grain filter.

Every custom property this component writes is a `--glass-*` name from §4. The four
per-instance values it computes (`--glass-fill`, `--glass-fill-hover`, `--glass-blur`,
`--glass-radius`) are resolved rungs of the §4 ladders, and each falls back to the §4
`:root` value when rendered without inline vars — so theming `--glass-*` at the app root
really does re-theme `<GlassSurface>`. It declares no prefix of its own. Preserve that
property when you extend it.

```tsx
// GlassSurface.tsx
import * as React from "react";

export type GlassElevation = 0 | 1 | 2 | 3 | 4;
export type GlassTone = "light" | "dark";

export interface GlassSurfaceProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "style"> {
  /** Depth in the glass ladder. Drives fill alpha, blur radius and shadow. */
  elevation?: GlassElevation;
  /** 0–100. Scales fill alpha and blur around the elevation defaults. */
  intensity?: number;
  /** "light" = white tint (for dark grounds). "dark" = ink tint (for light grounds). */
  tone?: GlassTone;
  /** Corner radius in px. */
  radius?: number;
  /** Adds the SVG grain layer. */
  grain?: boolean;
  /** Adds hover/active feedback. Only set on genuinely interactive surfaces. */
  interactive?: boolean;
  /** Wraps children in a higher-opacity scrim so body text is guaranteed readable. */
  textScrim?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

const FILL_ALPHA: Record<GlassElevation, number> = { 0: 0.06, 1: 0.1, 2: 0.14, 3: 0.18, 4: 0.24 };
const BLUR_PX: Record<GlassElevation, number> = { 0: 8, 1: 12, 2: 20, 3: 28, 4: 40 };
const BORDER_ALPHA: Record<GlassElevation, number> = { 0: 0.12, 1: 0.16, 2: 0.22, 3: 0.26, 4: 0.3 };
const SHADOW: Record<GlassElevation, string> = {
  0: "none",
  1: "0 1px 2px rgba(0,0,0,0.16)",
  2: "0 8px 32px -8px rgba(0,0,0,0.38)",
  3: "0 8px 32px -8px rgba(0,0,0,0.38)",
  4: "0 24px 64px -16px rgba(0,0,0,0.48)",
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const STYLE_ID = "glass-surface-styles";

/* One token layer for the whole doc. This sheet declares NO new prefix: every
   custom property below is a `--glass-*` name from §4. The four per-instance
   values the component computes (`--glass-fill`, `--glass-fill-hover`,
   `--glass-blur`, `--glass-radius`) are the resolved rungs of the §4 ladders,
   and each one falls back to the §4 `:root` value when the component is
   rendered without inline vars — so theming `--glass-*` at the app root really
   does re-theme <GlassSurface>. */
const CSS = `
.gs{position:relative;isolation:isolate;
  color:var(--glass-fg, rgba(255,255,255,0.94));
  border-style:solid;border-width:1px;
  background-color:var(--glass-solid, var(--glass-solid-2, #1d2130));
  transition:background-color var(--glass-dur-in,180ms) var(--glass-ease,cubic-bezier(.2,0,0,1)),
             border-color var(--glass-dur-in,180ms) var(--glass-ease,cubic-bezier(.2,0,0,1)),
             transform var(--glass-dur-in,180ms) var(--glass-ease,cubic-bezier(.2,0,0,1)),
             box-shadow var(--glass-dur-in,180ms) var(--glass-ease,cubic-bezier(.2,0,0,1));}
@supports ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
  .gs{background-color:var(--glass-fill, var(--glass-fill-1));
      -webkit-backdrop-filter:blur(var(--glass-blur, var(--glass-blur-1))) saturate(var(--glass-saturate,160%));
      backdrop-filter:blur(var(--glass-blur, var(--glass-blur-1))) saturate(var(--glass-saturate,160%));}
}
.gs__grain{position:absolute;inset:0;z-index:-1;border-radius:inherit;
  filter:url(#glass-grain);opacity:var(--glass-noise-opacity,0.035);pointer-events:none;}
.gs__scrim{position:relative;border-radius:calc(var(--glass-radius, var(--glass-r-md,16px)) - 6px);
  background:var(--glass-text-scrim);padding:12px 14px;}
.gs--i:hover{background-color:var(--glass-fill-hover, var(--glass-fill-2));
  border-color:var(--glass-border-strong);}
.gs--i:active{transform:translateY(1px) scale(.99);}
.gs--i:focus-visible{outline:2px solid #fff;outline-offset:2px;
  box-shadow:0 0 0 5px rgba(0,0,0,.55);}
@media (prefers-reduced-motion:reduce){.gs{transition-duration:1ms}.gs--i:active{transform:none}}
@media (prefers-reduced-transparency:reduce),(prefers-contrast:more){
  .gs{background-color:var(--glass-solid, var(--glass-solid-2, #1d2130))!important;
      -webkit-backdrop-filter:none!important;backdrop-filter:none!important;}
  .gs__grain{display:none}
  .gs__scrim{background:transparent;padding:0}
}
@media (forced-colors:active){
  .gs{background-color:Canvas!important;color:CanvasText;border-color:CanvasText;
      box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}
  .gs__grain{display:none}
  .gs--i:focus-visible{outline:2px solid Highlight}
}
`;

function useGlassStyles(): void {
  React.useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Render exactly once per app, near the root. */
export function GlassGrainFilter(): React.JSX.Element {
  return (
    <svg width={0} height={0} aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <filter id="glass-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={4} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
  );
}

export function GlassSurface({
  elevation = 1,
  intensity = 50,
  tone = "light",
  radius = 16,
  grain = true,
  interactive = false,
  textScrim = false,
  as = "div",
  className,
  children,
  style,
  ...rest
}: GlassSurfaceProps): React.JSX.Element {
  useGlassStyles();

  const k = clamp(intensity, 0, 100) / 50; // 1.0 at the default of 50
  const isLight = tone === "light";
  const rgb = isLight ? "255,255,255" : "15,18,28";

  const alpha = clamp(FILL_ALPHA[elevation] * k, 0.04, isLight ? 0.3 : 0.72);
  const blur = Math.round(clamp(BLUR_PX[elevation] * k, 4, 48));
  const border = clamp(BORDER_ALPHA[elevation] * k, 0.1, 0.42);
  const sat = Math.round(clamp(100 + 60 * k, 100, 200));

  // Every key here is a §4 `--glass-*` name. Anything the component does not
  // compute is deliberately absent, so the app-level `:root` value shows
  // through — that is the bridge between the documented token layer and this
  // component.
  const vars = {
    "--glass-fill": `rgba(${rgb},${alpha.toFixed(3)})`,
    "--glass-fill-hover": `rgba(${rgb},${clamp(alpha * 1.35, 0.06, isLight ? 0.36 : 0.8).toFixed(3)})`,
    "--glass-solid": isLight ? "#1d2130" : "#ffffff",
    "--glass-fg": isLight ? "rgba(255,255,255,0.94)" : "rgba(12,14,22,0.94)",
    "--glass-text-scrim": isLight ? "rgba(9,9,14,0.56)" : "rgba(255,255,255,0.72)",
    "--glass-blur": `${blur}px`,
    "--glass-saturate": `${sat}%`,
    "--glass-noise-opacity": grain ? "0.035" : "0",
    "--glass-radius": `${radius}px`,
    "--glass-border-strong": `rgba(${rgb},${clamp(border * 1.5, 0.12, 0.55).toFixed(3)})`,
    borderRadius: `${radius}px`,
    borderColor: `rgba(${rgb},${border.toFixed(3)})`,
    boxShadow:
      SHADOW[elevation] === "none"
        ? `inset 0 1px 0 rgba(255,255,255,${isLight ? 0.35 : 0.6})`
        : `${SHADOW[elevation]}, inset 0 1px 0 rgba(255,255,255,${isLight ? 0.35 : 0.6})`,
    ...style,
  } as React.CSSProperties;

  const Tag = as as React.ElementType;

  return (
    <Tag
      className={["gs", interactive ? "gs--i" : "", className].filter(Boolean).join(" ")}
      style={vars}
      {...rest}
    >
      {grain ? <span className="gs__grain" aria-hidden="true" /> : null}
      {textScrim ? <div className="gs__scrim">{children}</div> : children}
    </Tag>
  );
}
```

### Usage

```tsx
// Usage
import { GlassSurface, GlassGrainFilter } from "./GlassSurface";

export default function App() {
  return (
    <>
      <GlassGrainFilter />
      <GlassSurface as="nav" elevation={2} intensity={55} radius={999}
                    style={{ padding: "10px 20px", display: "flex", gap: 20 }}>
        <strong>Aperture</strong>
        <a href="#docs">Docs</a>
      </GlassSurface>

      <GlassSurface elevation={1} intensity={40} radius={16} textScrim
                    style={{ padding: 24, maxWidth: 420 }}>
        <h2 style={{ margin: 0 }}>Weekly digest</h2>
        <p style={{ margin: "6px 0 0" }}>12 new issues, 4 closed.</p>
      </GlassSurface>
    </>
  );
}
```

`GlassGrainFilter` renders exactly once per app, near the root. Rendering it per surface
duplicates the filter id and is the most common porting mistake.

---

## 4. SwiftUI

Apple has shipped a first-class material system since iOS 15 / macOS 12, and it is
strictly better than hand-rolling a blur because it handles vibrancy, Reduce Transparency
and Increase Contrast for you.

```swift
import SwiftUI

struct GlassCard<Content: View>: View {
    var cornerRadius: CGFloat = 16
    /// .ultraThinMaterial … .thickMaterial map to the glassmorphism elevation ladder.
    var material: Material = .regularMaterial
    @ViewBuilder var content: Content

    // Honour the system accessibility switches explicitly.
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        content
            .padding(20)
            .background {
                if reduceTransparency {
                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(colorScheme == .dark ? Color(white: 0.11) : Color.white)
                } else {
                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(material)
                }
            }
            .overlay {
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(
                        LinearGradient(
                            colors: [.white.opacity(0.45), .white.opacity(0.08)],
                            startPoint: .topLeading, endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            }
            .shadow(color: .black.opacity(0.28), radius: 24, x: 0, y: 10)
    }
}

struct Stage: View {
    var body: some View {
        ZStack {
            LinearGradient(colors: [.purple, .cyan, .pink],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()

            GlassCard(cornerRadius: 22, material: .thinMaterial) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Deploy preview").font(.headline)
                    Text("Build 4c91f2 · 42s").font(.subheadline).foregroundStyle(.secondary)
                }
            }
            .frame(maxWidth: 360)
        }
    }
}
```

**Material ladder mapping.** `.ultraThinMaterial` → elevation 0–1, `.thinMaterial` → 1–2,
`.regularMaterial` → 2–3, `.thickMaterial` → 4, `.bar` → toolbars and tab bars. All are
iOS 15+ / macOS 12+. On iOS 26 and later, `.glassEffect(_:in:)`, `GlassEffectContainer`
and `glassEffectID(_:in:)` supersede these for chrome — that is Liquid Glass territory
(`docs/08-liquid-glass.md`; no plugin for it yet), not here. Use `Material` for content surfaces and
`glassEffect` for floating controls.

---

## 5. Other platforms — what to emit, and what to refuse

**Windows / WinUI.** Use `AcrylicBrush` / `DesktopAcrylicBackdrop` rather than a custom
blur. Microsoft's guidance is worth importing into web work verbatim: acrylic only on
**transient** surfaces (flyouts, menus, light-dismiss popups); opaque background for
persistent vertical panes; never two acrylic panes edge to edge (visible seam); never
accent-coloured text on acrylic, because it will not clear the minimum contrast ratio at
the default 14px size. Windows falls back to solid automatically in High Contrast, under
Battery Saver, when *Transparency effects* is off, and on low-end hardware.

**Android / Jetpack Compose.** There is no Compose-native equivalent to `backdrop-filter`.
The platform capability is `RenderEffect.createBlurEffect(...)` with `View.setRenderEffect`
(API 31+), and `Window.setBackgroundBlurRadius` for blurring behind a window (API 31+, and
only when the system reports blurs enabled — it is disabled under battery saver and on
many low-tier devices). Inside Compose the pragmatic route in 2026 is the community `Haze`
library; treat it as an external dependency, gate it behind a capability check, and ship
an opaque fallback.

**React Native.** `backdrop-filter` is not supported. Use `expo-blur`'s `BlurView`
(`intensity` 0–100, `tint` light/dark/default) on Expo, or `@react-native-community/blur`
on bare RN. Both are real native blur views on iOS and best-effort on Android. Always
render an opaque `View` fallback when `AccessibilityInfo.isReduceTransparencyEnabled()`
returns true.

**Figma.** Layer blur blurs the layer itself; **Background blur** is the `backdrop-filter`
equivalent, and it only works when the fill alpha is below 100%. Build the panel as a
component with variants for elevation 0–4 and bind fill/blur to variables so the ladder
stays consistent between design and code.

---

## 6. Component set this skill emits

Doc §13 output 2. Seven components, each with the `@supports` fallback and the
accessibility layer baked in.

| Component | Rung | Notes |
|---|---|---|
| `GlassSurface` | any | The primitive above. Everything else composes it. |
| `GlassNav` | 2 | `position: sticky`. Blur hard-capped at 20px — it is scroll-pinned. Sets `scroll-margin-top` on focusable descendants equal to its own height (SC 2.4.11). |
| `GlassCard` | 1 | Content goes on a scrim or on a clamped ground, never bare. |
| `GlassPopover` | 3 | Transient. This is the surface class glass is actually *for*. |
| `GlassModal` | 4 | `<dialog>` or `aria-modal="true"` with a focus trap and an inert background. Blur capped at 24px if it covers the viewport, paired with a ≥ 0.45 alpha scrim. |
| `GlassButton` | 3 fill, hover to 4 | Two-tone focus ring. Target ≥ 44px. |
| `GlassInput` | **opaque field on a glass container** | The field itself is solid with a border solved to 3:1. See below. |

**`GlassInput` is deliberately not glass.** Doc §13 output 2 lists it, and doc §13
anti-pattern 4 forbids glass on `<input>`, `<textarea>` and `<select>`; §9 says form
fields and their validation state are a "do not use" context because the boundary must
satisfy 1.4.11 against an unknowable backdrop. Both hold at once: the component exists,
and what it emits is an **opaque** field with a 3:1 boundary, sitting inside a glass
container. If the user asks for a translucent input, refuse under anti-pattern 4 and
offer this instead.
