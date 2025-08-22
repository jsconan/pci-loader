import type { PCI } from 'lib/pci.d.ts';

/**
 * A registry for managing and retrieving PCI (Portable Custom Interaction) runtimes.
 *
 * This registry is usually used for creating the resource `qtiCustomInteractionContext`.
 * This is the only resource a PCI's runtime can request from the host application.
 * It allows registering and retrieving PCI runtimes.
 * @example
 * import { PCIRegistry } from 'pci-loader';
 * const registry = new PCIRegistry();
 *
 * // Register a PCI's runtime
 * registry.register({
 *     typeIdentifier: 'myPCI',
 *     getInstance(dom, config, state) {
 *         // Minimal implementation of a PCI's runtime
 *         const myInteraction = {
 *             getResponse() { },
 *             getState() { },
 *             oncompleted() { }
 *         };
 *        if (typeof config.onready === 'function') {
 *             config.onready(myInteraction, state);
 *         }
 *     }
 * });
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
 * // Get the PCI's runtime and render an instance into the given container
 * registry.getInstance(typeIdentifier, container, config, state);
 */
export class PCIRegistry implements PCI.Registry {
    #interactions: Map<string, PCI.Registration>;

    constructor() {
        this.#interactions = new Map();
    }

    /**
     * Registers a PCI's runtime.
     *
     * A runtime is represented by an object containing a unique typeIdentifier and a getInstance function.
     * @param interaction - The PCI's runtime to register.
     * @param interaction.typeIdentifier - The unique identifier for the PCI's runtime.
     * @param interaction.getInstance - A function that renders the PCI into a DOM element and calls
     * the `onready` callback provided through the configuration parameter.
     * @throws {TypeError} If the PCI's runtime is invalid (e.g. missing typeIdentifier or getInstance).
     * @example
     * import { PCIRegistry } from 'pci-loader';
     * const registry = new PCIRegistry();
     *
     * // Register a PCI's runtime
     * registry.register({
     *     typeIdentifier: 'myPCI',
     *     getInstance(dom, config, state) {
     *         // Minimal implementation of a PCI's runtime
     *         const myInteraction = {
     *             getResponse() { },
     *             getState() { },
     *             oncompleted() { }
     *         };
     *
     *         if (typeof config.onready === 'function') {
     *             config.onready(myInteraction, state);
     *         }
     *     }
     * });
     */
    register(interaction: PCI.Registration): void {
        // Runtime validation - the context is invoked by an untrusted module
        if (!interaction?.typeIdentifier || typeof interaction?.getInstance !== 'function') {
            throw new TypeError('Invalid interaction');
        }

        this.#interactions.set(interaction.typeIdentifier, interaction);
    }

    /**
     * Retrieves a registered PCI's runtime, then gets a new PCI's instance, passing in the provided parameters.
     * @param typeIdentifier - The type identifier of the PCI.
     * @param container - The DOM element to render the PCI into. Be sure to have the container prefilled with the layout expected by the PCI's runtime.
     * @param configuration - The configuration options for the PCI.
     * @param configuration.properties - Properties to be passed to the PCI, a list of key-value pairs.
     * @param configuration.templateVariables - An object containing the templates variables as referenced in the PCI.
     * @param configuration.boundTo - An object representing the response for this QTI interaction.
     * Usually, it starts empty and would be the response returned by the previous execution of the PCI when the item is revisited.
     * @param configuration.onready - A **mandatory** callback function the PCI must call once it is fully created and ready to operate.
     * The instance of the PCI and the initial state must be supplied as parameters.
     * @param configuration.ondone - An optional callback function the PCI **may** call to terminate the attempt.
     * If the host supports it, it may supply this callback in order for the PCI to explicitly terminate the attempt,
     * in the same way it is made using the standard endAttempt interaction.
     * @param configuration.status - An optional value that specifies the item's status. If not specified, it should default to `interacting`.
     * @param state - An object representing the initial state of the PCI. This is useful when rendering a new instance of a previously terminated PCI.
     * @throws {ReferenceError} If the PCI's runtime is not registered.
     * @example
     * import { PCIRegistry } from 'pci-loader';
     * const registry = new PCIRegistry();
     *
     * // Register a PCI's runtime
     * registry.register({ typeIdentifier, ... });
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
     * // Get the PCI's runtime and render an instance
     * registry.getInstance(typeIdentifier, container, config, state);
     */
    getInstance(typeIdentifier: string, container: Element, configuration: PCI.Config, state: PCI.State): void {
        const interaction = this.#interactions.get(typeIdentifier);
        if (!interaction) {
            throw new ReferenceError(`Interaction "${typeIdentifier}" not found`);
        }
        interaction.getInstance(container, configuration, state);
    }
}

export default PCIRegistry;
