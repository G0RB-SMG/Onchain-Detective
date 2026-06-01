import { WalletReport } from "./report-types";
import { SAMPLE_REPORT } from "./sample-data";

const BASE_URL = "https://openapiv1.coinstats.app";

interface CoinStatsBalance {
  coin?: { name: string; symbol: string; icon: string; price: number };
  balance?: number;
  balanceUsd?: number;
  holdings?: number;
  holdingsUsd?: number;
  // Various field name formats CoinStats might return
}

interface CoinStatsWalletResponse {
  balances?: CoinStatsBalance[];
  coins?: CoinStatsBalance[];
  tokens?: CoinStatsBalance[];
  portfolio?: { balances?: CoinStatsBalance[] };
  total?: number;
  totalBalance?: number;
  totalBalanceUSD?: number;
}

async function coinStatsGet(path: string, apiKey: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "X-API-KEY": apiKey,
      "accept": "application/json",
    },
    next: { revalidate: 120 },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("INVALID_API_KEY");
  }
  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API_ERROR_${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

function detectChain(address: string): string {
  if (/^0x[0-9a-fA-F]{40}$/.test(address)) return "ethereum";
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address) && !address.startsWith("0x")) return "solana";
  if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address)) return "bitcoin";
  return "ethereum";
}

function mapBalancesToHoldings(
  balances: CoinStatsBalance[],
  totalUsd: number
): WalletReport["holdings"] {
  return balances
    .map((b) => {
      const name = b.coin?.name ?? "Unknown";
      const symbol = b.coin?.symbol ?? "?";
      const price = b.coin?.price ?? 0;
      const holdUsd = b.holdingsUsd ?? b.balanceUsd ?? 0;
      const holdAmt = b.holdings ?? b.balance ?? 0;
      return {
        symbol,
        name,
        chain: "ethereum",
        balanceUsd: holdUsd,
        amount: `${holdAmt.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${symbol}`,
        change24h: 0,
        allocation: totalUsd > 0 ? (holdUsd / totalUsd) * 100 : 0,
        price,
        iconUrl: b.coin?.icon,
      };
    })
    .filter((h) => h.balanceUsd > 0.01)
    .sort((a, b) => b.balanceUsd - a.balanceUsd)
    .slice(0, 20);
}

export async function fetchWalletReport(address: string): Promise<WalletReport> {
  const apiKey = process.env.COINSTATS_API_KEY;
  const chain = detectChain(address);
  const fetchedAt = new Date().toISOString();

  if (!apiKey) {
    // No API key — return enriched sample data with a note
    return buildSampleReport(address, fetchedAt, "NO_API_KEY");
  }

  try {
    // Try CoinStats wallet portfolio endpoint
    let data: CoinStatsWalletResponse | null = null;
    let totalUsd = 0;

    // Attempt 1: portfolio/wallet endpoint
    try {
      data = await coinStatsGet(`/portfolio/wallet/${encodeURIComponent(address)}`, apiKey);
    } catch {
      // Attempt 2: coins endpoint with portfolio query
      try {
        data = await coinStatsGet(`/coins?portfolio=${encodeURIComponent(address)}`, apiKey);
      } catch {
        data = null;
      }
    }

    if (!data) {
      return buildSampleReport(address, fetchedAt, "API_NO_DATA");
    }

    // Normalize the response — CoinStats returns different shapes
    const balances: CoinStatsBalance[] =
      data.balances ??
      data.coins ??
      data.tokens ??
      data.portfolio?.balances ??
      [];

    totalUsd =
      data.totalBalanceUSD ??
      data.totalBalance ??
      data.total ??
      balances.reduce((s, b) => s + (b.holdingsUsd ?? b.balanceUsd ?? 0), 0);

    const holdings = mapBalancesToHoldings(balances, totalUsd);
    const chains = [...new Set(holdings.map((h) => h.chain))];
    if (!chains.length) chains.push(chain);

    return {
      address,
      isLive: true,
      fetchedAt,
      overview: {
        totalBalanceUsd: totalUsd,
        totalBalanceChange24h: 0,
        chains,
        nftCount: undefined,
        defiPositions: undefined,
        riskScore: undefined,
      },
      holdings,
      defiPositions: [],
      timeline: [],
      // Phase 3 placeholders — LLM analysis not done yet
      connectedWallets: [],
      cexFlows: [],
      classification: SAMPLE_REPORT.classification,
      buyingBehavior: SAMPLE_REPORT.buyingBehavior,
      pnl: SAMPLE_REPORT.pnl,
      inferences: SAMPLE_REPORT.inferences,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[CoinStats] Error fetching wallet:", msg);
    return buildSampleReport(address, fetchedAt, msg);
  }
}

function buildSampleReport(
  address: string,
  fetchedAt: string,
  error: string
): WalletReport {
  return {
    ...SAMPLE_REPORT,
    address,
    resolvedName: undefined,
    isLive: false,
    fetchedAt,
    error,
    overview: {
      ...SAMPLE_REPORT.overview,
      chains: SAMPLE_REPORT.overview.chains,
    },
  };
}
