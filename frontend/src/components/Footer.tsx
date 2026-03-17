'use client';

import React from 'react';

interface FooterProps {
  onSelectCategory?: (id: string) => void;
}

const INFO_ITEMS = [
  { icon: '/images/icons/delivery.png', text: 'Express Delivery · 30 mins or less' },
  { icon: '/images/location.png', text: 'JVC & Business Bay' },
  { icon: '/images/icons/phone.png', text: '055 289 8253 · 04 398 5091' },
  { icon: '/images/icons/clock.png', text: 'Open daily · 11 AM – 11 PM' },
];

const SOCIAL = [
  {
    label: 'Facebook',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'X',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
];

const COLUMNS = [
  {
    heading: 'CUSTOMER SERVICE',
    links: ['Contact Us', 'FAQs', 'Track Order'],
  },
  {
    heading: 'MY ACCOUNT',
    links: ['Sign In', 'Create Account', 'My Orders'],
  },
  {
    heading: 'LEGAL',
    links: ['Privacy Policy', 'Cookie Policy', 'Terms & Conditions'],
  },
  {
    heading: 'ABOUT US',
    links: ['Our Locations', 'About Sushi Fusion', 'Careers'],
    note: 'JVC: Plaza Residence 2 (055 289 8253 / 04 552 9366) · Business Bay: Ontario Tower (04 398 5091)',
  },
];

export default function Footer({ onSelectCategory }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#FF6A0C', color: '#fff', fontSize: 13 }}>

      {/* ── Info strip ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px 40px',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
      }}>
        {INFO_ITEMS.map((item) => (
          <div key={item.text} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 600,
          }}>
            <img src={item.icon} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 18px' }}>
          <div style={{
            width: 62, height: 62, borderRadius: '50%', overflow: 'hidden',
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}>
            <img
              src="/sushi-fusion-logo.png"
              alt="Sushi Fusion"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.22)', marginBottom: 28 }} />

        {/* ── 5 equal columns: 4 link cols + 1 social col ── */}
        <div className="footer-columns" style={{
          alignItems: 'start',
          marginBottom: 28,
        }}>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p style={{
                fontSize: 11, fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#fff', marginBottom: 14,
                fontFamily: 'Mashiro, sans-serif',
              }}>
                {col.heading}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {col.links.map((item) => (
                  <li key={item}>
                    <a href="#" style={{
                      color: 'rgba(255,255,255,0.85)',
                      textDecoration: 'none',
                      fontSize: 13,
                      display: 'block',
                      marginBottom: 9,
                      lineHeight: 1.4,
                    }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              {col.note && (
                <p style={{
                  fontSize: 11, color: 'rgba(255,255,255,0.65)',
                  marginTop: 6, lineHeight: 1.6,
                }}>
                  {col.note}
                </p>
              )}
            </div>
          ))}

          {/* Follow Us */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#fff', marginBottom: 14,
              fontFamily: 'Mashiro, sans-serif',
            }}>
              FOLLOW US
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.3)', color: '#fff',
                    textDecoration: 'none', flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 18 }} />

        {/* Copyright */}
        <div style={{ textAlign: 'center', paddingBottom: 24 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 5, lineHeight: 1.5 }}>
            Delivery areas, charges and minimum purchase requirements may vary. Please check availability at your location.
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            ©{year} Sushi Fusion. All rights reserved. The Sushi Fusion name, logos and related marks are trademarks of Sushi Fusion.
          </p>
        </div>
      </div>

    </footer>
  );
}