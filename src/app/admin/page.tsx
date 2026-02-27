'use client';
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Users, Star, Clock, ChevronRight, Flame } from "lucide-react";

const KPIS = [
    { label: "Revenue", value: "AED 48,320", delta: "+12.4%", up: true,  icon: DollarSign, color: "#FF6A0C",  glow: "rgba(255,106,12,0.15)"  },
    { label: "Orders",  value: "1,284",      delta: "+8.1%",  up: true,  icon: ShoppingBag, color: "#818cf8", glow: "rgba(129,140,248,0.15)" },
    { label: "Customers",value: "342",        delta: "-3.2%",  up: false, icon: Users,       color: "#34d399", glow: "rgba(52,211,153,0.15)"  },
    { label: "Avg Order",value: "AED 37.6",   delta: "+4.0%",  up: true,  icon: Star,        color: "#fbbf24", glow: "rgba(251,191,36,0.15)"  },
];

const ORDERS = [
    { id: "#10482", name: "Ahmed Al Rashidi", branch: "Downtown",   mode: "🛵", total: "AED 89",  status: "Preparing", dot: "#fb923c" },
    { id: "#10481", name: "Sara Nasser",       branch: "Marina",     mode: "🏠", total: "AED 149", status: "Ready",     dot: "#4ade80" },
    { id: "#10480", name: "James Park",        branch: "Motor City", mode: "🍽️", total: "AED 220", status: "Confirmed", dot: "#60a5fa" },
    { id: "#10479", name: "Lena Hoffman",      branch: "Downtown",   mode: "🛵", total: "AED 59",  status: "Completed", dot: "#6b7280" },
    { id: "#10478", name: "Mohammed Sultan",   branch: "Marina",     mode: "🛵", total: "AED 99",  status: "Cancelled", dot: "#f87171" },
];

const TOP = [
    { name: "Fusion VIP Moriwase 32 Pcs", orders: 284, pct: 88 },
    { name: "Dear Box 16 Pcs",             orders: 231, pct: 72 },
    { name: "Salmon Sashimi 5 Pcs",        orders: 198, pct: 61 },
    { name: "Happy Box 16 Pcs",            orders: 176, pct: 54 },
    { name: "Party Platter 64 Pcs",        orders: 143, pct: 44 },
];

const MODES = [
    { label: "Delivery", pct: 58, count: 745, color: "#FF6A0C", icon: "🛵" },
    { label: "Pickup",   pct: 26, count: 334, color: "#818cf8", icon: "🏠" },
    { label: "Dine-In",  pct: 16, count: 205, color: "#34d399", icon: "🍽️" },
];

const RANK_COLORS = [
    { bg: "#fbbf24", text: "#000" },
    { bg: "#9ca3af", text: "#000" },
    { bg: "#b45309", text: "#fff" },
    { bg: "rgba(255,255,255,0.08)", text: "#6b7280" },
    { bg: "rgba(255,255,255,0.08)", text: "#6b7280" },
];

