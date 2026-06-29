import React from "react";

const STAGES = ["Placed", "Packed", "Out for delivery", "Delivered"];

export default function OrdersModal({ orders, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h3>My Orders</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        {orders.length === 0 ? (
          <p className="empty-state" style={{ padding: "20px 0" }}>No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const stageIndex = order.delivery === "pickup" ? 0 : STAGES.indexOf(order.status);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-top">
                    <span className="order-id">Order #{order.id.slice(-5)}</span>
                    <span className="order-total">₹{order.total.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="order-items-line">
                    {order.items.map((i) => i.title).join(", ")}
                  </p>

                  {order.delivery === "pickup" ? (
                    <span className="order-status-pill pickup">Self pickup — coordinate with seller</span>
                  ) : (
                    <div className="order-track">
                      {STAGES.map((stage, i) => (
                        <div key={stage} className={"track-step" + (i <= stageIndex ? " done" : "")}>
                          <span className="track-dot" />
                          <span className="track-label">{stage}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
