import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface IGetFormConfigUseCaseProps {
    emailOrPhone: string;
}

@Injectable()
export class GetFormConfigUseCase
{
    private readonly logger = new Logger(GetFormConfigUseCase.name);

    constructor(
        private readonly repository: SecurityConfigRepository,
        private readonly userRepository: SecurityConfigRepository
    )
    {}

    async handle({ emailOrPhone }: IGetFormConfigUseCaseProps)
    {
        return await this.repository.getConfigOfEmailOrPhoneV2(emailOrPhone);
    }
}
