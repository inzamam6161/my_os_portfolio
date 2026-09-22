import { EXPERIENCE, PROFILE } from "../../data/profile";
import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { font } from "../../styles/tokens";

const FEATURED = ["lifeos", "signalops-mobile", "pulseboard", "signaldesk-ai"]
  .map(id => [...MOBILE_PROJECTS, ...WEB_PROJECTS].find(project => project.id === id))
  .filter(Boolean);

export default function ResumeApp() {
  return (
    <div className="resume-document" style={{ fontFamily: font.family }}>
      <header className="resume-header" style={{ marginBottom: 22 }}>
        <div>
          <h1 style={{ margin: "0 0 5px", fontSize: 26 }}>{PROFILE.name}</h1>
          <p className="resume-role">{PROFILE.title}</p>
          <p className="resume-meta">{PROFILE.location} · {PROFILE.email} · {PROFILE.phone}</p>
        </div>
        <div className="resume-actions">
          <button type="button" onClick={() => window.print()}>Print / Save PDF</button>
          <a href={`mailto:${PROFILE.email}?subject=Software%20Engineering%20Opportunity`}>Email</a>
        </div>
      </header>

      <section className="resume-section">
        <h2>Professional Summary</h2>
        {PROFILE.bio.map(item => <p key={item}>{item}</p>)}
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        <div className="resume-experience-list">
          {EXPERIENCE.map(item => (
            <article key={`${item.role}-${item.period}`}>
              <div><strong>{item.role}</strong><span>{item.company}</span></div>
              <time>{item.period}</time>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h2>Selected Engineering Work</h2>
        <div className="resume-project-list">
          {FEATURED.map(project => (
            <article key={project.id}>
              <strong>{project.title}</strong>
              <span>{project.category}</span>
              <p>{project.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h2>Core Technologies</h2>
        <p>
          React Native · TypeScript · JavaScript · Redux Toolkit · React · Swift · SwiftUI ·
          SQLite / SQLCipher · REST APIs · Node.js · Git / GitHub · CI/CD
        </p>
      </section>

      <footer className="resume-footer">
        <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={PROFILE.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
      </footer>
    </div>
  );
}
