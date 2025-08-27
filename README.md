# PCI Loader

A tiny TypeScript library for dynamically loading and managing PCI (Portable Custom Interaction) runtimes in modern web applications. It provides a scoped loader and registry for PCI modules, supporting AMD and SystemJS formats.

## Features

- **Dynamic PCI loading**: Load PCI runtimes at runtime from URLs.
- **Scoped registry**: Each loader instance manages its own PCI registry.
- **AMD & SystemJS support**: Uses [SystemJS](https://github.com/systemjs/systemjs) for module loading and AMD for PCI's runtime definitions.
- **Custom interaction context**: Exposes only the `qtiCustomInteractionContext` resource to loaded PCIs.
- **TypeScript support**: Fully typed API for safe integration.

## Main Components

- **PCILoader**: Loads a PCI's runtime and manages its registration and instantiation.
- **PCIRegistry**: Registers and retrieves PCI runtimes, and creates PCI instances.
- **AMDLoader**: Handles AMD module loading using SystemJS.

## Installation

```sh
npm install pci-loader
```

## Example Usage

```typescript
import { PCILoader } from 'pci-loader';

// Create a loader for a PCI. Name will be extracted from the runtime registration.
const loader = new PCILoader('/path/to/myPCI/runtime.js');

// Loads the PCI's runtime, and get an instance rendered inside the container.
loader
    .getInstance(container, config, state)
    .then(([interaction, initState]) => {
        console.log('PCI loaded and rendered successfully');

        // Do something with the interaction and initState
        // ...
    })
    .catch(err => {
        console.error('Error loading or rendering PCI:', err);
    });
```

## Definition

**PCI** stands for **P**ortable **C**ustom **I**nteraction. This is a specification from [1EdTech](https://www.imsglobal.org/assessment/interactions.html) (previously “IMS Global”).

> **Portable Custom Interaction (PCI) defines a standard way for technology-enhanced items (TEIs) or custom interaction types** to be represented as part of the Question and Test Interoperability® (QTI®) and Accessible Portable Item Protocol® (APIP®) specifications.

PCI runtimes must be defined following the [AMD API Specification](https://github.com/amdjs/amdjs-api/blob/master/AMD.md). Here is a simple example:

> **_File:_** `/path/to/myPCI/runtime.js`

```javascript
define('my/PCI/runtime', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
    qtiCustomInteractionContext.register({
        typeIdentifier: 'myPCI',
        getInstance(dom, config, state) {
            const myInteraction = {
                getResponse() {},
                getState() {},
                oncompleted() {}
            };

            if (typeof config.onready === 'function') {
                config.onready(myInteraction, myInteraction.getState());
            }
        }
    });
});
```

## API Reference

### PCILoader

Loads a PCI's runtime in a scoped manner and manages its registration and instantiation.

The loader needs the URL to the PCI's runtime script. The name of the PCI can also be provided, otherwise it will be extracted from the PCI's runtime itself. If the name is provided, it must match the `typeIdentifier` of the PCI's runtime.

The necessary dependencies are automatically loaded and made available to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext` is exposed. All other resources must be embedded in the PCI's runtime, using the [AMD API Specification](https://github.com/amdjs/amdjs-api/blob/master/AMD.md).

**Example:**

```typescript
import { PCILoader } from 'pci-loader';

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
    boundTo: { RESPONSE: { base: { string: 'value' } } }

    // No need to pass the 'onready' callback, the PCI loader will take over.
    // However, you can still provide it if needed, it will be wrapped.
    // onready(interaction, initState) { ... }
};

// The state can contain anything needed to restore the PCI
const state = {};

// Load and render the PCI
const loader = new PCILoader('/path/to/myPCI/runtime.js');
loader
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
        interaction.oncompleted();
    })
    .catch(err => {
        console.error('Error loading or rendering PCI:', err);
    });
```

**Constructor**

```typescript
new PCILoader(url: string, name?: string);
```

_Parameters:_

- `url: string` - The URL of the PCI's runtime script.
- `name: string` - The name of the PCI (optional). If the name is provided, it must match the `typeIdentifier` of the PCI's runtime. Otherwise it will be extracted from the PCI's runtime itself.

_Examples:_

Create a new `PCILoader` instance for a particular PCI. Name will be extracted from the runtime.

```typescript
import { PCILoader } from 'pci-loader';

