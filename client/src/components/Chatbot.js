import React, { useState } from "react";
import api from "../api";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
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

      const botReply = res.data.reply || "I couldn't process that.";
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Error connecting to chatbot. Please log in or try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Career Guidance Chatbot</h2>
      <div className="chatbox">
        {messages.length === 0 && (
          <p className="empty-chat">Ask me about courses, careers, or colleges!</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Thinking...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
