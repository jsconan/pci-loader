<script lang="ts">
    import Code from 'demo/components/Code.svelte';

    interface Props {
        url?: string;
        autoformat?: boolean;
    }

    let { url, autoformat = false }: Props = $props();
    let code: string = $state('');
    let fileName: string = $state('');

    $effect(() => {
        if (url) {
            fileName = url.split('/').pop() || '';
            fetch(url)
                .then(async response => {
                    code = await response.text();
                })
                .catch(err => {
                    code = `// Error loading code: ${err.message}`;
                });
        }
    });
</script>

<article>
    <header>File: <code>{fileName}</code></header>
    <Code {code} {autoformat} />
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
