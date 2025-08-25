<script lang="ts">
    import GitHubLink from 'demo/components/GitHubLink.svelte';
    import Menu from 'demo/components/Menu.svelte';
    import { Router } from 'sv-router';
</script>

<div class="menu"><Menu /></div>
<main>
    <header>
        <div class="corner left"></div>
        <div class="corner right"><GitHubLink /></div>
    </header>

    <Router />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 2rem 2rem 2rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 0;
        margin: 0;
    }

    .menu {
        position: fixed;
        z-index: var(--z-index-fixed);
        top: 0;
        width: 100%;
    }

    .corner {
        position: relative;
        z-index: var(--z-index-fixed);
        height: 4em;
        padding: 1rem 0;
        margin: 0;
    }
    .corner.left {
        visibility: hidden;
    }
</style>
