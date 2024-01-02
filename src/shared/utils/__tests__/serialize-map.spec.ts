import configuration from '@config/configuration';
import { SerializerMap } from '@shared/classValidator/utils';
import {
    UserSerializerMock,
    UserSerializerMockInterface
} from '@shared/utils/__tests__/__mocks__/user.serializer.mock';
import { instanceToPlain } from 'class-transformer';
import { describe, expect } from 'vitest';

describe('SerializeMap', () =>
{
    const configSerializer =  configuration().serializer;

    describe('WithSerializerParameters', () =>
    {
        it('should return 3 objects with exposed properties', async() =>
        {
            const users = [
                { email: 'riquex@yopmail.com', firstName: 'enrique', lastName: 'Jose', _id: 1 },
                { email: 'roxnny@yopmail.com', firstName:'Roxnny', lastName: 'Alexander', _id: 2 },
                { email:'luis@yopmail.com', firstName: 'Luis', lastName: 'Fernando', _id: 3 }
            ];

            const data = instanceToPlain(
                await SerializerMap(
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

        it('should return 3 objects without showing the excluded properties', async() =>
        {
            const users = [
                { email: 'riquex@yopmail.com', firstName: 'enrique', lastName: 'Jose', _id: 1, value: 0 },
                { email: 'roxnny@yopmail.com', firstName:'Roxnny', lastName: 'Alexander', _id: 2, password:'123456' },
                { email:'luis@yopmail.com', firstName: 'Luis', lastName: 'Fernando', _id: 3, cardNumber:'123410000230' }
            ];

            const data = instanceToPlain(
                await SerializerMap(
                    users,
                    UserSerializerMock
                ) as typeof UserSerializerMock[], configSerializer) as UserSerializerMockInterface[];

            expect(data.length).toBe(3);
            expect(data.every(item =>
            {
                const keys = ['value', 'password', 'cardNumber', 'lastName', 'firstName', '_id'];
                return ! keys.every(k => Object.hasOwn(item, k));
            })).toBe(true);
            expect(data.every(item =>
            {
                return Object.keys(item).length === 4;
            })).toBe(true);
        });
    });

    describe('WithoutSerializerParameter', () =>
    {
        it('Create instances of UserSerializer without serializer parameter', async() =>
        {
            const users = [
                { email: 'riquex@yopmail.com', firstName: 'enrique', lastName: 'Jose', _id: 1, value: 0 },
                { email: 'roxnny@yopmail.com', firstName:'Roxnny', lastName: 'Alexander', _id: 2, password:'123456' },
                { email:'luis@yopmail.com', firstName: 'Luis', lastName: 'Fernando', _id: 3, cardNumber:'123410000230' }
            ];

            const data = instanceToPlain(
                await SerializerMap(
                    users
                ) as typeof UserSerializerMock[], configSerializer) as UserSerializerMockInterface[];

            expect(data.length).toBe(3);
            expect(data.every(item =>
            {
                const keys = ['value', 'password', 'cardNumber'];
                return keys.some(k => Object.hasOwn(item, k));
            })).toBe(true);
            expect(data.every(item =>
            {
                return Object.keys(item).length === 4;
            })).toBe(true);
            expect(data.every(item =>
            {
                const keys = ['_id', 'defaultValue'];
                return ! keys.every(k => Object.hasOwn(item, k));
            }));
        });
    });
});
