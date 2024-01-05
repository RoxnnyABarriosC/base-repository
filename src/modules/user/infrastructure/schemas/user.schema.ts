import { File } from '@modules/common/file/domain/entities';
import { Role } from '@modules/role/domain/entities';
import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { User } from '@modules/user/domain/entities';
import { GenderEnum } from '@modules/user/domain/enums';
import { BaseColumnsSchema } from '@shared/typeOrm/schemas';
import { EntitySchema } from 'typeorm';

export const UserSchema = new EntitySchema<User>({
    name: User.name,
    target: User,
    tableName: 'users',
    columns: {
        ...BaseColumnsSchema,
        userName: {
            type: String,
            default: 'user'
        },
        userNameId: {
            type: Number,
            unique: true,
            generated: 'increment'
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        phone: {
            type: String,
            unique: true,
            nullable: true
        },
        gender: {
            type: String,
            enum: GenderEnum,
            nullable: true
        },
        birthday: {
            type: Date,
            nullable: true
        },
        verify: {
            type: Boolean,
            default: false
        },
        onBoarding: {
            type: Boolean,
            default: true
        },
        password: {
            type: String,
            transformer: {
                from(val: string)
                {
                    return val;
                },
                to(val: Record<string, string>)
                {
                    return val.value;
                }
            }
        },
        passwordRequestedAt: {
            type: Date,
            nullable: true
        },
        enable: {
            type: Boolean,
            default: false
        },
        isSuperAdmin: {
            type: Boolean,
            default: false
        },
        blocked:{
            type: 'jsonb',
            default: '\'{"enable": false, "blockedAt": null}\'::jsonb'
        },
        permissions: {
            type: 'simple-array',
            nullable: true
        },
        facebookAccountId: {
            type: String,
            unique: true,
            nullable: true
        },
        googleAccountId: {
            type: String,
            unique: true,
            nullable: true
        },
        appleAccountId: {
            type: String,
            unique: true,
            nullable: true
        }
    },
    indices: [
        {
            name: 'IDX_USER_NAME',
            columns: ['userName', 'userNameId'],
            unique: true
        }
    ],
    checks: [
        {
            name: 'ON_BOARDING_CHECK',
            expression: `
              ("onBoarding" = true) OR
              ("onBoarding" = false AND phone IS NOT NULL AND gender IS NOT NULL AND birthday IS NOT NULL)
            `
        },
        {
            name: 'BLOCKED_USER_CHECK',
            expression: `
              ((blocked->>'enable')::boolean = false AND (blocked->>'blockedAt' IS NULL)) OR
              (
                (blocked->>'enable')::boolean = true AND
                (blocked->>'blockedAt' IS NULL OR (blocked->>'blockedAt')::timestamp IS NOT NULL)
              )
            `
        }
    ],
    relations: {
        roles: {
            type: 'many-to-many',
            target: Role.name,
            eager: true,
            joinTable: {
                name: 'users_has_roles',
                joinColumn: {
                    name: 'user_id'
                },
                inverseJoinColumn: {
                    name: 'role_id'
                }
            }
        },
        mainPicture: {
            type: 'one-to-one',
            target: File.name,
            joinColumn: true,
            nullable: true,
            eager: true
        },
        banner: {
            type: 'one-to-one',
            target: File.name,
            joinColumn: true,
            nullable: true,
            eager: true
        },
        securityConfig: {
            type: 'one-to-one',
            target: SecurityConfig.name,
            inverseSide: 'user',
            lazy: true
        }
    }
});
