"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  "https://kanyakunj.com/wp-content/uploads/2025/09/1-5.jpg",
  "https://kanyakunj.com/wp-content/uploads/2025/09/2-2.jpg",
  "https://kanyakunj.com/wp-content/uploads/2025/09/3-2.jpg",
  "https://kanyakunj.com/wp-content/uploads/2025/09/4-5.jpg",
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="banner-carousel-section">
      <div className="banner-container">
        <Link href="/shop?on_sale=true">
          <div className="banner-wrapper">
            <AnimatePresence mode="wait">
              <motion.img
                key={banners[index]}
                src={banners[index]}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              />
            </AnimatePresence>
          </div>
        </Link>

        {/* Pagination Dots */}
        <div className="banner-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`banner-dot ${index === i ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .banner-carousel-section {
          padding: 32px 24px;
          background: var(--ivory);
        }
        .banner-container {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
        }
        .banner-wrapper {
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        .banner-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
        }
        .banner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(44, 36, 32, 0.2);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .banner-dot.active {
          background: var(--gold);
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}
