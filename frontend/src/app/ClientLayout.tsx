'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { LocationProvider } from '@/context/LocationContext';
import GlobalCart from '@/components/GlobalCart';
import DiscountPopup from '@/components/DiscountPopup';
import { t as translate, type Language } from '@/lib/i18n';
import UserSync from '@/components/UserSync';

export default function ClientLayout({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');
    const pathname = usePathname();

    const t = (key: string) => translate(language, key);

    return (
        <SettingsProvider>
            <UserSync />
            <LocationProvider>
                {pathname?.startsWith('/admin') ? (
                    children
                ) : (
                    <CartProvider>
                        <DiscountPopup />
                        <GlobalCart t={t} />
                        {children}
                    </CartProvider>
                )}
            </LocationProvider>
        </SettingsProvider>
    );
}
