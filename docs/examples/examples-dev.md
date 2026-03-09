# PCILoaderDev Examples

Examples for development-mode loading when you need to map external resources.

## Define resources and get instance (multi-step)

```ts
import { PCILoaderDev } from 'pci-loader';

// Prepare the container and config for rendering the PCI
const container = document.querySelector('#pci-container');
const config = {
    properties: { key: 'value' },
    boundTo: { RESPONSE: { base: { string: 'value' } } }
};

const state = {};

// Prepare the resources for the PCI
const loader = new PCILoaderDev('/path/to/myPCI/runtime.js');
loader.define('myResource', '/path/to/myResource.js');

// Load and render the PCI
loader
    .getInstance(container, config, state)
    .then(([interaction, initState]) => {
        console.log('PCI loaded and rendered successfully');
        return interaction;
    })
    .then(interaction => {
        const response = interaction.getResponse();
        const state = interaction.getState();
        return interaction;
    })
    .then(interaction => interaction.oncompleted())
    .catch(err => console.error('Error loading or rendering PCI:', err));
```

## Preload and then instantiate via `load()`

```ts
const loader = new PCILoaderDev('/path/to/myPCI/runtime.js');
loader.define('myResource', '/path/to/myResource.js');

loader
    .load()
    .then(registry => {
        // similar to PCILoader: use registry.getInstance to render
    })
    .catch(err => console.error('Error loading PCI:', err));
```

## Define examples

```ts
// Pre-define a shared resource object
loader.define('myResource', {
    /* resource */
});

// Map to an external path
loader.define('myResource', 'path/to/resource');
```
