'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { apiCreateOrder } from '@/lib/api';
import { Check, ChevronRight, Lock, MapPin, Clock, CreditCard, Apple, Smartphone, Tag, ArrowLeft, ShieldCheck, Truck, Sparkles } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

const STEPS = [
    { num: 1 as Step, label: 'Details', short: 'You' },
    { num: 2 as Step, label: 'Delivery', short: 'Ship' },
    { num: 3 as Step, label: 'Payment', short: 'Pay' },
    { num: 4 as Step, label: 'Done', short: 'Done' },
];

/* ─── Reusable field wrapper ─── */
function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e', letterSpacing: '0.03em', fontFamily: '"DM Sans", sans-serif' }}>
                    {label}
                </label>
                {hint && <span style={{ fontSize: 11, color: '#b08060', fontWeight: 500 }}>{hint}</span>}
            </div>
            {children}
        </div>
    );
}

/* ─── Styled input ─── */
function FInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    const [focused, setFocused] = useState(false);
    return (
        <input
            {...props}
            onFocus={e => { setFocused(true); props.onFocus?.(e); }}
            onBlur={e => { setFocused(false); props.onBlur?.(e); }}
            style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 16px',
                fontSize: 14, fontFamily: '"DM Sans", sans-serif',
                color: '#1a1108',
                background: focused ? '#fff' : '#faf8f5',
                border: `1.5px solid ${focused ? '#FF6A0C' : '#e8ddd2'}`,
                borderRadius: 12,
                outline: 'none',
                transition: 'all 0.18s',
                boxShadow: focused ? '0 0 0 3px rgba(255,106,12,0.1)' : 'none',
                ...props.style,
            }}
        />
    );
}

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const { settings } = useSettings();
    const [step, setStep] = useState<Step>(1);
    const [loginMode, setLoginMode] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    // Read real coordinates from LocationModal selection
    const [customerLat, setCustomerLat] = useState(25.2048);
    const [customerLng, setCustomerLng] = useState(55.2708);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('selectedLocation');
            if (stored) {
                try {
                    const loc = JSON.parse(stored);
                    if (loc.lat) setCustomerLat(loc.lat);
                    if (loc.lng) setCustomerLng(loc.lng);
                    if (loc.address) setSelectedAddress(loc.address);
                    if (loc.branchId) setSelectedBranchId(loc.branchId);
                } catch (e) {
                    // ignore parse errors
                }
            }
        }
    }, []);
    const [payMethod, setPayMethod] = useState<'card' | 'apple' | 'google'>('card');

    // Form states
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [instructions, setInstructions] = useState('');

    const cartItems = Object.values(cart);
    const SUBTOTAL = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const DELIVERY = 15;
    const TAX = +(SUBTOTAL * 0.05).toFixed(2);
    const DISCOUNT = promoApplied ? Math.round(SUBTOTAL * 0.1) : 0;
    const TOTAL = SUBTOTAL + DELIVERY + TAX - DISCOUNT;

    const next = () => setStep(s => Math.min(s + 1, 4) as Step);
    const back = () => setStep(s => Math.max(s - 1, 1) as Step);

    const handlePay = async () => {
        if (cartItems.length === 0) return alert('Your cart is empty');
        setIsProcessing(true);

        const addressParts = [street, city, postcode].filter(Boolean);
        const customerAddress = addressParts.length > 0
            ? `${addressParts.join(', ')}${instructions ? ` (Notes: ${instructions})` : ''}`
            : undefined;

        try {
            const res = await apiCreateOrder({
                userId: null,
                customerName: guestName,
                customerPhone: guestPhone,
                customerEmail: guestEmail,
                customerStreet: street,
                customerCity: city,
                customerPostcode: postcode,
                deliveryInstructions: instructions,
                customerAddress,
                mode: 'DELIVERY',
                totalAmount: TOTAL,
                customerLat,
                customerLng,
                branchId: selectedBranchId || undefined,
                items: cartItems.map((item: any) => ({
                    menuItemId: 'TEMP',
                    name: item.name,
                    quantity: item.qty,
                    unitPrice: item.price,
                })),
            });
            setOrderId(res.orderId || 'NEW-ORDER');
            clearCart();
            next();
        } catch (e: any) {
            alert(e.message || 'Payment failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f7f3ee', fontFamily: '"DM Sans", sans-serif' }}>

            {/* ── Top nav ── */}
            <header style={{
                background: '#fff',
                borderBottom: '1px solid #ede6dc',
                padding: '0 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 64,
                position: 'sticky', top: 0, zIndex: 50,
                boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
            }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {settings.logoUrl && <img src={settings.logoUrl} alt="Sushi Fusion" style={{ height: 32 }} />}
                </Link>

                {/* Step progress — centered */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    {STEPS.map((s, i) => {
                        const done = step > s.num;
                        const active = step === s.num;
                        const future = step < s.num;
                        return (
                            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                    <div style={{
                                        width: 30, height: 30, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 800,
                                        background: done ? '#FF6A0C' : active ? '#fff5ee' : '#f0ebe4',
                                        color: done ? '#fff' : active ? '#FF6A0C' : '#c4b5a5',
                                        border: `2px solid ${done ? '#FF6A0C' : active ? '#FF6A0C' : '#e0d5c8'}`,
                                        transition: 'all 0.3s',
                                        boxShadow: active ? '0 0 0 4px rgba(255,106,12,0.12)' : 'none',
                                    }}>
                                        {done ? <Check size={13} strokeWidth={3} /> : s.num}
                                    </div>
                                    <span style={{
                                        fontSize: 10, fontWeight: active ? 700 : 500,
                                        color: active ? '#FF6A0C' : done ? '#b87a50' : '#c4b5a5',
                                        letterSpacing: '0.02em',
                                        transition: 'all 0.3s',
                                    }}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{
                                        width: 40, height: 2, marginBottom: 14, marginLeft: 4, marginRight: 4,
                                        background: done ? '#FF6A0C' : '#e0d5c8',
                                        borderRadius: 99, transition: 'background 0.4s',
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#a08060', fontWeight: 600 }}>
                    <Lock size={12} />
                    Secure
                </div>
            </header>

            {/* ── Main layout ── */}
            <div style={{
                maxWidth: 980, margin: '0 auto',
                padding: '36px 20px',
                display: 'grid',
                gridTemplateColumns: '1fr 340px',
                gap: 28,
                alignItems: 'start',
            }}>

                {/* ════ LEFT COLUMN ════ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* ── STEP 1: Your Details ── */}
                    {step === 1 && (
                        <div style={{ animation: 'slideIn 0.3s ease both' }}>
                            <SectionCard
                                icon={<Sparkles size={16} />}
                                title="Your Details"
                                subtitle="We'll use this to send your confirmation"
                            >
                                {/* Guest / Login toggle */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    background: '#f2ede6', borderRadius: 12, padding: 4, marginBottom: 24,
                                }}>
                                    {[
                                        { k: false, label: 'Guest Checkout', icon: '✨' },
                                        { k: true, label: 'Sign In', icon: '🔑' },
                                    ].map(({ k, label, icon }) => (
                                        <button key={label} onClick={() => setLoginMode(k)} style={{
                                            padding: '10px 12px', borderRadius: 9,
                                            border: 'none', cursor: 'pointer',
                                            fontFamily: '"DM Sans", sans-serif',
                                            fontSize: 13, fontWeight: 700,
                                            transition: 'all 0.2s',
                                            background: loginMode === k ? '#fff' : 'transparent',
                                            color: loginMode === k ? '#FF6A0C' : '#a08060',
                                            boxShadow: loginMode === k ? '0 2px 10px rgba(0,0,0,0.08)' : 'none',
                                        }}>
                                            {icon} {label}
                                        </button>
                                    ))}
                                </div>

                                {!loginMode ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'flex-start', gap: 10,
                                            background: '#fff8f3', border: '1px solid #ffdcc4',
                                            borderRadius: 10, padding: '10px 14px',
                                        }}>
                                            <ShieldCheck size={15} style={{ color: '#FF6A0C', flexShrink: 0, marginTop: 1 }} />
                                            <p style={{ fontSize: 12, color: '#8a5c3a', margin: 0, lineHeight: 1.5 }}>
                                                No account needed. We'll create one after your order for easy tracking.
                                            </p>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                            <Field label="Full Name">
                                                <FInput
                                                    placeholder="Ahmed Al Rashidi"
                                                    value={guestName}
                                                    onChange={e => setGuestName(e.target.value)}
                                                />
                                            </Field>
                                            <Field label="Phone Number">
                                                <FInput
                                                    placeholder="+971 50 000 0000"
                                                    value={guestPhone}
                                                    onChange={e => setGuestPhone(e.target.value)}
                                                />
                                            </Field>
                                        </div>
                                        <Field label="Email Address">
                                            <FInput
                                                type="email"
                                                placeholder="you@example.com"
                                                value={guestEmail}
                                                onChange={e => setGuestEmail(e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <Field label="Email">
                                            <FInput type="email" placeholder="you@example.com" />
                                        </Field>
                                        <Field label="Password" hint={<><Link href="/forgot-password" style={{ color: '#FF6A0C', fontWeight: 600, fontSize: 11 }}>Forgot?</Link></>}>
                                            <FInput type="password" placeholder="••••••••" />
                                        </Field>
                                    </div>
                                )}

                                <ActionButton onClick={next} style={{ marginTop: 8 }}>
                                    Continue to Delivery <ChevronRight size={16} />
                                </ActionButton>
                            </SectionCard>
                        </div>
                    )}

                    {/* ── STEP 2: Delivery ── */}
                    {step === 2 && (
                        <div style={{ animation: 'slideIn 0.3s ease both' }}>
                            <SectionCard
                                icon={<Truck size={16} />}
                                title="Delivery Address"
                                subtitle="Where should we bring your order?"
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <Field label="Street Address">
                                        <FInput
                                            placeholder="12 Al Wasl Rd, Apt 4B"
                                            value={street}
                                            onChange={e => setStreet(e.target.value)}
                                        />
                                    </Field>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <Field label="City">
                                            <FInput
                                                placeholder="Dubai"
                                                value={city}
                                                onChange={e => setCity(e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Postcode">
                                            <FInput
                                                placeholder="00000"
                                                value={postcode}
                                                onChange={e => setPostcode(e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                    <Field label="Delivery Instructions" hint="Optional">
                                        <FInput
                                            placeholder="Leave at door, call on arrival…"
                                            value={instructions}
                                            onChange={e => setInstructions(e.target.value)}
                                        />
                                    </Field>

                                    {/* ETA pill */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        background: '#fff8f3', border: '1px solid #ffdcc4',
                                        borderRadius: 10, padding: '10px 14px',
                                    }}>
                                        <Clock size={14} style={{ color: '#FF6A0C', flexShrink: 0 }} />
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e', margin: '0 0 1px' }}>Estimated delivery: 30–45 min</p>
                                            <p style={{ fontSize: 11, color: '#a08060', margin: 0 }}>{selectedAddress ? `Delivering to: ${selectedAddress}` : 'From nearest branch'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                    <BackButton onClick={back} />
                                    <ActionButton onClick={next} style={{ flex: 1 }}>
                                        Continue to Payment <ChevronRight size={16} />
                                    </ActionButton>
                                </div>
                            </SectionCard>
                        </div>
                    )}

                    {/* ── STEP 3: Payment ── */}
                    {step === 3 && (
                        <div style={{ animation: 'slideIn 0.3s ease both' }}>
                            <SectionCard
                                icon={<CreditCard size={16} />}
                                title="Payment"
                                subtitle="Your data is encrypted and never stored on our servers"
                            >
                                {/* Payment method selector */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
                                    {([
                                        { key: 'card', label: 'Card', icon: <CreditCard size={18} /> },
                                        { key: 'apple', label: 'Apple Pay', icon: <Apple size={18} /> },
                                        { key: 'google', label: 'Google Pay', icon: <Smartphone size={18} /> },
                                    ] as const).map(m => (
                                        <button key={m.key} onClick={() => setPayMethod(m.key)} style={{
                                            padding: '14px 10px',
                                            borderRadius: 12, border: `2px solid ${payMethod === m.key ? '#FF6A0C' : '#e8ddd2'}`,
                                            background: payMethod === m.key ? '#fff8f3' : '#faf8f5',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                            cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                                            transition: 'all 0.18s',
                                            color: payMethod === m.key ? '#FF6A0C' : '#a08060',
                                            boxShadow: payMethod === m.key ? '0 0 0 4px rgba(255,106,12,0.1)' : 'none',
                                        }}>
                                            {m.icon}
                                            <span style={{ fontSize: 11, fontWeight: 700 }}>{m.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Stripe placeholder */}
                                <div style={{
                                    border: '1.5px dashed #ddd0c2',
                                    borderRadius: 14, padding: '36px 20px',
                                    textAlign: 'center',
                                    background: 'repeating-linear-gradient(45deg, #faf8f5, #faf8f5 8px, #f7f3ee 8px, #f7f3ee 16px)',
                                    marginBottom: 20,
                                }}>
                                    <CreditCard size={28} style={{ color: '#d4c4b0', marginBottom: 10 }} />
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#b0997e', margin: '0 0 4px' }}>Stripe Card Form</p>
                                    <p style={{ fontSize: 11, color: '#c4b5a5', margin: 0 }}>PCI-DSS compliant · Visa, Mastercard, Amex</p>
                                </div>

                                {/* Trust badges */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
                                    {['🔒 SSL Encrypted', '🛡 PCI Compliant', '💳 Stripe Secured'].map(b => (
                                        <span key={b} style={{ fontSize: 11, color: '#b09070', fontWeight: 600 }}>{b}</span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 10 }}>
                                    <BackButton onClick={back} />
                                    <ActionButton onClick={handlePay} loading={isProcessing} style={{ flex: 1 }}>
                                        {isProcessing ? 'Processing…' : <>Pay AED {TOTAL.toFixed(2)} <Lock size={14} /></>}
                                    </ActionButton>
                                </div>
                            </SectionCard>
                        </div>
                    )}

                    {/* ── STEP 4: Confirmation ── */}
                    {step === 4 && (
                        <div style={{ animation: 'slideIn 0.3s ease both' }}>
                            <div style={{
                                background: '#fff', borderRadius: 20,
                                border: '1px solid #ede6dc',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                                padding: '48px 40px',
                                textAlign: 'center',
                            }}>
                                {/* Success ring */}
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FF6A0C, #ff8c42)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 24px',
                                    boxShadow: '0 8px 32px rgba(255,106,12,0.35)',
                                }}>
                                    <Check size={36} color="#fff" strokeWidth={3} />
                                </div>

                                <h2 style={{ fontFamily: 'Mashiro, sans-serif', fontSize: 28, fontWeight: 800, color: '#1a1108', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                                    Order Confirmed!
                                </h2>
                                <p style={{ fontSize: 14, color: '#8a7060', margin: '0 0 32px', lineHeight: 1.6 }}>
                                    Your order{' '}
                                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#FF6A0C', background: '#fff5ee', padding: '2px 8px', borderRadius: 6 }}>
                                        #{orderId?.slice(0, 8).toUpperCase()}
                                    </span>{' '}
                                    is being prepared at our Downtown branch.
                                </p>

                                {/* Details card */}
                                <div style={{
                                    background: '#faf8f5', border: '1px solid #ede6dc',
                                    borderRadius: 14, padding: 20, textAlign: 'left', marginBottom: 28,
                                }}>
                                    {[
                                        { label: 'Estimated delivery', value: '30–45 minutes', bold: true },
                                        { label: 'Branch', value: 'Sushi Fusion — Downtown' },
                                        { label: 'Total paid', value: `AED ${TOTAL.toFixed(2)}`, highlight: true },
                                    ].map((row, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '10px 0',
                                            borderBottom: i < 2 ? '1px solid #ede6dc' : 'none',
                                        }}>
                                            <span style={{ fontSize: 13, color: '#a08060' }}>{row.label}</span>
                                            <span style={{ fontSize: 13, fontWeight: row.highlight ? 800 : 700, color: row.highlight ? '#FF6A0C' : '#1a1108' }}>
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <p style={{ fontSize: 12, color: '#b09070', marginBottom: 24, lineHeight: 1.6 }}>
                                    A confirmation email is on its way. Your account has been created — check your inbox to set a password.
                                </p>

                                <Link href="/">
                                    <ActionButton onClick={() => { }}>
                                        ← Back to Menu
                                    </ActionButton>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* ════ RIGHT COLUMN — Order Summary ════ */}
                <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Summary card */}
                    <div style={{
                        background: '#fff', borderRadius: 18,
                        border: '1px solid #ede6dc',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                        overflow: 'hidden',
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid #f0e8df',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#1a1108', fontFamily: 'Mashiro, sans-serif' }}>
                                Order Summary
                            </span>
                            <span style={{
                                fontSize: 11, fontWeight: 700, color: '#FF6A0C',
                                background: '#fff5ee', padding: '3px 9px', borderRadius: 20,
                                border: '1px solid #ffd0b0',
                            }}>
                                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Items */}
                        <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 280, overflowY: 'auto' }}>
                            {cartItems.length === 0 ? (
                                <p style={{ fontSize: 13, color: '#b09070', textAlign: 'center', padding: '20px 0' }}>Your cart is empty</p>
                            ) : cartItems.map((item: any) => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                                        background: '#f2ede6', border: '1px solid #e8ddd2',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {item.imgSrc
                                            ? <img src={item.imgSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <span style={{ fontSize: 20 }}>{item.emoji || '🍣'}</span>
                                        }
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1108', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.name}
                                        </p>
                                        <p style={{ fontSize: 11, color: '#b09070', margin: 0 }}>× {item.qty}</p>
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1108', flexShrink: 0 }}>
                                        AED {item.price * item.qty}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div style={{ padding: '14px 20px', borderTop: '1px solid #f0e8df', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { label: 'Subtotal', value: `AED ${SUBTOTAL}` },
                                { label: 'Delivery fee', value: `AED ${DELIVERY}` },
                                { label: 'VAT (5%)', value: `AED ${TAX}` },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 13, color: '#a08060' }}>{row.label}</span>
                                    <span style={{ fontSize: 13, color: '#5a4030' }}>{row.value}</span>
                                </div>
                            ))}
                            {DISCOUNT > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>Promo (10% off)</span>
                                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>−AED {DISCOUNT}</span>
                                </div>
                            )}
                            <div style={{ borderTop: '1.5px solid #ede6dc', paddingTop: 10, marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1108' }}>Total</span>
                                <span style={{ fontSize: 18, fontWeight: 900, color: '#FF6A0C', letterSpacing: '-0.03em' }}>
                                    AED {TOTAL.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Promo code */}
                    {step < 4 && (
                        <div style={{
                            background: '#fff', borderRadius: 14,
                            border: '1px solid #ede6dc',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                            padding: '14px 16px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                <Tag size={13} style={{ color: '#FF6A0C' }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e' }}>Promo Code</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <FInput
                                    placeholder="Enter code…"
                                    value={promoCode}
                                    onChange={e => setPromoCode(e.target.value)}
                                    disabled={promoApplied}
                                    style={{ flex: 1, padding: '9px 12px', fontSize: 13 }}
                                />
                                <button
                                    onClick={() => { if (promoCode.trim()) setPromoApplied(true); }}
                                    disabled={promoApplied || !promoCode.trim()}
                                    style={{
                                        padding: '9px 14px', borderRadius: 10,
                                        border: 'none', cursor: promoApplied ? 'default' : 'pointer',
                                        background: promoApplied ? '#22c55e' : '#FF6A0C',
                                        color: '#fff', fontSize: 12, fontWeight: 700,
                                        fontFamily: '"DM Sans", sans-serif',
                                        transition: 'all 0.18s', flexShrink: 0,
                                    }}
                                >
                                    {promoApplied ? '✓ Applied' : 'Apply'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Delivery info */}
                    {step < 4 && (
                        <div style={{
                            background: '#fff8f3', borderRadius: 12,
                            border: '1px solid #ffd0b0',
                            padding: '12px 14px',
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                        }}>
                            <MapPin size={14} style={{ color: '#FF6A0C', flexShrink: 0, marginTop: 1 }} />
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#7a3d10', margin: '0 0 2px' }}>
                                    {selectedAddress ? `Delivering to ${selectedAddress.substring(0, 40)}…` : 'Delivering from nearest branch'}
                                </p>
                                <p style={{ fontSize: 11, color: '#a06040', margin: 0 }}>
                                    Est. 30–45 min
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(12px); }
                    to   { opacity: 1; transform: translateX(0);    }
                }
                input::placeholder { color: #c4b5a5; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #e0d0c0; border-radius: 99px; }
                @media (max-width: 768px) {
                    .checkout-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}

/* ─── Section card wrapper ─── */
function SectionCard({ icon, title, subtitle, children }: {
    icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode;
}) {
    return (
        <div style={{
            background: '#fff', borderRadius: 20,
            border: '1px solid #ede6dc',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            overflow: 'hidden',
        }}>
            {/* Card header */}
            <div style={{
                padding: '20px 24px 18px',
                borderBottom: '1px solid #f5efe8',
                display: 'flex', alignItems: 'center', gap: 12,
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: '#fff5ee', border: '1px solid #ffd0b0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FF6A0C',
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1108', margin: '0 0 2px', fontFamily: 'Mashiro, sans-serif', letterSpacing: '-0.01em' }}>
                        {title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#a08060', margin: 0, fontWeight: 500 }}>{subtitle}</p>
                </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {children}
            </div>
        </div>
    );
}

/* ─── Primary action button ─── */
function ActionButton({ onClick, children, loading, style }: {
    onClick: () => void; children: React.ReactNode; loading?: boolean; style?: React.CSSProperties;
}) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            disabled={loading}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 24px',
                background: loading ? '#f0a070' : hov ? '#e55a00' : '#FF6A0C',
                border: 'none', borderRadius: 12,
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                transition: 'all 0.18s',
                boxShadow: hov && !loading ? '0 6px 24px rgba(255,106,12,0.4)' : '0 3px 12px rgba(255,106,12,0.25)',
                transform: hov && !loading ? 'translateY(-1px)' : 'translateY(0)',
                letterSpacing: '0.01em',
                width: '100%',
                ...style,
            }}
        >
            {children}
        </button>
    );
}

/* ─── Back button ─── */
function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '14px 18px',
            background: '#faf8f5', border: '1.5px solid #e8ddd2',
            borderRadius: 12, color: '#8a7060',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif',
            transition: 'all 0.18s', flexShrink: 0,
        }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f2ede6'; e.currentTarget.style.borderColor = '#d4c4b0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#faf8f5'; e.currentTarget.style.borderColor = '#e8ddd2'; }}
        >
            <ArrowLeft size={14} /> Back
        </button>
    );
}