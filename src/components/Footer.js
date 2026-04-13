"use client";

import Link from "next/link";
export default function Footer() {
  return (
    <footer style={{ background: "var(--charcoal)", color: "var(--ivory)", padding: "60px 24px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            paddingBottom: 48,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
              Kanyakunj
            </h3>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: "rgba(250,246,240,0.6)", maxWidth: 280, marginBottom: 24 }}>
              Celebrating the timeless elegance of Indian women through thoughtfully crafted ethnic wear.
            </p>
            {/* Social */}
            <div style={{ display: "flex", gap: 16 }}>
              {["Instagram", "Facebook", "WhatsApp"].map((s) => (
                <a key={s} href="#" style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold-light)", textDecoration: "none", opacity: 0.7 }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 20 }}>
              Shop
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Dresses", "Dupatta", "Co-ord Set", "Ethnic Set", "Kurti", "Short Kurti"].map((item) => (
                <li key={item}>
                  <Link href={`/shop?category=${item.toLowerCase().replace(" ", "-")}`}
                    style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(250,246,240,0.6)", textDecoration: "none", transition: "color 0.2s" }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 20 }}>
              Help
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "My Account", href: "/account" },
                { label: "Track Order", href: "/account/orders" },
                { label: "Returns", href: "/returns" },
                { label: "Shipping Info", href: "/shipping" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(250,246,240,0.6)", textDecoration: "none" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 20 }}>
              About
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Our Story", href: "/our-story" },
                { label: "Blog", href: "/blog" },
                { label: "Career", href: "/career" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(250,246,240,0.6)", textDecoration: "none" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: "24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 300, color: "rgba(250,246,240,0.4)", letterSpacing: 1 }}>
            © 2025 Kanyakunj. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {["Visa", "Mastercard", "UPI", "Razorpay"].map((p) => (
              <span key={p} style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "rgba(250,246,240,0.3)",
                border: "1px solid rgba(250,246,240,0.15)",
                padding: "3px 8px",
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
