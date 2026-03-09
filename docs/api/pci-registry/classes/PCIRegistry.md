[**pci-loader**](../../README.md)

***

# Class: PCIRegistry

Defined in: [src/lib/pci-registry.ts:55](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-registry.ts#L55)

A registry for managing and retrieving PCI (Portable Custom Interaction) runtimes.

This registry is usually used for creating the resource `qtiCustomInteractionContext`.
This is the only resource a PCI's runtime can request from the host application.
It allows registering and retrieving PCI runtimes.

## Example

```ts
import { PCIRegistry } from 'pci-loader';
const registry = new PCIRegistry();

// Register a PCI's runtime
registry.register({
    typeIdentifier: 'myPCI',
    getInstance(dom, config, state) {
        // Minimal implementation of a PCI's runtime
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

// Get the PCI's runtime and render an instance into the given container
registry.getInstance(typeIdentifier, container, config, state);
```

## Implements

- [`Registry`](../../types/namespaces/PCI/interfaces/Registry.md)

## Constructors

### Constructor

> **new PCIRegistry**(): `PCIRegistry`

Defined in: [src/lib/pci-registry.ts:58](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-registry.ts#L58)

#### Returns

`PCIRegistry`

## Methods

### getInstance()

> **getInstance**(`typeIdentifier`, `container`, `configuration`, `state`): `void`

Defined in: [src/lib/pci-registry.ts:151](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-registry.ts#L151)

Retrieves a registered PCI's runtime, then gets a new PCI's instance, passing in the provided parameters.

#### Parameters

##### typeIdentifier

`string`

The type identifier of the PCI.

##### container

`Element`

The DOM element to render the PCI into. Be sure to have the container prefilled with the layout expected by the PCI's runtime.

##### configuration

[`Config`](../../types/namespaces/PCI/interfaces/Config.md)

The configuration options for the PCI.

##### state

[`State`](../../types/namespaces/PCI/interfaces/State.md)

An object representing the initial state of the PCI. This is useful when rendering a new instance of a previously terminated PCI.

#### Returns

`void`

#### Throws

If the PCI's runtime is not registered.

#### Example

```ts
import { PCIRegistry } from 'pci-loader';
const registry = new PCIRegistry();

// Register a PCI's runtime
registry.register({ typeIdentifier, getInstance(container, config, state) {} });

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

// Get the PCI's runtime and render an instance
registry.getInstance(typeIdentifier, container, config, state);
```

#### Implementation of

[`Registry`](../../types/namespaces/PCI/interfaces/Registry.md).[`getInstance`](../../types/namespaces/PCI/interfaces/Registry.md#getinstance)

***

### register()

> **register**(`interaction`): `void`

Defined in: [src/lib/pci-registry.ts:92](https://github.com/jsconan/pci-loader/blob/49dbdc6ccdfcce0182045037e9f3fcba9e303796/src/lib/pci-registry.ts#L92)

Registers a PCI's runtime.

A runtime is represented by an object containing a unique typeIdentifier and a getInstance function.

#### Parameters

##### interaction

[`Registration`](../../types/namespaces/PCI/interfaces/Registration.md)

The PCI's runtime to register.

#### Returns

`void`

#### Throws

If the PCI's runtime is invalid (e.g. missing typeIdentifier or getInstance).

#### Example

```ts
import { PCIRegistry } from 'pci-loader';
const registry = new PCIRegistry();

// Register a PCI's runtime
registry.register({
    typeIdentifier: 'myPCI',
    getInstance(dom, config, state) {
        // Minimal implementation of a PCI's runtime
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
```

#### Implementation of

[`Registry`](../../types/namespaces/PCI/interfaces/Registry.md).[`register`](../../types/namespaces/PCI/interfaces/Registry.md#register)
