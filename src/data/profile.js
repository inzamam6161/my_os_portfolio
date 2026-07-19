// src/data/profile.js
// ─────────────────────────────────────────────────────────────
// Everything about "the person" — skills, experience, social
// links, terminal boot sequence, spotlight search index.
// ─────────────────────────────────────────────────────────────
// Spotlight search index — built from real data so it's always in sync
// import Contacts from "../icons/contacts.png";
// import File from "../icons/file-manager.png";


import { APPS } from "./apps";
export const PROFILE = {
  name:     "Inzamamul Haque",
  title:    "Software Developer",
  location: "Al Ain, UAE",
  email:    "inzamam6161@gmail.com",
  github:   "https://github.com/alexchen",
  linkedin: "https://linkedin.com/in/alexchen",
  bio: [
    "React Native and Mobile Application Developer with 5 years of software development experience, specializing in React Native, JavaScript, React.js, Android, iOS, and Node.js.",
    "Experienced in the complete application lifecycle—from UI development and API integration to testing, deployment, and publishing on the Google Play Store and Apple App Store. Currently based in the UAE and seeking opportunities to build reliable, user-friendly mobile and web applications."
  ],
  badges: []
  // badges: ["Open Source Contributor", "Conference Speaker", "4x App Store Featured", "3x Startup Founder"],
};

export const SKILL_SECTIONS = [
  {
    category: "Mobile Development",
    icon:     "📱",
    color:    "#5E5CE6",
    skills: [
      { name: "Swift / SwiftUI",         level: 95 },
      { name: "Kotlin / Jetpack Compose",level: 90 },
      { name: "React Native",            level: 88 },
      { name: "Flutter / Dart",          level: 80 },
      { name: "Objective-C",             level: 70 },
    ],
  },
  {
    category: "Web & Frontend",
    icon:     "🌐",
    color:    "#30D158",
    skills: [
      { name: "TypeScript / JavaScript", level: 96 },
      { name: "React / Next.js",         level: 94 },
      { name: "WebGL / Three.js",        level: 75 },
      { name: "CSS / Tailwind",          level: 90 },
      { name: "Framer Motion",           level: 82 },
    ],
  },
  {
    category: "Backend & Systems",
    icon:     "⚙️",
    color:    "#FF9F0A",
    skills: [
      { name: "Go",                      level: 88 },
      { name: "Rust",                    level: 78 },
      { name: "Python",                  level: 85 },
      { name: "Node.js / GraphQL",       level: 91 },
      { name: "PostgreSQL / Redis",      level: 86 },
    ],
  },
  {
    category: "Cloud & DevOps",
    icon:     "☁️",
    color:    "#FF6B6B",
    skills: [
      { name: "AWS / GCP",               level: 84 },
      { name: "Kubernetes / Docker",     level: 88 },
      { name: "CI/CD (GitHub Actions)",  level: 90 },
      { name: "Terraform",               level: 76 },
      { name: "Firebase / Supabase",     level: 87 },
    ],
  },
];

export const EXPERIENCE = [
  { role: "Staff Software Engineer", company: "Vercel",  period: "2022 — Present", desc: "Led Edge Runtime team. V8 isolate scheduling cut cold-start latency 63%.",               dot: "#5E5CE6" },
  { role: "Senior iOS Engineer",     company: "Spotify", period: "2021 — 2022",    desc: "Rebuilt Now Playing with SwiftUI, led Combine adoption across iOS codebase.",            dot: "#1DB954" },
  { role: "Software Engineer II",    company: "Stripe",  period: "2019 — 2021",    desc: "Built fraud ML pipeline serving 100M+ API calls/day. Reduced false-positive rate 41%.", dot: "#635BFF" },
  { role: "Mobile Engineer",         company: "Figma",   period: "2017 — 2019",    desc: "Shipped Figma iOS app from 0→1. Built real-time collaboration layer for mobile.",        dot: "#F24E1E" },
];

