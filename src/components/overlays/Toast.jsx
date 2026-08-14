import { useEffect } from "react";
import { colors, font, shadows } from "../../styles/tokens";

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const timeout = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(timeout);
  }, [message, onDone]);

  return (
    <div role="status" style={{ position: "absolute", zIndex: 2200, left: "50%", bottom: 92, transform: "translateX(-50%)", maxWidth: "calc(100vw - 32px)", padding: "10px 15px", border: colors.borderFocused, borderRadius: 999, background: "rgba(25,25,31,.95)", boxShadow: shadows.menu, color: "#fff", fontFamily: font.family, fontSize: 12, whiteSpace: "nowrap" }}>
      {message}
    </div>
  );
}
