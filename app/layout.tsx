import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "OrderFlow AI — Take Orders While You Sleep",
  description:
    "The AI voice agent that answers calls, upsells naturally, and delivers orders to your kitchen — 24/7. No app downloads. No new phone number. Live in 30 seconds.",
  keywords: [
    "AI voice ordering",
    "restaurant phone system",
    "AI phone agent",
    "restaurant automation",
    "voice AI",
    "phone ordering",
    "restaurant technology",
    "kitchen display",
    "order management",
  ],
  authors: [{ name: "OrderFlow AI", url: "https://82b54aca.orderflow-ai.pages.dev" }],
  creator: "OrderFlow AI",
  publisher: "OrderFlow AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "OrderFlow AI — Voice Ordering for Restaurants",
    description: "AI-powered voice ordering. Never miss a phone order again. 24/7, natural conversation, smart upselling.",
    url: "https://82b54aca.orderflow-ai.pages.dev",
    siteName: "OrderFlow AI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OrderFlow AI — Take Orders While You Sleep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OrderFlow AI — Voice Ordering for Restaurants",
    description: "AI-powered voice ordering. Never miss a phone order again.",
    images: ["/og-image.png"],
    creator: "@orderflowai",
  },
  alternates: {
    canonical: "https://82b54aca.orderflow-ai.pages.dev",
  },
  metadataBase: new URL("https://82b54aca.orderflow-ai.pages.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="OrderFlow" />
        {/* General Sans removed — Manrope + Noto Serif cover all needs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://82b54aca.orderflow-ai.pages.dev/#organization",
                  name: "OrderFlow AI",
                  url: "https://82b54aca.orderflow-ai.pages.dev",
                  description: "AI voice agent for restaurant phone ordering",
                  telephone: "+1-770-525-5393",
                  foundingLocation: { "@type": "Place", name: "Atlanta, GA" },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://82b54aca.orderflow-ai.pages.dev/#website",
                  url: "https://82b54aca.orderflow-ai.pages.dev",
                  name: "OrderFlow AI",
                  publisher: { "@id": "https://82b54aca.orderflow-ai.pages.dev/#organization" },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
