'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Users, Star, Clock, ChevronRight, Flame, Bike, Package, Utensils, XCircle } from "lucide-react";
import { useUser } from '@clerk/nextjs';
import { getAnalyticsDashboard, DashboardData } from '@/lib/api';
import { useLocation } from '@/context/LocationContext';

const RANK_COLORS = [
    { bg: "#fbbf24", text: "#000" },
    { bg: "#9ca3af", text: "#000" },
    { bg: "#b45309", text: "#fff" },
    { bg: "rgba(255,255,255,0.08)", text: "#6b7280" },
    { bg: "rgba(255,255,255,0.08)", text: "#6b7280" },
];

const MODE_COLORS: Record<string, { color: string; icon: React.ReactNode }> = {
    Delivery: { color: "#FF6A0C", icon: <Bike size={20} /> },
    Pickup: { color: "#818cf8", icon: <Package size={20} /> },
    'Dine-In': { color: "#34d399", icon: <Utensils size={20} /> },
};

export default function AdminOverviewPage() {
    const { location } = useLocation();
    const { user, isLoaded } = useUser();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const rawRole = (user?.publicMetadata?.role as string || 'customer');
    const userRole = rawRole.toLowerCase();

    useEffect(() => {
        if (!isLoaded) return;
        
        const activeBranchId = location?.branchId !== undefined ? location.branchId : (userRole === 'branch_manager' ? user?.publicMetadata?.branchId as string : undefined);

        getAnalyticsDashboard(activeBranchId ?? undefined)
            .then(setData)
            .catch(e => console.error('Failed to load dashboard', e))
            .finally(() => setLoading(false));
    }, [isLoaded, user, location?.branchId, userRole]);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const kpis = data ? [
        { label: "Revenue", value: `AED ${data.kpis.revenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, icon: DollarSign, color: "#FF6A0C", glow: "rgba(255,106,12,0.15)" },
        { label: "Orders", value: data.kpis.orders.toLocaleString(), icon: ShoppingBag, color: "#818cf8", glow: "rgba(129,140,248,0.15)" },
        { label: "Canceled", value: data.kpis.cancelledOrders.toLocaleString(), icon: XCircle, color: "#f87171", glow: "rgba(248,113,113,0.15)" },
        { label: "Customers", value: data.kpis.customers.toLocaleString(), icon: Users, color: "#34d399", glow: "rgba(52,211,153,0.15)" },
        { label: "Avg Order", value: `AED ${data.kpis.avgOrder.toFixed(1)}`, icon: Star, color: "#fbbf24", glow: "rgba(251,191,36,0.15)" },
    ] : [];

    return (
        <div style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            color: "#fff",
            position: "relative",
        }}>

            {/* ── Ambient background glows ── */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                <div style={{
                    position: "absolute", top: -160, right: -120,
                    width: 600, height: 600, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,106,12,0.07) 0%, transparent 70%)",
                }} />
                <div style={{
                    position: "absolute", bottom: -100, left: -80,
                    width: 440, height: 440, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)",
                }} />
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                }} />
            </div>

            {/* ── Page content ── */}
            <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, padding: "0 4px" }}>

                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "flex-start",
                    justifyContent: "space-between", marginBottom: 32,
                    animation: "fadeUp 0.4s ease both",
                }}>
                    <div>
                        <h2 style={{
                            fontSize: 26, fontWeight: 800, margin: "0 0 4px",
                            letterSpacing: "-0.04em", color: "#fff",
                        }}>
                            Overview
                        </h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                            {today}
                        </p>
                    </div>
                    <Link href="/admin/orders" style={{
                        fontSize: 12, fontWeight: 700, color: "#FF6A0C",
                        display: "flex", alignItems: "center", gap: 3,
                        textDecoration: "none",
                    }}>
                        View all <ChevronRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                        Loading dashboard…
                    </div>
                ) : !data ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                        Failed to load dashboard data.
                    </div>
                ) : (
                    <>
                        {/* ── KPI Cards ── */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: 16, marginBottom: 20,
                        }}>
                            {kpis.map((k, i) => (
                                <div key={k.label} style={{
                                    position: "relative",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: 16,
                                    padding: "20px 22px",
                                    overflow: "hidden",
                                    animation: `fadeUp 0.45s ease both`,
                                    animationDelay: `${i * 0.07}s`,
                                    transition: "border-color 0.2s, transform 0.2s",
                                    cursor: "default",
                                }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.borderColor = k.color + "44";
                                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                    }}
                                >
                                    <div style={{
                                        position: "absolute", top: 0, right: 0,
                                        width: 120, height: 120, borderRadius: "50%",
                                        background: `radial-gradient(circle, ${k.glow} 0%, transparent 70%)`,
                                        transform: "translate(30%, -30%)",
                                        pointerEvents: "none",
                                    }} />

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                                            textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
                                        }}>
                                            {k.label}
                                        </span>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 9,
                                            background: k.color + "1a",
                                            border: `1px solid ${k.color}33`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <k.icon size={14} style={{ color: k.color }} />
                                        </div>
                                    </div>

                                    <p style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.04em", color: "#fff" }}>
                                        {k.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* ── Mode Split ── */}
                        <div style={{
                            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 16, marginBottom: 20,
                        }}>
                            {data.modeSplit.map((m, i) => {
                                const cfg = MODE_COLORS[m.label] || { color: "#FF6A0C", icon: <Bike size={20} /> };
                                return (
                                    <div key={m.label} style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.07)",
                                        borderRadius: 16,
                                        padding: "16px 20px",
                                        display: "flex", alignItems: "center", gap: 16,
                                        animation: `fadeUp 0.45s ease both`,
                                        animationDelay: `${0.28 + i * 0.07}s`,
                                    }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                                            background: cfg.color + "18",
                                            border: `1px solid ${cfg.color}33`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 20,
                                        }}>
                                            {cfg.icon}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{m.label}</span>
                                                <span style={{ fontSize: 13, fontWeight: 800, color: cfg.color }}>{m.pct}%</span>
                                            </div>
                                            <div style={{
                                                height: 4, background: "rgba(255,255,255,0.06)",
                                                borderRadius: 99, overflow: "hidden",
                                            }}>
                                                <div style={{
                                                    height: "100%", borderRadius: 99,
                                                    background: cfg.color,
                                                    width: `${m.pct}%`,
                                                    boxShadow: `0 0 8px ${cfg.color}88`,
                                                }} />
                                            </div>
                                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "5px 0 0" }}>
                                                {m.count} orders
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Bottom grid: Orders + Canceled + Top Products ── */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1.8fr 1.8fr 1.4fr",
                            gap: 16,
                            animation: "fadeUp 0.5s ease both",
                            animationDelay: "0.45s",
                        }}>

                            {/* Recent Orders */}
                            <div style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 16, overflow: "hidden",
                            }}>
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "16px 20px",
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{
                                            width: 26, height: 26, borderRadius: 7,
                                            background: "rgba(255,106,12,0.15)",
                                            border: "1px solid rgba(255,106,12,0.25)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <Clock size={13} style={{ color: "#FF6A0C" }} />
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Recent Orders</span>
                                    </div>
                                    <Link href="/admin/orders" style={{
                                        display: "flex", alignItems: "center", gap: 3,
                                        fontSize: 12, color: "#FF6A0C", textDecoration: "none", fontWeight: 600,
                                        opacity: 0.85,
                                    }}>
                                        All <ChevronRight size={12} />
                                    </Link>
                                </div>

                                {data.recentOrders.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>
                                        No orders yet.
                                    </div>
                                ) : data.recentOrders.map((o, i) => (
                                    <div key={o.id + i} style={{
                                        display: "flex", alignItems: "center", gap: 14,
                                        padding: "13px 20px",
                                        borderBottom: i < data.recentOrders.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                        transition: "background 0.15s",
                                        cursor: "default",
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                            background: "rgba(255,106,12,0.08)",
                                            border: "1px solid rgba(255,106,12,0.15)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 14,
                                        }}>
                                            {o.mode}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#FF6A0C", fontWeight: 700 }}>
                                                    {o.id}
                                                </span>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {o.name}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{o.branch}</span>
                                        </div>

                                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                                                {o.total}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Canceled Orders */}
                            <div style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 16, overflow: "hidden",
                            }}>
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "16px 20px",
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{
                                            width: 26, height: 26, borderRadius: 7,
                                            background: "rgba(248,113,113,0.15)",
                                            border: "1px solid rgba(248,113,113,0.25)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <XCircle size={13} style={{ color: "#f87171" }} />
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Canceled Orders</span>
                                    </div>
                                </div>

                                {data.recentCanceledOrders.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>
                                        No canceled orders.
                                    </div>
                                ) : data.recentCanceledOrders.map((o, i) => (
                                    <div key={o.id + i} style={{
                                        display: "flex", alignItems: "center", gap: 14,
                                        padding: "13px 20px",
                                        borderBottom: i < data.recentCanceledOrders.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                        transition: "background 0.15s",
                                        cursor: "default",
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                            background: "rgba(248,113,113,0.08)",
                                            border: "1px solid rgba(248,113,113,0.15)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 14,
                                        }}>
                                            {o.mode}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#f87171", fontWeight: 700 }}>
                                                    {o.id}
                                                </span>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {o.name}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{o.branch}</span>
                                        </div>

                                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                                                {o.total}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Top Products */}
                            <div style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 16, overflow: "hidden",
                            }}>
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "16px 20px",
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{
                                            width: 26, height: 26, borderRadius: 7,
                                            background: "rgba(255,106,12,0.15)",
                                            border: "1px solid rgba(255,106,12,0.25)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <Flame size={13} style={{ color: "#FF6A0C" }} />
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Top Products</span>
                                    </div>
                                </div>

                                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
                                    {data.topProducts.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>
                                            No product data.
                                        </div>
                                    ) : data.topProducts.slice(0, 5).map((p, i) => (
                                        <div key={p.name}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                                                    <div style={{
                                                        width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                                                        background: RANK_COLORS[i]?.bg || "rgba(255,255,255,0.08)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 9, fontWeight: 900, color: RANK_COLORS[i]?.text || "#6b7280",
                                                    }}>
                                                        {i + 1}
                                                    </div>
                                                    <span style={{
                                                        fontSize: 11, color: "rgba(255,255,255,0.65)",
                                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                        fontWeight: 500,
                                                    }}>
                                                        {p.name}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0, marginLeft: 8, fontWeight: 600 }}>
                                                    {p.orders}
                                                </span>
                                            </div>
                                            <div style={{
                                                height: 3, background: "rgba(255,255,255,0.05)",
                                                borderRadius: 99, overflow: "hidden",
                                                marginLeft: 30,
                                            }}>
                                                <div style={{
                                                    height: "100%", borderRadius: 99,
                                                    background: i === 0
                                                        ? "linear-gradient(90deg, #FF6A0C, #ffb380)"
                                                        : `rgba(255,106,12,${0.7 - i * 0.12})`,
                                                    width: `${p.pct}%`,
                                                    boxShadow: i === 0 ? "0 0 8px rgba(255,106,12,0.6)" : "none",
                                                    transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    margin: "0 20px 16px",
                                    padding: "12px 16px",
                                    background: "rgba(255,106,12,0.06)",
                                    border: "1px solid rgba(255,106,12,0.15)",
                                    borderRadius: 10,
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.04em" }}>
                                        TOTAL ITEMS
                                    </span>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: "#FF6A0C", letterSpacing: "-0.02em" }}>
                                        {data.totalItemsSold.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 1024px) {
                    .kpi-grid   { grid-template-columns: repeat(2, 1fr) !important; }
                    .bottom-grid { grid-template-columns: 1fr !important; }
                }
            `}
            </style>
        </div>
    );
}