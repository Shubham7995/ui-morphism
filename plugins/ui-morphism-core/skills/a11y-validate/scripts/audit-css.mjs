#!/usr/bin/env node
/**
 * audit-css.mjs — the nine universal accessibility checks, run statically over
 * a stylesheet.
 *
 * The check list is the table in docs/MARKETPLACE.md §7.3, and it is identical
 * for all ten styles. Style-specific invariants — neumorphism's same-hue rule,
 * glassmorphism's ancestor backdrop-root scan, bento's one-heading-per-tile —
 * stay in the style plugin's own checklist, because they encode style facts
 * rather than accessibility facts.
 *
 * What this file can and cannot know. Contrast between declared colours is
 * computable from CSS text. Contrast of a composited surface over an ARBITRARY
 * backdrop is computed here against the worst case, which is a bound rather
 * than a measurement of the user's actual page. Computed target size after a
 * transform, and the real backdrop a `backdrop-filter` sampled, need a rendered
 * page — those are emitted as `todo` findings naming the method, never as
 * silence.
 */

import {
  ColorError,
  contrastRatio,
  parseColor,
  passes,
  requiredTextRatio,
} from './contrast.mjs';

export class ParseError extends Error {}

/**
 * Parse a stylesheet into a tree of `{ type, ... }` nodes.
 *
 * Not a conforming CSS parser and not trying to be. It handles comments,
 * strings, nested at-rules and declarations, which is the whole surface the
 * checks below read. Anything it cannot classify is preserved as raw text so a
 * check never silently loses a rule it should have seen.
 */
export function parseCss(source) {
  const root = { type: 'root', nodes: [] };
  const stack = [root];
  let buffer = '';
  let bufferStart = 0;
  let line = 1;

  const lineOf = (index) => {
    let n = 1;
    for (let i = 0; i < index; i += 1) if (source[i] === '\n') n += 1;
    return n;
  };

  const flushDeclaration = (end) => {
    const text = buffer.trim();
    buffer = '';
    if (!text) return;
    const colon = text.indexOf(':');
    if (colon === -1) return;
    stack[stack.length - 1].nodes.push({
      type: 'declaration',
      property: text.slice(0, colon).trim(),
      value: text.slice(colon + 1).trim(),
      line: lineOf(bufferStart),
      end,
    });
  };

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '\n') line += 1;

    if (ch === '/' && source[i + 1] === '*') {
      const close = source.indexOf('*/', i + 2);
      i = close === -1 ? source.length : close + 1;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < source.length && (source[j] !== quote || source[j - 1] === '\\')) j += 1;
      buffer += source.slice(i, j + 1);
      i = j;
      continue;
    }
    if (ch === '{') {
      const prelude = buffer.trim();
      buffer = '';
      const node = prelude.startsWith('@')
        ? { type: 'atrule', name: prelude, line: lineOf(i), nodes: [] }
        : { type: 'rule', selector: prelude, line: lineOf(i), nodes: [] };
      stack[stack.length - 1].nodes.push(node);
      stack.push(node);
      bufferStart = i + 1;
      continue;
    }
    if (ch === '}') {
      flushDeclaration(i);
      if (stack.length === 1) throw new ParseError(`unbalanced "}" at line ${line}`);
      stack.pop();
      bufferStart = i + 1;
      continue;
    }
    if (ch === ';') {
      flushDeclaration(i);
      bufferStart = i + 1;
      continue;
    }
    // Leading whitespace never starts a token, so a declaration's recorded line
    // is the line its property name is on rather than the line the block opened.
    if (buffer === '' && /\s/.test(ch)) continue;
    if (buffer === '') bufferStart = i;
    buffer += ch;
  }

  if (stack.length !== 1) throw new ParseError('unclosed block at end of stylesheet');
  return root;
}

/**
 * Flatten the tree into the rules a check actually wants: a selector, its
 * declarations, and the stack of at-rules it sits inside.
 */
export function flattenRules(node, atRules = [], out = []) {
  for (const child of node.nodes ?? []) {
    if (child.type === 'atrule') {
      flattenRules(child, [...atRules, child.name], out);
    } else if (child.type === 'rule') {
      out.push({
        selector: child.selector,
        line: child.line,
        atRules,
        declarations: (child.nodes ?? [])
          .filter((n) => n.type === 'declaration')
          .map(({ property, value, line }) => ({ property, value, line })),
      });
      flattenRules(child, atRules, out);
    }
  }
  return out;
}

/* ------------------------------------------------------------ resolution */

