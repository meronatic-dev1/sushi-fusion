'use client';

import React, { useEffect, useState } from 'react';

const SLIDES = [
  {
    src: '/images/banner (1).png',
    alt: 'Sushi Fusion chef specials',
  },
  {
    src: '/images/banner (2).png',
    alt: 'Sushi Fusion platter selection',
  },
  {
    src: '/images/banner (3).png',
    alt: 'Sushi Fusion seasonal offers',
  },
];

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 10000);

    return () => window.clearTimeout(id);
  }, [activeIndex]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const slide = SLIDES[activeIndex];

  return (
    <section className="banner">
      <div className="banner-inner">
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="banner-image"
        />
        <div className="banner-dots">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`banner-dot ${index === activeIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

