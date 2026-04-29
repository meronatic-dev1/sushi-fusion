'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/data';

export interface CartItem extends Product {
    qty: number;
}

interface CartContextType {
    cart: { [key: string]: CartItem };
    isCartOpen: boolean;
    addToCart: (product: Product, quantity?: number) => void;
    updateQty: (name: string, delta: number) => void;
    setIsCartOpen: (isOpen: boolean) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    // No localStorage persistence per user request

    const addToCart = (product: Product, quantity: number = 1) => {
        setCart(prev => {
            const existing = prev[product.name];
            if (existing) {
                return { ...prev, [product.name]: { ...existing, qty: existing.qty + quantity } };
            }
            return { ...prev, [product.name]: { ...product, qty: quantity } };
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

    const clearCart = () => setCart({});

    const cartCount = Object.values(cart).reduce((a, b) => a + b.qty, 0);

    return (
        <CartContext.Provider value={{ cart, isCartOpen, addToCart, updateQty, setIsCartOpen, clearCart, cartCount }}>
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
