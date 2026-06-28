import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import ItemCard from "./components/ItemCard";
import PostItemModal from "./components/PostItemModal";
import ChatModal from "./components/ChatModal";
import SignInModal from "./components/SignInModal";
import { mockListings } from "./data/mockData";
import * as firebaseApi from "./firebase.js";

// Firebase is optional for local/demo use. If env vars aren't set, the app
// falls back to in-memory mock data so it still runs and can be demoed.

export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState(mockListings);
  const [wishlist, setWishlist] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [chatItem, setChatItem] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const demoMode = !import.meta.env.VITE_FIREBASE_API_KEY;

  useEffect(() => {
    if (demoMode) return;
    const unsub = firebaseApi.watchAuth(setUser);
    firebaseApi.getAllListings().then(setItems).catch(console.error);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (demoMode || !user) return;
    firebaseApi.getWishlist(user.uid).then(setWishlist).catch(console.error);
  }, [user]);

  async function handleLogin() {
    if (demoMode) {
      setShowSignInModal(true);
      return;
    }
    try {
      const res = await firebaseApi.loginWithGoogle();
      setUser(res.user);
    } catch (e) {
      alert("Login failed: " + e.message);
    }
  }

  function handleSignInSubmit(userObj) {
    setUser(userObj);
    setShowSignInModal(false);
  }

  async function handleLogout() {
    if (!demoMode) await firebaseApi.logout();
    setUser(null);
  }

  async function handlePostSubmit({ title, category, price, condition, imageFile }) {
    if (demoMode) {
      const newItem = {
        id: Date.now().toString(),
        title,
        category,
        price,
        condition,
        sellerName: user ? user.displayName : "You",
        sold: false,
      };
      setItems((prev) => [newItem, ...prev]);
      setShowPostModal(false);
      return;
    }
    const doc = await firebaseApi.addListing({
      title,
      category,
      price,
      condition,
      sellerName: user.displayName || user.email,
      sellerEmail: user.email,
    });
    if (imageFile) {
      const url = await firebaseApi.uploadItemImage(imageFile, doc.id);
      // In production also patch the listing doc with the resulting imageUrl.
    }
    const refreshed = await firebaseApi.getAllListings();
    setItems(refreshed);
    setShowPostModal(false);
  }

  async function handleToggleWishlist(itemId) {
    const isWishlisted = wishlist.includes(itemId);
    if (demoMode || !user) {
      setWishlist((prev) =>
        isWishlisted ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      );
      return;
    }
    await firebaseApi.toggleWishlist(user.uid, itemId, isWishlisted);
    setWishlist((prev) =>
      isWishlisted ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }

  async function handleMarkSold(itemId) {
    if (!demoMode) await firebaseApi.markAsSold(itemId);
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, sold: true } : i)));
  }

  function handleMessageSeller(item) {
    setChatItem(item);
  }

  const filtered = items.filter(
    (i) =>
      (activeCat === "All" || i.category === activeCat) &&
      i.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        wishCount={wishlist.length}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenPost={() => setShowPostModal(true)}
        onOpenWishlist={() => setActiveCat("All")}
      />

      {demoMode && (
        <div className="demo-banner">
          Running in demo mode (no Firebase keys found). Listings are stored
          in memory only. Sign in above to unlock selling — no real email
          needed in demo mode. Add your Firebase config to <code>.env</code>{" "}
          to enable real accounts and persistence.
        </div>
      )}

      <section className="hero">
        <div className="hero-text">
          <h1>Don't bin it. Pass it on.</h1>
          <p>
            Buy and sell textbooks, cycles, and furniture with students on
            your own campus — verified, local, and zero shipping.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{items.length}</span>
            <span className="stat-label">items listed</span>
          </div>
          <div className="stat">
            <span className="stat-num">{items.filter((i) => i.sold).length}</span>
            <span className="stat-label">items reused</span>
          </div>
          <div className="stat">
            <span className="stat-num">
              ₹{items.reduce((sum, i) => sum + Number(i.price), 0).toLocaleString("en-IN")}
            </span>
            <span className="stat-label">total value on campus</span>
          </div>
        </div>
      </section>

      <FilterBar
        query={query}
        setQuery={setQuery}
        activeCat={activeCat}
        setActiveCat={setActiveCat}
      />

      {filtered.length === 0 ? (
        <p className="empty-state">No items match. Try a different search or category.</p>
      ) : (
        <div className="item-grid">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isWishlisted={wishlist.includes(item.id)}
              onToggleWishlist={handleToggleWishlist}
              onMessageSeller={handleMessageSeller}
              onMarkSold={handleMarkSold}
              isOwner={user && item.sellerName === (user.displayName || user.email)}
            />
          ))}
        </div>
      )}

      {showPostModal && (
        <PostItemModal onClose={() => setShowPostModal(false)} onSubmit={handlePostSubmit} />
      )}

      {chatItem && <ChatModal item={chatItem} onClose={() => setChatItem(null)} />}

      {showSignInModal && (
        <SignInModal onClose={() => setShowSignInModal(false)} onSignIn={handleSignInSubmit} />
      )}
    </div>
  );
}
