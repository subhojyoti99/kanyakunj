"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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
  const galleryRef = useRef(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);
  const [maxThumbnails, setMaxThumbnails] = useState(10); // default high number

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

  // Dynamically calculate how many thumbnails can fit on the screen
  useEffect(() => {
    if (!galleryRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Thumbnail height is 133px, gap is 12px. Total block is 145px.
        const height = entry.contentRect.height;
        // n * 145 - 12 <= height => n <= (height + 12) / 145
        const count = Math.max(1, Math.floor((height + 12) / 145));
        setMaxThumbnails(count);
      }
    });
    observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll main gallery to the selected image when thumbnail is clicked
  useEffect(() => {
    if (galleryRef.current) {
      const container = galleryRef.current.querySelector('.gallery-scroll-container');
      if (container) {
        const width = container.clientWidth;
        const targetScroll = selectedImage * width;
        if (Math.abs(container.scrollLeft - targetScroll) > 5) {
          isProgrammaticScroll.current = true;
          container.scrollTo({ left: targetScroll, behavior: 'smooth' });
          
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
            isProgrammaticScroll.current = false;
          }, 800); // Wait for smooth scroll to finish
        }
      }
    }
  }, [selectedImage]);

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

  const currentStockStatus = selectedVariation ? selectedVariation.stock_status : product?.stock_status;
  const currentStockQuantity = selectedVariation ? selectedVariation.stock_quantity : product?.stock_quantity;
  const currentManageStock = selectedVariation ? selectedVariation.manage_stock : product?.manage_stock;
  const isOutOfStock = currentStockStatus === 'outofstock';

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
        style={{ display: "grid", gridTemplateColumns: "minmax(400px, 580px) 1fr", gap: 60, alignItems: "start" }}
        className="product-detail-grid"
      >
        {/* Images */}
        <div className="product-gallery-container">
          {/* Thumbnails (left on desktop, bottom on mobile) */}
          {product.images?.length > 1 && (
            <div className="product-thumbnails">
              {product.images.slice(0, maxThumbnails).map((img, i) => {
                const isLast = i === maxThumbnails - 1;
                const remaining = product.images.length - maxThumbnails;
                const showOverlay = isLast && remaining > 0;
                
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`thumbnail-btn ${i === selectedImage && !showOverlay ? "active" : ""}`}
                    style={{ position: 'relative' }}
                  >
                    <Image 
                      src={img.src} 
                      alt="" 
                      fill
                      sizes="100px"
                      style={{ 
                        objectFit: "cover",
                        filter: showOverlay ? 'blur(1px) brightness(0.6)' : 'none'
                      }} 
                    />
                    {showOverlay && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 500,
                        backgroundColor: 'rgba(0,0,0,0.1)'
                      }}>
                        {remaining + 1}+
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Image Gallery */}
          <div className="product-main-gallery" ref={galleryRef}>
            <div 
              className="gallery-scroll-container hide-scrollbar" 
              style={{ position: 'absolute', inset: 0, display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%', height: '100%' }}
              onScroll={(e) => {
                if (isProgrammaticScroll.current) return;
                const scrollLeft = e.target.scrollLeft;
                const width = e.target.clientWidth;
                if (width === 0) return;
                const index = Math.round(scrollLeft / width);
                if (index !== selectedImage) {
                  setSelectedImage(index);
                }
              }}
            >
              {product.images?.map((img, i) => (
                <div key={i} style={{ flex: '0 0 100%', width: '100%', height: '100%', scrollSnapAlign: 'start', position: 'relative' }}>
                  <Image
                    src={img.src || "/placeholder.jpg"}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
            
            {/* Pagination Dots (Mobile) */}
            <div className="gallery-dots">
              {product.images?.map((_, i) => (
                <div key={i} className={`dot ${i === selectedImage ? 'active' : ''}`} />
              ))}
            </div>

            {product.on_sale && <span className="sale-badge">Sale</span>}

            {/* Vertical Stock Indicator */}
            {isOutOfStock ? (
              <div className="stock-vertical-badge out-of-stock">
                Out of Stock
              </div>
            ) : currentManageStock && currentStockQuantity !== null && currentStockQuantity <= 5 ? (
              <div className="stock-vertical-badge low-stock">
                Only {currentStockQuantity} left
              </div>
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div style={{ position: "sticky", top: 100 }}>


          <h1 className="product-title" style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12, lineHeight: 1.4, color: "var(--charcoal)" }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              {isOnSale ? (
                <>
                  <span className="price-sale" style={{ fontSize: 20, fontFamily: "'Jost', sans-serif", fontWeight: 700, color: "var(--charcoal)" }}>
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="price-original" style={{ fontSize: 14, fontFamily: "'Jost', sans-serif", textDecoration: "line-through", color: "var(--warm-gray)" }}>
                    MRP {formatPrice(currentRegularPrice)}
                  </span>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: "var(--rose)", background: "rgba(235, 87, 87, 0.1)", padding: "2px 6px", borderRadius: 2 }}>
                    {Math.round((1 - parseFloat(currentPrice) / parseFloat(currentRegularPrice)) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span style={{ fontSize: 20, fontFamily: "'Jost', sans-serif", fontWeight: 700, color: "var(--charcoal)" }}>
                  {formatPrice(currentPrice)}
                </span>
              )}
            </div>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", marginTop: 4 }}>
              Inclusive of all taxes
            </span>
          </div>


          {/* Variation attributes */}
          {attributes.map((attr) => (
            <div key={attr.name} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "var(--charcoal)" }}>
                  SELECT {attr.name}
                  {selectedAttrs[attr.name] && (
                    <span style={{ fontWeight: 400, color: "var(--charcoal-light)", marginLeft: 8, textTransform: "none" }}>
                      : {selectedAttrs[attr.name]}
                    </span>
                  )}
                </p>
                {attr.name.toLowerCase() === "size" && (
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--charcoal-light)", textDecoration: "underline", cursor: "pointer" }}>
                    Size Guide
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {attr.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedAttrs((prev) => ({ ...prev, [attr.name]: opt }))}
                    style={{
                      padding: "10px 16px",
                      minWidth: "48px",
                      border: "1px solid",
                      borderColor: selectedAttrs[attr.name] === opt ? "var(--maroon)" : "#e0e0e0",
                      background: "white",
                      color: selectedAttrs[attr.name] === opt ? "var(--maroon)" : "var(--charcoal)",
                      fontWeight: selectedAttrs[attr.name] === opt ? 600 : 400,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      borderRadius: 4,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div style={{ marginBottom: 24, display: "none" }}>
          </div>

          {/* Actions */}
          <div className="actions-container" style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ flex: 1, fontSize: 13, fontWeight: 600, padding: "14px 24px", letterSpacing: 1, background: "var(--maroon)" }}
              disabled={!allAttrsSelected || isOutOfStock}
            >
              {isOutOfStock ? "OUT OF STOCK" : added ? "ADDED TO BAG" : "ADD TO BAG"}
            </button>

            <button
              className={`btn-outline ${wishlistError ? "wishlist-btn-error shake-anim" : ""} ${inWishlist ? "active-wishlist" : ""}`}
              style={{ flex: 1, fontSize: 13, fontWeight: 600, padding: "14px 24px", letterSpacing: 1, position: "relative" }}
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
                ? "SELECT SIZE"
                : inWishlist
                  ? "WISHLISTED"
                  : "WISHLIST"
              }
              <AnimatePresence>
                {wishlistError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: "absolute", top: "-40px", left: 0, right: 0,
                      background: "var(--rose)", color: "white", padding: "6px 10px",
                      borderRadius: 4, fontSize: 11, textAlign: "center", fontWeight: 500,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 10
                    }}
                  >
                    Select size first!
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
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
        <section style={{ marginTop: 40, paddingTop: 40, borderTop: "1px solid var(--border)" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="section-label">You May Also Like</span>
            <h2 className="section-title">Related Products</h2>
            <div className="gold-divider" />
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}

      <style jsx global>{`
        .product-gallery-container {
          display: flex;
          flex-direction: row;
          gap: 16px;
        }
        
        .product-thumbnails {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100px;
          flex-shrink: 0;
          -ms-overflow-style: none;  
          scrollbar-width: none;
        }
        .product-thumbnails::-webkit-scrollbar { display: none; }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .product-main-gallery {
          flex: 1;
          padding-top: 133%;
          position: relative;
          background: #f5f5f5;
          overflow: hidden;
        }

        .gallery-dots {
          display: none;
        }

        .thumbnail-btn {
          flex-shrink: 0;
          width: 100%;
          height: 133px;
          border: 2px solid transparent;
          background: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .thumbnail-btn.active {
          border-color: var(--maroon);
        }

        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .product-detail-grid > div:last-child {
            position: static !important;
            padding-bottom: 80px; /* Space for sticky bar */
          }
          .product-gallery-container {
            flex-direction: column-reverse;
            gap: 0;
            margin: -48px -24px 0 -24px; /* Bleed to edges */
          }
          .product-thumbnails {
            display: none; /* Hide thumbnails on mobile */
          }
          .product-main-gallery {
            padding-top: 133%; /* 3:4 aspect ratio */
          }
          .gallery-dots {
            display: flex;
            justify-content: center;
            gap: 6px;
            position: absolute;
            bottom: 12px;
            left: 0;
            right: 0;
          }
          .gallery-dots .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transition: all 0.3s;
          }
          .gallery-dots .dot.active {
            background: white;
            transform: scale(1.2);
          }
        }
        
        .wishlist-btn-error {
          border-color: var(--rose) !important;
          color: var(--rose) !important;
        }

        .active-wishlist {
          background: var(--ivory-dark) !important;
          border-color: var(--maroon) !important;
          color: var(--maroon) !important;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake-anim {
          animation: shake 0.2s ease-in-out infinite;
        }

        .stock-vertical-badge {
          position: absolute;
          bottom: 30px;
          right: 20px;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 16px 8px;
          z-index: 2;
        }
        .stock-vertical-badge.out-of-stock {
          color: var(--rose);
        }
        .stock-vertical-badge.low-stock {
          color: var(--maroon);
        }
      `}</style>
    </div>
  );
}
