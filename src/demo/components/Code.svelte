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
        (async () => {
            formattedCode = await prettify(code || '');
        })();
    }
</script>

<CopyToClipboard content={formattedCode}>
    <div>
        <Highlight {language} code={formattedCode} let:highlighted>
            <LineNumbers {highlighted} />
        </Highlight>
    </div>
</CopyToClipboard>

<style>
    @media (max-width: 1200px) {
        div {
            font-size: 1.8rem;
        }
    }
    @media (max-width: 1000px) {
        div {
            font-size: 1.6rem;
        }
    }

    @media (max-width: 800px) {
        div {
            font-size: 1.4rem;
        }
    }

    @media (max-width: 600px) {
        div {
            font-size: 1.2rem;
        }
    }
</style>
