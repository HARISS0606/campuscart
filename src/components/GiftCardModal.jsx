import React, { useState } from "react";

const PRESETS = [100, 200, 500, 1000];

export default function GiftCardModal({ onClose }) {
  const [amount, setAmount] = useState(200);
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!to.trim()) return;
    setSent(true);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3>Gift cards</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        {sent ? (
          <div className="pay-status">
            <div className="success-tick">🎁</div>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>Gift card sent!</h3>
            <p className="chat-subtitle">₹{amount} gift card sent to {to}</p>
            <button className="primary-btn" style={{ marginTop: 14 }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>Select amount</p>
            <div className="gift-presets">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  className={"gift-preset" + (amount === p ? " active" : "")}
                  onClick={() => setAmount(p)}
                >
                  ₹{p}
                </button>
              ))}
            </div>
            <label>Send to (email)</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="friend@college.edu" />
            <label>Message (optional)</label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Happy studying!"
              rows={2}
            />
            <button className="primary-btn" style={{ marginTop: 12 }} onClick={handleSend}>
              Send ₹{amount} gift card
            </button>
          </>
        )}
      </div>
    </div>
  );
}
