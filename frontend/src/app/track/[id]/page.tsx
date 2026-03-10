'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrder } from '@/lib/api';
import { Package, Clock, Check, ChefHat, Truck, XCircle, ArrowLeft, MapPin } from 'lucide-react';

const STATUS_STEPS = [
    { key: 'PENDING', label: 'Pending', icon: <Clock size={18} />, desc: 'Order received' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: <Check size={18} />, desc: 'Order accepted' },
    { key: 'PREPARING', label: 'Preparing', icon: <ChefHat size={18} />, desc: 'Chefs are cooking' },
    { key: 'READY', label: 'Ready', icon: <Package size={18} />, desc: 'Ready for pickup/delivery' },
    { key: 'COMPLETED', label: 'Completed', icon: <Truck size={18} />, desc: 'Delivered!' },
];

function getStepIndex(status: string) {
    if (status === 'CANCELLED') return -1;
    const idx = STATUS_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
}

export default function TrackOrderPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) return;
        const load = async () => {
            try {
                const data = await getOrder(orderId);
                setOrder(data);
            } catch (e: any) {
                setError('Order not found');
            } finally {
                setLoading(false);
            }
        };
        load();
        // Poll every 15 seconds for live updates
        const interval = setInterval(load, 15000);
        return () => clearInterval(interval);
    }, [orderId]);

    const shortId = orderId?.slice(0, 8).toUpperCase() || '';
    const currentStep = order ? getStepIndex(order.status) : 0;
    const isCancelled = order?.status === 'CANCELLED';

    return (
        <div style={{ minHeight: '100vh', background: '#f7f3ee', fontFamily: '"DM Sans", sans-serif' }}>
            {/* Header */}
            <header style={{
                background: '#fff', borderBottom: '1px solid #ede6dc',
                padding: '0 24px', display: 'flex', alignItems: 'center',
                height: 64, position: 'sticky', top: 0, zIndex: 50,
                boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
            }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#3d2c1e' }}>
                    <ArrowLeft size={18} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Back to Menu</span>
                </Link>
            </header>

            <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 20px' }}>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ width: 40, height: 40, border: '3px solid #ede6dc', borderTopColor: '#FF6A0C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                        <p style={{ color: '#a08060', fontSize: 14 }}>Loading order…</p>
                    </div>
                )}

                {error && (
                    <div style={{
                        background: '#fff', borderRadius: 20, border: '1px solid #ede6dc',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                        padding: '48px 40px', textAlign: 'center',
                    }}>
                        <XCircle size={48} style={{ color: '#ef4444', marginBottom: 16 }} />
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1108', margin: '0 0 8px' }}>Order Not Found</h2>
                        <p style={{ fontSize: 14, color: '#a08060', margin: '0 0 24px' }}>We couldn't find an order with that ID.</p>
                        <Link href="/" style={{ display: 'inline-block', background: '#FF6A0C', color: '#fff', padding: '12px 28px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                            ← Back to Menu
                        </Link>
                    </div>
                )}

                {order && !loading && (
                    <>
                        {/* Order header card */}
                        <div style={{
                            background: isCancelled
                                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                : 'linear-gradient(135deg, #FF6A0C, #e55a00)',
                            borderRadius: 20, padding: '32px 28px', textAlign: 'center', marginBottom: 20,
                            boxShadow: '0 8px 32px rgba(255,106,12,0.25)',
                        }}>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 4px', fontWeight: 600 }}>ORDER</p>
                            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '0.04em' }}>
                                #{shortId}
                            </h1>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: 0, fontWeight: 500 }}>
                                {isCancelled ? 'This order has been cancelled' : `Status: ${order.status}`}
                            </p>
                        </div>

                        {/* ETA card */}
                        {!isCancelled && order.status !== 'COMPLETED' && (
                            <div style={{
                                background: '#fff', borderRadius: 16, border: '1px solid #ede6dc',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                                padding: '20px 24px', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 14,
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: '#fff5ee', border: '1px solid #ffd0b0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#FF6A0C', flexShrink: 0,
                                }}>
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 15, fontWeight: 800, color: '#1a1108', margin: '0 0 2px' }}>
                                        Estimated Time: {order.mode === 'DELIVERY' ? '30–45 min' : '15–20 min'}
                                    </p>
                                    <p style={{ fontSize: 12, color: '#a08060', margin: 0 }}>
                                        {order.mode === 'DELIVERY' ? '🚚 Delivery' : '🍽️ Dine-In'} · Updates in real time
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Progress tracker */}
                        <div style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #ede6dc',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                            padding: '28px 24px', marginBottom: 20,
                        }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1a1108', margin: '0 0 24px' }}>
                                Order Progress
                            </h3>

                            {isCancelled ? (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <XCircle size={48} style={{ color: '#ef4444', marginBottom: 12 }} />
                                    <p style={{ fontSize: 16, fontWeight: 700, color: '#ef4444', margin: 0 }}>Order Cancelled</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {STATUS_STEPS.map((step, i) => {
                                        const done = i <= currentStep;
                                        const active = i === currentStep;
                                        return (
                                            <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                                {/* Timeline line + dot */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36 }}>
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: '50%',
                                                        background: done ? '#FF6A0C' : '#f0ebe4',
                                                        color: done ? '#fff' : '#c4b5a5',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        border: active ? '3px solid rgba(255,106,12,0.3)' : '2px solid transparent',
                                                        transition: 'all 0.3s',
                                                        boxShadow: active ? '0 0 0 6px rgba(255,106,12,0.1)' : 'none',
                                                    }}>
                                                        {step.icon}
                                                    </div>
                                                    {i < STATUS_STEPS.length - 1 && (
                                                        <div style={{
                                                            width: 2, height: 32,
                                                            background: i < currentStep ? '#FF6A0C' : '#e0d5c8',
                                                            transition: 'background 0.3s',
                                                        }} />
                                                    )}
                                                </div>
                                                {/* Label */}
                                                <div style={{ paddingTop: 6, paddingBottom: i < STATUS_STEPS.length - 1 ? 20 : 0 }}>
                                                    <p style={{
                                                        fontSize: 14, fontWeight: active ? 800 : 600,
                                                        color: done ? '#1a1108' : '#c4b5a5',
                                                        margin: '0 0 2px', transition: 'all 0.3s',
                                                    }}>
                                                        {step.label}
                                                    </p>
                                                    <p style={{ fontSize: 12, color: '#a08060', margin: 0 }}>{step.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Order items */}
                        <div style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #ede6dc',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                            overflow: 'hidden', marginBottom: 20,
                        }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0e8df' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1a1108', margin: 0 }}>Order Items</h3>
                            </div>
                            <div style={{ padding: '12px 24px' }}>
                                {(order.orderItems || []).map((item: any, i: number) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 0',
                                        borderBottom: i < (order.orderItems?.length || 0) - 1 ? '1px solid #f0e8df' : 'none',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 10,
                                                background: '#f2ede6', border: '1px solid #e8ddd2',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden', flexShrink: 0,
                                            }}>
                                                {item.menuItem?.imageUrl
                                                    ? <img src={item.menuItem.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <span style={{ fontSize: 18 }}>🍣</span>
                                                }
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1108', margin: '0 0 2px' }}>
                                                    {item.menuItem?.name || 'Item'}
                                                </p>
                                                <p style={{ fontSize: 11, color: '#b09070', margin: 0 }}>× {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1108' }}>
                                            AED {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #f0e8df', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1108' }}>Total</span>
                                <span style={{ fontSize: 18, fontWeight: 900, color: '#FF6A0C' }}>
                                    AED {Number(order.totalAmount).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Delivery address */}
                        {order.customerAddress && (
                            <div style={{
                                background: '#fff8f3', borderRadius: 12,
                                border: '1px solid #ffd0b0', padding: '14px 18px',
                                display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
                            }}>
                                <MapPin size={16} style={{ color: '#FF6A0C', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#7a3d10', margin: '0 0 2px' }}>Delivery Address</p>
                                    <p style={{ fontSize: 12, color: '#a06040', margin: 0, lineHeight: 1.5 }}>{order.customerAddress}</p>
                                </div>
                            </div>
                        )}

                        {/* Back to menu */}
                        <Link href="/" style={{
                            display: 'block', textAlign: 'center',
                            background: '#FF6A0C', color: '#fff',
                            padding: '14px', borderRadius: 12,
                            textDecoration: 'none', fontWeight: 700, fontSize: 15,
                            boxShadow: '0 4px 16px rgba(255,106,12,0.3)',
                        }}>
                            ← Back to Menu
                        </Link>
                    </>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
