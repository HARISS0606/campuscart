import React, { useState } from "react";

const FAQS = [
  { q: "How do I pay for an item?", a: "Add it to cart and choose Card or UPI at checkout. Payments are processed securely." },
  { q: "How do I get my item?", a: "Choose Self pickup or Hostel delivery at checkout. Delivery reaches your hostel/block within the day." },
  { q: "What if the item is not as described?", a: "Contact the seller directly via chat or call. If unresolved, report the listing using the flag button." },
  { q: "Can I return an item?", a: "Returns are between buyer and seller. Always inspect before full payment, especially for cycles and electronics." },
  { q: "How are Project/Assignment listings used?", a: "They are sold for reference and learning only — not for direct academic resubmission." },
];

export default function SupportModal({ onClose }) {
  const [open, setOpen] = useState(null);
  const [ticket, setTicket] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h3>24×7 customer care</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Frequently asked questions</p>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className="faq-row">
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                {f.q} <span>{open === i ? "▲" : "▼"}</span>
              </button>
              {open === i && <p className="faq-a">{f.a}</p>}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, fontWeight: 500, margin: "14px 0 8px" }}>Raise a support ticket</p>
        {sent ? (
          <p className="chat-subtitle" style={{ color: "var(--text-accent)" }}>✓ Ticket raised! We'll respond within 2 hours.</p>
        ) : (
          <>
            <textarea
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              placeholder="Describe your issue..."
              rows={3}
            />
            <button className="primary-btn" style={{ marginTop: 10 }} onClick={() => ticket.trim() && setSent(true)}>
              Submit ticket
            </button>
          </>
        )}
      </div>
    </div>
  );
}
