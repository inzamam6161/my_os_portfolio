import { PROFILE, EXPERIENCE } from "./profile";
import { MOBILE_PROJECTS, WEB_PROJECTS } from "./projects";

export const ASSISTANT_WELCOME =
  "Hi — I’m the portfolio assistant. Ask about Inzamamul’s experience, React Native background, native iOS work, projects, architecture decisions, or role fit.";

export const ASSISTANT_SUGGESTIONS = [
  "What’s his React Native experience?",
  "Which projects should I review first?",
  "What native iOS work has he done?",
  "How does he approach offline-first apps?",
  "What engineering depth does he show beyond product UI?",
  "Is he a good fit for my role?",
];

const PROJECTS = [...MOBILE_PROJECTS, ...WEB_PROJECTS];
const byId = id => PROJECTS.find(project => project.id === id);
const lifeos = byId("lifeos");
const signalops = byId("signalops-mobile");
const pulseboard = byId("pulseboard");
const lumahome = byId("lumahome");
const signaldesk = byId("signaldesk-ai");
const nexora = byId("nexora-ai-lab");
const ENGINEERING_LABS_URL = "https://github.com/inzamam6161/mobile-engineering-labs";

const actionFor = (project, label) =>
  project
    ? {
        label: label || `Open ${project.title}`,
        projectId: project.id,
        appId: MOBILE_PROJECTS.some(item => item.id === project.id)
          ? "mobile"
          : project.id === "signaldesk-ai"
            ? "signaldesk"
            : project.id === "nexora-ai-lab"
              ? "nexora"
              : "projects",
      }
    : null;

