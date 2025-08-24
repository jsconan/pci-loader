import type { components } from 'demo/types.d.ts';

export function codeImportAMDLoader(): string {
    return `// Import the AMDLoader from the 'pci-loader' package
import { AMDLoader } from 'pci-loader';

// Create a new instance of the AMDLoader
const amdLoader = new AMDLoader();
`;
}

export function codeDefineAMDModule(name: string, url: string): string {
    return `
// Map the module '${name}' to its URL
amdLoader.define('${name}', '${url}');
`;
}

export function codeDefineAMDDependencies(deps?: components.Dependency[]): string {
    let code = '';

    for (const dep of deps || []) {
        code += codeDefineAMDModule(dep.name, dep.url);
    }
    return code;
}

export function codeLoadAMDModule(url: string): string {
    return `
// Load the AMD module from the specified URL
amdLoader
    .load('${url}')
    .then(resource => {
        console.log('AMD loaded successfully');

        // Do something with the resource
        // ...
    })
    .catch(err => {
        console.error('Error loading AMD:', err);
    });
`;
}
