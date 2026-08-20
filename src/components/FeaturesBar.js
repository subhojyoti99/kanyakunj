export function FeaturesBar() {
  const features = [
    { icon: "🚚", label: "Free Shipping", sub: "On orders above ₹999" },
    { icon: "↩", label: "Easy Returns", sub: "7-day return policy" },
    { icon: "🔒", label: "Secure Payment", sub: "Razorpay protected" },
    { icon: "✦", label: "Authentic Quality", sub: "Handpicked fabrics" },
  ];

  return (
    <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
        className="features-bar"
      >
        {features.map((f, i) => (
          <div
            key={f.label}
            style={{
              padding: "24px 16px",
              textAlign: "center",
              borderRight: i < features.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 8 }}>{f.icon}</div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--maroon)", marginBottom: 2 }}>
              {f.label}
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", fontWeight: 300 }}>
              {f.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesBar;
