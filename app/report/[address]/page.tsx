import { Suspense } from "react";
import ReportPageClient from "./ReportPageClient";

interface Props {
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { address } = await params;
  const decoded = decodeURIComponent(address);
  return {
    title: `Investigation: ${decoded.slice(0, 12)}... · OnChain Detective`,
    description: `Full on-chain intelligence report for wallet ${decoded}`,
  };
}

export default async function ReportPage({ params }: Props) {
  const { address } = await params;
  return (
    <Suspense fallback={<ReportSkeleton />}>
      <ReportPageClient address={decodeURIComponent(address)} />
    </Suspense>
  );
}

function ReportSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-gold text-sm">Initializing investigation...</p>
      </div>
    </div>
  );
}
