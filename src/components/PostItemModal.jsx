import React, { useState } from "react";
import { CATEGORIES } from "../data/mockData";

export default function PostItemModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Books");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Good");
  const [imageFile, setImageFile] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !price) return;
    onSubmit({ title: title.trim(), category, price, condition, imageFile });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="modal-header">
          <h3>List an item</h3>
          <button type="button" className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        <label>Item name</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Data Structures textbook"
          required
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.filter((c) => c !== "All").map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label>Price (₹)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 350"
          required
        />

        <label>Condition</label>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option>Like new</option>
          <option>Good</option>
          <option>Fair</option>
        </select>

        <label>Photo (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

        <button type="submit" className="primary-btn" style={{ marginTop: 12 }}>
          List item
        </button>
      </form>
    </div>
  );
}
