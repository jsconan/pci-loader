<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        content?: string;
        timeout?: number;
        children?: Snippet;
    }

    let { content, timeout = 1000, children }: Props = $props();

    let timerCopy: NodeJS.Timeout | undefined;

    const iconCopy = '📋';
    const iconCopied = '✅';
    let currentIcon = $state(iconCopy);

    const titleCopy = 'Copy to clipboard';
    const titleCopied = 'Copied!';
    let copyTitle: string = $state(titleCopy);

    function copyToClipboard() {
        if (content && !timerCopy) {
            navigator.clipboard.writeText(content);

            currentIcon = iconCopied;
            copyTitle = titleCopied;
            if (timerCopy) {
                clearTimeout(timerCopy);
            }
            timerCopy = setTimeout(() => {
                currentIcon = iconCopy;
                copyTitle = titleCopy;
                timerCopy = undefined;
            }, timeout);
        }
    }
</script>

<div>
    <button type="button" onclick={copyToClipboard} title={copyTitle} aria-label={copyTitle}>{currentIcon}</button>
    {@render children?.()}
</div>

<style>
    button {
        appearance: none;
        position: absolute;
        top: 0;
        left: -10000px;
        z-index: var(--z-index-hover);
        opacity: 0.5;
        padding: 0.6em 1.2em;
        line-height: 1.1;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        outline: none;
        border: 1px solid var(--button-border-color);
        background-color: var(--button-background);
        color: var(--button-text);
        cursor: pointer;
        transition: border-color 0.25s;
    }
    button:hover {
        opacity: 1;
        border-color: var(--button-border-hover);
        background-color: var(--button-background-hover);
    }
    button:focus,
    button:focus-visible {
        left: unset;
        right: 0;
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
    }

    div {
        position: relative;
    }
    div:hover button {
        left: unset;
        right: 0;
    }

    @media (pointer: coarse) {
        div button {
            left: unset;
            right: 0;
        }
    }
</style>
