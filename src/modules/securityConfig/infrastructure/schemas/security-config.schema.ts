import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { User } from '@modules/user/domain/entities';
import { BaseColumnsSchema } from '@shared/schemas';
import { EntitySchema } from 'typeorm';

export const SecurityConfigSchema = new EntitySchema<SecurityConfig>({
    name: SecurityConfig.name,
    target: SecurityConfig,
    tableName: 'security_configs',
    columns: {
        ...BaseColumnsSchema,
        otp: {
            type: 'jsonb'
        },
        oldPassword: {
            type: 'varchar',
            nullable: true
        },
        requiredPassword: {
            type: 'boolean',
            default: true
        }
    },
    relations: {
        user: {
            type: 'one-to-one',
            target: User.name,
            joinColumn: true,
            inverseSide: 'securityConfig',
            onDelete: 'CASCADE',
            lazy: true
        }
    }
});
