import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}

const DEFAULT_TITLE =
  "TheTechNextDoor | Professional Mobile Phone Repair Services";
const DEFAULT_DESCRIPTION =
  "Mobile Phone and cell phone repair in Columbus, Ohio and nearby areas including Westerville, Dublin, Upper Arlington, Worthington, Grandview Heights, and Bexley. The Tech Next Door offers on-site repair, bringing fast, same-day service to your home or office—no store visit needed. Services include screen repair, battery replacement, charging port repair, and water damage recovery for most devices. We also provide in-home tech support for seniors, including setup and troubleshooting. Reliable, affordable service with transparent pricing. Schedule today at thetechnextdoors.com.";
const DEFAULT_KEYWORDS =
  "Mobile phone repair Columbus Ohio, iPhone repair Columbus Ohio, iPhone repair Westerville, iPhone repair Dublin Ohio, iPhone repair Upper Arlington, iPhone repair Worthington Ohio, iPhone repair Grandview Heights, iPhone repair Bexley Ohio, screen repair, battery replacement, charging port repair, phone fix, mobile repair Columbus, senior tech service Columbus, senior citizen tech help Westerville, senior citizen tech help Dublin, senior citizen tech help Upper Arlington, senior citizen tech help Worthington, senior citizen tech help Grandview Heights, senior citizen tech help Bexley, tech support for seniors Ohio, We come to you";
const SITE_URL = "https://thetechnextdoors.com";

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
      <meta
        name="geo.placename"
        content="Columbus, Westerville, Dublin, Upper Arlington, Worthington, Grandview Heights, Bexley, Ohio"
      />
    </Helmet>
  );
}

export default SEO;