const clean = items => items.filter(Boolean);
const normalize = value =>
  String(value || "")
    .toLowerCase()
    .replace(/[^\w\s+#./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const contains = (text, values) => values.some(value => text.includes(value));

const TECH = [
  {
    label: "React Native",
    terms: ["react native", "react-native"],
    evidence: "LifeOS and SignalOps Mobile provide direct React Native + TypeScript evidence.",
    projects: [lifeos, signalops],
  },
  {
    label: "TypeScript",
    terms: ["typescript", "type script"],
    evidence: "TypeScript is demonstrated across LifeOS, SignalOps Mobile, SignalDesk and Nexora AI Lab.",
    projects: [lifeos, signalops, signaldesk, nexora],
  },
  {
    label: "Swift / SwiftUI",
    terms: ["swift", "swiftui", "ios"],
    evidence: "PulseBoard and LumaHome provide direct native iOS / SwiftUI project evidence.",
    projects: [pulseboard, lumahome],
  },
  {
    label: "React",
    terms: ["react.js", "reactjs", "react js", "react"],
    evidence: "SignalDesk and Nexora AI Lab provide React-based frontend evidence.",
    projects: [signaldesk, nexora],
  },
  {
    label: "Offline-first architecture",
    terms: ["offline", "sqlite", "sqlcipher", "local first", "local-first"],
    evidence: "LifeOS uses SQLite-backed repositories, migrations, SQLCipher and local-first workflows.",
    projects: [lifeos],
  },
  {
    label: "Redux Toolkit",
    terms: ["redux", "redux toolkit"],
    evidence: "Redux Toolkit is demonstrated in LifeOS and SignalOps Mobile.",
    projects: [lifeos, signalops],
  },
  {
    label: "CI/CD",
    terms: ["ci/cd", "cicd", "github actions", "continuous integration"],
    evidence: "Several portfolio projects use GitHub Actions and automated test/build gates.",
    projects: [lifeos, signalops, signaldesk, lumahome],
  },
  {
    label: "Node.js",
    terms: ["node", "node.js", "nodejs"],
    evidence: "Node.js is listed in the professional backend skill set.",
    projects: [],
  },
  {
    label: "Android / Kotlin",
    terms: ["android", "kotlin", "java"],
    evidence: "Android / Kotlin / Java are listed professional skills; current public portfolio evidence is strongest through cross-platform React Native delivery.",
    projects: [lifeos, signalops],
  },
];

function projectSummary(project) {
  if (!project) return null;
  const proof = (project.highlights || []).slice(0, 3).map(item => `• ${item}`).join("\n");
  return {
    topic: project.id,
    text: `${project.title}\n\n${project.desc}\n\nEngineering evidence:\n${proof}\n\nStack: ${(project.tags || []).slice(0, 8).join(" · ")}`,
    sources: [project.title],
    actions: clean([actionFor(project, `Open ${project.title} case study`)]),
  };
}

function roleFit(question) {
  const q = normalize(question);
  const matched = TECH.filter(item => contains(q, item.terms));
  if (!matched.length) return null;

  const projectMap = new Map();
  matched.forEach(item => item.projects.forEach(project => project && projectMap.set(project.id, project)));
  const projects = [...projectMap.values()];

  return {
    topic: "role-fit",
    text:
      `Based only on portfolio evidence, the strongest matches are ${matched.map(item => item.label).join(", ")}.\n\n` +
      matched.slice(0, 6).map(item => `• ${item.label}: ${item.evidence}`).join("\n") +
      `\n\nFor requirements not demonstrated here, verify them directly with Inzamamul rather than assuming experience.`,
    sources: ["Profile", "Skills", ...projects.slice(0, 4).map(project => project.title)],
    actions: clean([
      ...projects.slice(0, 3).map(project => actionFor(project)),
      { label: "View Résumé", appId: "resume" },
      { label: "Contact Inzamamul", appId: "contact" },
    ]),
  };
}

export function getPortfolioAnswer(question, { lastTopic } = {}) {
  const q = normalize(question);

  if (!q) {
    return { topic: null, text: ASSISTANT_WELCOME, sources: ["Portfolio"], actions: [] };
  }

  const projectMatchers = [
    [lifeos, ["lifeos", "life os"]],
    [signalops, ["signalops", "signal ops"]],
    [pulseboard, ["pulseboard", "pulse board"]],
    [lumahome, ["lumahome", "luma home"]],
    [signaldesk, ["signaldesk", "signal desk"]],
    [nexora, ["nexora"]],
  ];

  for (const [project, terms] of projectMatchers) {
    if (project && contains(q, terms)) return projectSummary(project);
  }

  if (contains(q, ["best project", "strongest project", "projects should", "review first", "top projects", "featured projects"])) {
    return {
      topic: "projects",
      text:
        "For a fast technical review, start with:\n\n" +
        "• LifeOS — strongest React Native architecture / offline-first case study.\n" +
        "• SignalOps Mobile — enterprise-style React Native state, lifecycle and operational metrics.\n" +
        "• PulseBoard — strongest native iOS platform integration.\n" +
        "• SignalDesk — strongest React / TypeScript web case study.",
      sources: ["LifeOS", "SignalOps Mobile", "PulseBoard", "SignalDesk"],
      actions: clean([actionFor(lifeos), actionFor(signalops), actionFor(pulseboard), actionFor(signaldesk)]),
    };
  }

  if (contains(q, ["experience", "background", "years"])) {
    return {
      topic: "experience",
      text:
        `${PROFILE.bio.join("\n\n")}\n\nCurrent portfolio experience entries:\n` +
        EXPERIENCE.map(item => `• ${item.role} — ${item.company} (${item.period})`).join("\n"),
      sources: ["Profile", "Experience"],
      actions: [{ label: "View Résumé", appId: "resume" }, { label: "Contact Inzamamul", appId: "contact" }],
    };
  }

  if (contains(q, ["react native", "mobile engineer", "mobile development"])) {
    return {
      topic: "react-native",
      text:
        "React Native is the strongest specialization represented in the portfolio.\n\n" +
        "LifeOS demonstrates offline-first architecture, Redux Toolkit, SQLite / SQLCipher, on-device AI foundations, tests and native debug validation.\n\n" +
        "SignalOps Mobile demonstrates a typed incident lifecycle, Redux Toolkit, React Navigation, persistence, SLA/MTTA/MTTR derivation, tests and CI.",
      sources: ["LifeOS", "SignalOps Mobile", "Profile"],
      actions: clean([actionFor(lifeos), actionFor(signalops), { label: "Open Skills", appId: "skills" }]),
    };
  }

  if (contains(q, ["native ios", "swift", "swiftui", "ios experience"])) {
    return {
      topic: "ios",
      text:
        "Native iOS evidence is strongest in PulseBoard and LumaHome.\n\n" +
        "PulseBoard uses SwiftUI, SwiftData, Swift Charts, WidgetKit, ActivityKit and App Intents, including Home Screen widgets, Live Activities and Dynamic Island support.\n\n" +
        "LumaHome is a SwiftUI commerce experience with persistent favourites, bag/order state, async flows, Decimal pricing and CI simulator validation.",
      sources: ["PulseBoard", "LumaHome"],
      actions: clean([actionFor(pulseboard), actionFor(lumahome)]),
    };
  }

  if (contains(q, ["offline", "sqlcipher", "sqlite", "local rag", "gguf", "on-device ai"])) {
    return {
      topic: "offline",
      text:
        "LifeOS is the clearest offline-first case study: SQLite-backed source of truth, repository boundaries, migrations, SQLCipher, local domain workflows, deterministic assistant commands and optional on-device GGUF / local retrieval foundations.",
      sources: ["LifeOS"],
      actions: clean([actionFor(lifeos)]),
    };
  }

  if (contains(q, ["engineering labs", "performance", "rendering", "state normalization", "concurrency", "caching", "architecture trade-off", "architecture tradeoff"])) {
    return {
      topic: "engineering-labs",
      text:
        "Mobile Engineering Labs is the supplemental technical-depth repository. It documents focused experiments around React Native performance, rendering, state normalization, testing, concurrency, caching and offline synchronization. It complements the six product case studies rather than replacing them.",
      sources: ["Mobile Engineering Labs", "Skills"],
      actions: [
        { label: "Open Engineering Labs", href: ENGINEERING_LABS_URL },
        { label: "Open Skills", appId: "skills" },
      ],
    };
  }

  if (contains(q, ["contact", "email", "linkedin", "reach"])) {
    return {
      topic: "contact",
      text: `You can reach Inzamamul at ${PROFILE.email}. He is based in ${PROFILE.location} and is open to mobile, React Native and frontend opportunities.`,
      sources: ["Profile"],
      actions: [{ label: "Open Contact", appId: "contact" }],
    };
  }

  if (contains(q, ["open to", "looking for", "opportunit", "role"])) {
    return {
      topic: "roles",
      text:
        "The portfolio is positioned for React Native, mobile and frontend engineering opportunities in the UAE, with React Native as the strongest specialization and supporting native iOS / React evidence.",
      sources: ["Profile", "Portfolio"],
      actions: [{ label: "View Résumé", appId: "resume" }, { label: "Contact Inzamamul", appId: "contact" }],
    };
  }

  if (contains(q, ["hire", "good fit", "fit for", "job requirement", "job description"]) || q.length > 120) {
    const fit = roleFit(q);
    if (fit) return fit;
    return {
      topic: "hire",
      text:
        "The strongest hiring evidence is the combination of React Native depth, cross-platform delivery, native iOS work, local/offline architecture, tests/CI, and complete project case studies. Paste the technologies from your job description and I’ll compare them only against evidence shown in the portfolio.",
      sources: ["Profile", "Projects", "Skills"],
      actions: clean([actionFor(lifeos), actionFor(signalops), { label: "View Résumé", appId: "resume" }]),
    };
  }

  const fit = roleFit(q);
  if (fit) return fit;

  if (lastTopic) {
    const project = byId(lastTopic);
    if (project) return projectSummary(project);
  }

  return {
    topic: "general",
    text:
      "I can help with experience, React Native, native iOS, individual projects, offline-first architecture, technical skills, contact details, or role fit. For a quick review, ask which projects you should review first.",
    sources: ["Portfolio"],
    actions: [{ label: "View Projects", appId: "projects" }, { label: "View Résumé", appId: "resume" }],
  };
}
