
// src/styles/tokens.js
// ─────────────────────────────────────────────────────────────
// Design tokens — the single source of truth for every colour,
// spacing, radius, shadow used in the app.
//
// WHY TOKENS?
//   Without tokens, the same hex code (#5E5CE6) appears 40+
//   times across files.  Change the brand colour once here and
//   every component updates.  This is the CSS-variables pattern
//   but in JS, which works cleanly with inline styles.
// ─────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  accent:        "#5E5CE6",
  accentHover:   "rgba(94,92,230,0.35)",
  accentSubtle:  "rgba(94,92,230,0.15)",
  accentBorder:  "rgba(94,92,230,0.4)",

  // Semantic
  success:  "#30D158",
  warning:  "#FF9F0A",
  danger:   "#FF6B6B",
  purple:   "#BF5AF2",
  cyan:     "#64D2FF",

  // Traffic lights
  red:    "#FF5F57",
  yellow: "#FEBC2E",
  green:  "#28C840",

  // Surfaces
  bg:           "#0d0d14",
  surface:      "rgba(28,28,32,0.92)",
  surfaceHover: "rgba(255,255,255,0.07)",
  titleBar:     "rgba(32,32,38,0.7)",
  menuBar:      "rgba(18,18,22,0.82)",
  dock:         "rgba(36,36,42,0.6)",
  overlay:      "rgba(0,0,0,0.5)",

  // Text
  textPrimary:   "#ffffff",
  textSecondary: "rgba(255,255,255,0.75)",
  textMuted:     "rgba(255,255,255,0.45)",
  textDim:       "rgba(255,255,255,0.25)",

  // Borders
  border:        "0.5px solid rgba(255,255,255,0.08)",
  borderFocused: "0.5px solid rgba(255,255,255,0.18)",
  borderSubtle:  "0.5px solid rgba(255,255,255,0.06)",
};

export const shadows = {
  window:        "0 40px 100px rgba(0,0,0,0.8)",
  windowBlurred: "0 16px 40px rgba(0,0,0,0.5)",
  overlay:       "0 32px 80px rgba(0,0,0,0.7)",
  dock:          "0 10px 28px rgba(0,0,0,0.45)",
  menu:          "0 16px 48px rgba(0,0,0,0.6)",
};

export const radii = {
  window: 12,
  card:   10,
  tag:    6,
  btn:    8,
  pill:   999,
};

export const font = {
  family: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
  mono:   "'SF Mono', Monaco, 'Courier New', monospace",
  sizes:  { xs: 11, sm: 12, base: 13, md: 14, lg: 15, xl: 17, "2xl": 22, "3xl": 28 },
  weights:{ normal: 400, medium: 500, semibold: 600, bold: 700 },
};

export const blur = {
  menuBar: "blur(24px) saturate(180%)",
  window:  "blur(40px) saturate(200%)",
  overlay: "blur(6px)",
  dock:    "blur(28px) saturate(180%)",
};