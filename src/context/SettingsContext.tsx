'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { API } from '@/lib/api';

interface StoreSettings {
    logoUrl: string;
    bannerUrl: string;
}

interface SettingsContextType {
    settings: StoreSettings;
    loading: boolean;
}

const defaultSettings: StoreSettings = {
    // Fallbacks if not configured in DB
    logoUrl: '/logo.png',
    bannerUrl: '/images/banner-1.png',
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
