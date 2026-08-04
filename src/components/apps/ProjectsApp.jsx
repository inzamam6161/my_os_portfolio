// src/components/apps/ProjectsApp.jsx
import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { font } from "../../styles/tokens";

export default function ProjectsApp() {
  const projects = [...MOBILE_PROJECTS, ...WEB_PROJECTS];

  return (
    <div>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: font.family }}>
        Selected engineering projects — {projects.length} featured
      </p>
      <div className="projects-grid">
        {projects.map(p => <ProjectCard key={p.title} project={p} />)}
      </div>
    </div>
  );
}

function ProjectCard({ project: p }) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noreferrer"
      style={{
        background:   "rgba(255,255,255,0.04)",
        border:       "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding:      16,
        cursor:       "pointer",
        transition:   "all 0.15s",
        fontFamily:   font.family,
        display:      "block",
        textDecoration: "none",
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
      <div style={{
        height: 112,
        margin: "-4px -4px 14px",
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 110%, ${p.color}66, transparent 62%), linear-gradient(145deg, ${p.color}22, rgba(255,255,255,0.025))`,
        border: "0.5px solid rgba(255,255,255,0.06)",
      }}>
        {p.screenshots?.length ? (
          <img
            src={p.screenshots[0].src}
            alt=""
            style={{ width: 92, marginTop: 8, borderRadius: "13px 13px 0 0", boxShadow: "0 12px 30px rgba(0,0,0,0.55)" }}
          />
        ) : (
          <span style={{ alignSelf: "center", fontSize: 46, fontWeight: 500, color: p.color }}>{p.symbol}</span>
        )}
      </div>
      <div style={{ marginBottom: 7, color: p.color, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
        {p.category}
      </div>
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
    </a>
  );
}
