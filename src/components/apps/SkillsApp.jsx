import { colors, font } from "../../styles/tokens";

const GROUPS = [
  {
    title: "Primary",
    note: "Strongest portfolio and professional positioning",
    items: [
      ["React Native", "LifeOS · SignalOps Mobile"],
      ["JavaScript / TypeScript", "Mobile + web projects"],
      ["Mobile architecture", "Offline-first · state · navigation"],
    ],
  },
  {
    title: "Native Mobile",
    note: "Direct iOS portfolio evidence + Android professional skills",
    items: [
      ["Swift / SwiftUI", "PulseBoard · LumaHome"],
      ["iOS platform APIs", "WidgetKit · ActivityKit · App Intents"],
      ["Android / Kotlin / Java", "Professional skill set · RN Android delivery"],
    ],
  },
  {
    title: "Frontend & Product",
    note: "Modern responsive product interfaces",
    items: [
      ["React", "SignalDesk · Nexora AI Lab"],
      ["Responsive UI", "Desktop · tablet · mobile"],
      ["Product thinking", "Evidence-based case studies"],
    ],
  },
  {
    title: "Data, Backend & Delivery",
    note: "Integration and production-supporting skills",
    items: [
      ["Node.js / REST APIs", "Backend integration experience"],
      ["SQLite / SQLCipher", "LifeOS offline source of truth"],
      ["Git / GitHub / CI", "Automated test + build workflows"],
      ["MongoDB / Firebase", "Backend & systems skill set"],
    ],
  },
];

export default function SkillsApp() {
  return (
    <div className="evidence-skills" style={{ fontFamily: font.family }}>
      <div className="evidence-skills-head">
        <p>ENGINEERING SKILLS</p>
        <h1>Evidence over percentages.</h1>
        <span>Skills are grouped by where they are demonstrated rather than arbitrary proficiency scores.</span>
      </div>

      <div className="evidence-skill-grid">
        {GROUPS.map(group => (
          <section key={group.title}>
            <div className="evidence-skill-heading">
              <h2>{group.title}</h2>
              <p>{group.note}</p>
            </div>
            <div>
              {group.items.map(([name, proof]) => (
                <article key={name}>
                  <strong>{name}</strong>
                  <span>{proof}</span>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="evidence-skill-note" style={{ color: colors.textMuted }}>
        For role-specific requirements, use Ask About Me to compare the requested stack with portfolio evidence.
      </p>
    </div>
  );
}
