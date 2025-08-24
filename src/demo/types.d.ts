export declare namespace components {
    type SampleType = 'pci' | 'amd';

    export type Sample = {
        type: SampleType;
        url: string;
        label: string;
        dependencies?: Dependency[];
    };

    export type Dependency = {
        name: string;
        url: string;
    };

    export type DropdownItem = {
        value: string;
        label: string;
    };

    export type Tab = {
        key: string;
        label: string;
    };
}

export declare namespace router {
    export type Route = {
        url: string;
        page: string;
    };

    export type RouteEntry = {
        label: string;
        url: string;
        params?: Record<string, unknown>;
    };

    export type RouteMap = Record<string, Component>;

    export type Navigate = (url: string, params?: Record<string, unknown>) => string;
    export type isActive = (url: string) => boolean;
    export type RouterExports = {
        p: Navigate;
        navigate: Navigate;
        isActive: isActive;
        route: {
            params: AllParams<T>;
            getParams<U extends Path<T>>(pathname: U): Record<ExtractParams<U>, string>;
            pathname: (Path<T, true> & {}) | (string & {});
            search: string;
            state: unknown;
            hash: string;
            meta: RouteMeta;
        };
    };
}
