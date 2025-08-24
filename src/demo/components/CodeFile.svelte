<script lang="ts">
    import Code from 'demo/components/Code.svelte';

    interface Props {
        url?: string;
    }

    let { url }: Props = $props();
    let code: string = $state('');
    let fileName: string = $state('');

    (async () => {
        if (url) {
            fileName = url.split('/').pop() || '';
            const response = await fetch(url);
            code = await response.text();
        }
    })();
</script>

<article>
    <header>File: <code>{fileName}</code></header>
    <Code {code} />
</article>

<style>
    article {
        margin: 0;
        padding: 0;
    }

    header {
        font-weight: bold;
        margin: 1em 0 0.5em 0;
    }
</style>
