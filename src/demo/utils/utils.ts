import type { Options } from 'prettier';
import prettierPluginEstree from 'prettier/plugins/estree';
import prettierPluginHtml from 'prettier/plugins/html';
import prettierPluginTypeScript from 'prettier/plugins/typescript';
import * as prettier from 'prettier/standalone';

/**
 * Prettifies the given code snippet.
 * @param snippet The code snippet to prettify.
 * @returns The prettified code snippet.
 */
export async function prettify(snippet: string): Promise<string> {
    const options: Options = {
        parser: 'typescript',
        plugins: [prettierPluginTypeScript, prettierPluginEstree, prettierPluginHtml],
        printWidth: 80,
        tabWidth: 4,
        singleQuote: true,
        trailingComma: 'all'
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
            console.error('Error formatting code:', error);

            // 3) Last resort: leave as-is
            return snippet;
        }
    }
}
