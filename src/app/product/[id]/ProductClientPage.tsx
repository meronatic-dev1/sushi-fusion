'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import { MENU } from '@/lib/data';
import { t as translate, type Language } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';

export default function ProductClientPage({ id }: { id: string }) {
    const router = useRouter();
    const { cartCount, addToCart, setIsCartOpen } = useCart();

    const [searchValue, setSearchValue] = useState('');
    const [language, setLanguage] = useState<Language>('en');
    const [activeBottomTab, setActiveBottomTab] = useState('menu');
    const [isAdded, setIsAdded] = useState(false);

    const t = (key: string) => translate(language, key);

    // Reconstruct product from decoded URI component parameter
    const decodedName = decodeURIComponent(id);
    const allProducts = Object.values(MENU).flat();
    const product = allProducts.find(p => p.name === decodedName);

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
                                    <span style={{ fontSize: 120 }}>{product.emoji}</span>
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
