'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
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
    const { cartCount, addToCart, setIsCartOpen, updateQty } = useCart();

    const [searchValue, setSearchValue] = useState('');
    const [language, setLanguage] = useState<Language>('en');
    const [activeBottomTab, setActiveBottomTab] = useState('menu');
    const [isAdded, setIsAdded] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    
    // New states for drinks and quantity
    const [qty, setQty] = useState(1);
    const [drinks, setDrinks] = useState<Product[]>([]);
    const [selectedDrinks, setSelectedDrinks] = useState<Record<string, number>>({});

    const t = (key: string) => translate(language, key);

    const decodedName = decodeURIComponent(id);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                // 1. Fetch main product
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
                }

                // 2. Fetch drinks
                const { getCategories } = await import('@/lib/api');
                const cats = await getCategories();
                const drinkCat = cats.find(c => 
                    c.name.toLowerCase().includes('drink') || 
                    c.name.toLowerCase().includes('beverage')
                );
                
                if (!cancelled && drinkCat) {
                    const drinkItems = await getMenuItems(drinkCat.id);
                    setDrinks(drinkItems.map(d => ({
                        name: d.name,
                        desc: d.description || '',
                        price: d.price,
                        emoji: '🥤',
                        imgSrc: d.imageUrl || undefined
                    })));
                }

                setLoading(false);
            } catch (err) {
                console.error('Error loading product details:', err);
                // Fallback to static data for main product if API fails
                if (!cancelled && !product) {
                    const allProducts = Object.values(MENU).flat();
                    const found = allProducts.find(p => p.name === decodedName) || null;
                    setProduct(found);
                    setLoading(false);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [decodedName]);

    const handleBottomTabChange = (tab: string) => {
        setActiveBottomTab(tab);
        if (tab === 'menu') router.push('/');
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: 100, fontSize: 18, fontWeight: 700, color: 'var(--g)' }}>{t('loading')}...</div>;
    
    if (!product) {
        return (
            <main>
                <div style={{ textAlign: 'center', marginTop: 100 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800 }}>Product not found</h2>
                    <button onClick={() => router.push('/')} style={{ marginTop: 20, padding: '12px 24px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--w)', cursor: 'pointer', fontWeight: 700 }}>
                        Return Home
                    </button>
                </div>
            </main>
        );
    }

    const handleAdd = () => {
        if (!product) return;
        
        // Add main product with selected quantity
        for (let i = 0; i < qty; i++) {
            addToCart(product);
        }

        // Add selected drinks
        Object.entries(selectedDrinks).forEach(([drinkName, drinkQty]) => {
            const drink = drinks.find(d => d.name === drinkName);
            if (drink) {
                for (let i = 0; i < drinkQty; i++) {
                    addToCart(drink);
                }
            }
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    const toggleDrink = (drinkName: string) => {
        setSelectedDrinks(prev => {
            const next = { ...prev };
            if (next[drinkName]) delete next[drinkName];
            else next[drinkName] = 1;
            return next;
        });
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

                        {/* Close Button UI from screenshot */}
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 20 }}>
                            <button
                                onClick={() => router.back()}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 44, height: 44, borderRadius: '50%', border: 'none',
                                    background: 'var(--w)', cursor: 'pointer', color: 'var(--d)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    zIndex: 10
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Product Details - Ensuring product is not null below this point */}
                        <div style={{ background: 'var(--w)', borderRadius: 24, border: '1px solid var(--b)', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.04)' }}>
                            <div style={{ height: 'clamp(240px, 40vh, 380px)', background: '#fff5ef', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                {product!.imgSrc ? (
                                    <img src={product!.imgSrc} alt={product!.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <img src="/images/icons/fire.png" alt="" style={{ width: 120, height: 120, objectFit: 'contain', opacity: 0.3 }} />
                                )}
                                {product?.tag && (
                                    <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--d)', color: '#fff', fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 20 }}>
                                        {product?.tag}
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: 30 }}>
                                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 12px 0', color: 'var(--d)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                    {product?.name}
                                </h1>
                                <p style={{ fontSize: 15, color: 'var(--g)', lineHeight: 1.6, marginBottom: 28 }}>
                                    {product?.desc}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingTop: 20, borderTop: '1px solid var(--b)' }}>
                                    <div>
                                        {product?.oldPrice && <div style={{ fontSize: 15, color: '#aaa', textDecoration: 'line-through', fontWeight: 600, marginBottom: 4 }}>AED {product?.oldPrice}</div>}
                                        <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--o)', letterSpacing: '-0.02em' }}>AED {product?.price}</div>
                                    </div>
                                </div>

                                {product?.inclusions && product?.inclusions.length > 0 && (
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

                                {product?.dietary && product.dietary.length > 0 && (
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

                                {product?.allergens && product.allergens.length > 0 && (
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

                                {/* DRINKS SECTION */}
                                {drinks.length > 0 && (
                                    <div style={{ marginTop: 40, marginBottom: 40 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <h3 style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--d)', margin: 0 }}>
                                                Add Drinks
                                            </h3>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: '#a08060', background: '#f5efe8', padding: '4px 10px', borderRadius: 6 }}>Optional</span>
                                        </div>
                                        <p style={{ fontSize: 14, color: 'var(--g)', margin: '0 0 20px 0' }}>Choose up to 30 items</p>
                                        
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                                            gap: 16 
                                        }}>
                                            {drinks.map(drink => {
                                                const isSelected = !!selectedDrinks[drink.name];
                                                return (
                                                    <div 
                                                        key={drink.name}
                                                        onClick={() => toggleDrink(drink.name)}
                                                        style={{ 
                                                            border: `2px solid ${isSelected ? 'var(--o)' : 'var(--b)'}`,
                                                            borderRadius: 16,
                                                            overflow: 'hidden',
                                                            cursor: 'pointer',
                                                            background: isSelected ? 'rgba(255,106,12,0.02)' : 'var(--w)',
                                                            transition: 'all 0.2s',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <div style={{ height: 140, background: '#fcfaf7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                                            {drink.imgSrc ? (
                                                                <img src={drink.imgSrc} alt={drink.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <span style={{ fontSize: 40 }}>{drink.emoji}</span>
                                                            )}
                                                            <div style={{ 
                                                                position: 'absolute', top: 10, right: 10, 
                                                                width: 22, height: 22, borderRadius: 6,
                                                                background: isSelected ? 'var(--o)' : '#fff',
                                                                border: `1.5px solid ${isSelected ? 'var(--o)' : '#d0c0b0'}`,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                color: '#fff', fontSize: 14, fontWeight: 900
                                                            }}>
                                                                {isSelected && '✓'}
                                                            </div>
                                                        </div>
                                                        <div style={{ padding: '12px 14px' }}>
                                                            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--d)', marginBottom: 4, textTransform: 'uppercase' }}>{drink.name}</div>
                                                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--g)' }}>+ AED {drink.price.toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Footer / Actions */}
                                <div style={{ 
                                    display: 'flex', gap: 16, alignItems: 'center', 
                                    paddingTop: 30, borderTop: '1px solid var(--b)',
                                    marginTop: 20
                                }}>
                                    <div style={{ 
                                        display: 'flex', alignItems: 'center', gap: 15, 
                                        background: '#fafafa', border: '1px solid var(--b)',
                                        padding: '10px 18px', borderRadius: 14
                                    }}>
                                        <button 
                                            onClick={() => setQty(q => Math.max(1, q - 1))}
                                            style={{ background: 'none', border: 'none', fontSize: 24, fontWeight: 400, color: 'var(--g)', cursor: 'pointer' }}
                                        >
                                            −
                                        </button>
                                        <span style={{ fontSize: 18, fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                                        <button 
                                            onClick={() => setQty(q => q + 1)}
                                            style={{ background: 'none', border: 'none', fontSize: 24, fontWeight: 400, color: 'var(--o)', cursor: 'pointer' }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAdd}
                                        style={{
                                            flex: 1, padding: '16px 24px', borderRadius: 14, border: 'none',
                                            background: isAdded ? '#22c55e' : 'var(--o)', color: '#fff',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                                            boxShadow: isAdded ? 'none' : '0 8px 24px rgba(255,106,12,0.3)',
                                            outline: 'none'
                                        }}
                                    >
                                        <span>{isAdded ? '✓ Added' : 'Add item'}</span>
                                        <div style={{ textAlign: 'right' }}>
                                            {((product?.oldPrice || 0) > 0) && (
                                                <div style={{ fontSize: 11, opacity: 0.7, textDecoration: 'line-through' }}>
                                                    AED {(((product?.oldPrice || 0) * qty) + Object.entries(selectedDrinks).reduce((acc, [name, q]) => acc + (drinks.find(d => d.name === name)?.price || 0) * q, 0)).toFixed(2)}
                                                </div>
                                            )}
                                            <div style={{ fontSize: 14 }}>
                                                AED {(((product?.price || 0) * qty) + Object.entries(selectedDrinks).reduce((acc, [name, q]) => acc + (drinks.find(d => d.name === name)?.price || 0) * q, 0)).toFixed(2)}
                                            </div>
                                        </div>
                                    </button>
                                </div>
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
