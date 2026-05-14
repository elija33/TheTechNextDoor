import { JSX } from "react";
import Link from "next/link";
import { blogPosts } from "../data/blogPosts";
import SEO from "./SEO";
import Footer from "./Footer";
import "../style/Blog.css";

const CATEGORY_EMOJI: Record<string, string> = {
  "Screen Repair": "📱",
  "Tips & Advice": "💡",
  "Maintenance": "🔋",
  "Water Damage": "💧",
  "Senior Tech": "👴",
};

function Blog(): JSX.Element {
  return (
    <div className="blog-page">
      <SEO
        title="Blog - The Tech Next Door | Phone Repair Tips & Advice"
        description="Phone repair tips, pricing guides, and tech advice for Columbus, OH residents. Expert insights from The Tech Next Door."
        keywords="phone repair blog Columbus OH, iPhone repair tips, battery replacement guide, water damage phone repair Columbus"
      />
      <div className="blog-hero">
        <h1 className="blog-hero-title">From Our Blog</h1>
        <p className="blog-hero-subtitle">
          Phone repair tips, pricing guides, and tech advice for Columbus, OH
        </p>
      </div>
      <div className="blog-container">
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <div
                className="blog-card-image"
                style={{
                  background: `linear-gradient(135deg, ${post.categoryColor}18, ${post.categoryColor}38)`,
                }}
              >
                <span className="blog-card-emoji">
                  {CATEGORY_EMOJI[post.category] ?? "📰"}
                </span>
              </div>
              <div className="blog-card-body">
                <span
                  className="blog-card-category"
                  style={{ color: post.categoryColor, borderColor: post.categoryColor }}
                >
                  {post.category}
                </span>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <span className="blog-card-link">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Blog;
