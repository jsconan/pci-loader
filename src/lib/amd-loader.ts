import type { AMD, ESM, SystemJS } from 'lib/systemjs.d.ts';

// Dynamic module loader - must be imported before any other SystemJS module
import 'systemjs/dist/system.js';
// Full named define support - https://github.com/systemjs/systemjs/blob/main/docs/errors.md#W6
import 'systemjs/dist/extras/named-register.js';

/**
 * Flow control for module imports. This ensures that when using multiple loaders,
 * the loading process completes before calling the next load.
 * This is needed because the global `define` function is overridden during loading.
 */
let importFlow = Promise.resolve();

/**
 * A utility for loading AMD modules and defining resources in a scoped context using [SystemJS](https://github.com/systemjs/systemjs).
 *
 * Each AMDLoader instance has its own module registry. If multiple loaders are created,
 * they will use their own context so that same-named resources don't conflict.
 *
 * **Note:** the global `define` function is overridden each time a load is performed. To prevent
 * conflict when using multiple loaders, a flow control mechanism is employed to ensure the loading
 * process is completed before calling the next load.
 * @example
 * import { AMDLoader } from 'pci-loader';
 * loader = new AMDLoader();
 *
 * // Pre-define a shared resource from an already loaded module, or an existing resource
 * loader.define('myResource', {
 *     // resource definition
 * });
 *
 * // Map the resource to an external module path
 * loader.define('myResource', 'path/to/resource');
 *
 * // Load the module and use the resources
 * loader.load('path/to/myModule').then(exports => {
 *     // Use the module exports
 * });
 *
 * // A module previously defined can also be loaded
 * loader.load('myResource').then(exports => {
 *     // Use the module exports
 * });
 */
export class AMDLoader {
    #loader: SystemJS.Instance;
    #importMap: SystemJS.ImportMap;
    #define: AMD.Define;

    constructor() {
        this.#loader = new System.constructor();
        this.#importMap = {
            imports: {},
            scopes: {}
        };

        this.#define = (
            nameOrDepsOrResource: string | string[] | object | AMD.ResourceFactory,
            depsOrFactory?: string[] | AMD.ResourceFactory,
            factory?: AMD.ResourceFactory
        ) => {
            const [name, amdRegister] = extractRegistrationContext(nameOrDepsOrResource, depsOrFactory, factory);
            if (name) {
                this.#loader.registerRegistry[name] = amdRegister;
                this.#loader.register(name, amdRegister[0], amdRegister[1]);
            } else {
                this.#loader.register(amdRegister[0], amdRegister[1]);
            }
        };
        this.#define.amd = {};
    }

    /**
     * Defines a resource in the AMD context.
     * The resource may be a preloaded module or a mapping to a different location.
     * @param name - The name of the resource.
     * @param module - An URI string or the resource object.
     * @example
     * import { AMDLoader } from 'pci-loader';
     * loader = new AMDLoader();
     *
     * // Pre-define a shared resource from an already loaded module, or an existing resource
     * loader.define('myResource', {
     *     // resource definition
     * });
     *
     * // Map the resource to an external module path
     * loader.define('myResource', 'path/to/resource');
     */
    define(name: string, module: string | ESM.Module, multiple: boolean = false): void {
        if (typeof module == 'string') {
            this.#importMap.imports[name] = module;
        } else {
            // use the `app:*` scheme for internal resources
            // https://github.com/systemjs/systemjs/blob/6.15.1/docs/api.md#systemsetid-module---module
            const uri = `app:${name}`;
            this.#importMap.imports[name] = uri;
            if (multiple || module[Symbol.toStringTag] === 'Module') {
                this.#loader.set(uri, module);
            } else {
                this.#loader.set(uri, {
                    default: module,
                    __useDefault: true
                });
            }
        }
    }

    /**
     * Loads a scoped AMD module or bundle, and returns a promise that resolves with the module exports.
     * It temporarily overrides the global define function, ensuring only the declared module's
     * dependencies are available during loading.
     * If you need external resources, consider defining them upfront, using `loader.define()`.
     * @param modulePath - The path to the module.
     * @returns A promise that resolves with the module exports.
     * @example
     * import { AMDLoader } from 'pci-loader';
     * loader = new AMDLoader();
     *
     * // Load the module and use the resources
     * loader.load('path/to/myModule').then(exports => {
     *     // Use the module exports
     * });
     *
     * // A module previously defined can also be loaded
     * loader.load('myResource').then(exports => {
     *     // Use the module exports
     * });
     */
    async load(modulePath: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const uncaughtError = (e: ErrorEvent) => {
                // Only catch errors coming either from SystemJS or the loaded module
                if (e.message?.includes('SystemJS Error') || e.error?.stack?.includes(modulePath)) {
                    e.preventDefault();
                    reject(e.error);
                }
            };

            importFlow = importFlow.then(() => {
                try {
                    // The importMap needs to be redefined on each load.
                    // This map is globally managed by SystemJS, and other loaders may modify it.
                    this.#loader.addImportMap(this.#importMap);

                    // Override the global define function.
                    // This is needed to control the scope.
                    const define = globalThis.define;
                    globalThis.define = this.#define;
                    window.addEventListener('error', uncaughtError);

                    return this.#loader
                        .import(modulePath)
                        .then((module: ESM.Module | unknown) => {
                            resolve(extractESM(module as ESM.Module));
                        })
                        .catch(reject)
                        .finally(() => {
                            globalThis.define = define;
                            window.removeEventListener('error', uncaughtError);
                        });
                } catch (error) {
                    return reject(error);
                }
            });
        });
    }
}

