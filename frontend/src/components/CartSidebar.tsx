'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/data';
import { useLocation } from '@/context/LocationContext';
import { useSettings } from '@/context/SettingsContext';

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
    const router = useRouter();
    const { location } = useLocation();
    const { settings } = useSettings();
    
    // Default to delivery unless specifically set to something else
    const isDelivery = !location || !location.mode || location.mode.toLowerCase() === 'delivery';
    const isDineIn = location?.mode?.toLowerCase() === 'dinein';
    const activeDeliveryFee = isDelivery ? settings.deliveryFee : 0;

    const items = Object.entries(cart).filter(([, v]) => v.qty > 0);
    const subtotal = items.reduce((a, [, v]) => a + v.price * v.qty, 0);
    
    // Service Charge
    const servicePercent = (settings?.enableServiceCharge && isDineIn) ? (settings?.serviceCharge || 0) : 0;
    const serviceCharge = (subtotal * servicePercent) / 100;
    
    // Tax
    const tax = subtotal * (settings.taxRate / 100);
    
    const total = subtotal + activeDeliveryFee + serviceCharge + tax;

    const renderHeader = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--b)', paddingBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/images/icons/cart.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                {t('cart.title')}
            </div>
            <button onClick={onClose} className="cart-close-btn">×</button>
        </div>
    );

    if (items.length === 0) {
        return (
            <>
                <div className={`cart-sidebar ${isOpen ? 'mobile-open' : ''}`}>
                    {renderHeader()}
                    <div className="cart-empty">
                        <img src="/images/icons/cart.png" alt="" style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 15, opacity: 0.2 }} />
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
                                        <img src="/images/icons/fire.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.4 }} />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="cart-item-name">{name}</div>
                                    <div className="cart-item-price">AED {(item.price * item.qty).toFixed(2)}</div>
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
                            <span>AED {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="cart-row">
                            <span>{t('cart.delivery')}</span>
                            <span style={{ fontWeight: 600 }}>
                                {activeDeliveryFee > 0 ? `AED ${activeDeliveryFee.toFixed(2)}` : 'Free'}
                            </span>
                        </div>
                        {serviceCharge > 0 && (
                            <div className="cart-row">
                                <span>Service Charge</span>
                                <span>AED {serviceCharge.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="cart-row">
                            <span>VAT ({settings.taxRate}%)</span>
                            <span>AED {tax.toFixed(2)}</span>
                        </div>
                        <div className="cart-row total">
                            <span>{t('cart.total')}</span>
                            <span style={{ color: 'var(--o)' }}>AED {total.toFixed(2)}</span>
                        </div>
                        <button 
                            className="checkout-btn"
                            onClick={() => {
                                onClose();
                                router.push('/checkout');
                            }}
                        >
                            {t('cart.checkout')}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
        </>
    );
}
