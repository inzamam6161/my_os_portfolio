import { PROFILE } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

const actions = [
  { label: "GitHub", href: PROFILE.github },
  { label: "LinkedIn", href: PROFILE.linkedin },
  { label: "Email me", href: `mailto:${PROFILE.email}` },
];

export default function AboutApp() {
  return (
    <div style={{ color: colors.textSecondary, fontFamily: font.family, maxWidth: 720 }}>
      <div className="about-hero">
        <div className="avatar" aria-hidden="true">👨‍💻</div>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(26px, 5vw, 34px)", fontWeight: 750, letterSpacing: -0.8, color: "#fff" }}>
            {PROFILE.name}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 16, color: colors.accent, fontWeight: 600 }}>
            {PROFILE.title}
          </p>
          <p style={{ margin: "7px 0 0", fontSize: 13, color: colors.textMuted }}>
            {PROFILE.location} · Open to opportunities
          </p>
        </div>
      </div>

      {PROFILE.bio.map((paragraph) => (
        <p key={paragraph} style={{ fontSize: 15, lineHeight: 1.75, color: colors.textSecondary, margin: "0 0 14px" }}>
          {paragraph}
        </p>
      ))}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
        {actions.map((action, index) => (
          <a key={action.label} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            style={{ textDecoration: "none", padding: "9px 15px", borderRadius: 8, fontSize: 13, fontWeight: 650,
              color: "#fff", background: index === 0 ? colors.accent : "rgba(255,255,255,.07)",
              border: index === 0 ? "none" : "1px solid rgba(255,255,255,.12)" }}>
            {action.label} {index < 2 ? "↗" : "→"}
          </a>
        ))}
      </div>
    </div>
  );
}
