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
    };
});