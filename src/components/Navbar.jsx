import React from "react";

export default function Navbar({ user, wishCount, cartCount, onLogin, onLogout, onOpenPost, onOpenWishlist, onOpenCart }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-dot">🛍</span>
        <span>CampusCart</span>
      </div>
      <div className="navbar-actions">
        <button className="ghost-btn" onClick={onOpenWishlist}>
          ♥ Wishlist ({wishCount})
        </button>
        <button className="ghost-btn" onClick={onOpenCart}>
          🛒 Cart ({cartCount})
        </button>
        {user ? (
          <>
            <span className="user-chip">{user.displayName || user.email}</span>
            <button className="primary-btn" onClick={onOpenPost}>+ Sell an item</button>
            <button className="ghost-btn" onClick={onLogout}>Log out</button>
          </>
        ) : (
          <button className="primary-btn" onClick={onLogin}>Sign in with college email</button>
        )}
      </div>
    </nav>
  );
}
