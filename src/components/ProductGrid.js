"use client";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

export default function ProductGrid({ products = [], columns = 4, loading = false }) {
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
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--warm-gray)" }}>
          No products found
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
