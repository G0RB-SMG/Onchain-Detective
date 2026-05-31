import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
  iconColor?: string;
}

export default function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  className,
  iconColor = "text-neon-green",
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start gap-3 mb-6", className)}>
      <div className={cn("mt-0.5 p-2 rounded-lg bg-white/5 border border-white/10", iconColor)}>
        <Icon size={18} />
      </div>
      <div>
        <h2 className="font-mono text-lg font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
