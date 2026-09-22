import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { PROFILE } from "../../data/profile";
import HomeAssistantPanel from "./HomeAssistantPanel";

const ALL_PROJECTS = [
  ...MOBILE_PROJECTS.map(project => ({ ...project, appId: "mobile" })),
  ...WEB_PROJECTS.map(project => ({
    ...project,
    appId:
      project.id === "signaldesk-ai"
        ? "signaldesk"
        : project.id === "nexora-ai-lab"
          ? "nexora"
          : "projects",
  })),
];

const FEATURED_IDS = ["lifeos", "signalops-mobile", "pulseboard", "signaldesk-ai"];
const FEATURED_PROJECTS = FEATURED_IDS
  .map(id => ALL_PROJECTS.find(project => project.id === id))
  .filter(Boolean);

const SKILL_PROOF = [
  { label: "React Native", proof: "LifeOS · SignalOps" },
  { label: "TypeScript", proof: "Mobile + Web" },
  { label: "Swift / SwiftUI", proof: "PulseBoard · LumaHome" },
  { label: "React", proof: "SignalDesk · Nexora" },
  { label: "Offline-first", proof: "SQLite · SQLCipher" },
  { label: "Quality", proof: "Tests · GitHub Actions" },
];

export default function HomeDesktop({ onOpenProject, onOpenApp }) {
  return (
    <main className="glass-home">
      <div className="glass-layout">
        <section className="glass-primary">
          <section className="glass-hero">
            <div className="glass-hero-copy">
              <p className="glass-eyebrow">SOFTWARE ENGINEER · UAE</p>
              <div className="glass-availability"><span /> Open to opportunities</div>
              <h1>{PROFILE.name}</h1>
              <h2>React Native Engineer <span>•</span> Mobile <span>•</span> Frontend</h2>
              <p className="glass-summary">
                Building polished mobile and frontend products with strong architecture,
                thoughtful UX, offline-first thinking and production-minded delivery.
              </p>

              <div className="glass-hero-actions">
                <button type="button" className="glass-primary-action" onClick={() => onOpenApp("resume")}>
                  View Résumé
                </button>
                <button type="button" className="glass-secondary-action" onClick={() => onOpenApp("projects")}>
                  View Projects
                </button>
                <button type="button" className="glass-secondary-action" onClick={() => onOpenApp("contact")}>
                  Contact Me
                </button>
              </div>

              <div className="glass-proof-row">
                <div><strong>5 years</strong><span>Software development</span></div>
                <div><strong>iOS + Android</strong><span>Cross-platform delivery</span></div>
                <div><strong>UAE</strong><span>Current location</span></div>
              </div>
            </div>

            <div className="glass-hero-mark" aria-hidden="true">
              <div className="glass-hero-orb" />
              <div className="glass-hero-monogram">IH</div>
              <p>Build · Ship · Improve</p>
            </div>
          </section>

          <section className="glass-featured">
            <div className="glass-section-title">
              <div><p>SELECTED WORK</p><h2>Featured Projects</h2></div>
              <button type="button" onClick={() => onOpenApp("projects")}>View all projects →</button>
            </div>

            <div className="glass-project-grid">
              {FEATURED_PROJECTS.map(project => {
                const image = project.screenshots?.[0];
                return (
                  <button
                    type="button"
                    className="glass-project-card"
                    key={project.id}
                    onClick={() => onOpenProject(project.id, project.appId)}
                    aria-label={`Open ${project.title} case study`}
                  >
                    <div className={`glass-project-image ${project.previewType === "phone" ? "is-phone" : ""}`}>
                      {image ? <img src={image.src} alt="" /> : <span>{project.icon || project.symbol}</span>}
                    </div>
                    <div className="glass-project-info">
                      <span style={{ color: project.color }}>{project.category}</span>
                      <div><strong>{project.title}</strong><b>↗</b></div>
                      <p>{project.desc}</p>
                      <div className="glass-project-tags">
                        {(project.tags || []).slice(0, 3).map(tag => <em key={tag}>{tag}</em>)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="glass-skills-preview">
            <div className="glass-section-title">
              <div><p>ENGINEERING EVIDENCE</p><h2>Core Skills</h2></div>
              <button type="button" onClick={() => onOpenApp("skills")}>View skills →</button>
            </div>
            <div className="glass-skill-proof-grid">
              {SKILL_PROOF.map(item => (
                <button type="button" key={item.label} onClick={() => onOpenApp("skills")}>
                  <strong>{item.label}</strong>
                  <span>{item.proof}</span>
                </button>
              ))}
            </div>
          </section>
        </section>

        <section className="glass-side">
          <HomeAssistantPanel onOpenApp={onOpenApp} onOpenProject={onOpenProject} />
          <div className="glass-role-panel">
            <div className="glass-role-status"><span /> Open to roles</div>
            <h2>Mobile engineering with product thinking.</h2>
            <p>
              Best fit: React Native, mobile and frontend teams that value clean architecture,
              reliable delivery and thoughtful user experience.
            </p>
            <div className="glass-role-links">
              <button type="button" onClick={() => onOpenApp("resume")}>Résumé</button>
              <button type="button" onClick={() => onOpenApp("contact")}>Let’s talk →</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
