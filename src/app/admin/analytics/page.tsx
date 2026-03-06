'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, Users, ShoppingBag, Star, Clock } from 'lucide-react';
import { getAnalyticsDashboard, DashboardData } from '@/lib/api';

const PEAK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return '12am';
    if (i < 12) return `${i}am`;
    if (i === 12) return '12pm';
    return `${i - 12}pm`;
});

const RANK_CFG = [
    { bg: '#fbbf24', color: '#000' },
    { bg: '#9ca3af', color: '#000' },
    { bg: '#b45309', color: '#fff' },
];

const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '22px 24px',
};

const cardHeader: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8,
    marginBottom: 20,
};

const iconBadge = (color: string): React.CSSProperties => ({
    width: 26, height: 26, borderRadius: 7, flexShrink: 0,
    background: color + '1a',
    border: `1px solid ${color}33`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
});

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalyticsDashboard()
            .then(setData)
            .catch(e => console.error('Failed to load analytics', e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif', textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                Loading analytics…
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif', textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                Failed to load analytics data.
            </div>
        );
    }

    const maxCatRev = Math.max(...data.categoryPerformance.map(c => c.revenue), 1);

    const customerStats = [
        { label: 'New Customers', value: data.customerStats.newCustomers.toLocaleString(), icon: Users, color: '#34d399', glow: 'rgba(52,211,153,0.15)' },
        { label: 'Returning', value: data.customerStats.returningCustomers.toLocaleString(), icon: TrendingUp, color: '#818cf8', glow: 'rgba(129,140,248,0.15)' },
        { label: 'Peak Hour', value: data.customerStats.peakHour, icon: Clock, color: '#fbbf24', glow: 'rgba(251,191,36,0.15)' },
        { label: 'Top Customer LTV', value: `AED ${data.customerStats.topLTV.toLocaleString()}`, icon: Star, color: '#FF6A0C', glow: 'rgba(255,106,12,0.15)' },
    ];

    return (
        <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', animation: 'fadeUp 0.4s ease both' }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.04em', color: '#fff' }}>Analytics</h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Business intelligence — all time</p>
                </div>
            </div>

            {/* ── Most Ordered (top 10) ── */}
            <div style={{ ...card, animation: 'fadeUp 0.4s ease both', animationDelay: '0.06s' }}>
                <div style={cardHeader}>
                    <div style={iconBadge('#FF6A0C')}><Star size={13} style={{ color: '#FF6A0C' }} /></div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Most Ordered Products</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {data.topProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>No product data yet.</div>
                    ) : data.topProducts.map((p, i) => {
                        const rank = RANK_CFG[i];
                        return (
                            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                    background: rank ? rank.bg : 'rgba(255,255,255,0.07)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 9, fontWeight: 900,
                                    color: rank ? rank.color : 'rgba(255,255,255,0.3)',
                                }}>
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.name}
                                        </span>
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginLeft: 10, fontWeight: 600 }}>
                                            {p.orders} orders
                                        </span>
                                    </div>
                                    <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', borderRadius: 99,
                                            background: i === 0
                                                ? 'linear-gradient(90deg, #FF6A0C, #ffb380)'
                                                : `rgba(255,106,12,${0.75 - i * 0.06})`,
                                            width: `${p.pct}%`,
                                            boxShadow: i === 0 ? '0 0 8px rgba(255,106,12,0.6)' : 'none',
                                        }} />
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: 12, fontWeight: 800, color: '#FF6A0C',
                                    flexShrink: 0, minWidth: 90, textAlign: 'right',
                                    letterSpacing: '-0.02em',
                                }}>
                                    {p.revenue}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Two-col: Least ordered + Customer insights ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, animation: 'fadeUp 0.4s ease both', animationDelay: '0.12s' }}>

                {/* Least ordered */}
                <div style={card}>
                    <div style={cardHeader}>
                        <div style={iconBadge('rgba(255,255,255,0.3)')}><BarChart2 size={13} style={{ color: 'rgba(255,255,255,0.35)' }} /></div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Least Ordered Products</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {data.leastProducts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>No product data yet.</div>
                        ) : data.leastProducts.map((p, i) => (
                            <div key={p.name} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '11px 0',
                                borderBottom: i < data.leastProducts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 20, height: 20, borderRadius: 5,
                                        background: 'rgba(255,255,255,0.06)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.25)',
                                    }}>
                                        {i + 1}
                                    </div>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{p.name}</span>
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    fontSize: 11, fontWeight: 700, color: '#f87171',
                                    background: 'rgba(248,113,113,0.08)',
                                    border: '1px solid rgba(248,113,113,0.18)',
                                    borderRadius: 20, padding: '2px 8px',
                                }}>
                                    {p.orders} orders
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer insights */}
                <div style={card}>
                    <div style={cardHeader}>
                        <div style={iconBadge('#FF6A0C')}><Users size={13} style={{ color: '#FF6A0C' }} /></div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Customer Insights</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                        {customerStats.map(s => (
                            <div key={s.label} style={{
                                background: s.glow,
                                border: `1px solid ${s.color}28`,
                                borderRadius: 12, padding: '14px 16px',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', top: -20, right: -20,
                                    width: 70, height: 70, borderRadius: '50%',
                                    background: `radial-gradient(circle, ${s.color}22 0%, transparent 70%)`,
                                }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <s.icon size={13} style={{ color: s.color }} />
                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                        {s.label}
                                    </span>
                                </div>
                                <p style={{ fontSize: 22, fontWeight: 900, margin: 0, color: s.color, letterSpacing: '-0.04em' }}>
                                    {s.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* New vs returning split bar */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                            <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>New · {data.customerStats.newPct}%</span>
                            <span style={{ fontSize: 11, color: '#818cf8', fontWeight: 700 }}>Returning · {data.customerStats.retPct}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 99, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.05)' }}>
                            <div style={{ width: `${data.customerStats.newPct}%`, background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} />
                            <div style={{ width: `${data.customerStats.retPct}%`, background: '#818cf8', boxShadow: '0 0 8px rgba(129,140,248,0.5)' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Peak hours heatmap (static) ── */}
            <div style={{ ...card, animation: 'fadeUp 0.4s ease both', animationDelay: '0.18s' }}>
                <div style={cardHeader}>
                    <div style={iconBadge('#FF6A0C')}><Clock size={13} style={{ color: '#FF6A0C' }} /></div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Peak Order Hours Heatmap</h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <div style={{ minWidth: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8, marginLeft: 52 }}>
                            {HOURS.map(h => (
                                <div key={h} style={{ flex: 1, fontSize: 9, color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontWeight: 600 }}>{h}</div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {PEAK_DAYS.map(day => (
                                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 46, fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right', flexShrink: 0, fontWeight: 600 }}>
                                        {day}
                                    </span>
                                    {data.peakHoursHeatmap[day]?.map((val, hi) => (
                                        <div
                                            key={hi}
                                            title={`${day} ${HOURS[hi]}: intensity ${val}`}
                                            style={{
                                                flex: 1, height: 26, borderRadius: 5,
                                                background: `rgba(255,106,12,${(val / 9) * 0.82 + 0.04})`,
                                                border: val >= 8 ? '1px solid rgba(255,106,12,0.3)' : '1px solid transparent',
                                                boxShadow: val >= 8 ? `0 0 6px rgba(255,106,12,${val / 9 * 0.4})` : 'none',
                                                transition: 'transform 0.15s',
                                                cursor: 'default',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.transform = 'scaleY(1.15)')}
                                            onMouseLeave={e => (e.currentTarget.style.transform = 'scaleY(1)')}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>Low</span>
                            {[0.08, 0.26, 0.45, 0.63, 0.9].map(op => (
                                <div key={op} style={{
                                    width: 20, height: 10, borderRadius: 3,
                                    background: `rgba(255,106,12,${op})`,
                                    border: op >= 0.7 ? '1px solid rgba(255,106,12,0.35)' : '1px solid transparent',
                                }} />
                            ))}
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>High</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Category performance ── */}
            <div style={{ ...card, animation: 'fadeUp 0.4s ease both', animationDelay: '0.24s' }}>
                <div style={cardHeader}>
                    <div style={iconBadge('#FF6A0C')}><ShoppingBag size={13} style={{ color: '#FF6A0C' }} /></div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Category Performance</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                    {data.categoryPerformance.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>No category data yet.</div>
                    ) : data.categoryPerformance.map((c, i) => {
                        const pct = Math.round((c.revenue / maxCatRev) * 100);
                        return (
                            <div key={c.name} style={{
                                display: 'flex', alignItems: 'center', gap: 16,
                                animation: `fadeUp 0.4s ease both`, animationDelay: `${0.28 + i * 0.04}s`,
                            }}>
                                <span style={{ width: 140, fontSize: 12, color: 'rgba(255,255,255,0.55)', flexShrink: 0, fontWeight: 500 }}>
                                    {c.name}
                                </span>
                                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', borderRadius: 99,
                                        background: i === 0
                                            ? 'linear-gradient(90deg, #FF6A0C, #ffb380)'
                                            : `rgba(255,106,12,${0.8 - i * 0.08})`,
                                        width: `${pct}%`,
                                        boxShadow: i === 0 ? '0 0 8px rgba(255,106,12,0.5)' : 'none',
                                        transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                                    }} />
                                </div>
                                <div style={{ display: 'flex', gap: 20, flexShrink: 0, textAlign: 'right' }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#FF6A0C', minWidth: 88, letterSpacing: '-0.02em' }}>
                                        AED {c.revenue.toLocaleString()}
                                    </span>
                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', minWidth: 68, fontWeight: 600 }}>
                                        {c.orders} orders
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                select option { background: #1a1a22; color: #fff; }
            `}</style>
        </div>
    );
}