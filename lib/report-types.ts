export interface WalletHolding {
  symbol: string;
  name: string;
  chain: string;
  balanceUsd: number;
  amount: string;
  change24h: number;
  allocation: number;
  price?: number;
  iconUrl?: string;
}

export interface WalletTransaction {
  hash?: string;
  date: string;
  event: string;
  type: string;
  value: number | null;
  chain: string;
}

export interface DeFiPosition {
  protocol: string;
  chain: string;
  type: string;
  valueUsd: number;
  details: string;
  apy: number;
  healthFactor: number | null;
}

export interface ConnectedWallet {
  address: string;
  full: string;
  label: string;
  relation: string;
  confidence: number;
  balanceUsd: number;
  chain: string;
  note: string;
}

export interface CexFlow {
  exchange: string;
  type: string;
  direction: string;
  estimatedVolume: number;
  txCount: number;
  firstDate: string;
  lastDate: string;
  confidence: number;
  note: string;
}

export interface WalletInference {
  label: string;
  confidence: number;
  color: string;
  description: string;
}

export interface PnlBreakdown {
  category: string;
  pnl: number;
  txCount: number;
  winRate: number;
}

export interface WalletReport {
  address: string;
  resolvedName?: string;
  isLive: boolean;
  fetchedAt: string;
  error?: string;

  overview: {
    totalBalanceUsd: number;
    totalBalanceChange24h: number;
    walletAgeDays?: number;
    firstSeen?: string;
    lastActive?: string;
    totalTransactions?: number;
    chains: string[];
    nftCount?: number;
    defiPositions?: number;
    riskScore?: number;
  };

  holdings: WalletHolding[];
  defiPositions: DeFiPosition[];
  timeline: WalletTransaction[];

  // LLM analysis sections — populated in Phase 3
  connectedWallets: ConnectedWallet[];
  cexFlows: CexFlow[];
  classification: {
    primary: string;
    secondary: string;
    confidence: number;
    reasoning: string;
    traits: { label: string; value: string; score: number }[];
  };
  buyingBehavior: {
    category: string;
    allocation: number;
    examples: string[];
    avgHoldDays: number;
    profitability: string;
    note: string;
  }[];
  pnl: {
    allTimeUsd: number;
    allTimePercent: number;
    realizedUsd: number;
    unrealizedUsd: number;
    totalFeesPaidUsd: number;
    breakdown: PnlBreakdown[];
    peakPortfolioUsd: number;
    peakDate: string;
    tradeFrequency: string;
    bestMonth: { month: string; pnl: number };
    worstMonth: { month: string; pnl: number };
  };
  inferences: WalletInference[];
}
