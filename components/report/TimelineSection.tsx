"use client";
import { Clock, Wallet, DollarSign, TrendingUp, TrendingDown, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";
import { formatCurrency, getChainColor } from "@/lib/utils";
import { SAMPLE_REPORT } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const eventConfig = {
  setup: { icon: Wallet, color: "text-neon-cyan", dot: "bg-cyan-500" },
  funding: { icon: DollarSign, color: "text-neon-green", dot: "bg-green-500" },
  defi: { icon: Zap, color: "text-neon-amber", dot: "bg-amber-500" },
  buy: { icon: TrendingUp, color: "text-neon-green", dot: "bg-green-400" },
  memecoin: { icon: Zap, color: "text-pink-400", dot: "bg-pink-500" },
  milestone: { icon: Zap, color: "text-neon-amber", dot: "bg-amber-400" },
  loss: { icon: TrendingDown, color: "text-red-400", dot: "bg-red-500" },
  strategy: { icon: ArrowRight, color: "text-neon-purple", dot: "bg-purple-500" },
  win: { icon: TrendingUp, color: "text-neon-green", dot: "bg-green-500" },
  current: { icon: Clock, color: "text-neon-cyan", dot: "bg-cyan-400" },
};

export default function TimelineSection() {
  const { timeline } = SAMPLE_REPORT;

  return (
    <section>
      <SectionHeader
        icon={Clock}
        title="Transaction Timeline"
        subtitle="Key events and milestones in chronological order"
        iconColor="text-neon-cyan"
      />

      <Card>
        <CardContent className="p-5">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-1">
              {timeline.map((event, i) => {
                const config = eventConfig[event.type as keyof typeof eventConfig] || eventConfig.setup;
                const EventIcon = config.icon;
                const isLast = i === timeline.length - 1;

                return (
                  <div
                    key={i}
                    className={cn(
                      "relative flex items-start gap-4 py-3 px-1 rounded-lg transition-colors hover:bg-white/[0.02]",
                      isLast && "border border-neon-green/20 bg-neon-green/5"
                    )}
                  >
                    {/* Dot */}
                    <div className="relative shrink-0 mt-0.5">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center border-2 border-background z-10 relative",
                          config.dot,
                          isLast ? "w-9 h-9" : "w-7 h-7 opacity-80"
                        )}
                      >
                        <EventIcon size={isLast ? 14 : 12} className="text-background" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm font-mono",
                            isLast ? "font-semibold text-white" : "text-white/80"
                          )}
                        >
                          {event.event}
                        </span>
                        {event.value !== null && (
                          <span
                            className={cn(
                              "text-sm font-mono font-bold shrink-0",
                              event.value > 0 ? "text-neon-green" : "text-red-400"
                            )}
                          >
                            {event.value > 0 ? "+" : ""}
                            {formatCurrency(Math.abs(event.value))}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-muted-foreground">{event.date}</span>
                        {event.chain !== "multiple" && (
                          <span
                            className="text-xs font-mono"
                            style={{ color: getChainColor(event.chain) }}
                          >
                            · {event.chain}
                          </span>
                        )}
                        {isLast && (
                          <span className="text-xs font-mono text-neon-green animate-pulse-neon">● CURRENT</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
