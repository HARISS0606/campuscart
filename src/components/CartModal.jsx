import React, { useState } from "react";

export default function CartModal({ cartItems, onRemove, onClose, onCheckout }) {
  const [delivery, setDelivery] = useState("pickup"); // pickup | delivery
  const [address, setAddress] = useState({ hostel: "", room: "", phone: "" });

  const subtotal = cartItems.reduce((sum, i) => sum + Number(i.price), 0);
  const deliveryFee = delivery === "delivery" ? 20 : 0;
  const total = subtotal + deliveryFee;

  function handleCheckoutClick() {
    if (delivery === "delivery" && (!address.hostel.trim() || !address.phone.trim())) {
      alert("Please fill in your hostel/block and phone number for delivery.");
      return;
    }
    onCheckout({ delivery, address, deliveryFee, total });
  }

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

            <label style={{ marginTop: 10 }}>How do you want to get it?</label>
            <div className="pay-tabs">
              <button
                type="button"
                className={"pay-tab" + (delivery === "pickup" ? " active" : "")}
                onClick={() => setDelivery("pickup")}
              >
                Self pickup
              </button>
              <button
                type="button"
                className={"pay-tab" + (delivery === "delivery" ? " active" : "")}
                onClick={() => setDelivery("delivery")}
              >
                Hostel delivery (+₹20)
              </button>
            </div>

            {delivery === "delivery" && (
              <div className="address-fields">
                <label>Hostel / Block</label>
                <input
                  value={address.hostel}
                  onChange={(e) => setAddress({ ...address, hostel: e.target.value })}
                  placeholder="e.g. Block C, Room 214"
                />
                <label>Phone number</label>
                <input
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="For the delivery runner to reach you"
                />
              </div>
            )}

            <div className="cart-total-row" style={{ flexDirection: "column", gap: 4, alignItems: "stretch" }}>
              <div className="cart-subtotal-line">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="cart-subtotal-line">
                  <span>Delivery fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
              )}
              <div className="cart-subtotal-line cart-grand-total">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button className="primary-btn" style={{ marginTop: 10 }} onClick={handleCheckoutClick}>
              Proceed to pay
            </button>
          </>
        )}
      </div>
    </div>
  );
}
