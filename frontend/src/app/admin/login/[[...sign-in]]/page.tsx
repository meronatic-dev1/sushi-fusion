'use client';

import Link from "next/link";
import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";
import { getAnalyticsDashboard, DashboardData } from "@/lib/api";

export default function AdminLoginPage() {
    const { settings } = useSettings();
    const [stats, setStats] = useState<{ label: string; value: string; change: string; up: boolean | null }[]>([
        { label: 'Total Orders Today', value: '...', change: '', up: null },
        { label: 'Revenue This Week', value: '...', change: '', up: null },
        { label: 'Active Menu Items', value: '...', change: '', up: null },
    ]);

    useEffect(() => {
        getAnalyticsDashboard()
            .then((data: DashboardData) => {
                setStats([
                    { label: 'Total Orders', value: data.kpis.orders.toString(), change: 'Live', up: true },
                    { label: 'Total Revenue', value: `AED ${data.kpis.revenue.toFixed(0)}`, change: 'Live', up: true },
                    { label: 'Customers', value: data.kpis.customers.toString(), change: 'Live', up: null },
                ]);
            })
            .catch(err => {
                console.error('Failed to load login page stats:', err);
                // Fallback to static numbers if API fails
                setStats([
                    { label: 'Total Orders Today', value: '284', change: '+12%', up: true },
                    { label: 'Revenue This Week', value: 'AED 18,420', change: '+8.3%', up: true },
                    { label: 'Active Menu Items', value: '64', change: '2 updated', up: null },
                ]);
            });
    }, []);
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            background: '#0a0a0f',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* ── Ambient background glows ── */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            }}>
                {/* Top-left glow */}
                <div style={{
                    position: 'absolute', top: '-120px', left: '-120px',
                    width: '520px', height: '520px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,106,12,0.12) 0%, transparent 70%)',
                }} />
                {/* Bottom-right glow */}
                <div style={{
                    position: 'absolute', bottom: '-80px', right: '-80px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,106,12,0.08) 0%, transparent 70%)',
                }} />
                {/* Center subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                }} />
            </div>

            {/* ══════════════════════════════════════
                LEFT PANEL — Branding
            ══════════════════════════════════════ */}
            <div style={{
                width: '48%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '52px 56px',
                position: 'relative',
                zIndex: 1,
            }} className="admin-left-panel">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: 42, height: 42,
                        borderRadius: '10px',
                        background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(255,106,12,0.4)',
                        overflow: 'hidden',
                        flexShrink: 0,
                    }}>
                        <img src={settings?.logoUrl || '/sushi-fusion-logo.png'} alt="Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 2 }} />
                    </div>
                    <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Sushi Fusion</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Console</p>
                    </div>
                </div>

                {/* Center content */}
                <div>
                    {/* Decorative stat cards */}
                    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '14px 18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backdropFilter: 'blur(8px)',
                                animation: `fadeSlideUp 0.5s ease both`,
                                animationDelay: `${i * 0.1}s`,
                            }}>
                                <div>
                                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 3px', letterSpacing: '0.04em' }}>{stat.label}</p>
                                    <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>{stat.value}</p>
                                </div>
                                <div style={{
                                    fontSize: 11, fontWeight: 700,
                                    color: stat.up === true ? '#4ade80' : stat.up === false ? '#f87171' : 'rgba(255,255,255,0.4)',
                                    background: stat.up === true ? 'rgba(74,222,128,0.12)' : stat.up === false ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.06)',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    letterSpacing: '0.02em',
                                }}>
                                    {stat.change}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h1 style={{
                        fontSize: 38, fontWeight: 800, color: '#fff',
                        lineHeight: 1.15, margin: '0 0 14px',
                        letterSpacing: '-0.04em',
                    }}>
                        Your restaurant,<br />
                        <span style={{
                            background: 'linear-gradient(90deg, #FF6A0C, #ffb380)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>fully in control.</span>
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0, maxWidth: '380px' }}>
                        Manage orders, update your menu, track analytics, and configure every detail of your Sushi Fusion experience — all from one place.
                    </p>
                </div>

                {/* Bottom footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.04em' }}>
                        © 2025 Sushi Fusion UAE
                    </p>
                    <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
                    <Link href="#" style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', letterSpacing: '0.04em' }}>Privacy</Link>
                    <Link href="#" style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', letterSpacing: '0.04em' }}>Terms</Link>
                </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT PANEL — Clerk SignIn
            ══════════════════════════════════════ */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 48px',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Vertical divider */}
                <div style={{
                    position: 'absolute', left: 0, top: '10%', bottom: '10%',
                    width: '1px',
                    background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)',
                }} className="admin-divider" />

                <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '28px', width: '100%' }}>
                        {/* Access badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(255,106,12,0.12)',
                            border: '1px solid rgba(255,106,12,0.25)',
                            borderRadius: '20px',
                            padding: '4px 12px',
                            marginBottom: '20px',
                        }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#FF6A0C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                🔐 Restricted Access
                            </span>
                        </div>

                        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
                            Welcome back
                        </h2>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.6 }}>
                            Sign in to access the admin dashboard
                        </p>
                    </div>

                    {/* Clerk SignIn Component heavily customized to match the original design */}
                    <SignIn
                        path="/admin/login"
                        routing="path"
                        forceRedirectUrl="/admin"
                        fallbackRedirectUrl="/admin"
                        appearance={{
                            variables: {
                                colorPrimary: '#FF6A0C',
                                colorBackground: '#1a1a24',
                                colorText: '#fff',
                                colorTextSecondary: 'rgba(255,255,255,0.7)',
                                colorInputBackground: 'rgba(255,255,255,0.05)',
                                colorInputText: '#fff',
                                borderRadius: '12px',
                            },
                            elements: {
                                card: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)' },
                                headerTitle: { color: '#fff' },
                                headerSubtitle: { color: 'rgba(255,255,255,0.6)' },
                                formFieldLabel: { color: '#fff', opacity: 0.9 },
                                footerActionLink: { color: '#FF6A0C' },
                                identityPreviewText: { color: '#fff' },
                                breadcrumbItem: { color: 'rgba(255,255,255,0.6)' },
                                footerActionText: { color: 'rgba(255,255,255,0.6)' },
                                userButtonPopoverActionButtonText: { color: '#fff' },
                                rootBox: { width: '100%' },
                            },
                        }}
                    />

                    {/* Security note */}
                    <div style={{
                        marginTop: '28px',
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)', margin: 0, lineHeight: 1.6 }}>
                            This is a protected area. All login attempts are logged and monitored. Unauthorized access is strictly prohibited.
                        </p>
                    </div>

                    {/* Back to site */}
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Link href="/" style={{
                            fontSize: 12, color: 'rgba(255,255,255,0.25)',
                            textDecoration: 'none', letterSpacing: '0.04em',
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            transition: 'color 0.15s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                            Back to Sushi Fusion
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .admin-left-panel { display: none !important; }
                    .admin-divider    { display: none !important; }
                }

                /* Override specific Clerk internal styles that might still carry white background */
                .cl-internal-bfqvce { background-color: rgba(255,255,255,0.05); }
                .cl-internal-1x6n8e0 { background: transparent; }
            `}</style>
        </div>
    );
}