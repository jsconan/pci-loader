[**pci-loader**](../../README.md)

***

# Class: PCILoaderDev

Defined in: [src/lib/pci-loader.ts:476](https://github.com/jsconan/pci-loader/blob/8562834b20b0bf934925e898954ad77c94a65ff0/src/lib/pci-loader.ts#L476)

PCI Loader for development purposes. Loads a PCI's runtime in a scoped manner, allowing to
define external dependencies.

This loader is used to load PCI runtimes dynamically, ensuring that they are properly
registered and can be accessed within the context of the application.

The necessary dependencies are automatically loaded and made available
to the PCI's runtime. Usually, only the resource `qtiCustomInteractionContext`
is exposed from the host, other resources should be embedded in the runtime. However,
in development mode, other resources can be defined separately and loaded from the host.

The loader needs the URL to the PCI's runtime script. The name of the PCI can also be provided,
otherwise it will be extracted from the PCI's runtime itself. If the name is provided, it must
match the `typeIdentifier` of the PCI's runtime.
*

## Example

```ts
import { PCILoaderDev } from 'pci-loader';
let loader;

// Create a new PCILoader instance for a particular PCI.
loader = new PCILoaderDev('/path/to/myPCI/runtime.js');

// Define PCI resources
loader.define('myResource', '/path/to/myResource.js');
loader.define('data', { value: 42});

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

// Load the PCI's runtime, then get an instance from the registry.
loader
    .getInstance(container, config, state)
    .then(([interaction, state]) => {
        // Do something with the rendered interaction and its state
    })
    .catch(error => console.error(error));

// Implementation of a PCI's runtime, with external resources
// file: /path/to/myPCI/runtime.js
define('myPCI', ['qtiCustomInteractionContext', 'myResource', 'data'], function (
    qtiCustomInteractionContext,
    myResource,
    data
) {
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

> **new PCILoaderDev**(`url`, `name?`): `PCILoaderDev`

Defined in: [src/lib/pci-loader.ts:479](https://github.com/jsconan/pci-loader/blob/8562834b20b0bf934925e898954ad77c94a65ff0/src/lib/pci-loader.ts#L479)

#### Parameters

##### url

`string`

##### name?

`string`

#### Returns

`PCILoaderDev`

#### Overrides

`BasePCILoader.constructor`

## Accessors

### name

#### Get Signature

> **get** **name**(): `string` \| `undefined`

Defined in: [src/lib/pci-loader.ts:32](https://github.com/jsconan/pci-loader/blob/8562834b20b0bf934925e898954ad77c94a65ff0/src/lib/pci-loader.ts#L32)

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

Defined in: [src/lib/pci-loader.ts:53](https://github.com/jsconan/pci-loader/blob/8562834b20b0bf934925e898954ad77c94a65ff0/src/lib/pci-loader.ts#L53)

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

Defined in: [src/lib/pci-loader.ts:40](https://github.com/jsconan/pci-loader/blob/8562834b20b0bf934925e898954ad77c94a65ff0/src/lib/pci-loader.ts#L40)

Gets the URL of the PCI's runtime.

##### Returns

`string`

The URL of the PCI's runtime.

#### Inherited from

`BasePCILoader.url`

## Methods

### define()

> **define**(`name`, `module`, `esm?`): `void`

Defined in: [src/lib/pci-loader.ts:508](https://github.com/jsconan/pci-loader/blob/8562834b20b0bf934925e898954ad77c94a65ff0/src/lib/pci-loader.ts#L508)

Defines a resource in the AMD context of the PCI loader.
The resource may be a preloaded module or a mapping to a different location.

#### Parameters

##### name

`string`

The name of the resource.

##### module

An URI string or the resource object.

`string` | [`Module`](../../types/namespaces/ESM/interfaces/Module.md)

##### esm?

`boolean` = `false`

Tells if the module must be treated as an ESM module.
- If true, the module is used as-is.
- If false (default), the module is wrapped to be the default export of an ESM module.

#### Returns

`void`

#### Example

```ts
import { PCILoaderDev } from 'pci-loader';
const loader = new PCILoaderDev('/path/to/myPCI/runtime.js');

// Pre-define a shared resource from an already loaded module, or an existing resource
loader.define('myResource', {
    // resource definition
});

// Map the resource to an external module path
loader.define('myResource', 'path/to/resource');
```

***

### getInstance()

> **getInstance**(`container`, `configuration`, `state`, `options?`): `Promise`\<\[[`Interaction`](../../types/namespaces/PCI/interfaces/Interaction.md), [`State`](../../types/namespaces/PCI/interfaces/State.md)\]\>

Defined in: [src/lib/pci-loader.ts:266](https://github.com/jsconan/pci-loader/blob/8562834b20b0bf934925e898954ad77c94a65ff0/src/lib/pci-loader.ts#L266)

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

Defined in: [src/lib/pci-loader.ts:484](https://github.com/jsconan/pci-loader/blob/8562834b20b0bf934925e898954ad77c94a65ff0/src/lib/pci-loader.ts#L484)

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
