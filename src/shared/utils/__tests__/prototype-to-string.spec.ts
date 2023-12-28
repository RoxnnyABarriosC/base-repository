import { PrototypeToString, StringPrototypes } from '@shared/utils';
import { describe, expect } from 'vitest';

describe('PrototypeToString', () =>
{
    it('should to be return number prototype', async() =>
    {
        const getPrototype = PrototypeToString(1);
        expect(getPrototype).toBe(StringPrototypes.NUMBER);
    });

    it('should to be return string prototype', async() =>
    {
        const getPrototype = PrototypeToString('Hola mundo');
        expect(getPrototype).toBe(StringPrototypes.STRING);
    });

    it('should to be return array prototype', async() =>
    {
        const getPrototype = PrototypeToString([1, 2, 3]);
        expect(getPrototype).toBe(StringPrototypes.ARRAY);
    });

    it('should to be return object prototype', async() =>
    {
        const getPrototype = PrototypeToString({ message:'hola mundo' });
        expect(getPrototype).toBe(StringPrototypes.OBJECT);
    });

    it('should to be return boolean prototype', async() =>
    {
        const getPrototype = PrototypeToString(false);
        expect(getPrototype).toBe(StringPrototypes.BOOLEAN);
    });

    it('should to be return function prototype', async() =>
    {
        const getPrototype = PrototypeToString(() => null);
        expect(getPrototype).toBe(StringPrototypes.FUNCTION);
    });

    it('should to be return date prototype', async() =>
    {
        const getPrototype = PrototypeToString(new Date());
        expect(getPrototype).toBe(StringPrototypes.DATE);
    });

    it('should to be return null prototype', async() =>
    {
        const getPrototype = PrototypeToString(null);
        expect(getPrototype).toBe(StringPrototypes.NULL);
    });

    it('should to be return undefined prototype', async() =>
    {
        const getPrototype = PrototypeToString(undefined);
        expect(getPrototype).toBe(StringPrototypes.UNDEFINED);
    });

    it('should to be return a boolean', async() =>
    {
        const getPrototype = PrototypeToString({ message:'hola mundo' }, StringPrototypes.OBJECT);
        expect(getPrototype).toBe(true);
        expect(getPrototype).toBeTypeOf('boolean');
    });
});
