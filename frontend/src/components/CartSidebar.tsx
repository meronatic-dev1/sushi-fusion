'use client';

import React from 'react';
import { Product } from '@/lib/data';

export interface CartItem extends Product {
    qty: number;
}

interface CartSidebarProps {
    cart: { [key: string]: CartItem };
    onUpdateQty: (name: string, delta: number) => void;
    isOpen: boolean;
    onClose: () => void;
    t: (key: string) => string;
}

export default function CartSidebar({ cart, onUpdateQty, isOpen, onClose, t }: CartSidebarProps) {
    const items = Object.entries(cart).filter(([, v]) => v.qty > 0);
    const total = items.reduce((a, [, v]) => a + v.price * v.qty, 0);

    const renderHeader = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--b)', paddingBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>🛒 {t('cart.title')}</div>
            <button onClick={onClose} className="cart-close-btn">×</button>
        </div>
    );

    if (items.length === 0) {
        return (
            <>
                <div className={`cart-sidebar ${isOpen ? 'mobile-open' : ''}`}>
                    {renderHeader()}
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <h3>{t('cart.emptyTitle')}</h3>
                        <p>{t('cart.emptyBody')}</p>
                    </div>
                </div>
                {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
            </>
        );
    }

    return (
        <>
            <div className={`cart-sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div className="cart-has-items">
                    {renderHeader()}
                    <div className="cart-items">
                        {items.map(([name, item]) => (
                            <div key={name} className="cart-item">
                                <div className="cart-item-emoji">
                                    {item.imgSrc ? (
                                        <img src={item.imgSrc} alt={item.name} />
                                    ) : (
                                        <span role="img" aria-label={item.name}>
                                            {item.emoji}
                                        </span>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="cart-item-name">{name}</div>
                                    <div className="cart-item-price">AED {(item.price * item.qty).toFixed(0)}</div>
                                    <div className="cart-item-qty">
                                        <button className="qty-btn" onClick={() => onUpdateQty(name, -1)}>
                                            −
                                        </button>
                                        <span className="qty-num">{item.qty}</span>
                                        <button className="qty-btn" onClick={() => onUpdateQty(name, 1)}>
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <div className="cart-row">
                            <span>{t('cart.subtotal')}</span>
                            <span>AED {total}</span>
                        </div>
                        <div className="cart-row">
                            <span>{t('cart.delivery')}</span>
                            <span style={{ color: '#22c55e', fontWeight: 600 }}>{t('cart.deliveryFree')}</span>
                        </div>
                        <div className="cart-row total">
                            <span>{t('cart.total')}</span>
                            <span style={{ color: 'var(--o)' }}>AED {total}</span>
                        </div>
                        <button className="checkout-btn">{t('cart.checkout')}</button>
                    </div>
                </div>
            </div>
            {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
        </>
    );
}
