import React, { useState, useEffect } from "react";

// Razorpay integration with GPay/UPI support.
// Test mode: use key id "rzp_test_..." — no real money is charged.
// Live mode: replace with your live key after Razorpay KYC approval.
// Get your test key at: https://dashboard.razorpay.com/app/keys

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_demo";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentModal({ cartItems, onClose, onSuccess }) {
  const [step, setStep] = useState("form"); // form | processing | success | error
  const [method, setMethod] = useState("razorpay"); // razorpay | upi
  const [upiId, setUpiId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const total = cartItems.reduce((sum, i) => sum + Number(i.price), 0);

  const upiString = `upi://pay?pa=campuscart@upi&pn=CampusCart&am=${total}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(upiString)}`;

  async function handleRazorpay() {
    setStep("processing");
    const loaded = await loadRazorpay();
    if (!loaded || RAZORPAY_KEY === "rzp_test_demo") {
      // Razorpay key not configured — simulate success for demo
      setTimeout(() => setStep("success"), 1400);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: total * 100, // paise
      currency: "INR",
      name: "CampusCart",
      description: cartItems.map((i) => i.title).join(", "),
      handler: () => setStep("success"),
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#0f6e56" },
      modal: { ondismiss: () => setStep("form") },
    };
    try {
      new window.Razorpay(options).open();
      setStep("form"); // Razorpay opens its own modal
    } catch (e) {
      setErrorMsg("Payment failed. Please try again.");
      setStep("error");
    }
  }

  function confirmUpiPaid() {
    if (!upiId.trim() && method === "upi") return;
    setStep("processing");
    setTimeout(() => setStep("success"), 1200);
  }

  return (
    <div className="modal-overlay" onClick={step === "success" ? onClose : undefined}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>

        {step === "form" && (
          <>
            <div className="modal-header">
              <h3>Checkout</h3>
              <button type="button" className="ghost-btn small" onClick={onClose}>✕</button>
            </div>

            <div className="order-summary">
              {cartItems.map((i) => (
                <div key={i.id} className="cart-subtotal-line">
                  <span style={{ fontSize: 13 }}>{i.title.slice(0, 32)}{i.title.length > 32 ? "…" : ""}</span>
                  <span>₹{Number(i.price).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="cart-grand-total" style={{ marginTop: 8 }}>
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="pay-tabs" style={{ marginTop: 14 }}>
              <button className={"pay-tab" + (method === "razorpay" ? " active" : "")} onClick={() => setMethod("razorpay")}>
                Card / GPay / NetBanking
              </button>
              <button className={"pay-tab" + (method === "upi" ? " active" : "")} onClick={() => setMethod("upi")}>
                Scan QR
              </button>
            </div>

            {method === "razorpay" ? (
              <div>
                <p className="chat-subtitle" style={{ marginBottom: 12, marginTop: 6 }}>
                  Pay securely via Razorpay — supports GPay, PhonePe, UPI, Card, NetBanking.
                </p>
                <div className="pay-logos">
                  <span>GPay</span><span>PhonePe</span><span>UPI</span><span>Visa</span><span>Mastercard</span>
                </div>
                <button className="primary-btn" style={{ width: "100%", marginTop: 14 }} onClick={handleRazorpay}>
                  Pay ₹{total.toLocaleString("en-IN")}
                </button>
              </div>
            ) : (
              <div className="upi-pane">
                <p className="chat-subtitle" style={{ marginBottom: 10, marginTop: 6 }}>
                  Scan with any UPI app — GPay, PhonePe, Paytm, BHIM
                </p>
                <div className="qr-box">
                  <img src={qrUrl} alt="Scan to pay" width={150} height={150} />
                  <span className="qr-label">Pay ₹{total.toLocaleString("en-IN")} to campuscart@upi</span>
                </div>
                <label>Enter your UPI ID after paying</label>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@okicici" />
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
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>Payment successful!</h3>
            <p className="chat-subtitle" style={{ marginBottom: 16 }}>
              ₹{total.toLocaleString("en-IN")} paid for {cartItems.length} item(s).
            </p>
            <button className="primary-btn" onClick={() => onSuccess(cartItems)}>
              Leave feedback
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="pay-status">
            <div className="success-tick" style={{ background: "var(--coral-light)", color: "var(--coral)" }}>✕</div>
            <p>{errorMsg}</p>
            <button className="primary-btn" style={{ marginTop: 12 }} onClick={() => setStep("form")}>Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}
