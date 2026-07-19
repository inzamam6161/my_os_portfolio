// src/components/apps/SkillsApp.jsx
import { useState } from "react";
import { SKILL_SECTIONS } from "../../data/profile";
import { font } from "../../styles/tokens";

export default function SkillsApp() {
  const [activeTab, setActiveTab] = useState(0);
  const section = SKILL_SECTIONS[activeTab];

  return (
    <div style={{ fontFamily: font.family }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 22, flexWrap: "wrap" }}>
        {SKILL_SECTIONS.map((s, i) => (
          <button key={s.category} onClick={() => setActiveTab(i)} style={{
            padding:      "6px 14px",
            borderRadius: 8,
            fontSize:     13,
            fontWeight:   500,
            cursor:       "pointer",
            border:       "0.5px solid",
            background:   activeTab === i ? s.color + "22" : "rgba(255,255,255,0.04)",
            borderColor:  activeTab === i ? s.color + "66" : "rgba(255,255,255,0.1)",
            color:        activeTab === i ? s.color        : "rgba(255,255,255,0.5)",
            transition:   "all 0.15s",
          }}>
            {s.icon} {s.category}
          </button>
        ))}
      </div>

      {/* Skill bars */}
      <div style={{ marginBottom: 28 }}>
        {section.skills.map(skill => (
          <SkillBar key={skill.name} skill={skill} color={section.color} />
        ))}
      </div>

      {/* All technologies flat list */}
      <div>
        <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
          All Technologies
        </p>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {SKILL_SECTIONS.flatMap(s => s.skills.map(sk => ({ name: sk.name, color: s.color }))).map(({ name, color }) => (
            <span key={name} style={{
              padding:      "4px 11px",
              borderRadius: 6,
              fontSize:     12,
              background:   color + "14",
              border:       `0.5px solid ${color}33`,
              color,
            }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillBar({ skill, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{skill.name}</span>
        <span style={{ fontSize: 12, color, fontWeight: 600 }}>{skill.level}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height:     "100%",
          borderRadius: 3,
          background: `linear-gradient(90deg, ${color}bb, ${color})`,
          width:      `${skill.level}%`,
          transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>
    </div>
  );
}
