import { User } from '@modules/auth/user/domain/entities';

export class ChangeForgotPasswordEvent
{
    constructor(
        public readonly user: User
    )
    {}
}
