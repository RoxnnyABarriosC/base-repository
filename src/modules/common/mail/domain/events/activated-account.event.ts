import { User } from '@modules/auth/user/domain/entities';

export class ActivatedAccountEvent
{
    constructor(
        public readonly user: User
    )
    {}
}
