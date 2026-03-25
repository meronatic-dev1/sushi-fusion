'use client';

import React, { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function Banner() {
  const { settings } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);

  // Normalize slides: Use bannerUrls if available, fallback to bannerUrl
  const rawUrls = settings.bannerUrls && settings.bannerUrls.length > 0
    ? settings.bannerUrls
    : settings.bannerUrl ? [settings.bannerUrl] : [];
    
  // Filter out empty strings and potential default placeholders
  const slides = rawUrls
    .filter(url => !!url && !url.includes('banner-1.png'))
    .map(url => ({ src: url, alt: 'Store Banner' }));

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) {
    // Fallback if no banners are set yet
    return (
      <section className="banner">
        <div className="banner-inner">
          <img
            src="/images/banner-1.png"
            alt="Sushi Fusion"
            className="banner-image"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="banner">
      <div className="banner-inner" style={{ position: 'relative', overflow: 'hidden' }}>
        {slides.map((slide, index) => (
          <img
            key={slide.src + index}
            src={slide.src}
            alt={slide.alt}
            className="banner-image"
            style={{
              width: '100%',
              display: 'block',
              position: isMobile
                ? (index === activeIndex ? 'relative' : 'absolute')
                : (index === 0 ? 'relative' : 'absolute'),
              top: 0,
              left: 0,
              opacity: index === activeIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
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