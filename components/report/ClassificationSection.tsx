"use client";
import { UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "./SectionHeader";
import { useReport } from "@/lib/report-context";

export default function ClassificationSection() {
  const { classification } = useReport();

  if (!classification) {
    return (
      <section>
        <SectionHeader
          icon={UserCheck}
          title="Wallet Classification"
          subtitle="Behavioral archetype derived from transaction patterns and portfolio composition"
          iconColor="text-rouge"
        />
        <div className="p-6 rounded-xl border border-border bg-card text-center text-muted-foreground font-mono text-sm">
          Wallet classification requires LLM processing — available in Phase 3.
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        icon={UserCheck}
        title="Wallet Classification"
        subtitle="Behavioral archetype derived from transaction patterns and portfolio composition"
        iconColor="text-rouge"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Primary classification */}
        <Card className="lg:col-span-2 border-rouge/30 glow-rouge">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                  Primary Classification
                </p>
                <div className="text-2xl font-mono font-bold text-rouge">
                  {classification.primary}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-muted-foreground mb-1">Confidence</p>
                <span className="text-2xl font-mono font-bold text-foreground">
                  {classification.confidence}%
                </span>
              </div>
            </div>

            <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${classification.confidence}%`,
                  background: "linear-gradient(90deg, #8B3A1A, #C49A4A)",
                }}
              />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {classification.reasoning}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Badge variant="rouge">Also: {classification.secondary}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Trait bars */}
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
              Behavioral Traits
            </p>
            <div className="space-y-4">
              {classification.traits.map((trait) => (
                <div key={trait.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-mono text-muted-foreground">{trait.label}</span>
                    <span className="text-xs font-mono text-foreground font-medium">{trait.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${trait.score}%`,
                        background: `linear-gradient(90deg, #8B3A1A, #C49A4A)`,
                        opacity: 0.4 + trait.score / 200,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
