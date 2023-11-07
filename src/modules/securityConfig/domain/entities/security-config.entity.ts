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

    @Expose() public requiredPassword: boolean;
    @Expose() public oldPassword: string;

    @Expose() public readonly user: Promise<User>;

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
