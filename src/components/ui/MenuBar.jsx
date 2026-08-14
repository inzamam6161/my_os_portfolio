import { useTime } from "../../hooks/useTime";
import { PROFILE } from "../../data/profile";
import { blur, colors, font } from "../../styles/tokens";

export default function MenuBar({
  activeApp,
  onSpotlight,
  onNotifications,
  notifCount,
  onWallpaper,
}) {
  const time = useTime();
  const formattedTime = new Intl.DateTimeFormat("en-AE", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(time);

  return (
    <header
      style={{
        position: "absolute",
        inset: "0 0 auto 0",
        zIndex: 1000,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        color: colors.textPrimary,
        background: colors.menuBar,
        backdropFilter: blur.menuBar,
        borderBottom: colors.borderSubtle,
        fontFamily: font.family,
        fontSize: 12,
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
        <button type="button" onClick={onWallpaper} aria-label="Change wallpaper" style={menuButtonStyle}>
          ●
        </button>
        <strong style={{ whiteSpace: "nowrap" }}>{activeApp || PROFILE.name}</strong>
        <span className="desktop-menu-item" style={{ color: colors.textSecondary }}>File</span>
        <span className="desktop-menu-item" style={{ color: colors.textSecondary }}>View</span>
        <span className="desktop-menu-item" style={{ color: colors.textSecondary }}>Window</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span aria-label="Wi-Fi connected" style={{ padding: "3px 6px" }}>⌁</span>
        <button type="button" onClick={onSpotlight} style={menuButtonStyle} aria-label="Open Spotlight search">⌕</button>
        <button type="button" onClick={onNotifications} style={menuButtonStyle} aria-label="Open notifications">
          ◐{notifCount > 0 && <span style={badgeStyle}>{notifCount}</span>}
        </button>
        <span style={{ minWidth: 92, textAlign: "right", whiteSpace: "nowrap" }}>{formattedTime}</span>
      </div>
    </header>
  );
}

const menuButtonStyle = {
  position: "relative",
  minWidth: 26,
  height: 24,
  padding: "0 6px",
  border: 0,
  borderRadius: 5,
  color: "#fff",
  background: "transparent",
  cursor: "pointer",
  fontSize: 15,
};

const badgeStyle = {
  position: "absolute",
  top: -2,
  right: -2,
  minWidth: 14,
  height: 14,
  padding: "0 3px",
  borderRadius: 999,
  background: colors.danger,
  color: "#fff",
  fontSize: 9,
  lineHeight: "14px",
  textAlign: "center",
};
