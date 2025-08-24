import { routes } from 'demo/config.ts';
import Changelog from 'demo/pages/Changelog.svelte';
import Demo from 'demo/pages/Demo.svelte';
import License from 'demo/pages/License.svelte';
import NotFound from 'demo/pages/NotFound.svelte';
import Overview from 'demo/pages/Overview.svelte';
import type { router } from 'demo/types.d.ts';
import { createRouter } from 'sv-router';

const pageComponents: router.RouteMap = {
    overview: Overview,
    demo: Demo,
    changelog: Changelog,
    license: License
};
const routeMap = routes.reduce((acc: router.RouteMap, route: router.Route) => {
    acc[route.url.replace(/\/$/, '') || '/'] = pageComponents[route.page] || NotFound;
    return acc;
}, {} as router.RouteMap);

export const { p, navigate, isActive, route }: router.RouterExports = createRouter({
    ...routeMap,
    '*': NotFound,
    hooks: {
        async afterLoad() {
            // Manage redirection from external 404 page (public/404.html)
            const path = window.localStorage.getItem('redirectPath');
            window.localStorage.removeItem('redirectPath');
            if (path) {
                navigate(`/${path}`.replace(/\/+/g, '/'));
            }
        }
    }
}) as unknown as router.RouterExports;
