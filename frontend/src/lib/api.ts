export let API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Dynamically adapt the API URL for local network testing (e.g. accessing via 192.168.x.x)
if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (API.includes('localhost') && hostname !== 'localhost') {
        API = API.replace('localhost', hostname);
    }
}

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ApiCategory {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: { menuItems: number };
    menuItems?: ApiMenuItem[];
}

export interface ApiMenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
    categoryId: string;
    category?: ApiCategory;
    createdAt: string;
    updatedAt: string;
}

// ── Generic fetch helper ───────────────────────────────────────────────────────
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${API}${path}`;
    let res: Response;
    try {
        res = await fetch(url, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init?.headers,
            },
        });
    } catch (err: any) {
        console.error(`Network error when fetching ${url}:`, err);
        throw new Error(`Failed to fetch ${url}: ${err.message}`);
    }

    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`API ${res.status}: ${text}`);
    }
    // DELETE may return 200 with empty body
    const text = await res.text();
    return text ? JSON.parse(text) : ({} as T);
}

// ── Uploads ────────────────────────────────────────────────────────────────────
export const uploadImage = async (file: File): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    // Do not use json headers for FormData
    const res = await fetch(`${API}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Upload failed: ${text}`);
    }
    return res.json();
};

// ── Orders ─────────────────────────────────────────────────────────────────────
export const getOrders = (branchId?: string) => {
    const query = branchId ? `?branchId=${branchId}` : '';
    return apiFetch<any[]>(`/orders${query}`);
};

export const updateOrderStatus = (id: string, status: string) =>
    apiFetch<any>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const apiCreateOrder = (data: any) =>
    apiFetch<any>('/orders', { method: 'POST', body: JSON.stringify(data) });

// ── Categories ─────────────────────────────────────────────────────────────────
export const getCategories = () =>
    apiFetch<ApiCategory[]>('/categories');

export const getCategory = (id: string) =>
    apiFetch<ApiCategory>(`/categories/${id}`);

export const createCategory = (data: { name: string; description?: string; imageUrl?: string }) =>
    apiFetch<ApiCategory>('/categories', { method: 'POST', body: JSON.stringify(data) });

export const updateCategory = (id: string, data: { name?: string; description?: string; imageUrl?: string }) =>
    apiFetch<ApiCategory>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteCategory = (id: string) =>
    apiFetch<void>(`/categories/${id}`, { method: 'DELETE' });

// ── Menu Items ─────────────────────────────────────────────────────────────────
export const getMenuItems = (categoryId?: string) => {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return apiFetch<ApiMenuItem[]>(`/menu-items${query}`);
};

export const getBestSellers = () =>
    apiFetch<ApiMenuItem[]>('/menu-items/best-sellers');

export const getMenuItem = (id: string) =>
    apiFetch<ApiMenuItem>(`/menu-items/${id}`);

export const createMenuItem = (data: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    categoryId: string;
}) =>
    apiFetch<ApiMenuItem>('/menu-items', { method: 'POST', body: JSON.stringify(data) });

export const updateMenuItem = (id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isAvailable?: boolean;
    categoryId?: string;
}) =>
    apiFetch<ApiMenuItem>(`/menu-items/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteMenuItem = (id: string) =>
    apiFetch<void>(`/menu-items/${id}`, { method: 'DELETE' });

// ── Settings ───────────────────────────────────────────────────────────────────
export interface ApiSettings {
    id: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    updatedAt: string;
}

export const getSettings = () =>
    apiFetch<ApiSettings>('/settings');

export const updateSettings = (data: { logoUrl?: string; bannerUrl?: string }) =>
    apiFetch<ApiSettings>('/settings', { method: 'PATCH', body: JSON.stringify(data) });

// ── Analytics ──────────────────────────────────────────────────────────────────
export interface DashboardData {
    kpis: { revenue: number; orders: number; customers: number; avgOrder: number };
    modeSplit: { label: string; count: number; pct: number }[];
    recentOrders: { id: string; name: string; branch: string; mode: string; total: string; status: string; dot: string }[];
    topProducts: { name: string; orders: number; pct: number; revenue: string }[];
    leastProducts: { name: string; orders: number }[];
    categoryPerformance: { name: string; revenue: number; orders: number }[];
    customerStats: { newCustomers: number; returningCustomers: number; peakHour: string; topLTV: number; newPct: number; retPct: number };
    customerList: { name: string; email: string; joined: string; orders: number; spend: string; status: 'Active' | 'Disabled' }[];
    totalItemsSold: number;
    peakHoursHeatmap: Record<string, number[]>;
}

export const getAnalyticsDashboard = () =>
    apiFetch<DashboardData>('/analytics/dashboard');

// ── Locations ──────────────────────────────────────────────────────────────────
export interface ApiLocation {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
    isClosed: boolean;
    openTime: string | null;
    closeTime: string | null;
    phone: string;
    ordersToday: number;
    revenueToday: number;
    managersCount: number;
    createdAt: string;
}

export const getLocations = () =>
    apiFetch<ApiLocation[]>('/locations');

export const createLocation = (data: { name: string; address: string; latitude?: number; longitude?: number; openTime?: string; closeTime?: string }) =>
    apiFetch<any>('/locations', { method: 'POST', body: JSON.stringify(data) });

export const updateLocation = (id: string, data: any) =>
    apiFetch<any>(`/locations/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const toggleLocation = (id: string) =>
    apiFetch<any>(`/locations/${id}/toggle`, { method: 'PATCH' });

export const deleteLocation = (id: string) =>
    apiFetch<void>(`/locations/${id}`, { method: 'DELETE' });

