import "./globals.css";
import React from "react";

export const metadata = {
  title: "Wallet Clear",
  description: "Analyze and clean your wallet transactions",
};

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
