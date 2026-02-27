'use client';

import React from 'react';
import { CATEGORIES, MENU } from '@/lib/data';

interface CategoryBarProps {
    activeCategory: string;
    onSelectCategory: (id: string) => void;
    t: (key: string) => string;
}

export default function CategoryBar({ activeCategory, onSelectCategory, t }: CategoryBarProps) {
    return (
        <div className="catbar">
            <div className="catbar-inner">
                {CATEGORIES.map((cat) => (
                    <div
                        key={cat.id}
                        className={`cat-item ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        <div className="cat-img">
                            {MENU[cat.id]?.[0]?.imgSrc ? (
                                <img src={MENU[cat.id][0].imgSrc!} alt={cat.name} />
                            ) : (
                                cat.icon
                            )}
                        </div>
                        <span className="cat-name">{t(`category.${cat.id}`)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
