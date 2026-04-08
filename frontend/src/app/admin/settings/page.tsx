'use client';

import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Link as LinkIcon, ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage, API } from '@/lib/api';

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

export default function AdminSettingsPage() {
    const [logoUrl, setLogoUrl] = useState('');
    const [bannerUrls, setBannerUrls] = useState<string[]>(['', '', '']);
    const [serviceCharge, setServiceCharge] = useState(0);
    const [enableServiceCharge, setEnableServiceCharge] = useState(false);
    const [enableServiceChargeTakeaway, setEnableServiceChargeTakeaway] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(15.0);
    const [taxRate, setTaxRate] = useState(5.0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanners, setUploadingBanners] = useState<boolean[]>([false, false, false]);

    useEffect(() => {
        // Use the same dynamic API URL as the rest of the app
        fetch(`${API}/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.logoUrl) setLogoUrl(data.logoUrl);
                if (data.bannerUrls && Array.isArray(data.bannerUrls)) {
                    const urls = [...data.bannerUrls];
                    while (urls.length < 3) urls.push('');
                    setBannerUrls(urls.slice(0, 3));
                } else if (data.bannerUrl) {
                    // Fallback for migration
                    setBannerUrls([data.bannerUrl, '', '']);
                }
                setServiceCharge(data.serviceCharge || 0);
                setEnableServiceCharge(data.enableServiceCharge || false);
                setEnableServiceChargeTakeaway(data.enableServiceChargeTakeaway || false);
                if (data.deliveryFee !== undefined) setDeliveryFee(data.deliveryFee);
                if (data.taxRate !== undefined) setTaxRate(data.taxRate);
            })
            .catch(err => console.error('Failed to load settings', err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch(`${API}/settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logoUrl,
                    bannerUrls: bannerUrls.filter(u => !!u),
                    bannerUrl: bannerUrls[0] || '', // Maintain compatibility
                    serviceCharge: Number(serviceCharge),
                    enableServiceCharge,
                    enableServiceChargeTakeaway,
                    deliveryFee: Number(deliveryFee),
                    taxRate: Number(taxRate)
                }),
            });
            if (!res.ok) throw new Error('Failed to save settings');
            setMessage({ text: 'Settings updated successfully.', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Failed to save settings. Check backend connection.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ color: 'rgba(255,255,255,0.5)', padding: 40, fontFamily: '"DM Sans", sans-serif' }}>Loading settings...</div>;
    }

    return (
        <div style={{ maxWidth: 800, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{ marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.04em', color: '#fff' }}>
                    Store Settings
                </h2>
                <p style={{ fontSize: 13, margin: 0, color: 'rgba(255,255,255,0.4)' }}>
                    Customize the appearance of the customer portal.
                </p>
            </div>

            {/* Customization Card */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                padding: '24px 28px',
                animation: 'fadeUp 0.4s ease both',
                animationDelay: '0.1s'
            }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: '#fff' }}>Brand Identity</h3>

                {/* Logo */}
                <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                        Logo Image
                    </label>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        {/* File Upload Zone */}
                        <div style={{ flex: 1, position: 'relative' }}>
                            <input
                                type="file"
                                accept="image/*"
                                id="logo-upload"
                                style={{ display: 'none' }}
                                disabled={uploadingLogo}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            setUploadingLogo(true);
                                            const res = await uploadImage(file);
                                            setLogoUrl(res.url);
                                        } catch (err) {
                                            setMessage({ text: 'Failed to upload logo', type: 'error' });
                                        } finally {
                                            setUploadingLogo(false);
                                        }
                                    }
                                }}
                            />
                            <label
                                htmlFor="logo-upload"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)',
                                    borderRadius: 10, padding: '12px', cursor: uploadingLogo ? 'not-allowed' : 'pointer', color: '#fff', fontSize: 13,
                                    transition: 'background 0.2s', width: '100%', boxSizing: 'border-box',
                                    opacity: uploadingLogo ? 0.5 : 1
                                }}
                                onMouseEnter={e => { if (!uploadingLogo) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                                onMouseLeave={e => { if (!uploadingLogo) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                            >
                                {uploadingLogo ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                                {uploadingLogo ? 'Uploading...' : 'Upload New Logo'}
                            </label>
                        </div>
                        {logoUrl && (
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: 64, height: 64, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <img src={logoUrl} alt="Logo preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </div>
                                <button
                                    onClick={() => setLogoUrl('')}
                                    style={{
                                        position: 'absolute', top: -8, right: -8,
                                        width: 20, height: 20, borderRadius: '50%',
                                        background: '#f87171', border: 'none',
                                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Banners */}
                <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 12 }}>
                        Home Banners (Up to 3 images)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        {[0, 1, 2].map((idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`banner-upload-${idx}`}
                                        disabled={uploadingBanners[idx]}
                                        style={{ display: 'none' }}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                try {
                                                    const nextUploading = [...uploadingBanners];
                                                    nextUploading[idx] = true;
                                                    setUploadingBanners(nextUploading);
                                                    const res = await uploadImage(file);
                                                    const nextUrls = [...bannerUrls];
                                                    nextUrls[idx] = res.url;
                                                    setBannerUrls(nextUrls);
                                                } catch (err) {
                                                    setMessage({ text: `Failed to upload banner ${idx + 1}`, type: 'error' });
                                                } finally {
                                                    const nextUploading = [...uploadingBanners];
                                                    nextUploading[idx] = false;
                                                    setUploadingBanners(nextUploading);
                                                }
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor={`banner-upload-${idx}`}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)',
                                            borderRadius: 10, height: 120, cursor: uploadingBanners[idx] ? 'not-allowed' : 'pointer', color: '#fff', fontSize: 12,
                                            transition: 'background 0.2s', width: '100%', boxSizing: 'border-box',
                                            opacity: uploadingBanners[idx] ? 0.5 : 1, overflow: 'hidden'
                                        }}
                                        onMouseEnter={e => { if (!uploadingBanners[idx]) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                                        onMouseLeave={e => { if (!uploadingBanners[idx]) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                                    >
                                        {bannerUrls[idx] ? (
                                            <img src={bannerUrls[idx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ textAlign: 'center' }}>
                                                {uploadingBanners[idx] ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                                                <div style={{ marginTop: 4 }}>{uploadingBanners[idx] ? '...' : `Banner ${idx + 1}`}</div>
                                            </div>
                                        )}
                                    </label>
                                    {bannerUrls[idx] && (
                                        <button
                                            onClick={() => {
                                                const next = [...bannerUrls];
                                                next[idx] = '';
                                                setBannerUrls(next);
                                            }}
                                            style={{
                                                position: 'absolute', top: 6, right: 6,
                                                width: 22, height: 22, borderRadius: '50%',
                                                background: 'rgba(248, 113, 113, 0.9)', border: 'none',
                                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                backdropFilter: 'blur(4px)', zIndex: 10
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Financial Settings Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16,
                    padding: '24px 28px',
                    marginTop: 24,
                    animation: 'fadeUp 0.4s ease both',
                    animationDelay: '0.2s'
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: '#fff' }}>Financial Settings</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                                Service Charge (Dine-In)
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <button
                                    onClick={() => setEnableServiceCharge(!enableServiceCharge)}
                                    style={{
                                        width: 44, height: 24, borderRadius: 12,
                                        background: enableServiceCharge ? '#FF6A0C' : 'rgba(255,255,255,0.1)',
                                        border: 'none', position: 'relative', cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: 18, height: 18, borderRadius: '50%', background: '#fff',
                                        position: 'absolute', top: 3, left: enableServiceCharge ? 23 : 3,
                                        transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }} />
                                </button>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                                    {enableServiceCharge ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                                Service Charge (Delivery / Pickup)
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <button
                                    onClick={() => setEnableServiceChargeTakeaway(!enableServiceChargeTakeaway)}
                                    style={{
                                        width: 44, height: 24, borderRadius: 12,
                                        background: enableServiceChargeTakeaway ? '#FF6A0C' : 'rgba(255,255,255,0.1)',
                                        border: 'none', position: 'relative', cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: 18, height: 18, borderRadius: '50%', background: '#fff',
                                        position: 'absolute', top: 3, left: enableServiceChargeTakeaway ? 23 : 3,
                                        transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }} />
                                </button>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                                    {enableServiceChargeTakeaway ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1', opacity: (enableServiceCharge || enableServiceChargeTakeaway) ? 1 : 0.4, pointerEvents: (enableServiceCharge || enableServiceChargeTakeaway) ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                                Service Charge Amount (%)
                            </label>
                            <div style={{ position: 'relative', maxWidth: '50%' }}>
                                <input
                                    type="number"
                                    value={serviceCharge}
                                    onChange={(e) => setServiceCharge(Number(e.target.value))}
                                    placeholder="0"
                                    style={inputStyle}
                                />
                                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>%</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                                Delivery Charge (AED)
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    value={deliveryFee}
                                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                                    placeholder="15.0"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                                Tax Rate (%)
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                    placeholder="5.0"
                                    style={inputStyle}
                                />
                                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, marginTop: 10 }}>
                    {message && (
                        <span style={{ fontSize: 13, fontWeight: 600, color: message.type === 'success' ? '#4ade80' : '#f87171', marginRight: 'auto' }}>
                            {message.text}
                        </span>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            padding: '10px 24px',
                            background: 'linear-gradient(135deg, #FF6A0C, #e55a00)',
                            border: 'none', borderRadius: 10,
                            color: '#fff', fontSize: 13, fontWeight: 700,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            boxShadow: '0 4px 16px rgba(255,106,12,0.35)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            fontFamily: 'inherit', letterSpacing: '0.01em',
                            opacity: saving ? 0.7 : 1
                        }}
                        onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,106,12,0.45)'; } }}
                        onMouseLeave={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,106,12,0.35)'; } }}
                    >
                        <Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div style={{
                background: 'rgba(248, 113, 113, 0.05)',
                border: '1px solid rgba(248, 113, 113, 0.2)',
                borderRadius: 16,
                padding: '24px 28px',
                marginTop: 40,
                animation: 'fadeUp 0.4s ease both',
                animationDelay: '0.3s'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#f87171' }}>Danger Zone</h3>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', lineHeight: 1.5 }}>
                    Resetting the application will permanently delete all <strong>Orders</strong>, <strong>Order Items</strong>, and <strong>Customer Accounts</strong>. 
                    This will zero out your dashboard metrics. This action is <strong>irreversible</strong>.
                </p>
                <button
                    onClick={async () => {
                        const confirmed = window.confirm("CRITICAL WARNING: This will permanently delete ALL orders, customers and reset your dashboard metrics. This cannot be undone. Are you absolutely sure you want to completely reset the application?");
                        if (!confirmed) return;

                        setSaving(true);
                        setMessage(null);
                        try {
                            const res = await fetch(`${API}/settings/reset`, { method: 'POST' });
                            if (!res.ok) throw new Error('Reset failed');
                            setMessage({ text: 'Application has been reset successfully.', type: 'success' });
                            // Optional: reload some data or metrics if needed
                        } catch (err) {
                            setMessage({ text: 'Failed to reset application.', type: 'error' });
                        } finally {
                            setSaving(false);
                        }
                    }}
                    disabled={saving}
                    style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        border: '1px solid #f87171',
                        borderRadius: 10,
                        color: '#f87171',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
                        opacity: saving ? 0.5 : 1
                    }}
                    onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.color = '#fff'; } }}
                    onMouseLeave={e => { if (!saving) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f87171'; } }}
                >
                    Reset All Application Data
                </button>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
