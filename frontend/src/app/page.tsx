'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Star } from 'lucide-react';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import { MENU, CATEGORIES as STATIC_CATEGORIES, type Product } from '@/lib/data';
import { t as translate, type Language } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';
import { getCategories, getMenuItems, getBestSellers } from '@/lib/api';

/* ─── Static content ────────────────────────────────────────────── */

const REVIEWS = [
  {
    name: 'Layla A.',
    location: 'Dubai Marina',
    text: 'Absolutely the best sushi in Dubai! Fresh, beautifully presented and delivered in under 30 minutes. My weekly go-to.',
    initials: 'LA',
    stars: 5,
  },
  {
    name: 'Mohammed K.',
    location: 'Business Bay',
    text: 'The Dragon Roll is out of this world. Premium quality ingredients and packaging that keeps everything perfectly fresh.',
    initials: 'MK',
    stars: 5,
  },
  {
    name: 'Sara P.',
    location: 'JVC',
    text: 'Ordered the Omakase Set for a dinner party and everyone was blown away. Restaurant-quality sushi, delivered to your door.',
    initials: 'SP',
    stars: 5,
  },
];

/* ─── Helpers ───────────────────────────────────────────────────── */

function WaveDivider({ from, to }: { from: string; to: string }) {
  return (
    <div style={{ background: from, lineHeight: 0, display: 'block', marginBottom: -1 }}>
      <svg
        viewBox="0 0 1440 64"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: 64 }}
      >
        <path
          d="M0,32 C240,64 480,0 720,32 C960,64 1200,8 1440,32 L1440,64 L0,64 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={16} fill="#FFB800" stroke="none" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#FFF8F2',
        borderRadius: 20,
        padding: '28px 24px',
        border: `1px solid ${hov ? 'rgba(255,106,12,0.3)' : 'rgba(255,106,12,0.1)'}`,
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? '0 16px 40px rgba(255,106,12,0.12)' : 'none',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ fontSize: 40, color: '#FF6A0C', lineHeight: 1, marginBottom: 10, fontFamily: 'Georgia, serif' }}>"</div>
      <Stars count={review.stars} />
      <p style={{ fontSize: 14, color: '#1c1c1c', lineHeight: 1.65, marginBottom: 20 }}>
        {review.text}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#FF6A0C,#FF8C42)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff',
        }}>
          {review.initials}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c' }}>{review.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{review.location}</div>
        </div>
      </div>
    </div>
  );
}

function PromoBanner() {
  const [btnHov, setBtnHov] = useState(false);
  return (
    <section style={{
      background: '#1c1c1c',
      padding: '64px 24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,106,12,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span style={{
          display: 'inline-block', background: '#FF6A0C', color: '#fff',
          fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '5px 14px',
          borderRadius: 100, marginBottom: 18,
        }}>
          Limited Time Offer
        </span>
        <h2 style={{
          fontFamily: 'Mashiro, sans-serif',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 800, color: '#fff', marginBottom: 14,
        }}>
          Experience Premium<br />
          <span style={{ color: '#FF8C42' }}>Japanese Sushi</span>
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
          25% off on any items. Use code{' '}
          <strong style={{ color: '#fff' }}>FUSIONFUN</strong> at checkout.
        </p>
        <a
          href="#menu"
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '15px 36px',
            background: 'linear-gradient(135deg,#FF6A0C,#FF8C42)',
            color: '#fff', border: 'none', borderRadius: 100,
            fontSize: 16, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', textDecoration: 'none',
            boxShadow: btnHov ? '0 10px 32px rgba(255,106,12,0.6)' : '0 6px 24px rgba(255,106,12,0.5)',
            transform: btnHov ? 'translateY(-2px)' : 'none',
            transition: 'all 0.25s',
          }}
        >
          Order Now — It's Worth It
        </a>
      </div>
    </section>
  );
}

