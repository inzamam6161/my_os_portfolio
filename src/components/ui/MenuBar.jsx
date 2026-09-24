import { useTime } from "../../hooks/useTime";
import { font } from "../../styles/tokens";

export default function MenuBar({
  activeApp,
  onSpotlight,
  onNotifications,
  notifCount,
  onWallpaper,
  onOpenApp,
  onHome,
}) {
  const time = useTime();

  const formattedTime = new Intl.DateTimeFormat("en-AE", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(time);

  const nav = [
    ["Portfolio", "home"],
    ["Projects", "projects"],
    ["Skills", "skills"],
    ["Experience", "resume"],
    ["About", "about"],
  ];

  return (
    <header className="ref-menubar" style={{ fontFamily: font.family }}>
      <div className="ref-menu-left">
        <button
          className="ref-apple"
          type="button"
          onClick={onWallpaper}
          aria-label="Change wallpaper"
        >
          
        </button>

        {nav.map(([label, id]) => (
          <button
            key={label}
            type="button"
            aria-label={id ? `Open ${label} navigation` : label}
            className={
              (id === "home" && !activeApp) || activeApp === label
                ? "active"
                : ""
            }
            onClick={() => {
              if (id === "home") {
                onHome?.();
                return;
              }
              onOpenApp?.(id);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ref-menu-right">
        <button
          className="ref-search"
          type="button"
          aria-label="Open Spotlight search"
          onClick={onSpotlight}
        >
          <span>⌕</span>
          <em>Search anything...</em>
          <kbd>⌘ K</kbd>
        </button>

        <button
          className="ref-menu-icon"
          type="button"
          aria-label="Notifications"
          onClick={onNotifications}
        >
          ♧
          {notifCount > 0 && <span>{notifCount}</span>}
        </button>

        <button
          className="ref-menu-icon"
          type="button"
          aria-label="Appearance"
          onClick={onWallpaper}
        >
          ☼
        </button>

        <time>{formattedTime}</time>
      </div>
    </header>
  );
}
