"use client";

import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The quality of the fabric is absolutely stunning. I wore this saree to my cousin's wedding and received so many compliments. Kanyakunj truly understands the elegance of Indian women.",
    avatar: "PS",
    color: "#c8b99a",
  },
  {
    name: "Rekha Nair",
    location: "Kochi",
    rating: 5,
    text: "I was skeptical about ordering ethnic wear online, but Kanyakunj exceeded all my expectations. The colors are vibrant and the stitching is impeccable. Will definitely order again!",
    avatar: "RN",
    color: "#b5836a",
  },
  {
    name: "Anjali Mehta",
    location: "Delhi",
    rating: 5,
    text: "My kurti arrived beautifully packaged and the fabric is so soft. The fit is perfect and the embroidery work is exquisite. This is now my go-to brand for ethnic fashion.",
    avatar: "AM",
    color: "#8a6552",
  },
  {
    name: "Sunita Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "Exceptional craftsmanship and prompt delivery. The lehenga I ordered for Navratri was a showstopper! The rich colors and detailed work made me feel like a queen.",
    avatar: "SP",
    color: "#c8b99a",
  },
  {
    name: "Deepika Rao",
    location: "Bengaluru",
    rating: 5,
    text: "Kanyakunj has the most authentic collection of ethnic wear I've found online. Every piece feels handcrafted with love. My family now orders from here exclusively.",
    avatar: "DR",
    color: "#b5836a",
  },
];

// Avatar grid cells — mix of real initials + decorative shapes
const gridCells = [
  { type: "avatar", idx: 0 },
  { type: "shape", color: "var(--gold-light)", shape: "circle" },
  { type: "avatar", idx: 1 },
  { type: "shape", color: "var(--rose)", shape: "square" },
  { type: "shape", color: "var(--ivory-dark)", shape: "circle" },
  { type: "avatar", idx: 2 },
  { type: "shape", color: "var(--maroon)", shape: "circle" },
  { type: "avatar", idx: 3 },
  { type: "shape", color: "var(--gold)", shape: "square" },
  { type: "shape", color: "var(--ivory-dark)", shape: "halfcircle" },
  { type: "avatar", idx: 4 },
  { type: "shape", color: "var(--rose)", shape: "circle" },
  { type: "shape", color: "var(--gold-light)", shape: "square" },
  { type: "avatar", idx: 2 },
  { type: "shape", color: "var(--maroon)", shape: "square" },
  { type: "avatar", idx: 0 },
  { type: "shape", color: "var(--rose)", shape: "halfcircle" },
  { type: "avatar", idx: 1 },
  { type: "shape", color: "var(--gold)", shape: "circle" },
  { type: "shape", color: "var(--ivory-dark)", shape: "square" },
  { type: "avatar", idx: 3 },
  { type: "shape", color: "var(--gold-light)", shape: "halfcircle" },
  { type: "avatar", idx: 4 },
  { type: "shape", color: "var(--maroon)", shape: "circle" },
];

function GridCell({ cell }) {
  const t = testimonials[cell.idx] || testimonials[0];

  if (cell.type === "avatar") {
    return (
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: t.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 15,
          fontWeight: 600,
          color: "white",
          flexShrink: 0,
          border: "2px solid white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {t.avatar}
      </div>
    );
  }

  const radius =
    cell.shape === "circle" ? "50%" :
    cell.shape === "halfcircle" ? "50% 50% 0 0" : "4px";

  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: radius,
        background: cell.color,
        flexShrink: 0,
        opacity: 0.7,
      }}
    />
  );
}

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section style={{ background: "var(--ivory)", padding: "80px 0 100px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">Customer Feedback</span>
        </div>

        {/* Avatar mosaic + central text */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 56,
          }}
        >
          {/* Left avatar strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 52px)",
              gap: 8,
              flex: 1,
            }}
            className="avatar-strip"
          >
            {gridCells.slice(0, 12).map((cell, i) => (
              <GridCell key={i} cell={cell} />
            ))}
          </div>

          {/* Central heading */}
          <div
            style={{
              padding: "0 40px",
              textAlign: "center",
              minWidth: 260,
              flexShrink: 0,
            }}
            className="mosaic-heading"
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 3vw, 40px)",
                fontWeight: 400,
                color: "var(--maroon)",
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              Join thousands of{" "}
              <em style={{ color: "var(--gold-dark)" }}>happy</em>
              <br />
              shoppers
            </p>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                fontWeight: 300,
                color: "var(--warm-gray)",
                marginTop: 10,
                letterSpacing: 0.5,
              }}
            >
              who love Kanyakunj
            </p>
          </div>

          {/* Right avatar strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 52px)",
              gap: 8,
              flex: 1,
              justifyContent: "end",
            }}
            className="avatar-strip"
          >
            {gridCells.slice(12, 24).map((cell, i) => (
              <GridCell key={i} cell={cell} />
            ))}
          </div>
        </div>

        {/* Testimonial Card */}
        <div
          style={{
            background: "#f5ede8",
            padding: "40px 48px",
            display: "flex",
            gap: 48,
            alignItems: "flex-start",
            position: "relative",
          }}
          className="testimonial-card"
        >
          {/* Left: quote + text */}
          <div style={{ flex: 1 }}>
            {/* Big quote mark */}
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 64,
                color: "var(--gold)",
                lineHeight: 0.6,
                marginBottom: 24,
                userSelect: "none",
              }}
            >
              "
            </div>

            {/* Stars */}
            <div style={{ marginBottom: 16 }}>
              {"★★★★★".split("").map((s, i) => (
                <span key={i} style={{ color: "var(--gold)", fontSize: 14 }}>{s}</span>
              ))}
            </div>

            {/* Quote text */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                fontStyle: "italic",
                color: "var(--maroon)",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              {t.text}
            </p>

            {/* Dot navigation */}
            <div style={{ display: "flex", gap: 8 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === current ? "var(--gold)" : "var(--border)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.4s ease",
                    padding: 0,
                  }}
                  suppressHydrationWarning
                />
              ))}
            </div>
          </div>

          {/* Right: reviewer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              minWidth: 120,
              paddingTop: 8,
            }}
            className="testimonial-reviewer"
          >
            {/* Avatar circle */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${t.color}, var(--maroon))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                fontWeight: 600,
                color: "white",
                border: "3px solid white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}
            >
              {t.avatar}
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "var(--maroon)",
                  marginBottom: 2,
                }}
              >
                {t.name}
              </p>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  color: "var(--warm-gray)",
                  fontWeight: 300,
                }}
              >
                {t.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .avatar-strip { display: none !important; }
          .mosaic-heading { padding: 0 !important; }
          .testimonial-card { flex-direction: column !important; padding: 32px 24px !important; gap: 24px !important; }
          .testimonial-reviewer { flex-direction: row !important; min-width: unset !important; }
        }
      `}</style>
    </section>
  );
}