/** Collect every custom property declared anywhere in the sheet, per theme. */
function collectCustomProperties(rules) {
  const light = new Map();
  const dark = new Map();
  for (const rule of rules) {
    const isDark =
      rule.atRules.some((a) => /prefers-color-scheme:\s*dark/.test(a)) ||
      /\[data-theme="dark"\]/.test(rule.selector) ||
      /(^|\s|\.)dark(\s|$|\.|\[)/.test(rule.selector);
    for (const decl of rule.declarations) {
      if (!decl.property.startsWith('--')) continue;
      if (isDark) dark.set(decl.property, decl.value);
      else light.set(decl.property, decl.value);
    }
  }
  return { light, dark };
}

/**
 * Resolve `var(--x, fallback)` against a property map, recursively.
 *
 * Returns `null` rather than a guess when a reference cannot be resolved: an
 * unresolvable colour is a manual TODO, not a pass.
 */
function resolveValue(value, properties, depth = 0) {
  if (depth > 12 || typeof value !== 'string') return null;
  let text = value.trim();

  // A var() can sit anywhere inside a longer value — `2px solid var(--x)` is
  // the shape every border shorthand takes — so substitute in place rather than
  // matching the whole string.
  for (let guard = 0; guard < 32; guard += 1) {
    const start = text.indexOf('var(');
    if (start === -1) return text;

    let depthParens = 0;
    let end = -1;
    for (let i = start + 3; i < text.length; i += 1) {
      if (text[i] === '(') depthParens += 1;
      else if (text[i] === ')') {
        depthParens -= 1;
        if (depthParens === 0) {
          end = i;
          break;
        }
      }
    }
    if (end === -1) return null;

    const inner = text.slice(start + 4, end);
    const comma = inner.indexOf(',');
    const name = (comma === -1 ? inner : inner.slice(0, comma)).trim();
    const fallback = comma === -1 ? undefined : inner.slice(comma + 1).trim();

    let replacement;
    if (properties.has(name)) replacement = resolveValue(properties.get(name), properties, depth + 1);
    else if (fallback !== undefined) replacement = resolveValue(fallback, properties, depth + 1);
    else return null;
    if (replacement === null) return null;

    text = text.slice(0, start) + replacement + text.slice(end + 1);
  }
  return null;
}

/** The colour of a `background`/`background-color` shorthand, or `null`. */
function backgroundColorOf(declarations, properties) {
  for (const decl of [...declarations].reverse()) {
    if (decl.property !== 'background' && decl.property !== 'background-color') continue;
    const resolved = resolveValue(decl.value, properties);
    if (resolved === null) continue;
    const token = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|\b[a-z]+\b)/.exec(resolved);
    if (!token) continue;
    try {
      parseColor(token[1]);
      return { value: token[1], line: decl.line };
    } catch (error) {
      if (!(error instanceof ColorError)) throw error;
    }
  }
  return null;
}

function declarationOf(declarations, property) {
  return [...declarations].reverse().find((d) => d.property === property) ?? null;
}

function numericPx(value) {
  const m = /^(-?\d*\.?\d+)px$/.exec(String(value).trim());
  return m ? Number(m[1]) : null;
}

/* ---------------------------------------------------------------- checks */

/**
 * Check 1 — text contrast (1.4.3).
 *
 * >= 4.5:1 normal, >= 3:1 for >= 24px or >= 18.66px bold. Unrounded, so
 * 4.497:1 fails 4.5:1. Only rules that declare BOTH a colour and a background
 * are judged; a colour whose background comes from an ancestor is not
 * computable from CSS text and becomes a `todo` rather than a silent pass.
 */
