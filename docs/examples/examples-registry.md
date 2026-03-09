# PCIRegistry Examples

Examples demonstrating programmatic registration and instantiation using `PCIRegistry`.

## Register a runtime and render an instance (multi-step)

```ts
import { PCIRegistry } from 'pci-loader';

const registry = new PCIRegistry();

registry.register({
    typeIdentifier: 'myPCI',
    getInstance(container, config, state) {
        // Minimal implementation of a PCI's runtime
        const myInteraction = {
            getResponse() {},
            getState() {},
            oncompleted() {}
        };
        if (typeof config.onready === 'function') {
            config.onready(myInteraction, state);
        }
    }
});

// Prepare container and config
const container = document.querySelector('#pci-container');

const config = {
    properties: { key: 'value' },
    boundTo: { RESPONSE: { base: { string: 'value' } } },
    onready(interaction, initState) {
        console.log('PCI rendered successfully');
        // handle the instance
    }
};

const state = {};

registry.getInstance('myPCI', container, config, state);
```

## Promise-style instantiation

If you prefer a promise-style instantiation wrapper, you can create one as shown below:

```ts
function instantiate(registry, typeIdentifier, container, config, state) {
    return new Promise((resolve, reject) => {
        try {
            config.onready = (interaction, initState) => resolve([interaction, initState]);
            registry.getInstance(typeIdentifier, container, config, state);
        } catch (e) {
            reject(e);
        }
    });
}

instantiate(registry, 'myPCI', container, config, state)
    .then(([interaction, initState]) => {
        /* ... */
    })
    .catch(err => console.error(err));
```

## Error cases

Calling `getInstance` with an unknown `typeIdentifier` throws a `ReferenceError`.
