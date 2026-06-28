import React, { useState } from "react";

export default function ChatModal({ item, onClose }) {
  const [messages, setMessages] = useState([
    {
      from: "seller",
      text: `Hi! Thanks for your interest in "${item.title}". Still available — happy to answer any questions.`,
    },
  ]);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { from: "me", text: draft.trim() }]);
    setDraft("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "seller", text: "Sounds good — want to meet near the library gate around 5pm?" },
      ]);
    }, 900);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 16 }}>{item.sellerName}</h3>
            <p className="chat-subtitle">{item.title}</p>
          </div>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={"chat-bubble " + (m.from === "me" ? "me" : "them")}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            placeholder="Type a message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="primary-btn small" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
