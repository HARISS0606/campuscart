import React, { useState, useEffect, useRef } from "react";

export default function ChatModal({ item, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Unique thread ID = sorted user IDs + item ID
  const threadId = currentUser
    ? [currentUser.uid, item.sellerUid || "seller_" + item.id].sort().join("_") + "__" + item.id
    : null;

  useEffect(() => {
    if (!threadId) {
      setLoading(false);
      return;
    }

    let unsub;
    (async () => {
      try {
        const { db } = await import("../firebase.js");
        const { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp } = await import("firebase/firestore");

        // Create thread metadata so seller can find their conversations
        await setDoc(
          doc(db, "chatThreads", threadId),
          {
            itemId: item.id,
            itemTitle: item.title,
            itemPrice: item.price,
            buyerId: currentUser.uid,
            buyerName: currentUser.displayName,
            sellerUid: item.sellerUid || null,
            sellerName: item.sellerName,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        const msgsRef = collection(db, "chatThreads", threadId, "messages");
        const q = query(msgsRef, orderBy("ts", "asc"));
        unsub = onSnapshot(q, (snap) => {
          setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    })();

    return () => unsub && unsub();
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!draft.trim() || !threadId) return;
    const text = draft.trim();
    setDraft("");

    try {
      const { db } = await import("../firebase.js");
      const { collection, addDoc, doc, updateDoc, serverTimestamp } = await import("firebase/firestore");

      await addDoc(collection(db, "chatThreads", threadId, "messages"), {
        from: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        role: currentUser.role || "buyer",
        text,
        ts: serverTimestamp(),
        read: false,
      });

      // Update thread timestamp so it sorts to top in inbox
      await updateDoc(doc(db, "chatThreads", threadId), {
        lastMessage: text,
        lastSender: currentUser.displayName,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Send failed:", e);
    }
  }

  const isMe = (msg) => currentUser && msg.from === currentUser.uid;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 16 }}>Chat with {item.sellerName}</h3>
            <p className="chat-subtitle">{item.title} · ₹{Number(item.price).toLocaleString("en-IN")}</p>
          </div>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        <div className="chat-messages">
          {loading && (
            <p className="chat-subtitle" style={{ textAlign: "center", padding: "20px 0" }}>
              Loading messages...
            </p>
          )}

          {!loading && messages.length === 0 && (
            <div className="chat-empty">
              <p>👋 Start the conversation!</p>
              <p className="chat-subtitle">Ask about condition, availability, or meetup location.</p>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={"chat-bubble-wrap " + (isMe(m) ? "me" : "them")}>
              {!isMe(m) && <span className="bubble-name">{m.senderName}</span>}
              <div className={"chat-bubble " + (isMe(m) ? "me" : "them")}>
                {m.text}
              </div>
              <span className="bubble-role">{m.role === "seller" ? "Seller" : "Buyer"}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {!currentUser ? (
          <p className="chat-subtitle" style={{ textAlign: "center" }}>Sign in to send messages.</p>
        ) : (
          <div className="chat-input-row">
            <input
              placeholder="Type a message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              autoFocus
            />
            <button className="primary-btn small" onClick={send}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
