"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Share2, Search, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportProvider } from "@/lib/report-context";
import { WalletReport } from "@/lib/report-types";
import { SAMPLE_REPORT } from "@/lib/sample-data";
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
  const fromSearch = searchParams.get("from") === "search";

  const [isLoading, setIsLoading] = useState(fromSearch);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reportDate, setReportDate] = useState("2026-06-01");
  const [report, setReport] = useState<WalletReport | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setReportDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Fetch real data from the API route
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/wallet/${encodeURIComponent(address)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: WalletReport = await res.json();
        setReport(data);
      } catch (err) {
        console.error("[ReportPage] fetch error:", err);
        setFetchError("Failed to fetch wallet data. Showing sample data.");
        setReport({ ...SAMPLE_REPORT, address });
      }
    };
    load();
  }, [address]);

  // Loading animation
  useEffect(() => {
    if (!fromSearch) return;
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

  // Show loading animation (comes from homepage search)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-sm w-full">
          {/* Animated scanner */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="w-24 h-24 rounded-full border-2 border-gold/20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-gold/30 flex items-center justify-center">
                <Search size={28} className="text-gold animate-pulse-gold" />
              </div>
            </div>
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin"
              style={{ animationDuration: "1.2s" }}
            />
            <div
              className="absolute inset-2 rounded-full border border-transparent border-t-gold/50 animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            />
          </div>

          <h2 className="font-mono font-bold text-cream text-lg mb-2">Investigating...</h2>
          <p className="font-mono text-xs text-muted-foreground mb-1 break-all px-4">
            {address.length > 40 ? `${address.slice(0, 20)}...${address.slice(-10)}` : address}
          </p>

          <div className="mt-8 space-y-2">
            {LOADING_STEPS.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs font-mono transition-all duration-200 ${
                  i < loadingStep ? "text-gold" :
                  i === loadingStep ? "text-cream" :
                  "text-muted-foreground/30"
                }`}
              >
                <span className="w-3 text-right shrink-0">
                  {i < loadingStep ? "✓" : i === loadingStep ? "›" : "·"}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%`,
                background: "linear-gradient(90deg, #8B3A1A, #C49A4A, #E8C87A)",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // While data is loading (and no animation), show a minimal skeleton
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-muted-foreground text-sm">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  const displayName = report.resolvedName ?? `${address.slice(0, 10)}...${address.slice(-6)}`;

  return (
    <ReportProvider report={report}>
      <div className="min-h-screen animate-fade-in">
        {/* Sticky header */}
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => router.push("/")}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 shrink-0 flex items-center justify-center">
                  <span className="text-gold text-xs font-mono font-bold">⬡</span>
                </div>
                <div className="min-w-0">
                  <div className="font-mono font-bold text-sm text-foreground truncate">{displayName}</div>
                  <div className="font-mono text-xs text-muted-foreground hidden sm:block">
                    {address.slice(0, 16)}...{address.slice(-8)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {report.isLive ? (
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-400 px-2 py-1 rounded-full border border-emerald-700/30 bg-emerald-900/20">
                  <Wifi size={11} />
                  Live Data
                </span>
              ) : (
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-tan px-2 py-1 rounded-full border border-tan/20 bg-tan/5">
                  <WifiOff size={11} />
                  Sample Report
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground text-xs font-mono"
              >
                <Share2 size={14} className="mr-1.5" />
                {copied ? "Copied!" : "Share"}
              </Button>
            </div>
          </div>
        </header>

        {/* Status banner */}
        {report.isLive ? (
          <div className="border-b border-emerald-800/20 bg-emerald-900/5 px-4 py-2">
            <div className="max-w-5xl mx-auto flex items-center gap-2">
              <Wifi size={13} className="text-emerald-400 shrink-0" />
              <p className="text-xs font-mono text-emerald-400/80">
                <span className="font-semibold">Live data</span> — fetched from CoinStats Wallet API on {reportDate}. LLM analysis (classification, inferences) coming in Phase 3.
              </p>
            </div>
          </div>
        ) : fetchError ? (
          <div className="border-b border-amber-800/20 bg-amber-900/5 px-4 py-2">
            <div className="max-w-5xl mx-auto flex items-center gap-2">
              <AlertTriangle size={13} className="text-amber-400 shrink-0" />
              <p className="text-xs font-mono text-amber-400/80">
                <span className="font-semibold">API Note:</span> {fetchError}
              </p>
            </div>
          </div>
        ) : (
          <div className="border-b border-gold/10 bg-gold/5 px-4 py-2">
            <div className="max-w-5xl mx-auto flex items-center gap-2">
              <AlertTriangle size={13} className="text-gold/60 shrink-0" />
              <p className="text-xs font-mono text-gold/60">
                <span className="font-semibold">Sample Report</span> — add your COINSTATS_API_KEY secret to enable live wallet data.
              </p>
            </div>
          </div>
        )}

        {/* Report sections */}
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
          <OverviewSection />
          <hr className="dossier-divider" />
          <ConnectedWalletsSection />
          <hr className="dossier-divider" />
          <CexFlowsSection />
          <hr className="dossier-divider" />
          <ClassificationSection />
          <hr className="dossier-divider" />
          <BuyingBehaviorSection />
          <hr className="dossier-divider" />
          <HoldingsSection />
          <hr className="dossier-divider" />
          <DefiSection />
          <hr className="dossier-divider" />
          <PnlSection />
          <hr className="dossier-divider" />
          <InferencesSection />
          <hr className="dossier-divider" />
          <TimelineSection />

          <div className="border-t border-border/50 pt-8 pb-4 text-center">
            <p className="text-xs font-mono text-muted-foreground">
              Report generated by OnChain Detective · {reportDate} ·{" "}
              All inferences are probabilistic and labeled with confidence scores
            </p>
          </div>
        </main>
      </div>
    </ReportProvider>
  );
}
