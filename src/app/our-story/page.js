"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ── Testimonial data ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Lenda Leena",
    role: "Designer",
    review: "''Venenatis tellus in metus vulputate eu scelerisque felis imperdiet varius duis at.''",
    stars: 5,
    img: "https://kanyakunj.com/wp-content/uploads/2022/11/test01.jpg",
  },
  {
    name: "Cathrine",
    role: "Actor",
    review: "''Ornare quam viverra orci sagittis eu volutpat odio facilisis nec dui nunc mattis.''",
    stars: 4,
    img: "https://kanyakunj.com/wp-content/uploads/2022/11/test03.jpg",
  },
  {
    name: "Hermaine",
    role: "Director",
    review: "''Suspendisse faucibus interdum posuere lorem ipsum dolor. Urna cursus eget nunc scelerisque.''",
    stars: 5,
    img: "https://kanyakunj.com/wp-content/uploads/2022/11/test02.jpg",
  },
  {
    name: "Hellen",
    role: "Artist",
    review: "''Suspendisse faucibus interdum posuere lorem ipsum dolor. Urna cursus eget nunc scelerisque.''",
    stars: 5,
    img: "https://kanyakunj.com/wp-content/uploads/2022/12/Aaraa-2.jpg",
  },
];

// ── Craft flip-box data with unique back colors matching brand ────────────────
const CRAFT_CARDS = [
  {
    title: "Natural Fibers & Fabrics",
    desc: "We choose cotton, silks, and eco blend — durable, soft, sustainable, and timeless.",
    img: "https://kanyakunj.com/wp-content/uploads/2025/09/Natural-Fibers-Fabrics.jpg",
    bg: "var(--charcoal)",
  },
  {
    title: "Dyeing & Coloring",
    desc: "Traditional dyeing meets modern techniques, creating vibrant, lasting colors full of meaning.",
    img: "https://kanyakunj.com/wp-content/uploads/2025/09/Dyeing-Coloring.jpg",
    bg: "linear-gradient(135deg, var(--maroon), var(--rose), var(--gold))",
  },
  {
    title: "Weaving & Craftsmanship",
    desc: "Skilled artisans weave heritage and precision together, shaping fabrics of strength and elegance.",
    img: "https://kanyakunj.com/wp-content/uploads/2025/09/5.jpg",
    bg: "#1a2a44", // Slate Blue
  },
  {
    title: "Equipment & Modern Technology",
    desc: "Advanced machines complement artisans' skills — embroidery, and perfect finishing.",
    img: "https://kanyakunj.com/wp-content/uploads/2025/09/4.jpg",
    bg: "var(--rose)",
  },
  {
    title: "Packing & Delivery",
    desc: "Garments are carefully pressed, packed, and sealed — ready for you in perfect condition.",
    img: "https://kanyakunj.com/wp-content/uploads/2025/09/6.jpg",
    bg: "#556b2f", // Olive Green
  },
];

// ── Star rating ───────────────────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <ul style={{ display: "flex", gap: 3, listStyle: "none", margin: 0, padding: 0 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <li key={i}>
          <svg width="13" height="13" viewBox="0 0 24 24"
            fill={i <= count ? "var(--gold)" : "none"}
            stroke="var(--gold)" strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

// ── Testimonial carousel card ─────────────────────────────────────────────────
function TestimonialCard({ item, isActive }) {
  return (
    <div className={`tc-card ${isActive ? "tc-card-active" : ""}`}>
      {/* Top Image */}
      <div className="tc-image-container">
        <div className="tc-image-box">
          <img src={item.img} alt={item.name} className="tc-avatar" />
        </div>
      </div>

      {/* Meta Info */}
      <div className="tc-info">
        <h5 className="tc-name">{item.name}</h5>
        <div className="tc-role">{item.role}</div>
        <div className="tc-stars-centered">
          <Stars count={item.stars} />
        </div>
      </div>

      {/* Description */}
      <div className="tc-review-content">
        <p className="tc-text">"{item.review.replace(/''/g, "")}"</p>
      </div>
    </div>
  );
}

