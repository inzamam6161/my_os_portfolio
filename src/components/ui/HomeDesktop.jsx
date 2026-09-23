import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { PROFILE } from "../../data/profile";
import HomeAssistantPanel from "./HomeAssistantPanel";

const ALL = [
  ...MOBILE_PROJECTS.map(project => ({ ...project, appId: "mobile" })),
  ...WEB_PROJECTS.map(project => ({
    ...project,
    appId: project.id === "signaldesk-ai" ? "signaldesk" : project.id === "nexora-ai-lab" ? "nexora" : "projects",
  })),
];

const FEATURED = ["lifeos", "signalops-mobile", "pulseboard", "signaldesk-ai"]
  .map(id => ALL.find(project => project.id === id))
  .filter(Boolean);

const SKILLS = [
  ["RN", "React Native", "LifeOS · SignalOps"],
  ["TS", "TypeScript", "Mobile + Web"],
  ["JS", "JavaScript", "React ecosystem"],
  ["SW", "Swift / SwiftUI", "PulseBoard · LumaHome"],
  ["ND", "Node.js", "API integration"],
  ["DB", "SQLite / SQLCipher", "Offline-first"],
];

const PROFILE_STATS = [
  ["6", "Portfolio case studies"],
  ["2", "React Native projects"],
  ["2", "Native iOS projects"],
  ["UAE", "Current location"],
];

export default function HomeDesktop({ onOpenProject, onOpenApp }) {
  return (
    <main className="ref-home">
      <section className="ref-top">
        <section className="ref-hero">
          <p className="ref-kicker">BUILDING A MORE CONNECTED TOMORROW</p>
          <h1>{PROFILE.name}</h1>
          <h2>React Native Engineer <span>•</span> Mobile Engineer <span>•</span> Frontend</h2>
          <p className="ref-intro">
            I design and build high-performance, user-focused mobile applications with clean architecture,
            thoughtful UX, reliable offline behaviour, testing and production-minded delivery.
          </p>

          <div className="ref-actions">
            <button className="primary" type="button" onClick={() => onOpenApp("resume")}>⇩ &nbsp;View Résumé</button>
            <button type="button" onClick={() => onOpenApp("contact")}>Let&apos;s Connect &nbsp;→</button>
          </div>

          <div className="ref-proof">
            <div><strong>5 years</strong><span>Software development</span></div>
            <div><strong>React Native</strong><span>Primary specialization</span></div>
            <div><strong>iOS + Android</strong><span>Cross-platform delivery</span></div>
            <div><strong>UAE</strong><span>Open to opportunities</span></div>
          </div>

          <div className="ref-note" aria-hidden="true">Good<br/>Apps<br/>Brighter<br/>Products</div>
        </section>

        <HomeAssistantPanel onOpenApp={onOpenApp} onOpenProject={onOpenProject} />
      </section>

      <section className="ref-bottom">
        <section className="ref-glass ref-projects">
          <header className="ref-card-head">
            <div><b>▣</b><span><h2>Featured Projects</h2><small>Four projects for a fast technical review</small></span></div>
            <button type="button" onClick={() => onOpenApp("projects")}>View All →</button>
          </header>

          <div className="ref-project-grid">
            {FEATURED.map(project => {
              const image = project.screenshots?.[0];
              return (
                <button
                  className="ref-project"
                  type="button"
                  aria-label={`Open ${project.title} case study`}
                  key={project.id}
                  onClick={() => onOpenProject(project.id, project.appId)}
                >
                  <div className="ref-project-img">{image ? <img src={image.src} alt="" /> : project.icon}</div>
                  <div className="ref-project-copy">
                    <em style={{ color: project.color }}>{project.category}</em>
                    <strong>{project.title}<span>↗</span></strong>
                    <p>{project.desc}</p>
                    <div>{(project.tags || []).slice(0, 3).map(tag => <small key={tag}>{tag}</small>)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="ref-glass ref-skills">
          <header className="ref-card-head">
            <div><b>▥</b><span><strong>Skills & Tools</strong><small>Evidence-backed stack</small></span></div>
            <button type="button" onClick={() => onOpenApp("skills")}>View All →</button>
          </header>

          <div className="ref-skill-grid">
            {SKILLS.map(([icon, name, proof]) => (
              <button type="button" key={name} onClick={() => onOpenApp("skills")}>
                <i>{icon}</i><strong>{name}</strong><small>{proof}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="ref-glass ref-impact">
          <header className="ref-card-head">
            <div><b>↗</b><span><strong>Profile</strong><small>Verified portfolio scope</small></span></div>
          </header>

          <div className="ref-impact-list">
            {PROFILE_STATS.map(([value, label]) => (
              <div key={label}><strong>{value}</strong><span>{label}</span><i><b /></i></div>
            ))}
          </div>

          <div className="ref-impact-actions">
            <button type="button" onClick={() => onOpenApp("resume")}>Résumé</button>
            <button type="button" onClick={() => onOpenApp("contact")}>Contact →</button>
          </div>
        </section>
      </section>
    </main>
  );
}
