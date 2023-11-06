import { File } from '@modules/common/file/domain/entities';
import { OTP } from '@modules/otp/domain/entities';
import { Role } from '@modules/role/domain/entities';
import { User } from '@modules/user/domain/entities';
import { GenderEnum } from '@modules/user/domain/enums';
import { BaseColumnsSchema } from '@shared/schemas';
import { EntitySchema } from 'typeorm';

export const UserSchema = new EntitySchema<User>({
    name: User.name,
    target: User,
    tableName: 'users',
    columns: {
        ...BaseColumnsSchema,
        userName: {
            type: String,
            unique: true
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
            unique: true
        },
        gender: {
            type: String,
            enum: GenderEnum
        },
        birthday: {
            type: Date
        },
        verify: {
            type: Boolean,
            default: false
        },
        firstLogin: {
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
        permissions: {
            type: 'simple-array',
            nullable: true
        }
    },
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
        otp: {
            type: 'one-to-one',
            target: OTP.name,
            inverseSide: 'user',
            lazy: true
        }
    }
});
