import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    prettier,
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        },
        rules: {
            // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
            // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
            'no-undef': 'off',

            'arrow-body-style': ['error', 'as-needed'],
            'consistent-this': ['error', 'self'],
            'no-alert': ['error'],
            'no-caller': ['error'],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'no-duplicate-imports': ['error'],
            'no-eval': ['error'],
            'no-extend-native': ['error'],
            'no-extra-bind': ['error'],
            'no-implied-eval': ['error'],
            'no-lone-blocks': ['error'],
            'no-multi-assign': ['error'],
            'no-script-url': ['error'],
            'no-self-compare': ['error'],
            'no-sequences': ['error'],
            'no-shadow': ['error', { hoist: 'functions' }],
            'no-template-curly-in-string': ['error'],
            'no-throw-literal': ['error'],
            'no-use-before-define': ['error', { functions: false }],
            'no-useless-call': ['error'],
            'no-useless-computed-key': ['error'],
            'no-useless-rename': ['error'],
            'prefer-rest-params': ['error'],
            'prefer-spread': ['error'],
            'prefer-template': ['error'],
            curly: ['error', 'all'],
            eqeqeq: ['error', 'smart']
        }
    }
);
