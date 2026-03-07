'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

export default function CustomerLoginPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

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
                        minHeight: "570px",
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
                            <Image
                                src="logo.png"
                                width={125}
                                height={90}
                                alt="Brand Logo"
                                style={{ objectFit: "contain", maxHeight: "90px", marginBottom: "14px", filter: "brightness(0) invert(1)" }}
                            />
                            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: 400, marginBottom: "3px" }}>
                                Login to Unlock
                            </h2>
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
                                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 17, height: 17 }}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>,
                                    title: "Great", desc: "Food & Taste",
                                },
                                {
                                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 17, height: 17 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>,
                                    title: "Great", desc: "Offers & Deals",
                                },
                                {
                                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 17, height: 17 }}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
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

                        {/* Food images area */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "280px", zIndex: 10 }}>
                        </div>
                    </div>

                    {/* ════════════════════════════
                        RIGHT — Clerk SignIn
                    ════════════════════════════ */}
                    <div
                        style={{
                            flex: 1,
                            background: "white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
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
                                zIndex: 10,
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            <X size={22} strokeWidth={2} />
                        </button>

                        {/* Clerk SignIn Component */}
                        <SignIn
                            forceRedirectUrl="/"
                            fallbackRedirectUrl="/"
                        />

                        {/* Skip */}
                        <div style={{ textAlign: "center", marginTop: "16px" }}>
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