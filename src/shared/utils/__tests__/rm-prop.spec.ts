import { RmProp } from '@shared/utils';
import { describe, expect } from 'vitest';

describe('RmProp', () =>
{
    const obj = {
        hello: 'hola',
        world: 'mundo'
    };

    it('remove prod of object', () =>
    {
        RmProp(obj, ['hello']);

        expect(Object.keys(obj).some(p =>  p === 'hello')).toBe(false);
        expect(Object.keys(obj).length).toBe(1);
    });
});
