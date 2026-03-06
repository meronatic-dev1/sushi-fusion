'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Phone, Clock, ToggleLeft, ToggleRight, MapPin, X } from 'lucide-react';
import { getLocations, createLocation, updateLocation, toggleLocation, ApiLocation } from '@/lib/api';

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, color: '#fff',
    fontSize: 13, outline: 'none',
    fontFamily: 'inherit', cursor: 'text',
    transition: 'border-color 0.2s',
    padding: '10px 14px',
    width: '100%', boxSizing: 'border-box',
};

function BranchModal({
    onClose, onSave, initial,
}: {
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initial?: ApiLocation;
}) {
    const [name, setName] = useState(initial?.name ?? '');
    const [address, setAddress] = useState(initial?.address ?? '');
    const [latitude, setLatitude] = useState(initial?.latitude?.toString() ?? '');
    const [longitude, setLongitude] = useState(initial?.longitude?.toString() ?? '');
    const [openTime, setOpenTime] = useState(initial?.openTime ?? '10:00');
    const [closeTime, setCloseTime] = useState(initial?.closeTime ?? '22:00');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const save = async () => {
        if (!name || !address) {
            setError('Name and address are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await onSave({
                name,
                address,
                latitude: latitude ? parseFloat(latitude) : 0,
                longitude: longitude ? parseFloat(longitude) : 0,
                openTime: openTime || null,
                closeTime: closeTime || null,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const formatLabel = (time: string) => {
        if (!time) return '';
        const [h, m] = time.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', animation: 'fadeUp 0.2s ease both' }}>
            <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, width: 440, maxWidth: '95vw', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                        {initial ? 'Edit Branch' : 'Add New Branch'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                {error && (
                    <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: '#f87171', fontWeight: 600 }}>{error}</span>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Branch Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sushi Fusion — Downtown"
                            style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Address</label>
                        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 12 Al Wasl Rd, Downtown Dubai"
                            style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Latitude</label>
                            <input value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="25.2048"
                                style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Longitude</label>
                            <input value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="55.2708"
                                style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Opening Time</label>
                            <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer' }} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Closing Time</label>
                            <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer' }} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '11px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                    </button>
                    <button onClick={save} disabled={saving} style={{ flex: 2, padding: '11px 0', background: 'linear-gradient(135deg, #FF6A0C, #e55a00)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,106,12,0.35)', opacity: saving ? 0.7 : 1 }}>
                        {saving ? 'Saving...' : initial ? 'Save Changes' : 'Create Branch'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminLocationsPage() {
    const [locations, setLocations] = useState<ApiLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editLoc, setEditLoc] = useState<ApiLocation | null>(null);

    const load = () => {
        setLoading(true);
        getLocations()
            .then(setLocations)
            .catch(e => console.error('Failed to load locations', e))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleToggle = async (id: string) => {
        try {
            await toggleLocation(id);
            load();
        } catch (e: any) {
            console.error('Toggle failed', e);
        }
    };

    const handleSave = async (data: any) => {
        if (editLoc) {
            await updateLocation(editLoc.id, data);
        } else {
            await createLocation(data);
        }
        setShowModal(false);
        setEditLoc(null);
        load();
    };

    const formatHours = (open: string | null, close: string | null) => {
        if (!open && !close) return 'Hours not set';
        const fmt = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
            return `${dh}:${String(m).padStart(2, '0')} ${ampm}`;
        };
        return `${open ? fmt(open) : '?'} – ${close ? fmt(close) : '?'}`;
    };

    const activeCount = locations.filter(l => l.isActive).length;

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
                            {loading ? 'Loading…' : `${activeCount} active branch${activeCount !== 1 ? 'es' : ''}`}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setShowModal(true)}
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
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,106,12,0.35)'; }}
                >
                    <Plus size={14} /> Add Branch
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                    Loading locations…
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {locations.map((loc, i) => (
                        <div
                            key={loc.id}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${loc.isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'}`,
                                borderRadius: 16,
                                overflow: 'hidden',
                                opacity: loc.isActive ? 1 : 0.5,
                                transition: 'border-color 0.2s, opacity 0.3s, transform 0.2s',
                                animation: `fadeUp 0.4s ease both`,
                                animationDelay: `${i * 0.08}s`,
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = loc.isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = loc.isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            }}
                        >
                            {/* ── Top bar: status + controls ── */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '14px 18px',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '4px 10px', borderRadius: 20,
                                    background: loc.isActive ? 'rgba(74,222,128,0.08)' : 'rgba(107,114,128,0.08)',
                                    border: `1px solid ${loc.isActive ? 'rgba(74,222,128,0.2)' : 'rgba(107,114,128,0.15)'}`,
                                }}>
                                    <span style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: loc.isActive ? '#4ade80' : '#6b7280',
                                        boxShadow: loc.isActive ? '0 0 6px rgba(74,222,128,0.8)' : 'none',
                                        animation: loc.isActive ? 'pulse 2s infinite' : 'none',
                                    }} />
                                    <span style={{
                                        fontSize: 10, fontWeight: 800, letterSpacing: '0.07em',
                                        textTransform: 'uppercase',
                                        color: loc.isActive ? '#4ade80' : '#6b7280',
                                    }}>
                                        {loc.isActive ? 'Open' : 'Inactive'}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <button
                                        onClick={() => handleToggle(loc.id)}
                                        title={loc.isActive ? 'Deactivate branch' : 'Activate branch'}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0, transition: 'transform 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    >
                                        {loc.isActive
                                            ? <ToggleRight size={24} style={{ color: '#FF6A0C', filter: 'drop-shadow(0 0 5px rgba(255,106,12,0.5))' }} />
                                            : <ToggleLeft size={24} style={{ color: 'rgba(255,255,255,0.15)' }} />
                                        }
                                    </button>
                                    <button
                                        onClick={() => setEditLoc(loc)}
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
                                        { icon: <MapPin size={12} />, text: loc.address },
                                        { icon: <Clock size={12} />, text: formatHours(loc.openTime, loc.closeTime) },
                                    ].map((row, ri) => (
                                        <div key={ri} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                                            <div style={{
                                                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                                                background: 'rgba(255,106,12,0.1)',
                                                border: '1px solid rgba(255,106,12,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#FF6A0C', marginTop: 1,
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
                            {loc.isActive && (
                                <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ flex: 1, padding: '12px 0', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.01)' }} />
                                        <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.04em', position: 'relative' }}>
                                            {loc.ordersToday}
                                        </p>
                                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative' }}>
                                            Orders Today
                                        </p>
                                    </div>

                                    <div style={{ flex: 1, padding: '12px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,106,12,0.03)' }} />
                                        <p style={{ fontSize: 20, fontWeight: 900, color: '#FF6A0C', margin: '0 0 2px', letterSpacing: '-0.04em', position: 'relative' }}>
                                            AED {loc.revenueToday.toLocaleString()}
                                        </p>
                                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative' }}>
                                            Revenue Today
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!loc.isActive && (
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
                        onClick={() => setShowModal(true)}
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
                            e.currentTarget.style.background = 'rgba(255,106,12,0.04)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
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
            )}

            {(showModal || editLoc) && (
                <BranchModal
                    initial={editLoc || undefined}
                    onClose={() => { setShowModal(false); setEditLoc(null); }}
                    onSave={handleSave}
                />
            )}

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
                input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) brightness(0.6);
                }
                select option { background: #1a1a22; color: #fff; }
            `}</style>
        </div>
    );
}