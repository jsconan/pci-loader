import terser from '@rollup/plugin-terser';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import type { AliasOptions, ESBuildOptions, PluginOption, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import type { ViteUserConfig } from 'vitest/config';
import packageInfo from './package.json';

const markdownSuffixes = ['.md', 'LICENSE'];
const isMarkdownFile = (id: string): boolean => markdownSuffixes.some(suffix => id.endsWith(suffix));

const externalDependencies = [
    ...Object.keys(packageInfo.dependencies || {}),
    ...Object.keys(packageInfo.peerDependencies || {})
];

const esbuild: ESBuildOptions = {
    legalComments: 'inline'
};
const plugins: PluginOption[] = [
    svelte(),
    dts({
        insertTypesEntry: true,
        rollupTypes: true,
        copyDtsFiles: true
    }),
    // Custom plugin to load markdown files
    {
        name: 'markdown-loader',
        transform(code, id) {
            if (isMarkdownFile(id)) {
                // For .md files, get the raw content
                return `export default ${JSON.stringify(code)};`;
            }
            return undefined;
        }
    }
];
const alias: AliasOptions = {
    src: resolve(__dirname, 'src/'),
    lib: resolve(__dirname, 'src/lib'),
    demo: resolve(__dirname, 'src/demo'),
    tests: resolve(__dirname, 'tests/'),
    root: resolve(__dirname)
};

// Library build config
export const libConfig: ViteUserConfig = {
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        copyPublicDir: false,
        sourcemap: true,
        minify: 'esbuild',
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: packageInfo.name,
            fileName: format => `index.${format}.js`
        },
        rollupOptions: {
            plugins: [terser()],
            external: (id: string) => externalDependencies.some(dep => id.startsWith(dep)),
            output: {
                compact: true
            }
        }
    },
    esbuild,
    plugins,
    resolve: {
        alias
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
};

// Demo app config
export const staticConfig: UserConfig = {
    // base: './',
    build: {
        outDir: resolve(__dirname, 'static'),
        emptyOutDir: true,
        copyPublicDir: true,
        minify: 'esbuild',
        rollupOptions: {
            plugins: [terser()],
            output: {
                compact: true,
                manualChunks: {
                    'svelte-highlight': ['svelte-highlight'],
                    prettier: ['prettier/standalone'],
                    'prettier-plugin-estree': ['prettier/plugins/estree'],
                    'prettier-plugin-html': ['prettier/plugins/html'],
                    'prettier-plugin-typescript': ['prettier/plugins/typescript'],
                    readme: ['root/README.md'],
                    changelog: ['root/CHANGELOG.md'],
                    license: ['root/LICENSE']
                }
            }
        }
    },
    esbuild,
    plugins,
    resolve: {
        alias
    }
};
