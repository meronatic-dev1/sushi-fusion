'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

export default function CustomerLoginPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
        router.push("/"); // Return to main landing page on close
    };

    if (!isOpen) return null;

    return (
        <>
            {/* ══════════════════════════════════════
                DIMMED BACKDROP — shows site behind
            ══════════════════════════════════════ */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 999,
                    backgroundColor: "rgba(0, 0, 0, 0.60)",
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                }}
            />

            {/* ══════════════════════════════════════
                MODAL — perfectly centered
            ══════════════════════════════════════ */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    pointerEvents: "none",
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        pointerEvents: "auto",
                        display: "flex",
                        width: "100%",
                        maxWidth: "880px",
                        height: "570px",
                        borderRadius: "22px",
                        overflow: "hidden",
                        boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                >

                    {/* ════════════════════════════
                        LEFT — Red branding panel
                    ════════════════════════════ */}
                    <div
                        style={{
                            width: "42%",
                            flexShrink: 0,
                            background: "#e84d19",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Dot pattern */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                pointerEvents: "none",
                                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.48) 1.3px, transparent 1.3px)",
                                backgroundSize: "16px 16px",
                            }}
                        />

                        {/* Logo + tagline */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                paddingTop: "36px",
                                paddingLeft: "24px",
                                paddingRight: "24px",
                                textAlign: "center",
                                color: "white",
                            }}
                        >
                            {/* Replace /sushi-fusion-logo.png with your logo */}
                            <Image
                                src="/sushi-fusion-logo.png"
                                width={125}
                                height={90}
                                alt="Brand Logo"
                                style={{ objectFit: "contain", maxHeight: "90px", marginBottom: "14px", filter: "brightness(0) invert(1)" }}
                            />
                            <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: 400, marginBottom: "3px" }}>
                                Login to Unlock
                            </p>
                            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
                                awesome new features
                            </h2>
                        </div>

                        {/* Feature icons */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 10,
                                display: "flex",
                                justifyContent: "center",
                                gap: "22px",
                                padding: "18px 20px 0",
                                color: "white",
                            }}
                        >
                            {[
                                {
                                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 17, height: 17 }}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
                                    title: "Great", desc: "Food & Taste",
                                },
                                {
                                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 17, height: 17 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                                    title: "Great", desc: "Offers & Deals",
                                },
                                {
                                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 17, height: 17 }}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
                                    title: "Easy", desc: "Ordering",
                                },
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", textAlign: "center" }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: "50%",
                                        background: "rgba(255,255,255,0.18)",
                                        border: "1.5px solid rgba(255,255,255,0.4)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        {item.icon}
                                    </div>
                                    <p style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1, margin: 0 }}>{item.title}</p>
                                    <p style={{ fontSize: 8.5, fontWeight: 600, opacity: 0.88, lineHeight: 1, whiteSpace: "nowrap", margin: 0 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Food images — replace /food-item-1.png and /food-item-2.png */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "280px", zIndex: 10 }}>
                        </div>
                    </div>

                    {/* ════════════════════════════
                        RIGHT — Login form
                    ════════════════════════════ */}
                    <div
                        style={{
                            flex: 1,
                            background: "white",
                            display: "flex",
                            flexDirection: "column",
                            padding: "38px 46px 28px 46px",
                            overflowY: "auto",
                            position: "relative",
                        }}
                    >
                        {/* × Close */}
                        <button
                            onClick={handleClose}
                            aria-label="Close"
                            style={{
                                position: "absolute", top: 16, right: 18,
                                background: "transparent", border: "none",
                                cursor: "pointer", padding: "6px",
                                color: "#555", lineHeight: 0, borderRadius: "50%",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            <X size={22} strokeWidth={2} />
                        </button>

                        {/* Heading */}
                        <h2 style={{ fontSize: 30, fontWeight: 700, color: "#111", lineHeight: 1.25, margin: "0 0 3px" }}>Login with your</h2>
                        <h2 style={{ fontSize: 30, fontWeight: 700, color: "#111", lineHeight: 1.25, margin: "0 0 8px" }}>Mobile number</h2>
                        <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 24px", fontWeight: 400 }}>Login with a valid local mobile number</p>

                        {/* Phone input */}
                        <div style={{ marginBottom: 6 }}>
                            <div style={{
                                display: "flex", alignItems: "center",
                                border: "1.5px solid #cdd5dc", borderRadius: 10,
                                overflow: "hidden", background: "white",
                            }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 7,
                                    padding: "13px 14px",
                                    borderRight: "1.5px solid #cdd5dc",
                                    cursor: "pointer", flexShrink: 0,
                                }}>
                                    {/* UAE flag */}
                                    <svg viewBox="0 0 640 480" style={{ width: 26, height: 18, borderRadius: 2, flexShrink: 0 }}>
                                        <path fill="#00732f" d="M0 0h640v160H0z"/>
                                        <path fill="#fff"    d="M0 160h640v160H0z"/>
                                        <path fill="#000"    d="M0 320h640v160H0z"/>
                                        <path fill="#f00"    d="M0 0h220v480H0z"/>
                                    </svg>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>+971</span>
                                    <svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }} fill="none" stroke="#888" strokeWidth="2.5">
                                        <path d="M6 9l6 6 6-6"/>
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Mobile Number*"
                                    style={{
                                        flex: 1, padding: "13px 14px",
                                        fontSize: 14, fontWeight: 500, color: "#222",
                                        border: "none", outline: "none", background: "transparent",
                                    }}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <p style={{ fontSize: 11, color: "#bbb", marginTop: 6, marginLeft: 2 }}>E.g. 5XXXXXXXX</p>
                        </div>

                        {/* SEND OTP */}
                        <button
                            style={{
                                width: "100%", height: 56,
                                marginTop: 14, marginBottom: 16,
                                borderRadius: 10, border: "none", cursor: "pointer",
                                fontSize: 14, fontWeight: 800,
                                letterSpacing: "0.18em", textTransform: "uppercase",
                                color: "white",
                                backgroundColor: phoneNumber.length >= 7 ? "#E8192C" : "#9fb8cc",
                                boxShadow: phoneNumber.length >= 7 ? "0 6px 20px rgba(232,25,44,0.38)" : "none",
                                transition: "background-color 0.3s, box-shadow 0.3s",
                            }}
                        >
                            SEND OTP
                        </button>

                        {/* Checkbox helper */}
                        {[
                            {
                                checked: agreeTerms,
                                toggle: () => setAgreeTerms(!agreeTerms),
                                label: (
                                    <span style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                                        By using the Sushi Fusion UAE website - you agree to our{" "}
                                        <Link href="#" style={{ fontWeight: 700, color: "#444", textDecoration: "underline", textUnderlineOffset: 2 }}>Cookie Policy</Link>
                                        {" "},{" "}
                                        <Link href="#" style={{ fontWeight: 700, color: "#444", textDecoration: "underline", textUnderlineOffset: 2 }}>Terms & Conditions</Link>
                                        {" "}and{" "}
                                        <Link href="#" style={{ fontWeight: 700, color: "#444", textDecoration: "underline", textUnderlineOffset: 2 }}>Privacy Policy</Link>
                                    </span>
                                ),
                            },
                            {
                                checked: agreeMarketing,
                                toggle: () => setAgreeMarketing(!agreeMarketing),
                                label: <span style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>By enabling you will be updated with latest marketing offers</span>,
                            },
                        ].map((item, i) => (
                            <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 14 }}>
                                <div
                                    onClick={item.toggle}
                                    style={{
                                        width: 17, height: 17, flexShrink: 0, marginTop: 1,
                                        border: `2px solid ${item.checked ? "#222" : "#bbb"}`,
                                        borderRadius: 3,
                                        backgroundColor: item.checked ? "#222" : "white",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.15s", cursor: "pointer",
                                    }}
                                >
                                    {item.checked && (
                                        <svg viewBox="0 0 12 10" style={{ width: 10, height: 10 }} fill="none" stroke="white" strokeWidth="2.2">
                                            <path d="M1 5l3.5 3.5L11 1" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                                {item.label}
                            </label>
                        ))}

                        {/* Social login */}
                        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#444", margin: "6px 0 12px" }}>
                            Login with Social Accounts
                        </p>
                        <button
                            style={{
                                width: "100%", height: 54,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                                border: "1.5px solid #cdd5dc", borderRadius: 10,
                                background: "white", cursor: "pointer", marginBottom: 20,
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"}
                            onMouseLeave={e => e.currentTarget.style.background = "white"}
                        >
                            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, flexShrink: 0 }}>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: "0.18em", color: "#222" }}>GOOGLE</span>
                        </button>

                        {/* Skip */}
                        <div style={{ textAlign: "center" }}>
                            <Link
                                href="/"
                                style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.28em", color: "#888", textDecoration: "none" }}
                            >
                                SKIP LOGIN
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}