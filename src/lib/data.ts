export const MARKET_DATA = {
  globalMetrics: {
    marketCap: 2450000000000,
    marketCapChange: 1.2,
    volume24h: 84000000000,
    btcDominance: 52.4,
  },
  ticker: [
    { symbol: 'BTC/USD', price: 64230.50, change: 2.4 },
    { symbol: 'ETH/USD', price: 3450.21, change: -0.8 },
    { symbol: 'XAU/USD', price: 2340.80, change: -0.5 },
    { symbol: 'XAG/USD', price: 28.45, change: 1.1 },
    { symbol: 'SOL/USD', price: 145.80, change: 5.1 },
    { symbol: 'BNB/USD', price: 590.12, change: 1.2 },
    { symbol: 'XRP/USD', price: 0.58, change: -0.2 },
  ],
  cryptoRankings: [
    { rank: 1, name: 'Bitcoin', symbol: 'BTC', price: 64230.00, change: 2.45, marketCap: 1264500000000, volume: 32400000000 },
    { rank: 2, name: 'Ethereum', symbol: 'ETH', price: 3450.21, change: -0.82, marketCap: 415200000000, volume: 18700000000 },
    { rank: 3, name: 'Tether', symbol: 'USDT', price: 1.00, change: -0.01, marketCap: 110500000000, volume: 45200000000 },
    { rank: 4, name: 'Solana', symbol: 'SOL', price: 145.80, change: 5.12, marketCap: 65300000000, volume: 4800000000 },
    { rank: 5, name: 'BNB', symbol: 'BNB', price: 590.12, change: 1.20, marketCap: 87500000000, volume: 1200000000 },
    { rank: 6, name: 'XRP', symbol: 'XRP', price: 0.58, change: -0.25, marketCap: 31800000000, volume: 950000000 },
    { rank: 7, name: 'USDC', symbol: 'USDC', price: 1.00, change: 0.00, marketCap: 32400000000, volume: 3800000000 },
    { rank: 8, name: 'Cardano', symbol: 'ADA', price: 0.45, change: 1.80, marketCap: 16100000000, volume: 420000000 },
  ],
  goldPrices: {
    ounce: { price: 2323.64, change: 0.68, changeAmt: 15.87, high: 2336.10, low: 2298.45 },
    gram: { price: 74.70, change: 0.51 },
    tola: { price: 871.35, change: 0.68 },
  },
  aiInsights: [
    {
      id: 1,
      category: 'Macro Analysis',
      sentiment: 'Strong Bullish',
      title: 'Quantum AI Models Predict Institutional Capital Flight into Tier-1 Crypto Assets',
      summary: 'Aureus proprietary neural networks have detected significant anomalies in institutional liquidity flows, suggesting a preemptive rotation from traditional fixed income into sovereign-grade digital assets.',
      date: 'Oct 24, 2024',
      image: 'https://lh3.googleusercontent.com/aida/AP1WRLtnd6EJ450sSOsYT3qhVJ9qilwmF58ptrrNrcvZRauXVSyqqzkt1wrMAB-aDOygMdoRLdqNqYrcs4foik0B5v9Lyk-6uN0Hknz-oUuTfC0tm486mI00pI_7s_qZN8OW_IuF2xipAlxEqYuXHGBdqwjTPYshG1Z_zMSB8gb8M0gsk0stcfeg3TQDAVwUAe0KZowbJd6XQiWk-csj92vxAG-w3nX796UigV0ZQ6bkIhLWb60uIsMx8G4rZzA'
    },
    {
      id: 2,
      category: 'Algorithmic Trading',
      sentiment: 'Bearish',
      title: 'High-Frequency Trading Desk Volumes Signal Short-Term Correction in Precious Metals',
      summary: 'Sentiment analysis across major liquidity pools indicates algorithmic sell pressure building on XAU/USD technical resistance levels. Look for support at the 200-day moving average.',
      date: '4 hours ago',
      image: 'https://lh3.googleusercontent.com/aida/AP1WRLsGOUre6A6Xzp_bMoGm4qSnuveuQhxPFGgvZXZeVkPRNpG1Mn3RiaOMMMbL_454qPxnytzJhTAmjFcDCXM9eqX3UPsOkEjYMSUj_gsErgTHHgn9ldyO6RVA2pwrIhU0CkAszAebvV6w5Enlq-ly2df40MOdPJ3gZfquvCbX2rh-Pi0IJLKr0DGt3q6CkG5_07rgdGjiidE1DYS4ejarxrFIbfEEQcdofmz6Sgx8PJbcXsFFMVaTPy9E3x6O'
    },
    {
      id: 3,
      category: 'AI Insights',
      sentiment: 'Bullish',
      title: 'Deep Learning Analysis of Federal Reserve Minutes Uncovers Hidden Dovish Pivot',
      summary: 'NLP processing of the latest FOMC transcripts reveals a subtle but statistically significant shift in semantic sentiment, suggesting rate cuts may arrive a quarter earlier than market consensus.',
      date: '8 hours ago',
    }
  ],
  chartData: {
    gold1D: Array.from({ length: 48 }).map((_, i) => ({
      time: `${Math.floor(i/2)}:${i%2===0?'00':'30'}`,
      price: 2300 + Math.sin(i/5) * 20 + Math.random() * 10 + (i * 0.5)
    })),
    btc1D: Array.from({ length: 48 }).map((_, i) => ({
      time: `${Math.floor(i/2)}:${i%2===0?'00':'30'}`,
      price: 63000 + Math.cos(i/4) * 500 + Math.random() * 200 + (i * 30)
    })),
    silver1D: Array.from({ length: 48 }).map((_, i) => ({
      time: `${Math.floor(i/2)}:${i%2===0?'00':'30'}`,
      price: 26 + Math.cos(i/3) * 1.5 + Math.random() * 0.5 + (i * 0.05)
    }))
  }
};
