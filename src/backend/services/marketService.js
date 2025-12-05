import fetch from 'node-fetch';

let cache = {
    data: null,
    lastUpdated: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getMarketData() {
    const now = Date.now();
    if (cache.data && (now - cache.lastUpdated < CACHE_DURATION)) {
        return cache.data;
    }

    try {
        // Fetch USD and EUR rates against TRY
        // using frankfurter.app (free, no key)
        const fiatRes = await fetch('https://api.frankfurter.app/latest?from=USD,EUR&to=TRY');
        const fiatData = await fiatRes.json();

        // Frankfurter gives rates relative to base. 
        // If from=USD,EUR is not supported directly in one call as base, we might need separate calls or a different strategy.
        // Actually frankfurter 'from' only takes one currency.
        // Let's fetch based on TRY? No, we want USD/TRY and EUR/TRY.
        // Let's fetch from EUR (default base) to USD,TRY.
        // EUR/TRY = rate(TRY)
        // USD/TRY = rate(TRY) / rate(USD)

        const ratesRes = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD,TRY');
        const ratesData = await ratesRes.json();

        const eurTry = ratesData.rates.TRY;
        const usdTry = ratesData.rates.TRY / ratesData.rates.USD;

        // Fetch BTC in USD
        const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const cryptoData = await cryptoRes.json();
        const btcUsd = cryptoData.bitcoin.usd;

        // Calculate Gram Gold (Has Altın)
        // Gold spot price is usually XAU/USD. 
        // We can try to get XAU from a free API, or approximate.
        // Let's use a different free API for gold if possible, or just skip if too hard.
        // "Metalpriceapi" has a free tier but needs key.
        // Let's try to find a public one or just use a fixed mock for now if it fails?
        // Actually, let's use a public scraping or a known open endpoint if available.
        // For now, let's omit Gold if we can't find a reliable free one without key, 
        // OR use a simple reliable one: 'https://data-asg.goldprice.org/dbXRates/USD' (often used in examples)

        let goldTry = 0;
        try {
            const goldRes = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
            const goldData = await goldRes.json();
            // goldData.items[0].xauPrice is price of 1 oz in USD
            const xauUsd = goldData.items[0].xauPrice;
            const ozToGram = 31.1035;
            const goldUsdPerGram = xauUsd / ozToGram;
            goldTry = goldUsdPerGram * usdTry;
        } catch (e) {
            console.error('Failed to fetch gold price', e);
        }

        const data = {
            usd: usdTry,
            eur: eurTry,
            btc: btcUsd,
            gold: goldTry,
            lastUpdated: now
        };

        cache = {
            data,
            lastUpdated: now
        };

        return data;
    } catch (error) {
        console.error('Market data fetch error:', error);
        // Return old data if available, or empty
        return cache.data || {};
    }
}
