import { useMemo, useRef, useState } from "react";
import { getPortfolioAnswer } from "../../data/recruiterKnowledge";

const DEFAULT = "What makes him a strong fit for a mobile engineering role?";

const DISPLAY_QUESTIONS = [
  "Tell me about Inzamamul",
  "What mobile technologies does he use?",
  "Show his best projects",
  "What kind of roles is he looking for?",
  "How can I contact him?",
];

export default function HomeAssistantPanel({ onOpenApp, onOpenProject }) {
  const initial = useMemo(() => getPortfolioAnswer(DEFAULT), []);

  const [messages, setMessages] = useState([
    { id: 1, role: "user", text: DEFAULT, actions: [] },
    { id: 2, role: "assistant", ...initial },
  ]);

  const [input, setInput] = useState("");
  const [lastTopic, setLastTopic] = useState(initial.topic || null);
  const nextId = useRef(3);

  const ask = raw => {
    const question = raw.trim();
    if (!question) return;

    const mapped =
      question === "Tell me about Inzamamul" ? "Tell me about his experience and background" :
      question === "What mobile technologies does he use?" ? "What is his React Native, iOS and Android experience?" :
      question === "Show his best projects" ? "Which projects should I review first?" :
      question === "What kind of roles is he looking for?" ? "What roles is he open to?" :
      question === "How can I contact him?" ? "How can I contact Inzamamul?" :
      question;

    const answer = getPortfolioAnswer(mapped, { lastTopic });

    setLastTopic(answer.topic || null);
    setMessages(items => [
      ...items,
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
    <section className="ref-glass ref-assistant" aria-label="Ask About Me">
      <header className="ref-assistant-head">
        <div className="ref-assistant-logo">✦</div>

        <div className="ref-assistant-heading">
          <div className="ref-assistant-title">
            <h2>Ask About Me</h2>
            <span>BETA</span>
          </div>
          <p>Your AI-style portfolio assistant to know more about Inzamamul.</p>
        </div>

        <div className="ref-assistant-status">
          <div className="ref-online"><span /> Online</div>
          <small>Ask anything — projects, skills, experience, or vision.</small>
        </div>
      </header>

      <div className="ref-assistant-body">
        <aside className="ref-questions">
          <strong>Popular Questions</strong>

          {DISPLAY_QUESTIONS.map(question => (
            <button type="button" key={question} onClick={() => ask(question)}>
              <span>⌕</span>
              <em>{question}</em>
            </button>
          ))}
        </aside>

        <div className="ref-chat">
          <div className="ref-thread">
            {messages.slice(-2).map(message => (
              <div className={`ref-message ${message.role}`} key={message.id}>
                {message.role === "assistant" && <i>✦</i>}

                <div>
                  <p>{message.text}</p>

                  {message.actions?.length > 0 && (
                    <div className="ref-chat-actions">
                      {message.actions.slice(0, 3).map(action => (
                        <button
                          type="button"
                          key={`${action.label}-${action.projectId || ""}`}
                          onClick={() => runAction(action)}
                        >
                          {action.label} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            className="ref-composer"
            onSubmit={event => {
              event.preventDefault();
              ask(input);
            }}
          >
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Ask your question..."
              aria-label="Ask about Inzamamul"
            />
            <button type="submit" disabled={!input.trim()} aria-label="Send question">➤</button>
          </form>

          <button
            className="ref-full-chat"
            type="button"
            onClick={() => onOpenApp("assistant")}
          >
            Open full recruiter chat
          </button>
        </div>
      </div>
    </section>
  );
}
