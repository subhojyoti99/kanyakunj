"use client";

import { useState, useEffect } from "react";
import useWishlistStore from "../../store/wishlistStore";
import useCartStore from "../../store/cartStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "../../components/ProductGrid";

const truncateName = (name) => {
  const words = name.trim().split(/\s+/);
  if (words.length <= 7) return name;
  return words.slice(0, 7).join(" ") + "\u2026";
};

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(parseFloat(p || 0));

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Size-picker modal state
  const [pickItem, setPickItem] = useState(null);      // wishlist item being picked
  const [variations, setVariations] = useState([]);    // fetched variations
  const [varLoading, setVarLoading] = useState(false);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [addedId, setAddedId] = useState(null);        // for success flash

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/wc/products?per_page=8&orderby=popularity")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => Array.isArray(data) && setRelatedProducts(data))
      .catch(() => { });
  }, []);

  // Fetch variations when modal opens
  useEffect(() => {
    if (!pickItem) return;
    setVarLoading(true);
    setVariations([]);
    setSelectedAttrs({});
    fetch(`/api/wc/variations?productId=${pickItem.id}`)
      .then((r) => r.ok ? r.json() : [])
      .then((v) => setVariations(Array.isArray(v) ? v : []))
      .catch(() => setVariations([]))
      .finally(() => setVarLoading(false));
  }, [pickItem]);

  // Derive unique attribute options from variations
  const attrMap = {};
  variations.forEach((v) => {
    v.attributes?.forEach(({ name, option }) => {
      if (!attrMap[name]) attrMap[name] = new Set();
      attrMap[name].add(option);
    });
  });
  const attrEntries = Object.entries(attrMap); // [[name, Set], ...]

  // Find matching variation
  const matchedVariation = variations.find((v) =>
    v.attributes?.every((a) => selectedAttrs[a.name] === a.option)
  );
  const allSelected = attrEntries.length > 0 &&
    attrEntries.every(([name]) => selectedAttrs[name]);

  const handleConfirmAdd = () => {
    if (!pickItem) return;
    addItem(pickItem, matchedVariation || null);
    removeItem(pickItem.id);
    setPickItem(null);
    setAddedId(pickItem.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const openPicker = (item) => {
    setPickItem(item);
  };

  if (!mounted) return null;

  return (
    <div className="wl-page">
      <div className="wl-container">
        {/* Header */}
        <header className="wl-header">
          <span className="section-label">Your Favorites</span>
          <h1 className="section-title">My Wishlist</h1>
          <div className="gold-divider" />
        </header>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="wl-empty"
          >
            <div className="wl-empty-icon">♡</div>
            <h2>Your wishlist is empty</h2>
            <p>Go ahead and explore our latest ethnic collection.</p>
            <Link href="/shop" className="btn-primary">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="wl-content">
            <div className="wl-actions">
              <span className="wl-count">{items.length} {items.length === 1 ? "item" : "items"} saved</span>
              <button onClick={clearWishlist} className="wl-clear-btn">Clear All</button>
            </div>

            <div className="wl-grid">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    item={item}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="wl-item"
                  >
                    <div className="wl-item-inner">
                      {/* Image Area */}
                      <Link href={`/product/${item.slug}`} className="wl-img-wrap">
                        <img src={item.image} alt={item.name} />
                        <div className="wl-overlay">
                          <span className="wl-view">View Details</span>
                        </div>
                      </Link>

                      {/* Info Area */}
                      <div className="wl-info">
                        <Link href={`/product/${item.slug}`} className="wl-name">
                          {truncateName(item.name)}
                        </Link>
                        <p className="wl-price">{formatPrice(item.price)}</p>

                        <div className="wl-btns">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPicker(item);
                            }}
                            className="wl-cart-btn"
                          >
                            Add to Bag
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();   // ✅ safety
                              removeItem(item.id);
                            }}
                            className="wl-remove-btn"
                            title="Remove from wishlist"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* ── Size Picker Modal ── */}
      <AnimatePresence>
        {pickItem && (
          <motion.div
            className="wl-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPickItem(null)}
          >
            <motion.div
              className="wl-modal"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="wl-modal-head">
                <div className="wl-modal-img">
                  <img src={pickItem.image} alt={pickItem.name} />
                </div>
                <div>
                  <p className="wl-modal-name">{truncateName(pickItem.name)}</p>
                  <p className="wl-modal-price">{formatPrice(matchedVariation?.price || pickItem.price)}</p>
                </div>
                <button className="wl-modal-close" onClick={() => setPickItem(null)}>✕</button>
              </div>

              {/* Attributes */}
              {varLoading ? (
                <p className="wl-modal-loading">Loading options…</p>
              ) : attrEntries.length === 0 ? (
                <p className="wl-modal-loading">No size options found.</p>
              ) : (
                attrEntries.map(([name, optSet]) => (
                  <div key={name} className="wl-modal-attr">
                    <p className="wl-modal-attr-label">
                      {name}
                      {selectedAttrs[name] && (
                        <span className="wl-modal-attr-val"> — {selectedAttrs[name]}</span>
                      )}
                    </p>
                    <div className="wl-modal-opts">
                      {[...optSet].map((opt) => (
                        <button
                          key={opt}
                          className={`wl-modal-opt${selectedAttrs[name] === opt ? " active" : ""}`}
                          onClick={() => setSelectedAttrs((prev) => ({ ...prev, [name]: opt }))}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {/* CTA */}
              <button
                className="wl-modal-add"
                disabled={!allSelected && attrEntries.length > 0}
                onClick={handleConfirmAdd}
              >
                {allSelected || attrEntries.length === 0 ? "Add to Bag" : "Select options above"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {relatedProducts.length > 0 && (
        <section className="wl-related">
          <div className="wl-related-header">
            <span className="section-label">Discover More</span>
            <h2 className="section-title">You May Also Like</h2>
            <div className="gold-divider" />
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}

      <style jsx>{`
        .wl-page {
          min-height: 80vh;
          background: var(--ivory);
          padding: 48px 24px;
        }
        .wl-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .wl-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .wl-empty {
          text-align: center;
          padding: 60px 0;
          color: var(--warm-gray);
        }
        .wl-empty-icon {
          font-size: 64px;
          margin-bottom: 24px;
          opacity: 0.3;
        }
        .wl-empty h2 {
          font-size: 28px;
          margin-bottom: 12px;
          color: var(--maroon);
        }
        .wl-empty p {
          margin-bottom: 32px;
        }

        .wl-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .wl-count {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--warm-gray);
        }
        .wl-clear-btn {
          background: none;
          border: none;
          color: var(--rose);
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          text-decoration: underline;
        }

        .wl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px 24px;
        }

        .wl-item-inner {
          border: 1px solid var(--border);
          padding: 12px;
          background: white;
          position: relative;
          transition: transform 0.3s ease;
        }
        .wl-item-inner:hover {
          transform: translateY(-5px);
        }

        .wl-img-wrap {
          display: block;
          aspect-ratio: 3/4;
          overflow: hidden;
          position: relative;
        }
        .wl-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .wl-item-inner:hover .wl-img-wrap img {
          transform: scale(1.05);
        }

        .wl-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
          pointer-events: none;
        }
        .wl-item-inner:hover .wl-overlay {
          opacity: 1;
        }
        .wl-view {
          background: white;
          padding: 8px 16px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--maroon);
        }

        .wl-info {
          padding: 16px 0;
          position: relative;
          z-index: 2;
        }
        .wl-name {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: var(--maroon);
          text-decoration: none;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
          min-height: calc(18px * 1.3 * 2);
        }
        .wl-price {
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          color: var(--charcoal-light);
          margin-bottom: 16px;
        }

        .wl-btns {
          display: flex;
          gap: 8px;
          position: relative;
          z-index: 3;
        }
        .wl-cart-btn {
          flex: 1;
          height: 38px;
          background: var(--maroon);
          color: white;
          border: none;
          padding: 10px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .wl-cart-btn:hover {
          background: var(--gold);
        }
        .wl-remove-btn {
          width: 38px;
          height: 38px;                 /* ✅ equal height */
          border-radius: 50%;           /* ✅ circle */
          background: #f8f8f8;
          border: 1px solid var(--border);
          color: #999;

          display: flex;                /* ✅ center X */
          align-items: center;
          justify-content: center;

          font-size: 16px;
          line-height: 1;

          cursor: pointer;
          transition: all 0.2s;
        }
        .wl-remove-btn:hover {
          background: var(--rose-light);
          border-color: var(--rose);
          color: var(--rose);
        }

        @media (max-width: 1024px) {
          .wl-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .wl-grid { grid-template-columns: repeat(2, 1fr); gap: 24px 12px; }
          .wl-item-inner { transform: none !important; }
        }

        .wl-related {
          max-width: 1200px;
          margin: 80px auto 0;
          padding: 60px 0 0;
          border-top: 1px solid var(--border);
        }
        .wl-related-header {
          text-align: center;
          margin-bottom: 48px;
        }
        @media (max-width: 768px) {
          .wl-related { padding: 40px 0 0; margin-top: 60px; }
        }

        /* ── Size Picker Modal ── */
        .wl-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .wl-modal {
          background: white;
          width: 100%;
          max-width: 320px;
          padding: 18px;
          position: relative;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }
        .wl-modal-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .wl-modal-img {
          width: 42px;
          height: 52px;
          flex-shrink: 0;
          overflow: hidden;
          background: #f5ede8;
        }
        .wl-modal-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wl-modal-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          color: var(--maroon);
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .wl-modal-price {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: var(--charcoal-light);
        }
        .wl-modal-close {
          position: absolute;
          top: 10px;
          right: 12px;
          background: none;
          border: none;
          font-size: 13px;
          color: var(--warm-gray);
          cursor: pointer;
          line-height: 1;
        }
        .wl-modal-close:hover { color: var(--maroon); }
        .wl-modal-loading {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: var(--warm-gray);
          text-align: center;
          padding: 12px 0;
        }
        .wl-modal-attr {
          margin-bottom: 12px;
        }
        .wl-modal-attr-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--maroon);
          margin-bottom: 7px;
        }
        .wl-modal-attr-val {
          font-weight: 300;
          color: var(--warm-gray);
          text-transform: none;
          letter-spacing: 0;
        }
        .wl-modal-opts {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .wl-modal-opt {
          padding: 4px 11px;
          border: 1px solid var(--border);
          background: transparent;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          color: var(--maroon);
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .wl-modal-opt:hover { border-color: var(--maroon); }
        .wl-modal-opt.active {
          background: var(--maroon);
          color: white;
          border-color: var(--maroon);
        }
        .wl-modal-add {
          width: 100%;
          height: 36px;
          margin-top: 14px;
          background: var(--maroon);
          color: white;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s;
        }
        .wl-modal-add:hover:not(:disabled) { background: var(--gold); }
        .wl-modal-add:disabled {
          background: var(--border);
          color: var(--warm-gray);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}