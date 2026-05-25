"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LogoRazorPay from "../asset/razorpay-icon.png";
import LogoMoving from "../asset/kanyakunj_moving.png";

/* ─── SVG Icons (Social & More) ────────────────────────── */
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-1 2.1-3 3c0 7.3-5 13-12 13-2.2 0-4.4-.6-6-2 3.4 0 6.6-1.5 8-4.5-5-.4-7-3.5-7-3.5 1 0 1.5.5 1.5.5-5-1.5-6-4.5-6-4.5 1.5.5 3 .5 3 .5-3.5-2.5-1-6.5-1-6.5C5 6.5 8 9 13 9c0-3.5 3-6 7-6 1.5 0 3 .5 4 1.5 1.5-.5 3-1.5 3-1.5-.5 1.5-1.5 2.5-1.5 2.5z" />
  </svg>
);

export default function Footer() {

  // const marqueeItems = [
  //   "Welcome to Our Brand New Online Store!!",
  //   "Kanyakunj!",
  //   "Shop and Get Your Free Gifts!",
  //   "✦ New Arrivals Weekly ✦",
  //   "✦ Express Delivery ✦"
  // ];

  return (
    <footer style={{ background: "var(--maroon)", color: "var(--ivory)" }}>
      {/* Top bar */}
      {/* <div className="ft-promo">
        <div className="ft-container">
          <p className="ft-promo-text">
            <Link href="/shop">Shop now</Link> & get offer% to your first order.
          </p>
        </div>
      </div> */}

      {/* Marquee Section */}
      {/* <section className="ft-marquee-section">
        <div className="ft-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <Link key={index} href="/shop" className="ft-marquee-item">
              {item}
            </Link>
          ))}
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <Link key={`double-${index}`} href="/shop" className="ft-marquee-item">
              {item}
            </Link>
          ))}
        </div>
      </section> */}

      {/* Main Footer Section */}
      <section className="ft-main">
        <div className="ft-container">
          <div className="ft-grid">
            {/* Column 1: About Us */}
            <div>
              <h6 className="ft-col-title">About Us</h6>
              <ul className="ft-list">
                <li><Link href="/our-story" className="ft-link">Our Story</Link></li>
                <li><Link href="/career" className="ft-link">Career</Link></li>
                <li><Link href="/size-guide" className="ft-link">Size Guide</Link></li>
                <li><Link href="/contact" className="ft-link">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 2: Customer Support */}
            <div>
              <h6 className="ft-col-title">Customer Support</h6>
              <ul className="ft-list">
                <li><Link href="/privacy" className="ft-link">Privacy Policy</Link></li>
                <li><Link href="/terms" className="ft-link">Terms and Conditions</Link></li>
                <li><Link href="/returns" className="ft-link">Cancellation & Refund Policy</Link></li>
                <li><Link href="/blog" className="ft-link">Our Blogs</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Information */}
            <div>
              <h6 className="ft-col-title">Contact Information</h6>
              <ul className="ft-list">
                <li>
                  <a href="tel:06290101921" className="ft-link">+91-6290101921</a>
                </li>
                <li>
                  <a href="mailto:info@kanyakunj.com" className="ft-link">info@kanyakunj.com</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Brand & Visuals */}
            <div className="ft-brand-col">
              <img
                src="https://kanyakunj.com/wp-content/uploads/2022/11/Untitled-design-5.png"
                alt="Kanyakunj Logo"
                className="ft-logo"
              />
              <div className="elementor-widget-container">
                <div className="wdt-effect-marquee-wrapper" style={{ position: "absolute", width: "200px", height: "200px", left: "-868.987px" }}>
                  <img src={LogoMoving.src} alt="Kanyakunj" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Social & Payments */}
          <div className="ft-bottom">
            <div className="ft-socials">
              <a href="#" className="ft-social-icon"><IconFacebook /></a>
              <a href="#" className="ft-social-icon"><IconTwitter /></a>
              <a href="#" className="ft-social-icon"><IconInstagram /></a>
            </div>

            <div className="ft-payments">
              {/* <img src="https://kanyakunj.com/wp-content/uploads/2022/11/payment-1.png" alt="Visa" className="ft-payment-img" />
              <img src="https://kanyakunj.com/wp-content/uploads/2022/11/payment-2.png" alt="Mastercard" className="ft-payment-img" />
              <img src="https://kanyakunj.com/wp-content/uploads/2022/11/1.jpg" alt="UPI" className="ft-payment-img" />
              <img src="https://kanyakunj.com/wp-content/uploads/2022/11/3.jpg" alt="Razorpay" className="ft-payment-img" />
              <img src={LogoRazorPay.src} alt="Razorpay" className="ft-payment-img" /> */}
              {/* Copyright */}
              <div className="ft-right-copyright">
                <p>Copyright © 2025 <Link href="/">Kanyakunj</Link></p>
              </div>
            </div>
          </div>
          {/* Copyright */}
          {/* <div className="ft-copyright">
            <p>Copyright © 2025 <Link href="/">Kanyakunj.com</Link></p>
          </div> */}
        </div>
      </section>
    </footer >
  );
}
