'use client';

import { useState } from 'react';
import { Search, Eye, UserX, UserCheck } from 'lucide-react';

interface Customer {
    name: string; email: string; joined: string;
    orders: number; spend: string; status: 'Active' | 'Disabled';
}

const INITIAL: Customer[] = [
    { name: 'Ahmed Al Rashidi', email: 'ahmed@email.com', joined: 'Jan 12, 2025', orders: 18, spend: 'AED 3,204', status: 'Active'   },
    { name: 'Sara Nasser',      email: 'sara@email.com',  joined: 'Feb 3, 2025',  orders: 11, spend: 'AED 1,890', status: 'Active'   },
    { name: 'James Park',       email: 'james@email.com', joined: 'Nov 20, 2024', orders: 9,  spend: 'AED 1,640', status: 'Active'   },
    { name: 'Lena Hoffman',     email: 'lena@email.com',  joined: 'Mar 5, 2025',  orders: 7,  spend: 'AED 940',   status: 'Active'   },
    { name: 'Mohammed Sultan',  email: 'mo@email.com',    joined: 'Dec 1, 2024',  orders: 5,  spend: 'AED 765',   status: 'Active'   },
    { name: 'Aisha Khalid',     email: 'aisha@email.com', joined: 'Apr 8, 2025',  orders: 3,  spend: 'AED 278',   status: 'Disabled' },
    { name: 'David Chen',       email: 'david@email.com', joined: 'Oct 14, 2024', orders: 14, spend: 'AED 2,140', status: 'Active'   },
];