function checkTextContrast(rules, properties, file) {
  const findings = [];
  for (const rule of rules) {
    const colorDecl = declarationOf(rule.declarations, 'color');
    if (!colorDecl) continue;
    const background = backgroundColorOf(rule.declarations, properties);
    const foreground = resolveValue(colorDecl.value, properties);

    if (foreground === null || background === null) {
      findings.push({
        check: 'text-contrast',
        level: 'todo',
        file,
        line: colorDecl.line,
        selector: rule.selector,
        message:
          background === null
            ? 'declares a color with no background in the same rule — the effective background ' +
              'comes from an ancestor and is not computable from CSS text. Measure it rendered.'
            : `could not resolve "${colorDecl.value}" to a colour.`,
      });
      continue;
    }

    const fontSize = numericPx(declarationOf(rule.declarations, 'font-size')?.value) ?? 16;
    const weightDecl = declarationOf(rule.declarations, 'font-weight')?.value ?? '400';
    const fontWeight = weightDecl === 'bold' ? 700 : Number.parseInt(weightDecl, 10) || 400;
    const required = requiredTextRatio({ fontSizePx: fontSize, fontWeight });

    try {
      const ratio = contrastRatio(foreground, background.value);
      const ok = passes(ratio, required);
      findings.push({
        check: 'text-contrast',
        level: ok ? 'pass' : 'fail',
        file,
        line: colorDecl.line,
        selector: rule.selector,
        ratio,
        required,
        message:
          `${foreground} on ${background.value} measures ${ratio.toFixed(3)}:1, ` +
          `${ok ? 'clearing' : 'short of'} the ${required}:1 required at ${fontSize}px/${fontWeight}.`,
      });
    } catch (error) {
      if (!(error instanceof ColorError)) throw error;
      findings.push({
        check: 'text-contrast',
        level: 'todo',
        file,
        line: colorDecl.line,
        selector: rule.selector,
        message: `${error.message} — measure this pair by hand.`,
      });
    }
  }
  return findings;
}

/** The colour operand of a `border`/`outline` shorthand or its -color longhand. */
function boundaryColorOf(declarations, properties, kind) {
  for (const decl of [...declarations].reverse()) {
    if (decl.property !== kind && decl.property !== `${kind}-color`) continue;
    const resolved = resolveValue(decl.value, properties);
    if (resolved === null) continue;
    // A shorthand is `<width> <style> <color>`; the colour is whatever parses.
    for (const token of resolved.split(/\s+(?![^(]*\))/).reverse()) {
      try {
        parseColor(token);
        return { value: token, line: decl.line, raw: decl.value };
      } catch (error) {
        if (!(error instanceof ColorError)) throw error;
      }
    }
  }
  return null;
}

/**
 * Check 2 — non-text contrast (1.4.11).
 *
 * Every control boundary clears 3:1 against its own fill, in BOTH themes. The
 * dark theme is checked separately and explicitly, because the failure that
 * actually ships is a border colour that is correct in light mode and left
 * unchanged in dark: doc 07 §7 measures that at 1.56:1.
 */
function checkNonTextContrast(rules, properties, file) {
  const findings = [];
  for (const rule of rules) {
    const border = boundaryColorOf(rule.declarations, properties.light, 'border');
    if (!border) continue;
    const fillDecl = declarationOf(rule.declarations, 'background') ??
      declarationOf(rule.declarations, 'background-color');
    if (!fillDecl) continue;

    for (const theme of ['light', 'dark']) {
      const map = theme === 'dark' ? new Map([...properties.light, ...properties.dark]) : properties.light;
      const borderValue = boundaryColorOf(rule.declarations, map, 'border')?.value;
      const fill = backgroundColorOf(rule.declarations, map)?.value;
      if (!borderValue || !fill) continue;
      if (theme === 'dark' && properties.dark.size === 0) continue;
      try {
        const ratio = contrastRatio(borderValue, fill);
        const ok = passes(ratio, 3);
        findings.push({
          check: 'non-text-contrast',
          level: ok ? 'pass' : 'fail',
          theme,
          file,
          line: border.line,
          selector: rule.selector,
          ratio,
          required: 3,
          message:
            `${theme}: the boundary from ${border.raw} resolves to ${borderValue} against ` +
            `${fill} and measures ${ratio.toFixed(3)}:1, ${ok ? 'clearing' : 'short of'} 3:1.`,
        });
      } catch (error) {
        if (!(error instanceof ColorError)) throw error;
        findings.push({
          check: 'non-text-contrast',
          level: 'todo',
          theme,
          file,
          line: border.line,
          selector: rule.selector,
          message: `${theme}: ${error.message}`,
        });
      }
    }
  }
  return findings;
}

