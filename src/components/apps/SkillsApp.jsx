import { SKILL_SECTIONS } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

export default function SkillsApp() {
  return (
    <div style={{ fontFamily: font.family }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 21 }}>Engineering Skills</h1>
      <p style={{ marginBottom: 20, color: colors.textMuted, fontSize: 12 }}>Production experience across mobile, frontend, backend integrations, and delivery.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
        {SKILL_SECTIONS.map(section => (
          <section key={section.category} style={{ padding: 16, border: colors.border, borderRadius: 12, background: "rgba(255,255,255,.035)" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 15px", fontSize: 14 }}>
              <span aria-hidden="true">{section.icon}</span>{section.category}
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {section.skills.map(skill => (
                <div key={skill.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6, fontSize: 11 }}>
                    <span>{skill.name}</span>
                    <span style={{ color: colors.textMuted }}>{skill.level}%</span>
                  </div>
                  <div style={{ height: 5, overflow: "hidden", borderRadius: 999, background: "rgba(255,255,255,.08)" }}>
                    <div style={{ width: `${skill.level}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${section.color}, ${section.color}99)` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
