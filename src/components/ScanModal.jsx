import React, { useEffect, useRef, useState } from "react";

// Live camera barcode/QR scanner using the browser's built-in BarcodeDetector
// (supported in Chrome/Edge on desktop & Android). Falls back to manual entry
// on browsers without support (e.g. Safari/iOS) instead of failing silently.
export default function ScanModal({ onClose, onResult }) {
  const videoRef = useRef(null);
  const [supported, setSupported] = useState(true);
  const [manual, setManual] = useState("");
  const [status, setStatus] = useState("Point your camera at a barcode or QR code");

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      setSupported(false);
      return;
    }

    let stream;
    let stop = false;
    const detector = new window.BarcodeDetector({
      formats: ["qr_code", "ean_13", "ean_8", "code_128", "upc_a"],
    });

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
        const scanLoop = async () => {
          if (stop || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0) {
              setStatus("Found: " + codes[0].rawValue);
              onResult(codes[0].rawValue);
              return;
            }
          } catch (e) {
            // detection errors are common on empty frames, ignore and retry
          }
          requestAnimationFrame(scanLoop);
        };
        scanLoop();
      })
      .catch(() => setSupported(false));

    return () => {
      stop = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [onResult]);

  function handleManualSubmit(e) {
    e.preventDefault();
    if (manual.trim()) onResult(manual.trim());
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <h3>Scan to search</h3>
          <button className="ghost-btn small" onClick={onClose}>✕</button>
        </div>

        {supported ? (
          <>
            <video ref={videoRef} className="scan-video" muted playsInline />
            <p className="chat-subtitle" style={{ marginTop: 8 }}>{status}</p>
          </>
        ) : (
          <>
            <p className="chat-subtitle">
              Live scanning isn't supported in this browser (works best in Chrome
              on Android or desktop). You can type a book ISBN or item code instead:
            </p>
            <form onSubmit={handleManualSubmit}>
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="e.g. ISBN or item keyword"
                autoFocus
              />
              <button type="submit" className="primary-btn" style={{ marginTop: 10 }}>
                Search
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
