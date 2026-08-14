import { colors, font, shadows } from "../../styles/tokens";

export default function NotificationCenter({ notifications, onClose, onDismiss, onClearAll }) {
  return (
    <aside style={panelStyle} aria-label="Notification Center">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
        <strong style={{ fontSize: 16 }}>Notifications</strong>
        <div style={{ display: "flex", gap: 6 }}>
          {notifications.length > 0 && <button type="button" onClick={onClearAll} style={textButtonStyle}>Clear all</button>}
          <button type="button" onClick={onClose} aria-label="Close notifications" style={closeButtonStyle}>×</button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div style={{ padding: "52px 16px", textAlign: "center", color: colors.textMuted }}>
          <div style={{ marginBottom: 10, fontSize: 34 }}>◐</div>
          <p style={{ color: colors.textSecondary, fontSize: 13 }}>No new notifications</p>
          <p style={{ marginTop: 5, fontSize: 11 }}>You’re all caught up.</p>
        </div>
      ) : notifications.map(notification => (
        <article key={notification.id} style={{ position: "relative", marginBottom: 8, padding: 12, border: colors.border, borderRadius: 10, background: "rgba(255,255,255,.05)" }}>
          <strong style={{ display: "block", paddingRight: 24, fontSize: 12 }}>{notification.title}</strong>
          <p style={{ marginTop: 5, color: colors.textMuted, fontSize: 11, lineHeight: 1.45 }}>{notification.message}</p>
          <button type="button" onClick={() => onDismiss(notification.id)} aria-label={`Dismiss ${notification.title}`} style={{ ...closeButtonStyle, position: "absolute", top: 7, right: 7, width: 22, height: 22 }}>×</button>
        </article>
      ))}
    </aside>
  );
}

const panelStyle = { position: "absolute", zIndex: 1950, top: 38, right: 10, width: "min(350px, calc(100vw - 20px))", maxHeight: "calc(100vh - 120px)", overflow: "auto", padding: 16, border: colors.borderFocused, borderRadius: 14, background: "rgba(25,25,31,.96)", boxShadow: shadows.overlay, color: "#fff", fontFamily: font.family };
const closeButtonStyle = { width: 28, height: 28, padding: 0, border: 0, borderRadius: 7, background: "rgba(255,255,255,.08)", color: "#fff", cursor: "pointer", fontSize: 18 };
const textButtonStyle = { padding: "0 8px", border: 0, background: "transparent", color: colors.cyan, cursor: "pointer", fontSize: 11 };
