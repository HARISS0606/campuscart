import React, { useState, useEffect } from "react";

// Seller's inbox — shows all chat threads where they are the seller.
// Buyers see threads where they initiated the chat.
export default function InboxModal({ currentUser, onOpenThread, onClose }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    let unsub;
    (async () => {
      try {
        const { db } = await import("../firebase.js");
        const { collection, query, where, orderBy, onSnapshot } = await import("firebase/firestore");

        const field = currentUser.role === "seller" ? "sellerUid" : "buyerId";
        const q = query(
          collection(db, "chatThreads"),
          where(field, "==", currentUser.uid),
          orderBy("updatedAt", "desc")
        );

        unsub = onSnapshot(q, (snap) => {
          setThreads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    })();
    return () => unsub && unsub();
  }, [currentUser]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h3>💬 Messages</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        {loading && <p className="chat-subtitle" style={{ textAlign: "center", padding: "20px 0" }}>Loading...</p>}

        {!loading && threads.length === 0 && (
          <p className="empty-state" style={{ padding: "20px 0" }}>
            No messages yet. {currentUser?.role === "buyer" ? "Message a seller to start!" : "Buyers will reach out when interested in your listings."}
          </p>
        )}

        <div className="inbox-list">
          {threads.map((t) => (
            <button key={t.id} className="inbox-row" onClick={() => onOpenThread(t)}>
              <div className="inbox-avatar">
                {currentUser.role === "seller"
                  ? (t.buyerName || "B")[0].toUpperCase()
                  : (t.sellerName || "S")[0].toUpperCase()}
              </div>
              <div className="inbox-info">
                <span className="inbox-name">
                  {currentUser.role === "seller" ? t.buyerName : t.sellerName}
                </span>
                <span className="inbox-item">{t.itemTitle}</span>
                {t.lastMessage && (
                  <span className="inbox-preview">{t.lastSender}: {t.lastMessage}</span>
                )}
              </div>
              <span className="inbox-price">₹{Number(t.itemPrice).toLocaleString("en-IN")}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
