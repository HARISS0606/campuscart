import React from "react";

export default function RewardsModal({ orders, onClose }) {
  const points = orders.length * 50;
  const milestones = [
    { pts: 0, label: "Newbie", icon: "🌱" },
    { pts: 100, label: "Explorer", icon: "🔍" },
    { pts: 250, label: "Trader", icon: "🤝" },
    { pts: 500, label: "Campus Star", icon: "⭐" },
    { pts: 1000, label: "Legend", icon: "🏆" },
  ];
  const current = [...milestones].reverse().find((m) => points >= m.pts) || milestones[0];
  const next = milestones.find((m) => m.pts > points);
  const progressPct = next ? Math.min((points / next.pts) * 100, 100) : 100;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3>Rewards</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>
        <div className="rewards-hero">
          <span className="rewards-icon">{current.icon}</span>
          <span className="rewards-pts">{points} pts</span>
          <span className="rewards-tier">{current.label}</span>
        </div>
        {next && (
          <>
            <div className="rewards-progress-bar"><div style={{ width: progressPct + "%" }} /></div>
            <p className="chat-subtitle" style={{ marginBottom: 14 }}>{next.pts - points} pts to {next.label} {next.icon}</p>
          </>
        )}
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>How to earn points:</p>
        <div className="rewards-list">
          <div className="reward-row">🛍 Complete a purchase <span>+50 pts</span></div>
          <div className="reward-row">⭐ Leave a review <span>+10 pts</span></div>
          <div className="reward-row">📦 Sell an item <span>+30 pts</span></div>
          <div className="reward-row">👥 Refer a friend <span>+100 pts</span></div>
        </div>
      </div>
    </div>
  );
}
