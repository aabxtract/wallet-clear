import "./globals.css";
import React from "react";
import type { Metadata, Viewport } from "next";

// ---------------------------------------------------------------------------
// Metadata & OG tags
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "WalletClear - Understand Your Crypto Wallet",
  description:
    "See your transaction history in plain English. Detects spam and address poisoning automatically.",
  keywords: [
    "crypto",
    "wallet",
    "blockchain",
    "ethereum",
    "transactions",
    "address poisoning",
    "spam detection",
  ],
  openGraph: {
    title: "WalletClear - Understand Your Crypto Wallet",
    description:
      "See your transaction history in plain English. Detects spam and address poisoning automatically.",
    siteName: "WalletClear",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WalletClear - Understand Your Crypto Wallet",
    description:
      "See your transaction history in plain English. Detects spam and address poisoning automatically.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f0f",
};

// ---------------------------------------------------------------------------
// Root layout (server component)
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f0f] text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
