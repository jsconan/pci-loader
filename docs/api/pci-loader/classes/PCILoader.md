[**pci-loader**](../../README.md)

***

# Class: PCILoader

Defined in: [src/lib/pci-loader.ts:389](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-loader.ts#L389)

Loads a PCI's runtime in a scoped manner.

This loader is used to load PCI runtimes dynamically, ensuring that they are properly
registered and can be accessed within the context of the application.

The necessary dependencies are automatically loaded and made available
to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext`
is exposed. All other resources must be embedded in the PCI's runtime, using the AMD format.

The loader needs the URL to the PCI's runtime script. The name of the PCI can also be provided,
otherwise it will be extracted from the PCI's runtime itself. If the name is provided, it must
match the `typeIdentifier` of the PCI's runtime.

## Example

```ts
import { PCILoader } from 'pci-loader';
let loader;

// Create a new PCILoader instance for a particular PCI. Name will be extracted from the runtime.
loader = new PCILoader('/path/to/myPCI/runtime.js');

// Create a new PCILoader instance for a particular PCI, specifying the name.
// Name must match the runtime's typeIdentifier.
loader = new PCILoader('/path/to/myPCI/runtime.js', 'myPCI');

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
    boundTo: { 'RESPONSE': { base: { string: 'value' } } },

    // The instance of the PCI is returned by a callback
    onready: (interaction, state) => {
        // Handle the PCI's readiness
    },
};

// The state can contain anything needed to restore the PCI
const state = {};

// Prepare the resources for the PCI
loader.define('myResource', '/path/to/myResource.js');

// Load the PCI's runtime, then get an instance from the registry.
loader
    .load()
    .then(registry => registry.getInstance(loader.name, container, config, state))
    .catch(error => console.error(error));

// A PCI instance can also be rendered into a container right after the loading process
loader
    .getInstance(container, config, state)
    .then(([interaction, state]) => {
        // Do something with the rendered interaction and its state
    })
    .catch(error => console.error(error));

// Minimal implementation of a PCI's runtime
// file: /path/to/myPCI/runtime.js
define('myPCI', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
    qtiCustomInteractionContext.register({
        typeIdentifier: 'myPCI',
        getInstance(dom, config, state) {
            const myInteraction = {
                getResponse() { },
                getState() { },
                oncompleted() { }
            };

            if (typeof config.onready === 'function') {
                config.onready(myInteraction, state);
            }
        }
    });
});
```

## Extends

- `BasePCILoader`

## Constructors

### Constructor

> **new PCILoader**(`url`, `name?`): `PCILoader`

Defined in: [src/lib/pci-loader.ts:20](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-loader.ts#L20)

#### Parameters

##### url

`string`

The URL of the PCI's runtime script.

##### name?

`string`

The name of the PCI (optional). If the name is provided, it must match the
`typeIdentifier` of the PCI's runtime. Otherwise it will be extracted from the PCI's runtime itself.

#### Returns

`PCILoader`

#### Inherited from

`BasePCILoader.constructor`

## Accessors

### name

#### Get Signature

> **get** **name**(): `string` \| `undefined`

Defined in: [src/lib/pci-loader.ts:32](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-loader.ts#L32)

Gets the name of the PCI. If not provided at construction, it will be extracted from the
PCI's runtime itself. The value may be undefined if the PCI's runtime is not yet loaded.

##### Returns

`string` \| `undefined`

The name of the PCI.

#### Inherited from

`BasePCILoader.name`

***

### status

#### Get Signature

> **get** **status**(): [`PCILoaderStatus`](../../types/type-aliases/PCILoaderStatus.md)

Defined in: [src/lib/pci-loader.ts:53](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-loader.ts#L53)

Gets the status of the PCI loader.
It will be:
- 'initial' when the loader is created.
- 'loading' when the PCI's runtime is being loaded.
- 'loaded' when the PCI's runtime is successfully loaded.
- 'error' if there was an error loading the PCI.

##### Returns

[`PCILoaderStatus`](../../types/type-aliases/PCILoaderStatus.md)

The status of the PCI loader.

#### Inherited from

`BasePCILoader.status`

***

### url

#### Get Signature

> **get** **url**(): `string`

Defined in: [src/lib/pci-loader.ts:40](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-loader.ts#L40)

Gets the URL of the PCI's runtime.

##### Returns

`string`

The URL of the PCI's runtime.

#### Inherited from

`BasePCILoader.url`

## Methods

### getInstance()

> **getInstance**(`container`, `configuration`, `state`, `options?`): `Promise`\<\[[`Interaction`](../../types/namespaces/PCI/interfaces/Interaction.md), [`State`](../../types/namespaces/PCI/interfaces/State.md)\]\>

Defined in: [src/lib/pci-loader.ts:266](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-loader.ts#L266)

Gets an instance of the PCI, rendered inside the specified container.

If the PCI is not yet loaded, it will be loaded first.
The necessary dependencies are automatically loaded and made available
to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext`
is exposed. All other resources must be embedded in the PCI's runtime, using the AMD format.

