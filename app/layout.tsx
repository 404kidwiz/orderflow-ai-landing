import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OrderFlow AI — Take Orders While You Sleep",
  description:
    "The AI voice agent that answers calls, up sells, and delivers — 24/7. No app downloads. No new phone number. Just more orders.",
  openGraph: {
    title: "OrderFlow AI — Voice Ordering for Restaurants",
    description: "AI-powered voice ordering. Never miss a phone order again.",
    url: "https://enchanting-sable-bd0c5c.netlify.app",
    siteName: "OrderFlow AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
