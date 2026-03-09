# PCILoader Examples

Examples showing how to load and render a PCI runtime using `PCILoader`.

## Load and render (multi-step)

```ts
import { PCILoader } from 'pci-loader';

// Prepare the container and config for rendering the PCI
const container = document.querySelector('#pci-container');

const config = {
    properties: { key: 'value' },
    boundTo: { RESPONSE: { base: { string: 'value' } } }
};

const state = {};

// Load and render the PCI runtime, then interact with the returned instance
const loader = new PCILoader('/path/to/myPCI/runtime.js');
loader
    .getInstance(container, config, state)
    .then(([interaction, initState]) => {
        console.log('PCI loaded and rendered successfully');
        // do something with interaction and initState
        return interaction;
    })
    .then(interaction => {
        // Get the response and the state
        const response = interaction.getResponse();
        const state = interaction.getState();

        // ... work with response/state
        return interaction;
    })
    .then(interaction => {
        // Destroy the PCI and clean up the place
        interaction.oncompleted();
    })
    .catch(err => {
        console.error('Error loading or rendering PCI:', err);
    });
```

## Load runtime and create instance via registry

This flow shows using `loader.load()` to obtain a registry getter and then creating an instance via `registry.getInstance()` (useful when you want to pre-load runtimes before rendering).

```ts
import { PCILoader } from 'pci-loader';

const loader = new PCILoader('/path/to/myPCI/runtime.js');

loader
    .load()
    .then(registry => {
        return new Promise((resolve, reject) => {
            try {
                const container = document.querySelector('#pci-container');
                const config = {
                    properties: { key: 'value' },
                    boundTo: { RESPONSE: { base: { string: 'value' } } },
                    onready(interaction, initState) {
                        resolve([interaction, initState]);
                    }
                };

                const state = {};
                registry.getInstance(container, config, state);
            } catch (error) {
                reject(error);
            }
        });
    })
    .then(([interaction, initState]) => {
        // work with the instance
    })
    .catch(err => console.error('Error loading PCI:', err));
```

## Notes

- If you pass a `name` to `PCILoader(url, name)`, it must match the runtime's `typeIdentifier`.
- Timeouts default to 30000ms; override via options.
