import React, { useState } from "react";

// Separate Buyer / Seller login flow.
// Role is stored in Firestore under users/{uid}.role after first sign-in.
export default function AuthModal({ onClose, onSuccess }) {
  const [role, setRole] = useState(null); // null | "buyer" | "seller"
  const [step, setStep] = useState("choose"); // choose | form | loading | error
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [dept, setDept] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleGoogleSignIn() {
    setStep("loading");
    try {
      const { auth, db } = await import("../firebase.js");
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const { doc, setDoc, getDoc, serverTimestamp } = await import("firebase/firestore");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already has a role
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        // New user — save role + profile
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          role,
          college,
          dept,
          createdAt: serverTimestamp(),
        });
      }

      const userData = snap.exists() ? snap.data() : { role };
      onSuccess({ ...user, role: userData.role || role });
    } catch (e) {
      setErrorMsg(e.message);
      setStep("error");
    }
  }

  async function handleEmailSignIn() {
    if (!name.trim() || !email.trim()) return;
    setStep("loading");
    try {
      const { auth, db } = await import("../firebase.js");
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const { doc, setDoc, getDoc, serverTimestamp } = await import("firebase/firestore");

      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, email + "_campus2024");
        await updateProfile(userCredential.user, { displayName: name });
      } catch {
        userCredential = await signInWithEmailAndPassword(auth, email, email + "_campus2024");
      }

      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          displayName: name,
          email,
          role,
          college,
          dept,
          createdAt: serverTimestamp(),
        });
      }

      const userData = snap.exists() ? snap.data() : { role };
      onSuccess({ ...user, displayName: name, role: userData.role || role });
    } catch (e) {
      setErrorMsg(e.message);
      setStep("error");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>

        {step === "choose" && (
          <>
            <div className="modal-header">
              <h3>Join CampusCart</h3>
              <button className="ghost-btn small" onClick={onClose}>✕</button>
            </div>
            <p className="chat-subtitle" style={{ marginBottom: 16 }}>
              Are you here to buy or sell?
            </p>
            <div className="role-cards">
              <button
                className={"role-card" + (role === "buyer" ? " selected" : "")}
                onClick={() => { setRole("buyer"); setStep("form"); }}
              >
                <span className="role-icon">🛍</span>
                <span className="role-title">I'm a Buyer</span>
                <span className="role-desc">Browse and buy items from students on campus</span>
              </button>
              <button
                className={"role-card" + (role === "seller" ? " selected" : "")}
                onClick={() => { setRole("seller"); setStep("form"); }}
              >
                <span className="role-icon">🏪</span>
                <span className="role-title">I'm a Seller</span>
                <span className="role-desc">List your items and earn from fellow students</span>
              </button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <div className="modal-header">
              <h3>{role === "buyer" ? "🛍 Buyer" : "🏪 Seller"} Sign in</h3>
              <button className="ghost-btn small" onClick={() => setStep("choose")}>← Back</button>
            </div>

            <label>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hariss Kumar" />

            <label>College email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@college.edu" />

            <label>College</label>
            <input value={college} onChange={(e) => setCollege(e.target.value)} placeholder="e.g. SRM Institute of Science & Technology" />

            <label>Department</label>
            <input value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g. Computer Science" />

            <button className="primary-btn" style={{ marginTop: 14 }} onClick={handleEmailSignIn}>
              Continue as {role === "buyer" ? "Buyer" : "Seller"}
            </button>

            <div className="or-divider"><span>or</span></div>

            <button className="google-btn" onClick={handleGoogleSignIn}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={18} alt="Google" />
              Continue with Google
            </button>
          </>
        )}

        {step === "loading" && (
          <div className="pay-status">
            <div className="spinner" />
            <p>Signing you in...</p>
          </div>
        )}

        {step === "error" && (
          <div className="pay-status">
            <p style={{ color: "var(--coral)", fontSize: 14 }}>{errorMsg}</p>
            <button className="primary-btn" style={{ marginTop: 12 }} onClick={() => setStep("form")}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
