---
name: Wallet API integration
description: Which APIs to use for multi-chain wallet balance lookup in this app
---

CoinStats (`openapiv1.coinstats.app`) is a market data API only — it has NO "scan any wallet" endpoint. All `/portfolio/wallet/...`, `/wallets/...`, and `/wallets/balance/...` paths return 404. Only `/coins`, `/coins/{id}` work.

**Why:** CoinStats wallet features are for their own portfolio tracking app, not public wallet scanning.

**Current data sources:**
- EVM wallets (0x...): `https://api.ethplorer.io/getAddressInfo/{address}?apiKey=freekey`
  - `ETH.balance` = human-readable ETH (already divided by 10^18)
  - `tokens[].balance` = raw units — divide by `10^parseInt(tokenInfo.decimals)` to get human-readable
  - `tokens[].tokenInfo.price.rate` = USD price per token (or `false` if no price)
  - Filter: skip tokens with price=false, usdValue < 0.5, no symbol/name; limit to top 25
- Bitcoin: `https://blockchain.info/balance?active={address}` — `final_balance` in satoshis (divide by 1e8)
- Solana: `https://api.mainnet-beta.solana.com` RPC `getBalance` — `result.value` in lamports (divide by 1e9)
- BTC/SOL prices: CoinStats `/coins/bitcoin` and `/coins/solana` (uses `COINSTATS_API_KEY`)

**How to apply:** Always use this stack for wallet balance lookups. Do not retry CoinStats wallet endpoints.
