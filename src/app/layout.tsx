import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "./providers/CartProvider";
// Suppress TypeScript error for side-effect CSS import when no CSS module types are declared
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  // ── TITLE ────────────────────────────────────────────────────────────────
  // This is the blue link text Google shows. Keep it under 60 characters.
  title: {
    default: "Southern Jerks | Best Fried Chicken in Houston, TX",
    template: "%s | Southern Jerks Houston",
    // %s = page name, so Menu page becomes: "Menu | Southern Jerks Houston"
  },
 
  // ── DESCRIPTION ──────────────────────────────────────────────────────────
  // This is the gray text under the blue link. Keep it under 160 characters.
  // This is what currently says "SkyTab Restaurant." — MUST fix this.
  description:
    "Southern Jerks serves Houston's best crispy fried chicken at 2950 Gears Rd. Open Tues–Fri 11am–9pm, Sat 12–8pm, Sun 11am–4pm. Order online or visit us today!",
 
  // ── KEYWORDS ─────────────────────────────────────────────────────────────
  // Google doesn't rank on keywords alone anymore but it still helps signal
  keywords: [
    "fried chicken Houston",
    "best fried chicken Houston TX",
    "Southern Jerks Houston",
    "Houston fried chicken restaurant",
    "crispy fried chicken Houston",
    "Gears Road Houston restaurant",
    "Houston TX food",
    "southern food Houston",
    "chicken wings Houston",
    "Black-owned restaurant Houston",
  ],
 
  // ── CANONICAL URL ────────────────────────────────────────────────────────
  // Tells Google the official URL of your site (prevents duplicate content)
  metadataBase: new URL("https://southernjerkshtx.com"),
  alternates: {
    canonical: "/",
  },
 
  // ── OPEN GRAPH (Facebook, WhatsApp, iMessage previews) ───────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://southernjerkshtx.com",
    siteName: "Southern Jerks",
    title: "Southern Jerks | Best Fried Chicken in Houston, TX",
    description:
      "Houston's crispiest fried chicken at 2950 Gears Rd. Tues–Fri 11am–9pm, Sat 12–8pm, Sun 11am–4pm. Don't be a jerk, it's just chicken! 🐔",
    images: [
      {
        url: "/og-image.jpg", // PUT A GOOD FOOD PHOTO HERE (1200x630px)
        width: 1200,
        height: 630,
        alt: "Southern Jerks crispy fried chicken Houston TX",
      },
    ],
  },
 
  // ── TWITTER / X CARD ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Southern Jerks | Best Fried Chicken in Houston, TX",
    description:
      "Houston's crispiest fried chicken at 2950 Gears Rd. Open now! 🐔",
    images: ["/og-image.jpg"],
  },
 
  // ── ROBOTS ───────────────────────────────────────────────────────────────
  // Tells Google: index this page AND follow all links on it
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
 
  // ── VERIFICATION ─────────────────────────────────────────────────────────
  // Paste your Google Search Console verification code here once you set it up
  // verification: {
  //   google: "paste-your-verification-code-here",
  // },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Southern Jerks",
              description:
                "Houston's best crispy fried chicken restaurant. Famous for wings, tenders, and southern-style comfort food.",
              url: "https://southernjerkshtx.com",
              telephone: "(346) 242-0328", 
              email: "Contact@southernjerkshtx.com",
              image: "https://southernjerkshtx.com/og-image.jpg",
              logo: "https://southernjerkshtx.com/logo.png",
              priceRange: "$$",
              servesCuisine: ["Southern", "Fried Chicken", "American"],
              address: {
                "@type": "PostalAddress",
                streetAddress: "2950 Gears Rd",
                addressLocality: "Houston",
                addressRegion: "TX",
                postalCode: "77067", // confirm this zip
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 29.9511, // confirm exact coordinates
                longitude: -95.4494,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "11:00",
                  closes: "21:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "12:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Sunday",
                  opens: "11:00",
                  closes: "16:00",
                },
              ],
              sameAs: [
                "https://www.instagram.com/southernjerkshtx/",
                "https://www.facebook.com/p/Southern-Jerks-100076329252325/",
                "https://www.tiktok.com/@southernjerkshtx",
              ],
            }),
          }}
        />
        {/* HERE Maps */}
        <script src="https://js.api.here.com/v3/3.1/mapsjs-core.js" defer />
        <script src="https://js.api.here.com/v3/3.1/mapsjs-service.js" defer />
        <script src="https://js.api.here.com/v3/3.1/mapsjs-ui.js" defer />
        <script
          src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"
          defer
        />
        <link
          rel="stylesheet"
          href="https://js.api.here.com/v3/3.1/mapsjs-ui.css"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
