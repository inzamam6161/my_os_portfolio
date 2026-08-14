import { EXPERIENCE, PROFILE, SKILL_SECTIONS } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

export default function ResumeApp() {
  return (
    <div style={{ fontFamily: font.family }}>
      <header className="resume-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: "0 0 5px", fontSize: 24 }}>{PROFILE.name}</h1>
          <p style={{ color: colors.cyan, fontSize: 12 }}>{PROFILE.title}</p>
          <p style={{ marginTop: 6, color: colors.textMuted, fontSize: 11 }}>{PROFILE.location} · {PROFILE.email}</p>
        </div>
        <a href={`mailto:${PROFILE.email}?subject=Software%20Engineering%20Opportunity`} style={{ padding: "9px 12px", border: colors.borderFocused, borderRadius: 8, background: colors.accentSubtle, color: "#d1d0ff", textDecoration: "none", fontSize: 11, fontWeight: 700 }}>Request résumé</a>
      </header>

      <section style={{ marginBottom: 25 }}>
        <h2 style={sectionHeading}>Professional Summary</h2>
        <p style={bodyStyle}>{PROFILE.bio[0]}</p>
      </section>

      <section style={{ marginBottom: 25 }}>
        <h2 style={sectionHeading}>Experience</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {EXPERIENCE.map(item => (
            <article key={`${item.role}-${item.period}`} style={{ display: "grid", gridTemplateColumns: "12px 1fr", gap: 11, padding: 15, border: colors.border, borderRadius: 10, background: "rgba(255,255,255,.025)" }}>
              <span style={{ width: 9, height: 9, marginTop: 4, borderRadius: "50%", background: item.dot, boxShadow: `0 0 0 4px ${item.dot}22` }} />
              <div>
                <div className="experience-title">
                  <div><strong style={{ fontSize: 13 }}>{item.role}</strong><span style={{ marginLeft: 7, color: colors.textMuted, fontSize: 11 }}>· {item.company}</span></div>
                  <span style={{ color: colors.textMuted, fontSize: 10 }}>{item.period}</span>
                </div>
                <p style={{ ...bodyStyle, marginTop: 8, fontSize: 11 }}>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 style={sectionHeading}>Core Capabilities</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {SKILL_SECTIONS.flatMap(section => section.skills).map(skill => (
            <span key={skill.name} style={{ padding: "5px 8px", border: colors.border, borderRadius: 6, background: "rgba(255,255,255,.04)", color: colors.textSecondary, fontSize: 10 }}>{skill.name}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

const sectionHeading = { margin: "0 0 11px", color: colors.textPrimary, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase" };
const bodyStyle = { margin: 0, color: colors.textSecondary, fontSize: 12, lineHeight: 1.7 };
