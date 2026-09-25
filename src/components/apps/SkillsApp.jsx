import { HOME_SKILLS, SKILL_GROUPS } from "../../data/skills";
import { font } from "../../styles/tokens";
import Icon from "../ui/Icon";

const SKILL_ICON_MAP = {
  RN: "smartphone",
  TS: "code",
  JS: "code",
  SW: "apple",
  RE: "layers",
  ND: "server",
  DB: "database",
  GH: "git",
};

const GROUP_ICON_MAP = {
  Primary: "target",
  "Native Mobile": "smartphone",
  "Frontend & Product": "layers",
  "Data, Backend & Delivery": "server",
};

export default function SkillsApp() {
  return (
    <div className="skills-workspace" style={{ fontFamily: font.family }}>
      <header className="skills-workspace-hero">
        <div>
          <p className="portfolio-app-kicker">ENGINEERING CAPABILITIES</p>
          <h1>Skills &amp; Tools</h1>
          <p>
            Evidence-backed capabilities grouped by where they are demonstrated in real portfolio work,
            rather than arbitrary percentage scores.
          </p>
        </div>
        <div className="skills-workspace-proof">
          <strong>4</strong><span>Capability areas</span><small>Mobile · Native · Web · Delivery</small>
        </div>
      </header>

      <section className="skills-quick-grid" aria-label="Core stack">
        {HOME_SKILLS.map(([icon, name, proof]) => (
          <article key={name}>
            <i><Icon name={SKILL_ICON_MAP[icon]} size={18} /></i>
            <div><strong>{name}</strong><span>{proof}</span></div>
          </article>
        ))}
      </section>

      <section className="skills-group-grid">
        {SKILL_GROUPS.map((group, index) => (
          <article className="skills-group-card" key={group.title}>
            <header>
              <span className="skills-group-icon"><Icon name={GROUP_ICON_MAP[group.title]} size={21} /></span>
              <div>
                <small>0{index + 1}</small>
                <h2>{group.title}</h2>
                <p>{group.note}</p>
              </div>
            </header>
            <div className="skills-group-items">
              {group.items.map(([name, proof]) => (
                <div key={name}><strong>{name}</strong><span>{proof}</span></div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <footer className="skills-workspace-footer">
        <div>
          <span>Portfolio evidence:</span>
          LifeOS · SignalOps Mobile · PulseBoard · LumaHome · SignalDesk · Nexora AI Lab
        </div>
        <a
          href="https://github.com/inzamam6161/mobile-engineering-labs"
          target="_blank"
          rel="noreferrer"
        >
          Engineering Labs <Icon name="external" size={12} />
        </a>
      </footer>
    </div>
  );
}
