// src/components/ui/Wallpaper.jsx
// ─────────────────────────────────────────────────────────────
// The desktop background layer + dot-grid SVG texture.
// Also exports the WallpaperPicker modal.
// ─────────────────────────────────────────────────────────────

import { WALLPAPERS } from "../../data/profile";
import { font } from "../../styles/tokens";

// ── Desktop wallpaper (always rendered behind everything) ─────
export function Wallpaper({ wallpaperId }) {
  const wp = WALLPAPERS.find(w => w.id === wallpaperId) || WALLPAPERS[0];

  return (
    <div style={{
      position:   "absolute",
      inset:      0,
      background: wp.bg,
      transition: "background 0.7s ease",
    }}>
      {/* Subtle dot-grid texture */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
        <defs>
          <pattern id="dotgrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>
    </div>
  );
}

// ── Wallpaper picker modal ────────────────────────────────────
export function WallpaperPicker({ current, onSelect, onClose }) {
  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         4000,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        background:     "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background:   "rgba(28,28,34,0.97)",
        border:       "0.5px solid rgba(255,255,255,0.14)",
        borderRadius: 14,
        padding:      24,
        width:        440,
        boxShadow:    "0 32px 80px rgba(0,0,0,0.7)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: font.family }}>
            🖼 Wallpaper
          </span>
          <span onClick={onClose} style={{ cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 16 }}>✕</span>
        </div>

        {/* Swatches */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {WALLPAPERS.map(wp => (
            <div
              key={wp.id}
              onClick={() => { onSelect(wp.id); onClose(); }}
              style={{
                height:       56,
                borderRadius: 8,
                cursor:       "pointer",
                background:   wp.bg,
                border:       `2px solid ${current === wp.id ? "#5E5CE6" : "rgba(255,255,255,0.1)"}`,
                position:     "relative",
                overflow:     "hidden",
                transition:   "border-color 0.15s, transform 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {current === wp.id && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.3)", fontSize: 18,
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 6 }}>
          {WALLPAPERS.map(wp => (
            <div key={wp.id} style={{
              textAlign:  "center",
              fontSize:   10,
              color:      current === wp.id ? "#5E5CE6" : "rgba(255,255,255,0.4)",
              fontFamily: font.family,
            }}>
              {wp.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
