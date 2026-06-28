import React, { useState } from "react";

export default function SignInModal({ onClose, onSignIn }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    onSignIn({ displayName: name.trim(), email: email.trim(), uid: email.trim() });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="modal-header">
          <h3>Sign in to CampusCart</h3>
          <button type="button" className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 6px" }}>
          Demo mode: any name and college email works — no password needed.
          Connect Firebase for real verified sign-in.
        </p>

        <label>Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ananya Rao"
          required
        />

        <label>College email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@college.edu"
          required
        />

        <button type="submit" className="primary-btn" style={{ marginTop: 12 }}>
          Sign in
        </button>
      </form>
    </div>
  );
}
