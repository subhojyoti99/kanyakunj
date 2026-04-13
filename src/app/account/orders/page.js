"use client";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/authStore";
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

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.wcId) { setLoading(false); return; }
    fetch(`/api/wc/orders?customer=${user.wcId}&per_page=50`)
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.wcId]);

  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, color: "var(--charcoal)", marginBottom: 28 }}>
        My Orders
      </h2>

      {loading ? (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>Loading orders…</p>
      ) : orders.length === 0 ? (
        <div style={{ background: "var(--ivory-dark)", padding: 48, textAlign: "center", borderRadius: 4 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "var(--warm-gray)", marginBottom: 16 }}>
            No orders yet
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)", marginBottom: 24 }}>
            When you place an order, it will appear here.
          </p>
          <Link href="/shop" className="btn-primary" style={{ fontSize: 11 }}>Shop Now</Link>
        </div>
      ) : (
        <div style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--ivory-dark)" }}>
                {["Order #", "Items", "Date", "Status", "Total", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--warm-gray)", textAlign: "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const sc = statusColors[order.status] || { bg: "#f5f5f5", color: "#555" };
                const itemCount = order.line_items?.length || 0;
                return (
                  <tr key={order.id} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "var(--ivory)" }}>
                    <td style={{ padding: "16px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--charcoal)", fontWeight: 500 }}>
                      #{order.number}
                    </td>
                    <td style={{ padding: "16px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>
                      {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </td>
                    <td style={{ padding: "16px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>
                      {new Date(order.date_created).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ background: sc.bg, color: sc.color, fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 50 }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--charcoal)", fontWeight: 500 }}>
                      {formatPrice(order.total)}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <Link href={`/account/orders/${order.id}`} style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--gold)", textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
