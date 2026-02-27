'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';

type Step = 1 | 2 | 3 | 4;

const MOCK_CART = [
    { name: 'Dear Box 16 Pcs', qty: 1, price: 89, imgSrc: '/images/31.png' },
    { name: 'Salmon Sashimi 5 Pcs', qty: 2, price: 49, imgSrc: '/images/33.png' },
    { name: 'Red Bull', qty: 2, price: 13, imgSrc: '/images/142.png' },
];

const SUBTOTAL = MOCK_CART.reduce((s, i) => s + i.price * i.qty, 0);
const DELIVERY_FEE = 15;

export default function CheckoutPage() {
    const [step, setStep] = useState<Step>(1);
    const [loginMode, setLoginMode] = useState(false);
    const mode = 'Delivery';

    const tax = +(SUBTOTAL * 0.05).toFixed(2);
    const total = SUBTOTAL + (mode === 'Delivery' ? DELIVERY_FEE : 0) + tax;
    const next = () => setStep(s => Math.min(s + 1, 4) as Step);
    const back = () => setStep(s => Math.max(s - 1, 1) as Step);

    const stepLabels = ['Your Details', 'Delivery', 'Payment', 'Confirmation'];

    // Shared input styling using the same CSS vars as the ordering page
    const inputStyle: React.CSSProperties = { borderRadius: 8, border: '1.5px solid var(--b)', fontSize: 13, padding: '10px 14px', fontFamily: 'Inter, sans-serif', width: '100%', outline: 'none', background: 'var(--w)', color: 'var(--d)' };
    const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--d)', marginBottom: 4, display: 'block' };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Top bar */}
            <header className="topbar" style={{ justifyContent: 'space-between' }}>
                <Link href="/" className="logo-wrap">
                    <img src="/sushi-fusion-logo.png" alt="Sushi Fusion" />
                </Link>
                <span style={{ fontFamily: 'Mashiro, sans-serif', fontSize: 18, fontWeight: 800 }}>Checkout</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--g)' }}>
                    🔒 Secure Checkout
                </div>
            </header>

            {/* Step progress bar */}
            <div style={{ background: 'var(--w)', borderBottom: '1px solid var(--b)', padding: '0 24px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex' }}>
                    {stepLabels.map((label, i) => {
                        const num = (i + 1) as Step;
                        const done = step > num;
                        const active = step === num;
                        return (
                            <div key={label} style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '12px 0', borderBottom: `3px solid ${active || done ? 'var(--o)' : 'transparent'}`,
                                color: active ? 'var(--o)' : done ? 'var(--o)' : 'var(--lg)',
                                fontSize: 13, fontWeight: active ? 700 : 600, fontFamily: 'Inter, sans-serif',
                                transition: 'all .2s',
                            }}>
                                <span style={{
                                    width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 800,
                                    background: done || active ? 'var(--o)' : 'var(--b)',
                                    color: done || active ? '#fff' : 'var(--lg)',
                                }}>
                                    {done ? '✓' : num}
                                </span>
                                <span className="hidden sm:block">{label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="lg:!grid-cols-[1fr_320px]">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Step 1 — Details */}
                    {step === 1 && (
                        <Card style={{ borderRadius: 'var(--rb)', border: '1px solid var(--b)', boxShadow: '0 1px 6px rgba(0,0,0,.07)' }}>
                            <CardHeader className="pb-0">
                                <CardTitle style={{ fontFamily: 'Mashiro, sans-serif', fontSize: 20 }}>Your Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Toggle */}
                                <div style={{ display: 'flex', border: '1.5px solid var(--b)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
                                    {[{ k: false, label: '✨ Continue as Guest' }, { k: true, label: '🔒 Login for faster checkout' }].map(({ k, label }) => (
                                        <button key={label} onClick={() => setLoginMode(k)} style={{
                                            flex: 1, padding: '10px 12px', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                                            fontFamily: 'Inter, sans-serif', transition: 'all .2s',
                                            background: loginMode === k ? '#fff5ef' : 'var(--w)',
                                            color: loginMode === k ? 'var(--o)' : 'var(--g)',
                                            borderBottom: loginMode === k ? '2px solid var(--o)' : '2px solid transparent',
                                        }}>{label}</button>
                                    ))}
                                </div>

                                {!loginMode ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <p style={{ fontSize: 12, color: 'var(--g)', background: '#fff5ef', padding: '8px 12px', borderRadius: 8 }}>
                                            No account needed. We&apos;ll create one after your order for easy tracking and reordering.
                                        </p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                            <div>
                                                <label style={labelStyle}>Full Name</label>
                                                <input placeholder="Ahmed Al Rashidi" style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Phone Number</label>
                                                <input placeholder="+971 50 000 0000" style={inputStyle} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Email Address</label>
                                            <input type="email" placeholder="you@example.com" style={inputStyle} />
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <p style={{ fontSize: 12, color: 'var(--g)', background: '#fff5ef', padding: '8px 12px', borderRadius: 8 }}>
                                            Sign in to auto-fill your saved details.
                                        </p>
                                        <div>
                                            <label style={labelStyle}>Email</label>
                                            <input type="email" placeholder="you@example.com" style={inputStyle} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <label style={labelStyle}>Password</label>
                                                <Link href="/forgot-password" style={{ fontSize: 11, color: 'var(--o)', fontWeight: 600 }}>Forgot?</Link>
                                            </div>
                                            <input type="password" placeholder="••••••••" style={inputStyle} />
                                        </div>
                                    </div>
                                )}

                                <button onClick={next} className="login-btn" style={{ width: '100%', textAlign: 'center', padding: '12px', fontSize: 14, borderRadius: 8, marginTop: 20 }}>
                                    Continue →
                                </button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2 — Delivery */}
                    {step === 2 && (
                        <Card style={{ borderRadius: 'var(--rb)', border: '1px solid var(--b)', boxShadow: '0 1px 6px rgba(0,0,0,.07)' }}>
                            <CardHeader className="pb-0">
                                <CardTitle style={{ fontFamily: 'Mashiro, sans-serif', fontSize: 20 }}>🛵 Delivery Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div>
                                        <label style={labelStyle}>Street Address</label>
                                        <input placeholder="12 Al Wasl Rd, Apt 4B" style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div>
                                            <label style={labelStyle}>City</label>
                                            <input placeholder="Dubai" style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Postcode</label>
                                            <input placeholder="00000" style={inputStyle} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Delivery Instructions <span style={{ fontWeight: 400, color: 'var(--lg)' }}>(optional)</span></label>
                                        <input placeholder="Leave at door, ring bell, etc." style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                                    <button onClick={back} style={{ flex: 1, fontSize: 13, height: 42, borderRadius: 8, border: '1.5px solid var(--b)', background: 'var(--w)', color: 'var(--d)', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all .2s' }}>Back</button>
                                    <button onClick={next} className="login-btn" style={{ flex: 1, textAlign: 'center', padding: '12px', fontSize: 13, borderRadius: 8 }}>Continue to Payment →</button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3 — Payment */}
                    {step === 3 && (
                        <Card style={{ borderRadius: 'var(--rb)', border: '1px solid var(--b)', boxShadow: '0 1px 6px rgba(0,0,0,.07)' }}>
                            <CardHeader className="pb-0">
                                <CardTitle style={{ fontFamily: 'Mashiro, sans-serif', fontSize: 20 }}>💳 Payment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ fontSize: 12, color: 'var(--g)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    🔒 Encrypted and processed by Stripe. Your card data never touches our servers.
                                </p>

                                {/* Payment method tabs */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                                    {['💳 Card', '🍎 Apple Pay', '🔵 Google Pay'].map((m, i) => (
                                        <button key={m} style={{
                                            padding: '10px 8px', fontSize: 12, fontWeight: 700, borderRadius: 8, cursor: 'pointer',
                                            fontFamily: 'Inter, sans-serif', transition: 'all .2s',
                                            border: i === 0 ? '2px solid var(--o)' : '1.5px solid var(--b)',
                                            background: i === 0 ? '#fff5ef' : 'var(--w)',
                                            color: i === 0 ? 'var(--o)' : 'var(--g)',
                                        }}>{m}</button>
                                    ))}
                                </div>

                                {/* Stripe placeholder */}
                                <div style={{ border: '2px dashed var(--b)', borderRadius: 12, padding: '32px 16px', textAlign: 'center', background: '#fafafa' }}>
                                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>💳</div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--g)' }}>Stripe Elements Card Form</p>
                                    <p style={{ fontSize: 11, color: 'var(--lg)', marginTop: 4 }}>PCI-DSS compliant · Visa, Mastercard, Amex</p>
                                </div>

                                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                                    <button onClick={back} style={{ flex: 1, fontSize: 13, height: 42, borderRadius: 8, border: '1.5px solid var(--b)', background: 'var(--w)', color: 'var(--d)', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all .2s' }}>Back</button>
                                    <button onClick={next} className="login-btn" style={{ flex: 1, textAlign: 'center', padding: '12px', fontSize: 13, borderRadius: 8 }}>Pay AED {total.toFixed(2)}</button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4 — Confirmation */}
                    {step === 4 && (
                        <Card style={{ borderRadius: 'var(--rb)', border: '1px solid var(--b)', boxShadow: '0 1px 6px rgba(0,0,0,.07)', textAlign: 'center', padding: '40px 24px' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8fbe8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>✅</div>
                            <h2 style={{ fontFamily: 'Mashiro, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Order Confirmed!</h2>
                            <p style={{ fontSize: 13, color: 'var(--g)', marginBottom: 20 }}>
                                Your order <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--o)' }}>#10483</span> has been placed.
                            </p>
                            <div style={{ background: '#fafafa', borderRadius: 10, padding: 16, textAlign: 'left', marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                    <span style={{ color: 'var(--g)' }}>Estimated delivery</span>
                                    <span style={{ fontWeight: 700 }}>30–45 minutes</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                    <span style={{ color: 'var(--g)' }}>Branch</span>
                                    <span style={{ fontWeight: 700 }}>Sushi Fusion — Downtown</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: 'var(--g)' }}>Total paid</span>
                                    <span style={{ fontWeight: 800, color: 'var(--o)' }}>AED {total.toFixed(2)}</span>
                                </div>
                            </div>
                            <p style={{ fontSize: 11, color: 'var(--lg)', marginBottom: 16 }}>
                                A confirmation email is on its way. Your account has been created — check your inbox to set a password.
                            </p>
                            <Link href="/">
                                <button className="login-btn" style={{ padding: '10px 28px', fontSize: 14, borderRadius: 8 }}>Back to Menu</button>
                            </Link>
                        </Card>
                    )}
                </div>

                {/* Right: Order Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Card style={{ borderRadius: 'var(--rb)', border: '1px solid var(--b)', boxShadow: '0 1px 6px rgba(0,0,0,.07)', padding: 0 }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>🛒</span>
                            <span className="cart-title" style={{ fontSize: 15, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Order Summary</span>
                        </div>
                        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {MOCK_CART.map(item => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="cart-item-emoji" style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden' }}>
                                        <img src={item.imgSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p className="cart-item-name" style={{ fontSize: 12 }}>{item.name}</p>
                                        <p style={{ fontSize: 11, color: 'var(--g)' }}>× {item.qty}</p>
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 800 }}>AED {(item.price * item.qty)}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--b)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--g)' }}>
                                <span>Subtotal</span><span>AED {SUBTOTAL}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--g)' }}>
                                <span>Delivery fee</span><span>AED {DELIVERY_FEE}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--g)' }}>
                                <span>VAT (5%)</span><span>AED {tax}</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--b)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--o)' }}>AED {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Promo */}
                    <Card style={{ borderRadius: 'var(--rb)', border: '1px solid var(--b)', boxShadow: '0 1px 4px rgba(0,0,0,.05)', padding: '14px 16px' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--d)', marginBottom: 8 }}>Promo Code</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input placeholder="Enter code..." style={{ ...inputStyle, flex: 1, padding: '8px 12px' }} />
                            <button style={{ fontSize: 12, padding: '8px 14px', borderRadius: 6, border: '1.5px solid var(--b)', background: 'var(--w)', color: 'var(--o)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Apply</button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
