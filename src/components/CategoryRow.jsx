import React from "react";

const CATS = [
  { label: "Books", icon: "📚" },
  { label: "Cycles", icon: "🚲" },
  { label: "Furniture", icon: "🪑" },
  { label: "Electronics", icon: "💻" },
  { label: "Projects", icon: "📋" },
  { label: "Other", icon: "📦" },
];

export default function CategoryRow({ setActiveCat, setQuery }) {
  return (
    <div className="cat-icon-row">
      {CATS.map((c) => (
        <button
          key={c.label}
          className="cat-icon-btn"
          onClick={() => { setActiveCat(c.label); setQuery(""); }}
        >
          <span className="cat-icon-emoji">{c.icon}</span>
          <span className="cat-icon-label">{c.label}</span>
        </button>
      ))}
    </div>
  );
}
