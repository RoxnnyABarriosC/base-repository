import { User } from '@modules/user/domain/entities';

export class VerifiedAccountEvent
{
    constructor(
        public readonly user: User
    )
    {}
}
