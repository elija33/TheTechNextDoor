/**
 * In the App Router we use the `generateMetadata` export on each page
 * (or `metadata` for static pages) instead of a runtime <Helmet>.
 *
 * This component is kept as a no-op so existing imports keep compiling,
 * but emits nothing. See `src/app/**` page files for the real metadata.
 */
function SEO(_props: {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}) {
  return null;
}

export default SEO;
