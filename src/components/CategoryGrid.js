import Link from "next/link";


const categories = [
  {
    label: "Kurtis",
    href: "/shop?category=kurti",
    image: "https://kanyakunj.com/wp-content/uploads/2026/01/DHP_4340-1000x1500.jpg",
    span: 2,
  },
  {
    label: "Short Kurti",
    href: "/shop?category=short-kurti",
    image: "https://kanyakunj.com/wp-content/uploads/2026/01/DHP_4307-1000x1500.jpg",
    span: 1,
  },
  {
    label: "Co-ord Sets",
    href: "/shop?category=co-ord-set",
    image: "https://kanyakunj.com/wp-content/uploads/2026/01/DHP_4285-1000x1500.jpg",
    span: 1,
  },
  {
    label: "Dupatta",
    href: "/shop?category=dupatta",
    image: "https://kanyakunj.com/wp-content/uploads/2026/01/DHP_4348-1000x1500.jpg",
    span: 1,
  },
  {
    label: "Ethnic Sets",
    href: "/shop?category=ethnic-set",
    image: "https://kanyakunj.com/wp-content/uploads/2026/01/DHP_4462-1000x1500.jpg",
    span: 1,
  },
];

export default function CategoryGrid() {
  return (
    <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span className="section-label">Shop by Category</span>
        <h2 className="section-title">Find Your Style</h2>
        <div className="gold-divider" />
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "auto auto",
          gap: 16,
        }}
        className="category-grid"
      >
        {categories.map((cat, i) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="category-card"
            style={{
              gridColumn: i === 0 ? "span 2" : "span 1",
              height: i === 0 ? 480 : 320,
              display: "block",
              textDecoration: "none",
              position: "relative",
              overflow: "hidden",
              background: "#f0e8e0",
            }}
          >
            <img
              src={cat.image}
              alt={cat.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                transition: "transform 0.5s ease",
              }}
              loading="lazy"
            />
            {/* Dark overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(44,36,32,0.55) 0%, transparent 50%)",
              }}
            />
            {/* Label */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px 20px",
                color: "white",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: i === 0 ? 32 : 24,
                  fontWeight: 400,
                  marginBottom: 4,
                }}
              >
                {cat.label}
              </p>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  opacity: 0.8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Shop Now
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 4h10M7 1l4 3-4 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
