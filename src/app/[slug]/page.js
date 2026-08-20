import { notFound } from "next/navigation";
import { blogPosts } from "../blog/page";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await getPost(slug);
  
  if (!post) {
    const localPost = blogPosts.find(p => p.slug === slug);
    if (!localPost) return { title: "Post Not Found" };
    return { title: `${localPost.title} – Kanyakunj` };
  }

  return {
    title: `${post.title.rendered} – Kanyakunj`,
    description: post.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim(),
  };
}

async function getPost(slug) {
  try {
    const res = await fetch(`https://kanyakunj.com/wp-json/wp/v2/posts?slug=${slug}&_embed=1`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error("Error fetching WP post:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const wpPost = await getPost(slug);
  const localPost = blogPosts.find(p => p.slug === slug);

  if (!wpPost && !localPost) {
    notFound();
  }

  // If we have WP post, render it, otherwise use local dummy data
  const title = wpPost ? wpPost.title.rendered : localPost.title;
  const content = wpPost ? wpPost.content.rendered : `
    <p>This is a placeholder for the full article content. ${localPost.excerpt}</p>
    <h2>Understanding the Basics</h2>
    <p>When it comes to timeless fashion, the foundation lies in the quality of materials and the thoughtfulness of design. At Kanyakunj, we believe in preserving tradition while embracing modern comfort.</p>
    <figure>
      <img src="${localPost.image}" alt="${title}" style="width: 100%; border-radius: 4px; margin: 24px 0;" />
      <figcaption style="font-size: 13px; color: var(--warm-gray); text-align: center;">${title}</figcaption>
    </figure>
    <h2>Styling for Everyday Elegance</h2>
    <p>The beauty of ethnic wear is its versatility. You can effortlessly transition from a daytime event to an evening gathering with just a change of accessories.</p>
    <ul>
      <li><strong>Accessorize wisely:</strong> A statement necklace or oxidized earrings can elevate a simple kurti.</li>
      <li><strong>Mix and match:</strong> Pair your favorite ethnic tops with contemporary bottoms like palazzos or even denim for an Indo-Western fusion.</li>
      <li><strong>Comfort is key:</strong> Choose breathable fabrics like cotton and rayon for all-day comfort without compromising on style.</li>
    </ul>
    <p>Explore our latest collection and discover pieces that resonate with your personal style journey.</p>
  `;
  
  const date = wpPost ? new Date(wpPost.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : localPost.date;
  const category = localPost?.category || "Style Guide";
  const readTime = localPost?.readTime || "5 min read";
  const image = wpPost?._embedded?.['wp:featuredmedia']?.[0]?.source_url || localPost?.image || "https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&q=80&w=800";

  return (
    <div>
      {/* Article Header */}
      <div style={{ background: "var(--ivory-dark)", padding: "80px 24px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 16 }}>
          {category}
        </span>
        <h1 
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, color: "var(--maroon)", margin: "0 auto 20px", lineHeight: 1.2, maxWidth: 800 }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>{date}</span>
          <span style={{ width: 1, height: 12, background: "var(--border)" }} />
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>{readTime}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div style={{ maxWidth: 1000, margin: "-40px auto 40px", padding: "0 24px", position: "relative", zIndex: 2 }}>
        <div style={{ paddingTop: "56.25%", position: "relative", borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
          <img src={image} alt="Featured" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Article Content */}
      <div style={{ maxWidth: 720, margin: "0 auto 80px", padding: "0 24px" }} className="blog-content">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Global styles for WP Content */}
      <style dangerouslySetInnerHTML={{__html: `
        .blog-content {
          font-family: 'Jost', sans-serif;
          color: var(--charcoal-light);
          line-height: 1.8;
          font-size: 16px;
          font-weight: 300;
        }
        .blog-content h2, .blog-content h3 {
          font-family: 'Cormorant Garamond', serif;
          color: var(--maroon);
          font-weight: 400;
          margin: 48px 0 24px;
          line-height: 1.3;
        }
        .blog-content h2 { font-size: 32px; }
        .blog-content h3 { font-size: 24px; }
        .blog-content p { margin-bottom: 24px; }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 32px 0;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 24px;
          padding-left: 24px;
        }
        .blog-content li { margin-bottom: 12px; }
        .blog-content a {
          color: var(--gold);
          text-decoration: none;
          font-weight: 500;
        }
        .blog-content a:hover { text-decoration: underline; }
        .blog-content strong {
          color: var(--charcoal);
          font-weight: 500;
        }
        .blog-content blockquote {
          border-left: 3px solid var(--gold);
          padding-left: 24px;
          margin: 40px 0;
          font-style: italic;
          color: var(--charcoal);
          font-size: 20px;
        }
      `}} />
    </div>
  );
}
