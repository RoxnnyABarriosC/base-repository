import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';

declare interface IDeleteAccountUseCaseProps {
    id: string;
    deletePermanently?: boolean;
}

@Injectable()
export class DeleteAccountUseCase
{
    private readonly logger = new Logger(DeleteAccountUseCase.name);

    constructor(
        private readonly repository: UserRepository
    )
    {}

    async handle({ id }: IDeleteAccountUseCaseProps): Promise<ILocalMessage>
    {
        this.logger.log('Deleting user...');

        await this.repository.delete({ id, softDelete: true, withDeleted: true });

        return SendLocalMessage(() => 'messages.auth.deleteAccount');
    }
}


