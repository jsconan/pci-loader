<script lang="ts">
    import type { components } from 'demo/types.d.ts';

    interface Props {
        items: components.DropdownItem[];
        value?: string;
        onselect?: (value?: string) => void;
        disabled?: boolean;
    }

    let { items, value = $bindable(''), onselect, disabled = false }: Props = $props();
</script>

<span class="select">
    <select bind:value {disabled} onchange={() => onselect?.(value)}>
        {#each items as item}
            <option value={item.value}>{item.label}</option>
        {/each}
    </select>
    <span class="focus"></span>
</span>

<style>
    .select {
        position: relative;
        display: grid;
        grid-template-areas: 'select';
        align-items: center;
        width: 100%;
        min-width: 30ch;
        max-width: 50ch;
        line-height: 1.1;
        padding: 0;
        font-size: 2rem;
        font-family: inherit;
        border: 1px solid var(--select-border-color);
        border-radius: var(--select-border-radius, 8px);
        background-color: var(--select-background);
        color: var(--select-text);
        cursor: pointer;
        transition: border-color 0.25s;
    }
    .select::after {
        content: '';
        justify-self: end;
        width: 0.8em;
        height: 0.5em;
        margin-inline-end: 0.5em;
        background-color: var(--select-arrow);
        clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    }
    .select:hover {
        border-color: var(--select-border-hover);
    }

    select {
        appearance: none;
        background-color: transparent;
        color: inherit;
        border: none;
        outline: none;
        padding: 0.6em 1.2em;
        margin: 0;
        width: 100%;
        font-family: inherit;
        font-size: inherit;
        cursor: inherit;
        line-height: inherit;
        z-index: var(--z-index-controls);
    }
    select,
    .select:after {
        grid-area: select;
    }
    select:focus + .focus,
    select:focus-visible + .focus {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border: 2px solid var(--select-focus);
        border-radius: var(--select-border-radius, 8px);
    }

    @media (max-width: 1200px) {
        .select {
            min-width: 25ch;
            max-width: 45ch;
            font-size: 1.8rem;
        }
    }
    @media (max-width: 1000px) {
        .select {
            min-width: 20ch;
            max-width: 40ch;
            font-size: 1.6rem;
        }
    }

    @media (max-width: 800px) {
        .select {
            min-width: 15ch;
            max-width: 35ch;
            font-size: 1.4rem;
        }
    }

    @media (max-width: 600px) {
        .select {
            min-width: 10ch;
            max-width: 30ch;
            font-size: 1.2rem;
        }
    }
</style>
