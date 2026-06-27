import React from "react";
import { CATEGORIES } from "../data/mockData";

export default function FilterBar({ query, setQuery, activeCat, setActiveCat }) {
  return (
    <div className="filter-bar">
      <input
        className="search-input"
        placeholder="Search books, cycles, furniture..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
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
