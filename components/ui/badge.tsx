import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        destructive: "bg-red-900/20 text-red-400 border-red-800/30",
        outline: "text-foreground border-border",
        gold: "border-gold/40 bg-gold/10 text-gold",
        tan: "border-tan/40 bg-tan/10 text-tan",
        rouge: "border-rouge/40 bg-rouge/10 text-rouge",
        amber: "border-amber-700/40 bg-amber-900/20 text-amber-400",
        live: "border-emerald-700/40 bg-emerald-900/20 text-emerald-400",
        sample: "border-gold/30 bg-gold/5 text-tan",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
