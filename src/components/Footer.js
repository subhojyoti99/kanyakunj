"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LogoRazorPay from "../asset/razorpay-icon.png";
import LogoMoving from "../asset/kanyakunj_moving.png";

/* ─── SVG Icons (Social & More) ────────────────────────── */
const IconInstagram = () => <i className="fa-brands fa-instagram" style={{ fontSize: '18px' }}></i>;
const IconFacebook = () => <i className="fa-brands fa-facebook-f" style={{ fontSize: '18px' }}></i>;
const IconTwitter = () => <i className="fa-brands fa-twitter" style={{ fontSize: '18px' }}></i>;

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
