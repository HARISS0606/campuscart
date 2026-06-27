import React from "react";

export default function ItemCard({ item, isWishlisted, onToggleWishlist, onMessageSeller, onMarkSold, isOwner }) {
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
        <div className="item-img placeholder">No photo</div>
      )}

      <p className="item-category">{item.category}</p>
      <p className="item-title">{item.title}</p>
      <p className="item-price">₹{Number(item.price).toLocaleString("en-IN")}</p>
      <span className={"condition-badge cond-" + item.condition.replace(" ", "-").toLowerCase()}>
        {item.condition}
      </span>
      <p className="item-seller">Seller: {item.sellerName}</p>

      {item.sold ? (
        <span className="sold-badge">SOLD</span>
      ) : (
        <div className="item-actions">
          <button className="primary-btn small" onClick={() => onMessageSeller(item)}>
            Message seller
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
