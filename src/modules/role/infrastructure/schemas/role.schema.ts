import { Role } from '@modules/role/domain/entities';
import { BaseColumnsSchema } from '@shared/typeOrm/schemas';
import { EntitySchema } from 'typeorm';

export const RoleSchema = new EntitySchema<Role>({
    name: 'Role',
    target: Role,
    tableName: 'roles',
    columns: {
        ...BaseColumnsSchema,
        name: {
            type: String,
            unique: true
        },
        slug: {
            type: String,
            unique: true
        },
        enable: {
            type: Boolean,
            default: false
        },
        ofSystem: {
            type: Boolean,
            default: false
        },
        permissions: {
            type: 'simple-array',
            nullable: true
        },
        allowedViews: {
            type: 'simple-array',
            nullable: true
        },
        scopeConfig: {
            type: 'jsonb',
            nullable: true
        }
    }
});
