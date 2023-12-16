import { ChangeMyPasswordDto } from '@modules/auth/presentation/dtos';
import { SecurityConfigService } from '@modules/securityConfig/domain/services';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { AuthService } from '../services';

declare interface IChangeMyPasswordUseCaseProps {
    dto: ChangeMyPasswordDto,
    authUser: User
}

@Injectable()
export class ChangeMyPasswordUseCase
{
    private readonly logger = new Logger(ChangeMyPasswordUseCase.name);

    constructor(
        private readonly service: AuthService,
        private readonly userService: UserService,
        private readonly securityConfigService: SecurityConfigService,
        private readonly userRepository: UserRepository
    )
    { }

    async handle({ dto, authUser }: IChangeMyPasswordUseCaseProps): Promise<ILocalMessage>
    {
        void await this.service.checkPassword(dto.currentPassword.toString(), authUser.password.toString());

        await this.securityConfigService.checkOldPassword(authUser, dto.password);

        authUser.password = await this.userService.preparePassword(dto.password);

        void await this.userRepository.update(authUser);

        return SendLocalMessage(() => 'messages.auth.changeMyPassword');
    }
}