const loader = new PCILoader('/path/to/myPCI/runtime.js');
```

Create a new `PCILoader` instance for a particular PCI, specifying the name, which must match the runtime's typeIdentifier.

```typescript
import { PCILoader } from 'pci-loader';

const loader = new PCILoader('/path/to/myPCI/runtime.js', 'myPCI');
```

**Properties**

`name: string` - _`read-only`_ - The name of the PCI. If not provided at construction, it will be extracted from the PCI's runtime itself. The value may be undefined if the PCI's runtime is not yet loaded.

`url: string` - _`read-only`_ - The URL of the PCI's runtime.

`status: string` - _`read-only`_ - The status of the PCI loader. It will be:

- `'initial'` when the loader is created.
- `'loading'` when the PCI's runtime is being loaded.
- `'loaded'` when the PCI's runtime is successfully loaded.
- `'error'` if there was an error loading the PCI.

**Methods**

_`PCILoader.load()`_

```typescript
loader.load(
    options?: { timeout?: number }
): Promise<PCI.RegistryGetter>
```

Loads the PCI's runtime in a scoped manner, and returns a registry getter. Subsequent calls to load will return the same registry object.

If the name was not provided at construction, it will be extracted from the PCI's runtime itself upon registration. If the name does not match the runtime's typeIdentifier, a `TypeError` will be thrown.

The necessary dependencies are automatically loaded and made available to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext` is exposed. All other resources must be embedded in the PCI's runtime, using the [AMD API Specification](https://github.com/amdjs/amdjs-api/blob/master/AMD.md).

_Parameters:_

- `options: object` - Options for loading the PCI's runtime.
    - `.timeout: number` - The maximum time to wait for the PCI's runtime to load (default is 30000 ms).

_Returns:_

- `Promise<PCI.RegistryGetter>` - A promise that resolves to the PCI registry getter.

_Examples:_

```typescript
import { PCILoader } from 'pci-loader';
const loader = new PCILoader('/path/to/myPCI/runtime.js');

loader
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
                    boundTo: { RESPONSE: { base: { string: 'value' } } },

                    // The instance of the PCI is returned by a callback
                    onready(interaction, initState) {
                        console.log('PCI rendered successfully');

                        resolve([interaction, initState]);
                    }
                };

                // The state can contain anything needed to restore the PCI
                const state = {};

                // Create an instance of the PCI, rendered in the specified container
                registry.getInstance(container, config, state);
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
        interaction.oncompleted();
    })
    .catch(err => {
        console.error('Error loading PCI:', err);
    });
```

_`PCILoader.getInstance()`_

```typescript
loader.getInstance(
    container: Element,
    configuration: PCI.Config,
    state: PCI.State, options?: { timeout?: number }
): Promise<[PCI.Interaction, PCI.State]>
```

Gets an instance of the PCI, rendered inside the specified container. If the PCI's runtime is not yet loaded, it will be loaded first.

The necessary dependencies are automatically loaded and made available to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext` is exposed. All other resources must be embedded in the PCI's runtime, using the [AMD API Specification](https://github.com/amdjs/amdjs-api/blob/master/AMD.md).

_Parameters:_

- `container: Element` - The DOM element where to render the PCI. Be sure to have the container prefilled with the layout expected by the PCI's runtime.
- `configuration: PCI.Config` - The configuration needed by the PCI to properly instantiate.
    - `.properties: Record<string, unknown>` - Properties to be passed to the PCI, a list of key-value pairs.
    - `.templateVariables: Record<string, PCI.Response>` - An object containing the templates variables as referenced in the PCI.
    - `.boundTo: { [key: string]: PCI.Response }` - An object representing the response for this QTI interaction. Usually, it starts empty and would be the response returned by the previous execution of the PCI when the item is revisited.
    - `.onready: (interaction: PCI.Interaction, state: PCI.State) => void` - A callback function the PCI must call once it is fully created and ready to operate. The instance of the PCI and the initial state must be supplied as parameters.

        **Note:** `PCILoader` automatically creates this callback. The consumer does not have to provide one, unless it needs to.

    - `.ondone: (interaction: PCI.Interaction, response: PCI.Response, state: State, status: string) => void` - An optional callback function the PCI **may** call to terminate the attempt. If the host supports it, it may supply this callback in order for the PCI to explicitly terminate the attempt, in the same way it is made using the standard endAttempt interaction.
    - `.status: string` - An optional value that specifies the item's status. If not specified, it should default to `interacting`.

- `state: PCI.State`: - An object representing the initial state of the PCI. This is useful when rendering an new instance of a previously terminated PCI.
- `options: object` - Options for loading the PCI's runtime and rendering it.
    - `.timeout: number` - The maximum time to wait for the PCI's runtime to load and render (default is 30000 ms).

_Returns:_

- `Promise<[PCI.Interaction, PCI.State]>` - A promise that resolves to the rendered PCI instance and its state.

_Example:_

Create a new `PCILoader` instance for a particular PCI, and get a rendered instance.

```typescript
import { PCILoader } from 'pci-loader';

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
    boundTo: { RESPONSE: { base: { string: 'value' } } }

    // No need to pass the 'onready' callback, the PCI loader will take over.
    // However, you can still provide it if needed, it will be wrapped.
    // onready(interaction, initState) { ... }
};

