"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Hotspot = ({ top, left, title, description, href }) => {
  return (
    <div className="hs-item" style={{ top: `${top}%`, left: `${left}%` }}>
      <Link href={href} className="hs-trigger">
        <span className="hs-icon">+</span>
      </Link>
      <div className="hs-label">
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default function EleganceSection() {
  return (
    <section className="el-section">
      <div className="el-container">
        {/* Left: Content */}
        <div className="el-content">
          <motion.span 
            className="el-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Kanyakunj
          </motion.span>
          
          <motion.h3 
            className="el-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Timeless Ethnic Elegance <br /> for Every Woman
          </motion.h3>
          
          <motion.div 
            className="el-description"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p>
              Step into a world of grace and tradition with our handpicked collection 
              of dupattas, short kurtas, and kurtas, crafted exclusively for women 
              who love to blend style with culture.
            </p>
            <p style={{ marginTop: 20 }}>
              Discover colors, patterns, and textures that bring out the best in 
              your personality. Whether you’re looking for a casual ethnic look 
              or a statement outfit, we’ve got the perfect design waiting for you.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/shop" className="btn-gold">
              Shop Now
            </Link>
          </motion.div>
        </div>

        {/* Right: Image with Hotspots */}
        <div className="el-image-column">
          <img 
            src="https://kanyakunj.com/wp-content/uploads/2025/09/Untitled-1000-x-1507-px.jpg" 
            alt="Kanyakunj Collection" 
            className="el-main-img"
          />
          
          {/* Hotspots based on reference image positions */}
          <Hotspot 
            top={28} 
            left={76} 
            title="Dupatta" 
            description="Elegant, versatile drape to complete your ethnic look."
            href="/shop?category=dupatta"
          />
          <Hotspot 
            top={54} 
            left={55} 
            title="Ethnic Set" 
            description="Stylish coordinated outfit blending tradition with modern comfort."
            href="/shop?category=ethnic-set"
          />
          <Hotspot 
            top={68} 
            left={82} 
            title="Short Kurti" 
            description="Trendy, versatile wear for a chic everyday ethnic look."
            href="/shop?category=short-kurti"
          />
          <Hotspot 
            top={78} 
            left={42} 
            title="Kurti" 
            description="Comfortable and stylish attire for effortless everyday elegance."
            href="/shop?category=kurti"
          />
        </div>
      </div>
    </section>
  );
}
