import axios from 'axios';

export class MetalsDataManager {
  private static CACHE_TTL = 60000; // 1 minute client-side cache
  private static cachedData: any = null;
  private static lastFetchTime = 0;

  /**
   * Fetches real-time market data.
   * securely requests data from our server-side proxy to keep METALS_API_KEY hidden from the browser.
   */
  static async getLiveRates() {
    const now = Date.now();
    if (this.cachedData && now - this.lastFetchTime < this.CACHE_TTL) {
      return this.cachedData;
    }

    try {
      const response = await axios.get('/api/metals');
      if (response.data && response.data.rates) {
        this.cachedData = response.data;
        this.lastFetchTime = now;
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching metals data from proxy:', error);
      throw error;
    }
  }
}
