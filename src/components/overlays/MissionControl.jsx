// src/components/overlays/MissionControl.jsx
// ─────────────────────────────────────────────────────────────
// Bird's-eye view of all open windows (like macOS Mission Control).
// Click a thumbnail to bring that window to focus.
// ─────────────────────────────────────────────────────────────

import { font, blur } from "../../styles/tokens";

export default function MissionControl({ windows, apps, onClose, onFocus }) {
  const visibleWindows = windows.filter(w => !w.minimized);

  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         4500,
        background:     "rgba(0,0,0,0.62)",
        backdropFilter: blur.overlay,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        fontFamily:     font.family,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>
        Mission Control — click a window to focus
      </p>

      <div style={{
        display:        "flex",
        gap:            18,
        flexWrap:       "wrap",
        justifyContent: "center",
        maxWidth:       960,
        padding:        "0 40px",
      }}>
        {visibleWindows.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>No open windows</p>
        )}
        {visibleWindows.map(w => {
          const app = apps.find(a => a.id === w.id);
          return (
            <WindowThumbnail
              key={w.id}
              app={app}
              onClick={() => { onFocus(w.id); onClose(); }}
            />
          );
        })}
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop:    32,
          background:   "rgba(255,255,255,0.1)",
          border:       "0.5px solid rgba(255,255,255,0.2)",
          borderRadius: 8,
          color:        "rgba(255,255,255,0.7)",
          fontSize:     13,
          padding:      "6px 20px",
          cursor:       "pointer",
          fontFamily:   font.family,
        }}
      >
        Done
      </button>
    </div>
  );
}

function WindowThumbnail({ app, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width:        220,
        height:       150,
        background:   "rgba(28,28,34,0.92)",
        border:       "0.5px solid rgba(255,255,255,0.15)",
        borderRadius: 10,
        cursor:       "pointer",
        overflow:     "hidden",
        boxShadow:    "0 8px 24px rgba(0,0,0,0.5)",
        transition:   "transform 0.15s, box-shadow 0.15s",
        fontFamily:   font.family,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform  = "scale(1.05)";
        e.currentTarget.style.boxShadow  = "0 16px 40px rgba(0,0,0,0.7)";
        e.currentTarget.style.borderColor = "rgba(94,92,230,0.5)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform  = "scale(1)";
        e.currentTarget.style.boxShadow  = "0 8px 24px rgba(0,0,0,0.5)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
    >
      {/* Fake title bar */}
      <div style={{
        height:      32,
        background:  "rgba(40,40,46,0.8)",
        display:     "flex",
        alignItems:  "center",
        padding:     "0 10px",
        gap:         8,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", display:'flex', flexDirection:'row', alignItems:'center'}}>
          {/* {app?.icon} {app?.label} */}
            <img
              src={app.icon}
              alt={`${app.label} icon`}
              draggable={false}
              style={{
                width: 20,
                height: 20,
                marginRight:5,
                objectFit: "contain",
                display: "block",
                pointerEvents: "none",
              }}
            />
            {app?.label}
        </span>
      </div>

      {/* Fake content area */}
      <div style={{
        height:         "calc(100% - 32px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       38,
        background:     "rgba(255,255,255,0.02)",
      }}>
        {/* //{app?.icon} */}
            <img
              src={app.icon}
              alt={`${app.label} icon`}
              draggable={false}
              style={{
                width: 20,
                height: 20,
                objectFit: "contain",
                display: "block",
                pointerEvents: "none",
              }}
            />
      </div>
    </div>
  );
}