// AMD support extracted and refactored from 'systemjs/dist/extras/amd.js'
// <[[[

/**
 * Generate an error message for SystemJS errors.
 * @param errCode - The error code.
 * @param msg - The error message.
 * @returns The formatted error message.
 */
function errMsg(errCode: string | number, msg: string): string {
    return `${msg} (SystemJS Error#${errCode} https://github.com/systemjs/systemjs/blob/main/docs/errors.md#${errCode})`;
}

/**
 * Throw an error for unsupported AMD require calls.
 */
function unsupportedRequire(): never {
    throw Error(errMsg(5, 'AMD require not supported.'));
}

/**
 * Extract the exports from an ESM (ECMAScript Module).
 * @param module - The SystemJS module to extract from.
 * @returns The exports of the module.
 */
function extractESM(module: ESM.Module): ESM.Exports {
    return module?.__useDefault ? module?.default : module;
}

/**
 * Get the setter function for a specific dependency module.
 * @param idx - The index of the dependency module.
 * @param depModules - The array of dependency modules.
 * @returns The setter function for the dependency module.
 */
function getSetter(idx: number, depModules: AMD.ModuleExport[]): SystemJS.ModuleSetter {
    return (module: ESM.Module) => (depModules[idx] = extractESM(module));
}

/**
 * Create an AMD module registration.
 * @param amdDefineDeps - The AMD module dependencies.
 * @param amdDefineExec - The AMD module execution function.
 * @returns The SystemJS module registration.
 */
function createAMDRegister(amdDefineDeps: string[], amdDefineExec: AMD.ResourceFactory): SystemJS.ModuleRegistration {
    const amdExec: AMD.ResourceFactory = amdDefineExec;
    const exports: ESM.Exports = {};
    const module: ESM.ModuleExport = { exports: exports };
    const depModules: AMD.ModuleExport[] = [];
    const setters: SystemJS.ModuleSetter[] = [];

    let splice = 0;
    for (let i = 0; i < amdDefineDeps.length; i++) {
        const id = amdDefineDeps[i];
        const index = setters.length;

        if (id === 'require') {
            depModules[i] = unsupportedRequire;
            splice++;
        } else if (id === 'module') {
            depModules[i] = module;
            splice++;
        } else if (id === 'exports') {
            depModules[i] = exports;
            splice++;
        } else {
            setters.push(getSetter(i, depModules));
        }

        if (splice) {
            amdDefineDeps[index] = id;
        }
    }

    if (splice) {
        amdDefineDeps.length -= splice;
    }

    return [
        amdDefineDeps,
        (_export: SystemJS.ExportSignature, _context: ESM.ModuleContext): SystemJS.ModuleDeclaration => {
            _export({ default: exports, __useDefault: true });
            return {
                setters: setters,
                execute() {
                    module.uri = _context.meta.url;
                    const amdResult: ESM.Exports = amdExec.apply(exports, depModules);
                    if (amdResult !== undefined) {
                        module.exports = amdResult;
                    }
                    _export(module.exports);
                    _export('default', module.exports);
                }
            };
        }
    ];
}

/**
 * Extract the registration context from an AMD module definition.
 * @param nameOrDepsOrResource - The name, dependencies, or resource of the AMD module.
 * @param depsOrFactory - The dependencies or factory function of the AMD module.
 * @param factory - The factory function of the AMD module.
 * @returns The extracted registration context.
 */
function extractRegistrationContext(
    nameOrDepsOrResource: string | string[] | object | AMD.ResourceFactory,
    depsOrFactory?: string[] | AMD.ResourceFactory,
    factory?: AMD.ResourceFactory
): SystemJS.RegistrationContext {
    const isNamedRegister = typeof nameOrDepsOrResource === 'string';
    const name: string | null = isNamedRegister ? nameOrDepsOrResource : null;
    const depArg: string[] | object | undefined = isNamedRegister ? depsOrFactory : nameOrDepsOrResource;
    const execArg: AMD.ResourceFactory = (isNamedRegister ? factory : depsOrFactory) as AMD.ResourceFactory;

    // The System.register(deps, exec) arguments
    let deps: string[];
    let exec: AMD.ResourceFactory;

    // define([], function () {})
    if (Array.isArray(depArg)) {
        deps = depArg;
        exec = execArg;
    }
    // define({})
    else if (typeof depArg === 'object') {
        deps = [];
        exec = function () {
            return depArg;
        };
    }
    // define(function () {})
    else if (typeof depArg === 'function') {
        deps = ['require', 'exports', 'module'];
        exec = depArg;
    }
    // invalid define call
    else {
        throw Error(errMsg(9, 'Invalid call to AMD define()'));
    }

    return [name, createAMDRegister(deps, exec)];
}

// ]]]>
// End of AMD support extracted and refactored from 'systemjs/dist/extras/amd.js'
