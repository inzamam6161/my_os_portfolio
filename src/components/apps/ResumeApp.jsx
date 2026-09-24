import { EXPERIENCE, PROFILE } from "../../data/profile";
import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { SKILL_GROUPS } from "../../data/skills";
import { font } from "../../styles/tokens";
import Icon from "../ui/Icon";

const ALL_PROJECTS = [...MOBILE_PROJECTS, ...WEB_PROJECTS];
const FEATURED = ["lifeos", "signalops-mobile", "pulseboard", "signaldesk-ai"]
  .map(id => ALL_PROJECTS.find(project => project.id === id))
  .filter(Boolean);

export default function ResumeApp() {
  return (
    <div className="career-workspace" style={{ fontFamily: font.family }}>
      <header className="career-hero">
        <div>
          <p className="portfolio-app-kicker">CAREER &amp; EXPERIENCE</p>
          <h1>{PROFILE.name}</h1>
          <h2>{PROFILE.title}</h2>
          <p>{PROFILE.location} · {PROFILE.email} · {PROFILE.phone}</p>
        </div>

        <div className="career-actions">
          <button type="button" onClick={() => window.print()}><Icon name="download" size={15} /> Print / Save PDF</button>
          <a href={`mailto:${PROFILE.email}?subject=Software%20Engineering%20Opportunity`}><Icon name="mail" size={15} /> Contact me</a>
        </div>
      </header>

      <section className="career-metrics">
        <article><Icon name="briefcase" size={18} /><div><strong>5 years</strong><span>Software development</span></div></article>
        <article><Icon name="layers" size={18} /><div><strong>{ALL_PROJECTS.length}</strong><span>Public case studies</span></div></article>
        <article><Icon name="smartphone" size={18} /><div><strong>iOS + Android</strong><span>Mobile delivery</span></div></article>
        <article><Icon name="location" size={18} /><div><strong>UAE</strong><span>Current location</span></div></article>
      </section>

      <section className="career-layout">
        <div className="career-main">
          <section className="career-card">
            <div className="career-section-heading">
              <span><Icon name="user" size={15} /></span>
              <div><h2>Professional Summary</h2><p>Mobile-first engineering profile</p></div>
            </div>
            <div className="career-summary-copy">
              {PROFILE.bio.map(item => <p key={item}>{item}</p>)}
            </div>
          </section>

          <section className="career-card">
            <div className="career-section-heading">
              <span><Icon name="briefcase" size={15} /></span>
              <div><h2>Experience</h2><p>Professional timeline</p></div>
            </div>
            <div className="career-timeline">
              {EXPERIENCE.map(item => (
                <article key={`${item.role}-${item.period}`}>
                  <i style={{ background: item.dot }} />
                  <div>
                    <div className="career-timeline-title">
                      <div><strong>{item.role}</strong><span>{item.company}</span></div>
                      <time>{item.period}</time>
                    </div>
                    <p>{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="career-card">
            <div className="career-section-heading">
              <span><Icon name="layers" size={15} /></span>
              <div><h2>Selected Engineering Work</h2><p>Projects that best represent the current portfolio</p></div>
            </div>
            <div className="career-project-grid">
              {FEATURED.map(project => (
                <article key={project.id}>
                  <small style={{ color: project.color }}>{project.category}</small>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  <div>{(project.tags || []).slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="career-side">
          <section className="career-card">
            <div className="career-section-heading">
              <span><Icon name="code" size={15} /></span>
              <div><h2>Core Technologies</h2><p>Evidence-backed stack</p></div>
            </div>
            <div className="career-skill-list">
              {SKILL_GROUPS.map(group => (
                <div key={group.title}>
                  <strong>{group.title}</strong>
                  <p>{group.items.map(([name]) => name).join(" · ")}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="career-card">
            <div className="career-section-heading">
              <span><Icon name="link" size={15} /></span>
              <div><h2>Links</h2><p>Recruiter shortcuts</p></div>
            </div>
            <div className="career-link-list">
              <a href={PROFILE.github} target="_blank" rel="noreferrer"><span><Icon name="code" size={14} /> GitHub</span><Icon name="external" size={14} /></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer"><span><Icon name="link" size={14} /> LinkedIn</span><Icon name="external" size={14} /></a>
              <a href={PROFILE.portfolio} target="_blank" rel="noreferrer"><span><Icon name="globe" size={14} /> Portfolio</span><Icon name="external" size={14} /></a>
              <a href={`mailto:${PROFILE.email}`}><span><Icon name="mail" size={14} /> Email</span><Icon name="arrowRight" size={14} /></a>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
