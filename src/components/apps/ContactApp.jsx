import { useState } from "react";
import { PROFILE } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

export default function ContactApp() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <div style={{ fontFamily: font.family }}>
      <div style={{ padding: 20, border: colors.border, borderRadius: 14, background: "linear-gradient(145deg, rgba(94,92,230,.17), rgba(100,210,255,.05))" }}>
        <p style={{ color: colors.cyan, fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Open to opportunities</p>
        <h1 style={{ margin: "8px 0 9px", fontSize: 24 }}>Let’s build something useful.</h1>
        <p style={{ maxWidth: 520, color: colors.textSecondary, fontSize: 12, lineHeight: 1.7 }}>For React Native, mobile, and frontend engineering opportunities in the UAE, email me directly or connect on LinkedIn.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, marginTop: 15 }}>
        <ContactCard label="Email" value={PROFILE.email} symbol="@" href={`mailto:${PROFILE.email}`} />
        <ContactCard label="Phone" value={PROFILE.phone} symbol="☎" href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} />
        <ContactCard label="LinkedIn" value="Connect professionally" symbol="in" href={PROFILE.linkedin} />
        <ContactCard label="GitHub" value="View public projects" symbol="⌘" href={PROFILE.github} />
      </div>

      <button type="button" onClick={copyEmail} style={{ marginTop: 15, padding: "9px 12px", border: colors.borderFocused, borderRadius: 8, background: colors.accent, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>{copied ? "Email copied ✓" : "Copy email address"}</button>
    </div>
  );
}

function ContactCard({ label, value, symbol, href }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} style={{ display: "grid", gridTemplateColumns: "38px 1fr", alignItems: "center", gap: 10, minWidth: 0, padding: 13, border: colors.border, borderRadius: 10, background: "rgba(255,255,255,.035)", color: "#fff", textDecoration: "none" }}>
      <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 9, background: colors.accentSubtle, color: "#c9c8ff", fontWeight: 800 }}>{symbol}</span>
      <span style={{ minWidth: 0 }}>
        <strong style={{ display: "block", marginBottom: 3, fontSize: 11 }}>{label}</strong>
        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: colors.textMuted, fontSize: 10 }}>{value}</span>
      </span>
    </a>
  );
}
