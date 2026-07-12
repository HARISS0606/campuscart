import React, { useState, useRef, useEffect } from "react";
import Logo from "./Logo";

export default function Navbar({ user, wishCount, cartCount, ordersCount, onLogin, onLogout, onOpenPost, onOpenWishlist, onOpenCart, onOpenOrders, onOpenProfile, onOpenRewards, onOpenGiftCards, onOpenNotifications, onOpenSupport, onOpenInbox }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Logo size={36} />
        <span>CampusCart</span>
      </div>
      <div className="navbar-actions">
        <button className="ghost-btn" onClick={onOpenInbox}>💬 Messages</button>
        <button className="ghost-btn" onClick={onOpenWishlist}>♥ Wishlist ({wishCount})</button>
        <button className="ghost-btn" onClick={onOpenCart}>🛒 Cart ({cartCount})</button>
        <button className="ghost-btn" onClick={onOpenOrders}>📦 Orders ({ordersCount})</button>
        {user ? (
          <div className="user-menu-wrap" ref={menuRef}>
            <button className="user-chip" onClick={() => setMenuOpen((v) => !v)}>
              <span className={"role-dot " + (user.role || "buyer")} />
              {user.displayName || user.email} ▾
            </button>
            {menuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-name">{user.displayName}</span>
                  <span className={"role-badge " + (user.role || "buyer")}>
                    {user.role === "seller" ? "🏪 Seller" : "🛍 Buyer"}
                  </span>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { onOpenProfile(); setMenuOpen(false); }}>👤 My profile</button>
                <button className="dropdown-item" onClick={() => { onOpenInbox(); setMenuOpen(false); }}>💬 Messages</button>
                <button className="dropdown-item" onClick={() => { onOpenOrders(); setMenuOpen(false); }}>📦 My orders</button>
                <button className="dropdown-item" onClick={() => { onOpenWishlist(); setMenuOpen(false); }}>♥ Wishlist</button>
                <button className="dropdown-item" onClick={() => { onOpenRewards(); setMenuOpen(false); }}>🎁 Rewards</button>
                <button className="dropdown-item" onClick={() => { onOpenGiftCards(); setMenuOpen(false); }}>💳 Gift cards</button>
                <button className="dropdown-item" onClick={() => { onOpenNotifications(); setMenuOpen(false); }}>🔔 Notifications</button>
                <button className="dropdown-item seller-item" onClick={() => { onOpenPost(); setMenuOpen(false); }}>🏪 Sell an item</button>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { onOpenSupport(); setMenuOpen(false); }}>🎧 Customer care</button>
                <button className="dropdown-item logout-item" onClick={() => { onLogout(); setMenuOpen(false); }}>← Log out</button>
              </div>
            )}
          </div>
        ) : (
          <button className="primary-btn" onClick={onLogin}>Sign in</button>
        )}
        {user && <button className="primary-btn" onClick={onOpenPost}>+ Sell an item</button>}
      </div>
    </nav>
  );
}
