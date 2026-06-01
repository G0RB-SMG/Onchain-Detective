"use client";
import { Link2, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "./SectionHeader";
import { formatCurrency, getChainColor } from "@/lib/utils";
import { useReport } from "@/lib/report-context";
import { useState } from "react";

export default function ConnectedWalletsSection() {
  const { connectedWallets } = useReport();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!connectedWallets || connectedWallets.length === 0) {
    return (
      <section>
        <SectionHeader
          icon={Link2}
          title="Connected Wallets"
          subtitle="Wallets inferred to be controlled by the same entity via transaction pattern analysis"
          iconColor="text-tan"
        />
        <div className="p-6 rounded-xl border border-border bg-card text-center text-muted-foreground font-mono text-sm">
          Connected wallet analysis requires LLM processing — available in Phase 3.
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        icon={Link2}
        title="Connected Wallets"
        subtitle="Wallets inferred to be controlled by the same entity via transaction pattern analysis"
        iconColor="text-tan"
      />

      <div className="space-y-3">
        {connectedWallets.map((wallet, i) => (
          <Card key={i} className="border-tan/20 hover:border-tan/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-mono font-semibold border"
                    style={{
                      color: getChainColor(wallet.chain),
                      borderColor: `${getChainColor(wallet.chain)}40`,
                      backgroundColor: `${getChainColor(wallet.chain)}15`,
                    }}
                  >
                    {wallet.chain.toUpperCase()}
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground">{wallet.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">Confidence</span>
                  <span className={`text-sm font-mono font-bold ${
                    wallet.confidence >= 80 ? "text-gold" :
                    wallet.confidence >= 60 ? "text-amber-400" :
                    "text-muted-foreground"
                  }`}>
                    {wallet.confidence}%
                  </span>
                </div>
              </div>

              <div className="h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${wallet.confidence}%`,
                    background: wallet.confidence >= 80
                      ? "linear-gradient(90deg, #C49A4A, #E8C87A)"
                      : wallet.confidence >= 60
                      ? "linear-gradient(90deg, #d97706, #f97316)"
                      : "linear-gradient(90deg, #4A3728, #7A6A55)",
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {wallet.address}
                  </code>
                  <button
                    onClick={() => handleCopy(wallet.full)}
                    className="text-muted-foreground hover:text-tan transition-colors"
                  >
                    {copied === wallet.full ? (
                      <span className="text-xs text-gold">✓</span>
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
                <span className="text-sm font-mono font-semibold text-foreground">
                  {formatCurrency(wallet.balanceUsd)}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Badge variant="tan" className="text-xs shrink-0">{wallet.relation}</Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">{wallet.note}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground font-mono px-1">
        ⚠ Connected wallet detection is probabilistic. These are inferences, not confirmations.
      </p>
    </section>
  );
}
