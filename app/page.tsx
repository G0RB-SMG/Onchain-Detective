"use client";
import { useState } from "react";
import { Search, Shield, Zap, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLE_ADDRESSES = [
  "0x742d35Cc6634C0532925a3b8D4C9E2b3A8c5f1e2",
  "8xKmN2bP3cQ4dR5eS6fT7gU8hV9iW0jX1kY2lZ3m4rPq",
  "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
];

const FEATURES = [
  {
    icon: Search,
    title: "Multi-Chain Intelligence",
    description: "Aggregates data from Ethereum, Solana, Bitcoin, Base, Arbitrum, Polygon, and more.",
    color: "text-gold",
    bg: "bg-gold/5 border-gold/15",
  },
  {
    icon: Brain,
    title: "LLM Detective Analysis",
    description: "AI-powered behavioral profiling classifies wallets, infers activity patterns, and surfaces connections.",
    color: "text-rouge",
    bg: "bg-rouge/5 border-rouge/15",
  },
  {
    icon: Shield,
    title: "Confidence-Rated Inferences",
    description: "Every insight is labeled with a confidence score. Never speculation presented as fact.",
    color: "text-tan",
    bg: "bg-tan/5 border-tan/15",
  },
  {
    icon: Zap,
    title: "DeFi & CEX Tracking",
    description: "Detects exchange interactions, DeFi positions, connected wallets, and fund flows.",
    color: "text-amber-400",
    bg: "bg-amber-900/10 border-amber-800/20",
  },
];

export default function HomePage() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvestigate = () => {
    const trimmed = address.trim();
    if (!trimmed) {
      setError("Please enter a wallet address");
      return;
    }
    setError("");
    setIsLoading(true);
    window.location.href = `/report/${encodeURIComponent(trimmed)}?from=search`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleInvestigate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
              <Search size={16} className="text-gold" />
            </div>
            <span className="font-mono font-bold text-foreground">
              OnChain<span className="text-gold">Detective</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="hidden sm:block">v0.2.0 · Phase 2</span>
            <span className="px-2 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs animate-pulse-gold">
              ● LIVE
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-rouge/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-gold" />
            Powered by CoinStats Wallet API + LLM Analysis
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-mono font-bold text-foreground mb-4 leading-tight">
            Investigate Any{" "}
            <span className="text-gold text-glow-gold">Crypto Wallet</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-sans mb-2 max-w-2xl mx-auto leading-relaxed">
            Paste any wallet address and get a full detective dossier — holdings, connected wallets,
            CEX flows, behavioral profiling, P&amp;L, and AI-powered inferences.
          </p>
          <p className="text-sm text-muted-foreground font-mono mb-10">
            ETH · SOL · BTC · Base · Arbitrum · Polygon · and more
          </p>

          {/* Search input */}
          <div className="w-full max-w-2xl mx-auto mb-4">
            <div
              className={`flex items-center gap-3 p-1.5 rounded-xl border transition-all ${
                error
                  ? "border-red-700/50 bg-red-900/5"
                  : "border-border hover:border-gold/40 focus-within:border-gold/60 focus-within:glow-gold bg-card"
              }`}
            >
              <div className="pl-3 text-muted-foreground shrink-0">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => { setAddress(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder="0x... or Solana address or BTC address"
                className="flex-1 bg-transparent text-foreground font-mono text-sm placeholder:text-muted-foreground/50 outline-none py-3 min-w-0"
                disabled={isLoading}
              />
              <Button
                onClick={handleInvestigate}
                disabled={isLoading}
                size="lg"
                className="shrink-0 font-mono font-bold text-sm px-5 h-11 rounded-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Opening...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Investigate
                    <ArrowRight size={16} />
                  </div>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-400 text-xs font-mono mt-2 text-left pl-2">{error}</p>
            )}
          </div>

          {/* Example addresses */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            <span className="text-xs text-muted-foreground font-mono">Try example:</span>
            {EXAMPLE_ADDRESSES.map((addr) => (
              <button
                key={addr}
                onClick={() => setAddress(addr)}
                className="text-xs font-mono text-tan/70 hover:text-tan border border-tan/20 hover:border-tan/40 px-2.5 py-1 rounded-lg bg-tan/5 hover:bg-tan/10 transition-all"
              >
                {addr.slice(0, 10)}...{addr.slice(-6)}
              </button>
            ))}
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left animate-slide-up">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={`p-4 rounded-xl border ${feature.bg} transition-all hover:scale-[1.02]`}
              >
                <div className={`flex items-center gap-2 mb-2 ${feature.color}`}>
                  <feature.icon size={16} />
                  <span className="font-mono font-semibold text-sm">{feature.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
          <span>OnChain Detective · All inferences are probabilistic, not confirmed facts</span>
          <div className="flex items-center gap-4">
            <span>Data: CoinStats API</span>
            <span>Analysis: LLM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
