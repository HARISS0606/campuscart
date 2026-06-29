import React, { useState } from "react";

// Demo payment flow. To accept real payments, swap this component's
// handleSubmit for a Razorpay/Stripe Checkout session — see README.
export default function PaymentModal({ cartItems, onClose, onSuccess }) {
  const [step, setStep] = useState("form"); // form -> processing -> success
  const [method, setMethod] = useState("card"); // card | upi
  const [card, setCard] = useState("");
  const [upiId, setUpiId] = useState("");
  const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);

  // Generates a scannable UPI QR using a public QR-rendering service.
  // In production, replace the upi:// string with one built from your
  // real merchant VPA via your payment gateway's order API.
  const upiString = `upi://pay?pa=campuscart@upi&pn=CampusCart&am=${total}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(upiString)}`;

  function handleSubmit(e) {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => setStep("success"), 1400);
  }

  function confirmUpiPaid() {
    setStep("processing");
    setTimeout(() => setStep("success"), 1200);
  }

  return (
    <div className="modal-overlay" onClick={step === "success" ? onClose : undefined}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        {step === "form" && (
          <>
            <div className="modal-header">
              <h3>Checkout</h3>
              <button type="button" className="ghost-btn small" onClick={onClose}>✕</button>
            </div>

            <div className="pay-tabs">
              <button
                type="button"
                className={"pay-tab" + (method === "card" ? " active" : "")}
                onClick={() => setMethod("card")}
              >
                Card
              </button>
              <button
                type="button"
                className={"pay-tab" + (method === "upi" ? " active" : "")}
                onClick={() => setMethod("upi")}
              >
                UPI
              </button>
            </div>

            {method === "card" ? (
              <form onSubmit={handleSubmit}>
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
            ) : (
              <div className="upi-pane">
                <p className="chat-subtitle" style={{ marginBottom: 10 }}>
                  Scan to pay with any UPI app, or enter your UPI ID.
                </p>
                <div className="qr-box">
                  <img src={qrUrl} alt="Scan to pay QR code" width={150} height={150} />
                  <span className="qr-label">Scan to pay ₹{total.toLocaleString("en-IN")}</span>
                </div>
                <label>or enter UPI ID</label>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                />
                <button className="primary-btn" style={{ marginTop: 12 }} onClick={confirmUpiPaid}>
                  I've paid — confirm
                </button>
              </div>
            )}
          </>
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
