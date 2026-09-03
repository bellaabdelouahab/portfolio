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
        // Client-only: browsers have no real `process.env`, so Vite statically
        // replaces every `process.env.X` reference with a build-time snapshot
        // (this is how src/shared/lib/firebase.js's client config gets baked
        // into the browser bundle). Applying this to the SSR build too — it
        // used to be unconditional here — silently froze `process.env` for
        // the *server* bundle to that same build-time snapshot, which can
        // never contain a runtime-only secret like GOOGLE_APPLICATION_CREDENTIALS
        // or FIREBASE_SERVICE_ACCOUNT (shared/lib/firebaseAdmin.js): the SSR
        // bundle then saw that env var as permanently undefined no matter what
        // the actual container environment provided at runtime. The SSR build
        // runs in real Node, where `process.env.X` already does the right
        // thing on its own — it needs no define at all.
        define: isSsrBuild
            ? {}
            : {
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