'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import CartSidebar, { CartItem } from '@/components/CartSidebar';
import Footer from '@/components/Footer';
import CustomerLoginPage from '@/app/login/page';
import { MENU, Product } from '@/lib/data';
import { t as translate, type Language } from '@/lib/i18n';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('special');
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');

  const cartCount = Object.values(cart).reduce((a, b) => a + b.qty, 0);

  const t = (key: string) => translate(language, key);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setSearchValue('');
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev[product.name];
      if (existing) {
        return {
          ...prev,
          [product.name]: { ...existing, ...product, qty: existing.qty + 1 },
        };
      }
      return {
        ...prev,
        [product.name]: { ...product, qty: 1 },
      };
    });
  };

  const updateQty = (name: string, delta: number) => {
    setCart((prev) => {
      const item = prev[name];
      if (!item) return prev;
      const newQty = Math.max(0, item.qty + delta);
      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }
      return {
        ...prev,
        [name]: { ...item, qty: newQty },
      };
    });
  };

  const normalizedQuery = searchValue.trim().toLowerCase();
  const products = MENU[activeCategory] ?? [];
  const filteredProducts =
    normalizedQuery.length === 0
      ? products
      : products.filter((p) => {
          const haystack = `${p.name} ${p.desc}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });

  return (
    <>
      <CustomerLoginPage />
      <main>
        <Header
          cartCount={cartCount}
          onToggleCart={() => setIsCartOpen(!isCartOpen)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          language={language}
          onToggleLanguage={() =>
            setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'))
          }
          t={t}
        />
        <Banner />
        <CategoryBar
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          t={t}
        />
        <div className="page-body">
          <div className="main-content">
            <h2 className="section-title">
              {t(`categoryTitle.${activeCategory}`)}
            </h2>
            <div className="product-grid">
              {filteredProducts.map((item, i) => (
                <ProductCard key={i} product={item} onAdd={addToCart} />
              ))}
            </div>
            {normalizedQuery.length > 0 && filteredProducts.length === 0 && (
              <div style={{ marginTop: 14, color: 'var(--g)', fontSize: 13 }}>
                {t('search.noResultsPrefix')} “{searchValue.trim()}”.
              </div>
            )}
          </div>

          {isCartOpen && (
            <CartSidebar
              cart={cart}
              onUpdateQty={updateQty}
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              t={t}
            />
          )}
        </div>
      </main>
      <Footer onSelectCategory={handleCategorySelect} />
    </>
  );
}
