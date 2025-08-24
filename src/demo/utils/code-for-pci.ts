export function codeImportPCILoader(url: string): string {
    return `// Import the PCILoader from the 'pci-loader' package
import { PCILoader } from 'pci-loader';

// Create a new instance of the PCILoader for the PCI's runtime '${url}'
const pciLoader = new PCILoader('${url}');
`;
}

export function codeLoadPCI(): string {
    return `
// Load the PCI's runtime
pciLoader
    .load()
    .then(registry => {
        console.log('PCI loaded successfully');

        // Do something with the loaded PCI's runtime
        // ...
    })
    .catch(err => {
        console.error('Error loading PCI:', err);
    });
`;
}

export function codeLoadPCIThenRender(): string {
    return `
// Load the PCI's runtime
pciLoader
    .load()
    .then(registry => {
        console.log('PCI loaded successfully');

        return new Promise((resolve, reject) => {
            try {
                // Prepare the container and config for rendering the PCI
                // Be sure to have the container prefilled with the layout expected by the PCI's runtime
                const container = document.querySelector('#pci-container');

                // The configuration for the PCI.
                const config = {
                    // The properties to pass to the PCI
                    properties: {
                        key: 'value'
                    },

                    // The response variable the PCI is bound to
                    boundTo: { 'RESPONSE': { base: {string: 'value'} } },

                    // The instance of the PCI is returned by a callback
                    onready(interaction, initState) {
                        console.log('PCI rendered successfully');

                        resolve([interaction, initState]);
                    }
                };

                // The state can contain anything needed to restore the PCI
                const state = {};

                // Create an instance of the PCI, rendered in the specified container
                registry.getInstance(container, config, state)
            } catch (error) {
                reject(error);
            }
        });
    })
    .then(([interaction, initState]) => {
        // Do something with the interaction and initState
        // ...

        return interaction;
    })
    .then(interaction => {
        // Get the response and the state
        const response = interaction.getResponse();
        const state = interaction.getState();

        // Do something with the response and state
        // ...

        return interaction;
    })
    .then(interaction => {
        // Destroy the PCI and clean up the place
        interaction.oncompleted()
    })
    .catch(err => {
        console.error('Error loading PCI:', err);
    });
`;
}

export function codeRenderPCI(): string {
    return `
// Prepare the container and config for rendering the PCI
// Be sure to have the container prefilled with the layout expected by the PCI's runtime
const container = document.querySelector('#pci-container');

// The configuration for the PCI.
const config = {
    // The properties to pass to the PCI
    properties: {
        key: 'value'
    },

    // The response variable the PCI is bound to
    boundTo: { 'RESPONSE': { base: {string: 'value'} } }

    // No need to pass the 'onready' callback, the PCI loader will take over.
    // However, you can still provide it if needed, it will be wrapped.
    // onready(interaction, initState) { }
};

// The state can contain anything needed to restore the PCI
const state = {};

// Load and render the PCI
pciLoader
    .getInstance(container, config, state)
    .then(([interaction, initState]) => {
        console.log('PCI loaded and rendered successfully');

        // Do something with the interaction and initState
        // ...

        return interaction;
    })
    .then(interaction => {
        // Get the response and the state
        const response = interaction.getResponse();
        const state = interaction.getState();

        // Do something with the response and state
        // ...

        return interaction;
    })
    .then(interaction => {
        // Destroy the PCI and clean up the place
        interaction.oncompleted()
    })
    .catch(err => {
        console.error('Error loading or rendering PCI:', err);
    });
`;
}
