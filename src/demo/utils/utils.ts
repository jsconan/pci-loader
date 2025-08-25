import type { Options } from 'prettier';
import prettierPluginEstree from 'prettier/plugins/estree';
import prettierPluginHtml from 'prettier/plugins/html';
import prettierPluginTypeScript from 'prettier/plugins/typescript';
import * as prettier from 'prettier/standalone';

/**
 * Prettifies the given code snippet.
 * @param snippet The code snippet to prettify.
 * @param notify Whether to log errors to the console.
 * @returns The prettified code snippet.
 */
export async function prettify(snippet: string, notify: boolean = false): Promise<string> {
    const options: Options = {
        parser: 'typescript',
        plugins: [prettierPluginTypeScript, prettierPluginEstree, prettierPluginHtml],
        printWidth: 80,
        tabWidth: 4,
        useTabs: false,
        semi: true,
        singleQuote: true,
        quoteProps: 'as-needed',
        trailingComma: 'none',
        bracketSpacing: true,
        arrowParens: 'avoid',
        endOfLine: 'lf',
        bracketSameLine: true
    };

    try {
        // 1) Try as full program
        return await prettier.format(snippet, options);
    } catch {
        try {
            // 2) Fallback: try as expression
            const wrapped = `export const snippet = ${snippet}`;
            const out = await prettier.format(wrapped, options);
            return out.replace(/^export const snippet = /, '').replace(/;\s*$/, '');
        } catch (error) {
            if (notify) {
                console.error('Error formatting code:', error);
            }

            // 3) Last resort: leave as-is
            return snippet;
        }
    }
}

/**
 * Serializes the given resource into a string representation.
 * @param resource The resource to serialize.
 * @param track A set of already visited resources to avoid circular references.
 * @returns The serialized string representation of the resource.
 */
export function serializeCode(resource: unknown, track?: Set<unknown>): string {
    track = track || new Set();

    if (typeof resource === 'undefined') {
        return 'undefined';
    }
    if (typeof resource === 'function') {
        return resource.toString();
    }
    if (resource === null) {
        return 'null';
    }
    if (Array.isArray(resource)) {
        if (track.has(resource)) {
            return '[Circular]';
        }
        track.add(resource);
        return `[${resource.map(item => serializeCode(item, track)).join(', ')}]`;
    }
    if (typeof resource === 'object') {
        if (track.has(resource)) {
            return '[Circular]';
        }
        track.add(resource);
        const entries = Object.entries(resource).map(([key, value]) => {
            if (typeof value === 'function') {
                const fnStr = value.toString();
                if (fnStr.match(/^function\s*\(/)) {
                    return `${key}${fnStr.replace(/^function/, '')}`;
                }
                if (fnStr.match(/^function\s+\w+/) || fnStr.match(/^\s*((\w+)|(\([^)]+\)))\s*=>/)) {
                    return `"${key}": ${fnStr}`;
                }
                return `${fnStr}`;
            }
            return `"${key}": ${serializeCode(value, track)}`;
        });
        return `{${entries.join(', ')}}`;
    }
    return JSON.stringify(resource);
}
