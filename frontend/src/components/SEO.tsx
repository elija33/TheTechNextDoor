import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}

const DEFAULT_TITLE = "TheTechNextDoor | Professional Phone Repair Services";
const DEFAULT_DESCRIPTION = "Expert iPhone repair and senior citizen tech services in Columbus, Westerville, Dublin, Upper Arlington, Worthington, Grandview Heights, and Bexley, Ohio. Screen repair, battery replacement, and more. Fast, reliable, and affordable. We come to you.";
const DEFAULT_KEYWORDS = "phone repair Columbus Ohio, iPhone repair Columbus Ohio, iPhone repair Westerville, iPhone repair Dublin Ohio, iPhone repair Upper Arlington, iPhone repair Worthington Ohio, iPhone repair Grandview Heights, iPhone repair Bexley Ohio, screen repair, battery replacement, charging port repair, phone fix, mobile repair Columbus, senior tech service Columbus, senior citizen tech help Westerville, senior citizen tech help Dublin, senior citizen tech help Upper Arlington, senior citizen tech help Worthington, senior citizen tech help Grandview Heights, senior citizen tech help Bexley, tech support for seniors Ohio, We come to you";
const SITE_URL = "https://thetechnextdoor.com";

function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogType = "website",
  ogImage = "/og-image.png",
}: SEOProps) {
  const fullTitle = title ? `${title} | TheTechNextDoor` : DEFAULT_TITLE;
  const canonical = canonicalUrl ? `${SITE_URL}${canonicalUrl}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      <meta property="og:site_name" content="TheTechNextDoor" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="TheTechNextDoor" />
      <meta name="geo.region" content="US-OH" />
      <meta name="geo.placename" content="Columbus, Westerville, Dublin, Upper Arlington, Worthington, Grandview Heights, Bexley, Ohio" />
    </Helmet>
  );
}

export default SEO;
