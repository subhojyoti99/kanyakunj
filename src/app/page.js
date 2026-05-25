import { getProducts } from "../lib/api";
import HeroSection from "../components/HeroSection";
import CategoryGrid from "../components/CategoryGrid";
import ProductGrid from "../components/ProductGrid";

import NewsletterSection from "../components/NewsletterSection";
import EleganceSection from "../components/EleganceSection";
import BannerCarousel from "../components/BannerCarousel";
import ProductCarousel from "../components/ProductCarousel";
import TestimonialSection from "../components/TestimonialSection";
import PromiseSection from "../components/PromiseSection";

export default async function HomePage() {
  // Fetches products marked as "Featured" (starred) in WooCommerce so they can be manually curated
  const trendingProducts = await getProducts({ per_page: 8, featured: true });

  return (
    <>
      <HeroSection />


      {/* Trending Section */}
      <section style={{ padding: "60px 0 10px 0", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: 48, padding: "0 24px" }}>
          <span className="section-label">Save upto 20% Off</span>
          <h2 className="section-title">Trending Right Now</h2>
          <div className="gold-divider" />
        </div>
        <ProductCarousel products={trendingProducts} />
        <div style={{ textAlign: "center", marginTop: 36, padding: "0 24px" }}>
          <a href="/shop" className="btn-outline">View All Products</a>
        </div>
      </section>

      {/* Elegance Featured Section */}
      <EleganceSection />

      <CategoryGrid />

      {/* Sale/Promotional Banners */}
      <BannerCarousel />

      {/* Brand Story Banner */}
      <PromiseSection />

      {/* Testimonials Section */}
      <TestimonialSection />

      <NewsletterSection />
    </>
  );
}
