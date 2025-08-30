import terser from '@rollup/plugin-terser';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import type { AliasOptions, ESBuildOptions, PluginOption, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import ogPlugin from 'vite-plugin-open-graph';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import type { ViteUserConfig } from 'vitest/config';
import packageInfo from './package.json';

const baseUrl = `${process.env.BASE_URL || ''}/`.replace(/\/+/g, '/');

const markdownSuffixes = ['.md', 'LICENSE'];
const isMarkdownFile = (id: string): boolean => markdownSuffixes.some(suffix => id.endsWith(suffix));

const externalDependencies = [...Object.keys(packageInfo.dependencies || {})];

// Global constants injected by Vite's define
const define: Record<string, string> = {
    __BASE_URL__: JSON.stringify(baseUrl)
};

// Common esbuild options
const esbuild: ESBuildOptions = {
    legalComments: 'inline'
};

// Common plugins
const plugins: PluginOption[] = [
    svelte(),
    dts({
        insertTypesEntry: true,
        rollupTypes: true,
        copyDtsFiles: true
    }),
    ogPlugin({
        basic: {
            title: packageInfo.name,
            description: packageInfo.description,
            image: {
                url: `${packageInfo.homepage.replace(/\/+$/, '')}/preview.png`,
                alt: packageInfo.description,
                width: 1200,
                height: 683
            },
            url: packageInfo.homepage,
            type: 'website'
        }
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

// Project aliases
const alias: AliasOptions = {
    src: resolve(__dirname, 'src/'),
    lib: resolve(__dirname, 'src/lib'),
    demo: resolve(__dirname, 'src/demo'),
    tests: resolve(__dirname, 'tests/'),
    root: resolve(__dirname)
};

// Library build config
export const libConfig: ViteUserConfig = {
    define,
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
    base: baseUrl,
    define,
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
    plugins: [
        ...plugins,
        // Copy HTML files and inject Vite's global constants into them
        viteStaticCopy({
            targets: [
                {
                    src: 'public/*.html',
                    dest: '.',
                    transform: contents => contents.toString().replace(/__BASE_URL__/g, baseUrl)
                }
            ]
        })
    ],
    resolve: {
        alias
    }
};
