const features = [
  {
    label: "Free Shipping",
    sub: "On orders above ₹999",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Easy Returns",
    sub: "7-day return policy",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    label: "Secure Payment",
    sub: "Razorpay protected",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    label: "Authentic Quality",
    sub: "Handpicked fabrics",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

// Inline SVG crosshatch pattern as data URI
const crosshatchBg = `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 8L8 0M-1 1L1 -1M7 9L9 7' stroke='%23c8b99a' stroke-width='0.6' opacity='0.35'/%3E%3C/svg%3E")`;

export default function PromiseSection() {
  return (
    <section
      style={{
        background: "var(--maroon)",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Brand Story Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span
            className="section-label"
            style={{ color: "var(--gold-light)" }}
          >
            Our Promise
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              color: "var(--ivory)",
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            For Her,
            <br />
            <em>From Her</em>
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              color: "var(--ivory-dark)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.8,
              opacity: 0.8,
            }}
          >
            Every piece at Kanyakunj is crafted with love, celebrating the
            timeless elegance of Indian women. Tradition woven into every thread.
          </p>
        </div>

        {/* Gold Divider with Diamond */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 60,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, var(--gold-light))",
            }}
          />
          <span style={{ color: "var(--gold-light)", fontSize: 14 }}>◆</span>
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to left, transparent, var(--gold-light))",
            }}
          />
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "rgba(255,255,255,0.08)",
          }}
          className="promise-grid"
        >
          {features.map((f) => (
            <div
              key={f.label}
              style={{
                padding: "36px 24px",
                textAlign: "center",
                background: "var(--maroon)",
                transition: "background 0.3s ease",
              }}
              className="promise-item"
            >
              {/* Icon with crosshatch textured circle */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  margin: "0 auto 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${crosshatchBg}, var(--ivory-dark)`,
                  backgroundSize: "8px 8px, auto",
                  border: "1px solid rgba(200,185,154,0.25)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                }}
              >
                {f.svg}
              </div>

              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "var(--gold-light)",
                  marginBottom: 6,
                }}
              >
                {f.label}
              </p>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  color: "var(--ivory-dark)",
                  fontWeight: 300,
                  opacity: 0.7,
                }}
              >
                {f.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .promise-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .promise-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .promise-item:hover {
          background: rgba(255, 255, 255, 0.04) !important;
        }
      `}</style>
    </section>
  );
}

