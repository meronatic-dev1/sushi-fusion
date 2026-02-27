'use client';

import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Download } from 'lucide-react';
import Image from 'next/image';

interface Product {
    id: string; name: string; category: string; price: number;
    available: boolean; dietary: string[]; imgSrc: string; orders: number;
}

const INITIAL: Product[] = [
    { id: '1',  name: 'Dear Box 16 Pcs',               category: 'Special Offers',    price: 89,  available: true,  dietary: [],         imgSrc: '/images/31.png',          orders: 145 },
    { id: '2',  name: 'Happy Box 16 Pcs',               category: 'Special Offers',    price: 99,  available: true,  dietary: [],         imgSrc: '/images/32.png',          orders: 122 },
    { id: '3',  name: 'Fusion VIP Moriwase 32 Pcs',     category: 'VIP Moriwase',      price: 199, available: true,  dietary: [],         imgSrc: '/images/17.png',          orders: 284 },
    { id: '4',  name: 'Salmon Sashimi 5 Pcs',           category: 'Sashimi',           price: 49,  available: true,  dietary: [],         imgSrc: '/images/33.png',          orders: 198 },
    { id: '5',  name: 'Mango Veggie Roll 8 Pcs',        category: 'Special Offers',    price: 39,  available: true,  dietary: ['Vegan'],  imgSrc: '/images/special-03.png',  orders: 87  },
    { id: '6',  name: 'Kappa Maki',                     category: 'Hoso Maki',         price: 19,  available: false, dietary: ['Vegan'],  imgSrc: '/images/43.png',          orders: 62  },
    { id: '7',  name: 'Dynamite Shrimp',                category: 'Starters',          price: 59,  available: true,  dietary: ['Spicy'],  imgSrc: '/images/128.png',         orders: 101 },
    { id: '8',  name: 'Chicken Katsu Curry Rice',       category: 'Curry & Fried Rice',price: 49,  available: true,  dietary: [],         imgSrc: '/images/99.png',          orders: 78  },
    { id: '9',  name: 'Fusion Rainbow Salmon Poke',     category: 'Poke Bowl',         price: 89,  available: true,  dietary: [],         imgSrc: '/images/110.png',         orders: 93  },
    { id: '10', name: 'Seafood Ramen',                  category: 'Noodles',           price: 69,  available: false, dietary: [],         imgSrc: '/images/133.png',         orders: 56  },
];

const CATS = ['All','Special Offers','VIP Moriwase','Sashimi','Hoso Maki','Starters','Curry & Fried Rice','Poke Bowl','Noodles','Beverages'];
const DIETARY_CFG: Record<string, { color: string; bg: string; border: string }> = {
    Vegan: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)'  },
    Spicy: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
};

