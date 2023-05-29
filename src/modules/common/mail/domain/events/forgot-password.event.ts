import { User } from '@modules/auth/user/domain/entities';

export class ForgotPasswordEvent
{
    constructor(
        public readonly user: User,
        public readonly urlConfirmationToken: string
    )
    {}
}
