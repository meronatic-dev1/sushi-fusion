'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getOrders } from '@/lib/api';
import Link from 'next/link';
import { Package, Clock, ChevronRight, ArrowLeft } from 'lucide-react';

export default function MyOrdersPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            // Fetch orders for the logged-in user
            // Note: Currently getOrders() might fetch based on branchId, 
            // but for a user we need a specific endpoint or filter.
            // Assuming the API handles getting personal orders if no branchId is passed
            // and auth token is present (Clerk).
            const loadOrders = async () => {
                try {
                    const data = await getOrders();
                    // Filter orders by user email just in case the backend returns everything
                    const userOrders = data.filter(o => o.customerEmail === user.primaryEmailAddress?.emailAddress);
                    setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                } catch (e) {
                    console.error('Failed to fetch orders:', e);
                } finally {
                    setLoading(false);
                }
            };
            loadOrders();
        } else if (isLoaded && !isSignedIn) {
            setLoading(false);
        }
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f3ee' }}>
                <div style={{ width: 40, height: 40, border: '3px solid #ede6dc', borderTopColor: '#FF6A0C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7f3ee', padding: 20, textAlign: 'center' }}>
                <Package size={64} color="#d4c4b0" style={{ marginBottom: 20 }} />
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1108', marginBottom: 10 }}>Please Sign In</h1>
                <p style={{ color: '#a08060', marginBottom: 24 }}>You need to be signed in to view your orders.</p>
                <Link href="/login" style={{ background: '#FF6A0C', color: '#fff', padding: '12px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
                    Sign In Now
                </Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f7f3ee', fontFamily: '"DM Sans", sans-serif', padding: '40px 20px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a08060', textDecoration: 'none', marginBottom: 24, fontWeight: 600 }}>
                    <ArrowLeft size={18} />
                    Back to Menu
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1a1108', margin: 0 }}>My Orders</h1>
                        <p style={{ color: '#a08060', margin: '4px 0 0' }}>Track and manage your recent sushi orders</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: 24, padding: '60px 20px', textAlign: 'center', border: '1px solid #ede6dc' }}>
                        <div style={{ width: 80, height: 80, background: '#fcfaf7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Package size={40} color="#FF6A0C" />
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1108', marginBottom: 8 }}>No orders found</h2>
                        <p style={{ color: '#a08060', marginBottom: 24 }}>You haven't placed any orders yet. Let's change that!</p>
                        <Link href="/" style={{ background: '#FF6A0C', color: '#fff', padding: '12px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, display: 'inline-block' }}>
                            Order Now
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {orders.map((order) => (
                            <Link key={order.id} href={`/track/${order.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{ 
                                    background: '#fff', 
                                    borderRadius: 20, 
                                    padding: '20px 24px', 
                                    border: '1px solid #ede6dc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.borderColor = '#FF6A0C';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = '#ede6dc';
                                }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                        <div style={{ 
                                            width: 52, 
                                            height: 52, 
                                            background: '#fff5ee', 
                                            borderRadius: 14, 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            color: '#FF6A0C'
                                        }}>
                                            <Package size={26} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1108', margin: 0 }}>
                                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                                </h3>
                                                <span style={{ 
                                                    fontSize: 11, 
                                                    fontWeight: 800, 
                                                    padding: '4px 10px', 
                                                    borderRadius: 100,
                                                    background: order.status === 'COMPLETED' ? '#ecfdf5' : '#fff7ed',
                                                    color: order.status === 'COMPLETED' ? '#059669' : '#ea580c',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#a08060' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Clock size={14} />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span>•</span>
                                                <span style={{ fontWeight: 700, color: '#3d2c1e' }}>AED {Number(order.totalAmount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} color="#d4c4b0" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
