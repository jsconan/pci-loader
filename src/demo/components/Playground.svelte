<script lang="ts">
    import Button from 'demo/components/Button.svelte';
    import Code from 'demo/components/Code.svelte';
    import CodeFile from 'demo/components/CodeFile.svelte';
    import Dropdown from 'demo/components/Dropdown.svelte';
    import Tab from 'demo/components/Tab.svelte';
    import TabBar from 'demo/components/TabBar.svelte';
    import type { components } from 'demo/types.d.ts';
    import {
        codeDefineAMDDependencies,
        codeDefineAMDModule,
        codeImportAMDLoader,
        codeLoadAMDModule
    } from 'demo/utils/code-for-amd.ts';
    import { codeImportPCILoader, codeLoadPCI, codeLoadPCIThenRender, codeRenderPCI } from 'demo/utils/code-for-pci.ts';
    import { serializeCode } from 'demo/utils/utils.ts';
    import { AMDLoader, PCILoader, type PCI } from 'src/main';
    import { onDestroy, onMount } from 'svelte';

    interface Props {
        samples?: Record<string, components.Sample>;
    }

    const defaultTab = 'result';
    const tabs = [
        {
            key: 'result',
            label: 'Result'
        },
        {
            key: 'code',
            label: 'Code'
        },

        {
            key: 'source',
            label: 'AMD files'
        }
    ];

    let { samples = {} }: Props = $props();

    let selectedSample: string = $state('pci');
    let samplesList: components.DropdownItem[] = Object.keys(samples).map(key => ({
        value: key,
        label: samples[key].label
    }));

    let amdLoader: AMDLoader | null = null;
    let pciLoader: PCILoader | null = null;
    let pciInstance: PCI.Interaction | null = null;

    let states: Record<string, boolean> = $state({});
    let files: string[] = $state([]);
    let code: string = $state('');
    let output: string = $state('');
    let outputLabel: string = $state('');
    let error: string = $state('');
    let activeTab: string = $state(defaultTab);
    let container: HTMLElement | null = $state(null);

    function reset() {
        destroyPCI();
        states = {};
        pciLoader = null;
        amdLoader = null;
        output = '';
        error = '';

        if (samples[selectedSample].type === 'pci') {
            code = codeImportPCILoader(samples[selectedSample].url);
            files = getPCIFiles();
        } else {
            code = codeImportAMDLoader() + codeDefineAMDDependencies(samples[selectedSample].dependencies);
            files = getAMDFiles();
        }
    }

    function load() {
        if (samples[selectedSample].type === 'pci') {
            loadPCI();
        } else {
            loadAMD();
        }
    }

    function getAMDFiles(): string[] {
        const deps = [];
        for (const resource of samples[selectedSample].dependencies || []) {
            deps.push(resource.url);
        }
        deps.push(samples[selectedSample].url);

        return deps;
    }

    function getAMDLoader(): AMDLoader {
        const loader = new AMDLoader();
        let amdCode = codeImportAMDLoader();

        for (const resource of samples[selectedSample].dependencies || []) {
            loader.define(resource.name, resource.url);
            amdCode += codeDefineAMDModule(resource.name, resource.url);
        }

        amdCode += codeLoadAMDModule(samples[selectedSample].url);
        code = amdCode;

        return loader;
    }

    function loadAMD() {
        states.loading = true;
        amdLoader = getAMDLoader();
        amdLoader
            .load(samples[selectedSample].url)
            .then((resource: unknown) => {
                states.loaded = true;
                outputLabel = `Loaded AMD resource`;
                output = serializeCode(resource);
            })
            .catch(err => {
                error = `Error loading AMD: ${err.message}`;
            });
    }

    function getPCIFiles(): string[] {
        return [samples[selectedSample].url];
    }

    function getPCILoader(): PCILoader {
        return new PCILoader(samples[selectedSample].url);
    }

    function loadPCI() {
        states.loading = true;
        code = codeImportPCILoader(samples[selectedSample].url) + codeLoadPCI();

        pciLoader = getPCILoader();
        pciLoader
            .load()
            .then(() => {
                states.loaded = true;
            })
            .catch(err => {
                error = `Error loading PCI: ${err.message}`;
            });
    }

    function renderPCI() {
        states.loading = true;

        if (!pciLoader) {
            pciLoader = getPCILoader();
            code = codeImportPCILoader(samples[selectedSample].url) + codeRenderPCI();
        } else {
            code = codeImportPCILoader(samples[selectedSample].url) + codeLoadPCIThenRender();
        }

        pciLoader
            .getInstance(container as Element, {} as PCI.Config, {})
            .then(([interaction, _state]) => {
                pciInstance = interaction;
                states.loaded = true;
                states.rendered = true;
            })
            .catch(err => {
                error = `Error loading PCI: ${err.message}`;
            });
    }

    function destroyPCI() {
        if (pciInstance) {
            pciInstance.oncompleted();
            pciInstance = null;
        }
        states.rendered = false;
        output = '';
    }

    function showPCIResponse() {
        if (pciInstance) {
            outputLabel = `PCI's response`;
            output = serializeCode(pciInstance.getResponse());
        }
    }

    function showPCIState() {
        if (pciInstance) {
            outputLabel = `PCI's state`;
            output = serializeCode(pciInstance.getState());
        }
    }

    onMount(() => {
        reset();
    });

    onDestroy(() => {
        destroyPCI();
    });
