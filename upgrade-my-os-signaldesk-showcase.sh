#!/usr/bin/env bash
set -euo pipefail

# my_os_portfolio — SignalDesk showcase upgrade
# Run from the root of my_os_portfolio.

if [[ ! -f "package.json" ]] || ! grep -q '"name": "inzamam-macos-portfolio"' package.json; then
  echo "Error: run this from the root of my_os_portfolio."
  exit 1
fi

echo "==> Upgrading SignalDesk presentation in my_os_portfolio"

mkdir -p src/icons

cat > src/icons/signaldesk.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
      <stop stop-color="#9AD400"/>
      <stop offset="1" stop-color="#5F9900"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#bg)"/>
  <rect x="2.5" y="2.5" width="59" height="59" rx="15.5" stroke="#D8FF7A" stroke-opacity=".45"/>
  <path d="M43.8 20.5c-2.4-2.7-6-4.2-10.2-4.2-6.5 0-11 3.2-11 8.1 0 4.1 3 6.3 8.4 7.6l4.2 1c2.7.7 3.9 1.5 3.9 3 0 2-2 3.2-5.3 3.2-3.8 0-6.7-1.5-9-4.1l-4 4.6c3 3.7 7.5 5.7 12.9 5.7 7.2 0 11.8-3.5 11.8-9 0-4.3-2.8-6.6-8.5-8l-4-1c-2.7-.7-4-1.4-4-2.8 0-1.6 1.7-2.6 4.5-2.6 2.8 0 5.2 1 7.3 3.2l3-4.7Z" fill="#101608"/>
</svg>
EOF

# ---------------------------------------------------------------------------
# 1. Replace SignalDesk project data with the upgraded portfolio story
# ---------------------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

path = Path("src/data/projects.js")
text = path.read_text()

start = text.find('  {\n    id: "signaldesk-ai",')
if start == -1:
    raise SystemExit("Could not find SignalDesk project in src/data/projects.js")

end = text.find("\n  },", start)
if end == -1:
    raise SystemExit("Could not locate end of SignalDesk project")
end += len("\n  },")

replacement = r'''  {
    id: "signaldesk-ai",
    title: "SignalDesk",
    desc: "A customer-intelligence dashboard for collecting feedback, classifying sentiment, tracking follow-ups, detecting recurring topics and generating evidence-based product insights from the current workspace.",
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Customer Intelligence",
      "Local Persistence",
      "Evidence Analysis",
      "Vitest",
      "GitHub Actions",
    ],
    category: "Customer Intelligence Web App",
    symbol: "S",
    previewType: "desktop",
    featured: true,
    color: "#79B300",
    href: "https://github.com/inzamam6161/signaldesk-ai",
    stats: [
      { label: "Workspace", value: "Local + persistent" },
      { label: "Analysis", value: "Evidence-based" },
      { label: "Quality", value: "Tests + CI" },
    ],
    highlights: [
      "Add Feedback workflow with automatic local sentiment classification, manual override, browser persistence and per-conversation follow-up tracking.",
      "Evidence-based analysis calculates real sentiment counts, recurring topic mentions, priority and supporting customer quotes without inventing unsupported platform or usage claims.",
      "Functional Overview, Feedback and Insights workspaces with search, sentiment filters, command palette, CSV export, responsive layouts and light/dark themes.",
      "Reusable pure analysis modules covered by Vitest, with GitHub Actions running lint, tests and production builds for maintainable portfolio-quality engineering.",
    ],
    portfolioNote: "The current portfolio build uses transparent deterministic classification and analysis rather than a generative LLM. The architecture keeps analysis logic separate so a grounded production model provider can be introduced later without rewriting the dashboard.",
    screenshots: [
      {
        src: "/projects/signaldesk/dashboard-light.png",
        alt: "SignalDesk customer-intelligence overview in light mode",
        label: "Overview",
      },
      {
        src: "/projects/signaldesk/dashboard-dark.png",
        alt: "SignalDesk customer-intelligence dashboard in dark mode",
        label: "Dark Mode",
      },
    ],
  },'''

text = text[:start] + replacement + text[end:]

# Add a project-specific note to Nexora if it doesn't already have one.
nexora_anchor = '''    highlights: [
      "Reusable React and TypeScript architecture with dedicated engines for profiling, statistics, anomalies, trends, chart recommendations, filtering and aggregation.",
      "Local-first processing for spreadsheets, text and images, with transparent deterministic logic instead of presenting every rule-based calculation as generative AI.",
      "Social Post Studio uses browser Canvas APIs for image measurement, crop and export, while Data Q&A provides focused natural-language-style analysis over uploaded datasets.",
      "Shareable hash routes, built-in examples, automated tests and GitHub Actions CI improve the project from a demo into a maintainable portfolio engineering build.",
    ],'''

if nexora_anchor in text and "Nexora processes" not in text:
    text = text.replace(
        nexora_anchor,
        nexora_anchor + '''
    portfolioNote: "Nexora processes data locally in the browser. Its deterministic tools are described as deterministic; generative-model capabilities are not claimed where no model is involved.",'''
    )

path.write_text(text)
PY

