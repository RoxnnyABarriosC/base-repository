import { OtpConfigType } from '@modules/otp/domain/entities/otp-config.type';
import { User } from '@modules/user/domain/entities';
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
    @Expose() public readonly user: Promise<User>;

    constructor(data?: Partial<OTP>, validate?: boolean)
    {
        super();
        this.build(data, validate);
    }

    set User(user: User)
    {
        Object.assign(this, {
            __user__: user, user
        });
    }
}
