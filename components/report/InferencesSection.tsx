"use client";
import { Brain, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";
import { useReport } from "@/lib/report-context";
import { cn } from "@/lib/utils";

const colorMap: Record<string, { bar: string; text: string; bg: string }> = {
  amber:  { bar: "#d97706", text: "text-amber-400",  bg: "bg-amber-900/10 border-amber-800/30" },
  gold:   { bar: "#C49A4A", text: "text-gold",        bg: "bg-gold/10 border-gold/20" },
  cyan:   { bar: "#C8B89A", text: "text-tan",         bg: "bg-tan/10 border-tan/20" },
  purple: { bar: "#8B3A1A", text: "text-rouge",       bg: "bg-rouge/10 border-rouge/20" },
  green:  { bar: "#C49A4A", text: "text-gold",        bg: "bg-gold/10 border-gold/20" },
  red:    { bar: "#ef4444", text: "text-red-400",     bg: "bg-red-900/10 border-red-800/30" },
};

const fallbackStyle = (score: number) => {
  if (score >= 80) return { bar: "#C49A4A", text: "text-gold", bg: "bg-gold/10 border-gold/20" };
  if (score >= 60) return { bar: "#d97706", text: "text-amber-400", bg: "bg-amber-900/10 border-amber-800/30" };
  return { bar: "#4A3728", text: "text-muted-foreground", bg: "bg-secondary border-border" };
};

export default function InferencesSection() {
  const { inferences } = useReport();

  if (!inferences || inferences.length === 0) {
    return (
      <section>
        <SectionHeader
          icon={Brain}
          title="Detective Inferences"
          subtitle="Every inference is clearly labeled with confidence level and reasoning — never presented as fact"
          iconColor="text-rouge"
        />
        <div className="p-6 rounded-xl border border-border bg-card text-center text-muted-foreground font-mono text-sm">
          Inferences require LLM analysis — available in Phase 3.
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        icon={Brain}
        title="Detective Inferences"
        subtitle="Every inference is clearly labeled with confidence level and reasoning — never presented as fact"
        iconColor="text-rouge"
      />

      <div className="mb-4 p-3 rounded-lg border border-amber-800/30 bg-amber-900/10 flex items-start gap-2">
        <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400/80 leading-relaxed font-mono">
          All inferences below are probabilistic analysis only. No inference should be treated as confirmed fact.
          Lower confidence scores indicate higher uncertainty.
        </p>
      </div>

      <div className="space-y-3">
        {inferences.map((inf, i) => {
          const style = colorMap[inf.color] || fallbackStyle(inf.confidence);
          return (
            <Card key={i} className={cn("border transition-colors", style.bg)}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
                    <h3 className={`font-mono font-semibold text-sm ${style.text}`}>{inf.label}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">Inference</span>
                    <span className={`text-lg font-mono font-bold ${style.text}`}>{inf.confidence}%</span>
                    <span className="text-xs font-mono text-muted-foreground">confidence</span>
                  </div>
                </div>

                <div className="h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${inf.confidence}%`, backgroundColor: style.bar, opacity: 0.7 }}
                  />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{inf.description}</p>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${style.bg} ${style.text}`}>
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
