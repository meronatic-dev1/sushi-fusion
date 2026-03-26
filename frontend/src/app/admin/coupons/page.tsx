'use client';

import { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, ApiCoupon } from '@/lib/api';
import { Plus, Edit2, Trash2, Tag, X, Check, Search, Percent, Hash } from 'lucide-react';

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<ApiCoupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        discount: 0,
        isPercent: true,
        isActive: true,
        usageLimit: '' as number | string,
        minimumSpend: 0,
        expiryDate: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getCoupons();
            setCoupons(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({ code: '', discount: 0, isPercent: true, isActive: true, usageLimit: '', minimumSpend: 0, expiryDate: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (c: ApiCoupon) => {
        setEditingId(c.id);
        setFormData({
            code: c.code,
            discount: c.discount,
            isPercent: c.isPercent,
            isActive: c.isActive,
            usageLimit: c.usageLimit === null ? '' : c.usageLimit,
            minimumSpend: c.minimumSpend,
            expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().slice(0, 16) : '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await deleteCoupon(id);
            await loadData();
        } catch (err: any) {
            alert('Error deleting coupon: ' + err.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                code: formData.code.toUpperCase(),
                discount: Number(formData.discount),
                isPercent: formData.isPercent,
                isActive: formData.isActive,
                usageLimit: formData.usageLimit === '' ? null : Number(formData.usageLimit),
                minimumSpend: Number(formData.minimumSpend),
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
            };

            if (editingId) {
                await updateCoupon(editingId, payload);
            } else {
                await createCoupon(payload);
            }
            setIsModalOpen(false);
            await loadData();
        } catch (err: any) {
            alert('Error saving coupon: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em', color: '#fff' }}>
                        Coupons
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                        Manage discount codes for the storefront
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#FF6A0C', color: '#fff',
                        border: 'none', borderRadius: 10,
                        padding: '10px 18px',
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(255,106,12,0.3)',
                    }}
                >
                    <Plus size={16} /> Create Coupon
                </button>
            </div>

            {/* Controls */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: 16, marginBottom: 24,
                display: 'flex', gap: 16
            }}>
                <div style={{
                    flex: 1, position: 'relative',
                    background: 'rgba(0,0,0,0.2)', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 14px 10px 40px',
                            background: 'transparent', border: 'none', color: '#fff',
                            fontSize: 14, outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20
            }}>
                {filteredCoupons.map(c => (
                    <div key={c.id} style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: `1px solid ${c.isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,106,12,0.2)'}`,
                        borderRadius: 14, padding: 20,
                        position: 'relative'
                    }}>
                        {!c.isActive && (
                            <span style={{ position: 'absolute', top: -10, right: 16, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20 }}>
                                INACTIVE
                            </span>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,106,12,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Tag size={20} style={{ color: '#FF6A0C' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                                    {c.code}
                                </h3>
                                <p style={{ margin: 0, fontSize: 14, color: '#4ade80', fontWeight: 600 }}>
                                    {c.isPercent ? `${c.discount}% OFF` : `${c.discount} AED OFF`}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                                <span>Minimum Spend:</span>
                                <span style={{ color: '#fff' }}>{c.minimumSpend > 0 ? `${c.minimumSpend} AED` : 'None'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                                <span>Usage limit:</span>
                                <span style={{ color: '#fff' }}>{c.usageLimit || 'Unlimited'} ({c.usageCount} used)</span>
                            </div>
                            {c.expiryDate && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                                    <span>Expires:</span>
                                    <span style={{ color: '#fff' }}>{new Date(c.expiryDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                            <button onClick={() => handleOpenEdit(c)} style={{ flex: 1, padding: 8, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Edit2 size={13} /> Edit
                            </button>
                            <button onClick={() => handleDelete(c.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: 440, background: '#111115', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' }}>
                                {editingId ? 'Edit Coupon' : 'Create Coupon'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>COUPON CODE</label>
                                <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER10" style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'monospace' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>DISCOUNT AMOUNT</label>
                                    <input required type="number" min="0" step="0.01" value={formData.discount || ''} onChange={e => setFormData({ ...formData, discount: e.target.valueAsNumber })} placeholder="e.g. 10" style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14 }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>DISCOUNT TYPE</label>
                                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4 }}>
                                        <button type="button" onClick={() => setFormData({ ...formData, isPercent: true })} style={{ flex: 1, padding: 6, borderRadius: 6, border: 'none', background: formData.isPercent ? 'rgba(255,255,255,0.1)' : 'transparent', color: formData.isPercent ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                            <Percent size={14} /> %
                                        </button>
                                        <button type="button" onClick={() => setFormData({ ...formData, isPercent: false })} style={{ flex: 1, padding: 6, borderRadius: 6, border: 'none', background: !formData.isPercent ? 'rgba(255,255,255,0.1)' : 'transparent', color: !formData.isPercent ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                            <Hash size={14} /> AED
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>MINIMUM SPEND (AED)</label>
                                    <input type="number" min="0" value={formData.minimumSpend || ''} onChange={e => setFormData({ ...formData, minimumSpend: e.target.valueAsNumber })} placeholder="0" style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14 }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>USAGE LIMIT</label>
                                    <input type="number" min="1" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} placeholder="Leave blank for unlimited" style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14 }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>EXPIRY DATE & TIME</label>
                                <input type="datetime-local" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14 }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} style={{ accentColor: '#FF6A0C', width: 16, height: 16 }} />
                                <label htmlFor="isActive" style={{ fontSize: 14, color: '#fff', cursor: 'pointer' }}>Coupon is active</label>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: 12, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: 12, background: '#FF6A0C', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {isSubmitting ? 'Saving...' : <><Check size={16} /> Save Coupon</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
