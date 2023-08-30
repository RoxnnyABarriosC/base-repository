import { GetMilliseconds } from '@shared/utils';
import { describe, expect, it } from 'vitest';

describe('GetMilliseconds', () =>
{
    it('Transform seconds to milliseconds', async() =>
    {
        const transformSecondsToMilliseconds = GetMilliseconds('60s');
        const result: number = 60 * 1000;
        expect(transformSecondsToMilliseconds).toBe(result);
    });

    it('Transform minutes to milliseconds', async() =>
    {
        const transformSecondsToMilliseconds = GetMilliseconds('60m');
        const result: number = 60 * 60000;
        expect(transformSecondsToMilliseconds).toBe(result);
    });

    it('Transform hours to milliseconds', async() =>
    {
        const transformSecondsToMilliseconds = GetMilliseconds('2h');
        const result: number = 2 * 3600000;
        expect(transformSecondsToMilliseconds).toBe(result);
    });

    it('Transform days to milliseconds', async() =>
    {
        const transformSecondsToMilliseconds = GetMilliseconds('2d');
        const result: number = 2 * 86400000;
        expect(transformSecondsToMilliseconds).toBe(result);
    });

    it('Is a number ?', async() =>
    {
        const transformSecondsToMilliseconds = GetMilliseconds('2d');
        const result: number = 2 * 86400000;
        expect(transformSecondsToMilliseconds).toBe(result);
        expect(transformSecondsToMilliseconds).toBeTypeOf('number');
    });
});