// export const WALLPAPERS = [
//   { id: "aurora",   label: "Aurora",   bg: "radial-gradient(ellipse at 15% 60%,rgba(94,92,230,.25) 0%,transparent 55%),radial-gradient(ellipse at 80% 15%,rgba(191,90,242,.18) 0%,transparent 50%),radial-gradient(ellipse at 55% 85%,rgba(48,209,88,.1) 0%,transparent 45%),linear-gradient(135deg,#0d0d14 0%,#12121e 50%,#0d0d14 100%)" },
//   { id: "ocean",    label: "Ocean",    bg: "radial-gradient(ellipse at 30% 70%,rgba(0,120,255,.3) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(0,200,200,.2) 0%,transparent 50%),linear-gradient(160deg,#020818 0%,#071428 60%,#020c18 100%)" },
//   { id: "sunset",   label: "Sunset",   bg: "radial-gradient(ellipse at 50% 80%,rgba(255,100,50,.28) 0%,transparent 60%),radial-gradient(ellipse at 20% 30%,rgba(255,60,100,.2) 0%,transparent 50%),linear-gradient(160deg,#120408 0%,#1e0810 60%,#120408 100%)" },
//   { id: "forest",   label: "Forest",   bg: "radial-gradient(ellipse at 40% 60%,rgba(30,180,80,.22) 0%,transparent 55%),radial-gradient(ellipse at 70% 20%,rgba(80,200,120,.14) 0%,transparent 45%),linear-gradient(160deg,#040e06 0%,#081408 60%,#040e06 100%)" },
//   { id: "midnight", label: "Midnight", bg: "linear-gradient(135deg,#080810 0%,#0a0a18 50%,#080810 100%)" },
// ];

export const WALLPAPERS = [
  {
    id: "aurora",
    label: "Aurora",
    bg: `
      radial-gradient(
        ellipse at 14% 22%,
        rgba(59,130,246,0.32) 0%,
        transparent 42%
      ),
      radial-gradient(
        ellipse at 82% 16%,
        rgba(139,92,246,0.30) 0%,
        transparent 44%
      ),
      radial-gradient(
        ellipse at 54% 92%,
        rgba(34,211,238,0.13) 0%,
        transparent 36%
      ),
      linear-gradient(
        135deg,
        #070B17 0%,
        #10172D 52%,
        #151128 100%
      )
    `,
  },

  {
    id: "ocean",
    label: "Ocean",
    bg: `
      radial-gradient(
        ellipse at 18% 82%,
        rgba(14,165,233,0.32) 0%,
        transparent 46%
      ),
      radial-gradient(
        ellipse at 82% 18%,
        rgba(6,182,212,0.23) 0%,
        transparent 42%
      ),
      radial-gradient(
        ellipse at 52% 46%,
        rgba(59,130,246,0.13) 0%,
        transparent 38%
      ),
      linear-gradient(
        150deg,
        #020617 0%,
        #071A2D 52%,
        #03111F 100%
      )
    `,
  },

  {
    id: "sunset",
    label: "Sunset",
    bg: `
      radial-gradient(
        ellipse at 50% 92%,
        rgba(251,113,133,0.34) 0%,
        transparent 48%
      ),
      radial-gradient(
        ellipse at 16% 24%,
        rgba(249,115,22,0.22) 0%,
        transparent 42%
      ),
      radial-gradient(
        ellipse at 86% 18%,
        rgba(168,85,247,0.20) 0%,
        transparent 40%
      ),
      linear-gradient(
        155deg,
        #14060C 0%,
        #251024 55%,
        #0F0B1C 100%
      )
    `,
  },

  {
    id: "forest",
    label: "Forest",
    bg: `
      radial-gradient(
        ellipse at 20% 78%,
        rgba(16,185,129,0.28) 0%,
        transparent 46%
      ),
      radial-gradient(
        ellipse at 82% 18%,
        rgba(34,197,94,0.17) 0%,
        transparent 40%
      ),
      radial-gradient(
        ellipse at 52% 48%,
        rgba(20,184,166,0.12) 0%,
        transparent 38%
      ),
      linear-gradient(
        150deg,
        #03120F 0%,
        #082019 52%,
        #04100F 100%
      )
    `,
  },

  {
    id: "midnight",
    label: "Midnight",
    bg: `
      radial-gradient(
        ellipse at 78% 18%,
        rgba(99,102,241,0.15) 0%,
        transparent 40%
      ),
      radial-gradient(
        ellipse at 18% 84%,
        rgba(56,189,248,0.08) 0%,
        transparent 36%
      ),
      linear-gradient(
        135deg,
        #020617 0%,
        #070B17 52%,
        #050816 100%
      )
    `,
  },
];

