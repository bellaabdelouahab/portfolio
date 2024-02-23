import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const env = dotenv.config().parsed;

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [react()],
        resolve: {
            alias: {
                'components': '/src/components',
                'views': '/src/views',
                'assets': '/src/assets',
                'utils': '/src/utils',
            },
        },
        define: {
            'process.env': env,
        },
        
        server: {
            port: 3000,
            open: true,
        },
        
        optimizeDeps: {
            include: ['axios', 'react-router-dom'],
        },
        
        esbuild: {
            jsxInject: `import React from 'react';`,
        },
    };
});