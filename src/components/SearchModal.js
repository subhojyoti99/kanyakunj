"use client";
import { motion } from "framer-motion";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

export default function SearchModal({ results, loading, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {loading && (
        <motion.div 
          className="search-loading-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      
      <motion.div
        className="search-results-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <motion.div 
          className="search-results-inner"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {results.length > 0 ? (
            <>
              <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                  Search Results ({results.length})
                </p>
              </div>
              <div className="search-results-grid">
                {results.map((product) => (
                  <a 
                    key={product.id} 
                    href={`/product/${product.slug}`} 
                    className="search-result-item"
                    onClick={onClose}
                  >
                    <img 
                      src={product.images?.[0]?.src || "https://placehold.co/400x600/f5f2ee/8a7a72?text=Product"} 
                      alt={product.name} 
                      className="search-result-img" 
                    />
                    <div className="search-result-info">
                      <h4 className="search-result-name">{product.name}</h4>
                      <p className="search-result-price">{formatPrice(product.price)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </>
          ) : !loading && (
            <div className="search-empty">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500 }}>
                No results found
              </h3>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)", marginTop: 8 }}>
                Try searching for something else
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
