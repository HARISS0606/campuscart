import React, { useRef, useState } from "react";
import { CATEGORIES } from "../data/mockData";

export default function FilterBar({ query, setQuery, activeCat, setActiveCat, onScanSearch }) {
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  function handlePhotoCapture(e) {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    // Demo visual search: in production this frame would go to an image
    // similarity / OCR API. Here we simulate a short search and surface
    // the closest category match so the flow still feels real.
    setTimeout(() => {
      setScanning(false);
      onScanSearch();
    }, 1200);
    e.target.value = "";
  }

  return (
    <div className="filter-bar">
      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search books, cycles, furniture, projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="scan-btn"
          title="Scan to search"
          onClick={() => fileInputRef.current.click()}
        >
          📷
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handlePhotoCapture}
        />
      </div>

      {scanning && <p className="scan-status">Scanning photo for matching items...</p>}

      <div className="cat-row">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={"cat-chip" + (activeCat === c ? " active" : "")}
            onClick={() => setActiveCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
