// src/components/apps/ResumeApp.jsx
import { PROFILE, EXPERIENCE } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

export default function ResumeApp() {
  return (
    <div style={{ color: colors.textSecondary, fontFamily: font.family }}>
      <ResumeHeader />
      <Summary />
      <ExperienceSection />
      <Education />
      <Highlights />
    </div>
  );
}

function ResumeHeader() {
  return (
    <div style={{
      background:   colors.accentSubtle,
      border:       `0.5px solid ${colors.accentBorder}`,
      borderRadius: 10,
      padding:      "16px 20px",
      marginBottom: 20,
      display:      "flex",
      justifyContent: "space-between",
      alignItems:   "center",
    }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.4 }}>
          {PROFILE.name}
        </h2>
        <p style={{ margin: "3px 0 0", fontSize: 14, color: colors.accent, fontWeight: 500 }}>
          {PROFILE.title}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: colors.textMuted }}>
          {PROFILE.email} · {PROFILE.location}
        </p>
      </div>
      <button style={{
        background:   colors.accent,
        color:        "#fff",
        border:       "none",
        borderRadius: 7,
        padding:      "7px 16px",
        fontSize:     13,
        fontWeight:   600,
        cursor:       "pointer",
      }}>
        ↓ PDF
      </button>
    </div>
  );
}

function Summary() {
  return (
    <section style={{ marginBottom: 18 }}>
      <SectionLabel>Summary</SectionLabel>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: colors.textMuted }}>
        7+ years building high-impact mobile and web products. Specialist in Swift/SwiftUI,
        React Native, and distributed systems. 2M+ app downloads across the App Store & Google Play.
      </p>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section style={{ marginBottom: 18 }}>
      <SectionLabel>Experience</SectionLabel>
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.07)" }} />
        {EXPERIENCE.map((exp, i) => (
          <div key={i} style={{ display: "flex", gap: 18, marginBottom: 16, position: "relative" }}>
            <div style={{
              width: 15, height: 15, borderRadius: "50%",
              background: exp.dot, flexShrink: 0, marginTop: 2,
              border: "2px solid rgba(22,22,28,0.9)",
              position: "relative", zIndex: 1,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{exp.role}</span>
                  <span style={{ fontSize: 13, color: colors.textMuted, marginLeft: 8 }}>@ {exp.company}</span>
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{exp.period}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: colors.textMuted }}>{exp.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section style={{ marginBottom: 18 }}>
      <SectionLabel>Education</SectionLabel>
      <div style={{
        background:     "rgba(255,255,255,0.04)",
        border:         "0.5px solid rgba(255,255,255,0.08)",
        borderRadius:   8,
        padding:        "12px 16px",
        display:        "flex",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>B.S. Computer Science</div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>University of California, Berkeley</div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>2013 — 2017</div>
      </div>
    </section>
  );
}

const HIGHLIGHT_ITEMS = [
  { val: "2M+",  label: "App downloads"     },
  { val: "7+",   label: "Years experience"  },
  { val: "10+",  label: "Apps shipped"      },
  { val: "4.8★", label: "Avg App Store rating" },
  { val: "3",    label: "Apple Featured"    },
  { val: "40+",  label: "OSS repos"         },
];

function Highlights() {
  return (
    <section>
      <SectionLabel>Highlights</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {HIGHLIGHT_ITEMS.map(h => (
          <div key={h.label} style={{
            background:  "rgba(255,255,255,0.04)",
            border:      "0.5px solid rgba(255,255,255,0.07)",
            borderRadius: 8,
            padding:     "10px 14px",
            textAlign:   "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{h.val}</div>
            <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{h.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      margin:        "0 0 10px",
      fontSize:      10,
      fontWeight:    600,
      letterSpacing: 1,
      color:         "rgba(255,255,255,0.3)",
      textTransform: "uppercase",
    }}>
      {children}
    </p>
  );
}
