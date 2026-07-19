// src/styles/tokens.js

export const colors = {
  // Brand
  accent:       "#8B5CF6",
  accentHover:  "rgba(139,92,246,0.35)",
  accentSubtle: "rgba(139,92,246,0.16)",
  accentBorder: "rgba(139,92,246,0.55)",
  accentGlow:   "rgba(139,92,246,0.40)",

  // Supporting accents
  accentBlue:  "#3B82F6",
  accentCyan:  "#22D3EE",
  accentCoral: "#FF6B6B",

  // Semantic
  success: "#34D399",
  warning: "#FBBF24",
  danger:  "#FB7185",
  purple:  "#A78BFA",
  cyan:    "#22D3EE",

  // Traffic lights
  red:    "#FF5F57",
  yellow: "#FEBC2E",
  green:  "#28C840",

  // Desktop background
  bg:       "#070B17",
  bgMiddle: "#10172D",
  bgEnd:    "#151128",

  // Surfaces
  surface:       "rgba(15,23,42,0.94)",
  surfaceStrong: "#111827",
  surfaceHover:  "rgba(255,255,255,0.08)",
  surfaceActive: "rgba(139,92,246,0.20)",

  titleBar: "rgba(15,23,42,0.78)",
  menuBar:  "rgba(7,11,23,0.84)",
  dock:     "rgba(15,23,42,0.72)",
  overlay:  "rgba(2,6,23,0.64)",

  // Text
  textPrimary:   "#F8FAFC",
  textSecondary: "rgba(226,232,240,0.78)",
  textMuted:     "rgba(174,184,202,0.58)",
  textDim:       "rgba(148,163,184,0.34)",

  // Borders
  border:        "1px solid rgba(255,255,255,0.11)",
  borderFocused: "1px solid rgba(139,92,246,0.60)",
  borderSubtle:  "1px solid rgba(255,255,255,0.07)",
};

export const backgrounds = {
  desktop: `
    radial-gradient(
      circle at 18% 22%,
      rgba(59,130,246,0.28),
      transparent 34%
    ),
    radial-gradient(
      circle at 78% 18%,
      rgba(139,92,246,0.25),
      transparent 38%
    ),
    radial-gradient(
      circle at 55% 88%,
      rgba(34,211,238,0.12),
      transparent 32%
    ),
    linear-gradient(
      135deg,
      #070B17 0%,
      #10172D 52%,
      #151128 100%
    )
  `,

  window: `
    linear-gradient(
      145deg,
      rgba(17,24,39,0.97),
      rgba(15,23,42,0.94)
    )
  `,

  activeItem: `
    linear-gradient(
      135deg,
      rgba(139,92,246,0.28),
      rgba(59,130,246,0.16)
    )
  `,
};

export const shadows = {
  window: `
    0 32px 90px rgba(0,0,0,0.58),
    0 0 0 1px rgba(255,255,255,0.04)
  `,

  windowBlurred: `
    0 18px 45px rgba(0,0,0,0.42)
  `,

  overlay: `
    0 30px 80px rgba(0,0,0,0.62)
  `,

  dock: `
    0 18px 45px rgba(0,0,0,0.40),
    inset 0 1px 0 rgba(255,255,255,0.08)
  `,

  dockIcon: `
    0 10px 20px rgba(0,0,0,0.38)
  `,

  menu: `
    0 18px 50px rgba(0,0,0,0.48),
    0 0 0 1px rgba(255,255,255,0.04)
  `,

  focus: `
    0 0 0 3px rgba(139,92,246,0.24)
  `,

  accentGlow: `
    0 0 18px rgba(139,92,246,0.52)
  `,
};

export const radii = {
  window: 14,
  card:   12,
  tag:    7,
  btn:    9,
  pill:   999,
};

export const font = {
  family:
    "'SF Pro Text', Inter, -apple-system, BlinkMacSystemFont, sans-serif",

  mono:
    "'SF Mono', 'JetBrains Mono', Monaco, 'Courier New', monospace",

  sizes: {
    xs:   11,
    sm:   12,
    base: 13,
    md:   14,
    lg:   15,
    xl:   17,
    "2xl": 22,
    "3xl": 28,
  },

  weights: {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },
};

export const blur = {
  menuBar: "blur(24px) saturate(160%)",
  window:  "blur(36px) saturate(160%)",
  overlay: "blur(8px)",
  dock:    "blur(28px) saturate(150%)",
};


// // src/styles/tokens.js
// // ─────────────────────────────────────────────────────────────
// // Design tokens — the single source of truth for every colour,
// // spacing, radius, shadow used in the app.
// //
// // WHY TOKENS?
// //   Without tokens, the same hex code (#5E5CE6) appears 40+
// //   times across files.  Change the brand colour once here and
// //   every component updates.  This is the CSS-variables pattern
// //   but in JS, which works cleanly with inline styles.
// // ─────────────────────────────────────────────────────────────

// export const colors = {
//   // Brand
//   accent:        "#5E5CE6",
//   accentHover:   "rgba(94,92,230,0.35)",
//   accentSubtle:  "rgba(94,92,230,0.15)",
//   accentBorder:  "rgba(94,92,230,0.4)",

//   // Semantic
//   success:  "#30D158",
//   warning:  "#FF9F0A",
//   danger:   "#FF6B6B",
//   purple:   "#BF5AF2",
//   cyan:     "#64D2FF",

//   // Traffic lights
//   red:    "#FF5F57",
//   yellow: "#FEBC2E",
//   green:  "#28C840",

//   // Surfaces
//   bg:           "#0d0d14",
//   surface:      "rgba(28,28,32,0.92)",
//   surfaceHover: "rgba(255,255,255,0.07)",
//   titleBar:     "rgba(32,32,38,0.7)",
//   menuBar:      "rgba(18,18,22,0.82)",
//   dock:         "rgba(36,36,42,0.6)",
//   overlay:      "rgba(0,0,0,0.5)",

//   // Text
//   textPrimary:   "#ffffff",
//   textSecondary: "rgba(255,255,255,0.75)",
//   textMuted:     "rgba(255,255,255,0.45)",
//   textDim:       "rgba(255,255,255,0.25)",

//   // Borders
//   border:        "0.5px solid rgba(255,255,255,0.08)",
//   borderFocused: "0.5px solid rgba(255,255,255,0.18)",
//   borderSubtle:  "0.5px solid rgba(255,255,255,0.06)",
// };

// export const shadows = {
//   window:        "0 40px 100px rgba(0,0,0,0.8)",
//   windowBlurred: "0 16px 40px rgba(0,0,0,0.5)",
//   overlay:       "0 32px 80px rgba(0,0,0,0.7)",
//   dock:          "0 10px 28px rgba(0,0,0,0.45)",
//   menu:          "0 16px 48px rgba(0,0,0,0.6)",
// };

// export const radii = {
//   window: 12,
//   card:   10,
//   tag:    6,
//   btn:    8,
//   pill:   999,
// };

// export const font = {
//   family: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
//   mono:   "'SF Mono', Monaco, 'Courier New', monospace",
//   sizes:  { xs: 11, sm: 12, base: 13, md: 14, lg: 15, xl: 17, "2xl": 22, "3xl": 28 },
//   weights:{ normal: 400, medium: 500, semibold: 600, bold: 700 },
// };

// export const blur = {
//   menuBar: "blur(24px) saturate(180%)",
//   window:  "blur(40px) saturate(200%)",
//   overlay: "blur(6px)",
//   dock:    "blur(28px) saturate(180%)",
// };