"use client";
import Link from "next/link";
import useCartStore from "../../store/cartStore";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(p);

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px" }}>
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 24, opacity: 0.3 }}>
          <path d="M4 4h6.5l5 24h24l5-16H14" stroke="var(--maroon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="40" r="2.5" fill="var(--maroon)" />
          <circle cx="34" cy="40" r="2.5" fill="var(--maroon)" />
        </svg>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 400, marginBottom: 12 }}>
          Your bag is empty
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: "var(--warm-gray)", marginBottom: 32 }}>
          Looks like you haven't added anything yet.
        </p>
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 400, marginBottom: 8 }}>
        Your Bag
      </h1>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)", letterSpacing: 1, marginBottom: 40 }}>
        {items.length} item{items.length !== 1 ? "s" : ""}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }} className="cart-layout">

        {/* Items */}
        <div>
          {/* Header row */}
          <div style={{
            display: "grid", gridTemplateColumns: "80px 1fr 120px 80px 24px",
            gap: 16, paddingBottom: 16,
            borderBottom: "1px solid var(--border)",
            fontFamily: "'Jost', sans-serif", fontSize: 10,
            fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
            color: "var(--warm-gray)",
          }}
            className="cart-header"
          >
            <span></span>
            <span>Product</span>
            <span style={{ textAlign: "center" }}>Quantity</span>
            <span style={{ textAlign: "right" }}>Total</span>
            <span></span>
          </div>

          {/* Items */}
          {items.map((item) => (
            <div
              key={item.key}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 120px 80px 24px",
                gap: 16,
                padding: "24px 0",
                borderBottom: "1px solid var(--border)",
                alignItems: "center",
              }}
              className="cart-row"
            >
              {/* Image */}
              <div style={{ width: 80, height: 100, background: "#f5ede8", overflow: "hidden", flexShrink: 0 }}>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>

              {/* Name + attrs */}
              <div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 400, letterSpacing: 0.5, color: "var(--maroon)", marginBottom: 6, lineHeight: 1.5 }}>
                  {item.name}
                </p>
                {item.attributes?.map((a) => (
                  <p key={a.name} style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)" }}>
                    {a.name}: {a.option}
                  </p>
                ))}
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--charcoal-light)", marginTop: 4 }}>
                  {formatPrice(item.price)} each
                </p>
              </div>

              {/* Qty */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                  style={{ background: "none", border: "none", padding: "6px 12px", cursor: "pointer", fontSize: 16, color: "var(--maroon)" }}>−</button>
                <span style={{ padding: "6px 8px", fontFamily: "'Jost', sans-serif", fontSize: 13, minWidth: 28, textAlign: "center" }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                  style={{ background: "none", border: "none", padding: "6px 12px", cursor: "pointer", fontSize: 16, color: "var(--maroon)" }}>+</button>
              </div>

              {/* Total */}
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 500, textAlign: "right", color: "var(--maroon)" }}>
                {formatPrice(item.price * item.quantity)}
              </p>

              {/* Remove */}
              <button onClick={() => removeItem(item.key)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--warm-gray)", padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
          ))}

          <div style={{ marginTop: 24 }}>
            <Link href="/shop" style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)", letterSpacing: 1, textDecoration: "underline" }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: "var(--ivory-dark)", padding: 32, border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, marginBottom: 24 }}>
            Order Summary
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--charcoal-light)" }}>Subtotal</span>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--maroon)" }}>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--charcoal-light)" }}>Shipping</span>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: shipping === 0 ? "var(--gold-dark)" : "var(--maroon)" }}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            {subtotal < 999 && (
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", lineHeight: 1.6 }}>
                Add {formatPrice(999 - subtotal)} more for free shipping
              </p>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500 }}>{formatPrice(total)}</span>
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", marginTop: 4 }}>
              Inclusive of all taxes
            </p>
          </div>

          {/* Coupon */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 0 }}>
              <input type="text" placeholder="Coupon code" className="form-input" style={{ flex: 1, borderRight: "none", fontSize: 12 }} />
              <button className="btn-outline" style={{ flexShrink: 0, padding: "12px 16px", fontSize: 11 }}>Apply</button>
            </div>
          </div>

          <Link href="/checkout">
            <button className="btn-primary" style={{ width: "100%", fontSize: 12, marginBottom: 12 }}>
              Proceed to Checkout
            </button>
          </Link>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
            {["UPI", "Cards", "NetBanking", "COD"].map((m) => (
              <span key={m} style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: 1, color: "var(--warm-gray)", textTransform: "uppercase" }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
          .cart-header {
            display: none !important;
          }
          .cart-row {
            grid-template-columns: 80px 1fr !important;
            grid-template-rows: auto auto;
          }
          .cart-row > div:nth-child(3),
          .cart-row > p:nth-child(4),
          .cart-row > button:nth-child(5) {
            grid-column: 2;
          }
        }
      `}</style>
    </div>
  );
}
