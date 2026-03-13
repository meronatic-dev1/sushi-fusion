'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data';

interface FooterProps {
  onSelectCategory?: (id: string) => void;
}

const INFO_ITEMS = [
  { icon: '🚀', text: 'Express Delivery · 30 mins or less' },
  { icon: '📍', text: 'Business Bay & Jumeirah Village Circle' },
  { icon: '📞', text: '+971 4 000 0000' },
  { icon: '🕐', text: 'Open daily · 11 AM – 11 PM' },
];

export default function Footer({ onSelectCategory }: FooterProps) {
  const year = new Date().getFullYear();
  const mid = Math.ceil(CATEGORIES.length / 2);
  const menuCol1 = CATEGORIES.slice(0, mid);
  const menuCol2 = CATEGORIES.slice(mid);

  const linkStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.92)',
    textDecoration: 'none',
    fontSize: 13,
    transition: 'color 0.2s',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <footer style={{ background: '#FF6A0C', color: '#fff', fontSize: 13, padding: '0 0 32px' }}>

      {/* ── Info strip ── */}
      <div style={{
        display: 'flex', gap: 32, alignItems: 'center',
        justifyContent: 'center', flexWrap: 'wrap',
        padding: '28px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.25)',
      }}>
        {INFO_ITEMS.map((item) => (
          <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 600 }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Logo ── */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '36px 0 28px' }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%', overflow: 'hidden',
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}>
            <img src="/sushi-fusion-logo.png" alt="Sushi Fusion" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.3)', marginBottom: 40 }} />

        {/* ── Columns ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '24px 32px',
          marginBottom: 40,
        }}>

          {/* Menu */}
          <div style={{ gridColumn: 'span 2' }}>
            <h4 className="footer-heading">MENU</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', marginTop: 4 }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {menuCol1.map((c) => (
                  <li key={c.id}>
                    <a href="#menu" style={linkStyle} onClick={(e) => { e.preventDefault(); onSelectCategory?.(c.id); }}>
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {menuCol2.map((c) => (
                  <li key={c.id}>
                    <a href="#menu" style={linkStyle} onClick={(e) => { e.preventDefault(); onSelectCategory?.(c.id); }}>
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="footer-heading">CUSTOMER SERVICE</h4>
            <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
              {['Contact Us', 'FAQs', 'Track Order'].map((t) => (
                <li key={t}><a href="#" style={linkStyle}>{t}</a></li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="footer-heading">MY ACCOUNT</h4>
            <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
              {['Sign In', 'Create Account', 'My Orders'].map((t) => (
                <li key={t}><a href="#" style={linkStyle}>{t}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-heading">LEGAL</h4>
            <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
              {['Privacy Policy', 'Cookie Policy', 'Terms & Conditions'].map((t) => (
                <li key={t}><a href="#" style={linkStyle}>{t}</a></li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="footer-heading">ABOUT US</h4>
            <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
              {['Our Locations', 'About Sushi Fusion', 'Careers'].map((t) => (
                <li key={t}><a href="#" style={linkStyle}>{t}</a></li>
              ))}
            </ul>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>
              Business Bay · Jumeirah Village Circle
            </p>
          </div>

          {/* Social + Apps */}
          <div>
            <h4 className="footer-heading">FOLLOW US</h4>
            <div style={{ display: 'flex', gap: 10, marginTop: 4, marginBottom: 14 }}>
              {/* Facebook */}
              <a href="#" aria-label="Facebook" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', color: '#fff', textDecoration: 'none' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', color: '#fff', textDecoration: 'none' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              {/* X */}
              <a href="#" aria-label="X" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', color: '#fff', textDecoration: 'none' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[{ label: 'Download on the', name: 'App Store' }, { label: 'GET IT ON', name: 'Google Play' }].map((app) => (
                <a key={app.name} href="#" style={{
                  display: 'inline-flex', flexDirection: 'column',
                  padding: '8px 14px', background: 'rgba(0,0,0,0.4)',
                  borderRadius: 4, color: '#fff', textDecoration: 'none',
                  maxWidth: 150,
                }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.02em' }}>{app.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{app.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom ── */}
        <div style={{
          textAlign: 'center', paddingTop: 28,
          borderTop: '1px solid rgba(255,255,255,0.3)',
        }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 6, lineHeight: 1.5 }}>
            Delivery areas, charges and minimum purchase requirements may vary. Please check availability at your location.
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
            ©{year} Sushi Fusion. All rights reserved. The Sushi Fusion name, logos and related marks are trademarks of Sushi Fusion.
          </p>
        </div>
      </div>
    </footer>
  );
}