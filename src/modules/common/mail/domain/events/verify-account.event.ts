import { User } from '@modules/user/domain/entities';

export class VerifyAccountEvent
{
    constructor(
        public readonly user: User,
        public readonly urlConfirmationToken: string
    )
    {}
}
