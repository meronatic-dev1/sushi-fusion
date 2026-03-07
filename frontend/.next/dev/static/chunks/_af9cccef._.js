(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/context/CartContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isCartOpen, setIsCartOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Persist cart to localStorage (optional but good UX)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            const savedCart = localStorage.getItem('sushi-cart');
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error('Failed to parse cart');
                }
            }
        }
    }["CartProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            localStorage.setItem('sushi-cart', JSON.stringify(cart));
        }
    }["CartProvider.useEffect"], [
        cart
    ]);
    const addToCart = (product)=>{
        setCart((prev)=>{
            const existing = prev[product.name];
            if (existing) {
                return {
                    ...prev,
                    [product.name]: {
                        ...existing,
                        qty: existing.qty + 1
                    }
                };
            }
            return {
                ...prev,
                [product.name]: {
                    ...product,
                    qty: 1
                }
            };
        });
        setIsCartOpen(true); // Auto-open cart on add
    };
    const updateQty = (name, delta)=>{
        setCart((prev)=>{
            const item = prev[name];
            if (!item) return prev;
            const newQty = Math.max(0, item.qty + delta);
            if (newQty === 0) {
                const copy = {
                    ...prev
                };
                delete copy[name];
                return copy;
            }
            return {
                ...prev,
                [name]: {
                    ...item,
                    qty: newQty
                }
            };
        });
    };
    const clearCart = ()=>setCart({});
    const cartCount = Object.values(cart).reduce((a, b)=>a + b.qty, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cart,
            isCartOpen,
            addToCart,
            updateQty,
            setIsCartOpen,
            clearCart,
            cartCount
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/CartContext.tsx",
        lineNumber: 72,
        columnNumber: 9
    }, this);
}
_s(CartProvider, "Ee+JcFwGXSgYMT7D7t/Z+cI9sKY=");
_c = CartProvider;
function useCart() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API",
    ()=>API,
    "apiCreateOrder",
    ()=>apiCreateOrder,
    "createCategory",
    ()=>createCategory,
    "createLocation",
    ()=>createLocation,
    "createMenuItem",
    ()=>createMenuItem,
    "deleteCategory",
    ()=>deleteCategory,
    "deleteLocation",
    ()=>deleteLocation,
    "deleteMenuItem",
    ()=>deleteMenuItem,
    "getAnalyticsDashboard",
    ()=>getAnalyticsDashboard,
    "getBestSellers",
    ()=>getBestSellers,
    "getCategories",
    ()=>getCategories,
    "getCategory",
    ()=>getCategory,
    "getLocations",
    ()=>getLocations,
    "getMenuItem",
    ()=>getMenuItem,
    "getMenuItems",
    ()=>getMenuItems,
    "getOrders",
    ()=>getOrders,
    "getSettings",
    ()=>getSettings,
    "toggleLocation",
    ()=>toggleLocation,
    "updateCategory",
    ()=>updateCategory,
    "updateLocation",
    ()=>updateLocation,
    "updateMenuItem",
    ()=>updateMenuItem,
    "updateOrderStatus",
    ()=>updateOrderStatus,
    "updateSettings",
    ()=>updateSettings,
    "uploadImage",
    ()=>uploadImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
let API = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
// Dynamically adapt the API URL for local network testing (e.g. accessing via 192.168.x.x)
if ("TURBOPACK compile-time truthy", 1) {
    const hostname = window.location.hostname;
    if (API.includes('localhost') && hostname !== 'localhost') {
        API = API.replace('localhost', hostname);
    }
}
// ── Generic fetch helper ───────────────────────────────────────────────────────
async function apiFetch(path, init) {
    const url = `${API}${path}`;
    let res;
    try {
        res = await fetch(url, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init?.headers
            }
        });
    } catch (err) {
        console.error(`Network error when fetching ${url}:`, err);
        throw new Error(`Failed to fetch ${url}: ${err.message}`);
    }
    if (!res.ok) {
        const text = await res.text().catch(()=>res.statusText);
        throw new Error(`API ${res.status}: ${text}`);
    }
    // DELETE may return 200 with empty body
    const text = await res.text();
    return text ? JSON.parse(text) : {};
}
const uploadImage = async (file)=>{
    const formData = new FormData();
    formData.append('file', file);
    // Do not use json headers for FormData
    const res = await fetch(`${API}/upload`, {
        method: 'POST',
        body: formData
    });
    if (!res.ok) {
        const text = await res.text().catch(()=>res.statusText);
        throw new Error(`Upload failed: ${text}`);
    }
    return res.json();
};
const getOrders = (branchId)=>{
    const query = branchId ? `?branchId=${branchId}` : '';
    return apiFetch(`/orders${query}`);
};
const updateOrderStatus = (id, status)=>apiFetch(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
            status
        })
    });
