"use client";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "./SectionHeader";
import { formatCurrency } from "@/lib/utils";
import { SAMPLE_REPORT } from "@/lib/sample-data";

export default function PnlSection() {
  const { pnl } = SAMPLE_REPORT;

  const stats = [
    {
      label: "All-Time P&L",
      value: formatCurrency(pnl.allTimeUsd),
      sub: `+${pnl.allTimePercent}%`,
      positive: true,
      large: true,
    },
    {
      label: "Realized",
      value: formatCurrency(pnl.realizedUsd),
      sub: "Locked in gains",
      positive: true,
    },
    {
      label: "Unrealized",
      value: formatCurrency(pnl.unrealizedUsd),
      sub: "Paper gains",
      positive: true,
    },
    {
      label: "Fees Paid",
      value: formatCurrency(pnl.totalFeesPaidUsd),
      sub: "Gas + swap fees",
      positive: false,
    },
  ];

  const maxPnl = Math.max(...pnl.breakdown.map((b) => Math.abs(b.pnl)));

  return (
    <section>
      <SectionHeader
        icon={BarChart3}
        title="P&L Summary"
        subtitle="Profit and loss analysis across all trading categories and time periods"
        iconColor="text-neon-green"
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={stat.large ? "border-neon-green/30 glow-green" : ""}
          >
            <CardContent className="p-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <div
                className={`font-mono font-bold ${stat.large ? "text-2xl" : "text-xl"} ${
                  stat.positive ? "text-neon-green" : "text-red-400"
                } ${stat.large ? "text-glow-green" : ""}`}
              >
                {stat.positive && "+"}
                {stat.value}
              </div>
              <div
                className={`text-xs mt-1 font-mono ${
                  stat.positive ? "text-neon-green/60" : "text-red-400/60"
                }`}
              >
                {stat.sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Peak + milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-neon-amber" />
              <span className="text-xs font-mono text-muted-foreground">Peak Portfolio</span>
            </div>
            <div className="text-xl font-mono font-bold text-neon-amber">
              {formatCurrency(pnl.peakPortfolioUsd)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{pnl.peakDate}</div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-neon-green" />
              <span className="text-xs font-mono text-muted-foreground">Best Month</span>
            </div>
            <div className="text-xl font-mono font-bold text-neon-green">
              +{formatCurrency(pnl.bestMonth.pnl)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{pnl.bestMonth.month}</div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={14} className="text-red-400" />
              <span className="text-xs font-mono text-muted-foreground">Worst Month</span>
            </div>
            <div className="text-xl font-mono font-bold text-red-400">
              {formatCurrency(pnl.worstMonth.pnl)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{pnl.worstMonth.month}</div>
          </CardContent>
        </Card>
      </div>

      {/* Category breakdown */}
      <Card>
        <CardContent className="p-5">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
            P&L by Category
          </p>
          <div className="space-y-4">
            {pnl.breakdown.map((item) => (
              <div key={item.category}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-mono text-white">{item.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono">
                      {item.txCount} trades · {item.winRate}% win
                    </span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        item.pnl >= 0 ? "text-neon-green" : "text-red-400"
                      }`}
                    >
                      {item.pnl >= 0 ? "+" : ""}
                      {formatCurrency(item.pnl)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(Math.abs(item.pnl) / maxPnl) * 100}%`,
                        background:
                          item.pnl >= 0
                            ? "linear-gradient(90deg, #00ff88, #00e5ff)"
                            : "linear-gradient(90deg, #ef4444, #dc2626)",
                      }}
                    />
                  </div>
                  <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-neon-amber/50"
                      style={{ width: `${item.winRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
