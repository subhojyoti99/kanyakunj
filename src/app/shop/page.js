"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
        background: "linear-gradient(135deg, var(--ivory) 0%, var(--ivory-dark) 100%)",
        borderBottom: "1px solid rgba(232, 221, 212, 0.5)",
        padding: "80px 24px",
        textAlign: "center",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.02)"
      }}>
        <span className="section-label" style={{ letterSpacing: "3px", color: "var(--gold-dark)" }}>{onSale ? "Special Offers" : "Browse"}</span>
        <h1 className="section-title" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: "16px 0", color: "var(--maroon)", fontWeight: 500 }}>{onSale ? "Sale Items" : categoryLabel}</h1>
        <div className="gold-divider" style={{ margin: "0 auto", height: "2px", width: "80px" }} />
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
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {categories.map((cat) => {
              const active = categorySlug === cat.slug;
              return (
                <a
                  key={cat.slug}
                  href={cat.slug ? `/shop?category=${cat.slug}` : "/shop"}
                  className={`category-pill ${active ? 'active' : ''}`}
                >
                  {cat.label}
                </a>
              );
            })}
          </div>

          {/* Sort */}
          <div style={{ position: "relative" }} ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="sort-dropdown-btn"
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
            >
              {sortOptions.find(o => o.value === sort)?.label || "Sort By"}
              <svg 
                width="10" height="6" viewBox="0 0 10 6" fill="none" 
                style={{ transform: isSortOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isSortOpen && (
              <ul className="custom-dropdown-menu" role="listbox">
                {sortOptions.map((o) => (
                  <li 
                    key={o.value}
                    role="option"
                    aria-selected={sort === o.value}
                    className={`custom-dropdown-item ${sort === o.value ? "selected" : ""}`}
                    onClick={() => {
                      setSort(o.value);
                      setIsSortOpen(false);
                    }}
                  >
                    {o.label}
                    {sort === o.value && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Products */}
        <ProductGrid 
          products={products} 
          columns={4} 
          loading={loading && page === 1} 
          categoryName={categories.find(c => c.slug === categorySlug)?.label || ""}
        />

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

      {/* Scoped Styles for Shop Page */}
      <style jsx>{`
        .category-pill {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 10px 20px;
          border-radius: 50px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--charcoal-light);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .category-pill:hover {
          border-color: var(--gold-light);
          color: var(--maroon);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201, 168, 76, 0.15);
        }
        .category-pill.active {
          background: linear-gradient(135deg, var(--maroon) 0%, var(--maroon-dark) 100%);
          color: var(--ivory);
          border-color: transparent;
          box-shadow: 0 6px 16px rgba(110, 21, 48, 0.25);
        }

        /* Sort Dropdown styles */
        .sort-dropdown-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 200px;
          appearance: none;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 8px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: var(--charcoal);
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
        }
        .sort-dropdown-btn:hover {
          border-color: var(--maroon);
        }
        
        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          padding: 8px 0;
          margin: 0;
          list-style: none;
          z-index: 100;
          animation: slideDown 0.2s ease-out forwards;
          transform-origin: top right;
        }

        .custom-dropdown-item {
          padding: 10px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: var(--charcoal);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .custom-dropdown-item:hover {
          background: var(--ivory);
          color: var(--maroon);
        }

        .custom-dropdown-item.selected {
          color: var(--maroon);
          font-weight: 500;
          background: var(--ivory-dark);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
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
