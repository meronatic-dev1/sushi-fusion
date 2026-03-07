'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

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
                        background: 'linear-gradient(135deg, #FF6A0C, #ff9a5c)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(255,106,12,0.4)',
                        overflow: 'hidden',
                        flexShrink: 0,
                    }}>
                        <Image src="/sushi-fusion-logo.png" alt="Logo" width={42} height={42}
                            style={{ objectFit: 'cover', filter: 'brightness(0) invert(1)' }} />
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
                        {[
                            { label: 'Total Orders Today', value: '284', change: '+12%', up: true },
                            { label: 'Revenue This Week', value: 'AED 18,420', change: '+8.3%', up: true },
                            { label: 'Active Menu Items', value: '64', change: '2 updated', up: null },
                        ].map((stat, i) => (
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
                RIGHT PANEL — Login form
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

                <div style={{ width: '100%', maxWidth: '400px' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '36px' }}>
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Email */}
                        <div>
                            <label style={{
                                display: 'block', fontSize: 12, fontWeight: 600,
                                color: 'rgba(255,255,255,0.5)', marginBottom: '8px',
                                letterSpacing: '0.06em', textTransform: 'uppercase',
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.25)', pointerEvents: 'none',
                                }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="admin@sushifusion.ae"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        padding: '13px 14px 13px 42px',
                                        fontSize: 14, color: '#fff',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, background 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)';
                                        e.currentTarget.style.background = 'rgba(255,106,12,0.05)';
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{
                                    fontSize: 12, fontWeight: 600,
                                    color: 'rgba(255,255,255,0.5)',
                                    letterSpacing: '0.06em', textTransform: 'uppercase',
                                }}>
                                    Password
                                </label>
                                <Link href="#" style={{
                                    fontSize: 12, color: '#FF6A0C', textDecoration: 'none', fontWeight: 500,
                                    opacity: 0.8,
                                }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.25)', pointerEvents: 'none',
                                }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        padding: '13px 44px 13px 42px',
                                        fontSize: 14, color: '#fff',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, background 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)';
                                        e.currentTarget.style.background = 'rgba(255,106,12,0.05)';
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }}
                                />
                                {/* Toggle show password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.3)', padding: 0, lineHeight: 0,
                                        transition: 'color 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <div style={{
                                width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                                border: '1.5px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.04)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                            </div>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Keep me signed in for 30 days</span>
                        </label>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                height: 52,
                                marginTop: 4,
                                background: isLoading
                                    ? 'rgba(255,106,12,0.5)'
                                    : 'linear-gradient(135deg, #FF6A0C 0%, #ff8c42 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                boxShadow: isLoading ? 'none' : '0 8px 24px rgba(255,106,12,0.35)',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => {
                                if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                        style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }}>
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                    </svg>
                                    Authenticating…
                                </>
                            ) : (
                                <>
                                    Access Dashboard
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 15, height: 15 }}>
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

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
                    }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
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
                                <path d="M19 12H5M12 5l-7 7 7 7"/>
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
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                input::placeholder { color: rgba(255,255,255,0.2) !important; }

                @media (max-width: 768px) {
                    .admin-left-panel { display: none !important; }
                    .admin-divider    { display: none !important; }
                }
            `}</style>
        </div>
    );
}