import { useEffect } from "react";
import { colors, font, shadows } from "../../styles/tokens";

const ACTIONS = [
  { id: "refresh", label: "Refresh desktop", icon: "↻" },
  { id: "spotlight", label: "Open Spotlight", icon: "⌕" },
  { id: "wallpaper", label: "Change wallpaper", icon: "◫" },
];

export default function ContextMenu({ x, y, onClose, onAction }) {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [onClose]);

  const left = Math.min(x, window.innerWidth - 210);
  const top = Math.min(y, window.innerHeight - 150);

  return (
    <div
      onPointerDown={event => event.stopPropagation()}
      style={{ position: "absolute", zIndex: 2100, left, top, width: 196, padding: 6, border: colors.borderFocused, borderRadius: 10, background: "rgba(30,30,36,.96)", boxShadow: shadows.menu, fontFamily: font.family }}
    >
      {ACTIONS.map(action => (
        <button
          key={action.id}
          type="button"
          onClick={() => { onAction(action.id); onClose(); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 9px", border: 0, borderRadius: 6, background: "transparent", color: "#fff", cursor: "pointer", textAlign: "left", fontSize: 12 }}
          onMouseEnter={event => { event.currentTarget.style.background = colors.accent; }}
          onMouseLeave={event => { event.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ width: 18, textAlign: "center", color: colors.textSecondary }}>{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
}
