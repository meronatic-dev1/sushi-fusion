'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Download, X, ChevronDown, ChevronRight, FolderPlus, Tag } from 'lucide-react';
import Image from 'next/image';
import {
    getCategories, getMenuItems, createCategory as apiCreateCategory,
    updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory,
    createMenuItem, updateMenuItem, deleteMenuItem, uploadImage,
    type ApiCategory, type ApiMenuItem,
} from '@/lib/api';

interface Product {
    id: string; name: string; category: string; categoryId: string; price: number;
    available: boolean; dietary: string[]; allergens: string[]; inclusions: string[]; imgSrc: string; orders: number;
}

interface Category {
    id: string; name: string; color: string; imgSrc?: string;
}

const CATEGORY_COLORS = [
    '#FF6A0C', '#60a5fa', '#4ade80', '#f87171', '#fbbf24',
    '#a78bfa', '#34d399', '#f472b6', '#38bdf8', '#fb923c',
];

const DIETARY_CFG: Record<string, { color: string; bg: string; border: string }> = {
    Vegan: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
    Spicy: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
};

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, color: '#fff',
    fontSize: 13, outline: 'none',
    fontFamily: 'inherit', cursor: 'pointer',
    transition: 'border-color 0.2s',
};

// ── Add/Edit Product Modal ─────────────────────────────────────────────────────
function ProductModal({
    onClose, onSave, categories, initial,
}: {
    onClose: () => void;
    onSave: (p: Omit<Product, 'id' | 'orders'>) => void;
    categories: Category[];
    initial?: Product;
}) {
    const [name, setName] = useState(initial?.name ?? '');
    const [category, setCategory] = useState(initial?.category ?? (categories[0]?.name ?? ''));
    const [price, setPrice] = useState(String(initial?.price ?? ''));
    const [dietary, setDietary] = useState<string[]>(initial?.dietary ?? []);
    const [allergensText, setAllergensText] = useState(initial?.allergens?.join(', ') ?? '');
    const [inclusionsText, setInclusionsText] = useState(initial?.inclusions?.join(', ') ?? '');
    const [available, setAvailable] = useState(initial?.available ?? true);
    const [imgSrc, setImgSrc] = useState(initial?.imgSrc ?? '/images/31.png');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const toggleDiet = (d: string) =>
        setDietary(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const data = await uploadImage(file);
            setImgSrc(data.url);
        } catch (err: any) {
            alert(err.message || 'Upload failed');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const save = () => {
        if (!name.trim() || !category || !price) return;
        const cat = categories.find(c => c.name === category);
        const allergens = allergensText.split(',').map(s => s.trim()).filter(Boolean);
        const inclusions = inclusionsText.split(',').map(s => s.trim()).filter(Boolean);
        onSave({ name: name.trim(), category, categoryId: cat?.id ?? '', price: Number(price), dietary, allergens, inclusions, available, imgSrc });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', animation: 'fadeUp 0.2s ease both' }}>
            <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, width: 480, maxWidth: '95vw', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                        {initial ? 'Edit Product' : 'Add Product'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Image Upload */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', position: 'relative', flexShrink: 0 }}>
                            <Image src={imgSrc} alt="Preview" fill style={{ objectFit: 'cover', opacity: uploading ? 0.5 : 1 }} />
                        </div>
                        <div>
                            <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: uploading ? 'wait' : 'pointer', transition: 'all 0.15s' }}
                                onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
                                {uploading ? 'Uploading...' : 'Change Image'}
                            </button>
                            <p style={{ margin: '6px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Recommended: Square format.</p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Product Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Salmon Avocado Roll 8 Pcs"
                            style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', padding: '10px 14px', cursor: 'text', borderRadius: 10 }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                        />
                    </div>

                    {/* Category + Price row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}
                                style={{ ...inputStyle, width: '100%', padding: '10px 14px', color: 'rgba(255,255,255,0.7)' }}>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Price (AED)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0"
                                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', padding: '10px 14px', cursor: 'text', borderRadius: 10 }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                            />
                        </div>
                    </div>

                    {/* Dietary */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Dietary Tags</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {Object.entries(DIETARY_CFG).map(([d, dc]) => {
                                const on = dietary.includes(d);
                                return (
                                    <button key={d} onClick={() => toggleDiet(d)} style={{
                                        padding: '5px 14px', borderRadius: 20, border: `1px solid ${on ? dc.border : 'rgba(255,255,255,0.08)'}`,
                                        background: on ? dc.bg : 'transparent', color: on ? dc.color : 'rgba(255,255,255,0.3)',
                                        fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                                    }}>{d}</button>
                                );
                            })}
                        </div>
                    </div>

                    {/* What's Included */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>What&apos;s Included</label>
                        <input value={inclusionsText} onChange={e => setInclusionsText(e.target.value)} placeholder="e.g. 4x California Roll, 2x Salmon Nigiri, Miso Soup"
                            style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', padding: '10px 14px', cursor: 'text', borderRadius: 10 }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                        />
                        <p style={{ margin: '5px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Comma-separated list of items included (for platters, combos, etc.)</p>
                    </div>

                    {/* Allergens */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Allergen Info</label>
                        <input value={allergensText} onChange={e => setAllergensText(e.target.value)} placeholder="e.g. Milk, Eggs, Soy (comma separated)"
                            style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', padding: '10px 14px', cursor: 'text', borderRadius: 10 }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                        />
                    </div>

                    {/* Available toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Available on menu</span>
                        <button onClick={() => setAvailable(a => !a)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
                            {available
                                ? <ToggleRight size={28} style={{ color: '#FF6A0C', filter: 'drop-shadow(0 0 5px rgba(255,106,12,0.4))' }} />
                                : <ToggleLeft size={28} style={{ color: 'rgba(255,255,255,0.2)' }} />
                            }
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '11px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                    </button>
                    <button onClick={save} style={{ flex: 2, padding: '11px 0', background: 'linear-gradient(135deg, #FF6A0C, #e55a00)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,106,12,0.35)' }}>
                        {initial ? 'Save Changes' : 'Add Product'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Add/Edit Category Modal ────────────────────────────────────────────────────
function CategoryModal({
    onClose, onSave, initial, existingNames,
}: {
    onClose: () => void;
    onSave: (name: string, color: string, imgSrc?: string) => void;
    initial?: Category;
    existingNames: string[];
}) {
    const [name, setName] = useState(initial?.name ?? '');
    const [color, setColor] = useState(initial?.color ?? CATEGORY_COLORS[0]);
    const [imgSrc, setImgSrc] = useState(initial?.imgSrc ?? '');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const err = !initial && existingNames.map(n => n.toLowerCase()).includes(name.trim().toLowerCase());

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const data = await uploadImage(file);
            setImgSrc(data.url);
        } catch (err: any) {
            alert(err.message || 'Upload failed');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const save = () => {
        if (!name.trim() || err) return;
        onSave(name.trim(), color, imgSrc);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', animation: 'fadeUp 0.2s ease both' }}>
            <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, width: 400, maxWidth: '95vw', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                        {initial ? 'Edit Category' : 'New Category'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Image Upload */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {imgSrc ? (
                                <Image src={imgSrc} alt="Preview" fill style={{ objectFit: 'cover', opacity: uploading ? 0.5 : 1 }} />
                            ) : (
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>No<br />Image</span>
                            )}
                        </div>
                        <div>
                            <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: uploading ? 'wait' : 'pointer', transition: 'all 0.15s' }}
                                onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
                                {uploading ? 'Uploading...' : 'Change Image'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Category Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Desserts"
                            style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', padding: '10px 14px', cursor: 'text', borderRadius: 10, borderColor: err ? 'rgba(248,113,113,0.4)' : undefined }}
                            onFocus={e => (e.currentTarget.style.borderColor = err ? 'rgba(248,113,113,0.5)' : 'rgba(255,106,12,0.5)')}
                            onBlur={e => (e.currentTarget.style.borderColor = err ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.07)')}
                        />
                        {err && <p style={{ margin: '5px 0 0', fontSize: 11, color: '#f87171' }}>Category already exists</p>}
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>Accent Color</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {CATEGORY_COLORS.map(c => (
                                <button key={c} onClick={() => setColor(c)} style={{
                                    width: 28, height: 28, borderRadius: '50%', background: c, border: `2px solid ${color === c ? '#fff' : 'transparent'}`,
                                    cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s',
                                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                                    boxShadow: color === c ? `0 0 10px ${c}80` : 'none',
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                        <span style={{ fontSize: 13, color: color, fontWeight: 700 }}>{name || 'Category Preview'}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '11px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                    </button>
                    <button onClick={save} disabled={!name.trim() || err} style={{ flex: 2, padding: '11px 0', background: !name.trim() || err ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #FF6A0C, #e55a00)', border: 'none', borderRadius: 10, color: !name.trim() || err ? 'rgba(255,255,255,0.25)' : '#fff', fontSize: 13, fontWeight: 700, cursor: !name.trim() || err ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: !name.trim() || err ? 'none' : '0 4px 16px rgba(255,106,12,0.35)' }}>
                        {initial ? 'Save Changes' : 'Create Category'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [avFilter, setAvFilter] = useState<'All' | 'Available' | 'Unavailable'>('All');
    const [selected, setSelected] = useState<string[]>([]);
    const [view, setView] = useState<'all' | 'by-category'>('by-category');
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [showAddProd, setShowAddProd] = useState(false);
    const [showAddCat, setShowAddCat] = useState(false);
    const [editProd, setEditProd] = useState<Product | null>(null);
    const [editCat, setEditCat] = useState<Category | null>(null);
    const [addToCat, setAddToCat] = useState<string | null>(null);

    // ── Load data from backend ──
    const loadData = async () => {
        try {
            const [cats, items] = await Promise.all([getCategories(), getMenuItems()]);
            setCategories(cats.map((c, i) => ({
                id: c.id,
                name: c.name,
                color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                imgSrc: c.imageUrl || ''
            })));
            setProducts(items.map(m => ({
                id: m.id,
                name: m.name,
                category: m.category?.name || 'Uncategorized',
                categoryId: m.categoryId,
                price: m.price,
                available: m.isAvailable,
                dietary: m.dietary || [],
                allergens: m.allergens || [],
                inclusions: m.inclusions || [],
                imgSrc: m.imageUrl || '/images/31.png',
                orders: 0,
            })));
        } catch (e) {
            console.error('Failed to load data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const toggle = async (id: string) => {
        const p = products.find(x => x.id === id);
        if (!p) return;
        await updateMenuItem(id, { isAvailable: !p.available });
        setProducts(prev => prev.map(x => x.id === id ? { ...x, available: !x.available } : x));
    };
    const toggleSel = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleCollapse = (catId: string) => setCollapsed(prev => ({ ...prev, [catId]: !prev[catId] }));

    const deleteProduct = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
        try {
            await deleteMenuItem(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete product. Please try again.');
        }
    };

    const deleteCategoryHandler = async (catId: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete the category "${name}"? This will fail if there are products assigned to it.`)) return;
        try {
            await apiDeleteCategory(catId);
            await loadData();
        } catch (err: any) {
            alert(err.message || 'Failed to delete category. Make sure it has no products before deleting.');
        }
    };

    const addProduct = async (data: Omit<Product, 'id' | 'orders'>) => {
        const cat = categories.find(c => c.name === data.category);
        if (!cat) return;
        await createMenuItem({
            name: data.name,
            description: '',
            price: data.price,
            imageUrl: data.imgSrc || undefined,
            isAvailable: data.available,
            categoryId: cat.id,
            dietary: data.dietary,
            allergens: data.allergens,
            inclusions: data.inclusions,
        });
        await loadData();
    };

    const saveProduct = async (data: Omit<Product, 'id' | 'orders'>) => {
        if (!editProd) return;
        const cat = categories.find(c => c.name === data.category);
        await updateMenuItem(editProd.id, {
            name: data.name,
            price: data.price,
            imageUrl: data.imgSrc || undefined,
            isAvailable: data.available,
            categoryId: cat?.id,
            dietary: data.dietary,
            allergens: data.allergens,
            inclusions: data.inclusions,
        });
        setEditProd(null);
        await loadData();
    };

    const addCategory = async (name: string, _color: string, imgSrc?: string) => {
        await apiCreateCategory({ name, imageUrl: imgSrc || undefined });
        await loadData();
    };

    const saveCategory = async (name: string, _color: string, imgSrc?: string) => {
        if (!editCat) return;
        await apiUpdateCategory(editCat.id, { name, imageUrl: imgSrc || undefined });
        setEditCat(null);
        await loadData();
    };

    const filtered = products.filter(p => {
        const q = search.toLowerCase();
        return (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
            && (avFilter === 'All' || (avFilter === 'Available' ? p.available : !p.available));
    });

    const avCount = products.filter(p => p.available).length;
    const unavCount = products.filter(p => !p.available).length;
    const allChecked = selected.length === filtered.length && filtered.length > 0;
    const maxOrders = Math.max(...products.map(p => p.orders), 1);

    // Grouped by category
    const grouped = categories.map(cat => ({
        cat,
        items: filtered.filter(p => p.category === cat.name),
    })).filter(g => g.items.length > 0 || search === '');

    const ProductRow = ({ p, i, total }: { p: Product; i: number; total: number }) => (
        <tr
            style={{
                borderBottom: i < total - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                opacity: p.available ? 1 : 0.4,
                transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
            <td style={{ padding: '12px 20px' }}>
                <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSel(p.id)}
                    style={{ accentColor: '#FF6A0C', cursor: 'pointer', width: 14, height: 14 }} />
            </td>
            <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, position: 'relative', borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Image src={p.imgSrc} alt={p.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontWeight: 600, color: '#fff', fontSize: 13, letterSpacing: '-0.01em' }}>{p.name}</span>
                </div>
            </td>
            <td style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#FF6A0C', letterSpacing: '-0.02em' }}>AED {p.price}</span>
            </td>
            <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, background: '#FF6A0C', width: `${Math.round((p.orders / maxOrders) * 100)}%`, opacity: 0.8 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{p.orders}</span>
                </div>
            </td>
            <td style={{ padding: '12px 16px' }}>
                {p.dietary.length === 0
                    ? <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 12 }}>—</span>
                    : <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.dietary.map(d => {
                            const dc = DIETARY_CFG[d] ?? { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.2)' };
                            return <span key={d} style={{ fontSize: 10, fontWeight: 700, color: dc.color, background: dc.bg, border: `1px solid ${dc.border}`, borderRadius: 20, padding: '2px 8px', letterSpacing: '0.04em' }}>{d}</span>;
                        })}
                    </div>
                }
            </td>
            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                <button onClick={() => toggle(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0, transition: 'transform 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                    {p.available
                        ? <ToggleRight size={28} style={{ color: '#FF6A0C', filter: 'drop-shadow(0 0 5px rgba(255,106,12,0.5))' }} />
                        : <ToggleLeft size={28} style={{ color: 'rgba(255,255,255,0.15)' }} />
                    }
                </button>
            </td>
            <td style={{ padding: '12px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => setEditProd(p)} style={{ width: 30, height: 30, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                        <Pencil size={12} />
                    </button>
                    <button onClick={() => deleteProduct(p.id, p.name)} style={{ width: 30, height: 30, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );

    const TableHead = ({ showCategory }: { showCategory?: boolean }) => (
        <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '12px 20px', width: 36 }}>
                    <input type="checkbox" checked={allChecked} onChange={() => setSelected(allChecked ? [] : filtered.map(p => p.id))}
                        style={{ accentColor: '#FF6A0C', cursor: 'pointer', width: 14, height: 14 }} />
                </th>
                {['Product', 'Price', 'Orders', 'Tags', 'Available', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: i === 4 ? 'center' : i === 5 ? 'right' : 'left', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {h}
                    </th>
                ))}
            </tr>
        </thead>
    );

    return (
        <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.04em', color: '#fff' }}>Products</h2>
                    <p style={{ fontSize: 13, margin: 0, color: 'rgba(255,255,255,0.3)' }}>
                        <span style={{ color: '#4ade80', fontWeight: 700 }}>{avCount} available</span>
                        <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 8px' }}>·</span>
                        <span style={{ color: '#f87171', fontWeight: 700 }}>{unavCount} unavailable</span>
                        <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 8px' }}>·</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{categories.length} categories</span>
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {/* Export CSV */}
                    <button style={{ ...inputStyle, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                        <Download size={13} /> Export CSV
                    </button>

                    {/* Add Category */}
                    <button onClick={() => setShowAddCat(true)} style={{ ...inputStyle, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                        <FolderPlus size={13} /> New Category
                    </button>

                    {/* Add Product */}
                    <button onClick={() => setShowAddProd(true)} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #FF6A0C, #e55a00)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(255,106,12,0.35)', transition: 'transform 0.15s, box-shadow 0.15s', fontFamily: 'inherit', letterSpacing: '0.01em' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,106,12,0.45)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,106,12,0.35)'; }}>
                        <Plus size={14} /> Add Product
                    </button>
                </div>
            </div>

            {/* ── Bulk action bar ── */}
            {selected.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,106,12,0.07)', border: '1px solid rgba(255,106,12,0.22)', borderRadius: 12, padding: '10px 18px', marginBottom: 16, animation: 'fadeUp 0.25s ease both' }}>
                    <span style={{ fontSize: 13, color: '#FF6A0C', fontWeight: 700 }}>{selected.length} selected</span>
                    <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
                    <button style={{ ...inputStyle, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}
                        onClick={() => { setProducts(prev => prev.map(p => selected.includes(p.id) ? { ...p, available: false } : p)); setSelected([]); }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                        Deactivate All
                    </button>
                    <button onClick={() => setSelected([])} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
                </div>
            )}

            {/* ── Filters + View Toggle ── */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                        style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 34px', cursor: 'text' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.4)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                </div>

                <select value={avFilter} onChange={e => setAvFilter(e.target.value as typeof avFilter)}
                    style={{ ...inputStyle, padding: '9px 14px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                </select>

                {/* View toggle */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3, gap: 3, flexShrink: 0 }}>
                    {(['by-category', 'all'] as const).map(v => (
                        <button key={v} onClick={() => setView(v)} style={{
                            padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                            background: view === v ? 'rgba(255,255,255,0.09)' : 'transparent',
                            color: view === v ? '#fff' : 'rgba(255,255,255,0.3)',
                        }}>
                            {v === 'by-category' ? 'By Category' : 'All Items'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── BY CATEGORY VIEW ── */}
            {view === 'by-category' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {grouped.map(({ cat, items }, gi) => {
                        const isCollapsed = collapsed[cat.id];
                        const catAvail = items.filter(p => p.available).length;
                        return (
                            <div key={cat.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', animation: `fadeUp 0.4s ease both`, animationDelay: `${gi * 0.05}s` }}>

                                {/* Category header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                                    onClick={() => toggleCollapse(cat.id)}>
                                    {/* Color dot */}
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, boxShadow: `0 0 8px ${cat.color}80`, flexShrink: 0 }} />

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{cat.name}</span>
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 10, fontWeight: 600 }}>
                                            {items.length} item{items.length !== 1 ? 's' : ''}
                                            {' · '}
                                            <span style={{ color: catAvail > 0 ? '#4ade80' : '#f87171' }}>{catAvail} active</span>
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={e => e.stopPropagation()}>
                                        {/* Add item to this category */}
                                        <button onClick={() => { setAddToCat(cat.name); setShowAddProd(true); }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid ${cat.color}30`, background: `${cat.color}10`, color: cat.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = `${cat.color}20`; e.currentTarget.style.borderColor = `${cat.color}50`; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = `${cat.color}10`; e.currentTarget.style.borderColor = `${cat.color}30`; }}>
                                            <Plus size={11} /> Add Item
                                        </button>

                                        {/* Edit category */}
                                        <button onClick={() => setEditCat(cat)} style={{ width: 28, height: 28, borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}>
                                            <Pencil size={11} />
                                        </button>

                                        {/* Delete category */}
                                        <button onClick={() => deleteCategoryHandler(cat.id, cat.name)} style={{ width: 28, height: 28, borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                                            <Trash2 size={11} />
                                        </button>

                                        <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.25)', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: 4 }} />
                                    </div>
                                </div>

                                {/* Table */}
                                {!isCollapsed && (
                                    items.length === 0
                                        ? (
                                            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
                                                <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>No items in this category yet</p>
                                                <button onClick={() => { setAddToCat(cat.name); setShowAddProd(true); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, border: `1px solid ${cat.color}30`, background: `${cat.color}10`, color: cat.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                                    <Plus size={12} /> Add first item
                                                </button>
                                            </div>
                                        ) : (
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                                <TableHead />
                                                <tbody>
                                                    {items.map((p, i) => <ProductRow key={p.id} p={p} i={i} total={items.length} />)}
                                                </tbody>
                                            </table>
                                        )
                                )}
                            </div>
                        );
                    })}

                    {/* Empty categories with no products when not searching */}
                    {search === '' && categories.filter(cat => !products.some(p => p.category === cat.name)).map((cat, gi) => (
                        <div key={cat.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', animation: `fadeUp 0.4s ease both`, animationDelay: `${(grouped.length + gi) * 0.05}s` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px' }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, opacity: 0.5, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '-0.02em' }}>{cat.name}</span>
                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', marginLeft: 10 }}>Empty</span>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                                    <button onClick={() => { setAddToCat(cat.name); setShowAddProd(true); }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid ${cat.color}30`, background: `${cat.color}10`, color: cat.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        <Plus size={11} /> Add Item
                                    </button>
                                    <button onClick={() => setEditCat(cat)} style={{ width: 28, height: 28, borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}>
                                        <Pencil size={11} />
                                    </button>
                                    <button onClick={() => deleteCategoryHandler(cat.id, cat.name)} style={{ width: 28, height: 28, borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── ALL ITEMS VIEW ── */}
            {view === 'all' && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', animation: 'fadeUp 0.4s ease both' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <TableHead />
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '52px 0', color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>No products found.</td></tr>
                            )}
                            {filtered.map((p, i) => <ProductRow key={p.id} p={p} i={i} total={filtered.length} />)}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Modals ── */}
            {(showAddProd || editProd) && (
                <ProductModal
                    categories={categories}
                    initial={editProd ?? (addToCat ? { id: '', name: '', category: addToCat, categoryId: '', price: 0, available: true, dietary: [], allergens: [], inclusions: [], imgSrc: '/images/31.png', orders: 0 } : undefined)}
                    onClose={() => { setShowAddProd(false); setEditProd(null); setAddToCat(null); }}
                    onSave={editProd ? saveProduct : addProduct}
                />
            )}

            {(showAddCat || editCat) && (
                <CategoryModal
                    initial={editCat ?? undefined}
                    existingNames={categories.map(c => c.name)}
                    onClose={() => { setShowAddCat(false); setEditCat(null); }}
                    onSave={editCat ? saveCategory : addCategory}
                />
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                input[type="checkbox"] { accent-color: #FF6A0C; }
                input::placeholder { color: rgba(255,255,255,0.15) !important; }
                select option { background: #1a1a22; color: #fff; }
                input[type="number"]::-webkit-inner-spin-button { opacity: 0.3; }
            `}</style>
        </div>
    );
}