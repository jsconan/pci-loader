<script lang="ts">
    import { prettify } from 'demo/utils/utils.ts';
    import { Highlight, LineNumbers } from 'svelte-highlight';
    import language from 'svelte-highlight/languages/javascript';

    let { code }: { code: string | undefined } = $props();

    let formattedCode: string | undefined = $derived(code);

    (async () => {
        formattedCode = await prettify(code || '');
    })();

    const timeoutCopy = 1000;
    let timerCopy: NodeJS.Timeout | undefined;

    const iconCopy = '📋';
    const iconCopied = '✅';
    let currentIcon = $state(iconCopy);

    const titleCopy = 'Copy to clipboard';
    const titleCopied = 'Copied!';
    let copyTitle: string = $state(titleCopy);

    function copyToClipboard() {
        if (formattedCode && !timerCopy) {
            navigator.clipboard.writeText(formattedCode);

            currentIcon = iconCopied;
            copyTitle = titleCopied;
            if (timerCopy) {
                clearTimeout(timerCopy);
            }
            timerCopy = setTimeout(() => {
                currentIcon = iconCopy;
                copyTitle = titleCopy;
                timerCopy = undefined;
            }, timeoutCopy);
        }
    }
</script>

<div>
    <button type="button" onclick={copyToClipboard} title={copyTitle} aria-label={copyTitle}>{currentIcon}</button>
    <Highlight {language} code={formattedCode} let:highlighted>
        <LineNumbers {highlighted} />
    </Highlight>
</div>

<style>
    button {
        appearance: none;
        position: absolute;
        top: -10000px;
        right: 0;
        z-index: 10;
        opacity: 0.5;
        padding: 0.6em 1.2em;
        line-height: 1.1;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        outline: none;
        border: 1px solid var(--button-border-color);
        background-color: var(--button-background);
        color: var(--button-text);
        cursor: pointer;
        transition: border-color 0.25s;
    }
    button:hover {
        opacity: 1;
        border-color: var(--button-border-hover);
        background-color: var(--button-background-hover);
    }
    button:focus,
    button:focus-visible {
        top: 0;
    }
    button:focus::after,
    button:focus-visible::after {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border: 2px solid var(--button-focus);
    }

    div {
        position: relative;
    }
    div:hover button {
        top: 0;
    }
</style>
