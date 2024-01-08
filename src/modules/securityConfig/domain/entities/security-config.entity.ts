import { User } from '@modules/user/domain/entities';
import { BaseEntity } from '@shared/app/entities';
import { Exclude, Expose } from 'class-transformer';
import { OTPConfigType } from './otp-config.type';

@Exclude()
export class SecurityConfig extends BaseEntity
{
    @Expose() public otp: OTPConfigType;
    @Expose() public otpAttempts: number;
    @Expose() public requiredPassword: boolean;
    @Expose() public oldPassword: string;

    @Expose() public authAttempts: number;
    @Expose() public blockedTime: number;
    @Expose() public tempBlockedAt: Date;

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