export default function AdminOverviewPage() {
    return (
        <div style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            color: "#fff",
            position: "relative",
        }}>

            {/* ── Ambient background glows (sit behind all content) ── */}
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
                {/* Subtle grid */}
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
                            Thursday, 26 February 2026
                        </p>
                    </div>
                    <select style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.5)",
                        borderRadius: 10, padding: "8px 14px",
                        fontSize: 12, outline: "none", cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s",
                    }}>
                        <option>Last 30 days</option>
                        <option>This week</option>
                        <option>This year</option>
                    </select>
                </div>

                {/* ── KPI Cards ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16, marginBottom: 20,
                }}>
                    {KPIS.map((k, i) => (
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
                            {/* Ambient glow */}
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

                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {k.up
                                    ? <TrendingUp size={11} style={{ color: "#4ade80" }} />
                                    : <TrendingDown size={11} style={{ color: "#f87171" }} />}
                                <span style={{ fontSize: 11, fontWeight: 700, color: k.up ? "#4ade80" : "#f87171" }}>
                                    {k.delta}
                                </span>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>vs last month</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Mode Split ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 16, marginBottom: 20,
                }}>
                    {MODES.map((m, i) => (
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
                                background: m.color + "18",
                                border: `1px solid ${m.color}33`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 20,
                            }}>
                                {m.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{m.label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.pct}%</span>
                                </div>
                                <div style={{
                                    height: 4, background: "rgba(255,255,255,0.06)",
                                    borderRadius: 99, overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%", borderRadius: 99,
                                        background: m.color,
                                        width: `${m.pct}%`,
                                        boxShadow: `0 0 8px ${m.color}88`,
                                    }} />
                                </div>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "5px 0 0" }}>
                                    {m.count} orders
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom grid: Orders + Top Products ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "3fr 2fr",
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
                        {/* Card header */}
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
                            <a href="/admin/orders" style={{
                                display: "flex", alignItems: "center", gap: 3,
                                fontSize: 12, color: "#FF6A0C", textDecoration: "none", fontWeight: 600,
                                opacity: 0.85,
                            }}>
                                View all <ChevronRight size={12} />
                            </a>
                        </div>

                        {/* Order rows */}
                        {ORDERS.map((o, i) => (
                            <div key={o.id} style={{
                                display: "flex", alignItems: "center", gap: 14,
                                padding: "13px 20px",
                                borderBottom: i < ORDERS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                transition: "background 0.15s",
                                cursor: "default",
                            }}
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                                {/* Mode icon */}
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                    background: "rgba(255,106,12,0.08)",
                                    border: "1px solid rgba(255,106,12,0.15)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 16,
                                }}>
                                    {o.mode}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#FF6A0C", fontWeight: 700 }}>
                                            {o.id}
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {o.name}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{o.branch}</span>
                                </div>

                                {/* Amount + status */}
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                                        {o.total}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5 }}>
                                        <div style={{
                                            width: 5, height: 5, borderRadius: "50%",
                                            background: o.dot,
                                            boxShadow: `0 0 5px ${o.dot}`,
                                        }} />
                                        <span style={{ fontSize: 10, fontWeight: 700, color: o.dot, letterSpacing: "0.04em" }}>
                                            {o.status}
                                        </span>
                                    </div>
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
                        {/* Card header */}
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
                            <a href="/admin/analytics" style={{
                                display: "flex", alignItems: "center", gap: 3,
                                fontSize: 12, color: "#FF6A0C", textDecoration: "none", fontWeight: 600,
                                opacity: 0.85,
                            }}>
                                Full report <ChevronRight size={12} />
                            </a>
                        </div>

                        {/* Product rows */}
                        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
                            {TOP.map((p, i) => (
                                <div key={p.name}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                                            {/* Rank badge */}
                                            <div style={{
                                                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                                                background: RANK_COLORS[i].bg,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 9, fontWeight: 900, color: RANK_COLORS[i].text,
                                            }}>
                                                {i + 1}
                                            </div>
                                            <span style={{
                                                fontSize: 12, color: "rgba(255,255,255,0.65)",
                                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                fontWeight: 500,
                                            }}>
                                                {p.name}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", flexShrink: 0, marginLeft: 8, fontWeight: 600 }}>
                                            {p.orders}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
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

                        {/* Bottom total strip */}
                        <div style={{
                            margin: "0 20px 16px",
                            padding: "12px 16px",
                            background: "rgba(255,106,12,0.06)",
                            border: "1px solid rgba(255,106,12,0.15)",
                            borderRadius: 10,
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.04em" }}>
                                TOTAL ITEMS SOLD
                            </span>
                            <span style={{ fontSize: 15, fontWeight: 800, color: "#FF6A0C", letterSpacing: "-0.02em" }}>
                                1,032
                            </span>
                        </div>
                    </div>

                </div>
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
            `}</style>
        </div>
    );
}