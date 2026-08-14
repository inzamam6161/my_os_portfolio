import { useState } from "react";
import { WEB_PROJECTS } from "../../data/projects";
import { colors, font } from "../../styles/tokens";

export default function ProjectsApp() {
  const [selected, setSelected] = useState(0);
  const project = WEB_PROJECTS[selected];

  return (
    <div style={{ fontFamily: font.family }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: "0 0 5px", fontSize: 21 }}>Web & Product Projects</h1>
        <p style={{ color: colors.textMuted, fontSize: 12 }}>Selected public work and product-focused interfaces.</p>
      </div>

      <div className="projects-grid">
        {WEB_PROJECTS.map((item, index) => (
          <button key={item.title} type="button" onClick={() => setSelected(index)} style={{ minHeight: 225, overflow: "hidden", padding: 0, border: selected === index ? `1px solid ${item.color}` : colors.border, borderRadius: 12, background: "rgba(255,255,255,.035)", color: "#fff", cursor: "pointer", textAlign: "left" }}>
            <ProjectPreview project={item} />
            <span style={{ display: "block", padding: 14 }}>
              <strong style={{ display: "block", marginBottom: 5, fontSize: 14 }}>{item.title}</strong>
              <span style={{ color: item.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>{item.category}</span>
            </span>
          </button>
        ))}
      </div>

      {project && (
        <section style={{ marginTop: 16, padding: 18, border: `0.5px solid ${project.color}55`, borderRadius: 12, background: "rgba(255,255,255,.025)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div>
              <h2 style={{ fontSize: 17 }}>{project.title}</h2>
              <p style={{ marginTop: 8, maxWidth: 650, color: colors.textSecondary, fontSize: 12, lineHeight: 1.65 }}>{project.desc}</p>
            </div>
            <a href={project.href} target="_blank" rel="noreferrer" style={{ flexShrink: 0, padding: "7px 10px", border: `0.5px solid ${project.color}77`, borderRadius: 7, color: project.color, textDecoration: "none", fontSize: 11, fontWeight: 700 }}>Open ↗</a>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>{project.tags.map(tag => <span key={tag} style={{ padding: "4px 7px", borderRadius: 5, background: `${project.color}18`, color: project.color, fontSize: 10 }}>{tag}</span>)}</div>
        </section>
      )}
    </div>
  );
}

function ProjectPreview({ project }) {
  if (project.screenshots?.length) {
    return (
      <span className="project-desktop-preview" style={{ display: "block", height: 142, background: `linear-gradient(145deg, ${project.color}2b, rgba(5,5,10,.7))` }}>
        <img className="project-desktop-preview-light" src={project.screenshots[1]?.src || project.screenshots[0].src} alt="" />
        <img className="project-desktop-preview-dark" src={project.screenshots[0].src} alt={project.screenshots[0].alt} />
      </span>
    );
  }
  return <span style={{ height: 142, display: "grid", placeItems: "center", background: `radial-gradient(circle at 50% 50%, ${project.color}44, transparent 65%), #0c0c13`, color: project.color, fontSize: 58, fontWeight: 700 }}>{project.symbol}</span>;
}
