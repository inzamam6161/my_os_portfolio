import { PROFILE } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

const links = [
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: "✉️" },
  { label: "Phone", value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, "")}`, icon: "📞" },
  { label: "LinkedIn", value: "Connect on LinkedIn", href: PROFILE.linkedin, icon: "💼" },
  { label: "GitHub", value: "View my repositories", href: PROFILE.github, icon: "💻" },
];

export default function ContactApp() {
  return (
    <div style={{ color: colors.textSecondary, fontFamily: font.family }}>
      <h2 style={{ color: "#fff", margin: "0 0 8px", fontSize: 24 }}>Let’s build something useful.</h2>
      <p style={{ color: colors.textMuted, margin: "0 0 22px", lineHeight: 1.6 }}>
        I’m available for React Native, mobile, and frontend opportunities in the UAE.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        {links.map((link) => (
          <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 10,
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", textDecoration: "none", color: "#fff" }}>
            <span style={{ fontSize: 22 }}>{link.icon}</span>
            <span><strong style={{ display: "block", fontSize: 13 }}>{link.label}</strong>
              <small style={{ color: colors.textMuted }}>{link.value}</small></span>
          </a>
        ))}
      </div>
    </div>
  );
}
