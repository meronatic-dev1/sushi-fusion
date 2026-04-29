'use client';

import React, { useEffect, useState } from 'react';
import { Compass, Info, Navigation } from 'lucide-react';

export default function InAppBrowserPopup() {
    const [isInApp, setIsInApp] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isInstagramOrFacebook = ua.includes('Instagram') || ua.includes('FBAN') || ua.includes('FBAV');
        
        if (isInstagramOrFacebook) {
            setIsInApp(true);
        }
        
        if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
            setIsIOS(true);
        }
    }, []);

    if (!isInApp || dismissed) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(26, 17, 8, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            fontFamily: '"DM Sans", sans-serif',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 24,
                width: '100%',
                maxWidth: 400,
                padding: '32px 24px',
                boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
                textAlign: 'center',
                animation: 'slideUpPopup 0.4s cubic-bezier(0.16, 1, 0.3, 1) both'
            }}>
                <div style={{
                    width: 64, height: 64,
                    background: '#fff5ee', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', color: '#FF6A0C'
                }}>
                    <Compass size={32} strokeWidth={2.5} />
                </div>
                
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1108', margin: '0 0 12px' }}>
                    Open in System Browser
                </h2>
                
                <p style={{ fontSize: 14, color: '#5A4A3D', lineHeight: 1.6, margin: '0 0 24px' }}>
                    You are viewing this page inside the <strong>{isIOS ? 'Instagram/Facebook' : 'Instagram/Facebook'}</strong> app, which limits important features like location auto-detection.
                </p>

                <div style={{
                    background: '#faf8f5',
                    borderRadius: 16,
                    padding: '16px',
                    marginBottom: 24,
                    border: '1px solid #e8ddd2',
                    textAlign: 'left'
                }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ marginTop: 2, color: '#FF6A0C' }}><Info size={18} /></div>
                        <div>
                            <p style={{ margin: 0, fontSize: 13, color: '#3d2c1e', fontWeight: 600 }}>How to switch browsers:</p>
                            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6d5a4a', lineHeight: 1.5 }}>
                                Tap the <strong>three dots <span style={{letterSpacing: 2}}>•••</span></strong> in the top corner of your screen, then select <strong>"Open in System Browser"</strong> (Safari or Chrome).
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '16px 24px',
                            background: '#FF6A0C',
                            border: 'none',
                            color: '#fff',
                            borderRadius: 14,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            boxShadow: '0 4px 14px rgba(255, 106, 12, 0.3)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Navigation size={18} /> I have opened in Safari/Chrome
                    </button>
                    
                    <button 
                        onClick={() => setDismissed(true)}
                        style={{
                            padding: '14px 24px',
                            background: 'transparent',
                            border: 'none',
                            color: '#a08060',
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textDecoration: 'underline'
                        }}
                    >
                        Continue in limited mode anyway
                    </button>
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes slideUpPopup {
                        from { transform: translateY(60px) scale(0.95); opacity: 0; }
                        to { transform: translateY(0) scale(1); opacity: 1; }
                    }
                `}} />
            </div>
        </div>
    );
}
