import { User } from '@modules/user/domain/entities';

export class ResetPasswordEvent
{
    constructor(
        public readonly user: User,
        public readonly newPassword: string,
        public readonly urlConfirmationToken: string
    )
    {}
}
