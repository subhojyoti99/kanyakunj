export const metadata = {
  title: "Career – Kanyakunj",
  description: "Join the Kanyakunj team — grow with a brand that honors tradition while embracing modern expression.",
};

const perks = [
  { icon: "🎁", title: "Employee Discounts", desc: "Enjoy exclusive savings on all Kanyakunj collections." },
  { icon: "📈", title: "Growth & Development", desc: "Training programs and mentorship to help you upskill and shape your career." },
  { icon: "🌟", title: "Recognition & Rewards", desc: "Your efforts and dedication are valued and celebrated." },
  { icon: "⚖️", title: "Work-Life Balance", desc: "Flexible work options and supportive policies that prioritize your well-being." },
  { icon: "🤝", title: "Inclusive Workplace", desc: "A safe, positive environment where every employee feels respected and appreciated." },
  { icon: "🎨", title: "Creative Culture", desc: "Work alongside artisans, designers, and technologists who love what they do." },
];

const values = [
  { title: "Inclusive & Respectful", desc: "We embrace individuality and diversity. Every team member adds a unique thread to our story." },
  { title: "Creative & Collaborative", desc: "Our designs are born from teamwork, where artisans, designers, and technologists work hand in hand." },
  { title: "Empowering & Supportive", desc: "Just as our clothing empowers women, our workplace empowers employees to grow, learn, and lead." },
  { title: "Values Driven", desc: "We practice fairness, equal opportunity, and integrity in all that we do." },
];

export default function CareerPage() {
  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", height: "55vh", minHeight: 360, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src="https://kanyakunj.com/wp-content/uploads/2025/09/career_baner-1024x334.png"
          alt="Kanyakunj Careers"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }}
        />
        <div style={{ position: "relative", textAlign: "center", padding: "0 24px" }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 16 }}>
            Join Our Team
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 70px)", fontWeight: 300, color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>
            Grow With Us
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.8)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            At Kanyakunj, we believe fashion is more than clothing — it's a voice, a story, and a celebration of womanhood.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div style={{ maxWidth: 800, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 300, color: "var(--maroon)", lineHeight: 1.9, marginBottom: 24 }}>
          We are always looking for passionate, creative, and driven individuals who want to be part of a brand that blends tradition with modernity.
          Whether you are a fresh graduate eager to learn or a professional with experience, Kanyakunj offers opportunities to build a meaningful career.
        </p>
        <div style={{ background: "var(--ivory-dark)", border: "1px solid var(--border)", borderRadius: 4, padding: "24px 32px", marginTop: 32 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)", lineHeight: 1.8, margin: 0 }}>
            To apply, share your resume at{" "}
            <a href="mailto:info@kanyakunj.com" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>
              info@kanyakunj.com
            </a>
            . If your profile matches our requirements, our team will reach out.
            Otherwise, we will keep your application in our talent pool for future openings.
          </p>
        </div>
      </div>

      {/* Work Culture */}
      <div style={{ background: "var(--ivory-dark)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)" }}>How We Work</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 400, color: "var(--maroon)", marginTop: 10 }}>Our Work Culture</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {values.map(v => (
              <div key={v.title} style={{ background: "#fff", padding: "28px 24px", borderRadius: 4, border: "1px solid var(--border)" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: "var(--maroon)", marginBottom: 12 }}>{v.title}</h3>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "var(--warm-gray)", lineHeight: 1.8, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perks */}
      <div style={{ maxWidth: 1100, margin: "80px auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)" }}>What You Get</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 400, color: "var(--maroon)", marginTop: 10 }}>Perks &amp; Benefits</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
          {perks.map(p => (
            <div key={p.title} style={{ display: "flex", gap: 20, padding: "24px", border: "1px solid var(--border)", borderRadius: 4 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{p.icon}</span>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: "var(--maroon)", marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "var(--warm-gray)", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Join */}
      <div style={{ background: "var(--maroon)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 16 }}>
            Why Join Us?
          </span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#fff", marginBottom: 24, lineHeight: 1.2 }}>
            Be Part of a Movement
          </h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.75)", lineHeight: 1.9, marginBottom: 40 }}>
            When you join Kanyakunj, you don't just work for a fashion brand — you become part of a movement that honors tradition
            while embracing modern expression. Together, we weave stories into every garment and celebrate womanhood in all its forms.
          </p>
          <a
            href="mailto:info@kanyakunj.com"
            style={{ display: "inline-block", padding: "14px 36px", background: "var(--gold)", color: "#fff", fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}
          >
            Send Your Resume →
          </a>
        </div>
      </div>
    </div>
  );
}
