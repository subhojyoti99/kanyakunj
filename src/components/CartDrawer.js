"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import useCartStore from "../store/cartStore";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500 }}>
              Your Bag
            </h3>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", letterSpacing: 1 }}>
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={closeCart}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--maroon)" }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: '20px' }}></i>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <i className="fa-solid fa-cart-shopping" style={{ fontSize: '48px', color: 'var(--border)', margin: '0 auto 16px', display: 'block' }}></i>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "var(--warm-gray)", marginBottom: 8 }}>
                Your bag is empty
              </p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)", marginBottom: 24 }}>
                Discover our latest collection
              </p>
              <button onClick={closeCart} className="btn-outline" style={{ fontSize: 11 }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {items.map((item) => (
                <div key={item.key} style={{ display: "flex", gap: 14, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
                  {/* Image */}
                  <div style={{ width: 80, height: 100, flexShrink: 0, background: "#f5ede8", overflow: "hidden" }}>
                    {item.image && (
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 400,
                      letterSpacing: 0.5, color: "var(--maroon)",
                      marginBottom: 4, lineHeight: 1.4,
                      overflow: "hidden", textOverflow: "ellipsis",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    }}>
                      {item.name}
                    </p>

                    {item.attributes?.map((attr) => (
                      <p key={attr.name} style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", marginBottom: 2 }}>
                        {attr.name}: {attr.option}
                      </p>
                    ))}

                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, color: "var(--maroon)", marginTop: 6 }}>
                      {formatPrice(item.price)}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                      {/* Quantity */}
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          style={{ background: "none", border: "none", padding: "4px 10px", cursor: "pointer", fontSize: 16, color: "var(--maroon)" }}
                        >−</button>
                        <span style={{ padding: "4px 8px", fontFamily: "'Jost', sans-serif", fontSize: 13 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          disabled={item.manageStock && item.stockQuantity !== null && item.quantity >= item.stockQuantity}
                          style={{ 
                            background: "none", border: "none", padding: "4px 10px", 
                            cursor: item.manageStock && item.stockQuantity !== null && item.quantity >= item.stockQuantity ? "not-allowed" : "pointer", 
                            fontSize: 16, 
                            color: item.manageStock && item.stockQuantity !== null && item.quantity >= item.stockQuantity ? "var(--border)" : "var(--maroon)" 
                          }}
                        >+</button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.key)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", letterSpacing: 1, textDecoration: "underline" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
            {/* Free shipping bar */}
            {total < 999 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)" }}>
                    Add {formatPrice(999 - total)} more for free shipping
                  </span>
                </div>
                <div style={{ background: "var(--border)", height: 2, borderRadius: 1 }}>
                  <div style={{ background: "var(--gold)", height: "100%", width: `${Math.min((total / 999) * 100, 100)}%`, borderRadius: 1, transition: "width 0.3s ease" }} />
                </div>
              </div>
            )}
            {total >= 999 && (
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--gold)", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>
                ✓ You qualify for free shipping!
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>
                Subtotal
              </span>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 20, fontWeight: 500 }}>
                {formatPrice(total)}
              </span>
            </div>

            <Link href="/checkout" onClick={closeCart}>
              <button className="btn-primary" style={{ width: "100%", fontSize: 11 }}>
                Proceed to Checkout
              </button>
            </Link>
            <Link href="/cart" onClick={closeCart}>
              <button className="btn-outline" style={{ width: "100%", marginTop: 10, fontSize: 11 }}>
                View Full Cart
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
