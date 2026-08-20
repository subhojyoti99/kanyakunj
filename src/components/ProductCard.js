"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const price = parseFloat(product?.price || 0);
  const regularPrice = parseFloat(product?.regular_price || 0);
  const isOnSale = product?.on_sale && regularPrice > price;
  const isOutOfStock = product?.stock_status === 'outofstock';
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
      className="product-card"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        position: "relative",
        cursor: "pointer",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Image area */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{ position: "relative", paddingTop: "133%", overflow: "hidden", background: "#f5ede8" }}
          className="product-image-wrapper"
        >
          {/* Primary image */}
          <Image
            src={primaryImage}
            alt={product.name}
            className="product-image-primary"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
          {/* Secondary image (hover) */}
          <Image
            src={secondaryImage}
            alt={product.name}
            className="product-image-secondary"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: "cover", opacity: 0 }}
          />

          {/* Sale badge */}
          {isOnSale && !isOutOfStock && (
            <span className="modern-sale-badge">Sale</span>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(255, 255, 255, 0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(2px)", zIndex: 1
            }}>
              <span style={{
                fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600,
                letterSpacing: 2, textTransform: "uppercase", color: "var(--maroon)",
                background: "rgba(255, 255, 255, 0.9)", padding: "8px 16px",
                border: "1px solid var(--maroon)"
              }}>
                Out of Stock
              </span>
            </div>
          )}

          <button
            className="wishlist-btn"
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(255, 255, 255, 0.9)", border: "none", width: 34, height: 34,
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              backdropFilter: "blur(4px)",
              zIndex: 2,
              transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s",
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
          {!isVariable && !isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="quick-add-btn"
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "rgba(255, 255, 255, 0.85)", color: "var(--maroon)",
                backdropFilter: "blur(8px)",
                border: "none", padding: "14px",
                fontFamily: "'Jost', sans-serif", fontSize: 11,
                fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", opacity: 0, transform: "translateY(100%)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Quick Add
            </button>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "16px 12px 20px" }}>
        <Link href={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
          <p
            style={{
              fontFamily: "'Jost', sans-serif", fontSize: 12.5,
              fontWeight: 400, letterSpacing: 1.5, textTransform: "uppercase",
              color: "var(--charcoal)", marginBottom: 8,
              overflow: "hidden", textOverflow: "ellipsis",
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", lineHeight: 1.4,
            }}
          >
            {product.name}
          </p>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isOnSale && regularPrice > price ? (
            <>
              <span className="price-sale" style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--maroon)" }}>
                {formatPrice(price)}
              </span>
              <span className="price-original" style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, textDecoration: "line-through", color: "#a09995" }}>
                {formatPrice(regularPrice)}
              </span>
            </>
          ) : (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 500, color: "var(--charcoal)" }}>
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
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
        }
        .product-image-wrapper:hover .product-image-secondary { opacity: 1 !important; }
        .product-image-wrapper:hover .product-image-primary { opacity: 0 !important; }
        
        /* Quick Add Glassmorphic Slide-up */
        .product-image-wrapper:hover .quick-add-btn { 
          opacity: 1 !important; 
          transform: translateY(0) !important;
        }
        .quick-add-btn:hover {
          background: rgba(255, 255, 255, 1) !important;
        }

        /* Wishlist Bounce */
        .wishlist-btn:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 6px 16px rgba(0,0,0,0.12) !important;
        }

        /* Modern Sale Badge */
        .modern-sale-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg, var(--rose) 0%, #d8897c 100%);
          color: white;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(196, 121, 106, 0.3);
          z-index: 2;
        }
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
