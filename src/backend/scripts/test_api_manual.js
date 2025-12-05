import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer() {
    console.log('Waiting for server to be ready...');
    for (let i = 0; i < 30; i++) {
        try {
            const res = await fetch(`${BASE_URL}/health`);
            if (res.ok) {
                console.log('Server is ready!');
                return;
            }
        } catch (e) {
            // ignore
        }
        await wait(1000);
    }
    throw new Error('Server failed to start');
}

async function testEndpoints() {
    try {
        await waitForServer();

        // 1. Test Health
        console.log('\nTesting /health...');
        const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
        console.log('Health:', health);

        // 2. Test News
        console.log('\nTesting /api/v1/news...');
        const news = await fetch(`${BASE_URL}/api/v1/news`).then(r => r.json());
        console.log('News count:', news.articles ? news.articles.length : 0);

        // 3. Test Feeds
        console.log('\nTesting /api/v1/feeds...');
        const feeds = await fetch(`${BASE_URL}/api/v1/feeds`).then(r => r.json());
        console.log('Feeds count:', feeds.feeds ? feeds.feeds.length : 0);

        // 4. Test Auth (Signup)
        const randomId = Math.floor(Math.random() * 10000);
        const user = {
            username: `testuser${randomId}`,
            email: `test${randomId}@example.com`,
            password: 'password123'
        };
        console.log(`\nTesting /api/v1/auth/signup with ${user.email}...`);
        const signupRes = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const signupData = await signupRes.json();
        console.log('Signup result:', signupRes.status, signupData);

        if (signupRes.ok) {
            // 5. Test Auth (Login)
            console.log('\nTesting /api/v1/auth/login...');
            const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, password: user.password })
            });
            const loginData = await loginRes.json();
            console.log('Login result:', loginRes.status, loginData.token ? 'Token received' : 'No token');
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testEndpoints();
