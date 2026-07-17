import React, { useState } from "react";

const ITEMS = [
  { id: "s1", name: "Ball Pen (Blue)", price: 10, category: "Pens", icon: "🖊" },
  { id: "s2", name: "Ball Pen (Black)", price: 10, category: "Pens", icon: "🖊" },
  { id: "s3", name: "Pencil HB", price: 5, category: "Pens", icon: "✏️" },
  { id: "s4", name: "Gel Pen (Pack of 5)", price: 40, category: "Pens", icon: "🖊" },
  { id: "s5", name: "A4 Notebook (100 pages)", price: 45, category: "Notebooks", icon: "📓" },
  { id: "s6", name: "Lab Record Book", price: 60, category: "Notebooks", icon: "📒" },
  { id: "s7", name: "Graph Book (40 pages)", price: 30, category: "Notebooks", icon: "📔" },
  { id: "s8", name: "Spiral Notebook", price: 55, category: "Notebooks", icon: "📓" },
  { id: "s9", name: "Eraser", price: 5, category: "Supplies", icon: "🧹" },
  { id: "s10", name: "Scale (30cm)", price: 10, category: "Supplies", icon: "📏" },
  { id: "s11", name: "Stapler + Pins", price: 50, category: "Supplies", icon: "📎" },
  { id: "s12", name: "Highlighter (set of 4)", price: 60, category: "Supplies", icon: "🖍" },
  { id: "s13", name: "Sticky Notes (100 sheets)", price: 30, category: "Supplies", icon: "📝" },
  { id: "s14", name: "Scientific Calculator", price: 350, category: "Electronics", icon: "🔢" },
  { id: "s15", name: "USB Pen Drive (16GB)", price: 280, category: "Electronics", icon: "💾" },
  { id: "s16", name: "Marker Pen (Black)", price: 20, category: "Pens", icon: "🖊" },
];

const CATS = ["All", "Pens", "Notebooks", "Supplies", "Electronics"];

