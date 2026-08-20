"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import SearchModal from "./SearchModal";
import LogoDesktop from "../asset/cropped-1.png";
import LogoMid from "../asset/logo-mid.png";
import LogoMobile from "../asset/mobile-logo.png";
import WaveHandIcon from "../asset/wave-hand-1.svg";

/* ─── Navigation Data ─────────────────────────────────────────── */
const categories = [
  {
    label: "New Arrivals",
    href: "/shop?new=true",
    mega: {
      type: "simple",
      title: "Latest Collections",
      image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=600",
      links: [
        { label: "Spring Summer '25", href: "/shop?collection=ss25" },
        { label: "Red Carpet Ready", href: "/shop?collection=red-carpet" },
        { label: "Bestsellers", href: "/shop?sort=bestselling" },
        { label: "Coming Soon", href: "/coming-soon" },
      ],
    },
  },
  {
    label: "Women",
    href: "/shop?category=women",
    mega: {
      type: "columns",
      columns: [
        {
          title: "Ethnic Wear",
          links: [
            { label: "Kurtas & Tunics", href: "/shop?category=kurta" },
            { label: "Ethnic Sets", href: "/shop?category=ethnic-sets" },
            { label: "Sarees", href: "/shop?category=sarees" },
            { label: "Lehengas", href: "/shop?category=lehenga" },
            { label: "Dresses", href: "/shop?category=dresses" },
          ],
        },
        {
          title: "Fusion Wear",
          links: [
            { label: "Co-ords", href: "/shop?category=co-ord-sets" },
            { label: "Jumpsuits", href: "/shop?category=jumpsuits" },
            { label: "Tops & Shirts", href: "/shop?category=tops" },
            { label: "Trousers", href: "/shop?category=trousers" },
          ],
        },
        {
          title: "Featured",
          links: [
            { label: "The Luxury Edit", href: "/shop?edit=luxury" },
            { label: "Work Wear", href: "/shop?edit=work" },
            { label: "Evening Styles", href: "/shop?edit=evening" },
          ],
        },
      ],
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&q=80&w=600",
    },
  },
  // ─── Men (commented out — not yet active) ───────────────────
  // {
  //   label: "Men",
  //   href: "/shop?category=men",
  //   mega: {
  //     type: "columns",
  //     columns: [
  //       {
  //         title: "Apparel",
  //         links: [
  //           { label: "Kurtas", href: "/shop?category=men-kurta" },
  //           { label: "Short Kurtas", href: "/shop?category=men-short-kurta" },
  //           { label: "Waistcoats", href: "/shop?category=men-waistcoat" },
  //           { label: "Sherwanis", href: "/shop?category=men-sherwani" },
  //         ],
  //       },
  //       {
  //         title: "Accessories",
  //         links: [
  //           { label: "Safas", href: "/shop?category=men-safa" },
  //           { label: "Pocket Squares", href: "/shop?category=men-pocket-square" },
  //           { label: "Footwear", href: "/shop?category=men-shoes" },
  //         ],
  //       },
  //     ],
  //     image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
  //   },
  // },
  { label: "Sale", href: "/sale", isSale: true },
  {
    label: "About Us",
    // href: "/about",
    href: "/our-story",
    mega: {
      type: "simple",
      title: "Our Brand",
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&q=80&w=600",
      links: [
        { label: "Our Story", href: "/our-story" },
        { label: "Blog", href: "/blog" },
        { label: "Career", href: "/career" },
        { label: "Store Locator", href: "/stores" },
      ],
    },
  },
];

/* ─── SVG Icons (inline for zero-dep) ────────────────────────── */
const IconSearch = () => <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '18px' }}></i>;
const IconUser = () => <i className="fa-regular fa-user" style={{ fontSize: '18px' }}></i>;
const IconHeart = () => <i className="fa-regular fa-heart" style={{ fontSize: '18px' }}></i>;
const IconBag = () => <i className="fa-solid fa-bag-shopping" style={{ fontSize: '18px' }}></i>;
const IconMenu = () => <i className="fa-solid fa-bars" style={{ fontSize: '20px' }}></i>;
const IconX = () => <i className="fa-solid fa-xmark" style={{ fontSize: '20px' }}></i>;
const IconChevron = ({ rotated }) => (
  <i 
    className="fa-solid fa-chevron-down"
    style={{ 
      fontSize: '12px', 
      transform: rotated ? "rotate(180deg)" : "none", 
      transition: "transform 0.25s ease" 
    }}
  ></i>
);
const IconArrow = () => <i className="fa-solid fa-arrow-right" style={{ fontSize: '14px' }}></i>;
const IconPin = () => <i className="fa-solid fa-location-dot" style={{ fontSize: '16px' }}></i>;

