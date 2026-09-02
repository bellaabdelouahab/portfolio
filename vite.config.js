import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
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

export default defineConfig(({ mode, isSsrBuild }) => {
    return {
        build: {
            outDir: 'build',
            rollupOptions: !isSsrBuild
                ? {
                    // firebase-admin (server-only Firestore access, see
                    // shared/lib/firebaseAdmin.js) is only ever reached via a
                    // dynamic import behind a `typeof window === "undefined"`
                    // check, so it never actually runs in the browser — but
                    // Rollup still statically traces dynamic imports to build
                    // their chunk, and firebase-admin's dependency tree uses
                    // Node built-ins with no browser equivalent, which fails
                    // the client build outright. Externalizing it here stops
                    // Rollup from tracing into it for the client bundle; the
                    // SSR build (isSsrBuild) still resolves and bundles it
                    // normally, since it genuinely runs in Node there.
                    external: [/^firebase-admin(\/.*)?$/],
                }
                : undefined,
        },
        plugins: [
            react(),
            tailwindcss(),
        ],
        resolve: {
            // NOTE for CSS authors: always reference bundled images through the
            // 'assets' alias, e.g. url("assets/images/foo.png"). Relative paths
            // like url(../images/foo.png) resolve against the stylesheet's own
            // location, so they break silently the moment the file is moved.
            // Files under public/ are the exception — reference those from the
            // site root, e.g. url("/preloader.png").
            alias: {
                'assets': '/src/shared/assets',
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