"use client";

import { useRef, useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products = [] }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || products.length === 0 || isPaused) return;

    let animationId;
    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [products, isPaused]);

  if (!products.length) return null;

  // Double the products to create a seamless infinite scroll loop
  const displayProducts = [...products, ...products];

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        padding: "20px 0"
      }}
    >
      <div 
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "24px",
          overflowX: "hidden",
          whiteSpace: "nowrap",
          padding: "0 24px",
          scrollBehavior: "auto"
        }}
        className="carousel-track"
      >
        {displayProducts.map((product, index) => (
          <div 
            key={`${product.id}-${index}`}
            style={{
              flex: "0 0 280px", // Fixed width for carousel items
              maxWidth: "280px"
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Gradient Fade Overlays */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "100px",
        background: "linear-gradient(to right, var(--ivory) 0%, transparent 100%)",
        zIndex: 2,
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "100px",
        background: "linear-gradient(to left, var(--ivory) 0%, transparent 100%)",
        zIndex: 2,
        pointerEvents: "none"
      }} />
    </div>
  );
}
