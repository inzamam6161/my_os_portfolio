// src/components/overlays/Toast.jsx
// ─────────────────────────────────────────────────────────────
// Temporary status banner shown at the top of the screen.
// Auto-dismisses after 2.2 s via the onDone callback.
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { font } from "../../styles/tokens";

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div style={{
      position:       "fixed",
      top:            46,
      left:           "50%",
      transform:      "translateX(-50%)",
      background:     "rgba(30,30,36,0.96)",
      border:         "0.5px solid rgba(255,255,255,0.12)",
      borderRadius:   10,
      padding:        "10px 20px",
      fontSize:       font.sizes.base,
      color:          "#fff",
      boxShadow:      "0 8px 32px rgba(0,0,0,0.5)",
      zIndex:         6000,
      backdropFilter: "blur(20px)",
      pointerEvents:  "none",
      fontFamily:     font.family,
    }}>
      {message}
    </div>
  );
}
