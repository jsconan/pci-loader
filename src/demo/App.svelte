<script lang="ts">
    import Counter from 'demo/Counter.svelte';
    import typescriptLogo from 'demo/typescript.svg';
    import viteLogo from '/vite.svg';
</script>

<div>
    <a href="https://vite.dev" target="_blank">
        <img src={viteLogo} class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
        <img src={typescriptLogo} class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
        <Counter />
    </div>
    <p class="read-the-docs">Click on the Vite and TypeScript logos to learn more</p>
</div>

<style>
    a {
        font-weight: 500;
        color: var(--link-color);
        text-decoration: inherit;
    }
    a:hover {
        color: var(--link-hover-color);
    }

    h1 {
        font-size: 3.2em;
        line-height: 1.1;
    }

    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.vanilla:hover {
        filter: drop-shadow(0 0 2em #3178c6aa);
    }

    .card {
        padding: 2em;
    }

    .read-the-docs {
        color: var(--foreground-muted);
    }
</style>
