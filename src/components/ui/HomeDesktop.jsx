import { useEffect, useState } from "react";
import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { PROFILE } from "../../data/profile";
import { HOME_SKILLS } from "../../data/skills";
import HomeAssistantPanel from "./HomeAssistantPanel";

const ALL = [
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

const FEATURED = ["lifeos", "signalops-mobile", "pulseboard", "signaldesk-ai"]
  .map(id => ALL.find(project => project.id === id))
  .filter(Boolean);

const IMPACT = [
  ["6", "Case studies"],
  ["2", "React Native"],
  ["2", "Native iOS"],
  ["UAE", "Based in"],
];

const isInteractiveTarget = target =>
  Boolean(target.closest("button, a, input, textarea, select, form, [role='button']"));

export default function HomeDesktop({ onOpenProject, onOpenApp }) {
  const [expandedPanel, setExpandedPanel] = useState(null);
  const previousFocusRef = useState(() => ({ current: null }))[0];

  useEffect(() => {
    if (!expandedPanel) return undefined;

    previousFocusRef.current = document.activeElement;

    const panel = document.querySelector(".ref-focus-panel");
    const focusableSelector =
      'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    requestAnimationFrame(() => {
      const firstFocusable = panel?.querySelector(focusableSelector);
      (firstFocusable || panel)?.focus?.();
    });

    const handleKey = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        setExpandedPanel(null);
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = [...panel.querySelectorAll(focusableSelector)]
        .filter(element => !element.hasAttribute("disabled"));

      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      requestAnimationFrame(() => previousFocusRef.current?.focus?.());
    };
  }, [expandedPanel, previousFocusRef]);

  const expandFromContainer = (panel, event) => {
    if (expandedPanel || isInteractiveTarget(event.target)) return;
    setExpandedPanel(panel);
  };

  const openProject = (projectId, appId) => {
    setExpandedPanel(null);
    onOpenProject(projectId, appId);
  };

  const openApp = appId => {
    setExpandedPanel(null);
    onOpenApp(appId);
  };

  return (
    <main className={`ref-home ${expandedPanel ? "has-expanded-panel" : ""}`}>
      {expandedPanel && (
        <button
          type="button"
          className="ref-focus-backdrop"
          aria-label="Close expanded panel"
          onClick={() => setExpandedPanel(null)}
        />
      )}

      <section className="ref-top">
        <section className="ref-hero" aria-label="Portfolio introduction">
          <p className="ref-kicker">BUILDING A MORE CONNECTED TOMORROW</p>
          <h1>{PROFILE.name}</h1>

          <div className="ref-role">
            <span>React Native Engineer</span>
            <i>•</i>
            <span>Mobile Engineer</span>
            <i>•</i>
            <span>Product Builder</span>
          </div>

          <p className="ref-intro">
            I design and build high-performance, user-focused mobile applications using React Native
            and modern technologies. I turn ideas into scalable products with clean architecture,
            reliable offline behaviour and thoughtful user experiences.
          </p>

          <div className="ref-actions">
            <button className="primary" type="button" onClick={() => openApp("resume")}>
              <span>⇩</span> View Résumé
            </button>

            <button type="button" onClick={() => openApp("contact")}>
              Let&apos;s Connect <span>→</span>
            </button>
          </div>

          <div className="ref-proof">
            <div><strong>5 years</strong><span>Software development</span></div>
            <div><strong>6</strong><span>Portfolio case studies</span></div>
            <div><strong>iOS + Android</strong><span>Cross-platform delivery</span></div>
            <div><strong>UAE</strong><span>Open to opportunities</span></div>
          </div>

          <div className="ref-note" aria-hidden="true">
            <span>Good</span>
            <span>Apps</span>
            <span>Brighter</span>
            <span>Products</span>
            <b />
          </div>
        </section>

        <HomeAssistantPanel
          onOpenApp={openApp}
          onOpenProject={openProject}
          expanded={expandedPanel === "assistant"}
          onExpand={() => setExpandedPanel("assistant")}
          onClose={() => setExpandedPanel(null)}
        />
      </section>

      <section className="ref-bottom">
        <section
          className={`ref-glass ref-projects ${expandedPanel === "projects" ? "ref-focus-panel ref-focus-projects" : ""}`}
          onClick={event => expandFromContainer("projects", event)}
          aria-label="Featured Projects panel"
          role={expandedPanel === "projects" ? "dialog" : undefined}
          aria-modal={expandedPanel === "projects" ? "true" : undefined}
          aria-labelledby={expandedPanel === "projects" ? "featured-projects-title" : undefined}
          tabIndex={expandedPanel === "projects" ? -1 : undefined}
        >
          <header className="ref-card-head">
            <div className="ref-card-title-wrap">
              <b className="ref-card-icon">▣</b>
              <div className="ref-card-title">
                <h2 id="featured-projects-title">Featured Projects</h2>
                <small>Selected engineering work</small>
              </div>
            </div>

            <div className="ref-card-actions">
              <button
                type="button"
                className="ref-expand-button"
                onClick={() => setExpandedPanel(expandedPanel === "projects" ? null : "projects")}
                aria-label={expandedPanel === "projects" ? "Close expanded projects" : "Expand Featured Projects"}
              >
                {expandedPanel === "projects" ? "× Close" : "⤢ Expand"}
              </button>

              <button type="button" onClick={() => openApp("projects")}>
                View All <span>→</span>
              </button>
            </div>
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
                  onClick={() => openProject(project.id, project.appId)}
                >
                  <div className={`ref-project-img ${project.previewType === "phone" ? "phone" : ""}`}>
                    {image ? <img src={image.src} alt="" /> : project.icon}
                    <span className="ref-project-open">↗</span>
                  </div>

                  <div className="ref-project-copy">
                    <em style={{ color: project.color }}>{project.category}</em>
                    <strong>{project.title}</strong>
                    <p>{project.desc}</p>

                    <div>
                      {(project.tags || []).slice(0, 3).map(tag => (
                        <small key={tag}>{tag}</small>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section
          className={`ref-glass ref-skills ${expandedPanel === "skills" ? "ref-focus-panel ref-focus-skills" : ""}`}
          onClick={event => expandFromContainer("skills", event)}
          aria-label="Skills and Tools panel"
          role={expandedPanel === "skills" ? "dialog" : undefined}
          aria-modal={expandedPanel === "skills" ? "true" : undefined}
          aria-labelledby={expandedPanel === "skills" ? "skills-tools-title" : undefined}
          tabIndex={expandedPanel === "skills" ? -1 : undefined}
        >
          <header className="ref-card-head">
            <div className="ref-card-title-wrap">
              <b className="ref-card-icon">▥</b>
              <div className="ref-card-title">
                <h2 id="skills-tools-title">Skills &amp; Tools</h2>
                <small>Evidence-backed stack</small>
              </div>
            </div>

            <div className="ref-card-actions">
              <button
                type="button"
                className="ref-expand-button"
                onClick={() => setExpandedPanel(expandedPanel === "skills" ? null : "skills")}
                aria-label={expandedPanel === "skills" ? "Close expanded skills" : "Expand Skills and Tools"}
              >
                {expandedPanel === "skills" ? "× Close" : "⤢ Expand"}
              </button>

              <button type="button" onClick={() => openApp("skills")}>
                View All <span>→</span>
              </button>
            </div>
          </header>

          <div className="ref-skill-grid">
            {HOME_SKILLS.map(([icon, name, proof]) => (
              <button type="button" key={name} onClick={() => openApp("skills")}>
                <i>{icon}</i>
                <strong>{name}</strong>
                <small>{proof}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="ref-glass ref-impact">
          <header className="ref-card-head">
            <div className="ref-card-title-wrap">
              <b className="ref-card-icon">↗</b>
              <div className="ref-card-title">
                <h2>Impact</h2>
                <small>Verified portfolio scope</small>
              </div>
            </div>
          </header>

          <div className="ref-impact-list">
            {IMPACT.map(([value, label], index) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
                <i><b style={{ width: `${86 - index * 8}%` }} /></i>
              </div>
            ))}
          </div>

          <div className="ref-impact-actions">
            <button type="button" onClick={() => openApp("resume")}>Résumé</button>
            <button type="button" onClick={() => openApp("contact")}>Contact →</button>
          </div>
        </section>
      </section>

      <blockquote className="ref-footer-quote">
        “Better software experiences<br />for a brighter tomorrow.”
        <cite>— Inzamamul Haque</cite>
      </blockquote>

      <div className="ref-footer-note" aria-hidden="true">
        <span>Code</span>
        <span>Create</span>
        <span>Move Forward</span>
        <b />
      </div>
    </main>
  );
}
