// src/components/ui/Window.jsx
// ─────────────────────────────────────────────────────────────
// The macOS-style draggable window chrome.
// Handles: drag-to-move, traffic-light buttons, fullscreen,
//          focus ring, glass blur backdrop.
//
// PROPS:
//   title, icon, focused, position, wide, fullscreen
//   onClose, onMinimize, onFullscreen, onFocus
//   children  ← the app content rendered inside
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { colors, shadows, blur, font, radii } from "../../styles/tokens";

export default function Window({
  title, icon,
  onClose, onMinimize, onFullscreen, onFocus,
  focused, position, wide, fullscreen,
  children,
}) {
  const [pos, setPos] = useState(position);
  const dragging   = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Width/height change when fullscreen
  const width  = fullscreen ? "100vw" : wide ? 800 : 700;
  const height = fullscreen ? "100vh" : 530;
  const left   = fullscreen ? 0 : pos.x;
  const top    = fullscreen ? 0 : pos.y;

  // ── Drag logic ──────────────────────────────────────────────
  const handleTitleMouseDown = (e) => {
    if (fullscreen) return;
    dragging.current   = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onFocus();
    e.preventDefault(); // prevent text selection while dragging
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const onMouseUp = () => { dragging.current = false; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, []);

  // ── Render ──────────────────────────────────────────────────
  return (
    <div
      className="portfolio-window"
      onMouseDown={onFocus}
      style={{
        position:   "fixed",
        left, top, width, height,
        background: colors.surface,
        backdropFilter:         blur.window,
        WebkitBackdropFilter:   blur.window,
        borderRadius: fullscreen ? 0 : radii.window,
        border:    focused ? colors.borderFocused : colors.border,
        boxShadow: focused ? shadows.window : shadows.windowBlurred,
        zIndex:    focused ? 100 : 10,
        display:        "flex",
        flexDirection:  "column",
        overflow:       "hidden",
        fontFamily:     font.family,
        transition:     "box-shadow 0.2s, border-color 0.2s, border-radius 0.25s",
      }}
    >
      {/* ── Title bar ── */}
      <div
        onMouseDown={handleTitleMouseDown}
        style={{
          height:      44,
          background:  colors.titleBar,
          borderBottom: colors.borderSubtle,
          display:     "flex",
          alignItems:  "center",
          padding:     "0 14px",
          cursor:      fullscreen ? "default" : "grab",
          flexShrink:  0,
          userSelect:  "none",
        }}
      >
        {/* Traffic lights */}
        <TrafficLights
          focused={focused}
          onClose={onClose}
          onMinimize={onMinimize}
          onFullscreen={onFullscreen}
        />

        {/* Centered title */}
        <span style={{
          flex:       1,
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign:  "center",
          fontSize:   font.sizes.base,
          fontWeight: font.weights.medium,
          color:      focused ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
          transition: "color 0.2s",
        }}>
            <img
              src={icon}
              alt=""
              draggable={false}
              style={{
                width: 20,
                height: 20,
                marginRight:5,
                objectFit: "contain",
                display: "block",
                pointerEvents: "none",
              }}
            /> 
            {title}
        </span>

        {/* Spacer to balance traffic lights */}
        <div style={{ width: 52 }} />
      </div>

      {/* ── Scrollable content area ── */}
      <div style={{ flex: 1, overflow: "auto", padding: "22px 26px" }}>
        {children}
      </div>
    </div>
  );
}

// ── Sub-component: Traffic light buttons ─────────────────────
function TrafficLights({ focused, onClose, onMinimize, onFullscreen }) {
  const [,setHovered] = useState(false);

  const buttons = [
    { color: colors.red,    action: onClose      },
    { color: colors.yellow, action: onMinimize   },
    { color: colors.green,  action: onFullscreen },
  ];

  return (
    <div
      style={{ display: "flex", gap: 8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {buttons.map(({ color, action }, i) => (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); action(); }}
          style={{
            width:        12,
            height:       12,
            borderRadius: "50%",
            background:   focused ? color : "#444",
            border:       "none",
            cursor:       "pointer",
            padding:      0,
            fontSize:     8,
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            color:        "rgba(0,0,0,0.5)",
            transition:   "transform 0.1s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
      ))}
    </div>
  );
}
