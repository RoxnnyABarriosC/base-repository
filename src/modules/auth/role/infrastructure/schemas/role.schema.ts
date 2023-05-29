import { BaseColumnsSchema } from '@shared/schemas';
import { EntitySchema } from 'typeorm';
import { Role } from '../../domain/entities/role.entity';

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
            default: true
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
