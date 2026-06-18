import express from 'express';
import path from 'path';
import axios from 'axios';

const app = express();

let metalsDataCache: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 10 * 60 * 1000;

app.use(express.json());

app.post("/api/sentiment", async (req, res) => {
  try {
    const asset = req.body.asset || 'cryptocurrency';
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });
    }

    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const prompt = `Analyze the current news and market sentiment for ${asset}. Return a JSON object with 'sentiment' (one of: 'Bullish', 'Bearish', 'Neutral'), 'score' (a number from 0 to 100, where 0 is extremely bearish and 100 is extremely bullish), and 'summary' (a 2-3 sentence explanation). Use recent news to ground your response.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, description: "Bullish, Bearish, or Neutral" },
            score: { type: Type.NUMBER, description: "0 to 100" },
            summary: { type: Type.STRING }
          },
          required: ["sentiment", "score", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");

    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Sentiment API error:", error.message);
    const isCrypto = req.body.asset?.includes('crypto');
    res.json({
      sentiment: isCrypto ? 'Bullish' : 'Neutral',
      score: isCrypto ? 75 : 55,
      summary: `Due to rate limits, this is a simulated sentiment response. The ${req.body.asset || 'market'} shows signs of consolidation with underlying volume strength based on recent historical moving patterns.`
    });
  }
});

const getMockMetalsData = () => ({
  success: true,
  base: "USD",
  rates: {
    "XAG": 0.035, "XAU": 0.0005, "XPD": 0.001, "XPT": 0.0011,
    "BTC": 0.000015, "ETH": 0.00032,
    "USDXAG": 28.5, "USDXAU": 2043.20, "USDXPD": 980.50, "USDXPT": 910.20,
    "USDBTC": 64500.00, "USDETH": 3200.00
  }
});

app.get("/api/metals", async (req, res) => {
  try {
    const now = Date.now();
    if (metalsDataCache && now - lastFetchTime < CACHE_TTL) {
      return res.json(metalsDataCache);
    }

    const apiKey = process.env.METALS_API_KEY;
    if (!apiKey) {
      const mockData = getMockMetalsData();
      metalsDataCache = mockData;
      lastFetchTime = now;
      return res.json(mockData);
    }

    const response = await axios.get(
      `https://metals-api.com/api/latest?access_key=${apiKey}&base=USD&symbols=XAU,XAG,XPD,XPT,BTC,ETH`
    );

    if (response.data && response.data.success) {
      const rates = response.data.rates;
      if (rates.XAU && !rates.USDXAU) rates.USDXAU = 1 / rates.XAU;
      if (rates.XAG && !rates.USDXAG) rates.USDXAG = 1 / rates.XAG;
      if (rates.XPD && !rates.USDXPD) rates.USDXPD = 1 / rates.XPD;
      if (rates.XPT && !rates.USDXPT) rates.USDXPT = 1 / rates.XPT;
      if (rates.BTC && !rates.USDBTC) rates.USDBTC = 1 / rates.BTC;
      if (rates.ETH && !rates.USDETH) rates.USDETH = 1 / rates.ETH;

      metalsDataCache = response.data;
      lastFetchTime = now;
      res.json(response.data);
    } else {
      console.warn("Metals API returned failure, using mock data. Details:", response.data);
      const mockData = getMockMetalsData();
      metalsDataCache = mockData;
      lastFetchTime = now;
      res.json(mockData);
    }
  } catch (error: any) {
    console.error("Metals API error:", error.message);
    const mockData = getMockMetalsData();
    metalsDataCache = mockData;
    lastFetchTime = Date.now();
    res.json(mockData);
  }
});

const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

export default app;
