import { User } from '@modules/auth/user/domain/entities';

export class ActivateAccountEvent
{
    constructor(
        public readonly user: User,
        public readonly urlConfirmationToken: string
    )
    {}
}
