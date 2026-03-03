'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function GlobalCart({ t }: { t: (key: string) => string }) {
    const { cart, isCartOpen, updateQty, setIsCartOpen } = useCart();
    const pathname = usePathname();

    // Do not render the cart sidebar on admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const items = Object.entries(cart).filter(([, v]) => v.qty > 0);
    const total = items.reduce((a, [, v]) => a + (v.price * v.qty), 0);
    const onClose = () => setIsCartOpen(false);

    const renderHeader = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--b)', paddingBottom: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>🛒 {t('cart.title')}</div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: '0 8px', color: 'var(--g)' }}>×</button>
        </div>
    );

    return (
        <>
            <div className={`global-cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                {items.length === 0 ? (
                    <div className="cart-empty" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {renderHeader()}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="cart-empty-icon" style={{ fontSize: 60, marginBottom: 15, opacity: 0.5 }}>🛒</div>
                            <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('cart.emptyTitle')}</h3>
                            <p style={{ fontSize: 13, color: 'var(--g)', marginTop: 8 }}>{t('cart.emptyBody')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="cart-has-items" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {renderHeader()}
                        <div className="cart-items" style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {items.map(([name, item]) => (
                                <div key={name} style={{ display: 'flex', gap: 10, padding: 10, border: '1px solid var(--b)', borderRadius: 8 }}>
                                    <div style={{ fontSize: 30, width: 48, height: 48, background: '#fff5ef', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {item.imgSrc ? <img src={item.imgSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} /> : item.emoji}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{name}</div>
                                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--o)' }}>AED {(item.price * item.qty).toFixed(0)}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                                            <button onClick={() => updateQty(name, -1)} style={{ width: 22, height: 22, border: '1px solid var(--b)', background: 'transparent', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>−</button>
                                            <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                                            <button onClick={() => updateQty(name, 1)} style={{ width: 22, height: 22, border: '1px solid var(--b)', background: 'transparent', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-summary" style={{ borderTop: '1px solid var(--b)', paddingTop: 14, marginTop: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--g)', marginBottom: 6 }}>
                                <span>{t('cart.subtotal')}</span>
                                <span>AED {total}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--g)', marginBottom: 6 }}>
                                <span>{t('cart.delivery')}</span>
                                <span style={{ color: '#22c55e', fontWeight: 600 }}>{t('cart.deliveryFree')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, marginTop: 4, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
                                <span>{t('cart.total')}</span>
                                <span style={{ color: 'var(--o)' }}>AED {total}</span>
                            </div>
                            <a href="/checkout" style={{ display: 'block', textDecoration: 'none' }}>
                                <button className="checkout-btn" style={{ width: '100%', padding: 14, background: 'var(--o)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer', marginTop: 14, transition: 'background 0.2s' }}>
                                    {t('cart.checkout')}
                                </button>
                            </a>
                        </div>
                    </div>
                )}
            </div>
            {/* The Overlay */}
            {isCartOpen && <div className="cart-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9998, backdropFilter: 'blur(2px)', animation: 'fadeIn 0.2s ease forwards' }} />}

            <style>{`
                .global-cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    max-width: 380px;
                    background: var(--w);
                    z-index: 9999;
                    box-shadow: -4px 0 24px rgba(0,0,0,0.15);
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                }
                .global-cart-sidebar.open {
                    transform: translateX(0);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
}
