import configuration from '@config/configuration';
import { Serializer } from '@shared/classValidator/utils';
import {
    UserSerializerMock,
    UserSerializerMockInterface
} from '@shared/utils/__tests__/__mocks__/user.serializer.mock';
import { instanceToPlain } from 'class-transformer';
import { describe, expect, it } from 'vitest';

describe('Serializer', () =>
{
    const configSerializer =  configuration().serializer;

    describe('ValidData', () =>
    {
        it('Without serializer parameter', async() =>
        {
            const user = { email: 'riquex@yopmail.com', firstName: 'enrique', lastName: 'Jose', _id: 1 };
            const data = instanceToPlain(await Serializer(user) as typeof UserSerializerMock, configSerializer) as UserSerializerMockInterface;
            const keys = ['id', 'defaultValue', 'fullName'];
            expect(keys.every(k => !Object.hasOwn(data, k))).toBe(true);
            expect(Object.keys(data).length).toBe(3);
        });

        it('With serializer parameter', async() =>
        {
            const user = { email: 'riquex@yopmail.com', firstName: 'enrique', lastName: 'Jose', _id: 1 };
            const data = instanceToPlain(await Serializer(user, UserSerializerMock) as typeof UserSerializerMock, configSerializer) as UserSerializerMockInterface;
            const keys = ['id', 'defaultValue', 'fullName'];
            expect(keys.every(k => Object.hasOwn(data, k))).toBe(true);
            expect(Object.keys(data).length).toBe(4);
        });

        it('With serializer parameter and data array', async() =>
        {
            const users = [
                { email: 'riquex@yopmail.com', firstName: 'enrique', lastName: 'Jose', _id: 1 },
                { email: 'roxnny@yopmail.com', firstName:'Roxnny', lastName: 'Alexander', _id: 2 },
                { email:'luis@yopmail.com', firstName: 'Luis', lastName: 'Fernando', _id: 3 }
            ];

            const data = instanceToPlain(
                await Serializer(
                    users,
                    UserSerializerMock
                ) as typeof UserSerializerMock[], configSerializer) as UserSerializerMockInterface[];

            expect(data.length).toBe(3);
            expect(data.every(item =>
            {
                return !!item.id && !!item.fullName && !!item.defaultValue;
            })).toBe(true);
            expect(data.every(item =>
            {
                return Object.keys(item).length === 4;
            })).toBe(true);
        });
    });

    describe('Invalid data', () =>
    {
        it('Should to be return data null', async() =>
        {
            const data = instanceToPlain(
                await Serializer(
                    null,
                    UserSerializerMock
                ) as typeof UserSerializerMock[], configSerializer);
            expect(data).toBe(null);
        });

        it('Should to be return data undefined', async() =>
        {
            const data = instanceToPlain(
                await Serializer(
                    null,
                    UserSerializerMock,
                    false
                ) as typeof UserSerializerMock[], configSerializer);
            expect(data).toBe(undefined);
        });
    });
});
