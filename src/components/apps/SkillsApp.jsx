import { SKILL_GROUPS } from "../../data/skills";
import { colors, font } from "../../styles/tokens";

export default function SkillsApp() {
  return (
    <div className="evidence-skills" style={{ fontFamily: font.family }}>
      <div className="evidence-skills-head">
        <p>ENGINEERING SKILLS</p>
        <h1>Evidence over percentages.</h1>
        <span>
          Skills are grouped by where they are demonstrated rather than arbitrary proficiency scores.
        </span>
      </div>

      <div className="evidence-skill-grid">
        {SKILL_GROUPS.map(group => (
          <section key={group.title}>
            <div className="evidence-skill-heading">
              <h2>{group.title}</h2>
              <p>{group.note}</p>
            </div>

            <div>
              {group.items.map(([name, proof]) => (
                <article key={name}>
                  <strong>{name}</strong>
                  <span>{proof}</span>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="evidence-skill-note" style={{ color: colors.textMuted }}>
        For role-specific requirements, use Ask About Me to compare the requested stack with portfolio evidence.
      </p>
    </div>
  );
}
