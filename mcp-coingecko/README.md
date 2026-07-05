# CoinGecko MCP Server

MCP (Model Context Protocol) server providing crypto market data from CoinGecko, Binance, and CryptoCompare.

## Features

- **get_top_coins** - Top cryptocurrencies by market cap
- **get_coin_price** - Real-time price lookup
- **get_coin_chart** - Historical price charts
- **get_coin_details** - Detailed coin information
- **get_trending** - Currently trending coins
- **get_global_market** - Global crypto market stats
- **get_fear_greed** - Fear & Greed Index
- **get_binance_ticker** - Binance 24h ticker data
- **get_crypto_news** - Latest crypto news
- **compare_prices** - Multi-exchange price comparison

## Setup

```bash
cd mcp-coingecko
npm install
npm start
```

## OpenCode Configuration

Add to `opencode.json`:

```json
{
  "mcp": {
    "coingecko": {
      "type": "local",
      "command": ["node", "mcp-coingecko/index.js"]
    }
  }
}
```

## Usage

After configuring, restart OpenCode and use the tools:

```
Show me the top 10 coins by market cap. use coingecko
What's the fear and greed index? use coingecko
Compare Bitcoin prices on CoinGecko vs Binance. use coingecko
```
