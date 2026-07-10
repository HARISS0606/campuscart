import React, { useState, useRef, useEffect } from "react";

const TRENDING = [
  "Data Structures textbook",
  "Hostel cycle",
  "Study table",
  "Casio calculator",
  "Mini fridge",
  "Engineering drawing kit",
  "DBMS project",
  "Lab coat",
  "Laptop stand",
  "Formal shirt",
];

export default function SearchBar({ query, setQuery, onScanSearch }) {
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handlePhotoCapture(e) {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setTimeout(() => { setScanning(false); onScanSearch(); }, 1200);
    e.target.value = "";
  }

  const suggestions = query.length > 0
    ? TRENDING.filter((t) => t.toLowerCase().includes(query.toLowerCase()))
    : TRENDING;

  return (
    <div className="sb-wrap" ref={wrapRef}>
      <div className="sb-row">
        <input
          className="sb-input"
          placeholder="Search books, cycles, furniture, projects..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        <button className="sb-scan" title="Scan to search" onClick={() => fileInputRef.current.click()}>📷</button>
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePhotoCapture} />
      </div>

      {open && (
        <div className="sb-dropdown">
          <p className="sb-label">{query ? "Suggestions" : "Trending searches"}</p>
          {suggestions.slice(0, 8).map((s) => (
            <button key={s} className="sb-item" onClick={() => { setQuery(s); setOpen(false); }}>
              <span className="sb-icon">{query ? "🔍" : "🔥"}</span>
              {s}
            </button>
          ))}
        </div>
      )}
      {scanning && <p className="scan-status">Scanning photo for matching items...</p>}
    </div>
  );
}
