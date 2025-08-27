<script lang="ts">
    import CopyToClipboard from 'demo/components/CopyToClipboard.svelte';
    import { prettify } from 'demo/utils/utils.ts';
    import { Highlight, LineNumbers } from 'svelte-highlight';
    import language from 'svelte-highlight/languages/javascript';

    interface Props {
        code: string | undefined;
        autoformat?: boolean;
    }

    let { code, autoformat = false }: Props = $props();

    let formattedCode: string | undefined = $derived(code);

    if (autoformat) {
        $effect(() => {
            prettify(code || '').then(async () => {
                formattedCode = await prettify(code || '');
            });
        });
    }
</script>

<CopyToClipboard content={formattedCode}>
    <Highlight {language} code={formattedCode} let:highlighted>
        <LineNumbers {highlighted} />
    </Highlight>
</CopyToClipboard>
