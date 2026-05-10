"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "../../store/cartStore";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", address: "", city: "",
    state: "", pincode: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create WooCommerce order via our secure API route
      const wcRes = await fetch("/api/wc/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: "razorpay",
          payment_method_title: "Razorpay",
          status: "pending",
          billing: {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            address_1: form.address,
            city: form.city,
            state: form.state,
            postcode: form.pincode,
            country: "IN",
          },
          shipping: {
            first_name: form.firstName,
            last_name: form.lastName,
            address_1: form.address,
            city: form.city,
            state: form.state,
            postcode: form.pincode,
            country: "IN",
          },
          line_items: items.map((item) => ({
            product_id: item.productId,
            ...(item.variationId && { variation_id: item.variationId }),
            quantity: item.quantity,
          })),
          customer_note: form.notes,
        }),
      });

      if (!wcRes.ok) throw new Error("Failed to create order");
      const wcOrder = await wcRes.json();
      if (!wcOrder.id) throw new Error("Invalid order response");

      // 2. Create Razorpay order via our secure API route
      const rzpRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          receipt: `order_${wcOrder.id}`,
          notes: { wc_order_id: String(wcOrder.id) },
        }),
      });

      if (!rzpRes.ok) throw new Error("Failed to create payment order");
      const rzpOrder = await rzpRes.json();

      // 3. Load & open Razorpay checkout
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Payment gateway failed to load. Check your connection.");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: rzpOrder.amount,
        currency: "INR",
        name: "Kanyakunj",
        description: `Order #${wcOrder.id}`,
        order_id: rzpOrder.id,
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#2c2420" },
        handler: async (response) => {
          // 4. Update WooCommerce order to processing via secure API route
          await fetch(`/api/wc/orders?orderId=${wcOrder.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "processing",
              transaction_id: response.razorpay_payment_id,
              meta_data: [
                { key: "_razorpay_payment_id", value: response.razorpay_payment_id },
                { key: "_razorpay_order_id", value: response.razorpay_order_id },
                { key: "_razorpay_signature", value: response.razorpay_signature },
              ],
            }),
          });

          clearCart();
          router.push(`/order-success?order=${wcOrder.id}`);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment was cancelled. Please try again.");
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32 }}>Your bag is empty</h2>
        <a href="/shop" className="btn-primary">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 400, marginBottom: 40 }}>
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }} className="checkout-layout">

          {/* Left — delivery form */}
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, marginBottom: 24 }}>
              Delivery Details
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="two-col-form">
              <div>
                <label style={labelStyle}>First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required className="form-input" placeholder="Priya" />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required className="form-input" placeholder="Sharma" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="form-input" placeholder="priya@example.com" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Phone Number *</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="form-input" placeholder="+91 9876543210" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Address *</label>
              <input name="address" value={form.address} onChange={handleChange} required className="form-input" placeholder="House no., Street, Area" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }} className="three-col-form">
              <div>
                <label style={labelStyle}>City *</label>
                <input name="city" value={form.city} onChange={handleChange} required className="form-input" placeholder="Mumbai" />
              </div>
              <div>
                <label style={labelStyle}>State *</label>
                <select name="state" value={form.state} onChange={handleChange} required className="form-input">
                  <option value="">Select</option>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Pincode *</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} required className="form-input" placeholder="400001" maxLength={6} pattern="\d{6}" />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Order Notes (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} className="form-input" placeholder="Any special instructions..." rows={3} style={{ resize: "vertical" }} />
            </div>

            {error && (
              <div style={{ background: "var(--rose-light)", border: "1px solid var(--rose)", padding: "12px 16px", marginBottom: 20 }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--rose)" }}>{error}</p>
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div style={{ background: "var(--ivory-dark)", padding: 28, border: "1px solid var(--border)", position: "sticky", top: 100 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, marginBottom: 20 }}>
              Order Summary
            </h2>

            <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 20 }}>
              {items.map((item) => (
                <div key={item.key} style={{ display: "flex", gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: 56, height: 70, background: "#f0e8e0", flexShrink: 0, overflow: "hidden" }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--maroon)", lineHeight: 1.4, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {item.name}
                    </p>
                    {item.attributes?.map((a) => (
                      <p key={a.name} style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, color: "var(--warm-gray)" }}>{a.name}: {a.option}</p>
                    ))}
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 500, marginTop: 4 }}>
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 12, borderTop: "1px solid var(--border)", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={summaryLabel}>Subtotal</span>
                <span style={summaryValue}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={summaryLabel}>Shipping</span>
                <span style={{ ...summaryValue, color: shipping === 0 ? "var(--gold-dark)" : "var(--maroon)" }}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500 }}>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold"
              style={{ width: "100%", fontSize: 12 }}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ${formatPrice(total)} via Razorpay`}
            </button>

            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, color: "var(--warm-gray)", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
              🔒 Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </form>

      <style jsx global>{`
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
          .checkout-layout > div:last-child {
            position: static !important;
          }
        }
        @media (max-width: 640px) {
          .two-col-form, .three-col-form {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--charcoal-light)",
  marginBottom: 6,
};

const summaryLabel = { fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)" };
const summaryValue = { fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--maroon)", fontWeight: 400 };

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];
