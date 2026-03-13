'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import {
    LayoutDashboard, ShoppingBag, Package,
    MapPin, Users, BarChart2, LogOut, Bell, ChevronDown,
    Settings, X,
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { API } from '@/lib/api';

const NAV_ITEMS = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    { label: 'Locations', href: '/admin/locations', icon: MapPin },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoaded } = useUser();

    // ── Notification state ──
    const [notifications, setNotifications] = useState<{ id: string; customer: string; total: string; time: Date }[]>([]);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // Connect to socket.io for new order events
    useEffect(() => {
        const socketUrl = API.replace('/api', '');
        const socket = io(socketUrl);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Admin: connected to notification socket');
            socket.emit('joinAdminRoom');
        });

        socket.on('newOrder', (order: any) => {
            console.log('Admin: new order received', order);
            setNotifications(prev => [
                {
                    id: order.id || order.orderId || 'unknown',
                    customer: order.customerName || 'Guest',
                    total: `AED ${(order.totalAmount || 0).toFixed(2)}`,
                    time: new Date(),
                },
                ...prev,
            ].slice(0, 20));

            // Browser notification
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('🍣 New Order Received!', {
                    body: `${order.customerName || 'Guest'} placed an order for AED ${(order.totalAmount || 0).toFixed(2)}`,
                    icon: '/sushi-fusion-logo.png',
                });
            }
        });

        // Also listen for status updates as a fallback
        socket.on('orderStatusUpdated', (order: any) => {
            if (order.status === 'PENDING' || order.status === 'ROUTING') {
                setNotifications(prev => {
                    if (prev.some(n => n.id === order.id)) return prev;
                    return [
                        {
                            id: order.id,
                            customer: order.customerName || 'Guest',
                            total: `AED ${(order.totalAmount || 0).toFixed(2)}`,
                            time: new Date(),
                        },
                        ...prev,
                    ].slice(0, 20);
                });
            }
        });

        // Request notification permission on mount
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => { socket.disconnect(); };
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        if (!showNotifDropdown) return;
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotifDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showNotifDropdown]);

    if (pathname.startsWith('/admin/login')) return <>{children}</>;

    // Determine user role from Clerk public metadata
    const userRole = (user?.publicMetadata?.role as string || 'customer').toLowerCase();
    
    // Filter Navigation Items based on Role
    const filteredNavItems = NAV_ITEMS.filter(item => {
        if (userRole === 'admin') {
            return true;
        }
        if (userRole === 'branch_manager') {
            return !['Analytics', 'Locations', 'Users', 'Settings'].includes(item.label);
        }
        return false;
    });

    const currentPage = filteredNavItems.find(n =>
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
                        background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(255,106,12,0.25)',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        <Image
                            src="/sushi-fusion-logo.png"
                            alt="Sushi Fusion Logo"
                            fill
                            style={{ objectFit: 'contain', padding: 2 }}
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
                    {filteredNavItems.map(({ label, href, icon: Icon }) => {
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
                        {isLoaded && user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {isLoaded ? (user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User') : 'Loading...'}
                        </p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: 0, textTransform: 'capitalize' }}>
                            {userRole.replace('_', ' ')}
                        </p>
                    </div>
                    <SignOutButton redirectUrl="/admin/login">
                        <button
                            title="Logout"
                            style={{ 
                                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                                color: 'rgba(255,255,255,0.2)', lineHeight: 0, transition: 'color 0.15s' 
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#FF6A0C')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                        >
                            <LogOut size={14} />
                        </button>
                    </SignOutButton>
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
                        <div ref={notifRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                                style={{
                                    position: 'relative',
                                    width: 36, height: 36,
                                    borderRadius: 9,
                                    background: showNotifDropdown ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${showNotifDropdown ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: showNotifDropdown ? '#fff' : 'rgba(255,255,255,0.35)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                                }}
                                onMouseLeave={e => {
                                    if (!showNotifDropdown) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    }
                                }}
                            >
                                <Bell size={15} />
                                {/* Notification count badge */}
                                {notifications.length > 0 && (
                                    <span style={{
                                        position: 'absolute', top: 4, right: 4,
                                        minWidth: 16, height: 16, borderRadius: 8,
                                        background: '#FF6A0C',
                                        border: '1.5px solid #0a0a0f',
                                        boxShadow: '0 0 6px rgba(255,106,12,0.7)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 9, fontWeight: 800, color: '#fff',
                                        padding: '0 3px',
                                    }}>
                                        {notifications.length > 9 ? '9+' : notifications.length}
                                    </span>
                                )}
                            </button>

                            {/* Notification dropdown */}
                            {showNotifDropdown && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: 8,
                                    width: 340,
                                    background: '#111118',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 14,
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                                    zIndex: 100,
                                    overflow: 'hidden',
                                }}>
                                    {/* Header */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '14px 16px',
                                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                                            Notifications
                                        </span>
                                        {notifications.length > 0 && (
                                            <button
                                                onClick={() => setNotifications([])}
                                                style={{
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    fontSize: 11, color: '#FF6A0C', fontWeight: 700,
                                                    fontFamily: 'inherit',
                                                }}
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                                                <Bell size={24} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 8 }} />
                                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
                                                    No new notifications
                                                </p>
                                            </div>
                                        ) : (
                                            notifications.map((notif, idx) => (
                                                <div
                                                    key={`${notif.id}-${idx}`}
                                                    onClick={() => {
                                                        setShowNotifDropdown(false);
                                                        router.push('/admin/orders');
                                                    }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                        padding: '12px 16px',
                                                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.14s',
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                                >
                                                    <div style={{
                                                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                                                        background: 'rgba(255,106,12,0.1)',
                                                        border: '1px solid rgba(255,106,12,0.2)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 16,
                                                    }}>
                                                        🍣
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>
                                                            New order from {notif.customer}
                                                        </p>
                                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                                                            {notif.total} · #{notif.id.slice(0, 8).toUpperCase()}
                                                        </p>
                                                    </div>
                                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', flexShrink: 0, fontWeight: 600 }}>
                                                        {Math.max(0, Math.floor((Date.now() - notif.time.getTime()) / 60000))} min
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div
                                        onClick={() => { setShowNotifDropdown(false); router.push('/admin/orders'); }}
                                        style={{
                                            padding: '12px 16px',
                                            borderTop: '1px solid rgba(255,255,255,0.06)',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'background 0.14s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#FF6A0C' }}>
                                            View All Orders →
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Admin avatar */}
                        <div style={{
                            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                            background: 'linear-gradient(135deg, #FF6A0C, #cc4400)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 900, color: '#fff',
                            boxShadow: '0 3px 10px rgba(255,106,12,0.3)',
                            cursor: 'pointer',
                        }}>
                            {isLoaded && user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
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