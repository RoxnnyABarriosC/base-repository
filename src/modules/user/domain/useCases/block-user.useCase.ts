import { UserRepository } from '@modules/user/infrastructure/repositories';
import { BlockUserDto } from '@modules/user/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { User } from '../entities';

interface IBlockUserUseCaseProps {
    id: string;
    dto: BlockUserDto;
}

@Injectable()
export class BlockUserUseCase
{
    private readonly logger = new Logger(BlockUserUseCase.name);

    constructor(
        private readonly repository: UserRepository
    )
    {}

    // TODO: notificar al usuario via email que su cuenta ha sido bloqueada
    async handle({ id, dto }: IBlockUserUseCaseProps): Promise<ILocalMessage>
    {
        this.logger.log('Getting user...');

        const user = await this.repository.exist<User>({ condition: { _id: id }, select: ['_id', 'blocked'], initThrow: true });

        user.partialBuild(dto, { allowNull: true, _this: user.blocked });

        await this.repository.update(user);

        return SendLocalMessage(() =>
        {
            const key = 'messages.user';

            return dto.enable ? key.concat('.block') : key.concat('.unblock');
        });
    }
}
