import React, { useMemo, useRef, useState, useEffect } from "react";
import api from "../api";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("aurora"); // aurora | ocean | orchid
  const [mode, setMode] = useState("light"); // light | dark
  const listRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input, ts: Date.now() }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/chatbot",
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const botReply = formatResponse(res.data.reply || "I couldn't process that.");
      setMessages([
        ...newMessages,
        { sender: "bot", text: botReply, ts: Date.now() },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "⚠️ Error connecting to chatbot. Please log in or try again.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (responseText) => {
    if (responseText.includes("*")) {
      const formattedText = responseText
        .split("\n")
        .map((line, idx) => {
          if (line.startsWith("*")) {
            return `<li class="formatted-list-item">${line.replace(/^\*\s?/, "")}</li>`;
          }
          return `<p>${line}</p>`;
        })
        .join("");
      return `<ul class="formatted-list">${formattedText}</ul>`;
    }
    return responseText;
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  // Group messages by date and sender adjacency (improves separation)
  const grouped = useMemo(() => {
    const days = {};
    for (const m of messages) {
      const d = new Date(m.ts || Date.now());
      const key = d.toDateString();
      if (!days[key]) days[key] = [];
      days[key].push(m);
    }
    // mark adjacency
    Object.keys(days).forEach((k) => {
      const arr = days[k];
      for (let i = 0; i < arr.length; i++) {
        const prev = arr[i - 1];
        arr[i].adjacent = prev && prev.sender === arr[i].sender;
      }
    });
    return days;
  }, [messages]);

  // Theme class on root
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-theme", theme);
    el.setAttribute("data-mode", mode);
  }, [theme, mode]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <h2>Ask me about courses, careers, or colleges!</h2>
        <p>Start a conversation with me!</p>
        <div className="toolbar">
          <div className="seg segmented">
            <button
              className={theme === "aurora" ? "active" : ""}
              onClick={() => setTheme("aurora")}
              aria-label="Aurora theme"
              title="Aurora"
            >
              Aurora
            </button>
            <button
              className={theme === "ocean" ? "active" : ""}
              onClick={() => setTheme("ocean")}
              aria-label="Ocean theme"
              title="Ocean"
            >
              Ocean
            </button>
            <button
              className={theme === "orchid" ? "active" : ""}
              onClick={() => setTheme("orchid")}
              aria-label="Orchid theme"
              title="Orchid"
            >
              Orchid
            </button>
          </div>
          <div className="seg segmented">
            <button
              className={mode === "light" ? "active" : ""}
              onClick={() => setMode("light")}
              aria-label="Light mode"
              title="Light"
            >
              Light
            </button>
            <button
              className={mode === "dark" ? "active" : ""}
              onClick={() => setMode("dark")}
              aria-label="Dark mode"
              title="Dark"
            >
              Dark
            </button>
          </div>
        </div>
      </header>

      <div className="chatbot-messages" ref={listRef}>
        {Object.keys(grouped).length === 0 && (
          <div className="chatbot-empty">
            <div>
              <div className="empty-icon">💬</div>
              <div>Say hello and ask anything about courses, careers, or colleges.</div>
            </div>
          </div>
        )}

        {Object.entries(grouped).map(([day, arr]) => (
          <section className="day-group" key={day}>
            <div className="day-divider">
              <span>{day}</span>
            </div>
            {arr.map((m, i) => (
              <div
                key={`${m.ts}-${i}`}
                className={`message ${m.sender} ${m.adjacent ? "adjacent" : ""}`}
              >
                <div className="avatar">
                  {m.sender === "user" ? "🧑" : "🤖"}
                </div>
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: m.text }}
                />
              </div>
            ))}
          </section>
        ))}

        {loading && (
          <div className="message bot">
            <div className="avatar">🤖</div>
            <div className="message-content">
              <span className="chatbot-loading">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="chatbot-input">
        <textarea
          className="chatbot-textarea"
          placeholder="Type a message…  Shift+Enter = new line"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />
        <button className="chatbot-send" onClick={sendMessage} aria-label="Send message">
          Send
        </button>
      </div>
    </div>
  );
}
