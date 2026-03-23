'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import { MENU, type Product } from '@/lib/data';
import { t as translate, type Language } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';
import { getMenuItems } from '@/lib/api';

const DIETARY_DESCS: Record<string, string> = {
    'Vegan': 'Plant-based ingredients only. No dairy, eggs, or animal by-products.',
    'Spicy': 'Contains chili or hot spices. Please ask our staff for heat levels.',
    'Vegetarian': 'Meat-free ingredients. May contain dairy or eggs.',
    'Gluten-Free': 'Prepared without gluten-containing ingredients.',
    'Halal': 'Prepared according to Halal standards.',
};

export default function ProductClientPage({ id }: { id: string }) {
    const router = useRouter();
    const { cartCount, addToCart, setIsCartOpen } = useCart();

    const [searchValue, setSearchValue] = useState('');
    const [language, setLanguage] = useState<Language>('en');
    const [activeBottomTab, setActiveBottomTab] = useState('menu');
    const [isAdded, setIsAdded] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const t = (key: string) => translate(language, key);

    // Try to load from API first, then fall back to static data
    const decodedName = decodeURIComponent(id);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const items = await getMenuItems();
                const apiItem = items.find(m => m.name === decodedName);
                if (!cancelled && apiItem) {
                    setProduct({
                        name: apiItem.name,
                        desc: apiItem.description || '',
                        price: apiItem.price,
                        emoji: 'fire',
                        imgSrc: apiItem.imageUrl || undefined,
                        dietary: apiItem.dietary || [],
                        allergens: apiItem.allergens || [],
                        inclusions: apiItem.inclusions || [],
                    });
                    setLoading(false);
                    return;
                }
            } catch { /* API unavailable */ }
            // Fallback to static data
            if (!cancelled) {
                const allProducts = Object.values(MENU).flat();
                const found = allProducts.find(p => p.name === decodedName) || null;
                setProduct(found);
                setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [decodedName]);

    const handleBottomTabChange = (tab: string) => {
        setActiveBottomTab(tab);
        if (tab === 'menu') router.push('/');
    };

    if (!product) {
        return (
            <main>
                <div style={{ textAlign: 'center', marginTop: 100 }}>
                    <h2>Product not found</h2>
                    <button onClick={() => router.push('/')} style={{ marginTop: 20, padding: '10px 20px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--w)', cursor: 'pointer', fontWeight: 600 }}>
                        Return Home
                    </button>
                </div>
            </main>
        );
    }

    const handleAdd = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
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

                <div className="page-body">
                    <div className="main-content" style={{ padding: '0 24px 40px', maxWidth: 640, margin: '0 auto' }}>

                        {/* Back Nav */}
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 20 }}>
                            <button
                                onClick={() => router.back()}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--b)',
                                    background: 'var(--w)', cursor: 'pointer', color: 'var(--d)'
                                }}
                            >
                                <ArrowLeft size={18} />
                            </button>
                        </div>

                        {/* Product Details */}
                        <div style={{ background: 'var(--w)', borderRadius: 20, border: '1px solid var(--b)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                            <div style={{ height: 340, background: '#fff5ef', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                {product.imgSrc ? (
                                    <img src={product.imgSrc} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <img src="/images/icons/fire.png" alt="" style={{ width: 120, height: 120, objectFit: 'contain', opacity: 0.3 }} />
                                )}
                                {product.tag && (
                                    <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--d)', color: '#fff', fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 20 }}>
                                        {product.tag}
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: 30 }}>
                                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 12px 0', color: 'var(--d)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                    {product.name}
                                </h1>
                                <p style={{ fontSize: 15, color: 'var(--g)', lineHeight: 1.6, marginBottom: 28 }}>
                                    {product.desc}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingTop: 20, borderTop: '1px solid var(--b)' }}>
                                    <div>
                                        {product.oldPrice && <div style={{ fontSize: 15, color: '#aaa', textDecoration: 'line-through', fontWeight: 600, marginBottom: 4 }}>AED {product.oldPrice}</div>}
                                        <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--o)', letterSpacing: '-0.02em' }}>AED {product.price}</div>
                                    </div>
                                </div>

                                {product.inclusions && product.inclusions.length > 0 && (
                                    <div style={{ marginBottom: 24, padding: '16px 20px', background: 'rgba(96,165,250,0.04)', borderRadius: 12, border: '1px solid rgba(96,165,250,0.12)' }}>
                                        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 800, color: 'var(--d)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>What&apos;s Included</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {product.inclusions.map((item, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--o)', flexShrink: 0 }} />
                                                    <span style={{ fontSize: 14, color: 'var(--g)', fontWeight: 600 }}>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.dietary && product.dietary.length > 0 && (
                                    <div style={{ marginBottom: 24, padding: '16px 20px', background: 'rgba(255,106,12,0.03)', borderRadius: 12, border: '1px solid rgba(255,106,12,0.08)' }}>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 800, color: 'var(--d)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dietary Info</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {product.dietary.map(tag => (
                                                <div key={tag} style={{ display: 'flex', gap: 10 }}>
                                                    <div style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--o)', color: '#fff', fontSize: 10, fontWeight: 800, height: 'fit-content', flexShrink: 0 }}>
                                                        {tag}
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: 13, color: 'var(--g)', lineHeight: 1.4 }}>
                                                        {DIETARY_DESCS[tag] || 'Informative tag for this product.'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.allergens && product.allergens.length > 0 && (
                                    <div style={{ marginBottom: 28, padding: '16px 20px', background: 'rgba(248,113,113,0.03)', borderRadius: 12, border: '1px solid rgba(248,113,113,0.1)' }}>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 800, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Allergen Warning</h4>
                                        <p style={{ margin: '0 0 8px 0', fontSize: 13, color: 'var(--g)' }}>
                                            This product contains:
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {product.allergens.map(allergen => (
                                                <span key={allergen} style={{ fontSize: 13, fontWeight: 700, color: '#f87171' }}>
                                                    • {allergen}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleAdd}
                                    style={{
                                        width: '100%', padding: '18px', borderRadius: 14, border: 'none',
                                        background: isAdded ? '#22c55e' : 'var(--o)', color: '#fff',
                                        fontSize: 18, fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s',
                                        boxShadow: isAdded ? 'none' : '0 8px 24px rgba(255,106,12,0.35)'
                                    }}
                                >
                                    {isAdded ? '✓ Added to Cart' : '+ Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer onSelectCategory={() => { }} />

            <BottomNav
                activeTab={activeBottomTab}
                onTabChange={handleBottomTabChange}
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
            />
        </>
    );
}
