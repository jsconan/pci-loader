# AMDLoader Examples

Examples showing how to predefine and load AMD resources used by PCI runtimes.

## Predefine a resource object and load it

```ts
import { AMDLoader } from 'pci-loader';

const loader = new AMDLoader();
// Predefine a resource object
loader.define('myResource', { some: 'value' });

// Later, load the resource by name
const res = await loader.load('myResource');
```

## Map a resource to an external module path and load a runtime

```ts
// Map the resource name requested by the runtime to an URL
loader.define('myDependency', '/local/path/to/dependency.js');

// Load a runtime that depends on 'myDependency'
await loader.load('/path/to/runtime.js');
```

## Load an already defined module

```ts
// If a module was previously defined with the same name, you can load it
loader
    .load('myResource')
    .then(resource => {
        // use resource
    })
    .catch(err => console.error(err));
```

## Check and undefine

```ts
if (loader.defined('myDependency')) {
    loader.undefine('myDependency');
}
```
