import { EXPERIENCE, PROFILE } from "../../data/profile";
import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { HOME_SKILLS } from "../../data/skills";
import { font } from "../../styles/tokens";
import Icon from "../ui/Icon";

const ALL_PROJECTS = [...MOBILE_PROJECTS, ...WEB_PROJECTS];

const FOCUS = [
  ["React Native", "Cross-platform mobile architecture, state, navigation, offline workflows and product delivery."],
  ["Native iOS", "SwiftUI portfolio work using SwiftData, WidgetKit, ActivityKit, App Intents and native platform APIs."],
  ["Offline-first", "Local persistence, encrypted SQLite / SQLCipher, deterministic workflows and resilient user experiences."],
  ["Frontend Product", "Responsive React interfaces, evidence-based dashboards and practical end-to-end product thinking."],
];

const PRINCIPLES = [
  ["Architecture first", "Separate data, state and presentation responsibilities so features remain maintainable."],
  ["Evidence over claims", "Portfolio case studies describe what is implemented and avoid unsupported production claims."],
  ["Ship with quality gates", "Tests, build checks and CI are part of the engineering workflow rather than an afterthought."],
];

export default function AboutApp() {
  return (
    <div className="about-workspace" style={{ fontFamily: font.family }}>
      <header className="about-workspace-hero">
        <div className="about-workspace-avatar" aria-hidden="true">IH</div>
        <div className="about-workspace-copy">
          <p className="portfolio-app-kicker">BASED IN {PROFILE.location.toUpperCase()}</p>
          <h1>{PROFILE.name}</h1>
          <h2>{PROFILE.title}</h2>
          <p>
            Mobile-focused software engineer building React Native, native iOS and modern web products
            with an emphasis on clean architecture, offline-first design and maintainable delivery.
          </p>
        </div>
        <div className="about-workspace-status">
          <span><i /><Icon name="check" size={14} /> Open to opportunities</span>
          <small>React Native · Mobile · Frontend</small>
        </div>
      </header>

      <section className="about-metrics">
        <article><Icon name="briefcase" size={18} /><div><strong>5 years</strong><span>Software development</span></div></article>
        <article><Icon name="layers" size={18} /><div><strong>{ALL_PROJECTS.length}</strong><span>Public case studies</span></div></article>
        <article><Icon name="smartphone" size={18} /><div><strong>2</strong><span>React Native projects</span></div></article>
        <article><Icon name="apple" size={18} /><div><strong>2</strong><span>Native iOS projects</span></div></article>
      </section>

      <section className="about-workspace-grid">
        <div className="about-workspace-main">
          <section className="about-card">
            <header><span><Icon name="user" size={15} /></span><div><h2>Profile</h2><p>Who I am and what I build</p></div></header>
            <div className="about-profile-copy">{PROFILE.bio.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>

          <section className="about-card">
            <header><span><Icon name="target" size={15} /></span><div><h2>Engineering Focus</h2><p>Where the portfolio is strongest</p></div></header>
            <div className="about-focus-grid">
              {FOCUS.map(([title, detail]) => (
                <article key={title}><strong>{title}</strong><p>{detail}</p></article>
              ))}
            </div>
          </section>

          <section className="about-card">
            <header><span><Icon name="layers" size={15} /></span><div><h2>How I Work</h2><p>Engineering principles reflected in the projects</p></div></header>
            <div className="about-principles">
              {PRINCIPLES.map(([title, detail], index) => (
                <article key={title}>
                  <b>0{index + 1}</b>
                  <div><strong>{title}</strong><p>{detail}</p></div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="about-workspace-side">
          <section className="about-card">
            <header><span><Icon name="code" size={15} /></span><div><h2>Core Stack</h2><p>Current portfolio evidence</p></div></header>
            <div className="about-stack-list">
              {HOME_SKILLS.map(([icon, name, proof]) => (
                <div key={name}><i>{icon}</i><div><strong>{name}</strong><span>{proof}</span></div></div>
              ))}
            </div>
          </section>

          <section className="about-card">
            <header><span><Icon name="briefcase" size={15} /></span><div><h2>Career Snapshot</h2><p>Current professional context</p></div></header>
            <div className="about-career-list">
              {EXPERIENCE.map(item => (
                <article key={`${item.role}-${item.period}`}>
                  <strong>{item.role}</strong><span>{item.company}</span><small>{item.period}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="about-card">
            <header><span><Icon name="link" size={15} /></span><div><h2>Connect</h2><p>Professional links</p></div></header>
            <div className="about-link-grid">
              <a href={PROFILE.github} target="_blank" rel="noreferrer"><Icon name="code" size={14} /> GitHub <Icon name="external" size={13} /></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer"><Icon name="link" size={14} /> LinkedIn <Icon name="external" size={13} /></a>
              <a href={`mailto:${PROFILE.email}`}><Icon name="mail" size={14} /> Email <Icon name="arrowRight" size={13} /></a>
              <a href={PROFILE.portfolio} target="_blank" rel="noreferrer"><Icon name="globe" size={14} /> Portfolio <Icon name="external" size={13} /></a>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
