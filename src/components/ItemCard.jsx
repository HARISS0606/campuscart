import React from "react";
import { getCategoryArt } from "../data/categoryArt";

export default function ItemCard({ item, isWishlisted, onToggleWishlist, onMessageSeller, onMarkSold, onAddToCart, onCall, onViewReviews, inCart, isOwner }) {
  return (
    <div className={"item-card" + (item.sold ? " sold" : "")}>
      <button
        className="wish-btn"
        aria-label="Toggle wishlist"
        onClick={() => onToggleWishlist(item.id)}
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title} className="item-img" />
      ) : (
        <img src={getCategoryArt(item.category)} alt={item.category} className="item-img" />
      )}

      <p className="item-category">{item.category}</p>
      {item.category === "Projects" && (
        <p className="ref-note">For reference only — not for direct resubmission.</p>
      )}
      <p className="item-title">{item.title}</p>
      <p className="item-price">₹{Number(item.price).toLocaleString("en-IN")}</p>

      <div className="item-meta-row">
        <span className={"condition-badge cond-" + item.condition.replace(" ", "-").toLowerCase()}>
          {item.condition}
        </span>
        {item.rating && (
          <button className="rating-badge rating-btn" onClick={() => onViewReviews(item)}>
            ★ {item.rating.toFixed(1)} ({item.reviewCount})
          </button>
        )}
      </div>

      <p className="item-seller">Seller: {item.sellerName}</p>

      {item.sold ? (
        <span className="sold-badge">SOLD</span>
      ) : (
        <div className="item-actions">
          <button
            className={"primary-btn small" + (inCart ? " in-cart" : "")}
            onClick={() => onAddToCart(item)}
            disabled={inCart}
          >
            {inCart ? "In cart ✓" : "Add to cart"}
          </button>
          <button className="ghost-btn small" onClick={() => onMessageSeller(item)}>
            Message
          </button>
          <button className="ghost-btn small call-btn" onClick={() => onCall(item)}>
            📞 Call
          </button>
          {isOwner && (
            <button className="ghost-btn small" onClick={() => onMarkSold(item.id)}>
              Mark sold
            </button>
          )}
        </div>
      )}
    </div>
  );
}
