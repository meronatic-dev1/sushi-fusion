'use client';

import React from 'react';
import { CATEGORIES, MENU } from '@/lib/data';

interface CategoryBarProps {
    activeCategory: string;
    onSelectCategory: (id: string) => void;
    t: (key: string) => string;
    categories?: { id: string; name: string; icon?: string; emoji?: string; imgSrc?: string }[];
}

export default function CategoryBar({ activeCategory, onSelectCategory, t, categories }: CategoryBarProps) {
    const cats = categories || CATEGORIES;

    return (
        <div className="catbar">
            <div className="catbar-inner">
                {cats.map((cat) => (
                    <div
                        key={cat.id}
                        className={`cat-item ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        <div className="cat-img">
                            {cat.imgSrc ? (
                                <img src={cat.imgSrc} alt={cat.name} />
                            ) : MENU[cat.id]?.[0]?.imgSrc ? (
                                <img src={MENU[cat.id][0].imgSrc!} alt={cat.name} />
                            ) : (
                                cat.icon || cat.emoji || '🍽️'
                            )}
                        </div>
                        <span className="cat-name">{t(`category.${cat.id}`) !== `category.${cat.id}` ? t(`category.${cat.id}`) : cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
