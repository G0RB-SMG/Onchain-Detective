import { NextResponse } from "next/server";
import { fetchWalletReport } from "@/lib/coinstats";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address || address.length < 10) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  try {
    const report = await fetchWalletReport(address);
    return NextResponse.json(report);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/wallet] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
