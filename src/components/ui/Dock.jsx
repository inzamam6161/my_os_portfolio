import { blur, font, shadows } from "../../styles/tokens";

export default function Dock({ apps, windows, onOpen, onMissionCtrl, missionCtrlOpen }) {
  const opened = new Set(windows.map(item => item.id));

  return (
    <nav className="portfolio-dock ref-dock" style={{ fontFamily: font.family, backdropFilter: blur.dock, boxShadow: shadows.dock }}>
      {apps.map(app => (
        <DockButton key={app.id} {...app} active={opened.has(app.id)} onClick={() => onOpen(app.id)} />
      ))}
      <span className="ref-dock-divider" />
      <DockButton label="Mission Control" icon="▦" active={missionCtrlOpen} onClick={onMissionCtrl} />
    </nav>
  );
}

function DockButton({ label, icon, active, onClick }) {
  return (
    <button className="ref-dock-button" type="button" onClick={onClick} title={label} aria-label={label}>
      {typeof icon === "string" && (icon.startsWith("/") || /\.(png|jpe?g|svg|webp)$/i.test(icon))
        ? <img src={icon} alt="" />
        : <span>{icon}</span>}
      {active && <i />}
    </button>
  );
}
