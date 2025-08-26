// @vitest-environment jsdom
import { PCIRegistry } from 'lib/pci-registry.ts';
import type { PCI } from 'lib/types.d.ts';
import { describe, expect, it, vi } from 'vitest';

const createMockInteraction = (typeIdentifier = 'mockPCI') => ({
    typeIdentifier,
    getInstance: (_container: Element, config: PCI.Config, state: PCI.State) => {
        if (typeof config.onready === 'function') {
            config.onready(
                {
                    getResponse(): PCI.Response {
                        return { base: null };
                    },
                    getState(): PCI.State {
                        return {};
                    },
                    oncompleted() {}
                },
                state
            );
        }
    }
});

describe('PCIRegistry', () => {
    it('should register a valid interaction', () => {
        const registry = new PCIRegistry();
        const interaction = createMockInteraction();
        expect(() => registry.register(interaction)).not.toThrow();
    });

    it('should throw TypeError for invalid interaction', () => {
        const registry = new PCIRegistry();
        // Missing typeIdentifier
        // @ts-expect-error Check missing typeIdentifier
        expect(() => registry.register({ getInstance: () => {} })).toThrow(TypeError);
        // Missing getInstance
        // @ts-expect-error Check missing getInstance
        expect(() => registry.register({ typeIdentifier: 'badPCI' })).toThrow(TypeError);
    });

    it('should retrieve and invoke a registered interaction', () => {
        const registry = new PCIRegistry();
        const interaction = createMockInteraction('testPCI');
        registry.register(interaction);
        const container = document.createElement('div');
        const config = {
            onready: vi.fn() as PCI.Config['onready']
        } as PCI.Config;
        const state = {} as PCI.State;
        registry.getInstance('testPCI', container, config, state);
        expect(config.onready).toBeCalled();
    });

    it('should throw Error if interaction is not registered', () => {
        const registry = new PCIRegistry();
        const container = document.createElement('div');
        const config = {
            onready: vi.fn() as PCI.Config['onready']
        } as PCI.Config;
        const state = {} as PCI.State;
        expect(() => registry.getInstance('unknownPCI', container, config, state)).toThrow(Error);
        expect(config.onready).not.toBeCalled();
    });
});
