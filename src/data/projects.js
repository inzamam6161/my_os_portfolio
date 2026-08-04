export const WEB_PROJECTS = [
  {
    title: "macOS Developer Portfolio",
    desc: "An interactive desktop-style portfolio built with React, featuring draggable windows, Spotlight search, Mission Control, themes, and responsive layouts.",
    tags: ["React", "JavaScript", "Responsive UI", "Vercel"],
    category: "Web Application",
    symbol: "⌘",
    color: "#5E5CE6",
    href: "https://inzamam-dev.vercel.app/",
  },
];

// Confidential employer and client applications are intentionally excluded.
export const MOBILE_PROJECTS = [
  {
    title: "PulseBoard",
    platform: "Native iOS",
    category: "Native iOS",
    icon: "◉",
    color: "#5E5CE6",
    href: "https://github.com/inzamam6161/pulseboard-ios",
    desc: "A native focus and productivity dashboard with configurable sessions, persistent activity history, live analytics, and adaptive light and dark themes.",
    tags: ["Swift", "SwiftUI", "SwiftData", "Swift Charts", "MVVM"],
    stats: [
      { label: "Interface", value: "SwiftUI" },
      { label: "Persistence", value: "SwiftData" },
      { label: "Architecture", value: "MVVM" },
    ],
    highlights: [
      "Configurable focus timer with pause, resume, and background recovery",
      "Searchable, filterable activity history with persistent local storage",
      "Weekly and monthly analytics with accessible, adaptive UI",
    ],
    screenshots: [
      { src: "/projects/pulseboard/home-light.png", alt: "PulseBoard home dashboard in light mode", label: "Home" },
      { src: "/projects/pulseboard/focus-timer.png", alt: "PulseBoard new focus session setup", label: "Timer" },
      { src: "/projects/pulseboard/insights.png", alt: "PulseBoard weekly insights chart", label: "Insights" },
      { src: "/projects/pulseboard/activity.png", alt: "PulseBoard searchable activity history", label: "Activity" },
      { src: "/projects/pulseboard/home-dark.png", alt: "PulseBoard home dashboard in dark mode", label: "Dark" },
    ],
  },
];
