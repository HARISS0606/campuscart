import React from "react";

export default function CartModal({ cartItems, onRemove, onClose, onCheckout }) {
  const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h3>Your cart ({cartItems.length})</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-state" style={{ padding: "20px 0" }}>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-row">
                  <div>
                    <p className="cart-item-title">{item.title}</p>
                    <p className="cart-item-seller">Seller: {item.sellerName}</p>
                  </div>
                  <div className="cart-row-right">
                    <span className="cart-item-price">₹{Number(item.price).toLocaleString("en-IN")}</span>
                    <button className="ghost-btn small" onClick={() => onRemove(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total-row">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button className="primary-btn" style={{ marginTop: 10 }} onClick={onCheckout}>
              Proceed to pay
            </button>
          </>
        )}
      </div>
    </div>
  );
}
