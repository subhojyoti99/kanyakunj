"use client";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

export default function ProductGrid({ products = [], columns = 4, loading = false, categoryName = "" }) {
  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "24px 16px",
        }}
        className={`product-grid cols-${columns}`}
      >
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
        <GridStyles columns={columns} />
      </div>
    );
  }

  if (!products.length) {
    const displayName = categoryName && categoryName !== "All" ? categoryName : "pieces";
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "var(--maroon)", marginBottom: 12 }}>
          Coming Soon
        </h3>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, color: "var(--charcoal)", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
          We are actively adding beautiful {displayName} to our inventory. Check back very soon for our latest collection!
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "32px 16px",
      }}
      className={`product-grid cols-${columns}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <GridStyles columns={columns} />
    </div>
  );
}

function GridStyles({ columns }) {
  return (
    <style jsx global>{`
      @media (max-width: 1024px) {
        .product-grid.cols-${columns} {
          grid-template-columns: repeat(${Math.min(columns, 3)}, 1fr) !important;
        }
      }
      @media (max-width: 768px) {
        .product-grid.cols-${columns} {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 20px 12px !important;
        }
      }
      @media (max-width: 360px) {
        .product-grid.cols-${columns} {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  );
}
