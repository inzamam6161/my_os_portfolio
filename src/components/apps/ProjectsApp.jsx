import { useMemo, useState } from "react";
import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { font } from "../../styles/tokens";

const ALL_PROJECTS = [...MOBILE_PROJECTS, ...WEB_PROJECTS];

const FILTERS = [
  ["all", "All", ALL_PROJECTS.length],
  ["react-native", "React Native", MOBILE_PROJECTS.filter(project => project.category.includes("React Native")).length],
  ["native-ios", "Native iOS", MOBILE_PROJECTS.filter(project => project.platform === "Native iOS").length],
  ["web", "Web", WEB_PROJECTS.length],
];

function projectGroup(project) {
  if (WEB_PROJECTS.some(item => item.id === project.id)) return "web";
  if (project.platform === "Native iOS") return "native-ios";
  return "react-native";
}

export default function ProjectsApp({ fixedProjectId }) {
  const [filter, setFilter] = useState("all");
  const [activeProjectId, setActiveProjectId] = useState(null);

  const fixedProject = fixedProjectId
    ? ALL_PROJECTS.find(project => project.id === fixedProjectId)
    : null;

  const activeProject =
    fixedProject || ALL_PROJECTS.find(project => project.id === activeProjectId);

  const visibleProjects = useMemo(() => {
    if (filter === "all") return ALL_PROJECTS;
    return ALL_PROJECTS.filter(project => projectGroup(project) === filter);
  }, [filter]);

  if (activeProject) {
    return (
      <ProjectDetail
        project={activeProject}
        onBack={fixedProject ? null : () => setActiveProjectId(null)}
      />
    );
  }

  return (
    <div className="portfolio-projects-hub" style={{ fontFamily: font.family }}>
      <header className="portfolio-projects-hero">
        <div>
          <p className="portfolio-app-kicker">ENGINEERING PORTFOLIO</p>
          <h1>Projects</h1>
          <p>
            Six public case studies across React Native, native iOS and modern web.
            Open any project to inspect its architecture, screenshots, engineering highlights and stack.
          </p>
        </div>

        <div className="portfolio-projects-summary">
          <strong>{ALL_PROJECTS.length}</strong>
          <span>Public case studies</span>
          <small>Mobile · iOS · Web</small>
        </div>
      </header>

      <nav className="portfolio-project-filters" aria-label="Project filters">
        {FILTERS.map(([id, label, count]) => (
          <button
            type="button"
            key={id}
            className={filter === id ? "active" : ""}
            onClick={() => setFilter(id)}
          >
            {label}<span>{count}</span>
          </button>
        ))}
      </nav>

      <section className="portfolio-project-gallery">
        {visibleProjects.map(project => {
          const preview = project.screenshots?.[0];

          return (
            <button
              type="button"
              className="portfolio-project-tile"
              key={project.id}
              onClick={() => setActiveProjectId(project.id)}
              aria-label={`Open ${project.title} project`}
            >
              <div className={`portfolio-project-visual ${project.previewType === "phone" ? "is-phone" : ""}`}>
                {preview ? <img src={preview.src} alt="" /> : <span>{project.icon || project.symbol || "◉"}</span>}
                <i style={{ background: project.color }} />
              </div>

              <div className="portfolio-project-tile-copy">
                <div className="portfolio-project-tile-top">
                  <span style={{ color: project.color }}>{project.category}</span>
                  <b>↗</b>
                </div>

                <h2>{project.title}</h2>
                <p>{project.desc}</p>

                <div className="portfolio-project-tile-tags">
                  {(project.tags || []).slice(0, 4).map(tag => <small key={tag}>{tag}</small>)}
                </div>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}

function ProjectDetail({ project, onBack }) {
  return (
    <div className="project-showcase project-showcase--polished" style={{ fontFamily: font.family }}>
      {onBack && (
        <button type="button" className="portfolio-back-button" onClick={onBack}>
          ← All projects
        </button>
      )}

      <header className="project-showcase__header">
        <div>
          <p className="project-showcase__category" style={{ color: project.color }}>{project.category}</p>
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
              style={{ background: project.color, boxShadow: `0 10px 28px ${project.color}33` }}
            >
              Open Live App ↗
            </a>
          )}
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="project-showcase__secondary"
            style={{ borderColor: `${project.color}66`, color: project.color }}
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {project.stats?.length > 0 && (
        <section className="project-showcase__stats">
          {project.stats.map(stat => (
            <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>
          ))}
        </section>
      )}

      {project.screenshots?.length > 0 && (
        <section className="project-showcase__gallery">
          {project.screenshots.map((screenshot, index) => (
            <figure key={screenshot.src} className={index === 0 ? "is-featured" : ""}>
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
            {(project.tags || []).map(tag => (
              <span key={tag} style={{ background: `${project.color}16`, borderColor: `${project.color}30`, color: project.color }}>
                {tag}
              </span>
            ))}
          </div>

          <div className="project-showcase__note">
            <strong>Portfolio note</strong>
            <p>{project.portfolioNote}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
