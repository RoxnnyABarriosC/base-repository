import configuration from '@config/configuration';
import { SerializerMap } from '@shared/utils';
import { UserSerializerMock } from '@shared/utils/__tests__/__mocks__/user.serializer.mock';
import { instanceToPlain } from 'class-transformer';
import { describe, expect } from 'vitest';

describe('SerializeMap', () =>
{
    const configSerializer =  configuration().serializer;

    describe('WithSerializerParameters', () =>
    {
        it('Create instances of UserSerializer', async() =>
        {
            const users = [
                { email: 'riquex@yopmail.com', firstName: 'enrique', lastName: 'Jose', _id: 1, value: 0 },
                { email: 'roxnny@yopmail.com', firstName:'Roxnny', lastName: 'Alexander', _id: 2 }
            ];

            const data = instanceToPlain(
                await SerializerMap(
                    users,
                    UserSerializerMock
                ) as typeof UserSerializerMock[], configSerializer);


            expect(data.length).toBe(2);
            // expect(data.every(item => item instanceof UserSerializerMock)).toBe(true);
            // expect(data.every(item =>
            // {
            //     return Object.keys(item).length === 3;
            // })).toBe(true);
        });
    });

    // describe('WithoutSerializerParameter', () =>
    // {
    //     it('Create instances of UserSerializer without serializer parameter', async() =>
    //     {
    //         const users = [
    //             { email:'riquex@yopmail.com', name:'enrique', id: 1 },
    //             { email:'roxnny@yopmail.com', name:'Roxnny', id: 2 }
    //         ];
    //
    //         const res: any = await SerializerMap(users);
    //         expect(res.length).toBe(2);
    //         expect(res.every(item => ! (item instanceof UserSerializer))).toBe(true);
    //         expect(res.every(item =>
    //         {
    //             return Object.keys(item).length === 3;
    //         })).toBe(true);
    //     });
    // });
});
