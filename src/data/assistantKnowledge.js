import {
  PROFILE,
  EXPERIENCE,
  SKILL_SECTIONS,
} from "./profile";

import {
  MOBILE_PROJECTS,
  WEB_PROJECTS,
} from "./projects";

/* ─────────────────────────────────────────────
   Recruiter Assistant
   Grounded only in portfolio data.
───────────────────────────────────────────── */

export const ASSISTANT_WELCOME =
  `Hi — I’m Inzamamul’s portfolio assistant.

I can help you quickly evaluate his experience, React Native background, native mobile skills, projects, architecture decisions, and suitability for a role.

You can also paste a job requirement and I’ll compare it with the evidence available in this portfolio.`;

export const ASSISTANT_SUGGESTIONS = [
  "Why should we hire Inzamamul?",
  "Tell me about his React Native experience.",
  "What is his strongest project?",
  "Does he have native iOS and Android experience?",
  "How does he handle offline-first applications?",
  "Which projects should I review first?",
];

/* ─────────────────────────────────────────────
   Derived portfolio data
───────────────────────────────────────────── */

const ALL_PROJECTS = [
  ...MOBILE_PROJECTS.map(project => ({
    ...project,
    appId: "mobile",
  })),
  ...WEB_PROJECTS.map(project => ({
    ...project,
    appId: "projects",
  })),
];

const projectById = id =>
  ALL_PROJECTS.find(project => project.id === id);

const lifeOS = projectById("lifeos");
const pulseBoard = projectById("pulseboard");
const signalOps = projectById("signalops-mobile");
const signalDesk = projectById("signaldesk-ai");

const allSkills = SKILL_SECTIONS.flatMap(section =>
  section.skills.map(skill => ({
    ...skill,
    category: section.category,
  }))
);

