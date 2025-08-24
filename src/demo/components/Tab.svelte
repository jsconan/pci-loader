<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        name: string;
        active: string;
        children?: Snippet;
    }

    let { name, active = $bindable(''), children }: Props = $props();
</script>

<div class={active == name ? 'active' : ''}>
    {@render children?.()}
</div>

<style>
    div {
        display: none;
    }
    div.active {
        display: block;
    }
</style>
