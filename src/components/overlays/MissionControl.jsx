import { WINDOW_TITLES } from "../../data/apps";
import { colors, font, shadows } from "../../styles/tokens";

export default function MissionControl({ windows, apps, onClose, onFocus }) {
  return (
    <div onPointerDown={onClose} style={backdropStyle}>
      <section onPointerDown={event => event.stopPropagation()} style={{ width: "min(980px, 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20 }}>Mission Control</h2>
            <p style={{ marginTop: 5, color: colors.textMuted, fontSize: 12 }}>Select an open window to bring it forward.</p>
          </div>
          <button type="button" onClick={onClose} style={closeStyle}>Done</button>
        </div>

        {windows.length === 0 ? (
          <p style={{ padding: 48, textAlign: "center", color: colors.textMuted }}>No open windows</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {windows.map(windowItem => {
              const app = apps.find(item => item.id === windowItem.id);
              return (
                <button
                  key={windowItem.id}
                  type="button"
                  onClick={() => onFocus(windowItem.id)}
                  style={{
                    minHeight: 150,
                    padding: 14,
                    border: colors.borderFocused,
                    borderRadius: 13,
                    background: "linear-gradient(145deg, rgba(44,44,54,.96), rgba(20,20,27,.96))",
                    boxShadow: shadows.menu,
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ height: 26, display: "flex", alignItems: "center", gap: 7, margin: "-4px -4px 12px", padding: "0 7px", borderBottom: colors.border }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF5F57" }} />
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FEBC2E" }} />
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#28C840" }} />
                  </div>
                  <div style={{ display: "grid", placeItems: "center", minHeight: 76 }}>
                    {app?.icon && <img src={app.icon} alt="" style={{ width: 54, height: 54, objectFit: "contain", opacity: windowItem.minimized ? .55 : 1 }} />}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12 }}>
                    <strong>{WINDOW_TITLES[windowItem.id]}</strong>
                    {windowItem.minimized && <span style={{ color: colors.warning }}>Minimized</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const backdropStyle = { position: "absolute", inset: 0, zIndex: 1900, padding: "8vh 5vw 120px", overflow: "auto", background: "rgba(5,5,10,.72)", backdropFilter: "blur(20px)", color: "#fff", fontFamily: font.family };
const closeStyle = { padding: "7px 12px", border: colors.border, borderRadius: 8, background: "rgba(255,255,255,.08)", color: "#fff", cursor: "pointer" };
