<script lang="ts">
    import Playground from 'demo/components/Playground.svelte';

    const samples: Record<string, components.Sample> = {
        pci: {
            type: 'pci',
            url: '/samples/pci.js',
            description: 'PCI example.'
        },
        pciLoadFailure: {
            type: 'pci',
            url: '/samples/pci-load-failure.js',
            description: 'PCI failure at loading.'
        },
        pciRenderFailure: {
            type: 'pci',
            url: '/samples/pci-render-failure.js',
            description: 'PCI failure at rendering.'
        },
        bundle: {
            type: 'amd',
            url: '/samples/bundle.js',
            description: 'Bundle example.'
        },
        split: {
            type: 'amd',
            url: '/samples/internal.js',
            description: 'Split example.',
            dependencies: [
                {
                    name: 'external',
                    url: '/samples/external.js'
                }
            ]
        },
        resource: {
            type: 'amd',
            url: '/samples/resource.js',
            description: 'Resource example.'
        },
        exports: {
            type: 'amd',
            url: '/samples/exports.js',
            description: 'Exports example.'
        },
        invalid: {
            type: 'amd',
            url: '/samples/invalid.js',
            description: 'Invalid example.'
        },
        error: {
            type: 'amd',
            url: '/samples/error.js',
            description: 'Error example.'
        }
    };
</script>

<main>
    <div class="title">
        <h1>PCI Loader Demo</h1>
        <p>Welcome to the PCI Loader demo! This application demonstrates how to use the library.</p>
    </div>
    <Playground {samples} />
</main>

<style>
    main {
        flex: 1;
    }

    .title {
        display: flex;
        align-items: flex-end;
    }
    .title p {
        flex: 1;
        margin-top: 1rem;
        line-height: 2rem;
        text-align: center;
    }
    .title h1 {
        margin-top: 1rem;
        line-height: 2rem;
    }
</style>