const apiCreateOrder = (data)=>apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(data)
    });
const getCategories = ()=>apiFetch('/categories');
const getCategory = (id)=>apiFetch(`/categories/${id}`);
const createCategory = (data)=>apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify(data)
    });
const updateCategory = (id, data)=>apiFetch(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
const deleteCategory = (id)=>apiFetch(`/categories/${id}`, {
        method: 'DELETE'
    });
const getMenuItems = (categoryId)=>{
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return apiFetch(`/menu-items${query}`);
};
const getBestSellers = ()=>apiFetch('/menu-items/best-sellers');
const getMenuItem = (id)=>apiFetch(`/menu-items/${id}`);
const createMenuItem = (data)=>apiFetch('/menu-items', {
        method: 'POST',
        body: JSON.stringify(data)
    });
const updateMenuItem = (id, data)=>apiFetch(`/menu-items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
const deleteMenuItem = (id)=>apiFetch(`/menu-items/${id}`, {
        method: 'DELETE'
    });
const getSettings = ()=>apiFetch('/settings');
const updateSettings = (data)=>apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
const getAnalyticsDashboard = ()=>apiFetch('/analytics/dashboard');
const getLocations = ()=>apiFetch('/locations');
const createLocation = (data)=>apiFetch('/locations', {
        method: 'POST',
        body: JSON.stringify(data)
    });
const updateLocation = (id, data)=>apiFetch(`/locations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
const toggleLocation = (id)=>apiFetch(`/locations/${id}/toggle`, {
        method: 'PATCH'
    });
const deleteLocation = (id)=>apiFetch(`/locations/${id}`, {
        method: 'DELETE'
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/SettingsContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsProvider",
    ()=>SettingsProvider,
    "useSettings",
    ()=>useSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const defaultSettings = {
    // Fallbacks if not configured in DB
    logoUrl: '/logo.png',
    bannerUrl: '/images/banner-1.png',
    serviceCharge: 0,
    enableServiceCharge: false
};
const SettingsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    settings: defaultSettings,
    loading: true
});
function SettingsProvider({ children }) {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultSettings);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsProvider.useEffect": ()=>{
            fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"]}/settings`).then({
                "SettingsProvider.useEffect": (res)=>res.json()
            }["SettingsProvider.useEffect"]).then({
                "SettingsProvider.useEffect": (data)=>{
                    setSettings({
                        logoUrl: data.logoUrl || defaultSettings.logoUrl,
                        bannerUrl: data.bannerUrl || defaultSettings.bannerUrl,
                        serviceCharge: data.serviceCharge ?? defaultSettings.serviceCharge,
                        enableServiceCharge: data.enableServiceCharge ?? defaultSettings.enableServiceCharge
                    });
                }
            }["SettingsProvider.useEffect"]).catch({
                "SettingsProvider.useEffect": (err)=>{
                    console.error('Failed to load store settings:', err);
                // Keeps default settings
                }
            }["SettingsProvider.useEffect"]).finally({
                "SettingsProvider.useEffect": ()=>{
                    setLoading(false);
                }
            }["SettingsProvider.useEffect"]);
        }
    }["SettingsProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsContext.Provider, {
        value: {
            settings,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/SettingsContext.tsx",
        lineNumber: 53,
        columnNumber: 9
    }, this);
}
_s(SettingsProvider, "jEFDozBf+c+WEcUOF0Dtqhh9M80=");
_c = SettingsProvider;
function useSettings() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SettingsContext);
}
_s1(useSettings, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "SettingsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/GlobalCart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobalCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function GlobalCart({ t }) {
    _s();
    const { cart, isCartOpen, updateQty, setIsCartOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Do not render the cart sidebar on admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }
    const items = Object.entries(cart).filter(([, v])=>v.qty > 0);
    const total = items.reduce((a, [, v])=>a + v.price * v.qty, 0);
    const onClose = ()=>setIsCartOpen(false);
    const renderHeader = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
                borderBottom: '1px solid var(--b)',
                paddingBottom: 10
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 16,
                        fontWeight: 800
                    },
                    children: [
                        "🛒 ",
                        t('cart.title')
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/GlobalCart.tsx",
                    lineNumber: 22,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    style: {
                        background: 'none',
                        border: 'none',
                        fontSize: 24,
                        cursor: 'pointer',
                        padding: '0 8px',
                        color: 'var(--g)'
                    },
                    children: "×"
                }, void 0, false, {
                    fileName: "[project]/src/components/GlobalCart.tsx",
                    lineNumber: 23,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/GlobalCart.tsx",
            lineNumber: 21,
            columnNumber: 9
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `global-cart-sidebar ${isCartOpen ? 'open' : ''}`,
                children: items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cart-empty",
                    style: {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    },
                    children: [
                        renderHeader(),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cart-empty-icon",
                                    style: {
                                        fontSize: 60,
                                        marginBottom: 15,
                                        opacity: 0.5
                                    },
                                    children: "🛒"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                    lineNumber: 34,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontSize: 16,
                                        fontWeight: 800
                                    },
                                    children: t('cart.emptyTitle')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                    lineNumber: 35,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 13,
                                        color: 'var(--g)',
                                        marginTop: 8
                                    },
                                    children: t('cart.emptyBody')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                    lineNumber: 36,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/GlobalCart.tsx",
                            lineNumber: 33,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/GlobalCart.tsx",
                    lineNumber: 31,
                    columnNumber: 21
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cart-has-items",
                    style: {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    },
                    children: [
                        renderHeader(),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cart-items",
                            style: {
                                flex: 1,
                                overflowY: 'auto',
                                paddingRight: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10
                            },
                            children: items.map(([name, item])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 10,
                                        padding: 10,
                                        border: '1px solid var(--b)',
                                        borderRadius: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 30,
                                                width: 48,
                                                height: 48,
                                                background: '#fff5ef',
                                                borderRadius: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            },
                                            children: item.imgSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: item.imgSrc,
                                                alt: item.name,
                                                style: {
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: 8
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/GlobalCart.tsx",
                                                lineNumber: 46,
                                                columnNumber: 56
                                            }, this) : item.emoji
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                            lineNumber: 45,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                flex: 1,
                                                minWidth: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        marginBottom: 3
                                                    },
                                                    children: name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                                    lineNumber: 49,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 13,
                                                        fontWeight: 800,
                                                        color: 'var(--o)'
                                                    },
                                                    children: [
                                                        "AED ",
                                                        (item.price * item.qty).toFixed(0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                                    lineNumber: 50,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 6,
                                                        marginTop: 5
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>updateQty(name, -1),
                                                            style: {
                                                                width: 22,
                                                                height: 22,
                                                                border: '1px solid var(--b)',
                                                                background: 'transparent',
                                                                borderRadius: 4,
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontWeight: 800
                                                            },
                                                            children: "−"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                                            lineNumber: 52,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: 13,
                                                                fontWeight: 700,
                                                                minWidth: 16,
                                                                textAlign: 'center'
                                                            },
                                                            children: item.qty
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                                            lineNumber: 53,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>updateQty(name, 1),
                                                            style: {
                                                                width: 22,
                                                                height: 22,
                                                                border: '1px solid var(--b)',
                                                                background: 'transparent',
                                                                borderRadius: 4,
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontWeight: 800
                                                            },
                                                            children: "+"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                                            lineNumber: 54,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                                    lineNumber: 51,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                            lineNumber: 48,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, name, true, {
                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                    lineNumber: 44,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/GlobalCart.tsx",
                            lineNumber: 42,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cart-summary",
                            style: {
                                borderTop: '1px solid var(--b)',
                                paddingTop: 14,
                                marginTop: 'auto'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 13,
                                        color: 'var(--g)',
                                        marginBottom: 6
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('cart.subtotal')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                            lineNumber: 62,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "AED ",
                                                total
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                            lineNumber: 63,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                    lineNumber: 61,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 13,
                                        color: 'var(--g)',
                                        marginBottom: 6
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('cart.delivery')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                            lineNumber: 66,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#22c55e',
                                                fontWeight: 600
                                            },
                                            children: t('cart.deliveryFree')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                            lineNumber: 67,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                    lineNumber: 65,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 15,
                                        fontWeight: 800,
                                        marginTop: 4,
                                        paddingTop: 8,
                                        borderTop: '1px solid var(--b)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('cart.total')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                            lineNumber: 70,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'var(--o)'
                                            },
                                            children: [
                                                "AED ",
                                                total
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/GlobalCart.tsx",
                                            lineNumber: 71,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                    lineNumber: 69,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/checkout",
                                    style: {
                                        display: 'block',
                                        textDecoration: 'none'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "checkout-btn",
                                        style: {
                                            width: '100%',
                                            padding: 14,
                                            background: 'var(--o)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 8,
                                            fontSize: 14,
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            marginTop: 14,
                                            transition: 'background 0.2s'
                                        },
                                        children: t('cart.checkout')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/GlobalCart.tsx",
                                        lineNumber: 74,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GlobalCart.tsx",
                                    lineNumber: 73,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/GlobalCart.tsx",
                            lineNumber: 60,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/GlobalCart.tsx",
                    lineNumber: 40,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/GlobalCart.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, this),
            isCartOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cart-overlay",
                onClick: onClose,
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    zIndex: 9998,
                    backdropFilter: 'blur(2px)',
                    animation: 'fadeIn 0.2s ease forwards'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/GlobalCart.tsx",
                lineNumber: 83,
                columnNumber: 28
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
                .global-cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    max-width: 380px;
                    background: var(--w);
                    z-index: 9999;
                    box-shadow: -4px 0 24px rgba(0,0,0,0.15);
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                }
                .global-cart-sidebar.open {
                    transform: translateX(0);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `
            }, void 0, false, {
                fileName: "[project]/src/components/GlobalCart.tsx",
                lineNumber: 85,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
_s(GlobalCart, "pSrGDhpj5G/dSw0tuqROjzId2EM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = GlobalCart;
var _c;
__turbopack_context__.k.register(_c, "GlobalCart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>t
]);
const translations = {
    en: {
        // Header
        'header.mode.delivery': 'Delivery',
        'header.mode.pickup': 'Pickup',
        'header.mode.dineIn': 'Dine-In',
        'header.selectLocation': 'Select Location →',
        'header.searchPlaceholder': 'Search menu...',
        'header.login': 'LOGIN',
        // Categories (chips)
        'category.best-sellers': 'Best Sellers',
        'category.special': 'Special Offers',
        'category.lovers': 'Lovers Box',
        'category.sakura': 'Sakura Combos',
        'category.cooked': 'Cooked Box',
        'category.vip': 'VIP Moriwase',
        'category.maki': 'Hoso Maki',
        'category.temaki': 'Temaki Handroll Sushi',
        'category.sashimi': 'Sashimi',
        'category.nigiri': 'Nigiri',
        'category.starters': 'Starters',
        'category.noodles': 'Noodles',
        'category.beverages': 'Beverages',
        'category.poke': 'Poke Bowl',
        'category.salad': 'Salad',
        'category.curry': 'Curry & Fried Rice',
        // Section titles
        'categoryTitle.special': 'Special Offers',
        'categoryTitle.lovers': 'Signature & Lovers Box',
        'categoryTitle.sakura': 'Sakura Combos',
        'categoryTitle.cooked': 'Cooked Box',
        'categoryTitle.vip': 'Fusion VIP Moriwase',
        'categoryTitle.maki': 'Hoso Maki',
        'categoryTitle.temaki': 'Temaki Handroll Sushi',
        'categoryTitle.sashimi': 'Sashimi & Sashimi Sets',
        'categoryTitle.nigiri': 'Nigiri Selection',
        'categoryTitle.starters': 'Starters & Soup',
        'categoryTitle.noodles': 'Noodles',
        'categoryTitle.beverages': 'Beverages',
        'categoryTitle.poke': 'Poke Bowl',
        'categoryTitle.salad': 'Salad',
        'categoryTitle.curry': 'Japanese Curry & Fried Rice',
        // Cart
        'cart.title': 'Your Order',
        'cart.emptyTitle': 'Your Cart is Empty',
        'cart.emptyBody': 'Please add some items from the menu.',
        'cart.subtotal': 'Subtotal',
        'cart.delivery': 'Delivery',
        'cart.deliveryFree': 'FREE',
        'cart.total': 'Total',
        'cart.checkout': 'Proceed to Checkout →',
        // Search
        'search.noResultsPrefix': 'No items found for',
        // Location modal
        'location.title': 'Select Location',
        'location.selectedPrefix': 'You have selected',
        'location.bodySuffix': 'Please provide your location details.',
        'location.useMyLocation': 'USE MY LOCATION',
        'location.city': 'City',
        'location.store': 'Store',
        'location.selectYourCity': 'Select your city',
        'location.selectStore': 'Select a store',
        'location.proceed': 'PROCEED'
    },
    ar: {
        // Header
        'header.mode.delivery': 'توصيل',
        'header.mode.pickup': 'استلام',
        'header.mode.dineIn': 'تناول في المطعم',
        'header.selectLocation': 'اختر الموقع →',
        'header.searchPlaceholder': 'ابحث في القائمة...',
        'header.login': 'تسجيل الدخول',
        // Categories (chips)
        'category.best-sellers': 'الأكثر مبيعاً',
        'category.special': 'العروض الخاصة',
        'category.lovers': 'صناديق العشّاق',
        'category.sakura': 'تشكيلة ساكورا',
        'category.cooked': 'صندوق الأطباق المطهية',
        'category.vip': 'في آي بي موريواسي',
        'category.maki': 'هوسو ماكي',
        'category.temaki': 'تيمّاكي سوشي',
        'category.sashimi': 'ساشيمي',
        'category.nigiri': 'نيجيري',
        'category.starters': 'المقبلات',
        'category.noodles': 'النودلز',
        'category.beverages': 'المشروبات',
        'category.poke': 'بول بوكي',
        'category.salad': 'السلطات',
        'category.curry': 'الكاري والأرز المقلي',
        // Section titles
        'categoryTitle.special': 'العروض الخاصة',
        'categoryTitle.lovers': 'صناديق التوقيع والعشّاق',
        'categoryTitle.sakura': 'تشكيلة ساكورا',
        'categoryTitle.cooked': 'صندوق السوشي المطهو',
        'categoryTitle.vip': 'في آي بي موريواسي',
        'categoryTitle.maki': 'هوسو ماكي',
        'categoryTitle.temaki': 'تيمّاكي هاند رول',
        'categoryTitle.sashimi': 'ساشيمي وتشكيلة الساشيمي',
        'categoryTitle.nigiri': 'تشكيلة النيجيري',
        'categoryTitle.starters': 'المقبلات والحساء',
        'categoryTitle.noodles': 'النودلز',
        'categoryTitle.beverages': 'المشروبات',
        'categoryTitle.poke': 'بول بوكي',
        'categoryTitle.salad': 'السلطات',
        'categoryTitle.curry': 'الكاري الياباني والأرز المقلي',
        // Cart
        'cart.title': 'طلبك',
        'cart.emptyTitle': 'سلة التسوق فارغة',
        'cart.emptyBody': 'الرجاء إضافة بعض العناصر من القائمة.',
        'cart.subtotal': 'الإجمالي الفرعي',
        'cart.delivery': 'التوصيل',
        'cart.deliveryFree': 'مجاني',
        'cart.total': 'الإجمالي',
        'cart.checkout': 'إتمام الطلب →',
        // Search
        'search.noResultsPrefix': 'لا توجد عناصر لـ',
        // Location modal
        'location.title': 'اختيار الموقع',
        'location.selectedPrefix': 'لقد اخترت',
        'location.bodySuffix': 'يرجى إدخال تفاصيل موقعك.',
        'location.useMyLocation': 'استخدام موقعي الحالي',
        'location.city': 'المدينة',
        'location.store': 'الفرع',
        'location.selectYourCity': 'اختر المدينة',
        'location.selectStore': 'اختر الفرع',
        'location.proceed': 'متابعة'
    }
};
function t(language, key) {
    const langTable = translations[language];
    if (langTable && key in langTable) return langTable[key];
    const fallback = translations.en[key];
    return fallback ?? key;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/ClientLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SettingsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GlobalCart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GlobalCart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function ClientLayout({ children }) {
    _s();
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('en');
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const t = (key)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"])(language, key);
    // If we are in the admin dashboard, we don't need the CartProvider
    if (pathname?.startsWith('/admin')) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartProvider"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GlobalCart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    t: t
                }, void 0, false, {
                    fileName: "[project]/src/app/ClientLayout.tsx",
                    lineNumber: 28,
                    columnNumber: 17
                }, this),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/ClientLayout.tsx",
            lineNumber: 23,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/ClientLayout.tsx",
        lineNumber: 22,
        columnNumber: 9
    }, this);
}
_s(ClientLayout, "DP0y/lkD/ZGLHj3HIPvAPWXBfis=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ClientLayout;
var _c;
__turbopack_context__.k.register(_c, "ClientLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_af9cccef._.js.map