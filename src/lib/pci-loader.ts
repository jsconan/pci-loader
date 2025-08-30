import { AMDLoader } from 'lib/amd-loader.ts';
import { PCIRegistry } from 'lib/pci-registry.ts';
import { timedPromise } from 'lib/timeout.ts';
import type { PCI, PCILoaderOptions, PCILoaderStatus } from 'lib/types.d.ts';

/**
 * Loads a PCI's runtime in a scoped manner.
 *
 * This loader is used to load PCI runtimes dynamically, ensuring that they are properly
 * registered and can be accessed within the context of the application.
 *
 * The necessary dependencies are automatically loaded and made available
 * to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext`
 * is exposed. All other resources must be embedded in the PCI's runtime, using the AMD format.
 *
 * The loader needs the URL to the PCI's runtime script. The name of the PCI can also be provided,
 * otherwise it will be extracted from the PCI's runtime itself. If the name is provided, it must
 * match the `typeIdentifier` of the PCI's runtime.
 * @example
 * import { PCILoader } from 'pci-loader';
 * let loader;
 *
 * // Create a new PCILoader instance for a particular PCI. Name will be extracted from the runtime.
 * loader = new PCILoader('/path/to/myPCI/runtime.js');
 *
 * // Create a new PCILoader instance for a particular PCI, specifying the name.
 * // Name must match the runtime's typeIdentifier.
 * loader = new PCILoader('/path/to/myPCI/runtime.js', 'myPCI');
 *
 * // Prepare the container and config for rendering the PCI
 * // Be sure to have the container prefilled with the layout expected by the PCI's runtime
 * const container = document.querySelector('#pci-container');
 *
 * // The configuration for the PCI.
 * const config = {
 *     // The properties to pass to the PCI
 *     properties: {
 *         key: 'value'
 *     },
 *
 *     // The response variable the PCI is bound to
 *     boundTo: { 'RESPONSE': { base: { string: 'value' } } },
 *
 *     // The instance of the PCI is returned by a callback
 *     onready: (interaction, state) => {
 *         // Handle the PCI's readiness
 *     },
 * };
 *
 * // The state can contain anything needed to restore the PCI
 * const state = {};
 *
 * // Load the PCI's runtime, then get an instance from the registry.
 * loader
 *     .load()
 *     .then(registry => registry.getInstance(loader.name, container, config, state))
 *     .catch(error => console.error(error));
 *
 * // A PCI instance can also be rendered into a container right after the loading process
 * loader
 *     .getInstance(container, config, state)
 *     .then(([interaction, state]) => {
 *         // Do something with the rendered interaction and its state
 *     })
 *     .catch(error => console.error(error));
 *
 * // Minimal implementation of a PCI's runtime
 * // file: /path/to/myPCI/runtime.js
 * define('myPCI', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
 *     qtiCustomInteractionContext.register({
 *         typeIdentifier: 'myPCI',
 *         getInstance(dom, config, state) {
 *             const myInteraction = {
 *                 getResponse() { },
 *                 getState() { },
 *                 oncompleted() { }
 *             };
 *
 *             if (typeof config.onready === 'function') {
 *                 config.onready(myInteraction, state);
 *             }
 *         }
 *     });
 * });
 */
export class PCILoader {
    #name?: string;
    #url: string;
    #status: PCILoaderStatus;
    #importFlow: Promise<PCI.RegistryGetter | void>;

    /**
     * @param url - The URL of the PCI's runtime script.
     * @param name - The name of the PCI (optional). If the name is provided, it must match the
     * `typeIdentifier` of the PCI's runtime. Otherwise it will be extracted from the PCI's runtime itself.
     */
    constructor(url: string, name?: string) {
        this.#name = name;
        this.#url = url;
        this.#status = 'initial';
        this.#importFlow = Promise.resolve();
    }

    /**
     * Gets the name of the PCI. If not provided at construction, it will be extracted from the
     * PCI's runtime itself. The value may be undefined if the PCI's runtime is not yet loaded.
     * @returns The name of the PCI.
     */
    get name(): string | undefined {
        return this.#name;
    }

    /**
     * Gets the URL of the PCI's runtime.
     * @returns The URL of the PCI's runtime.
     */
    get url(): string {
        return this.#url;
    }

    /**
     * Gets the status of the PCI loader.
     * It will be:
     * - 'initial' when the loader is created.
     * - 'loading' when the PCI's runtime is being loaded.
     * - 'loaded' when the PCI's runtime is successfully loaded.
     * - 'error' if there was an error loading the PCI.
     * @returns The status of the PCI loader.
     */
    get status(): PCILoaderStatus {
        return this.#status;
    }

