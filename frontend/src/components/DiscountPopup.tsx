'use client';

import { useState, useEffect } from 'react';

export default function DiscountPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('discount_popup_shown')) return;

    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem('discount_popup_shown', '1');
  };

  if (!visible) return null;

  return (
    <div className="discount-popup-overlay" onClick={close}>
      <div
        className="discount-popup-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green percentage badge */}
        <div className="discount-popup-badge">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Starburst / badge shape */}
            <path
              d="M32 2
                 L37.5 10.5 L46.5 6 L46.5 16 L56.5 16 L52 25
                 L62 30 L54.5 37 L60 46 L50 46 L50 56
                 L41 52 L36.5 62 L32 53 L27.5 62 L23 52
                 L14 56 L14 46 L4 46 L9.5 37 L2 30
                 L12 25 L7.5 16 L17.5 16 L17.5 6 L26.5 10.5 Z"
              fill="#16a34a"
            />
            {/* Percent symbol */}
            <circle cx="24" cy="26" r="4.5" fill="none" stroke="white" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="4.5" fill="none" stroke="white" strokeWidth="2.5" />
            <line x1="42" y1="22" x2="22" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="discount-popup-title">A discount for you</h2>
        <p className="discount-popup-text">Enjoy 20% OFF on your order!</p>

        <button className="discount-popup-btn" onClick={close}>
          Ok
        </button>
      </div>
    </div>
  );
}
