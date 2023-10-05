import { OTP } from '@modules/auth/otp/domain/entities/otp.entity';
import { User } from '@modules/auth/user/domain/entities';
import { BaseColumnsSchema } from '@shared/schemas';
import { EntitySchema } from 'typeorm';

export const OTPSchema = new EntitySchema<OTP>({
    name: OTP.name,
    target: OTP,
    tableName: 'otps',
    columns: {
        ...BaseColumnsSchema,
        config: {
            type: 'jsonb'
        }
    },
    relations: {
        user: {
            type: 'one-to-one',
            target: User.name,
            joinColumn: true,
            inverseSide: 'otp',
            onDelete: 'CASCADE',
            lazy: true
        }
    }
});
