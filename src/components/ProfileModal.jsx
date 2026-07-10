import React, { useState } from "react";

export default function ProfileModal({ user, onClose, onUpdate }) {
  const [name, setName] = useState(user?.displayName || "");
  const [college, setCollege] = useState(user?.college || "");
  const [dept, setDept] = useState(user?.dept || "");
  const [year, setYear] = useState(user?.year || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onUpdate({ ...user, displayName: name, college, dept, year, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3>My profile</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>
        <div className="profile-avatar">{(user?.displayName || "U")[0].toUpperCase()}</div>
        <label>Full name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <label>College</label>
        <input value={college} onChange={(e) => setCollege(e.target.value)} placeholder="e.g. CEG Anna University" />
        <label>Department</label>
        <input value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g. Computer Science" />
        <label>Year</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select year</option>
          <option>1st year</option>
          <option>2nd year</option>
          <option>3rd year</option>
          <option>4th year</option>
        </select>
        <label>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
        <button className="primary-btn" style={{ marginTop: 14 }} onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save profile"}
        </button>
      </div>
    </div>
  );
}
