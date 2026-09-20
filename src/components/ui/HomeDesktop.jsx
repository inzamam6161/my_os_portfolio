import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { PROFILE } from "../../data/profile";

const FEATURED_PROJECTS = [
  ...MOBILE_PROJECTS.map(project => ({ ...project, appId: "mobile" })),
  ...WEB_PROJECTS.map(project => ({
    ...project,
    appId: project.id === "nexora-ai-lab" ? "nexora" : "projects",
  })),
].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

export default function HomeDesktop({ onOpenProject, onOpenApp }) {
  return (
    <main className="desktop-home">
      <section className="desktop-home-hero">
        <div>
          <p className="desktop-home-eyebrow">SOFTWARE ENGINEER · UAE</p>
          <h1>{PROFILE.name}</h1>
          <h2>Senior Mobile / React Native Engineer</h2>
          <p className="desktop-home-summary">
            Building production mobile and frontend applications across React Native, iOS, Android and React.
          </p>

          <div className="desktop-home-stack">
            <span>React Native</span>
            <span>TypeScript</span>
            <span>iOS / Swift</span>
            <span>Android / Kotlin</span>
            <span>React</span>
          </div>

          <div className="desktop-home-actions">
            <button
              type="button"
              className="desktop-primary-action"
              onClick={() => onOpenApp("assistant")}
            >
              ✨ Ask About Me
            </button>

            <button
              type="button"
              className="desktop-secondary-action"
              onClick={() => onOpenApp("resume")}
            >
              View Résumé
            </button>

            <button
              type="button"
              className="desktop-secondary-action"
              onClick={() => onOpenApp("contact")}
            >
              Contact Me
            </button>

            <a
              className="desktop-secondary-action"
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="desktop-home-status">
          <span className="desktop-status-dot" aria-hidden="true" />
          <div>
            <strong>Based in UAE</strong>
            <span>Open to software engineering opportunities</span>
          </div>
        </div>
      </section>

      <section className="desktop-featured">
        <div className="desktop-section-header">
          <div>
            <p>SELECTED WORK</p>
            <h2>Featured Projects</h2>
          </div>
          <span>Tap a project to open its case study</span>
        </div>

        <div className="desktop-project-grid">
          {FEATURED_PROJECTS.map(project => {
            const image = project.screenshots?.[0];
            const phonePreview = project.previewType === "phone";

            return (
              <button
                key={project.id}
                type="button"
                className="desktop-project-card"
                aria-label={`Open ${project.title} case study`}
                onClick={() => onOpenProject(project.id, project.appId)}
              >
                <div className={`desktop-project-preview${phonePreview ? " desktop-project-preview-phone" : ""}`}>
                  {image ? <img src={image.src} alt="" /> : <span>{project.symbol || project.icon}</span>}
                </div>
                <div className="desktop-project-copy">
                  <div>
                    <span className="desktop-project-category" style={{ color: project.color }}>{project.category}</span>
                    <strong>{project.title}</strong>
                  </div>
                  <span className="desktop-project-arrow" aria-hidden="true">↗</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
