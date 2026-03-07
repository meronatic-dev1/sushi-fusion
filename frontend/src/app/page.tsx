'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import { MENU, CATEGORIES as STATIC_CATEGORIES, type Product } from '@/lib/data';
import { t as translate, type Language } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';
import { getCategories, getMenuItems, getBestSellers, type ApiCategory, type ApiMenuItem } from '@/lib/api';

export default function Home() {
  const { cartCount, addToCart, setIsCartOpen } = useCart();
  const [searchValue, setSearchValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeBottomTab, setActiveBottomTab] = useState('menu');

  // Live data from API
  const [apiCategories, setApiCategories] = useState<{ id: string; name: string; imgSrc?: string }[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [usingApi, setUsingApi] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const t = (key: string) => translate(language, key);

  // Load live data from backend
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, items, topItems] = await Promise.all([
          getCategories(),
          getMenuItems(),
          getBestSellers()
        ]);
        if (cancelled) return;

        if (cats.length > 0) {
          const mappedProducts = items
            .filter(m => m.isAvailable)
            .map(m => ({
              id: m.id,
              name: m.name,
              desc: m.description || '',
              price: m.price,
              emoji: '🍣',
              imgSrc: m.imageUrl || undefined,
              _categoryId: m.categoryId,
              _categoryName: m.category?.name || '',
            } as Product & { _categoryId: string; _categoryName: string }));

          setApiProducts(mappedProducts);

          const mappedBestSellers = topItems.map(m => ({
            id: m.id,
            name: m.name,
            desc: m.description || '',
            price: m.price,
            emoji: '🔥',
            imgSrc: m.imageUrl || undefined,
            _categoryId: 'best-sellers',
            _categoryName: 'Best Sellers',
          } as Product));

          setBestSellers(mappedBestSellers);

          const virtualCats = [
            ...(mappedBestSellers.length > 0 ? [{ id: 'best-sellers', name: 'Best Sellers', emoji: '🔥' }] : []),
            ...cats.map(c => ({ id: c.id, name: c.name, imgSrc: c.imageUrl || undefined }))
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

  // Compute displayed products
  let products: Product[] = [];
  const normalizedQuery = searchValue.trim().toLowerCase();

  if (usingApi) {
    if (normalizedQuery.length > 0) {
      products = apiProducts.filter(p => {
        const haystack = `${p.name} ${p.desc}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    } else if (activeCategory === 'best-sellers') {
      products = bestSellers;
    } else {
      products = apiProducts.filter(p => (p as any)._categoryId === activeCategory);
    }
  } else {
    if (normalizedQuery.length > 0) {
      products = Object.values(MENU).flat().filter(p => {
        const haystack = `${p.name} ${p.desc}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    } else {
      products = MENU[activeCategory] || [];
    }
  }

  // Build categories array for CategoryBar
  const displayCategories = usingApi
    ? apiCategories.map((c: any) => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji || '🍽️',
      imgSrc: c.imgSrc
    }))
    : STATIC_CATEGORIES;

  const handleBottomTabChange = (tab: string) => {
    setActiveBottomTab(tab);
    if (tab === 'beverages') {
      // Find beverages category
      const bev = displayCategories.find(c => c.name.toLowerCase().includes('beverage'));
      if (bev) setActiveCategory(bev.id);
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

        <CategoryBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          t={t}
          categories={displayCategories}
        />

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

            {loaded && products.length === 0 && (
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