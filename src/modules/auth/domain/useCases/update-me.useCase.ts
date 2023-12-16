import { MeDto } from '@modules/auth/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

declare interface IUpdateMeUseCaseProps {
    dto: MeDto;
    authUser: User
}

@Injectable()
export class UpdateMeUseCase
{
    private readonly logger = new Logger(UpdateMeUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly service: UserService
    )
    { }

    async handle({ dto, authUser }: IUpdateMeUseCaseProps): Promise<User>
    {
        authUser.partialBuild(dto);

        void await this.service.validate(authUser);

        return await this.repository.update(authUser) as User;
    }
}
