'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    cartCount: number;
    onCartClick: () => void;
}

export default function BottomNav({ activeTab, onTabChange, cartCount, onCartClick }: BottomNavProps) {
    const { isSignedIn, isLoaded } = useUser();

    return (
        <nav className="bottom-nav">
            {/* ... other items ... */}
            <button
                className={`bottom-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
                onClick={() => onTabChange('menu')}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke={activeTab === 'menu' ? 'var(--o)' : '#888'}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span className="bottom-nav-label">Menu</span>
            </button>

            {/* Search */}
            <button
                className={`bottom-nav-item ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => onTabChange('search')}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke={activeTab === 'search' ? 'var(--o)' : '#888'}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="bottom-nav-label">Search</span>
            </button>

            {/* Offers — elevated centre circle */}
            <button
                className={`bottom-nav-item offers-item ${activeTab === 'offers' ? 'active' : ''}`}
                onClick={() => onTabChange('offers')}
            >
                <div className="bottom-nav-offers-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <path d="M8.5 8.5 l7 7" />
                    </svg>
                </div>
                <span className="bottom-nav-label">Offers</span>
            </button>

            {/* Cart */}
            <button
                className={`bottom-nav-item ${activeTab === 'cart' ? 'active' : ''}`}
                onClick={() => { onTabChange('cart'); onCartClick(); }}
            >
                {cartCount > 0 && (
                    <span className="bottom-nav-cart-badge">{cartCount}</span>
                )}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke={activeTab === 'cart' ? 'var(--o)' : '#888'}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="bottom-nav-label">Cart</span>
            </button>

            {/* Login / Account */}
            {isLoaded && (
                <Link
                    href={isSignedIn ? "/track" : "/login"}
                    className={`bottom-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                    onClick={() => onTabChange('account')}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke={activeTab === 'account' ? 'var(--o)' : '#888'}
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="bottom-nav-label">{isSignedIn ? 'Account' : 'Login'}</span>
                </Link>
            )}
        </nav>
    );
}