'use client';

import { TrendingUp, BarChart2, Users, ShoppingBag, Star, Clock } from 'lucide-react';

const TOP_10 = [
    { name: 'Fusion VIP Moriwase 32 Pcs',      orders: 284, pct: 22, revenue: 'AED 56,516' },
    { name: 'Dear Box 16 Pcs',                  orders: 231, pct: 18, revenue: 'AED 20,559' },
    { name: 'Salmon Sashimi 5 Pcs',             orders: 198, pct: 15, revenue: 'AED 9,702'  },
    { name: 'Happy Box 16 Pcs',                 orders: 176, pct: 14, revenue: 'AED 17,424' },
    { name: 'Party Platter 64 Pcs',             orders: 143, pct: 11, revenue: 'AED 37,037' },
    { name: 'Dynamite Shrimp',                  orders: 101, pct: 8,  revenue: 'AED 5,959'  },
    { name: 'Fusion Rainbow Salmon Poke Bowl',  orders: 93,  pct: 7,  revenue: 'AED 8,277'  },
    { name: 'Chicken Katsu Curry Rice',         orders: 78,  pct: 6,  revenue: 'AED 3,822'  },
    { name: 'Mango Veggie Roll 8 Pcs',          orders: 87,  pct: 7,  revenue: 'AED 3,393'  },
    { name: 'Fire & Sea Box A 16 Pcs',          orders: 65,  pct: 5,  revenue: 'AED 6,435'  },
];

const LEAST_5 = [
    { name: 'Seafood Ramen',              orders: 12 },
    { name: 'Veg Miso Soup',              orders: 15 },
    { name: 'Avo Tempura Nigiri 4 Pcs',  orders: 18 },
    { name: 'Mountain Dew',              orders: 20 },
    { name: 'Veg Yaki Sanuki Udon',      orders: 23 },
];

const CUSTOMER_STATS = [
    { label: 'New Customers',    value: '342',       icon: Users,      color: '#34d399', glow: 'rgba(52,211,153,0.15)'   },
    { label: 'Returning',        value: '712',        icon: TrendingUp, color: '#818cf8', glow: 'rgba(129,140,248,0.15)'  },
    { label: 'Peak Hour',        value: '7–9 PM',     icon: Clock,      color: '#fbbf24', glow: 'rgba(251,191,36,0.15)'   },
    { label: 'Top Customer LTV', value: 'AED 3,204',  icon: Star,       color: '#FF6A0C', glow: 'rgba(255,106,12,0.15)'   },
];

const PEAK_DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const PEAK_HOURS: Record<string, number[]> = {
    Mon: [2,3,1,5,8,9,7,4,3,2,4,6,8,9,7],
    Tue: [1,2,2,4,6,8,9,5,4,3,5,7,9,8,6],
    Wed: [1,1,2,3,7,9,8,6,5,4,6,8,9,7,5],
    Thu: [2,3,3,5,8,9,9,7,5,4,6,8,9,8,6],
    Fri: [3,4,4,6,9,9,8,7,6,5,7,9,9,8,7],
    Sat: [5,6,5,7,9,9,9,8,7,6,8,9,9,9,8],
    Sun: [4,5,4,6,8,9,8,7,6,5,7,8,9,8,7],
};
const HOURS = ['10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm','12am'];

const CATEGORY_PERF = [
    { name: 'Special Offers',    revenue: 48320, orders: 634 },
    { name: 'VIP Moriwase',      revenue: 38700, orders: 284 },
    { name: 'Sashimi',           revenue: 19200, orders: 198 },
    { name: 'Starters',          revenue: 12400, orders: 312 },
    { name: 'Poke Bowl',         revenue: 11400, orders: 128 },
    { name: 'Noodles',           revenue:  8900, orders: 143 },
    { name: 'Curry & Fried Rice',revenue:  7800, orders: 159 },
    { name: 'Beverages',         revenue:  2400, orders: 420 },
];
const MAX_REV = Math.max(...CATEGORY_PERF.map(c => c.revenue));

const RANK_CFG = [
    { bg: '#fbbf24', color: '#000' },
    { bg: '#9ca3af', color: '#000' },
    { bg: '#b45309', color: '#fff' },
];

// ── shared card style ──
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
    return (
        <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', animation: 'fadeUp 0.4s ease both' }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.04em', color: '#fff' }}>Analytics</h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Business intelligence — last 30 days</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {[
                        { opts: ['Last 30 days','This week','This month','This year'] },
                        { opts: ['All Locations','Downtown','Marina','Motor City'] },
                    ].map((sel, i) => (
                        <select key={i} style={{
                            appearance: 'none',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            color: 'rgba(255,255,255,0.45)',
                            borderRadius: 10, padding: '8px 14px',
                            fontSize: 12, fontWeight: 500,
                            outline: 'none', cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'border-color 0.2s',
                        }}
                            onFocus={e  => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.4)')}
                            onBlur={e   => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                        >
                            {sel.opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                    ))}
                </div>
            </div>

            {/* ── Most Ordered (top 10) ── */}
            <div style={{ ...card, animation: 'fadeUp 0.4s ease both', animationDelay: '0.06s' }}>
                <div style={cardHeader}>
                    <div style={iconBadge('#FF6A0C')}><Star size={13} style={{ color: '#FF6A0C' }} /></div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Most Ordered Products</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {TOP_10.map((p, i) => {
                        const rank = RANK_CFG[i];
                        return (
                            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {/* Rank badge */}
                                <div style={{
                                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                    background: rank ? rank.bg : 'rgba(255,255,255,0.07)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 9, fontWeight: 900,
                                    color: rank ? rank.color : 'rgba(255,255,255,0.3)',
                                }}>
                                    {i + 1}
                                </div>

                                {/* Bar + name */}
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
                                            width: `${p.pct * 4}%`,
                                            boxShadow: i === 0 ? '0 0 8px rgba(255,106,12,0.6)' : 'none',
                                        }} />
                                    </div>
                                </div>

                                {/* Revenue */}
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
                        {LEAST_5.map((p, i) => (
                            <div key={p.name} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '11px 0',
                                borderBottom: i < LEAST_5.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
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
                        {CUSTOMER_STATS.map(s => (
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
                            <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>New · 32%</span>
                            <span style={{ fontSize: 11, color: '#818cf8', fontWeight: 700 }}>Returning · 68%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 99, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.05)' }}>
                            <div style={{ width: '32%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} />
                            <div style={{ width: '68%', background: '#818cf8', boxShadow: '0 0 8px rgba(129,140,248,0.5)' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Peak hours heatmap ── */}
            <div style={{ ...card, animation: 'fadeUp 0.4s ease both', animationDelay: '0.18s' }}>
                <div style={cardHeader}>
                    <div style={iconBadge('#FF6A0C')}><Clock size={13} style={{ color: '#FF6A0C' }} /></div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Peak Order Hours Heatmap</h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <div style={{ minWidth: 600 }}>
                        {/* Hour labels */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8, marginLeft: 52 }}>
                            {HOURS.map(h => (
                                <div key={h} style={{ flex: 1, fontSize: 9, color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontWeight: 600 }}>{h}</div>
                            ))}
                        </div>

                        {/* Day rows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {PEAK_DAYS.map(day => (
                                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 46, fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right', flexShrink: 0, fontWeight: 600 }}>
                                        {day}
                                    </span>
                                    {PEAK_HOURS[day].map((val, hi) => (
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

                        {/* Legend */}
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
                    {CATEGORY_PERF.map((c, i) => {
                        const pct = Math.round((c.revenue / MAX_REV) * 100);
                        return (
                            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 16,
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