/**
 * Options for the promise timeout.
 */
export type PromiseTimeoutOptions = {
    timeout?: number;
    message?: string;
};

/**
 * An error that indicates a timeout has occurred.
 */
export class TimeoutError extends Error {}

/**
 * Manage a promise with a timeout.
 * A race condition is created between the original promise and a timeout promise.
 * @param promise - The promise to manage.
 * @param options - The timeout options.
 * @param options.timeout - The maximum time to wait for the promise to resolve (default is 30000 ms).
 * @param options.message - The error message to use if the promise times out (default is 'Timeout!').
 * @returns A promise that either resolves or rejects based on the original promise or the timeout.
 */
export function timedPromise<T>(
    promise: Promise<T>,
    { timeout = 30000, message = 'Timeout!' }: PromiseTimeoutOptions = {}
): Promise<T> {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new TimeoutError(message));
            }, timeout);
        }) as Promise<never>
    ]);
}
