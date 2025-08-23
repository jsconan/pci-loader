import Demo from 'demo/pages/Demo.svelte';
import NotFound from 'demo/pages/NotFound.svelte';
import { createRouter } from 'sv-router';

export const { p, navigate, isActive, route } = createRouter({
    '/': Demo,
    '*': NotFound
});
