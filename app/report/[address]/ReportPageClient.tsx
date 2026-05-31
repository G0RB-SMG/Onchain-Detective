"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Share2, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import OverviewSection from "@/components/report/OverviewSection";
import ConnectedWalletsSection from "@/components/report/ConnectedWalletsSection";
import CexFlowsSection from "@/components/report/CexFlowsSection";
import ClassificationSection from "@/components/report/ClassificationSection";
import BuyingBehaviorSection from "@/components/report/BuyingBehaviorSection";
import PnlSection from "@/components/report/PnlSection";
import InferencesSection from "@/components/report/InferencesSection";
import HoldingsSection from "@/components/report/HoldingsSection";
import DefiSection from "@/components/report/DefiSection";
import TimelineSection from "@/components/report/TimelineSection";

const LOADING_STEPS = [
  "Resolving wallet address...",
  "Fetching on-chain data from CoinStats...",
  "Scanning connected wallets...",
  "Detecting CEX interactions...",
  "Analyzing transaction patterns...",
  "Running LLM behavioral analysis...",
  "Generating confidence scores...",
  "Compiling detective report...",
];

interface Props {
  address: string;
}

export default function ReportPageClient({ address }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only show the loading animation when arriving from the home page search
  const fromSearch = searchParams.get("from") === "search";
  const [isLoading, setIsLoading] = useState(fromSearch);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reportDate, setReportDate] = useState("2026-05-31");

  useEffect(() => {
    // Set date client-side to avoid hydration mismatch
    setReportDate(new Date().toISOString().split("T")[0]);

    if (!fromSearch) return;

    // Shortened animation: 120ms per step × 8 steps + 200ms = ~1.2s total
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= LOADING_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 200);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [fromSearch]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-sm w-full">
          {/* Animated scanner */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="w-24 h-24 rounded-full border-2 border-neon-green/20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-neon-green/30 flex items-center justify-center">
                <Search size={28} className="text-neon-green animate-pulse-neon" />
              </div>
            </div>
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-green animate-spin"
              style={{ animationDuration: "1.2s" }}
            />
            <div
              className="absolute inset-2 rounded-full border border-transparent border-t-neon-green/50 animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            />
          </div>

          <h2 className="font-mono font-bold text-white text-lg mb-2">
            Investigating...
          </h2>
          <p className="font-mono text-xs text-muted-foreground mb-1 break-all px-4">
            {address.length > 40 ? `${address.slice(0, 20)}...${address.slice(-10)}` : address}
          </p>

          {/* Step progress */}
          <div className="mt-8 space-y-2">
            {LOADING_STEPS.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs font-mono transition-all duration-200 ${
                  i < loadingStep
                    ? "text-neon-green"
                    : i === loadingStep
                    ? "text-white"
                    : "text-muted-foreground/30"
                }`}
              >
                <span className="w-3 text-right shrink-0">
                  {i < loadingStep ? "✓" : i === loadingStep ? "›" : "·"}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%`,
                background: "linear-gradient(90deg, #00ff88, #00e5ff)",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/")}
              className="text-muted-foreground hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-neon-green/20 border border-neon-green/30 shrink-0" />
              <div className="min-w-0">
                <div className="font-mono font-bold text-sm text-white truncate">
                  cryptodegen.eth
                </div>
                <div className="font-mono text-xs text-muted-foreground hidden sm:block">
                  {address.slice(0, 16)}...{address.slice(-8)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-neon-green px-2 py-1 rounded-full border border-neon-green/20 bg-neon-green/5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
              Sample Report
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-muted-foreground hover:text-white text-xs font-mono"
            >
              <Share2 size={14} className="mr-1.5" />
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>
        </div>
      </header>

      {/* Sample data notice */}
      <div className="border-b border-amber-500/20 bg-amber-500/5 px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <AlertTriangle size={13} className="text-neon-amber shrink-0" />
          <p className="text-xs font-mono text-amber-400/80">
            <span className="font-semibold">Phase 1 Preview:</span> This report uses realistic sample data. Live API integration coming in Phase 2.
          </p>
        </div>
      </div>

      {/* Report content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <OverviewSection />
        <div className="border-t border-border/50" />
        <ConnectedWalletsSection />
        <div className="border-t border-border/50" />
        <CexFlowsSection />
        <div className="border-t border-border/50" />
        <ClassificationSection />
        <div className="border-t border-border/50" />
        <BuyingBehaviorSection />
        <div className="border-t border-border/50" />
        <HoldingsSection />
        <div className="border-t border-border/50" />
        <DefiSection />
        <div className="border-t border-border/50" />
        <PnlSection />
        <div className="border-t border-border/50" />
        <InferencesSection />
        <div className="border-t border-border/50" />
        <TimelineSection />

        {/* Footer */}
        <div className="border-t border-border/50 pt-8 pb-4 text-center">
          <p className="text-xs font-mono text-muted-foreground">
            Report generated by OnChain Detective · {reportDate} ·{" "}
            All inferences are probabilistic and labeled with confidence scores
          </p>
        </div>
      </main>
    </div>
  );
}
