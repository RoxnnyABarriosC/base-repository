import { User } from '@modules/user/domain/entities';

export class ChangeForgotPasswordEvent
{
    constructor(
        public readonly user: User
    )
    {}
}
