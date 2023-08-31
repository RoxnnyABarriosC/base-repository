import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import * as process from 'process';

const check = process.argv.includes('--CHECK');

const alias  =  {
    '@src': './src',
    '@config': './src/config',
    '@shared': './src/shared',
    '@modules': './src/modules'
};

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        root: './',
        alias,
        coverage: {
            all: true,
            provider: 'v8',
            reporter: ['text', 'html', 'json', 'json-summary'],
            include: ['src'],
            exclude: ['src/**/index.*', 'src/**/__mocks__/*', 'src/**/__stubs__/*'],
            ...(check ? {
                lines: 80,
                statements: 80,
                functions: 80,
                branches: 80
            } : {})
        },
        testTimeout: 16000,
        setupFiles: [
            'dotenv/config'
        ],
        include: ['src/**/*.spec.ts'],
        exclude: ['src/**/__mocks__/*', 'src/**/__stubs__/*']
    },
    resolve: {
        alias
    },
    plugins: [
        // This is required to build the test files with SWC
        swc.vite({
            // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
            module: { type: 'es6' }
        })
    ]
});
