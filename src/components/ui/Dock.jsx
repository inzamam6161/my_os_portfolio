// src/components/ui/Dock.jsx
// ─────────────────────────────────────────────────────────────
// The macOS Dock at the bottom of the screen.
// Features: hover magnification, tooltips, open-app dot,
//           minimized-app dimming, separator + Mission Control.
//
// PROPS:
//   apps            — array from data/apps.js
//   windows         — current window state from useWindows()
//   onOpen(id)      — called when an icon is clicked
//   onMissionCtrl   — called when ⬆️ button is clicked
//   missionCtrlOpen — boolean, highlights the MC button
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { colors, blur, font, radii, shadows } from "../../styles/tokens";
import File from "../../icons/file-manager.png";


function IconContainer({app, size, isMinimized, hovered, isOpen}){

  return (
          <div
            style={{
              width: size,
              height: size,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isMinimized ? 0.45 : 1,

              transform: hovered
                ? "translateY(-6px) scale(1.08)"
                : "translateY(0) scale(1)",

              transition: "all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",

              filter: hovered
                ? "drop-shadow(0 10px 10px rgba(0,0,0,0.35))"
                : isOpen
                  ? "drop-shadow(0 5px 8px rgba(94,92,230,0.35))"
                  : "none",
            }}
          >
            <img
              src={app.icon || app}
              alt={`${app.label} icon`}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                pointerEvents: "none",
              }}
            />
          </div>
  )
}  

export default function Dock({ apps, windows, onOpen, onMissionCtrl, missionCtrlOpen }) {
  const [hovered, setHovered] = useState(null); // id of hovered icon

  return (
    <div style={{
      position:       "fixed",
      bottom:         12,
      left:           "50%",
      transform:      "translateX(-50%)",
      display:        "flex",
      alignItems:     "flex-end",
      gap:            8,
      background:     colors.dock,
      backdropFilter:       blur.dock,
      WebkitBackdropFilter: blur.dock,
      border:         "0.5px solid rgba(255,255,255,0.13)",
      borderRadius:   20,
      padding:        "8px 16px",
      zIndex:         1500,
    }}>
      {/* App icons */}
      {apps.map(app => (
        <DockIcon
          key={app.id}
          app={app}
          windows={windows}
          hovered={hovered === app.id}
          onMouseEnter={() => setHovered(app.id)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onOpen(app.id)}
        />
      ))}

      {/* Separator */}
      <div style={{
        width:      1,
        height:     48,
        background: "rgba(255,255,255,0.12)",
        margin:     "0 4px",
        alignSelf:  "center",
      }} />

      {/* Mission Control button */}
      <DockButton
        label="Mission Control"
        active={missionCtrlOpen}
        hovered={hovered === "__mc"}
        onMouseEnter={() => setHovered("__mc")}
        onMouseLeave={() => setHovered(null)}
        onClick={onMissionCtrl}
      />
    </div>
  );
}

// ── Single app icon in the dock ───────────────────────────────
function DockIcon({ app, windows, hovered, onMouseEnter, onMouseLeave, onClick }) {
  const winState  = windows.find(w => w.id === app.id);
  const isOpen    = !!winState;
  const isMinimized = winState?.minimized ?? false;
  const size      = hovered ? 64 : 48;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            4,
        cursor:         "pointer",
        position:       "relative",
      }}
    >
      {/* Tooltip */}
      {hovered && <DockTooltip label={app.label} />}

      {/* Icon box */}
      <div style={{
        width:        size,
        height:       size,
        background:   isOpen
          ? "rgba(94,92,230,0.22)"
          : hovered ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)",
        borderRadius: size * 0.22,
        border:       isOpen
          ? "0.5px solid rgba(94,92,230,0.5)"
          : "0.5px solid rgba(255,255,255,0.1)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       size * 0.48,
        opacity:        isMinimized ? 0.45 : 1,
        transition:     "all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow:      hovered ? shadows.dock : "none",
      }}>
        {<IconContainer app={app} size={size} isMinimized={isMinimized} hovered={hovered} isOpen={isOpen}/>}
      </div>
      {/* Open dot */}
      <div style={{
        width:        4,
        height:       4,
        borderRadius: "50%",
        background:   isOpen ? colors.accent : "transparent",
        transition:   "background 0.2s",
      }} />
    </div>
  );
}

// ── Generic dock button (Mission Control etc.) ────────────────
function DockButton({ icon, label, active, hovered, onMouseEnter, onMouseLeave, onClick }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           4,
        cursor:        "pointer",
        position:      "relative",
      }}
    >
      {hovered && <DockTooltip label={label} />}
      <div style={{
        width:          48,
        height:         48,
        background:     active ? "rgba(94,92,230,0.22)" : hovered ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)",
        borderRadius:   48 * 0.22,
        border:         "0.5px solid rgba(255,255,255,0.1)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       22,
        transition:     "all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow:      hovered ? shadows.dock : "none",
      }}>
        <IconContainer app={File}/>
      </div>
      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "transparent" }} />
    </div>
  );
}

// ── Tooltip bubble ────────────────────────────────────────────
function DockTooltip({ label }) {
  return (
    <div style={{
      position:       "absolute",
      bottom:         "calc(100% + 10px)",
      background:     "rgba(28,28,34,0.95)",
      backdropFilter: "blur(12px)",
      color:          colors.textPrimary,
      fontSize:       font.sizes.sm,
      fontWeight:     font.weights.medium,
      fontFamily:     font.family,
      padding:        "4px 10px",
      borderRadius:   6,
      border:         "0.5px solid rgba(255,255,255,0.12)",
      whiteSpace:     "nowrap",
      pointerEvents:  "none",
      zIndex:         9999,
    }}>
      {label}
    </div>
  );
}
