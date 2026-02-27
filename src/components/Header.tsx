'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LocationModal from './LocationModal';
import type { Language } from '@/lib/i18n';

interface HeaderProps {
    cartCount: number;
    onToggleCart: () => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    language: Language;
    onToggleLanguage: () => void;
    t: (key: string) => string;
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
    const [activeMode, setActiveMode] = useState<'delivery' | 'pickup' | 'dineIn'>('delivery');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

    const handleModeClick = (mode: 'delivery' | 'pickup' | 'dineIn') => {
        setActiveMode(mode);
        setIsPopoverOpen(true);
    };

    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Location submitted
        setIsPopoverOpen(false);
    };

    const renderModeTabs = (className: string) => {
        const modes: { key: 'delivery' | 'pickup' | 'dineIn'; icon: React.ReactNode }[] = [
            { key: 'delivery', icon: <img src="/images/delivery-man.png" alt="Delivery" className="mode-icon" /> },
            { key: 'pickup', icon: <img src="/images/pickup.png" alt="Pickup" className="mode-icon" /> },
            { key: 'dineIn', icon: <img src="/images/dine in.png" alt="Dine In" className="mode-icon" /> },
        ];

        return (
            <div className={className}>
                {modes.map((mode) => (
                    <button
                        key={mode.key}
                        className={`mode-tab ${activeMode === mode.key ? 'active' : ''}`}
                        onClick={() => handleModeClick(mode.key)}
                    >
                        {mode.icon} {t(`header.mode.${mode.key}`)}
                    </button>
                ))}
            </div>
        );
    };

    const currentModeText = t(`header.mode.${activeMode}`);

    return (
        <header className="topbar">
            <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className="logo-wrap">
                <img src="/sushi-fusion-logo.png" alt="Sushi Fusion" />
            </div>

            {renderModeTabs('mode-tabs')}

            <button className="location-btn" onClick={() => setIsPopoverOpen(true)}>
                📍 {selectedLocation || t('header.selectLocation')}
            </button>

            <LocationModal
                isOpen={isPopoverOpen}
                onClose={() => setIsPopoverOpen(false)}
                mode={t(`header.mode.${activeMode}`)}
                t={t}
                onProceed={(data) => {
                    if (data.mode === 'Delivery') {
                        setSelectedLocation(data.address || t('header.selectLocation'));
                    } else if (data.mode === 'Pickup') {
                        const summary = [data.city, data.store].filter(Boolean).join(' • ');
                        setSelectedLocation(summary || t('header.selectLocation'));
                    }
                    setIsPopoverOpen(false);
                }}
            />

            <div className="topbar-spacer"></div>

            <div className="search-wrap">
                <input
                    type="text"
                    placeholder={t('header.searchPlaceholder')}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <span className="si">🔍</span>
            </div>

            <button className="cart-btn" onClick={onToggleCart}>
                🛒<span className="cart-badge" id="cart-count">{cartCount}</span>
            </button>
            <button className="lang-btn" onClick={onToggleLanguage}>
                {language === 'en' ? 'عربي' : 'EN'}
            </button>
            <Link href="/login" className="login-btn">{t('header.login')}</Link>

            {renderModeTabs('mode-tabs-mobile')}
        </header>
    );
}
