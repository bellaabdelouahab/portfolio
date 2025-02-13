import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

let env = dotenv.config().parsed || process.env;
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction ) {
    // check if the .env.development file exists
    if (fs.existsSync('.env')) {
        env = dotenv.parse(fs.readFileSync('.env'));
    } else {
        console.error('No .env file found using default environment variables .env.example');
        env = dotenv.parse(fs.readFileSync('.env.example'));
    }
} else if (isProduction) {
    if (fs.existsSync('.env.production')) {
        env = dotenv.parse(fs.readFileSync('.env.production'));
    } else {
        if (fs.existsSync('.env')) {
            env = dotenv.parse(fs.readFileSync('.env'));
        } else {
            console.error('No .env file found using default environment variables .env.example');
            env = dotenv.parse(fs.readFileSync('.env.example'));
        }
    }
}

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
        },
        
        optimizeDeps: {
            include: ['axios', 'react-router-dom'],
        },
        
        esbuild: {
            jsxInject: `import React from 'react';`,
        },
        base: '/bellaabdelouahab/portfolio/',
    };
});