</script>

<article>
    <header>
        <menu>
            <Dropdown items={samplesList} bind:value={selectedSample} disabled={false} onselect={reset} />
        </menu>
        <menu>
            <Button onclick={load} disabled={states.loading}>Load</Button>
            {#if samples[selectedSample].type == 'pci'}
                <Button onclick={renderPCI} disabled={states.rendered}>Render</Button>
                <Button onclick={destroyPCI} disabled={!states.rendered}>Destroy</Button>
            {/if}
            <Button onclick={reset} disabled={!states.loading}>Reset</Button>
        </menu>
    </header>

    <TabBar {tabs} bind:active={activeTab}>
        <Tab name="result" active={activeTab}>
            <div class="result">
                {#if samples[selectedSample].type == 'pci'}
                    <menu>
                        <Button onclick={showPCIResponse} disabled={!states.rendered}>Get PCI's response</Button>
                        <Button onclick={showPCIState} disabled={!states.rendered}>Get PCI's state</Button>
                    </menu>
                {/if}
                {#if error}
                    <div class="error">
                        <pre>{error}</pre>
                    </div>
                {/if}
                <div class="output">
                    {#if states.rendered}
                        <span>PCI Instance</span>
                    {/if}
                    <div class={states.rendered ? 'pci-instance' : ''} bind:this={container}></div>
                    {#if output}
                        <span>{outputLabel || 'Output'}</span>
                        <Code code={output} />
                    {/if}
                </div>
            </div>
        </Tab>
        <Tab name="code" active={activeTab}>
            <div class="code">
                {#if code}
                    <Code {code} />
                {/if}
            </div>
        </Tab>
        <Tab name="source" active={activeTab}>
            <div class="source">
                {#each files as url (url)}
                    <CodeFile {url} />
                {/each}
            </div>
        </Tab>
    </TabBar>
</article>

<style>
    article {
        display: flex;
        flex-direction: column;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 0;
        margin-bottom: 1rem;
    }
    menu {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
        padding: 0;
    }

    .error {
        color: var(--error-color);
        background-color: var(--error-background);
        border: 1px solid var(--error-border);
        border-radius: var(--button-border-radius, 8px);
        margin-bottom: 1rem;
        padding: 1rem;
        margin: 1rem 0;
    }

    .code {
        margin: 1rem 0;
    }

    .output {
        margin: 1rem 0;
    }
    .output span {
        color: var(--text-color-muted);
        font-weight: 500;
        line-height: 2rem;
    }

    .pci-instance {
        position: relative;
        background-color: var(--pci-background);
        border: 1px solid var(--pci-border-color);
        padding: 2rem;
        margin-bottom: 1rem;
    }
</style>
