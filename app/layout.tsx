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
    <html lang="en" className={`${notoSerif.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* General Sans removed — Manrope + Noto Serif cover all needs */}
      </head>
      <body className="font-sans">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
