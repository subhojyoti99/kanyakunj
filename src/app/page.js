import { getProducts } from "../lib/api";
import HeroSection from "../components/HeroSection";
import CategoryGrid from "../components/CategoryGrid";
import ProductGrid from "../components/ProductGrid";
import FeaturesBar from "../components/FeaturesBar";
import NewsletterSection from "../components/NewsletterSection";

export default async function HomePage() {
  const trendingProducts = await getProducts({ per_page: 8, orderby: "date", order: "desc" });
  const saleProducts = await getProducts({ per_page: 4, on_sale: true });

  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <CategoryGrid />

      {/* Trending Section */}
      <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">Save upto 20% Off</span>
          <h2 className="section-title">Trending Right Now</h2>
          <div className="gold-divider" />
        </div>
        <ProductGrid products={trendingProducts} />
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a href="/shop" className="btn-outline">View All Products</a>
        </div>
      </section>

      {/* Sale Section */}
      {saleProducts.length > 0 && (
        <section style={{ background: "var(--ivory-dark)", padding: "80px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-label">Limited Time</span>
              <h2 className="section-title">On Sale Now</h2>
              <div className="gold-divider" />
            </div>
            <ProductGrid products={saleProducts} columns={4} />
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <a href="/shop?on_sale=true" className="btn-gold">Shop All Sale</a>
            </div>
          </div>
        </section>
      )}

      {/* Brand Story Banner */}
      <section style={{
        background: "var(--charcoal)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <span className="section-label" style={{ color: "var(--gold-light)" }}>Our Promise</span>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(36px, 5vw, 60px)",
          fontWeight: 400,
          color: "var(--ivory)",
          marginBottom: 20,
          lineHeight: 1.1,
        }}>
          For Her,<br />
          <em>From Her</em>
        </h2>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 14,
          fontWeight: 300,
          color: "var(--ivory-dark)",
          maxWidth: 520,
          margin: "0 auto 36px",
          lineHeight: 1.8,
          opacity: 0.8,
        }}>
          Every piece at Kanyakunj is crafted with love, celebrating the timeless elegance
          of Indian women. Tradition woven into modern silhouettes.
        </p>
        <a href="/our-story" className="btn-gold">Our Story</a>
      </section>

      <NewsletterSection />
    </>
  );
}
