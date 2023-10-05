import { OtpConfigType } from '@modules/auth/otp/domain/entities/otp-config.type';
import { User } from '@modules/auth/user/domain/entities';
import { BaseEntity } from '@shared/entities/base.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OTP extends BaseEntity
{
    @Expose() public config: OtpConfigType = {
        phone: {
            enable: false,
            value: null,
            expireTime: null,
            providers: [],
            attempts: 0
        },
        email: {
            enable: false,
            value: null,
            expireTime: null,
            attempts: 0
        }
    };
    @Expose() public user: User;

    constructor(data?: Partial<OTP>, validate?: boolean)
    {
        super();
        this.build(data, validate);
    }
}
