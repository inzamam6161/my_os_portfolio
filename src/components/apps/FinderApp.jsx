// src/components/apps/FinderApp.jsx
import { useState } from "react";
import { font } from "../../styles/tokens";

const SIDEBAR_FOLDERS = [
  { id: "portfolio", icon: "🗂",  label: "Portfolio" },
  { id: "projects",  icon: "💻",  label: "Projects"  },
  { id: "mobile",    icon: "📱",  label: "Mobile"    },
  { id: "docs",      icon: "📝",  label: "Docs"      },
];

const FILES = {
  portfolio: [
    { name: "About Me.md",   icon: "👤", size: "4 KB",   date: "Today"  },
    { name: "Resume.pdf",    icon: "📄", size: "156 KB", date: "May 24" },
    { name: "Portfolio.fig", icon: "🎨", size: "2.1 MB", date: "May 22" },
  ],
  projects: [
    { name: "PulseBoard iOS", icon: "📱", size: "SwiftUI", date: "Today", folder: true },
    { name: "macOS Portfolio", icon: "🖥", size: "React", date: "Current", folder: true },
  ],
  mobile: [
    { name: "PulseBoard", icon: "◉", size: "Native iOS", date: "Today", folder: true },
    { name: "React Native Experience", icon: "⚛️", size: "5 years", date: "Current", folder: true },
  ],
  docs: [
    { name: "React Native.md", icon: "📱", size: "Core skill", date: "Current" },
    { name: "JavaScript.md", icon: "📋", size: "Core skill", date: "Current" },
    { name: "Career Roadmap.md", icon: "🗺", size: "UAE", date: "Current" },
  ],
};

export default function FinderApp() {
  const [activeSidebar, setActiveSidebar] = useState("portfolio");

  return (
    <div style={{
      display:  "flex",
      height:   "100%",
      margin:   "-22px -26px",
      fontFamily: font.family,
    }}>
      {/* Sidebar */}
      <div style={{
        width:        160,
        background:   "rgba(255,255,255,0.03)",
        borderRight:  "0.5px solid rgba(255,255,255,0.07)",
        padding:      "16px 10px",
        flexShrink:   0,
      }}>
        <p style={{ margin: "0 0 8px 6px", fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
          Favourites
        </p>
        {SIDEBAR_FOLDERS.map(f => (
          <div
            key={f.id}
            onClick={() => setActiveSidebar(f.id)}
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        8,
              padding:    "6px 8px",
              borderRadius: 6,
              cursor:     "default",
              background: activeSidebar === f.id ? "rgba(94,92,230,0.25)" : "transparent",
              color:      activeSidebar === f.id ? "#fff"                  : "rgba(255,255,255,0.6)",
              fontSize:   13,
              marginBottom: 2,
              transition: "all 0.1s",
            }}
          >
            {f.icon} {f.label}
          </div>
        ))}
      </div>

      {/* File list */}
      <div style={{ flex: 1, padding: "16px 20px", overflow: "auto" }}>
        {/* Column headers */}
        <div style={{
          display:        "grid",
          gridTemplateColumns: "auto 1fr 80px 80px",
          gap:            "0 16px",
          marginBottom:   8,
          fontSize:       11,
          color:          "rgba(255,255,255,0.3)",
          borderBottom:   "0.5px solid rgba(255,255,255,0.06)",
          paddingBottom:  8,
        }}>
          <span />
          <span>Name</span>
          <span style={{ textAlign: "right" }}>Size</span>
          <span style={{ textAlign: "right" }}>Modified</span>
        </div>

        {/* File rows */}
        {(FILES[activeSidebar] || []).map((file, i) => (
          <div
            key={i}
            style={{
              display:        "grid",
              gridTemplateColumns: "auto 1fr 80px 80px",
              gap:            "0 16px",
              padding:        "7px 4px",
              borderRadius:   6,
              fontSize:       13,
              color:          "rgba(255,255,255,0.75)",
              transition:     "background 0.1s",
              cursor:         "default",
              alignItems:     "center",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 18 }}>{file.icon}</span>
            <span>{file.name}</span>
            <span style={{ textAlign: "right", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{file.size}</span>
            <span style={{ textAlign: "right", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{file.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
