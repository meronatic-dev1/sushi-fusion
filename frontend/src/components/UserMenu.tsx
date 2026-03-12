'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { LogOut, User, ChevronDown, Package } from 'lucide-react';
import { Language } from '@/lib/i18n';

interface UserMenuProps {
    language: Language;
    t: (key: string) => string;
}

export default function UserMenu({ language, t }: UserMenuProps) {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="user-menu-root" ref={menuRef} style={{ position: 'relative' }}>
            <button 
                className="user-menu-trigger"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 8px',
                    borderRadius: '100px',
                    border: '1px solid var(--b)',
                    background: 'var(--w)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                }}
            >
                <img 
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--w)',
                        boxShadow: '0 0 0 1px var(--b)',
                    }}
                />
                <ChevronDown 
                    size={16} 
                    style={{ 
                        color: 'var(--lg)',
                        transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                />
            </button>

            {/* Dropdown Menu */}
            <div 
                className={`user-menu-dropdown ${isOpen ? 'open' : ''}`}
                style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: language === 'en' ? 0 : 'auto',
                    left: language === 'ar' ? 0 : 'auto',
                    width: '200px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    zIndex: 1000,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transformOrigin: 'top right',
                }}
            >
                <div style={{ padding: '16px', borderBottom: '1px solid var(--b)' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--d)', margin: 0 }}>
                        {user.fullName || user.username || 'User'}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--lg)', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.primaryEmailAddress?.emailAddress}
                    </p>
                </div>

                <div style={{ padding: '6px' }}>
                    <Link href="/track" style={{ textDecoration: 'none' }}>
                        <button 
                            className="user-menu-item"
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                border: 'none',
                                background: 'transparent',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                color: 'var(--d)',
                                fontSize: '13px',
                                fontWeight: 500,
                                textAlign: language === 'ar' ? 'right' : 'left',
                                flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <Package size={16} />
                            {t('header.myOrders') || 'My Orders'}
                        </button>
                    </Link>

                    {(user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'branch_manager') && (
                        <Link href="/admin" style={{ textDecoration: 'none' }}>
                            <button 
                                className="user-menu-item"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    border: 'none',
                                    background: 'rgba(255, 106, 12, 0.05)',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    color: 'var(--o)',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    textAlign: language === 'ar' ? 'right' : 'left',
                                    flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                                    transition: 'background 0.2s',
                                    marginBottom: '4px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,106,12,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,106,12,0.05)'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                                </svg>
                                {t('header.adminDashboard') || 'Admin Dashboard'}
                            </button>
                        </Link>
                    )}

                    <button 
                        className="user-menu-item"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            color: 'var(--d)',
                            fontSize: '13px',
                            fontWeight: 500,
                            textAlign: language === 'ar' ? 'right' : 'left',
                            flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <User size={16} />
                        {t('header.myAccount')}
                    </button>

                    <button 
                        onClick={() => signOut({ redirectUrl: '/' })}
                        className="user-menu-item logout"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            color: '#e84d19',
                            fontSize: '13px',
                            fontWeight: 600,
                            textAlign: language === 'ar' ? 'right' : 'left',
                            flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(232, 77, 25, 0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOut size={16} />
                        {t('header.logout')}
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                .user-menu-root {
                    direction: ${language === 'ar' ? 'rtl' : 'ltr'};
                }
                .user-menu-trigger:hover {
                    border-color: var(--o) !important;
                }
            `}</style>
        </div>
    );
}
