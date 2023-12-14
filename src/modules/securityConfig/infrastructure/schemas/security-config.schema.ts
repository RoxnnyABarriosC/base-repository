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
        otpAttempts: {
            type: Number,
            default: 0
        },
        oldPassword: {
            type: String,
            nullable: true
        },
        requiredPassword: {
            type: Boolean,
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
    },
    checks: [
        {
            name: 'REQUIRED_PASSWORD_CHECK',
            expression: '"requiredPassword" = true OR (otp->\'phone\'->>\'enable\' = \'true\' OR otp->\'email\'->>\'enable\' = \'true\')'
        }
    ]
});
