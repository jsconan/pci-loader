import { timedPromise, TimeoutError } from 'lib/timeout.ts';
import { describe, expect, it } from 'vitest';

describe('timedPromise', () => {
    it('should resolve if time is not over', async () => {
        const result = await timedPromise(Promise.resolve('Success'), { timeout: 1000 });
        expect(result).toBe('Success');
    });

    it('should reject if time is over', async () => {
        await expect(timedPromise(new Promise((_, reject) => setTimeout(reject, 20)), { timeout: 10 })).rejects.toThrow(
            TimeoutError
        );
    });
});
