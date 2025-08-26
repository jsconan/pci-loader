import fs from 'fs';
import type { SystemJS } from 'lib/types.d.ts';
import { basename } from 'path';
import 'systemjs/dist/system.js';
import { samples, samplesHost } from 'tests/setup/config.ts';
import { Script } from 'tests/setup/utils.ts';
import { afterEach, vi } from 'vitest';

const systemJSPrototype = System.constructor.prototype;
const instantiate = systemJSPrototype.instantiate;
const addImportMap = systemJSPrototype.addImportMap;

/**
 * Override SystemJS.instantiate for serving sample files without requiring network access
 */
systemJSPrototype.instantiate = function (
    url: string,
    firstParentUrl: string
): Promise<SystemJS.ModuleRegistration | undefined> {
    // Rewrite the URL to a resource name when it is a sample file.
    if (url.startsWith(samplesHost)) {
        url = basename(url, '.js');
    }

    if (url in samples) {
        const content = fs.readFileSync(samples[url], 'utf-8');

        // Override the global define function to capture the register
        const define = globalThis.define;
        let register: SystemJS.ModuleRegistration | undefined;
        globalThis.define = (...args) => {
            define(...args);
            register = this.getRegister();
        };

        // Evaluate the AMD source inside the current global scope
        // so that it hits `globalThis.define` (scoped by AMDLoader.load)
        Script.evaluate(content);

        // Restore the global define function for the next call
        globalThis.define = define;

        // After define() runs, SystemJS will have stashed the register
        // return it just like the real script loader would
        return Promise.resolve(register);
    } else {
        return instantiate.call(this, url, firstParentUrl);
    }
};

/**
 * Override SystemJS.addImportMap for mocking import map failures
 */
systemJSPrototype.addImportMap = (newMap: SystemJS.ImportMap, mapBase?: string) => {
    // Mock a failure in the import map.
    // It occurs under peculiar circumstances difficult to reproduce, for instance when SSR applies.
    // As the tests run under a single context (e.g browser or node), we cannot simulate both in one test.
    if ('invalid' in newMap.imports) {
        throw new TypeError("Cannot read properties of undefined (reading 'slice')");
    }
    addImportMap(newMap, mapBase);
};

afterEach(() => {
    vi.restoreAllMocks();
});
