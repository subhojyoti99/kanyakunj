"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../../../store/cartStore";
import useWishlistStore from "../../../store/wishlistStore";
import ProductGrid from "../../../components/ProductGrid";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(parseFloat(p || 0));

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [wishlistError, setWishlistError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Secure: calls our API route, no secrets in browser
        const res = await fetch(`/api/wc/product?slug=${slug}`);
        if (!res.ok) throw new Error("Product not found");
        const p = await res.json();
        setProduct(p);

        // Fetch related products
        if (p?.related_ids?.length > 0) {
          const relRes = await fetch(`/api/wc/products?include=${p.related_ids.slice(0, 12).join(",")}`);
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedProducts(relData);
          }
        }

        if (p?.type === "variable") {
          const varRes = await fetch(`/api/wc/variations?productId=${p.id}`);
          if (varRes.ok) {
            const vars = await varRes.json();
            setVariations(vars);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  // Auto-select single-option attributes
  useEffect(() => {
    if (product?.attributes) {
      const singleOptionAttrs = {};
      product.attributes.forEach((attr) => {
        if (attr.variation && attr.options?.length === 1) {
          singleOptionAttrs[attr.name] = attr.options[0];
        }
      });
      if (Object.keys(singleOptionAttrs).length > 0) {
        setSelectedAttrs((prev) => ({ ...prev, ...singleOptionAttrs }));
      }
    }
  }, [product]);

  // Find matching variation when attributes change
  useEffect(() => {
    if (!variations.length) return;
    const match = variations.find((v) =>
      v.attributes.every((a) => selectedAttrs[a.name] === a.option)
    );
    setSelectedVariation(match || null);
  }, [selectedAttrs, variations]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedVariation, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const currentPrice = selectedVariation ? selectedVariation.price : product?.price;
  const currentRegularPrice = selectedVariation ? selectedVariation.regular_price : product?.regular_price;
  const isOnSale = parseFloat(currentRegularPrice) > parseFloat(currentPrice);

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }} className="product-detail-grid">
          <div className="skeleton" style={{ paddingTop: "133%", position: "relative" }} />
          <div style={{ paddingTop: 40 }}>
            <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 32, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 20, width: "30%", marginBottom: 32 }} />
            <div className="skeleton" style={{ height: 48, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 48 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36 }}>Product not found</h2>
        <a href="/shop" className="btn-outline" style={{ marginTop: 24, display: "inline-block" }}>Back to Shop</a>
      </div>
    );
  }

  const attributes = product.attributes?.filter((a) => a.variation) || [];
  const allAttrsSelected = attributes.length === 0 || Object.keys(selectedAttrs).length >= attributes.length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "minmax(300px, 480px) 1fr", gap: 60, alignItems: "start" }}
        className="product-detail-grid"
      >
        {/* Images */}
        <div>
          <div style={{ paddingTop: "125%", position: "relative", background: "#f5ede8", marginBottom: 12 }}>
            <img
              src={product.images?.[selectedImage]?.src || "/placeholder.jpg"}
              alt={product.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            {product.on_sale && <span className="sale-badge">Sale</span>}
          </div>

          {product.images?.length > 1 && (
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    flexShrink: 0, width: 72, height: 90,
                    border: i === selectedImage ? "2px solid var(--maroon)" : "2px solid transparent",
                    background: "none", padding: 0, cursor: "pointer", overflow: "hidden",
                  }}
                >
                  <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ position: "sticky", top: 100 }}>
          {/* Breadcrumb */}
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", letterSpacing: 1, marginBottom: 16 }}>
            <a href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</a>
            {" / "}
            <a href="/shop" style={{ color: "inherit", textDecoration: "none" }}>Shop</a>
            {" / "}
            <span style={{ color: "var(--maroon)" }}>{product.name}</span>
          </p>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, marginBottom: 16, lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28 }}>
            {isOnSale ? (
              <>
                <span className="price-sale" style={{ fontSize: 24, fontFamily: "'Jost', sans-serif", fontWeight: 500 }}>
                  {formatPrice(currentPrice)}
                </span>
                <span className="price-original" style={{ fontSize: 16, fontFamily: "'Jost', sans-serif" }}>
                  {formatPrice(currentRegularPrice)}
                </span>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "var(--rose)", background: "var(--rose-light)", padding: "3px 8px" }}>
                  {Math.round((1 - parseFloat(currentPrice) / parseFloat(currentRegularPrice)) * 100)}% OFF
                </span>
              </>
            ) : (
              <span style={{ fontSize: 24, fontFamily: "'Jost', sans-serif", fontWeight: 400, color: "var(--maroon)" }}>
                {formatPrice(currentPrice)}
              </span>
            )}
          </div>

          {/* Variation attributes */}
          {attributes.map((attr) => (
            <div key={attr.name} style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--maroon)", marginBottom: 10 }}>
                {attr.name}
                {selectedAttrs[attr.name] && (
                  <span style={{ fontWeight: 300, color: "var(--warm-gray)", marginLeft: 8 }}>
                    — {selectedAttrs[attr.name]}
                  </span>
                )}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {attr.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedAttrs((prev) => ({ ...prev, [attr.name]: opt }))}
                    style={{
                      padding: "8px 16px",
                      border: "1px solid",
                      borderColor: selectedAttrs[attr.name] === opt ? "var(--maroon)" : "var(--border)",
                      background: selectedAttrs[attr.name] === opt ? "var(--maroon)" : "transparent",
                      color: selectedAttrs[attr.name] === opt ? "var(--ivory)" : "var(--maroon)",
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      letterSpacing: 0.5,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
              Quantity
            </p>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", width: "fit-content" }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: "none", border: "none", padding: "10px 18px", fontSize: 18, cursor: "pointer", color: "var(--maroon)" }}>−</button>
              <span style={{ padding: "10px 16px", fontFamily: "'Jost', sans-serif", fontSize: 14, minWidth: 40, textAlign: "center" }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}
                style={{ background: "none", border: "none", padding: "10px 18px", fontSize: 18, cursor: "pointer", color: "var(--maroon)" }}>+</button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="btn-primary"
            style={{ width: "100%", marginBottom: 12, fontSize: 12 }}
            disabled={!allAttrsSelected}
          >
            {added ? "✓ Added to Bag!" : allAttrsSelected ? "Add to Bag" : "Select Size Above"}
          </button>

          <div style={{ position: "relative" }}>
            <button
              className={`btn-outline ${wishlistError ? "wishlist-btn-error shake-anim" : ""} ${inWishlist ? "active-wishlist" : ""}`}
              style={{ width: "100%", fontSize: 12 }}
              onClick={() => {
                if (!selectedAttrs["Size"] && attributes.some(a => a.name === "Size") && !inWishlist) {
                  setWishlistError(true);
                  setTimeout(() => setWishlistError(false), 2000);
                } else {
                  toggleWishlist(product);
                }
              }}
              suppressHydrationWarning
            >
              {wishlistError 
                ? "Wait! What's your size? 📏" 
                : inWishlist 
                  ? "♥ In Wishlist (Remove?)" 
                  : "♡ Add to Wishlist"
              }
            </button>
            <AnimatePresence>
              {wishlistError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: "absolute",
                    top: "-45px",
                    left: 0,
                    right: 0,
                    background: "var(--rose)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                    fontWeight: 500,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 10
                  }}
                >
                  Please select your size first! ✨
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: 28, padding: "20px 0", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "✓ Free shipping on orders above ₹999",
              "✓ Easy 7-day returns",
              "✓ Secure payment via Razorpay",
            ].map((f) => (
              <p key={f} style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "var(--charcoal-light)", letterSpacing: 0.3 }}>
                {f}
              </p>
            ))}
          </div>

          {/* Description */}
          {product.short_description && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
                Description
              </p>
              <div
                style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "var(--charcoal-light)", lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: 80, paddingTop: 60, borderTop: "1px solid var(--border)" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="section-label">You May Also Like</span>
            <h2 className="section-title">Related Products</h2>
            <div className="gold-divider" />
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .product-detail-grid > div:last-child {
            position: static !important;
          }
        }
        
        .wishlist-btn-error {
          border-color: var(--rose) !important;
          color: var(--rose) !important;
        }

        .wishlist-btn-error:hover {
          background: var(--rose) !important;
          color: white !important;
          border-color: var(--rose) !important;
        }

        .active-wishlist {
          background: var(--ivory-dark) !important;
          border-color: var(--maroon) !important;
          color: var(--maroon) !important;
        }
        
        .active-wishlist:hover {
          background: var(--rose) !important;
          color: white !important;
          border-color: var(--rose) !important;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake-anim {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
