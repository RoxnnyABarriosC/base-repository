import { User } from '@modules/user/domain/entities';

export class ActivatedAccountEvent
{
    constructor(
        public readonly user: User
    )
    {}
}
