import React, { useState, useEffect } from "react";

const BANNERS = [
  { bg: "#0f6e56", title: "End of semester sale!", sub: "Seniors clearing out — grab textbooks before they're gone.", cta: "Shop Books", cat: "Books" },
  { bg: "#08362b", title: "Need a cycle on campus?", sub: "Affordable second-hand cycles from verified sellers.", cta: "Browse Cycles", cat: "Cycles" },
  { bg: "#ba7517", title: "Hostel setup sorted.", sub: "Study tables, chairs, mini fridges — everything for your room.", cta: "Shop Furniture", cat: "Furniture" },
  { bg: "#d85a30", title: "Project season is here.", sub: "Buy or sell lab reports, assignments & complete projects.", cta: "See Projects", cat: "Projects" },
];

export default function BannerSlider({ setActiveCat }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = BANNERS[active];

  return (
    <div className="banner-slider" style={{ background: b.bg }}>
      <div className="banner-content">
        <h2 className="banner-title">{b.title}</h2>
        <p className="banner-sub">{b.sub}</p>
        <button className="banner-cta" onClick={() => setActiveCat(b.cat)}>
          {b.cta} →
        </button>
      </div>
      <div className="banner-dots">
        {BANNERS.map((_, i) => (
          <span
            key={i}
            className={"banner-dot" + (i === active ? " active" : "")}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}
