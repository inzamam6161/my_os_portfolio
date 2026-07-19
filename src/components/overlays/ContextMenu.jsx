// src/components/overlays/ContextMenu.jsx
// ─────────────────────────────────────────────────────────────
// Right-click context menu for the desktop.
// Closes on any outside click automatically.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { font } from "../../styles/tokens";

const MENU_ITEMS = [
  { label: "New Folder",       icon: "📁", action: "folder"    },
  { label: "Get Info",         icon: "ℹ️", action: "info"      },
  null,
  { label: "Change Wallpaper", icon: "🖼",  action: "wallpaper" },
  { label: "Sort By",          icon: "↕️",  action: "sort"      },
  null,
  { label: "Open Spotlight",   icon: "🔍", action: "spotlight" },
];

export default function ContextMenu({ x, y, onClose, onAction }) {
  const ref = useRef();

  useEffect(() => {
    const handler = () => onClose();
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position:       "fixed",
        left:           x,
        top:            y,
        zIndex:         5000,
        background:     "rgba(30,30,36,0.97)",
        backdropFilter: "blur(20px)",
        border:         "0.5px solid rgba(255,255,255,0.13)",
        borderRadius:   10,
        padding:        "5px 0",
        minWidth:       200,
        boxShadow:      "0 16px 48px rgba(0,0,0,0.6)",
        fontFamily:     font.family,
      }}
    >
      {MENU_ITEMS.map((item, i) =>
        item === null ? (
          <div key={i} style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
        ) : (
          <div
            key={item.label}
            onClick={() => { onAction(item.action); onClose(); }}
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        10,
              padding:    "6px 14px",
              fontSize:   font.sizes.base,
              color:      "rgba(255,255,255,0.85)",
              cursor:     "default",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(94,92,230,0.35)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </div>
        )
      )}
    </div>
  );
}
