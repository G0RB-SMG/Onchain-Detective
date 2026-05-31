"use client";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";
import { formatCurrency, getChainColor } from "@/lib/utils";
import { SAMPLE_REPORT } from "@/lib/sample-data";

export default function HoldingsSection() {
  const { holdings } = SAMPLE_REPORT;
  const total = holdings.reduce((s, h) => s + h.balanceUsd, 0);

  return (
    <section>
      <SectionHeader
        icon={Coins}
        title="Holdings"
        subtitle="Current token balances across all detected wallets and chains"
        iconColor="text-neon-cyan"
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-mono text-muted-foreground uppercase tracking-wider p-4">
                    Asset
                  </th>
                  <th className="text-left text-xs font-mono text-muted-foreground uppercase tracking-wider p-4 hidden sm:table-cell">
                    Chain
                  </th>
                  <th className="text-right text-xs font-mono text-muted-foreground uppercase tracking-wider p-4">
                    Value
                  </th>
                  <th className="text-right text-xs font-mono text-muted-foreground uppercase tracking-wider p-4 hidden md:table-cell">
                    24h
                  </th>
                  <th className="text-right text-xs font-mono text-muted-foreground uppercase tracking-wider p-4 hidden lg:table-cell">
                    Allocation
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0"
                          style={{
                            backgroundColor: `${getChainColor(holding.chain)}20`,
                            color: getChainColor(holding.chain),
                            border: `1px solid ${getChainColor(holding.chain)}40`,
                          }}
                        >
                          {holding.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-mono font-semibold text-white text-sm">
                            {holding.symbol}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {holding.amount}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded border"
                        style={{
                          color: getChainColor(holding.chain),
                          borderColor: `${getChainColor(holding.chain)}40`,
                          backgroundColor: `${getChainColor(holding.chain)}10`,
                        }}
                      >
                        {holding.chain}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-mono font-semibold text-white text-sm">
                        {formatCurrency(holding.balanceUsd)}
                      </span>
                    </td>
                    <td className="p-4 text-right hidden md:table-cell">
                      {holding.change24h !== 0 ? (
                        <span
                          className={`text-sm font-mono flex items-center justify-end gap-1 ${
                            holding.change24h > 0 ? "text-neon-green" : "text-red-400"
                          }`}
                        >
                          {holding.change24h > 0 ? (
                            <TrendingUp size={12} />
                          ) : (
                            <TrendingDown size={12} />
                          )}
                          {holding.change24h > 0 ? "+" : ""}
                          {holding.change24h}%
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono">—</span>
                      )}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${holding.allocation}%`,
                              background: `linear-gradient(90deg, ${getChainColor(holding.chain)}, ${getChainColor(holding.chain)}80)`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                          {holding.allocation}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-white/[0.02]">
                  <td className="p-4 font-mono font-semibold text-white" colSpan={2}>
                    Total Portfolio
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-neon-green text-lg text-glow-green">
                    {formatCurrency(total)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
