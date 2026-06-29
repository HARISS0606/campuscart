import React from "react";

export default function ReviewsModal({ item, onClose }) {
  const reviews = item.reviews || [];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 17 }}>Reviews for {item.title}</h3>
            <p className="chat-subtitle">★ {item.rating ? item.rating.toFixed(1) : "—"} · {item.reviewCount || 0} ratings</p>
          </div>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        {reviews.length === 0 ? (
          <p className="empty-state" style={{ padding: "20px 0" }}>No written reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((r, i) => (
              <div key={i} className="review-row">
                <div className="review-top">
                  <span className="review-name">{r.reviewer}</span>
                  <span className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p className="review-comment">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
