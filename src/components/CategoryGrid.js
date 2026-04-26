"use client";

import Link from "next/link";

const categories = [
  {
    label: "Dupatta",
    href: "/shop?category=dupatta",
    image: "https://kanyakunj.com/wp-content/uploads/2025/09/dupatta.jpg",
  },
  {
    label: "Ethnic Set",
    href: "/shop?category=ethnic-set",
    image: "https://kanyakunj.com/wp-content/uploads/2025/09/1-1.jpg",
  },
  {
    label: "Short Kurti",
    href: "/shop?category=short-kurti",
    image: "https://kanyakunj.com/wp-content/uploads/2025/09/4-2.jpg",
  },
  {
    label: "Kurti",
    href: "/shop?category=kurti",
    image: "https://kanyakunj.com/wp-content/uploads/2025/09/Untitled-1000-x-1507-px-500-x-500-px.jpg",
  },
];

export default function CategoryGrid() {
  return (
    <section style={{ padding: "100px 24px", maxWidth: 1440, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <h2 className="section-title">Find Your Style</h2>
        <div className="gold-divider" />
      </div>

      <div
        className="category-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="category-card"
            style={{
              display: "block",
              textDecoration: "none",
              position: "relative",
              overflow: "hidden",
              borderRadius: "4px",
              aspectRatio: "1/1",
              background: "#f7f4f0",
            }}
          >
            <img
              src={cat.image}
              alt={cat.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)",
              }}
              loading="lazy"
            />
            
            {/* Elegant Background Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
                opacity: 0.8,
                transition: "opacity 0.3s ease",
              }}
              className="cat-overlay"
            />

            {/* Content Container */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "30px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <h4
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 500,
                  color: "#fff",
                  margin: 0,
                  textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                {cat.label}
              </h4>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.85)",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                  paddingBottom: 2,
                  transition: "all 0.3s ease",
                }}
                className="view-btn"
              >
                Explore
              </span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .category-card:hover img {
          transform: scale(1.08);
        }
        .category-card:hover .cat-overlay {
          opacity: 1;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%);
        }
        .category-card:hover .view-btn {
          color: #fff;
          border-color: #fff;
          letter-spacing: 3.5px;
        }
        @media (max-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .category-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
