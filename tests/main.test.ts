import { dummy } from 'lib/dummy.ts';
import { describe, expect, it } from 'vitest';

describe('main', () => {
    it('dummy test', async () => {
        expect(dummy()).toBe('dummy');
    });
});
