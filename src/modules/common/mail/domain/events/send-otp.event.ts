import { User } from '@modules/auth/user/domain/entities';

export class SendOtpEvent
{
    constructor(
        public readonly user: User,
        public readonly otp: string
    )
    {}
}