// The state can contain anything needed to restore the PCI
const state = {};

// Load and render the PCI
loader
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
        interaction.oncompleted();
    })
    .catch(err => {
        console.error('Error loading or rendering PCI:', err);
    });
```

---

### PCIRegistry

A registry for managing and retrieving PCI (Portable Custom Interaction) runtimes.

This registry is usually used for creating the resource `qtiCustomInteractionContext`. This is the only resource a PCI's runtime can request from the host application. It allows registering and retrieving PCI runtimes.

**Example:**

```typescript
import { PCIRegistry } from 'pci-loader';
const registry = new PCIRegistry();

// Register a PCI's runtime
registry.register({
    typeIdentifier: 'myPCI',
    getInstance(dom, config, state) {
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
    boundTo: { RESPONSE: { base: { string: 'value' } } },

    // The instance of the PCI is returned by a callback
    onready(interaction, initState) {
        console.log('PCI rendered successfully');

        resolve([interaction, initState]);
    }
};

// The state can contain anything needed to restore the PCI
const state = {};

// Get the PCI's runtime and render an instance into the given container
registry.getInstance(typeIdentifier, container, config, state);
```

**Constructor**

```typescript
new PCIRegistry();
```

**Methods**

_`PCIRegistry.register()`_

```typescript
registry.register(
    interaction: PCI.Registration
): void
```

Registers a PCI's runtime.

A runtime is represented by an object containing a unique typeIdentifier and a getInstance function.

_Parameters:_

- `interaction: PCI.Registration` - The PCI's runtime to register.
    - `.typeIdentifier` - The unique identifier for the PCI's runtime.
    - `.getInstance` - A function that renders the PCI into a DOM element and calls the `onready` callback provided through the configuration parameter.

_Throws:_

- `TypeError` If the PCI's runtime is invalid (e.g. missing typeIdentifier or getInstance).

_Examples:_

```typescript
import { PCIRegistry } from 'pci-loader';
const registry = new PCIRegistry();

// Register a PCI's runtime
registry.register({
    typeIdentifier: 'myPCI',
    getInstance(dom, config, state) {
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
```

_`PCIRegistry.getInstance()`_

```typescript
registry.getInstance(
    typeIdentifier: string,
    container: Element,
    configuration: PCI.Config,
    state: PCI.State
): void
```

Retrieves a registered PCI's runtime, then gets a new PCI's instance, passing in the provided parameters.

_Parameters:_

- `typeIdentifier: string` - The type identifier of the PCI.
- `container: Element` - The DOM element where to render the PCI. Be sure to have the container prefilled with the layout expected by the PCI's runtime.
- `configuration: PCI.Config` - The configuration needed by the PCI to properly instantiate.
    - `.properties: Record<string, unknown>` - Properties to be passed to the PCI, a list of key-value pairs.
    - `.templateVariables: Record<string, PCI.Response>` - An object containing the templates variables as referenced in the PCI.
    - `.boundTo: { [key: string]: PCI.Response }` - An object representing the response for this QTI interaction. Usually, it starts empty and would be the response returned by the previous execution of the PCI when the item is revisited.
    - `.onready: (interaction: PCI.Interaction, state: PCI.State) => void` - A **mandatory** callback function the PCI must call once it is fully created and ready to operate. The instance of the PCI and the initial state must be supplied as parameters.
    - `.ondone: (interaction: PCI.Interaction, response: PCI.Response, state: State, status: string) => void` - An optional callback function the PCI **may** call to terminate the attempt. If the host supports it, it may supply this callback in order for the PCI to explicitly terminate the attempt, in the same way it is made using the standard endAttempt interaction.
    - `.status: string` - An optional value that specifies the item's status. If not specified, it should default to `interacting`.
- `state: PCI.State`: - An object representing the initial state of the PCI. This is useful when rendering an new instance of a previously terminated PCI.

_Throws:_

- `ReferenceError` If the PCI's runtime is not registered.

_Example:_

```typescript
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
    boundTo: { RESPONSE: { base: { string: 'value' } } },

    // The instance of the PCI is returned by a callback
    onready(interaction, initState) {
        console.log('PCI rendered successfully');

        resolve([interaction, initState]);
    }
};

// The state can contain anything needed to restore the PCI
const state = {};

// Get the PCI's runtime and render an instance into the given container
registry.getInstance(typeIdentifier, container, config, state);
```

---

### AMDLoader

A utility for loading AMD modules and defining resources in a scoped context using [SystemJS](https://github.com/systemjs/systemjs).

Each AMDLoader instance has its own module registry. If multiple loaders are created, they will use their own context so that same-named resources don't conflict.

**Note:** the global `define` function is overridden each time a load is performed. To prevent conflict when using multiple loaders, a flow control mechanism is employed to ensure the loading process is completed before calling the next load.

**Example:**

```typescript
import { AMDLoader } from 'pci-loader';
loader = new AMDLoader();

// Pre-define a shared resource from an already loaded module, or an existing resource
loader.define('myResource', {
    // resource definition
});

// Map the resource to an external module path
loader.define('myResource', 'path/to/resource');

// Load the module and use the resources
loader
    .load('path/to/myModule')
    .then(resource => {
        console.log('AMD loaded successfully');

        // Do something with the resource
        // ...
    })
    .catch(err => {
        console.error('Error loading AMD:', err);
    });

// A module previously defined can also be loaded
loader
    .load('myResource')
    .then(resource => {
        console.log('AMD loaded successfully');

        // Do something with the resource
        // ...
    })
    .catch(err => {
        console.error('Error loading AMD:', err);
    });
```

**Constructor**

```typescript
new AMDLoader();
```

**Methods**

_`AMDLoader.define()`_

```typescript
loader.define(
    name: string,
    module: object | string, multiple?: boolean
): void
```

Defines a resource in the AMD context. The resource may be a preloaded module or a mapping to a different location.

_Parameters:_

- `name: string` - The name of the resource.
- `module: string | object` - An URI string or the resource object.

_Examples:_

```typescript
import { AMDLoader } from 'pci-loader';
loader = new AMDLoader();

// Pre-define a shared resource from an already loaded module, or an existing resource
loader.define('myResource', {
    // resource definition
});

// Map the resource to an external module path
loader.define('myResource', 'path/to/resource');
```

_`AMDLoader.load()`_

```typescript
loader.load(
    modulePath: string
): Promise<unknown>
```

Loads a scoped AMD module or bundle, and returns a promise that resolves with the module exports.

It temporarily overrides the global define function, ensuring only the declared module's
dependencies are available during loading.

If you need external resources, consider defining them upfront, using `loader.define()`.

_Parameters:_

- `modulePath: string` - The path to the module.

_Returns:_

- `Promise<unknown>` - A promise that resolves with the module exports.

_Examples:_

```typescript
import { AMDLoader } from 'pci-loader';
loader = new AMDLoader();

// Load the module and use the resources
loader
    .load('path/to/myModule')
    .then(resource => {
        console.log('AMD loaded successfully');

        // Do something with the resource
        // ...
    })
    .catch(err => {
        console.error('Error loading AMD:', err);
    });

// A module previously defined can also be loaded
loader
    .load('myResource')
    .then(resource => {
        console.log('AMD loaded successfully');

        // Do something with the resource
        // ...
    })
    .catch(err => {
        console.error('Error loading AMD:', err);
    });
```

---

## Scripts

- `dev`: Start development server with Vite
- `build`: Build the library
- `test`: Run tests with Vitest
- `lint`: Lint code with ESLint and Prettier

---

## Changes

For the changelog, see [CHANGELOG.md](CHANGELOG.md).

## License

Distributed under the [MIT License](./LICENSE).