// ── Testimonial Carousel (Swiper-style) ──────────────────────────────────────
function TestimonialCarousel() {
  const total = TESTIMONIALS.length;
  // We use an "infinite" approach: clone slides for looping
  const [current, setCurrent] = useState(0); // real index 0..total-1
  const [transitioning, setTransitioning] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const autoplayRef = useRef(null);
  const pausedRef = useRef(false);

  // Detect viewport for responsive slides
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 480) setSlidesPerView(1);
      else if (w < 750) setSlidesPerView(1);
      else if (w < 1025) setSlidesPerView(2);
      else setSlidesPerView(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(((idx % total) + total) % total);
    setTimeout(() => setTransitioning(false), 650);
  }, [transitioning, total]);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (!pausedRef.current) goTo(current + 1);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [current, goTo]);

  // Build the visible slide array (centered)
  // For 3-up we show: [current-1, current, current+1] (centered)
  // For looping we use modulo
  const getSlides = () => {
    const slides = [];
    const half = Math.floor(slidesPerView / 2);
    for (let i = -half; i <= half; i++) {
      if (slidesPerView === 1) {
        slides.push({ item: TESTIMONIALS[current], offset: 0, isCenter: true });
        break;
      }
      const idx = ((current + i) % total + total) % total;
      slides.push({ item: TESTIMONIALS[idx], offset: i, isCenter: i === 0 });
    }
    // For 2-up: show [current, current+1]
    if (slidesPerView === 2) {
      return [
        { item: TESTIMONIALS[current], offset: 0, isCenter: false },
        { item: TESTIMONIALS[(current + 1) % total], offset: 1, isCenter: false },
      ];
    }
    return slides;
  };

  const slides = getSlides();

  return (
    <div className="tc-carousel-root"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}>

      {/* Top row: Section Header (left) + Pagination (right) */}
      <div className="tc-top-row">
        <div className="tc-header-group">
          <h3 className="tc-section-title">Our Testimonials</h3>
          <div className="tc-title-line" />
        </div>
        <div className="tc-fraction-top">
          <span className="tc-fraction-current">{current + 1}</span>
          <span className="tc-fraction-sep"> / </span>
          <span className="tc-fraction-total">{total}</span>
        </div>
      </div>

      {/* Slider track */}
      <div className="tc-swiper-container">
        <div className="tc-swiper-wrapper" style={{ gap: 20 }}>
          {slides.map((s, i) => (
            <div key={`${s.item.name}-${i}`}
              className={`tc-slide${s.isCenter ? " tc-slide-active" : ""}`}
              style={{ flex: `0 0 calc(${100 / slidesPerView}% - ${(20 * (slidesPerView - 1)) / slidesPerView}px)` }}>
              <TestimonialCard item={s.item} isActive={s.isCenter} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Flip Box component (zoom-out effect, matching wdt-flip-box-effect-zoom-out) ─
function FlipCard({ title, desc, img, bg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="os-flip-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", borderRadius: 4 }}>

        {/* ── FRONT ── */}
        <div className={`wfb-front${hovered ? " wfb-front-hidden" : ""}`}>
          <div className="wfb-image">
            <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div className="wfb-overlay" />
        </div>

        {/* ── BACK ── */}
        <div className={`wfb-back${hovered ? " wfb-back-visible" : ""}`} style={{ background: bg }}>
          <div className="wfb-back-inner">
            <h3 className="wfb-title">{title}</h3>
            <div className="wfb-description">{desc}</div>
          </div>
          <div className="wfb-overlay" />
        </div>

      </div>
    </div>
  );
}



// ── Page ─────────────────────────────────────────────────────────────────────
export default function OurStoryPage() {
  return (
    <div style={{ background: "var(--ivory)" }}>

      {/* ── 1. Hero intro ───────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "72px 24px 40px", textAlign: "center" }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 16 }}>
          About Kanyakunj
        </span>
        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 500, color: "var(--maroon)", margin: "0 0 24px", lineHeight: 1.2 }}>
          Every Thread Tells a Story
        </h4>
        <div style={{ width: 56, height: 1, background: "var(--gold)", margin: "0 auto 28px" }} />
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 300, color: "var(--charcoal-light)", lineHeight: 1.9, margin: "0 auto 28px", maxWidth: 680 }}>
          KANYAKUNJ creates clothing that celebrates womanhood in all its forms: delicate yet powerful, traditional yet modern.
          Each design is more than an outfit — it is an expression of identity, crafted to make women feel confident, radiant, and unapologetically themselves.
        </p>
        <div style={{ width: 56, height: 1, background: "var(--border)", margin: "0 auto" }} />
      </section>

      {/* ── 2. Wide banner image ────────────────────────────────────────────── */}
      <section style={{ width: "100%", lineHeight: 0 }}>
        <img
          src="https://kanyakunj.com/wp-content/uploads/2025/09/Untitled-design-2.jpg"
          alt="Kanyakunj banner"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </section>

      {/* ── 3. "Our Story" heading ──────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 8px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 500, color: "var(--maroon)", margin: 0, lineHeight: 1.1 }}>
          Our Story
        </h2>
        <div style={{ width: 56, height: 1.5, background: "var(--gold)", marginTop: 16 }} />
      </section>

      {/* ── 4. Story 50/50 ──────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 64px" }}>
        <div className="os-story-grid">
          <div className="os-story-text">
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(17px,2vw,21px)", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.85, margin: "0 0 28px" }}>
              <span className="os-drop-cap">W</span>e create clothing that celebrates womanhood — delicate yet powerful, traditional yet modern.
              Our designs are not just outfits, but expressions of identity, crafted to make every woman feel confident in her own skin.
              With every piece, we honor the spirit of femininity: elegant, bold, and unapologetically her.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,1.8vw,19px)", fontWeight: 500, fontStyle: "italic", color: "var(--maroon)", margin: 0 }}>
              KANYAKUNJ – For Her, From Her.
            </p>
          </div>
          <div className="os-story-image">
            <img src="https://kanyakunj.com/wp-content/uploads/2025/09/1.jpg" alt="Kanyakunj Story"
              style={{ width: "100%", height: "auto", display: "block", borderRadius: 2 }} />
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials carousel ────────────────────────────────────────── */}
      <section style={{ background: "var(--ivory-dark)", padding: "72px 0 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 500, color: "var(--maroon)", textAlign: "center", margin: "0 0 12px" }}>
            Our Testimonials
          </h3>
          <div style={{ width: 48, height: 1, background: "var(--gold)", margin: "0 auto 48px" }} />
        </div>
        <TestimonialCarousel />
      </section>

      {/* ── 6. Raw Materials heading ────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 12px" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 500, color: "var(--maroon)", margin: "0 0 16px" }}>
          Raw Materials &amp; Craftsmanship
        </h3>
        <div style={{ width: 56, height: 1.5, background: "var(--gold)" }} />
      </section>

      {/* ── 7. Flip-box grid ────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 72px" }}>
        <div className="os-craft-grid">
          {CRAFT_CARDS.map((c) => (
            <FlipCard key={c.title} {...c} />
          ))}
        </div>
        <p style={{ textAlign: "center", fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 1.5, color: "var(--warm-gray)", marginTop: 20, textTransform: "uppercase" }}>
          Hover over each card to learn more
        </p>
      </section>

      {/* ── 8. YouTube video ────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 4, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
          <iframe
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            src="https://www.youtube.com/embed/XHOmBV4js_E?controls=1&rel=0&playsinline=0"
            title="Kanyakunj – Our Story"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* ── 9. CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 24px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: "var(--maroon)", marginBottom: 24 }}>
          Be Part of Our Story
        </h2>
        <Link href="/shop" className="btn-primary" style={{ fontSize: 11, letterSpacing: 2 }}>
          Shop the Collection
        </Link>
      </section>

      {/* ── Scoped styles ────────────────────────────────────────────────────── */}
      <style>{`

        /* ── Drop cap ── */
        .os-drop-cap {
          float: left;
          font-family: 'Cormorant Garamond', serif;
          font-size: 5em;
          line-height: 0.75;
          margin-right: 8px;
          margin-top: 6px;
          color: var(--maroon);
          font-weight: 500;
        }

        /* ── Story grid ── */
        .os-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .os-story-grid { grid-template-columns: 1fr; gap: 32px; }
          .os-story-image { order: -1; }
          .os-drop-cap { font-size: 3.5em; }
        }

        /* ── Craft grid ── */
        .os-craft-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) { .os-craft-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .os-craft-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 400px)  { .os-craft-grid { grid-template-columns: 1fr; } }

        /* ══════════════════════════════════════════
           TESTIMONIAL CAROUSEL
        ══════════════════════════════════════════ */
        .tc-carousel-root {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        /* Slider viewport */
        .tc-swiper-container {
          width: 100%;
          padding: 0 24px;
          box-sizing: border-box;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Slides row */
        .tc-swiper-wrapper {
          display: flex;
          align-items: stretch;
          transition: none;
        }

        /* Individual slide */
        .tc-slide {
          flex-shrink: 0;
          min-width: 0;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        /* Card shell */
        .tc-card {
          border: 1px solid var(--border);
          background: #fff;
          border-radius: 3px;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.25s ease;
        }
        .tc-card:hover {
          box-shadow: 0 6px 28px rgba(110,21,48,0.09);
        }

        /* ── Media group: image + meta side by side ── */
        .tc-media-group {
          display: flex;
          align-items: flex-start;
          gap: 0;
          padding: 20px 20px 14px;
          border-bottom: 1px solid var(--border);
        }

        .tc-image-wrapper {
          flex-shrink: 0;
          width: 90px;
          height: 76px;
          overflow: hidden;
          border-radius: 2px;
          margin-right: 14px;
        }

        .tc-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .tc-card:hover .tc-image { transform: scale(1.04); }

        .tc-meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
          justify-content: center;
        }

        .tc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 500;
          color: var(--maroon);
          margin: 0;
          line-height: 1.2;
        }

        .tc-role {
          font-family: 'Jost', sans-serif;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--warm-gray);
        }

        /* ── Detail group: review + quote icon ── */
        .tc-detail-group {
          padding: 18px 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
        }

        .tc-description {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: var(--charcoal-light);
          line-height: 1.8;
          margin: 0;
          font-style: italic;
        }

        .tc-quote-icon {
          display: flex;
          justify-content: flex-end;
          opacity: 0.5;
        }

        /* ── Pagination row ── */
        .tc-pagination-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 32px;
          padding: 0 24px 8px;
        }

        .tc-fraction {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: var(--warm-gray);
          letter-spacing: 1px;
          min-width: 48px;
          text-align: center;
        }

        .tc-fraction-current {
          color: var(--maroon);
          font-weight: 500;
        }

        .tc-arrows {
          display: flex;
          gap: 8px;
        }

        /* ══════════════════════════════════════════
           NEW TESTIMONIAL CAROUSEL STYLE
        ══════════════════════════════════════════ */
        .tc-carousel-root {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        /* Top Row Header + Pagination */
        .tc-top-row {
          max-width: 1200px;
          margin: 0 auto 50px;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
        }

        .tc-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 400;
          color: var(--maroon);
          margin: 0;
          line-height: 1.1;
        }

        .tc-title-line {
          width: 50px;
          height: 1.5px;
          background: var(--gold);
          margin-top: 15px;
        }

        .tc-fraction-top {
          font-family: 'Jost', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: #000;
          letter-spacing: 1px;
        }

        .tc-fraction-sep {
          color: #ccc;
          margin: 0 5px;
        }

        /* Swiper Container */
        .tc-swiper-container {
          width: 100%;
          padding: 20px 24px;
          box-sizing: border-box;
          max-width: 1300px;
          margin: 0 auto;
        }

        .tc-swiper-wrapper {
          display: flex;
          align-items: center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Card Styles */
        .tc-card {
          background: #f1e6d3; /* beige from image */
          border-radius: 80px; /* very rounded pill shape */
          padding: 50px 35px;
          text-align: center;
          transition: all 0.5s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          min-height: 480px;
          justify-content: center;
        }

        /* Active Card Style (Cyan) */
        .tc-card-active {
          background: #c9e6e8; /* cyan from image */
          transform: scale(1.05);
          box-shadow: 0 15px 45px rgba(0,0,0,0.06);
          z-index: 10;
        }

        .tc-slide {
          flex-shrink: 0;
          transition: all 0.5s ease;
        }

        /* Image Box */
        .tc-image-box {
          width: 110px;
          height: 110px;
          background: #fff;
          border-radius: 35px; /* rounded square box */
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .tc-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 30px;
        }

        /* Text Content */
        .tc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          color: #000;
          margin: 0 0 5px;
        }

        .tc-role {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 400;
          text-transform: capitalize;
          color: var(--warm-gray);
          margin-bottom: 12px;
        }

        .tc-stars-centered {
          margin-bottom: 25px;
          display: flex;
          justify-content: center;
        }

        .tc-text {
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.7;
          color: #333;
          margin: 0;
          max-width: 280px;
        }



        /* ══════════════════════════════════════════
           FLIP BOX — zoom-out effect
           Matches: wdt-flip-box-effect-zoom-out
        ══════════════════════════════════════════ */
        .os-flip-card {
          cursor: pointer;
        }

        /* Front & Back share absolute positioning */
        .wfb-front,
        .wfb-back {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        /* ── FRONT ── */
        .wfb-front {
          z-index: 2;
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: scale(1);
          will-change: transform, opacity;
        }
        /* When hovered: zoom out + fade away */
        .wfb-front.wfb-front-hidden {
          opacity: 0;
          transform: scale(0.85);
        }

        /* Image fills the front completely */
        .wfb-image {
          position: absolute;
          inset: 0;
        }
        .wfb-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .os-flip-card:hover .wfb-image img {
          transform: scale(1.08);
        }

        /* Shared overlay layer */
        .wfb-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        /* Front overlay: very light dark tint */
        .wfb-front .wfb-overlay {
          background: rgba(0, 0, 0, 0.05);
          transition: background 0.4s ease;
        }
        .os-flip-card:hover .wfb-front .wfb-overlay {
          background: rgba(0, 0, 0, 0.15);
        }

        /* ── BACK ── */
        .wfb-back {
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(1.15);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }
        /* When hovered: zoom in to normal + fade in */
        .wfb-back.wfb-back-visible {
          opacity: 1;
          transform: scale(1);
        }
        /* Back overlay: darker tint on top of bg */
        .wfb-back .wfb-overlay {
          background: rgba(0, 0, 0, 0.25);
        }

        /* Back inner content: centered, above overlay */
        .wfb-back-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .wfb-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(16px, 1.5vw, 22px);
          font-weight: 500;
          color: #fff;
          margin: 0;
          line-height: 1.25;
          letter-spacing: 0.5px;
        }
        /* Gold divider line between title and desc */
        .wfb-title::after {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: var(--gold);
          margin: 12px auto 0;
        }

        .wfb-description {
          font-family: 'Jost', sans-serif;
          font-size: clamp(11px, 1.1vw, 13px);
          font-weight: 300;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
}
