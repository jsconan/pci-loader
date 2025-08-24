<script lang="ts">
    import type { components } from 'demo/types.d.ts';
    import type { Snippet } from 'svelte';

    interface Props {
        tabs: components.Tab[];
        active: string;
        children?: Snippet;
        onclick?: (key: string) => void;
    }

    let { tabs, active = $bindable(''), children, onclick }: Props = $props();

    function setActiveTab(key: string) {
        active = key;
        onclick?.(active);
    }
</script>

<div>
    {#each tabs as tab (tab.key)}
        <button type="button" class:selected={active === tab.key} onclick={() => setActiveTab(tab.key)}>
            {tab.label}
        </button>
    {/each}
</div>

{@render children?.()}

<style>
    div {
        display: flex;
        gap: 0.5rem;
        padding-bottom: 0rem;
        border-bottom: 4px solid var(--tab-bar-border-color);
    }

    button {
        appearance: none;
        position: relative;
        padding: 0.6em 1.2em;
        line-height: 1.1;
        font-weight: 500;
        font-size: 2rem;
        font-family: inherit;
        outline: none;
        border: none;
        border-top: 4px solid transparent;
        border-color: var(--tab-border-color);
        background-color: var(--tab-background);
        color: var(--tab-text);
        cursor: pointer;
        transition: border-color 0.25s;
    }
    button.selected {
        background-color: var(--tab-background-selected);
        border-color: var(--tab-border-selected);
    }
    button:hover {
        background-color: var(--tab-background-hover);
        border-color: var(--tab-border-hover);
    }
    button:focus::after,
    button:focus-visible::after {
        content: '';
        position: absolute;
        top: -6px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border: 2px solid var(--button-focus);
    }
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: 1200px) {
        button {
            font-size: 1.8rem;
        }
    }
    @media (max-width: 1000px) {
        button {
            font-size: 1.6rem;
        }
    }

    @media (max-width: 800px) {
        button {
            font-size: 1.4rem;
        }
    }

    @media (max-width: 600px) {
        button {
            font-size: 1.2rem;
        }
    }
</style>
