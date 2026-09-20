import { useEffect, useRef, useState } from "react";
import {
  ASSISTANT_SUGGESTIONS,
  ASSISTANT_WELCOME,
  getPortfolioAnswer,
} from "../../data/assistantKnowledge";
import "./RecruiterAssistantApp.css";

export default function RecruiterAssistantApp({
  onOpenApp,
  onOpenProject,
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: ASSISTANT_WELCOME,
      sources: ["Portfolio"],
      actions: [],
    },
  ]);

  const [input, setInput] = useState("");
  const [lastTopic, setLastTopic] = useState(null);

  const messageIdRef = useRef(2);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  const addMessage = message => {
    setMessages(previous => [
      ...previous,
      {
        id: messageIdRef.current++,
        ...message,
      },
    ]);
  };

  const askQuestion = rawQuestion => {
    const question = rawQuestion.trim();

    if (!question) return;

    addMessage({
      role: "user",
      text: question,
      sources: [],
      actions: [],
    });

    setInput("");

    const answer = getPortfolioAnswer(question, {
      lastTopic,
    });

    setLastTopic(answer.topic || null);

    addMessage({
      role: "assistant",
      text: answer.text,
      sources: answer.sources || [],
      actions: answer.actions || [],
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    askQuestion(input);
  };

  const handleKeyDown = event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion(input);
    }
  };

  const handleAction = action => {
    if (action.projectId && action.appId) {
      if (onOpenProject) {
        onOpenProject(action.projectId, action.appId);
        return;
      }

      onOpenApp?.(action.appId);
      return;
    }

    if (action.appId) {
      onOpenApp?.(action.appId);
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        id: messageIdRef.current++,
        role: "assistant",
        text: ASSISTANT_WELCOME,
        sources: ["Portfolio"],
        actions: [],
      },
    ]);

    setInput("");
    setLastTopic(null);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="recruiter-assistant">
      <header className="recruiter-assistant-header">
        <div className="recruiter-assistant-identity">
          <div
            className="recruiter-assistant-avatar"
            aria-hidden="true"
          >
            IH
          </div>

          <div>
            <div className="recruiter-assistant-title-row">
              <h2>Ask Inzamamul</h2>

              <span className="recruiter-assistant-status">
                <span aria-hidden="true" />
                Portfolio knowledge
              </span>
            </div>

            <p>
              Ask about experience, mobile engineering, projects,
              skills or role fit.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="recruiter-assistant-reset"
          onClick={resetConversation}
          aria-label="Start a new conversation"
        >
          New chat
        </button>
      </header>

      <div
        className="recruiter-assistant-messages"
        aria-live="polite"
      >
        {messages.map(message => (
          <article
            key={message.id}
            className={`recruiter-message recruiter-message-${message.role}`}
          >
            {message.role === "assistant" && (
              <div
                className="recruiter-message-avatar"
                aria-hidden="true"
              >
                IH
              </div>
            )}

            <div className="recruiter-message-content">
              <div className="recruiter-message-bubble">
                {message.text}
              </div>

              {message.sources?.length > 0 && (
                <div className="recruiter-message-sources">
                  {message.sources.map(source => (
                    <span key={source}>
                      {source}
                    </span>
                  ))}
                </div>
              )}

              {message.actions?.length > 0 && (
                <div className="recruiter-message-actions">
                  {message.actions.map(action => (
                    <button
                      key={`${action.label}-${action.appId}-${action.projectId || ""}`}
                      type="button"
                      onClick={() => handleAction(action)}
                    >
                      {action.label}
                      <span aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}

        {showSuggestions && (
          <section className="recruiter-assistant-suggestions">
            <p>Popular recruiter questions</p>

            <div className="recruiter-suggestion-grid">
              {ASSISTANT_SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => askQuestion(suggestion)}
                >
                  {suggestion}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        className="recruiter-assistant-composer"
        onSubmit={handleSubmit}
      >
        <div className="recruiter-assistant-input-shell">
          <textarea
            ref={inputRef}
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={2500}
            placeholder="Ask about React Native, LifeOS, iOS, experience, role fit..."
            aria-label="Ask Inzamamul a question"
          />

          <button
            type="submit"
            className="recruiter-assistant-send"
            disabled={!input.trim()}
            aria-label="Send question"
          >
            <span aria-hidden="true">↑</span>
          </button>
        </div>

        <div className="recruiter-assistant-footer">
          <span>
            Grounded in this portfolio's verified information.
          </span>

          <span>
            Enter to send · Shift + Enter for new line
          </span>
        </div>
      </form>
    </div>
  );
}