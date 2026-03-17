'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { useLocation } from '@/context/LocationContext';
import { apiCreateOrder, apiCreatePaymentIntent, getLocations, ApiLocation } from '@/lib/api';
import { DELIVERY_FEE } from '@/lib/data';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Check, ChevronRight, Lock, MapPin, Clock, CreditCard, Apple, Smartphone, Tag, ArrowLeft, ShieldCheck, Truck, Sparkles, Navigation, Utensils, ShoppingBag } from 'lucide-react';

// Make sure to call `loadStripe` outside of a component’s render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Step = 1 | 2 | 3 | 4;

const ALL_STEPS = [
    { num: 1 as Step, label: 'Details', short: 'You' },
    { num: 2 as Step, label: 'Delivery', short: 'Ship' },
    { num: 3 as Step, label: 'Payment', short: 'Pay' },
    { num: 4 as Step, label: 'Done', short: 'Done' },
];

/* ─── Haversine Distance helper ─── */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

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

/* ─── Stripe Payment Form Wrapper ─── */
function StripePaymentForm({ total, onPaymentSuccess, setProcessing }: { total: number, onPaymentSuccess: () => void, setProcessing: (p: boolean) => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            console.warn('Stripe or Elements not loaded.');
            return;
        }

        const paymentElement = elements.getElement(PaymentElement);
        if (!paymentElement) {
            setErrorMessage('Payment form is not ready. Please refresh or check your internet connection.');
            console.error('PaymentElement NOT mounted when handleSubmit called.');
            return;
        }

        setProcessing(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout`, 
            },
            redirect: 'if_required',
        });

        if (error) {
            console.error('Stripe Confirmation Error:', error);
            setErrorMessage(error.message || 'An unknown error occurred');
            setProcessing(false);
        } else {
            onPaymentSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <PaymentElement 
                options={{ layout: 'tabs' }} 
                onReady={() => setIsReady(true)}
                onChange={(event) => {
                    setIsComplete(event.complete);
                }}
            />
            
            {errorMessage && (
                <div style={{ 
                    color: '#ef4444', 
                    fontSize: 13, 
                    padding: '10px 14px', 
                    background: '#fee2e2', 
                    borderRadius: 10,
                    border: '1px solid #fecaca',
                    lineHeight: 1.4
                }}>
                    <strong>Note:</strong> {errorMessage}
                </div>
            )}
            
            <button
                type="submit"
                disabled={!stripe || !isReady || !isComplete}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px 24px',
                    background: (!stripe || !isReady || !isComplete) ? '#f0a070' : '#FF6A0C',
                    border: 'none', borderRadius: 12,
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    cursor: (!stripe || !isReady || !isComplete) ? 'not-allowed' : 'pointer',
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'all 0.18s',
                    boxShadow: '0 3px 12px rgba(255,106,12,0.25)',
                    marginTop: '8px',
                    opacity: (!stripe || !isReady || !isComplete) ? 0.7 : 1
                }}
            >
                {!isReady ? 'Loading Form...' : `Pay AED ${total.toFixed(2)}`} <Lock size={14} />
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const { settings } = useSettings();
    const { location } = useLocation();
    const { user, isSignedIn, isLoaded } = useUser();
    
    const [step, setStep] = useState<Step>(1);
    const [loginMode, setLoginMode] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [orderMode, setOrderMode] = useState<'Delivery' | 'Pickup' | 'DineIn'>('Delivery');

    const displaySteps = ALL_STEPS.filter(s => orderMode !== 'DineIn' || s.num !== 3);

    // Form states
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginPhone, setLoginPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [instructions, setInstructions] = useState('');

    // Persist real coordinates and address from context
    const [customerLat, setCustomerLat] = useState(25.2048);
    const [customerLng, setCustomerLng] = useState(55.2708);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [branchName, setBranchName] = useState<string | null>(null);

    const [branches, setBranches] = useState<ApiLocation[]>([]);

    useEffect(() => {
        getLocations().then(setBranches).catch(console.error);
    }, []);

    // Auto-fill from LocationContext
    useEffect(() => {
        console.log('CheckoutPage: Received location from context:', location);
        if (location) {
            setSelectedBranchId(location.branchId);
            setStreet(location.address);
            setCustomerLat(location.lat);
            setCustomerLng(location.lng);
            if (location.mode) {
                setOrderMode(location.mode);
            }
        }
    }, [location]);

    // Auto-fill from Clerk User & Auto-skip Step 1
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            setGuestName(user.fullName || '');
            setGuestEmail(user.primaryEmailAddress?.emailAddress || '');
            // Some phone numbers might be in user.phoneNumbers
            if (user.phoneNumbers?.length > 0) {
              setGuestPhone(user.phoneNumbers[0].phoneNumber);
            }
            
            // If user is signed in and we are on step 1, skip it
            if (step === 1) {
                setStep(2);
            }
        }
    }, [isLoaded, isSignedIn, user, step]);

    const [payMethod, setPayMethod] = useState<'card' | 'apple' | 'google'>('card');

    const cartItems = Object.values(cart);
    const SUBTOTAL = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const DELIVERY = orderMode === 'Delivery' ? DELIVERY_FEE : 0;
    const TAX = +(SUBTOTAL * 0.05).toFixed(2);
    const DISCOUNT = promoApplied ? Math.round(SUBTOTAL * 0.1) : 0;
    const TOTAL = SUBTOTAL + DELIVERY + TAX - DISCOUNT;

    const next = () => {
        if (step === 1) setStep(2);
        else setStep(s => Math.min(s + 1, 4) as Step);
    };
    const back = () => {
        if (step === 1) {
            window.location.href = '/';
            return;
        }
        setStep(s => Math.max(s - 1, 1) as Step);
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation is not supported by your browser.');
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setCustomerLat(latitude);
                setCustomerLng(longitude);

                const processResults = (results: any) => {
                    if (results?.[0]) {
                        const addr = results[0];
                        setStreet(addr.formatted_address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                        const cityComp = addr.address_components?.find((c: any) => c.types.includes('locality'));
                        if (cityComp) setCity(cityComp.long_name);
                        const postComp = addr.address_components?.find((c: any) => c.types.includes('postal_code'));
                        if (postComp) setPostcode(postComp.long_name);
                        setSelectedAddress(addr.formatted_address || '');
                    }
                    findNearestBranch(latitude, longitude);
                };

                const findNearestBranch = (lat: number, lng: number) => {
                    if (!branches || branches.length === 0) return;
                    
                    const distances = branches.map(b => ({
                        b, dist: getDistance(lat, lng, b.latitude, b.longitude)
                    })).sort((a,b) => a.dist - b.dist);
                    
                    const openBranches = distances.filter(d => !d.b.isClosed);
                    // 1. First check within 20km
                    let assigned = openBranches.find(d => d.dist <= 20);
                    // 2. Fallback to 35km
                    if (!assigned) {
                        assigned = openBranches.find(d => d.dist <= 35);
                    }
                    // 3. Fallback to nearest open, regardless of distance
                    if (!assigned && openBranches.length > 0) {
                        assigned = openBranches[0];
                    }
                    // 4. Fallback to any nearest
                    if (!assigned && distances.length > 0) {
                        assigned = distances[0];
                    }
                    
                    if (assigned) {
                        setSelectedBranchId(assigned.b.id);
                        setBranchName(assigned.b.name);
                        console.log(`Assigned to ${assigned.b.name} (${assigned.dist.toFixed(1)}km away)`);
                    }
                };

                // Attempt reverse geocoding via Google Maps library
                try {
                    if (typeof google !== 'undefined' && google.maps) {
                        const geocoder = new google.maps.Geocoder();
                        const res = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });
                        processResults(res.results);
                    } else {
                        // Fallback: Direct API fetch if library not loaded
                        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                        if (apiKey) {
                            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
                            const data = await res.json();
                            if (data.status === 'OK') {
                                processResults(data.results);
                            } else {
                                throw new Error('Geocoding API status not OK');
                            }
                        } else {
                            throw new Error('API Key missing');
                        }
                    }
                } catch (err) {
                    console.error('Reverse geocoding failed:', err);
                    setStreet(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                    setSelectedAddress('Current Location (Coordinates)');
                    // Still attempt to attach a branch using literal coords
                    if (branches.length > 0) {
                        const distances = branches.map(b => ({
                            b, dist: getDistance(latitude, longitude, b.latitude, b.longitude)
                        })).sort((a,b) => a.dist - b.dist);
                        setSelectedBranchId(distances[0].b.id);
                        setBranchName(distances[0].b.name);
                    }
                }
                setIsLocating(false);
            },
            () => { alert('Unable to retrieve your location.'); setIsLocating(false); },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Fetch PaymentIntent when transitioning to Step 3
    useEffect(() => {
        if (step === 3 && !clientSecret && TOTAL > 0) {
            apiCreatePaymentIntent(TOTAL)
                .then(res => setClientSecret(res.clientSecret))
                .catch(err => alert('Failed to initialize payment: ' + err.message));
        }
    }, [step, TOTAL, clientSecret]);

    const handleOrderCreation = async () => {
        if (cartItems.length === 0) return alert('Your cart is empty');
        setIsProcessing(true);

        const addressParts = [street, city, postcode].filter(Boolean);
        const customerAddress = addressParts.length > 0
            ? `${addressParts.join(', ')}${instructions ? ` (Notes: ${instructions})` : ''}`
            : undefined;

        try {
            const res = await apiCreateOrder({
                clerkUserId: user?.id || undefined,
                customerName: guestName,
                customerPhone: guestPhone,
                customerEmail: guestEmail.trim() === '' ? undefined : guestEmail,
                customerStreet: street,
                customerCity: city,
                customerPostcode: postcode,
                deliveryInstructions: instructions,
                address: customerAddress,
                mode: orderMode === 'Delivery' ? 'DELIVERY' : orderMode === 'Pickup' ? 'PICKUP' : 'DINE_IN',
                latitude: Number(customerLat) || 0,
                longitude: Number(customerLng) || 0,
                branchId: selectedBranchId || '',
                items: cartItems.map((item: any) => ({
                    menuItemId: item.id,
                    quantity: item.qty,
                    unitPrice: Number(item.price),
                })),
            });
            setOrderId(res.id || res.orderId || 'NEW-ORDER');
            clearCart();
            next();
        } catch (e: any) {
            alert(e.message || 'Order creation failed');
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
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, zIndex: 60 }}>
                    <img src={settings.logoUrl || '/sushi-fusion-logo.png'} alt="Sushi Fusion" style={{ height: 28 }} />
                </Link>

                {/* Step progress — centered */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} className="step-progress">
                    {displaySteps.map((s, i) => {
                        const done = step > s.num;
                        const active = step === s.num;
                        // const future = step < s.num;
                        // For Dine-In, if we are at step 4, we consider step 2 "done" even though there is no step 3
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
                                        {done ? <Check size={13} strokeWidth={3} /> : (orderMode === 'DineIn' && s.num === 4 ? 3 : s.num)}
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
                                {i < displaySteps.length - 1 && (
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#a08060', fontWeight: 600 }} className="secure-badge">
                    <Lock size={12} />
                    <span className="secure-text">Secure</span>
                </div>
            </header>

            {/* ── Main layout ── */}
            <div style={{
                maxWidth: 980, margin: '0 auto',
                padding: '24px 16px',
                display: 'grid',
                gridTemplateColumns: '1fr 340px',
                gap: 24,
                alignItems: 'start',
            }} className="checkout-grid">

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
                                {!isSignedIn && (
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: '1fr 1fr',
                                        background: '#f2ede6', borderRadius: 12, padding: 4, marginBottom: 24,
                                    }}>
                                        {[
                                            { k: false, label: 'Guest Checkout', icon: <Sparkles size={14} /> },
                                            { k: true, label: 'Sign In', icon: <Lock size={14} /> },
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
                                )}

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
                                            <FInput 
                                                type="email" 
                                                placeholder="you@example.com"
                                                value={loginEmail}
                                                onChange={e => setLoginEmail(e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Phone Number">
                                            <FInput 
                                                placeholder="+971 50 000 0000"
                                                value={loginPhone}
                                                onChange={e => setLoginPhone(e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Password" hint={<><Link href="/forgot-password" style={{ color: '#FF6A0C', fontWeight: 600, fontSize: 11 }}>Forgot?</Link></>}>
                                            <FInput 
                                                type="password" 
                                                placeholder="••••••••"
                                                value={loginPassword}
                                                onChange={e => setLoginPassword(e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                )}

                                <ActionButton 
                                    onClick={next} 
                                    style={{ marginTop: 8 }}
                                    disabled={!loginMode 
                                        ? (!guestName.trim() || !guestPhone.trim() || !guestEmail.trim())
                                        : (!loginEmail.trim() || !loginPhone.trim() || !loginPassword.trim())}
                                >
                                    Continue to Delivery <ChevronRight size={16} />
                                </ActionButton>
                            </SectionCard>
                        </div>
                    )}

                    {/* ── STEP 2: Delivery ── */}
                    {step === 2 && (
                        <div style={{ animation: 'slideIn 0.3s ease both' }}>
                            <SectionCard
                                icon={orderMode === 'Delivery' ? <Truck size={16} /> : orderMode === 'Pickup' ? <ShoppingBag size={16} /> : <Utensils size={16} />}
                                title={orderMode === 'Delivery' ? 'Delivery Address' : orderMode === 'Pickup' ? 'Pickup Details' : 'Dine-In Details'}
                                subtitle={orderMode === 'Delivery' ? 'Where should we bring your order?' : orderMode === 'Pickup' ? 'Select a branch to pick up from' : 'Select a branch to dine in'}
                            >
                                {/* ── Mode Selector Tabs ── */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                                    background: '#f2ede6', borderRadius: 12, padding: 4, marginBottom: 24,
                                }}>
                                    {([
                                        { key: 'Delivery' as const, label: 'Delivery', icon: <Truck size={14} /> },
                                        { key: 'Pickup' as const, label: 'Pickup', icon: <ShoppingBag size={14} /> },
                                        { key: 'DineIn' as const, label: 'Dine In', icon: <Utensils size={14} /> },
                                    ]).map(({ key, label, icon }) => (
                                        <button key={key} onClick={() => setOrderMode(key)} style={{
                                            padding: '10px 12px', borderRadius: 9,
                                            border: 'none', cursor: 'pointer',
                                            fontFamily: '"DM Sans", sans-serif',
                                            fontSize: 13, fontWeight: 700,
                                            transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            background: orderMode === key ? '#fff' : 'transparent',
                                            color: orderMode === key ? '#FF6A0C' : '#a08060',
                                            boxShadow: orderMode === key ? '0 2px 10px rgba(0,0,0,0.08)' : 'none',
                                        }}>
                                            {icon} {label}
                                        </button>
                                    ))}
                                </div>

                                {/* ── Delivery Form ── */}
                                {orderMode === 'Delivery' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <button
                                            type="button"
                                            onClick={handleUseMyLocation}
                                            disabled={isLocating}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                                padding: '12px 16px',
                                                background: isLocating ? '#faf8f5' : '#fff5ee',
                                                border: '1.5px solid #ffdcc4',
                                                borderRadius: 12,
                                                color: '#FF6A0C', fontSize: 13, fontWeight: 700,
                                                cursor: isLocating ? 'wait' : 'pointer',
                                                fontFamily: '"DM Sans", sans-serif',
                                                transition: 'all 0.18s',
                                            }}
                                            onMouseEnter={e => { if (!isLocating) { e.currentTarget.style.background = '#fff0e0'; e.currentTarget.style.borderColor = '#ffb888'; } }}
                                            onMouseLeave={e => { if (!isLocating) { e.currentTarget.style.background = '#fff5ee'; e.currentTarget.style.borderColor = '#ffdcc4'; } }}
                                        >
                                            <Navigation size={15} style={{ animation: isLocating ? 'spin 1s linear infinite' : 'none' }} />
                                            {isLocating ? 'Detecting location…' : <><img src="/images/location.png" alt="" style={{ width: 15, height: 15, objectFit: 'contain', verticalAlign: 'middle' }} /> Use My Current Location</>}
                                        </button>

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

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            background: '#fff8f3', border: '1px solid #ffdcc4',
                                            borderRadius: 10, padding: '10px 14px',
                                        }}>
                                            <Clock size={14} style={{ color: '#FF6A0C', flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e', margin: '0 0 1px' }}>
                                                    Estimated delivery: 30–45 min
                                                </p>
                                                <p style={{ fontSize: 11, color: '#a08060', margin: 0 }}>
                                                    {branchName ? `Routed to: ${branchName}` : (selectedAddress ? `Delivering to: ${selectedAddress}` : 'From nearest branch')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Pickup Form ── */}
                                {orderMode === 'Pickup' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <Field label="Select Branch for Pickup">
                                            <select
                                                value={selectedBranchId || ''}
                                                onChange={e => {
                                                    setSelectedBranchId(e.target.value);
                                                    const branch = branches.find(b => b.id === e.target.value);
                                                    setBranchName(branch?.name || null);
                                                }}
                                                style={{
                                                    width: '100%', boxSizing: 'border-box',
                                                    padding: '12px 16px',
                                                    fontSize: 14, fontFamily: '"DM Sans", sans-serif',
                                                    color: '#1a1108',
                                                    background: '#faf8f5',
                                                    border: '1.5px solid #e8ddd2',
                                                    borderRadius: 12,
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <option value="">Choose a branch…</option>
                                                {branches.filter(b => !b.isClosed).map(b => (
                                                    <option key={b.id} value={b.id}>{b.name} — {b.address}</option>
                                                ))}
                                            </select>
                                        </Field>

                                        <Field label="Special Instructions" hint="Optional">
                                            <FInput
                                                placeholder="Any notes for the branch…"
                                                value={instructions}
                                                onChange={e => setInstructions(e.target.value)}
                                            />
                                        </Field>

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            background: '#f0f5ff', border: '1px solid #c4d8ff',
                                            borderRadius: 10, padding: '10px 14px',
                                        }}>
                                            <ShoppingBag size={14} style={{ color: '#4f7ff7', flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e', margin: '0 0 1px' }}>
                                                    Ready in 15–25 min · No delivery fee
                                                </p>
                                                <p style={{ fontSize: 11, color: '#a08060', margin: 0 }}>
                                                    {branchName ? `Pickup from: ${branchName}` : 'Please select a branch'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Dine-In Form ── */}
                                {orderMode === 'DineIn' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <Field label="Select Branch to Dine In">
                                            <select
                                                value={selectedBranchId || ''}
                                                onChange={e => {
                                                    setSelectedBranchId(e.target.value);
                                                    const branch = branches.find(b => b.id === e.target.value);
                                                    setBranchName(branch?.name || null);
                                                }}
                                                style={{
                                                    width: '100%', boxSizing: 'border-box',
                                                    padding: '12px 16px',
                                                    fontSize: 14, fontFamily: '"DM Sans", sans-serif',
                                                    color: '#1a1108',
                                                    background: '#faf8f5',
                                                    border: '1.5px solid #e8ddd2',
                                                    borderRadius: 12,
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <option value="">Choose a branch…</option>
                                                {branches.filter(b => !b.isClosed).map(b => (
                                                    <option key={b.id} value={b.id}>{b.name} — {b.address}</option>
                                                ))}
                                            </select>
                                        </Field>

                                        <Field label="Special Requests" hint="Optional">
                                            <FInput
                                                placeholder="Allergies, seating preferences…"
                                                value={instructions}
                                                onChange={e => setInstructions(e.target.value)}
                                            />
                                        </Field>

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            background: '#f0faf5', border: '1px solid #b8e6d0',
                                            borderRadius: 10, padding: '10px 14px',
                                        }}>
                                            <Utensils size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e', margin: '0 0 1px' }}>
                                                    Dine-In · No delivery fee
                                                </p>
                                                <p style={{ fontSize: 11, color: '#a08060', margin: 0 }}>
                                                    {branchName ? `Dining at: ${branchName}` : 'Please select a branch'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                    <BackButton onClick={back} />
                                    <ActionButton 
                                        onClick={orderMode === 'DineIn' ? handleOrderCreation : next} 
                                        style={{ flex: 1 }}
                                        disabled={
                                            orderMode === 'Delivery'
                                                ? (!street.trim() || !city.trim() || !postcode.trim())
                                                : !selectedBranchId
                                        }
                                    >
                                        {orderMode === 'DineIn' ? 'Place Order' : 'Continue to Payment'} <ChevronRight size={16} />
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

                                {/* Stripe Payment Element */}
                                <div style={{
                                    border: '1px solid #ddd0c2',
                                    borderRadius: 14, padding: '24px 20px',
                                    background: '#fff',
                                    marginBottom: 20,
                                }}>
                                    {clientSecret ? (
                                        <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                                            <StripePaymentForm total={TOTAL} onPaymentSuccess={handleOrderCreation} setProcessing={setIsProcessing} />
                                        </Elements>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#a08060', fontSize: 14 }}>
                                            Preparing payment...
                                        </div>
                                    )}
                                </div>

                                {/* Trust badges */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
                                    {['🔒 SSL Encrypted', '🛡 PCI Compliant', '💳 Stripe Secured'].map(b => (
                                        <span key={b} style={{ fontSize: 11, color: '#b09070', fontWeight: 600 }}>{b}</span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 10 }}>
                                    <BackButton onClick={back} />
                                    {/* ActionButton is handled inside the StripePaymentForm to trigger standard form submission */}
                                    <div style={{ flex: 1 }}></div>
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
                                    is being prepared. You'll receive a confirmation email shortly.
                                </p>

                                {/* Details card */}
                                <div style={{
                                    background: '#faf8f5', border: '1px solid #ede6dc',
                                    borderRadius: 14, padding: 20, textAlign: 'left', marginBottom: 28,
                                }}>
                                    {[
                                        { label: 'Estimated delivery', value: '30–45 minutes', bold: true },
                                        { label: 'Total paid', value: `AED ${TOTAL.toFixed(2)}`, highlight: true },
                                    ].map((row, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '10px 0',
                                            borderBottom: i < 1 ? '1px solid #ede6dc' : 'none',
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

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {orderId && (
                                        <Link href={`/track/${orderId}`}>
                                            <ActionButton onClick={() => {}}>
                                                <Truck size={18} /> Track Your Order
                                            </ActionButton>
                                        </Link>
                                    )}
                                    <Link href="/">
                                        <button style={{
                                            width: '100%', padding: '14px 24px',
                                            background: '#faf8f5', border: '1.5px solid #e8ddd2',
                                            borderRadius: 12, color: '#8a7060',
                                            fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                            fontFamily: '"DM Sans", sans-serif',
                                            transition: 'all 0.18s',
                                        }}>
                                            ← Back to Menu
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ════ RIGHT COLUMN — Order Summary ════ */}
                <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 14 }} className="summary-column">

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
                                            : <img src="/images/icons/fire.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain', opacity: 0.4 }} />
                                        }
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1108', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.name}
                                        </p>
                                        <p style={{ fontSize: 11, color: '#b09070', margin: 0 }}>× {item.qty}</p>
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1108', flexShrink: 0 }}>
                                        AED {(item.price * item.qty).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div style={{ padding: '14px 20px', borderTop: '1px solid #f0e8df', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { label: 'Subtotal', value: `AED ${SUBTOTAL.toFixed(2)}` },
                                { label: orderMode === 'Delivery' ? 'Delivery fee' : orderMode === 'Pickup' ? 'Pickup fee' : 'Dine-in fee', value: DELIVERY === 0 ? 'Free' : `AED ${DELIVERY.toFixed(2)}` },
                                { label: 'VAT (5%)', value: `AED ${TAX.toFixed(2)}` },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 13, color: '#a08060' }}>{row.label}</span>
                                    <span style={{ fontSize: 13, color: '#5a4030' }}>{row.value}</span>
                                </div>
                            ))}
                            {DISCOUNT > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>Promo (10% off)</span>
                                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>−AED {DISCOUNT.toFixed(2)}</span>
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
                
                @media (max-width: 900px) {
                    .checkout-grid { 
                        grid-template-columns: 1fr !important; 
                        padding: 16px 12px !important;
                        gap: 20px !important;
                    }
                    .summary-column {
                        position: static !important;
                        order: 2;
                    }
                    .step-progress {
                        display: none !important;
                    }
                    .secure-badge {
                        font-size: 10px !important;
                    }
                    .secure-text {
                        display: none;
                    }
                }

                @media (min-width: 600px) and (max-width: 900px) {
                   .step-progress {
                       display: flex !important;
                       transform: translateX(-50%) scale(0.8) !important;
                   }
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
function ActionButton({ onClick, children, loading, style, disabled }: {
    onClick: () => void; children: React.ReactNode; loading?: boolean; style?: React.CSSProperties; disabled?: boolean;
}) {
    const [hov, setHov] = useState(false);
    const isDisabled = loading || disabled;
    
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 24px',
                background: isDisabled ? '#f0a070' : hov ? '#e55a00' : '#FF6A0C',
                border: 'none', borderRadius: 12,
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                transition: 'all 0.18s',
                boxShadow: hov && !isDisabled ? '0 6px 24px rgba(255,106,12,0.4)' : '0 3px 12px rgba(255,106,12,0.25)',
                transform: hov && !isDisabled ? 'translateY(-1px)' : 'translateY(0)',
                letterSpacing: '0.01em',
                width: '100%',
                opacity: isDisabled ? 0.7 : 1,
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