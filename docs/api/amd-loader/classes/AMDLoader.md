[**pci-loader**](../../README.md)

***

# Class: AMDLoader

Defined in: [src/lib/amd-loader.ts:46](https://github.com/jsconan/pci-loader/blob/127aab7ff06870fee80ad42511f9a58fd9c04b9d/src/lib/amd-loader.ts#L46)

A utility for loading AMD modules and defining resources in a scoped context using [SystemJS](https://github.com/systemjs/systemjs).

Each AMDLoader instance has its own module registry. If multiple loaders are created,
they will use their own context so that same-named resources don't conflict.

**Note:** the global `define` function is overridden each time a load is performed. To prevent
conflict when using multiple loaders, a flow control mechanism is employed to ensure the loading
process is completed before calling the next load.

## Example

```ts
import { AMDLoader } from 'pci-loader';
const loader = new AMDLoader();

// Pre-define a shared resource from an already loaded module, or an existing resource
loader.define('myResource', {
    // resource definition
});

// Map the resource to an external module path
loader.define('myResource', 'path/to/resource');

// Load the module and use the resources
loader.load('path/to/myModule').then(exports => {
    // Use the module exports
});

// A module previously defined can also be loaded
loader.load('myResource').then(exports => {
    // Use the module exports
});
```

## Constructors

### Constructor

> **new AMDLoader**(): `AMDLoader`

Defined in: [src/lib/amd-loader.ts:51](https://github.com/jsconan/pci-loader/blob/127aab7ff06870fee80ad42511f9a58fd9c04b9d/src/lib/amd-loader.ts#L51)

#### Returns

`AMDLoader`

## Methods

### define()

> **define**(`name`, `module`, `esm?`): `void`

Defined in: [src/lib/amd-loader.ts:94](https://github.com/jsconan/pci-loader/blob/127aab7ff06870fee80ad42511f9a58fd9c04b9d/src/lib/amd-loader.ts#L94)

Defines a resource in the AMD context.
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
import { AMDLoader } from 'pci-loader';
const loader = new AMDLoader();

// Pre-define a shared resource from an already loaded module, or an existing resource
loader.define('myResource', {
    // resource definition
});

// Map the resource to an external module path
loader.define('myResource', 'path/to/resource');
```

***

### defined()

> **defined**(`name`): `boolean`

Defined in: [src/lib/amd-loader.ts:147](https://github.com/jsconan/pci-loader/blob/127aab7ff06870fee80ad42511f9a58fd9c04b9d/src/lib/amd-loader.ts#L147)

Checks if a resource is defined in the AMD context.

#### Parameters

##### name

`string`

The name or the url of the resource.

#### Returns

`boolean`

True if the resource is defined, false otherwise.

#### Example

```ts
import { AMDLoader } from 'pci-loader';
const loader = new AMDLoader();

// Check if a resource is defined
const isDefined = loader.defined('path/to/resource');
console.log(isDefined); // true or false
```

***

### load()

> **load**(`modulePath`): `Promise`\<`unknown`\>

Defined in: [src/lib/amd-loader.ts:172](https://github.com/jsconan/pci-loader/blob/127aab7ff06870fee80ad42511f9a58fd9c04b9d/src/lib/amd-loader.ts#L172)

Loads a scoped AMD module or bundle, and returns a promise that resolves with the module exports.
It temporarily overrides the global define function, ensuring only the declared module's
dependencies are available during loading.
If you need external resources, consider defining them upfront, using `loader.define()`.

#### Parameters

##### modulePath

`string`

The path to the module.

#### Returns

`Promise`\<`unknown`\>

A promise that resolves with the module exports.

#### Example

```ts
import { AMDLoader } from 'pci-loader';
const loader = new AMDLoader();

// Load the module and use the resources
loader.load('path/to/myModule').then(exports => {
    // Use the module exports
});

// A module previously defined can also be loaded
loader.load('myResource').then(exports => {
    // Use the module exports
});
```

***

### undefine()

> **undefine**(`name`): `void`

Defined in: [src/lib/amd-loader.ts:126](https://github.com/jsconan/pci-loader/blob/127aab7ff06870fee80ad42511f9a58fd9c04b9d/src/lib/amd-loader.ts#L126)

Removes a resource from the AMD context.

#### Parameters

##### name

`string`

The name or the url of the resource to remove.

#### Returns

`void`

#### Example

```ts
import { AMDLoader } from 'pci-loader';
const loader = new AMDLoader();

// Load a module
loader.load('path/to/resource');

// Remove the module
loader.undefine('path/to/resource');
```
