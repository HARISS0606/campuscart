import React from "react";
import Logo from "./Logo";

export default function Navbar({ user, wishCount, cartCount, ordersCount, onLogin, onLogout, onOpenPost, onOpenWishlist, onOpenCart, onOpenOrders }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Logo size={36} />
        <span>CampusCart</span>
      </div>
      <div className="navbar-actions">
        <button className="ghost-btn" onClick={onOpenWishlist}>
          ♥ Wishlist ({wishCount})
        </button>
        <button className="ghost-btn" onClick={onOpenCart}>
          🛒 Cart ({cartCount})
        </button>
        <button className="ghost-btn" onClick={onOpenOrders}>
          📦 Orders ({ordersCount})
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
