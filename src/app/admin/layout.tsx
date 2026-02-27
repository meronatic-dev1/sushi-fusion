'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
    LayoutDashboard, ShoppingBag, Package,
    MapPin, Users, BarChart2, LogOut, Bell, ChevronDown,
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Overview',   href: '/admin',              icon: LayoutDashboard },
    { label: 'Orders',     href: '/admin/orders',        icon: ShoppingBag },
    { label: 'Products',   href: '/admin/products',      icon: Package },
    { label: 'Analytics',  href: '/admin/analytics',     icon: BarChart2 },
    { label: 'Locations',  href: '/admin/locations',     icon: MapPin },
    { label: 'Customers',  href: '/admin/customers',     icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/admin/login') return <>{children}</>;

    const currentPage = NAV_ITEMS.find(n =>
        n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href))
    )?.label ?? 'Dashboard';

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: '#0a0a0f',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            color: '#fff',
            position: 'relative',
        }}>

            {/* ── Global ambient glows ── */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: -200, left: -100,
                    width: 500, height: 500, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,106,12,0.07) 0%, transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -150, right: -100,
                    width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                }} />
            </div>

            {/* ══════════════════════════════
                SIDEBAR
            ══════════════════════════════ */}
            <aside style={{
                width: 232,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 20,
                borderRight: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            }}>

                {/* Logo bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '0 20px',
                    height: 64,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    flexShrink: 0,
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, #FF6A0C, #ff9a5c)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(255,106,12,0.4)',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        <Image
                            src="/sushi-fusion-logo.png"
                            alt="Logo"
                            fill
                            style={{ objectFit: 'cover', filter: 'brightness(0) invert(1)' }}
                        />
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#fff' }}>
                            Sushi Fusion
                        </p>
                        <p style={{ fontSize: 9, color: 'rgba(255,106,12,0.7)', margin: 0, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
                            Admin Console
                        </p>
                    </div>
                </div>

                {/* Nav label */}
                <div style={{ padding: '20px 20px 8px' }}>
                    <p style={{
                        fontSize: 9, fontWeight: 800, letterSpacing: '0.14em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: 0,
                    }}>
                        Main Menu
                    </p>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                        const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '9px 12px',
                                    borderRadius: 10,
                                    fontSize: 13,
                                    fontWeight: active ? 700 : 500,
                                    textDecoration: 'none',
                                    color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                                    background: active ? 'rgba(255,106,12,0.12)' : 'transparent',
                                    border: active ? '1px solid rgba(255,106,12,0.2)' : '1px solid transparent',
                                    transition: 'all 0.18s',
                                    letterSpacing: '-0.01em',
                                }}
                                onMouseEnter={e => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                                    }
                                }}
                            >
                                {/* Active left bar */}
                                {active && (
                                    <span style={{
                                        position: 'absolute', left: 0,
                                        top: '50%', transform: 'translateY(-50%)',
                                        width: 3, height: 18,
                                        background: 'linear-gradient(to bottom, #FF6A0C, #ff9a5c)',
                                        borderRadius: '0 3px 3px 0',
                                        boxShadow: '0 0 8px rgba(255,106,12,0.6)',
                                    }} />
                                )}
                                <Icon
                                    size={15}
                                    style={{ color: active ? '#FF6A0C' : 'rgba(255,255,255,0.25)', flexShrink: 0 }}
                                />
                                {label}
                                {/* Active dot */}
                                {active && (
                                    <span style={{
                                        marginLeft: 'auto',
                                        width: 5, height: 5, borderRadius: '50%',
                                        background: '#FF6A0C',
                                        boxShadow: '0 0 6px rgba(255,106,12,0.8)',
                                    }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div style={{ margin: '0 16px', height: 1, background: 'rgba(255,255,255,0.05)' }} />

                {/* User strip */}
                <div style={{
                    margin: '12px 10px 16px',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                        background: 'linear-gradient(135deg, #FF6A0C, #cc4400)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 900, color: '#fff',
                        boxShadow: '0 3px 10px rgba(255,106,12,0.35)',
                    }}>
                        A
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>Admin User</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: 0 }}>Super Admin</p>
                    </div>
                    <Link
                        href="/admin/login"
                        title="Logout"
                        style={{ color: 'rgba(255,255,255,0.2)', lineHeight: 0, transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FF6A0C')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                    >
                        <LogOut size={14} />
                    </Link>
                </div>
            </aside>

            {/* ══════════════════════════════
                MAIN AREA
            ══════════════════════════════ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1 }}>

                {/* ── Topbar ── */}
                <header style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 28px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(10,10,15,0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 30,
                    flexShrink: 0,
                }}>
                    {/* Left: breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>Dashboard</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.12)' }}>/</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                            {currentPage}
                        </span>
                    </div>

                    {/* Right: controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                        {/* Live pill */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '5px 12px',
                            background: 'rgba(74,222,128,0.08)',
                            border: '1px solid rgba(74,222,128,0.2)',
                            borderRadius: 20,
                        }}>
                            <span style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: '#4ade80',
                                boxShadow: '0 0 6px rgba(74,222,128,0.8)',
                                animation: 'pulse 2s infinite',
                            }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.06em' }}>LIVE</span>
                        </div>

                        {/* Location selector */}
                        <div style={{ position: 'relative' }}>
                            <select style={{
                                appearance: 'none',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.5)',
                                borderRadius: 9,
                                padding: '7px 32px 7px 12px',
                                fontSize: 12, fontWeight: 500,
                                outline: 'none', cursor: 'pointer',
                                fontFamily: 'inherit',
                                transition: 'border-color 0.2s',
                            }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.4)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                            >
                                <option>All Locations</option>
                                <option>Downtown</option>
                                <option>Marina</option>
                                <option>Motor City</option>
                            </select>
                            <ChevronDown size={12} style={{
                                position: 'absolute', right: 10, top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'rgba(255,255,255,0.3)',
                                pointerEvents: 'none',
                            }} />
                        </div>

                        {/* Notification bell */}
                        <button
                            style={{
                                position: 'relative',
                                width: 36, height: 36,
                                borderRadius: 9,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(255,255,255,0.35)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            }}
                        >
                            <Bell size={15} />
                            {/* Notification dot */}
                            <span style={{
                                position: 'absolute', top: 7, right: 7,
                                width: 7, height: 7, borderRadius: '50%',
                                background: '#FF6A0C',
                                border: '1.5px solid #0a0a0f',
                                boxShadow: '0 0 6px rgba(255,106,12,0.7)',
                            }} />
                        </button>

                        {/* Admin avatar */}
                        <div style={{
                            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                            background: 'linear-gradient(135deg, #FF6A0C, #cc4400)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 900, color: '#fff',
                            boxShadow: '0 3px 10px rgba(255,106,12,0.3)',
                            cursor: 'pointer',
                        }}>
                            A
                        </div>
                    </div>
                </header>

                {/* ── Page content ── */}
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '28px',
                    background: 'transparent',
                }}>
                    {children}
                </main>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.4; }
                }

                * { box-sizing: border-box; }

                select option {
                    background: #1a1a22;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}