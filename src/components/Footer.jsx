import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4 className="footer-heading">ABOUT</h4>
          <a href="#" className="footer-link">Contact Us</a>
          <a href="#" className="footer-link">About CampusCart</a>
          <a href="#" className="footer-link">Careers</a>
          <a href="#" className="footer-link">Press</a>
          <a href="#" className="footer-link">Campus Stories</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">HELP</h4>
          <a href="#" className="footer-link">Payments</a>
          <a href="#" className="footer-link">Shipping & Pickup</a>
          <a href="#" className="footer-link">Cancellation & Returns</a>
          <a href="#" className="footer-link">FAQ</a>
          <a href="#" className="footer-link">Report a listing</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">CONSUMER POLICY</h4>
          <a href="#" className="footer-link">Terms of Use</a>
          <a href="#" className="footer-link">Security</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Sitemap</a>
          <a href="#" className="footer-link">Academic Integrity Policy</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">SOCIAL</h4>
          <a href="#" className="footer-link">📘 Facebook</a>
          <a href="#" className="footer-link">📸 Instagram</a>
          <a href="#" className="footer-link">🐦 Twitter / X</a>
          <a href="#" className="footer-link">▶️ YouTube</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">MAIL US</h4>
          <p className="footer-text">
            CampusCart Pvt. Ltd.<br />
            Campus Innovation Hub,<br />
            SRM Institute of Science & Technology,<br />
            Kattankulathur, Tamil Nadu 603203
          </p>
          <h4 className="footer-heading" style={{ marginTop: 12 }}>CONTACT</h4>
          <p className="footer-text">support@campuscart.in</p>
          <p className="footer-text">+91 98765 00000</p>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-mid">
        <a href="#" className="footer-mid-link">🏷 Become a Seller</a>
        <a href="#" className="footer-mid-link">📢 Advertise</a>
        <a href="#" className="footer-mid-link">🎁 Gift Cards</a>
        <a href="#" className="footer-mid-link">🎧 Help Centre</a>
        <span className="footer-copy">© 2026 CampusCart — Buy, Sell, Reuse</span>
      </div>

      <div className="footer-pay-row">
        <span className="footer-pay-label">Accepted payments:</span>
        {["UPI", "GPay", "PhonePe", "Paytm", "Visa", "Mastercard", "COD"].map((p) => (
          <span key={p} className="pay-pill">{p}</span>
        ))}
      </div>
    </footer>
  );
}
