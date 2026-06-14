// frontend/src/pages/ChatPage.jsx

import { useState, useRef, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function ChatPage() {
  const [userInput, setUserInput] = useState("");
  const [messages,  setMessages]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!userInput.trim() || loading) return;

    const userMsg = userInput.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setUserInput("");
    setLoading(true);

    try {
      const { data } = await axiosClient.post("/ai/chat", { message: userMsg });
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 680 }}>
      <h2 className="fw-bold mb-4">🤖 AI Chat</h2>

      {/* Message list */}
      <div
        className="border rounded p-3 mb-3 bg-light"
        style={{ minHeight: 350, maxHeight: 500, overflowY: "auto" }}
      >
        {messages.length === 0 && (
          <p className="text-muted text-center mt-5">
            Ask me anything — I'm powered by Gemini AI ✨
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-3 ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-white border text-dark"
              }`}
              style={{ maxWidth: "80%", whiteSpace: "pre-wrap" }}
            >
              <small className="fw-bold d-block mb-1">
                {msg.role === "user" ? "You" : "AI"}
              </small>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="d-flex justify-content-start mb-3">
            <div className="px-3 py-2 rounded-3 bg-white border text-muted">
              <small className="fw-bold d-block mb-1">AI</small>
              <span>Typing</span>
              <span className="ms-1">●●●</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Type a message…"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          className="btn btn-primary px-4"
          onClick={handleSend}
          disabled={loading || !userInput.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
