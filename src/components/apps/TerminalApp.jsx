// src/components/apps/TerminalApp.jsx
import { useState, useEffect, useRef } from "react";
import { TERMINAL_LINES } from "../../data/profile";
import { font } from "../../styles/tokens";

const COMMANDS = {
  help:    "Commands: help, whoami, ls, skills, experience, clear",
  whoami:  "alex chen — staff engineer · mobile & systems",
  ls:      "projects/  mobile/  resume.pdf  skills.txt  contact.md",
  skills:  "Swift 95% | TypeScript 96% | Go 88% | React Native 88% | Rust 78%",
  experience: "Vercel → Spotify → Stripe → Figma (2017–present)",
};

export default function TerminalApp() {
  const [booted,  setBooted]  = useState([]);   // auto-typed boot lines
  const [history, setHistory] = useState([]);   // user command history
  const [input,   setInput]   = useState("");
  const bottomRef = useRef();
  const inputRef  = useRef();

  // Boot sequence — reveal lines one by one using their timestamps
  useEffect(() => {
    const timers = TERMINAL_LINES.map(line =>
      setTimeout(() => setBooted(prev => [...prev, line]), line.t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-scroll to bottom whenever output changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [booted, history]);

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const response = COMMANDS[cmd] || `command not found: ${cmd}  (try 'help')`;
    setHistory(h => [...h, { cmd, response }]);
    setInput("");
  };

  return (
    <div
      style={{
        background:  "#0a0a0e",
        borderRadius: 8,
        padding:     16,
        margin:      "-22px -26px",
        height:      "calc(100% + 44px)",
        overflow:    "auto",
        fontFamily:  font.mono,
        fontSize:    13,
        cursor:      "text",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Boot sequence lines */}
      {booted.map((line, i) => (
        <div key={i} style={{ color: line.color, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {line.text}
        </div>
      ))}

      {/* User command history */}
      {history.map((entry, i) => (
        <div key={"h" + i}>
          <div style={{ color: "#30D158" }}>alex@macbook ~ % {entry.cmd}</div>
          <div style={{ color: "rgba(255,255,255,0.75)", marginBottom: 4 }}>{entry.response}</div>
        </div>
      ))}

      {/* Interactive input line */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <span style={{ color: "#30D158", whiteSpace: "nowrap" }}>alex@macbook ~ %</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            background: "none",
            border:     "none",
            outline:    "none",
            color:      "#fff",
            fontSize:   13,
            flex:       1,
            fontFamily: font.mono,
            caretColor: "#30D158",
          }}
        />
      </div>

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
