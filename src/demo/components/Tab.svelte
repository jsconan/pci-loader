<script lang="ts">
    let { name, active = $bindable(''), children }: { name: string; active: string; children?: any } = $props();
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
