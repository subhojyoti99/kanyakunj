"use client";
import { useSearchParams, Suspense } from "next/navigation";
import Link from "next/link";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "var(--ivory-dark)", border: "2px solid var(--gold)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16L13 23L26 9" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <span className="section-label">Thank You!</span>
        <h1 className="section-title" style={{ marginBottom: 16 }}>Order Confirmed</h1>
        <div className="gold-divider" />

        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 300, color: "var(--charcoal-light)", lineHeight: 1.8, marginBottom: 8, marginTop: 20 }}>
          Your order has been placed successfully.
        </p>
        {orderId && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)", marginBottom: 32 }}>
            Order ID: <strong style={{ color: "var(--maroon)" }}>#{orderId}</strong>
          </p>
        )}

        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "var(--charcoal-light)", lineHeight: 1.8, marginBottom: 36 }}>
          You'll receive a confirmation email shortly. Your order will be shipped via Shiprocket and you'll get a tracking link once dispatched.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/account" className="btn-outline" style={{ textDecoration: "none", fontSize: 11 }}>
            Track Order
          </Link>
          <Link href="/shop" className="btn-primary" style={{ textDecoration: "none", fontSize: 11 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh" }} />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
