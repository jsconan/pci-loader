<script lang="ts">
    import SvelteMarkdown, { defaultRenderers } from '@humanspeak/svelte-markdown';
    import MarkdownCode from 'demo/components/MarkdownCode.svelte';
    import MarkdownCodespan from 'demo/components/MarkdownCodespan.svelte';

    interface Props {
        source: string;
    }

    let { source }: Props = $props();

    const renderers = {
        ...defaultRenderers,
        code: MarkdownCode,
        codespan: MarkdownCodespan
    };
</script>

<div class="markdown">
    <SvelteMarkdown {source} {renderers} />
</div>

<style>
    div {
        max-width: 1280px;
        width: 100%;
        margin: 0 auto;
        padding: 1em;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        background: var(--background);
    }
</style>
