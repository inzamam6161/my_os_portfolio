// src/hooks/useKeyboard.js
// ─────────────────────────────────────────────────────────────
// Custom hook — registers global keyboard shortcuts.
//
// WHY A CUSTOM HOOK?
//   Keyboard listeners are side-effects that need cleanup.
//   Extracting them prevents memory leaks and keeps App.jsx
//   clean.  The caller just declares what keys do what.
//
// USAGE:
//   useKeyboard({
//     "cmd+f": () => setSpotlight(true),
//     "cmd+m": () => setMissionCtrl(true),
//     "Escape": () => { setSpotlight(false); },
//   });
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";

export function useKeyboard(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      const meta = e.metaKey || e.ctrlKey;

      Object.entries(shortcuts).forEach(([combo, fn]) => {
        const parts = combo.split("+");
        const needsMeta = parts.includes("cmd");
        const key       = parts[parts.length - 1];

        if (needsMeta && meta && e.key === key) { e.preventDefault(); fn(e); }
        if (!needsMeta && !meta && e.key === key) fn(e);
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}