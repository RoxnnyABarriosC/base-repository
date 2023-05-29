import { MeDto } from '@modules/auth/index/presentation/dtos/me.dto';
import { User } from '@modules/auth/user/domain/entities';
import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
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

    async handle({ dto, authUser }: Props): Promise<User>
    {
        authUser.build(dto);

        void await this.service.validate(authUser);

        return await this.repository.update(authUser) as User;
    }
}