    /**
     * Loads the PCI's runtime in a scoped manner. Subsequent calls to load will return the same
     * registry object.
     *
     * If the name was not provided at construction, it will be extracted from the PCI's runtime
     * itself upon registration. If the name does not match the runtime's typeIdentifier,
     * a TypeError will be thrown.
     *
     * The necessary dependencies are automatically loaded and made available
     * to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext`
     * is exposed. All other resources must be embedded in the PCI's runtime, using the AMD format.
     * @param options - Options for loading the PCI's runtime.
     * @param options.timeout - The maximum time to wait for the PCI's runtime to load (default is 30000 ms).
     * @returns A promise that resolves to the PCI registry getter.
     * @example
     * import { PCILoader } from 'pci-loader';
     *
     * // Create a new PCILoader instance for a particular PCI
     * const loader = new PCILoader('/path/to/myPCI/runtime.js', 'myPCI');
     *
     * // Prepare the container and config for rendering the PCI
     * // Be sure to have the container prefilled with the layout expected by the PCI's runtime
     * const container = document.querySelector('#pci-container');
     *
     * // The configuration for the PCI.
     * const config = {
     *     // The properties to pass to the PCI
     *     properties: {
     *         key: 'value'
     *     },
     *
     *     // The response variable the PCI is bound to
     *     boundTo: { 'RESPONSE': { base: { string: 'value' } } },
     *
     *     // The instance of the PCI is returned by a callback
     *     onready: (interaction, state) => {
     *         // Handle the PCI's readiness
     *     },
     * };
     *
     * // The state can contain anything needed to restore the PCI
     * const state = {};
     *
     * // Load the PCI's runtime, then get an instance from the registry
     * loader
     *     .load().then(registry => registry.getInstance(loader.name, container, config, state))
     *     // An error is thrown if timeout occurs, or if the name does not match the runtime's typeIdentifier.
     *     .catch(error => console.error(error));
     *
     * // Minimal implementation of a PCI's runtime
     * // file: /path/to/myPCI/runtime.js
     * define('myPCI', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
     *     qtiCustomInteractionContext.register({
     *         typeIdentifier: 'myPCI',
     *         getInstance(dom, config, state) {
     *             const myInteraction = {
     *                 getResponse() { },
     *                 getState() { },
     *                 oncompleted() { }
     *             };
     *
     *             if (typeof config.onready === 'function') {
     *                 config.onready(myInteraction, state);
     *             }
     *         }
     *     });
     * });
     */
    async load({ timeout = 30000 }: PCILoaderOptions = {}): Promise<PCI.RegistryGetter> {
        this.#importFlow = this.#importFlow.then((registered: PCI.RegistryGetter | void) => {
            if (registered) {
                return registered;
            }

            let promise: Promise<PCI.RegistryGetter> = new Promise((resolve, reject) => {
                const loader = new AMDLoader();

                loader.define('qtiCustomInteractionContext', {
                    register: (interaction: PCI.Registration) => {
                        try {
                            if (!this.#name) {
                                this.#name = interaction.typeIdentifier;
                            } else if (interaction.typeIdentifier !== this.#name) {
                                throw new TypeError(
                                    `Expected PCI '${this.#name}', got '${interaction.typeIdentifier}' instead`
                                );
                            }

                            const registry = new PCIRegistry();
                            registry.register(interaction);
                            this.#status = 'loaded';

                            resolve({ getInstance: registry.getInstance.bind(registry) });
                        } catch (error) {
                            reject(error);
                        }
                    }
                });

                this.#status = 'loading';
                loader.load(this.#url).catch(reject);
            });

            if (timeout) {
                promise = timedPromise(promise, { timeout, message: 'Loading PCI timed out' });
            }

            return promise.catch(error => {
                this.#status = 'error';
                throw error;
            });
        });

