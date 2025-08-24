<script lang="ts">
    import { mainMenu } from 'demo/config.ts';
    import { p } from 'demo/router.ts';
    import packageInfo from 'root/package.json';
    import { isActiveLink, Router } from 'sv-router';

    const repositoryUrl = packageInfo.repository.url.replace(/((^git\+)|(\.git$))/g, '');
</script>

<main>
    <header>
        <span class="logo"></span>

        <nav>
            <svg viewBox="0 0 2 3" aria-hidden="true">
                <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
            </svg>
            <menu>
                {#each mainMenu as item}
                    <a href={p(item.url, item.params)} use:isActiveLink>{item.label}</a>
                {/each}
            </menu>
            <svg viewBox="0 0 2 3" aria-hidden="true">
                <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
            </svg>
        </nav>

        <menu>
            <a href={repositoryUrl} target="_blank" class="github" title="GitHub Repository">GitHub</a>
        </menu>
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

    menu {
        margin: 0;
        padding: 0;
    }

    nav {
        display: flex;
        justify-content: center;
    }
    nav menu {
        position: relative;
        display: flex;
        justify-content: center;
        /* gap: 1rem; */
        margin: 0;
        padding: 0;
        height: 3em;
        list-style: none;
        background-color: var(--nav-menu-background);
        background-size: contain;
    }

    nav a {
        appearance: none;
        position: relative;
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 2rem;
        font-weight: 700;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        transition: color 0.2s linear;
        outline: none;
        color: var(--nav-menu-text);
        border-bottom: 4px solid transparent;
    }
    :global(nav a.is-active) {
        color: var(--nav-menu-selected);
        border-bottom: 4px solid var(--nav-menu-selected);
    }
    nav a:hover {
        color: var(--nav-menu-text-hover);
        background-color: var(--nav-menu-background-hover);
        border-bottom: 4px solid var(--nav-menu-text-hover);
    }
    nav a:focus::after,
    nav a:focus-visible::after {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -6px;
        border: 2px solid var(--nav-menu-focus);
    }

    nav svg {
        width: 2em;
        height: 3em;
        display: block;
    }

    nav path {
        fill: var(--nav-menu-background);
    }

    .logo {
        display: inline-block;
        width: 108px;
    }
    .github {
        padding: 0.6em 1.2em 0.6em 3.2em;
    }
    .github::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0.8em;
        transform: translateY(-50%);
        width: 1.6em;
        height: 1.6em;
        background: url('/github-black.svg') no-repeat center/contain;
    }
    @media (prefers-color-scheme: dark) {
        .github::before {
            background: url('/github-white.svg') no-repeat center/contain;
        }
    }
</style>
