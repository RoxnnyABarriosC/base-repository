import { Parse } from '@shared/utils';
import { describe, expect } from 'vitest';

describe('Parse', () =>
{
    describe('parse string to number', () =>
    {
        it('integer',  () =>
        {
            const unparsedValue = '500000';
            const parsedValue = Parse<number>(unparsedValue);

            expect(parsedValue).toBeTypeOf('number');
            expect(parsedValue).toEqual(500_000);
        });

        it('float',  () =>
        {
            const unparsedValue = '500.01';
            const parsedValue = Parse<number>(unparsedValue);

            expect(parsedValue).toBeTypeOf('number');
            expect(parsedValue).toEqual(500.01);
        });
    });

    describe('parse string to boolean', () =>
    {
        it('true',  () =>
        {
            const unparsedValue = 'true';
            const parsedValue = Parse<boolean>(unparsedValue);

            expect(parsedValue).toBeTypeOf('boolean');
            expect(parsedValue).toEqual(true);
        });

        it('false',  () =>
        {
            const unparsedValue = 'false';
            const parsedValue = Parse<boolean>(unparsedValue);

            expect(parsedValue).toBeTypeOf('boolean');
            expect(parsedValue).toEqual(false);
        });
    });

    describe('parse string to date', () =>
    {
        it('DD-MM-YYYY',  () =>
        {
            const unparsedValue = '01-27-1998';
            const parsedValue = Parse<Date>(unparsedValue);

            expect(parsedValue).toBeInstanceOf(Date);
        });

        it('YYY-MM-DD ',  () =>
        {
            const unparsedValue = '1998-01-27';
            const parsedValue = Parse<Date>(unparsedValue);

            expect(parsedValue).toBeInstanceOf(Date);
        });

        it('DD/MM/YYYY',  () =>
        {
            const unparsedValue = '01/27/1998';
            const parsedValue = Parse<Date>(unparsedValue);

            expect(parsedValue).toBeInstanceOf(Date);
        });

        it('YYY/MM/DD ',  () =>
        {
            const unparsedValue = '1998/01/27';
            const parsedValue = Parse<Date>(unparsedValue);

            expect(parsedValue).toBeInstanceOf(Date);
        });
    });

    describe('parse string to array', () =>
    {
        describe('with values', () =>
        {
            it('number',  () =>
            {
                const unparsedValue = '[1]';
                const parsedValue = Parse<number[]>(unparsedValue);

                expect(parsedValue).toBeInstanceOf(Array);
                expect(parsedValue.length).toBe(1);
                expect(parsedValue[0]).toBeTypeOf('number');
            });

            it('string',  () =>
            {
                const unparsedValue = '["string"]';
                const parsedValue = Parse<string[]>(unparsedValue);

                expect(parsedValue).toBeInstanceOf(Array);
                expect(parsedValue.length).toBe(1);
                expect(parsedValue[0]).toBeTypeOf('string');
            });

            it('array',  () =>
            {
                const unparsedValue = '[[1]]';
                const parsedValue = Parse<[[number]]>(unparsedValue);

                expect(parsedValue).toBeInstanceOf(Array);
                expect(parsedValue.length).toBe(1);
                expect(parsedValue[0]).toBeInstanceOf(Array);
            });

            it('object',  () =>
            {
                const unparsedValue = '[{"meta": true}]';
                const parsedValue = Parse<[{meta: true}]>(unparsedValue);

                expect(parsedValue).toBeInstanceOf(Array);
                expect(parsedValue.length).toBe(1);
                expect(parsedValue[0]).toBeInstanceOf(Object);
                expect(parsedValue[0].meta).toBe(true);
            });
        });
    });

    it('parse string to string', () =>
    {
        const unparsedValue = 'hello world 2023, [], true, {"meta": true }';
        const parsedValue = Parse<string>(unparsedValue);

        expect(parsedValue).toBeTypeOf('string');
        expect(parsedValue).toEqual(unparsedValue);
    });
});
