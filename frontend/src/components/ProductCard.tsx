
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/data';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    const router = useRouter();
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAdd(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <div className="pcard" style={{ cursor: 'pointer' }} onClick={() => router.push(`/product/${encodeURIComponent(product.name)}`)}>
            <div className="pcard-header">
                <div className="pcard-name">{product.name}</div>
                <div className="pcard-desc">{product.desc}</div>
            </div>

            <div className="pcard-img-wrap">
                <div className="pcard-img">
                    {product.imgSrc ? (
                        <img src={product.imgSrc} alt={product.name} />
                    ) : (
                        <span className="emoji-fallback">{product.emoji}</span>
                    )}
                </div>
                <button
                    className="pcard-wish"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                    }}
                >
                    {isWishlisted ? '♥️' : '🤍'}
                </button>
                {product.tag && <div className="pcard-price-tag">{product.tag}</div>}
                {product.vip && <div className="vip-badge">VIP</div>}

            </div>

            <div className="pcard-bottom">
                <div>
                    {product.oldPrice && <div className="pcard-old">AED {product.oldPrice}</div>}
                    <div className="pcard-price">AED {product.price}</div>
                </div>
                <button
                    className={isAdded ? 'added-btn' : 'add-simple'}
                    onClick={handleAdd}
                >
                    {isAdded ? '✓ Added' : '+ Add'}
                </button>
            </div>
        </div>
    );
}
