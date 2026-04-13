"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    label: "Get 30% Discount",
    title: "Kanyakunj's",
    heading: "Dilwali Sale",
    sub: "Offer",
    cta: "Shop Now",
    href: "/shop",
    bg: "#e8ddd4",
    image: "https://kanyakunj.com/wp-content/uploads/2026/01/DHP_4328-1000x1500.jpg",
    align: "left",
  },
  {
    label: "Tradition & Modernity",
    title: "Kanyakunj's",
    heading: "Feminine",
    sub: "Collection",
    cta: "Explore Now",
    href: "/shop",
    bg: "#dde4e0",
    image: "https://kanyakunj.com/wp-content/uploads/2026/01/DHP_4462-1000x1500.jpg",
    align: "left",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setTransitioning(false);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section
      style={{
        position: "relative",
        background: slide.bg,
        minHeight: "clamp(500px, 85vh, 800px)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        transition: "background 0.8s ease",
      }}
    >
      {/* Background image (right side) */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "55%",
          overflow: "hidden",
        }}
        className="hero-image-side"
      >
        <img
          src={slide.image}
          alt={slide.heading}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            opacity: transitioning ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        />
        {/* gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, " + slide.bg + " 0%, transparent 30%)",
        }} />
      </div>

      {/* Text content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "60px 48px",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "var(--gold-dark)",
              display: "block",
              marginBottom: 12,
            }}
          >
            {slide.label}
          </span>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(18px, 2.5vw, 26px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--charcoal-light)",
              marginBottom: 4,
            }}
          >
            {slide.title}
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(52px, 8vw, 96px)",
              fontWeight: 500,
              color: "var(--charcoal)",
              lineHeight: 0.9,
              marginBottom: 8,
            }}
          >
            {slide.heading}
          </h1>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 5vw, 60px)",
              fontWeight: 300,
              color: "rgba(44,36,32,0.35)",
              marginBottom: 36,
            }}
          >
            {slide.sub}
          </p>

          <Link href={slide.href} className="btn-primary">
            {slide.cta}
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 3,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            suppressHydrationWarning
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? "var(--gold)" : "rgba(44,36,32,0.25)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Vertical sale label */}
      <div
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          transformOrigin: "center",
          fontFamily: "'Jost', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "var(--charcoal)",
          opacity: 0.3,
          zIndex: 3,
        }}
        className="hero-side-label"
      >
        Save Upto 20% Off
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hero-image-side {
            width: 100% !important;
            opacity: 0.25;
          }
          .hero-side-label {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
