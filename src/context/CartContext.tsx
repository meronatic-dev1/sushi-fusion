'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/data';

export interface CartItem extends Product {
    qty: number;
}

interface CartContextType {
    cart: { [key: string]: CartItem };
    isCartOpen: boolean;
    addToCart: (product: Product) => void;
    updateQty: (name: string, delta: number) => void;
    setIsCartOpen: (isOpen: boolean) => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Persist cart to localStorage (optional but good UX)
    useEffect(() => {
        const savedCart = localStorage.getItem('sushi-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart');
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sushi-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev[product.name];
            if (existing) {
                return { ...prev, [product.name]: { ...existing, qty: existing.qty + 1 } };
            }
            return { ...prev, [product.name]: { ...product, qty: 1 } };
        });
        setIsCartOpen(true); // Auto-open cart on add
    };

    const updateQty = (name: string, delta: number) => {
        setCart(prev => {
            const item = prev[name];
            if (!item) return prev;
            const newQty = Math.max(0, item.qty + delta);
            if (newQty === 0) {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            }
            return { ...prev, [name]: { ...item, qty: newQty } };
        });
    };

    const cartCount = Object.values(cart).reduce((a, b) => a + b.qty, 0);

    return (
        <CartContext.Provider value={{ cart, isCartOpen, addToCart, updateQty, setIsCartOpen, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
