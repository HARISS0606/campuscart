import React from "react";
import { CATEGORIES } from "../data/mockData";
import SearchBar from "./SearchBar";

export default function FilterBar({ query, setQuery, activeCat, setActiveCat, onScanSearch }) {
  return (
    <div className="filter-bar">
      <SearchBar query={query} setQuery={setQuery} onScanSearch={onScanSearch} />
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
