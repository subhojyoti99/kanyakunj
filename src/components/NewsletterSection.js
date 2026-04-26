"use client";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section style={{
      background: "var(--ivory-dark)",
      padding: "80px 24px",
      textAlign: "center",
    }}>
      <span className="section-label">Stay in the Loop</span>
      <h2 className="section-title" style={{ marginBottom: 12 }}>
        Get Exclusive Offers
      </h2>
      <p style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 14,
        fontWeight: 300,
        color: "var(--warm-gray)",
        maxWidth: 420,
        margin: "0 auto 36px",
        lineHeight: 1.8,
      }}>
        Subscribe and get 30% off your first purchase + early access to new arrivals.
      </p>

      {submitted ? (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "var(--gold-dark)" }}>
          Thank you! Your 30% off code is on its way. ✦
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: 0,
            maxWidth: 440,
            margin: "0 auto",
          }}
          className="newsletter-form"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            suppressHydrationWarning
            required
            className="form-input"
            style={{
              flex: 1,
              borderRight: "none",
              fontSize: 13,
            }}
          />
          <button type="submit" className="btn-primary" style={{ flexShrink: 0, padding: "14px 24px" }} suppressHydrationWarning>
            Subscribe
          </button>
        </form>
      )}

      <style jsx global>{`
        @media (max-width: 480px) {
          .newsletter-form {
            flex-direction: column !important;
          }
          .newsletter-form input {
            border-right: 1px solid var(--border) !important;
            border-bottom: none !important;
          }
          .newsletter-form button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
