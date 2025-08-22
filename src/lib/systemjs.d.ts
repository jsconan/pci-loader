export declare namespace ESM {
    type Exports = Record<string, unknown> | unknown;

    interface Module {
        __useDefault?: boolean;
        default?: Exports;
        [Symbol.toStringTag]?: string;
        [key: string]: unknown;
    }

    interface ModuleExport {
        exports: Exports;
        uri?: string;
    }

    interface ModuleContext {
        meta: {
            url: string;
        };
    }
}

export declare namespace AMD {
    type ResourceFactory = (...args: unknown[]) => unknown;
    type ModuleExport = ResourceFactory | ESM.Exports | ESM.ModuleExport;
    type DefineSignature = (
        nameOrDepsOrResource: string | string[] | object | ResourceFactory,
        depsOrFactory?: string[] | ResourceFactory,
        factory?: ResourceFactory
    ) => void;
    type Define = DefineSignature & { amd?: object };
}

export declare namespace SystemJS {
    type ExportSignature = (module: string | ESM.Module | ESM.Exports, exports?: ESM.Exports) => void;
    type ModuleExportSignature = (_export: ExportSignature, _context: ESM.ModuleContext) => ModuleDeclaration;
    type ModuleSetter = (module: ESM.Module) => void;
    type ModuleRegistration = [string[], ModuleExportSignature];
    type RegistrationContext = [string | null, ModuleRegistration];

    interface ModuleDeclaration {
        setters: ModuleSetter[];
        execute: () => void;
    }

    interface ImportMap {
        imports: Record<string, string>;
        scopes: Record<string, Record<string, string>>;
    }

    interface Instance {
        constructor: Constructor;
        has(name: string): boolean;
        get(name: string): object;
        set(name: string, module: object): void;
        entries(): IterableIterator<string>;
        import(name: string, parentUrl?: string, meta?: object): Promise<unknown>;
        resolve(name: string, parentUrl: string): Promise<string>;
        instantiate(url: string, firstParentUrl: string): Promise<SystemJS.ModuleRegistration | undefined>;
        register(
            nameOrDeps: string | string[],
            depsOrExports: string[] | ModuleExportSignature,
            exports?: ModuleExportSignature
        ): void;
        getRegister(): ModuleRegistration | undefined;
        addImportMap(map: ImportMap): void;
        registerRegistry: Record<string, ModuleRegistration>;
    }

    interface Constructor extends Instance {
        new (): Instance;
    }
}

export declare global {
    var define: AMD.Define;
    var System: SystemJS.Instance;
}
