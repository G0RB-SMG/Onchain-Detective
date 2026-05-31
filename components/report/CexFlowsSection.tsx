"use client";
import { ArrowDownLeft, ArrowUpRight, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "./SectionHeader";
import { formatCurrency } from "@/lib/utils";
import { SAMPLE_REPORT } from "@/lib/sample-data";

const CEX_LOGOS: Record<string, string> = {
  Coinbase: "🔵",
  Binance: "🟡",
  Kraken: "🟣",
  Kucoin: "🟢",
  OKX: "⬛",
  Bybit: "🟠",
};

export default function CexFlowsSection() {
  const { cexFlows } = SAMPLE_REPORT;

  const totalInbound = cexFlows
    .filter((f) => f.direction === "inbound")
    .reduce((s, f) => s + f.estimatedVolume, 0);
  const totalOutbound = cexFlows
    .filter((f) => f.direction === "outbound")
    .reduce((s, f) => s + f.estimatedVolume, 0);

  return (
    <section>
      <SectionHeader
        icon={Building2}
        title="CEX Onboarding / Offboarding"
        subtitle="Detected interactions with centralized exchanges based on address clustering"
        iconColor="text-neon-amber"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownLeft size={14} className="text-neon-green" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Total Inflows
              </span>
            </div>
            <div className="text-xl font-mono font-bold text-neon-green">
              {formatCurrency(totalInbound)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">from CEX withdrawals</div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight size={14} className="text-red-400" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Total Outflows
              </span>
            </div>
            <div className="text-xl font-mono font-bold text-red-400">
              {formatCurrency(totalOutbound)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">to CEX deposits</div>
          </CardContent>
        </Card>
      </div>

      {/* Exchange list */}
      <div className="space-y-3">
        {cexFlows.map((flow, i) => (
          <Card key={i} className={
            flow.direction === "inbound"
              ? "border-green-500/20 hover:border-green-500/30"
              : "border-red-500/20 hover:border-red-500/30"
          }>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CEX_LOGOS[flow.exchange] || "🏦"}</span>
                  <div>
                    <div className="font-mono font-semibold text-white">{flow.exchange}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {flow.direction === "inbound" ? (
                        <ArrowDownLeft size={12} className="text-neon-green" />
                      ) : (
                        <ArrowUpRight size={12} className="text-red-400" />
                      )}
                      <span
                        className={`text-xs font-mono ${
                          flow.direction === "inbound" ? "text-neon-green" : "text-red-400"
                        }`}
                      >
                        {flow.direction === "inbound" ? "Onboarding" : "Offboarding"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono font-bold text-lg ${
                      flow.direction === "inbound" ? "text-neon-green" : "text-red-400"
                    }`}
                  >
                    {flow.direction === "inbound" ? "+" : "-"}{formatCurrency(flow.estimatedVolume)}
                  </div>
                  <div className="text-xs text-muted-foreground">{flow.txCount} transactions</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 text-xs font-mono text-muted-foreground">
                <span>{flow.firstDate} → {flow.lastDate}</span>
                <Badge variant={flow.confidence >= 80 ? "neon" : "amber"}>
                  {flow.confidence}% confidence
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                {flow.note}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
