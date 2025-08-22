<script lang="ts">
    let count = $state(0);
</script>

<button type="button" onclick={() => count++}>
    count is {count}
</button>

<style>
    button {
        border-radius: 8px;
        border: 1px solid var(--button-border-color);
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: var(--button-background);
        color: var(--button-text);
        cursor: pointer;
        transition: border-color 0.25s;
    }
    button:hover {
        border-color: var(--button-border-hover);
        background-color: var(--button-background-hover);
    }
    button:focus,
    button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
    }
</style>
