<script lang="ts">
    import Code from 'demo/components/Code.svelte';
    import CopyToClipboard from 'demo/components/CopyToClipboard.svelte';

    interface Props {
        lang: string;
        text: string;
    }

    let { lang, text }: Props = $props();

    const supportedLanguages = ['js', 'ts', 'javascript', 'typescript'];
</script>

{#if supportedLanguages.includes(lang)}
    <Code code={text} autoformat={false} />
{:else}
    <CopyToClipboard content={text}>
        <pre class={lang}><code>{text}</code></pre>
    </CopyToClipboard>
{/if}

<style>
    pre {
        background: var(--code-background);
        color: var(--code-text);
        padding: 1em;
        border-radius: 0.5em;
        overflow: auto;
    }
</style>
