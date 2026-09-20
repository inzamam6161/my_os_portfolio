import { WEB_PROJECTS } from "../../data/projects";
import { colors, font } from "../../styles/tokens";

export default function ProjectsApp({ selectedProjectId, fixedProjectId }) {
  const resolvedProjectId = fixedProjectId || selectedProjectId;
  const project =
    WEB_PROJECTS.find(item => item.id === resolvedProjectId) || WEB_PROJECTS[0];

  if (!project) return null;

  return (
    <div className="project-showcase" style={{ fontFamily: font.family }}>
      <header className="project-showcase__header">
        <div>
          <p
            className="project-showcase__category"
            style={{ color: project.color }}
          >
            {project.category}
          </p>
          <h1>{project.title}</h1>
          <p className="project-showcase__description">{project.desc}</p>
        </div>

        <div className="project-showcase__actions">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="project-showcase__primary"
              style={{
                background: project.color,
                boxShadow: `0 10px 28px ${project.color}33`,
              }}
            >
              Open Live App ↗
            </a>
          )}

          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="project-showcase__secondary"
            style={{
              borderColor: `${project.color}66`,
              color: project.color,
            }}
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {project.stats?.length > 0 && (
        <section className="project-showcase__stats">
          {project.stats.map(stat => (
            <div key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </section>
      )}

      {project.screenshots?.length > 0 && (
        <section className="project-showcase__gallery">
          {project.screenshots.map((screenshot, index) => (
            <figure
              key={screenshot.src}
              className={index === 0 ? "is-featured" : ""}
            >
              <img src={screenshot.src} alt={screenshot.alt} />
              {screenshot.label && <figcaption>{screenshot.label}</figcaption>}
            </figure>
          ))}
        </section>
      )}

      <section className="project-showcase__content-grid">
        <div>
          <p className="project-showcase__section-label">ENGINEERING</p>
          <h2>What this project demonstrates</h2>

          <div className="project-showcase__highlights">
            {(project.highlights || []).map((highlight, index) => (
              <article key={highlight}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{highlight}</p>
              </article>
            ))}
          </div>
        </div>

        <aside>
          <p className="project-showcase__section-label">STACK</p>
          <h2>Technology</h2>

          <div className="project-showcase__tags">
            {project.tags.map(tag => (
              <span
                key={tag}
                style={{
                  background: `${project.color}16`,
                  borderColor: `${project.color}30`,
                  color: project.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="project-showcase__note">
            <strong>Portfolio note</strong>
            <p style={{ color: colors.textSecondary }}>
              {project.portfolioNote ||
                "The implementation is intentionally transparent about which capabilities are deterministic and which would require additional production services or model integration."}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
