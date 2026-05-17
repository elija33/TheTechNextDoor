import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "./app.css";
import { CartProvider } from "@/context/CartContext";
import SiteShell from "@/components/SiteShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thetechnextdoors.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-ZMFDMFSPSX";

const DEFAULT_TITLE =
  "TheTechNextDoor | Professional Phone Repair Services in Columbus, Ohio";
const DEFAULT_DESCRIPTION =
  "Cracked screen? Dead battery? The Tech Next Door comes to your home or office in Columbus, OH and nearby areas. Same-day iPhone & phone repair. Call (614) 418-6756.";
const DEFAULT_KEYWORDS = [
  "phone repair Columbus Ohio",
  "screen repair",
  "battery replacement",
  "iPhone repair",
  "charging port repair",
  "phone fix",
  "mobile repair Columbus",
  "We come to you",
  "mobile phone repair service",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | TheTechNextDoor",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: "TheTechNextDoor" }],
  applicationName: "TheTechNextDoor",
  alternates: { canonical: "/" },
  verification: {
    google: "googled736d5e4f3f6277d",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true },
  appleWebApp: {
    capable: true,
    title: "TheTechNextDoor",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteName: "TheTechNextDoor",
    locale: "en_US",
    images: [
      { url: "/og-image.png", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.png"],
  },
  other: {
    "geo.region": "US-OH",
    "geo.placename": "Columbus, Ohio",
    "geo.position": "39.9612;-82.9988",
    ICBM: "39.9612, -82.9988",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-TileImage": "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
};

// LocalBusiness schema. NOTE: aggregateRating intentionally omitted
// until we have real reviews to report — fake review counts are a
// Google policy violation and can cause manual penalties.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://thetechnextdoors.com",
  name: "TheTechNextDoor",
  description:
    "Fast and affordable phone repair services in Columbus, Ohio. Screen repair, battery replacement, and more. Mobile service - we come to you and fix your phone in about 1 hour.",
  url: "https://thetechnextdoors.com",
  telephone: "+1-614-418-6756",
  email: "tthetechnextdoors@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Columbus",
    addressRegion: "OH",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "39.9612",
    longitude: "-82.9988",
  },
  areaServed: {
    "@type": "City",
    name: "Columbus",
    sameAs: "https://en.wikipedia.org/wiki/Columbus,_Ohio",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  priceRange: "$$",
  paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
  currenciesAccepted: "USD",
  image: "https://thetechnextdoors.com/logo.png",
  logo: "https://thetechnextdoors.com/logo.png",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "iPhone Repair Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Screen Repair",
          description: "Fix cracked or broken screens for all iPhone models.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Battery Replacement",
          description: "Replace old or faulty batteries to restore battery life.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Charging Port Repair",
          description: "Repair or replace faulty charging ports.",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {/* Google Sign-In script (loaded for admin pages) */}
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />

        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
