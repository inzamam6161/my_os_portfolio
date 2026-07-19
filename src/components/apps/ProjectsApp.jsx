// src/components/apps/ProjectsApp.jsx
import { WEB_PROJECTS } from "../../data/projects";
import { font } from "../../styles/tokens";

export default function ProjectsApp() {
  return (
    <div>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: font.family }}>
        Web & infrastructure projects — {WEB_PROJECTS.length} featured
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {WEB_PROJECTS.map(p => <ProjectCard key={p.title} project={p} />)}
      </div>
    </div>
  );
}

function ProjectCard({ project: p }) {
  return (
    <div
      style={{
        background:   "rgba(255,255,255,0.04)",
        border:       "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding:      16,
        cursor:       "pointer",
        transition:   "all 0.15s",
        fontFamily:   font.family,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = p.color + "55";
        e.currentTarget.style.background  = "rgba(255,255,255,0.07)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background  = "rgba(255,255,255,0.04)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>{p.title}</span>
        <span style={{ color: p.color, fontSize: 15 }}>↗</span>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>
        {p.desc}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {p.tags.map(tag => (
          <span key={tag} style={{
            fontSize:   11,
            padding:    "2px 8px",
            borderRadius: 4,
            background: p.color + "22",
            color:      p.color,
            border:     `0.5px solid ${p.color}44`,
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
