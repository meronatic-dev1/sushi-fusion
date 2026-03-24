'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LocationModal from './LocationModal';
import UserMenu from './UserMenu';
import { useLocation } from '@/context/LocationContext';
import type { Language } from '@/lib/i18n';
import { useUser } from '@clerk/nextjs';
import { useSettings } from '@/context/SettingsContext';

interface HeaderProps {
    cartCount: number;
    onToggleCart: () => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    language: Language;
    onToggleLanguage: () => void;
    t: (key: string) => string;
}

// Inline SVG icons — no image files needed, always render correctly
function ModeIcon({ mode, size = 22, active }: { mode: string; size?: number; active: boolean }) {
    const stroke = active ? 'var(--o)' : '#aaa';
    const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
    if (mode === 'delivery') return (
        <svg {...props}>
            <rect x="1" y="10" width="14" height="8" rx="1" />
            <path d="M15 12h4l3 4H15v-4z" />
            <circle cx="5.5" cy="18.5" r="1.5" />
            <circle cx="18.5" cy="18.5" r="1.5" />
        </svg>
    );
    if (mode === 'pickup') return (
        <svg {...props}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
        </svg>
    );
    // dineIn
    return (
        <svg {...props}>
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 0 0-5 5v6h3.5" />
            <path d="M19.5 13V22" />
        </svg>
    );
}

export default function Header({
    cartCount,
    onToggleCart,
    searchValue,
    onSearchChange,
    language,
    onToggleLanguage,
    t,
}: HeaderProps) {
    const { isSignedIn, isLoaded } = useUser();
    const [activeMode, setActiveMode] = useState<'delivery' | 'pickup' | 'dineIn'>('delivery');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { location, setLocation } = useLocation();
    const { settings } = useSettings();

    const modes = ['delivery', 'pickup', 'dineIn'] as const;

    const handleModeClick = (mode: typeof modes[number]) => {
        setActiveMode(mode);
        setIsPopoverOpen(true);
    };

    const handleProceed = (data: any) => {
        console.log('Header: Proceeding with location data:', data);
        // Update the global location context
        setLocation({
            lat: data.lat || 0,
            lng: data.lng || 0,
            address: data.address || '',
            mode: data.mode,
            branchId: data.store || null,
        });

        setIsPopoverOpen(false);
    };

    return (
        <>
            {/* ╔══════════════════════════════════════════╗
                ║  DESKTOP HEADER — visible above 769px   ║
                ╚══════════════════════════════════════════╝ */}
            <header className="topbar topbar--desktop">
                <div className="logo-wrap">
                    <img src={settings.logoUrl || '/sushi-fusion-logo.png'} alt="Sushi Fusion" />
                </div>

                <div className="mode-tabs">
                    {modes.map((m) => (
                        <button
                            key={m}
                            className={`mode-tab ${activeMode === m ? 'active' : ''}`}
                            onClick={() => handleModeClick(m)}
                        >
                            <ModeIcon mode={m} size={18} active={activeMode === m} />
                            {t(`header.mode.${m}`)}
                        </button>
                    ))}
                </div>

                <button className="location-btn" onClick={() => setIsPopoverOpen(true)}>
                    <img src="/images/location.png" alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} /> {location?.address || t('header.selectLocation')}
                </button>

                <div className="topbar-spacer" />

                <div className="search-wrap">
                    <input
                        type="text"
                        placeholder={t('header.searchPlaceholder')}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <img src="/images/icons/search.png" alt="" style={{ width: 16, height: 16, objectFit: 'contain', opacity: 0.6 }} />
                </div>

                <button className="cart-btn" onClick={onToggleCart}>
                    <img src="/images/icons/cart.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                    <span className="cart-badge">{cartCount}</span>
                </button>

                <button className="lang-btn" onClick={onToggleLanguage}>
                    {language === 'en' ? 'عربي' : 'EN'}
                </button>

                {isLoaded && (
                    isSignedIn ? (
                        <UserMenu language={language} t={t} />
                    ) : (
                        <Link href="/login" className="login-btn">{t('header.login')}</Link>
                    )
                )}
            </header>

            {/* ╔══════════════════════════════════════════╗
                ║  MOBILE HEADER  — visible below 769px   ║
                ╚══════════════════════════════════════════╝ */}
            <header className="topbar topbar--mobile">
                {/* Row 1: hamburger · location pill · lang circle */}
                <div className="mob-row1">
                    <button className="mob-hamburger" aria-label="Open menu">
                        <span /><span /><span />
                    </button>

                    <button className="mob-location" onClick={() => setIsPopoverOpen(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="var(--o)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span className="mob-location-text">
                            {location?.address || t('header.selectLocation')}
                        </span>
                        <span className="mob-location-arrow">→</span>
                    </button>

                    <button className="mob-lang" onClick={onToggleLanguage}>
                        {language === 'en' ? 'عربي' : 'EN'}
                    </button>
                </div>

                {/* Row 2: circular mode selector */}
                <div className="mob-row2">
                    {modes.map((m) => (
                        <button
                            key={m}
                            className={`mob-mode-tab ${activeMode === m ? 'active' : ''}`}
                            onClick={() => handleModeClick(m)}
                        >
                            <div className="mob-mode-circle">
                                <ModeIcon mode={m} size={28} active={activeMode === m} />
                            </div>
                            <span className="mob-mode-label">
                                {activeMode === m && <span className="mob-check">✓ </span>}
                                {t(`header.mode.${m}`)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Row 3: Search bar — always visible on mobile for "perfect" working search */}
                <div className="mob-row-search visible">
                    <div className="mob-search-inner">
                        <input
                            id="mobile-search-input"
                            type="text"
                            placeholder={t('header.searchPlaceholder')}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <img 
                            src="/images/icons/search.png" 
                            alt="" 
                            className="mob-search-icon"
                        />
                    </div>
                </div>
            </header>

            <LocationModal
                isOpen={isPopoverOpen}
                onClose={() => setIsPopoverOpen(false)}
                mode={activeMode}
                t={t}
                onProceed={handleProceed}
            />
        </>
    );
}