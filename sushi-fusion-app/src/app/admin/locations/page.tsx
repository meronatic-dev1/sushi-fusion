'use client';

import { useState } from 'react';
import { Plus, Pencil, Phone, Clock, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';

interface Location {
    id: string; name: string; address: string; phone: string;
    hours: string; active: boolean; ordersToday: number; revenueToday: string;
}

const INITIAL_LOCATIONS: Location[] = [
    { id: '1', name: 'Sushi Fusion — Downtown',   address: '12 Al Wasl Rd, Downtown Dubai, UAE',       phone: '+971 4 123 4567', hours: '11:00 AM – 11:00 PM', active: true,  ordersToday: 42, revenueToday: 'AED 4,210' },
    { id: '2', name: 'Sushi Fusion — Marina',      address: 'Marina Walk, Dubai Marina, UAE',            phone: '+971 4 234 5678', hours: '10:00 AM – 12:00 AM', active: true,  ordersToday: 31, revenueToday: 'AED 3,050' },
    { id: '3', name: 'Sushi Fusion — Motor City',  address: 'Motors Square, Motor City, Dubai, UAE',     phone: '+971 4 345 6789', hours: '11:00 AM – 11:00 PM', active: false, ordersToday: 0,  revenueToday: 'AED 0'     },
];

export default function AdminLocationsPage() {
    const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
    const toggle = (id: string) => setLocations(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));

    const activeCount = locations.filter(l => l.active).length;

    return (
        <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.04em', color: '#fff' }}>
                        Locations
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: '#4ade80',
                            boxShadow: '0 0 7px rgba(74,222,128,0.9)',
                            display: 'inline-block',
                        }} />
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                            {activeCount} active branch{activeCount !== 1 ? 'es' : ''}
                        </span>
                    </div>
                </div>

                <button
                    style={{
                        padding: '9px 18px',
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
                    <Plus size={14} /> Add Branch
                </button>
            </div>

            {/* ── Location cards grid ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
            }}>
                {locations.map((loc, i) => (
                    <div
                        key={loc.id}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${loc.active ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'}`,
                            borderRadius: 16,
                            overflow: 'hidden',
                            opacity: loc.active ? 1 : 0.5,
                            transition: 'border-color 0.2s, opacity 0.3s, transform 0.2s',
                            animation: `fadeUp 0.4s ease both`,
                            animationDelay: `${i * 0.08}s`,
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = loc.active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = loc.active ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        }}
                    >
                        {/* ── Top bar: status + controls ── */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 18px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            {/* Status pill */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '4px 10px',
                                borderRadius: 20,
                                background: loc.active ? 'rgba(74,222,128,0.08)' : 'rgba(107,114,128,0.08)',
                                border: `1px solid ${loc.active ? 'rgba(74,222,128,0.2)' : 'rgba(107,114,128,0.15)'}`,
                            }}>
                                <span style={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: loc.active ? '#4ade80' : '#6b7280',
                                    boxShadow: loc.active ? '0 0 6px rgba(74,222,128,0.8)' : 'none',
                                    animation: loc.active ? 'pulse 2s infinite' : 'none',
                                }} />
                                <span style={{
                                    fontSize: 10, fontWeight: 800, letterSpacing: '0.07em',
                                    textTransform: 'uppercase',
                                    color: loc.active ? '#4ade80' : '#6b7280',
                                }}>
                                    {loc.active ? 'Open' : 'Inactive'}
                                </span>
                            </div>

                            {/* Toggle + edit */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <button
                                    onClick={() => toggle(loc.id)}
                                    title={loc.active ? 'Deactivate branch' : 'Activate branch'}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: 0, lineHeight: 0,
                                        transition: 'transform 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    {loc.active
                                        ? <ToggleRight size={24} style={{ color: '#FF6A0C', filter: 'drop-shadow(0 0 5px rgba(255,106,12,0.5))' }} />
                                        : <ToggleLeft  size={24} style={{ color: 'rgba(255,255,255,0.15)' }} />
                                    }
                                </button>
                                <button
                                    style={{
                                        width: 28, height: 28, borderRadius: 7,
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                                >
                                    <Pencil size={12} />
                                </button>
                            </div>
                        </div>

                        {/* ── Branch details ── */}
                        <div style={{ padding: '18px 20px 16px' }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
                                {loc.name}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                                {[
                                    { icon: <MapPin  size={12} />, text: loc.address },
                                    { icon: <Phone   size={12} />, text: loc.phone   },
                                    { icon: <Clock   size={12} />, text: loc.hours   },
                                ].map((row, ri) => (
                                    <div key={ri} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                                        <div style={{
                                            width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                                            background: 'rgba(255,106,12,0.1)',
                                            border: '1px solid rgba(255,106,12,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#FF6A0C',
                                            marginTop: 1,
                                        }}>
                                            {row.icon}
                                        </div>
                                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, fontWeight: 500 }}>
                                            {row.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Today stats strip ── */}
                        {loc.active && (
                            <div style={{
                                display: 'flex',
                                borderTop: '1px solid rgba(255,255,255,0.05)',
                            }}>
                                {/* Orders */}
                                <div style={{
                                    flex: 1, padding: '12px 0', textAlign: 'center',
                                    borderRight: '1px solid rgba(255,255,255,0.05)',
                                    position: 'relative', overflow: 'hidden',
                                }}>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'rgba(255,255,255,0.01)',
                                    }} />
                                    <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.04em', position: 'relative' }}>
                                        {loc.ordersToday}
                                    </p>
                                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative' }}>
                                        Orders Today
                                    </p>
                                </div>

                                {/* Revenue */}
                                <div style={{ flex: 1, padding: '12px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'rgba(255,106,12,0.03)',
                                    }} />
                                    <p style={{ fontSize: 20, fontWeight: 900, color: '#FF6A0C', margin: '0 0 2px', letterSpacing: '-0.04em', position: 'relative' }}>
                                        {loc.revenueToday}
                                    </p>
                                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative' }}>
                                        Revenue Today
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Inactive closed strip */}
                        {!loc.active && (
                            <div style={{
                                borderTop: '1px solid rgba(255,255,255,0.04)',
                                padding: '11px 20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                background: 'rgba(107,114,128,0.05)',
                            }}>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                    Branch Currently Closed
                                </span>
                            </div>
                        )}
                    </div>
                ))}

                {/* ── Add new branch placeholder ── */}
                <button
                    style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 12,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: 16, padding: '40px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        animation: `fadeUp 0.4s ease both`,
                        animationDelay: `${locations.length * 0.08}s`,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,106,12,0.35)';
                        e.currentTarget.style.background  = 'rgba(255,106,12,0.04)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.background  = 'rgba(255,255,255,0.02)';
                    }}
                >
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'rgba(255,106,12,0.1)',
                        border: '1px solid rgba(255,106,12,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s, box-shadow 0.2s',
                    }}>
                        <Plus size={20} style={{ color: '#FF6A0C' }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.35)', margin: '0 0 3px' }}>
                            Add new branch
                        </p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', margin: 0 }}>
                            Click to configure a new location
                        </p>
                    </div>
                </button>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.35; }
                }
            `}</style>
        </div>
    );
}