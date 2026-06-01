import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, chars = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

export function formatCurrency(value: number, decimals = 2): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(decimals)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getChainColor(chain: string): string {
  const colors: Record<string, string> = {
    ethereum: "#627EEA",
    eth: "#627EEA",
    solana: "#9945FF",
    sol: "#9945FF",
    bitcoin: "#F7931A",
    btc: "#F7931A",
    polygon: "#8247E5",
    matic: "#8247E5",
    arbitrum: "#28A0F0",
    base: "#0052FF",
    optimism: "#FF0420",
    avalanche: "#E84142",
    avax: "#E84142",
    bsc: "#F3BA2F",
    multiple: "#C49A4A",
  };
  return colors[chain.toLowerCase()] || "#C8B89A";
}

export function classifyWallet(label: string): {
  color: string;
  bg: string;
  border: string;
} {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    Trader: { color: "text-tan", bg: "bg-tan/10", border: "border-tan/30" },
    "Long-Term Investor": { color: "text-gold", bg: "bg-gold/10", border: "border-gold/30" },
    "NFT Flipper": { color: "text-rouge", bg: "bg-rouge/10", border: "border-rouge/30" },
    "DeFi Power User": { color: "text-amber-400", bg: "bg-amber-900/10", border: "border-amber-800/30" },
    "Memecoin Degen": { color: "text-rouge", bg: "bg-rouge/10", border: "border-rouge/30" },
    Whale: { color: "text-tan", bg: "bg-tan/10", border: "border-tan/30" },
  };
  return map[label] || { color: "text-gold", bg: "bg-gold/10", border: "border-gold/30" };
}
