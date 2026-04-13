import Link from "next/link";

export const metadata = {
  title: "Blog – Kanyakunj",
  description: "Style tips, fashion guides, and stories from the world of Kanyakunj ethnic wear.",
};

const blogPosts = [
  {
    slug: "elevate-your-everyday-style",
    title: "Elevate Your Everyday Style with Timeless Ethnic Wear",
    category: "Style Guide",
    date: "April 2025",
    excerpt: "Ethnic fashion has always been a symbol of elegance and tradition. Today's women look for outfits that blend heritage with modernity — pieces that feel as comfortable at a family gathering as they do at the office.",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min read",
  },
  {
    slug: "how-to-style-a-kurti",
    title: "How to Style a Kurti for Every Occasion",
    category: "Fashion Tips",
    date: "March 2025",
    excerpt: "From casual brunch to a festive celebration, the kurti is India's most versatile garment. Here's how to style your Kanyakunj kurti for any event.",
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=800",
    readTime: "3 min read",
  },
  {
    slug: "co-ord-sets-trend-2025",
    title: "Why Co-ord Sets Are the Biggest Trend of 2025",
    category: "Trends",
    date: "February 2025",
    excerpt: "Coordinated sets have taken over fashion runways and street style alike. We explore why the co-ord set is the ultimate power outfit for modern Indian women.",
    image: "https://images.unsplash.com/photo-1591551001020-9d7cfdb93834?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read",
  },
  {
    slug: "summer-fabrics-guide",
    title: "The Ultimate Summer Fabric Guide: Stay Cool in Style",
    category: "Style Guide",
    date: "January 2025",
    excerpt: "Navigating Indian summers in style requires knowing your fabrics. Rayon, cotton, georgette — we break down which materials keep you cool while looking effortlessly chic.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "var(--ivory-dark)", padding: "80px 24px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 16 }}>
          Kanyakunj Journal
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, color: "var(--charcoal)", margin: "0 0 20px", lineHeight: 1.1 }}>
          Stories, Style &amp; Inspiration
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 300, color: "var(--warm-gray)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
          Discover fashion tips, styling guides, and stories from the world of Indian ethnic wear, curated for the modern Indian woman.
        </p>
      </div>

      {/* Featured Post */}
      <div style={{ maxWidth: 1100, margin: "60px auto 0", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 72 }} className="blog-grid-featured">
          <div style={{ paddingTop: "66%", position: "relative", borderRadius: 4, overflow: "hidden" }}>
            <img src={blogPosts[0].image} alt={blogPosts[0].title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>
              {blogPosts[0].category}
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 400, color: "var(--charcoal)", margin: "12px 0 16px", lineHeight: 1.2 }}>
              {blogPosts[0].title}
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "var(--warm-gray)", lineHeight: 1.8, marginBottom: 28 }}>
              {blogPosts[0].excerpt}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)" }}>{blogPosts[0].date}</span>
              <span style={{ width: 1, height: 12, background: "var(--border)" }} />
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)" }}>{blogPosts[0].readTime}</span>
            </div>
            <a href={`/blog/${blogPosts[0].slug}`} className="btn-outline" style={{ display: "inline-block", marginTop: 28, fontSize: 11 }}>
              Read Article
            </a>
          </div>
        </div>

        {/* Post Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 36, paddingBottom: 80 }}>
          {blogPosts.slice(1).map(post => (
            <article key={post.slug}>
              <div style={{ paddingTop: "64%", position: "relative", borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
                <img src={post.image} alt={post.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                  onMouseEnter={e => { e.target.style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
                />
              </div>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>
                {post.category}
              </span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "var(--charcoal)", margin: "8px 0 12px", lineHeight: 1.3 }}>
                {post.title}
              </h3>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "var(--warm-gray)", lineHeight: 1.8, marginBottom: 16 }}>
                {post.excerpt}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)" }}>{post.readTime}</span>
                <a href={`/blog/${post.slug}`} style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 1, color: "var(--gold)", textDecoration: "none", textTransform: "uppercase", fontWeight: 500 }}>
                  Read →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .blog-grid-featured { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