const normalize = value =>
  String(value || "")
    .toLowerCase()
    .replace(/[^\w\s+#./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (text, values) =>
  values.some(value => text.includes(normalize(value)));

const formatList = values => {
  if (!values.length) return "";

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${
    values[values.length - 1]
  }`;
};

const projectAction = (project, label) => {
  if (!project) return null;

  return {
    label: label || `Open ${project.title}`,
    projectId: project.id,
    appId: project.appId,
  };
};

const cleanActions = actions => actions.filter(Boolean);

/* ─────────────────────────────────────────────
   Technology evidence
───────────────────────────────────────────── */

const TECHNOLOGY_EVIDENCE = [
  {
    id: "react-native",
    label: "React Native",
    terms: [
      "react native",
      "react-native",
      "rn",
    ],
    evidence:
      "React Native is one of the strongest technologies represented in the portfolio. LifeOS and SignalOps Mobile are both cross-platform React Native applications.",
    projects: [lifeOS, signalOps],
  },

  {
    id: "typescript",
    label: "TypeScript",
    terms: [
      "typescript",
      "type script",
      "ts",
    ],
    evidence:
      "TypeScript is demonstrated across LifeOS, SignalOps Mobile, and SignalDesk AI.",
    projects: [lifeOS, signalOps, signalDesk],
  },

  {
    id: "redux",
    label: "Redux Toolkit",
    terms: [
      "redux",
      "redux toolkit",
      "rtk",
    ],
    evidence:
      "Redux Toolkit is used in LifeOS and SignalOps Mobile.",
    projects: [lifeOS, signalOps],
  },

  {
    id: "ios",
    label: "iOS / Swift",
    terms: [
      "ios",
      "swift",
      "swiftui",
      "swift ui",
    ],
    evidence:
      "Native iOS experience is represented by PulseBoard, built with Swift, SwiftUI, SwiftData, Swift Charts, and MVVM.",
    projects: [pulseBoard],
  },

  {
    id: "android",
    label: "Android / Kotlin / Java",
    terms: [
      "android",
      "kotlin",
      "java",
    ],
    evidence:
      "Android, Kotlin, and Java are listed in the mobile-development skill set, and React Native projects target both Android and iOS.",
    projects: [lifeOS, signalOps],
  },

  {
    id: "react",
    label: "React.js",
    terms: [
      "react.js",
      "reactjs",
      "react js",
      "react",
    ],
    evidence:
      "React.js is part of the frontend skill set and is used in SignalDesk AI.",
    projects: [signalDesk],
  },

  {
    id: "javascript",
    label: "JavaScript",
    terms: [
      "javascript",
      "java script",
      "js",
    ],
    evidence:
      "JavaScript is one of the strongest frontend technologies listed in the portfolio.",
    projects: [],
  },

  {
    id: "node",
    label: "Node.js",
    terms: [
      "node.js",
      "nodejs",
      "node js",
    ],
    evidence:
      "Node.js is listed under Backend & Systems skills and is also mentioned in the professional profile.",
    projects: [],
  },

  {
    id: "mongodb",
    label: "MongoDB",
    terms: [
      "mongodb",
      "mongo db",
      "mongo",
    ],
    evidence:
      "MongoDB is listed under Backend & Systems skills.",
    projects: [],
  },

  {
    id: "firebase",
    label: "Firebase",
    terms: [
      "firebase",
    ],
    evidence:
      "Firebase is listed under Backend & Systems skills.",
    projects: [],
  },

  {
    id: "rest",
    label: "REST API integration",
    terms: [
      "rest",
      "rest api",
      "api integration",
      "apis",
    ],
    evidence:
      "REST API integration is explicitly listed as a backend and systems skill.",
    projects: [],
  },

  {
    id: "offline",
    label: "Offline-first architecture",
    terms: [
      "offline",
      "offline first",
      "offline-first",
      "sqlite",
      "sqlcipher",
    ],
    evidence:
      "LifeOS demonstrates an offline-first architecture using SQLite-backed persistence, SQLCipher, repositories, migrations, and local domain workflows.",
    projects: [lifeOS],
  },

  {
    id: "ai",
    label: "On-device AI / Local RAG",
    terms: [
      "ai",
      "artificial intelligence",
      "rag",
      "local rag",
      "gguf",
      "llm",
      "on device ai",
      "on-device ai",
    ],
    evidence:
      "LifeOS includes deterministic assistant commands with optional on-device GGUF inference, personal memory, local embeddings, and retrieval-augmented responses.",
    projects: [lifeOS],
  },

  {
    id: "navigation",
    label: "React Navigation",
    terms: [
      "react navigation",
      "navigation",
    ],
    evidence:
      "SignalOps Mobile explicitly demonstrates React Navigation and type-safe mobile navigation.",
    projects: [signalOps],
  },

  {
    id: "mvvm",
    label: "MVVM",
    terms: [
      "mvvm",
    ],
    evidence:
      "PulseBoard uses MVVM as its native iOS architecture.",
    projects: [pulseBoard],
  },

  {
    id: "cicd",
    label: "CI/CD",
    terms: [
      "ci/cd",
      "cicd",
      "continuous integration",
      "continuous delivery",
    ],
    evidence:
      "CI/CD is listed in the Cloud & DevOps skill set, and LifeOS includes CI foundations.",
    projects: [lifeOS],
  },

  {
    id: "deployment",
    label: "Application deployment",
    terms: [
      "deployment",
      "deploy",
      "app store",
      "play store",
      "google play",
    ],
    evidence:
      "The portfolio states experience across application deployment and publishing to Google Play and the Apple App Store.",
    projects: [],
  },

  {
    id: "responsive",
    label: "Responsive UI",
    terms: [
      "responsive",
      "responsive ui",
      "mobile friendly",
    ],
    evidence:
      "Responsive UI is listed as a frontend skill and is demonstrated by SignalDesk AI.",
    projects: [signalDesk],
  },
];

/* ─────────────────────────────────────────────
   Shared response helpers
───────────────────────────────────────────── */

const baseActions = () => [
  {
    label: "View Résumé",
    appId: "resume",
  },
  {
    label: "Open Skills",
    appId: "skills",
  },
  {
    label: "Contact Inzamamul",
    appId: "contact",
  },
];

const projectSources = projects =>
  projects
    .filter(Boolean)
    .map(project => project.title);

const skillNames = category => {
  const section = SKILL_SECTIONS.find(
    item => item.category === category
  );

  return section?.skills.map(skill => skill.name) || [];
};

/* ─────────────────────────────────────────────
   Job / requirement comparison
───────────────────────────────────────────── */

function analyseRoleFit(question) {
  const normalizedQuestion = normalize(question);

  const matched = TECHNOLOGY_EVIDENCE.filter(item =>
    includesAny(normalizedQuestion, item.terms)
  );

  if (!matched.length) {
    return null;
  }

  const labels = matched.map(item => item.label);

  const projectMap = new Map();

  matched.forEach(item => {
    item.projects.forEach(project => {
      if (project) {
        projectMap.set(project.id, project);
      }
    });
  });

  const matchedProjects = [...projectMap.values()];

  const evidence = matched
    .slice(0, 5)
    .map(item => `• ${item.label}: ${item.evidence}`)
    .join("\n");

  return {
    topic: "role-fit",

    text:
      `Based on the portfolio evidence, Inzamamul appears to align well with a role requiring ${formatList(
        labels
      )}.

Relevant evidence:

${evidence}

His profile shows 5 years of software-development experience across mobile and web, with React Native as a core specialization.

For requirements not explicitly represented in the portfolio, I would recommend verifying them directly with him rather than assuming experience that is not documented.`,

    sources: [
      "Profile",
      "Skills",
      ...projectSources(matchedProjects).slice(0, 4),
    ],

    actions: cleanActions([
      ...matchedProjects
        .slice(0, 3)
        .map(project =>
          projectAction(
            project,
            `Review ${project.title}`
          )
        ),

      {
        label: "Open Skills",
        appId: "skills",
      },

      {
        label: "View Résumé",
        appId: "resume",
      },
    ]),
  };
}

/* ─────────────────────────────────────────────
   Project responses
───────────────────────────────────────────── */

function lifeOSAnswer() {
  return {
    topic: "lifeos",

    text:
      `LifeOS is Inzamamul’s strongest architecture-focused React Native project.

It is an offline-first personal intelligence platform covering planning, tasks, reminders, finance, shopping, workouts, study, goals, habits, and private on-device AI.

The engineering depth includes:

• React Native + TypeScript
• Redux Toolkit
• SQLite-backed source of truth
• SQLCipher encrypted persistence
• Repository-based data architecture
• Schema migrations
• Offline-first workflows
• Notifications
• Biometric security
• Encrypted backups
• Local embeddings and Personal Memory
• Optional on-device GGUF inference
• Local RAG

It is especially useful for evaluating his React Native architecture, offline-first engineering, local persistence, and on-device AI work.`,

    sources: [
      "LifeOS",
      "Projects",
    ],

    actions: cleanActions([
      projectAction(
        lifeOS,
        "Open LifeOS case study"
      ),

      {
        label: "Open Mobile Work",
        appId: "mobile",
      },
    ]),
  };
}

function pulseBoardAnswer() {
  return {
    topic: "pulseboard",

    text:
      `PulseBoard demonstrates Inzamamul’s native iOS work.

It is a focus and productivity dashboard built with:

• Swift
• SwiftUI
• SwiftData
• Swift Charts
• MVVM

The application includes configurable focus sessions, persistent activity history, search and filtering, weekly/monthly analytics, background recovery, and adaptive light/dark interfaces.

This project is the clearest portfolio evidence of his native iOS capabilities.`,

    sources: [
      "PulseBoard",
      "Mobile Projects",
    ],

    actions: cleanActions([
      projectAction(
        pulseBoard,
        "Open PulseBoard case study"
      ),
    ]),
  };
}

function signalOpsAnswer() {
  return {
    topic: "signalops",

    text:
      `SignalOps Mobile is a cross-platform React Native incident-operations application for iOS and Android.

Its portfolio evidence includes:

• React Native
• TypeScript
• Redux Toolkit
• React Navigation
• Async Storage
• Search and priority filtering
• Incident acknowledgement and resolution workflows
• Service-health monitoring
• Persisted preferences
• Type-safe navigation
• Optimized FlatList rendering

It is a good project to review when evaluating production-style React Native application structure and mobile state management.`,

    sources: [
      "SignalOps Mobile",
      "Mobile Projects",
    ],

    actions: cleanActions([
      projectAction(
        signalOps,
        "Open SignalOps Mobile"
      ),
    ]),
  };
}

function signalDeskAnswer() {
  return {
    topic: "signaldesk",

    text:
      `SignalDesk AI demonstrates Inzamamul’s frontend and product-oriented web work.

The project is a customer-intelligence dashboard for analysing feedback, surfacing sentiment trends, and converting customer signals into actionable recommendations.

Technologies represented in the portfolio include:

• React
• Next.js
• TypeScript
• AI-oriented workflows
• Responsive UI

It complements his mobile portfolio by showing React-based frontend development and responsive product UI work.`,

    sources: [
      "SignalDesk AI",
      "Web Projects",
    ],

    actions: cleanActions([
      projectAction(
        signalDesk,
        "Open SignalDesk AI"
      ),

      {
        label: "Open Projects",
        appId: "projects",
      },
    ]),
  };
}

/* ─────────────────────────────────────────────
   Topic responses
───────────────────────────────────────────── */

function hiringAnswer() {
  return {
    topic: "hire",

    text:
      `Inzamamul brings 5 years of software-development experience across mobile and web, with React Native as his strongest specialization.

The strongest reasons to consider him are:

• Cross-platform mobile experience with React Native
• Native iOS and Android knowledge
• React.js and frontend experience
• Full application lifecycle exposure — UI, APIs, testing, deployment, and store publishing
• Offline-first and local-data architecture demonstrated in LifeOS
• Redux Toolkit and TypeScript demonstrated across mobile projects
• Native Swift / SwiftUI work demonstrated by PulseBoard
• Practical portfolio projects that can be reviewed directly

For a React Native, mobile, or frontend engineering role, the portfolio provides evidence across both implementation and architecture rather than only small UI demos.`,

    sources: [
      "Profile",
      "Skills",
      "LifeOS",
      "PulseBoard",
      "SignalOps Mobile",
    ],

    actions: cleanActions([
      projectAction(
        lifeOS,
        "Review LifeOS"
      ),

      projectAction(
        signalOps,
        "Review SignalOps"
      ),

      {
        label: "View Résumé",
        appId: "resume",
      },
    ]),
  };
}

function reactNativeAnswer() {
  return {
    topic: "react-native",

    text:
      `React Native is the strongest specialization represented in Inzamamul’s portfolio.

His profile states 5 years of software-development experience across mobile and web, with React Native as a core technology.

The clearest portfolio evidence is:

• LifeOS — a large offline-first React Native application using TypeScript, Redux Toolkit, SQLite / SQLCipher, local AI, notifications, security, and multiple product domains.

• SignalOps Mobile — a React Native operations dashboard using TypeScript, Redux Toolkit, React Navigation, persisted preferences, optimized lists, and cross-platform iOS/Android workflows.

His broader profile also includes application lifecycle experience from UI implementation and API integration through testing, deployment, and app-store publishing.`,

    sources: [
      "Profile",
      "LifeOS",
      "SignalOps Mobile",
    ],

    actions: cleanActions([
      projectAction(
        lifeOS,
        "Open LifeOS"
      ),

      projectAction(
        signalOps,
        "Open SignalOps"
      ),

      {
        label: "Open Skills",
        appId: "skills",
      },
    ]),
  };
}

function mobileAnswer() {
  const skills = skillNames(
    "Mobile Development"
  );

  return {
    topic: "mobile",

    text:
      `Inzamamul’s mobile-development profile covers both cross-platform and native development.

The current portfolio lists:

${skills.map(skill => `• ${skill}`).join("\n")}

His React Native projects target iOS and Android, while PulseBoard demonstrates native iOS development with Swift and SwiftUI.

The portfolio also states experience with application deployment and publishing through Google Play and the Apple App Store.`,

    sources: [
      "Skills",
      "LifeOS",
      "PulseBoard",
      "SignalOps Mobile",
    ],

    actions: cleanActions([
      {
        label: "Open Mobile Work",
        appId: "mobile",
      },

      {
        label: "Open Skills",
        appId: "skills",
      },
    ]),
  };
}

function nativeAnswer() {
  return {
    topic: "native",

    text:
      `Yes. The portfolio shows both native iOS and Android knowledge.

For iOS, PulseBoard provides direct project evidence using Swift, SwiftUI, SwiftData, Swift Charts, and MVVM.

For Android, Android / Kotlin / Java are listed in the mobile-development skill set. His React Native work also targets both Android and iOS.

The strongest direct native project evidence currently visible in the portfolio is PulseBoard on iOS.`,

    sources: [
      "Skills",
      "PulseBoard",
      "LifeOS",
      "SignalOps Mobile",
    ],

    actions: cleanActions([
      projectAction(
        pulseBoard,
        "Open native iOS project"
      ),

      {
        label: "Open Mobile Work",
        appId: "mobile",
      },
    ]),
  };
}

function offlineAnswer() {
  return {
    topic: "offline",

    text:
      `Offline-first engineering is most clearly demonstrated by LifeOS.

Instead of treating local storage as a temporary cache, LifeOS uses a SQLite-backed local source of truth with repository-based access, schema migrations, encrypted SQLCipher persistence, and domain workflows designed to continue operating without network availability.

The same project also combines local data with notifications, encrypted backups, biometric security, diagnostics, and optional on-device AI.

This makes LifeOS the best project to review for Inzamamul’s offline architecture and local-data engineering decisions.`,

    sources: [
      "LifeOS",
    ],

    actions: cleanActions([
      projectAction(
        lifeOS,
        "Open LifeOS architecture"
      ),
    ]),
  };
}

function aiAnswer() {
  return {
    topic: "ai",

    text:
      `The strongest AI-related engineering evidence in the portfolio is inside LifeOS.

LifeOS includes deterministic assistant commands plus optional:

• On-device GGUF inference
• Personal Memory
• Local embeddings
• Retrieval-augmented responses
• Private local processing

SignalDesk AI also demonstrates an AI-oriented customer-intelligence product workflow on the web.

The portfolio therefore shows AI being integrated into products rather than presented as a standalone chatbot demo.`,

    sources: [
      "LifeOS",
      "SignalDesk AI",
    ],

    actions: cleanActions([
      projectAction(
        lifeOS,
        "Review LifeOS AI"
      ),

      projectAction(
        signalDesk,
        "Review SignalDesk"
      ),
    ]),
  };
}

function frontendAnswer() {
  const skills = skillNames(
    "Web & Frontend"
  );

  return {
    topic: "frontend",

    text:
      `Inzamamul also has frontend development experience alongside mobile engineering.

The portfolio lists:

${skills.map(skill => `• ${skill}`).join("\n")}

SignalDesk AI provides React / TypeScript / responsive-web project evidence, while this portfolio itself demonstrates a custom interactive React desktop interface.

His profile therefore supports frontend opportunities in addition to React Native and mobile roles.`,

    sources: [
      "Profile",
      "Skills",
      "SignalDesk AI",
    ],

    actions: cleanActions([
      projectAction(
        signalDesk,
        "Open SignalDesk AI"
      ),

      {
        label: "Open Projects",
        appId: "projects",
      },

      {
        label: "Open Skills",
        appId: "skills",
      },
    ]),
  };
}

function backendAnswer() {
  const skills = skillNames(
    "Backend & Systems"
  );

  return {
    topic: "backend",

    text:
      `Inzamamul’s portfolio is primarily mobile/frontend focused, but it also lists backend and systems experience.

The documented skills are:

${skills.map(skill => `• ${skill}`).join("\n")}

His profile also explicitly includes Node.js and API integration experience.

For a backend-heavy role, I would recommend discussing the depth of that experience directly with him, because the portfolio’s strongest project evidence is currently mobile and frontend.`,

    sources: [
      "Profile",
      "Skills",
    ],

    actions: [
      {
        label: "Open Skills",
        appId: "skills",
      },

      {
        label: "Contact Inzamamul",
        appId: "contact",
      },
    ],
  };
}

function strongestProjectAnswer() {
  return {
    topic: "strongest-project",

    text:
      `LifeOS is the strongest overall portfolio project if the goal is to assess engineering depth.

It combines:

• React Native and TypeScript
• Redux Toolkit
• Offline-first architecture
• SQLite / SQLCipher
• Repository patterns and schema migrations
• Notifications
• Security and encrypted persistence
• Multiple product domains
• On-device AI and Local RAG

For native iOS specifically, PulseBoard is the stronger project.

For a smaller production-style React Native application, SignalOps Mobile is also worth reviewing.`,

    sources: [
      "LifeOS",
      "PulseBoard",
      "SignalOps Mobile",
    ],

    actions: cleanActions([
      projectAction(
        lifeOS,
        "Start with LifeOS"
      ),

      projectAction(
        pulseBoard,
        "Review PulseBoard"
      ),

      projectAction(
        signalOps,
        "Review SignalOps"
      ),
    ]),
  };
}

function projectsAnswer() {
  return {
    topic: "projects",

    text:
      `For a recruiter or hiring manager, I would review the portfolio projects in this order:

1. LifeOS — best evidence of React Native architecture, offline-first design, persistence, security, and local AI.

2. SignalOps Mobile — strong evidence of React Native, TypeScript, Redux Toolkit, navigation, lists, and production-style mobile workflows.

3. PulseBoard — best evidence of native iOS development with Swift and SwiftUI.

4. SignalDesk AI — frontend / React / TypeScript and responsive web-product evidence.

Together they provide a broader picture than reviewing only one technology area.`,

    sources: [
      "Projects",
      "LifeOS",
      "SignalOps Mobile",
      "PulseBoard",
      "SignalDesk AI",
    ],

    actions: cleanActions([
      projectAction(
        lifeOS,
        "Open LifeOS"
      ),

      projectAction(
        signalOps,
        "Open SignalOps"
      ),

      projectAction(
        pulseBoard,
        "Open PulseBoard"
      ),

      projectAction(
        signalDesk,
        "Open SignalDesk"
      ),
    ]),
  };
}

function experienceAnswer() {
  const experienceText = EXPERIENCE.map(
    item =>
      `• ${item.role} — ${item.company} (${item.period})`
  ).join("\n");

  return {
    topic: "experience",

    text:
      `The portfolio describes Inzamamul as having 5 years of software-development experience across mobile and web applications.

Current experience information shown in the portfolio:

${experienceText}

His software-development background includes React Native, React.js, Android, iOS, JavaScript, Node.js, application integration, testing, deployment, and store-release workflows.`,

    sources: [
      "Profile",
      "Experience",
    ],

    actions: [
      {
        label: "View Résumé",
        appId: "resume",
      },

      {
        label: "Open Skills",
        appId: "skills",
      },
    ],
  };
}

function currentRoleAnswer() {
  const current =
    EXPERIENCE.find(item =>
      normalize(item.period).includes(
        "present"
      )
    ) || EXPERIENCE[0];

  return {
    topic: "current-role",

    text:
      `The current portfolio lists Inzamamul’s present role as ${current.role} at ${current.company}, from ${current.period}.

The portfolio notes that this role involves administrative and technical support while he continues professional software development and upskilling.

His previous software-development experience and current portfolio projects are the more relevant areas to evaluate for a software-engineering opportunity.`,

    sources: [
      "Experience",
      "Profile",
    ],

    actions: [
      {
        label: "View Résumé",
        appId: "resume",
      },

      {
        label: "Review Projects",
        appId: "projects",
      },
    ],
  };
}

function locationAnswer() {
  return {
    topic: "location",

    text:
      `${PROFILE.name} is currently based in ${PROFILE.location}.

The portfolio states that he is based in the UAE and open to React Native, mobile, frontend, and software-engineering opportunities.`,

    sources: [
      "Profile",
    ],

    actions: [
      {
        label: "Contact Inzamamul",
        appId: "contact",
      },
    ],
  };
}

function contactAnswer() {
  return {
    topic: "contact",

    text:
      `You can contact Inzamamul directly through the Contact section of this portfolio.

The portfolio also provides links to his GitHub and LinkedIn profiles for reviewing his work and professional background.`,

    sources: [
      "Profile",
    ],

    actions: [
      {
        label: "Open Contact",
        appId: "contact",
      },

      {
        label: "View Résumé",
        appId: "resume",
      },
    ],
  };
}

function educationAnswer() {
  return {
    topic: "education",

    text:
      `The current portfolio does not list a university degree or other formal education details.

I won’t infer or invent education information that is not included in the portfolio.

The profile is instead focused on 5 years of professional software-development experience, technical skills, and reviewable project evidence.`,

    sources: [
      "Portfolio",
      "Profile",
    ],

    actions: [
      {
        label: "View Résumé",
        appId: "resume",
      },

      {
        label: "Contact Inzamamul",
        appId: "contact",
      },
    ],
  };
}

function salaryAnswer() {
  return {
    topic: "salary",

    text:
      `Salary expectations are not included in the public portfolio.

That is something I would recommend discussing directly with Inzamamul rather than providing an unverified figure here.`,

    sources: [
      "Portfolio",
    ],

    actions: [
      {
        label: "Contact Inzamamul",
        appId: "contact",
      },
    ],
  };
}

function rolesAnswer() {
  return {
    topic: "roles",

    text:
      `Based on the current portfolio evidence, the strongest role alignment is:

• React Native Engineer
• Mobile Software Engineer
• Cross-platform Mobile Engineer
• Frontend Engineer with strong React experience

The portfolio also supports native-mobile discussion because it includes Swift / SwiftUI work and Android / Kotlin / Java skills.

The strongest overall positioning is mobile engineering with React Native at the center.`,

    sources: [
      "Profile",
      "Skills",
      "Projects",
    ],

    actions: baseActions(),
  };
}

/* ─────────────────────────────────────────────
   Follow-up handling
───────────────────────────────────────────── */

function followUpAnswer(lastTopic) {
  switch (lastTopic) {
    case "lifeos":
    case "offline":
    case "ai":
      return lifeOSAnswer();

    case "react-native":
      return reactNativeAnswer();

    case "native":
      return nativeAnswer();

    case "pulseboard":
      return pulseBoardAnswer();

    case "signalops":
      return signalOpsAnswer();

    case "signaldesk":
      return signalDeskAnswer();

    case "projects":
    case "strongest-project":
      return projectsAnswer();

    case "experience":
      return experienceAnswer();

    case "frontend":
      return frontendAnswer();

    case "backend":
      return backendAnswer();

    default:
      return null;
  }
}

/* ─────────────────────────────────────────────
   Main answer engine
───────────────────────────────────────────── */

export function getPortfolioAnswer(
  question,
  context = {}
) {
  const q = normalize(question);

  if (!q) {
    return {
      topic: null,
      text:
        "Ask me about Inzamamul’s experience, React Native work, projects, skills, architecture, or suitability for a role.",
      sources: ["Portfolio"],
      actions: [],
    };
  }

  /* Greetings */

  if (
    includesAny(q, [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ]) &&
    q.split(" ").length <= 5
  ) {
    return {
      topic: "greeting",

      text:
        `Hi! I can help you evaluate ${PROFILE.name}'s software-engineering background.

Try asking about React Native, mobile development, LifeOS, native iOS, offline-first architecture, or paste a job description for a portfolio-based fit check.`,

      sources: ["Portfolio"],

      actions: [
        {
          label: "View Résumé",
          appId: "resume",
        },

        {
          label: "Open Projects",
          appId: "projects",
        },
      ],
    };
  }

  /* Follow-up */

  if (
    includesAny(q, [
      "tell me more",
      "more details",
      "explain more",
      "go deeper",
      "more about that",
    ])
  ) {
    const followUp =
      followUpAnswer(context.lastTopic);

    if (followUp) {
      return followUp;
    }
  }

  /* Specific projects first */

  if (
    includesAny(q, [
      "lifeos",
      "life os",
    ])
  ) {
    return lifeOSAnswer();
  }

  if (
    includesAny(q, [
      "pulseboard",
      "pulse board",
    ])
  ) {
    return pulseBoardAnswer();
  }

  if (
    includesAny(q, [
      "signalops",
      "signal ops",
      "signalops mobile",
    ])
  ) {
    return signalOpsAnswer();
  }

  if (
    includesAny(q, [
      "signaldesk",
      "signal desk",
      "signaldesk ai",
    ])
  ) {
    return signalDeskAnswer();
  }

  /* Job-description / fit comparison */

  const looksLikeRoleFit =
    includesAny(q, [
      "good fit",
      "role fit",
      "fit for",
      "job requirement",
      "job requirements",
      "requirements",
      "we need",
      "we are looking",
      "looking for",
      "candidate",
      "suitable",
      "match this role",
      "match for",
    ]) ||
    question.length > 220;

  if (looksLikeRoleFit) {
    const roleFit =
      analyseRoleFit(question);

    if (roleFit) {
      return roleFit;
    }
  }

  /* Hiring */

  if (
    includesAny(q, [
      "why should we hire",
      "why hire",
      "why should i hire",
      "strength as candidate",
      "why choose",
      "what makes him strong",
    ])
  ) {
    return hiringAnswer();
  }

  /* Strongest project */

  if (
    includesAny(q, [
      "strongest project",
      "best project",
      "most impressive project",
      "flagship project",
    ])
  ) {
    return strongestProjectAnswer();
  }

  /* Project recommendations */

  if (
    includesAny(q, [
      "which projects",
      "what projects",
      "projects should i review",
      "projects should we review",
      "show projects",
      "portfolio projects",
    ])
  ) {
    return projectsAnswer();
  }

  /* React Native */

  if (
    includesAny(q, [
      "react native",
      "react-native",
      "rn experience",
    ])
  ) {
    return reactNativeAnswer();
  }

  /* Offline */

  if (
    includesAny(q, [
      "offline first",
      "offline-first",
      "offline architecture",
      "offline app",
      "sqlite",
      "sqlcipher",
      "local database",
      "local storage architecture",
    ])
  ) {
    return offlineAnswer();
  }

  /* Native */

  if (
    includesAny(q, [
      "native ios",
      "native android",
      "swift",
      "swiftui",
      "kotlin",
      "android experience",
      "ios experience",
      "native mobile",
      "ios and android",
      "ios / android",
    ])
  ) {
    return nativeAnswer();
  }

  /* AI */

  if (
    includesAny(q, [
      "on device ai",
      "on-device ai",
      "local ai",
      "local rag",
      "gguf",
      "embedding",
      "rag",
      "artificial intelligence",
      "ai experience",
    ])
  ) {
    return aiAnswer();
  }

  /* Mobile */

  if (
    includesAny(q, [
      "mobile experience",
      "mobile development",
      "mobile engineer",
      "mobile skills",
      "mobile background",
    ])
  ) {
    return mobileAnswer();
  }

  /* Frontend */

  if (
    includesAny(q, [
      "frontend",
      "front end",
      "react.js",
      "reactjs",
      "react experience",
      "web development",
      "web experience",
    ])
  ) {
    return frontendAnswer();
  }

  /* Backend */

  if (
    includesAny(q, [
      "backend",
      "back end",
      "node.js",
      "nodejs",
      "mongodb",
      "firebase",
      "api experience",
    ])
  ) {
    return backendAnswer();
  }

  /* Current role */

  if (
    includesAny(q, [
      "current job",
      "current role",
      "currently working",
      "present role",
      "where does he work",
      "current employer",
    ])
  ) {
    return currentRoleAnswer();
  }

  /* Experience */

  if (
    includesAny(q, [
      "experience",
      "years of experience",
      "work history",
      "professional background",
      "employment history",
    ])
  ) {
    return experienceAnswer();
  }

  /* Roles */

  if (
    includesAny(q, [
      "best role",
      "best suited",
      "suitable roles",
      "which role",
      "what role",
      "roles is he",
      "position",
    ])
  ) {
    return rolesAnswer();
  }

  /* Location */

  if (
    includesAny(q, [
      "location",
      "where is he",
      "where does he live",
      "uae",
      "dubai",
      "abu dhabi",
      "al ain",
    ])
  ) {
    return locationAnswer();
  }

  /* Education */

  if (
    includesAny(q, [
      "education",
      "degree",
      "university",
      "college",
      "qualification",
      "academic",
    ])
  ) {
    return educationAnswer();
  }

  /* Salary */

  if (
    includesAny(q, [
      "salary",
      "expected salary",
      "salary expectation",
      "compensation",
      "pay expectation",
    ])
  ) {
    return salaryAnswer();
  }

  /* Contact */

  if (
    includesAny(q, [
      "contact",
      "email",
      "phone",
      "linkedin",
      "reach him",
      "reach out",
      "interview",
    ])
  ) {
    return contactAnswer();
  }

  /* Generic technology evidence */

  const matchingTechnology =
    TECHNOLOGY_EVIDENCE.find(item =>
      includesAny(q, item.terms)
    );

  if (matchingTechnology) {
    const projectNames =
      projectSources(
        matchingTechnology.projects
      );

    return {
      topic: matchingTechnology.id,

      text:
        `${matchingTechnology.evidence}${
          projectNames.length
            ? `\n\nRelevant portfolio evidence: ${formatList(
                projectNames
              )}.`
            : ""
        }`,

      sources: [
        "Skills",
        ...projectNames,
      ],

      actions: cleanActions([
        ...matchingTechnology.projects
          .slice(0, 2)
          .map(project =>
            projectAction(
              project,
              `Open ${project.title}`
            )
          ),

        {
          label: "Open Skills",
          appId: "skills",
        },
      ]),
    };
  }

  /* Fallback */

  return {
    topic: "unknown",

    text:
      `I don’t have enough verified portfolio information to answer that confidently.

I’m intentionally restricted to information represented in Inzamamul’s portfolio so I don’t invent experience or credentials.

I can answer about:

• React Native and mobile engineering
• iOS / Swift and Android
• LifeOS
• PulseBoard
• SignalOps Mobile
• SignalDesk AI
• Offline-first architecture
• Frontend and backend skills
• Professional experience
• Role suitability
• Contact information

You can also paste a job description or technical requirements and I’ll compare them with the portfolio evidence.`,

    sources: [
      "Portfolio",
    ],

    actions: [
      {
        label: "Open Projects",
        appId: "projects",
      },

      {
        label: "Open Skills",
        appId: "skills",
      },

      {
        label: "View Résumé",
        appId: "resume",
      },
    ],
  };
}