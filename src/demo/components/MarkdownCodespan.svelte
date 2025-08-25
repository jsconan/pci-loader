<script lang="ts">
    interface Props {
        raw: string;
    }

    const { raw }: Props = $props();
</script>

<code>{raw.replace(/`/g, '')}</code>

<style>
    code {
        padding: 0.2em 0.4em;
        font-weight: 600;
        color: var(--text-color);
        background-color: var(--background-highlight);
        border-radius: var(--code-border-radius);
    }
</style>
