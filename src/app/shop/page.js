"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "../../components/ProductGrid";

const sortOptions = [
  { value: "date-desc", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popularity-desc", label: "Most Popular" },
];

const categories = [
  { label: "All", slug: "" },
  { label: "Kurtis", slug: "kurti" },
  { label: "Short Kurti", slug: "short-kurti" },
  { label: "Dupatta", slug: "dupatta" },
  { label: "Co-ord Set", slug: "co-ord-set" },
  { label: "Ethnic Set", slug: "ethnic-set" },
  { label: "Dresses", slug: "dresses" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "";
  const onSale = searchParams.get("on_sale") === "true";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [categorySlug, onSale, sort]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const [orderby, order] = sort.split("-");

      const params = new URLSearchParams({
        per_page: 12,
        page,
        orderby,
        order,
        status: "publish",
      });
      if (onSale) params.set("on_sale", "true");
      if (categorySlug) params.set("category_slug", categorySlug);

      try {
        // Uses our secure API route — no secret keys exposed to browser
        const res = await fetch(`/api/wc/products?${params}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (page === 1) {
          setProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === 12);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, onSale, sort, page]);

  const categoryLabel = categorySlug
    ? categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "All Products";

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{
        background: "var(--ivory-dark)",
        borderBottom: "1px solid var(--border)",
        padding: "48px 24px",
        textAlign: "center",
      }}>
        <span className="section-label">{onSale ? "Special Offers" : "Browse"}</span>
        <h1 className="section-title">{onSale ? "Sale Items" : categoryLabel}</h1>
        <div className="gold-divider" />
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        {/* Toolbar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 12,
        }}>
          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((cat) => {
              const active = categorySlug === cat.slug;
              return (
                <a
                  key={cat.slug}
                  href={cat.slug ? `/shop?category=${cat.slug}` : "/shop"}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    padding: "8px 16px",
                    border: "1px solid",
                    borderColor: active ? "var(--charcoal)" : "var(--border)",
                    background: active ? "var(--charcoal)" : "transparent",
                    color: active ? "var(--ivory)" : "var(--charcoal-light)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  {cat.label}
                </a>
              );
            })}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-input"
            style={{ width: "auto", padding: "8px 16px", fontSize: 12, cursor: "pointer" }}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Products */}
        <ProductGrid products={products} columns={4} loading={loading && page === 1} />

        {/* Load more */}
        {hasMore && !loading && (
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="btn-outline"
            >
              Load More
            </button>
          </div>
        )}
        {loading && page > 1 && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)", letterSpacing: 1 }}>
              Loading...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense — required by Next.js App Router for useSearchParams
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: "var(--warm-gray)", letterSpacing: 1 }}>Loading...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
