import { useEffect, useRef, useState } from "react";
import { blur, colors, font, radii, shadows } from "../../styles/tokens";

export default function Window({
  title,
  icon,
  focused,
  position,
  wide,
  fullscreen,
  onClose,
  onMinimize,
  onFullscreen,
  onFocus,
  children,
}) {
  const [localPosition, setLocalPosition] = useState(position);
  const dragRef = useRef(null);

  useEffect(() => setLocalPosition(position), [position]);

  useEffect(() => {
    const handleMove = event => {
      if (!dragRef.current || fullscreen) return;
      const nextX = dragRef.current.startX + event.clientX - dragRef.current.pointerX;
      const nextY = dragRef.current.startY + event.clientY - dragRef.current.pointerY;
      setLocalPosition({
        x: Math.max(8, Math.min(nextX, window.innerWidth - 160)),
        y: Math.max(32, Math.min(nextY, window.innerHeight - 100)),
      });
    };
    const handleUp = () => { dragRef.current = null; };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [fullscreen]);

  const windowStyle = fullscreen ? {
    inset: "30px 0 0",
    width: "100%",
    height: "calc(100vh - 30px)",
    borderRadius: 0,
  } : {
    left: localPosition.x,
    top: localPosition.y,
    width: wide ? "min(880px, calc(100vw - 40px))" : "min(680px, calc(100vw - 40px))",
    height: "min(600px, calc(100vh - 150px))",
    borderRadius: radii.window,
  };

  return (
    <section
      className="portfolio-window"
      onPointerDown={onFocus}
      style={{
        position: "absolute",
        zIndex: focused ? 500 : 300,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: colors.textPrimary,
        background: colors.surface,
        backdropFilter: blur.window,
        border: focused ? colors.borderFocused : colors.border,
        boxShadow: focused ? shadows.window : shadows.windowBlurred,
        fontFamily: font.family,
        transition: "box-shadow .16s ease, opacity .16s ease",
        opacity: focused ? 1 : .94,
        ...windowStyle,
      }}
    >
      <div
        onDoubleClick={() => { if (window.innerWidth > 760) onFullscreen(); }}
        onPointerDown={event => {
          if (event.button !== 0 || fullscreen || window.innerWidth <= 760) return;
          dragRef.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            startX: localPosition.x,
            startY: localPosition.y,
          };
        }}
        style={{
          height: 44,
          flex: "0 0 44px",
          display: "grid",
          gridTemplateColumns: "100px 1fr 100px",
          alignItems: "center",
          padding: "0 14px",
          background: colors.titleBar,
          borderBottom: colors.borderSubtle,
          cursor: fullscreen ? "default" : "grab",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <TrafficButton color={colors.red} label={`Close ${title}`} onClick={onClose} />
          <TrafficButton color={colors.yellow} label={`Minimize ${title}`} onClick={onMinimize} />
          <TrafficButton color={colors.green} label={`${fullscreen ? "Exit" : "Enter"} fullscreen`} onClick={onFullscreen} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, minWidth: 0, fontSize: 12, fontWeight: 600 }}>
          {icon && <img src={icon} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />}
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 24 }}>
        {children}
      </div>
    </section>
  );
}

function TrafficButton({ color, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={event => event.stopPropagation()}
      onClick={onClick}
      style={{ width: 12, height: 12, padding: 0, border: 0, borderRadius: "50%", background: color, cursor: "pointer" }}
    />
  );
}
