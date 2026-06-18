import { useState, useEffect } from 'react';
import { MARKET_DATA } from '../lib/data';
import { MetalsDataManager } from '../services/metalsApi';

export interface MarketItem {
  symbol: string;
  name?: string;
  price: number;
  change: number;
}

export function useMetalsMarket() {
  const [tickerData, setTickerData] = useState<MarketItem[]>(MARKET_DATA.ticker);
  const [cryptoRankings, setCryptoRankings] = useState(MARKET_DATA.cryptoRankings);
  const [goldPrices, setGoldPrices] = useState(MARKET_DATA.goldPrices);
  const [silverPrices, setSilverPrices] = useState({
    ounce: { price: 28.45, change: 1.1, changeAmt: 0.31, high: 29.1, low: 28.0 },
    gram: { price: 0.91, change: 1.1 },
    tola: { price: 10.6, change: 1.1 }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetals = async () => {
      try {
        const data = await MetalsDataManager.getLiveRates();
        if (data && data.rates) {
          const rates = data.rates;

          // Compute the live prices
          const goldPriceOunce = rates.USDXAU || 1 / rates.XAU;
          const silverPriceOunce = rates.USDXAG || 1 / rates.XAG;
          const platPriceOunce = rates.USDXPT || 1 / rates.XPT;
          const pallPriceOunce = rates.USDXPD || 1 / rates.XPD;

          // Convert ounce to gram and tola (approximate factor: 1 ounce ~ 31.1035 grams, 1 tola ~ 11.66 grams)
          const ozToGram = 31.1034768;
          const gramToTola = 11.6638038;

          // For ticker data, let's keep BTC, ETH static or generate a mock for them if we don't have endpoints
          // Note: our endpoint only fetches metals. We can update just the metals in the ticker.
          const newTicker = MARKET_DATA.ticker.map(item => {
            if (item.symbol === 'XAU/USD') return { ...item, price: goldPriceOunce, change: 0.12 }; // default mock change
            if (item.symbol === 'XAG/USD') return { ...item, price: silverPriceOunce, change: 0.05 };
            if (item.symbol === 'XPT/USD') return { ...item, price: platPriceOunce, change: -0.1 };
            if (item.symbol === 'XPD/USD') return { ...item, price: pallPriceOunce, change: 0.2 };
            if (item.symbol === 'BTC/USD' && rates.USDBTC) return { ...item, price: rates.USDBTC, change: 1.5 };
            if (item.symbol === 'ETH/USD' && rates.USDETH) return { ...item, price: rates.USDETH, change: 0.8 };
            return item;
          });

          setTickerData(newTicker);

          const newCrypto = MARKET_DATA.cryptoRankings.map(crypto => {
            if (crypto.symbol === 'BTC' && rates.USDBTC) {
              return { ...crypto, price: rates.USDBTC, marketCap: rates.USDBTC * 19700000 };
            }
            if (crypto.symbol === 'ETH' && rates.USDETH) {
              return { ...crypto, price: rates.USDETH, marketCap: rates.USDETH * 120000000 };
            }
            return crypto;
          });
          setCryptoRankings(newCrypto);

          // Update gold detailed prices
          setGoldPrices({
            ounce: {
              ...MARKET_DATA.goldPrices.ounce,
              price: goldPriceOunce,
              changeAmt: goldPriceOunce * 0.0012, // approx based on mock 0.12% change
              low: goldPriceOunce * 0.99,
              high: goldPriceOunce * 1.01
            },
            gram: {
              ...MARKET_DATA.goldPrices.gram,
              price: goldPriceOunce / ozToGram
            },
            tola: {
              ...MARKET_DATA.goldPrices.tola,
              price: (goldPriceOunce / ozToGram) * gramToTola
            }
          });

          // Update silver detailed prices
          setSilverPrices({
            ounce: {
              price: silverPriceOunce,
              change: 0.05,
              changeAmt: silverPriceOunce * 0.0005,
              low: silverPriceOunce * 0.98,
              high: silverPriceOunce * 1.02
            },
            gram: {
              price: silverPriceOunce / ozToGram,
              change: 0.05
            },
            tola: {
              price: (silverPriceOunce / ozToGram) * gramToTola,
              change: 0.05
            }
          });
        }
      } catch (err) {
        console.error("Failed to load live metals data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetals();
    // Poll every 5 minutes if desired
    const interval = setInterval(fetchMetals, 300000);
    return () => clearInterval(interval);
  }, []);

  return { tickerData, cryptoRankings, goldPrices, silverPrices, isLoading };
}
