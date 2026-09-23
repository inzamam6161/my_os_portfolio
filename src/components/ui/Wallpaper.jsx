import { WALLPAPERS } from "../../data/profile";
import { blur, colors, font, shadows } from "../../styles/tokens";

export function Wallpaper({ wallpaperId }) {
  const wallpaper = WALLPAPERS.find(item => item.id === wallpaperId) || WALLPAPERS[0];

  return (
    <div className={`ref-wallpaper ${wallpaper.id === "aurora" ? "aurora" : ""}`} style={{ background: wallpaper.bg }}>
      {wallpaper.id === "aurora" && (
        <>
          <div className="ref-aurora" />
          <div className="ref-stars" />
          <div className="ref-mountain back" />
          <div className="ref-mountain front" />
          <div className="ref-lake" />
        </>
      )}
    </div>
  );
}

export function WallpaperPicker({ current, onSelect, onClose }) {
  return (
    <div onPointerDown={onClose} style={overlayStyle}>
      <section onPointerDown={event => event.stopPropagation()} style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 18 }}>Wallpaper</h2>
            <p style={{ marginTop: 4, color: colors.textMuted, fontSize: 12 }}>Choose a desktop atmosphere.</p>
          </div>
          <button type="button" onClick={onClose} style={closeStyle}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
          {WALLPAPERS.map(wallpaper => (
            <button
              key={wallpaper.id}
              type="button"
              onClick={() => onSelect(wallpaper.id)}
              style={{
                padding: 0,
                overflow: "hidden",
                borderRadius: 10,
                border: current === wallpaper.id ? "2px solid #fff" : colors.border,
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ display: "block", height: 82, background: wallpaper.bg }} />
              <span style={{ display: "block", padding: "9px 10px", background: "rgba(255,255,255,.05)", fontSize: 12 }}>{wallpaper.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

const overlayStyle = {
  position: "absolute", inset: 0, zIndex: 1900, display: "grid", placeItems: "center",
  padding: 20, background: colors.overlay, backdropFilter: blur.overlay, fontFamily: font.family,
};

const panelStyle = {
  width: "min(620px, 100%)", padding: 22, border: colors.borderFocused, borderRadius: 16,
  background: "rgba(28,28,34,.96)", boxShadow: shadows.overlay, color: "#fff",
};

const closeStyle = {
  width: 30, height: 30, border: 0, borderRadius: 8, color: "#fff",
  background: "rgba(255,255,255,.08)", cursor: "pointer", fontSize: 20,
};
