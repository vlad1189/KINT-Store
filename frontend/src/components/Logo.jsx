import React from "react";

// KINT Store custom logo - Bold K with brand green first bar
// First vertical bar uses the site's brand green (#74b832), rest is black
export const Logo = ({ className = "h-12 w-12" }) => (
  <svg viewBox="0 0 100 100" className={className} aria-label="KINT Store">
    {/* K letter - larger, no circle */}
    {/* First vertical bar - BRAND GREEN (same as CTA buttons) */}
    <rect x="16" y="14" width="12" height="72" rx="3" fill="#74b832" />
    
    {/* Second vertical bar - BLACK */}
    <rect x="34" y="14" width="8" height="72" rx="3" fill="#111" />
    
    {/* Chevron part of K - BLACK */}
    <path
      d="M48 50 L82 18 L82 32 L64 50 L82 68 L82 82 Z"
      fill="#111"
    />
  </svg>
);

export default Logo;
