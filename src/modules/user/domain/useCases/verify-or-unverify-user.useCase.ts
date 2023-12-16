import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { UserService } from '../services';

interface IVerifyOrUnverifyUserUseCaseProps {
    id: string;
    verify: boolean;
}

@Injectable()
export class VerifyOrUnverifyUserUseCase
{
    private readonly logger = new Logger(VerifyOrUnverifyUserUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly service: UserService
    )
    {}

    async handle({ id, verify }: IVerifyOrUnverifyUserUseCaseProps): Promise<ILocalMessage>
    {
        this.logger.log('Getting user...');

        const user = await this.repository.getOne({ id });

        this.logger.log(`Setting user verify: ${verify} ...`);

        user.verify = verify;

        this.logger.log('Updating user...');
        void this.repository.update(user);

        return SendLocalMessage(() =>
        {
            const key = 'messages.user';

            return verify ? key.concat('.verify') : key.concat('.unverify');
        });
    }
}
