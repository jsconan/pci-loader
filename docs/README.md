# Documentation

`pci-loader` is a tiny TypeScript library for dynamically loading and managing PCI (Portable Custom Interaction) runtimes in modern web applications. It provides a scoped loader and registry for PCI modules, supporting AMD and SystemJS formats.

Try the live demo: [demo](https://jsconan.github.io/pci-loader/).

## Features

- **Dynamic PCI loading**: Load PCI runtimes at runtime from URLs.
- **Scoped registry**: Each loader instance manages its own PCI registry.
- **AMD & SystemJS support**: Uses [SystemJS](https://github.com/systemjs/systemjs) for module loading and AMD for PCI's runtime definitions.
- **Custom interaction context**: Exposes only the `qtiCustomInteractionContext` resource to loaded PCIs.
- **TypeScript support**: Fully typed API for safe integration.
- **Light**: Only one dependency, with [SystemJS](https://github.com/systemjs/systemjs).
- **Small**: ~2KB GZipped.

## Main Components

- `PCILoader` — Loads a PCI runtime from a URL in a scoped context, then renders instances.
- `PCILoaderDev` — Development version that allows mapping external resources before loading.
- `PCIRegistry` — Register and retrieve PCI runtimes programmatically; used by `qtiCustomInteractionContext`.
- `AMDLoader` — Small scoped AMD loader that provides resources to AMD runtimes while keeping definitions local.

## Pages

- [Install](./install.md): How to install the package for your project.
- [Definition](./definition.md): What is a PCI and how runtimes are defined.
- [Examples](./examples/README.md): Quick examples and links to detailed examples.
    - [PCILoader](./examples/examples-pciloader.md)
    - [PCILoaderDev](./examples/examples-dev.md)
    - [PCIRegistry](./examples/examples-registry.md)
    - [AMDLoader](./examples/examples-amdloader.md)
- [API reference](./api/README.md): Generated API documentation by module.
- [Scripts](./scripts.md): List of npm scripts and descriptions.

## License

MIT License - See LICENSE file for details.
