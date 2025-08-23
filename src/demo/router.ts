import Changelog from 'demo/pages/Changelog.svelte';
import Demo from 'demo/pages/Demo.svelte';
import License from 'demo/pages/License.svelte';
import NotFound from 'demo/pages/NotFound.svelte';
import Overview from 'demo/pages/Overview.svelte';
import { createRouter } from 'sv-router';

export const { p, navigate, isActive, route } = createRouter({
    '/': Overview,
    '/demo': Demo,
    '/changelog.md': Changelog,
    '/license': License,
    '*': NotFound
});
