<script lang="ts">
    import Playground from 'demo/components/Playground.svelte';
    import { samples } from 'demo/config.ts';
</script>

<section>
    <header>
        <h1>PCI Loader Demo</h1>
        <p>Welcome to the PCI Loader demo! This application demonstrates how to use the library.</p>
    </header>
    <Playground {samples} />
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        flex: 1;
        max-width: 1280px;
        width: 100%;
        margin: 0 auto;
        padding: 1em;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        background: var(--background);
    }

    header {
        display: flex;
        align-items: flex-end;
    }
    header p {
        flex: 1;
        margin-top: 1rem;
        line-height: 2rem;
        text-align: center;
    }
    header h1 {
        margin-top: 1rem;
        line-height: 2rem;
    }

    @media (max-width: 1200px) {
        h1 {
            font-size: 2.6rem;
        }
        p {
            font-size: 1.8rem;
        }
    }
    @media (max-width: 1000px) {
        h1 {
            font-size: 2.4rem;
        }
        p {
            font-size: 1.6rem;
        }
    }

    @media (max-width: 800px) {
        h1 {
            font-size: 2.2rem;
        }
        p {
            font-size: 1.4rem;
        }
    }

    @media (max-width: 600px) {
        h1 {
            font-size: 2rem;
        }
        p {
            font-size: 1.2rem;
        }
    }
</style>
