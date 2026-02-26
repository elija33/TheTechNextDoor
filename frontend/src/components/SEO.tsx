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
const DEFAULT_DESCRIPTION = "Expert phone repair services in Columbus, Ohio. Screen repair, battery replacement, and more. Fast, reliable, and affordable repairs for all iPhone models. We come to you.";
const DEFAULT_KEYWORDS = "phone repair Columbus Ohio, screen repair, battery replacement, iPhone repair, charging port repair, phone fix, mobile repair Columbus, We come to you";
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
      <meta name="geo.placename" content="Columbus, Ohio" />
    </Helmet>
  );
}

export default SEO;
