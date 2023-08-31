import { megabytesToBytes } from '@shared/utils';
import { describe, expect } from 'vitest';

describe('MegabytesToBytes', () =>
{
    it('Transform megabytes to bytes', async() =>
    {
        const megabytes = 2;
        const bytes = 1000000;
        const transformMegabytesToBytes = megabytesToBytes(2);

        expect(transformMegabytesToBytes).toBe((megabytes * bytes));
    });
});