// Deterministic avatar colour from name initial
const AVATAR_COLORS = ['#FF6A0C','#818cf8','#34d399','#fbbf24','#f87171','#60a5fa','#a78bfa'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>(INITIAL);
    const [search, setSearch]       = useState('');

    const toggle = (email: string) =>
        setCustomers(prev => prev.map(c =>
            c.email === email ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } : c
        ));

    const filtered = customers.filter(c => {
        const q = search.toLowerCase();
        return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    });

    const activeCount   = customers.filter(c => c.status === 'Active').length;
    const disabledCount = customers.filter(c => c.status === 'Disabled').length;
    const totalSpend    = customers.reduce((sum, c) => sum + parseInt(c.spend.replace(/\D/g, '')), 0);

    return (
        <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.04em', color: '#fff' }}>
                        Customers
                    </h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                        {customers.length} registered customers
                    </p>
                </div>
            </div>

            {/* ── Summary stat pills ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20, animation: 'fadeUp 0.4s ease both', animationDelay: '0.06s' }}>
                {[
                    { label: 'Active',        value: activeCount,              color: '#4ade80', glow: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.2)'  },
                    { label: 'Disabled',      value: disabledCount,            color: '#f87171', glow: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.18)'},
                    { label: 'Total Spend',   value: `AED ${totalSpend.toLocaleString()}`, color: '#FF6A0C', glow: 'rgba(255,106,12,0.12)',  border: 'rgba(255,106,12,0.22)' },
                ].map((s, i) => (
                    <div key={s.label} style={{
                        background: s.glow,
                        border: `1px solid ${s.border}`,
                        borderRadius: 14, padding: '16px 20px',
                        position: 'relative', overflow: 'hidden',
                        animation: `fadeUp 0.4s ease both`,
                        animationDelay: `${0.08 + i * 0.07}s`,
                    }}>
                        <div style={{
                            position: 'absolute', top: -24, right: -24,
                            width: 80, height: 80, borderRadius: '50%',
                            background: `radial-gradient(circle, ${s.color}22 0%, transparent 70%)`,
                        }} />
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '0 0 6px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {s.label}
                        </p>
                        <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: s.color, letterSpacing: '-0.04em' }}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Search ── */}
            <div style={{ position: 'relative', maxWidth: 360, marginBottom: 16, animation: 'fadeUp 0.4s ease both', animationDelay: '0.16s' }}>
                <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email…"
                    style={{
                        width: '100%', boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10, padding: '9px 12px 9px 34px',
                        fontSize: 13, color: '#fff', outline: 'none',
                        fontFamily: 'inherit', transition: 'border-color 0.2s',
                    }}
                    onFocus={e  => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.4)')}
                    onBlur={e   => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                />
            </div>

            {/* ── Table ── */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                animation: 'fadeUp 0.45s ease both',
                animationDelay: '0.2s',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {['Customer', 'Joined', 'Orders', 'Total Spend', 'Status', 'Actions'].map((h, i) => (
                                <th key={h} style={{
                                    padding: '12px 20px',
                                    textAlign: i === 5 ? 'right' : 'left',
                                    fontSize: 10, fontWeight: 800,
                                    color: 'rgba(255,255,255,0.2)',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '52px 0', color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>
                                    No customers found.
                                </td>
                            </tr>
                        )}

                        {filtered.map((c, i) => {
                            const color   = avatarColor(c.name);
                            const active  = c.status === 'Active';

                            return (
                                <tr
                                    key={c.email}
                                    style={{
                                        borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                        transition: 'background 0.15s',
                                        opacity: active ? 1 : 0.5,
                                        animation: `fadeUp 0.4s ease both`,
                                        animationDelay: `${0.22 + i * 0.04}s`,
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {/* Customer */}
                                    <td style={{ padding: '13px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {/* Avatar */}
                                            <div style={{
                                                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                                                background: color + '20',
                                                border: `1px solid ${color}33`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 13, fontWeight: 900, color,
                                                boxShadow: `0 2px 8px ${color}22`,
                                            }}>
                                                {c.name[0]}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 1px', letterSpacing: '-0.01em' }}>
                                                    {c.name}
                                                </p>
                                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
                                                    {c.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Joined */}
                                    <td style={{ padding: '13px 20px' }}>
                                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{c.joined}</span>
                                    </td>

                                    {/* Orders */}
                                    <td style={{ padding: '13px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {/* Mini bar */}
                                            <div style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%', borderRadius: 99,
                                                    background: '#FF6A0C',
                                                    width: `${Math.round((c.orders / 18) * 100)}%`,
                                                    opacity: 0.75,
                                                }} />
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{c.orders}</span>
                                        </div>
                                    </td>

                                    {/* Spend */}
                                    <td style={{ padding: '13px 20px' }}>
                                        <span style={{ fontSize: 14, fontWeight: 800, color: '#FF6A0C', letterSpacing: '-0.02em' }}>
                                            {c.spend}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td style={{ padding: '13px 20px' }}>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            padding: '3px 10px', borderRadius: 20,
                                            fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                                            color:      active ? '#4ade80' : '#6b7280',
                                            background: active ? 'rgba(74,222,128,0.08)' : 'rgba(107,114,128,0.08)',
                                            border:     `1px solid ${active ? 'rgba(74,222,128,0.2)' : 'rgba(107,114,128,0.15)'}`,
                                        }}>
                                            <span style={{
                                                width: 5, height: 5, borderRadius: '50%',
                                                background: active ? '#4ade80' : '#6b7280',
                                                boxShadow: active ? '0 0 5px rgba(74,222,128,0.8)' : 'none',
                                                flexShrink: 0,
                                            }} />
                                            {c.status}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: '13px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                                            {/* View History */}
                                            <button
                                                style={{
                                                    height: 30, padding: '0 12px',
                                                    background: 'rgba(255,106,12,0.08)',
                                                    border: '1px solid rgba(255,106,12,0.2)',
                                                    borderRadius: 8, cursor: 'pointer',
                                                    fontSize: 11, fontWeight: 700,
                                                    color: '#FF6A0C',
                                                    display: 'flex', alignItems: 'center', gap: 5,
                                                    transition: 'all 0.15s',
                                                    fontFamily: 'inherit',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,106,12,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,106,12,0.35)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,106,12,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,106,12,0.2)';  }}
                                            >
                                                <Eye size={11} /> History
                                            </button>

                                            {/* Disable / Enable */}
                                            <button
                                                onClick={() => toggle(c.email)}
                                                style={{
                                                    width: 30, height: 30, borderRadius: 8,
                                                    background: 'transparent',
                                                    border: `1px solid ${active ? 'rgba(248,113,113,0.18)' : 'rgba(74,222,128,0.18)'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: active ? 'rgba(248,113,113,0.5)' : 'rgba(74,222,128,0.5)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s',
                                                }}
                                                title={active ? 'Disable customer' : 'Enable customer'}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.background     = active ? 'rgba(248,113,113,0.1)'  : 'rgba(74,222,128,0.1)';
                                                    e.currentTarget.style.borderColor    = active ? 'rgba(248,113,113,0.35)' : 'rgba(74,222,128,0.35)';
                                                    e.currentTarget.style.color          = active ? '#f87171' : '#4ade80';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.background     = 'transparent';
                                                    e.currentTarget.style.borderColor    = active ? 'rgba(248,113,113,0.18)' : 'rgba(74,222,128,0.18)';
                                                    e.currentTarget.style.color          = active ? 'rgba(248,113,113,0.5)'  : 'rgba(74,222,128,0.5)';
                                                }}
                                            >
                                                {active ? <UserX size={12} /> : <UserCheck size={12} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                input::placeholder { color: rgba(255,255,255,0.15) !important; }
            `}</style>
        </div>
    );
}