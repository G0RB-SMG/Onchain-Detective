import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnChain Detective — Wallet Intelligence Platform",
  description:
    "Turn any crypto wallet address into a full detective investigation report. Track holdings, infer behavior, expose DeFi positions, and more.",
  keywords: ["crypto", "wallet", "blockchain", "detective", "analysis", "DeFi", "on-chain"],
  openGraph: {
    title: "OnChain Detective",
    description: "Full on-chain intelligence for any wallet address",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
