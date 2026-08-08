import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

let env = dotenv.config().parsed || process.env;
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
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

export default defineConfig(({ mode }) => {
    return {
        build: {
            outDir: 'build',
        },
        // Prerendering runs as a separate post-build step (scripts/prerender.js).
        // The old vite-plugin-prerender/jsdom setup silently produced nothing:
        // jsdom snapshotted before the lazy chunks and Firestore reads resolved,
        // so every deploy shipped an empty <div id="root">.
        plugins: [
            react(),
        ],
        resolve: {
            // NOTE for CSS authors: always reference bundled images through the
            // 'assets' alias, e.g. url("assets/images/foo.png"). Relative paths
            // like url(../images/foo.png) resolve against the stylesheet's own
            // location, so they break silently the moment the file is moved.
            // Files under public/ are the exception — reference those from the
            // site root, e.g. url("/preloader.png").
            alias: {
                'assets': '/src/assets',
                'utils': '/src/utils',
                'shared': '/src/shared',
                'front-office': '/src/front-office',
                'back-office': '/src/back-office',
            },
        },
        define: {
            'process.env': {
                ...env,
                NODE_ENV: mode === 'production' ? 'production' : 'development',
            },
        },
        server: {
            port: 3000,
        },
        optimizeDeps: {
            include: ['react-router-dom'],
        },
        esbuild: {
            jsxInject: `import React from 'react';`,
        },
        base: "/",
    };
});