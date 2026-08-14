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
  title:    "React Native Developer | Mobile & Frontend Engineer",
  location: "Al Ain, UAE",
  email:    "inzamam6161@gmail.com",
  phone:    "+971 52 144 1657",
  portfolio:"https://inzamam-dev.vercel.app/",
  github:   "https://github.com/inzamam6161",
  linkedin: "https://www.linkedin.com/in/inzamamul-haque-099207113/",
  bio: [
    "React Native developer with 5 years of software development experience across mobile and web applications, specializing in React Native, JavaScript, React.js, Android, iOS, and Node.js.",
    "Experienced across the complete application lifecycle—from UI development and API integration to testing, deployment, and publishing on Google Play and the Apple App Store. Based in the UAE and open to React Native, mobile, and frontend opportunities."
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
      { name: "React Native",            level: 92 },
      { name: "Android / Kotlin / Java", level: 82 },
      { name: "iOS / Swift",             level: 78 },
      { name: "App Store & Play Store",  level: 88 },
    ],
  },
  {
    category: "Web & Frontend",
    icon:     "🌐",
    color:    "#30D158",
    skills: [
      { name: "JavaScript",              level: 92 },
      { name: "React.js",                level: 86 },
      { name: "HTML / CSS",              level: 84 },
      { name: "Responsive UI",           level: 86 },
    ],
  },
  {
    category: "Backend & Systems",
    icon:     "⚙️",
    color:    "#FF9F0A",
    skills: [
      { name: "Node.js",                 level: 80 },
      { name: "REST API Integration",    level: 90 },
      { name: "MongoDB",                 level: 74 },
      { name: "Firebase",                level: 78 },
    ],
  },
  {
    category: "Cloud & DevOps",
    icon:     "☁️",
    color:    "#FF6B6B",
    skills: [
      { name: "Git / GitHub",             level: 86 },
      { name: "CI/CD",                    level: 72 },
      { name: "App Deployment",           level: 88 },
      { name: "Technical Support",        level: 82 },
    ],
  },
];

export const EXPERIENCE = [
  { role: "Admin / Helpdesk Operator", company: "Etihad International Hospitality", period: "Sep 2025 — Present", desc: "Provide day-to-day administrative and technical support while continuing professional software development and upskilling.", dot: "#30D158" },
  { role: "Software Developer", company: "India", period: "5 years", desc: "Built and maintained mobile and web applications using React Native, React.js, Android, iOS, JavaScript, and Node.js, including store-release workflows.", dot: "#5E5CE6" },
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
];

export const TERMINAL_LINES = [
  { t: 0, text: "Welcome to Inzamamul Haque's developer portfolio", color: "rgba(255,255,255,0.4)" },
  { t: 300, text: "inzamam@portfolio ~ % whoami", color: "#30D158" },
  { t: 600, text: "React Native developer · mobile & frontend engineer", color: "rgba(255,255,255,0.85)" },
  { t: 900, text: "inzamam@portfolio ~ % cat skills.txt", color: "#30D158" },
  { t: 1200, text: "React Native · JavaScript · React.js", color: "#5E5CE6" },
  { t: 1450, text: "Android · Kotlin/Java · iOS · Swift", color: "#5E5CE6" },
  { t: 1700, text: "Node.js · REST APIs · Git · CI/CD", color: "#5E5CE6" },
  { t: 2000, text: "inzamam@portfolio ~ % cat status.txt", color: "#30D158" },
  { t: 2300, text: "Based in Al Ain, UAE · Open to opportunities", color: "#FF9F0A" },
  { t: 2700, text: "inzamam@portfolio ~ % _", color: "#30D158" },
];


export const SPOTLIGHT_ITEMS = [
  ...APPS.map(a => ({ type: "App",     label: a.label,              icon: a.icon, id: a.id       })),
  { type: "Project", label: "macOS Portfolio", icon: "🖥", id: "projects" },
  { type: "Skill", label: "React Native", icon: "📱", id: "skills" },
  { type: "Skill", label: "React.js", icon: "⚛️", id: "skills" },
  { type: "Resume",  label: "Download Resume",    icon: "📄", id: "resume"   },
];