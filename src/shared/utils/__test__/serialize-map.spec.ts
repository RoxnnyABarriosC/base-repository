import { BaseSerializer } from '@shared/abstractClass';
import { SerializerMap } from '@shared/utils';
import { describe, expect } from 'vitest';
describe('SerializeMap', () =>
{
    class UserSerializer extends BaseSerializer
    {
        id: number;
        name: string;
        email: string;

        constructor(id: number, name: string, email: string)
        {
            super();
            this.email = email;
            this.name = name;
            this.id = id;
        }
    }

    describe('WithSerializerParameters', () =>
    {
        it('Create instances of UserSerializer', async() =>
        {
            const users = [
                { email:'riquex@yopmail.com', name:'enrique', id: 1 },
                { email:'roxnny@yopmail.com', name:'Roxnny', id: 2 }
            ];

            const res: any = await SerializerMap(users, UserSerializer);
            expect(res.length).toBe(2);
            expect(res.every(item => item instanceof UserSerializer)).toBe(true);
            expect(res.every(item =>
            {
                return Object.keys(item).length === 3;
            })).toBe(true);
        });
    });

    describe('WithoutSerializerParameter', () =>
    {
        it('Create instances of UserSerializer without serializer parameter', async() =>
        {
            const users = [
                { email:'riquex@yopmail.com', name:'enrique', id: 1 },
                { email:'roxnny@yopmail.com', name:'Roxnny', id: 2 }
            ];

            const res: any = await SerializerMap(users);
            expect(res.length).toBe(2);
            expect(res.every(item => ! (item instanceof UserSerializer))).toBe(true);
            expect(res.every(item =>
            {
                return Object.keys(item).length === 3;
            })).toBe(true);
        });
    });
});
