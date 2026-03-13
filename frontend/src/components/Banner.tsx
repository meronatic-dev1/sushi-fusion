'use client';

import React, { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsContext';

const SLIDES = [
  { src: '/images/banner (1).png', alt: 'Sushi Fusion chef specials' },
  { src: '/images/banner (2).png', alt: 'Sushi Fusion platter selection' },
  { src: '/images/banner (3).png', alt: 'Sushi Fusion seasonal offers' },
];

export default function Banner() {
  const { settings } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides =
    settings.bannerUrl && !settings.bannerUrl.includes('banner-1.png')
      ? [{ src: settings.bannerUrl, alt: 'Custom Store Banner' }, ...SLIDES]
      : SLIDES;

  useEffect(() => {
    const id = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => window.clearTimeout(id);
  }, [activeIndex, slides.length]);

  const slide = slides[activeIndex];

  return (
    <section className="banner">
      <div
        className="banner-inner"
      >
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="banner-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div className="banner-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`banner-dot ${index === activeIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}