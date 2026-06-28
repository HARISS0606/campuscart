import React, { useState } from "react";

// Demo payment flow. To accept real payments, swap this component's
// handleSubmit for a Razorpay/Stripe Checkout session — see README.
export default function PaymentModal({ cartItems, onClose, onSuccess }) {
  const [step, setStep] = useState("form"); // form -> processing -> success
  const [card, setCard] = useState("");
  const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);

  function handleSubmit(e) {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => {
      setStep("success");
    }, 1400);
  }

  return (
    <div className="modal-overlay" onClick={step === "success" ? onClose : undefined}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        {step === "form" && (
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h3>Checkout</h3>
              <button type="button" className="ghost-btn small" onClick={onClose}>✕</button>
            </div>
            <p className="chat-subtitle" style={{ marginBottom: 8 }}>
              Demo payment — no real card is charged.
            </p>
            <label>Card number</label>
            <input
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="4242 4242 4242 4242"
              required
            />
            <label>Expiry</label>
            <input placeholder="MM/YY" required />
            <label>CVV</label>
            <input placeholder="123" required />
            <button type="submit" className="primary-btn" style={{ marginTop: 12 }}>
              Pay ₹{total.toLocaleString("en-IN")}
            </button>
          </form>
        )}

        {step === "processing" && (
          <div className="pay-status">
            <div className="spinner" />
            <p>Processing payment...</p>
          </div>
        )}

        {step === "success" && (
          <div className="pay-status">
            <div className="success-tick">✓</div>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>Payment successful</h3>
            <p className="chat-subtitle" style={{ marginBottom: 16 }}>
              ₹{total.toLocaleString("en-IN")} paid for {cartItems.length} item(s).
            </p>
            <button className="primary-btn" onClick={() => onSuccess(cartItems)}>
              Leave feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