/* ── Our Story section ─────────────────────────────────────────── */
function OurStory() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 520,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px',
      }}
    >
      {/* Full-bleed background image */}
      <img
        src="/images/our-story-bg.png"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          zIndex: 0,
        }}
        onError={(e) => {
          /* fallback: soft cream bg if image missing */
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Soft overlay so text stays readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,250,245,0.55)',
          zIndex: 1,
        }}
      />

      {/* Content card */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 560,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Logo badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%', overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '3px solid rgba(255,106,12,0.25)',
            background: '#fff',
          }}>
            <img
              src="/sushi-fusion-logo.png"
              alt="Sushi Fusion"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'Mashiro, sans-serif',
          fontSize: 'clamp(26px, 3vw, 38px)',
          fontWeight: 800,
          color: '#1c1c1c',
          marginBottom: 20,
          lineHeight: 1.15,
        }}>
          Our Story
        </h2>

        {/* Body text */}
        <p style={{
          fontSize: 15,
          color: '#2a2a2a',
          lineHeight: 1.8,
          marginBottom: 16,
        }}>
          With over 18 years of experience perfecting Japanese cuisine across Japan, Malaysia,
          Singapore, Thailand, India, and Nepal, Chef Gyanendra Jang Thapa — the heart and soul
          behind Sushi Fusion — brings his lifelong passion to Dubai.
        </p>
        <p style={{
          fontSize: 15,
          color: '#2a2a2a',
          lineHeight: 1.8,
          marginBottom: 16,
        }}>
          In 2023, he turned his dream into reality by creating Sushi Fusion, a place where
          tradition meets creativity. Inspired by Dubai's rich mix of cultures, his vision was
          to craft sushi that speaks to everyone — familiar yet exciting, authentic yet
          refreshingly new.
        </p>
        <p style={{
          fontSize: 15,
          color: '#2a2a2a',
          lineHeight: 1.8,
        }}>
          At Sushi Fusion, every roll carries a story — of a chef's journey across borders,
          of flavors from around the world, and of a love for food that connects people beyond
          culture and language.
        </p>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function Home() {
  const { cartCount, addToCart, setIsCartOpen } = useCart();
  const [searchValue, setSearchValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeBottomTab, setActiveBottomTab] = useState('menu');

  const [apiCategories, setApiCategories] = useState<{ id: string; name: string; imgSrc?: string }[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [usingApi, setUsingApi] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const t = (key: string) => translate(language, key);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, items, topItems] = await Promise.all([
          getCategories(), getMenuItems(), getBestSellers(),
        ]);
        if (cancelled) return;
        if (cats.length > 0) {
          const mappedProducts = items.filter((m) => m.isAvailable).map((m) => ({
            id: m.id, name: m.name, desc: m.description || '',
            price: m.price, emoji: 'fire', imgSrc: m.imageUrl || undefined,
            _categoryId: m.categoryId, _categoryName: m.category?.name || '',
          } as Product & { _categoryId: string; _categoryName: string }));
          setApiProducts(mappedProducts);

          const mappedBestSellers = topItems.map((m) => ({
            id: m.id, name: m.name, desc: m.description || '',
            price: m.price, emoji: 'fire', imgSrc: m.imageUrl || undefined,
            _categoryId: 'best-sellers', _categoryName: 'Best Sellers',
          } as Product));
          setBestSellers(mappedBestSellers);

          const virtualCats = [
            ...(mappedBestSellers.length > 0
              ? [{ id: 'best-sellers', name: 'Best Sellers', emoji: 'fire' }]
              : []),
            ...cats.map((c) => ({ id: c.id, name: c.name, imgSrc: c.imageUrl || undefined })),
          ];
          setApiCategories(virtualCats);
          setActiveCategory(virtualCats[0]?.id || '');
          setUsingApi(true);
        }
      } catch (err) {
        console.error('API Error:', err);
        setActiveCategory('special');
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const q = searchValue.trim().toLowerCase();
  let products: Product[] = [];
  if (usingApi) {
    if (q) products = apiProducts.filter((p) => `${p.name} ${p.desc}`.toLowerCase().includes(q));
    else if (activeCategory === 'best-sellers') products = bestSellers;
    else products = apiProducts.filter((p) => (p as any)._categoryId === activeCategory);
  } else {
    products = q
      ? Object.values(MENU).flat().filter((p) => `${p.name} ${p.desc}`.toLowerCase().includes(q))
      : MENU[activeCategory] || [];
  }

  const displayCategories = usingApi
    ? apiCategories.map((c: any) => ({ id: c.id, name: c.name, emoji: c.emoji || 'utensils', imgSrc: c.imgSrc }))
    : STATIC_CATEGORIES;

  const handleBottomTabChange = (tab: string) => {
    setActiveBottomTab(tab);
    if (tab === 'search') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        const input = document.getElementById('mobile-search-input');
        if (input) (input as HTMLInputElement).focus();
      }, 300);
    }
  };

  const ORANGE = '#FFF8F2';
  const WHITE = '#ffffff';
  const DARK = '#1c1c1c';
  const STORY_BG = '#fdf6ee'; /* warm cream — matches the illustration's paper tone */

  return (
    <>
      <main>

        {/* ── 1. HEADER ── */}
        <Header
          cartCount={cartCount}
          onToggleCart={() => setIsCartOpen(true)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          language={language}
          onToggleLanguage={() => setLanguage((p) => (p === 'en' ? 'ar' : 'en'))}
          t={t}
        />

        {/* ── 2. BANNER ── */}
        <Banner />

        {/* ── 3. CATEGORY BAR + PRODUCTS ── */}
        <div id="menu" style={{ background: ORANGE }}>
          <CategoryBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            t={t}
            categories={displayCategories}
          />

          <div className="page-body">
            <div className="main-content" style={{ padding: '28px 24px 56px' }}>
              <div
                className="product-grid"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}
              >
                {products.map((item, i) => (
                  <ProductCard key={i} product={item} onAdd={addToCart} />
                ))}
              </div>

              {loaded && products.length === 0 && (
                <div style={{
                  marginTop: 40, textAlign: 'center', color: 'var(--g)',
                  fontSize: 15, padding: 40, background: WHITE,
                  borderRadius: 16, border: '1px solid var(--b)',
                }}>
                  {q
                    ? <>{t('search.noResultsPrefix')} "{searchValue.trim()}"</>
                    : 'No products available.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* wave: light-orange → story cream */}
        <WaveDivider from={ORANGE} to={STORY_BG} />

        {/* ── 4. OUR STORY ── */}
        <OurStory />

        {/* wave: story cream → dark */}
        <WaveDivider from={STORY_BG} to={DARK} />

        {/* ── 5. PROMO BANNER ── */}
        <PromoBanner />

        {/* wave: dark → white */}
        <WaveDivider from={DARK} to={WHITE} />

        {/* ── 6. REVIEWS ── */}
        <section style={{ background: WHITE, padding: '72px 24px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#FF6A0C', marginBottom: 10,
              }}>
                What Our Customers Say
              </span>
              <h2 style={{
                fontFamily: 'Mashiro, sans-serif',
                fontSize: 'clamp(26px, 3vw, 40px)',
                fontWeight: 800, color: '#1c1c1c', marginBottom: 10,
              }}>
                Loved by Dubai
              </h2>
              <p style={{ fontSize: 15, color: '#666' }}>
                Real reviews from real sushi lovers.
              </p>
            </div>
            <div>
              <div className="elfsight-app-d391b8e6-9041-4d6e-9ba7-64eaaa3d7912" data-elfsight-app-lazy></div>
              <Script src="https://elfsightcdn.com/platform.js" async />
            </div>
          </div>
        </section>

      </main>

      {/* ── 7. FOOTER ── */}
      <Footer onSelectCategory={setActiveCategory} />

      <BottomNav
        activeTab={activeBottomTab}
        onTabChange={handleBottomTabChange}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />
    </>
  );
}