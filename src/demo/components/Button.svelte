<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children?: Snippet;
        onclick?: () => void;
        disabled?: boolean;
    }

    let { children, onclick, disabled = false }: Props = $props();
</script>

<button type="button" {onclick} disabled={disabled ? true : false}>
    {@render children?.()}
</button>

<style>
    button {
        appearance: none;
        position: relative;
        padding: 0.6em 1.2em;
        line-height: 1.1;
        font-weight: 500;
        font-size: 1rem;
        font-family: inherit;
        outline: none;
        border: 1px solid var(--button-border-color);
        border-radius: var(--button-border-radius, 8px);
        background-color: var(--button-background);
        color: var(--button-text);
        cursor: pointer;
        transition: border-color 0.25s;
    }
    button:hover {
        background-color: var(--button-background-hover);
        border-color: var(--button-border-hover);
    }
    button:focus::after,
    button:focus-visible::after {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border: 2px solid var(--button-focus);
        border-radius: var(--button-border-radius, 8px);
    }
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
