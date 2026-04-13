"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

const statusColors = {
  completed: { bg: "#f0faf0", color: "#2d7a2d" },
  processing: { bg: "#fff8e6", color: "#b8860b" },
  pending: { bg: "#f0f4ff", color: "#3a5a9b" },
  cancelled: { bg: "#fff0f0", color: "#c0392b" },
  "on-hold": { bg: "#f5f5f0", color: "#777" },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/wc/products?id=${id}`) // We'll use a generic fetch
      .catch(() => {});

    // Fetch order by id
    fetch(`/api/wc/orders?orderId=${id}`)
      .then(r => r.json())
      .then(data => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>Loading order…</p>;
  if (!order) return <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>Order not found.</p>;

  const sc = statusColors[order.status] || { bg: "#f5f5f5", color: "#555" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: "var(--charcoal)", margin: 0 }}>
          Order #{order.number}
        </h2>
        <span style={{ background: sc.bg, color: sc.color, fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "5px 12px", borderRadius: 50 }}>
          {order.status}
        </span>
      </div>

      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)", marginBottom: 32 }}>
        Placed on {new Date(order.date_created).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
      </p>

      {/* Items */}
      <div style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden", marginBottom: 28 }}>
        <div style={{ padding: "14px 20px", background: "var(--ivory-dark)", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--warm-gray)", margin: 0 }}>
            Order Items
          </p>
        </div>
        {order.line_items?.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
            {item.image?.src && (
              <img src={item.image.src} alt={item.name} style={{ width: 60, height: 75, objectFit: "cover", borderRadius: 2, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 400, color: "var(--charcoal)", marginBottom: 4 }}>{item.name}</p>
              {item.meta_data?.filter(m => m.display_key && !m.display_key.startsWith("_")).map(m => (
                <p key={m.id} style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)", marginBottom: 2 }}>
                  {m.display_key}: {m.display_value}
                </p>
              ))}
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)", marginTop: 4 }}>
                Qty: {item.quantity}
              </p>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--charcoal)", flexShrink: 0 }}>
              {formatPrice(parseFloat(item.subtotal))}
            </p>
          </div>
        ))}
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "flex-end", gap: 32 }}>
          {[
            { label: "Subtotal", value: order.subtotal },
            { label: "Shipping", value: order.shipping_total },
            { label: "Total", value: order.total, bold: true },
          ].map(r => (
            <div key={r.label} style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--warm-gray)", marginBottom: 4 }}>{r.label}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: r.bold ? 22 : 18, fontWeight: r.bold ? 500 : 400, color: "var(--charcoal)", margin: 0 }}>
                {formatPrice(r.value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Addresses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          { title: "Shipping Address", addr: order.shipping },
          { title: "Billing Address", addr: order.billing },
        ].map(({ title, addr }) => (
          <div key={title} style={{ border: "1px solid var(--border)", borderRadius: 4, padding: "20px 24px" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>{title}</p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--charcoal)", lineHeight: 1.8, margin: 0 }}>
              {addr?.first_name} {addr?.last_name}<br />
              {addr?.address_1}{addr?.address_2 ? `, ${addr.address_2}` : ""}<br />
              {addr?.city}, {addr?.state} {addr?.postcode}<br />
              {addr?.country}<br />
              {addr?.phone && <span>{addr.phone}</span>}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <Link href="/account/orders" style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--gold)", textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>
          ← Back to Orders
        </Link>
      </div>
    </div>
  );
}
