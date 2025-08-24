import type { components } from 'demo/types.d.ts';

/**
 * Base URL for the application
 */
export const baseUrl: string = '/';

/**
 * List of samples for the demo application
 */
export const samples: Record<string, components.Sample> = {
    pci: {
        type: 'pci',
        url: `${baseUrl}samples/pci.js`,
        label: 'PCI example.'
    },
    pciLoadFailure: {
        type: 'pci',
        url: `${baseUrl}samples/pci-load-failure.js`,
        label: 'PCI failure at loading.'
    },
    pciRenderFailure: {
        type: 'pci',
        url: `${baseUrl}samples/pci-render-failure.js`,
        label: 'PCI failure at rendering.'
    },
    bundle: {
        type: 'amd',
        url: `${baseUrl}samples/bundle.js`,
        label: 'Bundle example.'
    },
    split: {
        type: 'amd',
        url: `${baseUrl}samples/internal.js`,
        label: 'Split example.',
        dependencies: [
            {
                name: 'external',
                url: `${baseUrl}samples/external.js`
            }
        ]
    },
    resource: {
        type: 'amd',
        url: `${baseUrl}samples/resource.js`,
        label: 'Resource example.'
    },
    exports: {
        type: 'amd',
        url: `${baseUrl}samples/exports.js`,
        label: 'Exports example.'
    },
    invalid: {
        type: 'amd',
        url: `${baseUrl}samples/invalid.js`,
        label: 'Invalid example.'
    },
    error: {
        type: 'amd',
        url: `${baseUrl}samples/error.js`,
        label: 'Error example.'
    }
};
