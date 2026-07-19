// src/components/apps/ContactApp.jsx
import { useState } from "react";
import { PROFILE } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

const LINKS = [
  { label: "GitHub",   icon: "🐙", href: "https://github.com"   },
  { label: "LinkedIn", icon: "💼", href: "https://linkedin.com" },
  { label: "Twitter",  icon: "𝕏",  href: "https://x.com"       },
  { label: "Email",    icon: "✉️", href: `mailto:${PROFILE.email}` },
];

export default function ContactApp() {
  const [sent, setSent]   = useState(false);
  const [form, setForm]   = useState({ name: "", email: "", message: "" });

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div style={{ color: colors.textSecondary, fontFamily: font.family }}>
      {/* Social link buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {LINKS.map(link => (
          <SocialLink key={link.label} {...link} />
        ))}
      </div>

      {sent ? <SuccessState /> : (
        <ContactForm form={form} onChange={update} onSubmit={() => setSent(true)} />
      )}
    </div>
  );
}

function SocialLink({ label, icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        8,
        padding:    "8px 16px",
        background: "rgba(255,255,255,0.05)",
        border:     "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        textDecoration: "none",
        color:      "rgba(255,255,255,0.8)",
        fontSize:   14,
        transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(94,92,230,0.2)";
        e.currentTarget.style.color      = "#fff";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.color      = "rgba(255,255,255,0.8)";
      }}
    >
      {icon} {label}
    </a>
  );
}

function ContactForm({ form, onChange, onSubmit }) {
  const inputStyle = {
    display:      "block",
    width:        "100%",
    marginBottom: 10,
    background:   "rgba(255,255,255,0.05)",
    border:       "0.5px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding:      "10px 14px",
    color:        "#fff",
    fontSize:     14,
    outline:      "none",
    boxSizing:    "border-box",
    fontFamily:   font.family,
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "0 0 14px" }}>
        Send a direct message
      </p>
      <input placeholder="Your name"        value={form.name}    onChange={onChange("name")}    style={inputStyle} />
      <input placeholder="your@email.com"   value={form.email}   onChange={onChange("email")}   style={inputStyle} />
      <textarea
        placeholder="What's on your mind?"
        value={form.message}
        onChange={onChange("message")}
        rows={4}
        style={{ ...inputStyle, resize: "vertical", marginBottom: 14 }}
      />
      <button
        onClick={onSubmit}
        style={{
          background:   colors.accent,
          color:        "#fff",
          border:       "none",
          borderRadius: 8,
          padding:      "10px 24px",
          fontSize:     14,
          fontWeight:   600,
          cursor:       "pointer",
          transition:   "opacity 0.15s",
          fontFamily:   font.family,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Send Message →
      </button>
    </div>
  );
}

function SuccessState() {
  return (
    <div style={{ textAlign: "center", padding: "52px 20px", color: "#30D158", fontSize: 16 }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
      Message sent! I'll get back to you soon.
    </div>
  );
}
