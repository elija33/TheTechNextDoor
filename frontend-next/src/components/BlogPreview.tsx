import { JSX } from "react";
import Link from "next/link";
import { blogPosts } from "../data/blogPosts";
import "../style/Blog.css";

const CATEGORY_EMOJI: Record<string, string> = {
  "Screen Repair": "📱",
  "Tips & Advice": "💡",
  "Maintenance": "🔋",
  "Water Damage": "💧",
  "Senior Tech": "👴",
};

function BlogPreview(): JSX.Element {
  const recent = blogPosts.slice(0, 3);

  return (
    <section className="blog-preview-section">
      <div className="blog-preview-header">
        <h2 className="blog-preview-title">From Our Blog</h2>
        <p className="blog-preview-subtitle">
          Tips, guides, and advice from your local repair experts
        </p>
      </div>
      <div className="blog-preview-grid">
        {recent.map((post) => (
          <Link href={`/blog/${post.slug}`} className="blog-preview-card" key={post.slug}>
            <div
              className="blog-preview-card-top"
              style={{
                background: `linear-gradient(135deg, ${post.categoryColor}18, ${post.categoryColor}44)`,
              }}
            >
              <span className="blog-preview-emoji">
                {CATEGORY_EMOJI[post.category] ?? "📰"}
              </span>
              <span
                className="blog-preview-category"
                style={{ backgroundColor: post.categoryColor }}
              >
                {post.category}
              </span>
            </div>
            <div className="blog-preview-card-body">
              <h3 className="blog-preview-card-title">{post.title}</h3>
              <p className="blog-preview-card-excerpt">{post.excerpt}</p>
              <div className="blog-preview-card-footer">
                <span className="blog-preview-date">{post.date}</span>
                <span className="blog-preview-read-more">Read More →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="blog-preview-view-all">
        <Link href="/blog" className="blog-view-all-btn">
          View All Posts
        </Link>
      </div>
    </section>
  );
}

export default BlogPreview;