/* ─── Megamenu ────────────────────────────────────────────────── */
function MegaMenu({ cat, onClose }) {
  if (!cat.mega) return null;
  const { mega } = cat;

  return (
    <motion.div
      className="nb-mega"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onMouseLeave={onClose}
    >
      <div className="nb-mega-inner">
        {mega.type === "columns" ? (
          <>
            <div className="nb-mega-cols">
              {mega.columns.map((col) => (
                <div key={col.title} className="nb-mega-col">
                  <h4 className="nb-mega-col-title">{col.title}</h4>
                  <ul className="nb-mega-col-list">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} className="nb-mega-link" onClick={onClose}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="nb-mega-img-wrap">
              <img src={mega.image} alt={cat.label} className="nb-mega-img" />
              <div className="nb-mega-img-overlay">
                <p className="nb-mega-img-sub">New Collection</p>
                <a href={cat.href} className="nb-mega-img-title" onClick={onClose}>Shop Now</a>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="nb-mega-simple-text">
              <h3 className="nb-mega-simple-title">{mega.title}</h3>
              <ul className="nb-mega-simple-list">
                {mega.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="nb-mega-link" onClick={onClose}>
                      <span className="nb-mega-dot" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={cat.href} className="nb-mega-cta" onClick={onClose}>
                View All Styles <IconArrow />
              </a>
            </div>
            <div className="nb-mega-simple-img-wrap">
              <img src={mega.image} alt={cat.label} className="nb-mega-img" />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef(null);

  const { user, logout, _hasHydrated } = useAuthStore();
  const isLoggedIn = _hasHydrated && !!user;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { items, openCart } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || isSearchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, isSearchOpen]);

  // Live Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchLoading(true);
      setIsSearchOpen(true);
      try {
        const res = await fetch(`/api/wc/products?search=${encodeURIComponent(searchQuery)}&per_page=12`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  return (
    <>
      {/* ── Header ── */}
      <header className="nb-header">

        {/* Promo Bar */}
        {/* <div className="nb-promo">
          <motion.span
            className="nb-promo-text"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✦ Free Shipping on orders above ₹999 &nbsp;|&nbsp; Use code <strong>KANYA10</strong> for 10% off ✦
          </motion.span>
        </div> */}

        {/* Main Header Row */}
        <div className="nb-main">
          <div className="nb-main-inner">

            {/* Mobile Left: Hamburger + Wishlist */}
            <div className="nb-mob-left">
              <button className="nb-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu" suppressHydrationWarning>
                <IconMenu />
              </button>
              <a href="/wishlist" className="nb-icon-btn nb-mob-heart" aria-label="Wishlist">
                <IconHeart />
              </a>
            </div>

            {/* Logo */}
            <a href="/" className="nb-logo">
              <picture>
                <source media="(min-width: 1024px)" srcSet={LogoDesktop.src} />
                <source media="(min-width: 768px)" srcSet={LogoMid.src} />
                <img src={LogoMobile.src} alt="Kanyakunj Logo" />
              </picture>
            </a>

            {/* Search */}
            <div className={`nb-search-wrap ${isSearchOpen ? "nb-search-focused" : ""}`}>
              <div style={{ position: "relative", flex: 1 }}>
                <span className="nb-search-icon"><IconSearch /></span>
                <input
                  id="nb-search"
                  name="search"
                  type="text"
                  className="nb-search-input"
                  placeholder="Search for Kurtas, Sarees, Lehengas…"
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                  suppressHydrationWarning
                />
                {isSearchOpen && (
                  <button
                    className="nb-search-close"
                    onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#aaa", cursor: "pointer" }}
                  >
                    <IconX />
                  </button>
                )}
              </div>
            </div>

            {/* Right Icons */}
            <div className="nb-icons">
              {/* Account Dropdown or Login Link */}
              {isLoggedIn ? (
                <div
                  className="nb-account-wrap"
                  onMouseEnter={() => setAccountOpen(true)}
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  <button className="nb-account-btn" suppressHydrationWarning>
                    <img src={WaveHandIcon.src} alt="Hi!" className="nb-wave-hand" suppressHydrationWarning />
                    <span className="nb-account-label">
                      {user.firstName || ""}
                    </span>
                    <IconChevron rotated={accountOpen} />
                  </button>
                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        className="nb-account-dropdown"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="nb-account-greeting">
                          Hello, <strong>{user.firstName}</strong>
                        </div>
                        <ul className="nb-account-list">
                          <li><a href="/account" className="nb-account-link" onClick={() => setAccountOpen(false)}>Dashboard</a></li>
                          <li><a href="/account/orders" className="nb-account-link" onClick={() => setAccountOpen(false)}>Orders</a></li>
                          <li><a href="/account/addresses" className="nb-account-link" onClick={() => setAccountOpen(false)}>Addresses</a></li>
                          <li><a href="/account/details" className="nb-account-link" onClick={() => setAccountOpen(false)}>Account Details</a></li>
                          <li>
                            <button
                              className="nb-account-link nb-account-logout"
                              onClick={() => { logout(); setAccountOpen(false); }}
                            >
                              Log Out
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="nb-account-wrap">
                  <a href="/account/login" className="nb-account-btn" aria-label="Login" suppressHydrationWarning>
                    <IconUser />
                  </a>
                </div>
              )}

              {/* Wishlist */}
              <a href="/wishlist" className="nb-icon-btn nb-desktop-heart" aria-label="Wishlist">
                <IconHeart />
              </a>

              {/* Cart */}
              <button className="nb-icon-btn nb-cart-btn" onClick={openCart} aria-label="Cart" suppressHydrationWarning>
                <IconBag />
                {mounted && totalItems > 0 && (
                  <span className="nb-cart-badge">{totalItems}</span>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Category Nav */}
        <nav className={`nb-cat-nav${mounted && scrolled ? " nb-sticky" : ""}`}>
          <div className="nb-cat-inner">

            {/* Sticky logo */}
            {mounted && scrolled && (
              <a href="/" className="nb-sticky-logo">
                <picture>
                  <source media="(min-width: 1024px)" srcSet={LogoDesktop.src} />
                  <source media="(min-width: 768px)" srcSet={LogoMid.src} />
                  <img src={LogoMobile.src} alt="Kanyakunj Logo" />
                </picture>
              </a>
            )}

            {categories.map((cat) => (
              <div
                key={cat.label}
                className="nb-cat-item"
                onMouseEnter={() => cat.mega && setActiveMega(cat.label)}
                onMouseLeave={() => setActiveMega(null)}
              >
                <a
                  href={cat.href}
                  className={`nb-cat-link${cat.isSale ? " nb-sale-link" : ""}`}
                >
                  {cat.label}
                  {cat.mega && <span className="nb-cat-chevron"><IconChevron rotated={activeMega === cat.label} /></span>}
                  <span className="nb-cat-underline" />
                </a>

                <AnimatePresence>
                  {activeMega === cat.label && cat.mega && (
                    <MegaMenu cat={cat} onClose={() => setActiveMega(null)} />
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Sticky icons */}
            {mounted && scrolled && (
              <div className="nb-sticky-icons">
                <button
                  className="nb-icon-btn"
                  aria-label="Search"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setTimeout(() => searchInputRef.current?.focus(), 400);
                  }}
                >
                  <IconSearch />
                </button>
                <a href="/wishlist" className="nb-icon-btn" aria-label="Wishlist">
                  <IconHeart />
                </a>
                <button className="nb-icon-btn nb-cart-btn" onClick={openCart} aria-label="Cart">
                  <IconBag />
                  {mounted && totalItems > 0 && <span className="nb-cart-badge">{totalItems}</span>}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Live Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <SearchModal
              results={searchResults}
              loading={isSearchLoading}
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="nb-mob-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="nb-mob-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Drawer head */}
              <div className="nb-mob-head">
                <a href="/" className="nb-logo" onClick={() => setMobileOpen(false)}>
                  <img src={LogoMobile.src} alt="Kanyakunj Logo" className="h-9 w-auto" />
                </a>
                <button className="nb-mob-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <IconX />
                </button>
              </div>

              {/* Category Links */}
              <ul className="nb-mob-list">
                {categories.map((cat) => (
                  <li key={cat.label} className="nb-mob-item">
                    {cat.mega ? (
                      <>
                        <button
                          className="nb-mob-link nb-mob-toggle"
                          onClick={() => setMobileExpanded(mobileExpanded === cat.label ? null : cat.label)}
                        >
                          <span style={{ color: cat.isSale ? "var(--rose)" : undefined }}>{cat.label}</span>
                          <IconChevron rotated={mobileExpanded === cat.label} />
                        </button>

                        <AnimatePresence>
                          {mobileExpanded === cat.label && (
                            <motion.ul
                              className="nb-mob-sub"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              {(cat.mega.columns
                                ? cat.mega.columns.flatMap((c) => c.links)
                                : cat.mega.links
                              ).map((link) => (
                                <li key={link.label}>
                                  <a
                                    href={link.href}
                                    className="nb-mob-sub-link"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    {link.label}
                                  </a>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <a
                        href={cat.href}
                        className="nb-mob-link"
                        style={{ color: cat.isSale ? "var(--rose)" : undefined }}
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              {/* Drawer footer links */}
              <div className="nb-mob-footer">
                <a href="/account" className="nb-mob-footer-link" onClick={() => setMobileOpen(false)}>
                  <IconUser /> My Account
                </a>
                <a href="/wishlist" className="nb-mob-footer-link" onClick={() => setMobileOpen(false)}>
                  <IconHeart /> Wishlist
                </a>
                <a href="/stores" className="nb-mob-footer-link" onClick={() => setMobileOpen(false)}>
                  <IconPin /> Store Locator
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
