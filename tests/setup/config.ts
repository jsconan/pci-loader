import fs from 'fs';
import { basename, resolve } from 'path';

/**
 * The host URL for the files server.
 */
export const samplesHost: string = 'http://files.test';

/**
 * Path to the sample files.
 */
export const samplesPath: string = resolve(__dirname, '../../public/samples');

/**
 * An object mapping sample names to their file paths.
 */
export const samples = fs.readdirSync(samplesPath).reduce<Record<string, string>>((acc, file) => {
    acc[basename(file, '.js')] = resolve(samplesPath, file);
    return acc;
}, {});
