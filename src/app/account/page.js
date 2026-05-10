"use client";
import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import Link from "next/link";

const formatPrice = (p) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

const statusColors = {
    completed: { bg: "#f0faf0", color: "#2d7a2d" },
    processing: { bg: "#fff8e6", color: "#b8860b" },
    pending: { bg: "#f0f4ff", color: "#3a5a9b" },
    cancelled: { bg: "#fff0f0", color: "#c0392b" },
    refunded: { bg: "#f8f0ff", color: "#7b3fa0" },
    "on-hold": { bg: "#f5f5f0", color: "#777" },
};

export default function AccountPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.wcId) { setLoading(false); return; }
        fetch(`/api/wc/orders?customer=${user.wcId}&per_page=5`)
            .then(r => r.json())
            .then(data => { setOrders(Array.isArray(data) ? data : []); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user?.wcId]);

    return (
        <div>
            {/* Welcome */}
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, lineHeight: 1.8, color: "var(--charcoal-light)", marginBottom: 36, maxWidth: 600 }}>
                From your account dashboard you can view your{" "}
                <Link href="/account/orders" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>recent orders</Link>,
                manage your{" "}
                <Link href="/account/addresses" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>shipping and billing addresses</Link>,
                and edit your{" "}
                <Link href="/account/details" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>account details</Link>.
            </p>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
                {[
                    { label: "Total Orders", value: orders.length > 0 ? `${orders.length}+` : "0" },
                    { label: "Wishlist", value: "View →", href: "/wishlist" },
                    { label: "Addresses", value: "Manage →", href: "/account/addresses" },
                ].map((stat) => (
                    <div key={stat.label} style={{ background: "var(--ivory-dark)", padding: "20px 24px", borderRadius: 4, border: "1px solid var(--border)" }}>
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--warm-gray)", marginBottom: 8 }}>
                            {stat.label}
                        </p>
                        {stat.href ? (
                            <Link href={stat.href} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "var(--gold)", textDecoration: "none" }}>
                                {stat.value}
                            </Link>
                        ) : (
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "var(--maroon)", margin: 0 }}>
                                {stat.value}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: "var(--maroon)", marginBottom: 20 }}>
                    Recent Orders
                </h2>

                {loading ? (
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>Loading orders…</p>
                ) : orders.length === 0 ? (
                    <div style={{ background: "var(--ivory-dark)", padding: 32, textAlign: "center", borderRadius: 4 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "var(--warm-gray)", marginBottom: 12 }}>
                            No orders yet
                        </p>
                        <Link href="/shop" className="btn-outline" style={{ fontSize: 11 }}>Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "var(--ivory-dark)" }}>
                                    {["Order", "Date", "Status", "Total", ""].map(h => (
                                        <th key={h} style={{ padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--warm-gray)", textAlign: "left" }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, i) => {
                                    const sc = statusColors[order.status] || { bg: "#f5f5f5", color: "#555" };
                                    return (
                                        <tr key={order.id} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "var(--ivory)" }}>
                                            <td style={{ padding: "14px 16px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--maroon)" }}>#{order.number}</td>
                                            <td style={{ padding: "14px 16px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>
                                                {new Date(order.date_created).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span style={{ background: sc.bg, color: sc.color, fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 50 }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 16px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--maroon)", fontWeight: 500 }}>
                                                {formatPrice(order.total)}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <Link href={`/account/orders/${order.id}`} style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--gold)", textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>
                                                    View →
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", textAlign: "right" }}>
                            <Link href="/account/orders" style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--gold)", textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>
                                View All Orders →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}