        return this.#importFlow as Promise<PCI.RegistryGetter>;
    }

    /**
     * Gets an instance of the PCI, rendered inside the specified container.
     *
     * If the PCI is not yet loaded, it will be loaded first.
     * The necessary dependencies are automatically loaded and made available
     * to the PCI's runtime. From the host, only the resource `qtiCustomInteractionContext`
     * is exposed. All other resources must be embedded in the PCI's runtime, using the AMD format.
     * @param container - The DOM element to render the PCI into. Be sure to have the container prefilled with the layout expected by the PCI's runtime.
     * @param configuration - The configuration options for the PCI.
     * @param configuration.properties - Properties to be passed to the PCI, a list of key-value pairs.
     * @param configuration.templateVariables - An object containing the templates variables as referenced in the PCI.
     * @param configuration.boundTo - An object representing the response for this QTI interaction.
     * Usually, it starts empty and would be the response returned by the previous execution of the PCI when the item is revisited.
     * @param configuration.onready - A callback function the PCI must call once it is fully created and ready to operate.
     * The instance of the PCI and the initial state must be supplied as parameters.
     * **Note:** `PCILoader` automatically creates this callback. The consumer does not have to provide one, unless it needs to.
     * @param configuration.ondone - An optional callback function the PCI **may** call to terminate the attempt.
     * If the host supports it, it may supply this callback in order for the PCI to explicitly terminate the attempt,
     * in the same way it is made using the standard endAttempt interaction.
     * @param configuration.status - An optional value that specifies the item's status. If not specified, it should default to `interacting`.
     * @param state - An object representing the initial state of the PCI. This is useful when rendering an new instance of a previously terminated PCI.
     * @param options - Options for loading the PCI's runtime and rendering it.
     * @param options.timeout - The maximum time to wait for the PCI's runtime to load and render (default is 30000 ms).
     * @returns A promise that resolves to the rendered PCI instance and its state.
     * @example
     * import { PCILoader } from 'pci-loader';
     *
     * // Create a new PCILoader instance for a particular PCI
     * const loader = new PCILoader('/path/to/myPCI/runtime.js');
     *
     * // Prepare the container and config for rendering the PCI
     * // Be sure to have the container prefilled with the layout expected by the PCI's runtime
     * const container = document.querySelector('#pci-container');
     *
     * // The configuration for the PCI.
     * const config = {
     *     // The properties to pass to the PCI
     *     properties: {
     *         key: 'value'
     *     },
     *
     *     // The response variable the PCI is bound to
     *     boundTo: { 'RESPONSE': { base: { string: 'value' } } },
     *
     *     // No need to pass the 'onready' callback, the PCI loader will take over.
     *     // However, you can still provide it if needed, it will be wrapped.
     *     // onready(interaction, initState) {
     *         console.log('PCI is ready');
     *     }
     * };
     *
     * // The state can contain anything needed to restore the PCI
     * const state = {};
     *
     * // Loads the PCI's runtime, and get an instance rendered inside the container.
     * loader
     *     .getInstance(container, config, state)
     *     .then(([interaction, state]) => {
     *         // Do something with the rendered interaction and its state
     *     })
     *     // An error is thrown if timeout occurs, or if the name does not match the runtime's typeIdentifier.
     *     .catch(error => console.error(error));
     *
     * // Minimal implementation of a PCI's runtime
     * // file: /path/to/myPCI/runtime.js
     * define('myPCI', ['qtiCustomInteractionContext'], function (qtiCustomInteractionContext) {
     *     qtiCustomInteractionContext.register({
     *         typeIdentifier: 'myPCI',
     *         getInstance(dom, config, state) {
     *             const myInteraction = {
     *                 getResponse() { },
     *                 getState() { },
     *                 oncompleted() { }
     *             };
     *
     *             if (typeof config.onready === 'function') {
     *                 config.onready(myInteraction, state);
     *             }
     *         }
     *     });
     * });
     */
    async getInstance(
        container: Element,
        configuration: PCI.Config,
        state: PCI.State,
        { timeout = 30000 }: PCILoaderOptions = {}
    ): Promise<[PCI.Interaction, PCI.State]> {
        const start = Date.now();
        return this.load({ timeout }).then((registry: PCI.RegistryGetter) => {
            const promise: Promise<[PCI.Interaction, PCI.State]> = new Promise((resolve, reject) => {
                try {
                    registry.getInstance(
                        this.#name as string,
                        container,
                        {
                            ...configuration,
                            onready: (interaction: PCI.Interaction, initState: PCI.State) => {
                                configuration.onready?.(interaction, initState);
                                resolve([interaction, initState]);
                            }
                        },
                        state
                    );
                } catch (err) {
                    reject(err);
                }
            });

            if (!timeout) {
                return promise;
            }

            const elapsed = Date.now() - start;
            return timedPromise(promise, {
                timeout: Math.max(timeout - elapsed, 0),
                message: 'Getting PCI instance timed out'
            });
        });
    }
}
