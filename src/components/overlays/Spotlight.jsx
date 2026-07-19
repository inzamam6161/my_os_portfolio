// src/components/overlays/Spotlight.jsx
// ─────────────────────────────────────────────────────────────
// Full-screen Spotlight search overlay.
// Keyboard: ↑↓ to navigate, Enter to open, Escape to close.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { SPOTLIGHT_ITEMS } from "../../data/profile";
import { font, blur } from "../../styles/tokens";

export default function Spotlight({ onClose, onOpen }) {
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef();

  // Auto-focus the input when modal opens
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Reset selection when query changes
  useEffect(() => { setSelected(0); }, [query]);

  const results = query.trim()
    ? SPOTLIGHT_ITEMS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      )
    : SPOTLIGHT_ITEMS.slice(0, 7);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter")     { if (results[selected]) { onOpen(results[selected].id); onClose(); } }
    if (e.key === "Escape")    onClose();
  };

  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         4000,
        background:     "rgba(0,0,0,0.45)",
        backdropFilter: blur.overlay,
        display:        "flex",
        alignItems:     "flex-start",
        justifyContent: "center",
        paddingTop:     140,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width:          580,
        background:     "rgba(28,28,34,0.97)",
        backdropFilter:       blur.window,
        WebkitBackdropFilter: blur.window,
        borderRadius:   14,
        border:         "0.5px solid rgba(255,255,255,0.16)",
        boxShadow:      "0 32px 80px rgba(0,0,0,0.7)",
        overflow:       "hidden",
        fontFamily:     font.family,
      }}>
        {/* Search input row */}
        <div style={{
          display:      "flex",
          alignItems:   "center",
          padding:      "0 16px",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        }}>
          <span style={{ fontSize: 18, marginRight: 10, opacity: 0.45 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spotlight Search"
            style={{
              flex:       1,
              background: "none",
              border:     "none",
              outline:    "none",
              color:      "#fff",
              fontSize:   20,
              padding:    "14px 0",
              fontFamily: font.family,
            }}
          />
          {query && (
            <span onClick={() => setQuery("")} style={{ cursor: "pointer", opacity: 0.4, fontSize: 14 }}>✕</span>
          )}
        </div>

        {/* Results list */}
        {results.length > 0 && (
          <div style={{ padding: "6px 0", maxHeight: 320, overflow: "auto" }}>
            {results.map((item, i) => (
              <SpotlightRow
                key={item.label + i}
                item={item}
                isSelected={selected === i}
                onHover={() => setSelected(i)}
                onPick={() => { onOpen(item.id); onClose(); }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {results.length === 0 && (
          <div style={{ padding: "24px 16px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            No results for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

function SpotlightRow({ item, isSelected, onHover, onPick }) {
  console.log("item", item)
  return (
    <div
      onClick={onPick}
      onMouseEnter={onHover}
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        12,
        padding:    "8px 16px",
        cursor:     "default",
        background: isSelected ? "rgba(94,92,230,0.3)" : "transparent",
        transition: "background 0.1s",
      }}
    >
      {
        (item.type === "App") ? 
              <img
                src={item.icon}
                alt={`${item.label} icon`}
                draggable={false}
                style={{
                  width: 20,
                  height: 20,
                  objectFit: "contain",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
        : <span style={{ fontSize: 20 }}>{item.icon}</span>
      }
      <div>
        <div style={{ fontSize: 14, color: "#fff", fontWeight: font.weights.medium }}>{item.label}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{item.type}</div>
      </div>
    </div>
  );
}
