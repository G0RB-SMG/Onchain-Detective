"use client";
import { Wallet, Activity, Clock, TrendingUp, TrendingDown, Shield, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "./SectionHeader";
import { formatCurrency, formatAddress, getChainColor } from "@/lib/utils";
import { SAMPLE_REPORT } from "@/lib/sample-data";

export default function OverviewSection() {
  const { overview, address, ensName } = SAMPLE_REPORT;

  const stats = [
    {
      label: "Total Portfolio Value",
      value: formatCurrency(overview.totalBalanceUsd),
      sub: `${overview.totalBalanceChange24h > 0 ? "+" : ""}${overview.totalBalanceChange24h}% (24h)`,
      icon: Wallet,
      positive: overview.totalBalanceChange24h > 0,
      highlight: true,
    },
    {
      label: "Total Transactions",
      value: overview.totalTransactions.toLocaleString(),
      sub: `Across ${overview.chains.length} chains`,
      icon: Activity,
      highlight: false,
    },
    {
      label: "Wallet Age",
      value: `${overview.walletAgeDays.toLocaleString()} days`,
      sub: `Since ${overview.firstSeen}`,
      icon: Clock,
      highlight: false,
    },
    {
      label: "DeFi Positions",
      value: overview.defiPositions,
      sub: `${overview.nftCount} NFTs held`,
      icon: Link2,
      highlight: false,
    },
  ];

  const riskColor =
    overview.riskScore < 40
      ? "text-neon-green"
      : overview.riskScore < 70
      ? "text-neon-amber"
      : "text-red-400";

  return (
    <section>
      <SectionHeader
        icon={Wallet}
        title="Wallet Overview"
        subtitle="Aggregated intelligence across all detected chains and connected wallets"
      />

      {/* Address banner */}
      <div className="mb-6 p-4 rounded-xl border border-neon-green/20 bg-neon-green/5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {ensName && (
            <div className="text-neon-green font-mono font-bold text-lg mb-1">{ensName}</div>
          )}
          <div className="font-mono text-sm text-muted-foreground break-all">{address}</div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {overview.chains.map((chain) => (
            <span
              key={chain}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold border"
              style={{
                color: getChainColor(chain),
                borderColor: `${getChainColor(chain)}40`,
                backgroundColor: `${getChainColor(chain)}15`,
              }}
            >
              {chain.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className={stat.highlight ? "border-neon-green/30 glow-green" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <stat.icon size={16} className="text-muted-foreground mt-0.5" />
              </div>
              <div
                className={`text-2xl font-mono font-bold mb-1 ${
                  stat.highlight ? "text-neon-green text-glow-green" : "text-white"
                }`}
              >
                {stat.value}
              </div>
              {stat.sub && (
                <div
                  className={`text-xs font-mono ${
                    stat.positive === true
                      ? "text-neon-green"
                      : stat.positive === false
                      ? "text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.positive === true && <TrendingUp size={12} className="inline mr-1" />}
                  {stat.positive === false && <TrendingDown size={12} className="inline mr-1" />}
                  {stat.sub}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk score + last active */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Risk Score</p>
              <Shield size={16} className="text-muted-foreground" />
            </div>
            <div className="flex items-end gap-3">
              <span className={`text-3xl font-mono font-bold ${riskColor}`}>
                {overview.riskScore}
              </span>
              <span className="text-muted-foreground text-sm mb-1">/ 100</span>
            </div>
            <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${overview.riskScore}%`,
                  background:
                    overview.riskScore < 40
                      ? "linear-gradient(90deg, #00ff88, #00e5ff)"
                      : overview.riskScore < 70
                      ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                      : "linear-gradient(90deg, #ef4444, #dc2626)",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {overview.riskScore < 40
                ? "Low risk — conservative behavior"
                : overview.riskScore < 70
                ? "Medium risk — active speculation"
                : "High risk — aggressive strategies"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
              Activity Window
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-mono">First seen</span>
                <span className="font-mono text-white">{overview.firstSeen}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-mono">Last active</span>
                <span className="font-mono text-neon-green">{overview.lastActive}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-mono">Avg tx/day</span>
                <span className="font-mono text-white">
                  {(overview.totalTransactions / overview.walletAgeDays).toFixed(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
