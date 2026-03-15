'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { LocationProvider } from '@/context/LocationContext';
import GlobalCart from '@/components/GlobalCart';
import { t as translate, type Language } from '@/lib/i18n';
import UserSync from '@/components/UserSync';

export default function ClientLayout({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');
    const pathname = usePathname();

    const t = (key: string) => translate(language, key);

    // If we are in the admin dashboard, we don't need the CartProvider
    if (pathname?.startsWith('/admin')) {
        return <>{children}</>;
    }

    return (
        <SettingsProvider>
            <UserSync />
            <LocationProvider>
                <CartProvider>
                    {/* 
            We pass down the translation function to GlobalCart 
            so it can optionally use localized strings if needed 
          */}
                    <GlobalCart t={t} />
                    {children}
                </CartProvider>
            </LocationProvider>
        </SettingsProvider>
    );
}
