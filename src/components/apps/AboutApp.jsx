// src/components/apps/AboutApp.jsx
import { PROFILE } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

export default function AboutApp() {
  return (
    <div style={{ color: colors.textSecondary, fontFamily: font.family }}>
      {/* Hero row */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{
          width: 84, height: 84, borderRadius: "50%",
          background:  "linear-gradient(135deg, #5E5CE6, #BF5AF2)",
          display:     "flex", alignItems: "center", justifyContent: "center",
          fontSize:    38, flexShrink: 0,
          boxShadow:   "0 8px 24px rgba(94,92,230,0.4)",
        }}>
          👨‍💻
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5, color: "#fff" }}>
            {PROFILE.name}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 16, color: colors.accent, fontWeight: 500 }}>
            {PROFILE.title}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: colors.textMuted }}>
            {PROFILE.location} · Open to opportunities
          </p>
        </div>
      </div>

      {/* Bio */}
      {PROFILE.bio.map((para, i) => (
        <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: colors.textSecondary, margin: "0 0 14px" }}>
          {i === 1
            ? <>{para.replace("2M+ times", "")}<strong style={{ color: "#fff" }}>2M+ times</strong>{" across the App Store and Google Play. I care deeply about performance, accessibility, and delightful user experiences."}</>
            : para}
        </p>
      ))}

      {/* Badge chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {PROFILE.badges.map(badge => (
          <span key={badge} style={{
            background:  colors.accentSubtle,
            border:      `0.5px solid ${colors.accentBorder}`,
            borderRadius: 6,
            padding:     "4px 12px",
            fontSize:    12,
            color:       "#A09EF5",
          }}>
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
