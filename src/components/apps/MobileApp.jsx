// src/components/apps/MobileApp.jsx
import { useState } from "react";
import { MOBILE_PROJECTS } from "../../data/projects";
import { font } from "../../styles/tokens";

export default function MobileApp({ selectedProjectId }) {
  const project =
    MOBILE_PROJECTS.find(item => item.id === selectedProjectId) || MOBILE_PROJECTS[0];

  if (!project) return null;

  return (
    <div>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: font.family }}>
        Mobile engineering case study
      </p>
      <MobileDetail key={project.id} project={project} />
    </div>
  );
}

function FeaturedBadge({ color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", marginLeft: 8, padding: "3px 8px", borderRadius: 999, fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", color, background: color + "18", border: `0.5px solid ${color}55`, verticalAlign: "middle" }}>
      FLAGSHIP
    </span>
  );
}

function MobileDetail({ project: p }) {
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const screenshot = p.screenshots[activeScreenshot];

  return (
    <div className="mobile-detail" style={{ borderColor: p.color + "44", fontFamily: font.family }}>
      <div className="mobile-detail-media">
        <div className="mobile-phone-frame">
          <img src={screenshot.src} alt={screenshot.alt} />
        </div>

        <div className="mobile-screenshot-tabs" aria-label={`${p.title} screenshots`}>
          {p.screenshots.map((shot, index) => (
            <button
              key={shot.src}
              type="button"
              aria-label={`Show ${shot.label} screenshot`}
              aria-pressed={activeScreenshot === index}
              title={shot.label}
              onClick={() => setActiveScreenshot(index)}
              style={{ background: activeScreenshot === index ? p.color : "rgba(255,255,255,0.1)", boxShadow: activeScreenshot === index ? `0 0 0 3px ${p.color}22` : "none" }}
            />
          ))}
        </div>
      </div>

      <div className="mobile-detail-copy">
        <div style={{ marginBottom: 8 }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>{p.icon} {p.title}</span>
            {p.featured && <FeaturedBadge color={p.color} />}
          </div>
          <span style={{ display: "inline-block", marginTop: 6, fontSize: 12, color: p.color, background: p.color + "22", padding: "2px 8px", borderRadius: 4 }}>
            {p.platform}
          </span>
        </div>

        <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.65)" }}>
          {p.desc}
        </p>

        <div className="mobile-stats">
          {p.stats.map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <ul className="mobile-highlights">
          {p.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
        </ul>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {p.tags.map(tag => (
            <span key={tag} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: p.color + "22", color: p.color, border: `0.5px solid ${p.color}44` }}>
              {tag}
            </span>
          ))}
        </div>

        <a className="mobile-source-link" href={p.href} target="_blank" rel="noreferrer" style={{ color: p.color, borderColor: p.color + "55" }}>
          View source on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
