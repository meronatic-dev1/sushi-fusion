'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data';

interface FooterProps {
  onSelectCategory?: (id: string) => void;
}

export default function Footer({ onSelectCategory }: FooterProps) {
  const year = new Date().getFullYear();
  const mid = Math.ceil(CATEGORIES.length / 2);
  const menuCol1 = CATEGORIES.slice(0, mid);
  const menuCol2 = CATEGORIES.slice(mid);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-divider footer-divider-top" />
        <div className="footer-logo-wrap">
          <div className="footer-logo">
            <img src="/sushi-fusion-logo.png" alt="Sushi Fusion" />
          </div>
        </div>
        <div className="footer-divider footer-divider-bottom" />

        <div className="footer-columns">
          <div className="footer-col footer-col-menu">
            <h4 className="footer-heading">MENU</h4>
            <div className="footer-menu-grid">
              <ul>
                {menuCol1.map((c) => (
                  <li key={c.id}>
                    <a
                      href="#menu"
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectCategory?.(c.id);
                      }}
                    >
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
              <ul>
                {menuCol2.map((c) => (
                  <li key={c.id}>
                    <a
                      href="#menu"
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectCategory?.(c.id);
                      }}
                    >
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">CUSTOMER SERVICE</h4>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faqs">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">MY ACCOUNT</h4>
            <ul>
              <li><a href="#signin">Sign In</a></li>
              <li><a href="#create">Create Your Account</a></li>
              <li><a href="#account">My Account</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">LEARN MORE</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">ABOUT US</h4>
            <ul>
              <li><a href="#locations">Store Locations</a></li>
              <li><a href="#about">About us</a></li>
            </ul>
            <div className="footer-locations-inline">
              <span>Business Bay · Jumeirah Village Circle</span>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">FOLLOW US</h4>
            <div className="footer-social">
              <a href="#fb" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#ig" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#tw" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            <div className="footer-apps">
              <a href="#appstore" className="footer-app-badge">
                <span className="footer-app-label">Download on the</span>
                <span className="footer-app-name">App Store</span>
              </a>
              <a href="#playstore" className="footer-app-badge">
                <span className="footer-app-label">GET IT ON</span>
                <span className="footer-app-name">Google Play</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            Delivery areas, charges and minimum purchase requirements may vary. Please check availability at your location.
          </p>
          <p className="footer-trademarks">
            ©{year} Sushi Fusion. All rights reserved. The Sushi Fusion name, logos and related marks are trademarks of Sushi Fusion.
          </p>
        </div>
      </div>
    </footer>
  );
}
