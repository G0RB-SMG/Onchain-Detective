"use client";
import { Brain, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";
import { SAMPLE_REPORT } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const confidenceColor = (score: number) => {
  if (score >= 80) return { bar: "#00ff88", text: "text-neon-green", bg: "bg-green-500/10 border-green-500/20" };
  if (score >= 60) return { bar: "#f59e0b", text: "text-neon-amber", bg: "bg-amber-500/10 border-amber-500/20" };
  return { bar: "#6b7280", text: "text-muted-foreground", bg: "bg-white/5 border-white/10" };
};

const colorMap: Record<string, { bar: string; text: string; bg: string }> = {
  amber: { bar: "#f59e0b", text: "text-neon-amber", bg: "bg-amber-500/10 border-amber-500/20" },
  cyan: { bar: "#00e5ff", text: "text-neon-cyan", bg: "bg-cyan-500/10 border-cyan-500/20" },
  purple: { bar: "#a855f7", text: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  green: { bar: "#00ff88", text: "text-neon-green", bg: "bg-green-500/10 border-green-500/20" },
  red: { bar: "#ef4444", text: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export default function InferencesSection() {
  const { inferences } = SAMPLE_REPORT;

  return (
    <section>
      <SectionHeader
        icon={Brain}
        title="Detective Inferences"
        subtitle="Every inference is clearly labeled with confidence level and reasoning — never presented as fact"
        iconColor="text-neon-purple"
      />

      <div className="mb-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-start gap-2">
        <AlertTriangle size={14} className="text-neon-amber shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400/80 leading-relaxed font-mono">
          All inferences below are probabilistic analysis only. No inference should be treated as confirmed fact. 
          Lower confidence scores indicate higher uncertainty.
        </p>
      </div>

      <div className="space-y-3">
        {inferences.map((inf, i) => {
          const style = colorMap[inf.color] || confidenceColor(inf.confidence);
          return (
            <Card key={i} className={cn("border transition-colors", style.bg)}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
                    <h3 className={`font-mono font-semibold text-sm ${style.text}`}>
                      {inf.label}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">Inference</span>
                    <span
                      className={`text-lg font-mono font-bold ${style.text}`}
                    >
                      {inf.confidence}%
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">confidence</span>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${inf.confidence}%`,
                      backgroundColor: style.bar,
                      opacity: 0.7,
                    }}
                  />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {inf.description}
                </p>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full border ${style.bg} ${style.text}`}
                  >
                    Inference ({inf.confidence}% confidence)
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
