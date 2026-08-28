// src/App.jsx
// ─────────────────────────────────────────────────────────────
// ROOT COMPONENT — The Desktop Orchestrator
//
// This file's only job is to:
//   1. Hold top-level UI state (overlays, wallpaper, notifications)
//   2. Wire up keyboard shortcuts
//   3. Render the desktop layers in the correct z-order
//
// It does NOT contain any business logic or UI details —
// those all live in their own files.
//
// RENDER ORDER (bottom → top):
//   Wallpaper → Windows → MenuBar → Dock → Overlays
// ─────────────────────────────────────────────────────────────

import { useState, useCallback }        from "react";

// Data
import { APPS, WINDOW_TITLES, WIDE_WINDOWS } from "./data/apps";
import { NOTIFICATIONS_INIT }           from "./data/profile";

// Hooks
import { useWindows }                   from "./hooks/useWindows";
import { useKeyboard }                  from "./hooks/useKeyboard";

// Styles
import { font }                         from "./styles/tokens";

// UI chrome
import MenuBar                          from "./components/ui/MenuBar";
import Dock                             from "./components/ui/Dock";
import Window                           from "./components/ui/Window";
import HomeDesktop                      from "./components/ui/HomeDesktop";
import { Wallpaper, WallpaperPicker }   from "./components/ui/Wallpaper";

// Overlays
import Spotlight            from "./components/overlays/Spotlight";
import NotificationCenter   from "./components/overlays/NotificationCenter";
import MissionControl       from "./components/overlays/MissionControl";
import ContextMenu          from "./components/overlays/ContextMenu";
import Toast                from "./components/overlays/Toast";

// App content registry
import APP_COMPONENTS       from "./components/apps";

export default function App() {
  // ── Window management (open/close/minimize/focus/fullscreen) ──
  const {
    windows, focused, fullscreenId,
    openApp, closeApp, minimizeApp, restoreApp, focusApp, toggleFullscreen,
  } = useWindows();

  // ── Overlay visibility ────────────────────────────────────────
  const [spotlightOpen,    setSpotlightOpen]    = useState(false);
  const [notifOpen,        setNotifOpen]        = useState(false);
  const [missionCtrlOpen,  setMissionCtrlOpen]  = useState(false);
  const [wallpaperOpen,    setWallpaperOpen]    = useState(false);
  const [contextMenu,      setContextMenu]      = useState(null);   // { x, y } or null
  const [toast,            setToast]            = useState(null);   // string or null

  // ── App data ──────────────────────────────────────────────────
  const [notifications, setNotifications] = useState(NOTIFICATIONS_INIT);
  const [wallpaperId,   setWallpaperId]   = useState("aurora");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Helpers ───────────────────────────────────────────────────
  const showToast = useCallback((msg) => setToast(msg), []);

  const closeAllOverlays = useCallback(() => {
    setSpotlightOpen(false);
    setMissionCtrlOpen(false);
    setContextMenu(null);
  }, []);

  // ── Keyboard shortcuts ────────────────────────────────────────
  useKeyboard({
    "cmd+f": () => setSpotlightOpen(v => !v),
    "cmd+m": () => setMissionCtrlOpen(v => !v),
    "Escape": closeAllOverlays,
  });

  // ── Context menu actions ──────────────────────────────────────
  const handleContextAction = useCallback((action) => {
    if (action === "wallpaper") { setWallpaperOpen(true); return; }
    if (action === "spotlight") { setSpotlightOpen(true); return; }
    showToast(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} done`);
  }, [showToast]);

  // ── Mission Control focus ─────────────────────────────────────
  const handleMissionFocus = useCallback((id) => {
    restoreApp(id);
    setMissionCtrlOpen(false);
  }, [restoreApp]);

  const handleOpenProject = useCallback((projectId, appId) => {
    setSelectedProjectId(projectId);
    openApp(appId);
  }, [openApp]);

  // ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width:      "100vw",
        height:     "100vh",
        overflow:   "hidden",
        position:   "relative",
        fontFamily: font.family,
        background: "#0d0d14",
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      {/* ── Layer 1: Wallpaper ── */}
      <Wallpaper wallpaperId={wallpaperId} />

      {/* ── Layer 2: Menu bar ── */}
      <MenuBar
        activeApp={focused ? WINDOW_TITLES[focused] : null}
        onSpotlight={() => setSpotlightOpen(v => !v)}
        onNotifications={() => setNotifOpen(v => !v)}
        notifCount={unreadCount}
        onWallpaper={() => setWallpaperOpen(true)}
      />

      {/* ── Layer 3: Recruiter-first homepage ── */}
      <HomeDesktop onOpenProject={handleOpenProject} onOpenApp={openApp} />

      {/* ── Layer 4: Windows ── */}
      {windows
        .filter(w => !w.minimized)
        .map(w => {
          const ContentComponent = APP_COMPONENTS[w.id];
          const appMeta          = APPS.find(a => a.id === w.id);
          return (
            <Window
              key={w.id}
              title={WINDOW_TITLES[w.id]}
              icon={appMeta?.icon}
              focused={focused === w.id}
              position={w.position}
              wide={WIDE_WINDOWS.includes(w.id)}
              fullscreen={fullscreenId === w.id}
              onClose={()        => closeApp(w.id)}
              onMinimize={()     => minimizeApp(w.id)}
              onFullscreen={()   => toggleFullscreen(w.id)}
              onFocus={()        => focusApp(w.id)}
            >
              <ContentComponent selectedProjectId={selectedProjectId} />
            </Window>
          );
        })
      }

      {/* ── Layer 5: Dock ── */}
      <Dock
        apps={APPS}
        windows={windows}
        onOpen={openApp}
        onMissionCtrl={() => setMissionCtrlOpen(v => !v)}
        missionCtrlOpen={missionCtrlOpen}
      />

      {/* ── Layer 6: Overlays (highest z-index) ── */}
      {spotlightOpen   && <Spotlight onClose={() => setSpotlightOpen(false)}   onOpen={openApp} />}
      {missionCtrlOpen && <MissionControl windows={windows} apps={APPS} onClose={() => setMissionCtrlOpen(false)} onFocus={handleMissionFocus} />}
      {notifOpen       && <NotificationCenter notifications={notifications} onClose={() => setNotifOpen(false)} onDismiss={id => setNotifications(ns => ns.filter(n => n.id !== id))} onClearAll={() => setNotifications([])} />}
      {wallpaperOpen   && <WallpaperPicker current={wallpaperId} onSelect={setWallpaperId} onClose={() => setWallpaperOpen(false)} />}
      {contextMenu     && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} onAction={handleContextAction} />}
      {toast           && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
