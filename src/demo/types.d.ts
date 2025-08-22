declare namespace components {
    export type Sample = {
        type: 'pci' | 'amd';
        url: string;
        description: string;
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