# ---------------------------------------------------------------------------
# 2. Dedicated SignalDesk app window
# ---------------------------------------------------------------------------
cat > src/components/apps/SignalDeskApp.jsx <<'EOF'
import ProjectsApp from "./ProjectsApp";

export default function SignalDeskApp() {
  return <ProjectsApp fixedProjectId="signaldesk-ai" />;
}
EOF

cat > src/components/apps/index.js <<'EOF'
import AboutApp from "./AboutApp";
import ContactApp from "./ContactApp";
import FinderApp from "./FinderApp";
import MobileApp from "./MobileApp";
import NexoraApp from "./NexoraApp";
import ProjectsApp from "./ProjectsApp";
import ResumeApp from "./ResumeApp";
import SignalDeskApp from "./SignalDeskApp";
import SkillsApp from "./SkillsApp";
import TerminalApp from "./TerminalApp";

const APP_COMPONENTS = {
  finder: FinderApp,
  about: AboutApp,
  projects: ProjectsApp,
  mobile: MobileApp,
  signaldesk: SignalDeskApp,
  nexora: NexoraApp,
  skills: SkillsApp,
  resume: ResumeApp,
  terminal: TerminalApp,
  contact: ContactApp,
};

export default APP_COMPONENTS;
EOF

# ---------------------------------------------------------------------------
# 3. Add SignalDesk to the macOS-style Dock
# ---------------------------------------------------------------------------
cat > src/data/apps.js <<'EOF'
import Contacts from "../icons/contacts.png";
import File from "../icons/file-manager.png";
import Code from "../icons/code-editor.png";
import Mobile from "../icons/messages.png";
import SignalDesk from "../icons/signaldesk.svg";
import Nexora from "../icons/nexora.svg";
import Notes from "../icons/notes.png";
import Skills from "../icons/activity-monitor.png";
import Terminal from "../icons/terminal.png";
import Mail from "../icons/mail.png";

export const APPS = [
  { id: "finder", icon: File, label: "Finder" },
  { id: "about", icon: Contacts, label: "About Me" },
  { id: "projects", icon: Code, label: "Projects" },
  { id: "mobile", icon: Mobile, label: "Mobile Work" },
  { id: "signaldesk", icon: SignalDesk, label: "SignalDesk" },
  { id: "nexora", icon: Nexora, label: "Nexora AI Lab" },
  { id: "skills", icon: Skills, label: "Skills" },
  { id: "resume", icon: Notes, label: "Resume" },
  { id: "terminal", icon: Terminal, label: "Terminal" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export const WINDOW_TITLES = {
  finder: "Finder",
  about: "About Me",
  projects: "Projects",
  mobile: "Mobile Work",
  signaldesk: "SignalDesk",
  nexora: "Nexora AI Lab",
  skills: "Skills",
  resume: "Resume",
  terminal: "Terminal",
  contact: "Contact",
};

export const WIDE_WINDOWS = [
  "mobile",
  "resume",
  "finder",
  "projects",
  "signaldesk",
  "nexora",
];
EOF

# ---------------------------------------------------------------------------
# 4. Route homepage SignalDesk card to its own app window
# ---------------------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

path = Path("src/components/ui/HomeDesktop.jsx")
text = path.read_text()

old = '''  ...WEB_PROJECTS.map(project => ({
    ...project,
    appId: project.id === "nexora-ai-lab" ? "nexora" : "projects",
  })),'''

new = '''  ...WEB_PROJECTS.map(project => ({
    ...project,
    appId:
      project.id === "signaldesk-ai"
        ? "signaldesk"
        : project.id === "nexora-ai-lab"
          ? "nexora"
          : "projects",
  })),'''

if old not in text:
    raise SystemExit(
        "Could not find the current web-project app mapping in HomeDesktop.jsx"
    )

path.write_text(text.replace(old, new))
PY

# ---------------------------------------------------------------------------
# 5. Make case-study transparency note project-specific
# ---------------------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

path = Path("src/components/apps/ProjectsApp.jsx")
text = path.read_text()

old = '''            <p style={{ color: colors.textSecondary }}>
              The implementation is intentionally transparent about which
              features are deterministic browser-side analysis and which
              capabilities would require a generative model in a production
              version.
            </p>'''

new = '''            <p style={{ color: colors.textSecondary }}>
              {project.portfolioNote ||
                "The implementation is intentionally transparent about which capabilities are deterministic and which would require additional production services or model integration."}
            </p>'''

if old not in text:
    raise SystemExit(
        "Could not find the current Portfolio note in ProjectsApp.jsx"
    )

path.write_text(text.replace(old, new))
PY

echo "==> Running tests"
CI=true npm test -- --watchAll=false

echo "==> Running production build"
npm run build

echo
echo "============================================================"
echo "SignalDesk portfolio showcase upgraded."
echo
echo "Added:"
echo "  - dedicated SignalDesk Dock app"
echo "  - custom SignalDesk icon"
echo "  - stronger project description"
echo "  - real feature highlights"
echo "  - architecture/quality stats"
echo "  - project-specific transparency note"
echo "  - labeled screenshots"
echo
echo "Review locally:"
echo "  npm start"
echo
echo "Then push:"
echo "  git add -A"
echo '  git commit -m "Upgrade SignalDesk portfolio showcase"'
echo "  git push"
echo "============================================================"
