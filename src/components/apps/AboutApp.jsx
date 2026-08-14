import { PROFILE } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

export default function AboutApp() {
  return (
    <div style={{ fontFamily: font.family }}>
      <div className="about-hero">
        <div className="avatar" aria-hidden="true">IH</div>
        <div>
          <p style={{ marginBottom: 7, color: colors.cyan, fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Based in {PROFILE.location}</p>
          <h1 style={{ margin: 0, fontSize: "clamp(24px, 5vw, 38px)", letterSpacing: "-.035em" }}>{PROFILE.name}</h1>
          <p style={{ marginTop: 7, color: colors.textSecondary, fontSize: 14 }}>{PROFILE.title}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 22 }}>
        <Stat value="5+ years" label="Software development" />
        <Stat value="iOS + Android" label="Cross-platform delivery" />
        <Stat value="UAE" label="Current location" />
      </div>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Profile</h2>
        {PROFILE.bio.map(paragraph => (
          <p key={paragraph} style={{ margin: "0 0 11px", color: colors.textSecondary, fontSize: 13, lineHeight: 1.75 }}>{paragraph}</p>
        ))}
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <ExternalLink href={PROFILE.github}>GitHub ↗</ExternalLink>
        <ExternalLink href={PROFILE.linkedin}>LinkedIn ↗</ExternalLink>
        <ExternalLink href={`mailto:${PROFILE.email}`}>Email me</ExternalLink>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div style={{ padding: 14, border: colors.border, borderRadius: 10, background: "rgba(255,255,255,.04)" }}>
      <strong style={{ display: "block", marginBottom: 4, fontSize: 15 }}>{value}</strong>
      <span style={{ color: colors.textMuted, fontSize: 11 }}>{label}</span>
    </div>
  );
}

function ExternalLink({ href, children }) {
  return <a href={href} target="_blank" rel="noreferrer" style={{ padding: "8px 11px", border: colors.border, borderRadius: 8, background: colors.accentSubtle, color: "#c9c8ff", textDecoration: "none", fontSize: 12, fontWeight: 600 }}>{children}</a>;
}

const sectionStyle = { marginBottom: 22, padding: 18, border: colors.border, borderRadius: 12, background: "rgba(255,255,255,.025)" };
const headingStyle = { margin: "0 0 12px", fontSize: 15 };
