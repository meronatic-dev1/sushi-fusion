'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, User as UserIcon, Shield, MapPin } from 'lucide-react';
import { getLocations, ApiLocation } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
// Resolve base URL for local testing
let resolvedApi = API;
if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (resolvedApi.includes('localhost') && hostname !== 'localhost') {
        resolvedApi = resolvedApi.replace('localhost', hostname);
    }
}

async function apiFetchUser(path: string, options?: RequestInit) {
    const res = await fetch(`${resolvedApi}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error ${res.status}`);
    }
    const txt = await res.text();
    return txt ? JSON.parse(txt) : {};
}

interface User {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: 'CUSTOMER' | 'ADMIN' | 'BRANCH_MANAGER';
    branchId: string | null;
    branch?: { name: string } | null;
    createdAt: string;
}

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

function UserModal({
    onClose, onSave, initial, locations,
}: {
    onClose: () => void;
    onSave: (user: any) => Promise<void>;
    initial?: User;
    locations: ApiLocation[];
}) {
    const [name, setName] = useState(initial?.name ?? '');
    const [email, setEmail] = useState(initial?.email ?? '');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(initial?.phone ?? '');
    const [role, setRole] = useState(initial?.role ?? 'BRANCH_MANAGER');
    const [branchId, setBranchId] = useState(initial?.branchId ?? (locations[0]?.id || ''));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const save = async () => {
        if (!name || !email || (!initial && !password)) {
            setError('Please fill in required fields.');
            return;
        }
        setSaving(true);
        setError('');

        const payload: any = { name, email, role, phone };
        if (password) payload.password = password;
        if (role === 'BRANCH_MANAGER') {
            payload.branchId = branchId || null;
        } else {
            payload.branchId = null;
        }

        try {
            await onSave(payload);
        } catch (err: any) {
            setError(err.message || 'Failed to save user.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', animation: 'fadeUp 0.2s ease both' }}>
            <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, width: 440, maxWidth: '95vw', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                        {initial ? 'Edit User' : 'Add New User'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                {error && (
                    <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: '#f87171', fontWeight: 600 }}>{error}</span>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe"
                            style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Email Address</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. john@sushifusion.com" type="email"
                            style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
                            Password {initial && '(Leave blank to keep current)'}
                        </label>
                        <input value={password} onChange={e => setPassword(e.target.value)} placeholder={initial ? '••••••••' : 'Enter a strong password'} type="password"
                            style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Phone (Optional)</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 123 4567"
                            style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,106,12,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Role</label>
                            <select value={role} onChange={e => setRole(e.target.value as any)}
                                style={{ ...inputStyle, cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}>
                                <option value="BRANCH_MANAGER">Branch Manager</option>
                                <option value="ADMIN">System Admin</option>
                                <option value="CUSTOMER">Customer</option>
                            </select>
                        </div>
                        {role === 'BRANCH_MANAGER' && (
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Assign Branch</label>
                                <select value={branchId} onChange={e => setBranchId(e.target.value)}
                                    style={{ ...inputStyle, cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}>
                                    {locations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    {locations.length === 0 && <option value="">No branches available</option>}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '11px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                    </button>
                    <button onClick={save} disabled={saving} style={{ flex: 2, padding: '11px 0', background: 'linear-gradient(135deg, #FF6A0C, #e55a00)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,106,12,0.35)', opacity: saving ? 0.7 : 1 }}>
                        {saving ? 'Saving...' : initial ? 'Save Changes' : 'Create User'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [locations, setLocations] = useState<ApiLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, locsData] = await Promise.all([
                apiFetchUser('/users'),
                getLocations(),
            ]);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setLocations(locsData);
        } catch (err) {
            console.error('Failed to load data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSaveUser = async (data: any) => {
        if (editUser) {
            await apiFetchUser(`/users/${editUser.id}`, { method: 'PATCH', body: JSON.stringify(data) });
        } else {
            await apiFetchUser('/users', { method: 'POST', body: JSON.stringify(data) });
        }
        setShowModal(false);
        setEditUser(null);
        loadData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await apiFetchUser(`/users/${id}`, { method: 'DELETE' });
            loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const UserRow = ({ u, i }: { u: User, i: number }) => (
        <tr style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
            <td style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6A0C', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <UserIcon size={16} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: 13, letterSpacing: '-0.01em' }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{u.email}</div>
                    </div>
                </div>
            </td>
            <td style={{ padding: '16px 20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: u.role === 'ADMIN' ? 'rgba(248,113,113,0.08)' : u.role === 'BRANCH_MANAGER' ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.05)', border: `1px solid ${u.role === 'ADMIN' ? 'rgba(248,113,113,0.2)' : u.role === 'BRANCH_MANAGER' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
                    <Shield size={12} style={{ color: u.role === 'ADMIN' ? '#f87171' : u.role === 'BRANCH_MANAGER' ? '#4ade80' : 'rgba(255,255,255,0.5)' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: u.role === 'ADMIN' ? '#f87171' : u.role === 'BRANCH_MANAGER' ? '#4ade80' : 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
                        {u.role.replace('_', ' ')}
                    </span>
                </div>
            </td>
            <td style={{ padding: '16px 20px' }}>
                {u.role === 'BRANCH_MANAGER' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                        <MapPin size={12} /> {u.branch?.name || u.branchId || 'No Branch Assigned'}
                    </div>
                ) : (
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>—</span>
                )}
            </td>
            <td style={{ padding: '16px 20px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {new Date(u.createdAt).toLocaleDateString()}
            </td>
            <td style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => setEditUser(u)} style={{ width: 30, height: 30, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                        <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} style={{ width: 30, height: 30, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <div style={{ maxWidth: 1200, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.04em', color: '#fff' }}>User Management</h2>
                    <p style={{ fontSize: 13, margin: 0, color: 'rgba(255,255,255,0.4)' }}>
                        Manage administrators and branch managers.
                    </p>
                </div>

                <button onClick={() => setShowModal(true)} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #FF6A0C, #e55a00)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(255,106,12,0.35)', transition: 'transform 0.15s, box-shadow 0.15s', fontFamily: 'inherit', letterSpacing: '0.01em' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,106,12,0.45)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,106,12,0.35)'; }}>
                    <Plus size={14} /> Add User
                </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', animation: 'fadeUp 0.4s ease both', animationDelay: '0.1s' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {['User', 'Role', 'Assigned Branch', 'Joined', 'Actions'].map((h, i) => (
                                <th key={h} style={{ padding: '12px 20px', textAlign: i === 4 ? 'right' : 'left', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && users.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '50px 0', color: 'rgba(255,255,255,0.3)' }}>Loading users...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '50px 0', color: 'rgba(255,255,255,0.3)' }}>No users found.</td></tr>
                        ) : (
                            users.map((u, i) => <UserRow key={u.id} u={u} i={i} />)
                        )}
                    </tbody>
                </table>
            </div>

            {(showModal || editUser) && (
                <UserModal
                    initial={editUser || undefined}
                    locations={locations}
                    onClose={() => { setShowModal(false); setEditUser(null); }}
                    onSave={handleSaveUser}
                />
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                select option { background: #1a1a22; color: #fff; }
            `}</style>
        </div>
    );
}
