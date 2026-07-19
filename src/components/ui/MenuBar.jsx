// src/components/ui/MenuBar.jsx
// ─────────────────────────────────────────────────────────────
// The top macOS menu bar with Apple menu, app name, system
// tray icons (clock, battery, notifications, spotlight).
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { colors, blur, font } from "../../styles/tokens";
import { useTime } from "../../hooks/useTime";

import wifiIcon from "../../icons/wifi.png";
import batteryIcon from "../../icons/battery.png";
import notificationIcon from "../../icons/notifications.png";
import spotlightIcon from "../../icons/spotlight-search.png";
import themeIcon from "../../icons/theme.png";
import homeIcon from "../../icons/home.png";


export default function MenuBar({
  activeApp,
  onSpotlight,
  onNotifications,
  notifCount,
  onWallpaper,
}) {
  const time = useTime();
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const appleRef = useRef();

  // Close Apple menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (appleRef.current && !appleRef.current.contains(e.target)) {
        setAppleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour:    "2-digit",
    minute:  "2-digit",
    weekday: "short",
    month:   "short",
    day:     "numeric",
  });

  return (
    <div style={{
      position:       "fixed",
      top: 0, left: 0, right: 0,
      zIndex:         2000,
      height:         28,
      background:     colors.menuBar,
      backdropFilter:       blur.menuBar,
      WebkitBackdropFilter: blur.menuBar,
      borderBottom:   "0.5px solid rgba(255,255,255,0.07)",
      display:        "flex",
      alignItems:     "center",
      padding:        "0 14px",
      justifyContent: "space-between",
      fontFamily:     font.family,
      fontSize:       font.sizes.base,
      color:          "rgba(255,255,255,0.9)",
      userSelect:     "none",
    }}>

      {/* ── Left side ── */}
      <div style={{ display: "flex", gap: 18, alignItems: "center" }} ref={appleRef}>
        {/* Apple logo with dropdown */}
        <span
          style={{ fontSize: 15, cursor: "pointer", position: "relative" }}
          onClick={() => setAppleMenuOpen(v => !v)}
        >
          <img src={homeIcon} alt="home" className="icon" style={{ width: 20, height: 20, objectFit: "contain",  display: "block" }}/>
          {appleMenuOpen && <AppleMenu />}
        </span>

        {/* Active app name */}
        <span style={{ fontWeight: font.weights.semibold, color: "#fff" }}>
          {activeApp || "Finder"}
        </span>

        {/* Fake menu items */}
        {["File", "Edit", "View", "Go", "Window", "Help"].map(item => (
          <span key={item} style={{ color: "rgba(255,255,255,0.65)", cursor: "default" }}>
            {item}
          </span>
        ))}
      </div>

      {/* ── Right side (system tray) ── */}
      <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: font.sizes.sm }}>
        <TrayIcon title="Wallpaper"   onClick={onWallpaper}>
          <img src={themeIcon} alt="battery" className="icon" style={{ width: 20, height: 20, objectFit: "contain",  display: "block" }}/>
        </TrayIcon>
        <TrayIcon title="Battery">
          <img src={batteryIcon} alt="battery" className="icon" style={{ width: 20, height: 20, objectFit: "contain",  display: "block" }}/>
        </TrayIcon>
        <TrayIcon title="WiFi">
          <img src={wifiIcon} alt="Wi-Fi" className="icon" style={{ width: 20, height: 20, objectFit: "contain",  display: "block" }}/>
        </TrayIcon>
        <TrayIcon title="Notifications" onClick={onNotifications} style={{ position: "relative" }}>
          <img src={notificationIcon} alt="notifications" className="icon" style={{ width: 20, height: 20, objectFit: "contain",  display: "block"}}/>
          {notifCount > 0 && (
            <span style={{
              position:       "absolute",
              top: -4, right: -4,
              background:     "#FF3B30",
              color:          "#fff",
              fontSize:       9,
              fontWeight:     font.weights.bold,
              width:          14,
              height:         14,
              borderRadius:   "50%",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}>
              {notifCount}
            </span>
          )}
        </TrayIcon>
        <TrayIcon title="Spotlight" onClick={onSpotlight}>
          <img src={spotlightIcon} alt="spotlight" className="icon" style={{ width: 20, height: 20, objectFit: "contain",  display: "block"}}/>
        </TrayIcon>
        <span style={{ color: "rgba(255,255,255,0.85)" }}>{timeStr}</span>
      </div>
    </div>
  );
}

// ── Tray icon wrapper ─────────────────────────────────────────
function TrayIcon({ children, onClick, title, style }) {
  return (
    <span
      title={title}
      onClick={onClick}
      style={{
        cursor:   onClick ? "pointer" : "default",
        opacity:  0.75,
        position: "relative",
        transition: "opacity 0.15s",
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
      onMouseLeave={e => e.currentTarget.style.opacity = "0.75"}
    >
      {children}
    </span>
  );
}

// ── Apple dropdown menu ───────────────────────────────────────
function AppleMenu() {
  const items = [
    { label: "About This Portfolio", divider: false },
    { divider: true },
    { label: "System Preferences…" },
    { label: "App Store…" },
    { divider: true },
    { label: "Sleep" },
    { label: "Restart…" },
    { label: "Shut Down…" },
  ];

  return (
    <div style={{
      position:       "absolute",
      top:            "calc(100% + 8px)",
      left:           0,
      background:     "rgba(30,30,36,0.97)",
      backdropFilter: "blur(20px)",
      border:         "0.5px solid rgba(255,255,255,0.12)",
      borderRadius:   10,
      padding:        "6px 0",
      minWidth:       220,
      boxShadow:      "0 16px 48px rgba(0,0,0,0.6)",
      zIndex:         3000,
      fontFamily:     font.family,
    }}>
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
        ) : (
          <div
            key={item.label}
            style={{
              padding:    "5px 16px",
              fontSize:   font.sizes.base,
              color:      "rgba(255,255,255,0.85)",
              cursor:     "default",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(94,92,230,0.35)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {item.label}
          </div>
        )
      )}
    </div>
  );
}
