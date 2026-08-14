import { blur, colors, font, shadows } from "../../styles/tokens";

export default function Dock({ apps, windows, onOpen, onMissionCtrl, missionCtrlOpen }) {
  const opened = new Set(windows.map(windowItem => windowItem.id));

  return (
    <nav
      className="portfolio-dock"
      aria-label="Application dock"
      style={{
        position: "absolute",
        left: "50%",
        bottom: 12,
        zIndex: 1100,
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        padding: "8px 10px 7px",
        border: colors.borderFocused,
        borderRadius: 18,
        background: colors.dock,
        backdropFilter: blur.dock,
        boxShadow: shadows.dock,
        fontFamily: font.family,
      }}
    >
      {apps.map(app => (
        <DockButton
          key={app.id}
          label={app.label}
          icon={app.icon}
          active={opened.has(app.id)}
          onClick={() => onOpen(app.id)}
        />
      ))}

      <span aria-hidden="true" style={{ width: 1, height: 38, margin: "0 2px", background: "rgba(255,255,255,.16)" }} />

      <DockButton
        label="Mission Control"
        icon="▦"
        active={missionCtrlOpen}
        onClick={onMissionCtrl}
      />
    </nav>
  );
}

function DockButton({ label, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        position: "relative",
        width: 48,
        height: 48,
        display: "grid",
        placeItems: "center",
        border: 0,
        borderRadius: 12,
        background: "rgba(255,255,255,.06)",
        color: "#fff",
        cursor: "pointer",
        fontSize: 29,
        transition: "transform .16s ease, background .16s ease",
      }}
      onMouseEnter={event => { event.currentTarget.style.transform = "translateY(-7px) scale(1.08)"; }}
      onMouseLeave={event => { event.currentTarget.style.transform = "none"; }}
    >
      {typeof icon === "string" && icon.startsWith("/") ? (
        <img src={icon} alt="" style={{ width: 37, height: 37, objectFit: "contain" }} />
      ) : typeof icon === "string" && /\.(png|jpe?g|svg|webp)$/i.test(icon) ? (
        <img src={icon} alt="" style={{ width: 37, height: 37, objectFit: "contain" }} />
      ) : (
        <span aria-hidden="true">{icon}</span>
      )}
      {active && <span style={{ position: "absolute", bottom: -5, width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />}
    </button>
  );
}
