'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/data';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

function getBadge(product: Product): { label: string; bg: string; color: string; shadow: string } | null {
    if (product.vip) return null;
    const id = String(product.id ?? '');
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const slot = hash % 5;
    if (slot === 0) return { label: '🔥 Popular', bg: 'linear-gradient(135deg,#FF6A0C,#FF8C42)', color: '#fff', shadow: '0 2px 8px rgba(255,106,12,0.4)' };
    if (slot === 1) return { label: "👨‍🍳 Chef's Choice", bg: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#1c1c1c', shadow: '0 2px 8px rgba(255,165,0,0.4)' };
    if (slot === 2) return { label: '✨ New', bg: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', shadow: '0 2px 8px rgba(34,197,94,0.4)' };
    return null;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    const router = useRouter();
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [btnHover, setBtnHover] = useState(false);

    const badge = getBadge(product);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAdd(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <div
            className="pcard"
            onClick={() => router.push(`/product/${encodeURIComponent(product.name)}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: '#fff',
                borderRadius: 14,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: isHovered
                    ? '0 16px 40px rgba(255,106,12,0.18), 0 4px 16px rgba(0,0,0,0.10)'
                    : '0 2px 12px rgba(0,0,0,0.08)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'box-shadow 0.3s, transform 0.3s',
            }}
        >
            {/* Header */}
            <div style={{ padding: '14px 14px 0' }}>
                <div className="pcard-name">{product.name}</div>
                <div className="pcard-desc">{product.desc}</div>
            </div>

            {/* Image */}
            <div style={{ position: 'relative', marginTop: 10 }}>
                <div className="pcard-img">
                    {product.imgSrc ? (
                        <img
                            src={product.imgSrc}
                            alt={product.name}
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                                display: 'block',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 0.4s cubic-bezier(.25,.46,.45,.94)',
                            }}
                        />
                    ) : (
                        <span className="emoji-fallback">{product.emoji}</span>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    className="pcard-wish"
                    onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
                >
                    {isWishlisted ? '♥️' : '🤍'}
                </button>

                {/* Badge */}
                {badge && !product.vip && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        fontSize: 10, fontWeight: 800,
                        padding: '4px 10px', borderRadius: 100,
                        letterSpacing: '0.5px', textTransform: 'uppercase',
                        zIndex: 2, background: badge.bg, color: badge.color,
                        boxShadow: badge.shadow,
                    }}>
                        {badge.label}
                    </div>
                )}

                {/* VIP badge */}
                {product.vip && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        background: 'linear-gradient(135deg,#FFD700,#FFA500)',
                        color: '#1c1c1c', fontSize: 10, fontWeight: 800,
                        padding: '4px 10px', borderRadius: 100, letterSpacing: '0.5px',
                    }}>
                        ⭐ VIP
                    </div>
                )}

                {/* Price tag */}
                {product.tag && (
                    <div className="pcard-price-tag">{product.tag}</div>
                )}
            </div>

            {/* Bottom */}
            <div className="pcard-bottom">
                <div>
                    {product.oldPrice && <div className="pcard-old">AED {product.oldPrice}</div>}
                    <div className="pcard-price">AED {product.price}</div>
                </div>

                <button
                    onClick={handleAdd}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    style={{
                        height: 38, padding: '0 22px',
                        background: isAdded
                            ? '#1c1c1c'
                            : 'linear-gradient(135deg,#FF6A0C,#FF8C42)',
                        border: 'none', borderRadius: 8,
                        color: '#fff', fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        boxShadow: isAdded
                            ? '0 3px 12px rgba(0,0,0,0.2)'
                            : btnHover
                                ? '0 6px 20px rgba(255,106,12,0.5)'
                                : '0 3px 12px rgba(255,106,12,0.35)',
                        transform: !isAdded && btnHover ? 'translateY(-2px)' : 'none',
                        transition: 'all 0.25s',
                    }}
                >
                    {isAdded ? '✓ Added' : '+ Add'}
                </button>
            </div>
        </div>
    );
}