import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://cheaperrx.ca";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CheaperRx — Find the Cheapest Pharmacy for Your Prescription",
    template: "%s — CheaperRx",
  },
  description:
    "Compare prescription drug prices at pharmacies near you across Canada. No fuss. Just savings. Free to use — no account needed.",
  keywords: [
    "cheap prescriptions Canada",
    "drug price comparison",
    "cheapest pharmacy Calgary",
    "prescription prices Canada",
    "Canadian pharmacy prices",
    "Alberta Blue Cross pharmacy",
    "prescription drug cost",
  ],
  authors: [{ name: "CheaperRx" }],
  creator: "CheaperRx",
  publisher: "CheaperRx",
  robots: { index: true, follow: true },
  openGraph: {
    title: "CheaperRx — Canada's Simplest Prescription Price Comparator",
    description:
      "Find the cheapest pharmacy for your prescription in seconds. Compare prices across all major chains. Free, no account needed.",
    type: "website",
    locale: "en_CA",
    url: BASE_URL,
    siteName: "CheaperRx",
  },
  twitter: {
    card: "summary_large_image",
    title: "CheaperRx — Find the Cheapest Pharmacy Near You",
    description: "Compare prescription prices across Canadian pharmacies. Free and instant.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0891B2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white text-[#1a1a2e] antialiased">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
