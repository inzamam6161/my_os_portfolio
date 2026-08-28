import { WEB_PROJECTS } from "../../data/projects";
import { colors, font } from "../../styles/tokens";

export default function ProjectsApp({ selectedProjectId }) {
  const project =
    WEB_PROJECTS.find(item => item.id === selectedProjectId) || WEB_PROJECTS[0];

  if (!project) return null;

  return (
    <div style={{ fontFamily: font.family }}>
      <div style={{ marginBottom: 18 }}>
        <p style={{ margin: 0, color: project.color, fontSize: 10, fontWeight: 800, letterSpacing: ".09em", textTransform: "uppercase" }}>
          {project.category}
        </p>
        <h1 style={{ margin: "6px 0", fontSize: 24 }}>{project.title}</h1>
        <p style={{ maxWidth: 680, color: colors.textSecondary, fontSize: 13, lineHeight: 1.7 }}>
          {project.desc}
        </p>
      </div>

      {project.screenshots?.length > 0 && (
        <div className="web-project-gallery">
          {project.screenshots.map(screenshot => (
            <img key={screenshot.src} src={screenshot.src} alt={screenshot.alt} />
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 18 }}>
        {project.tags.map(tag => (
          <span key={tag} style={{ padding: "5px 8px", borderRadius: 6, background: `${project.color}18`, color: project.color, fontSize: 11 }}>
            {tag}
          </span>
        ))}
      </div>

      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        style={{ display: "inline-flex", marginTop: 20, padding: "9px 12px", border: `1px solid ${project.color}66`, borderRadius: 8, color: project.color, textDecoration: "none", fontSize: 12, fontWeight: 700 }}
      >
        View project on GitHub ↗
      </a>
    </div>
  );
}
