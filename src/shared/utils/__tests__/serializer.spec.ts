import { BaseSerializer } from '@shared/abstractClass';
import { Serializer } from '@shared/utils';
import { describe, expect, it } from 'vitest';

describe('Serializer', () =>
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

    describe('ValidData', () =>
    {
        it('Without serializer parameter', async() =>
        {
            const createUser = new UserSerializer(1, 'Enrique Urdaneta', 'riquex@yopmail.com');
            const res = await Serializer(createUser);
            expect(res instanceof UserSerializer).toBe(true);
            expect(Object.keys(res).length).toBe(3);
        });

        it('With serializer parameter', async() =>
        {
            const createUser = { id: 1, name: 'Enrique Urdaneta', email:'riquex@yopmail.com' };
            const res = await Serializer(createUser, UserSerializer);
            expect(res instanceof UserSerializer).toBe(true);
            expect(Object.keys(res).length).toBe(3);
        });

        it('With serializer parameter and data array', async() =>
        {
            const createUsers = [
                { id: 1, name: 'Enrique Urdaneta', email:'riquex@yopmail.com' },
                { id: 1, name: 'Luis fernando', email:'luis@yopmail.com' }
            ];
            const res: UserSerializer[] | any  = await Serializer(createUsers, UserSerializer);
            expect(res.length).toBe(2);
            expect(res.every(item => item instanceof UserSerializer)).toBe(true);
            expect(res.every(item =>
            {
                return Object.keys(item).length === 3;
            })).toBe(true);
        });
    });

    describe('Invalid data', () =>
    {
        it('Should to be return data null', async() =>
        {
            const res = await Serializer(null, UserSerializer);
            expect(res).toBe(null);
        });

        it('Should to be return data undefined', async() =>
        {
            const res = await Serializer(null, UserSerializer, false);
            expect(res).toBe(undefined);
        });
    });
});
