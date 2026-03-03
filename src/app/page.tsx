'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import { MENU } from '@/lib/data';
import { t as translate, type Language } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const { cartCount, addToCart, setIsCartOpen } = useCart();
  const [searchValue, setSearchValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [activeCategory, setActiveCategory] = useState('special');
  const [activeBottomTab, setActiveBottomTab] = useState('menu');

  const t = (key: string) => translate(language, key);

  let products = MENU[activeCategory] || [];

  const normalizedQuery = searchValue.trim().toLowerCase();
  if (normalizedQuery.length > 0) {
    products = Object.values(MENU).flat().filter(p => {
      const haystack = `${p.name} ${p.desc}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }

  const handleBottomTabChange = (tab: string) => {
    setActiveBottomTab(tab);
    if (tab === 'beverages') {
      setActiveCategory('beverages');
    }
  };

  return (
    <>
      <main>
        <Header
          cartCount={cartCount}
          onToggleCart={() => setIsCartOpen(true)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          language={language}
          onToggleLanguage={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
          t={t}
        />

        <Banner />

        <CategoryBar activeCategory={activeCategory} onSelectCategory={setActiveCategory} t={t} />

        <div className="page-body">
          <div className="main-content" style={{ padding: '0 24px 40px' }}>
            <div className="product-grid" style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {products.map((item, i) => (
                <ProductCard key={i} product={item} onAdd={addToCart} />
              ))}
            </div>

            {products.length === 0 && (
              <div style={{ marginTop: 40, textAlign: 'center', color: 'var(--g)', fontSize: 15, padding: 40, background: 'var(--w)', borderRadius: 16, border: '1px solid var(--b)' }}>
                {normalizedQuery.length > 0
                  ? <>{t('search.noResultsPrefix')} "{searchValue.trim()}"</>
                  : 'No products available.'}
              </div>
            )}
          </div>
        </div>
      </main>
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