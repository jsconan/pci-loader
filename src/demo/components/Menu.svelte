<script lang="ts">
    import { mainMenu } from 'demo/config.ts';
    import { p } from 'demo/router.ts';
    import { isActiveLink } from 'sv-router';
</script>

<nav>
    <svg viewBox="0 0 2 3" aria-hidden="true">
        <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <menu>
        {#each mainMenu as item}
            <a href={p(item.url, item.params)} tabindex="0" use:isActiveLink>{item.label}</a>
        {/each}
    </menu>
    <svg viewBox="0 0 2 3" aria-hidden="true">
        <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
</nav>

<style>
    nav {
        display: flex;
        justify-content: center;
    }

    menu {
        position: relative;
        z-index: var(--z-index-controls);
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 0;
        height: 3em;
        list-style: none;
        background-color: var(--nav-menu-background);
        background-size: contain;
    }

    a {
        appearance: none;
        position: relative;
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 2rem;
        font-weight: 700;
        font-size: var(--font-size-button, 2rem);
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
    a:hover {
        color: var(--nav-menu-text-hover);
        background-color: var(--nav-menu-background-hover);
        border-bottom: 4px solid var(--nav-menu-text-hover);
    }
    a:focus::after,
    a:focus-visible::after {
        content: '';
        position: absolute;
        z-index: var(--z-index-controls);
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -6px;
        border: 2px solid var(--nav-menu-focus);
    }

    svg {
        position: relative;
        z-index: var(--z-index-page);
        width: 2em;
        height: 3em;
        display: block;
    }
    svg:first-child {
        left: 1px;
    }
    svg:last-child {
        right: 1px;
    }

    path {
        fill: var(--nav-menu-background);
    }

    @media (max-width: 1200px) {
        a {
            font-weight: 700;
        }
    }

    @media (max-width: 900px) {
        a {
            font-weight: 600;
        }
    }

    @media (max-width: 600px) {
        a {
            font-weight: 500;
        }
    }
</style>
