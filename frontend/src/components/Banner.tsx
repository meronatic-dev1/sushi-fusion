'use client';

import React, { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function Banner() {
  const { settings } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);

  // Normalize slides
  const rawUrls = settings.bannerUrls && settings.bannerUrls.length > 0
    ? settings.bannerUrls
    : settings.bannerUrl ? [settings.bannerUrl] : [];
    
  const slides = rawUrls
    .filter(url => !!url && !url.includes('banner-1.png'))
    .map(url => ({ src: url, alt: 'Store Banner' }));

  useEffect(() => {
    if (slides.length <= 1) return;
    
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="banner">
        <div className="banner-inner">
          <img
            src="/images/banner-1.png"
            alt="Sushi Fusion"
            className="banner-image"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="banner">
      <div className="banner-inner">
        {/* Spacer image to define natural height on mobile */}
        {slides[0] && (
          <img
            src={slides[0].src}
            alt=""
            className="banner-spacer"
            aria-hidden="true"
          />
        )}
        {slides.map((slide, index) => (
          <img
            key={slide.src + index}
            src={slide.src}
            alt={slide.alt}
            className="banner-image"
            style={{
              opacity: index === activeIndex ? 1 : 0,
              zIndex: index === activeIndex ? 2 : 1
            }}
          />
        ))}
        
        {slides.length > 1 && (
          <div className="banner-dots" style={{ zIndex: 10 }}>
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
        )}
      </div>
    </section>
  );
}