function generatePIN() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function StationeryShop({ onClose }) {
  const [tab, setTab] = useState("shop"); // shop | print | cart | orders
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState([]);
  const [printJobs, setPrintJobs] = useState([]);
  const [orders, setOrders] = useState([]);

  // Print form state
  const [printFile, setPrintFile] = useState(null);
  const [printType, setPrintType] = useState("bw");
  const [printSide, setPrintSide] = useState("single");
  const [printCopies, setPrintCopies] = useState(1);
  const [printPages, setPrintPages] = useState(1);

  // Checkout state
  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState("payment"); // payment | pin
  const [currentPIN, setCurrentPIN] = useState("");
  const [cardNum, setCardNum] = useState("");

  const filtered = ITEMS.filter(i => cat === "All" || i.category === cat);

  function addToCart(item) {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(c => c.id !== id));
  }

  function changeQty(id, delta) {
    setCart(prev => prev.map(c => {
      if (c.id !== id) return c;
      const qty = c.qty + delta;
      return qty <= 0 ? null : { ...c, qty };
    }).filter(Boolean));
  }

  function getPrintPrice() {
    const perPage = printType === "color" ? 5 : 1;
    const sides = printSide === "double" ? 0.5 : 1;
    return Math.ceil(printPages * perPage * sides) * printCopies;
  }

  function addPrintJob() {
    if (!printFile) return;
    const job = {
      id: "p" + Date.now(),
      name: printFile.name,
      type: printType,
      side: printSide,
      copies: printCopies,
      pages: printPages,
      price: getPrintPrice(),
    };
    setPrintJobs(prev => [...prev, job]);
    setPrintFile(null);
    setPrintCopies(1);
    setPrintPages(1);
    setTab("cart");
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const printTotal = printJobs.reduce((s, j) => s + j.price, 0);
  const grandTotal = cartTotal + printTotal;

  function handlePay() {
    const pin = generatePIN();
    setCurrentPIN(pin);
    const order = {
      id: "ORD" + Date.now(),
      pin,
      items: [...cart],
      printJobs: [...printJobs],
      total: grandTotal,
      status: "Placed",
      placedAt: new Date().toLocaleTimeString(),
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setPrintJobs([]);
    setStep("pin");

    // Simulate status updates
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.pin === pin ? { ...o, status: "Processing" } : o));
    }, 5000);
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.pin === pin ? { ...o, status: "Ready for pickup" } : o));
    }, 15000);
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0) + printJobs.length;

  return (
    <div className="sshop-overlay">
      <div className="sshop-modal">

        {/* Header */}
        <div className="sshop-header">
          <div>
            <h2 className="sshop-title">🖨 Stationery Shop</h2>
            <p className="sshop-sub">Buy items, upload docs for print/xerox, pay & get your PIN</p>
          </div>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="sshop-tabs">
          {[["shop", "🛒 Shop"], ["print", "🖨 Print / Xerox"], ["cart", `🧺 Cart (${cartCount})`], ["orders", `📋 My Orders (${orders.length})`]].map(([key, label]) => (
            <button key={key} className={"sshop-tab" + (tab === key ? " active" : "")} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        <div className="sshop-body">

          {/* SHOP TAB */}
          {tab === "shop" && (
            <>
              <div className="cat-row" style={{ marginBottom: 14 }}>
                {CATS.map(c => (
                  <button key={c} className={"cat-chip" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>{c}</button>
                ))}
              </div>
              <div className="sshop-grid">
                {filtered.map(item => (
                  <div key={item.id} className="sshop-card">
                    <span className="sshop-icon">{item.icon}</span>
                    <p className="sshop-item-name">{item.name}</p>
                    <p className="sshop-item-price">₹{item.price}</p>
                    <button className="primary-btn small" onClick={() => addToCart(item)}>Add</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PRINT TAB */}
          {tab === "print" && (
            <div className="print-form">
              <div className="print-upload-box" onClick={() => document.getElementById("printFileInput").click()}>
                {printFile ? (
                  <>
                    <span style={{ fontSize: 28 }}>📄</span>
                    <p className="print-filename">{printFile.name}</p>
                    <p className="chat-subtitle">Click to change file</p>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 36 }}>☁️</span>
                    <p style={{ fontWeight: 600, margin: "6px 0 2px" }}>Upload PDF or Document</p>
                    <p className="chat-subtitle">PDF, DOC, DOCX, JPG, PNG supported</p>
                  </>
                )}
              </div>
              <input id="printFileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style={{ display: "none" }}
                onChange={e => setPrintFile(e.target.files[0])} />

              <div className="print-options">
                <div className="print-option-row">
                  <label>Print type</label>
                  <div className="pay-tabs">
                    <button className={"pay-tab" + (printType === "bw" ? " active" : "")} onClick={() => setPrintType("bw")}>⚫ B&W (₹1/page)</button>
                    <button className={"pay-tab" + (printType === "color" ? " active" : "")} onClick={() => setPrintType("color")}>🎨 Colour (₹5/page)</button>
                  </div>
                </div>

                <div className="print-option-row">
                  <label>Sides</label>
                  <div className="pay-tabs">
                    <button className={"pay-tab" + (printSide === "single" ? " active" : "")} onClick={() => setPrintSide("single")}>Single side</button>
                    <button className={"pay-tab" + (printSide === "double" ? " active" : "")} onClick={() => setPrintSide("double")}>Double side</button>
                  </div>
                </div>

                <div className="print-option-row">
                  <label>Number of pages</label>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={() => setPrintPages(Math.max(1, printPages - 1))}>−</button>
                    <span className="qty-val">{printPages}</span>
                    <button className="qty-btn" onClick={() => setPrintPages(printPages + 1)}>+</button>
                  </div>
                </div>

                <div className="print-option-row">
                  <label>Number of copies</label>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={() => setPrintCopies(Math.max(1, printCopies - 1))}>−</button>
                    <span className="qty-val">{printCopies}</span>
                    <button className="qty-btn" onClick={() => setPrintCopies(printCopies + 1)}>+</button>
                  </div>
                </div>
              </div>

              <div className="print-summary">
                <span>Estimated cost</span>
                <span className="print-cost">₹{getPrintPrice()}</span>
              </div>

              <button className="primary-btn" style={{ width: "100%", marginTop: 14 }}
                onClick={addPrintJob} disabled={!printFile}>
                Add to cart
              </button>
            </div>
          )}

          {/* CART TAB */}
          {tab === "cart" && (
            <>
              {cart.length === 0 && printJobs.length === 0 ? (
                <p className="empty-state">Your cart is empty. Add items or print jobs.</p>
              ) : (
                <>
                  {cart.length > 0 && (
                    <>
                      <p className="sshop-section-label">Stationery items</p>
                      {cart.map(item => (
                        <div key={item.id} className="scart-row">
                          <span className="scart-icon">{item.icon}</span>
                          <div className="scart-info">
                            <p className="scart-name">{item.name}</p>
                            <p className="scart-price">₹{item.price} each</p>
                          </div>
                          <div className="qty-row">
                            <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                            <span className="qty-val">{item.qty}</span>
                            <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                          </div>
                          <span className="scart-total">₹{item.price * item.qty}</span>
                          <button className="ghost-btn small" onClick={() => removeFromCart(item.id)}>✕</button>
                        </div>
                      ))}
                    </>
                  )}

                  {printJobs.length > 0 && (
                    <>
                      <p className="sshop-section-label" style={{ marginTop: 14 }}>Print / Xerox jobs</p>
                      {printJobs.map(job => (
                        <div key={job.id} className="scart-row">
                          <span className="scart-icon">🖨</span>
                          <div className="scart-info">
                            <p className="scart-name">{job.name}</p>
                            <p className="scart-price">{job.type === "color" ? "Colour" : "B&W"} · {job.side} side · {job.pages} pages × {job.copies} copies</p>
                          </div>
                          <span className="scart-total">₹{job.price}</span>
                          <button className="ghost-btn small" onClick={() => setPrintJobs(prev => prev.filter(j => j.id !== job.id))}>✕</button>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="scart-grand-total">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>

                  <button className="primary-btn" style={{ width: "100%", marginTop: 12 }}
                    onClick={() => setShowCheckout(true)}>
                    Pay ₹{grandTotal} & Get PIN
                  </button>
                </>
              )}
            </>
          )}

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <>
              {orders.length === 0 ? (
                <p className="empty-state">No orders yet. Place an order to get your PIN.</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="sorder-card">
                    <div className="sorder-top">
                      <div>
                        <p className="sorder-id">{order.id}</p>
                        <p className="chat-subtitle">Placed at {order.placedAt}</p>
                      </div>
                      <div className="sorder-pin-box">
                        <p className="sorder-pin-label">Your PIN</p>
                        <p className="sorder-pin">{order.pin}</p>
                      </div>
                    </div>

                    <div className="sorder-items">
                      {order.items.map(i => <span key={i.id} className="sorder-item-tag">{i.icon} {i.name} ×{i.qty}</span>)}
                      {order.printJobs.map(j => <span key={j.id} className="sorder-item-tag">🖨 {j.name}</span>)}
                    </div>

                    <div className="sorder-track">
                      {["Placed", "Processing", "Ready for pickup", "Collected"].map((s, i) => {
                        const stages = ["Placed", "Processing", "Ready for pickup", "Collected"];
                        const current = stages.indexOf(order.status);
                        const done = i <= current;
                        return (
                          <div key={s} className={"strack-step" + (done ? " done" : "")}>
                            <span className="strack-dot" />
                            <span className="strack-label">{s}</span>
                          </div>
                        );
                      })}
                    </div>

                    {order.status === "Ready for pickup" && (
                      <div className="sorder-ready-banner">
                        ✅ Your order is ready! Show PIN <strong>{order.pin}</strong> at the stationery counter.
                      </div>
                    )}

                    <div className="sorder-footer">
                      <span>Total paid: <strong>₹{order.total}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showCheckout && (
        <div className="modal-overlay" onClick={() => step === "pin" && setShowCheckout(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>

            {step === "payment" && (
              <>
                <div className="modal-header">
                  <h3>Pay & Get PIN</h3>
                  <button className="ghost-btn small" onClick={() => setShowCheckout(false)}>✕</button>
                </div>
                <div className="order-summary">
                  {cart.map(i => (
                    <div key={i.id} className="cart-subtotal-line">
                      <span>{i.icon} {i.name} ×{i.qty}</span>
                      <span>₹{i.price * i.qty}</span>
                    </div>
                  ))}
                  {printJobs.map(j => (
                    <div key={j.id} className="cart-subtotal-line">
                      <span>🖨 {j.name.slice(0, 20)}</span>
                      <span>₹{j.price}</span>
                    </div>
                  ))}
                  <div className="cart-grand-total">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
                <label style={{ marginTop: 12 }}>Card / UPI number</label>
                <input value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="4242 4242 4242 4242 or UPI ID" />
                <button className="primary-btn" style={{ marginTop: 12, width: "100%" }} onClick={handlePay}>
                  Pay ₹{grandTotal}
                </button>
              </>
            )}

            {step === "pin" && (
              <div className="pay-status">
                <div className="success-tick">✓</div>
                <h3 style={{ fontSize: 18, marginBottom: 4 }}>Payment successful!</h3>
                <p className="chat-subtitle" style={{ marginBottom: 16 }}>Your order has been placed.</p>
                <div className="pin-display">
                  <p className="pin-label">Your 4-digit PIN</p>
                  <p className="pin-number">{currentPIN}</p>
                  <p className="chat-subtitle">Show this PIN at the stationery counter to collect your order.</p>
                </div>
                <button className="primary-btn" style={{ marginTop: 16, width: "100%" }}
                  onClick={() => { setShowCheckout(false); setStep("payment"); setTab("orders"); }}>
                  Track my order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
