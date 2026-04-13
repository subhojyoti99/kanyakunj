import Link from "next/link";

export const metadata = {
  title: "Our Story – Kanyakunj",
  description: "Every thread tells a story. Kanyakunj creates clothing that celebrates womanhood in all its forms: delicate yet powerful, traditional yet modern.",
};

export default function OurStoryPage() {
  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", height: "60vh", minHeight: 400, background: "var(--charcoal)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src="https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&q=80&w=1600"
          alt="Kanyakunj Our Story"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
        />
        <div style={{ position: "relative", textAlign: "center", padding: "0 24px" }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 16 }}>
            About Kanyakunj
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 300, color: "#fff", margin: 0, lineHeight: 1.1 }}>
            Every Thread Tells a Story
          </h1>
        </div>
      </div>

      {/* Brand Manifesto */}
      <div style={{ maxWidth: 800, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.8, marginBottom: 32 }}>
          KANYAKUNJ creates clothing that celebrates womanhood in all its forms: delicate yet powerful, traditional yet modern.
          Each design is more than an outfit — it is an expression of identity, crafted to make women feel confident, radiant, and unapologetically themselves.
        </p>
        <div style={{ width: 60, height: 1, background: "var(--gold)", margin: "0 auto 32px" }} />
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 300, color: "var(--warm-gray)", lineHeight: 1.9 }}>
          We create clothing that celebrates womanhood — delicate yet powerful, traditional yet modern. Our designs are not just outfits,
          but expressions of identity, crafted to make every woman feel confident in her own skin. With every piece, we honor the spirit
          of femininity: elegant, bold, and unapologetically her.
        </p>
      </div>

      {/* Tagline banner */}
      <div style={{ background: "var(--charcoal)", padding: "60px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 300, color: "#fff", margin: 0, fontStyle: "italic", letterSpacing: 1 }}>
          "KANYAKUNJ — For Her, From Her."
        </p>
      </div>

      {/* Core Values */}
      <div style={{ maxWidth: 1100, margin: "80px auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)" }}>What Drives Us</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 400, color: "var(--charcoal)", marginTop: 10 }}>Our Values</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
          {[
            { icon: "✦", title: "Craftsmanship", desc: "Every garment is thoughtfully designed and quality checked to honor the art of Indian ethnic wear." },
            { icon: "✦", title: "Authenticity", desc: "We draw from India's rich textile traditions, blending heritage with contemporary sensibility." },
            { icon: "✦", title: "Empowerment", desc: "Our clothes are made to make you feel seen, celebrated, and confident in who you are." },
            { icon: "✦", title: "Sustainability", desc: "We are committed to responsible sourcing and mindful production practices." },
          ].map(v => (
            <div key={v.title} style={{ padding: "32px 24px", border: "1px solid var(--border)", borderRadius: 4, textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--gold)", marginBottom: 16 }}>{v.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "var(--charcoal)", marginBottom: 12 }}>{v.title}</h3>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "var(--warm-gray)", lineHeight: 1.8, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background: "var(--ivory-dark)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)" }}>What They Say</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 400, color: "var(--charcoal)", marginTop: 10 }}>Our Testimonials</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { name: "Lenda Leena", review: "The quality of the kurti I received was beyond my expectations. Every stitch felt intentional and the fabric was so soft!" },
              { name: "Cathrine", review: "Kanyakunj is my go-to for ethnic wear. Beautiful designs that make me feel elegant every time I wear them." },
              { name: "Hermaine", review: "I love how their pieces blend tradition with modernity. The co-ord set I bought gets so many compliments!" },
              { name: "Hellen", review: "Fast delivery, gorgeous packaging, and the outfit fit perfectly. Highly recommend Kanyakunj!" },
            ].map(t => (
              <div key={t.name} style={{ background: "#fff", padding: "28px 24px", borderRadius: 4, border: "1px solid var(--border)" }}>
                <div style={{ color: "var(--gold)", fontSize: 18, marginBottom: 12 }}>★★★★★</div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.8, marginBottom: 16, fontStyle: "italic" }}>
                  "{t.review}"
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500, color: "var(--charcoal)", margin: 0 }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "var(--charcoal)", marginBottom: 24 }}>
          Be Part of Our Story
        </h2>
        <Link href="/shop" className="btn-primary" style={{ fontSize: 11, letterSpacing: 2 }}>
          Shop the Collection
        </Link>
      </div>
    </div>
  );
}
