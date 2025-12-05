import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './src/frontend',
    publicDir: 'public',
    build: {
        outDir: '../../dist/frontend',
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/frontend/index.html'),
            },
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
                ws: true,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            },
        },
    },
});
