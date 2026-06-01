import { WalletReport } from "./report-types";
import { SAMPLE_REPORT } from "./sample-data";

const ETHPLORER_BASE = "https://api.ethplorer.io";
const ETHPLORER_KEY = "freekey";
const BTCINFO_BASE = "https://blockchain.info";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const COINSTATS_BASE = "https://openapiv1.coinstats.app";

// ─── Chain detection ────────────────────────────────────────────────────────

function detectChain(address: string): "ethereum" | "bitcoin" | "solana" {
  if (/^0x[0-9a-fA-F]{40}$/.test(address)) return "ethereum";
  if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address)) return "bitcoin";
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) return "solana";
  return "ethereum";
}

// ─── CoinStats price lookup (for BTC / SOL where Ethplorer has no data) ─────

async function getCoinStatsPrice(
  apiKey: string,
  coinId: "bitcoin" | "solana" | "ethereum"
): Promise<{ price: number; change24h: number } | null> {
  try {
    const res = await fetch(`${COINSTATS_BASE}/coins/${coinId}`, {
      headers: { "X-API-KEY": apiKey, accept: "application/json" },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const d = await res.json();
    return { price: d.price ?? 0, change24h: d.priceChange1d ?? 0 };
  } catch {
    return null;
  }
}

// ─── Ethplorer types ─────────────────────────────────────────────────────────

interface EthplorerPrice {
  rate: number;
  diff: number;
  diff7d?: number;
}

interface EthplorerTokenInfo {
  address: string;
  decimals: string;
  name: string;
  symbol: string;
  price: EthplorerPrice | false;
  icon?: string;
}

interface EthplorerToken {
  tokenInfo: EthplorerTokenInfo;
  balance: number;
  rawBalance: string;
}

interface EthplorerResponse {
  address: string;
  ETH: {
    price?: EthplorerPrice;
    balance: number;
    rawBalance: string;
  };
  tokens?: EthplorerToken[];
  countTxs?: number;
}

// ─── EVM wallet (Ethereum / ERC-20) ─────────────────────────────────────────

async function fetchEVMWallet(address: string): Promise<WalletReport["holdings"]> {
  const res = await fetch(
    `${ETHPLORER_BASE}/getAddressInfo/${address}?apiKey=${ETHPLORER_KEY}`,
    { next: { revalidate: 120 } }
  );
  if (!res.ok) throw new Error(`Ethplorer error ${res.status}`);
  const data: EthplorerResponse = await res.json();

  const holdings: WalletReport["holdings"] = [];

  const ethPrice = data.ETH?.price?.rate ?? 0;
  const ethChange = data.ETH?.price?.diff ?? 0;
  const ethBalance = data.ETH?.balance ?? 0;
  const ethUsd = ethBalance * ethPrice;

  if (ethBalance > 0 && ethPrice > 0) {
    holdings.push({
      symbol: "ETH",
      name: "Ethereum",
      chain: "ethereum",
      balanceUsd: ethUsd,
      amount: `${ethBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} ETH`,
      change24h: ethChange,
      allocation: 0,
      price: ethPrice,
    });
  } else if (ethBalance > 0) {
    holdings.push({
      symbol: "ETH",
      name: "Ethereum",
      chain: "ethereum",
      balanceUsd: 0,
      amount: `${ethBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} ETH`,
      change24h: 0,
      allocation: 0,
      price: 0,
    });
  }

  for (const token of data.tokens ?? []) {
    const info = token.tokenInfo;
    if (!info.symbol || !info.name) continue;
    if (!info.price || !info.price.rate) continue;

    const decimals = parseInt(info.decimals || "18", 10);
    const rawStr = token.rawBalance || String(token.balance);
    let amount: number;
    try {
      const rawBig = BigInt(rawStr);
      const divisor = BigInt(10) ** BigInt(decimals);
      amount = Number(rawBig / divisor) + Number(rawBig % divisor) / Math.pow(10, decimals);
    } catch {
      amount = token.balance / Math.pow(10, decimals);
    }

    const usd = amount * info.price.rate;
    if (usd < 0.5) continue;

    holdings.push({
      symbol: info.symbol,
      name: info.name,
      chain: "ethereum",
      balanceUsd: usd,
      amount: `${amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${info.symbol}`,
      change24h: info.price.diff ?? 0,
      allocation: 0,
      price: info.price.rate,
    });
  }

  holdings.sort((a, b) => b.balanceUsd - a.balanceUsd);
  const top = holdings.slice(0, 25);
  const totalUsd = top.reduce((s, h) => s + h.balanceUsd, 0);
  for (const h of top) {
    h.allocation = totalUsd > 0 ? (h.balanceUsd / totalUsd) * 100 : 0;
  }

  return top;
}

// ─── Bitcoin wallet ──────────────────────────────────────────────────────────

async function fetchBTCWallet(
  address: string,
  apiKey: string | undefined
): Promise<WalletReport["holdings"]> {
  const res = await fetch(`${BTCINFO_BASE}/balance?active=${address}`, {
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error(`blockchain.info error ${res.status}`);
  const data = await res.json();

  const entry = data[address];
  if (!entry) throw new Error("Bitcoin address not found");

  const btcBalance = (entry.final_balance ?? 0) / 1e8;

  let btcPrice = 0;
  let btcChange = 0;
  if (apiKey) {
    const priceData = await getCoinStatsPrice(apiKey, "bitcoin");
    if (priceData) {
      btcPrice = priceData.price;
      btcChange = priceData.change24h;
    }
  }

  const usd = btcBalance * btcPrice;

  return [
    {
      symbol: "BTC",
      name: "Bitcoin",
      chain: "bitcoin",
      balanceUsd: usd,
      amount: `${btcBalance.toFixed(8)} BTC`,
      change24h: btcChange,
      allocation: 100,
      price: btcPrice,
    },
  ];
}

// ─── Solana wallet ───────────────────────────────────────────────────────────

async function fetchSOLWallet(
  address: string,
  apiKey: string | undefined
): Promise<WalletReport["holdings"]> {
  const res = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address],
    }),
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error(`Solana RPC error ${res.status}`);
  const data = await res.json();

  if (data.error) throw new Error(`Solana: ${data.error.message}`);

  const lamports = data.result?.value ?? 0;
  const solBalance = lamports / 1e9;

  let solPrice = 0;
  let solChange = 0;
  if (apiKey) {
    const priceData = await getCoinStatsPrice(apiKey, "solana");
    if (priceData) {
      solPrice = priceData.price;
      solChange = priceData.change24h;
    }
  }

  const usd = solBalance * solPrice;

  return [
    {
      symbol: "SOL",
      name: "Solana",
      chain: "solana",
      balanceUsd: usd,
      amount: `${solBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL`,
      change24h: solChange,
      allocation: 100,
      price: solPrice,
    },
  ];
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function fetchWalletReport(address: string): Promise<WalletReport> {
  const apiKey = process.env.COINSTATS_API_KEY;
  const chain = detectChain(address);
  const fetchedAt = new Date().toISOString();

  try {
    let holdings: WalletReport["holdings"] = [];

    if (chain === "ethereum") {
      holdings = await fetchEVMWallet(address);
    } else if (chain === "bitcoin") {
      holdings = await fetchBTCWallet(address, apiKey);
    } else {
      holdings = await fetchSOLWallet(address, apiKey);
    }

    const totalBalanceUsd = holdings.reduce((s, h) => s + h.balanceUsd, 0);
    const chains = [...new Set(holdings.map((h) => h.chain))];
    if (!chains.length) chains.push(chain);

    return {
      address,
      isLive: true,
      fetchedAt,
      overview: {
        totalBalanceUsd,
        totalBalanceChange24h: 0,
        chains,
        nftCount: undefined,
        defiPositions: undefined,
        riskScore: undefined,
      },
      holdings,
      defiPositions: [],
      timeline: [],
      connectedWallets: [],
      cexFlows: [],
      classification: SAMPLE_REPORT.classification,
      buyingBehavior: SAMPLE_REPORT.buyingBehavior,
      pnl: SAMPLE_REPORT.pnl,
      inferences: SAMPLE_REPORT.inferences,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[wallet fetch] Error:", msg);
    return {
      ...SAMPLE_REPORT,
      address,
      resolvedName: undefined,
      isLive: false,
      fetchedAt,
      error: msg,
      overview: {
        ...SAMPLE_REPORT.overview,
        chains: SAMPLE_REPORT.overview.chains,
      },
    };
  }
}