export default function AdminProductsPage() {
    const [products, setProducts]   = useState<Product[]>(INITIAL);
    const [search, setSearch]       = useState('');
    const [cat, setCat]             = useState('All');
    const [avFilter, setAvFilter]   = useState<'All' | 'Available' | 'Unavailable'>('All');
    const [selected, setSelected]   = useState<string[]>([]);

    const toggle    = (id: string) => setProducts(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
    const toggleSel = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const filtered = products.filter(p => {
        const q = search.toLowerCase();
        return (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
            && (cat === 'All' || p.category === cat)
            && (avFilter === 'All' || (avFilter === 'Available' ? p.available : !p.available));
    });

    const avCount   = products.filter(p =>  p.available).length;
    const unavCount = products.filter(p => !p.available).length;
    const allChecked = selected.length === filtered.length && filtered.length > 0;

    // ── shared input style ──
    const inputStyle: React.CSSProperties = {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10, color: '#fff',
        fontSize: 13, outline: 'none',
        fontFamily: 'inherit', cursor: 'pointer',
        transition: 'border-color 0.2s',
    };

    return (
        <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.04em', color: '#fff' }}>Products</h2>
                    <p style={{ fontSize: 13, margin: 0, color: 'rgba(255,255,255,0.3)' }}>
                        <span style={{ color: '#4ade80', fontWeight: 700 }}>{avCount} available</span>
                        <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 8px' }}>·</span>
                        <span style={{ color: '#f87171', fontWeight: 700 }}>{unavCount} unavailable</span>
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    {/* CSV export */}
                    <button style={{
                        ...inputStyle,
                        padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6,
                        color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600,
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                    >
                        <Download size={13} /> Export CSV
                    </button>

                    {/* Add product */}
                    <button style={{
                        padding: '8px 18px',
                        background: 'linear-gradient(135deg, #FF6A0C, #e55a00)',
                        border: 'none', borderRadius: 10,
                        color: '#fff', fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        boxShadow: '0 4px 16px rgba(255,106,12,0.35)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        fontFamily: 'inherit', letterSpacing: '0.01em',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,106,12,0.45)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,106,12,0.35)'; }}
                    >
                        <Plus size={14} /> Add Product
                    </button>
                </div>
            </div>

            {/* ── Bulk action bar ── */}
            {selected.length > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: 'rgba(255,106,12,0.07)',
                    border: '1px solid rgba(255,106,12,0.22)',
                    borderRadius: 12, padding: '10px 18px',
                    marginBottom: 16,
                    animation: 'fadeUp 0.25s ease both',
                }}>
                    <span style={{ fontSize: 13, color: '#FF6A0C', fontWeight: 700 }}>
                        {selected.length} selected
                    </span>
                    <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
                    <button
                        style={{
                            ...inputStyle,
                            padding: '5px 12px', fontSize: 12, fontWeight: 600,
                            color: 'rgba(255,255,255,0.5)',
                        }}
                        onClick={() => { setProducts(prev => prev.map(p => selected.includes(p.id) ? { ...p, available: false } : p)); setSelected([]); }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                        Deactivate All
                    </button>
                    <button onClick={() => setSelected([])} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Clear
                    </button>
                </div>
            )}

            {/* ── Filters ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search products…"
                        style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 34px', cursor: 'text' }}
                        onFocus={e  => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.4)')}
                        onBlur={e   => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                    />
                </div>

                {/* Category */}
                <select value={cat} onChange={e => setCat(e.target.value)}
                    style={{ ...inputStyle, padding: '9px 14px', color: 'rgba(255,255,255,0.5)' }}
                    onFocus={e  => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.4)')}
                    onBlur={e   => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                    {CATS.map(c => <option key={c}>{c}</option>)}
                </select>

                {/* Availability */}
                <select value={avFilter} onChange={e => setAvFilter(e.target.value as typeof avFilter)}
                    style={{ ...inputStyle, padding: '9px 14px', color: 'rgba(255,255,255,0.5)' }}
                    onFocus={e  => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.4)')}
                    onBlur={e   => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                </select>
            </div>

            {/* ── Table ── */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                animation: 'fadeUp 0.45s ease both',
                animationDelay: '0.1s',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {/* Checkbox header */}
                            <th style={{ padding: '12px 20px', width: 36 }}>
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={() => setSelected(allChecked ? [] : filtered.map(p => p.id))}
                                    style={{ accentColor: '#FF6A0C', cursor: 'pointer', width: 14, height: 14 }}
                                />
                            </th>
                            {['Product', 'Category', 'Price', 'Orders', 'Tags', 'Available', 'Actions'].map((h, i) => (
                                <th key={h} style={{
                                    padding: '12px 16px',
                                    textAlign: i === 5 ? 'center' : i === 6 ? 'right' : 'left',
                                    fontSize: 10, fontWeight: 800,
                                    color: 'rgba(255,255,255,0.2)',
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '52px 0', color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>
                                    No products found.
                                </td>
                            </tr>
                        )}

                        {filtered.map((p, i) => (
                            <tr
                                key={p.id}
                                style={{
                                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                    opacity: p.available ? 1 : 0.38,
                                    transition: 'background 0.15s',
                                    animation: `fadeUp 0.4s ease both`,
                                    animationDelay: `${0.15 + i * 0.04}s`,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Checkbox */}
                                <td style={{ padding: '12px 20px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(p.id)}
                                        onChange={() => toggleSel(p.id)}
                                        style={{ accentColor: '#FF6A0C', cursor: 'pointer', width: 14, height: 14 }}
                                    />
                                </td>

                                {/* Product */}
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 42, height: 42, position: 'relative',
                                            borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                        }}>
                                            <Image src={p.imgSrc} alt={p.name} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#fff', fontSize: 13, letterSpacing: '-0.01em' }}>{p.name}</span>
                                    </div>
                                </td>

                                {/* Category */}
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 600,
                                        color: 'rgba(255,255,255,0.3)',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        borderRadius: 6, padding: '3px 8px',
                                    }}>
                                        {p.category}
                                    </span>
                                </td>

                                {/* Price */}
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: '#FF6A0C', letterSpacing: '-0.02em' }}>
                                        AED {p.price}
                                    </span>
                                </td>

                                {/* Orders */}
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {/* Mini bar */}
                                        <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: 99,
                                                background: '#FF6A0C',
                                                width: `${Math.round((p.orders / 284) * 100)}%`,
                                                opacity: 0.8,
                                            }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{p.orders}</span>
                                    </div>
                                </td>

                                {/* Dietary tags */}
                                <td style={{ padding: '12px 16px' }}>
                                    {p.dietary.length === 0
                                        ? <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 12 }}>—</span>
                                        : (
                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                {p.dietary.map(d => {
                                                    const dc = DIETARY_CFG[d] ?? { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.2)' };
                                                    return (
                                                        <span key={d} style={{
                                                            fontSize: 10, fontWeight: 700,
                                                            color: dc.color, background: dc.bg,
                                                            border: `1px solid ${dc.border}`,
                                                            borderRadius: 20, padding: '2px 8px',
                                                            letterSpacing: '0.04em',
                                                        }}>
                                                            {d}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )
                                    }
                                </td>

                                {/* Toggle */}
                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => toggle(p.id)}
                                        title={p.available ? 'Deactivate' : 'Activate'}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0, transition: 'transform 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    >
                                        {p.available
                                            ? <ToggleRight size={28} style={{ color: '#FF6A0C', filter: 'drop-shadow(0 0 5px rgba(255,106,12,0.5))' }} />
                                            : <ToggleLeft  size={28} style={{ color: 'rgba(255,255,255,0.15)' }} />
                                        }
                                    </button>
                                </td>

                                {/* Actions */}
                                <td style={{ padding: '12px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                                        {/* Edit */}
                                        <button
                                            style={{
                                                width: 30, height: 30, borderRadius: 8,
                                                background: 'transparent',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                        >
                                            <Pencil size={12} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            style={{
                                                width: 30, height: 30, borderRadius: 8,
                                                background: 'transparent',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                input[type="checkbox"] { accent-color: #FF6A0C; }
                input::placeholder { color: rgba(255,255,255,0.15) !important; }
                select option { background: #1a1a22; color: #fff; }
            `}</style>
        </div>
    );
}