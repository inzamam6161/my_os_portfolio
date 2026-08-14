import { useEffect, useState } from "react";
import { PROFILE, TERMINAL_LINES } from "../../data/profile";
import { colors, font } from "../../styles/tokens";

export default function TerminalApp() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [command, setCommand] = useState("");

  useEffect(() => {
    const timers = TERMINAL_LINES.map((line, index) => window.setTimeout(() => {
      setVisibleLines(current => [...current, { ...line, key: index }]);
    }, line.t));
    return () => timers.forEach(timer => window.clearTimeout(timer));
  }, []);

  const runCommand = event => {
    event.preventDefault();
    const normalized = command.trim().toLowerCase();
    if (!normalized) return;
    const response = normalized === "help"
      ? "Commands: help · contact · github · clear"
      : normalized === "contact"
        ? `${PROFILE.email} · ${PROFILE.phone}`
        : normalized === "github"
          ? PROFILE.github
          : normalized === "clear"
            ? null
            : `command not found: ${command}`;

    if (normalized === "clear") setVisibleLines([]);
    else setVisibleLines(lines => [...lines, { key: `command-${Date.now()}`, text: `inzamam@portfolio ~ % ${command}`, color: colors.success }, { key: `response-${Date.now()}`, text: response, color: colors.textSecondary }]);
    setCommand("");
  };

  return (
    <div style={{ minHeight: "100%", padding: 16, border: colors.border, borderRadius: 9, background: "#08090d", color: "#fff", fontFamily: font.mono, fontSize: 12, lineHeight: 1.7 }}>
      {visibleLines.map(line => <div key={line.key} style={{ color: line.color }}>{line.text}</div>)}
      <form onSubmit={runCommand} style={{ display: "flex", gap: 7, marginTop: 8 }}>
        <label htmlFor="terminal-command" style={{ color: colors.success }}>inzamam@portfolio ~ %</label>
        <input id="terminal-command" value={command} onChange={event => setCommand(event.target.value)} autoComplete="off" aria-label="Terminal command" style={{ flex: 1, border: 0, outline: 0, background: "transparent", color: "#fff", fontFamily: font.mono, fontSize: 12 }} />
      </form>
    </div>
  );
}
