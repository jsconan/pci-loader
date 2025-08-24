<script lang="ts">
    import license from 'root/LICENSE';
</script>

<pre>{license}</pre>

<style>
    pre {
        max-width: 1280px;
        width: 100%;
        margin: 0 auto;
        padding: 1em;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        background: var(--background);
        overflow: auto;
    }

    @media (max-width: 1200px) {
        pre {
            font-size: 1.8rem;
        }
    }
    @media (max-width: 1000px) {
        pre {
            font-size: 1.6rem;
        }
    }

    @media (max-width: 800px) {
        pre {
            font-size: 1.4rem;
        }
    }

    @media (max-width: 600px) {
        pre {
            font-size: 1.2rem;
        }
    }
</style>
