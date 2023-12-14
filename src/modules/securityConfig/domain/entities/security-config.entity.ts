import { OTPConfigType } from '@modules/securityConfig/domain/entities/otp-config.type';
import { User } from '@modules/user/domain/entities';
import { BaseEntity } from '@shared/entities/base.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SecurityConfig extends BaseEntity
{
    @Expose() public otp: OTPConfigType = {
        phone: {
            enable: false,
            providers: []
        },
        email: {
            enable: false
        }
    };

    @Expose() public otpAttempts  = 0;
    @Expose() public requiredPassword: boolean;
    @Expose() public oldPassword: string;

    @Expose() public readonly user: Promise<User>;

    public readonly __user__: User;

    constructor(data?: Partial<SecurityConfig>, validate?: boolean)
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
