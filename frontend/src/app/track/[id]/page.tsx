'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrder, API } from '@/lib/api';
import { Package, Clock, Check, ChefHat, Truck, XCircle, ArrowLeft, MapPin, Bell, Utensils } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const STATUS_STEPS = [
    { key: 'PENDING', label: 'Pending', icon: <Clock size={18} />, desc: 'Order received' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: <Check size={18} />, desc: 'Order accepted' },
    { key: 'PREPARING', label: 'Preparing', icon: <ChefHat size={18} />, desc: 'Chefs are cooking' },
    { key: 'READY', label: 'Ready', icon: <Package size={18} />, desc: 'Your order is ready!' },
    { key: 'DELIVERING', label: 'Delivering', icon: <Truck size={18} />, desc: 'On its way to you' },
    { key: 'COMPLETED', label: 'Completed', icon: <Check size={18} />, desc: 'Delivered!' },
];

function getStepIndex(status: string) {
    if (!status) return 0;
    const s = status.toUpperCase();
    if (s === 'CANCELLED') return -1;
    
    // Mapping backend statuses to UI steps
    if (s === 'ROUTING' || s === 'PENDING' || s === 'LONG_DISTANCE') return 0;
    if (s === 'CONFIRMED' || s === 'ACCEPTED') return 1;
    if (s === 'PREPARING' || s === 'COOKING') return 2;
    if (s === 'READY' || s === 'READY_FOR_PICKUP' || s === 'READY_FOR_DELIVERY') return 3;
    if (s === 'OUT_FOR_DELIVERY' || s === 'DELIVERING' || s === 'SHIPPED') return 4;
    if (s === 'COMPLETED' || s === 'DELIVERED') return 5;
    
    return 0;
}

export default function TrackOrderPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const socketRef = useRef<Socket | null>(null);

    // Request notification permission
    const requestPermission = async () => {
        if (!('Notification' in window)) return;
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setNotificationPermission(Notification.permission);
        }

        if (!orderId) return;

        // 1. Initial Load
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

        // 2. Real-time Setup
        const socketUrl = API.replace('/api', ''); // e.g. http://localhost:3001
        const socket = io(socketUrl);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to order tracking socket');
            socket.emit('joinOrderRoom', orderId);
        });

        socket.on('orderStatusUpdated', (updatedOrder: any) => {
            console.log('Real-time order update received:', updatedOrder);
            
            setOrder((prev: any) => {
                // Only notify if status actually changed
                if (prev && prev.status !== updatedOrder.status) {
                    showBrowserNotification(updatedOrder.status);
                }
                return { ...prev, ...updatedOrder };
            });
        });

        const showBrowserNotification = (status: string) => {
            if (Notification.permission === 'granted') {
                const step = STATUS_STEPS.find(s => s.key === status);
                new Notification('Sushi Fusion Update', {
                    body: `Your order status is now: ${step?.label || status}. ${step?.desc || ''}`,
                    icon: '/favicon.ico', // Placeholder if no logo is available
                });
            }
        };

        // 3. Fallback polling (every 60s)
        const interval = setInterval(load, 60000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
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
                                        {order.mode === 'DELIVERY' ? <><Truck size={12} style={{ verticalAlign: 'middle', marginBottom: 2 }} /> Delivery</> : <><Utensils size={12} style={{ verticalAlign: 'middle', marginBottom: 2 }} /> Dine-In</>} · Updates in real time
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Notifications Prompt */}
                        {notificationPermission === 'default' && !isCancelled && (
                            <div style={{
                                background: '#f0f9ff', borderRadius: 16, border: '1px solid #bae6fd',
                                padding: '16px 20px', marginBottom: 20,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Bell size={18} style={{ color: '#0369a1' }} />
                                    <p style={{ fontSize: 13, color: '#0369a1', fontWeight: 600, margin: 0 }}>
                                        Get browser notifications on status change?
                                    </p>
                                </div>
                                <button
                                    onClick={requestPermission}
                                    style={{
                                        background: '#0369a1', color: '#fff', border: 'none',
                                        padding: '8px 16px', borderRadius: 8, fontSize: 12,
                                        fontWeight: 700, cursor: 'pointer',
                                    }}
                                >
                                    Enable
                                </button>
                            </div>
                        ) || notificationPermission === 'denied' && (
                           <div style={{
                                background: '#fef2f2', borderRadius: 16, border: '1px solid #fecaca',
                                padding: '12px 20px', marginBottom: 20, textAlign: 'center'
                            }}>
                                <p style={{ fontSize: 12, color: '#991b1b', margin: 0 }}>
                                    Notifications are blocked. Please enable them in your browser settings to get live updates.
                                </p>
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
                                                    : <img src="/images/icons/fire.png" alt="" style={{ width: '60%', height: '60%', objectFit: 'contain', opacity: 0.4 }} />
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
