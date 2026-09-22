import { useRef, useState } from "react";
import {
  ASSISTANT_SUGGESTIONS,
  ASSISTANT_WELCOME,
  getPortfolioAnswer,
} from "../../data/recruiterKnowledge";

export default function HomeAssistantPanel({ onOpenApp, onOpenProject }) {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: ASSISTANT_WELCOME, actions: [] },
  ]);
  const [input, setInput] = useState("");
  const [lastTopic, setLastTopic] = useState(null);
  const nextId = useRef(2);

  const ask = raw => {
    const question = raw.trim();
    if (!question) return;
    const answer = getPortfolioAnswer(question, { lastTopic });
    setLastTopic(answer.topic || null);
    setMessages(previous => [
      ...previous,
      { id: nextId.current++, role: "user", text: question, actions: [] },
      { id: nextId.current++, role: "assistant", ...answer },
    ]);
    setInput("");
  };

  const runAction = action => {
    if (action.projectId && action.appId) {
      onOpenProject?.(action.projectId, action.appId);
      return;
    }
    if (action.appId) onOpenApp?.(action.appId);
  };

  return (
    <aside className="glass-assistant-panel" aria-label="Ask About Me recruiter assistant">
      <div className="glass-assistant-head">
        <div className="glass-assistant-orb" aria-hidden="true">✦</div>
        <div>
          <div className="glass-assistant-title">
            <h2>Ask About Me</h2>
            <span>BETA</span>
          </div>
          <p>Grounded recruiter assistant for experience, skills and projects.</p>
        </div>
        <div className="glass-online"><span /> Online</div>
      </div>

      {messages.length === 1 ? (
        <div className="glass-assistant-suggestions">
          <span>Popular questions</span>
          {ASSISTANT_SUGGESTIONS.map(question => (
            <button key={question} type="button" onClick={() => ask(question)}>
              <span>⌕</span>{question}<b>›</b>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-assistant-thread" aria-live="polite">
          {messages.slice(-3).map(message => (
            <div key={message.id} className={`glass-chat-row ${message.role}`}>
              <div className="glass-chat-avatar">{message.role === "assistant" ? "IH" : "You"}</div>
              <div>
                <div className="glass-chat-bubble">{message.text}</div>
                {message.actions?.length > 0 && (
                  <div className="glass-chat-actions">
                    {message.actions.slice(0, 3).map(action => (
                      <button
                        type="button"
                        key={`${action.label}-${action.projectId || ""}`}
                        onClick={() => runAction(action)}
                      >
                        {action.label} ↗
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        className="glass-assistant-composer"
        onSubmit={event => {
          event.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Ask about projects, React Native, experience..."
          aria-label="Ask about Inzamamul"
        />
        <button type="submit" disabled={!input.trim()} aria-label="Send question">↑</button>
      </form>

      <button type="button" className="glass-open-full-chat" onClick={() => onOpenApp?.("assistant")}>
        Open full recruiter chat
      </button>
    </aside>
  );
}