#### Parameters

##### container

`Element`

The DOM element to render the PCI into. Be sure to have the container prefilled with the layout expected by the PCI's runtime.

##### configuration

[`Config`](../../types/namespaces/PCI/interfaces/Config.md)

The configuration options for the PCI.

##### state

[`State`](../../types/namespaces/PCI/interfaces/State.md)

An object representing the initial state of the PCI. This is useful when rendering an new instance of a previously terminated PCI.

##### options?

[`PCILoaderOptions`](../../types/type-aliases/PCILoaderOptions.md) = `{}`

Options for loading the PCI's runtime and rendering it.

#### Returns

`Promise`\<\[[`Interaction`](../../types/namespaces/PCI/interfaces/Interaction.md), [`State`](../../types/namespaces/PCI/interfaces/State.md)\]\>

A promise that resolves to the rendered PCI instance and its state.

#### Example

```ts
import { PCILoader } from 'pci-loader';

// Create a new PCILoader instance for a particular PCI
const loader = new PCILoader('/path/to/myPCI/runtime.js');

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
    boundTo: { 'RESPONSE': { base: { string: 'value' } } },

    // No need to pass the 'onready' callback, the PCI loader will take over.
    // However, you can still provide it if needed, it will be wrapped.
    // onready(interaction, initState) {
        console.log('PCI is ready');
    }
};

// The state can contain anything needed to restore the PCI
const state = {};

// Loads the PCI's runtime, and get an instance rendered inside the container.
loader
    .getInstance(container, config, state)
    .then(([interaction, state]) => {
        // Do something with the rendered interaction and its state
    })
    // An error is thrown if timeout occurs, or if the name does not match the runtime's typeIdentifier.
    .catch(error => console.error(error));

// Minimal implementation of a PCI's runtime
// file: /path/to/myPCI/runtime.js
define('myPCI', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
    qtiCustomInteractionContext.register({
        typeIdentifier: 'myPCI',
        getInstance(dom, config, state) {
            const myInteraction = {
                getResponse() { },
                getState() { },
                oncompleted() { }
            };

            if (typeof config.onready === 'function') {
                config.onready(myInteraction, state);
            }
        }
    });
});
```

#### Inherited from

`BasePCILoader.getInstance`

***

### load()

> **load**(`options?`): `Promise`\<[`RegistryGetter`](../../types/namespaces/PCI/interfaces/RegistryGetter.md)\>

Defined in: [src/lib/pci-loader.ts:390](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-loader.ts#L390)

Loads the PCI's runtime in a scoped manner. Subsequent calls to load will return the same
registry object.

If the name was not provided at construction, it will be extracted from the PCI's runtime
itself upon registration. If the name does not match the runtime's typeIdentifier,
a TypeError will be thrown.

The necessary dependencies are automatically loaded and made available
to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext`
is exposed. All other resources must be embedded in the PCI's runtime, using the AMD format.

#### Parameters

##### options?

[`PCILoaderOptions`](../../types/type-aliases/PCILoaderOptions.md) = `{}`

Options for loading the PCI's runtime.

#### Returns

`Promise`\<[`RegistryGetter`](../../types/namespaces/PCI/interfaces/RegistryGetter.md)\>

A promise that resolves to the PCI registry getter.

#### Example

```ts
import { PCILoader } from 'pci-loader';

// Create a new PCILoader instance for a particular PCI
const loader = new PCILoader('/path/to/myPCI/runtime.js', 'myPCI');

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
    boundTo: { 'RESPONSE': { base: { string: 'value' } } },

    // The instance of the PCI is returned by a callback
    onready: (interaction, state) => {
        // Handle the PCI's readiness
    },
};

// The state can contain anything needed to restore the PCI
const state = {};

// Load the PCI's runtime, then get an instance from the registry
loader
    .load().then(registry => registry.getInstance(loader.name, container, config, state))
    // An error is thrown if timeout occurs, or if the name does not match the runtime's typeIdentifier.
    .catch(error => console.error(error));

// Minimal implementation of a PCI's runtime
// file: /path/to/myPCI/runtime.js
define('myPCI', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
    qtiCustomInteractionContext.register({
        typeIdentifier: 'myPCI',
        getInstance(dom, config, state) {
            const myInteraction = {
                getResponse() { },
                getState() { },
                oncompleted() { }
            };

            if (typeof config.onready === 'function') {
                config.onready(myInteraction, state);
            }
        }
    });
});
```

#### Overrides

`BasePCILoader.load`
