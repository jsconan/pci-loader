<script lang="ts">
    import { Router } from 'sv-router';
    import GitHubLink from './components/GitHubLink.svelte';
    import Menu from './components/Menu.svelte';
</script>

<main>
    <header>
        <span class="logo"></span>

        <Menu />

        <GitHubLink />
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
        margin-bottom: 2rem;
    }

    .logo {
        display: inline-block;
        width: 108px;
    }
</style>
