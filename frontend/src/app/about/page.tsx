'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { t as translate, type Language } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import Image from 'next/image';

export default function AboutPage() {
    const router = useRouter();
    const { cartCount, setIsCartOpen } = useCart();
    const { settings } = useSettings();

    const [searchValue, setSearchValue] = useState('');
    const [language, setLanguage] = useState<Language>('en');
    const [activeBottomTab, setActiveBottomTab] = useState('menu');

    const t = (key: string) => translate(language, key);

    const handleBottomTabChange = (tab: string) => {
        setActiveBottomTab(tab);
        if (tab === 'menu') router.push('/');
    };

    return (
        <div style={{ background: 'var(--b)' }}>
            <Header
                cartCount={cartCount}
                onToggleCart={() => setIsCartOpen(true)}
                searchValue={searchValue}

                onSearchChange={(val) => {
                    setSearchValue(val);
                    if (val) router.push('/'); // redirect to home for searching if needed
                }}
                language={language}
                onToggleLanguage={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
                t={t}
            />

            <main style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 800, margin: '0 auto' }}>
                <div style={{ background: 'var(--w)', padding: '40px 30px', borderRadius: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'var(--d)', letterSpacing: '-0.02em', marginBottom: 10 }}>About Us</h1>
                        <div style={{ width: 60, height: 4, background: 'var(--o)', margin: '0 auto', borderRadius: 2 }} />
                    </div>

                    <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--g)', display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <p>
                            <strong style={{ color: 'var(--d)' }}>Welcome to Sushi Fusion!</strong> We are an authentic Japanese dining experience with a modern twist. Born from a passion for precision and a love for the freshest ingredients, we bring the best of Tokyo right to your table here in the UAE.
                        </p>

                        <div style={{ borderRadius: 16, overflow: 'hidden', margin: '10px 0', border: '1px solid var(--b)' }}>
                            <img src={settings.bannerUrl} alt="Sushi Fusion Kitchen" style={{ width: '100%', height: 260, objectFit: 'cover' }} />
                        </div>

                        <p>
                            At Sushi Fusion, we believe that every roll tells a story. From the crackle of our Tempura to the delicate slice of our Sashimi, our chefs meticulously craft dishes that are as visually stunning as they are delicious. We pride ourselves on sourcing the highest grade seafood and utilizing traditional rice preparation techniques alongside bold, contemporary favors.
                        </p>

                        <div style={{ background: '#fff5ef', padding: 24, borderRadius: 16, border: '1px solid rgba(255,106,12,0.1)' }}>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--o)', marginBottom: 8, marginTop: 0 }}>Our Promise</h3>
                            <p style={{ margin: 0, fontSize: 15 }}>
                                Only exactly perfect execution. No compromises on flavor, quality, or service. Whether you are craving the comfort of classic Maki or the blazing heat of a Fire Dragon Roll, your satisfaction fuels our devotion to culinary excellence.
                            </p>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ width: 24, height: 24, background: 'var(--d)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>✓</span>
                                <span style={{ color: 'var(--d)', fontWeight: 600 }}>100% Fresh Daily Seafood</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ width: 24, height: 24, background: 'var(--d)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>✓</span>
                                <span style={{ color: 'var(--d)', fontWeight: 600 }}>Expert Sushi Chefs</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ width: 24, height: 24, background: 'var(--d)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>✓</span>
                                <span style={{ color: 'var(--d)', fontWeight: 600 }}>Uncompromising UAE Quality</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer onSelectCategory={() => { }} />

            <BottomNav
                activeTab={activeBottomTab}
                onTabChange={handleBottomTabChange}
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
            />
        </div>
    );
}
