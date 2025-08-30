// @vitest-environment jsdom
import { AMDLoader } from 'lib/amd-loader.ts';
import { PCILoader } from 'lib/pci-loader.ts';
import { PCIRegistry } from 'lib/pci-registry.ts';
import type { PCI } from 'lib/types.d.ts';
import { samplesHost } from 'tests/setup/config.ts';
import { describe, expect, it, vi } from 'vitest';

describe('PCILoader', () => {
    const name = 'myPCI';
    const url = `${samplesHost}/pci.js`;
    const renderFailureUrl = `${samplesHost}/pci-render-failure.js`;
    const loadFailureUrl = `${samplesHost}/pci-load-failure.js`;

    it('should construct with name and url', () => {
        const loader = new PCILoader(url, name);
        expect(loader.name).toBe(name);
        expect(loader.url).toBe(url);
    });

    it('should have status initial after construction', () => {
        const loader = new PCILoader(url, name);
        expect(loader.status).toBe('initial');
    });

    it('should construct with url only', () => {
        const loader = new PCILoader(url);
        expect(loader.name).toBeUndefined();
        expect(loader.url).toBe(url);
    });

    it('should load and resolve registry getter', async () => {
        const loader = new PCILoader(url, name);
        const registry = await loader.load();
        expect(registry).toBeDefined();
        expect(typeof registry?.getInstance).toBe('function');
    });

    it('should have status loading while loading and status loaded after loaded', async () => {
        const loader = new PCILoader(url, name);
        const promise = loader.load();
        await Promise.resolve(); // let the promise start
        expect(loader.status).toBe('loading');
        await promise;
        expect(loader.status).toBe('loaded');
    });

    it('should return the same registry on subsequent loads', async () => {
        const loader = new PCILoader(url, name);
        const firstRegistryPromise = loader.load();
        const secondRegistryPromise = loader.load();
        expect(firstRegistryPromise).not.toBe(secondRegistryPromise);
        const firstRegistry = await firstRegistryPromise;
        expect(firstRegistry).toBeDefined();
        expect(typeof firstRegistry?.getInstance).toBe('function');
        const secondRegistry = await secondRegistryPromise;
        expect(firstRegistry).toBe(secondRegistry);
    });

    it('should load and register a PCI', async () => {
        const loadSpy = vi.spyOn(AMDLoader.prototype, 'load');
        const registerSpy = vi.spyOn(PCIRegistry.prototype, 'register');
        const loader = new PCILoader(url, name);
        const registry = await loader.load({ timeout: 0 });
        expect(registry).toBeDefined();
        expect(registry?.getInstance).toEqual(expect.any(Function));
        expect(registerSpy).toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalledWith(url);
    });

    it('should reject if loading times out', async () => {
        const loadSpy = vi
            .spyOn(AMDLoader.prototype, 'load')
            .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 10)));
        const loader = new PCILoader(url, name);
        await expect(loader.load({ timeout: 1 })).rejects.toThrow('Loading PCI timed out');
        expect(loadSpy).toHaveBeenCalledWith(url);
        expect(loader.status).toBe('error');
    });

    it('should reject if registration fails', async () => {
        const loadSpy = vi.spyOn(AMDLoader.prototype, 'load');
        const registerSpy = vi.spyOn(PCIRegistry.prototype, 'register').mockImplementation(() => {
            throw new Error('Registration failed');
        });
        const loader = new PCILoader(url, name);
        await expect(loader.load({ timeout: 1 })).rejects.toThrow('Registration failed');
        expect(registerSpy).toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalledWith(url);
        expect(loader.status).toBe('error');
    });

    it('should extract name from the loaded PCI', async () => {
        const loadSpy = vi.spyOn(AMDLoader.prototype, 'load');
        const registerSpy = vi.spyOn(PCIRegistry.prototype, 'register');
        const loader = new PCILoader(url);
        expect(loader.name).toBeUndefined();
        const registry = await loader.load({ timeout: 0 });
        expect(loader.name).toBe(name);
        expect(registry).toBeDefined();
        expect(registry?.getInstance).toEqual(expect.any(Function));
        expect(registerSpy).toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalledWith(url);
    });

    it('should reject if name mismatches', async () => {
        const loadSpy = vi.spyOn(AMDLoader.prototype, 'load');
        const registerSpy = vi.spyOn(PCIRegistry.prototype, 'register');
        const loader = new PCILoader(url, 'foo');
        await expect(loader.load({ timeout: 0 })).rejects.toThrow(`Expected PCI 'foo', got '${name}' instead`);
        expect(registerSpy).not.toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalledWith(url);
        expect(loader.status).toBe('error');
    });

    it('should render and resolve with interaction and state', async () => {
        const loader = new PCILoader(url, name);
        const container = document.createElement('div');
        const config = {
            onready: vi.fn() as PCI.Config['onready']
        } as PCI.Config;
        const state = {} as PCI.State;
        const [interaction, initState] = await loader.getInstance(container, config, state, {
            timeout: 0
        });
        expect(interaction).toBeDefined();
        expect(initState).toBeDefined();
        expect(config.onready).toHaveBeenCalledWith(interaction, initState);
    });

    it('should reject getInstance if loading times out', async () => {
        const loadSpy = vi
            .spyOn(AMDLoader.prototype, 'load')
            .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 10)));
        const container = document.createElement('div');
        const config = {} as PCI.Config;
        const state = {} as PCI.State;
        const loader = new PCILoader(url, name);
        await expect(loader.getInstance(container, config, state, { timeout: 1 })).rejects.toThrow(
            'Loading PCI timed out'
        );
        expect(loadSpy).toHaveBeenCalledWith(url);
        expect(loader.status).toBe('error');
    });

    it('should reject getInstance if rendering times out', async () => {
        const loadSpy = vi.spyOn(AMDLoader.prototype, 'load');
        const getInstance = PCIRegistry.prototype.getInstance;
        const getInstanceSpy = vi
            .spyOn(PCIRegistry.prototype, 'getInstance')
            .mockImplementation(function getInstanceSpy(this: PCIRegistry, ...args) {
                setTimeout(() => {
                    getInstance.apply(this, args);
                }, 10);
            });
        const container = document.createElement('div');
        const config = {} as PCI.Config;
        const state = {} as PCI.State;
        const loader = new PCILoader(url, name);
        await expect(loader.getInstance(container, config, state, { timeout: 1 })).rejects.toThrow(
            'Getting PCI instance timed out'
        );
        expect(loadSpy).toHaveBeenCalledWith(url);
        expect(getInstanceSpy).toHaveBeenCalled();
        expect(loader.status).toBe('loaded');
    });

    it('should reject getInstance if PCI fails at loading', async () => {
        const loadSpy = vi.spyOn(AMDLoader.prototype, 'load');
        const loader = new PCILoader(loadFailureUrl);
        await expect(loader.load()).rejects.toThrow('A failure occurred');
        expect(loadSpy).toHaveBeenCalledWith(loadFailureUrl);
        expect(loader.status).toBe('error');
    });

    it('should reject getInstance if PCI fails at creation', async () => {
        const loadSpy = vi.spyOn(AMDLoader.prototype, 'load');
        const registerSpy = vi.spyOn(PCIRegistry.prototype, 'register');
        const container = document.createElement('div');
        const config = {} as PCI.Config;
        const state = {} as PCI.State;
        const loader = new PCILoader(renderFailureUrl);
        await expect(loader.getInstance(container, config, state, { timeout: 1 })).rejects.toThrow(
            'A failure occurred'
        );
        expect(loadSpy).toHaveBeenCalledWith(renderFailureUrl);
        expect(registerSpy).toHaveBeenCalled();
        expect(loader.status).toBe('loaded');
    });
});
