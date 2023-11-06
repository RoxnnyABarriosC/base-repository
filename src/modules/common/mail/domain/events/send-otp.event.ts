import { User } from '@modules/user/domain/entities';

export class SendOtpEvent
{
    constructor(
        public readonly user: User,
        public readonly otp: string
    )
    {}
}
