'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { API } from '@/lib/api';

interface StoreSettings {
    logoUrl: string;
    bannerUrl: string;
    bannerUrls: string[];
    serviceCharge: number;
    enableServiceCharge: boolean;
    deliveryFee: number;
    taxRate: number;
}

interface SettingsContextType {
    settings: StoreSettings;
    loading: boolean;
}

const defaultSettings: StoreSettings = {
    // Fallbacks if not configured in DB
    logoUrl: '/logo.png',
    bannerUrl: '/images/banner-1.png',
    bannerUrls: [],
    serviceCharge: 0,
    enableServiceCharge: false,
    deliveryFee: 15.0,
    taxRate: 5.0,
};

const SettingsContext = createContext<SettingsContextType>({ settings: defaultSettings, loading: true });

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/settings`)
            .then(res => res.json())
            .then(data => {
                setSettings({
                    logoUrl: data.logoUrl || defaultSettings.logoUrl,
                    bannerUrl: data.bannerUrl || defaultSettings.bannerUrl,
                    bannerUrls: data.bannerUrls || defaultSettings.bannerUrls,
                    serviceCharge: data.serviceCharge ?? defaultSettings.serviceCharge,
                    enableServiceCharge: data.enableServiceCharge ?? defaultSettings.enableServiceCharge,
                    deliveryFee: data.deliveryFee ?? defaultSettings.deliveryFee,
                    taxRate: data.taxRate ?? defaultSettings.taxRate,
                });
            })
            .catch(err => {
                console.error('Failed to load store settings:', err);
                // Keeps default settings
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
