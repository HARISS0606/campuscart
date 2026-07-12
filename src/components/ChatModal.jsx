import React, { useState, useEffect, useRef } from "react";

// Real-time chat using Firestore.
// Falls back gracefully if Firebase isn't configured (demo mode).
export default function ChatModal({ item, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Build a deterministic chat thread ID from buyer + seller + item
  const threadId = currentUser
    ? [currentUser.uid, item.sellerUid || item.id].sort().join("_") + "_" + item.id
    : null;

  useEffect(() => {
    if (!threadId) {
      // Demo mode fallback
      setMessages([{
        id: "demo",
        from: "seller",
        senderName: item.sellerName,
        text: `Hi! Thanks for your interest in "${item.title}". Still available — happy to answer questions.`,
        ts: Date.now(),
      }]);
      setLoading(false);
      return;
    }

    let unsub;
    (async () => {
      try {
        const { db } = await import("../firebase.js");
        const { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = await import("firebase/firestore");
        const msgsRef = collection(db, "chats", threadId, "messages");
        const q = query(msgsRef, orderBy("ts", "asc"));
        unsub = onSnapshot(q, (snap) => {
          setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
      } catch {
        setLoading(false);
      }
    })();
    return () => unsub && unsub();
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft("");

    if (!threadId) {
      // Demo fallback
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "me", senderName: "You", text, ts: Date.now() },
      ]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, from: "seller", senderName: item.sellerName, text: "Got it! Let's meet near the library gate at 5pm?", ts: Date.now() },
        ]);
      }, 900);
      return;
    }

    try {
      const { db } = await import("../firebase.js");
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      await addDoc(collection(db, "chats", threadId, "messages"), {
        from: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        text,
        ts: serverTimestamp(),
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
            <h3 style={{ fontSize: 16 }}>{item.sellerName}</h3>
            <p className="chat-subtitle">{item.title} · ₹{Number(item.price).toLocaleString("en-IN")}</p>
          </div>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        <div className="chat-messages">
          {loading && <p className="chat-subtitle" style={{ textAlign: "center" }}>Loading...</p>}
          {messages.map((m) => (
            <div key={m.id} className={"chat-bubble " + (isMe(m) ? "me" : "them")}>
              {!isMe(m) && <span className="bubble-name">{m.senderName}</span>}
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-row">
          <input
            placeholder="Type a message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="primary-btn small" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
