import { useState } from "react";
import { MOBILE_PROJECTS, WEB_PROJECTS } from "../../data/projects";
import { PROFILE } from "../../data/profile";
import { SKILL_GROUPS } from "../../data/skills";
import { colors, font } from "../../styles/tokens";

const LOCATIONS = ["Overview", "Skills", "Links"];

export default function FinderApp() {
  const [location, setLocation] = useState("Overview");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px minmax(0, 1fr)", minHeight: "100%", margin: -24, fontFamily: font.family }}>
      <aside style={{ padding: "18px 10px", borderRight: colors.border, background: "rgba(255,255,255,.025)" }}>
        <p style={{ padding: "0 9px 8px", color: colors.textDim, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em" }}>Favorites</p>
        {LOCATIONS.map(item => (
          <button key={item} type="button" onClick={() => setLocation(item)} style={{ width: "100%", padding: "8px 9px", border: 0, borderRadius: 7, background: location === item ? colors.accentHover : "transparent", color: location === item ? "#fff" : colors.textSecondary, cursor: "pointer", textAlign: "left", fontSize: 12 }}>{item}</button>
        ))}
      </aside>

      <main style={{ padding: 22, overflow: "auto" }}>
        <h2 style={{ margin: "0 0 17px", fontSize: 17 }}>{location}</h2>
        {location === "Overview" && <Overview />}
        {location === "Skills" && <FolderGrid items={SKILL_GROUPS.map(section => ({ label: section.title, detail: `${section.items.length} evidence areas`, symbol: section.icon }))} />}
        {location === "Links" && <FolderGrid items={[{ label: "GitHub", detail: PROFILE.github, symbol: "⌘", href: PROFILE.github }, { label: "LinkedIn", detail: "Professional profile", symbol: "in", href: PROFILE.linkedin }, { label: "Email", detail: PROFILE.email, symbol: "@", href: `mailto:${PROFILE.email}` }]} />}
      </main>
    </div>
  );
}

function Overview() {
  return (
    <div>
      <div style={{ padding: 18, border: colors.border, borderRadius: 12, background: "linear-gradient(135deg, rgba(94,92,230,.16), rgba(100,210,255,.06))" }}>
        <p style={{ color: colors.cyan, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Developer workspace</p>
        <h3 style={{ margin: "7px 0", fontSize: 21 }}>{PROFILE.name}</h3>
        <p style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 1.65 }}>{PROFILE.title}</p>
      </div>
      <FolderGrid items={[{ label: "Mobile Work", detail: `${MOBILE_PROJECTS.length} public case studies`, symbol: "◉" }, { label: "Web Projects", detail: `${WEB_PROJECTS.length} featured projects`, symbol: "⌘" }, { label: "Resume", detail: "Experience and capabilities", symbol: "▤" }]} />
    </div>
  );
}

function FolderGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 10, marginTop: 14 }}>
      {items.map(item => {
        const Wrapper = item.href ? "a" : "div";
        return (
          <Wrapper key={item.label} href={item.href} target={item.href ? "_blank" : undefined} rel={item.href ? "noreferrer" : undefined} style={{ minWidth: 0, padding: 13, border: colors.border, borderRadius: 10, background: "rgba(255,255,255,.035)", color: "#fff", textDecoration: "none" }}>
            <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, marginBottom: 10, borderRadius: 9, background: colors.accentSubtle, color: "#b6b5ff", fontSize: 20, fontWeight: 700 }}>{item.symbol}</span>
            <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}>{item.label}</strong>
            <span style={{ display: "block", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: colors.textMuted, fontSize: 10 }}>{item.detail}</span>
          </Wrapper>
        );
      })}
    </div>
  );
}
