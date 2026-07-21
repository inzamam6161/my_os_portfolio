import { PROFILE, EXPERIENCE } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

export default function ResumeApp() {
  return (
    <div style={{ color: colors.textSecondary, fontFamily: font.family }}>
      <div className="resume-header">
        <div><h2 style={{ margin: 0, color: "#fff", fontSize: 24 }}>{PROFILE.name}</h2>
          <p style={{ margin: "5px 0", color: colors.accent }}>{PROFILE.title}</p>
          <small style={{ color: colors.textMuted }}>{PROFILE.email} · {PROFILE.phone} · {PROFILE.location}</small>
        </div>
        <a href={`mailto:${PROFILE.email}?subject=React Native opportunity`} style={{ background: colors.accent, color: "#fff", textDecoration: "none", padding: "9px 14px", borderRadius: 8, fontSize: 13, fontWeight: 650 }}>Contact me</a>
      </div>
      <Section title="Professional summary"><p style={textStyle}>{PROFILE.bio.join(" ")}</p></Section>
      <Section title="Experience">
        {EXPERIENCE.map((item) => <article key={item.role + item.company} style={{ padding: "0 0 16px 18px", borderLeft: `2px solid ${item.dot}` }}>
          <div className="experience-title"><strong style={{ color: "#fff" }}>{item.role} · {item.company}</strong><span>{item.period}</span></div>
          <p style={textStyle}>{item.desc}</p>
        </article>)}
      </Section>
      <Section title="Core expertise"><p style={textStyle}>React Native · JavaScript · React.js · Android · Kotlin/Java · iOS · Swift · Node.js · REST APIs · Git · App Store and Google Play deployment</p></Section>
      <p style={{ ...textStyle, padding: 12, borderRadius: 8, background: "rgba(94,92,230,.12)" }}>Full ATS-friendly resume available on request.</p>
    </div>
  );
}

const textStyle = { margin: "5px 0", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.62)" };
function Section({ title, children }) { return <section style={{ marginTop: 22 }}><h3 style={{ margin: "0 0 12px", color: "rgba(255,255,255,.42)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{title}</h3>{children}</section>; }
