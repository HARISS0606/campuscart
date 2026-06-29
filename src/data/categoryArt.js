// Simple inline SVG illustrations per category, used as a fallback "photo"
// when a seller hasn't uploaded a real image. Avoids hotlinking external
// stock photos (broken links / copyright risk) while still looking intentional.

export const categoryArt = {
  Books: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#e1f5ee"/><rect x="55" y="30" width="70" height="60" fill="#0f6e56" rx="3"/><rect x="68" y="24" width="70" height="60" fill="#16876a" rx="3"/><rect x="81" y="18" width="70" height="60" fill="#1a9b7a" rx="3"/><line x1="95" y1="30" x2="95" y2="66" stroke="#fff" stroke-width="2" opacity="0.5"/></svg>`,
  Cycles: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#e1f5ee"/><circle cx="65" cy="85" r="22" fill="none" stroke="#0f6e56" stroke-width="4"/><circle cx="140" cy="85" r="22" fill="none" stroke="#0f6e56" stroke-width="4"/><path d="M65 85 L100 45 L140 85 M100 45 L85 85 M110 45 L130 45" stroke="#0f6e56" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  Furniture: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#e1f5ee"/><rect x="50" y="50" width="100" height="10" fill="#0f6e56"/><rect x="55" y="60" width="8" height="35" fill="#0f6e56"/><rect x="137" y="60" width="8" height="35" fill="#0f6e56"/><rect x="80" y="20" width="40" height="30" fill="#1a9b7a" rx="2"/></svg>`,
  Electronics: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#e1f5ee"/><rect x="65" y="25" width="70" height="70" rx="6" fill="#0f6e56"/><rect x="75" y="35" width="50" height="35" rx="2" fill="#e1f5ee"/><circle cx="100" cy="82" r="4" fill="#e1f5ee"/></svg>`,
  Projects: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#e1f5ee"/><rect x="55" y="35" width="90" height="55" rx="4" fill="#0f6e56"/><path d="M65 50 h70 M65 62 h70 M65 74 h45" stroke="#e1f5ee" stroke-width="3" stroke-linecap="round"/><circle cx="140" cy="35" r="10" fill="#ba7517"/></svg>`,
  Other: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#e1f5ee"/><circle cx="100" cy="60" r="34" fill="#0f6e56"/><path d="M88 60 h24 M100 48 v24" stroke="#e1f5ee" stroke-width="5" stroke-linecap="round"/></svg>`,
};

export function getCategoryArt(category) {
  const svg = categoryArt[category] || categoryArt.Other;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
