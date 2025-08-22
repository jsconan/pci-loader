import terser from '@rollup/plugin-terser';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import packageInfo from './package.json';

const externalDependencies = [
    ...Object.keys(packageInfo.dependencies || {}),
    ...Object.keys(packageInfo.peerDependencies || {})
];

export default defineConfig({
    build: {
        minify: 'esbuild',
        sourcemap: true,
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: packageInfo.name,
            fileName: format => `index.${format}.js`
        },
        rollupOptions: {
            plugins: [terser()],
            external: id => externalDependencies.some(dep => id.startsWith(dep)),
            output: {
                compact: true
            }
        }
    },
    esbuild: {
        legalComments: 'inline'
    },
    plugins: [
        svelte(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true,
            copyDtsFiles: true
        })
    ],
    resolve: {
        alias: {
            src: resolve(__dirname, 'src/'),
            lib: resolve(__dirname, 'src/lib'),
            demo: resolve(__dirname, 'src/demo'),
            tests: resolve(__dirname, 'tests/')
        }
    },
    test: {
        expect: { requireAssertions: true },
        setupFiles: ['tests/setup/setup-tests.ts'],
        include: ['tests/**/*.{test,spec}.{js,ts}'],
        exclude: ['src/**/*.{js,ts}'],
        coverage: {
            provider: 'v8',
            reportsDirectory: '.coverage',
            reporter: ['text', 'html', 'clover'],
            include: ['src/**/*.{js,ts}'],
            exclude: ['*.config.*', '*.d.ts', 'src/main.ts', 'src/demo'],
            thresholds: {
                statements: 80,
                functions: 80,
                lines: 80,
                branches: 80
            }
        }
    }
});
