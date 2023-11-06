import { User } from '@modules/user/domain/entities';

export class ForgotPasswordEvent
{
    constructor(
        public readonly user: User,
        public readonly urlConfirmationToken: string
    )
    {}
}