export const NOTIFICATIONS_INIT = [
  // { id: 1, app: "Messages",  icon: "💬", title: "New message",           body: "Hey! Loved your portfolio 🔥",       time: "now",    read: false },
  // { id: 2, app: "GitHub",    icon: "🐙", title: "Star received",         body: "NovaPay just hit 1,000 stars ⭐",   time: "2m ago", read: false },
  // { id: 3, app: "App Store", icon: "🍎", title: "App featured",          body: "PulseRun featured in Apps We Love", time: "1h ago", read: true  },
  // { id: 4, app: "LinkedIn",  icon: "💼", title: "New connection request",body: "Sarah Chen wants to connect",        time: "3h ago", read: true  },
];

export const TERMINAL_LINES = [
  { t: 0,    text: "Last login: Mon May 25 09:00:00 on ttys000",                        color: "rgba(255,255,255,0.4)" },
  { t: 300,  text: "alex@macbook ~ % whoami",                                            color: "#30D158" },
  { t: 600,  text: "alex chen — staff engineer · mobile & systems",                      color: "rgba(255,255,255,0.85)" },
  { t: 900,  text: "alex@macbook ~ % cat skills.txt",                                    color: "#30D158" },
  { t: 1200, text: "Swift ████████████████████ 95%",                                     color: "#5E5CE6" },
  { t: 1350, text: "TypeScript ██████████████████████ 96%",                              color: "#5E5CE6" },
  { t: 1500, text: "Go ████████████████ 88%",                                            color: "#5E5CE6" },
  { t: 1650, text: "React Native ██████████████████ 88%",                                color: "#5E5CE6" },
  { t: 1800, text: "alex@macbook ~ % ls projects/",                                      color: "#30D158" },
  { t: 2100, text: "NovaPay/  AtlasDB/  LensAI/  Vanta/  BudgetBuddy/  PulseRun/",     color: "#FF9F0A" },
  { t: 2400, text: "alex@macbook ~ % git log --oneline -5",                              color: "#30D158" },
  { t: 2700, text: "a3f91bc feat: add WebGPU renderer to LensAI",                       color: "rgba(255,255,255,0.7)" },
  { t: 2850, text: "7c82d1e fix: memory leak in AtlasDB LSM tree",                      color: "rgba(255,255,255,0.7)" },
  { t: 3000, text: "e109f4a chore: bump react-native to 0.74",                          color: "rgba(255,255,255,0.7)" },
  { t: 3150, text: "51a89cc feat: SwiftUI animations in PulseRun",                      color: "rgba(255,255,255,0.7)" },
  { t: 3300, text: "22b7d3f perf: reduce cold-start latency 63%",                       color: "rgba(255,255,255,0.7)" },
  { t: 3600, text: "alex@macbook ~ % _",                                                 color: "#30D158" },
];


export const SPOTLIGHT_ITEMS = [
  ...APPS.map(a => ({ type: "App",     label: a.label,              icon: a.icon, id: a.id       })),
  { type: "Project", label: "NovaPay",           icon: "💳", id: "projects" },
  { type: "Project", label: "BudgetBuddy",        icon: "💰", id: "mobile"   },
  { type: "Project", label: "PulseRun",           icon: "🏃", id: "mobile"   },
  { type: "Skill",   label: "Swift / SwiftUI",    icon: "📱", id: "skills"   },
  { type: "Skill",   label: "React / Next.js",    icon: "⚛️", id: "skills"   },
  { type: "Resume",  label: "Download Resume",    icon: "📄", id: "resume"   },
];