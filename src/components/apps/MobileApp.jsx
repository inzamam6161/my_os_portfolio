// src/components/apps/MobileApp.jsx
import { useState } from "react";
import { MOBILE_PROJECTS } from "../../data/projects";
import { font } from "../../styles/tokens";

export default function MobileApp() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex !== null ? MOBILE_PROJECTS[selectedIndex] : null;

  return (
    <div>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: font.family }}>
        Mobile application case studies
      </p>

      {MOBILE_PROJECTS.length === 0 && (
        <div style={{ padding: 24, border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>
          I have professional experience delivering React Native, Android, and iOS applications through production release. Employer and client source code is confidential, so public case studies will be added here as independent projects are completed.
        </div>
      )}

      {selected && (
        <MobileDetail
          key={selected.title}
          project={selected}
          onClose={() => setSelectedIndex(null)}
        />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        {MOBILE_PROJECTS.map((p, i) => (
          <MobileCard
            key={p.title}
            project={p}
            isSelected={selectedIndex === i}
            onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedBadge({ color }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      marginLeft: 8,
      padding: "3px 8px",
      borderRadius: 999,
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: "0.08em",
      color,
      background: color + "18",
      border: `0.5px solid ${color}55`,
      verticalAlign: "middle",
    }}>
      FLAGSHIP
    </span>
  );
}

function MobileDetail({ project: p, onClose }) {
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
              style={{
                background: activeScreenshot === index ? p.color : "rgba(255,255,255,0.1)",
                boxShadow: activeScreenshot === index ? `0 0 0 3px ${p.color}22` : "none",
              }}
            />
          ))}
        </div>
      </div>

      <div className="mobile-detail-copy">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 12 }}>
          <div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>{p.icon} {p.title}</span>
              {p.featured && <FeaturedBadge color={p.color} />}
            </div>

            <span style={{
              display: "inline-block",
              marginTop: 6,
              fontSize: 12,
              color: p.color,
              background: p.color + "22",
              padding: "2px 8px",
              borderRadius: 4,
            }}>
              {p.platform}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label={`Close ${p.title} details`}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}
          >
            ✕
          </button>
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
            <span key={tag} style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 4,
              background: p.color + "22",
              color: p.color,
              border: `0.5px solid ${p.color}44`,
            }}>
              {tag}
            </span>
          ))}
        </div>

        <a
          className="mobile-source-link"
          href={p.href}
          target="_blank"
          rel="noreferrer"
          style={{ color: p.color, borderColor: p.color + "55" }}
        >
          View source on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}

function MobileCard({ project: p, isSelected, onClick }) {
  return (
    <button
      type="button"
      aria-expanded={isSelected}
      onClick={onClick}
      style={{
        position: "relative",
        background: isSelected ? p.color + "18" : "rgba(255,255,255,0.04)",
        border: `0.5px solid ${isSelected ? p.color + "66" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 10,
        padding: 14,
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: font.family,
        textAlign: "left",
        width: "100%",
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = p.color + "44";
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }
      }}
    >
      {p.featured && (
        <span style={{
          position: "absolute",
          top: 10,
          right: 10,
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: p.color,
          background: p.color + "18",
          border: `0.5px solid ${p.color}44`,
          padding: "3px 6px",
          borderRadius: 999,
        }}>
          FLAGSHIP
        </span>
      )}

      <div style={{ fontSize: 26, marginBottom: 6 }}>{p.icon}</div>
      <div style={{ fontWeight: 600, fontSize: 14, color: "#fff", marginBottom: 3 }}>{p.title}</div>
      <div style={{ fontSize: 11, color: p.color, marginBottom: 6 }}>{p.platform}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{p.tags.slice(0, 3).join(" · ")}</div>
    </button>
  );
}
