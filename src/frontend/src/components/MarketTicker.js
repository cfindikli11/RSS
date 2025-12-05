import { api } from '../utils/api.js';

export class MarketTicker {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'market-ticker';
        this.startTicker();
    }

    async fetchMarketData() {
        try {
            const res = await fetch(`${api.baseURL}/api/v1/market`);
            if (!res.ok) throw new Error('Failed to fetch market data');
            return await res.json();
        } catch (error) {
            console.error('Market data fetch error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            return null;
        }
    }

    formatCurrency(value, currency = 'TRY', decimals = 2) {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    }

    async update() {
        console.log('MarketTicker: Updating...');
        const data = await this.fetchMarketData();
        console.log('MarketTicker: Data received', data);

        if (!data) {
            this.element.innerHTML = '<div class="ticker-item error">Data Unavailable</div>';
            return;
        }

        const { usd, eur, btc, gold } = data;

        this.element.innerHTML = `
            <div class="ticker-item" title="Dolar/TL">
                <span class="ticker-label">$</span>
                <span class="ticker-value">${this.formatCurrency(usd)}</span>
            </div>
            <div class="ticker-item" title="Euro/TL">
                <span class="ticker-label">€</span>
                <span class="ticker-value">${this.formatCurrency(eur)}</span>
            </div>
            <div class="ticker-item" title="Bitcoin/USD">
                <span class="ticker-label">₿</span>
                <span class="ticker-value">${this.formatCurrency(btc, 'USD', 0)}</span>
            </div>
            ${gold ? `
            <div class="ticker-item" title="Gram Altın (TL)">
                <span class="ticker-label">Au</span>
                <span class="ticker-value">${this.formatCurrency(gold, 'TRY', 0)}</span>
            </div>
            ` : ''}
        `;
    }

    startTicker() {
        this.update();
        // Update every 5 minutes
        setInterval(() => this.update(), 5 * 60 * 1000);
    }

    render() {
        return this.element;
    }
}
