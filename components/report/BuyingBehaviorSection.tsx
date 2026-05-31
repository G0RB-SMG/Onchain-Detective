"use client";
import { ShoppingCart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "./SectionHeader";
import { SAMPLE_REPORT } from "@/lib/sample-data";

export default function BuyingBehaviorSection() {
  const { buyingBehavior } = SAMPLE_REPORT;
  const total = buyingBehavior.reduce((s, b) => s + b.allocation, 0);

  const profitColors = {
    positive: { text: "text-neon-green", icon: TrendingUp, badge: "neon" as const },
    negative: { text: "text-red-400", icon: TrendingDown, badge: "destructive" as const },
    mixed: { text: "text-neon-amber", icon: Minus, badge: "amber" as const },
    neutral: { text: "text-muted-foreground", icon: Minus, badge: "outline" as const },
  };

  const categoryColors = [
    "#00ff88", "#a855f7", "#00e5ff", "#f59e0b", "#f97316",
  ];

  return (
    <section>
      <SectionHeader
        icon={ShoppingCart}
        title="Typical Buying Behavior"
        subtitle="Investment pattern analysis across all detected purchasing activity"
        iconColor="text-neon-amber"
      />

      {/* Allocation bar */}
      <div className="mb-5">
        <div className="flex h-4 rounded-full overflow-hidden mb-3 gap-0.5">
          {buyingBehavior.map((b, i) => (
            <div
              key={i}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all hover:opacity-80"
              style={{
                width: `${(b.allocation / total) * 100}%`,
                backgroundColor: categoryColors[i],
                opacity: 0.85,
              }}
              title={`${b.category}: ${b.allocation}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {buyingBehavior.map((b, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: categoryColors[i] }}
              />
              <span className="text-xs font-mono text-muted-foreground">{b.category} ({b.allocation}%)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {buyingBehavior.map((behavior, i) => {
          const profit = profitColors[behavior.profitability as keyof typeof profitColors];
          const ProfitIcon = profit.icon;
          return (
            <Card key={i} className="hover:border-border/80 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[i] }}
                    />
                    <span className="font-mono font-semibold text-white">{behavior.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {behavior.allocation}% portfolio
                    </Badge>
                    <Badge variant={profit.badge} className="text-xs">
                      <ProfitIcon size={10} className="mr-1" />
                      {behavior.profitability}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {behavior.examples.map((ex) => (
                    <code
                      key={ex}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-border text-neon-cyan"
                    >
                      {ex}
                    </code>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-muted-foreground font-mono text-xs">Avg hold time</span>
                  <span className="font-mono text-white text-xs">{behavior.avgHoldDays} days</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2">
                  {behavior.note}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
