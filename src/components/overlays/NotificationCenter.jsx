// src/components/overlays/NotificationCenter.jsx
// ─────────────────────────────────────────────────────────────
// Slide-in panel from the right showing notifications,
// a live clock widget, and a Focus mode badge.
// ─────────────────────────────────────────────────────────────

import { useTime } from "../../hooks/useTime";
import { colors, font, blur } from "../../styles/tokens";

export default function NotificationCenter({ notifications, onClose, onDismiss, onClearAll }) {
  const time = useTime();

  const clockStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr  = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{
      position:             "fixed",
      top:                  28,   // below menu bar
      right:                0,
      bottom:               0,
      zIndex:               3500,
      width:                340,
      background:           "rgba(22,22,28,0.90)",
      backdropFilter:       blur.window,
      WebkitBackdropFilter: blur.window,
      borderLeft:           "0.5px solid rgba(255,255,255,0.08)",
      display:              "flex",
      flexDirection:        "column",
      fontFamily:           font.family,
    }}>
      {/* Header */}
      <div style={{
        padding:      "16px 16px 10px",
        display:      "flex",
        justifyContent: "space-between",
        alignItems:   "center",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Notification Centre</span>
        <div style={{ display: "flex", gap: 14 }}>
          <span onClick={onClearAll} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>Clear All</span>
          <span onClick={onClose}    style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>✕</span>
        </div>
      </div>

      {/* Clock widget */}
      <div style={{ padding: "16px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 46, fontWeight: 200, color: "#fff", lineHeight: 1, letterSpacing: -1 }}>
          {clockStr}
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{dateStr}</div>
      </div>

      {/* Focus mode widget */}
      <div style={{ padding: "12px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <SectionLabel>Focus</SectionLabel>
        <div style={{
          background:  "rgba(94,92,230,0.15)",
          border:      "0.5px solid rgba(94,92,230,0.3)",
          borderRadius: 10,
          padding:     "10px 14px",
          display:     "flex",
          alignItems:  "center",
          gap:         10,
        }}>
          <span style={{ fontSize: 20 }}>🎯</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Work Focus</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>On · Until 6:00 PM</div>
          </div>
        </div>
      </div>

      {/* Notification list */}
      <div style={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>
        <SectionLabel>Notifications</SectionLabel>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
            No new notifications
          </div>
        ) : (
          notifications.map(n => (
            <NotifCard key={n.id} notif={n} onDismiss={() => onDismiss(n.id)} />
          ))
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize:      11,
      fontWeight:    600,
      letterSpacing: 1,
      color:         "rgba(255,255,255,0.3)",
      textTransform: "uppercase",
      marginBottom:  10,
    }}>
      {children}
    </div>
  );
}

function NotifCard({ notif, onDismiss }) {
  return (
    <div style={{
      background:   notif.read ? "rgba(255,255,255,0.04)" : "rgba(94,92,230,0.12)",
      border:       `0.5px solid ${notif.read ? "rgba(255,255,255,0.07)" : "rgba(94,92,230,0.25)"}`,
      borderRadius: 10,
      padding:      "10px 12px",
      marginBottom: 8,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 22 }}>{notif.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{notif.app}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{notif.time}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff",              marginBottom: 2 }}>{notif.title}</div>
          <div style={{ fontSize: 12,                  color: "rgba(255,255,255,0.55)" }}>{notif.body}</div>
        </div>
        <span onClick={onDismiss} style={{ color: "rgba(255,255,255,0.25)", cursor: "pointer", fontSize: 13 }}>✕</span>
      </div>
    </div>
  );
}
