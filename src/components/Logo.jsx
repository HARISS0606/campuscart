import React from "react";

export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" aria-label="CampusCart logo">
      <rect width="140" height="140" rx="28" fill="#0f6e56"/>
      <path d="M45 55 h50 l-8 50 a8 8 0 0 1 -8 7 h-18 a8 8 0 0 1 -8 -7 z" fill="none" stroke="#ffffff" stroke-width="6" stroke-linejoin="round"/>
      <path d="M57 55 v-8 a23 23 0 0 1 46 0 v8" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
      <path d="M80 82 c-14 0 -20 10 -20 20 c0 9 7 16 16 16 c10 0 18 -9 18 -20 c0 -8 -5 -14 -10 -16 z" fill="#d85a30"/>
      <path d="M80 82 c4 -10 12 -16 22 -18" fill="none" stroke="#d85a30" stroke-width="4" stroke-linecap="round"/>
    </svg>
  );
}
