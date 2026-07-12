import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import ItemCard from "./components/ItemCard";
import PostItemModal from "./components/PostItemModal";
import ChatModal from "./components/ChatModal";
import CartModal from "./components/CartModal";
import PaymentModal from "./components/PaymentModal";
import FeedbackModal from "./components/FeedbackModal";
import ReviewsModal from "./components/ReviewsModal";
import OrdersModal from "./components/OrdersModal";
import ProfileModal from "./components/ProfileModal";
import RewardsModal from "./components/RewardsModal";
import GiftCardModal from "./components/GiftCardModal";
import NotificationsModal from "./components/NotificationsModal";
import SupportModal from "./components/SupportModal";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import InboxModal from "./components/InboxModal";
import ScanSearchModal from "./components/ScanSearchModal";
import BannerSlider from "./components/BannerSlider";
import CategoryRow from "./components/CategoryRow";
import { mockListings } from "./data/mockData";
import * as firebaseApi from "./firebase.js";

// Firebase is optional for local/demo use. If env vars aren't set, the app
// falls back to in-memory mock data so it still runs and can be demoed.

export default function App() {
  const [user, setUser] = useState(null);
  const [showInbox, setShowInbox] = useState(false);
  const [items, setItems] = useState(mockListings);
  const [wishlist, setWishlist] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [chatItem, setChatItem] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState(null);
  const [reviewItem, setReviewItem] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(null);
  const [showScan, setShowScan] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showGiftCards, setShowGiftCards] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

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

  function handleLogin() {
  setShowSignInModal(true);
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

  async function handlePostSubmit({ title, category, price, condition, imageFile, imagePreview }) {
    if (demoMode) {
      const newItem = {
        id: Date.now().toString(),
        title,
        category,
        price,
        condition,
        sellerName: user ? user.displayName : "You",
        sold: false,
        imageUrl: imagePreview || null,
        rating: null,
        reviewCount: 0,
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

  function handleAddToCart(item) {
    setCart((prev) => (prev.find((i) => i.id === item.id) ? prev : [...prev, item]));
  }

  function handleRemoveFromCart(itemId) {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  }

  function handleCheckout(checkoutDetails) {
    setPendingCheckout(checkoutDetails);
    setShowCart(false);
    setShowPayment(true);
  }

  function handlePaymentSuccess(purchasedItems) {
    setItems((prev) =>
      prev.map((i) => (purchasedItems.find((p) => p.id === i.id) ? { ...i, sold: true } : i))
    );
    const order = {
      id: "order-" + Date.now(),
      items: purchasedItems,
      delivery: pendingCheckout?.delivery || "pickup",
      address: pendingCheckout?.address || null,
      total: pendingCheckout?.total || purchasedItems.reduce((s, i) => s + Number(i.price), 0),
      status: "Placed",
    };
    setOrders((prev) => [order, ...prev]);
    // Simulate delivery progressing through stages for hostel-delivery orders.
    if (order.delivery === "delivery") {
      const stages = ["Placed", "Packed", "Out for delivery", "Delivered"];
      stages.forEach((stage, i) => {
        setTimeout(() => {
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, status: stage } : o))
          );
        }, (i + 1) * 4000);
      });
    }
    setShowPayment(false);
    setFeedbackItems(purchasedItems);
    setCart([]);
    setPendingCheckout(null);
  }

  function handleCall(item) {
    window.location.href = `tel:${item.sellerPhone || ""}`;
  }

  function handleViewReviews(item) {
    setReviewItem(item);
  }

  function handleFeedbackSubmit(itemId, rating, comment) {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const prevCount = i.reviewCount || 0;
        const prevRating = i.rating || 0;
        const newCount = prevCount + 1;
        const newRating = (prevRating * prevCount + rating) / newCount;
        const newReview = { reviewer: user ? user.displayName : "You", rating, comment };
        return {
          ...i,
          rating: newRating,
          reviewCount: newCount,
          reviews: [newReview, ...(i.reviews || [])],
        };
      })
    );
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
        cartCount={cart.length}
        ordersCount={orders.length}
        onOpenInbox={() => setShowInbox(true)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenPost={() => setShowPostModal(true)}
        onOpenWishlist={() => setActiveCat("All")}
        onOpenCart={() => setShowCart(true)}
        onOpenOrders={() => setShowOrders(true)}
        onOpenScan={() => setShowScan(true)}
        onSearch={(cat) => { setActiveCat(cat); setQuery(""); }}
        searchQuery={query}
        setSearchQuery={setQuery}
        onOpenProfile={() => setShowProfile(true)}
        onOpenRewards={() => setShowRewards(true)}
        onOpenGiftCards={() => setShowGiftCards(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenSupport={() => setShowSupport(true)}
      />

      <BannerSlider setActiveCat={setActiveCat} />
      <CategoryRow setActiveCat={setActiveCat} setQuery={setQuery} />

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
        onScanSearch={() => {
          setActiveCat("All");
          setQuery("");
        }}
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
              onAddToCart={handleAddToCart}
              onCall={handleCall}
              onViewReviews={handleViewReviews}
              inCart={!!cart.find((c) => c.id === item.id)}
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
  <AuthModal
    onClose={() => setShowSignInModal(false)}
    onSuccess={(userData) => { setUser(userData); setShowSignInModal(false); }}
  />
)}

      {showCart && (
        <CartModal
          cartItems={cart}
          onRemove={handleRemoveFromCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}

      {showPayment && (
        <PaymentModal
          cartItems={cart}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {feedbackItems && (
        <FeedbackModal
          items={feedbackItems}
          onClose={() => setFeedbackItems(null)}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      {reviewItem && <ReviewsModal item={reviewItem} onClose={() => setReviewItem(null)} />}

      {showOrders && <OrdersModal orders={orders} onClose={() => setShowOrders(false)} />}

      {showScan && (
        <ScanSearchModal
          onClose={() => setShowScan(false)}
          onResult={(cat) => { setActiveCat(cat); setQuery(""); setShowScan(false); }}
        />
      )}

      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdate={(updated) => setUser(updated)}
        />
      )}

      {showRewards && (
        <RewardsModal orders={orders} onClose={() => setShowRewards(false)} />
      )}

      {showGiftCards && <GiftCardModal onClose={() => setShowGiftCards(false)} />}

      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}

      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}

      <Footer />
      {showInbox && (
  <InboxModal
    currentUser={user}
    onClose={() => setShowInbox(false)}
    onOpenThread={(thread) => {
      setShowInbox(false);
      setChatItem({ id: thread.itemId, title: thread.itemTitle, price: thread.itemPrice, sellerName: thread.sellerName, sellerUid: thread.sellerUid });
    }}
  />
)}
    </div>
  );

