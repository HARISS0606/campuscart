import React, { useState, useRef, useEffect } from "react";

export default function UserDropdown({ user, onLogin, onLogout, onOpenOrders, onOpenPost, onOpenWishlist }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="user-dropdown-wrap" ref={ref}>
      <button className="ud-trigger" onClick={() => setOpen(!open)}>
        {user ? (
          <><span className="ud-avatar">{(user.displayName || "U")[0].toUpperCase()}</span><span className="ud-name">{user.displayName?.split(" ")[0]}</span></>
        ) : (
          <><span>Login</span><span className="ud-chevron">▾</span></>
        )}
      </button>

      {open && (
        <div className="ud-menu">
          {!user ? (
            <div className="ud-top">
              <p className="ud-new">New customer?</p>
              <button className="ud-signup" onClick={() => { onLogin(); setOpen(false); }}>Sign Up / Log In</button>
            </div>
          ) : (
            <div className="ud-top">
              <p className="ud-greeting">Hi, {user.displayName?.split(" ")[0]}!</p>
              <p className="ud-email">{user.email}</p>
            </div>
          )}
          <div className="ud-divider" />
          <button className="ud-item" onClick={() => { onOpenOrders(); setOpen(false); }}>📦 My Orders</button>
          <button className="ud-item" onClick={() => { onOpenWishlist(); setOpen(false); }}>❤️ Wishlist</button>
          {user && <button className="ud-item" onClick={() => { onOpenPost(); setOpen(false); }}>🏷️ Sell an Item</button>}
          <div className="ud-divider" />
          <button className="ud-item">🎁 Rewards</button>
          <button className="ud-item">🎟️ Gift Cards</button>
          <button className="ud-item">📞 24x7 Support</button>
          {user && (
            <>
              <div className="ud-divider" />
              <button className="ud-item ud-logout" onClick={() => { onLogout(); setOpen(false); }}>Log Out</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
