import { ViewColumn, ViewEntity } from 'typeorm';

const expression = `
SELECT i._id, 
       i.email, 
       LOWER(SPLIT_PART(i.email, '@', 2)) as "domain", 
       EXTRACT(DAY FROM (CURRENT_DATE - i."deletedAt"))::integer days 
FROM "users" as i
WHERE "deletedAt" IS NOT NULL`;

@ViewEntity({
    schema: 'public',
    name: 'user_to_delete_view',
    expression
})
export class UserToDeleteView
{
    @ViewColumn({ name: '_id' })
    public readonly _id: string;

    @ViewColumn({ name: 'email' })
    public readonly email: number;

    @ViewColumn({ name: 'domain' })
    public readonly domain: string;

    @ViewColumn({ name: 'days' })
    public readonly days: number;
}
