'use client';

import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

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
    const [bannerUrl, setBannerUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetch('http://localhost:3001/settings')
            .then(res => res.json())
            .then(data => {
                if (data.logoUrl) setLogoUrl(data.logoUrl);
                if (data.bannerUrl) setBannerUrl(data.bannerUrl);
            })
            .catch(err => console.error('Failed to load settings', err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('http://localhost:3001/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logoUrl, bannerUrl }),
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
                        Logo URL
                    </label>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <LinkIcon size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                            <input
                                value={logoUrl}
                                onChange={e => setLogoUrl(e.target.value)}
                                placeholder="https://example.com/logo.png"
                                style={{ ...inputStyle, paddingLeft: 38 }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                            />
                        </div>
                        {logoUrl && (
                            <div style={{ width: 42, height: 42, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={logoUrl} alt="Logo preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Banner */}
                <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                        Banner Image URL
                    </label>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <ImageIcon size={14} style={{ position: 'absolute', left: 14, top: 14, color: 'rgba(255,255,255,0.2)' }} />
                            <input
                                value={bannerUrl}
                                onChange={e => setBannerUrl(e.target.value)}
                                placeholder="https://example.com/banner.jpg"
                                style={{ ...inputStyle, paddingLeft: 38 }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                            />
                        </div>
                    </div>
                    {bannerUrl && (
                        <div style={{ marginTop: 12, height: 120, borderRadius: 10, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
                            <img src={bannerUrl} alt="Banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
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
