import { useEffect, useMemo, useRef, useState } from "react";
import { SPOTLIGHT_ITEMS } from "../../data/profile";
import { colors, font, shadows } from "../../styles/tokens";

export default function Spotlight({ onClose, onOpen }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return SPOTLIGHT_ITEMS.filter(item => !normalized || `${item.label} ${item.type}`.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => setSelected(0), [query]);

  const openResult = item => {
    if (!item) return;
    onOpen(item.id);
    onClose();
  };

  return (
    <div onPointerDown={onClose} style={backdropStyle}>
      <section
        onPointerDown={event => event.stopPropagation()}
        onKeyDown={event => {
          if (event.key === "ArrowDown") { event.preventDefault(); setSelected(index => Math.min(index + 1, results.length - 1)); }
          if (event.key === "ArrowUp") { event.preventDefault(); setSelected(index => Math.max(index - 1, 0)); }
          if (event.key === "Enter") openResult(results[selected]);
          if (event.key === "Escape") onClose();
        }}
        style={panelStyle}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 17px", borderBottom: colors.border }}>
          <span aria-hidden="true" style={{ color: colors.textMuted, fontSize: 25 }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search apps, projects and skills"
            aria-label="Spotlight search"
            style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", color: "#fff", fontSize: 18 }}
          />
          <kbd style={{ padding: "3px 6px", borderRadius: 5, background: "rgba(255,255,255,.08)", color: colors.textMuted, fontSize: 10 }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: 330, overflow: "auto", padding: 8 }}>
          {results.length === 0 ? (
            <p style={{ padding: 24, textAlign: "center", color: colors.textMuted, fontSize: 13 }}>No matching results</p>
          ) : results.map((item, index) => (
            <button
              key={`${item.type}-${item.label}`}
              type="button"
              onMouseEnter={() => setSelected(index)}
              onClick={() => openResult(item)}
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "36px 1fr auto",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                border: 0,
                borderRadius: 8,
                background: selected === index ? colors.accentHover : "transparent",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {typeof item.icon === "string" && /\.(png|jpe?g|svg|webp)$/i.test(item.icon) ? (
                <img src={item.icon} alt="" style={{ width: 30, height: 30, objectFit: "contain" }} />
              ) : <span style={{ fontSize: 24 }}>{item.icon}</span>}
              <span style={{ fontSize: 13 }}>{item.label}</span>
              <span style={{ color: colors.textMuted, fontSize: 11 }}>{item.type}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

const backdropStyle = { position: "absolute", inset: 0, zIndex: 2000, paddingTop: "11vh", display: "flex", alignItems: "flex-start", justifyContent: "center", background: "rgba(0,0,0,.34)", backdropFilter: "blur(5px)", fontFamily: font.family };
const panelStyle = { width: "min(620px, calc(100vw - 32px))", overflow: "hidden", border: colors.borderFocused, borderRadius: 16, background: "rgba(26,26,32,.94)", boxShadow: shadows.overlay };
