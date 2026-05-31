"use client";
import { Layers, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "./SectionHeader";
import { formatCurrency, getChainColor } from "@/lib/utils";
import { SAMPLE_REPORT } from "@/lib/sample-data";

const protocolTypeColors: Record<string, string> = {
  Lending: "text-neon-amber",
  "LP Position": "text-neon-cyan",
  Staking: "text-neon-green",
};

export default function DefiSection() {
  const { defiPositions } = SAMPLE_REPORT;
  const totalValue = defiPositions.reduce((s, p) => s + p.valueUsd, 0);

  return (
    <section>
      <SectionHeader
        icon={Layers}
        title="DeFi Positions"
        subtitle="Active on-chain positions across lending, liquidity, and staking protocols"
        iconColor="text-neon-cyan"
      />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-mono">
          {defiPositions.length} active positions
        </span>
        <span className="font-mono font-bold text-neon-green text-glow-green">
          {formatCurrency(totalValue)} total
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {defiPositions.map((pos, i) => (
          <Card key={i} className="hover:border-border/80 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-mono font-semibold text-white">{pos.protocol}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs font-mono px-1.5 py-0.5 rounded border"
                      style={{
                        color: getChainColor(pos.chain),
                        borderColor: `${getChainColor(pos.chain)}40`,
                        backgroundColor: `${getChainColor(pos.chain)}10`,
                      }}
                    >
                      {pos.chain}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        protocolTypeColors[pos.type] || "text-muted-foreground"
                      }`}
                    >
                      {pos.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white">{formatCurrency(pos.valueUsd)}</div>
                  <div className="text-xs text-neon-green font-mono mt-1">
                    {pos.apy}% APY
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{pos.details}</p>

              {pos.healthFactor !== null && (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Heart size={12} className={pos.healthFactor > 1.5 ? "text-neon-green" : "text-neon-amber"} />
                  <span className="text-xs font-mono text-muted-foreground">Health Factor</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      pos.healthFactor > 1.5 ? "text-neon-green" : "text-neon-amber"
                    }`}
                  >
                    {pos.healthFactor}
                  </span>
                  {pos.healthFactor < 1.3 && (
                    <Badge variant="destructive" className="ml-auto text-xs">At Risk</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
