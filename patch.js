// Auto-patcher for CampusCart — adds Stationery Shop to App.jsx
// Run with: node patch.js

const fs = require("fs");
const path = require("path");

const appPath = path.join(__dirname, "src", "App.jsx");
const cssPath = path.join(__dirname, "src", "index.css");
const stateryCssPath = path.join(__dirname, "src", "stationery.css");

let app = fs.readFileSync(appPath, "utf8");

// 1. Add StationeryShop import if not already there
if (!app.includes("StationeryShop")) {
  app = app.replace(
    `import "./stationery.css";`,
    ``
  );
  app = app.replace(
    `import React`,
    `import StationeryShop from "./components/StationeryShop";\nimport "./stationery.css";\nimport React`
  );
  console.log("✅ Added StationeryShop import");
} else {
  console.log("⏭ StationeryShop import already exists");
}

// 2. Add showStationery state if not already there
if (!app.includes("showStationery")) {
  app = app.replace(
    `const [showSupport, setShowSupport] = useState(false);`,
    `const [showSupport, setShowSupport] = useState(false);\n  const [showStationery, setShowStationery] = useState(false);`
  );
  console.log("✅ Added showStationery state");
} else {
  console.log("⏭ showStationery state already exists");
}

// 3. Add Stationery button to CategoryRow area - add after hero section
if (!app.includes("setShowStationery(true)")) {
  app = app.replace(
    `<BannerSlider setActiveCat={setActiveCat} />`,
    `<BannerSlider setActiveCat={setActiveCat} />
      <div className="stationery-bar">
        <button className="stationery-shortcut" onClick={() => setShowStationery(true)}>
          <span>🖨</span>
          <div>
            <strong>Stationery Shop</strong>
            <span>Buy items · Print · Xerox · Get PIN</span>
          </div>
          <span className="stationery-arrow">→</span>
        </button>
      </div>`
  );
  console.log("✅ Added Stationery Shop button");
} else {
  console.log("⏭ Stationery button already exists");
}

// 4. Add StationeryShop modal render before closing div
if (!app.includes("<StationeryShop")) {
  app = app.replace(
    `{showSupport && <SupportModal onClose={() => setShowSupport(false)} />}`,
    `{showSupport && <SupportModal onClose={() => setShowSupport(false)} />}

      {showStationery && <StationeryShop onClose={() => setShowStationery(false)} />`
  );
  // Close the conditional
  app = app.replace(
    `{showStationery && <StationeryShop onClose={() => setShowStationery(false)} />`,
    `{showStationery && <StationeryShop onClose={() => setShowStationery(false)} />}`
  );
  console.log("✅ Added StationeryShop modal render");
} else {
  console.log("⏭ StationeryShop modal already exists");
}

fs.writeFileSync(appPath, app, "utf8");
console.log("\n🎉 App.jsx patched successfully!");

// 5. Add stationery bar CSS to index.css
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes("stationery-bar")) {
  css += `
.stationery-bar {
  margin-bottom: 20px;
}
.stationery-shortcut {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 18px;
  background: linear-gradient(135deg, var(--teal-deep), #1a9b7a);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  color: #fff;
  text-align: left;
}
.stationery-shortcut span:first-child { font-size: 28px; }
.stationery-shortcut div { flex: 1; }
.stationery-shortcut strong { display: block; font-size: 15px; font-weight: 600; }
.stationery-shortcut div span { font-size: 12px; opacity: 0.85; }
.stationery-arrow { font-size: 20px; opacity: 0.8; }
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("✅ Added stationery CSS");
} else {
  console.log("⏭ Stationery CSS already exists");
}

console.log("\n✅ All done! Now run: git add . && git commit -m 'Add stationery shop' && git push");
