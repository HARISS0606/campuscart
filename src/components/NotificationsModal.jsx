import React, { useState } from "react";

const PREFS = [
  { key: "newListings", label: "New listings in my category", default: true },
  { key: "wishlistUpdates", label: "Price drop on wishlisted items", default: true },
  { key: "orderUpdates", label: "Order & delivery updates", default: true },
  { key: "chatMessages", label: "New messages from sellers", default: true },
  { key: "rewards", label: "Rewards & offers", default: false },
  { key: "weeklyDigest", label: "Weekly campus digest", default: false },
];

export default function NotificationsModal({ onClose }) {
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(PREFS.map((p) => [p.key, p.default]))
  );
  const [saved, setSaved] = useState(false);

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3>Notification preferences</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>
        <div className="notif-list">
          {PREFS.map((p) => (
            <div key={p.key} className="notif-row">
              <span className="notif-label">{p.label}</span>
              <button
                className={"toggle-btn" + (prefs[p.key] ? " on" : "")}
                onClick={() => toggle(p.key)}
                aria-label={p.label}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          ))}
        </div>
        <button className="primary-btn" style={{ marginTop: 14 }} onClick={save}>
          {saved ? "✓ Saved!" : "Save preferences"}
        </button>
      </div>
    </div>
  );
}
