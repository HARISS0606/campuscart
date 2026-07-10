import React, { useRef, useState } from "react";

export default function ScanSearchModal({ onClose, onResult }) {
  const fileRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState(null);

  const keywords = {
    book: "Books", cycle: "Cycles", bicycle: "Cycles",
    table: "Furniture", chair: "Furniture", desk: "Furniture",
    calculator: "Electronics", fridge: "Electronics", laptop: "Electronics",
    project: "Projects", assignment: "Projects",
  };

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setScanning(true);
    setTimeout(() => {
      const name = file.name.toLowerCase();
      let matched = "All";
      for (const [key, cat] of Object.entries(keywords)) {
        if (name.includes(key)) { matched = cat; break; }
      }
      setScanning(false);
      onResult(matched);
    }, 1800);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 340, textAlign: "center" }}>
        <div className="modal-header">
          <h3>Scan to Search</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>
        <p className="chat-subtitle" style={{ marginBottom: 16 }}>
          Take a photo of an item and we'll find matching listings on campus.
        </p>

        {preview ? (
          <img src={preview} alt="Scanned item" style={{ width: "100%", borderRadius: 10, marginBottom: 12, maxHeight: 200, objectFit: "cover" }} />
        ) : (
          <div className="scan-placeholder" onClick={() => fileRef.current.click()}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Tap to open camera or gallery</p>
          </div>
        )}

        {scanning && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", margin: "12px 0" }}>
            <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: 0 }} />
            <span style={{ fontSize: 13, color: "var(--teal)" }}>Scanning for matches...</span>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />

        {!preview && (
          <button className="primary-btn" style={{ width: "100%", marginTop: 8 }} onClick={() => fileRef.current.click()}>
            Open Camera
          </button>
        )}
        {preview && !scanning && (
          <button className="ghost-btn" style={{ width: "100%", marginTop: 8 }} onClick={() => { setPreview(null); fileRef.current.click(); }}>
            Try another photo
          </button>
        )}
      </div>
    </div>
  );
}
