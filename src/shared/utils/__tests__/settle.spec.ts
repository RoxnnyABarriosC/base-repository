import { Settle } from '@shared/utils';
import { describe, expect } from 'vitest';

describe('Settle', () =>
{
    const createPromise = (msg: string, time = 2000, forceError = ''): Promise<string> =>
    {
        return new Promise((resolve, reject) =>
        {
            setTimeout(() =>
            {
                if (forceError === 'Error')
                {
                    reject(msg);
                }
                resolve(msg);
            }, time);
        });
    };

    describe('Success', () =>
    {
        it('Promise success with the same time', async() =>
        {
            const messages = ['hello world', 'programing', 'i love vitest'];
            const arrPromises: Promise<string>[] = messages.map(item =>
            {
                return createPromise(item);
            });
            const arrResultPromises = await Settle(arrPromises);

            expect(arrResultPromises.length).toBe(3);
            expect(
                arrResultPromises.every((msg: any) => typeof msg === 'string')
            ).toBe(true);
            expect(arrResultPromises.toString()).toBe(messages.toString());
        });

        it('Promises success with different times', async() =>
        {
            const messages = ['hello world', 'programing', 'i love vitest'];
            const arrPromises: Promise<string>[] = messages.map(item =>
            {
                const generateTime = Math.floor(Math.random() * 1000);
                return createPromise(item, generateTime);
            });
            const arrResultPromises = await Settle(arrPromises);

            expect(arrResultPromises.length).toBe(3);
            expect(arrResultPromises.every(msg => typeof msg === 'string')).toBe(true);
            expect(arrResultPromises.toString()).toBe(messages.toString());
        });
    });

    describe('Error', () =>
    {
        it('Promises reject', async() =>
        {
            try
            {
                const messages = ['Success', 'Error', 'Success'];
                const arrPromises: Promise<string>[] = messages.map(item =>
                {
                    const generateTime = Math.floor(Math.random() * 1000);
                    return createPromise(item, generateTime, item);
                });
                const arrResultPromises = await Settle(arrPromises);
            }
            catch (err: any)
            {
                expect(err).toBe('Error');
            }
        });
    });
});
