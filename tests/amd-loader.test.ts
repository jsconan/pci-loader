// @vitest-environment jsdom
import { AMDLoader } from 'lib/amd-loader.ts';
import type { ESM } from 'lib/systemjs';
import { samplesHost } from 'tests/setup/config.ts';
import { Script } from 'tests/setup/utils.ts';
import { describe, expect, it, vi } from 'vitest';

describe('AMDLoader', () => {
    it('should instantiate without errors', () => {
        expect(new AMDLoader()).toBeInstanceOf(AMDLoader);
    });

    it('should define a resource with an object (no error)', async () => {
        const loader = new AMDLoader();
        expect(() => loader.define('testResourceObjectNoError', { foo: 'bar' })).not.toThrow();
    });

    it('should define a resource with a string (module path) without error', () => {
        const loader = new AMDLoader();
        expect(() => loader.define('testResourcePathNoError', '/path/to/module.js')).not.toThrow();
    });

    it('should load a defined resource (object)', async () => {
        const loader = new AMDLoader();
        loader.define('testResourceObject', { foo: 'bar' });
        const exports = await loader.load('testResourceObject');
        expect(exports).toEqual({ foo: 'bar' });
    });

    it('should load a defined resource with multiple exports (explicit)', async () => {
        const loader = new AMDLoader();
        const module = { resource1: { foo: 'bar' }, resource2: { baz: 'qux' } };
        const expected = Object.assign(Object.create(null), module);
        Object.defineProperty(expected, Symbol.toStringTag, { value: 'Module' });
        loader.define('testResourceObject', module, true);
        const exports = await loader.load('testResourceObject');
        expect(exports).toEqual(expected);
    });

    it('should load a defined resource with multiple exports (implicit)', async () => {
        const loader = new AMDLoader();
        const resources = { resource1: { foo: 'bar' }, resource2: { baz: 'qux' } };
        const module = Object.assign(Object.create(null), resources);
        Object.defineProperty(module, Symbol.toStringTag, { value: 'Module' });
        loader.define('testResourceObject', module);
        const exports = await loader.load('testResourceObject');
        expect(exports).toEqual(module);
    });

    it('should load a defined resource (module path)', async () => {
        const loader = new AMDLoader();
        loader.define('testResourcePath', `${samplesHost}/resource.js`);
        const exports = await loader.load('testResourcePath');
        expect(exports).toEqual({ foo: 'bar' });
    });

    it('should fail to load a defined resource if the import map fails', async () => {
        const message = "Cannot read properties of undefined (reading 'slice')";
        const loader = new AMDLoader();
        loader.define('invalid', {});
        await expect(loader.load('invalid')).rejects.toThrow(expect.objectContaining({ message }));
    });

    it('should load a resource module and return exports', async () => {
        const loader = new AMDLoader();
        const exports = await loader.load(`${samplesHost}/resource.js`);
        expect(exports).toEqual({ foo: 'bar' });
    });

    it('should not support resource "require"', async () => {
        const message =
            'AMD require not supported. (SystemJS Error#5 https://github.com/systemjs/systemjs/blob/main/docs/errors.md#5)';
        const loader = new AMDLoader();
        const exports = (await loader.load(`${samplesHost}/exports.js`)) as { require: () => void };
        expect(exports).toEqual(expect.any(Object));
        expect(exports).toHaveProperty('require');
        expect(() => exports.require()).toThrow(expect.objectContaining({ message }));
    });

    it('should support resource "module"', async () => {
        const loader = new AMDLoader();
        const exports = (await loader.load(`${samplesHost}/exports.js`)) as { module: ESM.ModuleExport };
        expect(exports).toEqual(expect.any(Object));
        expect(exports).toHaveProperty('module');
        expect(exports.module.exports).toEqual(exports);
        expect(exports.module.uri).toEqual(`${samplesHost}/exports.js`);
    });

    it('should support resource "exports"', async () => {
        const loader = new AMDLoader();
        const exports = (await loader.load(`${samplesHost}/exports.js`)) as { foo: string };
        expect(exports).toEqual(expect.any(Object));
        expect(exports).toHaveProperty('foo');
        expect(exports.foo).toEqual('bar');
    });

    it('should fail to load an invalid resource', async () => {
        const message =
            'Invalid call to AMD define() (SystemJS Error#9 https://github.com/systemjs/systemjs/blob/main/docs/errors.md#9)';
        const loader = new AMDLoader();
        await expect(loader.load(`${samplesHost}/invalid.js`)).rejects.toThrow(expect.objectContaining({ message }));
    });

    it('should fail if an unhandled exception occurs during import (invalid define call)', async () => {
        const message =
            'Invalid call to AMD define() (SystemJS Error#9 https://github.com/systemjs/systemjs/blob/main/docs/errors.md#9)';
        const evaluatorSpy = vi.spyOn(Script, 'evaluate').mockImplementation(() => {
            window.dispatchEvent(
                new ErrorEvent('error', {
                    message,
                    error: new Error(message)
                })
            );
        });
        const loader = new AMDLoader();
        await expect(loader.load(`${samplesHost}/resource.js`)).rejects.toThrow(expect.objectContaining({ message }));
        expect(evaluatorSpy).toHaveBeenCalled();
    });

    it('should fail if an unhandled exception occurs during import (error in evaluate)', async () => {
        const loader = new AMDLoader();
        await expect(loader.load(`${samplesHost}/error.js`)).rejects.toThrow(TypeError);
    });

    it('should not capture unrelated unhandled exceptions occurring during import', async () => {
        const evaluatorSpy = vi.spyOn(Script, 'evaluate').mockImplementation(() => {
            window.dispatchEvent(
                new ErrorEvent('error', {
                    message: 'Unrelated error',
                    error: new Error('Unrelated error')
                })
            );
        });
        const loader = new AMDLoader();
        try {
            (await loader.load(`${samplesHost}/exports.js`)) as { foo: string };
        } catch (error) {
            expect(error).toEqual(expect.any(Error));
        }
        expect(evaluatorSpy).toHaveBeenCalled();
    });

    it('should continue the flow after a successful import', async () => {
        const loader = new AMDLoader();
        await loader.load(`${samplesHost}/bundle.js`);
        await loader.load(`${samplesHost}/exports.js`);
        const exports = await loader.load(`${samplesHost}/resource.js`);
        expect(exports).toEqual({ foo: 'bar' });
    });

    it('should continue the flow after a failed import', async () => {
        const loader = new AMDLoader();
        await expect(loader.load(`${samplesHost}/invalid.js`)).rejects.toThrow();
        const exports = await loader.load(`${samplesHost}/resource.js`);
        expect(exports).toEqual({ foo: 'bar' });
    });

    it('should continue the flow after a failed import caused by an unhandled exception', async () => {
        const evaluatorSpy = vi.spyOn(Script, 'evaluate').mockImplementation(() => {
            window.dispatchEvent(
                new ErrorEvent('error', {
                    message: 'Unrelated error',
                    error: new Error('Unrelated error')
                })
            );
        });
        const loader = new AMDLoader();
        try {
            (await loader.load(`${samplesHost}/bundle.js`)) as { foo: string };
        } catch (error) {
            expect(error).toEqual(expect.any(Error));
        }
        evaluatorSpy.mockRestore();
        const exports = await loader.load(`${samplesHost}/resource.js`);
        expect(exports).toEqual({ foo: 'bar' });
    });

    it('should load a bundle and return the last defined module', async () => {
        const loader = new AMDLoader();
        const exports = (await loader.load(`${samplesHost}/bundle.js`)) as { compose: (msg: string) => string };
        expect(exports).toHaveProperty('compose');
        expect(exports.compose).toBeInstanceOf(Function);
        expect(exports.compose('Hello')).toBe('Hello from compose with external and resource');
    });

    it('should restore the original define function after a successful load', async () => {
        const originalDefine = globalThis.define;
        const define = vi.fn();
        globalThis.define = define;
        expect(globalThis.define).not.toBe(originalDefine);
        const loader = new AMDLoader();
        await expect(loader.load(`${samplesHost}/resource.js`)).resolves.toEqual({ foo: 'bar' });
        expect(globalThis.define).toBe(define);
        globalThis.define = originalDefine;
    });

    it('should restore the original define function after a failed load', async () => {
        const originalDefine = globalThis.define;
        const define = vi.fn();
        globalThis.define = define;
        expect(globalThis.define).not.toBe(originalDefine);
        const loader = new AMDLoader();
        await expect(loader.load(`${samplesHost}/invalid.js`)).rejects.toThrow();
        expect(globalThis.define).toBe(define);
        globalThis.define = originalDefine;
    });
});
