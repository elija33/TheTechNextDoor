import { JSX } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import SEO from "./SEO";
import Footer from "./Footer";
import "../style/Blog.css";

function BlogPost(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="blog-page">
      <SEO
        title={`${post.title} - The Tech Next Door`}
        description={post.excerpt}
        keywords={`${post.category} Columbus OH, phone repair Columbus, The Tech Next Door`}
      />
      <div className="blog-post-container">
        <Link to="/blog" className="blog-back-link">
          ← Back to Blog
        </Link>
        <article className="blog-post">
          <div className="blog-post-header">
            <span
              className="blog-card-category"
              style={{ color: post.categoryColor, borderColor: post.categoryColor }}
            >
              {post.category}
            </span>
            <h1 className="blog-post-title">{post.title}</h1>
            <div className="blog-post-meta">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>By {post.author}</span>
            </div>
          </div>

          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="blog-post-cta">
            <h3>Ready to get your phone fixed?</h3>
            <p>We come to you — anywhere in Columbus, OH and surrounding areas.</p>
            <div className="blog-post-cta-buttons">
              <Link to="/getaquote" className="blog-cta-btn blog-cta-primary">
                Get a Free Quote
              </Link>
              <Link to="/contactus" className="blog-cta-btn blog-cta-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}

export default BlogPost;
