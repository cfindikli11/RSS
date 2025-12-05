import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testMarket() {
    try {
        console.log('Testing /api/v1/market...');
        const res = await fetch(`${BASE_URL}/api/v1/market`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Market Data:', data);

        if (data.usd && data.eur && data.btc) {
            console.log('✅ Market data structure is valid');
        } else {
            console.error('❌ Missing required market data fields');
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testMarket();
