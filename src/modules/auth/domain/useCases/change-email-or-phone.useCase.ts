import { ChangeMyEmailDto, ChangeMyPhoneDto } from '@modules/auth/presentation/dtos';
import { OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';
import { OTPNotFoundException } from '@modules/securityConfig/domain/exceptions';
import { OTPService } from '@modules/securityConfig/domain/services';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';

declare interface IChangeMyEmailOrPhoneUseCaseProps {
    dto: ChangeMyEmailDto | ChangeMyPhoneDto,
    authUser: User,
    target: OTPTargetConfigEnum
}

@Injectable()
export class ChangeMyEmailOrPhoneUseCase
{
    private readonly logger = new Logger(ChangeMyEmailOrPhoneUseCase.name);

    constructor(
        private readonly userService: UserService,
        private readonly userRepository: UserRepository,
        private readonly otpService: OTPService
    )
    { }

    async handle({ dto, authUser, target }: IChangeMyEmailOrPhoneUseCaseProps): Promise<ILocalMessage>
    {
        const partial  = {
            [target]: dto[target]
        };

        authUser.partialBuild(partial);

        void await this.userService.validate(authUser);

        const otpValid = await this.otpService.verifyOTP(dto[target], dto.otpCode);

        if (!otpValid)
        {
            throw new OTPNotFoundException(target);
        }

        await this.userRepository.update(authUser);

        return SendLocalMessage(() => `messages.user.${target}.updated`);
    }
}
