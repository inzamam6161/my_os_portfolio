// src/hooks/useWindows.js
// ─────────────────────────────────────────────────────────────
// Custom hook — manages all window state (open/close/minimize/
// fullscreen/focus/z-ordering).
//
// WHY A CUSTOM HOOK?
//   App.jsx was getting bloated with window management logic.
//   Pulling it into a hook keeps App.jsx as a "layout" file
//   and makes window logic independently testable.
//
// RETURNS:
//   { windows, focused, openApp, closeApp, minimizeApp,
//     restoreApp, toggleFullscreen, focusApp }
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";

export function useWindows() {
  const [windows, setWindows]   = useState([]);
  const [focused, setFocused]   = useState(null);
  const [fullscreenId, setFullscreenId] = useState(null);

  const openApp = useCallback((id) => {
    setWindows(ws => {
      const existing = ws.find(w => w.id === id);
      if (existing) {
        // already open — just un-minimize and focus
        return ws.map(w => w.id === id ? { ...w, minimized: false } : w);
      }
      // stagger new windows so they don't all stack exactly
      const openCount = ws.filter(w => !w.minimized).length;
      const offset    = openCount * 24;
      return [...ws, { id, position: { x: 90 + offset, y: 42 + offset }, minimized: false }];
    });
    setFocused(id);
  }, []);

  const closeApp = useCallback((id) => {
    setWindows(ws => ws.filter(w => w.id !== id));
    setFocused(prev => prev === id ? null : prev);
    setFullscreenId(prev => prev === id ? null : prev);
  }, []);

  const minimizeApp = useCallback((id) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: true } : w));
    setFocused(prev => prev === id ? null : prev);
  }, []);

  const restoreApp = useCallback((id) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: false } : w));
    setFocused(id);
  }, []);

  const focusApp = useCallback((id) => {
    setFocused(id);
  }, []);

  const toggleFullscreen = useCallback((id) => {
    setFullscreenId(prev => prev === id ? null : id);
  }, []);

  return {
    windows,
    focused,
    fullscreenId,
    openApp,
    closeApp,
    minimizeApp,
    restoreApp,
    focusApp,
    toggleFullscreen,
  };
}