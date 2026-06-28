import React, { useState } from "react";

export default function FeedbackModal({ items, onClose, onSubmit }) {
  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const item = items[index];

  function handleNext() {
    onSubmit(item.id, rating, comment);
    setRating(5);
    setComment("");
    if (index + 1 < items.length) {
      setIndex(index + 1);
    } else {
      onClose();
    }
  }

  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Rate your purchase</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>
        <p className="chat-subtitle" style={{ marginBottom: 10 }}>
          {item.title} — sold by {item.sellerName}
        </p>

        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={"star-btn" + (n <= rating ? " filled" : "")}
              onClick={() => setRating(n)}
              aria-label={n + " stars"}
            >
              ★
            </button>
          ))}
        </div>

        <label>Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the item and the seller?"
          rows={3}
        />

        <button className="primary-btn" style={{ marginTop: 12 }} onClick={handleNext}>
          {index + 1 < items.length ? "Next item" : "Submit feedback"}
        </button>
      </div>
    </div>
  );
}
