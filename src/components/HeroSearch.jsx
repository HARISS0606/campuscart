import React, { useState } from "react";

const TRENDING = ["textbooks", "cycles", "calculator", "study table", "mini fridge", "projects"];

export default function HeroSearch({ query, setQuery }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="hero-search-wrap">
      <div className="hero-search-bar">
        <span className="hs-icon">🔍</span>
        <input
          className="hs-input"
          placeholder="Search for textbooks, cycles, furniture and more"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
        {query && (
          <button className="hs-clear" onClick={() => setQuery("")}>✕</button>
        )}
      </div>
      {focused && query === "" && (
        <div className="hs-dropdown">
          <p className="hs-trending-label">Trending on CampusCart</p>
          {TRENDING.map((t) => (
            <div key={t} className="hs-trending-item" onMouseDown={() => setQuery(t)}>
              <span className="hs-trend-icon">📈</span>
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