/** Selectors that plausibly target something focusable. */
const FOCUSABLE_RE =
  /\b(a|button|input|select|textarea|summary|details|dialog)\b|\[tabindex|:focus|\[href/i;

/**
 * Check 3 — focus visible (2.4.7, 2.4.13).
 *
 * The indicator must be an `outline`: `forced-colors: active` deletes
 * `box-shadow` entirely, so a shadow ring leaves the control with no focus
 * indicator at all in the mode where it matters most. Thickness is at least
 * 2px, an offset is expected, and `outline: none` needs a replacement in the
 * same rule.
 */
function checkFocus(rules, properties, file) {
  const findings = [];
  const focusRules = rules.filter((r) => /:focus(-visible|-within)?\b/.test(r.selector));

  if (focusRules.length === 0) {
    const focusable = rules.find((r) => FOCUSABLE_RE.test(r.selector));
    if (focusable) {
      findings.push({
        check: 'focus',
        level: 'fail',
        file,
        line: focusable.line,
        selector: focusable.selector,
        message:
          'the stylesheet styles focusable elements but declares no :focus-visible rule. ' +
          'Every focusable element needs a visible indicator (2.4.7).',
      });
    }
    return findings;
  }

  for (const rule of focusRules) {
    const outline = declarationOf(rule.declarations, 'outline');
    const outlineWidth = declarationOf(rule.declarations, 'outline-width');
    const offset = declarationOf(rule.declarations, 'outline-offset');
    const shadow = declarationOf(rule.declarations, 'box-shadow');
    const removed = outline && /^(none|0)$/.test(outline.value.trim());

    if (removed) {
      const replaced = Boolean(outlineWidth) || Boolean(declarationOf(rule.declarations, 'outline-color'));
      findings.push({
        check: 'focus',
        level: 'fail',
        file,
        line: outline.line,
        selector: rule.selector,
        message: shadow
          ? 'uses "outline: none" plus a box-shadow ring. forced-colors: active discards ' +
            'box-shadow, so this control has no focus indicator in that mode. Use outline.'
          : replaced
            ? 'sets "outline: none" and rebuilds the outline through longhands, which is ' +
              'fragile — declare the outline directly.'
            : 'sets "outline: none" with no replacement in the same rule.',
      });
      continue;
    }

    if (!outline && !outlineWidth) {
      findings.push({
        check: 'focus',
        level: shadow ? 'fail' : 'warn',
        file,
        line: rule.line,
        selector: rule.selector,
        message: shadow
          ? 'the focus indicator is a box-shadow, which forced-colors: active deletes. ' +
            'Use outline, which survives.'
          : 'declares no outline, so the focus indicator is not visible from this rule alone.',
      });
      continue;
    }

    const resolved = resolveValue(outline?.value ?? outlineWidth.value, properties) ?? '';
    const width = resolved
      .split(/\s+/)
      .map((token) => numericPx(token))
      .find((n) => n !== null);
    if (width !== undefined && width < 2) {
      findings.push({
        check: 'focus',
        level: 'fail',
        file,
        line: (outline ?? outlineWidth).line,
        selector: rule.selector,
        message: `the focus outline is ${width}px. 2.4.13 sets a 2px minimum thickness.`,
      });
      continue;
    }

    if (!offset) {
      findings.push({
        check: 'focus',
        level: 'warn',
        file,
        line: rule.line,
        selector: rule.selector,
        message:
          'declares no outline-offset. On a control that already carries a border the ring ' +
          'blends into it; 2px of offset is the safe default.',
      });
      continue;
    }

    findings.push({
      check: 'focus',
      level: 'pass',
      file,
      line: rule.line,
      selector: rule.selector,
      message: `outline ${resolved} with ${offset.value} offset.`,
    });
  }
  return findings;
}

/**
 * Check 4 — target size (2.5.8).
 *
 * 24x24 CSS px is the hard floor; below 44x44 is compliant and still worth a
 * warning for touch. A rotated target hit-tests against its TRANSFORMED box,
 * whose axis-aligned bounding box is not computable from CSS text, so that
 * becomes a todo naming the measurement rather than a pass.
 */
function checkTargetSize(rules, properties, file) {
  const findings = [];
  for (const rule of rules) {
    const sizes = ['min-height', 'height', 'min-width', 'width']
      .map((property) => {
        const decl = declarationOf(rule.declarations, property);
        if (!decl) return null;
        const px = numericPx(resolveValue(decl.value, properties) ?? '');
        return px === null ? null : { property, px, line: decl.line };
      })
      .filter(Boolean);
    if (sizes.length === 0) continue;

    const smallest = sizes.reduce((a, b) => (a.px <= b.px ? a : b));
    const transform = declarationOf(rule.declarations, 'transform');
    const rotated = transform && /\brotate[XYZ3d]*\(/.test(transform.value);

    if (smallest.px < 24) {
      findings.push({
        check: 'target-size',
        level: 'fail',
        file,
        line: smallest.line,
        selector: rule.selector,
        message: `${smallest.property} is ${smallest.px}px. SC 2.5.8 sets a 24px floor.`,
      });
    } else if (smallest.px < 44) {
      findings.push({
        check: 'target-size',
        level: 'warn',
        file,
        line: smallest.line,
        selector: rule.selector,
        message:
          `${smallest.property} is ${smallest.px}px, which clears the 24px floor but sits ` +
          'below the 44px most of these styles set for touch.',
      });
    } else if (!rotated) {
      findings.push({
        check: 'target-size',
        level: 'pass',
        file,
        line: smallest.line,
        selector: rule.selector,
        message: `smallest declared dimension is ${smallest.px}px.`,
      });
    }

    if (rotated) {
      findings.push({
        check: 'target-size',
        level: 'todo',
        file,
        line: transform.line,
        selector: rule.selector,
        message:
          `is rotated by "${transform.value}", so it hit-tests against its transformed box. ` +
          'Measure the axis-aligned bounding box after transform — the declared ' +
          `${smallest.px}px is not the target size.`,
      });
    }
  }
  return findings;
}

const FORCED_COLORS_RE = /forced-colors:\s*active/;

/**
 * Check 5 — forced colors.
 *
 * The mode nulls `box-shadow`, `text-shadow` and `background-image`, and
 * substitutes the user's palette for `color`, `background-color`,
 * `border-color` and `outline-color`. It does NOT null a `url()` background,
 * which is why a grain layer survives and actively harms legibility.
 */
function checkForcedColors(rules, file) {
  const findings = [];
  const inBlock = rules.filter((r) => r.atRules.some((a) => FORCED_COLORS_RE.test(a)));

  if (inBlock.length === 0) {
    // Only ask for the block when the sheet declares something the mode
    // actually breaks. A sheet of sizes and spacing survives forced colors
    // untouched, and demanding a block from it is noise that trains a reader to
    // ignore this check.
    const atRisk = rules.find((r) =>
      r.declarations.some(
        (d) =>
          /^(box-shadow|text-shadow)$/.test(d.property) ||
          (d.property === 'background-image' && d.value.trim() !== 'none') ||
          (/^background$/.test(d.property) && /gradient|url\(/.test(d.value)) ||
          d.property === 'backdrop-filter',
      ),
    );
    if (!atRisk) return findings;
    findings.push({
      check: 'forced-colors',
      level: 'fail',
      file,
      line: atRisk.line,
      selector: atRisk.selector,
      message:
        'no @media (forced-colors: active) block. The mode discards box-shadow and ' +
        'text-shadow outright, so every element whose boundary is a shadow loses it — and it ' +
        'does NOT discard a url() background, so a grain layer survives and harms legibility.',
    });
    return findings;
  }

  // The CSS system colour keywords. Anything else in the block is a colour the
  // user did not choose.
  const SYSTEM_COLORS =
    /\b(Canvas|CanvasText|LinkText|VisitedText|ActiveText|ButtonFace|ButtonText|ButtonBorder|Field|FieldText|Highlight|HighlightText|SelectedItem|SelectedItemText|Mark|MarkText|GrayText|AccentColor|AccentColorText|currentColor|transparent|inherit|none|unset|revert|initial)\b/;
  const COLOUR_PROPERTIES = ['color', 'background', 'background-color', 'border', 'border-color', 'outline', 'outline-color'];

  for (const rule of inBlock) {
    let clean = true;

    for (const decl of rule.declarations) {
      if (!COLOUR_PROPERTIES.includes(decl.property)) continue;
      if (SYSTEM_COLORS.test(decl.value)) continue;
      clean = false;
      findings.push({
        check: 'forced-colors',
        level: 'fail',
        file,
        line: decl.line,
        selector: rule.selector,
        message:
          `${decl.property}: ${decl.value} is not a system colour keyword. Inside ` +
          'forced-colors the UA is substituting the user\'s palette; a literal here overrides ' +
          'the substitution and defeats the mode.',
      });
    }

    const adjust = declarationOf(rule.declarations, 'forced-color-adjust');
    if (adjust && adjust.value.trim() === 'none' && !/::(before|after)\b/.test(rule.selector)) {
      clean = false;
      findings.push({
        check: 'forced-colors',
        level: 'fail',
        file,
        line: adjust.line,
        selector: rule.selector,
        message:
          'forced-color-adjust: none opts this rule out of the user\'s palette. It is only ' +
          'defensible on a decorative brand mark, never on a text-bearing or interactive element.',
      });
    }

    // A shadow-bounded element must get a real border back, because the mode
    // has already deleted the shadow that was its boundary.
    const shadowed = rules.find(
      (r) => r.selector === rule.selector && declarationOf(r.declarations, 'box-shadow') && r !== rule,
    );
    if (shadowed && !declarationOf(rule.declarations, 'border') && !declarationOf(rule.declarations, 'border-color')) {
      clean = false;
      findings.push({
        check: 'forced-colors',
        level: 'fail',
        file,
        line: rule.line,
        selector: rule.selector,
        message:
          'is bounded by a box-shadow outside this block and restores no border inside it. ' +
          'forced-colors nulls box-shadow, so the element loses its boundary entirely.',
      });
    }

    if (clean) {
      findings.push({
        check: 'forced-colors',
        level: 'pass',
        file,
        line: rule.line,
        selector: rule.selector,
        message: 'uses system colour keywords and restores its boundary.',
      });
    }
  }

  return findings;
}

/**
 * Check 6 — reduced motion.
 *
 * Two separate requirements, and the second is the one that gets missed: the
 * block must zero durations, and it must NOT remove a state-carrying property
 * while it is there. A user who asked for less movement did not ask for less
 * information, and dropping a focus outline inside this block takes a state cue
 * away from exactly the people who requested the setting.
 */
function checkReducedMotion(rules, file) {
  const findings = [];
  const inBlock = rules.filter((r) => r.atRules.some((a) => /prefers-reduced-motion/.test(a)));

  if (inBlock.length === 0) {
    const animated = rules.find(
      (r) =>
        declarationOf(r.declarations, 'transition') ||
        declarationOf(r.declarations, 'animation') ||
        declarationOf(r.declarations, 'transition-duration') ||
        declarationOf(r.declarations, 'animation-name'),
    );
    if (animated) {
      findings.push({
        check: 'reduced-motion',
        level: 'fail',
        file,
        line: animated.line,
        selector: animated.selector,
        message:
          'the stylesheet animates but declares no @media (prefers-reduced-motion: reduce) block.',
      });
    }
    return findings;
  }

  const STATE_CARRYING = ['outline', 'outline-width', 'outline-color', 'border', 'border-color', 'background', 'background-color', 'color'];
  let zeroed = false;

  for (const rule of inBlock) {
    for (const decl of rule.declarations) {
      if (/^(animation|transition)(-duration)?$/.test(decl.property) && /\b0(\.0*1)?m?s\b/.test(decl.value)) {
        zeroed = true;
      }
      const removesState =
        STATE_CARRYING.includes(decl.property) && /^(none|0|transparent)\b/.test(decl.value.trim());
      const hides = decl.property === 'display' && decl.value.trim() === 'none';
      if (removesState || hides) {
        findings.push({
          check: 'reduced-motion',
          level: 'fail',
          file,
          line: decl.line,
          selector: rule.selector,
          message:
            `removes a state-carrying property (${decl.property}: ${decl.value}) inside the ` +
            'reduced-motion block. Reduce the movement, not the information.',
        });
      }
    }
  }

  if (!zeroed) {
    findings.push({
      check: 'reduced-motion',
      level: 'fail',
      file,
      line: inBlock[0].line,
      selector: inBlock[0].selector,
      message:
        'the reduced-motion block does not zero any animation or transition duration, so the ' +
        'motion it was written for still plays.',
    });
  } else if (findings.length === 0) {
    findings.push({
      check: 'reduced-motion',
      level: 'pass',
      file,
      line: inBlock[0].line,
      selector: inBlock[0].selector,
      message: 'zeroes durations and removes no state-carrying property.',
    });
  }

  return findings;
}

/**
 * Check 7 — reduced transparency.
 *
 * Required for any style that emits `backdrop-filter`. Chrome and Edge 118+
 * ship `prefers-reduced-transparency`; Firefox has it behind a flag; Safari
 * does not implement it as of August 2026 — and Safari is the platform whose
 * users are most likely to have Reduce Transparency switched on. So the media
 * query alone is not coverage: an in-app signal is required alongside it.
 */
function checkReducedTransparency(rules, file) {
  const findings = [];
  const translucent = rules.find((r) => declarationOf(r.declarations, 'backdrop-filter'));
  if (!translucent) return findings;

  const hasQuery = rules.some((r) => r.atRules.some((a) => /prefers-reduced-transparency/.test(a)));
  if (!hasQuery) {
    findings.push({
      check: 'reduced-transparency',
      level: 'fail',
      file,
      line: translucent.line,
      selector: translucent.selector,
      message:
        'emits backdrop-filter with no @media (prefers-reduced-transparency: reduce) block.',
    });
  }

  // The in-app signal. `data-transparency="reduced"` is the attribute the
  // ui-morphism styles agree on, but any explicit opt-out selector counts.
  const hasToggle = rules.some((r) =>
    /\[data-transparency|\[data-reduce-transparency|\.reduce-transparency|\.reduced-transparency/.test(
      r.selector,
    ),
  );
  if (!hasToggle) {
    findings.push({
      check: 'reduced-transparency',
      level: 'fail',
      file,
      line: translucent.line,
      selector: translucent.selector,
      message:
        'has no in-app reduced-transparency signal. Safari does not implement the media query ' +
        'as of August 2026, and Safari users are the most likely to have Reduce Transparency ' +
        'switched on — so ship a toggle setting [data-transparency="reduced"] and honour both.',
    });
  }

  if (findings.length === 0) {
    findings.push({
      check: 'reduced-transparency',
      level: 'pass',
      file,
      line: translucent.line,
      selector: translucent.selector,
      message: 'honours both the media query and an in-app transparency signal.',
    });
  }

  return findings;
}

/** A selector that names a state rather than a component. */
const STATE_SELECTOR_RE =
  /\[aria-(invalid|selected|checked|pressed|current|expanded)|:checked|\.is-|\.has-error|\.selected\b|\.active\b|\.error\b|\.success\b|\.warning\b/;

/**
 * Check 8 — colour-only encoding (1.4.1).
 *
 * State must not be carried by colour alone — and depth, blur and shadow do not
 * count as a second channel, because forced colors deletes all three and a
 * screen reader never saw them. A glyph, a border-width change, a font-weight
 * change or a text change does count.
 */
function checkColourOnly(rules, file) {
  const findings = [];
  const COLOUR_ONLY = /^(color|background|background-color|border-color|box-shadow|backdrop-filter|filter|opacity|outline-color|text-shadow)$/;
  const SECOND_CHANNEL = /^(content|font-weight|font-style|text-decoration|border-width|border-style|border-bottom|border-top|border-left|border-right|border|list-style|mask|mask-image|background-image|padding|transform)$/;

  for (const rule of rules) {
    if (!STATE_SELECTOR_RE.test(rule.selector)) continue;
    const properties = rule.declarations.map((d) => d.property);
    if (properties.length === 0) continue;
    if (properties.some((p) => SECOND_CHANNEL.test(p))) continue;
    if (!properties.every((p) => COLOUR_ONLY.test(p))) continue;

    findings.push({
      check: 'colour-only',
      level: 'warn',
      file,
      line: rule.line,
      selector: rule.selector,
      message:
        `signals a state using only ${[...new Set(properties)].join(', ')}. Colour, depth and ` +
        'blur are one channel: forced colors deletes shadows and filters, and a screen reader ' +
        'never had them. Add a glyph, a border-weight change or text.',
    });
  }
  return findings;
}

/**
 * Check 9 — DOM order (1.3.2).
 *
 * `order`, `*-reverse`, `grid-auto-flow: dense` and absolute positioning all
 * change visual placement without changing the accessibility tree. The CSS
 * Grid spec is explicit that using them for logical reordering is
 * non-conforming. These are warnings rather than failures because a stylesheet
 * cannot tell whether the content is sequential — a purely decorative dense
 * grid is fine, and only a human knows which one this is.
 */
function checkDomOrder(rules, file) {
  const findings = [];
  const warn = (rule, decl, message) =>
    findings.push({
      check: 'dom-order',
      level: 'warn',
      file,
      line: decl.line,
      selector: rule.selector,
      message: `${message} Verify the tab order matches the visual order (1.3.2, 2.4.3).`,
    });

  for (const rule of rules) {
    for (const decl of rule.declarations) {
      if (decl.property === 'order' && decl.value.trim() !== '0') {
        warn(rule, decl, `sets "order: ${decl.value}", which moves it visually but not in the DOM.`);
      }
      if (/^(flex-direction|grid-auto-flow)$/.test(decl.property) && /-reverse\b/.test(decl.value)) {
        warn(rule, decl, `reverses layout direction with "${decl.property}: ${decl.value}".`);
      }
      if (decl.property === 'grid-auto-flow' && /\bdense\b/.test(decl.value)) {
        warn(
          rule,
          decl,
          'uses "grid-auto-flow: dense", which repacks tiles into holes and can send focus ' +
            'jumping around the composition.',
        );
      }
      if (decl.property === 'position' && /^(absolute|fixed)$/.test(decl.value.trim())) {
        warn(rule, decl, `is taken out of flow with "position: ${decl.value.trim()}".`);
      }
    }
  }
  return findings;
}

/**
 * Run every universal check over a stylesheet.
 *
 * Returns `{ findings, summary }`. `pass` findings are kept deliberately: the
 * audit report's contrast table needs a row per pair, not only the failures,
 * and a table with only failures cannot be diffed against a later run.
 */
export function audit(source, { file = 'stylesheet.css' } = {}) {
  const rules = flattenRules(parseCss(source));
  const properties = collectCustomProperties(rules);
  const findings = [
    ...checkTextContrast(rules, properties.light, file),
    ...checkNonTextContrast(rules, properties, file),
    ...checkFocus(rules, properties.light, file),
    ...checkTargetSize(rules, properties.light, file),
    ...checkForcedColors(rules, file),
    ...checkReducedMotion(rules, file),
    ...checkReducedTransparency(rules, file),
    ...checkColourOnly(rules, file),
    ...checkDomOrder(rules, file),
  ];

  const summary = { pass: 0, fail: 0, warn: 0, todo: 0 };
  for (const finding of findings) summary[finding.level] += 1;
  return { file, findings, summary };
}

/** The nine universal checks, in the order docs/MARKETPLACE.md §7.3 lists them. */
export const CHECKS = [
  'text-contrast',
  'non-text-contrast',
  'focus',
  'target-size',
  'forced-colors',
  'reduced-motion',
  'reduced-transparency',
  'colour-only',
  'dom-order',
];

/* --------------------------------------------------------------------- CLI */

const USAGE = `audit-css.mjs — the nine universal accessibility checks.

  node audit-css.mjs <file.css>... [--format=md|json] [--fail-on=fail|warn]

Checks, in order: ${CHECKS.join(', ')}.

Levels: fail (a criterion is broken), warn (compliant but worth a look), todo
(not decidable from CSS text — the message names the measurement), pass.

Markdown is the default because the output lands in §3 of the audit report.
Exit status is 1 when anything at or above --fail-on is found (default fail),
and 2 when a file cannot be read or parsed.`;

function renderMarkdown(result) {
  const lines = [`### ${result.file}`, ''];
  if (result.findings.length === 0) {
    lines.push('No findings.', '');
    return lines.join('\n');
  }
  lines.push('| Check | Level | Selector | Line | Detail |', '|---|---|---|---|---|');
  for (const f of result.findings) {
    const detail = f.message.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const ratio = f.ratio === undefined ? '' : ` (${f.ratio.toFixed(3)}:1)`;
    lines.push(`| ${f.check} | ${f.level} | \`${f.selector}\` | ${f.line} | ${detail}${ratio} |`);
  }
  const s = result.summary;
  lines.push('', `${s.fail} fail, ${s.warn} warn, ${s.todo} todo, ${s.pass} pass.`, '');
  return lines.join('\n');
}

async function runCli(argv) {
  const flags = new Map();
  const files = [];
  for (const arg of argv) {
    const m = /^--([a-z0-9-]+)(?:=(.*))?$/i.exec(arg);
    if (m) flags.set(m[1], m[2] === undefined ? true : m[2]);
    else files.push(arg);
  }
  if (flags.has('help') || files.length === 0) {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }

  const { readFile } = await import('node:fs/promises');
  const results = [];
  for (const file of files) {
    results.push(audit(await readFile(file, 'utf8'), { file }));
  }

  if (flags.get('format') === 'json') {
    const summary = results.reduce(
      (acc, r) => ({
        pass: acc.pass + r.summary.pass,
        fail: acc.fail + r.summary.fail,
        warn: acc.warn + r.summary.warn,
        todo: acc.todo + r.summary.todo,
      }),
      { pass: 0, fail: 0, warn: 0, todo: 0 },
    );
    const merged = { checks: CHECKS, findings: results.flatMap((r) => r.findings), summary };
    process.stdout.write(`${JSON.stringify(merged, null, 2)}\n`);
  } else {
    for (const result of results) process.stdout.write(`${renderMarkdown(result)}\n`);
  }

  const levels = flags.get('fail-on') === 'warn' ? ['fail', 'warn'] : ['fail'];
  return results.some((r) => levels.some((level) => r.summary[level] > 0)) ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`audit-css.mjs: ${error.message}\n`);
      process.exitCode = 2;
    },
  );
}
