// src/components/apps/MobileApp.jsx
import { useState } from "react";
import { MOBILE_PROJECTS } from "../../data/projects";
import { font } from "../../styles/tokens";

export default function MobileApp() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex !== null ? MOBILE_PROJECTS[selectedIndex] : null;

  return (
    <div>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: font.family }}>
        iOS & Android apps · {MOBILE_PROJECTS.length} shipped · 2M+ total downloads
      </p>

      {/* Expanded detail panel */}
      {selected && (
        <MobileDetail
          project={selected}
          onClose={() => setSelectedIndex(null)}
        />
      )}

      {/* 3-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {MOBILE_PROJECTS.map((p, i) => (
          <MobileCard
            key={p.title}
            project={p}
            isSelected={selectedIndex === i}
            onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Expanded detail with phone mockup ────────────────────────
function MobileDetail({ project: p, onClose }) {
  return (
    <div style={{
      display:      "flex",
      gap:          20,
      marginBottom: 20,
      background:   "rgba(255,255,255,0.03)",
      border:       `0.5px solid ${p.color}44`,
      borderRadius: 12,
      padding:      "16px 20px",
      alignItems:   "center",
      fontFamily:   font.family,
    }}>
      {/* Phone mockup */}
      <div style={{
        width:      80,
        flexShrink: 0,
        background: "#1c1c22",
        borderRadius: 16,
        border:     "2px solid rgba(255,255,255,0.12)",
        padding:    "10px 6px",
        boxShadow:  "0 12px 32px rgba(0,0,0,0.5)",
      }}>
        <div style={{
          background:     p.color + "22",
          borderRadius:   10,
          height:         110,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap: 6,
        }}>
          <span style={{ fontSize: 28 }}>{p.icon}</span>
          <span style={{ fontSize: 8, color: p.color, fontWeight: 600 }}>{p.title}</span>
        </div>
        {/* Home bar */}
        <div style={{ margin: "8px auto 0", width: 28, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2 }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>{p.icon} {p.title}</span>
            <span style={{
              marginLeft: 8, fontSize: 12, color: p.color,
              background: p.color + "22", padding: "2px 8px", borderRadius: 4,
            }}>
              {p.platform}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.65)" }}>{p.desc}</p>

        <div style={{ display: "flex", gap: 18, marginBottom: 12 }}>
          {Object.entries(p.stats).map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>{k}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {p.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 4,
              background: p.color + "22", color: p.color, border: `0.5px solid ${p.color}44`,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Small grid card ───────────────────────────────────────────
function MobileCard({ project: p, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:   isSelected ? p.color + "18" : "rgba(255,255,255,0.04)",
        border:       `0.5px solid ${isSelected ? p.color + "66" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 10,
        padding:      14,
        cursor:       "pointer",
        transition:   "all 0.15s",
        fontFamily:   font.family,
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = p.color + "44";
          e.currentTarget.style.background  = "rgba(255,255,255,0.07)";
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.background  = "rgba(255,255,255,0.04)";
        }
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 6 }}>{p.icon}</div>
      <div style={{ fontWeight: 600, fontSize: 14, color: "#fff",                   marginBottom: 3 }}>{p.title}</div>
      <div style={{ fontSize: 11,                  color: p.color,                  marginBottom: 6 }}>{p.platform}</div>
      <div style={{ fontSize: 11,                  color: "rgba(255,255,255,0.4)" }}>{p.stats.downloads} · {p.stats.rating}</div>
    </div>
  );
}
