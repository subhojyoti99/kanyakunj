"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = (product && mounted) ? isInWishlist(product.id) : false;

  const primaryImage = product?.images?.[0]?.src || "/placeholder.jpg";
  const secondaryImage = product?.images?.[1]?.src || primaryImage;
  const isOnSale = product?.on_sale;
  const price = parseFloat(product?.price || 0);
  const regularPrice = parseFloat(product?.regular_price || 0);
  const isVariable = product?.type === "variable";

  const formatPrice = (p) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!isVariable) {
      addItem(product);
    }
    // For variable products, let them go to product page
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Image area */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{ position: "relative", paddingTop: "133%", overflow: "hidden", background: "#f5ede8" }}
          className="product-image-wrapper"
        >
          {/* Primary image */}
          <img
            src={primaryImage}
            alt={product.name}
            className="product-image-primary"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
          {/* Secondary image (hover) */}
          <img
            src={secondaryImage}
            alt={product.name}
            className="product-image-secondary"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}
            loading="lazy"
          />

          {/* Sale badge */}
          {isOnSale && (
            <span className="sale-badge">Sale</span>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            style={{
              position: "absolute", top: 10, right: 10,
              background: "white", border: "none", width: 32, height: 32,
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 2,
            }}
            aria-label="Add to wishlist"
            suppressHydrationWarning
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill={inWishlist ? "var(--rose)" : "none"}>
              <path
                d="M9 15s-6-4.35-6-8.5A4.5 4.5 0 019 3.5 4.5 4.5 0 0115 6.5C15 10.65 9 15 9 15z"
                stroke={inWishlist ? "var(--rose)" : "var(--maroon)"}
                strokeWidth="1.3"
              />
            </svg>
          </button>

          {/* Quick add (desktop hover) */}
          {!isVariable && (
            <button
              onClick={handleQuickAdd}
              className="quick-add-btn"
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "rgba(44,36,32,0.9)", color: "var(--ivory)",
                border: "none", padding: "12px",
                fontFamily: "'Jost', sans-serif", fontSize: 11,
                fontWeight: 500, letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", opacity: 0, transition: "opacity 0.3s ease",
              }}
            >
              Quick Add
            </button>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "14px 4px 4px" }}>
        <Link href={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
          <p
            style={{
              fontFamily: "'Jost', sans-serif", fontSize: 12,
              fontWeight: 400, letterSpacing: 1, textTransform: "uppercase",
              color: "var(--charcoal-light)", marginBottom: 6,
              overflow: "hidden", textOverflow: "ellipsis",
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", lineHeight: 1.4,
            }}
          >
            {product.name}
          </p>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isOnSale && regularPrice > price ? (
            <>
              <span className="price-sale" style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 500 }}>
                {formatPrice(price)}
              </span>
              <span className="price-original" style={{ fontFamily: "'Jost', sans-serif", fontSize: 12 }}>
                {formatPrice(regularPrice)}
              </span>
            </>
          ) : (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 400, color: "var(--maroon)" }}>
              {formatPrice(price)}
            </span>
          )}
        </div>

        {isVariable && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", marginTop: 4, letterSpacing: 0.5 }}>
            Multiple options
          </p>
        )}
      </div>

      <style jsx>{`
        .product-image-wrapper:hover .product-image-secondary { opacity: 1 !important; }
        .product-image-wrapper:hover .product-image-primary { opacity: 0 !important; }
        .product-image-wrapper:hover .quick-add-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="skeleton" style={{ paddingTop: "133%", position: "relative" }} />
      <div style={{ padding: "14px 4px 4px" }}>
        <div className="skeleton" style={{ height: 14, borderRadius: 2, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: "60%", borderRadius: 2 }} />
      </div>
    </div>
  );
}
